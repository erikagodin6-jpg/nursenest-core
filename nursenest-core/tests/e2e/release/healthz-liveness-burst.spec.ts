/**
 * Liveness probe load: `GET /healthz` is a tiny, dependency-free liveness endpoint
 * (`src/app/healthz/route.ts`). This spec only touches `/healthz`, not `/api/health/ready`.
 *
 * ```
 * npx playwright test tests/e2e/release/healthz-liveness-burst.spec.ts --project=chromium
 * ```
 */
import { expect, test } from "@playwright/test";

const HEALTHZ_MAX_MS = 200;
const BURST_COUNT = 10;

test.describe("Release — /healthz liveness burst", () => {
  test(`/healthz × ${BURST_COUNT} rapid: 200 and <${HEALTHZ_MAX_MS}ms each (no DB)`, async ({
    request,
    baseURL,
  }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const url = `${origin}/healthz`;

    const warm = await request.get(url);
    expect(warm.status(), "warmup GET /healthz").toBe(200);
    const warmBody = await warm.text();
    expect(warmBody, "liveness body contract").toBe("ok");

    /** Sequential back-to-back requests — measures each round-trip without parallel load contention (still “rapid”). */
    const timings: { status: number; ms: number }[] = [];
    for (let k = 0; k < BURST_COUNT; k++) {
      const t0 = performance.now();
      const res = await request.get(url);
      const ms = performance.now() - t0;
      timings.push({ status: res.status(), ms });
    }

    for (const row of timings) {
      expect(row.status, `GET /healthz burst status`).toBe(200);
      expect(row.ms, `GET /healthz latency must be < ${HEALTHZ_MAX_MS}ms (got ${row.ms.toFixed(1)}ms)`).toBeLessThan(
        HEALTHZ_MAX_MS,
      );
    }

    const last = await request.get(url);
    expect(last.status()).toBe(200);
    const body = await last.text();
    expect(body).toBe("ok");
  });
});
