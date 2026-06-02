import "server-only";

import { isStudyCoachEnabled } from "@/lib/ai/learner-ai-policy";
import type { TutorIntentDefinition } from "@/lib/learner/tutor/tutor-types";

/**
 * **Current functionality:** navigation intents only — no LLM calls, no fabricated answers.
 *
 * **Future hooks:** `ai_*` ids stay `planned` until a server route + policy gates them.
 */
export function getTutorIntentRegistry(): TutorIntentDefinition[] {
  const coachLive = isStudyCoachEnabled();

  const core: TutorIntentDefinition[] = [
    {
      id: "nav_focus_areas",
      phase: "live",
      labelKey: "learner.tutor.intent.focusAreas.label",
      detailKey: "learner.tutor.intent.focusAreas.detail",
      href: "/app/account/focus-areas",
    },
    {
      id: "nav_question_bank",
      phase: "live",
      labelKey: "learner.tutor.intent.questionBank.label",
      detailKey: "learner.tutor.intent.questionBank.detail",
      href: "/app/questions",
    },
    {
      id: "nav_exam_plan",
      phase: "live",
      labelKey: "learner.tutor.intent.examPlan.label",
      detailKey: "learner.tutor.intent.examPlan.detail",
      href: "/app/exam-plan",
    },
    {
      id: "nav_readiness",
      phase: "live",
      labelKey: "learner.tutor.intent.readiness.label",
      detailKey: "learner.tutor.intent.readiness.detail",
      href: "/app/account/readiness",
    },
  ];

  const coach: TutorIntentDefinition = coachLive
    ? {
        id: "nav_study_coach",
        phase: "live",
        labelKey: "learner.tutor.intent.studyCoach.label",
        detailKey: "learner.tutor.intent.studyCoach.detail",
        href: "/app/study-coach",
      }
    : {
        id: "nav_study_coach",
        phase: "planned",
        labelKey: "learner.tutor.intent.studyCoach.label",
        detailKey: "learner.tutor.intent.studyCoach.plannedDetail",
      };

  const future: TutorIntentDefinition[] = [
    {
      id: "ai_simplify_rationale",
      phase: "planned",
      labelKey: "learner.tutor.intent.simplifyRationale.label",
      detailKey: "learner.tutor.intent.simplifyRationale.detail",
    },
    {
      id: "ai_quiz_concept",
      phase: "planned",
      labelKey: "learner.tutor.intent.quizConcept.label",
      detailKey: "learner.tutor.intent.quizConcept.detail",
    },
    {
      id: "ai_weak_area_summary",
      phase: "planned",
      labelKey: "learner.tutor.intent.weakSummary.label",
      detailKey: "learner.tutor.intent.weakSummary.detail",
    },
    {
      id: "ai_exam_prep_guidance",
      phase: "planned",
      labelKey: "learner.tutor.intent.examPrep.label",
      detailKey: "learner.tutor.intent.examPrep.detail",
    },
  ];

  return [...core, coach, ...future];
}
