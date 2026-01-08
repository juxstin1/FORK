# RORK Roadmap

## Milestone 1: MVP Pipeline

**Goal:** Complete IDEA→DESIGN→BUILD→TEST→DEBUG→SHIP flow for one simple app

**Success Criteria:**
- User can input an app idea and budget
- RORK produces a working Expo app
- App passes simulation testing
- Ship package generated (screenshots, store copy, submission guide)

---

## Phases

### Phase 10: Project Foundation
**Goal:** Core project structure, CLI entry point, configuration system

**Delivers:**
- Expo project scaffold
- `.rork/project.json` configuration schema
- CLI entry point that accepts app idea + budget
- Budget tier detection

**Research:** None - straightforward setup

---

### Phase 20: IDEA Stage
**Goal:** Transform natural language idea into structured requirements

**Delivers:**
- Idea parser (extracts core features, target audience, platform needs)
- Budget constraint analyzer
- `requirements.md` generator
- Agent-scoped doc writer (only writes what downstream stages need)

**Research:** Prompt engineering for idea extraction

---

### Phase 30: Persona Engine
**Goal:** Web-researched, data-backed user personas

**Delivers:**
- Web search integration for demographic data
- Persona generator (3-4 personas per app category)
- `personas/primary.md`, `personas/secondary.md` output
- Real stats, not assumptions (age, tech comfort, goals)

**Research:** Best sources for demographic data by app category

---

### Phase 40: DESIGN Stage
**Goal:** Convert requirements into screens and flows

**Delivers:**
- Screen generator (based on requirements + budget tier)
- Flow mapper (user journeys for core tasks)
- `design/screens.md`, `design/flows.md` output
- Budget-aware component selection (simpler UI for $0 tier)

**Research:** Expo component libraries compatible with NativeWind

---

### Phase 50: BUILD Stage
**Goal:** Generate production-ready Expo code

**Delivers:**
- Code generator (screens, navigation, state)
- Expo Router file structure
- NativeWind styling
- Zustand state management
- Backend integration (Supabase by default, based on budget)

**Research:** EAS Build configuration patterns

---

### Phase 60: Simulation Engine
**Goal:** AI-simulated user testing with personas

**Delivers:**
- Task simulator (each persona attempts core flows)
- Friction scorer (identifies pain points)
- Drop-off predictor
- `design/ux-report.md` output
- Pain points only - no feature suggestions

**Research:** Effective prompts for simulating user behavior

---

### Phase 70: TEST Stage
**Goal:** Automated testing based on simulation findings

**Delivers:**
- Test generator (unit + integration)
- Simulation-informed test cases
- Test runner integration
- Results aggregator

**Research:** Expo testing patterns

---

### Phase 80: DEBUG Stage
**Goal:** Fix failures identified in TEST

**Delivers:**
- Error analyzer (maps failures to code locations)
- Fix generator
- `debug-log.md` tracking
- Iterative fix-test loop

**Research:** None - standard debugging patterns

---

### Phase 90: SHIP Stage
**Goal:** Complete App Store submission package

**Delivers:**
- Screenshot generator (all required device sizes)
- Store copy writer (optimized for researched ideal customer)
- Privacy policy generator
- `ship/checklist.md`, `ship/store-copy.md`
- EAS Build integration (.ipa/.aab generation)
- Submission guide

**Research:** Current App Store/Play Store requirements

---

### Phase 100: Integration & Polish
**Goal:** End-to-end pipeline working smoothly

**Delivers:**
- Stage orchestrator (IDEA→SHIP flow)
- Quality gates between stages
- Error recovery (resume from failed stage)
- User feedback loop
- Performance optimization (< 8 hours idea to ship-ready)

**Research:** None - integration work

---

## Phase Dependencies

```
10 (Foundation)
 └── 20 (IDEA)
      └── 30 (Personas)
           └── 40 (DESIGN)
                └── 50 (BUILD)
                     └── 60 (Simulation)
                          └── 70 (TEST)
                               └── 80 (DEBUG)
                                    └── 90 (SHIP)
                                         └── 100 (Integration)
```

---

## Budget Tier Reference

| Monthly | DB | Auth | Storage | Build |
|---------|-----|------|---------|-------|
| $0 | Supabase free | Supabase | R2 free | EAS free |
| $25 | Supabase Pro | Supabase | R2 | EAS Production |
| $50 | Supabase Pro | Clerk | R2 + CDN | EAS + OTA |
| $100 | PlanetScale | Clerk Pro | R2 + Edge | Full EAS |

---

*Created: 2025-01-08*
*Milestone: MVP Pipeline*
