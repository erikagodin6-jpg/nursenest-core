"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { classifyActivityRoute } from "@/lib/performance/activity-route-classification";

type ActivityVitalsSnapshot = {
  ttfbMs: number | null;
  hydrationMs: number;
  lcpMs: number | null;
  ttiApproxMs: number;
  cpuBlockingMs: number;
  memoryUsedMB: number | null;
  networkRequests: number;
  scriptTransferKB: number;
  routeTransferKB: number;
};

function rounded(value: number | null | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.round(value)) : undefined;
}

function navigationTiming(): PerformanceNavigationTiming | null {
  const entry = performance.getEntriesByType("navigation")[0];
  return entry instanceof PerformanceNavigationTiming ? entry : null;
}

function collectNetworkSnapshot(): Pick<ActivityVitalsSnapshot, "networkRequests" | "scriptTransferKB" | "routeTransferKB"> {
  const resources = performance.getEntriesByType("resource");
  let networkRequests = 0;
  let scriptTransfer = 0;
  let totalTransfer = 0;

  for (const entry of resources) {
    if (!(entry instanceof PerformanceResourceTiming)) continue;
    if (entry.initiatorType === "fetch" || entry.initiatorType === "xmlhttprequest") networkRequests++;
    if (entry.initiatorType === "script") scriptTransfer += entry.transferSize || 0;
    totalTransfer += entry.transferSize || 0;
  }

  return {
    networkRequests,
    scriptTransferKB: Math.round(scriptTransfer / 1024),
    routeTransferKB: Math.round(totalTransfer / 1024),
  };
}

function scheduleIdle(run: () => void): () => void {
  if (typeof requestIdleCallback === "function") {
    const id = requestIdleCallback(run, { timeout: 3500 });
    return () => cancelIdleCallback(id);
  }
  const timeout = window.setTimeout(run, 1500);
  return () => window.clearTimeout(timeout);
}

export function ActivityPerformanceVitals() {
  const pathname = usePathname();
  const seenPath = useRef<string | null>(null);

  useEffect(() => {
    const classification = classifyActivityRoute(pathname);
    if (!classification || !pathname) return;
    if (seenPath.current === pathname) return;
    seenPath.current = pathname;

    let lcpMs: number | null = null;
    let cpuBlockingMs = 0;
    let lcpObserver: PerformanceObserver | null = null;
    let longTaskObserver: PerformanceObserver | null = null;

    if ("PerformanceObserver" in window) {
      try {
        lcpObserver = new PerformanceObserver((list) => {
          const last = list.getEntries().at(-1);
          if (last) lcpMs = last.startTime;
        });
        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      } catch {
        lcpObserver = null;
      }

      try {
        longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            cpuBlockingMs += Math.max(0, entry.duration - 50);
          }
        });
        longTaskObserver.observe({ type: "longtask", buffered: true });
      } catch {
        longTaskObserver = null;
      }
    }

    const cancelIdle = scheduleIdle(() => {
      const nav = navigationTiming();
      const now = performance.now();
      const network = collectNetworkSnapshot();
      const memory = (performance as Performance & { memory?: { usedJSHeapSize?: number } }).memory;
      const snapshot: ActivityVitalsSnapshot = {
        ttfbMs: nav ? nav.responseStart - nav.requestStart : null,
        hydrationMs: now,
        lcpMs,
        ttiApproxMs: now,
        cpuBlockingMs,
        memoryUsedMB: memory?.usedJSHeapSize ? memory.usedJSHeapSize / (1024 * 1024) : null,
        ...network,
      };

      void trackClientEvent("activity_performance_vitals", {
        activity: classification.activity,
        route_family: classification.routeFamily,
        path: pathname,
        target_budget_ms: classification.targetBudgetMs,
        ttfb_ms: rounded(snapshot.ttfbMs),
        hydration_ms: rounded(snapshot.hydrationMs),
        lcp_ms: rounded(snapshot.lcpMs),
        tti_approx_ms: rounded(snapshot.ttiApproxMs),
        cpu_blocking_ms: rounded(snapshot.cpuBlockingMs),
        memory_used_mb: rounded(snapshot.memoryUsedMB),
        network_requests: snapshot.networkRequests,
        script_transfer_kb: snapshot.scriptTransferKB,
        route_transfer_kb: snapshot.routeTransferKB,
        over_budget: snapshot.ttiApproxMs > classification.targetBudgetMs,
      });
    });

    return () => {
      cancelIdle();
      lcpObserver?.disconnect();
      longTaskObserver?.disconnect();
    };
  }, [pathname]);

  return null;
}
