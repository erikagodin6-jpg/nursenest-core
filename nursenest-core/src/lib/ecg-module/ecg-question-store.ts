import "server-only";

import { PracticeQuestionAnswerMode, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  assertNoEcgForRpn,
  normalizeEcgLevel,
  normalizeEcgMode,
  type EcgLevel,
  type EcgMode,
  type EcgRouteKind,
} from "@/lib/ecg-module/ecg-module-config";

type EcgAccess = {
  userId: string;
  mode: "public" | "admin-preview";
  pathwayId: string | null;
} & ({ mode: "public"; tier: "RN" | "NP" } | { mode: "admin-preview"; allowedTiers: ["RN", "NP"] });

type EcgOption = { id: string; text: string };

export type EcgQuestionListItem = {
  id: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  questionText: string;
  options: EcgOption[];
  rationale: string | null;
  rhythmTag: string;
  clinicalPriority: string | null;
  level: EcgLevel;
  mode: EcgMode;
  percentCorrect: number | null;
  commonWrongAnswers: string[];
};

export type EcgAnswerResult = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  correctRhythm: string;
  correctAnswerId: string;
  rationale: string | null;
  percentCorrect: number | null;
  commonWrongAnswers: string[];
};

const MIN_SAMPLE = 1;

function asOptions(value: Prisma.JsonValue): EcgOption[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
      const record = entry as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id.trim() : "";
      const text = typeof record.text === "string" ? record.text.trim() : "";
      return id && text ? { id, text } : null;
    })
    .filter((entry): entry is EcgOption => Boolean(entry));
}

function roundPct(value: number): number {
  return Math.round(value * 10) / 10;
}

function whereForKind(kind: EcgRouteKind): Prisma.EcgVideoQuestionWhereInput {
  if (kind === "scenarios" || kind === "lessons") {
    return {};
  }
  return {};
}

async function loadStats(questionIds: string[]): Promise<
  Map<
    string,
    {
      percentCorrect: number | null;
      commonWrongOptionIds: string[];
    }
  >
> {
  if (questionIds.length === 0) return new Map();

  const [performanceRows, optionRows, questionRows] = await Promise.all([
    prisma.ecgVideoQuestionPerformanceAggregate.findMany({
      where: { questionId: { in: questionIds } },
    }),
    prisma.ecgVideoQuestionAnswerOptionAggregate.findMany({
      where: { questionId: { in: questionIds } },
      orderBy: [{ selectionCount: "desc" }, { optionId: "asc" }],
    }),
    prisma.ecgVideoQuestion.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, answerOptions: true, correctAnswerId: true },
    }),
  ]);

  const optionMap = new Map(questionRows.map((row) => [row.id, asOptions(row.answerOptions)]));
  const correctAnswerMap = new Map(questionRows.map((row) => [row.id, row.correctAnswerId]));

  const out = new Map<
    string,
    {
      percentCorrect: number | null;
      commonWrongOptionIds: string[];
    }
  >();

  for (const perf of performanceRows) {
    const percentCorrect =
      perf.totalAttempts >= MIN_SAMPLE && perf.totalAttempts > 0
        ? roundPct((100 * perf.correctAttempts) / perf.totalAttempts)
        : null;
    out.set(perf.questionId, { percentCorrect, commonWrongOptionIds: [] });
  }

  for (const questionId of questionIds) {
    if (!out.has(questionId)) {
      out.set(questionId, { percentCorrect: null, commonWrongOptionIds: [] });
    }
    const stats = out.get(questionId)!;
    const correctAnswerId = correctAnswerMap.get(questionId);
    const validOptionIds = new Set(optionMap.get(questionId)?.map((option) => option.id) ?? []);
    stats.commonWrongOptionIds = optionRows
      .filter((row) => row.questionId === questionId)
      .map((row) => row.optionId)
      .filter((optionId) => optionId !== correctAnswerId && validOptionIds.has(optionId))
      .slice(0, 3);
  }

  return out;
}

function optionTextLookup(options: EcgOption[]): Map<string, string> {
  return new Map(options.map((option) => [option.id, option.text]));
}

