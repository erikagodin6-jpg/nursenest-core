/**
 * Allied Health marketing hubs — URL discovery from registry, premium zone stability,
 * no ECG QA marker, no NCLEX NGN copy, no /admin leakage in the public premium grid.
 *
 * Run from app package:
 *   cd nursenest-core && npx playwright test tests/e2e/public/allied-health-hubs.spec.ts
 *
 * Screenshots (optional artifact): nursenest-core/docs/screenshots/allied-health-e2e/
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";
import { buildAlliedGlobalHubPath } from "@/lib/allied/allied-global-hub-path";
import {
  ALLIED_PROFESSION_KEYS,
  getAlliedProfessionByProfessionKey,
} from "@/lib/allied/allied-professions-registry";
import { withAlliedProfessionMarketingQuery } from "@/lib/lessons/lesson-routes";
import { alliedHubCatSurfaceUnlocked } from "@/lib/marketing/allied-hub-premium-module-policy";
import {
  assertDocumentNoHorizontalOverflow,
  assertElementNoHorizontalOverflow,
} from "../helpers/visual-layout-assertions";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(HERE, "..", "..", "..");
const SCREENSHOT_DIR = join(PKG_ROOT, "docs", "screenshots", "allied-health-e2e");

const PREMIUM = '[data-nn-qa-pathway-premium-modules=""]';

/** Representative occupations for visual QA (desktop + mobile × themes). */
const SCREENSHOT_PROFESSION_KEYS = [
  "mlt",
  "paramedic",
  "respiratory",
  "psw-hca",
  "social-work",
  "psychotherapy",
  "occupational-therapy",
  "physiotherapy",
] as const;

async function setMarketingTheme(page: Page, theme: "ocean" | "midnight" | "blossom") {
  if (theme === "ocean") {
    await page.evaluate(() => document.documentElement.removeAttribute("data-theme"));
    return;
  }
  await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
}

/** Console patterns ignored for benign third-party / hydration noise (tune per env). */
function isBenignConsoleMessage(text: string): boolean {
  const t = text.toLowerCase();
  if (t.includes("favicon")) return true;
  if (t.includes("ResizeObserver loop")) return true;
  return false;
}

function hubUrls(): string[] {
  const bases = ["/allied/allied-health", "/us/allied/allied-health"];
  const careers = ALLIED_PROFESSION_KEYS.map((k) => `/allied/${encodeURIComponent(k)}`);
  return [...bases, ...careers];
}

async function expectHttpOkNoServerError(page: Page, origin: string, path: string) {
  const res = await page.request.get(`${origin}${path}`);
  const st = res.status();
  expect(st, `${path} status`).toBeLessThan(500);
  expect(st, `${path} not 503`).not.toBe(503);
  expect(st, `${path} not 504`).not.toBe(504);
}

