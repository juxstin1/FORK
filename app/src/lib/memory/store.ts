/**
 * Memory Store - Persistent Context Storage
 * 
 * Stores Context Packs across sessions for retrieval.
 * Uses a simple JSON file storage (SQLite/Postgres can be added later).
 */

import * as fs from "fs";
import * as path from "path";
import type { ContextPack } from "../context/pack";
import { extractKeywords } from "../context/pack";

/**
 * Memory entry metadata (stored separately from pack for quick lookups).
 */
export interface MemoryEntry {
    id: string;
    projectId: string;
    promptId: string;
    stage: string;
    timestamp: string;
    keywords: string[];
    tokenCount: number;
    hasDecisions: boolean;
    hasConstraints: boolean;
}

/**
 * Memory store configuration.
 */
export interface MemoryStoreConfig {
    storageDir: string; // Directory for storage files
}

/**
 * Memory Store - Stores and retrieves Context Packs.
 */
export class MemoryStore {
    private config: MemoryStoreConfig;
    private packsDir: string;
    private entriesPath: string;
    private entries: MemoryEntry[];
    private initialized: boolean = false;

    constructor(config: MemoryStoreConfig) {
        this.config = config;
        this.packsDir = path.join(config.storageDir, "packs");
        this.entriesPath = path.join(config.storageDir, "index.json");
        this.entries = [];
    }

    /**
     * Initialize the store (create directories, load index).
     */
    async init(): Promise<void> {
        if (this.initialized) return;

        // Create directories if needed
        if (!fs.existsSync(this.config.storageDir)) {
            fs.mkdirSync(this.config.storageDir, { recursive: true });
        }
        if (!fs.existsSync(this.packsDir)) {
            fs.mkdirSync(this.packsDir, { recursive: true });
        }

        // Load existing index
        if (fs.existsSync(this.entriesPath)) {
            try {
                const content = fs.readFileSync(this.entriesPath, "utf-8");
                this.entries = JSON.parse(content) as MemoryEntry[];
            } catch {
                this.entries = [];
            }
        }

        this.initialized = true;
    }

    /**
     * Save index to disk.
     */
    private saveIndex(): void {
        fs.writeFileSync(this.entriesPath, JSON.stringify(this.entries, null, 2), "utf-8");
    }

    /**
     * Store a Context Pack.
     */
    async store(pack: ContextPack): Promise<void> {
        await this.init();

        const entry = this.createEntry(pack);

        // Save pack file
        const packPath = path.join(this.packsDir, `${pack.id}.json`);
        fs.writeFileSync(packPath, JSON.stringify(pack, null, 2), "utf-8");

        // Add to entries
        this.entries.push(entry);
        this.saveIndex();
    }

    /**
     * Retrieve a Context Pack by ID.
     */
    async retrieve(packId: string): Promise<ContextPack | null> {
        await this.init();

        const packPath = path.join(this.packsDir, `${packId}.json`);
        if (!fs.existsSync(packPath)) {
            return null;
        }

        const content = fs.readFileSync(packPath, "utf-8");
        return JSON.parse(content) as ContextPack;
    }

    /**
     * Get all packs for a project.
     */
    async getByProject(projectId: string): Promise<ContextPack[]> {
        await this.init();

        const projectEntryIds = this.entries
            .filter((e) => e.projectId === projectId)
            .map((e) => e.id);

        const packs: ContextPack[] = [];
        for (const packId of projectEntryIds) {
            const pack = await this.retrieve(packId);
            if (pack) {
                packs.push(pack);
            }
        }

        // Sort by timestamp (newest first)
        return packs.sort((a, b) =>
            new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
        );
    }

    /**
     * Get latest pack for a stage.
     */
    async getLatestByStage(projectId: string, stage: string): Promise<ContextPack | null> {
        await this.init();

        const stageEntries = this.entries
            .filter((e) => e.projectId === projectId && e.stage === stage)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        if (stageEntries.length === 0) {
            return null;
        }

        return this.retrieve(stageEntries[0].id);
    }

    /**
     * Search packs by keywords.
     */
    async search(projectId: string, query: string): Promise<ContextPack[]> {
        await this.init();

        const queryKeywords = query.toLowerCase().split(/\s+/);
        const matchedIds = new Set<string>();

        // Find packs matching any keyword
        for (const keyword of queryKeywords) {
            for (const entry of this.entries) {
                if (entry.projectId === projectId && entry.keywords.includes(keyword)) {
                    matchedIds.add(entry.id);
                }
            }
        }

        if (matchedIds.size === 0) {
            return [];
        }

        const packs: ContextPack[] = [];
        for (const packId of Array.from(matchedIds)) {
            const pack = await this.retrieve(packId);
            if (pack) {
                packs.push(pack);
            }
        }

        return packs;
    }

    /**
     * Get packs with decisions or constraints.
     */
    async getWithDecisions(projectId: string): Promise<ContextPack[]> {
        await this.init();

        const relevantIds = this.entries
            .filter((e) => e.projectId === projectId && (e.hasDecisions || e.hasConstraints))
            .map((e) => e.id);

        const packs: ContextPack[] = [];
        for (const packId of relevantIds) {
            const pack = await this.retrieve(packId);
            if (pack) {
                packs.push(pack);
            }
        }

        return packs;
    }

    /**
     * Delete a pack by ID.
     */
    async delete(packId: string): Promise<boolean> {
        await this.init();

        const entryIndex = this.entries.findIndex((e) => e.id === packId);
        if (entryIndex === -1) {
            return false;
        }

        // Remove from entries
        this.entries.splice(entryIndex, 1);
        this.saveIndex();

        // Delete file
        const packPath = path.join(this.packsDir, `${packId}.json`);
        if (fs.existsSync(packPath)) {
            fs.unlinkSync(packPath);
            return true;
        }

        return false;
    }

    /**
     * Clear all packs for a project.
     */
    async clearProject(projectId: string): Promise<number> {
        await this.init();

        const projectEntryIds = this.entries
            .filter((e) => e.projectId === projectId)
            .map((e) => e.id);

        let count = 0;
        for (const packId of projectEntryIds) {
            if (await this.delete(packId)) {
                count++;
            }
        }

        return count;
    }

    /**
     * Create an index entry from a pack.
     */
    private createEntry(pack: ContextPack): MemoryEntry {
        const keywords = extractKeywords(pack);
        return {
            id: pack.id,
            projectId: pack.projectId,
            promptId: pack.promptId,
            stage: this.extractStage(pack.promptId),
            timestamp: pack.generatedAt,
            keywords,
            tokenCount: pack.tokenCount,
            hasDecisions: pack.decisions.length > 0,
            hasConstraints: pack.constraints.length > 0,
        };
    }

    /**
     * Extract stage from prompt ID.
     */
    private extractStage(promptId: string): string {
        const parts = promptId.split(".");
        return parts[0] || "UNKNOWN";
    }
}

/**
 * Default memory store instance.
 */
let defaultStore: MemoryStore | null = null;

export function getMemoryStore(config?: Partial<MemoryStoreConfig>): MemoryStore {
    if (!defaultStore) {
        defaultStore = new MemoryStore({
            storageDir: config?.storageDir || ".rork/memory",
        });
    }
    return defaultStore;
}
