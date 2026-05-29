import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";
import { htmlEmailShell, sendTransactionalEmailHtml } from "@/lib/email/resend-transactional";
import { safeServerLog } from "@/lib/observability/safe-server-log";

type ReferralStatus =
  | "ACCOUNT_CREATED"
  | "EMAIL_VERIFIED"
  | "ONBOARDED"
  | "ACTIVE"
  | "QUALIFIED"
  | "SUBSCRIBED"
  | "REJECTED"
  | "FRAUD_REVIEW";

type ReferralRewardTrigger = "QUALIFIED_REFERRAL_COUNT" | "PAID_REFERRAL_COUNT" | "MANUAL";
type ReferralRewardKind = "FREE_DAYS" | "FREE_MONTH" | "ACCOUNT_CREDIT" | "FEATURE_UNLOCK" | "AMBASSADOR_STATUS" | "MANUAL";

const referralDb = prisma as typeof prisma & {
  referralCode: any;
  referralAttribution: any;
  referralRewardRule: any;
  referralRewardGrant: any;
  referralFraudSignal: any;
  referralEvent: any;
};

const REFERRAL_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function normalizeReferralCode(code: string): string {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function hashReferralCode(code: string): string {
  return createHash("sha256").update(normalizeReferralCode(code)).digest("hex");
}

function hashNullable(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return createHash("sha256").update(trimmed.toLowerCase()).digest("hex");
}

function makeReferralCode(nameOrEmail?: string | null): string {
  const seed = normalizeReferralCode((nameOrEmail ?? "NN").split("@")[0] ?? "NN").slice(0, 6) || "NN";
  const bytes = randomBytes(4);
  let suffix = "";
  for (const b of bytes) suffix += REFERRAL_ALPHABET[b % REFERRAL_ALPHABET.length];
  return `${seed}${suffix.slice(0, 4)}`.slice(0, 10);
}

export async function getOrCreateReferralCode(userId: string, origin?: string): Promise<{ id: string; displayCode: string; referralLink: string | null; enabled: boolean }> {
  const existing = await referralDb.referralCode.findFirst({
    where: { userId, enabled: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, displayCode: true, referralLink: true, enabled: true },
  });
  if (existing) return existing;

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { username: true, email: true, firstName: true, name: true } });
  const base = user?.username ?? user?.firstName ?? user?.name ?? user?.email ?? "NN";
  for (let attempt = 0; attempt < 6; attempt++) {
    const displayCode = makeReferralCode(attempt === 0 ? base : `${base}${attempt}`);
    const referralLink = origin ? `${origin.replace(/\/$/, "")}/signup?ref=${encodeURIComponent(displayCode)}` : null;
    try {
      return await referralDb.referralCode.create({
        data: { userId, displayCode, codeHash: hashReferralCode(displayCode), referralLink, enabled: true },
        select: { id: true, displayCode: true, referralLink: true, enabled: true },
      });
    } catch (error) {
      if (attempt === 5) throw error;
    }
  }
  throw new Error("Unable to generate referral code");
}

async function writeReferralEvent(attributionId: string | null, userId: string | null, eventType: string, meta?: Record<string, unknown>) {
  await referralDb.referralEvent.create({ data: { attributionId, userId, eventType, meta: meta ?? undefined } }).catch((error: unknown) => {
    safeServerLog("referrals", "event_write_failed", { eventType, detail: error instanceof Error ? error.message.slice(0, 160) : "unknown" });
  });
}

async function flagReferral(attributionId: string | null, subjectUserId: string, type: string, detail: string) {
  await referralDb.referralFraudSignal.create({
    data: { attributionId, subjectUserId, type, severity: "review", detail },
  }).catch(() => {});
}

async function sendReferralEmail(userId: string, subject: string, body: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, emailEngagementOptOut: true } });
  if (!user?.email || user.emailEngagementOptOut) return;
  await sendTransactionalEmailHtml({
    to: user.email,
    subject,
    html: htmlEmailShell(subject, `<p>${body}</p>`),
    text: body,
  }).catch((error: unknown) => {
    safeServerLog("referrals", "email_send_failed", {
      subject: subject.slice(0, 80),
      detail: error instanceof Error ? error.message.slice(0, 160) : "unknown",
    });
  });
}

