"use client";

import { useEffect } from "react";
import { logMarketingRouteErrorClient } from "@/lib/marketing/marketing-home-safe-mode-triggers";

/**
 * Logs once per `error` reference from marketing `error.tsx` surfaces.
 * Always emits a single `[nn-homepage-error-boundary]` line (message/digest/stack) so
 * production browsers can capture the real failure; gated detailed logs stay in
 * {@link logMarketingRouteErrorClient}.
 */
export function useMarketingRouteErrorDiagnostics(
  surface: string,
  error: Error & { digest?: string },
): void {
  useEffect(() => {
    try {
      const stack =
        typeof error?.stack === "string" ? error.stack.slice(0, 12_000) : undefined;
      console.error(
        "[nn-homepage-error-boundary]",
        JSON.stringify({
          surface,
          name: error?.name,
          message: error?.message,
          digest: error?.digest,
          stack,
        }),
      );
    } catch {
      /* ignore */
    }
    logMarketingRouteErrorClient(surface, error);
  }, [surface, error]);
}
