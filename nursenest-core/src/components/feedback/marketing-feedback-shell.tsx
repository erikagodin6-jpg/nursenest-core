"use client";

import type { ReactNode } from "react";

/** Legacy wrapper: in-app support is email-only (no floating feedback / chat-style widgets). */
export function MarketingFeedbackShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
