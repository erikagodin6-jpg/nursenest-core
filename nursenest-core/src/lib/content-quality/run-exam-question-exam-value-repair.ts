import type { PrismaClient } from "@prisma/client";
import {
  normalizeExamQuestionExamForStorage,
  orderExamQuestionExamRewritesForBackfill,
} from "@/lib/content-quality/exam-question-exam-normalization";

export type ExamQuestionExamCountRow = { exam: string; c: bigint };

export async function loadExamQuestionExamDistribution(prisma: PrismaClient): Promise<ExamQuestionExamCountRow[]> {
  return prisma.$queryRaw<ExamQuestionExamCountRow[]>`
    SELECT exam, COUNT(*)::bigint AS c
    FROM exam_questions
    GROUP BY exam
    ORDER BY c DESC
  `;
}

export type ExamQuestionExamRepairPlanRow = { from: string; to: string; n: bigint };

export async function buildExamQuestionExamRepairPlan(prisma: PrismaClient): Promise<ExamQuestionExamRepairPlanRow[]> {
  const distinct = await prisma.$queryRaw<{ exam: string }[]>`
    SELECT DISTINCT exam FROM exam_questions
    WHERE exam IS NOT NULL AND trim(exam) <> ''
    ORDER BY exam
  `;

  const plan: ExamQuestionExamRepairPlanRow[] = [];
  for (const { exam } of distinct) {
    const to = normalizeExamQuestionExamForStorage(exam);
    if (!to || to === exam) continue;
    const [{ c }] = await prisma.$queryRaw<{ c: bigint }[]>`
      SELECT COUNT(*)::bigint AS c FROM exam_questions WHERE exam = ${exam}
    `;
    if (c > 0n) plan.push({ from: exam, to, n: c });
  }

  return orderExamQuestionExamRewritesForBackfill(plan);
}

export type RunExamQuestionExamValueRepairOptions = {
  prisma: PrismaClient;
  /** When false, only returns plan + counts; no DB writes. */
  execute: boolean;
};

export type RunExamQuestionExamValueRepairResult = {
  plan: ExamQuestionExamRepairPlanRow[];
  totalRowsTouched: number;
  before: ExamQuestionExamCountRow[];
  after: ExamQuestionExamCountRow[];
};

export async function runExamQuestionExamValueRepair(
  opts: RunExamQuestionExamValueRepairOptions,
): Promise<RunExamQuestionExamValueRepairResult> {
  const { prisma, execute } = opts;
  const before = await loadExamQuestionExamDistribution(prisma);
  const plan = await buildExamQuestionExamRepairPlan(prisma);

  let totalRowsTouched = 0;
  if (execute) {
    for (const p of plan) {
      const r = await prisma.examQuestion.updateMany({ where: { exam: p.from }, data: { exam: p.to } });
      totalRowsTouched += r.count;
    }
  } else {
    for (const p of plan) {
      totalRowsTouched += Number(p.n);
    }
  }

  const after = execute ? await loadExamQuestionExamDistribution(prisma) : before;
  return { plan, totalRowsTouched, before, after };
}
