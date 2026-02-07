/**
 * Context Pack - Deterministic RAG-style Context Compression
 * 
 * Creates structured "Context Pack" artifacts that stages can consume.
 * Uses stable schema rather than freeform summarization.
 */

import { countTokens } from "./tokenizer";

/**
 * Source reference for attribution.
 */
export interface ContextSource {
    id: string;
    kind: "web" | "generated" | "default" | "memory";
    uri?: string;
    title?: string;
    excerpt?: string;
    timestamp?: string;
}

/**
 * Context Pack - Structured summary artifact.
 * 
 * This schema ensures consistent compression that preserves
 * retrievable information without becoming "word soup."
 */
export interface ContextPack {
    /** Unique identifier for this pack */
    id: string;
    /** Which prompt/stage this pack was generated for */
    promptId: string;
    /** Project this pack belongs to */
    projectId: string;
    /** Timestamp of generation */
    generatedAt: string;

    /** Factual statements extracted from research/generation */
    facts: string[];
    /** Key decisions made in this stage */
    decisions: string[];
    /** Open questions to be answered */
    openQuestions: string[];
    /** Constraints discovered/applied */
    constraints: string[];
    /** Summary of recent work */
    recentWork: string[];

    /** Sources that informed this pack */
    sources: ContextSource[];

    /** Token count for budget tracking */
    tokenCount: number;
}

/**
 * Create an empty Context Pack with basic structure.
 */
export function createEmptyPack(
    promptId: string,
    projectId: string
): ContextPack {
    return {
        id: `${projectId}:${promptId}:${Date.now()}`,
        promptId,
        projectId,
        generatedAt: new Date().toISOString(),
        facts: [],
        decisions: [],
        openQuestions: [],
        constraints: [],
        recentWork: [],
        sources: [],
        tokenCount: 0,
    };
}

/**
 * Add facts to a pack.
 */
export function addFacts(pack: ContextPack, facts: string[]): ContextPack {
    const combined = Array.from(new Set([...pack.facts, ...facts]));
    return {
        ...pack,
        facts: combined,
    };
}

/**
 * Add a decision to a pack.
 */
export function addDecision(pack: ContextPack, decision: string): ContextPack {
    return {
        ...pack,
        decisions: [...pack.decisions, decision],
    };
}

/**
 * Add an open question to a pack.
 */
export function addOpenQuestion(pack: ContextPack, question: string): ContextPack {
    return {
        ...pack,
        openQuestions: [...pack.openQuestions, question],
    };
}

/**
 * Add a constraint to a pack.
 */
export function addConstraint(pack: ContextPack, constraint: string): ContextPack {
    return {
        ...pack,
        constraints: [...pack.constraints, constraint],
    };
}

/**
 * Add recent work summary.
 */
export function addRecentWork(pack: ContextPack, work: string): ContextPack {
    const updated = [work, ...pack.recentWork].slice(0, 5);
    return {
        ...pack,
        recentWork: updated,
    };
}

/**
 * Add a source to the pack.
 */
export function addSource(
    pack: ContextPack,
    source: ContextSource
): ContextPack {
    const updatedSources = [...pack.sources, source];
    return {
        ...pack,
        sources: updatedSources,
    };
}

/**
 * Calculate token count for a pack.
 */
export function calculatePackTokens(pack: ContextPack): number {
    const sections = [
        pack.facts.join("\n"),
        pack.decisions.join("\n"),
        pack.openQuestions.join("\n"),
        pack.constraints.join("\n"),
        pack.recentWork.join("\n"),
    ].join("\n");

    return countTokens(sections);
}

/**
 * Compress a pack by reducing less important sections.
 * Returns true if compression was applied.
 */
