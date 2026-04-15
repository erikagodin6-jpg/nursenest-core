/**
 * Bounded page sizes and skip caps used by list APIs (questions, lessons, etc.).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isSkipBeyondLimit,
  listSkipRows,
  maxSafeOffsetPage,
  parseBoundedPageSize,
} from "@/lib/api/api-pagination-limits";
import { MAX_QUESTION_PAGE_SIZE } from "@/lib/questions/question-api-limits";

describe("parseBoundedPageSize", () => {
  it("rejects pageSize above max", () => {
    const r = parseBoundedPageSize(String(MAX_QUESTION_PAGE_SIZE + 1), {
      min: 1,
      max: MAX_QUESTION_PAGE_SIZE,
      default: 10,
    });
    assert.equal(r.ok, false);
    if (r.ok) throw new Error("expected failure");
    assert.equal(r.error.code, "page_size_limit");
  });

  it("accepts max pageSize", () => {
    const r = parseBoundedPageSize(String(MAX_QUESTION_PAGE_SIZE), {
      min: 1,
      max: MAX_QUESTION_PAGE_SIZE,
      default: 10,
    });
    assert.equal(r.ok, true);
    if (!r.ok) throw new Error("expected ok");
    assert.equal(r.pageSize, MAX_QUESTION_PAGE_SIZE);
  });
});

describe("deep pagination cap", () => {
  it("flags skip beyond default max list rows", () => {
    const skip = listSkipRows(500, MAX_QUESTION_PAGE_SIZE);
    assert.equal(isSkipBeyondLimit(skip), true);
  });

  it("maxSafeOffsetPage stays within skip budget", () => {
    const page = maxSafeOffsetPage(50, 4000);
    const skip = listSkipRows(page, 50);
    assert.equal(skip <= 4000, true);
  });
});
