/**
 * Tokenizer Utilities
 * 
 * Token counting for various models. Uses tiktoken when available,
 * with fallback approximations for other models.
 */

// Token counts for different models (approximate tokens per character)
const TOKEN_RATIOS: Record<string, number> = {
    // GPT-4 family (approximately 4 chars per token)
    "gpt-4": 0.25,
    "gpt-4-32k": 0.25,
    "gpt-4-turbo": 0.25,
    "gpt-4o": 0.25,

    // GPT-3.5 family (approximately 4 chars per token)
    "gpt-3.5-turbo": 0.25,
    "gpt-3.5-turbo-16k": 0.25,

    // Claude family (approximately 3.5 chars per token)
    "claude-2": 0.286,
    "claude-2.1": 0.286,
    "claude-3-opus": 0.286,
    "claude-3-sonnet": 0.286,
    "claude-3-haiku": 0.286,

    // Default fallback
    "default": 0.25,
};

/**
 * Default model context windows (in tokens)
 */
const CONTEXT_WINDOWS: Record<string, number> = {
    "gpt-4": 8192,
    "gpt-4-32k": 32768,
    "gpt-4-turbo": 128000,
    "gpt-4o": 128000,
    "gpt-3.5-turbo": 16385,
    "gpt-3.5-turbo-16k": 32768,
    "claude-2": 100000,
    "claude-2.1": 200000,
    "claude-3-opus": 200000,
    "claude-3-sonnet": 200000,
    "claude-3-haiku": 200000,
    "default": 4096,
};

/**
 * Get token count for a string using the best available method.
 * 
 * @param text - The text to count tokens for
 * @param model - The model name (defaults to 'gpt-4')
 * @returns Estimated token count
 */
export function countTokens(text: string, model: string = "gpt-4"): number {
    // Try to use tiktoken if available (Node.js only)
    try {
        // Dynamic import for optional dependency
        const encoding = require("tiktoken")?.encoding_for_model?.(model)
            || require("tiktoken")?.get_encoding?.("cl100k_base");

        if (encoding) {
            const tokens = encoding.encode(text);
            encoding.free();
            return tokens.length;
        }
    } catch {
        // tiktoken not available, use approximation
    }

    // Fallback: approximate using character ratio
    const ratio = TOKEN_RATIOS[model] || TOKEN_RATIOS["default"];
    return Math.ceil(text.length * ratio);
}

/**
 * Get token count for multiple strings.
 */
export function countTokensBatch(
    strings: string[],
    model: string = "gpt-4"
): number {
    return strings.reduce((total, str) => total + countTokens(str, model), 0);
}

/**
 * Get the context window size for a model.
 */
export function getContextWindow(model: string = "gpt-4"): number {
    return CONTEXT_WINDOWS[model] || CONTEXT_WINDOWS["default"];
}

/**
 * Estimate maximum input tokens for a model given output requirements.
 * 
 * @param model - The model name
 * @param reserveOutput - Tokens to reserve for output
 * @param reserveTools - Tokens to reserve for tool calls (default: 0)
 * @param safetyMargin - Safety buffer (default: 100)
 * @returns Maximum tokens available for input
 */
export function getMaxInputTokens(
    model: string = "gpt-4",
    reserveOutput: number = 1000,
    reserveTools: number = 0,
    safetyMargin: number = 100
): number {
    const contextWindow = getContextWindow(model);
    return contextWindow - reserveOutput - reserveTools - safetyMargin;
}

/**
 * Check if content fits within token budget.
 */
export function fitsInBudget(
    content: string,
    budget: number,
    model: string = "gpt-4"
): boolean {
    return countTokens(content, model) <= budget;
}

/**
 * Create a truncated version of content to fit budget.
 * Uses a simple character-based truncation for speed.
 */
export function truncateToBudget(
    content: string,
    budget: number,
    model: string = "gpt-4"
): string {
    const ratio = TOKEN_RATIOS[model] || TOKEN_RATIOS["default"];
    const maxChars = Math.floor(budget / ratio);

    if (content.length <= maxChars) {
        return content;
    }

    return content.substring(0, maxChars);
}

/**
 * Format token count for display.
 */
export function formatTokenCount(tokens: number): string {
    if (tokens >= 1000) {
        return `${(tokens / 1000).toFixed(1)}k`;
    }
    return tokens.toString();
}
