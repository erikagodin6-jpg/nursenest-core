#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const packageRoot = path.resolve(new URL("..", import.meta.url).pathname);
const srcRoot = path.join(packageRoot, "src");
const reportPath = path.join(packageRoot, "reports", "client-server-boundary-report.json");
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
  { label: "server-only", test: (s) => s === "server-only" },
  { label: "@prisma/client", test: (s) => s === "@prisma/client" },
  { label: "Prisma client", test: (s) => s.includes("/@prisma/client") },
  { label: "db.server", test: (s) => s.includes("db.server") },
  { label: "safe-database", test: (s) => s.includes("/db/safe-database") || s.endsWith("db/safe-database") },
  { label: "@/lib/db", test: (s) => s === "@/lib/db" || s.endsWith("/lib/db") },
];

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
  const staticImport = /\bimport\s+(type\s+)?(?:[^'"]*?\s+from\s+)?["']([^"']+)["']/g;
  const dynamicImport = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;
  let match;
  while ((match = staticImport.exec(source))) {
    imports.push({ specifier: match[2], typeOnly: Boolean(match[1]) });
  }
  while ((match = dynamicImport.exec(source))) imports.push({ specifier: match[1], typeOnly: false });
  return imports;
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
  if (matched) return matched.label;
  if (serverOnlyFiles.has(file)) return "transitive server-only file";
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

    const imports = importsByFile.get(current.file) ?? [];
    for (const item of imports) {
      if (item.typeOnly) continue;
      const specifier = item.specifier;
      const directViolation = forbiddenFor(current.file, specifier);
      if (directViolation) {
        violations.push({
          clientEntry: relative(entry),
          reason: directViolation,
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
        violations.push({
          clientEntry: relative(entry),
          reason: resolvedViolation,
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

if (violations.length > 0) {
  console.error(`[client-server-boundary] found ${violations.length} violation(s). Report: ${reportPath}`);
  for (const v of violations.slice(0, 20)) {
    console.error(`- ${v.reason}: ${v.clientEntry}`);
    console.error(`  chain: ${v.chain.join(" -> ")}`);
    console.error(`  import: ${v.importSpecifier}`);
  }
  process.exit(1);
}

console.log(`[client-server-boundary] OK entries=${clientEntrypoints.length} report=${reportPath}`);
