# /fork:todo-add - Add Todo

Add a todo to `.planning/TODOS.md` with auto-incremented ID. Fire and forget.

## Usage

```
/fork:todo-add "Wire response guard into resource handlers"
/fork:todo-add "Fix auth flow" --p 0
/fork:todo-add "Add tree caps" --p 2 --tags mcp,context
/fork:todo-add "Refactor budget logic" --p 1 --tags budget --owner me
```

## Behavior

When user runs `/fork:todo-add "description" [options]`:

1. **Read `.planning/TODOS.md`**
2. **Parse the `Next ID:` line** in the header to get the next available ID
3. **Format the new todo line**:
   ```
   - [ ] #028 P1 created:2026-02-07 tags:general — Wire response guard into resource handlers
   ```
   - Status: always `[ ]` (open)
   - ID: from `Next ID` counter, zero-padded to 3 digits
   - Priority: from `--p` flag, default `P1`
   - Date: today's date
   - Tags: from `--tags` flag, default none
   - Owner: from `--owner` flag, default none
   - Description: the quoted text

4. **Append the line** under the most appropriate section heading:
   - If `--tags` contains a phase keyword (design, build, test, etc.) → put under that phase section
   - If `--tags` contains `mcp`, `prompts`, `infra` → put under matching section
   - Otherwise → put under `## Immediate`

5. **Increment `Next ID:`** in the header

6. **Confirm with one line**:
   ```
   + #028 P1 — Wire response guard into resource handlers
   ```

7. **DO NOT** switch context, display the full list, or start working on it

## Parsing Rules

The file format is strict. Each todo line must match:
```
- [status] #ID P{0-3} created:YYYY-MM-DD [meta...] — description
```

- Status: `[ ]` open, `[>]` in-progress, `[x]` done, `[-]` blocked
- ID: `#` + zero-padded 3-digit number
- Priority: `P0` through `P3`
- Meta fields: `key:value` pairs, space-separated
- Description: everything after ` — ` (em dash with spaces)

## Important
- Single source of truth: `.planning/TODOS.md`
- Never duplicate IDs
- Always increment the `Next ID:` counter after adding
- Minimal interruption — this is a capture command
