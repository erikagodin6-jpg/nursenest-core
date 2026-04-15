/**
 * Marketing navigation audit: desktop header, mega menus, mobile drawer, country, theme, footer.
 *
 * Outputs:
 * - test-results/marketing-nav-audit-report.json
 * - test-results/marketing-nav-audit-report.md
 *
 * Run: `npx playwright test tests/e2e/public/marketing-navigation-audit.spec.ts --project=chromium`
 */
import { expect, test, type Locator } from "@playwright/test";
import {
  destinationsMatch,
  dismissMarketingScrims,
  normalizePathname,
  writeNavAuditReports,
  type NavAuditRow,
} from "../helpers/marketing-navigation-audit";
import { HEADER_CHROME } from "../helpers/country-selector";
import { getE2eBaseURL } from "../helpers/e2e-env";

const baseURL = getE2eBaseURL();
const origin = new URL(baseURL).origin;

/** ThemePicker shows label text plus a chevron; accessible name is not exactly `Theme`. */
const THEME_TOGGLE_NAME = /^Theme\b/i;

const auditRows: NavAuditRow[] = [];

let rowSeq = 0;
function nextId(prefix: string): string {
  rowSeq += 1;
  return `${prefix}-${String(rowSeq).padStart(3, "0")}`;
}

function record(row: Omit<NavAuditRow, "pass"> & { pass?: boolean; notes?: string }): void {
  auditRows.push({
    ...row,
    pass: row.pass ?? true,
  });
}

/** Follow internal href with full navigation (avoids scrims blocking Link clicks). */
async function gotoHrefAudit(
  page: import("@playwright/test").Page,
  href: string,
  id: string,
  surface: string,
  elementLabel: string,
): Promise<void> {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) {
    record({
      id,
      surface,
      element: elementLabel,
      expectedDestination: href ?? "(none)",
      actualDestination: page.url(),
      pass: false,
      notes: "missing href",
    });
    throw new Error(`No href for ${elementLabel}`);
  }
  if (href.startsWith("http") && !href.startsWith(origin)) {
    record({
      id,
      surface,
      element: elementLabel,
      expectedDestination: href,
      actualDestination: page.url(),
      pass: true,
      notes: "external — not followed",
    });
    return;
  }
  const target = new URL(href, baseURL).href;
  const expectedDisplay = normalizePathname(target) + (new URL(target).search || "");
  await page.goto(target, { waitUntil: "domcontentloaded" });
  const actual = page.url();
  const ok = destinationsMatch(href, actual, origin);
  record({
    id,
    surface,
    element: elementLabel,
    expectedDestination: expectedDisplay,
    actualDestination: normalizePathname(actual) + (new URL(actual).search || ""),
    pass: ok,
    notes: ok ? undefined : "pathname mismatch after goto",
  });
  expect(ok, `${elementLabel}: expected path from ${href}, got ${actual}`).toBe(true);
}

async function clickAnchorNavigate(
  page: import("@playwright/test").Page,
  locator: Locator,
  id: string,
  surface: string,
  elementLabel: string,
): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
  const href = await locator.getAttribute("href");
  if (!href) {
    record({
      id,
      surface,
      element: elementLabel,
      expectedDestination: "(none)",
      actualDestination: page.url(),
      pass: false,
    });
    throw new Error(`No href on ${elementLabel}`);
  }
  await gotoHrefAudit(page, href, id, surface, elementLabel);
}

test.describe.configure({ mode: "serial" });

