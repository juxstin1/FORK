# /fork:ship - Run SHIP Stage

Generate the complete App Store submission package.

## Usage

```
/fork:ship                       # Full ship package
/fork:ship --screenshots         # Generate screenshots only
/fork:ship --store-copy          # Generate store listing copy only
/fork:ship --eas                 # Trigger EAS Build only
```

## Behavior

When user runs `/fork:ship`:

1. **Check prerequisites**:
   - All tests must pass (run `/fork:test` first)
   - Design spec must exist
   - If not ready: `Run /fork:test first — ship requires passing tests.`

2. **Generate submission assets**:
   - **Screenshots**: All required device sizes (iPhone 6.7", 6.1", iPad, etc.)
   - **Store copy**: App name, subtitle, description, keywords — optimized using persona data
   - **Privacy policy**: Auto-generated based on app permissions and data usage
   - **App icon**: Verify all required sizes exist

3. **Trigger EAS Build** (if configured):
   ```bash
   cd C:\Users\Justin\desktop\FORK\app && npx eas build --platform all
   ```

4. **Write ship package**:
   - `.rork/ship/checklist.md` — Submission readiness checklist
   - `.rork/ship/store-copy.md` — Store listing text
   - `.rork/ship/screenshots/` — Device screenshots
   - `.rork/ship/privacy-policy.md` — Privacy policy

5. **Report results**:
   ```
   SHIP stage complete

   Package:
   ✅ Screenshots: [N] sizes generated
   ✅ Store copy: title, subtitle, description, keywords
   ✅ Privacy policy: generated
   ✅ App icon: all sizes present
   ⬜ EAS Build: [status]

   Checklist: .rork/ship/checklist.md
   Ready to submit!
   ```

## Current Status
**Not yet implemented.** Phase 90 in the roadmap.
