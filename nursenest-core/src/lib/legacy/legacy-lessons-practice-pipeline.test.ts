import assert from "node:assert/strict";
import test from "node:test";

import type { PrismaClient } from "@prisma/client";

import type { LegacyContentExportV2 } from "@/lib/legacy/legacy-lessons-practice-types";
import { runLegacyLessonsPracticeAudit, runLegacyLessonsPracticeImport } from "@/lib/legacy/legacy-lessons-practice-pipeline";

const pathwayId = "ca-rn-nclex-rn";

const questionPayload: LegacyContentExportV2 = {
  version: 2,
  lessons: [],
  questions: [
    {
      pathwayId,
      legacyId: "eq-legacy-1",
      stem: "Stem for pipeline test question?",
      options: ["Opt A", "Opt B", "Opt C"],
      correctAnswer: ["Opt B"],
      questionType: "MCQ",
      rationale: "Because B is correct.",
      topic: "Safety",
      bodySystem: "general",
      status: "published",
    },
  ],
};

const existingQuestion = {
  id: "eq-legacy-1",
  stem: "Old stem",
  exam: "NCLEX-RN",
  tier: "rn",
  regionScope: "CA_ONLY",
  rationale: "Old rat",
  options: ["Opt A", "Opt B", "Opt C"],
  correctAnswer: ["Opt A"],
  questionType: "multiple_choice",
  difficulty: 2,
  topic: "X",
  bodySystem: "general",
  status: "draft",
};

function basePrismaExamMock() {
  return {
    pathwayLesson: {
      findUnique: async () => null,
      update: async () => ({}),
      create: async () => ({ id: "x" }),
    },
    flashcardTag: { findUnique: async () => null, create: async () => ({ id: "t" }) },
    flashcardDeck: { findFirst: async () => null, update: async () => ({}) },
    flashcardDeckOnTag: { findUnique: async () => null, create: async () => ({}) },
    practiceTest: { findMany: async () => [] },
  };
}

test("combined dry-run performs no prisma examQuestion updates", async () => {
  let updates = 0;
  const prisma = {
    ...basePrismaExamMock(),
    examQuestion: {
      findUnique: async (args: { where: { id?: string } }) => {
        if (args.where.id === "eq-legacy-1") return { ...existingQuestion };
        return null;
      },
      findFirst: async () => null,
      findMany: async () => [],
      update: async () => {
        updates += 1;
        return {};
      },
      create: async () => {
        throw new Error("should not create");
      },
    },
  } as unknown as PrismaClient;

  await runLegacyLessonsPracticeImport(prisma, questionPayload, {
    apply: false,
    overwriteBody: false,
    overwriteRationale: true,
    allowPathwayCorrection: false,
    allowCreateMissingLessons: false,
  });

  assert.equal(updates, 0);
});

test("combined apply calls examQuestion.update when patch non-empty", async () => {
  let updates = 0;
  let snap = { ...existingQuestion };
  const prisma = {
    ...basePrismaExamMock(),
    examQuestion: {
      findUnique: async (args: { where: { id?: string } }) => {
        if (args.where.id === "eq-legacy-1" || args.where.id === snap.id) return { ...snap };
        return null;
      },
      findFirst: async () => null,
      findMany: async () => [],
      update: async (args: { data: Record<string, unknown> }) => {
        updates += 1;
        snap = { ...snap, ...args.data } as typeof snap;
        return {};
      },
      create: async () => {
        throw new Error("should not create");
      },
    },
  } as unknown as PrismaClient;

  await runLegacyLessonsPracticeImport(prisma, questionPayload, {
    apply: true,
    overwriteBody: false,
    overwriteRationale: true,
    allowPathwayCorrection: false,
    allowCreateMissingLessons: false,
  });

  assert.ok(updates >= 1);
});

test("audit counts duplicate stem hashes in export", async () => {
  const prisma = {
    ...basePrismaExamMock(),
    examQuestion: {
      findUnique: async () => null,
      findFirst: async () => null,
      findMany: async () => [],
    },
  } as unknown as PrismaClient;

  const dup: LegacyContentExportV2 = {
    version: 2,
    lessons: [],
    questions: [
      {
        pathwayId,
        stem: "Same stem text",
        options: ["a", "b"],
        correctAnswer: ["a"],
        questionType: "MCQ",
      },
      {
        pathwayId,
        stem: "Same stem text",
        options: ["x", "y"],
        correctAnswer: ["x"],
        questionType: "MCQ",
      },
    ],
  };

  const audit = await runLegacyLessonsPracticeAudit(prisma, dup);
  assert.ok(audit.duplicateQuestionCandidatesInExport >= 1);
});
