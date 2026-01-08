import type { Persona, PersonaSet } from "../../types/persona";
import type { BudgetTier } from "../../types/rork";
import type { AppCategory } from "./categories";
import type { ResearchResult, DataPoint } from "./web-research";

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

const FIRST_NAMES = {
  professional: ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley"],
  student: ["Sarah", "Mike", "Emma", "Jake", "Olivia", "Noah"],
  parent: ["Jennifer", "David", "Michelle", "Robert", "Amanda", "Chris"],
  senior: ["Patricia", "Richard", "Barbara", "William", "Susan", "James"],
  techSavvy: ["Tom", "Tina", "Tyler", "Tara", "Trevor", "Tessa"],
};

const PERSONA_ARCHETYPES = {
  primary: {
    techComfort: 3 as const,
    paymentWillingness: "moderate" as const,
    ageOffset: 0,
  },
  secondary1: {
    techComfort: 4 as const,
    paymentWillingness: "low" as const,
    ageOffset: -5,
  },
  secondary2: {
    techComfort: 2 as const,
    paymentWillingness: "free-only" as const,
    ageOffset: 10,
  },
};

export function generatePersonas(input: PersonaGeneratorInput): PersonaSet {
  const { category, targetUser, research, budget } = input;

  // Extract insights from research
  const insights = extractInsights(research);

  // Generate primary persona (60-70% of users)
  const primary = generatePrimaryPersona(
    category,
    targetUser,
    insights,
    budget
  );

  // Generate secondary personas
  const secondary1 = generateSecondaryPersona(
    category,
    targetUser,
    insights,
    budget,
    "adjacent-younger"
  );

  const secondary2 = generateSecondaryPersona(
    category,
    targetUser,
    insights,
    budget,
    "edge-case"
  );

  return {
    appCategory: category,
    generatedAt: new Date().toISOString(),
    primary,
    secondary: [secondary1, secondary2],
    researchSources: collectSources(research),
  };
}

interface ResearchInsights {
  primaryAgeRange: string;
  commonDevices: string[];
  peakUsageTimes: string[];
  sessionDuration: string;
  paymentWillingness: "free-only" | "low" | "moderate" | "high";
  sources: string[];
}

function extractInsights(research: ResearchResult[]): ResearchInsights {
  const agePoints = research
    .flatMap((r) => r.dataPoints)
    .filter((dp) => dp.type === "age");

  const usagePoints = research
    .flatMap((r) => r.dataPoints)
    .filter((dp) => dp.type === "usage");

  // Default insights if research is sparse
  const insights: ResearchInsights = {
    primaryAgeRange: "25-34",
    commonDevices: ["iPhone", "Android phone"],
    peakUsageTimes: ["morning", "evening"],
    sessionDuration: "5-10 minutes",
    paymentWillingness: "low",
    sources: research.filter((r) => r.confidence !== "low").map((r) => r.source),
  };

  // Override with research data if available
  if (agePoints.length > 0) {
    insights.primaryAgeRange = agePoints[0].value;
  }

  if (usagePoints.length > 0) {
    const usageText = usagePoints[0].value.toLowerCase();
    if (usageText.includes("minute")) {
      insights.sessionDuration = usagePoints[0].value;
    }
  }

  return insights;
}

function generatePrimaryPersona(
  category: AppCategory,
  targetUser: { demographic: string; goal: string; context: string },
  insights: ResearchInsights,
  budget: BudgetTier
): Persona {
  const archetype = PERSONA_ARCHETYPES.primary;
  const name = generateName("professional", category);

  return {
    id: "primary-1",
    name,
    type: "primary",
    oneLiner: `${targetUser.demographic} who wants to ${targetUser.goal}`,
    demographics: {
      ageRange: insights.primaryAgeRange,
      location: "Urban US",
      occupation: inferOccupation(targetUser.demographic),
      income: inferIncome(budget),
    },
    techProfile: {
      devices: insights.commonDevices,
      appUsageFrequency: "daily",
      techComfort: archetype.techComfort,
      paymentWillingness: budgetToWillingness(budget),
      privacyConcern: "moderate",
    },
    behavior: {
      peakUsageTimes: insights.peakUsageTimes,
      sessionDuration: insights.sessionDuration,
      primaryMotivation: targetUser.goal,
      frustrations: generateFrustrations(category),
      alternatives: generateAlternatives(category),
    },
    goals: [
      targetUser.goal,
      `Use the app ${targetUser.context}`,
      "Save time on routine tasks",
    ],
    painPoints: generatePainPoints(category, "primary"),
    quote: generateQuote(category, "primary"),
    dataSource:
      insights.sources.length > 0
        ? insights.sources.join(", ")
        : "Category research baseline",
  };
}

