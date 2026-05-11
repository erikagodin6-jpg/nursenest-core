import assert from "node:assert/strict";
import test from "node:test";
import { SubscriptionStatus } from "@prisma/client";
import {
  buildAdvancedEcgPackageSummary,
  pickLatestAdvancedEcgPackageRow,
} from "@/lib/advanced-ecg/advanced-ecg-package";

test("Advanced ECG package summary derives lifetime ownership from add-on rows", () => {
  const rows = [
    {
      status: SubscriptionStatus.ACTIVE,
      planCode: "module_advanced_ecg_lifetime",
      currentPeriodEnd: null,
      trialEnd: null,
      updatedAt: new Date("2026-05-11T00:00:00.000Z"),
      createdAt: new Date("2026-05-01T00:00:00.000Z"),
    },
    {
      status: SubscriptionStatus.ACTIVE,
      planCode: "us_rn_monthly",
      currentPeriodEnd: new Date("2026-06-01T00:00:00.000Z"),
      trialEnd: null,
      updatedAt: new Date("2026-05-11T00:00:00.000Z"),
      createdAt: new Date("2026-04-20T00:00:00.000Z"),
    },
  ] as const;

  const picked = pickLatestAdvancedEcgPackageRow(rows);
  assert.equal(picked?.planCode, "module_advanced_ecg_lifetime");

  const summary = buildAdvancedEcgPackageSummary(rows);
  assert.ok(summary);
  assert.equal(summary?.productName, "Advanced ECG & Telemetry Mastery");
  assert.equal(summary?.priceLabel, "$99 CAD");
  assert.equal(summary?.purchaseModel, "one_time_lifetime");
  assert.equal(summary?.accessActive, true);
});

test("Advanced ECG package summary ignores non-module plan rows", () => {
  const summary = buildAdvancedEcgPackageSummary([
    {
      status: SubscriptionStatus.ACTIVE,
      planCode: "us_rn_monthly",
      currentPeriodEnd: new Date("2026-06-01T00:00:00.000Z"),
      trialEnd: null,
      updatedAt: new Date("2026-05-11T00:00:00.000Z"),
      createdAt: new Date("2026-04-20T00:00:00.000Z"),
    },
  ]);
  assert.equal(summary, null);
});
