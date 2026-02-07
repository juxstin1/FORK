# Pipeline Stages Skill

## Overview
FORK runs a 6-stage pipeline: IDEA → DESIGN → BUILD → TEST → DEBUG → SHIP.
Each stage has a standalone module in `app/src/stages/` with a `run*Stage()` function.

## Stage Map

### IDEA Stage (Phase 20 — COMPLETE)
**Entry:** `src/stages/idea.ts` → `runIdeaStage()`
**Input:** Raw idea text + monthly budget
**Output:** `.rork/requirements.md`, `.rork/features.json`
**What it does:**
1. Detects budget tier from dollar amount
2. Infers target platforms from keywords/features
3. Checks feature/budget conflicts (e.g., Clerk auth on free tier)
4. Generates requirements markdown and features JSON
**Libraries:** `src/lib/idea/` (constraints, generators, platforms, writer)

### PERSONA Stage (Phase 30 — COMPLETE)
**Entry:** `src/stages/persona.ts` → `runPersonaStage()`
**Input:** Requirements from IDEA stage
**Output:** `.rork/personas/primary.md`, `.rork/personas/secondary.md`
**What it does:**
1. Classifies app into 1 of 12 categories
2. Builds web research queries for demographics
3. Generates 1 primary + 2 secondary personas with real stats
4. Falls back to default templates if research fails
**Libraries:** `src/lib/persona/` (categories, research, generator, defaults, writer)

### DESIGN Stage (Phase 40 — NEXT)
**Entry:** `src/stages/design.ts` → `runDesignStage()`
**Current state:** Stub — only saves DesignSpec JSON to `.rork/design.json`
**Needs:** Screen generator, flow mapper, budget-aware component selection
**Prompt:** `design.generate.v1`

### BUILD Stage (Phase 50 — PLANNED)
**Entry:** `src/stages/build.ts` → `runBuildStage()`
**Current state:** Stub — writes array of `{path, content}` files to disk
**Needs:** Code generator, Expo Router structure, NativeWind styling, Zustand scaffolding
**Prompts:** `build.screen.v1`, `build.component.v1`

### TEST Stage (Phase 70 — PLANNED)
**Not implemented yet.** Will generate and run tests.

### DEBUG Stage (Phase 80 — PLANNED)
**Not implemented yet.** Error analysis and fix generation.

### SHIP Stage (Phase 90 — PLANNED)
**Not implemented yet.** Screenshots, store copy, EAS build, submission guide.

## Running Stages via MCP

```bash
cd app && npm run mcp
```

Tools: `run_idea_stage`, `run_design_stage`, `run_build_stage`, `run_persona_stage`

## Patterns
- Stages are sequential — each reads the previous stage's output from `.rork/`
- Agent-scoped reads: stages only access their relevant docs
- Budget tier flows through every decision
- All file writes go through the stage's writer module
- Prompts come from the registry, never inline
