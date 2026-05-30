#!/usr/bin/env tsx
/**
 * Navigation Compliance Audit Script
 *
 * Scans all learner route layouts and reports compliance with the
 * navigation contract defined in src/lib/nav-governance/navigation-contract.ts
 *
 * Run from nursenest-core/:
 *   npm run test:nav-contract:audit
 *   npx tsx scripts/nav-compliance-audit.mts
 *
 * Exits with code 1 if any violations are found.
 */

import { buildNavigationAuditReport } from "../src/lib/nav-governance/navigation-audit.js";

const report = buildNavigationAuditReport(process.cwd());

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("  NAVIGATION COMPLIANCE AUDIT");
console.log(`  Contract: v${report.contractVersion}  |  ${report.auditedAt}`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

console.log(`  Total routes audited:    ${report.totalRoutes}`);
console.log(`  ✅ Compliant:            ${report.compliantCount}`);
console.log(`  ⚠️  Approved exceptions: ${report.approvedExceptionCount}`);
console.log(`  ❌ Violations:           ${report.violationCount}`);
console.log(`  📊 Compliance rate:      ${report.complianceRate}%\n`);

if (report.violations.length > 0) {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  ❌ VIOLATIONS DETECTED");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  for (const v of report.violations) {
    console.log(`  Route:  ${v.routePath}`);
    console.log(`  File:   ${v.filePath}`);
    console.log(`  Detail: ${v.detail}`);
    console.log();
  }
  console.log("  ▸ Fix: Add to APPROVED_MODULE_EXCEPTIONS in navigation-contract.ts (with justification)");
  console.log("  ▸ Fix: Or migrate route to src/app/(app)/app/(learner)/\n");
} else {
  console.log("  ✅ No violations detected.\n");
}

if (report.approvedExceptionCount > 0) {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  ⚠️  APPROVED EXCEPTIONS (pending migration)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  for (const r of report.routes.filter((r) => r.status === "approved-exception")) {
    console.log(`  ${r.routePath}  →  ${r.exception?.label ?? "exception"} (${r.exception?.migrationStatus ?? "pending"})`);
  }
  console.log();
}

console.log(`  Summary: ${report.summary}\n`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

process.exit(report.violationCount > 0 ? 1 : 0);
