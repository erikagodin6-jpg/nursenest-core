const HOME_STATS_STARTUP_BYPASS_MS = 60_000;

export function shouldBypassPublicHomeStatsDbAtStartup({
  uptimeMs,
  nodeEnv,
  ci,
}: {
  uptimeMs?: number;
  nodeEnv?: string | undefined;
  ci?: string | undefined;
} = {}): boolean {
  const resolvedUptimeMs = uptimeMs ?? Math.round(process.uptime() * 1000);
  const resolvedNodeEnv = nodeEnv ?? process.env.NODE_ENV;
  const resolvedCi = ci ?? process.env.CI;
  return resolvedNodeEnv === "production" && resolvedCi !== "1" && resolvedUptimeMs < HOME_STATS_STARTUP_BYPASS_MS;
}
