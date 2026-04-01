import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { classifyPathwayLesson } from "@/lib/content-quality/classify-lesson";
import { classifyContentItemLesson } from "@/lib/content-quality/classify-lesson";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import type { ContentQualityTier } from "@/lib/content-quality/standards";

export type CorpusPathwayRollup = {
  pathwayId: string;
  countryCode: string | null;
  tier: string | null;
  total: number;
  missing: number;
  thin: number;
  acceptable: number;
  strong: number;
};

export type CorpusExamRollup = {
  exam: string;
  missing: number;
  thin: number;
  acceptable: number;
  strong: number;
  total: number;
};

export type ContentQualityCorpusPayload = {
  generatedAt: string;
  meta: {
    available: boolean;
    reason?: string;
  };
  pathwayLessons: {
    totals: Record<ContentQualityTier, number>;
    byPathway: CorpusPathwayRollup[];
    scanned: number;
  };
  contentItemLessons: {
    totals: Record<ContentQualityTier, number>;
    scanned: number;
  };
  examQuestions: {
    totals: Record<ContentQualityTier, number>;
    worstExams: CorpusExamRollup[];
    scanned: number;
  };
};

const BATCH = 400;

function emptyTierTotals(): Record<ContentQualityTier, number> {
  return { missing: 0, thin: 0, acceptable: 0, strong: 0 };
}

