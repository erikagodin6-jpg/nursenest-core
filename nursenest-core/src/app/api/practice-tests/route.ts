import { NextResponse } from "next/server";
import { PracticeTestStatus } from "@prisma/client";
import { z } from "zod";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { createCatPracticeTestPayload } from "@/lib/practice-tests/cat-session";
import { configFromInput, pickPracticeQuestionIds } from "@/lib/practice-tests/pick-question-ids";
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";

const createSchema = z
  .object({
    title: z.string().max(120).optional(),
    questionCount: z.number().int().min(5).max(75),
    topicNames: z.array(z.string().min(1).max(200)).max(30).optional().default([]),
    difficultyMin: z.union([z.number().int().min(1).max(5), z.null()]).optional(),
    difficultyMax: z.union([z.number().int().min(1).max(5), z.null()]).optional(),
    selectionMode: z.enum(["random", "targeted", "weak", "cat"]),
    /** Pool strategy when `selectionMode` is `cat`. */
    catSelectionBasis: z.enum(["random", "targeted", "weak"]).optional(),
    pathwayId: z.union([z.string().min(2).max(80), z.null()]).optional(),
    timedMode: z.boolean(),
    timeLimitSec: z.union([z.number().int().min(120).max(14_400), z.null()]).optional(),
  })
  .refine((d) => d.selectionMode !== "cat" || d.questionCount >= 10, {
    message: "Adaptive (CAT) mode needs at least 10 as the maximum question cap.",
    path: ["questionCount"],
  });

export async function GET() {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/practice-tests", feature: "practice_test", userId: gate.userId });

  const rows = await prisma.practiceTest.findMany({
    where: { userId: gate.userId },
    orderBy: { updatedAt: "desc" },
    take: 40,
    select: {
      id: true,
      title: true,
      status: true,
      config: true,
      questionIds: true,
      timedMode: true,
      timeLimitSec: true,
      elapsedMs: true,
      startedAt: true,
      completedAt: true,
      results: true,
      updatedAt: true,
    },
  });

  const list = rows.map((r) => {
    const ids = Array.isArray(r.questionIds) ? r.questionIds.filter((x): x is string => typeof x === "string") : [];
    const cfg = r.config as PracticeTestConfigJson | null;
    const res = r.results as { accuracyPct?: number; scoreCorrect?: number; scoreTotal?: number } | null;
    const maxCap = cfg?.catMaxQuestions ?? cfg?.questionCount ?? ids.length;
    return {
      id: r.id,
      title: r.title,
      status: r.status,
      questionCount: cfg?.selectionMode === "cat" ? maxCap : ids.length,
      selectionMode: cfg?.selectionMode ?? null,
      timedMode: r.timedMode,
      timeLimitSec: r.timeLimitSec,
      elapsedMs: r.elapsedMs,
      startedAt: r.startedAt.toISOString(),
      completedAt: r.completedAt?.toISOString() ?? null,
      accuracyPct: res?.accuracyPct ?? null,
      scoreCorrect: res?.scoreCorrect ?? null,
      scoreTotal: res?.scoreTotal ?? null,
      updatedAt: r.updatedAt.toISOString(),
    };
  });

  return NextResponse.json({ tests: list });
}

export async function POST(req: Request) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/practice-tests", feature: "practice_test", userId: gate.userId });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  const topicNames = d.topicNames ?? [];
  const difficultyMin = d.difficultyMin ?? null;
  const difficultyMax = d.difficultyMax ?? null;

  const timeLimitSec = d.timedMode
    ? (d.timeLimitSec ?? Math.min(14_400, Math.max(300, d.questionCount * 90)))
    : null;

  if (d.selectionMode === "cat") {
    const basis = d.catSelectionBasis ?? "random";
    const cat = await createCatPracticeTestPayload(
      gate.userId,
      gate.entitlement,
      basis,
      {
        questionCount: d.questionCount,
        topicNames,
        difficultyMin,
        difficultyMax,
        pathwayId: d.pathwayId ?? null,
      },
      d.timedMode,
      timeLimitSec,
    );
    if (!cat.ok) {
      return NextResponse.json({ error: cat.message, code: "pool_too_small" }, { status: 400 });
    }

    const row = await prisma.practiceTest.create({
      data: {
        userId: gate.userId,
        title: d.title?.trim() || null,
        config: cat.config as object,
        questionIds: cat.questionIds,
        adaptiveState: cat.adaptiveState as object,
        status: PracticeTestStatus.IN_PROGRESS,
        timedMode: d.timedMode,
        timeLimitSec,
        cursorIndex: 0,
      },
    });

    return NextResponse.json(
      { id: row.id, questionCount: cat.questionIds.length, config: cat.config, adaptive: true },
      { status: 201 },
    );
  }

  const picked = await pickPracticeQuestionIds(gate.userId, gate.entitlement, {
    questionCount: d.questionCount,
    topicNames,
    difficultyMin,
    difficultyMax,
    selectionMode: d.selectionMode,
    pathwayId: d.pathwayId ?? null,
  });

  if (!picked.ok) {
    return NextResponse.json({ error: picked.message, code: "pool_too_small" }, { status: 400 });
  }

  const config = configFromInput(
    {
      questionCount: d.questionCount,
      topicNames,
      difficultyMin,
      difficultyMax,
      selectionMode: d.selectionMode,
      pathwayId: d.pathwayId ?? null,
    },
    d.timedMode,
    timeLimitSec,
  );

  const row = await prisma.practiceTest.create({
    data: {
      userId: gate.userId,
      title: d.title?.trim() || null,
      config: config as object,
      questionIds: picked.ids,
      status: PracticeTestStatus.IN_PROGRESS,
      timedMode: d.timedMode,
      timeLimitSec,
    },
  });

  return NextResponse.json({ id: row.id, questionCount: picked.ids.length, config }, { status: 201 });
}
