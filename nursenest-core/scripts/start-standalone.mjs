#!/usr/bin/env node

import http from "node:http";
import net from "node:net";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { logRuntimeEnvSnapshot, validateRuntimeEnvOrThrow } from "./runtime-env-guard-bootstrap.mjs";
import { buildForwardedRuntimeEnv } from "./lib/runtime-env-contract.mjs";
import { loadRuntimeEnvFileFallback } from "./lib/runtime-env-file-fallback.mjs";
import { resolveBootstrapStartupMode } from "./resolve-bootstrap-mode.mjs";
import { verifyStandaloneArtifact } from "./verify-standalone-artifact.mjs";

const require = createRequire(import.meta.url);
const {
  createStartupWatchdogLogger,
} = require("./standalone-startup-watchdog-shared.cjs");

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const logger = createStartupWatchdogLogger();

const publicPort = Number(process.env.PORT || "8080");
const publicHostname = process.env.HOSTNAME || "0.0.0.0";
const childHostname = "127.0.0.1";
const readyTimeoutMs = Math.max(100, Number(process.env.NN_BOOTSTRAP_READY_TIMEOUT_MS || "90000"));
const childProbeTimeoutMs = Math.max(50, Number(process.env.NN_CHILD_HEALTH_TIMEOUT_MS || "750"));
const maxProbeAttempts = Math.max(1, Number(process.env.NN_BOOTSTRAP_READY_MAX_ATTEMPTS || "180"));
const forceFallbackEnabled = /^(1|true|yes)$/i.test(process.env.NN_ENABLE_FORCED_READINESS_FALLBACK || "");
const forceFallbackDelayMs = Math.max(100, Number(process.env.NN_FORCED_READINESS_FALLBACK_MS || "5000"));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function exitCodeFromSignal(signal) {
  if (signal === "SIGTERM") return 143;
  if (signal === "SIGINT") return 130;
  return 1;
}

function isStrictProductionEnvDisabled() {
  return /^(0|false|off|no)$/i.test(String(process.env.NN_STRICT_PRODUCTION_ENV || "").trim());
}

async function allocateInternalPort() {
  return await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, childHostname, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close((error) => {
        if (error) reject(error);
        else resolve(port);
      });
    });
  });
}

async function waitForTcpOpen(port, timeoutMs = 10_000) {
  const started = Date.now();
  while (Date.now() - started <= timeoutMs) {
    const ok = await new Promise((resolve) => {
      const socket = net.connect({ host: childHostname, port });
      socket.once("connect", () => {
        socket.destroy();
        resolve(true);
      });
      socket.once("error", () => resolve(false));
      socket.setTimeout(250, () => {
        socket.destroy();
        resolve(false);
      });
    });
    if (ok) return true;
    await sleep(25);
  }
  return false;
}

function sendPlain(res, status, body) {
  res.statusCode = status;
  res.setHeader("content-type", "text/plain; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(body);
}

function childProbePath() {
  return forceFallbackEnabled
    ? "/_nn_bootstrap_forced_readiness_check__"
    : "/_nn_bootstrap_ready_check__";
}

function childProbeUrl(internalPort) {
  return `http://${childHostname}:${internalPort}${childProbePath()}`;
}

function probeChild({ internalPort, method = "HEAD", timeoutMs = childProbeTimeoutMs }) {
  const probeUrl = childProbeUrl(internalPort);
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const req = http.request(
      probeUrl,
      { method, timeout: timeoutMs },
      (res) => {
        res.resume();
        res.on("end", () => {
          resolve({
            probeUrl,
            statusCode: res.statusCode || 0,
            durationMs: Date.now() - started,
          });
        });
      },
    );
    req.on("timeout", () => {
      req.destroy(new Error("probe timeout"));
    });
    req.on("error", (error) => {
      reject(Object.assign(error, { probeUrl, durationMs: Date.now() - started }));
    });
    req.end();
  });
}

