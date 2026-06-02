import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import {
  ADMISSION_EXAM_PRODUCTS,
  ADMISSION_EXAM_ACTIVITY_REQUIREMENTS,
  ADMISSIONS_SUBSCRIPTION_STRATEGY,
  FUTURE_ADMISSION_EXAMS,
  getAdmissionExamProductBySlug,
} from "@/lib/admissions/admissions-entrance-exams";

const ROOT = process.cwd();

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

describe("Admissions & Entrance Exams ecosystem", () => {
  it("exposes ATI TEAS, HESI A2, and CASPER as first-class admissions products", () => {
    assert.deepEqual(
      ADMISSION_EXAM_PRODUCTS.map((product) => product.slug),
      ["ati-teas", "hesi-a2", "casper"],
    );

    for (const product of ADMISSION_EXAM_PRODUCTS) {
      assert.match(product.canonicalPath, /^\/pre-nursing\/(ati-teas|hesi-a2|casper)$/);
      assert.equal(product.supportsCatExams, false, `${product.shortTitle} should not use CAT exams`);
      for (const requirement of ADMISSION_EXAM_ACTIVITY_REQUIREMENTS) {
        if (requirement === "Overview") assert.ok(product.overview.length > 100);
        else if (requirement === "Exam breakdown") assert.ok(product.examBreakdown.length >= 4);
        else if (requirement === "Study plan") assert.ok(product.studyPlan.length >= 4);
        else {
          const activities = product.learningActivities.map((activity) => activity.toLowerCase());
          assert.ok(activities.includes(requirement.toLowerCase()), `${product.shortTitle} missing ${requirement}`);
        }
      }
      assert.ok(product.studyPlan.length >= 4, `${product.shortTitle} needs a real study plan`);
      assert.ok(product.readinessDomains.length >= 4, `${product.shortTitle} needs readiness tracking`);
      assert.ok(product.rationaleRequirements.length >= 7, `${product.shortTitle} needs premium rationale standards`);
      assert.ok(product.feedsInto.includes("Pre-Nursing"));
      assert.ok(product.feedsInto.includes("RN"));
      assert.ok(product.feedsInto.includes("RPN"));
      assert.ok(product.feedsInto.includes("Allied Health"));
    }
  });

  it("defines required ATI TEAS domains and lesson topics", () => {
    const teas = getAdmissionExamProductBySlug("ati-teas")!;
    const domains = new Map(teas.examBreakdown.map((domain) => [domain.title, [...domain.topics]]));

    assert.deepEqual([...domains.keys()], ["Reading", "Mathematics", "Science", "English & Language Usage"]);
    assert.deepEqual(domains.get("Reading"), ["Main Idea", "Supporting Details", "Inference", "Author Purpose", "Evidence"]);
    assert.deepEqual(domains.get("Mathematics"), ["Fractions", "Decimals", "Percentages", "Ratios", "Algebra", "Measurement"]);
    assert.deepEqual(domains.get("Science"), ["Biology", "Chemistry", "Anatomy", "Physiology", "Scientific Reasoning"]);
    assert.deepEqual(domains.get("English & Language Usage"), ["Grammar", "Punctuation", "Sentence Structure", "Vocabulary", "Writing Conventions"]);
    assert.deepEqual(teas.readinessDomains, ["Reading Readiness", "Science Readiness", "Math Readiness", "English Readiness"]);
  });

  it("defines required HESI A2 domains, practice exam modes, and no CAT dependency", () => {
    const hesi = getAdmissionExamProductBySlug("hesi-a2")!;
    const domains = hesi.examBreakdown.map((domain) => domain.title);

    assert.deepEqual(domains, [
      "Math",
      "Reading Comprehension",
      "Vocabulary",
      "Grammar",
      "Biology",
      "Chemistry",
      "Anatomy & Physiology",
      "Learning Style",
      "Personality Profile",
    ]);
    assert.deepEqual(hesi.practiceModes.map((mode) => mode.title), [
      "Timed Mode",
      "Tutor Mode",
      "Review Mode",
      "Detailed Rationales",
      "Performance Reports",
    ]);
    assert.equal(hesi.supportsCatExams, false);
  });

  it("defines required CASPER lesson framework and response-training modes", () => {
    const casper = getAdmissionExamProductBySlug("casper")!;
    const domains = casper.examBreakdown.map((domain) => domain.title);

    for (const expected of [
      "Professionalism",
      "Ethics",
      "Communication",
      "Empathy",
      "Conflict Resolution",
      "Cultural Safety",
      "Equity & Inclusion",
      "Teamwork",
      "Leadership",
      "Patient Advocacy",
      "Decision Making",
      "Professional Accountability",
    ]) {
      assert.ok(domains.includes(expected), `missing CASPER domain: ${expected}`);
    }

    assert.deepEqual(casper.practiceModes.map((mode) => mode.title), [
      "Written Response",
      "Video Response",
      "Timed Response",
      "Interview Practice",
    ]);
    assert.deepEqual(casper.readinessDomains, [
      "Professional Judgment",
      "Communication",
      "Ethics",
      "Empathy",
      "Decision-Making",
    ]);
  });

  it("creates a top-level admissions hub and visible navigation entry points", () => {
    const admissionsPage = readSource("src/app/(marketing)/(default)/admissions/page.tsx");
    const hub = readSource("src/components/pre-nursing/admissions-entrance-exams-hub.tsx");
    const clientHeader = readSource("src/components/layout/site-header.tsx");
    const serverHeader = readSource("src/components/layout/site-header-server.tsx");

    assert.match(admissionsPage, /AdmissionsEntranceExamsHub/);
    assert.match(hub, /Admissions & Entrance Exams/);
    assert.match(hub, /ATI TEAS/);
    assert.match(hub, /HESI A2/);
    assert.match(hub, /CASPER/);
    assert.match(clientHeader, /href:\s*"\/pre-nursing\/casper"/);
    assert.match(serverHeader, /href:\s*"\/pre-nursing\/casper"/);
  });

  it("documents future admissions support and packaging strategy", () => {
    assert.deepEqual(
      FUTURE_ADMISSION_EXAMS.map((exam) => exam.title),
      ["NLN NEX", "Wonderlic", "Institution-specific entrance exams"],
    );
    assert.equal(ADMISSIONS_SUBSCRIPTION_STRATEGY.options.length, 2);
    assert.match(ADMISSIONS_SUBSCRIPTION_STRATEGY.recommendation, /Admissions Prep Plus/);
    assert.match(ADMISSIONS_SUBSCRIPTION_STRATEGY.recommendation, /Pre-Nursing/);
  });
});
