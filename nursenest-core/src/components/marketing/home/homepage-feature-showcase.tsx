/**
 * HomepageFeatureShowcase — replaces HomepageEcosystemDiscovery.
 *
 * Server component. No images. No screenshots. No "use client".
 * All visuals rendered from design system tokens and SVG paths.
 *
 * Answers the visitor's 2nd conversion question:
 * "Why is NurseNest different from UWorld and Archer?"
 */
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  FileQuestion,
  FlaskConical,
  GraduationCap,
  Minus,
  Pill,
  School,
  Sparkles,
  XCircle,
} from "lucide-react";

import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShowcaseStats = {
  questionCount: number;
  lessonCount: number;
  flashcardCount: number;
  clinicalSkillCount: number;
  ecgCaseCount: number;
  labCaseCount: number;
  medicationMathCount: number;
};

/** Only show a count if the source is non-zero. Returns null when value is 0 or invalid. */
function safeCount(value: number): number | null {
  return Number.isFinite(value) && value > 0 ? value : null;
}

function formatCount(n: number): string {
  if (n >= 10000) return `${Math.floor(n / 1000)}k+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k+`;
  return `${n}+`;
}

// ─── SECTION 1 — Question Bank + Rationale Mockup ────────────────────────────

/**
 * Token-based question card mockup.
 * Shows: stem, answer options, rationale panel, confidence indicator.
 * No images, no maintenance, works across all themes.
 */
function QuestionMockup() {
  return (
    <div
      className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] shadow-[var(--shadow-card)]"
      aria-label="Example NCLEX-style practice question"
      role="img"
    >
      {/* Question header bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-3">
        <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
          Practice Question · RN
        </span>
        <span className="rounded-full border border-[var(--border-subtle)] px-2.5 py-0.5 text-[0.6rem] font-semibold text-[var(--palette-text-muted)]">
          Clinical Judgment
        </span>
      </div>

      {/* Question stem */}
      <div className="px-5 pt-4 pb-3">
        <p className="text-sm font-semibold leading-relaxed text-[var(--palette-heading)]">
          A nurse is caring for a client who underwent total hip replacement 4 hours ago. The client reports sudden onset
          sharp chest pain and shortness of breath. Which action is the nurse&apos;s priority?
        </p>
      </div>

      {/* Answer choices */}
      <div className="space-y-2 px-5 pb-4" aria-label="Answer options">
        {[
          { label: "A", text: "Administer the prescribed PRN analgesic", selected: false, correct: false },
          { label: "B", text: "Obtain a 12-lead ECG immediately", selected: false, correct: false },
          { label: "C", text: "Elevate the head of bed and apply oxygen", selected: true, correct: false },
          { label: "D", text: "Notify the provider and prepare for emergent imaging", selected: false, correct: true },
        ].map((opt) => (
          <div
            key={opt.label}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
              opt.correct
                ? "border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--theme-card-bg))] text-[var(--palette-heading)]"
                : opt.selected
                  ? "border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-danger)_6%,var(--theme-card-bg))] text-[var(--palette-text-muted)]"
                  : "border-[var(--border-subtle)] text-[var(--palette-text-muted)]"
            }`}
            aria-label={`Option ${opt.label}${opt.correct ? " — correct answer" : opt.selected ? " — selected, incorrect" : ""}`}
          >
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-bold ${
              opt.correct
                ? "border-[var(--semantic-success)] bg-[color-mix(in_srgb,var(--semantic-success)_15%,transparent)] text-[var(--semantic-success)]"
                : opt.selected
                  ? "border-[var(--semantic-danger)] bg-[color-mix(in_srgb,var(--semantic-danger)_15%,transparent)] text-[var(--semantic-danger)]"
                  : "border-[var(--border-medium)] text-[var(--palette-text-muted)]"
            }`}>
              {opt.label}
            </span>
            <span className="leading-snug">{opt.text}</span>
          </div>
        ))}
      </div>

      {/* Rationale panel */}
      <div className="border-t border-[color-mix(in_srgb,var(--semantic-success)_20%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-success)_5%,var(--theme-card-bg))] px-5 py-4">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
          <div>
            <p className="text-xs font-black text-[var(--palette-heading)]">Rationale</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--palette-text-muted)]">
              Sudden chest pain and dyspnea after joint surgery indicates pulmonary embolism until proven otherwise.
              The priority is provider notification and emergent CT pulmonary angiography.
              Applying oxygen is a supportive measure but does not address the underlying emergency.
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2.5 border-t border-[color-mix(in_srgb,var(--semantic-success)_15%,var(--border-subtle))] pt-3">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-warning)]" aria-hidden />
          <p className="text-[0.67rem] leading-relaxed text-[var(--palette-text-muted)]">
            <strong className="text-[var(--palette-heading)]">Clinical Pearl:</strong> Virchow&apos;s triad —
            venous stasis, endothelial injury, hypercoagulability — explains post-surgical PE risk.
            Immobility after hip replacement activates all three.
          </p>
        </div>
      </div>
    </div>
  );
}

