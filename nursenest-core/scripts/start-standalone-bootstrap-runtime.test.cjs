const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { existsSync } = require("node:fs");
const net = require("node:net");
const path = require("node:path");
const test = require("node:test");

const APP_ROOT = path.join(__dirname, "..");
const STANDALONE_CANDIDATES = [
  path.join(APP_ROOT, ".next", "standalone", "nursenest-core", "server.js"),
  path.join(APP_ROOT, ".next", "standalone", "server.js"),
];

function waitFor(condition, { timeoutMs = 10_000, intervalMs = 50 } = {}) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (condition()) {
        resolve();
        return;
      }
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Condition not met within ${timeoutMs}ms`));
        return;
      }
      setTimeout(tick, intervalMs);
    };
    tick();
  });
}

function allocatePort() {
  return new Promise((resolve, reject) => {
    const socket = net.createServer();
    socket.listen(0, "127.0.0.1", () => {
      const address = socket.address();
      const port = typeof address === "object" && address ? address.port : 0;
      socket.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
    socket.on("error", reject);
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractStartupWatchdogMeta(logs, event) {
  const pattern = new RegExp(`startup_watchdog ${escapeRegExp(event)} (\\{[^\\n]+\\})`);
  const match = pattern.exec(logs);
  return match ? JSON.parse(match[1]) : null;
}

test("standalone runtime reaches ready without bypass via the internal bootstrap probe", async (t) => {
  const standaloneEntry = STANDALONE_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!standaloneEntry) {
    t.skip(`Missing standalone build entry. Checked:\n${STANDALONE_CANDIDATES.join("\n")}`);
    return;
  }

  const port = await allocatePort();
  const combined = [];
  const server = spawn(process.execPath, ["scripts/start-standalone.mjs"], {
    cwd: APP_ROOT,
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(port),
      HOSTNAME: "127.0.0.1",
      NN_STRICT_PRODUCTION_ENV: "0",
      AUTH_SECRET: "test-secret",
      AUTH_URL: "https://example.com",
      NEXT_PUBLIC_APP_URL: "https://example.com",
      DATABASE_URL: "postgresql://user:pass@127.0.0.1:5432/testdb",
      STRIPE_SECRET_KEY: "sk_test_123",
      STRIPE_WEBHOOK_SECRET: "whsec_123",
      SPACES_KEY: "spaces-key",
      SPACES_SECRET: "spaces-secret",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const capture = (chunk) => {
    combined.push(chunk.toString());
  };
  server.stdout.on("data", capture);
  server.stderr.on("data", capture);

  const stopServer = async () => {
    if (server.exitCode != null || server.killed) return;
    server.kill("SIGTERM");
    await new Promise((resolve) => server.once("exit", resolve));
  };
  const waitForLog = async (snippet, timeoutMs = 10_000) => {
    await waitFor(() => combined.join("").includes(snippet), { timeoutMs, intervalMs: 50 }).catch((error) => {
      const detail = `${error.message}\n\nCaptured logs:\n${combined.join("")}`;
      throw new Error(detail);
    });
  };

  t.after(stopServer);

  await waitForLog("startup_watchdog server_listening");
  await waitForLog("startup_watchdog standalone_spawn");
  await waitForLog("startup_watchdog handlers_init_start");
  await waitForLog("startup_watchdog preload_file_entered");
  await waitForLog("startup_watchdog preload_installed");

  const logsBeforeProbe = combined.join("");
  const serverListeningMeta = extractStartupWatchdogMeta(logsBeforeProbe, "server_listening");
  assert.ok(serverListeningMeta, logsBeforeProbe);
  assert.equal(typeof serverListeningMeta.internalPort, "number");
  assert.notEqual(serverListeningMeta.internalPort, port);
  assert.match(logsBeforeProbe, /startup_watchdog preload_file_entered/);
  assert.match(logsBeforeProbe, /startup_watchdog preload_installed/);
  assert.match(logsBeforeProbe, /startup_watchdog server_listening/);
  assert.match(logsBeforeProbe, /startup_watchdog standalone_spawn/);
  assert.match(logsBeforeProbe, /"runtimeBootstrap":"[^"]*start-standalone-runtime\.cjs"/);
  assert.match(logsBeforeProbe, /startup_watchdog preload_patch_next_done/);
  assert.doesNotMatch(logsBeforeProbe, /startup_watchdog handlers_ready/);

  const publicProbeRes = await fetch(`http://127.0.0.1:${port}/_nn_bootstrap_ready_check__`);
  assert.equal(publicProbeRes.status, 404);
  assert.equal(await publicProbeRes.text(), "not found");

  const internalGetRes = await fetch(`http://127.0.0.1:${serverListeningMeta.internalPort}/_nn_bootstrap_ready_check__`);
  assert.equal(internalGetRes.status, 200);
  assert.equal(await internalGetRes.text(), "ok");

  const internalHeadRes = await fetch(`http://127.0.0.1:${serverListeningMeta.internalPort}/_nn_bootstrap_ready_check__`, {
    method: "HEAD",
  });
  assert.equal(internalHeadRes.status, 200);
  assert.equal(await internalHeadRes.text(), "");

  const getRes = await fetch(`http://127.0.0.1:${port}/healthz`);
  assert.equal(getRes.status, 200);
  assert.equal(await getRes.text(), "ok");

  const headRes = await fetch(`http://127.0.0.1:${port}/healthz`, { method: "HEAD" });
  assert.equal(headRes.status, 200);
  assert.equal(await headRes.text(), "");

  await waitForLog("startup_watchdog bootstrap_healthz_intercepted");
  await waitForLog("startup_watchdog internal_probe_response");
  await waitForLog("startup_watchdog handlers_ready");

  const logsAfterReady = combined.join("");
  assert.doesNotMatch(logsAfterReady, /startup_watchdog watchdog_bypass_enabled/);
  assert.match(
    logsAfterReady,
    new RegExp(`"probeUrl":"http://127\\.0\\.0\\.1:${serverListeningMeta.internalPort}/_nn_bootstrap_ready_check__"`),
  );
  assert.doesNotMatch(logsAfterReady, new RegExp(`"probeUrl":"http://127\\.0\\.0\\.1:${port}/_nn_bootstrap_ready_check__"`));

  const readyRes = await fetch(`http://127.0.0.1:${port}/readyz`);
  assert.equal(readyRes.status, 200);
  assert.equal(await readyRes.text(), "ok");
});

