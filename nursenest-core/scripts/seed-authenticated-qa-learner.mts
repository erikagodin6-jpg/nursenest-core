#!/usr/bin/env npx tsx
/**
 * Deterministic learner **study surface** rows for the Playwright paid / visual-QA account.
 *
 * ## Required
 * - `DATABASE_URL`
 * - Target user must already exist with password + ACTIVE subscription (same email Playwright uses).
 *   Bootstrap with: `ALLOW_QA_PAID_TEST_RESET=1 npx tsx scripts/qa-paid-test-account-reset.mts`
 *
 * ## Email resolution (first match)
 * - `AUTH_QA_USER_EMAIL` — optional explicit learner to seed
 * - else `E2E_PAID_EMAIL` / `QA_PAID_EMAIL` / `PLAYWRIGHT_TEST_EMAIL` (aligned with `paid-test-credentials.ts`)
 *
 * ## Optional
 * - `AUTH_QA_SEED_RESET=1` — delete prior rows tagged by this script (`nnAuthQaSeed` / `nn_auth_qa` keys) then re-seed
 *
 * ## Order (documented)
 * 1. `qa-paid-test-account-reset.mts` (or equivalent) for the same email Playwright uses
 * 2. `npm run seed:auth-qa`
 * 3. `npx next dev` (or Playwright webServer)
 * 4. `npx playwright test --project=setup-paid-auth …`
 */
import "./load-dotenv-for-cli.mts";
import { assertDatabaseUrlPresentOrExit } from "./lib/database-env-assert.mts";

assertDatabaseUrlPresentOrExit("seed-authenticated-qa-learner requires DATABASE_URL.");

import { ContentStatus, ExamSessionStatus, PracticeTestStatus } from "@prisma/client";
import { answerMatches } from "../src/lib/exams/score-session-answers";
import { questionAccessWhere } from "../src/lib/entitlements/content-access-scope";
import { resolveEntitlement } from "../src/lib/entitlements/resolve-entitlement";
import { syntheticPathwayLessonId } from "../src/lib/lessons/pathway-lesson-progress";
import { prisma } from "./lib/prisma-script-client";

const SEED_TAG = "nn_auth_qa";
const SEED_JSON_MARKER = "nnAuthQaSeed";
const SEED_JSON_VERSION = 1;
const DECK_SLUG = "nn-auth-qa-e2e-deck";

function resolveTargetEmail(): string | null {
  const a =
    process.env.AUTH_QA_USER_EMAIL?.trim().toLowerCase() ||
    process.env.E2E_PAID_EMAIL?.trim().toLowerCase() ||
    process.env.QA_PAID_EMAIL?.trim().toLowerCase() ||
    process.env.PLAYWRIGHT_TEST_EMAIL?.trim().toLowerCase();
  return a?.includes("@") ? a : null;
}

function isTaggedResults(v: unknown): boolean {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  return (v as Record<string, unknown>)[SEED_JSON_MARKER] === SEED_JSON_VERSION;
}

function isTaggedConfig(v: unknown): boolean {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  return (v as Record<string, unknown>).seedTag === SEED_TAG;
}

async function cleanupTaggedRows(userId: string): Promise<void> {
  const attempts = await prisma.examAttempt.findMany({
    where: { userId },
    select: { id: true, results: true },
  });
  const seedAttemptIds = attempts.filter((a) => isTaggedResults(a.results)).map((a) => a.id);
  if (seedAttemptIds.length) {
    await prisma.examSession.deleteMany({ where: { attemptId: { in: seedAttemptIds } } });
    await prisma.examAttempt.deleteMany({ where: { id: { in: seedAttemptIds } } });
  }

  const pts = await prisma.practiceTest.findMany({
    where: { userId },
    select: { id: true, config: true },
  });
  const ptIds = pts.filter((p) => isTaggedConfig(p.config)).map((p) => p.id);
  if (ptIds.length) {
    await prisma.practiceTest.deleteMany({ where: { id: { in: ptIds } } });
  }

  const deck = await prisma.flashcardDeck.findUnique({ where: { slug: DECK_SLUG }, select: { id: true } });
  if (deck) {
    await prisma.flashcardProgress.deleteMany({ where: { userId, flashcard: { deckId: deck.id } } });
    await prisma.flashcardStudySession.deleteMany({ where: { userId, deckId: deck.id } });
    await prisma.flashcard.deleteMany({ where: { deckId: deck.id } });
    await prisma.flashcardDeck.delete({ where: { id: deck.id } }).catch(() => {});
  }

  await prisma.userTopicStat.deleteMany({
    where: {
      userId,
      topic: { in: ["Pharmacology", "Fundamentals", "Cardiac"] },
    },
  });

  const weekKey = "auth-qa-seed-week";
  await prisma.readiness_history.deleteMany({
    where: { user_id: userId, snapshot_week: weekKey },
  });
}

