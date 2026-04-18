const assert = require("node:assert/strict");
const test = require("node:test");

const {
  createStartupWatchdogLogger,
  formatStartupWatchdogLine,
  resolveStandaloneNextModulePath,
} = require("./standalone-startup-watchdog-shared.cjs");

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

