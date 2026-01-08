import type { BudgetTier } from "../../types/rork";
import type { FeatureRequirement, Conflict, Feature } from "../../types/idea";

const TIER_CAPABILITIES: Record<BudgetTier, FeatureRequirement[]> = {
  free: ["local-storage", "camera", "location"],
  starter: [
    "local-storage",
    "cloud-storage",
    "auth",
    "push-notifications",
    "camera",
    "location",
  ],
  pro: [
    "local-storage",
    "cloud-storage",
    "auth",
    "push-notifications",
    "real-time-sync",
    "camera",
    "location",
  ],
  scale: [
    "local-storage",
    "cloud-storage",
    "auth",
    "push-notifications",
    "real-time-sync",
    "camera",
    "location",
    "health-kit",
    "google-fit",
  ],
};

const REQUIREMENT_DESCRIPTIONS: Record<FeatureRequirement, string> = {
  "local-storage": "Local device storage",
  "cloud-storage": "Cloud database (Supabase)",
  auth: "User authentication",
  "push-notifications": "Push notifications",
  "real-time-sync": "Real-time data sync",
  camera: "Camera access",
  location: "Location services",
  "health-kit": "Apple HealthKit integration",
  "google-fit": "Google Fit integration",
};

const MINIMUM_TIER_FOR_REQUIREMENT: Record<FeatureRequirement, BudgetTier> = {
  "local-storage": "free",
  camera: "free",
  location: "free",
  "cloud-storage": "starter",
  auth: "starter",
  "push-notifications": "starter",
  "real-time-sync": "pro",
  "health-kit": "scale",
  "google-fit": "scale",
};

export function canTierSupport(
  requirement: FeatureRequirement,
  tier: BudgetTier
): boolean {
  return TIER_CAPABILITIES[tier].includes(requirement);
}

export function detectConflicts(
  features: Feature[],
  tier: BudgetTier
): Conflict[] {
  const conflicts: Conflict[] = [];

  for (const feature of features) {
    for (const requirement of feature.requires) {
      if (!canTierSupport(requirement, tier)) {
        const minTier = MINIMUM_TIER_FOR_REQUIREMENT[requirement];
        conflicts.push({
          featureId: feature.id,
          requirement,
          reason: `${REQUIREMENT_DESCRIPTIONS[requirement]} requires ${minTier} tier or higher`,
          resolution: `Upgrade to ${minTier} tier ($${tierToBudget(minTier)}/mo) or remove this feature`,
        });
      }
    }
  }

  return conflicts;
}

export function suggestMinimumTier(
  requirements: FeatureRequirement[]
): BudgetTier {
  const tierOrder: BudgetTier[] = ["free", "starter", "pro", "scale"];
  let maxTierIndex = 0;

  for (const req of requirements) {
    const minTier = MINIMUM_TIER_FOR_REQUIREMENT[req];
    const tierIndex = tierOrder.indexOf(minTier);
    if (tierIndex > maxTierIndex) {
      maxTierIndex = tierIndex;
    }
  }

  return tierOrder[maxTierIndex];
}

function tierToBudget(tier: BudgetTier): number {
  const budgets: Record<BudgetTier, number> = {
    free: 0,
    starter: 25,
    pro: 50,
    scale: 100,
  };
  return budgets[tier];
}

export function getAllRequirementsFromFeatures(
  features: Feature[]
): FeatureRequirement[] {
  const allReqs = new Set<FeatureRequirement>();
  for (const feature of features) {
    for (const req of feature.requires) {
      allReqs.add(req);
    }
  }
  return Array.from(allReqs);
}
