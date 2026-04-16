import type { TierCode } from "@prisma/client";
import {
  eachPricedCombination,
  stripePriceEnvKey,
  alliedStripePriceEnvKey,
  type AlliedCareerKey,
  type PricedCombination,
} from "@/lib/pricing/display-catalog";
import type { BillingDuration } from "@/lib/pricing/billing-types";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

export type { BillingDuration } from "@/lib/pricing/billing-types";

export type PriceEntry = {
  tier: TierCode;
  country: "CA" | "US";
  duration: BillingDuration;
  priceId: string;
  alliedCareer?: AlliedCareerKey;
  planCode: string;
};

export type StripePriceMatrixRow = {
  country: "CA" | "US";
  tier: TierCode;
  duration: BillingDuration;
  alliedCareer?: AlliedCareerKey;
  planCode: string;
  envKey: string;
  priceId: string | null;
};

function envKeyForCombination(c: PricedCombination): string {
  if (c.alliedCareer) {
    return alliedStripePriceEnvKey(c.country, c.alliedCareer, c.duration);
  }
  return stripePriceEnvKey(c.country, c.tier, c.duration);
}

export function eachStripePriceMatrixRow(): StripePriceMatrixRow[] {
  const rows: StripePriceMatrixRow[] = [];
  for (const combo of eachPricedCombination()) {
    const envKey = envKeyForCombination(combo);
    const v = process.env[envKey]?.trim();
    rows.push({
      country: combo.country,
      tier: combo.tier,
      duration: combo.duration,
      alliedCareer: combo.alliedCareer,
      planCode: combo.planCode,
      envKey,
      priceId: v || null,
    });
  }
  return rows;
}

export function listMissingStripePriceEnvKeys(): string[] {
  return eachStripePriceMatrixRow()
    .filter((r) => !r.priceId)
    .map((r) => r.envKey);
}

export function isStripePricingFullyConfigured(): boolean {
  return listMissingStripePriceEnvKeys().length === 0;
}

export function logStripeProductionPricingMisconfiguration(): void {
  if (process.env.NODE_ENV !== "production") return;
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return;
  const missing = listMissingStripePriceEnvKeys();
  if (missing.length === 0) return;
  safeServerLogCritical(
    "stripe_pricing",
    "production_stripe_key_set_but_price_envs_missing",
    { missingCount: missing.length },
    new Error(
      `Missing ${missing.length} STRIPE_PRICE_* env var(s); checkout will fail for those plans. Example: ${missing[0]}`,
    ),
  );
}

export function logStripeCheckoutEnvStartupStatus(): void {
  const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeSecret) {
    console.error(
      "[nursenest-core] stripe checkout env: STRIPE_SECRET_KEY is missing — checkout session creation will fail.",
    );
  }

  const missingPriceEnvKeys = listMissingStripePriceEnvKeys();
  if (missingPriceEnvKeys.length > 0) {
    console.error(
      `[nursenest-core] stripe checkout env: missing ${missingPriceEnvKeys.length} STRIPE_PRICE_* key(s): ${missingPriceEnvKeys.join(", ")}`,
    );
  }
}

function buildPriceMap(): PriceEntry[] {
  return eachStripePriceMatrixRow()
    .filter((r): r is StripePriceMatrixRow & { priceId: string } => Boolean(r.priceId))
    .map((r) => ({
      tier: r.tier,
      country: r.country,
      duration: r.duration,
      priceId: r.priceId,
      alliedCareer: r.alliedCareer,
      planCode: r.planCode,
    }));
}

export const priceMap: PriceEntry[] = buildPriceMap();

/** Find a nursing tier price entry. */
export function findPriceEntry(
  country: "CA" | "US",
  tier: TierCode,
  duration: BillingDuration,
): PriceEntry | undefined {
  return priceMap.find(
    (p) => p.country === country && p.tier === tier && p.duration === duration && !p.alliedCareer,
  );
}

/** Find an allied career price entry. */
export function findAlliedPriceEntry(
  country: "CA" | "US",
  career: AlliedCareerKey,
  duration: BillingDuration,
): PriceEntry | undefined {
  return priceMap.find(
    (p) => p.country === country && p.tier === "ALLIED" && p.alliedCareer === career && p.duration === duration,
  );
}

/** Find any price entry by plan code. */
export function findPriceEntryByPlanCode(planCode: string): PriceEntry | undefined {
  return priceMap.find((p) => p.planCode === planCode);
}

/** Reverse lookup: Stripe Price id to plan identity. */
export function findTierCountryByPriceId(
  priceId: string,
): { tier: TierCode; country: "CA" | "US"; duration: BillingDuration; alliedCareer?: AlliedCareerKey } | undefined {
  const row = priceMap.find((p) => p.priceId === priceId);
  if (!row) return undefined;
  return { tier: row.tier, country: row.country, duration: row.duration, alliedCareer: row.alliedCareer };
}
