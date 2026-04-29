/**
 * CLI corpus + arg parsing for blog-ai-generate. Run:
 *   npx tsx --test src/lib/blog/blog-cli.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { getBlogOpenAiChatModel, getLessonOpenAiChatModel } from "@/lib/ai/openai-env";
import { parseBlogCliArgs } from "@/lib/blog/blog-cli-generate-args";
import {
  BLOG_CLI_PATHOPHYSIOLOGY_CORPUS,
  corpusTierCoverage,
} from "@/lib/blog/blog-cli-pathophysiology-topic-corpus";
import { blogReferenceLineLooksLikePlaceholder } from "@/lib/blog/blog-cli-publish-sniff";
import { classifyBlogPipelineFailureForRepair } from "@/lib/blog/blog-generation-repair-classifier";

function readCorePackageScripts(): Record<string, string> {
  const raw = readFileSync(join(process.cwd(), "package.json"), "utf8");
  const pkg = JSON.parse(raw) as { scripts?: Record<string, string> };
  return pkg.scripts ?? {};
}

describe("parseBlogCliArgs", () => {
  it("applies defaults (limit 5, minWords 1200, publish true)", () => {
    const a = parseBlogCliArgs(["node", "blog-ai-generate.ts"]);
    assert.equal(a.limit, 5);
    assert.equal(a.minWords, 1200);
    assert.equal(a.publish, true);
    assert.equal(a.dryRun, false);
    assert.equal(a.pathophysiologyOnly, false);
    assert.equal(a.tier, null);
    assert.deepEqual(a.topics, []);
  });

  it("parses flags and clamps min-words floor to 1200", () => {
    const a = parseBlogCliArgs([
      "node",
      "x",
      "--dry-run",
      "--limit",
      "12",
      "--pathophysiology-only",
      "--tier",
      "np",
      "--publish",
      "false",
      "--min-words",
      "500",
      "--topic",
      "Sepsis bundle timing for new nurses",
    ]);
    assert.equal(a.dryRun, true);
    assert.equal(a.publish, false);
    assert.equal(a.limit, 12);
    assert.equal(a.pathophysiologyOnly, true);
    assert.equal(a.tier, "np");
    assert.equal(a.minWords, 1200);
    assert.deepEqual(a.topics, ["Sepsis bundle timing for new nurses"]);
  });

  it("dry-run forces publish false even when --publish true is passed", () => {
    const a = parseBlogCliArgs(["node", "x", "--dry-run", "--publish", "true"]);
    assert.equal(a.dryRun, true);
    assert.equal(a.publish, false);
  });
});

describe("BLOG_CLI_PATHOPHYSIOLOGY_CORPUS", () => {
  it("has at least 200 unique topics and tier coverage", () => {
    assert.ok(BLOG_CLI_PATHOPHYSIOLOGY_CORPUS.length >= 200);
    const topics = new Set(BLOG_CLI_PATHOPHYSIOLOGY_CORPUS.map((r) => r.topic));
    assert.ok(topics.size >= 200);
    const cov = corpusTierCoverage(BLOG_CLI_PATHOPHYSIOLOGY_CORPUS);
    assert.equal(cov.rn, true);
    assert.equal(cov.rpn, true);
    assert.equal(cov.pn, true);
    assert.equal(cov.np, true);
    assert.equal(cov["new-grad"], true);
    assert.equal(cov.allied, true);
  });
});

describe("blogReferenceLineLooksLikePlaceholder", () => {
  it("flags obvious placeholder citation lines", () => {
    assert.equal(blogReferenceLineLooksLikePlaceholder("Lorem ipsum dolor (2020). Journal."), true);
    assert.equal(blogReferenceLineLooksLikePlaceholder("Author. (2024). Title. https://example.com/fake."), true);
    assert.equal(
      blogReferenceLineLooksLikePlaceholder("American Heart Association. (2024). Guideline summary. Circulation."),
      false,
    );
  });
});

describe("BLOG_TITLE_BODY_GATE vs repair classifier", () => {
  it("is not recoverable (no blind-repair retry loop on title gate alone)", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "body",
      error: "On-page title is not ready for section-isolated body generation",
      code: "BLOG_TITLE_BODY_GATE",
    });
    assert.equal(r.recoverable, false);
    assert.equal(r.terminalReason, "blog_title_gate");
  });
});

describe("blog-ai-generate model env (same helpers as pipeline)", () => {
  let saved: Record<string, string | undefined>;
  beforeEach(() => {
    saved = {
      BLOG_OPENAI_MODEL: process.env.BLOG_OPENAI_MODEL,
      LESSON_OPENAI_MODEL: process.env.LESSON_OPENAI_MODEL,
      AI_INTEGRATIONS_OPENAI_MODEL: process.env.AI_INTEGRATIONS_OPENAI_MODEL,
    };
  });
  afterEach(() => {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });

  it("getBlogOpenAiChatModel matches BLOG_OPENAI_MODEL → AI_INTEGRATIONS_OPENAI_MODEL → default", () => {
    process.env.BLOG_OPENAI_MODEL = "custom-blog-model";
    process.env.AI_INTEGRATIONS_OPENAI_MODEL = "ignored-when-blog-set";
    assert.equal(getBlogOpenAiChatModel(), "custom-blog-model");
  });

  it("getLessonOpenAiChatModel matches LESSON_OPENAI_MODEL → AI_INTEGRATIONS_OPENAI_MODEL chain", () => {
    delete process.env.BLOG_OPENAI_MODEL;
    process.env.LESSON_OPENAI_MODEL = "custom-lesson-model";
    process.env.AI_INTEGRATIONS_OPENAI_MODEL = "shared-fallback";
    assert.equal(getLessonOpenAiChatModel(), "custom-lesson-model");
  });
});

describe("npm scripts (nursenest-core + repo root)", () => {
  it("exposes generate:blogs and generate:blogs:dry for blog-ai-generate (server-only stubbed for Prisma)", () => {
    const scripts = readCorePackageScripts();
    assert.match(scripts["generate:blogs"] ?? "", /stub-server-only\.cjs/);
    assert.match(scripts["generate:blogs"] ?? "", /blog-ai-generate\.ts/);
    assert.match(scripts["generate:blogs:dry"] ?? "", /--dry-run/);
    assert.match(scripts["generate:blogs:dry"] ?? "", /blog-ai-generate\.ts/);
  });

  it("root package.json delegates generate:blogs to nursenest-core", () => {
    const rootPkg = join(process.cwd(), "..", "package.json");
    const raw = readFileSync(rootPkg, "utf8");
    const pkg = JSON.parse(raw) as { scripts?: Record<string, string> };
    const s = pkg.scripts ?? {};
    assert.match(s["generate:blogs"] ?? "", /nursenest-core/);
    assert.match(s["generate:blogs:dry"] ?? "", /nursenest-core/);
  });
});
