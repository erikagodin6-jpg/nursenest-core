import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  BookOpen,
  FileText,
  Target,
  TrendingUp,
  Sparkles,
  Lightbulb,
  Brain,
} from "lucide-react";
import { ExplanationPromoBanner } from "@/components/explanation-panel";

import { useI18n } from "@/lib/i18n";
interface ScreenshotSources {
  srcSet: string;
  thumbSrcSet: string;
  fallback: string;
  thumbFallback: string;
  width: number;
  height: number;
}

function getScreenshotSources(name: string, origWidth: number, origHeight: number): ScreenshotSources {

  const base = `/screenshots/${name}`;
  return {
    srcSet: `${base}-480w.webp 480w, ${base}-768w.webp 768w, ${base}-1200w.webp 1200w, ${base}-full.webp ${origWidth}w`,
    thumbSrcSet: `${base}-thumb-160w.webp 160w, ${base}-thumb-240w.webp 240w`,
    fallback: `${base}-768w.webp`,
    thumbFallback: `${base}-thumb-160w.webp`,
    width: origWidth,
    height: origHeight,
  };
}

const screenshotData: Record<string, ScreenshotSources> = {
  screenshot2: getScreenshotSources("screenshot2_1773379293573", 2730, 1588),
  screenshot9: getScreenshotSources("screenshot9_1773379293573", 2282, 1186),
  screenshotTest: getScreenshotSources("screenshottest_1773379293573", 2048, 1590),
  screenshot6: getScreenshotSources("screenshot6_1773379293573", 2524, 1448),
  screenshot11: getScreenshotSources("screenshot11_1773379293573", 2510, 1588),
  screenshot3: getScreenshotSources("screenshot3_1773379293573", 2528, 1602),
  screenshot5: getScreenshotSources("screenshot5_1773379293573", 2538, 1610),
  screenshot10: getScreenshotSources("screenshot10_1773379293573", 2264, 1580),
};

const showcaseItems = [
  {
    id: "adaptive-performance",
    imageKey: "screenshot2" as const,
    title: "See exactly where you stand",
    blurb: "Real-time readiness insights help learners identify strengths, weak areas, and their most important next steps before exam day.",
    tags: ["Readiness Score", "Pass Probability", "Growth Tracking"],
  },
  {
    id: "ngn-case-study",
    imageKey: "screenshot9" as const,
    title: "Strengthen clinical judgment",
    blurb: "Interactive case studies help learners connect patient data, prioritization, and nursing decision-making in a realistic workflow.",
    tags: ["Bowtie", "NGN", "Clinical Judgment"],
  },
  {
    id: "exam-style-questions",
    imageKey: "screenshotTest" as const,
    title: "Get comfortable with exam-style practice",
    blurb: "Students can practice realistic nursing questions with clean exam-style layouts, timed sets, and focused rationale review.",
    tags: ["Multiple Choice", "SATA", "Exam Mode"],
  },
  {
    id: "flashcard-mastery",
    imageKey: "screenshot6" as const,
    title: "Improve retention with spaced repetition",
    blurb: "Smart flashcard tracking helps learners review high-yield concepts, strengthen memory, and stay consistent over time.",
    tags: ["Retention", "Review Queue", "Mastery"],
  },
  {
    id: "study-plan",
    imageKey: "screenshot11" as const,
    title: "Follow a plan built around your performance",
    blurb: "Personalized weekly study plans turn weak areas into structured action steps so learners know exactly what to do next.",
    tags: ["Weekly Plan", "Focus Areas", "Readiness Goal"],
  },
  {
    id: "category-performance",
    imageKey: "screenshot3" as const,
    title: "Target weak areas faster",
    blurb: "Domain-level breakdowns help students focus their study time on the content areas that will improve scores the most.",
    tags: ["Pharmacology", "Prioritization", "Fundamentals"],
  },
  {
    id: "session-analysis",
    imageKey: "screenshot5" as const,
    title: "Review every readiness check in detail",
    blurb: "Session analytics show score trends, percentile performance, confidence patterns, and category-level results after each adaptive set.",
    tags: ["Session Review", "Confidence Analysis", "Percentile"],
  },
  {
    id: "progress-comparison",
    imageKey: "screenshot10" as const,
    title: "Watch your improvement over time",
    blurb: "Comparison views make it easy to see growth across sessions, identify recurring problem areas, and stay motivated.",
    tags: ["Score Trends", "Improvement", "Progress"],
  },
];

