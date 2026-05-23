import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";

import { applyTraceInfoDefaults, runWithTraceContext } from "./context";
import { cloneTraceInfo } from "./metadata";
import type { BuildTraceEvent, BuildTraceHandle, BuildTraceInfo } from "./types";

const GLOBAL_KEY = Symbol.for("nn.buildTrace.state");

interface BuildTraceState {
  enabled: boolean;
  sequence: number;
  events: BuildTraceEvent[];
  pending: Map<string, BuildTraceEvent>;
  flushed: boolean;
}

const globalState = globalThis as typeof globalThis & {
  [GLOBAL_KEY]?: BuildTraceState;
};

function detectTracingEnabled(): boolean {
  if (typeof process === "undefined") return false;
  if (process.env.NN_DISABLE_BUILD_TRACE === "1") return false;
  if (process.env.NN_ENABLE_BUILD_TRACE === "1") return true;
  const phase = process.env.NEXT_PHASE ?? "";
  if (phase === "phase-production-build") return true;
  if (process.env.NN_CI_BUILD_CONVERGENCE === "1") return true;
  return false;
}

function getState(): BuildTraceState {
  if (!globalState[GLOBAL_KEY]) {
    const enabled = detectTracingEnabled();
    const state: BuildTraceState = {
      enabled,
      sequence: 0,
      events: [],
      pending: new Map(),
      flushed: false,
    };
    globalState[GLOBAL_KEY] = state;
    if (enabled) {
      registerProcessFlush(state);
    }
  }
  return globalState[GLOBAL_KEY]!;
}

export function isBuildTracingEnabled(): boolean {
  return getState().enabled;
}

function captureMemoryUsageMB(): number | undefined {
  if (typeof process === "undefined" || typeof process.memoryUsage !== "function") {
    return undefined;
  }
  try {
    const rss = process.memoryUsage().rss;
    return Math.round((rss / 1024 / 1024) * 100) / 100;
  } catch {
    return undefined;
  }
}

function logTrace(prefix: string, payload: Record<string, unknown>): void {
  try {
    const text = JSON.stringify(payload);
    console.log(`[build-trace] ${prefix} ${text}`);
  } catch {
    console.log(`[build-trace] ${prefix}`);
  }
}

function internalStartTrace(state: BuildTraceState, info: BuildTraceInfo): BuildTraceHandle {
  const resolvedInfo = cloneTraceInfo(info);
  const id = `${resolvedInfo.kind}:${++state.sequence}`;
  const startTimeMs = performance.now();
  const event: BuildTraceEvent = {
    ...resolvedInfo,
    id,
    startTimeMs,
    memoryStartMB: captureMemoryUsageMB(),
  };
  state.events.push(event);
  state.pending.set(id, event);

  logTrace(`${event.kind}_start`, {
    id,
    name: event.name,
    path: event.path,
    route: event.route,
    phase: event.phase,
    meta: event.meta,
    memoryStartMB: event.memoryStartMB,
  });

  return {
    id,
    info: resolvedInfo,
    startTimeMs,
    memoryStartMB: event.memoryStartMB,
    active: true,
  };
}

export function startTrace(info: BuildTraceInfo): BuildTraceHandle {
  const state = getState();
  if (!state.enabled) {
    return {
      id: "noop",
      info,
      startTimeMs: performance.now(),
      active: false,
    };
  }

  const resolvedInfo = applyTraceInfoDefaults(info);
  return internalStartTrace(state, resolvedInfo);
}

