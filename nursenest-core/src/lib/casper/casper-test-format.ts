export const CASPER_OFFICIAL_FORMAT = {
  sourceLabel: "Acuity Insights Casper overview",
  totalScenarios: 11,
  sections: [
    {
      key: "video-responses",
      label: "Video responses",
      scenarioCount: 4,
      questionsPerScenario: 2,
      responseTimeSeconds: 60,
      responseTimeLabel: "1 minute per recorded response",
    },
    {
      key: "typed-responses",
      label: "Typed responses",
      scenarioCount: 7,
      questionsPerScenario: 2,
      responseTimeSeconds: 210,
      responseTimeLabel: "3.5 minutes total for both typed responses",
    },
  ],
  totalDurationLabel: "65–85 minutes with optional breaks",
  breakStructure: [
    "Optional 10-minute break after the video response section",
    "Optional 5-minute break halfway through the typed response section",
  ],
  accuracyDisclaimer:
    "NurseNest is not affiliated with Acuity Insights. Casper is delivered by Acuity Insights; applicants should confirm current requirements, dates, fees, and official instructions directly with Acuity Insights and their programs.",
} as const;

export const CASPER_MINI_SIMULATION_FORMAT = {
  label: "NurseNest free mini simulation",
  totalScenarios: 5,
  sections: [
    {
      key: "typed-practice",
      label: "Typed practice",
      scenarioCount: 5,
      questionsPerScenario: 2,
      responseTimeSeconds: 210,
      responseTimeLabel: "3.5 minutes total per typed scenario, matching the typed-response pacing of Casper",
    },
  ],
  disclaimer:
    "This free mini simulation is a shortened practice experience, not a full-length official Casper test replica.",
} as const;

export function getCasperOfficialFormatSummary(): string {
  return `${CASPER_OFFICIAL_FORMAT.totalScenarios} scenarios across video and typed sections; video scenarios use two one-minute recorded responses, and typed scenarios use two questions with 3.5 minutes total.`;
}
