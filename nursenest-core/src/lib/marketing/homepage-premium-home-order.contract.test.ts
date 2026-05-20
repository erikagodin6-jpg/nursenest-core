/**
 * Contract: premium homepage client section order — ECG / telemetry now leads the
 * readiness narrative directly below the hero, followed by pathways, clinical
 * ecosystems, the adaptive loop, social study, readiness, trust, children, and CTA.
 *
 * PremiumHomepageHero, PremiumClinicalDepth, and PremiumHomepageTrust are now
 * Server Component islands passed as named slots (heroSlot / clinicalDepthSlot /
 * trustSlot) from the parent RSC — they are no longer rendered directly by
 * HomeRestoredClient. Slot variables preserve section ordering.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "path";
import test from "node:test";

const ROOT = process.cwd();

test("HomeRestoredClient section order: hero → product screenshots → ECG → pathways → clinical → study ecosystem → social study → readiness → trust → children → final CTA", () => {
  const src = fs.readFileSync(path.join(ROOT, "src/components/marketing/home-restored-client.tsx"), "utf8");

  // heroSlot replaces <PremiumHomepageHero — hero is now a server island.
  // clinicalDepthSlot / trustSlot preserve ordering for those server islands.
  const markers = [
    "{heroSlot}",
    "<HomeHeroScreenshotSectionLazy",
    "<PremiumHomepageEcg",
    "<PremiumPathwayShowcase",
    "{clinicalDepthSlot}",
    "<PremiumStudyEcosystem",
    "<PremiumSocialStudy",
    "<PremiumReadinessPreview",
    "{trustSlot}",
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
