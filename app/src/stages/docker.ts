import { spawn } from "child_process";
import { appendAuditLog } from "../lib/audit";

export interface DockerResult {
    command: string;
    output: string;
    error?: string;
    exitCode?: number;
}

export interface DockerInput {
    command: string; // e.g., "run -d -p 5432:5432 postgres"
    cwd?: string;
    projectDir?: string;
}

const ALLOWED_SUBCOMMANDS = new Set([
    "inspect",
    "ps",
    "images",
    "system",
    "build",
    "run",
    "compose",
    "logs",
    "pull",
    "exec",
    "start",
    "stop",
    "rm",
    "rmi",
    "version",
    "info",
    "network",
    "volume",
]);

const SAFE_ALLOWED_SUBCOMMANDS = new Set([
    "ps",
    "images",
    "info",
    "version",
    "inspect",
]);

const MAX_COMMAND_CHARS = 8_192;
const MAX_ARGS = 200;
const SAFE_TIMEOUT_MS = 60_000;
const POWER_TIMEOUT_MS = 300_000;

function killProcessTree(pid: number | undefined) {
    if (!pid) return;

    if (process.platform === "win32") {
        // Windows needs taskkill to terminate child process trees reliably.
        const killer = spawn("taskkill", ["/PID", String(pid), "/T", "/F"], {
            shell: false,
            stdio: "ignore",
        });
        killer.unref();
        return;
    }

    try {
        process.kill(pid, "SIGKILL");
    } catch {
        // Ignore if process is already gone.
    }
}

function tokenizeArgs(raw: string): string[] {
    const tokens: string[] = [];
    const re = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
    let match: RegExpExecArray | null;

    while ((match = re.exec(raw)) !== null) {
        tokens.push(match[1] ?? match[2] ?? match[0]);
    }

    return tokens;
}

function getDockerArgSafetyError(args: string[], powerMode: boolean): string | null {
    if (powerMode) return null;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === "--privileged") return "Flag --privileged is blocked unless power mode is enabled";
        if (arg === "-v" || arg === "--volume" || arg === "--mount") {
            return `Flag ${arg} is blocked unless power mode is enabled`;
        }

        if (arg === "--network" && args[i + 1] === "host") {
            return "Host networking is blocked unless power mode is enabled";
        }

        if (arg.startsWith("--network=") && arg.slice("--network=".length) === "host") {
            return "Host networking is blocked unless power mode is enabled";
        }
    }

    return null;
}

/**
 * Run a Docker command.
 * The input command should NOT include "docker" prefix, it will be added automatically.
 * e.g., input "ps" becomes "docker ps".
 */
