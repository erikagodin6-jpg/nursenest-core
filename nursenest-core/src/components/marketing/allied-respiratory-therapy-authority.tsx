import Link from "next/link";
import { Activity, AirVent, AlertTriangle, ClipboardCheck, Gauge, HeartPulse, Layers3, Stethoscope } from "lucide-react";
import { ALLIED_GLOBAL_HUB_PATH } from "@/lib/allied/allied-global-pathway";

const respiratoryClusters = [
  {
    title: "ABG interpretation",
    description: "Connect pH, PaCO₂, HCO₃⁻, oxygenation, compensation, and clinical context instead of memorizing isolated values.",
    bullets: ["Acidosis vs alkalosis", "Respiratory vs metabolic patterns", "Compensation traps"],
    icon: Activity,
  },
  {
    title: "Mechanical ventilation",
    description: "Review ventilator mode logic, alarms, oxygenation changes, ventilation changes, and safe escalation patterns.",
    bullets: ["Mode recognition", "PEEP and FiO₂ decisions", "High-pressure alarms"],
    icon: AirVent,
  },
  {
    title: "Oxygen delivery",
    description: "Compare nasal cannula, masks, high-flow systems, noninvasive ventilation, and escalation cues.",
    bullets: ["Device selection", "Flow and FiO₂ expectations", "Deterioration cues"],
    icon: Gauge,
  },
  {
    title: "Airway and secretion safety",
    description: "Practice suctioning judgment, airway adjuncts, aspiration risk, infection control, and patient tolerance cues.",
    bullets: ["Airway priorities", "Suctioning risks", "VAP prevention"],
    icon: Stethoscope,
  },
];

const examSignals = [
  "Ventilation versus oxygenation problems",
  "ABG changes after ventilator adjustments",
  "When SpO₂ is misleading",
  "When to escalate oxygen support",
  "Alarm troubleshooting sequence",
  "Infection prevention around circuits",
];

const studyLoop = [
  {
    title: "Anchor the physiology",
    body: "Start with gas exchange, ventilation, perfusion, acid-base balance, and respiratory mechanics before drilling exam-style items.",
    icon: HeartPulse,
  },
  {
    title: "Practice clinical decisions",
    body: "Use question blocks to rehearse what to do next: adjust settings, reassess, escalate, communicate, or protect the airway.",
    icon: ClipboardCheck,
  },
  {
    title: "Reinforce with recall",
    body: "Use flashcards for device ranges, formulas, alarm causes, medication classes, and high-yield safety warnings.",
    icon: Layers3,
  },
];

export function AlliedRespiratoryTherapyAuthority() {
  const lessonsHref = `${ALLIED_GLOBAL_HUB_PATH}/lessons?alliedProfession=respiratory`;
  const questionsHref = `${ALLIED_GLOBAL_HUB_PATH}/questions?alliedProfession=respiratory`;
  const flashcardsHref = `${ALLIED_GLOBAL_HUB_PATH}/flashcards?alliedProfession=respiratory`;

  return (
    <section
      className="mb-10 space-y-8 rounded-[1.75rem] border border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-7 lg:p-8"
      aria-labelledby="allied-rt-authority-heading"
      data-nn-allied-rt-authority="1"
    >
      <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <p className="nn-premium-home-eyebrow">Respiratory Therapy Flagship Track</p>
          <h2 id="allied-rt-authority-heading" className="nn-marketing-h2 mt-2 text-balance">
            Respiratory therapy prep built around oxygenation, ventilation, and airway judgment
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-base">
            RT learners need more than generic healthcare questions. This track should teach the logic behind ABGs, oxygen delivery,
            ventilator responses, alarms, airway safety, and patient deterioration so learners can reason through clinical scenarios.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={lessonsHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-brand-contrast)] shadow-md transition hover:opacity-95"
            >
              Open RT Lessons
            </Link>
            <Link
              href={questionsHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[var(--semantic-panel-muted)]"
            >
              Practice RT Questions
            </Link>
          </div>
        </div>

        <aside className="rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-7 w-7 text-[var(--semantic-warning)]" aria-hidden />
            <div>
              <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">High-yield RT exam signals</h3>
              <p className="text-xs text-[var(--semantic-text-secondary)]">Use these as internal-link anchors for future RT articles and tools.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {examSignals.map((signal) => (
              <span
                key={signal}
                className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-secondary)]"
              >
                {signal}
              </span>
            ))}
          </div>
        </aside>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {respiratoryClusters.map((cluster) => {
          const Icon = cluster.icon;
          return (
            <article key={cluster.title} className="rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
              <Icon className="h-7 w-7 text-[var(--semantic-info)]" aria-hidden />
              <h3 className="mt-4 text-base font-semibold text-[var(--theme-heading-text)]">{cluster.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{cluster.description}</p>
              <ul className="mt-4 space-y-2 text-xs text-[var(--semantic-text-secondary)]">
                {cluster.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--semantic-info)]" aria-hidden />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {studyLoop.map((step) => {
          const Icon = step.icon;
          return (
            <Link
              key={step.title}
              href={step.title === "Reinforce with recall" ? flashcardsHref : step.title === "Practice clinical decisions" ? questionsHref : lessonsHref}
              className="rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_32%,var(--semantic-border-soft))]"
            >
              <Icon className="h-7 w-7 text-[var(--semantic-brand)]" aria-hidden />
              <h3 className="mt-4 text-base font-semibold text-[var(--theme-heading-text)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{step.body}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
