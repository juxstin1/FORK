import * as path from "path";
import { readFeatures, readPersonas, readRequirements, readProjectConfig } from "../lib/artifacts.js";
import { getRenderedPrompt } from "../lib/prompts/index.js";
import { runOpenRouter } from "../server/openrouter.js";
import { runDesignStage } from "./design.js";
import type { DesignSpec } from "./design.js";

export interface DesignGenerateInput {
    projectDir: string;
    model?: string;
}

export interface DesignGenerateResult {
    success: boolean;
    design: DesignSpec | null;
    path: string | null;
    error?: string;
    usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    readFrom: {
        projectDir: string;
        requirementsPath: string;
        featuresPath: string;
        personasPath: string;
        projectConfigPath: string;
        requirementsFound: boolean;
        featuresFound: boolean;
        personasFound: boolean;
    };
    wroteTo?: {
        designJsonPath: string;
    };
}

function stripMarkdownFences(text: string): string {
    const trimmed = text.trim();
    const fence = /^```[a-zA-Z0-9_-]*\s*([\s\S]*?)\s*```$/m;
    const m = fence.exec(trimmed);
    return m ? m[1].trim() : trimmed;
}

function extractFirstJsonObject(text: string): { jsonText: string; method: string } {
    const cleaned = stripMarkdownFences(text);

    // Fast path: whole string is JSON
    try {
        JSON.parse(cleaned);
        return { jsonText: cleaned, method: "whole" };
    } catch {
        // continue
    }

    // Recovery: find first '{' and last '}' and attempt parse
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
        throw new Error("No JSON object found in model output.");
    }

    const slice = cleaned.slice(start, end + 1).trim();
    try {
        JSON.parse(slice);
        return { jsonText: slice, method: "slice" };
    } catch (e) {
        const head = cleaned.slice(0, 240).replace(/\s+/g, " ").trim();
        const tail = cleaned.slice(Math.max(0, cleaned.length - 240)).replace(/\s+/g, " ").trim();
        const msg = e instanceof Error ? e.message : String(e);
        throw new Error(
            `Failed to parse JSON from model output (${msg}). ` +
                `Tried whole + slice extraction. Output head="${head}" tail="${tail}"`
        );
    }
}

export async function runDesignGenerate(input: DesignGenerateInput): Promise<DesignGenerateResult> {
    const { projectDir, model = "qwen/qwen3-coder-next" } = input;

    // Canonical artifact paths for telemetry
    const rorkDir = path.join(projectDir, ".rork");
    const readFrom = {
        projectDir,
        requirementsPath: path.join(rorkDir, "requirements.md"),
        featuresPath: path.join(rorkDir, "features.json"),
        personasPath: path.join(rorkDir, "personas", "personas.json"),
        projectConfigPath: path.join(rorkDir, "project.json"),
        requirementsFound: false,
        featuresFound: false,
        personasFound: false,
    };

    // Read upstream artifacts
    const features = readFeatures(projectDir);
    readFrom.featuresFound = features !== null && features.length > 0;
    if (!features || features.length === 0) {
        return { success: false, design: null, path: null, error: "Missing features. Expected .rork/features.json", readFrom };
    }

    const requirements = readRequirements(projectDir);
    readFrom.requirementsFound = requirements !== null;
    if (!requirements) {
        return { success: false, design: null, path: null, error: "Missing requirements. Expected .rork/requirements.md", readFrom };
    }

    const personas = readPersonas(projectDir);
    readFrom.personasFound = personas !== null;

    const project = readProjectConfig(projectDir);
    const tier = project?.tier ?? "free";

    // Render the v2 design prompt
    const rendered = getRenderedPrompt("design.generate.v2", {
        requirements,
        features: JSON.stringify(features, null, 2),
        personas: personas ? JSON.stringify(personas, null, 2) : "No personas generated. Design for a general audience.",
        tier,
    });

    // Call OpenRouter
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [];
    if (rendered.system) {
        messages.push({ role: "system", content: rendered.system });
    }
    messages.push({ role: "user", content: rendered.user });

    const result = await runOpenRouter({
        model,
        messages,
        temperature: 0.2,
        max_tokens: rendered.maxOutputTokens ?? 4000,
    });

    // Robust JSON extraction
    let design: DesignSpec;
    try {
        const { jsonText } = extractFirstJsonObject(result.text);
        design = JSON.parse(jsonText) as DesignSpec;
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return {
            success: false,
            design: null,
            path: null,
            error: `Design JSON parse failed: ${msg}`,
            usage: result.usage,
            readFrom,
        };
    }

    // Save via existing design stage
    const saveResult = await runDesignStage({ projectDir, design });

    return {
        success: saveResult.success,
        design,
        path: saveResult.path,
        usage: result.usage,
        readFrom,
        wroteTo: { designJsonPath: saveResult.path },
    };
}
