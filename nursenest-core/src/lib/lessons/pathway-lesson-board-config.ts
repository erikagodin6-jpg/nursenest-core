import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export type PathwayLessonBoardIconKey =
  | "activity"
  | "baby"
  | "brain"
  | "heart-pulse"
  | "message-square"
  | "pill"
  | "shield"
  | "sparkles"
  | "stethoscope"
  | "timer"
  | "users"
  | "wind";

export type PathwayLessonBoardSectionConfig = {
  id: string;
  label: string;
  icon: PathwayLessonBoardIconKey;
  accentVar: string;
  keywords: string[];
};

export type PathwayLessonBoardConfig = {
  defaultVisibleRows: number;
  sections: PathwayLessonBoardSectionConfig[];
  fallbackSectionId: string;
};

const PN_BOARD_CONFIG: PathwayLessonBoardConfig = {
  defaultVisibleRows: 5,
  fallbackSectionId: "foundations-safety",
  sections: [
    {
      id: "foundations-safety",
      label: "Foundations and safety",
      icon: "shield",
      accentVar: "--semantic-chart-3",
      keywords: [
        "fundamentals",
        "safety",
        "communication",
        "infection",
        "medication",
        "vital",
        "assessment",
        "delegation",
        "prioritization",
        "general",
      ],
    },
    {
      id: "medical-surgical-systems",
      label: "Medical-surgical systems",
      icon: "activity",
      accentVar: "--semantic-info",
      keywords: [
        "cardio",
        "respir",
        "neuro",
        "renal",
        "endocr",
        "gastro",
        "hemat",
        "musculo",
        "fluid",
        "electrolyte",
        "shock",
        "sepsis",
      ],
    },
    {
      id: "maternal-pediatrics",
      label: "Maternal and pediatrics",
      icon: "baby",
      accentVar: "--semantic-chart-5",
      keywords: ["maternal", "newborn", "pediatric", "pediatrics", "ob", "pregnan", "neonat"],
    },
  ],
};

const RN_BOARD_CONFIG: PathwayLessonBoardConfig = {
  defaultVisibleRows: 5,
  fallbackSectionId: "fundamentals-safety",
  sections: [
    {
      id: "cardiac-respiratory",
      label: "Cardiac and respiratory",
      icon: "heart-pulse",
      accentVar: "--semantic-danger",
      keywords: ["cardio", "heart", "respir", "airway", "pulmonary", "oxygen", "ventilat"],
    },
    {
      id: "neuro-emergency",
      label: "Neuro and acute response",
      icon: "brain",
      accentVar: "--semantic-chart-2",
      keywords: ["neuro", "stroke", "seizure", "mental", "rapid response", "deterior", "critical"],
    },
    {
      id: "maternal-pediatrics",
      label: "Maternal and pediatrics",
      icon: "baby",
      accentVar: "--semantic-chart-5",
      keywords: ["maternal", "newborn", "pediatric", "pediatrics", "ob", "pregnan", "neonat"],
    },
    {
      id: "medications-med-surg",
      label: "Medications and med-surg",
      icon: "pill",
      accentVar: "--semantic-brand",
      keywords: ["medication", "pharmac", "renal", "endocr", "gastro", "hemat", "musculo", "oncolog"],
    },
    {
      id: "fundamentals-safety",
      label: "Fundamentals and safety",
      icon: "stethoscope",
      accentVar: "--semantic-chart-1",
      keywords: ["fundamentals", "safety", "communication", "infection", "vital", "assessment", "delegation"],
    },
  ],
};

const NP_BOARD_CONFIG: PathwayLessonBoardConfig = {
  defaultVisibleRows: 5,
  fallbackSectionId: "core-primary-care",
  sections: [
    {
      id: "core-primary-care",
      label: "Core primary care",
      icon: "stethoscope",
      accentVar: "--semantic-chart-1",
      keywords: ["primary care", "outpatient", "screen", "adult care", "family medicine", "foundations"],
    },
    {
      id: "behavioral-health",
      label: "Behavioral health",
      icon: "brain",
      accentVar: "--semantic-chart-4",
      keywords: ["behavioral", "mental health", "psych", "insomnia", "sleep", "anxiety", "depression"],
    },
    {
      id: "women-children-family",
      label: "Women, children, and family care",
      icon: "users",
      accentVar: "--semantic-chart-5",
      keywords: ["women", "reproductive", "maternal", "pediatric", "well-child", "family", "prenatal"],
    },
    {
      id: "chronic-specialty-management",
      label: "Chronic and specialty management",
      icon: "activity",
      accentVar: "--semantic-success",
      keywords: ["diabetes", "thyroid", "obesity", "rheumat", "pneumonia", "travel medicine", "cardio", "renal"],
    },
    {
      id: "diagnostics-therapeutics",
      label: "Diagnostics and therapeutics",
      icon: "pill",
      accentVar: "--semantic-info",
      keywords: ["diagnostic", "lab", "imaging", "pharmac", "therapeutic", "treatment"],
    },
  ],
};

const ALLIED_BOARD_CONFIG: PathwayLessonBoardConfig = {
  defaultVisibleRows: 5,
  fallbackSectionId: "patient-care-safety",
  sections: [
    {
      id: "diagnostics-procedures",
      label: "Diagnostics and procedures",
      icon: "timer",
      accentVar: "--semantic-info",
      keywords: ["diagnostic", "procedure", "abg", "lab", "imaging", "specimen", "contrast", "sterile"],
    },
    {
      id: "patient-care-safety",
      label: "Patient care and safety",
      icon: "shield",
      accentVar: "--semantic-success",
      keywords: ["patient", "safety", "clinical", "airway", "mobility", "rehab", "infection"],
    },
    {
      id: "therapeutics-rehab",
      label: "Therapeutics and rehabilitation",
      icon: "wind",
      accentVar: "--semantic-chart-3",
      keywords: ["therapy", "rehab", "exercise", "respiratory", "protocol", "movement"],
    },
    {
      id: "professional-practice",
      label: "Professional practice",
      icon: "message-square",
      accentVar: "--semantic-chart-4",
      keywords: ["professional", "scope", "delegation", "licensing", "ethics", "community"],
    },
  ],
};

export function getPathwayLessonBoardConfig(pathway: Pick<ExamPathwayDefinition, "roleTrack">): PathwayLessonBoardConfig {
  if (pathway.roleTrack === "np") return NP_BOARD_CONFIG;
  if (pathway.roleTrack === "allied") return ALLIED_BOARD_CONFIG;
  if (pathway.roleTrack === "rn") return RN_BOARD_CONFIG;
  return PN_BOARD_CONFIG;
}
