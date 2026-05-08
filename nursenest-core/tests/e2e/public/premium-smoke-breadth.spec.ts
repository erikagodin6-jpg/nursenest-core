/**
 * Premium QA breadth — critical public marketing routes, horizontal overflow at 375px,
 * placeholder-shaped copy guardrails, public marketing theme control (hidden when the marketing
 * allowlist has ≤1 palette — see `PUBLIC_MARKETING_THEME_ALLOWLIST` in `theme-registry.ts`),
 * and optional learner checks when `QA_*` / `E2E_*` gates are set.
 *
 * Run: `BASE_URL=http://127.0.0.1:3000 PLAYWRIGHT_SKIP_WEB_SERVER=1 npx playwright test tests/e2e/public/premium-smoke-breadth.spec.ts --project=chromium`
 */
import { expect, test, type Page } from "@playwright/test";
import {
  publicMarketingThemeChoiceCount,
  themeOptionsForPublicMarketingPicker,
} from "@/lib/theme/theme-registry";
import { HEADER_CHROME } from "../helpers/country-selector";

/**
 * Curated public marketing surfaces — align with `public-site-smoke` / release phase-1 guest routes.
 * Omit locale-specific slugs that may not exist in every DB snapshot.
 */
const CRITICAL_PUBLIC_PATHS = [
  "/",
  "/faq",
  "/blog",
  "/tools",
  "/tools/med-math",
  "/pre-nursing",
  "/question-bank",
  "/us/rn/nclex-rn",
  "/canada/rn/nclex-rn",
] as const;

const PLACEHOLDER_VISIBLE_RE = /lorem ipsum|\btodo:|\btbd\b|\[placeholder\]/i;

async function dismissMarketingScrims(page: Page) {
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Escape");
  }
}

async function assertNoHorizontalOverflow(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => {
    const d = document.documentElement;
    return { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth };
  });
  expect(
    scrollWidth,
    `horizontal overflow: scrollWidth ${scrollWidth} vs clientWidth ${clientWidth}`,
  ).toBeLessThanOrEqual(clientWidth + 2);
}

function primarySurface(page: Page) {
  return page.locator("main, [role='main'], body");
}

test.describe("Premium smoke breadth (public)", () => {
  test.describe.configure({ mode: "serial" });
  test("critical paths — HTTP OK + primary surface visible", async ({ page }) => {
    for (const path of CRITICAL_PUBLIC_PATHS) {
      const r = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(r?.ok(), `${path} → HTTP ${r?.status()}`).toBeTruthy();
      await expect(primarySurface(page).first()).toBeVisible({ timeout: 60_000 });
    }
  });

  test("375px viewport — no document horizontal overflow on key pages", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    for (const path of ["/", "/faq", "/tools", "/blog"]) {
      const r = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(r?.ok(), `${path}`).toBeTruthy();
      await dismissMarketingScrims(page);
      await assertNoHorizontalOverflow(page);
    }
  });

  test("placeholder-shaped copy not visible in primary surface", async ({ page }) => {
    for (const path of ["/", "/faq", "/blog"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const surface = primarySurface(page).first();
      await expect(surface).toBeVisible({ timeout: 60_000 });
      await expect(surface.getByText(PLACEHOLDER_VISIBLE_RE)).toHaveCount(0);
    }
  });

  test("public marketing theme picker lists only allowlisted themes (desktop)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    await expect(page.locator('[data-nn-nav-mode="public"]')).toBeVisible({ timeout: 60_000 });

    const choiceCount = publicMarketingThemeChoiceCount();
    const themeBtn = page.locator(HEADER_CHROME).getByRole("button", { name: /theme/i }).first();

    if (choiceCount <= 1) {
      // Matches SiteHeader / ThemePicker: no redundant single-option control on marketing chrome.
      await expect(themeBtn).toHaveCount(0);
      return;
    }

    await expect(themeBtn).toBeVisible({ timeout: 45_000 });
    await themeBtn.click({ force: true });
    const listbox = page.locator('[role="listbox"]').last();
    await expect(listbox).toBeVisible({ timeout: 15_000 });
    const allowed = themeOptionsForPublicMarketingPicker();
    const options = listbox.getByRole("option");
    await expect(options).toHaveCount(allowed.length);
    for (const opt of allowed) {
      await expect(listbox.getByRole("option", { name: opt.label })).toHaveCount(1);
    }
  });

  test("homepage primary surface exposes navigable anchors", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    const surface = primarySurface(page).first();
    await expect(surface).toBeVisible({ timeout: 60_000 });
    const links = surface.locator("a[href]");
    const n = await links.count();
    expect(n, "homepage should expose anchor links").toBeGreaterThan(0);
    for (let i = 0; i < Math.min(n, 40); i++) {
      const href = (await links.nth(i).getAttribute("href"))?.trim() ?? "";
      expect(href.length, `link ${i} empty href`).toBeGreaterThan(0);
      expect(href, `link ${i} dead hash`).not.toMatch(/^#$/);
    }
  });
});

const learnerGate =
  Boolean(process.env.QA_LEARNER_PUBLIC?.trim()) ||
  Boolean(process.env.E2E_LEARNER_PUBLIC?.trim()) ||
  Boolean(process.env.E2E_PAID_EMAIL?.trim());

test.describe("Premium smoke breadth (learner-gated)", () => {
  test.skip(!learnerGate, "Set QA_LEARNER_PUBLIC=1, E2E_LEARNER_PUBLIC=1, or E2E_PAID_EMAIL for learner checks");

  test("app shell route responds when gated env present", async ({ page }) => {
    const r = await page.goto("/app", { waitUntil: "domcontentloaded" });
    expect(r?.status(), "/app response").toBeLessThan(500);
  });
});
