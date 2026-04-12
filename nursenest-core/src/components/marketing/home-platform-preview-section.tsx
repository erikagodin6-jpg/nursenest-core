"use client";

import { useMemo } from "react";
import { Activity, CheckCircle2, FileText } from "lucide-react";
import { MarketingHeroCarousel } from "@/components/marketing/marketing-hero-carousel";
import { buildHomepageHeroSlidesAtIndices } from "@/config/home-hero-carousel";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { HomeConversionCtaStrip } from "@/components/marketing/home-conversion-cta-strip";
import { MarketingChainScreenshot } from "@/components/marketing/marketing-screenshot-stack";
import { getScreenshotsByIds } from "@/lib/marketing/screenshot-registry";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

/**
 * Order screenshots so the first passes highlight bank, rationales/lessons, flashcards, dashboard,
 * lesson library, reports, and NGN-style items before the rest (still all 15 slides, no duplicates).
 * Indices are zero-based against `HOMEPAGE_HERO_SLIDE_METADATA` (screenshot1 … screenshot15).
 */
const PLATFORM_PREVIEW_SLIDE_ORDER: readonly number[] = [
  9, 0, 11, 1, 2, 12, 4, 3, 5, 6, 7, 8, 10, 13, 14,
];

/**
 * Full screenshot carousel directly under the homepage hero CTAs so visitors see the product early.
 * Uses the same CDN image chain and i18n slide copy as `MarketingHeroCarousel` elsewhere.
 */
export function HomePlatformPreviewSection() {
  const { t, locale } = useMarketingI18n();
  const slides = useMemo(
    () => buildHomepageHeroSlidesAtIndices(t, PLATFORM_PREVIEW_SLIDE_ORDER),
    [t, locale],
  );
  const proofShots = useMemo(() => getScreenshotsByIds([10, 1, 7]), []);
  const productProof = [
    {
      icon: FileText,
      title: "Question Example",
      body: "Exam-style stems with realistic distractors, scoped to your pathway and region.",
      line1: "Priority: post-op respiratory decline after opioid dose",
      line2: "Select the safest next nursing action",
    },
    {
      icon: CheckCircle2,
      title: "Rationale Preview",
      body: "See why the correct option is right and why each incorrect option is unsafe.",
      line1: "Correct answer logic tied to patient cues",
      line2: "Wrong-option breakdown to prevent repeat errors",
    },
    {
      icon: Activity,
      title: "CAT Dashboard",
      body: "Track readiness score, weak categories, and trend direction across sessions.",
      line1: "Readiness: 68 - approaching exam readiness",
      line2: "Weak areas: pharmacology and cardiac rhythm",
    },
  ] as const;

  return (
    <section
      id="home-platform-preview"
      className="nn-section-block nn-panel-chart-fade scroll-mt-20 border-t border-[var(--border)] bg-[var(--section-bg)]"
      aria-labelledby="home-platform-preview-heading"
      data-testid="section-home-platform-carousel"
    >
      <div className="nn-section-shell">
        <header className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
          <p className="nn-marketing-caption font-medium tracking-wide text-[color-mix(in_srgb,var(--theme-primary)_78%,var(--theme-heading-text))]">
            {formatTitleCase("Product Proof", locale)}
          </p>
          <h2 id="home-platform-preview-heading" className="nn-marketing-h2 mt-2 text-balance">
            {formatTitleCase("See The Product In Action", locale)}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-2xl text-pretty text-[var(--theme-muted-text)]">
            {formatSentenceCase("Real UI previews: question flow, rationale depth, CAT readiness, and session reporting.", locale)}
          </p>
          <p className="nn-marketing-caption mx-auto mt-3 max-w-2xl text-pretty text-[color-mix(in_srgb,var(--theme-primary)_70%,var(--theme-muted-text))]">
            {t("home.landing.platformCarousel.previewLabels")}
          </p>
        </header>
        <div className="mx-auto mb-8 grid w-full max-w-5xl gap-4 md:grid-cols-3">
          {productProof.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="nn-card-system nn-card-system-pad text-left">
                <span className="nn-card-system__icon mb-2">
                  <Icon className="nn-icon-md text-[var(--semantic-brand)]" aria-hidden />
                </span>
                <h3 className="nn-card-system__title">{formatTitleCase(item.title, locale)}</h3>
                <p className="nn-card-system__description">{formatSentenceCase(item.body, locale)}</p>
                <div className="mt-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-3">
                  <p className="text-sm font-semibold text-[var(--palette-text)]">
                    {formatSentenceCase(item.line1, locale)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--palette-text-muted)]">
                    {formatSentenceCase(item.line2, locale)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mx-auto w-full max-w-5xl min-w-0">
          <MarketingHeroCarousel
            slides={slides}
            mediaFrame="default"
            testIdPrefix="home-platform-carousel"
            imgTestIdPrefix="platform"
            captionOverlay
          />
        </div>
        <div className="mx-auto mt-10 grid w-full max-w-5xl gap-4 md:grid-cols-3">
          {proofShots.map((shot) => (
            <article key={shot.id} className="nn-card-system nn-card-system-pad text-left">
              <MarketingChainScreenshot
                objectKey={shot.objectKey}
                publicUrl={shot.publicUrl}
                alt={shot.alt ?? shot.label}
                rounded="rounded-xl"
                className="mb-3 border-[var(--border-subtle)]"
              />
              <h3 className="nn-card-system__title">{formatTitleCase(shot.label, locale)}</h3>
              <p className="nn-card-system__description">{formatSentenceCase(shot.description, locale)}</p>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-4 max-w-4xl text-center">
          <p className="nn-marketing-body-sm text-[var(--theme-muted-text)]">
            {formatSentenceCase(t("home.landing.platformCarousel.proofLine"), locale)}
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-5xl border-t border-[var(--border-subtle)] pt-10">
          <HomeConversionCtaStrip placement="after_platform_preview" />
        </div>
      </div>
    </section>
  );
}
