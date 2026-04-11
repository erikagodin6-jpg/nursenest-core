#!/usr/bin/env node
/**
 * Screenshot capture script — Playwright-based.
 *
 * Logs in as the demo/screenshot account and captures real product screenshots
 * at defined routes and viewports. Output is saved to `screenshots/` (or the
 * path specified by SCREENSHOT_OUTPUT_DIR) ready for upload to DigitalOcean Spaces.
 *
 * Prerequisites:
 *   1. Run `npx playwright install chromium` once.
 *   2. Run `npx tsx scripts/seed-screenshot-demo-user.ts` to create the demo account.
 *   3. Start the dev server: `npm run dev`
 *
 * Usage:
 *   node scripts/capture-screenshots.mjs
 *   SCREENSHOT_BASE_URL=https://staging.nursenest.io node scripts/capture-screenshots.mjs
 *
 * Required env (for demo account login):
 *   SCREENSHOT_DEMO_EMAIL    (default: demo-screenshots@internal.nursenest.io)
 *   SCREENSHOT_DEMO_PASSWORD (default: DemoScreenshot2024!)
 *
 * Optional env:
 *   SCREENSHOT_BASE_URL      (default: http://localhost:3000)
 *   SCREENSHOT_OUTPUT_DIR    (default: screenshots/)
 *   SCREENSHOT_ONLY_IDS      Comma-separated target IDs to capture (e.g. "practice-q,cat-exam")
 *   SCREENSHOT_WAIT_MS       Extra delay before capture in ms (default: 1500)
 *
 * After capture:
 *   Upload files to DigitalOcean Spaces using `scripts/sync-lesson-image-inventory.mjs`
 *   conventions, or upload manually via the admin media library.
 *   Then register new entries in `src/lib/marketing/screenshot-registry.ts`.
 */

import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Configuration ─────────────────────────────────────────────────────────────

const BASE_URL = process.env.SCREENSHOT_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
const OUTPUT_DIR = process.env.SCREENSHOT_OUTPUT_DIR ?? join(ROOT, "screenshots");
const DEMO_EMAIL =
  process.env.SCREENSHOT_DEMO_EMAIL ?? "demo-screenshots@internal.nursenest.io";
const DEMO_PASSWORD = process.env.SCREENSHOT_DEMO_PASSWORD ?? "DemoScreenshot2024!";
const EXTRA_WAIT_MS = Number(process.env.SCREENSHOT_WAIT_MS ?? "1500");
const ONLY_IDS = process.env.SCREENSHOT_ONLY_IDS
  ? new Set(process.env.SCREENSHOT_ONLY_IDS.split(",").map((s) => s.trim()))
  : null;

// ── Viewport presets ──────────────────────────────────────────────────────────

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile:  { width: 390,  height: 844 },
};

// ── Capture targets ───────────────────────────────────────────────────────────
//
// Each target defines:
//   id          — stable human-readable identifier (also controls SCREENSHOT_ONLY_IDS filtering)
//   route       — URL path relative to BASE_URL (append ?demo=1 for any demo-mode UI tweaks)
//   outputPath  — destination file under OUTPUT_DIR (maps directly to Spaces key)
//   viewport    — "desktop" | "mobile"
//   requiresAuth — true = must be logged in as demo user first
//   waitFor     — optional CSS selector to wait for before capturing
//   notes       — context for the person running captures
//
// Add new targets here when new product surfaces need screenshots.
// Keep outputPath naming consistent with the Spaces key convention:
//   screenshots/{category}/{slug}-{viewport}.png

