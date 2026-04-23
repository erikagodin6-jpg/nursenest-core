import "server-only";

import { sendTransactionalEmailHtml } from "@/lib/email/resend-transactional";
import { prisma } from "@/lib/db";
import { getVerifiedAdminLearnerQaSimulation } from "@/lib/admin/admin-learner-qa-simulation";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  canSendWithinCooldown,
  EMAIL_KIND,
  hasSentEmail,
  recordEmailSent,
} from "@/lib/retention/email-notification-log";
import { buildLearnerEngagementEmailContext } from "@/lib/retention/learner-engagement-email-context";
import {
  engagementGlobalCapReached,
  gateLearnerEngagementEmailSend,
  type LearnerEngagementEmailUserRow,
} from "@/lib/retention/learner-engagement-email-eligibility";
import {
  firstExamEmailHtml,
  inactiveNudgeEmailHtml,
  milestoneLessonsEmailHtml,
  newContentRoundupEmailHtml,
  progressDigestEmailHtml,
  studyPlanReminderEmailHtml,
  weakAreaEmailHtml,
  weakAreaStudyNudgeEmailHtml,
  welcomeEmailHtml,
  welcomeFollowup3EmailHtml,
  welcomeFollowup7EmailHtml,
} from "@/lib/retention/retention-templates";

const MS_DAY = 24 * 60 * 60 * 1000;
const INACTIVE_AFTER_MS = 4 * MS_DAY;

function emailContextFromUserRow(user: LearnerEngagementEmailUserRow) {
  return buildLearnerEngagementEmailContext({
    name: user.name,
    tier: user.tier,
    learnerPath: user.learnerPath,
    alliedProfessionKey: user.alliedProfessionKey,
  });
}

export async function sendWelcomeEmailIfNeeded(userId: string): Promise<void> {
  try {
    if (await hasSentEmail(userId, EMAIL_KIND.welcome)) return;
    const gate = await gateLearnerEngagementEmailSend({
      userId,
      enforceWeeklyCap: false,
      requireVerifiedEmail: false,
    });
    if (!gate.ok) return;
    const ctx = emailContextFromUserRow(gate.user);
    const { subject, html, text } = welcomeEmailHtml(gate.user.name, ctx);
    const r = await sendTransactionalEmailHtml({ to: gate.user.email, subject, html, text });
    if (r.ok) await recordEmailSent(userId, EMAIL_KIND.welcome);
  } catch (e) {
    safeServerLog("retention", "welcome_failed", { userId, message: String(e).slice(0, 200) });
  }
}

/** Welcome day-3 tip — window 3–21 days after signup, once. Caller should enforce max one send per cron per user. */
export async function sendWelcomeFollowup3dIfNeeded(
  userId: string,
  user: LearnerEngagementEmailUserRow,
  nowMs: number,
): Promise<boolean> {
  try {
    if (await hasSentEmail(userId, EMAIL_KIND.welcomeFollowup3d)) return false;
    const age = nowMs - user.createdAt.getTime();
    if (age < 3 * MS_DAY || age > 21 * MS_DAY) return false;
    if (await engagementGlobalCapReached(userId)) return false;
    const ctx = emailContextFromUserRow(user);
    const { subject, html, text } = welcomeFollowup3EmailHtml(ctx);
    const r = await sendTransactionalEmailHtml({ to: user.email, subject, html, text });
    if (r.ok) {
      await recordEmailSent(userId, EMAIL_KIND.welcomeFollowup3d);
      return true;
    }
  } catch (e) {
    safeServerLog("retention", "welcome_3d_failed", { userId, message: String(e).slice(0, 200) });
  }
  return false;
}

/** Welcome day-7 rhythm — 7–28 days after signup, once. */
export async function sendWelcomeFollowup7dIfNeeded(
  userId: string,
  user: LearnerEngagementEmailUserRow,
  nowMs: number,
): Promise<boolean> {
  try {
    if (await hasSentEmail(userId, EMAIL_KIND.welcomeFollowup7d)) return false;
    const age = nowMs - user.createdAt.getTime();
    if (age < 7 * MS_DAY || age > 28 * MS_DAY) return false;
    if (await engagementGlobalCapReached(userId)) return false;
    const ctx = emailContextFromUserRow(user);
    const { subject, html, text } = welcomeFollowup7EmailHtml(ctx);
    const r = await sendTransactionalEmailHtml({ to: user.email, subject, html, text });
    if (r.ok) {
      await recordEmailSent(userId, EMAIL_KIND.welcomeFollowup7d);
      return true;
    }
  } catch (e) {
    safeServerLog("retention", "welcome_7d_failed", { userId, message: String(e).slice(0, 200) });
  }
  return false;
}

