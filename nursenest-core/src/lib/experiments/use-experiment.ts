"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  assignVariant,
  type ExperimentId,
} from "@/lib/experiments/experiment-engine";

const STORAGE_PREFIX = "nn_exp_";

function getPersistedVariant(experimentId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${experimentId}`);
  } catch {
    return null;
  }
}

function persistVariant(experimentId: string, variant: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${experimentId}`, variant);
  } catch {
    // localStorage blocked — variant still works in memory this session
  }
}

/**
 * useExperiment — returns the assigned variant for an experiment.
 *
 * Assignment flow:
 * 1. Check localStorage for a persisted assignment
 * 2. If none, compute deterministically from userId
 * 3. Persist the assignment in localStorage
 * 4. Fire a PostHog `$experiment_started` event (once per mount)
 *
 * If no userId is provided, falls back to a random assignment
 * persisted in localStorage (anonymous users).
 */
export function useExperiment(
  experimentId: ExperimentId,
  userId?: string | null,
): string {
  const variant = useMemo(() => {
    const persisted = getPersistedVariant(experimentId);
    if (persisted) return persisted;

    const uid = userId ?? `anon_${Math.random().toString(36).slice(2, 10)}`;
    const assigned = assignVariant(experimentId, uid);
    persistVariant(experimentId, assigned);
    return assigned;
  }, [experimentId, userId]);

  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    try {
      window.posthog?.capture("$experiment_started", {
        $experiment_id: experimentId,
        $variant: variant,
      });
    } catch {
      // analytics must never break the product
    }
  }, [experimentId, variant]);

  return variant;
}
