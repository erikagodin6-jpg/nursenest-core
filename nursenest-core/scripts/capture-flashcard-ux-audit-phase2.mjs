#!/usr/bin/env node
/**
 * Flashcards UX Audit — Phase 2 screenshot matrix (Playwright).
 *
 * Uses audit preview route with clinical bank-style stems (audit=1 hides QA banner).
 * Optional auth captures for weak-area + custom-study when demo user is seeded.
 *
 * Output: docs/screenshots/flashcards-ux-audit-phase2/{desktop,tablet,mobile}/*.png
 *         docs/screenshots/flashcards-ux-audit-phase2/measurements.json
 *
 * Prerequisites:
 *   npx playwright install chromium
 *   npm run dev:next:3000  (or SCREENSHOT_BASE_URL)
 *
 * Usage:
 *   node scripts/capture-flashcard-ux-audit-phase2.mjs
 *   SCREENSHOT_ONLY_SCENARIO=mcq-unanswered node scripts/capture-flashcard-ux-audit-phase2.mjs
 *   SCREENSHOT_SKIP_AUTH=1 node scripts/capture-flashcard-ux-audit-phase2.mjs
 */
import { chromium } from "@playwright/test";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const APP_ROOT = join(__dirname, "..");

const BASE_URL = (process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const OUT_ROOT =
  process.env.SCREENSHOT_OUTPUT_DIR ??
  join(REPO_ROOT, "docs", "screenshots", "flashcards-ux-audit-phase2");

const THEMES = (process.env.SCREENSHOT_THEMES ?? "ocean,blossom,midnight")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);

const EXTRA_WAIT_MS = Number(process.env.SCREENSHOT_WAIT_MS ?? "1600");
const SKIP_AUTH = process.env.SCREENSHOT_SKIP_AUTH === "1";
const DEMO_EMAIL = process.env.SCREENSHOT_DEMO_EMAIL ?? "demo-screenshots@internal.nursenest.io";
const DEMO_PASSWORD = process.env.SCREENSHOT_DEMO_PASSWORD ?? "DemoScreenshot2024!";
const THEME_STORAGE_KEY = "nursenest-theme";

const SCENARIOS = [
  { id: "mcq-unanswered", label: "mcq-unanswered" },
  { id: "mcq-answered", label: "mcq-answered" },
  { id: "mcq-long-rationale", label: "mcq-long-rationale" },
  { id: "mcq-short-rationale", label: "mcq-short-rationale" },
  { id: "sata-unanswered", label: "sata-unanswered" },
  { id: "sata-answered", label: "sata-answered" },
];

const ONLY_SCENARIO = process.env.SCREENSHOT_ONLY_SCENARIO?.trim() || null;

const DESKTOP_VIEWPORTS = [
  { id: "1366x768", width: 1366, height: 768, bucket: "desktop" },
  { id: "1440x900", width: 1440, height: 900, bucket: "desktop" },
  { id: "1512x982", width: 1512, height: 982, bucket: "desktop" },
  { id: "1728x1117", width: 1728, height: 1117, bucket: "desktop" },
  { id: "1920x1080", width: 1920, height: 1080, bucket: "desktop" },
];

const TABLET_VIEWPORTS = [
  { id: "ipad-portrait", width: 768, height: 1024, bucket: "tablet" },
  { id: "ipad-landscape", width: 1024, height: 768, bucket: "tablet" },
];

const MOBILE_VIEWPORTS = [
  { id: "390x844", width: 390, height: 844, bucket: "mobile" },
  { id: "393x852", width: 393, height: 852, bucket: "mobile" },
  { id: "430x932", width: 430, height: 932, bucket: "mobile" },
];

const ALL_VIEWPORTS = [...DESKTOP_VIEWPORTS, ...TABLET_VIEWPORTS, ...MOBILE_VIEWPORTS];

