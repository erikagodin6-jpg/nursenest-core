/**
 * SEO Recovery Phase 2 contract.
 *
 * Guards the robots / noindex / canonical / sitemap / schema audit outputs so the
 * Phase 2 recovery pass remains reproducible from `npm run audit:gsc-indexing`.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const auditScript = fs.readFileSync(path.join(ROOT, "scripts/seo/google-indexing-emergency-audit.ts"), "utf8");

const phase2Reports = [
  "docs/reports/robots-indexability-audit.md",
  "docs/reports/noindex-review.md",
  "docs/reports/canonical-audit.md",
  "docs/reports/duplicate-content-audit.md",
  "docs/reports/sitemap-cleanup-report.md",
  "docs/reports/internal-linking-audit.md",
  "docs/reports/crawled-not-indexed-remediation.md",
  "docs/reports/schema-health-report.md",
  "docs/reports/search-console-recovery-roadmap.md",
] as const;

describe("SEO Recovery Phase 2 audit outputs", () => {
  it("generates every requested Phase 2 report from the canonical GSC audit script", () => {
    for (const report of phase2Reports) {
      assert.match(auditScript, new RegExp(report.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  });

  it("tracks the Search Console issue counts requested for Phase 2", () => {
    assert.match(auditScript, /blockedByRobots:\s*2037/);
    assert.match(auditScript, /noindex:\s*5611/);
    assert.match(auditScript, /crawledNotIndexed:\s*718/);
    assert.match(auditScript, /duplicateWithoutUserSelectedCanonical:\s*370/);
    assert.match(auditScript, /duplicateGoogleChoseDifferentCanonical:\s*23/);
  });

  it("classifies private robots rules separately from valuable public content", () => {
    assert.match(auditScript, /Safe to block/);
    assert.match(auditScript, /Potentially dangerous/);
    assert.match(auditScript, /lesson\|question\|blog\|glossary\|flashcard\|pharmacology\|ecg\|lab/);
  });

  it("keeps generated reports explicit when production GSC URL exports are unavailable", () => {
    assert.match(auditScript, /Unable To Verify/);
    assert.match(auditScript, /data\/gsc-indexing\/blocked\.csv/);
    assert.match(auditScript, /data\/gsc-indexing\/crawled-not-indexed\.csv/);
  });
});
