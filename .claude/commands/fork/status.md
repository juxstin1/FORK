# /fork:status - Show Pipeline Status

Display current project status, stage progress, and what to do next.

## Usage

```
/fork:status                     # Full status report
/fork:status --short             # One-line summary
```

## Behavior

When user runs `/fork:status`:

1. **Read state files**:
   - `.planning/STATE.md` — Phase progress
   - `.planning/TODOS.md` — Active tasks
   - `.rork/project.json` — Current stage and project config

2. **Display status report**:
   ```
   FORK Pipeline Status
   ═══════════════════
   Project: [name]
   Stage: [DESIGN]
   Budget: $25/mo (starter)

   Pipeline Progress:
   ✅ IDEA     — requirements.md, features.json
   ✅ PERSONA  — 3 personas generated
   🔄 DESIGN   — in progress
   ⬜ BUILD
   ⬜ TEST
   ⬜ DEBUG
   ⬜ SHIP

   Active TODOs (P0):
   - [ ] Design screen generator architecture
   - [ ] Design flow mapper

   Next action: /fork:design
   ```

3. **When `--short`**:
   ```
   FORK: [name] | Stage: DESIGN | 2/7 complete | Next: /fork:design
   ```

## What Gets Checked
- `.rork/project.json` — Stage field
- `.rork/requirements.md` — IDEA output exists?
- `.rork/features.json` — Features generated?
- `.rork/design.json` — Design spec exists?
- `.rork/personas/` — Personas generated?
- `.planning/TODOS.md` — P0 items
- `.planning/STATE.md` — Phase progress table
