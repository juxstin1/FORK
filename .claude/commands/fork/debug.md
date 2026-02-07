# /fork:debug - Run DEBUG Stage

Analyze test failures, identify root causes, and generate fixes.

## Usage

```
/fork:debug                      # Auto-fix all test failures
/fork:debug --analyze            # Analyze only, don't auto-fix
/fork:debug --error "TypeError: Cannot read property..."  # Debug specific error
```

## Behavior

When user runs `/fork:debug`:

1. **Check prerequisites**:
   - Test results must exist (run `/fork:test` first)
   - If no failures: `All tests passing. Nothing to debug. Run /fork:ship.`

2. **Analyze failures**:
   - Map each test failure to source code location
   - Categorize: type error, logic error, missing dependency, async issue, etc.
   - Prioritize by impact (blocking flows first)

3. **Generate fixes**:
   - Write corrected code for each failure
   - Apply fixes via `runBuildStage()` (same file-writing mechanism)
   - Log all changes to `.rork/debug-log.md`

4. **Re-run tests**:
   - Run the fix-test loop (max 3 iterations)
   - If still failing after 3 rounds, report remaining issues

5. **Report results**:
   ```
   DEBUG stage complete
   Fixed: [N] of [M] failures
   Iterations: [X]

   Remaining issues:
   - [issue]: [reason it couldn't be auto-fixed]

   Next: /fork:ship (or /fork:test to re-verify)
   ```

## Current Status
**Not yet implemented.** Phase 80 in the roadmap.
