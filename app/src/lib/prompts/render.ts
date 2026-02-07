/**
 * Simple Template Renderer
 * 
 * A lightweight string replacement function to avoid full templating languages.
 * Uses {{varName}} syntax for variable substitution.
 * 
 * @example
 * const template = "Hello {{name}}, you have {{count}} items";
 * const output = render(template, { name: "World", count: 5 });
 * // Returns: "Hello World, you have 5 items"
 */

import type { PromptVars } from "./types";

/**
 * Regex pattern for variable substitution: {{variableName}}
 */
const VARIABLE_REGEX = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

/**
 * Renders a prompt template by substituting variables.
 * 
 * @param template - The prompt template string with {{variable}} placeholders
 * @param vars - Key-value pairs for variable substitution
 * @returns The rendered string with variables replaced
 * @throws Error if a variable is missing and strict mode is enabled
 */
export function render(
    template: string,
    vars: PromptVars,
    options?: { strict?: boolean }
): string {
    const strict = options?.strict ?? false;

    let result = template;
    let missingVars: string[] = [];

    result = result.replace(VARIABLE_REGEX, (_, varName) => {
        if (varName in vars) {
            const value = vars[varName];
            // Convert arrays to comma-separated strings
            if (Array.isArray(value)) {
                return value.join(", ");
            }
            // Convert booleans to lowercase strings
            if (typeof value === "boolean") {
                return String(value).toLowerCase();
            }
            return String(value);
        }
        missingVars.push(varName);
        return `{{${varName}}}`; // Keep placeholder if not found
    });

    if (strict && missingVars.length > 0) {
        throw new Error(
            `Missing required variables in prompt template: ${missingVars.join(", ")}`
        );
    }

    return result;
}

/**
 * Validates that all required variables are present in the vars object.
 * 
 * @param template - The prompt template to validate against
 * @param vars - Variables to check
 * @returns Array of missing variable names (empty if all present)
 */
export function validateRequiredVars(
    template: string,
    vars: PromptVars
): string[] {
    const missingVars: string[] = [];

    template.replace(VARIABLE_REGEX, (_, varName) => {
        if (!(varName in vars)) {
            missingVars.push(varName);
        }
        return "";
    });

    return missingVars;
}

/**
 * Extracts all variable names from a template.
 * 
 * @param template - The prompt template
 * @returns Array of variable names found in the template
 */
export function extractVars(template: string): string[] {
    const vars: string[] = [];
    template.replace(VARIABLE_REGEX, (_, varName) => {
        if (!vars.includes(varName)) {
            vars.push(varName);
        }
        return "";
    });
    return vars;
}