/** @type {Array<{id: string, route: string, outputPath: string, viewport: keyof typeof VIEWPORTS, requiresAuth: boolean, waitFor?: string, notes?: string}>} */
const CAPTURE_TARGETS = [
  // ── Marketing / public ─────────────────────────────────────────────────────

  {
    id: "home-desktop",
    route: "/",
    outputPath: "screenshots/home/home-desktop.png",
    viewport: "desktop",
    requiresAuth: false,
    notes: "Homepage hero — wait for carousel to settle",
  },
  {
    id: "pricing-desktop",
    route: "/pricing",
    outputPath: "screenshots/pricing/pricing-desktop.png",
    viewport: "desktop",
    requiresAuth: false,
  },
  {
    id: "faq-desktop",
    route: "/faq",
    outputPath: "screenshots/faq/faq-desktop.png",
    viewport: "desktop",
    requiresAuth: false,
  },
  {
    id: "about-desktop",
    route: "/about",
    outputPath: "screenshots/about/about-desktop.png",
    viewport: "desktop",
    requiresAuth: false,
  },

  // ── Product / authenticated ────────────────────────────────────────────────

  {
    id: "dashboard-desktop",
    route: "/app",
    outputPath: "screenshots/dashboard/dashboard-desktop.png",
    viewport: "desktop",
    requiresAuth: true,
    waitFor: "[data-testid='study-hub'], main",
    notes: "Student dashboard / study hub",
  },
  {
    id: "dashboard-mobile",
    route: "/app",
    outputPath: "screenshots/dashboard/dashboard-mobile.png",
    viewport: "mobile",
    requiresAuth: true,
    waitFor: "[data-testid='study-hub'], main",
  },

  {
    id: "question-bank-desktop",
    route: "/app/questions",
    outputPath: "screenshots/practice/question-bank-desktop.png",
    viewport: "desktop",
    requiresAuth: true,
    waitFor: "[data-testid='question-list'], main",
    notes: "Question bank browse/filter view",
  },

  {
    id: "practice-q-desktop",
    route: "/app/questions",
    outputPath: "screenshots/practice/practice-question-runner-desktop.png",
    viewport: "desktop",
    requiresAuth: true,
    waitFor: "[data-testid='practice-runner'], main",
    notes:
      "Practice question interface with rationale panel. May need to navigate into an active session first.",
  },

  {
    id: "cat-exam-desktop",
    route: "/app/cat",
    outputPath: "screenshots/cat/cat-exam-session-desktop.png",
    viewport: "desktop",
    requiresAuth: true,
    waitFor: "[data-testid='cat-question'], main",
    notes: "CAT exam session in progress — single-column layout",
  },
  {
    id: "cat-exam-mobile",
    route: "/app/cat",
    outputPath: "screenshots/cat/cat-exam-session-mobile.png",
    viewport: "mobile",
    requiresAuth: true,
    waitFor: "[data-testid='cat-question'], main",
  },

  {
    id: "cat-results-desktop",
    route: "/app/cat/results",
    outputPath: "screenshots/cat/cat-results-readiness-desktop.png",
    viewport: "desktop",
    requiresAuth: true,
    waitFor: "[data-testid='cat-results'], main",
    notes: "CAT results page — readiness score + weak areas",
  },

  {
    id: "smart-review-desktop",
    route: "/app/review",
    outputPath: "screenshots/review/smart-review-desktop.png",
    viewport: "desktop",
    requiresAuth: true,
    waitFor: "[data-testid='smart-review'], main",
    notes: "Smart review — questions grouped by confidence",
  },

  {
    id: "study-plan-desktop",
    route: "/app/study-plan",
    outputPath: "screenshots/study-plan/study-plan-overview-desktop.png",
    viewport: "desktop",
    requiresAuth: true,
    waitFor: "[data-testid='study-plan'], main",
    notes: "Adaptive study plan with day cards",
  },

  {
    id: "analytics-desktop",
    route: "/app/analytics",
    outputPath: "screenshots/analytics/analytics-overview-desktop.png",
    viewport: "desktop",
    requiresAuth: true,
    waitFor: "[data-testid='analytics-page'], main",
    notes: "Confidence analytics + progress reports",
  },

  {
    id: "lessons-hub-desktop",
    route: "/app/lessons",
    outputPath: "screenshots/lessons/lesson-library-desktop.png",
    viewport: "desktop",
    requiresAuth: true,
    waitFor: "[data-testid='lessons-hub'], main",
    notes: "Lesson library browse view",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

async function loginAsDemoUser(page) {
  console.log(`  ↳ Logging in as ${DEMO_EMAIL}…`);
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });

  // Fill login form — selectors match the existing marketing login page
  const emailInput = page.locator('input[type="email"], input[name="email"]');
  const passwordInput = page.locator('input[type="password"], input[name="password"]');
  const submitBtn = page.locator(
    'button[type="submit"]:not([disabled]), input[type="submit"]',
  );

  await emailInput.fill(DEMO_EMAIL);
  await passwordInput.fill(DEMO_PASSWORD);
  await submitBtn.click();
  await page.waitForLoadState("domcontentloaded");

  // Verify login succeeded
  const url = page.url();
  if (url.includes("/login") || url.includes("/signup")) {
    throw new Error(
      `Login failed — still on ${url}. Check demo account credentials or run seed-screenshot-demo-user.ts first.`,
    );
  }
  console.log("  ↳ Logged in successfully.");
}

