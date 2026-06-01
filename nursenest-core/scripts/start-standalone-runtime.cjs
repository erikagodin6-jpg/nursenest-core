const path = require("node:path");
const http = require("node:http");
const https = require("node:https");
const { monitorEventLoopDelay } = require("node:perf_hooks");

const entry = typeof process.argv[2] === "string" ? path.resolve(process.argv[2]) : "";

if (!entry) {
  console.error(
    `[nursenest-core] FATAL: missing standalone entry for bootstrap runtime ${JSON.stringify({
      pid: process.pid,
      argv: [...process.argv],
    })}`,
  );
  process.exit(1);
}

process.argv[1] = entry;

function installActiveRequestTelemetry() {
  const state = {
    activeRequests: 0,
    totalRequests: 0,
    maxActiveRequests: 0,
  };

  const patchServerPrototype = (moduleRef, label) => {
    const proto = moduleRef?.Server?.prototype;
    if (!proto || proto.__nnRuntimeActiveRequestTelemetry) return;
    const originalEmit = proto.emit;
    proto.emit = function nnRuntimeActiveRequestEmit(event, req, res, ...rest) {
      if (event === "request" && res && typeof res.once === "function") {
        state.activeRequests += 1;
        state.totalRequests += 1;
        state.maxActiveRequests = Math.max(state.maxActiveRequests, state.activeRequests);
        let completed = false;
        const complete = () => {
          if (completed) return;
          completed = true;
          state.activeRequests = Math.max(0, state.activeRequests - 1);
        };
        res.once("finish", complete);
        res.once("close", complete);
        res.once("error", complete);
      }
      return originalEmit.call(this, event, req, res, ...rest);
    };
    proto.__nnRuntimeActiveRequestTelemetry = { label };
  };

  patchServerPrototype(http, "http");
  patchServerPrototype(https, "https");
  return state;
}

function startRuntimeResourceTelemetry() {
  if (/^(0|false|off|no)$/i.test(String(process.env.NN_RUNTIME_RESOURCE_TELEMETRY || "").trim())) return;

  const requestState = installActiveRequestTelemetry();
  const intervalMs = Math.max(5_000, Number(process.env.NN_RUNTIME_RESOURCE_TELEMETRY_INTERVAL_MS || "15000"));
  const histogram = monitorEventLoopDelay({ resolution: 20 });
  histogram.enable();

  const logSnapshot = (event, extra = {}) => {
    const memory = process.memoryUsage();
    const cpu = process.cpuUsage();
    const toMb = (bytes) => Math.round(bytes / 1024 / 1024);
    const toMs = (nanos) => Math.round(nanos / 1_000_000);
    console.error(
      `[nursenest-core] runtime_resource ${event} ${JSON.stringify({
        pid: process.pid,
        rssMb: toMb(memory.rss),
        heapUsedMb: toMb(memory.heapUsed),
        heapTotalMb: toMb(memory.heapTotal),
        externalMb: toMb(memory.external),
        arrayBuffersMb: toMb(memory.arrayBuffers),
        cpuUserMs: Math.round(cpu.user / 1000),
        cpuSystemMs: Math.round(cpu.system / 1000),
        eventLoopLagMeanMs: toMs(histogram.mean),
        eventLoopLagP95Ms: toMs(histogram.percentile(95)),
        eventLoopLagMaxMs: toMs(histogram.max),
        activeRequests: requestState.activeRequests,
        totalRequests: requestState.totalRequests,
        maxActiveRequests: requestState.maxActiveRequests,
        ...extra,
      })}`,
    );
    histogram.reset();
  };

  logSnapshot("startup");
  const timer = setInterval(() => logSnapshot("sample"), intervalMs);
  timer.unref();

  process.once("beforeExit", (code) => logSnapshot("before_exit", { code }));
  process.once("exit", (code) => {
    try {
      logSnapshot("exit", { code });
    } catch {
      // Ignore final synchronous logging failures.
    }
  });
  for (const signal of ["SIGTERM", "SIGINT", "SIGHUP"]) {
    process.once(signal, () => {
      logSnapshot("signal", { signal });
      process.kill(process.pid, signal);
    });
  }
}

startRuntimeResourceTelemetry();

require("./standalone-startup-watchdog-preload.cjs");

try {
  require(entry);
} catch (err) {
  // Next.js 16+ standalone `server.js` is ESM (`import …`); `require()` throws ERR_REQUIRE_ESM.
  if (!err || err.code !== "ERR_REQUIRE_ESM") throw err;
  const { pathToFileURL } = require("node:url");
  void import(pathToFileURL(entry).href).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
