/**
 * Audits primary navigation for an **entitled paid learner** (storage from `setup-paid-auth`).
 *
 * Covers:
 * - Desktop: header `Learner navigation` (on `/`) + `/app` learner shell `Learner primary actions`
 * - Mobile: hamburger drawer (Study Navigation links) + learner bottom bar
 *
 * Mega-menu dropdowns (RN/PN/…) appear only in **public** marketing mode; entitled learners use the
 * study link strip instead — this spec skips empty mega selectors and documents that gap.
 *
 * Run:
 *   cd nursenest-core && E2E_PAID_EMAIL=... E2E_PAID_PASSWORD=... npx playwright test tests/e2e/paid-user/paid-user-primary-nav-audit.spec.ts --project=chromium-paid
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { requireOrigin } from "../helpers/navigation-e2e";
import {
  attachHydrationAudit,
  auditNavLinks,
  learnerBottomNavLinks,
  learnerHeaderNav,
  learnerMobileDrawerStudyLinks,
  learnerShellPrimaryNav,
  openMobileNavMenu,
} from "../helpers/nav-primary-audit";

test.describe("Paid user — primary nav audit", () => {
  test("desktop — header + learner shell links load with headings (no 404 / hydration)", async ({
    page,
    baseURL,
  }) => {
    requireOrigin(baseURL);
    const obs = attachPageObservers(page, { profile: "app" });
    const hyd = attachHydrationAudit(page);
    try {
      await page.setViewportSize({ width: 1280, height: 800 });

      await test.step("Header — Learner navigation on homepage", async () => {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await expect(page.locator('[data-nn-nav-mode="learner"]')).toBeVisible({ timeout: 30_000 });
        const nav = learnerHeaderNav(page);
        await expect(nav).toBeVisible({ timeout: 15_000 });
        const links = nav.getByRole("link");
        await auditNavLinks({
          page,
          baseURL: baseURL!,
          startUrl: "/",
          links,
          label: "desktop.header.learnerNav",
        });
      });

      await test.step("Learner shell — primary actions on /app", async () => {
        const nav = learnerShellPrimaryNav(page);
        await expect(nav).toBeVisible({ timeout: 15_000 });
        const links = nav.getByRole("link");
        await auditNavLinks({
          page,
          baseURL: baseURL!,
          startUrl: "/app",
          links,
          label: "desktop.shell.primaryNav",
        });
      });

      expect(hyd.lines, `Hydration errors:\n${hyd.lines.join("\n")}`).toEqual([]);
      const serious = obs.consoleErrors.filter(
        (x) => !/cookie|Content Security Policy|third-party|analytics/i.test(x),
      );
      expect(serious, serious.slice(0, 5).join("\n")).toEqual([]);
    } finally {
      hyd.dispose();
      obs.dispose();
    }
  });

  test("mobile — drawer + bottom navigation", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    const obs = attachPageObservers(page, { profile: "app" });
    const hyd = attachHydrationAudit(page);
    try {
      await page.setViewportSize({ width: 390, height: 844 });

      await test.step("Hamburger — Study Navigation links", async () => {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await expect(page.locator('[data-nn-nav-mode="learner"]')).toBeVisible({ timeout: 30_000 });
        const links = learnerMobileDrawerStudyLinks(page);
        await auditNavLinks({
          page,
          baseURL: baseURL!,
          startUrl: "/",
          links,
          label: "mobile.drawer.studyLinks",
          beforeEachClick: async () => {
            await openMobileNavMenu(page);
            await expect(links.first()).toBeVisible({ timeout: 15_000 });
          },
        });
      });

      await test.step("Bottom bar — learner destinations", async () => {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        const bottom = learnerBottomNavLinks(page);
        await expect(bottom.first()).toBeVisible({ timeout: 30_000 });
        await auditNavLinks({
          page,
          baseURL: baseURL!,
          startUrl: "/app",
          links: bottom,
          label: "mobile.bottomNav",
        });
      });

      expect(hyd.lines, `Hydration errors:\n${hyd.lines.join("\n")}`).toEqual([]);
      const serious = obs.consoleErrors.filter(
        (x) => !/cookie|Content Security Policy|third-party|analytics/i.test(x),
      );
      expect(serious, serious.slice(0, 5).join("\n")).toEqual([]);
    } finally {
      hyd.dispose();
      obs.dispose();
    }
  });

  test("marketing mega tier — skipped when learner mode (paid user)", async ({ page, baseURL }) => {
    requireOrigin(baseURL);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-nn-nav-mode="learner"]')).toBeVisible({ timeout: 30_000 });
    const megaRow = page.locator(".nn-header-nav-row");
    await expect(megaRow).toHaveCount(0);
  });
});
