/**
 * Crawler-Safe SSR Validation — ECG Authority Pages
 *
 * Validates that all public ECG authority pages behave correctly for unauthenticated
 * requests — as a search engine crawler would see them.
 *
 * Tests run with NO auth cookies, NO session state.
 *
 * Coverage:
 *   1. HTTP 200 with no redirect to login
 *   2. Educational content visible in SSR HTML (not client-only rendered)
 *   3. JSON-LD schema present in <head> before JS execution
 *   4. Canonical <link> tag present and correct
 *   5. No accidental noindex / X-Robots-Tag
 *   6. No soft-403: "sign in to view" blocking wall must not appear
 *   7. Premium CTA is additive — educational content remains visible alongside it
 *   8. No redirect chain to /login, /signup, or /app
 *
 * Run:
 *   npx playwright test tests/e2e/seo/crawler-safe-ssr.spec.ts --project=chromium
 *
 * No auth environment variables required — all tests use empty storage state.
 */

import { expect, test, type APIResponse } from "@playwright/test";
import { getE2eBaseURL } from "../helpers/e2e-env";

const BASE_URL = getE2eBaseURL();

// All public ECG authority pages that must be crawler-safe
const PUBLIC_ECG_ROUTES = [
  { path: "/ecg", expectedH1Fragment: "ECG", premiumCta: false },
  { path: "/ecg-interpretation", expectedH1Fragment: "ECG interpretation", premiumCta: false },
  { path: "/telemetry-nursing", expectedH1Fragment: "Telemetry nursing", premiumCta: false },
  { path: "/acls-rhythms", expectedH1Fragment: "ACLS rhythms", premiumCta: false },
  { path: "/pals-rhythms", expectedH1Fragment: "PALS rhythms", premiumCta: false },
  { path: "/pediatric-ecg", expectedH1Fragment: "Pediatric ECG", premiumCta: false },
  { path: "/advanced-ecg-nursing", expectedH1Fragment: "Advanced ECG", premiumCta: true },
  { path: "/ecg-telemetry-mastery", expectedH1Fragment: "telemetry", premiumCta: true },
] as const;

// ─── Test configuration: no auth state ────────────────────────────────────────
test.use({ storageState: { cookies: [], origins: [] } });

// ─── 1. HTTP 200 — no redirect to login ───────────────────────────────────────

test.describe("ECG authority pages — HTTP 200, no login redirect", () => {
  for (const route of PUBLIC_ECG_ROUTES) {
    test(`GET ${route.path} returns 200 without redirecting`, async ({ request }) => {
      const response = await request.get(`${BASE_URL}${route.path}`, {
        maxRedirects: 0,
      });

      // Must be 200 — not 301, 302, 307, 308 to login
      const status = response.status();
      expect(
        status,
        `${route.path} must return HTTP 200 for unauthenticated requests. ` +
        `Got ${status}. If this is a redirect, check that the route does not require auth.`,
      ).toBe(200);
    });

    test(`GET ${route.path} does not redirect to /login`, async ({ page }) => {
      const finalUrl = await page.goto(`${BASE_URL}${route.path}`, {
        waitUntil: "domcontentloaded",
      });

      const url = finalUrl?.url() ?? page.url();
      expect(
        url,
        `${route.path} must not redirect to /login or /signup. Final URL: ${url}`,
      ).not.toMatch(/\/(login|signup|sign-up|sign-in|auth)/);
    });
  }
});

// ─── 2. SSR content visible without JS ────────────────────────────────────────

