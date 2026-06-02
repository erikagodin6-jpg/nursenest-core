#!/usr/bin/env npx tsx
/**
 * Stripe ↔ Prisma Subscription reconciliation (CLI wrapper).
 * Core logic: `src/lib/stripe/stripe-subscription-reconciliation-run.ts`.
 * Cron HTTP: POST `/api/cron/stripe-reconcile`
 *
 *   npx tsx scripts/reconcile-stripe-subscriptions.ts
 *   npx tsx scripts/reconcile-stripe-subscriptions.ts --apply
 *
 * Env: DATABASE_URL, STRIPE_SECRET_KEY
 * Out: data/audit/stripe-reconciliation.json (monorepo root)
 */
import "../src/lib/db/script-env-bootstrap";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "../src/lib/db";
import {
  runStripeSubscriptionReconciliation,
  summarizeStripeSubscriptionReconciliationReport,
} from "../src/lib/stripe/stripe-subscription-reconciliation-run";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const OUT_JSON = join(REPO_ROOT, "data/audit/stripe-reconciliation.json");

async function main() {
  const apply = process.argv.includes("--apply");
  const report = await runStripeSubscriptionReconciliation(apply);
  await mkdir(dirname(OUT_JSON), { recursive: true });
  await writeFile(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ wrote: OUT_JSON, summary: summarizeStripeSubscriptionReconciliationReport(report) }, null, 2));
  const fatal = !report.stripeConfigured || !report.databaseAvailable;
  if (fatal) {
    console.error(JSON.stringify(report, null, 2));
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
