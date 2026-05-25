#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const strict = process.argv.includes("--strict");
const maxAllowed = Number.parseInt(process.env.NN_FORCE_DYNAMIC_MAX ?? "404", 10);
const reportDir = `${root}/reports`;
const jsonPath = `${reportDir}/force-dynamic-audit.json`;
const mdPath = `${reportDir}/force-dynamic-audit.md`;

function rel(path) {
  return relative(root, path).replaceAll("\\", "/");
}

function areaFor(path) {
  if (path.startsWith("src/app/(marketing)/")) return "public";
  if (path.startsWith("src/app/(app)/")) return "learner";
  if (path.startsWith("src/app/(admin)/")) return "admin";
  if (path.startsWith("src/app/api/")) return "api";
  if (path.startsWith("src/app/(runtime)/")) return "runtime";
  return "other";
}

const files = fg
  .sync(`${root}/src/app/**/*.{ts,tsx}`, { absolute: true, onlyFiles: true })
  .sort()
  .map((path) => ({ path: rel(path), source: readFileSync(path, "utf8") }))
  .filter(({ source }) => /export const dynamic\s*=\s*["']force-dynamic["']/.test(source));

const byArea = {};
for (const file of files) {
  const area = areaFor(file.path);
  byArea[area] ??= [];
  byArea[area].push(file.path);
}

const publicStaticCandidatePatterns = [
  /\/pricing\/page\.tsx$/,
  /\/blog\/page\.tsx$/,
  /\/canada\/rn\//,
  /\/canada\/np\//,
  /\/canada\/rpn\//,
  /\/\[locale\]\/\[slug\]\/\[examCode\]\/(page|pricing|cat|questions|lessons)\/?page\.tsx$/,
];

const publicCandidates = files
  .map((f) => f.path)
  .filter((path) => path.startsWith("src/app/(marketing)/"))
  .filter((path) => publicStaticCandidatePatterns.some((pattern) => pattern.test(path)));

const result = {
  generatedAt: new Date().toISOString(),
  maxAllowed,
  total: files.length,
  byArea: Object.fromEntries(Object.entries(byArea).map(([area, paths]) => [area, paths.length])),
  publicCandidates,
  files: files.map((f) => f.path),
};

mkdirSync(reportDir, { recursive: true });
writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`);

const lines = [
  "# Force Dynamic Audit",
  "",
  `Generated: ${result.generatedAt}`,
  "",
  `- Total force-dynamic files: ${result.total}`,
  `- Strict max allowed: ${maxAllowed}`,
  "",
  "## By Area",
  "",
  "| Area | Count |",
  "| --- | ---: |",
];
for (const [area, count] of Object.entries(result.byArea).sort(([a], [b]) => a.localeCompare(b))) {
  lines.push(`| ${area} | ${count} |`);
}
lines.push("", "## Public Burn-Down Candidates", "");
if (publicCandidates.length === 0) {
  lines.push("No prioritized public force-dynamic candidates matched.");
} else {
  for (const path of publicCandidates) lines.push(`- \`${path}\``);
}
writeFileSync(mdPath, `${lines.join("\n")}\n`);

console.log(`[force-dynamic-audit] total=${result.total} max=${maxAllowed}`);
console.log(`[force-dynamic-audit] wrote ${rel(jsonPath)} and ${rel(mdPath)}`);

if (strict && result.total > maxAllowed) {
  console.error(`[force-dynamic-audit] strict failure: force-dynamic count ${result.total} exceeds ${maxAllowed}`);
  process.exit(1);
}
