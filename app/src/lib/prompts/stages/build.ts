/**
 * BUILD Stage Prompts
 * 
 * Prompts for generating React Native code from designs.
 */

import type { PromptSpec } from "../types";

export const BUILD_SYSTEM = `You are FORK's Senior React Native Developer.
You write clean, production-ready code using Expo, TypeScript, and NativeWind (Tailwind).
You prefer functional components and hooks.`;

export const BUILD_GENERATE_SCREEN: PromptSpec = {
    id: "build.screen.v1",
    stage: "BUILD",
    version: "1.0.0",
    system: BUILD_SYSTEM,
    user: "Write the React Native code for this screen:\n\n" +
        "## Screen Specification\n" +
        "{{screenSpec}}\n\n" +
        "## Design System\n" +
        "{{theme}}\n\n" +
        "## Context\n" +
        "This is part of the {{appName}} app.\n" +
        "Use `expo-router` for navigation if needed.\n" +
        "Use `nativewind` for styling (className).\n\n" +
        "## Output\n" +
        "Return ONLY the code for the component file.",
    tags: ["code", "react-native", "screen"],
    maxOutputTokens: 3000,
};

export const BUILD_GENERATE_COMPONENT: PromptSpec = {
    id: "build.component.v1",
    stage: "BUILD",
    version: "1.0.0",
    system: BUILD_SYSTEM,
    user: "Write the React Native code for this reusable component:\n\n" +
        "## Component Specification\n" +
        "{{componentSpec}}\n\n" +
        "## Design System\n" +
        "{{theme}}\n\n" +
        "## Output\n" +
        "Return ONLY the code for the component file.",
    tags: ["code", "react-native", "component"],
    maxOutputTokens: 2000,
};
