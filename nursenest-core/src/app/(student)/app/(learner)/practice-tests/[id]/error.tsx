"use client";

import Link from "next/link";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ProductErrorState } from "@/components/ui/product-error-state";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getErrorMessage } from "@/lib/runtime/error-message";

export default function PracticeTestRunSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useMarketingI18n();

  useEffect(() => {
    Sentry.captureException(error, { tags: { surface: "practice_test_run_page", feature: "react_error_boundary" } });
  }, [error]);

  const showDetail = process.env.NODE_ENV === "development";

  return (
    <main className="px-4 py-6">
      <ProductErrorState
        title={t("learner.practiceTests.run.loadFailedTitle")}
        description={t("learner.error.section.description")}
        reference={error.digest}
        detail={showDetail ? getErrorMessage(error) : null}
        onRetry={() => reset()}
        retryLabel={t("learner.error.section.tryAgain")}
        homeHref="/app/practice-tests"
        homeLabel={t("learner.practiceTests.title")}
        showLeaf={false}
      />
      <p className="mt-4 text-center text-xs text-[var(--semantic-text-muted)]">
        <Link href="/app" className="underline">
          {t("learner.error.section.dashboard")}
        </Link>
      </p>
    </main>
  );
}
