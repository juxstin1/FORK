# /fork:todo-block - Block a Todo

Mark a todo as blocked and record what blocks it.

## Usage

```
/fork:todo-block #044 --by #043
/fork:todo-block 44 --by 43     # # is optional
```

## Behavior

When user runs `/fork:todo-block #ID --by #blockerID`:

1. **Read `.planning/TODOS.md`**
2. **Find the line** matching `#ID`
3. **Validate**:
   - If already `[x]`: `#044 is already done — can't block.`
   - If blocker `#blockerID` doesn't exist: `#043 not found.`
   - If blocker is already done: `#043 is already done — not a valid blocker.`
4. **Update the line**:
   - Change `[ ]` or `[>]` → `[-]`
   - If `blockedBy:` already exists, append the new ID: `blockedBy:#043,#045`
   - If no `blockedBy:`, add `blockedBy:#043` to meta fields
5. **Write the file back**
6. **Confirm**:
   ```
   - #044 P2 blocked by #043 — Add tree caps to get_project_summary
   ```

## Important
- A todo can be blocked by multiple IDs (comma-separated)
- When the blocker is completed via `/fork:todo-done`, the blocked todo auto-unblocks
- Does not change priority or other fields
