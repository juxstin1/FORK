# FORK: The AI-Native App Framework 🍴

**FORK is not just a template. It is a cyborg.**

It combines a production-ready **React Native/Expo** environment with a **Model Context Protocol (MCP)** server that gives AI agents (like Claude) direct control over the codebase.

## How It Works

FORK allows you to build apps by *talking* to them.

### 🧠 The Brain (Server)
Located in `app/src/server/`.
This is an MCP server that exposes tools to your AI:
- `run_idea_stage`: Converts your raw ideas into structured requirements.
- `run_design_stage`: Generates UI/UX specifications (JSON).
- `run_build_stage`: Writes actual React Native code to your app.

### 🦾 The Body (App)
Located in `app/`.
This is a standard, high-performance Expo app pre-configured with:
- **NativeWind (Tailwind)**: For styling.
- **Expo Router**: For file-based navigation.
- **Zustand**: For state management.
- **Supabase**: For backend (configured, waiting for keys).

## The "Cool Game" (Glyph Pet)
The "Nothing-style" Tamagotchi you see right now is just **one example** of what FORK can build.
- The AI "Designed" it (via `scripts/build_pet.ts`).
- The AI "Built" it (by writing to `app/App.tsx`).

## Getting Started

1.  **Install dependencies**:
    ```bash
    cd app
    npm install
    ```

2.  **Connect Your AI**:
    Configure Claude Desktop to use the FORK MCP server (see `walkthrough.md`).

3.  **Build Something**:
    Tell Claude: *"I want to build a crypto wallet. Run the idea stage, then design it, then build it."*

4.  **Run the App**:
    ```bash
    npm run web    # For Browser
    npm run ios    # For iPhone
    npm run android # For Android
    ```

## Project Structure
- `.rork/`: The AI's memory (Requirements, Design Specs).
- `app/src/lib/prompts/`: The "Intelligence" (Prompt Engineering).
- `app/src/stages/`: The Logic (Idea, Design, Build execution).
