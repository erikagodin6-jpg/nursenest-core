#!/usr/bin/env node
/**
 * Production entry: bind a tiny bootstrap HTTP server on the public port immediately, then
 * run Next standalone on a private loopback port. Public `GET/HEAD /healthz` reports liveness
 * immediately. Public `/readyz` only flips to 200 after the child can answer a real health route,
 * and all other traffic waits for the same readiness gate before proxying.
 */
import http from "node:http";
import net from "node:net";
import { once } from "node:events";
import { setTimeout as sleep } from "node:timers/promises";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyStandaloneArtifact } from "./verify-standalone-artifact.mjs";
import { normalizeBootstrapProbePathname } from "./standalone-bootstrap-probe-pathname.mjs";

const bootAt = Date.now();
const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const runtimeBootstrap = join(pkgRoot, "scripts", "start-standalone-runtime.cjs");
let entry;
try {
  entry = verifyStandaloneArtifact(pkgRoot);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[nursenest-core] FATAL: ${message}`);
  process.exit(1);
}

if (process.env.NODE_ENV !== "production") {
  process.env.NODE_ENV = "production";
}

const publicPort = Number.parseInt(process.env.PORT ?? "3000", 10) || 3000;
const publicHost = process.env.HOSTNAME || "0.0.0.0";
const internalHost = "127.0.0.1";
const livenessProbePath = "/healthz";
const readinessProbePath = "/readyz";
/** Lightweight internal-only child probe, hidden from public traffic. */
const childBootstrapProbePath = "/_nn_bootstrap_ready_check__";
/** Probe the child server bind path directly; public readiness still gates on `handlersReady`. */
const childHealthProbePath = childBootstrapProbePath;
const bootstrapReadyTimeoutMs = Number.parseInt(process.env.NN_BOOTSTRAP_READY_TIMEOUT_MS ?? "900000", 10) || 900000;
const bootstrapReadyMaxAttempts = Math.max(
  1,
  Number.parseInt(process.env.NN_BOOTSTRAP_READY_MAX_ATTEMPTS ?? "120", 10) || 120,
);
const bootstrapTestDelayMs = Number.parseInt(process.env.NN_BOOTSTRAP_TEST_DELAY_MS ?? "0", 10) || 0;
const childHealthProbeTimeoutMs = Number.parseInt(process.env.NN_CHILD_HEALTH_TIMEOUT_MS ?? "1000", 10) || 1000;
/** NN_BYPASS_BOOTSTRAP=1: skip internal child readiness watchdog (ops recovery when the probe never succeeds). */
const BYPASS = process.env.NN_BYPASS_BOOTSTRAP === "1";
const memMb = process.env.NODE_MAX_OLD_SPACE_SIZE_MB ?? "512";
const baseNodeOptions = (process.env.NODE_OPTIONS ?? "").trim();
const hasHeapOverride =
  baseNodeOptions.includes("--max-old-space-size") ||
  process.execArgv.some((arg) => arg.startsWith("--max-old-space-size"));
const childExecArgv = hasHeapOverride ? [...process.execArgv] : [`--max-old-space-size=${memMb}`, ...process.execArgv];

function emit(event, meta = {}) {
  console.error(`[nursenest-core] startup_watchdog ${event} ${JSON.stringify({ ...meta, msSinceBoot: Date.now() - bootAt })}`);
}

/** TEMP: remove after diagnosing external /readyz vs bootstrap (logs stderr only for normalized `/readyz`). */
function isReadyzTraceRequest(req) {
  return normalizeBootstrapProbePathname(req) === readinessProbePath;
}

function logReadyzTrace(phase, payload) {
  console.error(`[nursenest-core] readyz_trace ${phase} ${JSON.stringify({ ...payload, msSinceBoot: Date.now() - bootAt })}`);
}

/**
 * GET/HEAD only. Pathname must equal one of: /healthz, /readyz, /_nn_bootstrap_ready_check__ (after normalize).
 * @returns {boolean} true if matched and response was fully written
 */
function handleBootstrapRequest(req, res) {
  const method = typeof req?.method === "string" ? req.method.toUpperCase() : "";
  if (method !== "GET" && method !== "HEAD") return false;

  const pathname = normalizeBootstrapProbePathname(req);
  if (
    pathname !== livenessProbePath &&
    pathname !== readinessProbePath &&
    pathname !== childBootstrapProbePath
  ) {
    return false;
  }

  if (pathname === livenessProbePath) {
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
    if (method === "HEAD") {
      res.end();
    } else {
      res.end("ok");
    }
    return true;
  }

  if (pathname === readinessProbePath) {
    emit("bootstrap_healthz_intercepted", {
      pid: process.pid,
      method: req.method,
      url: req.url,
      handlersReady: state.handlersReady,
      internalPort,
      publicPort,
    });
    if (!state.handlersReady) {
      res.statusCode = 503;
      res.setHeader("content-type", "text/plain; charset=utf-8");
      res.setHeader("cache-control", "no-store");
      res.setHeader("retry-after", "5");
      if (method === "HEAD") {
        res.end();
      } else {
        res.end("bootstrap: request handlers not ready");
      }
      logReadyzTrace("bootstrap_handler_close", { status: 503, handled: true });
      return true;
    }
    res.statusCode = 200;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    if (method === "HEAD") {
      res.end();
    } else {
      res.end("ok");
    }
    logReadyzTrace("bootstrap_handler_close", { status: 200, handled: true });
    return true;
  }

  res.statusCode = 404;
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  if (method === "HEAD") {
    res.end();
  } else {
    res.end("not found");
  }
  return true;
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

function childHealthProbeUrl(probePort) {
  return `http://${internalHost}:${probePort}${childHealthProbePath}`;
}

