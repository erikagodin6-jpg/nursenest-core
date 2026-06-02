/**
 * NurseNest — Allied Profession Completeness Guard Contract Tests
 *
 * These tests verify the audit system's behavior using the mock repository
 * to ensure deterministic, database-independent validation.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  runAlliedProfessionCompletenessAudit,
  MockAlliedCompletenessRepository,
  getThresholds,
} from "@/lib/audit/allied-profession-completeness-guard";
import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";

describe("Allied Profession Completeness Guard", () => {
  let mockRepo: MockAlliedCompletenessRepository;

  beforeEach(() => {
    mockRepo = new MockAlliedCompletenessRepository();
  });

  describe("Report Structure", () => {
    it("should include all allied professions in the report", async () => {
      // Set all professions to passing state
      for (const profession of ALLIED_PROFESSIONS) {
        mockRepo.setLessonCount(profession.professionKey, 300);
        mockRepo.setFlashcardCount(profession.professionKey, 400);
        mockRepo.setQuestionCount(profession.professionKey, 600);
        mockRepo.setCatQuestionCount(profession.professionKey, 200);
        mockRepo.setSeoSurface(profession.professionKey, {
          title: `${profession.professionKey} Exam Prep | NurseNest`,
          description: `Prepare for your ${profession.professionKey} certification exam.`,
          hasJsonLd: false,
        });
        mockRepo.setLearnerSurfaces(profession.professionKey, {
          hasPracticeExam: true,
          hasStudyPlan: true,
          hasReportCard: true,
        });
      }

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);

      expect(report.professionCount).toBe(ALLIED_PROFESSIONS.length);
      expect(Object.keys(report.perProfession).length).toBe(ALLIED_PROFESSIONS.length);

      for (const profession of ALLIED_PROFESSIONS) {
        expect(report.perProfession[profession.professionKey]).toBeDefined();
        expect(report.perProfession[profession.professionKey].professionKey).toBe(profession.professionKey);
      }
    });

    it("should have stable report shape", async () => {
      const report = await runAlliedProfessionCompletenessAudit(mockRepo);

      expect(report).toHaveProperty("status");
      expect(report).toHaveProperty("generatedAt");
      expect(report).toHaveProperty("thresholds");
      expect(report).toHaveProperty("professionCount");
      expect(report).toHaveProperty("passingProfessionCount");
      expect(report).toHaveProperty("warningProfessionCount");
      expect(report).toHaveProperty("failingProfessionCount");
      expect(report).toHaveProperty("issues");
      expect(report).toHaveProperty("perProfession");

      expect(["pass", "warn", "fail"]).toContain(report.status);
      expect(typeof report.generatedAt).toBe("string");
      expect(typeof report.professionCount).toBe("number");
      expect(Array.isArray(report.issues)).toBe(true);
      expect(typeof report.perProfession).toBe("object");
    });

    it("should have correct threshold structure", async () => {
      const report = await runAlliedProfessionCompletenessAudit(mockRepo);

      expect(report.thresholds).toHaveProperty("minLessons");
      expect(report.thresholds).toHaveProperty("minFlashcards");
      expect(report.thresholds).toHaveProperty("minQuestions");
      expect(report.thresholds).toHaveProperty("minCatQuestions");

      expect(typeof report.thresholds.minLessons).toBe("number");
      expect(typeof report.thresholds.minFlashcards).toBe("number");
      expect(typeof report.thresholds.minQuestions).toBe("number");
      expect(typeof report.thresholds.minCatQuestions).toBe("number");
    });
  });

  describe("Threshold Overrides", () => {
    it("should respect custom thresholds", async () => {
      const customThresholds = {
        minLessons: 100,
        minFlashcards: 150,
        minQuestions: 200,
        minCatQuestions: 50,
      };

      // Set ALL professions to values that exceed custom thresholds
      for (const profession of ALLIED_PROFESSIONS) {
        mockRepo.setLessonCount(profession.professionKey, 200); // Above 100
        mockRepo.setFlashcardCount(profession.professionKey, 300); // Above 150
        mockRepo.setQuestionCount(profession.professionKey, 400); // Above 200
        mockRepo.setCatQuestionCount(profession.professionKey, 100); // Above 50
        mockRepo.setSeoSurface(profession.professionKey, {
          title: `${profession.professionKey} Exam Prep`,
          description: "Test description",
          hasJsonLd: false,
        });
        mockRepo.setLearnerSurfaces(profession.professionKey, {
          hasPracticeExam: true,
          hasStudyPlan: true,
          hasReportCard: true,
        });
      }

      const report = await runAlliedProfessionCompletenessAudit(mockRepo, customThresholds);

      expect(report.thresholds.minLessons).toBe(100);
      expect(report.thresholds.minFlashcards).toBe(150);
      expect(report.thresholds.minQuestions).toBe(200);
      expect(report.thresholds.minCatQuestions).toBe(50);

      // Should pass with custom thresholds
      expect(report.perProfession[ALLIED_PROFESSIONS[0].professionKey].status).toBe("pass");
    });
  });

  describe("Content Coverage Buckets", () => {
    it("should fail when lesson count is below threshold", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 50); // Below 200
      mockRepo.setFlashcardCount(testProfession.professionKey, 400);
      mockRepo.setQuestionCount(testProfession.professionKey, 600);
      mockRepo.setCatQuestionCount(testProfession.professionKey, 200);
      mockRepo.setSeoSurface(testProfession.professionKey, {
        title: "Test Exam Prep",
        description: "Test description",
        hasJsonLd: false,
      });
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: true,
        hasReportCard: true,
      });

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);
      const profResult = report.perProfession[testProfession.professionKey];

      expect(profResult.status).toBe("fail");
      expect(profResult.lessonCount).toBe(50);

      const lessonIssue = report.issues.find(
        (i) => i.professionKey === testProfession.professionKey && i.bucket === "lessons"
      );
      expect(lessonIssue).toBeDefined();
      expect(lessonIssue?.severity).toBe("fail");
      expect(lessonIssue?.expected).toBe(200);
      expect(lessonIssue?.actual).toBe(50);
    });

    it("should warn when lesson count is approaching threshold", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 250); // Above 200 but below 300 (1.5x)
      mockRepo.setFlashcardCount(testProfession.professionKey, 400);
      mockRepo.setQuestionCount(testProfession.professionKey, 600);
      mockRepo.setCatQuestionCount(testProfession.professionKey, 200);
      mockRepo.setSeoSurface(testProfession.professionKey, {
        title: "Test Exam Prep",
        description: "Test description",
        hasJsonLd: false,
      });
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: true,
        hasReportCard: true,
      });

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);
      const profResult = report.perProfession[testProfession.professionKey];

      expect(profResult.status).toBe("warn");

      const lessonIssue = report.issues.find(
        (i) => i.professionKey === testProfession.professionKey && i.bucket === "lessons"
      );
      expect(lessonIssue).toBeDefined();
      expect(lessonIssue?.severity).toBe("warn");
    });

    it("should pass when all content counts exceed thresholds", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 300); // Above 200
      mockRepo.setFlashcardCount(testProfession.professionKey, 500); // Above 300
      mockRepo.setQuestionCount(testProfession.professionKey, 800); // Above 500
      mockRepo.setCatQuestionCount(testProfession.professionKey, 200); // Above 150
      mockRepo.setSeoSurface(testProfession.professionKey, {
        title: "Test Exam Prep",
        description: "Test description",
        hasJsonLd: false,
      });
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: true,
        hasReportCard: true,
      });

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);
      const profResult = report.perProfession[testProfession.professionKey];

      expect(profResult.status).toBe("pass");
    });

    it("should fail when flashcard count is below threshold", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 300);
      mockRepo.setFlashcardCount(testProfession.professionKey, 100); // Below 300
      mockRepo.setQuestionCount(testProfession.professionKey, 600);
      mockRepo.setCatQuestionCount(testProfession.professionKey, 200);
      mockRepo.setSeoSurface(testProfession.professionKey, {
        title: "Test Exam Prep",
        description: "Test description",
        hasJsonLd: false,
      });
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: true,
        hasReportCard: true,
      });

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);
      const profResult = report.perProfession[testProfession.professionKey];

      expect(profResult.status).toBe("fail");

      const flashcardIssue = report.issues.find(
        (i) => i.professionKey === testProfession.professionKey && i.bucket === "flashcards"
      );
      expect(flashcardIssue).toBeDefined();
      expect(flashcardIssue?.severity).toBe("fail");
    });

    it("should fail when question count is below threshold", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 300);
      mockRepo.setFlashcardCount(testProfession.professionKey, 400);
      mockRepo.setQuestionCount(testProfession.professionKey, 200); // Below 500
      mockRepo.setCatQuestionCount(testProfession.professionKey, 200);
      mockRepo.setSeoSurface(testProfession.professionKey, {
        title: "Test Exam Prep",
        description: "Test description",
        hasJsonLd: false,
      });
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: true,
        hasReportCard: true,
      });

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);
      const profResult = report.perProfession[testProfession.professionKey];

      expect(profResult.status).toBe("fail");

      const questionIssue = report.issues.find(
        (i) => i.professionKey === testProfession.professionKey && i.bucket === "questions"
      );
      expect(questionIssue).toBeDefined();
      expect(questionIssue?.severity).toBe("fail");
    });

    it("should fail when CAT-eligible question count is below threshold", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 300);
      mockRepo.setFlashcardCount(testProfession.professionKey, 400);
      mockRepo.setQuestionCount(testProfession.professionKey, 600);
      mockRepo.setCatQuestionCount(testProfession.professionKey, 50); // Below 150
      mockRepo.setSeoSurface(testProfession.professionKey, {
        title: "Test Exam Prep",
        description: "Test description",
        hasJsonLd: false,
      });
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: true,
        hasReportCard: true,
      });

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);
      const profResult = report.perProfession[testProfession.professionKey];

      expect(profResult.status).toBe("fail");

      const catIssue = report.issues.find(
        (i) => i.professionKey === testProfession.professionKey && i.bucket === "cat"
      );
      expect(catIssue).toBeDefined();
      expect(catIssue?.severity).toBe("fail");
    });
  });

  describe("Learner Surface Checks", () => {
    it("should warn when practice exam surface is missing", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 300);
      mockRepo.setFlashcardCount(testProfession.professionKey, 400);
      mockRepo.setQuestionCount(testProfession.professionKey, 600);
      mockRepo.setCatQuestionCount(testProfession.professionKey, 200);
      mockRepo.setSeoSurface(testProfession.professionKey, {
        title: "Test Exam Prep",
        description: "Test description",
        hasJsonLd: false,
      });
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: false,
        hasStudyPlan: true,
        hasReportCard: true,
      });

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);
      const profResult = report.perProfession[testProfession.professionKey];

      expect(profResult.hasPracticeExamSurface).toBe(false);

      const practiceExamIssue = report.issues.find(
        (i) => i.professionKey === testProfession.professionKey && i.bucket === "practice_exam"
      );
      expect(practiceExamIssue).toBeDefined();
      expect(practiceExamIssue?.severity).toBe("warn");
    });

    it("should warn when study plan surface is missing", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 300);
      mockRepo.setFlashcardCount(testProfession.professionKey, 400);
      mockRepo.setQuestionCount(testProfession.professionKey, 600);
      mockRepo.setCatQuestionCount(testProfession.professionKey, 200);
      mockRepo.setSeoSurface(testProfession.professionKey, {
        title: "Test Exam Prep",
        description: "Test description",
        hasJsonLd: false,
      });
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: false,
        hasReportCard: true,
      });

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);

      const studyPlanIssue = report.issues.find(
        (i) => i.professionKey === testProfession.professionKey && i.bucket === "study_plan"
      );
      expect(studyPlanIssue).toBeDefined();
      expect(studyPlanIssue?.severity).toBe("warn");
    });

    it("should warn when report card surface is missing", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 300);
      mockRepo.setFlashcardCount(testProfession.professionKey, 400);
      mockRepo.setQuestionCount(testProfession.professionKey, 600);
      mockRepo.setCatQuestionCount(testProfession.professionKey, 200);
      mockRepo.setSeoSurface(testProfession.professionKey, {
        title: "Test Exam Prep",
        description: "Test description",
        hasJsonLd: false,
      });
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: true,
        hasReportCard: false,
      });

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);

      const reportCardIssue = report.issues.find(
        (i) => i.professionKey === testProfession.professionKey && i.bucket === "report_card"
      );
      expect(reportCardIssue).toBeDefined();
      expect(reportCardIssue?.severity).toBe("warn");
    });
  });

  describe("SEO Differentiation Checks", () => {
    it("should fail when SEO surface is missing", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 300);
      mockRepo.setFlashcardCount(testProfession.professionKey, 400);
      mockRepo.setQuestionCount(testProfession.professionKey, 600);
      mockRepo.setCatQuestionCount(testProfession.professionKey, 200);
      // No SEO surface set
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: true,
        hasReportCard: true,
      });

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);

      const seoIssue = report.issues.find(
        (i) => i.professionKey === testProfession.professionKey && i.bucket === "seo"
      );
      expect(seoIssue).toBeDefined();
      expect(seoIssue?.severity).toBe("fail");
    });

    it("should warn when SEO title is generic", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 300);
      mockRepo.setFlashcardCount(testProfession.professionKey, 400);
      mockRepo.setQuestionCount(testProfession.professionKey, 600);
      mockRepo.setCatQuestionCount(testProfession.professionKey, 200);
      mockRepo.setSeoSurface(testProfession.professionKey, {
        title: "Allied Health Lessons", // Generic title
        description: "Test description",
        hasJsonLd: false,
      });
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: true,
        hasReportCard: true,
      });

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);

      const seoIssue = report.issues.find(
        (i) => i.professionKey === testProfession.professionKey && i.bucket === "seo"
      );
      expect(seoIssue).toBeDefined();
      expect(seoIssue?.severity).toBe("warn");
      expect(seoIssue?.message).toContain("generic");
    });

    it("should detect SEO collisions between professions", async () => {
      const prof1 = ALLIED_PROFESSIONS[0];
      const prof2 = ALLIED_PROFESSIONS[1];

      // Set identical SEO for two professions
      mockRepo.setSeoSurface(prof1.professionKey, {
        title: "Identical Title",
        description: "Identical Description",
        hasJsonLd: false,
      });
      mockRepo.setSeoSurface(prof2.professionKey, {
        title: "Identical Title",
        description: "Identical Description",
        hasJsonLd: false,
      });

      // Set minimal content for both
      mockRepo.setLessonCount(prof1.professionKey, 300);
      mockRepo.setFlashcardCount(prof1.professionKey, 400);
      mockRepo.setQuestionCount(prof1.professionKey, 600);
      mockRepo.setCatQuestionCount(prof1.professionKey, 200);
      mockRepo.setLearnerSurfaces(prof1.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: true,
        hasReportCard: true,
      });

      mockRepo.setLessonCount(prof2.professionKey, 300);
      mockRepo.setFlashcardCount(prof2.professionKey, 400);
      mockRepo.setQuestionCount(prof2.professionKey, 600);
      mockRepo.setCatQuestionCount(prof2.professionKey, 200);
      mockRepo.setLearnerSurfaces(prof2.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: true,
        hasReportCard: true,
      });

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);

      const collisionIssues = report.issues.filter(
        (i) => i.bucket === "seo" && i.message.includes("identical")
      );
      expect(collisionIssues.length).toBeGreaterThan(0);
    });
  });

  describe("Contamination Checks", () => {
    it("should fail when contamination is detected", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 300);
      mockRepo.setFlashcardCount(testProfession.professionKey, 400);
      mockRepo.setQuestionCount(testProfession.professionKey, 600);
      mockRepo.setCatQuestionCount(testProfession.professionKey, 200);
      mockRepo.setSeoSurface(testProfession.professionKey, {
        title: "Test Exam Prep",
        description: "Test description",
        hasJsonLd: false,
      });
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: true,
        hasReportCard: true,
      });
      mockRepo.setContaminations(testProfession.professionKey, [
        {
          contentType: "question",
          id: "q1",
          field: "stem",
          value: "NCLEX",
          nursingTierReference: "NCLEX",
        },
      ]);

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);

      const contaminationIssue = report.issues.find(
        (i) => i.professionKey === testProfession.professionKey && i.bucket === "contamination"
      );
      expect(contaminationIssue).toBeDefined();
      expect(contaminationIssue?.severity).toBe("fail");
    });
  });

  describe("Nursing Pathway Leakage", () => {
    it("should fail when nursing pathway leakage is detected", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 300);
      mockRepo.setFlashcardCount(testProfession.professionKey, 400);
      mockRepo.setQuestionCount(testProfession.professionKey, 600);
      mockRepo.setCatQuestionCount(testProfession.professionKey, 200);
      mockRepo.setSeoSurface(testProfession.professionKey, {
        title: "Test Exam Prep",
        description: "Test description",
        hasJsonLd: false,
      });
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: true,
        hasReportCard: true,
      });
      mockRepo.setLeakages(testProfession.professionKey, [
        {
          contentType: "lesson",
          id: "l1",
          nursingPathwayId: "us-rn-core",
        },
      ]);

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);

      const leakageIssue = report.issues.find(
        (i) => i.professionKey === testProfession.professionKey && i.bucket === "nursing_leakage"
      );
      expect(leakageIssue).toBeDefined();
      expect(leakageIssue?.severity).toBe("fail");
    });
  });

  describe("Overall Status Calculation", () => {
    it("should return pass when no issues exist", async () => {
      // Set ALL professions to passing state with unique SEO data
      // Values must be above 1.5x threshold to avoid warnings
      for (const profession of ALLIED_PROFESSIONS) {
        mockRepo.setLessonCount(profession.professionKey, 350); // Above 200 * 1.5 = 300
        mockRepo.setFlashcardCount(profession.professionKey, 500); // Above 300 * 1.5 = 450
        mockRepo.setQuestionCount(profession.professionKey, 800); // Above 500 * 1.5 = 750
        mockRepo.setCatQuestionCount(profession.professionKey, 250); // Above 150
        mockRepo.setSeoSurface(profession.professionKey, {
          title: `${profession.professionKey} Exam Prep`,
          description: `Prepare for your ${profession.professionKey} certification exam with comprehensive study materials.`,
          hasJsonLd: false,
        });
        mockRepo.setLearnerSurfaces(profession.professionKey, {
          hasPracticeExam: true,
          hasStudyPlan: true,
          hasReportCard: true,
        });
      }

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);

      expect(report.status).toBe("pass");
      expect(report.failingProfessionCount).toBe(0);
    });

    it("should return warn when only warnings exist", async () => {
      // Set ALL professions to warning state (lesson count between threshold and 1.5x)
      for (const profession of ALLIED_PROFESSIONS) {
        mockRepo.setLessonCount(profession.professionKey, 250); // Warning level
        mockRepo.setFlashcardCount(profession.professionKey, 400);
        mockRepo.setQuestionCount(profession.professionKey, 600);
        mockRepo.setCatQuestionCount(profession.professionKey, 200);
        mockRepo.setSeoSurface(profession.professionKey, {
          title: `${profession.professionKey} Exam Prep`,
          description: "Test description",
          hasJsonLd: false,
        });
        mockRepo.setLearnerSurfaces(profession.professionKey, {
          hasPracticeExam: true,
          hasStudyPlan: true,
          hasReportCard: true,
        });
      }

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);

      expect(report.status).toBe("warn");
      expect(report.warningProfessionCount).toBeGreaterThan(0);
      expect(report.failingProfessionCount).toBe(0);
    });

    it("should return fail when any failure exists", async () => {
      // Set first profession to failing, rest passing
      for (const profession of ALLIED_PROFESSIONS) {
        const isFailing = profession === ALLIED_PROFESSIONS[0];
        mockRepo.setLessonCount(profession.professionKey, isFailing ? 50 : 300);
        mockRepo.setFlashcardCount(profession.professionKey, 400);
        mockRepo.setQuestionCount(profession.professionKey, 600);
        mockRepo.setCatQuestionCount(profession.professionKey, 200);
        mockRepo.setSeoSurface(profession.professionKey, {
          title: `${profession.professionKey} Exam Prep`,
          description: "Test description",
          hasJsonLd: false,
        });
        mockRepo.setLearnerSurfaces(profession.professionKey, {
          hasPracticeExam: true,
          hasStudyPlan: true,
          hasReportCard: true,
        });
      }

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);

      expect(report.status).toBe("fail");
      expect(report.failingProfessionCount).toBeGreaterThan(0);
    });
  });

  describe("Per-Profession Data", () => {
    it("should correctly report per-profession metrics", async () => {
      const testProfession = ALLIED_PROFESSIONS[0];
      mockRepo.setLessonCount(testProfession.professionKey, 350);
      mockRepo.setFlashcardCount(testProfession.professionKey, 450);
      mockRepo.setQuestionCount(testProfession.professionKey, 650);
      mockRepo.setCatQuestionCount(testProfession.professionKey, 180);
      mockRepo.setSeoSurface(testProfession.professionKey, {
        title: "Test Exam Prep",
        description: "Test description",
        hasJsonLd: false,
      });
      mockRepo.setLearnerSurfaces(testProfession.professionKey, {
        hasPracticeExam: true,
        hasStudyPlan: false,
        hasReportCard: true,
      });

      const report = await runAlliedProfessionCompletenessAudit(mockRepo);
      const profResult = report.perProfession[testProfession.professionKey];

      expect(profResult.lessonCount).toBe(350);
      expect(profResult.flashcardCount).toBe(450);
      expect(profResult.questionCount).toBe(650);
      expect(profResult.catEligibleQuestionCount).toBe(180);
      expect(profResult.hasPracticeExamSurface).toBe(true);
      expect(profResult.hasStudyPlanSurface).toBe(false);
      expect(profResult.hasReportCardSurface).toBe(true);
    });
  });
});

describe("Threshold Configuration", () => {
  it("should load default thresholds", () => {
    const thresholds = getThresholds();

    expect(thresholds.minLessons).toBe(200);
    expect(thresholds.minFlashcards).toBe(300);
    expect(thresholds.minQuestions).toBe(500);
    expect(thresholds.minCatQuestions).toBe(150);
  });
});