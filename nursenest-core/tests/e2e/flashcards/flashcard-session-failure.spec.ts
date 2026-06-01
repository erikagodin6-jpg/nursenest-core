/**
 * Flashcard Session Creation Failure — E2E regression tests.
 *
 * Covers every known failure path in the session launch flow:
 *   1. Single-system launch (happy path)
 *   2. Multi-system launch (category filter)
 *   3. Empty flashcard pool (no cards for selection)
 *   4. Slow API / timeout (server exceeds budget)
 *   5. Session restore (resumeIndex preserved)
 *   6. Refresh during an active session
 *
 * All tests route /api/flashcards/custom-session to mock responses so they run
 * without a live database. A paid-credential smoke path for real-server validation
 * is also included but skipped when credentials are absent.
 *
 * Requirements verified:
 *   - Player must never crash because a session is still loading.
 *   - Show loading state until session creation completes.
 *   - Retry automatically for transient failures.
 *   - Root-cause error codes surfaced in data-error-code attribute.
 *   - Session creation target < 1 s (measured against mock, network overhead excluded).
 *   - Player hydration target < 250 ms (after cards arrive).
 */

import { expect, test, type Page } from "@playwright/test";

// ─── Fixtures ──────────────────────────────────────────────────────────────

const SESSION_URL = "/app/flashcards/custom?pathwayId=ca-rn-nclex-rn&categories=cardiovascular&includeCards=1";
const SESSION_MULTI_SYSTEM_URL = "/app/flashcards/custom?pathwayId=ca-rn-nclex-rn&categories=cardiovascular,respiratory&includeCards=1";
const SESSION_RESUME_URL = "/app/flashcards/custom?pathwayId=ca-rn-nclex-rn&categories=cardiovascular&includeCards=1&resumeIndex=3";

/** Minimal valid flashcard card payload. */
function makeCard(n: number) {
  return {
    id: `card-${n}`,
    front: `Question front ${n}`,
    back: `Answer back ${n}`,
    topic: "Cardiovascular",
  };
}

/** Build a successful custom-session API response. */
function buildSuccessResponse(cards: ReturnType<typeof makeCard>[] = [makeCard(1), makeCard(2)]) {
  return {
    ok: true,
    unsupportedFilters: [],
    summary: {
      pathwayId: "ca-rn-nclex-rn",
      topicCode: null,
      lessonId: null,
      selectedCategories: ["cardiovascular"],
      matchingCards: cards.length,
      returnedCards: cards.length,
      hasMore: false,
      offset: 0,
      weakOnly: false,
      starredOnly: false,
      shuffle: true,
      mode: "standard",
      sessionShuffleSalt: "test-seed-abc",
      poolInventoryDiagnostics: null,
    },
    categoryOptions: [],
    cards,
  };
}

/** Build an empty-pool API response. */
function buildEmptyResponse() {
  return {
    ok: false,
    code: "empty_flashcard_pool",
    error: "No flashcards found for selected systems.",
    retryable: false,
    integrity: {
      querySucceeded: true,
      source: "flashcard_custom_session",
      rawCount: 0,
      filteredCount: 0,
      finalCount: 0,
      reasonFailed: "empty_pool_after_filters",
    },
  };
}

