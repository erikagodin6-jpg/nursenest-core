#!/usr/bin/env tsx
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { ALLIED_READINESS_MANIFEST } from "../src/lib/allied/allied-readiness-manifest";
import { ALLIED_MASTERY_MODULES } from "../src/lib/allied/allied-mastery-modules";
import {
  buildAlliedQuestionModalityAuditReport,
  type AlliedModuleQuestionAudit,
} from "../src/lib/allied/allied-question-modality-audit";
import { ALLIED_PROFESSION_DEDICATED_CATALOGS } from "../src/content/pathway-lessons/allied-professions/registry";

type AlliedParityProfessionId =
  | "respiratory"
  | "paramedic"
  | "mlt"
  | "physiotherapy"
  | "occupational-therapy"
  | "psw-hca"
  | "social-work"
  | "psychotherapy";

type AlliedParityTarget = {
  id: AlliedParityProfessionId;
  label: string;
  catalogFiles: string[];
  moduleProfessionKeys: string[];
  targets: {
    lessons: number;
    flashcards: number;
    questions: number;
    simulations: number;
  };
  readinessDomains: string[];
  simulationPriorities: string[];
  seoOpportunity: "very_high" | "high" | "medium";
  institutionalValue: "very_high" | "high" | "medium";
};

type AlliedParityRow = {
  target: AlliedParityTarget;
  current: {
    lessons: number;
    flashcards: number;
    questions: number;
    cases: number;
    simulations: number;
    clinicalSkills: number;
    analytics: number;
    readinessDomains: number;
  };
  percent: {
    coverage: number;
    depth: number;
    reasoning: number;
    simulation: number;
    readiness: number;
    quality: number;
    overall: number;
  };
  gaps: {
    lessons: number;
    flashcards: number;
    questions: number;
    simulations: number;
  };
  blockers: string[];
  priorityScore: number;
  estimatedEffort: string;
};

const TARGETS: AlliedParityTarget[] = [
  {
    id: "respiratory",
    label: "Respiratory Therapy",
    catalogFiles: ["respiratory-therapy", "respiratory-therapy-floor-practice"],
    moduleProfessionKeys: ["respiratory"],
    targets: { lessons: 300, flashcards: 3000, questions: 2500, simulations: 100 },
    readinessDomains: ["Airway readiness", "Ventilation readiness", "ABG readiness", "Oxygenation readiness", "Escalation readiness"],
    simulationPriorities: ["ABGs", "Ventilators", "Respiratory failure", "Airway emergencies"],
    seoOpportunity: "very_high",
    institutionalValue: "very_high",
  },
  {
    id: "paramedic",
    label: "Paramedicine",
    catalogFiles: ["emergency-medical-services"],
    moduleProfessionKeys: ["paramedic"],
    targets: { lessons: 300, flashcards: 3000, questions: 2500, simulations: 100 },
    readinessDomains: ["Scene readiness", "Trauma readiness", "Emergency readiness", "Transport readiness", "Escalation readiness"],
    simulationPriorities: ["Trauma", "Cardiac arrest", "Stroke", "Sepsis", "Scene safety"],
    seoOpportunity: "very_high",
    institutionalValue: "very_high",
  },
  {
    id: "mlt",
    label: "Medical Laboratory Technology",
    catalogFiles: ["medical-laboratory-technology"],
    moduleProfessionKeys: ["mlt"],
    targets: { lessons: 300, flashcards: 3000, questions: 2500, simulations: 100 },
    readinessDomains: ["Lab quality readiness", "Critical value readiness", "Specimen integrity readiness", "Quality control readiness"],
    simulationPriorities: ["Critical values", "Specimen issues", "Quality control", "Result escalation"],
    seoOpportunity: "high",
    institutionalValue: "high",
  },
  {
    id: "physiotherapy",
    label: "Physiotherapy",
    catalogFiles: ["physiotherapy-rehab"],
    moduleProfessionKeys: ["pta"],
    targets: { lessons: 250, flashcards: 2500, questions: 2000, simulations: 75 },
    readinessDomains: ["Mobility readiness", "Falls readiness", "Rehabilitation progression readiness", "Safety readiness"],
    simulationPriorities: ["Mobility", "Falls", "Rehabilitation"],
    seoOpportunity: "high",
    institutionalValue: "high",
  },
  {
    id: "occupational-therapy",
    label: "Occupational Therapy",
    catalogFiles: ["occupational-therapy"],
    moduleProfessionKeys: ["ota"],
    targets: { lessons: 250, flashcards: 2500, questions: 2000, simulations: 75 },
    readinessDomains: ["Functional independence readiness", "ADL readiness", "Discharge planning readiness", "Home safety readiness"],
    simulationPriorities: ["Functional assessment", "Discharge planning"],
    seoOpportunity: "high",
    institutionalValue: "high",
  },
  {
    id: "psw-hca",
    label: "PSW",
    catalogFiles: [],
    moduleProfessionKeys: [],
    targets: { lessons: 200, flashcards: 2000, questions: 1500, simulations: 50 },
    readinessDomains: ["Personal care readiness", "Mobility assistance readiness", "Reporting readiness", "Safety monitoring readiness"],
    simulationPriorities: ["Mobility assistance", "Dementia care", "Falls prevention", "Reporting changes"],
    seoOpportunity: "medium",
    institutionalValue: "high",
  },
  {
    id: "social-work",
    label: "Social Work",
    catalogFiles: ["mental-health-social-work"],
    moduleProfessionKeys: [],
    targets: { lessons: 250, flashcards: 2500, questions: 2000, simulations: 75 },
    readinessDomains: ["Risk assessment readiness", "Advocacy readiness", "Case management readiness", "Mandatory reporting readiness"],
    simulationPriorities: ["Risk escalation", "Discharge barriers", "Resource navigation", "Family conflict"],
    seoOpportunity: "medium",
    institutionalValue: "high",
  },
  {
    id: "psychotherapy",
    label: "Psychotherapy",
    catalogFiles: ["mental-health-social-work"],
    moduleProfessionKeys: [],
    targets: { lessons: 250, flashcards: 2500, questions: 2000, simulations: 75 },
    readinessDomains: ["Therapeutic alliance readiness", "Risk assessment readiness", "Boundary readiness", "Crisis response readiness"],
    simulationPriorities: ["Suicide risk", "Therapeutic boundaries", "Trauma-informed response", "Crisis de-escalation"],
    seoOpportunity: "medium",
    institutionalValue: "medium",
  },
];

