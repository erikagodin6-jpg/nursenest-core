import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("admin/manual blog writes use verified persistence helper", () => {
  const route = readFileSync("src/app/api/admin/blog/route.ts", "utf8");
  assert.match(route, /createBlogPostWithIntegrity/);
  assert.doesNotMatch(route, /const post = await prisma\.blogPost\.create/);
});

test("control-panel generation verifies BlogPost persistence before reporting success", () => {
  const pipeline = readFileSync("src/lib/blog/blog-control-panel-generation.ts", "utf8");
  assert.match(pipeline, /createBlogPostWithIntegrity/);
  assert.match(pipeline, /BLOG_CONTROL_PANEL_AI_DRAFT_CREATE/);
});

test("async article jobs verify durable BlogPost rows before marking jobs published", () => {
  const jobs = readFileSync("src/lib/blog/blog-article-generation-job.ts", "utf8");
  assert.match(jobs, /assertBlogPostPersisted/);
  assert.match(jobs, /BLOG_ARTICLE_GENERATION_JOB_COMPLETE/);
  assert.match(jobs, /BLOG_ARTICLE_GENERATION_JOB_RETRY_COMPLETE/);
});

test("admin blog diagnostics are backed by actual database reconciliation", () => {
  const diagnostics = readFileSync("src/lib/blog/blog-persistence-integrity.ts", "utf8");
  assert.match(diagnostics, /getBlogPersistenceDiagnostics/);
  assert.match(diagnostics, /prisma\.blogPost\.count/);
  assert.match(diagnostics, /blogArticleGenerationJob\.groupBy/);
  assert.match(diagnostics, /articleJobsMissingRows/);
});
