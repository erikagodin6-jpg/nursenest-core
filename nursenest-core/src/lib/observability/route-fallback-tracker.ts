import { cache } from "react";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const HEAVILY_DEGRADED_THRESHOLD = 3;

type FallbackState = {
  count: number;
  types: string[];
  heavyLogged: boolean;
};

const getRouteFallbackState = cache((): FallbackState => ({
  count: 0,
  types: [],
  heavyLogged: false,
}));

export type RouteRenderFallbackMeta = {
  /** Stable enum-like label for dashboards (e.g. `empty_question_snapshot`). */
  fallbackType: string;
  pathname?: string;
  pathwayId?: string;
  examCode?: string;
  country?: string;
  /** Optional numeric hint (e.g. suppressed link count). */
  count?: number;
  /** e.g. Prisma task name when {@link fallbackType} is `hub_data_load_failed`. */
  dependencyName?: string;
};

/**
 * Records a single degraded render decision for the current RSC request tree.
 * Emits `route_render_fallback_used`; once cumulative fallbacks reach the threshold, emits
 * `route_render_heavily_degraded` once per request.
 */
export function recordRouteRenderFallback(meta: RouteRenderFallbackMeta): void {
  const st = getRouteFallbackState();
  st.count += 1;
  st.types.push(meta.fallbackType);

  safeServerLog("route_fallback", "route_render_fallback_used", {
    event: "route_render_fallback_used",
    fallback_type: meta.fallbackType,
    pathname: meta.pathname,
    pathway_id: meta.pathwayId,
    exam_code: meta.examCode,
    country: meta.country,
    count: meta.count,
    dependency_name: meta.dependencyName,
    cumulative_fallback_count: st.count,
  });

  if (st.count >= HEAVILY_DEGRADED_THRESHOLD && !st.heavyLogged) {
    st.heavyLogged = true;
    safeServerLog("route_fallback", "route_render_heavily_degraded", {
      event: "route_render_heavily_degraded",
      pathname: meta.pathname,
      pathway_id: meta.pathwayId,
      fallback_types: st.types.slice(0, 24).join(","),
      cumulative_fallback_count: st.count,
    });
  }
}
