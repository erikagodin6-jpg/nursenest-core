"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Shield, BookOpen, CheckCircle2, MapPin } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { LazySection } from "@/legacy/marketing/lazy-section";
import { buildHomepageHeroSlides } from "@/lib/marketing-assets";
import type { HomepageLessonTeaser } from "@/lib/marketing/homepage-lesson-teasers";
import { heroPathwayEntryLinks } from "@/lib/marketing/home-hero-gateway-config";
import { rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { HomeHeroMediaPanel } from "@/components/marketing/home-hero-media-panel";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import type { HeroPlatformStatsPayload } from "@/legacy/marketing/hero-platform-stats";
import { PH } from "@/lib/observability/posthog-conversion-events";

const HomePageHeroTail = dynamic(() => import("@/components/marketing/home-page-hero-tail"), {
  ssr: false,
  loading: () => <div className="min-h-[200px]" aria-hidden />,
});

const HomePageMidSections = dynamic(() => import("@/components/marketing/home-page-mid-sections"), {
  ssr: false,
  loading: () => <div className="min-h-[320px]" aria-hidden />,
});

const HomeMarketingConversionBlocks = dynamic(
  () => import("@/components/marketing/home-marketing-conversion-blocks").then((m) => ({ default: m.HomeMarketingConversionBlocks })),
  { ssr: false, loading: () => <div className="min-h-[240px]" aria-hidden /> },
);

const HomeMarketingFeaturesStack = dynamic(
  () => import("@/components/marketing/home-marketing-features-stack").then((m) => ({ default: m.HomeMarketingFeaturesStack })),
  { ssr: false, loading: () => <div className="min-h-[200px]" aria-hidden /> },
);

const HomeMarketingProductProof = dynamic(
  () => import("@/components/marketing/home-marketing-product-proof").then((m) => ({ default: m.HomeMarketingProductProof })),
  { ssr: false, loading: () => <div className="min-h-[400px]" aria-hidden /> },
);

const HeroPlatformStats = dynamic(() => import("@/legacy/marketing/hero-platform-stats"), {
  ssr: false,
  loading: () => <div className="min-h-[300px]" />,
});
const HeroFeatureStrip = dynamic(() => import("@/legacy/marketing/hero-feature-strip"), {
  ssr: false,
  loading: () => <div className="min-h-[60px]" />,
});
const HeroTrustIndicator = dynamic(() => import("@/legacy/marketing/hero-trust-indicator"), {
  ssr: false,
  loading: () => <div className="min-h-[50px]" />,
});
const HeroExpansionTracker = dynamic(() => import("@/legacy/marketing/hero-expansion-tracker"), {
  ssr: false,
  loading: () => <div className="min-h-[300px]" />,
});
const HeroGlobalCoverage = dynamic(() => import("@/legacy/marketing/hero-global-coverage"), {
  ssr: false,
  loading: () => <div className="min-h-[300px]" />,
});
const HeroNursingTiers = dynamic(() => import("@/legacy/marketing/hero-nursing-tiers"), {
  ssr: false,
  loading: () => <div className="min-h-[400px]" />,
});
const HeroCertifications = dynamic(() => import("@/legacy/marketing/hero-certifications"), {
  ssr: false,
  loading: () => <div className="min-h-[300px]" />,
});
const HeroAlliedHealth = dynamic(() => import("@/legacy/marketing/hero-allied-health"), {
  ssr: false,
  loading: () => <div className="min-h-[400px]" />,
});
const HomeDifferentiation = dynamic(() => import("@/legacy/marketing/home-differentiation"), {
  ssr: false,
  loading: () => <div className="min-h-[600px]" />,
});
const HomeConversionSections = dynamic(() => import("@/legacy/marketing/home-conversion-sections"), {
  ssr: false,
  loading: () => <div className="min-h-[400px]" />,
});
const HomeCareerCta = dynamic(() => import("@/legacy/marketing/home-career-cta"), {
  ssr: false,
  loading: () => <div className="min-h-[200px]" />,
});
const HomeBottomSections = dynamic(() => import("@/legacy/marketing/home-bottom-sections"), {
  ssr: false,
  loading: () => <div className="min-h-[800px]" />,
});

/** Comma-separated counts from `GET /api/public/home-stats` (exact aggregates, marketing scope). */
function formatStatExact(n: number | undefined, locale: string): string {
  if (n === undefined || n <= 0) return "";
  return n.toLocaleString(locale.replace(/_/g, "-"));
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

export default function HomeRestoredClient({ lessonTeasers }: HomeRestoredClientProps) {
  const { t, locale } = useMarketingI18n();
  const { region, setRegion } = useNursenestRegion();
  const [homeStats, setHomeStats] = useState<HomeStatsPayload | null>(null);

  const heroSlides = useMemo(() => buildHomepageHeroSlides(t), [t]);
  /** When false, hero is single-column; media is omitted (no `hidden` placeholder delaying layout). */
  const showHeroMediaColumn = heroSlides.length > 0;

  const heroPathwayLinks = useMemo(() => heroPathwayEntryLinks(region), [region]);

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
        setHomeStats(d);
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

  const lessonCount = homeStats?.totalLessons ?? 0;
  const questionCount = homeStats?.questionCount ?? 0;
  const flashcardCount = homeStats?.totalFlashcards ?? 0;
  const deckCount = homeStats?.totalDecks ?? 0;
  const storeProductCount = homeStats?.storeProductCount ?? 0;
  const registeredLearners = homeStats?.registeredLearners;

  const heroPlatformStatsPayload = useMemo((): HeroPlatformStatsPayload | null => {
    if (!homeStats) return null;
    return {
      totalLessons: homeStats.totalLessons ?? 0,
      questionCount: homeStats.questionCount ?? 0,
      totalFlashcards: homeStats.totalFlashcards ?? 0,
      totalDecks: homeStats.totalDecks ?? 0,
      scenarioCount: homeStats.scenarioCount,
      registeredLearners: homeStats.registeredLearners,
    };
  }, [homeStats]);

  const trustStatsFormatted = useMemo(
    () => ({
      questions: formatStatExact(questionCount, locale),
      flashcards: formatStatExact(flashcardCount, locale),
      lessons: formatStatExact(lessonCount, locale),
      learners: formatStatExact(registeredLearners, locale),
    }),
    [questionCount, flashcardCount, lessonCount, registeredLearners, locale],
  );

  return (
    <div className="font-sans md:animate-page-enter flex min-h-screen flex-col overflow-x-hidden bg-[var(--theme-page-bg)]">
      <div className="flex-grow overflow-x-hidden">
        <section
          className="relative overflow-hidden pt-0"
          style={{ paddingTop: "var(--space-hero-top)", paddingBottom: "var(--space-hero-bottom)" }}
          data-testid="hero-section"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`grid items-start gap-3 md:gap-4 lg:gap-6 ${showHeroMediaColumn ? "md:grid-cols-[1fr_1.08fr]" : "md:grid-cols-1"}`}
            >
              <div className="hero-motion-enter min-w-0 max-w-[min(100%,46rem)] space-y-4 md:space-y-5">
                <div
                  className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-inset)] px-3 py-1.5 text-[11px] font-semibold leading-snug text-[var(--theme-heading-text)] sm:text-sm"
                  data-testid="badge-trust-micro"
                >
                  <span>{t("home.hero.trustMicroBadge")}</span>
                  <span className="text-[var(--theme-muted-text)]" aria-hidden="true">
                    ·
                  </span>
                  <span>{t("home.hero.authorityBadge")}</span>
                </div>

                <div className="space-y-3">
                  <h1
                    className="text-balance font-bold leading-[1.06] tracking-tight text-[var(--theme-heading-text)]"
                    style={{ fontSize: "var(--text-hero)" }}
                    data-testid="text-hero-heading"
                  >
                    {t("home.hero.mainTitle")}
                  </h1>

                  <p
                    className="text-pretty max-w-[52ch] text-base leading-relaxed text-[var(--theme-body-text)] md:text-lg"
                    data-testid="text-hero-subheading"
                  >
                    {t("home.hero.newSubheadline")}
                  </p>
                </div>

                <div
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-sm"
                  data-testid="region-toggle-hero"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">{t("nav.regionLabel")}</span>
                  <div className="inline-flex rounded-lg border border-[var(--theme-input-border)] bg-[var(--theme-card-bg)] p-0.5">
                    <button
                      type="button"
                      onClick={() => setRegion("US")}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold sm:px-3 sm:text-sm ${
                        region === "US"
                          ? "bg-[var(--surface-selected)] text-[var(--theme-heading-text)] ring-1 ring-[var(--border-medium)]"
                          : "text-[var(--theme-muted-text)] hover:text-[var(--theme-body-text)]"
                      }`}
                      data-testid="button-region-us"
                    >
                      <span className="mr-1" role="img" aria-label={t("pages.home.usFlag")}>
                        🇺🇸
                      </span>
                      {t("home.region.us")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegion("CA")}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold sm:px-3 sm:text-sm ${
                        region === "CA"
                          ? "bg-[var(--surface-selected)] text-[var(--theme-heading-text)] ring-1 ring-[var(--border-medium)]"
                          : "text-[var(--theme-muted-text)] hover:text-[var(--theme-body-text)]"
                      }`}
                      data-testid="button-region-ca"
                    >
                      <span className="mr-1" role="img" aria-label={t("pages.home.canadianFlag")}>
                        🇨🇦
                      </span>
                      {t("home.region.ca")}
                    </button>
                  </div>
                  <div className="flex min-w-0 flex-1 items-start gap-1.5 text-xs text-[var(--theme-body-text)] sm:justify-end">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span className="leading-snug">{region === "US" ? t("home.region.usDesc") : t("home.region.caDesc")}</span>
                  </div>
                </div>

                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <MarketingTrackedLink
                    href="/signup"
                    event={PH.marketingHomeHeroPrimaryCta}
                    eventProps={{ region }}
                    className="nn-btn-primary inline-flex min-h-[48px] w-full items-center justify-center px-8 py-3 text-base font-semibold transition-[filter] hover:bg-role-cta-hover sm:min-h-[52px] sm:w-auto sm:px-10 sm:text-lg"
                    data-testid="button-hero-start-free"
                  >
                    {t("home.hero.ctaPrimary")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </MarketingTrackedLink>
                  <MarketingTrackedLink
                    href={withMarketingLocale(locale, rnQuestions(region))}
                    event={PH.marketingHomeHeroSecondaryCta}
                    eventProps={{ region, destination: "rn_questions" }}
                    className="nn-btn-secondary inline-flex min-h-[48px] w-full items-center justify-center px-6 py-3 text-sm font-semibold sm:min-h-[52px] sm:w-auto sm:px-7 sm:text-base"
                    data-testid="button-hero-browse"
                  >
                    <BookOpen className="mr-2 h-4 w-4 text-[var(--theme-muted-text)]" />
                    {t("home.hero.ctaSecondary")}
                  </MarketingTrackedLink>
                </div>

                <div className="space-y-2.5" data-testid="hero-quick-entry-links">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">{t("home.hero.quickEntryLabel")}</p>
                  <div className="flex flex-wrap gap-x-1 gap-y-1 sm:gap-x-3">
                    {heroPathwayLinks.map((item, i) => {
                      const label = t(item.labelKey);
                      return (
                        <span key={item.labelKey} className="inline-flex items-center">
                          {i > 0 ? (
                            <span className="mr-1 hidden text-[var(--theme-muted-text)] sm:mr-3 sm:inline" aria-hidden>
                              ·
                            </span>
                          ) : null}
                          <MarketingTrackedLink
                            href={withMarketingLocale(locale, item.href)}
                            event={PH.marketingHomeQuickEntryClick}
                            eventProps={{ region, link_label: label }}
                            className="nn-link-quiet text-xs sm:text-sm"
                          >
                            {label}
                          </MarketingTrackedLink>
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-xs text-[var(--theme-muted-text)]">
                    <MarketingTrackedLink
                      href={withMarketingLocale(locale, "/tools")}
                      event={PH.marketingHomeQuickEntryClick}
                      eventProps={{ region, link_label: "study_tools" }}
                      className="nn-link-quiet text-xs sm:text-sm"
                    >
                      {t("home.quickEntry.studyTools")}
                    </MarketingTrackedLink>
                  </p>
                </div>

                <p className="text-xs text-[var(--theme-body-text)] sm:text-sm" data-testid="text-urgency-microcopy">
                  {t("home.hero.urgencyMicrocopy")}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--theme-body-text)] sm:text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="nn-trust-mark h-3.5 w-3.5 shrink-0" aria-hidden />
                    {t("home.hero.noCreditCard")}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Shield className="nn-trust-mark h-3.5 w-3.5 shrink-0" aria-hidden />
                    {t("home.hero.guarantee")}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="nn-trust-mark h-3.5 w-3.5 shrink-0" aria-hidden />
                    {t("home.hero.cancelAnytime")}
                  </span>
                </div>

                <p className="text-[11px] font-medium text-[var(--theme-muted-text)] sm:text-xs" data-testid="text-trust-tagline">
                  {t("home.hero.trustPassRate")}
                </p>
                <p className="text-xs leading-relaxed text-[var(--theme-body-text)] sm:text-sm" data-testid="hero-trust-indicators">
                  {trustStatsFormatted.questions
                    ? `${trustStatsFormatted.questions} ${t("home.hero.trustQuestionsLabel")}`
                    : t("home.hero.trustQuestions")}
                  <span className="mx-1.5 text-[var(--theme-muted-text)]" aria-hidden="true">
                    ·
                  </span>
                  {trustStatsFormatted.flashcards
                    ? `${trustStatsFormatted.flashcards} ${t("home.hero.trustFlashcardsLabel")}`
                    : t("home.hero.trustFlashcards")}
                  <span className="mx-1.5 text-[var(--theme-muted-text)]" aria-hidden="true">
                    ·
                  </span>
                  {trustStatsFormatted.lessons
                    ? `${trustStatsFormatted.lessons} ${t("home.hero.trustLessonsLabel")}`
                    : t("home.hero.trustLessons")}
                  <span className="mx-1.5 text-[var(--theme-muted-text)]" aria-hidden="true">
                    ·
                  </span>
                  {trustStatsFormatted.learners
                    ? `${trustStatsFormatted.learners} ${t("home.hero.trustLearnersLabel")}`
                    : t("home.hero.trustStudents")}
                </p>
              </div>

              {showHeroMediaColumn ? (
                <HomeHeroMediaPanel slides={heroSlides} primaryIndex={0} secondaryIndices={[1, 2]} />
              ) : null}
            </div>

            <HomePageHeroTail />
          </div>
        </section>

        <HomePageMidSections lessonTeasers={lessonTeasers} />

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
            <HeroPlatformStats stats={heroPlatformStatsPayload} />
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
            className="inline-flex items-center gap-2 text-sm text-[var(--theme-muted-text)] transition-colors hover:text-[var(--theme-heading-text)]"
            data-testid="link-home-languages"
          >
            <span aria-hidden="true">🌐</span>
            <span>{t("pages.home.availableIn20LanguagesStudy")}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
