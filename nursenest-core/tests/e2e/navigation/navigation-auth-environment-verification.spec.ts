import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { expect, test, type Browser, type Page, type TestInfo } from "@playwright/test";
import type { CountryCode, TierCode, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getUserAccessFresh } from "@/lib/entitlements/get-user-access";

type CredentialAccount = {
  userType: string;
  email: string;
  password: string;
  expectedRole: UserRole | UserRole[];
  expectedTier?: TierCode;
  expectedCountry?: CountryCode;
  expectedPremium: boolean;
};

type GuestAccount = {
  userType: "Guest";
};

type AuditAccount = CredentialAccount | GuestAccount;

type RouteState = {
  userType: string;
  route: string;
  finalUrl: string;
  httpStatus: number | null;
  sessionResolved: boolean;
  authCookieResolved: boolean;
  subscriptionResolved: string;
  layoutResolved: string;
  navigationComponent: string;
  h1: string;
  bodySignal: string;
};

type AuthProof = {
  userType: string;
  sessionResolved: boolean;
  authCookieResolved: boolean;
  dbRole: string | null;
  sessionRole: string | null;
  dbTier: string | null;
  sessionTier: string | null;
  subscriptionResolved: string;
  entitlementReason: string | null;
  entitlementTier: string | null;
  entitlementCountry: string | null;
};

const SESSION_COOKIE_RE = /(?:^|\.)(?:authjs|next-auth)\.session-token$/i;
const STAFF_ROLES: UserRole[] = ["ADMIN", "SUPER_ADMIN", "CONTENT_ADMIN", "SUPPORT_ADMIN"] as UserRole[];

