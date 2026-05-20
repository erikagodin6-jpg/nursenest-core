const MARKETING_I18N_STARTUP_BYPASS_MS = 15_000;

/**
 * Stable process start time (persists for the lifetime of the process).
 * Using Date.now avoids relying solely on process.uptime(),
 * which can behave inconsistently across container restarts.
 */
const PROCESS_START_TIME =
  Number(process.env.NN_PROCESS_START_TIME) || Date.now();

// Persist across modules (important for Next.js / serverless reload patterns)
if (!process.env.NN_PROCESS_START_TIME) {
  process.env.NN_PROCESS_START_TIME = String(PROCESS_START_TIME);
}

function getProcessAgeMs(): number {
  return Date.now() - PROCESS_START_TIME;
}

/**
 * Determines whether to bypass marketing i18n loading during early startup.
 *
 * Hard guarantees:
 * - ONLY applies in production
 * - NEVER applies in CI
 * - Uses stable wall-clock process age instead of raw uptime
 * - Fails CLOSED (returns false) on any invalid state
 */
export function shouldBypassMarketingI18nAtStartup({
  uptimeMs,
  nodeEnv,
  ci,
}: {
  uptimeMs?: number;
  nodeEnv?: string | undefined;
  ci?: string | undefined;
} = {}): boolean {
  const resolvedNodeEnv = nodeEnv ?? process.env.NODE_ENV;
  const resolvedCi = ci ?? process.env.CI;

  // Absolute guardrails first
  if (resolvedNodeEnv !== "production") return false;
  if (resolvedCi === "1") return false;

  // Prefer explicit uptime if provided (tests), otherwise use stable process age
  const effectiveUptimeMs =
    typeof uptimeMs === "number" && Number.isFinite(uptimeMs)
      ? uptimeMs
      : getProcessAgeMs();

  // Defensive: never allow negative or nonsense values
  if (effectiveUptimeMs <= 0 || effectiveUptimeMs > 60_000 * 60) {
    return false;
  }

  return effectiveUptimeMs < MARKETING_I18N_STARTUP_BYPASS_MS;
}