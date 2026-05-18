import { CASPER_OFFICIAL_FORMAT } from "@/lib/casper/casper-test-format";

export type CasperSectionInstance = {
  key: string;
  label: string;
  scenarioCount: number;
  questionsPerScenario: number;
  responseTimeSeconds: number;
  breakAfter?: {
    durationMinutes: number;
    optional: boolean;
  };
};

export type CasperFullLengthSessionPlan = {
  totalScenarios: number;
  estimatedDurationLabel: string;
  sections: CasperSectionInstance[];
};

export function buildCasperFullLengthSessionPlan(): CasperFullLengthSessionPlan {
  return {
    totalScenarios: CASPER_OFFICIAL_FORMAT.totalScenarios,
    estimatedDurationLabel:
      CASPER_OFFICIAL_FORMAT.totalDurationLabel,
    sections: [
      {
        key: "video-responses",
        label: "Video responses",
        scenarioCount: 4,
        questionsPerScenario: 2,
        responseTimeSeconds: 60,
        breakAfter: {
          durationMinutes: 10,
          optional: true,
        },
      },
      {
        key: "typed-responses-a",
        label: "Typed responses — first half",
        scenarioCount: 3,
        questionsPerScenario: 2,
        responseTimeSeconds: 210,
        breakAfter: {
          durationMinutes: 5,
          optional: true,
        },
      },
      {
        key: "typed-responses-b",
        label: "Typed responses — second half",
        scenarioCount: 4,
        questionsPerScenario: 2,
        responseTimeSeconds: 210,
      },
    ],
  };
}
