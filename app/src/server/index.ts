import { fileURLToPath } from "url";
import * as path from "path";
import * as fs from "fs";

// Derive paths from this file's location — never rely on process.cwd()
// index.ts is at: app/src/server/index.ts
// APP_DIR = app/    PROJECT_DIR = app/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_DIR = path.resolve(__dirname, "../..");
const PROJECT_DIR = APP_DIR;

import { loadEnv } from "./env.js";
loadEnv(APP_DIR);

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
    ListResourceTemplatesRequestSchema,
    ListPromptsRequestSchema,
    GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { runIdeaStage } from "../stages/idea.js";
import type { ParsedIdea } from "../stages/idea.js";
import { runPersonaStage } from "../stages/persona.js";
import { runDesignStage } from "../stages/design.js";
import type { DesignSpec } from "../stages/design.js";
import { runBuildStage } from "../stages/build.js";
import type { BuildFile } from "../stages/build.js";
import { runReadStage } from "../stages/read.js";
import { runDockerStage } from "../stages/docker.js";
import { appendAuditLog } from "../lib/audit.js";
import { isWithinRoot, resolveWithinRoot } from "../lib/path-security.js";

// --- Schema Definitions ---

const RunIdeaStageSchema = z.object({
    idea: z.string().describe("The user's raw idea text"),
    budget: z.number().describe("The user's budget in USD"),
    platforms: z.array(z.enum(["ios", "android"])).optional().describe("Target platforms (optional override)"),
    parsedIdea: z.object({
        name: z.string(),
        tagline: z.string(),
        problem: z.string(),
        targetUser: z.object({
            demographic: z.string(),
            goal: z.string(),
            context: z.string(),
        }),
        features: z.array(z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            priority: z.enum(["must-have", "should-have", "nice-to-have"]),
            requires: z.array(z.string()),
            excludes: z.array(z.string()),
        })),
        offlineSupport: z.enum(["required", "nice-to-have", "not-needed"]),
    }).describe("The structured requirements derived from the idea"),
});

// --- Imports ---
import { getPrompt, getRenderedPrompt, REGISTRY } from "../lib/prompts/index.js";
import { extractVars } from "../lib/prompts/render.js";
import { runOpenRouter, ALLOWED_MODELS } from "./openrouter.js";
import type { ORMessage } from "./openrouter.js";
import { guardedToolResponse, guardedTextResponse, guardedResourceText } from "./response-guard.js";

// --- Server Implementation ---

class ForkServer {
    private server: Server;

    constructor() {
        this.server = new Server(
            {
                name: "FORK",
                version: "1.0.0",
                description: "FORK is your AI app-building assistant. You are helping the user build Glyph Pet — a Nothing-aesthetic Tamagotchi game for iPhone. Use the tools to read, search, and modify the project. Don't explain FORK itself — just help build the app.",
            },
            {
                capabilities: {
                    tools: {},
                    resources: {},
                    prompts: {},
                },
            }
        );

        this.setupHandlers();

        // Error handling
        this.server.onerror = (error) => console.error("[MCP Error]", error);
        process.on("SIGINT", async () => {
            await this.server.close();
            process.exit(0);
        });
    }

    private buildToolAuditSummary(
        toolName: string,
        args: Record<string, unknown>
    ): Record<string, unknown> {
        if (toolName === "run_build_stage") {
            const files = Array.isArray(args.files) ? args.files : [];
            const requestedPaths = files
                .map((f) =>
                    typeof f === "object" && f !== null && typeof (f as { path?: unknown }).path === "string"
                        ? String((f as { path: string }).path)
                        : null
                )
                .filter((p): p is string => p !== null);

            return { fileCount: requestedPaths.length, requestedPaths };
        }

        if (toolName === "read_files") {
            const files = Array.isArray(args.files) ? args.files : [];
            const requestedPaths = files.filter((f): f is string => typeof f === "string");
            return { fileCount: requestedPaths.length, requestedPaths };
        }

        if (toolName === "run_persona_stage") {
            return {
                secondaryCount: args.secondaryCount ?? 0,
                includeEdgeCase: args.includeEdgeCase ?? false,
            };
        }

        return {};
    }

