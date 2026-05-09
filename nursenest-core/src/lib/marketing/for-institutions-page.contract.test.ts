/**
 * Institutional marketing page contract — CDN screenshots, internal CTAs, no placeholder leakage.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  SCREENSHOT_CDN_BASE,
  SCREENSHOT_GROUPS,
  SCREENSHOT_REGISTRY,
} from "@/lib/marketing/screenshot-registry";
import { getInstitutionalMarketingScreenshotSlots } from "@/lib/marketing/get-screenshots";

const APPROVED_CDN_HOST = "nursenest-images.tor1.cdn.digitaloceanspaces.com";

const SRC_PAGE = path.resolve(
  process.cwd(),
  "src/components/marketing/marketing-for-institutions-premium-client.tsx",
);

const PLACEHOLDER_RE =
  /\b(lorem|placeholder|todo\b|tbd\b|\{\{|\}\}|pages\.forInstitutions\.[a-z0-9_.]+\s*\|\||screenshot\.png\/\/)/i;

test("institutional showcase groups resolve only approved CDN screenshot URLs", () => {
  const slots = getInstitutionalMarketingScreenshotSlots();
  for (const [_name, records] of Object.entries(slots)) {
    for (const r of records) {
      assert.ok(r.publicUrl.startsWith(`${SCREENSHOT_CDN_BASE}/`), `bad base: ${r.publicUrl}`);
      assert.ok(r.publicUrl.includes(APPROVED_CDN_HOST), `expected DO CDN host in ${r.publicUrl}`);
      assert.match(r.objectKey, /^screenshot\d+\.png$/i);
    }
  }
});

test("institutional registry groups reference valid screenshot ids", () => {
  const valid = new Set(SCREENSHOT_REGISTRY.map((s) => s.id));
  for (const name of [
    "institutionalHeroMontage",
    "institutionalWhyFeatures",
    "institutionalWorkflow",
    "institutionalPlatformBlocks",
    "institutionalEducator",
    "institutionalShowcase",
  ] as const) {
    const ids = SCREENSHOT_GROUPS[name];
    for (const id of ids) {
      assert.ok(valid.has(id), `${name} references missing id ${id}`);
    }
  }
});

test("institutional premium client uses internal explore CTA href composition only", () => {
  const raw = fs.readFileSync(SRC_PAGE, "utf8");
  assert.ok(
    raw.includes("defaultNursingExamMarketingHub") && raw.includes("withMarketingLocale"),
    "expected region-aware hub link builder",
  );
  assert.ok(!raw.includes("unsplash"), "no stock photo hosts");
  assert.ok(!raw.includes("placehold"), "no placeholder image hosts");
});

test("institutional premium client source avoids placeholder-style patterns", () => {
  const raw = fs.readFileSync(SRC_PAGE, "utf8");
  assert.ok(!PLACEHOLDER_RE.test(raw), "premium client must not contain placeholder-style patterns");
});

test("hero montage screenshot tiles expose alt via registry (MarketingChainScreenshot)", () => {
  const hero = getInstitutionalMarketingScreenshotSlots().heroMontage;
  assert.ok(hero.length >= 5, "hero montage should include multiple proof surfaces");
  for (const r of hero) {
    assert.ok((r.alt ?? r.label).trim().length > 8, `id ${r.id}: alt/label too thin`);
  }
});
