import {
  ECG_FULL_CURRICULUM,
  getEcgCurriculumTopic,
  type EcgCurriculumTopic,
} from "@/lib/ecg-module/ecg-curriculum-config";
import type {
  EmsEcgFinding,
  EmsEcgInstabilitySignal,
  EmsEcgLeadGroup,
  EmsEcgRhythm,
  EmsEcgState,
  EmsStemiTerritory,
} from "./ecg-runtime";
import { normalizeEcgState } from "./ecg-runtime";

export type ParamedicEcgOperationalFocus =
  | "transport-decision"
  | "stemi-activation"
  | "unstable-rhythm"
  | "arrest-management"
  | "artifact-verification"
  | "medication-risk"
  | "perfusion-assessment";

export type ParamedicEcgTopicAdapter = {
  coreTopicId: string;
  emsLabel: string;
  rhythm?: EmsEcgRhythm;
  stemiTerritory?: EmsStemiTerritory;
  leadGroups?: EmsEcgLeadGroup[];
  operationalFocus: ParamedicEcgOperationalFocus[];
  defaultInstabilitySignals: EmsEcgInstabilitySignal[];
  defaultPerfusionRisk: number;
  emsTeachingFrame: string;
};

export const PARAMEDIC_ECG_TOPIC_ADAPTERS: readonly ParamedicEcgTopicAdapter[] = [
  {
    coreTopicId: "rate",
    emsLabel: "Rapid field rate estimation",
    operationalFocus: ["perfusion-assessment", "transport-decision"],
    defaultInstabilitySignals: [],
    defaultPerfusionRisk: 20,
    emsTeachingFrame:
      "Use the core ECG rate lesson to teach rapid EMS rate estimation, then anchor the decision to patient perfusion and transport urgency.",
  },
  {
    coreTopicId: "rhythm",
    emsLabel: "Monitor rhythm regularity under field conditions",
    operationalFocus: ["artifact-verification", "perfusion-assessment"],
    defaultInstabilitySignals: [],
    defaultPerfusionRisk: 25,
    emsTeachingFrame:
      "Use rhythm regularity to separate true deterioration from artifact, especially during movement, loading, and transport.",
  },
  {
    coreTopicId: "qrs",
    emsLabel: "Wide-complex rhythm recognition",
    rhythm: "wide-complex-tachycardia",
    operationalFocus: ["unstable-rhythm", "perfusion-assessment", "transport-decision"],
    defaultInstabilitySignals: ["poor-perfusion"],
    defaultPerfusionRisk: 62,
    emsTeachingFrame:
      "Use QRS width to support EMS wide-complex tachycardia decisions and default unstable wide rhythms toward VT-safe management logic.",
  },
  {
    coreTopicId: "st-t-changes",
    emsLabel: "Prehospital ST-segment change recognition",
    operationalFocus: ["stemi-activation", "transport-decision", "perfusion-assessment"],
    defaultInstabilitySignals: ["chest-pain"],
    defaultPerfusionRisk: 55,
    emsTeachingFrame:
      "Use core ST-T interpretation to drive EMS STEMI alert, repeat ECG, destination, and reassessment decisions.",
  },
  {
    coreTopicId: "torsades",
    emsLabel: "Torsades and unstable polymorphic VT",
    rhythm: "torsades",
    operationalFocus: ["unstable-rhythm", "arrest-management", "medication-risk"],
    defaultInstabilitySignals: ["syncope", "poor-perfusion", "peri-arrest"],
    defaultPerfusionRisk: 88,
    emsTeachingFrame:
      "Use the advanced ECG torsades lesson to teach EMS recognition of QT-risk deterioration and immediate unstable rhythm escalation.",
  },
  {
    coreTopicId: "paced-rhythms",
    emsLabel: "Paced rhythm malfunction in unstable patients",
    operationalFocus: ["unstable-rhythm", "perfusion-assessment", "transport-decision"],
    defaultInstabilitySignals: ["hypotension", "poor-perfusion"],
    defaultPerfusionRisk: 78,
    emsTeachingFrame:
      "Use paced-rhythm malfunction teaching to support EMS recognition of failure to capture, unstable perfusion, and rapid escalation during transport.",
  },
  {
    coreTopicId: "icu-telemetry",
    emsLabel: "Telemetry artifact vs true arrest rhythm",
    rhythm: "ventricular-fibrillation",
    operationalFocus: ["artifact-verification", "arrest-management", "perfusion-assessment"],
    defaultInstabilitySignals: ["peri-arrest"],
    defaultPerfusionRisk: 92,
    emsTeachingFrame:
      "Use critical-care telemetry pitfalls to teach EMS monitor verification: treat the patient, confirm pulse, and distinguish artifact from arrest rhythms.",
  },
];

