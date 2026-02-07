# Prompt Registry Skill

## Overview
All prompts live in `app/src/lib/prompts/`. No inline prompts allowed anywhere in the codebase.

## Structure
```
src/lib/prompts/
├── index.ts          # REGISTRY object + getPrompt/renderPrompt/getRenderedPrompt
├── render.ts         # {{variable}} template substitution
└── stages/
    ├── idea.ts       # idea.generate.v1, idea.refine.v1, idea.conflict.v1
    ├── persona.ts    # persona.generate.v1, persona.research.v1, persona.validate.v1
    ├── design.ts     # design.generate.v1
    └── build.ts      # build.screen.v1, build.component.v1
```

## Prompt IDs
Format: `stage.action.version`

| ID | Stage | Purpose |
|----|-------|---------|
| `idea.generate.v1` | IDEA | Generate requirements from raw idea |
| `idea.refine.v1` | IDEA | Refine existing requirements |
| `idea.conflict.v1` | IDEA | Detect feature/budget conflicts |
| `persona.generate.v1` | PERSONA | Generate user personas |
| `persona.research.v1` | PERSONA | Build research queries |
| `persona.validate.v1` | PERSONA | Validate persona quality |
| `design.generate.v1` | DESIGN | Generate screens and flows |
| `build.screen.v1` | BUILD | Generate screen code |
| `build.component.v1` | BUILD | Generate component code |

## Usage
```typescript
import { getPrompt, renderPrompt, getRenderedPrompt } from '../lib/prompts';

// Get raw prompt
const prompt = getPrompt('idea.generate.v1');

// Render with variables
const rendered = renderPrompt('idea.generate.v1', {
  idea: 'A fitness tracker app',
  budget: '25'
});

// Get fully rendered (system + user)
const full = getRenderedPrompt('idea.generate.v1', { idea, budget });
```

## Adding New Prompts
1. Create or edit the stage file in `src/lib/prompts/stages/`
2. Define prompt with: id, system template, user template, tags, token limit
3. Use `{{variable}}` for template substitution
4. Register in the REGISTRY object in `index.ts`
5. Access via `getPrompt(id)` — never import the prompt directly

## Conventions
- Prompts are versioned (v1, v2) — never modify a deployed version, create a new one
- System template sets the role/constraints
- User template has the actual task with variables
- Tags enable filtering prompts by stage or capability
- Token limits prevent runaway generation
