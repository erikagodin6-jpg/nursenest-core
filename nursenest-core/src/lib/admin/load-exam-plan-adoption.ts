import { ExamDatePlanType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export type ExamPlanAdoptionStats = {
  generatedAt: string;
  totalUsers: number;
  unsure: number;
  proposed: number;
  confirmed: number;
  /** Proposed or confirmed but missing examDate (should be rare). */
  datedPlanMissingDate: number;
  /** examDate within next 30 days (UTC), plan has a date. */
  examWithin30Days: number;
  /** examDate before today UTC. */
  overdueExamDate: number;
  cadenceLight: number;
  cadenceSteady: number;
  cadenceIntensive: number;
  cadenceUnset: number;
};

/**
 * Product visibility: how learners distribute across exam-plan states. Best-effort when DB is down.
 */
export async function loadExamPlanAdoptionStats(): Promise<ExamPlanAdoptionStats | null> {
  if (!isDatabaseUrlConfigured()) return null;
  const now = new Date();
  const utcStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const in30 = new Date(utcStart);
  in30.setUTCDate(in30.getUTCDate() + 30);

  try {
    const [
      totalUsers,
      unsure,
      proposed,
      confirmed,
      datedPlanMissingDate,
      overdueExamDate,
      examWithin30Days,
      cadenceLight,
      cadenceSteady,
      cadenceIntensive,
      cadenceUnset,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { examDatePlanType: ExamDatePlanType.UNSURE } }),
      prisma.user.count({ where: { examDatePlanType: ExamDatePlanType.PROPOSED } }),
      prisma.user.count({ where: { examDatePlanType: ExamDatePlanType.CONFIRMED } }),
      prisma.user.count({
        where: {
          examDatePlanType: { in: [ExamDatePlanType.PROPOSED, ExamDatePlanType.CONFIRMED] },
          examDate: null,
        },
      }),
      prisma.user.count({
        where: { examDate: { not: null, lt: utcStart } },
      }),
      prisma.user.count({
        where: {
          examDate: { not: null, gte: utcStart, lte: in30 },
        },
      }),
      prisma.user.count({ where: { studyCadencePreference: "light" } }),
      prisma.user.count({ where: { studyCadencePreference: "steady" } }),
      prisma.user.count({ where: { studyCadencePreference: "intensive" } }),
      prisma.user.count({ where: { studyCadencePreference: null } }),
    ]);

    return {
      generatedAt: new Date().toISOString(),
      totalUsers,
      unsure,
      proposed,
      confirmed,
      datedPlanMissingDate,
      examWithin30Days,
      overdueExamDate,
      cadenceLight,
      cadenceSteady,
      cadenceIntensive,
      cadenceUnset,
    };
  } catch {
    return null;
  }
}
