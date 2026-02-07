/**
 * Prompt Registry
 * 
 * Centralized prompt management for all stages.
 * Prompts can only be accessed by ID - no inline prompts allowed.
 * 
 * Usage:
 *   import { getPrompt, renderPrompt } from 'lib/prompts';
 *   
 *   const spec = getPrompt('idea.generate.v1');
 *   const rendered = renderPrompt(spec, { idea: 'My app idea', budget: 500 });
 */

export * from "./types";
export * from "./render";

// Stage prompts
export * from "./stages/idea";
// Stage prompts
export * from "./stages/idea";
export * from "./stages/persona";
export * from "./stages/design";
export * from "./stages/build";

// Import types for convenience
import type { PromptSpec, PromptRegistry, PromptVars } from "./types";
import { render as renderTemplate } from "./render";

/**
 * The central prompt registry.
 * All prompts must be registered here with unique IDs.
 */
export const REGISTRY: PromptRegistry = {
    // IDEA Stage
    "idea.generate.v1": {
        id: "idea.generate.v1",
        stage: "IDEA",
        version: "1.0.0",
        system: "You are FORK, an AI-powered app development assistant. Your role is to help users transform their app ideas into clear, actionable requirements. Be thorough but concise. Focus on the core problem and target user needs.",
        user: "Transform this app idea into structured requirements:\n\n## User Input\n{{idea}}\nBudget: USD {{budget}}\nPlatform target: {{platforms}}\n\n## Task\nAnalyze the idea and produce:\n1. **Name** - A catchy app name (2-4 words)\n2. **Tagline** - A one-sentence value proposition\n3. **Problem Statement** - What problem does this solve?\n4. **Target User** - Who is this for?\n5. **Core Features** - List 5-8 essential features\n6. **Offline Needs** - Is offline support needed?\n7. **Platform Suggestions** - Recommend iOS/Android/web\n\nFormat your response as JSON with these fields.",
        tags: ["requirements", "ideation", "structured"],
        maxOutputTokens: 1500,
    },
    "idea.refine.v1": {
        id: "idea.refine.v1",
        stage: "IDEA",
        version: "1.0.0",
        system: "You are FORK, an AI-powered app development assistant. Your role is to help users transform their app ideas into clear, actionable requirements. Be thorough but concise. Focus on the core problem and target user needs.",
        user: "Refine these requirements based on user feedback:\n\n## Current Requirements\n{{currentRequirements}}\n\n## User Feedback\n{{feedback}}\n\n## Task\nUpdate the requirements to address the feedback while maintaining scope and quality. Explain any changes made and why.",
        tags: ["requirements", "refinement", "iterative"],
        maxOutputTokens: 1000,
    },
    "idea.conflict.v1": {
        id: "idea.conflict.v1",
        stage: "IDEA",
        version: "1.0.0",
        system: "You are FORK, an AI-powered app development assistant. Your role is to help users transform their app ideas into clear, actionable requirements. Be thorough but concise. Focus on the core problem and target user needs.",
        user: "Analyze these features for conflicts with the {{tier}} budget tier:\n\n## Features\n{{features}}\n\n## Budget Tier\n{{tier}} (Available: {{tierFeatures}})\n\n## Task\nIdentify any conflicts:\n- Features that require expensive integrations\n- Features that exceed tier capabilities\n- Features that conflict with each other\n\nFor each conflict, provide:\n1. The conflicting feature\n2. The issue\n3. Recommended resolution",
        tags: ["requirements", "conflict-detection", "budget"],
        maxOutputTokens: 800,
    },

    // PERSONA Stage
    "persona.generate.v1": {
        id: "persona.generate.v1",
        stage: "PERSONA",
        version: "1.0.0",
        system: "You are FORK's Persona Engine. Your role is to create realistic, data-driven user personas that will guide app development. Each persona should be specific enough to inform design decisions.",
        user: "Generate user personas for this app:\n\n## App Requirements\n{{requirements}}\n\n## Target Demographics\nPrimary demographic: {{demographic}}\nGoal: {{goal}}\nContext: {{context}}\n\n## Research Data\n{{researchData}}\n\n## Task\nGenerate a complete persona set:\n1. **One Primary Persona** - The ideal target user\n2. **Two Secondary Personas** - Additional key user types\n3. **One Edge-Case Persona** - Unusual but important user\n\nFor each persona include:\n- Name, age, occupation\n- Tech profile (devices, comfort level 1-5)\n- Behavior patterns (peak times, session duration)\n- Goals and frustrations\n- Quote that captures their mindset\n\nFormat as structured JSON.",
        tags: ["persona", "user-research", "generation"],
        maxOutputTokens: 2000,
    },
    "persona.research.v1": {
        id: "persona.research.v1",
        stage: "PERSONA",
        version: "1.0.0",
        system: "You are FORK's Persona Engine. Your role is to create realistic, data-driven user personas that will guide app development. Each persona should be specific enough to inform design decisions.",
        user: "Build research queries for this app category:\n\n## App Category\n{{category}}\n\n## Target User\nDemographic: {{demographic}}\nGoal: {{goal}}\n\n## Task\nCreate 3-5 research queries to find:\n1. User behavior patterns for this app type\n2. Pain points and frustrations\n3. Feature expectations and preferences\n\nEach query should be specific and answerable.",
        tags: ["persona", "research", "query-building"],
        maxOutputTokens: 500,
    },
    "persona.validate.v1": {
        id: "persona.validate.v1",
        stage: "PERSONA",
        version: "1.0.0",
        system: "You are FORK's Persona Engine. Your role is to create realistic, data-driven user personas that will guide app development. Each persona should be specific enough to inform design decisions.",
        user: "Validate these personas against the requirements:\n\n## Personas\n{{personas}}\n\n## Requirements\n{{requirements}}\n\n## Task\nCheck:\n1. Do personas cover all target user types?\n2. Are there any gaps or redundancies?\n3. Are personas realistic given the app scope?\n\nProvide a validation score (0-1) and recommendations.",
        tags: ["persona", "validation", "quality"],
        maxOutputTokens: 600,
    },

    // DESIGN Stage
    "design.generate.v1": {
        id: "design.generate.v1",
        stage: "DESIGN",
        version: "1.0.0",
        system: "You are FORK's Lead UI/UX Designer. Your role is to translate text requirements into concrete screen designs and component architectures. You focus on modern, mobile-first design patterns appropriate for React Native.",
        user: "Create a complete UI design specification for this app:\n\n## Requirements\n{{requirements}}\n\n## Task\nDesign the screen architecture and user flow.\nProduce a JSON object containing:\n1. **Theme** - Color palette and typography choices\n2. **Navigation** - Tab/Stack structure\n3. **Screens** - List of all screens needed\n   - For each screen: ID, name, purpose, and list of UI components\n4. **Components** - Reusable UI components needed\n\nStructure the output so a developer can build it directly.",
        tags: ["design", "ui", "architecture"],
        maxOutputTokens: 2500,
    },

    // BUILD Stage
    "build.screen.v1": {
        id: "build.screen.v1",
        stage: "BUILD",
        version: "1.0.0",
        system: "You are FORK's Senior React Native Developer. You write clean, production-ready code using Expo, TypeScript, and NativeWind (Tailwind). You prefer functional components and hooks.",
        user: "Write the React Native code for this screen:\n\n## Screen Specification\n{{screenSpec}}\n\n## Design System\n{{theme}}\n\n## Context\nThis is part of the {{appName}} app.\nUse `expo-router` for navigation if needed.\nUse `nativewind` for styling (className).\n\n## Output\nReturn ONLY the code for the component file.",
        tags: ["code", "react-native", "screen"],
        maxOutputTokens: 3000,
    },
    "build.component.v1": {
        id: "build.component.v1",
        stage: "BUILD",
        version: "1.0.0",
        system: "You are FORK's Senior React Native Developer. You write clean, production-ready code using Expo, TypeScript, and NativeWind (Tailwind). You prefer functional components and hooks.",
        user: "Write the React Native code for this reusable component:\n\n## Component Specification\n{{componentSpec}}\n\n## Design System\n{{theme}}\n\n## Output\nReturn ONLY the code for the component file.",
        tags: ["code", "react-native", "component"],
        maxOutputTokens: 2000,
    },
};

