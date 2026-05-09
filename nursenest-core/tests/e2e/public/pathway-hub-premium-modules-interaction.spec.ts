/**
 * Pathway hub — premium module system (guest): rendering, tier gates, clicks, HTTP sanity, screenshots.
 *
 * ## Public routes exercised (marketing hubs)
 * - RN (US NCLEX-RN): `/us/rn/nclex-rn`
 * - RPN / REx-PN (CA): `/canada/pn/rex-pn`
 * - NP (US FNP): `/us/np/fnp`
 * - New Grad RN: `/us/rn/new-grad-transition`
 * - Pre-Nursing landing: `/pre-nursing` (quick study modes; no `ExamPathwayHubPremiumModules` grid)
 * - Allied Health (global): `/allied/allied-health`
 *
 * ## Tier / product checks (mirrors `pathwayAllowsEcgLinkedLearning` + NP-only clinical cases)
 * - ECG module marker `[data-nn-qa-hub-ecg]`: **present** on RN + NP hubs only.
 * - ECG: **absent** on RPN, New Grad, Allied, Pre-Nursing.
 * - NP clinical cases marker `[data-nn-qa-hub-np-cases]`: **present** on NP hub only.
 *
 * ## Run
 * `cd nursenest-core && npm run test:e2e:hub-modules`
 *
 * Screenshots: `test-results/hub-modules/` (override with `HUB_MODULES_SCREENSHOT_DIR`).
 * Theme buckets use `[data-theme]` on `<html>` (`ocean` = light family, `midnight` = dark).
 */
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";

import {
  gotoExpectOk,
  requireOrigin,
  seedCaMarketingCookie,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";

const PREMIUM_ROOT = '[data-nn-qa-pathway-premium-modules]';
const REACT_DEVTOOLS = /Download the React DevTools/i;
const HMR = /\[HMR\]|Fast Refresh/i;

const SCREENSHOT_DIR =
  process.env.HUB_MODULES_SCREENSHOT_DIR?.trim() || join(process.cwd(), "test-results/hub-modules");

/** Full pathway × viewport × theme capture — opt-in (`HUB_MODULES_FULL_VISUAL=1`) to limit CI runtime and renderer load. */
const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

const THEME_BUCKETS = [
  { name: "ocean", id: "ocean" as const },
  { name: "midnight", id: "midnight" as const },
];

function benignConsoleText(msg: string): boolean {
  if (REACT_DEVTOOLS.test(msg)) return true;
  if (HMR.test(msg)) return true;
  if (msg.includes("Failed to load resource")) return true;
  if (msg.includes("auth_noindex_path") && msg.includes("/login")) return true;
  if (msg.includes("pathway_lessons") && msg.includes("pathway_lesson_prisma")) return true;
  if (msg.includes("pathway_lessons") && msg.includes("hub_list_pipeline_stages")) return true;
  if (msg.includes("pathway_lessons") && msg.includes("hub_marketing_all_db_candidates_filtered_out")) {
    return true;
  }
  if (msg.includes("pathway_lessons") && msg.includes("hub_list_renderable_truncated_to_cap")) return true;
  if (msg.includes("exam_pathway_hub") && msg.includes("allied_hub_route_diagnostic")) return true;
  return false;
}

function attachPageDiagnostics(page: Page): { consoleErrors: string[]; failures: string[] } {
  const consoleErrors: string[] = [];
  const failures: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (benignConsoleText(text)) return;
    consoleErrors.push(text);
  });

  page.on("pageerror", (err) => {
    failures.push(err.message);
  });

  page.on("response", (res) => {
    const s = res.status();
    if (s >= 500 && s < 600 && res.request().resourceType() !== "websocket") {
      failures.push(`HTTP ${s} ${res.url()}`);
    }
  });

  return { consoleErrors, failures };
}

