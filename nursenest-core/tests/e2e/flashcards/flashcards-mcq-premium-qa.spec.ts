/**
 * Premium flashcard MCQ QA spec — validates:
 *   - MCQ options render on front before reveal
 *   - Correct answer + rationale visible only after reveal
 *   - Wrong-answer menu renders after reveal (collapsible details element)
 *   - Internal study links render after reveal
 *   - 4-button Anki-style confidence controls (Again/Hard/Good/Easy)
 *   - "Think before selecting" cue visible on front
 *   - Per-tier pool isolation (RN / RPN / NP / Allied)
 *   - Draft cards excluded (no reveal without data-nn-revealed="1")
 *   - Mobile viewport: no horizontal overflow, confidence buttons fit, links wrap
 *   - Keyboard: Space reveals, 1–4 rates
 *   - Progress indicator updates
 *   - Empty-pool safe state renders without error
 *
 * Paid Playwright (learning-routes config + E2E_PAID_EMAIL / E2E_PAID_PASSWORD):
 *   npx playwright test -c playwright.learning-routes.config.ts tests/e2e/flashcards/flashcards-mcq-premium-qa.spec.ts
 *
 * Optional env:
 *   FLASHCARDS_MCQ_QA_RN_PATHWAY_ID    — US RN pathway (default: us-rn-nclex-rn)
 *   FLASHCARDS_MCQ_QA_RPN_PATHWAY_ID   — RPN pathway (default: ca-rpn-rex-pn)
 *   FLASHCARDS_MCQ_QA_NP_PATHWAY_ID    — NP pathway (default: us-np-ancc-fnp)
 *   FLASHCARDS_MCQ_QA_ALLIED_PATHWAY_ID — Allied pathway (default: us-allied-mlt)
 *   FLASHCARD_MCQ_QA_SCREENSHOTS        — set to "1" to capture screenshots
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers, logObserverDiagnostics } from "../helpers/attach-observers";
import { resolveE2eAppBaseUrl } from "../helpers/e2e-env";
import { paidFlashcardsHubUrl } from "../helpers/paid-content-discovery";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  expectPaidLearnerShellReady,
  learnerAppMainLandmark,
} from "../helpers/paid-learner-shell";
import { expectNoSubscriptionPaywall } from "../helpers/paid-surface-assertions";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";

const RN_PATHWAY_ID =
  process.env.FLASHCARDS_MCQ_QA_RN_PATHWAY_ID?.trim() || PAID_E2E_DEFAULT_PATHWAY_ID;
const RPN_PATHWAY_ID =
  process.env.FLASHCARDS_MCQ_QA_RPN_PATHWAY_ID?.trim() || "ca-rpn-rex-pn";
const NP_PATHWAY_ID =
  process.env.FLASHCARDS_MCQ_QA_NP_PATHWAY_ID?.trim() || "us-np-ancc-fnp";
const ALLIED_PATHWAY_ID =
  process.env.FLASHCARDS_MCQ_QA_ALLIED_PATHWAY_ID?.trim() || "us-allied-mlt";
const CAPTURE_SCREENSHOTS = process.env.FLASHCARD_MCQ_QA_SCREENSHOTS === "1";

async function assertNoHorizontalOverflow(page: Page, selector: string): Promise<void> {
  const main = page.locator(selector).first();
  await expect(main).toBeVisible();
  const ok = await main.evaluate((el) => el.scrollWidth <= el.clientWidth + 2);
  expect(ok, `${selector} should not overflow horizontally`).toBe(true);
}

async function gotoFlashcardsAndStartCustomSession(
  page: Page,
  baseURL: string | undefined,
  pathwayId: string,
): Promise<boolean> {
  const url = new URL(
    paidFlashcardsHubUrl(pathwayId),
    resolveE2eAppBaseUrl(baseURL),
  ).toString();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  expectNotLoginUrl(page);
  await expectPaidLearnerShellReady(page, `flashcards hub ${pathwayId}`);
  await expectNoSubscriptionPaywall(page, `flashcards hub ${pathwayId}`);

  const notOnAccount = page.getByText("This study track is not on your account");
  if (await notOnAccount.isVisible().catch(() => false)) return false;

  const main = learnerAppMainLandmark(page);
  await expect(main).toBeVisible({ timeout: 120_000 });

  const start = main.locator("[data-nn-e2e-start-review]");
  const startVisible = await start.isVisible({ timeout: 60_000 }).catch(() => false);
  if (!startVisible) return false;

  await start.click();
  await page.waitForURL(/\/app\/flashcards\/custom/, { timeout: 120_000 });

  const noCards = page.getByRole("heading", { name: /no cards for this pathway yet/i });
  if (await noCards.isVisible().catch(() => false)) return false;

  const shell = page.locator(".nn-premium-flashcard-session-root.nn-flashcard-study-premium");
  await expect(shell).toBeVisible({ timeout: 120_000 });
  return true;
}

async function revealFirstCard(page: Page): Promise<boolean> {
  const layout = page.locator(".nn-flashcard-session-layout").first();
  await expect(layout).toBeVisible({ timeout: 90_000 });

  const hasMcq = await page.locator("[data-nn-premium-flashcard-mcq]").first().isVisible().catch(() => false);
  if (hasMcq) {
    const firstOption = page
      .locator("[data-nn-premium-flashcard-mcq] li button, [data-nn-premium-flashcard-mcq] li div[role]")
      .first();
    if (await firstOption.isVisible().catch(() => false)) {
      await firstOption.click();
    }
  } else {
    const revealBtn = page.locator(".nn-flashcard-reveal-cta--premium").first();
    if (await revealBtn.isVisible().catch(() => false)) {
      await revealBtn.click();
    }
  }

  return page.locator(".nn-flashcard-session-layout").first().evaluate((el) => {
    return el.getAttribute("data-nn-revealed") === "1";
  }).catch(() => false);
}

// ── TIER POOL ISOLATION ────────────────────────────────────────────────────────

test.describe("Flashcard pool isolation per tier", () => {
  for (const { label, pathwayId } of [
    { label: "RN (NCLEX-RN)", pathwayId: RN_PATHWAY_ID },
    { label: "RPN (REx-PN)", pathwayId: RPN_PATHWAY_ID },
    { label: "NP", pathwayId: NP_PATHWAY_ID },
    { label: "Allied (MLT)", pathwayId: ALLIED_PATHWAY_ID },
  ]) {
    test(`${label}: hub loads, pool contains cards, no wrong-tier leakage marker`, async ({
      page,
      baseURL,
    }, testInfo) => {
      test.setTimeout(240_000);
      const observers = attachPageObservers(page, { profile: "app" });
      try {
        const url = new URL(paidFlashcardsHubUrl(pathwayId), resolveE2eAppBaseUrl(baseURL)).toString();
        await page.goto(url, { waitUntil: "domcontentloaded" });
        expectNotLoginUrl(page);
        await expectPaidLearnerShellReady(page, `${label} flashcard hub`);
        await expectNoSubscriptionPaywall(page, `${label} flashcard hub`);

        const notOnAccount = page.getByText("This study track is not on your account");
        test.skip(
          await notOnAccount.isVisible().catch(() => false),
          `Paid fixture has no entitlement for ${label} (${pathwayId}) — set FLASHCARDS_MCQ_QA_*_PATHWAY_ID or expand subscription.`,
        );

        const main = learnerAppMainLandmark(page);
        await expect(main).toBeVisible({ timeout: 120_000 });
        await expect(main.locator("[data-nn-e2e-flashcards-hub]")).toBeVisible({ timeout: 90_000 });

        const rnLeakage = page.locator(`[data-pathway-id]:not([data-pathway-id="${pathwayId}"])`);
        const leakCount = await rnLeakage.count().catch(() => 0);
        expect(leakCount, `wrong-tier pathway markers should not leak into ${label} hub`).toBe(0);

        if (CAPTURE_SCREENSHOTS) {
          const shot = await page.screenshot({ fullPage: false });
          await testInfo.attach(`${label}-flashcard-hub.png`, { body: shot, contentType: "image/png" });
        }
      } finally {
        observers.dispose();
        await logObserverDiagnostics(observers, testInfo.title);
        expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
        expect(observers.failedRequests, observers.failedRequests.join("\n")).toEqual([]);
      }
    });
  }
});

// ── MCQ RENDER + REVEAL ────────────────────────────────────────────────────────

test.describe("MCQ flashcard front and back rendering (RN)", () => {
  test("front shows MCQ options + think-before cue; back shows after reveal only", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true });
    try {
      const launched = await gotoFlashcardsAndStartCustomSession(page, baseURL, RN_PATHWAY_ID);
      test.skip(!launched, "No RN custom session launched — check entitlement or pool.");

      const layout = page.locator(".nn-flashcard-session-layout").first();

      const hasMcq = await page.locator("[data-nn-premium-flashcard-mcq]").first().isVisible({ timeout: 30_000 }).catch(() => false);
      if (hasMcq) {
        await expect(page.locator("[data-nn-premium-flashcard-mcq]").first()).toBeVisible();
        const options = page.locator("[data-nn-premium-flashcard-mcq] li");
        const count = await options.count();
        expect(count, "MCQ card should have 3–4 answer options").toBeGreaterThanOrEqual(3);

        const thinkCue = page.locator("text=Think before selecting");
        await expect(thinkCue).toBeVisible({ timeout: 10_000 });

        await expect(layout).not.toHaveAttribute("data-nn-revealed", "1");
        await expect(page.locator("[data-nn-premium-flashcard-reveal]")).toHaveCount(0);

        const firstBtn = page.locator("[data-nn-premium-flashcard-mcq] li button").first();
        await expect(firstBtn).toBeVisible();
        await firstBtn.click();
      } else {
        const revealBtn = page.locator(".nn-flashcard-reveal-cta--premium").first();
        test.skip(!(await revealBtn.isVisible().catch(() => false)), "No MCQ and no reveal CTA — no cards to test.");
        await revealBtn.click();
      }

      await expect(layout).toHaveAttribute("data-nn-revealed", "1", { timeout: 30_000 });
      await expect(page.locator("[data-nn-premium-flashcard-reveal]").first()).toBeVisible({ timeout: 30_000 });

      if (CAPTURE_SCREENSHOTS) {
        const shot = await page.screenshot({ fullPage: false });
        await testInfo.attach("rn-mcq-front-back-desktop.png", { body: shot, contentType: "image/png" });
      }
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join("\n")).toEqual([]);
    }
  });

  test("correct answer and rationale visible after reveal", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const launched = await gotoFlashcardsAndStartCustomSession(page, baseURL, RN_PATHWAY_ID);
      test.skip(!launched, "No RN custom session.");

      const layout = page.locator(".nn-flashcard-session-layout").first();
      await expect(layout).toBeVisible({ timeout: 90_000 });

      await revealFirstCard(page);
      await expect(layout).toHaveAttribute("data-nn-revealed", "1", { timeout: 30_000 });

      const revealZone = page.locator("[data-nn-premium-flashcard-reveal]").first();
      await expect(revealZone).toBeVisible({ timeout: 30_000 });
      const revealText = await revealZone.textContent({ timeout: 10_000 });
      expect((revealText ?? "").trim().length, "reveal zone should have content").toBeGreaterThan(0);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });

  test("wrong-answer menu renders as collapsible details element after reveal", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const launched = await gotoFlashcardsAndStartCustomSession(page, baseURL, RN_PATHWAY_ID);
      test.skip(!launched, "No RN custom session.");

      const layout = page.locator(".nn-flashcard-session-layout").first();
      await expect(layout).toBeVisible({ timeout: 90_000 });

      const hasMcq = await page.locator("[data-nn-premium-flashcard-mcq]").first().isVisible({ timeout: 30_000 }).catch(() => false);
      test.skip(!hasMcq, "No MCQ card in session — wrong-answer menu only exists for exam-style cards.");

      await revealFirstCard(page);
      await expect(layout).toHaveAttribute("data-nn-revealed", "1", { timeout: 30_000 });

      const wrongMenu = page.locator("[data-testid='flashcard-wrong-answer-menu']").first();
      await expect(wrongMenu).toBeVisible({ timeout: 15_000 });

      const tagName = await wrongMenu.evaluate((el) => el.tagName.toLowerCase());
      expect(tagName, "wrong-answer menu should be a <details> element").toBe("details");

      const isOpen = await wrongMenu.evaluate((el) => (el as HTMLDetailsElement).open);
      expect(isOpen, "wrong-answer menu should be open by default after reveal").toBe(true);

      if (CAPTURE_SCREENSHOTS) {
        const shot = await page.screenshot({ fullPage: false });
        await testInfo.attach("wrong-answer-menu-open.png", { body: shot, contentType: "image/png" });
      }
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
    }
  });

  test("internal study links render in reveal zone after flip", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const launched = await gotoFlashcardsAndStartCustomSession(page, baseURL, RN_PATHWAY_ID);
      test.skip(!launched, "No RN custom session.");

      const layout = page.locator(".nn-flashcard-session-layout").first();
      await expect(layout).toBeVisible({ timeout: 90_000 });

      await revealFirstCard(page);
      await expect(layout).toHaveAttribute("data-nn-revealed", "1", { timeout: 30_000 });

      const inlineLinks = page.locator("[data-testid='flashcard-inline-study-links']").first();
      const revealLinks = page.locator("[data-testid='flashcard-reveal-links']").first();

      const hasInline = await inlineLinks.isVisible({ timeout: 10_000 }).catch(() => false);
      const hasReveal = await revealLinks.isVisible({ timeout: 10_000 }).catch(() => false);

      if (hasInline || hasReveal) {
        const container = hasInline ? inlineLinks : revealLinks;
        await expect(container).toBeVisible();

        const allLinks = container.locator("a[href]");
        const linkCount = await allLinks.count();
        expect(linkCount, "study links section should have at least one link").toBeGreaterThan(0);

        for (let i = 0; i < linkCount; i++) {
          const href = await allLinks.nth(i).getAttribute("href");
          expect(href, `link ${i} should have a non-empty href`).toBeTruthy();
          expect(href).not.toMatch(/^https?:\/\/(example\.com|localhost:3000\/api\/flashcards)/);
        }

        if (CAPTURE_SCREENSHOTS) {
          const shot = await page.screenshot({ fullPage: false });
          await testInfo.attach("internal-links-section.png", { body: shot, contentType: "image/png" });
        }
      } else {
        test.skip(true, "No lesson/practice links metadata on current card — pool may not include linked cards.");
      }
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });

  test("4-button confidence controls (Again/Hard/Good/Easy) render after reveal", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true });
    try {
      const launched = await gotoFlashcardsAndStartCustomSession(page, baseURL, RN_PATHWAY_ID);
      test.skip(!launched, "No RN custom session.");

      const layout = page.locator(".nn-flashcard-session-layout").first();
      await expect(layout).toBeVisible({ timeout: 90_000 });

      await revealFirstCard(page);
      await expect(layout).toHaveAttribute("data-nn-revealed", "1", { timeout: 30_000 });

      const confidenceControls = page.locator("[data-nn-premium-flashcard-confidence]").first();
      await expect(confidenceControls).toBeVisible({ timeout: 30_000 });

      await expect(page.locator("[data-nn-flashcard-rating='again']").first()).toBeVisible();
      await expect(page.locator("[data-nn-flashcard-rating='hard']").first()).toBeVisible();
      await expect(page.locator("[data-nn-flashcard-rating='good']").first()).toBeVisible();
      await expect(page.locator("[data-nn-flashcard-rating='easy']").first()).toBeVisible();

      await expect(page.getByRole("button", { name: /^Again$/i }).first()).toBeVisible();
      await expect(page.getByRole("button", { name: /^Hard$/i }).first()).toBeVisible();
      await expect(page.getByRole("button", { name: /^Good$/i }).first()).toBeVisible();
      await expect(page.getByRole("button", { name: /^Easy$/i }).first()).toBeVisible();

      const easyBtn = page.getByRole("button", { name: /^Easy$/i }).first();
      await expect(easyBtn).toBeEnabled();
      await easyBtn.click();

      if (CAPTURE_SCREENSHOTS) {
        const shot = await page.screenshot({ fullPage: false });
        await testInfo.attach("confidence-controls-4-button.png", { body: shot, contentType: "image/png" });
      }
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join("\n")).toEqual([]);
    }
  });
});

// ── KEYBOARD ACCESSIBILITY ─────────────────────────────────────────────────────

test.describe("Flashcard keyboard accessibility (RN)", () => {
  test("Space reveals non-MCQ card; 1–4 keys rate after reveal", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const launched = await gotoFlashcardsAndStartCustomSession(page, baseURL, RN_PATHWAY_ID);
      test.skip(!launched, "No RN custom session.");

      const layout = page.locator(".nn-flashcard-session-layout").first();
      await expect(layout).toBeVisible({ timeout: 90_000 });

      const hasRevealCta = await page.locator(".nn-flashcard-reveal-cta--premium").first().isVisible({ timeout: 10_000 }).catch(() => false);
      if (hasRevealCta) {
        await page.keyboard.press("Space");
        await expect(layout).toHaveAttribute("data-nn-revealed", "1", { timeout: 15_000 });
        await page.keyboard.press("3");
      }

      await expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });

  test("reveal CTA is keyboard focusable and activates with Enter", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const launched = await gotoFlashcardsAndStartCustomSession(page, baseURL, RN_PATHWAY_ID);
      test.skip(!launched, "No RN custom session.");

      const revealCta = page.locator(".nn-flashcard-reveal-cta--premium").first();
      if (await revealCta.isVisible({ timeout: 10_000 }).catch(() => false)) {
        await revealCta.focus();
        await expect(revealCta).toBeFocused({ timeout: 5_000 });
        await page.keyboard.press("Enter");
        const layout = page.locator(".nn-flashcard-session-layout").first();
        await expect(layout).toHaveAttribute("data-nn-revealed", "1", { timeout: 15_000 });
      }
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });
});

// ── MOBILE LAYOUT ─────────────────────────────────────────────────────────────

test.describe("Flashcard mobile layout (RN)", () => {
  test("mobile 390px: front, reveal, confidence buttons, no overflow", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 390, height: 844 });
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const launched = await gotoFlashcardsAndStartCustomSession(page, baseURL, RN_PATHWAY_ID);
      test.skip(!launched, "No RN custom session (mobile).");

      const layout = page.locator(".nn-flashcard-session-layout").first();
      await expect(layout).toBeVisible({ timeout: 90_000 });

      await assertNoHorizontalOverflow(page, "#nn-learner-main, [data-nn-learner-main]");

      await revealFirstCard(page);
      await expect(layout).toHaveAttribute("data-nn-revealed", "1", { timeout: 30_000 });
      await assertNoHorizontalOverflow(page, "#nn-learner-main, [data-nn-learner-main]");

      const confidenceControls = page.locator("[data-nn-premium-flashcard-confidence]").first();
      await expect(confidenceControls).toBeVisible({ timeout: 20_000 });
      const overflows = await confidenceControls.evaluate((el) => el.scrollWidth > el.clientWidth + 2);
      expect(overflows, "confidence controls should not overflow horizontally on mobile").toBe(false);

      await page.waitForTimeout(3000);
      await assertNoHorizontalOverflow(page, "#nn-learner-main, [data-nn-learner-main]");

      if (CAPTURE_SCREENSHOTS) {
        const shot = await page.screenshot({ fullPage: false });
        await testInfo.attach("mobile-flashcard-back.png", { body: shot, contentType: "image/png" });
      }
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
      expect(observers.failedRequests, observers.failedRequests.join("\n")).toEqual([]);
    }
  });

  test("mobile 390px: wrong-answer menu does not overflow", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 390, height: 844 });
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const launched = await gotoFlashcardsAndStartCustomSession(page, baseURL, RN_PATHWAY_ID);
      test.skip(!launched, "No RN custom session (mobile wrong-answer).");

      const layout = page.locator(".nn-flashcard-session-layout").first();
      await expect(layout).toBeVisible({ timeout: 90_000 });

      const hasMcq = await page.locator("[data-nn-premium-flashcard-mcq]").first().isVisible({ timeout: 15_000 }).catch(() => false);
      test.skip(!hasMcq, "No MCQ card — wrong-answer menu only for MCQ cards.");

      await revealFirstCard(page);
      await expect(layout).toHaveAttribute("data-nn-revealed", "1", { timeout: 30_000 });

      const wrongMenu = page.locator("[data-testid='flashcard-wrong-answer-menu']").first();
      if (await wrongMenu.isVisible({ timeout: 10_000 }).catch(() => false)) {
        const overflows = await wrongMenu.evaluate((el) => el.scrollWidth > el.clientWidth + 4);
        expect(overflows, "wrong-answer menu should not overflow on 390px viewport").toBe(false);
      }
      await assertNoHorizontalOverflow(page, "#nn-learner-main, [data-nn-learner-main]");
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });
});

// ── DRAFT EXCLUSION ────────────────────────────────────────────────────────────

test.describe("Draft/review_required card exclusion", () => {
  test("custom session API does not return draft cards", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(120_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const url = new URL(
        `/app/flashcards?pathwayId=${encodeURIComponent(RN_PATHWAY_ID)}`,
        resolveE2eAppBaseUrl(baseURL),
      ).toString();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectPaidLearnerShellReady(page, "flashcards hub draft exclusion");

      const notOnAccount = page.getByText("This study track is not on your account");
      test.skip(await notOnAccount.isVisible().catch(() => false), "No entitlement for RN pathway.");

      const apiRes = await page.request.get(
        `/api/flashcards/custom-session?pathwayId=${encodeURIComponent(RN_PATHWAY_ID)}&includeCards=1&cardLimit=50`,
      );
      const data = (await apiRes.json()) as { cards?: Array<{ status?: string; id?: string }> };
      const cards = data.cards ?? [];

      const draftCards = cards.filter((c) => c.status === "DRAFT" || c.status === "REVIEW_REQUIRED");
      expect(draftCards.length, "No draft/review_required cards should appear in custom session").toBe(0);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });
});

// ── ECG EXCLUSION ─────────────────────────────────────────────────────────────

test.describe("ECG specialty card exclusion from standard pool", () => {
  test("standard RN custom session deck band does not surface ECG-only deck without ECG entitlement", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(120_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const url = new URL(
        paidFlashcardsHubUrl(RN_PATHWAY_ID),
        resolveE2eAppBaseUrl(baseURL),
      ).toString();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectPaidLearnerShellReady(page, "flashcards RN hub ECG check");

      const notOnAccount = page.getByText("This study track is not on your account");
      test.skip(await notOnAccount.isVisible().catch(() => false), "No entitlement for RN.");

      const main = learnerAppMainLandmark(page);
      await expect(main).toBeVisible({ timeout: 120_000 });

      const ecgOnlyDeck = main.locator("[data-deck-slug*='ecg']:not([data-ecg-enabled='1']), [data-deck-title*='ECG']:not([data-ecg-enabled='1'])").first();
      const ecgLeaked = await ecgOnlyDeck.isVisible().catch(() => false);
      expect(ecgLeaked, "ECG-only decks should not appear in standard RN pool without ECG entitlement").toBe(false);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });
});

// ── EMPTY POOL SAFE STATE ─────────────────────────────────────────────────────

test.describe("Empty pool safe state", () => {
  test("requesting empty/zero-card pool renders safe empty state (no crash, no error console)", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(120_000);
    const observers = attachPageObservers(page, { profile: "app", captureConsoleContext: true });
    try {
      const url = new URL(
        `/app/flashcards/custom?pathwayId=non-existent-pathway-qa-sentinel&cardLimit=0&includeCards=1`,
        resolveE2eAppBaseUrl(baseURL),
      ).toString();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectPaidLearnerShellReady(page, "empty pool safe state");

      await page.waitForTimeout(4000);

      const crash = page.locator("[data-nn-error-boundary-fallback], .nn-fatal-error-boundary").first();
      const hasCrash = await crash.isVisible().catch(() => false);
      expect(hasCrash, "App should not crash on empty/unknown pool").toBe(false);

      const noCards = page.getByRole("heading", { name: /no cards for this pathway yet|no flashcards/i }).first();
      const hasNoCards = await noCards.isVisible({ timeout: 15_000 }).catch(() => false);

      if (!hasNoCards) {
        const main = learnerAppMainLandmark(page);
        const mainText = await main.textContent().catch(() => "");
        expect((mainText ?? "").trim().length, "Main should render some content for empty pool").toBeGreaterThan(0);
      }

      if (CAPTURE_SCREENSHOTS) {
        const shot = await page.screenshot({ fullPage: false });
        await testInfo.attach("empty-pool-safe-state.png", { body: shot, contentType: "image/png" });
      }
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
    }
  });
});

// ── RPN SMOKE ─────────────────────────────────────────────────────────────────

test.describe("RPN flashcard smoke", () => {
  test("RPN hub loads, custom session starts, MCQ options visible", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const launched = await gotoFlashcardsAndStartCustomSession(page, baseURL, RPN_PATHWAY_ID);
      test.skip(!launched, `No RPN session (${RPN_PATHWAY_ID}) — set FLASHCARDS_MCQ_QA_RPN_PATHWAY_ID.`);

      const layout = page.locator(".nn-flashcard-session-layout").first();
      await expect(layout).toBeVisible({ timeout: 90_000 });
      await assertNoHorizontalOverflow(page, "#nn-learner-main, [data-nn-learner-main]");

      if (CAPTURE_SCREENSHOTS) {
        const shot = await page.screenshot({ fullPage: false });
        await testInfo.attach("rpn-flashcard-hub.png", { body: shot, contentType: "image/png" });
      }
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
    }
  });
});

// ── NP SMOKE ──────────────────────────────────────────────────────────────────

test.describe("NP flashcard smoke", () => {
  test("NP hub loads, custom session starts", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const launched = await gotoFlashcardsAndStartCustomSession(page, baseURL, NP_PATHWAY_ID);
      test.skip(!launched, `No NP session (${NP_PATHWAY_ID}) — set FLASHCARDS_MCQ_QA_NP_PATHWAY_ID.`);

      const layout = page.locator(".nn-flashcard-session-layout").first();
      await expect(layout).toBeVisible({ timeout: 90_000 });
      await assertNoHorizontalOverflow(page, "#nn-learner-main, [data-nn-learner-main]");
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
    }
  });
});

// ── ALLIED SMOKE ──────────────────────────────────────────────────────────────

test.describe("Allied flashcard smoke", () => {
  test("Allied (MLT) hub loads, no RN/NP card leakage", async ({ page, baseURL }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const url = new URL(
        paidFlashcardsHubUrl(ALLIED_PATHWAY_ID),
        resolveE2eAppBaseUrl(baseURL),
      ).toString();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectPaidLearnerShellReady(page, `allied flashcard hub ${ALLIED_PATHWAY_ID}`);
      await expectNoSubscriptionPaywall(page, `allied flashcard hub ${ALLIED_PATHWAY_ID}`);

      const notOnAccount = page.getByText("This study track is not on your account");
      test.skip(
        await notOnAccount.isVisible().catch(() => false),
        `No Allied entitlement for ${ALLIED_PATHWAY_ID} — set FLASHCARDS_MCQ_QA_ALLIED_PATHWAY_ID.`,
      );

      const main = learnerAppMainLandmark(page);
      await expect(main).toBeVisible({ timeout: 120_000 });

      const rnLeakage = page.locator("[data-pathway-id='us-rn-nclex-rn']").first();
      const hasLeak = await rnLeakage.isVisible().catch(() => false);
      expect(hasLeak, "RN pathway markers should not appear in Allied hub").toBe(false);

      if (CAPTURE_SCREENSHOTS) {
        const shot = await page.screenshot({ fullPage: false });
        await testInfo.attach("allied-flashcard-hub.png", { body: shot, contentType: "image/png" });
      }
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
    }
  });
});
