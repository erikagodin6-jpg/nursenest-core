/**
 * RN learner routing consolidation — staging regression matrix.
 *
 * @anonymous — no login (marketing + alias redirects)
 * @authenticated — requires paid storage state (setup-paid-auth)
 * @mobile — narrow viewport checks
 */
import { expect, test, type Page } from "@playwright/test";
import {
  expectNotPageNotFound,
  gotoExpectOk,
  requireOrigin,
  seedCaMarketingCookie,
  seedUsMarketingCookie,
} from "../helpers/navigation-e2e";
import { waitForStableLearnerPathname } from "../helpers/redirect-loop-guard";
import {
  followHttpRedirectChain,
  assertNoRedirectLoop,
} from "../helpers/learner-http-redirect-chain";
import {
  learnerCatHubUrl,
  learnerFlashcardsUrl,
  learnerLessonsUrl,
  learnerPracticeAliasUrl,
  learnerPracticeTestsUrl,
} from "../helpers/tier-product-matrix";
import {
  expectPaidLearnerShellReady,
} from "../helpers/paid-learner-shell";
import { learnerShellStudyNavigation } from "../helpers/learner-shell-locators";
import { expectNotLoginUrl } from "../helpers/paid-user-suite";
import { loginWithCredentials } from "../helpers/learner-login";
import {
  attachRnRoutingDiagnostics,
  formatDiagnosticsForFailure,
} from "../helpers/rn-routing-diagnostics";
import {
  getPaidTestCredentials,
  hasPaidTestCredentials,
} from "../helpers/paid-test-credentials";

const US_PATHWAY = "us-rn-nclex-rn";
const CA_PATHWAY = "ca-rn-nclex-rn";

const LEGACY_HREF_DENY = [/\/question-bank(?:\?|$)/i, /^\/lessons(?:\?|$)/i];

function assertNoLegacyMixedTierHrefs(hrefs: string[], context: string) {
  for (const href of hrefs) {
    if (!href) continue;
    const path = href.startsWith("http") ? new URL(href).pathname : href.split("?")[0] ?? href;
    for (const deny of LEGACY_HREF_DENY) {
      expect(deny.test(path), `${context}: legacy mixed-tier href ${href}`).toBe(false);
    }
    expect(href, `${context}: must not deep-link anonymous users into /app`).not.toMatch(/^\/app\//);
  }
}

async function collectVisibleHubCardHrefs(page: Page): Promise<string[]> {
  const cards = page.locator("a.nn-qa-nursing-tier-hub-lessons-card, a.nn-qa-nursing-tier-hub-practice-card");
  const n = await cards.count();
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const h = await cards.nth(i).getAttribute("href");
    if (h) out.push(h);
  }
  return out;
}

async function expectCanonicalMarketingHub(
  page: Page,
  hubPath: string,
  lessonsPattern: RegExp,
  questionsPattern: RegExp,
) {
  await gotoExpectOk(page, hubPath);
  await expectNotPageNotFound(page);
  const lessons = page.locator("a.nn-qa-nursing-tier-hub-lessons-card");
  const practice = page.locator("a.nn-qa-nursing-tier-hub-practice-card");
  await expect(lessons).toBeVisible({ timeout: 60_000 });
  await expect(practice).toBeVisible({ timeout: 30_000 });
  await expect(lessons).toHaveAttribute("href", lessonsPattern);
  await expect(practice).toHaveAttribute("href", questionsPattern);
  const hrefs = await collectVisibleHubCardHrefs(page);
  assertNoLegacyMixedTierHrefs(hrefs, hubPath);
}

async function expectRobotsNoindex(page: Page, expected: boolean) {
  const robots = page.locator('meta[name="robots"]');
  if ((await robots.count()) === 0) {
    if (expected) {
      expect(false, "expected noindex meta on authenticated route").toBe(true);
    }
    return;
  }
  const content = ((await robots.first().getAttribute("content")) ?? "").toLowerCase();
  if (expected) {
    expect(content).toMatch(/noindex/);
  } else {
    expect(content).not.toMatch(/noindex/);
  }
}

