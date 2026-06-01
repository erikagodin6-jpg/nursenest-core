const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { monitorEventLoopDelay } = require("node:perf_hooks");

const DEFAULT_RECORDER_DIR = path.join(process.cwd(), "reports", "origin-black-box-recorder");

function boolEnvDisabled(name) {
  return /^(0|false|off|no)$/i.test(String(process.env[name] || "").trim());
}

function toMb(bytes) {
  return Math.round(bytes / 1024 / 1024);
}

function toMs(nanos) {
  if (!Number.isFinite(nanos)) return null;
  return Math.round(nanos / 1_000_000);
}

function safeJson(value) {
  return JSON.stringify(value, (_key, v) => {
    if (typeof v === "bigint") return v.toString();
    if (v instanceof Error) {
      return { name: v.name, message: v.message, stack: v.stack };
    }
    return v;
  });
}

function maskDatabaseUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value);
    const limit = url.searchParams.get("connection_limit");
    return {
      configured: true,
      host: url.hostname,
      port: url.port || null,
      database: url.pathname.replace(/^\//, "") || null,
      connectionLimit: limit ? Number.parseInt(limit, 10) : null,
    };
  } catch {
    return { configured: true, parseError: true };
  }
}

function createOriginBlackBoxRecorder({
  component,
  intervalMs = Number(process.env.NN_ORIGIN_BLACK_BOX_INTERVAL_MS || "15000"),
  outputDir = process.env.NN_ORIGIN_BLACK_BOX_DIR || DEFAULT_RECORDER_DIR,
  getState = () => ({}),
  requestState = null,
  enabled = !boolEnvDisabled("NN_ORIGIN_BLACK_BOX_RECORDER"),
} = {}) {
  if (!enabled) {
    return {
      record() {},
      stop() {},
      paths: null,
    };
  }

  const bootId = [
    new Date().toISOString().replace(/[:.]/g, "-"),
    component || "process",
    `pid-${process.pid}`,
  ].join("_");
  fs.mkdirSync(outputDir, { recursive: true });
  const timelinePath = path.join(outputDir, `${bootId}.jsonl`);
  const latestPath = path.join(outputDir, `${component || "process"}-latest.jsonl`);
  const histogram = monitorEventLoopDelay({ resolution: 20 });
  histogram.enable();

  const cpuStart = process.cpuUsage();
  const wallStart = Date.now();
  let lastCpu = cpuStart;
  let lastWall = wallStart;
  let lastTotalRequests = 0;

  const db = maskDatabaseUrl(process.env.DATABASE_URL);

  function buildSnapshot(event, extra = {}) {
    const now = Date.now();
    const memory = process.memoryUsage();
    const cpuNow = process.cpuUsage();
    const cpuDelta = process.cpuUsage(lastCpu);
    const wallDeltaMs = Math.max(1, now - lastWall);
    const cpuDeltaMs = (cpuDelta.user + cpuDelta.system) / 1000;
    const cpuPercent = Math.round((cpuDeltaMs / wallDeltaMs / Math.max(1, os.cpus().length)) * 10000) / 100;
    lastCpu = cpuNow;
    lastWall = now;

    const totalRequests = requestState?.totalRequests ?? 0;
    const requestDelta = Math.max(0, totalRequests - lastTotalRequests);
    lastTotalRequests = totalRequests;

    const state = getState() || {};
    return {
      ts: new Date(now).toISOString(),
      event,
      component: component || "process",
      pid: process.pid,
      ppid: typeof process.ppid === "number" ? process.ppid : null,
      uptimeSec: Math.round(process.uptime()),
      rssMb: toMb(memory.rss),
      heapUsedMb: toMb(memory.heapUsed),
      heapTotalMb: toMb(memory.heapTotal),
      externalMb: toMb(memory.external),
      arrayBuffersMb: toMb(memory.arrayBuffers),
      cpuPercent,
      cpuUserMs: Math.round(cpuNow.user / 1000),
      cpuSystemMs: Math.round(cpuNow.system / 1000),
      eventLoopLagMeanMs: toMs(histogram.mean),
      eventLoopLagP95Ms: toMs(histogram.percentile(95)),
      eventLoopLagMaxMs: toMs(histogram.max),
      activeRequests: requestState?.activeRequests ?? null,
      totalRequests,
      requestDelta,
      maxActiveRequests: requestState?.maxActiveRequests ?? null,
      activeDbConnections: null,
      dbPoolState: {
        ...db,
        activeConnections: null,
        reason: "prisma_pool_metrics_not_exposed_in_standalone_runtime",
      },
      ...state,
      ...extra,
    };
  }

  function append(snapshot) {
    const line = `${safeJson(snapshot)}\n`;
    try {
      fs.appendFileSync(timelinePath, line);
      fs.appendFileSync(latestPath, line);
    } catch (error) {
      console.error(`[nursenest-core] origin_black_box write_failed ${safeJson({
        component,
        error: error instanceof Error ? error.message : String(error),
        timelinePath,
      })}`);
    }
    console.error(`[nursenest-core] origin_black_box ${snapshot.event} ${safeJson(snapshot)}`);
    histogram.reset();
  }

  function record(event, extra = {}) {
    append(buildSnapshot(event, extra));
  }

  record("startup", { bootId, timelinePath });
  const timer = setInterval(() => record("sample"), Math.max(5_000, intervalMs));
  timer.unref();

  process.once("beforeExit", (code) => record("before_exit", { code }));
  process.once("exit", (code) => {
    try {
      record("exit", { code });
    } catch {
      // Ignore final synchronous logging failures.
    }
  });

  for (const signal of ["SIGTERM", "SIGINT", "SIGHUP"]) {
    process.once(signal, () => {
      record("signal", { signal });
    });
  }

  return {
    record,
    stop() {
      clearInterval(timer);
      histogram.disable();
    },
    paths: { timelinePath, latestPath, outputDir, bootId },
  };
}

module.exports = {
  createOriginBlackBoxRecorder,
};
