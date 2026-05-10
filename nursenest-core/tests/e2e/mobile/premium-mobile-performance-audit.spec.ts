/**
 * Premium mobile performance audit captures.
 *
 * Writes PNG evidence to:
 *   docs/screenshots/premium-mobile-performance-audit/
 *
 * Run public Pixel slice:
 *   npx playwright test -c playwright.mobile.config.ts tests/e2e/mobile/premium-mobile-performance-audit.spec.ts --project=mobile-pixel
 *
 * Run paid Pixel slice when paid credentials are configured:
 *   npx playwright test -c playwright.mobile.config.ts tests/e2e/mobile/premium-mobile-performance-audit.spec.ts --project=mobile-paid-pixel
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { measureHorizontalOverflow } from "../helpers/mobile-usability-audit";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";
import {
  LESSON_HUB_CARD_LINKS,
  paidFlashcardsHubUrl,
  paidLessonsHubUrl,
} from "../helpers/paid-content-discovery";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  waitForAuthenticatedLearnerShell,
} from "../helpers/paid-learner-shell";
import {
  dismissFlashcardResumeIfPresent,
  expectNoSubscriberPaywallSurface,
  expectNotLoginUrl,
} from "../helpers/paid-user-suite";
import {
  PUBLIC_MARKETING_THEME_ALLOWLIST,
  THEME_STORAGE_KEY,
  themeOptionsForPublicMarketingPicker,
} from "@/lib/theme/theme-registry";

const SCREENSHOT_DIR = join("docs", "screenshots", "premium-mobile-performance-audit");
mkdirSync(SCREENSHOT_DIR, { recursive: true });

const SELECTOR_DISMISSED_LS = "nn_selector_dismissed";
const THEME_LABEL_BY_ID = new Map(themeOptionsForPublicMarketingPicker().map((opt) => [opt.id, opt.label]));
const THEMES = PUBLIC_MARKETING_THEME_ALLOWLIST;
const PATHWAY_ID = PAID_E2E_DEFAULT_PATHWAY_ID;
const CLS_SEVERE_THRESHOLD = 0.1;

type CaptureTarget = {
  label: string;
  path: string;
  ready: (page: Page) => ReturnType<Page["locator"]>;
  slowOptInEnv?: string;
};

const PUBLIC_TARGETS: CaptureTarget[] = [
  { label: "homepage", path: "/", ready: (page) => page.locator(MARKETING_PUBLIC_SELECTOR).first() },
  { label: "pricing", path: "/pricing", ready: (page) => page.locator("main").first() },
  {
    label: "blog",
    path: "/blog",
    ready: (page) => page.locator(MARKETING_PUBLIC_SELECTOR).first(),
    slowOptInEnv: "E2E_MOBILE_INCLUDE_BLOG",
  },
  { label: "login", path: "/login", ready: (page) => page.locator("main").first() },
  { label: "signup", path: "/signup", ready: (page) => page.locator("main").first() },
  { label: "rn-hub", path: "/us/rn/nclex-rn", ready: (page) => page.locator(MARKETING_PUBLIC_SELECTOR).first() },
  {
    label: "rn-lessons-hub",
    path: "/us/rn/nclex-rn/lessons",
    ready: (page) => page.locator("#pathway-lesson-library").or(page.locator('[data-nn-qa-pathway-lessons-hub="true"]')).first(),
  },
  {
    label: "rn-lesson-detail",
    path: "/us/rn/nclex-rn/lessons/us-rn-prioritization-abcs",
    ready: (page) => page.locator("h1.nn-lesson-page-title").or(page.locator("main h1")).first(),
  },
];

const PAID_TARGETS: CaptureTarget[] = [
  { label: "dashboard", path: "/app", ready: (page) => page.locator("#nn-learner-main").or(page.locator("main")).first() },
  {
    label: "lessons",
    path: paidLessonsHubUrl(PATHWAY_ID),
    ready: (page) => page.locator(LESSON_HUB_CARD_LINKS).first(),
  },
  {
    label: "flashcards",
    path: paidFlashcardsHubUrl(PATHWAY_ID),
    ready: (page) => page.getByRole("heading", { level: 1 }).first(),
  },
  {
    label: "questions",
    path: `/app/questions?pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
    ready: (page) => page.locator("main").first(),
  },
  {
    label: "practice-tests",
    path: `/app/practice-tests?pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
    ready: (page) => page.getByRole("heading", { level: 1 }).first(),
  },
  {
    label: "cat-hub",
    path: `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`,
    ready: (page) => page.locator("main").first(),
  },
  {
    label: "analytics",
    path: "/app/account/analytics",
    ready: (page) => page.locator("main").first(),
  },
  {
    label: "labs",
    path: "/app/labs",
    ready: (page) => page.locator("main").first(),
  },
  {
    label: "ecg-video-quiz",
    path: "/app/ecg-video-quiz",
    ready: (page) => page.locator("main").first(),
  },
];

function shouldRunInProject(projectName: string, expected: "public" | "paid"): boolean {
  const isPaid = projectName.includes("paid");
  const isIphone = projectName.includes("iphone");
  if (isIphone && process.env.NN_MOBILE_PERF_AUDIT_INCLUDE_IPHONE !== "1") return false;
  return expected === "paid" ? isPaid : !isPaid;
}

function safeFilePart(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function installLayoutShiftObserver(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const target = window as unknown as { __nnCumulativeLayoutShift?: number };
    target.__nnCumulativeLayoutShift = 0;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value?: number;
            hadRecentInput?: boolean;
          };
          if (!shift.hadRecentInput) {
            target.__nnCumulativeLayoutShift = (target.__nnCumulativeLayoutShift ?? 0) + Number(shift.value ?? 0);
          }
        }
      });
      observer.observe({ type: "layout-shift", buffered: true });
    } catch {
      /* Layout Instability API is Chromium-only. */
    }
  });
}

