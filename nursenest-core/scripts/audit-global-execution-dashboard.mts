#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildGlobalExecutionDashboard,
  type ExecutionPathwaySignals,
  type GlobalExecutionDashboard,
} from "../src/lib/execution/global-execution-dashboard-expansion-kill-switch";

function mdTable(rows: string[][]): string[] {
  if (rows.length === 0) return [];
  const header = rows[0]!;
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.slice(1).map((row) => `| ${row.map((cell) => cell.replace(/\|/g, "\\|")).join(" | ")} |`),
  ];
}

function readJson<T>(path: string): T | null {
  const file = resolve(process.cwd(), path);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8")) as T;
}

function reportPathway(pathway: string): { content: number; adaptive: number; commercial: number; reliability: number; conversion: number; seo: number } {
  const payload = readJson<{
    dashboard?: {
      launchReadinessDashboard?: Array<{
        pathway: string;
        scores: {
          contentReadiness: number;
          adaptiveReadiness: number;
          seoReadiness: number;
          commercialReadiness: number;
          reliabilityReadiness: number;
          conversionReadiness: number;
        };
      }>;
    };
  }>("docs/reports/commercial-readiness/commercial-readiness-launch-dashboard.json");
  const row = payload?.dashboard?.launchReadinessDashboard?.find((item) => item.pathway === pathway);
  return {
    content: row?.scores.contentReadiness ?? 0,
    adaptive: row?.scores.adaptiveReadiness ?? 0,
    commercial: row?.scores.commercialReadiness ?? 0,
    reliability: row?.scores.reliabilityReadiness ?? 0,
    conversion: row?.scores.conversionReadiness ?? 0,
    seo: row?.scores.seoReadiness ?? 0,
  };
}

function rnQuality(): number {
  const textPath = resolve(process.cwd(), "docs/reports/question-enrichment/rn-question-enrichment-audit-remediation-report.md");
  if (!existsSync(textPath)) return 0;
  const match = readFileSync(textPath, "utf8").match(/Publication Readiness %:\s*([0-9.]+)/i);
  return match?.[1] ? Number(match[1]) : 0;
}

function npQuality(pathway: "CNPLE" | "FNP"): number {
  const payload = readJson<{
    dashboard?: {
      publicationReadinessPercent?: number;
      byPathway?: Partial<Record<"CNPLE" | "FNP", { total?: number; publicationReady?: number }>>;
    };
  }>("docs/reports/question-enrichment/np-question-clinical-depth-audit.json");
  const row = payload?.dashboard?.byPathway?.[pathway];
  if (row?.total) return Number(((Number(row.publicationReady ?? 0) / row.total) * 100).toFixed(1));
  return pathway === "CNPLE" ? (payload?.dashboard?.publicationReadinessPercent ?? 0) : 0;
}

function flashcardReadiness(group: "rn" | "pn" | "np"): number {
  const payload = readJson<{
    report?: {
      rnFlashcardReadiness?: { readinessPercent?: number };
      pnFlashcardReadiness?: { readinessPercent?: number };
      npFlashcardReadiness?: { readinessPercent?: number };
    };
  }>("docs/reports/flashcards/global-flashcard-regeneration-standardization-audit.json");
  if (group === "rn") return payload?.report?.rnFlashcardReadiness?.readinessPercent ?? 0;
  if (group === "pn") return payload?.report?.pnFlashcardReadiness?.readinessPercent ?? 0;
  return payload?.report?.npFlashcardReadiness?.readinessPercent ?? 0;
}

function countrySupplementReadiness(country: "United States" | "United Kingdom" | "Australia" | "New Zealand" | "Ireland"): number {
  const payload = readJson<{
    dashboard?: {
      auditRows?: Array<{ targetCountry: string | null; decision: { status: string } }>;
    };
  }>("docs/reports/global-content-migration-v2/global-content-migration-v2-dashboard.json");
  const rows = payload?.dashboard?.auditRows?.filter((row) => row.targetCountry === country) ?? [];
  if (rows.length === 0) return 0;
  const notBlocked = rows.filter((row) => row.decision.status !== "MIGRATION_BLOCKED").length;
  return Number(((notBlocked / rows.length) * 100).toFixed(1));
}

function signalsFor(pathway: string, group: "rn" | "pn" | "np", quality: number, country: ExecutionPathwaySignals["countrySupplements"]): ExecutionPathwaySignals {
  const launch = reportPathway(pathway);
  return {
    contentQuality: launch.content,
    questionEnrichment: quality,
    flashcards: flashcardReadiness(group),
    cat: launch.adaptive,
    practiceExams: launch.adaptive,
    reliability: launch.reliability,
    countrySupplements: country,
    seo: launch.seo,
    conversion: launch.conversion,
    revenue: launch.commercial,
    monetizationTested: launch.commercial >= 100,
    conversionFunnelTested: launch.conversion >= 95,
    supportSystemsReady: launch.reliability >= 99.9,
  };
}

