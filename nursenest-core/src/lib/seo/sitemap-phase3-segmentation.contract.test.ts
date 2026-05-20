import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import {
  collectClinicalMarketingToolTeaserUrls,
  collectClinicalModulesSitemapUrls,
} from "@/lib/seo/clinical-modules-sitemap-urls";
import { filterPublicSitemapEntries } from "@/lib/seo/sitemap-public-index-filter";
import { isValidPublicUrl } from "@/lib/seo/public-url-validator";
import { normalizeOrigin, type SitemapUrlEntry } from "@/lib/seo/sitemap-static-xml";

test("collectClinicalModulesSitemapUrls emits only valid public URLs (no /app, /admin, /api, query, hash)", () => {
  const origin = normalizeOrigin(CANONICAL_PRODUCTION_ORIGIN);
  const urls = collectClinicalModulesSitemapUrls(origin);
  assert.ok(urls.length > 0);
  for (const u of urls) {
    assert.ok(!u.includes("/app/"), u);
    assert.ok(!u.includes("/admin"), u);
    assert.ok(!u.includes("/api"), u);
    assert.ok(!u.includes("?"), u);
    assert.ok(!u.includes("#"), u);
    const v = isValidPublicUrl(u, { origin });
    assert.equal(v.ok, true, !v.ok ? v.code : "");
  }
});

test("clinical marketing tool teasers exclude gated learner and /modules shells by construction", () => {
  const origin = normalizeOrigin(CANONICAL_PRODUCTION_ORIGIN);
  const urls = collectClinicalMarketingToolTeaserUrls(origin);
  assert.ok(urls.every((u) => u.includes("/tools/")));
  assert.ok(urls.every((u) => !u.includes("/modules/")));
  assert.ok(urls.every((u) => !u.includes("/app")));
});

test("clinical-modules route wires collector + public filter", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const routeSrc = readFileSync(join(here, "..", "..", "app", "sitemap-clinical-modules.xml", "route.ts"), "utf8");
  assert.match(routeSrc, /collectClinicalModulesSitemapUrls/);
  assert.match(routeSrc, /filterPublicSitemapEntries/);
});

test("OSCE/clinical-scenario hubs are flag-gated at collection source", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const scenarioSrc = readFileSync(join(here, "..", "scenarios", "scenario-marketing-sitemap-urls.ts"), "utf8");
  assert.match(scenarioSrc, /isOsceScenariosPubliclyEnabled/);
  assert.match(scenarioSrc, /isClinicalScenariosPubliclyEnabled/);
});

test("collectCoreUrls implementation does not merge OSCE hubs (owned by clinical-modules segment)", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const staticSrc = readFileSync(join(here, "sitemap-static-xml.ts"), "utf8");
  assert.ok(!staticSrc.includes("collectOsceScenariosMarketingHubUrls"), "OSCE URLs must not be merged in core collector");
});

test("pathways + lessons segments do not own clinical-modules collector", () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const appRoot = join(here, "..", "..");
  const pathways = readFileSync(join(appRoot, "app", "sitemap-pathways.xml", "route.ts"), "utf8");
  const lessons = readFileSync(join(appRoot, "app", "sitemap-lessons.xml", "route.ts"), "utf8");
  assert.ok(!pathways.includes("collectClinicalModulesSitemapUrls"));
  assert.ok(!lessons.includes("collectClinicalModulesSitemapUrls"));
});

test("filtered clinical entries remain valid public URLs", () => {
  const origin = normalizeOrigin(CANONICAL_PRODUCTION_ORIGIN);
  const raw = collectClinicalModulesSitemapUrls(origin);
  const entries: SitemapUrlEntry[] = raw.map((loc) => ({ loc }));
  const filtered = filterPublicSitemapEntries(entries, origin);
  assert.ok(filtered.length > 0);
  for (const e of filtered) {
    const v = isValidPublicUrl(e.loc, { origin });
    assert.equal(v.ok, true);
  }
});