async function settlePage(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await expect
    .poll(async () => await page.locator(PREMIUM_ROOT).count(), { timeout: 120_000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(5000);
}

async function assertNoReactCrashOverlay(page: Page) {
  await expect(page.getByText("Unhandled Runtime Error").first()).toHaveCount(0);
  await expect(page.getByText("Application error").first()).toHaveCount(0);
}

async function assertNoForbiddenPublicLinks(page: Page, rootSelector: string) {
  const bad = await page.evaluate((sel) => {
    const root = document.querySelector(sel) ?? document.body;
    const anchors = Array.from(root.querySelectorAll('a[href*="admin"], a[href*="/staff"]'));
    return anchors.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? "");
  }, rootSelector);
  expect(bad, `unexpected admin/staff links in ${rootSelector}`).toEqual([]);
}

async function captureHubScreenshot(page: Page, basename: string) {
  await mkdir(SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({
    path: join(SCREENSHOT_DIR, `${basename}.png`),
    fullPage: true,
  });
}

async function applyThemeBucket(page: Page, themeId: string) {
  await page.evaluate((id) => {
    document.documentElement.setAttribute("data-theme", id);
  }, themeId);
}

/** Guest premium-module card should link via login callback when `wrapGuestWithLoginCallback` applies. */
async function clickGuestLoginModule(page: Page, moduleKey: string) {
  const row = page.locator(`[data-nn-qa-hub-premium-module="${moduleKey}"]`);
  await expect(row.locator("a.nn-exam-hub-study-card")).toBeVisible({ timeout: 60_000 });
  await row.locator("a.nn-exam-hub-study-card").first().click();
  await expect(page).toHaveURL(/\/login\?/, { timeout: 60_000 });
  expect(page.url()).toMatch(/callbackUrl=/);
}

async function expectHttpOkNoServerError(page: Page, path: string) {
  const res = await page.request.get(path);
  const st = res.status();
  expect(st, `${path} status`).toBeLessThan(500);
  expect(st, `${path} not 503`).not.toBe(503);
  expect(st, `${path} not 504`).not.toBe(504);
}

test.describe.configure({ mode: "serial", timeout: 600_000 });

test.describe("Pathway hub premium modules — interaction & gates (guest)", () => {
  test.beforeAll(async () => {
    await mkdir(SCREENSHOT_DIR, { recursive: true });
  });

  test("RN hub: ECG present, flashcards → login+callback, HTTP smoke, no admin links", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    const diag = attachPageDiagnostics(page);
    await seedUsMarketingCookie(page, origin);

    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await settlePage(page);
    await assertNoReactCrashOverlay(page);

    await expect(page.locator(PREMIUM_ROOT)).toBeVisible();
    await expect(page.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-np-cases="1"]')).toHaveCount(0);

    await assertNoForbiddenPublicLinks(page, ".nn-premium-pathway-hub");

    const flashHref = await page
      .locator('[data-nn-qa-hub-premium-module="flashcards"] a.nn-exam-hub-study-card')
      .getAttribute("href");
    expect(flashHref ?? "").toContain("callbackUrl=");
    expect(flashHref ?? "").toMatch(/flashcards/i);
    expect(flashHref ?? "").toMatch(/us-rn-nclex-rn/);

    await clickGuestLoginModule(page, "flashcards");
    await assertNoReactCrashOverlay(page);
    expect.soft(diag.failures.length, `5xx responses: ${diag.failures.join("; ")}`).toBe(0);

    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await settlePage(page);

    await expectHttpOkNoServerError(page, "/us/rn/nclex-rn/lessons");
    await expectHttpOkNoServerError(page, "/app/flashcards?pathwayId=us-rn-nclex-rn");

    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await settlePage(page);
    await applyThemeBucket(page, "ocean");
    await captureHubScreenshot(page, "rn-desktop-ocean");

    const overflowFn = () =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth;
    expect(await page.evaluate(overflowFn)).toBeLessThanOrEqual(12);

    const ce = diag.consoleErrors.filter((x) => !benignConsoleText(x));
    expect(ce, `console errors: ${ce.join(" | ")}`).toEqual([]);
  });

  test("RPN (REx-PN) hub: no ECG marker; labs → login callback", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    attachPageDiagnostics(page);
    await seedCaMarketingCookie(page, origin);

    await gotoExpectOk(page, "/canada/pn/rex-pn");
    await settlePage(page);

    await expect(page.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(0);
    await expect(page.locator('[data-nn-qa-hub-np-cases="1"]')).toHaveCount(0);
    await assertNoForbiddenPublicLinks(page, ".nn-premium-pathway-hub");

    const labsHref = await page
      .locator('[data-nn-qa-hub-premium-module="labs"] a.nn-exam-hub-study-card')
      .getAttribute("href");
    expect(labsHref ?? "").toContain("callbackUrl=");

    await clickGuestLoginModule(page, "labs");

    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoExpectOk(page, "/canada/pn/rex-pn");
    await settlePage(page);
    await applyThemeBucket(page, "ocean");
    await captureHubScreenshot(page, "rpn-desktop-ocean");
  });

  test("NP hub: ECG + NP clinical marker; practice_tests callback href shape", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    attachPageDiagnostics(page);
    await seedUsMarketingCookie(page, origin);

    await gotoExpectOk(page, "/us/np/fnp");
    await settlePage(page);

    await expect(page.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(1);
    await expect(page.locator('[data-nn-qa-hub-np-cases="1"]')).toHaveCount(1);

    const ptHref = await page
      .locator('[data-nn-qa-hub-premium-module="practice_tests"] a.nn-exam-hub-study-card')
      .getAttribute("href");
    expect(ptHref ?? "").toContain("/login");
    expect(ptHref ?? "").toMatch(/pathwayId%3Dus-np-fnp|pathwayId=us-np-fnp/);

    await clickGuestLoginModule(page, "practice_tests");

    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoExpectOk(page, "/us/np/fnp");
    await settlePage(page);
    await applyThemeBucket(page, "ocean");
    await captureHubScreenshot(page, "np-desktop-ocean");
  });

  test("New Grad hub: no ECG; new-grad-only module row present", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    attachPageDiagnostics(page);
    await seedUsMarketingCookie(page, origin);

    await gotoExpectOk(page, "/us/rn/new-grad-transition");
    await settlePage(page);

    await expect(page.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(0);
    await expect(page.locator('[data-nn-qa-hub-premium-module="transition"]')).toHaveCount(1);

    const medDrillHref = await page
      .locator('[data-nn-qa-hub-premium-module="skills_refresher"] a.nn-exam-hub-study-card')
      .getAttribute("href");
    expect(medDrillHref ?? "").toContain("callbackUrl=");

    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoExpectOk(page, "/us/rn/new-grad-transition");
    await settlePage(page);
    await applyThemeBucket(page, "ocean");
    await captureHubScreenshot(page, "new-grad-desktop-ocean");
  });

  test("Allied global hub: occupation chooser only; no ECG / NP cases / admin links; theme + mobile screenshots", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    const diag = attachPageDiagnostics(page);
    await seedUsMarketingCookie(page, origin);

    await gotoExpectOk(page, "/allied/allied-health");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("link", { name: /Choose Your Occupation Track/i })).toBeVisible({
      timeout: 120_000,
    });
    await assertNoReactCrashOverlay(page);

    await expect(page.locator(PREMIUM_ROOT)).toHaveCount(0);
    await expect(page.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(0);
    await expect(page.locator('[data-nn-qa-hub-np-cases="1"]')).toHaveCount(0);
    await assertNoForbiddenPublicLinks(page, "main");

    await expectHttpOkNoServerError(page, "/allied/allied-health/lessons");

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      for (const th of THEME_BUCKETS) {
        await gotoExpectOk(page, "/allied/allied-health");
        await page.waitForLoadState("domcontentloaded");
        await expect(page.getByRole("link", { name: /Choose Your Occupation Track/i })).toBeVisible({
          timeout: 120_000,
        });
        await applyThemeBucket(page, th.id);
        await page.waitForTimeout(400);
        await captureHubScreenshot(page, "allied-global-" + vp.name + "-" + th.name);
      }
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoExpectOk(page, "/allied/allied-health");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByRole("link", { name: /Choose Your Occupation Track/i })).toBeVisible({
      timeout: 120_000,
    });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(12);

    const ce = diag.consoleErrors.filter((x) => !benignConsoleText(x));
    expect(ce, "console errors: " + ce.join(" | ")).toEqual([]);
  });

  test("Allied occupation /allied/mlt: profession scoping + locked OSCE safety + login interactivity", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    attachPageDiagnostics(page);
    await seedUsMarketingCookie(page, origin);

    await gotoExpectOk(page, "/allied/mlt");
    await settlePage(page);

    await expect(page.locator(PREMIUM_ROOT)).toBeVisible();
    await expect(page.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(0);
    await expect(page.locator('[data-nn-qa-hub-np-cases="1"]')).toHaveCount(0);
    await assertNoForbiddenPublicLinks(page, PREMIUM_ROOT);
    await expect(
      page.locator(PREMIUM_ROOT + "[data-nn-allied-premium-accent]"),
    ).toHaveCount(1);

    for (const key of ["flashcards", "practice_tests", "labs", "med_calc", "weak_areas"]) {
      const href = await page
        .locator('[data-nn-qa-hub-premium-module="' + key + '"] a.nn-exam-hub-study-card')
        .first()
        .getAttribute("href");
      const decoded = decodeURIComponent(href ?? "");
      expect(decoded, key + " href should include allied profession scope").toContain(
        "alliedProfession=mlt",
      );
      expect(decoded, key + " href should include allied pathway id").toContain("us-allied-core");
      expect(href ?? "", key + " href is guest-safe (login callback)").toContain("/login");
      expect(href ?? "", key + " href has no admin route").not.toContain("/admin");
      expect(href ?? "", key + " href has no staff route").not.toContain("/staff");
    }

    const osceRow = page.locator('[data-nn-qa-hub-premium-module="osce"]');
    if ((await osceRow.count()) > 0) {
      const osceLinks = osceRow.locator("a.nn-exam-hub-study-card");
      if ((await osceLinks.count()) > 0) {
        const osceHref = await osceLinks.first().getAttribute("href");
        const safe = osceHref === "/" || (osceHref ?? "").startsWith("/login");
        expect(safe, "OSCE locked href must be '/' or /login (got " + (osceHref ?? "null") + ")").toBe(
          true,
        );
      } else {
        await expect(osceRow.locator(".nn-exam-hub-study-card")).toBeVisible();
      }
    }

    await clickGuestLoginModule(page, "flashcards");

    await gotoExpectOk(page, "/allied/mlt");
    await settlePage(page);
    await expectHttpOkNoServerError(
      page,
      "/app/flashcards?pathwayId=us-allied-core&alliedProfession=mlt",
    );

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      for (const th of THEME_BUCKETS) {
        await gotoExpectOk(page, "/allied/mlt");
        await settlePage(page);
        await applyThemeBucket(page, th.id);
        await page.waitForTimeout(400);
        await captureHubScreenshot(page, "allied-mlt-" + vp.name + "-" + th.name);
      }
    }
  });

  test("Pre-Nursing hub: quick modes + practice login routing (no premium module grid)", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    attachPageDiagnostics(page);
    await seedUsMarketingCookie(page, origin);

    await gotoExpectOk(page, "/pre-nursing");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator('[data-nn-nursing-tier-hub="surface"]')).toBeVisible({ timeout: 120_000 });
    await page.waitForTimeout(5000);

    await expect(page.locator(PREMIUM_ROOT)).toHaveCount(0);
    await expect(page.locator('[data-nn-qa-hub-ecg="1"]')).toHaveCount(0);

    await assertNoForbiddenPublicLinks(page, '[data-nn-nursing-tier-hub="surface"]');

    const practiceHref = await page.locator(".nn-qa-pre-nursing-hub-practice").getAttribute("href");
    expect(practiceHref ?? "").toMatch(/\/login\?|callbackUrl=/);

    await page.setViewportSize({ width: 1280, height: 900 });
    await applyThemeBucket(page, "ocean");
    await captureHubScreenshot(page, "pre-nursing-desktop-ocean");

    await page.locator(".nn-qa-pre-nursing-hub-practice").click();
    await expect(page).toHaveURL(/\/login\?/, { timeout: 60_000 });
  });
});

