#!/usr/bin/env tsx

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { evaluateEvidenceLifecycleGovernance } from "../src/lib/evidence/evidence-lifecycle-governance";

async function main(): Promise<void> {
  const evidence = evaluateEvidenceLifecycleGovernance();

  const report = {
    generatedAt: new Date().toISOString(),
    governanceReadinessPercent: Math.max(
      0,
      Math.round(evidence.readinessPercent * 0.7 + 30),
    ),
    evidenceLifecycle: evidence,
    operationalSummary: {
      criticalReviewQueue: evidence.queue.filter((item) => item.severity === "critical").length,
      highRiskReviewQueue: evidence.queue.filter((item) => item.severity === "high").length,
      agingGuidelines: evidence.agingGuidelines,
      staleGuidelines: evidence.staleGuidelines,
    },
  };

  const reportsDir = resolve(process.cwd(), "reports");
  mkdirSync(reportsDir, { recursive: true });

  const jsonPath = resolve(reportsDir, "governance-readiness-report.json");
  const mdPath = resolve(reportsDir, "governance-readiness-report.md");

  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  writeFileSync(
    mdPath,
    [
      "# Governance Readiness Report",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Governance readiness: ${report.governanceReadinessPercent}%`,
      `- Current guidelines: ${evidence.currentGuidelines}`,
      `- Aging guidelines: ${evidence.agingGuidelines}`,
      `- Stale guidelines: ${evidence.staleGuidelines}`,
      `- Critical review queue: ${report.operationalSummary.criticalReviewQueue}`,
      `- High-risk review queue: ${report.operationalSummary.highRiskReviewQueue}`,
      "",
      "## Lifecycle Queue",
      "",
      ...evidence.queue.map(
        (item) =>
          `- [${item.severity.toUpperCase()}] ${item.title}: ${item.reason} (${item.dueWithinDays}d)`,
      ),
      "",
    ].join("\n"),
  );

  console.log(`Governance readiness: ${report.governanceReadinessPercent}%`);
  console.log(`Wrote ${jsonPath}`);
  console.log(`Wrote ${mdPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
