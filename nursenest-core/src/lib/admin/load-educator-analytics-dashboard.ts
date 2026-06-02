import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";

export type EducatorAnalyticsQuery = {
  from: Date;
  to: Date;
  fromDay: string;
  toDay: string;
  pathwayId: string | null;
};

export type EducatorAnalyticsData = {
  generatedAt: string;
  query: EducatorAnalyticsQuery;
  degraded: boolean;
  warnings: string[];
  overview: {
    activeLearners: number;
    questionAttempts: number;
    avgAccuracyPct: number | null;
    avgReadinessScore: number | null;
    highRiskRemediationEvents: number;
    unresolvedRemediationItems: number;
  };
  classWeaknesses: Array<{
    topic: string;
    attempts: number;
    accuracyPct: number;
    wrongCount: number;
    learnerCount: number;
    riskDomain: string;
  }>;
  unsafeReasoningTrends: Array<{
    mistakeType: string;
    events: number;
    learners: number;
    topTopic: string | null;
    educatorAction: string;
  }>;
  pharmacologyGaps: Array<{
    topic: string;
    attempts: number;
    accuracyPct: number;
    wrongCount: number;
    learnerCount: number;
  }>;
  delegationIssues: Array<{
    topic: string;
    events: number;
    learners: number;
  }>;
  confidenceCalibration: {
    highConfidenceWrong: number;
    lowConfidenceWrong: number;
    unsureOrGuessingWrong: number;
    confidenceMissing: number;
    note: string;
  };
  highRiskDomains: Array<{
    domain: string;
    eventCount: number;
    learnerCount: number;
    recommendedRemediation: string;
  }>;
  strugglingLearners: Array<{
    userId: string;
    name: string | null;
    email: string;
    tier: string;
    country: string;
    readinessScore: number | null;
    readinessLevel: string | null;
    totalQuestions: number;
    accuracyPct: number | null;
    openRemediationItems: number;
    lastActiveAt: string | null;
  }>;
  assignmentRecommendations: Array<{
    title: string;
    topic: string;
    audience: string;
    reason: string;
    priority: "critical" | "high" | "moderate";
    suggestedActivity: string;
  }>;
  dataNotes: string[];
};

const MS_DAY = 86_400_000;

