"use client";

import { useCallback, useState } from "react";

/**
 * LessonClinicalImageCard — dedicated presentation component for matched lesson images.
 *
 * Placement: below the lesson hero/metadata, above the first lesson section card.
 * Source: resolved image URL from `resolveLessonImage()` in the content layer.
 *
 * Visual design principles:
 *   - Three layered surfaces (outer card → inner frame → caption) for visual depth
 *   - All colors via CSS custom properties (--lesson-media-*) — theme-aware
 *   - Generous padding and breathing space to reduce eye fatigue
 *   - Contains aspect-ratio stability to prevent layout shift
 *   - No decorative chrome, no harsh borders, no dark wells
 *
 * Accessibility:
 *   - <aside> with aria-label for landmark navigation
 *   - Meaningful alt text derived from the resolver (never empty)
 *   - No text is embedded into the image itself
 *
 * This component owns presentation only.
 * Image matching/resolution stays in `src/lib/content/resolve-lesson-image.ts`.
 * Do NOT import or call `resolveLessonImage` from here.
 */

import type { LessonImageSource } from "@/lib/content/resolve-lesson-image";
import { hasRenderableLessonImageUrl } from "@/lib/lessons/has-renderable-lesson-image";
import { SafeLessonRemoteImage } from "@/components/lessons/safe-lesson-remote-image";

// ── Types ─────────────────────────────────────────────────────────────────────

export type LessonClinicalImageCardProps = {
  /** Resolved CDN URL from `resolveLessonImage`. Must be non-empty — caller guards on null. */
  url: string;
  /** Alt text derived by the resolver from the lesson title/slug. */
  alt: string;
  /** How the image was matched. Drives the default label. */
  source?: LessonImageSource;
  /**
   * The lesson title — used to derive the caption.
   * No caption is shown when this is absent.
   */
  lessonTitle?: string | null;
  /**
   * Override the eyebrow label above the image.
   * Pass null explicitly to suppress the label entirely.
   */
  label?: string | null;
  /**
   * Override the caption below the image.
   * Pass null explicitly to suppress the caption entirely.
   * When omitted, caption is derived from `lessonTitle` (for exact/override matches only).
   */
  caption?: string | null;
  /** Extra className on the outer card element. */
  className?: string;
};

// ── Label derivation ──────────────────────────────────────────────────────────

const SOURCE_DEFAULT_LABEL: Partial<Record<LessonImageSource, string>> = {
  exact_slug:       "Clinical image",
  override:         "Clinical image",
  clinical_illustration: "Clinical illustration",
  map_slug:         "Clinical image",
  map_keyword:      "Topic illustration",
  map_body_system:  "Topic illustration",
  topic_slug:       "Topic illustration",
};

function resolveLabel(
  labelProp: string | null | undefined,
  source: LessonImageSource,
): string | null {
  // Explicit override (including explicit null to suppress)
  if (labelProp !== undefined) return labelProp;
  return SOURCE_DEFAULT_LABEL[source] ?? "Clinical image";
}

// ── Caption derivation ────────────────────────────────────────────────────────

/**
 * Derives a safe, short caption from the lesson title.
 * Only called when source is exact_slug or override (i.e. we're confident this
 * image specifically matches this lesson, not just the broader topic).
 *
 * Rules:
 *   - Always grounded in known lesson metadata — no invented clinical specifics
 *   - Max one short line
 *   - Returns null when title is absent, so the caption area is hidden cleanly
 */
function deriveCaption(
  lessonTitle: string | null | undefined,
  source: LessonImageSource,
): string | null {
  // Topic/system-level illustrations should not carry a lesson-specific caption
  if (source === "topic_slug" || source === "map_keyword" || source === "map_body_system" || source === "none") return null;
  const t = lessonTitle?.trim();
  if (!t) return null;
  return `${t} — visual reference`;
}