export async function recordReferralSignup(args: {
  referredUserId: string;
  rawCode?: string | null;
  signupIp?: string | null;
  deviceFingerprint?: string | null;
  origin?: string | null;
}): Promise<{ ok: true; attributed: boolean } | { ok: false; code: "missing" | "self_referral" | "already_attributed" }> {
  const raw = args.rawCode?.trim();
  if (!raw) return { ok: false, code: "missing" };

  const referralCode = await referralDb.referralCode.findFirst({
    where: { codeHash: hashReferralCode(raw), enabled: true },
    select: { id: true, userId: true, displayCode: true, referralLink: true },
  });
  if (!referralCode) return { ok: false, code: "missing" };
  if (referralCode.userId === args.referredUserId) {
    await flagReferral(null, args.referredUserId, "SELF_REFERRAL", "User attempted to redeem their own referral code.");
    return { ok: false, code: "self_referral" };
  }

  const existing = await referralDb.referralAttribution.findUnique({ where: { referredUserId: args.referredUserId }, select: { id: true } });
  if (existing) return { ok: false, code: "already_attributed" };

  const referred = await prisma.user.findUnique({
    where: { id: args.referredUserId },
    select: { normalizedEmail: true, email: true, onboardingCompletedAt: true, emailVerified: true },
  });
  const referrer = await prisma.user.findUnique({
    where: { id: referralCode.userId },
    select: { normalizedEmail: true, email: true, signupIp: true },
  });

  const attribution = await referralDb.referralAttribution.create({
    data: {
      referrerUserId: referralCode.userId,
      referredUserId: args.referredUserId,
      referralCodeId: referralCode.id,
      referralCodeDisplay: referralCode.displayCode,
      referralLink: referralCode.referralLink ?? (args.origin ? `${args.origin.replace(/\/$/, "")}/signup?ref=${encodeURIComponent(referralCode.displayCode)}` : null),
      status: "ACCOUNT_CREATED",
      signupIpHash: hashNullable(args.signupIp),
      deviceHash: hashNullable(args.deviceFingerprint),
      emailVerifiedAt: referred?.emailVerified ? new Date() : null,
      onboardingCompletedAt: referred?.onboardingCompletedAt ?? null,
    },
    select: { id: true },
  });

  await writeReferralEvent(attribution.id, args.referredUserId, "account_created", { referralCode: referralCode.displayCode });
  void sendReferralEmail(referralCode.userId, "A friend joined NurseNest", "Your referral created an account. Rewards unlock only after they verify email, finish onboarding, and start studying.");

  if ((referred?.normalizedEmail && referrer?.normalizedEmail && referred.normalizedEmail === referrer.normalizedEmail) || referred?.email === referrer?.email) {
    await flagReferral(attribution.id, args.referredUserId, "DUPLICATE_NORMALIZED_EMAIL", "Referrer and referred account share the same normalized email.");
  }
  if (args.signupIp && referrer?.signupIp && args.signupIp === referrer.signupIp) {
    await flagReferral(attribution.id, args.referredUserId, "SHARED_SIGNUP_IP", "Referrer and referred account share signup IP.");
  }

  await refreshReferralQualification(args.referredUserId);
  return { ok: true, attributed: true };
}

async function statusForGates(row: { emailVerifiedAt: Date | null; onboardingCompletedAt: Date | null; firstActivityAt: Date | null; qualifiedAt: Date | null; firstSubscribedAt: Date | null }): Promise<ReferralStatus> {
  if (row.firstSubscribedAt) return "SUBSCRIBED";
  if (row.qualifiedAt) return "QUALIFIED";
  if (row.emailVerifiedAt && row.onboardingCompletedAt && row.firstActivityAt) return "QUALIFIED";
  if (row.firstActivityAt) return "ACTIVE";
  if (row.onboardingCompletedAt) return "ONBOARDED";
  if (row.emailVerifiedAt) return "EMAIL_VERIFIED";
  return "ACCOUNT_CREATED";
}