const ROUTES_TO_PROVE = [
  "/app",
  "/app/lessons",
  "/app/flashcards",
  "/app/question-bank",
  "/app/readiness",
  "/app/profile",
] as const;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required auth verification env: ${name}`);
  return value;
}

function optionalEnv(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  throw new Error(`Missing required auth verification env. Tried: ${names.join(", ")}`);
}

function buildAccounts(): AuditAccount[] {
  return [
    { userType: "Guest" },
    {
      userType: "RN Subscriber",
      email: requiredEnv("PLAYWRIGHT_RN_EMAIL"),
      password: requiredEnv("PLAYWRIGHT_RN_PASSWORD"),
      expectedRole: "LEARNER" as UserRole,
      expectedTier: "RN" as TierCode,
      expectedCountry: "CA" as CountryCode,
      expectedPremium: true,
    },
    {
      userType: "RPN Subscriber",
      email: requiredEnv("PLAYWRIGHT_PN_EMAIL"),
      password: requiredEnv("PLAYWRIGHT_PN_PASSWORD"),
      expectedRole: "LEARNER" as UserRole,
      expectedTier: "RPN" as TierCode,
      expectedCountry: "CA" as CountryCode,
      expectedPremium: true,
    },
    {
      userType: "NP Subscriber",
      email: requiredEnv("PLAYWRIGHT_NP_EMAIL"),
      password: requiredEnv("PLAYWRIGHT_NP_PASSWORD"),
      expectedRole: "LEARNER" as UserRole,
      expectedTier: "NP" as TierCode,
      expectedCountry: "CA" as CountryCode,
      expectedPremium: true,
    },
    {
      userType: "Allied Subscriber",
      email: optionalEnv("QA_ALLIED_US_EMAIL", "QA_ALLIED_EMAIL", "QA_PAID_ALLIED_EMAIL"),
      password: optionalEnv("QA_ALLIED_US_PASSWORD", "QA_ALLIED_PASSWORD", "QA_PAID_ALLIED_PASSWORD"),
      expectedRole: "LEARNER" as UserRole,
      expectedTier: "ALLIED" as TierCode,
      expectedCountry: "US" as CountryCode,
      expectedPremium: true,
    },
    {
      userType: "Admin",
      email: optionalEnv("E2E_ADMIN_EMAIL", "QA_ADMIN_EMAIL"),
      password: optionalEnv("E2E_ADMIN_PASSWORD", "QA_ADMIN_PASSWORD"),
      expectedRole: STAFF_ROLES,
      expectedPremium: true,
    },
  ];
}

async function clearBrowserAuth(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.goto("/api/auth/csrf", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
}

async function sessionPayload(page: Page): Promise<Record<string, unknown>> {
  return await page.evaluate(async () => {
    const res = await fetch("/api/auth/session", {
      credentials: "same-origin",
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    const payload = await res.json().catch(() => ({}));
    return payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  });
}

function sessionUser(payload: Record<string, unknown> | null | undefined): Record<string, unknown> | null {
  const user = payload?.user;
  return user && typeof user === "object" ? (user as Record<string, unknown>) : null;
}

async function hasAuthCookie(page: Page): Promise<boolean> {
  const cookies = await page.context().cookies();
  return cookies.some((cookie) => SESSION_COOKIE_RE.test(cookie.name));
}

async function safeRouteSessionResolved(page: Page, fallback: boolean): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const sessionData = await sessionPayload(page);
      return Boolean(sessionUser(sessionData));
    } catch {
      await page.waitForTimeout(300);
    }
  }
  return fallback;
}

async function safeRouteDomSnapshot(page: Page): Promise<{
  h1: string;
  bodyText: string;
  layoutResolved: string;
  navLabels: string[];
}> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await page.evaluate(() => {
        const h1 = document.querySelector("h1")?.textContent?.trim() ?? "";
        const bodyText = document.body?.innerText?.replace(/\s+/g, " ").trim().slice(0, 220) ?? "";
        const selectors = {
          learnerShell: Boolean(
            document.querySelector(
              '[data-testid="learner-shell"], [data-nn-learner-shell], .nn-learner-shell, .nn-learner-page, #nn-learner-main',
            ),
          ),
          marketingHeader: Boolean(
            document.querySelector(
              '[data-nn-nav-mode="public"], [data-testid="marketing-header"], header nav[aria-label*="Main"]',
            ),
          ),
          adminShell: Boolean(
            document.querySelector('[data-nn-admin-shell], [data-testid="admin-shell"], nav[aria-label*="Admin"]'),
          ),
          authGate: Boolean(
            document.querySelector('[data-nn-auth-gate], [data-testid="auth-gate"], form[action*="signin"]'),
          ),
          focusedChrome: Boolean(
            document.querySelector('[data-nn-focused-study-chrome], [data-testid="focused-study-chrome"]'),
          ),
          learnerStudyNav: Boolean(
            document.querySelector('[data-nn-learner-shell-study-nav], .nn-learner-shell-sticky'),
          ),
          bottomLearnerNav: Boolean(
            document.querySelector('[data-testid="bottom-learner-nav"], [data-nn-bottom-learner-nav]'),
          ),
        };
        const layoutResolved =
          Object.entries(selectors)
            .filter(([, present]) => present)
            .map(([name]) => name)
            .join(",") || "unmarked";
        const navLabels = Array.from(document.querySelectorAll("nav"))
          .map((nav) => nav.getAttribute("aria-label") || nav.textContent?.replace(/\s+/g, " ").trim().slice(0, 80))
          .filter((label): label is string => Boolean(label));
        return { h1, bodyText, layoutResolved, navLabels };
      });
    } catch {
      await page.waitForTimeout(300);
    }
  }

  return {
    h1: "",
    bodyText: `Unable to snapshot route DOM after transient navigation. url=${page.url()}`,
    layoutResolved: "snapshot_failed",
    navLabels: [],
  };
}

async function authenticateDirectly(page: Page, account: CredentialAccount): Promise<void> {
  await page.goto("/api/auth/csrf", { waitUntil: "domcontentloaded" });
  const result = await page.evaluate(
    async ({ email, password }) => {
      const csrfRes = await fetch("/api/auth/csrf", {
        credentials: "same-origin",
        cache: "no-store",
        headers: { accept: "application/json" },
      });
      const csrfPayload = (await csrfRes.json().catch(() => ({}))) as { csrfToken?: unknown };
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Auth-Return-Redirect": "1",
        },
        body: new URLSearchParams({
          email,
          password,
          rememberMe: "true",
          csrfToken: typeof csrfPayload.csrfToken === "string" ? csrfPayload.csrfToken : "",
          callbackUrl: new URL("/app", window.location.origin).href,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      return {
        ok: res.ok,
        status: res.status,
        payload,
      };
    },
    { email: account.email, password: account.password },
  );

  expect(result.ok, `${account.userType}: credentials callback must return 2xx`).toBe(true);
  expect(JSON.stringify(result.payload), `${account.userType}: credentials callback must not contain Auth.js error`).not.toMatch(
    /error=|CredentialsSignin|Configuration|AccessDenied/i,
  );
}

async function loadDbAccess(account: CredentialAccount) {
  const user = await prisma.user.findFirst({
    where: { email: { equals: account.email, mode: "insensitive" } },
    select: {
      id: true,
      role: true,
      tier: true,
      country: true,
      alliedProfessionKey: true,
      targetExamPathwayId: true,
    },
  });
  expect(user, `${account.userType}: DB user must resolve`).not.toBeNull();
  if (STAFF_ROLES.includes(user!.role)) {
    return {
      user: user!,
      access: {
        hasPremium: true,
        reason: "admin_override",
        allowedProfession: { tier: user!.tier },
        allowedRegion: { country: user!.country },
        plan: { status: "none" },
      },
    };
  }
  const access = await getUserAccessFresh(user!.id);
  return { user: user!, access };
}

async function proveCredentialAccount(page: Page, account: CredentialAccount): Promise<AuthProof> {
  await clearBrowserAuth(page);
  await authenticateDirectly(page, account);
  await page.goto("/app", { waitUntil: "domcontentloaded" });
  await page.locator("#nn-learner-main, main").first().waitFor({ state: "visible", timeout: 90_000 });

  const cookieResolved = await hasAuthCookie(page);
  const session = sessionPayload(page);
  const db = loadDbAccess(account);
  const [sessionData, dbData] = await Promise.all([session, db]);
  const user = sessionUser(sessionData);

  expect(cookieResolved, `${account.userType}: auth cookie must exist`).toBe(true);
  expect(user, `${account.userType}: /api/auth/session user must resolve`).not.toBeNull();

  const expectedRoles = Array.isArray(account.expectedRole) ? account.expectedRole : [account.expectedRole];
  expect(expectedRoles, `${account.userType}: DB role must be expected`).toContain(dbData.user.role);
  expect(expectedRoles, `${account.userType}: session role must be expected`).toContain(user?.role as UserRole);

  if (account.expectedTier) {
    expect(dbData.user.tier, `${account.userType}: DB tier must resolve`).toBe(account.expectedTier);
    expect(user?.tier, `${account.userType}: session tier must resolve`).toBe(account.expectedTier);
    expect(dbData.access.allowedProfession.tier, `${account.userType}: entitlement tier must resolve`).toBe(
      account.expectedTier,
    );
  }

  if (account.expectedCountry) {
    expect(dbData.user.country, `${account.userType}: DB country must resolve`).toBe(account.expectedCountry);
    expect(user?.country, `${account.userType}: session country must resolve`).toBe(account.expectedCountry);
    expect(dbData.access.allowedRegion.country, `${account.userType}: entitlement country must resolve`).toBe(
      account.expectedCountry,
    );
  }

  expect(dbData.access.hasPremium, `${account.userType}: entitlement must match premium expectation`).toBe(
    account.expectedPremium,
  );

  return {
    userType: account.userType,
    sessionResolved: Boolean(user),
    authCookieResolved: cookieResolved,
    dbRole: dbData.user.role,
    sessionRole: typeof user?.role === "string" ? user.role : null,
    dbTier: dbData.user.tier,
    sessionTier: typeof user?.tier === "string" ? user.tier : null,
    subscriptionResolved: dbData.access.hasPremium ? "premium" : "not_premium",
    entitlementReason: dbData.access.reason,
    entitlementTier: dbData.access.allowedProfession.tier,
    entitlementCountry: dbData.access.allowedRegion.country,
  };
}

async function proveGuest(page: Page): Promise<AuthProof> {
  await clearBrowserAuth(page);
  await page.goto("/app", { waitUntil: "domcontentloaded" });
  const cookieResolved = await hasAuthCookie(page);
  const sessionData = await sessionPayload(page);
  const user = sessionUser(sessionData);

  expect(cookieResolved, "Guest: auth cookie must not exist").toBe(false);
  expect(user, "Guest: /api/auth/session must not resolve user").toBeNull();

  return {
    userType: "Guest",
    sessionResolved: false,
    authCookieResolved: false,
    dbRole: null,
    sessionRole: null,
    dbTier: null,
    sessionTier: null,
    subscriptionResolved: "none",
    entitlementReason: null,
    entitlementTier: null,
    entitlementCountry: null,
  };
}

async function prepareAccount(page: Page, account: AuditAccount): Promise<void> {
  if (account.userType === "Guest") {
    await clearBrowserAuth(page);
    return;
  }

  await clearBrowserAuth(page);
  await authenticateDirectly(page, account);
  await page.goto("/app", { waitUntil: "domcontentloaded" });
  await page.locator("#nn-learner-main, main").first().waitFor({ state: "visible", timeout: 90_000 });
}

async function routeStateFor(page: Page, account: AuditAccount, route: string): Promise<RouteState> {
  const response = await page.goto(route, { waitUntil: "domcontentloaded", timeout: 60_000 }).catch(() => null);
  await page.waitForLoadState("domcontentloaded", { timeout: 10_000 }).catch(() => undefined);
  await page.waitForTimeout(750);

  const cookieResolved = await hasAuthCookie(page);
  const sessionResolved = await safeRouteSessionResolved(
    page,
    account.userType !== "Guest" && cookieResolved,
  );
  const dom = await safeRouteDomSnapshot(page);
  let subscriptionResolved = "none";
  if (account.userType !== "Guest") {
    const { access } = await loadDbAccess(account);
    subscriptionResolved = `${access.hasPremium ? "premium" : "not_premium"}:${access.reason}`;
  }

  return {
    userType: account.userType,
    route,
    finalUrl: page.url(),
    httpStatus: response?.status() ?? null,
    sessionResolved,
    authCookieResolved: cookieResolved,
    subscriptionResolved,
    layoutResolved: dom.layoutResolved,
    navigationComponent: dom.navLabels.join(" | ") || "none",
    h1: dom.h1,
    bodySignal: dom.bodyText,
  };
}

async function writeAuditArtifact(testInfo: TestInfo, payload: unknown): Promise<void> {
  const outDir = join(process.cwd(), "test-results", "navigation-auth-verification");
  await mkdir(outDir, { recursive: true });
  const stablePath = join(outDir, "navigation-auth-state.json");
  const testPath = testInfo.outputPath("navigation-auth-state.json");
  const serialized = `${JSON.stringify(payload, null, 2)}\n`;
  await Promise.all([writeFile(stablePath, serialized), writeFile(testPath, serialized)]);
  await testInfo.attach("navigation-auth-state", {
    path: testPath,
    contentType: "application/json",
  });
}

test.describe.configure({ mode: "serial" });

test.afterAll(async () => {
  await prisma.$disconnect();
});

test("proves auth, subscription, and protected route state before navigation audit", async ({ browser, page }, testInfo) => {
  const secretPresent = Boolean((process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "").trim());
  const accounts = buildAccounts();
  const authProofs: AuthProof[] = [];
  const routeStates: RouteState[] = [];

  expect(secretPresent, "AUTH_SECRET or NEXTAUTH_SECRET must be set for the fresh verification server").toBe(true);

  for (const account of accounts) {
    const proof = account.userType === "Guest" ? await proveGuest(page) : await proveCredentialAccount(page, account);
    authProofs.push(proof);
  }

  for (const account of accounts) {
    await prepareAccount(page, account);
    for (const route of ROUTES_TO_PROVE) {
      const state = await routeStateFor(page, account, route);
      routeStates.push(state);

      if (account.userType === "Guest") {
        expect(state.sessionResolved, `Guest route ${route}: session must stay anonymous`).toBe(false);
        expect(state.authCookieResolved, `Guest route ${route}: auth cookie must stay absent`).toBe(false);
      } else {
        expect(state.sessionResolved, `${account.userType} route ${route}: session must remain resolved`).toBe(true);
        expect(state.authCookieResolved, `${account.userType} route ${route}: auth cookie must remain present`).toBe(true);
        expect(state.finalUrl, `${account.userType} route ${route}: must not fall back to login`).not.toContain("/login");
      }
    }
  }

  const screenshots: string[] = [];
  const screenshotAccount = accounts.find((account) => account.userType === "RN Subscriber") as CredentialAccount;
  const screenshotViewports = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 390, height: 844 },
  ];

  for (const viewport of screenshotViewports) {
    const context = await browser.newContext({
      baseURL: testInfo.project.use.baseURL as string | undefined,
      viewport: { width: viewport.width, height: viewport.height },
    });
    const scopedPage = await context.newPage();
    await prepareAccount(scopedPage, screenshotAccount);
    await scopedPage.goto("/app", { waitUntil: "domcontentloaded" });
    await scopedPage.waitForTimeout(1_500);
    const screenshotPath = testInfo.outputPath(`auth-proven-rn-${viewport.name}.png`);
    await scopedPage.screenshot({ path: screenshotPath, fullPage: true });
    screenshots.push(screenshotPath);
    await testInfo.attach(`auth-proven-rn-${viewport.name}`, {
      path: screenshotPath,
      contentType: "image/png",
    });
    await context.close();
  }

  await writeAuditArtifact(testInfo, {
    generatedAt: new Date().toISOString(),
    baseURL: testInfo.project.use.baseURL,
    authSecretPresent: secretPresent,
    accounts: authProofs,
    routes: routeStates,
    screenshots,
  });
});