test("standalone runtime can bypass bootstrap watchdog readiness gating after bind outside production", async (t) => {
  const standaloneEntry = STANDALONE_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!standaloneEntry) {
    t.skip(`Missing standalone build entry. Checked:\n${STANDALONE_CANDIDATES.join("\n")}`);
    return;
  }

  const port = await allocatePort();
  const combined = [];
  const server = spawn(process.execPath, ["scripts/start-standalone.mjs"], {
    cwd: APP_ROOT,
    env: {
      ...process.env,
      NODE_ENV: "test",
      PORT: String(port),
      HOSTNAME: "127.0.0.1",
      NN_STRICT_PRODUCTION_ENV: "0",
      NN_BYPASS_BOOTSTRAP: "1",
      NN_BOOTSTRAP_TEST_DELAY_MS: "2000",
      AUTH_SECRET: "test-secret",
      AUTH_URL: "https://example.com",
      NEXT_PUBLIC_APP_URL: "https://example.com",
      DATABASE_URL: "postgresql://user:pass@127.0.0.1:5432/testdb",
      STRIPE_SECRET_KEY: "sk_test_123",
      STRIPE_WEBHOOK_SECRET: "whsec_123",
      SPACES_KEY: "spaces-key",
      SPACES_SECRET: "spaces-secret",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const capture = (chunk) => {
    combined.push(chunk.toString());
  };
  server.stdout.on("data", capture);
  server.stderr.on("data", capture);

  const stopServer = async () => {
    if (server.exitCode != null || server.killed) return;
    server.kill("SIGTERM");
    await new Promise((resolve) => server.once("exit", resolve));
  };
  const waitForLog = async (snippet, timeoutMs = 10_000) => {
    await waitFor(() => combined.join("").includes(snippet), { timeoutMs, intervalMs: 50 }).catch((error) => {
      const detail = `${error.message}\n\nCaptured logs:\n${combined.join("")}`;
      throw new Error(detail);
    });
  };

  t.after(stopServer);

  await waitForLog("startup_watchdog server_listening");
  await waitForLog("startup_watchdog handlers_ready", 1_000);

  const logsAfterReady = combined.join("");
  assert.match(logsAfterReady, /startup_watchdog watchdog_bypass_enabled/);
  assert.match(logsAfterReady, /startup_watchdog handlers_ready/);
  assert.doesNotMatch(logsAfterReady, /startup_watchdog internal_probe_attempt/);
  assert.doesNotMatch(logsAfterReady, /startup_watchdog internal_probe_response/);

  const healthRes = await fetch(`http://127.0.0.1:${port}/healthz`);
  assert.equal(healthRes.status, 200);
  assert.equal(await healthRes.text(), "ok");

  const readyRes = await fetch(`http://127.0.0.1:${port}/readyz`);
  assert.equal(readyRes.status, 200);
  assert.equal(await readyRes.text(), "ok");
});
