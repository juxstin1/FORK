/**
 * Prompt Registry Types
 * 
 * Every stage prompt lives in one place with versioning + metadata.
 */

/**
 * Shape of a prompt specification in the registry.
 */
export type PromptSpec = {
    /** Unique identifier following semver pattern: "stage.major.minor" */
    id: string;
    /** Stage name this prompt belongs to */
    stage: string;
    /** Semantic version of this prompt */
    version: string;
    /** Optional system message for the LLM */
    system?: string;
    /** The main user prompt template */
    user: string;
    /** Tags for categorization and filtering */
    tags?: string[];
    /** Maximum tokens for output (overrides model default) */
    maxOutputTokens?: number;
};

/** Variables passed to render() function */
export type PromptVars = Record<string, string | number | boolean | string[]>;

export type PromptRegistry = Record<string, PromptSpec>;
