const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");

const {
  childOutputIndicatesReady,
  createStartupWatchdogLogger,
  formatStartupWatchdogLine,
  resolveStandaloneNextModulePath,
} = require("./standalone-startup-watchdog-shared.cjs");
const {
  isBootstrapHealthzRequest,
  maybeServeBootstrapHealthz,
} = require("./standalone-bootstrap-healthz-shared.cjs");

test("formats startup watchdog lines consistently", () => {
  const line = formatStartupWatchdogLine("server_listening", { appUrl: "http://127.0.0.1:8080" });
  assert.equal(
    line,
    '[nursenest-core] startup_watchdog server_listening {"appUrl":"http://127.0.0.1:8080"}',
  );
});

test("records listening and handler readiness timing", () => {
  let now = 1000;
  const lines = [];
  const logger = createStartupWatchdogLogger({
    now: () => now,
    write: (line) => lines.push(line),
  });

  logger.logServerListening({ appUrl: "http://127.0.0.1:8080" });
  now = 1450;
  logger.logHandlersInitStart();
  now = 2100;
  logger.logHandlersReady();

  assert.equal(lines.length, 3);
  assert.match(lines[0], /startup_watchdog server_listening/);
  assert.match(lines[0], /"msSinceBoot":0/);
  assert.match(lines[1], /startup_watchdog handlers_init_start/);
  assert.match(lines[1], /"msSinceListening":450/);
  assert.match(lines[2], /startup_watchdog handlers_ready/);
  assert.match(lines[2], /"msSinceListening":1100/);
});

test("records handler init failures with timing", () => {
  let now = 500;
  const lines = [];
  const logger = createStartupWatchdogLogger({
    now: () => now,
    write: (line) => lines.push(line),
  });

  logger.logServerListening({});
  now = 1300;
  logger.logHandlersInitFailed({ error: "boom" });

  assert.equal(lines.length, 2);
  assert.match(lines[1], /startup_watchdog handlers_init_failed/);
  assert.match(lines[1], /"msSinceListening":800/);
  assert.match(lines[1], /"error":"boom"/);
});

test("resolves standalone next internals from the traced server entry", () => {
  const resolved = resolveStandaloneNextModulePath(
    "/workspace/nursenest-core/.next/standalone/nursenest-core/server.js",
    "dist/server/lib/app-info-log",
  );

  assert.equal(
    resolved,
    "/workspace/nursenest-core/.next/standalone/nursenest-core/node_modules/next/dist/server/lib/app-info-log",
  );
});

test("does not treat Next ready output as handler readiness", () => {
  assert.equal(childOutputIndicatesReady("✓ Ready in 0ms\n"), false);
  assert.equal(childOutputIndicatesReady("noise\n✓ Ready in 123ms\nmore"), false);
  assert.equal(childOutputIndicatesReady("preloading modules"), false);
});

test("bootstrap runtime has no child-log readiness path", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes("child_ready_log"), false);
  assert.equal(source.includes("monitorChildOutputForReadiness"), false);
  assert.equal(source.includes("childOutputIndicatesReady"), false);
});

test("bootstrap runtime probes the private non-api readiness path", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes('const childHealthProbePath = "/_nn_bootstrap_ready_check__";'), true);
  assert.equal(source.includes('const childHealthProbePath = "/api/health";'), false);
});

test("bootstrap runtime probes the child via localhost and emits probe diagnostics", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes('const internalHost = "localhost";'), true);
  assert.equal(source.includes('const internalHost = "127.0.0.1";'), false);
  assert.equal(source.includes('emit("internal_probe_attempt"'), true);
  assert.equal(source.includes('emit("internal_probe_response"'), true);
  assert.equal(source.includes('emit("internal_probe_error"'), true);
});

test("bootstrap runtime serves the internal probe path directly from the parent layer", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes("isBootstrapProbeRequest(req, childHealthProbePath)"), true);
  assert.equal(source.includes('emit("bootstrap_child_probe_intercepted"'), true);
});

test("bootstrap readiness loop probes the bootstrap-served path on the public port", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes("await probeChildHealth(publicPort, attempt)"), true);
});

test("bootstrap runtime never force-marks handlers ready", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes("forcedHandlersReadyFallbackMs"), false);
  assert.equal(source.includes('emit("handlers_ready_forced"'), false);
  assert.equal(source.includes("state.handlersReadyForced"), false);
});

test("child preload recognizes the internal bootstrap ready probe path", () => {
  assert.equal(isBootstrapHealthzRequest({ method: "GET", url: "/_nn_bootstrap_ready_check__" }), true);
  assert.equal(isBootstrapHealthzRequest({ method: "HEAD", url: "/_nn_bootstrap_ready_check__?ts=1" }), true);
});

test("child preload serves the internal bootstrap ready probe directly", () => {
  const headers = new Map();
  const res = {
    statusCode: 0,
    setHeader(name, value) {
      headers.set(name, value);
    },
    end(value) {
      this.body = value;
    },
  };

  const handled = maybeServeBootstrapHealthz(
    { method: "GET", url: "/_nn_bootstrap_ready_check__" },
    res,
    { handlersReady: false },
    null,
  );

  assert.equal(handled, true);
  assert.equal(res.statusCode, 200);
  assert.equal(headers.get("cache-control"), "no-store");
  assert.equal(res.body, "ok");
});
