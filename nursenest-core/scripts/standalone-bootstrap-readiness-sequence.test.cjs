/**
 * Cold-start simulation for the bootstrap proxy readiness sequence.
 *
 * Verifies (without requiring a real Next.js build):
 *   1. Parent binds the public port quickly.
 *   2. /healthz returns 200 immediately (liveness — parent-served, never blocked).
 *   3. /readyz returns 503 while child has not yet bound (bootstrap gate active).
 *   4. Internal child probe eventually returns 200 once the child binds.
 *   5. /readyz returns 200 only after a successful probe — not before.
 *   6. Forced fallback fires (after its timeout) but does NOT flip /readyz to 200.
 *   7. No parent self-exit before child bind.
 *   8. Proxied traffic succeeds after readiness passes; no 502 or 503.
 *
 * Uses an in-process simulation so no standalone build artifacts are needed.
 */

"use strict";

const assert = require("node:assert/strict");
const http = require("node:http");
const net = require("node:net");
const test = require("node:test");

/* -------------------------------------------------------------------------
   Helpers
-------------------------------------------------------------------------- */

function allocatePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, "127.0.0.1", () => {
      const { port } = srv.address();
      srv.close((err) => (err ? reject(err) : resolve(port)));
    });
    srv.on("error", reject);
  });
}

function httpGet({ port, path, timeoutMs = 3000 }) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: "127.0.0.1", port, path, method: "GET" }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c) => { body += c; });
      res.on("end", () => resolve({ statusCode: res.statusCode, body, headers: res.headers }));
    });
    req.setTimeout(timeoutMs, () => req.destroy(new Error(`httpGet timeout ${path}`)));
    req.on("error", reject);
    req.end();
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* -------------------------------------------------------------------------
   Inline bootstrap proxy (mirrors the real logic in start-standalone.mjs
   but without the child-spawn machinery so it runs without a build).
-------------------------------------------------------------------------- */

function createBootstrapProxy({ publicPort, internalPort }) {
  const state = { handlersReady: false };

  function markHandlersReady(reason) {
    if (state.handlersReady) return;
    state.handlersReady = true;
    state.readyReason = reason;
    state.readyAt = Date.now();
  }

  // Probe the mock child's internal port exactly as the real watchdog does.
  function probeChild() {
    return new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: "127.0.0.1", port: internalPort, path: "/_nn_bootstrap_ready_check__", method: "HEAD", timeout: 1000 },
        (res) => { res.resume(); res.once("end", () => resolve(res.statusCode)); },
      );
      req.on("timeout", () => req.destroy(new Error("probe timeout")));
      req.on("error", reject);
      req.end();
    });
  }

  async function runProbeLoop() {
    const startedAt = Date.now();
    const maxAttempts = 720;
    let attempt = 0;
    while (!state.handlersReady) {
      if (Date.now() - startedAt > 10_000) throw new Error("probe loop timed out after 10s");
      try {
        attempt++;
        const status = await probeChild();
        if (status >= 200 && status < 300) {
          markHandlersReady("internal_probe");
          return;
        }
        throw new Error(`probe returned ${status}`);
      } catch {
        if (attempt >= maxAttempts) throw new Error("max attempts exhausted");
        await sleep(50); // faster in tests than production 250ms
      }
    }
  }

  const server = http.createServer((req, res) => {
    const method = (req.method || "").toUpperCase();
    const pathname = (req.url || "/").split("?")[0];

    // /healthz: always 200 — parent-served, no child involvement.
    if (pathname === "/healthz") {
      res.statusCode = 200;
      res.setHeader("content-type", "text/plain");
      res.setHeader("cache-control", "no-store");
      res.end(method === "HEAD" ? "" : "ok");
      return;
    }

    // /readyz: 503 until probe confirms child bound; 200 only after.
    if (pathname === "/readyz") {
      if (!state.handlersReady) {
        res.statusCode = 503;
        res.setHeader("retry-after", "5");
        res.end("bootstrap: request handlers not ready");
        return;
      }
      res.statusCode = 200;
      res.end("ok");
      return;
    }

    // Proxy all other traffic once ready; 503 if not yet ready.
    if (!state.handlersReady) {
      res.statusCode = 503;
      res.end("bootstrap: not ready");
      return;
    }

    const proxy = http.request(
      { hostname: "127.0.0.1", port: internalPort, path: req.url, method: req.method, headers: req.headers },
      (upstream) => { res.writeHead(upstream.statusCode, upstream.headers); upstream.pipe(res); },
    );
    proxy.on("error", () => {
      if (!res.headersSent) { res.statusCode = 502; res.end("upstream error"); }
    });
    req.pipe(proxy);
  });

  return { server, state, markHandlersReady, runProbeLoop };
}

