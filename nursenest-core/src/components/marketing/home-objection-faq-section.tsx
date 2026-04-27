"use client";

import { ChevronDown } from "lucide-react";

import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { FadeUp } from "@/lib/motion";
import { safeHomepageMarketingCopy } from "@/lib/marketing/homepage-safe-copy";

const KEYS = ["worthIt", "countryExam", "rationales", "platform", "vsOthers"] as const;

export function HomeObjectionFaqSection() {
  const { locale, t } = useMarketingI18n();

  return (
    <section
      className="nn-section-block scroll-mt-20 border-y border-[color-mix(in_srgb,var(--semantic-chart-4)_18%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_05%,var(--page-bg))]"
      aria-labelledby="home-objections-heading"
      data-testid="section-home-objection-faq"
    >
      <div className="nn-section-shell py-10 sm:py-12">
        <FadeUp
          whenInView
          once
          viewMargin="-28px"
          className="mx-auto mb-8 max-w-2xl text-center"
        >
          <p className="nn-marketing-eyebrow text-[var(--semantic-brand)]">
            {formatTitleCase(
              safeHomepageMarketingCopy(t, "pages.home.objections.eyebrow", "Common questions"),
              locale,
            )}
          </p>

          <h2
            id="home-objections-heading"
            className="nn-marketing-h2 mt-2 text-balance text-[var(--palette-heading)]"
          >
            {formatTitleCase(
              safeHomepageMarketingCopy(t, "pages.home.objections.heading", "Before you start"),
              locale,
            )}
          </h2>

          <p className="nn-marketing-body-sm mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-[var(--palette-text-muted)]">
            {formatSentenceCase(
              safeHomepageMarketingCopy(
                t,
                "pages.home.objections.subheading",
                "Answers to common questions about NurseNest and exam prep.",
              ),
              locale,
            )}
          </p>
        </FadeUp>

        <div className="mx-auto max-w-3xl space-y-2">
          {KEYS.map((key) => (
            <details
              key={key}
              className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3.5 shadow-[var(--shadow-elevated)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-semibold text-[var(--palette-heading)]">
                  {formatTitleCase(
                    safeHomepageMarketingCopy(
                      t,
                      `pages.home.objections.${key}Question`,
                      "Question",
                    ),
                    locale,
                  )}
                </span>

                <ChevronDown
                  className="h-4 w-4 shrink-0 text-[var(--palette-text-muted)] transition group-open:rotate-180"
                  aria-hidden
                />
              </summary>

              <p className="nn-marketing-body-sm mt-3 border-t border-[var(--semantic-border-soft)] pt-3 text-[var(--theme-muted-text)]">
                {formatSentenceCase(
                  safeHomepageMarketingCopy(
                    t,
                    `pages.home.objections.${key}Answer`,
                    "Answer coming soon.",
                  ),
                  locale,
                )}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}