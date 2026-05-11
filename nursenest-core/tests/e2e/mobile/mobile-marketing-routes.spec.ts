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
const caRn = LESSON_FLOW_PATHWAY_QA.find((p) => p.pathwayId === "ca-rn-nclex-rn");
if (!usRn) throw new Error("us-rn-nclex-rn missing from LESSON_FLOW_PATHWAY_QA");
if (!caRn) throw new Error("ca-rn-nclex-rn missing from LESSON_FLOW_PATHWAY_QA");

/** Exclude `/blog` from the fast grid — first paint can exceed default test timeout under dev + DB cold start. */
const ROUTES = [
  { route: "/signup", region: "us" as const },
  { route: usRn.hubPath, region: "us" as const },
  { route: usRn.lessonsPath, region: "us" as const },
  { route: caRn.hubPath, region: "canada" as const },
  { route: caRn.lessonsPath, region: "canada" as const },
] as const;

test.describe("Mobile — marketing route grid", () => {
  for (const { route, region } of ROUTES) {
    test(`bounded width: ${route}`, async ({ page }) => {
      await setGlobalRegionCookie(page, region, baseURL);
      const res = await page.goto(route, { waitUntil: "domcontentloaded", timeout: 120_000 });
      expect(res?.ok(), `${route} HTTP ${res?.status()}`).toBeTruthy();
      await dismissMarketingScrims(page);
      await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });
      await assertMobileHorizontalLayoutHealth(page, route);
      await assertOpenMenuButtonMinSize(page);
    });
  }

  test("hamburger open/close keeps document width", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });
    await dismissMarketingScrims(page);
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 60_000 });
    const openBtn = page.getByRole("button", { name: /open menu/i });
    await expect(openBtn).toBeVisible({ timeout: 30_000 });
    await openBtn.click();
    const closeBtn = page.getByRole("button", { name: /close menu/i }).last();
    await expect(closeBtn).toBeVisible({ timeout: 25_000 });
    await assertMobileHorizontalLayoutHealth(page, "menu-open");
    await closeBtn.click();
  });
});

/**
 * `/blog` is often >4–8m to first `domcontentloaded` against a cold DB in `next dev`, which wedges the
 * whole mobile suite (single worker) and can take down the dev server before the second viewport project.
 * Opt in explicitly when you need browser proof for blog.
 */
test.describe("Mobile — marketing slow routes (opt-in)", () => {
  test.beforeEach(async ({ page }) => {
    await setGlobalRegionCookie(page, "us", baseURL);
  });

  test("bounded width: /blog (slow SSR)", async ({ page }) => {
    test.skip(
      process.env.E2E_MOBILE_INCLUDE_BLOG !== "1",
      "Set E2E_MOBILE_INCLUDE_BLOG=1 to run /blog (can exceed several minutes on cold dev + DB).",
    );
    test.setTimeout(420_000);
    const res = await page.goto("/blog", { waitUntil: "domcontentloaded", timeout: 360_000 });
    expect(res?.ok(), `/blog HTTP ${res?.status()}`).toBeTruthy();
    await dismissMarketingScrims(page);
    await expect(page.locator(MARKETING_PUBLIC_SELECTOR).first()).toBeVisible({ timeout: 90_000 });
    await assertMobileHorizontalLayoutHealth(page, "/blog");
    await assertOpenMenuButtonMinSize(page);
  });
});