export function endTrace(handle: BuildTraceHandle, meta?: Record<string, unknown>): void {
  const state = getState();
  if (!handle.active) return;
  const event = state.pending.get(handle.id);
  if (!event) return;

  const endTimeMs = performance.now();
  event.endTimeMs = endTimeMs;
  event.durationMs = Math.max(0, endTimeMs - event.startTimeMs);
  event.memoryEndMB = captureMemoryUsageMB();
  if (meta) {
    event.meta = { ...(event.meta ?? {}), ...meta };
  }

  state.pending.delete(handle.id);

  if (event.warningThresholdMs && event.durationMs > event.warningThresholdMs) {
    const warning = {
      message: `${event.name} exceeded ${event.warningThresholdMs}ms`,
      durationMs: event.durationMs,
      thresholdMs: event.warningThresholdMs,
    };
    event.warnings = [...(event.warnings ?? []), warning];
    logTrace("async_boundary_warning", {
      id: event.id,
      name: event.name,
      durationMs: event.durationMs,
      thresholdMs: event.warningThresholdMs,
      path: event.path,
      route: event.route,
    });
  }

  logTrace(`${event.kind}_end`, {
    id: event.id,
    name: event.name,
    path: event.path,
    route: event.route,
    durationMs: event.durationMs,
    memoryStartMB: event.memoryStartMB,
    memoryEndMB: event.memoryEndMB,
    meta: event.meta,
  });
}

export function recordRequestApiUsage(details: {
  api: string;
  module?: string;
  path?: string;
  route?: string;
  meta?: Record<string, unknown>;
}): void {
  const state = getState();
  if (!state.enabled) return;

  const info = applyTraceInfoDefaults({
    kind: "request-api",
    name: details.api,
    path: details.path,
    route: details.route,
    phase: "build",
    meta: {
      module: details.module,
      ...(details.meta ?? {}),
    },
  });

  const eventInfo = cloneTraceInfo(info);
  const id = `request-api:${++state.sequence}`;
  const now = performance.now();

  const event: BuildTraceEvent = {
    ...eventInfo,
    id,
    startTimeMs: now,
    endTimeMs: now,
    durationMs: 0,
  };

  state.events.push(event);

  logTrace("request_api", {
    id,
    api: details.api,
    module: details.module,
    path: event.path,
    route: event.route,
    phase: event.phase,
  });
}

function registerProcessFlush(state: BuildTraceState): void {
  const flush = () => flushEvents(state);
  process.once("beforeExit", flush);
  process.once("exit", flush);
  process.once("SIGINT", flush);
  process.once("SIGTERM", flush);
}

function flushEvents(state: BuildTraceState): void {
  if (state.flushed) return;
  state.flushed = true;
  if (!state.events.length) return;

  // Ensure any pending traces are closed
  const now = performance.now();
  for (const event of state.pending.values()) {
    event.endTimeMs = now;
    event.durationMs = Math.max(0, now - event.startTimeMs);
  }
  state.pending.clear();

  const payload = {
    generatedAt: new Date().toISOString(),
    events: state.events,
  };

  try {
    const cwd = process.cwd();
    const reportsDir = path.resolve(cwd, "reports");
    fs.mkdirSync(reportsDir, { recursive: true });
    const file = path.join(reportsDir, "build-route-timings.json");
    fs.writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");
  } catch (error) {
    console.error("[build-trace] failed_to_write_report", error);
  }
}

function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof (value as any).then === "function"
  );
}

export function withTrace<T>(info: BuildTraceInfo, fn: () => T | Promise<T>): T | Promise<T> {
  const state = getState();
  if (!state.enabled) {
    return fn();
  }

  const resolvedInfo = applyTraceInfoDefaults(info);

  return runWithTraceContext(resolvedInfo, () => {
    const handle = internalStartTrace(state, resolvedInfo);
    const finalize = (meta?: Record<string, unknown>) => endTrace(handle, meta);

    try {
      const result = fn();
      if (isPromiseLike(result)) {
        return result
          .then((value) => {
            finalize();
            return value;
          })
          .catch((error) => {
            finalize({ error: error instanceof Error ? error.message : String(error) });
            throw error;
          });
      }
      finalize();
      return result;
    } catch (error) {
      finalize({ error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  });
}

export { logTrace };
