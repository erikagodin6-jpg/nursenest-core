export type BuildTraceKind =
  | "route"
  | "layout"
  | "provider"
  | "static-generation"
  | "page-data"
  | "async-boundary"
  | "request-api"
  | "script-phase";

export interface BuildTraceInfo {
  kind: BuildTraceKind;
  name: string;
  path?: string;
  route?: string;
  phase?: string;
  meta?: Record<string, unknown>;
  warningThresholdMs?: number;
}

export interface BuildTraceEvent extends BuildTraceInfo {
  id: string;
  startTimeMs: number;
  endTimeMs?: number;
  durationMs?: number;
  memoryStartMB?: number;
  memoryEndMB?: number;
  warnings?: Array<{ message: string; durationMs: number; thresholdMs: number }>;
}

export interface BuildTraceHandle {
  id: string;
  info: BuildTraceInfo;
  startTimeMs: number;
  memoryStartMB?: number;
  active: boolean;
}