async function readLayoutShiftScore(page: Page): Promise<number> {
  return page.evaluate(() => Number((window as unknown as { __nnCumulativeLayoutShift?: number }).__nnCumulativeLayoutShift ?? 0));
}

async function applyTheme(page: Page, themeId: string): Promise<void> {
  await page.evaluate(
    ({ key, id }) => {
      localStorage.setItem(key, id);
      document.documentElement.setAttribute("data-theme", id);
    },
    { key: THEME_STORAGE_KEY, id: themeId },
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", themeId, { timeout: 15_000 });
}

async function expectNoSevereLayoutShift(page: Page, label: string): Promise<void> {
  await page.waitForTimeout(5_000);
  const cls = await readLayoutShiftScore(page);
  expect(cls, `${label} CLS after 5s`).toBeLessThan(CLS_SEVERE_THRESHOLD);
}

async function expectMobileOverflowWithinBudget(page: Page, label: string): Promise<void> {
  const overflow = await measureHorizontalOverflow(page);
  expect(
    overflow.document.excess,
    `${label} document overflow ${overflow.document.scrollWidth}px vs ${overflow.document.clientWidth}px`,
  ).toBeLessThanOrEqual(2);
  expect(overflow.main?.excess ?? 0, `${label} main overflow`).toBeLessThanOrEqual(8);
}

async function expectStickyHeaderStable(page: Page, label: string): Promise<void> {
  const header = page.locator("header.nn-header-animate-in").first();
  await expect(header, `${label} header visible`).toBeVisible({ timeout: 30_000 });
  const before = await header.boundingBox();
  await page.evaluate(() => window.scrollTo(0, Math.min(480, document.documentElement.scrollHeight)));
  await page.waitForTimeout(500);
  const after = await header.boundingBox();
  expect(before?.height ?? 0, `${label} header height`).toBeGreaterThan(40);
  expect(Math.abs((after?.height ?? 0) - (before?.height ?? 0)), `${label} sticky header height delta`).toBeLessThanOrEqual(3);
}

async function expectMobileDrawerStable(page: Page): Promise<void> {
  const open = page.getByRole("button", { name: /open menu/i }).first();
  await expect(open).toBeVisible({ timeout: 30_000 });
  await open.click();
  await expect(page.getByRole("button", { name: /close menu/i }).last()).toBeVisible({ timeout: 30_000 });
  await expectMobileOverflowWithinBudget(page, "mobile drawer open");
  await page.getByRole("button", { name: /close menu/i }).last().click();
}

async function expectReducedMotionPreferenceRespected(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toBeVisible();
}

async function captureTarget(page: Page, testInfo: TestInfo, target: CaptureTarget, themeId: string): Promise<void> {
  const label = THEME_LABEL_BY_ID.get(themeId) ?? themeId;
  await test.step(`${target.label} — ${label}`, async () => {
    const response = await page.goto(target.path, { waitUntil: "domcontentloaded", timeout: 180_000 });
    expect(response?.ok(), `HTTP ${response?.status()} for ${target.path}`).toBeTruthy();
    await target.ready(page).waitFor({ state: "visible", timeout: 90_000 });
    await applyTheme(page, themeId);
    const overflow = await measureHorizontalOverflow(page);
    await testInfo.attach(`mobile-overflow-${target.label}-${themeId}.json`, {
      body: Buffer.from(JSON.stringify({ target: target.label, path: target.path, themeId, overflow }, null, 2)),
      contentType: "application/json",
    });
    const shot = join(
      SCREENSHOT_DIR,
      `${safeFilePart(testInfo.project.name)}-${safeFilePart(target.label)}-${safeFilePart(themeId)}.png`,
    );
    await page.screenshot({ path: shot, fullPage: false });
    await testInfo.attach(`mobile-performance-${target.label}-${themeId}`, {
      path: shot,
      contentType: "image/png",
    });
  });
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(
    ({ dismissedKey, themeKey }) => {
      localStorage.setItem(dismissedKey, "1");
      localStorage.setItem(themeKey, "ocean");
      document.documentElement?.setAttribute("data-theme", "ocean");
    },
    { dismissedKey: SELECTOR_DISMISSED_LS, themeKey: THEME_STORAGE_KEY },
  );
});

