"use client";

import { useMemo } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { defaultNursingExamMarketingHub } from "@/lib/marketing/marketing-exam-navigation";

import { useNursenestRegion } from "@/lib/region/use-nursenest-region";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";

import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_TERTIARY_LINK_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

/**
 * Safe translation accessor (prevents production crashes)
 */
function safeT(
  t: (k: string, vars?: Record<string, unknown>) => string,
  key: string,
  fallback: string,
  vars?: Record<string, unknown>
) {
  try {
    const val = t(key, vars);
    return val && val !== key ? val : fallback;
  } catch {
    return fallback;
  }
}

function formatQCount(n: number, locale: string): string {
  if (!Number.isFinite(n) || n <= 0) return "";
  try {
    return n.toLocaleString(locale.replace(/_/g, "-"));
  } catch {
    return String(n);
  }
}

const SECTION_Y = "py-9 md:py-12";

type Props = {
  questionCount: number;
};

export function HomeLandingSections({ questionCount }: Props) {
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();

  const loc = (path: string) => withMarketingLocale(locale, path);

  /**
   * Memoized computed values (prevents hydration mismatch + rerenders)
   */
  const computed = useMemo(() => {
    return {
      qFormatted: formatQCount(questionCount, locale),
      signupHref: loc(HUB.signup),
      hubHref: loc(defaultNursingExamMarketingHub(region)),
    };
  }, [questionCount, locale, region]);

  const whyKeys = ["why1", "why2", "why3"] as const;
  const faqKeys = ["1", "2", "3", "4", "5", "6", "7"] as const;

  return (
    <>
      {/* WHY SECTION */}
      <section
        className={`border-t border-[var(--trust-surface-border)] bg-[var(--trust-surface)] ${SECTION_Y}`}
        data-testid="section-why-nursenest"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="nn-marketing-h2 mb-6 text-[var(--text-accent)]">
            {safeT(t, "home.landing.why.title", "Why NurseNest")}
          </h2>

          <ul className="grid gap-4 sm:grid-cols-3">
            {whyKeys.map((key) => (
              <li
                key={key}
                className="nn-marketing-card nn-marketing-card-pad"
              >
                <h3 className="nn-marketing-h3">
                  {safeT(
                    t,
                    `home.landing.why.${key}Title`,
                    "Structured learning"
                  )}
                </h3>

                <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
                  {safeT(
                    t,
                    `home.landing.why.${key}Body`,
                    "Built for exam success"
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section
        className={`border-t border-[var(--border-subtle)] bg-[var(--theme-page-bg)] ${SECTION_Y}`}
        data-testid="section-trust"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="nn-marketing-h2 mb-3">
            {safeT(t, "home.landing.trust.title", "Built for real exam success")}
          </h2>

          <div className="max-w-2xl space-y-3 nn-marketing-body-sm text-[var(--theme-body-text)]">
            <p>
              {computed.qFormatted
                ? safeT(
                    t,
                    "home.landing.trust.questionsLine",
                    `${computed.qFormatted}+ practice questions`,
                    { count: computed.qFormatted }
                  )
                : safeT(
                    t,
                    "home.landing.trust.questionsFallback",
                    "Extensive practice question bank"
                  )}
            </p>

            <p>
              {safeT(
                t,
                "home.landing.trust.noCardAndGuarantee",
                "No credit card required. Start free."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section
        className={`border-t border-[var(--accent-surface-c-border)] bg-[var(--accent-surface-c)] ${SECTION_Y}`}
        data-testid="section-home-faq"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="nn-marketing-h2 mb-6">
            {safeT(t, "home.landing.faq.title", "Frequently asked questions")}
          </h2>

          <div className="mx-auto max-w-3xl space-y-2">
            {faqKeys.map((n) => (
              <details
                key={n}
                className="group rounded-[var(--radius-lg)] border border-[var(--surface-bubble-border)] bg-[var(--surface-bubble)] px-4 py-3.5"
              >
                <summary className="nn-marketing-h3 flex cursor-pointer items-center justify-between gap-3 list-none [&::-webkit-details-marker]:hidden">
                  {safeT(t, `home.landing.faq.q${n}`, "Question")}
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-[var(--theme-muted-text)] transition group-open:rotate-180"
                    aria-hidden
                  />
                </summary>

                <p className="nn-marketing-body-sm mt-3 border-t border-[var(--border-subtle)] pt-3 text-[var(--theme-muted-text)]">
                  {safeT(t, `home.landing.faq.a${n}`, "Answer")}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className={`border-t border-[var(--header-nav-border)] bg-[var(--hero-branded-wash)] ${SECTION_Y}`}
        data-testid="section-final-cta"
      >
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="nn-marketing-h2 text-balance">
            {safeT(
              t,
              "home.landing.final.closingTitle",
              "Start your exam prep today"
            )}
          </h2>

          <p className="nn-marketing-body-sm mx-auto mt-2 max-w-lg text-[var(--theme-muted-text)]">
            {safeT(
              t,
              "home.landing.final.closingSub",
              "Join thousands of nurses preparing smarter"
            )}
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-4">
            <MarketingTrackedLink
              href={computed.signupHref}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "signup_landing" }}
              className={`${MARKETING_PRIMARY_CTA_CLASS} sm:min-w-[220px]`}
              data-testid="button-final-cta-start-free"
            >
              <span className="whitespace-nowrap">
                {safeT(
                  t,
                  "home.landing.final.closingCtaPrimary",
                  "Start Free"
                )}
              </span>
              <ArrowRight className="ml-2 h-5 w-5 shrink-0" />
            </MarketingTrackedLink>

            <MarketingTrackedLink
              href={computed.hubHref}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "exam_hub_rn_landing", region }}
              secondaryCapture={{
                event: PH.funnelHomeToExamHub,
                eventProps: {
                  placement: "final_cta",
                  pathway: "rn_default_hub",
                  region,
                },
              }}
              className={MARKETING_TERTIARY_LINK_CLASS}
            >
              {safeT(
                t,
                "home.landing.final.closingCtaLink",
                "Browse exam prep"
              )}
            </MarketingTrackedLink>
          </div>
        </div>
      </section>
    </>
  );
}