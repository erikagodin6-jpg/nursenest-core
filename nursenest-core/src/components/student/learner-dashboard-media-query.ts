"use client";

import { useSyncExternalStore } from "react";

/** Learner hub layout + folds: align with `lg` / 1024px where `.nn-dash-hub-layout` becomes two columns. */
export function useLearnerHubLgMatch(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(min-width: 1024px)");
      const handler = () => onChange();
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    },
    () => (typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : false),
    () => false,
  );
}
