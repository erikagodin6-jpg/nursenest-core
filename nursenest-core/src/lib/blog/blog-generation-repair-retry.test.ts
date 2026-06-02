import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  classifyBlogPipelineFailureForRepair,
  formatBlogBatchItemFailureMessage,
  isTransientBlogProviderError,
  parseBlogBatchItemRepairMeta,
  MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS,
  BLOG_BODY_REPAIR_WORD_BUFFER,
} from "@/lib/blog/blog-generation-repair-classifier";

function src(path: string): string {
  return readFileSync(join(process.cwd(), "src", path), "utf8");
}

// ─────────────────────────────────────────────────────────────────────────────
// Classifier — recoverable cases
// ─────────────────────────────────────────────────────────────────────────────
describe("classifyBlogPipelineFailureForRepair — recoverable", () => {
  it("body too short → recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "body",
      error: "Article body too short (1168 words; minimum 1200). Target at least 1350.",
      code: "BODY_TOO_SHORT",
    });
    assert.equal(r.recoverable, true);
  });

  it("BODY_TOO_SHORT code alone → recoverable regardless of stage text", () => {
    const r = classifyBlogPipelineFailureForRepair({ stage: "body", error: "any", code: "BODY_TOO_SHORT" });
    assert.equal(r.recoverable, true);
  });

  it("BODY_TOO_LITTLE_CONTENT code → recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({ stage: "body", error: "Model returned too little content", code: "BODY_TOO_LITTLE_CONTENT" });
    assert.equal(r.recoverable, true);
  });

  it("'too little content' in error text (body stage) → recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({ stage: "body", error: "too little content returned" });
    assert.equal(r.recoverable, true);
  });

  it("SEO_DUPLICATE_BLOCKED code → recoverable (title can be rewritten)", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "seo_title",
      error: "H1 too similar to existing post",
      code: "SEO_DUPLICATE_BLOCKED",
    });
    assert.equal(r.recoverable, true);
  });

  it("seo_title stage with duplicate error text → recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({ stage: "seo_title", error: "title too similar to existing post" });
    assert.equal(r.recoverable, true);
  });

  it("BODY_LONGFORM_ENFORCEMENT → recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({ stage: "body", error: "Outline H2 coverage low", code: "BODY_LONGFORM_ENFORCEMENT" });
    assert.equal(r.recoverable, true);
  });

  it("PLAN_LONGFORM_CONTRACT → recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({ stage: "plan", error: "outline missing FAQ", code: "PLAN_LONGFORM_CONTRACT" });
    assert.equal(r.recoverable, true);
  });

  it("transient 429 error in body stage → recoverable (not terminal)", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "body",
      error: "OpenAI 429 too many requests",
    });
    assert.equal(r.recoverable, true, "Transient rate limit must be recoverable so admin can retry");
  });

  it("TRANSIENT_PROVIDER_ERROR code with rate-limit message → recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "body",
      error: "rate limit exceeded",
      code: "TRANSIENT_PROVIDER_ERROR",
    });
    assert.equal(r.recoverable, true);
  });

  it("timeout error in body stage → recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({ stage: "body", error: "Request timed out" });
    assert.equal(r.recoverable, true);
  });

  it("transient overload in plan stage → recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({ stage: "plan", error: "Service temporarily unavailable" });
    assert.equal(r.recoverable, true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Classifier — terminal cases
// ─────────────────────────────────────────────────────────────────────────────
describe("classifyBlogPipelineFailureForRepair — terminal", () => {
  it("citations stage → terminal (citations)", () => {
    const r = classifyBlogPipelineFailureForRepair({ stage: "citations", error: "Insufficient APA citations", code: "INSUFFICIENT_CITATIONS" });
    assert.equal(r.recoverable, false);
    assert.equal(r.terminalReason, "citations");
  });

  it("BLOG_TITLE_BODY_GATE → terminal blog_title_gate (admin must fix H1)", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "body",
      error: "On-page title is not ready for section-isolated body generation",
      code: "BLOG_TITLE_BODY_GATE",
    });
    assert.equal(r.recoverable, false);
    assert.equal(r.terminalReason, "blog_title_gate");
  });

  it("PRE_PUBLISH_BLOCKED with only body_word_count → recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "persist",
      error: "Article body is too short for publish (1168 words; minimum 1200).",
      code: "PRE_PUBLISH_BLOCKED",
      details: {
        prePublish: {
          blocking: [{ id: "body_word_count", message: "Article body is too short for publish (1168 words; minimum 1200)." }],
        },
      },
    });
    assert.equal(r.recoverable, true, "body_word_count alone must be recoverable");
  });

  it("PRE_PUBLISH_BLOCKED with meta_description + body → recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "persist",
      error: "Meta description missing; body too short.",
      code: "PRE_PUBLISH_BLOCKED",
      details: {
        prePublish: {
          blocking: [
            { id: "meta_description", message: "Meta description missing." },
            { id: "body_word_count", message: "Body too short." },
          ],
        },
      },
    });
    assert.equal(r.recoverable, true, "All recoverable IDs → recoverable");
  });

  it("PRE_PUBLISH_BLOCKED with body_word_count + slug_unique (terminal) → terminal", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "persist",
      error: "Body too short; Slug already used.",
      code: "PRE_PUBLISH_BLOCKED",
      details: {
        prePublish: {
          blocking: [
            { id: "body_word_count", message: "Body too short." },
            { id: "slug_unique", message: "Slug already used by another post." },
          ],
        },
      },
    });
    assert.equal(r.recoverable, false, "slug_unique is terminal → mixed → terminal");
    assert.equal(r.terminalReason, "pre_publish_blocked");
  });

  it("PRE_PUBLISH_BLOCKED with taxonomy_classifier (terminal) → terminal", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "persist",
      error: "Taxonomy classifier validation failed.",
      code: "PRE_PUBLISH_BLOCKED",
      details: {
        prePublish: {
          blocking: [{ id: "taxonomy_classifier", message: "Taxonomy validation failed." }],
        },
      },
    });
    assert.equal(r.recoverable, false);
    assert.equal(r.terminalReason, "pre_publish_blocked");
  });

  it("PRE_PUBLISH_BLOCKED with references_required → terminal", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "persist",
      error: "Post requires references but APA list is empty.",
      code: "PRE_PUBLISH_BLOCKED",
      details: {
        prePublish: {
          blocking: [{ id: "references_required", message: "APA list is empty." }],
        },
      },
    });
    assert.equal(r.recoverable, false);
  });

  it("PRE_PUBLISH_BLOCKED with only faq_content_when_required → recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "persist",
      error: "FAQ section required but missing.",
      code: "PRE_PUBLISH_BLOCKED",
      details: {
        prePublish: {
          blocking: [{ id: "faq_content_when_required", message: "FAQ required." }],
        },
      },
    });
    assert.equal(r.recoverable, true, "faq_content_when_required is recoverable");
  });

  it("PRE_PUBLISH_BLOCKED without details uses error text — body short → recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "persist",
      error: "Article body is too short for publish (1168 words; minimum 1200).",
      code: "PRE_PUBLISH_BLOCKED",
      // no details
    });
    assert.equal(r.recoverable, true, "Error text contains 'too short for publish' → recoverable fallback");
  });

  it("PRE_PUBLISH_BLOCKED without details, generic message → terminal (conservative)", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "persist",
      error: "Multiple blocking issues found during pre-publish validation.",
      code: "PRE_PUBLISH_BLOCKED",
    });
    assert.equal(r.recoverable, false, "Cannot identify issues from text alone → conservative terminal");
  });

  it("unsupported / not a nursing topic → terminal (unsupported_topic)", () => {
    const r = classifyBlogPipelineFailureForRepair({ stage: "body", error: "unsupported topic: not a nursing education subject" });
    assert.equal(r.recoverable, false);
    assert.equal(r.terminalReason, "unsupported_topic");
  });

  it("unsafe medical content → terminal (unsupported_topic)", () => {
    const r = classifyBlogPipelineFailureForRepair({ stage: "body", error: "unsafe medical advice detected" });
    assert.equal(r.recoverable, false);
    assert.equal(r.terminalReason, "unsupported_topic");
  });

  it("PLAN_INVALID_JSON → terminal (api_failure)", () => {
    const r = classifyBlogPipelineFailureForRepair({ stage: "plan", error: "invalid json", code: "PLAN_INVALID_JSON" });
    assert.equal(r.recoverable, false);
    assert.equal(r.terminalReason, "api_failure");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isTransientBlogProviderError
// ─────────────────────────────────────────────────────────────────────────────
describe("isTransientBlogProviderError", () => {
  it("detects 429", () => assert.equal(isTransientBlogProviderError("OpenAI 429 Too Many Requests"), true));
  it("detects rate limit", () => assert.equal(isTransientBlogProviderError("rate limit exceeded"), true));
  it("detects overloaded", () => assert.equal(isTransientBlogProviderError("Model is overloaded"), true));
  it("detects timed out", () => assert.equal(isTransientBlogProviderError("Request timed out"), true));
  it("detects econnreset", () => assert.equal(isTransientBlogProviderError("ECONNRESET"), true));
  it("returns false for policy failure", () => assert.equal(isTransientBlogProviderError("unsupported topic"), false));
  it("returns false for JSON parse error", () => assert.equal(isTransientBlogProviderError("Unexpected token in JSON"), false));
});

// ─────────────────────────────────────────────────────────────────────────────
// formatBlogBatchItemFailureMessage / parseBlogBatchItemRepairMeta
// ─────────────────────────────────────────────────────────────────────────────
describe("formatBlogBatchItemFailureMessage", () => {
  it("embeds attempt count and terminal flag", () => {
    const m = formatBlogBatchItemFailureMessage({ originalError: "Article body too short (1168 words).", repairAttempts: 3, terminal: true });
    assert.match(m, /\[NN_REPAIR_ATTEMPTS=3\]/);
    assert.match(m, /\[NN_TERMINAL=y\]/);
    assert.match(m, /Article body too short/);
  });

  it("marks recoverable failures with terminal=n", () => {
    const m = formatBlogBatchItemFailureMessage({ originalError: "some error", repairAttempts: 1, terminal: false });
    assert.match(m, /\[NN_TERMINAL=n\]/);
  });

  it("truncates to 4000 chars", () => {
    const m = formatBlogBatchItemFailureMessage({ originalError: "x".repeat(5000), repairAttempts: 2, terminal: true });
    assert.ok(m.length <= 4000);
  });
});

describe("parseBlogBatchItemRepairMeta", () => {
  it("round-trips format→parse", () => {
    const original = "Article body too short (1168 words; minimum 1200).";
    const formatted = formatBlogBatchItemFailureMessage({ originalError: original, repairAttempts: 3, terminal: true });
    const parsed = parseBlogBatchItemRepairMeta(formatted);
    assert.equal(parsed.repairAttempts, 3);
    assert.equal(parsed.terminal, true);
    assert.ok(parsed.message.includes("Article body too short"));
  });

  it("parses non-terminal flag", () => {
    const raw = "[NN_REPAIR_ATTEMPTS=1][NN_TERMINAL=n] Title too similar.";
    const meta = parseBlogBatchItemRepairMeta(raw);
    assert.equal(meta.repairAttempts, 1);
    assert.equal(meta.terminal, false);
  });

  it("returns nulls for plain error string (no metadata)", () => {
    const meta = parseBlogBatchItemRepairMeta("stale_generating_timeout");
    assert.equal(meta.repairAttempts, null);
    assert.equal(meta.terminal, null);
    assert.equal(meta.message, "stale_generating_timeout");
  });

  it("handles null/undefined gracefully", () => {
    const m1 = parseBlogBatchItemRepairMeta(null);
    assert.equal(m1.repairAttempts, null);
    assert.equal(m1.message, "");
    const m2 = parseBlogBatchItemRepairMeta(undefined);
    assert.equal(m2.terminal, null);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// generate-blog-ai-draft source contracts
// ─────────────────────────────────────────────────────────────────────────────
describe("generate-blog-ai-draft source contracts", () => {
  const draftSrc = src("lib/blog/generate-blog-ai-draft.ts");

  it("ok:false result type exposes stage and code", () => {
    assert.match(draftSrc, /stage\?: "body" \| "seo_title"/);
    assert.match(draftSrc, /code\?: string/);
  });

  it("body repair loop increments attempt BEFORE try so catch doesn't lose it", () => {
    assert.match(draftSrc, /bodyRepairPasses \+= 1;\s+try \{/);
    assert.doesNotMatch(draftSrc, /} catch \{\s*break;\s*\}/);
  });

  it("body-too-short return sets stage:body and code:BODY_TOO_SHORT", () => {
    assert.match(draftSrc, /stage: "body",\s+code: "BODY_TOO_SHORT"/);
  });

  it("SEO duplicate return sets code:SEO_DUPLICATE_BLOCKED", () => {
    assert.match(draftSrc, /code: "SEO_DUPLICATE_BLOCKED"/);
  });

  it("body generation catch sets stage:body", () => {
    assert.match(draftSrc, /stage: "body",\s+\/\/ transient overloads/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// blog-draft-generation-batch source contracts
// ─────────────────────────────────────────────────────────────────────────────
describe("blog-draft-generation-batch source contracts", () => {
  const batchSrc = src("lib/blog/blog-draft-generation-batch.ts");

  it("imports classifyBlogPipelineFailureForRepair from classifier", () => {
    assert.match(batchSrc, /classifyBlogPipelineFailureForRepair/);
  });

  it("does NOT hardcode terminal: true for generation failures", () => {
    // The only terminal:true allowed is in the formatBlogBatchItemFailureMessage call
    // and it must be derived from the classifier (!cl.recoverable), not a literal.
    // If the literal string 'terminal: true' appears in the !result.ok block, that's the bug.
    // We check that the pattern "terminal: !cl.recoverable" is present.
    assert.match(batchSrc, /terminal: !cl\.recoverable/);
  });

  it("re-exports isLikelyTransientProviderOverload for backward compatibility", () => {
    assert.match(batchSrc, /isLikelyTransientProviderOverload/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// blog-batch-schedule source contracts
// ─────────────────────────────────────────────────────────────────────────────
describe("blog-batch-schedule source contracts", () => {
  const scheduleSrc = src("lib/blog/blog-batch-schedule.ts");

  it("imports classifyBlogPipelineFailureForRepair", () => {
    assert.match(scheduleSrc, /classifyBlogPipelineFailureForRepair/);
  });

  it("uses classifier to set terminal flag (not hardcoded)", () => {
    assert.match(scheduleSrc, /terminal: !cl\.recoverable/);
  });

  it("imports isTransientBlogProviderError from classifier", () => {
    assert.match(scheduleSrc, /isTransientBlogProviderError/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// blog-automation-engine source contracts
// ─────────────────────────────────────────────────────────────────────────────
describe("blog-automation-engine source contracts", () => {
  const engineSrc = src("lib/blog/blog-automation-engine.ts");

  it("AutomationResult failure type exposes stage, code, and details", () => {
    assert.match(engineSrc, /stage\?: string/);
    assert.match(engineSrc, /code\?: string/);
    assert.match(engineSrc, /details\?: unknown/);
  });

  it("propagates stage, code, and details from pipeline result", () => {
    assert.match(engineSrc, /stage: pipelineResult\.stage/);
    assert.match(engineSrc, /code: pipelineResult\.code/);
    assert.match(engineSrc, /details: pipelineResult\.details/);
  });
});

describe("PRE_PUBLISH_BLOCKED detail-inspection contract", () => {
  const classifierSrc = src("lib/blog/blog-generation-repair-classifier.ts");

  it("classifier exposes RECOVERABLE_PRE_PUBLISH_IDS set", () => {
    assert.match(classifierSrc, /RECOVERABLE_PRE_PUBLISH_IDS/);
  });

  it("classifier calls extractPrePublishBlocking on PRE_PUBLISH_BLOCKED", () => {
    assert.match(classifierSrc, /extractPrePublishBlocking/);
  });

  it("classifier falls back to error-text analysis when details absent", () => {
    assert.match(classifierSrc, /classifyPrePublishBlockedByErrorText/);
  });

  it("PipelineFailureLike type accepts optional details field", () => {
    assert.match(classifierSrc, /details\?: unknown/);
  });

  it("batch-draft passes details to classifier", () => {
    const batchSrc = src("lib/blog/blog-draft-generation-batch.ts");
    assert.match(batchSrc, /details: result\.details/);
  });

  it("batch-schedule passes details to classifier", () => {
    const scheduleSrc = src("lib/blog/blog-batch-schedule.ts");
    assert.match(scheduleSrc, /details: result\.details/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// batch-schedule retry-repair endpoint contracts
// ─────────────────────────────────────────────────────────────────────────────
describe("batch-schedule retry-repair endpoint", () => {
  const endpointSrc = src(
    "app/api/admin/blog/batch-schedule/items/[itemId]/retry-repair/route.ts",
  );

  it("exports POST handler", () => {
    assert.match(endpointSrc, /export async function POST/);
  });

  it("rejects terminal failures with 409", () => {
    assert.match(endpointSrc, /meta\.terminal === true/);
    assert.match(endpointSrc, /status: 409/);
  });

  it("resets to PENDING on success", () => {
    assert.match(endpointSrc, /BlogBatchScheduleItemStatus\.PENDING/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Constants sanity
// ─────────────────────────────────────────────────────────────────────────────
describe("repair constants", () => {
  it("MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS is 5", () => {
    assert.equal(MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS, 5);
  });

  it("BLOG_BODY_REPAIR_WORD_BUFFER is 150", () => {
    assert.equal(BLOG_BODY_REPAIR_WORD_BUFFER, 150);
  });
});
