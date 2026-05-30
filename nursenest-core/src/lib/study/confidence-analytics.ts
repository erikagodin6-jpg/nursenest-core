export type ConfidenceBand = "low" | "medium" | "high";

export type ConfidenceAnalyticsEvent = {
  id: string;
  isCorrect: boolean;
  confidence: ConfidenceBand | number | string | null;
  topic: string | null;
  occurredAt: Date;
  source: "questions" | "flashcards" | "cat" | "other";
};

export type ConfidenceQuadrants = {
  correctHighConfidence: number;
  correctLowConfidence: number;
  incorrectHighConfidence: number;
  incorrectLowConfidence: number;
  mediumConfidence: number;
  totalRated: number;
};

export type ConfidenceTopicBreakdown = {
  topic: string;
  totalRated: number;
  overconfidentMisses: number;
  underconfidentCorrect: number;
  confidenceAccuracyPct: number;
  recommendation: string;
};

export type ConfidenceWeeklyTrendPoint = {
  weekLabel: string;
  totalRated: number;
  overconfidenceScore: number;
  underconfidenceScore: number;
  confidenceAccuracy: number;
};

export type ConfidenceAnalyticsRecommendation = {
  kind: "remediation" | "exam_ready";
  title: string;
  body: string;
  href: string;
};

export type ConfidenceAnalyticsReport = {
  quadrants: ConfidenceQuadrants;
  overconfidenceScore: number;
  underconfidenceScore: number;
  confidenceAccuracy: number;
  highRiskKnowledgeGaps: ConfidenceTopicBreakdown[];
  topicBreakdowns: ConfidenceTopicBreakdown[];
  weeklyTrend: ConfidenceWeeklyTrendPoint[];
  recommendations: ConfidenceAnalyticsRecommendation[];
};

export function normalizeConfidenceBand(confidence: ConfidenceAnalyticsEvent["confidence"]): ConfidenceBand | null {
  if (confidence == null) return null;
  if (typeof confidence === "number" && Number.isFinite(confidence)) {
    if (confidence >= 4) return "high";
    if (confidence <= 2) return "low";
    return "medium";
  }
  const raw = String(confidence).trim().toLowerCase().replace(/[_\s-]+/g, "-");
  if (["high", "confident", "very-confident", "veryconfident", "very_confident", "5", "4"].includes(raw)) return "high";
  if (["low", "unsure", "not-sure", "guessing", "1", "2"].includes(raw)) return "low";
  if (["medium", "neutral", "probably", "somewhat-confident", "somewhat_confident", "3"].includes(raw)) {
    return "medium";
  }
  return null;
}

function pct(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}

function weekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 1 - day);
  return d.toISOString().slice(0, 10);
}

function formatTopic(raw: string | null): string {
  const topic = raw?.trim();
  return topic && topic.length > 0 ? topic : "Uncategorized";
}

function topicRecommendation(row: Omit<ConfidenceTopicBreakdown, "recommendation">): string {
  if (row.overconfidentMisses >= 2) {
    return "Prioritize remediation before exam-level practice; confidence is outpacing accuracy.";
  }
  if (row.underconfidentCorrect >= 3 && row.confidenceAccuracyPct >= 65) {
    return "Reinforce with flashcards, then move into timed exam-level practice.";
  }
  if (row.confidenceAccuracyPct >= 80 && row.totalRated >= 5) {
    return "Ready for exam-level practice with periodic review.";
  }
  return "Continue mixed practice until confidence and correctness align.";
}

