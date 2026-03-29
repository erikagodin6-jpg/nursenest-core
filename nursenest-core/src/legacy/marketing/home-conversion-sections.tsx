"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { MARKETING_SCREENSHOT_SOURCES, resolveMarketingSrcSet } from "@/lib/marketing-assets";
import {
  getMarketingHeroImageUrlChain,
  objectKeyFromPublicCdnUrl,
} from "@/lib/marketing-hero-image";
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
  ChevronLeft,
  ChevronRight,
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

  if (n === undefined || n === 0) return "---";
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

interface ScreenshotSources {
  srcSet: string;
  thumbSrcSet: string;
  fallback: string;
  thumbFallback: string;
  width: number;
  height: number;
}

const screenshotData: Record<string, ScreenshotSources> = MARKETING_SCREENSHOT_SOURCES;

const screenshotItems = [
  { id: "adaptive-performance", imageKey: "screenshot2", title: "See exactly where you stand", blurb: "Real-time readiness insights help learners identify strengths, weak areas, and next steps." },
  { id: "ngn-case-study", imageKey: "screenshot9", title: "Strengthen clinical judgment", blurb: "Interactive case studies connect patient data, prioritization, and nursing decision-making." },
  { id: "exam-style-questions", imageKey: "screenshotTest", title: "Exam-style practice", blurb: "Realistic nursing questions with timed sets and detailed rationale review." },
  { id: "flashcard-mastery", imageKey: "screenshot6", title: "Spaced repetition flashcards", blurb: "Smart flashcard tracking helps review high-yield concepts and strengthen memory." },
  { id: "study-plan", imageKey: "screenshot11", title: "Personalized study plans", blurb: "Weekly plans turn weak areas into structured action steps." },
  { id: "category-performance", imageKey: "screenshot3", title: "Target weak areas faster", blurb: "Domain-level breakdowns help focus study time where it matters most." },
  { id: "session-analysis", imageKey: "screenshot5", title: "Detailed session analytics", blurb: "Score trends, percentile performance, and category-level results." },
  { id: "progress-comparison", imageKey: "screenshot10", title: "Track improvement over time", blurb: "Comparison views show growth across sessions and recurring problem areas." },
];

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
    { icon: Target, value: formatMarketingCount(questions), label: "Practice Questions" },
    { icon: Layers, value: formatMarketingCount(flashcards), label: "Flashcards" },
    { icon: BookOpen, value: formatMarketingCount(decks), label: "Study Decks" },
    { icon: Stethoscope, value: formatMarketingCount(lessons), label: "Clinical Lessons" },
  ];

  const badges = [
    ...(hasCatExams ? [{ icon: ClipboardCheck, label: "Adaptive CAT Exams" }] : []),
    ...(hasClinicalImages ? [{ icon: ImageIcon, label: "Clinical Images" }] : []),
    ...(hasMultiTier ? [{ icon: Users, label: "Multi-Tier Support" }] : []),
  ];

  return (
    <section
      className="border-t border-[var(--theme-card-border)]"
      style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-block)' }}
      data-testid="section-trust-counters"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 shadow-[var(--shadow-card)] mb-5">
            <BarChart3 className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("components.homeConversionSections.platformScale")}</span>
          </div>
          <h2
            className="font-bold text-[var(--theme-heading-text)] mb-3"
            style={{ fontSize: 'var(--text-section)' }}
            data-testid="text-trust-counters-heading"
          >
            Built for Serious Healthcare Exam Preparation
          </h2>
          <p className="text-[var(--theme-muted-text)] max-w-2xl mx-auto text-base lg:text-lg">
            A growing library of questions, flashcards, lessons, and study tools for nursing, NP, allied health, and certification exams — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <TrustCounterSkeleton key={i} />)
            : counters.map((counter) => (
                <div
                  key={counter.label}
                  className="text-center p-6 rounded-2xl bg-white border border-[var(--theme-card-border)]/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200"
                  data-testid={`trust-counter-${counter.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="nn-theme-gradient-br mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl shadow-sm">
                    <counter.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[var(--theme-heading-text)]">{counter.value}</div>
                  <div className="text-xs font-semibold text-[var(--theme-muted-text)] uppercase tracking-wide mt-1.5">{counter.label}</div>
                </div>
              ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="nn-accent-soft-ring flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium text-primary shadow-[var(--shadow-card)]"
              data-testid={`badge-trust-${badge.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <badge.icon className="h-3.5 w-3.5" />
              <span>{badge.label}</span>
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

  return (
    <section
      className="border-t border-[var(--theme-card-border)]"
      style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
      data-testid="section-conversion-proof"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="nn-accent-soft-ring mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 shadow-[var(--shadow-card)]">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("components.homeConversionSections.everythingYouNeed")}</span>
          </div>
          <h2
            className="font-bold text-[var(--theme-heading-text)] mb-3"
            style={{ fontSize: 'var(--text-section)' }}
            data-testid="text-conversion-proof-heading"
          >
            Thousands of questions. Thousands of flashcards. One platform for every healthcare exam.
          </h2>
          <p className="text-[var(--theme-muted-text)] max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
            Stop juggling scattered resources. NurseNest brings {formatMarketingCount(questions)} exam-style questions,
            {" "}{formatMarketingCount(flashcards)} flashcards across {formatMarketingCount(decks)} decks, adaptive CAT exams,
            clinical images, and detailed rationales into a single study environment — covering nursing, NP certification, allied health, and more.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {[
            {
              icon: Target,
              title: "Exam-Ready Questions",
              desc: "Realistic questions across nursing, NP, and allied health scopes with step-by-step rationales that teach you how to think — not just what to memorize.",
            },
            {
              icon: Layers,
              title: "Flashcards & Decks",
              desc: "Organized flashcard decks for pharmacology, pathophysiology, clinical concepts, and allied health topics — built for spaced repetition and active recall.",
            },
            {
              icon: Brain,
              title: "Adaptive CAT Exams",
              desc: "Computer-adaptive testing that mirrors real licensure and certification exams. Questions adjust to your performance in real time.",
            },
            {
              icon: ImageIcon,
              title: "Clinical Images & Visuals",
              desc: "Visual learning resources including clinical images, diagrams, and illustrated rationales for hands-on readiness across all disciplines.",
            },
            {
              icon: BookOpen,
              title: "Lessons & Rationales",
              desc: "In-depth clinical lessons organized by body system and discipline — each with pre-tests, post-tests, and detailed explanations.",
            },
            {
              icon: GraduationCap,
              title: "Multi-Discipline Coverage",
              desc: "Purpose-built content for every healthcare path — practical nursing, registered nursing, nurse practitioner, respiratory therapy, paramedics, and more.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-[var(--theme-card-border)]/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 p-7"
              data-testid={`card-proof-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="nn-theme-gradient-br mb-4 flex h-11 w-11 items-center justify-center rounded-xl shadow-sm">
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-[var(--theme-heading-text)] mb-2" style={{ fontSize: 'var(--text-card-title)' }}>{item.title}</h3>
              <p className="text-sm text-[var(--theme-muted-text)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-primary px-9 py-3 text-lg font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] shadow-primary/25 hover:brightness-110"
            onClick={() => router.push(mapLegacyMarketingHref("/register"))}
            data-testid="button-conversion-proof-cta"
          >
            Start Free — Explore the Full Library
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <p className="text-xs text-[var(--theme-muted-text)] mt-4">{t("components.homeConversionSections.noCreditCardRequiredFree")}</p>
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
    {
      feature: "Question Volume",
      ours: `${formatMarketingCount(questions)} exam-style questions across all tiers`,
      typical: "Limited test banks, often under 2,000",
      icon: Target,
    },
    {
      feature: "Flashcards Included",
      ours: `${formatMarketingCount(flashcards)} flashcards organized into study decks`,
      typical: "Flashcards sold separately or not available",
      icon: Layers,
    },
    {
      feature: "Multi-Discipline Support",
      ours: "Dedicated content for RPN, RN, NP, and allied health professions",
      typical: "One-size-fits-all content for a single exam",
      icon: Users,
    },
    {
      feature: "Integrated Study Tools",
      ours: "Questions + flashcards + CAT exams + lessons + study plans",
      typical: "Only one type of study resource available",
      icon: Zap,
    },
    {
      feature: "Allied Health & Beyond",
      ours: "Full allied health coverage: RT, MLT, paramedic, imaging, social work, OT/PT",
      typical: "Nursing-only with no expansion path",
      icon: Activity,
    },
    {
      feature: "Adaptive Analytics",
      ours: "Real-time readiness tracking with domain-level insights",
      typical: "Basic score tracking without targeted recommendations",
      icon: BarChart3,
    },
  ];

  return (
    <section
      className="border-t border-[var(--theme-card-border)]"
      style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }}
      data-testid="section-competitive-positioning"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="nn-accent-soft-ring mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 shadow-[var(--shadow-card)]">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("components.homeConversionSections.whyNursenest")}</span>
          </div>
          <h2
            className="font-bold text-[var(--theme-heading-text)] mb-3"
            style={{ fontSize: 'var(--text-section)' }}
            data-testid="text-competitive-heading"
          >
            More content. More disciplines. One subscription.
          </h2>
          <p className="text-[var(--theme-muted-text)] max-w-2xl mx-auto text-base lg:text-lg">
            Most study platforms cover one exam. NurseNest combines questions, flashcards, CAT exams, lessons, and analytics for nursing, NP, and allied health into a single study ecosystem.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {comparisons.map((item) => (
            <div
              key={item.feature}
              className="bg-white rounded-2xl border border-[var(--theme-card-border)]/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200 p-6"
              data-testid={`card-compare-${item.feature.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <div className="nn-accent-icon-wrap flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                  <item.icon className="nn-accent-icon h-4 w-4" />
                </div>
                <h3 className="font-bold text-[var(--theme-heading-text)] text-sm">{item.feature}</h3>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="nn-trust-check mt-0.5 h-4 w-4 shrink-0" />
                  <p className="text-sm text-[var(--theme-body-text)] leading-relaxed">{item.ours}</p>
                </div>
                <div className="flex items-start gap-2 opacity-50">
                  <div className="w-4 h-4 rounded-full border-2 border-[var(--theme-input-border)] shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--theme-muted-text)] leading-relaxed">{item.typical}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-white px-9 py-3 font-medium text-primary shadow-[var(--shadow-card)] hover:border-primary/40 hover:bg-primary/5"
            onClick={() => router.push(mapLegacyMarketingHref("/pricing"))}
            data-testid="button-competitive-cta"
          >
            See Plans & Pricing
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
    {
      step: "1",
      icon: BookOpen,
      title: "Learn",
      desc: "Study thousands of pathophysiology lessons, pharmacology guides, and clinical content organized by body system and exam tier.",
    },
    {
      step: "2",
      icon: Target,
      title: "Practice",
      desc: "Test your knowledge with exam-style questions, mock exams, flashcards, and interactive case studies with detailed rationales.",
    },
    {
      step: "3",
      icon: Trophy,
      title: "Track Progress",
      desc: "Monitor your readiness score, identify weak areas, and follow a personalized study plan that adapts as you improve.",
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-[var(--theme-card-border)]" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }} data-testid="section-how-it-works">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 shadow-[var(--shadow-card)] mb-5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">{t("components.homeConversionSections.howItWorks")}</span>
          </div>
          <h2 className="font-bold text-[var(--theme-heading-text)] mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-how-it-works-heading">
            Three Steps to Exam Readiness
          </h2>
          <p className="text-base lg:text-lg text-[var(--theme-muted-text)]">{t("components.homeConversionSections.aProvenSystemToPrepare")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((item, i) => (
            <div key={i} className="relative text-center" data-testid={`step-how-it-works-${i}`}>
              {i < 2 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-[var(--theme-input-border)] to-transparent z-0" />
              )}
              <div className="relative z-10">
                <div className="nn-theme-gradient-br mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-[var(--shadow-elevated)]">
                  <item.icon className="h-9 w-9 text-white" />
                </div>
                <div className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{item.step}</div>
                <h3 className="text-xl font-bold text-[var(--theme-heading-text)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--theme-muted-text)] leading-relaxed max-w-xs mx-auto">{item.desc}</p>
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

  const features = [
    {
      icon: Target,
      title: "Exam Questions",
      desc: `${formatCount(questionCount)} practice questions covering all exam domains with detailed rationales that teach clinical reasoning — not just the right answer.`,
      tags: ["Multiple Choice", "SATA", "NGN", "Rationales"],
      href: "/free-practice",
    },
    {
      icon: Layers,
      title: "Flashcards",
      desc: "140+ pre-built decks with learn mode, test mode, and spaced repetition. Create your own decks or import from CSV. Track mastery across every topic.",
      tags: ["Learn Mode", "Test Mode", "Spaced Repetition"],
      href: "/flashcards",
    },
    {
      icon: ClipboardCheck,
      title: "Mock Exams",
      desc: "Full-length timed exams that mirror the real test format. Strict mode, auto-save, and instant score breakdowns show you exactly where you stand.",
      tags: ["Timed", "Strict Mode", "Score Trends"],
      href: "/mock-exams",
    },
    {
      icon: Lightbulb,
      title: "Detailed Rationales",
      desc: "Every question includes a comprehensive rationale explaining why each answer is correct or incorrect, building the clinical judgment skills exams test.",
      tags: ["Clinical Reasoning", "Evidence-Based", "Learning Focus"],
      href: "/free-practice",
    },
  ];

  return (
    <section style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }} data-testid="section-feature-cards">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-bold text-[var(--theme-heading-text)] mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-feature-cards-heading">
            Everything You Need to Pass
          </h2>
          <p className="text-base lg:text-lg text-[var(--theme-muted-text)] max-w-3xl mx-auto">
            A complete exam prep toolkit built for nursing, NP, and allied health students.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              className="group cursor-pointer overflow-hidden rounded-xl border border-[var(--theme-card-border)]/80 bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              onClick={() => router.push(mapLegacyMarketingHref(feature.href))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") router.push(mapLegacyMarketingHref(feature.href));
              }}
              data-testid={`card-feature-${i}`}
            >
              <div className="p-7">
                <div className="nn-accent-icon-wrap mb-5 flex h-12 w-12 items-center justify-center transition-transform group-hover:scale-110">
                  <feature.icon className="nn-accent-icon h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-[var(--theme-heading-text)]" style={{ fontSize: "var(--text-card-title)" }}>
                  {feature.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-[var(--theme-muted-text)]">{feature.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/80 px-2.5 py-1 text-[10px] font-semibold text-[var(--theme-muted-text)]"
                    >
                      {tag}
                    </span>
                  ))}
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
  const { t } = useMarketingI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [featuredTier, setFeaturedTier] = useState(0);
  const [thumbTiers, setThumbTiers] = useState<Record<string, number>>({});
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
    goTo((activeIndex + 1) % screenshotItems.length);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + screenshotItems.length) % screenshotItems.length);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % screenshotItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = screenshotItems[activeIndex];
  const currentSrc = screenshotData[current.imageKey];

  const featuredChain = getMarketingHeroImageUrlChain({
    objectKey: objectKeyFromPublicCdnUrl(currentSrc.fallback),
    publicCdnUrl: currentSrc.fallback,
  });
  const featuredTierSafe = Math.min(featuredTier, featuredChain.length - 1);
  const featuredImgSrc = featuredChain[featuredTierSafe];
  const featuredCanUseSrcSet =
    featuredTierSafe === 0 && (featuredChain[0]?.startsWith("https://") ?? false);

  useEffect(() => {
    setFeaturedTier(0);
  }, [activeIndex]);

  return (
    <section className="overflow-hidden border-t border-[var(--theme-card-border)]" style={{ paddingTop: 'var(--space-section)', paddingBottom: 'var(--space-section)' }} data-testid="section-screenshot-carousel">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-bold text-[var(--theme-heading-text)] mb-3" style={{ fontSize: 'var(--text-section)' }} data-testid="text-screenshots-heading">
            See the Platform in Action
          </h2>
          <p className="text-base lg:text-lg text-[var(--theme-muted-text)] max-w-2xl mx-auto">
            From adaptive analytics to exam-style practice, explore what NurseNest looks like inside.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-[var(--shadow-elevated)] border border-[var(--theme-card-border)]/80">
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--theme-muted-surface)]">
                <img
                  srcSet={featuredCanUseSrcSet ? resolveMarketingSrcSet(currentSrc.srcSet) : undefined}
                  sizes="(max-width: 640px) 480px, (max-width: 1024px) 768px, 1200px"
                  src={featuredImgSrc}
                  alt={current.title}
                  width={currentSrc.width}
                  height={currentSrc.height}
                  className={`w-full h-full object-cover object-top transition-opacity duration-200 ${
                    isTransitioning ? "opacity-0" : "opacity-100"
                  }`}
                  loading="lazy"
                  decoding="async"
                  data-testid="img-carousel-featured"
                  onError={() => {
                    if (featuredTierSafe < featuredChain.length - 1) {
                      setFeaturedTier((t) => t + 1);
                    }
                  }}
                />
              </div>

              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-[var(--shadow-card)] border border-[var(--theme-card-border)] flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label={t("components.homeConversionSections.previousScreenshot")}
                data-testid="button-carousel-prev"
              >
                <ChevronLeft className="w-5 h-5 text-[var(--theme-body-text)]" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-[var(--shadow-card)] border border-[var(--theme-card-border)] flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label={t("components.homeConversionSections.nextScreenshot")}
                data-testid="button-carousel-next"
              >
                <ChevronRight className="w-5 h-5 text-[var(--theme-body-text)]" />
              </button>
            </div>

            <div className="mt-5 text-center">
              <h3 className="font-bold text-[var(--theme-heading-text)]" style={{ fontSize: 'var(--text-card-title)' }} data-testid="text-carousel-title">
                {current.title}
              </h3>
              <p className="text-sm text-[var(--theme-muted-text)] mt-1.5">{current.blurb}</p>
            </div>
          </div>

          <div
            ref={thumbnailStripRef}
            className="flex gap-2.5 overflow-x-auto pb-2 mt-5 scrollbar-thin scrollbar-thumb-[var(--theme-muted-text)] scrollbar-track-transparent -mx-1 px-1 snap-x snap-mandatory justify-center"
          >
            {screenshotItems.map((item, idx) => {
              const thumbSrc = screenshotData[item.imageKey];
              const thumbChain = getMarketingHeroImageUrlChain({
                objectKey: objectKeyFromPublicCdnUrl(thumbSrc.thumbFallback),
                publicCdnUrl: thumbSrc.thumbFallback,
              });
              const tt = Math.min(thumbTiers[item.id] ?? 0, thumbChain.length - 1);
              const thumbCanUseSrcSet = tt === 0 && (thumbChain[0]?.startsWith("https://") ?? false);
              return (
                <button
                  key={item.id}
                  onClick={() => goTo(idx)}
                  aria-label={`View ${item.title}`}
                  className={`shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 snap-start ${
                    idx === activeIndex
                      ? "border-primary ring-2 ring-primary/20 shadow-[var(--shadow-card)] scale-105"
                      : "border-[var(--theme-input-border)] hover:border-primary/30 opacity-70 hover:opacity-100"
                  }`}
                  data-testid={`thumb-carousel-${item.id}`}
                >
                  <img
                    src={thumbChain[tt]}
                    srcSet={thumbCanUseSrcSet ? resolveMarketingSrcSet(thumbSrc.thumbSrcSet) : undefined}
                    sizes="80px"
                    alt={item.title}
                    width={80}
                    height={56}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                    onError={() => {
                      if (tt < thumbChain.length - 1) {
                        setThumbTiers((prev) => ({ ...prev, [item.id]: tt + 1 }));
                      }
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
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
            Exam Prep for Every Healthcare Career
          </h2>
          <p className="text-base lg:text-lg text-[var(--theme-muted-text)] max-w-3xl mx-auto">
            Select your profession to access tailored content, practice questions, and study plans.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-5xl mx-auto">
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
            Sample Exam Question
          </h2>
          <p className="text-base lg:text-lg text-[var(--theme-muted-text)]">
            Experience the quality of our questions and rationales — no signup required.
          </p>
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
                  Check Answer
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
                      {selectedAnswer === sampleQuestion.correctAnswer ? "Correct!" : `Correct Answer: ${sampleQuestion.correctAnswer}`}
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
                    Try Again
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(mapLegacyMarketingHref("/register"))}
                    className="inline-flex items-center rounded-full bg-primary px-6 py-2 text-primary-foreground"
                    data-testid="button-sample-signup"
                  >
                    Start Practicing Free
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
    { name: "Sophie L.", role: "RPN Student, Manitoba", rating: 5, text: "Having everything in one place saved me so much time. The pre-test and post-test system for each lesson showed me exactly where my weak spots were so I could focus my study time.", tier: "RPN" },
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
            Trusted by Nursing Students Across North America
          </h2>
          <p className="text-base lg:text-lg text-[var(--theme-muted-text)] max-w-2xl mx-auto">
            Real results from real students preparing for their nursing exams.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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
          Ready to Start Your Exam Prep Journey?
        </h2>
        <p className="text-lg lg:text-xl text-[var(--theme-muted-text)] mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of nursing students who passed their exams with NurseNest. Start for free — no credit card required.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-lg font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] shadow-primary/25 transition-all hover:-translate-y-0.5 hover:brightness-110"
            onClick={() => router.push(mapLegacyMarketingHref("/register"))}
            data-testid="button-final-cta-start"
          >
            Start Practicing Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button
            type="button"
            className="h-14 rounded-full border border-[var(--theme-input-border)] bg-card px-8 text-lg font-medium text-[var(--theme-body-text)] hover:border-[color-mix(in_srgb,var(--theme-primary)_22%,var(--theme-input-border))] hover:bg-[var(--theme-muted-surface)]"
            onClick={() => router.push(mapLegacyMarketingHref("/pricing"))}
            data-testid="button-final-cta-pricing"
          >
            View Pricing
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-8 mb-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-primary">{t("components.homeConversionSections.7dayMoneybackGuarantee")}</span>
        </div>
        <p className="text-sm text-[var(--theme-muted-text)]">{t("components.homeConversionSections.freeAccountIncludesPracticeQuestions")}</p>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/4 to-accent-foreground/4 rounded-full blur-[100px] -z-10 opacity-40" />
    </section>
  );
}

export default HomeConversionSections;
