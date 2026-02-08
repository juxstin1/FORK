import * as fs from "fs";
import * as path from "path";

/**
 * Loads .env into process.env.
 * No dependencies. Runs once at server startup.
 * Skips blank lines and comments. Does not override existing env vars.
 *
 * @param appDir - Absolute path to app/ directory. Falls back to cwd if not provided.
 */
export function loadEnv(appDir?: string) {
    const envPath = path.resolve(appDir ?? process.cwd(), ".env");

    let raw: string;
    try {
        raw = fs.readFileSync(envPath, "utf-8");
    } catch {
        // No .env file — that's fine, fall through to process.env
        return;
    }

    for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;

        const eqIndex = trimmed.indexOf("=");
        if (eqIndex === -1) continue;

        const key = trimmed.slice(0, eqIndex).trim();
        let value = trimmed.slice(eqIndex + 1).trim();

        // Strip surrounding quotes if present
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        // Don't override existing env vars (explicit exports win)
        if (!(key in process.env)) {
            process.env[key] = value;
        }
    }
}
