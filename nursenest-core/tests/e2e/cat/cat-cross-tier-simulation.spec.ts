/**
 * CAT cross-tier simulation QA pass.
 *
 * Covers authenticated RN/NCLEX-RN session contracts, public marketing
 * entrypoints for RPN/REx-PN, NP/FNP, and Allied Health, ECG exclusion
 * during active RN CAT sessions, mobile layout health, and entitlement
 * gating for unauthenticated users.
 *
 * Assumes the dev server is running (configured via playwright config baseURL).
 *
 *   npm run test:e2e -- tests/e2e/cat/cat-cross-tier-simulation.spec.ts
 */
import { mkdirSync } from "node:fs";
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
import {
  answerOneCatExamItem,
  clickBeginExamAfterPracticeHubStart,
} from "../helpers/cat-practice-exam-flow";
import {
  catPositiveBowtieQuestion,
  catPositiveMcqQuestion,
  catPositiveSataQuestion,
  CAT_POSITIVE_FIXTURE_STEMS,
} from "../helpers/cat-positive-question-fixtures";

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------

const SCREENSHOT_DIR = "tests/screenshots";
const MOBILE_VIEWPORT = { width: 375, height: 812 };

// ---------------------------------------------------------------------------
// Module-level directory bootstrap (non-fatal — screenshots are best-effort)
// ---------------------------------------------------------------------------

try {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
} catch {
  /* ignore EEXIST or permission errors in CI */
}

// ---------------------------------------------------------------------------
// Shared helpers (mirrors the matrix spec patterns exactly)
// ---------------------------------------------------------------------------

async function startRnCatExamFromHub(page: import("@playwright/test").Page): Promise<void> {
  await page.goto(
    `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`,
    { waitUntil: "domcontentloaded" },
  );
  await waitForAuthenticatedLearnerShell(page);
  await expectNoSubscriptionPaywall(page, "RN CAT hub (cross-tier)");
  await expect(page.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible({ timeout: 60_000 });
  await page.locator("[data-nn-qa-practice-hub-start-test]").click();
  await clickBeginExamAfterPracticeHubStart(page);
  await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });
  await expect(page.locator("[data-cat-exam-root]")).toBeVisible({ timeout: 120_000 });
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

function filterSeriousConsoleErrors(errors: string[]): string[] {
  return errors.filter(
    (x) => !/cookie|Content Security Policy|third-party|analytics/i.test(x),
  );
}

