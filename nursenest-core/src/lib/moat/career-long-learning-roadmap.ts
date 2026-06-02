export type CareerLearningStage =
  | "pre_nursing"
  | "rn_rpn"
  | "new_graduate"
  | "specialty_certification"
  | "advanced_practice"
  | "leadership"
  | "continuing_education";

export type CareerLearningRoadmapNode = Readonly<{
  stage: CareerLearningStage;
  label: string;
  focus: readonly string[];
  nextStages: readonly CareerLearningStage[];
}>;

export const CAREER_LONG_LEARNING_ROADMAP: readonly CareerLearningRoadmapNode[] = [
  {
    stage: "pre_nursing",
    label: "Pre-Nursing",
    focus: ["Foundational sciences", "terminology", "study habits"],
    nextStages: ["rn_rpn"],
  },
  {
    stage: "rn_rpn",
    label: "RN / RPN",
    focus: ["Exam readiness", "clinical judgment", "core nursing practice"],
    nextStages: ["new_graduate"],
  },
  {
    stage: "new_graduate",
    label: "New Graduate",
    focus: ["Transition to practice", "delegation", "documentation", "patient safety"],
    nextStages: ["specialty_certification", "leadership"],
  },
  {
    stage: "specialty_certification",
    label: "Specialty Certification",
    focus: ["Specialty readiness", "clinical depth", "simulation"],
    nextStages: ["advanced_practice", "leadership"],
  },
  {
    stage: "advanced_practice",
    label: "Advanced Practice",
    focus: ["Diagnostics", "prescribing safety", "advanced assessment"],
    nextStages: ["leadership", "continuing_education"],
  },
  {
    stage: "leadership",
    label: "Leadership",
    focus: ["Quality improvement", "team communication", "systems thinking"],
    nextStages: ["continuing_education"],
  },
  {
    stage: "continuing_education",
    label: "Continuing Education",
    focus: ["Maintenance", "competency growth", "career-long learning"],
    nextStages: [],
  },
];

export function nextCareerStages(stage: CareerLearningStage): readonly CareerLearningRoadmapNode[] {
  const current = CAREER_LONG_LEARNING_ROADMAP.find((node) => node.stage === stage);
  if (!current) return [];
  return current.nextStages
    .map((next) => CAREER_LONG_LEARNING_ROADMAP.find((node) => node.stage === next))
    .filter((node): node is CareerLearningRoadmapNode => Boolean(node));
}