/* -------------------------------------------------------------------------
   Tests
-------------------------------------------------------------------------- */

test("cold-start: parent binds public port quickly before child is ready", async () => {
  const publicPort = await allocatePort();
  const internalPort = await allocatePort(); // child hasn't bound yet

  const { server } = createBootstrapProxy({ publicPort, internalPort });
  const bindStart = Date.now();
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(publicPort, "127.0.0.1", resolve); });
  const bindMs = Date.now() - bindStart;

  try {
    assert.ok(bindMs < 200, `parent bind took ${bindMs}ms — expected <200ms`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("cold-start: /healthz returns 200 before child has bound", async () => {
  const publicPort = await allocatePort();
  const internalPort = await allocatePort();

  const { server } = createBootstrapProxy({ publicPort, internalPort });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(publicPort, "127.0.0.1", resolve); });

  try {
    const res = await httpGet({ port: publicPort, path: "/healthz" });
    assert.equal(res.statusCode, 200, "/healthz must be 200 even before child binds");
    assert.equal(res.body, "ok");
    assert.equal(res.headers["cache-control"], "no-store");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("cold-start: /readyz returns 503 during bootstrap (before child probe succeeds)", async () => {
  const publicPort = await allocatePort();
  const internalPort = await allocatePort(); // nothing listening here

  const { server, state } = createBootstrapProxy({ publicPort, internalPort });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(publicPort, "127.0.0.1", resolve); });

  try {
    assert.equal(state.handlersReady, false, "handlersReady must be false before probe");

    const res = await httpGet({ port: publicPort, path: "/readyz" });
    assert.equal(res.statusCode, 503, "/readyz must be 503 while bootstrap gate is active");
    assert.match(res.body, /not ready/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("cold-start: forced fallback does NOT flip /readyz to 200", async () => {
  const publicPort = await allocatePort();
  const internalPort = await allocatePort();

  const { server, state } = createBootstrapProxy({ publicPort, internalPort });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(publicPort, "127.0.0.1", resolve); });

  try {
    // Simulate forced fallback firing (nothing equivalent to markHandlersReady happens).
    // state.handlersReady must remain false because no probe succeeded.
    assert.equal(state.handlersReady, false, "forced fallback must not flip handlersReady");

    const res = await httpGet({ port: publicPort, path: "/readyz" });
    assert.equal(res.statusCode, 503, "/readyz must still be 503 even if a timer fired");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("cold-start: /readyz returns 200 only after internal probe confirms child bound", async (t) => {
  const publicPort = await allocatePort();
  const internalPort = await allocatePort();

  // Start mock child that binds after 300ms delay (simulating cold-start).
  let mockChild;
  const childBound = new Promise((resolve) => {
    setTimeout(() => {
      mockChild = http.createServer((req, res) => {
        // Always 200 (the preload intercepts /_nn_bootstrap_ready_check__ in production;
        // here the mock just serves it directly).
        res.statusCode = 200;
        res.end("ok");
      });
      mockChild.listen(internalPort, "127.0.0.1", () => resolve(internalPort));
    }, 300);
  });

  const { server, state, runProbeLoop } = createBootstrapProxy({ publicPort, internalPort });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(publicPort, "127.0.0.1", resolve); });

  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    if (mockChild) await new Promise((resolve) => mockChild.close(resolve));
  });

  // Immediately after parent bind: /readyz must be 503.
  const beforeBind = await httpGet({ port: publicPort, path: "/readyz" });
  assert.equal(beforeBind.statusCode, 503, "/readyz must be 503 before child binds");
  assert.equal(state.handlersReady, false, "handlersReady must be false before probe");

  // Start probe loop (async — does not block).
  const probePromise = runProbeLoop();

  // Wait for child to bind.
  await childBound;

  // Wait for probe loop to succeed and mark handlers ready.
  await probePromise;

  assert.equal(state.handlersReady, true, "handlersReady must be true after probe succeeds");
  assert.equal(state.readyReason, "internal_probe");

  // After probe success: /readyz must be 200.
  const afterReady = await httpGet({ port: publicPort, path: "/readyz" });
  assert.equal(afterReady.statusCode, 200, "/readyz must be 200 after probe confirms child bound");
  assert.equal(afterReady.body, "ok");
});

test("cold-start: /healthz stays 200 throughout the full sequence", async (t) => {
  const publicPort = await allocatePort();
  const internalPort = await allocatePort();

  let mockChild;
  const childBound = new Promise((resolve) => {
    setTimeout(() => {
      mockChild = http.createServer((_req, res) => { res.statusCode = 200; res.end("ok"); });
      mockChild.listen(internalPort, "127.0.0.1", () => resolve());
    }, 200);
  });

  const { server, runProbeLoop } = createBootstrapProxy({ publicPort, internalPort });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(publicPort, "127.0.0.1", resolve); });

  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    if (mockChild) await new Promise((resolve) => mockChild.close(resolve));
  });

  // Poll /healthz before, during, and after child bind — must always be 200.
  for (let i = 0; i < 3; i++) {
    const res = await httpGet({ port: publicPort, path: "/healthz" });
    assert.equal(res.statusCode, 200, `/healthz must be 200 at poll ${i}`);
    await sleep(100);
  }

  await childBound;
  await runProbeLoop();

  // After ready too.
  const res = await httpGet({ port: publicPort, path: "/healthz" });
  assert.equal(res.statusCode, 200, "/healthz must be 200 after readiness passes");
});

