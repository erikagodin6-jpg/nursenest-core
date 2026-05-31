import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  buildSeoCommandCenter,
  type SearchConsolePerformanceRow,
  type SeoCommandCenter,
  type SeoPageProfile,
} from "../../src/lib/seo/search-console-optimization-engine";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data/search-console");
const OUTPUT = path.join(ROOT, "docs/reports/search-console-optimization-command-center.md");

function parseNumber(value: unknown): number {
  const parsed = Number(String(value ?? "").replace(/%$/, ""));
  if (!Number.isFinite(parsed)) return 0;
  return parsed > 1 && String(value).includes("%") ? parsed / 100 : parsed;
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === "\"" && quoted && next === "\"") {
      current += "\"";
      index += 1;
    } else if (char === "\"") {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function parseCsv(source: string): SearchConsolePerformanceRow[] {
  const lines = source.split(/\r?\n/).filter((line) => line.trim());
  const header = splitCsvLine(lines[0] ?? "").map((cell) => cell.toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row = Object.fromEntries(header.map((key, index) => [key, cells[index] ?? ""]));
    return {
      page: row.page || row.url || row.pages || "",
      query: row.query || row.queries || "",
      date: row.date || undefined,
      device: row.device || undefined,
      country: row.country || undefined,
      searchAppearance: row["search appearance"] || row.searchappearance || undefined,
      clicks: parseNumber(row.clicks),
      impressions: parseNumber(row.impressions),
      ctr: parseNumber(row.ctr),
      position: parseNumber(row.position || row["average position"]),
    };
  });
}

function loadRows(kind: "current" | "previous"): SearchConsolePerformanceRow[] {
  if (!existsSync(DATA_DIR)) return [];
  const files = readdirSync(DATA_DIR).filter((file) => file.toLowerCase().includes(kind));
  return files.flatMap((file) => {
    const full = path.join(DATA_DIR, file);
    const source = readFileSync(full, "utf8");
    if (file.endsWith(".json")) return JSON.parse(source) as SearchConsolePerformanceRow[];
    if (file.endsWith(".csv")) return parseCsv(source);
    return [];
  });
}

function loadProfiles(): SeoPageProfile[] {
  const profilesPath = path.join(DATA_DIR, "page-profiles.json");
  if (!existsSync(profilesPath)) return [];
  return JSON.parse(readFileSync(profilesPath, "utf8")) as SeoPageProfile[];
}

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function table(rows: Array<Array<string | number>>): string {
  if (!rows.length) return "";
  const [header, ...body] = rows;
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...body.map((row) => `| ${row.map((cell) => String(cell).replace(/\|/g, "\\|")).join(" | ")} |`),
  ].join("\n");
}

