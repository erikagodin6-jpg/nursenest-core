"use client";

import { Suspense, type ReactNode } from "react";
import { UserFeedbackProvider } from "@/components/feedback/user-feedback-context";
import { UserFeedbackDock } from "@/components/feedback/user-feedback-dock";
import "@/components/feedback/user-feedback-global.css";

/** Wraps marketing chrome so feedback is available on every page (footer + FAB). */
export function MarketingFeedbackShell({ children }: { children: ReactNode }) {
  return (
    <UserFeedbackProvider surface="marketing">
      {children}
      <Suspense fallback={null}>
        <UserFeedbackDock />
      </Suspense>
    </UserFeedbackProvider>
  );
}