async function expectCanonicalLink(page: Page) {
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveCount(1, { timeout: 15_000 });
  const href = await canonical.getAttribute("href");
  expect(href && href.startsWith("http"), "canonical href must be absolute").toBeTruthy();
}

// ── 1. Anonymous marketing ───────────────────────────────────────────────────

test.describe("RN routing @anonymous — marketing hubs", () => {
  test.describe.configure({ retries: 2 });

  test("US RN hub CTAs are pathway-scoped", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await expectCanonicalMarketingHub(
      page,
      "/us/rn/nclex-rn",
      /\/us\/rn\/nclex-rn\/lessons/,
      /\/us\/rn\/nclex-rn\/questions/,
    );
    await expectCanonicalLink(page);
    await expectRobotsNoindex(page, false);
  });

  test("Canada RN hub CTAs are pathway-scoped", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedCaMarketingCookie(page, origin);
    await expectCanonicalMarketingHub(
      page,
      "/canada/rn/nclex-rn",
      /\/canada\/rn\/nclex-rn\/lessons/,
      /\/canada\/rn\/nclex-rn\/questions/,
    );
    await expectCanonicalLink(page);
    await expectRobotsNoindex(page, false);
  });
});

// ── Alias redirects (anonymous OK) ───────────────────────────────────────────

test.describe("RN routing @anonymous — practice aliases", () => {
  for (const alias of ["/app/practice", "/app/cat", "/app/practice-exams"] as const) {
    test(`${alias} → /app/practice-tests or auth gate`, async ({ page, baseURL }) => {
      const origin = requireOrigin(baseURL);
      const url = new URL(`${alias}?pathwayId=${US_PATHWAY}`, origin).toString();
      await page.context().clearCookies();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page
        .waitForURL(
          (u) => {
            const p = new URL(u).pathname;
            return p === "/app/practice-tests" || /\/login/i.test(p);
          },
          { timeout: 45_000 },
        )
        .catch(() => undefined);
      const landed = new URL(page.url());
      const onCanonical = landed.pathname === "/app/practice-tests";
      const onLogin = /\/login/i.test(landed.pathname);
      expect(
        onCanonical || onLogin,
        `anonymous ${alias} must redirect to practice-tests or login — got ${landed.href}`,
      ).toBe(true);
      if (onCanonical) {
        expect(landed.searchParams.get("pathwayId")).toBe(US_PATHWAY);
      }
      expect(landed.pathname).not.toBe(alias);
    });
  }

  test("/app/command-center → login gate (anonymous) or /app when signed in", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.goto(new URL("/app/command-center", origin).toString(), { waitUntil: "domcontentloaded" });
    const landed = new URL(page.url());
    const path = landed.pathname.replace(/\/$/, "") || "/";
    const onLogin = /\/login/i.test(path);
    const onApp = path === "/app";
    expect(onLogin || onApp, `expected /login or /app — got ${landed.href}`).toBe(true);
    if (onApp) {
      await expect(page.locator(".nn-cockpit-command-center")).toHaveCount(0);
    }
  });
});

// ── Authenticated (paid storage state) ───────────────────────────────────────

