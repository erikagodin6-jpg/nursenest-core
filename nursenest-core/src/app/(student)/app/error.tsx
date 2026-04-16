"use client";

import Link from "next/link";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { ProductErrorState } from "@/components/ui/product-error-state";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getErrorMessageDevLine, shouldShowErrorBoundaryDevDetail } from "@/lib/runtime/error-message";

export default function LearnerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useMarketingI18n();

  useEffect(() => {
    Sentry.captureException(error, { tags: { route: "student_app_error", feature: "react_error_boundary" } });
  }, [error]);

  const digest = error.digest;
  const showDetail = shouldShowErrorBoundaryDevDetail();

  return (
    <main className="space-y-6">
      <Link href="/app" className="inline-flex bg-transparent" aria-label={t("brand.homeAriaLabel")}>
        <SiteBrandLogoMark variant="auth" logoVariant="leaf" />
      </Link>
      <ProductErrorState
        title={t("learner.error.app.title")}
        description={t("learner.error.app.description")}
        reference={digest}
        referenceLabel={t("learner.error.section.referenceLabel")}
        detail={showDetail ? getErrorMessageDevLine(error) : null}
        autoRetryAfterMs={2200}
        onRetry={() => reset()}
        retryLabel={t("learner.error.app.retry")}
        homeHref="/app"
        homeLabel={t("learner.error.section.dashboard")}
        showLeaf
        severity="default"
      />
    </main>
  );
}