function mdTable(rows: string[][]): string[] {
  if (rows.length === 0) return [];
  const header = rows[0]!;
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.slice(1).map((row) => `| ${row.map((cell) => cell.replace(/\|/g, "\\|").replace(/\n/g, "<br>")).join(" | ")} |`),
  ];
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Number(value.toFixed(1))));
}

function percent(current: number, target: number): number {
  return clamp((current / Math.max(1, target)) * 100);
}

function catalogLessonCount(catalogFiles: string[]): number {
  return catalogFiles.reduce((sum, file) => {
    const catalog = ALLIED_PROFESSION_DEDICATED_CATALOGS[file] as { lessons?: unknown[] } | undefined;
    return sum + (catalog?.lessons?.length ?? 0);
  }, 0);
}

function moduleAuditsFor(target: AlliedParityTarget, audits: AlliedModuleQuestionAudit[]): AlliedModuleQuestionAudit[] {
  return audits.filter((audit) => target.moduleProfessionKeys.includes(audit.professionKey));
}

function readinessManifestPercent(target: AlliedParityTarget): number {
  return ALLIED_READINESS_MANIFEST.find((entry) => entry.professionKey === target.id)?.percentComplete ?? 0;
}

function buildRows(): AlliedParityRow[] {
  const questionAudit = buildAlliedQuestionModalityAuditReport();
  return TARGETS.map((target) => {
    const modules = ALLIED_MASTERY_MODULES.filter((module) => target.moduleProfessionKeys.some((key) => module.professionKeys.includes(key)));
    const moduleAudits = moduleAuditsFor(target, questionAudit.modules);
    const questionCount = moduleAudits.reduce((sum, audit) => sum + audit.questionCount, 0);
    const caseCount = modules.filter((module) => module.contentTypes.includes("case_scenarios")).length;
    const simulationCount = modules.filter((module) => module.contentTypes.includes("clinical_action_layer") || module.contentTypes.includes("case_scenarios")).length;
    const clinicalSkills = modules.filter((module) => /skill|assessment|airway|ventilator|mobility|functional|trauma|specimen|lab/i.test(`${module.title} ${module.tags.join(" ")}`)).length;
    const analytics = modules.filter((module) => module.contentTypes.includes("clinical_action_layer")).length;
    const quality = moduleAudits.length
      ? clamp(moduleAudits.reduce((sum, audit) => sum + audit.modalityCompliancePct, 0) / moduleAudits.length)
      : readinessManifestPercent(target) > 0
        ? Math.min(65, readinessManifestPercent(target))
        : 0;
    const readiness = target.readinessDomains.length ? clamp((analytics / target.readinessDomains.length) * 100) : 0;
    const current = {
      lessons: catalogLessonCount(target.catalogFiles),
      flashcards: 0,
      questions: questionCount,
      cases: caseCount,
      simulations: simulationCount,
      clinicalSkills,
      analytics,
      readinessDomains: Math.min(target.readinessDomains.length, analytics),
    };
    const coverage = clamp(
      percent(current.lessons, target.targets.lessons) * 0.35 +
        percent(current.questions, target.targets.questions) * 0.35 +
        percent(current.flashcards, target.targets.flashcards) * 0.15 +
        percent(current.simulations, target.targets.simulations) * 0.15,
    );
    const depth = clamp(percent(current.lessons, target.targets.lessons) * 0.5 + percent(current.cases, Math.max(25, target.targets.simulations / 2)) * 0.25 + quality * 0.25);
    const reasoning = clamp((current.cases > 0 ? 35 : 0) + (current.analytics > 0 ? 30 : 0) + quality * 0.35);
    const simulation = percent(current.simulations, target.targets.simulations);
    const overall = clamp(coverage * 0.25 + depth * 0.18 + reasoning * 0.18 + simulation * 0.14 + readiness * 0.13 + quality * 0.12);
    const gaps = {
      lessons: Math.max(0, target.targets.lessons - current.lessons),
      flashcards: Math.max(0, target.targets.flashcards - current.flashcards),
      questions: Math.max(0, target.targets.questions - current.questions),
      simulations: Math.max(0, target.targets.simulations - current.simulations),
    };
    const blockers = [
      gaps.lessons > 0 ? `Needs ${gaps.lessons} lessons` : "",
      gaps.flashcards > 0 ? `Needs ${gaps.flashcards} flashcards` : "",
      gaps.questions > 0 ? `Needs ${gaps.questions} questions` : "",
      gaps.simulations > 0 ? `Needs ${gaps.simulations} simulations` : "",
      quality < 90 ? `Quality parity ${quality}% below 90%` : "",
      readiness < 90 ? `Readiness domains ${readiness}% below 90%` : "",
    ].filter(Boolean);
    const value = (target.seoOpportunity === "very_high" ? 20 : target.seoOpportunity === "high" ? 16 : 10) +
      (target.institutionalValue === "very_high" ? 20 : target.institutionalValue === "high" ? 16 : 10);
    const strategicPriority = target.id === "respiratory" || target.id === "paramedic" ? 20 : target.id === "mlt" ? 18 : target.id === "physiotherapy" || target.id === "occupational-therapy" ? 8 : 0;
    return {
      target,
      current,
      percent: {
        coverage,
        depth,
        reasoning,
        simulation,
        readiness,
        quality,
        overall,
      },
      gaps,
      blockers,
      priorityScore: clamp(value + strategicPriority + overall * 0.45 + readiness * 0.1 + simulation * 0.05),
      estimatedEffort: effortFor(gaps),
    };
  });
}

