/**
 * Context Budget Manager
 * 
 * Manages token budgets per stage with truncation rules.
 * 
 * Budget allocation strategy:
 * - Reserve output tokens for LLM response
 * - Reserve tokens for tool calls
 * - Safety margin for overhead
 * - Everything else is input budget
 */

import {
    countTokens,
    getContextWindow,
    getMaxInputTokens,
    truncateToBudget
} from "./tokenizer";

/**
 * Default token reservations per stage.
 */
export const STAGE_RESERVATIONS: Record<string, {
    output: number;
    tools: number;
    safety: number;
}> = {
    IDEA: {
        output: 1500,  // JSON output for requirements
        tools: 200,
        safety: 100,
    },
    PERSONA: {
        output: 2000,  // JSON output for personas
        tools: 300,
        safety: 100,
    },
    DESIGN: {
        output: 2000,
        tools: 500,
        safety: 100,
    },
    BUILD: {
        output: 3000,
        tools: 1000,
        safety: 200,
    },
    TEST: {
        output: 1500,
        tools: 500,
        safety: 100,
    },
    DEBUG: {
        output: 1000,
        tools: 200,
        safety: 50,
    },
    SHIP: {
        output: 1000,
        tools: 100,
        safety: 50,
    },
};

/**
 * Context item types with priority values (lower = higher priority).
 */
export enum ContextPriority {
    SYSTEM_PROMPT = 1,
    CONSTRAINTS = 2,
    DECISIONS = 3,
    FACTS = 4,
    USER_PROMPT = 5,
    RECENT_HISTORY = 6,
    LONG_DOCS = 7,
    WEB_RESEARCH = 8,
    LOGS = 9,
}

/**
 * A piece of context with its token count and priority.
 */
export interface ContextItem {
    id: string;
    content: string;
    priority: ContextPriority;
    tokens: number;
    category: string;
    optional?: boolean;
}

/**
 * Budget calculation result.
 */
export interface BudgetResult {
    totalContext: number;
    inputBudget: number;
    reservations: {
        output: number;
        tools: number;
        safety: number;
    };
    breakdown: {
        system: number;
        constraints: number;
        prompt: number;
        history: number;
        extras: number;
    };
}

/**
 * Calculate budget for a stage.
 */
export function calculateStageBudget(
    stage: string,
    model: string = "gpt-4"
): BudgetResult {
    const reservations = STAGE_RESERVATIONS[stage] || {
        output: 1000,
        tools: 100,
        safety: 100,
    };

    const totalContext = getContextWindow(model);
    const inputBudget = getMaxInputTokens(
        model,
        reservations.output,
        reservations.tools,
        reservations.safety
    );

    // Typical breakdown percentages
    const breakdown = {
        system: Math.floor(inputBudget * 0.05),   // 5% for system prompt
        constraints: Math.floor(inputBudget * 0.10), // 10% for constraints/decisions
        prompt: Math.floor(inputBudget * 0.50),   // 50% for user prompt
        history: Math.floor(inputBudget * 0.20),   // 20% for recent history
        extras: Math.floor(inputBudget * 0.15),   // 15% for research/docs
    };

    return {
        totalContext,
        inputBudget,
        reservations,
        breakdown,
    };
}

/**
 * Truncate context items to fit budget, respecting priority.
 * 
 * @param items - Context items to fit
 * @param budget - Maximum tokens allowed
 * @returns Truncated items that fit in budget
 */
export function fitToBudget(
    items: ContextItem[],
    budget: number
): ContextItem[] {
    // Sort by priority (lower number = higher priority = keep first)
    const sorted = [...items].sort((a, b) => a.priority - b.priority);

    let used = 0;
    const kept: ContextItem[] = [];

    for (const item of sorted) {
        if (used + item.tokens <= budget) {
            kept.push(item);
            used += item.tokens;
        } else if (!item.optional) {
            // For non-optional items, try to truncate
            const remaining = budget - used;
            if (remaining > 50) {
                // Truncate this item
                kept.push({
                    ...item,
                    content: truncateToBudget(item.content, remaining),
                    tokens: countTokens(truncateToBudget(item.content, remaining)),
                });
                used += kept[kept.length - 1].tokens;
            }
        }
        // If item is optional and doesn't fit, skip it
    }

    return kept;
}

