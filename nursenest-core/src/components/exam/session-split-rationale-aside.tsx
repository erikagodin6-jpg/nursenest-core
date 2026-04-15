"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";

/**
 * Right column for FAQ-aligned split sessions when no rationale body is shown yet
 * (e.g. CAT exam mode — explanations after session).
 */
export function SessionSplitRationaleAside({ variant }: { variant: "locked" | "placeholder" }) {
  const { t } = useMarketingI18n();
  const body =
    variant === "locked"
      ? t("learner.session.split.rationaleLocked")
      : t("learner.qbank.split.rationalePlaceholder");
  return (
    <aside className="nn-question-session-rationale space-y-4">
      <div className="nn-question-rationale-placeholder">
        <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          {t("learner.qbank.split.rationaleHeading")}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{body}</p>
      </div>
    </aside>
  );
}
