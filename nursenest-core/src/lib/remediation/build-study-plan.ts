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

export type StudyPlanResponse = {
  enabled: boolean;
  asOf: string;
  remediationDue: StudyPlanItemJson[];
  recommendedLessons: { href: string | null; title: string | null }[];
  recommendedFlashcards: { href: string | null }[];
  recommendedPractice: { href: string | null }[];
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

  // ── 4. Build study-plan items ─────────────────────────────────────────────
  const remediationDue: StudyPlanItemJson[] = [];
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
    ...(cnpleReadiness ? { cnpleReadiness } : {}),
  };
}
