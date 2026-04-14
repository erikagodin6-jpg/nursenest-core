#!/usr/bin/env npx tsx
/**
 * Stripe ↔ Prisma Subscription reconciliation (Stripe is source of truth).
 *
 * - Lists subscriptions from the Stripe API (paginated, status=all).
 * - Compares to `Subscription` rows (by `stripeSubscriptionId`).
 * - Detects: missing DB rows, tier/country drift, status drift, period-end drift, DB still "active" when Stripe ended.
 * - Never deletes rows. Default: report only. Use `--apply` for safe updates (no creates unless `userId` in Stripe metadata).
 *
 *   npx tsx scripts/reconcile-stripe-subscriptions.ts
 *   npx tsx scripts/reconcile-stripe-subscriptions.ts --apply
 *
 * Env: DATABASE_URL, STRIPE_SECRET_KEY
 * Out: data/audit/stripe-reconciliation.json (monorepo root)
 */
import "../src/lib/db/env-bootstrap";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type Stripe from "stripe";
import { Prisma, SubscriptionStatus, type TierCode } from "@prisma/client";
import { prisma } from "../src/lib/db";
import { getStripeClient } from "../src/lib/stripe/stripe-client";
import { findTierCountryByPriceId } from "../src/lib/stripe/pricing-map";
import { syncUserFromStripePriceId } from "../src/lib/stripe/sync-user-from-stripe-subscription";
import { isDatabaseUrlConfigured } from "../src/lib/db/safe-database";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const OUT_JSON = join(REPO_ROOT, "data/audit/stripe-reconciliation.json");

function mapStripeSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus | null {
  switch (status) {
    case "active":
    case "trialing":
      return SubscriptionStatus.ACTIVE;
    case "past_due":
    case "unpaid":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
    case "incomplete_expired":
      return SubscriptionStatus.CANCELLED;
    case "incomplete":
    case "paused":
      return null;
    default:
      return SubscriptionStatus.CANCELLED;
  }
}

function firstSubscriptionPriceId(sub: Stripe.Subscription): string | undefined {
  const item = sub.items?.data?.[0];
  if (!item?.price) return undefined;
  return typeof item.price === "string" ? item.price : item.price.id;
}

function billingLifecycleFields(sub: Stripe.Subscription): {
  currentPeriodEnd?: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
} {
  const fields = { cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end) };
  const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;
  if (typeof periodEnd === "number" && periodEnd > 0) {
    Object.assign(fields, { currentPeriodEnd: new Date(periodEnd * 1000) });
  }
  const trialEnd = (sub as unknown as { trial_end?: number }).trial_end;
  if (typeof trialEnd === "number" && trialEnd > 0) {
    Object.assign(fields, { trialEnd: new Date(trialEnd * 1000) });
  }
  return fields;
}

function isDemoStripeId(id: string): boolean {
  return id.startsWith("demo_sub_");
}

type DiscrepancyBase = { stripeSubscriptionId: string };

