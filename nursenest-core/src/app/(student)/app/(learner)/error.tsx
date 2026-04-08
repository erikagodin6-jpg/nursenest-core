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
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useMarketingI18n();

  useEffect(() => {
    Sentry.captureException(error, { tags: { route: "learner_error", feature: "react_error_boundary" } });
  }, [error]);

  const digest = error.digest;
  const showDetail = process.env.NODE_ENV === "development";

  return (
    <main className="space-y-4">
      <a href="/app" className="inline-flex bg-transparent" aria-label={t("brand.homeAriaLabel")}>
        <SiteBrandLogoMark variant="auth" />
      </a>
      <h1 className="text-2xl font-bold">{t("learner.error.section.title")}</h1>
      <p className="text-sm text-muted">{t("learner.error.section.description")}</p>
      {digest ? (
        <p className="text-xs text-muted">
          {t("learner.error.section.referenceLabel")} {digest}
        </p>
      ) : null}
      {showDetail ? <p className="text-xs text-muted">{getErrorMessage(error)}</p> : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => reset()}>
          {t("learner.error.section.tryAgain")}
        </button>
        <a href="/app" className="rounded-full border border-border px-4 py-2 text-sm font-medium">
          {t("learner.error.section.dashboard")}
        </a>
      </div>
    </main>
  );
}
