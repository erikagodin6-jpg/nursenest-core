import fs from "node:fs/promises";
import path from "node:path";
import { chromium, type Browser, type Page } from "playwright";

type CheckResult = {
  runId: string;
  checkName: string;
  route: string;
  status: "pass" | "fail";
  durationMs: number;
  httpStatus?: number | null;
  error?: string | null;
  screenshotDataUrl?: string | null;
  checkedAt: string;
  meta?: Record<string, unknown>;
};

const RUN_ID = `learning-${new Date().toISOString().replace(/[:.]/g, "-")}`;
const BASE_URL = (process.env.SYNTHETIC_MONITOR_BASE_URL || process.env.PLAYWRIGHT_BASE_URL || process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const PATHWAY_ID = process.env.SYNTHETIC_MONITOR_PATHWAY_ID?.trim() || "ca-rn-nclex-rn";
const RESULTS_DIR = path.resolve(process.cwd(), "test-results/synthetic-learning-monitor");
const ALERT_ENDPOINT = process.env.SYNTHETIC_MONITOR_RESULT_ENDPOINT?.trim() || `${BASE_URL}/api/internal/synthetic-learning-monitor`;
const ALERT_SECRET = process.env.SYNTHETIC_MONITOR_SECRET?.trim() || process.env.CRON_SECRET?.trim() || "";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function login(page: Page): Promise<void> {
  const email =
    process.env.QA_PAID_EMAIL?.trim() ||
    process.env.E2E_PAID_EMAIL?.trim() ||
    process.env.PLAYWRIGHT_TEST_EMAIL?.trim() ||
    requiredEnv("QA_PAID_EMAIL");
  const password =
    process.env.QA_PAID_PASSWORD ||
    process.env.E2E_PAID_PASSWORD ||
    process.env.PLAYWRIGHT_TEST_PASSWORD ||
    requiredEnv("QA_PAID_PASSWORD");

  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.locator("#login-identifier").fill(email);
  await page.locator("#login-password").fill(password);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 60_000 }),
    page.locator("form").filter({ has: page.locator("#login-identifier") }).first().locator("button[type='submit']").click(),
  ]);
  await page.goto(`${BASE_URL}/app`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  if (/\/login/i.test(page.url())) throw new Error("login_failed");
}

async function rejectLoadingState(page: Page): Promise<void> {
  const text = await page.locator("body").innerText({ timeout: 10_000 }).catch(() => "");
  if (/\b(Just a moment|Please wait|Fetching)\b/i.test(text)) {
    throw new Error("page_still_in_blocking_loading_state");
  }
  const loaders = await page.locator(".skeleton, [class*='skeleton'], .spinner, [class*='spinner'], [aria-busy='true']").count();
  if (loaders > 0 && /Loading/i.test(text)) {
    throw new Error("loading_indicator_still_visible");
  }
}

async function firstVisible(page: Page, selectors: string, timeout = 60_000): Promise<void> {
  await page.locator(selectors).first().waitFor({ state: "visible", timeout });
  await rejectLoadingState(page);
}

