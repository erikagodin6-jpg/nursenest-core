/**
 * Positive CAT matrix — per supported format: load → render → answer → submit → advance.
 * Uses GET interception to swap the live question payload (ids preserved for scoring).
 *
 *   npm run test:e2e:cat-question-types
 */
import { expect, test } from "@playwright/test";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  buildPaidFailureSnapshot,
  collectPaidSurfaceDebug,
  logPaidSurfaceDebug,
  waitForAuthenticatedLearnerShell,
} from "../helpers/paid-learner-shell";
import { attachPageObservers } from "../helpers/attach-observers";
import { logObserverFailureSummary } from "../helpers/log-observer-failure-summary";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import { clickBeginExamAfterPracticeHubStart } from "../helpers/cat-practice-exam-flow";
import {
  CAT_POSITIVE_FIXTURE_STEMS,
  catPositiveBowtieQuestion,
  catPositiveMcqQuestion,
  catPositiveSataQuestion,
} from "../helpers/cat-positive-question-fixtures";

const UNSUPPORTED_ALERT = /specialized question format/i;

async function startCatExamFromHub(page: Page): Promise<void> {
  await page.goto(
    `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`,
    { waitUntil: "domcontentloaded" },
  );
  await waitForAuthenticatedLearnerShell(page);
  await expectNoSubscriptionPaywall(page, "CAT hub");
  await expect(page.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible({ timeout: 60_000 });
  await page.locator("[data-nn-qa-practice-hub-start-test]").click();
  await clickBeginExamAfterPracticeHubStart(page);
  await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });
  await expect(page.locator("[data-cat-exam-root]")).toBeVisible({ timeout: 120_000 });
}

async function assertCatExamTeachingContract(page: Page): Promise<void> {
  await expect(page.locator(".nn-question-session-rationale")).toHaveCount(0);
  await expect(page.locator('[role="alert"]').filter({ hasText: UNSUPPORTED_ALERT })).toHaveCount(0);
}

async function submitAnswerAndAdvance(page: Page): Promise<void> {
  const submit = page.getByRole("button", { name: /^Submit answer$/i });
  await expect(submit).toBeEnabled({ timeout: 30_000 });
  await submit.click();
  const advance = page.locator("[data-nn-qa-cat-exam-advance]");
  await expect(advance).toBeEnabled({ timeout: 60_000 });
  await advance.click();
  await page.waitForLoadState("domcontentloaded").catch(() => {});
}

async function installQuestionPatchRoute(
  page: import("@playwright/test").Page,
  mutator: (body: { index?: number; question?: Record<string, unknown> }) => void,
): Promise<void> {
  await page.route("**/api/practice-tests/*/question*", async (route) => {
    const req = route.request();
    if (req.method() !== "GET") {
      await route.continue();
      return;
    }
    const res = await route.fetch();
    let body: { index?: number; question?: Record<string, unknown> };
    try {
      body = (await res.json()) as { index?: number; question?: Record<string, unknown> };
    } catch {
      await route.fulfill({ response: res });
      return;
    }
    if (body.question && typeof body.index === "number") {
      mutator(body);
    }
    await route.fulfill({
      status: res.status(),
      headers: res.headers(),
      body: JSON.stringify(body),
    });
  });
}

async function assertNoSeriousObservers(
  obs: ReturnType<typeof attachPageObservers>,
  page: Page,
  tag: string,
): Promise<void> {
  const serious = obs.consoleErrors.filter(
    (x) => !/cookie|Content Security Policy|third-party|analytics/i.test(x),
  );
  if (serious.length > 0 || obs.failedRequests.length > 0) {
    logObserverFailureSummary({
      tag,
      routeLabel: "final",
      seriousConsole: serious,
      failedRequests: obs.failedRequests,
      pageUrl: page.url(),
    });
  }
  expect(serious, serious.slice(0, 6).join("\n")).toEqual([]);
  expect(obs.failedRequests, obs.failedRequests.slice(0, 6).join("\n")).toEqual([]);
}

