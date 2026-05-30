"use client";

/**
 * Hub prefetch hook — Phase 6: prefetch study activity routes when a user is on a hub page.
 *
 * Fires once on mount (idle callback) to warm the Next.js router cache for the
 * routes a user is most likely to navigate to next.  Works silently; never blocks
 * or delays the current page render.
 *
 * Usage:
 *   // In a hub client component (flashcards hub, practice tests hub, lessons hub):
 *   useHubPrefetch({ pathwayId, prefetch: ["flashcards", "practice", "cat"] });
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export type HubPrefetchTarget =
  | "flashcards"
  | "practice"
  | "cat"
  | "loft"
  | "lessons"
  | "questions"
  | "clinical-skills"
  | "pharmacology"
  | "ecg"
  | "analytics"
  | "readiness"
  | "dashboard";

type HubPrefetchOptions = {
  /** Pathway ID — used to scope prefetch URLs. */
  pathwayId?: string | null;
  /** Which routes to prefetch. */
  prefetch: HubPrefetchTarget[];
  /** Delay before prefetch fires (ms). Default 1200 — lets the current page paint first. */
  delayMs?: number;
};

function buildPrefetchHref(target: HubPrefetchTarget, pathwayId: string | null | undefined): string {
  const pid = pathwayId?.trim();
  const pidParam = pid ? `?pathwayId=${encodeURIComponent(pid)}` : "";

  switch (target) {
    case "flashcards":
      return `/app/flashcards${pidParam}`;
    case "practice":
      return `/app/practice-tests${pidParam}`;
    case "cat":
      return `/app/practice-tests${pidParam}`;
    case "loft":
      return "/app/osce";
    case "lessons":
      return `/app/lessons${pidParam}`;
    case "questions":
      return `/app/questions${pidParam}`;
    case "clinical-skills":
      return "/app/clinical-skills";
    case "pharmacology":
      return "/app/pharmacology";
    case "ecg":
      return "/modules/ecg/basic/lessons";
    case "analytics":
      return "/app/account/analytics";
    case "readiness":
      return "/app/account/readiness";
    case "dashboard":
      return "/app";
  }
}

/**
 * Prefetches likely-next hub routes during idle time so the first click feels instant.
 * Safe to call on any hub client component — no-ops if the router isn't available.
 */
export function useHubPrefetch({ pathwayId, prefetch, delayMs = 1200 }: HubPrefetchOptions): void {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_NN_ENABLE_HUB_PREFETCH !== "1") return;
    if (prefetch.length === 0) return;

    const hrefs = prefetch.map((t) => buildPrefetchHref(t, pathwayId));

    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const fire = () => {
      if (cancelled) return;
      for (const href of hrefs) {
        router.prefetch(href);
      }
    };

    // Use requestIdleCallback when available to avoid competing with paint.
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      timerId = setTimeout(() => {
        if (!cancelled) {
          (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(fire, { timeout: 3000 });
        }
      }, delayMs);
    } else {
      timerId = setTimeout(fire, delayMs);
    }

    return () => {
      cancelled = true;
      if (timerId !== null) clearTimeout(timerId);
    };
  }, [router, pathwayId, prefetch, delayMs]);
}
