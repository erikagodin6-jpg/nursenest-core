import { describe, it, expect, beforeEach } from "vitest";
import {
  validateQuestionForProduction,
  validateQuestionsForExam,
  getDiagnosticStats,
  resetDiagnosticStats,
  recordDiagnostic,
  logStructuredExamStart,
  generateTraceId,
  pruneHardeningCaches,
  type StructuredExamLog,
} from "../system-hardening";

describe("System Hardening", () => {
  describe("validateQuestionForProduction", () => {
    it("should accept a valid question", () => {
      const q = {
        id: "q1",
        stem: "What is the primary function of insulin?",
        options: ["Regulate blood sugar", "Aid digestion", "Filter blood", "Transport oxygen"],
        correct_answer: 0,
        difficulty: 3,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(true);
      expect(result.quarantined).toBe(false);
      expect(result.reasons).toHaveLength(0);
    });

    it("should reject a question with missing id", () => {
      const q = {
        stem: "What is the primary function of insulin?",
        options: ["A", "B", "C", "D"],
        correct_answer: 0,
        difficulty: 3,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.quarantined).toBe(true);
      expect(result.reasons).toContain("missing_id");
    });

    it("should reject a question with empty stem", () => {
      const q = {
        id: "q2",
        stem: "",
        options: ["A", "B", "C", "D"],
        correct_answer: 0,
        difficulty: 3,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.quarantined).toBe(true);
      expect(result.reasons).toContain("empty_or_short_stem");
    });

    it("should reject a question with short stem", () => {
      const q = {
        id: "q3",
        stem: "Hi?",
        options: ["A", "B", "C", "D"],
        correct_answer: 0,
        difficulty: 3,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.reasons).toContain("empty_or_short_stem");
    });

    it("should reject a question with insufficient options", () => {
      const q = {
        id: "q4",
        stem: "What is the primary function of insulin?",
        options: ["Only one option"],
        correct_answer: 0,
        difficulty: 3,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.quarantined).toBe(true);
      expect(result.reasons).toContain("insufficient_options");
    });

    it("should handle JSON string options", () => {
      const q = {
        id: "q5",
        stem: "What is the primary function of insulin?",
        options: JSON.stringify(["A", "B", "C", "D"]),
        correct_answer: 0,
        difficulty: 3,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(true);
    });

    it("should reject unparseable options", () => {
      const q = {
        id: "q6",
        stem: "What is the primary function of insulin?",
        options: "not valid json",
        correct_answer: 0,
        difficulty: 3,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.quarantined).toBe(true);
      expect(result.reasons).toContain("unparseable_options");
    });

    it("should reject a question with missing correct answer", () => {
      const q = {
        id: "q7",
        stem: "What is the primary function of insulin?",
        options: ["A", "B", "C", "D"],
        difficulty: 3,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.quarantined).toBe(true);
      expect(result.reasons).toContain("missing_correct_answer");
    });

    it("should reject a question with missing difficulty", () => {
      const q = {
        id: "q8",
        stem: "What is the primary function of insulin?",
        options: ["A", "B", "C", "D"],
        correct_answer: 0,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.reasons).toContain("missing_difficulty");
    });

    it("should reject difficulty out of range", () => {
      const q = {
        id: "q9",
        stem: "What is the primary function of insulin?",
        options: ["A", "B", "C", "D"],
        correct_answer: 0,
        difficulty: 6,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.reasons).toContain("invalid_difficulty_range");
    });

    it("should flag invalid tier", () => {
      const q = {
        id: "q10",
        stem: "What is the primary function of insulin?",
        options: ["A", "B", "C", "D"],
        correct_answer: 0,
        difficulty: 3,
        tier: "invalid_tier",
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.reasons).toContain("invalid_tier");
    });

    it("should flag invalid region scope", () => {
      const q = {
        id: "q11",
        stem: "What is the primary function of insulin?",
        options: ["A", "B", "C", "D"],
        correct_answer: 0,
        difficulty: 3,
        region_scope: "MARS",
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.reasons).toContain("invalid_region_scope");
    });

    it("should flag invalid language code", () => {
      const q = {
        id: "q12",
        stem: "What is the primary function of insulin?",
        options: ["A", "B", "C", "D"],
        correct_answer: 0,
        difficulty: 3,
        language_code: "xx",
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.reasons).toContain("invalid_language_code");
    });

    it("should accept letter-style correct answers (A/B/C/D)", () => {
      const q = {
        id: "q13",
        stem: "What is the primary function of insulin?",
        options: ["A", "B", "C", "D"],
        correct_answer: "B",
        difficulty: 3,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(true);
    });

    it("should flag question that is not published", () => {
      const q = {
        id: "q14",
        stem: "What is the primary function of insulin?",
        options: ["A", "B", "C", "D"],
        correct_answer: 0,
        difficulty: 3,
        status: "draft",
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.reasons).toContain("not_published_or_active");
    });

    it("should accept published question", () => {
      const q = {
        id: "q15",
        stem: "What is the primary function of insulin?",
        options: ["A", "B", "C", "D"],
        correct_answer: 0,
        difficulty: 3,
        status: "published",
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(true);
    });

    it("should reject correct_answer out of bounds", () => {
      const q = {
        id: "q17",
        stem: "What is the primary function of insulin?",
        options: ["A", "B", "C", "D"],
        correct_answer: 5,
        difficulty: 3,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.reasons).toContain("correct_answer_out_of_bounds");
    });

    it("should accept correct_answer within bounds", () => {
      const q = {
        id: "q18",
        stem: "What is the primary function of insulin?",
        options: ["A", "B", "C", "D"],
        correct_answer: 3,
        difficulty: 3,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(true);
    });

    it("should detect empty option text in object-style options", () => {
      const q = {
        id: "q16",
        stem: "What is the primary function of insulin?",
        options: [{ text: "Option A" }, { text: "" }, { text: "Option C" }, { text: "Option D" }],
        correct_answer: 0,
        difficulty: 3,
      };
      const result = validateQuestionForProduction(q);
      expect(result.valid).toBe(false);
      expect(result.reasons).toContain("empty_option_text");
    });
  });

  describe("validateQuestionsForExam", () => {
    it("should separate valid, rejected, and quarantined questions", () => {
      const questions = [
        { id: "q1", stem: "Valid question stem here", options: ["A", "B", "C", "D"], correct_answer: 0, difficulty: 3 },
        { id: "q2", stem: "", options: ["A", "B", "C", "D"], correct_answer: 0, difficulty: 3 },
        { id: "q3", stem: "Another valid question", options: ["A", "B", "C", "D"], correct_answer: 0, difficulty: 3, tier: "invalid" },
      ];
      const result = validateQuestionsForExam(questions);
      expect(result.valid).toHaveLength(1);
      expect(result.quarantined).toHaveLength(1);
      expect(result.rejected).toHaveLength(1);
    });

    it("should return all valid when all questions pass", () => {
      const questions = [
        { id: "q1", stem: "Valid question stem here", options: ["A", "B", "C", "D"], correct_answer: 0, difficulty: 3 },
        { id: "q2", stem: "Another valid question", options: ["A", "B", "C", "D"], correct_answer: 1, difficulty: 2 },
      ];
      const result = validateQuestionsForExam(questions);
      expect(result.valid).toHaveLength(2);
      expect(result.quarantined).toHaveLength(0);
      expect(result.rejected).toHaveLength(0);
    });

    it("should handle empty input", () => {
      const result = validateQuestionsForExam([]);
      expect(result.valid).toHaveLength(0);
      expect(result.quarantined).toHaveLength(0);
      expect(result.rejected).toHaveLength(0);
    });
  });

  describe("Diagnostic Stats", () => {
    beforeEach(() => {
      resetDiagnosticStats();
    });

    it("should start with zeroed stats", () => {
      const stats = getDiagnosticStats();
      expect(stats.catStartsAttempted).toBe(0);
      expect(stats.catStartsSucceeded).toBe(0);
      expect(stats.catStartsFailed).toBe(0);
      expect(stats.fallbacksUsed).toBe(0);
      expect(stats.emptyPoolCounts).toBe(0);
      expect(stats.malformedQuestionCounts).toBe(0);
    });

    it("should record CAT start attempts", () => {
      recordDiagnostic("cat_start_attempt");
      recordDiagnostic("cat_start_attempt");
      recordDiagnostic("cat_start_success");
      const stats = getDiagnosticStats();
      expect(stats.catStartsAttempted).toBe(2);
      expect(stats.catStartsSucceeded).toBe(1);
    });

    it("should record failures with error codes", () => {
      recordDiagnostic("cat_start_failure", "db_timeout");
      recordDiagnostic("cat_start_failure", "db_timeout");
      recordDiagnostic("cat_start_failure", "pool_empty");
      const stats = getDiagnosticStats();
      expect(stats.catStartsFailed).toBe(3);
      expect(stats.failuresByCode).toEqual({ db_timeout: 2, pool_empty: 1 });
    });

    it("should record fallback and pool events", () => {
      recordDiagnostic("fallback_used");
      recordDiagnostic("empty_pool");
      recordDiagnostic("malformed_question");
      recordDiagnostic("malformed_question");
      const stats = getDiagnosticStats();
      expect(stats.fallbacksUsed).toBe(1);
      expect(stats.emptyPoolCounts).toBe(1);
      expect(stats.malformedQuestionCounts).toBe(2);
    });

    it("should reset stats correctly", () => {
      recordDiagnostic("cat_start_attempt");
      recordDiagnostic("cat_start_failure", "test_error");
      resetDiagnosticStats();
      const stats = getDiagnosticStats();
      expect(stats.catStartsAttempted).toBe(0);
      expect(stats.catStartsFailed).toBe(0);
      expect(stats.failuresByCode).toEqual({});
    });
  });

  describe("generateTraceId", () => {
    it("should generate unique IDs", () => {
      const id1 = generateTraceId();
      const id2 = generateTraceId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^trace-/);
      expect(id2).toMatch(/^trace-/);
    });
  });

  describe("logStructuredExamStart", () => {
    it("should log without throwing", () => {
      expect(() => {
        logStructuredExamStart({
          requestId: "test-123",
          userId: "user-1",
          tier: "rn",
          examType: "cat",
          source: "test",
          startupDurationMs: 150,
        });
      }).not.toThrow();
    });

    it("should log with all optional fields", () => {
      expect(() => {
        logStructuredExamStart({
          requestId: "test-456",
          userId: "user-2",
          tier: "rpn",
          examId: "exam-abc",
          examType: "practice",
          source: "mock_exam_start",
          rowCountsAfterFilters: { initial: 100, afterTierFilter: 80, afterValidation: 75 },
          validationRejections: ["missing_difficulty", "empty_stem"],
          startupDurationMs: 250,
          queryDurationMs: 50,
          fallbackUsed: "reduced",
          errorCode: "timeout",
          mode: "standard",
          questionCount: 25,
          blueprintCode: "NCLEX-RN",
        });
      }).not.toThrow();
    });
  });

  describe("pruneHardeningCaches", () => {
    it("should not throw when pruning", () => {
      expect(() => pruneHardeningCaches()).not.toThrow();
    });
  });
});