test.describe("CAT — positive question-type matrix", () => {
  test("MCQ — stem, mcq format, answer, advance", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    await installQuestionPatchRoute(page, (body) => {
      if (body.index === 0 && body.question) {
        body.question = { ...catPositiveMcqQuestion(), ...body.question };
      }
    });
    try {
      await startCatExamFromHub(page);
      await assertCatExamTeachingContract(page);
      await expect(page.locator(".nn-cat-question-stem").filter({ hasText: CAT_POSITIVE_FIXTURE_STEMS.mcq })).toBeVisible({
        timeout: 60_000,
      });
      await expect(page.locator('[data-nn-qa-cat-format="mcq"]')).toBeVisible();
      await expect(page.locator('[data-nn-qa-exam-format="mcq"]').first()).toBeVisible();

      const list = page.locator("ul.nn-cat-opt-list").first();
      await expect(list).toBeVisible({ timeout: 60_000 });
      await list.locator("button.nn-cat-opt").first().click();
      await submitAnswerAndAdvance(page);
      await assertCatExamTeachingContract(page);
      await assertNoSeriousObservers(obs, page, "[cat-positive-mcq]");
    } catch (e) {
      logPaidSurfaceDebug(buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-positive-mcq"), obs));
      throw e;
    } finally {
      await page.unroute("**/api/practice-tests/*/question*");
      obs.dispose();
    }
  });

  test("SATA — stem, sata format, checkbox answer, advance", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    await installQuestionPatchRoute(page, (body) => {
      if (body.index === 0 && body.question) {
        body.question = { ...catPositiveSataQuestion(), ...body.question };
      }
    });
    try {
      await startCatExamFromHub(page);
      await assertCatExamTeachingContract(page);
      await expect(page.locator(".nn-cat-question-stem").filter({ hasText: CAT_POSITIVE_FIXTURE_STEMS.sata })).toBeVisible({
        timeout: 60_000,
      });
      await expect(page.locator('[data-nn-qa-cat-format="sata"]')).toBeVisible();
      await expect(page.locator('[data-nn-qa-exam-format="sata"]').first()).toBeVisible();

      const list = page.locator("ul.nn-cat-opt-list").first();
      await expect(list).toBeVisible({ timeout: 60_000 });
      await list.locator("label.nn-cat-opt").nth(0).click();
      await list.locator("label.nn-cat-opt").nth(2).click();
      await submitAnswerAndAdvance(page);
      await assertCatExamTeachingContract(page);
      await assertNoSeriousObservers(obs, page, "[cat-positive-sata]");
    } catch (e) {
      logPaidSurfaceDebug(buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-positive-sata"), obs));
      throw e;
    } finally {
      await page.unroute("**/api/practice-tests/*/question*");
      obs.dispose();
    }
  });

  test("Bowtie — renderer, fill slots, advance", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    await installQuestionPatchRoute(page, (body) => {
      if (body.index === 0 && body.question) {
        body.question = { ...catPositiveBowtieQuestion(), ...body.question };
      }
    });
    try {
      await startCatExamFromHub(page);
      await assertCatExamTeachingContract(page);
      await expect(page.locator(".nn-cat-question-stem").filter({ hasText: CAT_POSITIVE_FIXTURE_STEMS.bowtie })).toBeVisible({
        timeout: 60_000,
      });
      await expect(page.locator('[data-nn-qa-cat-format="bowtie"]')).toBeVisible();
      await expect(page.locator('[data-nn-qa-exam-format="bowtie"]')).toBeVisible();

      const bank = page.locator('.bowtie-ngn [role="listbox"] button[role="option"]');
      await expect(bank).toHaveCount(4, { timeout: 60_000 });
      await bank.nth(0).click();
      await page.getByRole("button", { name: /intervention slot/i }).click();
      await bank.nth(2).click();
      await page.getByRole("button", { name: /monitoring slot/i }).click();
      await bank.nth(3).click();

      await submitAnswerAndAdvance(page);
      await assertCatExamTeachingContract(page);
      await assertNoSeriousObservers(obs, page, "[cat-positive-bowtie]");
    } catch (e) {
      logPaidSurfaceDebug(buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-positive-bowtie"), obs));
      throw e;
    } finally {
      await page.unroute("**/api/practice-tests/*/question*");
      obs.dispose();
    }
  });

  test("Mixed MCQ → SATA → Bowtie — three advances without unsupported alert", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    const templates = [
      catPositiveMcqQuestion(),
      catPositiveSataQuestion(),
      catPositiveBowtieQuestion(),
    ] as const;
    await installQuestionPatchRoute(page, (body) => {
      if (body.question && typeof body.index === "number" && body.index >= 0 && body.index <= 2) {
        const t = templates[body.index];
        if (t) body.question = { ...t, ...body.question };
      }
    });
    try {
      await startCatExamFromHub(page);

      // Item 0 — MCQ
      await assertCatExamTeachingContract(page);
      await expect(page.locator('[data-nn-qa-cat-format="mcq"]')).toBeVisible({ timeout: 60_000 });
      await page.locator("ul.nn-cat-opt-list").first().locator("button.nn-cat-opt").first().click();
      await submitAnswerAndAdvance(page);

      // Item 1 — SATA
      await assertCatExamTeachingContract(page);
      await expect(page.locator('[data-nn-qa-cat-format="sata"]')).toBeVisible({ timeout: 60_000 });
      const list1 = page.locator("ul.nn-cat-opt-list").first();
      await list1.locator("label.nn-cat-opt").nth(0).click();
      await list1.locator("label.nn-cat-opt").nth(2).click();
      await submitAnswerAndAdvance(page);

      // Item 2 — Bowtie
      await assertCatExamTeachingContract(page);
      await expect(page.locator('[data-nn-qa-exam-format="bowtie"]')).toBeVisible({ timeout: 60_000 });
      const bank = page.locator('.bowtie-ngn [role="listbox"] button[role="option"]');
      await expect(bank).toHaveCount(4, { timeout: 60_000 });
      await bank.nth(0).click();
      await page.getByRole("button", { name: /intervention slot/i }).click();
      await bank.nth(2).click();
      await page.getByRole("button", { name: /monitoring slot/i }).click();
      await bank.nth(3).click();
      await submitAnswerAndAdvance(page);

      await assertCatExamTeachingContract(page);

      // Best-effort: adaptive session may continue for many server-driven items — ensure shell still healthy.
      await expect(page.locator("[data-cat-exam-root]")).toBeVisible();
      await expect(page.locator('[data-nn-qa-cat-exam-submit-answer], [data-nn-qa-cat-exam-advance]').first()).toBeVisible({
        timeout: 60_000,
      });

      await assertNoSeriousObservers(obs, page, "[cat-positive-mixed]");
    } catch (e) {
      logPaidSurfaceDebug(buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-positive-mixed"), obs));
      throw e;
    } finally {
      await page.unroute("**/api/practice-tests/*/question*");
      obs.dispose();
    }
  });

  test("CAT insights / results route loads for authenticated learner", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await page.goto("/app/practice-tests/cat-insights", { waitUntil: "domcontentloaded" });
      await waitForAuthenticatedLearnerShell(page);
      await expect(page.locator("main, #nn-learner-main, [data-nn-learner-main]").first()).toBeVisible({
        timeout: 60_000,
      });
      await assertNoSeriousObservers(obs, page, "[cat-insights-route]");
    } catch (e) {
      logPaidSurfaceDebug(buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-insights-route"), obs));
      throw e;
    } finally {
      obs.dispose();
    }
  });
});
