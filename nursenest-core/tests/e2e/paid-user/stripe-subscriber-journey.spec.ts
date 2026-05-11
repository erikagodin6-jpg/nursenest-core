/**
 * Full Canada RPN / REx-PN subscriber journey with **Stripe test mode** Checkout (hosted).
 *
 * **Does not run in CI by default** — opt in with `E2E_STRIPE_CHECKOUT_JOURNEY=1`.
 *
 * Prerequisites (local or staging only):
 * - `BASE_URL` → localhost or an entry in `E2E_ALLOWED_HOSTS`
 * - Database + `DATABASE_URL` (signup writes a real user)
 * - `STRIPE_SECRET_KEY` = sk_test_… and matching price env vars (see pricing-map / checkout route)
 * - Webhook forwarding so entitlements sync after payment, e.g.
 *     `stripe listen --forward-to http://127.0.0.1:3000/api/subscriptions/webhook`
 *   with `STRIPE_WEBHOOK_SECRET` = the signing secret from that command
 * - Turnstile: if `TURNSTILE_SECRET_KEY` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` are set, you need a real
 *   captcha token or temporarily unset Turnstile in a dedicated E2E env (signup fails closed on captcha).
 *
 * Disposable account: unique email per run. No automatic DB cleanup — delete via admin if needed.
 *
 * **Likely source files when debugging failures**
 * - Public hub: `src/app/.../canada/pn/rex-pn/*`
 * - Signup UI: `src/components/auth/signup-form.tsx`, Turnstile: `src/components/auth/turnstile-signup.tsx`
 * - Signup API: `src/app/api/signup/route.ts`
 * - Pricing / checkout: `src/components/marketing/pricing-page-client.tsx`, `src/app/api/subscriptions/checkout/route.ts`
 * - Stripe webhook + subscription rows: `src/app/api/subscriptions/webhook/route.ts`
 * - Premium gates: `src/lib/entitlements/*`, `src/components/student/subscription-paywall.tsx`
 * - Billing routes: `src/app/api/billing/portal/route.ts`, `src/app/api/billing/cancel-subscription/route.ts`
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { answerOneCatExamItem } from "../helpers/cat-practice-exam-flow";
import { assertSafeSubscriberJourneyBaseUrl } from "../helpers/e2e-safety-guards";
import {
  LESSON_HUB_CARD_LINKS,
  paidFlashcardsHubUrl,
  paidLessonsHubUrl,
  paidQuestionsHubUrl,
} from "../helpers/paid-content-discovery";
import { loginWithCredentials } from "../helpers/learner-login";
import { isLearnerShell } from "../helpers/learner-shell";
import { logObserverFailureSummary } from "../helpers/log-observer-failure-summary";
import { completeStripeHostedCheckoutTestCard } from "../helpers/stripe-hosted-checkout";

const JOURNEY_ENV = process.env.E2E_STRIPE_CHECKOUT_JOURNEY === "1";
const RPN_PATHWAY_ID = "ca-rpn-rex-pn";
const RPN_PUBLIC_HUB = "/canada/pn/rex-pn";
const RPN_PRACTICE_CALLBACK = `/app/practice-tests?pathwayId=${encodeURIComponent(RPN_PATHWAY_ID)}`;
const RPN_PRACTICE_HUB = RPN_PRACTICE_CALLBACK;
const RPN_CAT_HUB = `/app/practice-tests?cat=1&pathwayId=${encodeURIComponent(RPN_PATHWAY_ID)}`;
const RPN_BILLING_HUB = "/app/account/billing";

type StepId =
  | "publicHub"
  | "publicCallback"
  | "signup"
  | "authReturn"
  | "pricing"
  | "checkoutStart"
  | "stripeHostedCheckout"
  | "entitlement"
  | "lessonsPremium"
  | "flashcardsPremium"
  | "questionsPremium"
  | "practiceTestsPremium"
  | "catExam"
  | "accountBilling"
  | "cancelSubscription"
  | "portalRedirect"
  | "observers";

type StepResult = "pass" | "fail" | "skipped";

function freshSteps(): Record<StepId, StepResult> {
  return {
    publicHub: "fail",
    publicCallback: "fail",
    signup: "fail",
    authReturn: "fail",
    pricing: "fail",
    checkoutStart: "fail",
    stripeHostedCheckout: "fail",
    entitlement: "fail",
    lessonsPremium: "fail",
    flashcardsPremium: "fail",
    questionsPremium: "fail",
    practiceTestsPremium: "fail",
    catExam: "fail",
    accountBilling: "fail",
    cancelSubscription: "fail",
    portalRedirect: "fail",
    observers: "fail",
  };
}

function signupEmailDomain(): string {
  return process.env.QA_SIGNUP_EMAIL_DOMAIN?.trim() || "example.com";
}

async function dismissFlashcardResumeIfPresent(page: Page) {
  const startFresh = page.getByRole("button", { name: /^Start fresh$/i });
  if (await startFresh.isVisible().catch(() => false)) {
    await startFresh.click();
    await page.waitForTimeout(300);
  }
}

async function answerOneCatItem(page: Page) {
  await answerOneCatExamItem(page);
}

async function checkAllVisibleCheckboxes(page: Page) {
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  for (let i = 0; i < count; i++) {
    const box = checkboxes.nth(i);
    const visible = await box.isVisible().catch(() => false);
    if (!visible) continue;
    const checked = await box.isChecked().catch(() => false);
    if (!checked) await box.check({ force: true });
  }
}

async function waitUntilPathwayLessonsNotPaywalled(
  page: Page,
  pathwayId: string,
  opts?: { timeoutMs?: number; pollMs?: number },
) {
  const timeoutMs = opts?.timeoutMs ?? 150_000;
  const pollMs = opts?.pollMs ?? 3000;
  const start = Date.now();
  const route = paidLessonsHubUrl(pathwayId);

  while (Date.now() - start < timeoutMs) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const paywall = page.getByRole("heading", { name: /Subscription required/i });
    if (!(await paywall.isVisible().catch(() => false))) return;
    await page.waitForTimeout(pollMs);
  }

  throw new Error(
    [
      `Timed out waiting for premium access on ${route} (still seeing Subscription required).`,
      "Ensure Stripe test mode keys are set, webhook secret matches `stripe listen`,",
      "and `/api/subscriptions/webhook` receives `checkout.session.completed`.",
    ].join(" "),
  );
}

test.describe("Stripe test-mode Canada RPN subscriber journey (opt-in)", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(600_000);

  test("public REx-PN hub → signup → hosted checkout → RPN paid learner surfaces", async ({ page, baseURL }, testInfo) => {
    if (!JOURNEY_ENV) {
      test.skip(true, "Set E2E_STRIPE_CHECKOUT_JOURNEY=1 to run this spec.");
    }
    if (!baseURL) throw new Error("Playwright baseURL is not set.");
    assertSafeSubscriberJourneyBaseUrl(baseURL);

    const steps = freshSteps();
    const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const email = `e2e.rpn.stripe.${runId}@${signupEmailDomain()}`;
    const username = `e2erpn${runId.replace(/\W/g, "").slice(0, 22)}`;
    const password = `E2eTest1!${runId.slice(-4)}`;

    const obs = attachPageObservers(page, { profile: "app" });
    const broken: string[] = [];
    const screenshots: string[] = [];

    async function failShot(slug: string) {
      const p = testInfo.outputPath(`failure-${slug}.png`);
      await page.screenshot({ path: p, fullPage: true }).catch(() => {});
      screenshots.push(p);
    }

    try {
      // 1 — Public REx-PN hub
      try {
        await page.goto(RPN_PUBLIC_HUB, { waitUntil: "domcontentloaded" });
        await expect(page.getByRole("heading", { name: /REx-PN/i }).first()).toBeVisible({ timeout: 60_000 });
        await expect(page.locator("body")).toContainText(/RPN|REx-PN/i);
        steps.publicHub = "pass";
      } catch (e) {
        steps.publicHub = "fail";
        broken.push(`publicHub: ${e instanceof Error ? e.message : String(e)}`);
        await failShot("public-hub");
      }

      // 2 — Public premium-module callback into auth
      if (steps.publicHub === "pass") {
        try {
          const moduleCard = page
            .locator('[data-nn-qa-hub-premium-module="practice_tests"] a.nn-exam-hub-study-card')
            .first();
          await expect(moduleCard).toBeVisible({ timeout: 60_000 });
          const href = await moduleCard.getAttribute("href");
          expect(decodeURIComponent(href ?? "")).toContain("/login");
          expect(decodeURIComponent(href ?? "")).toContain(RPN_PATHWAY_ID);
          await moduleCard.click();
          await expect(page).toHaveURL(/\/login\?/, { timeout: 60_000 });
          const loginUrl = new URL(page.url());
          const callbackUrl = decodeURIComponent(loginUrl.searchParams.get("callbackUrl") ?? "");
          expect(callbackUrl).toContain("/app/practice-tests");
          expect(callbackUrl).toContain(RPN_PATHWAY_ID);
          steps.publicCallback = "pass";
        } catch (e) {
          steps.publicCallback = "fail";
          broken.push(`publicCallback: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("public-callback");
        }
      } else {
        steps.publicCallback = "skipped";
      }

      // 3 — Signup for Canada RPN
      if (steps.publicCallback === "pass") {
        try {
          const loginUrl = new URL(page.url());
          const callbackUrl = loginUrl.searchParams.get("callbackUrl") ?? RPN_PRACTICE_CALLBACK;
          await page.goto(`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`, { waitUntil: "domcontentloaded" });
          await page.locator('input[name="firstName"]').fill("E2E");
          await page.locator('input[name="lastName"]').fill("RPN");
          await page.locator('input[name="username"]').fill(username);
          await page.locator('input[name="email"]').fill(email);
          await page.locator('input[name="password"]').fill(password);
          await page.locator('select[name="country"]').selectOption("CA");
          await page.locator('select[name="tier"]').selectOption("RPN");
          await expect(page.locator('select[name="examFocus"]')).toHaveValue("rex_pn");
          const submit = page.getByRole("button", { name: /create account/i });
          await expect(submit).toBeEnabled({ timeout: 90_000 });
          const [signupRes] = await Promise.all([
            page.waitForResponse(
              (res) => {
                if (res.request().method() !== "POST") return false;
                try {
                  return new URL(res.url()).pathname.endsWith("/api/signup");
                } catch {
                  return false;
                }
              },
              { timeout: 120_000 },
            ),
            submit.click(),
          ]);
          expect(signupRes.status(), "account created (POST /api/signup)").toBe(201);
          const apiJson = (await signupRes.json().catch(() => ({}))) as { ok?: boolean };
          expect(apiJson.ok, "signup API body indicates success").toBe(true);
          await page.waitForURL(
            (url) => {
              const p = url.pathname;
              return !p.includes("/signup") && !p.includes("/sign-up");
            },
            { timeout: 120_000 },
          );
          steps.signup = "pass";
        } catch (e) {
          steps.signup = "fail";
          broken.push(`signup: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("signup");
        }
      } else {
        steps.signup = "skipped";
      }

      // 4 — Authenticated return to learner shell (callback should stay on RPN pathway)
      if (steps.signup === "pass") {
        try {
          let path = "";
          try {
            path = new URL(page.url()).pathname;
          } catch {
            path = "";
          }
          if (path.includes("/login")) {
            await loginWithCredentials(page, email, password);
          }
          const currentUrl = new URL(page.url());
          expect(isLearnerShell(currentUrl.pathname), `expected learner shell after signup; got ${page.url()}`).toBe(true);
          expect(currentUrl.pathname, "fresh Canada RPN signup should not be pushed back into onboarding").not.toContain("/onboarding");
          expect(decodeURIComponent(page.url())).toContain(RPN_PATHWAY_ID);
          steps.authReturn = "pass";
        } catch (e) {
          steps.authReturn = "fail";
          broken.push(`authReturn: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("auth-return");
        }
      } else {
        steps.authReturn = "skipped";
      }

      // 5 — Pricing page opens with explicit RPN checkout intent
      if (steps.authReturn === "pass") {
        try {
          await page.goto("/pricing?checkoutIntent=1&checkoutTier=RPN&checkoutDuration=monthly", {
            waitUntil: "domcontentloaded",
          });
          await expect(page.getByRole("heading", { name: /choose your plan/i })).toBeVisible({ timeout: 60_000 });
          await expect(page.locator("body")).toContainText(/RPN|REx-PN/i);
          const consentHeading = page.getByRole("heading", { name: /confirm before checkout/i });
          if (!(await consentHeading.isVisible({ timeout: 15_000 }).catch(() => false))) {
            await checkAllVisibleCheckboxes(page);
            await page.locator('[data-testid="pricing-checkout-monthly"]').click();
            await expect(consentHeading).toBeVisible({ timeout: 20_000 });
          }
          steps.pricing = "pass";
        } catch (e) {
          steps.pricing = "fail";
          broken.push(`pricing: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("pricing");
        }
      } else {
        steps.pricing = "skipped";
      }

      // 6 — Consent modal → Stripe hosted checkout
      if (steps.pricing === "pass") {
        try {
          await checkAllVisibleCheckboxes(page);
          const continueToCheckout = page.getByRole("button", {
            name: /continue to (north america|secure) checkout/i,
          });
          await expect(continueToCheckout).toBeEnabled({ timeout: 20_000 });
          await continueToCheckout.click();
          await page.waitForURL(/checkout\.stripe\.com/, { timeout: 180_000 });
          steps.checkoutStart = "pass";
        } catch (e) {
          steps.checkoutStart = "fail";
          broken.push(`checkoutStart: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("checkout-start");
        }
      } else {
        steps.checkoutStart = "skipped";
      }

      // 7 — Stripe hosted page (test card)
      if (steps.checkoutStart === "pass") {
        try {
          await completeStripeHostedCheckoutTestCard(page, { customerEmail: email });
          await expect
            .poll(
              () => {
                try {
                  return isLearnerShell(new URL(page.url()).pathname);
                } catch {
                  return false;
                }
              },
              { timeout: 180_000 },
            )
            .toBe(true);
          expect(page.url()).toMatch(/checkout=success/);
          steps.stripeHostedCheckout = "pass";
        } catch (e) {
          steps.stripeHostedCheckout = "fail";
          broken.push(`stripeHostedCheckout: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("stripe-checkout");
        }
      } else {
        steps.stripeHostedCheckout = "skipped";
      }

      // 8 — Entitlement (webhook-dependent)
      if (steps.stripeHostedCheckout === "pass") {
        try {
          await waitUntilPathwayLessonsNotPaywalled(page, RPN_PATHWAY_ID, { timeoutMs: 150_000, pollMs: 3000 });
          steps.entitlement = "pass";
        } catch (e) {
          steps.entitlement = "fail";
          broken.push(`entitlement: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("entitlement");
        }
      } else {
        steps.entitlement = "skipped";
      }

      // 9 — Lessons hub + lesson detail
      if (steps.entitlement === "pass") {
        try {
          await page.goto(paidLessonsHubUrl(RPN_PATHWAY_ID), { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: /Subscription required/i })).toHaveCount(0);
          const lessonLinks = page.locator(LESSON_HUB_CARD_LINKS);
          await expect(lessonLinks.first()).toBeVisible({ timeout: 120_000 });
          await lessonLinks.first().click();
          await page.waitForLoadState("domcontentloaded");
          const mainText = await page.locator("main").innerText();
          expect(mainText.length).toBeGreaterThan(120);
          steps.lessonsPremium = "pass";
        } catch (e) {
          steps.lessonsPremium = "fail";
          broken.push(`lessonsPremium: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("lessons");
        }
      } else {
        steps.lessonsPremium = "skipped";
      }

      // 10 — Flashcards hub + reveal answer
      if (steps.entitlement === "pass") {
        try {
          await page.goto(paidFlashcardsHubUrl(RPN_PATHWAY_ID), { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: /Subscription required/i })).toHaveCount(0);
          const learnFirst = page.locator('a[href*="/app/flashcards/"][href*="mode=learn"]').first();
          await expect(learnFirst).toBeVisible({ timeout: 120_000 });
          const deckHref = await learnFirst.getAttribute("href");
          expect(deckHref).toBeTruthy();
          await page.goto(deckHref!, { waitUntil: "domcontentloaded" });
          await dismissFlashcardResumeIfPresent(page);
          await expect(page.getByRole("button", { name: /^Reveal answer$/i })).toBeVisible({ timeout: 120_000 });
          await page.getByRole("button", { name: /^Reveal answer$/i }).click();
          await expect(page.getByText(/^Correct answer$/i)).toBeVisible();
          steps.flashcardsPremium = "pass";
        } catch (e) {
          steps.flashcardsPremium = "fail";
          broken.push(`flashcardsPremium: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("flashcards");
        }
      } else {
        steps.flashcardsPremium = "skipped";
      }

      // 11 — Questions hub
      if (steps.entitlement === "pass") {
        try {
          await page.goto(paidQuestionsHubUrl(RPN_PATHWAY_ID), { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: /Subscription required/i })).toHaveCount(0);
          await expect(page.locator('[data-testid="practice-adaptive-setup"]')).toBeVisible({ timeout: 120_000 });
          await expect(page.locator('[data-testid="start-practice-btn"]')).toBeVisible({ timeout: 120_000 });
          steps.questionsPremium = "pass";
        } catch (e) {
          steps.questionsPremium = "fail";
          broken.push(`questionsPremium: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("questions");
        }
      } else {
        steps.questionsPremium = "skipped";
      }

      // 12 — Practice tests hub
      if (steps.entitlement === "pass") {
        try {
          await page.goto(RPN_PRACTICE_HUB, { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: /Subscription required/i })).toHaveCount(0);
          await expect(page.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible({ timeout: 60_000 });
          steps.practiceTestsPremium = "pass";
        } catch (e) {
          steps.practiceTestsPremium = "fail";
          broken.push(`practiceTestsPremium: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("practice-tests");
        }
      } else {
        steps.practiceTestsPremium = "skipped";
      }

      // 13 — CAT
      if (steps.entitlement === "pass") {
        try {
          await page.goto(RPN_CAT_HUB, { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: /Subscription required/i })).toHaveCount(0);
          await expect(page.locator("[data-nn-qa-practice-hub-start-test]")).toBeVisible({ timeout: 60_000 });
          await page.locator("[data-nn-qa-practice-hub-start-test]").click();
          await expect(page.getByRole("button", { name: /^Begin exam$/i })).toBeVisible({ timeout: 15_000 });
          await page.getByRole("button", { name: /^Begin exam$/i }).click();
          await page.waitForURL(/\/app\/practice-tests\/[a-zA-Z0-9_-]+/, { timeout: 120_000 });
          await answerOneCatItem(page);
          steps.catExam = "pass";
        } catch (e) {
          steps.catExam = "fail";
          broken.push(`catExam: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("cat-exam");
        }
      } else {
        steps.catExam = "skipped";
      }

      // 14 — Billing page shows RPN plan + actions
      if (steps.entitlement === "pass") {
        try {
          await page.goto(RPN_BILLING_HUB, { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: /Subscription & billing/i })).toBeVisible({
            timeout: 30_000,
          });
          await expect(page.locator("main")).toContainText(/RPN|REx-PN|Practical Nursing/i);
          await expect(page.locator("#billing-portal button").first()).toBeVisible({ timeout: 30_000 });
          steps.accountBilling = "pass";
        } catch (e) {
          steps.accountBilling = "fail";
          broken.push(`accountBilling: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("account-billing");
        }
      } else {
        steps.accountBilling = "skipped";
      }

      // 15 — Cancel subscription via learner billing UI
      if (steps.accountBilling === "pass") {
        try {
          page.once("dialog", async (dialog) => {
            await dialog.accept();
          });
          const cancelButton = page.getByRole("button", { name: /cancel.*subscription|subscription.*cancel/i });
          await expect(cancelButton).toBeVisible({ timeout: 30_000 });
          const [cancelRes] = await Promise.all([
            page.waitForResponse(
              (res) => {
                if (res.request().method() !== "POST") return false;
                try {
                  return new URL(res.url()).pathname === "/api/billing/cancel-subscription";
                } catch {
                  return false;
                }
              },
              { timeout: 60_000 },
            ),
            cancelButton.click(),
          ]);
          expect(cancelRes.status(), "cancel subscription response").toBe(200);
          const cancelJson = (await cancelRes.json().catch(() => ({}))) as { ok?: boolean };
          expect(cancelJson.ok, "cancel subscription body indicates success").toBe(true);
          steps.cancelSubscription = "pass";
        } catch (e) {
          steps.cancelSubscription = "fail";
          broken.push(`cancelSubscription: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("cancel-subscription");
        }
      } else {
        steps.cancelSubscription = "skipped";
      }

      // 16 — Billing portal redirect works after purchase
      if (steps.accountBilling === "pass") {
        try {
          await page.goto(RPN_BILLING_HUB, { waitUntil: "domcontentloaded" });
          const portalButton = page.locator("#billing-portal button").first();
          await expect(portalButton).toBeVisible({ timeout: 30_000 });
          const [portalRes] = await Promise.all([
            page.waitForResponse(
              (res) => {
                if (res.request().method() !== "POST") return false;
                try {
                  return new URL(res.url()).pathname === "/api/billing/portal";
                } catch {
                  return false;
                }
              },
              { timeout: 60_000 },
            ),
            portalButton.click(),
          ]);
          expect(portalRes.status(), "billing portal response").toBe(200);
          const portalJson = (await portalRes.json().catch(() => ({}))) as { url?: string };
          expect(portalJson.url, "billing portal session URL present").toMatch(/^https:\/\/billing\.stripe\.com\//);
          await page.waitForURL(/billing\.stripe\.com/, { timeout: 60_000 });
          steps.portalRedirect = "pass";
        } catch (e) {
          steps.portalRedirect = "fail";
          broken.push(`portalRedirect: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("billing-portal");
        }
      } else {
        steps.portalRedirect = "skipped";
      }

      // Observers / console / network
      try {
        const seriousConsole = obs.consoleErrors.filter(
          (x) => !/cookie|Content Security Policy|third-party|analytics|ResizeObserver/i.test(x),
        );
        if (seriousConsole.length > 0 || obs.failedRequests.length > 0) {
          logObserverFailureSummary({
            tag: "[rpn-stripe-journey]",
            routeLabel: "observers",
            seriousConsole,
            failedRequests: obs.failedRequests,
            pageUrl: page.url(),
            artifactHint: "(see stripe-journey-results.json)",
          });
        }
        if (seriousConsole.length > 0) {
          broken.push(`console: ${seriousConsole.slice(0, 6).join(" | ")}`);
        }
        if (obs.failedRequests.length > 0) {
          broken.push(`network: ${obs.failedRequests.slice(0, 10).join(" | ")}`);
        }
        steps.observers = seriousConsole.length === 0 && obs.failedRequests.length === 0 ? "pass" : "fail";
      } catch (e) {
        steps.observers = "fail";
        broken.push(`observers: ${e instanceof Error ? e.message : String(e)}`);
      }
    } finally {
      obs.dispose();
    }

    await testInfo.attach("stripe-journey-results.json", {
      body: Buffer.from(
        JSON.stringify({ steps, broken, screenshots, email, username, pathwayId: RPN_PATHWAY_ID }, null, 2),
      ),
      contentType: "application/json",
    });

    const failed = (Object.entries(steps) as [StepId, StepResult][])
      .filter(([, v]) => v === "fail")
      .map(([k]) => k);
    expect(
      failed,
      `Failed steps: ${failed.join(", ")}\nNotes:\n${broken.join("\n")}`,
    ).toEqual([]);
  });
});