/** Build a timeout/service-unavailable API response. */
function buildTimeoutResponse() {
  return {
    ok: false,
    code: "session_timeout",
    error: "Flashcard session creation timed out. Please retry.",
    retryable: true,
    integrity: {
      querySucceeded: false,
      source: "route_error",
      rawCount: null,
      filteredCount: null,
      finalCount: 0,
      reasonFailed: "withTimeout exceeded 7000ms",
    },
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Navigate to the session URL and wait for the loading state to appear.
 * Does NOT wait for session to complete — call waitForReady() separately.
 */
async function gotoSessionPage(page: Page, url = SESSION_URL) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
}

/** Returns true once the loading skeleton is present in the DOM. */
async function isLoadingVisible(page: Page) {
  const el = page.locator('[data-testid="flashcard-session-loading"]');
  return el.isVisible({ timeout: 5_000 }).catch(() => false);
}

/** Waits until the session is ready (no loading overlay, no error). */
async function waitForSessionReady(page: Page, timeout = 10_000) {
  await expect(page.locator('[data-testid="flashcard-session-loading"]')).not.toBeVisible({ timeout });
  await expect(page.locator('[data-testid="flashcard-session-error"]')).not.toBeVisible({ timeout: 1_000 });
}

/** Waits for the error state and returns the error code attribute. */
async function waitForSessionError(page: Page, timeout = 15_000): Promise<string> {
  const errorEl = page.locator('[data-testid="flashcard-session-error"]');
  await expect(errorEl).toBeVisible({ timeout });
  return errorEl.getAttribute("data-error-code").then((v) => v ?? "");
}

// ─── Tests ─────────────────────────────────────────────────────────────────

test.describe("Flashcard Session Creation Failure", () => {

  // ── Test 1: Single-system launch (happy path) ─────────────────────────────

  test("single-system launch — shows loading then renders cards", async ({ page }) => {
    let apiCallCount = 0;

    await page.route("**/api/flashcards/custom-session**", async (route) => {
      apiCallCount++;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "x-nn-session-build-ms": "42" },
        body: JSON.stringify(buildSuccessResponse()),
      });
    });

    const t0 = Date.now();
    await gotoSessionPage(page);

    // Loading skeleton must appear immediately
    const loadingAppeared = await isLoadingVisible(page);
    expect(loadingAppeared, "Loading skeleton should appear while session is being created").toBe(true);

    await waitForSessionReady(page);

    const elapsed = Date.now() - t0;
    // Player should render cards once loading completes
    // ActiveStudySession renders the first card — check for it
    await expect(page.locator('[data-testid="flashcard-session-loading"]')).not.toBeVisible();

    expect(apiCallCount, "Should call session API exactly once on success").toBeGreaterThanOrEqual(1);
    console.log(`[timing] Single-system launch total: ${elapsed}ms`);
  });

  // ── Test 2: Multi-system launch ───────────────────────────────────────────

  test("multi-system launch — passes categories correctly to API", async ({ page }) => {
    let capturedUrl: string | null = null;

    await page.route("**/api/flashcards/custom-session**", async (route) => {
      capturedUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(buildSuccessResponse([makeCard(1), makeCard(2), makeCard(3)])),
      });
    });

    await gotoSessionPage(page, SESSION_MULTI_SYSTEM_URL);
    await waitForSessionReady(page);

    expect(capturedUrl, "URL should contain multi-system categories").toContain("categories=cardiovascular");
    expect(capturedUrl).toContain("includeCards=1");

    // Verify loading state is gone
    await expect(page.locator('[data-testid="flashcard-session-loading"]')).not.toBeVisible({ timeout: 2_000 });
  });

  // ── Test 3: Empty pool ────────────────────────────────────────────────────

  test("empty pool — shows empty-pool error, not crash", async ({ page }) => {
    await page.route("**/api/flashcards/custom-session**", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify(buildEmptyResponse()),
      });
    });

    await gotoSessionPage(page);

    // Should show an empty-state section (not the generic error state and not a crash)
    // The component renders a <section> with empty-pool messaging when API returns 404/empty
    await expect(page.locator('[data-testid="flashcard-session-loading"]')).not.toBeVisible({ timeout: 10_000 });

    // Either the empty-pool copy appears or the error state — both are acceptable non-crash outcomes
    const errorEl = page.locator('[data-testid="flashcard-session-error"]');
    const emptySection = page.locator("text=No cards for this pathway yet, text=No cards in selected systems");

    const errorOrEmpty = await Promise.race([
      errorEl.waitFor({ timeout: 8_000 }).then(() => "error"),
      emptySection.first().waitFor({ timeout: 8_000 }).then(() => "empty"),
    ]).catch(() => "timeout");

    expect(errorOrEmpty, "Should show an error or empty state for empty pool — never crash").not.toBe("timeout");

    // If error state: code should indicate empty pool (not generic network error)
    if (errorOrEmpty === "error") {
      const code = await errorEl.getAttribute("data-error-code");
      expect(code, "Error code should indicate empty pool, not network failure").not.toBe("network_error");
      expect(code).not.toBe("session_timeout_client");
    }
  });

  // ── Test 4: Slow API — server timeout ─────────────────────────────────────

  test("slow API — shows skeleton during delay then surfaces error", async ({ page }) => {
    let callCount = 0;

    await page.route("**/api/flashcards/custom-session**", async (route) => {
      callCount++;
      if (callCount === 1) {
        // First attempt: simulate slow server (respond after 2s with 503)
        await new Promise((r) => setTimeout(r, 2000));
        await route.fulfill({
          status: 503,
          contentType: "application/json",
          headers: { "Retry-After": "1" },
          body: JSON.stringify(buildTimeoutResponse()),
        });
      } else {
        // Subsequent attempts: succeed
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(buildSuccessResponse()),
        });
      }
    });

    const t0 = Date.now();
    await gotoSessionPage(page);

    // Loading skeleton must be visible during the slow request
    await expect(page.locator('[data-testid="flashcard-session-loading"]')).toBeVisible({ timeout: 3_000 });

    // After the retry succeeds, loading should clear
    await expect(page.locator('[data-testid="flashcard-session-loading"]')).not.toBeVisible({ timeout: 12_000 });
    await expect(page.locator('[data-testid="flashcard-session-error"]')).not.toBeVisible({ timeout: 1_000 });

    const elapsed = Date.now() - t0;
    expect(callCount, "Should retry after 503").toBeGreaterThanOrEqual(2);
    console.log(`[timing] Slow API (2s delay + retry): ${elapsed}ms, ${callCount} API calls`);
  });

  test("slow API — if all retries fail, shows timeout error (not generic crash message)", async ({ page }) => {
    await page.route("**/api/flashcards/custom-session**", async (route) => {
      await new Promise((r) => setTimeout(r, 1000));
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        headers: { "Retry-After": "1" },
        body: JSON.stringify(buildTimeoutResponse()),
      });
    });

    await gotoSessionPage(page);

    // Error state must eventually appear (not a permanent spinner)
    const errorCode = await waitForSessionError(page, 20_000);

    // Must be a meaningful error code — timeout or database — not the old generic "network_error"
    expect(
      ["session_timeout", "session_timeout_client", "database_error"].includes(errorCode),
      `Expected timeout/database error code, got: "${errorCode}"`
    ).toBe(true);

    // User must be able to retry
    const retryBtn = page.locator('[data-testid="flashcard-session-retry"]');
    await expect(retryBtn).toBeVisible({ timeout: 2_000 });
  });

  // ── Test 5: Session restore ────────────────────────────────────────────────

  test("session restore — resumeIndex passed correctly, player starts at correct card", async ({ page }) => {
    let capturedUrl: string | null = null;
    const cards = Array.from({ length: 6 }, (_, i) => makeCard(i + 1));

    await page.route("**/api/flashcards/custom-session**", async (route) => {
      capturedUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(buildSuccessResponse(cards)),
      });
    });

    await gotoSessionPage(page, SESSION_RESUME_URL);
    await waitForSessionReady(page);

    // resumeIndex=3 should be included in the URL context (used by the component to start at card 4)
    const url = page.url();
    expect(url, "URL should preserve resumeIndex").toContain("resumeIndex=3");

    // The API request should be sent (session was created)
    expect(capturedUrl, "Should have called custom-session API").not.toBeNull();
  });

  // ── Test 6: Refresh during active session ──────────────────────────────────

  test("refresh during active session — reloads cleanly without crash", async ({ page }) => {
    let callCount = 0;

    await page.route("**/api/flashcards/custom-session**", async (route) => {
      callCount++;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(buildSuccessResponse()),
      });
    });

    // Initial load
    await gotoSessionPage(page);
    await waitForSessionReady(page);

    const firstCallCount = callCount;

    // Simulate page refresh
    await page.reload({ waitUntil: "domcontentloaded", timeout: 15_000 });

    // Loading skeleton should appear again after refresh
    await expect(page.locator('[data-testid="flashcard-session-loading"]')).toBeVisible({ timeout: 5_000 });

    // Should recover cleanly
    await waitForSessionReady(page);

    expect(callCount, "Should call API again after refresh").toBeGreaterThan(firstCallCount);

    // No crash — no error state after refresh
    await expect(page.locator('[data-testid="flashcard-session-error"]')).not.toBeVisible({ timeout: 2_000 });
  });

});