function assertInternalProbePort(probePort) {
  if (probePort !== internalPort) {
    throw new Error("child readiness probes must target the internal port");
  }
}

function snapshotChildState(state) {
  return JSON.stringify({
    childPid: state.childPid,
    childExited: state.childExited,
    childExitCode: state.childExitCode,
    childExitSignal: state.childExitSignal,
    handlersReady: state.handlersReady,
  });
}

function formatReadinessFailure({
  state,
  probeUrl,
  timeoutMs,
  attempt,
  detail,
}) {
  const parts = [
    "standalone child readiness failed",
    `probeUrl=${probeUrl}`,
    `timeoutMs=${timeoutMs}`,
    `childState=${snapshotChildState(state)}`,
  ];
  if (typeof attempt === "number") {
    parts.push(`attempt=${attempt}`);
  }
  if (detail) {
    parts.push(`detail=${detail}`);
  }
  return parts.join(" ");
}

function waitForChildReadiness({ state }) {
  const startedAt = Date.now();
  let attempt = 0;

  return (async () => {
    emit("child_readiness_watchdog_start", {
      pid: process.pid,
      bypass: BYPASS,
      bootstrapReadyTimeoutMs,
      bootstrapReadyMaxAttempts,
      childHealthProbePath,
      childHealthProbeTimeoutMs,
      internalPort,
      publicPort,
    });
    if (BYPASS) {
      emit("watchdog_bypass_enabled", {
        pid: process.pid,
        childPid: state.childPid,
        publicPort,
        internalPort,
      });
      return;
    }
    if (bootstrapTestDelayMs > 0) {
      await sleep(bootstrapTestDelayMs);
    }
    while (!state.handlersReady) {
      if (state.childExited) {
        const probeUrl = childHealthProbeUrl(internalPort);
        const reason =
          "FATAL: standalone child process exited before HEAD " +
          `${childHealthProbePath} succeeded (internalPort=${internalPort}, probeUrl=${probeUrl})`;
        emit("readiness_fatal_child_exited", {
          pid: process.pid,
          childPid: state.childPid,
          exitCode: state.childExitCode,
          exitSignal: state.childExitSignal,
          probeUrl,
          reason,
        });
        console.error(`[nursenest-core] ${reason}`);
        throw new Error("standalone child exited before handlers became ready");
      }
      if (Date.now() - startedAt > bootstrapReadyTimeoutMs) {
        const probeUrl = childHealthProbeUrl(internalPort);
        const reason =
          `FATAL: readiness watchdog timeout after ${bootstrapReadyTimeoutMs}ms without successful HEAD ` +
          `${childHealthProbePath} on internalPort=${internalPort} (attempts=${attempt}, probeUrl=${probeUrl})`;
        emit("readiness_fatal_timeout", {
          pid: process.pid,
          childPid: state.childPid,
          attempt,
          probeUrl,
          timeoutMs: bootstrapReadyTimeoutMs,
          childHealthProbePath,
          reason,
          childState: JSON.parse(snapshotChildState(state)),
        });
        emit("internal_probe_exhausted", {
          attempt,
          probeUrl,
          reason: "timeout",
          timeoutMs: bootstrapReadyTimeoutMs,
          childState: JSON.parse(snapshotChildState(state)),
        });
        console.error(`[nursenest-core] ${reason}`);
        throw new Error(
          formatReadinessFailure({
            state,
            probeUrl,
            timeoutMs: bootstrapReadyTimeoutMs,
            attempt,
            detail: "startup watchdog deadline exceeded",
          }),
        );
      }

      try {
        attempt += 1;
        emit("readiness_probe_cycle", {
          attempt,
          elapsedMs: Date.now() - startedAt,
          probeUrl: childHealthProbeUrl(internalPort),
        });
        await probeChildHealth(internalPort, attempt);

        markHandlersReady("internal_probe");
        return;
      } catch (error) {
        if (attempt >= bootstrapReadyMaxAttempts) {
          const detail = error instanceof Error ? error.message : String(error);
          const probeUrl = childHealthProbeUrl(internalPort);
          const reason =
            `FATAL: readiness watchdog gave up after ${attempt} failed HEAD attempts to ` +
            `${childHealthProbePath} (maxAttempts=${bootstrapReadyMaxAttempts}, lastError=${detail}, probeUrl=${probeUrl})`;
          emit("readiness_fatal_max_attempts", {
            pid: process.pid,
            childPid: state.childPid,
            attempt,
            maxAttempts: bootstrapReadyMaxAttempts,
            probeUrl,
            lastError: detail,
            reason,
            childState: JSON.parse(snapshotChildState(state)),
          });
          emit("internal_probe_exhausted", {
            attempt,
            probeUrl,
            reason: "attempt_cap",
            maxAttempts: bootstrapReadyMaxAttempts,
            error: detail,
            childState: JSON.parse(snapshotChildState(state)),
          });
          console.error(`[nursenest-core] ${reason}`);
          throw new Error(
            formatReadinessFailure({
              state,
              probeUrl,
              timeoutMs: bootstrapReadyTimeoutMs,
              attempt,
              detail,
            }),
          );
        }
        emit("internal_probe_error", {
          attempt,
          probeUrl: childHealthProbeUrl(internalPort),
          error: error instanceof Error ? error.message : String(error),
          code:
            error && typeof error === "object" && "code" in error && typeof error.code === "string"
              ? error.code
              : undefined,
        });
        await sleep(250);
      }
    }
  })();
}

