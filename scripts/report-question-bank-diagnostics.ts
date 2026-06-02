#!/usr/bin/env npx tsx
/**
 * JSON coverage report for exam_questions (counts / capped buckets). Admin-style data; run where DATABASE_URL is set.
 */
import "../src/lib/db/env-bootstrap";
import { buildQuestionBankCoverageReport } from "@/lib/questions/build-question-bank-diagnostics";

async function main() {
  const report = await buildQuestionBankCoverageReport();
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
