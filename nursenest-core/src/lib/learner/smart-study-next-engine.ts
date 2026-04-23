import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { recommendNextActions } from "@/lib/learner/recommend-next-actions";
import { attachModes, filterSuppressed, reorderForAfterActivity } from "@/lib/learner/smart-study-next-helpers";
import type { StudyNextRecommendation } from "@/lib/learner/study-next-types";

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

/**
 * Smart “Study next” list: base deterministic recs + anti-repeat filters + optional activity-aware ordering + modes.
 * Tier/pathway safety stays in {@link buildLearnerStudySnapshot} / remediation link resolvers — not relaxed here.
 */
export async function buildSmartStudyNextRecommendations(
  userId: string,
  snapshot: LearnerStudySnapshot,
  opts?: {
    maxTotal?: number;
    afterActivity?: "lesson" | "quiz" | "flashcards" | "practice_test" | "blog";
    /** Extra hrefs to skip (e.g. current page). */
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
  for (const r of filtered) {
    if (seen.has(r.href)) continue;
    seen.add(r.href);
    out.push(r);
    if (out.length >= maxTotal) break;
  }
  if (out.length === 0) {
    return attachModes(recommendNextActions(snapshot, { maxTotal: Math.min(5, maxTotal + 2) }));
  }
  return attachModes(out);
}
