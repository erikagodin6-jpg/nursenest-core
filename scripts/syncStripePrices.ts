import Stripe from "stripe";
import fs from "fs";
import path from "path";

const LIVE_PRODUCT_IDS: Record<string, { tier: string; duration: string }> = {
  "prod_U9CdKNpdOh3XZ1": { tier: "rpn", duration: "monthly" },
  "prod_U9Ce0rNDFBofDr": { tier: "rpn", duration: "3-month" },
  "prod_U9CeWkWf8Ep8q7": { tier: "rpn", duration: "6-month" },
  "prod_U9CfqLzYK5X7bz": { tier: "rpn", duration: "yearly" },
  "prod_U9Cg99g3wSfc2g": { tier: "rn", duration: "monthly" },
  "prod_U9Ch6FcT27ns23": { tier: "rn", duration: "3-month" },
  "prod_U9ChXTIqxoXPmx": { tier: "rn", duration: "6-month" },
  "prod_U9CibnLqRoT5S3": { tier: "rn", duration: "yearly" },
  "prod_U9CiUzFg1IMsVv": { tier: "np", duration: "monthly" },
  "prod_U9CjN7FU5OTA2O": { tier: "np", duration: "3-month" },
  "prod_U9Cj1HjqMbBjHa": { tier: "np", duration: "6-month" },
  "prod_U9CjmsQxQSJ1bH": { tier: "np", duration: "yearly" },
};

interface PriceEntry {
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

async function getStripeClient(): Promise<Stripe> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error("Replit token not found");
  }

  const isProduction = process.env.REPLIT_DEPLOYMENT === "1";
  const targetEnvironment = isProduction ? "production" : "development";

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set("include_secrets", "true");
  url.searchParams.set("connector_names", "stripe");
  url.searchParams.set("environment", targetEnvironment);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      X_REPLIT_TOKEN: xReplitToken,
    },
  });

  const data = await response.json();
  const conn = data.items?.[0];
  if (!conn?.settings?.secret) {
    throw new Error(`Stripe ${targetEnvironment} connection not found`);
  }

  return new Stripe(conn.settings.secret, {
    apiVersion: "2025-08-27.basil" as any,
  });
}

function inferTierFromName(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.includes("rpn") || lower.includes("lvn")) return "rpn";
  if (lower.includes(" np ") || lower.startsWith("np ") || lower.includes("np -") || lower.includes("np advanced")) return "np";
  if (lower.includes(" rn ") || lower.startsWith("rn ") || lower.includes("rn -") || lower.includes("rn/nclex")) return "rn";
  return null;
}

function inferDurationFromName(name: string): string | null {
  const lower = name.toLowerCase();
  if (/1\s*month|monthly/i.test(lower)) return "monthly";
  if (/3\s*month/i.test(lower)) return "3-month";
  if (/6\s*month/i.test(lower)) return "6-month";
  if (/1\s*year|yearly|annual/i.test(lower)) return "yearly";
  return null;
}

async function main() {
  console.log("=== NurseNest Stripe Price Sync ===\n");

  const isProduction = process.env.REPLIT_DEPLOYMENT === "1";
  const stripe = await getStripeClient();
  const entries: PriceEntry[] = [];
  const warnings: string[] = [];

  // In production mode, use the hardcoded live product IDs
  // In test mode, discover products by metadata or name parsing
  let productsToSync: { productId: string; tier: string; duration: string; productName: string }[] = [];

  if (isProduction) {
    console.log("Mode: LIVE — using hardcoded product IDs\n");
    for (const [productId, meta] of Object.entries(LIVE_PRODUCT_IDS)) {
      try {
        const product = await stripe.products.retrieve(productId);
        productsToSync.push({ productId, tier: meta.tier, duration: meta.duration, productName: product.name });
      } catch (err: any) {
        warnings.push(`ERROR: Live product ${productId} (${meta.tier} ${meta.duration}): ${err.message}`);
      }
    }
  } else {
    console.log("Mode: TEST — discovering products by metadata\n");
    const allProducts = await stripe.products.list({ limit: 100, active: true });
    for (const product of allProducts.data) {
      const tier = product.metadata?.tier || inferTierFromName(product.name);
      const duration = product.metadata?.duration || inferDurationFromName(product.name);
      if (tier && duration && ["rpn", "rn", "np"].includes(tier)) {
        productsToSync.push({ productId: product.id, tier, duration, productName: product.name });
      }
    }
  }

  console.log(`Found ${productsToSync.length} subscription products to sync\n`);

  // Expected combinations
  const expected = new Set<string>();
  for (const t of ["rpn", "rn", "np"]) {
    for (const d of ["monthly", "3-month", "6-month", "yearly"]) {
      expected.add(`${t}:${d}`);
    }
  }

  for (const prod of productsToSync) {
    const prices = await stripe.prices.list({
      product: prod.productId,
      active: true,
      limit: 100,
    });

    const recurringPrices = prices.data.filter((p) => p.recurring && p.active);

    if (recurringPrices.length === 0) {
      warnings.push(`WARNING: No active recurring price for ${prod.tier} ${prod.duration} (${prod.productId} "${prod.productName}")`);
      continue;
    }

    // Group by currency
    const byCurrency: Record<string, Stripe.Price[]> = {};
    for (const p of recurringPrices) {
      if (!byCurrency[p.currency]) byCurrency[p.currency] = [];
      byCurrency[p.currency].push(p);
    }

    for (const [currency, currencyPrices] of Object.entries(byCurrency)) {
      if (currencyPrices.length > 1) {
        warnings.push(`WARNING: ${currencyPrices.length} active ${currency.toUpperCase()} prices for ${prod.tier} ${prod.duration}. Using most recent.`);
      }

      const bestPrice = currencyPrices.sort((a, b) => b.created - a.created)[0];
      entries.push({
        tier: prod.tier,
        duration: prod.duration,
        productId: prod.productId,
        productName: prod.productName,
        priceId: bestPrice.id,
        unitAmount: bestPrice.unit_amount || 0,
        currency,
        recurringInterval: bestPrice.recurring?.interval || null,
        recurringIntervalCount: bestPrice.recurring?.interval_count || null,
        active: bestPrice.active,
      });

      expected.delete(`${prod.tier}:${prod.duration}`);
    }
  }

  // Warn about missing tier/duration combinations
  for (const missing of expected) {
    const [tier, duration] = missing.split(":");
    warnings.push(`MISSING: No product found for ${tier.toUpperCase()} ${duration}`);
  }

  const outPath = path.join(process.cwd(), "stripe-price-map.json");
  const output = {
    syncedAt: new Date().toISOString(),
    mode: isProduction ? "live" : "test",
    prices: entries,
  };
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log("--- Summary by Tier ---\n");
  const grouped: Record<string, PriceEntry[]> = {};
  for (const e of entries) {
    if (!grouped[e.tier]) grouped[e.tier] = [];
    grouped[e.tier].push(e);
  }
  for (const [tier, items] of Object.entries(grouped)) {
    console.log(`  ${tier.toUpperCase()}:`);
    for (const item of items) {
      const amt = (item.unitAmount / 100).toFixed(2);
      console.log(
        `    ${item.duration.padEnd(10)} ${item.currency.toUpperCase()} $${amt.padStart(8)}  ${item.priceId}  (${item.recurringInterval}/${item.recurringIntervalCount})`
      );
    }
  }

  if (warnings.length > 0) {
    console.log("\n--- Warnings ---\n");
    for (const w of warnings) console.log(`  ${w}`);
  }

  console.log(`\nWrote ${entries.length} prices to ${outPath}`);
  console.log("Done.\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
