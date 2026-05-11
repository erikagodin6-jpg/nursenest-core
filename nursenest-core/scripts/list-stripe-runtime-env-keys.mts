/**
 * Prints Stripe-related env keys expected by checkout / webhooks (DigitalOcean App Platform checklist).
 * Run from `nursenest-core/`: `npx tsx scripts/list-stripe-runtime-env-keys.mts`
 */
import { eachStripePriceMatrixRow } from "../src/lib/stripe/pricing-map";

export function listStripeRuntimeEnvKeys(): string[] {
  return [...new Set(eachStripePriceMatrixRow().map((r) => r.envKey))].sort();
}

const isMain = typeof process.argv[1] === "string" && process.argv[1].includes("list-stripe-runtime-env-keys");

if (isMain) {
  const priceKeys = listStripeRuntimeEnvKeys();
  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(priceKeys));
  } else {
    console.log("# Copy into DigitalOcean → App → Components → Runtime env\n");
    console.log("STRIPE_SECRET_KEY=sk_live_…   # or sk_test_… for staging");
    console.log("STRIPE_WEBHOOK_SECRET=whsec_… # endpoint signing secret");
    console.log("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_… # if the app uses publishable key client-side\n");
    console.log("# STRIPE_PRICE_* (from pricing matrix — set each to a Stripe Price id)\n");
    for (const k of priceKeys) {
      console.log(`${k}=price_…`);
    }
  }
}
