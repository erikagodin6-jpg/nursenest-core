import { mltRbcMorphologyReference, type MltRbcMorphologyReference } from "@/content/morphology/mlt-rbc-morphology-reference";

export type MltMorphologyDrillDifficulty = "intro" | "core" | "exam";

export interface MltMorphologyDrillCard {
  id: string;
  prompt: string;
  answer: string;
  aliases: string[];
  difficulty: MltMorphologyDrillDifficulty;
  associatedConditions: string[];
  differentialMorphologies: string[];
  clinicalMeaning: string;
  workflowImplications: string[];
  escalationTriggers: string[];
  morphologyTags: string[];
}

export interface MltMorphologyComparisonCard {
  id: string;
  primaryMorphology: string;
  compareWith: string[];
  teachingPoint: string;
  escalationTriggers: string[];
}

export interface MltMorphologyDrillViewModel {
  domain: "rbc-morphology";
  totalCards: number;
  drillCards: MltMorphologyDrillCard[];
  comparisonCards: MltMorphologyComparisonCard[];
  highEscalationCount: number;
}

function difficultyForMorphology(entry: MltRbcMorphologyReference): MltMorphologyDrillDifficulty {
  const escalationText = entry.escalationTriggers.join(" ").toLowerCase();
  if (/critical|dic|ttp|severe|crisis|acute/.test(escalationText)) return "exam";
  if (entry.differentialMorphologies.length >= 2 || entry.associatedConditions.length >= 3) return "core";
  return "intro";
}

function buildPrompt(entry: MltRbcMorphologyReference): string {
  return `Identify the RBC morphology and state one workflow implication: ${entry.description}`;
}

function buildTeachingPoint(entry: MltRbcMorphologyReference): string {
  return `${entry.morphology} is commonly associated with ${entry.associatedConditions.slice(0, 3).join(", ")}. Distinguish it from ${entry.differentialMorphologies.join(", ")} before escalating or documenting morphology findings.`;
}

export function buildMltMorphologyDrillViewModel(
  entries: MltRbcMorphologyReference[] = mltRbcMorphologyReference,
): MltMorphologyDrillViewModel {
  const drillCards = entries.map<MltMorphologyDrillCard>((entry) => ({
    id: entry.id,
    prompt: buildPrompt(entry),
    answer: entry.morphology,
    aliases: entry.aliases,
    difficulty: difficultyForMorphology(entry),
    associatedConditions: entry.associatedConditions,
    differentialMorphologies: entry.differentialMorphologies,
    clinicalMeaning: entry.clinicalMeaning,
    workflowImplications: entry.workflowImplications,
    escalationTriggers: entry.escalationTriggers,
    morphologyTags: entry.morphologyTags,
  }));

  const comparisonCards = entries.map<MltMorphologyComparisonCard>((entry) => ({
    id: `${entry.id}-comparison`,
    primaryMorphology: entry.morphology,
    compareWith: entry.differentialMorphologies,
    teachingPoint: buildTeachingPoint(entry),
    escalationTriggers: entry.escalationTriggers,
  }));

  return {
    domain: "rbc-morphology",
    totalCards: drillCards.length,
    drillCards,
    comparisonCards,
    highEscalationCount: entries.filter((entry) => entry.escalationTriggers.length > 0).length,
  };
}
