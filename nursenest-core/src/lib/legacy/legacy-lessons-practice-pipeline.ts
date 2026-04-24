import type { PrismaClient } from "@prisma/client";

import { auditLegacyExamQuestions, applyLegacyExamQuestionsImport } from "@/lib/legacy/legacy-exam-question-apply";
import type {
  LegacyContentExportV2,
  LegacyLessonsPracticeAuditReport,
  LegacyLessonsPracticeImportResult,
  LegacyLessonsPracticePipelineOptions,
  LegacyPracticeTestExportRow,
} from "@/lib/legacy/legacy-lessons-practice-types";
import { toLegacyPublicContentExportV1 } from "@/lib/legacy/legacy-lessons-practice-types";
import type { LegacyChangeLogEntry, LegacyPipelineOptions } from "@/lib/legacy/legacy-public-content-types";
import {
  runLegacyPublicContentAudit,
  runLegacyPublicContentImport,
} from "@/lib/legacy/legacy-public-content-pipeline";

const PRACTICE_TEST_SCAN = 400;

function parsePracticeTestQuestionIds(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((x): x is string => typeof x === "string");
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw) as unknown;
      return Array.isArray(p) ? p.filter((x): x is string => typeof x === "string") : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function auditLegacyExportPracticeTests(
  prisma: PrismaClient,
  rows: LegacyPracticeTestExportRow[],
): Promise<{ exportPracticeTestsWithMissingQuestions: number }> {
  let exportPracticeTestsWithMissingQuestions = 0;
  for (const pt of rows) {
    let anyMissing = false;
    for (const qid of (pt.questionLegacyIds ?? []).slice(0, 200)) {
      const hit = await prisma.examQuestion.findUnique({ where: { id: qid }, select: { id: true } });
      if (!hit) anyMissing = true;
    }
    if (anyMissing) exportPracticeTestsWithMissingQuestions += 1;
  }
  return { exportPracticeTestsWithMissingQuestions };
}

/**
 * Bounded scan of recent `practice_tests` rows: flags sessions referencing fewer than five
 * resolved `exam_questions` when the session lists at least eight ids (stale/abandoned picks).
 */
async function auditDbPracticeTestsSparse(prisma: PrismaClient): Promise<{
  dbPracticeTestsWithTooFewQuestions: number;
  dbPracticeTestsScanned: number;
}> {
  const rows = await prisma.practiceTest.findMany({
    take: PRACTICE_TEST_SCAN,
    orderBy: { updatedAt: "desc" },
    select: { questionIds: true },
  });
  const allIds: string[] = [];
  for (const r of rows) {
    allIds.push(...parsePracticeTestQuestionIds(r.questionIds).slice(0, 120));
  }
  const unique = [...new Set(allIds)].slice(0, 3500);
  const foundRows =
    unique.length > 0
      ? await prisma.examQuestion.findMany({ where: { id: { in: unique } }, select: { id: true } })
      : [];
  const found = new Set(foundRows.map((x) => x.id));
  let dbPracticeTestsWithTooFewQuestions = 0;
  for (const r of rows) {
    const ids = parsePracticeTestQuestionIds(r.questionIds);
    if (ids.length < 8) continue;
    const resolved = ids.filter((id) => found.has(id)).length;
    if (resolved < 5) dbPracticeTestsWithTooFewQuestions += 1;
  }
  return { dbPracticeTestsWithTooFewQuestions, dbPracticeTestsScanned: rows.length };
}

export async function runLegacyLessonsPracticeAudit(
  prisma: PrismaClient,
  v2: LegacyContentExportV2,
): Promise<LegacyLessonsPracticeAuditReport> {
  const [lessons, qAudit, exportPt, dbPt] = await Promise.all([
    runLegacyPublicContentAudit(prisma, toLegacyPublicContentExportV1(v2)),
    auditLegacyExamQuestions(prisma, v2.questions ?? []),
    auditLegacyExportPracticeTests(prisma, v2.practiceTests ?? []),
    auditDbPracticeTestsSparse(prisma),
  ]);
  return {
    lessons,
    ...qAudit,
    ...exportPt,
    ...dbPt,
  };
}

export async function runLegacyLessonsPracticeImport(
  prisma: PrismaClient,
  v2: LegacyContentExportV2,
  opts: LegacyLessonsPracticePipelineOptions,
): Promise<LegacyLessonsPracticeImportResult> {
  const lessonOpts: LegacyPipelineOptions = {
    apply: opts.apply,
    overwriteBody: opts.overwriteBody,
    allowPathwayCorrection: opts.allowPathwayCorrection,
    allowCreateMissingLessons: opts.allowCreateMissingLessons,
  };
  const lessonRes = await runLegacyPublicContentImport(prisma, toLegacyPublicContentExportV1(v2), lessonOpts);
  const combined: LegacyChangeLogEntry[] = [...lessonRes.changes];
  const logChange = (e: LegacyChangeLogEntry) => {
    combined.push(e);
    console.log(JSON.stringify({ legacy_lessons_practice_change: e }));
  };
  const qErrors = await applyLegacyExamQuestionsImport(prisma, v2.questions, {
    apply: opts.apply,
    overwriteRationale: opts.overwriteRationale,
  }, logChange);
  const audit = await runLegacyLessonsPracticeAudit(prisma, v2);
  return {
    dryRun: !opts.apply,
    changes: combined,
    errors: [...lessonRes.errors, ...qErrors],
    audit,
  };
}
