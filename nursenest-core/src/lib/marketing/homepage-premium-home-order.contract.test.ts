/**
 * Contract: premium homepage client section order — ECG stays between Study Ecosystem and Readiness,
 * after hero and pathway/clinical blocks (ecosystem narrative).
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "path";
import test from "node:test";

const ROOT = process.cwd();

test("HomeRestoredClient section order: hero → product screenshots → pathways → clinical → study ecosystem → ECG → readiness → trust → children → final CTA", () => {
  const src = fs.readFileSync(path.join(ROOT, "src/components/marketing/home-restored-client.tsx"), "utf8");

  const markers = [
    "<PremiumHomepageHero",
    "<HomeHeroScreenshotSectionLazy",
    "<PremiumPathwayShowcase",
    "<PremiumClinicalDepth",
    "<PremiumStudyEcosystem",
    "<PremiumHomepageEcg",
    "<PremiumReadinessPreview",
    "<PremiumHomepageTrust",
    "{children}",
    "<PremiumHomepageCta",
  ] as const;

  let last = -1;
  for (const m of markers) {
    const i = src.indexOf(m);
    assert.ok(i >= 0, `missing ${m}`);
    assert.ok(i > last, `expected ${m} after previous section`);
    last = i;
  }
});
