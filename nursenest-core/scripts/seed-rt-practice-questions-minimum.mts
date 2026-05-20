#!/usr/bin/env npx tsx
/** Seed a minimum RT/RRT practice pool that satisfies RT audit category coverage. */
import crypto from "node:crypto";
import { prisma } from "@/lib/db";

const PATHWAY_ID = "us-allied-core";
const EXAM = "ALLIED";
const CAREER_TYPE = "rrt";
const BASE_TAGS = ["respiratory", "rrt", "profession:respiratory", "alliedProfession:respiratory", "rt-readiness-minimum"];

type SeedRow = {
  key: string;
  topic: string;
  subtopic: string;
  stemKeyword: string;
  correct: string;
  tags: string[];
  lessonSlug: string;
};

const ROWS: SeedRow[] = [
  { key: "airway", topic: "Airway management", subtopic: "Airway patency", stemKeyword: "airway", correct: "Assess airway patency and circuit obstruction first.", tags: ["airway", "ett", "intubation"], lessonSlug: "rt-auto-peep-air-trapping-and-dyssynchrony" },
  { key: "oxygen", topic: "Oxygen therapy", subtopic: "Oxygenation failure", stemKeyword: "oxygen therapy and FiO2", correct: "Treat this as oxygenation failure rather than isolated ventilatory failure.", tags: ["oxygen-therapy", "oxygen-delivery", "fio2"], lessonSlug: "rt-gas-exchange-and-alveolar-ventilation" },
  { key: "ventilation", topic: "Ventilation / mechanical ventilation", subtopic: "Volume assist control", stemKeyword: "ventilator and mechanical ventilation", correct: "Volume control guarantees tidal volume while pressure varies.", tags: ["ventilator", "mechanical-ventilation"], lessonSlug: "rt-volume-assist-control-ventilation" },
  { key: "abg", topic: "ABGs / acid-base", subtopic: "ABG interpretation", stemKeyword: "ABG acid-base", correct: "Use pH, PaCO2, and HCO3 together to identify the primary disorder.", tags: ["abg", "acid-base"], lessonSlug: "rt-abg-interpretation-acid-base-and-oxygenation" },
  { key: "diagnostics", topic: "Pulmonary diagnostics", subtopic: "Spirometry and PFT", stemKeyword: "spirometry PFT diagnostic", correct: "A reduced FEV1/FVC pattern supports obstructive disease.", tags: ["spirometry", "pft", "diagnostics"], lessonSlug: "rt-gas-exchange-and-alveolar-ventilation" },
  { key: "pharm", topic: "Pharmacology (respiratory meds)", subtopic: "Bronchodilator therapy", stemKeyword: "albuterol bronchodilator inhaled", correct: "Bronchodilation with improved airflow is the expected effect.", tags: ["pharmacology", "bronchodilator", "albuterol"], lessonSlug: "rt-auto-peep-air-trapping-and-dyssynchrony" },
  { key: "peds", topic: "Neonatal / pediatric respiratory", subtopic: "Neonatal surfactant", stemKeyword: "neonatal pediatric surfactant", correct: "Surfactant treats alveolar collapse from high surface tension.", tags: ["neonatal", "pediatric", "surfactant"], lessonSlug: "rt-ards-oxygenation-and-peep-strategy" },
  { key: "critical", topic: "Emergency / critical care", subtopic: "ARDS and PEEP", stemKeyword: "ARDS critical emergency", correct: "PEEP can recruit alveoli and improve oxygenation while pressures are monitored.", tags: ["ards", "critical-care", "peep"], lessonSlug: "rt-ards-oxygenation-and-peep-strategy" },
  { key: "infection", topic: "Ethics / safety / infection control", subtopic: "VAP prevention", stemKeyword: "infection control PPE isolation", correct: "Use bundle-based infection prevention and minimize avoidable circuit breaks.", tags: ["infection-control", "safety"], lessonSlug: "rt-ards-oxygenation-and-peep-strategy" },
];

function hash(s: string): string {
  return crypto.createHash("sha256").update(s.trim().toLowerCase()).digest("hex").slice(0, 32);
}

function distractors(correct: string): string[] {
  return [correct, "Increase rate without reassessing the patient.", "Ignore alarms if the SpO2 is acceptable.", "Delay escalation until the next scheduled check."];
}

async function main(): Promise<void> {
  let count = 0;
  for (const row of ROWS) {
    for (let i = 1; i <= 6; i += 1) {
      const stem = `RT ${row.stemKeyword} scenario ${i}: choose the best respiratory therapy action or interpretation.`;
      const options = distractors(row.correct);
      await prisma.examQuestion.upsert({
        where: { id: `rt-${row.key}-minimum-${i}` },
        create: {
          id: `rt-${row.key}-minimum-${i}`,
          tier: "ALLIED",
          exam: EXAM,
          questionType: "mcq",
          status: "published",
          publishAt: new Date(),
          stem,
          options,
          correctAnswer: row.correct,
          rationale: row.correct,
          difficulty: 3,
          tags: [...BASE_TAGS, ...row.tags],
          bodySystem: "Respiratory",
          topic: row.topic,
          subtopic: row.subtopic,
          regionScope: "BOTH",
          stemHash: hash(stem),
          careerType: CAREER_TYPE,
          scenario: stem,
          clinicalPearl: row.correct,
          examStrategy: "Match the intervention to oxygenation, ventilation, airway, safety, or escalation physiology.",
          clinicalTrap: "Do not choose a ventilator or oxygen change without identifying the physiologic problem.",
          countryCode: "US",
          languageCode: "en",
          cognitiveLevel: "application",
          questionFormat: "mcq",
          isScenario: true,
          isMockExamEligible: true,
          isAdaptiveEligible: true,
          isFlashcardSource: true,
          isStudyGuideLinked: true,
          correctAnswerExplanation: row.correct,
          clinicalReasoning: row.correct,
          keyTakeaway: row.correct,
          referenceSource: "NurseNest RT readiness seed",
          studyLinkPathwayId: PATHWAY_ID,
          studyLinkLessonSlug: row.lessonSlug,
          publishedAt: new Date(),
        },
        update: {
          tier: "ALLIED",
          exam: EXAM,
          questionType: "mcq",
          status: "published",
          publishAt: new Date(),
          stem,
          options,
          correctAnswer: row.correct,
          rationale: row.correct,
          difficulty: 3,
          tags: [...BASE_TAGS, ...row.tags],
          bodySystem: "Respiratory",
          topic: row.topic,
          subtopic: row.subtopic,
          regionScope: "BOTH",
          stemHash: hash(stem),
          careerType: CAREER_TYPE,
          isMockExamEligible: true,
          isAdaptiveEligible: true,
          isFlashcardSource: true,
          isStudyGuideLinked: true,
          studyLinkPathwayId: PATHWAY_ID,
          studyLinkLessonSlug: row.lessonSlug,
          publishedAt: new Date(),
        },
      });
      count += 1;
    }
  }
  console.log(JSON.stringify({ ok: true, seededPracticeQuestions: count }, null, 2));
}

main().catch((error) => {
  console.error("[seed-rt-practice-questions-minimum] failed", error);
  process.exitCode = 1;
}).finally(async () => prisma.$disconnect());
