"use client";

import type { ReactNode } from "react";

/** Auth marketing surfaces use Sea Glass for first paint + session (restored on leave). */
export const MARKETING_AUTH_SURFACE_THEME = "sea-glass" as const;

/** Applies Sea Glass as a scoped auth surface without mutating the global root theme. */
export function MarketingAuthMintBlossomTheme({ children }: { children: ReactNode }) {
  return (
    <div data-theme={MARKETING_AUTH_SURFACE_THEME} className="contents">
      {children}
    </div>
  );
}
