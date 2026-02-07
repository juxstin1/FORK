# /fork:todo-start - Start a Todo

Mark a todo as in-progress by ID.

## Usage

```
/fork:todo-start #012
/fork:todo-start 12          # # is optional
```

## Behavior

When user runs `/fork:todo-start #ID`:

1. **Read `.planning/TODOS.md`**
2. **Find the line** matching `#ID` (zero-pad to 3 digits if needed)
3. **Validate**:
   - If already `[>]`: `#012 is already in progress.`
   - If already `[x]`: `#012 is already done.`
   - If `[-]` (blocked): `#012 is blocked by [blockers]. Unblock first.`
   - If not found: `#012 not found.`
4. **Update the line**:
   - Change `[ ]` → `[>]`
   - Add `started:YYYY-MM-DD` to the meta fields (before the ` — `)
5. **Write the file back**
6. **Confirm**:
   ```
   > #012 P0 — Design screen generator architecture
   ```

## Important
- Only changes status and adds `started:` date
- Does not move the line between sections
- Does not change any other field
