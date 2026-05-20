"use client";

/**
 * NurseNest premium homepage preview surface.
 *
 * Extracted from `nursenest-premium-preview.tsx` so this large composed
 * surface lives in its own file (TS-server stability + faster lints).
 *
 * Used ONLY by the noindex `/preview/[surface]` route via
 * `nursenest-premium-preview.tsx`. Not used by production marketing routes.
 */

import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FlaskConical,
  Gauge,
  GraduationCap,
  HeartPulse,
  Layers3,
  PillIcon,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Pill, PreviewCard, cx, semantic } from "./_preview-shared";


/** Inline ECG strip SVG — reusable clinical visual element */
function EcgStrip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 460 100" className={className ?? "h-16 w-full overflow-visible"}>
      <path
        d="M0 64 H38 L50 30 L64 88 L78 48 H118 L132 64 L144 36 L160 82 L174 56 H222 L236 64 L248 28 L264 90 L280 50 H330 L344 64 L358 34 L374 84 L390 52 H460"
        fill="none"
        stroke="var(--preview-accent)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M0 64 H460" stroke="var(--preview-border)" strokeWidth="1.5" strokeDasharray="3 10" />
    </svg>
  );
}

/** The rich clinical panel that floats on the right side of the hero */
function ClinicalHeroPanel() {
  return (
    <div className="relative pl-0 lg:pl-4">
      {/* Glow backdrop */}
      <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[var(--preview-accent)] opacity-[0.06] blur-3xl" />

      {/* Main lesson card */}
      <div className="relative rounded-[2rem] border border-[var(--preview-border)] bg-[var(--preview-surface)]/95 p-5 shadow-[0_40px_100px_rgba(15,23,42,0.22)] backdrop-blur-xl">
        {/* Floating readiness badge — top-right */}
        <div
          className="absolute -right-3 -top-3 z-10 rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-surface)] px-4 py-2.5 shadow-[0_16px_44px_rgba(15,23,42,0.22)] backdrop-blur-xl"
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--preview-muted)]">Readiness</p>
          <p className="text-2xl font-bold leading-none text-[var(--preview-text)]">84%</p>
          <div className="mt-1.5 h-1.5 w-14 overflow-hidden rounded-full bg-[var(--preview-surface-2)]">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: "84%" }} />
          </div>
        </div>

        {/* Lesson header */}
        <div className="flex items-center justify-between gap-2 pr-14">
          <div className="flex flex-wrap gap-1.5">
            <Pill tone="blue">Pathophysiology</Pill>
            <Pill tone="rose">Red Flags</Pill>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--preview-muted)]">Lesson 14</span>
        </div>

        <h3 className="mt-4 text-xl font-bold leading-tight text-[var(--preview-text)] sm:text-2xl">
          Heart Failure:<br />Perfusion &amp; Fluid Balance
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--preview-muted)]">
          Recognize escalation cues, connect bedside findings to pathophysiology, and prioritize safely.
        </p>

        {/* Phase progress dots */}
        <div className="mt-4 flex items-center gap-3">
          {[
            { label: "Readiness", active: true, done: true, color: "#059669" },
            { label: "Study", active: true, done: false, color: "var(--preview-accent)" },
            { label: "Reinforce", active: false, done: false, color: "var(--preview-border)" },
            { label: "Mastered", active: false, done: false, color: "var(--preview-border)" },
          ].map((phase, i) => (
            <div key={phase.label} className="flex items-center gap-1.5">
              {i > 0 && <div className="h-px w-4 bg-[var(--preview-border)]" />}
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold"
                style={{
                  background: phase.done ? phase.color : phase.active ? `color-mix(in srgb, ${phase.color} 18%, var(--preview-surface))` : "var(--preview-surface-2)",
                  borderColor: phase.done || phase.active ? phase.color : "var(--preview-border)",
                  color: phase.done ? "#fff" : phase.active ? phase.color : "var(--preview-muted)",
                }}
              >
                {phase.done ? "✓" : i + 1}
              </div>
              <span className="hidden text-[10px] font-semibold text-[var(--preview-muted)] sm:inline">{phase.label}</span>
            </div>
          ))}
        </div>

        {/* Semantic section cards — 2×2 grid */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            { tag: "Assessment", label: "JVD, crackles, 3+ pitting edema", color: "#2563eb" },
            { tag: "Labs", label: "Troponin ↑ · BNP 892 · K⁺ 3.1", color: "#d97706" },
            { tag: "Red Flag", label: "New confusion + increasing dyspnea", color: "#e11d48" },
            { tag: "Intervention", label: "Fowler's position · O₂ · Furosemide", color: "#059669" },
          ].map((item) => (
            <div
              key={item.tag}
              className="rounded-2xl border p-3"
              style={{
                borderColor: `color-mix(in srgb, ${item.color} 36%, var(--preview-border))`,
                background: `color-mix(in srgb, ${item.color} 8%, var(--preview-surface))`,
              }}
            >
              <p
                className="text-[9px] font-bold uppercase tracking-[0.14em]"
                style={{ color: item.color }}
              >
                {item.tag}
              </p>
              <p className="mt-1 text-xs font-semibold leading-4 text-[var(--preview-text)]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row: ECG card + lab panel */}
      <div className="relative mt-3 grid grid-cols-[1fr_0.72fr] gap-3">
        {/* ECG card */}
        <div className="rounded-[1.5rem] border border-[var(--preview-border)] bg-[var(--preview-surface)]/95 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.14)] backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <Pill tone="rose">ECG Strip</Pill>
            <HeartPulse className="h-4 w-4 text-[var(--preview-accent)]" />
          </div>
          <EcgStrip className="h-12 w-full overflow-visible sm:h-14" />
          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">
            Sinus Tachycardia — Rate 108 bpm
          </p>
        </div>

        {/* Lab values panel */}
        <div className="space-y-2">
          {[
            { label: "Troponin", value: "↑ Rising", color: "#e11d48" },
            { label: "K⁺", value: "3.1 mEq/L", color: "#d97706" },
            { label: "BNP", value: "↑ 892 pg/mL", color: "#e11d48" },
            { label: "O₂ Sat", value: "91%", color: "#d97706" },
          ].map((lab) => (
            <div
              key={lab.label}
              className="flex items-center justify-between rounded-2xl border px-3 py-2"
              style={{
                borderColor: `color-mix(in srgb, ${lab.color} 28%, var(--preview-border))`,
                background: `color-mix(in srgb, ${lab.color} 7%, var(--preview-surface))`,
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">{lab.label}</span>
              <span className="text-xs font-bold" style={{ color: lab.color }}>{lab.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating stat bar at bottom */}
      <div className="relative mt-3 grid grid-cols-3 gap-2">
        {[
          { value: "420+", label: "Lessons", color: "#2563eb" },
          { value: "2.8k", label: "Flashcards", color: "#7c3aed" },
          { value: "Adaptive", label: "CAT Engine", color: "#059669" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/90 p-3 text-center backdrop-blur"
          >
            <p className="text-base font-bold sm:text-xl" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--preview-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Premium hero — replaces the old flat hero */
function PremiumHero() {
  return (
    <section className="relative overflow-hidden py-4">
      {/* Ambient depth blurs */}
      <div className="pointer-events-none absolute -left-32 -top-16 h-[480px] w-[480px] rounded-full bg-[var(--preview-accent)] opacity-[0.06] blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-16 right-0 h-[380px] w-[380px] rounded-full bg-[var(--preview-accent-2)] opacity-[0.07] blur-[80px]" />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] xl:gap-14">
        {/* ── Left: headline + CTAs ── */}
        <div className="space-y-6">
          {/* Trust eyebrows */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--preview-border)] bg-[var(--preview-surface)]/80 px-3 py-1.5 text-xs font-bold text-[var(--preview-text)] backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              12,000+ nursing learners — and growing
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--preview-border)] bg-[var(--preview-surface)]/80 px-3 py-1.5 text-xs font-bold text-[var(--preview-muted)] backdrop-blur">
              RN · RPN/PN · NP · Allied · Pre-Nursing
            </span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-[clamp(2.5rem,5.5vw,4.4rem)] font-bold leading-[0.93] tracking-tight text-[var(--preview-text)]">
              Master nursing.<br />
              <em className="not-italic" style={{ color: "var(--preview-accent)" }}>Think</em> like<br />
              a clinician.
            </h1>
            <p className="mt-5 max-w-[530px] text-[1.05rem] leading-7 text-[var(--preview-muted)]">
              NurseNest is a clinically immersive exam platform — semantic lessons, adaptive practice,
              spaced flashcards, and readiness intelligence built around real nursing judgment.
            </p>
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3">
            <Button className="h-12 rounded-2xl px-7 text-[1rem] font-bold shadow-[0_8px_32px_rgba(15,23,42,0.20)]">
              Start Free — No Card Required
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-2xl border-[var(--preview-border)] bg-[var(--preview-surface)]/80 px-6 text-[1rem] font-bold"
            >
              Explore Pathways
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* 4 micro-stats */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { value: "94%", label: "pass readiness", color: "#059669" },
              { value: "420+", label: "clinical lessons", color: "#2563eb" },
              { value: "2,800+", label: "flashcards", color: "#7c3aed" },
              { value: "Adaptive", label: "CAT engine", color: "#0891b2" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/80 p-3 text-center shadow-sm backdrop-blur"
              >
                <p className="text-lg font-bold sm:text-xl" style={{ color: stat.color }}>{stat.value}</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Pathway quick-jump */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">Pathways:</span>
            {[
              { label: "RN / NCLEX", color: "#2563eb" },
              { label: "RPN / PN", color: "#059669" },
              { label: "NP", color: "#7c3aed" },
              { label: "Allied", color: "#0891b2" },
              { label: "Pre-Nursing", color: "#d97706" },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                className="rounded-full border px-3 py-1 text-xs font-bold transition-opacity hover:opacity-70"
                style={{
                  color: p.color,
                  borderColor: `color-mix(in srgb, ${p.color} 36%, var(--preview-border))`,
                  background: `color-mix(in srgb, ${p.color} 10%, var(--preview-surface))`,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: clinical visual panel ── */}
        <ClinicalHeroPanel />
      </div>
    </section>
  );
}

/** Trust / stats band — horizontal strip beneath the hero */
function StatsTrustBand() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-[var(--preview-border)] bg-[linear-gradient(135deg,var(--preview-surface-2),var(--preview-surface))] shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="grid grid-cols-3 divide-x divide-[var(--preview-border)] lg:grid-cols-6">
        {[
          { value: "12,000+", label: "active learners" },
          { value: "94%", label: "felt more organized" },
          { value: "420+", label: "semantic lessons" },
          { value: "2,800+", label: "spaced flashcards" },
          { value: "1,200+", label: "practice questions" },
          { value: "Adaptive", label: "CAT exam engine" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={cx(
              "px-5 py-4 text-center",
              i >= 3 && "hidden lg:block",
            )}
          >
            <p className="text-xl font-bold text-[var(--preview-text)] sm:text-2xl">{stat.value}</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Pathway showcase — each pathway has a truly distinct visual identity */
function PathwayShowcase() {
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Pill>Pathway Intelligence</Pill>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--preview-text)] sm:text-4xl">
            Every path has its own clinical scaffold.
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-6 text-[var(--preview-muted)]">
          Nursing is not one job. RN, RPN, NP, Allied, and pre-nursing learners need different depth, rhythm, and exam focus.
        </p>
      </div>

      {/* Main 2-column grid */}
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">

        {/* ── Left column: RN (large) + RPN stacked ── */}
        <div className="grid gap-4 sm:grid-cols-2">

          {/* RN — large featured card, spans 2 rows */}
          <div
            className="rounded-[1.75rem] border p-6 shadow-[0_28px_70px_rgba(15,23,42,0.12)] sm:row-span-2"
            style={{
              borderColor: "color-mix(in srgb, #2563eb 32%, var(--preview-border))",
              background: "linear-gradient(150deg, color-mix(in srgb, #2563eb 13%, var(--preview-surface)), var(--preview-surface))",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-3xl p-3 text-white shadow-sm" style={{ background: "#2563eb" }}>
                <Stethoscope className="h-6 w-6" />
              </span>
              <span className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#2563eb", borderColor: "color-mix(in srgb, #2563eb 36%, var(--preview-border))" }}>
                NCLEX Systems Mastery
              </span>
            </div>

            <h3 className="mt-6 text-[2.4rem] font-bold leading-none tracking-tight text-[var(--preview-text)]">RN</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--preview-muted)]">
              Systems-based med-surg, pharmacology, prioritization, and bedside urgency for high-stakes RN clinical judgment.
            </p>

            {/* Body systems icon grid */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { label: "Cardiac", icon: HeartPulse, color: "#e11d48" },
                { label: "Respiratory", icon: Activity, color: "#2563eb" },
                { label: "Renal", icon: FlaskConical, color: "#d97706" },
                { label: "Neuro", icon: Brain, color: "#7c3aed" },
                { label: "GI", icon: FileText, color: "#059669" },
                { label: "Pharmacology", icon: PillIcon, color: "#db2777" },
              ].map((sys) => {
                const Ic = sys.icon;
                return (
                  <div
                    key={sys.label}
                    className="flex flex-col items-center gap-1 rounded-2xl border py-2.5"
                    style={{
                      borderColor: `color-mix(in srgb, ${sys.color} 28%, var(--preview-border))`,
                      background: `color-mix(in srgb, ${sys.color} 8%, var(--preview-surface))`,
                    }}
                  >
                    <Ic className="h-4 w-4" style={{ color: sys.color }} />
                    <span className="text-[9px] font-bold text-[var(--preview-muted)]">{sys.label}</span>
                  </div>
                );
              })}
            </div>

            {/* NCLEX priority cue */}
            <div className="mt-4 rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/80 p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">NCLEX Priority Cue</p>
              <p className="mt-1 text-sm font-semibold text-[var(--preview-text)]">
                "Which client should the nurse assess first?" — systems reasoning, not isolated facts.
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {["Med-surg body systems", "NCLEX clinical judgment", "Pharmacology safety", "Priority & delegation"].map((bullet) => (
                <div key={bullet} className="flex items-center gap-2 text-sm font-bold text-[var(--preview-text)]">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "#2563eb" }} />
                  {bullet}
                </div>
              ))}
            </div>
          </div>

          {/* RPN / PN */}
          <div
            className="rounded-[1.75rem] border p-5 shadow-[0_20px_55px_rgba(15,23,42,0.09)]"
            style={{
              borderColor: "color-mix(in srgb, #059669 30%, var(--preview-border))",
              background: "linear-gradient(145deg, color-mix(in srgb, #059669 11%, var(--preview-surface)), var(--preview-surface))",
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="rounded-3xl p-2.5 text-white" style={{ background: "#059669" }}>
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">Practical Bedside</span>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-[var(--preview-text)]">RPN / PN</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--preview-muted)]">Workflow-first learning — safety, delegation, common meds, and confident escalation at the bedside.</p>

            {/* Workflow steps */}
            <div className="mt-4 space-y-2">
              {[
                { step: "1", label: "Assess & prioritize", color: "#059669" },
                { step: "2", label: "Safe delegation boundary", color: "#d97706" },
                { step: "3", label: "Administer & document", color: "#059669" },
                { step: "4", label: "Escalate if needed", color: "#e11d48" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 rounded-xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/80 px-3 py-2">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: item.color }}>{item.step}</span>
                  <span className="text-xs font-semibold text-[var(--preview-text)]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-Nursing */}
          <div
            className="rounded-[1.75rem] border p-5 shadow-[0_20px_55px_rgba(15,23,42,0.09)]"
            style={{
              borderColor: "color-mix(in srgb, #d97706 28%, var(--preview-border))",
              background: "linear-gradient(145deg, color-mix(in srgb, #d97706 10%, var(--preview-surface)), var(--preview-surface))",
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="rounded-3xl p-2.5 text-white" style={{ background: "#d97706" }}>
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">Roadmap to Readiness</span>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-[var(--preview-text)]">Pre-Nursing</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--preview-muted)]">A calmer roadmap — prereqs, science foundations, and application confidence before your first clinical day.</p>

            {/* Milestone roadmap */}
            <div className="mt-4 flex items-center gap-1">
              {[
                { label: "Prereqs", done: true, color: "#059669" },
                { label: "Sciences", done: true, color: "#059669" },
                { label: "Apply", done: false, color: "#d97706" },
                { label: "Program", done: false, color: "#d97706" },
                { label: "Clinical", done: false, color: "var(--preview-border)" },
              ].map((m, i) => (
                <div key={m.label} className="flex items-center">
                  {i > 0 && <div className="h-px w-3 sm:w-5" style={{ background: m.done ? "#059669" : "var(--preview-border)" }} />}
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold"
                      style={{
                        background: m.done ? m.color : `color-mix(in srgb, ${m.color} 20%, var(--preview-surface))`,
                        color: m.done ? "#fff" : m.color,
                        border: `1.5px solid ${m.color}`,
                      }}
                    >
                      {m.done ? "✓" : i + 1}
                    </div>
                    <span className="text-[8px] font-semibold text-[var(--preview-muted)]">{m.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column: NP (large) + Allied ── */}
        <div className="grid gap-4">

          {/* NP — diagnostics / advanced reasoning */}
          <div
            className="rounded-[1.75rem] border p-6 shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
            style={{
              borderColor: "color-mix(in srgb, #7c3aed 32%, var(--preview-border))",
              background: "linear-gradient(150deg, color-mix(in srgb, #7c3aed 13%, var(--preview-surface)), var(--preview-surface))",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-3xl p-3 text-white" style={{ background: "#7c3aed" }}>
                <Brain className="h-6 w-6" />
              </span>
              <span className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#7c3aed", borderColor: "color-mix(in srgb, #7c3aed 36%, var(--preview-border))" }}>
                Advanced Practice
              </span>
            </div>

            <h3 className="mt-5 text-[2rem] font-bold leading-none tracking-tight text-[var(--preview-text)]">NP</h3>
            <p className="mt-2.5 text-sm leading-6 text-[var(--preview-muted)]">
              Diagnostics, prescribing logic, differential reasoning, and specialty domains for primary care and advanced practice.
            </p>

            {/* Diagnostic reasoning chain */}
            <div className="mt-5 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">Diagnostic Reasoning Chain</p>
              {[
                { label: "Chief complaint + HPI", icon: FileText, color: "#0891b2" },
                { label: "Physical exam findings", icon: Stethoscope, color: "#7c3aed" },
                { label: "Differential: narrow to 3", icon: Target, color: "#d97706" },
                { label: "Order targeted diagnostics", icon: FlaskConical, color: "#d97706" },
                { label: "Prescribe + follow up", icon: PillIcon, color: "#7c3aed" },
              ].map((step) => {
                const Ic = step.icon;
                return (
                  <div
                    key={step.label}
                    className="flex items-center gap-2.5 rounded-xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/80 px-3 py-2"
                  >
                    <Ic className="h-3.5 w-3.5 flex-shrink-0" style={{ color: step.color }} />
                    <span className="text-xs font-semibold text-[var(--preview-text)]">{step.label}</span>
                    <ChevronRight className="ml-auto h-3.5 w-3.5 text-[var(--preview-muted)]" />
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "Prescribing", color: "#7c3aed" },
                { label: "Diagnostics", color: "#0891b2" },
                { label: "Specialty", color: "#059669" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border px-3 py-2 text-center text-xs font-bold"
                  style={{
                    color: item.color,
                    borderColor: `color-mix(in srgb, ${item.color} 32%, var(--preview-border))`,
                    background: `color-mix(in srgb, ${item.color} 9%, var(--preview-surface))`,
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Allied Health */}
          <div
            className="rounded-[1.75rem] border p-5 shadow-[0_20px_55px_rgba(15,23,42,0.09)]"
            style={{
              borderColor: "color-mix(in srgb, #0891b2 28%, var(--preview-border))",
              background: "linear-gradient(145deg, color-mix(in srgb, #0891b2 10%, var(--preview-surface)), var(--preview-surface))",
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="rounded-3xl p-2.5 text-white" style={{ background: "#0891b2" }}>
                <Layers3 className="h-5 w-5" />
              </span>
              <Pill tone="teal">Profession-Aware Prep</Pill>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-[var(--preview-text)]">Allied Health</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--preview-muted)]">
              Occupation-specific clinical vocabulary, modality-aware tools, and exam-aligned study for allied roles.
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {["Paramedic", "MLT", "Imaging", "RRT", "PSW", "Dental", "Pharmacy", "Physio"].map((role, i) => (
                <div
                  key={role}
                  className="rounded-xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/80 px-2 py-2 text-center text-[10px] font-bold text-[var(--preview-text)]"
                  style={i < 4 ? { borderColor: "color-mix(in srgb, #0891b2 28%, var(--preview-border))" } : {}}
                >
                  {role}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Lesson design preview — show the full semantic lesson system */
function LessonSystemPreview() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--preview-border)] bg-[var(--preview-surface)]/90 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
      <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">

        {/* Left: semantic lesson structure */}
        <div className="p-6 lg:border-r lg:border-[var(--preview-border)]">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="blue">Lesson Design System</Pill>
            <Pill tone="purple">9 Semantic Sections</Pill>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-[var(--preview-text)]">
            Heart Failure: Perfusion &amp; Fluid Balance
          </h2>
          <p className="mt-2 text-sm text-[var(--preview-muted)]">
            Each lesson is structured in 9 semantic layers — not prose paragraphs. Color-coded, scannable, exam-ready.
          </p>

          {/* Phase progress bar */}
          <div className="mt-4 flex items-center gap-2">
            {["Readiness", "Study", "Reinforce", "Mastered"].map((phase, i) => (
              <div key={phase} className="flex flex-1 items-center gap-1.5">
                {i > 0 && <div className="h-px flex-1 bg-[var(--preview-border)]" />}
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: i === 0 ? "#059669" : i === 1 ? "var(--preview-accent)" : "var(--preview-surface-2)",
                    color: i < 2 ? "#fff" : "var(--preview-muted)",
                    border: i > 1 ? "1.5px solid var(--preview-border)" : "none",
                  }}
                >
                  {i === 0 ? "✓" : i + 1}
                </div>
                <span className="hidden text-[10px] font-semibold text-[var(--preview-muted)] md:inline">{phase}</span>
              </div>
            ))}
          </div>

          {/* Semantic section cards — all 9 */}
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {Object.values(semantic).map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl border px-3 py-2.5"
                  style={{
                    borderColor: `color-mix(in srgb, ${item.color} 36%, var(--preview-border))`,
                    background: `color-mix(in srgb, ${item.color} 8%, var(--preview-surface))`,
                  }}
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl text-white" style={{ background: item.color }}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-bold text-[var(--preview-text)]">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: clinical visuals panel */}
        <div className="space-y-4 bg-[var(--preview-surface-2)] p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">ECG Rhythm — Linked to Priority Actions</p>
            <div className="mt-3 rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-surface)] p-4 shadow-sm">
              <EcgStrip className="h-12 w-full overflow-visible" />
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-[var(--preview-surface-2)] px-2 py-1.5">
                  <p className="text-[9px] font-bold uppercase text-[var(--preview-muted)]">Rate</p>
                  <p className="text-sm font-bold text-[var(--preview-text)]">108 bpm</p>
                </div>
                <div className="rounded-xl bg-[var(--preview-surface-2)] px-2 py-1.5">
                  <p className="text-[9px] font-bold uppercase text-[var(--preview-muted)]">Rhythm</p>
                  <p className="text-sm font-bold text-[var(--preview-text)]">Regular</p>
                </div>
                <div className="rounded-xl bg-[var(--preview-surface-2)] px-2 py-1.5">
                  <p className="text-[9px] font-bold uppercase text-[var(--preview-muted)]">Priority</p>
                  <p className="text-sm font-bold" style={{ color: "#e11d48" }}>Tachycardia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lab panel */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">Priority Lab Values</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { name: "BNP", val: "892 pg/mL", status: "Critical ↑", color: "#e11d48" },
                { name: "Troponin", val: "0.48 ng/mL", status: "Rising ↑", color: "#e11d48" },
                { name: "Potassium", val: "3.1 mEq/L", status: "Low ↓", color: "#d97706" },
                { name: "O₂ Saturation", val: "91%", status: "Watch ⚠", color: "#d97706" },
                { name: "Creatinine", val: "1.8 mg/dL", status: "Elevated", color: "#d97706" },
                { name: "Sodium", val: "131 mEq/L", status: "Low ↓", color: "#d97706" },
              ].map((lab) => (
                <div
                  key={lab.name}
                  className="rounded-2xl border p-3"
                  style={{
                    borderColor: `color-mix(in srgb, ${lab.color} 30%, var(--preview-border))`,
                    background: `color-mix(in srgb, ${lab.color} 7%, var(--preview-surface))`,
                  }}
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">{lab.name}</p>
                  <p className="text-sm font-bold text-[var(--preview-text)]">{lab.val}</p>
                  <p className="text-[9px] font-bold" style={{ color: lab.color }}>{lab.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick-recall pill row */}
          <div className="flex flex-wrap gap-2">
            <Pill tone="green">Cram Sheet</Pill>
            <Pill tone="blue">Practice 30 Qs</Pill>
            <Pill tone="purple">16 Flashcards</Pill>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 4-step study ecosystem flow */
function StudyEcosystemFlow() {
  const steps = [
    {
      num: "01",
      title: "Read the Lesson",
      subtitle: "Clinical Lesson Cockpit",
      copy: "Sticky study rail, 9 semantic section types, body-system anchors, and ECG/lab visual overlays.",
      icon: BookOpen,
      color: "#2563eb",
      preview: (
        <div className="mt-4 space-y-2">
          {Object.values(semantic).slice(0, 4).map((s) => {
            const Ic = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-2 rounded-xl border border-[var(--preview-border)] px-3 py-2 text-xs font-semibold text-[var(--preview-text)]">
                <Ic className="h-3.5 w-3.5" style={{ color: s.color }} />
                {s.label}
              </div>
            );
          })}
        </div>
      ),
    },
    {
      num: "02",
      title: "Recall with Flashcards",
      subtitle: "Spaced Repetition Engine",
      copy: "Confidence ratings, rationale links, spaced intervals, and automatic deck reinforcement for missed concepts.",
      icon: Brain,
      color: "#7c3aed",
      preview: (
        <div className="mt-4 rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/90 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">Recall Card</p>
          <p className="mt-2 text-sm font-bold leading-5 text-[var(--preview-text)]">What finding suggests worsening left-sided HF?</p>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {[
              { label: "Again", color: "#e11d48" },
              { label: "Hard", color: "#d97706" },
              { label: "Good", color: "#2563eb" },
              { label: "Easy", color: "#059669" },
            ].map((btn) => (
              <button key={btn.label} type="button" className="rounded-lg px-1 py-1.5 text-[10px] font-bold text-white" style={{ background: btn.color }}>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: "03",
      title: "Practice Questions",
      subtitle: "Topic-Filtered Bank",
      copy: "1,200+ clinical judgment questions, topic filters, rationale panels, and next-step recommendations.",
      icon: Target,
      color: "#d97706",
      preview: (
        <div className="mt-4 rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/90 p-4">
          <p className="text-[10px] font-bold uppercase text-[var(--preview-muted)]">Question 4 / 20</p>
          <p className="mt-2 text-xs font-bold leading-5 text-[var(--preview-text)]">A client with HF reports confusion + dyspnea. First action?</p>
          <div className="mt-3 space-y-1.5">
            {[
              { text: "Raise HOB, assess O₂ sat", selected: true, color: "#2563eb" },
              { text: "Give scheduled diuretic", selected: false, color: "" },
              { text: "Offer oral fluids", selected: false, color: "" },
            ].map((opt) => (
              <div
                key={opt.text}
                className="rounded-lg border px-3 py-1.5 text-[10px] font-semibold"
                style={{
                  borderColor: opt.selected ? opt.color : "var(--preview-border)",
                  background: opt.selected ? `color-mix(in srgb, ${opt.color} 12%, var(--preview-surface))` : "var(--preview-surface)",
                  color: "var(--preview-text)",
                }}
              >
                {opt.text}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: "04",
      title: "Adaptive CAT Exam",
      subtitle: "Readiness Intelligence",
      copy: "Timed adaptive exam engine, phase-based readiness scoring, and domain-level performance signals.",
      icon: Gauge,
      color: "#059669",
      preview: (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-surface)]/90 px-4 py-3">
            <span className="text-xs font-bold text-[var(--preview-muted)]">Overall Readiness</span>
            <span className="text-xl font-bold" style={{ color: "#059669" }}>84%</span>
          </div>
          {["Cardiac", "Pharmacology", "Safety"].map((d, i) => (
            <div key={d}>
              <div className="mb-1 flex justify-between text-[10px] font-bold text-[var(--preview-muted)]">
                <span>{d}</span>
                <span>{[82, 71, 88][i]}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--preview-surface-2)]">
                <div className="h-full rounded-full" style={{ width: `${[82, 71, 88][i]}%`, background: ["#059669", "#d97706", "#2563eb"][i] }} />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ] as const;

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Pill tone="green">Study Ecosystem</Pill>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--preview-text)] sm:text-4xl">
            One guided clinical operating system.
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-6 text-[var(--preview-muted)]">
          NurseNest is not a pile of content. Each tool connects to the next — read, recall, practice, and assess in a single study loop.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="rounded-[1.75rem] border p-5 shadow-[0_20px_55px_rgba(15,23,42,0.09)]"
              style={{
                borderColor: `color-mix(in srgb, ${step.color} 30%, var(--preview-border))`,
                background: `linear-gradient(145deg, color-mix(in srgb, ${step.color} 10%, var(--preview-surface)), var(--preview-surface))`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-sm" style={{ background: step.color }}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-3xl font-bold opacity-20 text-[var(--preview-text)]">{step.num}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[var(--preview-text)]">{step.title}</h3>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: step.color }}>{step.subtitle}</p>
              <p className="mt-2 text-xs leading-5 text-[var(--preview-muted)]">{step.copy}</p>
              {step.preview}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Readiness intelligence dashboard preview */
function ReadinessIntelligence() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Left: domain mastery */}
      <PreviewCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Pill tone="green">Readiness Intelligence</Pill>
            <h2 className="mt-3 text-2xl font-bold text-[var(--preview-text)]">Know exactly what to study next.</h2>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-[var(--preview-text)]">78%</p>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--preview-muted)]">Overall Readiness</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {[
            { domain: "Cardiac Priority", pct: 78, color: "#e11d48" },
            { domain: "Pharmacology Safety", pct: 69, color: "#d97706" },
            { domain: "Clinical Judgment", pct: 86, color: "#059669" },
            { domain: "Maternal / Newborn", pct: 61, color: "#d97706" },
            { domain: "Mental Health", pct: 72, color: "#7c3aed" },
          ].map((item) => (
            <div key={item.domain}>
              <div className="mb-1.5 flex items-center justify-between text-sm font-bold">
                <span className="text-[var(--preview-text)]">{item.domain}</span>
                <span style={{ color: item.color }}>{item.pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--preview-surface-2)]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${item.pct}%`, background: `linear-gradient(90deg, ${item.color}, color-mix(in srgb, ${item.color} 70%, var(--preview-accent-2)))` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Streak + next action */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-surface-2)] p-3 text-center">
            <p className="text-2xl font-bold" style={{ color: "#d97706" }}>12d</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">Study Streak</p>
          </div>
          <div className="rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-surface-2)] p-3 text-center">
            <p className="text-2xl font-bold" style={{ color: "#2563eb" }}>5</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">Weak Areas</p>
          </div>
          <div className="rounded-2xl border border-[var(--preview-border)] bg-[var(--preview-surface-2)] p-3 text-center">
            <p className="text-2xl font-bold" style={{ color: "#059669" }}>92%</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">Completion</p>
          </div>
        </div>
      </PreviewCard>

      {/* Right: today's plan + priority recommendation */}
      <div className="space-y-4">
        <PreviewCard className="bg-[linear-gradient(145deg,var(--preview-accent-soft),var(--preview-surface))]">
          <Zap className="h-7 w-7 text-[var(--preview-accent)]" />
          <h3 className="mt-3 text-xl font-bold text-[var(--preview-text)]">Today's Priority</h3>
          <div
            className="mt-3 rounded-2xl border p-4"
            style={{
              borderColor: "color-mix(in srgb, #d97706 36%, var(--preview-border))",
              background: "color-mix(in srgb, #d97706 9%, var(--preview-surface))",
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#d97706" }}>Weak Area — Low Mastery</p>
            <p className="mt-1 text-sm font-bold text-[var(--preview-text)]">Pharmacology Safety · 69%</p>
            <p className="mt-1 text-xs text-[var(--preview-muted)]">Reinforce missed cards + 10 focused practice Qs.</p>
          </div>
          <Button className="mt-4 w-full rounded-2xl" size="sm">Start Priority Study</Button>
        </PreviewCard>

        <PreviewCard>
          <h3 className="text-base font-bold text-[var(--preview-text)]">Today's Study Plan</h3>
          <div className="mt-3 space-y-2">
            {[
              { label: "Review cardiac cues", done: true, color: "#059669" },
              { label: "Pharm safety flashcards", done: false, color: "#7c3aed" },
              { label: "Mixed practice 15 Qs", done: false, color: "#2563eb" },
              { label: "CAT readiness check", done: false, color: "#d97706" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-xl border border-[var(--preview-border)] bg-[var(--preview-elevated)] px-3 py-2.5">
                <span
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    background: item.done ? item.color : `color-mix(in srgb, ${item.color} 15%, var(--preview-surface))`,
                    color: item.done ? "#fff" : item.color,
                    border: `1.5px solid ${item.color}`,
                  }}
                >
                  {item.done ? "✓" : ""}
                </span>
                <span className="text-xs font-semibold text-[var(--preview-text)]">{item.label}</span>
              </div>
            ))}
          </div>
        </PreviewCard>
      </div>
    </section>
  );
}

/** 3 testimonials */
function TestimonialStrip() {
  const quotes = [
    {
      text: "I went from failing every practice test to passing NCLEX on my first attempt. The semantic lesson layout finally made cardiac pathophysiology click for me.",
      name: "Sarah M.",
      role: "RN Student",
      exam: "NCLEX-RN",
      color: "#2563eb",
    },
    {
      text: "The diagnostic reasoning sections for NP prep are unlike anything else out there. It feels like studying medicine, not just memorizing for a board exam.",
      name: "James K.",
      role: "NP Student",
      exam: "CNPE",
      color: "#7c3aed",
    },
    {
      text: "As an RPN student balancing clinicals and studying, the study planner and readiness tracker kept me on track without burnout. Highly recommend.",
      name: "Priya T.",
      role: "RPN Student",
      exam: "CPNRE",
      color: "#059669",
    },
  ];

  return (
    <section className="space-y-5">
      <div className="text-center">
        <Pill>Student Voices</Pill>
        <h2 className="mt-3 text-2xl font-bold text-[var(--preview-text)] sm:text-3xl">
          Learners who think like nurses. Pass like nurses.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quotes.map((q) => (
          <div
            key={q.name}
            className="flex flex-col rounded-[1.75rem] border p-6 shadow-[0_20px_55px_rgba(15,23,42,0.09)]"
            style={{
              borderColor: `color-mix(in srgb, ${q.color} 28%, var(--preview-border))`,
              background: `linear-gradient(145deg, color-mix(in srgb, ${q.color} 8%, var(--preview-surface)), var(--preview-surface))`,
            }}
          >
            {/* Stars */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" style={{ color: "#f59e0b" }} />
              ))}
            </div>

            <blockquote className="mt-4 flex-1 text-sm leading-7 text-[var(--preview-text)]">
              &ldquo;{q.text}&rdquo;
            </blockquote>

            <div className="mt-5 flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: q.color }}
              >
                {q.name[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--preview-text)]">{q.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--preview-muted)]">{q.role} · {q.exam}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Full-width premium CTA section */
function PremiumConversionCTA() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[var(--preview-border)] bg-[linear-gradient(145deg,var(--preview-accent-soft),var(--preview-surface-2)_50%,var(--preview-surface))] p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:p-10">
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_20%_50%,color-mix(in_srgb,var(--preview-accent)_15%,transparent),transparent_60%)]" />
      <div className="relative text-center">
        <Sparkles className="mx-auto h-10 w-10 text-[var(--preview-accent)]" />
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-[var(--preview-text)] sm:text-4xl">
          Begin your nursing success story today.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[var(--preview-muted)]">
          Join 12,000+ nursing learners who use NurseNest to study smarter, track readiness, and pass their exams with clinical confidence.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button className="h-12 rounded-2xl px-8 text-[1rem] font-bold shadow-[0_8px_32px_rgba(15,23,42,0.22)]">
            Start Free — No Card Required
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-2xl border-[var(--preview-border)] bg-[var(--preview-surface)]/80 px-6 text-[1rem] font-bold"
          >
            See Plans
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          {[
            { label: "No credit card required", icon: Award },
            { label: "Cancel anytime", icon: CheckCircle2 },
            { label: "All pathways included", icon: Layers3 },
          ].map((trust) => {
            const Ic = trust.icon;
            return (
              <div key={trust.label} className="flex items-center gap-2 text-sm font-semibold text-[var(--preview-muted)]">
                <Ic className="h-4 w-4 text-[var(--preview-accent)]" />
                {trust.label}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Combined homepage — all new premium sections */
function HomepagePreview() {
  return (
    <div className="space-y-10">
      <PremiumHero />
      <StatsTrustBand />
      <PathwayShowcase />
      <LessonSystemPreview />
      <StudyEcosystemFlow />
      <ReadinessIntelligence />
      <TestimonialStrip />
      <PremiumConversionCTA />
    </div>
  );
}


export { HomepagePreview };