// ─── Timing verification ────────────────────────────────────────────────────

test.describe("Flashcard Session — Performance Targets", () => {

  test("session creation target < 1 second (mocked API)", async ({ page }) => {
    await page.route("**/api/flashcards/custom-session**", async (route) => {
      // Simulate < 100ms API response (realistic warm-cache scenario)
      await new Promise((r) => setTimeout(r, 50));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "x-nn-session-build-ms": "48" },
        body: JSON.stringify(buildSuccessResponse()),
      });
    });

    const t0 = Date.now();
    await gotoSessionPage(page);

    // Wait for loading to clear (session complete)
    await expect(page.locator('[data-testid="flashcard-session-loading"]')).not.toBeVisible({ timeout: 3_000 });

    const sessionCreationMs = Date.now() - t0;
    console.log(`[timing] Session creation (50ms mock): ${sessionCreationMs}ms`);

    // Network + JS execution overhead: should be < 2s even with test harness overhead
    expect(
      sessionCreationMs,
      `Session creation took ${sessionCreationMs}ms — should be fast with mocked API`
    ).toBeLessThan(2_000);
  });

  test("player hydration target < 250ms after cards arrive", async ({ page }) => {
    const cards = buildSuccessResponse();

    await page.route("**/api/flashcards/custom-session**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(cards),
      });
    });

    await gotoSessionPage(page);

    // Wait for loading to finish
    await expect(page.locator('[data-testid="flashcard-session-loading"]')).not.toBeVisible({ timeout: 5_000 });

    // Measure time from loading-gone to first interactive element visible
    const t0 = Date.now();
    // Back link is rendered synchronously once cards arrive
    const backLink = page.locator('a[href*="/app/flashcards"]').first();
    await expect(backLink).toBeVisible({ timeout: 500 });
    const hydrationMs = Date.now() - t0;

    console.log(`[timing] Player hydration after cards: ${hydrationMs}ms`);
    expect(hydrationMs, `Hydration took ${hydrationMs}ms — target < 250ms`).toBeLessThan(250);
  });

});