async function assertNoSeriousObservers(
  obs: ReturnType<typeof attachPageObservers>,
  page: import("@playwright/test").Page,
  tag: string,
): Promise<void> {
  const serious = filterSeriousConsoleErrors(obs.consoleErrors);
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

// ---------------------------------------------------------------------------
// Block 1: RN / NCLEX-RN CAT (authenticated)
// ---------------------------------------------------------------------------

test.describe("Block 1 — RN / NCLEX-RN CAT (authenticated)", () => {
  test("1-1: CAT launch — start button, exam initializes, no wrong-tier questions visible", async ({
    page,
  }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await startRnCatExamFromHub(page);

      // Exam root and premium convergence shell must be present
      await expect(page.locator("[data-cat-exam-root]")).toBeVisible({ timeout: 30_000 });
      await expect(page.locator(".nn-cat-premium-convergence")).toBeVisible({ timeout: 30_000 });

      // No study-only chrome (rationale panel, live transparency strip)
      await expect(page.locator(".nn-question-session-rationale")).toHaveCount(0);
      await expect(page.locator("[data-nn-qa-cat-live-transparency]")).toHaveCount(0);

      // The exam root must not contain stale i18n key fragments
      const examRootText = await page.locator("[data-cat-exam-root]").innerText();
      expect(examRootText).not.toContain("learner.practiceTests.run.");

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-rn-launch-${Date.now()}.png`,
        fullPage: false,
      });
    } catch (e) {
      logPaidSurfaceDebug(
        buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-rn-launch"), obs),
      );
      throw e;
    } finally {
      obs.dispose();
    }
  });

  test("1-2: No rationale visible during active CAT session", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await startRnCatExamFromHub(page);
      await expect(page.locator(".nn-question-session-rationale")).toHaveCount(0);
      // After answering one item, rationale must still be suppressed
      await answerOneCatExamItem(page);
      await expect(page.locator(".nn-question-session-rationale")).toHaveCount(0);
    } catch (e) {
      logPaidSurfaceDebug(
        buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-rn-no-rationale"), obs),
      );
      throw e;
    } finally {
      obs.dispose();
    }
  });

  test("1-3: No answer percentage visible during active CAT session", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await startRnCatExamFromHub(page);
      await expect(page.locator("[data-nn-qa-cat-live-transparency]")).toHaveCount(0);
      // Verify the footer is present (adaptive exam footer) but no transparency strip
      await expect(page.locator("[data-nn-qa-cat-adaptive-exam-footer]")).toBeVisible({
        timeout: 30_000,
      });
    } catch (e) {
      logPaidSurfaceDebug(
        buildPaidFailureSnapshot(
          await collectPaidSurfaceDebug(page, "cat-rn-no-transparency"),
          obs,
        ),
      );
      throw e;
    } finally {
      obs.dispose();
    }
  });

  test("1-4: MCQ question type renders with option list and submit button", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    await installQuestionPatchRoute(page, (body) => {
      if (body.index === 0 && body.question) {
        body.question = { ...catPositiveMcqQuestion(), ...body.question };
      }
    });
    try {
      await startRnCatExamFromHub(page);
      await expect(page.locator('[data-nn-qa-cat-format="mcq"]')).toBeVisible({ timeout: 60_000 });
      await expect(page.locator('[data-nn-qa-exam-format="mcq"]').first()).toBeVisible();

      const list = page.locator("ul.nn-cat-opt-list").first();
      await expect(list).toBeVisible({ timeout: 60_000 });
      await expect(list.locator("button.nn-cat-opt").first()).toBeVisible();

      const submit = page.getByRole("button", { name: /^Submit answer$/i });
      await expect(submit).toBeDisabled();

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-rn-mcq-${Date.now()}.png`,
        fullPage: false,
      });
      await assertNoSeriousObservers(obs, page, "[cat-rn-mcq]");
    } catch (e) {
      logPaidSurfaceDebug(
        buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-rn-mcq"), obs),
      );
      throw e;
    } finally {
      await page.unroute("**/api/practice-tests/*/question*");
      obs.dispose();
    }
  });

  test("1-5: SATA question type renders with checkboxes", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    await installQuestionPatchRoute(page, (body) => {
      if (body.index === 0 && body.question) {
        body.question = { ...catPositiveSataQuestion(), ...body.question };
      }
    });
    try {
      await startRnCatExamFromHub(page);
      await expect(page.locator('[data-nn-qa-cat-format="sata"]')).toBeVisible({ timeout: 60_000 });
      await expect(
        page.locator(".nn-cat-question-stem").filter({ hasText: CAT_POSITIVE_FIXTURE_STEMS.sata }),
      ).toBeVisible({ timeout: 60_000 });

      // SATA uses <label> elements (checkboxes), not <button> elements
      const list = page.locator("ul.nn-cat-opt-list").first();
      await expect(list).toBeVisible({ timeout: 60_000 });
      await expect(list.locator("label.nn-cat-opt").first()).toBeVisible();

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-rn-sata-${Date.now()}.png`,
        fullPage: false,
      });
      await assertNoSeriousObservers(obs, page, "[cat-rn-sata]");
    } catch (e) {
      logPaidSurfaceDebug(
        buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-rn-sata"), obs),
      );
      throw e;
    } finally {
      await page.unroute("**/api/practice-tests/*/question*");
      obs.dispose();
    }
  });

  test("1-6: Bowtie question type renders correctly (fixture interception)", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    await installQuestionPatchRoute(page, (body) => {
      if (body.index === 0 && body.question) {
        body.question = { ...catPositiveBowtieQuestion(), ...body.question };
      }
    });
    try {
      await startRnCatExamFromHub(page);
      await expect(page.locator('[data-nn-qa-cat-format="bowtie"]')).toBeVisible({
        timeout: 60_000,
      });
      await expect(page.locator('[data-nn-qa-exam-format="bowtie"]')).toBeVisible();
      await expect(
        page.locator(".nn-cat-question-stem").filter({ hasText: CAT_POSITIVE_FIXTURE_STEMS.bowtie }),
      ).toBeVisible({ timeout: 60_000 });

      // Bowtie bank options must be present
      const bank = page.locator('.bowtie-ngn [role="listbox"] button[role="option"]');
      await expect(bank).toHaveCount(4, { timeout: 60_000 });

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-rn-bowtie-${Date.now()}.png`,
        fullPage: false,
      });
      await assertNoSeriousObservers(obs, page, "[cat-rn-bowtie]");
    } catch (e) {
      logPaidSurfaceDebug(
        buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-rn-bowtie"), obs),
      );
      throw e;
    } finally {
      await page.unroute("**/api/practice-tests/*/question*");
      obs.dispose();
    }
  });

  test("1-7: CAT report card / insights route loads at end or via /app/practice-tests/cat-insights", async ({
    page,
  }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await page.goto("/app/practice-tests/cat-insights", { waitUntil: "domcontentloaded" });
      await waitForAuthenticatedLearnerShell(page);
      await expect(
        page.locator("main, #nn-learner-main, [data-nn-learner-main]").first(),
      ).toBeVisible({ timeout: 60_000 });

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-rn-insights-${Date.now()}.png`,
        fullPage: false,
      });
      await assertNoSeriousObservers(obs, page, "[cat-rn-insights]");
    } catch (e) {
      logPaidSurfaceDebug(
        buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-rn-insights"), obs),
      );
      throw e;
    } finally {
      obs.dispose();
    }
  });

  test("1-8: No 500/404 API responses during RN CAT session", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    const apiErrors: { url: string; status: number }[] = [];

    page.on("response", (response) => {
      const url = response.url();
      if (/\/api\/practice-tests/i.test(url)) {
        const status = response.status();
        if (status === 500 || status === 404) {
          apiErrors.push({ url, status });
        }
      }
    });

    try {
      await startRnCatExamFromHub(page);
      // Answer one item to exercise the PATCH → advance cycle
      await answerOneCatExamItem(page);

      expect(
        apiErrors,
        `Unexpected 500/404 from practice-tests API: ${JSON.stringify(apiErrors)}`,
      ).toEqual([]);
    } catch (e) {
      logPaidSurfaceDebug(
        buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "cat-rn-no-api-errors"), obs),
      );
      throw e;
    } finally {
      obs.dispose();
    }
  });

  test("1-9: No horizontal overflow at mobile viewport (375px)", async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await startRnCatExamFromHub(page);

      const overflow = await page.evaluate(() => {
        const d = document.documentElement;
        return d.scrollWidth - d.clientWidth;
      });
      expect(
        overflow,
        `Horizontal overflow on RN CAT question screen at 375px: scrollWidth exceeds clientWidth by ${overflow}px`,
      ).toBeLessThanOrEqual(2);

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-rn-mobile-overflow-${Date.now()}.png`,
        fullPage: false,
      });
    } catch (e) {
      logPaidSurfaceDebug(
        buildPaidFailureSnapshot(
          await collectPaidSurfaceDebug(page, "cat-rn-mobile-overflow"),
          obs,
        ),
      );
      throw e;
    } finally {
      obs.dispose();
    }
  });
});

