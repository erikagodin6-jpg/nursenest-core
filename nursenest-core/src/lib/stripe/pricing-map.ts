import type { TierCode } from "@prisma/client";
import {
  eachPricedCombination,
  stripePriceEnvKey,
  alliedStripePriceEnvKey,
  sharedAlliedStripePriceEnvKey,
  canonicalNursingStripePriceEnvKey,
  canonicalSharedAlliedStripePriceEnvKey,
  canonicalAlliedStripePriceEnvKey,
  type AlliedCareerKey,
  type PricedCombination,
} from "@/lib/pricing/display-catalog";
import type { BillingDuration } from "@/lib/pricing/billing-types";
import { regionalStripePriceEnvKeyForPlan } from "@/lib/pricing/regional-pricing-map";
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

export type PriceSource = "canonical" | "legacy" | "missing";

export type StripePriceMatrixRow = {
  country: "CA" | "US";
  tier: TierCode;
  duration: BillingDuration;
  alliedCareer?: AlliedCareerKey;
  planCode: string;
  /** Canonical env key (STRIPE_PRICE_NURSENEST_*) — preferred name for diagnostics. */
  envKey: string;
  /** Legacy env key (STRIPE_PRICE_*) — fallback alias, set during migration. */
  legacyEnvKey: string;
  priceId: string | null;
  /** Which env key actually provided the price, or "missing" if neither is set. */
  priceSource: PriceSource;
};

function resolvePrice(
  canonicalKey: string,
  legacyKey: string,
): { priceId: string | null; source: PriceSource } {
  const cv = process.env[canonicalKey]?.trim();
  if (cv) return { priceId: cv, source: "canonical" };
  const lv = process.env[legacyKey]?.trim();
  if (lv) return { priceId: lv, source: "legacy" };
  return { priceId: null, source: "missing" };
}

function usLegacyNursingRegionalEnvKey(tier: TierCode, duration: BillingDuration): string | null {
  switch (tier) {
    case "RN":
    case "RPN":
    case "LVN_LPN":
    case "NP":
    case "NEW_GRAD":
      return `STRIPE_PRICE_US_NURSING_${duration === "monthly" ? "MONTHLY" : duration === "3-month" ? "3MONTH" : duration === "6-month" ? "6MONTH" : "YEARLY"}`;
    default:
      return null;
  }
}

export function eachStripePriceMatrixRow(): StripePriceMatrixRow[] {
  const rows: StripePriceMatrixRow[] = [];
  for (const combo of eachPricedCombination()) {
    let canonicalKey: string;
    let legacyKey: string;
    let resolved: { priceId: string | null; source: PriceSource };

    if (combo.alliedCareer && combo.country === "US") {
      canonicalKey = regionalStripePriceEnvKeyForPlan("us", "allied", combo.duration);
      legacyKey = canonicalSharedAlliedStripePriceEnvKey(combo.duration);
      resolved = resolvePrice(canonicalKey, legacyKey);
    } else if (combo.alliedCareer) {
      const cShared = canonicalSharedAlliedStripePriceEnvKey(combo.duration);
      const lShared = sharedAlliedStripePriceEnvKey(combo.duration);
      const cCareer = canonicalAlliedStripePriceEnvKey(combo.alliedCareer, combo.duration);
      const lCareer = alliedStripePriceEnvKey(combo.country, combo.alliedCareer, combo.duration);

      // Shared price takes precedence over per-career price
      const sharedResult = resolvePrice(cShared, lShared);
      if (sharedResult.source !== "missing") {
        canonicalKey = cShared;
        legacyKey = lShared;
        resolved = sharedResult;
      } else {
        canonicalKey = cCareer;
        legacyKey = lCareer;
        resolved = resolvePrice(cCareer, lCareer);
      }
    } else if (combo.country === "US") {
      canonicalKey = regionalStripePriceEnvKeyForPlan("us", "nursing", combo.duration, combo.tier);
      legacyKey = usLegacyNursingRegionalEnvKey(combo.tier, combo.duration) ?? stripePriceEnvKey(combo.country, combo.tier, combo.duration);
      resolved = resolvePrice(canonicalKey, legacyKey);
    } else {
      canonicalKey = canonicalNursingStripePriceEnvKey(combo.tier, combo.duration);
      legacyKey = stripePriceEnvKey(combo.country, combo.tier, combo.duration);
      resolved = resolvePrice(canonicalKey, legacyKey);
    }

    rows.push({
      country: combo.country,
      tier: combo.tier,
      duration: combo.duration,
      alliedCareer: combo.alliedCareer,
      planCode: combo.planCode,
      envKey: canonicalKey,
      legacyEnvKey: legacyKey,
      priceId: resolved.priceId,
      priceSource: resolved.source,
    });
  }
  return rows;
}

