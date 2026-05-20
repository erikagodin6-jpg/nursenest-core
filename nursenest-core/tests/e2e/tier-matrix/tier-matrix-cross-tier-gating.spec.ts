/**
 * Cross-tier entitlement: logged-in subscriber must not see paid surfaces for pathways outside
 * `E2E_ENTITLED_PATHWAY_IDS` (comma-separated; defaults to {@link PAID_E2E_DEFAULT_PATHWAY_ID}).
 *
 * Run: `npx playwright test -c playwright.tier-matrix.config.ts tests/e2e/tier-matrix/tier-matrix-cross-tier-gating.spec.ts`
 */
import { test } from "@playwright/test";
import { expectPaidLearnerShellReady, PAID_E2E_DEFAULT_PATHWAY_ID } from "../helpers/paid-learner-shell";
import {
  learnerCatHubUrl,
  learnerFlashcardsUrl,
  learnerLessonsUrl,
  learnerPracticeTestsUrl,
  learnerQuestionsUrl,
  parseEntitledPathwayIdsFromEnv,
  TIER_MATRIX_CANONICAL_PATHWAY_IDS,
} from "../helpers/tier-product-matrix";
import { expectCrossTierBlockedForPathway } from "../helpers/tier-matrix-gating";

const entitled = new Set(parseEntitledPathwayIdsFromEnv(PAID_E2E_DEFAULT_PATHWAY_ID));

test.describe("Tier matrix — cross-tier gating (paid session)", () => {
  test.describe.configure({ mode: "serial" });

  for (const pathwayId of TIER_MATRIX_CANONICAL_PATHWAY_IDS) {
    if (entitled.has(pathwayId)) continue;

    test(`lessons hub blocked for non-entitled pathway ${pathwayId}`, async ({ page }) => {
      await page.goto(learnerLessonsUrl(pathwayId), { waitUntil: "domcontentloaded" });
      await expectPaidLearnerShellReady(page, `cross-tier lessons ${pathwayId}`);
      await expectCrossTierBlockedForPathway(page, `lessons ${pathwayId}`);
    });

    test(`flashcards hub blocked for non-entitled pathway ${pathwayId}`, async ({ page }) => {
      await page.goto(learnerFlashcardsUrl(pathwayId), { waitUntil: "domcontentloaded" });
      await expectPaidLearnerShellReady(page, `cross-tier flashcards ${pathwayId}`);
      await expectCrossTierBlockedForPathway(page, `flashcards ${pathwayId}`);
    });

    test(`questions hub blocked for non-entitled pathway ${pathwayId}`, async ({ page }) => {
      await page.goto(learnerQuestionsUrl(pathwayId), { waitUntil: "domcontentloaded" });
      await expectPaidLearnerShellReady(page, `cross-tier questions ${pathwayId}`);
      await expectCrossTierBlockedForPathway(page, `questions ${pathwayId}`);
    });

    test(`practice-tests hub blocked for non-entitled pathway ${pathwayId}`, async ({ page }) => {
      await page.goto(learnerPracticeTestsUrl(pathwayId), { waitUntil: "domcontentloaded" });
      await expectPaidLearnerShellReady(page, `cross-tier practice-tests ${pathwayId}`);
      await expectCrossTierBlockedForPathway(page, `practice-tests ${pathwayId}`);
    });

    test(`CAT entry hub blocked for non-entitled pathway ${pathwayId}`, async ({ page }) => {
      await page.goto(learnerCatHubUrl(pathwayId), { waitUntil: "domcontentloaded" });
      await expectPaidLearnerShellReady(page, `cross-tier cat ${pathwayId}`);
      await expectCrossTierBlockedForPathway(page, `cat ${pathwayId}`);
    });
  }
});