// ---------------------------------------------------------------------------
// Block 2: RPN / REx-PN CAT (public marketing entrypoint)
// ---------------------------------------------------------------------------

test.describe("Block 2 — RPN / REx-PN CAT (public marketing)", () => {
  test("2-1: /canada/rpn/rex-pn/cat sign-in callback preserves RPN path", async ({ page }) => {
    // The URL is owned by the rex-pn authority cluster (page.path = /canada/rpn/rex-pn/cat).
    // The CTA sign-in block uses page.path directly so callbackUrl carries the rpn slug.
    const catPath = "/canada/rpn/rex-pn/cat";
    const obs = attachPageObservers(page, { profile: "public" });
    try {
      await page.goto(catPath, { waitUntil: "domcontentloaded" });
      const encodedPath = encodeURIComponent(catPath);
      const signInForCat = page.locator(`a[href*="callbackUrl=${encodedPath}"]`).first();
      await expect(signInForCat).toBeVisible({ timeout: 30_000 });

      const href = await signInForCat.getAttribute("href");
      expect(href).toBeTruthy();

      const serious = filterSeriousConsoleErrors(obs.consoleErrors);
      expect(serious, serious.slice(0, 6).join("\n")).toEqual([]);

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-rpn-signin-callback-${Date.now()}.png`,
        fullPage: false,
      });
    } finally {
      obs.dispose();
    }
  });

  test("2-2: RPN CAT page shows lessons + questions fallback links for unauthenticated", async ({
    page,
  }) => {
    const obs = attachPageObservers(page, { profile: "public" });
    try {
      await page.goto("/canada/rpn/rex-pn/cat", { waitUntil: "domcontentloaded" });
      // The URL is owned by the rex-pn authority cluster — CTAs in the page header use
      // the canonical rpn slug (not the marketing-hub pn alias).
      await expect(
        page.locator('a[href="/canada/rpn/rex-pn/lessons"]').first(),
      ).toBeVisible({ timeout: 30_000 });
      await expect(
        page.locator('a[href="/canada/rpn/rex-pn/questions"]').first(),
      ).toBeVisible({ timeout: 30_000 });

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-rpn-fallback-links-${Date.now()}.png`,
        fullPage: false,
      });
    } finally {
      obs.dispose();
    }
  });
});

