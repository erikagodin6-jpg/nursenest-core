"use client";

import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";

export function LearnerSurfaceProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </AuthSessionProvider>
  );
}
