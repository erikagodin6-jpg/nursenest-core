"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { QuestionBankPeerStatsClient } from "@/lib/questions/question-bank-client-types";
import { QuestionChoiceLetter } from "@/components/student/question-choice-letter";

function semanticBarClass(pct: number): string {
  if (pct >= 50) return "nn-progress-fill-semantic-success";
  if (pct >= 25) return "nn-progress-fill-semantic-info";
  if (pct >= 10) return "nn-progress-fill-semantic-warning";
  return "nn-progress-fill-semantic-muted";
}

export function QuestionBankPeerPerformancePanel({
  peerStats,
  optionCanonicals,
  optionDisplays,
}: {
  peerStats: QuestionBankPeerStatsClient;
  optionCanonicals: string[];
  optionDisplays: string[];
}) {
  const { t } = useMarketingI18n();
  const pctMap = peerStats.optionPercentages ?? {};

  const labelFor = (canonical: string) => {
    const i = optionCanonicals.indexOf(canonical);
    if (i >= 0 && optionDisplays[i]) return optionDisplays[i];
    return canonical;
  };

  const selectedSummary = peerStats.selectedOptionKeys.map(labelFor).join("; ") || t("learner.qbank.peer.noneSelected");
  const correctSummary = peerStats.correctOptionKeys.map(labelFor).join("; ");

  return (
    <section
      className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] px-4 py-4 sm:px-5"
      aria-labelledby="nn-qbank-peer-heading"
    >
      <h3
        id="nn-qbank-peer-heading"
        className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]"
      >
        {t("learner.qbank.peer.heading")}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-primary)]">
        <span className="font-semibold">{t("learner.qbank.peer.youSelected")}</span> {selectedSummary}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-primary)]">
        <span className="font-semibold">{t("learner.qbank.peer.correctAnswer")}</span> {correctSummary}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-muted)]">
        Based on {peerStats.totalAttempts.toLocaleString()} learner responses.
      </p>
      {peerStats.insufficientSampleMessage ? (
        <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]" role="status">
          {peerStats.insufficientSampleMessage}
        </p>
      ) : (
        <>
          {typeof peerStats.correctPercentage === "number" ? (
            <p className="mt-3 text-sm font-semibold text-[var(--semantic-text-primary)]" aria-live="polite">
              {t("learner.qbank.peer.classCorrect", { pct: peerStats.correctPercentage })}
            </p>
          ) : null}
          <ul className="mt-3 space-y-3" aria-label={t("learner.qbank.peer.optionDistributionAria")}>
            {optionCanonicals.map((canonical, i) => {
              const pct = pctMap[canonical] ?? 0;
              const display = optionDisplays[i] ?? canonical;
              const isCorrect = peerStats.correctOptionKeys.includes(canonical);
              const isYours = peerStats.selectedOptionKeys.includes(canonical);
              const tags: string[] = [];
              if (isCorrect) tags.push(t("learner.qbank.peer.tagCorrect"));
              if (isYours) tags.push(t("learner.qbank.peer.tagYours"));
              const tagText = tags.length ? ` — ${tags.join("; ")}` : "";
              return (
                <li key={`${i}-${canonical.slice(0, 24)}`} className="list-none">
                  <div className="flex items-start justify-between gap-2 text-sm text-[var(--semantic-text-primary)]">
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-[var(--semantic-text-primary)]">
                        <QuestionChoiceLetter index={i} />.
                      </span>{" "}
                      <span className="text-[var(--semantic-text-secondary)]">{display}</span>
                      {tagText ? <span className="text-[var(--semantic-text-muted)]">{tagText}</span> : null}
                    </div>
                    <span className="shrink-0 tabular-nums font-semibold text-[var(--semantic-text-primary)]">
                      {pct}%
                    </span>
                  </div>
                  <div
                    className="nn-progress-track-semantic mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-3)_12%,var(--semantic-border-soft))]"
                    role="presentation"
                  >
                    <div
                      className={`h-full min-w-0 rounded-full transition-[width] duration-300 ${semanticBarClass(pct)}`}
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
