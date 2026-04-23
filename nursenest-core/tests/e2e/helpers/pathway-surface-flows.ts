/**
 * Reusable paid learner checks per `pathwayId` — lessons hub sample, flashcards, question bank, CAT.
 * No mocks; uses the same routes as production learner app.
 */
import { expect, type Page } from "@playwright/test";
import type { PageObservers } from "./attach-observers";
import {
  LESSON_HUB_CARD_LINKS,
  paidFlashcardsHubUrl,
  paidLessonsHubUrl,
  paidQuestionsHubUrl,
} from "./paid-content-discovery";
import { learnerAppMainLandmark, waitForAuthenticatedLearnerShell } from "./paid-learner-shell";
import { expectNoSubscriptionPaywall } from "./paid-surface-assertions";
import { dismissFlashcardResumeIfPresent } from "./paid-user-suite";
import { answerOneCatExamItem } from "./cat-practice-exam-flow";

const MAIN_MIN_CHARS = 80;
const LESSON_SAMPLE_MAX = 8;
const CAT_START = "[data-nn-qa-practice-hub-start-test]";

export async function answerOneCatItem(page: Page): Promise<void> {
  await answerOneCatExamItem(page);
}

export function assertCleanObservers(observers: PageObservers, label: string): void {
  expect(observers.consoleErrors, `[${label}] console: ${observers.consoleErrors.join(" | ")}`).toEqual([]);
  expect(observers.failedRequests, `[${label}] network: ${observers.failedRequests.join(" | ")}`).toEqual([]);
}

export async function pathwayLessonsHubAndSample(args: {
  page: Page;
  pathwayId: string;
  surfaceTag: string;
  observers: PageObservers;
}): Promise<void> {
  const { page, pathwayId, surfaceTag, observers } = args;
  await page.goto(paidLessonsHubUrl(pathwayId), { waitUntil: "domcontentloaded" });
  await waitForAuthenticatedLearnerShell(page);
  await expectNoSubscriptionPaywall(page, `${surfaceTag} lessons hub`);

  const main = learnerAppMainLandmark(page);
  await expect(main).toBeVisible({ timeout: 120_000 });
  const hubText = await main.innerText().catch(() => "");
  expect(hubText.length, "lessons hub main not empty").toBeGreaterThan(MAIN_MIN_CHARS);

  const linkLoc = page.locator(LESSON_HUB_CARD_LINKS);
  await expect(linkLoc.first()).toBeVisible({ timeout: 120_000 });
  const n = Math.min(LESSON_SAMPLE_MAX, await linkLoc.count());
  expect(n, "at least one lesson link").toBeGreaterThan(0);

  const hrefs: string[] = [];
  for (let i = 0; i < n; i++) {
    const href = await linkLoc.nth(i).getAttribute("href");
    if (!href) continue;
    try {
      hrefs.push(new URL(href, page.url()).href);
    } catch {
      /* skip */
    }
  }
  const unique = [...new Set(hrefs)].slice(0, LESSON_SAMPLE_MAX);

  for (let i = 0; i < unique.length; i++) {
    const url = unique[i]!;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await waitForAuthenticatedLearnerShell(page).catch(() => {});
    await expectNoSubscriptionPaywall(page, `${surfaceTag} lesson ${i + 1}`);

    const m = learnerAppMainLandmark(page);
    await expect(m).toBeVisible({ timeout: 90_000 });
    const body = await m.innerText().catch(() => "");
    expect(body.length, `lesson main has content (${url})`).toBeGreaterThan(MAIN_MIN_CHARS);

    assertCleanObservers(observers, `${surfaceTag}-lesson-${i + 1}`);
  }
}

export async function pathwayFlashcardsSurface(args: {
  page: Page;
  pathwayId: string;
  surfaceTag: string;
  observers: PageObservers;
}): Promise<void> {
  const { page, pathwayId, surfaceTag, observers } = args;
  await page.goto(paidFlashcardsHubUrl(pathwayId), { waitUntil: "domcontentloaded" });
  await waitForAuthenticatedLearnerShell(page);
  await expectNoSubscriptionPaywall(page, `${surfaceTag} flashcards hub`);

  const main = learnerAppMainLandmark(page);
  await expect(main).toBeVisible({ timeout: 120_000 });

  const learnFirst = page.locator('a[href*="/app/flashcards/"][href*="mode=learn"]').first();
  await expect(learnFirst).toBeVisible({ timeout: 120_000 });
  const deckHref = await learnFirst.getAttribute("href");
  expect(deckHref).toBeTruthy();

  await page.goto(deckHref!, { waitUntil: "domcontentloaded" });
  await dismissFlashcardResumeIfPresent(page);

  const cardSurface = page.locator(".nn-learner-app main, main").first();
  await expect(cardSurface).toBeVisible({ timeout: 120_000 });
  const cardText0 = (await cardSurface.innerText().catch(() => "")).trim();
  expect(cardText0.length, "flashcard surface has text").toBeGreaterThan(20);

  const reveal = page.getByRole("button", { name: /^Reveal answer$/i });
  if (await reveal.isVisible().catch(() => false)) {
    await reveal.click();
    await expect(cardSurface).toBeVisible({ timeout: 15_000 });
  }
  const nextNav = page.getByRole("button", { name: "Next", exact: true });
  if (await nextNav.isEnabled().catch(() => false)) {
    await nextNav.click();
  }

  assertCleanObservers(observers, `${surfaceTag}-flashcards`);
}

