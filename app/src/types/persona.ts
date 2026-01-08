export interface PersonaDemographics {
  ageRange: string;
  primaryGender?: string;
  location: string;
  income?: string;
  education?: string;
  occupation: string;
}

export interface TechProfile {
  devices: string[];
  appUsageFrequency: string;
  techComfort: 1 | 2 | 3 | 4 | 5;
  paymentWillingness: "free-only" | "low" | "moderate" | "high";
  privacyConcern: "low" | "moderate" | "high";
}

export interface BehaviorPattern {
  peakUsageTimes: string[];
  sessionDuration: string;
  primaryMotivation: string;
  frustrations: string[];
  alternatives: string[];
}

export interface Persona {
  id: string;
  name: string;
  type: "primary" | "secondary" | "edge-case";
  oneLiner: string;
  demographics: PersonaDemographics;
  techProfile: TechProfile;
  behavior: BehaviorPattern;
  goals: string[];
  painPoints: string[];
  quote: string;
  dataSource: string;
}

export interface PersonaSet {
  appCategory: string;
  generatedAt: string;
  primary: Persona;
  secondary: Persona[];
  researchSources: string[];
}
