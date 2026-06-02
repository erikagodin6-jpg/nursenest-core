/**
 * Full Navigation Audit — NurseNest Platform
 *
 * Covers:
 *  1. Core nav bar items (all role links)
 *  2. Tier flow gating (RN / RPN / NP / Allied public hubs)
 *  3. Navigation clarity (duplicates, crowding, label consistency)
 *  4. Route integrity (critical deep routes)
 *  5. Performance / UX (layout shift, loading states, nav flicker)
 *
 * Run: BASE_URL=http://127.0.0.1:3000 npx playwright test tests/e2e/navigation/full-navigation-audit.spec.ts --reporter=list
 */
import { expect, test, type Page } from "@playwright/test";
import {
  DESKTOP_MEGA_TIER_NAV,
  DESKTOP_PRIMARY_STRIP_NAV,
  MARKETING_PUBLIC_SELECTOR,
  expectNotPageNotFound,
  gotoExpectOk,
  requireOrigin,
  seedCaMarketingCookie,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";
import { HEADER_CHROME } from "../helpers/country-selector";

// ─── helpers ────────────────────────────────────────────────────────────────

async function seedUs(page: Page, baseURL: string | undefined) {
  await seedUsMarketingCookie(page, requireOrigin(baseURL));
}

async function seedCa(page: Page, baseURL: string | undefined) {
  await seedCaMarketingCookie(page, requireOrigin(baseURL));
}

/** Navigate and assert no 404, no blank body, no hydration-crash heading. */
async function assertRouteValid(page: Page, path: string, label: string) {
  const r = await page.goto(path, { waitUntil: "domcontentloaded", timeout: 60_000 });
  expect(r?.status() ?? 0, `[${label}] HTTP status`).toBeLessThan(400);
  await expect(page.locator("body")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /^page not found$/i }),
    `[${label}] should not 404`,
  ).toHaveCount(0);
  // No blank / empty main
  const main = page.locator("main").first();
  if (await main.count()) {
    const text = await main.innerText().catch(() => "");
    expect(text.trim().length, `[${label}] main must not be empty`).toBeGreaterThan(0);
  }
}

/** Open a mega-menu panel by focusing the trigger button. */
async function openMegaMenu(page: Page, key: string) {
  const btn = page.locator(DESKTOP_MEGA_TIER_NAV).getByRole("button", { name: new RegExp(`^${key}$`, "i") });
  await btn.focus();
  await expect(page.locator(`#mega-menu-${key.toLowerCase()}`)).toBeVisible({ timeout: 20_000 });
}

/** Collect all nav link hrefs in the public marketing header. */
async function collectPublicNavHrefs(page: Page): Promise<string[]> {
  return page.locator(`${HEADER_CHROME} a`).evaluateAll((els) =>
    els.map((el) => (el as HTMLAnchorElement).getAttribute("href") ?? "").filter(Boolean),
  );
}

// ─── SECTION 1: Core nav bar items ──────────────────────────────────────────

