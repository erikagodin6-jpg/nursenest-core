"use client";

import { Brain, Crosshair, Scale, ShieldCheck } from "lucide-react";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { useMarketingI18n } from "@/lib/marketing-i18n";

/**
 * Differentiation section: concise comparison-style points for fast scanning.
 */
export function HomeTrustProofSection() {
  const { locale } = useMarketingI18n();
  const points = [
    {
      icon: Brain,
      title: "Not Generic Question Banks",
      body: "Built for nursing exam decision-making, not random mixed-discipline trivia.",
    },
    {
      icon: ShieldCheck,
      title: "Built For Your Exact License",
      body: "RN, PN or RPN, NP, and allied tracks stay scoped so context does not drift.",
    },
    {
      icon: Scale,
      title: "Readiness Tracked Over Time",
      body: "Session trends and weak-area signals show what changed and what needs work next.",
    },
    {
      icon: Crosshair,
      title: "Adapts To Your Weak Areas",
      body: "Lessons, questions, and CAT flow together so remediation is targeted, not manual.",
    },
  ] as const;

  return (
    <section
      className="nn-section-block nn-section-enter border-b border-[var(--border-subtle)] bg-[var(--page-bg)]"
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
        <ul className="grid gap-4 md:grid-cols-2">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <li key={point.title} className="nn-card-system nn-card-system-pad nn-card-system--interactive text-left">
                <span className="nn-card-system__icon mb-2">
                  <Icon className="nn-icon-lg text-[var(--semantic-brand)]" aria-hidden />
                </span>
                <h3 className="nn-card-system__title">{formatTitleCase(point.title, locale)}</h3>
                <p className="nn-card-system__description">{formatSentenceCase(point.body, locale)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
