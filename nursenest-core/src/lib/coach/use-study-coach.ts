"use client";

import { useState, useCallback } from "react";
import type {
  CoachIntent,
  CoachContext,
  CoachResponse,
} from "@/lib/coach/study-coach-actions";

export type CoachStatus = "idle" | "loading" | "success" | "error";

export interface UseStudyCoachReturn {
  status: CoachStatus;
  response: CoachResponse | null;
  error: string | null;
  ask: (intent: CoachIntent, context: CoachContext) => Promise<void>;
  reset: () => void;
}

export function useStudyCoach(): UseStudyCoachReturn {
  const [status, setStatus] = useState<CoachStatus>("idle");
  const [response, setResponse] = useState<CoachResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ask = useCallback(async (intent: CoachIntent, context: CoachContext) => {
    setStatus("loading");
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, context }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          (data as { error?: string }).error ?? `Request failed (${res.status})`;
        setError(msg);
        setStatus("error");
        return;
      }

      const data = (await res.json()) as { response: CoachResponse };
      setResponse(data.response);
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResponse(null);
    setError(null);
  }, []);

  return { status, response, error, ask, reset };
}
