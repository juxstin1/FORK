import type { Pet, PetStats, LifeStage, TimeOfDay, Mood } from "./types";
import { STAT_DECAY, EVOLUTION_DAYS, STAGE_ORDER, TIME_THRESHOLDS } from "./constants";

/** Apply stat decay based on elapsed real time */
export function decayStats(stats: PetStats, elapsedMs: number): PetStats {
  const minutes = elapsedMs / 60000;
  return {
    hunger: Math.max(0, stats.hunger - STAT_DECAY.hunger * minutes),
    happiness: Math.max(0, stats.happiness - STAT_DECAY.happiness * minutes),
    energy: Math.max(0, stats.energy - STAT_DECAY.energy * minutes),
    hygiene: Math.max(0, stats.hygiene - STAT_DECAY.hygiene * minutes),
  };
}

/** Check if pet should evolve based on days alive */
export function checkEvolution(pet: Pet): LifeStage | null {
  const daysAlive = getDaysAlive(pet.bornAt);
  const currentIdx = STAGE_ORDER.indexOf(pet.stage);
  const nextIdx = currentIdx + 1;

  if (nextIdx >= STAGE_ORDER.length) return null;

  const nextStage = STAGE_ORDER[nextIdx];
  const requiredDays = EVOLUTION_DAYS[nextStage];

  if (daysAlive >= requiredDays) {
    return nextStage;
  }
  return null;
}

/** Check if pet has died (all stats at 0) */
export function checkDeath(stats: PetStats): boolean {
  return stats.hunger <= 0 && stats.happiness <= 0 && stats.energy <= 0 && stats.hygiene <= 0;
}

/** Get days alive from birth timestamp */
export function getDaysAlive(bornAt: number): number {
  return Math.floor((Date.now() - bornAt) / (1000 * 60 * 60 * 24));
}

/** Determine current time of day */
export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= TIME_THRESHOLDS.dawn.start && hour < TIME_THRESHOLDS.dawn.end) return "dawn";
  if (hour >= TIME_THRESHOLDS.day.start && hour < TIME_THRESHOLDS.day.end) return "day";
  if (hour >= TIME_THRESHOLDS.dusk.start && hour < TIME_THRESHOLDS.dusk.end) return "dusk";
  return "night";
}

/** Derive mood from stats */
export function getMood(stats: PetStats, timeOfDay: TimeOfDay): Mood {
  const avg = (stats.hunger + stats.happiness + stats.energy + stats.hygiene) / 4;
  if (timeOfDay === "night" && stats.energy < 30) return "sleeping";
  if (avg >= 70) return "happy";
  if (avg >= 35) return "neutral";
  return "sad";
}

/** Average stat value */
export function getAverageStats(stats: PetStats): number {
  return (stats.hunger + stats.happiness + stats.energy + stats.hygiene) / 4;
}

/** Clamp a stat value to 0-100 */
export function clampStat(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** Create a fresh pet */
export function createPet(name: string): Pet {
  const now = Date.now();
  return {
    name,
    stage: "egg",
    stats: { hunger: 100, happiness: 100, energy: 100, hygiene: 100 },
    bornAt: now,
    lastUpdated: now,
    lastFed: now,
    lastPlayed: now,
    lastCleaned: now,
    lastRested: now,
    isDead: false,
  };
}
