/**
 * Paid RN learner surfaces — **full RN lesson library** (all hub pages + virtual scroll), flashcards,
 * question bank, adaptive CAT — real routes, no mocks.
 *
 * **Does not skip when credentials are missing** — fails with NOT_STABLE and a clear error.
 *
 * Run:
 *   cd nursenest-core && npm run qa:rn-full-content
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
import {
  maskEmailForReport,
  resolveQaPaidCredentialsWithSource,
  type PaidCredentialSource,
} from "../helpers/smoke-credentials";
import { dismissFlashcardResumeIfPresent } from "../helpers/paid-user-suite";

test.use({ storageState: { cookies: [], origins: [] } });

const MAIN_MIN_CHARS = 80;
const CAT_START_TEST = "[data-nn-qa-practice-hub-start-test]";

const REQUIRED_CREDENTIALS_MSG =
  "[rn-full-content] PAID CREDENTIALS REQUIRED. Set QA_PAID_EMAIL + QA_PAID_PASSWORD " +
  "(or E2E_PAID_EMAIL + E2E_PAID_PASSWORD, or PLAYWRIGHT_TEST_EMAIL + PLAYWRIGHT_TEST_PASSWORD). " +
  "Skipped runs are not valid — this suite must authenticate to verify production behavior.";

type LessonVisitResult = {
  pathname: string;
  lessonId: string;
  categoryLabel: string | null;
  url: string;
  ok: boolean;
  mainChars: number;
  error?: string;
  visibleErrorText?: string;
  paywallDetected: boolean;
  loadingIndicatorsPresent: boolean;
  newConsoleErrors: string[];
  newFailedRequests: string[];
};

type CategoryAuditGroup = {
  category: string;
  lessonCount: number;
  passed: number;
  failed: number;
  failures: { pathname: string; lessonId: string; url: string; error: string }[];
};

type PhaseStatus = "passed" | "failed" | "skipped" | "not_run";

type SuitePhaseSummary = {
  discovery: { status: PhaseStatus; detail?: string };
  lessonVisit: {
    status: PhaseStatus;
    visited: number;
    passed: number;
    failed: number;
    compactFailures: { lessonId: string; pathname: string; error?: string }[];
  };
  flashcards: { status: PhaseStatus; detail?: string };
  questionBank: { status: PhaseStatus; detail?: string };
  cat: { status: PhaseStatus; detail?: string };
};

type FinalVerdict = "STABLE" | "NOT_STABLE";

type RnFullContentSuiteResults = {
  pathwayId: string;
  credentialsUsed: string | null;
  credentialSource: PaidCredentialSource | null;
  /** Which env vars take precedence (for support). */
  credentialResolutionOrder: string;
  loginSucceeded: boolean;
  discoveryStatus: PhaseStatus;
  lessonsVisited: number;
  lessonsPassed: number;
  lessonsFailed: number;
  /** Passed visits with main body strictly over MAIN_MIN_CHARS (real lesson content). */
  lessonsWithSubstantiveContent: number;
  flashcardsStatus: PhaseStatus;
  questionsStatus: PhaseStatus;
  catStatus: PhaseStatus;
  phases: SuitePhaseSummary;
  finalStatus: FinalVerdict;
  failureReason?: string;
  thrown?: string;
};

function lessonIdFromPathname(pathname: string): string {
  const m = pathname.match(/\/app\/lessons\/([^/]+)/);
  return m?.[1] ?? pathname;
}

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

function credentialEnvHint(source: PaidCredentialSource | null): string {
  if (source === "QA_PAID_EMAIL") return "QA_PAID_EMAIL + QA_PAID_PASSWORD";
  if (source === "E2E_PAID_EMAIL") return "E2E_PAID_EMAIL + E2E_PAID_PASSWORD";
  if (source === "PLAYWRIGHT_TEST_EMAIL") return "PLAYWRIGHT_TEST_EMAIL + PLAYWRIGHT_TEST_PASSWORD";
  return "(none — set QA_PAID_EMAIL + QA_PAID_PASSWORD or E2E_PAID_* or PLAYWRIGHT_TEST_*)";
}