test.describe("ECG authority pages — SSR content visible to crawlers", () => {
  for (const route of PUBLIC_ECG_ROUTES) {
    test(`${route.path} renders H1 in SSR HTML (not client-only)`, async ({ request }) => {
      const response = await request.get(`${BASE_URL}${route.path}`);
      const html = await response.text();

      // The H1 must be in the server-rendered HTML — not dependent on client JS
      expect(
        html.toLowerCase(),
        `${route.path} H1 containing "${route.expectedH1Fragment.toLowerCase()}" must be in SSR HTML. ` +
        "If the H1 only renders after client hydration, the page is not crawler-safe.",
      ).toContain(route.expectedH1Fragment.toLowerCase());
    });

    test(`${route.path} has substantive paragraph text in SSR HTML`, async ({ request }) => {
      const response = await request.get(`${BASE_URL}${route.path}`);
      const html = await response.text();

      // Extract rough text length (not a strict content-quality check, just ensures the page
      // isn't returning a shell with no SSR content)
      const paragraphMatches = html.match(/<p[^>]*>[^<]{50,}<\/p>/g) ?? [];
      expect(
        paragraphMatches.length,
        `${route.path} must have substantive paragraph content in SSR HTML. ` +
        "Thin SSR HTML indicates client-only rendering or a placeholder page.",
      ).toBeGreaterThan(0);
    });

    test(`${route.path} does not show 'sign in' blocking wall in SSR HTML`, async ({
      request,
    }) => {
      const response = await request.get(`${BASE_URL}${route.path}`);
      const html = await response.text();
      const lowerHtml = html.toLowerCase();

      // The page must not show a "sign in to view" type wall as the primary content
      // Premium CTAs that say "sign up" are acceptable — full content must also be present
      const hasSignInWall =
        lowerHtml.includes("sign in to view") ||
        lowerHtml.includes("login to access") ||
        lowerHtml.includes("please log in to see") ||
        lowerHtml.includes("authentication required");

      expect(
        hasSignInWall,
        `${route.path} must NOT show a "sign in to view" blocking wall. ` +
        "Public ECG pages must render full educational content without auth.",
      ).toBe(false);
    });
  }
});

// ─── 3. JSON-LD schema in server-rendered HTML ────────────────────────────────

test.describe("ECG authority pages — JSON-LD schema present in SSR", () => {
  for (const route of PUBLIC_ECG_ROUTES) {
    test(`${route.path} has JSON-LD schema in SSR HTML`, async ({ request }) => {
      const response = await request.get(`${BASE_URL}${route.path}`);
      const html = await response.text();

      expect(
        html,
        `${route.path} must include <script type="application/ld+json"> in SSR HTML. ` +
        "Schema must be server-rendered — not injected after hydration.",
      ).toContain('type="application/ld+json"');
    });

    test(`${route.path} JSON-LD contains @context schema.org`, async ({ request }) => {
      const response = await request.get(`${BASE_URL}${route.path}`);
      const html = await response.text();

      expect(
        html,
        `${route.path} JSON-LD must reference schema.org context`,
      ).toContain("schema.org");
    });
  }
});

// ─── 4. Canonical <link> tag ──────────────────────────────────────────────────

test.describe("ECG authority pages — canonical link tags", () => {
  for (const route of PUBLIC_ECG_ROUTES) {
    test(`${route.path} has a canonical link tag`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "domcontentloaded" });

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(
        canonical,
        `${route.path} must have a canonical link tag in the <head>`,
      ).toBeTruthy();

      // Canonical must not point to /login, /signup, or an unrelated page
      expect(
        canonical,
        `${route.path} canonical "${canonical}" must contain the page path`,
      ).toContain(route.path);
    });
  }
});

// ─── 5. No accidental noindex ─────────────────────────────────────────────────

test.describe("ECG authority pages — no accidental noindex", () => {
  for (const route of PUBLIC_ECG_ROUTES) {
    test(`${route.path} does not have noindex in HTML meta or response headers`, async ({
      request,
      page,
    }) => {
      const response = await request.get(`${BASE_URL}${route.path}`);
      const html = await response.text();

      // Check HTML meta robots
      const hasMetaNoindex =
        html.includes('name="robots"') &&
        html.includes("noindex");

      expect(
        hasMetaNoindex,
        `${route.path} must not have <meta name="robots" content="noindex">. ` +
        "This would remove the page from Google's index.",
      ).toBe(false);

      // Check X-Robots-Tag response header
      const xRobotsTag = response.headers()["x-robots-tag"] ?? "";
      expect(
        xRobotsTag.toLowerCase().includes("noindex"),
        `${route.path} X-Robots-Tag header "${xRobotsTag}" must not contain "noindex"`,
      ).toBe(false);
    });
  }
});

