#!/usr/bin/env node
/**
 * Flashcard layout refinement — PNG captures via live preview route (no auth/DB).
 *
 * Output: docs/screenshots/flashcard-layout-refinement/{desktop,tablet,mobile}/*.png
 *
 *   npm run dev:next:3000
 *   node scripts/capture-flashcard-layout-screenshots.mjs
 */
import { chromium } from "@playwright/test";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");

const BASE_URL = (process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const OUT_ROOT =
  process.env.SCREENSHOT_OUTPUT_DIR ??
  join(REPO_ROOT, "docs", "screenshots", "flashcard-layout-refinement");

const THEMES = (process.env.SCREENSHOT_THEMES ?? "ocean,blossom,midnight").split(",").map((t) => t.trim()).filter(Boolean);
const EXTRA_WAIT_MS = Number(process.env.SCREENSHOT_WAIT_MS ?? "1400");

const VIEWPORTS = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "tablet", width: 768, height: 1024 },
  { id: "mobile", width: 390, height: 844 },
];

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(EXTRA_WAIT_MS);
}

async function main() {
  ensureDir(OUT_ROOT);
  const manifest = { baseUrl: BASE_URL, capturedAt: new Date().toISOString(), files: [] };

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Flashcard layout PNGs → ${OUT_ROOT}\n`);

  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      const route = `/preview/flashcard-session-live?theme=${encodeURIComponent(theme)}`;
      const out = join(OUT_ROOT, vp.id, `flashcard-study-${theme}.png`);

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
      await page.locator("[data-nn-flashcard-layout-refinement]").first().waitFor({ state: "attached", timeout: 60_000 }).catch(() => {});
      await page.locator(".nn-flashcard-learning-topbar").first().waitFor({ state: "visible", timeout: 60_000 }).catch(() => {});
      await settle(page);

      ensureDir(dirname(out));
      await page.screenshot({ path: out, fullPage: true, animations: "disabled" });
      console.log(`  ✓ ${vp.id}/${theme} → ${out.replace(OUT_ROOT + "/", "")}`);
      manifest.files.push(out);

      // Revealed state: pick first MCQ option and submit when enabled
      const options = page.locator("[data-nn-premium-flashcard-mcq] ul button");
      const optionCount = await options.count().catch(() => 0);
      for (let i = 0; i < optionCount; i++) {
        const opt = options.nth(i);
        if (!(await opt.isVisible().catch(() => false))) continue;
        await opt.click();
        const submit = page.locator(".nn-flashcard-submit-answer").first();
        if (await submit.isEnabled({ timeout: 3_000 }).catch(() => false)) {
          await submit.click();
          await page.locator('[data-nn-rationale-state="revealed"]').first().waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
          await settle(page);
          const revealedOut = join(OUT_ROOT, vp.id, `flashcard-study-revealed-${theme}.png`);
          await page.screenshot({ path: revealedOut, fullPage: true, animations: "disabled" });
          console.log(`  ✓ ${vp.id}/${theme}-revealed → ${revealedOut.replace(OUT_ROOT + "/", "")}`);
          manifest.files.push(revealedOut);
          break;
        }
      }
    }
  }

  writeFileSync(join(OUT_ROOT, "capture-manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\nDone — ${manifest.files.length} PNG files`);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
