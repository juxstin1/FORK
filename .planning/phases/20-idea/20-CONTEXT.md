# Phase 20: IDEA Stage — CONTEXT

## Purpose

The IDEA stage transforms a user's natural language app idea into structured requirements that downstream stages (DESIGN, BUILD, etc.) can consume. This is the first "thinking" stage of the FORK pipeline.

## Input

From user via `/fork new` flow:
- Natural language app idea (free text)
- Monthly budget ($0-$100+)
- Platform preferences (iOS, Android, both)

## Output

```
.fork/
├── requirements.md      # Structured requirements for DESIGN stage
├── features.json        # Machine-readable feature list
└── project.json         # Updated with parsed metadata
```

## Requirements Document Structure

The `requirements.md` should be **agent-scoped** — only what downstream stages need:

```markdown
# App Requirements: {App Name}

## Core Problem
One sentence: What problem does this app solve?

## Target User
- Primary demographic (age range, tech comfort)
- Key goal they're trying to achieve
- Context of use (when/where they'll use this)

## MVP Features
Prioritized list with clear scope:
1. **{Feature}** - {One-line description}
   - What it does (input → output)
   - Not included: {explicit exclusions}

## Platform Requirements
- iOS: {yes/no + minimum version}
- Android: {yes/no + minimum version}
- Offline support: {required/nice-to-have/not needed}

## Budget Constraints
- Tier: {free/starter/pro/scale}
- Implications: {what this means for tech choices}

## Success Criteria
How do we know the app works?
- {Measurable criterion 1}
- {Measurable criterion 2}
```

## Design Decisions

### 1. Extraction over Generation

The idea parser should **extract** what's in the user's idea, not **generate** new features. If the user says "a workout tracker", we extract tracking workouts. We don't add social features or gamification unless mentioned.

### 2. Explicit Exclusions

Each feature should state what's NOT included. This prevents scope creep and sets clear boundaries for BUILD stage.

### 3. No Personas Yet

Phase 20 identifies the "target user" but doesn't create full personas. That's Phase 30's job (with web research for data-backed demographics).

### 4. Budget-Aware Features

If user wants features that don't fit their budget tier:
- **$0 tier**: No real-time sync, no push notifications (needs server)
- **$25+ tier**: Can have Supabase realtime, push via Expo
- **$50+ tier**: Can have Clerk auth (better UX), CDN assets
- **$100+ tier**: Can have edge computing, advanced analytics

The parser should flag conflicts: "You mentioned real-time collaboration but selected $0 budget. This requires $25+ for Supabase Pro."

### 5. Platform Detection

Infer platforms from context:
- "iOS app" → iOS only
- "iPhone" → iOS only
- "Android app" → Android only
- "mobile app" / no platform mentioned → Both (default)
- Features like "Apple Health" → iOS required
- Features like "Google Fit" → Android required

## Implementation Approach

### Idea Parser

A prompt-based extractor that:

1. **Identifies the core value proposition** (what problem, for whom)
2. **Extracts explicit features** (things the user mentioned)
3. **Detects implicit features** (login = needs auth, "save workouts" = needs storage)
4. **Flags conflicts** (budget vs features, platform vs features)
5. **Asks clarifying questions** if critical info is missing

### Questions Only When Necessary

Don't ask questions for things we can infer or decide:
- **Do ask**: "You mentioned 'share with friends' - do you need user accounts for this, or just a share link?"
- **Don't ask**: "What color scheme do you prefer?" (that's DESIGN stage)

### Output Format

The parser outputs:
1. `requirements.md` - Human-readable for review
2. `features.json` - Machine-readable for DESIGN/BUILD stages

```json
{
  "name": "FitTrack",
  "problem": "Users forget to log workouts and lose motivation",
  "features": [
    {
      "id": "workout-logging",
      "name": "Workout Logging",
      "priority": "must-have",
      "description": "Log completed workouts with exercises, sets, reps",
      "requires": ["local-storage"],
      "excludes": ["exercise-video-guides", "workout-programs"]
    }
  ],
  "platforms": ["ios", "android"],
  "tier": "free",
  "conflicts": []
}
```

## Integration Points

### Input From
- User input via FORK interface
- Budget tier from `src/lib/budget.ts`

### Output To
- **Phase 30 (Personas)**: `requirements.md` → persona generation context
- **Phase 40 (DESIGN)**: `features.json` → screen/flow generation
- **Phase 50 (BUILD)**: `features.json` → code scaffolding

## Constraints

1. **No web research in this phase** - That's Phase 30's job
2. **No design decisions** - Extract requirements only
3. **Keep it minimal** - Don't over-document; just enough for next stage
4. **Bias toward asking** - If ambiguous and important, ask the user

## Success Criteria

- [ ] User provides idea, gets structured `requirements.md` in < 30 seconds
- [ ] Features extracted match what user actually said (no hallucinated features)
- [ ] Budget conflicts are flagged clearly
- [ ] Output is sufficient for DESIGN stage to work without re-asking user

---

*Created: 2025-01-08*
