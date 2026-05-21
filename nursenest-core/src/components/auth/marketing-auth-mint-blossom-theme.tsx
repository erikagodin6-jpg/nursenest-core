"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { PUBLIC_MARKETING_THEME_ALLOWLIST, THEME_STORAGE_KEY } from "@/lib/theme/theme-registry";

/** Auth marketing surfaces use Mint Blossom for first paint + session (restored on leave). */
export const MARKETING_AUTH_SURFACE_THEME = "mint-blossom" as const;

/**
 * Applies Mint Blossom on `html[data-theme]` while auth pages mount so sign-in/sign-up
 * always show the mint + sky + pink palette. Restores persisted theme on unmount.
 */
export function MarketingAuthMintBlossomTheme({ children }: { children: ReactNode }) {
  const previousThemeRef = useRef<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    previousThemeRef.current = root.getAttribute("data-theme");
    root.setAttribute("data-theme", MARKETING_AUTH_SURFACE_THEME);

    return () => {
      let next = previousThemeRef.current;
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY)?.trim() ?? "";
        const allowed = new Set<string>(PUBLIC_MARKETING_THEME_ALLOWLIST);
        if (stored && allowed.has(stored)) next = stored;
      } catch {
        /* localStorage blocked */
      }
      root.setAttribute("data-theme", next && next.length > 0 ? next : "ocean");
    };
  }, []);

  return children;
}