test.describe("Hub screenshots — pathway × viewport × theme (opt-in)", () => {
  test.skip(
    process.env.HUB_MODULES_FULL_VISUAL !== "1",
    "Set HUB_MODULES_FULL_VISUAL=1 to capture the full desktop/mobile × ocean/midnight matrix for each hub.",
  );

  test("matrix", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);

    const hubs = [
      { path: "/us/rn/nclex-rn", slug: "rn" },
      { path: "/canada/pn/rex-pn", slug: "rpn", ca: true },
      { path: "/us/np/fnp", slug: "np" },
      { path: "/us/rn/new-grad-transition", slug: "new-grad" },
      { path: "/allied/allied-health", slug: "allied" },
    ] as const;

    for (const hub of hubs) {
      if ("ca" in hub && hub.ca) await seedCaMarketingCookie(page, origin);
      else await seedUsMarketingCookie(page, origin);

      for (const vp of VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        for (const th of THEME_BUCKETS) {
          await gotoExpectOk(page, hub.path);
          await settlePage(page);
          await applyThemeBucket(page, th.id);
          await page.waitForTimeout(400);
          await captureHubScreenshot(page, `${hub.slug}-${vp.name}-${th.name}`);
        }
      }
    }
  });
});

test.describe("Locked premium cards (guest): OSCE / NP clinical when gated — no navigation", () => {
  test("OSCE card does not navigate away when feature-locked (href `/`, div surface)", async ({
    page,
    baseURL,
  }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);

    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await settlePage(page);

    const osceRow = page.locator('[data-nn-qa-hub-premium-module="osce"]');
    await expect(osceRow).toBeVisible();

    const link = osceRow.locator("a.nn-exam-hub-study-card");
    const before = page.url();

    if ((await link.count()) === 0) {
      await osceRow.locator(".nn-exam-hub-study-card--locked").click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(800);
      expect(page.url()).toBe(before);
      return;
    }

    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    await link.click();
    await page.waitForTimeout(1500);
    if (href?.startsWith("/login")) {
      await expect(page).toHaveURL(/\/login/);
    }
  });
});
