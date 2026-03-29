"use client";

import { NURSING_TIERS, PRE_NURSING_GOAL, NEW_GRAD_GOAL, ALLIED_HEALTH_CAREERS } from "@shared/platform-manifest";
import { TrendingUp } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

function ProgressRow({
  label,
  current,
  goal,
  color,
}: {
  label: string;
  current: number;
  goal: number;
  color: string;
}) {
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return (
    <div className="space-y-1.5" data-testid={`tracker-row-${label.toLowerCase().replace(/[\s()/]+/g, "-")}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--theme-body-text)]">{label}</span>
        <span className="text-xs text-[var(--theme-muted-text)]">
          {current > 0 ? current.toLocaleString() : "---"} / {goal.toLocaleString()}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${current > 0 ? Math.max(pct, 3) : 0}%` }} />
      </div>
      {current > 0 && <div className="text-right text-[10px] text-[var(--theme-muted-text)]">{pct}% of goal</div>}
    </div>
  );
}

export default function HeroExpansionTracker() {
  const { t } = useMarketingI18n();
  const rpnQ = 0;
  const rnQ = 0;
  const npQ = 0;

  const tierRows = [
    { label: `${NURSING_TIERS.rpn.shortLabel} Question Bank`, current: rpnQ, goal: NURSING_TIERS.rpn.goalQuestions, color: "bg-primary" },
    { label: `${NURSING_TIERS.rn.shortLabel} Question Bank`, current: rnQ, goal: NURSING_TIERS.rn.goalQuestions, color: "bg-primary" },
    { label: `${NURSING_TIERS.np.shortLabel} Question Bank`, current: npQ, goal: NURSING_TIERS.np.goalQuestions, color: "bg-primary" },
    { label: "Pre-Nursing", current: 0, goal: PRE_NURSING_GOAL.goalQuestions, color: "bg-primary" },
    { label: "New Grad Scenarios", current: 0, goal: NEW_GRAD_GOAL.goalScenarios, color: "bg-primary" },
  ];

  const alliedRows = ALLIED_HEALTH_CAREERS.filter((c) => c.tier === "major").map((c) => ({
    label: c.label.replace(/ \(.*\)/, ""),
    current: 0,
    goal: c.goalQuestions,
    color: "bg-primary",
  }));

  return (
    <section
      className="border-t border-[var(--theme-card-border)] bg-gradient-to-b from-[var(--theme-card-bg)] to-[var(--theme-muted-surface)]"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-expansion-tracker"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="nn-accent-pill mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-primary">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Live Content Expansion
          </div>
          <h2 className="mb-2 font-bold text-[var(--theme-heading-text)]" style={{ fontSize: "var(--text-section)" }} data-testid="text-expansion-tracker-heading">
            Question Bank Growth Tracker
          </h2>
          <p className="mx-auto max-w-xl text-sm text-[var(--theme-muted-text)]">
            Track our progress toward building the most comprehensive healthcare exam preparation question banks available.
          </p>
        </div>

        <div className="divide-y divide-[var(--theme-card-border)] rounded-2xl border border-[var(--theme-card-border)] bg-card shadow-[var(--shadow-card)]">
          <div className="space-y-5 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--theme-muted-text)]">{t("components.heroExpansionTracker.nursingTiers")}</h3>
            {tierRows.map((row) => (
              <ProgressRow key={row.label} {...row} />
            ))}
          </div>
          <div className="space-y-5 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--theme-muted-text)]">{t("components.heroExpansionTracker.alliedHealthMajorCareers")}</h3>
            {alliedRows.map((row) => (
              <ProgressRow key={row.label} {...row} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