async function main(): Promise<void> {
  const email = resolveTargetEmail();
  if (!email) {
    console.error(
      "Set AUTH_QA_USER_EMAIL or E2E_PAID_EMAIL (or QA_PAID_EMAIL / PLAYWRIGHT_TEST_EMAIL) to the QA learner email.",
    );
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: {
      id: true,
      email: true,
      learnerPath: true,
      tier: true,
      country: true,
    },
  });
  if (!user) {
    console.error(`No user for ${email}. Run scripts/qa-paid-test-account-reset.mts first.`);
    process.exit(1);
  }

  const sub = await prisma.subscription.findFirst({
    where: { userId: user.id, status: "ACTIVE" },
    select: { id: true },
  });
  if (!sub) {
    console.error(`User ${email} has no ACTIVE subscription — run qa-paid-test-account-reset.mts.`);
    process.exit(1);
  }

  if (process.env.AUTH_QA_SEED_RESET === "1") {
    console.log("[seed-auth-qa] AUTH_QA_SEED_RESET=1 — removing prior tagged rows.");
    await cleanupTaggedRows(user.id);
  }

  const pathwayId = user.learnerPath?.trim() || "us-rn-nclex-rn";
  const entitlement = await resolveEntitlement(user.id);
  const qWhere = questionAccessWhere(entitlement);
  const questions = await prisma.examQuestion.findMany({
    where: qWhere,
    take: 8,
    orderBy: { createdAt: "asc" },
    select: { id: true, questionType: true, correctAnswer: true },
  });

  if (questions.length < 2) {
    console.warn(
      `[seed-auth-qa] Only ${questions.length} bank questions in scope — skipping exam session / practice test seeding.`,
    );
  }

  const now = new Date();
  const lastWrong = new Date(now.getTime() - 1 * 86400000);

  await prisma.$transaction(async (tx) => {
    const topicRows = [
      {
        topic: "Pharmacology",
        correctCount: 2,
        wrongCount: 10,
        wrongStreak: 4,
        lastWrongAt: lastWrong,
        lastAttemptAt: now,
      },
      {
        topic: "Fundamentals",
        correctCount: 22,
        wrongCount: 2,
        wrongStreak: 0,
        lastWrongAt: null,
        lastAttemptAt: now,
      },
      {
        topic: "Cardiac",
        correctCount: 6,
        wrongCount: 5,
        wrongStreak: 1,
        lastWrongAt: lastWrong,
        lastAttemptAt: now,
      },
    ] as const;
    for (const row of topicRows) {
      await tx.userTopicStat.upsert({
        where: { userId_topic: { userId: user.id, topic: row.topic } },
        update: {
          correctCount: row.correctCount,
          wrongCount: row.wrongCount,
          wrongStreak: row.wrongStreak,
          lastWrongAt: row.lastWrongAt,
          lastAttemptAt: row.lastAttemptAt,
        },
        create: {
          userId: user.id,
          topic: row.topic,
          correctCount: row.correctCount,
          wrongCount: row.wrongCount,
          wrongStreak: row.wrongStreak,
          lastWrongAt: row.lastWrongAt,
          lastAttemptAt: row.lastAttemptAt,
        },
      });
    }

    const pRows = await tx.pathwayLesson.findMany({
      where: { pathwayId, status: ContentStatus.PUBLISHED },
      take: 3,
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
      select: { pathwayId: true, slug: true },
    });

    for (let i = 0; i < pRows.length; i++) {
      const row = pRows[i]!;
      const lessonId = syntheticPathwayLessonId(row.pathwayId, row.slug);
      const completed = i === 0;
      await tx.progress.upsert({
        where: { userId_lessonId: { userId: user.id, lessonId } },
        update: {
          completed,
          engagedAt: completed ? now : new Date(now.getTime() - 3600000),
          updatedAt: now,
        },
        create: {
          userId: user.id,
          lessonId,
          completed,
          engagedAt: completed ? now : new Date(now.getTime() - 3600000),
        },
      });
    }

    const cat = await tx.category.findFirst({ where: { slug: "fundamentals" }, select: { id: true } });
    if (!cat) {
      console.warn("[seed-auth-qa] category fundamentals missing — skipping flashcard deck.");
    } else {
      const deck = await tx.flashcardDeck.upsert({
        where: { slug: DECK_SLUG },
        update: {
          title: "Auth QA deck",
          description: "Seeded for Playwright / visual QA (idempotent slug).",
          country: user.country,
          tier: user.tier,
          pathwayId,
          visibility: "SUBSCRIBER",
          status: ContentStatus.PUBLISHED,
          cardCount: 2,
        },
        create: {
          slug: DECK_SLUG,
          title: "Auth QA deck",
          description: "Seeded for Playwright / visual QA (idempotent slug).",
          country: user.country,
          tier: user.tier,
          pathwayId,
          visibility: "SUBSCRIBER",
          status: ContentStatus.PUBLISHED,
          cardCount: 2,
        },
      });

      const imgUrl =
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=320&q=60";
      const cardDefs = [
        {
          sourceKey: `${SEED_TAG}:card:text`,
          front: "Normal saline isotonic use",
          back: "Volume resuscitation and maintenance; monitor for fluid overload.",
        },
        {
          sourceKey: `${SEED_TAG}:card:image`,
          front: `![ECG lead placement reference](${imgUrl})`,
          back: "Verify lead placement before interpreting rhythm strips.",
        },
      ] as const;

      for (const def of cardDefs) {
        await tx.flashcard.upsert({
          where: { sourceKey: def.sourceKey },
          update: {
            front: def.front,
            back: def.back,
            country: user.country,
            tier: user.tier,
            status: ContentStatus.PUBLISHED,
            deckId: deck.id,
            categoryId: cat.id,
            positionInDeck: def.sourceKey.endsWith("text") ? 0 : 1,
          },
          create: {
            sourceKey: def.sourceKey,
            front: def.front,
            back: def.back,
            country: user.country,
            tier: user.tier,
            status: ContentStatus.PUBLISHED,
            deckId: deck.id,
            categoryId: cat.id,
            positionInDeck: def.sourceKey.endsWith("text") ? 0 : 1,
          },
        });
      }

      const cards = await tx.flashcard.findMany({
        where: { deckId: deck.id },
        select: { id: true },
        orderBy: { positionInDeck: "asc" },
      });

      for (const c of cards) {
        await tx.flashcardProgress.upsert({
          where: { userId_flashcardId: { userId: user.id, flashcardId: c.id } },
          update: {
            easeFactor: 2.4,
            intervalDays: 3,
            repetitions: 2,
            lastQuality: 3,
            lastReviewedAt: now,
            nextReviewAt: new Date(now.getTime() + 2 * 86400000),
          },
          create: {
            userId: user.id,
            flashcardId: c.id,
            easeFactor: 2.4,
            intervalDays: 3,
            repetitions: 2,
            lastQuality: 3,
            lastReviewedAt: now,
            nextReviewAt: new Date(now.getTime() + 2 * 86400000),
          },
        });
      }

      await tx.flashcardUserStats.upsert({
        where: { userId: user.id },
        update: {
          currentStreak: 2,
          longestStreak: 5,
          lastStudyDate: now,
          cardsReviewedTotal: 24,
        },
        create: {
          userId: user.id,
          currentStreak: 2,
          longestStreak: 5,
          lastStudyDate: now,
          cardsReviewedTotal: cards.length,
        },
      });

      await tx.flashcardStudySession.upsert({
        where: { userId_deckId: { userId: user.id, deckId: deck.id } },
        update: {
          queueIds: cards.map((c) => c.id),
          cursor: 1,
        },
        create: {
          userId: user.id,
          deckId: deck.id,
          queueIds: cards.map((c) => c.id),
          cursor: 1,
        },
      });
    }

    const exam = await tx.exam.findFirst({
      where: { title: "Core Readiness Exam" },
      select: { id: true },
    });

    if (exam && questions.length >= 2) {
      const ids = questions.map((q) => q.id);
      const answers: Record<string, unknown> = {};
      for (let i = 0; i < ids.length; i++) {
        const q = questions[i]!;
        if (i % 2 === 0) {
          const ok = Array.isArray(q.correctAnswer) ? String(q.correctAnswer[0]) : String(q.correctAnswer ?? "");
          answers[q.id] = ok;
        } else {
          answers[q.id] = "__auth_qa_wrong__";
        }
      }

      const attempt = await tx.examAttempt.create({
        data: {
          userId: user.id,
          examId: exam.id,
          score: 5,
          total: Math.min(8, ids.length),
          results: { [SEED_JSON_MARKER]: SEED_JSON_VERSION, label: "auth-qa-bank-session" },
        },
      });

      await tx.examSession.create({
        data: {
          userId: user.id,
          examId: exam.id,
          questionIds: ids,
          answers,
          currentIndex: Math.min(3, ids.length - 1),
          status: ExamSessionStatus.COMPLETED,
          attemptId: attempt.id,
          examMode: "linear",
          timedMode: false,
          elapsedMs: 424242,
        },
      });

      const attempt2 = await tx.examAttempt.create({
        data: {
          userId: user.id,
          examId: exam.id,
          score: 0,
          total: 2,
          results: { [SEED_JSON_MARKER]: SEED_JSON_VERSION, label: "auth-qa-failed-mock" },
        },
      });

      await tx.examSession.create({
        data: {
          userId: user.id,
          examId: exam.id,
          questionIds: ids.slice(0, 2),
          answers: { [ids[0]!]: "__wrong__", [ids[1]!]: "__wrong__" },
          currentIndex: 2,
          status: ExamSessionStatus.COMPLETED,
          attemptId: attempt2.id,
          examMode: "linear",
          elapsedMs: 424243,
        },
      });

      let correct = 0;
      let total = 0;
      for (let i = 0; i < Math.min(4, ids.length); i++) {
        const q = questions[i]!;
        total += 1;
        if (answerMatches(q.questionType, q.correctAnswer, answers[q.id])) correct += 1;
      }

      await tx.practiceTest.create({
        data: {
          userId: user.id,
          title: "Auth QA — completed mix",
          config: { seedTag: SEED_TAG, pathwayId, mode: "linear" },
          questionIds: ids.slice(0, 4),
          answers,
          cursorIndex: 4,
          status: PracticeTestStatus.COMPLETED,
          completedAt: now,
          results: {
            seedTag: SEED_TAG,
            score: correct,
            total,
          },
        },
      });

      await tx.practiceTest.create({
        data: {
          userId: user.id,
          title: "Auth QA — in progress",
          config: { seedTag: SEED_TAG, pathwayId, mode: "linear" },
          questionIds: ids,
          answers: Object.fromEntries(ids.slice(0, 2).map((id) => [id, answers[id] ?? ""])),
          cursorIndex: 2,
          status: PracticeTestStatus.IN_PROGRESS,
        },
      });

      await tx.examSession.create({
        data: {
          userId: user.id,
          examId: exam.id,
          questionIds: ids.slice(0, 3),
          answers: {},
          currentIndex: 1,
          status: ExamSessionStatus.IN_PROGRESS,
          examMode: "cat",
          adaptiveState: {
            [SEED_JSON_MARKER]: true,
            theta: 0.1,
            se: 0.35,
            itemsSeen: 1,
          },
        },
      });
    } else if (!exam) {
      console.warn("[seed-auth-qa] No Exam titled 'Core Readiness Exam' — skipping bank sessions / practice tests.");
    }

    const weekKey = "auth-qa-seed-week";
    await tx.readiness_history.upsert({
      where: {
        user_id_snapshot_week: { user_id: user.id, snapshot_week: weekKey },
      },
      create: {
        user_id: user.id,
        snapshot_week: weekKey,
        readiness_score: 62,
        pass_probability: 58,
        readiness_tier: "building_momentum",
        exam_type: user.tier === "NP" ? "NP" : "RN",
        factors: { seed: SEED_TAG },
      },
      update: {
        readiness_score: 62,
        pass_probability: 58,
        readiness_tier: "building_momentum",
        factors: { seed: SEED_TAG },
      },
    });

    const targetExam = new Date(now.getTime() + 88 * 86400000);
    await tx.exam_planner_settings.upsert({
      where: { user_id: user.id },
      create: {
        user_id: user.id,
        exam_date: targetExam,
        exam_date_type: "target",
        tier: String(user.tier).toLowerCase(),
        career_type: "nursing",
        study_plan_intensity: "balanced",
      },
      update: {
        exam_date: targetExam,
        exam_date_type: "target",
        tier: String(user.tier).toLowerCase(),
      },
    });
  });

  console.log(`[seed-auth-qa] OK — seeded study artifacts for ${email} (user ${user.id.slice(0, 8)}…).`);
  console.log("[seed-auth-qa] Weak/strong topic stats, pathway progress, flashcards, readiness row, planner, practice rows.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
