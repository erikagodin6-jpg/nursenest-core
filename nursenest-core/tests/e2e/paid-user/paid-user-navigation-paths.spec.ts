/**
 * **All primary learner navigation paths** — real clicks from the marketing homepage through the study shell.
 *
 * **Flow**
 * 1. Open `/` (homepage).
 * 2. **Study** — header **Continue study** CTA (`CONTINUE_STUDYING_CTA` in app copy; labelled “Study” in product language).
 * 3. In `Learner primary actions`: **Lessons** → **Flashcards** → **Questions** (nav label **Practice**) → **CAT** (or **Exams**) → **Account**.
 *
 * **Assertions**
 * - Each step: document responds **HTTP 200**, main content present (not blank), not Next.js “Page not found”.
 * - Bounded same-origin link probe in `<main>` (no obvious broken links).
 * - No serious browser console errors (i18n key gaps filtered like other paid nav specs).
 * - No unexpected failed network requests (Playwright `requestfailed`, excluding benign aborts).
 *
 * ```
 * npx playwright test --project=chromium-paid tests/e2e/paid-user/paid-user-navigation-paths.spec.ts
 * ```
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { i18nMissingKeyConsoleLines, seriousConsoleLines } from "../helpers/paid-user-suite";
import { expectMarketingPublicShell, requireOrigin } from "../helpers/navigation-e2e";
import {
  assertLearnerRouteHealthy,
  assertNoObviousBrokenLinksInMain,
  attachHydrationAudit,
  learnerShellPrimaryNav,
} from "../helpers/nav-primary-audit";

async function expectCurrentUrlDocumentHttp200(page: Page, step: string): Promise<void> {
  const url = page.url();
  const res = await page.request.get(url, { maxRedirects: 15, timeout: 45_000 });
  expect(res.status(), `${step}: GET ${url}`).toBe(200);
}

test.describe("Paid user — all navigation paths (homepage → study → shell)", () => {
  test("Study → Lessons → Flashcards → Questions → CAT → Account (200, no 404/blank, clean console)", async ({
    page,
    baseURL,
  }) => {
    test.setTimeout(300_000);
    requireOrigin(baseURL);

    const obs = attachPageObservers(page, { profile: "app", captureConsoleContext: true });
    const hyd = attachHydrationAudit(page);

    try {
      await page.setViewportSize({ width: 1280, height: 800 });

      await test.step("Homepage", async () => {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await expectMarketingPublicShell(page);
      });

      await test.step("Study (Continue study)", async () => {
        const studyLink = page.getByRole("link", { name: /^Continue study$/i }).first();
        await expect(studyLink, "Entitled learner should see Continue study on marketing home").toBeVisible({
          timeout: 60_000,
        });
        await studyLink.click();
        await page.waitForLoadState("domcontentloaded");
        await expect(page.locator('[data-testid="learner-shell"]')).toBeVisible({ timeout: 60_000 });
        await assertLearnerRouteHealthy(page, "nav-paths:study-cta");
        await assertNoObviousBrokenLinksInMain(page, baseURL!);
        await expectCurrentUrlDocumentHttp200(page, "study-cta");
      });

      const studyNav = learnerShellPrimaryNav(page);
      await expect(studyNav).toBeVisible({ timeout: 30_000 });

      const clickShellLink = async (name: RegExp, label: string) => {
        const link = studyNav.getByRole("link", { name });
        await expect(link.first(), `${label}: link visible`).toBeVisible({ timeout: 20_000 });
        await link.first().click();
        await page.waitForLoadState("domcontentloaded");
        await assertLearnerRouteHealthy(page, `nav-paths:${label}`);
        await assertNoObviousBrokenLinksInMain(page, baseURL!);
        await expectCurrentUrlDocumentHttp200(page, label);
      };

      await test.step("Lessons", async () => {
        await clickShellLink(/^Lessons$/i, "lessons");
      });

      await test.step("Flashcards", async () => {
        await clickShellLink(/^Flashcards$/i, "flashcards");
      });

      await test.step("Questions (Practice)", async () => {
        await clickShellLink(/^(Practice|Questions)$/i, "questions");
      });

      await test.step("CAT / Exams", async () => {
        await clickShellLink(/^(CAT(\s+Exams)?|Exams)$/i, "cat");
      });

      await test.step("Account", async () => {
        await clickShellLink(/^Account$/i, "account");
      });

      expect(hyd.lines, `Hydration errors:\n${hyd.lines.join("\n")}`).toEqual([]);
      expect(obs.failedRequests, obs.failedRequests.slice(0, 5).join("\n")).toEqual([]);

      const i18nNav = i18nMissingKeyConsoleLines(obs.consoleErrors);
      if (i18nNav.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`[paid-user-navigation-paths] i18n console (non-fatal):\n${i18nNav.slice(0, 8).join("\n")}`);
      }
      const i18nSet = new Set(i18nNav);
      const serious = seriousConsoleLines(obs.consoleErrors.filter((l) => !i18nSet.has(l)));
      expect(serious, serious.slice(0, 8).join("\n")).toEqual([]);
    } finally {
      hyd.dispose();
      obs.dispose();
    }
  });
});
