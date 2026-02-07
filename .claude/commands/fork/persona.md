# /fork:persona - Run PERSONA Stage

Generate data-backed user personas from web research based on the app's category and requirements.

## Usage

```
/fork:persona                    # Run with existing requirements
/fork:persona --refresh          # Re-run research even if personas exist
```

## Behavior

When user runs `/fork:persona`:

1. **Check prerequisites**:
   - `.rork/requirements.md` must exist (run `/fork:idea` first)
   - `.rork/features.json` must exist
   - If missing, tell user: `Run /fork:idea first — persona stage needs requirements.`

2. **Run the PERSONA stage**:
   ```typescript
   // Calls src/stages/persona.ts → runPersonaStage()
   // Reads from .rork/features.json automatically
   ```

3. **What it does internally**:
   - Classifies app into 1 of 12 categories (social, fitness, productivity, etc.)
   - Builds web research queries for real demographic data
   - Searches for actual user statistics (age distributions, tech comfort, etc.)
   - Generates 1 primary + 2 secondary personas with real data
   - Falls back to default templates if research returns sparse results
   - Uses prompts: `persona.generate.v1`, `persona.research.v1`

4. **Writes output to `.rork/`**:
   - `personas/primary.md` — Primary user persona
   - `personas/secondary.md` — Secondary personas
   - Updates `project.json` with persona paths
   - **Auto-advances stage to DESIGN**

5. **Report results**:
   ```
   PERSONA stage complete
   Category: [fitness]

   Primary: Sarah Chen, 28
     - Tech comfort: High
     - Goals: Track workouts, see progress
     - Pain points: Complex UIs, data entry friction

   Secondary: Marcus Johnson, 42 / Priya Sharma, 19

   Data sources: [N] research queries executed
   Next: /fork:design
   ```

## Important Notes
- Persona stage auto-advances `project.json` stage to "DESIGN"
- If no web research executor is available, defaults are used (still good quality)
- `--refresh` flag forces re-generation even if persona files already exist
- The 12 categories: social, fitness, productivity, education, entertainment, finance, health, food, travel, shopping, utility, creative
