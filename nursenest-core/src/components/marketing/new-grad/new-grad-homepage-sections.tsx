"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  BriefcaseMedical,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Flame,
  FlaskConical,
  GraduationCap,
  Heart,
  Lightbulb,
  MessageSquare,
  Pill,
  ShieldCheck,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type { CSSProperties } from "react";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

// ─── New Grad Homepage Hero ──────────────────────────────────────────────────

const HERO_CLINICAL_CHIPS = [
  { label: "Clinical Judgment", icon: Brain },
  { label: "Medication Safety", icon: Pill },
  { label: "Prioritization", icon: Target },
  { label: "Telemetry & ECG", icon: Activity },
  { label: "Clinical Skills", icon: Stethoscope },
  { label: "Time Management", icon: Clock },
] as const;

const HERO_STATS = [
  { value: "20+", label: "Clinical work areas" },
  { value: "1,000+", label: "Transition-to-practice questions" },
  { value: "8", label: "Core competency domains" },
] as const;

export function NewGradHeroFull({
  primaryHref,
  simulationsHref,
}: {
  primaryHref: string;
  simulationsHref?: string;
}) {
  return (
    <header
      className="nn-gradient-safe relative overflow-hidden rounded-[1.75rem] border px-6 py-10 shadow-[var(--semantic-shadow-soft)] sm:px-11 sm:py-14"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-chart-2) 22%, var(--semantic-border-soft))",
        background:
          "linear-gradient(155deg, color-mix(in srgb, var(--semantic-chart-2) 8%, var(--semantic-surface)) 0%, var(--semantic-surface) 48%, color-mix(in srgb, var(--semantic-brand) 6%, var(--semantic-panel-cool)) 100%)",
      }}
    >
      {/* Ambient blobs */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--semantic-chart-2) 16%, transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-16 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--semantic-brand) 10%, transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/3 top-1/2 hidden h-48 w-48 -translate-y-1/2 rounded-full blur-3xl opacity-60 sm:block"
        style={{ background: "color-mix(in srgb, var(--semantic-success) 7%, transparent)" }}
        aria-hidden
      />
      {/* Left accent bar */}
      <div
        className="pointer-events-none absolute left-0 top-10 hidden h-[calc(100%-5rem)] w-1 rounded-full bg-gradient-to-b from-[var(--semantic-chart-2)] via-[color-mix(in_srgb,var(--semantic-chart-2)_40%,transparent)] to-transparent sm:block"
        aria-hidden
      />

      <div className="relative">
        {/* Eyebrow */}
        <p className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-2)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_10%,var(--semantic-surface))] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-chart-2)]">
          <GraduationCap className="h-3 w-3" aria-hidden />
          First-Year Nurse Residency Program
        </p>

        {/* Headline */}
        <h1 className="nn-marketing-h1 mt-4 max-w-[min(100%,42rem)] text-balance text-[var(--theme-heading-text)]">
          Start Your Nursing Career{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--semantic-chart-2) 0%, var(--semantic-brand) 100%)",
            }}
          >
            With Confidence
          </span>
        </h1>

        {/* Subheadline */}
        <p className="nn-marketing-body mt-5 max-w-2xl text-pretty text-[var(--semantic-text-secondary)] sm:text-lg">
          Practice real clinical scenarios, strengthen clinical judgment, build medication
          confidence, improve prioritization, and prepare for your first year as a nurse.
        </p>

        {/* Clinical chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {HERO_CLINICAL_CHIPS.map(({ label, icon: Icon }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)]"
            >
              <Icon className="h-3.5 w-3.5 text-[var(--semantic-chart-2)]" aria-hidden />
              {label}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={primaryHref} className={`${MARKETING_PRIMARY_CTA_CLASS} gap-2`}>
            Explore New Grad Program
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          {simulationsHref && (
            <Link href={simulationsHref} className={`${MARKETING_SECONDARY_CTA_CLASS} gap-2`}>
              <Stethoscope className="h-4 w-4" aria-hidden />
              View Simulations
            </Link>
          )}
        </div>

        {/* Stats strip */}
        <div className="mt-8 flex flex-wrap gap-6 border-t border-[var(--semantic-border-soft)] pt-6">
          {HERO_STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col">
              <span className="text-xl font-black text-[var(--semantic-chart-2)] sm:text-2xl">
                {value}
              </span>
              <span className="text-xs text-[var(--semantic-text-secondary)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

// ─── First-Year Success Framework ───────────────────────────────────────────

const FRAMEWORK_DOMAINS = [
  {
    key: "judgment",
    title: "Clinical Judgment",
    body: "Recognize, analyze, prioritize, generate solutions, and evaluate outcomes at the bedside.",
    icon: Brain,
    accent: "--semantic-brand",
  },
  {
    key: "medication",
    title: "Medication Safety",
    body: "High-alert drugs, hold parameters, dosage calculations, and administration safety checks.",
    icon: Pill,
    accent: "--semantic-chart-5",
  },
  {
    key: "skills",
    title: "Clinical Skills",
    body: "Assessments, procedures, OSCE communication, escalation, and safe bedside sequencing.",
    icon: Stethoscope,
    accent: "--semantic-success",
  },
  {
    key: "telemetry",
    title: "Telemetry & ECG",
    body: "Rhythm recognition, lead placement, alarm interpretation, and bedside pattern reading.",
    icon: Activity,
    accent: "--semantic-chart-2",
  },
  {
    key: "prioritization",
    title: "Prioritization",
    body: "Who to see first, task sequencing, delegation, and charge-nurse communication.",
    icon: Target,
    accent: "--semantic-warning",
  },
  {
    key: "communication",
    title: "Communication",
    body: "SBAR, hand-off reports, interdisciplinary collaboration, and difficult conversations.",
    icon: MessageSquare,
    accent: "--semantic-info",
  },
  {
    key: "documentation",
    title: "Documentation",
    body: "Charting standards, incident reporting, legal clarity, and real-time accuracy.",
    icon: ClipboardCheck,
    accent: "--semantic-chart-4",
  },
  {
    key: "simulation",
    title: "Simulation",
    body: "Deteriorating patient scenarios, rapid response, shift emergencies, and handoffs.",
    icon: Flame,
    accent: "--semantic-chart-1",
  },
] as const;

export function NewGradFirstYearFramework({
  lessonsHref,
}: {
  lessonsHref: string;
}) {
  return (
    <section
      className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8"
      aria-labelledby="ng-framework-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
            <GraduationCap className="h-3 w-3" aria-hidden />
            First-Year Success Framework
          </p>
          <h2
            id="ng-framework-heading"
            className="nn-marketing-h2 mt-2 text-balance text-[var(--theme-heading-text)]"
          >
            Eight domains every new grad needs to master
          </h2>
          <p className="nn-marketing-body-sm mt-3 max-w-xl text-[var(--semantic-text-secondary)]">
            Not NCLEX prep. Not a question bank. A transition-to-practice program built around the
            real competencies of your first year on the floor.
          </p>
        </div>
        <Link
          href={lessonsHref}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-2 text-sm font-semibold text-[var(--semantic-brand)] transition hover:border-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))]"
        >
          View all lessons
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FRAMEWORK_DOMAINS.map((domain) => {
          const Icon = domain.icon;
          return (
            <article
              key={domain.key}
              className="flex flex-col rounded-xl border p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--semantic-shadow-soft)]"
              style={
                {
                  borderColor: `color-mix(in srgb, var(${domain.accent}) 22%, var(--semantic-border-soft))`,
                  background: `color-mix(in srgb, var(${domain.accent}) 5%, var(--semantic-surface))`,
                } as CSSProperties
              }
            >
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border"
                style={
                  {
                    borderColor: `color-mix(in srgb, var(${domain.accent}) 28%, var(--semantic-border-soft))`,
                    background: `color-mix(in srgb, var(${domain.accent}) 12%, var(--semantic-surface))`,
                    color: `var(${domain.accent})`,
                  } as CSSProperties
                }
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-3 text-sm font-bold text-[var(--theme-heading-text)]">
                {domain.title}
              </h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                {domain.body}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ─── Real Clinical Scenarios ──────────────────────────────────────────────

const CLINICAL_SCENARIOS = [
  {
    key: "deteriorating",
    title: "Deteriorating Patient",
    body: "Recognize early warning signs, call rapid response, intervene before a code.",
    icon: AlertTriangle,
    accent: "--semantic-chart-1",
    tag: "High Acuity",
  },
  {
    key: "busy-shift",
    title: "Busy Shift Management",
    body: "Juggle five patients with competing needs, delegate safely, and close the shift cleanly.",
    icon: Clock,
    accent: "--semantic-warning",
    tag: "Prioritization",
  },
  {
    key: "multiple-assignments",
    title: "Multiple Assignments",
    body: "Triage competing orders, rebalance your assignment, and communicate with the charge nurse.",
    icon: ClipboardList,
    accent: "--semantic-info",
    tag: "Delegation",
  },
  {
    key: "rapid-response",
    title: "Rapid Response",
    body: "Lead the bedside assessment before the team arrives and communicate findings using SBAR.",
    icon: Zap,
    accent: "--semantic-chart-2",
    tag: "Team Communication",
  },
  {
    key: "handoff",
    title: "End-of-Shift Handoff",
    body: "Structured report with pending tasks, unstable findings, and family concerns captured.",
    icon: MessageSquare,
    accent: "--semantic-success",
    tag: "Documentation",
  },
  {
    key: "medication-admin",
    title: "Medication Administration",
    body: "Five rights, hold parameters, patient questions, and safe documentation under time pressure.",
    icon: Pill,
    accent: "--semantic-chart-5",
    tag: "Medication Safety",
  },
] as const;

export function NewGradClinicalScenarios({
  simulationsHref,
}: {
  simulationsHref?: string;
}) {
  return (
    <section
      className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-6 sm:p-8"
      aria-labelledby="ng-scenarios-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
            Real Clinical Scenarios
          </p>
          <h2
            id="ng-scenarios-heading"
            className="nn-marketing-h2 mt-2 text-balance text-[var(--theme-heading-text)]"
          >
            Practice the moments that define your first year
          </h2>
          <p className="nn-marketing-body-sm mt-3 max-w-xl text-[var(--semantic-text-secondary)]">
            Not hypotheticals. Real shift scenarios with competing priorities, time pressure, and
            clinical decisions that matter.
          </p>
        </div>
        {simulationsHref && (
          <Link
            href={simulationsHref}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-sm font-semibold text-[var(--semantic-brand)] transition hover:border-[var(--semantic-brand)]"
          >
            All simulations
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CLINICAL_SCENARIOS.map((scenario) => {
          const Icon = scenario.icon;
          return (
            <article
              key={scenario.key}
              className="flex flex-col rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                  style={
                    {
                      borderColor: `color-mix(in srgb, var(${scenario.accent}) 26%, var(--semantic-border-soft))`,
                      background: `color-mix(in srgb, var(${scenario.accent}) 10%, var(--semantic-surface))`,
                      color: `var(${scenario.accent})`,
                    } as CSSProperties
                  }
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <span
                    className="text-[0.6rem] font-bold uppercase tracking-wider"
                    style={{ color: `var(${scenario.accent})` } as CSSProperties}
                  >
                    {scenario.tag}
                  </span>
                  <h3 className="mt-0.5 text-sm font-bold text-[var(--theme-heading-text)]">
                    {scenario.title}
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                {scenario.body}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ─── New Grad Dashboard Preview ──────────────────────────────────────────────

const READINESS_BARS = [
  { label: "Clinical Judgment", pct: 78, accent: "--semantic-brand" },
  { label: "Medication Safety", pct: 64, accent: "--semantic-chart-5" },
  { label: "Telemetry & ECG", pct: 55, accent: "--semantic-chart-2" },
  { label: "Clinical Skills", pct: 71, accent: "--semantic-success" },
  { label: "Prioritization", pct: 83, accent: "--semantic-warning" },
] as const;

const READINESS_CHIPS = [
  { label: "Cardiac Meds", status: "review", color: "--semantic-warning" },
  { label: "SBAR Handoff", status: "strong", color: "--semantic-success" },
  { label: "Ventilator Alarms", status: "review", color: "--semantic-warning" },
  { label: "Delegation Rules", status: "strong", color: "--semantic-success" },
  { label: "Sepsis Bundles", status: "focus", color: "--semantic-chart-1" },
  { label: "ECG Interpretation", status: "focus", color: "--semantic-chart-1" },
] as const;

export function NewGradDashboardPreview({ dashboardHref }: { dashboardHref: string }) {
  return (
    <section
      className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8"
      aria-labelledby="ng-dashboard-heading"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        {/* Left: copy */}
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
            New Grad Dashboard Preview
          </p>
          <h2
            id="ng-dashboard-heading"
            className="nn-marketing-h2 mt-2 text-balance text-[var(--theme-heading-text)]"
          >
            Know exactly where you stand every shift
          </h2>
          <p className="nn-marketing-body-sm mt-3 leading-relaxed text-[var(--semantic-text-secondary)]">
            Your personal readiness dashboard tracks clinical confidence, skill development,
            medication knowledge, and telemetry proficiency — pinpointing exactly what to study
            before your next shift.
          </p>

          <ul className="mt-5 space-y-2.5">
            {[
              "Confidence score updated after every session",
              "Skill readiness by clinical domain",
              "Medication safety knowledge gaps surfaced",
              "Telemetry proficiency with drill recommendations",
              "Weak-area routing to targeted content",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                <span className="text-[var(--semantic-text-secondary)]">{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href={dashboardHref}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-brand)] transition hover:border-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))]"
          >
            <TrendingUp className="h-4 w-4" aria-hidden />
            View your dashboard
          </Link>
        </div>

        {/* Right: mock dashboard UI */}
        <div
          className="overflow-hidden rounded-xl border border-[var(--semantic-border-soft)] shadow-[var(--semantic-shadow-soft)]"
          aria-hidden
        >
          {/* Mock header bar */}
          <div className="border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BriefcaseMedical className="h-4 w-4 text-[var(--semantic-brand)]" />
                <span className="text-xs font-bold text-[var(--theme-heading-text)]">
                  New Grad Readiness
                </span>
              </div>
              <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))] px-2.5 py-0.5 text-[0.65rem] font-semibold text-[var(--semantic-success)]">
                Day 47 of Residency
              </span>
            </div>
          </div>

          <div className="bg-[var(--semantic-surface)] p-5">
            {/* Confidence score */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                  Overall Confidence
                </p>
                <p className="mt-0.5 text-3xl font-black text-[var(--semantic-brand)]">74%</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))]">
                <span className="text-sm font-black text-[var(--semantic-brand)]">B+</span>
              </div>
            </div>

            {/* Progress bars */}
            <div className="mt-5 space-y-3">
              {READINESS_BARS.map(({ label, pct, accent }) => (
                <div key={label}>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.7rem] font-semibold text-[var(--theme-heading-text)]">
                      {label}
                    </span>
                    <span
                      className="text-[0.7rem] font-bold"
                      style={{ color: `var(${accent})` } as CSSProperties}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--semantic-panel-muted)]">
                    <div
                      className="h-full rounded-full"
                      style={
                        {
                          width: `${pct}%`,
                          background: `var(${accent})`,
                        } as CSSProperties
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Weak areas */}
            <div className="mt-5">
              <p className="text-[0.7rem] font-bold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
                Focus Areas
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {READINESS_CHIPS.map(({ label, status, color }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold"
                    style={
                      {
                        borderColor: `color-mix(in srgb, var(${color}) 28%, var(--semantic-border-soft))`,
                        background: `color-mix(in srgb, var(${color}) 10%, var(--semantic-surface))`,
                        color: `var(${color})`,
                      } as CSSProperties
                    }
                  >
                    {status === "strong" && <CheckCircle2 className="h-2.5 w-2.5" />}
                    {status === "review" && <Clock className="h-2.5 w-2.5" />}
                    {status === "focus" && <AlertTriangle className="h-2.5 w-2.5" />}
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Learning Ecosystem ──────────────────────────────────────────────────────

const ECOSYSTEM_MODES = [
  {
    key: "lessons",
    title: "Lessons",
    body: "Concise clinical teaching scoped to transition-to-practice — not generic NCLEX review.",
    icon: BookOpen,
    accent: "--semantic-brand",
    hrefKey: "lessons" as const,
  },
  {
    key: "flashcards",
    title: "Flashcards",
    body: "Spaced-repetition recall for medications, labs, prioritization, and clinical pearls.",
    icon: Brain,
    accent: "--semantic-chart-2",
    hrefKey: "flashcards" as const,
  },
  {
    key: "questions",
    title: "Practice Questions",
    body: "NCLEX-style items written for new grad clinical judgment — not generic test prep.",
    icon: ClipboardList,
    accent: "--semantic-info",
    hrefKey: "questions" as const,
  },
  {
    key: "simulations",
    title: "Simulations",
    body: "Unfolding bedside scenarios with real-time decision points and feedback.",
    icon: Flame,
    accent: "--semantic-chart-1",
    hrefKey: "simulations" as const,
  },
  {
    key: "clinical-skills",
    title: "Clinical Skills",
    body: "OSCE-style communication, escalation, and bedside sequencing practice.",
    icon: Stethoscope,
    accent: "--semantic-success",
    hrefKey: "clinicalSkills" as const,
  },
  {
    key: "pharmacology",
    title: "Pharmacology",
    body: "High-alert drugs, hold parameters, dosage calculations, and interaction alerts.",
    icon: Pill,
    accent: "--semantic-chart-5",
    hrefKey: "pharmacology" as const,
  },
  {
    key: "ecg",
    title: "ECG & Telemetry",
    body: "Rhythm strips, lead interpretation, and bedside alarm management.",
    icon: Activity,
    accent: "--semantic-chart-4",
    hrefKey: "ecg" as const,
  },
  {
    key: "analytics",
    title: "Analytics",
    body: "Performance tracking, weak-area identification, and readiness scoring.",
    icon: TrendingUp,
    accent: "--semantic-warning",
    hrefKey: "dashboard" as const,
  },
] as const;

type EcosystemHrefs = Partial<Record<(typeof ECOSYSTEM_MODES)[number]["hrefKey"], string>>;

export function NewGradLearningEcosystem({
  hrefs,
}: {
  hrefs: EcosystemHrefs;
}) {
  return (
    <section
      className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] p-6 sm:p-8"
      aria-labelledby="ng-ecosystem-heading"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
          New Grad Learning Ecosystem
        </p>
        <h2
          id="ng-ecosystem-heading"
          className="nn-marketing-h2 mt-2 text-balance text-[var(--theme-heading-text)]"
        >
          One platform. Every tool you need for year one.
        </h2>
        <p className="nn-marketing-body-sm mt-3 text-[var(--semantic-text-secondary)]">
          Lessons, flashcards, questions, simulations, clinical skills, pharmacology, ECG, and
          analytics — all scoped to the transition-to-practice pathway.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {ECOSYSTEM_MODES.map((mode) => {
          const Icon = mode.icon;
          const href = hrefs[mode.hrefKey];
          const inner = (
            <>
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
            </>
          );
          const sharedClass =
            "flex flex-col rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] hover:shadow-md";
          if (href) {
            return (
              <Link key={mode.key} href={href} className={sharedClass}>
                {inner}
              </Link>
            );
          }
          return (
            <div key={mode.key} className={sharedClass}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── Testimonial / Social Proof Strip ────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "This felt like it was built for me, not for NCLEX. I actually felt prepared for my first shift in the ICU.",
    role: "New Grad RN · Cardiac ICU",
    initials: "S.K.",
  },
  {
    quote:
      "The clinical scenarios for medication safety changed how I think at the bedside. Way more relevant than a question bank.",
    role: "New Grad RN · Medical–Surgical",
    initials: "M.T.",
  },
  {
    quote:
      "Being able to track my readiness by domain — not just one score — helped me focus my study time before each shift.",
    role: "New Grad RN · Emergency Department",
    initials: "A.R.",
  },
] as const;

export function NewGradTestimonialStrip() {
  return (
    <section
      className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8"
      aria-label="New grad nurse testimonials"
    >
      <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
        What New Grad Nurses Say
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <blockquote
            key={t.initials}
            className="flex flex-col rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-5"
          >
            <p className="flex-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              &ldquo;{t.quote}&rdquo;
            </p>
            <footer className="mt-4 flex items-center gap-2.5 border-t border-[var(--semantic-border-soft)] pt-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))] text-xs font-bold text-[var(--semantic-brand)]">
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

// ─── Career Outcomes Banner ───────────────────────────────────────────────────

const OUTCOME_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Orientation Readiness",
    body: "Enter orientation with clinical judgment skills already in progress.",
  },
  {
    icon: Heart,
    title: "Patient Safety Confidence",
    body: "Know your high-alert medications, safety checks, and escalation paths cold.",
  },
  {
    icon: Users,
    title: "Team Communication",
    body: "Deliver clean hand-offs, effective SBAR, and clear interdisciplinary reports.",
  },
  {
    icon: Lightbulb,
    title: "First-Year Survival Skills",
    body: "Prioritize, delegate, and manage a full assignment without burning out.",
  },
] as const;

export function NewGradCareerOutcomes({ signUpHref }: { signUpHref: string }) {
  return (
    <section
      className="nn-gradient-safe relative overflow-hidden rounded-[1.75rem] border p-8 sm:p-10"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-brand) 22%, var(--semantic-border-soft))",
        background:
          "linear-gradient(155deg, color-mix(in srgb, var(--semantic-brand) 7%, var(--semantic-surface)) 0%, var(--semantic-surface) 55%, color-mix(in srgb, var(--semantic-chart-2) 6%, var(--semantic-panel-cool)) 100%)",
      }}
      aria-labelledby="ng-outcomes-heading"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full blur-3xl opacity-60"
        style={{ background: "color-mix(in srgb, var(--semantic-brand) 14%, transparent)" }}
        aria-hidden
      />

      <div className="relative">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
          Career-Specific Outcomes
        </p>
        <h2
          id="ng-outcomes-heading"
          className="nn-marketing-h2 mt-2 max-w-2xl text-balance text-[var(--theme-heading-text)]"
        >
          Built for your first year — not your NCLEX date
        </h2>
        <p className="nn-marketing-body-sm mt-3 max-w-xl text-[var(--semantic-text-secondary)]">
          NurseNest is the only platform that treats the transition-to-practice period as a
          distinct clinical journey with its own skills, scenarios, and readiness benchmarks.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OUTCOME_ITEMS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-brand)]">
                <Icon className="h-5 w-5" aria-hidden />
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
          <Link href={signUpHref} className={`${MARKETING_PRIMARY_CTA_CLASS} gap-2`}>
            <GraduationCap className="h-4 w-4" aria-hidden />
            Start Your New Grad Program
          </Link>
        </div>
      </div>
    </section>
  );
}