function resolveCaption(
  captionProp: string | null | undefined,
  lessonTitle: string | null | undefined,
  source: LessonImageSource,
): string | null {
  // Explicit override (including explicit null to suppress)
  if (captionProp !== undefined) return captionProp;
  return deriveCaption(lessonTitle, source);
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Polished, theme-aware presentation card for a matched lesson clinical image.
 *
 * Renders nothing if `url` is falsy — but callers should guard on null before
 * reaching this component (the resolver returns `url: null` for no-match).
 *
 * Usage:
 *   {matchedLessonImage.url ? (
 *     <LessonClinicalImageCard
 *       url={matchedLessonImage.url}
 *       alt={matchedLessonImage.alt}
 *       source={matchedLessonImage.source}
 *       lessonTitle={lesson.title}
 *     />
 *   ) : null}
 */
export function LessonClinicalImageCard({
  url,
  alt,
  source = "exact_slug",
  lessonTitle,
  label: labelProp,
  caption: captionProp,
  className = "",
}: LessonClinicalImageCardProps) {
  const [hidden, setHidden] = useState(false);
  const onHidden = useCallback(() => setHidden(true), []);

  if (!url || !hasRenderableLessonImageUrl(url) || hidden) return null;

  const label = resolveLabel(labelProp, source);
  const caption = resolveCaption(captionProp, lessonTitle, source);

  return (
    <aside
      aria-label={label ?? "Clinical image for this lesson"}
      className={`mx-auto mt-8 mb-2 w-full max-w-[min(44rem,100%)] overflow-hidden rounded-2xl${className ? ` ${className}` : ""}`}
      style={{
        background: "var(--lesson-media-surface)",
        border: "1px solid var(--lesson-media-border)",
        /* Shadow depth: calm, not dramatic */
        boxShadow: "0 2px 12px -4px rgba(0,0,0,0.06), 0 1px 4px -1px rgba(0,0,0,0.04)",
      }}
    >
      {/* ── Inner padding wrapper ─────────────────────────────────────────── */}
      <div className="p-4 sm:p-6">
        {/* ── Eyebrow label ──────────────────────────────────────────────── */}
        {label ? (
          <p
            className="mb-3 text-[10px] font-bold uppercase leading-none tracking-[0.12em]"
            style={{ color: "var(--lesson-media-label-text)" }}
            aria-hidden="true"
          >
            {label}
          </p>
        ) : null}

        {/* ── Inner image frame ──────────────────────────────────────────── */}
        {/*
         * The inner frame creates a distinct visual layer between the outer card
         * surface and the image, preventing the image from feeling "painted" directly
         * onto the lesson background. The subtle inner border adds just enough
         * definition without harsh framing.
         */}
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
            className="block h-auto max-h-[min(70vh,520px)] w-full max-w-full object-contain object-center"
            onHidden={onHidden}
          />
        </div>

        {/* ── Caption area ───────────────────────────────────────────────── */}
        {/*
         * Only rendered when a caption string exists.
         * Caption is always a single short factual line derived from lesson metadata.
         * Visually separated from the image frame by its own surface + top spacing.
         */}
        {caption ? (
          <div
            className="mt-3 overflow-hidden rounded-xl px-4 py-3"
            style={{
              background: "var(--lesson-media-caption-surface)",
              border: "1px solid var(--lesson-media-border)",
            }}
          >
            <p
              className="text-[11px] leading-relaxed sm:text-xs"
              style={{ color: "var(--lesson-media-caption-text)" }}
            >
              {caption}
            </p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

// ── LessonImageLabel (standalone, for custom layouts) ─────────────────────────

/**
 * Standalone eyebrow label for cases where you need the label outside the card frame.
 * Use LessonClinicalImageCard in the standard case.
 */
export function LessonImageLabel({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <p
      className={`text-[10px] font-bold uppercase leading-none tracking-[0.12em] ${className}`}
      style={{ color: "var(--lesson-media-label-text)" }}
      aria-hidden="true"
    >
      {children}
    </p>
  );
}

// ── LessonImageCaption (standalone, for custom layouts) ───────────────────────

/**
 * Standalone caption for cases where you need the caption outside the card frame.
 * Use LessonClinicalImageCard in the standard case.
 */
export function LessonImageCaption({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl px-4 py-3 ${className}`}
      style={{
        background: "var(--lesson-media-caption-surface)",
        border: "1px solid var(--lesson-media-border)",
      }}
    >
      <p
        className="text-[11px] leading-relaxed sm:text-xs"
        style={{ color: "var(--lesson-media-caption-text)" }}
      >
        {children}
      </p>
    </div>
  );
}
