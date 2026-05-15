/**
 * ECG Progressive Learning — behavioral regression suite.
 *
 * What this covers:
 *   - Scaffold visible in beginner-lesson mode; options hidden until scaffold completed or skipped
 *   - Selecting an option does NOT reveal the answer (no immediate reveal)
 *   - Submit Answer button required before result banner appears
 *   - Rationale hidden before submission
 *   - Drill mode: no scaffold, immediate submit on click, no separate Submit button
 *   - CurriculumLessonCard attached after answering; expands to show mechanism content
 *   - Hub roadmap links point to correct level routes
 *   - No horizontal overflow on mobile viewports
 *
 * Uses page.route() to intercept and mock the ECG question + answer APIs so the
 * tests run without a live database or published ECG module inventory.
 *
 * Still requires:
 *   - E2E_ECG_MODULE_ENABLED=1 (confirms module routes are active)
 *   - Paid credentials (E2E_PAID_EMAIL / E2E_PAID_PASSWORD) for auth
 *
 * Run:
 *   E2E_ECG_MODULE_ENABLED=1 npx playwright test tests/e2e/ecg-module/ecg-progressive-learning.spec.ts --project=chromium
 */
import { expect, test, type Page } from "@playwright/test";
import { loginWithCredentials } from "../helpers/learner-login";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";

const IS_ECG_ENABLED = process.env.E2E_ECG_MODULE_ENABLED === "1";
const TIMEOUT = 60_000;

// ─────────────────────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_QUESTION_AF = {
  id: "ecg-test-af-001",
  videoUrl: "",
  mediaType: "text_description",
  mediaConfig: null,
  thumbnailUrl: null,
  durationSeconds: null,
  questionText: "Interpret the rhythm shown on this ECG strip.",
  options: [
    { id: "opt-a", text: "Normal sinus rhythm" },
    { id: "opt-b", text: "Atrial fibrillation" },
    { id: "opt-c", text: "Atrial flutter" },
    { id: "opt-d", text: "Sinus tachycardia" },
  ],
  rationale:
    "Irregularly irregular rhythm with absent P waves and chaotic baseline — classic atrial fibrillation.",
  rhythmTag: "Atrial fibrillation",
  clinicalPriority: null,
  percentCorrect: 78,
  commonWrongAnswers: ["Atrial flutter"],
};

const MOCK_QUESTION_VT = {
  ...MOCK_QUESTION_AF,
  id: "ecg-test-vt-001",
  questionText: "A patient becomes diaphoretic. Identify this rhythm.",
  options: [
    { id: "opt-a", text: "Supraventricular tachycardia" },
    { id: "opt-b", text: "Atrial fibrillation with RVR" },
    { id: "opt-c", text: "Ventricular tachycardia" },
    { id: "opt-d", text: "Sinus tachycardia" },
  ],
  rationale:
    "Wide, regular, rapid QRS complexes with AV dissociation indicate ventricular tachycardia.",
  rhythmTag: "Ventricular tachycardia",
};

function mockAnswerResult(questionId: string, correctId: string, selectedId: string, rhythmTag: string) {
  return {
    ok: true,
    result: {
      questionId,
      selectedOptionId: selectedId,
      isCorrect: selectedId === correctId,
      correctRhythm: rhythmTag,
      correctAnswerId: correctId,
      rationale: MOCK_QUESTION_AF.rationale,
      percentCorrect: 78,
      commonWrongAnswers: ["Atrial flutter"],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function interceptEcgApis(
  page: Page,
  questions: typeof MOCK_QUESTION_AF[],
  correctOptionId = "opt-b",
) {
  await page.route("**/api/modules/ecg/questions**", (route) => {
    void route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, items: questions }),
    });
  });

  await page.route("**/api/modules/ecg/questions/*/answer", async (route) => {
    const body = (await route.request().postDataJSON()) as { selectedOptionId?: string };
    const q = questions.find((q) =>
      route.request().url().includes(encodeURIComponent(q.id)),
    ) ?? questions[0]!;
    void route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        mockAnswerResult(q.id, correctOptionId, body.selectedOptionId ?? "", q.rhythmTag),
      ),
    });
  });
}