type Report = {
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
    dbActiveButStripeNotEntitled: Array<
      DiscrepancyBase & {
        userId: string;
        dbStatus: SubscriptionStatus;
        stripeStatus: Stripe.Subscription.Status;
        reason: string;
      }
    >;
  };
  apply: {
    attempted: boolean;
    /** One increment per subscription row updated (single batched Prisma update per sub when possible). */
    subscriptionRowsUpdated: number;
    userSyncsApplied: number;
    createsApplied: number;
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

async function main() {
  const apply = process.argv.includes("--apply");
  const generatedAt = new Date().toISOString();

  const report: Report = {
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
      dbActiveButStripeNotEntitled: [],
    },
    apply: {
      attempted: apply,
      subscriptionRowsUpdated: 0,
      userSyncsApplied: 0,
      createsApplied: 0,
      errors: [],
    },
    notes: [
      "Does not delete Subscription rows. Orphan DB rows (Stripe sub deleted) are reported only.",
      "Creates missing DB rows only when Stripe subscription metadata includes userId and --apply.",
      "Tier mapping uses STRIPE_PRICE_* env price ids via findTierCountryByPriceId — regional-only prices may show as unmapped.",
    ],
  };

  const stripe = await getStripeClient();
  if (!stripe) {
    report.apply.errors.push({ message: "STRIPE_SECRET_KEY not set — cannot list Stripe subscriptions." });
    await mkdir(dirname(OUT_JSON), { recursive: true });
    await writeFile(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.error(JSON.stringify(report, null, 2));
    process.exit(1);
  }

  if (!isDatabaseUrlConfigured()) {
    report.apply.errors.push({ message: "DATABASE_URL not configured — cannot compare to Prisma." });
    await mkdir(dirname(OUT_JSON), { recursive: true });
    await writeFile(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.error(JSON.stringify(report, null, 2));
    process.exit(1);
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

  const PERIOD_DRIFT_MS = 120_000;

  for (const sub of stripeSubs) {
    const priceId = firstSubscriptionPriceId(sub) ?? null;
    const mapped = priceId ? findTierCountryByPriceId(priceId) : undefined;
    const mappedStatus = mapStripeSubscriptionStatus(sub.status);
    const lifecycle = billingLifecycleFields(sub);
    const meta = sub.metadata && typeof sub.metadata === "object" ? sub.metadata : {};
    const metadataUserId = typeof meta.userId === "string" && meta.userId.trim() ? meta.userId.trim() : null;

    const row = dbByStripeId.get(sub.id);
    if (!row) {
      report.discrepancies.missingInDb.push({
        stripeSubscriptionId: sub.id,
        stripeCustomerId: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
        stripeStatus: sub.status,
        priceId,
        metadataUserId,
        note:
          metadataUserId == null
            ? "No DB row; set Stripe subscription metadata userId to allow --apply create, or link manually."
            : "No DB row; metadata userId present — --apply can create Subscription if user exists.",
      });

      if (apply && metadataUserId) {
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
            await prisma.subscription.create({
              data: {
                userId: metadataUserId,
                stripeSubscriptionId: sub.id,
                stripeCustomerId: customerId,
                status: mappedStatus,
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
      if (delta > PERIOD_DRIFT_MS) {
        report.discrepancies.periodEndDrift.push({
          stripeSubscriptionId: sub.id,
          userId: row.userId,
          dbPeriodEnd: dbEnd.toISOString(),
          stripePeriodEnd: stripeEnd.toISOString(),
          deltaMs: delta,
        });
      }
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
    }

    if (stripeEnd && dbEnd) {
      const delta = Math.abs(stripeEnd.getTime() - dbEnd.getTime());
      if (delta > PERIOD_DRIFT_MS) {
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

    const stripeEnded = sub.status === "canceled" || sub.status === "incomplete_expired";
    if (
      (row.status === SubscriptionStatus.ACTIVE || row.status === SubscriptionStatus.GRACE) &&
      stripeEnded
    ) {
      report.discrepancies.dbActiveButStripeNotEntitled.push({
        stripeSubscriptionId: sub.id,
        userId: row.userId,
        dbStatus: row.status,
        stripeStatus: sub.status,
        reason:
          "High-signal: Stripe ended subscription; DB still ACTIVE/GRACE. Status alignment is handled via statusMismatch + --apply.",
      });
    }
  }

  for (const dbRow of dbRows) {
    if (isDemoStripeId(dbRow.stripeSubscriptionId)) {
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

  await mkdir(dirname(OUT_JSON), { recursive: true });
  await writeFile(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ wrote: OUT_JSON, summary: summarizeReport(report) }, null, 2));
}

function summarizeReport(r: Report) {
  const d = r.discrepancies;
  return {
    stripeSubscriptionTotalListed: r.stripeSubscriptionTotalListed,
    dbSubscriptionTotal: r.dbSubscriptionTotal,
    counts: {
      missingInDb: d.missingInDb.length,
      dbRowNotFoundInStripeList: d.dbRowNotFoundInStripeList.length,
      tierMismatch: d.tierMismatch.length,
      statusMismatch: d.statusMismatch.length,
      periodEndDrift: d.periodEndDrift.length,
      dbActiveButStripeNotEntitled: d.dbActiveButStripeNotEntitled.length,
    },
    apply: r.apply,
    notes: r.notes,
  };
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
