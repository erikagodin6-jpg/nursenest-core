import assert from "node:assert/strict";
import test from "node:test";
import { normalizeBootstrapProbePathname } from "./standalone-bootstrap-probe-pathname.mjs";

test("normalizeBootstrapProbePathname: healthz and readyz variants", () => {
  assert.equal(normalizeBootstrapProbePathname({ url: "/healthz" }), "/healthz");
  assert.equal(normalizeBootstrapProbePathname({ url: "/healthz/" }), "/healthz");
  assert.equal(normalizeBootstrapProbePathname({ url: "/healthz?x=1" }), "/healthz");
  assert.equal(normalizeBootstrapProbePathname({ url: "/readyz" }), "/readyz");
  assert.equal(normalizeBootstrapProbePathname({ url: "/readyz/" }), "/readyz");
  assert.equal(normalizeBootstrapProbePathname({ url: "/readyz?probe=1" }), "/readyz");
  assert.equal(normalizeBootstrapProbePathname({ url: "/readyz/?probe=1" }), "/readyz");
});

test("normalizeBootstrapProbePathname: absolute-form request-target", () => {
  assert.equal(
    normalizeBootstrapProbePathname({ url: "http://example.com:8080/readyz" }),
    "/readyz",
  );
  assert.equal(
    normalizeBootstrapProbePathname({ url: "https://example.com/healthz?z=1" }),
    "/healthz",
  );
});