async function navigateToEcgRoute(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded", timeout: TIMEOUT });
  // The ECG module page loads questions client-side — wait for the card list.
  await page.waitForLoadState("networkidle").catch(() => {});
}

test.use({ storageState: { cookies: [], origins: [] } });

// ─────────────────────────────────────────────────────────────────────────────
// Beginner lesson mode — scaffold + answer-gating
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Beginner lesson mode — scaffold and answer-gating", () => {
  test("scaffold renders before answer options; options are hidden on load", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await interceptEcgApis(page, [MOCK_QUESTION_AF]);
      await navigateToEcgRoute(page, "/modules/ecg/basic/lessons");

      const card = page.locator('[data-testid="ecg-question-card"]').first();
      await expect(card).toBeVisible({ timeout: TIMEOUT });

      // Scaffold must be visible
      const scaffold = card.locator('[data-testid="ecg-interpretation-scaffold"]');
      await expect(scaffold).toBeVisible({ timeout: TIMEOUT });

      // Answer options must NOT be visible yet (they are only shown after scaffold
      // is completed or skipped — the question stem + options block is absent)
      const optionA = card.locator('[data-testid="ecg-option-opt-a"]');
      await expect(optionA).toHaveCount(0);

      // Submit button must not be visible yet
      await expect(card.locator('[data-testid="ecg-submit-answer-btn"]')).toHaveCount(0);

      // Result banner must not be visible
      await expect(card.locator('[data-testid="ecg-result-banner"]')).toHaveCount(0);

      await info.attach("scaffold-visible.png", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });

  test("skip scaffold unlocks answer options immediately", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await interceptEcgApis(page, [MOCK_QUESTION_AF]);
      await navigateToEcgRoute(page, "/modules/ecg/basic/lessons");

      const card = page.locator('[data-testid="ecg-question-card"]').first();
      await expect(card).toBeVisible({ timeout: TIMEOUT });

      // Click skip
      const skipBtn = card.getByRole("button", { name: /skip analysis/i });
      await expect(skipBtn).toBeVisible({ timeout: TIMEOUT });
      await skipBtn.click();

      // Options should now be visible
      await expect(card.locator('[data-testid="ecg-option-opt-a"]')).toBeVisible({
        timeout: 15_000,
      });
      // Still no result banner
      await expect(card.locator('[data-testid="ecg-result-banner"]')).toHaveCount(0);

      await info.attach("after-skip.png", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });

  test("completing all 6 scaffold steps enables 'Done' and unlocks options", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await interceptEcgApis(page, [MOCK_QUESTION_AF]);
      await navigateToEcgRoute(page, "/modules/ecg/basic/lessons");

      const card = page.locator('[data-testid="ecg-question-card"]').first();
      await expect(card).toBeVisible({ timeout: TIMEOUT });

      const scaffold = card.locator('[data-testid="ecg-interpretation-scaffold"]');
      await expect(scaffold).toBeVisible({ timeout: TIMEOUT });

      // The "Done" button should be disabled until all steps are filled
      const doneBtn = scaffold.getByRole("button", { name: /done|show the question/i });
      await expect(doneBtn).toBeVisible({ timeout: TIMEOUT });
      await expect(doneBtn).toBeDisabled();

      // Select one option from each of the 6 step groups
      // Each step renders pill buttons — click the first one for each step
      const stepGroups = scaffold.locator('[role="group"]');
      const groupCount = await stepGroups.count();
      expect(groupCount, "scaffold should have 6 step groups").toBeGreaterThanOrEqual(6);

      for (let i = 0; i < Math.min(groupCount, 6); i++) {
        const group = stepGroups.nth(i);
        const firstPill = group.getByRole("button").first();
        if (await firstPill.isVisible()) {
          await firstPill.click();
        }
      }

      // Done button should now be enabled
      await expect(doneBtn).toBeEnabled({ timeout: 5_000 });
      await doneBtn.click();

      // Options now visible
      await expect(card.locator('[data-testid="ecg-option-opt-a"]')).toBeVisible({
        timeout: 15_000,
      });

      await info.attach("scaffold-complete.png", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Answer-gating — lesson and quiz modes
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Answer-gating — no immediate reveal in lesson/quiz mode", () => {
  async function loadAndSkipScaffold(page: Page, path: string) {
    await navigateToEcgRoute(page, path);
    const card = page.locator('[data-testid="ecg-question-card"]').first();
    await expect(card).toBeVisible({ timeout: TIMEOUT });

    // Skip scaffold if present (lesson mode) so options are visible
    const skipBtn = card.getByRole("button", { name: /skip analysis/i });
    if (await skipBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await skipBtn.click();
    }

    await expect(card.locator('[data-testid="ecg-option-opt-a"]')).toBeVisible({
      timeout: 15_000,
    });
    return card;
  }

  test("selecting an option does not reveal the answer — result banner absent", async ({
    page,
  }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await interceptEcgApis(page, [MOCK_QUESTION_AF]);
      const card = await loadAndSkipScaffold(page, "/modules/ecg/basic/lessons");

      // Click an option — result must NOT appear yet
      await card.locator('[data-testid="ecg-option-opt-a"]').click();

      // Result banner must still be absent
      await expect(card.locator('[data-testid="ecg-result-banner"]')).toHaveCount(0);

      // Rationale text must be absent
      const rationaleText = card.getByText(/irregularly irregular rhythm/i);
      await expect(rationaleText).toHaveCount(0);

      // Curriculum lesson card must be absent (only shown post-submission)
      await expect(card.locator('[data-testid="curriculum-lesson-card"]')).toHaveCount(0);

      await info.attach("option-selected-no-reveal.png", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });

  test("Submit Answer button appears after selecting an option", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await interceptEcgApis(page, [MOCK_QUESTION_AF]);
      const card = await loadAndSkipScaffold(page, "/modules/ecg/basic/lessons");

      // No submit button before selection
      await expect(card.locator('[data-testid="ecg-submit-answer-btn"]')).toHaveCount(0);

      // Select option B
      await card.locator('[data-testid="ecg-option-opt-b"]').click();

      // Submit button must now appear
      await expect(card.locator('[data-testid="ecg-submit-answer-btn"]')).toBeVisible({
        timeout: 5_000,
      });

      await info.attach("submit-btn-visible.png", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });

  test("clicking Submit Answer reveals result banner and rationale", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await interceptEcgApis(page, [MOCK_QUESTION_AF]);
      const card = await loadAndSkipScaffold(page, "/modules/ecg/basic/lessons");

      await card.locator('[data-testid="ecg-option-opt-b"]').click();
      await card.locator('[data-testid="ecg-submit-answer-btn"]').click();

      // Result banner must appear
      await expect(card.locator('[data-testid="ecg-result-banner"]')).toBeVisible({
        timeout: 15_000,
      });

      // Rationale text must appear
      await expect(card.getByText(/irregularly irregular rhythm/i)).toBeVisible({
        timeout: 10_000,
      });

      // Curriculum lesson card must appear
      await expect(card.locator('[data-testid="curriculum-lesson-card"]')).toBeVisible({
        timeout: 10_000,
      });

      // Submit button must be gone
      await expect(card.locator('[data-testid="ecg-submit-answer-btn"]')).toHaveCount(0);

      await info.attach("after-submit.png", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });

  test("same gating applies in quiz mode", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await interceptEcgApis(page, [MOCK_QUESTION_AF]);
      // Quiz mode — no scaffold on basic/quizzes either
      await navigateToEcgRoute(page, "/modules/ecg/basic/quizzes");

      const card = page.locator('[data-testid="ecg-question-card"]').first();
      await expect(card).toBeVisible({ timeout: TIMEOUT });

      // No scaffold in quiz mode
      await expect(card.locator('[data-testid="ecg-interpretation-scaffold"]')).toHaveCount(0);

      // Options visible directly
      await expect(card.locator('[data-testid="ecg-option-opt-a"]')).toBeVisible({
        timeout: TIMEOUT,
      });

      // Clicking option: no immediate reveal
      await card.locator('[data-testid="ecg-option-opt-a"]').click();
      await expect(card.locator('[data-testid="ecg-result-banner"]')).toHaveCount(0);

      // Submit button appears
      await expect(card.locator('[data-testid="ecg-submit-answer-btn"]')).toBeVisible({
        timeout: 5_000,
      });

      // Submit → reveal
      await card.locator('[data-testid="ecg-submit-answer-btn"]').click();
      await expect(card.locator('[data-testid="ecg-result-banner"]')).toBeVisible({
        timeout: 15_000,
      });

      await info.attach("quiz-mode-submit.png", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Drill mode — quick-fire behavior preserved
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Drill mode — immediate submit on click", () => {
  test("no scaffold shown in drill mode; option click reveals result directly", async ({
    page,
  }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await interceptEcgApis(page, [MOCK_QUESTION_AF]);
      await navigateToEcgRoute(page, "/modules/ecg/advanced/video-drills");

      const card = page.locator('[data-testid="ecg-question-card"]').first();
      await expect(card).toBeVisible({ timeout: TIMEOUT });

      // No scaffold in drill mode
      await expect(card.locator('[data-testid="ecg-interpretation-scaffold"]')).toHaveCount(0);

      // Options appear immediately
      await expect(card.locator('[data-testid="ecg-option-opt-b"]')).toBeVisible({
        timeout: TIMEOUT,
      });

      // Click immediately submits — no Submit button appears first
      await card.locator('[data-testid="ecg-option-opt-b"]').click();

      // Result banner appears without an intermediate Submit button click
      await expect(card.locator('[data-testid="ecg-result-banner"]')).toBeVisible({
        timeout: 15_000,
      });

      // No separate Submit button at any point in this flow
      await expect(card.locator('[data-testid="ecg-submit-answer-btn"]')).toHaveCount(0);

      await info.attach("drill-mode-quick-fire.png", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });

  test("drill mode does not show CurriculumLessonCard post-answer", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await interceptEcgApis(page, [MOCK_QUESTION_AF]);
      await navigateToEcgRoute(page, "/modules/ecg/advanced/video-drills");

      const card = page.locator('[data-testid="ecg-question-card"]').first();
      await expect(card).toBeVisible({ timeout: TIMEOUT });
      await card.locator('[data-testid="ecg-option-opt-b"]').click();
      await expect(card.locator('[data-testid="ecg-result-banner"]')).toBeVisible({
        timeout: 15_000,
      });

      // Drill mode suppresses the deep lesson card (quick-fire context)
      await expect(card.locator('[data-testid="curriculum-lesson-card"]')).toHaveCount(0);
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CurriculumLessonCard — content rendering
// ─────────────────────────────────────────────────────────────────────────────

test.describe("CurriculumLessonCard — deep teaching content", () => {
  test("lesson card renders and expands to show mechanism and nursing priorities", async ({
    page,
  }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await interceptEcgApis(page, [MOCK_QUESTION_AF]);
      await navigateToEcgRoute(page, "/modules/ecg/basic/lessons");

      const card = page.locator('[data-testid="ecg-question-card"]').first();
      await expect(card).toBeVisible({ timeout: TIMEOUT });

      // Skip scaffold and submit an answer
      const skipBtn = card.getByRole("button", { name: /skip analysis/i });
      if (await skipBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await skipBtn.click();
      }
      await card.locator('[data-testid="ecg-option-opt-b"]').click();
      await card.locator('[data-testid="ecg-submit-answer-btn"]').click();
      await expect(card.locator('[data-testid="ecg-result-banner"]')).toBeVisible({
        timeout: 15_000,
      });

      // Lesson card appears collapsed
      const lessonCard = card.locator('[data-testid="curriculum-lesson-card"]');
      await expect(lessonCard).toBeVisible({ timeout: 10_000 });

      // Expand it — click the header button
      await lessonCard.getByRole("button").first().click();

      // Body should now be visible with mechanism content
      const body = lessonCard.locator('[data-testid="curriculum-lesson-body"]');
      await expect(body).toBeVisible({ timeout: 10_000 });

      // Mechanism section — check for "Mechanism" label
      await expect(body.getByText("Mechanism", { exact: true })).toBeVisible();

      // Nursing Priorities section
      await expect(body.getByText("Nursing Priorities", { exact: true })).toBeVisible();

      // NCLEX Traps section
      await expect(body.getByText("NCLEX Traps", { exact: true })).toBeVisible();

      await info.attach("lesson-card-expanded.png", {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });

  test("VT rhythmTag resolves to the correct curriculum unit title", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await loginWithCredentials(page, creds!.email, creds!.password);
      await interceptEcgApis(page, [MOCK_QUESTION_VT], "opt-c");
      await navigateToEcgRoute(page, "/modules/ecg/basic/lessons");

      const card = page.locator('[data-testid="ecg-question-card"]').first();
      await expect(card).toBeVisible({ timeout: TIMEOUT });

      const skipBtn = card.getByRole("button", { name: /skip analysis/i });
      if (await skipBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await skipBtn.click();
      }
      await card.locator('[data-testid="ecg-option-opt-c"]').click();
      await card.locator('[data-testid="ecg-submit-answer-btn"]').click();
      await expect(card.locator('[data-testid="ecg-result-banner"]')).toBeVisible({
        timeout: 15_000,
      });

      // Lesson card must show "Ventricular Tachycardia (VT)" title
      const lessonCard = card.locator('[data-testid="curriculum-lesson-card"]');
      await expect(lessonCard).toBeVisible({ timeout: 10_000 });
      await expect(lessonCard.getByText(/ventricular tachycardia/i)).toBeVisible();

      await info.attach("vt-curriculum-card.png", {
        body: await page.screenshot(),
        contentType: "image/png",
      });
    } finally {
      await logObserverDiagnostics(obs, info.title);
      obs.dispose();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Hub curriculum roadmap
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Hub — curriculum roadmap links and structure", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("ECG hub renders all 3 level cards with correct start-level CTAs", async ({
    page,
  }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await page.goto("/modules/ecg", { waitUntil: "domcontentloaded", timeout: TIMEOUT });
    await page.waitForLoadState("networkidle").catch(() => {});

    // Level 1 card
    const l1 = page.locator('[data-testid="ecg-curriculum-level-1"]');
    await expect(l1).toBeVisible({ timeout: TIMEOUT });
    const l1Btn = l1.locator('[data-testid="ecg-level-1-start-btn"]');
    await expect(l1Btn).toBeVisible();
    const l1Href = await l1Btn.getAttribute("href");
    expect(l1Href, "Level 1 must link to basic lessons").toContain("/modules/ecg/basic/lessons");

    // Level 2 card
    const l2 = page.locator('[data-testid="ecg-curriculum-level-2"]');
    await expect(l2).toBeVisible();
    const l2Btn = l2.locator('[data-testid="ecg-level-2-start-btn"]');
    await expect(l2Btn).toBeVisible();
    const l2Href = await l2Btn.getAttribute("href");
    expect(l2Href, "Level 2 must link to basic quizzes").toContain("/modules/ecg/basic/quizzes");

    // Level 3 card
    const l3 = page.locator('[data-testid="ecg-curriculum-level-3"]');
    await expect(l3).toBeVisible();
    const l3Btn = l3.locator('[data-testid="ecg-level-3-start-btn"]');
    await expect(l3Btn).toBeVisible();
    const l3Href = await l3Btn.getAttribute("href");
    expect(l3Href, "Level 3 must link to advanced lessons").toContain("/modules/ecg/advanced/lessons");

    await info.attach("hub-roadmap.png", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });

  test("hub roadmap Level 1 topics chip list is non-empty", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await page.goto("/modules/ecg", { waitUntil: "domcontentloaded", timeout: TIMEOUT });

    const l1 = page.locator('[data-testid="ecg-curriculum-level-1"]');
    await expect(l1).toBeVisible({ timeout: TIMEOUT });
    const chips = l1.locator('[aria-label="Level 1 topics"] li');
    const count = await chips.count();
    expect(count, "Level 1 should have at least 5 topic chips").toBeGreaterThanOrEqual(5);

    // Verify known topics from the curriculum
    await expect(l1.getByText("Rate Calculation")).toBeVisible();
    await expect(l1.getByText("The 7-Step ECG Interpretation Method")).toBeVisible();

    await info.attach("hub-level1-chips.png", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  test("hub 'How this module teaches ECG' 4-step explainer is present", async ({
    page,
  }) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await page.goto("/modules/ecg", { waitUntil: "domcontentloaded", timeout: TIMEOUT });

    await expect(page.getByText("How this module teaches ECG")).toBeVisible({ timeout: TIMEOUT });
    await expect(page.getByText("See the strip")).toBeVisible();
    await expect(page.getByText("Analyze with the 7-step method")).toBeVisible();
    await expect(page.getByText("Select and submit")).toBeVisible();
    await expect(page.getByText("Learn the mechanism")).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Mobile layout — no overflow
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Mobile layout — 390px viewport", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("ECG hub roadmap — no horizontal overflow on mobile", async ({ page }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await page.goto("/modules/ecg", { waitUntil: "domcontentloaded", timeout: TIMEOUT });
    await page.waitForLoadState("networkidle").catch(() => {});

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(
      scrollWidth,
      `body scrollWidth (${scrollWidth}) must not exceed clientWidth (${clientWidth}) on 390px`,
    ).toBeLessThanOrEqual(clientWidth + 2);

    await info.attach("hub-mobile-390.png", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });

  test("ECG question card scaffold readable on mobile — options don't overflow", async ({
    page,
  }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await loginWithCredentials(page, creds!.email, creds!.password);
    await interceptEcgApis(page, [MOCK_QUESTION_AF]);
    await navigateToEcgRoute(page, "/modules/ecg/basic/lessons");

    const card = page.locator('[data-testid="ecg-question-card"]').first();
    await expect(card).toBeVisible({ timeout: TIMEOUT });

    const box = await card.boundingBox();
    expect(box, "card bounding box must be resolvable").not.toBeNull();
    if (box) {
      expect(box.width, "card must not exceed viewport width").toBeLessThanOrEqual(392);
      expect(box.x, "card must not start off-screen").toBeGreaterThanOrEqual(0);
    }

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

    await info.attach("lesson-mobile-390.png", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });

  test("ECG question card — post-submit lesson card readable on tablet 768px", async ({
    page,
  }, info) => {
    test.skip(!IS_ECG_ENABLED, "Set E2E_ECG_MODULE_ENABLED=1");
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    await page.setViewportSize({ width: 768, height: 1024 });
    await loginWithCredentials(page, creds!.email, creds!.password);
    await interceptEcgApis(page, [MOCK_QUESTION_AF]);
    await navigateToEcgRoute(page, "/modules/ecg/basic/lessons");

    const card = page.locator('[data-testid="ecg-question-card"]').first();
    await expect(card).toBeVisible({ timeout: TIMEOUT });

    const skipBtn = card.getByRole("button", { name: /skip analysis/i });
    if (await skipBtn.isVisible({ timeout: 5_000 }).catch(() => false)) await skipBtn.click();

    await card.locator('[data-testid="ecg-option-opt-b"]').click();
    await card.locator('[data-testid="ecg-submit-answer-btn"]').click();
    await expect(card.locator('[data-testid="ecg-result-banner"]')).toBeVisible({
      timeout: 15_000,
    });

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

    await info.attach("lesson-tablet-768.png", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });
});
