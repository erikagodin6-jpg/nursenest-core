"use client";

import { useEffect } from "react";
import { logMarketingRouteErrorClient } from "@/lib/marketing/marketing-home-safe-mode-triggers";

/**
 * Logs once per `error` reference from marketing `error.tsx` surfaces (dev / debug flag only).
 */
export function useMarketingRouteErrorDiagnostics(
  surface: string,
  error: Error & { digest?: string },
): void {
  useEffect(() => {
    logMarketingRouteErrorClient(surface, error);
  }, [surface, error]);
}
