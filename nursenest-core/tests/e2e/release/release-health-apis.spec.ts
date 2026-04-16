/**
 * Release gate: liveness + DB readiness (no auth).
 * @see docs/RELEASE_QA.md
 */
import { expect, test } from "@playwright/test";

test.describe("Release — health APIs", () => {
  test("/api/health returns ok (liveness)", async ({ request, baseURL }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const res = await request.get(`${origin}/api/health`);
    expect(res.status(), "/api/health must be 200").toBe(200);
    const body = (await res.json()) as { ok?: boolean; live?: boolean };
    expect(body.ok === true || body.live === true, "JSON must indicate liveness").toBeTruthy();
  });

  test("/api/health/ready (readiness)", async ({ request, baseURL }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const res = await request.get(`${origin}/api/health/ready`);
    const status = res.status();
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; database?: string };

    if (status === 503) {
      expect(body.ok, "ready 503 must explain DB failure").toBeFalsy();
      return;
    }
    expect(status, "/api/health/ready must be 200 when database is reachable").toBe(200);
    expect(body.ok, "ready JSON ok").toBeTruthy();
  });
});
