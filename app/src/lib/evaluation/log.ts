/**
 * Evaluation & A/B Testing Module
 * 
 * Minimal logging and quality metrics for prompt optimization.
 */

import * as fs from "fs";
import * as path from "path";

/**
 * Run log entry.
 */
export interface RunLog {
    /** Unique run ID */
    runId: string;
    /** Prompt ID used */
    promptId: string;
    /** Stage name */
    stage: string;
    /** Project ID */
    projectId: string;
    /** Input token count */
    inputTokens: number;
    /** Output token count */
    outputTokens: number;
    /** Pack size */
    packSize: number;
    /** Latency in milliseconds */
    latencyMs: number;
    /** Success/failure */
    success: boolean;
    /** Error message if failed */
    error?: string;
    /** Timestamp */
    timestamp: string;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}

/**
 * Metrics for a prompt.
 */
export interface PromptMetrics {
    count: number;
    successRate: number;
    avgLatencyMs: number;
    avgInputTokens: number;
    avgOutputTokens: number;
}

/**
 * Comparison result.
 */
export interface PromptComparison {
    metricsA: PromptMetrics;
    metricsB: PromptMetrics;
    winner: string | null;
    improvement: number;
}

/**
 * Evaluation configuration.
 */
export interface EvalConfig {
    /** Directory for logs */
    logDir: string;
    /** Maximum log entries before rotation */
    maxEntries?: number;
}

/**
 * Evaluation & Logging class.
 */
export class Evaluator {
    private config: EvalConfig;
    private logPath: string;
    private runs: RunLog[];

    constructor(config: EvalConfig) {
        this.config = config;
        this.logPath = path.join(config.logDir, "runs.jsonl");
        this.runs = [];
    }

    /**
     * Initialize the evaluator.
     */
    async init(): Promise<void> {
        if (!fs.existsSync(this.config.logDir)) {
            fs.mkdirSync(this.config.logDir, { recursive: true });
        }

        // Load existing logs
        if (fs.existsSync(this.logPath)) {
            try {
                const content = fs.readFileSync(this.logPath, "utf-8");
                const lines = content.split("\n").filter((l) => l.trim());
                this.runs = lines.map((l) => JSON.parse(l) as RunLog);
            } catch {
                this.runs = [];
            }
        }
    }

    /**
     * Log a run.
     */
    async log(run: Omit<RunLog, "runId" | "timestamp">): Promise<void> {
        await this.init();

        const fullRun: RunLog = {
            ...run,
            runId: "run_" + Date.now() + "_" + Math.random().toString(36).slice(2),
            timestamp: new Date().toISOString(),
        };

        this.runs.push(fullRun);

        // Append to file
        fs.appendFileSync(this.logPath, JSON.stringify(fullRun) + "\n", "utf-8");

        // Rotate if needed
        if (this.config.maxEntries && this.runs.length > this.config.maxEntries) {
            this.rotateLogs();
        }
    }

    /**
     * Log a successful run.
     */
    async logSuccess(
        promptId: string,
        stage: string,
        projectId: string,
        inputTokens: number,
        outputTokens: number,
        packSize: number,
        latencyMs: number,
        metadata?: Record<string, unknown>
    ): Promise<void> {
        await this.log({
            promptId,
            stage,
            projectId,
            inputTokens,
            outputTokens,
            packSize,
            latencyMs,
            success: true,
            metadata,
        });
    }

    /**
     * Log a failed run.
     */
    async logFailure(
        promptId: string,
        stage: string,
        projectId: string,
        error: string,
        inputTokens?: number,
        outputTokens?: number
    ): Promise<void> {
        await this.log({
            promptId,
            stage,
            projectId,
            inputTokens: inputTokens || 0,
            outputTokens: outputTokens || 0,
            packSize: 0,
            latencyMs: 0,
            success: false,
            error,
        });
    }

    /**
     * Get recent runs.
     */
    async getRecentRuns(limit: number = 100): Promise<RunLog[]> {
        await this.init();
        return this.runs.slice(-limit);
    }

    /**
     * Get runs by prompt ID.
     */
    async getRunsByPrompt(promptId: string): Promise<RunLog[]> {
        await this.init();
        return this.runs.filter((r) => r.promptId === promptId);
    }

    /**
     * Get runs by stage.
     */
    async getRunsByStage(stage: string): Promise<RunLog[]> {
        await this.init();
        return this.runs.filter((r) => r.stage === stage);
    }

