import assert from "node:assert/strict";
import test from "node:test";
import { buildHealthProbeLogEntry, HEALTH_STARTUP_LOG_WINDOW_MS } from "@/lib/health/health-probe-log";

test("logs fast successful probes during the startup window", () => {
  const entry = buildHealthProbeLogEntry({
    route: "/healthz",
    status: 200,
    durationMs: 2,
    uptimeMs: HEALTH_STARTUP_LOG_WINDOW_MS - 1,
    slowThresholdMs: 100,
  });

  assert.ok(entry);
  assert.equal(entry.event, "probe_startup");
  assert.equal(entry.meta.route, "/healthz");
  assert.equal(entry.meta.startupWindow, true);
});

test("logs slow successful probes after startup", () => {
  const entry = buildHealthProbeLogEntry({
    route: "/api/health/ready",
    status: 200,
    durationMs: 1800,
    uptimeMs: HEALTH_STARTUP_LOG_WINDOW_MS + 1,
    slowThresholdMs: 1000,
  });

  assert.ok(entry);
  assert.equal(entry.event, "probe_slow");
  assert.equal(entry.meta.slow, true);
});

test("logs failed probes even when they are fast", () => {
  const entry = buildHealthProbeLogEntry({
    route: "/api/health/ready",
    status: 503,
    durationMs: 20,
    uptimeMs: HEALTH_STARTUP_LOG_WINDOW_MS + 1,
    slowThresholdMs: 1000,
    classification: "DB_TIMEOUT",
  });

  assert.ok(entry);
  assert.equal(entry.event, "probe_failed");
  assert.equal(entry.meta.classification, "DB_TIMEOUT");
});

test("skips warm fast successful probes", () => {
  const entry = buildHealthProbeLogEntry({
    route: "/healthz",
    status: 200,
    durationMs: 5,
    uptimeMs: HEALTH_STARTUP_LOG_WINDOW_MS + 1,
    slowThresholdMs: 100,
  });

  assert.equal(entry, null);
});
