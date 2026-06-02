import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const appRoot = process.cwd();

test("mobile purchase APIs are protected learner routes with server-side verification", () => {
  const routes = [
    "src/app/api/mobile/purchases/status/route.ts",
    "src/app/api/mobile/purchases/verify/route.ts",
    "src/app/api/mobile/purchases/restore/route.ts",
  ];

  for (const rel of routes) {
    const abs = join(appRoot, rel);
    assert.ok(existsSync(abs), `missing ${rel}`);
    const src = readFileSync(abs, "utf8");
    assert.match(src, /auth\(\)/, `${rel} must require authenticated session`);
    assert.doesNotMatch(src, /clientClaimsPremium.*hasPremium|hasPremium.*clientClaimsPremium/s, `${rel} must not trust client premium claims`);
  }

  assert.match(readFileSync(join(appRoot, "src/app/api/mobile/purchases/verify/route.ts"), "utf8"), /verifyStorePurchase/);
  assert.match(readFileSync(join(appRoot, "src/app/api/mobile/purchases/restore/route.ts"), "utf8"), /restoreVerifiedStorePurchases/);
});

test("store notification endpoints exist for Apple, Google, and Samsung", () => {
  for (const provider of ["apple", "google", "samsung"]) {
    const rel = `src/app/api/mobile/store-notifications/${provider}/route.ts`;
    const abs = join(appRoot, rel);
    assert.ok(existsSync(abs), `missing ${rel}`);
    const src = readFileSync(abs, "utf8");
    assert.match(src, /runtime = "nodejs"/);
    assert.match(src, /recordStoreNotification/);
  }
});

test("mobile entitlement policy allows native stores only through verified server ownership", () => {
  const src = readFileSync(join(appRoot, "src/lib/platform/phase14/mobile-entitlement-safety.ts"), "utf8");
  assert.match(src, /allowsNativeStoreBilling: true/);
  assert.match(src, /requiresServerVerifiedStorePurchaseOwnership: true/);
  assert.doesNotMatch(src, /ExternalSubscriptionOwnership = never/);
});
