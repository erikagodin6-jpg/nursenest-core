/**
 * Prebuild uses an import-free snapshot in `production-chrome-i18n-keys.ts`.
 * This test ensures it cannot drift from `MARKETING_HERO_NAV_CRITICAL_KEYS` without CI failing.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MARKETING_HERO_NAV_CRITICAL_KEYS } from "@/lib/marketing/marketing-hero-nav-critical-keys";
import { MARKETING_HERO_NAV_CRITICAL_KEYS_SNAPSHOT } from "@/lib/i18n/production-chrome-i18n-keys.ts";

describe("production-chrome hero/nav snapshot parity", () => {
  it("MARKETING_HERO_NAV_CRITICAL_KEYS_SNAPSHOT matches canonical list (order-sensitive)", () => {
    assert.deepEqual(
      [...MARKETING_HERO_NAV_CRITICAL_KEYS_SNAPSHOT],
      [...MARKETING_HERO_NAV_CRITICAL_KEYS],
      "Update MARKETING_HERO_NAV_CRITICAL_KEYS_SNAPSHOT in production-chrome-i18n-keys.ts to match marketing-hero-nav-critical-keys.ts",
    );
  });
});
