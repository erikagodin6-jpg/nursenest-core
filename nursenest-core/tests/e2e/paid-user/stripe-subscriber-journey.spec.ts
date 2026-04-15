/**
 * Full subscriber journey with **Stripe test mode** Checkout (hosted).
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
 * Disposable account: unique email per run (`e2e+…@…`). No automatic DB cleanup — delete via admin if needed.
 *
 * **Likely source files when debugging failures**
 * - Signup UI: `src/components/auth/signup-form.tsx`, Turnstile: `src/components/auth/turnstile-signup.tsx`
 * - Signup API: `src/app/api/signup/route.ts`
 * - Pricing / checkout: `src/components/marketing/pricing-page-client.tsx`, `src/app/api/subscriptions/checkout/route.ts`
 * - Stripe webhook + subscription rows: `src/app/api/subscriptions/webhook/route.ts`
 * - Premium gates: `src/lib/entitlements/*`, `src/components/student/subscription-paywall.tsx`
 */
import { expect, test, type Page } from "@playwright/test";
import { attachPageObservers } from "../helpers/attach-observers";
import { assertSafeSubscriberJourneyBaseUrl } from "../helpers/e2e-safety-guards";
import { loginWithCredentials } from "../helpers/learner-login";
import { logObserverFailureSummary } from "../helpers/log-observer-failure-summary";
import { completeStripeHostedCheckoutTestCard } from "../helpers/stripe-hosted-checkout";
import { waitUntilLessonsNotPaywalled } from "../helpers/wait-for-subscriber-access";

const JOURNEY_ENV = process.env.E2E_STRIPE_CHECKOUT_JOURNEY === "1";

type StepId =
  | "home"
  | "signup"
  | "signupRedirect"
  | "sessionLogin"
  | "pricing"
  | "checkoutStart"
  | "stripeHostedCheckout"
  | "entitlement"
  | "lessonsPremium"
  | "flashcards"
  | "catExam"
  | "gates"
  | "accountBilling"
  | "subscriberButtons"
  | "observers";

type StepResult = "pass" | "fail" | "skipped";

const steps: Record<StepId, StepResult> = {
  home: "fail",
  signup: "fail",
  signupRedirect: "fail",
  sessionLogin: "fail",
  pricing: "fail",
  checkoutStart: "fail",
  stripeHostedCheckout: "fail",
  entitlement: "fail",
  lessonsPremium: "fail",
  flashcards: "fail",
  catExam: "fail",
  gates: "fail",
  accountBilling: "fail",
  subscriberButtons: "fail",
  observers: "fail",
};

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

