import type { AppCategory } from "./categories";

export type ResearchPurpose =
  | "demographics"
  | "behavior"
  | "tech-usage"
  | "market-size";

export interface ResearchQuery {
  query: string;
  purpose: ResearchPurpose;
  sources: string[];
}

const PREFERRED_SOURCES = [
  "pewresearch.org",
  "statista.com",
  "emarketer.com",
  "comscore.com",
  "data.ai",
  "sensortower.com",
];

const CATEGORY_DISPLAY: Record<AppCategory, string> = {
  "fitness-health": "fitness and health",
  productivity: "productivity",
  finance: "finance and budgeting",
  social: "social networking",
  education: "education and learning",
  entertainment: "entertainment",
  shopping: "shopping and e-commerce",
  travel: "travel",
  "food-delivery": "food delivery",
  utilities: "utility",
  lifestyle: "lifestyle",
  "news-media": "news and media",
};

export function buildResearchQueries(
  category: AppCategory,
  targetUser: { demographic: string; goal: string; context: string }
): ResearchQuery[] {
  const categoryName = CATEGORY_DISPLAY[category];
  const currentYear = new Date().getFullYear();
  const queries: ResearchQuery[] = [];

  // Demographics queries
  queries.push({
    query: `${categoryName} app users demographics ${currentYear} study`,
    purpose: "demographics",
    sources: PREFERRED_SOURCES,
  });

  queries.push({
    query: `${targetUser.demographic} mobile app usage statistics ${currentYear}`,
    purpose: "demographics",
    sources: PREFERRED_SOURCES,
  });

  queries.push({
    query: `who uses ${categoryName} apps age gender income statistics`,
    purpose: "demographics",
    sources: PREFERRED_SOURCES,
  });

  // Behavior queries
  queries.push({
    query: `${categoryName} app user behavior patterns ${currentYear}`,
    purpose: "behavior",
    sources: PREFERRED_SOURCES,
  });

  queries.push({
    query: `when do people use ${categoryName} apps peak usage times`,
    purpose: "behavior",
    sources: PREFERRED_SOURCES,
  });

  queries.push({
    query: `mobile app session duration ${categoryName} average`,
    purpose: "behavior",
    sources: PREFERRED_SOURCES,
  });

  // Tech usage queries
  queries.push({
    query: `${targetUser.demographic} smartphone usage habits ${currentYear}`,
    purpose: "tech-usage",
    sources: PREFERRED_SOURCES,
  });

  queries.push({
    query: `iOS vs Android users ${categoryName} apps market share`,
    purpose: "tech-usage",
    sources: PREFERRED_SOURCES,
  });

  queries.push({
    query: `mobile payment willingness ${categoryName} apps subscription`,
    purpose: "tech-usage",
    sources: PREFERRED_SOURCES,
  });

  // Market size queries
  queries.push({
    query: `${categoryName} app market size users ${currentYear}`,
    purpose: "market-size",
    sources: PREFERRED_SOURCES,
  });

  queries.push({
    query: `${categoryName} mobile app growth statistics trends`,
    purpose: "market-size",
    sources: PREFERRED_SOURCES,
  });

  return queries;
}

export function getQueryPurposes(): ResearchPurpose[] {
  return ["demographics", "behavior", "tech-usage", "market-size"];
}

export function getPurposeDescription(purpose: ResearchPurpose): string {
  const descriptions: Record<ResearchPurpose, string> = {
    demographics: "User age, gender, income, location, and occupation data",
    behavior: "Usage patterns, session times, and engagement habits",
    "tech-usage": "Device preferences, platform choices, and tech comfort",
    "market-size": "Market statistics, growth trends, and user counts",
  };
  return descriptions[purpose];
}
