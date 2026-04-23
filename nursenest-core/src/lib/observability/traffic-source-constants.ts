export const NN_TRAFFIC_SOURCE_HEADER = "x-nn-traffic-source" as const;
export const NN_TRAFFIC_SOURCE_SYNTHETIC = "synthetic" as const;

/** Classifies requests for metrics — keep values low-cardinality. */
export type TrafficSource = "customer" | "synthetic" | "admin_learner_qa";

/** Headers for internal HTTP probes — tag synthetic traffic for metrics / log filters. */
export function syntheticMonitoringFetchHeaders(): Record<string, string> {
  return {
    accept: "application/json, text/html;q=0.9, */*;q=0.8",
    [NN_TRAFFIC_SOURCE_HEADER]: NN_TRAFFIC_SOURCE_SYNTHETIC,
    "user-agent": "NurseNest-SyntheticMonitor/1.0",
  };
}

/**
 * Derive traffic class for API telemetry. Synthetic monitors set {@link NN_TRAFFIC_SOURCE_HEADER};
 * admin learner QA: **coarse** cookie-name probe only (no HMAC verify at the edge) — good enough for log drains.
 * Server-trusted QA tagging for metrics uses `UserAccess.adminLearnerQaSimulation` / verified cookie reads in Node.
 */
export function trafficSourceFromRequest(req: Request): TrafficSource {
  const raw = req.headers.get(NN_TRAFFIC_SOURCE_HEADER)?.trim().toLowerCase();
  if (raw === NN_TRAFFIC_SOURCE_SYNTHETIC) return "synthetic";
  const cookie = req.headers.get("cookie") ?? "";
  const m = /(?:^|;\s*)nn_admin_learner_qa=([^;]+)/.exec(cookie);
  const v = m?.[1]?.trim() ?? "";
  // Signed values are `base64url.payload`.`hex` — ignore empty / junk values so random cookies are not tagged as QA.
  if (v.length >= 16 && v.includes(".")) return "admin_learner_qa";
  return "customer";
}
