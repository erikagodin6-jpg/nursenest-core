import { expect, test, type Page } from "@playwright/test";
import { resolveE2eAppBaseUrl } from "./helpers/e2e-env";

const MODULE_ROUTES = [
  { label: "Flashcards", path: "/app/flashcards?pathwayId=ca-rn-nclex-rn", shellOptional: true },
  { label: "Labs", path: "/app/labs?pathwayId=ca-rn-nclex-rn" },
  { label: "Med Calculations", path: "/app/med-calculations?pathwayId=ca-rn-nclex-rn" },
  { label: "Clinical Skills", path: "/app/clinical-skills?pathwayId=ca-rn-nclex-rn" },
  { label: "ECG", path: "/app/ecg?pathwayId=ca-rn-nclex-rn", shellOptional: true },
  { label: "Pharmacology", path: "/app/pharmacology?pathwayId=ca-rn-nclex-rn", shellOptional: true },
];

const SENTENCE_CASE_REGRESSIONS = [
  "Clinical lab workstation",
  "Medication calculation practice",
  "Fluid balance calculator",
  "Clinical skills simulation lab",
  "Study progress dashboard",
];

async function skipIfAuthRedirect(page: Page, label: string) {
  if (/\/login|\/signin|\/sign-in/i.test(page.url())) {
    test.skip(true, `${label} requires authenticated storage state in this Playwright config.`);
  }
}

async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe("Global Learning Module Layout", () => {
  for (const route of MODULE_ROUTES) {
    test(`${route.label} keeps canonical learner navigation and title standards`, async ({ page, baseURL }) => {
      await page.goto(new URL(route.path, resolveE2eAppBaseUrl(baseURL)).toString(), {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      await skipIfAuthRedirect(page, route.label);

      await expect(page.locator("body")).toBeVisible({ timeout: 30_000 });
      await expect(page.locator('[data-testid="learner-shell"], .nn-learner-shell').first()).toBeVisible();
      await expect(page.locator(".nn-learner-shell-nav-row").first()).toBeVisible();
      await expect(page.getByRole("button", { name: /theme/i }).first()).toBeVisible();

      const bodyText = await page.locator("body").innerText();
      const title = await page.title();
      const haystack = `${title}\n${bodyText}`;
      const found = SENTENCE_CASE_REGRESSIONS.filter((phrase) => haystack.includes(phrase));
      expect(found, `${route.label} contains sentence-case title regressions`).toEqual([]);
    });

    test(`${route.label} has responsive shared layout spacing where applicable`, async ({ page, baseURL }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(new URL(route.path, resolveE2eAppBaseUrl(baseURL)).toString(), {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      await skipIfAuthRedirect(page, route.label);

      await assertNoHorizontalOverflow(page);

      const shell = page.locator("[data-nn-learning-module-shell]").first();
      const hasShell = await shell.isVisible().catch(() => false);
      if (!hasShell) {
        expect(route.shellOptional, `${route.label} should use the shared module shell`).toBe(true);
        return;
      }

      const sidebar = page.locator("[data-nn-learning-module-sidebar]").first();
      const main = page.locator("[data-nn-learning-module-main]").first();
      await expect(sidebar).toBeVisible();
      await expect(main).toBeVisible();

      const sidebarBox = await sidebar.boundingBox();
      const mainBox = await main.boundingBox();
      expect(sidebarBox?.width ?? 0, `${route.label} sidebar must stay within the 240-280px contract`).toBeLessThanOrEqual(280);
      expect(sidebarBox?.width ?? 0, `${route.label} sidebar should not collapse on desktop`).toBeGreaterThanOrEqual(230);
      if (sidebarBox && mainBox) {
        expect(mainBox.x - (sidebarBox.x + sidebarBox.width), `${route.label} needs a 24-40px sidebar/content gap`).toBeGreaterThanOrEqual(24);
      }

      const cards = page.locator("[data-nn-learning-module-card]");
      if ((await cards.count()) > 0) {
        const firstCard = cards.first();
        await expect(firstCard).toBeVisible();
        await firstCard.focus();
        await expect(firstCard).toBeFocused();
      }
    });

    test(`${route.label} mobile layout does not overflow`, async ({ page, baseURL }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(new URL(route.path, resolveE2eAppBaseUrl(baseURL)).toString(), {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });
      await skipIfAuthRedirect(page, route.label);
      await expect(page.locator("body")).toBeVisible({ timeout: 30_000 });
      await assertNoHorizontalOverflow(page);
    });
  }
});