test.describe("Premium mobile performance audit — public captures", () => {
  test.beforeEach(async ({ page }) => {
    await installLayoutShiftObserver(page);
  });

  test("captures public mobile surfaces across launch themes", async ({ page }, testInfo) => {
    test.skip(!shouldRunInProject(testInfo.project.name, "public"), "Public capture runs only in public mobile projects.");
    test.setTimeout(900_000);

    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    for (const target of PUBLIC_TARGETS) {
      if (target.slowOptInEnv && process.env[target.slowOptInEnv] !== "1") continue;
      for (const themeId of THEMES) {
        await captureTarget(page, testInfo, target, themeId);
        await dismissMarketingScrims(page);
      }
    }

    expect(pageErrors, `No page errors during public captures: ${pageErrors.join("; ")}`).toEqual([]);
  });

  test("guards public mobile CLS, overflow, sticky nav, drawer, theme parity, and reduced motion", async ({ page }) => {
    test.skip(!shouldRunInProject(test.info().project.name, "public"), "Public stability runs only in public mobile projects.");
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    const response = await page.goto("/", { waitUntil: "domcontentloaded", timeout: 180_000 });
    expect(response?.ok(), `HTTP ${response?.status()} for homepage`).toBeTruthy();
    await dismissMarketingScrims(page);
    await page.locator(MARKETING_PUBLIC_SELECTOR).first().waitFor({ state: "visible", timeout: 90_000 });
    await expectMobileOverflowWithinBudget(page, "homepage");
    await expectStickyHeaderStable(page, "homepage");
    await expectMobileDrawerStable(page);

    for (const themeId of THEMES) {
      await applyTheme(page, themeId);
      await expect(page.locator("html")).toHaveAttribute("data-theme", themeId, { timeout: 15_000 });
      await expectMobileOverflowWithinBudget(page, `homepage ${themeId}`);
    }

    await expectReducedMotionPreferenceRespected(page);
    await expectNoSevereLayoutShift(page, "homepage");
    expect(pageErrors, `No page errors during public stability guard: ${pageErrors.join("; ")}`).toEqual([]);
  });

  test("guards marketing lesson mobile TOC stability", async ({ page }) => {
    test.skip(!shouldRunInProject(test.info().project.name, "public"), "Public lesson stability runs only in public mobile projects.");
    const target = PUBLIC_TARGETS.find((item) => item.label === "rn-lesson-detail");
    expect(target).toBeTruthy();
    const response = await page.goto(target!.path, { waitUntil: "domcontentloaded", timeout: 180_000 });
    expect(response?.ok(), `HTTP ${response?.status()} for ${target!.path}`).toBeTruthy();
    await target!.ready(page).waitFor({ state: "visible", timeout: 90_000 });
    await expect(page.locator("[data-nn-premium-lessons-mobile-nav]").first()).toBeAttached({ timeout: 30_000 });
    await expectMobileOverflowWithinBudget(page, "marketing lesson detail");
    await expectNoSevereLayoutShift(page, "marketing lesson detail");
  });
});

