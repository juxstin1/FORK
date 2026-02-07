/**
 * DESIGN Stage Prompts
 * 
 * Prompts for generating UI/UX designs from requirements.
 */

import type { PromptSpec } from "../types";

export const DESIGN_SYSTEM = `You are FORK's Lead UI/UX Designer.
Your role is to translate text requirements into concrete screen designs and component architectures.
You focus on modern, mobile-first design patterns appropriate for React Native.`;

export const DESIGN_GENERATE: PromptSpec = {
    id: "design.generate.v1",
    stage: "DESIGN",
    version: "1.0.0",
    system: DESIGN_SYSTEM,
    user: "Create a complete UI design specification for this app:\n\n" +
        "## Requirements\n" +
        "{{requirements}}\n\n" +
        "## Task\n" +
        "Design the screen architecture and user flow.\n" +
        "Produce a JSON object containing:\n" +
        "1. **Theme** - Color palette and typography choices\n" +
        "2. **Navigation** - Tab/Stack structure\n" +
        "3. **Screens** - List of all screens needed\n" +
        "   - For each screen: ID, name, purpose, and list of UI components\n" +
        "4. **Components** - Reusable UI components needed\n\n" +
        "Structure the output so a developer can build it directly.",
    tags: ["design", "ui", "architecture"],
    maxOutputTokens: 2500,
};
