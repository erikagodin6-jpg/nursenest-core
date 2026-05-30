/**
 * Critical conversion audit:
 * anonymous visitor -> signup -> email verification -> login -> onboarding -> free gates -> trial -> checkout handoff.
 *
 * Required for the mutating full-funnel test:
 * - `QA_SIGNUP_EMAIL_DOMAIN`: allowed catch-all domain for unique signup emails.
 * - `DATABASE_URL`: local/QA database used by the running app.
 *
 * Optional:
 * - `E2E_STRIPE_CHECKOUT_ENABLED=1`: enables hosted Stripe checkout completion with test-card helpers.
 */
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { PrismaClient, SubscriptionStatus } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";
import { loginWithCredentials } from "../helpers/learner-login";
import { waitForStableLearnerPathname } from "../helpers/redirect-loop-guard";
import { completeStripeHostedCheckoutTestCard } from "../helpers/stripe-hosted-checkout";
import { LEGAL_POLICY_BUNDLE_VERSION } from "../../../src/lib/legal/legal-config";

test.use({ storageState: { cookies: [], origins: [] } });

const prisma = new PrismaClient();
const CHECKOUT_URL = "https://checkout.stripe.com/c/pay/cs_test_nursenest_conversion_audit";

type BrowserFailures = {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: string[];
  dispose: () => void;
};

function observeBrowserFailures(page: Page): BrowserFailures {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];

  const isIgnoredConsole = (text: string) =>
    /favicon|ResizeObserver|webpack-hmr|Download the React DevTools/i.test(text) ||
    /next-image-unconfigured-qualities|images\.qualities/i.test(text) ||
    /\[marketing-i18n\]|\[MarketingI18nProvider\]/i.test(text) ||
    /\[nursenest-core\].*marketing_message_key_missing/i.test(text);

  const onConsole = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (!isIgnoredConsole(text)) consoleErrors.push(text);
  };
  const onPageError = (error: Error) => pageErrors.push(error.message);
  const onRequestFailed = (req: import("@playwright/test").Request) => {
    const failure = req.failure();
    const url = req.url();
    if (failure?.errorText === "net::ERR_ABORTED") return;
    if (/favicon|\.woff2?$|google-analytics|googletagmanager|webpack-hmr/i.test(url)) return;
    failedRequests.push(`${failure?.errorText ?? "failed"} ${url}`);
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  page.on("requestfailed", onRequestFailed);

  return {
    consoleErrors,
    pageErrors,
    failedRequests,
    dispose: () => {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      page.off("requestfailed", onRequestFailed);
    },
  };
}

async function attachFailureArtifact(testInfo: TestInfo, name: string, page: Page, failures: BrowserFailures) {
  await testInfo.attach(name, {
    body: Buffer.from(
      JSON.stringify(
        {
          finalUrl: page.url(),
          consoleErrors: failures.consoleErrors,
          pageErrors: failures.pageErrors,
          failedRequests: failures.failedRequests,
        },
        null,
        2,
      ),
    ),
    contentType: "application/json",
  });
}

function assertNoBrowserFailures(failures: BrowserFailures) {
  expect(failures.consoleErrors, failures.consoleErrors.join(" | ")).toEqual([]);
  expect(failures.pageErrors, failures.pageErrors.join(" | ")).toEqual([]);
  expect(failures.failedRequests, failures.failedRequests.join(" | ")).toEqual([]);
}

function uniqueAccount() {
  const domain = process.env.QA_SIGNUP_EMAIL_DOMAIN?.trim();
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    domain,
    email: `conversion-audit+${stamp}@${domain}`,
    username: `conversion${stamp.replace(/\W/g, "").slice(0, 18)}`,
    password: `E2e1!Audit${stamp.slice(-4)}`,
  };
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

