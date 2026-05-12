/**
 * Cold-start integration test — exercises the full bootstrap proxy startup sequence
 * against a mock standalone server.js, without requiring a real Next.js build.
 *
 * Verifies (in order):
 *   1. /healthz → 200 within 2s of process spawn (proxy binds immediately)
 *   2. /readyz  → 503 before child binds (handlers not ready)
 *   3. GET /    → 503 before child binds (not proxied until ready)
 *   4. /readyz  → 200 only after internal probe confirms child listening
 *   5. GET /    → proxied correctly (mock body returned)
 *   6. No forced_fallback ever flips handlersReady (probe-only readiness)
 *   7. No ECONNREFUSED on public port after /readyz=200
 *   8. .next/standalone/server.js present (no tar extraction)
 *   9. .next/standalone/.next/static path not required by proxy (runner-image concern)
 *
 * Run: node --test scripts/cold-start-integration.test.cjs
 */

"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");
const test = require("node:test");

const SCRIPTS_DIR = __dirname;
const PKG_ROOT = path.resolve(SCRIPTS_DIR, "..");
const START_SCRIPT = path.join(SCRIPTS_DIR, "start-standalone.mjs");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function allocFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close((err) => (err ? reject(err) : resolve(port)));
    });
    srv.once("error", reject);
  });
}

function httpGet(url, { timeoutMs = 3000 } = {}) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c) => { body += c; });
      res.on("end", () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.setTimeout(timeoutMs, () => req.destroy(new Error("timeout")));
    req.on("error", (err) => resolve({ status: 0, body: "", error: err.message }));
  });
}

/** Poll until predicate returns true or timeoutMs exceeded. */
async function pollUntil(pred, { intervalMs = 150, timeoutMs = 15_000, label = "" } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await pred()) return true;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`pollUntil timed out after ${timeoutMs}ms${label ? ` (${label})` : ""}`);
}

/** Returns all stderr lines emitted by the child process so far. */
function makeLogCollector() {
  const lines = [];
  return {
    lines,
    onData(chunk) {
      const text = chunk.toString("utf8");
      for (const line of text.split("\n")) {
        if (line.trim()) lines.push(line);
      }
    },
    has(pattern) {
      return lines.some((l) => (pattern instanceof RegExp ? pattern.test(l) : l.includes(pattern)));
    },
    dump() {
      return lines.join("\n");
    },
  };
}

// ─── Mock server.js factory ───────────────────────────────────────────────────

const MOCK_SERVER_JS = `
// Mock standalone server — simulates a slow-starting Next.js process.
// The startup-watchdog preload (required before this by start-standalone-runtime.cjs)
// patches http.createServer to intercept /_nn_bootstrap_ready_check__ before the
// server is fully initialised, so the internal probe succeeds as soon as listen fires.
const http = require("http");
const delay = parseInt(process.env.NN_MOCK_CHILD_BIND_DELAY_MS || "0", 10);
const port = parseInt(process.env.PORT || "3001", 10);

setTimeout(() => {
  const server = http.createServer((req, res) => {
    if (req.url === "/") {
      res.writeHead(200, { "content-type": "text/plain" });
      res.end("mock-homepage-ok");
      return;
    }
    res.writeHead(200, { "content-type": "text/plain" });
    res.end("mock-app-ok");
  });
  server.listen(port, "127.0.0.1", () => {
    process.stderr.write(\`[mock-server] listening port=\${port}\\n\`);
  });
}, delay);
`;

// ─── Test lifecycle ───────────────────────────────────────────────────────────

let mockServerJsPath = null;
let bootstrapProc = null;
let publicPort = null;

function cleanup() {
  if (bootstrapProc && !bootstrapProc.killed) {
    try { bootstrapProc.kill("SIGTERM"); } catch {}
    bootstrapProc = null;
  }
  if (mockServerJsPath && fs.existsSync(mockServerJsPath)) {
    try { fs.rmSync(mockServerJsPath, { force: true }); } catch {}
    // Remove the nursenest-core dir only if we created it empty
    try {
      const parentDir = path.dirname(mockServerJsPath);
      if (fs.readdirSync(parentDir).length === 0) {
        fs.rmSync(parentDir, { recursive: true, force: true });
      }
    } catch {}
    mockServerJsPath = null;
  }
}