/** Representative subset for whitespace measurements (full matrix still captured). */
const MEASURE_VIEWPORTS = [
  { id: "1440x900", width: 1440, height: 900 },
  { id: "390x844", width: 390, height: 844 },
];

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function slug(s) {
  return s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

async function applyTheme(page, themeId) {
  await page.evaluate(
    ({ key, id }) => {
      try {
        localStorage.setItem(key, id);
      } catch {
        /* ignore */
      }
      document.documentElement.setAttribute("data-theme", id);
    },
    { key: THEME_STORAGE_KEY, id: themeId },
  );
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(EXTRA_WAIT_MS);
}

function previewRoute(theme, scenario) {
  const qs = new URLSearchParams({ theme, audit: "1", scenario });
  return `/preview/flashcard-session-live?${qs}`;
}

async function waitForFlashcardShell(page) {
  await page
    .locator("[data-nn-flashcard-layout-refinement]")
    .first()
    .waitFor({ state: "attached", timeout: 90_000 })
    .catch(() => {});
  await page
    .locator(".nn-flashcard-learning-topbar")
    .first()
    .waitFor({ state: "visible", timeout: 90_000 })
    .catch(() => {});
}

async function ensureRevealedState(page, scenarioId) {
  const needsReveal =
    scenarioId.includes("answered") || scenarioId.includes("rationale");
  if (!needsReveal) return;

  const already = await page
    .locator('[data-nn-rationale-state="revealed"]')
    .first()
    .isVisible()
    .catch(() => false);
  if (already) return;

  if (scenarioId.startsWith("sata")) {
    const options = page.locator("[data-nn-premium-flashcard-sata] button, [data-nn-sata-option] button");
    const count = await options.count().catch(() => 0);
    for (let i = 0; i < Math.min(count, 3); i++) {
      const opt = options.nth(i);
      if (await opt.isVisible().catch(() => false)) await opt.click();
    }
  } else {
    const options = page.locator("[data-nn-premium-flashcard-mcq] ul button");
    const count = await options.count().catch(() => 0);
    for (let i = 0; i < count; i++) {
      const opt = options.nth(i);
      if (!(await opt.isVisible().catch(() => false))) continue;
      await opt.click();
      const submit = page.locator(".nn-flashcard-submit-answer").first();
      if (await submit.isEnabled({ timeout: 2_000 }).catch(() => false)) {
        await submit.click();
        break;
      }
    }
  }

  await page
    .locator('[data-nn-rationale-state="revealed"]')
    .first()
    .waitFor({ state: "visible", timeout: 30_000 })
    .catch(() => {});
  await settle(page);
}

async function measureLayout(page) {
  return page.evaluate(() => {
    const rect = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        top: Math.round(r.top),
        left: Math.round(r.left),
        width: Math.round(r.width),
        height: Math.round(r.height),
        bottom: Math.round(r.bottom),
        right: Math.round(r.right),
      };
    };

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const topbar = rect(".nn-flashcard-learning-topbar");
    const heading = rect(".nn-flashcard-study-heading");
    const hero = rect(".nn-flashcard-hero-surface");
    const rationale = rect(".nn-flashcard-rationale-panel");
    const coach = rect(".nn-flashcard-coach-panel");
    const sm2 = rect(".nn-flashcard-rating-dock");
    const grid = rect(".nn-flashcard-learning-grid");

    const canvas = rect(".nn-flashcard-study-canvas");
    const session = rect("[data-nn-flashcard-layout-refinement]");

    const sideWhitespace =
      canvas && session
        ? {
            left: Math.max(0, session.left - canvas.left),
            right: Math.max(0, canvas.right - session.right),
          }
        : null;

    return {
      viewport: { width: vw, height: vh },
      topWhitespace: topbar ? topbar.top : null,
      bottomWhitespace: sm2 ? vh - sm2.bottom : coach ? vh - coach.bottom : null,
      sideWhitespace,
      topbarHeight: topbar?.height ?? null,
      headingHeight: heading?.height ?? null,
      gridHeight: grid?.height ?? null,
      heroHeight: hero?.height ?? null,
      rationaleHeight: rationale?.height ?? null,
      coachHeight: coach?.height ?? null,
      sm2Height: sm2?.height ?? null,
      aboveFoldHeroBottom: hero && hero.bottom <= vh ? hero.bottom : null,
      scrollHeight: document.documentElement.scrollHeight,
      hasHorizontalScroll: document.documentElement.scrollWidth > vw + 1,
    };
  });
}

async function measureTouchTargets(page) {
  return page.evaluate(() => {
    const MIN = 44;
    const selectors = [
      ".nn-flashcard-rating-dock button",
      ".nn-flashcard-confidence-scale button",
      ".nn-flashcard-submit-answer",
      "[data-nn-premium-flashcard-mcq] ul button",
      ".nn-flashcard-return-link",
    ];
    const violations = [];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el, idx) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        if (r.width < MIN || r.height < MIN) {
          violations.push({
            selector: sel,
            index: idx,
            width: Math.round(r.width),
            height: Math.round(r.height),
          });
        }
      });
    }
    return violations;
  });
}

async function loginAsDemoUser(page) {
  console.log(`  ↳ Logging in as ${DEMO_EMAIL}…`);
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.locator('input[type="email"], input[name="email"]').first().fill(DEMO_EMAIL);
  await page.locator('input[type="password"], input[name="password"]').first().fill(DEMO_PASSWORD);
  await page.locator('button[type="submit"]:not([disabled]), input[type="submit"]').first().click();
  await page.waitForLoadState("domcontentloaded");
  await settle(page);
  if (page.url().includes("/login")) {
    throw new Error("Login failed — seed demo user first.");
  }
  console.log("  ↳ Logged in.");
}

