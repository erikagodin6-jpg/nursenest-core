import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { formatAdminRateLimitMessageFromJson } from "@/lib/admin/format-admin-rate-limit-message";
import { blogGenerationJobCreateBodySchema } from "@/lib/blog/blog-draft-generation-batch-create-body";
import { isRnTopicMapShellGenerationBatch, RN_TOPIC_MAP_SHELL_BATCH_EXAM } from "@/lib/blog/blog-topic-map-shell-batch-constants";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("blogGenerationJobCreateBodySchema accepts RN topic-map shell create body", () => {
  const shell = blogGenerationJobCreateBodySchema.safeParse({
    jobKind: "rn_topic_map_shell",
    idempotencyKey: "test-shell-idem-key-12345",
  });
  assert.equal(shell.success, true);
  if (shell.success) {
    assert.ok("jobKind" in shell.data && shell.data.jobKind === "rn_topic_map_shell");
  }
});

test("blogGenerationJobCreateBodySchema still accepts AI job body", () => {
  const ai = blogGenerationJobCreateBodySchema.safeParse({
    topicsText: "Fluid balance for NCLEX\nElectrolyte emergencies",
    exam: "NCLEX-RN",
    template: "TOPIC_EXPLAINED",
  });
  assert.equal(ai.success, true);
});

test("isRnTopicMapShellGenerationBatch matches sentinel exam", () => {
  assert.equal(isRnTopicMapShellGenerationBatch({ exam: RN_TOPIC_MAP_SHELL_BATCH_EXAM }), true);
  assert.equal(isRnTopicMapShellGenerationBatch({ exam: "NCLEX-RN" }), false);
});

test("formatAdminRateLimitMessageFromJson mentions background job for admin_blog_generation_jobs scope", () => {
  const s = formatAdminRateLimitMessageFromJson({
    error: "Too many requests",
    code: "rate_limit_exceeded",
    scope: "admin_blog_generation_jobs",
    limiter: "admin_blog_generation_jobs",
    action: "write",
  });
  assert.match(s, /background job/i);
  assert.match(s, /generation-jobs/i);
});

test("admin-blog-batch-client has no client-owned while processing loop", () => {
  const p = join(__dirname, "..", "..", "components", "admin", "admin-blog-batch-client.tsx");
  const src = readFileSync(p, "utf8");
  assert.match(src, /generation-jobs/);
  assert.equal(/\bwhile\s*\(/.test(src), false, "expected no while( loops on batch shell surface");
});
