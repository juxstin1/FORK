import type { ResearchQuery, ResearchPurpose } from "./research";

export type DataPointType =
  | "age"
  | "gender"
  | "income"
  | "usage"
  | "behavior"
  | "other";

export interface DataPoint {
  type: DataPointType;
  value: string;
  context: string;
  source: string;
}

export interface ResearchResult {
  query: string;
  purpose: ResearchPurpose;
  findings: string[];
  source: string;
  confidence: "high" | "medium" | "low";
  dataPoints: DataPoint[];
}

export interface ResearchExecutor {
  search: (query: string) => Promise<string>;
}

export async function executeResearch(
  queries: ResearchQuery[],
  executor: ResearchExecutor
): Promise<ResearchResult[]> {
  const results: ResearchResult[] = [];

  for (const query of queries) {
    try {
      const searchResults = await executor.search(query.query);
      const dataPoints = extractDataPoints(searchResults, query.purpose);

      results.push({
        query: query.query,
        purpose: query.purpose,
        findings: extractFindings(searchResults),
        source: extractSource(searchResults),
        confidence: determineConfidence(dataPoints.length),
        dataPoints,
      });
    } catch {
      // Search failed, add empty result with low confidence
      results.push({
        query: query.query,
        purpose: query.purpose,
        findings: [],
        source: "search-failed",
        confidence: "low",
        dataPoints: [],
      });
    }
  }

  return deduplicateResults(results);
}

export function extractDataPoints(
  searchResults: string,
  purpose: ResearchPurpose
): DataPoint[] {
  const dataPoints: DataPoint[] = [];
  const text = searchResults.toLowerCase();

  // Age patterns
  const agePatterns = [
    /(\d{1,2}[-–]\d{1,2})\s*(?:year|age|years old)/gi,
    /age(?:d|s)?\s*(\d{1,2}[-–]\d{1,2})/gi,
    /(\d{1,2})\s*to\s*(\d{1,2})\s*(?:year|age)/gi,
  ];

  for (const pattern of agePatterns) {
    const matches = searchResults.matchAll(pattern);
    for (const match of matches) {
      dataPoints.push({
        type: "age",
        value: match[1] || `${match[1]}-${match[2]}`,
        context: extractContext(searchResults, match.index || 0),
        source: "search-result",
      });
    }
  }

  // Percentage patterns for demographics
  const percentPatterns = [
    /(\d{1,3}(?:\.\d+)?%)\s*(?:of|are|were)\s+([^.]+)/gi,
    /([a-z]+)\s+(?:users?|people)\s*:\s*(\d{1,3}(?:\.\d+)?%)/gi,
  ];

  for (const pattern of percentPatterns) {
    const matches = searchResults.matchAll(pattern);
    for (const match of matches) {
      const type = inferDataPointType(match[0], purpose);
      dataPoints.push({
        type,
        value: match[1] || match[2],
        context: extractContext(searchResults, match.index || 0),
        source: "search-result",
      });
    }
  }

  // Income patterns
  if (text.includes("income") || text.includes("salary") || text.includes("$")) {
    const incomePatterns = [
      /\$(\d{1,3}(?:,\d{3})*(?:k)?)\s*[-–]\s*\$?(\d{1,3}(?:,\d{3})*(?:k)?)/gi,
      /income\s*(?:of|around|about)?\s*\$?(\d{1,3}(?:,\d{3})*(?:k)?)/gi,
    ];

    for (const pattern of incomePatterns) {
      const matches = searchResults.matchAll(pattern);
      for (const match of matches) {
        dataPoints.push({
          type: "income",
          value: match[0],
          context: extractContext(searchResults, match.index || 0),
          source: "search-result",
        });
      }
    }
  }

  // Usage patterns
  if (purpose === "behavior" || purpose === "tech-usage") {
    const usagePatterns = [
      /(\d+(?:\.\d+)?)\s*(?:minutes?|hours?|times?)\s*(?:per|a)\s*(?:day|week|month)/gi,
      /(?:daily|weekly|monthly)\s+(?:usage|sessions?)\s*(?:of)?\s*(\d+(?:\.\d+)?)/gi,
    ];

    for (const pattern of usagePatterns) {
      const matches = searchResults.matchAll(pattern);
      for (const match of matches) {
        dataPoints.push({
          type: "usage",
          value: match[0],
          context: extractContext(searchResults, match.index || 0),
          source: "search-result",
        });
      }
    }
  }

  return dataPoints.slice(0, 10); // Limit to 10 data points per query
}

function extractFindings(searchResults: string): string[] {
  // Split into sentences and filter for relevant ones
  const sentences = searchResults
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 200);

  // Look for sentences with statistics or demographics
  const relevantSentences = sentences.filter((s) => {
    const lower = s.toLowerCase();
    return (
      /\d+%/.test(s) ||
      lower.includes("users") ||
      lower.includes("average") ||
      lower.includes("most") ||
      lower.includes("majority")
    );
  });

  return relevantSentences.slice(0, 5);
}

function extractSource(searchResults: string): string {
  // Try to extract domain from results
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?([a-z0-9-]+\.[a-z]{2,})/i;
  const match = searchResults.match(urlPattern);
  return match ? match[1] : "web-search";
}

function extractContext(text: string, index: number): string {
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + 100);
  return text.slice(start, end).trim();
}

function inferDataPointType(
  text: string,
  purpose: ResearchPurpose
): DataPointType {
  const lower = text.toLowerCase();

  if (lower.includes("age") || /\d{2}[-–]\d{2}/.test(text)) return "age";
  if (
    lower.includes("male") ||
    lower.includes("female") ||
    lower.includes("gender")
  )
    return "gender";
  if (lower.includes("income") || lower.includes("salary") || lower.includes("$"))
    return "income";
  if (
    lower.includes("usage") ||
    lower.includes("session") ||
    lower.includes("time")
  )
    return "usage";
  if (purpose === "behavior") return "behavior";

  return "other";
}

function determineConfidence(
  dataPointCount: number
): "high" | "medium" | "low" {
  if (dataPointCount >= 3) return "high";
  if (dataPointCount >= 1) return "medium";
  return "low";
}

function deduplicateResults(results: ResearchResult[]): ResearchResult[] {
  // Group by purpose and deduplicate data points
  const byPurpose = new Map<ResearchPurpose, ResearchResult[]>();

  for (const result of results) {
    const existing = byPurpose.get(result.purpose) || [];
    existing.push(result);
    byPurpose.set(result.purpose, existing);
  }

  // For each purpose, merge data points and remove duplicates
  const deduplicated: ResearchResult[] = [];

  for (const [purpose, purposeResults] of byPurpose) {
    const seenValues = new Set<string>();
    const mergedDataPoints: DataPoint[] = [];

    for (const result of purposeResults) {
      for (const dp of result.dataPoints) {
        if (!seenValues.has(dp.value)) {
          seenValues.add(dp.value);
          mergedDataPoints.push(dp);
        }
      }
      deduplicated.push(result);
    }
  }

  return deduplicated;
}

export function aggregateByPurpose(
  results: ResearchResult[]
): Map<ResearchPurpose, DataPoint[]> {
  const aggregated = new Map<ResearchPurpose, DataPoint[]>();

  for (const result of results) {
    const existing = aggregated.get(result.purpose) || [];
    existing.push(...result.dataPoints);
    aggregated.set(result.purpose, existing);
  }

  return aggregated;
}