    /**
     * Calculate aggregate metrics for a prompt.
     */
    async getPromptMetrics(promptId: string): Promise<PromptMetrics> {
        const runs = await this.getRunsByPrompt(promptId);

        if (runs.length === 0) {
            return {
                count: 0,
                successRate: 0,
                avgLatencyMs: 0,
                avgInputTokens: 0,
                avgOutputTokens: 0,
            };
        }

        const successRuns = runs.filter((r) => r.success);
        const successRate = successRuns.length / runs.length;

        const avgLatencyMs = successRuns.reduce((sum, r) => sum + r.latencyMs, 0) / successRuns.length;
        const avgInputTokens = successRuns.reduce((sum, r) => sum + r.inputTokens, 0) / successRuns.length;
        const avgOutputTokens = successRuns.reduce((sum, r) => sum + r.outputTokens, 0) / successRuns.length;

        return {
            count: runs.length,
            successRate,
            avgLatencyMs,
            avgInputTokens,
            avgOutputTokens,
        };
    }

    /**
     * A/B Test: Compare two prompt versions.
     */
    async comparePrompts(promptIdA: string, promptIdB: string): Promise<PromptComparison> {
        const metricsA = await this.getPromptMetrics(promptIdA);
        const metricsB = await this.getPromptMetrics(promptIdB);

        let winner: string | null = null;
        let improvement = 0;

        // Compare by success rate first, then latency
        if (metricsA.successRate > metricsB.successRate) {
            winner = promptIdA;
            improvement = ((metricsA.successRate - metricsB.successRate) / metricsB.successRate) * 100;
        } else if (metricsB.successRate > metricsA.successRate) {
            winner = promptIdB;
            improvement = ((metricsB.successRate - metricsA.successRate) / metricsA.successRate) * 100;
        } else if (metricsA.avgLatencyMs < metricsB.avgLatencyMs) {
            winner = promptIdA;
            improvement = ((metricsB.avgLatencyMs - metricsA.avgLatencyMs) / metricsB.avgLatencyMs) * 100;
        } else if (metricsB.avgLatencyMs < metricsA.avgLatencyMs) {
            winner = promptIdB;
            improvement = ((metricsA.avgLatencyMs - metricsB.avgLatencyMs) / metricsA.avgLatencyMs) * 100;
        }

        return {
            metricsA,
            metricsB,
            winner,
            improvement,
        };
    }

    /**
     * Rotate old logs.
     */
    private rotateLogs(): void {
        const maxEntries = this.config.maxEntries || 1000;
        if (this.runs.length <= maxEntries) return;

        // Keep last N entries
        const kept = this.runs.slice(-maxEntries);

        // Rewrite file
        fs.writeFileSync(
            this.logPath,
            kept.map((r) => JSON.stringify(r)).join("\n") + "\n",
            "utf-8"
        );

        this.runs = kept;
    }

    /**
     * Export all logs.
     */
    async exportLogs(): Promise<RunLog[]> {
        await this.init();
        return this.runs;
    }

    /**
     * Clear all logs.
     */
    async clearLogs(): Promise<void> {
        this.runs = [];
        if (fs.existsSync(this.logPath)) {
            fs.unlinkSync(this.logPath);
        }
    }
}

/**
 * Default evaluator instance.
 */
let defaultEvaluator: Evaluator | null = null;

export function getEvaluator(config?: Partial<EvalConfig>): Evaluator {
    if (!defaultEvaluator) {
        defaultEvaluator = new Evaluator({
            logDir: config?.logDir || ".rork/evaluation",
            maxEntries: config?.maxEntries || 10000,
        });
    }
    return defaultEvaluator;
}

/**
 * Simple coverage checker for generated content.
 */
export function checkCoverage(
    content: string,
    requiredFields: string[]
): number {
    let matched = 0;
    const lowerContent = content.toLowerCase();

    for (const field of requiredFields) {
        if (lowerContent.includes(field.toLowerCase())) {
            matched++;
        }
    }

    return matched / requiredFields.length;
}

/**
 * Simple stability checker (decisions consistent across runs).
 */
export function checkStability(
    current: string,
    previous: string
): number {
    // Simple similarity check
    const wordsCurrent: Record<string, boolean> = {};
    const wordsPrevious: Record<string, boolean> = {};

    current.toLowerCase().split(/\s+/).forEach((w) => { wordsCurrent[w] = true; });
    previous.toLowerCase().split(/\s+/).forEach((w) => { wordsPrevious[w] = true; });

    let intersection = 0;
    let union = 0;

    for (const w in wordsCurrent) {
        union++;
        if (wordsPrevious[w]) {
            intersection++;
        }
    }

    for (const w in wordsPrevious) {
        if (!wordsCurrent[w]) {
            union++;
        }
    }

    return union > 0 ? intersection / union : 1;
}
