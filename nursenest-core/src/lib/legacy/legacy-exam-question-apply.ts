import { randomUUID } from "node:crypto";

import type { PrismaClient } from "@prisma/client";

import type { LegacyChangeLogEntry } from "@/lib/legacy/legacy-public-content-types";
import {
  buildExamQuestionCreateData,
  buildExamQuestionPatchFromLegacy,
  existingExamQuestionMatchesPathwayScope,
  legacyQuestionStemHash,
  resolveExamQuestionScope,
} from "@/lib/legacy/legacy-exam-question-merge";
import type { LegacyExamQuestionExportRow } from "@/lib/legacy/legacy-lessons-practice-types";

const EXISTING_SELECT = {
  id: true,
  stem: true,
  exam: true,
  tier: true,
  regionScope: true,
  rationale: true,
  options: true,
  correctAnswer: true,
  questionType: true,
  difficulty: true,
  topic: true,
  bodySystem: true,
  status: true,
} as const;

export async function auditLegacyExamQuestions(
  prisma: PrismaClient,
  rows: LegacyExamQuestionExportRow[],
): Promise<{
  legacyQuestionsFound: number;
  currentQuestionsMatchedById: number;
  currentQuestionsMatchedByStemHash: number;
  currentQuestionsMissing: number;
  duplicateQuestionCandidatesInExport: number;
  questionsCrossScopeRejected: number;
  questionsByPathway: Record<string, number>;
  questionsByBodySystem: Record<string, number>;
  questionsByType: Record<string, number>;
  questionsByStatus: Record<string, number>;
}> {
  const out = {
    legacyQuestionsFound: rows.length,
    currentQuestionsMatchedById: 0,
    currentQuestionsMatchedByStemHash: 0,
    currentQuestionsMissing: 0,
    duplicateQuestionCandidatesInExport: 0,
    questionsCrossScopeRejected: 0,
    questionsByPathway: {} as Record<string, number>,
    questionsByBodySystem: {} as Record<string, number>,
    questionsByType: {} as Record<string, number>,
    questionsByStatus: {} as Record<string, number>,
  };

  const seenHashes = new Map<string, number>();
  let exportIndex = 0;
  for (const row of rows) {
    const scope = resolveExamQuestionScope(row.pathwayId, row.exam, row.tier);
    if ("error" in scope) {
      out.questionsCrossScopeRejected += 1;
      continue;
    }
    out.questionsByPathway[row.pathwayId] = (out.questionsByPathway[row.pathwayId] ?? 0) + 1;
    const bs = row.bodySystem?.trim() || "(none)";
    out.questionsByBodySystem[bs] = (out.questionsByBodySystem[bs] ?? 0) + 1;
    const qt = row.questionType?.trim() || "MCQ";
    out.questionsByType[qt] = (out.questionsByType[qt] ?? 0) + 1;
    const st = row.status?.trim() || row.access || "draft";
    out.questionsByStatus[String(st)] = (out.questionsByStatus[String(st)] ?? 0) + 1;

    const h = legacyQuestionStemHash(row);
    const first = seenHashes.get(h);
    if (first !== undefined) out.duplicateQuestionCandidatesInExport += 1;
    else seenHashes.set(h, exportIndex);
    exportIndex += 1;

    let matched = false;
    if (row.legacyId?.trim()) {
      const hit = await prisma.examQuestion.findUnique({
        where: { id: row.legacyId.trim() },
        select: { id: true, exam: true, tier: true },
      });
      if (hit && existingExamQuestionMatchesPathwayScope(row.pathwayId, hit.exam, hit.tier)) {
        out.currentQuestionsMatchedById += 1;
        matched = true;
      } else if (hit) {
        out.questionsCrossScopeRejected += 1;
        matched = true;
      }
    }
    if (matched) continue;

    const byHash = await prisma.examQuestion.findFirst({
      where: { stemHash: h },
      select: { id: true, exam: true, tier: true },
    });
    if (byHash) {
      if (existingExamQuestionMatchesPathwayScope(row.pathwayId, byHash.exam, byHash.tier)) {
        out.currentQuestionsMatchedByStemHash += 1;
      } else {
        out.questionsCrossScopeRejected += 1;
      }
    } else {
      out.currentQuestionsMissing += 1;
    }
  }

  return out;
}

export async function applyLegacyExamQuestionsImport(
  prisma: PrismaClient,
  rows: LegacyExamQuestionExportRow[] | undefined,
  opts: { apply: boolean; overwriteRationale: boolean },
  logChange: (e: LegacyChangeLogEntry) => void,
): Promise<string[]> {
  const errors: string[] = [];
  for (const row of rows ?? []) {
    const scope = resolveExamQuestionScope(row.pathwayId, row.exam, row.tier);
    if ("error" in scope) {
      errors.push(scope.error);
      continue;
    }

    let existing = null as null | Awaited<ReturnType<typeof prisma.examQuestion.findUnique>>;
    if (row.legacyId?.trim()) {
      existing = await prisma.examQuestion.findUnique({
        where: { id: row.legacyId.trim() },
        select: EXISTING_SELECT,
      });
      if (existing && !existingExamQuestionMatchesPathwayScope(row.pathwayId, existing.exam, existing.tier)) {
        errors.push(`question_scope_mismatch_id:${row.legacyId}`);
        continue;
      }
    }
    if (!existing) {
      const h = legacyQuestionStemHash(row);
      const cand = await prisma.examQuestion.findFirst({
        where: { stemHash: h },
        select: EXISTING_SELECT,
      });
      if (cand) {
        if (!existingExamQuestionMatchesPathwayScope(row.pathwayId, cand.exam, cand.tier)) {
          errors.push(`question_stem_hash_cross_pool:${h}`);
          continue;
        }
        existing = cand;
      }
    }

    if (existing) {
      const patch = buildExamQuestionPatchFromLegacy(row, scope, existing, {
        overwriteRationale: opts.overwriteRationale,
      });
      if ("skip" in patch) {
        if (patch.reason !== "no_changes") {
          errors.push(`question_skip:${existing.id}:${patch.reason}`);
        }
        continue;
      }
      if (opts.apply) {
        await prisma.examQuestion.update({ where: { id: existing.id }, data: patch.data });
        const afterRow = await prisma.examQuestion.findUnique({
          where: { id: existing.id },
          select: EXISTING_SELECT,
        });
        logChange({
          entity: "exam_question",
          id: existing.id,
          action: "update",
          before: { ...existing } as Record<string, unknown>,
          after: { ...(afterRow as Record<string, unknown>), notes: patch.notes },
        });
      } else {
        logChange({
          entity: "exam_question",
          id: existing.id,
          action: "update",
          before: { ...existing } as Record<string, unknown>,
          after: { ...existing, ...patch.data, notes: patch.notes } as Record<string, unknown>,
        });
      }
      continue;
    }

    const created = buildExamQuestionCreateData(row, scope, randomUUID());
    if ("error" in created) {
      errors.push(`question_create_invalid:${created.error}`);
      continue;
    }
    if (opts.apply) {
      const row2 = await prisma.examQuestion.create({ data: created.data });
      logChange({
        entity: "exam_question",
        id: row2.id,
        action: "create",
        before: {},
        after: { id: row2.id, pathwayId: row.pathwayId, exam: scope.exam, tier: scope.tier },
      });
    } else {
      logChange({
        entity: "exam_question",
        id: "(dry-run)",
        action: "create",
        before: {},
        after: { pathwayId: row.pathwayId, exam: scope.exam, tier: scope.tier, stemPreview: row.stem.slice(0, 80) },
      });
    }
  }
  return errors;
}
