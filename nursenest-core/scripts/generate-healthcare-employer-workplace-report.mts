import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  CLINICAL_PLACEMENT_CONNECTIONS,
  EMPLOYER_DIRECTORY_SEEDS,
  EMPLOYER_INTERVIEW_GUIDE_SEEDS,
  NEW_GRAD_PROGRAM_SEEDS,
  PROFESSION_EMPLOYER_PAGE_SEEDS,
  SPECIALTY_CAREER_GUIDE_SEEDS,
  WORKPLACE_COMPARISON_SEEDS,
  WORKPLACE_CULTURE_BLOCKS,
  buildEmployerWorkplaceDashboard,
} from "../src/lib/seo/healthcare-employer-workplace-intelligence";

const outPath = join(process.cwd(), "docs", "reports", "healthcare-employer-hospital-workplace-intelligence-platform.md");
const dashboard = buildEmployerWorkplaceDashboard();

const markdown = `# Healthcare Employer, Hospital & Workplace Intelligence Platform

Generated: ${new Date().toISOString()}

## Objective

Build a comprehensive healthcare employer and workplace database for Canada, with long-term North American expansion. This platform supports students, new graduates, career changers, healthcare professionals, and international applicants before and after licensure.

## Source Integrity Rule

Employer pages should not publish unsourced claims about workplace culture, benefits, residencies, placements, or hiring processes. Every profile requires official or public employer evidence, review dates, and methodology notes before publication.

## Registry Summary

| Metric | Count |
| --- | ---: |
| Employer profile seeds | ${dashboard.employerPages} |
| Profession-specific employer pages | ${dashboard.professionPages} |
| New graduate program pages | ${dashboard.newGradProgramPages} |
| Workplace comparisons | ${dashboard.workplaceComparisons} |
| Specialty career pages | ${dashboard.specialtyCareerPages} |
| Employer interview pages | ${dashboard.employerInterviewPages} |
| Workplace culture blocks | ${dashboard.workplaceCultureBlocks} |
| Remaining to 500 employer pages | ${dashboard.remainingEmployerPagesTarget} |

## Year 1 Targets

- Employer pages: ${dashboard.yearOneTargets.employerPages}
- Specialty career pages: ${dashboard.yearOneTargets.specialtyCareerPages}
- Residency pages: ${dashboard.yearOneTargets.residencyPages}
- Interview pages: ${dashboard.yearOneTargets.interviewPages}

## Employer Directory

| Employer | Kind | Province | Required Blocks |
| --- | --- | --- | --- |
${EMPLOYER_DIRECTORY_SEEDS.map((seed) => `| ${seed.name} | ${seed.kind} | ${seed.province} | ${seed.requiredBlocks.join(", ")} |`).join("\n")}

## Evidence Requirements

${EMPLOYER_DIRECTORY_SEEDS[0]!.evidenceRequirements.map((item) => `- ${item}`).join("\n")}

## Profession-Specific Pages

| Page | Profession | Employer | Region | Kind |
| --- | --- | --- | --- | --- |
${PROFESSION_EMPLOYER_PAGE_SEEDS.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.employerName ?? ""} | ${seed.region ?? ""} | ${seed.pageKind} |`).join("\n")}

## New Graduate Program Database

| Page | Profession | Program Kind |
| --- | --- | --- |
${NEW_GRAD_PROGRAM_SEEDS.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.programKind} |`).join("\n")}

## Workplace Comparisons

| Page | Kind | Subjects |
| --- | --- | --- |
${WORKPLACE_COMPARISON_SEEDS.map((seed) => `| ${seed.title} | ${seed.comparisonKind} | ${seed.subjects.join(", ")} |`).join("\n")}

## Specialty Career Guides

| Page | Profession | Specialty |
| --- | --- | --- |
${SPECIALTY_CAREER_GUIDE_SEEDS.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.specialty} |`).join("\n")}

## Employer Interview Guides

| Page | Profession | Employer | Region |
| --- | --- | --- | --- |
${EMPLOYER_INTERVIEW_GUIDE_SEEDS.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.employerName ?? ""} | ${seed.region ?? ""} |`).join("\n")}

## Workplace Culture Content

Each workplace profile can include:

${WORKPLACE_CULTURE_BLOCKS.map((block) => `- ${block}`).join("\n")}

## Clinical Placement Connections

${Object.entries(CLINICAL_PLACEMENT_CONNECTIONS).map(([key, enabled]) => `- ${key}: ${enabled ? "connected" : "not connected"}`).join("\n")}

## Internal Linking

Every employer page links to:

${EMPLOYER_DIRECTORY_SEEDS[0]!.internalLinks.map((link) => `- ${link}`).join("\n")}

## Lead Generation

Account-gated resources:

${EMPLOYER_DIRECTORY_SEEDS[0]!.leadMagnets.map((magnet) => `- ${magnet}`).join("\n")}

## SEO Targets

${EMPLOYER_DIRECTORY_SEEDS[0]!.seoTargets.map((target) => `- ${target}`).join("\n")}

## Guardrails

- Do not publish workplace culture, benefit, residency, or hiring claims without source-backed review.
- Separate official employer facts from student or employee experience content.
- Reviews and workplace stories require moderation and consent before publication.
- Employer profiles should connect schools, programs, placements, employers, and career pathways.
- Public employer pages should feed users into new graduate, career development, interview preparation, certification preparation, and professional development.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);