export function getParamedicEcgAdapterForCoreTopic(coreTopicId: string): ParamedicEcgTopicAdapter | undefined {
  return PARAMEDIC_ECG_TOPIC_ADAPTERS.find((adapter) => adapter.coreTopicId === coreTopicId);
}

export function getParamedicEcgCoreTopic(coreTopicId: string): EcgCurriculumTopic | undefined {
  return getEcgCurriculumTopic(coreTopicId);
}

export function getParamedicEcgMappedTopics(): Array<{
  adapter: ParamedicEcgTopicAdapter;
  coreTopic: EcgCurriculumTopic;
}> {
  return PARAMEDIC_ECG_TOPIC_ADAPTERS.flatMap((adapter) => {
    const coreTopic = getEcgCurriculumTopic(adapter.coreTopicId);
    return coreTopic ? [{ adapter, coreTopic }] : [];
  });
}

export function buildParamedicEcgFindingFromCoreTopic(
  coreTopic: EcgCurriculumTopic,
  adapter: ParamedicEcgTopicAdapter,
): EmsEcgFinding {
  return {
    label: adapter.emsLabel,
    leadGroups: adapter.leadGroups,
    clinicalMeaning: `${coreTopic.label}: ${adapter.emsTeachingFrame}`,
    urgency: adapter.defaultPerfusionRisk >= 80 ? "critical" : adapter.defaultPerfusionRisk >= 60 ? "high" : adapter.defaultPerfusionRisk >= 35 ? "moderate" : "low",
  };
}

export function buildParamedicEcgStateFromCoreTopic(coreTopicId: string): EmsEcgState | null {
  const adapter = getParamedicEcgAdapterForCoreTopic(coreTopicId);
  const coreTopic = getEcgCurriculumTopic(coreTopicId);
  if (!adapter || !coreTopic) return null;

  return normalizeEcgState({
    rhythm: adapter.rhythm ?? "normal-sinus",
    stemiTerritory: adapter.stemiTerritory,
    findings: [buildParamedicEcgFindingFromCoreTopic(coreTopic, adapter)],
    instabilitySignals: adapter.defaultInstabilitySignals,
    perfusionRisk: adapter.defaultPerfusionRisk,
    artifactRisk: adapter.operationalFocus.includes("artifact-verification") ? 40 : 5,
    requiresImmediateAction: false,
  });
}

export function listCoreEcgTopicsNotYetMappedForParamedic(): EcgCurriculumTopic[] {
  const mapped = new Set(PARAMEDIC_ECG_TOPIC_ADAPTERS.map((adapter) => adapter.coreTopicId));
  return ECG_FULL_CURRICULUM.filter((topic) => !mapped.has(topic.id));
}

export const PARAMEDIC_ECG_ADAPTER_READINESS_PERCENT = (() => {
  const mapped = getParamedicEcgMappedTopics();
  if (!PARAMEDIC_ECG_TOPIC_ADAPTERS.length) return 0;
  const resolvedCoreTopicsScore = Math.round((mapped.length / PARAMEDIC_ECG_TOPIC_ADAPTERS.length) * 50);
  const emsContextScore = PARAMEDIC_ECG_TOPIC_ADAPTERS.every(
    (adapter) =>
      adapter.emsLabel.trim().length >= 8 &&
      adapter.emsTeachingFrame.trim().length >= 40 &&
      adapter.operationalFocus.length >= 2,
  )
    ? 50
    : 35;
  return Math.min(100, resolvedCoreTopicsScore + emsContextScore);
})();
