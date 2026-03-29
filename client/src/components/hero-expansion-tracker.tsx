import { useQuery } from "@tanstack/react-query";
import type { PlatformProof } from "@shared/lesson-stats";
import {
  NURSING_TIERS,
  PRE_NURSING_GOAL,
  NEW_GRAD_GOAL,
  ALLIED_HEALTH_CAREERS,
} from "@shared/platform-manifest";
import { TrendingUp } from "lucide-react";

import { useI18n } from "@/lib/i18n";
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
  const { t } = useI18n();
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return (
    <div className="space-y-1.5" data-testid={`tracker-row-${label.toLowerCase().replace(/[\s()\/]+/g, "-")}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-xs text-gray-500">
          {current > 0 ? current.toLocaleString() : "---"} / {goal.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${current > 0 ? Math.max(pct, 3) : 0}%` }}
        />
      </div>
      {current > 0 && (
        <div className="text-right text-[10px] text-gray-400">{pct}% of goal</div>
      )}
    </div>
  );
}

export default function HeroExpansionTracker() {
  const { data: proof } = useQuery<PlatformProof>({
    queryKey: ["/api/public/platform-proof"],
    staleTime: 15 * 60 * 1000,
  });

  const rpnQ = proof?.rpnQuestions ?? 0;
  const rnQ = proof?.rnQuestions ?? 0;
  const npQ = proof?.npQuestions ?? 0;

  const tierRows = [
    { label: NURSING_TIERS.rpn.shortLabel + " Question Bank", current: rpnQ, goal: NURSING_TIERS.rpn.goalQuestions, color: "bg-emerald-500" },
    { label: NURSING_TIERS.rn.shortLabel + " Question Bank", current: rnQ, goal: NURSING_TIERS.rn.goalQuestions, color: "bg-blue-500" },
    { label: NURSING_TIERS.np.shortLabel + " Question Bank", current: npQ, goal: NURSING_TIERS.np.goalQuestions, color: "bg-violet-500" },
    { label: "Pre-Nursing", current: 0, goal: PRE_NURSING_GOAL.goalQuestions, color: "bg-sky-500" },
    { label: "New Grad Scenarios", current: 0, goal: NEW_GRAD_GOAL.goalScenarios, color: "bg-purple-500" },
  ];

  const alliedRows = ALLIED_HEALTH_CAREERS.filter((c) => c.tier === "major").map((c) => ({
    label: c.label.replace(/ \(.*\)/, ""),
    current: 0,
    goal: c.goalQuestions,
    color: "bg-teal-500",
  }));

  return (
    <section
      className="bg-gradient-to-b from-white to-gray-50/80 border-t border-gray-100"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-expansion-tracker"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            Live Content Expansion
          </div>
          <h2
            className="font-bold text-gray-900 mb-2"
            style={{ fontSize: "var(--text-section)" }}
            data-testid="text-expansion-tracker-heading"
          >
            Question Bank Growth Tracker
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Track our progress toward building the most comprehensive healthcare exam preparation question banks available.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-card)] divide-y divide-gray-100">
          <div className="p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t("components.heroExpansionTracker.nursingTiers")}</h3>
            {tierRows.map((row) => (
              <ProgressRow key={row.label} {...row} />
            ))}
          </div>
          <div className="p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t("components.heroExpansionTracker.alliedHealthMajorCareers")}</h3>
            {alliedRows.map((row) => (
              <ProgressRow key={row.label} {...row} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
