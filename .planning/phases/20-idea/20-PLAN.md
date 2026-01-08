# Phase 20: IDEA Stage — PLAN

<objective>
Build the IDEA processor that transforms natural language app ideas into structured requirements documents. When a user provides an app idea and budget, FORK extracts features, detects budget conflicts, and outputs `requirements.md` + `features.json` for downstream stages.
</objective>

<execution_context>
@app/src/types/rork.ts - Existing project/tier types
@app/src/lib/budget.ts - Budget tier detection
@app/src/stores/app.ts - Zustand state management
@app/.rork/project.json - Project config structure
@.planning/phases/20-idea/20-CONTEXT.md - Design decisions
</execution_context>

<context>
## What Exists (Phase 10)
- `BudgetTier` type: "free" | "starter" | "pro" | "scale"
- `RorkProject` interface with name, idea, budget, tier, stage, platforms
- `detectTier(budget)` and `getTierConfig(budget)` functions
- Zustand store for project state

## What We're Building
- Type definitions for Features and Requirements
- Conflict detection for budget vs feature mismatches
- Markdown and JSON generators for output files
- IDEA stage orchestrator

## Key Design Decisions (from CONTEXT)
1. **Extract, don't invent** - Only features user mentioned
2. **Explicit exclusions** - Each feature states what's NOT included
3. **Budget-aware** - Flag conflicts (e.g., $0 can't do real-time sync)
4. **Platform inference** - Detect iOS/Android from keywords

## Output Location
Files will be written to `.rork/` directory:
- `.rork/requirements.md` - Human-readable
- `.rork/features.json` - Machine-readable
</context>

<tasks>

## Task 1: Define Feature and Requirements Types

**Create:** `app/src/types/idea.ts`

```ts
import type { BudgetTier } from "./rork";

export type FeaturePriority = "must-have" | "should-have" | "nice-to-have";
export type OfflineSupport = "required" | "nice-to-have" | "not-needed";

export interface Feature {
  id: string;                    // kebab-case (e.g., "workout-logging")
  name: string;                  // Display name
  priority: FeaturePriority;
  description: string;           // What it does
  requires: FeatureRequirement[]; // Dependencies
  excludes: string[];            // Explicit exclusions
}

export type FeatureRequirement =
  | "local-storage"
  | "cloud-storage"
  | "auth"
  | "push-notifications"
  | "real-time-sync"
  | "camera"
  | "location"
  | "health-kit"      // iOS only
  | "google-fit";     // Android only

export interface TargetUser {
  demographic: string;           // e.g., "adults 25-40, fitness enthusiasts"
  goal: string;                  // What they want to achieve
  context: string;               // When/where they use the app
}

export interface Requirements {
  name: string;                  // App name
  tagline: string;               // One-line description
  problem: string;               // What problem it solves
  targetUser: TargetUser;
  features: Feature[];
  platforms: ("ios" | "android")[];
  offlineSupport: OfflineSupport;
  tier: BudgetTier;
  conflicts: Conflict[];
}

export interface Conflict {
  featureId: string;             // Which feature
  requirement: FeatureRequirement; // What it needs
  reason: string;                // Why it conflicts
  resolution: string;            // How to fix
}
```

**Checkpoint:** TypeScript compiles, types exported correctly

---

## Task 2: Create Budget Constraint Rules

**Create:** `app/src/lib/idea/constraints.ts`

Define what each tier can and cannot support:

```ts
import type { BudgetTier } from "../types/rork";
import type { FeatureRequirement, Conflict, Feature } from "../types/idea";

// What each tier supports
const TIER_CAPABILITIES: Record<BudgetTier, FeatureRequirement[]> = {
  free: ["local-storage", "camera", "location"],
  starter: ["local-storage", "cloud-storage", "auth", "push-notifications", "camera", "location"],
  pro: ["local-storage", "cloud-storage", "auth", "push-notifications", "real-time-sync", "camera", "location"],
  scale: ["local-storage", "cloud-storage", "auth", "push-notifications", "real-time-sync", "camera", "location", "health-kit", "google-fit"],
};

export function detectConflicts(features: Feature[], tier: BudgetTier): Conflict[]
export function canTierSupport(requirement: FeatureRequirement, tier: BudgetTier): boolean
export function suggestMinimumTier(requirements: FeatureRequirement[]): BudgetTier
```

**Checkpoint:** `detectConflicts([{requires: ["real-time-sync"]}], "free")` returns conflict

---

## Task 3: Create Platform Inference

**Create:** `app/src/lib/idea/platforms.ts`

Detect platforms from idea text and feature requirements:

```ts
export interface PlatformHints {
  platforms: ("ios" | "android")[];
  confidence: "explicit" | "inferred" | "default";
  reason: string;
}

export function inferPlatforms(idea: string, features: Feature[]): PlatformHints

// Keywords that indicate platform:
// iOS: "iphone", "ipad", "ios", "apple health", "healthkit", "apple watch"
// Android: "android", "google fit", "pixel", "samsung"
// Both: "mobile app", "cross-platform", or no platform mentioned
```

**Checkpoint:** `inferPlatforms("iOS fitness app with Apple Health")` returns `{ platforms: ["ios"], confidence: "explicit" }`

---

## Task 4: Create Requirements Markdown Generator

**Create:** `app/src/lib/idea/generators.ts`

```ts
import type { Requirements } from "../types/idea";

export function generateRequirementsMd(req: Requirements): string {
  // Output format from CONTEXT.md:
  // # App Requirements: {name}
  // ## Core Problem
  // ## Target User
  // ## MVP Features (with exclusions)
  // ## Platform Requirements
  // ## Budget Constraints
  // ## Success Criteria
}

export function generateFeaturesJson(req: Requirements): string {
  // Machine-readable JSON for DESIGN/BUILD stages
}
```

**Checkpoint:** Output matches format in 20-CONTEXT.md

---

## Task 5: Create File Writer

**Create:** `app/src/lib/idea/writer.ts`

```ts
import * as FileSystem from "expo-file-system";

export async function writeRequirementsFiles(
  projectDir: string,
  requirements: Requirements
): Promise<{ requirementsMd: string; featuresJson: string }> {
  // 1. Generate markdown and JSON
  // 2. Write to .rork/requirements.md
  // 3. Write to .rork/features.json
  // 4. Return paths to written files
}

export async function readRequirements(projectDir: string): Promise<Requirements | null>
```

**Checkpoint:** Files written to `.rork/` directory, readable back

---

## Task 6: Create IDEA Stage Orchestrator

**Create:** `app/src/stages/idea.ts`

Main entry point that ties everything together:

```ts
import type { Requirements, Conflict } from "../types/idea";

export interface IdeaStageInput {
  idea: string;           // Raw user input
  budget: number;         // Monthly budget
  platforms?: ("ios" | "android")[]; // Optional override
}

export interface IdeaStageOutput {
  requirements: Requirements;
  conflicts: Conflict[];
  files: {
    requirementsMd: string;
    featuresJson: string;
  };
}

export async function runIdeaStage(input: IdeaStageInput): Promise<IdeaStageOutput> {
  // 1. Detect budget tier
  // 2. Infer platforms from idea
  // 3. Extract features (this will be prompt-driven in execution)
  // 4. Detect conflicts
  // 5. Generate and write files
  // 6. Return result
}
```

**Checkpoint:** `runIdeaStage({ idea: "workout tracker", budget: 0 })` produces valid output

---

## Task 7: Create Index Exports

**Create:** `app/src/lib/idea/index.ts`

```ts
export * from "./constraints";
export * from "./platforms";
export * from "./generators";
export * from "./writer";
```

**Update:** `app/src/types/rork.ts` → rename to `app/src/types/fork.ts` and update imports
- Actually, keep as `rork.ts` to avoid breaking changes, just add re-export

**Create:** `app/src/types/index.ts`

```ts
export * from "./rork";
export * from "./idea";
```

**Checkpoint:** All exports accessible from `src/types` and `src/lib/idea`

---

## Task 8: Update Project Config Type

**Modify:** `app/src/types/rork.ts`

Add fields to track IDEA stage output:

```ts
export interface RorkProject {
  // ... existing fields
  requirementsPath?: string;  // Path to requirements.md
  featuresPath?: string;      // Path to features.json
}
```

**Checkpoint:** Project type updated, existing code still compiles

</tasks>

<verification>
After all tasks:
```bash
cd app && npx tsc --noEmit
```
- [ ] No TypeScript errors
- [ ] All new files created in correct locations
- [ ] Types properly exported

Manual verification:
- [ ] `detectConflicts()` correctly identifies budget/feature mismatches
- [ ] `inferPlatforms()` handles iOS, Android, and default cases
- [ ] `generateRequirementsMd()` produces readable markdown
- [ ] `writeRequirementsFiles()` creates files in `.rork/`
</verification>

<success_criteria>
- [ ] `runIdeaStage({ idea: "A simple todo app", budget: 0 })` executes without error
- [ ] Conflict detected when free tier + real-time sync requested
- [ ] Platform correctly inferred from keywords
- [ ] `.rork/requirements.md` readable and matches expected format
- [ ] `.rork/features.json` valid JSON, consumable by DESIGN stage
- [ ] All types properly typed (no `any`)
</success_criteria>

<output>
```
app/src/
├── types/
│   ├── rork.ts          # Updated with requirements paths
│   ├── idea.ts          # NEW: Feature/Requirements/Conflict types
│   └── index.ts         # NEW: Barrel export
├── lib/
│   └── idea/
│       ├── index.ts     # NEW: Barrel export
│       ├── constraints.ts # NEW: Budget conflict detection
│       ├── platforms.ts # NEW: Platform inference
│       ├── generators.ts # NEW: Markdown/JSON generators
│       └── writer.ts    # NEW: File system operations
└── stages/
    └── idea.ts          # NEW: IDEA stage orchestrator
```
</output>

---

*Scope: ~4 hours*
*Created: 2025-01-08*
