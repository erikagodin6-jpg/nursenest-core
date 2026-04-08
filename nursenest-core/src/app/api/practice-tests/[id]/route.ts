import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PracticeTestStatus } from "@prisma/client";
import { z } from "zod";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { advanceCatPracticeTest, finalizeCatPracticeTest } from "@/lib/practice-tests/cat-session";
/**
 * Topic ledger updates run only when a practice test completes (linear or CAT finalization).
 * Incremental recording on each CAT advance would double-count if the client retried the same step
 * or replayed answers; completion uses the full question id + answer set once.
 */
import { recordTopicOutcomesFromPracticeTest } from "@/lib/learner/topic-performance";
import { computePracticeTestResults } from "@/lib/practice-tests/score-practice-test";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import { buildPracticeTestTeachingReview } from "@/lib/practice-tests/build-teaching-review";
import {
  enforcePracticeTestDetailProtection,
  enforcePracticeTestMutationProtection,
} from "@/lib/http/api-protection";
import { mergeQuestionApiPayload } from "@/lib/i18n/educational-content-overlay";
import { resolveMergedQuestionOverlayBundle } from "@/lib/i18n/educational-translation-db";
import { getMarketingLocaleFromRequestCookie } from "@/lib/i18n/marketing-locale-cookie";

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

  setSentryServerContext({ route: "/api/practice-tests/[id]", feature: SERVER_FEATURE.practiceTest, userId: gate.userId });

  const row = await prisma.practiceTest.findFirst({
    where: { id, userId: gate.userId },
  });
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ids = asIdList(row.questionIds);

  const answers =
    typeof row.answers === "object" && row.answers !== null && !Array.isArray(row.answers)
      ? (row.answers as Record<string, unknown>)
      : {};

  const cfg = row.config as PracticeTestConfigJson;

  const teachingReviewRequested = req.nextUrl.searchParams.get("teachingReview") === "1";
  const hydrateFull = req.nextUrl.searchParams.get("hydrate") === "full";

  let teachingReview: Awaited<ReturnType<typeof buildPracticeTestTeachingReview>> | null = null;
  if (teachingReviewRequested && row.status === PracticeTestStatus.COMPLETED) {
    teachingReview = await buildPracticeTestTeachingReview(ids, answers, gate.entitlement);
  }

  const educationalLocale = getMarketingLocaleFromRequestCookie(req);
  const questionOverlayBundle = await resolveMergedQuestionOverlayBundle(educationalLocale);

  const base = questionAccessWhere(gate.entitlement);
  const ID_CHUNK = 200;
  let questions: Array<Record<string, unknown>> = [];

  if (!teachingReviewRequested && hydrateFull && ids.length > 0) {
    const qs = await withRetry(async () => {
      const acc: Array<{
        id: string;
        stem: string;
        questionType: string;
        options: unknown;
        topic: string | null;
        subtopic: string | null;
        difficulty: number | null;
        exam: string | null;
        bodySystem: string | null;
      }> = [];
      for (let i = 0; i < ids.length; i += ID_CHUNK) {
        const chunk = ids.slice(i, i + ID_CHUNK);
        const part = await prisma.examQuestion.findMany({
          where: { AND: [{ id: { in: chunk } }, base] },
          select: previewSelect,
        });
        acc.push(...part);
      }
      return acc;
    });
    const order = new Map(ids.map((qid, i) => [qid, i]));
    const sorted = [...qs].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    questions = sorted.map((q) => {
      const merged = mergeQuestionApiPayload({ ...q } as Record<string, unknown>, educationalLocale, questionOverlayBundle);
      const stem = String(merged.stem ?? "");
      return {
        ...merged,
        stem: stem.length > 2000 ? `${stem.slice(0, 1997)}…` : stem,
      };
    });
  }

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
    questionIds: ids,
    total: ids.length,
    questions,
    hydrate: hydrateFull ? ("full" as const) : ("minimal" as const),
    results: row.results as PracticeTestResultsJson | null,
    startedAt: row.startedAt.toISOString(),
    completedAt: row.completedAt?.toISOString() ?? null,
    adaptiveState: row.adaptiveState ?? null,
    catMode: cfg.selectionMode === "cat",
    ...(teachingReview ? { teachingReview } : {}),
    ...(teachingReviewRequested && row.status !== PracticeTestStatus.COMPLETED
      ? { teachingReviewUnavailable: true as const }
      : {}),
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

  setSentryServerContext({ route: "/api/practice-tests/[id]", feature: SERVER_FEATURE.practiceTest, userId: gate.userId });

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
      let topicStatsSynced = true;
      try {
        await recordTopicOutcomesFromPracticeTest(gate.userId, ids, merged, gate.entitlement);
      } catch {
        topicStatsSynced = false;
      }
      return NextResponse.json({ ok: true, results: adv.results, catCompleted: true, topicStatsSynced });
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
      const fin = await finalizeCatPracticeTest(ids, merged, gate.entitlement, row.adaptiveState);
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
      let topicStatsSynced = true;
      try {
        await recordTopicOutcomesFromPracticeTest(gate.userId, ids, merged, gate.entitlement);
      } catch {
        topicStatsSynced = false;
      }
      return NextResponse.json({ ok: true, results: fin.results, topicStatsSynced });
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

    let topicStatsSynced = true;
    try {
      await recordTopicOutcomesFromPracticeTest(gate.userId, ids, merged, gate.entitlement);
    } catch {
      topicStatsSynced = false;
    }
    return NextResponse.json({ ok: true, results, topicStatsSynced });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