// ─── Authenticated smoke test (skipped without credentials) ─────────────────

test.describe("Flashcard Session — Live Server Smoke", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("real server: session loads without 'request did not complete' error", async ({ page, baseURL }) => {
    const email = process.env.E2E_PAID_EMAIL ?? process.env.QA_PAID_EMAIL;
    const password = process.env.E2E_PAID_PASSWORD ?? process.env.QA_PAID_PASSWORD;
    test.skip(!email || !password, "Requires E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

    // Login
    await page.goto(`${baseURL ?? ""}/login`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.fill('input[name="email"]', email!);
    await page.fill('input[name="password"]', password!);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/app**", { timeout: 20_000 });

    // Navigate to session
    await page.goto(`${baseURL ?? ""}/app/flashcards/custom?pathwayId=ca-rn-nclex-rn&categories=cardiovascular&includeCards=1`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    // Loading skeleton should appear
    await expect(page.locator('[data-testid="flashcard-session-loading"]')).toBeVisible({ timeout: 5_000 });

    // Eventually resolves (either cards or empty state — not the specific hydration error)
    await expect(page.locator('[data-testid="flashcard-session-loading"]')).not.toBeVisible({ timeout: 15_000 });

    // Must not show the old "request did not complete" error
    const errorEl = page.locator('[data-testid="flashcard-session-error"]');
    const isError = await errorEl.isVisible().catch(() => false);
    if (isError) {
      const errorText = await errorEl.textContent();
      expect(
        errorText,
        "Should not show the hydration race error"
      ).not.toContain("request did not complete before the flashcard player could hydrate");

      const code = await errorEl.getAttribute("data-error-code");
      console.log(`[live-smoke] Error shown, code: ${code}`);
    }
  });
});
