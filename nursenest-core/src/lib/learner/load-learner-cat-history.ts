import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { parsePracticeTestConfigAtBoundary } from "@/lib/practice-tests/practice-test-config-boundary";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";

export type LearnerCatHistoryRow = {
  id: string;
  title: string | null;
  status: string;
  accuracyPct: number | null;
  completedAt: string | null;
  updatedAt: string;
  href: string;
  /** Ability estimate when CAT results include it */
  estimatedAbility: number | null;
  /** Short CAT outcome label when present */
  catDecision: string | null;
};

function parseConfig(raw: unknown): PracticeTestConfigJson | null {
  if (!raw || typeof raw !== "object") return null;
  const cfg = parsePracticeTestConfigAtBoundary(raw, { surface: "learner_cat_history" });
  return cfg.selectionMode === "cat" ? cfg : null;
}

function parseResults(raw: unknown): PracticeTestResultsJson | null {
  if (!raw || typeof raw !== "object") return null;
  return raw as PracticeTestResultsJson;
}

/**
 * CAT (computer-adaptive) practice tests for `/app/account/cat-history` (server-only).
 */
export async function loadLearnerCatHistory(userId: string, take = 40): Promise<LearnerCatHistoryRow[]> {
  if (!userId || !isDatabaseUrlConfigured()) return [];

  try {
    const rows = await prisma.practiceTest.findMany({
      where: {
        userId,
        config: { path: ["selectionMode"], equals: "cat" },
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      take: Math.min(take, 12),
      select: {
        id: true,
        title: true,
        status: true,
        results: true,
        config: true,
        updatedAt: true,
        completedAt: true,
      },
    });

    const out: LearnerCatHistoryRow[] = [];
    for (const r of rows) {
      const cfg = parseConfig(r.config);
      if (!cfg) continue;
      const res = parseResults(r.results);
      const accuracyPct = res?.accuracyPct ?? null;
      const catDecision = res?.catReport?.decision?.trim() || null;
      out.push({
        id: r.id,
        title: r.title,
        status: r.status,
        accuracyPct,
        completedAt: r.completedAt?.toISOString() ?? null,
        updatedAt: r.updatedAt.toISOString(),
        href: `/app/practice-tests/${r.id}`,
        estimatedAbility: res?.estimatedAbility ?? null,
        catDecision,
      });
    }
    return out;
  } catch {
    return [];
  }
}
