/**
 * Screenshot governance contract tests.
 *
 * These run as part of `npm run test:marketing` and `npm run test:homepage`.
 * They do NOT require a running server — they validate registry integrity,
 * governance rules, and the presence of local fallback files.
 *
 * For CDN accessibility checks, use:
 *   npx tsx scripts/validate-marketing-screenshots.ts --cdn-check
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  validateScreenshotRegistry,
  REQUIRED_GENERATED_PATHS,
  GOVERNED_MARKETING_ROUTES,
  PAGE_SCREENSHOT_MINIMUMS,
  CRITICAL_CDN_SLOTS,
  CDN_SLOT_CAPTURE_ROUTES,
  CDN_SLOT_CAPTURE_STATES,
  REQUIRED_THEME_COVERAGE,
  isScreenshotFresh,
  screenshotAgeLabel,
  SCREENSHOT_STALENESS_THRESHOLD_DAYS,
} from "@/lib/marketing/screenshot-governance";
import {
  SCREENSHOT_REGISTRY,
  SCREENSHOT_GROUPS,
  getScreenshotsByIds,
} from "@/lib/marketing/screenshot-registry";

const APP_ROOT = path.resolve(process.cwd());
const PUBLIC_DIR = path.join(APP_ROOT, "public");

// ─── Registry integrity ───────────────────────────────────────────────────────

test("screenshot registry passes all governance rules", () => {
  const violations = validateScreenshotRegistry();
  const criticals = violations.filter((v) => v.severity === "critical");

  assert.equal(
    criticals.length,
    0,
    `CRITICAL governance violations:\n${criticals.map((v) => `  [${v.ruleId}] ${v.message}`).join("\n")}`,
  );
});

test("screenshot registry warnings are known and documented", () => {
  const violations = validateScreenshotRegistry();
  const warnings = violations.filter((v) => v.severity === "warning");
  // Allow up to 3 warnings (minor copy issues) but fail on more
  assert.ok(
    warnings.length <= 3,
    `Too many governance warnings (${warnings.length}/3 allowed):\n` +
      warnings.map((v) => `  [${v.ruleId}] ${v.message}`).join("\n"),
  );
});

test("all 15 CDN slots are registered", () => {
  for (let i = 1; i <= 15; i++) {
    const record = SCREENSHOT_REGISTRY.find((r) => r.id === i);
    assert.ok(record, `Screenshot slot ${i} is not in SCREENSHOT_REGISTRY`);
    assert.match(
      record.objectKey,
      /^screenshot\d+\.png$/,
      `Slot ${i} objectKey must match screenshot{N}.png format`,
    );
    assert.match(
      record.publicUrl,
      /^https:\/\/nursenest-images/,
      `Slot ${i} must reference the DigitalOcean Spaces CDN`,
    );
  }
});

test("all governed marketing routes have required screenshot coverage", () => {
  for (const govRoute of GOVERNED_MARKETING_ROUTES) {
    const records = getScreenshotsByIds([...govRoute.requiredSlots]);
    assert.ok(
      records.length > 0,
      `${govRoute.label} (${govRoute.route}) has no screenshots in registry`,
    );
    assert.equal(
      records.length,
      govRoute.requiredSlots.length,
      `${govRoute.label} is missing registry entries for some required slots`,
    );
  }
});

test("homepage hero carousel contains all 15 screenshots", () => {
  const heroIds = new Set(SCREENSHOT_GROUPS.homepageHero);
  assert.equal(heroIds.size, 15, "Homepage hero must reference all 15 screenshot slots");

  for (let i = 1; i <= 15; i++) {
    assert.ok(
      heroIds.has(i as Parameters<typeof heroIds.has>[0]),
      `Screenshot slot ${i} is missing from the homepage hero carousel`,
    );
  }
});

test("pricing preview group has at least one practice and one CAT screenshot", () => {
  const pricingRecords = getScreenshotsByIds([...SCREENSHOT_GROUPS.pricingPreview]);
  const hasPractice = pricingRecords.some(
    (r) => r.feature === "question-bank" || r.feature === "rationale",
  );
  const hasCat = pricingRecords.some(
    (r) => r.feature === "cat-exam" || r.feature === "cat-results",
  );
  assert.ok(hasPractice, "Pricing preview must include a practice/question screenshot");
  assert.ok(hasCat, "Pricing preview must include a CAT screenshot");
});

test("page minimum screenshot counts are met by registry", () => {
  for (const [page, minCount] of Object.entries(PAGE_SCREENSHOT_MINIMUMS)) {
    const groupKey =
      page === "home" ? "homepageHero"
      : page === "pricing" ? "pricingPreview"
      : page === "faq" ? "faqAbout"
      : page === "about" ? "aboutShowcase"
      : page === "for-institutions" ? "institutionalShowcase"
      : null;

    if (!groupKey) continue;
    const group = SCREENSHOT_GROUPS[groupKey as keyof typeof SCREENSHOT_GROUPS];
    const records = getScreenshotsByIds([...group]);
    assert.ok(
      records.length >= minCount,
      `Page "${page}" has ${records.length} screenshots, minimum is ${minCount}`,
    );
  }
});

// ─── CDN slot capture routes ──────────────────────────────────────────────────

test("all CDN slot capture routes are defined", () => {
  for (let i = 1; i <= 15; i++) {
    const route = CDN_SLOT_CAPTURE_ROUTES[i as keyof typeof CDN_SLOT_CAPTURE_ROUTES];
    assert.ok(route, `CDN slot ${i} has no capture route defined`);
    assert.match(route, /^\//, `Slot ${i} capture route must start with /`);
  }
});

test("critical CDN slots all have capture routes", () => {
  for (const id of CRITICAL_CDN_SLOTS) {
    const route = CDN_SLOT_CAPTURE_ROUTES[id];
    assert.ok(route, `Critical slot ${id} has no capture route`);
  }
});

test("CDN capture routes prioritize deep educational states over navigation surfaces", () => {
  const forbiddenRoutePatterns = [/^\/$/, /\/app$/, /\/app\/questions$/, /\/app\/questions\/bank$/, /\/modules\/ecg\/basic\/lessons$/];
  for (const [id, route] of Object.entries(CDN_SLOT_CAPTURE_ROUTES)) {
    for (const pattern of forbiddenRoutePatterns) {
      assert.doesNotMatch(route, pattern, `Slot ${id} must not capture a shallow navigation surface`);
    }
    assert.ok(CDN_SLOT_CAPTURE_STATES[Number(id) as keyof typeof CDN_SLOT_CAPTURE_STATES], `Slot ${id} is missing a capture state`);
  }
  assert.equal(CDN_SLOT_CAPTURE_STATES[1], "learning-activity");
  assert.equal(CDN_SLOT_CAPTURE_STATES[4], "learning-activity");
  assert.equal(CDN_SLOT_CAPTURE_STATES[14], "learning-activity");
  assert.equal(CDN_SLOT_CAPTURE_STATES[15], "learning-activity");
});

// ─── Local fallback image existence ──────────────────────────────────────────

test("generated product fallback WebPs exist on disk", () => {
  const fallbackPaths = [
    "marketing/generated-screenshots/core/learner-dashboard.webp",
    "marketing/generated-screenshots/core/confidence-analytics.webp",
    "marketing/generated-screenshots/core/smart-review.webp",
    "marketing/generated-screenshots/core/cat-exam-session.webp",
    "marketing/generated-screenshots/core/flashcards.webp",
    "marketing/generated-screenshots/core/cat-results.webp",
  ];

  for (const relPath of fallbackPaths) {
    const absPath = path.join(PUBLIC_DIR, relPath);
    assert.ok(
      fs.existsSync(absPath),
      `Generated product fallback missing: ${relPath}\n` +
        "This is used as a fallback by tier-value-experience.ts stages and must exist on disk.",
    );
  }
});

// ─── Freshness utilities ──────────────────────────────────────────────────────

test("isScreenshotFresh returns true for recent dates", () => {
  const yesterday = new Date(Date.now() - 86_400_000).toISOString();
  assert.ok(isScreenshotFresh(yesterday));
});

test("isScreenshotFresh returns false for stale dates", () => {
  const staleDate = new Date(
    Date.now() - (SCREENSHOT_STALENESS_THRESHOLD_DAYS + 5) * 86_400_000,
  ).toISOString();
  assert.ok(!isScreenshotFresh(staleDate));
});

test("screenshotAgeLabel returns human-readable age", () => {
  const yesterday = new Date(Date.now() - 86_400_000).toISOString();
  assert.equal(screenshotAgeLabel(yesterday), "1 day ago");

  const today = new Date().toISOString();
  assert.equal(screenshotAgeLabel(today), "today");
});

// ─── Generated screenshot manifest (when present) ────────────────────────────

test("manifest.json is parseable and contains required fields when present", () => {
  const manifestPath = path.join(
    PUBLIC_DIR,
    "marketing",
    "generated-screenshots",
    "manifest.json",
  );

  if (!fs.existsSync(manifestPath)) {
    // Not generated yet — skip
    return;
  }

  const raw = fs.readFileSync(manifestPath, "utf8");
  const manifest = JSON.parse(raw) as Record<string, unknown>;

  assert.ok(manifest.generatedAt, "manifest.generatedAt must be set");
  assert.ok(
    Array.isArray(manifest.captures),
    "manifest.captures must be an array",
  );
  assert.ok(
    typeof manifest.totalCaptured === "number",
    "manifest.totalCaptured must be a number",
  );

  // Verify freshness
  const genDate = manifest.generatedAt as string;
  const daysOld = (Date.now() - new Date(genDate).getTime()) / (1000 * 60 * 60 * 24);
  assert.ok(
    daysOld <= 90,
    `manifest.json is ${Math.round(daysOld)} days old — regenerate before next release`,
  );
});

// ─── Theme coverage ───────────────────────────────────────────────────────────

test("required theme coverage definitions are complete", () => {
  const requiredThemes: string[] = ["ocean", "midnight", "blossom", "aurora", "sage-garden"];
  for (const theme of requiredThemes) {
    const coverage = REQUIRED_THEME_COVERAGE[theme as keyof typeof REQUIRED_THEME_COVERAGE];
    assert.ok(
      Array.isArray(coverage) && coverage.length > 0,
      `Theme ${theme} has no required coverage paths defined`,
    );
  }
});
