# Preview System

## Overview

FORK includes an inline iPhone preview system that lets you see the app without leaving the workflow.

## Components

### Preview Server (`app/scripts/preview-server.js`)
- Serves an iPhone frame page on **port 3333**
- Contains a CSS iPhone 15 Pro frame wrapping an iframe of `localhost:8081`
- Device switcher: SE, iPhone 15, Pro Max
- Rotate and reload controls

### Dev Launcher (`app/scripts/dev.js`)
- `npm run dev` starts Expo + preview server together
- Preview launches after Expo reports ready
- Both share lifecycle (Ctrl+C kills both)

### Screenshot Tool (`app/src/server/preview.ts`)
- MCP tool: `capture_preview`
- Uses Puppeteer headless to screenshot the running app
- Returns base64 PNG at 2x retina (375x812 viewport)
- Lazy-launches browser, reuses across calls

## Commands

```bash
npm run dev      # Expo + preview server (recommended)
npm run preview  # Preview server only (Expo must be running separately)
```

## URLs

| Service | URL |
|---------|-----|
| Expo | http://localhost:8081 |
| Preview | http://localhost:3333 |

## MCP Tool Usage

```
capture_preview
  url?: string     # Default: http://localhost:8081
  waitMs?: number  # Default: 2000 (wait for React render)
  Returns: base64 PNG image
```

## Requirements

- Puppeteer in devDependencies (`npm i -D puppeteer`)
- Expo running on port 8081
- For best results, wait 2-3 seconds after hot reload before capturing
