#!/usr/bin/env tsx
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { PERFORMANCE_BUDGETS } from "../performance-budget.config";
import { ROUTE_PERFORMANCE_REGISTRY } from "../src/lib/performance/route-registry";

type BudgetViolation = {
  label: string;
  actual: number;
  budget: number;
  file?: string;
  detail?: string;
};

const ROOT = path.resolve(__dirname, "..");
const WARN_ONLY = process.argv.includes("--warn-only");

const violations: BudgetViolation[] = [];
const passes: string[] = [];
const notes: string[] = [];

function formatBytes(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function addPass(label: string): void {
  passes.push(label);
}

function addNote(label: string): void {
  notes.push(label);
}

function addViolation(violation: BudgetViolation): void {
  violations.push(violation);
}

function walkFiles(root: string, extensions: readonly string[]): string[] {
  if (!existsSync(root)) return [];
  const entries = readdirSync(root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const abs = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      files.push(...walkFiles(abs, extensions));
      continue;
    }
    if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(abs);
    }
  }
  return files;
}

function relative(abs: string): string {
  return path.relative(ROOT, abs).replaceAll(path.sep, "/");
}

function shouldExcludeComponent(file: string): boolean {
  const rel = `/${relative(file)}`;
  return PERFORMANCE_BUDGETS.components.excludePathParts.some((part) => rel.includes(part));
}

function checkRouteBudgets(): void {
  const routeBudget = PERFORMANCE_BUDGETS.routes.maxDurationMs;
  const apiBudget = PERFORMANCE_BUDGETS.api.maxDurationMs;
  const ciBudgets = ROUTE_PERFORMANCE_REGISTRY.filter((route) => route.ciEnforced);
  let checked = 0;

  for (const route of ciBudgets) {
    checked += 1;
    if (route.ttfbBudgetMs > routeBudget) {
      addViolation({
        label: "Route TTFB budget exceeds global hard cap",
        actual: route.ttfbBudgetMs,
        budget: routeBudget,
        detail: `${route.id} (${route.route})`,
      });
    }
    if (route.firstContentBudgetMs > routeBudget) {
      addViolation({
        label: "Route first-content budget exceeds global hard cap",
        actual: route.firstContentBudgetMs,
        budget: routeBudget,
        detail: `${route.id} (${route.route})`,
      });
    }
    if (route.category === "api") {
      const apiActual = Math.max(route.ttfbBudgetMs, route.firstContentBudgetMs);
      if (apiActual > apiBudget) {
        addViolation({
          label: "API route budget exceeds global hard cap",
          actual: apiActual,
          budget: apiBudget,
          detail: `${route.id} (${route.route})`,
        });
      }
    }
  }

  addPass(`Checked ${checked} CI-enforced route budgets against ${routeBudget}ms hard cap`);
}

function checkPrismaSlowQueryBudget(): void {
  const prismaSlowLogFile = path.join(ROOT, "src/lib/db/prisma-slow-query-log.ts");
  if (!existsSync(prismaSlowLogFile)) {
    addViolation({
      label: "Prisma slow-query logger missing",
      actual: 1,
      budget: 0,
      file: "src/lib/db/prisma-slow-query-log.ts",
    });
    return;
  }

  const content = readFileSync(prismaSlowLogFile, "utf8");
  const match = content.match(/return\s+(\d+)\s*;/g)?.at(-1);
  const defaultThreshold = match ? Number(match.match(/\d+/)?.[0]) : Number.NaN;
  const budget = PERFORMANCE_BUDGETS.database.maxQueryDurationMs;

  if (!Number.isFinite(defaultThreshold)) {
    addViolation({
      label: "Unable to parse Prisma slow-query default threshold",
      actual: 0,
      budget,
      file: "src/lib/db/prisma-slow-query-log.ts",
    });
    return;
  }

  if (defaultThreshold > budget) {
    addViolation({
      label: "Database query slow-log threshold exceeds hard budget",
      actual: defaultThreshold,
      budget,
      file: "src/lib/db/prisma-slow-query-log.ts",
      detail: "CI cannot fail on uncaptured DB timings; this threshold keeps runtime diagnostics aligned with the 250ms query budget.",
    });
    return;
  }

  addPass(`Prisma slow-query default threshold is ${defaultThreshold}ms`);
}

