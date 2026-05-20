import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LearnerReportInset } from "@/components/student/learner-report-card-primitives";

export type EducGraphNextStep = {
  title: string;
  href: string;
  kind: string;
};

export function EducGraphNextStepsPanel({
  steps,
  title,
  intro,
  maxVisible = 5,
}: {
  steps: EducGraphNextStep[];
  title: string;
  intro?: string | null;
  maxVisible?: number;
}) {
  const visible = steps.slice(0, maxVisible);
  if (visible.length === 0) return null;

  return (
    <div
      className="nn-educ-graph-next-steps-stable"
      style={{ ["--nn-graph-steps-rows" as string]: String(Math.min(visible.length, maxVisible)) }}
    >
    <LearnerReportInset tone="supportive">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--semantic-text-secondary)]">
        {title}
      </p>
      {intro ? (
        <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-muted)]">{intro}</p>
      ) : null}
      <ul className="mt-4 flex flex-col gap-2">
        {visible.map((step) => (
          <li key={`${step.href}-${step.title}`}>
            <Link
              href={step.href}
              className="group flex items-center justify-between gap-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_40%,var(--semantic-surface))] px-4 py-3 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))]"
            >
              <span className="min-w-0">
                <span className="block truncate">{step.title}</span>
                <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-wide text-[var(--semantic-text-muted)]">
                  {step.kind.replace(/_/g, " ")}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-[var(--semantic-brand)] opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </LearnerReportInset>
    </div>
  );
}
