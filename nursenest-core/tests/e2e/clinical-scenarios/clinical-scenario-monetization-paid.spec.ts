/**
 * Paid RN clinical scenario + cross-tier guard (requires `setup-paid-auth` + `PAID_USER_AUTH_FILE`).
 *
 * @see clinical-scenario-monetization-env.ts
 */
import { expect, test } from "@playwright/test";
import { expectPaidLearnerShellReady } from "../helpers/paid-learner-shell";
import { hasPaidTestCredentials } from "../helpers/paid-test-credentials";
import {
  getNpPremiumClinicalScenarioIdForCrossTier,
  getRnPremiumClinicalScenarioId,
} from "../helpers/clinical-scenario-monetization-env";

const RN_PATHWAY = "us-rn-nclex-rn";

function scenarioDetailUrl(pathwayId: string, scenarioId: string) {
  return `/app/clinical-scenarios?pathwayId=${encodeURIComponent(pathwayId)}&scenarioId=${encodeURIComponent(scenarioId)}`;
}

async function waitForBranchingShell(page: import("@playwright/test").Page) {
  await expect(page.getByText(/Clinical simulation/i).first()).toBeVisible({ timeout: 90_000 });
  await expect(page.getByText(/Clinical judgment check/i).first()).toBeVisible({ timeout: 30_000 });
}

/** First option in the judgment card, then commit (works for smoke; scenario should be branching-engine). */
async function pickFirstJudgmentOptionAndCommit(page: import("@playwright/test").Page) {
  const judgment = page.locator("section").filter({ hasText: /Clinical judgment check/i }).first();
  await expect(judgment).toBeVisible({ timeout: 30_000 });
  await judgment.getByRole("button").first().click();
  await page.getByRole("button", { name: /Commit & continue/i }).click();
}

test.describe.skip(!hasPaidTestCredentials(), "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD (or PLAYWRIGHT_TEST_*).", () => {
  test.describe("Clinical scenarios — paid + cross-tier", () => {
    test.describe.configure({ mode: "serial" });

    test("paid RN completes premium branching scenario and reaches outcome screen", async ({ page }) => {
      const scenarioId = getRnPremiumClinicalScenarioId();
      test.skip(!scenarioId, "Set E2E_CLINICAL_RN_PREMIUM_SCENARIO_ID (premium, ≥2 stages, RN pathway, branching options).");

      await page.goto(scenarioDetailUrl(RN_PATHWAY, scenarioId!), { waitUntil: "domcontentloaded" });
      await expectPaidLearnerShellReady(page, "clinical paid scenario shell");
      await waitForBranchingShell(page);

      await expect(page.getByText(/Stage 1 of/i)).toBeVisible();
      await pickFirstJudgmentOptionAndCommit(page);

      await expect(page.getByText(/Stage 2 of/i)).toBeVisible({ timeout: 30_000 });
      await pickFirstJudgmentOptionAndCommit(page);

      await expect(page.getByTestId("clinical-scenario-outcome-screen")).toBeVisible({ timeout: 45_000 });
      await expect(page.getByTestId("clinical-scenario-paywall")).toHaveCount(0);
    });

    test("RN paid session cannot open NP premium scenario under RN pathway (404)", async ({ page }) => {
      const npScenarioId = getNpPremiumClinicalScenarioIdForCrossTier();
      test.skip(!npScenarioId, "Set E2E_CLINICAL_NP_PREMIUM_SCENARIO_ID (scenario with pathwayId !== us-rn-nclex-rn).");

      await page.goto(scenarioDetailUrl(RN_PATHWAY, npScenarioId!), { waitUntil: "domcontentloaded" });
      await expectPaidLearnerShellReady(page, "clinical cross-tier shell");
      await expect(page.getByRole("heading", { name: /page not found/i })).toBeVisible({ timeout: 30_000 });
      await expect(page.getByText(/404/i).first()).toBeVisible();
    });
  });
});
