/**
 * Paid-subscriber **audit** using a **seeded premium account** (no Stripe checkout).
 *
 * Prerequisites — same as `paid-user-smoke.spec.ts`:
 * - `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` (or `PLAYWRIGHT_TEST_*`)
 * - `--project=chromium-paid`: `setup-paid-auth` logs in once and reuses `tests/e2e/.auth/paid-user.json` (see `auth-state-paths.ts`)
 *
 * Output: `audit-results.json` attachment — pass/fail per area, brokenButtons, entitlementIssues, screenshots.
 *
 * Run:
 *   cd nursenest-core && E2E_PAID_EMAIL=... E2E_PAID_PASSWORD=... npx playwright test --project=chromium-paid paid-subscriber-audit
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import type { CategorizedObserverDiagnostics } from "../helpers/log-observer-failure-summary";
import { logCategorizedObserverFailureSummary } from "../helpers/log-observer-failure-summary";
import { expectNoSubscriptionPaywall, expectOnLearnerApp } from "../helpers/paid-surface-assertions";
import {
  fetchApiAssetsI18nEn,
  fetchStaticI18nEn,
} from "../helpers/production-i18n-assets";
import {
  PAID_E2E_DEFAULT_PATHWAY_ID,
  buildPaidFailureSnapshot,
  collectPaidSurfaceDebug,
  learnerBottomNavLinkToHref,
  learnerPrimaryNavLinkToHref,
  logPaidSurfaceDebug,
  waitForAuthenticatedLearnerShell,
} from "../helpers/paid-learner-shell";

const PLACEHOLDER_RE = /\b(TBD|null|undefined)\b/i;

type AreaId =
  | "session"
  | "dashboard"
  | "premiumLessons"
  | "flashcards"
  | "catExams"
  | "navigation"
  | "accountSubscription"
  | "studyButtons"
  | "observers";

type AreaResult = "pass" | "fail" | "skipped";

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
    throw new Error("No CAT answer options found.");
  }
  const next = page.getByRole("button", { name: /Next question|Submit & finish/ });
  await expect(next).toBeEnabled({ timeout: 30_000 });
  await next.click();
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
}

async function tryClickVisibleInApp(
  page: Page,
  locator: ReturnType<Page["locator"]>,
  label: string,
  brokenButtons: string[],
): Promise<boolean> {
  try {
    const el = locator.first();
    if (!(await el.isVisible({ timeout: 4000 }).catch(() => false))) return false;
    await el.click({ timeout: 15_000 });
    await page.waitForLoadState("domcontentloaded");
    if (/\/login/i.test(page.url())) {
      brokenButtons.push(`${label} → unexpected /login`);
      await page.goBack().catch(() => {});
      return false;
    }
    return true;
  } catch (e) {
    brokenButtons.push(`${label}: ${e instanceof Error ? e.message : String(e)}`);
    return false;
  }
}

async function assertPremiumNavTarget(page: Page, label: string, out: string[]) {
  try {
    await expectNoSubscriptionPaywall(page, label);
  } catch (e) {
    out.push(e instanceof Error ? e.message : String(e));
  }
}

test.describe("Paid subscriber audit (seeded session)", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(600_000);

  test("audit all premium areas with structured report", async ({ page, request }, testInfo) => {
    const areas: Record<AreaId, AreaResult> = {
      session: "fail",
      dashboard: "fail",
      premiumLessons: "fail",
      flashcards: "fail",
      catExams: "fail",
      navigation: "fail",
      accountSubscription: "fail",
      studyButtons: "fail",
      observers: "fail",
    };
    const brokenButtons: string[] = [];
    const entitlementIssues: string[] = [];
    const screenshots: string[] = [];
    const observerDiagnostics: {
      categorized?: CategorizedObserverDiagnostics;
      i18nLiveStatic?: Awaited<ReturnType<typeof fetchStaticI18nEn>>;
      i18nLiveApi?: Awaited<ReturnType<typeof fetchApiAssetsI18nEn>>;
    } = {};

    const obs = attachPageObservers(page, {
      profile: "app",
      captureConsoleContext: true,
      probeAuthApi: true,
    });

    async function failShot(slug: string) {
      const p = testInfo.outputPath(`audit-failure-${slug}.png`);
      await page.screenshot({ path: p, fullPage: true }).catch(() => {});
      screenshots.push(p);
    }

    try {
      // —— Session (storage from setup-paid-auth) ——
      try {
        await page.goto("/app", { waitUntil: "domcontentloaded" });
        await expectOnLearnerApp(page);
        await waitForAuthenticatedLearnerShell(page);
        areas.session = "pass";
      } catch (e) {
        areas.session = "fail";
        logPaidSurfaceDebug(
          buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "session"), obs),
        );
        entitlementIssues.push(`session: ${e instanceof Error ? e.message : String(e)}`);
        await failShot("session");
      }

      if (areas.session !== "pass") {
        brokenButtons.push("Skipped downstream: no authenticated /app session.");
      } else {
        // —— Dashboard ——
        try {
          await page.goto("/app", { waitUntil: "domcontentloaded" });
          await expectOnLearnerApp(page);
          await waitForAuthenticatedLearnerShell(page);
          await expectNoSubscriptionPaywall(page, "/app dashboard");
          await expect(page.locator("main")).toBeVisible({ timeout: 60_000 });
          const mainText = await page.locator("main").innerText();
          expect(mainText.length).toBeGreaterThan(40);
          areas.dashboard = "pass";
        } catch (e) {
          areas.dashboard = "fail";
          logPaidSurfaceDebug(
            buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "dashboard"), obs),
          );
          entitlementIssues.push(`dashboard: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("dashboard");
        }

        // —— Premium lessons ——
        try {
          await page.goto(`/app/lessons?pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`, {
            waitUntil: "domcontentloaded",
          });
          await waitForAuthenticatedLearnerShell(page);
          await expectNoSubscriptionPaywall(page, "/app/lessons");
          const lessonLinks = page.locator('a[href^="/app/lessons/"]');
          await expect(lessonLinks.first()).toBeVisible({ timeout: 120_000 });
          const href1 = await lessonLinks.nth(0).getAttribute("href");
          const href2 = await lessonLinks.nth(1).getAttribute("href");
          expect(href1).toBeTruthy();
          await lessonLinks.nth(0).click();
          await page.waitForLoadState("domcontentloaded");
          const t1 = await page.locator("main").innerText();
          expect(t1.length).toBeGreaterThan(120);
          expect(PLACEHOLDER_RE.test(t1)).toBe(false);
          if (href2 && href2 !== href1) {
            await page.goto(href2, { waitUntil: "domcontentloaded" });
            await expectNoSubscriptionPaywall(page, "lesson detail");
            const t2 = await page.locator("main").innerText();
            expect(t2.length).toBeGreaterThan(120);
          }
          areas.premiumLessons = "pass";
        } catch (e) {
          areas.premiumLessons = "fail";
          logPaidSurfaceDebug(
            buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "premiumLessons"), obs),
          );
          entitlementIssues.push(`premiumLessons: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("lessons");
        }

        // —— Flashcards ——
        try {
          await page.goto(`/app/flashcards?pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`, {
            waitUntil: "domcontentloaded",
          });
          await waitForAuthenticatedLearnerShell(page);
          await expectNoSubscriptionPaywall(page, "/app/flashcards");
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
          areas.flashcards = "pass";
        } catch (e) {
          areas.flashcards = "fail";
          logPaidSurfaceDebug(
            buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "flashcards"), obs),
          );
          entitlementIssues.push(`flashcards: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("flashcards");
        }

        // —— CAT exams ——
        try {
          await page.goto(
            `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`,
            { waitUntil: "domcontentloaded" },
          );
          await waitForAuthenticatedLearnerShell(page);
          await expectNoSubscriptionPaywall(page, "/app/practice-tests (CAT hub)");
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
          areas.catExams = "pass";
        } catch (e) {
          areas.catExams = "fail";
          logPaidSurfaceDebug(
            buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "catExams"), obs),
          );
          entitlementIssues.push(`catExams: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("cat-exams");
        }

        // —— Navigation (desktop + mobile bottom + history) ——
        try {
          await page.goto("/app", { waitUntil: "domcontentloaded" });
          await waitForAuthenticatedLearnerShell(page);
          const lessonsDesktop = learnerPrimaryNavLinkToHref(page, "/app/lessons");
          await expect(lessonsDesktop).toBeVisible({ timeout: 30_000 });
          await lessonsDesktop.click();
          await page.waitForURL(/\/app\/lessons/, { timeout: 30_000 });
          await page.goBack();
          await page.waitForTimeout(400);
          await page.goForward();
          await page.waitForTimeout(400);

          await page.setViewportSize({ width: 390, height: 844 });
          await page.goto(
            `/app/flashcards?pathwayId=${encodeURIComponent(PAID_E2E_DEFAULT_PATHWAY_ID)}`,
            { waitUntil: "domcontentloaded" },
          );
          await waitForAuthenticatedLearnerShell(page);
          const bottom = page.locator('nav[aria-label="Learner bottom navigation"]');
          await expect(bottom).toBeVisible({ timeout: 15_000 });
          const lessonsMobile = learnerBottomNavLinkToHref(page, "/app/lessons");
          await expect(lessonsMobile).toBeVisible({ timeout: 15_000 });
          await lessonsMobile.click();
          await page.waitForTimeout(500);
          await page.setViewportSize({ width: 1280, height: 800 });
          areas.navigation = "pass";
        } catch (e) {
          areas.navigation = "fail";
          logPaidSurfaceDebug(
            buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "navigation"), obs),
          );
          brokenButtons.push(`navigation: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("navigation");
        }

        // —— Account / subscription UI ——
        try {
          await page.goto("/app/account/overview", { waitUntil: "domcontentloaded" });
          await expectNoSubscriptionPaywall(page, "/app/account/overview");
          const overviewMain = await page.locator("main").innerText();
          expect(overviewMain.length).toBeGreaterThan(80);

          await page.goto("/app/account/billing", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: /Subscription & billing/i })).toBeVisible({
            timeout: 30_000,
          });
          const billingText = await page.locator("main").innerText();
          expect(billingText.length).toBeGreaterThan(40);
          areas.accountSubscription = "pass";
        } catch (e) {
          areas.accountSubscription = "fail";
          logPaidSurfaceDebug(
            buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "accountSubscription"), obs),
          );
          entitlementIssues.push(`accountSubscription: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("account");
        }

        // —— Major learner buttons / study flows (primary nav + quick actions + question bank) ——
        const studyBroken: string[] = [];
        const studyEntitlementFails: string[] = [];
        try {
          await page.goto("/app", { waitUntil: "domcontentloaded" });
          await waitForAuthenticatedLearnerShell(page);
          const nav = page.locator('nav[aria-label="Learner primary actions"]');
          const links = nav.getByRole("link");
          const n = await links.count();
          for (let i = 0; i < n; i++) {
            await page.goto("/app", { waitUntil: "domcontentloaded" });
            const link = page.locator('nav[aria-label="Learner primary actions"]').getByRole("link").nth(i);
            const name = (await link.innerText().catch(() => "?")).trim().slice(0, 64);
            const href = await link.getAttribute("href");
            if (!href?.startsWith("/app")) continue;
            await link.click();
            await page.waitForLoadState("domcontentloaded");
            if (/\/login/i.test(page.url())) {
              studyBroken.push(`nav:${name} → /login`);
            } else {
              await assertPremiumNavTarget(page, `nav:${name}`, studyEntitlementFails);
            }
          }

          await page.goto("/app", { waitUntil: "domcontentloaded" });
          const quick = page.locator('section[aria-label="Quick actions"]');
          if (await quick.isVisible({ timeout: 8000 }).catch(() => false)) {
            const qLinks = quick.getByRole("link");
            const qn = await qLinks.count();
            for (let j = 0; j < Math.min(qn, 6); j++) {
              await page.goto("/app", { waitUntil: "domcontentloaded" });
              const ql = page.locator('section[aria-label="Quick actions"]').getByRole("link").nth(j);
              const qName = (await ql.innerText().catch(() => "?")).trim().slice(0, 64);
              await tryClickVisibleInApp(page, ql, `quickAction:${qName}`, studyBroken);
            }
          }

          await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
          await expectNoSubscriptionPaywall(page, "/app/questions");

          entitlementIssues.push(...studyEntitlementFails);
          brokenButtons.push(...studyBroken);
          areas.studyButtons =
            studyBroken.length === 0 && studyEntitlementFails.length === 0 ? "pass" : "fail";
        } catch (e) {
          areas.studyButtons = "fail";
          logPaidSurfaceDebug(
            buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "studyButtons"), obs),
          );
          brokenButtons.push(`studyButtons: ${e instanceof Error ? e.message : String(e)}`);
          brokenButtons.push(...studyBroken);
          entitlementIssues.push(...studyEntitlementFails);
          await failShot("study-buttons");
        }
      }

      // —— Console / failed requests ——
      try {
        const seriousConsole = obs.consoleErrors.filter(
          (x) => !/cookie|Content Security Policy|third-party|analytics|ResizeObserver/i.test(x),
        );
        const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
        if (seriousConsole.length > 0 || obs.failedRequests.length > 0) {
          let i18nLiveStatic: Awaited<ReturnType<typeof fetchStaticI18nEn>> | undefined;
          let i18nLiveApi: Awaited<ReturnType<typeof fetchApiAssetsI18nEn>> | undefined;
          try {
            i18nLiveStatic = await fetchStaticI18nEn(request, baseUrl);
            i18nLiveApi = await fetchApiAssetsI18nEn(request, baseUrl);
            observerDiagnostics.i18nLiveStatic = i18nLiveStatic;
            observerDiagnostics.i18nLiveApi = i18nLiveApi;
          } catch {
            /* probe is best-effort */
          }
          const categorized = logCategorizedObserverFailureSummary({
            tag: "[paid-audit]",
            routeLabel: "observers",
            seriousConsole,
            failedRequests: obs.failedRequests,
            consoleErrorContext: obs.consoleErrorContext,
            authHttp: obs.authHttp,
            pageUrl: page.url(),
            i18nRuntimeBundle: observerDiagnostics,
            artifactHint: "(see audit-results.json)",
          });
          observerDiagnostics.categorized = categorized;
        }
        if (seriousConsole.length > 0) {
          const i18nLines = seriousConsole.filter((x) => /marketing_message_key_missing/i.test(x));
          const authLines = seriousConsole.filter((x) =>
            /errors\.authjs\.dev|#autherror|getSession|ClientFetchError|Failed to fetch/i.test(x),
          );
          const rest = seriousConsole.filter(
            (x) => !i18nLines.includes(x) && !authLines.includes(x),
          );
          if (i18nLines.length > 0) {
            entitlementIssues.push(`i18n-console: ${i18nLines.slice(0, 6).join(" | ")}`);
          }
          if (authLines.length > 0) {
            entitlementIssues.push(`auth-console: ${authLines.slice(0, 6).join(" | ")}`);
          }
          if (rest.length > 0) {
            entitlementIssues.push(`console-other: ${rest.slice(0, 6).join(" | ")}`);
          }
        }
        if (obs.failedRequests.length > 0) {
          entitlementIssues.push(`network: ${obs.failedRequests.slice(0, 10).join(" | ")}`);
        }
        areas.observers = seriousConsole.length === 0 && obs.failedRequests.length === 0 ? "pass" : "fail";
      } catch (e) {
        areas.observers = "fail";
        logPaidSurfaceDebug(
          buildPaidFailureSnapshot(await collectPaidSurfaceDebug(page, "observers"), obs),
        );
        entitlementIssues.push(`observers: ${e instanceof Error ? e.message : String(e)}`);
      }
    } finally {
      obs.dispose();
    }

    await testInfo.attach("audit-results.json", {
      body: Buffer.from(
        JSON.stringify(
          {
            areas,
            brokenButtons,
            entitlementIssues,
            screenshots,
            observerDiagnostics,
            summary: {
              failedAreas: (Object.entries(areas) as [AreaId, AreaResult][])
                .filter(([, v]) => v === "fail")
                .map(([k]) => k),
            },
          },
          null,
          2,
        ),
      ),
      contentType: "application/json",
    });

    const failedAreas = (Object.entries(areas) as [AreaId, AreaResult][])
      .filter(([, v]) => v === "fail")
      .map(([k]) => k);

    expect(
      failedAreas,
      `Failed areas: ${failedAreas.join(", ")}\nBroken buttons:\n${brokenButtons.join("\n")}\nEntitlement / notes:\n${entitlementIssues.join("\n")}`,
    ).toEqual([]);
  });
});
