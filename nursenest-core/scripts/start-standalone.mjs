#!/usr/bin/env node
/**
 * Production entry: bind a tiny bootstrap HTTP server on the public port immediately, then
 * run Next standalone on a private loopback port. Public `GET/HEAD /healthz` never waits for
 * Next request handlers, while all other traffic proxies to the child process once ready.
 */
import http from "node:http";
import net from "node:net";
import { once } from "node:events";
import { setTimeout as sleep } from "node:timers/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { childOutputIndicatesReady } = require("./standalone-startup-watchdog-shared.cjs");

const bootAt = Date.now();
const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const runtimeBootstrap = join(pkgRoot, "scripts", "start-standalone-runtime.cjs");
const candidates = [
  join(pkgRoot, ".next", "standalone", "nursenest-core", "server.js"),
  join(pkgRoot, ".next", "standalone", "server.js"),
];
const entry = candidates.find((p) => existsSync(p));

if (!entry) {
  console.error(
    "[nursenest-core] FATAL: standalone server.js not found. Expected one of:\n" +
      candidates.map((p) => `  - ${p}`).join("\n") +
      "\n  Run `npm run build` from this package first.",
  );
  process.exit(1);
}

if (process.env.NODE_ENV !== "production") {
  process.env.NODE_ENV = "production";
}

const publicPort = Number.parseInt(process.env.PORT ?? "3000", 10) || 3000;
const publicHost = process.env.HOSTNAME || "0.0.0.0";
const internalHost = "127.0.0.1";
/** Internal child readiness probe: use a real lightweight route so readiness never falls through locale routing. */
const readinessProbePath = "/api/health";
const bootstrapReadyTimeoutMs = Number.parseInt(process.env.NN_BOOTSTRAP_READY_TIMEOUT_MS ?? "900000", 10) || 900000;
const bootstrapTestDelayMs = Number.parseInt(process.env.NN_BOOTSTRAP_TEST_DELAY_MS ?? "0", 10) || 0;
const memMb = process.env.NODE_MAX_OLD_SPACE_SIZE_MB ?? "512";
const baseNodeOptions = (process.env.NODE_OPTIONS ?? "").trim();
const hasHeapOverride =
  baseNodeOptions.includes("--max-old-space-size") ||
  process.execArgv.some((arg) => arg.startsWith("--max-old-space-size"));
const childExecArgv = hasHeapOverride ? [...process.execArgv] : [`--max-old-space-size=${memMb}`, ...process.execArgv];

function emit(event, meta = {}) {
  console.error(`[nursenest-core] startup_watchdog ${event} ${JSON.stringify({ ...meta, msSinceBoot: Date.now() - bootAt })}`);
}

function isBootstrapHealthzRequest(req) {
  const method = typeof req?.method === "string" ? req.method.toUpperCase() : "";
  const url = typeof req?.url === "string" ? req.url : "";
  return (method === "GET" || method === "HEAD") && (url === "/healthz" || url.startsWith("/healthz?"));
}