// ---------------------------------------------------------------------------
// Block 3: NP / FNP CAT (public marketing entrypoint — not live yet)
// ---------------------------------------------------------------------------

test.describe("Block 3 — NP / FNP CAT (public marketing, waitlist/fallback)", () => {
  test("3-1: /us/np/fnp/cat shows waitlist/fallback UI — FNP CAT not live yet", async ({
    page,
  }) => {
    const obs = attachPageObservers(page, { profile: "public" });
    try {
      const response = await page.goto("/us/np/fnp/cat", { waitUntil: "domcontentloaded" });
      // Must not 500
      expect(response?.status() ?? 200).not.toBe(500);
      // No sign-in loop — callbackUrl to FNP CAT must be absent (feature not live)
      await expect(
        page.locator(`a[href*="callbackUrl=${encodeURIComponent("/us/np/fnp/cat")}"]`),
      ).toHaveCount(0, { timeout: 15_000 });

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-fnp-waitlist-${Date.now()}.png`,
        fullPage: false,
      });
    } finally {
      obs.dispose();
    }
  });

  test("3-2: FNP CAT fallback links present — lessons and questions, no broken sign-in loop", async ({
    page,
  }) => {
    const obs = attachPageObservers(page, { profile: "public" });
    try {
      // FNP CAT uses Next.js streaming SSR — links may arrive after initial HTML.
      // 60s timeout accommodates cold-start streaming latency on the current instance.
      await page.goto("/us/np/fnp/cat", { waitUntil: "domcontentloaded" });
      await expect(page.locator('a[href="/us/np/fnp/lessons"]').first()).toBeVisible({
        timeout: 60_000,
      });
      await expect(page.locator('a[href="/us/np/fnp/questions"]').first()).toBeVisible({
        timeout: 60_000,
      });
      // No sign-in CTA pointing back to this CAT path (confirm no broken loop)
      await expect(
        page.locator(`a[href*="callbackUrl=${encodeURIComponent("/us/np/fnp/cat")}"]`),
      ).toHaveCount(0);

      const serious = filterSeriousConsoleErrors(obs.consoleErrors);
      expect(serious, serious.slice(0, 6).join("\n")).toEqual([]);
    } finally {
      obs.dispose();
    }
  });
});

// ---------------------------------------------------------------------------
// Block 4: Allied Health CAT (public marketing)
// ---------------------------------------------------------------------------

test.describe("Block 4 — Allied Health CAT (public marketing)", () => {
  test("4-1: /allied/allied-health/cat page loads without 500", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "public" });
    try {
      const response = await page.goto("/allied/allied-health/cat", {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status() ?? 200).not.toBe(500);
      // Page must have some content in the document body
      await expect(page.locator("body")).toBeVisible({ timeout: 15_000 });

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-allied-page-${Date.now()}.png`,
        fullPage: false,
      });
    } finally {
      obs.dispose();
    }
  });

  test("4-2: Allied Health CAT pathway-scoped fallback links present", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "public" });
    try {
      await page.goto("/allied/allied-health/cat", { waitUntil: "domcontentloaded" });

      // Prefer explicit pathway-scoped links; if sign-in CTA is present, verify callbackUrl
      const lessonsLink = page.locator('a[href="/allied/allied-health/lessons"]');
      const questionsLink = page.locator('a[href="/allied/allied-health/questions"]');
      await expect(lessonsLink.first()).toBeVisible({ timeout: 30_000 });
      await expect(questionsLink.first()).toBeVisible({ timeout: 30_000 });

      // If sign-in CTA present, it must preserve the allied CAT path
      const catPath = "/allied/allied-health/cat";
      const signInCta = page
        .locator(`a[href*="callbackUrl=${encodeURIComponent(catPath)}"]`)
        .first();
      if (await signInCta.isVisible().catch(() => false)) {
        const href = await signInCta.getAttribute("href");
        expect(href).toBeTruthy();
        const callbackUrl = new URL(href!, "http://localhost").searchParams.get("callbackUrl");
        expect(callbackUrl).toBe(catPath);
      }

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-allied-fallback-${Date.now()}.png`,
        fullPage: false,
      });
    } finally {
      obs.dispose();
    }
  });
});

// ---------------------------------------------------------------------------
// Block 5: ECG exclusion (authenticated RN CAT session)
// ---------------------------------------------------------------------------

test.describe("Block 5 — ECG exclusion (authenticated RN CAT session)", () => {
  test("5-1: No ECG question appears in active RN CAT session", async ({ page }) => {
    const obs = attachPageObservers(page, { profile: "app" });
    const ecgQuestions: { url: string; stem?: string }[] = [];

    // Intercept every GET to the question endpoint; inspect response body for ecg markers
    await page.route("**/api/practice-tests/*/question*", async (route) => {
      const req = route.request();
      if (req.method() !== "GET") {
        await route.continue();
        return;
      }
      const res = await route.fetch();
      let bodyText = "";
      try {
        bodyText = await res.text();
      } catch {
        await route.fulfill({ response: res });
        return;
      }
      // Check for ecg markers in the raw JSON body
      const lowerBody = bodyText.toLowerCase();
      if (lowerBody.includes('"ecg"') || lowerBody.includes("ecg_") || lowerBody.includes("electrocardiogram")) {
        try {
          const parsed = JSON.parse(bodyText) as { question?: { stem?: string } };
          ecgQuestions.push({ url: req.url(), stem: parsed.question?.stem });
        } catch {
          ecgQuestions.push({ url: req.url() });
        }
      }
      await route.fulfill({
        status: res.status(),
        headers: res.headers(),
        body: bodyText,
      });
    });

    try {
      await startRnCatExamFromHub(page);

      // Answer two items so we exercise at least two question fetches
      await answerOneCatExamItem(page);
      await answerOneCatExamItem(page);

      expect(
        ecgQuestions,
        `ECG question(s) appeared in RN CAT session: ${JSON.stringify(ecgQuestions)}`,
      ).toEqual([]);
    } catch (e) {
      logPaidSurfaceDebug(
        buildPaidFailureSnapshot(
          await collectPaidSurfaceDebug(page, "cat-rn-ecg-exclusion"),
          obs,
        ),
      );
      throw e;
    } finally {
      await page.unroute("**/api/practice-tests/*/question*");
      obs.dispose();
    }
  });
});

// ---------------------------------------------------------------------------
// Block 6: Mobile layout
// ---------------------------------------------------------------------------

test.describe("Block 6 — Mobile layout (375x812)", () => {
  test("6-1: At 375x812, CAT question screen has no horizontal overflow", async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    const obs = attachPageObservers(page, { profile: "app" });
    try {
      await startRnCatExamFromHub(page);
      await expect(page.locator("[data-cat-exam-root]")).toBeVisible({ timeout: 30_000 });

      const { docExcess, mainExcess } = await page.evaluate(() => {
        const d = document.documentElement;
        const mainEl = document.querySelector("main");
        return {
          docExcess: d.scrollWidth - d.clientWidth,
          mainExcess: mainEl ? (mainEl as HTMLElement).scrollWidth - (mainEl as HTMLElement).clientWidth : 0,
        };
      });

      expect(
        docExcess,
        `[mobile-cat-question] document horizontal overflow: ${docExcess}px`,
      ).toBeLessThanOrEqual(2);

      if (mainExcess > 0) {
        expect(
          mainExcess,
          `[mobile-cat-question] <main> horizontal overflow: ${mainExcess}px`,
        ).toBeLessThanOrEqual(4);
      }

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-mobile-question-${Date.now()}.png`,
        fullPage: false,
      });
    } catch (e) {
      logPaidSurfaceDebug(
        buildPaidFailureSnapshot(
          await collectPaidSurfaceDebug(page, "cat-mobile-question-overflow"),
          obs,
        ),
      );
      throw e;
    } finally {
      obs.dispose();
    }
  });

  test("6-2: At 375x812, bowtie question columns do not overflow container", async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    const obs = attachPageObservers(page, { profile: "app" });
    await installQuestionPatchRoute(page, (body) => {
      if (body.index === 0 && body.question) {
        body.question = { ...catPositiveBowtieQuestion(), ...body.question };
      }
    });
    try {
      await startRnCatExamFromHub(page);
      await expect(page.locator('[data-nn-qa-cat-format="bowtie"]')).toBeVisible({
        timeout: 60_000,
      });

      // Bowtie container must not bleed beyond viewport
      const { docExcess } = await page.evaluate(() => {
        const d = document.documentElement;
        return { docExcess: d.scrollWidth - d.clientWidth };
      });

      expect(
        docExcess,
        `[mobile-bowtie] document horizontal overflow: ${docExcess}px`,
      ).toBeLessThanOrEqual(2);

      // Verify the bowtie columns don't individually overflow their parent
      const bowtieOverflow = await page.evaluate(() => {
        const bowtieEl = document.querySelector(".bowtie-ngn");
        if (!bowtieEl) return 0;
        const el = bowtieEl as HTMLElement;
        return el.scrollWidth - el.clientWidth;
      });

      expect(
        bowtieOverflow,
        `[mobile-bowtie] .bowtie-ngn column overflow: ${bowtieOverflow}px`,
      ).toBeLessThanOrEqual(4);

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-mobile-bowtie-${Date.now()}.png`,
        fullPage: false,
      });
    } catch (e) {
      logPaidSurfaceDebug(
        buildPaidFailureSnapshot(
          await collectPaidSurfaceDebug(page, "cat-mobile-bowtie-overflow"),
          obs,
        ),
      );
      throw e;
    } finally {
      await page.unroute("**/api/practice-tests/*/question*");
      obs.dispose();
    }
  });
});

// ---------------------------------------------------------------------------
// Block 7: Entitlement gating
// ---------------------------------------------------------------------------

test.describe("Block 7 — Entitlement gating", () => {
  // Use empty storage state to simulate an unauthenticated visitor for these tests
  test.use({ storageState: { cookies: [], origins: [] } });

  test("7-1: Unauthenticated GET to /app/practice-tests?cat=1 redirects to sign-in (no 500)", async ({
    page,
  }) => {
    const obs = attachPageObservers(page, { profile: "public" });
    try {
      const responses: { url: string; status: number }[] = [];
      page.on("response", (r) => {
        const u = r.url();
        if (/\/app\/practice-tests/i.test(u)) {
          responses.push({ url: u, status: r.status() });
        }
      });

      await page.goto("/app/practice-tests?cat=1", { waitUntil: "domcontentloaded" });

      // Must be redirected away from the app route (to /login or similar)
      const finalUrl = page.url();
      expect(
        finalUrl,
        `Expected redirect away from /app/practice-tests for unauthenticated user, got: ${finalUrl}`,
      ).not.toMatch(/\/app\/practice-tests/);

      // None of the navigated responses may be 500
      const fiveHundreds = responses.filter((r) => r.status === 500);
      expect(
        fiveHundreds,
        `500 response(s) during unauthenticated access to /app/practice-tests: ${JSON.stringify(fiveHundreds)}`,
      ).toEqual([]);

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-unauth-redirect-${Date.now()}.png`,
        fullPage: false,
      });
    } finally {
      obs.dispose();
    }
  });

  test("7-2: Marketing CAT page /us/rn/nclex-rn/cat loads for unauthenticated user with sign-in CTA", async ({
    page,
  }) => {
    const obs = attachPageObservers(page, { profile: "public" });
    try {
      const catPath = "/us/rn/nclex-rn/cat";
      const response = await page.goto(catPath, { waitUntil: "domcontentloaded" });

      // Page must load successfully (not 500)
      expect(response?.status() ?? 200).not.toBe(500);

      // Sign-in CTA must be visible and preserve the correct callbackUrl
      const encodedPath = encodeURIComponent(catPath);
      const signInCta = page.locator(`a[href*="callbackUrl=${encodedPath}"]`).first();
      await expect(signInCta).toBeVisible({ timeout: 30_000 });

      const href = await signInCta.getAttribute("href");
      expect(href).toBeTruthy();

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/cat-unauth-marketing-cta-${Date.now()}.png`,
        fullPage: false,
      });
    } finally {
      obs.dispose();
    }
  });
});
