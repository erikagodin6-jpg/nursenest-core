/**
 * Focused country/region selection behavior (desktop + mobile).
 *
 * Reports: test-results/country-selection-behavior-report.{json,md}
 * Run: `npx playwright test tests/e2e/navigation/country-selection-behavior.spec.ts --project=chromium`
 *
 * Screenshots: `only-on-failure` (playwright.config.ts).
 */
import { expect, test, type Page } from "@playwright/test";
import { MARKETING_REGION_COOKIE } from "../../../src/lib/region/marketing-region-cookie";
import {
  GLOBAL_REGION_COOKIE,
  HEADER_CHROME,
  openDesktopCountryMenu,
  selectCountryFromListbox,
  setGlobalRegionCookie,
} from "../helpers/country-selector";
import {
  readPrimaryCountryAriaLabel,
  writeCountrySelectionReport,
  type CountrySelectionReportRow,
} from "../helpers/country-selection-report";
import { dismissMarketingScrims } from "../helpers/marketing-navigation-audit";
import { expectMobileRegionSettingsHeading, openMobileRegionLanguageDrawer } from "../helpers/mobile-drawer";
const rows: CountrySelectionReportRow[] = [];

function record(row: Omit<CountrySelectionReportRow, "pass"> & { pass?: boolean }): void {
  rows.push({ ...row, pass: row.pass ?? true });
}

function requireOrigin(baseURL: string | undefined): string {
  expect(baseURL, "Playwright baseURL must be set").toBeTruthy();
  return baseURL!;
}

function pathnameUnderUs(url: string): boolean {
  const p = new URL(url).pathname.replace(/\/$/, "") || "/";
  return p === "/us" || p.startsWith("/us/");
}

function pathnameUnderCanada(url: string): boolean {
  const p = new URL(url).pathname.replace(/\/$/, "") || "/";
  return p === "/canada" || p.startsWith("/canada/");
}

async function waitForPathUnderRegion(page: Page, target: "us" | "canada"): Promise<void> {
  await page.waitForFunction(
    (t) => {
      const p = new URL(window.location.href).pathname.replace(/\/$/, "") || "/";
      if (t === "us") return p === "/us" || p.startsWith("/us/");
      return p === "/canada" || p.startsWith("/canada/");
    },
    target,
    { timeout: 45_000 },
  );
}

async function expectPublicChrome(page: Page): Promise<void> {
  await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });
}

/** Parsed display name from `Country: X` / `Region: X` trigger (lowercase). */
function regionNameFromAria(aria: string): string {
  const m = /^(?:Country|Region):\s*([^.]+)/i.exec(aria.trim());
  return (m?.[1] ?? "").trim().toLowerCase();
}

async function expectHeaderUtilityAndPrimaryAgree(page: Page): Promise<void> {
  const triggers = page.locator(
    `${HEADER_CHROME} button[aria-label*="Country:"], ${HEADER_CHROME} button[aria-label*="Region:"]`,
  );
  const n = await triggers.count();
  expect(n, "expected country/region triggers in header chrome").toBeGreaterThan(0);
  const names = new Set<string>();
  for (let i = 0; i < n; i++) {
    const al = await triggers.nth(i).getAttribute("aria-label");
    if (al) names.add(regionNameFromAria(al));
  }
  expect(names.size, `header country labels disagree: ${[...names].join(" | ")}`).toBe(1);
}

async function expectNoDuplicateRegionToggleInMain(page: Page): Promise<void> {
  await expect(page.locator("main [role='radiogroup']")).toHaveCount(0);
  await expect(page.locator("main [aria-label='Select country']")).toHaveCount(0);
}

