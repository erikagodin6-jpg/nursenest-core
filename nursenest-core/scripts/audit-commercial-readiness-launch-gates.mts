#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import type { BlueprintCoverageDashboard } from "../src/lib/blueprints/blueprint-coverage-gap-engine";
import {
  buildCommercialReadinessLaunchDashboard,
  type CommercialLaunchPathway,
  type CommercialReadinessExternalSignals,
  type CommercialReadinessLaunchDashboard,
} from "../src/lib/launch/commercial-readiness-launch-gate-system";
import { listMissingStripePriceEnvKeys } from "../src/lib/stripe/pricing-map";
import { validateMonetizationContract } from "../src/lib/platform-governance/monetization-contract";
import { validateSubscriptionContract } from "../src/lib/platform-governance/subscription-contract";

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

function readQualitySignals(): Partial<Record<CommercialLaunchPathway, number>> {
  const signals: Partial<Record<CommercialLaunchPathway, number>> = {};
  const rnReport = resolve(process.cwd(), "docs/reports/question-enrichment/rn-question-enrichment-audit-remediation-report.md");
  if (existsSync(rnReport)) {
    const text = readFileSync(rnReport, "utf8");
    const match = text.match(/Publication Readiness %:\s*([0-9.]+)/i);
    if (match?.[1]) signals["NCLEX-RN"] = Number(match[1]);
  }

  const npJson = resolve(process.cwd(), "docs/reports/question-enrichment/np-question-clinical-depth-audit.json");
  if (existsSync(npJson)) {
    const parsed = JSON.parse(readFileSync(npJson, "utf8")) as {
      dashboard?: {
        publicationReadinessPercent?: number;
        byPathway?: Partial<Record<"CNPLE" | "FNP", { total?: number; publicationReady?: number; averageDepthScore?: number }>>;
      };
    };
    const byPathway = parsed.dashboard?.byPathway;
    const cnple = byPathway?.CNPLE;
    const fnp = byPathway?.FNP;
    if (cnple?.total) signals.CNPLE = Number(((Number(cnple.publicationReady ?? 0) / cnple.total) * 100).toFixed(1));
    if (fnp?.total) signals.FNP = Number(((Number(fnp.publicationReady ?? 0) / fnp.total) * 100).toFixed(1));
    if (!signals.CNPLE && typeof parsed.dashboard?.publicationReadinessPercent === "number") {
      signals.CNPLE = parsed.dashboard.publicationReadinessPercent;
    }
  }

  return signals;
}

function buildExternalSignals(): CommercialReadinessExternalSignals {
  const monetizationViolations = validateMonetizationContract();
  const subscriptionViolations = validateSubscriptionContract();
  const missingStripe = listMissingStripePriceEnvKeys();
  return {
    qualityReadinessByPathway: readQualitySignals(),
    monetizationContractsPass: monetizationViolations.length === 0 && subscriptionViolations.length === 0 && missingStripe.length === 0,
    conversionFunnelTested: false,
  };
}

function writeReport(outDir: string, dashboard: CommercialReadinessLaunchDashboard, sourceNote: string): void {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    resolve(outDir, "commercial-readiness-launch-dashboard.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), sourceNote, dashboard }, null, 2),
  );

  writeFileSync(
    resolve(outDir, "commercial-readiness-launch-report.md"),
    [
      "# Commercial Readiness and Launch Gate Report",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      sourceNote,
      "",
      "## Launch Readiness Dashboard",
      "",
      ...mdTable([
        ["Pathway", "Status", "Overall", "Content", "Quality", "Adaptive", "SEO", "Commercial", "Reliability", "Conversion"],
        ...dashboard.launchReadinessDashboard.map((row) => [
          row.pathway,
          row.launchStatus,
          `${row.scores.overallLaunchReadiness}%`,
          `${row.scores.contentReadiness}%`,
          `${row.scores.qualityReadiness}%`,
          `${row.scores.adaptiveReadiness}%`,
          `${row.scores.seoReadiness}%`,
          `${row.scores.commercialReadiness}%`,
          `${row.scores.reliabilityReadiness}%`,
          `${row.scores.conversionReadiness}%`,
        ]),
      ]),
      "",
      "## Revenue Readiness Dashboard",
      "",
      ...mdTable([
        ["Pathway", "Revenue Opportunity", "Recommended Action"],
        ...dashboard.revenueReadinessDashboard.map((row) => [row.pathway, row.estimatedRevenueOpportunity, row.recommendedAction]),
      ]),
      "",
      "## Conversion Readiness Dashboard",
      "",
      ...mdTable([
        ["Pathway", "Conversion Readiness", "Status"],
        ...dashboard.conversionReadinessDashboard.map((row) => [row.pathway, `${row.conversionReadiness}%`, row.status]),
      ]),
      "",
      "## Reliability Dashboard",
      "",
      ...mdTable([
        ["Pathway", "Reliability", "Status", "Blockers"],
        ...dashboard.reliabilityDashboard.map((row) => [row.pathway, `${row.reliabilityReadiness}%`, row.status, row.blockers.slice(0, 3).join("; ")]),
      ]),
      "",
      "## Recommended Launch Order",
      "",
      ...mdTable([
        ["Order", "Pathway", "Status", "Overall", "Revenue Opportunity", "Next Action"],
        ...dashboard.recommendedLaunchOrder.map((row, index) => [
          String(index + 1),
          row.pathway,
          row.launchStatus,
          `${row.scores.overallLaunchReadiness}%`,
          row.estimatedRevenueOpportunity,
          row.recommendedAction,
        ]),
      ]),
      "",
      "## Remaining Work Report",
      "",
      ...dashboard.remainingWorkReport.flatMap((row) => [
        `### ${row.pathway}`,
        "",
        row.blockers.length === 0 ? "- No automated blockers detected." : row.blockers.map((blocker) => `- ${blocker}`).join("\n"),
        "",
        `Next action: ${row.nextAction}`,
        "",
      ]),
      "## Governance Rule",
      "",
      "No pathway is launch-ready because content exists. A pathway only becomes a Launch Candidate when content, quality, adaptive learning, SEO, monetization, reliability, and conversion gates all meet the launch thresholds.",
      "",
    ].join("\n"),
  );
}

const { dashboard: coverageDashboard, sourceNote } = readCoverageDashboard();
const signals = buildExternalSignals();
const dashboard = buildCommercialReadinessLaunchDashboard(coverageDashboard, signals);
const outDir = resolve(process.cwd(), "docs/reports/commercial-readiness");
writeReport(outDir, dashboard, sourceNote);
console.log(`Wrote commercial launch readiness for ${dashboard.launchReadinessDashboard.length.toLocaleString()} pathways.`);
