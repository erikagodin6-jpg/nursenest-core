import { CASPER_OFFICIAL_FORMAT } from "@/lib/casper/casper-test-format";

export type CasperSectionKind = "video" | "typed";

export type CasperSectionInstance = {
  key: string;
  label: string;
  kind: CasperSectionKind;
  scenarioCount: number;
  questionsPerScenario: number;
  responseTimeSeconds: number;
  breakAfter?: {
    durationMinutes: number;
    optional: boolean;
  };
};

export type CasperStationInstance = {
  id: string;
  sectionKey: string;
  sectionKind: CasperSectionKind;
  stationNumber: number;
  questionCount: number;
  responseTimeSeconds: number;
};

export type CasperFullLengthSessionPlan = {
  totalScenarios: number;
  estimatedDurationLabel: string;
  sections: CasperSectionInstance[];
  stations: CasperStationInstance[];
};

function expandStations(
  sections: CasperSectionInstance[],
): CasperStationInstance[] {
  const stations: CasperStationInstance[] = [];

  for (const section of sections) {
    for (let index = 0; index < section.scenarioCount; index += 1) {
      stations.push({
        id: `${section.key}-station-${index + 1}`,
        sectionKey: section.key,
        sectionKind: section.kind,
        stationNumber: stations.length + 1,
        questionCount: section.questionsPerScenario,
        responseTimeSeconds: section.responseTimeSeconds,
      });
    }
  }

  return stations;
}

export function buildCasperFullLengthSessionPlan(): CasperFullLengthSessionPlan {
  const sections: CasperSectionInstance[] = [
    {
      key: "video-responses",
      label: "Video responses",
      kind: "video",
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
      kind: "typed",
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
      kind: "typed",
      scenarioCount: 4,
      questionsPerScenario: 2,
      responseTimeSeconds: 210,
    },
  ];

  return {
    totalScenarios: CASPER_OFFICIAL_FORMAT.totalScenarios,
    estimatedDurationLabel:
      CASPER_OFFICIAL_FORMAT.totalDurationLabel,
    sections,
    stations: expandStations(sections),
  };
}

export function getCasperStationByNumber(
  stationNumber: number,
): CasperStationInstance | null {
  const station = buildCasperFullLengthSessionPlan().stations.find(
    (candidate) => candidate.stationNumber === stationNumber,
  );

  return station ?? null;
}
