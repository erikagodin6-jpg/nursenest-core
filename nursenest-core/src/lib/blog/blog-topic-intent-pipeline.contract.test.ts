import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

test("blog generation entrypoints normalize broad topics before plan-stage rejection", () => {
  const appRoot = process.cwd();
  const pipeline = readFileSync(join(appRoot, "src/lib/blog/blog-article-generation-pipeline.ts"), "utf8");
  const simpleDraft = readFileSync(join(appRoot, "src/lib/blog/generate-blog-ai-draft.ts"), "utf8");

  assert.match(pipeline, /normalizeBlogTopicIntent/);
  assert.match(pipeline, /rawTopic:\s*input\.topic/);
  assert.match(pipeline, /normalizedTopic:\s*effectiveInput\.topic/);

  assert.match(simpleDraft, /normalizeBlogTopicIntent/);
  assert.match(simpleDraft, /rawTopic:\s*d\.topic/);
  assert.match(simpleDraft, /normalizedTopic:\s*effectiveTopic/);
});
