import { readdir, readFile, writeFile } from "node:fs/promises";
import * as path from "node:path";

import { cnplePracticalNursingNgnExpansionQuestions } from "../src/content/questions/cnple-practical-nursing-ngn-expansion";
import { nclexTier1FoundationalQuestions } from "../src/content/questions/nclex-tier1-foundational-questions";
import { nclexTier2ClinicalJudgmentQuestions } from "../src/content/questions/nclex-tier2-clinical-judgment-questions";
import { nclexTier3AdvancedReviewQuestions } from "../src/content/questions/nclex-tier3-advanced-review-questions";
import { ECG_DETERIORATION_PATHWAYS } from "../src/lib/ecg-module/ecg-deterioration-engine";
import { SIMULATION_CATALOG } from "../src/lib/physiology-monitor/simulation-catalog";

type PathwaySnapshot = Record<string, { lessons: number; questions: number }>;

type GeneratedLessonIndex = {
  pathwayId: string;
  mergedRawLessonCount: number;
  effectiveLessonCount: number;
  summaries: Array<{ id: string; slug: string; title: string; category: string; shortDescription?: string }>;
  categoryCounts: Record<string, number>;
};

type PathwayMeta = {
  country: string;
  profession: string;
  exam: string;
  tier: string;
};

type AnyQuestion = Record<string, unknown>;

const root = process.cwd();
const docsDir = path.join(root, "docs");

const rnTarget = { lessons: 500, flashcards: 10000, questions: 8000, simulations: 250 };
const pnTarget = { lessons: 300, flashcards: 5000, questions: 4000, simulations: 150 };
const npTarget = { lessons: 250, flashcards: 3000, questions: 2000 };

const highRiskTopics = [
  "Sepsis",
  "Shock",
  "ACS",
  "Stroke",
  "Respiratory Failure",
  "DKA",
  "Hyperkalemia",
  "GI Bleed",
  "Trauma",
  "Maternal Emergencies",
  "Pediatric Emergencies",
] as const;

