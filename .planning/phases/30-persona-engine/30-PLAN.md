# Phase 30: Persona Engine — PLAN

## Objective

Build web-researched, data-backed user persona generation that creates 3-4 realistic personas per app category. Personas must include real demographic stats, tech comfort levels, and behavioral patterns—not assumptions.

## Execution Context

**Reads from:**
- `.rork/features.json` - App requirements from IDEA stage
- `.rork/requirements.md` - Human-readable requirements

**Writes to:**
- `.rork/personas/primary.md` - Primary target persona
- `.rork/personas/secondary.md` - Secondary personas
- `.rork/personas/personas.json` - Machine-readable persona data

**Available tools:**
- WebSearch - Search for demographic data, user behavior studies
- WebFetch - Fetch specific pages for detailed data extraction
- MCP Docker tools (browser automation if needed)

## Context

### Input from IDEA Stage

The persona engine receives structured requirements including:
- `targetUser.demographic` - Initial demographic description
- `targetUser.goal` - What user wants to achieve
- `targetUser.context` - Usage context
- App category (inferred from features/problem)

### Established Patterns

From Phase 10/20:
- TypeScript strict mode
- Types in `src/types/`
- Lib code in `src/lib/`
- Stage orchestrators in `src/stages/`
- File writers follow `writer.ts` pattern
- Markdown generators follow `generators.ts` pattern

---

## Tasks

### Task 1: Persona Type Definitions

**Create:** `app/src/types/persona.ts`

```ts
export interface PersonaDemographics {
  ageRange: string;          // e.g., "25-34"
  primaryGender?: string;    // if research shows strong skew
  location: string;          // "Urban US", "Global", etc.
  income?: string;           // e.g., "$50k-75k"
  education?: string;
  occupation: string;
}

export interface TechProfile {
  devices: string[];         // ["iPhone 14+", "MacBook"]
  appUsageFrequency: string; // "daily", "weekly"
  techComfort: 1 | 2 | 3 | 4 | 5; // 1=low, 5=power user
  paymentWillingness: "free-only" | "low" | "moderate" | "high";
  privacyConcern: "low" | "moderate" | "high";
}

export interface BehaviorPattern {
  peakUsageTimes: string[];  // ["morning-commute", "lunch", "evening"]
  sessionDuration: string;   // "2-5 minutes", "15-30 minutes"
  primaryMotivation: string; // "save time", "track progress", etc.
  frustrations: string[];
  alternatives: string[];    // What they use today
}

export interface Persona {
  id: string;
  name: string;              // "Busy Professional Sarah"
  type: "primary" | "secondary" | "edge-case";
  oneLiner: string;          // Quick summary
  demographics: PersonaDemographics;
  techProfile: TechProfile;
  behavior: BehaviorPattern;
  goals: string[];
  painPoints: string[];
  quote: string;             // Characteristic quote
  dataSource: string;        // "Pew Research 2024", etc.
}

export interface PersonaSet {
  appCategory: string;
  generatedAt: string;
  primary: Persona;
  secondary: Persona[];
  researchSources: string[];
}
```

**Verification:**
- [ ] Types compile without errors
- [ ] Export added to `src/types/index.ts`

---

### Task 2: App Category Classifier

**Create:** `app/src/lib/persona/categories.ts`

Maps app features/problem to a category for targeted research.

```ts
export type AppCategory =
  | "fitness-health"
  | "productivity"
  | "finance"
  | "social"
  | "education"
  | "entertainment"
  | "shopping"
  | "travel"
  | "food-delivery"
  | "utilities"
  | "lifestyle"
  | "news-media";

export interface CategoryMatch {
  category: AppCategory;
  confidence: number;       // 0-1
  keywords: string[];       // matched keywords
}

export function classifyApp(
  problem: string,
  features: { name: string; description: string }[]
): CategoryMatch;
```

Uses keyword matching from problem statement and feature descriptions.

**Keywords per category:**
- fitness-health: workout, exercise, health, calories, steps, meditation, sleep
- productivity: task, todo, calendar, notes, time, organize, schedule
- finance: budget, expense, money, invest, savings, payment, bank
- social: friends, chat, share, community, connect, message
- education: learn, course, quiz, study, language, skill
- entertainment: game, music, video, stream, watch, play
- shopping: buy, product, cart, order, price, deal
- travel: trip, hotel, flight, booking, destination, map
- food-delivery: food, restaurant, order, delivery, menu
- utilities: convert, calculate, scan, translate, weather
- lifestyle: habit, journal, mood, personal, daily
- news-media: news, article, feed, read, subscribe

**Verification:**
- [ ] Correctly classifies fitness app as "fitness-health"
- [ ] Correctly classifies todo app as "productivity"
- [ ] Returns confidence score

---

### Task 3: Research Query Builder

**Create:** `app/src/lib/persona/research.ts`

Builds targeted search queries for demographic data.

