#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import type { BlueprintCoverageDashboard } from "../src/lib/blueprints/blueprint-coverage-gap-engine";
import {
  buildGlobalBlueprintPrioritizationDashboard,
  type GlobalBlueprintPrioritizationDashboard,
} from "../src/lib/blueprints/global-blueprint-gap-prioritization-engine";

function mdTable(rows: string[][]): string[] {
  if (rows.length === 0) return [];
  const header = rows[0]!;
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.slice(1).map((row) => `| ${row.map((cell) => cell.replace(/\|/g, "\\|")).join(" | ")} |`),
  ];
}

function readCoverageDashboard(): { dashboard: BlueprintCoverageDashboard; sourceNote: string } {
  const file = resolve(process.cwd(), "docs/reports/blueprint-coverage/blueprint-coverage-dashboard.json");
  if (!existsSync(file)) {
    throw new Error("Missing docs/reports/blueprint-coverage/blueprint-coverage-dashboard.json. Run scripts/audit-blueprint-coverage-gap-engine.mts first.");
  }
  const parsed = JSON.parse(readFileSync(file, "utf8")) as {
    dashboard?: BlueprintCoverageDashboard;
    sourceNote?: string;
  };
  if (!parsed.dashboard) throw new Error("Blueprint coverage dashboard JSON does not contain a dashboard payload.");
  return { dashboard: parsed.dashboard, sourceNote: parsed.sourceNote ?? "Blueprint coverage dashboard loaded from repository report." };
}

function writeReport(outDir: string, dashboard: GlobalBlueprintPrioritizationDashboard, sourceNote: string): void {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    resolve(outDir, "global-blueprint-gap-prioritization-dashboard.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), sourceNote, dashboard }, null, 2),
  );

  const topGapRows = dashboard.gapDashboard.slice(0, 40);
  const topBacklogRows = dashboard.contentRoiDashboard.slice(0, 40);
  writeFileSync(
    resolve(outDir, "global-blueprint-gap-prioritization-report.md"),
    [
      "# Global Blueprint Gap Closure and Content Prioritization Report",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      sourceNote,
      "",
      "## Executive Summary",
      "",
      `- Source Coverage: ${dashboard.blueprintCoverageDashboard.overallCoveragePercent}%`,
      `- Source Readiness: ${dashboard.blueprintCoverageDashboard.readinessPercent}%`,
      `- Source Publication Readiness: ${dashboard.blueprintCoverageDashboard.publicationPercent}%`,
      `- Source Monetization Readiness: ${dashboard.blueprintCoverageDashboard.monetizationPercent}%`,
      `- Source Adaptive Readiness: ${dashboard.blueprintCoverageDashboard.adaptiveLearningPercent}%`,
      `- Prioritized Gap Rows: ${dashboard.gapDashboard.length}`,
      `- Content ROI Backlog Rows: ${dashboard.contentRoiDashboard.length}`,
      `- Reuse-first backlog items: ${dashboard.reuseDashboard.reuseFirstBacklogItems}`,
      `- Overlay-first backlog items: ${dashboard.reuseDashboard.overlayFirstBacklogItems}`,
      `- New-content gate items: ${dashboard.reuseDashboard.newContentGateItems}`,
      "",
      "## Monetization Dashboard",
      "",
      ...mdTable([
        ["Pathway Family", "Readiness"],
        ["RN", `${dashboard.monetizationDashboard.rnReadiness}%`],
        ["PN", `${dashboard.monetizationDashboard.pnReadiness}%`],
        ["NP", `${dashboard.monetizationDashboard.npReadiness}%`],
        ["UK", `${dashboard.monetizationDashboard.ukReadiness}%`],
        ["Australia", `${dashboard.monetizationDashboard.australiaReadiness}%`],
        ["New Zealand", `${dashboard.monetizationDashboard.newZealandReadiness}%`],
        ["International", `${dashboard.monetizationDashboard.internationalReadiness}%`],
      ]),
      "",
      "## Gap Dashboard",
      "",
      ...mdTable([
        ["Exam", "Domain", "Priority", "Score", "Reuse Layer", "Generation Rule", "Rationale"],
        ...topGapRows.map((row) => [
          row.exam,
          row.domainLabel,
          row.priorityCategory,
          String(row.priorityScore),
          row.recommendedReuseLayer,
          row.generationRule,
          row.rationale,
        ]),
      ]),
      "",
      "## Content ROI Dashboard",
      "",
      ...mdTable([
        ["Rank", "Priority", "Exam", "Domain", "Lessons", "Questions", "Flashcards", "Simulations", "NGN Cases", "ROI", "Effort Hours", "Decision"],
        ...topBacklogRows.map((item) => [
          String(item.rank),
          item.priority,
          item.exam,
          item.domain,
          String(item.lessonsNeeded),
          String(item.questionsNeeded),
          String(item.flashcardsNeeded),
          String(item.simulationsNeeded),
          String(item.ngnCasesNeeded),
          String(item.expectedRoi),
          String(item.estimatedCompletionEffortHours),
          item.buildDecision,
        ]),
      ]),
      "",
      "## Reuse Dashboard",
      "",
      `Global core topics available for reuse checks: ${dashboard.reuseDashboard.globalCoreTopics.join(", ")}.`,
      "",
      "Before any item in the backlog is generated, the platform must prove that Global Core -> Role Overlay -> Country Overlay -> Exam Overlay -> Language Overlay inheritance is insufficient.",
      "",
      "## International Readiness Dashboard",
      "",
      ...mdTable([
        ["Market", "Readiness", "Required Next Action"],
        ["United Kingdom", `${dashboard.internationalReadinessDashboard.ukReadiness}%`, dashboard.internationalReadinessDashboard.requiredNextAction],
        ["Australia", `${dashboard.internationalReadinessDashboard.australiaReadiness}%`, dashboard.internationalReadinessDashboard.requiredNextAction],
        ["New Zealand", `${dashboard.internationalReadinessDashboard.newZealandReadiness}%`, dashboard.internationalReadinessDashboard.requiredNextAction],
      ]),
      "",
      "## Governance Rule",
      "",
      "No content should be generated unless it has a measurable blueprint gap, business value, adaptive-learning value, and a documented reuse-first evaluation.",
      "",
    ].join("\n"),
  );
}

const { dashboard, sourceNote } = readCoverageDashboard();
const prioritization = buildGlobalBlueprintPrioritizationDashboard(dashboard);
const outDir = resolve(process.cwd(), "docs/reports/blueprint-prioritization");
writeReport(outDir, prioritization, sourceNote);
console.log(`Wrote ${prioritization.contentRoiDashboard.length.toLocaleString()} prioritized blueprint backlog rows.`);
