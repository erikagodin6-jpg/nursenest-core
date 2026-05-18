"use client";

import { useEffect, useRef } from "react";

export function useCasperAutosave(input: {
  sessionId?: string;
  enabled?: boolean;
  payload: unknown;
  debounceMs?: number;
}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!input.enabled || !input.sessionId) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/casper/sessions/${input.sessionId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input.payload),
        });
      } catch {
        // Autosave intentionally fails silently during scaffold phase.
      }
    }, input.debounceMs ?? 1500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [input]);
}
