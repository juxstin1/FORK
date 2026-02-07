import { exec } from "child_process";
import * as util from "util";

// Promisify exec for async/await usage
const execAsync = util.promisify(exec);

export interface DockerResult {
    command: string;
    output: string;
    error?: string;
    exitCode?: number;
}

export interface DockerInput {
    command: string; // e.g., "run -d -p 5432:5432 postgres"
    cwd?: string;
}

/**
 * Run a Docker command. 
 * The input command should NOT include "docker" prefix, it will be added automatically.
 * e.g., input "ps" becomes "docker ps".
 */
export async function runDockerStage(input: DockerInput): Promise<DockerResult> {
    // Security/Safety:
    // We strictly prepend "docker " to ensure we only run docker commands.
    // We can add blocklists here if needed (e.g., prevent "docker system prune -a" if we wanted to be safe).

    const fullCommand = `docker ${input.command}`;

    try {
        const { stdout, stderr } = await execAsync(fullCommand, {
            cwd: input.cwd || process.cwd()
        });

        return {
            command: fullCommand,
            output: stdout || stderr, // Some docker commands write info to stderr
            exitCode: 0
        };
    } catch (err: any) {
        // exec throws an error if exit code is non-zero
        return {
            command: fullCommand,
            output: err.stdout || "",
            error: err.stderr || err.message,
            exitCode: err.code || 1
        };
    }
}
