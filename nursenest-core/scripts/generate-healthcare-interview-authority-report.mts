import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  ALLIED_INTERVIEW_LIBRARY_SEEDS,
  BEHAVIORAL_INTERVIEW_DOMAINS,
  CLINICAL_INTERVIEW_DOMAINS,
  HIRING_MANAGER_INSIGHTS,
  INTERVIEW_PROFESSION_HUBS,
  INTERVIEW_QUESTION_SEEDS,
  MOCK_INTERVIEW_SYSTEM_CONTRACT,
  NEW_GRAD_INTERVIEW_CENTERS,
  NURSING_INTERVIEW_LIBRARY_SEEDS,
  SPECIALTY_INTERVIEW_TRACKS,
  STAR_RESPONSE_ENGINE,
  buildInterviewAuthorityDashboard,
} from "../src/lib/seo/healthcare-interview-authority-engine";

const outPath = join(process.cwd(), "docs", "reports", "healthcare-interview-question-authority-platform.md");
const dashboard = buildInterviewAuthorityDashboard();

const markdown = `# Healthcare Interview Question Authority Platform

Generated: ${new Date().toISOString()}

## Objective

Build Canada's largest healthcare interview preparation ecosystem, with long-term North American and international expansion. The system targets students, new graduates, career changers, experienced clinicians, internationally educated professionals, and healthcare leaders before and after certification preparation.

## Registry Summary

| Metric | Count |
| --- | ---: |
| Profession interview hubs | ${dashboard.professionHubs} |
| Nursing interview libraries | ${dashboard.nursingLibraries} |
| Allied health interview libraries | ${dashboard.alliedLibraries} |
| New graduate centers | ${dashboard.newGraduateCenters} |
| Specialty tracks | ${dashboard.specialtyTracks} |
| Behavioral domains | ${dashboard.behavioralDomains} |
| Clinical domains | ${dashboard.clinicalDomains} |
| Question seeds | ${dashboard.questionSeeds} |
| Year 1 page target | ${dashboard.yearOneTargetPages} |
| Remaining pages to target | ${dashboard.remainingYearOnePages} |

## Scale Dimensions

Year 1 production should expand across:

${dashboard.scaleDimensions.map((dimension) => `- ${dimension}`).join("\n")}

## Profession Interview Hubs

| Hub | Profession | Canonical Path | Audiences |
| --- | --- | --- | --- |
${INTERVIEW_PROFESSION_HUBS.map((hub) => `| ${hub.title} | ${hub.profession} | ${hub.canonicalPath} | ${hub.targetAudience.join(", ")} |`).join("\n")}

## Nursing Interview Library

| Page | Profession | Target Questions | Category |
| --- | --- | ---: | --- |
${NURSING_INTERVIEW_LIBRARY_SEEDS.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.minQuestions}-${seed.maxQuestions} | ${seed.category} |`).join("\n")}

## Allied Health Interview Libraries

| Page | Profession | Target Questions | Category |
| --- | --- | ---: | --- |
${ALLIED_INTERVIEW_LIBRARY_SEEDS.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.minQuestions}-${seed.maxQuestions} | ${seed.category} |`).join("\n")}

## Question Structure Contract

Every interview question includes:

${INTERVIEW_QUESTION_SEEDS[0]!.requiredBlocks.map((block) => `- ${block}`).join("\n")}

## STAR Response Engine

Framework:

${STAR_RESPONSE_ENGINE.framework.map((step) => `- ${step}`).join("\n")}

Example sources:

${STAR_RESPONSE_ENGINE.exampleSources.map((source) => `- ${source}`).join("\n")}

Output requirements:

${STAR_RESPONSE_ENGINE.outputRequirements.map((item) => `- ${item}`).join("\n")}

## Specialty Interview Tracks

${SPECIALTY_INTERVIEW_TRACKS.map((track) => `- ${track}`).join("\n")}

## Behavioral Question Library

${BEHAVIORAL_INTERVIEW_DOMAINS.map((domain) => `- ${domain}`).join("\n")}

## Clinical Interview Library

${CLINICAL_INTERVIEW_DOMAINS.map((domain) => `- ${domain}`).join("\n")}

## New Graduate Interview Center

| Page | Profession | Target Questions |
| --- | --- | ---: |
${NEW_GRAD_INTERVIEW_CENTERS.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.minQuestions}-${seed.maxQuestions} |`).join("\n")}

## Hiring Manager Insights

What hiring managers want:

${HIRING_MANAGER_INSIGHTS.whatHiringManagersWant.map((item) => `- ${item}`).join("\n")}

What hiring managers dislike:

${HIRING_MANAGER_INSIGHTS.whatHiringManagersDislike.map((item) => `- ${item}`).join("\n")}

Common interview mistakes:

${HIRING_MANAGER_INSIGHTS.commonInterviewMistakes.map((item) => `- ${item}`).join("\n")}

Resume mistakes:

${HIRING_MANAGER_INSIGHTS.resumeMistakes.map((item) => `- ${item}`).join("\n")}

Professional communication tips:

${HIRING_MANAGER_INSIGHTS.professionalCommunicationTips.map((item) => `- ${item}`).join("\n")}

## Mock Interview System Contract

Status: ${MOCK_INTERVIEW_SYSTEM_CONTRACT.launchStatus}

Capabilities:

${MOCK_INTERVIEW_SYSTEM_CONTRACT.capabilities.map((capability) => `- ${capability}`).join("\n")}

Gate: ${MOCK_INTERVIEW_SYSTEM_CONTRACT.gatedUntilReady ? "Future integration remains gated until ready." : "No gate configured."}

## Seed Question Examples

| Question | Profession | Stage | Specialty | Behavioral Domain | Clinical Domain |
| --- | --- | --- | --- | --- | --- |
${INTERVIEW_QUESTION_SEEDS.map((seed) => `| ${seed.question} | ${seed.profession} | ${seed.careerStage} | ${seed.specialty ?? ""} | ${seed.behavioralDomain ?? ""} | ${seed.clinicalDomain ?? ""} |`).join("\n")}

## Internal Linking

Every interview page links to:

${INTERVIEW_QUESTION_SEEDS[0]!.internalLinks.map((link) => `- ${link}`).join("\n")}

## Lead Generation

Account-gated lead magnets:

${INTERVIEW_QUESTION_SEEDS[0]!.leadMagnets.map((magnet) => `- ${magnet}`).join("\n")}

## SEO Targets

${INTERVIEW_PROFESSION_HUBS[0]!.seoTargets.map((target) => `- ${target}`).join("\n")}

## Guardrails

- Do not publish generic interview filler.
- Every question should explain what employers are assessing and how strong answers differ from weak answers.
- Clinical interview answers must preserve scope, safety, escalation, and professional judgment.
- New graduate answers should avoid overstating independence.
- Mock interview capabilities remain future-gated until product, privacy, feedback, and scoring requirements are ready.
- Interview pages should feed users into career guides, salary pages, school pages, certification guides, new graduate resources, clinical skills, and professional development.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);
