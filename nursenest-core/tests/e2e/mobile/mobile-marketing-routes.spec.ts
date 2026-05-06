/**
 * Additional public marketing routes — width + menu (complements mobile-regression.spec.ts).
 */
import { expect, test } from "@playwright/test";
import { setGlobalRegionCookie } from "../helpers/country-selector";
import { getE2eBaseURL } from "../helpers/e2e-env";
import {
  assertMobileHorizontalLayoutHealth,
  assertOpenMenuButtonMinSize,
} from "../helpers/mobile-layout-health";
import { dismissMarketingScrims } from "../helpers/mobile-usability-audit";
import { MARKETING_PUBLIC_SELECTOR } from "../helpers/navigation-e2e";
import { LESSON_FLOW_PATHWAY_QA } from "@/lib/qa/lesson-flow-pathways";

const baseURL = getE2eBaseURL();
const usRn = LESSON_FLOW_PATHWAY_QA.find((p) => p.pathwayId === "us-rn-nclex-rn");
if (!usRn) throw new Error("us-rn-nclex-rn missing from LESSON_FLOW_PATHWAY_QA");

const ROUTES = ["/signup", usRn.hubPath, usRn.lessonsPath, "/blog"] as const;

test.describe("Mobile — marketing route grid", () => {
  test.beforeEach(async ({ page }) => {
    await setGlobalRegionCookie(page, "us", baseURL);
  });

  for (const route of ROUTES) {
    test(`bounded width: ${route}`, async ({ page }) => {
      const res = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(res?.ok(), `${route} HTTP ${res?.status()}`).toBeTruthy();
      await dismissMarketingScrims(page);
      await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });
      await assertMobileHorizontalLayoutHealth(page, route);
      await assertOpenMenuButtonMinSize(page);
    });
  }

  test("hamburger open/close keeps document width", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissMarketingScrims(page);
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });
    await page.getByRole("button", { name: /^Open menu$/ }).click();
    await expect(page.getByRole("button", { name: /^Close menu$/ }).last()).toBeVisible({ timeout: 15_000 });
    await assertMobileHorizontalLayoutHealth(page, "menu-open");
    await page.getByRole("button", { name: /^Close menu$/ }).last().click();
  });
});