function effortFor(gaps: AlliedParityRow["gaps"]): string {
  const points = gaps.lessons * 1 + gaps.flashcards * 0.08 + gaps.questions * 0.25 + gaps.simulations * 3;
  if (points > 1200) return "Very high";
  if (points > 700) return "High";
  if (points > 350) return "Medium";
  return "Focused";
}

function pct(value: number): string {
  return `${value}%`;
}

function readinessAudit(rows: AlliedParityRow[], generatedAt: string): string {
  return [
    "# Allied Profession Readiness Audit",
    "",
    `Generated: ${generatedAt}`,
    "",
    "Scope: Respiratory Therapy, Paramedicine, Medical Laboratory Technology, Occupational Therapy, Physiotherapy, PSW, Social Work, and Psychotherapy. This report is per-profession and does not use aggregate Allied counts.",
    "",
    "No public routes, homepage changes, navigation changes, or learner-facing surfaces were created.",
    "",
    ...mdTable([
      ["Profession", "Lessons", "Flashcards", "Questions", "Cases", "Simulations", "Readiness Domains", "Clinical Skills", "Analytics", "Current %", "Target %", "Gap %"],
      ...rows.map((row) => [
        row.target.label,
        String(row.current.lessons),
        String(row.current.flashcards),
        String(row.current.questions),
        String(row.current.cases),
        String(row.current.simulations),
        `${row.current.readinessDomains}/${row.target.readinessDomains.length}`,
        String(row.current.clinicalSkills),
        String(row.current.analytics),
        pct(row.percent.overall),
        "90%",
        pct(clamp(90 - row.percent.overall)),
      ]),
    ]),
    "",
  ].join("\n");
}

