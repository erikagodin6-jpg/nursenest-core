#!/usr/bin/env npx tsx
/**
 * Writes data/audit/entitlement-system-map.json, stripe-sync-validation.json, entitlement-final-status.json
 * Safe: read-only DB queries only.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient, SubscriptionStatus } from "@prisma/client";
import { getUserAccess } from "@/lib/entitlements/get-user-access";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "../..");
const REPO_ROOT = join(APP_ROOT, "..");
const OUT = join(REPO_ROOT, "data/audit");

async function main() {
  await mkdir(OUT, { recursive: true });
  const generatedAt = new Date().toISOString();

  const entitlementSystemMap = {
    generatedAt,
    userModel: {
      prismaModel: "User",
      fields: {
        tier: "TierCode — profile / default; subscription may override via Subscription.planTier",
        country: "CountryCode — CA/US for pathway gating",
        role: "UserRole — admin override for entitlements (isLearnerEntitlementAdminOverrideRole)",
        learnerPath: "optional target pathway id",
        alliedProfessionKey: "when tier ALLIED",
        trialStatus: "TrialStatus + trialEndsAt for active_trial access",
        freeQuestionViews: "freemium counter",
      },
      source: "prisma/schema.prisma model User",
    },
    subscriptionModel: {
      prismaModel: "Subscription",
      fields: {
        status: "ACTIVE | CANCELLED | PAST_DUE | GRACE (see SubscriptionStatus enum)",
        stripeSubscriptionId: "unique Stripe sub id",
        planTier: "preferred over User.tier for access (effectiveTierCountryForAccess)",
        planCountry: "CountryCode",
        planDuration: "metadata string e.g. monthly",
        planCode: "checkout metadata",
        currentPeriodEnd: "access period boundary",
        cancelAtPeriodEnd: "Stripe cancel-at-period-end",
      },
      source: "prisma/schema.prisma model Subscription",
    },
    entitlementResolution: {
      primary: "getUserAccess → accessScopeFromUserAccess → resolveEntitlement",
      files: [
        "src/lib/entitlements/get-user-access.ts",
        "src/lib/entitlements/resolve-entitlement.ts",
        "src/lib/entitlements/subscription-plan.ts (effectiveTierCountryForAccess)",
      ],
      activeSubscriptionQuery:
        "findFirst where status in ACTIVE, GRACE, PAST_DUE — orderBy createdAt desc",
      premiumReasons: ["active_subscription", "grace_period", "active_trial", "admin_override"],
    },
    tierLadder: {
      description: "prismaTierCodesForProfileTier / examQuestionTierStringsForProfileTier",
      file: "src/lib/entitlements/accessible-tiers.ts",
      ladder: {
        NP: ["RPN", "LVN_LPN", "RN", "NP"],
        RN: ["RPN", "LVN_LPN", "RN"],
        LVN_LPN: ["RPN", "LVN_LPN"],
        RPN: ["RPN"],
        ALLIED: ["ALLIED"],
      },
      pathwayGate: "subscriptionCoversPathwayBase(scope, pathway) in pathway-entitlements.ts",
    },
    stripeMapping: {
      priceIds: "STRIPE_PRICE_* env vars → findTierCountryByPriceId in pricing-map.ts",
      checkoutMetadata: "planFromCheckoutMetadata — country CA|US + tier TierCode",
      syncUser: "sync-user-from-stripe-subscription.ts",
    },
  };

  await writeFile(join(OUT, "entitlement-system-map.json"), JSON.stringify(entitlementSystemMap, null, 2));

  const prisma = new PrismaClient();
  let databaseAvailable = false;
  let stripeSyncValidation: Record<string, unknown> = {
    generatedAt,
    databaseAvailable: false,
    webhookEventsImplemented: [
      "checkout.session.completed",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "invoice.payment_succeeded (covers paid renewals; Stripe uses this instead of legacy invoice.paid in many APIs)",
      "invoice.payment_failed",
    ],
    note:
      "Stripe event `invoice.paid` is not used; `invoice.payment_succeeded` is the standard subscription renewal signal.",
    webhookHardening: {
      signature: "stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)",
      idempotency: "StripeWebhookEvent unique id — duplicate returns { ok: true, duplicate: true }",
      file: "src/app/api/subscriptions/webhook/route.ts",
    },
    mismatches: {
      tierDriftUserVsPlan: [] as { userId: string; userTier: string; planTier: string }[],
      activeSubButNoPremiumSample: [] as { userId: string; reason: string }[],
      counts: {} as Record<string, number>,
    },
  };

  try {
    await prisma.$connect();
    databaseAvailable = true;
    stripeSyncValidation.databaseAvailable = true;

    const activePlanRows = await prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        planTier: { not: null },
      },
      select: { userId: true, planTier: true, user: { select: { tier: true } } },
      take: 200,
    });
    const tierDrift = activePlanRows
      .filter((r) => r.planTier != null && r.user.tier !== r.planTier)
      .slice(0, 50)
      .map((r) => ({
        userId: r.userId,
        userTier: String(r.user.tier),
        planTier: String(r.planTier),
      }));
    (stripeSyncValidation.mismatches as { tierDriftUserVsPlan: unknown[] }).tierDriftUserVsPlan = tierDrift;

    const activeLikeRows = await prisma.subscription.findMany({
      where: { status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE, SubscriptionStatus.PAST_DUE] } },
      select: { userId: true },
    });
    const seenU = new Set<string>();
    const uniqueUserIds: string[] = [];
    for (const row of activeLikeRows) {
      if (seenU.has(row.userId)) continue;
      seenU.add(row.userId);
      uniqueUserIds.push(row.userId);
      if (uniqueUserIds.length >= 300) break;
    }

    let noPremiumWithActiveSub = 0;
    const samples: { userId: string; reason: string }[] = [];
    for (const uid of uniqueUserIds) {
      const ua = await getUserAccess(uid);
      if (!ua.hasPremium) {
        noPremiumWithActiveSub++;
        if (samples.length < 15) {
          samples.push({ userId: uid, reason: ua.reason });
        }
      }
    }

    (stripeSyncValidation.mismatches as { activeSubButNoPremiumSample: unknown[] }).activeSubButNoPremiumSample =
      samples;
    (stripeSyncValidation.mismatches as { counts: Record<string, number> }).counts = {
      distinctUsersWithActiveLikeSub: uniqueUserIds.length,
      scannedForAccessParity: uniqueUserIds.length,
      activeSubRowsButGetUserAccessNoPremium: noPremiumWithActiveSub,
      tierDriftRows: tierDrift.length,
    };

    const [subActive, subCancelled, subPastDue] = await Promise.all([
      prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
      prisma.subscription.count({ where: { status: SubscriptionStatus.CANCELLED } }),
      prisma.subscription.count({ where: { status: SubscriptionStatus.PAST_DUE } }),
    ]);
    Object.assign((stripeSyncValidation.mismatches as { counts: Record<string, number> }).counts, {
      subscriptionRowsActive: subActive,
      subscriptionRowsCancelled: subCancelled,
      subscriptionRowsPastDue: subPastDue,
    });
  } catch (e) {
    stripeSyncValidation.error = String((e as Error)?.message ?? e);
  } finally {
    await prisma.$disconnect().catch(() => {});
  }

  await writeFile(join(OUT, "stripe-sync-validation.json"), JSON.stringify(stripeSyncValidation, null, 2));

  const entitlementFinalStatus = {
    generatedAt,
    databaseAvailable,
    accessControlRules: {
      anonymous: "API routes return 401 without session; marketing may show public lesson previews only",
      freemium: "resolveEntitlement.hasAccess false → freemium pools; rationales blocked in /api/questions/[id]",
      paid: "getUserAccess.hasPremium + tier ladder via accessible-tiers.ts",
      pastDue: "Still hasPremium true (grace_period) — see get-user-access.ts",
      canceled: "Subscription CANCELLED — no longer in ACTIVE_LIKE; access ends unless trial",
    },
    reconciliation: {
      mode: "audit_script_read_only",
      tierDriftListed: databaseAvailable
        ? ((stripeSyncValidation.mismatches as { tierDriftUserVsPlan: unknown[] }).tierDriftUserVsPlan as unknown[])
            .length
        : 0,
      note: "Full Stripe↔DB reconciliation requires STRIPE_SECRET_KEY + compare Customer.subscriptions in Stripe API — not run here.",
    },
    risks: [
      "User.tier can temporarily diverge from Subscription.planTier until webhook/sync; effectiveTierCountryForAccess prefers plan.",
      "PAST_DUE users retain premium access (grace) — confirm product policy.",
    ],
    filesWritten: ["entitlement-system-map.json", "stripe-sync-validation.json", "entitlement-final-status.json"],
  };

  await writeFile(join(OUT, "entitlement-final-status.json"), JSON.stringify(entitlementFinalStatus, null, 2));
  console.log(`Wrote entitlement audit JSON to ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
