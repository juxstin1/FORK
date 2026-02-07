# /fork:design - Run DESIGN Stage

Convert requirements and personas into screens, flows, and a design specification.

## Usage

```
/fork:design                     # Generate design from requirements + personas
/fork:design --minimal           # Minimal UI (free tier style)
/fork:design --screens-only      # Skip flow mapping, just generate screens
```

## Behavior

When user runs `/fork:design`:

1. **Check prerequisites**:
   - `.rork/requirements.md` must exist
   - `.rork/features.json` must exist
   - Personas recommended but not required
   - If missing requirements: `Run /fork:idea first.`

2. **Read upstream artifacts**:
   - Requirements and features from IDEA stage
   - Persona data for UX decisions
   - Budget tier for component constraints

3. **Generate design specification**:
   - Use prompt `design.generate.v1` from registry
   - Map features to screens (1 feature = 1+ screens)
   - Define navigation structure (tab/stack/drawer based on complexity)
   - Select components appropriate to budget tier
   - Map user flows for core tasks (from persona goals)

4. **Write output**:
   - `.rork/design.json` — Machine-readable design spec (theme, screens, components, navigation)
   - `.rork/design/screens.md` — Human-readable screen descriptions
   - `.rork/design/flows.md` — User journey maps for core tasks

5. **Update state**:
   - Set `.rork/project.json` stage to "DESIGN"
   - Update `.planning/STATE.md`

6. **Report results**:
   ```
   DESIGN stage complete
   Navigation: tab (3 tabs)
   Screens: [N] total
     - Home (dashboard)
     - AddTask (form)
     - Settings (profile)
   Components: [N] unique
   Flows: [N] user journeys mapped

   Next: /fork:build
   ```

## Budget-Aware Component Selection

| Tier | UI Complexity | Components |
|------|--------------|------------|
| free | Minimal | Basic views, text inputs, buttons |
| starter | Standard | Cards, lists, modals, bottom sheets |
| pro | Rich | Animations, gestures, charts, maps |
| scale | Premium | Custom components, advanced interactions |

## Current Status
**Note:** The design stage is currently a stub that saves JSON. This command should generate the full design spec using Claude, then pass it to `runDesignStage()` for persistence.