function buildSuiteResults(partial: Partial<RnFullContentSuiteResults> & { phases: SuitePhaseSummary }): RnFullContentSuiteResults {
  const r: RnFullContentSuiteResults = {
    pathwayId: PAID_E2E_DEFAULT_PATHWAY_ID,
    credentialsUsed: partial.credentialsUsed ?? null,
    credentialSource: partial.credentialSource ?? null,
    credentialResolutionOrder: partial.credentialResolutionOrder ?? "QA_PAID → E2E_PAID → PLAYWRIGHT_TEST",
    loginSucceeded: partial.loginSucceeded ?? false,
    discoveryStatus: partial.discoveryStatus ?? "not_run",
    lessonsVisited: partial.lessonsVisited ?? 0,
    lessonsPassed: partial.lessonsPassed ?? 0,
    lessonsFailed: partial.lessonsFailed ?? 0,
    lessonsWithSubstantiveContent: partial.lessonsWithSubstantiveContent ?? 0,
    flashcardsStatus: partial.flashcardsStatus ?? "not_run",
    questionsStatus: partial.questionsStatus ?? "not_run",
    catStatus: partial.catStatus ?? "not_run",
    phases: partial.phases,
    finalStatus: "NOT_STABLE",
    failureReason: partial.failureReason,
    thrown: partial.thrown,
  };
  r.finalStatus = computeFinalVerdict(r);
  if (r.finalStatus === "STABLE") {
    r.failureReason = undefined;
  } else if (!r.failureReason) {
    r.failureReason = deriveFailureReason(r);
  }
  return r;
}

function deriveFailureReason(r: RnFullContentSuiteResults): string | undefined {
  if (!r.credentialSource) return "Missing paid credentials (suite did not run authenticated).";
  if (!r.loginSucceeded) return "Login did not complete or paid subscriber shell not confirmed.";
  if (r.discoveryStatus !== "passed") return "Discovery phase did not complete successfully.";
  if (r.lessonsVisited < 1) return "No lesson URLs were visited.";
  if (r.lessonsWithSubstantiveContent < 1) return "No lesson passed with substantive main content (>80 chars).";
  if (r.lessonsFailed > 0) return `${r.lessonsFailed} lesson(s) failed audit — see rn-lesson-visit-results.json.`;
  if (r.flashcardsStatus !== "passed") return "Flashcards phase did not pass (load + Reveal interaction).";
  if (r.questionsStatus !== "passed") return "Question bank phase did not pass (stem + answer interaction).";
  if (r.catStatus !== "passed") return "CAT phase did not pass.";
  return undefined;
}

