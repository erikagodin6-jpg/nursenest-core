/**
 * Paid-user end-to-end smoke: session check, lessons, flashcards, CAT, nav, account.
 *
 * Auth: run with project `chromium-paid` (depends on `setup-paid-auth`). Login runs once in
 * `tests/e2e/setup/auth.setup.ts`; cookies/localStorage are saved to `tests/e2e/.auth/paid-user.json` and reused.
 *
 * Setup env (for `setup-paid-auth` only) — see `helpers/paid-test-credentials.ts`:
 *   E2E_PAID_EMAIL + E2E_PAID_PASSWORD, or PLAYWRIGHT_TEST_EMAIL + PLAYWRIGHT_TEST_PASSWORD
 *
 * Optional:
 *   BASE_URL (default http://127.0.0.1:3000)
 *   PLAYWRIGHT_PAID_AUTH_STATE — override path for saved auth JSON
 *
 * Run:
 *   cd nursenest-core && E2E_PAID_EMAIL=... E2E_PAID_PASSWORD=... BASE_URL=https://www.nursenest.ca npx playwright test --project=chromium-paid
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";

const PLACEHOLDER_RE = /\b(TBD|null|undefined)\b/i;

type SectionResult = "pass" | "fail" | "skipped";

async function dismissFlashcardResumeIfPresent(page: Page) {
  const startFresh = page.getByRole("button", { name: /^Start fresh$/i });
  if (await startFresh.isVisible().catch(() => false)) {
    await startFresh.click();
    await page.waitForTimeout(300);
  }
}

async function answerOneCatItem(page: Page) {
  const list = page.locator("ul.nn-cat-opt-list").first();
  await expect(list).toBeVisible({ timeout: 120_000 });

  const mcBtn = list.locator("button.nn-cat-opt");
  const sataLabel = list.locator("label.nn-cat-opt");
  if ((await mcBtn.count()) > 0) {
    await mcBtn.first().click();
  } else if ((await sataLabel.count()) > 0) {
    await sataLabel.first().click();
  } else {
    throw new Error("No CAT answer options found (expected MC or SATA controls).");
  }

  const next = page.getByRole("button", { name: /Next question|Submit & finish/ });
  await expect(next).toBeEnabled({ timeout: 30_000 });
  await next.click();
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
}

async function globalContentScan(page: Page): string[] {
  const body = await page.locator("body").innerText().catch(() => "");
  if (!body || PLACEHOLDER_RE.test(body)) {
    return [`Placeholder leak: ${body.slice(0, 200)}`];
  }
  return [];
}

test.describe("Paid user smoke (serial)", () => {
  test.describe.configure({ mode: "serial" });

  const sections: Record<string, SectionResult> = {
    login: "fail",
    lessons: "skipped",
    flashcards: "skipped",
    catExams: "skipped",
    navigation: "skipped",
    accountUi: "skipped",
    globalChecks: "skipped",
  };

  test("full paid journey with section reporting", async ({ page }, testInfo) => {
    const obs = attachPageObservers(page, { profile: "app" });
    const broken: string[] = [];
    const screenshots: string[] = [];

    async function failShot(slug: string) {
      const p = testInfo.outputPath(`failure-${slug}.png`);
      await page.screenshot({ path: p, fullPage: true }).catch(() => {});
      screenshots.push(p);
    }

    try {
      // —— Session (storage state from setup-paid-auth) ——
      try {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        const url = page.url();
        if (/\/login/i.test(url)) {
          throw new Error(
            "Unauthenticated — run with --project=chromium-paid so setup-paid-auth saves storage (needs paid credentials: E2E_PAID_* or PLAYWRIGHT_TEST_*).",
          );
        }
        await expect(page).toHaveURL(/\/app(\/|$)/);
        sections.login = "pass";
      } catch (e) {
        sections.login = "fail";
        broken.push(`login: ${e instanceof Error ? e.message : String(e)}`);
        await failShot("login");
      }

      if (sections.login !== "pass") {
        broken.push("Skipped: downstream sections require an authenticated session.");
      } else {
        sections.lessons = "fail";
        sections.flashcards = "fail";
        sections.catExams = "fail";
        sections.navigation = "fail";
        sections.accountUi = "fail";
        sections.globalChecks = "fail";
        // —— Lessons ——
        try {
          await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: "Subscription required" })).toHaveCount(0);
          const lessonLinks = page.locator('a[href^="/app/lessons/"]');
          await expect(lessonLinks.first()).toBeVisible({ timeout: 120_000 });
          const href1 = await lessonLinks.nth(0).getAttribute("href");
          const href2 = await lessonLinks.nth(1).getAttribute("href");
          expect(href1).toBeTruthy();
          await lessonLinks.nth(0).click();
          await page.waitForLoadState("domcontentloaded");
          const mainText = await page.locator("main").innerText();
          expect(mainText.length).toBeGreaterThan(120);
          expect(PLACEHOLDER_RE.test(mainText)).toBe(false);

          if (href2 && href2 !== href1) {
            await page.goto(href2, { waitUntil: "domcontentloaded" });
            const t2 = await page.locator("main").innerText();
            expect(t2.length).toBeGreaterThan(120);
          }
          sections.lessons = "pass";
        } catch (e) {
          sections.lessons = "fail";
          broken.push(`lessons: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("lessons");
        }

        // —— Flashcards ——
        try {
          await page.goto("/app/flashcards", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: "Subscription required" })).toHaveCount(0);
          const learnFirst = page.locator('a[href*="/app/flashcards/"][href*="mode=learn"]').first();
          await expect(learnFirst).toBeVisible({ timeout: 120_000 });
          const deckHref = await learnFirst.getAttribute("href");
          expect(deckHref).toBeTruthy();
          await page.goto(deckHref!, { waitUntil: "domcontentloaded" });
          await dismissFlashcardResumeIfPresent(page);
          await expect(page.getByRole("button", { name: /^Reveal answer$/ })).toBeVisible({ timeout: 120_000 });
          await page.getByRole("button", { name: /^Reveal answer$/ }).click();
          await expect(page.getByText(/^Correct answer$/i)).toBeVisible();
          const nextNav = page.getByRole("button", { name: "Next", exact: true });
          if (await nextNav.isEnabled().catch(() => false)) {
            await nextNav.click();
          }
          sections.flashcards = "pass";
        } catch (e) {
          sections.flashcards = "fail";
          broken.push(`flashcards: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("flashcards");
        }

        // —— CAT exams ——
        try {
          await page.goto("/app/practice-tests?cat=1", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: "Subscription required" })).toHaveCount(0);
          await expect(page.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible({ timeout: 60_000 });
          await page.locator("[data-nn-qa-practice-hub-start-test]").click();
          await expect(page.getByRole("button", { name: /^Begin exam$/i })).toBeVisible({ timeout: 15_000 });
          await page.getByRole("button", { name: /^Begin exam$/i }).click();
          await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });
          await expect(page.locator(".nn-cat-question-stem, .nn-marketing-body-sm").first()).toBeVisible({
            timeout: 120_000,
          });
          for (let i = 0; i < 3; i++) {
            await answerOneCatItem(page);
          }
          sections.catExams = "pass";
        } catch (e) {
          sections.catExams = "fail";
          broken.push(`catExams: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("cat-exams");
        }

        // —— Navigation ——
        try {
          await page.goto("/app", { waitUntil: "domcontentloaded" });
          const nav = page.locator('nav[aria-label="Learner primary actions"]');
          await expect(nav.getByRole("link", { name: /Lessons/i }).first()).toBeVisible({ timeout: 30_000 });
          await nav.getByRole("link", { name: /Lessons/i }).first().click();
          await page.waitForURL(/\/app\/lessons/, { timeout: 30_000 });
          await page.goBack();
          await page.waitForTimeout(400);
          await page.goForward();
          await page.waitForTimeout(400);

          await page.setViewportSize({ width: 390, height: 844 });
          await page.goto("/app/flashcards", { waitUntil: "domcontentloaded" });
          const bottom = page.locator('nav[aria-label="Learner bottom navigation"]');
          await expect(bottom).toBeVisible({ timeout: 15_000 });
          await bottom.getByRole("link").nth(1).click();
          await page.waitForTimeout(500);
          await page.setViewportSize({ width: 1280, height: 800 });
          sections.navigation = "pass";
        } catch (e) {
          sections.navigation = "fail";
          broken.push(`navigation: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("navigation");
        }

        // —— Account / paid UI ——
        try {
          await page.goto("/app/account/overview", { waitUntil: "domcontentloaded" });
          const main = await page.locator("main").innerText();
          expect(main.length).toBeGreaterThan(80);
          await page.goto("/app/account/billing", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: /Subscription & billing/i })).toBeVisible({ timeout: 30_000 });
          const billingText = await page.locator("main").innerText();
          expect(billingText.length).toBeGreaterThan(40);
          sections.accountUi = "pass";
        } catch (e) {
          sections.accountUi = "fail";
          broken.push(`accountUi: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("account");
        }

        // —— Global checks ——
        try {
          await page.goto("/app", { waitUntil: "domcontentloaded" });
          const leaks = await globalContentScan(page);
          expect(leaks, leaks.join("; ")).toEqual([]);
          const seriousConsole = obs.consoleErrors.filter(
            (x) => !/cookie|Content Security Policy|third-party|analytics/i.test(x),
          );
          if (seriousConsole.length > 0) {
            broken.push(`console: ${seriousConsole.slice(0, 5).join(" | ")}`);
          }
          if (obs.failedRequests.length > 0) {
            broken.push(`network: ${obs.failedRequests.slice(0, 8).join(" | ")}`);
          }
          sections.globalChecks = seriousConsole.length === 0 && obs.failedRequests.length === 0 ? "pass" : "fail";
        } catch (e) {
          sections.globalChecks = "fail";
          broken.push(`globalChecks: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("global");
        }
      }
    } finally {
      obs.dispose();
    }

    await testInfo.attach("section-results.json", {
      body: Buffer.from(JSON.stringify({ sections, broken, screenshots }, null, 2)),
      contentType: "application/json",
    });

    const failedSections = Object.entries(sections)
      .filter(([, v]) => v === "fail")
      .map(([k]) => k);
    expect(
      failedSections,
      `Failed sections: ${failedSections.join(", ")}\nBroken:\n${broken.join("\n")}`,
    ).toEqual([]);
  });
});
