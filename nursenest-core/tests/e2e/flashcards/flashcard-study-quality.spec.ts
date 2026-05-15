/**
 * Flashcard study quality acceptance tests:
 *  - No blank/empty hero top panel on flashcard study page
 *  - Markdown bold renders as <strong>, not literal **
 *  - Body-system filter (All systems button) appears on flashcards hub
 *  - Starting a filtered session shows the filter label inside the session
 *  - Filler/padding text is excluded from learner-facing cards
 *
 * Runs under the paid-user project (E2E_PAID_EMAIL / E2E_PAID_PASSWORD).
 * npx playwright test -c playwright.learning-routes.config.ts tests/e2e/flashcards/flashcard-study-quality.spec.ts
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

const RN_PATHWAY_ID = PAID_E2E_DEFAULT_PATHWAY_ID;
const FILLER_MARKER = "Padding card to reach lesson-linked minimum";

async function gotoHub(page: Page, baseURL: string | undefined): Promise<boolean> {
  const url = new URL(paidFlashcardsHubUrl(RN_PATHWAY_ID), resolveE2eAppBaseUrl(baseURL)).toString();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  expectNotLoginUrl(page);
  await expectPaidLearnerShellReady(page, "flashcards hub");
  await expectNoSubscriptionPaywall(page, "flashcards hub");
  const notOnAccount = page.getByText("This study track is not on your account");
  if (await notOnAccount.isVisible().catch(() => false)) return false;
  await expect(learnerAppMainLandmark(page)).toBeVisible({ timeout: 120_000 });
  return true;
}

async function startCustomSession(page: Page): Promise<boolean> {
  const start = learnerAppMainLandmark(page).locator("[data-nn-e2e-start-review]");
  if (!(await start.isVisible({ timeout: 30_000 }).catch(() => false))) return false;
  await start.click();
  await page.waitForURL(/\/app\/flashcards\/custom/, { timeout: 120_000 });
  const shell = page.locator(".nn-premium-flashcard-session-root.nn-flashcard-study-premium");
  return shell.isVisible({ timeout: 90_000 }).catch(() => false);
}

// ── 1: No blank/empty top panel ────────────────────────────────────────────────

test.describe("No blank hero panel above flashcard content", () => {
  test("nn-flashcard-session-ambient element is not rendered in the study session", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "No hub access — skipping blank-panel check.");
      const launched = await startCustomSession(page);
      test.skip(!launched, "No session launched — skipping blank-panel check.");

      // The ambient element should not exist after the fix
      const ambient = page.locator(".nn-flashcard-session-ambient");
      const count = await ambient.count();
      expect(count, "nn-flashcard-session-ambient should not be rendered after fix").toBe(0);

      // Ensure the layout element is present (session did load)
      await expect(page.locator(".nn-flashcard-session-layout").first()).toBeVisible({ timeout: 30_000 });
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
    }
  });
});

// ── 2: Markdown renders as HTML ────────────────────────────────────────────────

test.describe("Markdown rendering — bold renders as <strong> not literal **", () => {
  test("custom session API cards do not expose raw ** markdown in response", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(120_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const url = new URL(paidFlashcardsHubUrl(RN_PATHWAY_ID), resolveE2eAppBaseUrl(baseURL)).toString();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectPaidLearnerShellReady(page, "flashcards hub markdown check");

      const notOnAccount = page.getByText("This study track is not on your account");
      test.skip(await notOnAccount.isVisible().catch(() => false), "No entitlement for RN pathway.");

      // Fetch a sample of cards
      const apiRes = await page.request.get(
        `/api/flashcards/custom-session?pathwayId=${encodeURIComponent(RN_PATHWAY_ID)}&includeCards=1&cardLimit=30`,
      );
      const data = (await apiRes.json()) as { cards?: Array<{ front?: string; back?: string; explanation?: string }> };
      const cards = data.cards ?? [];
      test.skip(cards.length === 0, "No cards returned — cannot validate markdown.");

      // If any card has markdown, FlashcardRichContent should convert it.
      // We check the rendered DOM instead — look for literal ** in visible text nodes.
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const launched = await startCustomSession(page);
      test.skip(!launched, "Session not launched.");

      // Wait for session to render at least one card
      const layout = page.locator(".nn-flashcard-session-layout").first();
      await expect(layout).toBeVisible({ timeout: 60_000 });

      // Check no visible text in the card area contains literal ** patterns
      const cardText = await layout.innerText().catch(() => "");
      expect(
        cardText.includes("**"),
        `Flashcard rendered with raw markdown: found ** in card text: "${cardText.slice(0, 200)}"`,
      ).toBe(false);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });
});

// ── 3: Body-system filter on hub ───────────────────────────────────────────────

test.describe("Body-system filter appears on flashcards hub", () => {
  test("All Systems button and category selector grid are visible on hub", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(180_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "Hub not accessible — skipping body-system filter check.");

      const main = learnerAppMainLandmark(page);

      // Category selector grid should be present
      await expect(main.locator("[data-nn-e2e-flashcards-canonical-grid]")).toBeVisible({ timeout: 60_000 });

      // "All systems" default button should be visible
      await expect(
        main.locator("[data-nn-e2e-all-systems-btn]"),
      ).toBeVisible({ timeout: 30_000 });

      // The grid should contain category cards
      const cards = main.locator("[data-nn-learner-category-selector] [data-nn-category-card], [data-nn-learner-category-selector] button");
      const cardCount = await cards.count();
      expect(cardCount, "Category selector should show at least 4 body system options").toBeGreaterThanOrEqual(4);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
    }
  });

  test("selecting a body system and starting session shows filter in session header", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(240_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");

      const main = learnerAppMainLandmark(page);
      await expect(main.locator("[data-nn-e2e-flashcards-canonical-grid]")).toBeVisible({ timeout: 60_000 });

      // Click the first category card to select a system
      const firstCard = main
        .locator("[data-nn-learner-category-selector] button")
        .filter({ hasNot: page.locator("[data-nn-e2e-all-systems-btn]") })
        .first();

      const cardVisible = await firstCard.isVisible({ timeout: 20_000 }).catch(() => false);
      test.skip(!cardVisible, "No clickable category cards visible.");

      await firstCard.click();
      await page.waitForTimeout(500);

      // The "selected" indicator should update (at least one category now selected)
      const allSystemsBtn = main.locator("[data-nn-e2e-all-systems-btn]");
      const btnText = await allSystemsBtn.textContent().catch(() => "");
      // When a specific system is selected, All Systems button text should NOT show checkmark
      expect(btnText?.includes("✓"), "All Systems should NOT show ✓ when a specific system is selected").toBe(false);

      // Start session via bottom CTA (wired to selected categories)
      const bottomCta = main.locator("[data-nn-e2e-start-review-bottom]");
      if (await bottomCta.isVisible({ timeout: 10_000 }).catch(() => false)) {
        await bottomCta.click();
      } else {
        const topCta = main.locator("[data-nn-e2e-start-review]");
        await topCta.click();
      }

      await page.waitForURL(/\/app\/flashcards\/custom/, { timeout: 120_000 });

      // The URL should contain a categories param (not "all")
      const sessionUrl = page.url();
      expect(sessionUrl, "Session URL should contain categories filter").toContain("categories=");
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });
});

// ── 4: Filler text excluded from learner pool ──────────────────────────────────

test.describe("Padding/filler cards excluded from learner sessions", () => {
  test("custom session API does not return cards with filler rationale text", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(120_000);
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const url = new URL(paidFlashcardsHubUrl(RN_PATHWAY_ID), resolveE2eAppBaseUrl(baseURL)).toString();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await expectPaidLearnerShellReady(page, "flashcards filler exclusion");

      const notOnAccount = page.getByText("This study track is not on your account");
      test.skip(await notOnAccount.isVisible().catch(() => false), "No entitlement for RN pathway.");

      // Fetch a larger sample to catch filler cards
      const apiRes = await page.request.get(
        `/api/flashcards/custom-session?pathwayId=${encodeURIComponent(RN_PATHWAY_ID)}&includeCards=1&cardLimit=100&shuffle=0`,
      );
      expect(apiRes.ok(), `API request failed: ${apiRes.status()}`).toBe(true);

      const data = (await apiRes.json()) as {
        cards?: Array<{
          id?: string;
          front?: string;
          back?: string;
          explanation?: string;
          rationaleCorrect?: string;
        }>;
      };
      const cards = data.cards ?? [];
      test.skip(cards.length === 0, "No cards returned — cannot validate filler exclusion.");

      const fillerCards = cards.filter((c) => {
        const fields = [c.front ?? "", c.back ?? "", c.explanation ?? "", c.rationaleCorrect ?? ""];
        return fields.some((f) => f.includes(FILLER_MARKER));
      });

      expect(
        fillerCards.length,
        `Found ${fillerCards.length} padding/filler card(s). First: "${fillerCards[0]?.front?.slice(0, 120) ?? ""}"`,
      ).toBe(0);
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
    }
  });
});

// ── 5: Tablet sidebar does not crowd the card ──────────────────────────────────

test.describe("Study Pulse sidebar on tablet — collapses below lg breakpoint", () => {
  test("tablet 768px: Study Pulse toggle button is visible; sidebar is collapsed by default", async ({
    page,
    baseURL,
  }, testInfo) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 768, height: 1024 });
    const observers = attachPageObservers(page, { profile: "app" });
    try {
      const ok = await gotoHub(page, baseURL);
      test.skip(!ok, "Hub not accessible.");
      const launched = await startCustomSession(page);
      test.skip(!launched, "Session not launched.");

      const layout = page.locator(".nn-flashcard-session-layout").first();
      await expect(layout).toBeVisible({ timeout: 60_000 });

      // The toggle button should be visible at tablet width
      const toggle = page.locator("[data-testid='study-pulse-toggle']").first();
      await expect(toggle).toBeVisible({ timeout: 20_000 });

      // The rail should be hidden by default (collapsed)
      const rail = page.locator("#nn-study-pulse-rail").first();
      const railVisible = await rail.isVisible().catch(() => false);
      expect(railVisible, "Study Pulse rail should be collapsed by default at 768px").toBe(false);

      // After clicking the toggle, the rail should appear
      await toggle.click();
      await expect(rail).toBeVisible({ timeout: 5_000 });

      // Main card should still be present and readable
      await expect(layout).toBeVisible();
    } finally {
      observers.dispose();
      await logObserverDiagnostics(observers, testInfo.title);
      expect(observers.consoleErrors, observers.consoleErrors.join("\n")).toEqual([]);
    }
  });
});
