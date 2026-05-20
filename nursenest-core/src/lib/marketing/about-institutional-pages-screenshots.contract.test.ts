/**
 * Contract: About + For Institutions marketing pages use registry-driven CDN screenshots only
 * (aligned with SCREENSHOT_CDN_BASE / HOME_HERO_CDN_BASE_URL).
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { HOME_HERO_CDN_BASE_URL } from "@/config/home-hero-carousel";
import { getScreenshotIdsForPage } from "@/lib/marketing/get-screenshots";
import { SCREENSHOT_CDN_BASE, SCREENSHOT_GROUPS } from "@/lib/marketing/screenshot-registry";

const ROOT = process.cwd();

function read(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

test("CDN base constants stay aligned (registry vs home hero)", () => {
  assert.equal(SCREENSHOT_CDN_BASE, HOME_HERO_CDN_BASE_URL);
});

test("aboutShowcase / institutionalShowcase match getScreenshotsForPage curated maps", () => {
  assert.deepEqual([...SCREENSHOT_GROUPS.aboutShowcase], [...getScreenshotIdsForPage("about")]);
  assert.deepEqual([...SCREENSHOT_GROUPS.institutionalShowcase], [...getScreenshotIdsForPage("for-institutions")]);
});

test("About page client uses aboutShowcase carousel group (not ad hoc CDN URLs)", () => {
  const src = read("src/components/marketing/about-page-client.tsx");
  assert.match(src, /group="aboutShowcase"/);
  assert.doesNotMatch(src, /https:\/\/nursenest-images\.tor1\.cdn\.digitaloceanspaces\.com/);
  assert.match(src, /href="\/signup"/);
  assert.match(src, /href="\/pricing"/);
});

test("For Institutions client uses registry helpers + institutionalShowcase carousel (no hardcoded CDN URLs)", () => {
  const src = read("src/components/marketing/marketing-for-institutions-premium-client.tsx");
  assert.match(src, /getInstitutionalMarketingScreenshotSlots/);
  assert.match(src, /group="institutionalShowcase"/);
  assert.match(src, /SCREENSHOT_GROUPS\.institutionalWhyFeatures/);
  assert.doesNotMatch(src, /https:\/\/nursenest-images\.tor1\.cdn\.digitaloceanspaces\.com/);
  assert.match(src, /scrollToId\("contact-form"\)/);
  assert.match(src, /pricingHref=\{pricingHref\}/);
});

test("About + institutional marketing sources avoid forbidden placeholder tokens", () => {
  // Mustache / copy placeholders — do not match JSX `style={{ ... }}` (uses `{{` / `}}` delimiters).
  const banned = /\blorem\b|\bTODO\b|\{\{\s*[a-zA-Z][a-zA-Z0-9_.-]*\s*\}\}/i;
  for (const rel of [
    "src/components/marketing/about-page-client.tsx",
    "src/components/marketing/marketing-for-institutions-premium-client.tsx",
  ]) {
    const src = read(rel);
    assert.ok(!banned.test(src), `${rel} must not match placeholder pattern`);
  }
});
