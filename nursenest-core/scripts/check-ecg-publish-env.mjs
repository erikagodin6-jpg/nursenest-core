/**
 * ECG module publish-readiness env-var checker.
 *
 * Usage:
 *   node scripts/check-ecg-publish-env.mjs
 *
 * Advanced ECG uses a SINGLE Stripe price (STRIPE_PRICE_ADVANCED_ECG) shared across all
 * billing durations. advancedEcgStripePriceEnvKey() ignores the duration argument and always
 * returns "STRIPE_PRICE_ADVANCED_ECG" — one price ID covers monthly, 3-month, 6-month, yearly.
 *
 * Exits 1 if any required var is missing; exits 0 if all are present.
 */

const REQUIRED = [
  {
    key: "ENABLE_ECG_MODULE",
    expectedValue: "true",
    description: "Enables core ECG module for learners and marketing hubs",
  },
  {
    key: "NEXT_PUBLIC_ENABLE_ECG_MODULE",
    expectedValue: "true",
    description: "Enables ECG marketing tile (client-safe mirror of ENABLE_ECG_MODULE)",
  },
  {
    key: "STRIPE_PRICE_ADVANCED_ECG",
    expectedValue: "<stripe-price-id>",
    description:
      "Single Stripe price ID for the Advanced ECG add-on — shared across all billing durations (monthly / 3-month / 6-month / yearly)",
  },
];

const RECOMMENDED = [
  {
    key: "ENABLE_ADVANCED_ECG_MODULE",
    defaultValue: "true (if unset)",
    description: "Enables the Advanced ECG paid add-on (defaults true when absent)",
  },
  {
    key: "STRIPE_WEBHOOK_SECRET",
    description: "Required for entitlement grant after checkout.session.completed",
  },
];

let allPass = true;
const failures = [];

console.log("\n=== ECG Module Publish-Readiness: Env Var Check ===\n");

for (const { key, expectedValue, description } of REQUIRED) {
  const val = process.env[key]?.trim();
  const present = Boolean(val);
  const correct =
    key.startsWith("ENABLE_") || key.startsWith("NEXT_PUBLIC_ENABLE_")
      ? val === "true" || val === "1"
      : present;

  const icon = correct ? "✅" : "❌";
  console.log(`${icon} ${key}`);
  if (!correct) {
    console.log(present ? `  value "${val}" — expected "true"` : "  MISSING");
    console.log(`  Purpose: ${description}`);
    failures.push(key);
    allPass = false;
  }
}

console.log("\n--- Recommended vars ---");
for (const { key, defaultValue, description } of RECOMMENDED) {
  const val = process.env[key]?.trim();
  const icon = val ? "✅" : "⚠️ ";
  console.log(`${icon} ${key}${!val && defaultValue ? ` (default: ${defaultValue})` : ""}`);
  if (description) console.log(`   ${description}`);
}

console.log("\n=== Summary ===");
if (allPass) {
  console.log("✅ All required ECG env vars are configured. Proceed to readiness API check.\n");
  console.log("Next steps:");
  console.log("  1. GET  /api/admin/modules/ecg/readiness   — verify canPublish: true");
  console.log("  2. POST /api/admin/modules/ecg/publish     — trigger publish (admin session required)");
  console.log("  3. POST /api/admin/modules/advanced-ecg/status  {\"status\":\"published\"}");
  process.exit(0);
} else {
  console.log(`❌ ${failures.length} required var(s) missing or misconfigured:\n`);
  for (const key of failures) console.log(`   • ${key}`);
  console.log("\nSet these in your deployment environment before proceeding.\n");
  process.exit(1);
}
