#!/usr/bin/env node
/** One-shot layout measurement for flashcard UX audit. */
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const BASE_URL = (process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:3737").replace(/\/$/, "");

const CASES = [
  { scenario: "mcq-unanswered", w: 1440, h: 900 },
  { scenario: "mcq-long-rationale", w: 1440, h: 900 },
  { scenario: "mcq-unanswered", w: 390, h: 844 },
  { scenario: "sata-answered", w: 1440, h: 900 },
];

async function measure(page) {
  return page.evaluate(() => {
    const r = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { top: Math.round(b.top), height: Math.round(b.height), bottom: Math.round(b.bottom), width: Math.round(b.width), left: Math.round(b.left), right: Math.round(b.right) };
    };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const topbar = r(".nn-flashcard-learning-topbar");
    const heading = r(".nn-flashcard-study-heading");
    const hero = r(".nn-flashcard-hero-surface");
    const rationale = r(".nn-flashcard-rationale-panel");
    const coach = r(".nn-flashcard-coach-panel");
    const sm2 = r(".nn-flashcard-rating-dock");
    const grid = r(".nn-flashcard-learning-grid");
    const canvas = r(".nn-flashcard-study-canvas");
    const session = r("[data-nn-flashcard-layout-refinement]");
    return {
      viewport: { width: vw, height: vh },
      topWhitespacePx: topbar?.top ?? null,
      topbarHeightPx: topbar?.height ?? null,
      headingHeightPx: heading?.height ?? null,
      gridTopPx: grid?.top ?? null,
      gridHeightPx: grid?.height ?? null,
      heroHeightPx: hero?.height ?? null,
      rationaleHeightPx: rationale?.height ?? null,
      coachTopPx: coach?.top ?? null,
      coachHeightPx: coach?.height ?? null,
      sm2TopPx: sm2?.top ?? null,
      sm2HeightPx: sm2?.height ?? null,
      bottomGapPx: sm2 ? vh - sm2.bottom : null,
      sidePaddingLeftPx: canvas && session ? Math.max(0, session.left - canvas.left) : null,
      sidePaddingRightPx: canvas && session ? Math.max(0, canvas.right - session.right) : null,
      cardPaddingEstimatePx: hero && grid ? Math.max(0, hero.left - grid.left) : null,
      sectionGapCoachToSm2Px: coach && sm2 ? sm2.top - coach.bottom : null,
      aboveFoldContentBottomPx: Math.max(hero?.bottom ?? 0, rationale?.bottom ?? 0, grid?.bottom ?? 0),
      scrollHeightPx: document.documentElement.scrollHeight,
      horizontalScroll: document.documentElement.scrollWidth > vw + 1,
    };
  });
}

async function reveal(page, scenario) {
  if (!scenario.includes("rationale") && !scenario.includes("answered")) return;
  const options = page.locator("[data-nn-premium-flashcard-mcq] ul button, [data-nn-premium-flashcard-sata] button");
  const n = await options.count();
  for (let i = 0; i < n; i++) {
    const o = options.nth(i);
    if (await o.isVisible().catch(() => false)) await o.click();
  }
  const submit = page.locator(".nn-flashcard-submit-answer").first();
  if (await submit.isEnabled({ timeout: 2000 }).catch(() => false)) await submit.click();
  await page.waitForTimeout(800);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const out = [];
  for (const c of CASES) {
    const url = `${BASE_URL}/preview/flashcard-session-live?audit=1&scenario=${c.scenario}&theme=ocean`;
    await page.setViewportSize({ width: c.w, height: c.h });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await page.locator(".nn-flashcard-learning-topbar").first().waitFor({ state: "visible", timeout: 90_000 });
    await page.waitForTimeout(600);
    await reveal(page, c.scenario);
    out.push({ ...c, metrics: await measure(page) });
    console.log(JSON.stringify({ ...c, metrics: out.at(-1).metrics }, null, 2));
  }
  writeFileSync(join(REPO_ROOT, "docs", "screenshots", "flashcards-ux-audit-phase2", "layout-measurements.json"), JSON.stringify(out, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
