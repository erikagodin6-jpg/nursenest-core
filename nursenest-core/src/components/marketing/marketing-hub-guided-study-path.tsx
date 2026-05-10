import Link from "next/link";

export type MarketingHubGuidedPathTone = "success" | "info" | "warning" | "brand" | "chart1" | "chart2" | "chart5";

const TONE_STEP_SHELL: Record<
  MarketingHubGuidedPathTone,
  string
> = {
  success:
    "border-[color-mix(in_srgb,var(--semantic-success)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_9%,var(--semantic-surface))]",
  info: "border-[color-mix(in_srgb,var(--semantic-info)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_9%,var(--semantic-surface))]",
  warning:
    "border-[color-mix(in_srgb,var(--semantic-warning)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_9%,var(--semantic-surface))]",
  brand:
    "border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--semantic-surface))]",
  chart1:
    "border-[color-mix(in_srgb,var(--semantic-chart-1)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_8%,var(--semantic-surface))]",
  chart2:
    "border-[color-mix(in_srgb,var(--semantic-chart-2)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_8%,var(--semantic-surface))]",
  chart5:
    "border-[color-mix(in_srgb,var(--semantic-chart-5)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-5)_8%,var(--semantic-surface))]",
};

const TONE_NUM_BADGE: Record<MarketingHubGuidedPathTone, string> = {
  success: "bg-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-surface))] text-[var(--semantic-success)]",
  info: "bg-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-surface))] text-[var(--semantic-info)]",
  warning: "bg-[color-mix(in_srgb,var(--semantic-warning)_18%,var(--semantic-surface))] text-[var(--semantic-warning)]",
  brand: "bg-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-surface))] text-[var(--semantic-brand)]",
  chart1: "bg-[color-mix(in_srgb,var(--semantic-chart-1)_16%,var(--semantic-surface))] text-[var(--semantic-chart-1)]",
  chart2: "bg-[color-mix(in_srgb,var(--semantic-chart-2)_16%,var(--semantic-surface))] text-[var(--semantic-chart-2)]",
  chart5: "bg-[color-mix(in_srgb,var(--semantic-chart-5)_16%,var(--semantic-surface))] text-[var(--semantic-chart-5)]",
};

export type MarketingHubGuidedStudyStep = {
  title: string;
  hint: string;
  href: string;
  tone: MarketingHubGuidedPathTone;
};

export function MarketingHubGuidedStudyPathStrip({
  headingId,
  title,
  subtitle,
  steps,
  className = "",
}: {
  headingId: string;
  title: string;
  subtitle?: string;
  steps: MarketingHubGuidedStudyStep[];
  className?: string;
}) {
  if (steps.length === 0) return null;

  return (
    <section
      className={`rounded-[1.35rem] border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_6%,var(--semantic-surface))] p-5 sm:p-6 ${className}`.trim()}
      aria-labelledby={headingId}
      data-nn-marketing-hub-guided-path="1"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 id={headingId} className="nn-marketing-h3 text-[var(--theme-heading-text)]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <ol className="mt-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
        {steps.map((step, i) => {
          const n = i + 1;
          const shell = TONE_STEP_SHELL[step.tone];
          const badge = TONE_NUM_BADGE[step.tone];
          return (
            <li key={`${step.href}-${step.title}`} className="min-w-0 flex-1 sm:min-w-[11rem] sm:flex-none sm:max-w-[14rem]">
              <Link
                href={step.href}
                className={`flex h-full min-h-[4.5rem] flex-col rounded-xl border p-3 shadow-[var(--semantic-shadow-soft)] transition motion-safe:hover:-translate-y-0.5 ${shell}`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${badge}`}
                    aria-hidden
                  >
                    {n}
                  </span>
                  <span className="text-sm font-semibold leading-snug text-[var(--theme-heading-text)]">{step.title}</span>
                </span>
                <span className="mt-2 pl-9 text-xs leading-snug text-[var(--semantic-text-secondary)]">{step.hint}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
