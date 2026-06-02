"use client";

import { useMemo, useState } from "react";
import { Activity, CheckCircle2, FileText, Target } from "lucide-react";

import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { FadeUp } from "@/lib/motion";

/**
 * Safe translation accessor (prevents white-screen on missing keys)
 */
function safeT(
  t: (key: string) => string,
  key: string,
  fallback: string
): string {
  try {
    const val = t(key);
    return val && val !== key ? val : fallback;
  } catch {
    return fallback;
  }
}

const READINESS_META = [
  { key: "readinessBand0", value: 72, toneClass: "nn-progress-fill-semantic-readiness" },
  { key: "readinessBand1", value: 79, toneClass: "nn-progress-fill-semantic-success" },
  { key: "readinessBand2", value: 66, toneClass: "nn-progress-fill-semantic-info" },
  { key: "readinessBand3", value: 58, toneClass: "nn-progress-fill-semantic-warning" },
] as const;

const WEAK_KEYS = ["weakTag0", "weakTag1", "weakTag2"] as const;
const OPTION_IDS = ["A", "B", "C", "D"] as const;

export function HomePlatformPreviewSection() {
  const { locale, t } = useMarketingI18n();

  /**
   * Safe state init (never undefined)
   */
  const [selectedAnswer, setSelectedAnswer] =
    useState<(typeof OPTION_IDS)[number]>("B");

  /**
   * Memoized options with safe translations
   */
  const options = useMemo(
    () =>
      OPTION_IDS.map((id) => ({
        id,
        text: safeT(
          t,
          `pages.home.platformPreview.option${id}`,
          `Option ${id}`
        ),
      })),
    [t],
  );

  const correctAnswer: (typeof OPTION_IDS)[number] = "B";
  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <section
      id="home-platform-preview"
      className="nn-section-block scroll-mt-20 border-y border-[var(--border-subtle)] bg-[var(--page-bg)]"
      aria-labelledby="home-platform-preview-heading"
      data-testid="section-home-platform-carousel"
    >
      <div className="nn-section-shell">
        {/* HEADER */}
        <FadeUp
          whenInView
          once
          viewMargin="-28px"
          className="mx-auto mb-10 max-w-3xl text-center md:mb-12"
        >
          <p className="nn-marketing-eyebrow font-semibold tracking-wide text-[color-mix(in_srgb,var(--semantic-brand)_82%,var(--theme-heading-text))]">
            {formatTitleCase(
              safeT(
                t,
                "pages.home.platformPreview.eyebrow",
                "Inside the platform"
              ),
              locale
            )}
          </p>

          <h2
            id="home-platform-preview-heading"
            className="nn-marketing-h2 mt-3 text-balance"
          >
            {formatTitleCase(
              safeT(
                t,
                "pages.home.platformPreview.title",
                "How you actually learn"
              ),
              locale
            )}
          </h2>

          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty leading-relaxed text-[var(--theme-muted-text)]">
            {formatSentenceCase(
              safeT(
                t,
                "pages.home.platformPreview.subtitle",
                "Practice questions, detailed rationales, and performance tracking."
              ),
              locale
            )}
          </p>
        </FadeUp>

        {/* MAIN CARD */}
        <FadeUp
          whenInView
          once
          viewMargin="-40px"
          className="mx-auto w-full max-w-5xl"
        >
          <div
            className="rounded-[1.35rem] p-[2px] shadow-[0_32px_80px_-36px_color-mix(in_srgb,var(--palette-heading)_12%,transparent)]"
            style={{
              background:
                "linear-gradient(160deg, color-mix(in srgb, var(--semantic-info) 24%, var(--border-subtle)), color-mix(in srgb, var(--semantic-brand) 20%, var(--border-subtle)))",
            }}
          >
            <div className="grid gap-4 rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 sm:p-5 md:grid-cols-2 md:p-6">

              {/* QUESTION CARD */}
              <article className="nn-card-system nn-card-system-pad">
                <span className="nn-card-system__icon mb-2">
                  <FileText className="nn-icon-md text-[var(--semantic-brand)]" />
                </span>

                <p className="nn-card-system__eyebrow">
                  {formatTitleCase(
                    safeT(t, "pages.home.platformPreview.cardQuestion.eyebrow", "Question"),
                    locale
                  )}
                </p>

                <h3 className="nn-card-system__title">
                  {formatTitleCase(
                    safeT(t, "pages.home.platformPreview.cardQuestion.title", "Practice question"),
                    locale
                  )}
                </h3>

                <p className="nn-card-system__description">
                  {formatSentenceCase(
                    safeT(t, "pages.home.platformPreview.cardQuestion.body", "Answer exam-style questions."),
                    locale
                  )}
                </p>

                <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface)_88%,white)] p-4">
                  <p className="text-sm font-semibold text-[var(--palette-text)]">
                    {formatSentenceCase(
                      safeT(t, "pages.home.platformPreview.cardQuestion.stem", "Sample question"),
                      locale
                    )}
                  </p>

                  <ul className="mt-3 space-y-2">
                    {options.map((option) => {
                      const active = selectedAnswer === option.id;

                      return (
                        <li key={option.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedAnswer(option.id)}
                            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                              active
                                ? "border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--surface))]"
                                : "border-[var(--border-subtle)] hover:border-[var(--semantic-brand)]"
                            }`}
                          >
                            <span className="font-semibold">{option.id}.</span>{" "}
                            {option.text}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>

              {/* RATIONALE CARD */}
              <article className="nn-card-system nn-card-system-pad">
                <span className="nn-card-system__icon mb-2">
                  <CheckCircle2 className="nn-icon-md text-[var(--semantic-success)]" />
                </span>

                <p className="nn-card-system__eyebrow">
                  {formatTitleCase(
                    safeT(t, "pages.home.platformPreview.cardRationale.eyebrow", "Rationale"),
                    locale
                  )}
                </p>

                <h3 className="nn-card-system__title">
                  {formatTitleCase(
                    safeT(t, "pages.home.platformPreview.cardRationale.title", "Explanation"),
                    locale
                  )}
                </h3>

                <p className="nn-card-system__description">
                  {formatSentenceCase(
                    safeT(t, "pages.home.platformPreview.cardRationale.body", "Understand why answers are correct."),
                    locale
                  )}
                </p>

                <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface)_88%,white)] p-4">
                  <p className="text-sm font-semibold">
                    {isCorrect
                      ? formatTitleCase(
                          safeT(t, "pages.home.platformPreview.rationaleCorrect", "Correct"),
                          locale
                        )
                      : formatTitleCase(
                          safeT(t, "pages.home.platformPreview.rationaleWrong", "Incorrect"),
                          locale
                        )}
                  </p>

                  <p className="mt-2 text-sm text-[var(--palette-text-muted)]">
                    {formatSentenceCase(
                      safeT(t, "pages.home.platformPreview.rationaleExplain", "Detailed explanation."),
                      locale
                    )}
                  </p>
                </div>
              </article>

              {/* PERFORMANCE CARD */}
              <article className="nn-card-system nn-card-system-pad md:col-span-2">
                <span className="nn-card-system__icon mb-2">
                  <Activity className="nn-icon-md text-[var(--semantic-info)]" />
                </span>

                <p className="nn-card-system__eyebrow">
                  {formatTitleCase(
                    safeT(t, "pages.home.platformPreview.cardPerformance.eyebrow", "Performance"),
                    locale
                  )}
                </p>

                <h3 className="nn-card-system__title">
                  {formatTitleCase(
                    safeT(t, "pages.home.platformPreview.cardPerformance.title", "Track progress"),
                    locale
                  )}
                </h3>

                <p className="nn-card-system__description">
                  {formatSentenceCase(
                    safeT(t, "pages.home.platformPreview.cardPerformance.body", "See your readiness."),
                    locale
                  )}
                </p>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {/* READINESS */}
                  <div className="rounded-xl border border-[var(--border-subtle)] p-4">
                    <ul className="space-y-3">
                      {READINESS_META.map((band) => (
                        <li key={band.key}>
                          <div className="flex justify-between text-sm">
                            <span>
                              {formatTitleCase(
                                safeT(
                                  t,
                                  `pages.home.platformPreview.${band.key}`,
                                  "Category"
                                ),
                                locale
                              )}
                            </span>
                            <span className="font-semibold">{band.value}%</span>
                          </div>

                          <div className="nn-progress-track-semantic">
                            <span
                              className={`nn-progress-fill ${band.toneClass}`}
                              style={{ width: `${band.value}%` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* WEAK AREAS */}
                  <div className="rounded-xl border border-[var(--border-subtle)] p-4">
                    <div className="flex flex-wrap gap-2">
                      {WEAK_KEYS.map((wk) => (
                        <span
                          key={wk}
                          className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
                        >
                          <Target className="mr-1.5 h-3 w-3" />
                          {formatTitleCase(
                            safeT(
                              t,
                              `pages.home.platformPreview.${wk}`,
                              "Topic"
                            ),
                            locale
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>

            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}