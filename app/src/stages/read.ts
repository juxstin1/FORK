import * as fs from "fs";
import * as path from "path";
import { resolveWithinRoot } from "../lib/path-security";
import { appendAuditLog } from "../lib/audit";

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
    const root = path.resolve(input.projectDir);

    for (const filePath of input.files) {
        try {
            const fullPath = resolveWithinRoot(root, filePath);
            if (!fullPath) {
                results.push({
                    path: filePath,
                    content: null,
                    error: "Access denied: Path is outside project directory",
                });
                appendAuditLog(root, "read.file", {
                    requestedPath: filePath,
                    resolvedPath: null,
                    status: "blocked",
                    reason: "path escapes project root",
                }, "warn");
                continue;
            }

            if (!fs.existsSync(fullPath)) {
                results.push({
                    path: filePath,
                    content: null,
                    error: "File not found",
                });
                appendAuditLog(root, "read.file", {
                    requestedPath: filePath,
                    resolvedPath: fullPath,
                    status: "error",
                    reason: "file not found",
                }, "warn");
                continue;
            }

            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                results.push({
                    path: filePath,
                    content: null,
                    error: "Path is a directory, not a file",
                });
                appendAuditLog(root, "read.file", {
                    requestedPath: filePath,
                    resolvedPath: fullPath,
                    status: "error",
                    reason: "is directory",
                }, "warn");
                continue;
            }

            const content = fs.readFileSync(fullPath, "utf-8");
            results.push({
                path: filePath,
                content: content,
            });
            appendAuditLog(root, "read.file", {
                requestedPath: filePath,
                resolvedPath: fullPath,
                status: "ok",
                bytes: Buffer.byteLength(content, "utf-8"),
            });

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            results.push({
                path: filePath,
                content: null,
                error: errorMessage,
            });
            appendAuditLog(root, "read.file", {
                requestedPath: filePath,
                status: "error",
                error: errorMessage,
            }, "error");
        }
    }

    return results;
}
