"use client";

import type { ContentQualityTier } from "@/lib/content-quality/standards";
import type { RationaleReferenceMedia } from "@/lib/content-quality/rationale-media";
import type { NormalizedTeachingPayload, TeachingMediaBundle } from "@/lib/content-quality/teaching-payload";
import { TeachingBreakdown } from "@/components/student/teaching-breakdown";
import { useMarketingI18n } from "@/lib/marketing-i18n";

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
  variant?: "default" | "exam";
  defaultOpenExplanation?: boolean;
}) {
  const { t } = useMarketingI18n();
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
    </>
  );

  if (variant === "exam") {
    return (
      <div className="overflow-hidden rounded-xl border-2 border-border bg-card text-sm shadow-sm">
        <div
          className={`border-b border-border px-4 py-4 sm:px-5 ${
            correct ? "bg-role-success-soft" : "bg-destructive/10 dark:bg-destructive/15"
          }`}
        >
          <p
            className={`text-lg font-bold tracking-tight sm:text-xl ${
              correct ? "text-role-success" : "text-destructive"
            }`}
            role="status"
          >
            {correct ? t("learner.qbank.ui.correct") : t("learner.qbank.ui.incorrect")}
          </p>
        </div>
        <details className="group" open={defaultOpenExplanation}>
          <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-foreground outline-none ring-inset marker:hidden hover:bg-muted/40 sm:px-5 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-2">
              {t("learner.qbank.examUi.rationaleSummary")}
              <span className="text-xs font-normal text-muted-foreground group-open:hidden">{t("learner.qbank.examUi.tapToExpand")}</span>
              <span className="hidden text-xs font-normal text-muted-foreground group-open:inline">{t("learner.qbank.examUi.tapToCollapse")}</span>
            </span>
          </summary>
          <div className="border-t border-border bg-[var(--theme-muted-surface)]/50 px-4 py-4 sm:px-5">{body}</div>
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
