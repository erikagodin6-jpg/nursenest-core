import type { RnCompetencyId } from "@/lib/educational-graph/rn-competency-ontology";
import type { ClinicalReasoningRelation } from "@/lib/educational-graph/rn-competency-ontology";

/** Canonical step kinds — single vocabulary across marketing, app, coaching, dashboards. */
export type EduGraphStepKind =
  | "mechanism"
  | "lesson"
  | "interpretation"
  | "glossary"
  | "flashcards"
  | "prioritization_drill"
  | "mixed_case"
  | "remediation_review"
  | "reassessment"
  | "cat_exam"
  | "loft_simulation";

export type GraphSourceSurface =
  | "marketing_lesson"
  | "topic_hub_public"
  | "topic_hub_authenticated"
  | "app_remediation"
  | "post_exam_coaching"
  | "dashboard_feed"
  | "study_plan"
  | "ai_tutor"
  | "recommendation_engine"
  | "glossary_traversal"
  | "cognition_substrate"
  | "post_session_cognition"
  | "focus_area_detail"
  | "adaptive_recommendations";

export type EducationalIntent =
  | "mechanism_framing"
  | "concept_scaffold"
  | "interpretation"
  | "terminology"
  | "prioritization"
  | "mixed_application"
  | "spaced_retention"
  | "remediation_review"
  | "reassessment";

export type EduGraphStepDifficulty = "foundational" | "intermediate" | "advanced";

/**
 * Standard graph step contract — all traversal consumers map from this type.
 */
export type EduGraphStep = {
  stepId: string;
  stepKind: EduGraphStepKind;
  competencyId: RnCompetencyId | null;
  topicSlug: string;
  title: string;
  description: string;
  href: string;
  pathwayId: string | null;
  educationalIntent: EducationalIntent;
  learnerStateReason: string | null;
  estimatedMinutes: number;
  difficulty: EduGraphStepDifficulty;
  remediationPriority: number;
  graphDepth: number;
  sourceSurface: GraphSourceSurface;
  telemetryMetadata: {
    reasoningRelation?: ClinicalReasoningRelation;
    measurementTag?: string;
    coachingModel?: string;
  };
};

export type EducationalGraphTraversal = {
  topicSlug: string;
  topicLabel: string;
  competencyId: RnCompetencyId | null;
  competencyLabel: string | null;
  reasoningChain: readonly ClinicalReasoningRelation[];
  steps: readonly EduGraphStep[];
  studySequence: readonly string[];
  sourceSurface: GraphSourceSurface;
};