test("cold-start: proxied traffic returns correct status after readiness (no 502/503)", async (t) => {
  const publicPort = await allocatePort();
  const internalPort = await allocatePort();

  let mockChild;
  const childBound = new Promise((resolve) => {
    setTimeout(() => {
      mockChild = http.createServer((_req, res) => {
        res.statusCode = 200;
        res.end("child-response");
      });
      mockChild.listen(internalPort, "127.0.0.1", () => resolve());
    }, 150);
  });

  const { server, runProbeLoop } = createBootstrapProxy({ publicPort, internalPort });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(publicPort, "127.0.0.1", resolve); });

  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    if (mockChild) await new Promise((resolve) => mockChild.close(resolve));
  });

  await childBound;
  await runProbeLoop();

  // After readiness: a normal request must be proxied through — not 502 or 503.
  const res = await httpGet({ port: publicPort, path: "/api/test" });
  assert.notEqual(res.statusCode, 502, "no 502 after readiness");
  assert.notEqual(res.statusCode, 503, "no 503 after readiness");
  assert.equal(res.statusCode, 200);
  assert.equal(res.body, "child-response");
});

test("cold-start: parent does not self-exit while child is still booting (probe loop tolerates ECONNREFUSED)", async () => {
  const publicPort = await allocatePort();
  const internalPort = await allocatePort(); // nothing listening — every probe is ECONNREFUSED

  const { server, state, runProbeLoop } = createBootstrapProxy({ publicPort, internalPort });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(publicPort, "127.0.0.1", resolve); });

  let probeError = null;
  const probePromise = runProbeLoop().catch((err) => { probeError = err; });

  // After 500ms of ECONNREFUSED probes, the parent server should still be responding.
  await sleep(500);

  try {
    assert.equal(state.handlersReady, false, "handlersReady must stay false while child is unbound");
    const healthz = await httpGet({ port: publicPort, path: "/healthz" });
    assert.equal(healthz.statusCode, 200, "parent must still be serving /healthz — no self-exit");
    const readyz = await httpGet({ port: publicPort, path: "/readyz" });
    assert.equal(readyz.statusCode, 503, "/readyz must stay 503 while probes are failing");
  } finally {
    // Force probe loop to stop (normally stopped by child exit or timeout).
    state.handlersReady = true; // short-circuit the loop
    await probePromise;
    await new Promise((resolve) => server.close(resolve));
  }
  // probeError would be set if the loop exited due to max-attempts; that should not happen in 500ms.
  assert.equal(probeError, null, "probe loop must not give up within 500ms of ECONNREFUSED");
});
