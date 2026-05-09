"use client";

import type { CSSProperties } from "react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  buildPremiumMarketingModuleCards,
  isPreNursingPremiumPathway,
  resolvePremiumCardHref,
  type PremiumModuleCardModel,
} from "@/lib/marketing/exam-pathway-hub-premium-modules";
import { StudyCard } from "@/components/ui/study-card";
import { pathwayMarketingHubLinkContext } from "@/lib/marketing/np-seo-alias-analytics-props";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";

/** Semantic chart rotation for allied occupation hubs (pastel, theme-safe). */
export function alliedPremiumAccentChartVar(professionKey?: string | null): string {
  if (!professionKey?.trim()) return "--semantic-chart-3";
  let h = 0;
  const s = professionKey.trim().toLowerCase();
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * (i + 1)) % 5;
  const charts = [
    "--semantic-chart-1",
    "--semantic-chart-2",
    "--semantic-chart-3",
    "--semantic-chart-4",
    "--semantic-chart-5",
  ] as const;
  return charts[h] ?? "--semantic-chart-3";
}

type Props = {
  pathway: ExamPathwayDefinition;
  isSignedIn: boolean;
  npSeoAliasSegment?: string;
  /** Reserved for allied occupation hubs — analytics / future deep links; core nursing matrix ignores this. */
  alliedProfessionKey?: string | null;
  /** Merged onto the outer wrapper — use e.g. `mt-0` when a parent already provides vertical rhythm. */
  rootClassName?: string;
};

type SectionTone = "study" | "readiness" | "newGrad";

function premiumSectionSurfaceClass(tone: SectionTone): string {
  switch (tone) {
    case "study":
      return "border-[color-mix(in_srgb,var(--semantic-chart-2)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--semantic-surface))]";
    case "readiness":
      return "border-[color-mix(in_srgb,var(--semantic-chart-3)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_12%,var(--semantic-surface))]";
    case "newGrad":
      return "border-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--semantic-surface))]";
    default:
      return "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]";
  }
}

