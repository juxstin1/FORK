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
}

export async function runDesignGenerate(input: DesignGenerateInput): Promise<DesignGenerateResult> {
    const { projectDir, model = "qwen/qwen3-coder-next" } = input;

    // Read upstream artifacts
    const features = readFeatures(projectDir);
    if (!features) {
        return { success: false, design: null, path: null, error: "No features.json found. Run IDEA stage first." };
    }

    const requirements = readRequirements(projectDir);
    if (!requirements) {
        return { success: false, design: null, path: null, error: "No requirements.md found. Run IDEA stage first." };
    }

    const personas = readPersonas(projectDir);
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

    // Parse the JSON response
    let design: DesignSpec;
    try {
        // Strip markdown fences if present
        let text = result.text.trim();
        if (text.startsWith("```")) {
            text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }
        design = JSON.parse(text) as DesignSpec;
    } catch (err) {
        return {
            success: false,
            design: null,
            path: null,
            error: `Failed to parse design JSON from LLM response: ${err}`,
            usage: result.usage,
        };
    }

    // Save via existing design stage
    const saveResult = await runDesignStage({ projectDir, design });

    return {
        success: saveResult.success,
        design,
        path: saveResult.path,
        usage: result.usage,
    };
}