export async function sendFirstExamEmailIfNeeded(userId: string, score: number, total: number): Promise<void> {
  try {
    if (await hasSentEmail(userId, EMAIL_KIND.firstExam)) return;
    const count = await prisma.examAttempt.count({ where: { userId } });
    if (count !== 1) return;
    const gate = await gateLearnerEngagementEmailSend({
      userId,
      enforceWeeklyCap: false,
      requireVerifiedEmail: false,
    });
    if (!gate.ok) return;
    const ctx = emailContextFromUserRow(gate.user);
    const { subject, html, text } = firstExamEmailHtml(score, total, ctx);
    const r = await sendTransactionalEmailHtml({ to: gate.user.email, subject, html, text });
    if (r.ok) await recordEmailSent(userId, EMAIL_KIND.firstExam, { score, total });
  } catch (e) {
    safeServerLog("retention", "first_exam_failed", { userId, message: String(e).slice(0, 200) });
  }
}

export async function sendWeakAreaEmailIfNeeded(userId: string, score: number, total: number): Promise<void> {
  try {
    if (total < 5) return;
    const ratio = score / total;
    if (ratio >= 0.65) return;
    if (!(await canSendWithinCooldown(userId, EMAIL_KIND.weakArea, 7 * MS_DAY))) return;
    const gate = await gateLearnerEngagementEmailSend({
      userId,
      enforceWeeklyCap: true,
      requireVerifiedEmail: false,
    });
    if (!gate.ok) return;
    if (gate.user.enableWeaknessAlerts === false) return;
    const hint = gate.user.examFocus
      ? `You noted ${gate.user.examFocus} as a focus. Drill that area plus safety and prioritization items.`
      : "You missed questions in core clinical judgment areas. Try five more in safety and prioritization.";
    const ctx = emailContextFromUserRow(gate.user);
    const { subject, html, text } = weakAreaEmailHtml(hint, ctx);
    const r = await sendTransactionalEmailHtml({ to: gate.user.email, subject, html, text });
    if (r.ok) await recordEmailSent(userId, EMAIL_KIND.weakArea, { score, total });
  } catch (e) {
    safeServerLog("retention", "weak_area_failed", { userId, message: String(e).slice(0, 200) });
  }
}

/**
 * After a graded mock — skips when admin learner QA cookie is active for this user (simulated tier/session).
 */
export function fireExamRetentionEmails(userId: string, score: number, total: number): void {
  void (async () => {
    const qa = await getVerifiedAdminLearnerQaSimulation(userId);
    if (qa) {
      safeServerLog("retention", "exam_emails_skipped_qa", { userIdPrefix: userId.slice(0, 8) });
      return;
    }
    await sendFirstExamEmailIfNeeded(userId, score, total);
    await sendWeakAreaEmailIfNeeded(userId, score, total);
  })();
}

export async function sendInactiveNudgeIfNeeded(userId: string): Promise<boolean> {
  const gate = await gateLearnerEngagementEmailSend({
    userId,
    enforceWeeklyCap: true,
    requireVerifiedEmail: true,
  });
  if (!gate.ok) return false;
  if (!(await canSendWithinCooldown(userId, EMAIL_KIND.inactiveNudge, 7 * MS_DAY))) return false;
  const last = gate.user.lastLoginAt ?? gate.user.updatedAt;
  if (Date.now() - last.getTime() < INACTIVE_AFTER_MS) return false;
  const ctx = emailContextFromUserRow(gate.user);
  const { subject, html, text } = inactiveNudgeEmailHtml(ctx);
  const r = await sendTransactionalEmailHtml({ to: gate.user.email, subject, html, text });
  if (r.ok) {
    await recordEmailSent(userId, EMAIL_KIND.inactiveNudge);
    return true;
  }
  return false;
}

export async function sendWeakAreaStudyNudgeCronIfNeeded(
  userId: string,
  user: LearnerEngagementEmailUserRow,
  topicLabel: string,
): Promise<boolean> {
  try {
    if (user.enableWeaknessAlerts === false) return false;
    if (!(await canSendWithinCooldown(userId, EMAIL_KIND.weakAreaStudyNudge, 10 * MS_DAY))) return false;
    if (await engagementGlobalCapReached(userId)) return false;
    const ctx = emailContextFromUserRow(user);
    const { subject, html, text } = weakAreaStudyNudgeEmailHtml(topicLabel, ctx);
    const r = await sendTransactionalEmailHtml({ to: user.email, subject, html, text });
    if (r.ok) {
      await recordEmailSent(userId, EMAIL_KIND.weakAreaStudyNudge, { topicLabel });
      return true;
    }
  } catch (e) {
    safeServerLog("retention", "weak_area_nudge_failed", { userId, message: String(e).slice(0, 200) });
  }
  return false;
}

