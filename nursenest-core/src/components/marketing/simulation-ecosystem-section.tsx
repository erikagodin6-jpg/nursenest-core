/**
 * SimulationEcosystemSection
 *
 * Marketing homepage section advertising the simulation platform.
 * Used on the main homepage and on simulation landing pages.
 *
 * Shows:
 *   - Patient deterioration simulation value prop
 *   - Replay engine
 *   - Clinical readiness tracking
 *   - Competency clearances
 *   - Stat counters
 *
 * Theme-aware, no stock photos, uses platform-specific copy.
 */

import Link from "next/link";

const STATS = [
  { value: "51", label: "Simulations", sub: "RN · RPN · NP · RT · New Grad" },
  { value: "26", label: "Conditions", sub: "From sepsis to cardiac arrest" },
  { value: "7", label: "Readiness Domains", sub: "Telemetry to ICU to RT Critical Care" },
  { value: "100%", label: "Live Physiology", sub: "Real deteriorating patient monitor" },
];

const FEATURES = [
  {
    icon: "💓",
    title: "Live Patient Monitor",
    description: "Practice on a real deteriorating patient. Watch vitals fall, alarms fire, and ECG rhythms change — all responding to your interventions in real time.",
    cta: "Try a simulation",
    href: "/app/physiology-monitor",
  },
  {
    icon: "⏮️",
    title: "Replay Every Decision",
    description: "After each session, replay your decisions side-by-side with the optimal path. See exactly when you missed an opportunity and what top performers do differently.",
    cta: "See replay demo",
    href: "/app/simulation-center",
  },
  {
    icon: "📊",
    title: "Clinical Readiness Tracking",
    description: "Track readiness across 7 clinical domains — Telemetry, ICU, Rapid Response, ECG, Shock Recognition, RT Critical Care, and New Graduate Safe Practice.",
    cta: "View readiness",
    href: "/app/simulation-center/readiness",
  },
  {
    icon: "🏅",
    title: "Earn Unit Clearances",
    description: "Demonstrate competency through simulation performance to earn verifiable clearances for specific clinical environments. Share with educators and employers.",
    cta: "View clearances",
    href: "/app/simulation-center/clearances",
  },
  {
    icon: "🧠",
    title: "NCJMM Clinical Judgment",
    description: "Every simulation scores all 6 NCJMM domains — Recognize Cues, Analyze, Prioritize, Generate Solutions, Take Action, Evaluate Outcomes.",
    cta: "Start practicing",
    href: "/app/simulation-center",
  },
  {
    icon: "🔄",
    title: "Adaptive Remediation",
    description: "After each session, receive a personalised plan routing you to flashcards, ECG drills, practice questions, and simulations targeting your weakest areas.",
    cta: "Learn more",
    href: "/app/simulation-center",
  },
];

const SPECIALTIES = [
  { emoji: "❤️", name: "Cardiac" },
  { emoji: "🏥", name: "Critical Care" },
  { emoji: "🚨", name: "Emergency" },
  { emoji: "🫁", name: "Respiratory" },
  { emoji: "📈", name: "Telemetry" },
  { emoji: "🧠", name: "Neurological" },
  { emoji: "🎓", name: "New Grad" },
  { emoji: "⚕️", name: "NP Advanced" },
  { emoji: "🌬️", name: "RT Clinical" },
];

export function SimulationEcosystemSection({ subscriberView = false }: { subscriberView?: boolean }) {
  const startHref = subscriberView ? "/app/simulation-center" : "/pricing";

  return (
    <section className="space-y-16 py-16 sm:py-20">

      {/* ── Hero headline ── */}
      <div className="text-center space-y-4 px-4">
        <div className="inline-block rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">
          Clinical Simulation Platform
        </div>
        <h2 className="text-3xl font-black text-[var(--semantic-text-primary)] sm:text-4xl leading-tight max-w-3xl mx-auto">
          Think like a clinician.<br />
          <span style={{ color: "var(--semantic-brand)" }}>Practice on a deteriorating patient.</span>
        </h2>
        <p className="text-base text-[var(--semantic-text-secondary)] max-w-2xl mx-auto leading-relaxed">
          NurseNest is the only nursing platform with a live physiology monitor — 51 patient scenarios,
          full session replay, 7-domain readiness scoring, and verifiable unit clearances.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link
            href={startHref}
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold nn-text-on-solid-fill shadow-md transition hover:opacity-95 no-underline"
            style={{ background: "var(--role-cta, var(--semantic-brand))" }}
          >
            Start Simulating →
          </Link>
          {!subscriberView && (
            <Link
              href="/app/physiology-monitor"
              className="inline-flex items-center gap-2 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-3 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-[var(--semantic-shadow-soft)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] no-underline"
            >
              Try Free Simulation
            </Link>
          )}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)]"
            >
              <span className="text-3xl font-black text-[var(--semantic-brand)]">{s.value}</span>
              <span className="mt-0.5 text-sm font-bold text-[var(--semantic-text-primary)]">{s.label}</span>
              <span className="text-[0.6rem] text-[var(--semantic-text-muted)] leading-relaxed">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature grid ── */}
      <div className="mx-auto max-w-6xl px-4">
        <h3 className="text-center text-xl font-black text-[var(--semantic-text-primary)] mb-8">
          More than a question bank
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group flex flex-col gap-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:shadow-md no-underline"
            >
              <span className="text-2xl leading-none">{f.icon}</span>
              <h4 className="text-sm font-bold text-[var(--semantic-text-primary)]">{f.title}</h4>
              <p className="text-[0.72rem] text-[var(--semantic-text-secondary)] leading-relaxed flex-1">
                {f.description}
              </p>
              <span className="text-[0.68rem] font-semibold text-[var(--semantic-brand)] group-hover:underline">
                {f.cta} →
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Specialty coverage ── */}
      <div className="mx-auto max-w-4xl px-4 text-center space-y-4">
        <p className="text-sm font-bold text-[var(--semantic-text-primary)]">Coverage across every specialty</p>
        <div className="flex flex-wrap justify-center gap-2">
          {SPECIALTIES.map((s) => (
            <div
              key={s.name}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-[0.7rem] font-semibold text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]"
            >
              <span>{s.emoji}</span>
              {s.name}
            </div>
          ))}
        </div>
      </div>

      {/* ── Social proof / differentiation statement ── */}
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_3%,var(--semantic-surface))] p-6 text-center space-y-3">
          <p className="text-base font-bold text-[var(--semantic-text-primary)]">
            The only nursing platform where your decisions have real consequences.
          </p>
          <p className="text-sm text-[var(--semantic-text-secondary)] leading-relaxed">
            NurseNest simulations run on a live physiologic engine — every intervention you apply changes
            the patient&apos;s vitals, ECG, and trajectory in real time. When you delay, the patient deteriorates.
            When you act correctly, they stabilise.
          </p>
          <Link
            href={startHref}
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold nn-text-on-solid-fill shadow-md transition hover:opacity-95 no-underline"
            style={{ background: "var(--role-cta, var(--semantic-brand))" }}
          >
            {subscriberView ? "Open Simulation Center" : "Start Free Trial"}
          </Link>
        </div>
      </div>

    </section>
  );
}
