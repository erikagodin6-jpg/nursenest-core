"use client";

import Link from "next/link";
import { BookOpen, ChevronDown } from "lucide-react";
import type { ContentQualityTier } from "@/lib/content-quality/standards";
import type { RationaleReferenceMedia } from "@/lib/content-quality/rationale-media";
import type { NormalizedTeachingPayload, TeachingMediaBundle } from "@/lib/content-quality/teaching-payload";
import { TeachingBreakdown } from "@/components/student/teaching-breakdown";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { RationaleLessonLinkClient } from "@/lib/questions/question-bank-client-types";

function LegacyReferenceFigures({ items }: { items: RationaleReferenceMedia[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Reference figures</p>
      {items.map((m, i) => (
        <figure key={`${m.url}-${i}`} className="overflow-hidden rounded-lg border border-border bg-background/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.url}
            alt={m.alt}
            loading="lazy"
            decoding="async"
            className="max-h-[min(60vh,480px)] w-full object-contain"
          />
          {m.caption ? (
            <figcaption className="px-2 py-1.5 text-xs text-muted-foreground">{m.caption}</figcaption>
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
}) {
  const { t } = useMarketingI18n();
  const rawLessonLinks = (rationaleLessonLinks ?? []).filter((l) => l.href?.trim() && l.ctaKey);
  /** Exam UI: show at most two lesson links to avoid crowding the rationale card. */
  const lessonLinks = variant === "exam" ? rawLessonLinks.slice(0, 2) : rawLessonLinks.slice(0, 3);
  const sections = (rationaleSections ?? []).filter((s) => s.body?.trim());
  const tier = rationaleQuality?.tier;
  const showEnrichment =
    tier === "thin" || Boolean(rationaleQuality?.showEnrichmentNotice);
  const missing = tier === "missing" || (!rationale?.trim() && sections.length === 0);
  const useTeaching = Boolean(teaching?.sections?.length);

  const body = (
    <>
      {showEnrichment ? (
        <p className="mt-2 rounded-lg border border-amber-200/60 bg-amber-50/50 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20">
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
      ) : sections.length > 0 ? (
        <div className="mt-3 space-y-4">
          {sections.map((s) => (
            <div key={`${s.heading}-${s.body.slice(0, 24)}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{s.heading}</p>
              <p className="mt-1.5 whitespace-pre-wrap text-muted leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      ) : !missing && rationale ? (
        <p className="mt-2 whitespace-pre-wrap text-muted leading-relaxed">{rationale}</p>
      ) : missing ? (
        <p className="mt-2 text-xs italic text-muted-foreground">{t("learner.qbank.examUi.noRationale")}</p>
      ) : null}
      {!useTeaching && referenceMedia && referenceMedia.length > 0 ? (
        <LegacyReferenceFigures items={referenceMedia} />
      ) : null}
      {lessonLinks.length > 0 ? (
        <div className="nn-rationale-lesson-links mt-4 rounded-xl border border-primary/15 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--theme-primary)_8%,transparent),transparent)] p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <BookOpen className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
            <span>{t("learner.qbank.rationaleLinks.heading")}</span>
          </p>
          <ul className="mt-3 space-y-2">
            {lessonLinks.map((l) => (
              <li key={`${l.href}-${l.slug}`}>
                <Link
                  href={l.href}
                  className="group flex flex-col gap-0.5 rounded-lg border border-border/70 bg-background/70 px-3 py-2.5 text-left shadow-sm transition-colors hover:border-primary/45 hover:bg-background sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-[13px] font-semibold leading-snug text-foreground group-hover:text-primary">
                    {t(l.ctaKey)}
                  </span>
                  <span className="text-xs text-muted-foreground sm:max-w-[55%] sm:text-right">{l.title}</span>
                </Link>
              </li>
            ))}
          </ul>
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
    <div className="rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4 text-sm">
      <p className={`font-semibold ${correct ? "text-emerald-700 dark:text-emerald-400" : "text-amber-800 dark:text-amber-300"}`}>
        {correct ? t("learner.qbank.ui.correct") : t("learner.qbank.ui.incorrect")}
      </p>
      {body}
    </div>
  );
}