export async function pathwayQuestionBankSurface(args: {
  page: Page;
  pathwayId: string;
  surfaceTag: string;
  observers: PageObservers;
}): Promise<void> {
  const { page, pathwayId, surfaceTag, observers } = args;
  await page.goto(paidQuestionsHubUrl(pathwayId), { waitUntil: "domcontentloaded" });
  await waitForAuthenticatedLearnerShell(page);
  await expectNoSubscriptionPaywall(page, `${surfaceTag} questions hub`);

  const main = learnerAppMainLandmark(page);
  await expect(main).toBeVisible({ timeout: 120_000 });

  const stemish = main.locator("p, article, section, .nn-marketing-body-sm").first();
  await expect(stemish).toBeVisible({ timeout: 120_000 });

  const firstPick = page.locator(".nn-qopt-list").first().locator("button, label").first();
  if (await firstPick.isVisible().catch(() => false)) {
    await firstPick.click();
    const check = page.getByRole("button", { name: /^Check answer$/i });
    if (await check.isVisible().catch(() => false)) {
      await check.click();
    }
  }

  await expect(main).toBeVisible({ timeout: 60_000 });
  assertCleanObservers(observers, `${surfaceTag}-questions`);
}

/**
 * Linear (random/topic) practice exam — matches allied **SIMULATION** readiness
 * (`pathway-readiness-config.ts`: `us-allied-core` / `ca-allied-core` use `engineType: "SIMULATION"`).
 * Do **not** use this to claim NCLEX CAT coverage for allied pathways.
 */
export async function pathwayLinearPracticeExamSurface(args: {
  page: Page;
  pathwayId: string;
  surfaceTag: string;
  observers: PageObservers;
}): Promise<void> {
  const { page, pathwayId, surfaceTag, observers } = args;
  await page.goto(`/app/practice-tests?pathwayId=${encodeURIComponent(pathwayId)}`, {
    waitUntil: "domcontentloaded",
  });
  await waitForAuthenticatedLearnerShell(page);
  await expectNoSubscriptionPaywall(page, `${surfaceTag} practice-tests hub (linear)`);

  const main = learnerAppMainLandmark(page);
  await expect(main).toBeVisible({ timeout: 120_000 });

  await page.locator("[data-nn-qa-practice-hub-start-test]").click();
  await page.locator('[data-testid="button-exam-customize-begin"]').click({ timeout: 30_000 });
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
    throw new Error("No MC buttons or SATA checkboxes found on practice exam surface.");
  }

  const next = page.locator(".nn-question-nav-actions__next").first();
  await expect(next).toBeVisible({ timeout: 30_000 });
  await next.click();

  assertCleanObservers(observers, `${surfaceTag}-linear-practice`);
}

export async function pathwayCatSurface(args: {
  page: Page;
  pathwayId: string;
  surfaceTag: string;
  observers: PageObservers;
}): Promise<void> {
  const { page, pathwayId, surfaceTag, observers } = args;
  await page.goto(
    `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(pathwayId)}`,
    { waitUntil: "domcontentloaded" },
  );
  await waitForAuthenticatedLearnerShell(page);
  await expectNoSubscriptionPaywall(page, `${surfaceTag} CAT hub`);

  await expect(page.locator(CAT_START)).toBeVisible({ timeout: 60_000 });
  await page.locator(CAT_START).click();
  await expect(page.getByRole("button", { name: /^Begin exam$/i })).toBeVisible({ timeout: 15_000 });
  await page.getByRole("button", { name: /^Begin exam$/i }).click();
  await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });

  await expect(page.locator(".nn-cat-question-stem, .nn-marketing-body-sm").first()).toBeVisible({
    timeout: 120_000,
  });

  await answerOneCatItem(page);
  assertCleanObservers(observers, `${surfaceTag}-cat`);
}
