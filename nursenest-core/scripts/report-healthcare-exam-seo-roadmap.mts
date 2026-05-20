#!/usr/bin/env tsx
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  buildHealthcareExamAuthorityUrlInventory,
  listHealthcareExamAuthorityPillars,
} from "@/lib/seo/healthcare-exam-authority-architecture";

type RoadmapPhase = "Phase 1" | "Phase 2" | "Phase 3";

type PlannedRow = ReturnType<typeof buildHealthcareExamAuthorityUrlInventory>[number] & {
  status: "planned";
};

type RoadmapRow = {
  rank: number;
  phase: RoadmapPhase;
  id: string;
  family: string;
  kind: string;
  targetRoute: string;
  plannedAliasPath?: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  sourceContentNeeded: string[];
  schemaType: string[];
  ctaTarget: string;
  internalLinksIn: string[];
  internalLinksOut: string[];
  indexableImmediately: boolean;
  notes: string;
  scoring: {
    seoOpportunity: number;
    conversionValue: number;
    existingContentAvailability: number;
    internalLinkPotential: number;
    implementationEffort: number;
    total: number;
  };
};

const pillars = listHealthcareExamAuthorityPillars();
const pillarByFamily = new Map(pillars.map((pillar) => [pillar.family, pillar]));

function pillarForRow(row: PlannedRow) {
  return pillars
    .filter((pillar) => row.canonicalPath === pillar.canonicalPath || row.canonicalPath.startsWith(`${pillar.canonicalPath}/`))
    .sort((a, b) => b.canonicalPath.length - a.canonicalPath.length)[0];
}

function inferIntent(row: PlannedRow): string {
  if (row.id.includes("test-bank")) return "test-bank";
  if (row.id.includes("study-guide")) return "study-guide";
  if (row.id.includes("practice-questions")) return "practice-questions";
  if (row.id.includes("cat-exam")) return "cat-exam";
  if (row.id.includes("flashcards")) return "flashcards";
  return row.kind === "topic-cluster" ? row.id : row.title.toLowerCase();
}

function familyBoost(family: string): number {
  if (family === "nclex-rn") return 2;
  if (family === "rex-pn") return 2;
  if (family === "cnple") return 2;
  if (family === "np") return 1;
  return 0;
}

function seoOpportunity(row: PlannedRow): number {
  const intent = inferIntent(row);
  let score = 5;
  if (intent === "test-bank") score = 10;
  else if (intent === "practice-questions") score = 9;
  else if (intent === "study-guide") score = 8;
  else if (intent === "cat-exam") score = 7;
  else if (intent === "flashcards") score = 6;
  else if (row.kind === "topic-cluster") score = 8;
  if (row.id.includes("prioritization") || row.id.includes("sata") || row.id.includes("insulin")) score += 1;
  return Math.min(10, score + familyBoost(row.family));
}

function conversionValue(row: PlannedRow): number {
  const intent = inferIntent(row);
  if (intent === "test-bank") return 10;
  if (intent === "practice-questions") return 9;
  if (intent === "cat-exam") return 8;
  if (intent === "study-guide") return 7;
  if (row.kind === "topic-cluster") return row.id.includes("prioritization") || row.id.includes("insulin") ? 7 : 6;
  if (intent === "flashcards") return 5;
  return 5;
}

function contentAvailability(row: PlannedRow): number {
  if (row.kind === "topic-cluster") {
    if (row.id.includes("ecg")) return 9;
    if (row.id.includes("copd") || row.id.includes("dosage") || row.id.includes("insulin")) return 7;
    if (row.id.includes("np-case")) return 7;
    return 5;
  }
  if (row.family === "nclex-rn") return 9;
  if (row.family === "rex-pn") return 8;
  if (row.family === "cnple") return 8;
  if (row.family === "np") return 7;
  if (row.id.includes("respiratory") || row.id.includes("paramedic") || row.id.includes("mlt")) return 6;
  return 4;
}

function linkPotential(row: PlannedRow): number {
  if (row.kind === "topic-cluster") return 8;
  if (row.family === "nclex-rn" || row.family === "rex-pn" || row.family === "cnple") return 9;
  if (row.family === "np") return 8;
  return row.id.includes("respiratory") || row.id.includes("paramedic") || row.id.includes("mlt") ? 7 : 5;
}

