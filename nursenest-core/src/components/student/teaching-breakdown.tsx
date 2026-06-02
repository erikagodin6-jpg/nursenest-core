"use client";

import type { NormalizedTeachingPayload, TeachingMediaBundle } from "@/lib/content-quality/teaching-payload";
import type { RationaleReferenceMedia } from "@/lib/content-quality/rationale-media";

/** Map canonical section ids to semantic color class modifiers. */
function teachingSectionModifier(id: string): string {
  if (id === "why_correct" || id === "correct_answer") return "nn-teaching-section--correct";
  if (id === "distractors") return "nn-teaching-section--distractors";
  if (id === "takeaway") return "nn-teaching-section--takeaway";
  if (id === "exam_strategy") return "nn-teaching-section--tip";
  if (id === "trap") return "nn-teaching-section--trap";
  if (id === "memory_hook" || id === "pearl") return "nn-teaching-section--memory";
  return "";
}

/** Emoji icon per section for quick scanability without relying on color alone. */
function teachingSectionIcon(id: string): string {
  if (id === "why_correct") return "✓";
  if (id === "correct_answer") return "A";
  if (id === "distractors") return "✗";
  if (id === "takeaway") return "★";
  if (id === "exam_strategy") return "◈";
  if (id === "trap") return "⚠";
  if (id === "pearl") return "◆";
  if (id === "memory_hook") return "◉";
  return "·";
}

function MediaStrip({
  referenceMedia,
  matchedConceptImage,
}: {
  referenceMedia: RationaleReferenceMedia[];
  matchedConceptImage: TeachingMediaBundle["matchedConceptImage"];
}) {
  const urls = new Set(referenceMedia.map((m) => m.url));
  const showMatched = matchedConceptImage && !urls.has(matchedConceptImage.url);
  return (
    <div className="mt-4 space-y-3 border-t border-[var(--semantic-border-soft)] pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Figures</p>
      {referenceMedia.map((m, i) => (
        <figure
          key={`ref-${m.url}-${i}`}
          className="overflow-hidden rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.url}
            alt={m.alt}
            loading="lazy"
            decoding="async"
            className="max-h-[min(55vh,420px)] w-full object-contain"
          />
          {m.caption ? (
            <figcaption className="px-2 py-1.5 text-xs text-[var(--semantic-text-muted)]">{m.caption}</figcaption>
          ) : null}
        </figure>
      ))}
      {showMatched ? (
        <figure className="overflow-hidden rounded-lg border border-dashed border-[color-mix(in_srgb,var(--semantic-brand)_32%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={matchedConceptImage!.url}
            alt={matchedConceptImage!.alt}
            loading="lazy"
            decoding="async"
            className="max-h-[min(55vh,420px)] w-full object-contain"
          />
          <figcaption className="px-2 py-1.5 text-xs text-[var(--semantic-text-muted)]">
            Concept illustration
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}

/**
 * Subscriber teaching breakdown: semantic color-coded sections per content type, optional figures.
 * Used after grading and in post-exam review — never during live CAT items.
 *
 * Section color map (from `nn-teaching-section--*` CSS classes):
 *   why_correct / correct_answer → blue/info  (why the answer is right)
 *   distractors                  → amber       (why wrong options are tempting)
 *   takeaway                     → green       (key clinical memory anchor)
 *   exam_strategy                → purple      (test-taking strategy tip)
 *   trap                         → rose        (common pitfall)
 *   memory_hook / pearl          → teal        (recall aid / clinical pearl)
 */
export function TeachingBreakdown({
  teaching,
  teachingMedia,
  variant = "card",
}: {
  teaching: NormalizedTeachingPayload;
  teachingMedia?: TeachingMediaBundle | null;
  variant?: "card" | "plain";
}) {
  const wrap = variant === "card" ? "rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-sm" : "";

  const hasMedia =
    (teachingMedia?.referenceMedia?.length ?? 0) > 0 || Boolean(teachingMedia?.matchedConceptImage);

  return (
    <div className={`text-sm ${wrap}`}>
      <div className="space-y-3">
        {teaching.sections.map((s) => {
          const modifier = teachingSectionModifier(s.id);
          const icon = teachingSectionIcon(s.id);
          return (
            <section
              key={s.id}
              aria-labelledby={`teach-${s.id}`}
              className={`nn-teaching-section ${modifier}`}
            >
              <p id={`teach-${s.id}`} className="nn-teaching-section__label">
                <span aria-hidden className="tabular-nums">{icon}</span>
                <span>{s.heading}</span>
              </p>
              <p className="nn-teaching-section__body">{s.body}</p>
            </section>
          );
        })}
      </div>
      {hasMedia && teachingMedia ? (
        <MediaStrip referenceMedia={teachingMedia.referenceMedia} matchedConceptImage={teachingMedia.matchedConceptImage} />
      ) : null}
    </div>
  );
}
