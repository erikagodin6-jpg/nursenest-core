"use client";

import Link from "next/link";
import { useState } from "react";
import type { CSSProperties, ElementType } from "react";
import {
  Activity,
  Ambulance,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Flame,
  FlaskConical,
  GraduationCap,
  Heart,
  LineChart,
  Microscope,
  NotebookTabs,
  Pill,
  RefreshCw,
  Route,
  Scan,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Wind,
  Zap,
  Globe2,
} from "lucide-react";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
  MARKETING_TERTIARY_LINK_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { alliedHealthSegmentPath } from "@/lib/lessons/lesson-routes";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlliedPlatformStats = {
  questionCount?: number;
  lessonCount?: number;
  flashcardCount?: number;
  simulationCount?: number;
  skillCount?: number;
};

function formatStat(n: number | undefined): string {
  if (!n || !Number.isFinite(n) || n <= 0) return "Live";
  if (n >= 1000) return `${Math.floor(n / 1000).toLocaleString("en-US")}k+`;
  return `${n}+`;
}

// ─── PHASE 1 — Premium Hero ───────────────────────────────────────────────────

const HERO_CHIPS = [
  "Respiratory Therapy",
  "Paramedicine",
  "Medical Laboratory",
  "Physiotherapy",
  "Occupational Therapy",
  "Social Work",
  "Psychotherapy",
  "PSW / HCA",
  "Pharmacy Tech",
  "Radiography",
] as const;

const HERO_TRUST_PILLS = [
  "No payment required to start",
  "Dedicated content for RT, MLT, PT, OT, Social Work & more",
  "22+ allied health pathways",
] as const;

const HERO_SLIDES = [
  {
    label: "Practice Question",
    src: "/images/homepage/question-bank-demo.png",
    alt: "Allied health practice question with profession-specific rationale and clinical explanation.",
  },
  {
    label: "Clinical Lesson",
    src: "/images/homepage/lesson-demo.png",
    alt: "Allied health lesson showing clinical objectives, assessment cues, and profession-specific pearls.",
  },
  {
    label: "Readiness Dashboard",
    src: "/images/homepage/readiness-report-demo.png",
    alt: "Allied health readiness report showing domain competency bands and next study recommendations.",
  },
] as const;