export async function sendProgressDigestIfNeeded(userId: string): Promise<boolean> {
  const gate = await gateLearnerEngagementEmailSend({
    userId,
    enforceWeeklyCap: true,
    requireVerifiedEmail: true,
  });
  if (!gate.ok) return false;
  if (!(await canSendWithinCooldown(userId, EMAIL_KIND.progressDigest, 14 * MS_DAY))) return false;
  const attempts = await prisma.examAttempt.count({ where: { userId } });
  if (attempts < 1) return false;
  const last = await prisma.examAttempt.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { score: true, total: true },
  });
  const lastPct = last && last.total > 0 ? Math.round((last.score / last.total) * 100) : null;
  const ctx = emailContextFromUserRow(gate.user);
  const { subject, html, text } = progressDigestEmailHtml(attempts, lastPct, ctx);
  const r = await sendTransactionalEmailHtml({ to: gate.user.email, subject, html, text });
  if (r.ok) {
    await recordEmailSent(userId, EMAIL_KIND.progressDigest, { attempts, lastPct });
    return true;
  }
  return false;
}

export async function sendStudyPlanReminderIfNeeded(userId: string): Promise<boolean> {
  const gate = await gateLearnerEngagementEmailSend({
    userId,
    enforceWeeklyCap: true,
    requireVerifiedEmail: true,
  });
  if (!gate.ok) return false;
  if (!gate.user.studyGoal?.trim() && !(typeof gate.user.dailyStudyMinutes === "number" && gate.user.dailyStudyMinutes > 0)) {
    return false;
  }
  if (!(await canSendWithinCooldown(userId, EMAIL_KIND.studyPlanNudge, 7 * MS_DAY))) return false;
  const ctx = emailContextFromUserRow(gate.user);
  const { subject, html, text } = studyPlanReminderEmailHtml(ctx);
  const r = await sendTransactionalEmailHtml({ to: gate.user.email, subject, html, text });
  if (r.ok) {
    await recordEmailSent(userId, EMAIL_KIND.studyPlanNudge);
    return true;
  }
  return false;
}

const MILESTONE_THRESHOLDS = [10, 25, 50] as const;

export async function sendMilestoneLessonsEmailIfNeeded(userId: string): Promise<boolean> {
  const gate = await gateLearnerEngagementEmailSend({
    userId,
    enforceWeeklyCap: true,
    requireVerifiedEmail: true,
  });
  if (!gate.ok) return false;
  const completed = await prisma.progress.count({ where: { userId, completed: true } });
  let threshold: (typeof MILESTONE_THRESHOLDS)[number] | null = null;
  for (const t of MILESTONE_THRESHOLDS) {
    if (completed >= t) threshold = t;
  }
  if (!threshold) return false;
  const kindKey = `${EMAIL_KIND.milestoneLessons}:${threshold}`;
  if (await hasSentEmail(userId, kindKey)) return false;
  if (!(await canSendWithinCooldown(userId, kindKey, 60 * MS_DAY))) return false;
  const ctx = emailContextFromUserRow(gate.user);
  const { subject, html, text } = milestoneLessonsEmailHtml(completed, ctx);
  const r = await sendTransactionalEmailHtml({ to: gate.user.email, subject, html, text });
  if (r.ok) {
    await recordEmailSent(userId, kindKey, { completed, threshold });
    return true;
  }
  return false;
}

export async function sendNewContentRoundupIfNeeded(userId: string): Promise<boolean> {
  const gate = await gateLearnerEngagementEmailSend({
    userId,
    enforceWeeklyCap: true,
    requireVerifiedEmail: true,
  });
  if (!gate.ok) return false;
  if (!(await canSendWithinCooldown(userId, EMAIL_KIND.newContentRoundup, 14 * MS_DAY))) return false;
  const ctx = emailContextFromUserRow(gate.user);
  const { subject, html, text } = newContentRoundupEmailHtml(ctx);
  const r = await sendTransactionalEmailHtml({ to: gate.user.email, subject, html, text });
  if (r.ok) {
    await recordEmailSent(userId, EMAIL_KIND.newContentRoundup);
    return true;
  }
  return false;
}