function launchThresholds(rows: AlliedParityRow[], generatedAt: string): string {
  return [
    "# Allied Launch Thresholds",
    "",
    `Generated: ${generatedAt}`,
    "",
    "Minimum launch targets are profession-specific. Commercial launch remains blocked until Coverage >=90%, Depth >=90%, Reasoning >=90%, Simulation >=85%, Readiness >=90%, and Quality >=90%.",
    "",
    ...mdTable([
      ["Profession", "Lesson Target", "Flashcard Target", "Question Target", "Simulation Target", "Current Lesson Gap", "Current Flashcard Gap", "Current Question Gap", "Current Simulation Gap"],
      ...rows.map((row) => [
        row.target.label,
        String(row.target.targets.lessons),
        String(row.target.targets.flashcards),
        String(row.target.targets.questions),
        String(row.target.targets.simulations),
        String(row.gaps.lessons),
        String(row.gaps.flashcards),
        String(row.gaps.questions),
        String(row.gaps.simulations),
      ]),
    ]),
    "",
  ].join("\n");
}

function questionRoadmap(rows: AlliedParityRow[], generatedAt: string): string {
  const priority = rows.filter((row) => ["respiratory", "paramedic", "mlt"].includes(row.target.id));
  return [
    "# Allied Question Expansion Roadmap",
    "",
    `Generated: ${generatedAt}`,
    "",
    "Priority order: Respiratory Therapy, Paramedicine, Medical Laboratory Technology. Each should reach at least 2,000 profession-specific questions before commercial launch consideration.",
    "",
    ...mdTable([
      ["Profession", "Current Questions", "Minimum", "Gap", "Quality %", "Required Expansion"],
      ...priority.map((row) => [
        row.target.label,
        String(row.current.questions),
        "2000",
        String(Math.max(0, 2000 - row.current.questions)),
        pct(row.percent.quality),
        "Clinical realism, strong distractors, detailed rationales, non-revealing hints, clinical pearls, readiness mapping.",
      ]),
    ]),
    "",
    "Expansion batches must include SATA, matrix, bowtie, trend interpretation, prioritization, and case-based items. Wrong answers must map to profession-specific reasoning errors and remediation.",
    "",
  ].join("\n");
}

function simulationRoadmap(rows: AlliedParityRow[], generatedAt: string): string {
  return [
    "# Allied Simulation Roadmap",
    "",
    `Generated: ${generatedAt}`,
    "",
    ...mdTable([
      ["Profession", "Current Simulations", "Target", "Gap", "Required Simulation Families"],
      ...rows.map((row) => [
        row.target.label,
        String(row.current.simulations),
        String(row.target.targets.simulations),
        String(row.gaps.simulations),
        row.target.simulationPriorities.join("; "),
      ]),
    ]),
    "",
    "Every simulation should include recognition, interpretation, prioritization, action, evaluation, debrief, documentation or reporting element, and readiness signal update.",
    "",
  ].join("\n");
}

function readinessDomainFramework(rows: AlliedParityRow[], generatedAt: string): string {
  return [
    "# Allied Readiness Domain Framework",
    "",
    `Generated: ${generatedAt}`,
    "",
    ...rows.flatMap((row) => [
      `## ${row.target.label}`,
      "",
      ...mdTable([
        ["Readiness Domain", "Required Evidence"],
        ...row.target.readinessDomains.map((domain) => [domain, "Lessons, questions, simulation, remediation, analytics signal, and competency threshold."]),
      ]),
      "",
    ]),
  ].join("\n");
}

