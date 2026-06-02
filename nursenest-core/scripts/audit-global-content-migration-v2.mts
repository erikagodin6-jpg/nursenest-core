#!/usr/bin/env tsx
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  ASSET_MIGRATION_RULES,
  ROLE_SUPPLEMENT_SCOPE,
  buildGlobalContentMigrationV2Dashboard,
  type GlobalContentMigrationV2Dashboard,
} from "../src/lib/international-content/global-content-migration-engine-v2";

function mdTable(rows: string[][]): string[] {
  if (rows.length === 0) return [];
  const header = rows[0]!;
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.slice(1).map((row) => `| ${row.map((cell) => cell.replace(/\|/g, "\\|")).join(" | ")} |`),
  ];
}

function writeReport(outDir: string, dashboard: GlobalContentMigrationV2Dashboard): void {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    resolve(outDir, "global-content-migration-v2-dashboard.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), dashboard }, null, 2),
  );

  writeFileSync(
    resolve(outDir, "global-content-migration-v2-report.md"),
    [
      "# Global Content Migration Engine V2 Report",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      "## Canonical Architecture",
      "",
      dashboard.canonicalArchitecture.join(" -> "),
      "",
      "## Executive Summary",
      "",
      `- Total audited recovered assets: ${dashboard.totalAudited}`,
      `- Duplication threshold: ${dashboard.duplicationThresholdPercent}%`,
      `- Inheritance required: ${dashboard.inheritanceRequired}`,
      `- Supplement-only migrations: ${dashboard.supplementOnlyMigrations}`,
      `- Blocked migrations: ${dashboard.blockedMigrations}`,
      `- Separate asset review required: ${dashboard.separateAssetReviewRequired}`,
      "",
      "## Role Supplement Scope",
      "",
      ...mdTable([
        ["Role", "Include", "Exclude"],
        ...Object.entries(ROLE_SUPPLEMENT_SCOPE).map(([role, scope]) => [
          role,
          scope.include.join("; "),
          scope.exclude.join("; ") || "None",
        ]),
      ]),
      "",
      "## Asset Migration Rules",
      "",
      ...mdTable([
        ["Asset", "Rule"],
        ["Question", `Inherits ${ASSET_MIGRATION_RULES.question.inherits.join(" -> ")}; may vary ${ASSET_MIGRATION_RULES.question.mayVary.join(", ")}.`],
        ["Flashcard", `Inherits ${ASSET_MIGRATION_RULES.flashcard.inherits.join(" -> ")}. ${ASSET_MIGRATION_RULES.flashcard.scopeGuard}`],
        ["Simulation", `Shared: ${ASSET_MIGRATION_RULES.simulation.shared.join(", ")}. Role-specific: ${ASSET_MIGRATION_RULES.simulation.roleSpecific.join(", ")}. Country-specific: ${ASSET_MIGRATION_RULES.simulation.countrySpecific.join(", ")}.`],
      ]),
      "",
      "## Migration Audit",
      "",
      ...mdTable([
        ["Content ID", "Topic", "Asset", "Role", "Country", "Exam", "Language", "Shared %", "Decision", "Reason", "Required Layers"],
        ...dashboard.auditRows.map((row) => [
          row.contentId,
          row.topic,
          row.assetKind,
          row.targetRole,
          row.targetCountry ?? "global",
          row.targetExam ?? "shared",
          row.targetLanguage ?? "inherit",
          String(row.sharedContentPercent),
          row.decision.status,
          row.decision.reason,
          row.decision.requiredLayers.join("; ") || "None",
        ]),
      ]),
      "",
      "## Governance Requirement",
      "",
      "No new international pathway may be created until Global Core, Role Supplement, Country Supplement, Exam Supplement, and migration analysis are complete.",
      "",
      "If more than 80% of content is shared, inheritance is required and a separate duplicated asset is blocked.",
      "",
    ].join("\n"),
  );
}

const dashboard = buildGlobalContentMigrationV2Dashboard();
writeReport(resolve(process.cwd(), "docs/reports/global-content-migration-v2"), dashboard);
console.log(`Audited ${dashboard.totalAudited.toLocaleString()} recovered assets for Global Content Migration V2.`);
