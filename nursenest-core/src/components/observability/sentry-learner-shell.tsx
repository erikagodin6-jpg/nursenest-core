"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ErrorBoundary } from "@sentry/react";
import { ProductErrorState } from "@/components/ui/product-error-state";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getErrorMessageDevLine, shouldShowErrorBoundaryDevDetail } from "@/lib/runtime/error-message";
import { sentryUserHashClient } from "@/lib/observability/sentry-user-hash-client";

function LearnerSentryErrorFallback({
  error,
  resetBoundary,
}: {
  error: unknown;
  resetBoundary: () => void;
}) {
  const { t } = useMarketingI18n();
  const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;
  const showDetail = shouldShowErrorBoundaryDevDetail();

  return (
    <ProductErrorState
      title={t("learner.error.section.title")}
      description={t("learner.error.section.description")}
      reference={digest}
      referenceLabel={t("learner.error.section.referenceLabel")}
      detail={showDetail && error instanceof Error ? getErrorMessageDevLine(error) : null}
      autoRetryAfterMs={2200}
      onRetry={resetBoundary}
      retryLabel={t("learner.error.section.tryAgain")}
      homeHref="/app"
      homeLabel={t("learner.error.section.dashboard")}
      showLeaf
      severity="default"
    />
  );
}

export function SentryLearnerShell({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const sentryOn = process.env.NEXT_PUBLIC_SENTRY_ENABLED === "true";

  useEffect(() => {
    if (!sentryOn || !userId) return;
    let cancelled = false;
    void (async () => {
      const id = await sentryUserHashClient(userId);
      if (!cancelled) {
        Sentry.setUser({ id });
        Sentry.setTag("feature", "learner_app");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, sentryOn]);

  if (!sentryOn) {
    return <>{children}</>;
  }

  return (
    <ErrorBoundary
      fallback={({ error, resetError: resetBoundary }) => (
        <LearnerSentryErrorFallback error={error} resetBoundary={resetBoundary} />
      )}
      showDialog={false}
    >
      {children}
    </ErrorBoundary>
  );
}
