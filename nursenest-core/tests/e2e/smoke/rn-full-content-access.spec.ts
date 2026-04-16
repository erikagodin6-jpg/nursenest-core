/**
 * Paid RN learner surfaces — **full RN lesson library** (all hub pages + virtual scroll), flashcards,
 * question bank, adaptive CAT — real routes, no mocks.
 *
 * Requires: `QA_PAID_EMAIL` + `QA_PAID_PASSWORD` (or `E2E_PAID_*` / `PLAYWRIGHT_TEST_*`).
 *
 * Run (extended smoke only — long-running full-content audit):
 *   cd nursenest-core && npm run qa:smoke:extended -- tests/e2e/smoke/rn-full-content-access.spec.ts
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers, type PageObservers } from "../helpers/attach-observers";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  discoverAllRnLessonLinksFromHub,
  inventoryToSerializable,
  RN_LESSON_HUB_PAGE_LIMIT_MAX,
  type HubLessonLinkRow,
} from "../helpers/rn-lesson-hub-inventory";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  learnerAppMainLandmark,
  waitForAuthenticatedLearnerShell,
} from "../helpers/paid-learner-shell";
import { paidFlashcardsHubUrl, paidQuestionsHubUrl } from "../helpers/paid-content-discovery";
import { expectNoSubscriptionPaywall, expectOnPaidSubscriberApp } from "../helpers/paid-surface-assertions";
import {
  attachSmokeCapture,
  attachSmokeFailureScreenshot,
  attachSlowRequestTap,
  buildCaptureFromObservers,
  type SmokeCapture,
} from "../helpers/smoke-evidence";
import { getQaPaidCredentials } from "../helpers/smoke-credentials";
import { dismissFlashcardResumeIfPresent } from "../helpers/paid-user-suite";

test.use({ storageState: { cookies: [], origins: [] } });

const MAIN_MIN_CHARS = 80;
const CAT_START_TEST = "[data-nn-qa-practice-hub-start-test]";

/** Full lesson crawl + other surfaces — keep out of the default 3m smoke budget. */
test.describe.configure({ timeout: 3_600_000 });

type LessonVisitResult = {
  pathname: string;
  url: string;
  ok: boolean;
  mainChars: number;
  error?: string;
  newConsoleErrors: string[];
  newFailedRequests: string[];
};

type CategoryAuditGroup = {
  category: string;
  lessonCount: number;
  passed: number;
  failed: number;
  failures: { pathname: string; url: string; error: string }[];
};

function baseOriginFrom(page: Page, baseURL: string | undefined): string {
  if (baseURL) {
    try {
      return new URL(baseURL).origin;
    } catch {
      /* fall through */
    }
  }
  try {
    return new URL(page.url()).origin;
  } catch {
    return "http://127.0.0.1:3000";
  }
}

