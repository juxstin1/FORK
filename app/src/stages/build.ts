import * as fs from "fs";
import * as path from "path";

export interface BuildFile {
    path: string; // Relative path, e.g., "app/(tabs)/index.tsx"
    content: string;
}

export interface BuildStageInput {
    projectDir: string;
    files: BuildFile[];
}

export async function runBuildStage(input: BuildStageInput): Promise<{ written: string[]; errors: string[] }> {
    const written: string[] = [];
    const errors: string[] = [];

    for (const file of input.files) {
        try {
            // Prevent writing outside of src for safety (though currently we trust the tools)
            // We'll treat the projectDir/src as the root for code.
            // Actually, standard structure is app/src or just app.
            // Let's assume input.projectDir is the root of the 'app' package.

            const fullPath = path.join(input.projectDir, file.path);
            const dir = path.dirname(fullPath);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(fullPath, file.content, "utf-8");
            written.push(file.path);
        } catch (err) {
            errors.push(`Failed to write ${file.path}: ${err}`);
        }
    }

    return {
        written,
        errors,
    };
}