async function screenshotDataUrl(page: Page, checkName: string): Promise<string | null> {
  try {
    await fs.mkdir(RESULTS_DIR, { recursive: true });
    const filePath = path.join(RESULTS_DIR, `${RUN_ID}-${checkName}.jpg`);
    const buffer = await page.screenshot({ path: filePath, type: "jpeg", quality: 45, fullPage: false });
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

async function runCheck(
  page: Page,
  checkName: string,
  route: string,
  fn: () => Promise<void>,
): Promise<CheckResult> {
  const started = Date.now();
  let status: CheckResult["status"] = "pass";
  let error: string | null = null;
  let httpStatus: number | null = null;
  try {
    const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    httpStatus = response?.status() ?? null;
    if (httpStatus && httpStatus >= 500) throw new Error(`http_${httpStatus}`);
    if (/\/login/i.test(page.url())) throw new Error("redirected_to_login");
    await fn();
  } catch (e) {
    status = "fail";
    error = e instanceof Error ? e.message.slice(0, 1000) : String(e).slice(0, 1000);
  }
  return {
    runId: RUN_ID,
    checkName,
    route,
    status,
    durationMs: Date.now() - started,
    httpStatus,
    error,
    screenshotDataUrl: await screenshotDataUrl(page, checkName),
    checkedAt: new Date().toISOString(),
    meta: { finalUrl: page.url() },
  };
}

async function runAll(browser: Browser): Promise<CheckResult[]> {
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  page.setDefaultTimeout(60_000);
  await login(page);

  const results: CheckResult[] = [];
  results.push(await runCheck(page, "flashcards_launch", `/app/flashcards?pathwayId=${encodeURIComponent(PATHWAY_ID)}`, async () => {
    await firstVisible(page, "[data-nn-e2e-start-review], [data-nn-e2e-flashcards-hub]", 90_000);
    const start = page.locator("[data-nn-e2e-start-review]").first();
    if (await start.isVisible().catch(() => false)) {
      await start.click();
      await firstVisible(page, ".nn-flashcard-hero-stem, .nn-question-stem, [data-nn-premium-flashcard-study]", 90_000);
    }
  }));

  results.push(await runCheck(page, "cat_launch", `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`, async () => {
    await firstVisible(page, "[data-nn-qa-practice-hub-start-test]", 90_000);
    await page.locator("[data-nn-qa-practice-hub-start-test]").first().click();
    const begin = page.getByRole("button", { name: /begin|start|launch/i }).first();
    if (await begin.isVisible().catch(() => false)) await begin.click();
    await firstVisible(page, ".nn-cat-question-stem, .nn-question-stem, ul.nn-cat-opt-list", 120_000);
  }));

  results.push(await runCheck(page, "practice_questions_launch", `/app/questions/start?pathwayId=${encodeURIComponent(PATHWAY_ID)}&count=5`, async () => {
    await firstVisible(page, ".nn-cat-question-stem, .nn-question-stem, ul.nn-cat-opt-list, button.nn-cat-opt, label.nn-cat-opt", 120_000);
  }));

  results.push(await runCheck(page, "lesson_launch", `/app/lessons?pathwayId=${encodeURIComponent(PATHWAY_ID)}`, async () => {
    await firstVisible(page, "#pathway-lesson-library, [data-nn-qa-pathway-lessons-hub='true'], main a[href*='/app/lessons/']", 90_000);
    const lesson = page.locator("main a[href*='/app/lessons/']").first();
    if (await lesson.isVisible().catch(() => false)) {
      await lesson.click();
      await firstVisible(page, "article, [data-nn-pathway-lesson-content], .nn-lesson-content, main", 90_000);
      const text = await page.locator("main").innerText().catch(() => "");
      if (text.trim().length < 300) throw new Error("lesson_content_too_short");
    }
  }));

  results.push(await runCheck(page, "clinical_skills_launch", "/app/clinical-skills", async () => {
    await firstVisible(page, "[data-nn-clinical-skills-hub], .nn-clinical-skills, main", 90_000);
    const text = await page.locator("main").innerText().catch(() => "");
    if (!/clinical|skill|competency|simulation/i.test(text)) throw new Error("clinical_skills_content_missing");
  }));

  results.push(await runCheck(page, "pharmacology_launch", "/app/pharmacology", async () => {
    await firstVisible(page, "[data-nn-pharmacology-hub], .nn-pharmacology, main", 90_000);
    const text = await page.locator("main").innerText().catch(() => "");
    if (!/pharmacology|medication|drug|safety/i.test(text)) throw new Error("pharmacology_content_missing");
  }));

  return results;
}

async function submit(results: CheckResult[]): Promise<void> {
  if (!ALERT_ENDPOINT || !ALERT_SECRET) return;
  const res = await fetch(ALERT_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ALERT_SECRET}`,
    },
    body: JSON.stringify({ runId: RUN_ID, checks: results }),
  });
  if (!res.ok) {
    throw new Error(`result_ingest_failed_${res.status}`);
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  let results: CheckResult[] = [];
  try {
    results = await runAll(browser);
  } finally {
    await browser.close();
  }
  await fs.mkdir(RESULTS_DIR, { recursive: true });
  await fs.writeFile(path.join(RESULTS_DIR, `${RUN_ID}.json`), JSON.stringify({ runId: RUN_ID, baseUrl: BASE_URL, results }, null, 2));
  await submit(results);
  const failed = results.filter((r) => r.status === "fail");
  console.table(results.map((r) => ({ check: r.checkName, status: r.status, ms: r.durationMs, route: r.route, error: r.error ?? "" })));
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("[synthetic-learning-monitor] failed", e);
  process.exitCode = 1;
});
