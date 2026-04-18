const assert = require("node:assert/strict");
const test = require("node:test");
const { spawn } = require("node:child_process");
const path = require("node:path");
const http = require("node:http");

const preloadPath = path.join(__dirname, "standalone-startup-watchdog-preload.cjs");

function waitForPort(child) {
  return new Promise((resolve, reject) => {
    let stderr = "";
    const timeout = setTimeout(() => {
      reject(new Error(`timed out waiting for child port\n${stderr}`));
    }, 5000);

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
      reject(new Error(`child exited before reporting port: ${code}\n${stderr}`));
    });
  });
}

function request({ port, method, path: reqPath }) {
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
    req.end();
  });
}

async function stopChild(child) {
  if (child.exitCode != null || child.killed) return;
  child.kill("SIGTERM");
  await new Promise((resolve) => child.once("exit", resolve));
}

test("bootstrap /healthz returns 200 before handlersReady", async () => {
  const child = spawn(
    process.execPath,
    [
      "--require",
      preloadPath,
      "-e",
      [
        "const http = require('node:http');",
        "const server = http.createServer();",
        "server.listen(0, '127.0.0.1', () => {",
        "  const address = server.address();",
        "  process.stdout.write(`PORT:${address.port}\\n`);",
        "});",
        "setTimeout(() => {",
        "  server.on('request', (_req, res) => {",
        "    res.statusCode = 503;",
        "    res.end('late-handler');",
        "  });",
        "}, 1000);",
      ].join(" "),
    ],
    {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let stderr = "";
  child.stderr.on("data", (chunk) => {
    stderr += String(chunk);
  });

  try {
    const { port } = await waitForPort(child);

    const getRes = await request({ port, method: "GET", path: "/healthz" });
    assert.equal(getRes.statusCode, 200, stderr);
    assert.equal(getRes.body, "ok");
    assert.equal(getRes.headers["cache-control"], "no-store");

    const headRes = await request({ port, method: "HEAD", path: "/healthz" });
    assert.equal(headRes.statusCode, 200, stderr);
    assert.equal(headRes.body, "");

    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.match(stderr, /startup_watchdog bootstrap_healthz_intercepted/);
  } finally {
    await stopChild(child);
  }
});

test("child preload serves /_nn_bootstrap_ready_check__ before request handlers exist", async () => {
  const child = spawn(
    process.execPath,
    [
      "--require",
      preloadPath,
      "-e",
      [
        "const http = require('node:http');",
        "const server = http.createServer();",
        "server.listen(0, '127.0.0.1', () => {",
        "  const address = server.address();",
        "  process.stdout.write(`PORT:${address.port}\\n`);",
        "});",
        "setTimeout(() => {",
        "  server.on('request', (_req, res) => {",
        "    res.statusCode = 503;",
        "    res.end('late-handler');",
        "  });",
        "}, 1000);",
      ].join(" "),
    ],
    {
      cwd: __dirname,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let stderr = "";
  child.stderr.on("data", (chunk) => {
    stderr += String(chunk);
  });

  try {
    const { port } = await waitForPort(child);

    const getRes = await request({ port, method: "GET", path: "/_nn_bootstrap_ready_check__" });
    assert.equal(getRes.statusCode, 200, stderr);
    assert.equal(getRes.body, "ok");
    assert.notEqual(getRes.body, "late-handler");
    assert.equal(getRes.headers["cache-control"], "no-store");

    const headRes = await request({ port, method: "HEAD", path: "/_nn_bootstrap_ready_check__" });
    assert.equal(headRes.statusCode, 200, stderr);
    assert.equal(headRes.body, "");
  } finally {
    await stopChild(child);
  }
});