```ts
export interface ResearchQuery {
  query: string;
  purpose: "demographics" | "behavior" | "tech-usage" | "market-size";
  sources: string[];  // preferred domains
}

export function buildResearchQueries(
  category: AppCategory,
  targetUser: { demographic: string; goal: string; context: string }
): ResearchQuery[];
```

**Query templates by purpose:**

Demographics:
- `"{category} app users demographics 2024 study"`
- `"{demographic} mobile app usage statistics"`
- `"who uses {category} apps age gender income"`

Behavior:
- `"{category} app user behavior patterns"`
- `"when do people use {category} apps"`
- `"mobile app session duration {category}"`

Tech usage:
- `"{demographic} smartphone usage habits"`
- `"iOS vs Android users {category}"`
- `"mobile payment willingness {category} apps"`

Market size:
- `"{category} app market size users 2024"`
- `"{category} mobile app growth statistics"`

**Preferred sources:**
- pewresearch.org
- statista.com
- emarketer.com
- comscore.com
- appannie.com (data.ai)
- sensor tower reports

**Verification:**
- [ ] Generates 4-6 relevant queries per category
- [ ] Queries include year (2024/2025)
- [ ] Sources array populated

---

### Task 4: Web Research Executor

**Create:** `app/src/lib/persona/web-research.ts`

Executes searches and extracts relevant data.

```ts
export interface ResearchResult {
  query: string;
  findings: string[];
  source: string;
  confidence: "high" | "medium" | "low";
  dataPoints: DataPoint[];
}

export interface DataPoint {
  type: "age" | "gender" | "income" | "usage" | "behavior" | "other";
  value: string;
  context: string;
  source: string;
}

export async function executeResearch(
  queries: ResearchQuery[]
): Promise<ResearchResult[]>;

export function extractDataPoints(
  searchResults: string,
  purpose: string
): DataPoint[];
```

**Implementation notes:**
- Uses WebSearch tool for queries
- Uses WebFetch for detailed page extraction if needed
- Extracts structured data points from results
- Deduplicates findings across sources
- Tracks source URLs for citation

**Verification:**
- [ ] Returns at least 2 results per query type
- [ ] Data points have source attribution
- [ ] Handles search failures gracefully (falls back to defaults)

---

### Task 5: Persona Generator

**Create:** `app/src/lib/persona/generator.ts`

Synthesizes research into concrete personas.

```ts
export interface PersonaGeneratorInput {
  category: AppCategory;
  targetUser: {
    demographic: string;
    goal: string;
    context: string;
  };
  research: ResearchResult[];
  budget: BudgetTier;
}

export function generatePersonas(
  input: PersonaGeneratorInput
): PersonaSet;
```

**Persona generation logic:**

1. **Primary persona** (represents 60-70% of users):
   - Uses median values from research
   - Most common age range, tech comfort, behavior
   - Represents the "ideal" user

2. **Secondary persona 1** (represents 20-25% of users):
   - Adjacent demographic (older or younger)
   - Different tech comfort level
   - Same core need, different approach

3. **Secondary persona 2** (represents 10-15% of users):
   - Edge case or power user
   - Higher/lower engagement pattern
   - Helps identify feature boundaries

**Name generation:**
- Alliterative names tied to persona type
- Examples: "Busy Professional Brian", "Student Sarah", "Tech-Savvy Tom"

**Quote generation:**
- Based on pain points and goals
- Examples: "I just want something that works without thinking"
- "I've tried five apps but none stick"

**Verification:**
- [ ] Generates 1 primary + 2 secondary personas
- [ ] All required fields populated
- [ ] Data sources cited in each persona

---

### Task 6: Persona File Writers

**Create:** `app/src/lib/persona/writer.ts`

```ts
export interface PersonaWriteResult {
  primaryMd: string;
  secondaryMd: string;
  personasJson: string;
}

export function generatePrimaryPersonaMd(persona: Persona): string;
export function generateSecondaryPersonasMd(personas: Persona[]): string;
export function generatePersonasJson(personaSet: PersonaSet): string;

export async function writePersonaFiles(
  projectDir: string,
  personaSet: PersonaSet
): Promise<PersonaWriteResult>;
```

**Primary persona markdown format:**

```markdown
# Primary Persona: {name}

> {oneLiner}

## Demographics

| Attribute | Value | Source |
|-----------|-------|--------|
| Age | {ageRange} | {source} |
| Location | {location} | {source} |
| Occupation | {occupation} | {source} |
| Income | {income} | {source} |

## Tech Profile

- **Devices:** {devices}
- **App Usage:** {frequency}
- **Tech Comfort:** {comfort}/5
- **Payment Willingness:** {willingness}
- **Privacy Concern:** {concern}

## Behavior

### Usage Patterns
- Peak times: {times}
- Session duration: {duration}
- Primary motivation: {motivation}

### Current Alternatives
{alternatives}

## Goals
{goals as bullets}

## Pain Points
{painPoints as bullets}

## Characteristic Quote

> "{quote}"

---
*Research sources: {sources}*
*Generated by FORK on {date}*
```