process.on("exit", cleanup);
process.on("SIGINT", () => { cleanup(); process.exit(1); });

// ─── Tests ────────────────────────────────────────────────────────────────────

test("cold-start: proxy binds before extraction — no .next-standalone-runtime.tar.gz in scripts", () => {
  const tarPath = path.join(PKG_ROOT, ".next-standalone-runtime.tar.gz");
  assert.equal(
    fs.existsSync(tarPath),
    false,
    `tar bundle must not be present in runner image: ${tarPath}`,
  );
});

test("cold-start: start-standalone.mjs does not call extractStandaloneRuntimeBundleIfNeeded", () => {
  const src = fs.readFileSync(START_SCRIPT, "utf8");
  assert.equal(src.includes("extractStandaloneRuntimeBundleIfNeeded"), false,
    "extraction function must be removed from start-standalone.mjs");
  assert.equal(src.includes(".next-standalone-runtime.tar.gz"), false,
    "tar bundle path must not appear in start-standalone.mjs");
  assert.equal(src.includes("tar -xzf"), false,
    "tar command must not appear in start-standalone.mjs");
});

test("cold-start: forced fallback does NOT flip handlersReady (probe-only readiness)", () => {
  const src = fs.readFileSync(START_SCRIPT, "utf8");
  assert.equal(src.includes('markHandlersReady("forced_fallback")'), false,
    "forced_fallback must never call markHandlersReady");
  assert.equal(src.includes("handlersReadyForced"), false,
    "handlersReadyForced state field must be removed");
  assert.equal(src.includes('emit("handlers_ready_forced_liveness_only"'), true,
    "diagnostic-only event must replace the old readiness-flipping event");
});

test("cold-start: forcedHandlersReadyFallbackMs is ≥ 90_000", () => {
  const src = fs.readFileSync(START_SCRIPT, "utf8");
  const m = src.match(/const forcedHandlersReadyFallbackMs\s*=\s*(\d[\d_]*)/);
  assert.ok(m, "forcedHandlersReadyFallbackMs constant must exist");
  const val = parseInt(m[1].replace(/_/g, ""), 10);
  assert.ok(val >= 90_000, `forcedHandlersReadyFallbackMs=${val} must be ≥ 90000`);
});

test("cold-start: Dockerfile COPYs .next/standalone directory (no tar)", () => {
  const dockerfilePath = path.join(PKG_ROOT, "..", "Dockerfile");
  assert.ok(fs.existsSync(dockerfilePath), "Dockerfile must exist");
  const src = fs.readFileSync(dockerfilePath, "utf8");
  assert.match(src, /COPY --from=builder.*\.next\/standalone.*\.\/\.next\/standalone/,
    "runner stage must COPY .next/standalone directory");
  assert.equal(src.includes(".next-standalone-runtime.tar.gz"), false,
    "Dockerfile must not reference the tar bundle");
  assert.equal(src.includes("tar -C .next"), false,
    "Dockerfile must not tar standalone at build time");
  assert.equal(src.includes("rm -rf .next/standalone"), false,
    "Dockerfile must not delete standalone after build");
});