function markdownTable(headers: string[], rows: Array<Array<string | number>>): string {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map((value) => String(value)).join(" | ")} |`),
  ].join("\n");
}

function pathwayMeta(pathwayId: string): PathwayMeta {
  const parts = pathwayId.split("-");
  const country = parts[0]?.toUpperCase() ?? "UNKNOWN";

  if (pathwayId.includes("-rn-")) {
    if (pathwayId.includes("new-grad")) return { country, profession: "RN", exam: "New Graduate RN", tier: "RN" };
    if (pathwayId.includes("nclex-rn")) return { country, profession: "RN", exam: "NCLEX-RN", tier: "RN" };
    return { country, profession: "RN", exam: pathwayId, tier: "RN" };
  }

  if (pathwayId.includes("rpn") || pathwayId.includes("lpn") || pathwayId.includes("nclex-pn") || pathwayId.includes("rex-pn")) {
    const exam = pathwayId.includes("nclex-pn") ? "NCLEX-PN" : pathwayId.includes("rex-pn") ? "REx-PN" : "PN/RPN";
    return { country, profession: pathwayId.includes("rpn") ? "RPN" : "LPN/PN", exam, tier: "PN/RPN" };
  }

  if (pathwayId.includes("-np-")) {
    const exam = pathwayId.split("-np-")[1]?.toUpperCase() ?? "NP";
    return { country, profession: "NP", exam, tier: "NP" };
  }

  if (pathwayId.includes("allied")) return { country, profession: "Allied Health", exam: "Allied Core", tier: "Allied" };

  return { country, profession: "Unclassified", exam: pathwayId, tier: "Other" };
}

function countBy<T extends string>(values: T[]): Record<T, number> {
  return values.reduce(
    (acc, value) => {
      acc[value] = (acc[value] ?? 0) + 1;
      return acc;
    },
    {} as Record<T, number>,
  );
}

function contains(value: unknown, needle: string): boolean {
  return String(value ?? "").toLowerCase().includes(needle.toLowerCase());
}

function topicMatcher(topic: string): (text: string) => boolean {
  const aliases: Record<string, string[]> = {
    Sepsis: ["sepsis", "septic"],
    Shock: ["shock"],
    ACS: ["acute coronary", "acs", "myocardial infarction", "stemi", "nstemi"],
    Stroke: ["stroke", "cva", "tia"],
    "Respiratory Failure": ["respiratory failure", "ards", "ventilat", "hypox", "copd"],
    DKA: ["dka", "diabetic ketoacidosis"],
    Hyperkalemia: ["hyperkalemia", "potassium"],
    "GI Bleed": ["gi bleed", "gastrointestinal bleed", "upper gi", "melena", "hematemesis"],
    Trauma: ["trauma", "traumatic"],
    "Maternal Emergencies": ["postpartum hemorrhage", "shoulder dystocia", "eclampsia", "maternal", "obstetric"],
    "Pediatric Emergencies": ["pediatric", "child", "infant", "newborn", "peds"],
  };
  const needles = aliases[topic] ?? [topic];
  return (text) => {
    const source = String(text ?? "").toLowerCase();
    return needles.some((needle) => {
      const normalized = needle.toLowerCase();
      if (normalized.includes(" ")) return source.includes(normalized);
      return new RegExp(`(^|[^a-z0-9])${normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`).test(source);
    });
  };
}

function questionHasRationale(question: AnyQuestion): boolean {
  const rationale = question.rationale;
  if (typeof rationale === "string") return rationale.trim().length > 0;
  if (rationale && typeof rationale === "object") return Object.keys(rationale).length > 0;
  return false;
}

function questionHasDistractorRationales(question: AnyQuestion): boolean {
  const options = Array.isArray(question.options) ? question.options : [];
  const optionRationales = options.length > 0 && options.every((option) => Boolean((option as AnyQuestion).rationale));
  const rationale = question.rationale as AnyQuestion | undefined;
  const wrongAnswers = rationale?.wrongAnswers;
  const incorrectRationales = question.incorrectRationales;
  return optionRationales || Boolean(wrongAnswers && typeof wrongAnswers === "object") || Array.isArray(incorrectRationales);
}

function questionHasHint(question: AnyQuestion): boolean {
  return Array.isArray(question.hints) ? question.hints.length > 0 : Boolean(question.hint);
}

function questionHasClinicalPearl(question: AnyQuestion): boolean {
  return Boolean(question.clinicalPearl || question.teachingPoint || question.clinicalJudgmentFocus);
}

function questionHasDifficulty(question: AnyQuestion): boolean {
  const adaptive = question.adaptiveMetadata as AnyQuestion | undefined;
  return Boolean(question.difficulty || adaptive?.difficulty);
}

function questionHasCognitiveLevel(question: AnyQuestion): boolean {
  const adaptive = question.adaptiveMetadata as AnyQuestion | undefined;
  return Boolean(question.cognitiveLevel || adaptive?.cognitiveLoad);
}

function questionHasBlueprintMapping(question: AnyQuestion): boolean {
  return Boolean(question.blueprintDomain || question.domain);
}

function questionHasTopicMapping(question: AnyQuestion): boolean {
  return Boolean(question.topic);
}

function questionHasFlashcardOutput(question: AnyQuestion): boolean {
  return Boolean(question.flashcard || question.flashcardFront || question.flashcardBack);
}

function questionText(question: AnyQuestion): string {
  return [
    question.id,
    question.exam,
    question.domain,
    question.topic,
    question.subtopic,
    question.stem,
    question.scenario,
    question.questionType,
  ]
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .join(" ");
}

function analyzeQuestions(label: string, questions: readonly AnyQuestion[]) {
  const enrichment = {
    total: questions.length,
    rationales: questions.filter(questionHasRationale).length,
    distractorRationales: questions.filter(questionHasDistractorRationales).length,
    hints: questions.filter(questionHasHint).length,
    clinicalPearls: questions.filter(questionHasClinicalPearl).length,
    memoryAnchors: questions.filter((q) => Boolean(q.memoryAnchor)).length,
    difficulty: questions.filter(questionHasDifficulty).length,
    cognitiveLevel: questions.filter(questionHasCognitiveLevel).length,
    blueprintMapping: questions.filter(questionHasBlueprintMapping).length,
    topicMapping: questions.filter(questionHasTopicMapping).length,
    flashcardOutput: questions.filter(questionHasFlashcardOutput).length,
  };

  const topics = countBy(questions.map((q) => String(q.topic ?? "Unmapped")));
  const systems = countBy(questions.map((q) => String(q.domain ?? "Unmapped")));
  const highRisk = Object.fromEntries(
    highRiskTopics.map((topic) => [topic, questions.filter((q) => topicMatcher(topic)(questionText(q))).length]),
  );

  return { label, enrichment, topics, systems, highRisk };
}

function percent(current: number, target: number): string {
  if (target <= 0) return "n/a";
  return `${Math.min(100, Math.round((current / target) * 1000) / 10)}%`;
}

function gap(current: number, target: number): number {
  return Math.max(0, target - current);
}

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

async function loadGeneratedLessonIndexes(): Promise<GeneratedLessonIndex[]> {
  const indexDir = path.join(root, "src/content/pathway-lessons/generated-indexes");
  const files = (await readdir(indexDir)).filter((file) => file.endsWith(".json") && file !== "manifest.json");
  const indexes: GeneratedLessonIndex[] = [];
  for (const file of files) {
    indexes.push(await readJson<GeneratedLessonIndex>(path.join(indexDir, file)));
  }
  return indexes.sort((a, b) => a.pathwayId.localeCompare(b.pathwayId));
}

function aggregateSnapshot(snapshot: PathwaySnapshot, tier: "RN" | "PN/RPN" | "NP") {
  const entries = Object.entries(snapshot).filter(([pathwayId]) => pathwayMeta(pathwayId).tier === tier);
  return entries.reduce(
    (acc, [, value]) => {
      acc.lessons += value.lessons;
      acc.questions += value.questions;
      return acc;
    },
    { lessons: 0, questions: 0 },
  );
}

function aggregateGeneratedIndexes(indexes: GeneratedLessonIndex[], tier: "RN" | "PN/RPN" | "NP") {
  return indexes
    .filter((index) => pathwayMeta(index.pathwayId).tier === tier)
    .reduce(
      (acc, index) => {
        acc.lessons += index.effectiveLessonCount;
        acc.clinicalSkills += index.categoryCounts["Procedures & Skills"] ?? 0;
        return acc;
      },
      { lessons: 0, clinicalSkills: 0 },
    );
}

async function main() {
  const cnpleModulePath = "../src/content/cases/cnple-case-catalog";
  const pediatricEcgModulePath = "../src/lib/ecg-module/ecg-pediatric-case-simulations";
  const cnpleCaseCatalog = await import(cnpleModulePath);
  const pediatricEcgCaseCatalog = await import(pediatricEcgModulePath);
  const cnpleLoftMetrics = cnpleCaseCatalog.CNPLE_LOFT_CASE_CATALOG_METRICS as {
    totalCases: number;
    totalSteps: number;
  };
  const pediatricEcgCases = pediatricEcgCaseCatalog.PEDIATRIC_CASE_SIMULATIONS as unknown[];

  const snapshotRaw = await readJson<Record<string, unknown>>(path.join(root, "src/config/pathway-readiness-snapshot.json"));
  const { _meta: snapshotMeta, ...snapshotEntries } = snapshotRaw;
  const snapshot = snapshotEntries as PathwaySnapshot;
  const indexes = await loadGeneratedLessonIndexes();
  const clinicalCases = await readJson<unknown[]>(path.join(root, "src/content/clinical-case-studies.json"));
  const flashcardSamples = await readJson<unknown[]>(path.join(root, "src/content/flashcard-samples.json"));

  const questionSources = [
    analyzeQuestions("NCLEX Tier 1 Foundational", nclexTier1FoundationalQuestions),
    analyzeQuestions("NCLEX Tier 2 Clinical Judgment", nclexTier2ClinicalJudgmentQuestions),
    analyzeQuestions("NCLEX Tier 3 Advanced Review", nclexTier3AdvancedReviewQuestions),
    analyzeQuestions("CNPLE/REx-PN Practical Nursing NGN", cnplePracticalNursingNgnExpansionQuestions),
  ];

  const snapshotRows = Object.entries(snapshot).map(([pathwayId, value]) => {
    const meta = pathwayMeta(pathwayId);
    return [pathwayId, meta.country, meta.profession, meta.exam, meta.tier, value.lessons, value.questions];
  });

  const generatedIndexRows = indexes.map((index) => {
    const meta = pathwayMeta(index.pathwayId);
    return [
      index.pathwayId,
      meta.country,
      meta.profession,
      meta.exam,
      index.effectiveLessonCount,
      index.categoryCounts["Procedures & Skills"] ?? 0,
      Object.keys(index.categoryCounts).length,
    ];
  });

  const generatedCategoryRows = indexes.flatMap((index) => {
    const meta = pathwayMeta(index.pathwayId);
    return Object.entries(index.categoryCounts).map(([category, count]) => [
      index.pathwayId,
      meta.country,
      meta.profession,
      meta.exam,
      category,
      count,
    ]);
  });

  const questionRows = questionSources.map((source) => [
    source.label,
    source.enrichment.total,
    source.enrichment.rationales,
    source.enrichment.distractorRationales,
    source.enrichment.hints,
    source.enrichment.clinicalPearls,
    source.enrichment.memoryAnchors,
    source.enrichment.difficulty,
    source.enrichment.cognitiveLevel,
    source.enrichment.blueprintMapping,
    source.enrichment.topicMapping,
    source.enrichment.flashcardOutput,
  ]);

  const highRiskRows = highRiskTopics.map((topic) => [
    topic,
    indexes.filter((index) => index.summaries.some((summary) => topicMatcher(topic)(`${summary.slug} ${summary.title} ${summary.shortDescription ?? ""}`))).length,
    indexes.reduce(
      (sum, index) =>
        sum +
        index.summaries.filter((summary) => topicMatcher(topic)(`${summary.slug} ${summary.title} ${summary.shortDescription ?? ""}`)).length,
      0,
    ),
    questionSources.reduce((sum, source) => sum + Number(source.highRisk[topic]), 0),
    clinicalCases.filter((item) => topicMatcher(topic)(JSON.stringify(item))).length,
    SIMULATION_CATALOG.filter((simulation) => topicMatcher(topic)(`${simulation.conditionKey} ${simulation.title} ${simulation.tags.join(" ")}`)).length,
  ]);

  const simulationByProfession = Array.from(
    SIMULATION_CATALOG.reduce((map, simulation) => {
      for (const profession of simulation.profession) {
        map.set(profession, (map.get(profession) ?? 0) + 1);
      }
      return map;
    }, new Map<string, number>()),
  ).sort((a, b) => a[0].localeCompare(b[0]));

  const simulationByCondition = Object.entries(countBy(SIMULATION_CATALOG.map((simulation) => simulation.conditionKey).sort()));

  const rnSnapshot = aggregateSnapshot(snapshot, "RN");
  const pnSnapshot = aggregateSnapshot(snapshot, "PN/RPN");
  const npSnapshot = aggregateSnapshot(snapshot, "NP");
  const rnGenerated = aggregateGeneratedIndexes(indexes, "RN");
  const pnGenerated = aggregateGeneratedIndexes(indexes, "PN/RPN");
  const npGenerated = aggregateGeneratedIndexes(indexes, "NP");

  const instrumentationReport = `# Content Instrumentation Report

Date: 2026-05-31
Status: Repository-evidenced measurement pass

This report is generated by \`scripts/content-parity-instrumentation.mts\`. It uses exact counts from committed repository files only. It does not query production databases, infer hidden content, estimate unpublished assets, or count planned roadmap targets as real inventory.

Future academies and recovered content remain locked: \`published=false\`, \`launchReady=false\`, \`visibleInNavigation=false\`, \`indexable=false\`, \`adminOnly=true\`.

## Evidence Sources

- \`src/config/pathway-readiness-snapshot.json\`
- \`src/content/pathway-lessons/generated-indexes/*.json\`
- \`src/content/questions/nclex-tier1-foundational-questions.ts\`
- \`src/content/questions/nclex-tier2-clinical-judgment-questions.ts\`
- \`src/content/questions/nclex-tier3-advanced-review-questions.ts\`
- \`src/content/questions/cnple-practical-nursing-ngn-expansion.ts\`
- \`src/content/clinical-case-studies.json\`
- \`src/content/flashcard-samples.json\`
- \`src/content/cases/cnple-case-catalog.ts\`
- \`src/lib/physiology-monitor/simulation-catalog.ts\`
- \`src/lib/ecg-module/ecg-deterioration-engine.ts\`
- \`src/lib/ecg-module/ecg-pediatric-case-simulations.ts\`

## Measurement Boundaries

- Snapshot counts are treated as the committed launch-gate source because \`pathway-readiness-snapshot.json\` explicitly gates public launch checks.
- Generated lesson indexes are counted separately because they prove additional repository lesson inventory, but they do not replace the committed launch-gate snapshot until the readiness snapshot is regenerated and approved.
- Flashcard counts are limited to \`src/content/flashcard-samples.json\`; no reliable pathway-level flashcard inventory was found in this measurement pass.
- Question enrichment counts apply only to the imported authored TypeScript question catalogs listed above.
- Clinical skill counts are measured as generated lesson index items in the \`Procedures & Skills\` category, not as a separate validated competency catalog.

## Pathway Readiness Snapshot Counts

${markdownTable(["Pathway", "Country", "Profession", "Exam", "Tier", "Lessons", "Questions"], snapshotRows)}

## Generated Lesson Index Counts

${markdownTable(["Pathway", "Country", "Profession", "Exam", "Effective Lessons", "Procedures & Skills", "Category Count"], generatedIndexRows)}

## Generated Lesson Category Counts

${markdownTable(["Pathway", "Country", "Profession", "Exam", "System / Category", "Lessons"], generatedCategoryRows)}

## Authored Question Catalog Enrichment Counts

${markdownTable(
    [
      "Question Source",
      "Total",
      "Rationales",
      "Distractor Rationales",
      "Hints",
      "Clinical Pearl Evidence",
      "Memory Anchors",
      "Difficulty",
      "Cognitive Evidence",
      "Blueprint Mapping",
      "Topic Mapping",
      "Flashcard Output",
    ],
    questionRows,
  )}

## Question System Counts By Source

${questionSources
  .map(
    (source) => `### ${source.label}

${markdownTable(["System / Domain", "Questions"], Object.entries(source.systems).sort((a, b) => a[0].localeCompare(b[0])))}
`,
  )
  .join("\n")}

## High-Risk Clinical Topic Evidence

${markdownTable(
    ["Topic", "Pathway Indexes With Lesson Evidence", "Generated Lessons", "Authored Questions", "Clinical Case JSON Items", "Simulation Catalog Items"],
    highRiskRows,
  )}

## Cases, Simulations, Flashcards, And ECG Evidence

${markdownTable(
    ["Evidence Type", "Exact Count", "Source"],
    [
      ["Clinical case JSON items", clinicalCases.length, "src/content/clinical-case-studies.json"],
      ["CNPLE LOFT cases", cnpleLoftMetrics.totalCases, "src/content/cases/cnple-case-catalog.ts"],
      ["CNPLE LOFT case steps", cnpleLoftMetrics.totalSteps, "src/content/cases/cnple-case-catalog.ts"],
      ["Physiology monitor simulations", SIMULATION_CATALOG.length, "src/lib/physiology-monitor/simulation-catalog.ts"],
      ["ECG deterioration pathways", ECG_DETERIORATION_PATHWAYS.length, "src/lib/ecg-module/ecg-deterioration-engine.ts"],
      ["Pediatric ECG case simulations", pediatricEcgCases.length, "src/lib/ecg-module/ecg-pediatric-case-simulations.ts"],
      ["Flashcard sample items", flashcardSamples.length, "src/content/flashcard-samples.json"],
    ],
  )}

## Simulation Counts By Profession

${markdownTable(["Profession", "Simulation References"], simulationByProfession)}

## Simulation Counts By Condition

${markdownTable(["Condition Key", "Simulations"], simulationByCondition)}

## Aggregate Readiness Snapshot Gaps

${markdownTable(
    ["Tier", "Snapshot Lessons", "Lesson Target", "Lesson Gap", "Snapshot Questions", "Question Target", "Question Gap"],
    [
      ["RN", rnSnapshot.lessons, rnTarget.lessons, gap(rnSnapshot.lessons, rnTarget.lessons), rnSnapshot.questions, rnTarget.questions, gap(rnSnapshot.questions, rnTarget.questions)],
      ["PN/RPN", pnSnapshot.lessons, pnTarget.lessons, gap(pnSnapshot.lessons, pnTarget.lessons), pnSnapshot.questions, pnTarget.questions, gap(pnSnapshot.questions, pnTarget.questions)],
      ["NP aggregate", npSnapshot.lessons, "250 per certification", "See per-certification report", npSnapshot.questions, "2,000 per certification", "See per-certification report"],
    ],
  )}

## Generated Lesson Index Aggregate Cross-Check

${markdownTable(
    ["Tier", "Generated Lessons", "Generated Procedures & Skills"],
    [
      ["RN", rnGenerated.lessons, rnGenerated.clinicalSkills],
      ["PN/RPN", pnGenerated.lessons, pnGenerated.clinicalSkills],
      ["NP", npGenerated.lessons, npGenerated.clinicalSkills],
    ],
  )}

## Instrumentation Findings

1. The committed readiness snapshot proves RN has ${rnSnapshot.lessons} lessons and ${rnSnapshot.questions} questions against the requested RN targets of ${rnTarget.lessons} lessons and ${rnTarget.questions} questions.
2. The committed readiness snapshot proves PN/RPN has ${pnSnapshot.lessons} lessons and ${pnSnapshot.questions} questions against the requested PN/RPN targets of ${pnTarget.lessons} lessons and ${pnTarget.questions} questions.
3. The generated lesson indexes prove additional lesson inventory, but this inventory is not yet reflected in the committed launch-gate snapshot for every pathway.
4. Repository-evidenced pathway-level flashcard counts remain insufficient for parity scoring. The only directly counted flashcard file in this pass contains ${flashcardSamples.length} sample flashcards.
5. Simulation inventory exists in authored runtime catalogs, but simulation-to-pathway parity requires a mapping layer before launch readiness can be scored.
6. Authored question catalogs include rationale, distractor rationale, hint, difficulty, cognitive, blueprint, and topic evidence, but explicit memory anchor and flashcard output fields are missing from these question shapes.
`;

  const npRows = Object.entries(snapshot)
    .filter(([pathwayId]) => pathwayMeta(pathwayId).tier === "NP")
    .map(([pathwayId, value]) => {
      const meta = pathwayMeta(pathwayId);
      return [
        pathwayId,
        meta.exam,
        value.lessons,
        npTarget.lessons,
        gap(value.lessons, npTarget.lessons),
        percent(value.lessons, npTarget.lessons),
        value.questions,
        npTarget.questions,
        gap(value.questions, npTarget.questions),
        percent(value.questions, npTarget.questions),
      ];
    });

  const recoveryReport = `# Content Parity Recovery Report

Date: 2026-05-31
Status: Recovery roadmap based on repository-evidenced counts only

Source of truth: \`docs/content-parity-audit.md\`, expanded by exact instrumentation from \`docs/content-instrumentation-report.md\`.

No public routes, learner-facing pages, navigation, sitemap entries, entitlement changes, pricing changes, or publication flags were created. Future academies remain \`published=false\`, \`launchReady=false\`, \`visibleInNavigation=false\`, \`indexable=false\`, and \`adminOnly=true\`.

## Executive Finding

The immediate parity blocker is not future academy planning. It is core RN, PN/RPN, and NP content maturity:

- RN committed snapshot gap: ${gap(rnSnapshot.lessons, rnTarget.lessons)} lessons and ${gap(rnSnapshot.questions, rnTarget.questions)} questions.
- PN/RPN committed snapshot gap: ${gap(pnSnapshot.lessons, pnTarget.lessons)} lessons and ${gap(pnSnapshot.questions, pnTarget.questions)} questions.
- NP committed snapshot gap varies by certification; CNPLE meets lesson minimum but remains short on questions, while US NP certifications are short on both lessons and questions.
- Flashcard, simulation, clinical pearl, memory anchor, and flashcard-output readiness cannot be scored as pathway-complete until instrumentation reaches the production source of truth for those asset types.

## Phase 1 - Content Instrumentation

Instrumentation was added through \`scripts/content-parity-instrumentation.mts\` and emits exact repository counts into \`docs/content-instrumentation-report.md\`.

Current exact instrumentation coverage:

${markdownTable(
    ["Asset Type", "Repository-Evidenced Status"],
    [
      ["Lessons", "Exact committed snapshot counts and exact generated-index counts"],
      ["Questions", "Exact committed snapshot counts and exact authored catalog counts for imported question files"],
      ["Cases", `${clinicalCases.length} clinical case JSON items and ${cnpleLoftMetrics.totalCases} CNPLE LOFT cases`],
      ["Simulations", `${SIMULATION_CATALOG.length} physiology monitor simulations, ${ECG_DETERIORATION_PATHWAYS.length} ECG deterioration pathways, ${pediatricEcgCases.length} pediatric ECG case simulations`],
      ["Clinical Skills", "Exact generated-index Procedures & Skills lesson category counts"],
      ["Flashcards", `${flashcardSamples.length} sample flashcards only; pathway count not reliably evidenced`],
      ["Hints", "Counted in imported authored question catalogs"],
      ["Clinical Pearls", "Counted as explicit clinicalPearl, teachingPoint, or clinicalJudgmentFocus evidence in imported question catalogs"],
      ["Rationales", "Counted in imported authored question catalogs"],
    ],
  )}

## Phase 2 - RN Content Parity

Committed readiness snapshot:

${markdownTable(
    ["Metric", "Current Exact Count", "Target", "Gap", "Readiness"],
    [
      ["Lessons", rnSnapshot.lessons, rnTarget.lessons, gap(rnSnapshot.lessons, rnTarget.lessons), percent(rnSnapshot.lessons, rnTarget.lessons)],
      ["Questions", rnSnapshot.questions, rnTarget.questions, gap(rnSnapshot.questions, rnTarget.questions), percent(rnSnapshot.questions, rnTarget.questions)],
      ["Flashcards", "Not reliably evidenced", rnTarget.flashcards, "Numeric gap blocked", "Not scoreable"],
      ["Simulations", "Pathway-mapped count not evidenced", rnTarget.simulations, "Numeric gap blocked", "Not scoreable"],
    ],
  )}

Recovery priority:

1. Expand RN questions for sepsis, shock, ACS, stroke, respiratory failure, DKA, hyperkalemia, GI bleed, maternal emergencies, and pediatric emergencies.
2. Convert high-risk RN lessons into complete loops: lesson, flashcards, questions, case, simulation, and clinical skill.
3. Add explicit memory anchor and flashcard output fields to RN question shapes before monetization scoring.
4. Regenerate the committed readiness snapshot only after source counts and review status are reconciled.

## Phase 3 - RPN / PN Parity

Committed readiness snapshot:

${markdownTable(
    ["Metric", "Current Exact Count", "Target", "Gap", "Readiness"],
    [
      ["Lessons", pnSnapshot.lessons, pnTarget.lessons, gap(pnSnapshot.lessons, pnTarget.lessons), percent(pnSnapshot.lessons, pnTarget.lessons)],
      ["Questions", pnSnapshot.questions, pnTarget.questions, gap(pnSnapshot.questions, pnTarget.questions), percent(pnSnapshot.questions, pnTarget.questions)],
      ["Flashcards", "Not reliably evidenced", pnTarget.flashcards, "Numeric gap blocked", "Not scoreable"],
      ["Simulations", "Pathway-mapped count not evidenced", pnTarget.simulations, "Numeric gap blocked", "Not scoreable"],
    ],
  )}

Recovery priority:

1. Build PN/RPN-scope questions for delegation, documentation, escalation, medication safety, and clinical judgment.
2. Keep PN/RPN content scope-safe: recognition, monitoring, reporting, safe implementation, documentation, and escalation.
3. Avoid NP diagnostic or prescribing depth in PN/RPN content.
4. Attach PN/RPN simulations to exact pathway metadata before claiming simulation parity.

## Phase 4 - NP Parity

Committed readiness snapshot by certification:

${markdownTable(
    ["Pathway", "Exam", "Lessons", "Lesson Target", "Lesson Gap", "Lesson Readiness", "Questions", "Question Target", "Question Gap", "Question Readiness"],
    npRows,
  )}

Recovery priority:

1. CNPLE should close its ${gap(snapshot["ca-np-cnple"].questions, npTarget.questions)}-question gap first because lesson coverage is already above the minimum threshold.
2. FNP, AGPCNP, PMHNP, WHNP, and PNP-PC require lesson and question expansion before commercialization.
3. NP questions must add advanced diagnostic reasoning, differential diagnosis, management planning, prescribing relevance, follow-up planning, and guideline-based clinical judgment.
4. ENP is requested in the program scope, but no committed pathway snapshot count was found in this evidence set; ENP remains unscored until a source pathway exists.

## Phase 5 - High-Risk Clinical Loop Completion

Repository-evidenced loop coverage:

${markdownTable(
    ["Topic", "Generated Lessons", "Authored Questions", "Clinical Case JSON Items", "Simulation Catalog Items", "Loop Status"],
    highRiskRows.map((row) => [row[0], row[2], row[3], row[4], row[5], "Incomplete until flashcard, case, simulation, and clinical-skill mappings are verified by pathway"]),
  )}

Recovery priority order:

1. Sepsis
2. Shock
3. ACS
4. Stroke
5. Respiratory Failure
6. DKA
7. Hyperkalemia
8. GI Bleed
9. Trauma
10. Maternal Emergencies
11. Pediatric Emergencies

This order reflects clinical risk, exam relevance, existing evidence, and reuse potential across RN, PN/RPN, NP, ECG, Labs, Pharmacology, and future CCRN/CEN products.

## Phase 6 - Simulation Expansion

Exact simulation evidence exists, but parity is blocked by pathway mapping:

${markdownTable(
    ["Simulation Evidence", "Exact Count"],
    [
      ["Physiology monitor simulations", SIMULATION_CATALOG.length],
      ["ECG deterioration pathways", ECG_DETERIORATION_PATHWAYS.length],
      ["Pediatric ECG case simulations", pediatricEcgCases.length],
    ],
  )}

Roadmap:

1. Add a simulation inventory map that records profession, country, exam, tier, system, topic, clinical judgment stage, and publication status for every simulation.
2. Map existing simulations to RN, PN/RPN, NP, ECG, Lab, and Clinical Skills loops.
3. Prioritize missing simulations for high-risk topics before future academy simulation expansion.

## Phase 7 - Professional Practice Expansion

Professional practice is a parity priority because it affects NCLEX, REx-PN, CNPLE, new graduate readiness, institutional value, and real-world safety.

${markdownTable(
    ["Domain", "Recovery Requirement"],
    [
      ["Delegation", "RN and PN/RPN scope-specific lessons, questions, cases, and simulations"],
      ["Documentation", "Charting, refusal, incident, fall, escalation, and defensible documentation loops"],
      ["Communication", "SBAR, provider calls, family communication, and interprofessional escalation scenarios"],
      ["Conflict Resolution", "Scope conflict, unsafe assignment, provider disagreement, and family escalation scenarios"],
      ["Ethics", "Consent, confidentiality, advocacy, boundary, and professional accountability cases"],
      ["Professionalism", "Longitudinal new graduate and placement readiness cases"],
      ["Leadership", "Charge nurse, prioritization, staffing, delegation, and quality-improvement cases"],
      ["Advocacy", "Patient safety, escalation refusal, and vulnerable population scenarios"],
      ["Quality Improvement", "Error reporting, risk reduction, and systems thinking cases"],
      ["Risk Management", "Near miss, medication variance, documentation risk, and escalation failure cases"],
    ],
  )}

## Phase 8 - Pharmacology Parity

The source audit records pharmacology as developing, with 20 categories and 100 medication mentions in prior evidence, but this instrumentation pass did not find a reliable pathway-level pharmacology lesson/question/flashcard count.

Recovery priority:

1. Build a pharmacology inventory registry before adding new pharmacology content.
2. Map medication classes to mechanism, indications, contraindications, monitoring, nursing implications, patient teaching, adverse effects, interactions, and clinical pearls.
3. Prioritize medication safety loops for insulin, anticoagulants, opioids, diuretics, antibiotics, cardiovascular drugs, respiratory drugs, psychiatric drugs, and emergency medications.
4. Preserve role scope: RN/PN medication administration and monitoring; NP prescribing and therapeutic decision-making.

## Phase 9 - Lab & ECG Parity

Exact evidence:

${markdownTable(
    ["Area", "Exact Evidence"],
    [
      ["ECG deterioration pathways", ECG_DETERIORATION_PATHWAYS.length],
      ["Pediatric ECG case simulations", pediatricEcgCases.length],
      ["Clinical case JSON item involving hyperkalemia/ECG", clinicalCases.filter((item) => topicMatcher("Hyperkalemia")(JSON.stringify(item))).length],
    ],
  )}

Recovery priority:

1. ECG: map deterioration pathways to RN, PN/RPN, NP, telemetry, emergency, and critical care learning loops.
2. Labs: create explicit inventory for CBC, electrolytes, renal labs, liver labs, coagulation, ABGs, cardiac markers, endocrine testing, and therapeutic drug monitoring.
3. Complete high-risk lab loops for hyperkalemia, DKA, sepsis lactate, GI bleed hemoglobin trend, AKI creatinine trend, ACS troponin, and anticoagulation monitoring.

## Phase 10 - Executive Priority Ranking

${markdownTable(
    ["Rank", "Workstream", "Why It Comes First", "Revenue Impact", "Learner Impact", "SEO Impact", "Clinical Impact", "Institutional Value"],
    [
      [1, "RN question enrichment and expansion", "Largest commercial surface and largest exact question gap", "High", "High", "High", "High", "High"],
      [2, "PN/RPN question expansion", "Large exact question gap with strong Canada/US monetization potential", "High", "High", "Medium", "High", "High"],
      [3, "NP certification parity", "Per-certification gaps block premium NP monetization", "High", "High", "Medium", "High", "Medium"],
      [4, "Simulation pathway mapping", "Simulation parity is the weakest maturity area despite existing authored simulation inventory", "Medium", "High", "Medium", "High", "High"],
      [5, "Flashcard instrumentation and regeneration", "Flashcard parity cannot be scored from current repository evidence", "High", "High", "Medium", "Medium", "Medium"],
      [6, "High-risk loop completion", "Sepsis, shock, ACS, stroke, respiratory failure, DKA, hyperkalemia, and GI bleed create cross-product value", "High", "High", "High", "High", "High"],
      [7, "Professional practice expansion", "Delegation, documentation, and communication improve exam and placement readiness", "Medium", "High", "Medium", "High", "High"],
      [8, "Pharmacology registry", "Needed before future pharmacology academy work can be evidence-based", "Medium", "High", "High", "High", "Medium"],
      [9, "Lab and ECG parity mapping", "Existing ECG assets need pathway mapping; lab activity counts need stronger instrumentation", "Medium", "High", "High", "High", "Medium"],
    ],
  )}

## Readiness Summary

${markdownTable(
    ["Area", "Current Readiness", "Target Readiness", "Gap"],
    [
      ["RN lessons", percent(rnSnapshot.lessons, rnTarget.lessons), "95%+", `${gap(rnSnapshot.lessons, rnTarget.lessons)} committed-snapshot lessons`],
      ["RN questions", percent(rnSnapshot.questions, rnTarget.questions), "95%+", `${gap(rnSnapshot.questions, rnTarget.questions)} committed-snapshot questions`],
      ["PN/RPN lessons", percent(pnSnapshot.lessons, pnTarget.lessons), "95%+", "Meets minimum count, still requires quality and loop proof"],
      ["PN/RPN questions", percent(pnSnapshot.questions, pnTarget.questions), "95%+", `${gap(pnSnapshot.questions, pnTarget.questions)} committed-snapshot questions`],
      ["NP certifications", "Mixed", "95%+", "CNPLE question gap plus US NP lesson/question gaps"],
      ["Flashcards", "Not scoreable", "95%+", "Pathway count instrumentation missing"],
      ["Simulations", "Not scoreable by pathway", "95%+", "Simulation-to-pathway mapping missing"],
      ["High-risk loops", "Incomplete", "95%+", "Flashcard, simulation, case, and clinical-skill proof missing by pathway"],
    ],
  )}

## Immediate Next Actions

1. Promote \`scripts/content-parity-instrumentation.mts\` into a CI audit command after review.
2. Add pathway-level flashcard inventory instrumentation.
3. Add simulation-to-pathway mapping instrumentation.
4. Add explicit memory anchor and flashcard output fields to question quality contracts.
5. Close RN and PN/RPN question gaps before adding future academy content.
6. Close NP per-certification gaps before launching premium NP pathways.
7. Do not begin major future academy expansion until core RN, PN/RPN, and NP parity reach 95%+ by exact repository evidence.
`;

  await writeFile(path.join(docsDir, "content-instrumentation-report.md"), instrumentationReport);
  await writeFile(path.join(docsDir, "content-parity-recovery-report.md"), recoveryReport);

  console.log("Generated docs/content-instrumentation-report.md");
  console.log("Generated docs/content-parity-recovery-report.md");
  console.log(`Snapshot meta: ${JSON.stringify(snapshotMeta)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
