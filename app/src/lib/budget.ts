import type { BudgetTier, TierConfig } from "../types/rork";

const TIER_CONFIGS: Record<BudgetTier, TierConfig> = {
  free: {
    tier: "free",
    database: "supabase-free",
    auth: "supabase",
    storage: "r2-free",
    build: "eas-free",
  },
  starter: {
    tier: "starter",
    database: "supabase-pro",
    auth: "supabase",
    storage: "r2",
    build: "eas-production",
  },
  pro: {
    tier: "pro",
    database: "supabase-pro",
    auth: "clerk",
    storage: "r2-cdn",
    build: "eas-ota",
  },
  scale: {
    tier: "scale",
    database: "planetscale",
    auth: "clerk-pro",
    storage: "r2-edge",
    build: "eas-full",
  },
};

export function detectTier(budget: number): BudgetTier {
  if (budget <= 0) return "free";
  if (budget <= 25) return "starter";
  if (budget <= 50) return "pro";
  return "scale";
}

export function getTierConfig(budget: number): TierConfig {
  const tier = detectTier(budget);
  return TIER_CONFIGS[tier];
}

export function describeTier(tier: BudgetTier): string {
  const descriptions: Record<BudgetTier, string> = {
    free: "$0/mo - Supabase free, R2 free, EAS free builds",
    starter: "$25/mo - Supabase Pro, R2, EAS production builds",
    pro: "$50/mo - Supabase Pro, Clerk auth, R2+CDN, EAS+OTA",
    scale: "$100/mo - PlanetScale, Clerk Pro, R2+Edge, Full EAS",
  };
  return descriptions[tier];
}
