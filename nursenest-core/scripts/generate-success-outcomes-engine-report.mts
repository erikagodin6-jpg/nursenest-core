import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  SUCCESS_STORY_CATEGORIES,
  SUCCESS_STORY_PROMPTS,
  buildOutcomesDashboard,
  buildSeoSuccessPage,
  buildSuccessWall,
  scoreSuccessStory,
  type SuccessStorySubmission,
} from "../src/lib/success/healthcare-student-success-engine";

const demoStories: SuccessStorySubmission[] = [
  {
    id: "demo-nclex-success",
    displayName: "Sarah Patel",
    school: "Northern College",
    country: "Canada",
    provinceOrState: "Ontario",
    profession: "Nursing",
    exam: "NCLEX-RN",
    category: "nclex_pass",
    outcome: "Passed NCLEX-RN",
    studyTimeWeeks: 10,
    preparationStrategy: "Daily CAT review, mixed question sets, rationales, and flashcard remediation tied to readiness weak areas.",
    featuresUsed: ["CAT Exams", "Question Bank", "Flashcards", "Readiness Dashboard"],
    adviceForFutureLearners: "Review why the tempting answers are wrong and connect every missed question to a lesson or flashcard deck.",
    story: "I moved from guessing by keywords to explaining the clinical priority behind each answer. The readiness dashboard helped me stop overstudying strong areas and focus on delegation, safety, and prioritization.",
    submittedAt: "2026-05-01T12:00:00.000Z",
    verifiedAt: "2026-05-10T12:00:00.000Z",
    status: "verified",
    consent: {
      mayUseForMarketing: true,
      mayUseName: true,
      mayUsePhoto: false,
      mayUseSchool: true,
      mayUseLocation: true,
      mayUseSeoPage: true,
    },
    verificationEvidence: ["learner-attestation", "email-confirmation"],
  },
  {
    id: "demo-placement-success",
    displayName: "Amina Lee",
    school: "Northern College",
    country: "Canada",
    provinceOrState: "Ontario",
    profession: "RPN/LPN",
    exam: "Clinical Placement",
    category: "clinical_placement_success",
    outcome: "Completed Clinical Placement",
    studyTimeWeeks: 6,
    preparationStrategy: "Reviewed clinical skills, medication safety, and patient education topics before each shift.",
    featuresUsed: ["Clinical Skills", "Medication Math", "Lessons"],
    adviceForFutureLearners: "Prepare for the patients you are likely to see on the unit, then reflect after each shift.",
    story: "The most helpful part was connecting skills to patient safety. I felt more prepared to explain what I was doing and why during medication passes and assessments.",
    submittedAt: "2026-05-02T12:00:00.000Z",
    verifiedAt: "2026-05-11T12:00:00.000Z",
    status: "verified",
    consent: {
      mayUseForMarketing: true,
      mayUseName: true,
      mayUsePhoto: false,
      mayUseSchool: true,
      mayUseLocation: true,
      mayUseSeoPage: true,
    },
    verificationEvidence: ["learner-attestation"],
  },
];

const dashboard = buildOutcomesDashboard(demoStories);
const wall = buildSuccessWall(demoStories);
const seoExample = buildSeoSuccessPage(demoStories[0]!);
const quality = scoreSuccessStory(demoStories[0]!);

const report = `# Healthcare Student Success Stories & Outcomes Engine

Generated: ${new Date().toISOString()}

## Implementation Summary

The success outcomes foundation is implemented in \`src/lib/success/healthcare-student-success-engine.ts\`.

It provides:

- Milestone prompts for exam passes, admissions, program completion, clinical placement, and first job outcomes.
- Structured story submission contracts with consent, verification, optional photo/video, school, location, profession, exam, strategy, features used, and learner advice.
- Quality scoring for completeness, authenticity, specificity, educational value, conversion value, and EEAT value.
- SEO success story page metadata with indexability gates.
- NurseNest Success Wall grouping for recent verified outcomes.
- Outcomes dashboard aggregation for exam passes, admissions, placements, program completions, and employment outcomes.
- Branded social sharing metadata.
- Institutional summaries by school for future B2B reporting.

## Collection Coverage

- Outcome categories: ${SUCCESS_STORY_CATEGORIES.length}
- Collection prompts: ${SUCCESS_STORY_PROMPTS.length}
- Public success wall demo items: ${wall.length}
- Verified demo stories: ${dashboard.totalVerifiedStories}

## Publication Guardrails

Stories are only indexable when they are:

- Verified or published.
- Marketing consented.
- SEO consented.
- Strong enough to pass the quality threshold.

Example SEO page:

- Title: ${seoExample.title}
- Slug: ${seoExample.slug}
- Canonical: ${seoExample.canonicalPath}
- Indexable: ${seoExample.indexable ? "Yes" : "No"}
- Quality score: ${quality.total}/100

## Dashboard Signals

- NCLEX passes: ${dashboard.nclexPasses}
- REx-PN passes: ${dashboard.rexPnPasses}
- NP certifications: ${dashboard.npCertifications}
- Admissions successes: ${dashboard.admissionsSuccesses}
- Clinical placement successes: ${dashboard.placementSuccesses}
- Employment outcomes: ${dashboard.employmentOutcomes}

## Next Integration Points

1. Wire collection prompts into post-exam check-ins, placement completion, onboarding admissions milestones, and referral success prompts.
2. Persist submissions in a reviewed outcomes table or CMS-backed content model.
3. Add admin verification workflow before public display.
4. Publish a Success Wall only after verified real learner stories exist.
5. Connect outcomes summaries to Growth & Revenue Command Center and institutional reporting.
`;

const reportPath = path.join(process.cwd(), "docs/reports/healthcare-student-success-outcomes-engine.md");
await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, report);
console.log(`Wrote ${reportPath}`);

