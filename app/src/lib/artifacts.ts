import * as fs from "fs";
import * as path from "path";
import type { Feature } from "../types/idea.js";
import type { PersonaSet } from "../types/persona.js";
import type { DesignSpec } from "../stages/design.js";
import type { RorkProject } from "../types/rork.js";

function readJsonSafe<T>(filePath: string): T | null {
    try {
        if (!fs.existsSync(filePath)) return null;
        return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
    } catch {
        return null;
    }
}

export function readFeatures(projectDir: string): Feature[] | null {
    return readJsonSafe<Feature[]>(path.join(projectDir, ".rork", "features.json"));
}

export function readPersonas(projectDir: string): PersonaSet | null {
    return readJsonSafe<PersonaSet>(path.join(projectDir, ".rork", "personas", "personas.json"));
}

export function readDesign(projectDir: string): DesignSpec | null {
    return readJsonSafe<DesignSpec>(path.join(projectDir, ".rork", "design.json"));
}

export function readProjectConfig(projectDir: string): RorkProject | null {
    return readJsonSafe<RorkProject>(path.join(projectDir, ".rork", "project.json"));
}

export function readRequirements(projectDir: string): string | null {
    const filePath = path.join(projectDir, ".rork", "requirements.md");
    try {
        if (!fs.existsSync(filePath)) return null;
        return fs.readFileSync(filePath, "utf-8");
    } catch {
        return null;
    }
}
