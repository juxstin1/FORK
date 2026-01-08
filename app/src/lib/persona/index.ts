// Categories
export { classifyApp, getAllCategories, getCategoryDisplayName } from "./categories";
export type { AppCategory, CategoryMatch } from "./categories";

// Research
export { buildResearchQueries, getQueryPurposes, getPurposeDescription } from "./research";
export type { ResearchQuery, ResearchPurpose } from "./research";

// Web Research
export { executeResearch, extractDataPoints, aggregateByPurpose } from "./web-research";
export type {
  ResearchResult,
  DataPoint,
  DataPointType,
  ResearchExecutor,
} from "./web-research";

// Generator
export { generatePersonas } from "./generator";
export type { PersonaGeneratorInput } from "./generator";

// Writer
export {
  writePersonaFiles,
  readPersonaSet,
  personasExist,
  generatePrimaryPersonaMd,
  generateSecondaryPersonasMd,
  generatePersonasJson,
} from "./writer";
export type { PersonaWriteResult } from "./writer";

// Defaults
export { getDefaultTemplate, mergeWithDefaults, DEFAULT_TEMPLATES } from "./defaults";
export type { DefaultPersonaTemplate } from "./defaults";