export async function runDockerStage(input: DockerInput): Promise<DockerResult> {
    const log = (
        details: Record<string, unknown>,
        level: "info" | "warn" | "error" = "info"
    ) => {
        if (!input.projectDir) return;
        appendAuditLog(input.projectDir, "docker.exec", details, level);
    };

    const trimmed = input.command.trim();
    if (!trimmed) {
        log({ status: "error", rawCommand: input.command, reason: "empty command" }, "warn");
        return {
            command: "docker",
            output: "",
            error: "Command cannot be empty",
            exitCode: 1,
        };
    }

    if (trimmed.length > MAX_COMMAND_CHARS) {
        log(
            {
                status: "blocked",
                rawCommand: trimmed.slice(0, 256),
                reason: `command exceeds ${MAX_COMMAND_CHARS} characters`,
            },
            "warn"
        );
        return {
            command: "docker [TRUNCATED]",
            output: "",
            error: `Command exceeds ${MAX_COMMAND_CHARS} characters`,
            exitCode: 1,
        };
    }

    if (/[|&;`><]/.test(trimmed)) {
        log({ status: "blocked", rawCommand: trimmed, reason: "shell metacharacters" }, "warn");
        return {
            command: `docker ${trimmed}`,
            output: "",
            error: "Command contains forbidden shell metacharacters",
            exitCode: 1,
        };
    }

    const args = tokenizeArgs(trimmed);
    if (args.length === 0) {
        log({ status: "error", rawCommand: trimmed, reason: "no args after tokenization" }, "warn");
        return {
            command: "docker",
            output: "",
            error: "Command cannot be empty",
            exitCode: 1,
        };
    }

    if (args.length > MAX_ARGS) {
        log(
            {
                status: "blocked",
                rawCommand: trimmed.slice(0, 256),
                reason: `command has too many args (${args.length} > ${MAX_ARGS})`,
            },
            "warn"
        );
        return {
            command: `docker ${args.slice(0, 10).join(" ")} ...`,
            output: "",
            error: `Command has too many args (${args.length} > ${MAX_ARGS})`,
            exitCode: 1,
        };
    }

    const powerMode = process.env.FORK_DOCKER_POWER_MODE === "I_UNDERSTAND";

    if (!powerMode && !SAFE_ALLOWED_SUBCOMMANDS.has(args[0])) {
        log(
            {
                status: "blocked",
                rawCommand: trimmed,
                subcommand: args[0],
                args: args.slice(1),
                reason: `subcommand "${args[0]}" is blocked in SAFE mode`,
            },
            "warn"
        );
        return {
            command: `docker ${args.join(" ")}`,
            output: "",
            error: `Docker subcommand "${args[0]}" is blocked in SAFE mode. Enable power mode to allow mutating commands.`,
            exitCode: 1,
        };
    }

    const safetyError = getDockerArgSafetyError(args, powerMode);
    if (safetyError) {
        log(
            {
                status: "blocked",
                rawCommand: trimmed,
                subcommand: args[0],
                args: args.slice(1),
                reason: safetyError,
            },
            "warn"
        );
        return {
            command: `docker ${args.join(" ")}`,
            output: "",
            error: safetyError,
            exitCode: 1,
        };
    }

    if (!ALLOWED_SUBCOMMANDS.has(args[0])) {
        log(
            {
                status: "blocked",
                rawCommand: trimmed,
                subcommand: args[0],
                args: args.slice(1),
                reason: "subcommand not allowlisted",
            },
            "warn"
        );
        return {
            command: `docker ${args.join(" ")}`,
            output: "",
            error: `Docker subcommand "${args[0]}" is not allowed`,
            exitCode: 1,
        };
    }

    log({
        status: "start",
        rawCommand: trimmed,
        subcommand: args[0],
        args: args.slice(1),
        powerMode,
    });

    return await new Promise<DockerResult>((resolve) => {
        const timeoutMs = powerMode ? POWER_TIMEOUT_MS : SAFE_TIMEOUT_MS;
        const child = spawn("docker", args, {
            cwd: input.cwd || process.cwd(),
            shell: false,
        });
        let settled = false;
        let escalationTimer: NodeJS.Timeout | undefined;
        const settle = (result: DockerResult, level: "info" | "warn" | "error" = "info") => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            if (result.error) {
                log(
                    {
                        status: "error",
                        subcommand: args[0],
                        args: args.slice(1),
                        exitCode: result.exitCode ?? 1,
                        error: result.error,
                    },
                    level
                );
            }
            resolve(result);
        };

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (chunk) => {
            stdout += chunk.toString();
        });

        child.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        const timer = setTimeout(() => {
            try {
                child.kill("SIGTERM");
            } catch {
                // no-op
            }

            // If SIGTERM is ignored, escalate to force kill shortly after.
            escalationTimer = setTimeout(() => killProcessTree(child.pid), 2_000);

            settle(
                {
                    command: `docker ${args.join(" ")}`,
                    output: stdout || stderr,
                    error: `Docker command timed out after ${timeoutMs}ms`,
                    exitCode: 124,
                },
                "warn"
            );
        }, timeoutMs);

        child.on("error", (error) => {
            if (escalationTimer) {
                clearTimeout(escalationTimer);
                escalationTimer = undefined;
            }
            settle({
                command: `docker ${args.join(" ")}`,
                output: stdout,
                error: error.message,
                exitCode: 1,
            }, "error");
        });

        child.on("close", (code) => {
            if (escalationTimer) {
                clearTimeout(escalationTimer);
                escalationTimer = undefined;
            }
            if (settled) return;
            log(
                {
                    status: code === 0 ? "ok" : "error",
                    subcommand: args[0],
                    args: args.slice(1),
                    exitCode: code ?? 1,
                    outputBytes: Buffer.byteLength(stdout || stderr, "utf-8"),
                },
                code === 0 ? "info" : "error"
            );
            settle({
                command: `docker ${args.join(" ")}`,
                output: stdout || stderr,
                error: code === 0 ? undefined : stderr || `Process exited with code ${code ?? 1}`,
                exitCode: code ?? 1,
            }, code === 0 ? "info" : "error");
        });
    });
}
