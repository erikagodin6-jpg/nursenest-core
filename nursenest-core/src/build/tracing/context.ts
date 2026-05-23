import { AsyncLocalStorage } from "node:async_hooks";

import type { BuildTraceInfo } from "./types";

type LayoutStackEntry = {
  name?: string;
  path?: string;
  route?: string;
};

interface BuildTraceContext {
  info: BuildTraceInfo;
  route?: string;
  path?: string;
  layoutStack: LayoutStackEntry[];
}

const storage = typeof AsyncLocalStorage !== "undefined"
  ? new AsyncLocalStorage<BuildTraceContext>()
  : undefined;

export function runWithTraceContext<T>(info: BuildTraceInfo, fn: () => T): T {
  if (!storage) {
    return fn();
  }

  const parent = storage.getStore();
  const layoutStack = parent?.layoutStack ? [...parent.layoutStack] : [];

  if (info.kind === "layout") {
    layoutStack.push({ name: info.name, path: info.path, route: info.route });
  }

  const route = info.route ?? parent?.route;
  const context: BuildTraceContext = {
    info,
    route,
    path: info.path ?? parent?.path,
    layoutStack,
  };

  return storage.run(context, fn);
}

export function getCurrentTraceContext(): BuildTraceContext | undefined {
  return storage?.getStore();
}

export function applyTraceInfoDefaults(info: BuildTraceInfo): BuildTraceInfo {
  const context = getCurrentTraceContext();
  if (!context) {
    return info;
  }

  const resolved: BuildTraceInfo = { ...info };

  if (!resolved.route && context.route) {
    resolved.route = context.route;
  }

  if (!resolved.path && context.path) {
    resolved.path = context.path;
  }

  if (!resolved.phase && context.info?.phase) {
    resolved.phase = context.info.phase;
  }

  if (context.layoutStack.length && resolved.kind !== "layout") {
    const stack = context.layoutStack
      .map((entry) => entry.path ?? entry.name)
      .filter((value): value is string => Boolean(value));
    if (stack.length) {
      resolved.meta = {
        layoutStack: stack,
        ...(resolved.meta ?? {}),
      };
    }
  }

  return resolved;
}
