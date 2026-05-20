import assert from "node:assert/strict";
import { test } from "node:test";

import { logRouteDataPipeline, routeDataDiagnosticsEnabled } from "./route-data-pipeline-log";

test("routeDataDiagnosticsEnabled is false unless ROUTE_DATA_DIAGNOSTICS is set", async (t) => {
  const prev = process.env.ROUTE_DATA_DIAGNOSTICS;
  t.after(() => {
    if (prev === undefined) delete process.env.ROUTE_DATA_DIAGNOSTICS;
    else process.env.ROUTE_DATA_DIAGNOSTICS = prev;
  });
  delete process.env.ROUTE_DATA_DIAGNOSTICS;
  assert.equal(routeDataDiagnosticsEnabled(), false);
  process.env.ROUTE_DATA_DIAGNOSTICS = "1";
  assert.equal(routeDataDiagnosticsEnabled(), true);
});

test("logRouteDataPipeline is a no-op when diagnostics disabled", () => {
  const prev = process.env.ROUTE_DATA_DIAGNOSTICS;
  delete process.env.ROUTE_DATA_DIAGNOSTICS;
  try {
    assert.doesNotThrow(() =>
      logRouteDataPipeline({ route: "/x", stage: "s", meta: { n: 1, b: true, s: "ok" } }),
    );
  } finally {
    if (prev !== undefined) process.env.ROUTE_DATA_DIAGNOSTICS = prev;
  }
});
