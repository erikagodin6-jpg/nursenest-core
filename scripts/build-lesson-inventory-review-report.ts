#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Status =
  | "fully present"
  | "present but thin/incomplete"
  | "duplicated"
  | "implied/scaffolded but missing authored lesson content";

type RecommendedAction =
  | "keep as-is"
  | "complete"
  | "normalize title"
  | "merge duplicate"
  | "add missing"
  | "hide until complete";

type LaunchPriority = "critical" | "high" | "medium" | "later";

type InventoryRow = {
  group: string;
  subgroup?: string;
  title: string;
  slug: string | null;
  source: string;
  status: Status;
  notes?: string | null;
};

type CanonicalRow = {
  group: string;
  subgroup?: string;
  title: string;
  status: "already exists" | "needs completion" | "missing and should be added";
  evidence: string;
};

type AuditJson = {
  generatedAt: string;
  masterInventory: Record<string, InventoryRow[]>;
  audits: {
    duplicateOrNearDuplicateLessonNames: Array<{
      normalizedKey: string;
      matches: Array<{
        group: string;
        subgroup?: string | null;
        title: string;
        slug: string | null;
        source: string;
      }>;
    }>;
    obviousGaps: Record<string, string[]>;
    lessonsInDataButNotExposedInRoutes: string[];
    lessonsExposedInRoutesButMissingContent: string[];
    inconsistentNamingAcrossTiers: string[];
    preNursingTopicsMissingFromFoundationalSequence: string[];
    alliedProfessionsWithWeakOrSparseCoverage: string[];
  };
  recommendedCanonicalLessonList: CanonicalRow[];
};