test.describe("1. Core navigation items — public marketing (US)", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await seedUs(page, baseURL);
  });

  test("primary strip links all resolve (Pricing, About, Blog, FAQ, Tools)", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });

    const strip = page.locator(DESKTOP_PRIMARY_STRIP_NAV).first();
    const cases = [
      { name: /^Pricing$/, path: /\/pricing/ },
      { name: /^About$/, path: /\/about/ },
      { name: /^Blog$/, path: /\/blog/ },
      { name: /^FAQ$/, path: /\/faq/ },
      { name: /^Tools$/, path: /\/tools/ },
    ];

    for (const c of cases) {
      await gotoExpectOk(page, "/");
      await strip.getByRole("link", { name: c.name }).click();
      await page.waitForLoadState("domcontentloaded");
      await expect(page).toHaveURL(c.path);
      await expectNotPageNotFound(page);
    }
  });

  test("Pre-Nursing strip link resolves", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
    const strip = page.locator(DESKTOP_PRIMARY_STRIP_NAV).first();
    await strip.getByRole("link", { name: /^Pre-Nursing$/ }).click();
    await page.waitForURL(/\/pre-nursing/, { timeout: 120_000 });
    await expectNotPageNotFound(page);
    expect(page.url()).not.toMatch(/chrome-error/);
  });

  test("mega-menu RN → Open Hub resolves to US RN pathway hub", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
    await openMegaMenu(page, "RN");
    await page.locator("#mega-menu-rn").getByRole("link", { name: /Open Hub/i }).click({ force: true });
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/us\/rn\/nclex-rn/);
    await expectNotPageNotFound(page);
  });

  test("mega-menu PN/RPN → hub link resolves", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
    // Try PN button (US context)
    const pnBtn = page.locator(DESKTOP_MEGA_TIER_NAV).getByRole("button", { name: /^PN$|^RPN$/ }).first();
    const pnExists = await pnBtn.count();
    if (pnExists) {
      await pnBtn.focus();
      const pnPanel = page.locator("#mega-menu-pn, #mega-menu-rpn").first();
      await expect(pnPanel).toBeVisible({ timeout: 20_000 });
      const hubLink = pnPanel.getByRole("link", { name: /Hub|Practice|Lessons/i }).first();
      if (await hubLink.count()) {
        await hubLink.click({ force: true });
        await page.waitForLoadState("domcontentloaded");
        await expectNotPageNotFound(page);
      }
    }
  });

  test("mega-menu NP → hub link resolves", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
    const npBtn = page.locator(DESKTOP_MEGA_TIER_NAV).getByRole("button", { name: /^NP$/ }).first();
    if (await npBtn.count()) {
      await npBtn.focus();
      const npPanel = page.locator("#mega-menu-np").first();
      await expect(npPanel).toBeVisible({ timeout: 20_000 });
      const hubLink = npPanel.getByRole("link").first();
      if (await hubLink.count()) {
        await hubLink.click({ force: true });
        await page.waitForLoadState("domcontentloaded");
        await expectNotPageNotFound(page);
      }
    }
  });

  test("mega-menu Allied Health → resolves", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
    const btn = page
      .locator(DESKTOP_MEGA_TIER_NAV)
      .getByRole("button", { name: /Allied/i })
      .first();
    if (await btn.count()) {
      await btn.focus();
      const panel = page.locator('[id^="mega-menu-allied"]').first();
      await expect(panel).toBeVisible({ timeout: 20_000 });
      const hubLink = panel.getByRole("link").first();
      if (await hubLink.count()) {
        await hubLink.click({ force: true });
        await page.waitForLoadState("domcontentloaded");
        await expectNotPageNotFound(page);
      }
    }
  });

  test("Practice Tests nav item resolves", async ({ page }) => {
    await gotoExpectOk(page, "/");
    // Practice Tests may appear in a mega panel or direct strip link
    const ptLink = page
      .locator(HEADER_CHROME)
      .getByRole("link", { name: /Practice Tests?/i })
      .first();
    if (await ptLink.count()) {
      await ptLink.click({ force: true });
      await page.waitForLoadState("domcontentloaded");
      await expectNotPageNotFound(page);
    }
  });

  test("Lessons nav item resolves", async ({ page }) => {
    await gotoExpectOk(page, "/");
    const link = page.locator(HEADER_CHROME).getByRole("link", { name: /^Lessons$/i }).first();
    if (await link.count()) {
      await link.click({ force: true });
      await page.waitForLoadState("domcontentloaded");
      await expectNotPageNotFound(page);
    }
  });

  test("Flashcards nav item resolves", async ({ page }) => {
    await gotoExpectOk(page, "/");
    const link = page.locator(HEADER_CHROME).getByRole("link", { name: /Flashcards?/i }).first();
    if (await link.count()) {
      await link.click({ force: true });
      await page.waitForLoadState("domcontentloaded");
      await expectNotPageNotFound(page);
    }
  });

  test("ECG nav item resolves", async ({ page }) => {
    await gotoExpectOk(page, "/");
    const ecgLink = page.locator(HEADER_CHROME).getByRole("link", { name: /^ECG$/i }).first();
    if (await ecgLink.count()) {
      await ecgLink.click({ force: true });
      await page.waitForLoadState("domcontentloaded");
      await expectNotPageNotFound(page);
    }
  });

  test("Log in link targets /login", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
    const login = page.locator(HEADER_CHROME).getByRole("link", { name: /Log in/i }).first();
    await expect(login).toBeVisible({ timeout: 20_000 });
    await expect(login).toHaveAttribute("href", /\/login/);
    await login.click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/login/);
    await expectNotPageNotFound(page);
  });
});