export async function listEcgQuestionsForAccess(
  access: EcgAccess,
  params: { level: string | null; mode: string | null; kind: EcgRouteKind },
): Promise<EcgQuestionListItem[]> {
  if (access.mode === "public") {
    assertNoEcgForRpn(access.tier, access.pathwayId);
  }
  const level = normalizeEcgLevel(params.level);
  const mode = normalizeEcgMode(params.mode);
  if (!level || !mode) return [];

  const rows = await prisma.ecgVideoQuestion.findMany({
    where: {
      level,
      mode,
      isPremium: true,
      ...(access.mode === "public"
        ? { allowedTiers: { has: access.tier } }
        : { allowedTiers: { hasSome: [...access.allowedTiers] } }),
      ...whereForKind(params.kind),
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    take: 40,
    select: {
      id: true,
      videoUrl: true,
      thumbnailUrl: true,
      durationSeconds: true,
      questionText: true,
      answerOptions: true,
      correctAnswerId: true,
      rationale: true,
      rhythmTag: true,
      clinicalPriority: true,
      level: true,
      mode: true,
    },
  });

  const stats = await loadStats(rows.map((row) => row.id));
  return rows.map((row) => {
    const options = asOptions(row.answerOptions);
    const lookup = optionTextLookup(options);
    const questionStats = stats.get(row.id);
    return {
      id: row.id,
      videoUrl: row.videoUrl,
      thumbnailUrl: row.thumbnailUrl,
      durationSeconds: row.durationSeconds,
      questionText: row.questionText,
      options,
      rationale: row.rationale,
      rhythmTag: row.rhythmTag,
      clinicalPriority: row.clinicalPriority,
      level,
      mode,
      percentCorrect: questionStats?.percentCorrect ?? null,
      commonWrongAnswers: (questionStats?.commonWrongOptionIds ?? [])
        .map((optionId) => lookup.get(optionId) ?? optionId)
        .filter(Boolean),
    };
  });
}

export async function recordEcgQuestionAnswer(
  access: EcgAccess,
  params: { questionId: string; selectedOptionId: string; attemptMode: PracticeQuestionAnswerMode },
): Promise<EcgAnswerResult | null> {
  if (access.mode === "public") {
    assertNoEcgForRpn(access.tier, access.pathwayId);
  }
  const question = await prisma.ecgVideoQuestion.findFirst({
    where: {
      id: params.questionId,
      isPremium: true,
      ...(access.mode === "public"
        ? { allowedTiers: { has: access.tier } }
        : { allowedTiers: { hasSome: [...access.allowedTiers] } }),
    },
    select: {
      id: true,
      answerOptions: true,
      correctAnswerId: true,
      rationale: true,
      rhythmTag: true,
    },
  });
  if (!question) return null;

  const options = asOptions(question.answerOptions);
  const selectedOption = options.find((option) => option.id === params.selectedOptionId);
  if (!selectedOption) return null;

  const isCorrect = selectedOption.id === question.correctAnswerId;

  const stats = await prisma.$transaction(async (tx) => {
    await tx.ecgVideoQuestionPracticeAnswerAttempt.create({
      data: {
        userId: access.userId,
        questionId: question.id,
        selectedOptionId: selectedOption.id,
        isCorrect,
        mode: params.attemptMode,
        pathwayId: access.pathwayId,
      },
    });

    await tx.ecgVideoQuestionAnswerOptionAggregate.upsert({
      where: {
        questionId_optionId: {
          questionId: question.id,
          optionId: selectedOption.id,
        },
      },
      create: {
        questionId: question.id,
        optionId: selectedOption.id,
        selectionCount: 1,
      },
      update: {
        selectionCount: { increment: 1 },
      },
    });

    await tx.ecgVideoQuestionPerformanceAggregate.upsert({
      where: { questionId: question.id },
      create: {
        questionId: question.id,
        totalAttempts: 1,
        correctAttempts: isCorrect ? 1 : 0,
      },
      update: {
        totalAttempts: { increment: 1 },
        ...(isCorrect ? { correctAttempts: { increment: 1 } } : {}),
      },
    });

    const [performance, optionAggs] = await Promise.all([
      tx.ecgVideoQuestionPerformanceAggregate.findUnique({ where: { questionId: question.id } }),
      tx.ecgVideoQuestionAnswerOptionAggregate.findMany({
        where: { questionId: question.id },
        orderBy: [{ selectionCount: "desc" }, { optionId: "asc" }],
      }),
    ]);

    const totalAttempts = performance?.totalAttempts ?? 0;
    const percentCorrect =
      totalAttempts >= MIN_SAMPLE && totalAttempts > 0
        ? roundPct((100 * (performance?.correctAttempts ?? 0)) / totalAttempts)
        : null;

    const commonWrongAnswers = optionAggs
      .filter((row) => row.optionId !== question.correctAnswerId)
      .slice(0, 3)
      .map((row) => options.find((option) => option.id === row.optionId)?.text ?? row.optionId);

    return { percentCorrect, commonWrongAnswers };
  });

  return {
    questionId: question.id,
    selectedOptionId: selectedOption.id,
    isCorrect,
    correctRhythm: question.rhythmTag,
    correctAnswerId: question.correctAnswerId,
    rationale: params.attemptMode === PracticeQuestionAnswerMode.quiz ? question.rationale : question.rationale,
    percentCorrect: stats.percentCorrect,
    commonWrongAnswers: stats.commonWrongAnswers,
  };
}
