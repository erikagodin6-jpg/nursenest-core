/**
 * Phase 8 — Real User Monitoring collector
 *
 * Collects Web Vitals (TTFB, FCP, LCP, INP, CLS), route transition times,
 * and API latency. Batches and sends to /api/rum/ingest.
 * No PII is sent — only anonymous session identifiers.
 */

const SESSION_ID_KEY = "nn_rum_session";
const BATCH_INTERVAL_MS = 5_000;
const MAX_QUEUE = 100;

/* ------------------------------------------------------------------ */
/*  Session ID (anonymous, per-tab)                                    */
/* ------------------------------------------------------------------ */

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2, 18) + Date.now().toString(36);
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

/* ------------------------------------------------------------------ */
/*  Page classifier                                                     */
/* ------------------------------------------------------------------ */

type RumPage =
  | "home" | "pricing" | "lessons" | "flashcards"
  | "practice_questions" | "cat" | "simulation" | "ecg" | "other";

function classifyPage(pathname: string): RumPage {
  const p = pathname.toLowerCase().replace(/^\/[a-z]{2}(\/|$)/, "/"); // strip locale
  if (p === "/" || p === "") return "home";
  if (p.startsWith("/pricing")) return "pricing";
  if (p.includes("/ecg") || p.includes("ecg")) return "ecg";
  if (p.includes("/simulation") || p.includes("simulator")) return "simulation";
  if (p.includes("/cat") || p.includes("cat-exam")) return "cat";
  if (p.includes("/flashcard")) return "flashcards";
  if (p.includes("/practice") || p.includes("/qbank") || p.includes("/question-bank")) return "practice_questions";
  if (p.includes("/lesson")) return "lessons";
  return "other";
}

/* ------------------------------------------------------------------ */
/*  Vital rating thresholds (Web Vitals spec)                          */
/* ------------------------------------------------------------------ */

type Rating = "good" | "needs_improvement" | "poor" | "unknown";

function rateMetric(metric: string, value: number): Rating {
  const thresholds: Record<string, [number, number]> = {
    TTFB:  [800,  1800],
    FCP:   [1800, 3000],
    LCP:   [2500, 4000],
    INP:   [200,  500],
    CLS:   [0.1,  0.25],
    route_transition: [150, 500],
    api_latency:      [500, 2000],
    db_latency:       [200, 1000],
  };
  const t = thresholds[metric];
  if (!t) return "unknown";
  if (value <= t[0]) return "good";
  if (value <= t[1]) return "needs_improvement";
  return "poor";
}

/* ------------------------------------------------------------------ */
/*  Queue + flush                                                       */
/* ------------------------------------------------------------------ */

interface RumEvent {
  metric: string;
  value: number;
  page: string;
  rating: Rating;
  sessionId: string;
}

let queue: RumEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function enqueue(event: Omit<RumEvent, "sessionId" | "page" | "rating">): void {
  if (typeof window === "undefined") return;
  const page = classifyPage(window.location.pathname);
  const sessionId = getSessionId();
  const rating = rateMetric(event.metric, event.value);

  queue.push({ ...event, page, rating, sessionId });

  if (queue.length >= MAX_QUEUE) {
    flush();
    return;
  }

  if (!flushTimer) {
    flushTimer = setTimeout(flush, BATCH_INTERVAL_MS);
  }
}

function flush(): void {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  const batch = queue.splice(0);
  if (batch.length === 0) return;

  const payload = JSON.stringify({ events: batch });

  // Use sendBeacon for unload reliability; fallback to fetch
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/rum/ingest", blob);
  } else {
    fetch("/api/rum/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {}); // fire-and-forget
  }
}

/* ------------------------------------------------------------------ */
/*  TTFB from Navigation Timing                                         */
/* ------------------------------------------------------------------ */

function collectTTFB(): void {
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (!nav) return;
    const ttfb = nav.responseStart - nav.requestStart;
    if (ttfb > 0) enqueue({ metric: "TTFB", value: ttfb });
  } catch {}
}

/* ------------------------------------------------------------------ */
/*  PerformanceObserver-based vitals                                    */
/* ------------------------------------------------------------------ */

