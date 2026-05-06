import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeBlogGenerationJobRetryBackoffMs } from "./blog-generation-retry-backoff";

describe("blog-article-generation-job retry backoff", () => {
  it("computeBlogGenerationJobRetryBackoffMs grows exponentially and caps", () => {
    assert.equal(computeBlogGenerationJobRetryBackoffMs(0), 60_000);
    assert.ok(computeBlogGenerationJobRetryBackoffMs(5) > 60_000);
    assert.equal(computeBlogGenerationJobRetryBackoffMs(99), 60_000 * 2 ** 10);
    assert.ok(computeBlogGenerationJobRetryBackoffMs(99) <= 24 * 60 * 60_000);
  });
});
