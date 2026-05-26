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
    if (current === target) return;
    emitRuntimeEvent("route_transition_failure", {
      ...context,
      target,
      current,
      reason: "router_replace_not_committed",
      elapsedMs: Math.round(performance.now() - startedAt),
    });
    window.location.assign(href);
  }, opts.fallbackDelayMs ?? 1500);
}