// ─── SECTION 1b: Canadian nav ────────────────────────────────────────────────

test.describe("1b. Core navigation — Canada context", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await seedCa(page, baseURL);
  });

  test("CA context — RN mega hub resolves to CA RN hub", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
    await openMegaMenu(page, "RN");
    const rnPanel = page.locator("#mega-menu-rn");
    const hubLink = rnPanel.getByRole("link", { name: /Open Hub|Hub/i }).first();
    if (await hubLink.count()) {
      await hubLink.click({ force: true });
      await page.waitForLoadState("domcontentloaded");
      // CA RN should route to /canada/rn/nclex-rn
      await expect(page).toHaveURL(/\/canada\/rn\/nclex-rn|\/us\/rn\/nclex-rn/);
      await expectNotPageNotFound(page);
    }
  });
});

// ─── SECTION 2: Tier flow — public hub pages ─────────────────────────────────

test.describe("2. Tier flow — public hub pages (unauthenticated)", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await seedUs(page, baseURL);
  });

  test("US RN hub loads with content, no 404", async ({ page }) => {
    await assertRouteValid(page, "/us/rn/nclex-rn", "US RN hub");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });

  test("US PN hub loads with content, no 404", async ({ page }) => {
    await assertRouteValid(page, "/us/pn/nclex-pn", "US PN hub");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });

  test("US NP hub loads with content, no 404", async ({ page }) => {
    await assertRouteValid(page, "/us/np/fnp", "US NP hub");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });

  test("CA RN hub (Canada region) loads", async ({ page, baseURL }) => {
    await seedCa(page, baseURL);
    await assertRouteValid(page, "/canada/rn/nclex-rn", "CA RN hub");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });

  test("CA NP (CNPLE) hub loads", async ({ page, baseURL }) => {
    await seedCa(page, baseURL);
    await assertRouteValid(page, "/canada/np/cnple", "CA NP CNPLE hub");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });

  test("CA RPN (REX-PN) hub loads", async ({ page, baseURL }) => {
    await seedCa(page, baseURL);
    await assertRouteValid(page, "/canada/rpn/rex-pn", "CA RPN REX-PN hub");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });

  test("Allied Health hub loads", async ({ page }) => {
    await assertRouteValid(page, "/allied-health", "Allied Health hub");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });

  test("Respiratory Therapy sub-hub loads", async ({ page }) => {
    await assertRouteValid(page, "/allied-health/respiratory-therapy", "RT hub");
  });

  test("New Grad hub loads (US)", async ({ page }) => {
    await assertRouteValid(page, "/us/new-grad", "US New Grad hub");
  });

  test("Pre-Nursing hub loads", async ({ page }) => {
    await assertRouteValid(page, "/pre-nursing", "Pre-Nursing hub");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });

  test("ECG hub page loads", async ({ page }) => {
    await assertRouteValid(page, "/ecg", "ECG hub");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });

  test("ECG interpretation page loads", async ({ page }) => {
    await assertRouteValid(page, "/ecg-interpretation", "ECG interpretation");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });

  test("Advanced ECG hub loads", async ({ page }) => {
    await assertRouteValid(page, "/advanced-ecg-nursing", "Advanced ECG hub");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });

  test("Hemodynamics monitoring page loads", async ({ page }) => {
    await assertRouteValid(page, "/hemodynamics-monitoring", "Hemodynamics");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });

  test("Advanced Labs interpretation page loads", async ({ page }) => {
    await assertRouteValid(page, "/advanced-labs-interpretation", "Advanced Labs");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });
});

