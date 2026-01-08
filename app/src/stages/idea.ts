import type { Requirements, Conflict, Feature } from "../types/idea";
import type { BudgetTier } from "../types/rork";
import { detectTier } from "../lib/budget";
import { detectConflicts } from "../lib/idea/constraints";
import { inferPlatforms } from "../lib/idea/platforms";
import { writeRequirementsFiles, type WriteResult } from "../lib/idea/writer";

export interface IdeaStageInput {
  idea: string;
  budget: number;
  platforms?: ("ios" | "android")[];
  projectDir: string;
}

export interface IdeaStageOutput {
  requirements: Requirements;
  conflicts: Conflict[];
  files: WriteResult;
  platformHints: {
    confidence: "explicit" | "inferred" | "default";
    reason: string;
  };
}

export interface ParsedIdea {
  name: string;
  tagline: string;
  problem: string;
  targetUser: {
    demographic: string;
    goal: string;
    context: string;
  };
  features: Feature[];
  offlineSupport: "required" | "nice-to-have" | "not-needed";
}

export async function runIdeaStage(
  input: IdeaStageInput,
  parsedIdea: ParsedIdea
): Promise<IdeaStageOutput> {
  // 1. Detect budget tier
  const tier: BudgetTier = detectTier(input.budget);

  // 2. Infer platforms from idea (or use provided override)
  const platformResult = inferPlatforms(input.idea, parsedIdea.features);
  const platforms = input.platforms ?? platformResult.platforms;

  // 3. Detect conflicts between features and budget tier
  const conflicts = detectConflicts(parsedIdea.features, tier);

  // 4. Build requirements object
  const requirements: Requirements = {
    name: parsedIdea.name,
    tagline: parsedIdea.tagline,
    problem: parsedIdea.problem,
    targetUser: parsedIdea.targetUser,
    features: parsedIdea.features,
    platforms,
    offlineSupport: parsedIdea.offlineSupport,
    tier,
    conflicts,
  };

  // 5. Write files to .rork directory
  const files = await writeRequirementsFiles(input.projectDir, requirements);

  return {
    requirements,
    conflicts,
    files,
    platformHints: {
      confidence: platformResult.confidence,
      reason: platformResult.reason,
    },
  };
}

export function createFeature(
  id: string,
  name: string,
  description: string,
  options?: {
    priority?: "must-have" | "should-have" | "nice-to-have";
    requires?: Feature["requires"];
    excludes?: string[];
  }
): Feature {
  return {
    id,
    name,
    description,
    priority: options?.priority ?? "must-have",
    requires: options?.requires ?? [],
    excludes: options?.excludes ?? [],
  };
}

export function validateParsedIdea(parsed: unknown): parsed is ParsedIdea {
  if (!parsed || typeof parsed !== "object") return false;

  const p = parsed as Record<string, unknown>;

  return (
    typeof p.name === "string" &&
    typeof p.tagline === "string" &&
    typeof p.problem === "string" &&
    typeof p.targetUser === "object" &&
    p.targetUser !== null &&
    Array.isArray(p.features) &&
    ["required", "nice-to-have", "not-needed"].includes(
      p.offlineSupport as string
    )
  );
}
