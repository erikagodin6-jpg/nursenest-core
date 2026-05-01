import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseGenerateBlogPostsCliArgs,
  readTopicsFromTopicsFile,
  validateScriptBlogPostPayload,
} from "@/lib/blog/generate-blog-posts-pipeline";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

describe("parseGenerateBlogPostsCliArgs", () => {
  it("defaults to draft and pathway", () => {
    const r = parseGenerateBlogPostsCliArgs(["node", "x"]);
    assert.equal(r.publish, false);
    assert.equal(r.pathwayId, "ca-rn-nclex-rn");
    assert.equal(r.dryRun, false);
  });

  it("parses topic, pathway, and publish", () => {
    const r = parseGenerateBlogPostsCliArgs([
      "node",
      "x",
      "--topic=Fluid overload basics",
      "--pathway=us-rn-nclex-rn",
      "--publish=true",
    ]);
    assert.deepEqual(r.topics, ["Fluid overload basics"]);
    assert.equal(r.pathwayId, "us-rn-nclex-rn");
    assert.equal(r.publish, true);
  });

  it("dry-run forces publish false", () => {
    const r = parseGenerateBlogPostsCliArgs(["node", "x", "--publish=true", "--dry-run"]);
    assert.equal(r.dryRun, true);
    assert.equal(r.publish, false);
  });
});

describe("readTopicsFromTopicsFile", () => {
  it("reads newline file", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nn-blog-topics-"));
    const f = path.join(dir, "t.txt");
    fs.writeFileSync(f, "One topic here\n# skip\n\nAnother topic\n", "utf8");
    const topics = readTopicsFromTopicsFile(f);
    assert.deepEqual(topics, ["One topic here", "Another topic"]);
  });

  it("reads json array", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nn-blog-topics-json-"));
    const f = path.join(dir, "t.json");
    fs.writeFileSync(f, JSON.stringify(["Alpha", "Beta"]), "utf8");
    const topics = readTopicsFromTopicsFile(f);
    assert.deepEqual(topics, ["Alpha", "Beta"]);
  });
});

describe("validateScriptBlogPostPayload", () => {
  const goodBody = `
    <h1>Main Title</h1>
    <p>Intro paragraph with enough text for nursing students preparing for the exam.</p>
    <h2>Section A</h2><p>Content.</p>
    <h2>Section B</h2><p>More content and a <a href="/questions">practice question bank</a>.</p>
  `.repeat(40);

  it("accepts a well-formed payload", () => {
    const r = validateScriptBlogPostPayload({
      slug: "sample-slug-for-nclex",
      title: "Sample title",
      body: goodBody,
      excerpt: "Short excerpt for cards.",
      keyQuestions: ["What is the priority intervention?"],
      ctaHref: "/pricing",
      ctaText: "Upgrade for full access",
      minWords: 50,
    });
    assert.equal(r.ok, true);
    assert.equal(r.reasons.length, 0);
  });

  it("rejects bad slug and thin body", () => {
    const r = validateScriptBlogPostPayload({
      slug: "Bad_Slug",
      title: "",
      body: "<h1>x</h1><p>short</p>",
      excerpt: "",
      keyQuestions: [],
      ctaHref: null,
      ctaText: null,
      minWords: 5000,
    });
    assert.equal(r.ok, false);
    assert.ok(r.reasons.some((x) => x.includes("slug")));
    assert.ok(r.reasons.some((x) => x.includes("body_below")));
  });
});
