import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyBlogPipelineFailureForRepair,
  formatBlogBatchItemFailureMessage,
  parseBlogBatchItemRepairMeta,
  MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS,
  BLOG_BODY_REPAIR_WORD_BUFFER,
} from "@/lib/blog/blog-generation-repair-classifier";

describe("blog-generation-repair-classifier", () => {
  describe("classifyBlogPipelineFailureForRepair — recoverable cases", () => {
    it("body too short is recoverable", () => {
      const result = classifyBlogPipelineFailureForRepair({
        stage: "body",
        error: "Article body is too short (1168 words; minimum 1200). Target at least 1350 substantive words.",
      });
      assert.equal(result.recoverable, true);
      assert.equal(result.terminalReason, undefined);
    });

    it("body 'after generation' phrase is recoverable", () => {
      const result = classifyBlogPipelineFailureForRepair({
        stage: "body",
        error: "Body too short after generation attempt",
      });
      assert.equal(result.recoverable, true);
    });

    it("BODY_LONGFORM_ENFORCEMENT code is recoverable", () => {
      const result = classifyBlogPipelineFailureForRepair({
        stage: "body",
        error: "Outline H2 coverage insufficient",
        code: "BODY_LONGFORM_ENFORCEMENT",
      });
      assert.equal(result.recoverable, true);
    });

    it("SEO_DUPLICATE_BLOCKED is recoverable", () => {
      const result = classifyBlogPipelineFailureForRepair({
        stage: "persist",
        error: "Title too similar to existing post",
        code: "SEO_DUPLICATE_BLOCKED",
      });
      assert.equal(result.recoverable, true);
    });

    it("PLAN_LONGFORM_CONTRACT is recoverable", () => {
      const result = classifyBlogPipelineFailureForRepair({
        stage: "plan",
        error: "Plan does not meet longform contract",
        code: "PLAN_LONGFORM_CONTRACT",
      });
      assert.equal(result.recoverable, true);
    });
  });

  describe("classifyBlogPipelineFailureForRepair — terminal cases", () => {
    it("citations stage is terminal", () => {
      const result = classifyBlogPipelineFailureForRepair({
        stage: "citations",
        error: "Insufficient APA citations",
        code: "INSUFFICIENT_CITATIONS",
      });
      assert.equal(result.recoverable, false);
      assert.equal(result.terminalReason, "citations");
    });

    it("PRE_PUBLISH_BLOCKED is terminal", () => {
      const result = classifyBlogPipelineFailureForRepair({
        stage: "persist",
        error: "Multiple blocking pre-publish validation failures",
        code: "PRE_PUBLISH_BLOCKED",
      });
      assert.equal(result.recoverable, false);
      assert.equal(result.terminalReason, "pre_publish_blocked");
    });

    it("unsupported topic is terminal", () => {
      const result = classifyBlogPipelineFailureForRepair({
        stage: "body",
        error: "unsupported topic: not a nursing education subject",
      });
      assert.equal(result.recoverable, false);
      assert.equal(result.terminalReason, "unsupported_topic");
    });

    it("rate limit / 429 error is terminal api_failure", () => {
      const result = classifyBlogPipelineFailureForRepair({
        stage: "body",
        error: "OpenAI 429 too many requests rate limit exceeded",
      });
      assert.equal(result.recoverable, false);
      assert.equal(result.terminalReason, "api_failure");
    });
  });

  describe("formatBlogBatchItemFailureMessage", () => {
    it("embeds repair attempt count and terminal flag", () => {
      const msg = formatBlogBatchItemFailureMessage({
        originalError: "Article body too short (1168 words; minimum 1200).",
        repairAttempts: 3,
        terminal: true,
      });
      assert.match(msg, /\[NN_REPAIR_ATTEMPTS=3\]/);
      assert.match(msg, /\[NN_TERMINAL=y\]/);
      assert.match(msg, /Article body too short/);
    });

    it("marks non-terminal with 'n' flag", () => {
      const msg = formatBlogBatchItemFailureMessage({
        originalError: "some error",
        repairAttempts: 1,
        terminal: false,
      });
      assert.match(msg, /\[NN_TERMINAL=n\]/);
    });

    it("truncates very long error messages to 4000 chars", () => {
      const longError = "x".repeat(5000);
      const msg = formatBlogBatchItemFailureMessage({
        originalError: longError,
        repairAttempts: 2,
        terminal: true,
      });
      assert.ok(msg.length <= 4000);
    });
  });

  describe("parseBlogBatchItemRepairMeta", () => {
    it("parses repair attempt count and terminal flag from formatted message", () => {
      const raw = "[NN_REPAIR_ATTEMPTS=3][NN_TERMINAL=y] Article body too short (1168 words; minimum 1200).";
      const meta = parseBlogBatchItemRepairMeta(raw);
      assert.equal(meta.repairAttempts, 3);
      assert.equal(meta.terminal, true);
      assert.match(meta.message, /Article body too short/);
    });

    it("parses non-terminal flag", () => {
      const raw = "[NN_REPAIR_ATTEMPTS=1][NN_TERMINAL=n] Title too similar to existing post.";
      const meta = parseBlogBatchItemRepairMeta(raw);
      assert.equal(meta.repairAttempts, 1);
      assert.equal(meta.terminal, false);
    });

    it("returns null values for plain error strings (no metadata markers)", () => {
      const meta = parseBlogBatchItemRepairMeta("stale_generating_timeout");
      assert.equal(meta.repairAttempts, null);
      assert.equal(meta.terminal, null);
      assert.equal(meta.message, "stale_generating_timeout");
    });

    it("handles null/undefined input gracefully", () => {
      const meta1 = parseBlogBatchItemRepairMeta(null);
      assert.equal(meta1.repairAttempts, null);
      assert.equal(meta1.terminal, null);
      assert.equal(meta1.message, "");

      const meta2 = parseBlogBatchItemRepairMeta(undefined);
      assert.equal(meta2.repairAttempts, null);
    });

    it("round-trips through format → parse correctly", () => {
      const originalError = "Article body too short (1168 words; minimum 1200). Target at least 1350.";
      const formatted = formatBlogBatchItemFailureMessage({
        originalError,
        repairAttempts: 3,
        terminal: true,
      });
      const parsed = parseBlogBatchItemRepairMeta(formatted);
      assert.equal(parsed.repairAttempts, 3);
      assert.equal(parsed.terminal, true);
      assert.ok(parsed.message.includes("Article body too short"));
    });
  });

  describe("repair constants", () => {
    it("MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS is 3", () => {
      assert.equal(MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS, 3);
    });

    it("BLOG_BODY_REPAIR_WORD_BUFFER is positive", () => {
      assert.ok(BLOG_BODY_REPAIR_WORD_BUFFER > 0);
    });
  });
});

