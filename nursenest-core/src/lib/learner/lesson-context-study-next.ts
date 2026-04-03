import "server-only";

import { TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { filterWeakTopicsForAlliedProfession } from "@/lib/allied/allied-weak-topic-filter";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import {
  recommendNextActionsForLessonContinue,
  type PostTestRemediationInputRow,
  type PostTestStudyNextBundle,
} from "@/lib/learner/adaptive-recommendations";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import { formatTopicLabelForDisplay, normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { resolveTopicRemediationLinks } from "@/lib/learner/topic-remediation-links";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import { pathwayLessonsAppListWhere } from "@/lib/lessons/app-pathway-lesson-list-scope";

export type LessonContinueContext =
  | { variant: "pathway"; lessonId: string; pathwayId: string; topicSlug: string }
  | { variant: "content"; lessonId: string; anchorNorm: string; topicCode: string | null }
  | { variant: "legacy"; lessonId: string; anchorNorm: string; topicCode: string | null };

function weakOverlapsCurrentLesson(w: WeakTopicRow, anchorNorm: string, topicCode: string | null): boolean {
  const wn = w.normalizedTopic ?? normalizeTopicKey(w.topic);
  if (wn === anchorNorm) return true;
  if (topicCode) {
    const tc = normalizeTopicKey(topicCode);
    if (wn === tc) return true;
  }
  return false;
}

async function findNextPathwayLessonInAppOrder(
  pathwayId: string,
  currentLessonId: string,
  entitlement: AccessScope,
  learnerPath: string | null,
): Promise<{ id: string; title: string } | null> {
  const baseWhere = pathwayLessonsAppListWhere(entitlement, learnerPath);
  const rows = await prisma.pathwayLesson.findMany({
    where: { AND: [baseWhere, { pathwayId }] },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: { id: true, title: true },
  });
  const idx = rows.findIndex((r) => r.id === currentLessonId);
  if (idx < 0 || idx >= rows.length - 1) return null;
  const n = rows[idx + 1]!;
  return { id: n.id, title: n.title };
}

/**
 * Snapshot: pathway position + scoped weak topics (same source as dashboard), then Study Next lesson-end ranking.
 */
export async function loadLessonContinueStudyNext(
  userId: string,
  entitlement: AccessScope,
  learnerPath: string | null,
  ctx: LessonContinueContext,
): Promise<PostTestStudyNextBundle | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  let nextPathwayLesson: { id: string; title: string } | null = null;
  let anchorNorm: string;
  let topicCode: string | null;

  if (ctx.variant === "pathway") {
    anchorNorm = normalizeTopicKey(ctx.topicSlug);
    topicCode = ctx.topicSlug.trim() || null;
    nextPathwayLesson = await findNextPathwayLessonInAppOrder(ctx.pathwayId, ctx.lessonId, entitlement, learnerPath);
  } else {
    anchorNorm = ctx.anchorNorm;
    topicCode = ctx.topicCode;
  }

  let weakTopics: WeakTopicRow[] = [];
  try {
    const perf = await loadUnifiedTopicPerformance(userId, entitlement, 8);
    weakTopics = perf.weakTopics;
  } catch {
    weakTopics = [];
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tier: true, alliedProfessionKey: true },
  });
  if (user?.tier === TierCode.ALLIED && user.alliedProfessionKey) {
    const ap = getAlliedProfessionByProfessionKey(user.alliedProfessionKey);
    weakTopics = filterWeakTopicsForAlliedProfession(weakTopics, ap);
  }

  const filtered = weakTopics.filter((w) => !weakOverlapsCurrentLesson(w, anchorNorm, topicCode));

  const enriched: PostTestRemediationInputRow[] = [];
  for (const w of filtered.slice(0, 8)) {
    const topicLabel = formatTopicLabelForDisplay(w.normalizedTopic ?? normalizeTopicKey(w.topic));
    const code = w.normalizedTopic ?? normalizeTopicKey(w.topic);
    const { lessonHref, qbankHref } = await resolveTopicRemediationLinks(code, topicLabel);
    enriched.push({
      topicLabel,
      topicCode: code,
      missCount: Math.max(1, w.missed ?? 1),
      lessonHref,
      qbankHref,
    });
  }

  return recommendNextActionsForLessonContinue({
    currentLessonId: ctx.lessonId,
    nextPathwayLesson,
    weakRows: enriched,
  });
}