function buildTopicRows(events: Array<ConfidenceAnalyticsEvent & { band: ConfidenceBand }>): ConfidenceTopicBreakdown[] {
  const byTopic = new Map<
    string,
    {
      totalRated: number;
      correctHigh: number;
      correctLow: number;
      incorrectHigh: number;
      incorrectLow: number;
    }
  >();

  for (const event of events) {
    const topic = formatTopic(event.topic);
    const row = byTopic.get(topic) ?? {
      totalRated: 0,
      correctHigh: 0,
      correctLow: 0,
      incorrectHigh: 0,
      incorrectLow: 0,
    };
    row.totalRated++;
    if (event.band === "high" && event.isCorrect) row.correctHigh++;
    if (event.band === "low" && event.isCorrect) row.correctLow++;
    if (event.band === "high" && !event.isCorrect) row.incorrectHigh++;
    if (event.band === "low" && !event.isCorrect) row.incorrectLow++;
    byTopic.set(topic, row);
  }

  return [...byTopic.entries()]
    .map(([topic, row]) => {
      const highLowTotal = row.correctHigh + row.correctLow + row.incorrectHigh + row.incorrectLow;
      const confidenceAccuracyPct = pct(row.correctHigh + row.incorrectLow, highLowTotal);
      const base = {
        topic,
        totalRated: row.totalRated,
        overconfidentMisses: row.incorrectHigh,
        underconfidentCorrect: row.correctLow,
        confidenceAccuracyPct,
      };
      return { ...base, recommendation: topicRecommendation(base) };
    })
    .sort((a, b) => {
      const riskDelta = b.overconfidentMisses - a.overconfidentMisses;
      if (riskDelta !== 0) return riskDelta;
      return b.totalRated - a.totalRated;
    });
}

function buildWeeklyTrend(events: Array<ConfidenceAnalyticsEvent & { band: ConfidenceBand }>): ConfidenceWeeklyTrendPoint[] {
  const byWeek = new Map<string, ConfidenceQuadrants>();
  for (const event of events) {
    const key = weekKey(event.occurredAt);
    const row =
      byWeek.get(key) ??
      ({
        correctHighConfidence: 0,
        correctLowConfidence: 0,
        incorrectHighConfidence: 0,
        incorrectLowConfidence: 0,
        mediumConfidence: 0,
        totalRated: 0,
      } satisfies ConfidenceQuadrants);
    row.totalRated++;
    if (event.band === "medium") row.mediumConfidence++;
    if (event.band === "high" && event.isCorrect) row.correctHighConfidence++;
    if (event.band === "low" && event.isCorrect) row.correctLowConfidence++;
    if (event.band === "high" && !event.isCorrect) row.incorrectHighConfidence++;
    if (event.band === "low" && !event.isCorrect) row.incorrectLowConfidence++;
    byWeek.set(key, row);
  }

  return [...byWeek.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([weekLabel, q]) => {
      const highTotal = q.correctHighConfidence + q.incorrectHighConfidence;
      const lowTotal = q.correctLowConfidence + q.incorrectLowConfidence;
      const highLowTotal = highTotal + lowTotal;
      return {
        weekLabel,
        totalRated: q.totalRated,
        overconfidenceScore: pct(q.incorrectHighConfidence, highTotal),
        underconfidenceScore: pct(q.correctLowConfidence, lowTotal),
        confidenceAccuracy: pct(q.correctHighConfidence + q.incorrectLowConfidence, highLowTotal),
      };
    });
}

