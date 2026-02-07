# /fork:todo-done - Complete a Todo

Mark a todo as done by ID and move it to the Done section.

## Usage

```
/fork:todo-done #012
/fork:todo-done 12            # # is optional
```

## Behavior

When user runs `/fork:todo-done #ID`:

1. **Read `.planning/TODOS.md`**
2. **Find the line** matching `#ID` (zero-pad to 3 digits if needed)
3. **Validate**:
   - If already `[x]`: `#012 is already done.`
   - If not found: `#012 not found.`
4. **Update the line**:
   - Change `[ ]` or `[>]` → `[x]`
   - Add `done:YYYY-MM-DD` to the meta fields (before the ` — `)
   - Keep `started:` date if it exists
5. **Move the line** from its current section to the `## Done` section
6. **Unblock dependents**: find any todos with `blockedBy:#ID` and:
   - If that was their only blocker, change `[-]` → `[ ]` and remove `blockedBy:#ID`
   - If they have other blockers, just remove this ID from the `blockedBy:` list
7. **Write the file back**
8. **Confirm**:
   ```
   x #012 P0 — Design screen generator architecture
   ```
   If dependents were unblocked:
   ```
   x #012 P0 — Design screen generator architecture
     unblocked: #014, #015
   ```

## Important
- Always moves the completed line to `## Done` section
- Always checks for and resolves `blockedBy:` references
- Does not change any other field besides status and done date
