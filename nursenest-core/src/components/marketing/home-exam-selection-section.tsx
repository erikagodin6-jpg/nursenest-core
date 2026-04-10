"use client";

import { ArrowRight, Stethoscope, HeartPulse, Award, Dna, BookOpen } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { marketingExamHubPath } from "@/lib/marketing/country-exam-offerings";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { HomeConversionCtaStrip } from "@/components/marketing/home-conversion-cta-strip";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import type { LucideIcon } from "lucide-react";

type ExamCard = {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  titleKey: string;
  descKey: string;
  ctaKey: string;
  metaUs: string;
  metaCa: string;
  href: string;
  featured?: boolean;
};

/**
 * Prominent exam selection: five rich pathway cards — RN, LPN/RPN, NP, Allied, New Grad.
 * Each shows icon, exam name, description, region-aware exam label, and a direct hub CTA.
 */
export function HomeExamSelectionSection() {
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  const cards: ExamCard[] = [
    {
      id: "rn",
      icon: Stethoscope,
      iconColor: "text-[var(--semantic-info)]",
      titleKey: "home.conversion.examCard.rnTitle",
      descKey: "home.conversion.examCard.rnDesc",
      ctaKey: "home.conversion.examCard.ctaRn",
      metaUs: "NCLEX-RN",
      metaCa: "NCLEX-RN",
      href: loc(marketingExamHubPath(region, "rn")),
      featured: true,
    },
    {
      id: "pn",
      icon: HeartPulse,
      iconColor: "text-[var(--semantic-warning)]",
      titleKey: region === "US" ? "home.conversion.examCard.pnTitleUS" : "home.conversion.examCard.pnTitleCA",
      descKey: region === "US" ? "home.conversion.examCard.pnDescUS" : "home.conversion.examCard.pnDescCA",
      ctaKey: "home.conversion.examCard.ctaPn",
      metaUs: "NCLEX-PN",
      metaCa: "REx-PN",
      href: loc(marketingExamHubPath(region, "pn")),
    },
    {
      id: "np",
      icon: Award,
      iconColor: "text-[var(--semantic-brand)]",
      titleKey: region === "US" ? "home.conversion.examCard.npTitleUS" : "home.conversion.examCard.npTitleCA",
      descKey: region === "US" ? "home.conversion.examCard.npDescUS" : "home.conversion.examCard.npDescCA",
      ctaKey: "home.conversion.examCard.ctaNp",
      metaUs: "FNP / PMHNP / AGPCNP",
      metaCa: "CNPLE",
      href: loc(marketingExamHubPath(region, "np")),
    },
    {
      id: "allied",
      icon: Dna,
      iconColor: "text-[var(--semantic-success)]",
      titleKey: "home.conversion.examCard.alliedTitle",
      descKey: "home.conversion.examCard.alliedDesc",
      ctaKey: "home.conversion.examCard.ctaAllied",
      metaUs: "Allied Health",
      metaCa: "Allied Health",
      href: loc(marketingExamHubPath(region, "allied")),
    },
    {
      id: "new-grad",
      icon: BookOpen,
      iconColor: "text-[var(--semantic-chart-2)]",
      titleKey: "home.conversion.examCard.newGradTitle",
      descKey: "home.conversion.examCard.newGradDesc",
      ctaKey: "home.conversion.examCard.ctaNewGrad",
      metaUs: "Pre-Nursing",
      metaCa: "Pre-Nursing",
      href: loc("/pre-nursing"),
    },
  ];

  return (
    <section
      id="home-exam-paths"
      className="scroll-mt-20 border-b border-[var(--trust-surface-border)] bg-[var(--trust-surface)] py-12 md:py-16"
      aria-labelledby="home-exam-selection-heading"
      data-testid="section-exam-selection"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <h2 id="home-exam-selection-heading" className="nn-marketing-h2 text-balance">
            {t("home.conversion.examSelectionTitle")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-pretty text-[var(--theme-muted-text)]">
            {t("home.conversion.examSelectionSub")}
          </p>
          <p className="nn-marketing-caption mx-auto mt-3 max-w-lg text-pretty text-[var(--theme-muted-text)]">
            {t("home.conversion.examSelectionFreeHint")}
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map((c) => {
            const Icon = c.icon;
            const meta = region === "CA" ? c.metaCa : c.metaUs;
            return (
              <li key={c.id} className={c.featured ? "sm:col-span-2 lg:col-span-1" : undefined}>
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
                  className="nn-card-soft nn-student-card-lift group flex h-full min-h-[14rem] flex-col p-5 transition hover:border-[color-mix(in_srgb,var(--theme-primary)_40%,var(--border-subtle))]"
                >
                  {/* Icon badge */}
                  <span
                    className="mb-3 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,currentColor_12%,var(--theme-card-bg))] transition group-hover:scale-105"
                    aria-hidden
                  >
                    <Icon className={`h-5 w-5 ${c.iconColor}`} />
                  </span>

                  {/* Exam label chip */}
                  <span className="nn-marketing-caption mb-1.5 font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    {meta}
                  </span>

                  <span className="nn-marketing-h3 text-balance leading-snug">{t(c.titleKey)}</span>
                  <span className="nn-marketing-body-sm mt-2 flex-1 text-[var(--theme-muted-text)]">{t(c.descKey)}</span>

                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--nn-aesthetic-accent)]">
                    {t(c.ctaKey)}
                    <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                  </span>
                </MarketingTrackedLink>
              </li>
            );
          })}
        </ul>

        <div className="mx-auto mt-10 max-w-5xl border-t border-[var(--border-subtle)] pt-10">
          <HomeConversionCtaStrip placement="after_exam_paths" />
        </div>
      </div>
    </section>
  );
}
