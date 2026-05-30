#!/usr/bin/env tsx
/**
 * Homepage marketing screenshot generator.
 *
 * Produces retina PNG desktop, tablet, and mobile screenshots from live
 * NurseNest UI routes for public homepage marketing use.
 *
 * Output:
 *   public/images/marketing/{key}.png
 *   public/images/marketing/{key}-tablet.png
 *   public/images/marketing/{key}-mobile.png
 */

import { chromium, type BrowserContext, type Page } from "playwright";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.join(__dirname, "..");
const BASE_URL = (process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const OUT_DIR = path.join(APP_ROOT, "public", "images", "marketing");
const WAIT_MS = Number(process.env.MARKETING_SCREENSHOT_WAIT_MS ?? "1400");

type Target = {
  key: string;
  route: string;
  theme: "ocean" | "midnight" | "blossom";
  waitFor?: string;
  prepare?: (page: Page) => Promise<void>;
};

const TARGETS: Target[] = [
  { key: "answered-nclex-question", route: "/app/practice-tests", theme: "ocean", prepare: submitFirstPracticeQuestion },
  { key: "ngn-bowtie", route: "/app/practice-tests", theme: "ocean" },
  { key: "ngn-matrix", route: "/app/practice-tests", theme: "ocean" },
  { key: "cat-exam", route: "/app/practice-tests/cat-launch?pathwayId=ca-rn-nclex-rn", theme: "midnight" },
  { key: "lesson-page", route: "/app/lessons", theme: "blossom" },
  { key: "ecg-detective-mode", route: "/modules/ecg/basic/lessons", theme: "midnight" },
  { key: "telemetry-shift-simulator", route: "/modules/ecg/basic/lessons", theme: "midnight" },
  { key: "clinical-lab-workstation", route: "/app/clinical-skills", theme: "ocean" },
  { key: "medication-math", route: "/app/med-calculations", theme: "ocean" },
  { key: "pharmacology", route: "/app/pharmacology", theme: "ocean" },
  { key: "clinical-skills", route: "/app/clinical-skills", theme: "ocean" },
  { key: "readiness-dashboard", route: "/app/account/readiness", theme: "ocean" },
];

const VIEWPORTS = [
  { suffix: "", width: 1600, height: 1000, deviceScaleFactor: 2 },
  { suffix: "-tablet", width: 900, height: 1100, deviceScaleFactor: 3 },
  { suffix: "-mobile", width: 430, height: 860, deviceScaleFactor: 4 },
] as const;

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const authContext = await browser.newContext();
    await login(authContext);
    const storageState = await authContext.storageState();
    await authContext.close();
    for (const target of TARGETS) {
      for (const viewport of VIEWPORTS) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: viewport.deviceScaleFactor,
          storageState,
        });
        const page = await context.newPage();
        await page.emulateMedia({ colorScheme: target.theme === "midnight" ? "dark" : "light" });
        await page.addInitScript(
          ({ theme }) => {
            localStorage.setItem("nursenest-theme", theme);
            document.documentElement.dataset.theme = theme;
          },
          { theme: target.theme },
        );
        await page.goto(`${BASE_URL}${target.route}`, { waitUntil: "networkidle" });
        await page.locator(target.waitFor ?? "main").first().waitFor({ state: "visible", timeout: 45_000 });
        await target.prepare?.(page);
        await page.waitForTimeout(WAIT_MS);
        await page.addStyleTag({ content: `[data-testid*="toast" i], [role="status"], .nextjs-toast { display: none !important; }` });
        const raw = await page.screenshot({ fullPage: false, type: "png" });
        const file = path.join(OUT_DIR, `${target.key}${viewport.suffix}.png`);
        await sharp(raw).png({ compressionLevel: 9, adaptiveFiltering: true, palette: false }).toFile(file);
        const meta = await sharp(file).metadata();
        if ((meta.width ?? 0) < 1600) throw new Error(`${path.basename(file)} is below 1600px wide.`);
        console.log(`✓ ${path.relative(APP_ROOT, file)} (${meta.width}x${meta.height})`);
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}

async function login(context: BrowserContext) {
  const email = firstEnv("QA_PAID_EMAIL", "E2E_PAID_EMAIL", "SCREENSHOT_DEMO_EMAIL", "PLAYWRIGHT_TEST_EMAIL");
  const password = firstEnv("QA_PAID_PASSWORD", "E2E_PAID_PASSWORD", "SCREENSHOT_DEMO_PASSWORD", "PLAYWRIGHT_TEST_PASSWORD");
  if (!email || !password) {
    throw new Error("Set QA_PAID_EMAIL/QA_PAID_PASSWORD or SCREENSHOT_DEMO_EMAIL/SCREENSHOT_DEMO_PASSWORD before generating marketing screenshots.");
  }
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
  await page.locator('input[type="email"], input[name="email"]').first().fill(email);
  await page.locator('input[type="password"], input[name="password"]').first().fill(password);
  await page.getByRole("button", { name: /sign in|log in|continue/i }).first().click();
  await page.waitForURL(/\/app|\/dashboard|\/$/i, { timeout: 45_000 }).catch(() => {});
  await page.close();
}

async function submitFirstPracticeQuestion(page: Page) {
  const start = page.getByRole("button", { name: /start|begin|practice/i }).first();
  if (await start.isVisible().catch(() => false)) {
    await start.click().catch(() => {});
    await page.waitForTimeout(1500);
  }
  const firstOption = page.locator(".nn-nclex-answer-card, button.nn-cat-opt, label.nn-cat-opt, [data-testid*='answer' i]").first();
  if (await firstOption.isVisible().catch(() => false)) {
    await firstOption.click().catch(() => {});
    await page.getByRole("button", { name: /submit answer|check answer|submit/i }).first().click().catch(() => {});
    await page.waitForTimeout(1200);
  }
}

function firstEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
