#!/usr/bin/env tsx
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildCertificationReadinessDashboard,
  type CertificationReadinessDashboard,
  type CertificationReadinessRow,
} from "../src/lib/certification-readiness/certification-readiness-audit";

function mdTable(rows: string[][]): string[] {
  if (rows.length === 0) return [];
  const header = rows[0]!;
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.slice(1).map((row) => `| ${row.map((cell) => cell.replace(/\|/g, "\\|").replace(/\n/g, "<br>")).join(" | ")} |`),
  ];
}

function pct(value: number): string {
  return `${value}%`;
}

function gateLabels(row: CertificationReadinessRow): string {
  return row.monetizationGates.map((gate) => gate.replace(/_/g, " ")).join(", ");
}

function topGaps(row: CertificationReadinessRow): string {
  const gaps = [
    ...row.gapAnalysis.missingLessons.slice(0, 1),
    ...row.gapAnalysis.missingNgnFormats.slice(0, 2),
    ...row.gapAnalysis.missingSimulations.slice(0, 1),
    ...row.gapAnalysis.missingReadinessAnalytics.slice(0, 1),
  ];
  return gaps.length ? gaps.join("; ") : "No major automated gaps detected.";
}

function inventorySummary(row: CertificationReadinessRow): string {
  const i = row.inventory;
  return [
    `lessons ${i.lessons}`,
    `flashcards ${i.flashcards}`,
    `questions ${i.questionBank}`,
    `SATA ${i.sata}`,
    `matrix ${i.matrix}`,
    `bowtie ${i.bowtie}`,
    `sim ${i.simulations}`,
    `ECG ${i.ecg}`,
    `labs ${i.labs}`,
    `pharm ${i.pharmacology}`,
    `skills ${i.clinicalSkills}`,
    `cases ${i.caseStudies}`,
  ].join("; ");
}

function readinessRows(rows: readonly CertificationReadinessRow[]): string[][] {
  return [
    ["Profession", "Pathway", "Exam", "Launch Window", "Overall", "Content", "Quality", "Diversity", "NGN", "Simulation", "Analytics", "Monetization"],
    ...rows.map((row) => [
      row.target.profession,
      row.target.pathway,
      row.target.exam,
      row.launchWindow,
      pct(row.scores.overallReadiness),
      pct(row.scores.contentCompleteness),
      pct(row.scores.contentQuality),
      pct(row.scores.questionDiversity),
      pct(row.scores.ngnReadiness),
      pct(row.scores.simulationReadiness),
      pct(row.scores.analyticsReadiness),
      pct(row.scores.monetizationReadiness),
    ]),
  ];
}

function renderMarkdown(dashboard: CertificationReadinessDashboard): string {
  const rowsByPriority = dashboard.rows.slice().sort((a, b) => b.commercializationPriority - a.commercializationPriority);
  return [
    "# Certification Readiness and Monetization Audit",
    "",
    `Generated: ${dashboard.generatedAt}`,
    "",
    dashboard.sourcePolicy,
    "",
    "## Executive Summary",
    "",
    "This is an operational intelligence report only. It creates no public routes, no navigation, no learner-facing pages, no sitemap entries, and no publication state changes.",
    "",
    "### What Can I Confidently Sell Today?",
    "",
    dashboard.executiveSummary.top10LaunchReadyProducts.length
      ? mdTable([
          ["Rank", "Pathway", "Exam", "Overall", "Monetization", "Priority"],
          ...dashboard.executiveSummary.top10LaunchReadyProducts.map((row, index) => [
            String(index + 1),
            row.target.pathway,
            row.target.exam,
            pct(row.scores.overallReadiness),
            pct(row.scores.monetizationReadiness),
            pct(row.commercializationPriority),
          ]),
        ]).join("\n")
      : "No pathway is currently classified as Ready for Launch by the automated repository-evidenced audit.",
    "",
    "### What Needs Work?",
    "",
    ...mdTable([
      ["Rank", "Pathway", "Exam", "Gap", "Priority"],
      ...dashboard.executiveSummary.top10HighestValueGaps.map((gap, index) => [
        String(index + 1),
        gap.pathway,
        gap.exam,
        gap.gap,
        pct(gap.priority),
      ]),
    ]),
    "",
    "### What Should The Team Build Next?",
    "",
    ...mdTable([
      ["Rank", "Pathway", "Exam", "Commercial Priority", "Top Gaps"],
      ...rowsByPriority.slice(0, 10).map((row, index) => [
        String(index + 1),
        row.target.pathway,
        row.target.exam,
        pct(row.commercializationPriority),
        topGaps(row),
      ]),
    ]),
    "",
    "## Visual Launch Dashboard",
    "",
    ...mdTable([
      ["Launch Window", "Products"],
      ...Object.entries(dashboard.visualDashboards).map(([window, rows]) => [
        window,
        rows.length ? rows.map((row) => `${row.target.pathway} (${row.target.exam}, ${pct(row.scores.overallReadiness)})`).join("; ") : "None",
      ]),
    ]),
    "",
    "## Readiness Dashboard",
    "",
    ...mdTable(readinessRows(rowsByPriority)),
    "",
    "## Monetization Gates",
    "",
    ...mdTable([
      ["Pathway", "Exam", "Gates"],
      ...rowsByPriority.map((row) => [row.target.pathway, row.target.exam, gateLabels(row)]),
    ]),
    "",
    "## Content Inventory",
    "",
    ...mdTable([
      ["Pathway", "Exam", "Inventory", "Evidence Sources"],
      ...rowsByPriority.map((row) => [row.target.pathway, row.target.exam, inventorySummary(row), row.evidenceSources.join("; ")]),
    ]),
    "",
    "## Gap Analysis",
    "",
    ...rowsByPriority.flatMap((row) => [
      `### ${row.target.pathway} - ${row.target.exam}`,
      "",
      ...mdTable([
        ["Gap Type", "Findings"],
        ["Missing body systems", row.gapAnalysis.missingBodySystems.join("; ") || "None detected"],
        ["Missing specialties", row.gapAnalysis.missingSpecialties.join("; ") || "None detected"],
        ["Missing NGN formats", row.gapAnalysis.missingNgnFormats.join("; ") || "None detected"],
        ["Missing simulations", row.gapAnalysis.missingSimulations.join("; ") || "None detected"],
        ["Missing lessons", row.gapAnalysis.missingLessons.join("; ") || "None detected"],
        ["Missing readiness analytics", row.gapAnalysis.missingReadinessAnalytics.join("; ") || "None detected"],
        ["Missing screenshots", row.gapAnalysis.missingScreenshots.join("; ") || "None detected"],
      ]),
      "",
    ]),
    "## Future Pathway Support",
    "",
    "Future pathways are added by registering a new audit target with tags and maturity targets. The scoring engine does not require a public route, sitemap entry, navigation item, pricing surface, or learner-facing page.",
    "",
  ].join("\n");
}

const dashboard = buildCertificationReadinessDashboard(process.cwd());
const outDir = resolve(process.cwd(), "docs/reports/certification-readiness");
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "certification-readiness-dashboard.json"), JSON.stringify({ generatedAt: dashboard.generatedAt, dashboard }, null, 2));
writeFileSync(resolve(outDir, "certification-readiness-monetization-audit.md"), renderMarkdown(dashboard));
console.log(`Wrote certification readiness dashboard for ${dashboard.rows.length.toLocaleString()} targets.`);
