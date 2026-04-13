"use client";

import { Suspense, type ReactNode } from "react";
import { UserFeedbackProvider } from "@/components/feedback/user-feedback-context";
import { UserFeedbackDock } from "@/components/feedback/user-feedback-dock";
import "@/components/feedback/user-feedback-global.css";

export function LearnerFeedbackShell({
  pathwayId,
  children,
}: {
  pathwayId: string | null;
  children: ReactNode;
}) {
  return (
    <UserFeedbackProvider surface="learner" pathwayId={pathwayId}>
      {children}
      <Suspense fallback={null}>
        <UserFeedbackDock />
      </Suspense>
    </UserFeedbackProvider>
  );
}
