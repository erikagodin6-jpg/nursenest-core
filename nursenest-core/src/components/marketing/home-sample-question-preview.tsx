"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { MARKETING_TERTIARY_LINK_CLASS } from "@/lib/theme/marketing-hero-pattern";
import { MarketingEditableI18nText } from "@/components/marketing/marketing-editable-i18n-text";

const CHOICE_KEYS = [
  "pages.home.sampleQuestion.choiceA",
  "pages.home.sampleQuestion.choiceB",
  "pages.home.sampleQuestion.choiceC",
  "pages.home.sampleQuestion.choiceD",
] as const;

/**
 * Public sample item + teaching rationale (no auth) — demonstrates real bank flow above the fold.
 */
export function HomeSampleQuestionPreview() {
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);
  const choices = CHOICE_KEYS.map((k) => t(k));

  return (
    <section
      className="nn-section-block border-b border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_06%,var(--page-bg))]"
      aria-labelledby="home-sample-question-heading"
      data-testid="section-home-sample-question"
    >
      <div className="nn-section-shell">
        <div className="mx-auto max-w-3xl">
          <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--semantic-info)]">
            {formatTitleCase(t("pages.home.sampleQuestion.sectionKicker"), locale)}
          </p>
          <h2 className="nn-marketing-h2 mt-2 max-w-2xl text-balance text-[var(--palette-heading)]">
            <MarketingEditableI18nText
              messageKey="pages.home.sampleQuestion.sectionTitle"
              initialDraft={formatTitleCase(t("pages.home.sampleQuestion.sectionTitle"), locale)}
            >
              {formatTitleCase(t("pages.home.sampleQuestion.sectionTitle"), locale)}
            </MarketingEditableI18nText>
          </h2>
          <div
            className="mt-4 grid max-w-3xl gap-2.5 sm:grid-cols-2 sm:gap-3"
            data-testid="section-home-sample-prep-contrast"
          >
            <div
              className="rounded-lg border px-3 py-3 text-left sm:px-4 sm:py-3.5"
              style={{
                borderColor: "color-mix(in srgb, var(--semantic-border-soft) 1, var(--border-subtle))",
                background: "color-mix(in srgb, var(--semantic-panel-cool) 10%, var(--bg-card))",
              }}
            >
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--palette-text-muted)]">
                {formatTitleCase(t("pages.home.differentiation.contrastGenericLabel"), locale)}
              </p>
              <p className="nn-marketing-body-sm mt-1.5 leading-snug text-[var(--palette-text)]">
                {formatSentenceCase(t("pages.home.differentiation.contrastGenericLine"), locale)}
              </p>
            </div>
            <div
              className="rounded-lg border px-3 py-3 text-left sm:px-4 sm:py-3.5"
              style={{
                borderColor: "color-mix(in srgb, var(--semantic-success) 24%, var(--semantic-border-soft))",
                background: "color-mix(in srgb, var(--semantic-panel-positive) 08%, var(--bg-card))",
              }}
            >
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-success)]">
                {formatTitleCase(t("pages.home.differentiation.contrastNnLabel"), locale)}
              </p>
              <p className="nn-marketing-body-sm mt-1.5 leading-snug text-[var(--palette-text)]">
                {formatSentenceCase(t("pages.home.differentiation.contrastNnLine"), locale)}
              </p>
            </div>
          </div>
          <p className="nn-marketing-body mt-4 max-w-2xl text-pretty leading-relaxed text-[var(--palette-text-muted)]">
            {formatSentenceCase(t("pages.home.sampleQuestion.sectionLead"), locale)}
          </p>
          <p
            className="nn-marketing-body-sm mt-3 max-w-2xl text-pretty leading-relaxed text-[var(--semantic-success)]"
            data-testid="text-sample-safe-to-try"
          >
            {formatSentenceCase(t("pages.home.sampleQuestion.safeToTryLine"), locale)}
          </p>
          <h3
            id="home-sample-question-heading"
            className="nn-marketing-body mt-6 text-pretty text-lg font-semibold leading-snug text-[var(--palette-heading)] sm:text-xl"
          >
            {formatSentenceCase(t("pages.home.sampleQuestion.stem"), locale)}
          </h3>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--palette-text-muted)]">
            {formatTitleCase(t("pages.home.sampleQuestion.choicesHeading"), locale)}
          </p>
          <ul className="mt-3 space-y-3" role="list">
            {choices.map((text, i) => (
              <li
                key={CHOICE_KEYS[i]}
                className={
                  i === 0
                    ? "rounded-xl border-2 border-[color-mix(in_srgb,var(--semantic-success)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_08%,var(--bg-card))] px-4 py-3"
                    : "rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] px-4 py-3"
                }
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold text-[var(--semantic-text-secondary)]"
                    style={{
                      borderColor:
                        i === 0
                          ? "color-mix(in srgb, var(--semantic-success) 50%, var(--semantic-border-soft))"
                          : "var(--semantic-border-soft)",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm leading-relaxed text-[var(--palette-text)]">
                    {formatSentenceCase(text, locale)}
                  </span>
                  {i === 0 ? (
                    <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          <div
            className="mt-8 rounded-xl border bg-[var(--bg-card)] p-5"
            style={{ borderColor: "color-mix(in srgb, var(--semantic-info) 22%, var(--semantic-border-soft))" }}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-info)_85%,var(--semantic-text-primary))]">
              {formatTitleCase(t("pages.home.sampleQuestion.rationaleLabel"), locale)}
            </p>
            <p className="nn-marketing-body mt-2 text-pretty leading-relaxed text-[var(--palette-text-muted)]">
              {formatSentenceCase(t("pages.home.sampleQuestion.rationaleBody"), locale)}
            </p>
            <p className="nn-marketing-caption mt-4 border-t border-[var(--semantic-border-soft)] pt-4 text-pretty text-[var(--palette-text-muted)]">
              {formatSentenceCase(t("pages.home.sampleQuestion.examTip"), locale)}
            </p>
          </div>
          <div className="mt-8 flex justify-center sm:justify-start">
            <MarketingTrackedLink
              href={loc(HUB.questionBank)}
              event={PH.marketingHomeSampleContentClick}
              eventProps={{
                region,
                marketing_region: region,
                marketing_locale: locale,
                surface: "home_sample_question_preview",
              }}
              className={`${MARKETING_TERTIARY_LINK_CLASS} nn-motion-standard inline-flex items-center gap-1.5 font-semibold text-[var(--semantic-brand)]`}
              data-testid="button-home-sample-question-cta"
            >
              {formatTitleCase(t("pages.home.sampleQuestion.continueCta"), locale)}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </MarketingTrackedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
