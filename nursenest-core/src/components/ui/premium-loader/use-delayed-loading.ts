"use client";

import { useEffect, useState } from "react";

export type UseDelayedLoadingOptions = {
  /** Delay before showing deferred chrome (brand leaf, motion). Default 320ms. */
  delayMs?: number;
};

/**
 * Defers showing loading chrome until after `delayMs` to avoid flicker on fast navigations.
 * Uses `requestAnimationFrame` + `setTimeout` so the first paint batch settles first.
 */
export function useDelayedLoading(visible: boolean, options?: UseDelayedLoadingOptions): boolean {
  const delayMs = options?.delayMs ?? 320;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShow(false);
      return;
    }

    let cancelled = false;
    /** Browser timer id (`number`); Node typings may widen `setTimeout` to `NodeJS.Timeout`. */
    let timer: number | undefined;
    const raf = requestAnimationFrame(() => {
      timer = window.setTimeout(() => {
        if (!cancelled) setShow(true);
      }, delayMs) as number;
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
    };
  }, [visible, delayMs]);

  return show;
}
