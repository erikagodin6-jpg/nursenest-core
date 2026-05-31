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
  { label: "Cardiovascular", slug: "cardiovascular", expectedCount: 67 },
  { label: "Respiratory", slug: "respiratory", expectedCount: 101 },
  { label: "Neurological", slug: "neurological", expectedCount: 51 },
  { label: "Gastrointestinal", slug: "gastrointestinal", expectedCount: 42 },
  { label: "Renal & Urinary", slug: "renal", expectedCount: 49 },
  { label: "Endocrine", slug: "endocrine", expectedCount: 38 },
  { label: "Maternal & Newborn", slug: "maternity", expectedCount: 1 },
  { label: "Pediatrics", slug: "pediatrics", expectedCount: 76 },
  { label: "Mental Health", slug: "mental-health", expectedCount: 9 },
  { label: "Pharmacology", slug: "pharmacology", expectedCount: 35 },
  { label: "Infection Control", slug: "infection-control", expectedCount: 54 },
  { label: "Safety & Prioritization", slug: "safety-and-prioritization", expectedCount: 168 },
  { label: "Leadership & Delegation", slug: "leadership-and-delegation", expectedCount: 45 },
  { label: "Exam Strategy", slug: "exam-strategy", expectedCount: 41 },
  { label: "Review Required", slug: "nursing-fundamentals", expectedCount: 20 },
] as const;

test.describe("Lesson System Navigation", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("each required lesson system opens to a visible lesson list", async ({ page, baseURL }) => {
    const creds = getPaidTestCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD or E2E_PAID_* for authenticated lesson navigation.");

    await loginWithCredentials(page, creds!.email, creds!.password, {
      navigationOrigin: new URL(baseURL ?? "http://127.0.0.1:3000").origin,
    });

    expect(SYSTEMS.length).toBeGreaterThan(0);

    for (const system of SYSTEMS) {
      expect(system.expectedCount, `${system.label} should be backed by at least one lesson`).toBeGreaterThan(0);
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
      const url = new URL(page.url());
      expect(url.pathname).toBe("/app/lessons");
      expect(url.searchParams.get("topicSlug")).toBe(system.slug);
    }
  });
});
