"use client";

import type { ReactNode } from "react";

/** Auth marketing surfaces use Mint Blossom for first paint + session (restored on leave). */
export const MARKETING_AUTH_SURFACE_THEME = "mint-blossom" as const;

/** Applies Mint Blossom as a scoped auth surface without mutating the global root theme. */
export function MarketingAuthMintBlossomTheme({ children }: { children: ReactNode }) {
  return (
    <div data-theme={MARKETING_AUTH_SURFACE_THEME} className="contents">
      {children}
    </div>
  );
}
