/**
 * Shared core nursing content per topic + exam-specific overlays (RN / PN / NP / Allied).
 * Rendering: load core, inject overlay for the learner’s exam, filter questions by tier/pathway.
 * Paywall: core and overlays remain entitlement-gated on the server; merged output respects the same rules.
 */

/** Coarse exam tracks that receive overlays (aligns with marketing tiers / pathways). */
export type ExamOverlayKey = "RN" | "PN" | "NP" | "ALLIED";

export type CoreTopicContent = {
  topicId: string;
  /** Canonical slug for routing and dedupe */
  topicSlug: string;
  /** Shared lesson blocks (e.g. five pathway kinds) — clinical facts, not exam-specific framing */
  coreLesson: {
    clinicalMeaning: string;
    examRelevanceGeneric?: string;
    coreConcept: string;
    clinicalScenario: string;
    takeaways: string[];
  };
  /** Cross-exam concept bullets (definitions, physiology, safety) */
  coreConcepts: string[];
  /** Shared cards: stem/answer only; framing may be neutral */
  baseFlashcards: Array<{
    id: string;
    front: string;
    back: string;
    tags: string[];
    difficulty: 1 | 2 | 3 | 4 | 5;
  }>;
};

export type ExamContentOverlay = {
  exam: ExamOverlayKey;
  overlays: {
    /** How this board frames the topic (NCLEX-RN vs REx-PN vs NP, etc.) */
    examRelevance: string;
    /** “Assess first”, delegation vs independent action, escalation — exam-specific */
    prioritizationRules: string[];
    /** What PN cannot do, what NP must order, state scope notes — short bullets */
    scopeDifferences: string[];
    /** SATA vs single best, management depth, time pressure hints */
    questionStyleAdjustments: string[];
  };
};

export type MergedLessonForExam = CoreTopicContent["coreLesson"] & {
  examRelevance: string;
  prioritizationRules: string[];
  scopeDifferences: string[];
  questionStyleNotes: string[];
};

/**
 * Merge shared lesson text with one exam overlay for display in learner UI.
 * Call only after entitlement check; do not use overlay to bypass paywall.
 */
export function mergeCoreLessonWithOverlay(
  core: CoreTopicContent,
  overlay: ExamContentOverlay | null,
): MergedLessonForExam {
  const o = overlay?.overlays;
  return {
    ...core.coreLesson,
    examRelevance: o?.examRelevance ?? core.coreLesson.examRelevanceGeneric ?? "",
    prioritizationRules: o?.prioritizationRules ?? [],
    scopeDifferences: o?.scopeDifferences ?? [],
    questionStyleNotes: o?.questionStyleAdjustments ?? [],
  };
}

/** How the same clinical concept is tested differently (for authoring / generation prompts). */
export type QuestionVariationHint = {
  exam: ExamOverlayKey;
  focus: "prioritization" | "scope" | "management" | "safety" | "teaching";
  stemPattern: string;
};

export const QUESTION_VARIATION_BY_EXAM: Record<ExamOverlayKey, QuestionVariationHint> = {
  RN: {
    exam: "RN",
    focus: "prioritization",
    stemPattern: "Which action should the nurse take first?",
  },
  PN: {
    exam: "PN",
    focus: "scope",
    stemPattern: "Which task is appropriate for the PN/LPN to perform in this situation?",
  },
  NP: {
    exam: "NP",
    focus: "management",
    stemPattern: "Which management decision is most appropriate for the nurse practitioner?",
  },
  ALLIED: {
    exam: "ALLIED",
    focus: "safety",
    stemPattern: "Which action aligns with protocol and scope for this allied role?",
  },
};

export type FlashcardFraming = {
  exam: ExamOverlayKey;
  frontLeadIn: string;
};

/** Same fact, different stem lead-in for flashcards */
export const FLASHCARD_FRAMING_BY_EXAM: Record<ExamOverlayKey, FlashcardFraming> = {
  RN: { exam: "RN", frontLeadIn: "Priority action?" },
  PN: { exam: "PN", frontLeadIn: "Appropriate task?" },
  NP: { exam: "NP", frontLeadIn: "Best management?" },
  ALLIED: { exam: "ALLIED", frontLeadIn: "Correct protocol step?" },
};

