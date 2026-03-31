"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { MarketingHeroCarousel } from "@/components/marketing/marketing-hero-carousel";
import { buildHomepageHeroSlides } from "@/lib/marketing-assets";
import {
  ArrowRight,
  Star,
  BookOpen,
  Brain,
  Target,
  Layers,
  Zap,
  CheckCircle2,
  FileText,
  ClipboardCheck,
  Lightbulb,
  Trophy,
  Stethoscope,
  Wind,
  Ambulance,
  Microscope,
  ScanLine,
  ShieldCheck,
  BarChart3,
  Shield,
  Sparkles,
  Users,
  Activity,
  GraduationCap,
  ImageIcon,
} from "lucide-react";

function formatCount(n: number | undefined): string {
  if (n === undefined) return "—";
  if (n === 0) return "0";
  if (n < 10) return `${n}`;
  if (n >= 1000) {
    const hundreds = Math.floor(n / 100) * 100;
    return `${hundreds.toLocaleString()}+`;
  }
  const tens = Math.floor(n / 10) * 10;
  return `${tens}+`;
}

function formatMarketingCount(n: number): string {
  if (n <= 0) return "---";
  if (n >= 10000) {
    const thousands = Math.floor(n / 1000) * 1000;
    return `${thousands.toLocaleString()}+`;
  }
  if (n >= 1000) {
    const hundreds = Math.floor(n / 100) * 100;
    return `${hundreds.toLocaleString()}+`;
  }
  if (n >= 100) {
    const tens = Math.floor(n / 10) * 10;
    return `${tens}+`;
  }
  return `${n}+`;
}

const sampleQuestion = {
  stem: "A nurse is caring for a client with heart failure who has been prescribed furosemide (Lasix) 40mg IV. The client's morning lab results show: K+ 3.1 mEq/L, Na+ 138 mEq/L, BUN 28 mg/dL. Which action should the nurse take FIRST?",
  options: [
    { id: "A", text: "Administer the furosemide as prescribed" },
    { id: "B", text: "Hold the furosemide and notify the healthcare provider" },
    { id: "C", text: "Administer a potassium supplement before the furosemide" },
    { id: "D", text: "Recheck the potassium level in 2 hours" },
  ],
  correctAnswer: "B",
  rationale: "The client's potassium level of 3.1 mEq/L is below the normal range (3.5-5.0 mEq/L). Furosemide is a loop diuretic that causes potassium excretion. Administering furosemide to a client who is already hypokalemic could cause dangerous cardiac arrhythmias. The nurse should hold the medication and notify the provider so potassium can be corrected before administering the diuretic. This demonstrates clinical judgment — recognizing a safety concern and acting to prevent harm.",
  category: "Pharmacology",
  difficulty: "RPN/LPN Level",
};

interface HomeConversionSectionsProps {
  lessonCount: number;
  questionCount: number;
}

export function HomeConversionSections({
  lessonCount,
  questionCount,
}: HomeConversionSectionsProps) {
  const displayQuestions = questionCount || 10000;
  const displayFlashcards = 10000;
  const displayDecks = 140;
  const displayLessons = lessonCount || 6000;
  const proofLoading = false;

  return (
    <>
      <DynamicTrustCounters
        questions={displayQuestions}
        flashcards={displayFlashcards}
        decks={displayDecks}
        lessons={displayLessons}
        hasCatExams={true}
        hasClinicalImages={true}
        hasMultiTier={true}
        isLoading={proofLoading}
      />
      <HowItWorksSection />
      <FeatureCardsSection questionCount={displayQuestions} />
      <ConversionProofBlock
        questions={displayQuestions}
        flashcards={displayFlashcards}
        decks={displayDecks}
      />
      <ScreenshotCarouselSection />
      <ProfessionSelectorSection />
      <CompetitivePositioningSection
        questions={displayQuestions}
        flashcards={displayFlashcards}
      />
      <SampleQuestionSection />
      <TestimonialsSection />
      <FinalCTASection />
    </>
  );
}