function proxyToChild(req, res, internalPort) {
  const headers = { ...req.headers, host: `${childHostname}:${internalPort}` };
  const upstream = http.request(
    {
      hostname: childHostname,
      port: internalPort,
      method: req.method,
      path: req.url || "/",
      headers,
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers);
      upstreamRes.pipe(res);
    },
  );
  upstream.on("error", (error) => {
    if (!res.headersSent) {
      sendPlain(res, 502, "bootstrap: upstream unavailable");
    } else {
      res.destroy(error);
    }
  });
  req.pipe(upstream);
}

function createBootstrapServer(state) {
  return http.createServer((req, res) => {
    const method = (req.method || "GET").toUpperCase();
    let pathname = "/";
    try {
      pathname = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`).pathname;
    } catch {
      pathname = (req.url || "/").split("?")[0] || "/";
    }

    if (pathname === "/_nn_bootstrap_ready_check__") {
      sendPlain(res, 404, "not found");
      return;
    }

    if (!state.handlersReady) {
      if ((method === "GET" || method === "HEAD") && pathname === "/healthz") {
        res.statusCode = 200;
        res.setHeader("content-type", "text/plain; charset=utf-8");
        res.setHeader("cache-control", "no-store");
        res.end(method === "HEAD" ? undefined : "ok");
        return;
      }

      if ((method === "GET" || method === "HEAD") && pathname === "/readyz") {
        res.statusCode = 503;
        res.setHeader("content-type", "text/plain; charset=utf-8");
        res.setHeader("cache-control", "no-store");
        res.end(method === "HEAD" ? undefined : "bootstrap: request handlers not ready");
        return;
      }

      sendPlain(res, 503, "bootstrap: request handlers not ready");
      return;
    }

    if (state.forcedReady && (method === "GET" || method === "HEAD") && pathname === "/readyz") {
      res.statusCode = 200;
      res.setHeader("content-type", "text/plain; charset=utf-8");
      res.setHeader("cache-control", "no-store");
      res.end(method === "HEAD" ? undefined : "ready");
      return;
    }

    proxyToChild(req, res, state.internalPort);
  });
}

async function waitForChildReadiness(state) {
  if (state.readinessWatchdogBypass) {
    logger.emit("watchdog_bypass_enabled", { mode: state.mode });
    state.handlersReady = true;
    logger.logHandlersReady({ mode: state.mode, bypass: true });
    return;
  }

    logger.logHandlersInitStart({
    timeoutMs: readyTimeoutMs,
    maxAttempts: maxProbeAttempts,
    probeUrl: childProbeUrl(state.internalPort),
  });

  const started = Date.now();
  let attempts = 0;
  let forced = false;
  while (!state.childExited) {
    attempts += 1;
    const elapsed = Date.now() - started;

    if (attempts > maxProbeAttempts || elapsed > readyTimeoutMs) {
      const reason = elapsed > readyTimeoutMs ? "readiness_fatal_timeout" : "readiness_fatal_max_attempts";
      const childState = {
        childPid: state.child?.pid,
        childExited: state.childExited,
        exitCode: state.childExitCode,
        exitSignal: state.childExitSignal,
      };
      logger.logHandlersInitFailed({
        reason,
        timeoutMs: readyTimeoutMs,
        attempts,
        childState,
        probeUrl: childProbeUrl(state.internalPort),
      });
      console.error(
        `[nursenest-core] FATAL: readiness watchdog ${reason} timeoutMs=${readyTimeoutMs} attempts=${attempts} childState=${JSON.stringify(childState)}`,
      );
      process.exit(1);
    }

    if (forceFallbackEnabled && !forced && elapsed >= forceFallbackDelayMs) {
      forced = true;
      state.handlersReady = true;
      state.forcedReady = true;
      logger.emit("handlers_ready_forced", { viaEnv: true, delayMs: forceFallbackDelayMs, attempts });
      logger.logHandlersReady({ forced: true, viaEnv: true, attempts });
      return;
    }

    logger.emit("internal_probe_attempt", { attempts, internalPort: state.internalPort });
    try {
      const response = await probeChild({ internalPort: state.internalPort });
      logger.emit("internal_probe_response", response);
      if (response.statusCode >= 200 && response.statusCode < 400) {
        state.handlersReady = true;
        logger.logHandlersReady({ attempts, statusCode: response.statusCode, probeUrl: response.probeUrl });
        return;
      }
    } catch (error) {
      logger.emit("internal_probe_error", {
        attempts,
        probeUrl: error?.probeUrl || childProbeUrl(state.internalPort),
        error: error instanceof Error ? error.message : String(error),
        durationMs: error?.durationMs,
      });
    }
    await sleep(100);
  }
}

async function main() {
  loadRuntimeEnvFileFallback();
  logRuntimeEnvSnapshot();
  if (!isStrictProductionEnvDisabled()) {
    validateRuntimeEnvOrThrow();
  }

  const entry = verifyStandaloneArtifact(pkgRoot);
  const mode = resolveBootstrapStartupMode(process.env);
  for (const message of mode.errors) console.error(message);
  for (const message of mode.warnings) console.error(message);

  if (mode.mode === "direct_standalone") {
    process.env.NODE_ENV = "production";
    process.env.PORT = String(publicPort);
    process.env.HOSTNAME = publicHostname;
    logger.logStandaloneSpawn({
      entry,
      mode: mode.mode,
      command: `node ${relative(pkgRoot, entry)}`,
    });
    const child = spawn(process.execPath, [entry], {
      cwd: pkgRoot,
      env: buildForwardedRuntimeEnv(process.env, {
        NODE_ENV: "production",
        PORT: String(publicPort),
        HOSTNAME: publicHostname,
      }),
      stdio: "inherit",
    });
    child.on("exit", (code, signal) => {
      if (signal) process.exit(exitCodeFromSignal(signal));
      process.exit(code ?? 1);
    });
    return;
  }

  const internalPort = await allocateInternalPort();
  const state = {
    mode: mode.mode,
    readinessWatchdogBypass: mode.readinessWatchdogBypass,
    handlersReady: false,
    forcedReady: false,
    internalPort,
    child: null,
    childExited: false,
    childExitCode: null,
    childExitSignal: null,
  };

  const server = createBootstrapServer(state);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(publicPort, publicHostname, resolve);
  });
  logger.logServerListening({ host: publicHostname, port: publicPort, internalPort });

  const runtimeBootstrap = join(pkgRoot, "scripts", "start-standalone-runtime.cjs");
  const childEnv = buildForwardedRuntimeEnv(process.env, {
    NODE_ENV: "production",
    PORT: String(internalPort),
    HOSTNAME: childHostname,
  });
  const child = spawn(process.execPath, [runtimeBootstrap, entry], {
    cwd: pkgRoot,
    env: childEnv,
    stdio: "inherit",
  });
  state.child = child;
  const childBound = await waitForTcpOpen(internalPort);
  if (!childBound) {
    logger.logHandlersInitFailed({
      reason: "child_bind_timeout",
      timeoutMs: 10_000,
      childState: {
        childPid: child.pid,
        childExited: state.childExited,
        exitCode: state.childExitCode,
        exitSignal: state.childExitSignal,
      },
    });
    console.error("[nursenest-core] FATAL: child standalone server did not bind internal port");
    child.kill("SIGTERM");
    process.exit(1);
  }
  logger.logStandaloneSpawn({
    entry,
    mode: mode.mode,
    runtimeBootstrap,
    childPid: child.pid,
    command: `node ${relative(pkgRoot, runtimeBootstrap)} ${relative(pkgRoot, entry)}`,
    publicPort,
    internalPort,
  });

  child.on("exit", (code, signal) => {
    state.childExited = true;
    state.childExitCode = code;
    state.childExitSignal = signal;
    logger.emit("watchdog_child_process_exit", { code, signal, childPid: child.pid });
    if (signal) process.exit(exitCodeFromSignal(signal));
    process.exit(code ?? 1);
  });

  child.on("error", (error) => {
    logger.emit("watchdog_child_process_error", { error: error.message, childPid: child.pid });
    process.exit(1);
  });

  process.on("SIGTERM", () => child.kill("SIGTERM"));
  process.on("SIGINT", () => child.kill("SIGINT"));

  setTimeout(() => {
    void waitForChildReadiness(state);
  }, 250);
}

main().catch((error) => {
  console.error(`[nursenest-core] FATAL: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