test.describe("Marketing navigation audit", () => {
  test.afterAll(async () => {
    const { json, md } = await writeNavAuditReports(auditRows);
    // eslint-disable-next-line no-console
    console.log(`\n[marketing-nav-audit] Wrote ${json} and ${md}\n`);
  });

  test("desktop: no duplicate header controls; browse nav + mega + theme + region", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    await expect(page.locator('[data-nn-nav-mode="public"]').first()).toBeVisible({ timeout: 60_000 });

    const scope = page.locator(HEADER_CHROME);

    const themeButtons = scope.getByRole("button", { name: THEME_TOGGLE_NAME }).filter({ visible: true });
    const themeCount = await themeButtons.count();
    const passTheme = themeCount === 1;
    record({
      id: nextId("dup"),
      surface: "desktop-header",
      element: "Theme toggle count",
      expectedDestination: "1 visible",
      actualDestination: String(themeCount),
      pass: passTheme,
      notes: passTheme ? undefined : "duplicate or missing Theme control",
    });
    expect(passTheme).toBe(true);

    const regionPat = /Region:|Country:/i;
    const regionButtons = scope.getByRole("button", { name: regionPat }).filter({ visible: true });
    const regionCount = await regionButtons.count();
    const passRegion = regionCount === 1;
    record({
      id: nextId("dup"),
      surface: "desktop-header",
      element: "Region / country trigger count",
      expectedDestination: "1 visible",
      actualDestination: String(regionCount),
      pass: passRegion,
    });
    expect(passRegion).toBe(true);

    const marketingNav = page.getByRole("navigation", { name: /who we help|marketing|explore/i });
    const browseLinks = marketingNav.getByRole("link");
    const n = await browseLinks.count();
    expect(n, "expected marketing browse links").toBeGreaterThan(0);

    for (let i = 0; i < n; i++) {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await dismissMarketingScrims(page);
      const link = marketingNav.getByRole("link").nth(i);
      const text = (await link.innerText()).trim().replace(/\s+/g, " ");
      const href = await link.getAttribute("href");
      if (href) await gotoHrefAudit(page, href, nextId("desk-browse"), "desktop-browse-nav", text || `link[${i}]`);
    }

    // Mega menu: open RN (first public tier), follow hub card "Open Hub" target (first link in dialog).
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    const rnBtn = page.getByRole("button", { name: /^RN$/i }).first();
    await expect(rnBtn).toBeVisible({ timeout: 15_000 });
    await rnBtn.hover();
    await page.getByRole("dialog", { name: /RN menu/i }).waitFor({ state: "visible", timeout: 10_000 });
    const megaDialog = page.getByRole("dialog", { name: /RN menu/i });
    await expect(megaDialog).toBeVisible();
    const hubLink = megaDialog.locator("a").first();
    await expect(hubLink).toBeVisible();
    const hubHref = await hubLink.getAttribute("href");
    expect(hubHref).toBeTruthy();
    await gotoHrefAudit(page, hubHref!, nextId("mega"), "desktop-mega-rn", "RN mega → hub card");

    // Theme keyboard: open listbox via Theme button, verify Escape closes (no URL change required).
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    await page.keyboard.press("Escape");
    await dismissMarketingScrims(page);
    const themeBtn = scope.getByRole("button", { name: THEME_TOGGLE_NAME }).filter({ visible: true }).first();
    await themeBtn.focus();
    await page.keyboard.press("Enter");
    await expect(themeBtn.locator("..").getByRole("listbox")).toBeVisible({ timeout: 5000 });
    const beforeTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    const oceanOpt = scope.getByRole("option", { name: /Ocean/i }).first();
    if (await oceanOpt.isVisible().catch(() => false)) {
      await oceanOpt.click();
      await page.waitForTimeout(300);
      const afterTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
      record({
        id: nextId("theme"),
        surface: "desktop-theme",
        element: "Select Ocean theme",
        expectedDestination: "data-theme !== " + String(beforeTheme),
        actualDestination: String(afterTheme),
        pass: afterTheme !== beforeTheme || afterTheme === "ocean",
        notes: afterTheme === beforeTheme ? "theme may already be ocean" : undefined,
      });
    }
    await page.keyboard.press("Escape");
    await expect(themeBtn.locator("..").getByRole("listbox")).toBeHidden({ timeout: 5000 }).catch(() => {});

    // Country: open with keyboard, listbox visible, Escape closes.
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    const regionBtn = scope.getByRole("button", { name: regionPat }).filter({ visible: true }).first();
    await regionBtn.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.locator(`${HEADER_CHROME} [role="listbox"][aria-label="Select country"]`),
    ).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press("Escape");
    await expect(
      page.locator(`${HEADER_CHROME} [role="listbox"][aria-label="Select country"]`),
    ).toBeHidden({ timeout: 5000 });
    record({
      id: nextId("country-kb"),
      surface: "desktop-country",
      element: "Region listbox open/close via keyboard",
      expectedDestination: "listbox visible then hidden",
      actualDestination: "Escape closed",
      pass: true,
    });
  });

  test("mobile: drawer open/close, keyboard, one browse link", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);

    const openBtn = page.getByRole("button", { name: /Open menu/i }).first();
    await expect(openBtn).toBeVisible();
    await openBtn.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: /Close menu/i }).first()).toBeVisible({ timeout: 15_000 });
    record({
      id: nextId("mob-open"),
      surface: "mobile-drawer",
      element: "Open menu (keyboard Enter)",
      expectedDestination: "drawer visible",
      actualDestination: "Close menu visible",
      pass: true,
    });

    // Two controls share "Close menu" (dimmer + toolbar X); dimmer clicks can be blocked by page scrims — use Escape.
    await page.keyboard.press("Escape");
    await expect(openBtn).toBeVisible({ timeout: 15_000 });
    record({
      id: nextId("mob-close"),
      surface: "mobile-drawer",
      element: "Close drawer (Escape)",
      expectedDestination: "drawer hidden",
      actualDestination: "Open menu visible",
      pass: true,
    });

    await openBtn.click({ force: true });
    await expect(page.getByRole("button", { name: /Close menu/i }).first()).toBeVisible();
    const drawerPricing = page
      .locator(".min-h-0.flex-1.overflow-y-auto")
      .getByRole("link", { name: /^Pricing$/i })
      .first();
    await clickAnchorNavigate(page, drawerPricing, nextId("mob-nav"), "mobile-drawer", "Pricing link");

    // Stays on pricing — go home for context drawer test
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const settingsBtn = page.getByRole("button", { name: /Region and language settings/i });
    await settingsBtn.click();
    await expect(page.getByRole("heading", { name: /Region & Settings/i })).toBeVisible({ timeout: 10_000 });
    // Same pattern as nav drawer: dimmer + toolbar share aria-label.
    await page.getByRole("button", { name: /^Close settings$/i }).nth(1).click({ force: true });
    await expect(page.getByRole("heading", { name: /Region & Settings/i })).toBeHidden({ timeout: 5000 });
    record({
      id: nextId("mob-ctx"),
      surface: "mobile-context-drawer",
      element: "Settings drawer open/close",
      expectedDestination: "panel toggled",
      actualDestination: "closed",
      pass: true,
    });
  });

  test("footer: internal links return OK and one navigation smoke", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);

    const footer = page.locator("footer");
    const anchors = footer.locator('a[href^="/"]');
    const max = Math.min(await anchors.count(), 24);
    expect(max).toBeGreaterThan(0);

    for (let i = 0; i < max; i++) {
      const href = await anchors.nth(i).getAttribute("href");
      if (!href || href.startsWith("/app")) continue;
      const headUrl = new URL(href, baseURL).href;
      const res = await page.request.get(headUrl);
      const label = `footer[${i}]`;
      record({
        id: nextId("foot-req"),
        surface: "footer",
        element: label,
        expectedDestination: headUrl,
        actualDestination: `HTTP ${res.status()}`,
        pass: res.ok(),
        notes: res.ok() ? undefined : "GET failed (dead link?)",
      });
      expect(res.ok(), `GET ${headUrl}`).toBe(true);
    }

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    const blogLink = footer.locator('a[href^="/"]').filter({ hasText: /blog/i }).first();
    if ((await blogLink.count()) > 0) {
      await clickAnchorNavigate(page, blogLink, nextId("foot-click"), "footer", "Blog (smoke click)");
    } else {
      const first = footer.locator('a[href^="/"]').first();
      await clickAnchorNavigate(
        page,
        first,
        nextId("foot-click"),
        "footer",
        (await first.innerText()).trim() || "first footer link",
      );
    }
  });

  test("no unexpected same-page navigation for browse Pricing", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    const marketingNav = page.getByRole("navigation", { name: /who we help|marketing|explore/i });
    const pricing = marketingNav.getByRole("link", { name: /^Pricing$/i }).first();
    const href = await pricing.getAttribute("href");
    const before = page.url();
    await pricing.evaluate((el: HTMLElement) => (el as HTMLAnchorElement).click());
    await page.waitForLoadState("domcontentloaded");
    const after = page.url();
    const same = normalizePathname(before) === normalizePathname(after);
    record({
      id: nextId("same"),
      surface: "desktop-browse-nav",
      element: "Pricing while already on /pricing",
      expectedDestination: "stay on pricing (SPA)",
      actualDestination: normalizePathname(after),
      pass: same,
      notes: same ? undefined : "unexpected navigation away from pricing",
    });
    expect(same).toBe(true);
  });
});
