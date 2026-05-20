"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";

/**
 * Shown when an optional learner island throws — shell + nav stay up; user keeps a clear path to study.
 */
export function LearnerSilentSectionDegradedFallback({ surfaceName }: { surfaceName?: string }) {
  const { t } = useMarketingI18n();
  return (
    <div
      className="mb-[var(--nn-rhythm-tight-y)] rounded-xl border px-4 py-3 text-sm"
      role="status"
      aria-live="polite"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-info) 28%, var(--semantic-border-soft))",
        background: "color-mix(in srgb, var(--semantic-panel-cool) 88%, var(--semantic-surface))",
      }}
    >
      <p className="font-semibold text-[var(--semantic-text-primary)]">{t("learner.degraded.dataLoadingHint")}</p>
      <p className="mt-1 leading-relaxed text-[var(--semantic-text-secondary)]">
        {t("learner.degraded.sectionFallbackBody")}
      </p>
      {surfaceName && process.env.NODE_ENV === "development" ? (
        <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">[{surfaceName}]</p>
      ) : null}
    </div>
  );
}
