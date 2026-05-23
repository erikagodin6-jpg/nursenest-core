import type React from "react";

import type { BuildTraceInfo, BuildTraceKind } from "./types";
import { withTrace } from "./state";
import { cloneTraceInfo, createTraceInfo } from "./metadata";

interface TraceWrapperOptions {
  name?: string;
  phase?: string;
  route?: string;
  meta?: Record<string, unknown>;
  warningThresholdMs?: number;
}

type AnyFunction = (...args: any[]) => any;

type InferReturn<T extends AnyFunction> = ReturnType<T>;

type TraceFunctionConfig = TraceWrapperOptions & {
  kind: BuildTraceKind;
};

function traceFunction<F extends AnyFunction>(info: BuildTraceInfo, fn: F): F {
  const traced = function tracedFunction(this: unknown, ...args: Parameters<F>): InferReturn<F> {
    const clonedInfo = cloneTraceInfo(info);
    return withTrace(clonedInfo, () => fn.apply(this, args as Parameters<F>));
  } as F;

  try {
    Object.defineProperty(traced, "name", {
      value: fn.name || info.name || "traced",
      configurable: true,
    });
  } catch {
    // ignore — non-critical
  }

  return traced;
}

function resolveTraceInfo(importMeta: ImportMeta, fn: AnyFunction, config: TraceFunctionConfig): BuildTraceInfo {
  const name = config.name ?? fn.name ?? `anonymous_${config.kind}`;
  return createTraceInfo(importMeta, {
    kind: config.kind,
    name,
    phase: config.phase,
    route: config.route,
    meta: config.meta,
    warningThresholdMs: config.warningThresholdMs,
  });
}

function createTracedFunction<F extends AnyFunction>(
  importMeta: ImportMeta,
  fn: F,
  config: TraceFunctionConfig,
): F {
  const info = resolveTraceInfo(importMeta, fn, config);
  return traceFunction(info, fn);
}

export function traceRoute<P>(
  importMeta: ImportMeta,
  component: (props: P) => React.ReactNode | Promise<React.ReactNode>,
  options: TraceWrapperOptions = {},
) {
  return createTracedFunction(importMeta, component, {
    kind: "route",
    phase: options.phase ?? "render",
    route: options.route,
    meta: options.meta,
    name: options.name,
    warningThresholdMs: options.warningThresholdMs,
  });
}

export function traceLayout<P>(
  importMeta: ImportMeta,
  component: (props: P) => React.ReactNode | Promise<React.ReactNode>,
  options: TraceWrapperOptions = {},
) {
  return createTracedFunction(importMeta, component, {
    kind: "layout",
    phase: options.phase ?? "layout",
    route: options.route,
    meta: options.meta,
    name: options.name,
    warningThresholdMs: options.warningThresholdMs,
  });
}

export function traceProvider<F extends AnyFunction>(
  importMeta: ImportMeta,
  fn: F,
  options: TraceWrapperOptions = {},
): F {
  return createTracedFunction(importMeta, fn, {
    kind: "provider",
    phase: options.phase ?? "provider",
    route: options.route,
    meta: options.meta,
    name: options.name,
    warningThresholdMs: options.warningThresholdMs,
  });
}

export function tracePageData<F extends AnyFunction>(
  importMeta: ImportMeta,
  fn: F,
  options: TraceWrapperOptions = {},
): F {
  return createTracedFunction(importMeta, fn, {
    kind: "page-data",
    phase: options.phase ?? "page-data",
    route: options.route,
    meta: options.meta,
    name: options.name,
    warningThresholdMs: options.warningThresholdMs,
  });
}

export function traceStaticGeneration<F extends AnyFunction>(
  importMeta: ImportMeta,
  fn: F,
  options: TraceWrapperOptions = {},
): F {
  return createTracedFunction(importMeta, fn, {
    kind: "static-generation",
    phase: options.phase ?? "static-generation",
    route: options.route,
    meta: options.meta,
    name: options.name,
    warningThresholdMs: options.warningThresholdMs,
  });
}

export function traceAsyncTask<F extends AnyFunction>(
  importMeta: ImportMeta,
  fn: F,
  options: TraceWrapperOptions = {},
): F {
  return createTracedFunction(importMeta, fn, {
    kind: "async-boundary",
    phase: options.phase ?? "async",
    route: options.route,
    meta: options.meta,
    name: options.name,
    warningThresholdMs: options.warningThresholdMs,
  });
}

export type { TraceWrapperOptions };
