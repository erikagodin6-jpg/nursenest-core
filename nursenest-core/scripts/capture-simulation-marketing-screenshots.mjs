#!/usr/bin/env node
/**
 * Simulation ecosystem marketing PNG captures.
 *
 * Output: docs/screenshots/simulation-marketing/{desktop,tablet,mobile}/*.png
 *
 * Prerequisites:
 *   npx playwright install chromium
 *   npm run dev:next:3000  (or SCREENSHOT_BASE_URL)
 *   Demo user: DATABASE_URL=… npx tsx scripts/seed-screenshot-demo-user.ts
 *
 * Usage:
 *   node scripts/capture-simulation-marketing-screenshots.mjs
 *   SCREENSHOT_BASE_URL=http://127.0.0.1:3000 node scripts/capture-simulation-marketing-screenshots.mjs
 *   SCREENSHOT_THEMES=ocean,midnight node scripts/capture-simulation-marketing-screenshots.mjs
 */
import { chromium } from "@playwright/test";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..");
const REPO_ROOT = join(APP_ROOT, "..");

const BASE_URL = (process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const OUT_ROOT =
  process.env.SCREENSHOT_OUTPUT_DIR ??
  join(REPO_ROOT, "docs", "screenshots", "simulation-marketing");

const DEMO_EMAIL =
  process.env.SCREENSHOT_DEMO_EMAIL ?? "demo-screenshots@internal.nursenest.io";
const DEMO_PASSWORD = process.env.SCREENSHOT_DEMO_PASSWORD ?? "DemoScreenshot2024!";
const EXTRA_WAIT_MS = Number(process.env.SCREENSHOT_WAIT_MS ?? "1600");
const THEMES = (process.env.SCREENSHOT_THEMES ?? "ocean").split(",").map((t) => t.trim()).filter(Boolean);

const VIEWPORTS = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "tablet", width: 768, height: 1024 },
  { id: "mobile", width: 390, height: 844 },
];

const THEME_KEY = "nursenest-theme";
const DISMISSED = "nn_selector_dismissed";

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  try {
    await page.waitForLoadState("networkidle", { timeout: 45_000 });
  } catch {
    /* dev servers stay chatty */
  }
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(EXTRA_WAIT_MS);
}

async function applyTheme(page, theme) {
  await page.evaluate(
    ({ k, t, d }) => {
      try {
        localStorage.setItem(d, "1");
        localStorage.setItem(k, t);
        document.documentElement.setAttribute("data-theme", t);
      } catch {
        /* ignore */
      }
    },
    { k: THEME_KEY, t: theme, d: DISMISSED },
  );
}

async function login(page) {
  console.log(`  ↳ Login ${DEMO_EMAIL}`);
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.locator('input[type="email"], input[name="email"]').first().fill(DEMO_EMAIL);
  await page.locator('input[type="password"], input[name="password"]').first().fill(DEMO_PASSWORD);
  await page.locator('button[type="submit"]:not([disabled])').first().click();
  await settle(page);
  if (page.url().includes("/login")) {
    throw new Error("Login failed — seed demo user or set SCREENSHOT_DEMO_EMAIL/PASSWORD");
  }
}

async function capture(page, filePath, fullPage = true) {
  ensureDir(dirname(filePath));
  await page.screenshot({ path: filePath, fullPage, animations: "disabled", timeout: 90_000 });
  console.log(`    ✓ ${filePath.replace(OUT_ROOT + "/", "")}`);
}

async function capturePublic(page, theme, vp, slug, route) {
  const out = join(OUT_ROOT, vp.id, `${slug}-${theme}.png`);
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await applyTheme(page, theme);
  await settle(page);
  await capture(page, out);
  return out;
}

async function captureAuthenticated(page, theme, vp, slug, route, readySelector) {
  const out = join(OUT_ROOT, vp.id, `${slug}-${theme}.png`);
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await applyTheme(page, theme);
  if (readySelector) {
    await page.locator(readySelector).first().waitFor({ state: "visible", timeout: 120_000 });
  }
  await settle(page);
  await capture(page, out);
  return out;
}

async function main() {
  ensureDir(OUT_ROOT);
  const manifest = { baseUrl: BASE_URL, capturedAt: new Date().toISOString(), files: [] };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(
    ({ k, d }) => {
      try {
        localStorage.setItem(d, "1");
        localStorage.setItem(k, "ocean");
      } catch {
        /* ignore */
      }
    },
    { k: THEME_KEY, d: DISMISSED },
  );
  const page = await context.newPage();

  console.log(`Simulation marketing captures → ${OUT_ROOT}`);
  console.log(`Base URL: ${BASE_URL}\n`);

  await login(page);

  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      console.log(`\n[${theme} / ${vp.id}]`);

      manifest.files.push(
        await captureAuthenticated(
          page,
          theme,
          vp,
          "01-simulation-center-dashboard",
          "/app/simulation-center",
          "h1, [data-nn-learner-main], main",
        ),
      );

      manifest.files.push(
        await captureAuthenticated(
          page,
          theme,
          vp,
          "02-physiology-monitor-picker",
          "/app/physiology-monitor",
          "h1",
        ),
      );

      // Active telemetry session
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/app/physiology-monitor`, { waitUntil: "domcontentloaded" });
      await applyTheme(page, theme);
      const startBtn = page.getByRole("button", { name: /Start Simulation/i });
      if (await startBtn.isVisible({ timeout: 15_000 }).catch(() => false)) {
        await startBtn.click();
        await page.locator("[data-nn-monitor]").first().waitFor({ state: "visible", timeout: 60_000 });
        await settle(page);
        const telemetryOut = join(OUT_ROOT, vp.id, `03-physiology-monitor-telemetry-${theme}.png`);
        await capture(page, telemetryOut);
        manifest.files.push(telemetryOut);

        // Advance a few ticks for visible vitals movement
        const advanceBtn = page.getByRole("button", { name: /Advance|Next tick|Continue/i }).first();
        for (let i = 0; i < 3; i++) {
          if (await advanceBtn.isVisible().catch(() => false)) {
            await advanceBtn.click().catch(() => {});
            await page.waitForTimeout(400);
          }
        }
        const deteriorationOut = join(OUT_ROOT, vp.id, `04-patient-deterioration-${theme}.png`);
        await capture(page, deteriorationOut);
        manifest.files.push(deteriorationOut);
      }

      manifest.files.push(
        await capturePublic(
          page,
          theme,
          vp,
          "05-cnple-simulation-landing",
          "/canada/np/cnple/simulation",
        ),
      );

      // LOFT / OSCE decision moment (query param stabilizes showcase frame)
      manifest.files.push(
        await captureAuthenticated(
          page,
          theme,
          vp,
          "06-osce-ngn-decision-point",
          "/app/osce?moment=decision-point&pathwayId=ca-np-cnple",
          "#nn-learner-main, main, h1",
        ),
      );

      manifest.files.push(
        await captureAuthenticated(
          page,
          theme,
          vp,
          "07-cat-insights-ncjmm",
          "/app/practice-tests/cat-insights",
          "#nn-learner-main, main, h1",
        ),
      );
    }
  }

  writeFileSync(join(OUT_ROOT, "capture-manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\nDone — ${manifest.files.length} PNG files`);
  console.log(`Manifest: ${join(OUT_ROOT, "capture-manifest.json")}`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
