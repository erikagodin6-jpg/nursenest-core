"use client";

/**
 * Premium institutional marketing layout — CDN screenshots via registry only,
 * semantic tokens, compact vertical rhythm (no oversized whitespace).
 */
import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  ChevronRight,
  GraduationCap,
  Shield,
  Sparkles,
  Stethoscope,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearnerSurfaceCard } from "@/components/ui/learner-surface-card";
import {
  ForInstitutionsLeadFormSection,
  ForInstitutionsPricingSection,
  type ForInstitutionsSharedMessages,
} from "@/components/marketing/for-institutions-pricing-and-form";
import {
  ScreenshotFeatureBlock,
  ScreenshotGrid,
  ScreenshotTile,
} from "@/components/marketing/screenshot-feature-grid";
import { ScreenshotCarousel } from "@/components/marketing/screenshot-carousel";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { defaultNursingExamMarketingHub } from "@/lib/marketing/marketing-exam-navigation";
import { getInstitutionalMarketingScreenshotSlots } from "@/lib/marketing/get-screenshots";
import { SCREENSHOT_GROUPS, getScreenshotsByIds } from "@/lib/marketing/screenshot-registry";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";

export type ForInstitutionsPremiumMessages = ForInstitutionsSharedMessages;

type Props = {
  locale: string;
  messages: ForInstitutionsPremiumMessages;
  pricingHref: string;
};