function buildRecommendations(args: {
  overconfidenceScore: number;
  underconfidenceScore: number;
  confidenceAccuracy: number;
  highRiskKnowledgeGaps: ConfidenceTopicBreakdown[];
  topicBreakdowns: ConfidenceTopicBreakdown[];
}): ConfidenceAnalyticsRecommendation[] {
  const recommendations: ConfidenceAnalyticsRecommendation[] = [];
  const topRisk = args.highRiskKnowledgeGaps[0];
  if (topRisk) {
    recommendations.push({
      kind: "remediation",
      title: `Remediate ${topRisk.topic}`,
      body: `${topRisk.overconfidentMisses} high-confidence miss${topRisk.overconfidentMisses === 1 ? "" : "es"} detected. Review the lesson, then repeat targeted questions.`,
      href: `/app/questions?topic=${encodeURIComponent(topRisk.topic)}`,
    });
  }
  if (args.underconfidenceScore >= 30) {
    recommendations.push({
      kind: "remediation",
      title: "Convert fragile wins into mastery",
      body: "You are answering some items correctly while unsure. Use flashcards to make those concepts feel automatic.",
      href: "/app/flashcards",
    });
  }
  const readyTopic = args.topicBreakdowns.find(
    (topic) => topic.totalRated >= 5 && topic.overconfidentMisses === 0 && topic.confidenceAccuracyPct >= 80,
  );
  if (readyTopic) {
    recommendations.push({
      kind: "exam_ready",
      title: `${readyTopic.topic} is ready for exam-level practice`,
      body: "Confidence and correctness are aligned. Move this area into timed mixed practice or a CAT-style check.",
      href: "/app/practice-tests",
    });
  }
  if (recommendations.length === 0 && args.confidenceAccuracy >= 70) {
    recommendations.push({
      kind: "exam_ready",
      title: "Confidence calibration is improving",
      body: "Keep using confidence ratings during mixed practice so the system can catch hidden risk early.",
      href: "/app/questions",
    });
  }
  if (recommendations.length === 0) {
    recommendations.push({
      kind: "remediation",
      title: "Build a larger confidence sample",
      body: "Rate confidence on more questions and flashcards to unlock topic-specific recommendations.",
      href: "/app/questions",
    });
  }
  return recommendations.slice(0, 3);
}

export function buildConfidenceAnalyticsReport(events: ConfidenceAnalyticsEvent[]): ConfidenceAnalyticsReport {
  const rated = events
    .map((event) => ({ ...event, band: normalizeConfidenceBand(event.confidence) }))
    .filter((event): event is ConfidenceAnalyticsEvent & { band: ConfidenceBand } => event.band !== null);

  const quadrants: ConfidenceQuadrants = {
    correctHighConfidence: 0,
    correctLowConfidence: 0,
    incorrectHighConfidence: 0,
    incorrectLowConfidence: 0,
    mediumConfidence: 0,
    totalRated: rated.length,
  };

  for (const event of rated) {
    if (event.band === "medium") quadrants.mediumConfidence++;
    if (event.band === "high" && event.isCorrect) quadrants.correctHighConfidence++;
    if (event.band === "low" && event.isCorrect) quadrants.correctLowConfidence++;
    if (event.band === "high" && !event.isCorrect) quadrants.incorrectHighConfidence++;
    if (event.band === "low" && !event.isCorrect) quadrants.incorrectLowConfidence++;
  }

  const highTotal = quadrants.correctHighConfidence + quadrants.incorrectHighConfidence;
  const lowTotal = quadrants.correctLowConfidence + quadrants.incorrectLowConfidence;
  const highLowTotal = highTotal + lowTotal;
  const overconfidenceScore = pct(quadrants.incorrectHighConfidence, highTotal);
  const underconfidenceScore = pct(quadrants.correctLowConfidence, lowTotal);
  const confidenceAccuracy = pct(
    quadrants.correctHighConfidence + quadrants.incorrectLowConfidence,
    highLowTotal,
  );
  const topicBreakdowns = buildTopicRows(rated);
  const highRiskKnowledgeGaps = topicBreakdowns
    .filter((topic) => topic.overconfidentMisses > 0)
    .slice(0, 5);

  return {
    quadrants,
    overconfidenceScore,
    underconfidenceScore,
    confidenceAccuracy,
    highRiskKnowledgeGaps,
    topicBreakdowns,
    weeklyTrend: buildWeeklyTrend(rated),
    recommendations: buildRecommendations({
      overconfidenceScore,
      underconfidenceScore,
      confidenceAccuracy,
      highRiskKnowledgeGaps,
      topicBreakdowns,
    }),
  };
}