export function AlliedHealthHero({
  professionExplorerHref,
  pricingHref,
  stats,
}: {
  professionExplorerHref: string;
  pricingHref: string;
  stats?: AlliedPlatformStats;
}) {
  return (
    <section
      className="nn-hero-bridge border-b border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--border-subtle))]"
      aria-labelledby="allied-hero-heading"
      data-testid="allied-hero-section"
    >
      <div
        className="relative overflow-hidden px-4 py-[clamp(4.5rem,9vw,6.5rem)] sm:px-6 md:py-[clamp(6rem,10vw,8.5rem)] lg:px-8"
        style={{
          background:
            "linear-gradient(155deg, color-mix(in srgb, var(--semantic-info) 5%, var(--page-bg)) 0%, var(--page-bg) 55%, color-mix(in srgb, var(--semantic-success) 4%, var(--page-bg)) 100%)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full blur-3xl opacity-40"
          style={{ background: "color-mix(in srgb, var(--semantic-info) 18%, transparent)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full blur-3xl opacity-30"
          style={{ background: "color-mix(in srgb, var(--semantic-success) 14%, transparent)" }}
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          {/* ── Copy column ─────────────────────────────────────────── */}
          <div className="max-w-[44rem]">
            {/* Eyebrow */}
            <p className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-info)_8%,var(--page-bg))] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-info)]">
              <Globe2 className="h-3 w-3" aria-hidden />
              For RT, Paramedic, MLT, PT, OT, Social Work &amp; More
            </p>

            {/* Headline */}
            <h1
              id="allied-hero-heading"
              className="nn-marketing-h1 mt-6 min-w-0 max-w-[min(100%,38ch)] text-balance text-[var(--palette-heading)]"
              data-testid="allied-hero-heading"
            >
              The Complete Allied Health{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, var(--semantic-info) 0%, var(--semantic-success) 100%)" }}
              >
                Education Ecosystem.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="nn-marketing-body mt-5 max-w-[44ch] text-pretty text-[var(--palette-text-muted)]">
              Lessons, practice questions, CAT exams, clinical simulations, and competency
              tracking — built for your specific profession, not adapted from nursing pathways.
            </p>

            {/* Profession chips */}
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Supported allied health professions">
              {HERO_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--page-bg))] px-3 py-1 text-xs font-semibold text-[var(--palette-heading)]"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "var(--semantic-info)" }}
                    aria-hidden
                  />
                  {chip}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={professionExplorerHref}
                className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-full`}
                data-testid="allied-hero-primary-cta"
              >
                Start Free
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
              </Link>
              <Link
                href={pricingHref}
                className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-full`}
                data-testid="allied-hero-secondary-cta"
              >
                View Pricing
              </Link>
            </div>

            {/* Trust pills */}
            <div className="mt-5 flex flex-wrap gap-2" aria-label="Trust signals">
              {HERO_TRUST_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--page-bg)] px-3 py-1 text-xs font-medium text-[var(--palette-text-muted)]"
                >
                  <ShieldCheck className="h-3 w-3 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                  {pill}
                </span>
              ))}
            </div>

            {/* Platform depth indicator — grows as allied content expands */}
            <p className="mt-5 text-sm text-[var(--palette-text-muted)]">
              Content depth varies by profession. Open a pathway to see what is available for your discipline.
            </p>
          </div>

          {/* ── Product preview panel — desktop only ────────────────── */}
          <aside
            className="hidden w-[420px] shrink-0 lg:block"
            aria-label="NurseNest allied health product preview"
          >
            <div className="overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--border-subtle))] bg-[var(--page-bg)] shadow-[0_4px_40px_color-mix(in_srgb,var(--semantic-info)_10%,transparent)]">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-2.5">
                <span className="text-xs font-bold text-[var(--semantic-info)]">Live Product Preview</span>
                <span className="text-xs text-[var(--palette-text-muted)]">Allied Health Platform</span>
              </div>
              <div className="divide-y divide-[var(--border-subtle)]">
                {HERO_SLIDES.map((slide) => (
                  <div key={slide.label} className="p-1">
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        width={800}
                        height={468}
                        loading="lazy"
                        decoding="async"
                        className="w-full object-cover object-top"
                      />
                    </div>
                    <p className="mt-1.5 px-2 pb-1 text-[0.6rem] font-bold uppercase tracking-wide text-[var(--palette-text-muted)]">
                      {slide.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

// ─── PHASE 2 — Profession Showcase ───────────────────────────────────────────

type ProfessionEntry = {
  key: string;
  label: string;
  certifications: string;
  certBody: string;
  description: string;
  domains: string[];
  icon: ElementType;
  accent: string;
  segment: string;
};

const PROFESSIONS: ProfessionEntry[] = [
  {
    key: "rt",
    label: "Respiratory Therapy",
    certifications: "CRT · RRT",
    certBody: "NBRC · CSRT",
    description: "Ventilator management, ABG interpretation, pulmonary pharmacology, and airway safety.",
    domains: ["Airway Management", "Mechanical Ventilation", "Oxygenation", "ABG Interpretation", "Respiratory Pharmacology"],
    icon: Wind,
    accent: "--semantic-info",
    segment: "rrt-exam-prep",
  },
  {
    key: "paramedic",
    label: "Paramedicine & EMT",
    certifications: "Paramedic · AEMCA",
    certBody: "NREMT · ACP · PCP",
    description: "Trauma assessment, ACLS, prehospital pharmacology, and emergency decision-making.",
    domains: ["Trauma Assessment", "Cardiac Emergencies", "Airway & Ventilation", "Shock Management", "Pharmacology"],
    icon: Ambulance,
    accent: "--semantic-chart-1",
    segment: "paramedic-exam-prep",
  },
  {
    key: "mlt",
    label: "Medical Laboratory Science",
    certifications: "MLT · MLS",
    certBody: "CSMLS · ASCP · AMT",
    description: "CBC interpretation, hematology patterns, microbiology, clinical chemistry, and QC.",
    domains: ["Hematology", "Clinical Chemistry", "Microbiology", "Blood Bank", "Quality Control"],
    icon: FlaskConical,
    accent: "--semantic-chart-2",
    segment: "mlt-exam-prep",
  },
  {
    key: "pt",
    label: "Physiotherapy",
    certifications: "PT · Physiotherapist",
    certBody: "NPTE · PCE · CAPR",
    description: "Gait analysis, therapeutic exercise, musculoskeletal assessment, and rehabilitation.",
    domains: ["Musculoskeletal", "Neurological Rehab", "Cardiopulmonary", "Mobility & Gait", "Functional Outcomes"],
    icon: Activity,
    accent: "--semantic-brand",
    segment: "physiotherapy-exam-prep",
  },
  {
    key: "ot",
    label: "Occupational Therapy",
    certifications: "OTR/L · OT Reg.",
    certBody: "NBCOT · COTEC · CAOT",
    description: "ADL evaluation, activity analysis, cognitive assessment, and occupational performance.",
    domains: ["ADLs & IADLs", "Cognitive Rehabilitation", "Sensory Integration", "Assistive Technology", "Mental Health OT"],
    icon: Brain,
    accent: "--semantic-success",
    segment: "occupational-therapy-exam-prep",
  },
  {
    key: "social-work",
    label: "Social Work",
    certifications: "LCSW · RSW",
    certBody: "ASWB · CASW",
    description: "Clinical assessment, ethics, mental health interventions, and case formulation.",
    domains: ["Clinical Assessment", "Ethics & Boundaries", "Mental Health Interventions", "Trauma & Loss", "Case Management"],
    icon: Users,
    accent: "--semantic-warning",
    segment: "social-work-exam-prep",
  },
  {
    key: "psychotherapy",
    label: "Psychotherapy",
    certifications: "RP · LPC · LMFT",
    certBody: "CRPO · NBCC · AMFTRB",
    description: "Therapeutic modalities, ethics, psychopathology, and evidence-based case formulation.",
    domains: ["Psychopathology", "Therapeutic Modalities", "Ethics & Jurisprudence", "Case Conceptualization", "Crisis Intervention"],
    icon: Microscope,
    accent: "--semantic-chart-5",
    segment: "psychotherapy-exam-prep",
  },
  {
    key: "psw",
    label: "PSW / Personal Support Worker",
    certifications: "PSW · HCA",
    certBody: "HCAP · NACC · PSW Certificate",
    description: "Personal care, safety practices, dementia care, and community health support.",
    domains: ["Personal Care Safety", "Dementia & Cognitive Care", "Mobility & Transfers", "Infection Control", "Palliative Care"],
    icon: Heart,
    accent: "--semantic-chart-3",
    segment: "psw-hca-exam-prep",
  },
] as const;

export function AlliedProfessionShowcase() {
  return (
    <section
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      aria-labelledby="allied-profession-showcase-heading"
      data-testid="section-allied-profession-showcase"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">Profession Pathways</p>
          <h2
            id="allied-profession-showcase-heading"
            className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
          >
            Choose Your Allied Health Pathway
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            Each profession has its own dedicated learning ecosystem — certification-aligned content, occupation-specific questions, and competency domains that match your actual scope of practice.
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROFESSIONS.map((prof) => {
            const Icon = prof.icon;
            return (
              <Link
                key={prof.key}
                href={alliedHealthSegmentPath(prof.segment)}
                className="group flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-[var(--shadow-card)]"
                style={{ borderColor: `color-mix(in srgb, var(${prof.accent}) 18%, var(--border-subtle))` } as CSSProperties}
                data-testid={`allied-profession-card-${prof.key}`}
              >
                {/* Top accent bar */}
                <div
                  className="h-0.5"
                  style={{ background: `linear-gradient(90deg, var(${prof.accent}), color-mix(in srgb, var(${prof.accent}) 30%, transparent))` } as CSSProperties}
                  aria-hidden
                />
                <div
                  className="flex flex-1 flex-col p-5"
                  style={{ background: `color-mix(in srgb, var(${prof.accent}) 3%, var(--theme-card-bg))` } as CSSProperties}
                >
                  {/* Icon + arrow */}
                  <div className="flex items-start justify-between">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                      style={{ borderColor: `color-mix(in srgb, var(${prof.accent}) 25%, var(--border-subtle))`, background: `color-mix(in srgb, var(${prof.accent}) 12%, var(--theme-card-bg))`, color: `var(${prof.accent})` } as CSSProperties}
                      aria-hidden
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowRight
                      className="mt-1 h-4 w-4 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-60"
                      style={{ color: `var(${prof.accent})` } as CSSProperties}
                      aria-hidden
                    />
                  </div>

                  {/* Name + cert */}
                  <h3 className="mt-3 text-sm font-black text-[var(--palette-heading)]">{prof.label}</h3>
                  <p className="mt-0.5 text-xs font-bold" style={{ color: `var(${prof.accent})` } as CSSProperties}>
                    {prof.certifications} · {prof.certBody}
                  </p>
                  <p className="nn-marketing-body-sm mt-2 flex-1 text-pretty text-[var(--palette-text-muted)]">
                    {prof.description}
                  </p>

                  {/* Domains */}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {prof.domains.slice(0, 3).map((d) => (
                      <span
                        key={d}
                        className="rounded-md border px-2 py-0.5 text-[0.6rem] font-semibold text-[var(--palette-text-muted)]"
                        style={{ borderColor: `color-mix(in srgb, var(${prof.accent}) 18%, var(--border-subtle))` } as CSSProperties}
                      >
                        {d}
                      </span>
                    ))}
                    {prof.domains.length > 3 && (
                      <span className="rounded-md border border-[var(--border-subtle)] px-2 py-0.5 text-[0.6rem] font-semibold text-[var(--palette-text-muted)]">
                        +{prof.domains.length - 3} more
                      </span>
                    )}
                  </div>

                  <span className="mt-4 text-xs font-bold" style={{ color: `var(${prof.accent})` } as CSSProperties}>
                    Explore pathway →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* "More professions" band */}
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-sm font-black text-[var(--palette-heading)]">22+ allied health professions supported</p>
            <p className="nn-marketing-body-sm mt-0.5 text-[var(--palette-text-muted)]">
              Also includes EMT, Radiography, Sonography, Dental Hygiene, Pharmacy Tech, OTA, PTA, Medical Assistant, Dietetics, and more.
            </p>
          </div>
          <Link
            href="/allied-health"
            className="ml-4 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_25%,var(--border-subtle))] px-4 py-2 text-sm font-bold text-[var(--semantic-info)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-info)_6%,transparent)]"
          >
            All professions
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── PHASE 3 — Ecosystem Feature Grid ────────────────────────────────────────

type EcosystemFeature = {
  title: string;
  description: string;
  icon: ElementType;
  screenshot: string;
  screenshotAlt: string;
  tone: string;
  group: "study" | "clinical" | "intelligence";
};

const ECOSYSTEM_FEATURES: EcosystemFeature[] = [
  { title: "Profession-Specific Lessons", description: "Clinical teaching scoped to your occupation — not shared with nursing hubs.", icon: BookOpen, screenshot: "/images/homepage/lesson-demo.png", screenshotAlt: "Allied health lesson page with clinical objectives and profession-specific teaching.", tone: "--semantic-brand", group: "study" },
  { title: "Flashcards", description: "Spaced-repetition recall for terminology, procedures, and certification content.", icon: Brain, screenshot: "/marketing/generated-screenshots/core/flashcards.webp", screenshotAlt: "Flashcard study session with active recall and profession-specific cues.", tone: "--semantic-chart-2", group: "study" },
  { title: "Practice Questions", description: "Exam-style items written for your profession with clinical rationales.", icon: ClipboardList, screenshot: "/images/homepage/question-bank-demo.png", screenshotAlt: "Allied health practice question with answer, rationale, and clinical pearl.", tone: "--semantic-info", group: "study" },
  { title: "CAT Adaptive Exams", description: "Computer-adaptive practice that adjusts to your readiness — where question depth supports it.", icon: ClipboardCheck, screenshot: "/images/homepage/cat-exam-demo.png", screenshotAlt: "CAT exam session with adaptive difficulty and progress tracking.", tone: "--semantic-success", group: "study" },
  { title: "Case Scenarios", description: "Scenario-based questions that test clinical judgment in your profession's real environment.", icon: Route, screenshot: "/images/homepage/question-bank-demo.png", screenshotAlt: "Scenario-style practice question with clinical context and profession-specific rationale.", tone: "--semantic-chart-1", group: "clinical" },
  { title: "Profession-Specific Rationales", description: "Every answer explained through the clinical lens of your occupation — not nursing reframed.", icon: Stethoscope, screenshot: "/images/homepage/lesson-demo.png", screenshotAlt: "Allied health practice item with profession-specific clinical teaching and rationale.", tone: "--semantic-success", group: "clinical" },
  { title: "Lab Interpretation", description: "CBC, ABG, chemistry panels, and diagnostic reasoning connected to clinical actions.", icon: FlaskConical, screenshot: "/images/homepage/lab-workstation-demo.png", screenshotAlt: "Lab interpretation workstation with abnormal values and clinical assessment workflow.", tone: "--semantic-chart-2", group: "clinical" },
  { title: "Study Plans", description: "A guided path from today's weak areas to tomorrow's exam readiness.", icon: NotebookTabs, screenshot: "/marketing/generated-screenshots/core/study-plan.webp", screenshotAlt: "Adaptive study plan with daily review blocks and progress milestones.", tone: "--semantic-brand", group: "intelligence" },
  { title: "Readiness Analytics", description: "Domain mastery bands, confidence calibration, and readiness scores.", icon: LineChart, screenshot: "/marketing/generated-screenshots/core/confidence-analytics.webp", screenshotAlt: "Readiness analytics dashboard with domain performance and trend analysis.", tone: "--semantic-warning", group: "intelligence" },
  { title: "Report Cards", description: "Session summaries that turn practice activity into an actionable study plan.", icon: BarChart3, screenshot: "/images/homepage/readiness-report-demo.png", screenshotAlt: "Learner report card showing readiness score, weak areas, and recommended next actions.", tone: "--semantic-chart-5", group: "intelligence" },
  { title: "Weak Area Review", description: "Missed items and low-confidence topics route into focused review loops.", icon: SearchCheck, screenshot: "/marketing/generated-screenshots/core/smart-review.webp", screenshotAlt: "Smart review system grouping weak topics by confidence priority.", tone: "--semantic-info", group: "intelligence" },
  { title: "Progress Tracking", description: "Longitudinal trends across sessions, domains, and study modes over time.", icon: TrendingUp, screenshot: "/marketing/generated-screenshots/core/learner-dashboard.webp", screenshotAlt: "Learner progress dashboard showing activity trends and competency growth.", tone: "--semantic-success", group: "intelligence" },
] as const;

const GROUP_LABELS: Record<"study" | "clinical" | "intelligence", string> = {
  study: "Study Modes",
  clinical: "Clinical Training",
  intelligence: "Progress Intelligence",
};

export function AlliedEcosystemSection() {
  return (
    <section
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      aria-labelledby="allied-ecosystem-section-heading"
      data-testid="section-allied-ecosystem"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">Everything Included</p>
          <h2
            id="allied-ecosystem-section-heading"
            className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
          >
            Everything You Need In One Platform
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            One subscription — lessons, questions, CAT exams, clinical simulations, clinical skills, study plans, analytics, and report cards — all scoped to your allied profession.
          </p>
        </div>

        {(["study", "clinical", "intelligence"] as const).map((group) => {
          const items = ECOSYSTEM_FEATURES.filter((f) => f.group === group);
          return (
            <div key={group} className="mt-10">
              <h3 className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-[var(--palette-text-muted)]">
                {GROUP_LABELS[group]}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)]"
                      data-testid={`allied-ecosystem-card-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {/* Screenshot */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--semantic-panel-muted)]">
                        <img
                          src={feature.screenshot}
                          alt={feature.screenshotAlt}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                      {/* Copy */}
                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                            style={{ background: `color-mix(in srgb, var(${feature.tone}) 12%, var(--theme-card-bg))`, color: `var(${feature.tone})` } as CSSProperties}
                            aria-hidden
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <p className="text-sm font-black text-[var(--palette-heading)]">{feature.title}</p>
                        </div>
                        <p className="nn-marketing-body-sm mt-2 text-pretty text-[var(--palette-text-muted)]">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* CTA row */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/allied-health" className={`${MARKETING_PRIMARY_CTA_CLASS} inline-flex`}>
            Explore Allied Health
            <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
          </Link>
          <Link href="/pricing" className={`${MARKETING_SECONDARY_CTA_CLASS} inline-flex`}>
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── PHASE 5 — Clinical Reasoning Section ────────────────────────────────────

const DIFFERENTIATORS = [
  {
    title: "Profession-Specific Rationales",
    body: "Every question explains the answer through the lens of your profession — RT questions reason through respiratory physiology, paramedic questions reason through prehospital protocols.",
    icon: Brain,
    tone: "--semantic-info",
  },
  {
    title: "Clinical Pearls Tied to Your Role",
    body: "Hints, mnemonics, and clinical reminders are written for your specific scope — not adapted from nursing content with occupation labels swapped.",
    icon: Sparkles,
    tone: "--semantic-brand",
  },
  {
    title: "Adaptive Remediation",
    body: "Weak areas detected in practice automatically route to targeted lessons, flashcard drills, and focused question sets within your profession's competency map.",
    icon: RefreshCw,
    tone: "--semantic-success",
  },
  {
    title: "Scenario-Based Questions",
    body: "Case-based questions that evolve clinical information across items, testing judgment and prioritization decisions in your profession's scope — not generic hospital vignettes.",
    icon: Route,
    tone: "--semantic-chart-1",
  },
  {
    title: "Domain-Categorized Questions",
    body: "Questions are categorized by clinical domain within your allied pathway — so weak-area routing and readiness signals stay relevant to your scope of practice.",
    icon: Target,
    tone: "--semantic-warning",
  },
  {
    title: "Clinical Judgment Beyond Right/Wrong",
    body: "Rationales teach the decision-making process, not just the answer. You understand why the correct action is safest — and why the distractors matter.",
    icon: SearchCheck,
    tone: "--semantic-chart-2",
  },
] as const;

export function AlliedClinicalReasoningSection() {
  return (
    <section
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      aria-labelledby="allied-clinical-reasoning-heading"
      data-testid="section-allied-clinical-reasoning"
    >
      <div className="nn-section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Left column */}
          <div>
            <p className="nn-premium-home-eyebrow">Built Different</p>
            <h2
              id="allied-clinical-reasoning-heading"
              className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
            >
              Built Around Your Clinical Reality, Not Adapted From Nursing.
            </h2>
            <p className="nn-marketing-body mt-3 text-pretty text-[var(--palette-text-muted)]">
              For professions like Respiratory Therapy, Medical Laboratory Science, Physiotherapy, Occupational Therapy, Social Work, and Psychotherapy — content is written specifically for that discipline. Rationales, clinical pearls, and adaptive pathways reflect the environments where allied health professionals actually work.
            </p>

            <div className="mt-6 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--theme-card-bg))] p-5">
              <p className="text-xs font-black uppercase tracking-wide text-[var(--semantic-info)]">Content Philosophy</p>
              <p className="nn-marketing-body-sm mt-2 text-[var(--palette-text-muted)]">
                Allied Health pathways use a separate entitlement layer from nursing hubs. Core professions — RT, MLT, PT, OT, Social Work, Psychotherapy — have dedicated lesson catalogs. Other pathways draw from shared clinical fundamentals while dedicated content develops. Content depth varies by profession — see your pathway for current coverage.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/allied-health" className={`${MARKETING_SECONDARY_CTA_CLASS} inline-flex`}>
                Explore Allied Pathways
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
              </Link>
            </div>
          </div>

          {/* Right grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {DIFFERENTIATORS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-5">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `color-mix(in srgb, var(${item.tone}) 12%, var(--theme-card-bg))`, color: `var(${item.tone})` } as CSSProperties}
                    aria-hidden
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-sm font-black text-[var(--palette-heading)]">{item.title}</h3>
                  <p className="nn-marketing-body-sm mt-2 text-pretty text-[var(--palette-text-muted)]">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PHASE 6 — Readiness Preview ─────────────────────────────────────────────

const READINESS_PROFILES = [
  {
    profession: "Respiratory Therapy",
    icon: Wind,
    accent: "--semantic-info",
    domains: [
      { label: "Airway Management", pct: 88, tone: "success" },
      { label: "Mechanical Ventilation", pct: 74, tone: "info" },
      { label: "Oxygenation & Gas Exchange", pct: 61, tone: "warning" },
      { label: "ABG Interpretation", pct: 48, tone: "danger" },
      { label: "Respiratory Pharmacology", pct: 82, tone: "brand" },
    ],
  },
  {
    profession: "Paramedicine",
    icon: Ambulance,
    accent: "--semantic-chart-1",
    domains: [
      { label: "Trauma Assessment", pct: 91, tone: "success" },
      { label: "Cardiac Emergencies", pct: 77, tone: "info" },
      { label: "Medical Emergencies", pct: 69, tone: "warning" },
      { label: "Airway & Ventilation", pct: 85, tone: "success" },
      { label: "Pharmacology", pct: 58, tone: "warning" },
    ],
  },
  {
    profession: "Medical Laboratory Science",
    icon: FlaskConical,
    accent: "--semantic-chart-2",
    domains: [
      { label: "Hematology", pct: 80, tone: "success" },
      { label: "Clinical Chemistry", pct: 72, tone: "info" },
      { label: "Microbiology", pct: 64, tone: "warning" },
      { label: "Specimen Integrity", pct: 90, tone: "success" },
      { label: "Quality Control", pct: 55, tone: "warning" },
    ],
  },
] as const;

export function AlliedReadinessPreview() {
  const [active, setActive] = useState(0);
  const profile = READINESS_PROFILES[active]!;
  const ProfileIcon = profile.icon;

  return (
    <section
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      aria-labelledby="allied-readiness-heading"
      data-testid="section-allied-readiness-preview"
    >
      <div className="nn-section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* Left copy */}
          <div>
            <p className="nn-premium-home-eyebrow">Readiness Dashboard</p>
            <h2
              id="allied-readiness-heading"
              className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
            >
              Know Where To Study Next. For Your Profession.
            </h2>
            <p className="nn-marketing-body mt-3 text-pretty text-[var(--palette-text-muted)]">
              Readiness signals combine domain accuracy trends, question performance, and study momentum — building toward profession-specific competency framing as each allied pathway matures.
            </p>

            {/* Profession selector */}
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Select profession readiness preview">
              {READINESS_PROFILES.map((p, i) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.profession}
                    onClick={() => setActive(i)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                      i === active
                        ? "border-[color-mix(in_srgb,var(--semantic-info)_50%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--theme-card-bg))] text-[var(--semantic-info)]"
                        : "border-[var(--border-subtle)] text-[var(--palette-text-muted)] hover:border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--border-subtle))]"
                    }`}
                    aria-pressed={i === active}
                  >
                    <Icon className="h-3 w-3" aria-hidden />
                    {p.profession.split(" ")[0]}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-[var(--semantic-success)]" aria-hidden />
                <span className="text-sm text-[var(--palette-text-muted)]">Session report cards after every practice session</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-[var(--semantic-warning)]" aria-hidden />
                <span className="text-sm text-[var(--palette-text-muted)]">Study streak tracking and momentum signals</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[var(--semantic-info)]" aria-hidden />
                <span className="text-sm text-[var(--palette-text-muted)]">Longitudinal trends across weeks and domains</span>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-5 sm:p-6">
            <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-4">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `color-mix(in srgb, var(${profile.accent}) 12%, var(--theme-card-bg))`, color: `var(${profile.accent})` } as CSSProperties}
                aria-hidden
              >
                <ProfileIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black text-[var(--palette-heading)]">{profile.profession}</p>
                <p className="text-xs text-[var(--palette-text-muted)]">Sample readiness — not real learner data</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-black text-[var(--palette-heading)]">74%</p>
                <p className="text-xs text-[var(--palette-text-muted)]">Overall readiness</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {profile.domains.map((domain) => (
                <div key={domain.label}>
                  <div className="flex justify-between text-xs font-bold text-[var(--palette-text-muted)]">
                    <span>{domain.label}</span>
                    <span className="text-[var(--palette-heading)]">{domain.pct}%</span>
                  </div>
                  <div className="nn-premium-progress mt-1.5">
                    <span
                      data-nn-progress-fill
                      data-nn-progress-tone={domain.tone}
                      style={{ width: `${domain.pct}%`, ["--progress-tone" as string]: `var(--nn-premium-meter-${domain.tone})` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { icon: Target, label: "Next 30 min", value: "Weak domain drill" },
                { icon: Flame, label: "Study streak", value: "4 active days" },
                { icon: CalendarCheck, label: "Progress", value: "38 items reviewed" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-[var(--border-subtle)] p-3">
                  <Icon className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
                  <p className="mt-2 text-xs font-black text-[var(--palette-heading)]">{label}</p>
                  <p className="text-[0.65rem] text-[var(--palette-text-muted)]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PHASE 7 — Testimonials ───────────────────────────────────────────────────

const ALLIED_TESTIMONIALS = [
  {
    quote: "Finally a platform that actually knows what RT does. The ventilator content and ABG questions feel like they were built by someone who has worked in a respiratory department.",
    role: "Respiratory Therapy Student",
    initials: "D.M.",
    profession: "RT",
    accent: "--semantic-info",
    icon: Wind,
  },
  {
    quote: "The MLT practice questions felt like they were written by someone who had actually worked in a lab. CBC patterns, QC logic, and specimen handling — all correct scope.",
    role: "MLT Certification Candidate",
    initials: "J.L.",
    profession: "MLT",
    accent: "--semantic-chart-2",
    icon: FlaskConical,
  },
  {
    quote: "The paramedic pathway covers the right protocols. I could tell it wasn't just rebranded nursing content — NREMT scope, prehospital pharmacology, trauma prioritization.",
    role: "Paramedic Certification Student",
    initials: "C.R.",
    profession: "Paramedic",
    accent: "--semantic-chart-1",
    icon: Ambulance,
  },
  {
    quote: "OT content that actually covers ADL analysis and NBCOT domains — not nursing-style med-surg questions relabeled as occupational therapy.",
    role: "OT Student",
    initials: "A.T.",
    profession: "OT",
    accent: "--semantic-success",
    icon: Brain,
  },
  {
    quote: "The physiotherapy exam prep uses the PCE blueprint — I can filter to the specific competency areas I need to work on rather than guessing what will be on the exam.",
    role: "PT Certification Candidate",
    initials: "M.P.",
    profession: "PT",
    accent: "--semantic-brand",
    icon: Activity,
  },
  {
    quote: "PSW content covers the actual care settings — long-term care, home support, palliative. It didn't feel like nursing content with PSW written over it.",
    role: "PSW Program Student",
    initials: "R.K.",
    profession: "PSW",
    accent: "--semantic-chart-3",
    icon: Heart,
  },
] as const;

export function AlliedTestimonialsSection() {
  return (
    <section
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      aria-labelledby="allied-testimonials-heading"
      data-testid="section-allied-testimonials"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">Learner Experience</p>
          <h2
            id="allied-testimonials-heading"
            className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
          >
            What Allied Health Learners Say
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            Representative feedback from allied health candidates — not outcome guarantees. Content is profession-specific and kept separate from nursing pathways.
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ALLIED_TESTIMONIALS.map((t) => {
            const Icon = t.icon;
            return (
              <article
                key={t.initials}
                className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-5"
              >
                <div className="flex items-center gap-2 text-[var(--semantic-warning)]" aria-label="Five star sentiment">
                  <span className="font-black tracking-wide">★★★★★</span>
                </div>
                <p className="nn-marketing-body-sm mt-4 flex-1 text-pretty text-[var(--palette-text-muted)]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-[var(--border-subtle)] pt-4">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ background: `color-mix(in srgb, var(${t.accent}) 12%, var(--theme-card-bg))`, color: `var(${t.accent})` } as CSSProperties}
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-black text-[var(--palette-heading)]">{t.initials}</span>
                    <span className="block text-xs font-bold text-[var(--palette-text-muted)]">{t.role}</span>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── PHASE 8 — FAQ ────────────────────────────────────────────────────────────

const ALLIED_FAQ_ITEMS = [
  {
    q: "What allied health professions does NurseNest support?",
    a: "NurseNest supports 22+ allied health professions including Respiratory Therapy (CRT/RRT), Paramedicine/EMT, Medical Laboratory Science, Physiotherapy (PT), Occupational Therapy (OT), Social Work (LCSW/ASWB), Psychotherapy, PSW/HCA, Dental Hygiene, Pharmacy Technology, Diagnostic Imaging, Sonography, OTA, PTA, and more.",
  },
  {
    q: "How are Allied Health pathways different from Nursing pathways?",
    a: "Allied Health pathways use occupation-specific questions, lessons, clinical scenarios, and rationales scoped to your profession's scope of practice. Content is not shared with nursing hubs — an RT learner sees ventilator and ABG content, not NCLEX-RN pharmacology.",
  },
  {
    q: "Are clinical simulations available for allied health learners?",
    a: "Scenario-based case questions that evolve clinical information across items are available. Full branching simulations with live patient deterioration cues are being developed for allied health pathways — content and availability vary by profession.",
  },
  {
    q: "How does readiness scoring work for allied health?",
    a: "Readiness signals combine domain accuracy trends, question performance, weak-area patterns, and study momentum. Signals are scoped to your allied pathway and build toward profession-specific competency framing as content depth grows for each discipline.",
  },
  {
    q: "Are profession-specific rationales included with questions?",
    a: "Yes. Every practice question includes a clinical rationale written through the lens of your profession — RT questions explain respiratory physiology, paramedic questions explain prehospital decision-making, MLT questions explain laboratory reasoning.",
  },
  {
    q: "Can I access more than one allied health profession?",
    a: "Yes. Your account can access multiple allied health pathways and you can switch profession filters at any time without a separate subscription.",
  },
  {
    q: "What is included in an Allied Health subscription?",
    a: "Your subscription includes profession-specific lessons, practice questions with rationales, flashcards, adaptive CAT exams (where question depth supports it), study plans, readiness analytics, weak-area review, and session report cards — all scoped to your allied health pathway. Content depth varies by profession; open your pathway page to see what is currently available for your discipline.",
  },
  {
    q: "How often is allied health content updated?",
    a: "Content is updated on a rolling basis to reflect current exam blueprints and certification body updates including NBRC, NREMT, CSMLS, ASCP, NPTE, PCE, NBCOT, ASWB, and ARRT.",
  },
] as const;

export function AlliedFaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      aria-labelledby="allied-faq-heading"
      data-testid="section-allied-faq"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">Common Questions</p>
          <h2
            id="allied-faq-heading"
            className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
          >
            Frequently Asked Questions
          </h2>
        </div>

        <dl className="mx-auto mt-8 max-w-3xl divide-y divide-[var(--border-subtle)]">
          {ALLIED_FAQ_ITEMS.map((item, i) => (
            <div key={item.q}>
              <dt>
                <button
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-bold text-[var(--palette-heading)] hover:text-[var(--semantic-info)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-info)]"
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[var(--palette-text-muted)] transition-transform ${open === i ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
              </dt>
              {open === i && (
                <dd className="pb-4 text-sm leading-relaxed text-[var(--palette-text-muted)]">
                  {item.a}
                </dd>
              )}
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/allied-health" className={`${MARKETING_PRIMARY_CTA_CLASS} inline-flex`}>
            Start Free
            <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
          </Link>
          <Link href="/pricing" className={`${MARKETING_SECONDARY_CTA_CLASS} inline-flex`}>
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Conversion CTA Band ──────────────────────────────────────────────────────

export function AlliedConversionBand({ pricingHref }: { pricingHref: string }) {
  return (
    <section
      className="nn-premium-home-section"
      aria-labelledby="allied-conversion-heading"
      data-testid="section-allied-conversion"
    >
      <div className="nn-section-shell">
        <div
          className="relative overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--border-subtle))] px-6 py-10 text-center sm:px-10 sm:py-12"
          style={{ background: "linear-gradient(155deg, color-mix(in srgb, var(--semantic-info) 6%, var(--page-bg)) 0%, var(--page-bg) 55%, color-mix(in srgb, var(--semantic-success) 5%, var(--page-bg)) 100%)" }}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl opacity-40" style={{ background: "color-mix(in srgb, var(--semantic-info) 16%, transparent)" }} aria-hidden />

          <p className="nn-premium-home-eyebrow">Ready to Start?</p>
          <h2
            id="allied-conversion-heading"
            className="nn-marketing-h2 mx-auto mt-4 max-w-2xl text-balance text-[var(--palette-heading)]"
          >
            One Platform for Your Entire Allied Health Career.
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-xl text-pretty text-[var(--palette-text-muted)]">
            Exam prep, clinical skills, competency tracking, and adaptive remediation — all built for your specific profession. No payment required to start.
          </p>

          <ul className="mx-auto mt-6 flex max-w-lg flex-col gap-2 text-sm text-[var(--palette-text-muted)] sm:flex-row sm:flex-wrap sm:justify-center">
            {["Profession-specific content", "22+ allied pathways", "No credit card required", "Cancel anytime"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/allied-health" className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-full`}>
              Start Free
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
            </Link>
            <Link href={pricingHref} className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-full`}>
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Full Homepage Compositor ─────────────────────────────────────────────────

export function AlliedHealthHomepage({
  professionExplorerHref = "#allied-professions-explorer",
  pricingHref = "/pricing",
  stats,
}: {
  professionExplorerHref?: string;
  pricingHref?: string;
  stats?: AlliedPlatformStats;
}) {
  return (
    <div data-nn-allied-health-homepage="2">
      {/* Phase 1 — Hero */}
      <AlliedHealthHero
        professionExplorerHref={professionExplorerHref}
        pricingHref={pricingHref}
        stats={stats}
      />

      {/* Phase 2 — Profession Showcase */}
      <AlliedProfessionShowcase />

      {/* Phase 3 + 4 — Ecosystem + Screenshots */}
      <AlliedEcosystemSection />

      {/* Phase 5 — Clinical Reasoning */}
      <AlliedClinicalReasoningSection />

      {/* Phase 6 — Readiness Preview */}
      <AlliedReadinessPreview />

      {/* Phase 7 — Testimonials */}
      <AlliedTestimonialsSection />

      {/* Phase 8 — FAQ */}
      <AlliedFaqSection />

      {/* Phase 10 — Conversion band */}
      <AlliedConversionBand pricingHref={pricingHref} />
    </div>
  );
}
