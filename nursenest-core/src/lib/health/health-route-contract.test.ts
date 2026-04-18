import assert from "node:assert/strict";
import test from "node:test";
import { GET as getApiHealth } from "../../app/api/health/route";

test("api health remains a diagnostics endpoint", async () => {
  const response = await getApiHealth();
  assert.equal(response.status, 200);

  const body = (await response.json()) as Record<string, unknown>;
  assert.equal(body.ok, true);
  assert.equal(body.live, true);
  assert.equal(body.service, "nursenest-core");
  assert.equal(typeof body.timestamp, "string");
});

test("readyz exposes a minimal readiness contract", async () => {
  const routeModule = await import("../../app/readyz/route");
  assert.equal(typeof routeModule.GET, "function");
  assert.equal(typeof routeModule.HEAD, "function");

  const getResponse = await routeModule.GET();
  assert.equal(getResponse.status, 200);
  assert.equal(await getResponse.text(), "ready");
  assert.equal(getResponse.headers.get("content-type"), "text/plain; charset=utf-8");

  const headResponse = await routeModule.HEAD();
  assert.equal(headResponse.status, 200);
  assert.equal(await headResponse.text(), "");
  assert.equal(headResponse.headers.get("content-type"), "text/plain; charset=utf-8");
});
