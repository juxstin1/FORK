/**
 * PERSONA Stage Prompts
 * 
 * Prompts for generating user personas based on requirements and research.
 */

import type { PromptSpec } from "../types";

export const PERSONA_SYSTEM = `You are FORK's Persona Engine.
Your role is to create realistic, data-driven user personas that will guide app development.
Each persona should be specific enough to inform design decisions.`;

export const PERSONA_GENERATE: PromptSpec = {
    id: "persona.generate.v1",
    stage: "PERSONA",
    version: "1.0.0",
    system: PERSONA_SYSTEM,
    user: "Generate user personas for this app:\n\n" +
        "## App Requirements\n" +
        "{{requirements}}\n\n" +
        "## Target Demographics\n" +
        "Primary demographic: {{demographic}}\n" +
        "Goal: {{goal}}\n" +
        "Context: {{context}}\n\n" +
        "## Research Data\n" +
        "{{researchData}}\n\n" +
        "## Task\n" +
        "Generate a complete persona set:\n" +
        "1. **One Primary Persona** - The ideal target user\n" +
        "2. **Two Secondary Personas** - Additional key user types\n" +
        "3. **One Edge-Case Persona** - Unusual but important user\n\n" +
        "For each persona include:\n" +
        "- Name, age, occupation\n" +
        "- Tech profile (devices, comfort level 1-5)\n" +
        "- Behavior patterns (peak times, session duration)\n" +
        "- Goals and frustrations\n" +
        "- Quote that captures their mindset\n\n" +
        "Format as structured JSON.",
    tags: ["persona", "user-research", "generation"],
    maxOutputTokens: 2000,
};

export const PERSONA_RESEARCH_QUERY: PromptSpec = {
    id: "persona.research.v1",
    stage: "PERSONA",
    version: "1.0.0",
    system: PERSONA_SYSTEM,
    user: "Build research queries for this app category:\n\n" +
        "## App Category\n" +
        "{{category}}\n\n" +
        "## Target User\n" +
        "Demographic: {{demographic}}\n" +
        "Goal: {{goal}}\n\n" +
        "## Task\n" +
        "Create 3-5 research queries to find:\n" +
        "1. User behavior patterns for this app type\n" +
        "2. Pain points and frustrations\n" +
        "3. Feature expectations and preferences\n\n" +
        "Each query should be specific and answerable.",
    tags: ["persona", "research", "query-building"],
    maxOutputTokens: 500,
};

export const PERSONA_VALIDATE: PromptSpec = {
    id: "persona.validate.v1",
    stage: "PERSONA",
    version: "1.0.0",
    system: PERSONA_SYSTEM,
    user: "Validate these personas against the requirements:\n\n" +
        "## Personas\n" +
        "{{personas}}\n\n" +
        "## Requirements\n" +
        "{{requirements}}\n\n" +
        "## Task\n" +
        "Check:\n" +
        "1. Do personas cover all target user types?\n" +
        "2. Are there any gaps or redundancies?\n" +
        "3. Are personas realistic given the app scope?\n\n" +
        "Provide a validation score (0-1) and recommendations.",
    tags: ["persona", "validation", "quality"],
    maxOutputTokens: 600,
};