async function capturePreviewMatrix(page, manifest, measurements) {
  const scenarios = ONLY_SCENARIO
    ? SCENARIOS.filter((s) => s.id === ONLY_SCENARIO)
    : SCENARIOS;

  for (const scenario of scenarios) {
    for (const theme of THEMES) {
      for (const vp of ALL_VIEWPORTS) {
        const route = previewRoute(theme, scenario.id);
        const filename = `${scenario.label}--${theme}--${vp.id}.png`;
        const out = join(OUT_ROOT, vp.bucket, filename);

        await page.setViewportSize({ width: vp.width, height: vp.height });
        await applyTheme(page, theme);
        await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
        await waitForFlashcardShell(page);
        await ensureRevealedState(page, scenario.id);
        await settle(page);

        ensureDir(dirname(out));
        await page.screenshot({ path: out, fullPage: true, animations: "disabled" });
        manifest.files.push({ path: out, scenario: scenario.id, theme, viewport: vp.id, bucket: vp.bucket });

        const shouldMeasure =
          MEASURE_VIEWPORTS.some((m) => m.id === vp.id) &&
          theme === "ocean" &&
          (scenario.id === "mcq-unanswered" || scenario.id === "mcq-long-rationale");

        if (shouldMeasure) {
          const layout = await measureLayout(page);
          const touch = vp.bucket === "mobile" ? await measureTouchTargets(page) : [];
          measurements.push({
            scenario: scenario.id,
            theme,
            viewport: vp.id,
            layout,
            touchTargetViolations: touch,
          });
        }

        process.stdout.write(`  ✓ ${vp.bucket}/${filename}\n`);
      }
    }
  }
}

async function captureAuthSession(page, manifest, sessionKind, route, theme) {
  await applyTheme(page, theme);
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await waitForFlashcardShell(page).catch(() => {});
  await settle(page);

  const hasSession = await page
    .locator("[data-nn-flashcard-layout-refinement]")
    .first()
    .isVisible()
    .catch(() => false);

  if (!hasSession) {
    console.warn(`  ⚠ ${sessionKind} — no active session at ${route} (empty queue or launcher)`);
    const launcherOut = join(OUT_ROOT, "auth", `${sessionKind}--${theme}--launcher.png`);
    ensureDir(dirname(launcherOut));
    await page.screenshot({ path: launcherOut, fullPage: true, animations: "disabled" });
    manifest.files.push({ path: launcherOut, sessionKind, theme, state: "launcher" });
    return;
  }

  for (const vp of [...DESKTOP_VIEWPORTS.slice(1, 2), MOBILE_VIEWPORTS[0]]) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await settle(page);
    const out = join(OUT_ROOT, vp.bucket, `${sessionKind}--${theme}--${vp.id}.png`);
    ensureDir(dirname(out));
    await page.screenshot({ path: out, fullPage: true, animations: "disabled" });
    manifest.files.push({ path: out, sessionKind, theme, viewport: vp.id });
    console.log(`  ✓ auth/${sessionKind} ${theme} ${vp.id}`);
  }
}

async function main() {
  ensureDir(OUT_ROOT);
  const manifest = {
    baseUrl: BASE_URL,
    capturedAt: new Date().toISOString(),
    auditRoute: "/preview/flashcard-session-live?audit=1&scenario=…",
    files: [],
    notes: {
      bowtieMatrixNgn:
        "Flashcard study stack renders MCQ + SATA only. Bowtie, Matrix, and NGN Case Study are practice/CAT item types — documented as out-of-scope for this surface.",
    },
  };
  const measurements = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`Flashcards UX Audit Phase 2 → ${OUT_ROOT}\n`);
  console.log("Preview matrix (clinical audit scenarios)…");
  await capturePreviewMatrix(page, manifest, measurements);

  if (!SKIP_AUTH) {
    console.log("\nAuth sessions (weak-area, custom-study)…");
    try {
      await loginAsDemoUser(page);
      for (const theme of THEMES) {
        await captureAuthSession(page, manifest, "weak-area-session", "/app/flashcards/weak-areas", theme);
        await captureAuthSession(
          page,
          manifest,
          "custom-study-session",
          "/app/flashcards/custom?limit=10",
          theme,
        );
      }
    } catch (err) {
      console.warn(`  ⚠ Auth captures skipped: ${err.message}`);
      manifest.authSkipped = err.message;
    }
  }

  writeFileSync(join(OUT_ROOT, "capture-manifest.json"), JSON.stringify(manifest, null, 2));
  writeFileSync(join(OUT_ROOT, "measurements.json"), JSON.stringify(measurements, null, 2));
  console.log(`\nDone — ${manifest.files.length} PNG files, ${measurements.length} measurement rows`);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
