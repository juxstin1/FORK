# /fork:test - Run TEST Stage

Generate and run tests based on the built app and simulation findings.

## Usage

```
/fork:test                       # Generate + run all tests
/fork:test --generate            # Generate test files only (don't run)
/fork:test --run                 # Run existing tests only
```

## Behavior

When user runs `/fork:test`:

1. **Check prerequisites**:
   - Built app code must exist (run `/fork:build` first)
   - If missing: `Run /fork:build first — test stage needs generated code.`

2. **Generate test cases**:
   - Unit tests for utility functions and stores
   - Component tests for screens and UI components
   - Integration tests for user flows (from design spec flows)
   - If simulation report exists (`.rork/design/ux-report.md`), generate tests targeting identified pain points

3. **Run tests**:
   ```bash
   cd C:\Users\Justin\desktop\FORK\app && npx jest --coverage
   ```

4. **Report results**:
   ```
   TEST stage complete
   Tests: [N] total, [P] passed, [F] failed
   Coverage: [X]%

   Failures:
   - [test name]: [reason]

   Next: /fork:debug (if failures) or /fork:ship (if all pass)
   ```

## Current Status
**Not yet implemented.** Phase 70 in the roadmap. Test infrastructure needs to be set up first (Jest/Vitest).
