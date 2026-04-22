import type { CountryCode, TierCode } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingLessonDetailHref, marketingPathwayLessonDetailPath } from "@/lib/lessons/lesson-routes";
import type { RecallPrompt, CheckpointQuestion, KeyRecallFact } from "@/lib/lessons/lesson-recall-types";

// Re-export so consumers don't need two imports when working with lesson sections + recall.
export type { RecallPrompt, CheckpointQuestion, KeyRecallFact };

/**
 * Section bodies may include tier-scoped segments via `<TierBlock tier="PN|RN|NP|ALL">…</TierBlock>`
 * (see {@link resolveTierBlocksForViewer}).
 */

/** Embedded interactive sound libraries on catalog / DB pathway lessons. */
export type PathwayEmbeddedSoundLibraryId = "cardiac_sounds" | "respiratory_sounds";

/** Authoring taxonomy for where the interactive block sits in the lesson spine (not sound Normal/Adventitious). */
export type LessonInteractiveModuleCategory =
  | "Assessment"
  | "Pathophysiology"
  | "Intervention"
  | "Education"
  | "Other";

/**
 * Normalized item for sound-library modules — hydrated from canonical registry data in
 * {@link buildLessonInteractiveModules}; catalog should not hand-author large blobs here.
 */
export type LessonInteractiveSoundLibraryItem = {
  id: string;
  name: string;
  /** Normal / Adventitious / voice (respiratory) or cardiac category slug from registry. */
  category: string;
  description: string;
  timing: string;
  pitch: string;
  clinicalSignificance: string;
  commonCauses: string[];
  audioUrl?: string | null;
  auscultationSite: string;
  waveformType: string;
  allowedTiers?: TierCode[];
  countryNotes?: Partial<Record<CountryCode, string>>;
  clinicalPearl?: string;
  miniQuestion?: { question: string; options: string[]; correctIndex: number; rationale: string };
  /** Optional linkage to bank questions (future integration; not rendered yet). */
  examQuestionIds?: string[];
};

/** One embedded sound library block (respiratory or cardiac) with structured items. */
export type LessonInteractiveSoundLibraryModule = {
  id: string;
  type: "sound-library";
  soundLibrary: PathwayEmbeddedSoundLibraryId;
  system: string;
  category: LessonInteractiveModuleCategory;
  items: LessonInteractiveSoundLibraryItem[];
};

/** Discriminated union for lesson-embedded interactives (expand with lab/ECG later). */
export type LessonInteractiveModule = LessonInteractiveSoundLibraryModule;

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
export type PathwayLessonRuntimeExam = "REX_PN" | "NCLEX_PN" | "NCLEX_RN" | "NP" | "ALLIED" | "NCLEX";
export type PathwayLessonRuntimeCountry = "CA" | "US" | "GLOBAL";
export type PathwayLessonPriority = "high" | "medium" | "low";
export type PathwayLessonYieldLevel = "must_know" | "common" | "advanced" | "rare";
export type PathwayLessonClinicalPriority = "urgent" | "routine" | "foundational";
export type PathwayLessonExamMeta = {
  exam: PathwayLessonRuntimeExam;
  yieldLevel: PathwayLessonYieldLevel;
  clinicalPriority?: PathwayLessonClinicalPriority;
};

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
  /**
   * When true, the lesson meets subscriber surfacing rules (required spine, scenario signal,
   * banned-placeholder scan, and premium spine checks when applicable). Hubs, lists, and learner
   * routes should treat `false` as unavailable to end users.
   */
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
  /**
   * Active recall: reveal-answer cards shown after the section body.
   * Optional — absent for most lessons until recall content is authored.
   */
  recallPrompts?: RecallPrompt[];
  /**
   * Active recall: 1–3 multiple-choice checkpoint questions shown after the section.
   * Lazy-loaded. Optional — absent for most lessons until recall content is authored.
   */
  checkpointQuestions?: CheckpointQuestion[];
  /**
   * Active recall: short key facts shown as blur-to-reveal chips after the section.
   * Optional — absent for most lessons until recall content is authored.
   */
  keyRecallFacts?: KeyRecallFact[];
  /**
   * Optional URL for pre-generated section audio (TTS or studio recording).
   * Only populated for sections that have audio available.
   * Absent for most sections — LessonSectionAudioButton renders nothing when null/undefined.
   */
  audioUrl?: string | null;
};

/**
 * @deprecated Inline lesson quizzes are being removed — use {@link PathwayLessonRecord.preTestQuestionIds}
 * / {@link PathwayLessonRecord.postTestQuestionIds} and fetch via `POST /api/exam-questions/by-ids`.
 */
export type PathwayLessonQuizItem = {
  question: string;
  options: string[];
  /** Zero-based index of correct option (aligned with legacy monolith lessons). */
  correct: number;
  rationale?: string;
  /** When present (bank-backed study loop), used for analytics and weak-area tracking. */
  examQuestionId?: string;
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
  /** At least one overlay string failed quality checks and was reverted to English. */
  overlayTranslationFallback?: boolean;
};

export type PathwayLessonRecord = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  /** Canonical lesson system key used for universal hub grouping. */
  system?: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: PathwayLessonSection[];
  /** Bank-backed pre-check: stable `ExamQuestion.id` values only (no inline stems). */
  preTestQuestionIds?: string[];
  /** Bank-backed post-check: stable `ExamQuestion.id` values only (no inline stems). */
  postTestQuestionIds?: string[];
  /** @deprecated Prefer {@link preTestQuestionIds}. */
  preTest?: PathwayLessonQuizItem[];
  /** @deprecated Prefer {@link postTestQuestionIds}. */
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
  /** Region-aware runtime filters (single global lesson dataset). */
  exams?: PathwayLessonRuntimeExam[];
  countries?: PathwayLessonRuntimeCountry[];
  priority?: PathwayLessonPriority;
  /** Exam-aware yield metadata for cross-surface prioritization (plans/readiness/questions). */
  examMeta?: PathwayLessonExamMeta[];
  /** Runtime-selected metadata for the current exam context. */
  activeExamMeta?: PathwayLessonExamMeta;
  /**
   * Optional URL for pre-generated lesson-level audio (TTS or studio narration).
   * When present, the LessonAudioCard renders a play control above the lesson article.
   * Absent for most lessons — component renders nothing gracefully when null/undefined.
   */
  audioUrl?: string | null;
  /**
   * High-yield takeaways for top/bottom strips — authored in catalog/DB or derived from the takeaways section.
   */
  studyTakeaways?: string[];
  /** Common exam traps — may be authored or derived from exam_focus.commonTraps text. */
  studyCommonTraps?: string[];
  /** “If you only remember one thing” — optional single line when authored. */
  memoryAnchor?: string;
  /** Section ids skipped in the article when takeaways bullets were hoisted to strips. */
  omitHighYieldSectionIds?: string[];
  /**
   * Optional embedded interactive modules (sound libraries) rendered with the lesson body.
   * When absent, a conservative heuristic may still attach libraries for tightly matched topics.
   */
  embeddedSoundLibraries?: PathwayEmbeddedSoundLibraryId[];
  /**
   * Structured interactive inserts (sound libraries today). Populated in `normalizeLesson`.
   * Lesson pages render this array once (after section articles, before reinforcement strips).
   */
  interactiveModules?: LessonInteractiveModule[];
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
