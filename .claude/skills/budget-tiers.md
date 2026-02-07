# Budget Tiers Skill

## Overview
Budget-first architecture. User declares monthly spend, FORK picks the stack.
Implementation: `app/src/lib/budget.ts`

## Tier Map

| Tier | Budget | Database | Auth | Storage | Build |
|------|--------|----------|------|---------|-------|
| `free` | $0 | Supabase free | Supabase | R2 free | EAS free |
| `starter` | $1-25 | Supabase Pro | Supabase | R2 | EAS Production |
| `pro` | $26-50 | Supabase Pro | Clerk | R2 + CDN | EAS + OTA |
| `scale` | $51+ | PlanetScale | Clerk Pro | R2 + Edge | Full EAS |

## How Tiers Flow Through the Pipeline

### IDEA Stage
- Detects tier from budget amount
- Checks feature/budget conflicts (e.g., Clerk on free tier = conflict)
- Writes tier to requirements

### DESIGN Stage (planned)
- Simpler UI components for `free` tier
- Richer interactions for `pro`/`scale`
- Component selection respects tier constraints

### BUILD Stage (planned)
- Generates backend integration code matching tier
- Auth setup differs by tier (Supabase vs Clerk)
- Storage and CDN configuration varies

### SHIP Stage (planned)
- EAS build configuration matches tier
- OTA updates only for `pro`+

## Conflict Detection
Located in `src/lib/idea/constraints.ts`. Catches:
- Features requiring paid services on free tier
- Platform-specific features on wrong platforms
- Auth provider mismatches
- Storage capacity mismatches

## Key Rule
The budget is a hard constraint, not a suggestion. Never recommend services that exceed the declared budget tier.
