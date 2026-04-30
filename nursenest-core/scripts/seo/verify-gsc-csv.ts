#!/usr/bin/env npx tsx
/**
 * Ingest GSC CSV export and emit .classified.csv with remediation hints.
 * Usage: npx tsx scripts/seo/verify-gsc-csv.ts path/to.csv [--issue=404]
 */
import { createReadStream, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { createInterface } from "node:readline";

type Row = Record<string, string>;

function urlColumn(headers: string[]): string | null {
  const lower = headers.map((h) => h.trim().toLowerCase());
  for (const c of ["address", "url", "page", "final url"]) {
    const i = lower.indexOf(c);
    if (i >= 0) return headers[i]!;
  }
  return headers[0] ?? null;
}

function classify(url: string, issue: string): string {
  let path = "";
  try {
    path = new URL(url).pathname;
  } catch {
    path = url;
  }
  const u = url.toLowerCase();
  if (issue.includes("blocked") || issue.includes("robot")) {
    if (/^\/(app|admin|api|internal|seo)\b/i.test(path)) return "keep_block";
    return "unblock_review";
  }
  if (issue.includes("noindex")) {
    if (/^\/(app|admin|api|internal)\b/i.test(path)) return "keep_noindex";
    if (/login|signup|forgot|reset-password/i.test(path)) return "keep_noindex";
    return "review_noindex";
  }
  if (issue.includes("404")) {
    if (/sitemap-index|legacy|replit/i.test(u)) return "redirect_map";
    return "redirect_or_delist";
  }
  if (issue.includes("5")) return "fix_route";
  if (issue.includes("soft")) return "content_or_404";
  if (issue.includes("indexed") || issue.includes("crawled")) return "canonical_content";
  return "manual";
}

async function parseCsv(path: string): Promise<{ headers: string[]; rows: Row[] }> {
  const rl = createInterface({ input: createReadStream(path, { encoding: "utf8" }), crlfDelay: Infinity });
  const rows: Row[] = [];
  let headers: string[] = [];
  let n = 0;
  for await (const line of rl) {
    n += 1;
    if (!line.trim()) continue;
    const cells = line.split(",").map((c) => c.replace(/^"|"$/g, "").trim());
    if (n === 1) {
      headers = cells;
      continue;
    }
    const row: Row = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? "";
    });
    rows.push(row);
  }
  return { headers, rows };
}

async function main() {
  const file = process.argv[2];
  const issueArg = process.argv.find((a) => a.startsWith("--issue="));
  const issue = issueArg?.split("=")[1]?.trim() || "unknown";
  if (!file) {
    console.error("Usage: npx tsx scripts/seo/verify-gsc-csv.ts <export.csv> [--issue=404]");
    process.exit(1);
  }
  const { headers, rows } = await parseCsv(file);
  const col = urlColumn(headers);
  if (!col) {
    console.error("[verify:gsc-export] no URL column");
    process.exit(1);
  }
  const lines = ["url,issue_hint,classification,source_file"];
  for (const row of rows) {
    const url = (row[col] ?? "").trim();
    if (!url.startsWith("http")) continue;
    const esc = url.replace(/"/g, '""');
    lines.push(`"${esc}","${issue}","${classify(url, issue)}","${basename(file)}"`);
  }
  const out = file.replace(/\.csv$/i, "") + ".classified.csv";
  writeFileSync(out, lines.join("\n"), "utf8");
  console.log(`[verify:gsc-export] wrote ${out}`);
}

await main();