function probeChildHealth(probePort, attempt) {
  assertInternalProbePort(probePort);
  const probeUrl = childHealthProbeUrl(probePort);
  emit("internal_probe_attempt", {
    attempt,
    probeUrl,
    method: "HEAD",
    timeoutMs: childHealthProbeTimeoutMs,
  });
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: internalHost,
        port: probePort,
        path: childHealthProbePath,
        method: "HEAD",
        timeout: childHealthProbeTimeoutMs,
      },
      (res) => {
        res.resume();
        res.once("end", () => {
          const statusCode = res.statusCode ?? 500;
          emit("internal_probe_response", {
            attempt,
            probeUrl,
            statusCode,
          });
          if (statusCode >= 200 && statusCode < 300) {
            resolve({ statusCode });
            return;
          }
          reject(new Error(`child health probe returned ${statusCode}`));
        });
      },
    );
    req.on("timeout", () => req.destroy(new Error("child health probe timeout")));
    req.on("error", reject);
    req.end();
  });
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
  childExitCode: null,
  childExitSignal: null,
  childPid: null,
  handlersReady: false,
};

function markHandlersReady(reason) {
  if (state.handlersReady) return;
  const wasReady = state.handlersReady;
  state.handlersReady = true;
  emit("handlers_ready_flip", {
    pid: process.pid,
    childPid: state.childPid,
    internalPort,
    publicPort,
    reason,
    handlersReadyBefore: wasReady,
    handlersReadyAfter: true,
  });
  emit("handlers_ready", {
    pid: process.pid,
    childPid: state.childPid,
    internalPort,
    publicPort,
    reason,
    handlersReadyBefore: wasReady,
    handlersReadyAfter: true,
  });
}

