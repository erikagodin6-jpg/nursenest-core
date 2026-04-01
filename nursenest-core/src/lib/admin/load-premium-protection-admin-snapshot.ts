import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { getServerPremiumProtectionFlags, type PremiumProtectionFlags } from "@/lib/premium-protection/config";
import { utcDayDate } from "@/lib/premium-protection/telemetry-db";

export const PREMIUM_PROTECTION_ENV_VARS = [
  "PREMIUM_COPY_DETERRENCE",
  "PREMIUM_WATERMARK",
  "PREMIUM_PRINT_HIDE_PROTECTED",
  "PREMIUM_BLUR_ON_TAB_HIDDEN",
] as const;

export type PremiumProtectionAdminSnapshot = {
  generatedAt: string;
  flags: PremiumProtectionFlags;
  envVarNames: readonly string[];
  /** UTC date key for rollup rows below. */
  utcDay: string;
  todayRollups: Array<{ metricKey: string; segment: string; count: number }>;
  notesTotal: number;
  notesUpdatedLast24h: number;
  openAbuseReviews: Array<{
    id: string;
    userId: string;
    userEmailSample: string;
    reason: string;
    score: number;
    createdAt: string;
  }>;
};

function emailSample(email: string): string {
  const at = email.indexOf("@");
  if (at <= 1) return "***";
  return `${email.slice(0, 2)}…@${email.slice(at + 1)}`;
}

export async function loadPremiumProtectionAdminSnapshot(): Promise<PremiumProtectionAdminSnapshot | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return null;
  const generatedAt = new Date().toISOString();
  const day = utcDayDate();
  const dayStart = new Date(day);
  const dayEnd = new Date(day);
  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
  const since24h = new Date(Date.now() - 86400000);

  try {
    const [flags, todayRollups, notesTotal, notesUpdatedLast24h, openReviews, reviewUsers] = await Promise.all([
      Promise.resolve(getServerPremiumProtectionFlags()),
      prisma.premiumProtectionRollup.findMany({
        where: { day },
        orderBy: [{ count: "desc" }],
        take: 48,
        select: { metricKey: true, segment: true, count: true },
      }),
      prisma.learnerNote.count(),
      prisma.learnerNote.count({ where: { updatedAt: { gte: since24h } } }),
      prisma.protectionAbuseReview.findMany({
        where: { dismissedAt: null },
        orderBy: { createdAt: "desc" },
        take: 25,
        select: { id: true, userId: true, reason: true, score: true, createdAt: true },
      }),
      prisma.user.findMany({
        where: {
          id: {
            in: [],
          },
        },
        select: { id: true, email: true },
      }),
    ]);

    const userIds = [...new Set(openReviews.map((r) => r.userId))];
    const users =
      userIds.length === 0
        ? []
        : await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, email: true },
          });
    const emailById = new Map(users.map((u) => [u.id, u.email]));

    return {
      generatedAt,
      flags,
      envVarNames: PREMIUM_PROTECTION_ENV_VARS,
      utcDay: day.toISOString().slice(0, 10),
      todayRollups: todayRollups.map((r) => ({
        metricKey: r.metricKey,
        segment: r.segment,
        count: r.count,
      })),
      notesTotal,
      notesUpdatedLast24h,
      openAbuseReviews: openReviews.map((r) => ({
        id: r.id,
        userId: r.userId,
        userEmailSample: emailSample(emailById.get(r.userId) ?? ""),
        reason: r.reason,
        score: r.score,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  } catch (e) {
    console.error("[loadPremiumProtectionAdminSnapshot]", e);
    return null;
  }
}
