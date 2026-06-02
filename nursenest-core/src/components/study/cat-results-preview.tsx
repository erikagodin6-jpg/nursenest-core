import { TrendingUp, AlertCircle, LayoutGrid, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ResultItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: { icon: string; card: string };
};

const RESULTS: ResultItem[] = [
  {
    icon: TrendingUp,
    title: "Readiness score",
    description: "0–100 score calibrated to your exam target. Track it after every session.",
    colorClass: {
      icon: "bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--role-success,var(--semantic-success))] border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--semantic-border-soft))]",
      card: "border-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_4%,var(--semantic-surface))]",
    },
  },
  {
    icon: AlertCircle,
    title: "Strengths & weaknesses",
    description: "See exactly which topic areas you've mastered and which need work.",
    colorClass: {
      icon: "bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] text-[var(--semantic-warning)] border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))]",
      card: "border-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_4%,var(--semantic-surface))]",
    },
  },
  {
    icon: LayoutGrid,
    title: "Topic breakdown",
    description:
      "Performance by category — fluid & electrolytes, pharm, fundamentals, and more.",
    colorClass: {
      icon: "bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] text-[var(--semantic-info)] border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))]",
      card: "border-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_4%,var(--semantic-surface))]",
    },
  },
  {
    icon: ArrowRight,
    title: "Recommended next steps",
    description: "Personalised study suggestions based on your session results.",
    colorClass: {
      icon: "bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-brand)] border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))]",
      card: "border-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))]",
    },
  },
];

export function CatResultsPreview() {
  return (
    <section className="mt-6" aria-labelledby="cat-results-heading">
      <div className="rounded-[1.75rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8">
        <span className="nn-marketing-label">After your session</span>
        <h2
          id="cat-results-heading"
          className="nn-marketing-h2 mt-2 text-[var(--theme-heading-text)]"
        >
          What you get from every CAT session
        </h2>
        <p className="nn-marketing-body-sm mt-2 max-w-2xl text-[var(--theme-muted-text)]">
          Each session generates a full performance report — not just a score.
        </p>

        <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {RESULTS.map((result) => {
            const Icon = result.icon;
            return (
              <li
                key={result.title}
                className={`rounded-2xl border p-5 transition-shadow hover:shadow-[var(--semantic-shadow-soft)] ${result.colorClass.card}`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border ${result.colorClass.icon}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </span>
                <p className="mt-3 font-semibold leading-snug text-[var(--theme-heading-text)]">
                  {result.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--theme-muted-text)]">
                  {result.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
