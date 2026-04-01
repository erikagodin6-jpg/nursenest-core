import { NextRequest, NextResponse } from "next/server";
import { ExamSessionStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { filterSessionQuestionIdsInScope } from "@/lib/entitlements/assert-question-access";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import {
  MAX_SESSION_ANSWER_KEYS,
  MAX_SESSION_QUESTION_IDS,
  sanitizeSessionQuestionIds,
} from "@/lib/exams/exam-session-bounds";
import { QUESTION_PAYLOAD_WARN_BYTES } from "@/lib/questions/question-api-limits";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";
import { logLargeApiResponse } from "@/lib/observability/perf-log";

/** Max questions hydrated when `mode=full` — align with {@link MAX_SESSION_QUESTION_IDS}. */
const SESSION_FULL_HYDRATE_MAX_QUESTIONS = MAX_SESSION_QUESTION_IDS;

const patchSchema = z.object({
  sessionId: z.string().min(5),
  currentIndex: z.number().int().min(0),
  answers: z
    .record(z.string(), z.unknown())
    .refine((r) => Object.keys(r).length <= MAX_SESSION_ANSWER_KEYS, "too many answer entries"),
  /** Elapsed time in ms (for timed + resume). Capped at 8 hours. */
  elapsedMs: z.number().int().min(0).max(28_800_000).optional(),
});

/** Resume in-progress session (questions + progress). */
export async function GET(req: NextRequest) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  /** Default `minimal` (ids + metadata only). `full` hydrates question stems/options — use sparingly. */
  const mode = req.nextUrl.searchParams.get("mode") === "full" ? "full" : "minimal";

  setSentryServerContext({ route: "/api/exams/session", feature: SERVER_FEATURE.exam, userId: gate.userId });

  try {
    const row = await withRetry(() =>
      prisma.examSession.findFirst({
        where: { id: sessionId, userId: gate.userId, status: ExamSessionStatus.IN_PROGRESS },
        select: {
          id: true,
          examId: true,
          currentIndex: true,
          answers: true,
          questionIds: true,
          updatedAt: true,
          timedMode: true,
          timeLimitSec: true,
          elapsedMs: true,
          createdAt: true,
        },
      }),
    );

    if (!row) {
      return NextResponse.json({ error: "Session not found or completed" }, { status: 404 });
    }

    const sanitized = sanitizeSessionQuestionIds(row.questionIds);
    if (sanitized.coercedFromInvalid || sanitized.truncated) {
      safeServerLog("api_exams_session", "session_question_ids_sanitized", {
        sessionId: row.id,
        coercedFromInvalid: sanitized.coercedFromInvalid,
        truncated: sanitized.truncated,
        sourceLength: sanitized.sourceLength,
        cap: MAX_SESSION_QUESTION_IDS,
      });
    }

    let ids = await filterSessionQuestionIdsInScope(sanitized.ids, gate.entitlement);
    const dropped = sanitized.ids.length - ids.length;
    if (dropped > 0) {
      safeServerLogCritical("api_exams_session", "session_question_ids_filtered", {
        sessionId: row.id,
        dropped,
        remaining: ids.length,
      });
    }

    if (sanitized.coercedFromInvalid || sanitized.truncated) {
      void prisma.examSession
        .update({
          where: { id: row.id },
          data: { questionIds: ids },
        })
        .catch(() => {});
    }

    if (mode === "minimal") {
      const minimalBody = {
        sessionId: row.id,
        examId: row.examId,
        currentIndex: Math.min(row.currentIndex, Math.max(0, ids.length - 1)),
        answers: row.answers,
        questionIds: ids,
        total: ids.length,
        updatedAt: row.updatedAt,
        mode: "minimal" as const,
        poolEmpty: ids.length === 0,
        entitlementFiltered: dropped > 0,
        sessionQuestionIdsSanitized: sanitized.truncated || sanitized.coercedFromInvalid,
        timedMode: row.timedMode,
        timeLimitSec: row.timeLimitSec,
        elapsedMs: row.elapsedMs,
        createdAt: row.createdAt,
      };
      logLargeApiResponse("/api/exams/session", estimateJsonUtf8Bytes(minimalBody));
      return NextResponse.json(minimalBody);
    }

    const ID_CHUNK = 400;
    const accessWhere = questionAccessWhere(gate.entitlement);
    const fullHydrationCapped = ids.length > SESSION_FULL_HYDRATE_MAX_QUESTIONS;
    const idsToHydrate = fullHydrationCapped ? ids.slice(0, SESSION_FULL_HYDRATE_MAX_QUESTIONS) : ids;
    if (fullHydrationCapped) {
      safeServerLog("api_exams_session", "full_hydrate_capped", {
        sessionId: row.id,
        questionIdCount: ids.length,
        cap: SESSION_FULL_HYDRATE_MAX_QUESTIONS,
      });
    }

    const questions = await withRetry(async () => {
      const acc: { id: string; stem: string; options: unknown; questionType: string }[] = [];
      for (let i = 0; i < idsToHydrate.length; i += ID_CHUNK) {
        const chunk = idsToHydrate.slice(i, i + ID_CHUNK);
        const part = await prisma.examQuestion.findMany({
          where: { AND: [{ id: { in: chunk } }, accessWhere] },
          select: { id: true, stem: true, options: true, questionType: true },
        });
        acc.push(...part);
      }
      return acc;
    });
    const order = new Map(idsToHydrate.map((id, i) => [id, i]));
    questions.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

    const fullJson = {
      sessionId: row.id,
      examId: row.examId,
      currentIndex: Math.min(row.currentIndex, Math.max(0, ids.length - 1)),
      answers: row.answers,
      questionIds: ids,
      total: ids.length,
      questions,
      updatedAt: row.updatedAt,
      mode: "full" as const,
      entitlementFiltered: dropped > 0,
      fullHydrationCapped,
      questionsHydrated: questions.length,
      fullHydrationCap: SESSION_FULL_HYDRATE_MAX_QUESTIONS,
      sessionQuestionIdsSanitized: sanitized.truncated || sanitized.coercedFromInvalid,
      timedMode: row.timedMode,
      timeLimitSec: row.timeLimitSec,
      elapsedMs: row.elapsedMs,
      createdAt: row.createdAt,
    };
    const approxPayloadBytes = estimateJsonUtf8Bytes(fullJson);
    safeServerLog("api_exams_session", "full_hydrate_payload", {
      approxPayloadBytes,
      questionsHydrated: questions.length,
      questionIdCount: ids.length,
      payloadLarge: approxPayloadBytes >= QUESTION_PAYLOAD_WARN_BYTES ? 1 : 0,
    });
    if (approxPayloadBytes >= QUESTION_PAYLOAD_WARN_BYTES) {
      safeServerLog("api_exams_session", "full_hydrate_payload_warn", {
        approxPayloadBytes,
        threshold: QUESTION_PAYLOAD_WARN_BYTES,
        sessionId: row.id,
      });
    }
    logLargeApiResponse("/api/exams/session", approxPayloadBytes);
    return NextResponse.json(fullJson);
  } catch (e) {
    safeServerLogCritical("api_exams_session", "get_failed", {}, e);
    return NextResponse.json({ error: "Unable to load session" }, { status: 503 });
  }
}

/** Save progress after each question (idempotent upsert by session id). */
export async function PATCH(req: Request) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/exams/session", feature: SERVER_FEATURE.exam, userId: gate.userId });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten(), maxAnswerKeys: MAX_SESSION_ANSWER_KEYS },
      { status: 400 },
    );
  }

  try {
    const existing = await prisma.examSession.findFirst({
      where: { id: parsed.data.sessionId, userId: gate.userId, status: ExamSessionStatus.IN_PROGRESS },
    });
    if (!existing) {
      return NextResponse.json({ error: "Session not found or already completed" }, { status: 404 });
    }

    const updated = await prisma.examSession.update({
      where: { id: existing.id },
      data: {
        currentIndex: parsed.data.currentIndex,
        answers: parsed.data.answers as object,
        ...(parsed.data.elapsedMs !== undefined ? { elapsedMs: parsed.data.elapsedMs } : {}),
      },
      select: { id: true, currentIndex: true, updatedAt: true },
    });

    return NextResponse.json({ ok: true, session: updated });
  } catch (e) {
    safeServerLogCritical("api_exams_session", "patch_failed", {}, e);
    return NextResponse.json({ error: "Unable to save progress" }, { status: 503 });
  }
}
