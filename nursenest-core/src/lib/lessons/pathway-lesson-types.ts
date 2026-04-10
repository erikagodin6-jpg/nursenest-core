import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingLessonDetailHref, marketingPathwayLessonDetailPath } from "@/lib/lessons/lesson-routes";

/**
 * Section bodies may include tier-scoped segments via `<TierBlock tier="PN|RN|NP|ALL">…</TierBlock>`
 * (see {@link resolveTierBlocksForViewer}).
 */

/** Structured “exam focus” block for pathway lessons (how tested, traps, prioritization). */
export type PathwayLessonExamFocus = {
  howTested?: string;
  commonTraps?: string;
  prioritizationCues?: string;
};

/** Premium lesson spine section ids (see pathway-lesson-premium.ts). */
export type PathwayLessonPremiumSectionKind =
  | "introduction"
  | "pathophysiology_overview"
  | "signs_symptoms"
  | "red_flags"
  | "labs_diagnostics"
  | "nursing_assessment_interventions"
  | "clinical_pearls"
  | "client_education"
  | "tier_specific_relevance"
  | "country_specific_notes"
  | "related_next_steps";

export type PathwayLessonRelatedRef = {
  slug: string;
  titleHint?: string;
};

/** Primary exam tier(s) this lesson targets (pathway still scopes catalog rows; this tags cross-surface alignment). */
export type PathwayLessonAudienceTier = "rn" | "pn" | "np";

/** Geographic / exam-framework emphasis for authoring and bank tagging. */
export type PathwayLessonCountryScope = "us" | "ca" | "both";

/** Relative exam weight for prioritization in expansion / hub ordering. */
export type PathwayLessonExamRelevance = "high_yield" | "core" | "specialty";

/**
 * Optional authoring tag for cross-cutting exam domains (catalog / future DB metadata).
 * Hub lists still group primarily by `topicSlug` / `bodySystem`; this supports filters and rationale linking.
 */
export type PathwayLessonContentDomain =
  | "disease"
  | "syndrome"
  | "medication"
  | "safety"
  | "prioritization"
  | "case_study"
  | "other";

export type PathwayLessonOmittedPremiumSection = {
  kind: PathwayLessonPremiumSectionKind;
  reason: string;
};

export type PathwayLessonPremiumValidation = {
  publishReady: boolean;
  premiumReady: boolean;
  issues: string[];
  internalLinkCount: number;
  omittedSections: PathwayLessonOmittedPremiumSection[];
  introParagraphCount: number;
};

/** Unified structural / SEO gate for public surfacing (premium spine vs legacy five-block). */
export type PathwayLessonStructuralGate = {
  structureMode: "premium" | "legacy";
  /** When false, lesson should be treated as incomplete for SEO / “complete” badges. */
  publicComplete: boolean;
  issues: string[];
  warnings: string[];
  internalStudyLinkCount: number;
};

/** Canonical five-block structure (render order). Legacy catalog kinds are normalized into these. */
export type PathwayLessonSectionKind =
  | "clinical_meaning"
  | "exam_relevance"
  | "core_concept"
  | "clinical_scenario"
  | "takeaways"
  | "intro"
  | "core"
  | "clinical_application"
  | "exam_tips"
  | "exam_focus"
  | PathwayLessonPremiumSectionKind;

/** Optional educational figures for a lesson section (HTTPS URLs only after sanitization). */
export type PathwayLessonFigureKind =
  | "diagram"
  | "chart"
  | "anatomy"
  | "flowchart"
  | "clinical_reference"
  | "other";

export type PathwayLessonFigure = {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  kind?: PathwayLessonFigureKind;
  /** Internal attribution / source line (not always shown publicly). */
  attribution?: string;
};

export type PathwayLessonSection = {
  id: string;
  heading: string;
  kind: PathwayLessonSectionKind;
  body: string;
  /** Present when `kind === "exam_focus"`. */
  examFocus?: PathwayLessonExamFocus;
  /** Inline diagrams / algorithms — lazy-loaded in the lesson UI. */
  figures?: PathwayLessonFigure[];
};

/** Inline pre/post checks for pathway lessons (catalog or DB JSON). */
export type PathwayLessonQuizItem = {
  question: string;
  options: string[];
  /** Zero-based index of correct option (aligned with legacy monolith lessons). */
  correct: number;
  rationale?: string;
};