function allocatePort() {
  return new Promise((resolve, reject) => {
    const socket = net.createServer();
    socket.listen(0, internalHost, () => {
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

function waitForChildReadiness({ internalPort, state }) {
  const startedAt = Date.now();

  return (async () => {
    if (bootstrapTestDelayMs > 0) {
      await sleep(bootstrapTestDelayMs);
    }
    while (!state.handlersReady) {
      if (state.childExited) {
        throw new Error("standalone child exited before handlers became ready");
      }
      if (Date.now() - startedAt > bootstrapReadyTimeoutMs) {
        throw new Error(`standalone child never answered ${readinessProbePath} within ${bootstrapReadyTimeoutMs}ms`);
      }

      try {
        await new Promise((resolve, reject) => {
          const req = http.request(
            {
              hostname: internalHost,
              port: internalPort,
              path: readinessProbePath,
              method: "GET",
              timeout: 1000,
            },
            (res) => {
              res.resume();
              res.once("end", resolve);
            },
          );
          req.on("timeout", () => req.destroy(new Error("readiness probe timeout")));
          req.on("error", reject);
          req.end();
        });

        markHandlersReady("internal_probe");
        return;
      } catch {
        await sleep(250);
      }
    }
  })();
}

function proxyToChild(req, res, internalPort) {
  const proxyReq = http.request(
    {
      hostname: internalHost,
      port: internalPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
      proxyRes.pipe(res);
    },
  );

  proxyReq.on("error", () => {
    if (!res.headersSent) {
      res.statusCode = 502;
      res.setHeader("content-type", "text/plain; charset=utf-8");
      res.end("bootstrap proxy upstream error");
    } else {
      res.destroy();
    }
  });

  req.pipe(proxyReq);
}

const internalPort = await allocatePort();
const childArgs = [...childExecArgv, runtimeBootstrap, entry];
const state = {
  childExited: false,
  childPid: null,
  handlersReady: false,
};

function markHandlersReady(reason) {
  if (state.handlersReady) return;
  state.handlersReady = true;
  emit("handlers_ready", {
    pid: process.pid,
    childPid: state.childPid,
    internalPort,
    publicPort,
    reason,
  });
}

function monitorChildOutputForReadiness(stream) {
  let buffer = "";
  stream?.on("data", (chunk) => {
    const text = chunk.toString();
    buffer = `${buffer}${text}`.slice(-4096);
    if (childOutputIndicatesReady(buffer)) {
      markHandlersReady("child_ready_log");
    }
  });
}

const server = http.createServer((req, res) => {
  if (isBootstrapHealthzRequest(req)) {
    emit("bootstrap_healthz_intercepted", {
      pid: process.pid,
      method: req.method,
      url: req.url,
      handlersReady: state.handlersReady,
      internalPort,
      publicPort,
    });
    res.statusCode = 200;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    if ((req.method ?? "").toUpperCase() === "HEAD") {
      res.end();
    } else {
      res.end("ok");
    }
    return;
  }

  if (!state.handlersReady) {
    res.statusCode = 503;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.setHeader("retry-after", "5");
    res.end("bootstrap: request handlers not ready");
    return;
  }

  proxyToChild(req, res, internalPort);
});

server.on("upgrade", (req, socket) => {
  if (!state.handlersReady) {
    socket.write("HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\n\r\n");
    socket.destroy();
    return;
  }
  socket.write("HTTP/1.1 501 Not Implemented\r\nConnection: close\r\n\r\n");
  socket.destroy();
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(publicPort, publicHost, resolve);
});

emit("server_listening", {
  pid: process.pid,
  appUrl: `http://${publicHost}:${publicPort}`,
  internalPort,
});

const child = spawn(process.execPath, childArgs, {
  stdio: ["ignore", "pipe", "pipe"],
  cwd: pkgRoot,
  env: {
    ...process.env,
    PORT: String(internalPort),
    HOSTNAME: internalHost,
  },
});

monitorChildOutputForReadiness(child.stdout);
monitorChildOutputForReadiness(child.stderr);
child.stdout?.on("data", (chunk) => process.stdout.write(chunk));
child.stderr?.on("data", (chunk) => process.stderr.write(chunk));

state.childPid = child.pid ?? null;

emit("standalone_spawn", {
  command: process.execPath,
  args: childArgs,
  parentExecArgv: process.execArgv,
  nodeOptions: process.env.NODE_OPTIONS,
  entry,
  runtimeBootstrap,
  pid: process.pid,
  childPid: state.childPid,
  cwd: pkgRoot,
  publicPort,
  internalPort,
});

emit("handlers_init_start", {
  pid: process.pid,
  childPid: state.childPid,
  publicPort,
  internalPort,
});

child.on("exit", async (code, signal) => {
  state.childExited = true;
  state.handlersReady = false;
  await new Promise((resolve) => server.close(resolve));
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});

waitForChildReadiness({ internalPort, state }).catch(async (error) => {
  emit("handlers_init_failed", {
    pid: process.pid,
    childPid: state.childPid,
    internalPort,
    error: error instanceof Error ? error.message : String(error),
  });
  if (!state.childExited && child.pid) {
    child.kill("SIGTERM");
  }
  await new Promise((resolve) => server.close(resolve));
  process.exit(1);
});
