/**
 * Stripe ↔ Prisma Subscription reconciliation (Stripe is source of truth).
 * Used by `scripts/reconcile-stripe-subscriptions.ts` and `/api/cron/stripe-reconcile`.
 */
import type Stripe from "stripe";
import { Prisma, SubscriptionStatus, type TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe/stripe-client";
import { findTierCountryByPriceId } from "@/lib/stripe/pricing-map";
import { syncUserFromStripePriceId } from "@/lib/stripe/sync-user-from-stripe-subscription";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  billingLifecycleFields,
  firstSubscriptionPriceId,
  isDemoStripeSubscriptionId,
  isHighRiskDbActiveStripeEndedOrPaused,
  mapStripeSubscriptionStatus,
  STRIPE_RECONCILE_PERIOD_DRIFT_MS,
} from "@/lib/stripe/stripe-subscription-field-map";
import {
  guardSubscriptionCreateCustomerConsistency,
  isTrustedStripeReconciliationUserId,
} from "@/lib/stripe/stripe-reconcile-metadata";
import { pastDueSinceForStatusTransition } from "@/lib/stripe/subscription-past-due-since";

export type DiscrepancyBase = { stripeSubscriptionId: string };

export type UnknownPriceAggregate = {
  priceId: string;
  stripeSubscriptionIds: string[];
};

export type StripeSubscriptionReconciliationReport = {
  generatedAt: string;
  dryRun: boolean;
  stripeConfigured: boolean;
  databaseAvailable: boolean;
  stripeSubscriptionTotalListed: number;
  dbSubscriptionTotal: number;
  skippedDemoOrInternalRows: number;
  discrepancies: {
    missingInDb: Array<
      DiscrepancyBase & {
        stripeCustomerId: string | null;
        stripeStatus: Stripe.Subscription.Status;
        priceId: string | null;
        metadataUserId: string | null;
        note: string;
      }
    >;
    dbRowNotFoundInStripeList: Array<
      DiscrepancyBase & { userId: string; dbStatus: SubscriptionStatus; note: string }
    >;
    tierMismatch: Array<
      DiscrepancyBase & {
        userId: string;
        dbPlanTier: TierCode | null;
        dbPlanCountry: string | null;
        stripeMappedTier: TierCode | null;
        stripeMappedCountry: string | null;
        priceId: string | null;
      }
    >;
    statusMismatch: Array<
      DiscrepancyBase & {
        userId: string;
        dbStatus: SubscriptionStatus;
        stripeStatus: Stripe.Subscription.Status;
        mappedDbStatus: SubscriptionStatus | null;
      }
    >;
    periodEndDrift: Array<
      DiscrepancyBase & {
        userId: string;
        dbPeriodEnd: string | null;
        stripePeriodEnd: string | null;
        deltaMs: number;
      }
    >;
    periodEndBackfillSuggested: Array<
      DiscrepancyBase & {
        userId: string;
        stripePeriodEnd: string;
      }
    >;
    dbActiveButStripeNotEntitled: Array<
      DiscrepancyBase & {
        userId: string;
        dbStatus: SubscriptionStatus;
        stripeStatus: Stripe.Subscription.Status;
        reason: string;
      }
    >;
  };
  unknownStripePriceIds: UnknownPriceAggregate[];
  apply: {
    attempted: boolean;
    subscriptionRowsUpdated: number;
    userSyncsApplied: number;
    createsApplied: number;
    createsSkipped: number;
    errors: Array<{ stripeSubscriptionId?: string; message: string }>;
  };
  notes: string[];
};

