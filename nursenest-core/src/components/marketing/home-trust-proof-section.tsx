"use client";

import { Brain, Crosshair, Scale, ShieldCheck } from "lucide-react";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";

const POINTS = [
  {
    icon: Brain,
    iconColor: "var(--semantic-info)",
    title: "Question sets scoped to nursing exams",
    body: "Content is written for nursing exam decisions, not mixed-discipline trivia.",
  },
  {
    icon: ShieldCheck,
    iconColor: "var(--semantic-success)",
    title: "Matched to your license",
    body: "RN, PN or RPN, NP, and allied tracks stay scoped so content matches the correct exam context.",
  },
  {
    icon: Scale,
    iconColor: "var(--semantic-warning)",
    title: "Readiness tracked over time",
    body: "Session trends and weak-topic signals show what changed and what needs review next.",
  },
  {
    icon: Crosshair,
    iconColor: "var(--semantic-brand)",
    title: "Review follows weak areas",
    body: "Lessons, questions, and CAT sessions stay linked so follow-up review is targeted.",
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
        <FadeUp whenInView once viewMargin="-32px" className="mx-auto mb-12 max-w-2xl text-center">
          <h2 id="home-differentiation-heading" className="nn-marketing-h2 text-balance">
            {formatTitleCase("Why learners use NurseNest", locale)}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-[var(--palette-text-muted)]">
            {formatSentenceCase(
              "A readiness system matched to your license, with lessons and practice connected in one workflow.",
              locale,
            )}
          </p>
        </FadeUp>

        <StaggerGroup className="grid gap-5 md:grid-cols-2" whenInView once viewMargin="-40px">
          {POINTS.map((point, idx) => {
            const Icon = point.icon;
            return (
              <StaggerItem key={point.title} variant={idx % 2 === 0 ? "fadeUp" : "softReveal"} className="min-w-0">
              <article
                className="flex h-full gap-4 rounded-2xl border bg-[var(--bg-card)] p-6 shadow-[var(--shadow-elevated)] transition-[box-shadow,border-color] duration-200 ease-[var(--motion-ease)] hover:border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border-subtle))]"
                style={{
                  borderColor: `color-mix(in srgb, ${point.iconColor} 18%, var(--border-subtle))`,
                  borderTop: `3px solid ${point.iconColor}`,
                }}
              >
                <span
                  className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                  style={{
                    background: `color-mix(in srgb, ${point.iconColor} 10%, var(--bg-card))`,
                    borderColor: `color-mix(in srgb, ${point.iconColor} 24%, var(--border-subtle))`,
                  }}
                  aria-hidden
                >
                  <Icon className="h-5 w-5" style={{ color: point.iconColor }} />
                </span>
                <div className="min-w-0">
                  <h3 className="nn-marketing-h3 mb-1.5" style={{ color: "var(--palette-heading)" }}>
                    {formatTitleCase(point.title, locale)}
                  </h3>
                  <p className="nn-marketing-body-sm text-[var(--theme-muted-text)]">
                    {formatSentenceCase(point.body, locale)}
                  </p>
                </div>
              </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
