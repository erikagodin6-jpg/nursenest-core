"use server";

/**
 * Exam Plan — Server Actions
 *
 * Lazy-loaded data for secondary dashboard sections.
 * Called from ExamPlanLazyClient after initial page paint.
 *
 * All queries are bounded — no full history loads.
 */

import { auth } from "@/lib/auth";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { loadRecentLearnerNotesSummary } from "@/lib/learner/load-recent-learner-notes-summary";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import type { SavedNotePreview } from "@/components/study/saved-for-review-section";
import type { TrendPoint } from "@/components/study/progress-trend-card";

// ── Auth helper ───────────────────────────────────────────────────────────────

async function getAuthenticatedUserId(): Promise<string | null> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  const entitlement = await resolveEntitlement(userId);
  if (!entitlement.hasAccess) return null;
  return userId;
}

// ── Notes preview ─────────────────────────────────────────────────────────────

/**
 * Loads up to 6 recent notes/bookmarks for the "Saved for Review" section.
 * Returns mapped SavedNotePreview items.
 */
export async function loadExamPlanNotesAction(): Promise<SavedNotePreview[]> {
  const userId = await getAuthenticatedUserId();
  if (!userId) return [];

  try {
    const notes = await loadRecentLearnerNotesSummary(userId, 6);
    return notes.map((n) => ({
      title: n.title,
      scopeLabel: n.scopeLabel,
      href: n.href,
      updatedAt: n.updatedAt,
      isBookmark: n.contextId?.startsWith("bk:") ?? false,
      isSavedRationale: n.contextId?.startsWith("rationale:") ?? false,
    }));
  } catch {
    return [];
  }
}

// ── Progress trend ────────────────────────────────────────────────────────────

/**
 * Loads the last 6 completed CAT/practice tests with readiness scores.
 * Used for the ProgressTrendCard sparkline. Returns up to 5 data points.
 */
export async function loadExamPlanTrendAction(): Promise<TrendPoint[]> {
  const userId = await getAuthenticatedUserId();
  if (!userId || !isDatabaseUrlConfigured()) return [];

  try {
    const rows = await prisma.practiceTest.findMany({
      where: { userId, status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
      take: 8,
      select: { results: true, completedAt: true },
    });

    const points: TrendPoint[] = [];

    for (const row of rows) {
      if (!row.completedAt) continue;
      const res = row.results as Record<string, unknown> | null;
      if (!res) continue;

      // Try catReport.readinessScore first (CAT sessions)
      const catReport = res.catReport as Record<string, unknown> | undefined;
      const catScore =
        typeof catReport?.readinessScore === "number" ? catReport.readinessScore : null;

      // Fallback: top-level readinessScore field
      const topScore =
        typeof res.readinessScore === "number" ? res.readinessScore : null;

      const score = catScore ?? topScore;
      if (score == null || score <= 0) continue;

      const label = row.completedAt.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });

      points.push({ score, label });
      if (points.length >= 5) break;
    }

    return points.reverse(); // chronological order
  } catch {
    return [];
  }
}
