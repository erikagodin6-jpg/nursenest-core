#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const packageRoot = path.resolve(new URL("..", import.meta.url).pathname);
const srcRoot = path.join(packageRoot, "src");
const reportPath = path.join(packageRoot, "reports", "client-server-boundary-report.json");
const markdownReportPath = path.join(packageRoot, "reports", "server-client-boundary-audit.md");
const exts = [".ts", ".tsx", ".mts", ".mjs", ".js", ".jsx"];
const scopeArg = process.argv.find((arg) => arg.startsWith("--scope="))?.split("=")[1] ?? "all";
const phase11ClientEntrypoints = new Set([
  "src/components/admin/admin-activity-timeline-panel.tsx",
  "src/components/admin/admin-learner-health-panel.tsx",
  "src/components/admin/admin-retention-risk-client.tsx",
  "src/components/admin/admin-user-protection-panel.tsx",
  "src/components/admin/admin-view-as-controls.tsx",
  "src/components/admin/content-quality-refresh-button.tsx",
]);
const phase11ClientPrefixes = [
  "src/app/(admin)/admin/analytics/retention-risk/",
  "src/app/(admin)/admin/users/",
];

const forbiddenImportPatterns = [
  { label: "server-only", riskLevel: "Critical", test: (s) => s === "server-only" },
  { label: "@prisma/client", riskLevel: "Critical", test: (s) => s === "@prisma/client" },
  { label: "Prisma client", riskLevel: "Critical", test: (s) => s.includes("/@prisma/client") },
  { label: "posthog-node", riskLevel: "Critical", test: (s) => s === "posthog-node" },
  { label: "node:fs", riskLevel: "Critical", test: (s) => ["fs", "node:fs", "fs/promises", "node:fs/promises"].includes(s) },
  { label: "child_process", riskLevel: "Critical", test: (s) => s === "child_process" || s === "node:child_process" },
  { label: "db.server", riskLevel: "Critical", test: (s) => s.includes("db.server") },
  { label: "safe-database", riskLevel: "Critical", test: (s) => s.includes("/db/safe-database") || s.endsWith("db/safe-database") },
  { label: "@/lib/db", riskLevel: "Critical", test: (s) => s === "@/lib/db" || s.endsWith("/lib/db") },
  { label: "filesystem utility", riskLevel: "Critical", test: (s) => /(^|\/)(file-reader|read-file|file-system|filesystem|lesson-file)/.test(s) },
  { label: "lesson loader", riskLevel: "High", test: (s) => /(^|\/)(load-|loader-|.*-loader$)/.test(s) && /lesson|content|question/.test(s) },
  { label: "node:path", riskLevel: "High", test: (s) => s === "path" || s === "node:path" },
  { label: "node:os", riskLevel: "High", test: (s) => s === "os" || s === "node:os" },
];
const sourceForbiddenPatterns = [
  { label: "process.cwd()", riskLevel: "High", test: (source) => /\bprocess\.cwd\s*\(/.test(source) },
];

const transitiveRiskLevels = new Map([
  ["transitive server-only file", "Critical"],
  ["server action module", "Critical"],
]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (exts.includes(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function read(file) {
  return readFileSync(file, "utf8");
}

function isClientModule(source) {
  const trimmed = source.trimStart();
  return trimmed.startsWith('"use client"') || trimmed.startsWith("'use client'");
}

function isServerActionModule(source) {
  const trimmed = source.trimStart();
  return trimmed.startsWith('"use server"') || trimmed.startsWith("'use server'");
}

function importsFrom(source) {
  const imports = [];
  const staticImport = /^\s*import\s+(type\s+)?([^'"]*?\s+from\s+)?["']([^"']+)["']/gm;
  const dynamicImport = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;
  let match;
  while ((match = staticImport.exec(source))) {
    imports.push({ specifier: match[3], typeOnly: Boolean(match[1]) || importClauseIsTypeOnly(match[2] ?? "") });
  }
  while ((match = dynamicImport.exec(source))) {
    const nextChar = source[dynamicImport.lastIndex];
    imports.push({ specifier: match[1], typeOnly: nextChar === "." });
  }
  return imports;
}

function importClauseIsTypeOnly(clause) {
  const trimmed = clause.trim().replace(/\s+from$/, "").trim();
  if (trimmed.startsWith("type ")) return true;
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return false;
  const members = trimmed.slice(1, -1).split(",").map((part) => part.trim()).filter(Boolean);
  return members.length > 0 && members.every((member) => member.startsWith("type "));
}

function resolveSpecifier(fromFile, specifier) {
  if (specifier.startsWith("@/")) {
    return resolvePath(path.join(srcRoot, specifier.slice(2)));
  }
  if (specifier.startsWith(".")) {
    return resolvePath(path.resolve(path.dirname(fromFile), specifier));
  }
  return null;
}

function resolvePath(base) {
  if (existsSync(base) && exts.includes(path.extname(base))) return base;
  for (const ext of exts) {
    const file = `${base}${ext}`;
    if (existsSync(file)) return file;
  }
  for (const ext of exts) {
    const file = path.join(base, `index${ext}`);
    if (existsSync(file)) return file;
  }
  return null;
}

const files = walk(srcRoot);
const sourceByFile = new Map(files.map((file) => [file, read(file)]));
const importsByFile = new Map();
const clientEntrypoints = [];
const serverOnlyFiles = new Set();
const serverActionFiles = new Set();

for (const [file, source] of sourceByFile) {
  if (isClientModule(source)) {
    const rel = relative(file);
    if (
      scopeArg !== "phase11" ||
      phase11ClientEntrypoints.has(rel) ||
      phase11ClientPrefixes.some((prefix) => rel.startsWith(prefix))
    ) {
      clientEntrypoints.push(file);
    }
  }
  if (isServerActionModule(source)) serverActionFiles.add(file);
  if (importsFrom(source).some((i) => i.specifier === "server-only")) serverOnlyFiles.add(file);
  importsByFile.set(file, importsFrom(source));
}

function forbiddenFor(file, specifier) {
  const matched = forbiddenImportPatterns.find((p) => p.test(specifier));
  if (matched) return { reason: matched.label, riskLevel: matched.riskLevel };
  if (serverOnlyFiles.has(file)) {
    return { reason: "transitive server-only file", riskLevel: transitiveRiskLevels.get("transitive server-only file") };
  }
  return null;
}

function relative(file) {
  return path.relative(packageRoot, file);
}

function traceClient(entry) {
  const violations = [];
  const stack = [{ file: entry, chain: [entry] }];
  const seen = new Set();

  while (stack.length) {
    const current = stack.pop();
    const key = current.file;
    if (seen.has(key)) continue;
    seen.add(key);

    const source = sourceByFile.get(current.file) ?? "";
    for (const matched of sourceForbiddenPatterns.filter((p) => p.test(source))) {
      violations.push({
        clientEntry: relative(entry),
        file: relative(current.file),
        reason: matched.label,
        riskLevel: matched.riskLevel,
        importSpecifier: matched.label,
        chain: current.chain.map(relative),
      });
    }

    const imports = importsByFile.get(current.file) ?? [];
    for (const item of imports) {
      if (item.typeOnly) continue;
      const specifier = item.specifier;
      const directViolation = forbiddenFor(current.file, specifier);
      if (directViolation) {
        violations.push({
          clientEntry: relative(entry),
          file: relative(current.file),
          reason: directViolation.reason,
          riskLevel: directViolation.riskLevel,
          importSpecifier: specifier,
          chain: current.chain.map(relative),
        });
      }

      const resolved = resolveSpecifier(current.file, specifier);
      if (!resolved || !sourceByFile.has(resolved)) continue;
      if (serverActionFiles.has(resolved)) continue;
      const resolvedViolation = serverOnlyFiles.has(resolved)
        ? "transitive server-only file"
        : forbiddenFor(resolved, specifier);
      if (resolvedViolation) {
        const reason =
          typeof resolvedViolation === "string" ? resolvedViolation : resolvedViolation.reason;
        violations.push({
          clientEntry: relative(entry),
          file: relative(resolved),
          reason,
          riskLevel:
            typeof resolvedViolation === "string"
              ? transitiveRiskLevels.get(reason) ?? "High"
              : resolvedViolation.riskLevel,
          importSpecifier: specifier,
          chain: [...current.chain, resolved].map(relative),
        });
        continue;
      }
      stack.push({ file: resolved, chain: [...current.chain, resolved] });
    }
  }

  return violations;
}

const violations = clientEntrypoints.flatMap(traceClient);

mkdirSync(path.dirname(reportPath), { recursive: true });
writeFileSync(
  reportPath,
  `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    scope: scopeArg,
    clientEntrypoints: clientEntrypoints.map(relative).sort(),
    forbiddenImports: forbiddenImportPatterns.map((p) => p.label),
    violations,
  }, null, 2)}\n`,
);
writeFileSync(markdownReportPath, renderMarkdownReport({
  generatedAt: new Date().toISOString(),
  scope: scopeArg,
  clientEntrypoints: clientEntrypoints.map(relative).sort(),
  violations,
}));

if (violations.length > 0) {
  console.error(`[client-server-boundary] found ${violations.length} violation(s). Report: ${reportPath}`);
  console.error(`[client-server-boundary] markdown audit: ${markdownReportPath}`);
  for (const v of violations.slice(0, 20)) {
    console.error(`- ${v.reason}: ${v.clientEntry}`);
    console.error(`  chain: ${v.chain.join(" -> ")}`);
    console.error(`  import: ${v.importSpecifier}`);
  }
  process.exit(1);
}

console.log(`[client-server-boundary] OK entries=${clientEntrypoints.length} report=${reportPath}`);

function renderMarkdownReport(report) {
  const rows = report.violations
    .map((v) => {
      const chain = v.chain.join(" -> ");
      return `| \`${escapeMd(v.file ?? v.clientEntry)}\` | ${escapeMd(v.reason)} | \`${escapeMd(chain)}\` | ${escapeMd(v.riskLevel ?? "High")} |`;
    })
    .join("\n");
  return `# Server/Client Boundary Audit

Generated: ${report.generatedAt}

Scope: \`${report.scope}\`

Client entrypoints audited: ${report.clientEntrypoints.length}

Violations: ${report.violations.length}

| File | Violation | Import Chain | Risk Level |
| --- | --- | --- | --- |
${rows || "| None | None | None | None |"}
`;
}

function escapeMd(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
}
