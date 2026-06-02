import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  GLOSSARY_HUBS,
  HEALTHCARE_GLOSSARY_TERMS,
  buildGlossaryAuthorityDashboard,
  buildGlossaryPageContract,
  getTermsForHub,
  glossaryPriorityScore,
} from "../src/lib/seo/healthcare-glossary-authority-engine";

const outPath = join(process.cwd(), "docs", "reports", "healthcare-glossary-terminology-authority-engine.md");
const dashboard = buildGlossaryAuthorityDashboard();
const topTerms = [...HEALTHCARE_GLOSSARY_TERMS]
  .map((term) => ({ ...term, priorityScore: glossaryPriorityScore(term) }))
  .sort((a, b) => b.priorityScore - a.priorityScore)
  .slice(0, 15);
const sampleContract = buildGlossaryPageContract(HEALTHCARE_GLOSSARY_TERMS[0]!);

const markdown = `# Healthcare Glossary & Terminology Authority Engine

Generated: ${new Date().toISOString()}

## Objective

Build a comprehensive healthcare learner glossary that captures terminology searches at scale while strengthening internal linking, learner education, and conversion paths.

## Master Terminology Database

Each glossary term stores:

- Healthcare term
- Definition
- Pronunciation
- Profession
- Category
- Difficulty
- System
- Related terms
- Related diseases
- Related skills
- Related medications
- Related lessons
- Search intent patterns
- Visual terminology assets

## Seed Inventory

| Metric | Count |
| --- | ---: |
| Current seed terms | ${dashboard.totalTerms} |
| Visual terminology terms | ${dashboard.visualTerminologyTerms} |
| Year 1 minimum target | ${dashboard.yearOneTargetMin.toLocaleString()} |
| Year 1 maximum target | ${dashboard.yearOneTargetMax.toLocaleString()} |
| Remaining to minimum target | ${dashboard.remainingToMinimumTarget.toLocaleString()} |

## Terms By Profession

${Object.entries(dashboard.termsByProfession).map(([profession, count]) => `- ${profession}: ${count}`).join("\n")}

## Terms By Category

${Object.entries(dashboard.termsByCategory).map(([category, count]) => `- ${category}: ${count}`).join("\n")}

## Terms By System

${Object.entries(dashboard.termsBySystem).map(([system, count]) => `- ${system}: ${count}`).join("\n")}

## Highest Priority Seed Terms

| Term | Profession | Category | System | Priority Score |
| --- | --- | --- | --- | ---: |
${topTerms.map((term) => `| ${term.term} | ${term.profession} | ${term.category} | ${term.system} | ${term.priorityScore} |`).join("\n")}

## Required Page Structure

Every term page must include:

${sampleContract.requiredBlocks.map((block) => `- ${block}`).join("\n")}

## Internal Linking Requirements

Every term page must connect to:

${sampleContract.requiredInternalLinks.map((link) => `- ${link}`).join("\n")}

## Conversion Strategy

- Create account CTA: ${sampleContract.createAccountCta}
- Premium preview CTA: ${sampleContract.premiumPreviewCta}
- Conversion previews: ${sampleContract.conversionFeatures.join(", ")}

## Glossary Hubs

${GLOSSARY_HUBS.map((hub) => {
  const terms = getTermsForHub(hub);
  return `### ${hub.title}

- Profession: ${hub.profession}
- Canonical path: ${hub.canonicalPath}
- Seed terms: ${terms.length}
- Examples: ${terms.slice(0, 8).map((term) => term.term).join(", ")}
`;
}).join("\n")}

## Search Intent Coverage

Term pages should support:

- What is...
- What does ... mean?
- Difference between...
- Why is ... important?
- How is ... used?
- When is ... used?

## Publication Guardrails

- Do not create glossary pages solely because a term exists.
- Publish only terms with meaningful definitions, clinical relevance, internal links, and conversion paths.
- Use diagrams, tables, flowcharts, or clinical examples wherever the term is visual or process-based.
- Keep profession-specific language authentic; do not label nursing definitions as allied-health content.
- Link glossary pages into lessons, questions, simulations, care plans, labs, skills, and medication pages.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);
