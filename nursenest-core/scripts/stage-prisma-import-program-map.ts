export type StagePrismaImportProgramConfig = {
  pathwayId: string;
  exam: string;
  tierCode: "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED" | null;
  questionTier: string;
  countryCode: null | "US" | "CA";
  programs: string[];
};

export const STAGE_PRISMA_IMPORT_PROGRAM_MAP: Record<string, StagePrismaImportProgramConfig> = {
  np: {
    pathwayId: "us-np-fnp",
    exam: "AANP-FNP",
    tierCode: "NP",
    questionTier: "premium",
    countryCode: null,
    programs: ["np"],
  },
  "pre-nursing": {
    pathwayId: "pre-nursing",
    exam: "",
    tierCode: null,
    questionTier: "basic",
    countryCode: null,
    programs: ["pre-nursing"],
  },
  "foundations-pilot": {
    pathwayId: "pre-nursing",
    exam: "",
    tierCode: null,
    questionTier: "basic",
    countryCode: null,
    programs: ["pre-nursing"],
  },
};
