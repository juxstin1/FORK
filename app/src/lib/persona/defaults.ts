import type { Persona } from "../../types/persona";
import type { AppCategory } from "./categories";

export interface DefaultPersonaTemplate {
  category: AppCategory;
  primary: Partial<Persona>;
  secondary: Partial<Persona>[];
}

export const DEFAULT_TEMPLATES: Record<AppCategory, DefaultPersonaTemplate> = {
  "fitness-health": {
    category: "fitness-health",
    primary: {
      demographics: {
        ageRange: "25-34",
        location: "Urban US",
        occupation: "Health-conscious Professional",
        income: "$60k-80k",
      },
      techProfile: {
        devices: ["iPhone", "Apple Watch"],
        appUsageFrequency: "daily",
        techComfort: 3,
        paymentWillingness: "moderate",
        privacyConcern: "moderate",
      },
      behavior: {
        peakUsageTimes: ["morning", "evening"],
        sessionDuration: "5-10 minutes",
        primaryMotivation: "Track progress and stay accountable",
        frustrations: ["Hard to stay motivated", "Inaccurate tracking"],
        alternatives: ["Apple Health", "MyFitnessPal"],
      },
    },
    secondary: [
      {
        demographics: {
          ageRange: "18-24",
          location: "Urban/Suburban US",
          occupation: "Student",
          income: "$20k-40k",
        },
        techProfile: {
          devices: ["iPhone", "MacBook"],
          appUsageFrequency: "daily",
          techComfort: 4,
          paymentWillingness: "free-only",
          privacyConcern: "low",
        },
      },
      {
        demographics: {
          ageRange: "45-54",
          location: "Suburban US",
          occupation: "Parent/Professional",
          income: "$80k-120k",
        },
        techProfile: {
          devices: ["iPhone", "iPad"],
          appUsageFrequency: "weekly",
          techComfort: 2,
          paymentWillingness: "moderate",
          privacyConcern: "high",
        },
      },
    ],
  },

  productivity: {
    category: "productivity",
    primary: {
      demographics: {
        ageRange: "28-40",
        location: "Urban US",
        occupation: "Knowledge Worker",
        income: "$70k-100k",
      },
      techProfile: {
        devices: ["iPhone", "MacBook", "iPad"],
        appUsageFrequency: "daily",
        techComfort: 4,
        paymentWillingness: "moderate",
        privacyConcern: "moderate",
      },
      behavior: {
        peakUsageTimes: ["morning", "afternoon"],
        sessionDuration: "10-20 minutes",
        primaryMotivation: "Stay organized and focused",
        frustrations: ["Feature overload", "Poor sync"],
        alternatives: ["Apple Notes", "Google Calendar"],
      },
    },
    secondary: [
      {
        demographics: {
          ageRange: "18-24",
          location: "Urban US",
          occupation: "Student",
          income: "$15k-30k",
        },
        techProfile: {
          devices: ["iPhone", "MacBook"],
          appUsageFrequency: "daily",
          techComfort: 5,
          paymentWillingness: "free-only",
          privacyConcern: "low",
        },
      },
      {
        demographics: {
          ageRange: "35-50",
          location: "Suburban US",
          occupation: "Small Business Owner",
          income: "$80k-150k",
        },
        techProfile: {
          devices: ["iPhone", "Windows laptop"],
          appUsageFrequency: "daily",
          techComfort: 3,
          paymentWillingness: "high",
          privacyConcern: "high",
        },
      },
    ],
  },

  finance: {
    category: "finance",
    primary: {
      demographics: {
        ageRange: "25-40",
        location: "Urban US",
        occupation: "Professional",
        income: "$60k-100k",
      },
      techProfile: {
        devices: ["iPhone", "Laptop"],
        appUsageFrequency: "weekly",
        techComfort: 3,
        paymentWillingness: "low",
        privacyConcern: "high",
      },
      behavior: {
        peakUsageTimes: ["evening", "weekend"],
        sessionDuration: "5-15 minutes",
        primaryMotivation: "Track spending and save money",
        frustrations: ["Security concerns", "Complex setup"],
        alternatives: ["Spreadsheets", "Bank apps"],
      },
    },
    secondary: [
      {
        demographics: {
          ageRange: "18-24",
          location: "Urban US",
          occupation: "New Earner",
          income: "$30k-50k",
        },
        techProfile: {
          devices: ["iPhone"],
          appUsageFrequency: "weekly",
          techComfort: 4,
          paymentWillingness: "free-only",
          privacyConcern: "moderate",
        },
      },
      {
        demographics: {
          ageRange: "45-60",
          location: "Suburban US",
          occupation: "Retirement Planner",
          income: "$100k-150k",
        },
        techProfile: {
          devices: ["iPhone", "iPad"],
          appUsageFrequency: "weekly",
          techComfort: 2,
          paymentWillingness: "moderate",
          privacyConcern: "high",
        },
      },
    ],
  },

  social: {
    category: "social",
    primary: {
      demographics: {
        ageRange: "18-30",
        location: "Urban US",
        occupation: "Various",
        income: "$40k-70k",
      },
      techProfile: {
        devices: ["iPhone"],
        appUsageFrequency: "daily",
        techComfort: 4,
        paymentWillingness: "free-only",
        privacyConcern: "moderate",
      },
      behavior: {
        peakUsageTimes: ["evening", "night"],
        sessionDuration: "15-30 minutes",
        primaryMotivation: "Connect with friends and community",
        frustrations: ["Privacy worries", "Too many notifications"],
        alternatives: ["Instagram", "iMessage"],
      },
    },
    secondary: [
      {
        demographics: {
          ageRange: "14-18",
          location: "Suburban US",
          occupation: "Student",
          income: "N/A",
        },
        techProfile: {
          devices: ["iPhone"],
          appUsageFrequency: "daily",
          techComfort: 5,
          paymentWillingness: "free-only",
          privacyConcern: "low",
        },
      },
      {
        demographics: {
          ageRange: "30-45",
          location: "Suburban US",
          occupation: "Professional/Parent",
          income: "$70k-100k",
        },
        techProfile: {
          devices: ["iPhone", "iPad"],
          appUsageFrequency: "weekly",
          techComfort: 3,
          paymentWillingness: "low",
          privacyConcern: "high",
        },
      },
    ],
  },

  education: {
    category: "education",
    primary: {
      demographics: {
        ageRange: "18-30",
        location: "Urban/Suburban US",
        occupation: "Student/Learner",
        income: "$25k-50k",
      },
      techProfile: {
        devices: ["iPhone", "Laptop"],
        appUsageFrequency: "daily",
        techComfort: 4,
        paymentWillingness: "low",
        privacyConcern: "low",
      },
      behavior: {
        peakUsageTimes: ["evening", "night"],
        sessionDuration: "15-30 minutes",
        primaryMotivation: "Learn new skills efficiently",
        frustrations: ["Boring content", "No progress feedback"],
        alternatives: ["YouTube", "Khan Academy"],
      },
    },
    secondary: [
      {
        demographics: {
          ageRange: "12-17",
          location: "Suburban US",
          occupation: "K-12 Student",
          income: "N/A",
        },
        techProfile: {
          devices: ["iPad", "Chromebook"],
          appUsageFrequency: "daily",
          techComfort: 4,
          paymentWillingness: "free-only",
          privacyConcern: "low",
        },
      },
      {
        demographics: {
          ageRange: "30-50",
          location: "Urban US",
          occupation: "Professional Upskilling",
          income: "$70k-120k",
        },
        techProfile: {
          devices: ["iPhone", "MacBook"],
          appUsageFrequency: "weekly",
          techComfort: 3,
          paymentWillingness: "moderate",
          privacyConcern: "moderate",
        },
      },
    ],
  },

  entertainment: {
    category: "entertainment",
    primary: {
      demographics: {
        ageRange: "18-35",
        location: "Urban US",
        occupation: "Various",
        income: "$40k-70k",
      },
      techProfile: {
        devices: ["iPhone", "Smart TV"],
        appUsageFrequency: "daily",
        techComfort: 4,
        paymentWillingness: "low",
        privacyConcern: "low",
      },
      behavior: {
        peakUsageTimes: ["evening", "night", "weekend"],
        sessionDuration: "30-60 minutes",
        primaryMotivation: "Relax and be entertained",
        frustrations: ["Ads interrupting", "Limited free content"],
        alternatives: ["Netflix", "YouTube"],
      },
    },
    secondary: [
      {
        demographics: {
          ageRange: "10-17",
          location: "Suburban US",
          occupation: "Student",
          income: "N/A",
        },
        techProfile: {
          devices: ["iPhone", "iPad", "Gaming console"],
          appUsageFrequency: "daily",
          techComfort: 5,
          paymentWillingness: "free-only",
          privacyConcern: "low",
        },
      },
      {
        demographics: {
          ageRange: "35-55",
          location: "Suburban US",
          occupation: "Parent",
          income: "$60k-100k",
        },
        techProfile: {
          devices: ["iPhone", "iPad"],
          appUsageFrequency: "weekly",
          techComfort: 2,
          paymentWillingness: "moderate",
          privacyConcern: "moderate",
        },
      },
    ],
  },

  shopping: {
    category: "shopping",
    primary: {
      demographics: {
        ageRange: "25-45",
        location: "Urban/Suburban US",
        occupation: "Professional",
        income: "$50k-100k",
      },
      techProfile: {
        devices: ["iPhone", "Laptop"],
        appUsageFrequency: "weekly",
        techComfort: 3,
        paymentWillingness: "moderate",
        privacyConcern: "moderate",
      },
      behavior: {
        peakUsageTimes: ["evening", "weekend"],
        sessionDuration: "10-20 minutes",
        primaryMotivation: "Find deals and convenience",
        frustrations: ["Checkout friction", "Pushy notifications"],
        alternatives: ["Amazon", "Browser"],
      },
    },
    secondary: [
      {
        demographics: {
          ageRange: "18-24",
          location: "Urban US",
          occupation: "Student/Early Career",
          income: "$25k-45k",
        },
        techProfile: {
          devices: ["iPhone"],
          appUsageFrequency: "weekly",
          techComfort: 4,
          paymentWillingness: "low",
          privacyConcern: "low",
        },
      },
      {
        demographics: {
          ageRange: "45-65",
          location: "Suburban US",
          occupation: "Established Professional",
          income: "$80k-150k",
        },
        techProfile: {
          devices: ["iPhone", "Desktop"],
          appUsageFrequency: "weekly",
          techComfort: 2,
          paymentWillingness: "high",
          privacyConcern: "high",
        },
      },
    ],
  },

  travel: {
    category: "travel",
    primary: {
      demographics: {
        ageRange: "28-45",
        location: "Urban US",
        occupation: "Professional",
        income: "$70k-120k",
      },
      techProfile: {
        devices: ["iPhone", "Laptop"],
        appUsageFrequency: "monthly",
        techComfort: 3,
        paymentWillingness: "moderate",
        privacyConcern: "moderate",
      },
      behavior: {
        peakUsageTimes: ["evening", "weekend"],
        sessionDuration: "20-40 minutes",
        primaryMotivation: "Plan trips efficiently and find deals",
        frustrations: ["Price changes", "Hidden fees"],
        alternatives: ["Google Maps", "Booking.com"],
      },
    },
    secondary: [
      {
        demographics: {
          ageRange: "22-30",
          location: "Urban US",
          occupation: "Young Professional",
          income: "$45k-70k",
        },
        techProfile: {
          devices: ["iPhone"],
          appUsageFrequency: "monthly",
          techComfort: 4,
          paymentWillingness: "low",
          privacyConcern: "low",
        },
      },
      {
        demographics: {
          ageRange: "50-65",
          location: "Suburban US",
          occupation: "Empty Nester",
          income: "$100k-200k",
        },
        techProfile: {
          devices: ["iPhone", "iPad"],
          appUsageFrequency: "monthly",
          techComfort: 2,
          paymentWillingness: "high",
          privacyConcern: "moderate",
        },
      },
    ],
  },

  "food-delivery": {
    category: "food-delivery",
    primary: {
      demographics: {
        ageRange: "22-38",
        location: "Urban US",
        occupation: "Professional",
        income: "$50k-90k",
      },
      techProfile: {
        devices: ["iPhone"],
        appUsageFrequency: "weekly",
        techComfort: 4,
        paymentWillingness: "moderate",
        privacyConcern: "moderate",
      },
      behavior: {
        peakUsageTimes: ["evening", "weekend"],
        sessionDuration: "5-10 minutes",
        primaryMotivation: "Convenience and variety",
        frustrations: ["Delivery delays", "Order accuracy"],
        alternatives: ["Uber Eats", "DoorDash"],
      },
    },
    secondary: [
      {
        demographics: {
          ageRange: "18-24",
          location: "Urban US",
          occupation: "Student",
          income: "$15k-35k",
        },
        techProfile: {
          devices: ["iPhone"],
          appUsageFrequency: "weekly",
          techComfort: 5,
          paymentWillingness: "free-only",
          privacyConcern: "low",
        },
      },
      {
        demographics: {
          ageRange: "35-50",
          location: "Suburban US",
          occupation: "Busy Parent",
          income: "$80k-130k",
        },
        techProfile: {
          devices: ["iPhone", "iPad"],
          appUsageFrequency: "weekly",
          techComfort: 3,
          paymentWillingness: "moderate",
          privacyConcern: "moderate",
        },
      },
    ],
  },

  utilities: {
    category: "utilities",
    primary: {
      demographics: {
        ageRange: "25-50",
        location: "Urban/Suburban US",
        occupation: "Various",
        income: "$45k-90k",
      },
      techProfile: {
        devices: ["iPhone"],
        appUsageFrequency: "weekly",
        techComfort: 3,
        paymentWillingness: "free-only",
        privacyConcern: "moderate",
      },
      behavior: {
        peakUsageTimes: ["any"],
        sessionDuration: "1-3 minutes",
        primaryMotivation: "Quick task completion",
        frustrations: ["Ads in simple tools", "Unnecessary permissions"],
        alternatives: ["Built-in phone tools", "Google"],
      },
    },
    secondary: [
      {
        demographics: {
          ageRange: "18-25",
          location: "Urban US",
          occupation: "Student/Early Career",
          income: "$20k-45k",
        },
        techProfile: {
          devices: ["iPhone"],
          appUsageFrequency: "daily",
          techComfort: 5,
          paymentWillingness: "free-only",
          privacyConcern: "low",
        },
      },
      {
        demographics: {
          ageRange: "50-70",
          location: "Suburban US",
          occupation: "Established/Retired",
          income: "$50k-100k",
        },
        techProfile: {
          devices: ["iPhone"],
          appUsageFrequency: "weekly",
          techComfort: 2,
          paymentWillingness: "low",
          privacyConcern: "high",
        },
      },
    ],
  },

  lifestyle: {
    category: "lifestyle",
    primary: {
      demographics: {
        ageRange: "25-40",
        location: "Urban US",
        occupation: "Professional",
        income: "$50k-85k",
      },
      techProfile: {
        devices: ["iPhone"],
        appUsageFrequency: "daily",
        techComfort: 3,
        paymentWillingness: "low",
        privacyConcern: "moderate",
      },
      behavior: {
        peakUsageTimes: ["morning", "evening"],
        sessionDuration: "3-10 minutes",
        primaryMotivation: "Build better habits and self-improvement",
        frustrations: ["Hard to build habits", "Forgetting to log"],
        alternatives: ["Paper journal", "Spreadsheet"],
      },
    },
    secondary: [
      {
        demographics: {
          ageRange: "18-25",
          location: "Urban US",
          occupation: "Student/Early Career",
          income: "$25k-50k",
        },
        techProfile: {
          devices: ["iPhone", "Apple Watch"],
          appUsageFrequency: "daily",
          techComfort: 4,
          paymentWillingness: "free-only",
          privacyConcern: "low",
        },
      },
      {
        demographics: {
          ageRange: "40-55",
          location: "Suburban US",
          occupation: "Professional",
          income: "$75k-120k",
        },
        techProfile: {
          devices: ["iPhone"],
          appUsageFrequency: "weekly",
          techComfort: 2,
          paymentWillingness: "moderate",
          privacyConcern: "moderate",
        },
      },
    ],
  },

  "news-media": {
    category: "news-media",
    primary: {
      demographics: {
        ageRange: "30-55",
        location: "Urban US",
        occupation: "Professional",
        income: "$60k-110k",
      },
      techProfile: {
        devices: ["iPhone", "iPad"],
        appUsageFrequency: "daily",
        techComfort: 3,
        paymentWillingness: "low",
        privacyConcern: "moderate",
      },
      behavior: {
        peakUsageTimes: ["morning", "lunch", "evening"],
        sessionDuration: "10-20 minutes",
        primaryMotivation: "Stay informed efficiently",
        frustrations: ["Paywall fatigue", "Clickbait content"],
        alternatives: ["Twitter/X", "Google News"],
      },
    },
    secondary: [
      {
        demographics: {
          ageRange: "18-30",
          location: "Urban US",
          occupation: "Student/Young Professional",
          income: "$30k-60k",
        },
        techProfile: {
          devices: ["iPhone"],
          appUsageFrequency: "daily",
          techComfort: 4,
          paymentWillingness: "free-only",
          privacyConcern: "low",
        },
      },
      {
        demographics: {
          ageRange: "55-70",
          location: "Suburban US",
          occupation: "Established/Retired",
          income: "$70k-150k",
        },
        techProfile: {
          devices: ["iPad", "Desktop"],
          appUsageFrequency: "daily",
          techComfort: 2,
          paymentWillingness: "moderate",
          privacyConcern: "high",
        },
      },
    ],
  },
};

