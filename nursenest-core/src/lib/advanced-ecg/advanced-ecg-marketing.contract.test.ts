import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  ADVANCED_ECG_MARKETING_PRIMARY_CTA,
  getAdvancedEcgMarketingPageByPath,
  listAdvancedEcgMarketingPaths,
} from "@/lib/advanced-ecg/advanced-ecg-marketing-pages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import {
  collectAdvancedEcgMarketingUrls,
  collectLocaleMarketingSitemapSafeUrls,
} from "@/lib/seo/sitemap-static-xml";

const root = process.cwd();

test("Advanced ECG marketing cluster publishes the approved public path set", () => {
  assert.deepEqual(listAdvancedEcgMarketingPaths(), [
    "/advanced-ecg",
    "/advanced-ecg/telemetry",
    "/advanced-ecg/12-lead",
    "/advanced-ecg/acls",
    "/advanced-ecg/case-studies",
    "/advanced-ecg/pacemaker-rhythms",
  ]);
});

test("Advanced ECG marketing alternates and sitemap include localized phase-1 routes", () => {
  const alternates = marketingAlternatesSharedPage("fr", "/advanced-ecg/pacemaker-rhythms");
  assert.match(alternates.canonical, /\/fr\/advanced-ecg\/pacemaker-rhythms$/);
  assert.match(alternates.languages["x-default"] ?? "", /\/advanced-ecg\/pacemaker-rhythms$/);
  assert.equal(Object.keys(alternates.languages).includes("x-default"), true);

  const defaultUrls = collectAdvancedEcgMarketingUrls("https://example.test");
  const localizedUrls = collectLocaleMarketingSitemapSafeUrls("https://example.test", "fr").filter((url) =>
    url.includes("/advanced-ecg"),
  );
  assert.equal(defaultUrls.length, 6);
  assert.equal(localizedUrls.length, 6);
});

test("Advanced ECG marketing routes are served from both default and localized marketing shells", () => {
  const defaultRoute = path.join(root, "src/app/(marketing)/(default)/advanced-ecg/[[...slug]]/page.tsx");
  const localizedRoute = path.join(root, "src/app/(marketing)/[locale]/advanced-ecg/[[...slug]]/page.tsx");

  assert.equal(fs.existsSync(defaultRoute), true);
  assert.equal(fs.existsSync(localizedRoute), true);
  assert.match(fs.readFileSync(defaultRoute, "utf8"), /AdvancedEcgMarketingPageView/);
  assert.match(fs.readFileSync(localizedRoute, "utf8"), /marketingAlternatesSharedPage/);
});

test("Advanced ECG public marketing routes remain indexable", () => {
  const defaultRoute = fs.readFileSync(path.join(root, "src/app/(marketing)/(default)/advanced-ecg/[[...slug]]/page.tsx"), "utf8");
  const localizedRoute = fs.readFileSync(path.join(root, "src/app/(marketing)/[locale]/advanced-ecg/[[...slug]]/page.tsx"), "utf8");

  assert.match(defaultRoute, /safeGenerateMetadata/);
  assert.match(localizedRoute, /safeGenerateMetadata/);
  assert.match(defaultRoute, /if \(!page\)\s*\{\s*return\s*\{[\s\S]*robots: \{ index: false, follow: true \}/);
  assert.match(localizedRoute, /if \(!page\)\s*\{\s*return\s*\{[\s\S]*robots: \{ index: false, follow: true \}/);
  assert.doesNotMatch(defaultRoute, /return\s+\{[\s\S]*title: page\.title[\s\S]*robots:/);
  assert.doesNotMatch(localizedRoute, /return\s+\{[\s\S]*title: page\.title[\s\S]*robots:/);
});

test("Advanced ECG launch page keeps the direct buy anchor and shared purchase section", () => {
  assert.equal(ADVANCED_ECG_MARKETING_PRIMARY_CTA.href, "#buy");

  const pageView = fs.readFileSync(
    path.join(root, "src/components/marketing/advanced-ecg-marketing-page.tsx"),
    "utf8",
  );

  assert.match(pageView, /AdvancedEcgLaunchPurchaseSection/);
  assert.match(pageView, /Who this is for/);
  assert.match(pageView, /Who it is not for/);
  assert.match(pageView, /Learner access proof/);
});

test("pacemaker marketing page targets paced-rhythm and ICU telemetry SEO terms", () => {
  const page = getAdvancedEcgMarketingPageByPath("/advanced-ecg/pacemaker-rhythms");
  assert.ok(page);
  const joined = [
    page?.title,
    page?.description,
    page?.heroLead,
    ...(page?.curriculumItems ?? []),
    ...(page?.stripPreviewItems ?? []),
  ]
    .join(" ")
    .toLowerCase();

  assert.match(joined, /paced rhythm recognition/);
  assert.match(joined, /pacemaker malfunction ecg/);
  assert.match(joined, /ventricular paced rhythm/);
  assert.match(joined, /icu telemetry pacing/);
});