function TrustCounterSkeleton() {
  return (
    <div className="text-center p-5 rounded-2xl bg-white/60 border border-[var(--theme-card-border)] animate-pulse">
      <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-[var(--theme-input-border)]" />
      <div className="mx-auto mb-2 h-8 w-24 rounded bg-[var(--theme-input-border)]" />
      <div className="mx-auto h-4 w-20 rounded bg-[var(--theme-separator)]" />
    </div>
  );
}

function DynamicTrustCounters({
  questions,
  flashcards,
  decks,
  lessons,
  hasCatExams,
  hasClinicalImages,
  hasMultiTier,
  isLoading,
}: {
  questions: number;
  flashcards: number;
  decks: number;
  lessons: number;
  hasCatExams: boolean;
  hasClinicalImages: boolean;
  hasMultiTier: boolean;
  isLoading: boolean;
}) {
  const { t } = useMarketingI18n();
  const counters = [
    { icon: Target, value: formatMarketingCount(questions), labelKey: "components.homeConversionSections.trustCounterLabel.questions" },
    { icon: Layers, value: formatMarketingCount(flashcards), labelKey: "components.homeConversionSections.trustCounterLabel.flashcards" },
    { icon: BookOpen, value: formatMarketingCount(decks), labelKey: "components.homeConversionSections.trustCounterLabel.decks" },
    { icon: Stethoscope, value: formatMarketingCount(lessons), labelKey: "components.homeConversionSections.trustCounterLabel.lessons" },
  ];

  const badges = [
    ...(hasCatExams ? [{ icon: ClipboardCheck, labelKey: "components.homeConversionSections.trustBadge.catExams" }] : []),
    ...(hasClinicalImages ? [{ icon: ImageIcon, labelKey: "components.homeConversionSections.trustBadge.clinicalImages" }] : []),
    ...(hasMultiTier ? [{ icon: Users, labelKey: "components.homeConversionSections.trustBadge.multiTier" }] : []),
  ];

  return (
    <section
      className="border-t border-[var(--theme-card-border)]"
      style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-block)' }}
      data-testid="section-trust-counters"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-left md:max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 shadow-[var(--shadow-card)]">
            <BarChart3 className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("components.homeConversionSections.platformScale")}</span>
          </div>
          <h2
            className="mb-3 font-bold text-[var(--theme-heading-text)]"
            style={{ fontSize: 'var(--text-section)' }}
            data-testid="text-trust-counters-heading"
          >
            {t("components.homeConversionSections.trustCountersHeading")}
          </h2>
          <p className="text-base text-[var(--theme-muted-text)] lg:text-lg">{t("components.homeConversionSections.trustCountersSubcopy")}</p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <TrustCounterSkeleton key={i} />)
            : counters.map((counter) => (
                <div
                  key={counter.labelKey}
                  className="rounded-2xl border border-[var(--theme-card-border)]/80 bg-white p-5 shadow-[var(--shadow-card)] transition-shadow duration-200 first:md:border-l-4 first:md:border-l-primary md:hover:shadow-[var(--shadow-card-hover)]"
                  data-testid={`trust-counter-${counter.labelKey.split(".").pop()}`}
                >
                  <div className="nn-theme-gradient-br mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl shadow-sm md:mx-0">
                    <counter.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-2xl font-extrabold text-[var(--theme-heading-text)] sm:text-3xl">{counter.value}</div>
                  <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">{t(counter.labelKey)}</div>
                </div>
              ))}
        </div>

        <div className="flex flex-wrap gap-3 md:justify-start">
          {badges.map((badge) => (
            <div
              key={badge.labelKey}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-[var(--theme-body-text)] shadow-sm"
              data-testid={`badge-trust-${badge.labelKey.split(".").pop()}`}
            >
              <badge.icon className="h-3.5 w-3.5 text-primary" />
              <span>{t(badge.labelKey)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConversionProofBlock({
  questions,
  flashcards,
  decks,
}: {
  questions: number;
  flashcards: number;
  decks: number;
}) {
  const { t } = useMarketingI18n();
  const router = useRouter();

  const proofIds = [
    { id: "examQuestions", icon: Target },
    { id: "flashcards", icon: Layers },
    { id: "catExams", icon: Brain },
    { id: "clinicalImages", icon: ImageIcon },
    { id: "lessons", icon: BookOpen },
    { id: "multiDiscipline", icon: GraduationCap },
  ] as const;

  return (
    <section
      className="border-t border-[var(--theme-card-border)]"
      style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
      data-testid="section-conversion-proof"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left md:max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 shadow-[var(--shadow-card)]">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("components.homeConversionSections.everythingYouNeed")}</span>
          </div>
          <h2
            className="mb-3 font-bold text-[var(--theme-heading-text)]"
            style={{ fontSize: 'var(--text-section)' }}
            data-testid="text-conversion-proof-heading"
          >
            {t("components.homeConversionSections.conversionProofHeading")}
          </h2>
          <p className="text-base leading-relaxed text-[var(--theme-muted-text)] lg:text-lg">
            {t("components.homeConversionSections.conversionProofSubcopy", {
              questions: formatMarketingCount(questions),
              flashcards: formatMarketingCount(flashcards),
              decks: formatMarketingCount(decks),
            })}
          </p>
        </div>

        <div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
          {proofIds.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[var(--theme-card-border)]/80 bg-white p-7 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
              data-testid={`card-proof-${item.id}`}
            >
              <div className="nn-theme-gradient-br mb-4 flex h-11 w-11 items-center justify-center rounded-xl shadow-sm">
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 font-bold text-[var(--theme-heading-text)]" style={{ fontSize: 'var(--text-card-title)' }}>
                {t(`components.homeConversionSections.proofCard.${item.id}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--theme-muted-text)]">{t(`components.homeConversionSections.proofCard.${item.id}.desc`)}</p>
            </div>
          ))}
        </div>

        <div className="text-center sm:text-left">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-primary px-9 py-3 text-lg font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] shadow-primary/25 hover:brightness-110"
            onClick={() => router.push(mapLegacyMarketingHref("/register"))}
            data-testid="button-conversion-proof-cta"
          >
            {t("components.homeConversionSections.conversionProofCta")}
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <p className="mt-4 text-xs text-[var(--theme-muted-text)]">{t("components.homeConversionSections.noCreditCardRequiredFree")}</p>
        </div>
      </div>
    </section>
  );
}

function CompetitivePositioningSection({
  questions,
  flashcards,
}: {
  questions: number;
  flashcards: number;
}) {
  const { t } = useMarketingI18n();
  const router = useRouter();

  const comparisons = [
    { id: "competitiveRow0", icon: Target },
    { id: "competitiveRow1", icon: Layers },
    { id: "competitiveRow2", icon: Users },
    { id: "competitiveRow3", icon: Zap },
    { id: "competitiveRow4", icon: Activity },
    { id: "competitiveRow5", icon: BarChart3 },
  ] as const;

  return (
    <section
      className="border-t border-[var(--theme-card-border)]"
      style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
      data-testid="section-competitive-positioning"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left md:max-w-3xl">
          <div className="nn-accent-soft-ring mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 shadow-[var(--shadow-card)]">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("components.homeConversionSections.whyNursenest")}</span>
          </div>
          <h2
            className="mb-3 font-bold text-[var(--theme-heading-text)]"
            style={{ fontSize: 'var(--text-section)' }}
            data-testid="text-competitive-heading"
          >
            {t("components.homeConversionSections.competitiveHeading")}
          </h2>
          <p className="text-base text-[var(--theme-muted-text)] lg:text-lg">{t("components.homeConversionSections.competitiveSubcopy")}</p>
        </div>

        <div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
          {comparisons.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[var(--theme-card-border)]/80 bg-white p-6 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]"
              data-testid={`card-compare-${item.id}`}
            >
              <div className="mb-4 flex items-center gap-2.5">
                <div className="nn-accent-icon-wrap flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                  <item.icon className="nn-accent-icon h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[var(--theme-heading-text)]">{t(`components.homeConversionSections.${item.id}.feature`)}</h3>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="nn-trust-check mt-0.5 h-4 w-4 shrink-0" />
                  <p className="text-sm leading-relaxed text-[var(--theme-body-text)]">
                    {item.id === "competitiveRow0"
                      ? t(`components.homeConversionSections.${item.id}.ours`, { count: formatMarketingCount(questions) })
                      : item.id === "competitiveRow1"
                        ? t(`components.homeConversionSections.${item.id}.ours`, { count: formatMarketingCount(flashcards) })
                        : t(`components.homeConversionSections.${item.id}.ours`)}
                  </p>
                </div>
                <div className="flex items-start gap-2 opacity-50">
                  <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-[var(--theme-input-border)]" />
                  <p className="text-sm leading-relaxed text-[var(--theme-muted-text)]">{t(`components.homeConversionSections.${item.id}.typical`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center sm:text-left">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-white px-9 py-3 font-medium text-primary shadow-[var(--shadow-card)] hover:border-primary/40 hover:bg-primary/5"
            onClick={() => router.push(mapLegacyMarketingHref("/pricing"))}
            data-testid="button-competitive-cta"
          >
            {t("components.homeConversionSections.competitiveCta")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const { t } = useMarketingI18n();
  const steps = [
    { step: "1", icon: BookOpen, titleKey: "components.homeConversionSections.howStep1.title", descKey: "components.homeConversionSections.howStep1.desc" },
    { step: "2", icon: Target, titleKey: "components.homeConversionSections.howStep2.title", descKey: "components.homeConversionSections.howStep2.desc" },
    { step: "3", icon: Trophy, titleKey: "components.homeConversionSections.howStep3.title", descKey: "components.homeConversionSections.howStep3.desc" },
  ] as const;

  return (
    <section id="how-it-works" className="border-t border-[var(--theme-card-border)]" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }} data-testid="section-how-it-works">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left md:max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 shadow-[var(--shadow-card)]">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("components.homeConversionSections.howItWorks")}</span>
          </div>
          <h2 className="mb-3 font-bold text-[var(--theme-heading-text)]" style={{ fontSize: 'var(--text-section)' }} data-testid="text-how-it-works-heading">
            {t("components.homeConversionSections.howItWorksHeading")}
          </h2>
          <p className="text-base text-[var(--theme-muted-text)] lg:text-lg">{t("components.homeConversionSections.howItWorksIntro")}</p>
        </div>
        <div className="mx-auto max-w-2xl space-y-10 border-l-2 border-primary/15 pl-6 md:pl-8">
          {steps.map((item, i) => (
            <div key={item.step} className="relative" data-testid={`step-how-it-works-${i}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
                <div className="nn-theme-gradient-br flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-md sm:h-16 sm:w-16">
                  <item.icon className="h-7 w-7 text-white sm:h-8 sm:w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">{item.step}</div>
                  <h3 className="font-bold text-[var(--theme-heading-text)]" style={{ fontSize: "var(--text-card-title)" }}>
                    {t(item.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)]">{t(item.descKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCardsSection({ questionCount }: { questionCount: number }) {
  const router = useRouter();
  const { t } = useMarketingI18n();

  const features = [
    { id: "rationales" as const, icon: Lightbulb, href: "/free-practice", layout: "full" as const },
    { id: "questions" as const, icon: Target, href: "/free-practice", layout: "normal" as const },
    { id: "flashcards" as const, icon: Layers, href: "/flashcards", layout: "normal" as const },
    { id: "mocks" as const, icon: ClipboardCheck, href: "/mock-exams", layout: "normal" as const },
  ];

  return (
    <section style={{ paddingTop: "var(--space-section)", paddingBottom: "var(--space-section)" }} data-testid="section-feature-cards">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left md:max-w-3xl">
          <h2 className="mb-3 font-bold text-[var(--theme-heading-text)]" style={{ fontSize: "var(--text-section)" }} data-testid="text-feature-cards-heading">
            {t("components.homeConversionSections.featureStripHeading")}
          </h2>
          <p className="text-base text-[var(--theme-muted-text)] lg:text-lg">{t("components.homeConversionSections.featureStripSubcopy")}</p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              role="button"
              tabIndex={0}
              className={`group cursor-pointer overflow-hidden rounded-xl border border-[var(--theme-card-border)]/80 bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] ${
                feature.layout === "full" ? "md:col-span-3" : ""
              }`}
              onClick={() => router.push(mapLegacyMarketingHref(feature.href))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") router.push(mapLegacyMarketingHref(feature.href));
              }}
              data-testid={`card-feature-${feature.id}`}
            >
              <div className={`p-7 ${feature.layout === "full" ? "md:flex md:items-start md:gap-10" : ""}`}>
                <div className="nn-accent-icon-wrap mb-5 flex h-12 w-12 shrink-0 items-center justify-center transition-transform group-hover:scale-105 md:mb-0">
                  <feature.icon className="nn-accent-icon h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 font-bold text-[var(--theme-heading-text)]" style={{ fontSize: "var(--text-card-title)" }}>
                    {t(`components.homeConversionSections.featureCard.${feature.id}.title`)}
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed text-[var(--theme-muted-text)]">
                    {feature.id === "questions"
                      ? t(`components.homeConversionSections.featureCard.${feature.id}.desc`, { count: formatCount(questionCount) })
                      : t(`components.homeConversionSections.featureCard.${feature.id}.desc`)}
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">
                    {t(`components.homeConversionSections.featureCard.${feature.id}.tags`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScreenshotCarouselSection() {
  const { t, locale } = useMarketingI18n();
  const platformSlides = useMemo(() => buildHomepageHeroSlides(t), [t]);
  const hasSlides = platformSlides.length > 0;

  return (
    <section
      className="overflow-hidden border-t border-gray-100 py-16 md:py-20"
      data-testid="section-screenshot-carousel"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 text-center shadow-[var(--shadow-card)]">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="text-balance text-xs font-bold uppercase tracking-wider text-primary">
              {t("components.homeConversionSections.platformPreviewBadge")}
            </span>
          </div>
          <h2
            className="mb-4 text-balance font-bold text-[var(--theme-heading-text)]"
            style={{ fontSize: "var(--text-section)" }}
            data-testid="text-screenshots-heading"
          >
            {t("components.homeConversionSections.platformCarouselHeading")}
          </h2>
          <p className="mb-8 text-balance text-base leading-relaxed text-muted-foreground">
            {t("components.homeConversionSections.platformCarouselSubcopy")}
          </p>
        </div>

        {hasSlides ? (
          <div className="mx-auto w-full max-w-5xl">
            <MarketingHeroCarousel
              slides={platformSlides}
              testIdPrefix="platform-carousel"
              imgTestIdPrefix="platform"
              logPrefix="platform-carousel"
            />
          </div>
        ) : (
          <div
            className="mx-auto max-w-md rounded-xl border border-dashed border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-4 py-5 text-center text-sm text-muted-foreground"
            data-testid="platform-carousel-empty-section"
          >
            {t("components.homeConversionSections.platformCarouselEmpty")}
          </div>
        )}
      </div>
    </section>
  );
}

function ProfessionSelectorSection() {
  const { t } = useMarketingI18n();
  const router = useRouter();

  const professions = [
    { id: "nursing", label: "RPN / LPN", sublabel: "Practical Nursing", icon: Stethoscope, href: "/rex-pn-practice-questions" },
    { id: "rn", label: "RN", sublabel: "Registered Nurse", icon: Stethoscope, href: "/nclex-rn-practice-questions" },
    { id: "np", label: "NP", sublabel: "Nurse Practitioner", icon: Stethoscope, href: "/np-exam-practice-questions" },
    { id: "paramedic", label: "Paramedic", sublabel: "PCP / ACP", icon: Ambulance, href: "/paramedic" },
    { id: "rrt", label: "Respiratory Therapy", sublabel: "RRT", icon: Wind, href: "/rrt" },
    { id: "mlt", label: "MLT", sublabel: "Medical Lab Tech", icon: Microscope, href: "/mlt" },
    { id: "imaging", label: "Imaging", sublabel: "Diagnostic Imaging", icon: ScanLine, href: "/imaging" },
  ];

  return (
    <section className="border-t border-[var(--theme-card-border)]" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }} data-testid="section-profession-selector">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 shadow-[var(--shadow-card)] mb-5">
            <Brain className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("components.homeConversionSections.chooseYourPath")}</span>
          </div>
          <h2 className="font-bold text-[var(--theme-heading-text)] mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-profession-heading">
            {t("components.homeConversionSections.professionHeading")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--theme-muted-text)] max-w-3xl mx-auto">
            {t("components.homeConversionSections.professionSubcopy")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {professions.map((prof) => {
            const IconComp = prof.icon;
            const isAllied = ["paramedic", "rrt", "mlt", "imaging"].includes(prof.id);

            const handleClick = () => {
              if (isAllied) {
                router.push(mapLegacyMarketingHref(`/allied-health${prof.href}`));
              } else {
                router.push(mapLegacyMarketingHref(prof.href));
              }
            };

            return (
              <div
                key={prof.id}
                className="relative bg-white rounded-2xl border border-[var(--theme-card-border)]/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-6 cursor-pointer group overflow-hidden"
                onClick={handleClick}
                data-testid={`card-profession-${prof.id}`}
              >
                {isAllied && (
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary-foreground">
                      {t("components.homeConversionSections.allied")}
                    </span>
                  </div>
                )}
                <div className="nn-accent-icon-wrap mb-4 flex h-11 w-11 items-center justify-center rounded-xl">
                  <IconComp className="nn-accent-icon h-5 w-5" />
                </div>
                <h3 className="font-bold text-[var(--theme-heading-text)] text-base mb-0.5">{prof.label}</h3>
                <p className="text-xs text-[var(--theme-muted-text)]">{prof.sublabel}</p>
                <div className="mt-3 flex items-center text-xs font-medium text-primary transition-all group-hover:gap-1.5">
                  <span>{t("components.homeConversionSections.explore")}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SampleQuestionSection() {
  const { t } = useMarketingI18n();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const router = useRouter();

  const handleSelect = (optionId: string) => {
    if (revealed) return;
    setSelectedAnswer(optionId);
  };

  const handleReveal = () => {
    if (!selectedAnswer) return;
    setRevealed(true);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setRevealed(false);
  };

  return (
    <section className="border-t border-[var(--theme-card-border)]" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }} data-testid="section-sample-question">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="nn-accent-soft-ring mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 shadow-[var(--shadow-card)]">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("components.homeConversionSections.tryItFree")}</span>
          </div>
          <h2 className="font-bold text-[var(--theme-heading-text)] mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-sample-question-heading">
            {t("components.homeConversionSections.sampleQuestionHeading")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--theme-muted-text)]">{t("components.homeConversionSections.sampleQuestionSubcopy")}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--theme-card-border)]/80 shadow-[var(--shadow-elevated)] overflow-hidden" data-testid="card-sample-question">
          <div className="bg-[var(--theme-muted-surface)] px-6 py-3 border-b border-[var(--theme-input-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-[var(--theme-input-border)] px-2 py-0.5 text-xs">{sampleQuestion.category}</span>
              <span className="rounded-md border border-emerald-200 px-2 py-0.5 text-xs text-emerald-600">{sampleQuestion.difficulty}</span>
            </div>
          </div>

          <div className="p-6">
            <p className="text-[var(--theme-heading-text)] leading-relaxed mb-6 font-medium" data-testid="text-sample-stem">
              {sampleQuestion.stem}
            </p>

            <div className="space-y-3">
              {sampleQuestion.options.map((option) => {
                let borderClass = "border-[var(--theme-input-border)] hover:border-primary/40 hover:bg-primary/5";
                let bgClass = "";

                if (selectedAnswer === option.id && !revealed) {
                  borderClass = "border-primary ring-2 ring-primary/20";
                  bgClass = "bg-primary/5";
                }

                if (revealed) {
                  if (option.id === sampleQuestion.correctAnswer) {
                    borderClass = "border-primary ring-2 ring-primary/25";
                    bgClass = "bg-primary/10";
                  } else if (selectedAnswer === option.id) {
                    borderClass = "border-red-300 ring-2 ring-red-200";
                    bgClass = "bg-red-50";
                  } else {
                    borderClass = "border-[var(--theme-input-border)] opacity-60";
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    disabled={revealed}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${borderClass} ${bgClass}`}
                    data-testid={`option-sample-${option.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full border-2 border-[var(--theme-input-border)] flex items-center justify-center text-xs font-bold text-[var(--theme-muted-text)] shrink-0 mt-0.5">
                        {option.id}
                      </span>
                      <span className="text-sm text-[var(--theme-body-text)]">{option.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {!revealed && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={handleReveal}
                  disabled={!selectedAnswer}
                  className="rounded-full bg-primary px-8 py-2 text-primary-foreground disabled:opacity-50"
                  data-testid="button-reveal-answer"
                >
                  {t("components.homeConversionSections.sampleCheckAnswer")}
                </button>
              </div>
            )}

            {revealed && (
              <div className="mt-6 space-y-4">
                <div
                  className={`rounded-xl border p-5 ${
                    selectedAnswer === sampleQuestion.correctAnswer
                      ? "border-primary/25 bg-primary/8"
                      : "border-primary/20 bg-primary/5"
                  }`}
                  data-testid="card-sample-rationale"
                >
                  <div className="mb-2 flex items-center gap-2">
                    {selectedAnswer === sampleQuestion.correctAnswer ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Lightbulb className="h-5 w-5 text-primary" />
                    )}
                    <span className="font-bold text-[var(--theme-heading-text)]">
                      {selectedAnswer === sampleQuestion.correctAnswer
                        ? t("components.homeConversionSections.sampleCorrect")
                        : t("components.homeConversionSections.sampleCorrectAnswerLabel", { letter: sampleQuestion.correctAnswer })}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--theme-body-text)] leading-relaxed">{sampleQuestion.rationale}</p>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-full border border-[var(--theme-input-border)] bg-white px-6 py-2"
                    data-testid="button-try-again"
                  >
                    {t("components.homeConversionSections.sampleTryAgain")}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(mapLegacyMarketingHref("/register"))}
                    className="inline-flex items-center rounded-full bg-primary px-6 py-2 text-primary-foreground"
                    data-testid="button-sample-signup"
                  >
                    {t("components.homeConversionSections.sampleStartPractice")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { t } = useMarketingI18n();
  const reviews = [
    { name: "Priya S.", role: "RPN Student, Ontario", rating: 5, text: "I passed my practical nursing exam on the first attempt. The question bank and clinical lessons covered everything I saw on exam day. The rationales actually teach you how to think through each question.", tier: "RPN" },
    { name: "James K.", role: "RN Student, British Columbia", rating: 5, text: "The mock exams with strict mode were a game changer. I felt completely prepared walking into the NCLEX-RN. The flashcard decks helped me memorize medications faster than any textbook.", tier: "RN" },
    { name: "Dr. Aisha M.", role: "NP Student, Alberta", rating: 5, text: "The NP question bank is incredibly thorough. Pharmacology questions, clinical management scenarios, and differential diagnosis content were all directly relevant to my AANP certification exam.", tier: "NP" },
    { name: "Sophie L.", role: "RPN Student, Manitoba", rating: 5, text: "I stopped guessing what to open after night shifts—the lesson checks and miss categories pointed me to the next block instead of re-reading the same chapters.", tier: "RPN" },
    { name: "Marcus T.", role: "RN Student, Nova Scotia", rating: 4, text: "The pathophysiology lessons broke down complex topics into clear, digestible sections. Being able to switch languages to French was a huge plus for me as a bilingual student.", tier: "RN" },
    { name: "Dr. Fatima R.", role: "NP Student, Ontario", rating: 5, text: "I recommended NurseNest to my entire cohort. The clinical pearls and medication safety content go beyond surface-level review. This platform genuinely prepares you for advanced practice.", tier: "NP" },
  ];

  return (
    <section className="border-t border-[var(--theme-card-border)]" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }} data-testid="section-testimonials">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="nn-accent-soft-ring mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 shadow-[var(--shadow-card)]">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("components.homeConversionSections.studentReviews")}</span>
          </div>
          <h2 className="font-bold text-[var(--theme-heading-text)] mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-testimonials-heading">
            {t("components.homeConversionSections.testimonialsHeading")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--theme-muted-text)] max-w-2xl mx-auto">
            {t("components.homeConversionSections.testimonialsSubcopy")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--theme-card-border)]/80 bg-white shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]"
              data-testid={`card-testimonial-${i}`}
            >
              <div className="p-6">
                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`h-4 w-4 ${s < review.rating ? "fill-primary text-primary" : "text-[var(--theme-separator)]"}`} />
                  ))}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-[var(--theme-body-text)]" data-testid={`text-testimonial-${i}`}>
                  &quot;{review.text}&quot;
                </p>
                <div className="flex items-center justify-between border-t border-[var(--theme-card-border)] pt-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{review.name}</p>
                    <p className="text-xs text-[var(--theme-muted-text)]">{review.role}</p>
                  </div>
                  <span className="rounded-md border border-[var(--theme-input-border)] px-2 py-0.5 text-xs">{review.tier}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-[var(--theme-muted-text)]">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {["bg-primary", "bg-primary/80", "bg-primary/60", "bg-primary/90"].map((bg, i) => (
                <div key={i} className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-[var(--theme-primary-foreground)] ${bg}`}>
                  {["P", "J", "A", "S"][i]}
                </div>
              ))}
            </div>
            <span>{t("components.homeConversionSections.join5000Students")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-semibold text-[var(--theme-body-text)]">4.9/5</span>
            <span>{t("components.homeConversionSections.averageRating")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  const { t } = useMarketingI18n();
  const router = useRouter();

  return (
    <section className="relative overflow-hidden" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }} data-testid="section-final-cta">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="font-bold text-[var(--theme-heading-text)] mb-5" style={{ fontSize: 'var(--text-section)' }} data-testid="text-final-cta-heading">
          {t("components.homeConversionSections.finalCtaHeading")}
        </h2>
        <p className="text-lg lg:text-xl text-[var(--theme-muted-text)] mb-10 max-w-2xl mx-auto leading-relaxed">
          {t("components.homeConversionSections.finalCtaSubcopy")}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-lg font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] shadow-primary/25 transition-all hover:-translate-y-0.5 hover:brightness-110"
            onClick={() => router.push(mapLegacyMarketingHref("/register"))}
            data-testid="button-final-cta-start"
          >
            {t("components.homeConversionSections.finalCtaPrimary")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button
            type="button"
            className="h-14 rounded-full border border-[var(--theme-input-border)] bg-card px-8 text-lg font-medium text-[var(--theme-body-text)] hover:border-[color-mix(in_srgb,var(--theme-primary)_22%,var(--theme-input-border))] hover:bg-[var(--theme-muted-surface)]"
            onClick={() => router.push(mapLegacyMarketingHref("/pricing"))}
            data-testid="button-final-cta-pricing"
          >
            {t("components.homeConversionSections.finalCtaSecondary")}
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-8 mb-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-primary">{t("components.homeConversionSections.7dayMoneybackGuarantee")}</span>
        </div>
        <p className="text-sm text-[var(--theme-muted-text)]">{t("components.homeConversionSections.freeAccountIncludesPracticeQuestions")}</p>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[80px]" aria-hidden />
    </section>
  );
}

export default HomeConversionSections;
