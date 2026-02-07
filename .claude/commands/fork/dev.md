# /fork:dev - Start Development Server

Launch the Expo dev server with web preview.

## Usage

```
/fork:dev                        # Start dev server (web)
/fork:dev --ios                  # Start with iOS simulator
/fork:dev --android              # Start with Android emulator
/fork:dev --tunnel               # Start with Expo tunnel for device testing
```

## Behavior

When user runs `/fork:dev`:

1. **Start the development server**:
   ```bash
   cd C:\Users\Justin\desktop\FORK\app && npm run dev
   ```

   Or if `--ios`:
   ```bash
   cd C:\Users\Justin\desktop\FORK\app && npx expo start --ios
   ```

   Or if `--android`:
   ```bash
   cd C:\Users\Justin\desktop\FORK\app && npx expo start --android
   ```

   Or if `--tunnel`:
   ```bash
   cd C:\Users\Justin\desktop\FORK\app && npx expo start --tunnel
   ```

2. **Default behavior** (no flags):
   ```bash
   cd C:\Users\Justin\desktop\FORK\app && npx expo start --web --port 8081
   ```

3. **Report**:
   ```
   FORK dev server running
   Web: http://localhost:8081
   Hot reload: active
   Press Ctrl+C to stop
   ```

## Notes
- All commands run from the `app/` directory
- Web preview is the fastest iteration cycle
- Hot reload works for all code changes
- The iPhone frame preview is at the web URL
