import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export type NursingTierHubActionId = "lessons" | "flashcards" | "practice_questions" | "exams";

export type NursingTierHubAction = {
  id: NursingTierHubActionId;
  label: string;
  description: string;
  href?: string;
  disabled?: boolean;
  disabledNote?: string;
};

export type NursingTierHubContent = {
  audienceLabel: string;
  examLabel: string;
  title: string;
  intro: string;
  description: string;
  includedNote: string;
  startHere: string;
  differenceHeading: string;
  differenceBody: string;
  actions: NursingTierHubAction[];
};

function normalizeDash(value: string): string {
  return value.replace(/\u2013|\u2014/g, "-");
}

function audienceLabelFor(pathway: ExamPathwayDefinition): string {
  switch (pathway.roleTrack) {
    case "lpn":
      return "LPN / LVN";
    case "rpn":
      return "RPN";
    case "rn":
      return "RN";
    case "np":
      return "NP";
    case "allied":
      return "Allied health";
    default:
      return pathway.shortName;
  }
}

function examLabelFor(pathway: ExamPathwayDefinition): string {
  if (pathway.roleTrack === "np") {
    return normalizeDash(pathway.boardLabel ?? pathway.shortName);
  }
  return pathway.shortName;
}

function countryLabelFor(pathway: ExamPathwayDefinition): string {
  return pathway.countrySlug === "canada" ? "Canada" : "the United States";
}

export function buildNursingTierHubContent(pathway: ExamPathwayDefinition): NursingTierHubContent {
  const audienceLabel = audienceLabelFor(pathway);
  const examLabel = examLabelFor(pathway);
  const countryLabel = countryLabelFor(pathway);

  return {
    audienceLabel,
    examLabel,
    title: `${audienceLabel} learning and exam prep`,
    intro: "Choose how you want to study today.",
    description: `This area contains ${examLabel} learning and exam-prep resources for ${audienceLabel} learners in ${countryLabel}.`,
    includedNote: `Included for this tier: ${examLabel} study resources, pathway-specific lessons, exam-style practice, and CAT readiness work for ${audienceLabel} learners in ${countryLabel}.`,
    startHere: "Start with Lessons, then move into Practice Questions and Exams as your confidence grows.",
    differenceHeading: "What is the difference?",
    differenceBody: "Use Lessons for core concepts, Flashcards for recall, Practice Questions for focused drills, and Exams for longer exam-style sessions.",
    actions: [
      {
        id: "lessons",
        label: "Lessons",
        description: "Review core concepts by topic.",
        href: buildExamPathwayPath(pathway, "lessons"),
      },
      {
        id: "flashcards",
        label: "Flashcards",
        description: "Reinforce recall and retention.",
        href: `/app/flashcards?pathwayId=${encodeURIComponent(pathway.id)}`,
      },
      {
        id: "practice_questions",
        label: "Practice Questions",
        description: "Answer questions by topic or weakness.",
        href: buildExamPathwayPath(pathway, "questions"),
      },
      {
        id: "exams",
        label: "Exams",
        description: "Take longer exam-style sessions.",
        href: buildExamPathwayPath(pathway, "cat"),
      },
    ],
  };
}
