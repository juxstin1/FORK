import type { BuildFile } from "./build.js";

interface ValidationResult {
    file: string;
    issues: string[];
}

const CHECKS: { name: string; pattern: RegExp; message: string; fileFilter?: RegExp }[] = [
    {
        name: "missing-default-export",
        pattern: /export default /,
        message: "Screen file missing default export",
        fileFilter: /screens\//,
    },
    {
        name: "inline-styles",
        pattern: /style=\{\{/,
        message: "Inline style object detected — use NativeWind className instead",
    },
    {
        name: "stylesheet-create",
        pattern: /StyleSheet\.create/,
        message: "StyleSheet.create detected — use NativeWind className instead",
    },
    {
        name: "any-type",
        pattern: /:\s*any\b/,
        message: "TypeScript `any` type detected — use a specific type",
    },
    {
        name: "as-any",
        pattern: /as\s+any\b/,
        message: "TypeScript `as any` cast detected — use proper typing",
    },
    {
        name: "console-log",
        pattern: /console\.(log|warn|error)\(/,
        message: "console.log/warn/error left in code — remove or guard with __DEV__",
    },
    {
        name: "hardcoded-color",
        pattern: /#[0-9a-fA-F]{3,8}(?!.*(?:theme|colors|COLORS|palette))/,
        message: "Possible hardcoded color — consider using theme/NativeWind classes",
    },
    {
        name: "missing-safe-area",
        pattern: /SafeAreaView/,
        message: "Screen missing SafeAreaView — wrap content in SafeAreaView",
        fileFilter: /screens\//,
    },
];

export function validateBuildFiles(files: BuildFile[]): ValidationResult[] {
    const results: ValidationResult[] = [];

    for (const file of files) {
        const issues: string[] = [];

        for (const check of checks(file.path)) {
            if (check.name === "missing-default-export" || check.name === "missing-safe-area") {
                // These are "must have" checks — fail if pattern is NOT found
                if (!check.pattern.test(file.content)) {
                    issues.push(check.message);
                }
            } else {
                // These are "must not have" checks — fail if pattern IS found
                if (check.pattern.test(file.content)) {
                    issues.push(check.message);
                }
            }
        }

        if (issues.length > 0) {
            results.push({ file: file.path, issues });
        }
    }

    return results;
}

function checks(filePath: string) {
    return CHECKS.filter((c) => !c.fileFilter || c.fileFilter.test(filePath));
}