/** 1 = easiest, 10 = hardest. */
function implementationEffort(row: PlannedRow): number {
  const intent = inferIntent(row);
  if (row.kind === "topic-cluster") return row.id.includes("ecg") ? 3 : 6;
  if (intent === "test-bank") return row.family === "allied" ? 7 : 4;
  if (intent === "study-guide") return row.family === "allied" ? 6 : 5;
  if (intent === "practice-questions") return 6;
  if (intent === "cat-exam") return 8;
  if (intent === "flashcards") return 6;
  return 6;
}

function primaryKeyword(row: PlannedRow): string {
  if (row.targetQueries[0]) {
    const prefix =
      row.family === "nclex-rn"
        ? "NCLEX-RN "
        : row.family === "rex-pn"
          ? "REx-PN "
          : row.family === "cnple"
            ? "CNPLE "
            : row.family === "np"
              ? "NP "
              : "";
    return row.kind === "ecosystem" ? `${prefix}${row.targetQueries[0]}`.trim() : row.targetQueries[0];
  }
  return row.title;
}

function secondaryKeywords(row: PlannedRow): string[] {
  const extras: Record<string, string[]> = {
    "test-bank": ["question bank", "practice questions with rationales", "adaptive testing", "performance analytics"],
    "study-guide": ["exam prep guide", "study plan", "high-yield topics", "clinical judgment"],
    "practice-questions": ["free practice questions", "rationales", "case-based questions", "weak-area remediation"],
    "cat-exam": ["adaptive exam", "CAT simulator", "readiness score", "exam pacing"],
    flashcards: ["spaced repetition", "pharmacology flashcards", "clinical judgment flashcards"],
  };
  return [...new Set([...row.targetQueries.slice(1), ...(extras[inferIntent(row)] ?? [])])].slice(0, 6);
}

function sourceContentNeeded(row: PlannedRow): string[] {
  const intent = inferIntent(row);
  if (row.kind === "topic-cluster") {
    return [
      "high-performing lessons or clinical topic outlines",
      "5-10 sample question/rationale previews",
      "linked pathway/product CTAs",
      "medical review notes for terminology accuracy",
    ];
  }
  if (intent === "test-bank") {
    return ["published question counts", "CAT/readiness explanation", "SATA/clinical judgment coverage", "analytics/remediation copy"];
  }
  if (intent === "study-guide") {
    return ["exam format overview", "study schedule", "high-yield content map", "links to lessons/questions/flashcards"];
  }
  if (intent === "practice-questions") {
    return ["5-15 free question previews", "rationales", "upgrade gate copy", "email capture/remediation preview"];
  }
  if (intent === "cat-exam") {
    return ["CAT eligibility rules", "adaptive testing explanation", "readiness screenshots/copy", "fallback links to questions and lessons"];
  }
  return ["curated flashcard categories", "spaced-repetition explanation", "pathway-specific CTA copy"];
}

function schemaTypes(row: PlannedRow): string[] {
  if (row.kind === "topic-cluster") return ["Article", "FAQPage", "BreadcrumbList"];
  if (inferIntent(row) === "study-guide") return ["Article", "FAQPage", "BreadcrumbList", "ItemList"];
  return ["FAQPage", "BreadcrumbList", "ItemList", "EducationalCourse"];
}

function ctaTarget(row: PlannedRow): string {
  const familyPillar = pillarForRow(row) ?? pillarByFamily.get(row.family);
  const familyPath = familyPillar?.canonicalPath ?? "";
  const intent = inferIntent(row);
  if (intent === "test-bank" || intent === "practice-questions") return `${familyPath}/questions`;
  if (intent === "cat-exam") return `${familyPath}/cat`;
  if (intent === "flashcards") return `${familyPath}/flashcards`;
  if (intent === "study-guide") return `${familyPath}/lessons`;
  if (row.id.includes("ecg")) return "/advanced-ecg-nursing";
  if (row.family === "allied") return "/allied/allied-health/questions";
  return `${familyPath}/questions`;
}

