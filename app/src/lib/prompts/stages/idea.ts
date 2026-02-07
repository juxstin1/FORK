/**
 * IDEA Stage Prompts
 * 
 * Prompts for the IDEA stage where user ideas are transformed into structured requirements.
 */

import type { PromptSpec } from "../types";

export const IDEA_SYSTEM = `You are FORK, an AI-powered app development assistant. 
Your role is to help users transform their app ideas into clear, actionable requirements.
Be thorough but concise. Focus on the core problem and target user needs.`;

export const IDEA_GENERATE: PromptSpec = {
    id: "idea.generate.v1",
    stage: "IDEA",
    version: "1.0.0",
    system: IDEA_SYSTEM,
    user: "Transform this app idea into structured requirements:\n\n" +
        "## User Input\n" +
        "{{idea}}\n" +
        "Budget: USD {{budget}}\n" +
        "Platform target: {{platforms}}\n\n" +
        "## Task\n" +
        "Analyze the idea and produce:\n" +
        "1. **Name** - A catchy app name (2-4 words)\n" +
        "2. **Tagline** - A one-sentence value proposition\n" +
        "3. **Problem Statement** - What problem does this solve?\n" +
        "4. **Target User** - Who is this for?\n" +
        "5. **Core Features** - List 5-8 essential features\n" +
        "6. **Offline Needs** - Is offline support needed?\n" +
        "7. **Platform Suggestions** - Recommend iOS/Android/web\n\n" +
        "Format your response as JSON with these fields.",
    tags: ["requirements", "ideation", "structured"],
    maxOutputTokens: 1500,
};

export const IDEA_REFINE: PromptSpec = {
    id: "idea.refine.v1",
    stage: "IDEA",
    version: "1.0.0",
    system: IDEA_SYSTEM,
    user: "Refine these requirements based on user feedback:\n\n" +
        "## Current Requirements\n" +
        "{{currentRequirements}}\n\n" +
        "## User Feedback\n" +
        "{{feedback}}\n\n" +
        "## Task\n" +
        "Update the requirements to address the feedback while maintaining scope and quality.\n" +
        "Explain any changes made and why.",
    tags: ["requirements", "refinement", "iterative"],
    maxOutputTokens: 1000,
};

export const IDEA_CONFLICT_CHECK: PromptSpec = {
    id: "idea.conflict.v1",
    stage: "IDEA",
    version: "1.0.0",
    system: IDEA_SYSTEM,
    user: "Analyze these features for conflicts with the {{tier}} budget tier:\n\n" +
        "## Features\n" +
        "{{features}}\n\n" +
        "## Budget Tier\n" +
        "{{tier}} (Available: {{tierFeatures}})\n\n" +
        "## Task\n" +
        "Identify any conflicts:\n" +
        "- Features that require expensive integrations\n" +
        "- Features that exceed tier capabilities\n" +
        "- Features that conflict with each other\n\n" +
        "For each conflict, provide:\n" +
        "1. The conflicting feature\n" +
        "2. The issue\n" +
        "3. Recommended resolution",
    tags: ["requirements", "conflict-detection", "budget"],
    maxOutputTokens: 800,
};