test.describe("Stripe test-mode subscriber journey (opt-in)", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(600_000);

  test("homepage → signup → Stripe test checkout → premium surfaces", async ({ page, baseURL }, testInfo) => {
    if (!JOURNEY_ENV) {
      test.skip(true, "Set E2E_STRIPE_CHECKOUT_JOURNEY=1 to run this spec.");
    }
    if (!baseURL) throw new Error("Playwright baseURL is not set.");
    assertSafeSubscriberJourneyBaseUrl(baseURL);

    const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const email = `e2e.stripe.${runId}@example.com`;
    const username = `e2e${runId.replace(/\W/g, "").slice(0, 26)}`;
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
      // 1 — Homepage
      try {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await expect(page.locator("body")).toBeVisible();
        steps.home = "pass";
      } catch (e) {
        steps.home = "fail";
        broken.push(`home: ${e instanceof Error ? e.message : String(e)}`);
        await failShot("home");
      }

      // 2 — Sign up
      if (steps.home === "pass") {
        try {
          await page.goto("/signup", { waitUntil: "domcontentloaded" });
          await page.locator('input[name="firstName"]').fill("E2E");
          await page.locator('input[name="lastName"]').fill("Stripe");
          await page.locator('input[name="username"]').fill(username);
          await page.locator('input[name="email"]').fill(email);
          await page.locator('input[name="password"]').fill(password);
          await page.getByRole("button", { name: /create account|sign up/i }).click();
          await page.waitForURL(/\/login/i, { timeout: 120_000 });
          steps.signup = "pass";
        } catch (e) {
          steps.signup = "fail";
          broken.push(`signup: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("signup");
        }
      } else {
        steps.signup = "skipped";
      }

      // 3 — Signup redirect (marketing login + callback to /app)
      if (steps.signup === "pass") {
        try {
          const afterSignup = new URL(page.url());
          expect(afterSignup.pathname).toMatch(/\/login$/);
          expect(afterSignup.searchParams.get("callbackUrl")).toBeTruthy();
          steps.signupRedirect = "pass";
        } catch (e) {
          steps.signupRedirect = "fail";
          broken.push(`signupRedirect: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("signup-redirect");
        }
      } else {
        steps.signupRedirect = "skipped";
      }

      // 4 — Log in (required before pricing checkout)
      if (steps.signupRedirect === "pass") {
        try {
          await loginWithCredentials(page, email, password);
          steps.sessionLogin = "pass";
        } catch (e) {
          steps.sessionLogin = "fail";
          broken.push(`sessionLogin: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("login-after-signup");
        }
      } else {
        steps.sessionLogin = "skipped";
      }

      // 5 — Pricing
      if (steps.sessionLogin === "pass") {
        try {
          await page.goto("/pricing", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: /choose your plan/i })).toBeVisible({ timeout: 60_000 });
          steps.pricing = "pass";
        } catch (e) {
          steps.pricing = "fail";
          broken.push(`pricing: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("pricing");
        }
      } else {
        steps.pricing = "skipped";
      }

      // 6 — Start checkout (consent modal + redirect to Stripe)
      if (steps.pricing === "pass") {
        try {
          const trialCta = page.getByRole("button", { name: /Start your 3-day free trial/i }).first();
          await expect(trialCta).toBeVisible({ timeout: 60_000 });
          await expect(trialCta).toBeEnabled({ timeout: 60_000 });
          await trialCta.click();
          const consentHeading = page.getByRole("heading", { name: /confirm before checkout/i });
          if (await consentHeading.isVisible({ timeout: 8000 }).catch(() => false)) {
            await page.getByRole("checkbox").first().check();
            await page.getByRole("button", { name: /continue to secure checkout/i }).click();
          }
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
          await expect(page).toHaveURL(/\/app/, { timeout: 180_000 });
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
          await waitUntilLessonsNotPaywalled(page, { timeoutMs: 150_000, pollMs: 3000 });
          steps.entitlement = "pass";
        } catch (e) {
          steps.entitlement = "fail";
          broken.push(`entitlement: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("entitlement");
        }
      } else {
        steps.entitlement = "skipped";
      }

      // 9 — Premium lessons
      if (steps.entitlement === "pass") {
        try {
          await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: "Subscription required" })).toHaveCount(0);
          const lessonLinks = page.locator('a[href^="/app/lessons/"]');
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

      // 10 — Flashcards
      if (steps.entitlement === "pass") {
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
          steps.flashcards = "pass";
        } catch (e) {
          steps.flashcards = "fail";
          broken.push(`flashcards: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("flashcards");
        }
      } else {
        steps.flashcards = "skipped";
      }

      // 11 — CAT
      if (steps.entitlement === "pass") {
        try {
          await page.goto("/app/practice-tests?cat=1", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: "Subscription required" })).toHaveCount(0);
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
          await failShot("cat-exams");
        }
      } else {
        steps.catExam = "skipped";
      }

      // 12 — Gates (no paywall on lessons hub)
      if (steps.entitlement === "pass") {
        try {
          await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: "Subscription required" })).toHaveCount(0);
          steps.gates = "pass";
        } catch (e) {
          steps.gates = "fail";
          broken.push(`gates: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("gates");
        }
      } else {
        steps.gates = "skipped";
      }

      // 13 — Account / billing copy
      if (steps.entitlement === "pass") {
        try {
          await page.goto("/app/account/billing", { waitUntil: "domcontentloaded" });
          await expect(page.getByRole("heading", { name: /Subscription & billing/i })).toBeVisible({
            timeout: 30_000,
          });
          const billingText = await page.locator("main").innerText();
          expect(billingText.length).toBeGreaterThan(40);
          steps.accountBilling = "pass";
        } catch (e) {
          steps.accountBilling = "fail";
          broken.push(`accountBilling: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("account-billing");
        }
      } else {
        steps.accountBilling = "skipped";
      }

      // 14 — Primary nav links (subscriber buttons)
      if (steps.entitlement === "pass") {
        try {
          await page.goto("/app", { waitUntil: "domcontentloaded" });
          const nav = page.locator('nav[aria-label="Learner primary actions"]');
          await expect(nav).toBeVisible({ timeout: 30_000 });
          const links = nav.getByRole("link");
          const n = await links.count();
          const clicked: string[] = [];
          const failedNav: string[] = [];
          for (let i = 0; i < Math.min(n, 8); i++) {
            const link = links.nth(i);
            const name = (await link.innerText().catch(() => "?")).trim().slice(0, 80);
            const href = await link.getAttribute("href");
            if (!href?.startsWith("/app")) continue;
            try {
              await link.click();
              await page.waitForLoadState("domcontentloaded");
              if (page.url().includes("/login")) {
                failedNav.push(`${name} → unexpected login`);
              }
              clicked.push(name);
            } catch (err) {
              failedNav.push(`${name}: ${err instanceof Error ? err.message : String(err)}`);
            }
            await page.goto("/app", { waitUntil: "domcontentloaded" });
          }
          if (failedNav.length > 0) {
            throw new Error(failedNav.join("; "));
          }
          if (clicked.length === 0) {
            throw new Error("No /app nav links found to exercise.");
          }
          steps.subscriberButtons = "pass";
        } catch (e) {
          steps.subscriberButtons = "fail";
          broken.push(`subscriberButtons: ${e instanceof Error ? e.message : String(e)}`);
          await failShot("subscriber-buttons");
        }
      } else {
        steps.subscriberButtons = "skipped";
      }

      // Observers / console / network
      try {
        const seriousConsole = obs.consoleErrors.filter(
          (x) => !/cookie|Content Security Policy|third-party|analytics|ResizeObserver/i.test(x),
        );
        if (seriousConsole.length > 0 || obs.failedRequests.length > 0) {
          logObserverFailureSummary({
            tag: "[stripe-journey]",
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
      body: Buffer.from(JSON.stringify({ steps, broken, screenshots, email, username }, null, 2)),
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
