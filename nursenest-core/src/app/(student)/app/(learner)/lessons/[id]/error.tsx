"use client";

import Link from "next/link";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ProductErrorState } from "@/components/ui/product-error-state";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getErrorMessageDevLine, shouldShowErrorBoundaryDevDetail } from "@/lib/runtime/error-message";

export default function LearnerLessonDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useMarketingI18n();

  useEffect(() => {
    Sentry.captureException(error, { tags: { surface: "learner_lesson_detail", feature: "react_error_boundary" } });
  }, [error]);

  const showDetail = shouldShowErrorBoundaryDevDetail();

  return (
    <div className="px-4 py-8">
      <ProductErrorState
        title={t("learner.error.section.title")}
        description={t("learner.error.section.description")}
        reference={error.digest}
        referenceLabel={t("learner.error.section.referenceLabel")}
        detail={showDetail ? getErrorMessageDevLine(error) : null}
        autoRetryAfterMs={2200}
        onRetry={() => reset()}
        retryLabel={t("learner.error.section.tryAgain")}
        homeHref="/app/lessons"
        homeLabel={t("learner.lessons.detail.allLessons")}
        showLeaf
      />
      <p className="mt-4 text-center text-sm text-[var(--semantic-text-secondary)]">
        <Link href="/app" className="font-medium text-primary underline">
          {t("learner.error.section.dashboard")}
        </Link>
      </p>
    </div>
  );
}
