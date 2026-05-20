"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_PREFIX = "nn_err_1retry_";

/**
 * One automatic `reset()` per error identity (digest) per browser tab session.
 * Storage is written only when the delayed retry actually runs, so navigating away
 * before the delay does not consume the automatic retry.
 */
export function useErrorBoundaryAutoRetry(
  reset: () => void,
  options: {
    /** Error digest from Next.js (preferred) or fallback key. */
    errorKey: string | undefined;
    delayMs: number;
    enabled?: boolean;
    /** Fires once when the delayed automatic reset runs (before `reset()`). */
    onAutoResetInvoked?: () => void;
  },
): { status: "idle" | "scheduled" | "fired" } {
  const { errorKey, delayMs, enabled = true, onAutoResetInvoked } = options;
  const [status, setStatus] = useState<"idle" | "scheduled" | "fired">("idle");
  const resetRef = useRef(reset);
  const onInvokedRef = useRef(onAutoResetInvoked);
  onInvokedRef.current = onAutoResetInvoked;
  resetRef.current = reset;

  useEffect(() => {
    if (!enabled || delayMs <= 0) return;
    const key = errorKey?.trim() || "unknown";
    const storageKey = `${STORAGE_PREFIX}${key}`;

    try {
      if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(storageKey)) {
        return;
      }
    } catch {
      return;
    }

    setStatus("scheduled");
    const t = window.setTimeout(() => {
      try {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(storageKey, "1");
        }
      } catch {
        /* private mode — still attempt reset */
      }
      setStatus("fired");
      try {
        onInvokedRef.current?.();
      } catch {
        /* ignore */
      }
      resetRef.current();
    }, delayMs);

    return () => {
      window.clearTimeout(t);
    };
  }, [delayMs, enabled, errorKey]);

  return { status: status === "scheduled" ? "scheduled" : status === "fired" ? "fired" : "idle" };
}
