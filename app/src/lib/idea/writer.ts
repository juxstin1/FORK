import * as fs from "fs";
import * as path from "path";
import type { Requirements } from "../../types/idea";
import { generateRequirementsMd, generateFeaturesJson } from "./generators";

export interface WriteResult {
  requirementsMd: string;
  featuresJson: string;
}

export async function writeRequirementsFiles(
  projectDir: string,
  requirements: Requirements
): Promise<WriteResult> {
  const rorkDir = path.join(projectDir, ".rork");

  // Ensure .rork directory exists
  if (!fs.existsSync(rorkDir)) {
    fs.mkdirSync(rorkDir, { recursive: true });
  }

  // Generate content
  const mdContent = generateRequirementsMd(requirements);
  const jsonContent = generateFeaturesJson(requirements);

  // Write files
  const mdPath = path.join(rorkDir, "requirements.md");
  const jsonPath = path.join(rorkDir, "features.json");

  fs.writeFileSync(mdPath, mdContent, "utf-8");
  fs.writeFileSync(jsonPath, jsonContent, "utf-8");

  return {
    requirementsMd: mdPath,
    featuresJson: jsonPath,
  };
}

export async function readRequirements(
  projectDir: string
): Promise<Requirements | null> {
  const jsonPath = path.join(projectDir, ".rork", "features.json");

  if (!fs.existsSync(jsonPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(jsonPath, "utf-8");
    const parsed = JSON.parse(content);

    // Reconstruct Requirements from JSON
    return {
      name: parsed.name,
      tagline: parsed.tagline,
      problem: parsed.problem,
      targetUser: parsed.targetUser,
      features: parsed.features,
      platforms: parsed.platforms,
      offlineSupport: parsed.offlineSupport,
      tier: parsed.tier,
      conflicts: parsed.conflicts,
    } as Requirements;
  } catch {
    return null;
  }
}

export function requirementsExist(projectDir: string): boolean {
  const mdPath = path.join(projectDir, ".rork", "requirements.md");
  const jsonPath = path.join(projectDir, ".rork", "features.json");
  return fs.existsSync(mdPath) && fs.existsSync(jsonPath);
}