export function emptyContentQualityCorpusPayload(reason = "data_unavailable"): ContentQualityCorpusPayload {
  return {
    generatedAt: new Date().toISOString(),
    meta: { available: false, reason },
    pathwayLessons: { totals: emptyTierTotals(), byPathway: [], scanned: 0 },
    contentItemLessons: { totals: emptyTierTotals(), scanned: 0 },
    examQuestions: { totals: emptyTierTotals(), worstExams: [], scanned: 0 },
  };
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function safeTierTotals(t: unknown): Record<ContentQualityTier, number> {
  const out = emptyTierTotals();
  if (!isRecord(t)) return out;
  for (const k of ["missing", "thin", "acceptable", "strong"] as const) {
    const v = t[k];
    if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
  }
  return out;
}

/**
 * Validates JSON from DB so admin UI never spreads a malformed snapshot.
 */
export function coerceCorpusPayload(raw: unknown): ContentQualityCorpusPayload {
  if (!isRecord(raw) || typeof raw.generatedAt !== "string") {
    return emptyContentQualityCorpusPayload("invalid_snapshot_shape");
  }
  const fallback = emptyContentQualityCorpusPayload("corrupt_snapshot_sections");
  const pl = raw.pathwayLessons;
  const ci = raw.contentItemLessons;
  const eq = raw.examQuestions;
  if (!isRecord(pl) || !isRecord(ci) || !isRecord(eq)) return fallback;

  const meta = isRecord(raw.meta) && typeof raw.meta.available === "boolean"
    ? {
        available: raw.meta.available,
        ...(typeof raw.meta.reason === "string" ? { reason: raw.meta.reason } : {}),
      }
    : { available: false, reason: "snapshot_meta_missing" as const };

  const byPathway: CorpusPathwayRollup[] = Array.isArray(pl.byPathway)
    ? (pl.byPathway as unknown[]).filter((r): r is CorpusPathwayRollup => {
        if (!isRecord(r)) return false;
        return typeof r.pathwayId === "string" && typeof r.total === "number";
      })
    : [];

  const worstExams: CorpusExamRollup[] = Array.isArray(eq.worstExams)
    ? (eq.worstExams as unknown[]).filter((r): r is CorpusExamRollup => {
        if (!isRecord(r)) return false;
        return typeof r.exam === "string" && typeof r.total === "number";
      })
    : [];

  return {
    generatedAt: raw.generatedAt,
    meta,
    pathwayLessons: {
      totals: safeTierTotals(pl.totals),
      byPathway,
      scanned: typeof pl.scanned === "number" ? pl.scanned : 0,
    },
    contentItemLessons: {
      totals: safeTierTotals(ci.totals),
      scanned: typeof ci.scanned === "number" ? ci.scanned : 0,
    },
    examQuestions: {
      totals: safeTierTotals(eq.totals),
      worstExams,
      scanned: typeof eq.scanned === "number" ? eq.scanned : 0,
    },
  };
}

export async function refreshContentQualityCorpusSnapshot(): Promise<ContentQualityCorpusPayload> {
  try {
  const pathwayTotals = emptyTierTotals();
  const byPathway = new Map<string, CorpusPathwayRollup>();

  let cursor: string | undefined;
  let scannedPl = 0;
  for (;;) {
    const batch = await prisma.pathwayLesson.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: {
        id: true,
        sections: true,
        pathwayId: true,
        countryCode: true,
        tierCode: true,
      },
      take: BATCH,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { id: "asc" },
    });
    if (batch.length === 0) break;
    cursor = batch[batch.length - 1]!.id;
    scannedPl += batch.length;

    for (const row of batch) {
      let tier: ContentQualityTier;
      try {
        tier = classifyPathwayLesson({ sections: row.sections as PathwayLessonRecord["sections"] }).tier;
      } catch {
        tier = "missing";
      }
      pathwayTotals[tier] += 1;
      const key = `${row.pathwayId}|${row.countryCode ?? "—"}|${row.tierCode ?? "—"}`;
      let r = byPathway.get(key);
      if (!r) {
        r = {
          pathwayId: row.pathwayId,
          countryCode: row.countryCode,
          tier: row.tierCode,
          total: 0,
          missing: 0,
          thin: 0,
          acceptable: 0,
          strong: 0,
        };
        byPathway.set(key, r);
      }
      r.total += 1;
      if (tier === "missing") r.missing += 1;
      else if (tier === "thin") r.thin += 1;
      else if (tier === "acceptable") r.acceptable += 1;
      else r.strong += 1;
    }
  }

  const contentTotals = emptyTierTotals();
  let scannedCi = 0;
  cursor = undefined;
  for (;;) {
    const batch: Array<{ id: string; content: unknown }> = await prisma.contentItem.findMany({
      where: { type: "lesson", status: ContentStatus.PUBLISHED },
      select: { id: true, content: true },
      take: BATCH,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { id: "asc" },
    });
    if (batch.length === 0) break;
    cursor = batch[batch.length - 1]!.id;
    scannedCi += batch.length;
    for (const row of batch) {
      try {
        const q = classifyContentItemLesson(row.content);
        contentTotals[q.tier] += 1;
      } catch {
        contentTotals.missing += 1;
      }
    }
  }

  const examTotals = emptyTierTotals();
  const examAgg = await prisma.$queryRaw<
    {
      exam: string | null;
      total: bigint;
      missing: bigint;
      thin: bigint;
      acceptable: bigint;
      strong: bigint;
    }[]
  >`
    WITH w AS (
      SELECT exam,
        CASE
          WHEN rationale IS NULL OR trim(rationale) = '' THEN 0
          ELSE cardinality(regexp_split_to_array(trim(regexp_replace(rationale, '\\s+', ' ', 'g')), ' '))
        END AS wc
      FROM exam_questions
      WHERE status = 'published'
    )
    SELECT exam,
      COUNT(*)::bigint AS total,
      COUNT(*) FILTER (WHERE wc <= 0)::bigint AS missing,
      COUNT(*) FILTER (WHERE wc > 0 AND wc < 120)::bigint AS thin,
      COUNT(*) FILTER (WHERE wc >= 120 AND wc < 160)::bigint AS acceptable,
      COUNT(*) FILTER (WHERE wc >= 160)::bigint AS strong
    FROM w
    GROUP BY exam
  `;
  const byExam = new Map<string, { missing: number; thin: number; acceptable: number; strong: number; total: number }>();
  let scannedEq = 0;
  for (const row of examAgg) {
    scannedEq += Number(row.total);
    examTotals.missing += Number(row.missing);
    examTotals.thin += Number(row.thin);
    examTotals.acceptable += Number(row.acceptable);
    examTotals.strong += Number(row.strong);
    const ex = row.exam ?? "—";
    byExam.set(ex, {
      missing: Number(row.missing),
      thin: Number(row.thin),
      acceptable: Number(row.acceptable),
      strong: Number(row.strong),
      total: Number(row.total),
    });
  }

  const worstExams: CorpusExamRollup[] = [...byExam.entries()]
    .map(([exam, v]) => ({ exam, ...v }))
    .sort((a, b) => b.thin + b.missing - (a.thin + a.missing) || b.total - a.total)
    .slice(0, 25);

  const payload: ContentQualityCorpusPayload = {
    generatedAt: new Date().toISOString(),
    meta: { available: true },
    pathwayLessons: {
      totals: pathwayTotals,
      byPathway: [...byPathway.values()].sort((a, b) => b.thin + b.missing - (a.thin + a.missing)),
      scanned: scannedPl,
    },
    contentItemLessons: {
      totals: contentTotals,
      scanned: scannedCi,
    },
    examQuestions: {
      totals: examTotals,
      worstExams,
      scanned: scannedEq,
    },
  };

  await prisma.contentQualityCorpusSnapshot.upsert({
    where: { id: "default" },
    create: { id: "default", payload: payload as object },
    update: { payload: payload as object },
  });

  return payload;
  } catch {
    return emptyContentQualityCorpusPayload("refresh_failed");
  }
}

export async function loadContentQualityCorpusPayload(): Promise<ContentQualityCorpusPayload> {
  try {
    const row = await prisma.contentQualityCorpusSnapshot.findUnique({ where: { id: "default" } });
    if (!row?.payload || typeof row.payload !== "object") {
      return emptyContentQualityCorpusPayload("snapshot_missing");
    }
    return coerceCorpusPayload(row.payload);
  } catch {
    return emptyContentQualityCorpusPayload("load_failed");
  }
}
