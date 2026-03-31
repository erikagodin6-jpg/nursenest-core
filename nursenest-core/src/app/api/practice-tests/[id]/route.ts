import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PracticeTestStatus } from "@prisma/client";
import { z } from "zod";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { advanceCatPracticeTest, finalizeCatPracticeTest } from "@/lib/practice-tests/cat-session";
import { recordTopicOutcomesFromPracticeTest } from "@/lib/learner/topic-performance";
import { computePracticeTestResults } from "@/lib/practice-tests/score-practice-test";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import {
  enforcePracticeTestDetailProtection,
  enforcePracticeTestMutationProtection,
} from "@/lib/http/api-protection";

const previewSelect = {
  id: true,
  stem: true,
  questionType: true,
  options: true,
  topic: true,
  subtopic: true,
  difficulty: true,
  exam: true,
  bodySystem: true,
} as const;

function asIdList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string" && x.length > 4);
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const limited = enforcePracticeTestDetailProtection(req, gate.userId);
  if (limited) return limited;

  const { id } = await ctx.params;
  if (!id || id.length < 8) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  setSentryServerContext({ route: "/api/practice-tests/[id]", feature: "practice_test", userId: gate.userId });

  const row = await prisma.practiceTest.findFirst({
    where: { id, userId: gate.userId },
  });
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ids = asIdList(row.questionIds);
  const base = questionAccessWhere(gate.entitlement);
  const qs = await prisma.examQuestion.findMany({
    where: { AND: [{ id: { in: ids } }, base] },
    select: previewSelect,
  });
  const order = new Map(ids.map((qid, i) => [qid, i]));
  const questions = [...qs].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  const answers =
    typeof row.answers === "object" && row.answers !== null && !Array.isArray(row.answers)
      ? (row.answers as Record<string, unknown>)
      : {};

  const cfg = row.config as PracticeTestConfigJson;

  return NextResponse.json({
    id: row.id,
    title: row.title,
    status: row.status,
    config: cfg,
    timedMode: row.timedMode,
    timeLimitSec: row.timeLimitSec,
    elapsedMs: row.elapsedMs,
    cursorIndex: row.cursorIndex,
    answers,
    questions: questions.map((q) => ({
      ...q,
      stem: q.stem.length > 2000 ? `${q.stem.slice(0, 1997)}…` : q.stem,
    })),
    results: row.results as PracticeTestResultsJson | null,
    startedAt: row.startedAt.toISOString(),
    completedAt: row.completedAt?.toISOString() ?? null,
    adaptiveState: row.adaptiveState ?? null,
    catMode: cfg.selectionMode === "cat",
  });
}

const patchSchema = z.object({
  action: z.enum(["save", "complete", "abandon", "cat_advance"]),
  answers: z.record(z.string(), z.unknown()).optional(),
  cursorIndex: z.number().int().min(0).optional(),
  elapsedMs: z.number().int().min(0).max(48 * 60 * 60 * 1000).optional(),
});

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const mutateLimited = enforcePracticeTestMutationProtection(req, gate.userId);
  if (mutateLimited) return mutateLimited;

  const { id } = await ctx.params;
  if (!id || id.length < 8) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  setSentryServerContext({ route: "/api/practice-tests/[id]", feature: "practice_test", userId: gate.userId });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const row = await prisma.practiceTest.findFirst({
    where: { id, userId: gate.userId },
  });
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (row.status !== PracticeTestStatus.IN_PROGRESS) {
    return NextResponse.json({ error: "Test is no longer editable", code: "finalized" }, { status: 409 });
  }

  const ids = asIdList(row.questionIds);
  const prevAnswers =
    typeof row.answers === "object" && row.answers !== null && !Array.isArray(row.answers)
      ? ({ ...(row.answers as Record<string, unknown>) } as Record<string, unknown>)
      : {};

  const merged =
    parsed.data.answers != null ? { ...prevAnswers, ...parsed.data.answers } : prevAnswers;
  const cursorIndex = parsed.data.cursorIndex ?? row.cursorIndex;
  const elapsedMs = parsed.data.elapsedMs ?? row.elapsedMs ?? undefined;
  const cfg = row.config as PracticeTestConfigJson;

  if (parsed.data.action === "save") {
    await prisma.practiceTest.update({
      where: { id },
      data: {
        answers: merged as object,
        cursorIndex,
        ...(elapsedMs !== undefined ? { elapsedMs } : {}),
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (parsed.data.action === "abandon") {
    await prisma.practiceTest.update({
      where: { id },
      data: {
        status: PracticeTestStatus.ABANDONED,
        answers: merged as object,
        cursorIndex,
        completedAt: new Date(),
        ...(elapsedMs !== undefined ? { elapsedMs } : {}),
      },
    });
    return NextResponse.json({ ok: true });
  }

  if (parsed.data.action === "cat_advance") {
    if (cfg.selectionMode !== "cat") {
      return NextResponse.json({ error: "Not a CAT session" }, { status: 400 });
    }

    const adv = await advanceCatPracticeTest({
      questionIds: ids,
      adaptiveState: row.adaptiveState,
      mergedAnswers: merged,
      cursorIndex,
      config: cfg,
      userId: gate.userId,
      entitlement: gate.entitlement,
    });

    if (adv.kind === "error") {
      return NextResponse.json({ error: adv.message }, { status: 400 });
    }

    if (adv.kind === "completed") {
      await prisma.practiceTest.update({
        where: { id },
        data: {
          status: PracticeTestStatus.COMPLETED,
          answers: merged as object,
          cursorIndex,
          completedAt: new Date(),
          results: adv.results as object,
          adaptiveState: adv.adaptiveState as object,
          questionIds: ids as object,
          ...(elapsedMs !== undefined ? { elapsedMs } : {}),
        },
      });
      void recordTopicOutcomesFromPracticeTest(gate.userId, ids, merged, gate.entitlement).catch(() => {});
      return NextResponse.json({ ok: true, results: adv.results, catCompleted: true });
    }

    await prisma.practiceTest.update({
      where: { id },
      data: {
        answers: merged as object,
        cursorIndex: adv.cursorIndex,
        questionIds: adv.questionIds as object,
        adaptiveState: adv.adaptiveState as object,
        ...(elapsedMs !== undefined ? { elapsedMs } : {}),
      },
    });
    return NextResponse.json({ ok: true, catAdvanced: true });
  }

  if (parsed.data.action === "complete") {
    if (cfg.selectionMode === "cat") {
      const fin = await finalizeCatPracticeTest(ids, merged, gate.entitlement);
      await prisma.practiceTest.update({
        where: { id },
        data: {
          status: PracticeTestStatus.COMPLETED,
          answers: merged as object,
          cursorIndex,
          completedAt: new Date(),
          results: fin.results as object,
          adaptiveState: fin.adaptiveState as object,
          ...(elapsedMs !== undefined ? { elapsedMs } : {}),
        },
      });
      void recordTopicOutcomesFromPracticeTest(gate.userId, ids, merged, gate.entitlement).catch(() => {});
      return NextResponse.json({ ok: true, results: fin.results });
    }

    const results = await computePracticeTestResults(ids, merged, gate.entitlement);

    await prisma.practiceTest.update({
      where: { id },
      data: {
        status: PracticeTestStatus.COMPLETED,
        answers: merged as object,
        cursorIndex,
        completedAt: new Date(),
        results: results as object,
        ...(elapsedMs !== undefined ? { elapsedMs } : {}),
      },
    });

    void recordTopicOutcomesFromPracticeTest(gate.userId, ids, merged, gate.entitlement).catch(() => {});

    return NextResponse.json({ ok: true, results });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