function scrollToId(id: string) {
  if (typeof document === "undefined") return;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function chipLabel(m: ForInstitutionsPremiumMessages): string {
  const raw = m["pages.forInstitutions.forNursingSchoolsAndPrograms"] ?? "";
  const head = raw.split("|")[0]?.trim();
  return head || m["pages.forInstitutions.eyebrow"] || "Institutional";
}

const FEATURE_ICONS = [BookOpen, Target, Brain, BarChart3, Stethoscope, Shield] as const;

export function MarketingForInstitutionsPremiumClient({ locale, messages: m, pricingHref }: Props) {
  const { region } = useNursenestRegion();
  const exploreHref = withMarketingLocale(locale, defaultNursingExamMarketingHub(region));
  const slots = getInstitutionalMarketingScreenshotSlots();
  const platformShowcaseRecords = getScreenshotsByIds([...SCREENSHOT_GROUPS.institutionalPlatformBlocks]);
  const PLATFORM_ACCENTS = [
    "var(--semantic-chart-1)",
    "var(--semantic-chart-2)",
    "var(--semantic-chart-3)",
    "var(--semantic-chart-4)",
  ] as const;

  const featureBlocks = [
    { titleKey: "pages.forInstitutions.feature1Title", descKey: "pages.forInstitutions.feature1Desc" },
    { titleKey: "pages.forInstitutions.feature2Title", descKey: "pages.forInstitutions.feature2Desc" },
    { titleKey: "pages.forInstitutions.feature3Title", descKey: "pages.forInstitutions.feature3Desc" },
    { titleKey: "pages.forInstitutions.feature4Title", descKey: "pages.forInstitutions.feature4Desc" },
    { titleKey: "pages.forInstitutions.feature5Title", descKey: "pages.forInstitutions.feature5Desc" },
    { titleKey: "pages.forInstitutions.feature6Title", descKey: "pages.forInstitutions.feature6Desc" },
  ] as const;

  const trustBlocks = [
    { Icon: Target, textKey: "pages.forInstitutions.trustPoint1" },
    { Icon: Brain, textKey: "pages.forInstitutions.trustPoint2" },
    { Icon: BarChart3, textKey: "pages.forInstitutions.trustPoint3" },
    { Icon: Users, textKey: "pages.forInstitutions.trustPoint4" },
    { Icon: BookOpen, textKey: "pages.forInstitutions.trustPoint5" },
  ] as const;

  const workflowSteps = [
    {
      titleKey: "pages.forInstitutions.howStep1Title",
      bodyKey: "pages.forInstitutions.howStep1Body",
      screenshotId: SCREENSHOT_GROUPS.institutionalWorkflow[0],
    },
    {
      titleKey: "pages.forInstitutions.howStep2Title",
      bodyKey: "pages.forInstitutions.howStep2Body",
      screenshotId: SCREENSHOT_GROUPS.institutionalWorkflow[1],
    },
    {
      titleKey: "pages.forInstitutions.howStep3Title",
      bodyKey: "pages.forInstitutions.howStep3Body",
      screenshotId: SCREENSHOT_GROUPS.institutionalWorkflow[2],
    },
    {
      titleKey: "pages.forInstitutions.howStep4Title",
      bodyKey: "pages.forInstitutions.howStep4Body",
      screenshotId: undefined as undefined,
    },
  ] as const;

  return (
    <div
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)]"
      data-testid="for-institutions-page"
    >
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[linear-gradient(155deg,color-mix(in_srgb,var(--semantic-panel-positive)_14%,var(--background))_0%,var(--background)_42%,color-mix(in_srgb,var(--semantic-panel-cool)_16%,var(--background))_100%)] py-10 sm:py-12 lg:py-14">
        <div className="nn-section-shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-2)_38%,var(--border))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_10%,var(--palette-surface))] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--palette-heading)]">
                <Building2 className="h-4 w-4 text-[var(--semantic-chart-2)]" aria-hidden />
                {chipLabel(m)}
              </div>
              <h1 className="text-balance font-display text-3xl font-bold leading-tight tracking-tight text-[var(--palette-heading)] sm:text-4xl lg:text-[2.35rem]">
                {m["pages.forInstitutions.heroTitle"]}
              </h1>
              <p className="nn-marketing-body mt-4 max-w-prose text-pretty leading-relaxed text-[var(--palette-text-muted)]">
                {m["pages.forInstitutions.heroLead"]}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  type="button"
                  size="lg"
                  className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-full px-7`}
                  onClick={() => scrollToId("contact-form")}
                >
                  {m["pages.forInstitutions.requestDemo"]} <ChevronRight className="h-5 w-5" aria-hidden />
                </Button>
                <Button size="lg" variant="outline" className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-full px-7`} asChild>
                  <Link href={exploreHref}>{m["pages.forInstitutions.explorePlatform"]}</Link>
                </Button>
              </div>
              <p className="nn-marketing-caption mt-5 text-[var(--semantic-text-muted)]">{m["pages.forInstitutions.heroMontageCaption"]}</p>
            </div>

            <div className="min-w-0">
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {slots.heroMontage.map((shot) => (
                  <ScreenshotTile
                    key={shot.id}
                    id={shot.id}
                    showDescription={false}
                    aspectRatio="4 / 3"
                    className="[&_.rounded-xl]:rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Trusted chips */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_65%,var(--border))] pt-8">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              {m["pages.forInstitutions.trustedByEyebrow"]}
            </span>
            {[m["pages.forInstitutions.audience1"], m["pages.forInstitutions.audience2"], m["pages.forInstitutions.audience3"]].map(
              (label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-4)_35%,var(--border))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_8%,var(--palette-surface))] px-3 py-1 text-xs font-medium text-[var(--palette-heading)]"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[var(--semantic-chart-4)]" aria-hidden />
                  {label}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Why institutions */}
      <section className="border-b border-[var(--border-subtle)] bg-[var(--background)] py-10 lg:py-12">
        <div className="nn-section-shell">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="nn-marketing-h2 text-[var(--palette-heading)]">{m["pages.forInstitutions.whyProgramsChooseNursenest"]}</h2>
            <p className="nn-marketing-body mt-3 text-[var(--palette-text-muted)]">{m["pages.forInstitutions.builtSpecificallyForCanadianAnd"]}</p>
          </div>
          <div className="grid gap-6 lg:gap-8">
            {featureBlocks.map(({ titleKey, descKey }, i) => {
              const Icon = FEATURE_ICONS[i] ?? BookOpen;
              const sid = SCREENSHOT_GROUPS.institutionalWhyFeatures[i];
              const flip = i % 2 === 1;
              return (
                <LearnerSurfaceCard
                  key={titleKey}
                  variant={i % 3 === 0 ? "primary" : "default"}
                  className="overflow-hidden p-5 sm:p-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:p-8"
                >
                  <div className={`flex flex-col justify-center ${flip ? "lg:order-2" : ""}`}>
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-chart-2)_12%,var(--palette-surface))]">
                      <Icon className="h-6 w-6 text-[var(--semantic-chart-2)]" aria-hidden />
                    </div>
                    <h3 className="nn-marketing-h3 text-[var(--palette-heading)]">{m[titleKey]}</h3>
                    <p className="nn-marketing-body mt-2 text-[var(--palette-text-muted)]">{m[descKey]}</p>
                  </div>
                  <div className={`mt-5 min-w-0 lg:mt-0 ${flip ? "lg:order-1" : ""}`}>
                    <ScreenshotTile id={sid} showDescription aspectRatio="16 / 10" />
                  </div>
                </LearnerSurfaceCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full platform tour — `institutionalShowcase` (registry order, CDN via MarketingChainScreenshot) */}
      <section
        className="border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--background))] py-10 lg:py-12"
        aria-labelledby="for-institutions-showcase-heading"
      >
        <div className="nn-section-shell max-w-5xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 id="for-institutions-showcase-heading" className="nn-marketing-h2 text-[var(--palette-heading)]">
              {m["pages.forInstitutions.whatStudentsGet"]}
            </h2>
            <p className="nn-marketing-body mt-3 text-[var(--palette-text-muted)]">
              {m["pages.forInstitutions.everythingTheyNeedToPrepare"]}
            </p>
          </div>
          <ScreenshotCarousel
            group="institutionalShowcase"
            captionOverlay
            autoplayIntervalMs={5200}
            mediaFrame="default"
            className="rounded-2xl shadow-[var(--shadow-elevated)]"
            testIdPrefix="institutions-showcase-carousel"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_10%,var(--background))] py-10 lg:py-12">
        <div className="nn-section-shell">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="nn-marketing-h2 text-[var(--palette-heading)]">{m["pages.forInstitutions.sectionHowItWorks"]}</h2>
            <p className="nn-marketing-body mt-3 text-[var(--palette-text-muted)]">{m["pages.forInstitutions.howItWorksLead"]}</p>
          </div>
          <ol className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step, idx) => (
              <li key={step.titleKey}>
                <LearnerSurfaceCard variant="minimal" className="h-full p-4 sm:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[var(--color-on-primary,#fff)]"
                      style={{
                        background:
                          idx === 0
                            ? "var(--semantic-chart-1)"
                            : idx === 1
                              ? "var(--semantic-chart-2)"
                              : idx === 2
                                ? "var(--semantic-chart-3)"
                                : "var(--semantic-chart-5)",
                      }}
                      aria-hidden
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--palette-heading)]">{m[step.titleKey]}</h3>
                  <p className="nn-marketing-body mt-2 text-sm leading-relaxed text-[var(--palette-text-muted)]">{m[step.bodyKey]}</p>
                  {step.screenshotId ? (
                    <div className="mt-4 min-w-0">
                      <ScreenshotTile id={step.screenshotId} showLabel={false} aspectRatio="4 / 3" />
                    </div>
                  ) : null}
                </LearnerSurfaceCard>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Platform showcase */}
      <section className="border-b border-[var(--border-subtle)] bg-[var(--background)] py-10 lg:py-12">
        <div className="nn-section-shell">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="nn-marketing-h2 text-[var(--palette-heading)]">{m["pages.forInstitutions.sectionPlatformDeepDive"]}</h2>
          </div>
          <div className="flex flex-col gap-12 lg:gap-14">
            {platformShowcaseRecords.map((record, i) => (
              <ScreenshotFeatureBlock
                key={record.id}
                screenshotId={record.id}
                heading={record.label}
                bullets={[record.description]}
                flip={i % 2 === 1}
                accentColor={PLATFORM_ACCENTS[i % PLATFORM_ACCENTS.length]}
                primaryCta={{ label: m["pages.forInstitutions.explorePlatform"], href: exploreHref }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits comparison */}
      <section className="border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--background))] py-10 lg:py-12">
        <div className="nn-section-shell">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="nn-marketing-h2 text-[var(--palette-heading)]">{m["pages.forInstitutions.sectionBenefitsCompare"]}</h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <LearnerSurfaceCard variant="secondary" className="p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--palette-surface))] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">
                <GraduationCap className="h-4 w-4" aria-hidden />
                {m["pages.forInstitutions.compareLearnersHeading"]}
              </div>
              <ul className="space-y-3 text-sm text-[var(--palette-text-muted)]">
                {(["studentBenefit1", "studentBenefit2", "studentBenefit3", "studentBenefit4"] as const).map((k) => (
                  <li key={k} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-chart-2)]" aria-hidden />
                    {m[`pages.forInstitutions.${k}`]}
                  </li>
                ))}
              </ul>
            </LearnerSurfaceCard>
            <LearnerSurfaceCard variant="primary" className="p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--palette-surface))] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
                <Building2 className="h-4 w-4" aria-hidden />
                {m["pages.forInstitutions.compareProgramsHeading"]}
              </div>
              <ul className="space-y-3 text-sm text-[var(--palette-text-muted)]">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-chart-3)]" aria-hidden />
                  {m["pages.forInstitutions.offer4"]}
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-chart-3)]" aria-hidden />
                  {m["pages.forInstitutions.offer5"]}
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-chart-3)]" aria-hidden />
                  {m["pages.forInstitutions.trustPoint3"]}
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-chart-3)]" aria-hidden />
                  {m["pages.forInstitutions.feature6Title"]}
                </li>
              </ul>
            </LearnerSurfaceCard>
          </div>
        </div>
      </section>

      {/* Educator */}
      <section className="border-b border-[var(--border-subtle)] bg-[var(--background)] py-10 lg:py-12">
        <div className="nn-section-shell">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="nn-marketing-h2 text-[var(--palette-heading)]">{m["pages.forInstitutions.sectionEducator"]}</h2>
            <p className="nn-marketing-body mt-3 text-[var(--palette-text-muted)]">{m["pages.forInstitutions.educatorLead"]}</p>
          </div>
          <ScreenshotGrid group="institutionalEducator" cols={2} showDescription aspectRatio="16 / 10" />
        </div>
      </section>

      {/* Implementation */}
      <section className="border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_10%,var(--background))] py-10 lg:py-12">
        <div className="nn-section-shell">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h2 className="nn-marketing-h2 text-[var(--palette-heading)]">{m["pages.forInstitutions.sectionImplementation"]}</h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
            <LearnerSurfaceCard className="p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-1)]">{m["pages.forInstitutions.implWeeksLabel"]}</p>
              <p className="nn-marketing-body mt-2 text-sm text-[var(--palette-text-muted)]">{m["pages.forInstitutions.implWeeksBody"]}</p>
            </LearnerSurfaceCard>
            <LearnerSurfaceCard className="p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-2)]">{m["pages.forInstitutions.implMonthLabel"]}</p>
              <p className="nn-marketing-body mt-2 text-sm text-[var(--palette-text-muted)]">{m["pages.forInstitutions.implMonthBody"]}</p>
            </LearnerSurfaceCard>
            <LearnerSurfaceCard className="p-5 md:col-span-1">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-3)]">{m["pages.forInstitutions.implScaleLabel"]}</p>
              <p className="nn-marketing-body mt-2 text-sm text-[var(--palette-text-muted)]">{m["pages.forInstitutions.implScaleBody"]}</p>
            </LearnerSurfaceCard>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-b border-[var(--border-subtle)] bg-[var(--background)] py-10 lg:py-12">
        <div className="nn-section-shell max-w-4xl">
          <h2 className="nn-marketing-h2 mb-8 text-center text-[var(--palette-heading)]">{m["pages.forInstitutions.sectionTrustQuality"]}</h2>
          <div className="space-y-4">
            {trustBlocks.map(({ Icon, textKey }) => (
              <LearnerSurfaceCard key={textKey} variant="minimal" className="flex items-start gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-4)_14%,var(--palette-surface))]">
                  <Icon className="h-5 w-5 text-[var(--semantic-chart-4)]" aria-hidden />
                </div>
                <p className="nn-marketing-body pt-1.5 text-[var(--palette-text-muted)]">{m[textKey]}</p>
              </LearnerSurfaceCard>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-b border-[var(--border-subtle)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--semantic-brand)_10%,var(--background))_0%,color-mix(in_srgb,var(--semantic-info)_8%,var(--background))_100%)] py-10 lg:py-12">
        <div className="nn-section-shell max-w-3xl text-center">
          <h2 className="nn-marketing-h2 text-[var(--palette-heading)]">{m["pages.forInstitutions.finalCtaTitle"]}</h2>
          <p className="nn-marketing-body mt-3 text-[var(--palette-text-muted)]">{m["pages.forInstitutions.finalCtaLead"]}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              size="lg"
              className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-full px-8`}
              onClick={() => scrollToId("contact-form")}
            >
              {m["pages.forInstitutions.requestDemo"]}
            </Button>
            <Button size="lg" variant="outline" className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-full px-8`} asChild>
              <Link href={exploreHref}>{m["pages.forInstitutions.explorePlatform"]}</Link>
            </Button>
          </div>
        </div>
      </section>

      <ForInstitutionsPricingSection locale={locale} m={m} pricingHref={pricingHref} />
      <ForInstitutionsLeadFormSection m={m} />
    </div>
  );
}
