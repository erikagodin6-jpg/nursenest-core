import type { TierCode } from "@prisma/client";
import {
  eachPricedCombination,
  stripePriceEnvKey,
} from "@/lib/pricing/display-catalog";
import type { BillingDuration } from "@/lib/pricing/billing-types";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

export type { BillingDuration } from "@/lib/pricing/billing-types";

export type PriceEntry = {
  tier: TierCode;
  country: "CA" | "US";
  duration: BillingDuration;
  priceId: string;
};

/**
 * Full matrix: country + tier + billing duration → Stripe Price env var + resolved id (if set).
 * Single place to audit coverage; `display-catalog` defines which cells exist in the product.
 */
export type StripePriceMatrixRow = {
  country: "CA" | "US";
  tier: TierCode;
  duration: BillingDuration;
  /** Env var name, e.g. `STRIPE_PRICE_CA_RN_YEARLY`. */
  envKey: string;
  /** Stripe Price id when `envKey` is set in the environment. */
  priceId: string | null;
};

export function eachStripePriceMatrixRow(): StripePriceMatrixRow[] {
  const rows: StripePriceMatrixRow[] = [];
  for (const { country, tier, duration } of eachPricedCombination()) {
    const envKey = stripePriceEnvKey(country, tier, duration);
    const v = process.env[envKey]?.trim();
    rows.push({ country, tier, duration, envKey, priceId: v || null });
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

let loggedPricingGaps = false;

/** Idempotent server log when any expected `STRIPE_PRICE_*` env is unset (checkout will show unavailable for that cell). */
export function logStripePricingConfigurationGaps(): void {
  if (loggedPricingGaps) return;
  loggedPricingGaps = true;
  const missing = listMissingStripePriceEnvKeys();
  if (missing.length === 0) return;
  const hasSecret = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  safeServerLog("stripe_pricing", "missing_price_env_keys", {
    missingCount: missing.length,
    hasStripeSecret: hasSecret ? 1 : 0,
    keysPreview: missing.slice(0, 12).join(",").slice(0, 480),
  });
}

/** Production: Stripe secret is set but one or more price envs are missing — misconfiguration. */
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

function buildPriceMap(): PriceEntry[] {
  return eachStripePriceMatrixRow()
    .filter((r): r is StripePriceMatrixRow & { priceId: string } => Boolean(r.priceId))
    .map((r) => ({
      tier: r.tier,
      country: r.country,
      duration: r.duration,
      priceId: r.priceId,
    }));
}

/**
 * Stripe Price IDs — set via env `STRIPE_PRICE_{country}_{tier}_{MONTHLY|3MONTH|6MONTH|YEARLY}`.
 * Only combinations with a non-empty env value are checkout-eligible. UI amounts always come from
 * `display-catalog.ts` so labels and Stripe stay aligned when envs are set.
 */
export const priceMap: PriceEntry[] = buildPriceMap();

export function findPriceEntry(
  country: "CA" | "US",
  tier: TierCode,
  duration: BillingDuration,
): PriceEntry | undefined {
  return priceMap.find((p) => p.country === country && p.tier === tier && p.duration === duration);
}

/** Reverse lookup: Stripe Price id → plan identity (first match wins; each id should be unique per env). */
export function findTierCountryByPriceId(
  priceId: string,
): { tier: TierCode; country: "CA" | "US"; duration: BillingDuration } | undefined {
  const row = priceMap.find((p) => p.priceId === priceId);
  if (!row) return undefined;
  return { tier: row.tier, country: row.country, duration: row.duration };
}