export async function refreshReferralQualification(referredUserId: string): Promise<void> {
  const row = await referralDb.referralAttribution.findUnique({
    where: { referredUserId },
    select: { id: true, referrerUserId: true, emailVerifiedAt: true, onboardingCompletedAt: true, firstActivityAt: true, qualifiedAt: true, firstSubscribedAt: true },
  });
  if (!row) return;
  const nextStatus = await statusForGates(row);
  const becomesQualified = nextStatus === "QUALIFIED" && !row.qualifiedAt;
  const updated = await referralDb.referralAttribution.update({
    where: { id: row.id },
    data: {
      status: nextStatus,
      qualifiedAt: becomesQualified ? new Date() : row.qualifiedAt,
    },
    select: { id: true, referrerUserId: true, status: true, qualifiedAt: true },
  });
  if (becomesQualified) {
    await writeReferralEvent(row.id, referredUserId, "qualified", {});
    void sendReferralEmail(row.referrerUserId, "Your NurseNest referral qualified", "Nice work: your referral verified, completed onboarding, and started learning. Any matching reward rules have been applied.");
    await grantReferralRewardsForTrigger(updated.referrerUserId, "QUALIFIED_REFERRAL_COUNT", row.id);
  }
}

export async function markReferralEmailVerified(userId: string): Promise<void> {
  const row = await referralDb.referralAttribution.updateMany({
    where: { referredUserId: userId, emailVerifiedAt: null },
    data: { emailVerifiedAt: new Date() },
  });
  if (row.count > 0) await writeReferralEvent(null, userId, "email_verified", {});
  await refreshReferralQualification(userId);
}

export async function markReferralOnboardingCompleted(userId: string): Promise<void> {
  const row = await referralDb.referralAttribution.updateMany({
    where: { referredUserId: userId, onboardingCompletedAt: null },
    data: { onboardingCompletedAt: new Date() },
  });
  if (row.count > 0) await writeReferralEvent(null, userId, "onboarding_completed", {});
  await refreshReferralQualification(userId);
}

export async function markReferralFirstActivity(userId: string): Promise<void> {
  const row = await referralDb.referralAttribution.updateMany({
    where: { referredUserId: userId, firstActivityAt: null },
    data: { firstActivityAt: new Date() },
  });
  if (row.count > 0) await writeReferralEvent(null, userId, "first_activity", {});
  await refreshReferralQualification(userId);
}

export async function markReferralSubscribed(userId: string): Promise<void> {
  const attribution = await referralDb.referralAttribution.findUnique({
    where: { referredUserId: userId },
    select: { id: true, referrerUserId: true, firstSubscribedAt: true },
  });
  if (!attribution) return;
  await referralDb.referralAttribution.update({
    where: { id: attribution.id },
    data: { firstSubscribedAt: attribution.firstSubscribedAt ?? new Date(), status: "SUBSCRIBED" },
  });
  await writeReferralEvent(attribution.id, userId, "paid_subscription", {});
  await grantReferralRewardsForTrigger(attribution.referrerUserId, "PAID_REFERRAL_COUNT", attribution.id);
}

