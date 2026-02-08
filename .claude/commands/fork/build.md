# /fork:build - Run BUILD Stage

Generate production-ready Expo code from the design specification.

## Usage

```
/fork:build                      # Build all screens and components
/fork:build --screen Home        # Build single screen by ID
/fork:build --component TaskCard # Build single component by ID
/fork:build --dry-run            # Show what would be generated without writing
```

## Behavior

When user runs `/fork:build`:

1. **Check prerequisites**:
   - `.rork/design.json` must exist (run `/fork:design` first)
   - If missing: `Run /fork:design first — build stage needs a design spec.`

2. **Generate code via MCP**:
   - Use the `run_build_generate` tool — this reads design.json, generates code for each screen and component via OpenRouter, writes files, and runs validation
   - For each screen: renders `build.screen.v2` prompt with screen spec, theme, navigation context
   - For each component: renders `build.component.v2` prompt with component spec and theme
   - All generated code uses NativeWind (className), TypeScript strict, Zustand patterns

3. **Validate output**:
   - Auto-runs post-build static analysis checking for:
     - Missing default exports on screens
     - Inline styles (should use NativeWind)
     - TypeScript `any` types
     - Missing SafeAreaView on screens
     - Console.log left in code
     - Hardcoded colors
   - Validation results are returned with the build output

4. **Write files via `runBuildStage()`**:
   - Files are written to `src/screens/` and `src/components/`
   - Directory creation is automatic
   - Path security prevents escaping project root

5. **Update state**:
   - Set `.rork/project.json` stage to "BUILD"
   - Update `.planning/STATE.md`

6. **Report results**:
   ```
   BUILD stage complete
   Files written: [N]
     - src/screens/Home.tsx
     - src/screens/Settings.tsx
     - src/components/TaskCard.tsx
     - src/components/ActionBar.tsx

   Validation:
     - src/screens/Home.tsx: OK
     - src/components/TaskCard.tsx: 1 issue (hardcoded color)

   Run: npm run dev
   Next: /fork:test (or /fork:preview to see it)
   ```

## Code Conventions (Enforced by v2 Prompts)
- NativeWind `className` for all styling (no StyleSheet.create, no inline styles)
- TypeScript strict — no `any` types
- Functional components with hooks
- SafeAreaView on all screens
- Zustand store access via selectors
- No console.log (use __DEV__ guard if needed)

## Generation Details

- **Prompts**: `build.screen.v2`, `build.component.v2`
- **Model**: OpenRouter (qwen/qwen3-coder-next or openai/gpt-oss-120b)
- **MCP Tool**: `run_build_generate`
- **Validator**: `build-validator.ts` (regex-based static checks)