async function captureTarget(page, target) {
  const absPath = join(OUTPUT_DIR, target.outputPath.replace(/^screenshots\//, ""));
  ensureDir(absPath);

  const vp = VIEWPORTS[target.viewport] ?? VIEWPORTS.desktop;
  await page.setViewportSize(vp);

  console.log(
    `  Capturing [${target.viewport}] ${target.route} → ${target.outputPath}`,
  );

  try {
    await page.goto(`${BASE_URL}${target.route}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    if (target.waitFor) {
      await page.waitForSelector(target.waitFor, { timeout: 10_000 }).catch(() => {
        console.warn(`    ⚠ waitFor selector not found: ${target.waitFor} — proceeding anyway`);
      });
    }

    if (EXTRA_WAIT_MS > 0) {
      await page.waitForTimeout(EXTRA_WAIT_MS);
    }

    await page.screenshot({ path: absPath, fullPage: false });
    console.log(`    ✓ Saved to ${absPath}`);

    return { id: target.id, outputPath: absPath, status: "ok" };
  } catch (err) {
    console.error(`    ✗ FAILED: ${err.message}`);
    return { id: target.id, outputPath: absPath, status: "error", error: err.message };
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\nNurseNest — Screenshot Capture Script");
  console.log("Base URL:   ", BASE_URL);
  console.log("Output dir: ", OUTPUT_DIR);
  if (ONLY_IDS) {
    console.log("Filter IDs: ", [...ONLY_IDS].join(", "));
  }
  console.log();

  const targets = ONLY_IDS
    ? CAPTURE_TARGETS.filter((t) => ONLY_IDS.has(t.id))
    : CAPTURE_TARGETS;

  if (targets.length === 0) {
    console.error("No targets matched. Check SCREENSHOT_ONLY_IDS.");
    process.exit(1);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    // Disable animations so screenshots are stable
    reducedMotion: "reduce",
    // Use a real user-agent for cookie/auth compatibility
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 NurseNest-Screenshot-Bot/1.0",
  });

  const page = await context.newPage();
  let loggedIn = false;
  const results = [];

  for (const target of targets) {
    console.log(`\n[${target.id}]`);
    if (target.notes) console.log(`  Note: ${target.notes}`);

    if (target.requiresAuth && !loggedIn) {
      await loginAsDemoUser(page);
      loggedIn = true;
    }

    const result = await captureTarget(page, target);
    results.push(result);
  }

  await browser.close();

  // ── Summary ──────────────────────────────────────────────────────────────

  const ok = results.filter((r) => r.status === "ok");
  const failed = results.filter((r) => r.status === "error");

  console.log("\n─────────────────────────────────────────────────────");
  console.log(`Capture complete: ${ok.length} succeeded, ${failed.length} failed`);

  if (failed.length > 0) {
    console.log("\nFailed targets:");
    for (const r of failed) {
      console.log(`  ✗ ${r.id}: ${r.error}`);
    }
  }

  if (ok.length > 0) {
    console.log("\nSuccessfully captured:");
    for (const r of ok) {
      console.log(`  ✓ ${r.id}`);
    }
  }

  // Write a manifest of captured screenshots for the upload/register step
  const manifestPath = join(OUTPUT_DIR, "capture-manifest.json");
  writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        baseUrl: BASE_URL,
        results,
      },
      null,
      2,
    ),
  );
  console.log(`\nManifest written to: ${manifestPath}`);

  console.log("\nNext steps:");
  console.log(
    "  1. Review screenshots in:",
    OUTPUT_DIR,
  );
  console.log(
    "  2. Upload to DigitalOcean Spaces under the 'screenshots/' prefix.",
  );
  console.log(
    "  3. Register new screenshots in src/lib/marketing/screenshot-registry.ts.",
  );
  console.log();

  if (failed.length > 0) process.exit(1);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
