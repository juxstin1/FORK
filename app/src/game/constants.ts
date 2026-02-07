import type { LifeStage, Achievement, GlyphTheme, TimeOfDay } from "./types";

// --- Pet Glyphs by Stage and Theme ---
export const PET_GLYPHS: Record<GlyphTheme, Record<LifeStage, string>> = {
  default: {
    egg: "\u25E6",      // ◦
    baby: "\u25CB",     // ○
    teen: "\u25CE",     // ◎
    adult: "\u25C9",    // ◉
    elder: "\u2299",    // ⊙
  },
  "dot-matrix": {
    egg: "\u2591",      // ░
    baby: "\u2592",     // ▒
    teen: "\u2593",     // ▓
    adult: "\u2588",    // █
    elder: "\u2584",    // ▄
  },
  ascii: {
    egg: "o",
    baby: "O",
    teen: "@",
    adult: "#",
    elder: "&",
  },
  braille: {
    egg: "\u2801",      // ⠁
    baby: "\u2803",     // ⠃
    teen: "\u2807",     // ⠇
    adult: "\u280F",    // ⠏
    elder: "\u283F",    // ⠿
  },
  circuit: {
    egg: "\u2500",      // ─
    baby: "\u253C",     // ┼
    teen: "\u256C",     // ╬
    adult: "\u2573",    // ╳
    elder: "\u25A3",    // ▣
  },
};

// --- Day/Night Glyphs ---
export const TIME_GLYPHS: Record<TimeOfDay, string> = {
  dawn: "\u25D0",   // ◐
  day: "\u25CB",    // ○
  dusk: "\u25D1",   // ◑
  night: "\u25CF",  // ●
};

// --- Stat Decay Rates (per minute) ---
export const STAT_DECAY: Record<string, number> = {
  hunger: 0.15,
  happiness: 0.10,
  energy: 0.08,
  hygiene: 0.12,
};

// --- Action Boosts ---
export const ACTION_BOOSTS = {
  feed: { hunger: 20 },
  play: { happiness: 15 },
  clean: { hygiene: 25 },
  rest: { energy: 20 },
} as const;

// --- Action Cooldown (ms) ---
export const ACTION_COOLDOWN = 2000;

// --- Evolution Days ---
export const EVOLUTION_DAYS: Record<LifeStage, number> = {
  egg: 0,
  baby: 3,
  teen: 7,
  adult: 14,
  elder: 30,
};

// --- Life Stage Order ---
export const STAGE_ORDER: LifeStage[] = ["egg", "baby", "teen", "adult", "elder"];

// --- Mini-Game Definitions ---
export const MINI_GAMES = [
  { id: "glyph-match", name: "GLYPH MATCH", icon: "\u25A6", screen: "GlyphMatch" as const },
  { id: "rhythm-tap", name: "RHYTHM TAP", icon: "\u266A", screen: "RhythmTap" as const },
  { id: "memory-grid", name: "MEMORY GRID", icon: "\u229E", screen: "MemoryGrid" as const },
] as const;

// --- Glyph Match Cards ---
export const MATCH_GLYPHS = [
  "\u25B2", "\u25CF", "\u25C6", "\u2605",
  "\u25A0", "\u2736", "\u25CB", "\u2662",
]; // △ ● ◆ ★ ■ ✶ ○ ♢

// --- Achievement Definitions ---
export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-hatch", title: "FIRST HATCH", description: "Hatched your first pet", icon: "\u2605" },
  { id: "week-warrior", title: "WEEK WARRIOR", description: "7-day check-in streak", icon: "\u2605" },
  { id: "first-evolution", title: "FIRST EVOLUTION", description: "Pet evolved for the first time", icon: "\u2605" },
  { id: "teen-reached", title: "TEEN SPIRIT", description: "Raised a pet to teen stage", icon: "\u2605" },
  { id: "adult-reached", title: "ALL GROWN UP", description: "Raised a pet to adult stage", icon: "\u2605" },
  { id: "elder-reached", title: "ELDER WISDOM", description: "Raised a pet to elder stage", icon: "\u2605" },
  { id: "perfect-care", title: "PERFECT CARE", description: "Max all stats at once", icon: "\u2605" },
  { id: "glyph-master", title: "GLYPH MASTER", description: "Score 8 in Glyph Match", icon: "\u2605" },
  { id: "rhythm-king", title: "RHYTHM KING", description: "Score 100+ in Rhythm Tap", icon: "\u2605" },
  { id: "memory-pro", title: "MEMORY PRO", description: "Reach round 10 in Memory Grid", icon: "\u2605" },
  { id: "first-game", title: "PLAYER ONE", description: "Complete your first mini-game", icon: "\u2605" },
  { id: "all-games", title: "TRIPLE THREAT", description: "Play all three mini-games", icon: "\u2605" },
];

// --- Time of Day Thresholds (hours) ---
export const TIME_THRESHOLDS = {
  dawn: { start: 5, end: 8 },
  day: { start: 8, end: 18 },
  dusk: { start: 18, end: 21 },
  night: { start: 21, end: 5 },
} as const;
