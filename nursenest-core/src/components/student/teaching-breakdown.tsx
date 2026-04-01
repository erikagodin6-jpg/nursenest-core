"use client";

import type { NormalizedTeachingPayload, TeachingMediaBundle } from "@/lib/content-quality/teaching-payload";
import type { RationaleReferenceMedia } from "@/lib/content-quality/rationale-media";

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
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Figures</p>
      {referenceMedia.map((m, i) => (
        <figure key={`ref-${m.url}-${i}`} className="overflow-hidden rounded-lg border border-border bg-background/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.url}
            alt={m.alt}
            loading="lazy"
            decoding="async"
            className="max-h-[min(55vh,420px)] w-full object-contain"
          />
          {m.caption ? <figcaption className="px-2 py-1.5 text-xs text-muted-foreground">{m.caption}</figcaption> : null}
        </figure>
      ))}
      {showMatched ? (
        <figure className="overflow-hidden rounded-lg border border-dashed border-primary/35 bg-muted/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={matchedConceptImage!.url}
            alt={matchedConceptImage!.alt}
            loading="lazy"
            decoding="async"
            className="max-h-[min(55vh,420px)] w-full object-contain"
          />
          <figcaption className="px-2 py-1.5 text-xs text-muted-foreground">
            Concept illustration (matched from NurseNest media library)
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}

/**
 * Subscriber teaching breakdown: semantic sections, optional figures.
 * Used after grading and in post-exam review — never during live CAT items.
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
  const wrap = variant === "card" ? "rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4" : "space-y-4";

  const hasMedia =
    (teachingMedia?.referenceMedia?.length ?? 0) > 0 || Boolean(teachingMedia?.matchedConceptImage);

  return (
    <div className={`text-sm ${wrap}`}>
      <div className="space-y-4">
        {teaching.sections.map((s) => (
          <section key={s.id} aria-labelledby={`teach-${s.id}`} className="rounded-lg border border-border/60 bg-card/50 px-3 py-2.5">
            <h3 id={`teach-${s.id}`} className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              {s.heading}
            </h3>
            <p className="mt-1.5 whitespace-pre-wrap leading-relaxed text-foreground/90">{s.body}</p>
          </section>
        ))}
      </div>
      {teaching.keyTakeawayDerived ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Takeaway auto-generated from rationale content; editorial review recommended for this item.
        </p>
      ) : null}
      {hasMedia && teachingMedia ? (
        <MediaStrip referenceMedia={teachingMedia.referenceMedia} matchedConceptImage={teachingMedia.matchedConceptImage} />
      ) : null}
    </div>
  );
}
