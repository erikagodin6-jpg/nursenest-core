"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getErrorMessage } from "@/lib/runtime/error-message";

export default function LearnerError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const { t } = useMarketingI18n();

  useEffect(() => {
    Sentry.captureException(error, { tags: { route: "student_app_error", feature: "react_error_boundary" } });
  }, [error]);

  return (
    <div className="nn-card p-6">
      <a href="/" className="mb-4 inline-flex bg-transparent" aria-label={t("brand.homeAriaLabel")}>
        <SiteBrandLogoMark variant="auth" />
      </a>
      <h2 className="text-xl font-semibold">{t("learner.error.app.title")}</h2>
      <p className="mt-2 text-sm text-muted">{t("learner.error.app.description")}</p>
      <p className="mt-2 text-xs text-muted">{getErrorMessage(error)}</p>
      <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold" onClick={reset}>
        {t("learner.error.app.retry")}
      </button>
    </div>
  );
}
