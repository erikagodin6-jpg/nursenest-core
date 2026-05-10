import assert from "node:assert/strict";
import test from "node:test";

import {
  bowtieCorrectAnswerForImport,
  bowtieOptionsForImport,
  questionBankBulkItemSchema,
  type BowtieQuestionBankBulkItem,
} from "@/lib/admin/question-bank-bulk-import";

const validCanonicalBowtieRow = {
  stem: "A client has symptoms requiring clinical judgment in a bowtie format.",
  rationale: "This rationale explains why the selected condition, intervention, and monitoring response are correct.",
  options: {
    format: "bowtie",
    bank: [
      { id: "condition", label: "Priority condition" },
      { id: "intervention", label: "Priority intervention" },
      { id: "monitoring", label: "Priority monitoring" },
    ],
  },
  answerKey: {
    correctMapping: {
      condition: "condition",
      intervention: "intervention",
      monitoring: "monitoring",
    },
  },
  questionType: "NGN_BOWTIE",
  country: "US",
  tier: "RN",
  categoryId: "category-1",
  topicTag: "Clinical Judgment",
} as const;

test("questionBankBulkItemSchema accepts canonical bowtie rows", () => {
  assert.equal(questionBankBulkItemSchema.safeParse(validCanonicalBowtieRow).success, true);
});

test("questionBankBulkItemSchema rejects malformed canonical bowtie mapping", () => {
  const parsed = questionBankBulkItemSchema.safeParse({
    ...validCanonicalBowtieRow,
    answerKey: { correctMapping: { condition: "condition", intervention: "missing", monitoring: "monitoring" } },
  });
  assert.equal(parsed.success, false);
});

const validBowtie: BowtieQuestionBankBulkItem = {
  stem: "A practical nursing student is reviewing care priorities for a client with hypoglycemia.",
  scenario:
    "A client with type 1 diabetes is diaphoretic, shaky, and confused 45 minutes after receiving rapid-acting insulin.",
  patientContext: "Adult client on a medical-surgical unit.",
  rationale: "Hypoglycemia requires rapid carbohydrate replacement and close reassessment for neurologic recovery.",
  questionType: "BOWTIE",
  country: "US",
  tier: "LVN_LPN",
  exam: "NCLEX-PN",
  topicTag: "Diabetes safety",
  systemTag: "Endocrine",
  bodySystem: "Endocrine",
  clinicalCategory: "Safety/Prioritization",
  clientNeedsCategory: "physiological-integrity",
  clinicalJudgmentFunction: "Recognize cues",
  safetyPriorityTags: ["hypoglycemia", "priority"],
  tags: ["bowtie", "pn", "endocrine"],
  regionScope: "US_ONLY",
  bank: [
    { id: "condition_hypoglycemia", label: "Hypoglycemia", rationale: "Symptoms match low glucose." },
    { id: "condition_hyperglycemia", label: "Hyperglycemia", rationale: "Hyperglycemia usually has different timing." },
    { id: "action_oral_glucose", label: "Give 15 g fast-acting carbohydrate" },
    { id: "action_hold_all_meds", label: "Hold all scheduled medications" },
    { id: "monitor_glucose", label: "Recheck capillary glucose in 15 minutes" },
    { id: "monitor_daily_weight", label: "Trend daily weight" },
  ],
  slotLabels: {
    condition: "Likely problem",
    intervention: "Immediate action",
    monitoring: "Follow-up assessment",
  },
  correctMapping: {
    condition: "condition_hypoglycemia",
    intervention: "action_oral_glucose",
    monitoring: "monitor_glucose",
  },
  correctRationales: {
    condition: "Neurogenic symptoms after rapid-acting insulin point to hypoglycemia.",
    intervention: "Fast carbohydrate is the priority when the client can swallow safely.",
    monitoring: "Rechecking glucose confirms treatment response.",
  },
  distractorRationales: {
    condition_hyperglycemia: "The timing and symptoms are more consistent with hypoglycemia.",
    action_hold_all_meds: "This is too broad and delays immediate treatment.",
    monitor_daily_weight: "Daily weight does not evaluate immediate response.",
  },
  vitals: { heartRate: "108/min", bloodPressure: "126/78" },
  labs: { glucose: "48 mg/dL" },
};

test("questionBankBulkItemSchema accepts structured bowtie rows", () => {
  const parsed = questionBankBulkItemSchema.parse(validBowtie);
  assert.equal(parsed.questionType, "BOWTIE");
  if (parsed.questionType !== "BOWTIE") throw new Error("Expected bowtie row");
  assert.equal(bowtieOptionsForImport(parsed).format, "bowtie");
  assert.deepEqual(bowtieCorrectAnswerForImport(parsed), {
    correctMapping: validBowtie.correctMapping,
  });
});

test("questionBankBulkItemSchema rejects bowtie mappings that are missing from the option bank", () => {
  const result = questionBankBulkItemSchema.safeParse({
    ...validBowtie,
    correctMapping: { ...validBowtie.correctMapping, intervention: "missing_action" },
  });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.error.issues.map((issue) => issue.message).join("\n"), /must exist in bank/);
  }
});

test("questionBankBulkItemSchema requires professionScope for allied bowtie rows", () => {
  const result = questionBankBulkItemSchema.safeParse({
    ...validBowtie,
    tier: "ALLIED",
    exam: "ALLIED",
  });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.error.issues.map((issue) => issue.path.join(".")).join("\n"), /professionScope/);
  }
});
