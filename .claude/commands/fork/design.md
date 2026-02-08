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

2. **Generate design via MCP**:
   - Use the `run_design_generate` tool — this reads upstream artifacts, calls OpenRouter with the `design.generate.v2` prompt, and saves the result
   - The tool handles: feature reading, persona integration, budget tier constraints, and JSON parsing
   - Falls back gracefully if personas are missing

3. **Verify output**:
   - `.rork/design.json` — Machine-readable design spec (theme, screens, components, navigation)
   - Check screen count matches feature coverage
   - Check navigation type matches app complexity

4. **Update state**:
   - Set `.rork/project.json` stage to "DESIGN"
   - Update `.planning/STATE.md`

5. **Report results**:
   ```
   DESIGN stage complete
   Navigation: tab (3 tabs)
   Screens: [N] total
     - Home (dashboard)
     - AddTask (form)
     - Settings (profile)
   Components: [N] unique

   Next: /fork:build
   ```

## Budget-Aware Component Selection

| Tier | UI Complexity | Components |
|------|--------------|------------|
| free | Minimal | Basic views, text inputs, buttons |
| starter | Standard | Cards, lists, modals, bottom sheets |
| pro | Rich | Animations, gestures, charts, maps |
| scale | Premium | Custom components, advanced interactions |

## Generation Details

- **Prompt**: `design.generate.v2` (persona-driven, budget-aware)
- **Model**: OpenRouter (qwen/qwen3-coder-next or openai/gpt-oss-120b)
- **MCP Tool**: `run_design_generate`