test.describe("RN routing @authenticated — dashboard and nav", () => {
  test.skip(!hasPaidTestCredentials(), "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD for staging auth tests");

  test("dashboard loads without auth loop", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await waitForStableLearnerPathname(page, { label: "/app dashboard" });
    await expectPaidLearnerShellReady(page, "rn-routing /app");
    await expect(page.locator('[data-testid="learner-shell"]')).toHaveCount(1);
    await expectRobotsNoindex(page, true);
    const hydrationWarn = errors.filter((t) => /hydration|did not match/i.test(t));
    expect(hydrationWarn, `hydration warnings: ${hydrationWarn.join("; ")}`).toHaveLength(0);
  });

  test("command-center redirects to canonical /app @p0", async ({ page }) => {
    const diag = attachRnRoutingDiagnostics(page);
    await page.goto("/app/command-center", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await waitForStableLearnerPathname(page, { label: "command-center → /app" });
    const landed = new URL(page.url());
    expect(landed.pathname.replace(/\/$/, "") || "/").toBe("/app");
    await expect(page.locator('[data-testid="learner-shell"]')).toHaveCount(1);
    await expect(page.locator(".nn-cockpit-command-center")).toHaveCount(0);
    const runtimeErrors = diag.consoleErrors.filter((t) => !/favicon|404.*\.(png|ico)/i.test(t));
    expect(runtimeErrors, formatDiagnosticsForFailure(diag)).toHaveLength(0);
    expect(diag.hydrationWarnings, formatDiagnosticsForFailure(diag)).toHaveLength(0);
  });

  test("account nav has no duplicate Study hub link to /app/command-center @p0", async ({ page }) => {
    await page.goto("/app/account", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    const studyHubLinks = page.locator('aside a[href="/app/command-center"]');
    await expect(studyHubLinks).toHaveCount(0);
  });

  test("learner shell exposes core nav labels once", async ({ page }) => {
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, "rn-routing nav");
    const nav = learnerShellStudyNavigation(page);
    await expect(nav).toBeVisible({ timeout: 30_000 });
    for (const label of [/lessons/i, /practice/i, /flashcards/i, /cat|exams/i]) {
      await expect(nav.getByRole("link", { name: label }).first()).toBeVisible();
    }
  });
});

