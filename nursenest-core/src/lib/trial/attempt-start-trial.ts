import { Prisma, TrialStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { checkRateLimitUnified } from "@/lib/http/rate-limit-unified";
import { hashTrialDeviceFingerprint } from "@/lib/trial/trial-fingerprint";
import { TRIAL_DURATION_MS } from "@/lib/trial/trial-constants";
import { captureServerEvent, analyticsDistinctId } from "@/lib/observability/posthog-server";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { expireStaleTrialForUser } from "@/lib/trial/expire-stale-trial";
import { getStripeClient } from "@/lib/stripe/stripe-client";
import { recordPremiumProtectionAbuseFromLog } from "@/lib/premium-protection/telemetry-db";
import { assessTrialEligibility } from "@/lib/trial/trial-eligibility";

export type StartTrialResult =
  | { ok: true; trialEndsAt: string }
  | { ok: false; code: string; message: string; status: number };

/**
 * If Stripe finds any subscription (past or present) on this email, deny trial
 * (payment / customer reuse — paid checkout remains available).
 */
async function stripeEmailHasSubscriptionHistory(email: string): Promise<boolean> {
  if (process.env.TRIAL_STRIPE_EMAIL_CHECK === "false") return false;
  const stripe = await getStripeClient();
  if (!stripe) return false;
  try {
    const customers = await stripe.customers.list({ email: email.toLowerCase(), limit: 20 });
    for (const c of customers.data) {
      const subs = await stripe.subscriptions.list({ customer: c.id, status: "all", limit: 5 });
      if (subs.data.length > 0) return true;
    }
  } catch (e) {
    safeServerLog("trial", "stripe_email_probe_failed", { detail: e instanceof Error ? e.message.slice(0, 120) : "unknown" });
  }
  return false;
}

function recordTrialBlock(userId: string, reason: string): void {
  void recordPremiumProtectionAbuseFromLog({
    kind: `trial_block_${reason}`,
    route: "trial_start",
    userId,
  }).catch(() => {});
}

/**
 * Starts a one-time 3-day trial: full subscriber-equivalent entitlement for the user’s profile tier + country.
 */
export async function attemptStartTrial(args: {
  userId: string;
  deviceId: string;
  ip: string;
}): Promise<StartTrialResult> {
  const { userId, deviceId, ip } = args;

  if (!isDatabaseUrlConfigured()) {
    return { ok: false, code: "db_unavailable", message: "Service unavailable.", status: 503 };
  }

  const ipRl = await checkRateLimitUnified(`trial-start:ip:${ip}`, { windowMs: 86_400_000, max: 20 });
  if (!ipRl.ok) {
    return { ok: false, code: "rate_limit_ip", message: "Too many attempts from this network. Try again tomorrow.", status: 429 };
  }

  const userRl = await checkRateLimitUnified(`trial-start:user:${userId}`, { windowMs: 3_600_000, max: 5 });
  if (!userRl.ok) {
    return { ok: false, code: "rate_limit_user", message: "Too many attempts. Try again later.", status: 429 };
  }

  const fpHash = hashTrialDeviceFingerprint(deviceId);

  await expireStaleTrialForUser(userId);

  const existingBinding = await prisma.trialDeviceBinding.findUnique({
    where: { fingerprintHash: fpHash },
    select: { userId: true },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      emailVerified: true,
      isDemoUser: true,
      trialStatus: true,
      trialUsedAt: true,
      trialEndsAt: true,
      _count: { select: { subscriptions: true } },
    },
  });

  if (!user) {
    return { ok: false, code: "user_not_found", message: "Account not found.", status: 404 };
  }

  if (user.isDemoUser) {
    captureServerEvent(analyticsDistinctId(userId), "trial_blocked", { reason: "demo_user" }).catch(() => {});
    recordTrialBlock(userId, "demo_user");
    return {
      ok: false,
      code: "demo_user",
      message: "Demo accounts already have full access for QA. Trials do not apply.",
      status: 403,
    };
  }

  if (user.trialStatus === TrialStatus.ACTIVE && user.trialEndsAt && user.trialEndsAt > new Date()) {
    return {
      ok: true,
      trialEndsAt: user.trialEndsAt.toISOString(),
    };
  }

  const stripeHasHistory = await stripeEmailHasSubscriptionHistory(user.email);
  const accountCreationCountForIp =
    ip && ip !== "unknown"
      ? await prisma.user.count({
          where: {
            signupIp: ip.slice(0, 64),
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        })
      : 0;
  const eligibility = assessTrialEligibility({
    email: user.email,
    emailVerified: user.emailVerified,
    deviceAlreadyTrialed: Boolean(existingBinding && existingBinding.userId !== userId),
    trialAlreadyUsed: user.trialUsedAt != null || user.trialStatus === TrialStatus.EXHAUSTED,
    hasSubscriptionHistory: user._count.subscriptions > 0,
    stripeEmailHasSubscriptionHistory: stripeHasHistory,
    accountCreationCountForIp,
    noPaymentHistory: user._count.subscriptions === 0 && !stripeHasHistory,
  });

  if (!eligibility.eligible) {
    captureServerEvent(analyticsDistinctId(userId), "trial_blocked", {
      reason: eligibility.code,
      risk_level: eligibility.riskLevel,
      score: eligibility.score,
      signals: eligibility.reasons,
    }).catch(() => {});
    if (eligibility.code === "device_already_trialed") {
      captureServerEvent(analyticsDistinctId(userId), "duplicate_account_detected", { signal: "device_fingerprint" }).catch(() => {});
    }
    recordTrialBlock(userId, eligibility.code);
    return {
      ok: false,
      code: eligibility.code,
      message: eligibility.userMessage,
      status: 403,
    };
  }

  const now = new Date();
  const ends = new Date(now.getTime() + TRIAL_DURATION_MS);

  try {
    await prisma.$transaction(async (tx) => {
      const bind = await tx.trialDeviceBinding.findUnique({ where: { fingerprintHash: fpHash } });
      if (bind && bind.userId !== userId) {
        throw new Error("device_race");
      }
      if (!bind) {
        await tx.trialDeviceBinding.create({ data: { fingerprintHash: fpHash, userId } });
      }
      await tx.user.update({
        where: { id: userId },
        data: {
          trialStatus: TrialStatus.ACTIVE,
          trialUsedAt: now,
          trialStartedAt: now,
          trialEndsAt: ends,
        },
      });
    });
  } catch (e) {
    if (e instanceof Error && e.message === "device_race") {
      recordTrialBlock(userId, "device_already_trialed");
      return {
        ok: false,
        code: "device_already_trialed",
        message: "This device already used a free trial. You can still subscribe below.",
        status: 403,
      };
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      recordTrialBlock(userId, "device_already_trialed");
      return {
        ok: false,
        code: "device_already_trialed",
        message: "This device already used a free trial. You can still subscribe below.",
        status: 403,
      };
    }
    throw e;
  }

  safeServerLog("trial", "trial_started", { userIdPrefix: userId.slice(0, 8) });
  captureServerEvent(analyticsDistinctId(userId), "trial_started", {}).catch(() => {});
  return { ok: true, trialEndsAt: ends.toISOString() };
}
