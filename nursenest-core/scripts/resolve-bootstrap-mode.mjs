/**
 * Single source of truth: how `start-standalone.mjs` binds the platform port.
 * Pure function for tests — pass a plain object (e.g. `{ PORT: "8080" }`).
 */

/** @typedef {"bootstrap_proxy" | "direct_standalone"} BootstrapMode */

/**
 * @param {Record<string, string | undefined>} env
 * @returns {{
 *   mode: BootstrapMode;
 *   readinessWatchdogBypass: boolean;
 *   rawDirect: string;
 *   rawBypass: string;
 *   rawAllowDirect: string;
 *   conflictDirectAndBypass: boolean;
 *   errors: string[];
 *   warnings: string[];
 * }}
 */
export function resolveBootstrapStartupMode(env) {
  const rawDirect = env.NN_DIRECT_STANDALONE?.trim() ?? "";
  const directTruthy = /^(1|true|yes)$/i.test(rawDirect);
  const rawBypass = env.NN_BYPASS_BOOTSTRAP?.trim() ?? "";
  const bypassTruthy = rawBypass === "1";
  const rawAllowDirect = env.NN_ALLOW_DIRECT_STANDALONE?.trim() ?? "";
  const allowDirectTruthy = /^(1|true|yes)$/i.test(rawAllowDirect);

  const conflictDirectAndBypass = directTruthy && bypassTruthy;

  /** @type {string[]} */
  const errors = [];
  /** @type {string[]} */
  const warnings = [];

  /** @type {BootstrapMode} */
  let mode = "bootstrap_proxy";

  if (conflictDirectAndBypass) {
    errors.push(
      "[startup] ERROR: NN_DIRECT_STANDALONE and NN_BYPASS_BOOTSTRAP are both set; forcing BOOTSTRAP_MODE=bootstrap_proxy (ambiguous; unsafe for DigitalOcean /healthz on PORT)",
    );
    mode = "bootstrap_proxy";
  } else if (directTruthy) {
    if (!allowDirectTruthy) {
      errors.push(
        "[startup] ERROR: NN_DIRECT_STANDALONE is set without NN_ALLOW_DIRECT_STANDALONE=1; forcing BOOTSTRAP_MODE=bootstrap_proxy (direct mode skips public bootstrap /healthz)",
      );
      mode = "bootstrap_proxy";
    } else {
      mode = "direct_standalone";
      warnings.push(
        "[startup] WARNING: direct_standalone disables bootstrap /healthz on public port (Next binds PORT directly)",
      );
    }
  }

  if (bypassTruthy && !directTruthy) {
    warnings.push(
      "[startup] NN_BYPASS_BOOTSTRAP is deprecated; use NN_DIRECT_STANDALONE=1 plus NN_ALLOW_DIRECT_STANDALONE=1 for direct mode, or remove NN_BYPASS_BOOTSTRAP",
    );
  }

  /** Legacy watchdog bypass: only in bootstrap_proxy, never when direct+bypass conflicted. */
  const readinessWatchdogBypass =
    bypassTruthy && mode === "bootstrap_proxy" && !conflictDirectAndBypass;

  return {
    mode,
    readinessWatchdogBypass,
    rawDirect,
    rawBypass,
    rawAllowDirect,
    conflictDirectAndBypass,
    errors,
    warnings,
  };
}