test.describe("Allied Health hubs (registry-driven)", () => {
  test.beforeAll(() => {
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  for (const path of hubUrls()) {
    test(`HTTP 200 + premium zone — ${path}`, async ({ page, baseURL }) => {
      test.skip(!baseURL, "BASE_URL required");

      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const t = msg.text();
          if (!isBenignConsoleMessage(t)) errors.push(t);
        }
      });

      const res = await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
      expect(res?.status(), `status for ${path}`).toBeLessThan(400);

      const zone = page.locator(PREMIUM);
      await expect(zone).toBeVisible({ timeout: 90_000 });

      await expect(zone.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(0);
      await expect(zone).not.toContainText(/NGN/i);

      const zoneHtml = await zone.innerHTML();
      expect(zoneHtml.toLowerCase().includes("/admin")).toBe(false);

      await expect(page.getByRole("heading", { name: /^Study tools$/i })).toBeVisible();

      await assertDocumentNoHorizontalOverflow(page);
      await assertElementNoHorizontalOverflow(page, PREMIUM);

      await page.waitForTimeout(5000);
      await expect(zone).toBeVisible();

      expect(errors, `console errors for ${path}`).toEqual([]);
    });
  }

  test("desktop + mobile viewports — global hub", async ({ page, baseURL }) => {
    test.skip(!baseURL, "BASE_URL required");
    const path = "/allied/allied-health";
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await expect(page.locator(PREMIUM)).toBeVisible({ timeout: 90_000 });
    await assertDocumentNoHorizontalOverflow(page);
    await assertElementNoHorizontalOverflow(page, PREMIUM);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "allied-hub-desktop-ocean.png"), fullPage: false });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
    await expect(page.locator(PREMIUM)).toBeVisible({ timeout: 90_000 });
    await assertDocumentNoHorizontalOverflow(page);
    await assertElementNoHorizontalOverflow(page, PREMIUM);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "allied-hub-mobile-ocean.png"), fullPage: false });

    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "midnight"));
    await page.waitForTimeout(200);
    await page.screenshot({ path: join(SCREENSHOT_DIR, "allied-hub-mobile-midnight.png"), fullPage: false });
    await page.evaluate(() => document.documentElement.removeAttribute("data-theme"));
  });

  test.describe("Representative occupations — desktop + mobile, ocean + midnight + blossom", () => {
    for (const key of SCREENSHOT_PROFESSION_KEYS) {
      test(`screenshots — ${key}`, async ({ page, baseURL }) => {
        test.skip(!baseURL, "BASE_URL required");
        const path = `/allied/${encodeURIComponent(key)}`;

        await page.setViewportSize({ width: 1280, height: 900 });
        for (const theme of ["ocean", "midnight", "blossom"] as const) {
          await setMarketingTheme(page, theme);
          await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
          await expect(page.locator(PREMIUM)).toBeVisible({ timeout: 90_000 });
          await assertDocumentNoHorizontalOverflow(page);
          await assertElementNoHorizontalOverflow(page, PREMIUM);
          await page.screenshot({
            path: join(SCREENSHOT_DIR, `allied-${key}-desktop-${theme}.png`),
            fullPage: false,
          });
        }

        await page.setViewportSize({ width: 390, height: 844 });
        for (const theme of ["ocean", "midnight"] as const) {
          await setMarketingTheme(page, theme);
          await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
          await expect(page.locator(PREMIUM)).toBeVisible({ timeout: 90_000 });
          await assertDocumentNoHorizontalOverflow(page);
          await assertElementNoHorizontalOverflow(page, PREMIUM);
          await page.screenshot({
            path: join(SCREENSHOT_DIR, `allied-${key}-mobile-${theme}.png`),
            fullPage: false,
          });
        }
        await page.evaluate(() => document.documentElement.removeAttribute("data-theme"));
      });
    }
  });
});

