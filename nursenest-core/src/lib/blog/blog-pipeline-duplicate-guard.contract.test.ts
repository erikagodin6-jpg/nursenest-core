import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const coreRoot = join(here, "..", "..", "..");

function readSrc(rel: string): string {
  return readFileSync(join(coreRoot, "src", rel), "utf8");
}

describe("Blog generator / import — duplicate protection contracts", () => {
  it("persistControlPanelDraft checks canonical topic intent and unique slug before insert", () => {
    const persist = readSrc("lib/blog/blog-control-panel-generation.ts");
    assert.match(persist, /normalizeBlogTopicKey/);
    assert.match(persist, /findExistingBlogByCanonicalIntent/);
    assert.match(persist, /ensureUniqueBlogPostSlug/);
    assert.match(persist, /duplicate_topic/);
    assert.match(persist, /\bskipped\b:\s*true/);
  });

  it("generation pipeline surfaces persistSkipped for duplicate slug/topic skips", () => {
    const pipe = readSrc("lib/blog/blog-article-generation-pipeline.ts");
    assert.match(pipe, /persistSkipped/);
    assert.match(pipe, /persistControlPanelDraft/);
  });

  it("automation engine returns skipped + reason when pipeline skips persist", () => {
    const engine = readSrc("lib/blog/blog-automation-engine.ts");
    assert.match(engine, /persistSkipped/);
    assert.match(engine, /duplicate_slug|duplicate_topic/);
  });
});