async function answerOneCatItem(page: Page): Promise<void> {
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

async function attachFailureDiagnostics(
  testInfo: import("@playwright/test").TestInfo,
  page: Page,
  observers: PageObservers,
  slowMs: { url: string; ms: number }[],
): Promise<void> {
  await attachSmokeFailureScreenshot(page, testInfo, "rn-full-content-access-failure.png");
  await testInfo.attach("rn-full-content-access-failure.json", {
    body: Buffer.from(
      JSON.stringify(
        {
          currentUrl: page.url(),
          consoleErrors: observers.consoleErrors,
          failedRequests: observers.failedRequests,
          slowRequestsOver3s: slowMs,
        },
        null,
        2,
      ),
      "utf-8",
    ),
    contentType: "application/json",
  });
}

function groupKeyForLesson(row: HubLessonLinkRow): string {
  const t = row.categoryLabel?.trim();
  return t && t.length > 0 ? t : "(uncategorized)";
}

function buildCategoryGroups(
  inventoryRows: HubLessonLinkRow[],
  results: Map<string, LessonVisitResult>,
): CategoryAuditGroup[] {
  const byCat = new Map<string, HubLessonLinkRow[]>();
  for (const row of inventoryRows) {
    const k = groupKeyForLesson(row);
    const list = byCat.get(k) ?? [];
    list.push(row);
    byCat.set(k, list);
  }
  const out: CategoryAuditGroup[] = [];
  for (const [category, rows] of [...byCat.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    let passed = 0;
    let failed = 0;
    const failures: { pathname: string; url: string; error: string }[] = [];
    for (const row of rows) {
      const r = results.get(row.pathname);
      if (!r) {
        failed += 1;
        failures.push({ pathname: row.pathname, url: row.href, error: "missing visit result" });
        continue;
      }
      if (r.ok) passed += 1;
      else {
        failed += 1;
        failures.push({ pathname: row.pathname, url: r.url, error: r.error ?? "unknown" });
      }
    }
    out.push({
      category,
      lessonCount: rows.length,
      passed,
      failed,
      failures,
    });
  }
  return out;
}

/**
 * Visit one lesson detail URL; assert paid surface, non-empty main, no new serious console/network noise.
 */
async function auditSingleLessonPage(
  page: Page,
  absoluteUrl: string,
  observers: PageObservers,
  consoleBase: number,
  failedBase: number,
): Promise<LessonVisitResult> {
  const pathname = (() => {
    try {
      return new URL(absoluteUrl).pathname;
    } catch {
      return absoluteUrl;
    }
  })();

  await page.goto(absoluteUrl, { waitUntil: "domcontentloaded" });
  await waitForAuthenticatedLearnerShell(page).catch(() => {});

  try {
    await expectNoSubscriptionPaywall(page, pathname);
  } catch (e) {
    return {
      pathname,
      url: page.url(),
      ok: false,
      mainChars: 0,
      error: e instanceof Error ? e.message : String(e),
      newConsoleErrors: observers.consoleErrors.slice(consoleBase),
      newFailedRequests: observers.failedRequests.slice(failedBase),
    };
  }

  const m = learnerAppMainLandmark(page);
  await expect(m).toBeVisible({ timeout: 90_000 });
  const body = await m.innerText().catch(() => "");
  const mainChars = body.length;

  if (mainChars <= MAIN_MIN_CHARS) {
    return {
      pathname,
      url: page.url(),
      ok: false,
      mainChars,
      error: `main body too short (${mainChars} chars; expected > ${MAIN_MIN_CHARS})`,
      newConsoleErrors: observers.consoleErrors.slice(consoleBase),
      newFailedRequests: observers.failedRequests.slice(failedBase),
    };
  }

  const loading = page.locator('[data-loading="true"], [aria-busy="true"]').filter({ visible: true });
  const stillLoading = await loading.count().catch(() => 0);
  if (stillLoading > 0) {
    return {
      pathname,
      url: page.url(),
      ok: false,
      mainChars,
      error: `stuck loading indicators (count=${stillLoading})`,
      newConsoleErrors: observers.consoleErrors.slice(consoleBase),
      newFailedRequests: observers.failedRequests.slice(failedBase),
    };
  }

  /** {@link ProductErrorState} — error boundary / failed lesson load (Try again + Study hub pattern). */
  const productError = m.locator("section[role='alert']").filter({
    has: m.getByRole("button", { name: /try again/i }),
  });
  if ((await productError.count()) > 0) {
    return {
      pathname,
      url: page.url(),
      ok: false,
      mainChars,
      error: "product error state (role=alert + Try again) in main",
      newConsoleErrors: observers.consoleErrors.slice(consoleBase),
      newFailedRequests: observers.failedRequests.slice(failedBase),
    };
  }

  const newConsoleErrors = observers.consoleErrors.slice(consoleBase);
  const newFailedRequests = observers.failedRequests.slice(failedBase);

  if (newConsoleErrors.length > 0 || newFailedRequests.length > 0) {
    return {
      pathname,
      url: page.url(),
      ok: false,
      mainChars,
      error: `console/network: ${[...newConsoleErrors, ...newFailedRequests].join(" | ")}`,
      newConsoleErrors,
      newFailedRequests,
    };
  }

  return {
    pathname,
    url: page.url(),
    ok: true,
    mainChars,
    newConsoleErrors: [],
    newFailedRequests: [],
  };
}

test.describe("RN full content access (paid)", () => {
  test("login → all RN lessons (hub inventory) → flashcards → question bank → CAT", async ({
    page,
    baseURL,
  }, testInfo) => {
    const creds = getQaPaidCredentials();
    test.skip(!creds, "Set QA_PAID_EMAIL + QA_PAID_PASSWORD (or E2E_PAID_* / PLAYWRIGHT_TEST_*)");

    const slowMs: { url: string; ms: number }[] = [];
    const origin = baseOriginFrom(page, baseURL);
    const disposeSlow = attachSlowRequestTap(page, origin, slowMs, 3000);

    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });

    try {
      await test.step("Login", async () => {
        await loginWithCredentials(page, creds!.email, creds!.password);
        await expectOnPaidSubscriberApp(page);
        expect(page.url(), "not stuck on /login").not.toMatch(/\/login/i);
      });

      const inventory = await test.step("Discover all RN lesson links from hub (paginated + virtual list)", async () => {
        const inv = await discoverAllRnLessonLinksFromHub(page, PAID_E2E_DEFAULT_PATHWAY_ID, RN_LESSON_HUB_PAGE_LIMIT_MAX);
        const serial = inventoryToSerializable(inv);
        await testInfo.attach("rn-lesson-inventory.json", {
          body: Buffer.from(JSON.stringify(serial, null, 2), "utf-8"),
          contentType: "application/json",
        });
        expect(serial.uniqueCount, "at least one RN lesson link from hub").toBeGreaterThan(0);
        if (serial.totalReported != null) {
          expect(
            serial.uniqueCount,
            `inventory should match hub total (${serial.totalReported}); check virtual-list scroll if failing`,
          ).toBe(serial.totalReported);
        }
        return inv;
      });

      await test.step("Visit every unique RN lesson URL", async () => {
        const rows = [...inventory.byPath.values()].sort((a, b) => a.pathname.localeCompare(b.pathname));
        const results = new Map<string, LessonVisitResult>();

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i]!;
          const absolute = new URL(row.pathname, origin).href;
          const c0 = observers.consoleErrors.length;
          const f0 = observers.failedRequests.length;
          const r = await auditSingleLessonPage(page, absolute, observers, c0, f0);
          results.set(row.pathname, r);
          if (!r.ok) {
            await testInfo.attach(`lesson-fail-${i}-${row.pathname.replace(/\//g, "_")}.json`, {
              body: Buffer.from(JSON.stringify(r, null, 2), "utf-8"),
              contentType: "application/json",
            });
          }
        }

        const serialResults = [...results.values()];
        const failed = serialResults.filter((x) => !x.ok);
        const byCategory = buildCategoryGroups([...inventory.byPath.values()], results);

        await testInfo.attach("rn-lesson-visit-results.json", {
          body: Buffer.from(
            JSON.stringify(
              {
                pathwayId: PAID_E2E_DEFAULT_PATHWAY_ID,
                visited: serialResults.length,
                passed: serialResults.filter((x) => x.ok).length,
                failed: failed.length,
                failures: failed,
                byCategory,
              },
              null,
              2,
            ),
            "utf-8",
          ),
          contentType: "application/json",
        });

        expect(failed, `${failed.length} lesson(s) failed — see rn-lesson-visit-results.json`).toEqual([]);
      });

      await test.step("Flashcards", async () => {
        await page.goto(paidFlashcardsHubUrl(PAID_E2E_DEFAULT_PATHWAY_ID), { waitUntil: "domcontentloaded" });
        await waitForAuthenticatedLearnerShell(page);
        await expectNoSubscriptionPaywall(page, "flashcards hub");

        const mainLandmark = learnerAppMainLandmark(page);
        await expect(mainLandmark).toBeVisible({ timeout: 120_000 });

        const learnFirst = page.locator('a[href*="/app/flashcards/"][href*="mode=learn"]').first();
        await expect(learnFirst).toBeVisible({ timeout: 120_000 });
        const deckHref = await learnFirst.getAttribute("href");
        expect(deckHref).toBeTruthy();

        await page.goto(deckHref!, { waitUntil: "domcontentloaded" });
        await dismissFlashcardResumeIfPresent(page);

        const cardSurface = page.locator(".nn-learner-app main, main").first();
        await expect(cardSurface).toBeVisible({ timeout: 120_000 });
        const cardText0 = (await cardSurface.innerText().catch(() => "")).trim();
        expect(cardText0.length, "flashcard surface renders text (at least one card)").toBeGreaterThan(20);

        const reveal = page.getByRole("button", { name: /^Reveal answer$/i });
        if (await reveal.isVisible().catch(() => false)) {
          await reveal.click();
          await expect(cardSurface).toBeVisible({ timeout: 15_000 });
        }
        const nextNav = page.getByRole("button", { name: "Next", exact: true });
        if (await nextNav.isEnabled().catch(() => false)) {
          await nextNav.click();
        }

        expect(observers.consoleErrors, `[flashcards] console: ${observers.consoleErrors.join(" | ")}`).toEqual([]);
        expect(observers.failedRequests, `[flashcards] network: ${observers.failedRequests.join(" | ")}`).toEqual([]);
      });

      await test.step("Question bank (/app/questions)", async () => {
        await page.goto(paidQuestionsHubUrl(PAID_E2E_DEFAULT_PATHWAY_ID), { waitUntil: "domcontentloaded" });
        await waitForAuthenticatedLearnerShell(page);
        await expectNoSubscriptionPaywall(page, "questions hub");

        const mainLandmark = learnerAppMainLandmark(page);
        await expect(mainLandmark).toBeVisible({ timeout: 120_000 });

        const stemish = mainLandmark.locator("p, article, section, .nn-marketing-body-sm").first();
        await expect(stemish).toBeVisible({ timeout: 120_000 });

        const firstPick = page.locator(".nn-qopt-list").first().locator("button, label").first();
        if (await firstPick.isVisible().catch(() => false)) {
          await firstPick.click();
          const check = page.getByRole("button", { name: /^Check answer$/i });
          if (await check.isVisible().catch(() => false)) {
            await check.click();
          }
        }

        await expect(mainLandmark).toBeVisible({ timeout: 60_000 });
        expect(observers.consoleErrors, `[questions] console: ${observers.consoleErrors.join(" | ")}`).toEqual([]);
        expect(observers.failedRequests, `[questions] network: ${observers.failedRequests.join(" | ")}`).toEqual([]);
      });

      await test.step("CAT exam (adaptive practice test)", async () => {
        await page.goto(
          `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`,
          { waitUntil: "domcontentloaded" },
        );
        await waitForAuthenticatedLearnerShell(page);
        await expectNoSubscriptionPaywall(page, "CAT hub");

        await expect(page.locator(CAT_START_TEST)).toBeVisible({ timeout: 60_000 });
        await page.locator(CAT_START_TEST).click();
        await expect(page.getByRole("button", { name: /^Begin exam$/i })).toBeVisible({ timeout: 15_000 });
        await page.getByRole("button", { name: /^Begin exam$/i }).click();
        await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });

        await expect(page.locator(".nn-cat-question-stem, .nn-marketing-body-sm").first()).toBeVisible({
          timeout: 120_000,
        });

        await answerOneCatItem(page);
        expect(observers.consoleErrors, `[cat] console: ${observers.consoleErrors.join(" | ")}`).toEqual([]);
        expect(observers.failedRequests, `[cat] network: ${observers.failedRequests.join(" | ")}`).toEqual([]);
      });

      const capture: SmokeCapture = {
        ...buildCaptureFromObservers(page, observers, { slowRequestsMs: slowMs }),
      };
      await attachSmokeCapture(testInfo, "rn-full-content-access", capture);
    } catch (e) {
      await attachFailureDiagnostics(testInfo, page, observers, slowMs);
      throw e;
    } finally {
      disposeSlow();
      observers.dispose();
    }
  });
});