/**
 * Build context items from components.
 */
export function buildContextItems(
    promptId: string,
    system: string,
    userVars: Record<string, string>,
    constraints: string[],
    decisions: string[],
    history: Array<{ role: string; content: string }>,
    extras: Array<{ category: string; content: string; optional?: boolean }>
): ContextItem[] {
    const items: ContextItem[] = [];

    // System prompt (highest priority)
    items.push({
        id: `${promptId}:system`,
        content: system,
        priority: ContextPriority.SYSTEM_PROMPT,
        tokens: countTokens(system),
        category: "system",
    });

    // Constraints
    const constraintsText = constraints.join("\n");
    if (constraintsText) {
        items.push({
            id: `${promptId}:constraints`,
            content: `Constraints:\n${constraintsText}`,
            priority: ContextPriority.CONSTRAINTS,
            tokens: countTokens(constraintsText),
            category: "constraints",
        });
    }

    // Decisions
    const decisionsText = decisions.join("\n");
    if (decisionsText) {
        items.push({
            id: `${promptId}:decisions`,
            content: `Decisions made:\n${decisionsText}`,
            priority: ContextPriority.DECISIONS,
            tokens: countTokens(decisionsText),
            category: "decisions",
        });
    }

    // History (limited to recent turns)
    const recentHistory = history.slice(-5);
    const historyText = recentHistory
        .map((h) => `${h.role}: ${h.content}`)
        .join("\n");
    if (historyText) {
        items.push({
            id: `${promptId}:history`,
            content: `Recent conversation:\n${historyText}`,
            priority: ContextPriority.RECENT_HISTORY,
            tokens: countTokens(historyText),
            category: "history",
            optional: true,
        });
    }

    // Extras (research, docs - lowest priority)
    for (const extra of extras) {
        items.push({
            id: `${promptId}:extra:${extra.category}`,
            content: extra.content,
            priority: extra.optional ? ContextPriority.WEB_RESEARCH : ContextPriority.LONG_DOCS,
            tokens: countTokens(extra.content),
            category: extra.category,
            optional: extra.optional,
        });
    }

    return items;
}

/**
 * Format context for LLM API call.
 */
export interface LLMContext {
    system?: string;
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
    maxTokens?: number;
}

/**
 * Replace all occurrences of a pattern (ES2020+ compatible).
 */
function replaceAll(str: string, search: string, replace: string): string {
    return str.split(search).join(replace);
}

/**
 * Assemble context into LLM-ready format.
 */
export function assembleLLMContext(
    items: ContextItem[],
    promptId: string,
    userVars: Record<string, string>
): LLMContext {
    const context = fitToBudget(items, getMaxInputTokens("gpt-4"));

    let system: string | undefined;
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];

    for (const item of context) {
        if (item.category === "system") {
            system = item.content;
        } else {
            messages.push({
                role: item.category === "assistant" ? "assistant" : "user",
                content: item.content,
            });
        }
    }

    // Apply user variable substitution to last message
    if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        for (const [key, value] of Object.entries(userVars)) {
            lastMsg.content = replaceAll(lastMsg.content, `{{${key}}}`, String(value));
        }
    }

    return {
        system,
        messages,
    };
}

/**
 * Log budget usage for debugging/evaluation.
 */
export interface BudgetLog {
    promptId: string;
    stage: string;
    totalTokens: number;
    inputTokens: number;
    outputTokens: number;
    breakdown: Record<string, number>;
    fit: boolean;
    timestamp: string;
}

/**
 * Log budget usage.
 */
export function logBudgetUsage(
    promptId: string,
    stage: string,
    items: ContextItem[],
    budget: number
): BudgetLog {
    const breakdown: Record<string, number> = {};
    let total = 0;

    for (const item of items) {
        breakdown[item.category] = (breakdown[item.category] || 0) + item.tokens;
        total += item.tokens;
    }

    return {
        promptId,
        stage,
        totalTokens: total,
        inputTokens: total,
        outputTokens: budget - total,
        breakdown,
        fit: total <= budget,
        timestamp: new Date().toISOString(),
    };
}
