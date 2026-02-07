# /fork:todos - List Todos

Show current todos, filtered by status, priority, or tags.

## Usage

```
/fork:todos                      # All open + in-progress
/fork:todos --all                # Everything including done
/fork:todos --p 0                # P0 only
/fork:todos --tags mcp           # Filter by tag
/fork:todos --blocked            # Show blocked items only
/fork:todos --mine               # Show items with owner:me
```

## Behavior

When user runs `/fork:todos [filters]`:

1. **Read `.planning/TODOS.md`**
2. **Parse all todo lines** into structured data
3. **Apply filters** (default: show `[ ]` open and `[>]` in-progress)
4. **Display summary**:
   ```
   FORK TODOs (12 open, 3 in-progress, 1 blocked)

   In Progress:
   > #012 P0 design    — Design screen generator architecture (started: 2026-02-07)

   Blocked:
   - #014 P1 design    — Implement output writers (blocked by #012)

   Open (P0):
     #001 P0 git       — Commit uncommitted server changes
     #002 P0 git       — Review new server files for secrets
     #004 P0 mcp       — Register run_persona_stage as MCP tool
     #011 P0 research  — Research Expo component libs for NativeWind
     #013 P0 design    — Design flow mapper

   Open (P1):
     #003 P1 cleanup   — Delete stray nul file
     #005 P1 mcp       — Expand run_design_stage beyond stub
     ...

   Summary: 4 P0, 7 P1, 8 P2, 1 P3
   ```

5. **When `--all`**: also include the `## Done` section at the bottom

## Display Format
- Group by status (in-progress first, then blocked, then open by priority)
- Show first tag as category label
- Truncate descriptions at 60 chars if needed
- Show blocker IDs for blocked items
- Show started date for in-progress items

## Important
- Read-only command — does not modify the file
- Default view hides done items (use `--all` to see them)
