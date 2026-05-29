"use client";

import { useEffect } from "react";

const WARM_CACHE_SESSION_KEY = "nursenest.activityWarmCache.v1";
const WARM_CACHE_MIN_INTERVAL_MS = 10 * 60 * 1000;

function shouldWarmCache(now: number): boolean {
  try {
    const raw = window.sessionStorage.getItem(WARM_CACHE_SESSION_KEY);
    if (!raw) return true;
    const last = Number(raw);
    return !Number.isFinite(last) || now - last > WARM_CACHE_MIN_INTERVAL_MS;
  } catch {
    return true;
  }
}

function markCacheWarmAttempt(now: number): void {
  try {
    window.sessionStorage.setItem(WARM_CACHE_SESSION_KEY, String(now));
  } catch {
    // Best-effort only; cache warming must never affect learner startup.
  }
}

export function LearnerCacheWarmer({ enabled }: { enabled: boolean }): null {
  useEffect(() => {
    if (!enabled) return;
    const now = Date.now();
    if (!shouldWarmCache(now)) return;
    markCacheWarmAttempt(now);

    const warm = () => {
      const body = JSON.stringify({ surface: "login_or_app_shell" });
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        try {
          const blob = new Blob([body], { type: "application/json" });
          if (navigator.sendBeacon("/api/learner/activity-warm-cache", blob)) return;
        } catch {
          // Fall through to fetch.
        }
      }
      void fetch("/api/learner/activity-warm-cache", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    };

    const timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void })
          .requestIdleCallback(warm, { timeout: 2500 });
      } else {
        warm();
      }
    }, 900);

    return () => window.clearTimeout(timer);
  }, [enabled]);

  return null;
}

