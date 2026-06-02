"use client";

import { useEffect, useRef } from "react";

export function useServiceWorker() {
  const registered = useRef(false);

  useEffect(() => {
    if (registered.current || typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    registered.current = true;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              worker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      })
      .catch(() => {});

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "TRIGGER_PROGRESS_SYNC") {
        window.dispatchEvent(new CustomEvent("nursenest:progress-sync"));
      }
      if (event.data?.type === "TRIGGER_ANALYTICS_FLUSH") {
        window.dispatchEvent(new CustomEvent("nursenest:analytics-flush"));
      }
    });
  }, []);
}

export function cacheContentInSW(url: string, payload: unknown) {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.ready.then((reg) => {
    reg.active?.postMessage({ type: "CACHE_CONTENT", url, payload });
  });
}

export function requestBackgroundSync(tag: "progress-sync" | "analytics-flush") {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.ready.then((reg: any) => {
    if ("sync" in reg) reg.sync.register(tag).catch(() => {});
  });
}
