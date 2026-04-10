import Link from "next/link";
import { Crosshair, CheckCircle2 } from "lucide-react";
import type { WeakAreaInsight, WeaknessTier } from "@/lib/insights/types";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { remediationLessonsTopicHref, remediationTopicDrillHref } from "@/lib/learner/remediation-links";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";

function tierClass(tier: WeaknessTier): string {
  switch (tier) {
    case "critical":
      return "border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--semantic-border-soft))] bg-[var(--semantic-danger-soft)] text-[var(--semantic-danger-contrast)]";
    case "weak":
      return "border-[color-mix(in_srgb,var(--semantic-warning)_38%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] text-[var(--semantic-warning-contrast)]";
    case "moderate":
      return "nn-badge-semantic-info";
    case "strong":
      return "nn-badge-semantic-success";
    default:
      return "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-primary)]";
  }
}

function weakTierLabel(tr: LearnerMarketingT, tier: WeaknessTier): string {
  switch (tier) {
    case "critical":
      return tr("learner.dashboard.insight.tier.critical");
    case "weak":
      return tr("learner.dashboard.insight.tier.weak");
    case "moderate":
      return tr("learner.dashboard.insight.tier.moderate");
    case "strong":
      return tr("learner.dashboard.insight.tier.strong");
    default:
      return tier;
  }
}

function riskLabel(tr: LearnerMarketingT, risk: "high" | "medium" | "low"): string {
  switch (risk) {
    case "high":
      return tr("learner.dashboard.insight.risk.high");
    case "medium":
      return tr("learner.dashboard.insight.risk.medium");
    case "low":
      return tr("learner.dashboard.insight.risk.low");
    default:
      return risk;
  }
}

export function DashboardWeakAreasCard({
  weakAreas,
  t,
  maxRows = 6,
}: {
  weakAreas: WeakAreaInsight[];
  t: LearnerMarketingT;
  maxRows?: number;
}) {
  const rows = weakAreas.slice(0, maxRows);

  return (
    <section
      id="dashboard-weak-areas"
      className="nn-card nn-product-surface-accent nn-student-card-lift relative scroll-mt-24 overflow-hidden border-[color-mix(in_srgb,var(--semantic-danger)_18%,var(--semantic-border-soft))] bg-gradient-to-b from-[color-mix(in_srgb,var(--semantic-danger)_06%,var(--semantic-surface))] to-[var(--semantic-surface)] pt-7 shadow-[var(--semantic-shadow-soft)]"
    >
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))]">
            <Crosshair className="h-4 w-4 text-[var(--semantic-danger)]" aria-hidden strokeWidth={2} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--semantic-danger)]">{t("learner.dashboard.insight.weakKicker")}</p>
            <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">{t("learner.dashboard.insight.weakTitle")}</h3>
            <p className="text-xs text-[var(--semantic-text-secondary)]">{t("learner.dashboard.insight.weakHint")}</p>
          </div>
        </div>

        {rows.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {rows.map((w) => (
              <li
                key={`${w.topic}-${w.tier}`}
                className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,transparent)] bg-[color-mix(in_srgb,var(--semantic-warning)_04%,var(--semantic-surface))] px-3 py-3 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-[var(--semantic-text-primary)]">{w.topic}</span>
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tierClass(w.tier)}`}>
                    {weakTierLabel(t, w.tier)}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--semantic-text-secondary)]">{w.why}</p>
                <p className="mt-1 text-[11px] text-[var(--semantic-text-muted)]">{riskLabel(t, w.risk)}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link
                    href={remediationLessonsTopicHref(w.topic, w.normalizedTopic ?? null)}
                    className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-2.5 py-1 text-[11px] font-semibold text-[var(--semantic-brand)] hover:bg-[var(--semantic-panel-muted)]"
                  >
                    {t("learner.dashboard.insight.reviewLessonsCta")}
                  </Link>
                  <Link
                    href={remediationTopicDrillHref(w.topic)}
                    className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] px-2.5 py-1 text-[11px] font-semibold text-[var(--semantic-info)] hover:opacity-95"
                  >
                    {t("learner.dashboard.insight.practiceQuestionsCta")}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5">
            <PremiumEmptyState
              data-nn-empty="dashboard-weak-areas"
              tone="early"
              density="compact"
              visualLayout="split"
              Icon={CheckCircle2}
              headline="No focus areas identified yet"
              body={t("learner.dashboard.insight.weakEmpty")}
              hint={emptyStateCopy.noWeakAreasYet.body}
              primaryCta={{ label: t("learner.dashboard.empty.startPracticeCta"), href: "/app/questions", variant: "primary" }}
              className="border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_05%,var(--semantic-surface))]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