async function createKnownVerificationLink(userId: string, origin: string): Promise<string> {
  const rawToken = randomBytes(32).toString("base64url");
  await prisma.emailVerificationToken.deleteMany({ where: { userId } });
  await prisma.emailVerificationToken.create({
    data: {
      userId,
      tokenHash: sha256(rawToken),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });
  const url = new URL("/api/auth/verify-email", origin);
  url.searchParams.set("token", rawToken);
  url.searchParams.set("callbackUrl", "/app/onboarding");
  return url.toString();
}

async function fillSignupForm(page: Page, account: ReturnType<typeof uniqueAccount>, confirmPassword: string) {
  await page.locator('input[name="firstName"]').fill("Conversion");
  await page.locator('input[name="lastName"]').fill("Audit");
  await page.locator('input[name="username"]').fill(account.username);
  await page.locator('input[name="email"]').fill(account.email);
  await page.locator('input[name="password"]').fill(account.password);
  await page.locator('input[name="passwordConfirm"]').fill(confirmPassword);
  await page.locator('select[name="country"]').selectOption("CA");
  await page.locator('select[name="tier"]').selectOption("RN");
  await page.locator('select[name="examFocus"]').selectOption("nclex_rn");
}

async function expectSessionFor(page: Page, email: string) {
  const session = await page.evaluate(async () => {
    const res = await fetch("/api/auth/session", { credentials: "same-origin", cache: "no-store" });
    return { status: res.status, json: await res.json().catch(() => ({})) };
  });
  expect(session.status).toBe(200);
  expect(JSON.stringify(session.json).toLowerCase()).toContain(email.toLowerCase());
}

async function finishOnboarding(page: Page) {
  await page.goto("/app/onboarding", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /set up your study system/i })).toBeVisible({ timeout: 45_000 });
  await page.getByRole("button", { name: /build my learning path/i }).click();

  for (const id of ["rn", "rpn", "np", "pre_nursing", "allied"]) {
    await expect(page.getByTestId(`onboarding-exam-goal-${id}`)).toBeVisible({ timeout: 30_000 });
  }

  await page.getByTestId("onboarding-exam-goal-rpn").click();
  await page.getByTestId("onboarding-exam-goal-np").click();
  await page.getByTestId("onboarding-exam-goal-pre_nursing").click();
  await page.getByTestId("onboarding-exam-goal-allied").click();
  await page.getByTestId("onboarding-exam-goal-rn").click();
  await page.getByRole("button", { name: /senior student|final prep/i }).click();
  await page.getByRole("button", { name: /ECG & telemetry/i }).click();
  await page.getByTestId("onboarding-start-studying-now").click();

  await expect(page.getByRole("heading", { name: /connects back to clinical readiness/i })).toBeVisible({
    timeout: 30_000,
  });
  await page.getByRole("button", { name: /^Continue$/i }).click();
  await page.getByRole("button", { name: /build a guided pathway/i }).click();
  await page.getByRole("button", { name: /^Continue$/i }).click();
  await expect(page.getByRole("heading", { name: /first clinical progression path/i })).toBeVisible({
    timeout: 30_000,
  });
  await page.getByRole("button", { name: /take readiness check instead/i }).click();
  await page.waitForURL((url) => !url.pathname.includes("/app/onboarding"), { timeout: 90_000 });
}

async function expectFreeUserGates(page: Page) {
  await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /subscription required/i })).toBeVisible({ timeout: 45_000 });
  await expect(page.getByRole("heading", { name: /lesson preview/i })).toBeVisible({ timeout: 60_000 });
  await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /subscription required/i }).first()).toBeVisible({
    timeout: 45_000,
  });
  await expect(page.locator('a[href="/pricing"]').first()).toBeVisible({ timeout: 20_000 });
}

async function startTrialAndExpectPremium(page: Page) {
  const start = await page.evaluate(async () => {
    const res = await fetch("/api/trial/start", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    return { status: res.status, json: await res.json().catch(() => ({})) };
  });
  expect(start.status, JSON.stringify(start.json)).toBe(200);
  expect(start.json).toMatchObject({ ok: true });
  expect(String((start.json as { trialEndsAt?: unknown }).trialEndsAt ?? "")).toMatch(/^\d{4}-\d{2}-\d{2}T/);

  const status = await page.evaluate(async () => {
    const res = await fetch("/api/trial/status", { credentials: "same-origin", cache: "no-store" });
    return { status: res.status, json: await res.json().catch(() => ({})) };
  });
  expect(status.status).toBe(200);
  expect(status.json).toMatchObject({ trialStatus: "ACTIVE", trialActive: true });

  await page.goto("/app/lessons", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 45_000 });
  await expect(page.getByRole("heading", { name: /subscription required/i })).toHaveCount(0);
}

