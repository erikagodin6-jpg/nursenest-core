"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, Suspense } from "react";
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
import { HOMEPAGE_HERO_SLIDES } from "@/lib/marketing-assets";
import {
  getMarketingHeroImageUrlChain,
  MARKETING_HERO_LOCAL_FALLBACK,
} from "@/lib/marketing-hero-image";

const HeroFeatureStrip = dynamic(() => import("@/legacy/marketing/hero-feature-strip"), {
  loading: () => <div className="min-h-[60px]" />,
});
const HeroTrustIndicator = dynamic(() => import("@/legacy/marketing/hero-trust-indicator"), {
  loading: () => <div className="min-h-[50px]" />,
});
const HomeHeroFeatures = dynamic(() => import("@/legacy/marketing/home-hero-features"), {
  loading: () => <div className="min-h-[200px]" />,
});
const HeroPlatformStats = dynamic(() => import("@/legacy/marketing/hero-platform-stats"), {
  loading: () => <div className="min-h-[300px]" />,
});
const HomeChoosePath = dynamic(() => import("@/legacy/marketing/home-choose-path"), {
  loading: () => <div className="min-h-[280px]" />,
});
const HeroFeaturesGrid = dynamic(() => import("@/legacy/marketing/hero-features-grid"), {
  loading: () => <div className="min-h-[400px]" />,
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

function HeroCarousel({ onMediaUnavailable }: { onMediaUnavailable?: () => void }) {
  const slides = HOMEPAGE_HERO_SLIDES;
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  const failedRef = useRef(failed);
  /** 0 = direct CDN; 1 = local SVG fallback (`getHeroSlideSrc`). */
  const [heroTierByIndex, setHeroTierByIndex] = useState<Record<number, number>>({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unavailableReported = useRef(false);

  useEffect(() => {
    failedRef.current = failed;
  }, [failed]);

  const validCount = slides.length - failed.size;
  const currentSlide = slides[current];

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length === 0) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const f = failedRef.current;
        for (let step = 1; step <= slides.length; step++) {
          const idx = (prev + step) % slides.length;
          if (!f.has(idx)) return idx;
        }
        return prev;
      });
    }, 5000);
  }, [slides.length]);

  useEffect(() => {
    if (!hasLoaded || validCount === 0) return;
    if (!isHovered) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, startTimer, hasLoaded, validCount, slides.length]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    if (slides.length === 0 || !failed.has(current)) return;
    for (let step = 0; step < slides.length; step++) {
      const idx = (current + step) % slides.length;
      if (!failed.has(idx)) {
        setCurrent(idx);
        return;
      }
    }
  }, [failed, current, slides.length]);

  useLayoutEffect(() => {
    if (slides.length === 0) return;
    if (validCount > 0) return;
    if (!unavailableReported.current) {
      unavailableReported.current = true;
      onMediaUnavailable?.();
    }
  }, [validCount, slides.length, onMediaUnavailable]);

  const handleImgError = useCallback((index: number) => {
    setFailed((prev) => new Set(prev).add(index));
  }, []);

  const handleImgLoad = useCallback(() => {
    setHasLoaded(true);
  }, []);

  if (validCount === 0) {
    return (
      <div className="relative w-full min-w-0" data-testid="hero-carousel-fallback">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] shadow-[var(--shadow-elevated)]">
          <img
            src={MARKETING_HERO_LOCAL_FALLBACK}
            alt=""
            width={1200}
            height={750}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    );
  }

  const mediaOk = validCount > 0;

  return (
    <div
      className="relative w-full min-w-0 min-h-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="hero-carousel"
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] shadow-[var(--shadow-elevated)]"
        style={{ overflowAnchor: "none" }}
        aria-busy={!hasLoaded && mediaOk}
      >
        {!hasLoaded && mediaOk ? (
          <div
            className="absolute inset-0 animate-pulse bg-gradient-to-br from-[var(--theme-separator)] via-[var(--theme-muted-surface)] to-[var(--theme-input-border)]"
            aria-hidden
          />
        ) : null}
        {slides.map((slide, index) => {
          if (failed.has(index)) return null;
          const chain = getMarketingHeroImageUrlChain({
            objectKey: slide.objectKey,
            publicCdnUrl: slide.publicUrl,
          });
          const tier = Math.min(heroTierByIndex[index] ?? 0, chain.length - 1);
          const src = chain[tier];
          const active = index === current;
          return (
            <img
              key={`${slide.objectKey}-${tier}`}
              src={src}
              alt={slide.alt}
              width={1200}
              height={750}
              decoding={index === 0 ? "sync" : "async"}
              className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out will-change-[opacity] ${
                active ? "opacity-100" : "opacity-0"
              }`}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "low"}
              data-testid={`img-hero-slide-${index}`}
              aria-hidden={!active}
              referrerPolicy="no-referrer"
              onError={() => {
                console.error("[hero-carousel] image failed", { index, tier, src, objectKey: slide.objectKey, chain });
                if (tier < chain.length - 1) {
                  setHeroTierByIndex((prev) => ({ ...prev, [index]: tier + 1 }));
                  return;
                }
                handleImgError(index);
              }}
              onLoad={handleImgLoad}
            />
          );
        })}
      </div>
      {hasLoaded && mediaOk ? (
        <>
          {currentSlide ? (
            <div className="mt-3 space-y-1 text-center px-1" data-testid="hero-carousel-caption">
              <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{currentSlide.title}</p>
              <p className="text-xs leading-relaxed text-[var(--theme-body-text)]">{currentSlide.caption}</p>
            </div>
          ) : null}
          <div className="mt-3 flex flex-wrap justify-center gap-2" data-testid="hero-carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                disabled={failed.has(index)}
                onClick={() => {
                  if (!failed.has(index)) setCurrent(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current ? "w-6 bg-primary" : "w-2 bg-[var(--theme-muted-text)]/35 hover:bg-[var(--theme-muted-text)]/55"
                } ${failed.has(index) ? "cursor-not-allowed opacity-40" : ""}`}
                aria-label={`Go to slide ${index + 1}`}
                data-testid={`button-carousel-dot-${index}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function formatCount(n: number | undefined): string {
  if (n === undefined || n === 0) return "---";
  if (n < 10) return `${n}`;
  if (n >= 1000) {
    const hundreds = Math.floor(n / 100) * 100;
    return `${hundreds.toLocaleString()}+`;
  }
  const tens = Math.floor(n / 10) * 10;
  return `${tens}+`;
}

/**
 * Restored from `client/src/pages/home.tsx` (structure, classes, i18n keys).
 * Navigation/footer remain in root layout; below-fold sections use legacy copies + dynamic import.
 */
type HomeStatsPayload = {
  totalLessons: number;
  questionCount: number;
  totalFlashcards: number;
  totalDecks: number;
  storeProductCount: number;
};

export default function HomeRestoredClient() {
  const { t, locale } = useMarketingI18n();
  const { region, setRegion } = useNursenestRegion();
  const [lessonCount, setLessonCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [storeProductCount, setStoreProductCount] = useState(0);
  const [flashcardCount, setFlashcardCount] = useState(10_000);
  const [heroMediaVisible, setHeroMediaVisible] = useState(() => HOMEPAGE_HERO_SLIDES.length > 0);

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
              className={`grid items-center gap-8 md:items-start md:gap-10 lg:gap-12 ${heroMediaVisible ? "md:grid-cols-2" : "md:grid-cols-1"}`}
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
                      className="flex items-start gap-2.5 rounded-xl border border-[var(--theme-card-border)] bg-card p-3 shadow-[var(--shadow-card)]"
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
                  <Link
                    href="/signup"
                    className="shadow-primary/25 flex min-h-[52px] w-full items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-white shadow-[var(--shadow-elevated)] transition-transform hover:-translate-y-0.5 hover:brightness-110 sm:min-h-[56px] sm:w-auto sm:px-9 sm:text-lg"
                    data-testid="button-hero-start-free"
                  >
                    {t("home.hero.ctaPrimary")}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                  <Link
                    href={mapLegacyMarketingHref("/exam-prep")}
                    className="flex min-h-[52px] w-full items-center justify-center rounded-full border border-[var(--theme-input-border)] bg-card px-7 py-3 text-base font-medium text-[var(--theme-body-text)] hover:border-[color-mix(in_srgb,var(--theme-primary)_22%,var(--theme-input-border))] hover:bg-[var(--theme-muted-surface)] sm:min-h-[56px] sm:w-auto sm:px-9 sm:text-lg"
                    data-testid="button-hero-browse"
                  >
                    <BookOpen className="mr-2 h-4 w-4 text-primary sm:h-5 sm:w-5" />
                    {t("home.hero.ctaSecondary")}
                  </Link>
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
                    <span data-testid="text-trust-students">{t("home.hero.trustStudents")}</span>
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
                className={heroMediaVisible ? "relative hidden min-w-0 md:block" : "hidden"}
                style={{ overflowAnchor: "none" }}
              >
                <HeroCarousel onMediaUnavailable={() => setHeroMediaVisible(false)} />
                <div className="absolute -bottom-5 -left-5 z-10 flex items-center gap-3 rounded-2xl border border-[var(--theme-card-border)]/80 bg-card px-5 py-3.5 shadow-[var(--shadow-card-hover)]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--theme-heading-text)]">{t("home.hero.passRate")}</div>
                    <div className="text-xs text-[var(--theme-body-text)]">{t("home.hero.firstAttempt")}</div>
                  </div>
                </div>
                <div className="absolute -right-3 -top-3 z-10 flex items-center gap-2 rounded-2xl border border-[var(--theme-card-border)]/80 bg-card px-4 py-2.5 shadow-[var(--shadow-card-hover)]">
                  <div className="flex -space-x-1.5">
                    {["bg-primary/60", "bg-primary/45", "bg-primary/70"].map((bg, i) => (
                      <div
                        key={bg}
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white ${bg}`}
                      >
                        {["P", "J", "A"][i]}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[var(--theme-body-text)]">{t("home.hero.studentCount")}</span>
                </div>
                <div
                  className="nn-accent-soft-ring pointer-events-none absolute -bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 shadow-sm"
                  data-testid="badge-students-studying"
                >
                  <div className="flex -space-x-1">
                    {["bg-primary/55", "bg-primary/40", "bg-primary/65"].map((bg) => (
                      <div key={bg} className={`h-4 w-4 rounded-full border-[1.5px] border-white ${bg}`} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-primary">{t("home.hero.studentsStudying")}</span>
                </div>
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
          className="border-t border-[var(--theme-card-border)] bg-[var(--theme-card-bg)]"
          style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
          data-testid="section-explore-hubs"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-base font-bold text-[var(--theme-heading-text)] sm:text-lg">
              Exam prep hubs & resources
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--theme-muted-text)]">
              Deep guides for RN, PN, and NP pathways—plus tools and pricing when you are ready to start studying.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  { href: "/nclex-rn-practice-questions", label: "NCLEX-RN practice questions" },
                  { href: "/rex-pn-practice-questions", label: "REx-PN & NCLEX-PN prep" },
                  { href: "/np-exam-practice-questions", label: "NP exam prep" },
                  { href: "/tools", label: "Clinical tools" },
                  { href: "/blog", label: "Blog & study guides" },
                  { href: "/pricing", label: "Plans & pricing" },
                ] as const
              ).map((item) => (
                <li key={item.href}>
                  <Link
                    href={withMarketingLocale(locale, item.href)}
                    className="flex items-center justify-between rounded-xl border border-[var(--theme-card-border)] bg-card px-4 py-3 text-sm font-medium text-[var(--theme-heading-text)] shadow-sm transition hover:border-primary/30 hover:bg-[var(--theme-muted-surface)]"
                  >
                    {item.label}
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

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
            <HomeHeroFeatures />
          </Suspense>
        </LazySection>

        <LazySection minHeight="300px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <HeroPlatformStats />
          </Suspense>
        </LazySection>

        <LazySection minHeight="280px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[280px]" />}>
            <HomeChoosePath />
          </Suspense>
        </LazySection>

        <LazySection minHeight="400px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <HeroFeaturesGrid />
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
            <HomeConversionSections lessonCount={lessonCount} questionCount={questionCount} />
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
