"use client";

import { memo, useCallback, useEffect, useMemo, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  BookOpen,
  CheckCircle2,
  MapPin,
  Trophy,
  HelpCircle,
  Layers,
  Users,
  Brain,
  Target,
  ClipboardList,
  Stethoscope,
  GraduationCap,
  Heart,
  Briefcase,
  Award,
  Sparkles,
} from "lucide-react";
import { getEnabledCareers } from "@shared/careers";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { LazySection } from "@/legacy/marketing/lazy-section";
import { buildHomepageHeroSlides, HOMEPAGE_HERO_SLIDE_METADATA } from "@/lib/marketing-assets";
import { MarketingScreenshotStack } from "@/components/marketing/marketing-screenshot-stack";
import type { HomepageLessonTeaser } from "@/lib/marketing/homepage-lesson-teasers";
import { HomeHeroPathGateway } from "@/components/marketing/home-hero-path-gateway";
import { HomeMarketingConversionBlocks } from "@/components/marketing/home-marketing-conversion-blocks";
import { HomeMarketingSixtySeconds } from "@/components/marketing/home-marketing-sixty-seconds";
import { HomeMarketingProductProof } from "@/components/marketing/home-marketing-product-proof";
import { MarketingTrustSection } from "@/components/marketing/marketing-trust-section";
import { HomeMarketingFeaturesStack } from "@/components/marketing/home-marketing-features-stack";
import { heroQuickEntryLinks } from "@/lib/marketing/home-hero-gateway-config";
import { rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";

const HeroFeatureStrip = dynamic(() => import("@/legacy/marketing/hero-feature-strip"), {
  loading: () => <div className="min-h-[60px]" />,
});
const HeroTrustIndicator = dynamic(() => import("@/legacy/marketing/hero-trust-indicator"), {
  loading: () => <div className="min-h-[50px]" />,
});
const HeroPlatformStats = dynamic(() => import("@/legacy/marketing/hero-platform-stats"), {
  loading: () => <div className="min-h-[300px]" />,
});
const HeroGlobalCoverage = dynamic(() => import("@/legacy/marketing/hero-global-coverage"), {
  loading: () => <div className="min-h-[300px]" />,
});
const HeroNursingTiers = dynamic(() => import("@/legacy/marketing/hero-nursing-tiers"), {
  loading: () => <div className="min-h-[400px]" />,
});
const HeroCertifications = dynamic(() => import("@/legacy/marketing/hero-certifications"), {
  loading: () => <div className="min-h-[300px]" />,
});
const HeroAlliedHealth = dynamic(() => import("@/legacy/marketing/hero-allied-health"), {
  loading: () => <div className="min-h-[400px]" />,
});
const HeroExpansionTracker = dynamic(() => import("@/legacy/marketing/hero-expansion-tracker"), {
  loading: () => <div className="min-h-[300px]" />,
});
const HomeDifferentiation = dynamic(() => import("@/legacy/marketing/home-differentiation"), {
  loading: () => <div className="min-h-[600px]" />,
});
const HomeConversionSections = dynamic(() => import("@/legacy/marketing/home-conversion-sections"), {
  loading: () => <div className="min-h-[400px]" />,
});
const HomeCareerCta = dynamic(() => import("@/legacy/marketing/home-career-cta"), {
  loading: () => <div className="min-h-[200px]" />,
});
const HomeBottomSections = dynamic(() => import("@/legacy/marketing/home-bottom-sections"), {
  loading: () => <div className="min-h-[800px]" />,
});

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

function formatLearnerCount(n: number): string {
  if (n <= 0) return "";
  if (n >= 1000) {
    const hundreds = Math.floor(n / 100) * 100;
    return `${hundreds.toLocaleString("en-US")}+`;
  }
  return `${n.toLocaleString("en-US")}+`;
}

/**
 * Restored from `client/src/pages/home.tsx` (structure, classes, i18n keys).
 * Navigation/footer remain in root layout; below-fold sections use legacy copies + dynamic import.
 */
type HomeStatsPayload = {
  totalLessons: number;
  pathwayLessonsPublished?: number;
  contentItemsLessonCount?: number;
  questionCount: number;
  totalFlashcards: number;
  totalDecks: number;
  storeProductCount: number;
  registeredLearners?: number;
  questionsByTier?: Record<string, number>;
  scenarioCount?: number;
};

type HomeRestoredClientProps = {
  lessonTeasers: HomepageLessonTeaser[];
};

const MemoLessonTeaserGrid = memo(function MemoLessonTeaserGrid({ items }: { items: HomepageLessonTeaser[] }) {
  const { t, locale } = useMarketingI18n();
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={withMarketingLocale(locale, item.lessonsHref)}
            className="flex h-full flex-col rounded-xl border border-[var(--theme-card-border)] bg-card p-4 shadow-sm transition hover:border-primary/30"
          >
            <span className="text-xs font-semibold uppercase text-primary">{item.shortLabel}</span>
            <span className="mt-1 text-sm font-semibold text-[var(--theme-heading-text)]">{item.title}</span>
            <span className="mt-3 text-xs font-medium text-primary">{t("home.lessons.lessonHubCta")}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
});

export default function HomeRestoredClient({ lessonTeasers }: HomeRestoredClientProps) {
  const { t, locale } = useMarketingI18n();
  const { region, setRegion } = useNursenestRegion();
  const [lessonCount, setLessonCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [storeProductCount, setStoreProductCount] = useState(0);
  const [flashcardCount, setFlashcardCount] = useState(0);
  const [deckCount, setDeckCount] = useState(0);
  const [registeredLearners, setRegisteredLearners] = useState(0);
  const [topicCategoryCount, setTopicCategoryCount] = useState<number | undefined>(undefined);
  const [heroMediaVisible, setHeroMediaVisible] = useState(() => HOMEPAGE_HERO_SLIDE_METADATA.length > 0);

  const heroSlides = useMemo(() => buildHomepageHeroSlides(t), [t]);

  const heroQuickLinks = useMemo(() => heroQuickEntryLinks(region), [region]);

  const [email, setEmail] = useState("");
  const [emailFrequency, setEmailFrequency] = useState("weekly");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailMessage, setEmailMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/home-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: HomeStatsPayload | null) => {
        if (cancelled || !d) return;
        setLessonCount(d.totalLessons ?? 0);
        setQuestionCount(d.questionCount ?? 0);
        setStoreProductCount(d.storeProductCount ?? 0);
        if (typeof d.totalFlashcards === "number") setFlashcardCount(d.totalFlashcards);
        if (typeof d.totalDecks === "number") setDeckCount(d.totalDecks);
        if (typeof d.registeredLearners === "number") setRegisteredLearners(d.registeredLearners);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleEmailSubscribe = useCallback(async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailStatus("error");
      setEmailMessage(t("home.email.invalidEmail"));
      return;
    }
    setEmailStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, frequency: emailFrequency }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message || t("home.email.subscriptionFailed"));
      }
      setEmailStatus("success");
      setEmailMessage(t("home.email.success"));
      setEmail("");
    } catch (e: unknown) {
      setEmailStatus("error");
      setEmailMessage(e instanceof Error ? e.message : t("home.email.somethingWrong"));
    }
  }, [email, emailFrequency, t]);

  const enabledCareers = getEnabledCareers();

  return (
    <div className="font-sans md:animate-page-enter flex min-h-screen flex-col overflow-x-hidden bg-[var(--theme-page-bg)]">
      <main className="flex-grow overflow-x-hidden">
        <section
          className="relative overflow-hidden"
          style={{ paddingTop: "var(--space-hero-top)", paddingBottom: "var(--space-hero-bottom)" }}
          data-testid="hero-section"
        >
          <div className="pointer-events-none absolute left-0 top-0 -z-10 hidden h-full w-full overflow-hidden md:block will-change-transform" aria-hidden="true">
            <div className="absolute right-[-5%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/8 blur-[80px]" style={{ transform: "translateZ(0)" }} />
            <div className="absolute bottom-[10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-secondary/20 blur-[100px]" style={{ transform: "translateZ(0)" }} />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`grid items-center gap-8 md:items-stretch md:gap-10 lg:gap-12 ${heroMediaVisible ? "md:grid-cols-2" : "md:grid-cols-1"}`}
            >
              <div className="hero-motion-enter min-w-0 space-y-6 md:space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 sm:px-4"
                    data-testid="badge-trust-micro"
                  >
                    <Award className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="text-xs font-semibold text-primary sm:text-sm">{t("home.hero.trustMicroBadge")}</span>
                  </div>
                  <div className="nn-accent-pill inline-flex items-center gap-2 rounded-full px-3 py-1.5 sm:px-4" data-testid="badge-authority">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="text-xs font-semibold text-primary sm:text-sm">{t("home.hero.authorityBadge")}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1
                    className="font-bold leading-[1.08] tracking-tight text-[var(--theme-heading-text)]"
                    style={{ fontSize: "var(--text-hero)" }}
                    data-testid="text-hero-heading"
                  >
                    {t("home.hero.mainTitle")}
                  </h1>

                  <p className="max-w-xl text-base leading-relaxed text-[var(--theme-body-text)] lg:text-lg" data-testid="text-hero-subheading">
                    {t("home.hero.newSubheadline")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3" data-testid="hero-feature-strip">
                  {(
                    [
                      { icon: Brain, key: "featureActiveRecall", descKey: "featureActiveRecallDesc" },
                      { icon: ClipboardList, key: "featureNGN", descKey: "featureNGNDesc" },
                      { icon: Target, key: "featureBlueprint", descKey: "featureBlueprintDesc" },
                      { icon: Stethoscope, key: "featureClinicalDecision", descKey: "featureClinicalDecisionDesc" },
                    ] as const
                  ).map((feat) => (
                    <div
                      key={feat.key}
                      className="nn-card flex items-start gap-2.5 rounded-xl p-3"
                      data-testid={`feature-${feat.key}`}
                    >
                      <div className="nn-accent-icon-wrap mt-0.5 h-8 w-8 shrink-0">
                        <feat.icon className="nn-accent-icon h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-tight text-[var(--theme-heading-text)] sm:text-sm">{t(`home.hero.${feat.key}`)}</p>
                        <p className="mt-0.5 hidden text-[11px] leading-snug text-[var(--theme-body-text)] sm:block">{t(`home.hero.${feat.descKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden rounded-2xl border border-[var(--theme-input-border)] bg-card shadow-[var(--shadow-card)]" data-testid="region-toggle-hero">
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => setRegion("US")}
                      className={`relative flex flex-1 items-center justify-center gap-2.5 px-4 py-3.5 text-sm font-semibold transition-all duration-200 sm:py-4 sm:text-base ${
                        region === "US"
                          ? "border-b-2 border-primary bg-primary/10 text-primary"
                          : "border-b-2 border-transparent text-[var(--theme-muted-text)] hover:bg-[var(--theme-muted-surface)] hover:text-[var(--theme-body-text)]"
                      }`}
                      data-testid="button-region-us"
                    >
                      <span className="text-xl" role="img" aria-label={t("pages.home.usFlag")}>
                        🇺🇸
                      </span>
                      <span>{t("home.region.us")}</span>
                      {region === "US" && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                    <div className="w-px bg-[var(--theme-input-border)]" />
                    <button
                      type="button"
                      onClick={() => setRegion("CA")}
                      className={`relative flex flex-1 items-center justify-center gap-2.5 px-4 py-3.5 text-sm font-semibold transition-all duration-200 sm:py-4 sm:text-base ${
                        region === "CA"
                          ? "border-b-2 border-primary bg-primary/10 text-primary"
                          : "border-b-2 border-transparent text-[var(--theme-muted-text)] hover:bg-[var(--theme-muted-surface)] hover:text-[var(--theme-body-text)]"
                      }`}
                      data-testid="button-region-ca"
                    >
                      <span className="text-xl" role="img" aria-label={t("pages.home.canadianFlag")}>
                        🇨🇦
                      </span>
                      <span>{t("home.region.ca")}</span>
                      {region === "CA" && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  </div>
                  <div className="border-t border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-4 py-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--theme-body-text)]" />
                      <p className="text-xs leading-relaxed text-[var(--theme-body-text)]">
                        {region === "US" ? t("home.region.usDesc") : t("home.region.caDesc")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <MarketingTrackedLink
                    href="/signup"
                    event={PH.marketingHomeHeroPrimaryCta}
                    eventProps={{ region }}
                    className="shadow-primary/25 flex min-h-[52px] w-full items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-white shadow-[var(--shadow-elevated)] transition-transform hover:-translate-y-0.5 hover:brightness-110 sm:min-h-[56px] sm:w-auto sm:px-9 sm:text-lg"
                    data-testid="button-hero-start-free"
                  >
                    {t("home.hero.ctaPrimary")}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </MarketingTrackedLink>
                  <MarketingTrackedLink
                    href={withMarketingLocale(locale, rnQuestions(region))}
                    event={PH.marketingHomeHeroSecondaryCta}
                    eventProps={{ region, destination: "rn_questions" }}
                    className="flex min-h-[52px] w-full items-center justify-center rounded-full border border-[var(--theme-input-border)] bg-card px-7 py-3 text-base font-medium text-[var(--theme-body-text)] hover:border-[color-mix(in_srgb,var(--theme-primary)_22%,var(--theme-input-border))] hover:bg-[var(--theme-muted-surface)] sm:min-h-[56px] sm:w-auto sm:px-9 sm:text-lg"
                    data-testid="button-hero-browse"
                  >
                    <BookOpen className="mr-2 h-4 w-4 text-primary sm:h-5 sm:w-5" />
                    {t("home.hero.ctaSecondary")}
                  </MarketingTrackedLink>
                </div>

                <div className="space-y-2" data-testid="hero-quick-entry-links">
                  <p className="text-xs font-medium text-[var(--theme-muted-text)]">{t("home.hero.quickEntryLabel")}</p>
                  <div className="flex flex-wrap gap-2">
                    {heroQuickLinks.map((item) => (
                      <MarketingTrackedLink
                        key={item.label}
                        href={withMarketingLocale(locale, item.href)}
                        event={PH.marketingHomeQuickEntryClick}
                        eventProps={{ region, link_label: item.label }}
                        className="inline-flex items-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] transition hover:border-primary/35 hover:bg-card"
                      >
                        {item.label}
                      </MarketingTrackedLink>
                    ))}
                  </div>
                </div>

                <p className="text-center text-xs text-[var(--theme-body-text)] sm:text-left" data-testid="text-urgency-microcopy">
                  {t("home.hero.urgencyMicrocopy")}
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--theme-body-text)] sm:gap-x-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    <span>{t("home.hero.noCreditCard")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 shrink-0 text-primary" />
                    <span>{t("home.hero.guarantee")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    <span>{t("home.hero.cancelAnytime")}</span>
                  </div>
                </div>

                <div
                  className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-[var(--theme-body-text)] sm:justify-start sm:gap-x-4"
                  data-testid="hero-trust-indicators"
                >
                  <div className="flex items-center gap-1.5">
                    <Trophy className="h-3.5 w-3.5 shrink-0" />
                    <span data-testid="text-trust-pass-rate">{t("home.hero.trustPassRate")}</span>
                  </div>
                  <span className="hidden text-[var(--theme-muted-text)] sm:inline" aria-hidden="true">
                    ·
                  </span>
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                    <span data-testid="text-trust-questions">
                      {questionCount > 0
                        ? `${formatCount(questionCount)} ${t("home.hero.trustQuestionsLabel")}`
                        : t("home.hero.trustQuestions")}
                    </span>
                  </div>
                  <span className="hidden text-[var(--theme-muted-text)] sm:inline" aria-hidden="true">
                    ·
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 shrink-0" />
                    <span data-testid="text-trust-flashcards">
                      {flashcardCount > 0
                        ? `${formatCount(flashcardCount)} ${t("home.hero.trustFlashcardsLabel")}`
                        : t("home.hero.trustFlashcards")}
                    </span>
                  </div>
                  <span className="hidden text-[var(--theme-muted-text)] sm:inline" aria-hidden="true">
                    ·
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    <span data-testid="text-trust-students">
                      {registeredLearners > 0
                        ? `${formatLearnerCount(registeredLearners)} learners`
                        : t("home.hero.trustStudents")}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--theme-card-border)] bg-card/60 p-4 shadow-[var(--shadow-card)]" data-testid="hero-built-for-bar">
                  <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--theme-body-text)]">{t("home.hero.builtForLabel")}</p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { icon: GraduationCap, key: "builtForNursingStudents" },
                        { icon: Heart, key: "builtForPracticalNurses" },
                        { icon: Stethoscope, key: "builtForRegisteredNurses" },
                        { icon: Briefcase, key: "builtForNursePractitioners" },
                        { icon: Users, key: "builtForAlliedHealth" },
                      ] as const
                    ).map((seg) => (
                      <span
                        key={seg.key}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)] px-2 py-1 text-[11px] font-medium text-[var(--theme-body-text)] sm:px-2.5 sm:text-xs"
                        data-testid={`built-for-${seg.key}`}
                      >
                        <seg.icon className="h-3 w-3 shrink-0 text-[var(--theme-muted-text)]" />
                        {t(`home.hero.${seg.key}`)}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-[var(--theme-body-text)]">{t("home.hero.builtForMicrocopy")}</p>
                </div>
              </div>

              <div
                className={
                  heroMediaVisible
                    ? "relative mt-8 flex min-h-0 w-full min-w-0 flex-col justify-center md:mt-0 md:max-h-[min(40rem,78vh)]"
                    : "hidden"
                }
                style={{ overflowAnchor: "none" }}
              >
                <MarketingScreenshotStack
                  slides={heroSlides}
                  pickIndices={[0, 1, 2]}
                  testIdPrefix="hero-screenshot-stack"
                  className="md:max-h-[min(40rem,78vh)] md:overflow-y-auto md:pr-1"
                />
              </div>
            </div>

            <div className="mt-10 sm:mt-12" data-testid="section-careers-supported">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--theme-body-text)]">
                {t("home.hero.examPrepFor", {
                  region: region === "CA" ? t("home.region.ca") : t("home.region.us"),
                })}
              </p>
              <div className="flex flex-wrap gap-2">
                {enabledCareers.slice(0, 8).map((career) => (
                  <span
                    key={career.id}
                    className="inline-flex items-center rounded-full border border-[var(--theme-card-border)] bg-card px-3 py-1.5 text-xs font-medium text-[var(--theme-body-text)] shadow-sm"
                  >
                    {career.shortName}
                  </span>
                ))}
                {enabledCareers.length > 8 && (
                  <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
                    {t("home.hero.moreCount", { count: String(enabledCareers.length - 8) })}
                  </span>
                )}
              </div>
            </div>

            <HomeHeroPathGateway region={region} />
          </div>
        </section>

        <section
          className="border-t border-[var(--theme-card-border)] bg-gradient-to-b from-[var(--theme-muted-surface)] to-[var(--theme-card-bg)]"
          style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
          data-testid="section-hero-benefits"
        >
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-center text-lg font-bold text-[var(--theme-heading-text)] sm:text-xl" data-testid="text-benefits-heading">
              {t("home.hero.benefitsHeading")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {(
                [
                  { key: "benefit1", icon: Stethoscope },
                  { key: "benefit2", icon: Brain },
                  { key: "benefit3", icon: ClipboardList },
                  { key: "benefit4", icon: Target },
                ] as const
              ).map((item) => (
                <div
                  key={item.key}
                  className="flex items-start gap-3 rounded-xl border border-[var(--theme-card-border)] bg-card p-3.5 shadow-[var(--shadow-card)]"
                  data-testid={`hero-${item.key}`}
                >
                  <div className="nn-accent-icon-wrap mt-0.5 h-8 w-8 shrink-0">
                    <item.icon className="nn-accent-icon h-4 w-4" />
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--theme-body-text)]">{t(`home.hero.${item.key}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="border-t border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]"
          style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
          data-testid="section-start-lessons"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--theme-heading-text)] sm:text-xl">{t("home.lessons.title")}</h2>
                <p className="mt-1 max-w-xl text-sm text-[var(--theme-muted-text)]">{t("home.lessons.subtitle")}</p>
              </div>
              <Link
                href={withMarketingLocale(locale, "/exam-lessons")}
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                {t("home.lessons.allPathwaysCta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <MemoLessonTeaserGrid items={lessonTeasers} />
          </div>
        </section>

        <section
          className="border-t border-[var(--theme-card-border)] bg-[var(--theme-card-bg)]"
          style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
          data-testid="section-explore-hubs"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-left text-base font-bold text-[var(--theme-heading-text)] sm:text-lg md:text-center">
              {t("home.exploreHubs.title")}
            </h2>
            <p className="mt-2 text-left text-sm text-[var(--theme-muted-text)] md:text-center">
              {t("home.exploreHubs.subtitle")}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  { href: "/nclex-rn-practice-questions", labelKey: "home.exploreHubs.link.nclexRn", hub: "nclex_rn_programmatic" },
                  { href: "/rex-pn-practice-questions", labelKey: "home.exploreHubs.link.rexPn", hub: "pn_programmatic" },
                  { href: "/np-exam-practice-questions", labelKey: "home.exploreHubs.link.np", hub: "np_programmatic" },
                  { href: "/tools", labelKey: "home.exploreHubs.link.tools", hub: "tools" },
                  { href: "/blog", labelKey: "home.exploreHubs.link.blog", hub: "blog" },
                  { href: "/pricing", labelKey: "home.exploreHubs.link.pricing", hub: "pricing" },
                ] as const
              ).map((item) => (
                <li key={item.href}>
                  <MarketingTrackedLink
                    href={withMarketingLocale(locale, item.href)}
                    event={PH.marketingHomeExploreHubClick}
                    eventProps={{ hub: item.hub }}
                    className="flex items-center justify-between rounded-xl border border-[var(--theme-card-border)] bg-card px-4 py-3 text-sm font-medium text-[var(--theme-heading-text)] shadow-sm transition hover:border-primary/30 hover:bg-[var(--theme-muted-surface)]"
                  >
                    {t(item.labelKey)}
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  </MarketingTrackedLink>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <HomeMarketingConversionBlocks region={region} />

        <LazySection minHeight="60px" rootMargin="400px">
          <Suspense fallback={<div className="min-h-[60px]" />}>
            <HeroFeatureStrip />
          </Suspense>
        </LazySection>
        <LazySection minHeight="50px" rootMargin="400px">
          <Suspense fallback={<div className="min-h-[50px]" />}>
            <HeroTrustIndicator />
          </Suspense>
        </LazySection>

        <LazySection minHeight="200px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[200px]" />}>
            <HomeMarketingFeaturesStack region={region} />
          </Suspense>
        </LazySection>

        <LazySection minHeight="300px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <HeroPlatformStats />
          </Suspense>
        </LazySection>

        <LazySection minHeight="280px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[280px]" />}>
            <HomeMarketingSixtySeconds region={region} />
          </Suspense>
        </LazySection>

        <LazySection minHeight="400px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <HomeMarketingProductProof />
          </Suspense>
        </LazySection>

        <LazySection minHeight="300px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <HeroGlobalCoverage />
          </Suspense>
        </LazySection>

        <LazySection minHeight="400px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <HeroNursingTiers />
          </Suspense>
        </LazySection>

        <LazySection minHeight="300px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <HeroCertifications />
          </Suspense>
        </LazySection>

        <LazySection minHeight="400px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <HeroAlliedHealth />
          </Suspense>
        </LazySection>

        <LazySection minHeight="300px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <HeroExpansionTracker />
          </Suspense>
        </LazySection>

        <LazySection minHeight="600px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[600px]" />}>
            <HomeDifferentiation />
          </Suspense>
        </LazySection>

        <LazySection minHeight="400px" rootMargin="200px">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <HomeConversionSections
              lessonCount={lessonCount}
              questionCount={questionCount}
              flashcardCount={flashcardCount}
              deckCount={deckCount}
            />
          </Suspense>
        </LazySection>

        <LazySection minHeight="200px" rootMargin="200px">
          <Suspense fallback={<div className="min-h-[200px]" />}>
            <HomeCareerCta />
          </Suspense>
        </LazySection>

        <LazySection minHeight="420px" rootMargin="400px">
          <Suspense fallback={<div className="min-h-[420px]" />}>
            <HomeBottomSections
              region={region}
              heroStats={undefined}
              featuredProducts={[]}
              lessonCount={lessonCount}
              questionCount={questionCount}
              storeProductCount={storeProductCount}
              email={email}
              setEmail={setEmail}
              emailFrequency={emailFrequency}
              setEmailFrequency={setEmailFrequency}
              emailStatus={emailStatus}
              emailMessage={emailMessage}
              setEmailStatus={setEmailStatus}
              handleEmailSubscribe={handleEmailSubscribe}
            />
          </Suspense>
        </LazySection>

        <div className="mx-auto max-w-5xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <Link
            href={mapLegacyMarketingHref("/languages")}
            className="inline-flex items-center gap-2 text-sm text-[var(--theme-muted-text)] transition-colors hover:text-primary"
            data-testid="link-home-languages"
          >
            <span aria-hidden="true">🌐</span>
            <span>{t("pages.home.availableIn20LanguagesStudy")}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
