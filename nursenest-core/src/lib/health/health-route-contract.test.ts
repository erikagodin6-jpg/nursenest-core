import assert from "node:assert/strict";
import test from "node:test";
import { GET as getApiHealth } from "@/app/api/health/route";

test("api health returns a minimal liveness contract", async () => {
  const response = await getApiHealth();
  assert.equal(response.status, 200);

  const body = (await response.json()) as Record<string, unknown>;
  assert.equal(body.ok, true);
  assert.equal(body.live, true);
  assert.equal("memory" in body, false);
  assert.equal("nodeEnv" in body, false);
  assert.equal("timestamp" in body, false);
});

test("healthz supports HEAD for lightweight probes", async () => {
  const routeModule = await import("@/app/healthz/route");
  assert.equal(typeof routeModule.HEAD, "function");

  const response = await routeModule.HEAD();
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "");
});

test("readyz exposes a minimal readiness contract", async () => {
  const routeModule = await import("@/app/readyz/route");
  assert.equal(typeof routeModule.GET, "function");
  assert.equal(typeof routeModule.HEAD, "function");

  const getResponse = await routeModule.GET();
  assert.equal(getResponse.status, 200);
  assert.equal(await getResponse.text(), "ready");

  const headResponse = await routeModule.HEAD();
  assert.equal(headResponse.status, 200);
  assert.equal(await headResponse.text(), "");
});

test("bootstrap private health alias mirrors api health", async () => {
  const routeModule = await import("@/app/_nn_bootstrap_ready_check__/route");
  assert.equal(typeof routeModule.GET, "function");
  assert.equal(typeof routeModule.HEAD, "function");

  const getResponse = await routeModule.GET();
  assert.equal(getResponse.status, 200);
  const body = (await getResponse.json()) as Record<string, unknown>;
  assert.equal(body.ok, true);
  assert.equal(body.live, true);

  const headResponse = await routeModule.HEAD();
  assert.equal(headResponse.status, 200);
  assert.equal(await headResponse.text(), "");
});