function generateSecondaryPersona(
  category: AppCategory,
  targetUser: { demographic: string; goal: string; context: string },
  insights: ResearchInsights,
  budget: BudgetTier,
  variant: "adjacent-younger" | "edge-case"
): Persona {
  const isYounger = variant === "adjacent-younger";
  const archetype = isYounger
    ? PERSONA_ARCHETYPES.secondary1
    : PERSONA_ARCHETYPES.secondary2;

  const nameType = isYounger ? "student" : "senior";
  const name = generateName(nameType, category);

  const ageRange = adjustAgeRange(insights.primaryAgeRange, archetype.ageOffset);

  return {
    id: isYounger ? "secondary-1" : "secondary-2",
    name,
    type: "secondary",
    oneLiner: isYounger
      ? `Younger user exploring ${category} apps`
      : `Occasional user with different needs`,
    demographics: {
      ageRange,
      location: isYounger ? "Urban/Suburban US" : "Suburban US",
      occupation: isYounger ? "Student/Early Career" : "Established Professional",
      income: isYounger ? "$30k-50k" : "$75k-100k",
    },
    techProfile: {
      devices: isYounger
        ? ["iPhone", "MacBook"]
        : ["Android phone", "Windows laptop"],
      appUsageFrequency: isYounger ? "daily" : "weekly",
      techComfort: archetype.techComfort,
      paymentWillingness: archetype.paymentWillingness,
      privacyConcern: isYounger ? "low" : "high",
    },
    behavior: {
      peakUsageTimes: isYounger ? ["evening", "night"] : ["morning", "weekend"],
      sessionDuration: isYounger ? "15-30 minutes" : "2-5 minutes",
      primaryMotivation: isYounger
        ? "Explore and discover"
        : "Get specific task done",
      frustrations: generateFrustrations(category, variant),
      alternatives: generateAlternatives(category),
    },
    goals: isYounger
      ? [
          "Find the best app in category",
          "Share with friends",
          "Customize experience",
        ]
      : [
          "Quick task completion",
          "Minimal learning curve",
          "Reliable performance",
        ],
    painPoints: generatePainPoints(category, variant),
    quote: generateQuote(category, variant),
    dataSource: `${insights.sources.length > 0 ? insights.sources[0] : "Category research"} (extrapolated)`,
  };
}

function generateName(
  type: keyof typeof FIRST_NAMES,
  category: AppCategory
): string {
  const names = FIRST_NAMES[type];
  // Use category to pick a deterministic name
  const index = category.charCodeAt(0) % names.length;
  const firstName = names[index];

  const descriptors: Record<keyof typeof FIRST_NAMES, string> = {
    professional: "Busy Professional",
    student: "Curious Student",
    parent: "Multitasking Parent",
    senior: "Practical User",
    techSavvy: "Tech-Savvy",
  };

  return `${descriptors[type]} ${firstName}`;
}

function inferOccupation(demographic: string): string {
  const lower = demographic.toLowerCase();
  if (lower.includes("student")) return "Student";
  if (lower.includes("professional")) return "Professional";
  if (lower.includes("parent")) return "Working Parent";
  if (lower.includes("entrepreneur")) return "Entrepreneur";
  if (lower.includes("retired")) return "Retired";
  return "Professional";
}

function inferIncome(budget: BudgetTier): string {
  const incomeMap: Record<BudgetTier, string> = {
    free: "$40k-60k",
    starter: "$50k-75k",
    pro: "$75k-100k",
    scale: "$100k+",
  };
  return incomeMap[budget];
}

function budgetToWillingness(
  budget: BudgetTier
): "free-only" | "low" | "moderate" | "high" {
  const map: Record<
    BudgetTier,
    "free-only" | "low" | "moderate" | "high"
  > = {
    free: "free-only",
    starter: "low",
    pro: "moderate",
    scale: "high",
  };
  return map[budget];
}

