/**
 * Reversible homepage isolation / diagnostics (env-gated). No secrets.
 * - `NN_HOME_STATIC_PROBE=true` — minimal `/` page body in `page.tsx` (skip heavy awaits).
 * - `NN_HOME_STATIC_METADATA=true` — `generateMetadata` for `/` returns static fallback only (no async).
 * - `NN_HOME_STATIC_MARKETING_LAYOUT=true` — `(marketing)/(default)/layout.tsx` serves a minimal shell for
 *   requests whose `x-nn-request-pathname` is `/` only (skips chrome shard load + Sentry span import).
 * - `NN_HOME_ROUTE_DIAG=true` — stderr JSON breadcrumbs for `/` path timing (narrow segments).
 * - `NN_HOME_RENDER_DIAG=true` — same JSON breadcrumbs as route diag, but without forcing static probes
 *   (use to trace hangs while keeping normal HTML/metadata).
 *
 * Unset in normal production. Diagnostics use wall-clock ms via `nnHomeDiagNowMs`
 * (keeps `Date.now` out of RSC modules that enforce `react-hooks/purity`).
 */
export function nnHomeDiagNowMs(): number {
  return Date.now();
}

export function nnHomeStaticProbeEnabled(): boolean {
  return process.env.NN_HOME_STATIC_PROBE?.trim().toLowerCase() === "true";
}

export function nnHomeStaticMetadataEnabled(): boolean {
  return process.env.NN_HOME_STATIC_METADATA?.trim().toLowerCase() === "true";
}

export function nnHomeStaticMarketingLayoutEnabled(): boolean {
  return process.env.NN_HOME_STATIC_MARKETING_LAYOUT?.trim().toLowerCase() === "true";
}

export function nnHomeRouteDiagEnabled(): boolean {
  return process.env.NN_HOME_ROUTE_DIAG?.trim().toLowerCase() === "true";
}

export function nnHomeRenderDiagEnabled(): boolean {
  return process.env.NN_HOME_RENDER_DIAG?.trim().toLowerCase() === "true";
}

export function shouldEmitNnHomeRouteDiag(): boolean {
  return (
    nnHomeStaticProbeEnabled() ||
    nnHomeRouteDiagEnabled() ||
    nnHomeRenderDiagEnabled() ||
    nnHomeStaticMetadataEnabled() ||
    nnHomeStaticMarketingLayoutEnabled()
  );
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
