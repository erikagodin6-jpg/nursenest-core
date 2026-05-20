import { randomBytes } from "node:crypto";
import { CountryCode, TierCode, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { syntheticPathwayLessonId } from "@/lib/lessons/pathway-lesson-progress";

/** Reserved for admin-created demo accounts; public signup must reject this domain. */
export const DEMO_USER_EMAIL_DOMAIN = "nursenest.demo.invalid";

export function buildDemoUserEmail(): string {
  const token = randomBytes(10).toString("hex");
  return `demo+${token}@${DEMO_USER_EMAIL_DOMAIN}`;
}

export type CreateDemoUserInput = {
  pathwayId: string;
  /** Explicit count of pathway lessons to mark completed (capped by published lessons). */
  completedLessonCount?: number;
  /** Alternative: percent of published hub lessons to complete (0–100). */
  lessonCompletionPercent?: number;
  /** Target 0–100 for seeded mock exam score (if a published Exam exists for tier/country). */
  readinessScoreTarget?: number;
};

export type CreateDemoUserResult =
  | {
      ok: true;
      userId: string;
      email: string;
      /** One-time password for QA login; store securely and rotate by deleting user. */
      plaintextPassword: string;
      lessonsCompleted: number;
      lessonsPublished: number;
      examAttemptSeeded: boolean;
    }
  | { ok: false; code: string; message: string };

function resolveCompletedCount(args: {
  totalPublished: number;
  completedLessonCount?: number;
  lessonCompletionPercent?: number;
}): number {
  const { totalPublished, completedLessonCount, lessonCompletionPercent } = args;
  if (totalPublished <= 0) return 0;
  if (typeof completedLessonCount === "number" && completedLessonCount >= 0) {
    return Math.min(totalPublished, completedLessonCount);
  }
  if (typeof lessonCompletionPercent === "number" && lessonCompletionPercent >= 0) {
    const n = Math.round((lessonCompletionPercent / 100) * totalPublished);
    return Math.min(totalPublished, Math.max(0, n));
  }
  return Math.min(totalPublished, 5);
}

/**
 * Creates a learner with isDemoUser, active non-Stripe subscription, pathway progress,
 * and optionally a mock exam attempt for readiness signals.
 */
export async function createDemoUser(input: CreateDemoUserInput): Promise<CreateDemoUserResult> {
  const pathway = getExamPathwayById(input.pathwayId);
  if (!pathway) {
    return { ok: false, code: "unknown_pathway", message: "Unknown pathwayId." };
  }

  const lessons = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId: input.pathwayId,
      locale: "en",
      status: "PUBLISHED",
    },
    select: { slug: true },
    orderBy: [{ sortOrder: "asc" }, { topicSlug: "asc" }, { slug: "asc" }],
    take: 500,
  });

  const totalPublished = lessons.length;
  const nComplete = resolveCompletedCount({
    totalPublished,
    completedLessonCount: input.completedLessonCount,
    lessonCompletionPercent: input.lessonCompletionPercent,
  });

  const email = buildDemoUserEmail();
  const normalizedEmail = email.toLowerCase();
  const plaintextPassword = randomBytes(18).toString("base64url");
  const passwordHash = await hash(plaintextPassword, 12);

  const tier = pathway.stripeTier;
  const country = pathway.countryCode;
  const readinessTarget = Math.min(100, Math.max(0, Math.round(input.readinessScoreTarget ?? 75)));

  const stripeSubscriptionId = `demo_sub_${randomBytes(12).toString("hex")}`;

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        normalizedEmail,
        name: `Demo ${pathway.shortName} learner`,
        passwordHash,
        emailVerified: true,
        isDemoUser: true,
        role: UserRole.LEARNER,
        country,
        tier: tier as TierCode,
        learnerPath: pathway.id,
        authProvider: "credentials",
      },
      select: { id: true },
    });

    await tx.subscription.create({
      data: {
        userId: user.id,
        status: "ACTIVE",
        stripeSubscriptionId,
        stripeCustomerId: null,
        planTier: tier as TierCode,
        planCountry: country as CountryCode,
        planDuration: "demo",
        planCode: "demo_admin",
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
      },
    });

    const progressRows = lessons.slice(0, nComplete).map((l) => ({
      userId: user.id,
      lessonId: syntheticPathwayLessonId(pathway.id, l.slug),
      completed: true,
    }));

    if (progressRows.length > 0) {
      await tx.progress.createMany({ data: progressRows });
    }

    let examAttemptSeeded = false;
    const exam = await tx.exam.findFirst({
      where: {
        tier: tier as TierCode,
        country: country as CountryCode,
        status: "PUBLISHED",
      },
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });

    if (exam) {
      const total = 75;
      const score = Math.round((readinessTarget / 100) * total);
      await tx.examAttempt.create({
        data: {
          userId: user.id,
          examId: exam.id,
          score,
          total,
          results: { demoSeeded: true, readinessScoreTarget: readinessTarget },
        },
      });
      examAttemptSeeded = true;
    }

    return {
      userId: user.id,
      lessonsCompleted: progressRows.length,
      examAttemptSeeded,
    };
  });

  return {
    ok: true,
    userId: result.userId,
    email,
    plaintextPassword,
    lessonsCompleted: result.lessonsCompleted,
    lessonsPublished: totalPublished,
    examAttemptSeeded: result.examAttemptSeeded,
  };
}
