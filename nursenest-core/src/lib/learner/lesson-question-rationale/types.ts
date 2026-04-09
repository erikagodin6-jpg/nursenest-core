/**
 * Types for the **lesson ↔ question rationale** mapping layer.
 * Add new lessons by appending registry rows — avoid scattering regex in feature code.
 */

import type { CountryCode } from "@prisma/client";
import type { RoleTrackSlug } from "@/lib/exam-pathways/types";

/** Clinical bucket for analytics, filtering, and diversity caps. */
export type LessonConceptDomain =
  | "disease"
  | "syndrome"
  | "medication_class"
  | "safety"
  | "prioritization"
  | "delegation"
  | "case_study";

/** Mirrors consumer-facing rationale link kinds (UI / API). */
export type RationaleLessonLinkKind =
  | "prioritization"
  | "disease_process"
  | "medication"
  | "safety"
  | "case_study"
  | "topic_hub";

/** Resolved pathway facts used for region + role scoping. */
export type PathwayRationaleContext = {
  pathwayId: string;
  countryCode: CountryCode;
  countrySlug: "us" | "canada";
  roleTrack: RoleTrackSlug;
};

/** One registry row: question signals → lesson slug. */
export type LessonRationaleMappingEntry = {
  /** Stable editor-facing id (e.g. `sepsis-gold-haystack`). */
  id: string;
  lessonSlug: string;
  domain: LessonConceptDomain;
  linkKind: RationaleLessonLinkKind;
  /** Tested against normalized haystack (topic + subtopic + body + tags). */
  haystackPattern: RegExp;
  /** Score when the pattern matches, before bonuses (0–100). */
  baseWeight: number;
  /** Extra points when `topicCode` equals or contains one of these normalized keys. */
  topicKeyBonus?: { keys: string[]; bonus: number };
  /** Lowercase substring match against each question tag; cumulative with cap. */
  tagHints?: { hints: string[]; bonusEach: number; maxBonus: number };
  /** If set, only these pathways may receive this link. */
  pathwayIdsAllow?: string[];
  /** If set, these pathways never receive this link. */
  pathwayIdsDeny?: string[];
  /** If set, country must match. */
  countryCodesAllow?: CountryCode[];
  /** If set, role track must match (e.g. NP-only rows). */
  roleTracksAllow?: RoleTrackSlug[];
};

export type QuestionRationaleSignals = {
  topic?: string | null;
  subtopic?: string | null;
  bodySystem?: string | null;
  tags: string[];
  /** From {@link deriveTopicCode} / bank metadata. */
  topicCode?: string | null;
  /** Optional stem snippet for token overlap with lesson titles (graded questions only). */
  stem?: string | null;
};

export type RankedLessonSlug = {
  lessonSlug: string;
  kind: RationaleLessonLinkKind;
  domain: LessonConceptDomain;
  /** Final score after bonuses, pathway gates, and tier affinity. */
  score: number;
  /** Best-matching registry entry id (for debugging). */
  matchedEntryId: string;
};

export type RankRelatedLessonSlugsOptions = {
  /** Max links returned (default 3). */
  maxLinks?: number;
  /** Minimum score to include (default 72). */
  minScore?: number;
  /** At most one link per domain except these may appear twice if score ≥ strongDiversityThreshold (default 92). */
  diversityStrongThreshold?: number;
};