/**
 * Example: one topic (heart failure volume overload) expressed as three exam-facing versions.
 * Used for docs and tests — not live DB content.
 */
export const EXAMPLE_TOPIC_HEART_FAILURE_CORE: CoreTopicContent = {
  topicId: "hf-volume-core",
  topicSlug: "heart-failure-volume-overload",
  coreLesson: {
    clinicalMeaning:
      "Heart failure with fluid overload means the heart is not moving blood forward effectively; fluid backs up into lungs and periphery. Nursing centers on perfusion, airway, and avoiding harm from fluids and meds.",
    examRelevanceGeneric:
      "Boards reward recognition of overload, safe diuretic use, and what to assess before giving volume.",
    coreConcept:
      "Link orthopnea, crackles, JVD, edema, and weight gain. Tie I&O and daily weights to trend overload.",
    clinicalScenario:
      "Client with HF has +3 pitting edema, crackles, SpO2 89% on RA, anxious. BP tolerable but work of breathing is high.",
    takeaways: [
      "Assess airway and oxygenation early.",
      "Daily weights and strict I&O for trend.",
      "Know provider-ordered diuretics; verify potassium before repeat doses when applicable.",
      "Elevate HOB; limit fluids per order.",
    ],
  },
  coreConcepts: ["Fluid backup", "Diuretic monitoring", "Oxygenation", "Activity tolerance"],
  baseFlashcards: [
    {
      id: "hf-1",
      front: "Early sign of fluid overload you can trend at home?",
      back: "Daily weight increase (e.g. 2 lb in a day or 5 lb in a week) — report per protocol.",
      tags: ["hf", "fluids"],
      difficulty: 2,
    },
  ],
};

export const EXAMPLE_OVERLAYS_HEART_FAILURE: Record<ExamOverlayKey, ExamContentOverlay> = {
  RN: {
    exam: "RN",
    overlays: {
      examRelevance:
        "NCLEX-RN: multi-patient prioritization, safe medication administration, and who to see first when overload is evolving.",
      prioritizationRules: [
        "Airway/breathing before routine meds.",
        "Unstable vs stable — unstable wins the first visit.",
        "Verify parameters before IV diuretics when ordered.",
      ],
      scopeDifferences: ["RN implements orders; escalate abnormal vitals promptly."],
      questionStyleAdjustments: [
        "Expect NGN-style priority and delegation stems.",
        "SATA possible for assessment findings.",
      ],
    },
  },
  PN: {
    exam: "PN",
    overlays: {
      examRelevance:
        "REx-PN / NCLEX-PN: scope-safe actions, reporting, and tasks the PN performs under supervision.",
      prioritizationRules: [
        "Observe and report respiratory distress; position for breathing within scope.",
        "Take vitals and weights; do not independently prescribe or titrate meds.",
      ],
      scopeDifferences: [
        "PN does not independently decide diuretic dose changes.",
        "Clarify unclear orders; escalate to RN/provider.",
      ],
      questionStyleAdjustments: [
        "Many items test what the PN should do vs delegate vs report.",
        "Communication and safety-first sequencing.",
      ],
    },
  },
  NP: {
    exam: "NP",
    overlays: {
      examRelevance:
        "NP boards: differential, diagnostics, prescribing, and follow-up for HF exacerbation.",
      prioritizationRules: [
        "Rule out life threats; align inpatient vs outpatient management.",
        "Adjust guideline-directed therapy when appropriate to scope and setting.",
      ],
      scopeDifferences: [
        "NP orders and adjusts plan within collaborative agreement/state scope.",
        "Know when to admit or escalate cardiology.",
      ],
      questionStyleAdjustments: [
        "Longer stems with comorbidities.",
        "Management forks: labs, imaging, med selection, follow-up.",
      ],
    },
  },
  ALLIED: {
    exam: "ALLIED",
    overlays: {
      examRelevance: "Allied exams: protocol, device safety, and role-specific monitoring for cardiopulmonary patients.",
      prioritizationRules: ["Follow scope of practice for the discipline; escalate per protocol."],
      scopeDifferences: ["Varies by certification; do not assume RN scope."],
      questionStyleAdjustments: ["Equipment- and procedure-focused items common."],
    },
  },
};
