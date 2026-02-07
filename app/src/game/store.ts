import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Pet, PetStats, GravePet, GameScores, AppSettings, Achievement, GlyphTheme } from "./types";
import { ACHIEVEMENTS } from "./constants";
import {
  decayStats,
  checkEvolution,
  checkDeath,
  getDaysAlive,
  clampStat,
  createPet,
} from "./engine";

const STORAGE_KEY = "@glyph-pet";

interface GameState {
  // Pet
  pet: Pet | null;
  isNewUser: boolean;

  // Graveyard
  graveyard: GravePet[];

  // Scores
  scores: GameScores;

  // Achievements
  achievements: Achievement[];

  // Settings
  settings: AppSettings;

  // UI state
  showEvolution: boolean;
  showDeath: boolean;
  actionCooldowns: Record<string, number>;

  // Actions
  initPet: (name: string) => void;
  updatePet: () => void;
  feedPet: () => void;
  playWithPet: () => void;
  cleanPet: () => void;
  restPet: () => void;
  buryPet: () => void;
  dismissEvolution: () => void;
  dismissDeath: () => void;
  updateScore: (game: keyof GameScores, score: number) => void;
  unlockAchievement: (id: string) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  pet: null,
  isNewUser: true,
  graveyard: [],
  scores: { glyphMatch: 0, rhythmTap: 0, memoryGrid: 0 },
  achievements: ACHIEVEMENTS.map((a) => ({ ...a })),
  settings: {
    hungerAlerts: false,
    lonelinessNudges: false,
    hapticFeedback: true,
    glyphTheme: "default" as GlyphTheme,
    unlockedThemes: ["default" as GlyphTheme],
  },
  showEvolution: false,
  showDeath: false,
  actionCooldowns: {},

  initPet: (name: string) => {
    const pet = createPet(name);
    set({ pet, isNewUser: false, showEvolution: false, showDeath: false });
    get().unlockAchievement("first-hatch");
    get().saveToStorage();
  },

  updatePet: () => {
    const { pet } = get();
    if (!pet || pet.isDead) return;

    const now = Date.now();
    const elapsed = now - pet.lastUpdated;

    // Decay stats
    const decayed = decayStats(pet.stats, elapsed);
    const stats: PetStats = {
      hunger: clampStat(decayed.hunger),
      happiness: clampStat(decayed.happiness),
      energy: clampStat(decayed.energy),
      hygiene: clampStat(decayed.hygiene),
    };

    // Check death
    if (checkDeath(stats)) {
      set({
        pet: { ...pet, stats, lastUpdated: now, isDead: true },
        showDeath: true,
      });
      get().saveToStorage();
      return;
    }

    // Check evolution
    const newStage = checkEvolution(pet);
    if (newStage && newStage !== pet.stage) {
      const updated = { ...pet, stats, lastUpdated: now, stage: newStage };
      set({ pet: updated, showEvolution: true });

      // Achievement checks
      if (newStage === "baby") get().unlockAchievement("first-evolution");
      if (newStage === "teen") get().unlockAchievement("teen-reached");
      if (newStage === "adult") get().unlockAchievement("adult-reached");
      if (newStage === "elder") get().unlockAchievement("elder-reached");

      get().saveToStorage();
      return;
    }

    // Check perfect care
    if (stats.hunger >= 100 && stats.happiness >= 100 && stats.energy >= 100 && stats.hygiene >= 100) {
      get().unlockAchievement("perfect-care");
    }

    set({ pet: { ...pet, stats, lastUpdated: now } });
  },

  feedPet: () => {
    const { pet, actionCooldowns } = get();
    if (!pet || pet.isDead) return;
    if (actionCooldowns.feed && Date.now() - actionCooldowns.feed < 2000) return;

    const stats: PetStats = {
      ...pet.stats,
      hunger: clampStat(pet.stats.hunger + 20),
    };
    set({
      pet: { ...pet, stats, lastFed: Date.now(), lastUpdated: Date.now() },
      actionCooldowns: { ...actionCooldowns, feed: Date.now() },
    });
    get().saveToStorage();
  },

