import { expect, test } from "@playwright/test";
import { PAID_E2E_DEFAULT_PATHWAY_ID, waitForAuthenticatedLearnerShell } from "../helpers/paid-learner-shell";
import {
  capturePremiumShellScreenshot,
  expectAtMostOneVisible,
  expectNoHorizontalOverflow,
  preparePremiumShellPage,
  waitForLearnerShellReady,
} from "../helpers/premium-shell-audit-helpers";
import { PUBLIC_MARKETING_THEME_ALLOWLIST } from "@/lib/theme/theme-registry";

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const PATHWAY_ID = PAID_E2E_DEFAULT_PATHWAY_ID;

const LEARNER_SURFACES = [
  { id: "learner-shell", path: "/app" },
  { id: "lessons", path: `/app/lessons?pathwayId=${encodeURIComponent(PATHWAY_ID)}` },
  { id: "flashcards", path: `/app/flashcards?pathwayId=${encodeURIComponent(PATHWAY_ID)}` },
  { id: "practice", path: `/app/practice-tests?pathwayId=${encodeURIComponent(PATHWAY_ID)}` },
  { id: "report", path: "/app/account/report" },
  { id: "readiness", path: "/app/account/readiness" },
  { id: "settings", path: "/app/account/settings" },
];

test.describe("Premium learner shell navigation audit — Option B", () => {
  test("theme matrix includes required convergence themes", async () => {
    expect(new Set(PUBLIC_MARKETING_THEME_ALLOWLIST)).toEqual(new Set(REQUIRED_THEMES));
  });

  for (const viewport of [
    { name: "desktop", width: 1280, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ] as const) {
    test(`learner shell keeps brand, hierarchy, and no overflow on ${viewport.name}`, async ({ page }, testInfo) => {
      test.skip(!testInfo.project.name.includes("paid"), "Learner shell audit requires paid browser storage.");
      test.setTimeout(900_000);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const surface of LEARNER_SURFACES) {
        const themes = surface.id === "learner-shell" ? REQUIRED_THEMES : ["ocean"];
        for (const theme of themes) {
          await test.step(`${surface.id} ${viewport.name} ${theme}`, async () => {
            await preparePremiumShellPage(page, surface.path, theme);
            await waitForLearnerShellReady(page);
            await expect(page.getByTestId("learner-shell").getByText("NurseNest").first()).toBeVisible();
            await expectNoHorizontalOverflow(page);
            await expectAtMostOneVisible(page, ".nn-learner-quick-links-section");
            await capturePremiumShellScreenshot(page, testInfo, surface.id, viewport.name, theme);
          });
        }
      }
    });
  }

  test("dashboard has one canonical launcher and no shell-level full study-next block", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes("paid"), "Dashboard hierarchy audit requires paid browser storage.");
    await page.setViewportSize({ width: 1280, height: 900 });
    await preparePremiumShellPage(page, "/app", "ocean");
    await waitForLearnerShellReady(page);
    await expect(page.locator("[data-nn-dashboard-canonical-launcher]")).toHaveCount(1);
    await expect(page.locator("[data-nn-study-next-pulse]")).toHaveCount(0);
    await expect(page.locator(".nn-learner-quick-links-section")).toHaveCount(0);
    await capturePremiumShellScreenshot(page, testInfo, "dashboard-hierarchy", "desktop", "ocean");
  });

  test("active CAT session suppresses learner chrome before hydration and keeps minimal identity", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes("paid"), "CAT focus audit requires paid browser storage.");
    test.setTimeout(360_000);
    await page.setViewportSize({ width: 1280, height: 900 });
    await preparePremiumShellPage(page, `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PATHWAY_ID)}`, "ocean");
    await waitForAuthenticatedLearnerShell(page, { timeoutMs: 120_000 });
    await page.locator("[data-nn-qa-practice-hub-start-test]").click();
    await page.getByRole("button", { name: /^Begin exam$/i }).click();
    await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });
    await expect(page.locator("[data-nn-cat-minimal-brand-shell]")).toBeVisible({ timeout: 30_000 });
    await expect(page.locator("[data-nn-cat-minimal-brand-shell]").getByText("NurseNest")).toBeVisible();
    await expect(page.locator(".nn-learner-shell-sticky")).toHaveCSS("display", "none");
    await expect(page.locator("[data-nn-learner-shell-study-nav]").filter({ visible: true })).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
    await capturePremiumShellScreenshot(page, testInfo, "cat-focused-mode", "desktop", "ocean");
  });
});
