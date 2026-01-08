import type { Feature, FeatureRequirement } from "../../types/idea";

export type Platform = "ios" | "android";
export type PlatformConfidence = "explicit" | "inferred" | "default";

export interface PlatformHints {
  platforms: Platform[];
  confidence: PlatformConfidence;
  reason: string;
}

const IOS_KEYWORDS = [
  "iphone",
  "ipad",
  "ios",
  "apple health",
  "healthkit",
  "health kit",
  "apple watch",
  "watchos",
  "siri",
  "app store",
];

const ANDROID_KEYWORDS = [
  "android",
  "google fit",
  "googlefit",
  "pixel",
  "samsung",
  "play store",
  "google play",
  "wear os",
];

const IOS_ONLY_REQUIREMENTS: FeatureRequirement[] = ["health-kit"];
const ANDROID_ONLY_REQUIREMENTS: FeatureRequirement[] = ["google-fit"];

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function findKeywords(text: string, keywords: string[]): string[] {
  const normalized = normalizeText(text);
  return keywords.filter((keyword) => normalized.includes(keyword));
}

export function inferPlatforms(idea: string, features: Feature[]): PlatformHints {
  const normalizedIdea = normalizeText(idea);

  // Check for explicit platform keywords
  const iosKeywordsFound = findKeywords(normalizedIdea, IOS_KEYWORDS);
  const androidKeywordsFound = findKeywords(normalizedIdea, ANDROID_KEYWORDS);

  // Check feature requirements for platform-specific needs
  const allRequirements = features.flatMap((f) => f.requires);
  const needsIosOnly = allRequirements.some((r) =>
    IOS_ONLY_REQUIREMENTS.includes(r)
  );
  const needsAndroidOnly = allRequirements.some((r) =>
    ANDROID_ONLY_REQUIREMENTS.includes(r)
  );

  // Explicit iOS only
  if (iosKeywordsFound.length > 0 && androidKeywordsFound.length === 0) {
    return {
      platforms: ["ios"],
      confidence: "explicit",
      reason: `Found iOS keywords: ${iosKeywordsFound.join(", ")}`,
    };
  }

  // Explicit Android only
  if (androidKeywordsFound.length > 0 && iosKeywordsFound.length === 0) {
    return {
      platforms: ["android"],
      confidence: "explicit",
      reason: `Found Android keywords: ${androidKeywordsFound.join(", ")}`,
    };
  }

  // Both platforms mentioned explicitly
  if (iosKeywordsFound.length > 0 && androidKeywordsFound.length > 0) {
    return {
      platforms: ["ios", "android"],
      confidence: "explicit",
      reason: `Found both iOS (${iosKeywordsFound.join(", ")}) and Android (${androidKeywordsFound.join(", ")}) keywords`,
    };
  }

  // Inferred from feature requirements
  if (needsIosOnly && !needsAndroidOnly) {
    return {
      platforms: ["ios"],
      confidence: "inferred",
      reason: "Features require iOS-only capabilities (HealthKit)",
    };
  }

  if (needsAndroidOnly && !needsIosOnly) {
    return {
      platforms: ["android"],
      confidence: "inferred",
      reason: "Features require Android-only capabilities (Google Fit)",
    };
  }

  if (needsIosOnly && needsAndroidOnly) {
    return {
      platforms: ["ios", "android"],
      confidence: "inferred",
      reason: "Features require both iOS and Android-specific capabilities",
    };
  }

  // Default: both platforms
  return {
    platforms: ["ios", "android"],
    confidence: "default",
    reason: "No platform-specific requirements detected, defaulting to both",
  };
}

export function getPlatformSpecificRequirements(
  platform: Platform
): FeatureRequirement[] {
  if (platform === "ios") {
    return IOS_ONLY_REQUIREMENTS;
  }
  return ANDROID_ONLY_REQUIREMENTS;
}

export function isRequirementPlatformSpecific(
  requirement: FeatureRequirement
): Platform | null {
  if (IOS_ONLY_REQUIREMENTS.includes(requirement)) {
    return "ios";
  }
  if (ANDROID_ONLY_REQUIREMENTS.includes(requirement)) {
    return "android";
  }
  return null;
}
