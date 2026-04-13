"use client";

import Link from "next/link";
import { BookOpen, ChevronDown, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  hasStructuredReviewContent,
  partitionRationaleSectionsForReview,
} from "@/lib/learner/rationale-review-structure";
import { QuestionReviewRationaleBlocks } from "@/components/study/question-review-rationale-blocks";
import type { ContentQualityTier } from "@/lib/content-quality/standards";
import type { RationaleReferenceMedia } from "@/lib/content-quality/rationale-media";
import type { NormalizedTeachingPayload, TeachingMediaBundle } from "@/lib/content-quality/teaching-payload";
import { TeachingBreakdown } from "@/components/student/teaching-breakdown";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { RationaleLessonLinkClient } from "@/lib/questions/question-bank-client-types";

function LegacyReferenceFigures({ items }: { items: RationaleReferenceMedia[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-4 space-y-3 border-t border-[var(--semantic-border-soft)] pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
        Reference figures
      </p>
      {items.map((m, i) => (
        <figure key={`${m.url}-${i}`} className="overflow-hidden rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.url}
            alt={m.alt}
            loading="lazy"
            decoding="async"
            className="max-h-[min(60vh,480px)] w-full object-contain"
          />
          {m.caption ? (
            <figcaption className="px-2 py-1.5 text-xs text-[var(--semantic-text-muted)]">{m.caption}</figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

export type RationaleQualityClient = {
  tier: ContentQualityTier;
  wordCount: number;
  showEnrichmentNotice: boolean;
};

type Section = { heading: string; body: string };

const KEY_SECTION_HEADING_RE =
  /^(key\s*takeaway|takeaway|summary|why\s*this|clinical\s*reasoning|priority\s*action)/i;

/** Headings that describe distractors / wrong options (structured rationales). */
const WRONG_SECTION_HEADING_RE =
  /^(why\s*(the\s*)?(other|others|incorrect|wrong)|distractor|wrong\s*options?|eliminate|incorrect\s*options?)/i;

function partitionWrongSections(sections: Section[]): { explanation: Section[]; wrong: Section[] } {
  const explanation: Section[] = [];
  const wrong: Section[] = [];
  for (const s of sections) {
    if (WRONG_SECTION_HEADING_RE.test(s.heading.trim())) wrong.push(s);
    else explanation.push(s);
  }
  return { explanation, wrong };
}

/**
 * Surfaces one highlighted “key takeaway” when structured sections or paragraph breaks imply it.
 */
function extractKeyTakeaway(
  sections: Section[],
  rationale: string | null,
  hasTeaching: boolean,
): {
  key: { heading: string; body: string } | null;
  restSections: Section[];
  rationaleForBody: string | null;
} {
  if (hasTeaching) {
    return {
      key: null,
      restSections: sections.filter((s) => s.body?.trim()),
      rationaleForBody: rationale?.trim() || null,
    };
  }

  const cleaned = sections.filter((s) => s.body?.trim());
  const keyIdx = cleaned.findIndex((s) => KEY_SECTION_HEADING_RE.test(s.heading.trim()));
  if (keyIdx >= 0) {
    const k = cleaned[keyIdx]!;
    return {
      key: { heading: k.heading.trim(), body: k.body.trim() },
      restSections: cleaned.filter((_, i) => i !== keyIdx),
      rationaleForBody: rationale?.trim() || null,
    };
  }

  const ra = rationale?.trim() ?? "";
  if (ra) {
    const parts = ra.split(/\n\n+/);
    if (parts.length >= 2) {
      const first = parts[0]!.trim();
      const rest = parts.slice(1).join("\n\n").trim();
      if (first.length > 0 && first.length <= 420 && rest.length > 0) {
        return {
          key: { heading: "", body: first },
          restSections: cleaned,
          rationaleForBody: rest,
        };
      }
    }
  }

  return { key: null, restSections: cleaned, rationaleForBody: ra || null };
}

function SectionBlocks({ sections }: { sections: Section[] }) {
  return (
    <div className="space-y-4">
      {sections.map((s) => (
        <div key={`${s.heading}-${s.body.slice(0, 24)}`}>
          {s.heading.trim() ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{s.heading}</p>
          ) : null}
          <p
            className={`whitespace-pre-wrap text-[var(--semantic-text-secondary)] leading-relaxed ${s.heading.trim() ? "mt-1.5" : ""}`}
          >
            {s.body}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Quality-aware rationale display for question bank / review surfaces.
 * Uses normalized teaching payload when present; never fabricates clinical facts.
 */
export function PremiumRationalePanel({
  correct,
  rationale,
  rationaleQuality,
  rationaleSections,
  referenceMedia,
  teaching,
  teachingMedia,
  /** Pathway-aware lesson links (from `/api/questions/grade`). */
  rationaleLessonLinks,
  /** `exam`: prominent verdict + collapsible explanation (question bank). */
  variant = "default",
  /** When `variant` is `exam`, start with rationale expanded (e.g. after incorrect). */
  defaultOpenExplanation = false,
  reviewActionStrip,
  recommendationsSlot,
}: {
  correct: boolean;
  rationale: string | null;
  rationaleQuality?: RationaleQualityClient | null;
  rationaleSections?: Section[] | null;
  /** Optional HTTPS figures from `exam_questions.images` — shown only in review / explanation mode. */
  referenceMedia?: RationaleReferenceMedia[] | null;
  teaching?: NormalizedTeachingPayload | null;
  teachingMedia?: TeachingMediaBundle | null;
  rationaleLessonLinks?: RationaleLessonLinkClient[] | null;
  variant?: "default" | "exam";
  defaultOpenExplanation?: boolean;
  /** Bookmark / mistake notebook / notes — rendered after rationale body. */
  reviewActionStrip?: ReactNode;
  /** Drill, flashcards, topic links — after lesson links when present. */
  recommendationsSlot?: ReactNode;
}) {
  const { t } = useMarketingI18n();
  const rawLessonLinks = (rationaleLessonLinks ?? []).filter((l) => l.href?.trim() && l.ctaKey);
  /** Exam UI: show at most two lesson links to avoid crowding the rationale card. */
  const lessonLinks = variant === "exam" ? rawLessonLinks.slice(0, 2) : rawLessonLinks.slice(0, 3);
  const tier = rationaleQuality?.tier;
  const showEnrichment = tier === "thin" || Boolean(rationaleQuality?.showEnrichmentNotice);
  const rawSections = (rationaleSections ?? []).filter((s) => s.body?.trim());
  const missing = tier === "missing" || (!rationale?.trim() && rawSections.length === 0);
  const useTeaching = Boolean(teaching?.sections?.length);

  const structuredBuckets = useMemo(
    () => partitionRationaleSectionsForReview(rationaleSections ?? []),
    [rationaleSections],
  );
  const useStructuredRationale = !useTeaching && hasStructuredReviewContent(structuredBuckets);

  const { key, restSections, rationaleForBody } = useMemo(() => {
    if (useTeaching || useStructuredRationale) {
      return { key: null, restSections: [], rationaleForBody: null };
    }
    return extractKeyTakeaway(rationaleSections ?? [], rationale, false);
  }, [useTeaching, useStructuredRationale, rationaleSections, rationale]);

  const { explanation: explanationSections, wrong: wrongSections } = useMemo(
    () => partitionWrongSections(restSections),
    [restSections],
  );

  const explanationOnlyBody =
    !useTeaching && !missing && rationaleForBody?.trim() && explanationSections.length === 0 ? rationaleForBody : null;

  const showExplanationSegment =
    !useTeaching && !missing && (explanationSections.length > 0 || Boolean(explanationOnlyBody));

  const body = (
    <>
      {showEnrichment ? (
        <p className="mt-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_32%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] px-3 py-2 text-xs text-[var(--semantic-text-primary)]">
          {t("learner.qbank.examUi.enrichmentNotice")}
        </p>
      ) : null}
      {useTeaching && teaching ? (
        <div className="mt-3">
          <TeachingBreakdown
            teaching={teaching}
            teachingMedia={
              teachingMedia ?? {
                referenceMedia: referenceMedia ?? [],
                matchedConceptImage: null,
              }
            }
            variant="plain"
          />
        </div>
      ) : useStructuredRationale ? (
        <div className="mt-3 space-y-1">
          <QuestionReviewRationaleBlocks buckets={structuredBuckets} />
          {!useTeaching && missing ? (
            <p className="mt-2 text-xs italic text-[var(--semantic-text-muted)]">{t("learner.qbank.examUi.noRationale")}</p>
          ) : null}
        </div>
      ) : (
        <>
          {key ? (
            <div className="nn-rationale-key-point mt-3">
              <p className="nn-rationale-key-point__label">
                <Sparkles className="nn-rationale-key-point__icon" aria-hidden />
                <span>{key.heading.trim() ? key.heading : t("learner.qbank.rationale.keyTakeaway")}</span>
              </p>
              <p className="nn-rationale-key-point__body">{key.body}</p>
            </div>
          ) : null}

          {showExplanationSegment ? (
            <div className={`nn-rationale-segment ${key ? "mt-5" : "mt-3"}`}>
              <p className="nn-rationale-segment__title">{t("learner.qbank.rationale.explanationHeading")}</p>
              {explanationSections.length > 0 ? <SectionBlocks sections={explanationSections} /> : null}
              {explanationOnlyBody ? (
                <p
                  className={`whitespace-pre-wrap text-[var(--semantic-text-secondary)] leading-relaxed ${explanationSections.length > 0 ? "mt-4 border-t border-[var(--semantic-border-soft)] pt-4" : ""}`}
                >
                  {explanationOnlyBody}
                </p>
              ) : null}
            </div>
          ) : null}

          {wrongSections.length > 0 ? (
            <div
              className={`nn-rationale-segment nn-rationale-segment--distractors ${showExplanationSegment || key ? "mt-4" : "mt-3"}`}
            >
              <p className="nn-rationale-segment__title">{t("learner.qbank.rationale.wrongOptionsHeading")}</p>
              <div className="space-y-4">
                {wrongSections.map((s) => (
                  <div key={`${s.heading}-${s.body.slice(0, 24)}`}>
                    {wrongSections.length > 1 && s.heading.trim() ? (
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{s.heading}</p>
                    ) : null}
                    <p
                      className={`whitespace-pre-wrap text-[var(--semantic-text-secondary)] leading-relaxed ${wrongSections.length > 1 && s.heading.trim() ? "mt-1.5" : ""}`}
                    >
                      {s.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {!useTeaching && missing && !key ? (
            <p className="mt-2 text-xs italic text-[var(--semantic-text-muted)]">{t("learner.qbank.examUi.noRationale")}</p>
          ) : null}
        </>
      )}
      {reviewActionStrip ? <div className="mt-1">{reviewActionStrip}</div> : null}
      {!useTeaching && referenceMedia && referenceMedia.length > 0 ? (
        <LegacyReferenceFigures items={referenceMedia} />
      ) : null}
      {lessonLinks.length > 0 ? (
        <div className="nn-rationale-lesson-links mt-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] p-4 shadow-sm">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-primary)]">
            <BookOpen className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
            <span>{t("learner.qbank.rationaleLinks.heading")}</span>
          </p>
          <ul className="mt-3 space-y-2">
            {lessonLinks.map((l) => (
              <li key={`${l.href}-${l.slug}`}>
                <Link
                  href={l.href}
                  className="group flex flex-col gap-0.5 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2.5 text-left shadow-sm transition-colors hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] hover:bg-[var(--semantic-panel-muted)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-[13px] font-semibold leading-snug text-[var(--semantic-text-primary)] group-hover:text-[var(--semantic-brand)]">
                    {t(l.ctaKey)}
                  </span>
                  <span className="text-xs text-[var(--semantic-text-muted)] sm:max-w-[55%] sm:text-right">{l.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {recommendationsSlot ? (
        <div className="mt-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_6%,var(--semantic-surface))] p-4 sm:p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            {t("learner.qbank.review.recommendedNext")}
          </p>
          <div className="mt-3">{recommendationsSlot}</div>
        </div>
      ) : null}
    </>
  );

  if (variant === "exam") {
    return (
      <div className="nn-question-rationale-card text-sm">
        <div
          className={`nn-question-rationale-card__verdict sm:px-6 sm:py-5 ${
            correct ? "nn-question-rationale-card__verdict--ok" : "nn-question-rationale-card__verdict--miss"
          }`}
        >
          <p
            className={`text-base font-semibold tracking-tight sm:text-lg ${
              correct ? "text-[var(--role-success-text)]" : "text-[var(--theme-heading-text)]"
            }`}
            role="status"
          >
            {correct ? t("learner.qbank.ui.correct") : t("learner.qbank.ui.incorrect")}
          </p>
          <p
            className={`mt-1.5 text-sm leading-snug ${correct ? "text-[color-mix(in_srgb,var(--role-success-text)_82%,var(--theme-body-text))]" : "text-[var(--theme-muted-text)]"}`}
          >
            {correct ? t("learner.qbank.rationale.verdictCorrectSubtitle") : t("learner.qbank.rationale.verdictIncorrectSubtitle")}
          </p>
        </div>
        <details className="nn-rationale-details group" open={defaultOpenExplanation}>
          <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-[var(--theme-heading-text)] outline-none ring-inset marker:hidden transition-colors hover:bg-[color-mix(in_srgb,var(--theme-primary)_4%,var(--theme-card-bg))] sm:px-6 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                <ChevronDown className="nn-rationale-chevron h-4 w-4 shrink-0 text-[var(--theme-muted-text)]" aria-hidden />
                <span>{t("learner.qbank.examUi.rationaleSummary")}</span>
              </span>
              <span className="shrink-0 text-xs font-normal text-[var(--theme-muted-text)] group-open:hidden">
                {t("learner.qbank.examUi.tapToExpand")}
              </span>
              <span className="hidden shrink-0 text-xs font-normal text-[var(--theme-muted-text)] group-open:inline">
                {t("learner.qbank.examUi.tapToCollapse")}
              </span>
            </span>
          </summary>
          <div className="nn-question-rationale-card__body nn-rationale-prose px-4 py-4 text-[var(--theme-body-text)] sm:px-6 sm:py-5">
            {body}
          </div>
        </details>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm shadow-sm">
      <div
        className={`rounded-lg border px-3 py-2.5 ${
          correct
            ? "border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))]"
            : "border-[color-mix(in_srgb,var(--semantic-warning)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_7%,var(--semantic-surface))]"
        }`}
      >
        <p className={`font-semibold ${correct ? "text-[var(--role-success-text)]" : "text-[var(--semantic-warning-contrast)]"}`}>
          {correct ? t("learner.qbank.ui.correct") : t("learner.qbank.ui.incorrect")}
        </p>
        <p className="mt-1 text-xs leading-snug text-[var(--semantic-text-secondary)]">
          {correct ? t("learner.qbank.rationale.verdictCorrectSubtitle") : t("learner.qbank.rationale.verdictIncorrectSubtitle")}
        </p>
      </div>
      <div className="mt-3 space-y-1">{body}</div>
    </div>
  );
}
