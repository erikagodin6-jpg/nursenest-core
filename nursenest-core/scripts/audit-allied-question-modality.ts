import { mkdir, writeFile } from "node:fs/promises";
import {
  alliedQuestionModalityAuditMarkdown,
  buildAlliedQuestionModalityAuditReport,
} from "../src/lib/allied/allied-question-modality-audit";
import { ensureAlliedMasteryScaffolds } from "./generate-allied-mastery-scaffolds";

async function main() {
  await ensureAlliedMasteryScaffolds();
  const report = buildAlliedQuestionModalityAuditReport();
  await mkdir("reports", { recursive: true });
  await writeFile("reports/allied-question-modality-audit.json", `${JSON.stringify(report, null, 2)}\n`);
  await writeFile("reports/allied-question-modality-audit.md", alliedQuestionModalityAuditMarkdown(report));
  if (!report.pass) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});