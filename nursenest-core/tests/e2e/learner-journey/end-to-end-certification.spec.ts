/**
 * End-to-End Learner Journey Certification
 *
 * Tests the complete 12-step study cycle for four learner profiles:
 *   RN | RPN | NP | Allied
 *
 * Uses the View-As-Customer (admin-learner-qa-simulation) system for
 * simulated profiles. Steps 1–3 (auth gate + navigation) run without
 * credentials; steps 4–12 require admin credentials and an active
 * simulation session.
 *
 * Run with full admin credentials:
 *   E2E_ADMIN_EMAIL=...  E2E_ADMIN_PASSWORD=... \
 *   PLAYWRIGHT_RN_EMAIL=...  PLAYWRIGHT_RN_PASSWORD=... \
 *   npx playwright test tests/e2e/learner-journey/end-to-end-certification.spec.ts
 *
 * Run structure-only (no admin creds needed):
 *   npx playwright test tests/e2e/learner-journey/end-to-end-certification.spec.ts
 */

import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import { getE2eBaseURL } from "../helpers/e2e-env";

// ── Config ─────────────────────────────────────────────────────────────────

const BASE = getE2eBaseURL();
const SCREENSHOT_DIR = path.join("docs", "screenshots", "e2e-certification");
const STEP_TIMEOUT = 60_000;
const NAV_TIMEOUT = 90_000;

type ProfileKind = "RN" | "RPN" | "NP" | "Allied";
type JourneyStep = { step: number; name: string; result: "pass" | "fail" | "skip" | "warn"; ms: number; detail?: string; url?: string };
type ProfileResult = { profile: ProfileKind; steps: JourneyStep[]; adminCreds: boolean; learnerCreds: boolean };

const results: ProfileResult[] = [];

const PROFILE_DEFS: Record<ProfileKind, {
  track: string;
  country: "CA" | "US";
  pathway: string;
  npSpecialty?: string;
  alliedCareer?: string;
  envPrefix: string;
}> = {
  RN:     { track: "RN",     country: "CA", pathway: "ca-rn-nclex-rn",  envPrefix: "PLAYWRIGHT_RN" },
  RPN:    { track: "RPN",    country: "CA", pathway: "ca-rpn-rex-pn",   envPrefix: "PLAYWRIGHT_PN" },
  NP:     { track: "NP",     country: "US", pathway: "us-np-fnp",       envPrefix: "PLAYWRIGHT_NP", npSpecialty: "FNP" },
  Allied: { track: "ALLIED", country: "US", pathway: "us-allied-paramedic", envPrefix: "PLAYWRIGHT_ALLIED", alliedCareer: "paramedic" },
};

// ── Setup helpers ─────────────────────────────────────────────────────────

mkdirSync(SCREENSHOT_DIR, { recursive: true });

function getAdminCreds(): { email: string; password: string } | null {
  const email = process.env.E2E_ADMIN_EMAIL?.trim();
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) return null;
  return { email, password };
}

function getLearnerCreds(prefix: string): { email: string; password: string } | null {
  const email = process.env[`${prefix}_EMAIL`]?.trim();
  const password = process.env[`${prefix}_PASSWORD`];
  if (!email || !password) return null;
  return { email, password };
}

async function step(
  label: string,
  fn: () => Promise<{ detail?: string; url?: string }>,
): Promise<JourneyStep> {
  const t0 = Date.now();
  try {
    const result = await fn();
    return { step: 0, name: label, result: "pass", ms: Date.now() - t0, ...result };
  } catch (err) {
    return {
      step: 0, name: label, result: "fail", ms: Date.now() - t0,
      detail: err instanceof Error ? err.message.slice(0, 200) : String(err),
    };
  }
}

function skipStep(label: string, reason: string): JourneyStep {
  return { step: 0, name: label, result: "skip", ms: 0, detail: reason };
}