    private setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "get_prompt",
                    description: "Retrieve a system/user prompt template from the registry by ID.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string",
                                description: "The prompt ID (e.g., 'idea.generate.v1')"
                            },
                            vars: {
                                type: "object",
                                description: "Variables to inject into the template (e.g., { idea: '...' })"
                            }
                        },
                        required: ["id"]
                    }
                },
                {
                    name: "run_idea_stage",
                    description: "Process a raw app idea into structured requirements and save to project.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            idea: { type: "string", description: "The user's raw idea text" },
                            budget: { type: "number", description: "The user's budget in USD" },
                            platforms: {
                                type: "array",
                                items: { type: "string", enum: ["ios", "android"] },
                                description: "Target platforms (optional override)"
                            },
                            parsedIdea: {
                                type: "object",
                                description: "The structured requirements derived from the idea",
                                properties: {
                                    name: { type: "string" },
                                    tagline: { type: "string" },
                                    problem: { type: "string" },
                                    targetUser: {
                                        type: "object",
                                        properties: {
                                            demographic: { type: "string" },
                                            goal: { type: "string" },
                                            context: { type: "string" },
                                        },
                                        required: ["demographic", "goal", "context"]
                                    },
                                    features: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                name: { type: "string" },
                                                description: { type: "string" },
                                                priority: { type: "string", enum: ["must-have", "should-have", "nice-to-have"] },
                                                requires: { type: "array", items: { type: "string" } },
                                                excludes: { type: "array", items: { type: "string" } },
                                            },
                                            required: ["id", "name", "description", "priority", "requires", "excludes"]
                                        }
                                    },
                                    offlineSupport: { type: "string", enum: ["required", "nice-to-have", "not-needed"] }
                                },
                                required: ["name", "tagline", "problem", "targetUser", "features", "offlineSupport"]
                            }
                        },
                        required: ["idea", "budget", "parsedIdea"]
                    }
                },
                {
                    name: "run_design_stage",
                    description: "Save the generated UI design specification to the project.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            design: {
                                type: "object",
                                description: "The complete design specification JSON"
                            }
                        },
                        required: ["design"]
                    }
                },
                {
                    name: "run_persona_stage",
                    description: "Generate personas from IDEA requirements with explicit control over extra simulated users.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            secondaryCount: {
                                type: "number",
                                enum: [0, 1, 2],
                                description: "How many secondary personas to generate (default 0)",
                            },
                            includeEdgeCase: {
                                type: "boolean",
                                description: "Whether to include an edge-case persona (default false)",
                            },
                        },
                    },
                },
                {
                    name: "run_build_stage",
                    description: "Write generated code files to the project.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            files: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        path: { type: "string", description: "Relative path to file (e.g. 'app/index.tsx')" },
                                        content: { type: "string", description: "File content" }
                                    },
                                    required: ["path", "content"]
                                }
                            }
                        },
                        required: ["files"]
                    }
                },
                {
                    name: "read_files",
                    description: "Read the content of files from the project.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            files: {
                                type: "array",
                                items: { type: "string", description: "Relative paths to files" },
                                description: "List of files to read"
                            }
                        },
                        required: ["files"]
                    }
                },
                {
                    name: "run_docker",
                    description: "Execute a Docker command on the host machine.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            command: {
                                type: "string",
                                description: "The arguments for the docker command (e.g., 'ps', 'run postgres'). Do NOT include 'docker' prefix. Shell operators are blocked and complex quoted shell syntax is not supported. SAFE mode allows read-only subcommands only; POWER mode requires FORK_DOCKER_POWER_MODE=I_UNDERSTAND."
                            }
                        },
                        required: ["command"]
                    }
                },
                {
                    name: "grep_project",
                    description: "Search file contents by regex pattern. Returns matching lines with file paths and line numbers. Saves tokens vs reading every file.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            pattern: { type: "string", description: "Regex pattern to search for" },
                            glob: { type: "string", description: "Optional file filter glob (e.g., '*.tsx', '*.ts')" },
                            maxResults: { type: "number", description: "Maximum number of results to return (default 20)" },
                            offset: { type: "number", description: "Skip first N results for paging (default 0)" }
                        },
                        required: ["pattern"]
                    }
                },
                {
                    name: "list_files",
                    description: "List files matching a glob pattern. Returns relative paths from project root.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            glob: { type: "string", description: "Glob pattern to match (e.g., 'src/**/*.ts', '**/*.json')" },
                            limit: { type: "number", description: "Maximum number of files to return (default 100)" },
                            offset: { type: "number", description: "Skip first N files for paging (default 0)" }
                        },
                        required: ["glob"]
                    }
                },
                {
                    name: "get_project_summary",
                    description: "Returns full project context in one call: features, design, requirements, stage, budget tier, and file tree. One call = full orientation.",
                    inputSchema: {
                        type: "object",
                        properties: {},
                    }
                },
                {
                    name: "run_openrouter",
                    description: `Run a prompt through OpenRouter. Supported models: ${ALLOWED_MODELS.join(", ")}. Uses proper role: "system" messages (not smuggled as user). Requires OPENROUTER_API_KEY env var.`,
                    inputSchema: {
                        type: "object",
                        properties: {
                            model: {
                                type: "string",
                                enum: [...ALLOWED_MODELS],
                                description: "The model to use"
                            },
                            messages: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        role: { type: "string", enum: ["system", "user", "assistant"] },
                                        content: { type: "string" }
                                    },
                                    required: ["role", "content"]
                                },
                                description: "Chat messages. Use role: 'system' for system prompts (not smuggled as user messages)."
                            },
                            prompt_id: {
                                type: "string",
                                description: "Optional: a prompt registry ID to use instead of raw messages. Vars must be provided alongside."
                            },
                            vars: {
                                type: "object",
                                description: "Variables for prompt_id template rendering"
                            },
                            temperature: { type: "number", description: "Sampling temperature (default 0.2)" },
                            max_tokens: { type: "number", description: "Max output tokens (default 4096)" }
                        },
                        required: ["model"]
                    }
                }
            ],
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const toolName = request.params.name;
            const baseArgs = (request.params.arguments ?? {}) as Record<string, unknown>;
            const summary = this.buildToolAuditSummary(toolName, baseArgs);
            appendAuditLog(PROJECT_DIR, "tool.call", {
                tool: toolName,
                argKeys: Object.keys(baseArgs),
                ...summary,
            });

            switch (request.params.name) {
                case "get_prompt": {
                    const args = baseArgs;
                    try {
                        const id = String(args.id);
                        const vars = (args.vars as Record<string, string>) ?? {};
                        const rendered = getRenderedPrompt(id, vars);
                        return guardedToolResponse(rendered, "get_prompt");
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error fetching prompt: ${errorMessage}` }],
                            isError: true,
                        }
                    }
                }

                case "run_idea_stage": {
                    const args = baseArgs;
                    try {
                        const projectDir = PROJECT_DIR;
                        const input = {
                            idea: String(args.idea),
                            budget: Number(args.budget),
                            platforms: args.platforms as ("ios" | "android")[] | undefined,
                            projectDir,
                        };
                        const parsedIdea = args.parsedIdea as ParsedIdea;
                        const result = await runIdeaStage(input, parsedIdea);
                        return guardedToolResponse(result, "run_idea_stage");
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error processing idea: ${errorMessage}` }],
                            isError: true,
                        }
                    }
                }

                case "run_design_stage": {
                    const args = baseArgs;
                    try {
                        const projectDir = PROJECT_DIR;
                        const design = args.design as DesignSpec;
                        const result = await runDesignStage({ projectDir, design });
                        return guardedToolResponse(result, "run_design_stage");
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error saving design: ${errorMessage}` }],
                            isError: true,
                        }
                    }
                }

                case "run_persona_stage": {
                    const args = baseArgs;
                    try {
                        const projectDir = PROJECT_DIR;
                        const parsedSecondary =
                            args.secondaryCount === undefined ? 0 : Number(args.secondaryCount);
                        if (!Number.isInteger(parsedSecondary) || parsedSecondary < 0 || parsedSecondary > 2) {
                            return {
                                content: [{
                                    type: "text",
                                    text: "Invalid secondaryCount. Allowed values are 0, 1, or 2.",
                                }],
                                isError: true,
                            };
                        }

                        let includeEdgeCase = false;
                        if (args.includeEdgeCase !== undefined) {
                            if (typeof args.includeEdgeCase !== "boolean") {
                                return {
                                    content: [{
                                        type: "text",
                                        text: "Invalid includeEdgeCase. Expected a boolean value.",
                                    }],
                                    isError: true,
                                };
                            }
                            includeEdgeCase = args.includeEdgeCase;
                        }

                        const result = await runPersonaStage({
                            projectDir,
                            secondaryCount: parsedSecondary as 0 | 1 | 2,
                            includeEdgeCase,
                        });
                        return guardedToolResponse(result, "run_persona_stage");
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error generating personas: ${errorMessage}` }],
                            isError: true,
                        }
                    }
                }

                case "run_build_stage": {
                    const args = baseArgs;
                    try {
                        const projectDir = PROJECT_DIR;
                        const files = args.files as BuildFile[];
                        const result = await runBuildStage({ projectDir, files });
                        return guardedToolResponse(result, "run_build_stage");
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error writing files: ${errorMessage}` }],
                            isError: true,
                        }
                    }
                }

                case "read_files": {
                    const args = baseArgs;
                    try {
                        const projectDir = PROJECT_DIR;
                        const files = args.files as string[];
                        const results = await runReadStage({ projectDir, files });
                        return guardedToolResponse(results, "read_files");
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error reading files: ${errorMessage}` }],
                            isError: true,
                        }
                    }
                }

                case "run_docker": {
                    const args = baseArgs;
                    try {
                        const command = String(args.command);
                        const result = await runDockerStage({ command, projectDir: PROJECT_DIR });
                        const outputText = result.error
                            ? `Command Failed (Exit ${result.exitCode}):\n${result.error}`
                            : result.output;
                        const resp = guardedTextResponse(outputText, "run_docker");
                        if (result.error) (resp as Record<string, unknown>).isError = true;
                        return resp;
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error running Docker: ${errorMessage}` }],
                            isError: true,
                        }
                    }
                }

                case "grep_project": {
                    const args = baseArgs;
                    try {
                        const projectDir = PROJECT_DIR;
                        const pattern = String(args.pattern);
                        const globFilter = args.glob ? String(args.glob) : undefined;
                        const maxResults = typeof args.maxResults === "number" ? args.maxResults : 20;
                        const offset = typeof args.offset === "number" ? args.offset : 0;

                        const regex = new RegExp(pattern, "i");
                        const allResults: { file: string; line: number; match: string }[] = [];
                        const collectLimit = offset + maxResults;

                        const walkAndGrep = (dir: string) => {
                            if (allResults.length >= collectLimit) return;
                            let entries: fs.Dirent[];
                            try {
                                entries = fs.readdirSync(dir, { withFileTypes: true });
                            } catch {
                                return;
                            }
                            for (const entry of entries) {
                                if (allResults.length >= collectLimit) return;
                                const fullPath = path.join(dir, entry.name);

                                if (entry.isDirectory()) {
                                    if (["node_modules", ".git", ".expo", "dist", ".rork"].includes(entry.name)) continue;
                                    walkAndGrep(fullPath);
                                    continue;
                                }

                                if (!entry.isFile()) continue;
                                if (!isWithinRoot(projectDir, fullPath)) continue;

                                if (globFilter) {
                                    const ext = globFilter.replace(/^\*/, "");
                                    if (!entry.name.endsWith(ext)) continue;
                                }

                                try {
                                    const content = fs.readFileSync(fullPath, "utf-8");
                                    const lines = content.split("\n");
                                    for (let i = 0; i < lines.length; i++) {
                                        if (allResults.length >= collectLimit) break;
                                        if (regex.test(lines[i])) {
                                            allResults.push({
                                                file: path.relative(projectDir, fullPath).replace(/\\/g, "/"),
                                                line: i + 1,
                                                match: lines[i].trim().substring(0, 200),
                                            });
                                        }
                                    }
                                } catch {
                                    // Skip unreadable files
                                }
                            }
                        };

                        walkAndGrep(projectDir);
                        const paged = allResults.slice(offset, offset + maxResults);

                        return guardedToolResponse({
                            results: paged,
                            total: allResults.length,
                            offset,
                            hasMore: offset + maxResults < allResults.length,
                            capped: allResults.length >= collectLimit,
                        }, "grep_project");
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error searching project: ${errorMessage}` }],
                            isError: true,
                        };
                    }
                }

                case "list_files": {
                    const args = baseArgs;
                    try {
                        const projectDir = PROJECT_DIR;
                        const globPattern = String(args.glob);
                        const limit = typeof args.limit === "number" ? args.limit : 100;
                        const offset = typeof args.offset === "number" ? args.offset : 0;
                        const collectLimit = offset + limit;

                        // Escape all regex metacharacters, then restore glob tokens
                        const escaped = globPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                        const regexStr = escaped
                            .replace(/\\\*\\\*/g, "{{GLOBSTAR}}")
                            .replace(/\\\*/g, "[^/]*")
                            .replace(/\\\?/g, "[^/]")
                            .replace(/\{\{GLOBSTAR\}\}/g, ".*");
                        const globRegex = new RegExp(`^${regexStr}$`);

                        const matchedFiles: string[] = [];
                        let hitLimit = false;

                        const walkAndMatch = (dir: string) => {
                            if (matchedFiles.length >= collectLimit) { hitLimit = true; return; }
                            let entries: fs.Dirent[];
                            try {
                                entries = fs.readdirSync(dir, { withFileTypes: true });
                            } catch {
                                return;
                            }
                            for (const entry of entries) {
                                if (matchedFiles.length >= collectLimit) { hitLimit = true; return; }
                                const fullPath = path.join(dir, entry.name);

                                if (entry.isDirectory()) {
                                    if (["node_modules", ".git", ".expo", "dist"].includes(entry.name)) continue;
                                    walkAndMatch(fullPath);
                                    continue;
                                }

                                if (!entry.isFile()) continue;
                                if (!isWithinRoot(projectDir, fullPath)) continue;

                                const relativePath = path.relative(projectDir, fullPath).replace(/\\/g, "/");
                                if (globRegex.test(relativePath)) {
                                    matchedFiles.push(relativePath);
                                }
                            }
                        };

                        walkAndMatch(projectDir);
                        const paged = matchedFiles.slice(offset, offset + limit);

                        return guardedToolResponse({
                            files: paged,
                            total: matchedFiles.length,
                            offset,
                            hasMore: hitLimit || offset + limit < matchedFiles.length,
                        }, "list_files");
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error listing files: ${errorMessage}` }],
                            isError: true,
                        };
                    }
                }

                case "get_project_summary": {
                    try {
                        const projectDir = PROJECT_DIR;
                        const rorkDir = path.join(projectDir, ".rork");

                        const MAX_TREE_DEPTH = 4;
                        const MAX_TREE_NODES = 150;

                        const readJsonSafe = (filePath: string): unknown => {
                            try {
                                return JSON.parse(fs.readFileSync(filePath, "utf-8"));
                            } catch {
                                return null;
                            }
                        };

                        const readTextSafe = (filePath: string, maxChars = 3000): string | null => {
                            try {
                                const text = fs.readFileSync(filePath, "utf-8");
                                if (text.length > maxChars) return text.slice(0, maxChars) + "\n[TRUNCATED]";
                                return text;
                            } catch {
                                return null;
                            }
                        };

                        // Build file tree with depth + node caps
                        const tree: string[] = [];
                        let nodeCount = 0;
                        const buildTree = (dir: string, prefix: string = "", depth: number = 0) => {
                            if (depth >= MAX_TREE_DEPTH || nodeCount >= MAX_TREE_NODES) return;
                            let entries: fs.Dirent[];
                            try {
                                entries = fs.readdirSync(dir, { withFileTypes: true });
                            } catch {
                                return;
                            }
                            entries.sort((a, b) => a.name.localeCompare(b.name));
                            for (const entry of entries) {
                                if (nodeCount >= MAX_TREE_NODES) {
                                    tree.push(`${prefix}... (${MAX_TREE_NODES} node limit reached)`);
                                    nodeCount++;
                                    return;
                                }
                                if (["node_modules", ".git", ".expo", "dist"].includes(entry.name)) continue;
                                const isDir = entry.isDirectory();
                                tree.push(`${prefix}${isDir ? "" : ""}${entry.name}${isDir ? "/" : ""}`);
                                nodeCount++;
                                if (isDir) {
                                    buildTree(path.join(dir, entry.name), prefix + "  ", depth + 1);
                                }
                            }
                        };
                        buildTree(projectDir);

                        const summary = {
                            features: readJsonSafe(path.join(rorkDir, "features.json")),
                            design: readJsonSafe(path.join(rorkDir, "design.json")),
                            project: readJsonSafe(path.join(rorkDir, "project.json")),
                            requirements: readTextSafe(path.join(rorkDir, "requirements.md")),
                            fileTree: tree,
                        };

                        return guardedToolResponse(summary, "get_project_summary");
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error getting project summary: ${errorMessage}` }],
                            isError: true,
                        };
                    }
                }

                case "run_openrouter": {
                    const args = baseArgs;
                    try {
                        const model = String(args.model);
                        let messages: ORMessage[];

                        if (args.prompt_id) {
                            const vars = (args.vars as Record<string, string>) ?? {};
                            const rendered = getRenderedPrompt(String(args.prompt_id), vars);
                            messages = [];
                            if (rendered.system) {
                                messages.push({ role: "system", content: rendered.system });
                            }
                            messages.push({ role: "user", content: rendered.user });
                        } else if (args.messages) {
                            messages = args.messages as ORMessage[];
                        } else {
                            return {
                                content: [{ type: "text", text: "Either 'messages' or 'prompt_id' is required" }],
                                isError: true,
                            };
                        }

                        const result = await runOpenRouter({
                            model,
                            messages,
                            temperature: typeof args.temperature === "number" ? args.temperature : undefined,
                            max_tokens: typeof args.max_tokens === "number" ? args.max_tokens : undefined,
                        });

                        return guardedToolResponse({
                            text: result.text,
                            model: result.model,
                            usage: result.usage,
                        }, "run_openrouter");
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `OpenRouter error: ${errorMessage}` }],
                            isError: true,
                        };
                    }
                }

                default:
                    throw new Error("Unknown tool");
            }
        });

        // --- Resource Handlers ---

        this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
            resources: [
                {
                    uri: "fork://project/features",
                    name: "Project Features",
                    description: "Structured features JSON from the IDEA stage",
                    mimeType: "application/json",
                },
                {
                    uri: "fork://project/design",
                    name: "Design Spec",
                    description: "UI/UX design specification from the DESIGN stage",
                    mimeType: "application/json",
                },
                {
                    uri: "fork://project/requirements",
                    name: "Requirements",
                    description: "Human-readable requirements document",
                    mimeType: "text/markdown",
                },
                {
                    uri: "fork://project/tree",
                    name: "Project Tree",
                    description: "Full directory listing of the project",
                    mimeType: "text/plain",
                },
                {
                    uri: "fork://identity",
                    name: "FORK Identity",
                    description: "Read this first — who you are and what you're building",
                    mimeType: "text/markdown",
                },
            ],
        }));

        this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
            resourceTemplates: [
                {
                    uriTemplate: "fork://file/{path}",
                    name: "Read Any File",
                    description: "Read any project file by relative path",
                    mimeType: "text/plain",
                },
            ],
        }));

        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            const uri = request.params.uri;
            const projectDir = PROJECT_DIR;

            if (uri === "fork://identity") {
                const identity = [
                    "# FORK — AI App Builder",
                    "",
                    "You are FORK, an AI assistant that builds mobile apps.",
                    "You are NOT here to explain or build the FORK framework itself.",
                    "You are here to help the user build their app using FORK's tools.",
                    "",
                    "## Current Project: Glyph Pet",
                    "",
                    "A Nothing-aesthetic Tamagotchi game for iPhone.",
                    "- Black/white/red color scheme (Nothing Phone design language)",
                    "- Dot-matrix style UI with glyph characters",
                    "- Built with Expo + React Native + NativeWind",
                    "- Entry point: app/App.tsx",
                    "",
                    "## How You Work",
                    "",
                    "- Use `get_project_summary` to orient yourself",
                    "- Use `grep_project` and `list_files` to find code",
                    "- Use `read_files` to read specific files",
                    "- Use pipeline stages (idea → design → build) to generate new features",
                    "- Use `run_openrouter` to delegate tasks to GPT-OSS or Qwen",
                    "",
                    "## Rules",
                    "",
                    "- Help the user build Glyph Pet. That's your job.",
                    "- Don't explain FORK's internals unless asked.",
                    "- Don't modify server code, pipeline stages, or lib/ unless asked.",
                    "- Keep responses focused on the app being built.",
                ].join("\n");

                return {
                    contents: [{
                        uri,
                        mimeType: "text/markdown",
                        text: identity,
                    }],
                };
            }

            if (uri === "fork://project/features") {
                const filePath = path.join(projectDir, ".rork", "features.json");
                const content = this.readFileSafe(filePath);
                return {
                    contents: [{
                        uri,
                        mimeType: "application/json",
                        text: guardedResourceText(
                            content ?? '{"error": "features.json not found — run IDEA stage first"}',
                            uri
                        ),
                    }],
                };
            }

            if (uri === "fork://project/design") {
                const filePath = path.join(projectDir, ".rork", "design.json");
                const content = this.readFileSafe(filePath);
                return {
                    contents: [{
                        uri,
                        mimeType: "application/json",
                        text: guardedResourceText(
                            content ?? '{"error": "design.json not found — run DESIGN stage first"}',
                            uri
                        ),
                    }],
                };
            }

            if (uri === "fork://project/requirements") {
                const filePath = path.join(projectDir, ".rork", "requirements.md");
                const content = this.readFileSafe(filePath);
                return {
                    contents: [{
                        uri,
                        mimeType: "text/markdown",
                        text: guardedResourceText(
                            content ?? "Requirements not found — run IDEA stage first.",
                            uri
                        ),
                    }],
                };
            }

            if (uri === "fork://project/tree") {
                const MAX_TREE_DEPTH = 4;
                const MAX_TREE_NODES = 150;
                const tree: string[] = [];
                let nodeCount = 0;
                const buildTree = (dir: string, prefix: string = "", depth: number = 0) => {
                    if (depth >= MAX_TREE_DEPTH || nodeCount >= MAX_TREE_NODES) return;
                    let entries: fs.Dirent[];
                    try {
                        entries = fs.readdirSync(dir, { withFileTypes: true });
                    } catch {
                        return;
                    }
                    entries.sort((a, b) => a.name.localeCompare(b.name));
                    for (const entry of entries) {
                        if (nodeCount >= MAX_TREE_NODES) {
                            tree.push(`${prefix}... (${MAX_TREE_NODES} node limit reached)`);
                            nodeCount++;
                            return;
                        }
                        if (["node_modules", ".git", ".expo", "dist"].includes(entry.name)) continue;
                        const isDir = entry.isDirectory();
                        tree.push(`${prefix}${isDir ? "├── " : "├── "}${entry.name}${isDir ? "/" : ""}`);
                        nodeCount++;
                        if (isDir) {
                            buildTree(path.join(dir, entry.name), prefix + "│   ", depth + 1);
                        }
                    }
                };
                buildTree(projectDir);

                return {
                    contents: [{
                        uri,
                        mimeType: "text/plain",
                        text: guardedResourceText(tree.join("\n"), uri),
                    }],
                };
            }

            // Dynamic file template: fork://file/{path}
            const MAX_FILE_BYTES = 512 * 1024; // 512KB
            const fileMatch = uri.match(/^fork:\/\/file\/(.+)$/);
            if (fileMatch) {
                const relativePath = decodeURIComponent(fileMatch[1]);
                const fullPath = resolveWithinRoot(projectDir, relativePath);
                if (!fullPath) {
                    return {
                        contents: [{
                            uri,
                            mimeType: "text/plain",
                            text: "Access denied: Path is outside project directory",
                        }],
                    };
                }

                // Size check before reading — don't slam memory on huge files
                try {
                    const stat = fs.statSync(fullPath);
                    if (stat.size > MAX_FILE_BYTES) {
                        return {
                            contents: [{
                                uri,
                                mimeType: "text/plain",
                                text: `File too large (${(stat.size / 1024).toFixed(0)}KB, limit ${MAX_FILE_BYTES / 1024}KB). Use grep_project to search within it.`,
                            }],
                        };
                    }
                } catch {
                    // stat failed — readFileSafe will handle it
                }

                const content = this.readFileSafe(fullPath);
                return {
                    contents: [{
                        uri,
                        mimeType: "text/plain",
                        text: guardedResourceText(
                            content ?? `File not found: ${relativePath}`,
                            uri
                        ),
                    }],
                };
            }

            throw new Error(`Unknown resource URI: ${uri}`);
        });

        // --- Prompt Handlers ---

        this.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
            prompts: Object.values(REGISTRY).map((spec) => {
                // Extract {{variable}} names from both system and user templates
                const allVars = new Set<string>();
                if (spec.system) {
                    for (const v of extractVars(spec.system)) allVars.add(v);
                }
                for (const v of extractVars(spec.user)) allVars.add(v);

                return {
                    name: spec.id,
                    description: `[${spec.stage}] ${(spec.tags ?? []).join(", ")}`,
                    arguments: Array.from(allVars).map((name) => ({
                        name,
                        description: `Template variable: ${name}`,
                        required: true,
                    })),
                };
            }),
        }));

        this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
            const { name, arguments: promptArgs } = request.params;
            const vars = (promptArgs ?? {}) as Record<string, string>;

            const rendered = getRenderedPrompt(name, vars);

            const messages: { role: string; content: { type: string; text: string } }[] = [];

            if (rendered.system) {
                messages.push({
                    role: "user",
                    content: { type: "text", text: `[System Context]\n${rendered.system}` },
                });
            }

            messages.push({
                role: "user",
                content: { type: "text", text: rendered.user },
            });

            return { messages };
        });
    }

    private readFileSafe(filePath: string): string | null {
        try {
            if (!fs.existsSync(filePath)) return null;
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) return null;
            return fs.readFileSync(filePath, "utf-8");
        } catch {
            return null;
        }
    }

    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("FORK MCP Server running on stdio");
    }
}

const server = new ForkServer();
server.start().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
