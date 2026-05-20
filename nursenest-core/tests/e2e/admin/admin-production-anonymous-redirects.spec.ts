/**
 * Opt-in production checks: unauthenticated `GET /admin` must be a redirect to sign-in on each host
 * (validates gate + cookie naming do not regress to a 200 “open” admin shell for guests).
 *
 * From `nursenest-core/`:
 *   E2E_PRODUCTION_ADMIN_HOST_CHECK=1 npx playwright test tests/e2e/admin/admin-production-anonymous-redirects.spec.ts --project=chromium
 *
 * If `nursenest.ca` does not resolve from your network, that row fails — fix DNS or run from a resolver
 * that sees the apex record; www alone is not sufficient to prove apex/www cookie parity for staff.
 */
import { expect, test } from "@playwright/test";

const PRODUCTION_ADMIN_HOSTS = ["https://www.nursenest.ca", "https://nursenest.ca"] as const;

test.describe("Production — anonymous /admin redirect (opt-in)", () => {
  test.skip(
    process.env.E2E_PRODUCTION_ADMIN_HOST_CHECK !== "1",
    "Set E2E_PRODUCTION_ADMIN_HOST_CHECK=1 to run live host probes",
  );

  for (const origin of PRODUCTION_ADMIN_HOSTS) {
    test(`${origin}/admin → login redirect`, async ({ request }) => {
      const res = await request.get(`${origin}/admin`, { maxRedirects: 0, timeout: 45_000 });
      expect(res.status(), `${origin}/admin`).toBeGreaterThanOrEqual(300);
      expect(res.status(), `${origin}/admin`).toBeLessThan(400);
      const loc = res.headers().location ?? "";
      expect(loc).toMatch(/\/login/i);
      expect(loc.toLowerCase()).toMatch(/callbackurl=.*admin|%2fadmin/);
    });
  }
});
