import {
  endTrace,
  isBuildTracingEnabled,
  logTrace,
  recordRequestApiUsage,
  startTrace,
  withTrace,
} from "./state";
import {
  traceAsyncTask,
  traceLayout,
  tracePageData,
  traceProvider,
  traceRoute,
  traceStaticGeneration,
} from "./helpers";
import { createTraceInfo } from "./metadata";
import type { BuildTraceHandle, BuildTraceInfo, BuildTraceKind } from "./types";

export type { BuildTraceHandle, BuildTraceInfo, BuildTraceKind } from "./types";
export type { TraceWrapperOptions } from "./helpers";

export function withBuildTrace<T>(info: BuildTraceInfo, fn: () => T | Promise<T>): T | Promise<T> {
  return withTrace(info, fn);
}

export const startBuildTrace = startTrace;
export const endBuildTrace = endTrace;
export const noteBuildRequestApiUsage = recordRequestApiUsage;
export const buildTracingEnabled = isBuildTracingEnabled;
export const logBuildTrace = logTrace;

export function withAsyncBoundary<T>(
  info: BuildTraceInfo & { warningThresholdMs?: number },
  fn: () => T | Promise<T>,
): T | Promise<T> {
  return withTrace({ ...info, kind: "async-boundary" }, fn);
}

export {
  createTraceInfo,
  traceRoute,
  traceLayout,
  traceProvider,
  tracePageData,
  traceStaticGeneration,
  traceAsyncTask,
};
