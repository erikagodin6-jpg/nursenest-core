/**
 * Paid subscriber: one **entitled** `pathwayId` (defaults to `us-rn-nclex-rn`, override with `LEARNING_ROUTES_E2E_PATHWAY_ID`)
 * — flashcards inventory, practice-tests session, question bank rationale, premium lesson headings.
 *
 * Fails loudly when flashcards or questions are missing for that pathway (seed / migration gap).
 *
 * Run: `npx playwright test -c playwright.tier-matrix.config.ts tests/e2e/tier-matrix/tier-matrix-paid-owned-pathway.spec.ts`
 */
import { expect, test } from "@playwright/test";
import { PREMIUM_SECTION_HEADINGS } from "@/lib/lessons/pathway-lesson-premium";
import {
  LESSON_HUB_CARD_LINKS,
  paidFlashcardsHubUrl,
  paidLessonsHubUrl,
  paidQuestionsHubUrl,
} from "../helpers/paid-content-discovery";
import { dismissFlashcardResumeIfPresent } from "../helpers/paid-user-suite";
import { expectPaidLearnerShellReady, learnerAppMainLandmark, PAID_E2E_DEFAULT_PATHWAY_ID } from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";
import { learnerPracticeAliasUrl, learnerPracticeTestsUrl } from "../helpers/tier-product-matrix";

const pathwayId =
  process.env.LEARNING_ROUTES_E2E_PATHWAY_ID?.trim() || PAID_E2E_DEFAULT_PATHWAY_ID;

const REQUIRED_LESSON_HEADINGS: string[] = [
  PREMIUM_SECTION_HEADINGS.introduction,
  PREMIUM_SECTION_HEADINGS.pathophysiology_overview,
  PREMIUM_SECTION_HEADINGS.signs_symptoms,
  PREMIUM_SECTION_HEADINGS.labs_diagnostics,
  PREMIUM_SECTION_HEADINGS.nursing_assessment_interventions,
  PREMIUM_SECTION_HEADINGS.clinical_pearls,
  PREMIUM_SECTION_HEADINGS.client_education,
];