function landingPageSpecs(rows: AlliedParityRow[], generatedAt: string): string {
  return [
    "# Allied Profession Landing Page Specs",
    "",
    `Generated: ${generatedAt}`,
    "",
    "This is a future specification only. No landing pages were created.",
    "",
    ...mdTable([
      ["Profession", "Certification Pathways", "Content Coverage", "Readiness Systems", "Career Pathways", "SEO Opportunities"],
      ...rows.map((row) => [
        row.target.label,
        certificationPathways(row.target.id),
        row.target.simulationPriorities.join("; "),
        row.target.readinessDomains.join("; "),
        careerPathways(row.target.id),
        `${row.target.seoOpportunity} opportunity: exam prep, clinical skills, placement prep, readiness domains, salary/career guides.`,
      ]),
    ]),
    "",
  ].join("\n");
}

function certificationPathways(id: AlliedParityProfessionId): string {
  const map: Record<AlliedParityProfessionId, string> = {
    respiratory: "RT program exams, board-style RT preparation, ventilator/ABG competency.",
    paramedic: "Paramedic program exams, prehospital scenarios, emergency readiness.",
    mlt: "MLT/MLS program exams, specimen and laboratory quality competency.",
    physiotherapy: "PT/PTA academic readiness, mobility and rehabilitation competency.",
    "occupational-therapy": "OT/OTA academic readiness, functional assessment and discharge planning.",
    "psw-hca": "PSW/HCA/CCA training, safety reporting, personal care competency.",
    "social-work": "Social work field placement readiness, ethics, risk escalation.",
    psychotherapy: "Psychotherapy training readiness, risk assessment, therapeutic boundaries.",
  };
  return map[id];
}

function careerPathways(id: AlliedParityProfessionId): string {
  const map: Record<AlliedParityProfessionId, string> = {
    respiratory: "Hospital RT, ICU, emergency, pulmonary diagnostics, home oxygen.",
    paramedic: "EMS, urgent transport, community paramedicine, emergency response.",
    mlt: "Hospital labs, blood bank, microbiology, chemistry, hematology, quality assurance.",
    physiotherapy: "Acute care, rehab, outpatient, community mobility, falls prevention.",
    "occupational-therapy": "Acute care, rehab, pediatrics, mental health, home safety.",
    "psw-hca": "Long-term care, home care, assisted living, community support.",
    "social-work": "Hospital social work, community agencies, mental health, discharge planning.",
    psychotherapy: "Counselling, community mental health, crisis response, private practice foundations.",
  };
  return map[id];
}

function qualityParity(rows: AlliedParityRow[], generatedAt: string): string {
  return [
    "# Allied Quality Parity Report",
    "",
    `Generated: ${generatedAt}`,
    "",
    "Target: Question Quality >=95%, Rationale Quality >=95%, Hint Quality >=95%, Clinical Pearl Quality >=95%. Current automated quality uses Allied modality compliance plus hidden module audit signals where question banks exist.",
    "",
    ...mdTable([
      ["Profession", "Question Quality", "Rationale Quality", "Hint Quality", "Clinical Pearl Quality", "Parity Status", "Required Action"],
      ...rows.map((row) => [
        row.target.label,
        pct(row.percent.quality),
        pct(row.percent.quality),
        row.current.questions > 0 ? "Not instrumented" : "Missing question bank",
        row.current.questions > 0 ? "Not instrumented" : "Missing question bank",
        row.percent.quality >= 95 ? "Meets automated quality target" : "Below RN parity target",
        row.current.questions > 0
          ? "Run RN question-quality scorer on Allied question banks after expansion and add hint/pearl instrumentation."
          : "Create profession-specific question bank before quality parity can be certified.",
      ]),
    ]),
    "",
  ].join("\n");
}

