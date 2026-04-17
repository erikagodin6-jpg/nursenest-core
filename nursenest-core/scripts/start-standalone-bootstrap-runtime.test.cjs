const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { existsSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const APP_ROOT = path.join(__dirname, "..");
const STANDALONE_ENTRY = path.join(APP_ROOT, ".next", "standalone", "nursenest-core", "server.js");

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

test("standalone runtime serves bootstrap /healthz before handlers_ready", async (t) => {
  assert.equal(existsSync(STANDALONE_ENTRY), true, `Missing standalone build entry: ${STANDALONE_ENTRY}`);

  const port = 4311 + Math.floor(Math.random() * 200);
  const combined = [];
  const server = spawn(process.execPath, ["scripts/start-standalone.mjs"], {
    cwd: APP_ROOT,
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(port),
      HOSTNAME: "127.0.0.1",
      NN_STRICT_PRODUCTION_ENV: "0",
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

  t.after(stopServer);

  await waitFor(
    () => combined.join("").includes("startup_watchdog handlers_init_start"),
    { timeoutMs: 10_000, intervalMs: 50 },
  );
  await waitFor(
    () => combined.join("").includes("startup_watchdog preload_installed"),
    { timeoutMs: 10_000, intervalMs: 50 },
  );

  const logsBeforeProbe = combined.join("");
  assert.match(logsBeforeProbe, /startup_watchdog preload_file_entered/);
  assert.match(logsBeforeProbe, /startup_watchdog preload_installed/);
  assert.match(logsBeforeProbe, /startup_watchdog server_listening/);
  assert.doesNotMatch(logsBeforeProbe, /startup_watchdog handlers_ready/);

  const getRes = await fetch(`http://127.0.0.1:${port}/healthz`);
  assert.equal(getRes.status, 200);
  assert.equal(await getRes.text(), "ok");

  const headRes = await fetch(`http://127.0.0.1:${port}/healthz`, { method: "HEAD" });
  assert.equal(headRes.status, 200);
  assert.equal(await headRes.text(), "");

  await waitFor(
    () => combined.join("").includes("startup_watchdog bootstrap_healthz_intercepted"),
    { timeoutMs: 10_000, intervalMs: 50 },
  );
  await waitFor(
    () => combined.join("").includes("startup_watchdog handlers_ready"),
    { timeoutMs: 10_000, intervalMs: 50 },
  );
});