async function grantReferralRewardsForTrigger(referrerUserId: string, trigger: ReferralRewardTrigger, attributionId: string): Promise<void> {
  const count = await referralDb.referralAttribution.count({
    where: {
      referrerUserId,
      ...(trigger === "PAID_REFERRAL_COUNT" ? { firstSubscribedAt: { not: null } } : { qualifiedAt: { not: null } }),
    },
  });
  const rules = await referralDb.referralRewardRule.findMany({
    where: { enabled: true, trigger, threshold: { lte: count } },
    orderBy: { threshold: "asc" },
    select: { id: true, threshold: true, rewardKind: true, rewardValue: true, featureKey: true, durationDays: true, name: true },
  });
  for (const rule of rules) {
    await referralDb.referralRewardGrant.upsert({
      where: { ruleId_referrerUserId_attributionId: { ruleId: rule.id, referrerUserId, attributionId } },
      create: {
        ruleId: rule.id,
        attributionId,
        referrerUserId,
        recipientUserId: referrerUserId,
        status: "GRANTED",
        rewardKind: rule.rewardKind as ReferralRewardKind,
        rewardValue: rule.rewardValue,
        featureKey: rule.featureKey,
        durationDays: rule.durationDays,
        reason: `${rule.name}: ${count} ${trigger === "PAID_REFERRAL_COUNT" ? "paid" : "qualified"} referrals`,
        grantedAt: new Date(),
      },
      update: {},
    });
    void sendReferralEmail(referrerUserId, "NurseNest referral reward unlocked", `Reward unlocked: ${rule.name}. You can review earned rewards in Invite Friends.`);
  }
}

export async function loadReferralDashboard(userId: string, origin?: string) {
  const code = await getOrCreateReferralCode(userId, origin);
  const [summaryRows, rewards, recentReferrals] = await Promise.all([
    referralDb.referralAttribution.groupBy({
      by: ["status"],
      where: { referrerUserId: userId },
      _count: { _all: true },
    }),
    referralDb.referralRewardGrant.findMany({
      where: { referrerUserId: userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, status: true, rewardKind: true, rewardValue: true, featureKey: true, durationDays: true, reason: true, grantedAt: true },
    }),
    referralDb.referralAttribution.findMany({
      where: { referrerUserId: userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        status: true,
        createdAt: true,
        emailVerifiedAt: true,
        onboardingCompletedAt: true,
        firstActivityAt: true,
        qualifiedAt: true,
        firstSubscribedAt: true,
        referred: { select: { name: true, createdAt: true } },
      },
    }),
  ]);
  const counts = Object.fromEntries(summaryRows.map((row: { status: string; _count: { _all: number } }) => [row.status, row._count._all]));
  return {
    code,
    stats: {
      accountsCreated: Object.values(counts).reduce((total: number, value) => total + Number(value), 0),
      qualifiedReferrals: Number(counts.QUALIFIED ?? 0) + Number(counts.SUBSCRIBED ?? 0),
      subscribedReferrals: Number(counts.SUBSCRIBED ?? 0),
      rewardsEarned: rewards.filter((reward: { status: string }) => reward.status === "GRANTED").length,
    },
    rewards,
    recentReferrals,
  };
}

export async function loadAdminReferralDashboard() {
  const [topReferrers, statusRows, rewards, fraudSignals, rules] = await Promise.all([
    referralDb.referralAttribution.groupBy({
      by: ["referrerUserId"],
      _count: { _all: true },
      orderBy: { _count: { referrerUserId: "desc" } },
      take: 20,
    }),
    referralDb.referralAttribution.groupBy({ by: ["status"], _count: { _all: true } }),
    referralDb.referralRewardGrant.findMany({ orderBy: { createdAt: "desc" }, take: 25, include: { referrer: { select: { email: true, name: true } } } }),
    referralDb.referralFraudSignal.findMany({ where: { resolvedAt: null }, orderBy: { createdAt: "desc" }, take: 25, include: { subject: { select: { email: true, name: true } } } }),
    referralDb.referralRewardRule.findMany({ orderBy: [{ trigger: "asc" }, { threshold: "asc" }], take: 50 }),
  ]);
  const referrerUsers = await prisma.user.findMany({
    where: { id: { in: topReferrers.map((row: { referrerUserId: string }) => row.referrerUserId) } },
    select: { id: true, email: true, name: true },
  });
  const userById = new Map(referrerUsers.map((user) => [user.id, user]));
  return {
    topReferrers: topReferrers.map((row: { referrerUserId: string; _count: { _all: number } }) => ({
      user: userById.get(row.referrerUserId) ?? { id: row.referrerUserId, email: "unknown", name: "Unknown" },
      referrals: row._count._all,
    })),
    statusRows,
    rewards,
    fraudSignals,
    rules,
  };
}
