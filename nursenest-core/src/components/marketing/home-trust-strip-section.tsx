"use client";

import { BadgeCheck, Brain, ClipboardCheck, Layers3, Sparkles } from "lucide-react";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { useMarketingI18n } from "@/lib/marketing-i18n";

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
    { icon: BadgeCheck, label: "Exam-Aligned Scope" },
    { icon: Layers3, label: "Adaptive CAT" },
    { icon: ClipboardCheck, label: "Rationales On Every Item" },
    { icon: Brain, label: q ? `${q} Questions` : "Thousands Of Questions" },
  ] as const;

  return (
    <section
      className="nn-section-enter border-b border-[var(--border-subtle)] py-8"
      style={{ background: "var(--accent-surface-a)" }}
      aria-labelledby="home-trust-strip-heading"
      data-testid="section-home-trust-strip"
    >
      <div className="nn-section-shell">
        <div
          className="mx-auto max-w-5xl rounded-2xl border bg-[var(--bg-card)] px-5 py-5 shadow-[var(--elevation-rest)] sm:px-6"
          style={{ borderColor: "color-mix(in srgb, var(--theme-primary) 14%, var(--border-subtle))" }}
        >
          <div className="mb-4 flex items-center justify-center gap-2 text-center">
            <Sparkles className="nn-icon-md text-[var(--semantic-brand)]" aria-hidden />
            <p id="home-trust-strip-heading" className="nn-marketing-body font-semibold text-[var(--palette-heading)]">
              {formatTitleCase("Used by nursing students across the United States and Canada", locale)}
            </p>
          </div>
          {learners ? (
            <p className="nn-marketing-caption mb-4 text-center text-[var(--palette-text-muted)]">
              {formatSentenceCase(`${learners} registered learners currently preparing in the platform.`, locale)}
            </p>
          ) : null}
          <ul className="flex flex-wrap items-center justify-center gap-2.5">
            {pills.map((pill) => {
              const Icon = pill.icon;
              return (
                <li
                  key={pill.label}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--pill-fg)]"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {formatEyebrow(pill.label, locale)}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
