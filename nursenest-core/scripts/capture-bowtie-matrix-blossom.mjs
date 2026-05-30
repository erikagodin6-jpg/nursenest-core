#!/usr/bin/env node
/**
 * Capture Bowtie + Matrix (NGN) in live CAT session — Blossom theme, desktop + mobile.
 * Output: docs/screenshots/ngn-formats-blossom/{desktop,mobile}/*.png
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const OUT_ROOT = join(REPO_ROOT, "docs", "screenshots", "ngn-formats-blossom");
const BASE_URL = (process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const PATHWAY_ID = process.env.SCREENSHOT_PATHWAY_ID?.trim() || "us-rn-nclex-rn";
const THEME = "blossom";
const THEME_KEY = "nursenest-theme";
const EMAIL = process.env.SCREENSHOT_DEMO_EMAIL ?? "demo-screenshots@internal.nursenest.io";
const PASSWORD = process.env.SCREENSHOT_DEMO_PASSWORD ?? "DemoScreenshot2024!";

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

function bowtieFixture() {
  return {
    questionType: "Bowtie",
    stem: "A nurse is caring for a 52-year-old client who was admitted with community-acquired pneumonia. Vital signs: T 38.9°C, HR 112 bpm, RR 28/min, BP 88/56 mmHg, SpO₂ 89% on room air. Based on the clinical presentation, complete the bowtie diagram.",
    options: {
      format: "bowtie",
      bank: [
        { id: "c1", label: "Impaired gas exchange" },
        { id: "c2", label: "Deficient fluid volume" },
        { id: "c3", label: "Decreased cardiac output" },
        { id: "i1", label: "Administer prescribed oxygen therapy" },
        { id: "i2", label: "Initiate IV fluid resuscitation" },
        { id: "i3", label: "Position client in high-Fowler's position" },
        { id: "m1", label: "Monitor SpO₂ continuously" },
        { id: "m2", label: "Measure urine output hourly" },
        { id: "m3", label: "Assess breath sounds every 2 hours" },
      ],
    },
    correctAnswer: { condition: "c1", nursing_action: "i1", monitoring: "m1" },
    rationale:
      "The client's SpO₂ of 89% and RR of 28/min indicate impaired gas exchange from pneumonia-related consolidation. Priority actions are administering oxygen to improve saturation and continuously monitoring SpO₂ to evaluate therapeutic response.",
  };
}

function matrixFixture() {
  return {
    questionType: "MATRIX",
    stem: "A nurse is caring for four clients. For each client condition, indicate whether the finding is expected or requires immediate intervention.",
    options: {
      format: "matrix",
      rows: [
        { id: "r1", label: "Client with COPD: SpO₂ 89%" },
        { id: "r2", label: "Client post-op day 1: HR 92 bpm" },
        { id: "r3", label: "Client with HF: daily weight gain 1.5 kg" },
        { id: "r4", label: "Client on heparin: aPTT 65 seconds" },
      ],
      columns: ["Expected finding", "Requires immediate intervention"],
    },
    correctAnswer: {
      r1: "Expected finding",
      r2: "Expected finding",
      r3: "Requires immediate intervention",
      r4: "Expected finding",
    },
    rationale:
      "COPD clients maintain lower SpO₂ baselines; post-op tachycardia is expected; 1.5 kg weight gain in HF indicates fluid retention requiring intervention; aPTT 65s is within therapeutic heparin range (60–100s).",
  };
}

async function login(page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  if (!page.url().includes("/login")) return true;
  await page.locator('input[type="email"], input[name="email"]').first().fill(EMAIL);
  await page.locator('input[type="password"]').first().fill(PASSWORD);
  await page.locator('button[type="submit"]').first().click();
  await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 45_000 }).catch(() => {});
  return !page.url().includes("/login");
}

async function installFixture(page, factory) {
  await page.route("**/api/practice-tests/*/question**", async (route) => {
    const req = route.request();
    if (req.method() !== "GET") {
      await route.continue();
      return;
    }
    const res = await route.fetch().catch(() => null);
    if (!res) {
      await route.continue();
      return;
    }
    let body;
    try {
      body = await res.json();
    } catch {
      await route.fulfill({ response: res });
      return;
    }
    if (body.question && typeof body.index === "number") {
      body.question = { ...factory() };
    }
    await route.fulfill({
      status: res.status(),
      headers: Object.fromEntries(Object.entries(res.headers())),
      body: JSON.stringify(body),
    });
  });
}

async function startCatSession(page) {
  const routePath = `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`;
  await page.goto(`${BASE_URL}${routePath}`, { waitUntil: "domcontentloaded", timeout: 180_000 });
  if (page.url().includes("/login")) return false;

  const startBtn = page
    .locator("[data-nn-qa-practice-hub-start-test], [data-nn-e2e-practice-hub-cat-exam]")
    .or(page.locator('button:has-text("Start test"), button:has-text("Begin exam"), button:has-text("Start exam")'))
    .first();
  if (!(await startBtn.isVisible({ timeout: 60_000 }).catch(() => false))) return false;
  await startBtn.click();

  const beginModal = page.locator('button:has-text("Begin exam"), button:has-text("Start")').first();
  if (await beginModal.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await beginModal.click();
    await page.waitForTimeout(400);
  }

  await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 }).catch(() => {});
  return page.locator("[data-cat-exam-root]").isVisible({ timeout: 60_000 }).catch(() => false);
}

async function applyTheme(page) {
  await page.evaluate(
    ({ key, value }) => {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* ignore */
      }
      document.documentElement.setAttribute("data-theme", value);
    },
    { key: THEME_KEY, value: THEME },
  );
  await page.waitForTimeout(200);
}

async function captureOne(page, { id, factory, viewportKey }) {
  const vp = VIEWPORTS[viewportKey];
  const outDir = join(OUT_ROOT, viewportKey);
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `${id}--blossom--${viewportKey}.png`);

  await page.setViewportSize(vp);
  await page.unroute("**/api/practice-tests/*/question**").catch(() => {});
  await installFixture(page, factory);

  const ok = await startCatSession(page);
  if (!ok) {
    console.error(`FAIL ${id} ${viewportKey}: could not start CAT session`);
    return null;
  }

  await applyTheme(page);
  await page.waitForTimeout(1200);

  const root = page.locator("[data-cat-exam-root]");
  await root.waitFor({ state: "visible", timeout: 30_000 }).catch(() => {});
  await page.screenshot({ path: outPath, fullPage: true, animations: "disabled" });
  console.log("saved", outPath);
  return outPath;
}

async function main() {
  mkdirSync(OUT_ROOT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const loggedIn = await login(page);
  if (!loggedIn) {
    console.error("Login failed — seed demo user or set SCREENSHOT_DEMO_EMAIL/PASSWORD");
    await browser.close();
    process.exit(1);
  }

  const jobs = [
    { id: "bowtie-unanswered", factory: bowtieFixture },
    { id: "matrix-unanswered", factory: matrixFixture },
  ];

  const saved = [];
  for (const job of jobs) {
    for (const viewportKey of ["desktop", "mobile"]) {
      const path = await captureOne(page, { ...job, viewportKey });
      if (path) saved.push(path);
    }
  }

  await browser.close();
  console.log(`\nDone: ${saved.length} screenshots in ${OUT_ROOT}`);
  if (saved.length === 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
