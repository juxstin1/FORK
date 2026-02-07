# Project State Skill

## Overview
How to read, understand, and update FORK's project state.

## State Files

| File | Purpose | Update When |
|------|---------|-------------|
| `.planning/STATE.md` | Current milestone, phase, progress table | Phase status changes |
| `.planning/TODOS.md` | Strict-format task tracker with IDs | Tasks added/started/completed |
| `.planning/ROADMAP.md` | Full milestone plan with all phases | Phase scope changes |
| `.planning/PROJECT.md` | Vision, requirements, architecture | Major architectural decisions |
| `.planning/config.json` | Machine-readable project config | Config changes |

## Phase Directories
```
.planning/phases/
├── 10-foundation/    # Phase 10 docs (COMPLETE)
├── 20-idea/          # Phase 20 docs (COMPLETE)
└── 30-persona-engine/ # Phase 30 docs (COMPLETE)
```
Each phase directory may contain: PLAN.md, RESEARCH.md, SUMMARY.md, COMPLETE.md

## Reading State
1. Start with `.planning/STATE.md` — current phase and overall progress
2. Check `.planning/TODOS.md` — what's actionable right now
3. If needed, read the specific phase directory for deep context

## TODO System (Strict Format)

### Line Contract
Every todo is one line, machine-parseable:
```
- [status] #ID P{0-3} created:YYYY-MM-DD [meta...] — description
```

### Status Markers
- `[ ]` — Open
- `[>]` — In progress
- `[x]` — Done
- `[-]` — Blocked

### Meta Fields (optional, space-separated before ` — `)
- `started:YYYY-MM-DD` — When work began
- `done:YYYY-MM-DD` — When completed
- `owner:name` — Who's working on it
- `tags:a,b,c` — Categorization
- `blockedBy:#ID` — What blocks this (comma-separated for multiple)

### ID Management
- IDs are `#` + 3-digit zero-padded number (`#001`, `#042`)
- `Next ID:` counter lives in the file header — always increment after adding
- Done items use IDs `#100+` (convention, not enforced)
- Never reuse an ID

### Priority Levels
- `P0` — Blocking, must do before anything else
- `P1` — Important, should do this session
- `P2` — Nice to have, can defer
- `P3` — Backlog, future work

### Slash Commands
| Command | Action |
|---------|--------|
| `/fork:todo-add "text" --p 0 --tags a,b` | Add new todo |
| `/fork:todo-start #ID` | Mark in-progress |
| `/fork:todo-done #ID` | Mark done, move to Done section, unblock dependents |
| `/fork:todo-block #ID --by #blockerID` | Mark blocked |
| `/fork:todos` | List open + in-progress todos |

### Updating TODOs Manually
When editing the file directly:
1. Match the exact line format — parsers depend on it
2. Increment `Next ID:` if adding new items
3. Move completed items to `## Done` section
4. When completing a blocker, find and unblock its dependents

## AI Working Memory
`.rork/` stores AI-generated artifacts (requirements, features, design, personas).
This is the pipeline's working memory — code goes in `app/` proper.

## Convention
Always update state files AFTER completing work, not before.
State should reflect reality, not intention.
