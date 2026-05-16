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
 *
 * Production safety rule:
 *   This script must never print raw secret, Stripe, webhook, token, database, or credential
 *   values. It only prints boolean presence / validity state.
 */

const REQUIRED = [
  {
    key: "ENABLE_ECG_MODULE",
    expectedValue: "true",
    description: "Enables core ECG module for learners and marketing hubs",
    kind: "boolean",
  },
  {
    key: "NEXT_PUBLIC_ENABLE_ECG_MODULE",
    expectedValue: "true",
    description: "Enables ECG marketing tile (client-safe mirror of ENABLE_ECG_MODULE)",
    kind: "boolean",
  },
  {
    key: "STRIPE_PRICE_ADVANCED_ECG",
    expectedValue: "<stripe-price-id>",
    description:
      "Single Stripe price ID for the Advanced ECG add-on — shared across all billing durations (monthly / 3-month / 6-month / yearly)",
    kind: "stripe_price",
  },
];

const RECOMMENDED = [
  {
    key: "ENABLE_ADVANCED_ECG_MODULE",
    defaultValue: "true (if unset)",
    description: "Enables the Advanced ECG paid add-on (defaults true when absent)",
    kind: "boolean",
  },
  {
    key: "STRIPE_WEBHOOK_SECRET",
    description: "Required for entitlement grant after checkout.session.completed",
    kind: "secret",
  },
];

function isEnabled(value) {
  return value === "true" || value === "1";
}

function isValidStripePrice(value) {
  return /^price_[A-Za-z0-9_]+$/.test(value ?? "");
}

function redactStatus({ key, value, kind }) {
  if (!value) return "missing";
  if (kind === "boolean") return isEnabled(value) ? "enabled" : "present but not enabled";
  if (kind === "stripe_price") return isValidStripePrice(value) ? "configured price id" : "present but invalid price id shape";
  return "configured";
}

let allPass = true;
const failures = [];

console.log("\n=== ECG Module Publish-Readiness: Env Var Check ===\n");

for (const { key, kind, description } of REQUIRED) {
  const val = process.env[key]?.trim();
  const correct = kind === "boolean" ? isEnabled(val) : kind === "stripe_price" ? isValidStripePrice(val) : Boolean(val);

  const icon = correct ? "✅" : "❌";
  console.log(`${icon} ${key} — ${redactStatus({ key, value: val, kind })}`);
  if (!correct) {
    console.log(`  Purpose: ${description}`);
    failures.push(key);
    allPass = false;
  }
}

console.log("\n--- Recommended vars ---");
for (const { key, kind, defaultValue, description } of RECOMMENDED) {
  const val = process.env[key]?.trim();
  const icon = val ? "✅" : "⚠️ ";
  console.log(`${icon} ${key} — ${redactStatus({ key, value: val, kind })}${!val && defaultValue ? ` (default: ${defaultValue})` : ""}`);
  if (description) console.log(`   ${description}`);
}

console.log("\n=== Summary ===");
if (allPass) {
  console.log("✅ All required ECG env vars are configured. Proceed to readiness API check.\n");
  console.log("Next steps:");
  console.log("  1. npm run verify:ecg-production-readiness — verify no copy/key/governance blockers");
  console.log("  2. GET  /api/admin/modules/ecg/readiness   — verify canPublish: true");
  console.log("  3. POST /api/admin/modules/ecg/publish     — trigger publish (admin session required)");
  console.log("  4. POST /api/admin/modules/advanced-ecg/status  {\"status\":\"published\"}");
  process.exit(0);
}

console.log(`❌ ${failures.length} required var(s) missing or misconfigured:\n`);
for (const key of failures) console.log(`   • ${key}`);
console.log("\nSet these in your deployment environment before proceeding. No raw env values were printed.\n");
process.exit(1);
