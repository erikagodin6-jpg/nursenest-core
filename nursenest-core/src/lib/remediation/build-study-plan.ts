import type { PrismaClient } from "@prisma/client";
import { TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { subscriberCanonicalAlliedProfessionKey } from "@/lib/entitlements/allied-occupation-entitlement";
import { exclusiveWinningProfessionForTopic } from "@/lib/allied/allied-profession-lesson-exclusive-scope";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { resolveRemediationContentLinks } from "@/lib/remediation/remediation-links";
import { buildResurfacingQueue } from "@/lib/remediation/resurfacing-priority";
import { computeCnpleReadiness, summarizeReadinessReport } from "@/lib/remediation/cnple-readiness-scoring";
import type { CnpleReadinessReport } from "@/lib/remediation/cnple-readiness-scoring";
import { isCnplePathway } from "@/lib/exam-pathways/cnple-pathway";
import {
  computeLongTermMasterySignals,
  type LongTermMasterySignal,
  type LongTermMasteryStat,
} from "@/lib/remediation/long-term-mastery";

export type StudyPlanItemJson = {
  id: string;
  pathwayId: string | null;
  topic: string | null;
  bodySystem: string | null;
  priorityScore: number;
  nextReviewAt: string;
  mistakeCount: number;
  lessonHref: string | null;
  flashcardsHref: string | null;
  practiceQuestionsHref: string | null;
  retestQuestionsHref: string | null;
};

export type LongTermMasteryItemJson = {
  topic: string;
  topicKey: string;
  attempts: number;
  accuracyPct: number;
  reasoningDurability: number;
  conceptDecayRisk: number;
  prioritizationConsistency: number;
  pharmacologyRetention: number | null;
  unsafeRelapseRisk: number;
  priorityScore: number;
  recommendedReviewAt: string;
  riskLevel: LongTermMasterySignal["riskLevel"];
  focus: LongTermMasterySignal["focus"];
  reasons: string[];
  lessonHref: string | null;
  flashcardsHref: string | null;
  practiceQuestionsHref: string | null;
  retestQuestionsHref: string | null;
};

export type StudyPlanResponse = {
  enabled: boolean;
  asOf: string;
  remediationDue: StudyPlanItemJson[];
  recommendedLessons: { href: string | null; title: string | null }[];
  recommendedFlashcards: { href: string | null }[];
  recommendedPractice: { href: string | null }[];
  longTermMastery: LongTermMasteryItemJson[];
  /** Present only for ca-np-cnple pathway users. */
  cnpleReadiness?: {
    overallReadinessScore: number;
    readyForExam: boolean;
    criticalGaps: string[];
    prescribingSafetyWarnings: string[];
    domains: CnpleReadinessReport["domains"];
  };
};

function remediationAlliedTopicAllowed(
  entitlement: AccessScope | null | undefined,
  pathwayId: string | null,
  topic: string | null,
): boolean {
  if (!entitlement || entitlement.tier !== TierCode.ALLIED || !entitlement.hasAccess) return true;
  const pid = pathwayId?.trim() ?? "";
  if (!pid || !isAlliedMarketingCorePathwayId(pid)) return true;
  const pk = subscriberCanonicalAlliedProfessionKey(entitlement);
  const topicSlug = (topic ?? "").trim().toLowerCase();
  if (!topicSlug) return true;
  const winner = exclusiveWinningProfessionForTopic(pid, topicSlug);
  if (winner == null) return true;
  if (!pk) return false;
  return winner === pk;
}

function buildRetestHref(
  pathwayId: string | null,
  topic: string | null,
  topicCode: string | null,
  practiceQuestionsHref: string | null,
): string {
  const qs = new URLSearchParams();
  qs.set("preset", "topic_drill");
  if (pathwayId) qs.set("pathwayId", pathwayId);
  if (topic) qs.set("topic", topic);
  if (topicCode) qs.set("topicCode", topicCode);
  qs.set("sessionSize", "5");
  return qs.has("topic") || qs.has("topicCode")
    ? `/app/questions?${qs.toString()}`
    : (practiceQuestionsHref ?? "/app/questions");
}

export async function buildStudyPlanForUser(
  prisma: PrismaClient,
  userId: string,
  entitlement?: AccessScope | null,
): Promise<StudyPlanResponse> {
  const asOf = new Date();
  const endOfUtcDay = new Date(
    Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate(), 23, 59, 59, 999),
  );

  // ── 1. Fetch raw queue rows ───────────────────────────────────────────────
  const rawRows = await prisma.userRemediationQueue.findMany({
    where: { userId, resolved: false, nextReviewAt: { lte: endOfUtcDay } },
    orderBy: [{ priorityScore: "desc" }, { nextReviewAt: "asc" }],
    take: 50, // over-fetch before de-dup/resurfacing sort
    select: {
      id: true,
      pathwayId: true,
      topic: true,
      bodySystem: true,
      topicKey: true,
      priorityScore: true,
      nextReviewAt: true,
      mistakeCount: true,
    },
  });

  // ── 2. Deduplicate + sort by danger-aware resurfacing urgency ─────────────
  const resurfaced = buildResurfacingQueue(
    rawRows.map((r) => ({
      id: r.id,
      topicKey: r.topicKey,
      topic: r.topic,
      priorityScore: r.priorityScore,
      mistakeCount: r.mistakeCount,
      nextReviewAt: r.nextReviewAt,
    })),
  );

  // Align original row data to resurfaced ordering
  const rowById = new Map(rawRows.map((r) => [r.id, r]));
  const orderedRows = resurfaced
    .map((e) => rowById.get(e.id))
    .filter((r): r is NonNullable<typeof r> => r != null)
    .filter((r) => remediationAlliedTopicAllowed(entitlement, r.pathwayId, r.topic))
    .slice(0, 25);

  // ── 3. Batch-resolve content links (single Promise.all — no N+1) ──────────
  const linkResults = await Promise.all(
    orderedRows.map((row) =>
      resolveRemediationContentLinks(prisma, {
        pathwayId: row.pathwayId,
        topic: row.topic,
        subtopic: null,
        bodySystem: row.bodySystem,
        tags: [],
      }),
    ),
  );

  // ── 3b. Long-term mastery watchlist ─────────────────────────────────────
  // This is intentionally separate from simple spaced repetition. It uses
  // durability, decay, consistency, retention, and relapse signals to revisit
  // high-risk concepts before the learner visibly deteriorates.
  const topicStatsForMastery = await prisma.userTopicStat.findMany({
    where: { userId },
    orderBy: [{ updatedAt: "desc" }],
    take: 80,
    select: {
      topic: true,
      correctCount: true,
      wrongCount: true,
      wrongStreak: true,
      lastWrongAt: true,
      lastAttemptAt: true,
    },
  });
  const topicNamesForEvents = topicStatsForMastery.map((s) => s.topic).filter(Boolean);
  const sinceForMasteryEvents = new Date(asOf.getTime() - 120 * 86_400_000);
  const masteryEvents =
    topicNamesForEvents.length > 0
      ? await prisma.userRemediationEvent.findMany({
          where: {
            userId,
            topic: { in: topicNamesForEvents },
            createdAt: { gte: sinceForMasteryEvents },
          },
          select: {
            topic: true,
            mistakeType: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 300,
        })
      : [];
  const eventsByTopic = new Map<string, LongTermMasteryStat["remediationEvents"]>();
  for (const event of masteryEvents) {
    if (!event.topic) continue;
    const arr = eventsByTopic.get(event.topic) ?? [];
    arr.push({ mistakeType: String(event.mistakeType), createdAt: event.createdAt });
    eventsByTopic.set(event.topic, arr);
  }

  const queuedTopicKeys = new Set(orderedRows.map((row) => row.topicKey));
  const longTermSignals = computeLongTermMasterySignals(
    topicStatsForMastery.map((stat) => ({
      ...stat,
      remediationEvents: eventsByTopic.get(stat.topic) ?? [],
    })),
    asOf,
  )
    .filter((signal) => !queuedTopicKeys.has(signal.topicKey))
    .slice(0, 8);
  const longTermLinkResults = await Promise.all(
    longTermSignals.map((signal) =>
      resolveRemediationContentLinks(prisma, {
        pathwayId: null,
        topic: signal.topic,
        subtopic: null,
        bodySystem: null,
        tags: [],
      }),
    ),
  );

  // ── 4. Build study-plan items ─────────────────────────────────────────────
  const remediationDue: StudyPlanItemJson[] = [];
  const longTermMastery: LongTermMasteryItemJson[] = [];
  const lessonSet = new Map<string, { href: string | null; title: string | null }>();
  const flashSet = new Map<string, { href: string | null }>();
  const practiceSet = new Map<string, { href: string | null }>();

  for (let i = 0; i < orderedRows.length; i++) {
    const row = orderedRows[i]!;
    const links = linkResults[i]!;

    const retestQuestionsHref = buildRetestHref(
      row.pathwayId,
      row.topic,
      links.topicCode,
      links.practiceQuestionsHref,
    );

    remediationDue.push({
      id: row.id,
      pathwayId: row.pathwayId,
      topic: row.topic,
      bodySystem: row.bodySystem,
      priorityScore: row.priorityScore,
      nextReviewAt: row.nextReviewAt.toISOString(),
      mistakeCount: row.mistakeCount,
      lessonHref: links.lessonHref,
      flashcardsHref: links.flashcardsHref,
      practiceQuestionsHref: links.practiceQuestionsHref,
      retestQuestionsHref,
    });

    if (links.lessonHref) lessonSet.set(links.lessonHref, { href: links.lessonHref, title: row.topic });
    if (links.flashcardsHref) flashSet.set(links.flashcardsHref, { href: links.flashcardsHref });
    if (links.practiceQuestionsHref) practiceSet.set(links.practiceQuestionsHref, { href: links.practiceQuestionsHref });
  }

  for (let i = 0; i < longTermSignals.length; i++) {
    const signal = longTermSignals[i]!;
    const links = longTermLinkResults[i]!;
    const retestQuestionsHref = buildRetestHref(null, signal.topic, links.topicCode, links.practiceQuestionsHref);
    longTermMastery.push({
      topic: signal.topic,
      topicKey: signal.topicKey,
      attempts: signal.attempts,
      accuracyPct: signal.accuracyPct,
      reasoningDurability: signal.reasoningDurability,
      conceptDecayRisk: signal.conceptDecayRisk,
      prioritizationConsistency: signal.prioritizationConsistency,
      pharmacologyRetention: signal.pharmacologyRetention,
      unsafeRelapseRisk: signal.unsafeRelapseRisk,
      priorityScore: signal.priorityScore,
      recommendedReviewAt: signal.recommendedReviewAt.toISOString(),
      riskLevel: signal.riskLevel,
      focus: signal.focus,
      reasons: signal.reasons,
      lessonHref: links.lessonHref,
      flashcardsHref: links.flashcardsHref,
      practiceQuestionsHref: links.practiceQuestionsHref,
      retestQuestionsHref,
    });
    if (links.lessonHref) lessonSet.set(links.lessonHref, { href: links.lessonHref, title: signal.topic });
    if (links.flashcardsHref) flashSet.set(links.flashcardsHref, { href: links.flashcardsHref });
    if (links.practiceQuestionsHref) practiceSet.set(links.practiceQuestionsHref, { href: links.practiceQuestionsHref });
  }

  // ── 5. CNPLE readiness (only for ca-np-cnple pathway) ────────────────────
  const isCnpleUser =
    orderedRows.some((r) => isCnplePathway(r.pathwayId)) ||
    rawRows.some((r) => isCnplePathway(r.pathwayId));

  let cnpleReadiness: StudyPlanResponse["cnpleReadiness"] | undefined;
  if (isCnpleUser) {
    const topicStats = await prisma.userTopicStat.findMany({
      where: { userId },
      select: {
        topic: true,
        correctCount: true,
        wrongCount: true,
        wrongStreak: true,
        lastWrongAt: true,
      },
    });

    const report = computeCnpleReadiness(topicStats);
    const { prescribingSafetyWarnings } = summarizeReadinessReport(report);

    cnpleReadiness = {
      overallReadinessScore: report.overallReadinessScore,
      readyForExam: report.readyForExam,
      criticalGaps: report.criticalGaps,
      prescribingSafetyWarnings,
      domains: report.domains,
    };
  }

  return {
    enabled: true,
    asOf: asOf.toISOString(),
    remediationDue: remediationDue.slice(0, 10),
    recommendedLessons: [...lessonSet.values()].slice(0, 8),
    recommendedFlashcards: [...flashSet.values()].slice(0, 8),
    recommendedPractice: [...practiceSet.values()].slice(0, 8),
    longTermMastery,
    ...(cnpleReadiness ? { cnpleReadiness } : {}),
  };
}
