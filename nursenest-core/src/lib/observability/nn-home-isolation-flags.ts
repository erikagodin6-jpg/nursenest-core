/**
 * Reversible homepage isolation / diagnostics (env-gated). No secrets.
 * - `NN_HOME_STATIC_PROBE=true` — minimal `/` render (skip heavy awaits in page.tsx).
 * - `NN_HOME_ROUTE_DIAG=true` — stderr JSON breadcrumbs for `/` path timing.
 *
 * Unset both in normal production. Diagnostics use wall-clock ms via `nnHomeDiagNowMs`
 * (keeps `Date.now` out of RSC modules that enforce `react-hooks/purity`).
 */
export function nnHomeDiagNowMs(): number {
  return Date.now();
}

export function nnHomeStaticProbeEnabled(): boolean {
  return process.env.NN_HOME_STATIC_PROBE?.trim().toLowerCase() === "true";
}

export function nnHomeRouteDiagEnabled(): boolean {
  return process.env.NN_HOME_ROUTE_DIAG?.trim().toLowerCase() === "true";
}

export function shouldEmitNnHomeRouteDiag(): boolean {
  return nnHomeStaticProbeEnabled() || nnHomeRouteDiagEnabled();
}

export function emitNnHomeRouteDiag(payload: Record<string, unknown>): void {
  if (!shouldEmitNnHomeRouteDiag()) return;
  const line = { tag: "nn_home_route_diag", wall_ms: nnHomeDiagNowMs(), ...payload };
  try {
    console.error(JSON.stringify(line));
  } catch {
    try {
      console.error(`nn_home_route_diag_plain segment=${String(payload.segment)}`);
    } catch {
      /* noop */
    }
  }
}
