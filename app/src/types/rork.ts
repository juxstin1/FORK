export type BudgetTier = "free" | "starter" | "pro" | "scale";

export type Stage = "INIT" | "IDEA" | "DESIGN" | "BUILD" | "TEST" | "DEBUG" | "SHIP";

export interface RorkProject {
  name: string;
  idea: string;
  budget: number;
  tier: BudgetTier;
  stage: Stage;
  platforms: ("ios" | "android")[];
  created: string;
  updated: string;
  requirementsPath?: string;
  featuresPath?: string;
  personasPrimaryPath?: string;
  personasSecondaryPath?: string;
  personasJsonPath?: string;
}

export interface TierConfig {
  tier: BudgetTier;
  database: "supabase-free" | "supabase-pro" | "planetscale";
  auth: "supabase" | "clerk" | "clerk-pro";
  storage: "r2-free" | "r2" | "r2-cdn" | "r2-edge";
  build: "eas-free" | "eas-production" | "eas-ota" | "eas-full";
}
