import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { recommendNextActions } from "@/lib/learner/recommend-next-actions";
import { attachModes, filterSuppressed, reorderForAfterActivity } from "@/lib/learner/smart-study-next-helpers";
import type { StudyNextRecommendation } from "@/lib/learner/study-next-types";
import { coerceSafeLearnerNavHref } from "@/lib/learner/safe-app-href";
import { loadWithLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache.server";
import { DASHBOARD_ANALYTICS_TTL_SECONDS } from "@/lib/cache/learner-private-read-cache-keying";

const SUPPRESS_LESSON_TAKE = 8;
const SUPPRESS_FC_SESSION_TAKE = 5;
const WEAK_AREAS_HREF = "/app/flashcards/weak-areas";

/**
 * Recent lesson + flashcard touchpoints so we do not recommend the exact same destinations on repeat.
 * Uses `react` `cache()` per request to avoid duplicate reads from layout + page.
 */
async function loadRecentRecommendationSuppressionsImpl(userId: string): Promise<{ hrefs: string[] }> {
  if (!userId || !isDatabaseUrlConfigured()) return { hrefs: [] };

  const hrefs: string[] = [];
  const since = new Date(Date.now() - 36 * 3600 * 1000);

  const [progressRows, fcSessions] = await Promise.all([
    prisma.progress.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: SUPPRESS_LESSON_TAKE,
      select: { lessonId: true },
    }),
    prisma.flashcardStudySession.findMany({
      where: { userId, updatedAt: { gte: since } },
      orderBy: { updatedAt: "desc" },
      take: SUPPRESS_FC_SESSION_TAKE,
      select: { deck: { select: { slug: true } } },
    }),
  ]);

  for (const p of progressRows) {
    hrefs.push(`/app/lessons/${p.lessonId}`);
  }
  for (const s of fcSessions) {
    if (s.deck?.slug) {
      hrefs.push(`/app/flashcards/${encodeURIComponent(s.deck.slug)}`);
    }
  }
  hrefs.push(WEAK_AREAS_HREF);

  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const h of hrefs) {
    if (seen.has(h)) continue;
    seen.add(h);
    deduped.push(h);
  }
  return { hrefs: deduped };
}

export const loadRecentRecommendationSuppressions = cache(loadRecentRecommendationSuppressionsImpl);

async function buildSmartStudyNextRecommendationsUncached(
  userId: string,
  snapshot: LearnerStudySnapshot,
  opts?: {
    maxTotal?: number;
    afterActivity?: “lesson” | “quiz” | “flashcards” | “practice_test” | “blog”;
    suppressHrefs?: string[];
  },
): Promise<StudyNextRecommendation[]> {
  const maxTotal = Math.min(5, Math.max(1, opts?.maxTotal ?? 3));
  const base = recommendNextActions(snapshot, { maxTotal: 6 });
  const { hrefs } = await loadRecentRecommendationSuppressions(userId);
  const suppressed = [...hrefs, ...(opts?.suppressHrefs ?? [])];
  let filtered = filterSuppressed(base, suppressed);
  filtered = reorderForAfterActivity(filtered, opts?.afterActivity);
  const seen = new Set<string>();
  const out: StudyNextRecommendation[] = [];
  const pushSanitized = (recs: StudyNextRecommendation[]) => {
    for (const r of recs) {
      const href = coerceSafeLearnerNavHref(r.href);
      if (seen.has(href)) continue;
      seen.add(href);
      out.push({ ...r, href });
      if (out.length >= maxTotal) break;
    }
  };
  pushSanitized(filtered);
  if (out.length === 0) {
    pushSanitized(recommendNextActions(snapshot, { maxTotal: Math.min(5, maxTotal + 2) }));
  }
  return attachModes(out);
}

/**
 * Smart “Study next” list — 15-minute cached.
 *
 * Recommendations are derived from the study snapshot (which is itself cached)
 * and a suppression list. Caching here removes a DB round-trip and the
 * recommendation scoring work from every dashboard load.
 *
 * Bypass: when `afterActivity` is set (post-answer context) we skip the cache
 * so the learner gets fresh recs after completing an activity.
 *
 * Invalidated by `invalidateLearnerPrivateReadCache(userId, [“study-plan-summary”])`.
 */
export async function buildSmartStudyNextRecommendations(
  userId: string,
  snapshot: LearnerStudySnapshot,
  opts?: {
    maxTotal?: number;
    afterActivity?: “lesson” | “quiz” | “flashcards” | “practice_test” | “blog”;
    suppressHrefs?: string[];
  },
): Promise<StudyNextRecommendation[]> {
  // After an activity the learner should see fresh recs — bypass the cache.
  const bypassCache = Boolean(opts?.afterActivity);

  return loadWithLearnerPrivateReadCache(
    {
      surface: “study-plan-summary”,
      userId,
      ttlSeconds: DASHBOARD_ANALYTICS_TTL_SECONDS,
      keyParts: [opts?.maxTotal ?? 3, snapshot.weakTopics.slice(0, 3).map((w) => w.topic)],
      bypass: bypassCache,
    },
    () => buildSmartStudyNextRecommendationsUncached(userId, snapshot, opts),
  );
}
