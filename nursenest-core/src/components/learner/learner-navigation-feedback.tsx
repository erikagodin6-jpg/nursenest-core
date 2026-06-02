"use client";

import { useEffect } from "react";

function isPlainLeftClick(event: MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function isInternalLearnerHref(anchor: HTMLAnchorElement) {
  const rawHref = anchor.getAttribute("href");
  if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) return false;

  const url = new URL(anchor.href, window.location.href);
  return url.origin === window.location.origin && url.pathname.startsWith("/app");
}

export function LearnerNavigationFeedback() {
  useEffect(() => {
    let activeElement: HTMLElement | null = null;
    let clearTimer: number | null = null;

    function clear() {
      if (clearTimer != null) window.clearTimeout(clearTimer);
      clearTimer = null;
      activeElement?.removeAttribute("data-nn-navigation-pending");
      activeElement?.removeAttribute("aria-busy");
      activeElement = null;
    }

    function onClick(event: MouseEvent) {
      if (!isPlainLeftClick(event) || event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || !isInternalLearnerHref(anchor) || anchor.target) return;

      clear();
      activeElement = anchor;
      anchor.setAttribute("data-nn-navigation-pending", "true");
      anchor.setAttribute("aria-busy", "true");
      clearTimer = window.setTimeout(clear, 8000);
    }

    function onPageVisible() {
      clear();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("pageshow", onPageVisible);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pageshow", onPageVisible);
      clear();
    };
  }, []);

  return null;
}
