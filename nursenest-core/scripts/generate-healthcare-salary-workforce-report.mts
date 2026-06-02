import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  CAREER_COMPARISON_SEEDS,
  CAREER_OUTLOOK_SEEDS,
  EDUCATION_COST_MODEL,
  JOB_MARKET_SIGNAL_SEEDS,
  SALARY_PAGE_SEEDS,
  buildSalaryWorkforceDashboard,
  calculateEducationRoi,
} from "../src/lib/seo/healthcare-salary-workforce-authority-engine";

const outPath = join(process.cwd(), "docs", "reports", "healthcare-salary-career-outlook-workforce-authority-platform.md");
const dashboard = buildSalaryWorkforceDashboard();
const roi = calculateEducationRoi({
  educationCostCents: 2400000,
  expectedAnnualSalaryCents: 8200000,
  currentAnnualIncomeCents: 4200000,
  yearsToComplete: 2,
});

const markdown = `# Healthcare Salary, Career Outlook & Workforce Authority Platform

Generated: ${new Date().toISOString()}

## Objective

Build a comprehensive, source-backed healthcare career and salary database for Canada, with long-term North American expansion. This is a top-of-funnel acquisition engine for students, career changers, new graduates, healthcare workers, and international applicants before certification preparation begins.

## Source Integrity Rule

Salary pages should not publish unsourced wage figures. Every page requires current evidence, methodology notes, and review dates before public publication.

## Registry Summary

| Metric | Count |
| --- | ---: |
| Salary page seeds | ${dashboard.salaryPages} |
| Career outlook page seeds | ${dashboard.outlookPages} |
| Comparison page seeds | ${dashboard.comparisonPages} |
| Province salary page seeds | ${dashboard.provincePages} |
| Specialty salary page seeds | ${dashboard.specialtyPages} |
| Remaining to 500 salary pages | ${dashboard.remainingSalaryPagesTarget} |

## Year 1 Targets

- Salary pages: ${dashboard.yearOneTargets.salaryPages}
- Outlook pages: ${dashboard.yearOneTargets.outlookPages}
- Comparison pages: ${dashboard.yearOneTargets.comparisonPages}
- Province pages: ${dashboard.yearOneTargets.provincePages}

## Salary Page Seeds

| Page | Profession | Province | Kind | Specialty |
| --- | --- | --- | --- | --- |
${SALARY_PAGE_SEEDS.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.province} | ${seed.pageKind} | ${seed.specialty ?? ""} |`).join("\n")}

## Required Salary Page Blocks

${SALARY_PAGE_SEEDS[0]!.requiredBlocks.map((block) => `- ${block}`).join("\n")}

## Evidence Requirements

${SALARY_PAGE_SEEDS[0]!.evidenceRequirements.map((item) => `- ${item}`).join("\n")}

## Career Outlook Pages

| Page | Profession | Required Blocks |
| --- | --- | --- |
${CAREER_OUTLOOK_SEEDS.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.requiredBlocks.join(", ")} |`).join("\n")}

## Career Comparisons

| Page | Professions | Comparison Factors |
| --- | --- | --- |
${CAREER_COMPARISON_SEEDS.map((seed) => `| ${seed.title} | ${seed.professions.join(" vs ")} | ${seed.comparisonFactors.join(", ")} |`).join("\n")}

## Cost Of Education Model

${Object.entries(EDUCATION_COST_MODEL).map(([key, enabled]) => `- ${key}: ${enabled ? "included" : "not included"}`).join("\n")}

## ROI Calculator Contract

Inputs:

- Education Cost
- Expected Salary
- Current Income
- Years To Complete

Sample output:

- Annual income lift: $${(roi.annualIncomeLiftCents / 100).toFixed(2)}
- Payback period: ${roi.paybackYears} years
- Five-year net: $${(roi.fiveYearNetCents / 100).toFixed(2)}
- Ten-year net: $${(roi.tenYearNetCents / 100).toFixed(2)}

## Job Market Database

| Profession | Province | Demand | Hiring Trend | Shortage Area | Remote Opportunities |
| --- | --- | --- | --- | --- | --- |
${JOB_MARKET_SIGNAL_SEEDS.map((signal) => `| ${signal.profession} | ${signal.province} | ${signal.regionalDemand} | ${signal.hiringTrend} | ${signal.shortageArea ? "Yes" : "No"} | ${signal.remoteOpportunities} |`).join("\n")}

## Internal Linking

Every salary page links to:

${SALARY_PAGE_SEEDS[0]!.internalLinks.map((link) => `- ${link}`).join("\n")}

## Lead Generation

Every salary/outlook/comparison page can offer:

${SALARY_PAGE_SEEDS[0]!.conversionAssets.map((asset) => `- ${asset}`).join("\n")}

## SEO Targets

Every salary page targets:

${SALARY_PAGE_SEEDS[0]!.seoTargets.map((target) => `- ${target}`).join("\n")}

## Guardrails

- Do not publish specific salary values without current, cited evidence.
- Salary, demand, and ROI pages require review dates and methodology notes.
- ROI outputs are educational estimates, not guarantees.
- Job market signals must separate source-backed data from directional editorial interpretation.
- Salary pages should feed users into admissions, school directories, certification guides, interview guides, placement guides, and study resources.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);
