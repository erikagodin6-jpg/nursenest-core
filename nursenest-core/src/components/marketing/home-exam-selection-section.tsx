"use client";

import { ArrowRight, Stethoscope, HeartPulse, Award, Dna, GraduationCap } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { publicExamPrepHubDestinations } from "@/lib/navigation/canonical-destinations";
import { publicNewGradStudyDestinations } from "@/lib/navigation/marketing-pathway-nav-destinations";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { getPathwayHubCta } from "@/lib/copy/cta-copy";
import type { LucideIcon } from "lucide-react";
import { getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";

type ExamCard = {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  accentColor: string;
  titleKey?: string;
  descKey?: string;
  titleLabel?: string;
  descLabel?: string;
  pathwayLabel: string;
  href: string;
  featured?: boolean;
};

/**
 * Prominent exam selection: rich pathway cards — RN, LPN/RPN, NP, New Grad, Allied.
 * Each card has a colored top accent and semantic icon for immediate visual differentiation.
 * Section uses `page-bg` (not `bg-card`) so pathway cards read clearly above the band.
 */
export function HomeExamSelectionSection() {
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);
  const hubs = publicExamPrepHubDestinations(region);
  const newGradDest = publicNewGradStudyDestinations(region, hubs.rn);

  const cards: ExamCard[] = [
    {
      id: "rn",
      icon: Stethoscope,
      iconColor: "text-[var(--semantic-info)]",
      accentColor: "var(--semantic-info)",
      titleKey: "home.conversion.examCard.rnTitle",
      descKey: "home.conversion.examCard.rnDesc",
      pathwayLabel: "RN",
      href: loc(hubs.rn),
      featured: true,
    },
    {
      id: "pn",
      icon: HeartPulse,
      iconColor: "text-[var(--semantic-warning)]",
      accentColor: "var(--semantic-warning)",
      titleKey: region === "US" ? "home.conversion.examCard.pnTitleUS" : "home.conversion.examCard.pnTitleCA",
      descKey: region === "US" ? "home.conversion.examCard.pnDescUS" : "home.conversion.examCard.pnDescCA",
      pathwayLabel: getNursingRoleLabel({ country: region, role: "PN" }),
      href: loc(hubs.pn),
    },
    {
      id: "np",
      icon: Award,
      iconColor: "text-[var(--semantic-brand)]",
      accentColor: "var(--semantic-brand)",
      titleKey: region === "US" ? "home.conversion.examCard.npTitleUS" : "home.conversion.examCard.npTitleCA",
      descKey: region === "US" ? "home.conversion.examCard.npDescUS" : "home.conversion.examCard.npDescCA",
      pathwayLabel: "NP",
      href: loc(hubs.np),
    },
    {
      id: "newgrad",
      icon: GraduationCap,
      iconColor: "text-[var(--semantic-chart-4)]",
      accentColor: "var(--semantic-chart-4)",
      titleLabel: "New Grad",
      descLabel: "Transition-to-practice lessons, questions, adaptive prep, and study tools for your first year on the floor.",
      pathwayLabel: "New Grad",
      href: loc(newGradDest.hubHref),
    },
    {
      id: "allied",
      icon: Dna,
      iconColor: "text-[var(--semantic-success)]",
      accentColor: "var(--semantic-success)",
      titleKey: "home.conversion.examCard.alliedTitle",
      descKey: "home.conversion.examCard.alliedDesc",
      pathwayLabel: "Allied Health",
      href: loc(hubs.allied),
    },
  ];

  return (
    <section
      id="home-exam-paths"
      className="nn-section-block scroll-mt-20 border-b border-[var(--border-subtle)] bg-[var(--page-bg)]"
      aria-labelledby="home-exam-selection-heading"
      data-testid="section-exam-selection"
    >
      <div className="nn-section-shell">
        <FadeUp whenInView once viewMargin="-32px" className="mx-auto mb-12 max-w-2xl text-center">
          <h2 id="home-exam-selection-heading" className="nn-marketing-h2 text-balance">
            {formatTitleCase("Choose Your Exam Hub", locale)}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-[var(--theme-muted-text)]">
            {formatSentenceCase(t("home.conversion.examSelectionSub"), locale)}
          </p>
        </FadeUp>

        <StaggerGroup
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5"
          staggerMs={65}
          whenInView
          once
          viewMargin="-40px"
        >
          {cards.map((c) => {
            const Icon = c.icon;
            const title = c.titleLabel ?? (c.titleKey ? formatTitleCase(t(c.titleKey), locale) : "");
            const description = c.descLabel ?? (c.descKey ? formatSentenceCase(t(c.descKey), locale) : "");
            return (
              <StaggerItem
                key={c.id}
                variant="softReveal"
                className={c.featured ? "min-w-0 sm:col-span-2 lg:col-span-1" : "min-w-0"}
              >
                <MarketingTrackedLink
                  href={c.href}
                  event={PH.marketingHomePathwayCardPrimary}
                  eventProps={{ pathway: c.id, region, surface: "exam_selection" }}
                  secondaryCapture={{
                    event: PH.funnelHomeToExamHub,
                    eventProps: { placement: "exam_selection_grid", pathway: c.id, region },
                  }}
                  data-nn-marketing-region={region}
                  data-nn-exam-card-id={c.id}
                  className="nn-card-system nn-card-system-pad nn-card-system--interactive nn-student-card-lift group relative h-full min-h-[14rem] overflow-hidden"
                  style={{
                    borderTopColor: `color-mix(in srgb, ${c.accentColor} 70%, var(--border-subtle))`,
                    borderTopWidth: "3px",
                  }}
                >
                    {/* Icon badge — colored per pathway */}
                    <span
                      className="nn-card-system__icon mb-1 transition group-hover:scale-[1.03]"
                      style={{
                        background: `color-mix(in srgb, ${c.accentColor} 10%, var(--bg-card))`,
                        borderColor: `color-mix(in srgb, ${c.accentColor} 24%, var(--border-subtle))`,
                      }}
                      aria-hidden
                    >
                      <Icon className={`h-5 w-5 ${c.iconColor}`} />
                    </span>

                    <span className="nn-card-system__title">{title}</span>
                    <span className="nn-card-system__description">{description}</span>

                    <span className="nn-card-system__cta">
                      {formatTitleCase(getPathwayHubCta(c.pathwayLabel), locale)}
                      <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                    </span>
                  </MarketingTrackedLink>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
