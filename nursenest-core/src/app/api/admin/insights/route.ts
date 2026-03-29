import { NextResponse } from "next/server";
import { ContentStatus, SubscriptionStatus, TierCode } from "@prisma/client";
import { safePrismaCount } from "@/lib/admin/resilient-counts";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { ttlGet, ttlSet } from "@/lib/cache/memory-cache";
import { prisma } from "@/lib/db";

const CACHE_KEY = "admin:insights:v2";
const TTL_MS = 60_000;

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const cached = ttlGet<Record<string, unknown>>(CACHE_KEY);
  if (cached) return NextResponse.json(cached);

  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const warnings: string[] = [];

  const pushWarn = (w?: string) => {
    if (w) warnings.push(w);
  };

  const usersR = await safePrismaCount("users", () => prisma.user.count());
  pushWarn(usersR.warning);

  const subsR = await safePrismaCount("active_subscriptions", () =>
    prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
  );
  pushWarn(subsR.warning);

  const lessonsR = await safePrismaCount("lessons", () =>
    prisma.contentItem.count({ where: { type: "lesson" } }),
  );
  pushWarn(lessonsR.warning);

  const questionsR = await safePrismaCount("exam_questions", () => prisma.examQuestion.count());
  pushWarn(questionsR.warning);

  const questionsNursingR = await safePrismaCount("exam_questions_nursing", () =>
    prisma.examQuestion.count({
      where: { status: "published", careerType: { not: "allied" } },
    }),
  );
  pushWarn(questionsNursingR.warning);

  const questionsAlliedR = await safePrismaCount("exam_questions_allied", () =>
    prisma.examQuestion.count({
      where: { status: "published", careerType: "allied" },
    }),
  );
  pushWarn(questionsAlliedR.warning);

  const examsR = await safePrismaCount("exams_published", () =>
    prisma.exam.count({ where: { status: ContentStatus.PUBLISHED } }),
  );
  pushWarn(examsR.warning);

  const flashR = await safePrismaCount("flashcards_published", () =>
    prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED } }),
  );
  pushWarn(flashR.warning);

  const attemptsR = await safePrismaCount("exam_attempts_7d", () =>
    prisma.examAttempt.count({ where: { createdAt: { gte: since7d } } }),
  );
  pushWarn(attemptsR.warning);

  let tierCounts: Partial<Record<TierCode, number>> = {};
  try {
    const tierAgg = await prisma.user.groupBy({
      by: ["tier"],
      _count: { tier: true },
      where: { role: "LEARNER" },
    });
    tierCounts = Object.fromEntries(
      (tierAgg as { tier: TierCode; _count: { tier: number } }[]).map((r) => [r.tier, r._count.tier]),
    ) as Partial<Record<TierCode, number>>;
  } catch (e) {
    warnings.push(`learnersByTier: ${e instanceof Error ? e.message : String(e)}`.slice(0, 300));
  }

  const payload = {
    users: usersR.value,
    activeSubscriptions: subsR.value,
    content: {
      lessonsPublished: lessonsR.value,
      questionsPublished: questionsR.value,
      questionsNursingPublished: questionsNursingR.value,
      questionsAlliedPublished: questionsAlliedR.value,
      examsPublished: examsR.value,
      flashcardsPublished: flashR.value,
    },
    usage: {
      examAttemptsLast7Days: attemptsR.value,
    },
    learnersByTier: tierCounts,
    warnings: warnings.length ? warnings : undefined,
  };

  ttlSet(CACHE_KEY, payload, TTL_MS);
  return NextResponse.json(payload);
}
