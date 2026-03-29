#!/usr/bin/env npx tsx
/**
 * Full audit of data/replit-exports/*.json — writes:
 * - scripts/replit-export-audit-report.json
 * - scripts/replit-export-audit-report.md
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { scanReplitExportsDir, auditReportToMarkdown } from "./replit-import/audit-scan";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const sourceRel = "data/replit-exports";

function main() {
  const report = scanReplitExportsDir(repoRoot, sourceRel);
  const jsonPath = path.join(repoRoot, "scripts", "replit-export-audit-report.json");
  const mdPath = path.join(repoRoot, "scripts", "replit-export-audit-report.md");

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf8");
  fs.writeFileSync(mdPath, auditReportToMarkdown(report), "utf8");

  console.log(JSON.stringify({ type: "audit_complete", jsonPath, mdPath, fileCount: report.files.length }, null, 2));
}

main();
