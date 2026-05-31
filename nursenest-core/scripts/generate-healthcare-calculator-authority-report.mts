import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  CLINICAL_TOOL_HUBS,
  HEALTHCARE_CALCULATOR_TOOLS,
  buildClinicalToolAuthorityDashboard,
  clinicalToolPriorityScore,
  getToolsForHub,
} from "../src/lib/tools/healthcare-calculator-authority-engine";

const outPath = join(process.cwd(), "docs", "reports", "healthcare-calculator-clinical-tool-authority-engine.md");
const dashboard = buildClinicalToolAuthorityDashboard();
const topTools = [...HEALTHCARE_CALCULATOR_TOOLS]
  .map((tool) => ({ ...tool, priorityScore: clinicalToolPriorityScore(tool) }))
  .sort((a, b) => b.priorityScore - a.priorityScore)
  .slice(0, 20);

const markdown = `# Healthcare Calculator & Clinical Tool Authority Engine

Generated: ${new Date().toISOString()}

## Objective

Build NurseNest into a destination for healthcare learner calculators, clinical tools, scoring systems, interpretation aids, and educational resources.

The calculator ecosystem should function as a traffic engine, authority engine, backlink engine, conversion engine, and repeat visitor engine.

## Registry Summary

| Metric | Count |
| --- | ---: |
| Seed tools | ${dashboard.totalTools} |
| Free visitor-use tools | ${dashboard.freeUseTools} |
| Learning-mode coverage | ${dashboard.learningModeCoverage} |
| Year 1 target | ${dashboard.yearOneTarget} |
| Year 2 target | ${dashboard.yearTwoTarget} |
| Year 3 target | ${dashboard.yearThreeTarget} |
| Remaining to Year 1 target | ${dashboard.remainingToYearOneTarget} |

## Tools By Hub

${Object.entries(dashboard.toolsByHub).map(([hub, count]) => `- ${hub}: ${count}`).join("\n")}

## Tools By Category

${Object.entries(dashboard.toolsByCategory).map(([category, count]) => `- ${category}: ${count}`).join("\n")}

## Tools By Profession

${Object.entries(dashboard.toolsByProfession).map(([profession, count]) => `- ${profession}: ${count}`).join("\n")}

## Highest Priority Tools

| Tool | Profession | Category | Hub | Priority Score |
| --- | --- | --- | --- | ---: |
${topTools.map((tool) => `| ${tool.title} | ${tool.profession} | ${tool.category} | ${tool.hub} | ${tool.priorityScore} |`).join("\n")}

## Tool Hubs

${CLINICAL_TOOL_HUBS.map((hub) => {
  const tools = getToolsForHub(hub.key);
  return `### ${hub.title}

- Profession: ${hub.profession}
- Canonical path: ${hub.canonicalPath}
- Seed tools: ${tools.length}
- Examples: ${tools.slice(0, 8).map((tool) => tool.title).join(", ")}
`;
}).join("\n")}

## Required SEO Page Blocks

Every tool page includes:

- What It Is
- Why It Matters
- How It Is Used
- Clinical Interpretation
- Common Mistakes
- Practice Examples
- Educational Explanation
- Related Lessons
- Related Questions
- Related Flashcards
- Related Simulations

## Educational Mode

Every calculator supports Calculator Mode and Learning Mode.

Learning Mode includes:

- Formula
- Explanation
- Clinical Significance
- Interpretation
- Examples

## Account Conversion Strategy

Visitors can use tools freely.

Account creation is required for:

${dashboard.accountConversionActions.map((action) => `- ${action}`).join("\n")}

## Backlink Strategy

Tools should be designed as:

- Reference resources
- Educational resources
- Faculty resources
- Student resources
- Shareable resources

## Internal Linking Requirements

Every calculator links to:

- Related diseases
- Related lessons
- Related skills
- Related questions
- Related simulations
- Related care plans
- Related study guides

## Guardrails

- Tool calculations and interpretations must be educational and must not replace clinical judgment.
- Visitors may calculate freely; saved history, notes, bookmarks, and advanced reports require accounts.
- Each tool page must teach the formula and interpretation rather than acting as a bare input box.
- Tool pages should link into NurseNest lessons, questions, flashcards, simulations, care plans, and study guides.
- High-risk medication, pediatric, respiratory, and diagnostic tools require enhanced review before publication.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);