/** How localized pathway lesson content was resolved for this response. */
export type PathwayLessonLocaleMeta = {
  /** BCP-47-style key the caller asked for (normalized). */
  requestedContentLocale: string;
  /** Locale of the DB row or catalog source actually rendered (normalized). */
  contentLocale: string;
  /** Requested locale had no published row; English (or another available locale) was used instead. */
  usedLocaleFallback: boolean;
  /** Narrative comes from bundled English catalog (not `pathway_lessons`). */
  isCatalogEnglishSource: boolean;
  /**
   * True when `public/i18n/educational-overlays/<locale>/lessons.json` merged display strings
   * on top of the resolved lesson (audit trail for file-based translations).
   */
  educationalOverlayApplied?: boolean;
};

export type PathwayLessonRecord = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: PathwayLessonSection[];
  preTest?: PathwayLessonQuizItem[];
  postTest?: PathwayLessonQuizItem[];
  localeMeta?: PathwayLessonLocaleMeta;
  /** Scoped gold premium lessons: documented omissions (e.g. labs not applicable). */
  premiumOmittedSections?: PathwayLessonOmittedPremiumSection[];
  /** Related slugs for hubs / related block (metadata). */
  relatedLessonRefs?: PathwayLessonRelatedRef[];
  /** Word counts, internal links, required sections — computed at normalize time for gating + UI. */
  structuralQuality?: PathwayLessonStructuralGate;
  /** Present when lesson uses premium section kinds; filled in {@link normalizeLesson}. */
  premiumValidation?: PathwayLessonPremiumValidation;
  /** Optional catalog metadata for filtering and hub labeling (when present on `LessonInput`). */
  audienceTiers?: PathwayLessonAudienceTier[];
  countryScope?: PathwayLessonCountryScope;
  examRelevance?: PathwayLessonExamRelevance;
};

/** Hub cards must not link with empty or whitespace slugs (defensive; DB/catalog should always set slug). */
export function pathwayLessonHasRenderableHubSlug(l: Pick<PathwayLessonRecord, "slug">): boolean {
  return typeof l.slug === "string" && l.slug.trim().length > 0;
}

/**
 * Safe href for marketing pathway lesson detail: `{lessonsBasePath}/{slug}`.
 * Returns null if slug is unusable — callers must not render a link.
 */
export function pathwayLessonMarketingDetailHref(
  lessonsBasePath: string,
  slug: string | null | undefined,
): string | null {
  if (!pathwayLessonHasRenderableHubSlug({ slug: slug ?? "" })) return null;
  return marketingLessonDetailHref(lessonsBasePath, slug);
}

/**
 * Single helper for public marketing lesson URLs: `/{country}/{role}/{exam}/lessons/{slug}`.
 * Prefer this over manual string concat so redirects and link audits stay aligned.
 */
export function pathwayLessonPublicDetailPath(
  pathway: Pick<ExamPathwayDefinition, "countrySlug" | "roleTrack" | "examCode">,
  lessonSlug: string | null | undefined,
): string | null {
  return marketingPathwayLessonDetailPath(pathway, lessonSlug);
}

/**
 * Detail-page related list: metadata refs first (study flow / SEO), then same-topic neighbors, deduped.
 */
export function mergeRelatedLessonDisplayList(
  refs: PathwayLessonRelatedRef[] | undefined,
  topicRelated: PathwayLessonRecord[],
  limit: number = 8,
): { slug: string; title: string }[] {
  const cap = Math.min(24, Math.max(1, Math.floor(limit)));
  const out: { slug: string; title: string }[] = [];
  const seen = new Set<string>();
  for (const r of refs ?? []) {
    if (out.length >= cap) break;
    const slug = typeof r.slug === "string" ? r.slug.trim() : "";
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    const hint = r.titleHint?.trim();
    out.push({ slug, title: hint && hint.length > 0 ? hint : slug.replace(/-/g, " ") });
  }
  for (const row of topicRelated) {
    if (out.length >= cap) break;
    if (!pathwayLessonHasRenderableHubSlug(row)) continue;
    const slug = row.slug.trim();
    if (seen.has(slug)) continue;
    seen.add(slug);
    out.push({ slug, title: row.title });
  }
  return out;
}
