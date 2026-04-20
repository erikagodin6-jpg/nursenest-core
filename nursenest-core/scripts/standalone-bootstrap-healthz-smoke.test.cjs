const assert = require("node:assert/strict");
const test = require("node:test");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const path = require("node:path");
const http = require("node:http");

const preloadPath = path.join(__dirname, "standalone-startup-watchdog-preload.cjs");

/** Max wait for child to print PORT: line (listen). */
const SMOKE_CHILD_LISTEN_TIMEOUT_MS = 12_000;
/** Max wait per outbound HTTP probe to the child. */
const SMOKE_HTTP_REQUEST_TIMEOUT_MS = 8_000;
/** Max wait for child exit after SIGTERM before SIGKILL. */
const SMOKE_CHILD_SHUTDOWN_TIMEOUT_MS = 6_000;
/** Hard ceiling for the whole test case (spawn → assertions → cleanup). */
const SMOKE_TEST_CASE_BUDGET_MS = 35_000;
/** Runner-level ceiling (slightly above budget so SIGKILL cleanup can run first). */
const SMOKE_NODE_TEST_TIMEOUT_MS = SMOKE_TEST_CASE_BUDGET_MS + 8_000;
/** Upper bound for stopChild (SIGTERM wait + SIGKILL wait). */
const SMOKE_SHUTDOWN_TOTAL_MS = SMOKE_CHILD_SHUTDOWN_TIMEOUT_MS + 4_000;

function withTimeout(promise, ms, phaseDetail) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(
        new Error(
          `[smoke] timeout before ${phaseDetail} (limit=${ms}ms). ` +
            "Possible causes: slow CI, blocked loopback, or child never reached listen/probe.",
        ),
      );
    }, ms);
  });
  return Promise.race([
    promise.finally(() => {
      clearTimeout(timer);
    }),
    timeoutPromise,
  ]);
}

function waitForPort(child, listenTimeoutMs) {
  return new Promise((resolve, reject) => {
    let stderr = "";
    const timeout = setTimeout(() => {
      reject(
        new Error(
          `[smoke] timeout before listen (no PORT: within ${listenTimeoutMs}ms).\n${stderr}`,
        ),
      );
    }, listenTimeoutMs);

    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.stdout.on("data", (chunk) => {
      const text = String(chunk).trim();
      const match = /^PORT:(\d+)$/.exec(text);
      if (match) {
        clearTimeout(timeout);
        resolve({ port: Number(match[1]), stderr });
      }
    });

    child.once("exit", (code) => {
      clearTimeout(timeout);
      reject(
        new Error(
          `[smoke] child exited before listen (exit=${code}).\n${stderr}`,
        ),
      );
    });
  });
}

function request({ port, method, path: reqPath, timeoutMs = SMOKE_HTTP_REQUEST_TIMEOUT_MS }) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: "127.0.0.1",
        port,
        path: reqPath,
        method,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body,
          });
        });
      },
    );
    req.on("error", reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy(
        new Error(
          `[smoke] timeout before probe response (${timeoutMs}ms) for ${method} ${reqPath}`,
        ),
      );
    });
    req.end();
  });
}

async function stopChild(child) {
  if (child.exitCode != null || child.killed) return;
  child.kill("SIGTERM");
  await Promise.race([
    once(child, "exit"),
    new Promise((resolve) => {
      setTimeout(resolve, SMOKE_CHILD_SHUTDOWN_TIMEOUT_MS);
    }),
  ]);
  if (child.exitCode == null && !child.killed) {
    child.kill("SIGKILL");
  }
  if (child.exitCode == null && !child.killed) {
    await Promise.race([
      once(child, "exit"),
      new Promise((resolve) => setTimeout(resolve, 3_000)),
    ]);
  }
}

/**
 * Runs a smoke case with a hard budget: if the case exceeds the budget, the child is SIGKILL'd
 * so the test runner cannot hang indefinitely.
 */
async function runSmokeCase(fn) {
  let child = null;
  const hardBudget = setTimeout(() => {
    if (child && child.exitCode == null && !child.killed) {
      try {
        child.kill("SIGKILL");
      } catch {
        // ignore
      }
    }
  }, SMOKE_TEST_CASE_BUDGET_MS);
  const setChild = (c) => {
    child = c;
  };
  try {
    await fn(setChild);
  } finally {
    clearTimeout(hardBudget);
    if (child) {
      try {
        await withTimeout(
          stopChild(child),
          SMOKE_SHUTDOWN_TOTAL_MS,
          "shutdown (child did not exit after SIGTERM/SIGKILL)",
        );
      } catch (err) {
        try {
          if (child.exitCode == null && !child.killed) {
            child.kill("SIGKILL");
          }
        } catch {
          // ignore
        }
        throw err;
      }
    }
  }
}