function internalLinksOut(row: PlannedRow): string[] {
  const familyPillar = pillarForRow(row) ?? pillarByFamily.get(row.family);
  const base = familyPillar?.canonicalPath ?? "";
  const links = new Set<string>();
  if (base) links.add(base);
  if (base) links.add(`${base}/questions`);
  if (base) links.add(`${base}/lessons`);
  if (row.family !== "allied" && base) links.add(`${base}/cat`);
  if (row.id.includes("ecg")) links.add("/advanced-ecg-nursing");
  if (row.id.includes("dosage")) links.add("/tools/dosage-calculator");
  if (row.family === "allied") {
    links.add("/allied/allied-health");
    links.add("/allied/allied-health/questions");
    links.add("/allied/allied-health/lessons");
  }
  return [...links].slice(0, 7);
}

function internalLinksIn(row: PlannedRow): string[] {
  const familyPillar = pillarForRow(row) ?? pillarByFamily.get(row.family);
  const links = new Set<string>();
  if (familyPillar) links.add(familyPillar.canonicalPath);
  for (const pillar of pillars) {
    if (pillar.family === row.family) links.add(pillar.canonicalPath);
  }
  if (row.family === "nclex-rn") {
    links.add("/nclex-question-bank");
    links.add("/free-nclex-practice-questions");
  }
  if (row.family === "rex-pn") links.add("/canada/pn/rex-pn/questions");
  if (row.family === "cnple") links.add("/canada/np/cnple/questions");
  if (row.family === "allied") links.add("/allied/allied-health");
  return [...links].slice(0, 8);
}

function shouldIndexImmediately(row: PlannedRow, phase: RoadmapPhase): boolean {
  if (phase === "Phase 1") return true;
  if (row.kind === "topic-cluster" && row.id.includes("ecg")) return true;
  return false;
}

function phaseFor(row: PlannedRow, total: number): RoadmapPhase {
  if (row.family === "allied") return "Phase 3";
  if (row.kind === "topic-cluster") return "Phase 2";
  if (total >= 37) return "Phase 1";
  if (total >= 31) return "Phase 2";
  return "Phase 3";
}

function buildRoadmapRow(row: PlannedRow): Omit<RoadmapRow, "rank"> {
  const scoring = {
    seoOpportunity: seoOpportunity(row),
    conversionValue: conversionValue(row),
    existingContentAvailability: contentAvailability(row),
    internalLinkPotential: linkPotential(row),
    implementationEffort: implementationEffort(row),
    total: 0,
  };
  scoring.total =
    scoring.seoOpportunity +
    scoring.conversionValue +
    scoring.existingContentAvailability +
    scoring.internalLinkPotential +
    (11 - scoring.implementationEffort);
  const phase = phaseFor(row, scoring.total);
  return {
    phase,
    id: row.id,
    family: row.family,
    kind: row.kind,
    targetRoute: row.canonicalPath,
    plannedAliasPath: row.plannedAliasPath,
    primaryKeyword: primaryKeyword(row),
    secondaryKeywords: secondaryKeywords(row),
    sourceContentNeeded: sourceContentNeeded(row),
    schemaType: schemaTypes(row),
    ctaTarget: ctaTarget(row),
    internalLinksIn: internalLinksIn(row),
    internalLinksOut: internalLinksOut(row),
    indexableImmediately: shouldIndexImmediately(row, phase),
    notes:
      row.plannedAliasPath && row.plannedAliasPath !== row.canonicalPath
        ? "Build substantive canonical page first. Keep short alias inactive until content exists and canonical strategy is approved."
        : "Build only with substantive content and QA; do not index a placeholder.",
    scoring,
  };
}

const planned = buildHealthcareExamAuthorityUrlInventory().filter((row): row is PlannedRow => row.status === "planned");
const roadmap = planned
  .map(buildRoadmapRow)
  .sort((a, b) => b.scoring.total - a.scoring.total || a.scoring.implementationEffort - b.scoring.implementationEffort)
  .map((row, index) => ({ rank: index + 1, ...row }));

const outDir = path.join(process.cwd(), "reports");
mkdirSync(outDir, { recursive: true });

const jsonPath = path.join(outDir, "healthcare-exam-seo-implementation-roadmap.json");
const mdPath = path.join(outDir, "healthcare-exam-seo-implementation-roadmap.md");

writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      rankingCriteria: {
        seoOpportunity: "Search demand and ranking upside for exam-specific commercial/informational keywords.",
        conversionValue: "Likelihood the page can move a visitor toward questions, CAT, flashcards, lessons, checkout, or email capture.",
        existingContentAvailability: "How much substantive product, lesson, question, or cluster content already exists.",
        internalLinkPotential: "How naturally the page can receive and send pathway-aware internal links.",
        implementationEffort: "1 is easiest, 10 is hardest; total score rewards lower effort.",
      },
      counts: {
        plannedRows: roadmap.length,
        phase1: roadmap.filter((row) => row.phase === "Phase 1").length,
        phase2: roadmap.filter((row) => row.phase === "Phase 2").length,
        phase3: roadmap.filter((row) => row.phase === "Phase 3").length,
      },
      roadmap,
    },
    null,
    2,
  ),
);

const lines: string[] = [];
lines.push("# Healthcare Exam SEO Implementation Roadmap");
lines.push("");
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push("");
lines.push("## Ranking Criteria");
lines.push("");
lines.push("- **SEO opportunity:** search demand and ranking upside.");
lines.push("- **Conversion value:** proximity to questions, CAT, flashcards, lessons, checkout, or email capture.");
lines.push("- **Existing content availability:** whether NurseNest already has source material, product surfaces, lessons, or question inventory.");
lines.push("- **Internal-link potential:** quality of links in/out from pillars, lessons, questions, CAT, flashcards, and topical clusters.");
lines.push("- **Implementation effort:** 1 easiest to 10 hardest; total score rewards lower effort.");
lines.push("");
for (const phase of ["Phase 1", "Phase 2", "Phase 3"] as const) {
  const rows = roadmap.filter((row) => row.phase === phase);
  lines.push(`## ${phase} — ${phase === "Phase 1" ? "Highest ROI Pages To Build Now" : phase === "Phase 2" ? "Supporting Clusters" : "Lower-Priority / Allied Expansion"}`);
  lines.push("");
  lines.push("| Rank | Target route | Primary keyword | Score | Index now? | CTA |");
  lines.push("|---:|---|---|---:|---|---|");
  for (const row of rows) {
    lines.push(
      `| ${row.rank} | \`${row.targetRoute}\` | ${row.primaryKeyword} | ${row.scoring.total} | ${row.indexableImmediately ? "yes, after substantive content" : "no"} | \`${row.ctaTarget}\` |`,
    );
  }
  lines.push("");
}

lines.push("## Implementation Details");
lines.push("");
for (const row of roadmap) {
  lines.push(`### ${row.rank}. ${row.targetRoute}`);
  lines.push("");
  lines.push(`- **Phase:** ${row.phase}`);
  lines.push(`- **Primary keyword:** ${row.primaryKeyword}`);
  lines.push(`- **Secondary keywords:** ${row.secondaryKeywords.join(", ") || "none"}`);
  lines.push(`- **Source content needed:** ${row.sourceContentNeeded.join("; ")}`);
  lines.push(`- **Schema:** ${row.schemaType.join(", ")}`);
  lines.push(`- **CTA target:** \`${row.ctaTarget}\``);
  lines.push(`- **Internal links in:** ${row.internalLinksIn.map((link) => `\`${link}\``).join(", ")}`);
  lines.push(`- **Internal links out:** ${row.internalLinksOut.map((link) => `\`${link}\``).join(", ")}`);
  lines.push(`- **Indexable immediately:** ${row.indexableImmediately ? "yes, after substantive content and QA" : "no; keep planned until substantive page exists"}`);
  if (row.plannedAliasPath) lines.push(`- **Planned alias:** \`${row.plannedAliasPath}\` must stay inactive until route content exists.`);
  lines.push(
    `- **Scores:** SEO ${row.scoring.seoOpportunity}, conversion ${row.scoring.conversionValue}, content ${row.scoring.existingContentAvailability}, links ${row.scoring.internalLinkPotential}, effort ${row.scoring.implementationEffort}, total ${row.scoring.total}`,
  );
  lines.push(`- **Notes:** ${row.notes}`);
  lines.push("");
}

writeFileSync(mdPath, `${lines.join("\n")}\n`);

console.log(`wrote ${jsonPath}`);
console.log(`wrote ${mdPath}`);
console.log(`ranked ${roadmap.length} planned rows`);