async function serveAfterBootstrapProbe(req, res) {
  const traceReadyz = isReadyzTraceRequest(req);
  if (traceReadyz) {
    logReadyzTrace("serve_after_enter", {
      method: req.method,
      rawUrl: req.url,
      pathNorm: normalizeBootstrapProbePathname(req),
      handlersReady: state.handlersReady,
    });
  }
  if (!state.handlersReady) {
    res.statusCode = 503;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.setHeader("retry-after", "5");
    res.end("bootstrap: request handlers not ready");
    if (traceReadyz) {
      logReadyzTrace("serve_after_close", { status: 503, proxied: false });
    }
    return;
  }

  if (traceReadyz) {
    logReadyzTrace("proxy_to_child", {
      method: req.method,
      rawUrl: req.url,
      pathNorm: normalizeBootstrapProbePathname(req),
    });
  }
  proxyToChild(req, res, internalPort);
}

const server = http.createServer((req, res) => {
  const traceReadyz = isReadyzTraceRequest(req);
  if (traceReadyz) {
    logReadyzTrace("inbound", {
      method: req.method,
      rawUrl: req.url,
      pathNorm: normalizeBootstrapProbePathname(req),
      handlersReady: state.handlersReady,
    });
  }
  const intercepted = handleBootstrapRequest(req, res);
  if (traceReadyz) {
    logReadyzTrace("after_bootstrap_handler", { intercepted });
  }
  if (intercepted) {
    return;
  }
  if (traceReadyz) {
    logReadyzTrace("fallthrough", { next: "serveAfterBootstrapProbe" });
  }
  void serveAfterBootstrapProbe(req, res).catch(() => {
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "text/plain; charset=utf-8");
      res.setHeader("cache-control", "no-store");
      res.end("bootstrap health handler error");
    } else {
      res.destroy();
    }
  });
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
  publicHost,
  publicPort,
  internalPort,
  nodeEnv: process.env.NODE_ENV ?? null,
  mode: "bootstrap_proxy",
  livenessProbePath,
  readinessProbePath,
  childHealthProbePath,
  childBootstrapProbePath,
});

if (BYPASS) {
  markHandlersReady("watchdog_bypass_after_bind");
}

const child = spawn(process.execPath, childArgs, {
  stdio: ["ignore", "pipe", "pipe"],
  cwd: pkgRoot,
  env: {
    ...process.env,
    PORT: String(internalPort),
    HOSTNAME: internalHost,
  },
});

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
  state.childExitCode = code ?? null;
  state.childExitSignal = signal ?? null;
  state.handlersReady = false;
  emit("watchdog_child_process_exit", {
    pid: process.pid,
    childPid: state.childPid,
    exitCode: code ?? null,
    exitSignal: signal ?? null,
    nextParentExitCode: signal ? "signal_forward" : code ?? 1,
  });
  await new Promise((resolve) => server.close(resolve));
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  emit("watchdog_parent_process_exit", { pid: process.pid, exitCode: code ?? 1, cause: "child_exit" });
  process.exit(code ?? 1);
});

waitForChildReadiness({ state }).catch(async (error) => {
  const message = error instanceof Error ? error.message : String(error);
  emit("handlers_init_failed", {
    pid: process.pid,
    childPid: state.childPid,
    internalPort,
    error: message,
  });
  emit("watchdog_parent_process_exit", {
    pid: process.pid,
    exitCode: 1,
    cause: "readiness_watchdog_failed",
    error: message,
  });
  console.error(
    `[nursenest-core] FATAL: startup readiness watchdog exiting parent (exit=1): ${message}`,
  );
  if (!state.childExited && child.pid) {
    child.kill("SIGTERM");
  }
  await new Promise((resolve) => server.close(resolve));
  process.exit(1);
});