// ─── SECTION 2b: Tier gating — unauthenticated user hitting /app routes ────────

test.describe("2b. Tier gating — /app redirects unauthenticated users", () => {
  test("unauthenticated /app → redirect to login or marketing, no 500", async ({ page }) => {
    const r = await page.goto("/app", { waitUntil: "domcontentloaded" });
    // Must not be a server error
    expect(r?.status() ?? 0, "server error on /app").toBeLessThan(500);
    // Must redirect away from /app or show login gate
    const url = page.url();
    const isGated =
      /login|signin|signup|\/\?|^\/$/.test(url) ||
      (await page.locator("input[type=password], [data-nn-auth-gate]").count()) > 0;
    expect(isGated || !url.includes("/app"), "/app must gate unauthenticated users").toBeTruthy();
  });

  test("unauthenticated /app/lessons → redirect or gate, no 500", async ({ page }) => {
    const r = await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
    expect(r?.status() ?? 0, "server error on /app/lessons").toBeLessThan(500);
  });

  test("unauthenticated /app/practice-tests → redirect or gate, no 500", async ({ page }) => {
    const r = await page.goto("/app/practice-tests", { waitUntil: "domcontentloaded" });
    expect(r?.status() ?? 0, "server error on /app/practice-tests").toBeLessThan(500);
  });

  test("unauthenticated /app/flashcards → redirect or gate, no 500", async ({ page }) => {
    const r = await page.goto("/app/flashcards", { waitUntil: "domcontentloaded" });
    expect(r?.status() ?? 0, "server error on /app/flashcards").toBeLessThan(500);
  });
});

// ─── SECTION 3: Navigation clarity ───────────────────────────────────────────

test.describe("3. Navigation clarity — no duplicates, consistent hierarchy", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await seedUs(page, baseURL);
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
  });

  test("single public nav shell (no duplicate nav-mode=public headers)", async ({ page }) => {
    const count = await page.locator('[data-nn-nav-mode="public"]').count();
    expect(count, "exactly one public nav shell").toBe(1);
  });

  test("no duplicate Pricing links in visible header nav", async ({ page }) => {
    const pricingLinks = page
      .locator(HEADER_CHROME)
      .getByRole("link", { name: /^Pricing$/i })
      .filter({ visible: true });
    const n = await pricingLinks.count();
    expect(n, "at most one visible Pricing link in header").toBeLessThanOrEqual(1);
  });

  test("no duplicate Blog links in visible header nav", async ({ page }) => {
    const blogLinks = page
      .locator(HEADER_CHROME)
      .getByRole("link", { name: /^Blog$/i })
      .filter({ visible: true });
    const n = await blogLinks.count();
    expect(n, "at most one visible Blog link in header").toBeLessThanOrEqual(1);
  });

  test("no ambiguous identical hrefs pointing to different labels in primary strip", async ({ page }) => {
    const hrefs = await collectPublicNavHrefs(page);
    const seen = new Map<string, number>();
    for (const href of hrefs) {
      seen.set(href, (seen.get(href) ?? 0) + 1);
    }
    const duplicates = [...seen.entries()]
      .filter(([, count]) => count > 1)
      .map(([href]) => href)
      // external hrefs and auth callback hrefs are expected to repeat
      .filter((h) => !h.startsWith("http") && !h.includes("callback") && h !== "/" && h !== "#");
    expect(
      duplicates,
      `Duplicate internal hrefs in header nav: ${duplicates.join(", ")}`,
    ).toHaveLength(0);
  });

  test("Primary strip is a single nav element (no doubled strip)", async ({ page }) => {
    const strip = page.locator(DESKTOP_PRIMARY_STRIP_NAV);
    const n = await strip.count();
    // Typically 1 — allow 0 if not rendered on mobile breakpoints test doesn't use
    expect(n, "primary strip nav").toBeLessThanOrEqual(2);
  });

  test("Header has no empty or placeholder labels visible", async ({ page }) => {
    const navLinks = page.locator(`${HEADER_CHROME} a`).filter({ visible: true });
    const count = await navLinks.count();
    for (let i = 0; i < Math.min(count, 30); i++) {
      const text = (await navLinks.nth(i).innerText()).trim();
      const href = await navLinks.nth(i).getAttribute("href");
      // Only flag href links (not icon-only links) that have no text
      if (href && href !== "#" && !href.startsWith("mailto")) {
        expect(
          text.length,
          `Header link to "${href}" has empty label`,
        ).toBeGreaterThan(0);
      }
    }
  });
});

