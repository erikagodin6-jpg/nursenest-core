import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  sendInactiveNudgeIfNeeded,
  sendProgressDigestIfNeeded,
  sendStudyPlanReminderIfNeeded,
} from "@/lib/retention/retention-email";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
const BATCH = 80;
const MAX_INACTIVE_PER_RUN = 25;
const MAX_PROGRESS_PER_RUN = 8;
const MAX_STUDY_PLAN_PER_RUN = 15;

/**
 * Finds learners inactive for ~2 days (no exam attempt, no exam session touch) and sends nudges.
 * Also sends occasional progress digests and study-plan reminders within cooldown rules.
 */
export async function runRetentionCronScan(): Promise<{
  scanned: number;
  inactiveSent: number;
  progressSent: number;
  studyPlanSent: number;
}> {
  const cutoff = new Date(Date.now() - TWO_DAYS_MS);
  let inactiveSent = 0;
  let progressSent = 0;
  let studyPlanSent = 0;

  const candidates = await prisma.user.findMany({
    where: { role: UserRole.LEARNER },
    select: { id: true, createdAt: true },
    take: BATCH * 3,
    orderBy: { updatedAt: "desc" },
  });

  let scanned = 0;
  for (const u of candidates) {
    scanned += 1;
    try {
      const lastAttempt = await prisma.examAttempt.findFirst({
        where: { userId: u.id },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      });
      const lastSession = await prisma.examSession.findFirst({
        where: { userId: u.id },
        orderBy: { updatedAt: "desc" },
        select: { updatedAt: true },
      });
      const lastTouch = Math.max(
        lastAttempt?.createdAt.getTime() ?? 0,
        lastSession?.updatedAt.getTime() ?? 0,
        u.createdAt.getTime(),
      );
      if (lastTouch > cutoff.getTime()) continue;

      if (await sendInactiveNudgeIfNeeded(u.id)) inactiveSent += 1;
    } catch (e) {
      safeServerLog("retention", "inactive_scan_row_failed", { userId: u.id, message: String(e).slice(0, 120) });
    }
  }

  /** Second pass: progress digest for active studiers (lighter batch) */
  const progressCandidates = await prisma.user.findMany({
    where: { role: UserRole.LEARNER },
    select: { id: true },
    take: BATCH,
    orderBy: { createdAt: "desc" },
  });
  for (const u of progressCandidates) {
    try {
      if (await sendProgressDigestIfNeeded(u.id)) progressSent += 1;
    } catch {
      /* ignore */
    }
  }

  /** Study plan nudges */
  const planCandidates = await prisma.user.findMany({
    where: {
      role: UserRole.LEARNER,
      OR: [{ studyGoal: { not: null } }, { dailyStudyMinutes: { not: null } }],
    },
    select: { id: true },
    take: 40,
  });
  for (const u of planCandidates) {
    try {
      if (await sendStudyPlanReminderIfNeeded(u.id)) studyPlanSent += 1;
    } catch {
      /* ignore */
    }
  }

  return { scanned, inactiveSent, progressSent, studyPlanSent };
}
