"use client";

import { Brain, Crosshair, Scale, ShieldCheck } from "lucide-react";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { useMarketingI18n } from "@/lib/marketing-i18n";

const POINTS = [
  {
    icon: Brain,
    iconColor: "var(--semantic-info)",
    title: "Not Generic Question Banks",
    body: "Built for nursing exam decision-making, not random mixed-discipline trivia.",
  },
  {
    icon: ShieldCheck,
    iconColor: "var(--semantic-success)",
    title: "Built For Your Exact License",
    body: "RN, PN or RPN, NP, and allied tracks stay scoped so context does not drift.",
  },
  {
    icon: Scale,
    iconColor: "var(--semantic-warning)",
    title: "Readiness Tracked Over Time",
    body: "Session trends and weak-area signals show what changed and what needs work next.",
  },
  {
    icon: Crosshair,
    iconColor: "var(--semantic-brand)",
    title: "Adapts To Your Weak Areas",
    body: "Lessons, questions, and CAT flow together so remediation is targeted, not manual.",
  },
] as const;

/**
 * Differentiation section: four colorful feature cards, each with a unique semantic icon color.
 * Tinted surface separates this visually from adjacent white card sections.
 */
export function HomeTrustProofSection() {
  const { locale } = useMarketingI18n();

  return (
    <section
      className="nn-section-block nn-section-enter border-y border-[var(--trust-surface-border)] bg-[var(--trust-surface)]"
      aria-labelledby="home-differentiation-heading"
      data-testid="section-home-differentiation"
    >
      <div className="nn-section-shell">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <h2 id="home-differentiation-heading" className="nn-marketing-h2 text-balance">
            {formatTitleCase("Why NurseNest Is Different", locale)}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-pretty text-[var(--palette-text-muted)]">
            {formatSentenceCase(
              "A focused readiness system for your specific license, not a generic question archive.",
              locale,
            )}
          </p>
        </header>

        <ul className="grid gap-5 md:grid-cols-2">
          {POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <li
                key={point.title}
                className="flex gap-4 rounded-2xl border bg-[var(--bg-card)] p-6 shadow-[var(--elevation-rest)]"
                style={{
                  borderColor: `color-mix(in srgb, ${point.iconColor} 20%, var(--border-subtle))`,
                  borderLeft: `3px solid ${point.iconColor}`,
                }}
              >
                <span
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                  style={{
                    background: `color-mix(in srgb, ${point.iconColor} 10%, var(--bg-card))`,
                    borderColor: `color-mix(in srgb, ${point.iconColor} 24%, var(--border-subtle))`,
                  }}
                  aria-hidden
                >
                  <Icon className="h-5 w-5" style={{ color: point.iconColor }} />
                </span>
                <div>
                  <h3 className="nn-marketing-h3 mb-1.5" style={{ color: "var(--palette-heading)" }}>
                    {formatTitleCase(point.title, locale)}
                  </h3>
                  <p className="nn-marketing-body-sm text-[var(--theme-muted-text)]">
                    {formatSentenceCase(point.body, locale)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
