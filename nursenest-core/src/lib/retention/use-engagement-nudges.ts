"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { EngagementNudge } from "@/lib/retention/engagement-triggers";

const DISMISSED_KEY = "nn_dismissed_nudges";
const STALE_MS = 5 * 60 * 1000;

function getDismissed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (!raw) return new Set();
    const parsed: { kinds: string[]; ts: number } = JSON.parse(raw);
    if (Date.now() - parsed.ts > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(DISMISSED_KEY);
      return new Set();
    }
    return new Set(parsed.kinds);
  } catch {
    return new Set();
  }
}

function persistDismissed(kinds: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      DISMISSED_KEY,
      JSON.stringify({ kinds: [...kinds], ts: Date.now() }),
    );
  } catch {
    // storage blocked
  }
}

/**
 * useEngagementNudges — fetches smart nudges from the API
 * and filters out dismissed ones. Auto-refreshes every 5 minutes.
 */
export function useEngagementNudges(): {
  nudges: EngagementNudge[];
  loading: boolean;
  dismiss: (kind: string) => void;
  unreadCount: number;
} {
  const [allNudges, setAllNudges] = useState<EngagementNudge[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  const fetchNudges = useCallback(async () => {
    try {
      const res = await fetch("/api/learner/engagement-nudges");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.nudges)) {
        setAllNudges(data.nudges);
      }
    } catch {
      // non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    setDismissed(getDismissed());
    fetchNudges();

    const interval = setInterval(fetchNudges, STALE_MS);
    return () => clearInterval(interval);
  }, [fetchNudges]);

  const dismiss = useCallback((kind: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(kind);
      persistDismissed(next);
      return next;
    });
    try {
      window.posthog?.capture("engagement_nudge_dismissed", { kind });
    } catch {
      // analytics non-critical
    }
  }, []);

  const nudges = allNudges.filter((n) => !dismissed.has(n.kind));

  return {
    nudges,
    loading,
    dismiss,
    unreadCount: nudges.length,
  };
}
