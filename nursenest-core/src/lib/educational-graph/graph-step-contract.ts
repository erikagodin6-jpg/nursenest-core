import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";

export type GraphSourceSurface =
  | "marketing_lesson"
  | "topic_hub_public"
  | "topic_hub_authenticated"
  | "app_remediation"
  | "post_exam_coaching"
  | "dashboard_feed"
  | (string & {});

export type EduGraphStepKind =
  | "mechanism"
  | "lesson"
  | "foundational_lesson"
  | "interpretation"
  | "prioritization_drill"
  | "practice_questions"
  | "questions"
  | "flashcards"
  | "cat"
  | "mixed_reassessment"
  | "reassessment";

export type EduGraphStep = {
  stepId: string;
  stepKind: EduGraphStepKind;
  title: string;
  description: string;
  href: string;
  depth: number;
  topicSlug: string;
  topicLabel: string;
  sourceSurface: GraphSourceSurface;
  pathwayId: string | null;
  competencyId: string | null;
  competencyLabel: string | null;
  remediationPriority?: "low" | "medium" | "high";
  cognition?: EducationalCognitionContext | null;
};

export type EducationalGraphTraversal = {
  topicSlug: string;
  topicLabel: string;
  sourceSurface: GraphSourceSurface;
  pathwayId: string | null;
  competencyId: string | null;
  competencyLabel: string | null;
  steps: EduGraphStep[];
  studySequence: string[];
};
