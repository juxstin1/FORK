export type LifeStage = "egg" | "baby" | "teen" | "adult" | "elder";
export type TimeOfDay = "dawn" | "day" | "dusk" | "night";
export type Mood = "happy" | "neutral" | "sad" | "sleeping";
export type GlyphTheme = "default" | "dot-matrix" | "ascii" | "braille" | "circuit";

export interface PetStats {
  hunger: number;    // 0-100
  happiness: number; // 0-100
  energy: number;    // 0-100
  hygiene: number;   // 0-100
}

export interface Pet {
  name: string;
  stage: LifeStage;
  stats: PetStats;
  bornAt: number;        // timestamp
  lastUpdated: number;   // timestamp
  lastFed: number;
  lastPlayed: number;
  lastCleaned: number;
  lastRested: number;
  isDead: boolean;
}

export interface GravePet {
  name: string;
  finalStage: LifeStage;
  bornAt: number;
  diedAt: number;
  daysLived: number;
  peakHappiness: number;
  glyphTheme: GlyphTheme;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface GameScores {
  glyphMatch: number;
  rhythmTap: number;
  memoryGrid: number;
}

export interface AppSettings {
  hungerAlerts: boolean;
  lonelinessNudges: boolean;
  hapticFeedback: boolean;
  glyphTheme: GlyphTheme;
  unlockedThemes: GlyphTheme[];
}
