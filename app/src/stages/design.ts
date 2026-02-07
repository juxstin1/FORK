import * as fs from "fs";
import * as path from "path";

export interface DesignSpec {
    theme: {
        colors: Record<string, string>;
        typography: Record<string, string>;
    };
    navigation: {
        type: "tab" | "stack" | "drawer";
        routes: string[];
    };
    screens: Array<{
        id: string;
        name: string;
        purpose: string;
        components: string[];
    }>;
    components: Array<{
        id: string;
        name: string;
        props: string[];
    }>;
}

export interface DesignStageInput {
    projectDir: string;
    design: DesignSpec;
}

export async function runDesignStage(input: DesignStageInput): Promise<{ success: boolean; path: string }> {
    const rorkDir = path.join(input.projectDir, ".rork");

    if (!fs.existsSync(rorkDir)) {
        fs.mkdirSync(rorkDir, { recursive: true });
    }

    const designPath = path.join(rorkDir, "design.json");
    fs.writeFileSync(designPath, JSON.stringify(input.design, null, 2), "utf-8");

    return {
        success: true,
        path: designPath,
    };
}
