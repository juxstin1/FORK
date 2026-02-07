# /fork:simulate - Run Simulation Engine

AI-simulated user testing with generated personas.

## Usage

```
/fork:simulate                   # Run full simulation
/fork:simulate --persona primary # Simulate with primary persona only
/fork:simulate --flow onboarding # Simulate specific flow only
```

## Behavior

When user runs `/fork:simulate`:

1. **Check prerequisites**:
   - Built app code must exist
   - Personas must exist (`.rork/personas/`)
   - Design flows must exist (`.rork/design/flows.md`)
   - If missing: `Run /fork:build first.`

2. **Run persona simulations**:
   - Each persona "attempts" core user flows
   - Score friction points (1-10 severity)
   - Predict drop-off points
   - Identify accessibility issues

3. **Write UX report**:
   - `.rork/design/ux-report.md` — Simulation findings
   - Pain points ranked by severity
   - Drop-off predictions with confidence scores
   - Recommendations (pain points only — no feature suggestions)

4. **Report results**:
   ```
   SIMULATION complete
   Personas tested: 3
   Flows simulated: [N]

   Top Pain Points:
   1. [severity 8] Onboarding requires 6 taps — primary persona drops off
   2. [severity 6] Settings buried 3 levels deep
   3. [severity 4] No confirmation after task creation

   Full report: .rork/design/ux-report.md
   Next: /fork:test
   ```

## Key Principle
Simulations identify **pain points**, not suggest feature additions. Output is friction scores and drop-off predictions only.

## Current Status
**Not yet implemented.** Phase 60 in the roadmap.
