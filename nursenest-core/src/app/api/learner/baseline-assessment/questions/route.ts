import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { BaselineAssessmentAttemptStatus } from "@prisma/client";
import type { CountryCode, TierCode } from "@prisma/client";
import { BASELINE_QUESTION_COUNT, pickRandomBaselineQuestionIds, userShouldSeeBaselinePrompt } from "@/lib/baseline/baseline-assessment";
import { withRetry } from "@/lib/resilience/with-retry";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { mergeQuestionApiPayload } from "@/lib/i18n/educational-content-overlay";
import { resolveMergedQuestionOverlayBundle } from "@/lib/i18n/educational-translation-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId || !isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      country: true,
      tier: true,
      baselineAssessmentSkippedAt: true,
      baselineAssessmentCompletedAt: true,
    },
  });

  if (!user || !userShouldSeeBaselinePrompt(user)) {
    return NextResponse.json({ error: "Baseline not available", code: "baseline_unavailable" }, { status: 400 });
  }

  const country = user.country as CountryCode;
  const tier = user.tier as TierCode;

  const ids = await pickRandomBaselineQuestionIds(country, tier, BASELINE_QUESTION_COUNT);
  if (ids.length === 0) {
    return NextResponse.json(
      { error: "No questions available for your profile yet. Try again later.", code: "empty_bank" },
      { status: 503 },
    );
  }

  await prisma.baselineAssessmentAttempt.deleteMany({
    where: { userId, status: BaselineAssessmentAttemptStatus.OPEN },
  });

  const attempt = await prisma.baselineAssessmentAttempt.create({
    data: {
      userId,
      questionIds: ids,
      status: BaselineAssessmentAttemptStatus.OPEN,
    },
    select: { id: true },
  });

  const rows = await withRetry(() =>
    prisma.examQuestion.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        stem: true,
        questionType: true,
        options: true,
        topic: true,
        exam: true,
      },
    }),
  );

  const order = new Map(ids.map((id, i) => [id, i]));
  const questions = [...rows].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  const educationalLocale = await getMarketingLocaleForDefaultRoute();
  const questionOverlayBundle = await resolveMergedQuestionOverlayBundle(educationalLocale);
  const localized = questions.map((q) =>
    mergeQuestionApiPayload({ ...q } as Record<string, unknown>, educationalLocale, questionOverlayBundle, {
      teachingExposure: "none",
    }),
  );

  return NextResponse.json({
    attemptId: attempt.id,
    questions: localized,
    total: questions.length,
  });
}
