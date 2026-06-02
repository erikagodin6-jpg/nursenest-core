import { MessageSquare, BarChart2, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STEPS: Array<{
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    number: "01",
    icon: MessageSquare,
    title: "You answer a question",
    description: "Each question is chosen based on your current estimated ability level.",
  },
  {
    number: "02",
    icon: BarChart2,
    title: "Difficulty adjusts based on your answer",
    description: "Correct answers unlock harder questions. Wrong answers target your gaps.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "System estimates your exam readiness",
    description: "A readiness score is calculated after each session — just like the real NCLEX.",
  },
];

export function CatHowItWorks() {
  return (
    <section
      id="cat-how-it-works"
      className="mt-6 scroll-mt-24"
      aria-labelledby="cat-how-heading"
    >
      <div className="rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8">
        <span className="nn-marketing-label">How it works</span>
        <h2
          id="cat-how-heading"
          className="nn-marketing-h2 mt-2 text-[var(--theme-heading-text)]"
        >
          Three steps to exam readiness
        </h2>

        <ol className="mt-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3 sm:gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <li
                key={step.number}
                className="flex flex-col gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))] p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-brand)]">
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-brand)] opacity-70">
                    Step {step.number}
                  </span>
                </div>

                <p className="font-semibold leading-snug text-[var(--theme-heading-text)]">
                  {step.title}
                </p>
                <p className="text-sm leading-relaxed text-[var(--theme-muted-text)]">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