**Verification:**
- [ ] Creates `.rork/personas/` directory
- [ ] Writes primary.md with full details
- [ ] Writes secondary.md with all secondary personas
- [ ] Writes personas.json (machine-readable)

---

### Task 7: Persona Stage Orchestrator

**Create:** `app/src/stages/persona.ts`

```ts
export interface PersonaStageInput {
  projectDir: string;
}

export interface PersonaStageOutput {
  personaSet: PersonaSet;
  files: PersonaWriteResult;
  researchSummary: {
    queriesExecuted: number;
    sourcesFound: number;
    dataPointsExtracted: number;
  };
}

export async function runPersonaStage(
  input: PersonaStageInput
): Promise<PersonaStageOutput>;
```

**Orchestration flow:**

1. Read requirements from `.rork/features.json`
2. Classify app category
3. Build research queries
4. Execute web research
5. Generate persona set
6. Write persona files
7. Update project.json with persona paths

**Error handling:**
- If no requirements found: throw with clear message
- If research fails: fall back to category defaults
- If category unclear: prompt user or use "lifestyle" default

**Verification:**
- [ ] Reads from IDEA stage output
- [ ] Completes full pipeline
- [ ] Updates project.json

---

### Task 8: Default Persona Templates

**Create:** `app/src/lib/persona/defaults.ts`

Fallback personas when research is insufficient.

```ts
export interface DefaultPersonaTemplate {
  category: AppCategory;
  primary: Partial<Persona>;
  secondary: Partial<Persona>[];
}

export const DEFAULT_TEMPLATES: Record<AppCategory, DefaultPersonaTemplate>;

export function getDefaultTemplate(category: AppCategory): DefaultPersonaTemplate;

export function mergeWithDefaults(
  research: Partial<Persona>,
  defaults: Partial<Persona>
): Persona;
```

**Default templates per category:**

fitness-health:
- Primary: 25-34, moderate tech comfort, daily usage, health-conscious professional
- Secondary: 18-24 student, 45-54 health-focused parent

productivity:
- Primary: 28-40, high tech comfort, knowledge worker
- Secondary: 18-24 student, 35-50 small business owner

finance:
- Primary: 25-40, moderate-high tech comfort, income-conscious
- Secondary: 18-24 new earner, 45-60 retirement planner

(Continue for all categories...)

**Verification:**
- [ ] All 12 categories have defaults
- [ ] Defaults produce valid personas
- [ ] Merge preserves research data over defaults

---

### Task 9: Barrel Exports & Integration

**Updates:**

1. Create `app/src/lib/persona/index.ts` barrel export
2. Add to `app/src/types/index.ts`
3. Add persona paths to `RorkProject` type if needed

**Verification:**
- [ ] `import { runPersonaStage } from './stages/persona'` works
- [ ] `import type { Persona, PersonaSet } from './types'` works
- [ ] No circular dependencies

---

## Verification

After implementation:

```bash
cd app && npx tsc --noEmit
```

**Manual verification:**
- [ ] Create test requirements file
- [ ] Run persona stage
- [ ] Verify 3 personas generated
- [ ] Check data sources cited
- [ ] Review markdown output quality

---

## Success Criteria

- [ ] Persona stage completes without errors
- [ ] Generates 1 primary + 2 secondary personas
- [ ] Each persona has real data sources (not "assumed")
- [ ] Markdown files are human-readable and actionable
- [ ] JSON output consumable by DESIGN stage
- [ ] Works with all 12 app categories
- [ ] Graceful fallback when research unavailable

---

## Output

```
app/
├── .rork/
│   ├── personas/
│   │   ├── primary.md      # Primary persona details
│   │   ├── secondary.md    # Secondary personas
│   │   └── personas.json   # Machine-readable
│   ├── requirements.md     # (from IDEA)
│   └── features.json       # (from IDEA)
└── src/
    ├── types/
    │   ├── persona.ts      # NEW
    │   └── index.ts        # Updated
    ├── lib/
    │   └── persona/
    │       ├── index.ts    # Barrel export
    │       ├── categories.ts
    │       ├── research.ts
    │       ├── web-research.ts
    │       ├── generator.ts
    │       ├── writer.ts
    │       └── defaults.ts
    └── stages/
        ├── idea.ts
        └── persona.ts      # NEW
```

---

## Notes

**Research limitations:**
- WebSearch may not always return structured data
- Some queries may hit paywalls (Statista, eMarketer)
- Default templates are essential fallback

**Future improvements:**
- Cache research results by category
- Allow user to provide their own research
- A/B test persona accuracy with real users

---

*Created: 2025-01-08*
*Estimated scope: ~3 hours*
*Dependencies: Phase 20 (IDEA Stage) complete*
