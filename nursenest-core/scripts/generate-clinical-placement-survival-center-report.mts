import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  CLINICAL_CHECKLISTS,
  CLINICAL_CONFIDENCE_CENTER_TOPICS,
  CLINICAL_DOCUMENTATION_HUB_PAGES,
  CLINICAL_SKILLS_PREP_PAGES,
  FIRST_DAY_GUIDES,
  INSTRUCTOR_QUESTION_LIBRARIES,
  PLACEMENT_PROFESSION_HUBS,
  PLACEMENT_SUCCESS_STORY_CONTRACT,
  QUICK_PREP_PAGES,
  UNIT_SPECIFIC_GUIDES,
  buildClinicalPlacementSurvivalDashboard,
} from "../src/lib/seo/clinical-placement-survival-center";

const outPath = join(process.cwd(), "docs", "reports", "clinical-placement-survival-center.md");
const dashboard = buildClinicalPlacementSurvivalDashboard();

const markdown = `# Clinical Placement Survival Center

Generated: ${new Date().toISOString()}

## Objective

Build a comprehensive clinical placement preparation and success platform for healthcare students. This authority center targets pre-nursing, nursing, RT, paramedic, OT, PT, MLT, and PSW learners before graduation and before licensing examinations.

## Registry Summary

| Metric | Count |
| --- | ---: |
| Profession placement hubs | ${dashboard.professionHubs} |
| First day guides | ${dashboard.firstDayGuides} |
| Downloadable checklists | ${dashboard.checklists} |
| Instructor question libraries | ${dashboard.instructorQuestionLibraries} |
| Unit-specific guides | ${dashboard.unitGuides} |
| Quick-prep pages | ${dashboard.quickPrepPages} |
| Clinical skills prep pages | ${dashboard.skillsPrepPages} |
| Documentation hub pages | ${dashboard.documentationPages} |
| Confidence topics | ${dashboard.confidenceTopics} |
| Year 1 page target | ${dashboard.yearOneTargetPages} |
| Remaining pages to target | ${dashboard.remainingYearOnePages} |

## Scale Dimensions

Year 1 production should expand across:

${dashboard.scaleDimensions.map((dimension) => `- ${dimension}`).join("\n")}

## Profession-Specific Placement Hubs

| Hub | Profession | Canonical Path | Audience |
| --- | --- | --- | --- |
${PLACEMENT_PROFESSION_HUBS.map((hub) => `| ${hub.title} | ${hub.profession} | ${hub.canonicalPath} | ${hub.audience.join(", ")} |`).join("\n")}

## First Day Of Clinical Guides

| Guide | Profession | Required Blocks |
| --- | --- | --- |
${FIRST_DAY_GUIDES.map((guide) => `| ${guide.title} | ${guide.profession} | ${guide.requiredBlocks.join(", ")} |`).join("\n")}

## Clinical Checklists

| Resource | Profession | Type |
| --- | --- | --- |
${CLINICAL_CHECKLISTS.map((checklist) => `| ${checklist.title} | ${checklist.profession} | ${checklist.checklistType} |`).join("\n")}

## Instructor Question Libraries

| Library | Profession | Target Questions | Required Blocks |
| --- | --- | ---: | --- |
${INSTRUCTOR_QUESTION_LIBRARIES.map((library) => `| ${library.title} | ${library.profession} | ${library.targetQuestions} | ${library.requiredBlocks.join(", ")} |`).join("\n")}

## Unit-Specific Guides

| Guide | Unit | Professions |
| --- | --- | --- |
${UNIT_SPECIFIC_GUIDES.map((guide) => `| ${guide.title} | ${guide.unit} | ${guide.professions.join(", ")} |`).join("\n")}

## What Should I Know Tonight Pages

| Page | Focus | Professions | Preparation Focus |
| --- | --- | --- | --- |
${QUICK_PREP_PAGES.map((page) => `| ${page.title} | ${page.conditionOrRotation} | ${page.professions.join(", ")} | ${page.preparationFocus.join(", ")} |`).join("\n")}

## Clinical Skills Prep

| Page | Profession | Skills Passport |
| --- | --- | --- |
${CLINICAL_SKILLS_PREP_PAGES.map((page) => `| ${page.title} | ${page.profession} | ${page.linksToSkillsPassport ? "Required" : "Not required"} |`).join("\n")}

## Clinical Documentation Hub

${CLINICAL_DOCUMENTATION_HUB_PAGES.map((page) => `- ${page}`).join("\n")}

## Clinical Confidence Center

${CLINICAL_CONFIDENCE_CENTER_TOPICS.map((topic) => `- ${topic}`).join("\n")}

## Placement Success Stories

Supported story types:

${PLACEMENT_SUCCESS_STORY_CONTRACT.supportedStories.map((story) => `- ${story}`).join("\n")}

EEAT benefits:

${PLACEMENT_SUCCESS_STORY_CONTRACT.eeatBenefit.map((benefit) => `- ${benefit}`).join("\n")}

Consent required: ${PLACEMENT_SUCCESS_STORY_CONTRACT.requiresConsent ? "Yes" : "No"}

## Internal Linking

Every placement page links to:

${FIRST_DAY_GUIDES[0]!.internalLinks.map((link) => `- ${link}`).join("\n")}

## Lead Generation

Account-gated resources:

${FIRST_DAY_GUIDES[0]!.leadMagnets.map((magnet) => `- ${magnet}`).join("\n")}

## SEO Targets

${FIRST_DAY_GUIDES[0]!.seoTargets.map((target) => `- ${target}`).join("\n")}

## Guardrails

- Placement content must be profession-specific, not nursing copy relabeled for allied health.
- First-day guides must include preparation, expectations, documentation, communication, mistakes, and confidence support.
- Instructor question libraries must teach clinical reasoning, not just memorize answers.
- Quick-prep pages should connect condition knowledge to the next shift or rotation.
- Success stories require consent and should strengthen experience, trust, and profession-specific context.
- Public pages should feed students into clinical skills, lessons, flashcards, questions, simulations, new graduate resources, interview content, and career guides.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);
