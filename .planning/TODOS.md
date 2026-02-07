# FORK — TODOs

> One line per todo. Machine-parseable. Single source of truth.
>
> Format: `- [status] #ID P{0-3} created:YYYY-MM-DD [meta...] — description`
> Status: `[ ]` open | `[>]` in-progress | `[x]` done | `[-]` blocked
> Meta: `owner:name` `tags:a,b` `started:date` `done:date` `blockedBy:#ID`
> Next ID: 28

---

## Immediate

- [ ] #001 P0 created:2026-02-07 tags:git — Commit uncommitted server changes (env.ts, openrouter.ts, response-guard.ts, index.ts)
- [ ] #002 P0 created:2026-02-07 tags:git — Review new server files for secrets before commit
- [ ] #003 P1 created:2026-02-07 tags:cleanup — Delete stray nul file from repo root

## Technical Debt

- [ ] #004 P0 created:2026-02-07 tags:mcp — Register run_persona_stage as MCP tool (imported but never exposed)
- [ ] #005 P1 created:2026-02-07 tags:mcp — Expand run_design_stage beyond JSON stub
- [ ] #006 P1 created:2026-02-07 tags:mcp — Expand run_build_stage beyond file array writer
- [ ] #007 P1 created:2026-02-07 tags:prompts — Clean up dead imports in prompt registry (stage exports unused)
- [ ] #008 P2 created:2026-02-07 tags:validation — Add validation to .rork/project.json (empty schema values)
- [ ] #009 P2 created:2026-02-07 tags:docs — Update PROJECT.md tech stack (Expo 52→54, RN 0.81)
- [ ] #010 P3 created:2026-02-07 tags:naming — Decide on .rork/ directory naming (keep codename or rename)

## Phase 40: DESIGN Stage

- [ ] #011 P0 created:2026-02-07 tags:design,research — Research Expo component libraries compatible with NativeWind
- [ ] #012 P0 created:2026-02-07 tags:design — Design screen generator architecture (requirements + personas + tier → screens)
- [ ] #013 P0 created:2026-02-07 tags:design — Design flow mapper for user journey mapping
- [ ] #014 P1 created:2026-02-07 tags:design blockedBy:#012 — Implement design/screens.md and design/flows.md output writers
- [ ] #015 P1 created:2026-02-07 tags:design blockedBy:#011 — Add budget-aware component selection logic
- [ ] #016 P1 created:2026-02-07 tags:design,mcp blockedBy:#005 — Wire DESIGN stage to MCP server run_design_stage tool
- [ ] #017 P2 created:2026-02-07 tags:design,prompts — Add design.generate.v1 prompt usage in screen generator

## Phase 50: BUILD Stage

- [ ] #018 P2 created:2026-02-07 tags:build — Code generator for screens, navigation, state from design specs
- [ ] #019 P2 created:2026-02-07 tags:build — Expo Router file structure generation
- [ ] #020 P2 created:2026-02-07 tags:build — NativeWind styling pipeline
- [ ] #021 P2 created:2026-02-07 tags:build — Zustand store scaffolding from data model
- [ ] #022 P2 created:2026-02-07 tags:build — Backend integration templates (Supabase default)

## Prompt Registry

- [ ] #023 P1 created:2026-02-07 tags:prompts blockedBy:#007 — Resolve unused stage prompt exports (build from imports or remove)
- [ ] #024 P2 created:2026-02-07 tags:prompts — Add test.generate.v1 prompt for Phase 70
- [ ] #025 P2 created:2026-02-07 tags:prompts — Add debug.analyze.v1 prompt for Phase 80
- [ ] #026 P2 created:2026-02-07 tags:prompts — Add ship.package.v1 prompt for Phase 90

## Infrastructure

- [ ] #027 P2 created:2026-02-07 tags:infra — Set up test infrastructure (Jest or Vitest)

---

## Done

- [x] #100 P0 created:2025-01-08 done:2025-01-08 — Project Foundation (Phase 10)
- [x] #101 P0 created:2025-01-08 done:2025-01-08 — IDEA Stage (Phase 20)
- [x] #102 P0 created:2025-01-08 done:2025-01-08 — Persona Engine (Phase 30)
- [x] #103 P0 created:2025-01-08 done:2025-01-08 — MCP Server with 11 tools
- [x] #104 P0 created:2025-01-08 done:2025-01-08 — Prompt Registry
- [x] #105 P0 created:2025-01-08 done:2025-01-08 — Glyph Pet demo app
- [x] #106 P1 created:2026-02-07 done:2026-02-07 — OpenRouter integration
- [x] #107 P1 created:2026-02-07 done:2026-02-07 — Response guard for LLM outputs
- [x] #108 P1 created:2026-02-07 done:2026-02-07 tags:docs — Project init, skill files, slash commands, pipeline audit
