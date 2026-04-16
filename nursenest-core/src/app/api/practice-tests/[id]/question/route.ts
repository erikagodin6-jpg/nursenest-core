import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PracticeTestStatus } from "@prisma/client";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import { enforcePracticeTestQuestionProtection } from "@/lib/http/api-protection";
import { mergeQuestionApiPayload } from "@/lib/i18n/educational-content-overlay";
import { resolveMergedQuestionOverlayBundle } from "@/lib/i18n/educational-translation-db";
import { getMarketingLocaleFromRequestCookie } from "@/lib/i18n/marketing-locale-cookie";
import { QUESTION_PAYLOAD_WARN_BYTES } from "@/lib/questions/question-api-limits";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";
import { safeServerLog } from "@/lib/observability/safe-server-log";

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

function parsePracticeTestRouteParams(raw: unknown): { id: string } | null {
  if (!raw || typeof raw !== "object") return null;
  const id = (raw as Record<string, unknown>).id;
  return typeof id === "string" && id.trim().length > 0 ? { id: id.trim() } : null;
}

/**
 * One practice-test item at a time (same pattern as /api/exams/session/question).
 * Keeps large CAT/linear runs off the wire and out of React state in one payload.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<unknown> }) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const limited = await enforcePracticeTestQuestionProtection(req, gate.userId);
  if (limited) return limited;

  const parsedParams = parsePracticeTestRouteParams(await ctx.params);
  if (!parsedParams || parsedParams.id.length < 8) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const { id } = parsedParams;

  const indexRaw = req.nextUrl.searchParams.get("index");
  if (indexRaw === null) {
    return NextResponse.json({ error: "index required" }, { status: 400 });
  }
  const index = Math.max(0, Number.parseInt(indexRaw, 10));
  if (Number.isNaN(index)) {
    return NextResponse.json({ error: "invalid index" }, { status: 400 });
  }

  setSentryServerContext({
    route: "/api/practice-tests/[id]/question",
    feature: SERVER_FEATURE.practiceTest,
    userId: gate.userId,
  });

  try {
    const row = await withRetry(() =>
      prisma.practiceTest.findFirst({
        where: { id, userId: gate.userId },
        select: { questionIds: true, status: true },
      }),
    );

    if (!row || row.status !== PracticeTestStatus.IN_PROGRESS) {
      return NextResponse.json({ error: "Test not in progress" }, { status: 404 });
    }

    let ids = asIdList(row.questionIds);
    if (ids.length === 0) {
      return NextResponse.json({ error: "No questions in session" }, { status: 404 });
    }
    if (index >= ids.length) {
      return NextResponse.json({ error: "index out of range" }, { status: 400 });
    }

    const qid = ids[index]!;
    const base = questionAccessWhere(gate.entitlement);
    const q = await withRetry(() =>
      prisma.examQuestion.findFirst({
        where: { AND: [{ id: qid }, base] },
        select: previewSelect,
      }),
    );

    if (!q) {
      return NextResponse.json({ error: "Question not available" }, { status: 404 });
    }

    const educationalLocale = getMarketingLocaleFromRequestCookie(req);
    const questionOverlayBundle = await resolveMergedQuestionOverlayBundle(educationalLocale);
    const merged = mergeQuestionApiPayload({ ...q } as Record<string, unknown>, educationalLocale, questionOverlayBundle, {
      teachingExposure: "none",
    });
    const stem = String(merged.stem ?? "");
    const question = {
      ...merged,
      stem: stem.length > 2000 ? `${stem.slice(0, 1997)}…` : stem,
    };

    const body = { index, total: ids.length, question };
    const approxPayloadBytes = estimateJsonUtf8Bytes(body);
    if (approxPayloadBytes >= QUESTION_PAYLOAD_WARN_BYTES) {
      safeServerLog("api_practice_tests_question", "payload_warn", {
        approxPayloadBytes,
        threshold: QUESTION_PAYLOAD_WARN_BYTES,
        questionId: qid,
      });
    }
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: "Unable to load question" }, { status: 503 });
  }
}
