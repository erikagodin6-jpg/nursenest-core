import { sendTransactionalEmailHtml } from "@/lib/email/resend-transactional";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  canSendWithinCooldown,
  EMAIL_KIND,
  hasSentEmail,
  recordEmailSent,
} from "@/lib/retention/email-notification-log";
import {
  firstExamEmailHtml,
  inactiveNudgeEmailHtml,
  progressDigestEmailHtml,
  studyPlanReminderEmailHtml,
  weakAreaEmailHtml,
  welcomeEmailHtml,
} from "@/lib/retention/retention-templates";

const MS_DAY = 24 * 60 * 60 * 1000;

export async function sendWelcomeEmailIfNeeded(userId: string): Promise<void> {
  try {
    if (await hasSentEmail(userId, EMAIL_KIND.welcome)) return;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });
    if (!user) return;
    const { subject, html, text } = welcomeEmailHtml(user.name);
    const r = await sendTransactionalEmailHtml({ to: user.email, subject, html, text });
    if (r.ok) await recordEmailSent(userId, EMAIL_KIND.welcome);
  } catch (e) {
    safeServerLog("retention", "welcome_failed", { userId, message: String(e).slice(0, 200) });
  }
}

export async function sendFirstExamEmailIfNeeded(
  userId: string,
  score: number,
  total: number,
): Promise<void> {
  try {
    if (await hasSentEmail(userId, EMAIL_KIND.firstExam)) return;
    const count = await prisma.examAttempt.count({ where: { userId } });
    if (count !== 1) return;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) return;
    const { subject, html, text } = firstExamEmailHtml(score, total);
    const r = await sendTransactionalEmailHtml({ to: user.email, subject, html, text });
    if (r.ok) await recordEmailSent(userId, EMAIL_KIND.firstExam, { score, total });
  } catch (e) {
    safeServerLog("retention", "first_exam_failed", { userId, message: String(e).slice(0, 200) });
  }
}

export async function sendWeakAreaEmailIfNeeded(
  userId: string,
  score: number,
  total: number,
): Promise<void> {
  try {
    if (total < 5) return;
    const ratio = score / total;
    if (ratio >= 0.65) return;
    if (!(await canSendWithinCooldown(userId, EMAIL_KIND.weakArea, 7 * MS_DAY))) return;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, examFocus: true },
    });
    if (!user) return;
    const hint = user.examFocus
      ? `You noted ${user.examFocus} as a focus. Drill that area plus safety and prioritization.`
      : "You missed questions in core clinical judgment areas. Try five more in safety and prioritization.";
    const { subject, html, text } = weakAreaEmailHtml(hint);
    const r = await sendTransactionalEmailHtml({ to: user.email, subject, html, text });
    if (r.ok) await recordEmailSent(userId, EMAIL_KIND.weakArea, { score, total });
  } catch (e) {
    safeServerLog("retention", "weak_area_failed", { userId, message: String(e).slice(0, 200) });
  }
}

/** Fire-and-forget hooks after a successful exam attempt is recorded (subscriber flow). */
export function fireExamRetentionEmails(userId: string, score: number, total: number): void {
  void sendFirstExamEmailIfNeeded(userId, score, total);
  void sendWeakAreaEmailIfNeeded(userId, score, total);
}

export async function sendInactiveNudgeIfNeeded(userId: string): Promise<boolean> {
  if (!(await canSendWithinCooldown(userId, EMAIL_KIND.inactiveNudge, 7 * MS_DAY))) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!user) return false;
  const { subject, html, text } = inactiveNudgeEmailHtml();
  const r = await sendTransactionalEmailHtml({ to: user.email, subject, html, text });
  if (r.ok) {
    await recordEmailSent(userId, EMAIL_KIND.inactiveNudge);
    return true;
  }
  return false;
}

export async function sendProgressDigestIfNeeded(userId: string): Promise<boolean> {
  if (!(await canSendWithinCooldown(userId, EMAIL_KIND.progressDigest, 14 * MS_DAY))) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!user) return false;
  const attempts = await prisma.examAttempt.count({ where: { userId } });
  if (attempts < 1) return false;
  const last = await prisma.examAttempt.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { score: true, total: true },
  });
  const lastPct =
    last && last.total > 0 ? Math.round((last.score / last.total) * 100) : null;
  const { subject, html, text } = progressDigestEmailHtml(attempts, lastPct);
  const r = await sendTransactionalEmailHtml({ to: user.email, subject, html, text });
  if (r.ok) {
    await recordEmailSent(userId, EMAIL_KIND.progressDigest, { attempts, lastPct });
    return true;
  }
  return false;
}

export async function sendStudyPlanReminderIfNeeded(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, studyGoal: true, dailyStudyMinutes: true },
  });
  if (!user || (!user.studyGoal && !user.dailyStudyMinutes)) return false;
  if (!(await canSendWithinCooldown(userId, EMAIL_KIND.studyPlanNudge, 7 * MS_DAY))) return false;
  const { subject, html, text } = studyPlanReminderEmailHtml();
  const r = await sendTransactionalEmailHtml({ to: user.email, subject, html, text });
  if (r.ok) {
    await recordEmailSent(userId, EMAIL_KIND.studyPlanNudge);
    return true;
  }
  return false;
}
