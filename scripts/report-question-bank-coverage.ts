#!/usr/bin/env npx tsx
/**
 * JSON report: pathway coverage, canonical topic mix, quality flags (published exam_questions only).
 */
import "../src/lib/db/env-bootstrap";
import { buildQuestionBankCoverageAnalysis } from "@/lib/questions/build-question-bank-coverage-analysis";

async function main() {
  const report = await buildQuestionBankCoverageAnalysis();
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
