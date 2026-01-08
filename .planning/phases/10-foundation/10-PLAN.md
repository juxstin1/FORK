# Phase 10: Project Foundation — PLAN

## Objective

Set up RORK as a working Claude Code skill with Expo scaffold and live iPhone web preview beside terminal. User runs `/rork new`, preview appears, hot reload works.

## Tasks

### 1. Create Expo Project Scaffold
```bash
cd C:\Users\Justin\desktop\rork
npx create-expo-app@latest app --template tabs
cd app
npx expo install nativewind tailwindcss
npx expo install zustand
npx expo install @supabase/supabase-js
```

**Files to create/modify:**
- `app/tailwind.config.js` — NativeWind config
- `app/babel.config.js` — Add NativeWind preset
- `app/global.css` — Tailwind directives
- `app/app/_layout.tsx` — Import global styles

### 2. iPhone Frame Web Preview

Create wrapper that shows app in iPhone bezel:

**Create:** `app/web/iframe-preview.html`
```html
<!-- Standalone HTML that:
  1. Shows iPhone 15 Pro frame (CSS)
  2. Embeds localhost:8081 in iframe
  3. Auto-refreshes on connection
-->
```

**Create:** `app/scripts/preview.js`
```js
// Opens preview HTML in browser
// Positions window to right side of screen (Windows snap)
// Runs expo start in background
```

### 3. Background Dev Server

**Create:** `app/scripts/dev.js`
```js
// 1. Spawn `npx expo start --web` in background
// 2. Wait for server ready
// 3. Open preview window beside terminal
// 4. Return control to Claude Code
```

### 4. RORK Config Schema

**Create:** `app/.rork/project.json`
```json
{
  "name": "",
  "idea": "",
  "budget": 0,
  "tier": "free",
  "stage": "INIT",
  "created": ""
}
```

**Create:** `app/src/types/rork.ts` — TypeScript types for config

### 5. Budget Tier Detection

**Create:** `app/src/lib/budget.ts`
```ts
// Maps budget ($0/$25/$50/$100) to tier config
// Returns: db, auth, storage, build choices
```

### 6. Supabase Stub

**Create:** `app/src/lib/supabase.ts`
```ts
// Supabase client setup
// Reads URL/key from env (placeholder values)
// Ready to use, no features yet
```

**Create:** `app/.env.example`
```
EXPO_PUBLIC_SUPABASE_URL=your-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### 7. Claude Code Skill Hook

**Create:** `~/.claude/commands/rork.md`
```markdown
# /rork skill definition
# Routes to: new, dev, status commands
```

## Verification

After each task:
- [ ] `npm run dev` starts without errors
- [ ] Preview window opens beside terminal
- [ ] Hot reload works (change text, see it update)
- [ ] `.rork/project.json` loads correctly

## Success Criteria

- [ ] `/rork new` scaffolds project and opens preview
- [ ] iPhone frame visible in preview window
- [ ] Code changes reflect in < 1 second
- [ ] Supabase client initializes (even with placeholder keys)
- [ ] Budget tier detection returns correct stack for each tier

## Output

```
rork/
├── app/                      # Expo project
│   ├── .rork/
│   │   └── project.json
│   ├── src/
│   │   ├── lib/
│   │   │   ├── budget.ts
│   │   │   └── supabase.ts
│   │   └── types/
│   │       └── rork.ts
│   ├── web/
│   │   └── iframe-preview.html
│   ├── scripts/
│   │   ├── dev.js
│   │   └── preview.js
│   └── [expo files]
└── .planning/
```

---

*Created: 2025-01-08*
*Estimated scope: ~2 hours*
