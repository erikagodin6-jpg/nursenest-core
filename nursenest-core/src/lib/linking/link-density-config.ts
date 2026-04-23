/**
 * Internal Link Density Configuration.
 *
 * Defines per-surface limits on how many internal links to include,
 * broken down by target kind (lesson, flashcard, question, blog).
 *
 * These limits prevent link farms while ensuring adequate coverage.
 * The resolver respects these caps as hard upper bounds.
 */

import type { LinkSurface, LinkTargetKind } from "@/lib/linking/internal-link-types";

export type DensityLimit = {
  /** Maximum links of this kind to include. */
  max: number;
  /** Minimum required (resolver warns in debug mode if not met). */
  min: number;
};

export type SurfaceDensityConfig = {
  lesson: DensityLimit;
  flashcard: DensityLimit;
  question: DensityLimit;
  blog: DensityLimit;
  cat: DensityLimit;
  /** Pathway / exam hub landing pages (link to sibling hubs). */
  hub: DensityLimit;
  /** Max total internal links across all kinds. */
  totalMax: number;
};

/**
 * Per-surface density rules.
 *
 * Guiding principle: fewer, stronger links. Ceilings are tight; the quality
 * gate in link-resolver.ts further reduces output by dropping weak candidates
 * whenever strong/moderate matches exist.
 *
 * Blog:       2–4 lessons, 0–2 flashcards, 1–2 questions, 0–3 related blogs.  Max 8.
 * Lesson:     0–1 related lesson, 0–1 flashcard deck, 1–2 questions, 0–1 blog. Max 4.
 * Flashcard:  0–1 source lesson, 0–1 question set.                             Max 3.
 * Question:   0–1 lesson review, 0–1 flashcard set.                            Max 3.
 * CAT result: 0–3 lesson recs, 0–2 flashcard, 0–2 question.                   Max 6.
 * Hub:        0–2 lessons, 0–1 questions.                                      Max 4.
 */
export const DENSITY_CONFIG: Record<LinkSurface, SurfaceDensityConfig> = {
  blog: {
    lesson:    { min: 2, max: 4 },
    flashcard: { min: 0, max: 2 },
    question:  { min: 1, max: 2 },
    blog:      { min: 0, max: 3 },
    cat:       { min: 0, max: 1 },
    hub:       { min: 0, max: 1 },
    totalMax: 8,
  },
  lesson: {
    lesson:    { min: 0, max: 1 },
    flashcard: { min: 0, max: 1 },
    question:  { min: 1, max: 2 },
    blog:      { min: 0, max: 1 },
    /** One pathway-scoped CAT landing is enough; avoids zero-output when registry has no CAT targets. */
    cat:       { min: 0, max: 1 },
    hub:       { min: 0, max: 0 },
    totalMax: 4,
  },
  flashcard: {
    lesson:    { min: 0, max: 1 },
    flashcard: { min: 0, max: 0 },
    question:  { min: 0, max: 1 },
    blog:      { min: 0, max: 0 }, // no blog links from flashcard pages — too noisy
    cat:       { min: 0, max: 0 },
    hub:       { min: 0, max: 0 },
    totalMax: 2,
  },
  question: {
    lesson:    { min: 0, max: 1 },
    flashcard: { min: 0, max: 1 },
    question:  { min: 0, max: 0 },
    blog:      { min: 0, max: 0 }, // no blog links from question pages — stay focused
    cat:       { min: 0, max: 1 },
    hub:       { min: 0, max: 0 },
    totalMax: 3,
  },
  cat_result: {
    lesson:    { min: 0, max: 3 },
    flashcard: { min: 0, max: 2 },
    question:  { min: 0, max: 2 },
    blog:      { min: 0, max: 1 },
    cat:       { min: 0, max: 0 },
    hub:       { min: 0, max: 0 },
    totalMax: 6,
  },
  hub: {
    lesson:    { min: 0, max: 2 },
    flashcard: { min: 0, max: 1 },
    question:  { min: 0, max: 1 },
    blog:      { min: 0, max: 1 },
    cat:       { min: 0, max: 1 },
    hub:       { min: 0, max: 1 },
    totalMax: 4,
  },
};

/** Returns the density config for a surface (defaults to blog if unknown). */
export function getDensityConfig(surface: LinkSurface): SurfaceDensityConfig {
  return DENSITY_CONFIG[surface] ?? DENSITY_CONFIG.blog;
}

/** Returns the max allowed for a given surface and link kind. */
export function maxLinksFor(surface: LinkSurface, kind: LinkTargetKind): number {
  const config = getDensityConfig(surface);
  return config[kind]?.max ?? 0;
}

/** Returns the min required for a given surface and link kind. */
export function minLinksFor(surface: LinkSurface, kind: LinkTargetKind): number {
  const config = getDensityConfig(surface);
  return config[kind]?.min ?? 0;
}
