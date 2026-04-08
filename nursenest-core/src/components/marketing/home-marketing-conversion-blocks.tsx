"use client";

import { ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import { useMemo } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { buildHomepageHeroSlides } from "@/lib/marketing-assets";
import { MarketingChainScreenshot } from "@/components/marketing/marketing-screenshot-stack";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { HUB, loginWithCallback, rnLessons, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import type { NursenestMarketingRegion } from "@/lib/marketing/home-hero-gateway-config";
import { MARKETING_SCREENSHOT_PAIR_SIZES } from "@/lib/marketing-image-delivery";
import {
  MARKETING_FINAL_CTA_ROW_CLASS,
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
  MARKETING_TERTIARY_LINK_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

type Props = {
  region: NursenestMarketingRegion;
};

export function HomeMarketingConversionBlocks({ region }: Props) {
  const { t, locale } = useMarketingI18n();
  const loc = (path: string) => withMarketingLocale(locale, path);

  /** Hero uses slides 0–2; legacy stack uses 6–8 — keep preview on 3–4 (screenshots 4–5) to reduce duplicate crops. */
  const platformSlides = useMemo(() => buildHomepageHeroSlides(t), [t]);
  const previewDash = platformSlides[3];
  const previewBank = platformSlides[4];

  const faqKeys = ["1", "2", "3", "4", "5", "6"] as const;

  function whyCard(key: "why1" | "why2" | "why3" | "why4", className = "") {
    const title = t(`home.conversion.${key}Title`).trim();
    const body = t(`home.conversion.${key}Body`).trim();
    if (!title && !body) return null;
    return (
      <div className={`nn-marketing-card nn-marketing-card-pad ${className}`.trim()}>
        {title ? <h3 className="nn-marketing-h4">{title}</h3> : null}
        {body ? <p className="nn-marketing-body-sm mt-2">{body}</p> : null}
      </div>
    );
  }

  return (
    <>
      <section
        className="border-t border-[var(--nn-presentation-divider)] bg-[var(--nn-presentation-wash)]"
        style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
        data-testid="section-why-choosenest"
        aria-labelledby="why-choosenest-heading"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="why-choosenest-heading" className="nn-marketing-h2 max-w-3xl">
            {t("home.conversion.whyHeading")}
          </h2>
          <p className="nn-marketing-lead text-[var(--theme-muted-text)]">{t("home.conversion.whySub")}</p>
          <div className="mt-8 flex flex-col gap-[var(--nn-rhythm-card-grid-gap)] sm:gap-5">
            {whyCard("why1")}
            <div className="grid gap-4 md:grid-cols-5 md:items-stretch">
              {whyCard("why2", "md:col-span-2")}
              {whyCard("why3", "md:col-span-3")}
            </div>
            {whyCard("why4")}
          </div>
        </div>
      </section>

      <section
        className="border-t border-[var(--divider)] bg-[var(--bg-page)]"
        style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
        data-testid="section-platform-preview"
        aria-labelledby="platform-preview-heading"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="platform-preview-heading" className="nn-marketing-h2">
            {t("home.conversion.previewHeading")}
          </h2>
          <p className="nn-marketing-lead text-[var(--theme-muted-text)]">{t("home.conversion.previewSub")}</p>
          <div className="mt-8 grid gap-[var(--nn-rhythm-card-grid-gap)] lg:grid-cols-2 lg:gap-6">
            {previewDash ? (
              <figure className="nn-marketing-card overflow-hidden">
                <MarketingChainScreenshot
                  objectKey={previewDash.objectKey}
                  publicUrl={previewDash.publicUrl}
                  alt={t("home.conversion.previewCaptionDash")}
                  sizes={MARKETING_SCREENSHOT_PAIR_SIZES}
                  fit="contain"
                  className="border-0 bg-[var(--bg-inset)] shadow-none"
                  rounded="rounded-none"
                />
                <figcaption className="nn-marketing-caption border-t border-[var(--border-subtle)] px-3 py-2.5 font-medium">
                  {t("home.conversion.previewCaptionDash")}
                </figcaption>
              </figure>
            ) : null}
            {previewBank ? (
              <figure className="nn-marketing-card overflow-hidden">
                <MarketingChainScreenshot
                  objectKey={previewBank.objectKey}
                  publicUrl={previewBank.publicUrl}
                  alt={t("home.conversion.previewCaptionBank")}
                  sizes={MARKETING_SCREENSHOT_PAIR_SIZES}
                  fit="contain"
                  className="border-0 bg-[var(--bg-inset)] shadow-none"
                  rounded="rounded-none"
                />
                <figcaption className="nn-marketing-caption border-t border-[var(--border-subtle)] px-3 py-2.5 font-medium">
                  {t("home.conversion.previewCaptionBank")}
                </figcaption>
              </figure>
            ) : null}
          </div>
          <p className="mt-6 text-center text-xs text-[var(--theme-muted-text)] sm:text-left">
            <MarketingTrackedLink
              href={loc(HUB.signup)}
              event={PH.marketingHomePreviewSignupHint}
              className={`${MARKETING_TERTIARY_LINK_CLASS} inline font-semibold`}
            >
              {t("home.conversion.previewSignupHint")}
            </MarketingTrackedLink>
          </p>
        </div>
      </section>

      <section
        className="border-t border-[var(--divider)] bg-[var(--nn-presentation-trust-band)]"
        style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
        data-testid="section-sample-content"
        aria-labelledby="sample-content-heading"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="sample-content-heading" className="nn-marketing-h2">
            {t("home.conversion.sampleHeading")}
          </h2>
          <p className="nn-marketing-lead text-[var(--theme-muted-text)]">{t("home.conversion.sampleSub")}</p>
          <ul className="mt-6 grid gap-[var(--nn-rhythm-card-grid-gap)] sm:grid-cols-3 sm:gap-4">
            <li>
              <MarketingTrackedLink
                href={loc(rnQuestions(region))}
                event={PH.marketingHomeSampleContentClick}
                eventProps={{ sample: "question_bank", region }}
                className="nn-marketing-card nn-marketing-card-pad flex h-full min-h-[8.5rem] flex-col transition-colors hover:border-[var(--border-medium)] sm:min-h-0"
              >
                <span className="nn-marketing-label">{t("home.conversion.sampleBank")}</span>
                <span className="nn-marketing-h4 mt-2">{t("home.conversion.sampleRnQuestionRun")}</span>
                <span className="nn-marketing-body-sm mt-3 inline-flex items-center font-semibold text-[var(--theme-heading-text)]">
                  {t("home.conversion.sampleGo")}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </MarketingTrackedLink>
            </li>
            <li>
              <MarketingTrackedLink
                href={loc(rnLessons(region))}
                event={PH.marketingHomeSampleContentClick}
                eventProps={{ sample: "lessons", region }}
                className="nn-marketing-card nn-marketing-card-pad flex h-full min-h-[8.5rem] flex-col transition-colors hover:border-[var(--border-medium)] sm:min-h-0"
              >
                <span className="nn-marketing-label">{t("home.conversion.sampleLessons")}</span>
                <span className="nn-marketing-h4 mt-2">{t("home.conversion.sampleLessonsDesc")}</span>
                <span className="nn-marketing-body-sm mt-3 inline-flex items-center font-semibold text-[var(--theme-heading-text)]">
                  {t("home.conversion.sampleGo")}
                  <BookOpen className="ml-1 h-3.5 w-3.5" />
                </span>
              </MarketingTrackedLink>
            </li>
            <li>
              <MarketingTrackedLink
                href={loc(loginWithCallback("/app/exams"))}
                event={PH.marketingHomeSampleContentClick}
                eventProps={{ sample: "timed_exams_login", region }}
                className="nn-marketing-card nn-marketing-card-pad flex h-full min-h-[8.5rem] flex-col transition-colors hover:border-[var(--border-medium)] sm:min-h-0"
              >
                <span className="nn-marketing-label">{t("home.conversion.sampleTimed")}</span>
                <span className="nn-marketing-h4 mt-2">{t("home.conversion.sampleTimedDesc")}</span>
                <span className="nn-marketing-body-sm mt-3 inline-flex items-center font-semibold text-[var(--theme-heading-text)]">
                  {t("home.conversion.sampleSignIn")}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </MarketingTrackedLink>
            </li>
          </ul>
        </div>
      </section>

      <section
        className="border-t border-[var(--divider)] bg-[var(--bg-page)]"
        style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
        data-testid="section-home-faq"
        aria-labelledby="home-faq-heading"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="home-faq-heading" className="nn-marketing-h2">
            {t("home.conversion.faqHeading")}
          </h2>
          <div className="mt-6 space-y-2">
            {faqKeys.map((n) => (
              <details
                key={n}
                className="group rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--nn-presentation-ribbon)] px-4 py-3.5"
              >
                <summary className="nn-marketing-body-sm flex cursor-pointer list-none items-center justify-between gap-3 font-semibold leading-snug text-[var(--theme-heading-text)] marker:content-none [&::-webkit-details-marker]:hidden">
                  {t(`home.conversion.faq${n}q`)}
                  <ChevronDown className="h-4 w-4 shrink-0 text-[var(--theme-muted-text)] transition group-open:rotate-180" aria-hidden />
                </summary>
                <p className="nn-marketing-body-sm mt-3 border-t border-[var(--border-subtle)] pt-3">
                  {t(`home.conversion.faq${n}a`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-[var(--nn-presentation-divider)] bg-[var(--nn-presentation-panel)]"
        style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
        data-testid="section-final-cta"
        aria-labelledby="final-cta-heading"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 id="final-cta-heading" className="nn-marketing-h2 text-balance">
            {t("home.conversion.finalTitle")}
          </h2>
          <p className="nn-marketing-lead mx-auto max-w-xl text-[var(--theme-body-text)]">{t("home.conversion.finalSub")}</p>
          <div className={`${MARKETING_FINAL_CTA_ROW_CLASS} mx-auto mt-8 max-w-xl`}>
            <MarketingTrackedLink
              href={loc(HUB.signup)}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "signup" }}
              className={`${MARKETING_PRIMARY_CTA_CLASS} sm:min-w-[200px]`}
            >
              {t("home.conversion.ctaSignup")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </MarketingTrackedLink>
            <MarketingTrackedLink
              href={loc(HUB.pricing)}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "pricing" }}
              className={`${MARKETING_SECONDARY_CTA_CLASS} sm:min-w-[200px]`}
            >
              {t("home.conversion.ctaPricing")}
            </MarketingTrackedLink>
            <MarketingTrackedLink
              href={loc(rnQuestions(region))}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "try_rn_questions", region }}
              className={`${MARKETING_TERTIARY_LINK_CLASS} w-full sm:w-auto`}
            >
              {t("home.conversion.ctaTryFree")}
            </MarketingTrackedLink>
          </div>
        </div>
      </section>
    </>
  );
}

