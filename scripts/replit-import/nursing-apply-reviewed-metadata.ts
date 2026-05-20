#!/usr/bin/env npx tsx
/**
 * Read a nursing review artifact with filled reviewed_tier / reviewed_exam and merge into
 * config/nursing-reviewed-metadata-overrides.json (does not touch manual mapping file).
 */
import "../../server/load-env";
import * as fs from "fs";
import * as path from "path";
import type { NursingReviewArtifactFileV1 } from "./nursing-review-artifact-shared";
import {
  loadReviewedOverrides,
  resolveReviewedOverridesPath,
  validateReviewedTierExam,
  type ReviewedMetadataOverridesFileV1,
} from "./nursing-review-metadata";

function parseArgs(argv: string[]) {
  const inIdx = argv.indexOf("--in");
  const inPath =
    inIdx >= 0 && argv[inIdx + 1]
      ? path.resolve(argv[inIdx + 1]!)
      : path.resolve("data/replit-exports/review/nursing-unresolved-metadata-review.json");
  const repoRoot = process.cwd();
  return { inPath, repoRoot };
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(`
Merge reviewed tier/exam from a review artifact into config/nursing-reviewed-metadata-overrides.json.

Usage:
  npx tsx scripts/replit-import/nursing-apply-reviewed-metadata.ts [--in <review-artifact.json>]

Default --in: data/replit-exports/review/nursing-unresolved-metadata-review.json
`);
    process.exit(0);
  }

  const { inPath, repoRoot } = parseArgs(argv);
  if (!fs.existsSync(inPath)) {
    console.error(JSON.stringify({ error: "file_not_found", inPath }, null, 2));
    process.exit(1);
  }

  const raw = fs.readFileSync(inPath, "utf8");
  const artifact = JSON.parse(raw) as NursingReviewArtifactFileV1;
  if (artifact?.version !== 1 || !Array.isArray(artifact.entries)) {
    console.error(JSON.stringify({ error: "invalid_review_artifact", inPath }, null, 2));
    process.exit(1);
  }

  const existing = loadReviewedOverrides(repoRoot);
  const out: ReviewedMetadataOverridesFileV1 = existing ?? {
    version: 1,
    description: "Operator-reviewed cache_key → tier/exam (merged by nursing:apply-reviewed-metadata)",
    reviewed: true,
    cacheKeyExact: {},
  };

  let accepted = 0;
  let rejected = 0;
  const rejectSamples: string[] = [];

  for (const e of artifact.entries) {
    const rt = typeof e.reviewed_tier === "string" ? e.reviewed_tier.trim() : "";
    const re = typeof e.reviewed_exam === "string" ? e.reviewed_exam.trim() : "";
    if (!rt || !re) continue;

    const v = validateReviewedTierExam(rt, re);
    if (!v.ok) {
      rejected += 1;
      if (rejectSamples.length < 20) rejectSamples.push(`${e.id}: ${v.errors.join(";")}`);
      continue;
    }

    const ck = e.cache_key;
    if (!ck) {
      rejected += 1;
      if (rejectSamples.length < 20) rejectSamples.push(`${e.id}: missing_cache_key`);
      continue;
    }

    out.cacheKeyExact[ck] = {
      tier: rt,
      exam: re,
      note: `from_review_artifact:${artifact.generatedAt ?? "unknown"}`,
      reviewedAt: new Date().toISOString(),
      source: inPath,
    };
    accepted += 1;
  }

  out.reviewed = true;
  const dest = resolveReviewedOverridesPath(repoRoot);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(out, null, 2), "utf8");

  console.log(
    JSON.stringify(
      {
        type: "nursing_apply_reviewed_metadata",
        ok: true,
        reviewArtifact: inPath,
        written: dest,
        accepted,
        rejected,
        rejectSamples,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