test.describe("Country selection behavior", () => {
  test.describe.configure({ mode: "serial" });

  test.afterAll(async () => {
    const { json, md } = await writeCountrySelectionReport(rows);
    // eslint-disable-next-line no-console
    console.log(`\n[country-selection-behavior] Wrote ${json} and ${md}\n`);
  });

  test("desktop: Philippines → US → Canada (URLs, labels, chrome parity)", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.setViewportSize({ width: 1280, height: 800 });

    await setGlobalRegionCookie(page, "philippines", origin);
    await page.goto("/exams/philippines", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    await expectPublicChrome(page);

    const startUrl = page.url();
    const startLabel = await readPrimaryCountryAriaLabel(page);
    expect(pathnameUnderUs(startUrl) || pathnameUnderCanada(startUrl), "start on Philippines exams path").toBe(false);

    await openDesktopCountryMenu(page);
    await selectCountryFromListbox(page, /United States/i);
    await waitForPathUnderRegion(page, "us");
    const afterUsUrl = page.url();
    const afterUsLabel = await readPrimaryCountryAriaLabel(page);
    expect(pathnameUnderUs(afterUsUrl), `expected /us… after US select, got ${afterUsUrl}`).toBe(true);
    await expect(page).toHaveURL(/\/us(\/|$)/);
    expect(afterUsLabel.toLowerCase()).toContain("united states");

    record({
      scenario: "Desktop: exams/philippines → United States",
      platform: "desktop",
      beforeUrl: startUrl,
      afterUrl: afterUsUrl,
      beforeLabel: startLabel,
      afterLabel: afterUsLabel,
      pass: pathnameUnderUs(afterUsUrl) && afterUsLabel.toLowerCase().includes("united states"),
    });

    await expectNoDuplicateRegionToggleInMain(page);
    await expectHeaderUtilityAndPrimaryAgree(page);

    await openDesktopCountryMenu(page);
    await selectCountryFromListbox(page, /Canada/i);
    await waitForPathUnderRegion(page, "canada");
    const afterCaUrl = page.url();
    const afterCaLabel = await readPrimaryCountryAriaLabel(page);
    expect(pathnameUnderCanada(afterCaUrl), `expected /canada… after Canada select, got ${afterCaUrl}`).toBe(true);
    await expect(page).toHaveURL(/\/canada(\/|$)/);
    expect(afterCaLabel.toLowerCase()).toContain("canada");

    record({
      scenario: "Desktop: United States → Canada (from hub)",
      platform: "desktop",
      beforeUrl: afterUsUrl,
      afterUrl: afterCaUrl,
      beforeLabel: afterUsLabel,
      afterLabel: afterCaLabel,
      pass: pathnameUnderCanada(afterCaUrl) && afterCaLabel.toLowerCase().includes("canada"),
    });

    await expectNoDuplicateRegionToggleInMain(page);
    await expectHeaderUtilityAndPrimaryAgree(page);
  });

  test("mobile: Philippines → US → Canada (URLs, labels)", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.setViewportSize({ width: 390, height: 844 });

    await setGlobalRegionCookie(page, "philippines", origin);
    await page.goto("/exams/philippines", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    await expectPublicChrome(page);

    const startUrl = page.url();
    const startLabel = await readPrimaryCountryAriaLabel(page);

    await openMobileRegionLanguageDrawer(page);
    await expectMobileRegionSettingsHeading(page);
    await page
      .getByRole("option", { name: /United States/i })
      .first()
      .evaluate((el) => (el as HTMLElement).click());
    await waitForPathUnderRegion(page, "us");
    const afterUsUrl = page.url();
    const afterUsLabel = await readPrimaryCountryAriaLabel(page);
    expect(pathnameUnderUs(afterUsUrl)).toBe(true);
    expect(afterUsLabel.toLowerCase()).toContain("united states");

    record({
      scenario: "Mobile: exams/philippines → United States",
      platform: "mobile",
      beforeUrl: startUrl,
      afterUrl: afterUsUrl,
      beforeLabel: startLabel,
      afterLabel: afterUsLabel,
      pass: pathnameUnderUs(afterUsUrl) && afterUsLabel.toLowerCase().includes("united states"),
    });

    await expectHeaderUtilityAndPrimaryAgree(page);

    await openMobileRegionLanguageDrawer(page);
    await page
      .getByRole("option", { name: /Canada/i })
      .first()
      .evaluate((el) => (el as HTMLElement).click());
    await waitForPathUnderRegion(page, "canada");
    const afterCaUrl = page.url();
    const afterCaLabel = await readPrimaryCountryAriaLabel(page);
    expect(pathnameUnderCanada(afterCaUrl)).toBe(true);
    expect(afterCaLabel.toLowerCase()).toContain("canada");

    record({
      scenario: "Mobile: United States → Canada",
      platform: "mobile",
      beforeUrl: afterUsUrl,
      afterUrl: afterCaUrl,
      beforeLabel: afterUsLabel,
      afterLabel: afterCaLabel,
      pass: pathnameUnderCanada(afterCaUrl) && afterCaLabel.toLowerCase().includes("canada"),
    });

    await expectNoDuplicateRegionToggleInMain(page);
    await expectHeaderUtilityAndPrimaryAgree(page);
  });

  test("expansion region cookie alone does not imply Philippines on neutral /pricing", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.context().addCookies([
      { name: GLOBAL_REGION_COOKIE, value: "philippines", url: origin },
      { name: MARKETING_REGION_COOKIE, value: "US", url: origin },
    ]);
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    await expectPublicChrome(page);

    await expect(
      page.locator(HEADER_CHROME).getByRole("button", { name: /Country: United States|Region: United States/i }).first(),
    ).toBeVisible({ timeout: 30_000 });
    const noPh = (await page.locator(HEADER_CHROME).getByRole("button", { name: /Philippines/i }).count()) === 0;

    record({
      scenario: "Stale expansion cookie: /pricing shows US, not Philippines",
      platform: "desktop",
      beforeUrl: page.url(),
      afterUrl: page.url(),
      beforeLabel: "(cookie: philippines + marketing US)",
      afterLabel: await readPrimaryCountryAriaLabel(page),
      pass: noPh,
      notes: "See marketing-header-global-region: expansion not implied from cookie alone on neutral paths",
    });
    expect(noPh).toBe(true);
  });

  test("simulated failed save: abort server-action POST → no navigation to /us", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.setViewportSize({ width: 1280, height: 800 });

    await setGlobalRegionCookie(page, "philippines", origin);
    await page.goto("/exams/philippines", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    await expectPublicChrome(page);

    const urlBefore = page.url();
    const labelBefore = await readPrimaryCountryAriaLabel(page);

    const url = new URL(origin);
    const originPattern = `${url.origin}/**`;
    await page.route(originPattern, async (route) => {
      const req = route.request();
      const nextAction = req.headerValue("next-action") ?? req.headerValue("Next-Action");
      if (req.method() === "POST" && nextAction) {
        await route.abort("failed");
        return;
      }
      await route.continue();
    });

    await openDesktopCountryMenu(page);
    const list = page.locator(`${HEADER_CHROME} [role="listbox"][aria-label="Select country"]`);
    await list.getByRole("option", { name: /United States/i }).first().click({ timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(1500);
    await page.keyboard.press("Escape").catch(() => {});

    const urlAfter = page.url();
    const stayedOnExams =
      urlAfter.includes("/exams/philippines") || (!pathnameUnderUs(urlAfter) && !pathnameUnderCanada(urlAfter));

    record({
      scenario: "Failed save (simulated): no navigation to US marketing path",
      platform: "desktop",
      beforeUrl: urlBefore,
      afterUrl: urlAfter,
      beforeLabel: labelBefore,
      afterLabel: await readPrimaryCountryAriaLabel(page).catch(() => ""),
      pass: stayedOnExams,
      notes: "Aborts Next.js Server Action POSTs so saveContextPreferences never completes",
    });

    expect(stayedOnExams, `expected to stay off /us when save fails, got ${urlAfter}`).toBe(true);
    expect(pathnameUnderUs(urlAfter), "must not navigate under /us").toBe(false);
  });
});
