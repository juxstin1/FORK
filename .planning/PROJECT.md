# RORK

> AI assistant that ships mobile apps to the App Store. Not an IDE you fight with - a partner that handles IDEA → SHIP.

## Vision

RORK is a Claude Code-native framework that takes an app idea and delivers a complete App Store submission package. It uses real demographic data for user simulation, respects budget constraints, and produces purposeful documentation where each agent only reads what it needs.

**Core principle:** You're GETTING SHIT DONE, not fighting tools.

## Problem

Building and shipping a mobile app requires:
- UX design decisions
- Code architecture
- Backend setup
- Testing
- App Store asset generation (screenshots, descriptions, videos)
- Submission process navigation

Most tools help with ONE piece. RORK handles the entire pipeline, budget-aware, with AI-simulated user testing before you ship.

## Solution

A 6-stage pipeline:

```
IDEA → DESIGN → BUILD → TEST → DEBUG → SHIP
```

Each stage has:
- Clear inputs/outputs
- Quality gates
- Agent-scoped documentation (no token waste)
- Budget-aware decisions

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **Budget-first architecture** — User declares $25-100/month, RORK architects to fit
- [ ] **Real demographic personas** — Web research at runtime (Ableton stats for VST, etc.)
- [ ] **Pain point identification** — Simulations find friction, not suggest reworks
- [ ] **Complete ship package** — .ipa/.aab, screenshots, store copy, privacy policy, submission guide
- [ ] **Agent-scoped reads** — Each agent sees only relevant docs, no stale info pollution
- [ ] **Local execution** — Runs via Claude Code on user's Windows machine
- [ ] **Expo/EAS pipeline** — React Native with EAS Build for iOS/Android
- [ ] **Sandpack preview** — Live preview during development
- [ ] **Ad copy generation** — Store listing optimized for researched ideal customer
- [ ] **Screenshot automation** — All required device sizes generated

### Out of Scope

- Team collaboration — single user first, teams in v2
- Web app deployment — mobile only (iOS/Android via Expo)
- Cloud-hosted service — runs locally via Claude Code

## Architecture

### The 6-Stage Pipeline

| Stage | Input | Output | Agent Scope |
|-------|-------|--------|-------------|
| IDEA | Natural language | `requirements.md` | User context only |
| DESIGN | Requirements | Screens, flows, `ux-report.md` | Requirements + UX patterns |
| BUILD | Approved designs | Production code | Designs + code templates |
| TEST | Working app | Test results, simulation report | Code + test frameworks |
| DEBUG | Test failures | Fixed code, `debug-log.md` | Failing tests + relevant code |
| SHIP | Passing app | `ship-package/` | Build config + store requirements |

### Budget Tiers

| Monthly Budget | Database | Auth | Storage | Build |
|----------------|----------|------|---------|-------|
| $0 | Supabase free | Supabase | Cloudflare R2 free | EAS free (limited) |
| $25 | Supabase Pro | Supabase | R2 | EAS Production |
| $50 | Supabase Pro | Clerk | R2 + CDN | EAS + OTA |
| $100 | PlanetScale | Clerk Pro | R2 + Edge | Full EAS |

### Document Tree (Agent-Scoped)

```
.rork/
├── project.json          # Config, budget, constraints
├── requirements.md       # IDEA stage output
├── personas/             # Generated from web research
│   ├── primary.md
│   └── secondary.md
├── design/
│   ├── screens.md        # BUILD reads this
│   ├── flows.md
│   └── ux-report.md      # Simulation results
├── debug-log.md          # DEBUG stage only
└── ship/
    ├── checklist.md      # SHIP stage reads this
    └── store-copy.md
```

**Principle:** Agents read ONLY their scoped docs. No full-tree scans.

### User Simulation Engine

```
Input: App category + target demographic description
          ↓
Web Research: Search for real platform demographics
  - "Ableton user demographics 2024"
  - "FL Studio user age distribution"
  - "fitness app user statistics"
          ↓
Persona Generation: 3-4 data-backed personas
  - Age, tech comfort, patience, goals
  - Based on REAL stats, not assumptions
          ↓
Task Simulation: Each persona attempts core flows
          ↓
Output: Pain points, friction scores, drop-off predictions
```

**Key:** Simulations identify PAIN POINTS, not suggest feature additions.

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Runtime | Claude Code (local) | User's machine, Windows |
| Framework | Expo SDK 52+ | Universal, EAS builds |
| Navigation | Expo Router | File-based routing |
| Styling | NativeWind v4 | Tailwind for RN |
| State | Zustand | Simple, no boilerplate |
| Preview | Sandpack | Live code preview |
| Backend | Supabase (default) | Auth, DB, storage in one |
| Build | EAS Build | Cloud builds for iOS/Android |
| OTA | EAS Update | Post-launch updates |

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Budget-first not feature-first | User's spend is fixed constraint, architecture flexes | Pending |
| Agent-scoped docs | Prevent token waste, avoid stale info confusion | Pending |
| Web research for personas | Real data > assumptions | Pending |
| Local execution only | Claude Code native, no cloud service to maintain | Pending |
| Expo/EAS lock-in | Best RN tooling, handles iOS signing complexity | Pending |

## Success Metrics

| Metric | Target |
|--------|--------|
| Idea → First preview | < 1 hour |
| Idea → Ship-ready | < 8 hours |
| App Store approval rate | > 95% |
| Budget accuracy | ±10% of stated monthly |
| Pain point prediction accuracy | > 75% match to real user feedback |

## Constraints

- **Platform:** Windows (user's machine)
- **Runtime:** Claude Code with plugins/skills
- **Build:** Expo/EAS only (no bare React Native)
- **Budget:** User-declared, researched and fixed

---
*Last updated: 2025-01-08 after initialization*
