/**
 * Retrieval Module - Retrieve Context Packs for LLM Context
 * 
 * Simple keyword-based retrieval with scoring.
 * Embeddings-based retrieval can be added later.
 */

import type { ContextPack } from "../context/pack";
import { MemoryStore, getMemoryStore } from "./store";

/**
 * Retrieval options.
 */
export interface RetrievalOptions {
    /** Maximum number of packs to retrieve */
    limit?: number;
    /** Include packs with decisions */
    includeDecisions?: boolean;
    /** Include packs with constraints */
    includeConstraints?: boolean;
    /** Only include packs from specific stages */
    stages?: string[];
    /** Minimum relevance score (0-1) */
    minScore?: number;
}

/**
 * Retrieval result with relevance score.
 */
export interface RetrievalResult {
    pack: ContextPack;
    score: number;
    matchedKeywords: string[];
    relevanceReason: string;
}

/**
 * Retrieve relevant context packs for a query.
 * 
 * @param projectId - The project to search in
 * @param query - Search query or keywords
 * @param options - Retrieval options
 * @returns Sorted list of retrieval results by score
 */
export async function retrieveContext(
    projectId: string,
    query: string,
    options: RetrievalOptions = {}
): Promise<RetrievalResult[]> {
    const store = getMemoryStore();

    const {
        limit = 5,
        includeDecisions = true,
        includeConstraints = true,
        stages = [],
        minScore = 0.1,
    } = options;

    // Search for matching packs
    const packs = await store.search(projectId, query);

    // Filter and score packs
    const results: RetrievalResult[] = [];

    for (const pack of packs) {
        // Filter by stages
        if (stages.length > 0 && !stages.includes(extractStage(pack.promptId))) {
            continue;
        }

        // Filter by decisions/constraints
        if (!includeDecisions && pack.decisions.length > 0) {
            // Still include if it has high keyword match
        }
        if (!includeConstraints && pack.constraints.length > 0) {
            // Still include if it has high keyword match
        }

        // Score the pack
        const scored = scorePack(pack, query);

        if (scored.score >= minScore) {
            results.push(scored);
        }
    }

    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);

    // Limit results
    return results.slice(0, limit);
}

/**
 * Retrieve the most recent context across all stages.
 */
export async function retrieveRecentContext(
    projectId: string,
    limit: number = 3
): Promise<ContextPack[]> {
    const store = getMemoryStore();
    const packs = await store.getByProject(projectId);

    // Return most recent
    return packs.slice(0, limit);
}

/**
 * Retrieve all decisions and constraints from a project.
 */
export async function retrieveDecisionsAndConstraints(
    projectId: string
): Promise<ContextPack[]> {
    const store = getMemoryStore();
    return store.getWithDecisions(projectId);
}

/**
 * Score a pack against a query.
 */
function scorePack(pack: ContextPack, query: string): RetrievalResult {
    const queryKeywords = query.toLowerCase().split(/\s+/);
    const packKeywords = [
        ...pack.facts,
        ...pack.decisions,
        ...pack.constraints,
        ...pack.recentWork,
    ].join(" ").toLowerCase();

    let matchedKeywords: string[] = [];
    let score = 0;

    for (const keyword of queryKeywords) {
        if (packKeywords.includes(keyword)) {
            matchedKeywords.push(keyword);
            score += 0.2; // Base match score
        }
    }

    // Bonus for decisions
    if (pack.decisions.length > 0) {
        score += 0.1;
    }

    // Bonus for constraints
    if (pack.constraints.length > 0) {
        score += 0.1;
    }

    // Bonus for recent activity
    const ageHours = (Date.now() - new Date(pack.generatedAt).getTime()) / (1000 * 60 * 60);
    if (ageHours < 24) {
        score += 0.1;
    }

    // Normalize score to 0-1
    score = Math.min(1, score);

    // Generate relevance reason
    let relevanceReason = "";
    if (matchedKeywords.length > 0) {
        relevanceReason = `Matched keywords: ${matchedKeywords.join(", ")}`;
    } else if (pack.decisions.length > 0 || pack.constraints.length > 0) {
        relevanceReason = "Contains important decisions or constraints";
    } else {
        relevanceReason = "Recent context in project";
    }

    return {
        pack,
        score,
        matchedKeywords,
        relevanceReason,
    };
}

/**
 * Extract stage from prompt ID.
 */
function extractStage(promptId: string): string {
    const parts = promptId.split(".");
    return parts[0] || "UNKNOWN";
}

/**
 * Build retrieval context for an LLM call.
 * 
 * Combines multiple packs into a coherent context string.
 */
export async function buildRetrievalContext(
    projectId: string,
    query: string,
    options: RetrievalOptions = {}
): Promise<string> {
    const results = await retrieveContext(projectId, query, options);

    if (results.length === 0) {
        return "";
    }

    const parts: string[] = [];

    for (const result of results) {
        const pack = result.pack;

        parts.push(`[Relevance: ${(result.score * 100).toFixed(0)}%]`);

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

        parts.push("\n---\n");
    }

    return parts.join("\n");
}
