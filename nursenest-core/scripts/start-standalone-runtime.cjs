const path = require("node:path");
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

function startRuntimeResourceTelemetry() {
  if (/^(0|false|off|no)$/i.test(String(process.env.NN_RUNTIME_RESOURCE_TELEMETRY || "").trim())) return;

  const intervalMs = Math.max(5_000, Number(process.env.NN_RUNTIME_RESOURCE_TELEMETRY_INTERVAL_MS || "30000"));
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
