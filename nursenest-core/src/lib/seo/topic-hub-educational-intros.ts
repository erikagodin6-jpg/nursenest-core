import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";

export type TopicHubEducationalIntro = {
  /** Display title for the competency cluster */
  title: string;
  /** 2–4 short paragraphs, each under ~90 words */
  paragraphs: readonly string[];
};

const INTROS: Record<string, TopicHubEducationalIntro> = {
  "heart-failure": {
    title: "Heart failure",
    paragraphs: [
      "Heart failure is a high-yield competency cluster because exams test preload, afterload, perfusion, and medication safety together—not isolated definitions. Learners should connect symptoms, hemodynamics, daily weights, and diuretic response before choosing interventions.",
      "On NurseNest, study heart failure as a topic ecosystem: foundational lessons, mechanism explainers, flashcards, and pathway-scoped practice questions reinforce the same clinical reasoning path.",
    ],
  },
  sepsis: {
    title: "Sepsis",
    paragraphs: [
      "Sepsis items reward early recognition, source control thinking, fluid resuscitation boundaries, and vasopressor escalation—not generic infection knowledge. Time-sensitive assessment and reassessment dominate safe nursing judgment.",
      "Use this topic filter to move from recognition cues into targeted lessons, labs interpretation, and timed practice that mirrors deteriorating-patient stems.",
    ],
  },
  "diabetic-ketoacidosis": {
    title: "Diabetic ketoacidosis (DKA)",
    paragraphs: [
      "DKA stems combine acid-base physiology, fluid shifts, insulin protocols, and potassium safety. A common trap is treating the glucose number without addressing dehydration, ketosis, and electrolyte timing.",
      "Cluster lessons here with mechanism explainers on osmotic diuresis and Kussmaul breathing, then validate judgment with pathway practice questions.",
    ],
  },
  dka: {
    title: "Diabetic ketoacidosis (DKA)",
    paragraphs: [
      "DKA stems combine acid-base physiology, fluid shifts, insulin protocols, and potassium safety. A common trap is treating the glucose number without addressing dehydration, ketosis, and electrolyte timing.",
      "Cluster lessons here with mechanism explainers on osmotic diuresis and Kussmaul breathing, then validate judgment with pathway practice questions.",
    ],
  },
  copd: {
    title: "COPD",
    paragraphs: [
      "COPD care requires chronic versus acute exacerbation framing, CO₂ retention risk, oxygen titration judgment, and bronchodilator sequencing. Exams often pair gas exchange with priority actions.",
      "Study COPD as a connected topic: airway lessons, respiratory interpretation, and practice items that stress safe oxygen and ventilation decisions.",
    ],
  },
  stroke: {
    title: "Stroke",
    paragraphs: [
      "Stroke competency spans time-critical assessment, neuro checks, perfusion goals, and hemorrhagic versus ischemic safety. Priority stems frequently test what the nurse does first while awaiting imaging.",
      "Use sibling lessons in this topic to build a consistent neuro-emergency sequence before moving to full-length adaptive exams.",
    ],
  },
  delegation: {
    title: "Delegation & supervision",
    paragraphs: [
      "Delegation items test scope, stability, competency, and five rights of delegation—not task lists. The unsafe answer often sounds efficient but violates supervision or client acuity.",
      "Pair delegation lessons with prioritization practice so learners separate \"who can perform\" from \"what must be done first.\"",
    ],
  },
  prioritization: {
    title: "Prioritization",
    paragraphs: [
      "Prioritization is the backbone of NCLEX-style judgment: airway, breathing, circulation, then risk to life or limb. Stable tasks should not outrank unstable patients.",
      "This topic hub groups lessons and drills that train ordering under pressure, including SATA-style multi-select reasoning.",
    ],
  },
  anticoagulation: {
    title: "Anticoagulation safety",
    paragraphs: [
      "Anticoagulation questions hinge on bleeding risk, reversal awareness, monitoring, and patient teaching—not drug trivia alone. Labs, procedures, and falls risk change the safest action.",
      "Study anticoagulation alongside related cardiovascular and hematology topics, then confirm judgment with focused question sets.",
    ],
  },
  siadh: {
    title: "SIADH & fluid regulation",
    paragraphs: [
      "SIADH and diabetes insipidus contrasts are classic fluid/electrolyte traps: urine output, sodium trends, and volume status must align. Memorizing labels without assessment patterns fails on exams.",
      "Link SIADH lessons to mechanism explainers and lab interpretation practice for sodium and fluid priorities.",
    ],
  },
  "abg-interpretation": {
    title: "ABG interpretation",
    paragraphs: [
      "ABG interpretation is a stepwise competency: pH, primary disorder, compensation, then oxygenation. Nurses are tested on what the gas pattern means for monitoring and escalation—not on math alone.",
      "Use this filter to connect acid-base lessons, clinical interpretation guides, and practice questions that reinforce systematic reading of results.",
    ],
  },
};

export function topicHubEducationalIntro(topicSlug: string): TopicHubEducationalIntro | null {
  const key = topicSlug.trim().toLowerCase();
  return INTROS[key] ?? null;
}

export function topicHubEducationalIntroLinks(pathway: ExamPathwayDefinition, topicSlug: string) {
  const examName = pathwayRegionAwareExamName(pathway);
  const topicKey = topicSlug.trim().toLowerCase();
  const lessonsHub = marketingPathwayLessonsIndexPath(pathway);
  return {
    lessonsHub: `${lessonsHub}?topicSlug=${encodeURIComponent(topicKey)}`,
    questions: `${buildExamPathwayPath(pathway, "questions")}?topic=${encodeURIComponent(topicKey)}`,
    flashcards: `/flashcards/${encodeURIComponent(topicKey)}`,
    examName,
  };
}
