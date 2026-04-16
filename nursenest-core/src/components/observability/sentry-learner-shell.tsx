"use client";

import { useCallback, useEffect, useRef } from "react";
import * as Sentry from "@sentry/nextjs";
import { ErrorBoundary } from "@sentry/react";
import { ProductErrorState } from "@/components/ui/product-error-state";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getErrorMessageDevLine, shouldShowErrorBoundaryDevDetail } from "@/lib/runtime/error-message";
import { sentryUserHashClient } from "@/lib/observability/sentry-user-hash-client";
import { captureUxFailure, enrichSentryScopeWithUx } from "@/lib/observability/frontend-ux-tracking";

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
  const autoLogged = useRef(false);

  const onRetry = useCallback(() => {
    captureUxFailure({
      kind: "manual_retry",
      level: "info",
      message: "learner_shell_error_boundary_try_again",
    });
    resetBoundary();
  }, [resetBoundary]);

  const onAutoRetryInvoked = useCallback(() => {
    if (autoLogged.current) return;
    autoLogged.current = true;
    captureUxFailure({
      kind: "auto_retry_succeeded",
      level: "info",
      message: "learner_shell_error_boundary_auto_reset_invoked",
      retrySucceeded: true,
    });
  }, []);

  return (
    <ProductErrorState
      title={t("learner.error.section.title")}
      description={t("learner.error.section.description")}
      reference={digest}
      referenceLabel={t("learner.error.section.referenceLabel")}
      detail={showDetail && error instanceof Error ? getErrorMessageDevLine(error) : null}
      autoRetryAfterMs={2200}
      onAutoRetryInvoked={onAutoRetryInvoked}
      onRetry={onRetry}
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
      beforeCapture={(scope, err, componentStack) => {
        enrichSentryScopeWithUx(scope, { kind: "render_failure", fallbackShown: true });
        scope.setTag("feature", "learner_app");
        scope.setContext("react", { componentStack: componentStack.slice(0, 4000) });
        if (err instanceof Error) {
          scope.setFingerprint(["learner-shell", err.name, err.message.slice(0, 80)]);
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
