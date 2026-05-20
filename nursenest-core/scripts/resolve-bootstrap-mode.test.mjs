import assert from "node:assert/strict";
import test from "node:test";
import { resolveBootstrapStartupMode } from "./resolve-bootstrap-mode.mjs";

test("neither env set → bootstrap_proxy, no readiness bypass", () => {
  const r = resolveBootstrapStartupMode({});
  assert.equal(r.mode, "bootstrap_proxy");
  assert.equal(r.readinessWatchdogBypass, false);
  assert.equal(r.conflictDirectAndBypass, false);
  assert.equal(r.errors.length, 0);
});

test("NN_DIRECT_STANDALONE=1 without NN_ALLOW_DIRECT_STANDALONE → bootstrap_proxy + error", () => {
  const r = resolveBootstrapStartupMode({ NN_DIRECT_STANDALONE: "1" });
  assert.equal(r.mode, "bootstrap_proxy");
  assert.equal(r.errors.length, 1);
  assert.ok(r.errors[0].includes("NN_ALLOW_DIRECT_STANDALONE"));
  assert.equal(r.readinessWatchdogBypass, false);
});

test("NN_DIRECT_STANDALONE=1 + NN_ALLOW_DIRECT_STANDALONE=1 → direct_standalone + warning", () => {
  const r = resolveBootstrapStartupMode({
    NN_DIRECT_STANDALONE: "1",
    NN_ALLOW_DIRECT_STANDALONE: "1",
  });
  assert.equal(r.mode, "direct_standalone");
  assert.equal(r.errors.length, 0);
  assert.ok(r.warnings.some((w) => w.includes("direct_standalone")));
  assert.equal(r.readinessWatchdogBypass, false);
});

test("conflicting NN_DIRECT_STANDALONE and NN_BYPASS_BOOTSTRAP → bootstrap_proxy + error, no readiness bypass", () => {
  const r = resolveBootstrapStartupMode({
    NN_DIRECT_STANDALONE: "true",
    NN_BYPASS_BOOTSTRAP: "1",
    NN_ALLOW_DIRECT_STANDALONE: "1",
  });
  assert.equal(r.mode, "bootstrap_proxy");
  assert.equal(r.conflictDirectAndBypass, true);
  assert.equal(r.errors.length, 1);
  assert.ok(r.errors[0].includes("both set"));
  assert.equal(r.readinessWatchdogBypass, false);
});

test("NN_BYPASS_BOOTSTRAP alone → bootstrap_proxy + deprecation warning + readiness bypass", () => {
  const r = resolveBootstrapStartupMode({ NN_BYPASS_BOOTSTRAP: "1" });
  assert.equal(r.mode, "bootstrap_proxy");
  assert.equal(r.readinessWatchdogBypass, true);
  assert.ok(r.warnings.some((w) => w.includes("deprecated")));
  assert.equal(r.errors.length, 0);
});

test("NN_ALLOW_DIRECT_STANDALONE=1 alone does not enable direct mode", () => {
  const r = resolveBootstrapStartupMode({ NN_ALLOW_DIRECT_STANDALONE: "1" });
  assert.equal(r.mode, "bootstrap_proxy");
});
