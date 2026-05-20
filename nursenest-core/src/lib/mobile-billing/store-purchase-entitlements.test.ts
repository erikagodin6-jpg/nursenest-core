import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  mapStorePurchaseStateToEntitlement,
  normalizeStorePurchaseVerification,
  type StorePurchaseForEntitlement,
} from "@/lib/mobile-billing/store-purchase-entitlements";

const future = new Date("2099-01-01T00:00:00.000Z");
const past = new Date("2020-01-01T00:00:00.000Z");

function purchase(partial: Partial<StorePurchaseForEntitlement> = {}): StorePurchaseForEntitlement {
  return {
    provider: "APPLE_APP_STORE",
    productId: "rn.monthly",
    planTier: "RN",
    planCountry: "US",
    alliedCareer: null,
    planCode: "rn_monthly",
    planDuration: "monthly",
    status: "ACTIVE",
    entitlementExpiresAt: future,
    revocationReason: null,
    ...partial,
  };
}

test("store purchases grant entitlement only while server-verified and unexpired", () => {
  const active = mapStorePurchaseStateToEntitlement(purchase(), Date.parse("2026-01-01T00:00:00.000Z"));
  assert.equal(active?.hasPremium, true);
  assert.equal(active?.reason, "active_subscription");
  assert.equal(active?.allowedProfession.tier, "RN");
  assert.equal(active?.allowedRegion.country, "US");
  assert.equal(active?.plan.status, "active");

  assert.equal(mapStorePurchaseStateToEntitlement(purchase({ entitlementExpiresAt: past })), null);
  assert.equal(mapStorePurchaseStateToEntitlement(purchase({ status: "EXPIRED" })), null);
  assert.equal(mapStorePurchaseStateToEntitlement(purchase({ status: "REVOKED", entitlementExpiresAt: future })), null);
  assert.equal(mapStorePurchaseStateToEntitlement(purchase({ revocationReason: "refund" })), null);
});

test("store purchase verification never trusts client premium claims", () => {
  const result = normalizeStorePurchaseVerification({
    provider: "GOOGLE_PLAY",
    platformOriginalTransactionId: "gpa.1234",
    productId: "rn.monthly",
    clientClaimsPremium: true,
    serverVerified: false,
  });

  assert.equal(result.status, "verification_failed");
  assert.equal(result.grantsEntitlement, false);
});

test("store purchase verification accepts only supported store providers", () => {
  assert.throws(() =>
    normalizeStorePurchaseVerification({
      provider: "stripe" as never,
      platformOriginalTransactionId: "sub_123",
      productId: "rn.monthly",
      serverVerified: true,
    }),
  );
});

test("schema and migration define provider-neutral verified purchase ledger", () => {
  const schema = readFileSync(join(process.cwd(), "prisma", "schema.prisma"), "utf8");
  assert.match(schema, /model StorePurchase/);
  assert.match(schema, /enum StoreBillingProvider/);
  assert.match(schema, /enum StorePurchaseStatus/);
  assert.match(schema, /@@unique\(\[provider, platformOriginalTransactionId\]\)/);

  const migration = readFileSync(
    join(process.cwd(), "prisma", "migrations", "20260510080000_add_store_purchase_ledger", "migration.sql"),
    "utf8",
  );
  assert.match(migration, /CREATE TYPE "StoreBillingProvider"/);
  assert.match(migration, /CREATE TABLE "StorePurchase"/);
  assert.match(migration, /StorePurchase_provider_platformOriginalTransactionId_key/);
});
