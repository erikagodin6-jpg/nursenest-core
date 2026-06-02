"use client";

import { emitRuntimeEvent } from "@/lib/runtime/client-runtime-event";

type AppRouterLike = {
  replace: (href: string, options?: { scroll?: boolean }) => void;
};

type NavigationContext = Record<string, string | number | boolean | null | undefined>;

function normalizedPathAndSearch(href: string): string {
  try {
    const url = new URL(href, window.location.origin);
    return `${url.pathname}${url.search}`;
  } catch {
    return href;
  }
}

export function safeRouterReplace(
  router: AppRouterLike,
  href: string,
  opts: {
    context?: NavigationContext;
    fallbackDelayMs?: number;
    hardFallbackDelayMs?: number;
    scroll?: boolean;
  } = {},
): void {
  const target = normalizedPathAndSearch(href);
  const startedAt = performance.now();
  const context = opts.context ?? {};
  emitRuntimeEvent("route_transition_start", {
    ...context,
    target,
    source: window.location.pathname,
  });

  try {
    router.replace(href, { scroll: opts.scroll });
  } catch (error) {
    emitRuntimeEvent("route_transition_failure", {
      ...context,
      target,
      reason: "router_replace_threw",
      message: error instanceof Error ? error.message : "unknown",
      elapsedMs: Math.round(performance.now() - startedAt),
    });
    window.location.assign(href);
    return;
  }

  window.setTimeout(() => {
    const current = `${window.location.pathname}${window.location.search}`;
    if (current === target) {
      emitRuntimeEvent("route_transition_commit", {
        ...context,
        target,
        elapsedMs: Math.round(performance.now() - startedAt),
      });
      return;
    }
    emitRuntimeEvent("route_transition_pending", {
      ...context,
      target,
      current,
      reason: "router_replace_not_committed_yet",
      elapsedMs: Math.round(performance.now() - startedAt),
    });
  }, opts.fallbackDelayMs ?? 1500);

  if (opts.hardFallbackDelayMs != null && Number.isFinite(opts.hardFallbackDelayMs) && opts.hardFallbackDelayMs > 0) {
    window.setTimeout(() => {
      const current = `${window.location.pathname}${window.location.search}`;
      if (current === target) return;
      emitRuntimeEvent("route_transition_failure", {
        ...context,
        target,
        current,
        reason: "router_replace_hard_fallback_timeout",
        elapsedMs: Math.round(performance.now() - startedAt),
      });
      window.location.assign(href);
    }, opts.hardFallbackDelayMs);
  }
}
