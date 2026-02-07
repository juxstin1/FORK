import * as fs from "fs";
import * as path from "path";

export interface ReadFileRequest {
    path: string;
}

export interface ReadFileResult {
    path: string;
    content: string | null;
    error?: string;
}

export interface ReadStageInput {
    projectDir: string;
    files: string[];
}

export async function runReadStage(input: ReadStageInput): Promise<ReadFileResult[]> {
    const results: ReadFileResult[] = [];

    for (const filePath of input.files) {
        try {
            // Security check: ensure path is within projectDir
            const fullPath = path.resolve(input.projectDir, filePath);
            if (!fullPath.startsWith(path.resolve(input.projectDir))) {
                results.push({
                    path: filePath,
                    content: null,
                    error: "Access denied: Path is outside project directory",
                });
                continue;
            }

            if (!fs.existsSync(fullPath)) {
                results.push({
                    path: filePath,
                    content: null,
                    error: "File not found",
                });
                continue;
            }

            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                results.push({
                    path: filePath,
                    content: null,
                    error: "Path is a directory, not a file",
                });
                continue;
            }

            const content = fs.readFileSync(fullPath, "utf-8");
            results.push({
                path: filePath,
                content: content,
            });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            results.push({
                path: filePath,
                content: null,
                error: errorMessage,
            });
        }
    }

    return results;
}