async function listAllStripeSubscriptions(stripe: Stripe): Promise<Stripe.Subscription[]> {
  const out: Stripe.Subscription[] = [];
  let startingAfter: string | undefined;
  for (;;) {
    const page = await stripe.subscriptions.list({
      status: "all",
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    out.push(...page.data);
    if (!page.has_more || page.data.length === 0) break;
    startingAfter = page.data[page.data.length - 1]!.id;
  }
  return out;
}

function mergeUnknownPrice(
  map: Map<string, string[]>,
  priceId: string | null | undefined,
  stripeSubscriptionId: string,
): void {
  if (!priceId?.trim()) return;
  const mapped = findTierCountryByPriceId(priceId);
  if (mapped) return;
  const list = map.get(priceId) ?? [];
  if (list.length < 12) list.push(stripeSubscriptionId);
  map.set(priceId, list);
}

function unknownPriceReportFromMap(map: Map<string, string[]>): UnknownPriceAggregate[] {
  return [...map.entries()].map(([priceId, stripeSubscriptionIds]) => ({
    priceId,
    stripeSubscriptionIds,
  }));
}

export function summarizeStripeSubscriptionReconciliationReport(r: StripeSubscriptionReconciliationReport) {
  const d = r.discrepancies;
  return {
    stripeSubscriptionTotalListed: r.stripeSubscriptionTotalListed,
    dbSubscriptionTotal: r.dbSubscriptionTotal,
    unknownStripePriceIdKinds: r.unknownStripePriceIds.length,
    counts: {
      missingInDb: d.missingInDb.length,
      dbRowNotFoundInStripeList: d.dbRowNotFoundInStripeList.length,
      tierMismatch: d.tierMismatch.length,
      statusMismatch: d.statusMismatch.length,
      periodEndDrift: d.periodEndDrift.length,
      periodEndBackfillSuggested: d.periodEndBackfillSuggested.length,
      dbActiveButStripeNotEntitled: d.dbActiveButStripeNotEntitled.length,
    },
    apply: r.apply,
    notes: r.notes,
  };
}

export async function runStripeSubscriptionReconciliation(
  apply: boolean,
): Promise<StripeSubscriptionReconciliationReport> {
  const generatedAt = new Date().toISOString();
  const unknownPriceMap = new Map<string, string[]>();

  const report: StripeSubscriptionReconciliationReport = {
    generatedAt,
    dryRun: !apply,
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
    databaseAvailable: isDatabaseUrlConfigured(),
    stripeSubscriptionTotalListed: 0,
    dbSubscriptionTotal: 0,
    skippedDemoOrInternalRows: 0,
    discrepancies: {
      missingInDb: [],
      dbRowNotFoundInStripeList: [],
      tierMismatch: [],
      statusMismatch: [],
      periodEndDrift: [],
      periodEndBackfillSuggested: [],
      dbActiveButStripeNotEntitled: [],
    },
    unknownStripePriceIds: [],
    apply: {
      attempted: apply,
      subscriptionRowsUpdated: 0,
      userSyncsApplied: 0,
      createsApplied: 0,
      createsSkipped: 0,
      errors: [],
    },
    notes: [
      "Does not delete Subscription rows. Orphan DB rows (Stripe sub deleted) are reported only.",
      "Creates missing DB rows only when Stripe metadata userId passes format validation, user exists, customer-consistency guard passes, mapped status is not incomplete/paused, and --apply.",
      "Tier mapping uses STRIPE_PRICE_* env price ids via findTierCountryByPriceId — see unknownStripePriceIds for unmapped price ids.",
      "mapStripeSubscriptionStatus is shared with /api/subscriptions/webhook via stripe-subscription-field-map.ts.",
    ],
  };

  const stripe = await getStripeClient();
  if (!stripe) {
    report.apply.errors.push({ message: "STRIPE_SECRET_KEY not set — cannot list Stripe subscriptions." });
    return report;
  }

  if (!isDatabaseUrlConfigured()) {
    report.apply.errors.push({ message: "DATABASE_URL not configured — cannot compare to Prisma." });
    return report;
  }

  const stripeSubs = await listAllStripeSubscriptions(stripe);
  report.stripeSubscriptionTotalListed = stripeSubs.length;
  const stripeById = new Map(stripeSubs.map((s) => [s.id, s]));

  const dbRows = await prisma.subscription.findMany({
    select: {
      id: true,
      userId: true,
      stripeSubscriptionId: true,
      stripeCustomerId: true,
      status: true,
      planTier: true,
      planCountry: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
    },
  });
  report.dbSubscriptionTotal = dbRows.length;
  const dbByStripeId = new Map(dbRows.map((r) => [r.stripeSubscriptionId, r]));

  for (const sub of stripeSubs) {
    if (isDemoStripeSubscriptionId(sub.id)) {
      report.skippedDemoOrInternalRows += 1;
      continue;
    }

    const priceId = firstSubscriptionPriceId(sub) ?? null;
    mergeUnknownPrice(unknownPriceMap, priceId, sub.id);
    const mapped = priceId ? findTierCountryByPriceId(priceId) : undefined;
    const mappedStatus = mapStripeSubscriptionStatus(sub.status);
    const lifecycle = billingLifecycleFields(sub);
    const meta = sub.metadata && typeof sub.metadata === "object" ? sub.metadata : {};
    const rawUserId = typeof meta.userId === "string" ? meta.userId.trim() : "";
    const metadataUserId = rawUserId.length ? rawUserId : null;

    const row = dbByStripeId.get(sub.id);
    if (!row) {
      const trusted = metadataUserId && isTrustedStripeReconciliationUserId(metadataUserId);
      report.discrepancies.missingInDb.push({
        stripeSubscriptionId: sub.id,
        stripeCustomerId: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
        stripeStatus: sub.status,
        priceId,
        metadataUserId,
        note: !metadataUserId
          ? "No DB row; set Stripe subscription metadata userId to allow --apply create, or link manually."
          : !trusted
            ? "No DB row; metadata userId failed format validation — cannot auto-create."
            : "No DB row; metadata userId present and trusted — --apply can create Subscription if user exists and customer guard passes.",
      });

      if (apply && metadataUserId && trusted) {
        try {
          const user = await prisma.user.findUnique({ where: { id: metadataUserId }, select: { id: true } });
          if (!user) {
            report.apply.errors.push({
              stripeSubscriptionId: sub.id,
              message: `metadata userId ${metadataUserId} not found in DB`,
            });
          } else if (mappedStatus === null) {
            report.apply.errors.push({
              stripeSubscriptionId: sub.id,
              message: "Stripe status incomplete/paused — skip create",
            });
          } else {
            const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;
            const guard = await guardSubscriptionCreateCustomerConsistency(prisma, metadataUserId, customerId);
            if (!guard.allow) {
              report.apply.createsSkipped += 1;
              report.apply.errors.push({
                stripeSubscriptionId: sub.id,
                message: guard.reason,
              });
            } else {
              await prisma.subscription.create({
                data: {
                  userId: metadataUserId,
                  stripeSubscriptionId: sub.id,
                  stripeCustomerId: customerId,
                  status: mappedStatus,
                  ...(mappedStatus === SubscriptionStatus.PAST_DUE ? { pastDueSince: new Date() } : {}),
                  planTier: mapped?.tier ?? undefined,
                  planCountry: mapped?.country ?? undefined,
                  currentPeriodEnd: lifecycle.currentPeriodEnd ?? null,
                  trialEnd: lifecycle.trialEnd ?? null,
                  cancelAtPeriodEnd: lifecycle.cancelAtPeriodEnd,
                },
              });
              report.apply.createsApplied += 1;
              if (priceId) {
                await syncUserFromStripePriceId(metadataUserId, priceId);
                report.apply.userSyncsApplied += 1;
              }
            }
          }
        } catch (e) {
          report.apply.errors.push({
            stripeSubscriptionId: sub.id,
            message: e instanceof Error ? e.message : String(e),
          });
        }
      }
      continue;
    }

    if (mappedStatus !== null && row.status !== mappedStatus) {
      report.discrepancies.statusMismatch.push({
        stripeSubscriptionId: sub.id,
        userId: row.userId,
        dbStatus: row.status,
        stripeStatus: sub.status,
        mappedDbStatus: mappedStatus,
      });
    }

    const stripeEnd = lifecycle.currentPeriodEnd;
    const dbEnd = row.currentPeriodEnd;
    if (stripeEnd && dbEnd) {
      const delta = Math.abs(stripeEnd.getTime() - dbEnd.getTime());
      if (delta > STRIPE_RECONCILE_PERIOD_DRIFT_MS) {
        report.discrepancies.periodEndDrift.push({
          stripeSubscriptionId: sub.id,
          userId: row.userId,
          dbPeriodEnd: dbEnd.toISOString(),
          stripePeriodEnd: stripeEnd.toISOString(),
          deltaMs: delta,
        });
      }
    } else if (stripeEnd && !dbEnd) {
      report.discrepancies.periodEndBackfillSuggested.push({
        stripeSubscriptionId: sub.id,
        userId: row.userId,
        stripePeriodEnd: stripeEnd.toISOString(),
      });
    }

    const patch: Prisma.SubscriptionUpdateInput = {};
    let syncUserFromPrice = false;

    if (mapped) {
      const tierOk = row.planTier === mapped.tier;
      const countryOk = row.planCountry === mapped.country;
      if (!tierOk || !countryOk) {
        report.discrepancies.tierMismatch.push({
          stripeSubscriptionId: sub.id,
          userId: row.userId,
          dbPlanTier: row.planTier,
          dbPlanCountry: row.planCountry,
          stripeMappedTier: mapped.tier,
          stripeMappedCountry: mapped.country,
          priceId,
        });
        patch.planTier = mapped.tier;
        patch.planCountry = mapped.country;
        if (mapped.alliedCareer) patch.alliedCareer = mapped.alliedCareer;
        syncUserFromPrice = true;
      }
    }

    if (mappedStatus !== null && row.status !== mappedStatus) {
      patch.status = mappedStatus;
      const pastPatch = pastDueSinceForStatusTransition(mappedStatus, row.status);
      if (pastPatch) Object.assign(patch, pastPatch);
    }

    if (stripeEnd && dbEnd) {
      const delta = Math.abs(stripeEnd.getTime() - dbEnd.getTime());
      if (delta > STRIPE_RECONCILE_PERIOD_DRIFT_MS) {
        patch.currentPeriodEnd = stripeEnd;
        patch.trialEnd = lifecycle.trialEnd ?? undefined;
        patch.cancelAtPeriodEnd = lifecycle.cancelAtPeriodEnd;
      }
    } else if (stripeEnd) {
      patch.currentPeriodEnd = stripeEnd;
      patch.trialEnd = lifecycle.trialEnd ?? null;
      patch.cancelAtPeriodEnd = lifecycle.cancelAtPeriodEnd;
    }

    if (apply && Object.keys(patch).length > 0) {
      try {
        await prisma.subscription.update({
          where: { id: row.id },
          data: patch,
        });
        report.apply.subscriptionRowsUpdated += 1;
        if (syncUserFromPrice && priceId) {
          await syncUserFromStripePriceId(row.userId, priceId);
          report.apply.userSyncsApplied += 1;
        }
      } catch (e) {
        report.apply.errors.push({
          stripeSubscriptionId: sub.id,
          message: e instanceof Error ? e.message : String(e),
        });
      }
    }

    if (isHighRiskDbActiveStripeEndedOrPaused(row.status, sub.status)) {
      report.discrepancies.dbActiveButStripeNotEntitled.push({
        stripeSubscriptionId: sub.id,
        userId: row.userId,
        dbStatus: row.status,
        stripeStatus: sub.status,
        reason:
          sub.status === "paused"
            ? "High-signal: Stripe paused collection; DB still ACTIVE/GRACE. Align via status when mapping allows, or manual review."
            : "High-signal: Stripe ended subscription; DB still ACTIVE/GRACE. Status alignment is handled via statusMismatch + --apply.",
      });
    }
  }

  report.unknownStripePriceIds = unknownPriceReportFromMap(unknownPriceMap);

  for (const dbRow of dbRows) {
    if (isDemoStripeSubscriptionId(dbRow.stripeSubscriptionId)) {
      report.skippedDemoOrInternalRows += 1;
      continue;
    }
    if (!stripeById.has(dbRow.stripeSubscriptionId)) {
      let stillExists: Stripe.Subscription | null = null;
      try {
        stillExists = await stripe.subscriptions.retrieve(dbRow.stripeSubscriptionId);
      } catch {
        stillExists = null;
      }
      if (!stillExists) {
        report.discrepancies.dbRowNotFoundInStripeList.push({
          stripeSubscriptionId: dbRow.stripeSubscriptionId,
          userId: dbRow.userId,
          dbStatus: dbRow.status,
          note: "Subscription ID not returned in list and retrieve failed — likely deleted in Stripe. Row not deleted (manual review).",
        });
      }
    }
  }

  return report;
}
