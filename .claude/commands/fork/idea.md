# /fork:idea - Run IDEA Stage

Process a raw app idea into structured requirements, features, and platform targets.

## Usage

```
/fork:idea                              # Uses idea from .rork/project.json
/fork:idea "A habit tracker with streaks"  # Process new idea
/fork:idea "Music production app" --budget 50  # Idea + budget override
```

## Behavior

When user runs `/fork:idea [idea] [--budget N]`:

1. **Gather inputs**:
   - Read `.rork/project.json` for existing idea/budget
   - Override with provided arguments if given
   - If no idea exists anywhere, prompt the user

2. **Run the IDEA stage**:
   ```typescript
   // Calls src/stages/idea.ts → runIdeaStage()
   // Input: { idea: string, budget: number, projectDir: string }
   ```

3. **What it does internally**:
   - Detects budget tier (free/starter/pro/scale)
   - Infers target platforms (iOS, Android, web) from keywords
   - Generates feature list with priorities (must-have, should-have, nice-to-have)
   - Checks for feature/budget conflicts (e.g., Clerk auth on free tier)
   - Uses prompt `idea.generate.v1` from registry

4. **Writes output to `.rork/`**:
   - `requirements.md` — Human-readable requirements doc
   - `features.json` — Machine-readable feature definitions

5. **Update state**:
   - Set `.rork/project.json` stage to "IDEA"
   - Update `.planning/STATE.md` phase 20 status

6. **Report results**:
   ```
   IDEA stage complete
   App: [name]
   Tier: [starter] ($25/mo)
   Platforms: iOS, Android
   Features: [N] total ([X] must-have, [Y] should-have)
   Conflicts: [N] detected

   Next: /fork:persona
   ```

## If Conflicts Found

Display each conflict with its resolution suggestion:
```
Conflict: "Push notifications" requires Firebase ($5/mo) — exceeds free tier
Resolution: Use Expo Push Notifications (free) or upgrade to starter tier
```

Ask user whether to accept resolutions or adjust the idea.

## Output Files
- `.rork/requirements.md` — Full requirements document
- `.rork/features.json` — Structured feature data for downstream stages