  playWithPet: () => {
    const { pet, actionCooldowns } = get();
    if (!pet || pet.isDead) return;
    if (actionCooldowns.play && Date.now() - actionCooldowns.play < 2000) return;

    const stats: PetStats = {
      ...pet.stats,
      happiness: clampStat(pet.stats.happiness + 15),
    };
    set({
      pet: { ...pet, stats, lastPlayed: Date.now(), lastUpdated: Date.now() },
      actionCooldowns: { ...actionCooldowns, play: Date.now() },
    });
    get().saveToStorage();
  },

  cleanPet: () => {
    const { pet, actionCooldowns } = get();
    if (!pet || pet.isDead) return;
    if (actionCooldowns.clean && Date.now() - actionCooldowns.clean < 2000) return;

    const stats: PetStats = {
      ...pet.stats,
      hygiene: clampStat(pet.stats.hygiene + 25),
    };
    set({
      pet: { ...pet, stats, lastCleaned: Date.now(), lastUpdated: Date.now() },
      actionCooldowns: { ...actionCooldowns, clean: Date.now() },
    });
    get().saveToStorage();
  },

  restPet: () => {
    const { pet, actionCooldowns } = get();
    if (!pet || pet.isDead) return;
    if (actionCooldowns.rest && Date.now() - actionCooldowns.rest < 2000) return;

    const stats: PetStats = {
      ...pet.stats,
      energy: clampStat(pet.stats.energy + 20),
    };
    set({
      pet: { ...pet, stats, lastRested: Date.now(), lastUpdated: Date.now() },
      actionCooldowns: { ...actionCooldowns, rest: Date.now() },
    });
    get().saveToStorage();
  },

  buryPet: () => {
    const { pet, graveyard, settings } = get();
    if (!pet) return;

    const grave: GravePet = {
      name: pet.name,
      finalStage: pet.stage,
      bornAt: pet.bornAt,
      diedAt: Date.now(),
      daysLived: getDaysAlive(pet.bornAt),
      peakHappiness: pet.stats.happiness,
      glyphTheme: settings.glyphTheme,
    };

    set({
      pet: null,
      graveyard: [grave, ...graveyard],
      isNewUser: false,
      showDeath: false,
    });
    get().saveToStorage();
  },

  dismissEvolution: () => set({ showEvolution: false }),
  dismissDeath: () => set({ showDeath: false }),

  updateScore: (game, score) => {
    const { scores } = get();
    if (score > scores[game]) {
      set({ scores: { ...scores, [game]: score } });

      // Achievement checks
      if (game === "glyphMatch" && score >= 8) get().unlockAchievement("glyph-master");
      if (game === "rhythmTap" && score >= 100) get().unlockAchievement("rhythm-king");
      if (game === "memoryGrid" && score >= 10) get().unlockAchievement("memory-pro");

      get().unlockAchievement("first-game");

      // Check all games played
      const updated = get().scores;
      if (updated.glyphMatch > 0 && updated.rhythmTap > 0 && updated.memoryGrid > 0) {
        get().unlockAchievement("all-games");
      }

      get().saveToStorage();
    }
  },

  unlockAchievement: (id) => {
    const { achievements } = get();
    const updated = achievements.map((a) =>
      a.id === id && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
    );
    set({ achievements: updated });
  },

  updateSettings: (partial) => {
    const { settings } = get();
    set({ settings: { ...settings, ...partial } });
    get().saveToStorage();
  },

  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const data = JSON.parse(raw);
      set({
        pet: data.pet ?? null,
        isNewUser: data.isNewUser ?? !data.pet,
        graveyard: data.graveyard ?? [],
        scores: data.scores ?? { glyphMatch: 0, rhythmTap: 0, memoryGrid: 0 },
        achievements: data.achievements ?? ACHIEVEMENTS.map((a) => ({ ...a })),
        settings: {
          hungerAlerts: data.settings?.hungerAlerts ?? false,
          lonelinessNudges: data.settings?.lonelinessNudges ?? false,
          hapticFeedback: data.settings?.hapticFeedback ?? true,
          glyphTheme: data.settings?.glyphTheme ?? "default",
          unlockedThemes: data.settings?.unlockedThemes ?? ["default"],
        },
      });
    } catch {
      // Storage read failed — start fresh
    }
  },

  saveToStorage: async () => {
    try {
      const { pet, isNewUser, graveyard, scores, achievements, settings } = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ pet, isNewUser, graveyard, scores, achievements, settings })
      );
    } catch {
      // Storage write failed — non-critical
    }
  },
}));
