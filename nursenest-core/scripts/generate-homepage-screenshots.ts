#!/usr/bin/env tsx
/**
 * Reproducible homepage product screenshot generator.
 *
 * Captures high-density PNG product demos from the running NurseNest UI and
 * writes desktop + mobile variants to public/images/homepage.
 *
 * Usage:
 *   PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 \
 *   QA_PAID_EMAIL=demo@example.com QA_PAID_PASSWORD=... \
 *   npx tsx scripts/generate-homepage-screenshots.ts
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
const OUT_DIR = path.join(APP_ROOT, "public", "images", "homepage");
const WAIT_MS = Number(process.env.HOMEPAGE_SCREENSHOT_WAIT_MS ?? "1400");

type Target = {
  name: string;
  route: string;
  title: string;
  waitFor: string;
  theme: "ocean" | "midnight" | "blossom";
  prepare?: (page: Page) => Promise<void>;
};

const TARGETS: Target[] = [
  {
    name: "question-bank-demo",
    route: "/app/practice-tests",
    title: "Question Bank",
    waitFor: "main",
    theme: "ocean",
    prepare: submitFirstPracticeQuestion,
  },
  {
    name: "ngn-bowtie-demo",
    route: "/app/practice-tests",
    title: "Next Generation NCLEX",
    waitFor: "main",
    theme: "ocean",
  },
  {
    name: "ngn-matrix-demo",
    route: "/app/practice-tests",
    title: "NGN Matrix",
    waitFor: "main",
    theme: "ocean",
  },
  {
    name: "cat-exam-demo",
    route: "/app/practice-tests/cat-launch?pathwayId=ca-rn-nclex-rn",
    title: "CAT Exam",
    waitFor: "main",
    theme: "midnight",
  },
  {
    name: "lesson-demo",
    route: "/app/lessons",
    title: "Lessons",
    waitFor: "main",
    theme: "blossom",
  },
  {
    name: "ecg-demo",
    route: "/modules/ecg/basic/lessons",
    title: "ECG Module",
    waitFor: "main",
    theme: "midnight",
  },
  {
    name: "telemetry-shift-demo",
    route: "/modules/ecg/basic/lessons",
    title: "Telemetry Shift Simulator",
    waitFor: "main",
    theme: "midnight",
  },
  {
    name: "lab-workstation-demo",
    route: "/app/clinical-skills",
    title: "Clinical Lab Workstation",
    waitFor: "main",
    theme: "ocean",
  },
  {
    name: "med-math-demo",
    route: "/app/med-calculations",
    title: "Medication Math",
    waitFor: "main",
    theme: "ocean",
  },
  {
    name: "pharmacology-demo",
    route: "/app/pharmacology",
    title: "Pharmacology",
    waitFor: "main",
    theme: "ocean",
  },
  {
    name: "clinical-skills-demo",
    route: "/app/clinical-skills",
    title: "Clinical Skills",
    waitFor: "main",
    theme: "ocean",
  },
  {
    name: "readiness-report-demo",
    route: "/app/account/readiness",
    title: "Readiness Report",
    waitFor: "main",
    theme: "ocean",
  },
];

const VIEWPORTS = [
  { suffix: "", width: 1600, height: 1000, deviceScaleFactor: 2 },
  { suffix: "-mobile", width: 430, height: 860, deviceScaleFactor: 4 },
] as const;

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 2,
    colorScheme: "light",
  });

  try {
    await login(context);
    for (const target of TARGETS) {
      for (const viewport of VIEWPORTS) {
        const page = await context.newPage();
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.emulateMedia({ colorScheme: target.theme === "midnight" ? "dark" : "light" });
        await page.addInitScript(
          ({ theme }) => {
            localStorage.setItem("nursenest-theme", theme);
            document.documentElement.dataset.theme = theme;
          },
          { theme: target.theme },
        );
        await page.goto(`${BASE_URL}${target.route}`, { waitUntil: "networkidle" });
        await page.locator(target.waitFor).first().waitFor({ state: "visible", timeout: 45_000 });
        await target.prepare?.(page);
        await page.waitForTimeout(WAIT_MS);
        await hideTransientChrome(page);

        const raw = await page.screenshot({ fullPage: false, type: "png" });
        const file = path.join(OUT_DIR, `${target.name}${viewport.suffix}.png`);
        await sharp(raw)
          .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
          .toFile(file);

        const meta = await sharp(file).metadata();
        if ((meta.width ?? 0) < 1600) {
          throw new Error(`${target.name}${viewport.suffix}.png is ${meta.width}px wide; expected at least 1600px.`);
        }
        console.log(`✓ ${target.title}: ${path.relative(APP_ROOT, file)} (${meta.width}x${meta.height})`);
        await page.close();
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
    throw new Error("Set QA_PAID_EMAIL/QA_PAID_PASSWORD or SCREENSHOT_DEMO_EMAIL/SCREENSHOT_DEMO_PASSWORD before generating homepage screenshots.");
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

async function hideTransientChrome(page: Page) {
  await page.addStyleTag({
    content: `
      [data-testid*="toast" i],
      [role="status"],
      .nextjs-toast,
      .vercel-live-feedback,
      [data-nextjs-dialog-overlay] {
        display: none !important;
      }
    `,
  });
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
