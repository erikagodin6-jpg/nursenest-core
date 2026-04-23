import "server-only";

import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { accessScopeFromUserAccess, getUserAccess } from "@/lib/entitlements/get-user-access";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import { gateLearnerEngagementEmailSend } from "@/lib/retention/learner-engagement-email-eligibility";
import {
  sendInactiveNudgeIfNeeded,
  sendMilestoneLessonsEmailIfNeeded,
  sendNewContentRoundupIfNeeded,
  sendProgressDigestIfNeeded,
  sendStudyPlanReminderIfNeeded,
  sendWelcomeFollowup3dIfNeeded,
  sendWelcomeFollowup7dIfNeeded,
  sendWeakAreaStudyNudgeCronIfNeeded,
} from "@/lib/retention/retention-email";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Bounded batch for scheduled engagement email. At most **one** send per user per invocation
 * to avoid noisy bursts when multiple rules match.
 */
export async function runLearnerEngagementEmailBatch(args: { take?: number }): Promise<Record<string, number>> {
  const take = Math.min(Math.max(args.take ?? 40, 1), 120);
  const stats = {
    scanned: 0,
    sent: 0,
    welcome3d: 0,
    welcome7d: 0,
    inactive: 0,
    weakNudge: 0,
    studyPlan: 0,
    progress: 0,
    milestone: 0,
    newContent: 0,
    skippedGate: 0,
    errors: 0,
  };

  if (!isDatabaseUrlConfigured()) return stats;

  const nowMs = Date.now();

  const users = await prisma.user.findMany({
    where: {
      role: "LEARNER",
      isDemoUser: false,
      emailEngagementOptOut: false,
      subscriptions: { some: { status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] } } },
    },
    select: { id: true },
    orderBy: { updatedAt: "desc" },
    take,
  });

  for (const u of users) {
    stats.scanned += 1;
    try {
      const gate = await gateLearnerEngagementEmailSend({
        userId: u.id,
        enforceWeeklyCap: true,
        requireVerifiedEmail: true,
      });
      if (!gate.ok) {
        stats.skippedGate += 1;
        continue;
      }

      let sent = false;
      const once = async (fn: () => Promise<boolean>, bump: () => void) => {
        if (sent) return;
        if (await fn()) {
          sent = true;
          stats.sent += 1;
          bump();
        }
      };

      await once(() => sendWelcomeFollowup3dIfNeeded(u.id, gate.user, nowMs), () => {
        stats.welcome3d += 1;
      });
      await once(() => sendWelcomeFollowup7dIfNeeded(u.id, gate.user, nowMs), () => {
        stats.welcome7d += 1;
      });
      await once(() => sendInactiveNudgeIfNeeded(u.id), () => {
        stats.inactive += 1;
      });

      await once(
        async () => {
          let access;
          try {
            access = await getUserAccess(u.id);
          } catch {
            return false;
          }
          const entitlement = accessScopeFromUserAccess(access);
          if (!entitlement.hasAccess) return false;
          const perf = await loadUnifiedTopicPerformance(u.id, entitlement, 6);
          const weakLabel = perf.weakTopics[0]?.topic?.trim();
          if (!weakLabel) return false;
          return sendWeakAreaStudyNudgeCronIfNeeded(u.id, gate.user, weakLabel);
        },
        () => {
          stats.weakNudge += 1;
        },
      );

      await once(() => sendStudyPlanReminderIfNeeded(u.id), () => {
        stats.studyPlan += 1;
      });
      await once(() => sendProgressDigestIfNeeded(u.id), () => {
        stats.progress += 1;
      });
      await once(() => sendMilestoneLessonsEmailIfNeeded(u.id), () => {
        stats.milestone += 1;
      });
      await once(() => sendNewContentRoundupIfNeeded(u.id), () => {
        stats.newContent += 1;
      });
    } catch {
      stats.errors += 1;
    }
  }

  safeServerLog("retention", "engagement_batch_complete", stats);
  return stats;
}
