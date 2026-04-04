"use client";

import Image from "next/image";
import { ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { MARKETING_SCREENSHOT_SOURCES } from "@/lib/marketing-assets.generated";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { HUB, loginWithCallback, rnLessons, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import type { NursenestMarketingRegion } from "@/lib/marketing/home-hero-gateway-config";
import {
  MARKETING_PHOTO_QUALITY_BELOW_FOLD,
  MARKETING_SCREENSHOT_PAIR_SIZES,
  marketingScreenshotBundleDisplaySrc,
} from "@/lib/marketing-image-delivery";
import { MARKETING_FINAL_CTA_ROW_CLASS } from "@/lib/theme/marketing-hero-pattern";

type Props = {
  region: NursenestMarketingRegion;
};

export function HomeMarketingConversionBlocks({ region }: Props) {
  const { t, locale } = useMarketingI18n();
  const loc = (path: string) => withMarketingLocale(locale, path);

  const dash = MARKETING_SCREENSHOT_SOURCES["screenshot2"];
  const qb = MARKETING_SCREENSHOT_SOURCES["screenshot6"];

  const faqKeys = ["1", "2", "3", "4", "5", "6"] as const;

  function whyCard(key: "why1" | "why2" | "why3" | "why4", className = "") {
    const title = t(`home.conversion.${key}Title`).trim();
    const body = t(`home.conversion.${key}Body`).trim();
    if (!title && !body) return null;
    return (
      <div className={`nn-marketing-card nn-marketing-card-pad ${className}`.trim()}>
        {title ? <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{title}</h3> : null}
        {body ? <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">{body}</p> : null}
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
            {dash ? (
              <figure className="nn-marketing-card overflow-hidden">
                <div
                  className="relative w-full bg-[var(--bg-inset)]"
                  style={{ aspectRatio: `${dash.width} / ${dash.height}` }}
                >
                  <Image
                    src={marketingScreenshotBundleDisplaySrc(dash)}
                    alt={t("home.conversion.previewCaptionDash")}
                    fill
                    sizes={MARKETING_SCREENSHOT_PAIR_SIZES}
                    quality={MARKETING_PHOTO_QUALITY_BELOW_FOLD}
                    loading="lazy"
                    fetchPriority="low"
                    decoding="async"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="border-t border-[var(--border-subtle)] px-3 py-2.5 text-xs font-medium text-[var(--theme-muted-text)]">
                  {t("home.conversion.previewCaptionDash")}
                </figcaption>
              </figure>
            ) : null}
            {qb ? (
              <figure className="nn-marketing-card overflow-hidden">
                <div
                  className="relative w-full bg-[var(--bg-inset)]"
                  style={{ aspectRatio: `${qb.width} / ${qb.height}` }}
                >
                  <Image
                    src={marketingScreenshotBundleDisplaySrc(qb)}
                    alt={t("home.conversion.previewCaptionBank")}
                    fill
                    sizes={MARKETING_SCREENSHOT_PAIR_SIZES}
                    quality={MARKETING_PHOTO_QUALITY_BELOW_FOLD}
                    loading="lazy"
                    fetchPriority="low"
                    decoding="async"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="border-t border-[var(--border-subtle)] px-3 py-2.5 text-xs font-medium text-[var(--theme-muted-text)]">
                  {t("home.conversion.previewCaptionBank")}
                </figcaption>
              </figure>
            ) : null}
          </div>
          <p className="mt-6 text-center text-xs text-[var(--theme-muted-text)] sm:text-left">
            <MarketingTrackedLink
              href={loc(HUB.signup)}
              event={PH.marketingHomePreviewSignupHint}
              className="nn-link-quiet font-semibold"
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
                <span className="text-xs font-semibold uppercase text-[var(--theme-muted-text)]">{t("home.conversion.sampleBank")}</span>
                <span className="mt-2 text-sm font-semibold text-[var(--theme-heading-text)]">
                  {t("home.conversion.sampleRnQuestionRun")}
                </span>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-[var(--theme-heading-text)]">
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
                <span className="text-xs font-semibold uppercase text-[var(--theme-muted-text)]">{t("home.conversion.sampleLessons")}</span>
                <span className="mt-2 text-sm font-semibold text-[var(--theme-heading-text)]">{t("home.conversion.sampleLessonsDesc")}</span>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-[var(--theme-heading-text)]">
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
                <span className="text-xs font-semibold uppercase text-[var(--theme-muted-text)]">{t("home.conversion.sampleTimed")}</span>
                <span className="mt-2 text-sm font-semibold text-[var(--theme-heading-text)]">{t("home.conversion.sampleTimedDesc")}</span>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-[var(--theme-heading-text)]">
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
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold leading-snug text-[var(--theme-heading-text)] marker:content-none [&::-webkit-details-marker]:hidden">
                  {t(`home.conversion.faq${n}q`)}
                  <ChevronDown className="h-4 w-4 shrink-0 text-[var(--theme-muted-text)] transition group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-3 border-t border-[var(--border-subtle)] pt-3 text-sm leading-relaxed text-[var(--theme-body-text)]">
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
              className="nn-btn-primary inline-flex min-h-[48px] w-full items-center justify-center px-8 py-3 text-base font-semibold sm:w-auto sm:min-h-[52px] sm:min-w-[200px] sm:text-lg"
            >
              {t("home.conversion.ctaSignup")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </MarketingTrackedLink>
            <MarketingTrackedLink
              href={loc(HUB.pricing)}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "pricing" }}
              className="nn-btn-secondary inline-flex min-h-[48px] w-full items-center justify-center px-8 py-3 text-base font-semibold sm:w-auto sm:min-h-[52px] sm:min-w-[200px]"
            >
              {t("home.conversion.ctaPricing")}
            </MarketingTrackedLink>
            <MarketingTrackedLink
              href={loc(rnQuestions(region))}
              event={PH.marketingHomeFinalCta}
              eventProps={{ choice: "try_rn_questions", region }}
              className="nn-link-quiet inline-flex min-h-[44px] w-full items-center justify-center px-6 py-2 text-sm sm:w-auto"
            >
              {t("home.conversion.ctaTryFree")}
            </MarketingTrackedLink>
          </div>
        </div>
      </section>
    </>
  );
}

