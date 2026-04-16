"use client";

import { useEffect, useRef } from "react";
import { captureUxFailure } from "@/lib/observability/frontend-ux-tracking";

const DEFAULT_MS = 45_000;

function thresholdMs(): number {
  const raw = process.env.NEXT_PUBLIC_UX_STUCK_LOADING_MS;
  if (!raw) return DEFAULT_MS;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 5000 ? n : DEFAULT_MS;
}

/**
 * Fires once when `active` stays true longer than the threshold (user-visible spinner / skeleton).
 */
export function useStuckLoadingUx(opts: {
  active: boolean;
  surface: string;
  message?: string;
  /** Override default threshold (ms). */
  thresholdMs?: number;
}): void {
  const { active, surface, message, thresholdMs: override } = opts;
  const fired = useRef(false);
  const t0 = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      fired.current = false;
      t0.current = null;
      return;
    }
    if (t0.current == null) t0.current = Date.now();
    const limit = override ?? thresholdMs();
    const id = window.setTimeout(() => {
      if (!active || fired.current) return;
      fired.current = true;
      captureUxFailure({
        kind: "stuck_loading",
        level: "warning",
        message: message ?? `loading exceeded ${limit}ms`,
        extra: { surface, thresholdMs: limit },
      });
    }, limit);
    return () => window.clearTimeout(id);
  }, [active, surface, message, override]);
}
