import path from "node:path";
import { fileURLToPath } from "node:url";

import type { BuildTraceInfo, BuildTraceKind } from "./types";

interface ModuleTraceDetails {
  filePath: string;
  route?: string;
  moduleType?: string;
  segmentGroups: string[];
  parallelRoutes: string[];
}

interface TraceInfoOptions {
  kind: BuildTraceKind;
  name: string;
  phase?: string;
  route?: string;
  meta?: Record<string, unknown>;
  warningThresholdMs?: number;
  path?: string;
}

const APP_DIR_SEGMENT = "src/app";

function toPosix(value: string): string {
  return value.replace(/\\/g, "/");
}

function safeFileURLToPath(url: string): string {
  try {
    return fileURLToPath(url);
  } catch {
    return url;
  }
}

function resolveModuleTraceDetails(importMeta: ImportMeta): ModuleTraceDetails {
  const url = (importMeta as { url?: string } | undefined)?.url;
  if (!url) {
    return {
      filePath: "(unknown)",
      segmentGroups: [],
      parallelRoutes: [],
    };
  }

  const absolutePath = safeFileURLToPath(url);
  const relativePath = toPosix(path.relative(process.cwd(), absolutePath));

  const details: ModuleTraceDetails = {
    filePath: relativePath,
    route: undefined,
    moduleType: undefined,
    segmentGroups: [],
    parallelRoutes: [],
  };

  const appIndex = relativePath.indexOf(`${APP_DIR_SEGMENT}/`);
  if (appIndex === -1) {
    return details;
  }

  const appSubPath = relativePath.slice(appIndex + APP_DIR_SEGMENT.length + 1);
  if (!appSubPath) {
    details.route = "/";
    return details;
  }

  const segments = appSubPath.split("/").filter(Boolean);
  if (segments.length === 0) {
    details.route = "/";
    return details;
  }

  const fileName = segments.pop() ?? "";
  const moduleType = fileName.split(".")[0] ?? undefined;
  details.moduleType = moduleType;

  const routeSegments: string[] = [];
  for (const segment of segments) {
    if (!segment) continue;
    if (segment.startsWith("(") && segment.endsWith(")")) {
      const groupName = segment.slice(1, -1);
      if (groupName) {
        details.segmentGroups.push(groupName);
      }
      continue;
    }
    if (segment.startsWith("@")) {
      const parallelName = segment.slice(1);
      if (parallelName) {
        details.parallelRoutes.push(parallelName);
      }
      continue;
    }
    routeSegments.push(segment);
  }

  if (routeSegments.length === 0) {
    details.route = "/";
  } else {
    details.route = `/${routeSegments.join("/")}`.replace(/\/+/g, "/");
  }

  return details;
}

function mergeMeta(base?: Record<string, unknown>, extra?: Record<string, unknown>): Record<string, unknown> | undefined {
  const merged = { ...(base ?? {}) } as Record<string, unknown>;
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      merged[key] = value;
    }
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
}

export function createTraceInfo(importMeta: ImportMeta, options: TraceInfoOptions): BuildTraceInfo {
  const details = resolveModuleTraceDetails(importMeta);
  const metaBase: Record<string, unknown> = {};

  if (details.moduleType) {
    metaBase.moduleType = details.moduleType;
  }
  if (details.segmentGroups.length) {
    metaBase.segmentGroups = details.segmentGroups;
  }
  if (details.parallelRoutes.length) {
    metaBase.parallelRoutes = details.parallelRoutes;
  }

  const meta = mergeMeta(metaBase, options.meta);

  return {
    kind: options.kind,
    name: options.name,
    path: options.path ?? details.filePath,
    route: options.route ?? details.route,
    phase: options.phase,
    meta,
    warningThresholdMs: options.warningThresholdMs,
  };
}

export function cloneTraceInfo(info: BuildTraceInfo): BuildTraceInfo {
  return {
    ...info,
    meta: info.meta ? cloneMeta(info.meta) : undefined,
  };
}

function cloneMeta(meta: Record<string, unknown>): Record<string, unknown> {
  const clone: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (Array.isArray(value)) {
      clone[key] = value.map((item) => (typeof item === "object" && item !== null ? { ...(item as Record<string, unknown>) } : item));
      continue;
    }
    if (value && typeof value === "object") {
      clone[key] = { ...(value as Record<string, unknown>) };
      continue;
    }
    clone[key] = value;
  }
  return clone;
}
