# /fork:preview - Capture App Preview

Take a screenshot of the running app and display it inline.

## Usage

```
/fork:preview                    # Capture default preview (localhost:3333)
/fork:preview --url URL          # Capture custom URL
/fork:preview --wait 3000        # Wait 3s for render before capture
```

## Behavior

When user runs `/fork:preview`:

1. **Check preview server is running**:
   - Verify `http://localhost:3333` is reachable
   - If not: `Dev server isn't running. Start with: npm run dev`

2. **Capture screenshot**:
   - Use `capture_preview` MCP tool
   - Waits 2s (default) for React to fully render
   - Returns base64 PNG at 2x retina resolution (375x812 viewport)

3. **Display result**:
   - Show the screenshot inline as an image
   - If capture fails, show the error and suggest fixes

## Preview Server

The full iPhone-frame preview is available at `http://localhost:3333` when running `npm run dev`. This provides:
- CSS iPhone 15 Pro frame around the app
- Device switcher (SE / 15 / Pro Max)
- Rotate button
- Reload button

## Requirements

- Puppeteer must be installed: `npm i -D puppeteer` (added to devDependencies)
- Dev server must be running (`npm run dev` starts both Expo on 8081 and preview on 3333)