describe("generate-blog-ai-draft repair loop contract", () => {
  it("GenerateBlogAiDraftResult ok:false type includes repairPassesUsed", () => {
    // Static-type test: read the source and verify the field is declared.
    // This prevents accidental removal of the repairPassesUsed field from the type.
    const { readFileSync } = require("node:fs");
    const { join } = require("node:path");
    const src = readFileSync(
      join(process.cwd(), "src/lib/blog/generate-blog-ai-draft.ts"),
      "utf8",
    ) as string;
    assert.match(src, /ok: false.*repairPassesUsed\?: number/s);
  });

  it("body repair loop does not break on first exception (catch increments pass)", () => {
    const src = require("node:fs").readFileSync(
      require("node:path").join(process.cwd(), "src/lib/blog/generate-blog-ai-draft.ts"),
      "utf8",
    ) as string;
    // Verify the loop increments bodyRepairPasses before the try block
    // so a caught exception still consumes an attempt and doesn't loop forever.
    assert.match(src, /bodyRepairPasses \+= 1;\s+try \{/);
    // Verify the old break-on-catch pattern is NOT present
    assert.doesNotMatch(src, /} catch \{\s*break;\s*\}/);
  });
});

describe("blog-batch-schedule repair metadata contract", () => {
  it("imports formatBlogBatchItemFailureMessage", () => {
    const src = require("node:fs").readFileSync(
      require("node:path").join(process.cwd(), "src/lib/blog/blog-batch-schedule.ts"),
      "utf8",
    ) as string;
    assert.match(src, /formatBlogBatchItemFailureMessage/);
  });

  it("uses formatBlogBatchItemFailureMessage when marking FAILED", () => {
    const src = require("node:fs").readFileSync(
      require("node:path").join(process.cwd(), "src/lib/blog/blog-batch-schedule.ts"),
      "utf8",
    ) as string;
    // Confirm the failure path uses the formatter, not a raw .slice(0, 4000)
    assert.match(src, /formatBlogBatchItemFailureMessage\(\{/);
    // Confirm repairPassesUsed is read from result
    assert.match(src, /result\.repairPassesUsed/);
  });
});

describe("batch-schedule retry-repair endpoint contract", () => {
  it("endpoint file exists and exports POST handler", () => {
    const src = require("node:fs").readFileSync(
      require("node:path").join(
        process.cwd(),
        "src/app/api/admin/blog/batch-schedule/items/[itemId]/retry-repair/route.ts",
      ),
      "utf8",
    ) as string;
    assert.match(src, /export async function POST/);
    assert.match(src, /parseBlogBatchItemRepairMeta/);
    assert.match(src, /BlogBatchScheduleItemStatus\.PENDING/);
  });

  it("endpoint rejects terminal failures with 409", () => {
    const src = require("node:fs").readFileSync(
      require("node:path").join(
        process.cwd(),
        "src/app/api/admin/blog/batch-schedule/items/[itemId]/retry-repair/route.ts",
      ),
      "utf8",
    ) as string;
    assert.match(src, /meta\.terminal === true/);
    assert.match(src, /status: 409/);
  });
});
