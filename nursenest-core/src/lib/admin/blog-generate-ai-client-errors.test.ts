import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatBlogGenerateAiFlattenedErrors } from "./blog-generate-ai-client-errors";

describe("formatBlogGenerateAiFlattenedErrors", () => {
  it("labels field errors", () => {
    const msg = formatBlogGenerateAiFlattenedErrors({
      fieldErrors: { topic: ["String must contain at least 3 character(s)"] },
      formErrors: [],
    });
    assert.match(msg, /topic:/i);
    assert.match(msg, /3/);
  });

  it("falls back to form-level errors", () => {
    const msg = formatBlogGenerateAiFlattenedErrors({
      fieldErrors: {},
      formErrors: ["Topics batch too large"],
    });
    assert.match(msg, /Topics batch too large/);
  });
});
