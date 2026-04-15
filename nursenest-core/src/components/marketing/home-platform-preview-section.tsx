"use client";

import { useMemo, useState } from "react";
import { Activity, CheckCircle2, FileText, Target } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { FadeUp } from "@/lib/motion";

const READINESS_META = [
  { key: "readinessBand0", value: 72, toneClass: "nn-progress-fill-semantic-readiness" },
  { key: "readinessBand1", value: 79, toneClass: "nn-progress-fill-semantic-success" },
  { key: "readinessBand2", value: 66, toneClass: "nn-progress-fill-semantic-info" },
  { key: "readinessBand3", value: 58, toneClass: "nn-progress-fill-semantic-warning" },
] as const;

const WEAK_KEYS = ["weakTag0", "weakTag1", "weakTag2"] as const;

const OPTION_IDS = ["A", "B", "C", "D"] as const;

/**
 * In-product proof block showing the real interaction model:
 * question -> answer selection -> rationale -> readiness feedback.
 */
export function HomePlatformPreviewSection() {
  const { locale, t } = useMarketingI18n();
  const [selectedAnswer, setSelectedAnswer] = useState<(typeof OPTION_IDS)[number] | null>("B");

  const options = useMemo(
    () =>
      OPTION_IDS.map((id) => ({
        id,
        text: t(`pages.home.platformPreview.option${id}`),
      })),
    [t],
  );

  const correctAnswer = "B";
  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <section
      id="home-platform-preview"
      className="nn-section-block scroll-mt-20 border-y border-[var(--border-subtle)] bg-[var(--page-bg)]"
      aria-labelledby="home-platform-preview-heading"
      data-testid="section-home-platform-carousel"
    >
      <div className="nn-section-shell">
        <FadeUp whenInView once viewMargin="-28px" className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <p className="nn-marketing-eyebrow font-semibold tracking-wide text-[color-mix(in_srgb,var(--semantic-brand)_82%,var(--theme-heading-text))]">
            {formatTitleCase(t("pages.home.platformPreview.eyebrow"), locale)}
          </p>
          <h2 id="home-platform-preview-heading" className="nn-marketing-h2 mt-3 text-balance">
            {formatTitleCase(t("pages.home.platformPreview.title"), locale)}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-2xl text-pretty leading-relaxed text-[var(--theme-muted-text)]">
            {formatSentenceCase(t("pages.home.platformPreview.subtitle"), locale)}
          </p>
        </FadeUp>
        <FadeUp whenInView once viewMargin="-40px" className="mx-auto w-full max-w-5xl">
          <div
            className="rounded-[1.35rem] p-[2px] shadow-[0_32px_80px_-36px_color-mix(in_srgb,var(--palette-heading)_12%,transparent)]"
            style={{
              background:
                "linear-gradient(160deg, color-mix(in srgb, var(--semantic-info) 24%, var(--border-subtle)), color-mix(in srgb, var(--semantic-brand) 20%, var(--border-subtle)))",
            }}
          >
            <div className="grid gap-4 rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 sm:p-5 md:grid-cols-2 md:p-6">
              <article className="nn-card-system nn-card-system-pad">
                <span className="nn-card-system__icon mb-2">
                  <FileText className="nn-icon-md text-[var(--semantic-brand)]" aria-hidden />
                </span>
                <p className="nn-card-system__eyebrow">
                  {formatTitleCase(t("pages.home.platformPreview.cardQuestion.eyebrow"), locale)}
                </p>
                <h3 className="nn-card-system__title">
                  {formatTitleCase(t("pages.home.platformPreview.cardQuestion.title"), locale)}
                </h3>
                <p className="nn-card-system__description">
                  {formatSentenceCase(t("pages.home.platformPreview.cardQuestion.body"), locale)}
                </p>
                <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface)_88%,white)] p-4">
                  <p className="text-sm font-semibold text-[var(--palette-text)]">
                    {formatSentenceCase(t("pages.home.platformPreview.cardQuestion.stem"), locale)}
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
                                ? "border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--surface))] text-[var(--palette-text)]"
                                : "border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--palette-text-muted)] hover:border-[var(--semantic-brand)] hover:text-[var(--palette-text)]"
                            }`}
                          >
                            <span className="font-semibold">{option.id}.</span> {option.text}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>

              <article className="nn-card-system nn-card-system-pad">
                <span className="nn-card-system__icon mb-2">
                  <CheckCircle2 className="nn-icon-md text-[var(--semantic-success)]" aria-hidden />
                </span>
                <p className="nn-card-system__eyebrow">
                  {formatTitleCase(t("pages.home.platformPreview.cardRationale.eyebrow"), locale)}
                </p>
                <h3 className="nn-card-system__title">
                  {formatTitleCase(t("pages.home.platformPreview.cardRationale.title"), locale)}
                </h3>
                <p className="nn-card-system__description">
                  {formatSentenceCase(t("pages.home.platformPreview.cardRationale.body"), locale)}
                </p>
                <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface)_88%,white)] p-4">
                  <p
                    className={`text-sm font-semibold ${isCorrect ? "text-[var(--semantic-success)]" : "text-[var(--semantic-warning)]"}`}
                  >
                    {isCorrect
                      ? formatTitleCase(t("pages.home.platformPreview.rationaleCorrect"), locale)
                      : formatTitleCase(t("pages.home.platformPreview.rationaleWrong"), locale)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--palette-text-muted)]">
                    {formatSentenceCase(t("pages.home.platformPreview.rationaleExplain"), locale)}
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--palette-text-muted)]">
                    <li>{formatSentenceCase(t("pages.home.platformPreview.rationaleBulletA"), locale)}</li>
                    <li>{formatSentenceCase(t("pages.home.platformPreview.rationaleBulletC"), locale)}</li>
                    <li>{formatSentenceCase(t("pages.home.platformPreview.rationaleBulletD"), locale)}</li>
                  </ul>
                </div>
              </article>

              <article className="nn-card-system nn-card-system-pad md:col-span-2">
                <span className="nn-card-system__icon mb-2">
                  <Activity className="nn-icon-md text-[var(--semantic-info)]" aria-hidden />
                </span>
                <p className="nn-card-system__eyebrow">
                  {formatTitleCase(t("pages.home.platformPreview.cardPerformance.eyebrow"), locale)}
                </p>
                <h3 className="nn-card-system__title">
                  {formatTitleCase(t("pages.home.platformPreview.cardPerformance.title"), locale)}
                </h3>
                <p className="nn-card-system__description">
                  {formatSentenceCase(t("pages.home.platformPreview.cardPerformance.body"), locale)}
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface)_88%,white)] p-4">
                    <p className="text-sm font-semibold text-[var(--palette-text)]">
                      {formatTitleCase(t("pages.home.platformPreview.readinessSnapshot"), locale)}
                    </p>
                    <ul className="mt-3 space-y-3">
                      {READINESS_META.map((band) => (
                        <li key={band.key}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="text-[var(--palette-text-muted)]">
                              {formatTitleCase(t(`pages.home.platformPreview.${band.key}`), locale)}
                            </span>
                            <span className="font-semibold text-[var(--palette-text)]">{band.value}%</span>
                          </div>
                          <div className="nn-progress-track-semantic">
                            <span
                              className={`nn-progress-fill ${band.toneClass}`}
                              style={{ width: `${band.value}%` }}
                              aria-hidden
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--surface)_88%,white)] p-4">
                    <p className="text-sm font-semibold text-[var(--palette-text)]">
                      {formatTitleCase(t("pages.home.platformPreview.weakHeading"), locale)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {WEAK_KEYS.map((wk) => (
                        <span
                          key={wk}
                          className="inline-flex items-center rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-3 py-1 text-xs font-semibold text-[var(--pill-fg)]"
                        >
                          <Target className="mr-1.5 h-3 w-3" aria-hidden />
                          {formatTitleCase(t(`pages.home.platformPreview.${wk}`), locale)}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-card)_88%,white)] px-3 py-3 text-sm text-[var(--palette-text-muted)]">
                      {formatSentenceCase(t("pages.home.platformPreview.adaptiveHint"), locale)}
                    </p>
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
