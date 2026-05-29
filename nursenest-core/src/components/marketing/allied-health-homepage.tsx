"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  ClipboardList,
  GraduationCap,
  Heart,
  Wind,
  Microscope,
  Scan,
  ShieldCheck,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Zap,
  Pill,
  BarChart3,
  Ambulance,
  ChevronRight,
  Sparkles,
  Globe2,
} from "lucide-react";
import type { CSSProperties, ElementType } from "react";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { alliedHealthSegmentPath, alliedHealthLessonsIndexPath } from "@/lib/lessons/lesson-routes";

// ─── Allied Health Homepage Hero ─────────────────────────────────────────────

const HERO_PROFESSION_CHIPS = [
  { label: "Respiratory Therapy" },
  { label: "Medical Laboratory" },
  { label: "Paramedicine" },
  { label: "Physiotherapy" },
  { label: "Diagnostic Imaging" },
  { label: "Occupational Therapy" },
  { label: "Social Work" },
  { label: "Pharmacy Tech" },
] as const;

export function AlliedHealthHero({
  professionExplorerHref,
  pricingHref,
}: {
  professionExplorerHref: string;
  pricingHref: string;
}) {
  return (
    <header
      className="nn-gradient-safe relative overflow-hidden rounded-[1.75rem] border px-6 py-10 shadow-[var(--semantic-shadow-soft)] sm:px-11 sm:py-14"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-info) 22%, var(--semantic-border-soft))",
        background:
          "linear-gradient(155deg, color-mix(in srgb, var(--semantic-info) 7%, var(--semantic-surface)) 0%, var(--semantic-surface) 50%, color-mix(in srgb, var(--semantic-success) 6%, var(--semantic-panel-cool)) 100%)",
      }}
    >
      {/* Ambient blobs */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--semantic-info) 14%, transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-16 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--semantic-success) 10%, transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-0 top-10 hidden h-[calc(100%-5rem)] w-1 rounded-full bg-gradient-to-b from-[var(--semantic-info)] via-[color-mix(in_srgb,var(--semantic-info)_40%,transparent)] to-transparent sm:block"
        aria-hidden
      />

      <div className="relative">
        {/* Eyebrow */}
        <p className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-info)]">
          <Globe2 className="h-3 w-3" aria-hidden />
          Allied Health Pathways
        </p>

        {/* Headline */}
        <h1 className="nn-marketing-h1 mt-4 max-w-[min(100%,44rem)] text-balance text-[var(--theme-heading-text)]">
          Built for{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--semantic-info) 0%, var(--semantic-success) 100%)",
            }}
          >
            Allied Health Professionals
          </span>
        </h1>

        {/* Subheadline */}
        <p className="nn-marketing-body mt-5 max-w-2xl text-pretty text-[var(--semantic-text-secondary)] sm:text-lg">
          Personalized learning pathways, profession-specific content, adaptive practice,
          simulations, and competency development — scoped exactly to your career.
        </p>

        {/* Profession chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {HERO_PROFESSION_CHIPS.map(({ label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)]"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--semantic-info)" }}
                aria-hidden
              />
              {label}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={professionExplorerHref} className={`${MARKETING_PRIMARY_CTA_CLASS} gap-2`}>
            Choose Your Profession
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href={pricingHref} className={`${MARKETING_SECONDARY_CTA_CLASS} gap-2`}>
            View Allied Plans
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Profession Explorer ─────────────────────────────────────────────────────

type ProfessionCard = {
  label: string;
  description: string;
  icon: ElementType;
  accent: string;
  segment?: string;
  professionKey?: string;
  comingSoon?: boolean;
};

const PROFESSION_CARDS: ProfessionCard[] = [
  {
    label: "Respiratory Therapy",
    description:
      "Ventilator management, pulmonary function, ACLS, and RRT/CRT exam preparation.",
    icon: Wind,
    accent: "--semantic-info",
    segment: "respiratory-therapy-exam-prep",
    professionKey: "respiratory",
  },
  {
    label: "Medical Laboratory",
    description:
      "Specimen collection, safety protocols, CBC interpretation, and MLT/CMLTO exam prep.",
    icon: Microscope,
    accent: "--semantic-chart-2",
    segment: "mlt-exam-prep",
    professionKey: "mlt",
  },
  {
    label: "Diagnostic Imaging",
    description:
      "Radiography positioning, radiation safety, modality judgment, and ARRT exam prep.",
    icon: Scan,
    accent: "--semantic-chart-5",
    segment: "medical-imaging-exam-prep",
    professionKey: "imaging",
  },
  {
    label: "Occupational Therapy",
    description:
      "Activity analysis, ADLs, sensory integration, and OTR/NBCOT certification prep.",
    icon: Brain,
    accent: "--semantic-success",
    segment: "occupational-therapy-exam-prep",
    professionKey: "occupational-therapy",
  },
  {
    label: "Physiotherapy",
    description:
      "Therapeutic exercise, musculoskeletal assessment, rehabilitation, and PT board prep.",
    icon: Activity,
    accent: "--semantic-brand",
    segment: "physiotherapy-exam-prep",
    professionKey: "physiotherapy",
  },
  {
    label: "Paramedicine",
    description:
      "ACLS, trauma assessment, pharmacology, and NREMT/paramedic certification prep.",
    icon: Ambulance,
    accent: "--semantic-chart-1",
    segment: "paramedic-exam-prep",
    professionKey: "paramedic",
  },
  {
    label: "Social Work",
    description:
      "Clinical assessment, ethics, mental health interventions, and LCSW/ASWB exam prep.",
    icon: Users,
    accent: "--semantic-warning",
    segment: "social-work-exam-prep",
    professionKey: "social-work",
  },
  {
    label: "Pharmacy Technology",
    description:
      "Drug dosing, compounding, dispensing workflow, and PTCE/ExCPT certification prep.",
    icon: Pill,
    accent: "--semantic-chart-4",
    segment: "pharmacy-tech-exam-prep",
    professionKey: "pharmacy-tech",
  },
  {
    label: "More Allied Programs",
    description:
      "EMT, medical assistant, dental hygiene, OTA, PTA, dietetics, and additional tracks.",
    icon: Sparkles,
    accent: "--semantic-chart-3",
    comingSoon: false,
  },
] as const;

export function AlliedProfessionExplorer() {
  return (
    <section
      className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8"
      aria-labelledby="allied-profession-explorer-heading"
      id="allied-professions-explorer"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-info)]">
            Profession Explorer
          </p>
          <h2
            id="allied-profession-explorer-heading"
            className="nn-marketing-h2 mt-2 text-balance text-[var(--theme-heading-text)]"
          >
            Find your allied health pathway
          </h2>
          <p className="nn-marketing-body-sm mt-3 max-w-xl text-[var(--semantic-text-secondary)]">
            Every profession gets its own dedicated learning ecosystem — not a nursing hub with a
            different label. Content, questions, and simulations scoped to your career.
          </p>
        </div>
        <Link
          href="/allied-health"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-2 text-sm font-semibold text-[var(--semantic-info)] transition hover:border-[var(--semantic-info)] hover:bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--semantic-surface))]"
        >
          All professions
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROFESSION_CARDS.map((card) => {
          const Icon = card.icon;
          const href = card.segment
            ? alliedHealthSegmentPath(card.segment)
            : "/allied-health";
          return (
            <Link
              key={card.label}
              href={href}
              className="group flex flex-col overflow-hidden rounded-xl border transition hover:-translate-y-0.5 hover:shadow-[var(--semantic-shadow-soft)]"
              style={
                {
                  borderColor: `color-mix(in srgb, var(${card.accent}) 20%, var(--semantic-border-soft))`,
                } as CSSProperties
              }
            >
              {/* Top accent bar */}
              <div
                className="h-1"
                style={
                  {
                    background: `linear-gradient(90deg, var(${card.accent}), color-mix(in srgb, var(${card.accent}) 40%, transparent))`,
                  } as CSSProperties
                }
                aria-hidden
              />
              <div
                className="flex flex-1 flex-col p-5"
                style={
                  {
                    background: `color-mix(in srgb, var(${card.accent}) 4%, var(--semantic-surface))`,
                  } as CSSProperties
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                    style={
                      {
                        borderColor: `color-mix(in srgb, var(${card.accent}) 28%, var(--semantic-border-soft))`,
                        background: `color-mix(in srgb, var(${card.accent}) 12%, var(--semantic-surface))`,
                        color: `var(${card.accent})`,
                      } as CSSProperties
                    }
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ArrowRight
                    className="mt-1 h-4 w-4 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-60"
                    style={{ color: `var(${card.accent})` } as CSSProperties}
                    aria-hidden
                  />
                </div>
                <h3 className="mt-3 text-sm font-bold text-[var(--theme-heading-text)]">
                  {card.label}
                </h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                  {card.description}
                </p>
                <p
                  className="mt-4 text-xs font-semibold"
                  style={{ color: `var(${card.accent})` } as CSSProperties}
                >
                  Explore pathway →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── Allied Learning Ecosystem ───────────────────────────────────────────────

const ALLIED_ECOSYSTEM_MODES = [
  {
    key: "lessons",
    title: "Profession-Specific Lessons",
    body: "Content scoped to your occupation — not shared with nursing pathways.",
    icon: BookOpen,
    accent: "--semantic-brand",
  },
  {
    key: "flashcards",
    title: "Flashcards",
    body: "Spaced-repetition recall for terminology, procedures, and exam content.",
    icon: Brain,
    accent: "--semantic-chart-2",
  },
  {
    key: "questions",
    title: "Practice Questions",
    body: "Profession-matched exam items with clinical rationale.",
    icon: ClipboardList,
    accent: "--semantic-info",
  },
  {
    key: "simulations",
    title: "Clinical Simulations",
    body: "Decision-point scenarios built around your real clinical environment.",
    icon: Zap,
    accent: "--semantic-chart-1",
  },
  {
    key: "clinical-skills",
    title: "Clinical Skills",
    body: "Procedural competency frameworks and OSCE-style practice.",
    icon: Stethoscope,
    accent: "--semantic-success",
  },
  {
    key: "analytics",
    title: "Competency Tracking",
    body: "Measure your proficiency by domain, monitor growth, and plan targeted review.",
    icon: BarChart3,
    accent: "--semantic-warning",
  },
] as const;

export function AlliedHealthLearningEcosystem() {
  return (
    <section
      className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] p-6 sm:p-8"
      aria-labelledby="allied-ecosystem-heading"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-info)]">
          Profession-Specific Learning
        </p>
        <h2
          id="allied-ecosystem-heading"
          className="nn-marketing-h2 mt-2 text-balance text-[var(--theme-heading-text)]"
        >
          Every tool your profession needs
        </h2>
        <p className="nn-marketing-body-sm mt-3 text-[var(--semantic-text-secondary)]">
          Lessons, flashcards, questions, simulations, clinical skills, and analytics — all
          scoped to your allied health pathway, not shared nursing content.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {ALLIED_ECOSYSTEM_MODES.map((mode) => {
          const Icon = mode.icon;
          return (
            <div
              key={mode.key}
              className="flex flex-col rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] hover:shadow-md"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl border"
                style={
                  {
                    borderColor: `color-mix(in srgb, var(${mode.accent}) 28%, var(--semantic-border-soft))`,
                    background: `color-mix(in srgb, var(${mode.accent}) 12%, var(--semantic-surface))`,
                    color: `var(${mode.accent})`,
                  } as CSSProperties
                }
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-3 text-sm font-bold text-[var(--theme-heading-text)]">
                {mode.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                {mode.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Career Growth Section ────────────────────────────────────────────────────

const CAREER_OUTCOMES = [
  {
    icon: Target,
    title: "Exam Success",
    body: "Targeted prep aligned to your certification body — RRT, ARRT, NREMT, PTCE, and more.",
    accent: "--semantic-brand",
  },
  {
    icon: ShieldCheck,
    title: "Clinical Confidence",
    body: "Scenario-based practice that builds real decision-making skill for the clinical environment.",
    accent: "--semantic-success",
  },
  {
    icon: TrendingUp,
    title: "Competency Development",
    body: "Track your growth across professional domains and identify exactly what needs work.",
    accent: "--semantic-info",
  },
  {
    icon: GraduationCap,
    title: "Continuing Education",
    body: "Build a study habit that carries you through CE requirements and professional growth.",
    accent: "--semantic-chart-2",
  },
  {
    icon: Heart,
    title: "Clinical Excellence",
    body: "Go beyond exam prep into applied clinical reasoning that matters at the bedside.",
    accent: "--semantic-chart-5",
  },
  {
    icon: Users,
    title: "Professional Growth",
    body: "Develop the interprofessional skills that elevate your standing on any care team.",
    accent: "--semantic-warning",
  },
] as const;

export function AlliedCareerGrowth({ pricingHref }: { pricingHref: string }) {
  return (
    <section
      className="nn-gradient-safe relative overflow-hidden rounded-[1.75rem] border p-8 sm:p-10"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-info) 22%, var(--semantic-border-soft))",
        background:
          "linear-gradient(155deg, color-mix(in srgb, var(--semantic-info) 6%, var(--semantic-surface)) 0%, var(--semantic-surface) 52%, color-mix(in srgb, var(--semantic-success) 5%, var(--semantic-panel-cool)) 100%)",
      }}
      aria-labelledby="allied-career-growth-heading"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-50"
        style={{ background: "color-mix(in srgb, var(--semantic-info) 14%, transparent)" }}
        aria-hidden
      />

      <div className="relative">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-info)]">
          Career Growth
        </p>
        <h2
          id="allied-career-growth-heading"
          className="nn-marketing-h2 mt-2 max-w-2xl text-balance text-[var(--theme-heading-text)]"
        >
          From exam readiness to career excellence
        </h2>
        <p className="nn-marketing-body-sm mt-3 max-w-xl text-[var(--semantic-text-secondary)]">
          NurseNest supports your entire allied health career arc — certification prep, clinical
          competency development, continuing education, and professional growth.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CAREER_OUTCOMES.map(({ icon: Icon, title, body, accent }) => (
            <div key={title} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={
                  {
                    background: `color-mix(in srgb, var(${accent}) 12%, var(--semantic-surface))`,
                    color: `var(${accent})`,
                  } as CSSProperties
                }
              >
                <Icon className="h-4.5 w-4.5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[var(--theme-heading-text)]">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={pricingHref} className={`${MARKETING_PRIMARY_CTA_CLASS} gap-2`}>
            View Allied Health Plans
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/allied-health" className={`${MARKETING_SECONDARY_CTA_CLASS} gap-2`}>
            Explore Professions
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Allied Testimonial Strip ─────────────────────────────────────────────────

const ALLIED_TESTIMONIALS = [
  {
    quote:
      "Finally a platform that actually knows what RT does. Not just nursing content with 'respiratory' slapped on it.",
    role: "Respiratory Therapy Student",
    initials: "D.M.",
  },
  {
    quote:
      "The MLT practice questions felt like they were written by someone who had actually worked in a lab.",
    role: "MLT Certification Candidate",
    initials: "J.L.",
  },
  {
    quote:
      "The paramedic pathway covers the right protocols. I could tell it wasn't just rebranded nursing content.",
    role: "Paramedic Certification Student",
    initials: "C.R.",
  },
] as const;

export function AlliedTestimonialStrip() {
  return (
    <section
      className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8"
      aria-label="Allied health professional testimonials"
    >
      <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-info)]">
        What Allied Health Learners Say
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {ALLIED_TESTIMONIALS.map((t) => (
          <blockquote
            key={t.initials}
            className="flex flex-col rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-5"
          >
            <p className="flex-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              &ldquo;{t.quote}&rdquo;
            </p>
            <footer className="mt-4 flex items-center gap-2.5 border-t border-[var(--semantic-border-soft)] pt-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-surface))] text-xs font-bold text-[var(--semantic-info)]">
                {t.initials}
              </span>
              <span className="text-xs font-semibold text-[var(--theme-heading-text)]">{t.role}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

// ─── Allied Full Homepage Compositor ─────────────────────────────────────────

export function AlliedHealthHomepage({
  professionExplorerHref = "#allied-professions-explorer",
  pricingHref = "/pricing",
}: {
  professionExplorerHref?: string;
  pricingHref?: string;
}) {
  return (
    <div className="space-y-10" data-nn-allied-health-homepage="1">
      <AlliedHealthHero
        professionExplorerHref={professionExplorerHref}
        pricingHref={pricingHref}
      />
      <AlliedProfessionExplorer />
      <AlliedHealthLearningEcosystem />
      <AlliedTestimonialStrip />
      <AlliedCareerGrowth pricingHref={pricingHref} />
    </div>
  );
}
