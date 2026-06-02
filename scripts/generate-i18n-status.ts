#!/usr/bin/env npx tsx
/**
 * Writes reports/i18n-status.json for CI and the admin i18n diagnostics dashboard.
 * Run: npm run i18n:status
 */
import fs from "fs";
import path from "path";
import { buildI18nDiagnosticsReport } from "../server/i18n-diagnostics-report";

const OUT = path.resolve(process.cwd(), "reports/i18n-status.json");

function main() {
  const report = buildI18nDiagnosticsReport();
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Wrote ${OUT}`);
  console.log(
    JSON.stringify({
      type: "i18n_status_generated",
      canonicalKeyCount: report.summary.canonicalKeyCount,
      localesWithMissing: report.summary.localesWithMissing,
      validationStatus: report.summary.validationStatus,
    }),
  );
}

main();
