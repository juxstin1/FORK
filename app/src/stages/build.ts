import * as fs from "fs";
import * as path from "path";
import { resolveWithinRoot } from "../lib/path-security";
import { appendAuditLog } from "../lib/audit";

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
    const root = path.resolve(input.projectDir);

    for (const file of input.files) {
        try {
            const fullPath = resolveWithinRoot(root, file.path);
            if (!fullPath) {
                errors.push(`Failed to write ${file.path}: path escapes project root`);
                appendAuditLog(root, "build.write", {
                    requestedPath: file.path,
                    resolvedPath: null,
                    status: "blocked",
                    reason: "path escapes project root",
                }, "warn");
                continue;
            }

            const dir = path.dirname(fullPath);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(fullPath, file.content, "utf-8");
            written.push(file.path);
            appendAuditLog(root, "build.write", {
                requestedPath: file.path,
                resolvedPath: fullPath,
                status: "ok",
                bytes: Buffer.byteLength(file.content, "utf-8"),
            });
        } catch (err) {
            errors.push(`Failed to write ${file.path}: ${err}`);
            appendAuditLog(root, "build.write", {
                requestedPath: file.path,
                status: "error",
                error: String(err),
            }, "error");
        }
    }

    return {
        written,
        errors,
    };
}
