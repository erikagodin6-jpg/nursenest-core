import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  ADMISSIONS_GUIDE_SEEDS,
  APPLICATION_TIMELINE_TEMPLATE,
  PROGRAM_COMPARISON_SEEDS,
  PROGRAM_DIRECTORY_ENTRIES,
  PROVINCE_PROGRAM_HUBS,
  SCHOOL_REVIEW_GOVERNANCE,
  buildAcceptanceChance,
  buildSchoolDirectoryDashboard,
} from "../src/lib/seo/healthcare-school-directory-authority-engine";

const outPath = join(process.cwd(), "docs", "reports", "healthcare-school-directory-program-finder-authority-engine.md");
const dashboard = buildSchoolDirectoryDashboard();
const sampleChance = buildAcceptanceChance({ grades: 84, prerequisitesComplete: 4, province: "Ontario", programInterest: "RN" });

const markdown = `# Healthcare School Directory & Program Finder Authority Engine

Generated: ${new Date().toISOString()}

## Objective

Build a comprehensive healthcare education program directory for Canada and future international expansion. This is an early-funnel acquisition engine for high school students, mature students, career changers, international applicants, pre-nursing students, and allied health applicants.

## Directory Summary

| Metric | Count |
| --- | ---: |
| Program pages seeded | ${dashboard.programPages} |
| Province hubs seeded | ${dashboard.provinceHubs} |
| Comparison pages seeded | ${dashboard.comparisonPages} |
| Admissions guides seeded | ${dashboard.admissionsGuides} |
| Remaining to 500 program page target | ${dashboard.remainingToProgramPageTarget} |

## Year 1 Targets

- Program pages: ${dashboard.yearOneTargets.programPages}
- Comparison pages: ${dashboard.yearOneTargets.comparisonPages}
- Admissions guides: ${dashboard.yearOneTargets.admissionsGuides}
- Province hubs: ${dashboard.yearOneTargets.provinceHubs}

## Program Directory Seeds

| Page | School | Program | Profession | Province | City | Length |
| --- | --- | --- | --- | --- | --- | --- |
${PROGRAM_DIRECTORY_ENTRIES.map((entry) => `| ${entry.title} | ${entry.schoolName} | ${entry.programName} | ${entry.profession} | ${entry.province} | ${entry.city} | ${entry.lengthLabel} |`).join("\n")}

## Required Program Page Blocks

Every program page includes:

${PROGRAM_DIRECTORY_ENTRIES[0]!.pageBlocks.map((block) => `- ${block}`).join("\n")}

## Province Hubs

| Hub | Province | Profession | Path | Seed Programs |
| --- | --- | --- | --- | ---: |
${PROVINCE_PROGRAM_HUBS.map((hub) => `| ${hub.title} | ${hub.province} | ${hub.profession} | ${hub.canonicalPath} | ${hub.programSlugs.length} |`).join("\n")}

## Comparison Pages

| Page | Type | Intent |
| --- | --- | --- |
${PROGRAM_COMPARISON_SEEDS.map((seed) => `| ${seed.title} | ${seed.comparisonType} | ${seed.intent} |`).join("\n")}

## Admissions Guides

| Guide | Profession | Path |
| --- | --- | --- |
${ADMISSIONS_GUIDE_SEEDS.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.canonicalPath} |`).join("\n")}

## Acceptance Chance Tool Contract

Inputs:

- Grades
- Prerequisites
- Province
- Program Interest

Sample result:

- Competitiveness: ${sampleChance.competitiveness}
- Suggested programs: ${sampleChance.suggestedProgramSlugs.join(", ") || "None in seed set"}
- Recommendations: ${sampleChance.preparationRecommendations.join("; ")}

## Application Timeline Template

${APPLICATION_TIMELINE_TEMPLATE.map((item) => `- ${item.phase}: ${item.timing} — ${item.action}`).join("\n")}

## School Review Governance

- Moderation required: ${SCHOOL_REVIEW_GOVERNANCE.moderationRequired ? "Yes" : "No"}
- Supported review types: ${SCHOOL_REVIEW_GOVERNANCE.supportedTypes.join(", ")}
- Quality controls: ${SCHOOL_REVIEW_GOVERNANCE.qualityControls.join(", ")}

## Conversion Strategy

Every program page offers account-gated:

- Free Admissions Checklist
- Program Comparison PDF
- Application Timeline
- Study Starter Pack

## SEO Targets

Every page targets:

${PROGRAM_DIRECTORY_ENTRIES[0]!.seoTargets.map((target) => `- ${target}`).join("\n")}

## Internal Linking

Every program page links to:

${PROGRAM_DIRECTORY_ENTRIES[0]!.internalLinks.map((link) => `- ${link}`).join("\n")}

## Guardrails

- Directory pages must be useful to prospective students before they are ready for exam preparation.
- Program information should be reviewable and source-backed before public publication.
- Reviews require moderation and must avoid personal health information or defamatory claims.
- Admissions tools should provide educational competitiveness guidance, not guarantees.
- This registry does not change hidden HESI/TEAS/CASPER product launch gates.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);