export function getDefaultTemplate(category: AppCategory): DefaultPersonaTemplate {
  return DEFAULT_TEMPLATES[category];
}

export function mergeWithDefaults(
  research: Partial<Persona>,
  defaults: Partial<Persona>
): Persona {
  // Research data takes precedence over defaults
  const merged: Persona = {
    id: research.id || defaults.id || "persona-1",
    name: research.name || defaults.name || "User Persona",
    type: research.type || defaults.type || "primary",
    oneLiner: research.oneLiner || defaults.oneLiner || "Target user",
    demographics: {
      ageRange: research.demographics?.ageRange || defaults.demographics?.ageRange || "25-34",
      location: research.demographics?.location || defaults.demographics?.location || "US",
      occupation: research.demographics?.occupation || defaults.demographics?.occupation || "Professional",
      income: research.demographics?.income || defaults.demographics?.income,
      primaryGender: research.demographics?.primaryGender || defaults.demographics?.primaryGender,
      education: research.demographics?.education || defaults.demographics?.education,
    },
    techProfile: {
      devices: research.techProfile?.devices || defaults.techProfile?.devices || ["iPhone"],
      appUsageFrequency: research.techProfile?.appUsageFrequency || defaults.techProfile?.appUsageFrequency || "weekly",
      techComfort: research.techProfile?.techComfort || defaults.techProfile?.techComfort || 3,
      paymentWillingness: research.techProfile?.paymentWillingness || defaults.techProfile?.paymentWillingness || "low",
      privacyConcern: research.techProfile?.privacyConcern || defaults.techProfile?.privacyConcern || "moderate",
    },
    behavior: {
      peakUsageTimes: research.behavior?.peakUsageTimes || defaults.behavior?.peakUsageTimes || ["evening"],
      sessionDuration: research.behavior?.sessionDuration || defaults.behavior?.sessionDuration || "5-10 minutes",
      primaryMotivation: research.behavior?.primaryMotivation || defaults.behavior?.primaryMotivation || "Get things done",
      frustrations: research.behavior?.frustrations || defaults.behavior?.frustrations || ["Complexity"],
      alternatives: research.behavior?.alternatives || defaults.behavior?.alternatives || ["Other apps"],
    },
    goals: research.goals || defaults.goals || ["Accomplish task efficiently"],
    painPoints: research.painPoints || defaults.painPoints || ["Current solutions are lacking"],
    quote: research.quote || defaults.quote || "I want something that just works.",
    dataSource: research.dataSource || defaults.dataSource || "Category defaults",
  };

  return merged;
}
