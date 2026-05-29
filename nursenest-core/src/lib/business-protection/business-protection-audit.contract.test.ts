import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

test("business protection migration creates immutable audit tables and indexes", () => {
  const sql = read("prisma/migrations/20260708120000_business_protection_audit/migration.sql");
  for (const table of ["policy_acceptance_records", "admin_audit_events", "chargeback_evidence_exports"]) {
    assert.match(sql, new RegExp(`CREATE TABLE IF NOT EXISTS "${table}"`));
  }
  assert.match(sql, /"wording_sha256" VARCHAR\(64\) NOT NULL/);
  assert.match(sql, /policy_acceptance_records_user_created_idx/);
  assert.match(sql, /admin_audit_events_actor_created_idx/);
  assert.match(sql, /chargeback_evidence_exports_user_created_idx/);
});

test("checkout routes persist exact policy acceptance proof after Stripe session creation", () => {
  const routes = [
    "src/app/api/subscriptions/checkout/route.ts",
    "src/app/api/subscriptions/checkout/advanced-ecg/route.ts",
    "src/app/api/subscriptions/checkout/advanced-labs/route.ts",
    "src/app/api/subscriptions/checkout/critical-care-bundle/route.ts",
    "src/app/api/subscriptions/checkout/advanced-hemodynamics/route.ts",
  ];

  for (const route of routes) {
    const src = read(route);
    assert.match(src, /recordCheckoutPolicyAcceptance/);
    assert.match(src, /stripeCheckoutSessionId:\s*checkoutSession\.id/);
    assert.match(src, /policyBundleVersion:/);
  }
});

test("admin evidence exports are themselves audited", () => {
  const route = read("src/app/api/admin/users/[userId]/activity-evidence/route.ts");
  assert.match(route, /recordChargebackEvidenceExport/);
  assert.match(route, /generatedByUserId:\s*gate\.admin\.userId/);
  assert.match(route, /policyAcceptanceCount/);
});
