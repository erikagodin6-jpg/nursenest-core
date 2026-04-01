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
      const q = classifyPathwayLesson({ sections: row.sections as PathwayLessonRecord["sections"] });
      pathwayTotals[q.tier] += 1;
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
      if (q.tier === "missing") r.missing += 1;
      else if (q.tier === "thin") r.thin += 1;
      else if (q.tier === "acceptable") r.acceptable += 1;
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
      const q = classifyContentItemLesson(row.content);
      contentTotals[q.tier] += 1;
    }
  }

  const examTotals = emptyTierTotals();
  const examRows = await prisma.$queryRaw<
    { exam: string; wc: number }[]
  >`
    SELECT exam,
      CASE
        WHEN rationale IS NULL OR trim(rationale) = '' THEN 0
        ELSE cardinality(regexp_split_to_array(trim(regexp_replace(rationale, '\\s+', ' ', 'g')), ' '))
      END AS wc
    FROM exam_questions
    WHERE status = 'published'
  `;
  const byExam = new Map<string, { missing: number; thin: number; acceptable: number; strong: number; total: number }>();
  for (const row of examRows) {
    const wc = row.wc;
    let tier: keyof typeof examTotals;
    if (wc <= 0) tier = "missing";
    else if (wc < 120) tier = "thin";
    else if (wc < 160) tier = "acceptable";
    else tier = "strong";
    examTotals[tier] += 1;
    const ex = row.exam ?? "—";
    const cur = byExam.get(ex) ?? { missing: 0, thin: 0, acceptable: 0, strong: 0, total: 0 };
    cur.total += 1;
    cur[tier] += 1;
    byExam.set(ex, cur);
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
      scanned: examRows.length,
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

export async function loadContentQualityCorpusPayload(): Promise<ContentQualityCorpusPayload | null> {
  try {
    const row = await prisma.contentQualityCorpusSnapshot.findUnique({ where: { id: "default" } });
    if (!row?.payload || typeof row.payload !== "object") return emptyContentQualityCorpusPayload("snapshot_missing");
    const payload = row.payload as ContentQualityCorpusPayload;
    return {
      ...payload,
      meta: payload.meta?.available === true ? payload.meta : { available: true },
    };
  } catch {
    return emptyContentQualityCorpusPayload("load_failed");
  }
}
