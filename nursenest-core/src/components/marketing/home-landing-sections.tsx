"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { defaultNursingExamMarketingHub } from "@/lib/marketing/marketing-exam-navigation";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { MARKETING_PRIMARY_CTA_CLASS, MARKETING_TERTIARY_LINK_CLASS } from "@/lib/theme/marketing-hero-pattern";

type Props = {
  questionCount: number;
};

function formatQCount(n: number, locale: string): string {
  if (n <= 0) return "";
  return n.toLocaleString(locale.replace(/_/g, "-"));
}

const SECTION_Y = "py-9 md:py-12";

/**
 * Lower homepage stack: why (differentiation), trust (stats + access), FAQ (objections), final CTA.
 * Carousel, reviews, and study modules above already show the product and social proof.
 */
export function HomeLandingSections({ questionCount }: Props) {
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);
  const qFormatted = formatQCount(questionCount, locale);

  const whyKeys = ["why1", "why2", "why3"] as const;

  /** Keep in sync with `MARKETING_HOME_FAQ_JSONLD` (first five + emotional objections). */
  const faqKeys = ["1", "2", "3", "4", "5", "6", "7"] as const;

  return (
    <>
      {/* "Why" band — border-derived trust-surface (hue-distinct from primary-tinted hero) */}
      <section className={`border-t border-[var(--trust-surface-border)] bg-[var(--trust-surface)] ${SECTION_Y}`} data-testid="section-why-nursenest">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Heading in accent text to give the section palette identity without adding visual noise */}
          <h2 className="nn-marketing-h2 mb-6 text-[var(--text-accent)]">{t("home.landing.why.title")}</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {whyKeys.map((key) => (
              <li key={key} className="nn-marketing-card nn-marketing-card-pad">
                <h3 className="nn-marketing-h3">{t(`home.landing.why.${key}Title`)}</h3>
                <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">{t(`home.landing.why.${key}Body`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Trust / stats — neutral page bg for breathing room between themed bands */}
      <section className={`border-t border-[var(--border-subtle)] bg-[var(--theme-page-bg)] ${SECTION_Y}`} data-testid="section-trust">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="nn-marketing-h2 mb-3">{t("home.landing.trust.title")}</h2>
          <div className="max-w-2xl space-y-3 nn-marketing-body-sm text-[var(--theme-body-text)]">
            <p>
              {qFormatted ? t("home.landing.trust.questionsLine", { count: qFormatted }) : t("home.landing.trust.questionsFallback")}
            </p>
            <p>{t("home.landing.trust.noCardAndGuarantee")}</p>
          </div>
        </div>
      </section>

      {/* FAQ band — primary-family wash, FAQ items get accent-surface-a for distinction */}
      <section className={`border-t border-[var(--accent-surface-c-border)] bg-[var(--accent-surface-c)] ${SECTION_Y}`} data-testid="section-home-faq">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="nn-marketing-h2 mb-6">{t("home.landing.faq.title")}</h2>
          <div className="mx-auto max-w-3xl space-y-2">
            {faqKeys.map((n) => (
              <details
                key={n}
                className="group rounded-[var(--radius-lg)] border border-[var(--surface-bubble-border)] bg-[var(--surface-bubble)] px-4 py-3.5"
              >
                <summary className="nn-marketing-h3 flex cursor-pointer list-none items-center justify-between gap-3 marker:content-none [&::-webkit-details-marker]:hidden">
                  {t(`home.landing.faq.q${n}`)}
                  <ChevronDown className="h-4 w-4 shrink-0 text-[var(--theme-muted-text)] transition group-open:rotate-180" aria-hidden />
                </summary>
                <p className="nn-marketing-body-sm mt-3 border-t border-[var(--border-subtle)] pt-3 text-[var(--theme-muted-text)]">
                  {t(`home.landing.faq.a${n}`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — mirrors hero branded wash for intentional bookend rhythm */}
      <section className={`border-t border-[var(--header-nav-border)] bg-[var(--hero-branded-wash)] ${SECTION_Y}`} data-testid="section-final-cta">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="nn-marketing-h2 text-balance">{t("home.landing.final.closingTitle")}</h2>
          <p className="nn-marketing-body-sm mx-auto mt-2 max-w-lg text-[var(--theme-muted-text)]">{t("home.landing.final.closingSub")}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4">
            <MarketingTrackedLink
              href={loc(HUB.signup)}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "signup_landing" }}
              className={`${MARKETING_PRIMARY_CTA_CLASS} sm:min-w-[220px]`}
              data-testid="button-final-cta-start-free"
            >
              <span className="whitespace-nowrap">{t("home.landing.final.closingCtaPrimary")}</span>
              <ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden />
            </MarketingTrackedLink>
            <MarketingTrackedLink
              href={loc(defaultNursingExamMarketingHub(region))}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "exam_hub_rn_landing", region }}
              secondaryCapture={{
                event: PH.funnelHomeToExamHub,
                eventProps: { placement: "final_cta", pathway: "rn_default_hub", region },
              }}
              className={MARKETING_TERTIARY_LINK_CLASS}
            >
              {t("home.landing.final.closingCtaLink")}
            </MarketingTrackedLink>
          </div>
        </div>
      </section>
    </>
  );
}
