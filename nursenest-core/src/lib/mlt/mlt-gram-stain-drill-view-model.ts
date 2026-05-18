import { mltGramStainReference, type MltGramStainReference } from "@/content/morphology/mlt-gram-stain-reference";

export type MltGramStainDrillDifficulty = "intro" | "core" | "exam";

export interface MltGramStainDrillCard {
  id: string;
  prompt: string;
  answer: string;
  pattern: string;
  morphology: string;
  arrangement: string;
  difficulty: MltGramStainDrillDifficulty;
  commonOrganismGroups: string[];
  specimenContext: string[];
  differentialPatterns: string[];
  workflowImplications: string[];
  escalationTriggers: string[];
  gramStainTags: string[];
}

export interface MltGramStainComparisonCard {
  id: string;
  primaryPattern: string;
  compareWith: string[];
  sourceContext: string[];
  teachingPoint: string;
  escalationTriggers: string[];
}

export interface MltGramStainDrillViewModel {
  domain: "gram-stain-morphology";
  totalCards: number;
  drillCards: MltGramStainDrillCard[];
  comparisonCards: MltGramStainComparisonCard[];
  sterileSiteEscalationCount: number;
}

function difficultyForGramStain(entry: MltGramStainReference): MltGramStainDrillDifficulty {
  const combined = [entry.specimenContext.join(" "), entry.escalationTriggers.join(" "), entry.workflowImplications.join(" ")]
    .join(" ")
    .toLowerCase();

  if (/blood culture|sterile|sepsis|bacteremia|critical|immunocompromised/.test(combined)) return "exam";
  if (entry.differentialPatterns.length >= 2 || entry.commonOrganismGroups.length >= 2) return "core";
  return "intro";
}

function buildPrompt(entry: MltGramStainReference): string {
  return `Interpret the Gram stain pattern and identify the next workflow concern: ${entry.description}`;
}

function buildTeachingPoint(entry: MltGramStainReference): string {
  return `${entry.pattern} often suggests ${entry.commonOrganismGroups.slice(0, 3).join(", ")} depending on specimen source. Compare with ${entry.differentialPatterns.join(", ")} and prioritize ${entry.workflowImplications.slice(0, 2).join(" and ")}.`;
}

export function buildMltGramStainDrillViewModel(
  entries: MltGramStainReference[] = mltGramStainReference,
): MltGramStainDrillViewModel {
  const drillCards = entries.map<MltGramStainDrillCard>((entry) => ({
    id: entry.id,
    prompt: buildPrompt(entry),
    answer: entry.pattern,
    pattern: entry.pattern,
    morphology: entry.morphology,
    arrangement: entry.arrangement,
    difficulty: difficultyForGramStain(entry),
    commonOrganismGroups: entry.commonOrganismGroups,
    specimenContext: entry.specimenContext,
    differentialPatterns: entry.differentialPatterns,
    workflowImplications: entry.workflowImplications,
    escalationTriggers: entry.escalationTriggers,
    gramStainTags: entry.gramStainTags,
  }));

  const comparisonCards = entries.map<MltGramStainComparisonCard>((entry) => ({
    id: `${entry.id}-comparison`,
    primaryPattern: entry.pattern,
    compareWith: entry.differentialPatterns,
    sourceContext: entry.specimenContext,
    teachingPoint: buildTeachingPoint(entry),
    escalationTriggers: entry.escalationTriggers,
  }));

  return {
    domain: "gram-stain-morphology",
    totalCards: drillCards.length,
    drillCards,
    comparisonCards,
    sterileSiteEscalationCount: entries.filter((entry) =>
      [entry.specimenContext.join(" "), entry.escalationTriggers.join(" ")].join(" ").match(/blood culture|sterile|bacteremia|sepsis/i),
    ).length,
  };
}
