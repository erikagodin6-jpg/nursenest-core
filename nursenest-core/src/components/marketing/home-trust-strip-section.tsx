"use client";

import { BadgeCheck, Brain, ClipboardCheck, Globe2, Layers3 } from "lucide-react";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FadeUp } from "@/lib/motion";

type Props = {
  questionCount: number;
  registeredLearners: number;
};

function formatCount(n: number, locale: string): string {
  if (n <= 0) return "";
  return n.toLocaleString(locale.replace(/_/g, "-"));
}

/**
 * Compact credibility band immediately after hero.
 * Uses `surfaceStrong` to clearly separate from page background.
 */
export function HomeTrustStripSection({ questionCount, registeredLearners }: Props) {
  const { locale } = useMarketingI18n();
  const q = formatCount(questionCount, locale);
  const learners = formatCount(registeredLearners, locale);

  const pills = [
    { icon: BadgeCheck, label: "Exam-Aligned Scope", iconClass: "text-[var(--semantic-success)]" },
    { icon: Layers3, label: "Adaptive CAT", iconClass: "text-[var(--semantic-info)]" },
    { icon: ClipboardCheck, label: "Rationales On Every Item", iconClass: "text-[var(--semantic-brand)]" },
    { icon: Brain, label: q ? `${q} Questions` : "Thousands Of Questions", iconClass: "text-[var(--semantic-warning)]" },
  ] as const;

  return (
    <section
      className="nn-section-enter border-b border-[var(--border-subtle)] py-10 sm:py-11"
      style={{ background: "var(--accent-surface-a)" }}
      aria-labelledby="home-trust-strip-heading"
      data-testid="section-home-trust-strip"
    >
      <div className="nn-section-shell">
        <FadeUp whenInView once viewMargin="-24px" className="mx-auto max-w-5xl">
        <div
          className="rounded-2xl border bg-[var(--bg-card)] px-5 py-6 shadow-[var(--shadow-elevated)] sm:px-7 sm:py-7"
          style={{ borderColor: "color-mix(in srgb, var(--theme-primary) 14%, var(--border-subtle))" }}
        >
          <div className="mb-5 flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
            <Globe2 className="nn-icon-md shrink-0 text-[var(--semantic-info)]" aria-hidden />
            <p id="home-trust-strip-heading" className="nn-marketing-body max-w-prose font-semibold leading-snug text-[var(--palette-heading)]">
              {formatTitleCase("Used by nursing students across the United States and Canada", locale)}
            </p>
          </div>
          {learners ? (
            <p className="nn-marketing-caption mb-5 text-center text-[var(--palette-text-muted)]">
              {formatSentenceCase(`${learners} registered learners currently preparing in the platform.`, locale)}
            </p>
          ) : null}
          <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {pills.map((pill) => {
              const Icon = pill.icon;
              return (
                <li
                  key={pill.label}
                  className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--pill-border))] bg-[var(--pill-bg)] px-3.5 py-1.5 text-sm font-semibold text-[var(--pill-fg)] shadow-[var(--elevation-rest)]"
                >
                  <Icon className={`h-4 w-4 shrink-0 ${pill.iconClass}`} aria-hidden />
                  {formatEyebrow(pill.label, locale)}
                </li>
              );
            })}
          </ul>
        </div>
        </FadeUp>
      </div>
    </section>
  );
}
