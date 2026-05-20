/**
 * Free RN monetization + staff QA / full preview (no paid `storageState` — fresh login per flow).
 *
 * @see clinical-scenario-monetization-env.ts
 */
import { expect, test } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { expectOnLearnerApp } from "../helpers/paid-surface-assertions";
import { buildSignedAdminLearnerQaCookieValue, ADMIN_LEARNER_QA_COOKIE } from "../helpers/admin-learner-qa-e2e";
import {
  getFreeRnTestCredentials,
  getRnPremiumClinicalScenarioId,
  getStaffClinicalTestContext,
} from "../helpers/clinical-scenario-monetization-env";

const RN_PATHWAY = "us-rn-nclex-rn";

test.use({ storageState: { cookies: [], origins: [] } });

function scenarioDetailUrl(pathwayId: string, scenarioId: string) {
  return `/app/clinical-scenarios?pathwayId=${encodeURIComponent(pathwayId)}&scenarioId=${encodeURIComponent(scenarioId)}`;
}

async function waitForBranchingShell(page: import("@playwright/test").Page) {
  await expect(page.getByText(/Clinical simulation/i).first()).toBeVisible({ timeout: 90_000 });
  await expect(page.getByText(/Clinical judgment check/i).first()).toBeVisible({ timeout: 30_000 });
}

async function pickFirstJudgmentOptionAndCommit(page: import("@playwright/test").Page) {
  const judgment = page.locator("section").filter({ hasText: /Clinical judgment check/i }).first();
  await expect(judgment).toBeVisible({ timeout: 30_000 });
  await judgment.getByRole("button").first().click();
  await page.getByRole("button", { name: /Commit & continue/i }).click();
}

test.describe("Clinical scenarios — unpaid RN", () => {
  test("free RN: stage 1 then paywall; no stage 2 interaction", async ({ page }) => {
    const scenarioId = getRnPremiumClinicalScenarioId();
    const free = getFreeRnTestCredentials();
    test.skip(!scenarioId, "Set E2E_CLINICAL_RN_PREMIUM_SCENARIO_ID.");
    test.skip(!free, "Set E2E_FREE_RN_EMAIL and E2E_FREE_RN_PASSWORD (RN learner without subscription).");

    await loginWithCredentials(page, free!.email, free!.password, { enterLearnerApp: true });
    await expectOnLearnerApp(page);

    await page.goto(scenarioDetailUrl(RN_PATHWAY, scenarioId!), { waitUntil: "domcontentloaded" });
    await waitForBranchingShell(page);

    await expect(page.getByText(/Stage 1 of/i)).toBeVisible();
    await pickFirstJudgmentOptionAndCommit(page);

    await expect(page.getByTestId("clinical-scenario-paywall")).toBeVisible({ timeout: 45_000 });
    await expect(page.getByText(/Stage 2 of/i)).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Commit & continue/i })).toHaveCount(0);
  });
});

test.describe("Clinical scenarios — staff", () => {
  test.describe.configure({ mode: "serial" });

  test("staff view-as RN unpaid: paywall after stage 1", async ({ page, baseURL }) => {
    const scenarioId = getRnPremiumClinicalScenarioId();
    const staff = getStaffClinicalTestContext();
    test.skip(!scenarioId, "Set E2E_CLINICAL_RN_PREMIUM_SCENARIO_ID.");
    test.skip(!staff, "Set E2E_STAFF_EMAIL, E2E_STAFF_PASSWORD, and E2E_STAFF_USER_ID (user id must match QA cookie sub).");

    await loginWithCredentials(page, staff!.email, staff!.password, { enterLearnerApp: true });
    await expectOnLearnerApp(page);

    const exp = Math.floor(Date.now() / 1000) + 7200;
    const signed = buildSignedAdminLearnerQaCookieValue({
      v: 1,
      sub: staff!.userId,
      exp,
      track: "RN",
      lifecycle: "none",
      country: "US",
    });
    test.skip(!signed, "QA cookie signing failed — set AUTH_SECRET / NEXTAUTH_SECRET (≥16 chars) to match dev server.");

    const origin = baseURL ?? "http://127.0.0.1:3000";
    await page.context().addCookies([
      {
        name: ADMIN_LEARNER_QA_COOKIE,
        value: signed,
        url: origin,
      },
    ]);

    await page.goto(scenarioDetailUrl(RN_PATHWAY, scenarioId!), { waitUntil: "domcontentloaded" });
    await waitForBranchingShell(page);

    await pickFirstJudgmentOptionAndCommit(page);
    await expect(page.getByTestId("clinical-scenario-paywall")).toBeVisible({ timeout: 45_000 });
    await expect(page.getByText(/Stage 2 of/i)).toHaveCount(0);
  });

  test("staff full preview: completes scenario without paywall", async ({ page }) => {
    const scenarioId = getRnPremiumClinicalScenarioId();
    const staff = getStaffClinicalTestContext();
    test.skip(!scenarioId, "Set E2E_CLINICAL_RN_PREMIUM_SCENARIO_ID.");
    test.skip(!staff, "Set E2E_STAFF_EMAIL, E2E_STAFF_PASSWORD, and E2E_STAFF_USER_ID.");

    await loginWithCredentials(page, staff!.email, staff!.password, { enterLearnerApp: true });
    await expectOnLearnerApp(page);

    await page.goto(scenarioDetailUrl(RN_PATHWAY, scenarioId!), { waitUntil: "domcontentloaded" });
    await waitForBranchingShell(page);

    await pickFirstJudgmentOptionAndCommit(page);
    await expect(page.getByText(/Stage 2 of/i)).toBeVisible({ timeout: 45_000 });
    await pickFirstJudgmentOptionAndCommit(page);

    await expect(page.getByTestId("clinical-scenario-outcome-screen")).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId("clinical-scenario-paywall")).toHaveCount(0);
  });
});