async function createSubscriptionAccessMarker(userId: string) {
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: `sub_conversion_audit_${userId}` },
    update: {
      status: SubscriptionStatus.ACTIVE,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    create: {
      userId,
      status: SubscriptionStatus.ACTIVE,
      stripeCustomerId: `cus_conversion_audit_${userId.slice(0, 12)}`,
      stripeSubscriptionId: `sub_conversion_audit_${userId}`,
      planTier: "RN",
      planCountry: "CA",
      planDuration: "monthly",
      planCode: "conversion_audit_rn_monthly",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
}

test.describe("Critical Conversion Funnel Audit", () => {
  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test("homepage entry CTAs, pricing links, trial CTAs, and browser health", async ({ page }, testInfo) => {
    const failures = observeBrowserFailures(page);
    try {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 45_000 });

      const getStarted = page.getByRole("link", { name: /get started|start free account|start free trial/i }).first();
      await expect(getStarted).toBeVisible({ timeout: 45_000 });
      await getStarted.click();
      await expect(page).toHaveURL(/\/(signup|pricing|login|app)/i, { timeout: 30_000 });

      await page.goto("/", { waitUntil: "domcontentloaded" });
      const signUp = page.getByRole("link", { name: /sign up|create account/i }).first();
      await expect(signUp).toBeVisible({ timeout: 30_000 });
      await signUp.click();
      await expect(page).toHaveURL(/\/signup/i, { timeout: 30_000 });

      await page.goto("/", { waitUntil: "domcontentloaded" });
      const pricing = page.getByRole("link", { name: /pricing|view plans/i }).first();
      await expect(pricing).toBeVisible({ timeout: 30_000 });
      await pricing.click();
      await expect(page).toHaveURL(/\/pricing/i, { timeout: 30_000 });

      const trialCta = page.getByRole("button", { name: /trial|checkout|subscribe|start/i }).first();
      await expect(trialCta).toBeVisible({ timeout: 45_000 });

      assertNoBrowserFailures(failures);
    } finally {
      await attachFailureArtifact(testInfo, "homepage-entry-browser-failures.json", page, failures);
      failures.dispose();
    }
  });

  test("signup, verification, login, onboarding, free gates, trial, and premium access", async ({
    page,
    baseURL,
  }, testInfo) => {
    const account = uniqueAccount();
    test.skip(!account.domain, "Set QA_SIGNUP_EMAIL_DOMAIN to an allowed catch-all domain.");
    test.skip(!process.env.DATABASE_URL?.trim(), "DATABASE_URL is required for verification-token and account assertions.");
    const origin = baseURL ? new URL(baseURL).origin : "http://127.0.0.1:3000";
    const failures = observeBrowserFailures(page);

    try {
      await page.goto("/signup", { waitUntil: "domcontentloaded" });
      await expect(page.locator('input[name="email"]')).toBeVisible({ timeout: 30_000 });
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('input[name="passwordConfirm"]')).toBeVisible();

      await fillSignupForm(page, account, `${account.password}x`);
      await page.getByRole("button", { name: /create account/i }).click();
      await expect(page.getByText(/passwords do not match/i)).toBeVisible({ timeout: 10_000 });

      await page.locator('input[name="passwordConfirm"]').fill(account.password);
      const [signupRes] = await Promise.all([
        page.waitForResponse(
          (res) => res.request().method() === "POST" && new URL(res.url()).pathname.endsWith("/api/signup"),
          { timeout: 120_000 },
        ),
        page.getByRole("button", { name: /create account/i }).click(),
      ]);
      expect(signupRes.status(), "POST /api/signup creates account").toBe(201);
      await expect(page).toHaveURL(/\/verify-email/i, { timeout: 60_000 });

      await expect
        .poll(
          async () =>
            (
              await prisma.user.findUnique({
                where: { email: account.email.toLowerCase() },
                select: { emailVerificationTokens: { select: { id: true } } },
              })
            )?.emailVerificationTokens.length ?? -1,
          { timeout: 30_000, message: "new signup account stored with verification token" },
        )
        .toBeGreaterThan(0);
      const user = await prisma.user.findUniqueOrThrow({
        where: { email: account.email.toLowerCase() },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          emailVerificationTokens: { select: { id: true } },
        },
      });
      expect(user.emailVerified).toBe(false);
      expect(user.emailVerificationTokens.length, "verification email/token was triggered").toBeGreaterThan(0);

      const verifyUrl = await createKnownVerificationLink(user.id, origin);
      await page.goto(verifyUrl, { waitUntil: "domcontentloaded" });
      await expect(page).toHaveURL(/\/verify-email.*status=success/i, { timeout: 30_000 });
      await expect(page.locator("body")).toContainText(/verified|ready|sign in/i, { timeout: 30_000 });
      await expect
        .poll(
          async () =>
            prisma.user.findUnique({ where: { id: user.id }, select: { emailVerified: true } }).then((row) => row?.emailVerified),
          { timeout: 20_000, message: "account activated after verification link" },
        )
        .toBe(true);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          onboardingCompletedAt: null,
          examFocus: null,
          learnerPath: null,
          targetExamPathwayId: null,
          examGoalSetAt: null,
        },
      });

      await loginWithCredentials(page, account.email, account.password, { navigationOrigin: origin });
      await waitForStableLearnerPathname(page, { label: "post-login learner shell" });
      await expectSessionFor(page, account.email);
      await page.reload({ waitUntil: "domcontentloaded" });
      await expectSessionFor(page, account.email);

      const signOut = page.getByRole("button", { name: /sign out/i }).or(page.getByRole("link", { name: /sign out/i })).first();
      if (await signOut.isVisible({ timeout: 10_000 }).catch(() => false)) {
        await signOut.click();
        await page.waitForURL((url) => !url.pathname.startsWith("/app"), { timeout: 60_000 }).catch(() => {});
      } else {
        await page.goto("/api/auth/signout", { waitUntil: "domcontentloaded" });
      }

      await loginWithCredentials(page, account.email, account.password, { navigationOrigin: origin });
      await finishOnboarding(page);
      await expect
        .poll(
          async () => {
            const row = await prisma.user.findUnique({
              where: { id: user.id },
              select: { onboardingCompletedAt: true, targetExamPathwayId: true },
            });
            return row?.onboardingCompletedAt && row.targetExamPathwayId ? row.targetExamPathwayId : "";
          },
          { timeout: 30_000, message: "onboarding persisted" },
        )
        .toMatch(/\S+/);

      await expectFreeUserGates(page);
      await startTrialAndExpectPremium(page);
      await createSubscriptionAccessMarker(user.id);
      await page.goto("/app/questions", { waitUntil: "domcontentloaded" });
      await expect(page.locator("main, [role='main']").first()).toBeVisible({ timeout: 45_000 });
      await expect(page.getByRole("heading", { name: /subscription required/i })).toHaveCount(0);

      assertNoBrowserFailures(failures);
    } finally {
      await attachFailureArtifact(testInfo, "signup-trial-conversion-browser-failures.json", page, failures);
      failures.dispose();
    }
  });

  test("pricing checkout creates a checkout request and redirects to Stripe", async ({ page }) => {
    const requests: unknown[] = [];
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: { id: "conversion-checkout-user", email: "conversion-checkout@nursenest.test", name: "Conversion" },
          expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        }),
      });
    });
    await page.route("**/api/subscriptions/checkout", async (route) => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: CHECKOUT_URL, sessionId: "cs_test_nursenest_conversion_audit" }),
      });
    });
    await page.route("https://checkout.stripe.com/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<!doctype html><title>Stripe Checkout</title><main>Stripe Checkout</main>",
      });
    });

    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    await page.getByTestId("pricing-segment-rn").click();
    await page.getByTestId("pricing-checkout-monthly").click();

    const modal = page.locator(".nn-pricing-consent-modal");
    await expect(modal).toBeVisible({ timeout: 30_000 });
    for (const checkbox of await modal.locator('input[type="checkbox"]').all()) {
      await checkbox.check();
    }
    await modal.getByRole("button", { name: /continue to secure checkout|continue to north america checkout/i }).click();

    await page.waitForURL(/checkout\.stripe\.com\/c\/pay\/cs_test_nursenest_conversion_audit/, {
      timeout: 30_000,
    });
    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({
      tier: "RN",
      duration: "monthly",
      acceptPolicies: true,
      policyVersion: LEGAL_POLICY_BUNDLE_VERSION,
    });
  });

  test("live Stripe hosted checkout can complete with a test card when explicitly enabled", async ({ page }) => {
    test.skip(
      process.env.E2E_STRIPE_CHECKOUT_ENABLED !== "1",
      "Set E2E_STRIPE_CHECKOUT_ENABLED=1 with Stripe test-mode price env vars to run hosted checkout.",
    );
    const email = process.env.E2E_STRIPE_CHECKOUT_EMAIL?.trim();
    const password = process.env.E2E_STRIPE_CHECKOUT_PASSWORD?.trim();
    test.skip(!email || !password, "Set E2E_STRIPE_CHECKOUT_EMAIL and E2E_STRIPE_CHECKOUT_PASSWORD.");

    await loginWithCredentials(page, email!, password!);
    await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    await page.getByTestId("pricing-segment-rn").click();
    await page.getByTestId("pricing-checkout-monthly").click();
    const modal = page.locator(".nn-pricing-consent-modal");
    await expect(modal).toBeVisible({ timeout: 30_000 });
    for (const checkbox of await modal.locator('input[type="checkbox"]').all()) {
      await checkbox.check();
    }
    await modal.getByRole("button", { name: /continue to secure checkout|continue to north america checkout/i }).click();
    await completeStripeHostedCheckoutTestCard(page, { customerEmail: email! });
    await expect(page).toHaveURL(/\/app.*checkout=success|\/app/i, { timeout: 180_000 });
  });
});