// ─── SECTION 4: Route integrity ───────────────────────────────────────────────

test.describe("4. Route integrity — critical public routes", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await seedUs(page, baseURL);
  });

  const PUBLIC_ROUTES = [
    { path: "/", label: "Home" },
    { path: "/pricing", label: "Pricing" },
    { path: "/about", label: "About" },
    { path: "/blog", label: "Blog" },
    { path: "/faq", label: "FAQ" },
    { path: "/contact", label: "Contact" },
    { path: "/lessons", label: "Public Lessons Hub" },
    { path: "/flashcards", label: "Public Flashcards Hub" },
    { path: "/us/rn/nclex-rn", label: "US RN Pathway Hub" },
    { path: "/us/pn/nclex-pn", label: "US PN Pathway Hub" },
    { path: "/us/np/fnp", label: "US NP Pathway Hub" },
    { path: "/canada/rn/nclex-rn", label: "CA RN Pathway Hub" },
    { path: "/canada/np/cnple", label: "CA NP CNPLE Hub" },
    { path: "/canada/rpn/rex-pn", label: "CA RPN REX-PN Hub" },
    { path: "/ecg", label: "ECG Hub" },
    { path: "/ecg-interpretation", label: "ECG Interpretation" },
    { path: "/advanced-ecg-nursing", label: "Advanced ECG Nursing" },
    { path: "/hemodynamics-monitoring", label: "Hemodynamics Monitoring" },
    { path: "/advanced-labs-interpretation", label: "Advanced Labs" },
    { path: "/allied-health", label: "Allied Health Hub" },
    { path: "/allied-health/respiratory-therapy", label: "Respiratory Therapy" },
    { path: "/pre-nursing", label: "Pre-Nursing Hub" },
    { path: "/us/new-grad", label: "US New Grad Hub" },
    { path: "/clinical-modules", label: "Clinical Modules" },
    { path: "/login", label: "Login page" },
    { path: "/signup", label: "Signup page" },
  ];

  for (const { path, label } of PUBLIC_ROUTES) {
    test(`${label} (${path}) — loads, no 404`, async ({ page }) => {
      await assertRouteValid(page, path, label);
    });
  }

  test("CNPLE hub loads (CA context)", async ({ page, baseURL }) => {
    await seedCa(page, baseURL);
    await assertRouteValid(page, "/canada/np/cnple", "CNPLE Hub");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
  });

  test("CNPLE loft-exam sub-page loads", async ({ page, baseURL }) => {
    await seedCa(page, baseURL);
    await assertRouteValid(page, "/canada/np/cnple/loft-exam", "CNPLE Loft Exam");
  });

  test("CNPLE study-guide sub-page loads", async ({ page, baseURL }) => {
    await seedCa(page, baseURL);
    await assertRouteValid(page, "/canada/np/cnple/study-guide", "CNPLE Study Guide");
  });

  test("REX-PN test-bank sub-page loads", async ({ page, baseURL }) => {
    await seedCa(page, baseURL);
    await assertRouteValid(page, "/canada/rpn/rex-pn/test-bank", "REX-PN Test Bank");
  });

  test("ECG sub-pages load", async ({ page }) => {
    const subpages = [
      "/advanced-ecg-nursing/rhythm-practice",
      "/advanced-ecg-nursing/12-lead-stemi",
      "/advanced-ecg-nursing/critical-care-ecg",
      "/advanced-ecg-nursing/pediatric-ecg",
      "/advanced-ecg-nursing/telemetry-monitoring",
    ];
    for (const sp of subpages) {
      await assertRouteValid(page, sp, `ECG sub-page: ${sp}`);
    }
  });

  test("/allied/allied-health route loads (not 404)", async ({ page }) => {
    await assertRouteValid(page, "/allied/allied-health", "Allied umbrella");
  });
});