function QuestionBankSection({ questionCount }: { questionCount: number }) {
  const count = safeCount(questionCount);
  return (
    <section
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      aria-labelledby="showcase-question-bank-heading"
    >
      <div className="nn-section-shell">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* Copy column */}
          <div className="min-w-0">
            <p className="nn-premium-home-eyebrow">Question Bank</p>
            <h2
              id="showcase-question-bank-heading"
              className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
            >
              Practice the same questions used on today&apos;s NCLEX.
            </h2>
            <p className="nn-marketing-body mt-3 text-pretty text-[var(--palette-text-muted)]">
              {count
                ? `${formatCount(count)} exam-style questions with rationales that explain the clinical thinking — not just the answer.`
                : "Exam-style questions with rationales that explain the clinical thinking — not just the answer."
              }{" "}
              Every question teaches the reasoning behind the decision, so you can apply it on exam day and at the bedside.
            </p>
            <ul className="mt-5 space-y-2" aria-label="Question bank features">
              {[
                "NCLEX-RN and REx-PN exam style",
                "Clinical rationale and teaching pearls on every item",
                "Confidence selector before you see the answer",
                "Weak-area routing from missed questions",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[var(--palette-text-muted)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/question-bank" className={`${MARKETING_PRIMARY_CTA_CLASS} inline-flex rounded-full`}>
                Try free questions
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
              </Link>
            </div>
          </div>

          {/* Mockup column */}
          <div className="min-w-0 overflow-hidden">
            <QuestionMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 2 — NGN Clinical Judgment Mockup ────────────────────────────────

function NgnBowtieMockup() {
  const actions = ["Obtain O2 saturation", "Administer IV fluids", "Notify rapid response"];
  const parameters = ["Respiratory rate", "SpO2 trends", "Level of consciousness"];
  return (
    <div
      className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-5 shadow-[var(--shadow-card)]"
      aria-label="NGN Bowtie question type example"
      role="img"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
          NGN Bowtie Item
        </span>
        <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--theme-card-bg))] px-2.5 py-0.5 text-[0.6rem] font-bold text-[var(--semantic-brand)]">
          Clinical Judgment
        </span>
      </div>

      {/* Stem */}
      <p className="mb-5 text-xs leading-relaxed text-[var(--palette-text-muted)]">
        The nurse is caring for a client who is 2 hours post-op following abdominal surgery.
        Vital signs: BP 88/52, HR 118, RR 26, SpO2 91%.{" "}
        <strong className="text-[var(--palette-heading)]">Select the 3 nursing actions and 3 monitoring parameters</strong> for the condition identified.
      </p>

      {/* Bowtie layout */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2">
        {/* Actions column */}
        <div className="min-w-0">
          <p className="mb-2 text-center text-[0.6rem] font-bold uppercase tracking-wide text-[var(--palette-text-muted)]">Actions to Take</p>
          <div className="space-y-1.5">
            {actions.map((a) => (
              <div
                key={a}
                className="flex items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-success)_25%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-success)_6%,var(--theme-card-bg))] px-2.5 py-1.5 text-[0.65rem] text-[var(--palette-text-muted)]"
              >
                <CheckCircle2 className="h-3 w-3 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Left arrow */}
        <div className="flex items-center pt-7">
          <span className="text-[var(--palette-text-muted)]" aria-hidden>→</span>
        </div>

        {/* Condition column */}
        <div className="min-w-0">
          <p className="mb-2 text-center text-[0.6rem] font-bold uppercase tracking-wide text-[var(--palette-text-muted)]">Condition</p>
          <div className="rounded-xl border-2 border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--theme-card-bg))] px-3 py-3 text-center">
            <p className="text-xs font-black text-[var(--semantic-danger)]">Hypovolemic</p>
            <p className="text-xs font-black text-[var(--semantic-danger)]">Shock</p>
          </div>
        </div>

        {/* Right arrow */}
        <div className="flex items-center pt-7">
          <span className="text-[var(--palette-text-muted)]" aria-hidden>→</span>
        </div>

        {/* Parameters column */}
        <div className="min-w-0">
          <p className="mb-2 text-center text-[0.6rem] font-bold uppercase tracking-wide text-[var(--palette-text-muted)]">Parameters to Monitor</p>
          <div className="space-y-1.5">
            {parameters.map((p) => (
              <div
                key={p}
                className="flex items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_25%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--theme-card-bg))] px-2.5 py-1.5 text-[0.65rem] text-[var(--palette-text-muted)]"
              >
                <CheckCircle2 className="h-3 w-3 shrink-0 text-[var(--semantic-info)]" aria-hidden />
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const NGN_FORMATS = [
  { label: "Bowtie", desc: "Actions, condition, and monitoring parameters", tone: "brand" as const },
  { label: "Matrix", desc: "Classify findings across multiple rows", tone: "info" as const },
  { label: "SATA", desc: "Select all that apply with clinical rationale", tone: "success" as const },
  { label: "Trend", desc: "Interpret changing labs, vitals, and data over time", tone: "warning" as const },
  { label: "Case Study", desc: "Unfolding patient across multiple connected items", tone: "accent" as const },
  { label: "Drag & Drop", desc: "Sequence clinical actions in priority order", tone: "chart1" as const },
] as const;

function NgnSection() {
  return (
    <section
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      aria-labelledby="showcase-ngn-heading"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">Next Generation NCLEX</p>
          <h2
            id="showcase-ngn-heading"
            className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
          >
            Master all 6 NGN item types before exam day.
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            Bowtie, matrix, SATA, trend, case study, and extended drag-and-drop — the same
            question types used on NCLEX since 2023. Practice every format before you sit.
          </p>
        </div>

        {/* Format badges */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="NGN question formats">
          {NGN_FORMATS.map((fmt) => (
            <div
              key={fmt.label}
              className="flex items-start gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-4"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[0.6rem] font-black"
                style={{ background: `color-mix(in srgb, var(--nn-premium-tone-${fmt.tone}) 12%, var(--theme-card-bg))`, color: `var(--nn-premium-tone-${fmt.tone})` }}
                aria-hidden
              >
                {fmt.label.slice(0, 3).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-black text-[var(--palette-heading)]">{fmt.label}</p>
                <p className="nn-marketing-body-sm mt-0.5 text-pretty text-[var(--palette-text-muted)]">{fmt.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bowtie mockup */}
        <div className="mt-8">
          <NgnBowtieMockup />
        </div>

        <div className="mt-6 flex justify-center">
          <Link href="/nclex-question-bank" className={`${MARKETING_SECONDARY_CTA_CLASS} inline-flex`}>
            Explore NGN practice
            <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 3 — CAT Adaptive Readiness Mockup ───────────────────────────────

const CAT_DOMAINS = [
  { label: "Medical–Surgical", pct: 82, tone: "success" },
  { label: "Pharmacology", pct: 71, tone: "info" },
  { label: "Fundamentals", pct: 88, tone: "success" },
  { label: "Psychiatric", pct: 64, tone: "warning" },
  { label: "Pediatrics", pct: 47, tone: "danger" },
  { label: "Maternity", pct: 55, tone: "warning" },
] as const;

function CatReadinessMockup() {
  const readiness = 74;
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference * (1 - readiness / 100);

  return (
    <div
      className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-5 shadow-[var(--shadow-card)]"
      aria-label="CAT exam readiness dashboard example"
      role="img"
    >
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
          CAT Exam · Session 14
        </span>
        <span className="text-[0.6rem] text-[var(--palette-text-muted)]">Sample data</span>
      </div>

      <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-5">
        {/* Readiness gauge — pure SVG, no images */}
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center" aria-label={`${readiness}% exam readiness`}>
          <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90" aria-hidden>
            {/* Track */}
            <circle cx="56" cy="56" r="52" fill="none" strokeWidth="8"
              className="stroke-[color-mix(in_srgb,var(--border-subtle)_80%,transparent)]" />
            {/* Progress */}
            <circle cx="56" cy="56" r="52" fill="none" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="stroke-[var(--semantic-brand)] transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-[var(--palette-heading)]">{readiness}%</span>
            <span className="text-[0.55rem] font-bold uppercase tracking-wide text-[var(--palette-text-muted)]">Ready</span>
          </div>
        </div>

        {/* Stats */}
        <div className="min-w-0 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--palette-text-muted)]">Question</span>
            <span className="font-black text-[var(--palette-heading)]">23 / 75</span>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-[var(--palette-text-muted)]">Difficulty</span>
              <span className="font-bold text-[var(--semantic-info)]">Advanced</span>
            </div>
            <div className="flex gap-1" aria-label="Difficulty level 4 of 6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i <= 4 ? "bg-[var(--semantic-info)]" : "bg-[color-mix(in_srgb,var(--border-medium)_60%,transparent)]"}`}
                />
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--theme-card-bg))] px-3 py-2 text-xs">
            <span className="font-bold text-[var(--semantic-warning)]">Next priority: </span>
            <span className="text-[var(--palette-text-muted)]">Pediatric respiratory assessment</span>
          </div>
        </div>
      </div>

      {/* Domain bars */}
      <div className="mt-4 space-y-2.5">
        {CAT_DOMAINS.map((d) => (
          <div key={d.label}>
            <div className="mb-1 flex justify-between text-[0.65rem] font-semibold text-[var(--palette-text-muted)]">
              <span>{d.label}</span>
              <span className="text-[var(--palette-heading)]">{d.pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--border-medium)_50%,transparent)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${d.pct}%`,
                  background: `var(--nn-premium-meter-${d.tone})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CatSection() {
  return (
    <section
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      aria-labelledby="showcase-cat-heading"
    >
      <div className="nn-section-shell">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* Mockup first on desktop (left), copy on right */}
          <div className="order-2 min-w-0 overflow-hidden lg:order-1">
            <CatReadinessMockup />
          </div>

          {/* Copy */}
          <div className="order-1 min-w-0 lg:order-2">
            <p className="nn-premium-home-eyebrow">CAT Adaptive Exams</p>
            <h2
              id="showcase-cat-heading"
              className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
            >
              Know your exam readiness before test day.
            </h2>
            <p className="nn-marketing-body mt-3 text-pretty text-[var(--palette-text-muted)]">
              Computer Adaptive Testing adjusts question difficulty in real time based on your
              responses — exactly like the real NCLEX. After every session, see your estimated
              readiness score and the specific domains that need more work.
            </p>
            <ul className="mt-5 space-y-2" aria-label="CAT features">
              {[
                "Adaptive difficulty mirrors real NCLEX behavior",
                "Domain-level mastery bands after every session",
                "Readiness score with weak-area routing",
                "Unlimited CAT practice on your schedule",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[var(--palette-text-muted)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/adaptive-nclex-testing" className={`${MARKETING_PRIMARY_CTA_CLASS} inline-flex rounded-full`}>
                Start a CAT exam
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 4 — Comparison Table ────────────────────────────────────────────

const COMPARISON_ROWS = [
  { feature: "Practice Questions (NCLEX-style)", competitor: "yes", nursenest: "yes" },
  { feature: "NGN Formats — all 6 item types", competitor: "partial", nursenest: "yes" },
  { feature: "CAT Adaptive Exams", competitor: "some", nursenest: "yes" },
  { feature: "Clinical Lessons", competitor: "no", nursenest: "yes" },
  { feature: "ECG & Telemetry Training", competitor: "no", nursenest: "yes" },
  { feature: "Lab Interpretation", competitor: "no", nursenest: "yes" },
  { feature: "Medication Math", competitor: "no", nursenest: "yes" },
  { feature: "Spaced-Repetition Flashcards", competitor: "no", nursenest: "yes" },
  { feature: "Adaptive Study Plans", competitor: "no", nursenest: "yes" },
  { feature: "Readiness Analytics", competitor: "no", nursenest: "yes" },
  { feature: "RPN / REx-PN (Canada)", competitor: "no", nursenest: "yes" },
  { feature: "NP / CNPLE Pathway", competitor: "no", nursenest: "yes" },
  { feature: "Allied Health Pathways", competitor: "no", nursenest: "yes" },
  { feature: "New Graduate Support", competitor: "no", nursenest: "yes" },
] as const;

function ComparisonIcon({ value }: { value: "yes" | "no" | "partial" | "some" }) {
  if (value === "yes") return (
    <span className="flex items-center gap-1 text-xs font-bold text-[var(--semantic-success)]">
      <Sparkles className="h-3.5 w-3.5" aria-hidden />
      Integrated
    </span>
  );
  if (value === "partial") return (
    <span className="flex items-center gap-1 text-xs font-semibold text-[var(--semantic-warning)]">
      <Minus className="h-3.5 w-3.5" aria-hidden />
      Partial
    </span>
  );
  if (value === "some") return (
    <span className="flex items-center gap-1 text-xs font-semibold text-[var(--semantic-warning)]">
      <Minus className="h-3.5 w-3.5" aria-hidden />
      Some
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-xs text-[var(--palette-text-muted)]">
      <XCircle className="h-3.5 w-3.5 text-[var(--semantic-danger)]" aria-hidden />
      Separate app
    </span>
  );
}

function ComparisonSection() {
  return (
    <section
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      aria-labelledby="showcase-comparison-heading"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">Why NurseNest</p>
          <h2
            id="showcase-comparison-heading"
            className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
          >
            Everything traditional question banks leave out.
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            UWorld and Archer give you questions. NurseNest gives you a complete exam prep system —
            lessons, flashcards, ECG, labs, medication math, CAT, and readiness analytics in one place.
          </p>
        </div>

        <div
          className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border-subtle)]"
          role="table"
          aria-label="NurseNest versus traditional question banks"
        >
          {/* Header */}
          <div
            className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-[var(--border-subtle)] bg-[var(--semantic-panel-muted)] px-4 py-3"
            role="row"
          >
            <span className="text-xs font-black uppercase tracking-wide text-[var(--palette-text-muted)]" role="columnheader">
              Capability
            </span>
            <span className="text-xs font-black uppercase tracking-wide text-[var(--palette-text-muted)]" role="columnheader">
              Question Bank
            </span>
            <span className="text-xs font-black uppercase tracking-wide text-[var(--semantic-brand)]" role="columnheader">
              NurseNest
            </span>
          </div>

          {/* Rows */}
          {COMPARISON_ROWS.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)] items-center px-4 py-3 ${
                i < COMPARISON_ROWS.length - 1 ? "border-b border-[var(--border-subtle)]" : ""
              } ${i % 2 === 0 ? "bg-[var(--theme-card-bg)]" : "bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,var(--theme-card-bg))]"}`}
              role="row"
            >
              <span className="min-w-0 text-sm text-[var(--palette-heading)]" role="cell">
                {row.feature}
              </span>
              <span className="min-w-0" role="cell">
                <ComparisonIcon value={row.competitor} />
              </span>
              <span className="min-w-0" role="cell">
                <ComparisonIcon value={row.nursenest} />
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link href="/signup" className={`${MARKETING_PRIMARY_CTA_CLASS} inline-flex rounded-full`}>
            Start free today
            <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 5 — Platform Inventory (real counts only) ───────────────────────

type StatCard = { label: string; count: string | null; description: string; icon: typeof BookOpen };

function PlatformInventorySection({ stats }: { stats: ShowcaseStats }) {
  const cards: StatCard[] = [
    {
      label: "Practice Questions",
      count: safeCount(stats.questionCount) ? formatCount(stats.questionCount) : null,
      description: "Exam-style NCLEX, REx-PN, CNPLE, and allied health questions with clinical rationales",
      icon: FileQuestion,
    },
    {
      label: "Clinical Lessons",
      count: safeCount(stats.lessonCount) ? formatCount(stats.lessonCount) : null,
      description: "Pathway-specific clinical teaching with nursing priorities, safety alerts, and exam framing",
      icon: BookOpen,
    },
    {
      label: "Flashcard Decks",
      count: safeCount(stats.flashcardCount) ? formatCount(stats.flashcardCount) : null,
      description: "Spaced-repetition recall drills tied to weak topics and exam domains",
      icon: Brain,
    },
    {
      label: "ECG Activities",
      count: safeCount(stats.ecgCaseCount) ? formatCount(stats.ecgCaseCount) : null,
      description: "Rhythm strip interpretation, telemetry monitoring, and arrhythmia recognition",
      icon: Activity,
    },
    {
      label: "Clinical Skills",
      count: safeCount(stats.clinicalSkillCount) ? formatCount(stats.clinicalSkillCount) : null,
      description: "Interactive competency pathways with OSCE-style procedure sequencing",
      icon: ClipboardCheck,
    },
    {
      label: "Lab Cases",
      count: safeCount(stats.labCaseCount) ? formatCount(stats.labCaseCount) : null,
      description: "Abnormal value recognition, clinical interpretation, and priority nursing actions",
      icon: FlaskConical,
    },
    {
      label: "Medication Math",
      count: safeCount(stats.medicationMathCount) ? formatCount(stats.medicationMathCount) : null,
      description: "Dosage calculation, infusion rate, and high-alert medication safety practice",
      icon: Pill,
    },
    {
      label: "Pharmacology",
      count: null,
      description: "Drug class reviews, monitoring priorities, and contraindication reasoning",
      icon: Pill,
    },
  ];

  // Only show inventory section if at least 2 cards have real counts
  const hasRealCounts = cards.filter((c) => c.count !== null).length >= 2;

  return (
    <section
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      aria-labelledby="showcase-inventory-heading"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="nn-premium-home-eyebrow">
            {hasRealCounts ? "Platform Depth" : "What's Included"}
          </p>
          <h2
            id="showcase-inventory-heading"
            className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]"
          >
            Every tool in one subscription.
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
            One plan covers your full exam prep — questions, lessons, flashcards,
            ECG, labs, medication math, clinical skills, CAT exams, and readiness analytics.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-5"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--theme-card-bg))", color: "var(--semantic-brand)" }}
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>
                {card.count && (
                  <p className="mt-3 text-2xl font-black text-[var(--palette-heading)]">{card.count}</p>
                )}
                <p className={`font-black text-[var(--palette-heading)] ${card.count ? "mt-0.5 text-sm" : "mt-3 text-base"}`}>
                  {card.label}
                </p>
                <p className="nn-marketing-body-sm mt-2 flex-1 text-pretty text-[var(--palette-text-muted)]">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 6 — Institutions ─────────────────────────────────────────────────

function InstitutionsSection() {
  return (
    <section
      className="nn-premium-home-section border-b border-[var(--border-subtle)]"
      aria-labelledby="showcase-institutions-heading"
    >
      <div className="nn-section-shell">
        <div className="rounded-3xl border border-[color-mix(in_srgb,var(--semantic-brand)_15%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--theme-card-bg))] px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <School className="h-8 w-8 text-[var(--semantic-brand)]" aria-hidden />
            <div className="min-w-0">
              <p className="nn-premium-home-eyebrow">For Institutions</p>
              <h2
                id="showcase-institutions-heading"
                className="nn-marketing-h2 mt-2 text-balance text-[var(--palette-heading)]"
              >
                NurseNest for Nursing Schools &amp; Healthcare Organizations
              </h2>
              <p className="nn-marketing-body mt-2 text-pretty text-[var(--palette-text-muted)]">
                Student cohort licenses, hospital onboarding, new graduate support, faculty
                dashboards, remediation programs, and clinical education groups.
              </p>
            </div>
            <Link
              href="/for-institutions"
              className={`${MARKETING_SECONDARY_CTA_CLASS} inline-flex shrink-0`}
            >
              Explore institutional licensing
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Compositor ──────────────────────────────────────────────────────────

export function HomepageFeatureShowcase({ stats }: { stats: ShowcaseStats }) {
  return (
    <div data-nn-feature-showcase="1" data-testid="homepage-feature-showcase">
      <QuestionBankSection questionCount={stats.questionCount} />
      <NgnSection />
      <CatSection />
      <ComparisonSection />
      <PlatformInventorySection stats={stats} />
      <InstitutionsSection />
    </div>
  );
}
