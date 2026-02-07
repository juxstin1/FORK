# /fork:app-init - Initialize New App Project

Create a fresh app directory with Expo, install dependencies, and set up the FORK pipeline scaffolding.

## Usage

```
/fork:app-init                        # Interactive — prompts for app name + idea
/fork:app-init my-app                 # Named project, prompts for idea
/fork:app-init my-app "A fitness tracker"  # Full init with name + idea
```

## Behavior

When user runs `/fork:app-init [name] [idea]`:

1. **Prompt for missing info** (if not provided):
   - App name (kebab-case, used as directory name)
   - App idea (one-sentence description)
   - Monthly budget ($0 / $25 / $50 / $100)

2. **Create project directory and Expo scaffold**:
   ```bash
   cd C:\Users\Justin\desktop\FORK
   npx create-expo-app@latest app --template blank-typescript
   ```
   If `app/` already exists, warn the user and ask before overwriting.

3. **Install core dependencies**:
   ```bash
   cd C:\Users\Justin\desktop\FORK\app
   npx expo install nativewind tailwindcss react-native-reanimated
   npm install zustand @supabase/supabase-js zod
   npm install -D @modelcontextprotocol/sdk tsx
   ```

4. **Create FORK scaffolding**:
   - `app/.rork/project.json` — Fill with app name, idea, budget, tier, stage: "INIT"
   - `app/src/stages/` — Copy stage files (idea.ts, persona.ts, design.ts, build.ts, read.ts, docker.ts)
   - `app/src/lib/` — Copy library modules (budget, prompts, context, etc.)
   - `app/src/types/` — Copy type definitions
   - `app/src/server/` — Copy MCP server
   - `app/src/stores/` — Copy Zustand store

5. **Initialize config files**:
   - `tailwind.config.js` — NativeWind configuration
   - `tsconfig.json` — Strict TypeScript
   - `.env.example` — Template with required variables

6. **Update `.planning/STATE.md`**:
   - Set phase to 10 (Foundation)
   - Mark as in-progress

7. **Confirm**:
   ```
   FORK initialized: my-app
   Budget: $25/mo (starter tier)
   Stage: INIT → ready for /fork:idea
   Run: cd app && npm run dev
   ```

## Important
- ALWAYS run from the FORK project root (`C:\Users\Justin\desktop\FORK`)
- If `app/` directory exists with code, this is a DESTRUCTIVE operation — confirm first
- The Expo template should be `blank-typescript` (no tabs, no router pre-installed)
- After init, the next step is `/fork:idea` to process the app idea