const trustBullets = [
  "Adaptive readiness tracking",
  "NGN and SATA-style practice",
  "Flashcards, rationales, and study plans",
  "Built for real nursing exam prep",
];

const proofBadges = [
  { icon: BarChart3, label: "Adaptive Analytics" },
  { icon: Target, label: "Personalized Study Plans" },
  { icon: Lightbulb, label: "Detailed Rationales" },
  { icon: FileText, label: "Exam-Style Practice" },
];

const socialProofCards = [
  { icon: BarChart3, text: "Adaptive reports that highlight weak areas" },
  { icon: Target, text: "Study plans that turn insights into action" },
  { icon: Brain, text: "Rationales that teach clinical thinking" },
  { icon: BookOpen, text: "Practice modes designed for modern nursing exams" },
];

export function HeroProofShowcase() {
  const [, setLocation] = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === activeIndex) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex(index);
        setIsTransitioning(false);
      }, 200);
    },
    [isTransitioning, activeIndex],
  );

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % showcaseItems.length);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + showcaseItems.length) % showcaseItems.length);
  }, [activeIndex, goTo]);

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (thumbnailStripRef.current) {
      const thumb = thumbnailStripRef.current.children[activeIndex] as HTMLElement;
      if (thumb) {
        const container = thumbnailStripRef.current;
        const thumbLeft = thumb.offsetLeft;
        const thumbWidth = thumb.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollTarget = thumbLeft - containerWidth / 2 + thumbWidth / 2;
        container.scrollTo({ left: scrollTarget, behavior: "smooth" });
      }
    }
  }, [activeIndex]);

  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = (activeIndex + 1) % showcaseItems.length;
        goTo(next);
        const strip = thumbnailStripRef.current;
        if (strip) (strip.children[next] as HTMLElement)?.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = (activeIndex - 1 + showcaseItems.length) % showcaseItems.length;
        goTo(prev);
        const strip = thumbnailStripRef.current;
        if (strip) (strip.children[prev] as HTMLElement)?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
        const strip = thumbnailStripRef.current;
        if (strip) (strip.children[0] as HTMLElement)?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        const last = showcaseItems.length - 1;
        goTo(last);
        const strip = thumbnailStripRef.current;
        if (strip) (strip.children[last] as HTMLElement)?.focus();
      }
    },
    [activeIndex, goTo],
  );

  const current = showcaseItems[activeIndex];
  const currentSrc = screenshotData[current.imageKey];

  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
      data-testid="section-hero-proof-showcase"
    >
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[-8%] w-[400px] h-[400px] rounded-full bg-purple-100/30 blur-[80px]" />
        <div className="absolute bottom-[5%] left-[-5%] w-[350px] h-[350px] rounded-full bg-blue-100/20 blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50/80 border border-purple-200/40 shadow-[var(--shadow-card)]">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                Platform Preview
              </span>
            </div>

            <h2
              className="font-bold text-gray-900 leading-tight tracking-tight"
              style={{ fontSize: 'var(--text-section)' }}
              data-testid="text-proof-headline"
            >
              Adaptive nursing practice that feels like the real exam
            </h2>

            <p
              className="text-base lg:text-lg text-gray-500 leading-relaxed"
              data-testid="text-proof-subheadline"
            >
              Strengthen weak areas, build confidence, and track readiness with realistic questions, flashcards, case studies, analytics, and personalized study plans.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="h-13 sm:h-14 px-7 sm:px-9 text-base sm:text-lg rounded-full bg-primary hover:brightness-110 shadow-[var(--shadow-elevated)] shadow-primary/25 transition-all hover:-translate-y-0.5 text-white w-full sm:w-auto font-semibold"
                onClick={() => setLocation("/register")}
                data-testid="button-proof-start-practicing"
              >
                Start Practicing
                <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 sm:h-14 px-7 sm:px-9 text-base sm:text-lg rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 bg-white w-full sm:w-auto font-medium"
                onClick={() => {
                  const el = document.getElementById("how-it-works");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                data-testid="button-proof-see-how"
              >
                See How It Works
              </Button>
            </div>

            <ul className="space-y-3 pt-1">
              {trustBullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 pt-1">
              {proofBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-gray-100 shadow-[var(--shadow-card)] text-xs font-medium text-gray-600"
                  data-testid={`badge-proof-${badge.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <badge.icon className="w-3.5 h-3.5 text-purple-400" />
                  {badge.label}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="relative group">
              <div
                className="relative rounded-2xl overflow-hidden bg-white shadow-[var(--shadow-elevated)] border border-gray-100/80"
                role="tabpanel"
                id={`proof-tabpanel-${current.id}`}
                aria-labelledby={`proof-tab-${current.id}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
                  <img
                    srcSet={currentSrc.srcSet}
                    sizes="(max-width: 640px) 480px, (max-width: 1024px) 768px, 1200px"
                    src={currentSrc.fallback}
                    alt={current.title}
                    width={currentSrc.width}
                    height={currentSrc.height}
                    className={`w-full h-full object-cover object-top transition-opacity duration-200 ${
                      isTransitioning ? "opacity-0" : "opacity-100"
                    }`}
                    loading={activeIndex === 0 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={activeIndex === 0 ? "high" : undefined}
                    data-testid="img-proof-featured"
                  />

                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-[var(--shadow-card)] border border-gray-100/80 hidden sm:flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-bold text-gray-700">{t("components.heroProofShowcase.8Improvement")}</span>
                  </div>
                </div>

                <button
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-[var(--shadow-card)] border border-gray-100 flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label={t("components.heroProofShowcase.previousScreenshot")}
                  data-testid="button-proof-prev"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-[var(--shadow-card)] border border-gray-100 flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label={t("components.heroProofShowcase.nextScreenshot")}
                  data-testid="button-proof-next"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="mt-5 px-1">
                <h3
                  className="font-bold text-gray-900" style={{ fontSize: 'var(--text-card-title)' }}
                  data-testid="text-proof-screenshot-title"
                >
                  {current.title}
                </h3>
                <p
                  className="text-sm text-gray-500 mt-1.5 leading-relaxed"
                  data-testid="text-proof-screenshot-blurb"
                >
                  {current.blurb}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-purple-50/80 text-purple-600 border border-purple-100/60"
                      data-testid={`tag-proof-${tag.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              ref={thumbnailStripRef}
              className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent -mx-1 px-1 snap-x snap-mandatory"
              role="tablist"
              aria-label={t("components.heroProofShowcase.screenshotThumbnails")}
              onKeyDown={handleTabKeyDown}
            >
              {showcaseItems.map((item, idx) => {
                const thumbSrc = screenshotData[item.imageKey];
                return (
                  <button
                    key={item.id}
                    onClick={() => goTo(idx)}
                    role="tab"
                    aria-selected={idx === activeIndex}
                    aria-controls={`proof-tabpanel-${item.id}`}
                    id={`proof-tab-${item.id}`}
                    tabIndex={idx === activeIndex ? 0 : -1}
                    aria-label={`View ${item.title}`}
                    className={`shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 snap-start ${
                      idx === activeIndex
                        ? "border-primary ring-2 ring-primary/20 shadow-[var(--shadow-card)] scale-105"
                        : "border-gray-200 hover:border-primary/30 opacity-70 hover:opacity-100"
                    }`}
                    data-testid={`thumb-proof-${item.id}`}
                  >
                    <img
                      src={thumbSrc.thumbFallback}
                      srcSet={thumbSrc.thumbSrcSet}
                      sizes="80px"
                      alt={item.title}
                      width={80}
                      height={56}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-12 max-w-2xl mx-auto" data-testid="text-proof-microcopy">
          From readiness analytics to NGN case studies, NurseNest shows students exactly what to
          study next.
        </p>

        <div className="max-w-3xl mx-auto mt-10">
          <ExplanationPromoBanner variant="compact" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {socialProofCards.map((card) => (
            <div
              key={card.text}
              className="flex items-start gap-3.5 p-5 rounded-2xl bg-white border border-gray-100/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200"
              data-testid={`card-social-proof-${card.text.slice(0, 20).toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50/80 flex items-center justify-center shrink-0">
                <card.icon className="w-4.5 h-4.5 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
