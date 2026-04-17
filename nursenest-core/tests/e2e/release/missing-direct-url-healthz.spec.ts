/**
 * **Missing `DIRECT_URL`:** only `DATABASE_URL` is present in the dev-server environment (see
 * `playwright.missing-direct-url.config.ts`). `env-bootstrap` must set `DIRECT_URL` from the pooled URL
 * so Prisma does not fail with a missing `directUrl` env at runtime.
 *
 * - Liveness: `GET /healthz` (fast plain-text, no DB).
 * - Readiness + Prisma: `GET /api/healthz` (same as `/api/health/ready` — bounded `SELECT 1`).
 *
 * **Requires:** `DATABASE_URL` in the shell / `.env.playwright.local` used by Playwright. Fails fast in
 * config if unset.
 *
 * ```
 * npx playwright test -c playwright.missing-direct-url.config.ts
 * ```
 */
import { expect, test } from "@playwright/test";

test.describe("Release — DATABASE_URL without DIRECT_URL (env-bootstrap)", () => {
  test("app boots and Prisma health succeeds on /api/healthz", async ({ request, baseURL }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";

    const live = await request.get(`${origin}/healthz`);
    expect(live.status(), `/healthz → ${live.status()}`).toBe(200);
    const liveBody = await live.text();
    expect(liveBody).toBe("ok");

    const ready = await request.get(`${origin}/api/healthz`);
    expect(ready.status(), `/api/healthz → ${ready.status()}`).toBe(200);
    const body = (await ready.json()) as {
      ok?: boolean;
      database?: string;
      classification?: string;
    };
    expect(body.ok, JSON.stringify(body)).toBe(true);
    expect(body.database).toBe("ok");
    expect(body.classification).toBe("OK");
  });
});
