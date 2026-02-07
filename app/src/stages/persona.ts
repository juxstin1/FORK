import * as fs from "fs";
import * as path from "path";
import type { PersonaSet } from "../types/persona";
import type { Requirements } from "../types/idea";
import type { RorkProject } from "../types/rork";
import { classifyApp } from "../lib/persona/categories";
import { buildResearchQueries } from "../lib/persona/research";
import {
  executeResearch,
  type ResearchExecutor,
  type ResearchResult,
} from "../lib/persona/web-research";
import { generatePersonas } from "../lib/persona/generator";
import {
  writePersonaFiles,
  type PersonaWriteResult,
} from "../lib/persona/writer";
import { getDefaultTemplate, mergeWithDefaults } from "../lib/persona/defaults";

export interface PersonaStageInput {
  projectDir: string;
  researchExecutor?: ResearchExecutor;
  secondaryCount?: 0 | 1 | 2;
  includeEdgeCase?: boolean;
}

export interface PersonaStageOutput {
  personaSet: PersonaSet;
  files: PersonaWriteResult;
  researchSummary: {
    queriesExecuted: number;
    sourcesFound: number;
    dataPointsExtracted: number;
  };
}

export async function runPersonaStage(
  input: PersonaStageInput
): Promise<PersonaStageOutput> {
  const { projectDir, researchExecutor, secondaryCount, includeEdgeCase } = input;

  // 1. Read requirements from IDEA stage
  const requirements = await readRequirements(projectDir);
  if (!requirements) {
    throw new Error(
      "Requirements not found. Please run IDEA stage first to generate .rork/features.json"
    );
  }

  // 2. Classify app category
  const categoryMatch = classifyApp(
    requirements.problem,
    requirements.features.map((f) => ({
      name: f.name,
      description: f.description,
    }))
  );

  // 3. Build research queries
  const queries = buildResearchQueries(categoryMatch.category, {
    demographic: requirements.targetUser.demographic,
    goal: requirements.targetUser.goal,
    context: requirements.targetUser.context,
  });

  // 4. Execute web research (or use defaults if no executor)
  let research: ResearchResult[] = [];
  let queriesExecuted = 0;
  let sourcesFound = 0;
  let dataPointsExtracted = 0;

  if (researchExecutor) {
    try {
      research = await executeResearch(queries, researchExecutor);
      queriesExecuted = queries.length;
      sourcesFound = new Set(
        research.filter((r) => r.source !== "search-failed").map((r) => r.source)
      ).size;
      dataPointsExtracted = research.reduce(
        (sum, r) => sum + r.dataPoints.length,
        0
      );
    } catch {
      // Research failed, will use defaults
      console.warn("Web research failed, using default templates");
    }
  }

  // 5. Generate personas (with defaults fallback)
  let personaSet = generatePersonas({
    category: categoryMatch.category,
    targetUser: {
      demographic: requirements.targetUser.demographic,
      goal: requirements.targetUser.goal,
      context: requirements.targetUser.context,
    },
    research,
    budget: requirements.tier,
    secondaryCount,
    includeEdgeCase,
  });

  // 6. Merge with defaults if research was sparse
  if (dataPointsExtracted < 5) {
    const defaults = getDefaultTemplate(categoryMatch.category);
    personaSet = {
      ...personaSet,
      primary: mergeWithDefaults(personaSet.primary, defaults.primary),
      secondary: personaSet.secondary.map((s, i) =>
        mergeWithDefaults(s, defaults.secondary[i] || {})
      ),
    };
  }

  // 7. Write persona files
  const files = await writePersonaFiles(projectDir, personaSet);

  // 8. Update project.json with persona paths
  await updateProjectConfig(projectDir, files);

  return {
    personaSet,
    files,
    researchSummary: {
      queriesExecuted,
      sourcesFound,
      dataPointsExtracted,
    },
  };
}

async function readRequirements(
  projectDir: string
): Promise<Requirements | null> {
  const jsonPath = path.join(projectDir, ".rork", "features.json");

  if (!fs.existsSync(jsonPath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(jsonPath, "utf-8");
    const parsed = JSON.parse(content);

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

async function updateProjectConfig(
  projectDir: string,
  files: PersonaWriteResult
): Promise<void> {
  const configPath = path.join(projectDir, ".rork", "project.json");

  if (!fs.existsSync(configPath)) {
    return;
  }

  try {
    const content = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(content) as RorkProject;

    const updatedConfig = {
      ...config,
      personasPrimaryPath: files.primaryMd,
      personasSecondaryPath: files.secondaryMd,
      personasJsonPath: files.personasJson,
      stage: "DESIGN" as const,
      updated: new Date().toISOString(),
    };

    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2), "utf-8");
  } catch {
    // Config update failed, not critical
  }
}

export function validatePersonaStageInput(
  input: unknown
): input is PersonaStageInput {
  if (!input || typeof input !== "object") return false;

  const i = input as Record<string, unknown>;
  return typeof i.projectDir === "string";
}