type ReviewRow = {
  tierGroup: string;
  subgroup: string;
  pathway: string;
  lessonTitle: string;
  slug: string;
  source: string;
  status: Status;
  notes: string;
  recommendedAction: RecommendedAction;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SOURCE_JSON = path.join(ROOT, "reports/lesson-inventory-audit.json");
const REPORT_DIR = path.join(ROOT, "docs/reports");

const MARKDOWN_OUT = path.join(REPORT_DIR, "lesson-inventory-audit.md");
const JSON_OUT = path.join(REPORT_DIR, "lesson-inventory-audit.json");
const CSV_OUT = path.join(REPORT_DIR, "lesson-inventory-audit.csv");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/\(unit\s+\d+\)/gi, "")
    .replace(/\(.*?(canada|us|united states|nclex-rn|nclex-pn|rex-pn).*?\)/gi, "")
    .replace(/[:\-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function csvEscape(value: string) {
  const text = value.replace(/"/g, '""');
  return /[",\n]/.test(text) ? `"${text}"` : text;
}

function mdEscape(value: string) {
  return value.replace(/\|/g, "\\|");
}

function pathwayLabelForRow(row: InventoryRow): string {
  if (row.group === "Pre-nursing") return "Pre-nursing";
  if (row.group === "Allied Health") return row.subgroup || "Allied Health";
  const sourceMatch = row.source.match(/→\s([a-z0-9-]+)$/i);
  if (sourceMatch) return sourceMatch[1];
  if (row.group === "NP") {
    if (row.source.includes("np-phase1")) return "NP phase 1 outline";
    if (row.source.includes("np-phase2")) return "NP phase 2 outline";
    if (row.source.includes("np-lesson-expansion-500")) return "NP expansion blueprint";
    if (row.source.includes("batch-01")) return "NP advanced batch 01";
    if (row.source.includes("batch-02")) return "NP advanced batch 02";
  }
  return row.group;
}

function recommendedActionForRow(row: InventoryRow, duplicateExactTitleCounts: Map<string, number>): RecommendedAction {
  if (row.status === "fully present") return "keep as-is";
  if (row.status === "present but thin/incomplete") return "complete";
  if (row.status === "implied/scaffolded but missing authored lesson content") {
    if (row.source.includes("phase") || row.source.includes("batch") || row.source.includes("blueprints")) {
      return "add missing";
    }
    return "hide until complete";
  }
  const key = `${row.group}::${row.subgroup ?? ""}::${row.title.toLowerCase()}`;
  return (duplicateExactTitleCounts.get(key) ?? 0) > 1 ? "normalize title" : "merge duplicate";
}

function launchPriorityForCanonical(row: CanonicalRow): LaunchPriority {
  const title = row.title.toLowerCase();
  const criticalWords = [
    "math",
    "dosage",
    "pharmacology",
    "medication",
    "safety",
    "prioritization",
    "delegation",
    "scope",
    "infection",
    "nursing process",
    "communication",
  ];
  const highWords = [
    "cardio",
    "cardiovascular",
    "respiratory",
    "renal",
    "electrolyte",
    "fluid",
    "shock",
    "sepsis",
    "stroke",
    "assessment",
    "adult",
    "pediatric",
    "maternity",
    "mental health",
  ];

  if (row.status === "missing and should be added") {
    if (criticalWords.some((word) => title.includes(word))) return "critical";
    if (highWords.some((word) => title.includes(word))) return "high";
    return row.group === "Allied Health" ? "high" : "medium";
  }
  if (row.status === "needs completion") {
    if (criticalWords.some((word) => title.includes(word))) return "critical";
    return "high";
  }
  if (row.group === "Allied Health" && row.title.toLowerCase().includes("inventory")) return "critical";
  return "later";
}

function buildMarkdownTable(rows: ReviewRow[]): string {
  const header =
    "| Lesson title | Slug | Profession / tier / pathway | Source | Status | Notes | Recommended action |\n|---|---|---|---|---|---|---|";
  const body = rows
    .map(
      (row) =>
        `| ${mdEscape(row.lessonTitle)} | ${mdEscape(row.slug)} | ${mdEscape(row.pathway)} | ${mdEscape(row.source)} | ${row.status} | ${mdEscape(row.notes)} | ${row.recommendedAction} |`,
    )
    .join("\n");
  return `${header}\n${body || "| _None found_ |  |  |  |  |  |  |"}`;
}

function buildCanonicalTable(rows: Array<CanonicalRow & { slug: string; sourceMatch: string; launchPriority: LaunchPriority }>): string {
  const header =
    "| Canonical lesson title | Slug | Current status | Source match if any | Launch priority |\n|---|---|---|---|---|";
  const body = rows
    .map(
      (row) =>
        `| ${mdEscape(row.title)} | ${mdEscape(row.slug)} | ${row.status} | ${mdEscape(row.sourceMatch)} | ${row.launchPriority} |`,
    )
    .join("\n");
  return `${header}\n${body || "| _None_ |  |  |  |  |"}`;
}

function groupOrderValue(group: string): number {
  const order = [
    "Pre-nursing",
    "Canada RPN / REx-PN",
    "US LPN/LVN / NCLEX-PN",
    "Canada RN",
    "US RN / NCLEX-RN",
    "NP",
    "Allied Health",
  ];
  return order.indexOf(group);
}

function main() {
  ensureDir(REPORT_DIR);
  const input = readJson<AuditJson>(SOURCE_JSON);

  const reviewRows: ReviewRow[] = [];
  const duplicateExactTitleCounts = new Map<string, number>();
  const flatRows = Object.values(input.masterInventory).flat();

  for (const row of flatRows) {
    const key = `${row.group}::${row.subgroup ?? ""}::${row.title.toLowerCase()}`;
    duplicateExactTitleCounts.set(key, (duplicateExactTitleCounts.get(key) ?? 0) + 1);
  }

  for (const row of flatRows) {
    reviewRows.push({
      tierGroup: row.group,
      subgroup: row.subgroup ?? "",
      pathway: row.group === "Allied Health" ? `${row.group} / ${row.subgroup ?? "General"}` : `${row.group} / ${pathwayLabelForRow(row)}`,
      lessonTitle: row.title,
      slug: row.slug ?? "",
      source: row.source,
      status: row.status,
      notes: row.notes ?? "",
      recommendedAction: recommendedActionForRow(row, duplicateExactTitleCounts),
    });
  }

  reviewRows.sort((a, b) => {
    return (
      groupOrderValue(a.tierGroup) - groupOrderValue(b.tierGroup) ||
      a.subgroup.localeCompare(b.subgroup) ||
      a.lessonTitle.localeCompare(b.lessonTitle)
    );
  });

  const statusCounts = {
    complete: reviewRows.filter((row) => row.status === "fully present").length,
    incomplete: reviewRows.filter((row) => row.status === "present but thin/incomplete").length,
    missing: reviewRows.filter((row) => row.status === "implied/scaffolded but missing authored lesson content").length,
    duplicated: reviewRows.filter((row) => row.status === "duplicated").length,
    routeMissing: input.audits.lessonsExposedInRoutesButMissingContent.length,
  };

  const totalsByTier = [...new Set(reviewRows.map((row) => row.tierGroup))].map((group) => {
    const rows = reviewRows.filter((row) => row.tierGroup === group);
    return {
      group,
      total: rows.length,
      complete: rows.filter((row) => row.status === "fully present").length,
      incomplete: rows.filter((row) => row.status === "present but thin/incomplete").length,
      missing: rows.filter((row) => row.status === "implied/scaffolded but missing authored lesson content").length,
      duplicated: rows.filter((row) => row.status === "duplicated").length,
    };
  });

  const totalsByPathway = [...new Set(reviewRows.map((row) => row.pathway))].map((pathway) => {
    const rows = reviewRows.filter((row) => row.pathway === pathway);
    return {
      pathway,
      total: rows.length,
      complete: rows.filter((row) => row.status === "fully present").length,
      incomplete: rows.filter((row) => row.status === "present but thin/incomplete").length,
      missing: rows.filter((row) => row.status === "implied/scaffolded but missing authored lesson content").length,
      duplicated: rows.filter((row) => row.status === "duplicated").length,
    };
  });

  const sourceMatches = new Map<string, InventoryRow>();
  for (const row of flatRows) {
    const key = `${row.group}::${row.subgroup ?? ""}::${normalizeTitle(row.title)}`;
    if (!sourceMatches.has(key)) sourceMatches.set(key, row);
  }

  const canonicalRows = input.recommendedCanonicalLessonList
    .map((row) => {
      const match = sourceMatches.get(`${row.group}::${row.subgroup ?? ""}::${normalizeTitle(row.title)}`);
      return {
        ...row,
        slug: match?.slug ?? "",
        sourceMatch: match?.source ?? row.evidence,
        launchPriority: launchPriorityForCanonical(row),
      };
    })
    .sort((a, b) => groupOrderValue(a.group) - groupOrderValue(b.group) || (a.subgroup ?? "").localeCompare(b.subgroup ?? "") || a.title.localeCompare(b.title));

  const missingFoundationalLessons = [
    ...input.audits.preNursingTopicsMissingFromFoundationalSequence,
    ...canonicalRows
      .filter((row) => row.group === "Pre-nursing" && row.status === "missing and should be added")
      .map((row) => row.title),
  ];

  const missingMedSurgLessons = canonicalRows
    .filter(
      (row) =>
        row.status !== "already exists" &&
        /(cardio|cardiovascular|respir|renal|gi|gastro|endocrine|shock|sepsis|stroke|neuro|pain|wound|pneumonia|copd|adult health|med-surg|musculoskeletal)/i.test(
          row.title,
        ),
    )
    .map((row) => `${row.group}: ${row.title}`);

  const missingPharmOrMath = canonicalRows
    .filter((row) => row.status !== "already exists" && /(pharm|medication|drug|dosage|math|calculation|insulin|anticoagulant)/i.test(row.title))
    .map((row) => `${row.group}: ${row.title}`);

  const missingSafetyPriorityDelegation = canonicalRows
    .filter((row) => row.status !== "already exists" && /(safety|prioritization|delegation|scope|communication|infection|nursing process)/i.test(row.title))
    .map((row) => `${row.group}: ${row.title}`);

  const examPrepOrStrategyGaps = [
    ...reviewRows
      .filter((row) => /strategy|exam prep|study plan|readiness/i.test(row.lessonTitle) === false)
      .reduce<string[]>((acc, row) => acc, []),
  ];
  const dedicatedExamPrepLessonsFound = reviewRows.filter((row) => /strategy|study|exam prep/i.test(row.lessonTitle)).length;

  const markdown = [
    "# NurseNest Lesson Inventory Review Report",
    "",
    `Generated from the prior audit on ${input.generatedAt}. This version is reformatted for manual content planning and prioritization.`,
    "",
    "## Executive Summary",
    "",
    `- Total inventory rows reviewed: **${reviewRows.length}**`,
    `- Marked complete: **${statusCounts.complete}**`,
    `- Marked incomplete / thin: **${statusCounts.incomplete}**`,
    `- Marked missing / scaffolded: **${statusCounts.missing}**`,
    `- Marked duplicated: **${statusCounts.duplicated}**`,
    `- Route-exposed but missing content findings: **${statusCounts.routeMissing}**`,
    "",
    "### Total Lesson Count by Tier",
    "",
    "| Tier | Total | Complete | Incomplete / thin | Missing | Duplicated |",
    "|---|---:|---:|---:|---:|---:|",
    ...totalsByTier.map(
      (row) => `| ${mdEscape(row.group)} | ${row.total} | ${row.complete} | ${row.incomplete} | ${row.missing} | ${row.duplicated} |`,
    ),
    "",
    "### Total Lesson Count by Exam / Pathway",
    "",
    "| Exam / pathway | Total | Complete | Incomplete / thin | Missing | Duplicated |",
    "|---|---:|---:|---:|---:|---:|",
    ...totalsByPathway.map(
      (row) => `| ${mdEscape(row.pathway)} | ${row.total} | ${row.complete} | ${row.incomplete} | ${row.missing} | ${row.duplicated} |`,
    ),
    "",
    "## Tier-by-Tier Review",
    "",
    "### Pre-nursing",
    buildMarkdownTable(reviewRows.filter((row) => row.tierGroup === "Pre-nursing")),
    "",
    "### Canada RPN / REx-PN",
    buildMarkdownTable(reviewRows.filter((row) => row.tierGroup === "Canada RPN / REx-PN")),
    "",
    "### US LPN/LVN / NCLEX-PN",
    buildMarkdownTable(reviewRows.filter((row) => row.tierGroup === "US LPN/LVN / NCLEX-PN")),
    "",
    "### Canada RN",
    buildMarkdownTable(reviewRows.filter((row) => row.tierGroup === "Canada RN")),
    "",
    "### US RN / NCLEX-RN",
    buildMarkdownTable(reviewRows.filter((row) => row.tierGroup === "US RN / NCLEX-RN")),
    "",
    "### NP",
    buildMarkdownTable(reviewRows.filter((row) => row.tierGroup === "NP")),
    "",
    "### Allied Health",
    "",
    ...[...new Set(reviewRows.filter((row) => row.tierGroup === "Allied Health").map((row) => row.subgroup || "General"))]
      .sort()
      .flatMap((subgroup) => {
        const rows = reviewRows.filter((row) => row.tierGroup === "Allied Health" && (row.subgroup || "General") === subgroup);
        return [`#### ${subgroup}`, buildMarkdownTable(rows), ""];
      }),
    "## Gap Review",
    "",
    "### Missing Foundational Lessons",
    ...(missingFoundationalLessons.length ? missingFoundationalLessons.map((item) => `- ${item}`) : ["- No foundational gaps were explicitly flagged in the source audit."]),
    "",
    "### Missing Medical-Surgical System Lessons",
    ...(missingMedSurgLessons.length ? missingMedSurgLessons.map((item) => `- ${item}`) : ["- No explicit med-surg content gaps were captured in the source audit."]),
    "",
    "### Missing Pharmacology or Dosage-Math Lessons",
    ...(missingPharmOrMath.length ? missingPharmOrMath.map((item) => `- ${item}`) : ["- No explicit pharmacology or dosage-math gaps were captured in the source audit."]),
    "",
    "### Missing Safety / Prioritization / Delegation Topics",
    ...(missingSafetyPriorityDelegation.length
      ? missingSafetyPriorityDelegation.map((item) => `- ${item}`)
      : ["- No explicit safety / prioritization / delegation gaps were captured in the source audit."]),
    "",
    "### Missing Exam-Prep or Strategy Topics",
    ...(dedicatedExamPrepLessonsFound > 0
      ? ["- Strategy-focused content exists in pre-nursing (`Study & Cognitive Strategies`), but there are few clearly titled strategy-specific lessons outside that tier."]
      : ["- No clearly titled exam-strategy lesson tracks were found in the reviewed inventory."]),
    "",
    "### Weak Allied-Health Coverage",
    ...input.audits.alliedProfessionsWithWeakOrSparseCoverage.map((item) => `- ${item}`),
    "",
    "### Naming Inconsistencies Across Tiers",
    ...input.audits.inconsistentNamingAcrossTiers.map((item) => `- ${item}`),
    "",
    "### Duplicate or Overlapping Lesson Names",
    ...input.audits.duplicateOrNearDuplicateLessonNames.map(
      (dup) => `- \`${dup.normalizedKey}\`: ${dup.matches.map((match) => `${match.group}${match.subgroup ? ` / ${match.subgroup}` : ""} → ${match.title}`).join("; ")}`,
    ),
    "",
    "## Canonical Planning List",
    "",
    "### Pre-nursing",
    buildCanonicalTable(canonicalRows.filter((row) => row.group === "Pre-nursing")),
    "",
    "### Canada RPN / REx-PN",
    buildCanonicalTable(canonicalRows.filter((row) => row.group === "Canada RPN / REx-PN")),
    "",
    "### US LPN/LVN / NCLEX-PN",
    buildCanonicalTable(canonicalRows.filter((row) => row.group === "US LPN/LVN / NCLEX-PN")),
    "",
    "### Canada RN",
    buildCanonicalTable(canonicalRows.filter((row) => row.group === "Canada RN")),
    "",
    "### US RN / NCLEX-RN",
    buildCanonicalTable(canonicalRows.filter((row) => row.group === "US RN / NCLEX-RN")),
    "",
    "### NP",
    buildCanonicalTable(canonicalRows.filter((row) => row.group === "NP")),
    "",
    "### Allied Health",
    "",
    ...[...new Set(canonicalRows.filter((row) => row.group === "Allied Health").map((row) => row.subgroup || "General"))]
      .sort()
      .flatMap((subgroup) => {
        const rows = canonicalRows.filter((row) => row.group === "Allied Health" && (row.subgroup || "General") === subgroup);
        return [`#### ${subgroup}`, buildCanonicalTable(rows), ""];
      }),
  ].join("\n");

  const jsonOutput = {
    generatedAt: new Date().toISOString(),
    sourceAuditGeneratedAt: input.generatedAt,
    executiveSummary: {
      totalLessonCount: reviewRows.length,
      completeCount: statusCounts.complete,
      incompleteThinCount: statusCounts.incomplete,
      missingCount: statusCounts.missing,
      duplicatedCount: statusCounts.duplicated,
      exposedInRoutesButMissingContentCount: statusCounts.routeMissing,
      totalsByTier,
      totalsByPathway,
    },
    reviewRows,
    gapReview: {
      missingFoundationalLessons,
      missingMedicalSurgicalSystemLessons: missingMedSurgLessons,
      missingPharmacologyOrDosageMathLessons: missingPharmOrMath,
      missingSafetyPrioritizationDelegationTopics: missingSafetyPriorityDelegation,
      weakAlliedHealthCoverage: input.audits.alliedProfessionsWithWeakOrSparseCoverage,
      namingInconsistenciesAcrossTiers: input.audits.inconsistentNamingAcrossTiers,
      duplicateOrOverlappingLessonNames: input.audits.duplicateOrNearDuplicateLessonNames,
      lessonsInDataButNotExposedInRoutes: input.audits.lessonsInDataButNotExposedInRoutes,
      lessonsExposedInRoutesButMissingContent: input.audits.lessonsExposedInRoutesButMissingContent,
    },
    canonicalPlanningList: canonicalRows,
  };

  const csvHeader = [
    "lesson_title",
    "slug",
    "tier_group",
    "subgroup",
    "profession_tier_pathway",
    "source",
    "status",
    "notes",
    "recommended_action",
  ];
  const csvLines = [
    csvHeader.join(","),
    ...reviewRows.map((row) =>
      [
        row.lessonTitle,
        row.slug,
        row.tierGroup,
        row.subgroup,
        row.pathway,
        row.source,
        row.status,
        row.notes,
        row.recommendedAction,
      ]
        .map(csvEscape)
        .join(","),
    ),
  ];

  fs.writeFileSync(MARKDOWN_OUT, `${markdown.trim()}\n`);
  fs.writeFileSync(JSON_OUT, `${JSON.stringify(jsonOutput, null, 2)}\n`);
  fs.writeFileSync(CSV_OUT, `${csvLines.join("\n")}\n`);

  console.log(`Wrote ${path.relative(ROOT, MARKDOWN_OUT)}`);
  console.log(`Wrote ${path.relative(ROOT, JSON_OUT)}`);
  console.log(`Wrote ${path.relative(ROOT, CSV_OUT)}`);
}

main();