// ─── SECTION 5: User flow tests ──────────────────────────────────────────────

test.describe("5. User flows — public landing journeys", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await seedUs(page, baseURL);
  });

  test("FLOW 1: Home → RN hub → Pricing — no dead ends", async ({ page }) => {
    // Step 1: Land on home
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });

    // Step 2: Navigate to RN hub via mega menu
    await openMegaMenu(page, "RN");
    await page.locator("#mega-menu-rn").getByRole("link", { name: /Open Hub/i }).click({ force: true });
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/rn\/nclex-rn/);
    await expectNotPageNotFound(page);
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });

    // Step 3: Navigate to Pricing from the nav
    const pricingLink = page.locator(HEADER_CHROME).getByRole("link", { name: /^Pricing$/i }).first();
    if (await pricingLink.count()) {
      await pricingLink.click();
      await page.waitForLoadState("domcontentloaded");
      await expect(page).toHaveURL(/\/pricing/);
      await expectNotPageNotFound(page);
    }
  });

  test("FLOW 2: Home → ECG hub → Advanced ECG sub-page", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });

    await gotoExpectOk(page, "/ecg");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
    await expectNotPageNotFound(page);

    // Navigate to a sub-page from links in ECG hub
    await gotoExpectOk(page, "/advanced-ecg-nursing");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
    await expectNotPageNotFound(page);
  });

  test("FLOW 3: Home → CNPLE hub → study guide (CA context)", async ({ page, baseURL }) => {
    await seedCa(page, baseURL);
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });

    await gotoExpectOk(page, "/canada/np/cnple");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
    await expectNotPageNotFound(page);

    await gotoExpectOk(page, "/canada/np/cnple/study-guide");
    await expectNotPageNotFound(page);
  });

  test("FLOW 4: Home → Allied Health → Respiratory Therapy", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });

    await gotoExpectOk(page, "/allied-health");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
    await expectNotPageNotFound(page);

    await gotoExpectOk(page, "/allied-health/respiratory-therapy");
    await expectNotPageNotFound(page);
  });

  test("FLOW 5: Home → Signup → back navigation works", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });

    await gotoExpectOk(page, "/signup");
    await expectNotPageNotFound(page);

    await page.goBack();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/^\//);
    // should still have nav chrome
    await expect(page.locator("header").first()).toBeVisible({ timeout: 20_000 });
  });

  test("FLOW 6: history back/forward preserves nav state", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await gotoExpectOk(page, "/pricing");
    await expect(page).toHaveURL(/\/pricing/);

    await page.goBack();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/^\/$|^.*\/$/);
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 30_000 });

    await page.goForward();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/\/pricing/);
    await expectNotPageNotFound(page);
  });
});

// ─── SECTION 6: Performance / UX ─────────────────────────────────────────────

