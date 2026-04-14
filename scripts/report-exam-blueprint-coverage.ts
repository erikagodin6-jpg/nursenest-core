#!/usr/bin/env npx tsx
/**
 * JSON audit: pathway exam blueprint vs published inventory (questions, lessons, rationale quality).
 * Read-only; does not change CAT, grading, or entitlements.
 */
import "../src/lib/db/env-bootstrap";
import { buildExamBlueprintCoverageReport } from "@/lib/content-blueprint/build-blueprint-coverage-report";

async function main() {
  const report = await buildExamBlueprintCoverageReport();
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
