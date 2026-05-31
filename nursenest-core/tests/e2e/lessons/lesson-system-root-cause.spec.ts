/**
 * Root-cause guard for lesson system cards.
 *
 * This test intentionally starts at the public/pathway lesson hub card layer,
 * because the production defect was a clickable-looking category card whose
 * category-level destination did not load the system lesson list.
 */
import { expect, test } from "@playwright/test";

const HUB = "/canada/rn/nclex-rn/lessons";
const SYSTEMS = [
  { label: "Cardiovascular", slug: "cardiovascular" },
  { label: "Respiratory", slug: "respiratory" },
  { label: "Neurological", slug: "neurological" },
  { label: "Endocrine", slug: "endocrine" },
  { label: "Renal", slug: "renal" },
  { label: "GI", slug: "gastrointestinal" },
] as const;

test.describe("Lesson System Card Root Cause", () => {
  for (const system of SYSTEMS) {
    test(`${system.label} card exposes a real system route and renders lessons`, async ({ page }) => {
      await page.goto(HUB, { waitUntil: "domcontentloaded" });

      const card = page.locator(`[data-lesson-system-card]`).filter({ hasText: system.label }).first();
      await expect(card, `${system.label} system card should render`).toBeVisible({ timeout: 10_000 });

      const href = await card.getAttribute("data-lesson-system-href");
      expect(href, `${system.label} should expose a category destination`).toContain("/lessons?topicSlug=");
      expect(href, `${system.label} should not point to the same-page library hash`).not.toContain("#pathway-lesson-library");

      const routeResponse = await page.goto(href!, { waitUntil: "domcontentloaded" });
      expect(routeResponse?.status(), `${system.label} route should not 404`).not.toBe(404);
      await expect(page.locator("[data-nn-qa-pathway-lessons-hub='true']")).toBeVisible({ timeout: 10_000 });
      await expect(page.getByText(/lesson library/i).first()).toBeVisible();
      await expect(page.getByText(/No lessons match this topic filter yet/i)).toHaveCount(0);
    });
  }
});
