"use client";

import { ChevronDown } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { BookOpen, ClipboardList, GraduationCap, Layers } from "lucide-react";

type Props = {
  questionCount: number;
};

function formatQCount(n: number, locale: string): string {
  if (n <= 0) return "";
  return n.toLocaleString(locale.replace(/_/g, "-"));
}

const SECTION_Y = "py-10 md:py-14";

export function HomeLandingSections({ questionCount }: Props) {
  const { t, locale } = useMarketingI18n();
  const loc = (path: string) => withMarketingLocale(locale, path);
  const qFormatted = formatQCount(questionCount, locale);

  const whyKeys = ["why1", "why2", "why3"] as const;

  const productBlocks = [
    { icon: Layers, titleKey: "home.landing.preview.bankTitle", bodyKey: "home.landing.preview.bankBody" },
    { icon: ClipboardList, titleKey: "home.landing.preview.mocksTitle", bodyKey: "home.landing.preview.mocksBody" },
    { icon: BookOpen, titleKey: "home.landing.preview.lessonsTitle", bodyKey: "home.landing.preview.lessonsBody" },
    { icon: GraduationCap, titleKey: "home.landing.preview.flashTitle", bodyKey: "home.landing.preview.flashBody" },
  ];

  const faqKeys = ["1", "2", "3", "4", "5", "6"] as const;

  return (
    <>
      <section className={`border-t border-[var(--border-subtle)] bg-[var(--theme-page-bg)] ${SECTION_Y}`} data-testid="section-why-nursenest">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="nn-marketing-h2 mb-6">{t("home.landing.why.title")}</h2>
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

      <section className={`border-t border-[var(--border-subtle)] bg-[var(--nn-presentation-trust-band)] ${SECTION_Y}`} data-testid="section-product-preview">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="nn-marketing-h2 mb-6">{t("home.landing.preview.sectionTitle")}</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productBlocks.map((b) => (
              <li key={b.titleKey} className="nn-marketing-card nn-marketing-card-pad">
                <b.icon className="mb-2 h-7 w-7 text-[var(--theme-muted-text)]" aria-hidden />
                <h3 className="nn-marketing-h3">{t(b.titleKey)}</h3>
                <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">{t(b.bodyKey)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`border-t border-[var(--border-subtle)] bg-[var(--theme-page-bg)] ${SECTION_Y}`} data-testid="section-trust">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="nn-marketing-h2 mb-4">{t("home.landing.trust.title")}</h2>
          <ul className="space-y-2 text-[var(--theme-body-text)]">
            <li className="nn-marketing-body-sm">
              {qFormatted ? t("home.landing.trust.questionsLine", { count: qFormatted }) : t("home.landing.trust.questionsFallback")}
            </li>
            <li className="nn-marketing-body-sm">{t("home.landing.trust.noCard")}</li>
            <li className="nn-marketing-body-sm">{t("home.landing.trust.guarantee")}</li>
          </ul>
        </div>
      </section>

      <section className={`border-t border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)] ${SECTION_Y}`} data-testid="section-home-faq">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="nn-marketing-h2 mb-6">{t("home.landing.faq.title")}</h2>
          <div className="mx-auto max-w-3xl space-y-2">
            {faqKeys.map((n) => (
              <details
                key={n}
                className="group rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--nn-presentation-ribbon)] px-4 py-3.5"
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

      <section className={`border-t border-[var(--border-subtle)] bg-[var(--nn-presentation-panel)] ${SECTION_Y}`} data-testid="section-final-cta">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="nn-marketing-h2 text-balance">{t("home.landing.final.title")}</h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-[var(--theme-muted-text)]">{t("home.landing.final.sub")}</p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <MarketingTrackedLink
              href={loc(HUB.signup)}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "signup_landing" }}
              className="nn-btn-primary inline-flex min-h-[48px] w-full items-center justify-center px-8 py-3 text-base font-semibold sm:w-auto"
            >
              {t("home.landing.final.ctaPrimary")}
            </MarketingTrackedLink>
            <MarketingTrackedLink
              href={loc(HUB.questionBank)}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "browse_bank_landing" }}
              className="nn-btn-secondary inline-flex min-h-[48px] w-full items-center justify-center px-6 py-3 text-sm font-semibold sm:w-auto"
            >
              {t("home.landing.final.ctaSecondary")}
            </MarketingTrackedLink>
          </div>
        </div>
      </section>
    </>
  );
}