function utcDayString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function startOfUtcDay(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

function endOfUtcDay(day: string): Date {
  return new Date(`${day}T23:59:59.999Z`);
}

function firstParam(raw: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const value = raw[key];
  return Array.isArray(value) ? value[0] : value;
}

export function parseEducatorAnalyticsSearchParams(
  raw: Record<string, string | string[] | undefined>,
): EducatorAnalyticsQuery {
  const today = utcDayString(new Date());
  let to = firstParam(raw, "to") ? endOfUtcDay(firstParam(raw, "to")!) : endOfUtcDay(today);
  let from = firstParam(raw, "from") ? startOfUtcDay(firstParam(raw, "from")!) : new Date(to.getTime() - 29 * MS_DAY);
  if (from > to) {
    const tmp = from;
    from = to;
    to = tmp;
  }
  if (to.getTime() - from.getTime() > 366 * MS_DAY) {
    from = new Date(to.getTime() - 366 * MS_DAY);
  }
  const rawPathway = firstParam(raw, "pathwayId")?.trim();
  return {
    from,
    to,
    fromDay: utcDayString(from),
    toDay: utcDayString(to),
    pathwayId: rawPathway || null,
  };
}

function pathwayAttemptFilter(q: EducatorAnalyticsQuery): Prisma.Sql {
  return q.pathwayId ? Prisma.sql`AND a.pathway_id = ${q.pathwayId}` : Prisma.empty;
}

function pathwayRemediationFilter(q: EducatorAnalyticsQuery): Prisma.Sql {
  return q.pathwayId ? Prisma.sql`AND e."pathwayId" = ${q.pathwayId}` : Prisma.empty;
}

function pathwayQueueFilter(q: EducatorAnalyticsQuery): Prisma.Sql {
  return q.pathwayId ? Prisma.sql`AND rq."pathwayId" = ${q.pathwayId}` : Prisma.empty;
}

function riskDomainForTopic(topic: string): string {
  const t = topic.toLowerCase();
  if (/insulin|med|drug|pharm|opioid|warfarin|heparin|anticoag|digoxin|antibiotic/.test(t)) return "Pharmacology safety";
  if (/delegate|assignment|uap|rpn|lpn|scope/.test(t)) return "Delegation and scope";
  if (/sepsis|shock|deterior|unstable|rapid|emergency|priority|triage/.test(t)) return "Recognizing instability";
  if (/resp|copd|oxygen|pneumonia|airway|asthma/.test(t)) return "Oxygenation and ABCs";
  if (/communication|sbar|teach|education|therapeutic/.test(t)) return "Communication";
  return "Core clinical judgment";
}

function educatorActionForMistake(mistakeType: string): string {
  switch (mistakeType) {
    case "safety":
      return "Assign safety huddle: expected vs unexpected findings plus escalation triggers.";
    case "prioritization":
      return "Assign ABCs, acute-vs-chronic, and unstable-vs-stable drills before mixed practice.";
    case "pharmacology":
      return "Assign high-alert medication review with insulin, anticoagulants, opioids, and adverse-effect cues.";
    case "delegation":
      return "Assign scope-of-practice sorting and unsafe delegation mini-cases.";
    case "misread_question":
      return "Assign stem-reading practice focused on first action, best response, and priority wording.";
    default:
      return "Assign targeted lesson review followed by a short remediation quiz.";
  }
}

export async function loadEducatorAnalyticsDashboard(
  q: EducatorAnalyticsQuery,
): Promise<EducatorAnalyticsData | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return null;

  const generatedAt = new Date().toISOString();
  const warnings: string[] = [];
  const pushWarn = (error: unknown, label: string) => {
    warnings.push(`${label}: ${error instanceof Error ? error.message : String(error)}`);
  };

  let activeLearners = 0;
  let questionAttempts = 0;
  let avgAccuracyPct: number | null = null;
  let avgReadinessScore: number | null = null;
  let highRiskRemediationEvents = 0;
  let unresolvedRemediationItems = 0;
  let classWeaknesses: EducatorAnalyticsData["classWeaknesses"] = [];
  let unsafeReasoningTrends: EducatorAnalyticsData["unsafeReasoningTrends"] = [];
  let pharmacologyGaps: EducatorAnalyticsData["pharmacologyGaps"] = [];
  let delegationIssues: EducatorAnalyticsData["delegationIssues"] = [];
  let confidenceCalibration: EducatorAnalyticsData["confidenceCalibration"] = {
    highConfidenceWrong: 0,
    lowConfidenceWrong: 0,
    unsureOrGuessingWrong: 0,
    confidenceMissing: 0,
    note: "Confidence buckets use captured remediation events; missing values indicate older sessions or surfaces that did not request confidence.",
  };
  let highRiskDomains: EducatorAnalyticsData["highRiskDomains"] = [];
  let strugglingLearners: EducatorAnalyticsData["strugglingLearners"] = [];

  try {
    const rows = await prisma.$queryRaw<
      Array<{ learners: bigint; attempts: bigint; correct: bigint; wrong: bigint }>
    >`
      SELECT
        COUNT(DISTINCT a.user_id)::bigint AS learners,
        COUNT(*)::bigint AS attempts,
        (COUNT(*) FILTER (WHERE a.is_correct = true))::bigint AS correct,
        (COUNT(*) FILTER (WHERE a.is_correct = false))::bigint AS wrong
      FROM exam_question_practice_answer_attempts a
      WHERE a.created_at >= ${q.from} AND a.created_at <= ${q.to}
      ${pathwayAttemptFilter(q)}
    `;
    const row = rows[0];
    activeLearners = row ? Number(row.learners) : 0;
    questionAttempts = row ? Number(row.attempts) : 0;
    const correct = row ? Number(row.correct) : 0;
    avgAccuracyPct = questionAttempts > 0 ? Math.round((correct / questionAttempts) * 1000) / 10 : null;
  } catch (e) {
    pushWarn(e, "question attempts");
  }

  try {
    const readinessRows = await prisma.$queryRaw<Array<{ avg_score: number | null }>>`
      SELECT AVG(s.readiness_score)::double precision AS avg_score
      FROM student_study_profiles s
      JOIN "User" u ON u.id = s.user_id
      WHERE s.updated_at >= ${q.from} AND s.updated_at <= ${q.to}
      ${q.pathwayId ? Prisma.sql`AND u."learnerPath" = ${q.pathwayId}` : Prisma.empty}
    `;
    avgReadinessScore = readinessRows[0]?.avg_score == null ? null : Math.round(Number(readinessRows[0].avg_score) * 10) / 10;
  } catch (e) {
    pushWarn(e, "readiness profile");
  }

  try {
    const riskRows = await prisma.$queryRaw<Array<{ events: bigint }>>`
      SELECT COUNT(*)::bigint AS events
      FROM "UserRemediationEvent" e
      WHERE e."createdAt" >= ${q.from} AND e."createdAt" <= ${q.to}
      ${pathwayRemediationFilter(q)}
      AND e."mistakeType"::text IN ('safety', 'prioritization', 'pharmacology', 'delegation')
    `;
    highRiskRemediationEvents = Number(riskRows[0]?.events ?? 0);

    const queueRows = await prisma.$queryRaw<Array<{ open_items: bigint }>>`
      SELECT COUNT(*)::bigint AS open_items
      FROM "UserRemediationQueue" rq
      WHERE rq.resolved = false
      ${pathwayQueueFilter(q)}
    `;
    unresolvedRemediationItems = Number(queueRows[0]?.open_items ?? 0);
  } catch (e) {
    pushWarn(e, "high-risk remediation");
  }

  try {
    const rows = await prisma.$queryRaw<
      Array<{ topic: string; attempts: bigint; wrong: bigint; correct: bigint; learners: bigint }>
    >`
      SELECT
        uts.topic,
        SUM(uts."correctCount" + uts."wrongCount")::bigint AS attempts,
        SUM(uts."wrongCount")::bigint AS wrong,
        SUM(uts."correctCount")::bigint AS correct,
        COUNT(DISTINCT uts."userId")::bigint AS learners
      FROM "UserTopicStat" uts
      JOIN "User" u ON u.id = uts."userId"
      WHERE uts."updatedAt" >= ${q.from} AND uts."updatedAt" <= ${q.to}
      ${q.pathwayId ? Prisma.sql`AND u."learnerPath" = ${q.pathwayId}` : Prisma.empty}
      GROUP BY uts.topic
      HAVING SUM(uts."correctCount" + uts."wrongCount") >= 8
      ORDER BY
        (SUM(uts."wrongCount")::double precision / NULLIF(SUM(uts."correctCount" + uts."wrongCount"), 0)) DESC,
        attempts DESC
      LIMIT 18
    `;
    classWeaknesses = rows.map((r) => {
      const attempts = Number(r.attempts);
      const correct = Number(r.correct);
      return {
        topic: r.topic,
        attempts,
        wrongCount: Number(r.wrong),
        learnerCount: Number(r.learners),
        accuracyPct: attempts > 0 ? Math.round((correct / attempts) * 1000) / 10 : 0,
        riskDomain: riskDomainForTopic(r.topic),
      };
    });
    pharmacologyGaps = classWeaknesses
      .filter((r) => r.riskDomain === "Pharmacology safety")
      .slice(0, 8)
      .map(({ topic, attempts, accuracyPct, wrongCount, learnerCount }) => ({
        topic,
        attempts,
        accuracyPct,
        wrongCount,
        learnerCount,
      }));
  } catch (e) {
    pushWarn(e, "class weaknesses");
  }

  try {
    const rows = await prisma.$queryRaw<
      Array<{ mistake_type: string; events: bigint; learners: bigint; top_topic: string | null }>
    >`
      WITH ranked AS (
        SELECT
          e."mistakeType"::text AS mistake_type,
          e.topic,
          COUNT(*) AS topic_events,
          ROW_NUMBER() OVER (PARTITION BY e."mistakeType"::text ORDER BY COUNT(*) DESC) AS rn
        FROM "UserRemediationEvent" e
        WHERE e."createdAt" >= ${q.from} AND e."createdAt" <= ${q.to}
        ${pathwayRemediationFilter(q)}
        GROUP BY e."mistakeType"::text, e.topic
      )
      SELECT
        e."mistakeType"::text AS mistake_type,
        COUNT(*)::bigint AS events,
        COUNT(DISTINCT e."userId")::bigint AS learners,
        MAX(r.topic) FILTER (WHERE r.rn = 1) AS top_topic
      FROM "UserRemediationEvent" e
      LEFT JOIN ranked r ON r.mistake_type = e."mistakeType"::text
      WHERE e."createdAt" >= ${q.from} AND e."createdAt" <= ${q.to}
      ${pathwayRemediationFilter(q)}
      GROUP BY e."mistakeType"::text
      ORDER BY events DESC
    `;
    unsafeReasoningTrends = rows.map((r) => ({
      mistakeType: r.mistake_type,
      events: Number(r.events),
      learners: Number(r.learners),
      topTopic: r.top_topic,
      educatorAction: educatorActionForMistake(r.mistake_type),
    }));
    delegationIssues = rows
      .filter((r) => r.mistake_type === "delegation")
      .map((r) => ({
        topic: r.top_topic ?? "Delegation / assignment",
        events: Number(r.events),
        learners: Number(r.learners),
      }));
  } catch (e) {
    pushWarn(e, "reasoning trends");
  }

  try {
    const rows = await prisma.$queryRaw<
      Array<{ bucket: string; events: bigint }>
    >`
      SELECT
        CASE
          WHEN e.confidence IS NULL OR trim(e.confidence) = '' THEN 'missing'
          WHEN lower(e.confidence) IN ('high', 'very_confident', 'confident', 'very confident') THEN 'high'
          WHEN lower(e.confidence) IN ('low', 'not_confident', 'not confident') THEN 'low'
          WHEN lower(e.confidence) IN ('guessing', 'unsure') THEN 'guessing'
          ELSE 'missing'
        END AS bucket,
        COUNT(*)::bigint AS events
      FROM "UserRemediationEvent" e
      WHERE e."createdAt" >= ${q.from} AND e."createdAt" <= ${q.to}
      ${pathwayRemediationFilter(q)}
      GROUP BY 1
    `;
    for (const row of rows) {
      const events = Number(row.events);
      if (row.bucket === "high") confidenceCalibration.highConfidenceWrong = events;
      if (row.bucket === "low") confidenceCalibration.lowConfidenceWrong = events;
      if (row.bucket === "guessing") confidenceCalibration.unsureOrGuessingWrong = events;
      if (row.bucket === "missing") confidenceCalibration.confidenceMissing = events;
    }
  } catch (e) {
    pushWarn(e, "confidence calibration");
  }

  try {
    const rows = await prisma.$queryRaw<
      Array<{ domain: string; events: bigint; learners: bigint }>
    >`
      SELECT
        COALESCE(e."bodySystem", e.topic, e."mistakeType"::text, 'uncategorized') AS domain,
        COUNT(*)::bigint AS events,
        COUNT(DISTINCT e."userId")::bigint AS learners
      FROM "UserRemediationEvent" e
      WHERE e."createdAt" >= ${q.from} AND e."createdAt" <= ${q.to}
      ${pathwayRemediationFilter(q)}
      AND e."mistakeType"::text IN ('safety', 'prioritization', 'pharmacology', 'delegation')
      GROUP BY 1
      ORDER BY events DESC
      LIMIT 12
    `;
    highRiskDomains = rows.map((r) => ({
      domain: r.domain,
      eventCount: Number(r.events),
      learnerCount: Number(r.learners),
      recommendedRemediation: `Run a short targeted set on ${r.domain}, then require rationale review for missed items.`,
    }));
  } catch (e) {
    pushWarn(e, "high-risk domains");
  }

  try {
    const rows = await prisma.$queryRaw<
      Array<{
        user_id: string;
        name: string | null;
        email: string;
        tier: string;
        country: string;
        readiness_score: number | null;
        readiness_level: string | null;
        total_questions: number | null;
        total_correct: number | null;
        total_incorrect: number | null;
        open_items: bigint;
        last_active_at: Date | null;
      }>
    >`
      SELECT
        u.id AS user_id,
        NULLIF(trim(COALESCE(u."displayName", u.name)), '') AS name,
        u.email,
        u.tier::text AS tier,
        u.country::text AS country,
        s.readiness_score,
        s.readiness_level,
        s.total_questions_answered AS total_questions,
        s.total_correct,
        s.total_incorrect,
        (COUNT(DISTINCT rq.id) FILTER (WHERE rq.resolved = false))::bigint AS open_items,
        GREATEST(
          COALESCE(s.updated_at, 'epoch'::timestamp),
          COALESCE(MAX(uts."lastAttemptAt"), 'epoch'::timestamp),
          COALESCE(MAX(rq."updatedAt"), 'epoch'::timestamp)
        ) AS last_active_at
      FROM "User" u
      LEFT JOIN student_study_profiles s ON s.user_id = u.id
      LEFT JOIN "UserTopicStat" uts ON uts."userId" = u.id
      LEFT JOIN "UserRemediationQueue" rq ON rq."userId" = u.id
      WHERE u.role = 'LEARNER'
      ${q.pathwayId ? Prisma.sql`AND u."learnerPath" = ${q.pathwayId}` : Prisma.empty}
      GROUP BY u.id, u."displayName", u.name, u.email, u.tier, u.country, s.readiness_score, s.readiness_level, s.total_questions_answered, s.total_correct, s.total_incorrect, s.updated_at
      HAVING
        COALESCE(s.readiness_score, 0) < 70
        OR COUNT(DISTINCT rq.id) FILTER (WHERE rq.resolved = false) >= 2
        OR COALESCE(s.total_incorrect, 0) > COALESCE(s.total_correct, 0)
      ORDER BY
        COUNT(DISTINCT rq.id) FILTER (WHERE rq.resolved = false) DESC,
        COALESCE(s.readiness_score, 0) ASC,
        last_active_at DESC
      LIMIT 20
    `;
    strugglingLearners = rows.map((r) => {
      const total = r.total_questions ?? 0;
      const correct = r.total_correct ?? 0;
      return {
        userId: r.user_id,
        name: r.name,
        email: r.email,
        tier: r.tier,
        country: r.country,
        readinessScore: r.readiness_score,
        readinessLevel: r.readiness_level,
        totalQuestions: total,
        accuracyPct: total > 0 ? Math.round((correct / total) * 1000) / 10 : null,
        openRemediationItems: Number(r.open_items),
        lastActiveAt: r.last_active_at && r.last_active_at.getTime() > 0 ? r.last_active_at.toISOString() : null,
      };
    });
  } catch (e) {
    pushWarn(e, "struggling learners");
  }

  const assignmentRecommendations = [
    ...unsafeReasoningTrends.slice(0, 3).map((trend) => ({
      title: `${trend.mistakeType.replace(/_/g, " ")} remediation block`,
      topic: trend.topTopic ?? trend.mistakeType.replace(/_/g, " "),
      audience: `${trend.learners} learner${trend.learners === 1 ? "" : "s"}`,
      reason: trend.topTopic
        ? `${trend.events} events; most common topic: ${trend.topTopic}.`
        : `${trend.events} captured remediation events.`,
      priority:
        trend.mistakeType === "safety" || trend.mistakeType === "pharmacology"
          ? ("critical" as const)
          : ("high" as const),
      suggestedActivity: trend.educatorAction,
    })),
    ...classWeaknesses.slice(0, 3).map((weakness) => ({
      title: `${weakness.topic} targeted practice`,
      topic: weakness.topic,
      audience: `${weakness.learnerCount} learner${weakness.learnerCount === 1 ? "" : "s"}`,
      reason: `${weakness.accuracyPct}% accuracy across ${weakness.attempts} attempts.`,
      priority: weakness.accuracyPct < 50 ? ("high" as const) : ("moderate" as const),
      suggestedActivity: `Assign 10-15 ${weakness.riskDomain.toLowerCase()} questions, then review wrong-answer rationales as a group.`,
    })),
  ].slice(0, 6);

  return {
    generatedAt,
    query: q,
    degraded: warnings.length > 0,
    warnings,
    overview: {
      activeLearners,
      questionAttempts,
      avgAccuracyPct,
      avgReadinessScore,
      highRiskRemediationEvents,
      unresolvedRemediationItems,
    },
    classWeaknesses,
    unsafeReasoningTrends,
    pharmacologyGaps,
    delegationIssues,
    confidenceCalibration,
    highRiskDomains,
    strugglingLearners,
    assignmentRecommendations,
    dataNotes: [
      "Educator analytics are aggregated from persisted learner activity. They intentionally avoid showing raw answer content or private notes.",
      "Class-wide weaknesses use UserTopicStat updated inside the selected date window.",
      "Unsafe reasoning trends use UserRemediationEvent mistake types: safety, prioritization, pharmacology, delegation, knowledge gap, and misread question.",
      "Struggling learner flags combine readiness score, open remediation queue count, and overall correct/incorrect balance.",
      "Pathway filtering uses learnerPath for profile/topic rows and pathwayId for attempt/remediation rows where available.",
    ],
  };
}