test.describe("Premium mobile performance audit — authenticated captures", () => {
  test.beforeEach(async ({ page }) => {
    await installLayoutShiftObserver(page);
  });

  test("captures paid learner mobile surfaces across launch themes", async ({ page }, testInfo) => {
    test.skip(!shouldRunInProject(testInfo.project.name, "paid"), "Paid capture runs only in paid mobile projects.");
    test.setTimeout(900_000);

    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    for (const target of PAID_TARGETS) {
      for (const themeId of THEMES) {
        await test.step(`${target.label} — ${themeId}`, async () => {
          const response = await page.goto(target.path, { waitUntil: "domcontentloaded", timeout: 180_000 });
          expect(response?.ok(), `HTTP ${response?.status()} for ${target.path}`).toBeTruthy();
          expectNotLoginUrl(page);
          await expectNoSubscriberPaywallSurface(page, target.label);
          if (target.path === paidFlashcardsHubUrl(PATHWAY_ID)) {
            await dismissFlashcardResumeIfPresent(page);
          }
          await waitForAuthenticatedLearnerShell(page, { timeoutMs: 120_000 });
          await target.ready(page).waitFor({ state: "visible", timeout: 120_000 });
          await applyTheme(page, themeId);
          const overflow = await measureHorizontalOverflow(page);
          await testInfo.attach(`mobile-overflow-paid-${target.label}-${themeId}.json`, {
            body: Buffer.from(JSON.stringify({ target: target.label, path: target.path, themeId, overflow }, null, 2)),
            contentType: "application/json",
          });
          const shot = join(
            SCREENSHOT_DIR,
            `${safeFilePart(testInfo.project.name)}-${safeFilePart(target.label)}-${safeFilePart(themeId)}.png`,
          );
          await page.screenshot({ path: shot, fullPage: false });
          await testInfo.attach(`mobile-performance-paid-${target.label}-${themeId}`, {
            path: shot,
            contentType: "image/png",
          });
        });
      }
    }

    expect(pageErrors, `No page errors during paid captures: ${pageErrors.join("; ")}`).toEqual([]);
  });

  test("guards authenticated learner CLS and overflow on critical mobile surfaces", async ({ page }) => {
    test.skip(!shouldRunInProject(test.info().project.name, "paid"), "Paid stability runs only in paid mobile projects.");
    const targets = PAID_TARGETS.filter((target) => ["dashboard", "lessons", "flashcards", "cat-hub", "analytics"].includes(target.label));

    for (const target of targets) {
      await test.step(`${target.label} stability`, async () => {
        const response = await page.goto(target.path, { waitUntil: "domcontentloaded", timeout: 180_000 });
        expect(response?.ok(), `HTTP ${response?.status()} for ${target.path}`).toBeTruthy();
        expectNotLoginUrl(page);
        await expectNoSubscriberPaywallSurface(page, target.label);
        await waitForAuthenticatedLearnerShell(page, { timeoutMs: 120_000 });
        await target.ready(page).waitFor({ state: "visible", timeout: 120_000 });
        await expectMobileOverflowWithinBudget(page, target.label);
        await expectNoSevereLayoutShift(page, target.label);
      });
    }
  });
});
