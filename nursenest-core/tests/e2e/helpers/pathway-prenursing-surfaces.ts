/**
 * Paid subscriber checks for **canonical pre-nursing surfaces** (`/pre-nursing/*`), not `/app/lessons?pathwayId=…`.
 *
 * Source of truth: `EXAM_PATHWAYS` has **no** `PRE_NURSING` stripe-tier row; pre-nursing study lives under
 * `PRE_NURSING_LESSONS_INDEX_PATH` (`src/lib/lessons/lesson-routes.ts`) and `PRE_NURSING_MODULE_REGISTRY`
 * (`src/content/pre-nursing/pre-nursing-registry.ts`). Mini adaptive exam: `/pre-nursing/mini-cat`
 * (`PreNursingMiniCatRunner`).
 */
import { expect, type Page } from "@playwright/test";
import type { PageObservers } from "./attach-observers";
import { assertCleanObservers } from "./pathway-surface-flows";
import { learnerAppMainLandmark, waitForAuthenticatedLearnerShell } from "./paid-learner-shell";
import { expectNoSubscriptionPaywall } from "./paid-surface-assertions";
import { dismissFlashcardResumeIfPresent } from "./paid-user-suite";

const MAIN_MIN_CHARS = 80;
const LESSON_SAMPLE_MAX = 8;

const PRE_NURSING_LESSON_LINKS = 'a[href^="/pre-nursing/lessons/"]';

export async function preNursingLessonsHubAndSample(args: {
  page: Page;
  surfaceTag: string;
  observers: PageObservers;
}): Promise<void> {
  const { page, surfaceTag, observers } = args;
  await page.goto("/pre-nursing/lessons", { waitUntil: "domcontentloaded" });

  const main = page.locator("main").first();
  await expect(main).toBeVisible({ timeout: 120_000 });
  const hubText = await main.innerText().catch(() => "");
  expect(hubText.length, "pre-nursing lessons hub not empty").toBeGreaterThan(MAIN_MIN_CHARS);

  const linkLoc = page.locator(PRE_NURSING_LESSON_LINKS);
  await expect(linkLoc.first()).toBeVisible({ timeout: 120_000 });
  const n = Math.min(LESSON_SAMPLE_MAX, await linkLoc.count());
  expect(n, "at least one pre-nursing module link").toBeGreaterThan(0);

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
    const m = page.locator("main").first();
    await expect(m).toBeVisible({ timeout: 90_000 });
    const body = await m.innerText().catch(() => "");
    expect(body.length, `pre-nursing module main has content (${url})`).toBeGreaterThan(MAIN_MIN_CHARS);
    assertCleanObservers(observers, `${surfaceTag}-pre-nursing-module-${i + 1}`);
  }
}

export async function preNursingMiniCatSurface(args: {
  page: Page;
  surfaceTag: string;
  observers: PageObservers;
}): Promise<void> {
  const { page, surfaceTag, observers } = args;
  await page.goto("/pre-nursing/mini-cat", { waitUntil: "domcontentloaded" });

  const main = page.locator("main").first();
  await expect(main).toBeVisible({ timeout: 120_000 });

  await page.getByRole("button", { name: /Start adaptive exam/i }).click();

  const firstOpt = page.locator('ul[role="radiogroup"] button[role="radio"]').first();
  await expect(firstOpt).toBeVisible({ timeout: 60_000 });
  await firstOpt.click();

  const next = page.getByRole("button", { name: /Next question/i });
  await expect(next).toBeVisible({ timeout: 30_000 });
  await next.click();

  assertCleanObservers(observers, `${surfaceTag}-pre-nursing-mini-cat`);
}

/**
 * `/app/flashcards` without `pathwayId` — appropriate when there is no `EXAM_PATHWAYS` row for `PRE_NURSING`
 * (hub still resolves decks by subscription tier in API).
 */
export async function preNursingAppFlashcardsSurface(args: {
  page: Page;
  surfaceTag: string;
  observers: PageObservers;
}): Promise<void> {
  const { page, surfaceTag, observers } = args;
  await page.goto("/app/flashcards", { waitUntil: "domcontentloaded" });
  await waitForAuthenticatedLearnerShell(page);
  await expectNoSubscriptionPaywall(page, `${surfaceTag} flashcards hub (no pathwayId)`);

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

  assertCleanObservers(observers, `${surfaceTag}-pre-nursing-flashcards`);
}
