/**
 * Release gate: liveness + DB readiness (no auth).
 * @see docs/RELEASE_QA.md
 */
import { expect, test, type APIRequestContext } from "@playwright/test";

async function getOrExplainConnect(request: APIRequestContext, url: string, label: string) {
  try {
    return await request.get(url);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `${label}: cannot reach ${url} (is BASE_URL wrong or the server down?). category=health underlying=${msg}`,
    );
  }
}

test.describe("Release — health APIs", () => {
  test("US RN NCLEX marketing hub overview permanently redirects to /lessons", async ({ request, baseURL }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const url = `${origin}/us/rn/nclex-rn`;
    let r;
    try {
      r = await request.fetch(url, { maxRedirects: 0 });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`RN hub redirect: cannot reach ${url}. category=health underlying=${msg}`);
    }
    expect([301, 308], `expected redirect from obsolete hub, got ${r.status()}`).toContain(r.status());
    const loc = r.headers()["location"] ?? "";
    expect(loc.endsWith("/lessons") || loc.includes("/lessons"), `Location should target /lessons, got ${loc}`).toBeTruthy();
  });

  test("/api/health returns ok (liveness)", async ({ request, baseURL }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const res = await getOrExplainConnect(request, `${origin}/api/health`, "API health (liveness)");
    const status = res.status();
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; live?: boolean };
    expect(
      status,
      `API health (liveness) failed: expected 200 from ${origin}/api/health. status=${status} category=health body=${JSON.stringify(body)}`,
    ).toBe(200);
    expect(
      body.ok === true || body.live === true,
      `API health JSON must signal liveness (ok or live). category=health url=${origin}/api/health body=${JSON.stringify(body)}`,
    ).toBeTruthy();
  });

  test("/api/health/ready (readiness / database)", async ({ request, baseURL }) => {
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const url = `${origin}/api/health/ready`;
    const res = await getOrExplainConnect(request, url, "API readiness");
    const status = res.status();
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; database?: string; error?: string };

    if (status === 503) {
      expect(
        body.ok,
        `API readiness returned 503 — database or dependency not ready. category=health url=${url} body=${JSON.stringify(
          body,
        )} Fix DB connectivity / migrations before deploy.`,
      ).toBeFalsy();
      return;
    }
    expect(
      status,
      `API readiness failed: expected 200 from ${url} when database is reachable. status=${status} category=health body=${JSON.stringify(body)}`,
    ).toBe(200);
    expect(body.ok, `Readiness JSON must set ok=true. url=${url} category=health body=${JSON.stringify(body)}`).toBeTruthy();
  });
});
