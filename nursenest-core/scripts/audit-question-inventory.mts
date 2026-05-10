#!/usr/bin/env npx tsx
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { auditQuestionInventoryForPathway } from "@/lib/practice-tests/question-inventory-audit";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));

function argValue(name: string): string | null {
  const eq = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (eq) return eq.slice(name.length + 1).trim() || null;
  const index = process.argv.indexOf(name);
  if (index >= 0) return process.argv[index + 1]?.trim() || null;
  return null;
}

async function main(): Promise<void> {
  const pathwayId = argValue("--pathway") ?? "us-rn-nclex-rn";
  const report = await auditQuestionInventoryForPathway(pathwayId);
  const reportsDir = path.join(packageRoot, "reports");
  mkdirSync(reportsDir, { recursive: true });
  const outPath = path.join(reportsDir, `question-inventory-${pathwayId}.json`);
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`[question-inventory] pathway=${pathwayId}`);
  console.log(
    `[question-inventory] published=${report.buckets.publishedInventory} linearPracticeReady=${report.buckets.linearPracticeReadyInventory} catReady=${report.buckets.catReadyInventory}`,
  );
  console.log(
    `[question-inventory] ecg=${report.published.ecgRows} moduleOnly=${report.published.moduleOnlyRows} incomplete=${report.published.incompleteRows} catPoolValid=${report.catReady.validatePracticeCatPoolResult.ok}`,
  );
  console.log(
    `[question-inventory] categorySources bodySystem=${report.catReady.categoryDiversity.sourceBreakdown.bodySystem} topic=${report.catReady.categoryDiversity.sourceBreakdown.topic} nclexClientNeedsCategory=${report.catReady.categoryDiversity.sourceBreakdown.nclexClientNeedsCategory} general=${report.catReady.categoryDiversity.sourceBreakdown.general}`,
  );
  console.log(
    `[question-inventory] categoryDiversity finalKeys=${Object.keys(report.catReady.categoryDiversity.finalCategoryKeys).length} bodySystemTopicKeys=${Object.keys(report.catReady.categoryDiversity.bodySystemOrTopicCategoryKeys).length} nclexClientNeedsKeys=${Object.keys(report.catReady.categoryDiversity.nclexClientNeedsCategoryKeys).length} rowsCollapsingToGeneral=${report.catReady.categoryDiversity.rowsCollapsingToGeneral} rowsRescuedByNclexFallback=${report.catReady.categoryDiversity.rowsRescuedByNclexClientNeedsFallback}`,
  );
  console.log(`[question-inventory] wrote ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
