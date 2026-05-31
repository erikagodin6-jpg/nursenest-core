/**
 * Lesson system navigation regression guard.
 *
 * Covers the production failure where system/category clicks appeared inert:
 * no loading state, no network-visible outcome, and no lesson list.
 */
import { expect, test } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { getPaidTestCredentials } from "../helpers/paid-test-credentials";
import { learnerAppMainLandmark } from "../helpers/paid-learner-shell";

const PATHWAY_ID = "ca-rn-nclex-rn";

const SYSTEMS = [
  { label: "Cardiovascular", slug: "cardiovascular" },
  { label: "Respiratory", slug: "respiratory" },
  { label: "Neurological", slug: "neurological" },
  { label: "Endocrine", slug: "endocrine" },
  { label: "Renal", slug: "renal" },
  { label: "GI", slug: "gastrointestinal" },
  { label: "Mental Health", slug: "mental-health" },
  { label: "Pediatrics", slug: "pediatrics" },
  { label: "Maternity", slug: "maternity" },
] as const;

test.describe("Lesson System Navigation", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("each required lesson system opens to a visible lesson list", async ({ page, baseURL }) => {
    const creds = getPaidTestCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD or E2E_PAID_* for authenticated lesson navigation.");

    await loginWithCredentials(page, creds!.email, creds!.password, {
      navigationOrigin: new URL(baseURL ?? "http://127.0.0.1:3000").origin,
    });

    for (const system of SYSTEMS) {
      const href = `/app/lessons?topicSlug=${encodeURIComponent(system.slug)}&pathwayId=${encodeURIComponent(PATHWAY_ID)}`;
      await page.goto(href, { waitUntil: "domcontentloaded", timeout: 60_000 });

      const main = learnerAppMainLandmark(page);
      await expect(main.getByRole("heading", { name: /lessons/i }).first()).toBeVisible({ timeout: 3000 });
      await expect(main.getByText(/Loading lessons/i).or(main.locator("[data-testid='lessons-hub-list-summary']")).first()).toBeVisible({
        timeout: 1000,
      });
      await expect(main.locator("[data-nn-premium-lessons-hub-body]")).toBeVisible({ timeout: 3000 });
      await expect(main.locator("[data-testid='lessons-system-error-state']")).toHaveCount(0);
      await expect(main.locator("[data-testid='lessons-system-empty-state']")).toHaveCount(0);
      await expect(main.getByText(new RegExp(`Showing \\d+ of \\d+ lessons`, "i"))).toBeVisible({ timeout: 5000 });
      await expect(page).toHaveURL(new RegExp(`/app/lessons\\?.*topicSlug=${system.slug.replace("-", "[-_]")}`));
    }
  });
});
