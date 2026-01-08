import type { BudgetTier } from "./rork";

export type FeaturePriority = "must-have" | "should-have" | "nice-to-have";
export type OfflineSupport = "required" | "nice-to-have" | "not-needed";

export type FeatureRequirement =
  | "local-storage"
  | "cloud-storage"
  | "auth"
  | "push-notifications"
  | "real-time-sync"
  | "camera"
  | "location"
  | "health-kit"
  | "google-fit";

export interface Feature {
  id: string;
  name: string;
  priority: FeaturePriority;
  description: string;
  requires: FeatureRequirement[];
  excludes: string[];
}

export interface TargetUser {
  demographic: string;
  goal: string;
  context: string;
}

export interface Conflict {
  featureId: string;
  requirement: FeatureRequirement;
  reason: string;
  resolution: string;
}

export interface Requirements {
  name: string;
  tagline: string;
  problem: string;
  targetUser: TargetUser;
  features: Feature[];
  platforms: ("ios" | "android")[];
  offlineSupport: OfflineSupport;
  tier: BudgetTier;
  conflicts: Conflict[];
}