function PremiumModuleGrid({
  sectionId,
  headingKey,
  leadKey,
  cards,
  pathway,
  isSignedIn,
  npSeoAliasSegment,
  tone,
}: {
  sectionId: string;
  headingKey: string;
  leadKey: string;
  cards: PremiumModuleCardModel[];
  pathway: ExamPathwayDefinition;
  isSignedIn: boolean;
  npSeoAliasSegment?: string;
  tone: SectionTone;
}) {
  const { t } = useMarketingI18n();
  const linkCtx = pathwayMarketingHubLinkContext(pathway, npSeoAliasSegment);
  const allied = pathway.roleTrack === "allied";

  if (cards.length === 0) return null;

  return (
    <section className="space-y-4" aria-labelledby={sectionId}>
      <div
        data-nn-hub-premium-tone={tone}
        className={`rounded-2xl border p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6 ${premiumSectionSurfaceClass(tone)}`}
      >
        <div>
          <h2 id={sectionId} className="nn-marketing-h2 text-[var(--palette-heading)]">
            {t(headingKey)}
          </h2>
          <p className="nn-marketing-body-sm mt-2 max-w-2xl text-pretty text-[var(--semantic-text-secondary)]">
            {t(leadKey)}
          </p>
        </div>
        <ul className="mt-6 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const href = resolvePremiumCardHref(card, isSignedIn);
            const locked = Boolean(card.locked);
            const title = t(card.titleKey);
            const description =
              allied && card.key === "osce"
                ? t("components.examPathwayHub.premiumModules.osceBodyAllied")
                : t(card.bodyKey);
            const cta = locked ? t(card.lockedCtaKey) : t(card.ctaKey);
            const onClick = () => {
              if (locked) return;
              trackClientEvent(PH.marketingPathwayHubCta, {
                ...linkCtx,
                surface: "premium_module_grid",
                pathway_id: pathway.id,
                module_key: card.key,
                signed_in: isSignedIn,
                destination_type: "premium_module",
                link_target: card.key,
              });
            };
            const qaAttrs =
              card.qaMarker === "ecg"
                ? { "data-nn-qa-hub-ecg": "1" as const }
                : card.qaMarker === "np_clinical"
                  ? { "data-nn-qa-hub-np-cases": "1" as const }
                  : {};
            return (
              <li key={card.key} data-nn-qa-hub-premium-module={card.key} {...qaAttrs}>
                <StudyCard
                  surface="hub"
                  variant={locked ? "locked" : card.variant}
                  href={href}
                  icon={card.icon}
                  title={title}
                  description={description}
                  cta={cta}
                  ctaVariant="secondary"
                  {...(locked ? {} : { status: "premium" as const })}
                  onClick={onClick}
                  className={card.extraClass}
                  prefetch={false}
                  ariaLabel={`${title} — ${pathway.shortName}`}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/**
 * Secondary “premium module” grid for nursing pathway marketing hubs — labs, medication math,
 * pharmacology, optional ECG (RN/NP pathways per {@link pathwayAllowsEcgLinkedLearning}), scenarios/OSCE,
 * and readiness surfaces. PN/RPN hubs omit ECG automatically.
 */
export function ExamPathwayHubPremiumModules({
  pathway,
  isSignedIn,
  npSeoAliasSegment,
  alliedProfessionKey = null,
  rootClassName,
}: Props) {
  const { studyTools, readiness, newGrad } = buildPremiumMarketingModuleCards(pathway, {
    alliedProfessionKey,
  });
  const preNursingHub = isPreNursingPremiumPathway(pathway);
  const alliedHub = pathway.roleTrack === "allied";

  const accentVar = alliedPremiumAccentChartVar(alliedProfessionKey);
  const alliedBandStyle: CSSProperties | undefined = alliedHub
    ? {
        borderTopWidth: 3,
        borderTopStyle: "solid",
        borderTopColor: `color-mix(in srgb, var(${accentVar}) 40%, transparent)`,
      }
    : undefined;

  return (
    <div
      className={`mt-14 space-y-11 sm:mt-16 sm:space-y-12${alliedHub ? " rounded-[1.25rem] pt-6 sm:pt-8" : ""} ${rootClassName ?? ""}`.trim()}
      style={alliedBandStyle}
      data-nn-qa-pathway-premium-modules=""
      {...(alliedHub ? { "data-nn-allied-premium-accent": accentVar } : {})}
    >
      <PremiumModuleGrid
        sectionId="exam-hub-premium-study-tools-heading"
        headingKey={
          preNursingHub
            ? "components.examPathwayHub.premiumModules.preNursingStudyToolsHeading"
            : "components.examPathwayHub.premiumModules.studyToolsHeading"
        }
        leadKey={
          preNursingHub
            ? "components.examPathwayHub.premiumModules.preNursingStudyToolsLead"
            : alliedHub
              ? "components.examPathwayHub.premiumModules.alliedStudyToolsLead"
              : "components.examPathwayHub.premiumModules.studyToolsLead"
        }
        cards={studyTools}
        pathway={pathway}
        isSignedIn={isSignedIn}
        npSeoAliasSegment={npSeoAliasSegment}
        tone="study"
      />
      <PremiumModuleGrid
        sectionId="exam-hub-premium-readiness-heading"
        headingKey="components.examPathwayHub.premiumModules.readinessHeading"
        leadKey={
          preNursingHub
            ? "components.examPathwayHub.premiumModules.preNursingReadinessLead"
            : alliedHub
              ? "components.examPathwayHub.premiumModules.alliedReadinessLead"
              : "components.examPathwayHub.premiumModules.readinessLead"
        }
        cards={readiness}
        pathway={pathway}
        isSignedIn={isSignedIn}
        npSeoAliasSegment={npSeoAliasSegment}
        tone="readiness"
      />
      <PremiumModuleGrid
        sectionId="exam-hub-premium-new-grad-heading"
        headingKey="components.examPathwayHub.premiumModules.newGradHeading"
        leadKey="components.examPathwayHub.premiumModules.newGradLead"
        cards={newGrad}
        pathway={pathway}
        isSignedIn={isSignedIn}
        npSeoAliasSegment={npSeoAliasSegment}
        tone="newGrad"
      />
    </div>
  );
}
