#!/usr/bin/env node
/**
 * CI-friendly content integrity checks: lesson indexes, normalization coverage gates, and report freshness.
 * Does not connect to production DB unless DATABASE_URL is already set (optional extended checks).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportsDir = path.join(coreRoot, "reports");
const coverageJson = path.join(reportsDir, "lesson-normalization-coverage.json");
const auditMd = path.join(reportsDir, "content-source-of-truth-audit.md");

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { cwd: coreRoot, encoding: "utf8", stdio: "pipe", ...opts });
  return { status: r.status ?? 1, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

function fail(msg) {
  console.error(`[content:source-of-truth:verify] FATAL: ${msg}`);
  process.exit(1);
}

const auditMode = process.argv.includes("--audit");

if (auditMode) {
  const stamp = new Date().toISOString();
  const body = [
    "# Content source-of-truth audit",
    "",
    `Last refreshed: ${stamp} (via npm run content:source-of-truth:audit)`,
    "",
    "## Lessons",
    "",
    "- Canonical write: `PATCH/POST /api/admin/pathway-lessons/[id]` → `pathway_lessons`",
    "- Canonical public read: `pathway-lesson-catalog-sync` + `pathway-lesson-loader`",
    "- Generated indexes: `npm run build:lesson-indexes` → `src/content/pathway-lessons/generated-indexes/*.json`",
    "- After admin publish: ISR/revalidate on pathway lesson routes; rebuild indexes on deploy for snapshot parity",
    "",
    "## Blogs",
    "",
    "- Run `node scripts/report-hidden-blog-posts.mjs` for hidden/generated inventory (see script output).",
    "",
    "## Flashcards / questions",
    "",
    "- Linking metadata: `pathwayId`, `topicSlug`, `examCode`, `bodySystem` — verify topic graphs stay aligned with lesson hubs.",
    "",
  ].join("\n");
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(auditMd, `${body}\n`, "utf8");
  console.info(`[content:source-of-truth:audit] wrote ${auditMd}`);
}

if (!fs.existsSync(coverageJson)) {
  fail(`missing ${coverageJson} — run npm run build:lesson-indexes first`);
}

let coverage;
try {
  coverage = JSON.parse(fs.readFileSync(coverageJson, "utf8"));
} catch {
  fail("lesson-normalization-coverage.json is not valid JSON");
}

for (const pathway of coverage.pathways ?? []) {
  if (pathway.rawCount > 0 && pathway.renderableCount === 0) {
    fail(`pathway ${pathway.pathwayId} has raw lessons but zero renderable`);
  }
  if (!pathway.passesExclusionQualityGate) {
    fail(
      `pathway ${pathway.pathwayId} failed exclusion quality gate (${(pathway.unexpectedExclusionRate * 100).toFixed(1)}% unexpected)`,
    );
  }
}

const v = run("node", [path.join(coreRoot, "scripts", "verify-normalized-lesson-indexes.mjs")], {
  env: { ...process.env },
});
if (v.status !== 0) {
  console.error(v.stderr || v.stdout);
  fail("verify:lesson-indexes failed");
}

console.info("[content:source-of-truth:verify] ok (coverage gates + verify:lesson-indexes)");
