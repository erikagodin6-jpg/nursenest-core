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

test("generation job create route returns a timeout-safe queued response", () => {
  const p = join(__dirname, "..", "..", "app", "api", "admin", "blog", "generation-jobs", "route.ts");
  const src = readFileSync(p, "utf8");
  assert.match(src, /createTimeoutSafeJobResponse/);
  assert.match(src, /blog_generation_job_timeout_safe_return/);
  assert.match(src, /\{\s*status:\s*202\s*\}/);
  assert.match(src, /createdAt/);
  assert.doesNotMatch(src, /loadBlogGenerationJobForAdmin/);
});

test("generation job GET supports lightweight statusPoll query", () => {
  const p = join(__dirname, "..", "..", "app", "api", "admin", "blog", "generation-jobs", "[id]", "route.ts");
  const src = readFileSync(p, "utf8");
  assert.match(src, /statusPoll/);
  assert.match(src, /loadBlogGenerationJobForAdmin/);
});

test("admin draft batch client recovers queued jobs from create/read timeout", () => {
  const p = join(__dirname, "..", "..", "components", "admin", "admin-blog-draft-batch-client.tsx");
  const src = readFileSync(p, "utf8");
  assert.match(src, /recoveredFromTimeout/);
  assert.match(src, /loadBatch\(id,\s*"poll"\)/);
  assert.match(src, /statusPoll=1/);
  assert.match(src, /Progress updates automatically/);
});

test("blog batch cron pumps background draft generation jobs", () => {
  const p = join(__dirname, "..", "..", "app", "api", "cron", "blog-batch-schedule", "route.ts");
  const src = readFileSync(p, "utf8");
  assert.match(src, /pumpBackgroundBlogDraftBatches/);
  assert.match(src, /draftGenerationItemsProcessed/);
});

test("generation job GET route uses internal load deadlines", () => {
  const p = join(__dirname, "..", "..", "app", "api", "admin", "blog", "generation-jobs", "[id]", "route.ts");
  const src = readFileSync(p, "utf8");
  assert.match(src, /JOB_LOAD_DEADLINE_STATUS_POLL_MS/);
  assert.match(src, /JOB_LOAD_DEADLINE_FULL_MS/);
  assert.match(src, /JobLoadDeadlineError/);
  assert.match(src, /JOB_RESPONSE_TIMEOUT/);
});

test("generation jobs POST route keeps create path bounded", () => {
  const p = join(__dirname, "..", "..", "app", "api", "admin", "blog", "generation-jobs", "route.ts");
  const src = readFileSync(p, "utf8");
  assert.match(src, /maxDuration = 30/);
});

test("blog generation cron logs picked job id", () => {
  const p = join(__dirname, "blog-generation-jobs.ts");
  const src = readFileSync(p, "utf8");
  assert.match(src, /blog_generation_job_cron_picked/);
});
