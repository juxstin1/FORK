# Phase 10: Project Foundation — Context

## The Vision

When `/rork new` runs, an iPhone preview appears **beside the terminal** — not buried in browser tabs, not inside VS Code, just *there*. The user stays in Claude Code, codes in the terminal, and sees changes reflected instantly on the iPhone preview beside it.

```
┌────────────────────────┬──────────────────┐
│                        │    ┌────────┐    │
│   Claude Code          │    │ iPhone │    │
│   Terminal             │    │ Preview│    │
│                        │    │        │    │
│   > Building...        │    │  Live  │    │
│   > Done.              │    │  App   │    │
│                        │    └────────┘    │
└────────────────────────┴──────────────────┘
```

## What's Essential

**Instant hot reload** — this is the #1 success criterion. Change code, see it on the iPhone preview in under a second. The feedback loop speed is everything.

- Preview window appears automatically beside terminal
- No manual window arrangement needed
- Server runs in background — Claude keeps working
- Changes reflect immediately

## What's In Scope

- Claude Code skill structure (`/rork` commands)
- Expo SDK 52 scaffold (Router, NativeWind, Zustand)
- Web preview with iPhone device frame
- Background dev server management
- `.rork/project.json` configuration schema
- Budget tier detection ($0/$25/$50/$100)
- **Supabase stub** — client/config wired up, ready to use (no features yet)

## What's Out of Scope

- **No real device testing** — physical iPhone, Expo Go, TestFlight workflows come later (for shipping)
- **No IDEA stage logic** — parsing app ideas is Phase 20
- **No backend features** — just the Supabase stub, actual auth/db comes later

## Technical Notes (for planning)

- Windows 11 environment
- Preview beside terminal = browser window auto-positioned (Windows snap or similar)
- Expo Web (`expo start --web`) for the preview
- iPhone frame is CSS/visual wrapper around the web app
- Hot reload via Expo's Fast Refresh

---

*Captured: 2025-01-08*
*Source: Discussion with user*