test.describe("Tier matrix — paid owned pathway surfaces", () => {
  test(`/app/practice redirects to practice-tests preserving pathwayId (${pathwayId})`, async ({ page, baseURL }) => {
    test.setTimeout(90_000);
    const from = new URL(learnerPracticeAliasUrl(pathwayId), baseURL ?? "http://127.0.0.1:3000").toString();
    await page.goto(from, { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await page.waitForURL(/\/app\/practice-tests/, { timeout: 60_000 });
    const landed = new URL(page.url());
    expect(landed.pathname).toBe("/app/practice-tests");
    expect(landed.searchParams.get("pathwayId")).toBe(pathwayId);
  });

  test(`flashcards hub has inventory and deck start (${pathwayId})`, async ({ page, baseURL }) => {
    test.setTimeout(180_000);
    const url = new URL(paidFlashcardsHubUrl(pathwayId), baseURL ?? "http://127.0.0.1:3000").toString();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, `tier-matrix flashcards ${pathwayId}`);
    await expectNoSubscriptionPaywall(page, "flashcards owned pathway");

    const notOnAccount = page.getByText("This study track is not on your account");
    if (await notOnAccount.isVisible().catch(() => false)) {
      test.skip(true, `Fixture not entitled for pathwayId=${pathwayId} — expand subscription or set LEARNING_ROUTES_E2E_PATHWAY_ID.`);
    }

    const main = learnerAppMainLandmark(page);
    await expect(main).toBeVisible({ timeout: 120_000 });
    await expect(page.getByText("NN_RENDER_TRACE: flashcards live route")).toBeVisible({ timeout: 30_000 });
    await expect(main.locator("[data-nn-e2e-flashcards-hub]")).toBeVisible({ timeout: 90_000 });

    const bodyCards = main.locator("[data-nn-e2e-body-system-card]");
    const diagnostics = main.locator("[data-nn-e2e-flashcards-lesson-diagnostics]");
    const hasDiagnostics = await diagnostics.isVisible().catch(() => false);
    const diagText = hasDiagnostics ? (await diagnostics.innerText()).toLowerCase() : "";
    const virtualCountPositive = hasDiagnostics && /total generated virtual cards:\s*[1-9]/.test(diagText);
    const cardCount = await bodyCards.count();
    if (!virtualCountPositive && cardCount === 0) {
      throw new Error(
        `No flashcards seeded for pathwayId=${pathwayId}; seed or migration missing. (No body-system cards and no virtual card diagnostics.)`,
      );
    }

    const firstCard = bodyCards.first();
    if (cardCount > 0) {
      await firstCard.click();
      await firstCard.click();
    }

    const startReview = main.locator("[data-nn-e2e-start-review], a[href*='/app/flashcards/']").first();
    await expect(startReview).toBeVisible({ timeout: 90_000 });
    const deckHref = await startReview.getAttribute("href");
    expect(deckHref, "flashcard deck href").toBeTruthy();
    await page.goto(new URL(deckHref!, page.url()).toString(), { waitUntil: "domcontentloaded" });
    await dismissFlashcardResumeIfPresent(page);
    const reveal = page.getByRole("button", { name: /^Reveal answer$/i });
    await expect(reveal).toBeVisible({ timeout: 120_000 });
    await reveal.click();
    const surface = page.locator(".nn-learner-app main, main").first();
    const afterReveal = (await surface.innerText().catch(() => "")).toLowerCase();
    expect(afterReveal.length, "rationale/back text after reveal").toBeGreaterThan(40);
  });

  test(`practice-tests linear session — answer one item (${pathwayId})`, async ({ page, baseURL }) => {
    test.setTimeout(200_000);
    const url = new URL(learnerPracticeTestsUrl(pathwayId), baseURL ?? "http://127.0.0.1:3000").toString();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, `tier-matrix practice-tests ${pathwayId}`);
    await expectNoSubscriptionPaywall(page, "practice-tests");

    const notOnAccount = page.getByText("This study track is not on your account");
    if (await notOnAccount.isVisible().catch(() => false)) {
      test.skip(true, `Fixture not entitled for pathwayId=${pathwayId}.`);
    }

    const main = learnerAppMainLandmark(page);
    await expect(main).toBeVisible({ timeout: 120_000 });
    await expect(
      page.getByText("NN_RENDER_TRACE: practice exams live route (/app/practice-tests)"),
    ).toBeVisible({ timeout: 30_000 });

    const builder = main.locator("[data-nn-e2e-practice-exams-builder]");
    await expect(builder).toBeVisible({ timeout: 60_000 });
    await main.locator("[data-nn-qa-practice-hub-start-test]").click();
    const begin = page.locator('[data-testid="button-exam-customize-begin"]');
    await expect(begin).toBeVisible({ timeout: 45_000 });
    await begin.click();
    await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });

    await expect(page.locator(".nn-question-stem").first()).toBeVisible({ timeout: 120_000 });
    const list = page.locator(".nn-qopt-list").first();
    await expect(list).toBeVisible({ timeout: 60_000 });
    const mcBtn = list.locator("button").first();
    const sataBox = list.locator('input[type="checkbox"]').first();
    if ((await mcBtn.count()) > 0) {
      await mcBtn.click();
    } else if ((await sataBox.count()) > 0) {
      await sataBox.click();
    } else {
      throw new Error(`No practice questions seeded for pathwayId=${pathwayId}; migration missing.`);
    }
    const check = page.getByRole("button", { name: /^Check answer$/i });
    if (await check.isVisible().catch(() => false)) {
      await check.click();
      const rationale = page.locator(
        "aside.nn-question-session-rationale .nn-rationale-prose, aside.nn-question-session-rationale .nn-question-rationale-card__body",
      );
      await expect(rationale.first()).toBeVisible({ timeout: 30_000 });
    }
  });

  test(`lessons hub + first lesson premium headings (${pathwayId})`, async ({ page, baseURL }) => {
    test.setTimeout(200_000);
    await page.goto(new URL(paidLessonsHubUrl(pathwayId), baseURL ?? "http://127.0.0.1:3000").toString(), {
      waitUntil: "domcontentloaded",
    });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, `tier-matrix lessons ${pathwayId}`);
    await expectNoSubscriptionPaywall(page, "lessons hub");

    const notOnAccount = page.getByText("This study track is not on your account");
    if (await notOnAccount.isVisible().catch(() => false)) {
      test.skip(true, `Fixture not entitled for pathwayId=${pathwayId}.`);
    }

    const link = page.locator(LESSON_HUB_CARD_LINKS).first();
    await expect(link).toBeVisible({ timeout: 120_000 });
    const href = await link.getAttribute("href");
    expect(href, "lesson card href").toBeTruthy();
    await page.goto(new URL(href!, baseURL ?? "http://127.0.0.1:3000").toString(), { waitUntil: "domcontentloaded" });
    await expectPaidLearnerShellReady(page, "lesson detail");
    await expectNoSubscriptionPaywall(page, "lesson detail");

    const main = learnerAppMainLandmark(page);
    await expect(main).toBeVisible({ timeout: 90_000 });
    const text = await main.innerText();
    const titleHint = (await page.locator("h1").first().innerText().catch(() => "")).trim();
    const missing = REQUIRED_LESSON_HEADINGS.filter((h) => !text.includes(h));
    expect(
      missing.length,
      `Missing required premium sections for lesson (${titleHint || href}): ${missing.join("; ")}`,
    ).toBe(0);
  });

  test(`questions hub — bank loads (${pathwayId})`, async ({ page, baseURL }) => {
    test.setTimeout(150_000);
    await page.goto(new URL(paidQuestionsHubUrl(pathwayId), baseURL ?? "http://127.0.0.1:3000").toString(), {
      waitUntil: "domcontentloaded",
    });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, `questions ${pathwayId}`);
    await expectNoSubscriptionPaywall(page, "questions");

    const notOnAccount = page.getByText("This study track is not on your account");
    if (await notOnAccount.isVisible().catch(() => false)) {
      test.skip(true, `Fixture not entitled for pathwayId=${pathwayId}.`);
    }

    const main = learnerAppMainLandmark(page);
    await expect(main).toBeVisible({ timeout: 120_000 });
    const stem = main.locator(".nn-question-stem").first();
    const pick = page.locator(".nn-qopt-list").first().locator("button, label").first();
    const hasStem = await stem.isVisible().catch(() => false);
    const hasPick = await pick.isVisible().catch(() => false);
    if (!hasStem && !hasPick) {
      throw new Error(`No practice questions seeded for pathwayId=${pathwayId}; migration missing.`);
    }
  });
});
