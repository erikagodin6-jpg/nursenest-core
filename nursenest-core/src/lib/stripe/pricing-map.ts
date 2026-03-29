import type { TierCode } from "@prisma/client";
import {
  eachPricedCombination,
  stripePriceEnvKey,
} from "@/lib/pricing/display-catalog";
import type { BillingDuration } from "@/lib/pricing/billing-types";

export type { BillingDuration } from "@/lib/pricing/billing-types";

export type PriceEntry = {
  tier: TierCode;
  country: "CA" | "US";
  duration: BillingDuration;
  priceId: string;
};

function envPriceId(key: string): string | undefined {
  const v = process.env[key]?.trim();
  return v || undefined;
}

/**
 * Stripe Price IDs — set via env `STRIPE_PRICE_{country}_{tier}_{MONTHLY|3MONTH|6MONTH|YEARLY}`.
 * Only combinations with a non-empty env value are checkout-eligible. UI amounts always come from
 * `display-catalog.ts` so labels and Stripe stay aligned when envs are set.
 */
function buildPriceMap(): PriceEntry[] {
  const out: PriceEntry[] = [];
  for (const { country, tier, duration } of eachPricedCombination()) {
    const key = stripePriceEnvKey(country, tier, duration);
    const priceId = envPriceId(key);
    if (priceId) {
      out.push({ tier, country, duration, priceId });
    }
  }
  return out;
}

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
