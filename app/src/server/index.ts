import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import * as path from "path";
import { runIdeaStage } from "../stages/idea.js";
import type { ParsedIdea } from "../stages/idea.js";
import { runDesignStage } from "../stages/design.js";
import type { DesignSpec } from "../stages/design.js";
import { runBuildStage } from "../stages/build.js";
import type { BuildFile } from "../stages/build.js";
import { runReadStage } from "../stages/read.js";
import { runDockerStage } from "../stages/docker.js";

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
import { getPrompt, getRenderedPrompt } from "../lib/prompts/index.js";

// --- Server Implementation ---

class ForkServer {
    private server: Server;

    constructor() {
        this.server = new Server(
            {
                name: "fork-server",
                version: "1.0.0",
            },
            {
                capabilities: {
                    tools: {},
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
                                description: "The arguments for the docker command (e.g., 'ps', 'run postgres'). Do NOT include 'docker' prefix."
                            }
                        },
                        required: ["command"]
                    }
                }
            ],
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case "get_prompt": {
                    const args = request.params.arguments ?? {};
                    try {
                        const id = String(args.id);
                        const vars = (args.vars as Record<string, string>) ?? {};

                        // If vars are provided, render it. If not, just get the spec (raw).
                        // But getRenderedPrompt handles both (empty vars leaves placeholders or just works if none needed).
                        // Actually getRenderedPrompt throws if strict. let's just use it and catch or use the raw spec.

                        const rendered = getRenderedPrompt(id, vars);
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: JSON.stringify(rendered, null, 2),
                                },
                            ],
                        };
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error fetching prompt: ${errorMessage}` }],
                            isError: true,
                        }
                    }
                }

                case "run_idea_stage": {
                    const args = request.params.arguments ?? {};
                    // Validate args using Zod (optional but recommended for runtime safety)
                    // For now, we cast to expected type for speed, relying on LLM to follow schema

                    try {
                        // We need the project root. Assuming we run from 'app' folder, project root is '..'
                        // But actually, run_idea_stage expects projectDir.
                        // We'll use the current working directory as the project root if running from app root.
                        const projectDir = path.resolve(process.cwd(), "..");

                        const input = {
                            idea: String(args.idea),
                            budget: Number(args.budget),
                            platforms: args.platforms as ("ios" | "android")[] | undefined,
                            projectDir: projectDir
                        };

                        const parsedIdea = args.parsedIdea as ParsedIdea;

                        const result = await runIdeaStage(input, parsedIdea);

                        return {
                            content: [
                                {
                                    type: "text",
                                    text: JSON.stringify(result, null, 2),
                                },
                            ],
                        };
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error processing idea: ${errorMessage}` }],
                            isError: true,
                        }
                    }
                }

                case "run_design_stage": {
                    const args = request.params.arguments ?? {};
                    try {
                        // Project root assumption again
                        const projectDir = path.resolve(process.cwd(), "..");
                        const design = args.design as DesignSpec;

                        const result = await runDesignStage({ projectDir, design });

                        return {
                            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
                        };
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error saving design: ${errorMessage}` }],
                            isError: true,
                        }
                    }
                }

                case "run_build_stage": {
                    const args = request.params.arguments ?? {};
                    try {
                        const projectDir = path.resolve(process.cwd(), "..");
                        const files = args.files as BuildFile[];

                        const result = await runBuildStage({ projectDir, files });

                        return {
                            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
                        };
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error writing files: ${errorMessage}` }],
                            isError: true,
                        }
                    }
                }

                case "read_files": {
                    const args = request.params.arguments ?? {};
                    try {
                        const projectDir = path.resolve(process.cwd(), "..");
                        const files = args.files as string[];

                        const results = await runReadStage({ projectDir, files });

                        return {
                            content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
                        };
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error reading files: ${errorMessage}` }],
                            isError: true,
                        }
                    }
                }

                case "run_docker": {
                    const args = request.params.arguments ?? {};
                    try {
                        const command = String(args.command);
                        // Optional: strict cwd

                        const result = await runDockerStage({ command });

                        const outputText = result.error
                            ? `Command Failed (Exit ${result.exitCode}):\n${result.error}`
                            : result.output;

                        return {
                            content: [{ type: "text", text: outputText }],
                            isError: !!result.error
                        };
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        return {
                            content: [{ type: "text", text: `Error running Docker: ${errorMessage}` }],
                            isError: true,
                        }
                    }
                }

                default:
                    throw new Error("Unknown tool");
            }
        });
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