function computeFinalVerdict(r: RnFullContentSuiteResults): FinalVerdict {
  const ok =
    !!r.credentialSource &&
    r.loginSucceeded &&
    r.discoveryStatus === "passed" &&
    r.lessonsVisited >= 1 &&
    r.lessonsFailed === 0 &&
    r.lessonsWithSubstantiveContent >= 1 &&
    r.flashcardsStatus === "passed" &&
    r.questionsStatus === "passed" &&
    r.catStatus === "passed";
  return ok ? "STABLE" : "NOT_STABLE";
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

async function readLoginPageErrorSnippet(page: Page): Promise<string | undefined> {
  const errEl = page.locator("[role='alert'], [data-nn-error]").first();
  if (await errEl.isVisible().catch(() => false)) {
    const t = (await errEl.innerText().catch(() => "")).trim();
    return t.length > 0 ? t.slice(0, 2000) : undefined;
  }
  return undefined;
}

async function attachLoginFailure(
  testInfo: import("@playwright/test").TestInfo,
  page: Page,
  observers: PageObservers,
  resolved: { email: string; source: PaidCredentialSource },
  err: unknown,
): Promise<void> {
  const visibleErrorText = await readLoginPageErrorSnippet(page).catch(() => undefined);
  const bodySnippet = (await page.locator("body").innerText().catch(() => "")).slice(0, 4000);
  await testInfo.attach("rn-full-content-login-failure.json", {
    body: Buffer.from(
      JSON.stringify(
        {
          phase: "login",
          credentialSource: resolved.source,
          envVarsUsed: credentialEnvHint(resolved.source),
          emailMasked: maskEmailForReport(resolved.email),
          finalUrl: page.url(),
          visibleErrorText: visibleErrorText ?? null,
          bodySnippet,
          error: err instanceof Error ? err.message : String(err),
          consoleErrors: observers.consoleErrors,
          failedRequests: observers.failedRequests,
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
    const failures: { pathname: string; lessonId: string; url: string; error: string }[] = [];
    for (const row of rows) {
      const r = results.get(row.pathname);
      if (!r) {
        failed += 1;
        failures.push({
          pathname: row.pathname,
          lessonId: lessonIdFromPathname(row.pathname),
          url: row.href,
          error: "missing visit result",
        });
        continue;
      }
      if (r.ok) passed += 1;
      else {
        failed += 1;
        failures.push({ pathname: row.pathname, lessonId: r.lessonId, url: r.url, error: r.error ?? "unknown" });
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

async function readVisibleErrorSnippet(main: ReturnType<typeof learnerAppMainLandmark>): Promise<string | undefined> {
  const errEl = main.locator("[role='alert'], [data-nn-error]").first();
  if (await errEl.isVisible().catch(() => false)) {
    const t = (await errEl.innerText().catch(() => "")).trim();
    return t.length > 0 ? t.slice(0, 2000) : undefined;
  }
  return undefined;
}

/**
 * Visit one lesson detail URL; assert paid surface, non-empty main, no new serious console/network noise.
 */
async function auditSingleLessonPage(
  page: Page,
  absoluteUrl: string,
  row: HubLessonLinkRow,
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
  const lessonId = lessonIdFromPathname(pathname);
  const categoryLabel = row.categoryLabel;

  await page.goto(absoluteUrl, { waitUntil: "domcontentloaded" });
  await waitForAuthenticatedLearnerShell(page).catch(() => {});

  let paywallDetected = false;
  try {
    await expectNoSubscriptionPaywall(page, pathname);
  } catch (e) {
    paywallDetected = true;
    return {
      pathname,
      lessonId,
      categoryLabel,
      url: page.url(),
      ok: false,
      mainChars: 0,
      error: e instanceof Error ? e.message : String(e),
      visibleErrorText: await readVisibleErrorSnippet(learnerAppMainLandmark(page)).catch(() => undefined),
      paywallDetected,
      loadingIndicatorsPresent: false,
      newConsoleErrors: observers.consoleErrors.slice(consoleBase),
      newFailedRequests: observers.failedRequests.slice(failedBase),
    };
  }

  const m = learnerAppMainLandmark(page);
  await expect(m).toBeVisible({ timeout: 90_000 });
  const body = await m.innerText().catch(() => "");
  const mainChars = body.length;

  const loading = page.locator('[data-loading="true"], [aria-busy="true"]').filter({ visible: true });
  const loadingCount = await loading.count().catch(() => 0);
  const loadingIndicatorsPresent = loadingCount > 0;

  if (mainChars <= MAIN_MIN_CHARS) {
    return {
      pathname,
      lessonId,
      categoryLabel,
      url: page.url(),
      ok: false,
      mainChars,
      error: `main body too short (${mainChars} chars; expected > ${MAIN_MIN_CHARS})`,
      visibleErrorText: await readVisibleErrorSnippet(m).catch(() => undefined),
      paywallDetected: false,
      loadingIndicatorsPresent,
      newConsoleErrors: observers.consoleErrors.slice(consoleBase),
      newFailedRequests: observers.failedRequests.slice(failedBase),
    };
  }

  if (loadingIndicatorsPresent) {
    return {
      pathname,
      lessonId,
      categoryLabel,
      url: page.url(),
      ok: false,
      mainChars,
      error: `stuck loading indicators (count=${loadingCount})`,
      visibleErrorText: await readVisibleErrorSnippet(m).catch(() => undefined),
      paywallDetected: false,
      loadingIndicatorsPresent,
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
      lessonId,
      categoryLabel,
      url: page.url(),
      ok: false,
      mainChars,
      error: "product error state (role=alert + Try again) in main",
      visibleErrorText: await readVisibleErrorSnippet(m).catch(() => undefined),
      paywallDetected: false,
      loadingIndicatorsPresent: false,
      newConsoleErrors: observers.consoleErrors.slice(consoleBase),
      newFailedRequests: observers.failedRequests.slice(failedBase),
    };
  }

  const newConsoleErrors = observers.consoleErrors.slice(consoleBase);
  const newFailedRequests = observers.failedRequests.slice(failedBase);

  if (newConsoleErrors.length > 0 || newFailedRequests.length > 0) {
    return {
      pathname,
      lessonId,
      categoryLabel,
      url: page.url(),
      ok: false,
      mainChars,
      error: `console/network: ${[...newConsoleErrors, ...newFailedRequests].join(" | ")}`,
      visibleErrorText: await readVisibleErrorSnippet(m).catch(() => undefined),
      paywallDetected: false,
      loadingIndicatorsPresent: false,
      newConsoleErrors,
      newFailedRequests,
    };
  }

  return {
    pathname,
    lessonId,
    categoryLabel,
    url: page.url(),
    ok: true,
    mainChars,
    paywallDetected: false,
    loadingIndicatorsPresent: false,
    newConsoleErrors: [],
    newFailedRequests: [],
  };
}

test.describe("RN full content access (paid)", () => {
  test("login → all RN lessons (hub inventory) → flashcards → question bank → CAT", async ({ page, baseURL }, testInfo) => {
    const suite: SuitePhaseSummary = {
      discovery: { status: "not_run" },
      lessonVisit: { status: "not_run", visited: 0, passed: 0, failed: 0, compactFailures: [] },
      flashcards: { status: "not_run" },
      questionBank: { status: "not_run" },
      cat: { status: "not_run" },
    };

    let resultsPayload: Partial<RnFullContentSuiteResults> = {
      phases: suite,
      credentialResolutionOrder: "QA_PAID_EMAIL → E2E_PAID_EMAIL → PLAYWRIGHT_TEST_EMAIL",
    };

    const resolved = resolveQaPaidCredentialsWithSource();
    if (!resolved) {
      const failedEarly = buildSuiteResults({
        ...resultsPayload,
        credentialsUsed: null,
        credentialSource: null,
        loginSucceeded: false,
        discoveryStatus: "not_run",
        flashcardsStatus: "not_run",
        questionsStatus: "not_run",
        catStatus: "not_run",
        phases: suite,
        failureReason: REQUIRED_CREDENTIALS_MSG,
      });
      await testInfo.attach("rn-full-content-suite-results.json", {
        body: Buffer.from(JSON.stringify(failedEarly, null, 2), "utf-8"),
        contentType: "application/json",
      });
      throw new Error(REQUIRED_CREDENTIALS_MSG);
    }

    resultsPayload = {
      ...resultsPayload,
      credentialsUsed: maskEmailForReport(resolved.email),
      credentialSource: resolved.source,
    };

    const slowMs: { url: string; ms: number }[] = [];
    const origin = baseOriginFrom(page, baseURL);
    const disposeSlow = attachSlowRequestTap(page, origin, slowMs, 3000);
    const observers = attachPageObservers(page, { profile: "app", probeAuthApi: true });

    const attachSuiteJson = async (extra?: Partial<RnFullContentSuiteResults>, thrown?: string) => {
      const merged = buildSuiteResults({
        ...resultsPayload,
        ...extra,
        phases: suite,
        thrown,
      } as Parameters<typeof buildSuiteResults>[0]);
      await testInfo.attach("rn-full-content-suite-results.json", {
        body: Buffer.from(JSON.stringify(merged, null, 2), "utf-8"),
        contentType: "application/json",
      });
    };

    try {
      await test.step("Phase 0 — Login (required)", async () => {
        try {
          await loginWithCredentials(page, resolved.email, resolved.password);
          await expectOnPaidSubscriberApp(page);
          expect(page.url(), "not stuck on /login").not.toMatch(/\/login/i);
          resultsPayload.loginSucceeded = true;
        } catch (e) {
          resultsPayload.loginSucceeded = false;
          await attachLoginFailure(testInfo, page, observers, resolved, e);
          await attachSuiteJson({ loginSucceeded: false, failureReason: "Login failed — see rn-full-content-login-failure.json" }, String(e));
          throw e;
        }
      });

      const inventory = await test.step("Phase 1 — Discovery (paginated hub + virtual list inventory)", async () => {
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
        suite.discovery = {
          status: "passed",
          detail: `unique=${serial.uniqueCount} totalReported=${serial.totalReported ?? "null"} pages=${serial.pageCountDetected}`,
        };
        resultsPayload.discoveryStatus = "passed";
        return inv;
      });

      await test.step("Phase 2 — Visit every unique RN lesson URL", async () => {
        const rows = [...inventory.byPath.values()].sort((a, b) => a.pathname.localeCompare(b.pathname));
        const results = new Map<string, LessonVisitResult>();

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i]!;
          const absolute = new URL(row.pathname, origin).href;
          const c0 = observers.consoleErrors.length;
          const f0 = observers.failedRequests.length;
          const r = await auditSingleLessonPage(page, absolute, row, observers, c0, f0);
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
        const passed = serialResults.filter((x) => x.ok);
        const substantive = passed.filter((x) => x.mainChars > MAIN_MIN_CHARS);
        const byCategory = buildCategoryGroups([...inventory.byPath.values()], results);

        suite.lessonVisit = {
          status: failed.length === 0 ? "passed" : "failed",
          visited: serialResults.length,
          passed: passed.length,
          failed: failed.length,
          compactFailures: failed.map((f) => ({
            lessonId: f.lessonId,
            pathname: f.pathname,
            error: f.error,
          })),
        };

        resultsPayload.lessonsVisited = serialResults.length;
        resultsPayload.lessonsPassed = passed.length;
        resultsPayload.lessonsFailed = failed.length;
        resultsPayload.lessonsWithSubstantiveContent = substantive.length;

        await testInfo.attach("rn-lesson-visit-results.json", {
          body: Buffer.from(
            JSON.stringify(
              {
                pathwayId: PAID_E2E_DEFAULT_PATHWAY_ID,
                phase: "lessonVisit",
                visited: serialResults.length,
                passed: passed.length,
                failed: failed.length,
                lessonsWithSubstantiveContent: substantive.length,
                compactFailures: failed.map((f) => ({
                  lessonId: f.lessonId,
                  pathname: f.pathname,
                  categoryLabel: f.categoryLabel,
                  url: f.url,
                  error: f.error,
                })),
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

        expect(passed.length, "at least one successful lesson visit").toBeGreaterThan(0);
        expect(
          substantive.length,
          `at least one lesson must render substantive content (>${MAIN_MIN_CHARS} chars in main) — got ${substantive.length}`,
        ).toBeGreaterThan(0);
        expect(failed, `${failed.length} lesson(s) failed — see rn-lesson-visit-results.json`).toEqual([]);
      });

      await test.step("Phase 3 — Flashcards (required interaction)", async () => {
        await page.goto(paidFlashcardsHubUrl(PAID_E2E_DEFAULT_PATHWAY_ID), { waitUntil: "domcontentloaded" });
        await waitForAuthenticatedLearnerShell(page);
        await expectNoSubscriptionPaywall(page, "flashcards hub");

        const mainLandmark = learnerAppMainLandmark(page);
        await expect(mainLandmark).toBeVisible({ timeout: 120_000 });

        const learnFirst = page.locator('a[href*="/app/flashcards/"][href*="mode=learn"]').first();
        await expect(learnFirst).toBeVisible({ timeout: 120_000 });
        const deckHref = await learnFirst.getAttribute("href");
        expect(deckHref, "learn-mode flashcard deck link").toBeTruthy();

        await page.goto(deckHref!, { waitUntil: "domcontentloaded" });
        await dismissFlashcardResumeIfPresent(page);

        const cardSurface = page.locator(".nn-learner-app main, main").first();
        await expect(cardSurface).toBeVisible({ timeout: 120_000 });
        const cardText0 = (await cardSurface.innerText().catch(() => "")).trim();
        expect(cardText0.length, "flashcard surface renders text (at least one card)").toBeGreaterThan(20);

        const reveal = page.getByRole("button", { name: /^Reveal answer$/i });
        await expect(reveal, "Reveal answer control must be present for learn-mode flashcards").toBeVisible({
          timeout: 120_000,
        });
        await reveal.click();
        await expect(cardSurface).toBeVisible({ timeout: 15_000 });

        const nextNav = page.getByRole("button", { name: "Next", exact: true });
        if (await nextNav.isEnabled().catch(() => false)) {
          await nextNav.click();
        }

        expect(observers.consoleErrors, `[flashcards] console: ${observers.consoleErrors.join(" | ")}`).toEqual([]);
        expect(observers.failedRequests, `[flashcards] network: ${observers.failedRequests.join(" | ")}`).toEqual([]);
        suite.flashcards = { status: "passed" };
        resultsPayload.flashcardsStatus = "passed";
      });

      await test.step("Phase 4 — Question bank (required interaction)", async () => {
        await page.goto(paidQuestionsHubUrl(PAID_E2E_DEFAULT_PATHWAY_ID), { waitUntil: "domcontentloaded" });
        await waitForAuthenticatedLearnerShell(page);
        await expectNoSubscriptionPaywall(page, "questions hub");

        const mainLandmark = learnerAppMainLandmark(page);
        await expect(mainLandmark).toBeVisible({ timeout: 120_000 });

        const stemish = mainLandmark.locator("p, article, section, .nn-marketing-body-sm").first();
        await expect(stemish, "question stem / body visible").toBeVisible({ timeout: 120_000 });

        const firstPick = page.locator(".nn-qopt-list").first().locator("button, label").first();
        await expect(firstPick, "at least one answer option").toBeVisible({ timeout: 120_000 });
        await firstPick.click();

        const check = page.getByRole("button", { name: /^Check answer$/i });
        await expect(check, "Check answer after selecting an option").toBeVisible({ timeout: 60_000 });
        await check.click();

        await expect(mainLandmark).toBeVisible({ timeout: 60_000 });
        expect(observers.consoleErrors, `[questions] console: ${observers.consoleErrors.join(" | ")}`).toEqual([]);
        expect(observers.failedRequests, `[questions] network: ${observers.failedRequests.join(" | ")}`).toEqual([]);
        suite.questionBank = { status: "passed" };
        resultsPayload.questionsStatus = "passed";
      });

      await test.step("Phase 5 — CAT exam (adaptive practice test)", async () => {
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
        suite.cat = { status: "passed" };
        resultsPayload.catStatus = "passed";
      });

      await attachSuiteJson();

      const capture: SmokeCapture = {
        ...buildCaptureFromObservers(page, observers, { slowRequestsMs: slowMs }),
      };
      await attachSmokeCapture(testInfo, "rn-full-content-access", capture);

      const verdict = buildSuiteResults({ ...resultsPayload, phases: suite } as Parameters<typeof buildSuiteResults>[0]);
      expect(verdict.finalStatus, verdict.failureReason ?? "suite must reach STABLE").toBe("STABLE");
    } catch (e) {
      await attachSuiteJson(
        {
          loginSucceeded: resultsPayload.loginSucceeded,
          discoveryStatus: resultsPayload.discoveryStatus,
          lessonsVisited: resultsPayload.lessonsVisited,
          lessonsFailed: resultsPayload.lessonsFailed,
          lessonsWithSubstantiveContent: resultsPayload.lessonsWithSubstantiveContent,
        },
        String(e),
      );
      await attachFailureDiagnostics(testInfo, page, observers, slowMs);
      throw e;
    } finally {
      disposeSlow();
      observers.dispose();
    }
  });
});
