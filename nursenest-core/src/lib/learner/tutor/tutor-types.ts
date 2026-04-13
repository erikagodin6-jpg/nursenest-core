/**
 * Serializable context passed from the learner shell into the tutor dock.
 * Keep this JSON-safe for future `POST /api/learner/tutor/*` bodies.
 */
export type LearnerTutorShellContext = {
  userId: string;
  /** Primary pathway id from profile (`learnerPath`), when set. */
  pathwayId: string | null;
  /** Short label for copy (“NCLEX-RN”, allied pill, etc.). */
  pathwayLabel: string | null;
};

/**
 * Stable ids for assistant intents — extend here before adding UI or API handlers.
 * `live` entries in the registry may use `href` only (no model). `planned` reserved for model/tooling.
 */
export type TutorIntentId =
  | "nav_focus_areas"
  | "nav_question_bank"
  | "nav_exam_plan"
  | "nav_readiness"
  | "nav_study_coach"
  | "ai_simplify_rationale"
  | "ai_quiz_concept"
  | "ai_weak_area_summary"
  | "ai_exam_prep_guidance";

export type TutorIntentPhase = "live" | "planned";

export type TutorIntentDefinition = {
  id: TutorIntentId;
  phase: TutorIntentPhase;
  labelKey: string;
  detailKey: string;
  /** Present when `phase === "live"` — in-app navigation only. */
  href?: string;
};
