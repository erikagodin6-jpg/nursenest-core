import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Opt-in route loader diagnostics (`ROUTE_DATA_DIAGNOSTICS=1`): counts per stage, cache source hints,
 * and drop reasons — use after DB connectivity is confirmed (see `scripts/data/public-content-pipeline-probe.mts`).
 */
export function routeDataDiagnosticsEnabled(): boolean {
  const v = process.env.ROUTE_DATA_DIAGNOSTICS?.trim().toLowerCase();
  return v === "1" || v === "true";
}

export function logRouteDataPipeline(args: {
  route: string;
  stage: string;
  meta?: Record<string, string | number | boolean | null | undefined>;
}): void {
  if (!routeDataDiagnosticsEnabled()) return;
  const flat: Record<string, string> = {
    route: args.route,
    stage: args.stage,
  };
  for (const [k, v] of Object.entries(args.meta ?? {})) {
    if (v === null || v === undefined) continue;
    flat[k] = typeof v === "boolean" ? (v ? "1" : "0") : typeof v === "string" ? v : String(v);
  }
  safeServerLog("route_data_pipeline", "route_data_pipeline", flat);
}
