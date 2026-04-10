import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export type NursingTierHubActionId = "lessons" | "practice" | "cat";

export type NursingTierHubAction = {
  id: NursingTierHubActionId;
  label: string;
  description: string;
  href: string;
  recommended?: boolean;
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
    intro: `Choose how you want to study for ${audienceLabel} in ${countryLabel}.`,
    description: `This area contains ${examLabel} learning and exam-prep resources, with clear paths into lessons, practice questions, and CAT exam simulation.`,
    includedNote: `Included for this tier: ${examLabel} study resources, pathway-specific lessons, exam-style practice, and CAT readiness work for ${audienceLabel} learners in ${countryLabel}.`,
    startHere: "Start with Lessons if you are new to the material, then move into Practice and CAT Exams as your accuracy and speed improve.",
    differenceHeading: "What is the difference?",
    differenceBody: "Choose Lessons for teaching, Practice for question drilling with rationales, and CAT Exams for adaptive exam simulation.",
    actions: [
      {
        id: "lessons",
        label: "Lessons",
        description: "Learn the concepts and review core exam topics.",
        href: buildExamPathwayPath(pathway, "lessons"),
        recommended: true,
      },
      {
        id: "practice",
        label: "Practice",
        description: "Answer exam-style questions and study rationales.",
        href: buildExamPathwayPath(pathway, "questions"),
      },
      {
        id: "cat",
        label: "CAT Exams",
        description: "Take adaptive exam simulations to check readiness.",
        href: buildExamPathwayPath(pathway, "cat"),
      },
    ],
  };
}