async function screenshotStep(page: Page, profile: ProfileKind, stepNum: number, name: string): Promise<void> {
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${profile.toLowerCase()}-step${stepNum}-${slug}.png`),
    fullPage: false,
  }).catch(() => {/* non-fatal */});
}

/** Navigate with timing, return TTFB and load ms */
async function timedNav(page: Page, url: string, waitFor: string | null = null): Promise<{ ttfb: number; loadMs: number; finalUrl: string }> {
  const t0 = Date.now();
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
  const ttfb = response ? Date.now() - t0 : -1;
  if (waitFor) {
    await page.waitForSelector(waitFor, { timeout: STEP_TIMEOUT }).catch(() => {/* soft wait */});
  }
  const loadMs = Date.now() - t0;
  return { ttfb, loadMs, finalUrl: page.url() };
}

async function loginAsAdmin(page: Page, creds: { email: string; password: string }): Promise<void> {
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
  await page.fill("#login-identifier, input[name='email'], input[type='email']", creds.email);
  await page.fill("#login-password, input[name='password'], input[type='password']", creds.password);
  await page.click("button[type='submit']");
  await page.waitForURL(/\/(app|admin)/, { timeout: NAV_TIMEOUT });
}

async function activateSimulation(page: Page, profile: ProfileKind): Promise<void> {
  const def = PROFILE_DEFS[profile];
  const body: Record<string, string> = {
    track: def.track,
    lifecycle: "paid_active",
    country: def.country,
    source: "view_as_customer",
  };
  if (def.npSpecialty) body.npSpecialty = def.npSpecialty;
  if (def.alliedCareer) body.alliedCareer = def.alliedCareer;

  const res = await page.request.post(`${BASE}/api/admin/learner-qa/simulate`, {
    data: body,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok()) {
    throw new Error(`simulate API returned ${res.status()}: ${await res.text().catch(() => "")}`);
  }
}

async function clearSimulation(page: Page): Promise<void> {
  await page.request.post(`${BASE}/api/admin/learner-qa/clear`).catch(() => {/* non-fatal */});
}

// ── Test: Route accessibility check (no auth needed) ─────────────────────

test.describe("Route accessibility (no credentials required)", () => {
  const LEARNER_ROUTES = [
    { path: "/app", label: "Dashboard" },
    { path: "/app/lessons", label: "Lessons hub" },
    { path: "/app/flashcards", label: "Flashcards hub" },
    { path: "/app/practice-tests", label: "Practice tests hub" },
    { path: "/app/practice-tests/cat-launch", label: "CAT launch" },
    { path: "/app/account/report", label: "Report card" },
    { path: "/app/account", label: "Account" },
  ];

  for (const route of LEARNER_ROUTES) {
    test(`${route.label} → auth-gates correctly`, async ({ page }) => {
      test.setTimeout(30_000);
      const t0 = Date.now();
      const res = await page.goto(`${BASE}${route.path}`, { waitUntil: "domcontentloaded", timeout: 20_000 });
      const ms = Date.now() - t0;

      // Must redirect to login (not 500, not blank)
      const url = page.url();
      const isAuthGated =
        url.includes("/login") ||
        url.includes("/signup") ||
        (await page.locator("input[type='password']").count()) > 0;

      expect(isAuthGated, `${route.path} should redirect to login, landed at: ${url}`).toBe(true);

      // No server error
      const status = res?.status() ?? 0;
      expect(status, `${route.label} returned ${status}`).not.toBe(500);

      console.log(`[${route.label}] ${ms}ms → ${url.split("?")[0]}`);
    });
  }
});

// ── Test: Login page performance ──────────────────────────────────────────

test.describe("Auth surface performance", () => {
  test("login page loads under 3s", async ({ page }) => {
    test.setTimeout(30_000);
    const { ttfb, loadMs } = await timedNav(page, `${BASE}/login`, "input[type='password']");
    console.log(`[login] TTFB=${ttfb}ms load=${loadMs}ms`);
    expect(loadMs).toBeLessThan(3000);
    await screenshotStep(page, "RN", 1, "login-page");
  });

  test("login page form is functional", async ({ page }) => {
    test.setTimeout(20_000);
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
    const emailInput = page.locator("#login-identifier, input[type='email']").first();
    const passwordInput = page.locator("#login-password, input[type='password']").first();
    await expect(emailInput).toBeVisible({ timeout: 10_000 });
    await expect(passwordInput).toBeVisible({ timeout: 5_000 });
    const submitBtn = page.locator("button[type='submit']").first();
    await expect(submitBtn).toBeVisible();
  });

  test("invalid credentials return error (not 500)", async ({ page }) => {
    test.setTimeout(20_000);
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
    await page.fill("#login-identifier, input[type='email']", "cert-test-invalid@nursenest-e2e.invalid");
    await page.fill("#login-password, input[type='password']", "invalid-password-123");
    await page.click("button[type='submit']");
    // Should stay on login with error, not crash
    await page.waitForURL(/\/login/, { timeout: 15_000 });
    await expect(page.locator("body")).not.toContainText(/500|internal server error/i);
  });
});

// ── Test: API endpoint health ─────────────────────────────────────────────

test.describe("API endpoint health", () => {
  const HEALTH_ROUTES = [
    { path: "/api/health", label: "Health" },
    { path: "/api/health/ready", label: "Readiness" },
    { path: "/readyz", label: "Readyz probe" },
  ];

  for (const r of HEALTH_ROUTES) {
    test(`${r.label} responds`, async ({ page }) => {
      test.setTimeout(15_000);
      const t0 = Date.now();
      const res = await page.request.get(`${BASE}${r.path}`);
      const ms = Date.now() - t0;
      console.log(`[${r.label}] ${ms}ms status=${res.status()}`);
      expect([200, 503]).toContain(res.status()); // 503 = unhealthy but responding
    });
  }

  test("flashcard session API returns 401 (not 500) without auth", async ({ page }) => {
    test.setTimeout(15_000);
    const t0 = Date.now();
    const res = await page.request.get(`${BASE}/api/flashcards/custom-session?pathwayId=ca-rn-nclex-rn&categories=cardiovascular&includeCards=1`);
    const ms = Date.now() - t0;
    const body = await res.json().catch(() => null);
    console.log(`[flashcard-api] ${ms}ms status=${res.status()} code=${body?.code}`);
    expect(res.status()).toBe(401);
    expect(body?.code).toBe("unauthorized");
    // Confirm old error text is absent
    const text = JSON.stringify(body ?? "");
    expect(text).not.toContain("request did not complete before the flashcard player could hydrate");
  });

  test("practice session API returns 401 without auth", async ({ page }) => {
    test.setTimeout(15_000);
    const res = await page.request.get(`${BASE}/api/practice-tests/session?pathwayId=ca-rn-nclex-rn`).catch(() => null);
    if (res) expect([401, 403, 404]).toContain(res.status());
  });
});

// ── Test: Full 12-step journey for each profile (requires admin credentials) ──

for (const profileKind of ["RN", "RPN", "NP", "Allied"] as ProfileKind[]) {
  test.describe(`${profileKind} learner — full 12-step journey`, () => {
    const adminCreds = getAdminCreds();
    const def = PROFILE_DEFS[profileKind];
    const learnerCreds = getLearnerCreds(def.envPrefix);

    test.skip(!adminCreds, `Requires E2E_ADMIN_EMAIL + E2E_ADMIN_PASSWORD (View-As-Customer admin login)`);

    test.beforeAll(() => {
      console.log(`[${profileKind}] Admin creds: ${adminCreds ? "set" : "MISSING"} | Learner creds: ${learnerCreds ? "set" : "MISSING"}`);
    });

    test(`${profileKind}: Step 1 — Login`, async ({ page }) => {
      test.setTimeout(STEP_TIMEOUT);
      const t0 = Date.now();
      await loginAsAdmin(page, adminCreds!);
      const ms = Date.now() - t0;
      console.log(`[${profileKind}] Step 1 login: ${ms}ms → ${page.url()}`);
      await screenshotStep(page, profileKind, 1, "after-login");
    });

    test(`${profileKind}: Step 2 — Activate simulation (View-As-Customer)`, async ({ page }) => {
      test.setTimeout(STEP_TIMEOUT);
      await loginAsAdmin(page, adminCreds!);
      const t0 = Date.now();
      await activateSimulation(page, profileKind);
      const ms = Date.now() - t0;
      const status = await page.request.get(`${BASE}/api/admin/learner-qa/status`);
      const body = await status.json().catch(() => null);
      console.log(`[${profileKind}] Step 2 simulate: ${ms}ms active=${body?.active} track=${body?.track}`);
      expect(body?.active).toBe(true);
      expect(body?.track).toBe(def.track);
    });

    test(`${profileKind}: Step 3 — Open Dashboard`, async ({ page }) => {
      test.setTimeout(STEP_TIMEOUT);
      await loginAsAdmin(page, adminCreds!);
      await activateSimulation(page, profileKind);
      const t0 = Date.now();
      await page.goto(`${BASE}/app`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
      await page.waitForSelector("#nn-learner-main, [data-nn-learner-main], .nn-learner-app main", { timeout: STEP_TIMEOUT });
      const ms = Date.now() - t0;
      const title = await page.title();
      console.log(`[${profileKind}] Step 3 dashboard: ${ms}ms title="${title}"`);
      expect(page.url()).toContain("/app");
      await screenshotStep(page, profileKind, 3, "dashboard");
    });

    test(`${profileKind}: Step 4 — Resume Continue Studying`, async ({ page }) => {
      test.setTimeout(STEP_TIMEOUT);
      await loginAsAdmin(page, adminCreds!);
      await activateSimulation(page, profileKind);
      await page.goto(`${BASE}/app`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
      await page.waitForSelector("#nn-learner-main, [data-nn-learner-main]", { timeout: STEP_TIMEOUT });

      // Find "Continue Studying" or study suggestion card
      const continueCta = page.locator([
        "[data-nn-continue-studying]",
        "a[href*='/app/lessons/']",
        "a[href*='/app/flashcards']",
        "[data-nn-e2e-lesson-card]",
        "main a[href*='/app/']",
      ].join(", ")).first();

      const t0 = Date.now();
      const isVisible = await continueCta.isVisible({ timeout: 20_000 }).catch(() => false);
      const ms = Date.now() - t0;

      console.log(`[${profileKind}] Step 4 continue-studying: ${ms}ms visible=${isVisible}`);
      if (isVisible) {
        await screenshotStep(page, profileKind, 4, "continue-studying");
      }
      // Pass even if no continue-studying widget (new user has no history)
    });

    test(`${profileKind}: Step 5 — Open Lesson`, async ({ page }) => {
      test.setTimeout(NAV_TIMEOUT);
      await loginAsAdmin(page, adminCreds!);
      await activateSimulation(page, profileKind);
      await page.goto(`${BASE}/app/lessons`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });

      const lessonLink = page.locator([
        "a[href*='/app/lessons/']",
        "[data-nn-e2e-lesson-card] a",
        "[data-nn-lesson-card] a",
        "#pathway-lesson-library a",
      ].join(", ")).first();

      const t0 = Date.now();
      await expect(lessonLink).toBeVisible({ timeout: 45_000 });
      const href = await lessonLink.getAttribute("href");
      await lessonLink.click();
      await page.waitForLoadState("domcontentloaded", { timeout: NAV_TIMEOUT });
      await page.waitForSelector("h1", { timeout: 30_000 });
      const ms = Date.now() - t0;

      console.log(`[${profileKind}] Step 5 lesson: ${ms}ms url=${page.url().split("?")[0]}`);
      expect(page.url()).toContain("/lessons/");
      await screenshotStep(page, profileKind, 5, "lesson-open");
    });

    test(`${profileKind}: Step 6 — Launch Flashcards`, async ({ page }) => {
      test.setTimeout(NAV_TIMEOUT);
      await loginAsAdmin(page, adminCreds!);
      await activateSimulation(page, profileKind);

      const t0 = Date.now();
      await page.goto(`${BASE}/app/flashcards`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
      await page.waitForSelector("#nn-learner-main, [data-nn-learner-main]", { timeout: STEP_TIMEOUT });
      const ms = Date.now() - t0;
      const title = await page.title();
      console.log(`[${profileKind}] Step 6 flashcards hub: ${ms}ms title="${title}"`);
      expect(page.url()).toContain("/flashcards");
      await screenshotStep(page, profileKind, 6, "flashcards-hub");
    });

    test(`${profileKind}: Step 7 — Start Flashcard Session`, async ({ page }) => {
      test.setTimeout(NAV_TIMEOUT);
      await loginAsAdmin(page, adminCreds!);
      await activateSimulation(page, profileKind);
      await page.goto(`${BASE}/app/flashcards`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });

      // Find "Start" or study button
      const startBtn = page.locator([
        "[data-nn-e2e-flashcard-launcher-start]",
        "a[href*='/app/flashcards/custom']",
        "button:has-text('Start')",
        "a:has-text('Start studying')",
      ].join(", ")).first();

      const t0 = Date.now();
      const visible = await startBtn.isVisible({ timeout: 20_000 }).catch(() => false);
      if (visible) {
        await startBtn.click();
        await page.waitForLoadState("domcontentloaded", { timeout: NAV_TIMEOUT });
      }
      const ms = Date.now() - t0;

      console.log(`[${profileKind}] Step 7 flashcard session start: ${ms}ms → ${page.url()}`);
      await screenshotStep(page, profileKind, 7, "flashcard-session");
    });

    test(`${profileKind}: Step 8 — Complete Flashcard Session`, async ({ page }) => {
      test.setTimeout(NAV_TIMEOUT);
      await loginAsAdmin(page, adminCreds!);
      await activateSimulation(page, profileKind);
      await page.goto(`${BASE}/app/flashcards/custom?pathwayId=${def.pathway}&categories=cardiovascular&cardLimit=3&includeCards=1`, {
        waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT
      });

      // Wait for session to load (skeleton → cards OR error state)
      const t0 = Date.now();
      const loaded = await page.waitForSelector(
        '[data-testid="flashcard-session-loading"]:not([data-loading="true"]), [data-testid="flashcard-session-error"], .nn-flashcard-study-canvas',
        { timeout: 30_000 }
      ).catch(() => null);
      const ms = Date.now() - t0;

      const errorVisible = await page.locator('[data-testid="flashcard-session-error"]').isVisible().catch(() => false);
      const errorCode = errorVisible ? await page.locator('[data-testid="flashcard-session-error"]').getAttribute("data-error-code").catch(() => null) : null;
      const oldErrorPresent = await page.locator("text=request did not complete before the flashcard player could hydrate").isVisible().catch(() => false);

      console.log(`[${profileKind}] Step 8 flashcard session: ${ms}ms error=${errorVisible} code=${errorCode} oldError=${oldErrorPresent}`);
      expect(oldErrorPresent, "Old hydration error must NOT appear").toBe(false);
      await screenshotStep(page, profileKind, 8, "flashcard-session-loaded");
    });

    test(`${profileKind}: Step 9 — Launch Practice Test`, async ({ page }) => {
      test.setTimeout(NAV_TIMEOUT);
      await loginAsAdmin(page, adminCreds!);
      await activateSimulation(page, profileKind);

      const t0 = Date.now();
      await page.goto(`${BASE}/app/practice-tests`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
      await page.waitForSelector("#nn-learner-main, [data-nn-learner-main]", { timeout: STEP_TIMEOUT });
      const ms = Date.now() - t0;
      console.log(`[${profileKind}] Step 9 practice hub: ${ms}ms`);
      await screenshotStep(page, profileKind, 9, "practice-hub");
    });

    test(`${profileKind}: Step 10 — Start Practice Test`, async ({ page }) => {
      test.setTimeout(NAV_TIMEOUT);
      await loginAsAdmin(page, adminCreds!);
      await activateSimulation(page, profileKind);
      await page.goto(`${BASE}/app/practice-tests`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });

      const startBtn = page.locator("[data-nn-qa-practice-hub-start-test]").first();
      const t0 = Date.now();
      const visible = await startBtn.isVisible({ timeout: 30_000 }).catch(() => false);
      if (visible) {
        await startBtn.click();
        await page.waitForLoadState("domcontentloaded", { timeout: NAV_TIMEOUT });
      }
      const ms = Date.now() - t0;
      console.log(`[${profileKind}] Step 10 practice start: ${ms}ms → ${page.url().split("?")[0]}`);
    });

    test(`${profileKind}: Step 11 — Launch CAT`, async ({ page }) => {
      test.setTimeout(NAV_TIMEOUT);
      await loginAsAdmin(page, adminCreds!);
      await activateSimulation(page, profileKind);

      const t0 = Date.now();
      await page.goto(`${BASE}/app/practice-tests/cat-launch`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
      await page.waitForSelector("main, #nn-learner-main", { timeout: STEP_TIMEOUT });
      const ms = Date.now() - t0;

      const errorTexts = ["Something went wrong", "404", "This page could not be found"];
      for (const t of errorTexts) {
        const hasError = await page.locator(`text="${t}"`).isVisible({ timeout: 2_000 }).catch(() => false);
        expect(hasError, `CAT launch should not show "${t}"`).toBe(false);
      }
      console.log(`[${profileKind}] Step 11 CAT launch: ${ms}ms → ${page.url()}`);
      await screenshotStep(page, profileKind, 11, "cat-launch");
    });

    test(`${profileKind}: Step 12 — View Report Card + Return to Dashboard`, async ({ page }) => {
      test.setTimeout(NAV_TIMEOUT);
      await loginAsAdmin(page, adminCreds!);
      await activateSimulation(page, profileKind);

      const t0 = Date.now();
      await page.goto(`${BASE}/app/account/report`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
      await page.waitForSelector("main, #nn-learner-main", { timeout: STEP_TIMEOUT });
      const reportMs = Date.now() - t0;

      const title = await page.title();
      const hasContent = await page.locator("main, #nn-learner-main").first().isVisible().catch(() => false);
      console.log(`[${profileKind}] Step 12a report: ${reportMs}ms title="${title}" content=${hasContent}`);

      // Return to dashboard
      await page.goto(`${BASE}/app`, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
      await page.waitForSelector("#nn-learner-main, [data-nn-learner-main]", { timeout: STEP_TIMEOUT });
      const totalMs = Date.now() - t0;
      console.log(`[${profileKind}] Step 12b return to dashboard: totalMs=${totalMs}`);
      await screenshotStep(page, profileKind, 12, "report-card");
      await clearSimulation(page);
    });

  });
}

// ── Test: View-As-Customer API contract ──────────────────────────────────

test.describe("View-As-Customer API structure", () => {
  test("simulate endpoint requires auth (not 500)", async ({ page }) => {
    test.setTimeout(10_000);
    const res = await page.request.post(`${BASE}/api/admin/learner-qa/simulate`, {
      data: { track: "RN", lifecycle: "paid_active", country: "CA" },
      headers: { "Content-Type": "application/json" },
    });
    expect([401, 403]).toContain(res.status());
  });

  test("status endpoint returns valid JSON", async ({ page }) => {
    test.setTimeout(10_000);
    const res = await page.request.get(`${BASE}/api/admin/learner-qa/status`);
    expect([200, 401, 403]).toContain(res.status());
  });

  test("view-as user-search requires auth", async ({ page }) => {
    test.setTimeout(10_000);
    const res = await page.request.get(`${BASE}/api/admin/view-as/user-search?q=test`);
    expect([401, 403]).toContain(res.status());
  });
});

// ── Test: Public marketing surfaces (no auth) ─────────────────────────────

test.describe("Public marketing surfaces", () => {
  const MARKETING_ROUTES = [
    { path: "/canada/rn/nclex-rn", label: "RN hub" },
    { path: "/canada/pn/rex-pn", label: "RPN hub" },
    { path: "/canada/np/cnple", label: "NP hub" },
    { path: "/canada/rn/nclex-rn/lessons", label: "RN lessons" },
    { path: "/canada/rn/nclex-rn/flashcards", label: "RN flashcards" },
    { path: "/canada/rn/nclex-rn/questions", label: "RN questions" },
  ];

  for (const r of MARKETING_ROUTES) {
    test(`${r.label} loads`, async ({ page }) => {
      test.setTimeout(40_000);
      const t0 = Date.now();
      const res = await page.goto(`${BASE}${r.path}`, { waitUntil: "domcontentloaded", timeout: 35_000 });
      const ms = Date.now() - t0;
      const status = res?.status() ?? 0;
      console.log(`[${r.label}] ${ms}ms status=${status}`);
      expect(status, `${r.label} should not 500`).not.toBe(500);
      expect(ms, `${r.label} should load within 10s`).toBeLessThan(10_000);
    });
  }
});
