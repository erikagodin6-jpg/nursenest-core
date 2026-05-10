/**
 * Regression: Rules of Hooks — PremiumHomepageHero must not call React hooks inside try/catch.
 * (Violations cause post-hydration crashes / marketing error boundaries.)
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const HERO_PATH = path.resolve(
  process.cwd(),
  "src/components/marketing/home/premium-homepage-hero.tsx",
);

describe("PremiumHomepageHero hooks contract", () => {
  it("does not wrap hook calls in try/catch in PremiumHomepageHero", () => {
    const src = fs.readFileSync(HERO_PATH, "utf8");

    assert.ok(
      src.includes("Hooks must run unconditionally at top level"),
      "expected guardrail comment explaining hooks placement",
    );

    const badHookAfterTry = /try\s*\{[^}]*\buseMarketingI18n\s*\(/s;
    assert.ok(!badHookAfterTry.test(src), "useMarketingI18n must not appear inside a try block");

    const badRegionAfterTry = /try\s*\{[^}]*\buseNursenestRegion\s*\(/s;
    assert.ok(!badRegionAfterTry.test(src), "useNursenestRegion must not appear inside a try block");
  });
});
