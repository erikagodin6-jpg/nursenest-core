"use client";

/**
 * ClinicalImageBlock — a compact, embeddable clinical image component.
 *
 * Renders a single clinical image in a self-contained block suitable for
 * embedding inside lessons, flashcards, practice test rationales, or CAT panels.
 *
 * Unlike LessonClinicalImageCard (which is tied to the lesson page layout),
 * this block is layout-agnostic and can appear anywhere on any surface.
 *
 * USAGE:
 *   // Basic usage
 *   <ClinicalImageBlock
 *     url="https://cdn.nursenest.io/uploads/images/pulmonary-embolism.webp"
 *     alt="Pulmonary embolism — V/Q mismatch"
 *   />
 *
 *   // With caption
 *   <ClinicalImageBlock
 *     url="..."
 *     alt="..."
 *     caption="Saddle PE — saddle-shaped thrombus at pulmonary artery bifurcation"
 *     label="Clinical illustration"
 *   />
 *
 *   // Compact inline
 *   <ClinicalImageBlock url="..." alt="..." compact />
 *
 * EMBEDDING:
 *   Reusable across: Lessons · Flashcards · Practice Tests · CAT
 */

import { useCallback, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SafeLessonRemoteImage } from "@/components/lessons/safe-lesson-remote-image";
import { hasRenderableLessonImageUrl } from "@/lib/lessons/has-renderable-lesson-image";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ClinicalImageBlockProps = {
  /** Resolved CDN URL for the clinical image. */
  url: string;
  /** Descriptive alt text (never empty). */
  alt: string;
  /** Short eyebrow label shown above the image. Defaults to "Clinical image". */
  label?: string;
  /** Optional caption below the image. */
  caption?: string;
  /**
   * Compact mode — smaller padding, no collapsible header.
   * Best for inline use within flashcard or rationale panels.
   */
  compact?: boolean;
  /** When true, the image starts collapsed (user expands to view). */
  startCollapsed?: boolean;
  /** Max height for the image in non-compact mode. */
  maxHeightPx?: number;
  className?: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function ClinicalImageBlock({
  url,
  alt,
  label = "Clinical image",
  caption,
  compact = false,
  startCollapsed = false,
  maxHeightPx = 440,
  className = "",
}: ClinicalImageBlockProps) {
  const [hidden, setHidden] = useState(false);
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const onHidden = useCallback(() => setHidden(true), []);

  if (!url || !hasRenderableLessonImageUrl(url) || hidden) return null;

  if (compact) {
    return (
      <figure
        className={`nn-clinical-image-block nn-clinical-image-block--compact overflow-hidden rounded-xl ${className}`}
        style={{
          background: "var(--lesson-media-frame)",
          border: "1px solid color-mix(in srgb, var(--lesson-media-border) 55%, transparent)",
        }}
      >
        <SafeLessonRemoteImage
          src={url}
          alt={alt}
          className="block h-auto max-h-48 w-full max-w-full object-contain object-center"
          onHidden={onHidden}
        />
        {caption && (
          <figcaption
            className="px-3 py-2 text-[11px] leading-relaxed"
            style={{ color: "var(--lesson-media-caption-text)" }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure
      aria-label={label}
      className={`nn-clinical-image-block overflow-hidden rounded-2xl ${className}`}
      style={{
        background: "var(--lesson-media-surface)",
        border: "1px solid var(--lesson-media-border)",
      }}
    >
      {/* Collapsible header */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <p
          className="text-[10px] font-bold uppercase leading-none tracking-[0.12em]"
          style={{ color: "var(--lesson-media-label-text)" }}
        >
          {label}
        </p>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[0.65rem] font-semibold transition hover:bg-[color-mix(in_srgb,var(--lesson-media-border)_40%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-brand)]"
          style={{ color: "var(--lesson-media-label-text)" }}
          aria-expanded={!collapsed}
        >
          {collapsed
            ? <><span>Show</span><ChevronDown className="h-3.5 w-3.5" aria-hidden /></>
            : <><span>Hide</span><ChevronUp className="h-3.5 w-3.5" aria-hidden /></>
          }
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 pb-4">
          {/* Image frame */}
          <div
            className="overflow-hidden rounded-xl"
            style={{
              background: "var(--lesson-media-frame)",
              border: "1px solid color-mix(in srgb, var(--lesson-media-border) 55%, transparent)",
            }}
          >
            <SafeLessonRemoteImage
              src={url}
              alt={alt}
              className="block h-auto w-full max-w-full object-contain object-center"
              style={{ maxHeight: `${maxHeightPx}px` }}
              onHidden={onHidden}
            />
          </div>

          {/* Caption */}
          {caption && (
            <figcaption
              className="mt-3 overflow-hidden rounded-xl px-4 py-3 text-[11px] leading-relaxed sm:text-xs"
              style={{
                background: "var(--lesson-media-caption-surface)",
                border: "1px solid var(--lesson-media-border)",
                color: "var(--lesson-media-caption-text)",
              }}
            >
              {caption}
            </figcaption>
          )}
        </div>
      )}
    </figure>
  );
}