function commercialDashboard(rows: AlliedParityRow[], generatedAt: string): string {
  const sorted = rows.slice().sort((a, b) => b.priorityScore - a.priorityScore);
  return [
    "# Allied Commercial Readiness Dashboard",
    "",
    `Generated: ${generatedAt}`,
    "",
    ...mdTable([
      ["Profession", "Coverage", "Depth", "Reasoning", "Simulation", "Readiness", "Quality", "Overall", "Blockers", "Priority Actions", "Estimated Effort"],
      ...sorted.map((row) => [
        row.target.label,
        pct(row.percent.coverage),
        pct(row.percent.depth),
        pct(row.percent.reasoning),
        pct(row.percent.simulation),
        pct(row.percent.readiness),
        pct(row.percent.quality),
        pct(row.percent.overall),
        row.blockers.join("; "),
        priorityActions(row),
        row.estimatedEffort,
      ]),
    ]),
    "",
    "## Ranked Roadmap",
    "",
    ...mdTable([
      ["Rank", "Category", "Profession", "Reason"],
      ["1", "Highest ROI profession", sorted[0]?.target.label ?? "N/A", "Highest combined gap urgency, SEO opportunity, institutional value, and commercialization upside."],
      ["2", "Fastest-to-launch profession", fastestToLaunch(rows)?.target.label ?? "N/A", "Highest overall readiness with the smallest remaining simulation/content gap."],
      ["3", "Highest institutional value profession", highestInstitutional(rows)?.target.label ?? "N/A", "Strongest hospital, school, or employer competency use case."],
      ["4", "Highest SEO opportunity profession", highestSeo(rows)?.target.label ?? "N/A", "Strongest search acquisition potential from exam prep and skills-readiness content."],
      ["5", "Recommended launch sequence", sorted.map((row) => row.target.label).join(" -> "), "Sequence reflects priority score, readiness, and gap closure effort."],
    ]),
    "",
  ].join("\n");
}

function priorityActions(row: AlliedParityRow): string {
  const actions = [];
  if (row.gaps.questions > 0) actions.push(`Build ${Math.min(row.gaps.questions, 500)} profession-specific questions next`);
  if (row.gaps.simulations > 0) actions.push(`Add ${Math.min(row.gaps.simulations, 25)} simulations`);
  if (row.gaps.flashcards > 0) actions.push("Generate flashcards from validated lessons/questions");
  if (row.percent.readiness < 90) actions.push("Instrument readiness domains");
  return actions.join("; ");
}

function fastestToLaunch(rows: AlliedParityRow[]): AlliedParityRow | undefined {
  return rows.slice().sort((a, b) => b.percent.overall - a.percent.overall || a.gaps.questions + a.gaps.simulations - (b.gaps.questions + b.gaps.simulations))[0];
}

function highestInstitutional(rows: AlliedParityRow[]): AlliedParityRow | undefined {
  return rows.slice().sort((a, b) => {
    const score = (row: AlliedParityRow) => (row.target.institutionalValue === "very_high" ? 100 : row.target.institutionalValue === "high" ? 80 : 50) + row.percent.simulation;
    return score(b) - score(a);
  })[0];
}

function highestSeo(rows: AlliedParityRow[]): AlliedParityRow | undefined {
  return rows.slice().sort((a, b) => {
    const score = (row: AlliedParityRow) => (row.target.seoOpportunity === "very_high" ? 100 : row.target.seoOpportunity === "high" ? 80 : 50) + row.percent.coverage;
    return score(b) - score(a);
  })[0];
}

const generatedAt = new Date().toISOString();
const rows = buildRows();
const outDir = resolve(process.cwd(), "docs");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "allied-profession-readiness-audit.md"), readinessAudit(rows, generatedAt));
writeFileSync(resolve(outDir, "allied-launch-thresholds.md"), launchThresholds(rows, generatedAt));
writeFileSync(resolve(outDir, "allied-question-expansion-roadmap.md"), questionRoadmap(rows, generatedAt));
writeFileSync(resolve(outDir, "allied-simulation-roadmap.md"), simulationRoadmap(rows, generatedAt));
writeFileSync(resolve(outDir, "allied-readiness-domain-framework.md"), readinessDomainFramework(rows, generatedAt));
writeFileSync(resolve(outDir, "allied-profession-landing-page-specs.md"), landingPageSpecs(rows, generatedAt));
writeFileSync(resolve(outDir, "allied-quality-parity-report.md"), qualityParity(rows, generatedAt));
writeFileSync(resolve(outDir, "allied-commercial-readiness-dashboard.md"), commercialDashboard(rows, generatedAt));
console.log(`Wrote Allied parity acceleration reports for ${rows.length} professions.`);
