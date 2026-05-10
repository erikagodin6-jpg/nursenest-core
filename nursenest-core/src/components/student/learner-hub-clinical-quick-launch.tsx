import Link from "next/link";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { buildPremiumDashboardLaunchTiles, type PremiumLaunchTone } from "@/lib/learner/premium-dashboard-launch-tiles";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  CLINICAL_SCENARIOS_SHELL_NAV_ID,
  OSCE_SHELL_NAV_ID,
} from "@/lib/navigation/learner-primary-nav";

function toneClasses(tone: PremiumLaunchTone): { wrap: string; icon: string; cta: string } {
  switch (tone) {
    case "success":
      return {
        wrap: "border-[color-mix(in_srgb,var(--semantic-success)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_07%,var(--semantic-surface))]",
        icon: "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-success)]",
        cta: "text-[var(--semantic-success)]",
      };
    case "info":
      return {
        wrap: "border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))]",
        icon: "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] text-[var(--semantic-info)]",
        cta: "text-[var(--semantic-info)]",
      };
    case "chart3":
      return {
        wrap: "border-[color-mix(in_srgb,var(--semantic-chart-3)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_07%,var(--semantic-surface))]",
        icon: "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-3)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-3)_92%,var(--semantic-text-primary))]",
        cta: "text-[color-mix(in_srgb,var(--semantic-chart-3)_88%,var(--semantic-text-primary))]",
      };
    case "chart4":
      return {
        wrap: "border-[color-mix(in_srgb,var(--semantic-chart-4)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_09%,var(--semantic-surface))]",
        icon: "border-[color-mix(in_srgb,var(--semantic-chart-4)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-4)_92%,var(--semantic-text-primary))]",
        cta: "text-[color-mix(in_srgb,var(--semantic-chart-4)_90%,var(--semantic-text-primary))]",
      };
    case "brand":
      return {
        wrap: "border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))]",
        icon: "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)]",
        cta: "text-[var(--semantic-brand)]",
      };
    case "warning":
    default:
      return {
        wrap: "border-[color-mix(in_srgb,var(--semantic-warning)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))]",
        icon: "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] text-[var(--semantic-warning)]",
        cta: "text-[color-mix(in_srgb,var(--semantic-warning)_85%,var(--semantic-text-primary))]",
      };
  }
}

function qaAttrsForTileKey(key: string): Record<string, string> {
  switch (key) {
    case "labs":
      return { "data-nn-qa-dash-labs-launch": "1" };
    case OSCE_SHELL_NAV_ID:
      return { "data-nn-qa-dash-osce-launch": "1" };
    case CLINICAL_SCENARIOS_SHELL_NAV_ID:
      return { "data-nn-qa-dash-clinical-scenarios": "1" };
    case "medCalculations":
      return { "data-nn-qa-dash-med-calc-launch": "1" };
    case "clinicalSkills":
      return { "data-nn-qa-dash-clinical-skills-launch": "1" };
    case "pharmacology":
      return { "data-nn-qa-dash-pharm-launch": "1" };
    case "diagnosticReasoning":
      return { "data-nn-qa-dash-diagnostic-launch": "1" };
    case "clinicalCases":
      return { "data-nn-qa-dash-clinical-cases-launch": "1" };
    default:
      return {};
  }
}

/**
 * Horizontal quick-launch — canonical premium module order via {@link buildPremiumDashboardLaunchTiles}.
 * Same DOM/tokens for Ocean / Blossom / Midnight (structure canonical; themes vary by semantic tokens only).
 */
export function LearnerHubClinicalQuickLaunch({
  t,
  snapshot,
}: {
  t: LearnerMarketingT;
  snapshot: PremiumDashboardSnapshot;
}) {
  const pathwayId =
    snapshot.pathways.find((p) => p.pathwayId === snapshot.learnerPath)?.pathwayId ??
    snapshot.pathways.find((p) => p.lessonsTotal > 0)?.pathwayId ??
    snapshot.pathways[0]?.pathwayId ??
    null;

  const pathwayDef = pathwayId ? getExamPathwayById(pathwayId) : null;

  const { tiles, variant } = buildPremiumDashboardLaunchTiles({
    t,
    snapshot,
    pathwayDef,
    pathwayId,
  });

  const pnPractical = variant === "pn-practical";
  const npPremium = variant === "np-premium";

  return (
    <div
      className={`nn-cockpit-quick-actions nn-dash-hub-quick-launch nn-premium-module-launch-rail flex min-w-0 gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden${pnPractical ? " nn-dash-hub-quick-launch--pn-practical" : ""}${npPremium ? " nn-dash-hub-quick-launch--np-premium" : ""}`}
      data-testid="learner-hub-clinical-quick-launch"
      {...(pnPractical ? { "data-nn-pn-practical-quick-launch": "" } : {})}
      {...(npPremium ? { "data-nn-np-premium-quick-launch": "" } : {})}
      data-nn-premium-ecosystem-launch=""
    >
      {tiles.map((tile) => {
        const tc = toneClasses(tile.tone);
        const Icon = tile.icon;
        return (
          <Link
            key={tile.key}
            href={tile.href}
            className={`nn-premium-module-launch-card group flex min-h-[7.5rem] min-w-[10.5rem] max-w-[14rem] shrink-0 snap-start flex-col justify-between rounded-2xl border p-3.5 shadow-[var(--semantic-shadow-soft)] transition-[transform,box-shadow] duration-200 sm:min-h-0 sm:min-w-0 sm:max-w-none sm:flex-1 sm:p-4 ${tc.wrap} hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none`}
            {...qaAttrsForTileKey(tile.key)}
          >
            <div className="flex items-start gap-2.5">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-[1.02] ${tc.icon}`}
              >
                <Icon className="h-4 w-4" aria-hidden strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <h3 className="text-xs font-bold leading-tight text-[var(--semantic-text-primary)]">{tile.title}</h3>
                <p className="mt-1 text-[10px] leading-snug text-[var(--semantic-text-secondary)]">{tile.desc}</p>
              </div>
            </div>
            <span className={`mt-2 text-[10px] font-semibold sm:text-xs ${tc.cta} group-hover:underline`}>{tile.cta}</span>
          </Link>
        );
      })}
    </div>
  );
}
