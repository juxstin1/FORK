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
  confidence: number;
  keywords: string[];
}

const CATEGORY_KEYWORDS: Record<AppCategory, string[]> = {
  "fitness-health": [
    "workout",
    "exercise",
    "health",
    "calories",
    "steps",
    "meditation",
    "sleep",
    "fitness",
    "gym",
    "running",
    "yoga",
    "weight",
    "nutrition",
    "diet",
    "wellness",
  ],
  productivity: [
    "task",
    "todo",
    "calendar",
    "notes",
    "time",
    "organize",
    "schedule",
    "reminder",
    "project",
    "deadline",
    "meeting",
    "agenda",
    "focus",
    "pomodoro",
  ],
  finance: [
    "budget",
    "expense",
    "money",
    "invest",
    "savings",
    "payment",
    "bank",
    "finance",
    "spending",
    "income",
    "debt",
    "crypto",
    "stocks",
    "bills",
  ],
  social: [
    "friends",
    "chat",
    "share",
    "community",
    "connect",
    "message",
    "social",
    "network",
    "follow",
    "post",
    "profile",
    "group",
    "dating",
  ],
  education: [
    "learn",
    "course",
    "quiz",
    "study",
    "language",
    "skill",
    "education",
    "lesson",
    "tutorial",
    "class",
    "teacher",
    "student",
    "flashcard",
  ],
  entertainment: [
    "game",
    "music",
    "video",
    "stream",
    "watch",
    "play",
    "entertainment",
    "movie",
    "podcast",
    "fun",
    "trivia",
    "puzzle",
  ],
  shopping: [
    "buy",
    "product",
    "cart",
    "order",
    "price",
    "deal",
    "shop",
    "store",
    "discount",
    "sale",
    "marketplace",
    "wishlist",
  ],
  travel: [
    "trip",
    "hotel",
    "flight",
    "booking",
    "destination",
    "map",
    "travel",
    "vacation",
    "itinerary",
    "tour",
    "explore",
    "adventure",
  ],
  "food-delivery": [
    "food",
    "restaurant",
    "delivery",
    "menu",
    "recipe",
    "meal",
    "cooking",
    "dining",
    "takeout",
    "cuisine",
    "ingredients",
  ],
  utilities: [
    "convert",
    "calculate",
    "scan",
    "translate",
    "weather",
    "utility",
    "tool",
    "qr",
    "compass",
    "flashlight",
    "timer",
    "unit",
  ],
  lifestyle: [
    "habit",
    "journal",
    "mood",
    "personal",
    "daily",
    "lifestyle",
    "routine",
    "tracker",
    "gratitude",
    "mindful",
    "self-care",
    "reflection",
  ],
  "news-media": [
    "news",
    "article",
    "feed",
    "read",
    "subscribe",
    "media",
    "headline",
    "magazine",
    "blog",
    "publish",
    "trending",
  ],
};

export function classifyApp(
  problem: string,
  features: { name: string; description: string }[]
): CategoryMatch {
  const textToAnalyze = [
    problem.toLowerCase(),
    ...features.map((f) => f.name.toLowerCase()),
    ...features.map((f) => f.description.toLowerCase()),
  ].join(" ");

  const scores: { category: AppCategory; score: number; keywords: string[] }[] =
    [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matchedKeywords: string[] = [];

    for (const keyword of keywords) {
      if (textToAnalyze.includes(keyword)) {
        matchedKeywords.push(keyword);
      }
    }

    const score = matchedKeywords.length / keywords.length;
    scores.push({
      category: category as AppCategory,
      score,
      keywords: matchedKeywords,
    });
  }

  scores.sort((a, b) => b.score - a.score);

  const best = scores[0];
  const secondBest = scores[1];

  // Confidence is higher when there's clear separation between top matches
  let confidence = best.score;
  if (secondBest && secondBest.score > 0) {
    const separation = best.score - secondBest.score;
    confidence = Math.min(1, best.score + separation * 0.5);
  }

  // If no keywords matched, default to lifestyle with low confidence
  if (best.keywords.length === 0) {
    return {
      category: "lifestyle",
      confidence: 0.1,
      keywords: [],
    };
  }

  return {
    category: best.category,
    confidence: Math.min(1, confidence),
    keywords: best.keywords,
  };
}

export function getAllCategories(): AppCategory[] {
  return Object.keys(CATEGORY_KEYWORDS) as AppCategory[];
}

export function getCategoryDisplayName(category: AppCategory): string {
  const displayNames: Record<AppCategory, string> = {
    "fitness-health": "Fitness & Health",
    productivity: "Productivity",
    finance: "Finance",
    social: "Social",
    education: "Education",
    entertainment: "Entertainment",
    shopping: "Shopping",
    travel: "Travel",
    "food-delivery": "Food & Delivery",
    utilities: "Utilities",
    lifestyle: "Lifestyle",
    "news-media": "News & Media",
  };
  return displayNames[category];
}