function buildInputs() {
  const rn = signalsFor("NCLEX-RN", "rn", rnQuality(), countrySupplementReadiness("United States"));
  const pn = signalsFor("REx-PN", "pn", 0, 0);
  const np = signalsFor("CNPLE", "np", npQuality("CNPLE"), 0);
  const usExpansion = signalsFor("NCLEX-PN", "pn", 0, countrySupplementReadiness("United States"));
  const uk = signalsFor("NMC CBT", "rn", 0, countrySupplementReadiness("United Kingdom"));
  const australia = signalsFor("Australia RN", "rn", 0, countrySupplementReadiness("Australia"));
  const newZealand = signalsFor("New Zealand RN", "rn", 0, countrySupplementReadiness("New Zealand"));
  const ireland: ExecutionPathwaySignals = {
    contentQuality: 0,
    questionEnrichment: 0,
    flashcards: 0,
    cat: 0,
    practiceExams: 0,
    reliability: 0,
    countrySupplements: countrySupplementReadiness("Ireland"),
    seo: 0,
    conversion: 0,
    revenue: 0,
    monetizationTested: false,
    conversionFunnelTested: false,
    supportSystemsReady: false,
  };
  return { rn, pn, np, usExpansion, uk, australia, newZealand, ireland };
}

function writeReport(outDir: string, dashboard: GlobalExecutionDashboard): void {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "global-execution-dashboard.json"), JSON.stringify({ generatedAt: new Date().toISOString(), dashboard }, null, 2));
  writeFileSync(
    resolve(outDir, "global-execution-dashboard-report.md"),
    [
      "# Global Execution Dashboard and Expansion Kill Switch",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      "## Kill Switch",
      "",
      `Status: ${dashboard.killSwitchStatus}`,
      "",
      dashboard.killSwitchReasons.length ? dashboard.killSwitchReasons.map((reason) => `- ${reason}`).join("\n") : "- No kill-switch blockers.",
      "",
      "## Executive Dashboard",
      "",
      ...mdTable([
        ["Metric", "Readiness"],
        ["RN Readiness", `${dashboard.executiveDashboard.rn}%`],
        ["PN Readiness", `${dashboard.executiveDashboard.pn}%`],
        ["NP Readiness", `${dashboard.executiveDashboard.np}%`],
        ["US Expansion Readiness", `${dashboard.executiveDashboard.usExpansion}%`],
        ["UK Readiness", `${dashboard.executiveDashboard.uk}%`],
        ["Australia Readiness", `${dashboard.executiveDashboard.australia}%`],
        ["New Zealand Readiness", `${dashboard.executiveDashboard.newZealand}%`],
        ["Ireland Readiness", `${dashboard.executiveDashboard.ireland}%`],
        ["Overall Commercial Readiness", `${dashboard.executiveDashboard.overallCommercial}%`],
        ["Overall Launch Readiness", `${dashboard.executiveDashboard.overallLaunch}%`],
      ]),
      "",
      "## Current Priority Ranking",
      "",
      ...mdTable([
        ["Tier", "Label", "Status", "Initiatives"],
        ...dashboard.currentPriorityRanking.map((tier) => [String(tier.tier), tier.label, tier.status, tier.initiatives.join("; ")]),
      ]),
      "",
      "## Country Launch Gates",
      "",
      ...mdTable([
        ["Country", "Pass", "Gate Scores"],
        ...dashboard.countryLaunchGates.map((gate) => [
          gate.country,
          gate.pass ? "yes" : "no",
          Object.entries(gate.gates).map(([name, score]) => `${name}: ${score}%`).join("; "),
        ]),
      ]),
      "",
      "## Resource Allocation",
      "",
      ...mdTable([
        ["Bucket", "Policy", "Recommended"],
        ["Core ecosystem", "Minimum 70%", `${dashboard.resourceAllocation.recommendedCoreEcosystemPercent}%`],
        ["International", "Maximum 20%", `${dashboard.resourceAllocation.recommendedInternationalPercent}%`],
        ["Experimental", "Maximum 10%", `${dashboard.resourceAllocation.recommendedExperimentalPercent}%`],
      ]),
      "",
      "## Launch Approval Findings",
      "",
      dashboard.launchApprovalFindings.length ? dashboard.launchApprovalFindings.map((finding) => `- ${finding}`).join("\n") : "- No launch approval blockers.",
      "",
      "## Next Execution Focus",
      "",
      dashboard.nextExecutionFocus.map((item) => `- ${item}`).join("\n"),
      "",
      "## Success Metric Shift",
      "",
      dashboard.successMetricShift.map((item) => `- ${item}`).join("\n"),
      "",
    ].join("\n"),
  );
}

const dashboard = buildGlobalExecutionDashboard(buildInputs());
writeReport(resolve(process.cwd(), "docs/reports/global-execution"), dashboard);
console.log(`Global execution kill switch: ${dashboard.killSwitchStatus}`);