test.describe("RN routing @authenticated — JWT/session parity", () => {
  test.skip(!hasPaidTestCredentials(), "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

  for (const pathwayId of [US_PATHWAY, CA_PATHWAY] as const) {
    test(`lessons hub stable across refresh (${pathwayId})`, async ({ page, baseURL }) => {
      const url = new URL(learnerLessonsUrl(pathwayId), baseURL ?? "").toString();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await waitForStableLearnerPathname(page, { label: "lessons first load" });
      await page.reload({ waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await waitForStableLearnerPathname(page, { label: "lessons reload" });
      const fresh = await page.context().newPage();
      await fresh.goto(url, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(fresh);
      await fresh.close();
    });

    test(`practice-tests hub stable across refresh (${pathwayId})`, async ({ page, baseURL }) => {
      const url = new URL(learnerPracticeTestsUrl(pathwayId), baseURL ?? "").toString();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await waitForStableLearnerPathname(page, { label: "practice-tests first load" });
      await page.reload({ waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
    });
  }
});

test.describe("RN routing @authenticated — pathway-scoped nav clicks", () => {
  test.skip(!hasPaidTestCredentials(), "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

  async function clickNavAndAssertPathway(page: Page, linkPattern: RegExp, pathwayId: string) {
    const nav = learnerShellStudyNavigation(page);
    const link = nav.getByRole("link", { name: linkPattern }).first();
    await expect(link).toBeVisible({ timeout: 30_000 });
    await link.click();
    await page.waitForLoadState("domcontentloaded");
    expectNotLoginUrl(page);
    const pid = new URL(page.url()).searchParams.get("pathwayId");
    if (pid) expect(pid).toBe(pathwayId);
  }

  test(`US RN nav preserves ${US_PATHWAY}`, async ({ page }) => {
    await page.goto(learnerLessonsUrl(US_PATHWAY), { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, "us nav");
    await clickNavAndAssertPathway(page, /practice/i, US_PATHWAY);
    await clickNavAndAssertPathway(page, /flashcards/i, US_PATHWAY);
  });

  test(`Canada RN nav preserves ${CA_PATHWAY} when entitled`, async ({ page }) => {
    test.skip(process.env.E2E_CA_RN_PATHWAY_ENABLED !== "1", "Paid account not confirmed for CA RN — set E2E_CA_RN_PATHWAY_ENABLED=1");
    await page.goto(learnerLessonsUrl(CA_PATHWAY), { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    const notOnAccount = page.getByText("This study track is not on your account");
    if (await notOnAccount.isVisible().catch(() => false)) {
      test.skip(true, "Staging paid fixture not entitled for ca-rn-nclex-rn");
    }
    await clickNavAndAssertPathway(page, /practice/i, CA_PATHWAY);
  });
});

test.describe("RN routing @authenticated — lessons layout", () => {
  test.skip(!hasPaidTestCredentials(), "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

  test("US lessons hub uses premium module shell and max-w-6xl", async ({ page }) => {
    await page.goto(learnerLessonsUrl(US_PATHWAY), { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expect(page.locator('[data-nn-premium-platform-module="lessons"]')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator(".nn-lesson-layout--triple")).toHaveCount(0);
    await expect(page.locator(".nn-premium-lessons-app-list.max-w-6xl").first()).toBeVisible({ timeout: 60_000 });
  });

  test("CA lessons hub layout when entitled", async ({ page }) => {
    test.skip(process.env.E2E_CA_RN_PATHWAY_ENABLED !== "1", "Set E2E_CA_RN_PATHWAY_ENABLED=1");
    await page.goto(learnerLessonsUrl(CA_PATHWAY), { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expect(page.locator('[data-nn-premium-platform-module="lessons"]')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator(".nn-premium-lessons-app-list.max-w-6xl").first()).toBeVisible({ timeout: 60_000 });
  });
});

// ── Mobile ───────────────────────────────────────────────────────────────────

test.describe("RN routing @anonymous @mobile — marketing hub", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("US RN hub renders on mobile without legacy hrefs", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await seedUsMarketingCookie(page, origin);
    await gotoExpectOk(page, "/us/rn/nclex-rn");
    const hrefs = await collectVisibleHubCardHrefs(page);
    assertNoLegacyMixedTierHrefs(hrefs, "mobile us hub");
  });
});

test.describe("RN routing @authenticated @mobile @pixel — learner shell", () => {
  test.use({ viewport: { width: 412, height: 915 } });
  test.skip(!hasPaidTestCredentials(), "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

  test("bottom nav visible on /app (Pixel 7)", async ({ page }) => {
    await page.goto("/app", { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expect(page.getByRole("navigation", { name: "Learner bottom navigation" })).toBeVisible({
      timeout: 30_000,
    });
  });
});

// ── Session expiry (soft) ────────────────────────────────────────────────────

test.describe("RN routing @anonymous — unauthenticated /app gates", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("/app/lessons shows sign-in or auth gate without learner main", async ({ page, baseURL }) => {
    const origin = requireOrigin(baseURL);
    await page.goto(new URL(learnerLessonsUrl(US_PATHWAY), origin).toString(), {
      waitUntil: "domcontentloaded",
    });
    const onLogin = /\/login/i.test(page.url());
    const gate = page.locator("[data-nn-learner-auth-gate]");
    const signIn = page.getByRole("link", { name: /sign in/i }).first();
    expect(onLogin || (await gate.isVisible().catch(() => false)) || (await signIn.isVisible().catch(() => false))).toBe(
      true,
    );
    await expect(page.locator("#nn-learner-main")).toHaveCount(0);
  });
});

// ── P0: anonymous alias → login callback → canonical after auth ───────────────

test.describe("RN routing @anonymous @post-auth — alias canonicalization @p0", () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test.skip(!hasPaidTestCredentials(), "Requires setup-paid-auth + E2E_PAID_* for post-login assertion");

  for (const alias of ["/app/practice", "/app/cat", "/app/practice-exams"] as const) {
    test(`${alias} callbackUrl preserved → practice-tests after login`, async ({ page, baseURL }) => {
      const origin = requireOrigin(baseURL);
      const creds = getPaidTestCredentials();
      if (!creds) test.skip();

      const start = new URL(`${alias}?pathwayId=${US_PATHWAY}`, origin).toString();
      await page.context().clearCookies();
      await page.goto(start, { waitUntil: "domcontentloaded" });
      await page
        .waitForURL(
          (url) => {
            const p = new URL(url).pathname;
            return (
              /\/login/i.test(p) ||
              p === "/app/practice-tests" ||
              p.replace(/\/$/, "") === alias.replace(/\/$/, "")
            );
          },
          { timeout: 45_000 },
        )
        .catch(() => undefined);

      const landed = new URL(page.url());
      const onLogin = /\/login/i.test(landed.pathname);
      const alreadyCanonical =
        landed.pathname === "/app/practice-tests" &&
        landed.searchParams.get("pathwayId") === US_PATHWAY;

      expect(
        onLogin || alreadyCanonical,
        `anonymous ${alias} must gate to login or redirect to practice-tests — got ${page.url()}`,
      ).toBe(true);

      if (onLogin) {
        const loginHref = page.url();
        expect(loginHref.toLowerCase()).toMatch(/callbackurl/);
        await loginWithCredentials(page, creds!.email, creds!.password, {
          loginUrl: `${new URL(loginHref).pathname}${new URL(loginHref).search}`,
          navigationOrigin: origin,
          enterLearnerApp: false,
        });
      } else if (!alreadyCanonical) {
        await loginWithCredentials(page, creds!.email, creds!.password, {
          navigationOrigin: origin,
          enterLearnerApp: false,
        });
      }

      await page.waitForURL(
        (url) => new URL(url).pathname === "/app/practice-tests",
        { timeout: 90_000 },
      );
      const final = new URL(page.url());
      expect(final.pathname).toBe("/app/practice-tests");
      expect(final.searchParams.get("pathwayId")).toBe(US_PATHWAY);
      expect(final.pathname).not.toBe(alias.replace(/^\//, ""));
      await expect(page.locator('[data-testid="learner-shell"]')).toHaveCount(1);
    });
  }
});

// ── P0: JWT/session parity stress (10×) ──────────────────────────────────────

test.describe("RN routing @authenticated — JWT/session parity stress @p0", () => {
  test.skip(!hasPaidTestCredentials(), "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");
  test.describe.configure({ timeout: 600_000 });

  async function stressRoute(page: Page, path: string, label: string) {
    const diag = attachRnRoutingDiagnostics(page);
    for (let i = 0; i < 10; i++) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await waitForStableLearnerPathname(page, { label: `${label} iter ${i + 1} load` });
      await page.reload({ waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await waitForStableLearnerPathname(page, { label: `${label} iter ${i + 1} reload` });
      const tab = await page.context().newPage();
      await tab.goto(path, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(tab);
      await tab.close();
      await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => undefined);
      await page.goForward({ waitUntil: "domcontentloaded" }).catch(() => undefined);
    }
    expect(diag.hydrationWarnings, formatDiagnosticsForFailure(diag)).toHaveLength(0);
  }

  test(`US lessons 10× refresh/tab/back-forward (${US_PATHWAY})`, async ({ page }) => {
    await stressRoute(page, learnerLessonsUrl(US_PATHWAY), "lessons");
  });

  test(`US practice-tests 10× refresh/tab (${US_PATHWAY})`, async ({ page }) => {
    await stressRoute(page, learnerPracticeTestsUrl(US_PATHWAY), "practice-tests");
  });
});

// ── Pathway propagation from /app ────────────────────────────────────────────

test.describe("RN routing @authenticated — dashboard nav propagation", () => {
  test.skip(!hasPaidTestCredentials(), "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

  async function assertNavPreservesPathway(page: Page, pathwayId: string) {
    await page.goto(`/app?pathwayId=${encodeURIComponent(pathwayId)}`, { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expectPaidLearnerShellReady(page, "dashboard nav");
    const nav = learnerShellStudyNavigation(page);
    const checks: Array<{ pattern: RegExp; pathHint: RegExp }> = [
      { pattern: /lessons/i, pathHint: /\/app\/lessons/ },
      { pattern: /practice/i, pathHint: /\/app\/practice/ },
      { pattern: /flashcards/i, pathHint: /\/app\/flashcards/ },
      { pattern: /cat|exams/i, pathHint: /\/app\/practice-tests/ },
      { pattern: /progress|reports/i, pathHint: /\/app\/account\/progress/ },
    ];
    for (const { pattern, pathHint } of checks) {
      const link = nav.getByRole("link", { name: pattern }).first();
      await expect(link).toBeVisible({ timeout: 30_000 });
      await link.click();
      await page.waitForLoadState("domcontentloaded");
      expectNotLoginUrl(page);
      expect(new URL(page.url()).pathname).toMatch(pathHint);
      const pid = new URL(page.url()).searchParams.get("pathwayId");
      if (pid) expect(pid).toBe(pathwayId);
      await page.goto(`/app?pathwayId=${encodeURIComponent(pathwayId)}`, { waitUntil: "domcontentloaded" });
    }
  }

  test(`US RN nav preserves ${US_PATHWAY}`, async ({ page }) => {
    await assertNavPreservesPathway(page, US_PATHWAY);
  });

  test(`Canada RN nav preserves ${CA_PATHWAY} when entitled`, async ({ page }) => {
    test.skip(process.env.E2E_CA_RN_PATHWAY_ENABLED !== "1", "Set E2E_CA_RN_PATHWAY_ENABLED=1 or E2E_CA_PAID_*");
    await assertNavPreservesPathway(page, CA_PATHWAY);
  });
});

// ── CA-only project (dedicated CA entitled account) ────────────────────────────

test.describe("RN routing @ca-only — Canada entitlement", () => {
  test(`CA lessons + practice-tests load (${CA_PATHWAY})`, async ({ page }) => {
    for (const path of [learnerLessonsUrl(CA_PATHWAY), learnerPracticeTestsUrl(CA_PATHWAY)]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      expectNotLoginUrl(page);
      await waitForStableLearnerPathname(page, { label: `ca ${path}` });
      expect(new URL(page.url()).searchParams.get("pathwayId")).toBe(CA_PATHWAY);
      await expect(page.locator('[data-testid="learner-shell"]')).toHaveCount(1);
    }
  });
});

// ── HTTP redirect contracts ──────────────────────────────────────────────────

test.describe("RN routing @http — learner redirect contracts", () => {
  test.skip(!hasPaidTestCredentials(), "Requires authenticated storage state");

  const cases = [
    { input: "/app/command-center", expectedPath: "/app", preserveQuery: false },
    { input: `/app/practice?pathwayId=${US_PATHWAY}`, expectedPath: "/app/practice-tests", preserveQuery: true },
    { input: `/app/cat?pathwayId=${US_PATHWAY}`, expectedPath: "/app/practice-tests", preserveQuery: true },
    { input: `/app/practice-exams?pathwayId=${US_PATHWAY}`, expectedPath: "/app/practice-tests", preserveQuery: true },
  ] as const;

  for (const { input, expectedPath, preserveQuery } of cases) {
    test(`HTTP ${input} → ${expectedPath}`, async ({ request, baseURL }) => {
      const origin = requireOrigin(baseURL);
      const start = new URL(input, origin).toString();
      const chain = await followHttpRedirectChain(request, start);
      assertNoRedirectLoop(chain.hops, input);
      const finalPath = new URL(chain.finalUrl).pathname.replace(/\/$/, "") || "/";
      expect(finalPath).toBe(expectedPath);
      if (preserveQuery) {
        expect(new URL(chain.finalUrl).searchParams.get("pathwayId")).toBe(US_PATHWAY);
      }
      const aliasStillPresent = chain.hops.some((h) => {
        try {
          const p = new URL(h.location ?? h.from).pathname;
          return p === "/app/practice" || p === "/app/cat" || p === "/app/practice-exams";
        } catch {
          return false;
        }
      });
      if (expectedPath === "/app/practice-tests") {
        expect(aliasStillPresent || finalPath === "/app/practice-tests").toBe(true);
      }
    });
  }
});

// ── Mobile: iPhone 14 + Pixel 7 ──────────────────────────────────────────────

test.describe("RN routing @authenticated @mobile @iphone — learner shell", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test.skip(!hasPaidTestCredentials(), "Set E2E_PAID_EMAIL + E2E_PAID_PASSWORD");

  test("bottom nav + pathway on lessons (iPhone 14)", async ({ page }) => {
    await page.goto(learnerLessonsUrl(US_PATHWAY), { waitUntil: "domcontentloaded" });
    expectNotLoginUrl(page);
    await expect(page.getByRole("navigation", { name: "Learner bottom navigation" })).toBeVisible({
      timeout: 30_000,
    });
    const navCount = await page.getByRole("navigation", { name: /Learner (bottom|primary)/i }).count();
    expect(navCount).toBeLessThanOrEqual(2);
    expect(new URL(page.url()).searchParams.get("pathwayId")).toBe(US_PATHWAY);
  });
});