function renderReport(dashboard: SeoCommandCenter, hasData: boolean): string {
  return `# Search Console Optimization Command Center

Generated: ${new Date().toISOString()}

${hasData ? "Source: local Search Console exports in `data/search-console/`." : "Source: no local Search Console exports found. Add `current*.csv` or `current*.json`, optional `previous*.csv` or `previous*.json`, and optional `page-profiles.json` to `data/search-console/`."}

## Executive SEO Metrics

- Total organic clicks: ${dashboard.totalOrganicTraffic}
- Total impressions: ${dashboard.totalImpressions}
- Average CTR: ${pct(dashboard.averageCtr)}
- Average position: ${dashboard.averagePosition}
- Opportunity pages: ${dashboard.opportunityPages.length}
- Content decay findings: ${dashboard.decayFindings.length}
- Authority expansion opportunities: ${dashboard.authorityExpansion.length}
- Internal link recommendations: ${dashboard.internalLinks.length}
- Snippet opportunities: ${dashboard.snippets.length}
- EEAT refresh findings: ${dashboard.eeatRefresh.length}
- Refresh queue items: ${dashboard.refreshQueue.length}

## Highest Impression / Low CTR Opportunities

${table([
  ["Tier", "Page", "Impressions", "CTR", "Expected CTR", "Position", "Recommendation"],
  ...dashboard.opportunityPages.slice(0, 25).map((item) => [
    item.priority,
    item.page,
    item.impressions,
    pct(item.ctr),
    pct(item.expectedCtr),
    item.position,
    item.recommendations[0] ?? "Refresh SERP copy and schema.",
  ]),
]) || "No qualifying opportunities yet."}

## Content Decay

${table([
  ["Page", "Click Change", "Impression Change", "Current Position", "Previous Position", "Reasons"],
  ...dashboard.decayFindings.slice(0, 25).map((item) => [
    item.page,
    `${item.clickChangePercent}%`,
    `${item.impressionChangePercent}%`,
    item.currentPosition,
    item.previousPosition,
    item.refreshReasons.join("; "),
  ]),
]) || "No decay findings yet."}

## Authority Expansion Opportunities

${table([
  ["Page", "Query", "Impressions", "Position", "Type", "Recommendation"],
  ...dashboard.authorityExpansion.slice(0, 30).map((item) => [
    item.page,
    item.query,
    item.impressions,
    item.position,
    item.opportunityType,
    item.recommendation,
  ]),
]) || "No authority expansion opportunities yet."}

## Featured Snippet Opportunities

${table([
  ["Page", "Query", "Position", "Impressions", "Block", "Recommendation"],
  ...dashboard.snippets.slice(0, 25).map((item) => [
    item.page,
    item.query,
    item.position,
    item.impressions,
    item.snippetBlock,
    item.recommendation,
  ]),
]) || "No snippet opportunities yet."}

## EEAT Refresh Queue

${table([
  ["Page", "Score", "Needs Clinical Review", "Issues"],
  ...dashboard.eeatRefresh.slice(0, 25).map((item) => [item.page, item.score, item.needsClinicalReview ? "Yes" : "No", item.issues.join("; ")]),
]) || "No EEAT findings yet."}

## Refresh Workflow Queue

${table([
  ["Tier", "Revenue Potential", "Page", "Reasons", "Actions"],
  ...dashboard.refreshQueue.slice(0, 40).map((item) => [
    item.tier,
    item.revenuePotential,
    item.page,
    [...new Set(item.reasons)].join("; "),
    [...new Set(item.actions)].join("; "),
  ]),
]) || "No refresh queue items yet."}

## Cluster Performance

${table([
  ["Cluster", "Pages", "Impressions", "Clicks", "CTR", "Avg Position", "Conversions", "Revenue", "Authority Score"],
  ...dashboard.clusters.slice(0, 25).map((item) => [
    item.cluster,
    item.pages,
    item.impressions,
    item.clicks,
    pct(item.ctr),
    item.averagePosition,
    item.conversions,
    money(item.revenueCents),
    item.authorityScore,
  ]),
]) || "No cluster performance data yet."}

## Quick Wins

${table([
  ["Tier", "Revenue Potential", "Page", "Primary Action"],
  ...dashboard.quickWins.slice(0, 25).map((item) => [item.tier, item.revenuePotential, item.page, item.actions[0] ?? "Refresh content."]),
]) || "No quick wins yet."}

## Permanent Workflow

1. Export current-month GSC rows by page/query/device/country into \`data/search-console/current.csv\`.
2. Export previous comparison period into \`data/search-console/previous.csv\`.
3. Add \`data/search-console/page-profiles.json\` when conversion, EEAT, cluster, and internal-link metadata is available.
4. Run \`npx tsx scripts/seo/generate-search-console-optimization-report.mts\`.
5. Work Tier 1 refreshes first: high traffic, high revenue potential, immediate refresh.
6. Re-run monthly and compare opportunity closure, cluster growth, and conversion attribution.
`;
}

const currentRows = loadRows("current");
const previousRows = loadRows("previous");
const profiles = loadProfiles();
const dashboard = buildSeoCommandCenter({
  currentRows,
  previousRows: previousRows.length ? previousRows : undefined,
  profiles,
});

mkdirSync(path.dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, renderReport(dashboard, currentRows.length > 0));
console.log(`Loaded ${currentRows.length} current GSC rows.`);
console.log(`Loaded ${previousRows.length} previous GSC rows.`);
console.log(`Loaded ${profiles.length} page profiles.`);
console.log(`Wrote ${path.relative(ROOT, OUTPUT)}`);
