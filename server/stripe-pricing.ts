import fs from "fs";
import path from "path";
import { emitStructuredLog } from "./log-sink";

interface StripePriceEntry {
  tier: string;
  duration: string;
  productId: string;
  productName: string;
  priceId: string;
  unitAmount: number;
  currency: string;
  recurringInterval: string | null;
  recurringIntervalCount: number | null;
  active: boolean;
}

interface StripePriceMap {
  syncedAt: string;
  mode: string;
  prices: StripePriceEntry[];
}

type CurrencyMap = Record<string, string>;
type DurationMap = Record<string, CurrencyMap>;
type TierMap = Record<string, DurationMap>;

const SUBSCRIPTION_TIERS = ["rpn", "rn", "np", "allied", "newgrad"] as const;
const DURATIONS = ["monthly", "3-month", "6-month", "yearly"] as const;
const CURRENCIES = ["usd", "cad"] as const;

const LIVE_PRICE_MAP: TierMap = {
  rpn: {
    monthly: { usd: "", cad: "" },
    "3-month": { usd: "", cad: "" },
    "6-month": { usd: "", cad: "" },
    yearly: { usd: "", cad: "" },
  },
  rn: {
    monthly: { usd: "", cad: "" },
    "3-month": { usd: "", cad: "" },
    "6-month": { usd: "", cad: "" },
    yearly: { usd: "", cad: "" },
  },
  np: {
    monthly: { usd: "", cad: "" },
    "3-month": { usd: "", cad: "" },
    "6-month": { usd: "", cad: "" },
    yearly: { usd: "", cad: "" },
  },
  allied: {
    monthly: { usd: "", cad: "" },
    "3-month": { usd: "", cad: "" },
    "6-month": { usd: "", cad: "" },
    yearly: { usd: "", cad: "" },
  },
  newgrad: {
    monthly: { usd: "", cad: "" },
    "3-month": { usd: "", cad: "" },
    "6-month": { usd: "", cad: "" },
    yearly: { usd: "", cad: "" },
  },
};

let priceIndex: Record<string, string> = {};
let loaded = false;

function normalizeTier(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeDuration(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeCurrency(value: string): string {
  return value.trim().toLowerCase();
}

function buildKey(tier: string, duration: string, currency: string): string {
  return `${normalizeTier(tier)}:${normalizeDuration(duration)}:${normalizeCurrency(currency)}`;
}

function getExpectedMode(): "live" | "test" {
  return process.env.REPLIT_DEPLOYMENT === "1" ? "live" : "test";
}

function getCandidateMapFiles(expectedMode: "live" | "test"): string[] {
  return expectedMode === "live"
    ? ["stripe-price-map-live.json", "stripe-price-map.json"]
    : ["stripe-price-map.json"];
}

function addPriceEntry(entry: StripePriceEntry): void {
  if (!entry.priceId) return;

  const key = buildKey(entry.tier, entry.duration, entry.currency);
  priceIndex[key] = entry.priceId;
}

function loadFromJsonMap(expectedMode: "live" | "test"): boolean {
  const mapFiles = getCandidateMapFiles(expectedMode);

  for (const filename of mapFiles) {
    const filePath = path.join(process.cwd(), filename);
    if (!fs.existsSync(filePath)) continue;

    try {
      const raw = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(raw) as StripePriceMap;

      if (data.mode !== expectedMode) {
        emitStructuredLog(
          {
            level: "warn",
            type: "stripe_pricing_skip_file",
            provider: "stripe",
            msg: "skipping price map file — mode mismatch",
            filename,
            fileMode: data.mode,
            expectedMode,
          },
          "warn",
        );
        continue;
      }

      for (const entry of data.prices) {
        addPriceEntry(entry);
      }

      emitStructuredLog({
        level: "info",
        type: "stripe_pricing_loaded",
        provider: "stripe",
        msg: "loaded price map",
        filename,
        mode: data.mode,
        syncedAt: data.syncedAt,
        count: data.prices.length,
      });
      return true;
    } catch (error: any) {
      emitStructuredLog(
        {
          level: "warn",
          type: "stripe_pricing_load_failed",
          provider: "stripe",
          msg: error?.message || "Unknown error",
          filename,
        },
        "warn",
      );
    }
  }

  return false;
}

function mergeStaticFallbackMap(): void {
  for (const [tier, durationMap] of Object.entries(LIVE_PRICE_MAP)) {
    for (const [duration, currencyMap] of Object.entries(durationMap)) {
      for (const [currency, priceId] of Object.entries(currencyMap)) {
        if (!priceId) continue;

        const key = buildKey(tier, duration, currency);
        if (!priceIndex[key]) {
          priceIndex[key] = priceId;
        }
      }
    }
  }
}

function getAllExpectedKeys(): string[] {
  const keys: string[] = [];

  for (const tier of SUBSCRIPTION_TIERS) {
    for (const duration of DURATIONS) {
      for (const currency of CURRENCIES) {
        keys.push(buildKey(tier, duration, currency));
      }
    }
  }

  return keys;
}

function logCoverageSummary(): void {
  const missing = getMissingPriceIds();

  if (missing.length > 0) {
    emitStructuredLog(
      {
        level: "warn",
        type: "stripe_pricing_missing_ids",
        provider: "stripe",
        msg: "some tier/duration/currency combinations missing price IDs — inline price_data fallback",
        missingCount: missing.length,
      },
      "warn",
    );
    return;
  }

  emitStructuredLog({
    level: "info",
    type: "stripe_pricing_complete",
    provider: "stripe",
    msg: "all subscription price IDs loaded",
  });
}

export function loadStripePrices(): void {
  priceIndex = {};

  const expectedMode = getExpectedMode();
  const mapLoaded = loadFromJsonMap(expectedMode);

  if (!mapLoaded) {
    emitStructuredLog(
      {
        level: "warn",
        type: "stripe_pricing_no_map",
        provider: "stripe",
        msg: "no price map file found — inline price_data fallback",
        expectedMode,
      },
      "warn",
    );
  }

  mergeStaticFallbackMap();

  loaded = true;
  logCoverageSummary();
}

export function getStripePriceId(
  tier: string,
  duration: string,
  currency: string
): string | null {
  if (!loaded) {
    loadStripePrices();
  }

  const key = buildKey(tier, duration, currency);
  return priceIndex[key] ?? null;
}

export function hasStripePriceId(
  tier: string,
  duration: string,
  currency: string
): boolean {
  return getStripePriceId(tier, duration, currency) !== null;
}

export function getMissingPriceIds(): string[] {
  if (!loaded) {
    loadStripePrices();
  }

  const missing: string[] = [];

  for (const key of getAllExpectedKeys()) {
    if (!priceIndex[key]) {
      const [tier, duration, currency] = key.split(":");
      missing.push(`tier=${tier} interval=${duration} currency=${currency}`);
    }
  }

  return missing;
}