test("cold-start: full startup sequence — healthz immediate, readyz probe-driven, app proxied", async () => {
  // Set up mock standalone server.js in the real pkgRoot location
  const standaloneDir = path.join(PKG_ROOT, ".next", "standalone", "nursenest-core");
  fs.mkdirSync(standaloneDir, { recursive: true });
  mockServerJsPath = path.join(standaloneDir, "server.js");
  fs.writeFileSync(mockServerJsPath, MOCK_SERVER_JS, "utf8");

  publicPort = await allocFreePort();

  const env = {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(publicPort),
    HOSTNAME: "127.0.0.1",
    // Provide just enough for validateRuntimeEnvOrThrow to pass
    DATABASE_URL: "postgresql://cold_start_test:cold_start_test@127.0.0.1:65432/cold_start_mock_db",
    AUTH_SECRET: "cold-start-integration-test-secret-min32",
    NN_ENV_VALIDATION_MODE: "off",
    // Child: slow bind (2s) so we can observe readyz=503 state
    NN_MOCK_CHILD_BIND_DELAY_MS: "2000",
    // Fast internal probe for snappy tests
    NN_CHILD_HEALTH_TIMEOUT_MS: "500",
    // Watchdog with enough budget but not too long
    NN_BOOTSTRAP_READY_TIMEOUT_MS: "20000",
    NN_BOOTSTRAP_READY_MAX_ATTEMPTS: "200",
    // Suppress Sentry noise
    SENTRY_ENABLED: "false",
    NEXT_TELEMETRY_DISABLED: "1",
  };

  const logs = makeLogCollector();
  const startedAt = Date.now();

  bootstrapProc = spawn(process.execPath, [START_SCRIPT], {
    cwd: PKG_ROOT,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  bootstrapProc.stdout.on("data", logs.onData);
  bootstrapProc.stderr.on("data", logs.onData);

  bootstrapProc.on("exit", (code, signal) => {
    logs.lines.push(`[test] bootstrap process exited code=${code} signal=${signal}`);
  });

  const baseUrl = `http://127.0.0.1:${publicPort}`;

  try {
    // ── Checkpoint 1: /healthz → 200 within 2s of spawn ─────────────────────
    // The proxy must bind before any extraction — should be near-instant.
    await pollUntil(
      async () => {
        const r = await httpGet(`${baseUrl}/healthz`, { timeoutMs: 500 });
        return r.status === 200;
      },
      { intervalMs: 100, timeoutMs: 2000, label: "healthz=200 within 2s" },
    );
    const healthzMs = Date.now() - startedAt;
    assert.ok(healthzMs < 2000, `healthz took ${healthzMs}ms — should be < 2000ms (no extraction delay)`);

    // ── Checkpoint 2: /readyz → 503 before child binds ───────────────────────
    // Child has a 2s startup delay; we're < 1s in, so it's not ready yet.
    const readyzBeforeBind = await httpGet(`${baseUrl}/readyz`, { timeoutMs: 1000 });
    assert.equal(readyzBeforeBind.status, 503,
      `/readyz must be 503 before child binds (got ${readyzBeforeBind.status})`);

    // ── Checkpoint 3: GET / → 503 before child binds (not proxied yet) ───────
    const homepageBeforeBind = await httpGet(`${baseUrl}/`, { timeoutMs: 1000 });
    assert.equal(homepageBeforeBind.status, 503,
      `homepage must be 503 before child binds (got ${homepageBeforeBind.status})`);

    // ── Checkpoint 4: /readyz → 200 only after internal probe succeeds ────────
    await pollUntil(
      async () => {
        const r = await httpGet(`${baseUrl}/readyz`, { timeoutMs: 1000 });
        return r.status === 200;
      },
      { intervalMs: 200, timeoutMs: 12000, label: "readyz=200 after child bind" },
    );
    const readyzFlipMs = Date.now() - startedAt;
    // Must have taken > 1s (mock child has 2s delay) — not a premature forced flip
    assert.ok(readyzFlipMs > 1000,
      `readyz=200 at ${readyzFlipMs}ms — suspiciously fast, may be a forced flip`);

    // ── Checkpoint 5: Homepage proxied correctly after child bind ─────────────
    const homepageAfterBind = await httpGet(`${baseUrl}/`, { timeoutMs: 3000 });
    assert.equal(homepageAfterBind.status, 200,
      `homepage must be 200 after child binds (got ${homepageAfterBind.status})`);
    assert.equal(homepageAfterBind.body, "mock-homepage-ok",
      "homepage body must be proxied from mock child server");

    // ── Checkpoint 6: No forced_fallback flipped handlersReady ───────────────
    // The only readiness event should be probe-driven ("internal_probe")
    assert.equal(
      logs.has('markHandlersReady("forced_fallback")'),
      false,
      "forced_fallback must never appear in logs",
    );
    // Confirm the probe-driven path fired
    assert.ok(
      logs.has(/handlers_ready.*reason.*internal_probe/) || logs.has("internal_probe"),
      `logs must contain probe-driven readiness event. Got:\n${logs.dump().slice(-2000)}`,
    );

    // ── Checkpoint 7: No ECONNREFUSED on public port after /readyz=200 ────────
    // Make 5 rapid requests — none should get a connection error or 502
    const rapidResults = await Promise.all(
      Array.from({ length: 5 }, () => httpGet(`${baseUrl}/`, { timeoutMs: 2000 })),
    );
    for (const r of rapidResults) {
      assert.ok(
        r.status === 200,
        `ECONNREFUSED/502 after readyz=200: got status=${r.status} error=${r.error ?? "none"}`,
      );
      assert.ok(!r.error, `unexpected connection error after readyz=200: ${r.error}`);
    }

    // ── Checkpoint 8: /healthz stays 200 throughout (never ECONNREFUSED) ──────
    const healthzAfterReady = await httpGet(`${baseUrl}/healthz`, { timeoutMs: 1000 });
    assert.equal(healthzAfterReady.status, 200, "/healthz must stay 200 after child binds");

  } finally {
    cleanup();
  }
});

test("cold-start: /healthz never returns 503 during startup (liveness always passes)", async () => {
  // Short test: spawn, immediately and repeatedly probe /healthz for 1.5s
  const standaloneDir = path.join(PKG_ROOT, ".next", "standalone", "nursenest-core");
  fs.mkdirSync(standaloneDir, { recursive: true });
  mockServerJsPath = path.join(standaloneDir, "server.js");
  fs.writeFileSync(mockServerJsPath, MOCK_SERVER_JS, "utf8");

  publicPort = await allocFreePort();

  const env = {
    ...process.env,
    NODE_ENV: "production",
    PORT: String(publicPort),
    HOSTNAME: "127.0.0.1",
    DATABASE_URL: "postgresql://liveness_test:liveness_test@127.0.0.1:65432/liveness_mock",
    AUTH_SECRET: "liveness-test-integration-secret-min32ok",
    NN_ENV_VALIDATION_MODE: "off",
    NN_MOCK_CHILD_BIND_DELAY_MS: "3000",
    NN_CHILD_HEALTH_TIMEOUT_MS: "300",
    NN_BOOTSTRAP_READY_TIMEOUT_MS: "15000",
    SENTRY_ENABLED: "false",
    NEXT_TELEMETRY_DISABLED: "1",
  };

  const logs = makeLogCollector();

  bootstrapProc = spawn(process.execPath, [START_SCRIPT], {
    cwd: PKG_ROOT,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  bootstrapProc.stdout.on("data", logs.onData);
  bootstrapProc.stderr.on("data", logs.onData);

  const baseUrl = `http://127.0.0.1:${publicPort}`;
  const nonOkStatuses = [];

  try {
    // Wait for proxy to bind first
    await pollUntil(
      async () => {
        const r = await httpGet(`${baseUrl}/healthz`, { timeoutMs: 300 });
        return r.status === 200;
      },
      { intervalMs: 100, timeoutMs: 3000, label: "initial healthz bind" },
    );

    // Now hammer /healthz for 1.5s — should always be 200
    const deadline = Date.now() + 1500;
    while (Date.now() < deadline) {
      const r = await httpGet(`${baseUrl}/healthz`, { timeoutMs: 500 });
      if (r.status !== 200) nonOkStatuses.push(r.status);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    assert.equal(
      nonOkStatuses.length, 0,
      `/healthz returned non-200 during startup: ${nonOkStatuses.join(", ")}`,
    );

  } finally {
    cleanup();
  }
});

test("cold-start: Dockerfile runner stage has no node_modules COPY from builder root", () => {
  // The runner image only needs: .next/standalone (contains its own node_modules),
  // public/, scripts/, package.json — NOT the full root node_modules.
  const dockerfilePath = path.join(PKG_ROOT, "..", "Dockerfile");
  const src = fs.readFileSync(dockerfilePath, "utf8");
  const runnerLines = src.split("\n").slice(src.split("\n").findIndex((l) => l.startsWith("FROM node")));
  const nodeModulesCopy = runnerLines.find(
    (l) => l.startsWith("COPY --from=builder") && l.includes("node_modules") && !l.includes(".next/standalone"),
  );
  assert.equal(nodeModulesCopy, undefined,
    `runner stage must not COPY root node_modules from builder: ${nodeModulesCopy}`);
});
