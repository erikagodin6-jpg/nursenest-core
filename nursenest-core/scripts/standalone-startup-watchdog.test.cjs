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

test("bootstrap runtime probes the lightweight internal bootstrap path", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes('const childBootstrapProbePath = "/_nn_bootstrap_ready_check__";'), true);
  assert.equal(source.includes("const childHealthProbePath = childBootstrapProbePath;"), true);
  assert.equal(source.includes('const childHealthProbePath = "/api/health";'), false);
});

test("bootstrap runtime reuses verifier-based standalone entry resolution with nested-first fallback", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes('from "./verify-standalone-artifact.mjs"'), true);
  assert.equal(source.includes("verifyStandaloneArtifact(pkgRoot)"), true);
});

test("bootstrap runtime probes the child via the internal loopback host and emits probe diagnostics", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes('const internalHost = "127.0.0.1";'), true);
  assert.equal(source.includes('const internalHost = "localhost";'), false);
  assert.equal(source.includes('emit("internal_probe_attempt"'), true);
  assert.equal(source.includes('emit("internal_probe_response"'), true);
  assert.equal(source.includes('emit("internal_probe_error"'), true);
});

test("bootstrap runtime serves the internal probe path directly from the parent layer", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes('emit("bootstrap_child_probe_intercepted"'), false);
  assert.equal(source.includes("serveProbeOk(req, res)"), false);
});

test("bootstrap readiness loop probes the child path on the internal port", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes("await probeChildHealth(internalPort, attempt)"), true);
  assert.equal(source.includes("await probeChildHealth(publicPort, attempt)"), false);
});

test("bootstrap timeout and readyz re-probe both target the internal port", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes("formatReadinessFailure({"), true);
  assert.equal(source.includes("probeUrl: childHealthProbeUrl(publicPort)"), false);
  assert.equal(source.includes("await probeChildHealth(internalPort, attempt)"), true);
  assert.equal(source.includes("await probeChildHealth(publicPort, attempt)"), false);
});

test("bootstrap readiness loop has a bounded attempt cap before terminal failure", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes("const bootstrapReadyMaxAttempts ="), true);
  assert.equal(source.includes('process.env.NN_BOOTSTRAP_READY_MAX_ATTEMPTS ?? "120"'), true);
  assert.equal(source.includes("if (attempt >= bootstrapReadyMaxAttempts)"), true);
  assert.equal(source.includes('emit("internal_probe_exhausted"'), true);
  assert.equal(source.includes('reason: "attempt_cap"'), true);
  assert.equal(source.includes("detail,"), true);
});

test("bootstrap readiness loop still has a timeout-based terminal failure with detailed child state", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes("if (Date.now() - startedAt > bootstrapReadyTimeoutMs)"), true);
  assert.equal(source.includes('reason: "timeout"'), true);
  assert.equal(source.includes("probeUrl="), true);
  assert.equal(source.includes("timeoutMs="), true);
  assert.equal(source.includes("childState="), true);
});

test("bootstrap readiness loop still marks handlers ready on successful probe", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes('markHandlersReady("internal_probe")'), true);
});

test("bootstrap readiness exhaustion follows the deterministic shutdown path", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes('emit("handlers_init_failed"'), true);
  assert.equal(source.includes('child.kill("SIGTERM")'), true);
  assert.equal(source.includes("await new Promise((resolve) => server.close(resolve));"), true);
  assert.equal(source.includes("process.exit(1);"), true);
});

test("bootstrap runtime hard-guards child readiness probes to the internal port", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes("function assertInternalProbePort(probePort)"), true);
  assert.equal(source.includes("if (probePort !== internalPort)"), true);
  assert.equal(source.includes("assertInternalProbePort(probePort);"), true);
});

test("bootstrap runtime never force-marks handlers ready", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes("forcedHandlersReadyFallbackMs"), false);
  assert.equal(source.includes('emit("handlers_ready_forced"'), false);
  assert.equal(source.includes("state.handlersReadyForced"), false);
});

test("bootstrap runtime supports an env-guarded watchdog bypass after bind", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes("resolveBootstrapStartupMode"), true);
  assert.equal(source.includes("readinessWatchdogBypass"), true);
  assert.equal(source.includes('markHandlersReady("watchdog_bypass_after_bind")'), true);
  const resolver = fs.readFileSync(require.resolve("./resolve-bootstrap-mode.mjs"), "utf8");
  assert.equal(resolver.includes("readinessWatchdogBypass"), true);
});

test("bootstrap runtime skips the internal readiness probe loop when watchdog bypass is enabled", () => {
  const source = fs.readFileSync(require.resolve("./start-standalone.mjs"), "utf8");
  assert.equal(source.includes("if (BYPASS)"), true);
  assert.equal(source.includes('emit("watchdog_bypass_enabled"'), true);
  assert.equal(source.includes("await probeChildHealth(internalPort, attempt)"), true);
});

test("child preload recognizes the internal bootstrap ready probe path", () => {
  assert.equal(isBootstrapHealthzRequest({ method: "GET", url: "/_nn_bootstrap_ready_check__" }), true);
  assert.equal(isBootstrapHealthzRequest({ method: "HEAD", url: "/_nn_bootstrap_ready_check__?ts=1" }), true);
});

test("bootstrap healthz helper serves the internal bootstrap ready probe directly", () => {
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
