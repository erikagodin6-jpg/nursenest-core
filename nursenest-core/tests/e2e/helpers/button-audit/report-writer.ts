import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { InventoryReport, SafeInteractionReport } from "./types";

export const BUTTON_AUDIT_DIR = path.join("test-results", "button-audit");

export async function writeInventoryReport(report: InventoryReport): Promise<{ jsonPath: string; mdPath: string }> {
  await mkdir(BUTTON_AUDIT_DIR, { recursive: true });
  const jsonPath = path.join(BUTTON_AUDIT_DIR, `inventory-${report.role}.json`);
  await writeFile(jsonPath, JSON.stringify(report, null, 2), "utf8");

  const lines: string[] = [
    "# Button / control inventory",
    "",
    `- Generated: ${report.generatedAt}`,
    `- Base URL: ${report.baseURL}`,
    `- Role: ${report.role}`,
    "",
    "## Summary",
    "",
    `| Page | Controls | Truncated |`,
    `|------|----------|-----------|`,
  ];
  for (const p of report.pages) {
    lines.push(`| ${p.pathname} | ${p.controls.length} | ${p.truncated ? "yes" : "no"} |`);
  }
  lines.push("");
  const mdPath = path.join(BUTTON_AUDIT_DIR, `inventory-${report.role}.md`);
  await writeFile(mdPath, lines.join("\n"), "utf8");
  return { jsonPath, mdPath };
}

export async function writeSafeInteractionReport(report: SafeInteractionReport): Promise<{ jsonPath: string; mdPath: string }> {
  await mkdir(BUTTON_AUDIT_DIR, { recursive: true });
  const jsonPath = path.join(BUTTON_AUDIT_DIR, `safe-interaction-${report.role}.json`);
  await writeFile(jsonPath, JSON.stringify(report, null, 2), "utf8");

  const lines: string[] = [
    "# Safe interaction audit",
    "",
    `- Generated: ${report.generatedAt}`,
    `- Role: ${report.role}`,
    `- Results: ${report.results.length}, failures: ${report.failures.length}`,
    "",
    "## Failures",
    "",
  ];
  for (const f of report.failures) {
    lines.push(`- ${f.outcome} — ${f.pathname} — ${f.control.text.slice(0, 80)}`);
    if (f.detail) lines.push(`  - ${f.detail}`);
    if (f.screenshotPath) lines.push(`  - screenshot: ${f.screenshotPath}`);
  }
  const mdPath = path.join(BUTTON_AUDIT_DIR, `safe-interaction-${report.role}.md`);
  await writeFile(mdPath, lines.join("\n"), "utf8");
  return { jsonPath, mdPath };
}

export async function writePathwayReport(payload: unknown, filename: string): Promise<string> {
  await mkdir(BUTTON_AUDIT_DIR, { recursive: true });
  const jsonPath = path.join(BUTTON_AUDIT_DIR, filename);
  await writeFile(jsonPath, JSON.stringify(payload, null, 2), "utf8");
  return jsonPath;
}
