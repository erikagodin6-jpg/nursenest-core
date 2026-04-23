import Link from "next/link";
import { Compass } from "lucide-react";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { recommendNextActions } from "@/lib/learner/recommend-next-actions";
import type { StudyNextRecommendation } from "@/lib/learner/study-next-types";

function sourceLabelKey(source: LearnerStudySnapshot["topicPerformanceSource"]): string {
  switch (source) {
    case "ledger":
      return "learner.adaptive.source.ledger";
    case "mixed":
      return "learner.adaptive.source.mixed";
    default:
      return "learner.adaptive.source.fallback";
  }
}

/**
 * Dashboard: weak areas, trajectory, and deterministic next steps from the same snapshot as Study Next.
 * When `studyNextRecs` is provided (e.g. smart layer with suppression), uses it; otherwise falls back to base ranking.
 */
export async function LearnerAdaptiveFocusCard({
  snapshot,
  studyNextRecs,
}: {
  snapshot: LearnerStudySnapshot;
  studyNextRecs?: StudyNextRecommendation[] | null;
}) {
  const { t } = await getLearnerMarketingBundle();
  const recs =
    studyNextRecs && studyNextRecs.length > 0 ? studyNextRecs : recommendNextActions(snapshot, { maxTotal: 2 });
  const weakShow = snapshot.weakTopics.slice(0, 5);
  const trend = snapshot.topicTrends[0] ?? null;
  const strong = snapshot.strongTopicsHighlight[0] ?? null;

  const hasPersonalSignal =
    weakShow.length > 0 || trend != null || strong != null || snapshot.recommendedFocusTopic != null;

  return (
    <section
      className="nn-card border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-gradient-to-br from-[var(--semantic-info-soft)] via-[var(--semantic-surface)] to-[color-mix(in_srgb,var(--semantic-brand)_04%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)]"
      aria-labelledby="nn-adaptive-focus-heading"
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--semantic-info-soft)] text-[var(--semantic-info)]">
          <Compass className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="nn-adaptive-focus-heading" className="text-lg font-semibold text-[var(--theme-heading-text)]">
            {t("learner.adaptive.title")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{t(sourceLabelKey(snapshot.topicPerformanceSource))}</p>
        </div>
      </div>

      {!hasPersonalSignal ? (
        <p className="mt-4 text-sm text-muted-foreground">{t("learner.adaptive.emptyState")}</p>
      ) : (
        <div className="mt-4 space-y-4">
          {weakShow.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("learner.adaptive.weakHeading")}
              </p>
              <ul className="mt-2 space-y-1.5">
                {weakShow.map((w) => (
                  <li
                    key={w.normalizedTopic ?? w.topic}
                    className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-foreground"
                  >
                    <span className="font-medium [overflow-wrap:anywhere]">{w.topic}</span>
                    <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                      {t("learner.adaptive.weakMeta", {
                        missRate: w.missRate,
                        attempted: w.attempted,
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {trend ? (
            <p className="text-sm text-foreground/90">
              <span className="font-medium text-foreground">{trend.topic}: </span>
              {trend.summary}
            </p>
          ) : null}

          {strong && weakShow.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("learner.adaptive.smallWin", { topic: strong.topic, rate: 100 - strong.missRate })}
            </p>
          ) : null}
        </div>
      )}

      {recs.length > 0 ? (
        <div className="mt-5 border-t border-border/60 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("learner.adaptive.suggestedHeading")}
          </p>
          <ul className="mt-3 space-y-3">
            {recs.map((r) => (
              <li
                key={`${r.href}-${r.type}`}
                className="flex flex-col gap-2 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--theme-heading-text)] [overflow-wrap:anywhere]">{r.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground [overflow-wrap:anywhere]">{r.reasonShort}</p>
                </div>
                <Link
                  href={r.href}
                  className="inline-flex shrink-0 justify-center rounded-full bg-role-cta px-3 py-1.5 text-center text-xs font-semibold text-role-cta-foreground shadow-[0_2px_8px_var(--role-cta-shadow)]"
                >
                  {t("learner.adaptive.suggestedCta")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