export function compressPack(
    pack: ContextPack,
    maxTokens: number
): { pack: ContextPack; compressed: boolean } {
    const updatedPack = { ...pack, tokenCount: calculatePackTokens(pack) };

    if (updatedPack.tokenCount <= maxTokens) {
        return { pack: updatedPack, compressed: false };
    }

    // Compress in priority order (keep decisions + constraints last)

    // 1. Truncate recent work
    while (updatedPack.tokenCount > maxTokens && updatedPack.recentWork.length > 0) {
        updatedPack.recentWork.pop();
        updatedPack.tokenCount = calculatePackTokens(updatedPack);
    }

    // 2. Truncate open questions
    while (updatedPack.tokenCount > maxTokens && updatedPack.openQuestions.length > 0) {
        updatedPack.openQuestions.pop();
        updatedPack.tokenCount = calculatePackTokens(updatedPack);
    }

    // 3. Truncate facts
    while (updatedPack.tokenCount > maxTokens && updatedPack.facts.length > 0) {
        updatedPack.facts.pop();
        updatedPack.tokenCount = calculatePackTokens(updatedPack);
    }

    // 4. Consolidate facts (combine short facts)
    if (updatedPack.tokenCount > maxTokens) {
        updatedPack.facts = updatedPack.facts.map((f) => f.length > 100 ? f : f + ".");
        updatedPack.tokenCount = calculatePackTokens(updatedPack);
    }

    return { pack: updatedPack, compressed: updatedPack.tokenCount <= maxTokens };
}

/**
 * Convert a pack to a string for storage/retrieval.
 */
export function packToString(pack: ContextPack): string {
    return JSON.stringify(pack, null, 2);
}

/**
 * Parse a pack from storage.
 */
export function packFromString(str: string): ContextPack {
    const pack = JSON.parse(str) as ContextPack;
    pack.tokenCount = calculatePackTokens(pack);
    return pack;
}

/**
 * Serialize pack for LLM consumption (compact format).
 */
export function packToContext(pack: ContextPack): string {
    const parts: string[] = [];

    if (pack.decisions.length > 0) {
        parts.push("## Decisions");
        pack.decisions.forEach((d) => parts.push(`- ${d}`));
    }

    if (pack.constraints.length > 0) {
        parts.push("\n## Constraints");
        pack.constraints.forEach((c) => parts.push(`- ${c}`));
    }

    if (pack.facts.length > 0) {
        parts.push("\n## Facts");
        pack.facts.forEach((f) => parts.push(`- ${f}`));
    }

    if (pack.openQuestions.length > 0) {
        parts.push("\n## Open Questions");
        pack.openQuestions.forEach((q) => parts.push(`- ${q}`));
    }

    if (pack.recentWork.length > 0) {
        parts.push("\n## Recent Work");
        pack.recentWork.forEach((w) => parts.push(`- ${w}`));
    }

    return parts.join("\n");
}

/**
 * Merge multiple packs into one.
 */
export function mergePacks(
    packs: ContextPack[],
    promptId: string,
    projectId: string
): ContextPack {
    const merged = createEmptyPack(promptId, projectId);

    for (const pack of packs) {
        // Merge facts (dedupe)
        merged.facts = Array.from(new Set([...merged.facts, ...pack.facts]));

        // Merge decisions (keep all)
        merged.decisions = [...merged.decisions, ...pack.decisions];

        // Merge open questions
        merged.openQuestions = [...merged.openQuestions, ...pack.openQuestions];

        // Merge constraints (dedupe)
        merged.constraints = Array.from(new Set([...merged.constraints, ...pack.constraints]));

        // Merge recent work
        merged.recentWork = [...merged.recentWork, ...pack.recentWork].slice(0, 5);

        // Merge sources
        merged.sources = [...merged.sources, ...pack.sources];
    }

    merged.tokenCount = calculatePackTokens(merged);
    return merged;
}

/**
 * Check if a pack has essential information (decisions + constraints).
 */
export function hasEssentialInfo(pack: ContextPack): boolean {
    return pack.decisions.length > 0 || pack.constraints.length > 0;
}

/**
 * Extract search keywords from a pack.
 */
export function extractKeywords(pack: ContextPack): string[] {
    const all = [
        ...pack.facts,
        ...pack.decisions,
        ...pack.constraints,
        ...pack.recentWork,
    ];

    // Simple keyword extraction (lowercase, remove stopwords)
    const stopwords = new Set([
        "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "could",
        "should", "may", "might", "must", "shall", "can", "need", "to", "of",
        "in", "for", "on", "with", "at", "by", "from", "as", "into", "through",
        "during", "before", "after", "above", "below", "between", "under",
        "and", "but", "or", "nor", "so", "yet", "both", "either", "neither",
    ]);

    const keywords = new Set<string>();
    all.forEach((text) => {
        text.toLowerCase()
            .split(/\W+/)
            .filter((w) => w.length > 2 && !stopwords.has(w))
            .forEach((w) => keywords.add(w));
    });

    return Array.from(keywords);
}
