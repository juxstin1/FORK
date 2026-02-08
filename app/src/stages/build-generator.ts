import { readDesign, readProjectConfig } from "../lib/artifacts.js";
import { getRenderedPrompt } from "../lib/prompts/index.js";
import { runOpenRouter } from "../server/openrouter.js";
import { runBuildStage } from "./build.js";
import type { BuildFile } from "./build.js";
import { validateBuildFiles } from "./build-validator.js";

export interface BuildGenerateInput {
    projectDir: string;
    model?: string;
    screenIds?: string[];
    componentIds?: string[];
}

export interface BuildGenerateResult {
    success: boolean;
    files: BuildFile[];
    written: string[];
    errors: string[];
    validation: { file: string; issues: string[] }[];
    usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

function extractCode(text: string): string {
    let code = text.trim();
    // Strip markdown fences
    if (code.startsWith("```")) {
        code = code.replace(/^```(?:tsx?|typescript|javascript)?\n?/, "").replace(/\n?```$/, "");
    }
    return code.trim();
}

export async function runBuildGenerate(input: BuildGenerateInput): Promise<BuildGenerateResult> {
    const { projectDir, model = "qwen/qwen3-coder-next" } = input;

    const design = readDesign(projectDir);
    if (!design) {
        return {
            success: false,
            files: [],
            written: [],
            errors: ["No design.json found. Run DESIGN stage first."],
            validation: [],
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        };
    }

    const project = readProjectConfig(projectDir);
    const appName = project?.name ?? "App";
    const themeStr = JSON.stringify(design.theme, null, 2);
    const navigationStr = JSON.stringify(design.navigation, null, 2);
    const componentsStr = design.components
        .map((c) => `- ${c.name}: ${c.props.join(", ")}`)
        .join("\n");

    const files: BuildFile[] = [];
    const totalUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

    // Filter screens/components if specific IDs provided
    const screens = input.screenIds
        ? design.screens.filter((s) => input.screenIds!.includes(s.id))
        : design.screens;
    const components = input.componentIds
        ? design.components.filter((c) => input.componentIds!.includes(c.id))
        : design.components;

    // Generate screens
    for (const screen of screens) {
        const rendered = getRenderedPrompt("build.screen.v2", {
            screenSpec: JSON.stringify(screen, null, 2),
            theme: themeStr,
            appName,
            navigation: navigationStr,
            components: componentsStr,
        });

        const messages: { role: "system" | "user" | "assistant"; content: string }[] = [];
        if (rendered.system) messages.push({ role: "system", content: rendered.system });
        messages.push({ role: "user", content: rendered.user });

        const result = await runOpenRouter({
            model,
            messages,
            temperature: 0.1,
            max_tokens: rendered.maxOutputTokens ?? 4000,
        });

        totalUsage.prompt_tokens += result.usage?.prompt_tokens ?? 0;
        totalUsage.completion_tokens += result.usage?.completion_tokens ?? 0;
        totalUsage.total_tokens += result.usage?.total_tokens ?? 0;

        const code = extractCode(result.text);
        const filePath = `src/screens/${screen.name}.tsx`;
        files.push({ path: filePath, content: code });
    }

    // Generate components
    for (const component of components) {
        const rendered = getRenderedPrompt("build.component.v2", {
            componentSpec: JSON.stringify(component, null, 2),
            theme: themeStr,
        });

        const messages: { role: "system" | "user" | "assistant"; content: string }[] = [];
        if (rendered.system) messages.push({ role: "system", content: rendered.system });
        messages.push({ role: "user", content: rendered.user });

        const result = await runOpenRouter({
            model,
            messages,
            temperature: 0.1,
            max_tokens: rendered.maxOutputTokens ?? 3000,
        });

        totalUsage.prompt_tokens += result.usage?.prompt_tokens ?? 0;
        totalUsage.completion_tokens += result.usage?.completion_tokens ?? 0;
        totalUsage.total_tokens += result.usage?.total_tokens ?? 0;

        const code = extractCode(result.text);
        const filePath = `src/components/${component.name}.tsx`;
        files.push({ path: filePath, content: code });
    }

    // Write files
    const buildResult = await runBuildStage({ projectDir, files });

    // Validate
    const validation = validateBuildFiles(files);

    return {
        success: buildResult.errors.length === 0,
        files,
        written: buildResult.written,
        errors: buildResult.errors,
        validation,
        usage: totalUsage,
    };
}
