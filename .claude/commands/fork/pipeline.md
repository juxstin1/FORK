# /fork:pipeline - Run Full Pipeline

Execute the complete FORK pipeline from current stage to SHIP.

## Usage

```
/fork:pipeline                   # Resume from current stage
/fork:pipeline --from idea       # Start from IDEA stage
/fork:pipeline --to build        # Stop after BUILD stage
/fork:pipeline --from idea --to design  # Run IDEA → PERSONA → DESIGN only
```

## Behavior

When user runs `/fork:pipeline`:

1. **Detect current stage** from `.rork/project.json`
2. **Run remaining stages in order**:
   ```
   IDEA → PERSONA → DESIGN → BUILD → SIMULATE → TEST → DEBUG → SHIP
   ```
3. **Each stage**:
   - Show stage name and what it's doing
   - Run the stage
   - Show results summary
   - Pause if errors/conflicts found (ask user to resolve)
   - Continue to next stage

4. **Quality gates between stages**:
   - IDEA → PERSONA: Requirements must exist
   - PERSONA → DESIGN: Personas must exist
   - DESIGN → BUILD: Design spec must exist
   - BUILD → SIMULATE: Built code must exist
   - SIMULATE → TEST: UX report generated
   - TEST → DEBUG: Only if tests fail
   - DEBUG → SHIP: All tests must pass

5. **Report final status**:
   ```
   FORK Pipeline Complete
   ═══════════════════════
   ✅ IDEA      — 12 features, 0 conflicts
   ✅ PERSONA   — 3 personas, 8 research queries
   ✅ DESIGN    — 5 screens, 3 flows
   ✅ BUILD     — 14 files written
   ✅ SIMULATE  — 2 pain points found
   ✅ TEST      — 28/28 passing
   ⏭️ DEBUG     — skipped (no failures)
   ✅ SHIP      — package ready

   Total time: [duration]
   Ship package: .rork/ship/
   ```

## Notes
- Use `--from` and `--to` to run partial pipelines
- Each stage confirms before proceeding if issues found
- The pipeline can be interrupted and resumed (state is saved per stage)