test.describe("Allied occupation hubs — hero, premium single-root, sub-routes", () => {
  test.describe.configure({ mode: "serial", timeout: 900_000 });

  test("registry occupations: title, modules, no ECG/NGN/admin, lessons/questions/cat HTTP", async ({
    page,
    baseURL,
  }) => {
    test.skip(!baseURL, "BASE_URL required");
    const origin = baseURL.replace(/\/$/, "");
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const t = msg.text();
      if (isBenignConsoleMessage(t)) return;
      consoleErrors.push(t);
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    for (const key of ALLIED_PROFESSION_KEYS) {
      const prof = getAlliedProfessionByProfessionKey(key);
      expect(prof, `profession ${key}`).toBeTruthy();
      const path = `/allied/${encodeURIComponent(key)}`;
      const res = await page.goto(`${origin}${path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
      expect(res?.status(), `status ${path}`).toBeLessThan(400);

      await expect(page.locator("#allied-pathway-hub-hero-title")).toBeVisible({ timeout: 90_000 });
      const h1 = prof!.h1.trim();
      const anchor = h1
        .replace(/,/g, " ")
        .split(/\s+/)
        .find((w) => w.length > 1) ?? h1;
      await expect(page.locator("#allied-pathway-hub-hero-title")).toContainText(anchor);

      const zone = page.locator(PREMIUM);
      await expect(zone).toBeVisible({ timeout: 90_000 });
      await expect(zone).toHaveCount(1);
      await expect(zone.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(0);
      await expect(zone).not.toContainText(/NGN/i);
      const zoneHtml = (await zone.innerHTML()).toLowerCase();
      expect(zoneHtml.includes("/admin"), `${key}: no admin in premium html`).toBe(false);

      const premiumHrefs = await zone.locator("a[href]").evaluateAll((els) =>
        els.map((e) => (e as HTMLAnchorElement).getAttribute("href") ?? ""),
      );
      for (const h of premiumHrefs) {
        expect((h ?? "").toLowerCase().includes("/admin"), `${key} premium link ${h}`).toBe(false);
      }

      await assertDocumentNoHorizontalOverflow(page);
      await assertElementNoHorizontalOverflow(page, PREMIUM);

      if (alliedHubCatSurfaceUnlocked(key)) {
        await expect(page.locator(".nn-qa-allied-hub-cat-locked")).toHaveCount(0);
      } else {
        await expect(page.locator(".nn-qa-allied-hub-cat-locked")).toHaveCount(1);
      }

      const lessons = withAlliedProfessionMarketingQuery(buildAlliedGlobalHubPath("lessons"), key);
      const questions = withAlliedProfessionMarketingQuery(buildAlliedGlobalHubPath("questions"), key);
      const flashcards = withAlliedProfessionMarketingQuery(buildAlliedGlobalHubPath("flashcards"), key);
      const cat = withAlliedProfessionMarketingQuery(buildAlliedGlobalHubPath("cat"), key);
      await expectHttpOkNoServerError(page, origin, lessons);
      await expectHttpOkNoServerError(page, origin, questions);
      await expectHttpOkNoServerError(page, origin, flashcards);
      await expectHttpOkNoServerError(page, origin, cat);

      await page.waitForTimeout(5000);
      await expect(zone).toBeVisible();
    }

    expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  });
});

test.describe("Allied premium module matrix (occupation hubs)", () => {
  test("mlt, paramedic, psychotherapy, psw-hca — expected keys, CAT gate, no NP marker", async ({
    page,
    baseURL,
  }) => {
    test.skip(!baseURL, "BASE_URL required");
    const origin = baseURL.replace(/\/$/, "");
    const cases = [
      { slug: "mlt", expectPathwayCat: true },
      { slug: "paramedic", expectPathwayCat: true },
      { slug: "psychotherapy", expectPathwayCat: false },
      { slug: "psw-hca", expectPathwayCat: false },
    ] as const;

    for (const { slug, expectPathwayCat } of cases) {
      const res = await page.goto(`${origin}/allied/${encodeURIComponent(slug)}`, {
        waitUntil: "domcontentloaded",
        timeout: 120_000,
      });
      expect(res?.status(), `status /allied/${slug}`).toBeLessThan(400);

      const zone = page.locator(PREMIUM);
      await expect(zone).toBeVisible({ timeout: 90_000 });
      await expect(zone.locator('[data-nn-qa-hub-np-cases]')).toHaveCount(0);
      await expect(zone.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(0);
      await expect(zone).not.toContainText(/NGN/i);

      await expect(zone.locator('[data-nn-qa-hub-premium-module="skills_refresher"]')).toHaveCount(1);
      await expect(zone.locator('[data-nn-qa-hub-premium-module="clinical_cases"]')).toHaveCount(1);
      await expect(zone.locator('[data-nn-qa-hub-premium-module="allied_career_resources"]')).toHaveCount(1);
      await expect(zone.locator('[data-nn-qa-hub-premium-module="pathway_cat"]')).toHaveCount(
        expectPathwayCat ? 1 : 0,
      );
      expect(alliedHubCatSurfaceUnlocked(slug)).toBe(expectPathwayCat);
      await expect(page.locator(".nn-qa-allied-hub-cat-locked")).toHaveCount(expectPathwayCat ? 0 : 1);

      await assertDocumentNoHorizontalOverflow(page);
      await assertElementNoHorizontalOverflow(page, PREMIUM);

      if (slug === "psychotherapy") {
        const labs = zone.locator('[data-nn-qa-hub-premium-module="labs"] a').first();
        const href = await labs.getAttribute("href");
        expect(
          href === "/" || (href?.startsWith(`${origin}/login`) ?? false),
          "locked labs card uses public-safe href",
        ).toBeTruthy();
        expect((href ?? "").toLowerCase().includes("/admin")).toBe(false);
      }
    }
  });
});
