"use client";

import type { ReactNode } from "react";
import { Bookmark, CheckCircle2, ClipboardList, Lightbulb, ListX, Sparkles, Target } from "lucide-react";
import type { RationaleReviewBuckets } from "@/lib/learner/rationale-review-structure";

type SectionTone = "success" | "info" | "warning" | "brand" | "muted";

function ReviewSectionCard({
  tone,
  icon,
  title,
  children,
  id,
}: {
  tone: SectionTone;
  icon: ReactNode;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  const surface: Record<SectionTone, string> = {
    success:
      "border-[color-mix(in_srgb,var(--semantic-success)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_6%,var(--semantic-surface))]",
    info: "border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--semantic-surface))]",
    warning:
      "border-[color-mix(in_srgb,var(--semantic-warning)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_6%,var(--semantic-surface))]",
    brand:
      "border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]",
    muted: "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]",
  };

  const titleColor: Record<SectionTone, string> = {
    success: "text-[var(--role-success-text)]",
    info: "text-[var(--semantic-info)]",
    warning: "text-[var(--semantic-warning-contrast)]",
    brand: "text-[var(--semantic-brand)]",
    muted: "text-[var(--semantic-text-primary)]",
  };

  return (
    <section
      id={id}
      className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${surface[tone]}`}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 opacity-90" aria-hidden>
          {icon}
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <h3
            id={id ? `${id}-title` : undefined}
            className={`text-[11px] font-bold uppercase tracking-[0.14em] ${titleColor[tone]}`}
          >
            {title}
          </h3>
          <div className="text-[14px] leading-relaxed text-[var(--semantic-text-secondary)]">{children}</div>
        </div>
      </div>
    </section>
  );
}

function ProseBody({ text }: { text: string }) {
  return <p className="whitespace-pre-wrap">{text}</p>;
}

/**
 * Premium, scan-friendly rationale layout for post-answer review.
 * Theme tokens only — pairs with {@link partitionRationaleSectionsForReview}.
 */
export function QuestionReviewRationaleBlocks({
  buckets,
  remainderSections,
}: {
  buckets: RationaleReviewBuckets;
  remainderSections?: Array<{ heading: string; body: string }>;
}) {
  const extras: Array<{ title: string; body: string; tone: SectionTone }> = [];
  if (buckets.clinicalPearl?.trim()) extras.push({ title: "Clinical pearl", body: buckets.clinicalPearl, tone: "brand" });
  if (buckets.memoryHook?.trim()) extras.push({ title: "Memory hook", body: buckets.memoryHook, tone: "muted" });
  if (buckets.clinicalTrap?.trim()) extras.push({ title: "Common trap", body: buckets.clinicalTrap, tone: "warning" });

  const rest = remainderSections ?? buckets.remainder;

  return (
    <div className="space-y-4">
      {buckets.correctAnswerSummary?.trim() ? (
        <div
          className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 sm:px-5"
          role="note"
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">Correct answer</p>
          <p className="mt-1 text-[15px] font-semibold leading-snug text-[var(--semantic-text-primary)]">
            {buckets.correctAnswerSummary}
          </p>
        </div>
      ) : null}

      {buckets.whyCorrect?.trim() ? (
        <ReviewSectionCard
          id="review-why-correct"
          tone="success"
          title="Why this is correct"
          icon={<CheckCircle2 className="h-5 w-5 text-[var(--semantic-success)]" aria-hidden />}
        >
          <ProseBody text={buckets.whyCorrect} />
        </ReviewSectionCard>
      ) : null}

      {buckets.whyWrong?.trim() ? (
        <ReviewSectionCard
          id="review-why-wrong"
          tone="info"
          title="Why the other options are wrong"
          icon={<ListX className="h-5 w-5 text-[var(--semantic-info)]" aria-hidden />}
        >
          <ProseBody text={buckets.whyWrong} />
        </ReviewSectionCard>
      ) : null}

      {buckets.clinicalTakeaway?.trim() ? (
        <ReviewSectionCard
          id="review-takeaway"
          tone="warning"
          title="Clinical takeaway"
          icon={<Sparkles className="h-5 w-5 text-[var(--semantic-warning-contrast)]" aria-hidden />}
        >
          <ProseBody text={buckets.clinicalTakeaway} />
        </ReviewSectionCard>
      ) : null}

      {buckets.nclexStrategy?.trim() ? (
        <ReviewSectionCard
          id="review-strategy"
          tone="brand"
          title="NCLEX strategy"
          icon={<Target className="h-5 w-5 text-[var(--semantic-brand)]" aria-hidden />}
        >
          <ProseBody text={buckets.nclexStrategy} />
        </ReviewSectionCard>
      ) : null}

      {extras.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-1">
          {extras.map((x) => (
            <ReviewSectionCard
              key={x.title}
              tone={x.tone}
              title={x.title}
              icon={<Lightbulb className="h-5 w-5 text-[var(--semantic-text-muted)]" aria-hidden />}
            >
              <ProseBody text={x.body} />
            </ReviewSectionCard>
          ))}
        </div>
      ) : null}

      {rest.length > 0 ? (
        <div className="space-y-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4 sm:p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">More detail</p>
          <div className="space-y-4">
            {rest.map((s) => (
              <div key={`${s.heading}-${s.body.slice(0, 20)}`}>
                {s.heading ? (
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{s.heading}</p>
                ) : null}
                <p className={`whitespace-pre-wrap text-[14px] leading-relaxed text-[var(--semantic-text-secondary)] ${s.heading ? "mt-1.5" : ""}`}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export type QuestionReviewActionStripProps = {
  bookmarked: boolean;
  onToggleBookmark: () => void;
  /** When false, mistake CTA is hidden (e.g. after a correct answer). */
  showMistakeCta: boolean;
  onAddToMistakeNotebook?: () => void | Promise<void>;
  mistakeAdded?: boolean;
  mistakeBusy?: boolean;
  onJumpToNotes?: () => void;
};

/**
 * Compact actions: bookmark, mistake notebook, jump to notes — sits below rationale body.
 */
export function QuestionReviewActionStrip({
  bookmarked,
  onToggleBookmark,
  showMistakeCta,
  onAddToMistakeNotebook,
  mistakeAdded,
  mistakeBusy,
  onJumpToNotes,
}: QuestionReviewActionStripProps) {
  return (
    <div
      className="mt-5 flex flex-col gap-2 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--semantic-surface))] p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:p-4"
      role="toolbar"
      aria-label="Question review actions"
    >
      <button
        type="button"
        aria-pressed={bookmarked}
        onClick={onToggleBookmark}
        className={`inline-flex min-h-[2.75rem] flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[13px] font-semibold transition-colors sm:flex-none sm:px-4 ${
          bookmarked
            ? "border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
            : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
        }`}
      >
        <Bookmark className={`h-4 w-4 shrink-0 ${bookmarked ? "fill-current" : ""}`} aria-hidden />
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </button>

      {showMistakeCta && onAddToMistakeNotebook ? (
        <button
          type="button"
          disabled={Boolean(mistakeAdded) || mistakeBusy}
          onClick={() => void onAddToMistakeNotebook()}
          className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_6%,var(--semantic-surface))] px-3 py-2 text-[13px] font-semibold text-[var(--semantic-danger)] transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-4"
        >
          <ClipboardList className="h-4 w-4 shrink-0" aria-hidden />
          {mistakeAdded ? "In mistake notebook" : mistakeBusy ? "Saving…" : "Add to mistake notebook"}
        </button>
      ) : null}

      {onJumpToNotes ? (
        <button
          type="button"
          onClick={onJumpToNotes}
          className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-[13px] font-semibold text-[var(--semantic-text-secondary)] transition-colors hover:bg-[var(--semantic-panel-muted)] sm:flex-none sm:px-4"
        >
          My notes
        </button>
      ) : null}
    </div>
  );
}
