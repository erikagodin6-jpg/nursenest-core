"use client";

import { Suspense, lazy } from "react";

const SentryLearnerShellInstrumented = lazy(() => import("./sentry-learner-shell-instrumented"));

export function SentryLearnerShell({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const sentryOn = process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true";

  if (!sentryOn) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<>{children}</>}>
      <SentryLearnerShellInstrumented userId={userId}>{children}</SentryLearnerShellInstrumented>
    </Suspense>
  );
}
