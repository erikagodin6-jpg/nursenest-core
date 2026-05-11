/**
 * Prints Stripe-related env keys expected by checkout / webhooks (DigitalOcean App Platform checklist).
 * Run from `nursenest-core/`: `npx tsx scripts/list-stripe-runtime-env-keys.mts`
 */
import { eachStripePriceMatrixRow } from "../src/lib/stripe/pricing-map";

const priceKeys = [...new Set(eachStripePriceMatrixRow().map((r) => r.envKey))].sort();

console.log("# Copy into DigitalOcean → App → Components → Runtime env\n");
console.log("STRIPE_SECRET_KEY=sk_live_…   # or sk_test_… for staging");
console.log("STRIPE_WEBHOOK_SECRET=whsec_… # endpoint signing secret");
console.log("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_… # if the app uses publishable key client-side\n");
console.log("# STRIPE_PRICE_* (from pricing matrix — set each to a Stripe Price id)\n");
for (const k of priceKeys) {
  console.log(`${k}=price_…`);
}