/**
 * Get a prompt specification by ID.
 * 
 * @param id - The prompt ID (e.g., "idea.generate.v1")
 * @returns The PromptSpec if found
 * @throws Error if prompt ID is not found
 */
export function getPrompt(id: string): PromptSpec {
    const prompt = REGISTRY[id];
    if (!prompt) {
        const availableIds = Object.keys(REGISTRY).join(", ");
        throw new Error(
            `Prompt "${id}" not found in registry. Available prompts: ${availableIds}`
        );
    }
    return prompt;
}

/**
 * Check if a prompt ID exists in the registry.
 */
export function hasPrompt(id: string): boolean {
    return id in REGISTRY;
}

/**
 * Get all prompts for a specific stage.
 */
export function getPromptsForStage(stage: string): PromptSpec[] {
    return Object.values(REGISTRY).filter((p) => p.stage === stage);
}

/**
 * Get all prompt IDs for a specific stage.
 */
export function getPromptIdsForStage(stage: string): string[] {
    return Object.keys(REGISTRY).filter((id) => REGISTRY[id].stage === stage);
}

/**
 * Render a prompt by ID with variables.
 * Convenience function that combines getPrompt and render.
 * 
 * @param id - The prompt ID
 * @param vars - Variables to substitute
 * @returns The rendered prompt string
 */
export function renderPrompt(id: string, vars: PromptVars): string {
    const spec = getPrompt(id);
    return renderTemplate(spec.user, vars);
}

/**
 * Get the full prompt object (system + user) rendered with variables.
 * 
 * @param id - The prompt ID
 * @param vars - Variables to substitute
 * @returns Object with system and user messages ready for LLM
 */
export function getRenderedPrompt(
    id: string,
    vars: PromptVars
): { system?: string; user: string; maxOutputTokens?: number } {
    const spec = getPrompt(id);
    return {
        system: spec.system ? renderTemplate(spec.system, vars) : undefined,
        user: renderTemplate(spec.user, vars),
        maxOutputTokens: spec.maxOutputTokens,
    };
}

/**
 * List all prompt IDs in the registry.
 */
export function listAllPromptIds(): string[] {
    return Object.keys(REGISTRY);
}

/**
 * Get registry metadata (for debugging/UI).
 */
export function getRegistryInfo(): {
    totalPrompts: number;
    byStage: Record<string, number>;
    versions: string[];
} {
    const prompts = Object.values(REGISTRY);
    const byStage: Record<string, number> = {};
    const versions = new Set<string>();

    for (const prompt of prompts) {
        byStage[prompt.stage] = (byStage[prompt.stage] || 0) + 1;
        versions.add(prompt.version);
    }

    return {
        totalPrompts: prompts.length,
        byStage,
        versions: Array.from(versions),
    };
}
