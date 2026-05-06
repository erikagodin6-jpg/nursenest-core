"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * `useState(() => window.matchMedia(...))` hydrates incorrectly: the server always
 * sees `false` (no `window`), while the client can be `true` on the first paint,
 * which changes trees under {@link PageTransitionShell} / {@link FadeUp} and
 * triggers a recoverable hydration failure → marketing error boundary.
 *
 * `useSyncExternalStore` + `getServerSnapshot: () => false` keeps SSR + first
 * client paint aligned; after hydration the real preference syncs via subscribe.
 */
function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(QUERY);
  const handler = () => onStoreChange();
  mql.addEventListener("change", handler);
  return () => mql.removeEventListener("change", handler);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
