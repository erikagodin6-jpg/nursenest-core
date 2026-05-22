import { expect, test } from "@playwright/test";
import { loginWithCredentials } from "./helpers/learner-login";
import { expectPaidLearnerShellReady, PAID_E2E_DEFAULT_PATHWAY_ID } from "./helpers/paid-learner-shell";
import { getQaPaidCredentials } from "./helpers/smoke-credentials";

const forbiddenFallbackLabels = [
  "Hero Title",
  "Cta Cat",
  "Builder Headline",
  "Resume Cta",
  "Review Cta",
  "Study Tools Rail Title",
] as const;

test.describe("Practice Tests hub i18n", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("does not render humanized fallback labels on /app/practice-tests", async ({ page, baseURL }) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_*)");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await page.goto(
      `${baseURL ?? ""}/app/practice-tests?pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`,
      { waitUntil: "domcontentloaded" },
    );
    await expectPaidLearnerShellReady(page, "practice-tests hub i18n");
    await expect(page.locator("[data-nn-practice-exam-hub-convergence]")).toBeVisible({ timeout: 90_000 });

    for (const label of forbiddenFallbackLabels) {
      await expect(page.getByText(label, { exact: true })).toHaveCount(0);
    }

    await expect(page.getByRole("heading", { name: "Practice for your exam" })).toBeVisible();
    await expect(page.getByText("Start", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Build a focused practice set", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Study tools", { exact: true }).first()).toBeVisible();
  });
});