test(
  "bootstrap /healthz returns 200 before handlersReady",
  { timeout: SMOKE_NODE_TEST_TIMEOUT_MS },
  async () => {
    await runSmokeCase(async (setChild) => {
    const spawned = spawn(
      process.execPath,
      [
        "--require",
        preloadPath,
        "-e",
        [
          "const http = require('node:http');",
          "const server = http.createServer(async (_req, res) => {",
          "  res.statusCode = 503;",
          "  res.end('late-handler');",
          "});",
          "server.listen(0, '127.0.0.1', () => {",
          "  const address = server.address();",
          "  process.stdout.write(`PORT:${address.port}\\n`);",
          "});",
        ].join(" "),
      ],
      {
        cwd: __dirname,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    setChild(spawned);

    let stderr = "";
    spawned.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    const { port } = await waitForPort(spawned, SMOKE_CHILD_LISTEN_TIMEOUT_MS);

    const getRes = await withTimeout(
      request({ port, method: "GET", path: "/healthz" }),
      SMOKE_HTTP_REQUEST_TIMEOUT_MS,
      "probe response (GET /healthz)",
    );
    assert.equal(getRes.statusCode, 200, stderr);
    assert.equal(getRes.body, "ok");
    assert.equal(getRes.headers["cache-control"], "no-store");

    const headRes = await withTimeout(
      request({ port, method: "HEAD", path: "/healthz" }),
      SMOKE_HTTP_REQUEST_TIMEOUT_MS,
      "probe response (HEAD /healthz)",
    );
    assert.equal(headRes.statusCode, 200, stderr);
    assert.equal(headRes.body, "");

    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.match(stderr, /startup_watchdog bootstrap_healthz_intercepted/);
  });
});

test(
  "child preload serves /_nn_bootstrap_ready_check__ before request handlers exist",
  { timeout: SMOKE_NODE_TEST_TIMEOUT_MS },
  async () => {
    await runSmokeCase(async (setChild) => {
    const spawned = spawn(
      process.execPath,
      [
        "--require",
        preloadPath,
        "-e",
        [
          "const http = require('node:http');",
          "const server = http.createServer(async (req, res) => {",
          "  const pathOnly = (typeof req.url === 'string' ? req.url : '').split('?')[0];",
          "  const normalized =",
          "    pathOnly.length > 1 && pathOnly.endsWith('/') ? pathOnly.slice(0, -1) || '/' : pathOnly;",
          "  if (normalized === '/_nn_bootstrap_ready_check__') {",
          "    await new Promise(() => {});",
          "    return;",
          "  }",
          "  res.statusCode = 200;",
          "  res.end('via-next');",
          "});",
          "server.listen(0, '127.0.0.1', () => {",
          "  const address = server.address();",
          "  process.stdout.write(`PORT:${address.port}\\n`);",
          "});",
        ].join(" "),
      ],
      {
        cwd: __dirname,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    setChild(spawned);

    let stderr = "";
    spawned.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    const { port } = await waitForPort(spawned, SMOKE_CHILD_LISTEN_TIMEOUT_MS);

    const getRes = await withTimeout(
      request({ port, method: "GET", path: "/_nn_bootstrap_ready_check__" }),
      SMOKE_HTTP_REQUEST_TIMEOUT_MS,
      "probe response (GET /_nn_bootstrap_ready_check__)",
    );
    assert.equal(getRes.statusCode, 200, stderr);
    assert.equal(getRes.body, "ok");
    assert.notEqual(getRes.body, "late-handler");
    assert.equal(getRes.headers["cache-control"], "no-store");

    const headRes = await withTimeout(
      request({ port, method: "HEAD", path: "/_nn_bootstrap_ready_check__" }),
      SMOKE_HTTP_REQUEST_TIMEOUT_MS,
      "probe response (HEAD /_nn_bootstrap_ready_check__)",
    );
    assert.equal(headRes.statusCode, 200, stderr);
    assert.equal(headRes.body, "");
  });
});