// ─── 6. Premium CTA is additive — educational content still visible ───────────

test.describe("ECG premium pages — premium CTA is additive, not gating", () => {
  const premiumRoutes = PUBLIC_ECG_ROUTES.filter((r) => r.premiumCta);

  for (const route of premiumRoutes) {
    test(`${route.path} shows educational content even without auth (premium CTA is additive)`, async ({
      request,
    }) => {
      const response = await request.get(`${BASE_URL}${route.path}`);
      const html = await response.text();

      // Premium pages should still have substantive educational paragraphs
      const paragraphMatches = html.match(/<p[^>]*>[^<]{80,}<\/p>/g) ?? [];
      expect(
        paragraphMatches.length,
        `${route.path} must have educational paragraph content visible without auth. ` +
        "Premium CTA should be additive — educational content must not be hidden.",
      ).toBeGreaterThan(0);

      // Should NOT replace content with a full paywall gate
      const lowerHtml = html.toLowerCase();
      const hasFullPaywall =
        lowerHtml.includes("upgrade to view") ||
        lowerHtml.includes("subscribe to access this content") ||
        lowerHtml.includes("this content requires a subscription");

      expect(
        hasFullPaywall,
        `${route.path} must not show a "content requires subscription" full paywall. ` +
        "Educational content must be visible. Premium CTA is additive.",
      ).toBe(false);
    });
  }
});

// ─── 7. Learner private routes — confirm they are NOT publicly accessible ────

test.describe("ECG learner routes — correctly gated (not publicly crawlable)", () => {
  const PRIVATE_ROUTES = [
    "/modules/ecg",
    "/modules/ecg/basic/lessons",
    "/modules/ecg-advanced",
    "/modules/ecg/pediatric",
  ];

  for (const path of PRIVATE_ROUTES) {
    test(`${path} redirects or returns non-200 without auth (correctly gated)`, async ({
      page,
    }) => {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: "domcontentloaded" });

      // Private route must either redirect away from /modules/ or return an error page
      // It must NOT return a full learner page without auth
      const finalUrl = page.url();
      const isStillOnModulesPage =
        finalUrl.includes(path) && !finalUrl.includes("/login") && !finalUrl.includes("/signup");

      // This is a soft check — if the page is fully accessible without auth, that's
      // a security regression. It should redirect to login or show an auth requirement.
      // We cannot assert a hard redirect here because some paths may show a graceful
      // "not found" page for non-admin users rather than redirecting.
      // The critical requirement is that the page does NOT render the full learner content
      // without auth.
      if (isStillOnModulesPage) {
        // If still on the modules path, it must not show authenticated learner content
        const pageText = await page.locator("body").textContent();
        const hasFullLearnerContent =
          (pageText?.toLowerCase() ?? "").includes("start lesson") &&
          (pageText?.toLowerCase() ?? "").includes("submit answer");

        expect(
          hasFullLearnerContent,
          `${path} must not render full learner content (lessons/quizzes) without auth`,
        ).toBe(false);
      }
    });
  }
});

// ─── 8. Page performance baseline — no blocking render ────────────────────────

test.describe("ECG authority pages — render performance baseline", () => {
  const PERFORMANCE_ROUTES = ["/ecg", "/advanced-ecg-nursing", "/telemetry-nursing"];

  for (const path of PERFORMANCE_ROUTES) {
    test(`${path} DOM content loaded in < 5000ms`, async ({ page }) => {
      const start = Date.now();
      await page.goto(`${BASE_URL}${path}`, { waitUntil: "domcontentloaded" });
      const elapsed = Date.now() - start;

      expect(
        elapsed,
        `${path} took ${elapsed}ms — must load in < 5000ms for acceptable crawler performance`,
      ).toBeLessThan(5000);
    });
  }
});
