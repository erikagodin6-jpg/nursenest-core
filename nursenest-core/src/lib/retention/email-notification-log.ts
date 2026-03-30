import { prisma } from "@/lib/db";

export const EMAIL_KIND = {
  welcome: "welcome",
  firstExam: "first_exam",
  weakArea: "weak_area",
  inactiveNudge: "inactive_nudge",
  progressDigest: "progress_digest",
  studyPlanNudge: "study_plan_nudge",
} as const;

export type EmailKind = (typeof EMAIL_KIND)[keyof typeof EMAIL_KIND];

export async function hasSentEmail(userId: string, kind: string): Promise<boolean> {
  const n = await prisma.emailNotificationLog.count({ where: { userId, kind } });
  return n > 0;
}

/** Returns true if no row with this kind in the last `withinMs` milliseconds. */
export async function canSendWithinCooldown(userId: string, kind: string, withinMs: number): Promise<boolean> {
  const since = new Date(Date.now() - withinMs);
  const n = await prisma.emailNotificationLog.count({
    where: { userId, kind, createdAt: { gte: since } },
  });
  return n === 0;
}

export async function recordEmailSent(userId: string, kind: string, meta?: Record<string, unknown>): Promise<void> {
  await prisma.emailNotificationLog.create({
    data: { userId, kind, meta: meta ?? undefined },
  });
}