function checkComponentBudgets(): void {
  const files = PERFORMANCE_BUDGETS.components.includeRoots.flatMap((root) =>
    walkFiles(path.join(ROOT, root), PERFORMANCE_BUDGETS.components.extensions),
  );
  const budget = PERFORMANCE_BUDGETS.components.maxBytes;
  let checked = 0;

  for (const file of files) {
    if (shouldExcludeComponent(file)) continue;
    checked += 1;
    const size = statSync(file).size;
    if (size > budget) {
      addViolation({
        label: "Component exceeds hard size budget",
        actual: size,
        budget,
        file: relative(file),
      });
    }
  }

  addPass(`Checked ${checked} component files against ${formatBytes(budget)} hard cap`);
}

function checkClientBundleBudgets(): void {
  const chunkRoot = path.join(ROOT, PERFORMANCE_BUDGETS.bundles.clientChunkRoot);
  if (!existsSync(chunkRoot)) {
    addNote(`No client build chunks found at ${PERFORMANCE_BUDGETS.bundles.clientChunkRoot}; bundle budget runs after build in CI.`);
    return;
  }

  const budget = PERFORMANCE_BUDGETS.bundles.maxBytes;
  const files = walkFiles(chunkRoot, PERFORMANCE_BUDGETS.bundles.extensions);
  let checked = 0;

  for (const file of files) {
    checked += 1;
    const size = statSync(file).size;
    if (size > budget) {
      addViolation({
        label: "Client JS bundle exceeds hard size budget",
        actual: size,
        budget,
        file: relative(file),
      });
    }
  }

  addPass(`Checked ${checked} client JS bundles against ${formatBytes(budget)} hard cap`);
}

function checkServerChunkBudgets(): void {
  const serverRoot = path.join(ROOT, PERFORMANCE_BUDGETS.serverChunks.root);
  if (!existsSync(serverRoot)) {
    addNote(`No server chunks found at ${PERFORMANCE_BUDGETS.serverChunks.root}; server chunk budget runs after build in CI.`);
    return;
  }

  const budget = PERFORMANCE_BUDGETS.serverChunks.maxBytes;
  const files = walkFiles(serverRoot, [".js"]);
  let checked = 0;

  for (const file of files) {
    checked += 1;
    const size = statSync(file).size;
    if (size > budget) {
      addViolation({
        label: "Server chunk exceeds catalog-bundling guard",
        actual: size,
        budget,
        file: relative(file),
      });
    }
  }

  addPass(`Checked ${checked} server chunks against ${formatBytes(budget)} guard`);
}

function printSection(title: string): void {
  console.log(`\n=== ${title} ===`);
}

function printSummary(): void {
  printSection("Performance Budget Results");
  for (const pass of passes) console.log(`PASS ${pass}`);
  for (const note of notes) console.log(`NOTE ${note}`);

  if (violations.length > 0) {
    printSection("Violations");
    for (const violation of violations) {
      const actual =
        violation.label.includes("bundle") || violation.label.includes("Component") || violation.label.includes("chunk")
          ? formatBytes(violation.actual)
          : `${violation.actual}ms`;
      const budget =
        violation.label.includes("bundle") || violation.label.includes("Component") || violation.label.includes("chunk")
          ? formatBytes(violation.budget)
          : `${violation.budget}ms`;
      console.log(`FAIL ${violation.label}: ${actual} > ${budget}`);
      if (violation.file) console.log(`  file: ${violation.file}`);
      if (violation.detail) console.log(`  detail: ${violation.detail}`);
    }
  }

  console.log(`\nSummary: ${passes.length} checks passed, ${violations.length} violations`);
}

checkRouteBudgets();
checkPrismaSlowQueryBudget();
checkComponentBudgets();
checkClientBundleBudgets();
checkServerChunkBudgets();
printSummary();

if (violations.length > 0 && !WARN_ONLY) {
  process.exit(1);
}