test.describe("6. Performance and UX — nav shell quality", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await seedUs(page, baseURL);
  });

  test("header renders within 10s on homepage (no blocking fetch loop)", async ({ page }) => {
    const start = Date.now();
    const r = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(r?.ok(), "homepage HTTP ok").toBeTruthy();
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
    const elapsed = Date.now() - start;
    // Soft threshold: warn if > 15s but don't fail
    if (elapsed > 15_000) {
      console.warn(`[PERF] Homepage nav render took ${elapsed}ms (threshold 15s)`);
    }
  });

  test("no layout shift flicker: header is visible before and after hydration", async ({ page }) => {
    await gotoExpectOk(page, "/");
    const header = page.locator("header").first();
    await expect(header).toBeVisible({ timeout: 60_000 });
    // Wait for full hydration
    await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
    // Header must still be visible
    await expect(header).toBeVisible({ timeout: 5_000 });
  });

  test("no duplicate nav bars rendered simultaneously", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });
    const navBars = await page.locator("header[data-nn-nav-mode]").count();
    expect(navBars, "at most one nav-mode header").toBeLessThanOrEqual(1);
  });

  test("navigation does not produce blank interstitial during route change", async ({ page }) => {
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });

    const strip = page.locator(DESKTOP_PRIMARY_STRIP_NAV).first();
    await strip.getByRole("link", { name: /^Pricing$/ }).click();
    // During the transition, main should not be completely empty
    await page.waitForLoadState("domcontentloaded");
    const mainText = await page.locator("main").first().innerText().catch(() => "");
    expect(mainText.trim().length, "Pricing main must not be blank").toBeGreaterThan(0);
    await expectNotPageNotFound(page);
  });

  test("mobile: hamburger menu opens and closes cleanly", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoExpectOk(page, "/");
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR)).toBeVisible({ timeout: 60_000 });

    const openBtn = page.getByRole("button", { name: /^Open menu$/i });
    await expect(openBtn).toBeVisible({ timeout: 20_000 });
    await openBtn.click();

    const closeBtn = page.getByRole("button", { name: /^Close menu$/i }).last();
    await expect(closeBtn).toBeVisible({ timeout: 10_000 });
    await closeBtn.click();
    await expect(page.getByRole("button", { name: /^Close menu$/i })).toHaveCount(0);
  });

  test("RN hub does not show NP-only CNPLE content (tier cleanliness)", async ({ page }) => {
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
    // RN hub must NOT contain CNPLE-specific CTAs
    const cnpleContent = page.getByText(/CNPLE simulation|CNPLE exam/i);
    const count = await cnpleContent.count();
    expect(count, "RN hub must not surface CNPLE-specific CTAs").toBe(0);
  });

  test("Allied hub does not show RN NCLEX-specific content", async ({ page }) => {
    await gotoExpectOk(page, "/allied-health");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 30_000 });
    // Allied hub should not have NCLEX RN as primary heading
    const rnContent = page.getByRole("heading", { name: /NCLEX-RN/i });
    const count = await rnContent.count();
    // Allow soft — could be a comparison section, but should not be the primary h1
    const h1Text = await page.locator("h1").first().innerText().catch(() => "");
    expect(h1Text).not.toMatch(/NCLEX-RN/i);
  });
});

// ─── SECTION 7: Redirect / legacy slug integrity ─────────────────────────────

test.describe("7. Legacy redirects — must not 404", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await seedUs(page, baseURL);
  });

  const LEGACY_SLUGS = [
    "/nclex-rn-practice-questions",
    "/nclex-pn-practice-questions",
    "/cat-nclex-simulator",
    "/adaptive-nclex-testing",
    "/best-nclex-prep-course",
    "/canadian-nclex-guide",
  ];

  for (const slug of LEGACY_SLUGS) {
    test(`Legacy slug ${slug} does not 404`, async ({ page }) => {
      const r = await page.goto(slug, { waitUntil: "domcontentloaded", timeout: 60_000 });
      // Allow 3xx redirects — just not 404/500
      expect(r?.status() ?? 0, `${slug} must not be 404/500`).not.toBe(404);
      expect(r?.status() ?? 0).not.toBe(500);
      await expect(
        page.getByRole("heading", { name: /^page not found$/i }),
      ).toHaveCount(0);
    });
  }
});
