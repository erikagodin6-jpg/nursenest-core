#!/usr/bin/env tsx
/**
 * Evidence governance audit.
 *
 * Produces:
 * - reports/evidence-governance-audit.json
 * - reports/evidence-governance-audit.md
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  evaluateEvidenceGovernance,
  type EvidenceSource,
} from "../src/lib/evidence/evidence-governance";

const demoSources: EvidenceSource[] = [
  {
    id: "aha-acls-2025",
    title: "AHA ACLS Guidelines",
    organization: "American Heart Association",
    sourceType: "clinical-guideline",
    publicationYear: 2025,
    version: "2025",
    confidence: "authoritative",
    riskDomains: ["cardiac-acls", "critical-care"],
    reviewCadenceMonths: 12,
  },
  {
    id: "drug-guide-2020",
    title: "Legacy Drug Guide",
    sourceType: "drug-reference",
    publicationYear: 2020,
    confidence: "moderate",
    riskDomains: ["medication-safety"],
    reviewCadenceMonths: 12,
  },
];

const simulatedRows = [
  {
    id: "q-safe",
    topic: "ACLS",
    stem: "A client in pulseless ventricular tachycardia requires immediate intervention.",
    rationale: "Defibrillation is indicated for pulseless ventricular tachycardia.",
    citations: [
      {
        sourceId: "aha-acls-2025",
        claim: "Pulseless ventricular tachycardia is a shockable rhythm requiring immediate defibrillation.",
        supports: "answer" as const,
        reviewedBy: "clinical-reviewer",
        reviewedAt: new Date().toISOString(),
        quoteOrLocator: "Adult ACLS shockable rhythm algorithm",
      },
      {
        sourceId: "aha-acls-2025",
        claim: "Defibrillation is the priority intervention.",
        supports: "rationale" as const,
        reviewedBy: "clinical-reviewer",
        reviewedAt: new Date().toISOString(),
        quoteOrLocator: "Algorithm summary",
      },
    ],
  },
  {
    id: "q-stale",
    topic: "Medication Safety",
    stem: "Warfarin is safe in pregnancy.",
    rationale: "Warfarin should routinely continue throughout pregnancy.",
    citations: [
      {
        sourceId: "drug-guide-2020",
        claim: "Warfarin information.",
        supports: "general" as const,
      },
    ],
  },
];

function pct(part: number, total: number): number {
  return total ? Number(((part / total) * 100).toFixed(1)) : 0;
}

async function main(): Promise<void> {
  const rows = simulatedRows.map((row) => {
    const result = evaluateEvidenceGovernance({
      contentId: row.id,
      topic: row.topic,
      stem: row.stem,
      rationale: row.rationale,
      citations: row.citations,
      sources: demoSources,
    });

    return {
      id: row.id,
      topic: row.topic,
      evidenceScore: result.evidenceScore,
      publishable: result.publishable,
      freshness: result.freshness,
      issueCodes: result.issues.map((issue) => issue.code),
    };
  });

  const blockers = rows.filter((row) => !row.publishable).length;
  const stale = rows.filter((row) => row.freshness === "stale").length;
  const averageScore = Number(
    (
      rows.reduce((sum, row) => sum + row.evidenceScore, 0) /
      Math.max(1, rows.length)
    ).toFixed(1),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    scannedRows: rows.length,
    publishableRows: rows.length - blockers,
    publishablePercent: pct(rows.length - blockers, rows.length),
    staleRows: stale,
    stalePercent: pct(stale, rows.length),
    averageEvidenceScore: averageScore,
    evidenceGovernanceReadinessPercent: Math.max(
      0,
      Math.round(averageScore - pct(blockers, rows.length) * 0.4),
    ),
    rows,
  };

  const reportsDir = resolve(process.cwd(), "reports");
  mkdirSync(reportsDir, { recursive: true });

  const jsonPath = resolve(reportsDir, "evidence-governance-audit.json");
  const mdPath = resolve(reportsDir, "evidence-governance-audit.md");

  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  writeFileSync(
    mdPath,
    [
      "# Evidence Governance Audit",
      "",
      `Generated: ${report.generatedAt}`,
      "",
      `- Scanned rows: ${report.scannedRows}`,
      `- Publishable rows: ${report.publishableRows} (${report.publishablePercent}%)`,
      `- Stale rows: ${report.staleRows} (${report.stalePercent}%)`,
      `- Average evidence score: ${report.averageEvidenceScore}`,
      `- Evidence governance readiness: ${report.evidenceGovernanceReadinessPercent}%`,
      "",
    ].join("\n"),
  );

  console.log(`Evidence governance readiness: ${report.evidenceGovernanceReadinessPercent}%`);
  console.log(`Wrote ${jsonPath}`);
  console.log(`Wrote ${mdPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
