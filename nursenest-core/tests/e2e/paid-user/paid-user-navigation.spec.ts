/**
 * **Navigation audit** for an entitled paid learner (stored auth).
 *
 * Covers desktop header `Learner navigation`, `/app` shell `Learner primary actions`,
 * mobile drawer (Study Navigation) + learner bottom bar.
 *
 * Mega-menu tier rows are absent in learner mode — documented in the last test.
 *
 * @see ../helpers/paid-user-suite.ts for run commands.
 */
import { expect, test } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { i18nMissingKeyConsoleLines, seriousConsoleLines } from "../helpers/paid-user-suite";
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

test.describe("Paid user — navigation audit", () => {
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
      const i18nNav = i18nMissingKeyConsoleLines(obs.consoleErrors);
      if (i18nNav.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`[paid-user-navigation] i18n console (non-fatal for nav audit):\n${i18nNav.slice(0, 8).join("\n")}`);
      }
      const i18nSet = new Set(i18nNav);
      const serious = seriousConsoleLines(obs.consoleErrors.filter((l) => !i18nSet.has(l)));
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
      const i18nNav = i18nMissingKeyConsoleLines(obs.consoleErrors);
      if (i18nNav.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`[paid-user-navigation] i18n console (non-fatal for nav audit):\n${i18nNav.slice(0, 8).join("\n")}`);
      }
      const i18nSet = new Set(i18nNav);
      const serious = seriousConsoleLines(obs.consoleErrors.filter((l) => !i18nSet.has(l)));
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