/** Returns canonical env keys for unconfigured plans. Deduplicates CA/US rows sharing the same key. */
export function listMissingStripePriceEnvKeys(): string[] {
  const seen = new Set<string>();
  return eachStripePriceMatrixRow()
    .filter((r) => !r.priceId)
    .map((r) => r.envKey)
    .filter((k) => (seen.has(k) ? false : (seen.add(k), true)));
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
    { missingCount: missing.length, exampleKey: missing[0] },
    new Error(
      `Missing ${missing.length} canonical STRIPE_PRICE_NURSENEST_* env var(s); checkout will return 400 for those plans. Example: ${missing[0]}`,
    ),
  );
}

export function logStripeCheckoutEnvStartupStatus(): void {
  const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeSecret) {
    console.error(
      "[nursenest-core] stripe checkout env: STRIPE_SECRET_KEY is missing — checkout session creation will fail.",
    );
    return;
  }

  const rows = eachStripePriceMatrixRow();
  // Deduplicate by canonical key (CA + US rows share the same env key)
  const seenCanonical = new Set<string>();
  const unique = rows.filter((r) => (seenCanonical.has(r.envKey) ? false : (seenCanonical.add(r.envKey), true)));

  const canonical = unique.filter((r) => r.priceSource === "canonical");
  const legacy = unique.filter((r) => r.priceSource === "legacy");
  const missing = unique.filter((r) => r.priceSource === "missing");

  console.log(
    `[nursenest-core] stripe pricing: ${canonical.length} canonical, ${legacy.length} legacy-alias, ${missing.length} missing`,
  );
  if (legacy.length > 0) {
    console.warn(
      `[nursenest-core] stripe pricing: ${legacy.length} plan(s) using legacy env keys — migrate to canonical:\n` +
        legacy.map((r) => `  ${r.legacyEnvKey} → ${r.envKey}`).join("\n"),
    );
  }
  if (missing.length > 0) {
    console.error(
      `[nursenest-core] stripe pricing: ${missing.length} plan(s) unconfigured — checkout returns 400 for these plans:\n` +
        missing.map((r) => `  ${r.envKey}`).join("\n"),
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

let cachedPriceMap: PriceEntry[] | undefined;

function priceMap(): PriceEntry[] {
  if (!cachedPriceMap) {
    cachedPriceMap = buildPriceMap();
  }
  return cachedPriceMap;
}

/** Clears memoized env-derived rows — use only from tests after mutating `process.env.STRIPE_PRICE_*`. */
export function resetStripePriceMapCacheForTests(): void {
  cachedPriceMap = undefined;
}

/** Find a nursing tier price entry. */
export function findPriceEntry(
  country: "CA" | "US",
  tier: TierCode,
  duration: BillingDuration,
): PriceEntry | undefined {
  return priceMap().find(
    (p) => p.country === country && p.tier === tier && p.duration === duration && !p.alliedCareer,
  );
}

/** Find an allied career price entry. */
export function findAlliedPriceEntry(
  country: "CA" | "US",
  career: AlliedCareerKey,
  duration: BillingDuration,
): PriceEntry | undefined {
  return priceMap().find(
    (p) => p.country === country && p.tier === "ALLIED" && p.alliedCareer === career && p.duration === duration,
  );
}

/** Find any price entry by plan code. */
export function findPriceEntryByPlanCode(planCode: string): PriceEntry | undefined {
  return priceMap().find((p) => p.planCode === planCode);
}

function uniqueCountryOrUndefined(matches: PriceEntry[]): "CA" | "US" | undefined {
  const countries = [...new Set(matches.map((p) => p.country))];
  return countries.length === 1 ? countries[0] : undefined;
}

/** Reverse lookup: Stripe Price id to plan identity. */
export function findTierCountryByPriceId(
  priceId: string,
): { tier: TierCode; country?: "CA" | "US"; duration: BillingDuration; alliedCareer?: AlliedCareerKey } | undefined {
  const matches = priceMap().filter((p) => p.priceId === priceId);
  if (matches.length === 0) return undefined;

  const nursing = matches.find((p) => !p.alliedCareer);
  if (nursing) {
    return {
      tier: nursing.tier,
      country: uniqueCountryOrUndefined(matches.filter((p) => !p.alliedCareer)),
      duration: nursing.duration,
    };
  }

  const alliedRows = matches.filter((p) => p.tier === "ALLIED");
  if (alliedRows.length > 0) {
    const first = alliedRows[0]!;
    /** Shared allied price id maps to ALLIED tier only — occupation comes from checkout / subscription metadata. */
    return {
      tier: "ALLIED",
      country: uniqueCountryOrUndefined(alliedRows),
      duration: first.duration,
    };
  }

  const row = matches[0]!;
  return { tier: row.tier, country: row.country, duration: row.duration, alliedCareer: row.alliedCareer };
}
