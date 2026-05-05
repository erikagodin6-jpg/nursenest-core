import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeBlogTopicIntent,
  partitionBlogTopicsBySeoIntent,
  validateBlogTopicForSeoArticleGeneration,
} from "@/lib/blog/blog-seo-topic-intent";
import { BLOG_TOPIC_BANK } from "@/lib/blog/blog-topic-bank";

describe("validateBlogTopicForSeoArticleGeneration", () => {
  it("accepts NCLEX question stems with clinical anchor", () => {
    const r = validateBlogTopicForSeoArticleGeneration(
      "NCLEX questions for hyperkalemia: which ECG changes and first nursing actions",
      "NCLEX-RN",
    );
    assert.equal(r.ok, true);
  });

  it("accepts priority intervention phrasing", () => {
    const r = validateBlogTopicForSeoArticleGeneration(
      "Priority nursing interventions for sepsis before antibiotics on NCLEX-RN",
      "NCLEX-RN",
    );
    assert.equal(r.ok, true);
  });

  it("accepts vs comparisons with clinical nouns", () => {
    const r = validateBlogTopicForSeoArticleGeneration("DKA vs HHS: first bedside nursing differences for NCLEX", "NCLEX-RN");
    assert.equal(r.ok, true);
  });

  it("accepts labs-for-nurses explained pattern", () => {
    const r = validateBlogTopicForSeoArticleGeneration(
      "Labs for acute kidney injury explained for nurses (NCLEX traps)",
      "NCLEX-RN",
    );
    assert.equal(r.ok, true);
  });

  it("accepts nurse-first stem", () => {
    const r = validateBlogTopicForSeoArticleGeneration(
      "What should the nurse do first in pulmonary embolism with hypotension (NCLEX-RN)",
      "NCLEX-RN",
    );
    assert.equal(r.ok, true);
  });

  it("normalizes broad RN topics instead of rejecting them", () => {
    const normalized = normalizeBlogTopicIntent("heart failure", "NCLEX-RN");
    assert.equal(normalized.accepted, true);
    assert.match(normalized.normalizedTopic, /Heart Failure Nursing Care/i);
    assert.equal(validateBlogTopicForSeoArticleGeneration("heart failure", "NCLEX-RN").ok, true);
  });

  it("normalizes broad PN/RPN safety topics into REx-PN-ready titles", () => {
    const normalized = normalizeBlogTopicIntent("infection control", "REx-PN");
    assert.equal(normalized.accepted, true);
    assert.match(normalized.normalizedTopic, /Infection Control for Nursing Exams/i);
    assert.match(normalized.normalizedTopic, /REx-PN Priorities/i);
  });

  it("normalizes broad NP topics into clinically specific NP-ready titles", () => {
    const normalized = normalizeBlogTopicIntent("diabetes", "NP");
    assert.equal(normalized.accepted, true);
    assert.match(normalized.normalizedTopic, /Diabetes Mellitus Nursing Review/i);
    assert.match(normalized.normalizedTopic, /NP Clinical Reasoning/i);
  });

  it("normalizes allied-health topics instead of rejecting them", () => {
    const normalized = normalizeBlogTopicIntent("allied health diagnostics", "Allied Health");
    assert.equal(normalized.accepted, true);
    assert.match(normalized.normalizedTopic, /Allied Health Clinical Review/i);
    assert.match(normalized.normalizedTopic, /Allied Health Relevance/i);
  });

  it("rejects generic Understanding prefix", () => {
    const r = validateBlogTopicForSeoArticleGeneration(
      "Understanding fluid balance for nursing students in the hospital",
      "NCLEX-RN",
    );
    assert.equal(r.ok, false);
  });

  it("rejects Guide to style", () => {
    const r = validateBlogTopicForSeoArticleGeneration("Guide to cardiac output for beginners", "NCLEX-RN");
    assert.equal(r.ok, false);
  });

  it("rejects topics with no clinical anchor", () => {
    const r = validateBlogTopicForSeoArticleGeneration(
      "How to stay motivated during long study sessions every weekend",
      "NCLEX-RN",
    );
    assert.equal(r.ok, false);
  });

  it("rejects spammy or placeholder topics", () => {
    const spam = normalizeBlogTopicIntent("bitcoin casino placeholder article", "NCLEX-RN");
    assert.equal(spam.accepted, false);
    assert.match(spam.reason ?? "", /spammy|placeholder|unrelated/i);
  });

  it("allows exam wording from schedule when topic is clinically grounded", () => {
    const r = validateBlogTopicForSeoArticleGeneration(
      "Priority nursing interventions for acute asthma exacerbation in the ED",
      "NCLEX-RN",
    );
    assert.equal(r.ok, true);
  });

  it("rejects when schedule exam is blank and topic omits exam tokens", () => {
    const r = validateBlogTopicForSeoArticleGeneration(
      "Priority nursing interventions for acute asthma exacerbation in the ED",
      null,
    );
    assert.equal(r.ok, false);
  });
});

describe("partitionBlogTopicsBySeoIntent", () => {
  it("splits approved and rejected", () => {
    const { approved, rejected } = partitionBlogTopicsBySeoIntent(
      ["NCLEX questions on insulin types for pharmacology", "heart failure", "Guide to wellness"],
      "NCLEX-RN",
    );
    assert.equal(approved.length, 2);
    assert.equal(rejected.length, 1);
  });
});

describe("BLOG_TOPIC_BANK coverage", () => {
  it("most bank topics pass intent validation with NCLEX-RN schedule context", () => {
    let pass = 0;
    for (const t of BLOG_TOPIC_BANK) {
      if (validateBlogTopicForSeoArticleGeneration(t, "NCLEX-RN").ok) pass += 1;
    }
    const ratio = pass / BLOG_TOPIC_BANK.length;
    assert.ok(
      ratio >= 0.75,
      `Expected >=75% bank approval with schedule exam; got ${(ratio * 100).toFixed(1)}% (${pass}/${BLOG_TOPIC_BANK.length})`,
    );
  });
});