function observeLCP(): void {
  try {
    let lastLcpValue = 0;
    const obs = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1] as any;
      if (last?.startTime > 0) lastLcpValue = last.startTime;
    });
    obs.observe({ type: "largest-contentful-paint", buffered: true });

    // Report LCP on first user interaction or page hide
    const reportLcp = () => {
      if (lastLcpValue > 0) enqueue({ metric: "LCP", value: lastLcpValue });
      obs.disconnect();
    };
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") reportLcp();
    }, { once: true });
    ["click", "keydown", "touchstart"].forEach(ev =>
      window.addEventListener(ev, reportLcp, { once: true, passive: true }),
    );
  } catch {}
}

function observeFCP(): void {
  try {
    const obs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          enqueue({ metric: "FCP", value: entry.startTime });
          obs.disconnect();
        }
      }
    });
    obs.observe({ type: "paint", buffered: true });
  } catch {}
}

function observeCLS(): void {
  try {
    let clsValue = 0;
    const obs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const e = entry as any;
        if (!e.hadRecentInput) clsValue += e.value ?? 0;
      }
    });
    obs.observe({ type: "layout-shift", buffered: true });

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        enqueue({ metric: "CLS", value: clsValue });
        obs.disconnect();
      }
    }, { once: true });
  } catch {}
}

function observeINP(): void {
  try {
    let maxInp = 0;
    const obs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const e = entry as any;
        const dur = e.processingEnd ? (e.processingEnd - e.startTime) : (e.duration ?? 0);
        if (dur > maxInp) maxInp = dur;
      }
    });
    obs.observe({ type: "event", buffered: true, durationThreshold: 16 } as any);

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" && maxInp > 0) {
        enqueue({ metric: "INP", value: maxInp });
        obs.disconnect();
      }
    }, { once: true });
  } catch {}
}

/* ------------------------------------------------------------------ */
/*  Route transition tracking                                           */
/* ------------------------------------------------------------------ */

let routeTransitionStart = 0;

export function markRouteTransitionStart(): void {
  routeTransitionStart = performance.now();
}

export function markRouteTransitionEnd(): void {
  if (routeTransitionStart === 0) return;
  const duration = performance.now() - routeTransitionStart;
  routeTransitionStart = 0;
  if (duration > 0 && duration < 30_000) {
    enqueue({ metric: "route_transition", value: duration });
  }
}

/* ------------------------------------------------------------------ */
/*  API latency tracking                                                */
/* ------------------------------------------------------------------ */

export function trackApiCall(durationMs: number): void {
  if (durationMs > 0 && durationMs < 60_000) {
    enqueue({ metric: "api_latency", value: durationMs });
  }
}

/* ------------------------------------------------------------------ */
/*  Instrument fetch (intercept API calls to /api/*)                   */
/* ------------------------------------------------------------------ */

function instrumentFetch(): void {
  if (typeof window === "undefined") return;
  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : (input as Request).url;
    if (!url.startsWith("/api/")) {
      return originalFetch.call(this, input, init);
    }
    // Skip RUM ingest to avoid self-instrumentation
    if (url === "/api/rum/ingest") {
      return originalFetch.call(this, input, init);
    }

    const t0 = performance.now();
    try {
      const response = await originalFetch.call(this, input, init);
      const elapsed = performance.now() - t0;
      trackApiCall(elapsed);
      return response;
    } catch (err) {
      const elapsed = performance.now() - t0;
      trackApiCall(elapsed);
      throw err;
    }
  };
}

/* ------------------------------------------------------------------ */
/*  Init                                                                */
/* ------------------------------------------------------------------ */

let initialized = false;

export function initRum(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  // Flush on page hide
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);

  // Collect on next idle tick so we don't block render
  const schedule = (fn: () => void) => {
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(fn, { timeout: 3000 });
    } else {
      setTimeout(fn, 500);
    }
  };

  schedule(() => {
    collectTTFB();
    observeFCP();
    observeLCP();
    observeCLS();
    observeINP();
    instrumentFetch();
  });
}
