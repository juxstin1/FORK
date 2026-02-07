# /fork:build - Run BUILD Stage

Generate production-ready Expo code from the design specification.

## Usage

```
/fork:build                      # Build all screens and components
/fork:build --screen Home        # Build single screen
/fork:build --component TaskCard # Build single component
/fork:build --dry-run            # Show what would be generated without writing
```

## Behavior

When user runs `/fork:build`:

1. **Check prerequisites**:
   - `.rork/design.json` must exist (run `/fork:design` first)
   - If missing: `Run /fork:design first — build stage needs a design spec.`

2. **Read design spec**:
   - Screens, components, navigation structure
   - Theme colors and typography
   - Budget tier for backend selection

3. **Generate code files**:
   Using prompts `build.screen.v1` and `build.component.v1`:

   - **Navigation**: Expo Router file structure (`app/(tabs)/`, `app/+layout.tsx`)
   - **Screens**: React Native components with NativeWind styling
   - **Components**: Reusable UI components
   - **State**: Zustand store slices based on data model
   - **Backend**: Supabase integration (or tier-appropriate alternative)
   - **Types**: TypeScript interfaces for all data models

4. **Write files via `runBuildStage()`**:
   ```typescript
   // Passes array of {path, content} to src/stages/build.ts
   // Stage handles directory creation and file writing
   ```

5. **Update state**:
   - Set `.rork/project.json` stage to "BUILD"
   - Update `.planning/STATE.md`

6. **Report results**:
   ```
   BUILD stage complete
   Files written: [N]
     - app/(tabs)/index.tsx
     - app/(tabs)/add-task.tsx
     - app/(tabs)/settings.tsx
     - app/+layout.tsx
     - components/TaskCard.tsx
     - stores/taskStore.ts
     - lib/supabase.ts

   Run: cd app && npm run dev
   Next: /fork:test (or /fork:dev to preview)
   ```

## Code Conventions
- All screens use NativeWind (`className` prop)
- State management via Zustand (one store per domain)
- TypeScript strict mode — no `any` types
- Components are functional with hooks
- Supabase client initialized in `lib/supabase.ts`
