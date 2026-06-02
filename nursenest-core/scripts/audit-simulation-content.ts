#!/usr/bin/env tsx
import fs from "node:fs/promises";
import path from "node:path";
import { buildSimulationContentAuditReport } from "@/lib/physiology-monitor/simulation-phase7-audit";

const OUT = path.resolve(process.cwd(), "docs", "simulation-content-audit.md");

function table(rows: string[][]): string {
  if (rows.length === 0) return "";
  const [head, ...body] = rows;
  return [
    `| ${head.join(" | ")} |`,
    `| ${head.map(() => "---").join(" | ")} |`,
    ...body.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function formatRecord(record: Record<string, number>): string {
  return Object.entries(record)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key, value]) => `${key}: ${value}`)
    .join("<br>");
}

function renderMarkdown(): string {
  const report = buildSimulationContentAuditReport();
  const professionRows = Object.values(report.byProfession).map((item) => [
    item.profession,
    String(item.actual),
    String(item.target),
    String(item.gap),
    item.status.toUpperCase(),
    formatRecord(item.difficulties) || "None",
    String(item.conditions.length),
    formatRecord(item.ngnFormats),
  ]);

  const clearanceRows = Object.entries(report.clearanceCoverage).map(([id, coverage]) => [
    id,
    String(coverage.mappedSimulationCount),
    String(coverage.requiredSimulationCount),
    coverage.missingSimulationIds.length > 0 ? coverage.missingSimulationIds.join("<br>") : "None",
  ]);

  const simulationRows = report.rows.map((row) => [
    row.id,
    row.professions.join(", "),
    row.difficulty,
    row.specialty.join(", "),
    row.condition,
    row.ncjmmDomains.join(", "),
    row.ngnFormats.join(", "),
    row.clearanceMappings.length > 0 ? row.clearanceMappings.join(", ") : "Unmapped",
    row.remediationMappings.length > 0 ? "Mapped" : "Missing",
  ]);

  return `# Simulation Content Audit

Generated: ${report.generatedAt}

This report is generated from the authored \`SIMULATION_CATALOG\` and \`CLEARANCE_DEFINITIONS\`. It reports real catalog counts only; it does not use marketing claims or estimated inventory.

## Executive Summary

- Authored simulations: ${report.totalSimulations}
- Phase 7 target: ${report.targetTotal}
- Remaining authored-simulation gap: ${report.totalGap}
- Current launch status: ${report.totalGap === 0 ? "READY" : "PARTIAL - content scale target not met"}

## Profession Counts

${table([["Profession", "Actual", "Target", "Gap", "Status", "Difficulty Mix", "Conditions", "NGN Format Mix"], ...professionRows])}

## Coverage Gaps

${report.gapSummary.map((gap) => `- ${gap}`).join("\n")}

## Clearance Mapping Audit

${table([["Clearance", "Mapped Required Sims", "Required Sims", "Missing Required Simulation IDs"], ...clearanceRows])}

## Simulation Inventory

${table([["Simulation ID", "Profession", "Difficulty", "Specialty", "Condition", "NCJMM Domains", "NGN Formats", "Clearance Mapping", "Remediation Mapping"], ...simulationRows])}

## Phase 7 Blockers

${report.totalGap > 0 ? "- P0: Authored simulation inventory does not meet the 250+ total / per-profession targets.\n" : ""}- P0: Missing clearance-required simulation IDs must be resolved before those clearances are marketed as earnable.
- P1: Pricing/homepage screenshots should be regenerated from the Playwright suite after QA credentials and a running app are available.
- P1: PostHog simulation events should be monitored for conversion and retention impact after deployment.
`;
}

async function main(): Promise<void> {
  const markdown = renderMarkdown();
  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, markdown, "utf8");
  console.log(`Wrote ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

