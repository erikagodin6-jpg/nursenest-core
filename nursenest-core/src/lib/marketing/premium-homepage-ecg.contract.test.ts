/**
 * Contract: homepage ECG marketing section stays ordered after Study Ecosystem,
 * uses public hub CTAs only, and emits consistent PostHog surface metadata.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "path";
import test from "node:test";

const ROOT = process.cwd();

test("PremiumHomepageEcg renders after PremiumStudyEcosystem and before PremiumReadinessPreview", () => {
  const src = fs.readFileSync(path.join(ROOT, "src/components/marketing/home-restored-client.tsx"), "utf8");
  const iStudy = src.indexOf("<PremiumStudyEcosystem");
  const iEcg = src.indexOf("<PremiumHomepageEcg");
  const iReady = src.indexOf("<PremiumReadinessPreview");
  assert.ok(iStudy >= 0 && iEcg >= 0 && iReady >= 0, "expected imports/render order");
  assert.ok(iStudy < iEcg && iEcg < iReady, "ECG section must sit between Study Ecosystem and Readiness Preview");
});

test("PremiumHomepageEcg core CTAs use lessons + questionBank hrefs only (no hidden ECG module route)", () => {
  const src = fs.readFileSync(path.join(ROOT, "src/components/marketing/home/premium-homepage-ecg.tsx"), "utf8");
  const hiddenEcgModuleRoute = new RegExp(`/modules/${"ecg"}`.replaceAll("/", "\\/"));
  assert.match(src, /href=\{hrefs\.lessons\}/);
  assert.match(src, /href=\{hrefs\.questionBank\}/);
  assert.doesNotMatch(src, hiddenEcgModuleRoute);
});

test("PremiumHomepageEcg advanced teaser links pricing + PostHog surface", () => {
  const src = fs.readFileSync(path.join(ROOT, "src/components/marketing/home/premium-homepage-ecg.tsx"), "utf8");
  assert.match(src, /href=\{hrefs\.pricing\}/);
  assert.match(src, /surface:\s*"premium_home_ecg"/);
  assert.match(src, /lane:\s*"core"/);
  assert.match(src, /lane:\s*"advanced_teaser"/);
});

test("Advanced disclaimer states not included in standard subscriptions", () => {
  const src = fs.readFileSync(path.join(ROOT, "src/components/marketing/home/premium-homepage-ecg.tsx"), "utf8");
  assert.match(src, /not included with standard RN\/PN\/NP\/allied subscriptions/i);
});
