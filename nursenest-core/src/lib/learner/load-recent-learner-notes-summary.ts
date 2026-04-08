import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { hrefForLearnerNote, labelForLearnerNoteScope } from "@/lib/learner/learner-note-href";
import type { RecentLearnerNoteSummary } from "@/components/student/premium-learner-hub";

const DEFAULT_TAKE = 8;

/** Recent note titles + deep links for the learner dashboard (subscriber-only callers). */
export async function loadRecentLearnerNotesSummary(userId: string, take = DEFAULT_TAKE): Promise<RecentLearnerNoteSummary[]> {
  if (!userId || !isDatabaseUrlConfigured()) return [];
  try {
    const rows = await prisma.learnerNote.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: Math.min(20, Math.max(1, take)),
      select: { scope: true, contextId: true, title: true, updatedAt: true },
    });
    return rows.map((r) => ({
      scope: r.scope,
      contextId: r.contextId,
      title: r.title,
      updatedAt: r.updatedAt.toISOString(),
      href: hrefForLearnerNote(r.scope, r.contextId),
      scopeLabel: labelForLearnerNoteScope(r.scope),
    }));
  } catch {
    return [];
  }
}