function adjustAgeRange(baseRange: string, offset: number): string {
  const match = baseRange.match(/(\d+)[-–](\d+)/);
  if (!match) return baseRange;

  const low = parseInt(match[1]) + offset;
  const high = parseInt(match[2]) + offset;
  return `${Math.max(18, low)}-${Math.max(25, high)}`;
}

function generateFrustrations(
  category: AppCategory,
  variant?: string
): string[] {
  const common = ["Too many steps to complete tasks", "Confusing navigation"];

  const categoryFrustrations: Record<AppCategory, string[]> = {
    "fitness-health": ["Hard to stay motivated", "Inaccurate tracking"],
    productivity: ["Feature overload", "Poor sync between devices"],
    finance: ["Security concerns", "Complex setup"],
    social: ["Privacy worries", "Too many notifications"],
    education: ["Boring content", "No progress feedback"],
    entertainment: ["Ads interrupting", "Limited free content"],
    shopping: ["Checkout friction", "Pushy notifications"],
    travel: ["Price changes", "Hidden fees"],
    "food-delivery": ["Delivery delays", "Order accuracy"],
    utilities: ["Ads in simple tools", "Unnecessary permissions"],
    lifestyle: ["Hard to build habits", "Forgetting to log"],
    "news-media": ["Paywall fatigue", "Clickbait content"],
  };

  return [...common.slice(0, 1), ...(categoryFrustrations[category] || common)];
}

function generateAlternatives(category: AppCategory): string[] {
  const alternatives: Record<AppCategory, string[]> = {
    "fitness-health": ["Apple Health", "MyFitnessPal", "Manual tracking"],
    productivity: ["Apple Notes", "Google Calendar", "Paper planners"],
    finance: ["Spreadsheets", "Bank apps", "Mint"],
    social: ["Instagram", "iMessage", "In-person"],
    education: ["YouTube", "Khan Academy", "Books"],
    entertainment: ["Netflix", "YouTube", "Social media"],
    shopping: ["Amazon", "Store apps", "Browser"],
    travel: ["Google Maps", "Booking.com", "Travel agent"],
    "food-delivery": ["Uber Eats", "DoorDash", "Phone orders"],
    utilities: ["Built-in phone tools", "Google", "Calculator"],
    lifestyle: ["Paper journal", "Spreadsheet", "Nothing specific"],
    "news-media": ["Twitter/X", "Google News", "Direct to sites"],
  };

  return alternatives[category] || ["Existing apps", "Manual methods"];
}

function generatePainPoints(
  category: AppCategory,
  variant: string
): string[] {
  const base = [
    "Current solutions are fragmented",
    "Too much manual effort required",
  ];

  if (variant === "adjacent-younger") {
    return [
      ...base,
      "Apps feel outdated or boring",
      "Limited customization options",
    ];
  }

  if (variant === "edge-case") {
    return [
      ...base,
      "Learning curve is too steep",
      "Features I don't need get in the way",
    ];
  }

  return [...base, "No single app does everything well"];
}

function generateQuote(category: AppCategory, variant: string): string {
  const quotes: Record<string, Record<string, string>> = {
    primary: {
      default: "I just want something that works without overthinking it.",
      "fitness-health": "I need an app that fits into my routine, not the other way around.",
      productivity: "I've tried dozens of apps - they all start great then I forget to use them.",
      finance: "I want to see where my money goes without becoming an accountant.",
    },
    "adjacent-younger": {
      default: "If it's not intuitive in 30 seconds, I'm moving on.",
      "fitness-health": "I want to see my progress and share it with friends.",
      productivity: "I need something that syncs everywhere and looks good.",
      finance: "I'm trying to build good habits before I have real money.",
    },
    "edge-case": {
      default: "I don't need fancy features, just reliability.",
      "fitness-health": "I've been doing this for years - I know what works for me.",
      productivity: "Simple is better. I've been burned by complex systems.",
      finance: "Security is more important than features.",
    },
  };

  const variantKey = variant === "primary" ? "primary" : variant;
  const categoryQuotes = quotes[variantKey] || quotes.primary;
  return categoryQuotes[category] || categoryQuotes.default;
}

function collectSources(research: ResearchResult[]): string[] {
  const sources = new Set<string>();

  for (const result of research) {
    if (result.source && result.source !== "search-failed") {
      sources.add(result.source);
    }
  }

  return Array.from(sources);
}
