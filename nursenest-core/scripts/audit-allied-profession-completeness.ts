#!/usr/bin/env tsx
/**
 * NurseNest — Allied Profession Completeness Audit CLI
 *
 * Usage:
 *   tsx scripts/audit-allied-profession-completeness.ts [options]
 *
 * Options:
 *   --json                    Write JSON report to reports/allied-profession-completeness-audit.json
 *   --markdown                Write Markdown report to reports/allied-profession-completeness-audit.md
 *   --strict                  Exit with code 1 if any profession fails
 *   --strict-warnings         Exit with code 1 if any profession has warnings (implies --strict for warnings)
 *   --min-lessons=<number>    Override minimum lessons threshold
 *   --min-flashcards=<number> Override minimum flashcards threshold
 *   --min-questions=<number>  Override minimum questions threshold
 *   --min-cat-questions=<number> Override minimum CAT-eligible questions threshold
 *   --help                    Show this help message
 */

import {
  runAlliedProfessionCompletenessAudit,
  formatReportAsJson,
  formatReportAsMarkdown,
  type AlliedCompletenessContentRepository,
  PrismaAlliedCompletenessRepository,
  AlliedCompletenessSchemaNotReadyError,
} from "../src/lib/audit/allied-profession-completeness-guard";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

import { loadRuntimeEnv, isRuntimeEnvError } from "./lib/load-runtime-env.mjs";
import {
  ALLIED_AUDIT_REQUIRED_COLUMNS,
  assertRequiredColumnsFromDatabaseUrl,
  formatMissingColumns,
  isSchemaReadinessError,
} from "./lib/schema-readiness.mjs";

// ============================================================================
// CLI Argument Parsing
// ============================================================================

interface CliArgs {
  json: boolean;
  markdown: boolean;
  strict: boolean;
  strictWarnings: boolean;
  minLessons?: number;
  minFlashcards?: number;
  minQuestions?: number;
  minCatQuestions?: number;
  help: boolean;
}

function parseArgs(args: string[]): CliArgs {
  const result: CliArgs = {
    json: false,
    markdown: false,
    strict: false,
    strictWarnings: false,
    help: false,
  };

  for (const arg of args) {
    switch (arg) {
      case "--json":
        result.json = true;
        break;
      case "--markdown":
        result.markdown = true;
        break;
      case "--strict":
        result.strict = true;
        break;
      case "--strict-warnings":
        result.strictWarnings = true;
        break;
      case "--help":
        result.help = true;
        break;
      default:
        if (arg.startsWith("--min-lessons=")) {
          result.minLessons = parseInt(arg.split("=")[1], 10);
        } else if (arg.startsWith("--min-flashcards=")) {
          result.minFlashcards = parseInt(arg.split("=")[1], 10);
        } else if (arg.startsWith("--min-questions=")) {
          result.minQuestions = parseInt(arg.split("=")[1], 10);
        } else if (arg.startsWith("--min-cat-questions=")) {
          result.minCatQuestions = parseInt(arg.split("=")[1], 10);
        } else {
          console.error(`Unknown argument: ${arg}`);
          process.exit(1);
        }
    }
  }

  return result;
}

function showHelp() {
  console.log(`
NurseNest — Allied Profession Completeness Audit CLI

Usage:
  tsx scripts/audit-allied-profession-completeness.ts [options]

Options:
  --json                    Write JSON report to reports/allied-profession-completeness-audit.json
  --markdown                Write Markdown report to reports/allied-profession-completeness-audit.md
  --strict                  Exit with code 1 if any profession fails
  --strict-warnings         Exit with code 1 if any profession has warnings
  --min-lessons=<number>    Override minimum lessons threshold (default: 200)
  --min-flashcards=<number> Override minimum flashcards threshold (default: 300)
  --min-questions=<number>  Override minimum questions threshold (default: 500)
  --min-cat-questions=<number> Override minimum CAT-eligible questions threshold (default: 150)
  --help                    Show this help message

Examples:
  # Run with default settings, console output only
  tsx scripts/audit-allied-profession-completeness.ts

  # Generate both JSON and Markdown reports
  tsx scripts/audit-allied-profession-completeness.ts --json --markdown

  # Run in strict mode (fail on any issues)
  tsx scripts/audit-allied-profession-completeness.ts --strict --json --markdown

  # Override thresholds
  tsx scripts/audit-allied-profession-completeness.ts --min-lessons=100 --min-flashcards=150
`);
}

// ============================================================================
// Console Output Formatter
// ============================================================================

function printConsoleSummary(report: Awaited<ReturnType<typeof runAlliedProfessionCompletenessAudit>>) {
  console.log("\n" + "=".repeat(80));
  console.log("  ALLIED PROFESSION COMPLETENESS AUDIT");
  console.log("=".repeat(80));
  console.log(`  Generated: ${new Date(report.generatedAt).toLocaleString()}`);
  console.log(`  Overall Status: ${report.status.toUpperCase()}`);
  console.log("-".repeat(80));
  console.log(`  Professions Audited: ${report.professionCount}`);
  console.log(`  ✅ Passing: ${report.passingProfessionCount}`);
  console.log(`  ⚠️  Warnings: ${report.warningProfessionCount}`);
  console.log(`  ❌ Failing: ${report.failingProfessionCount}`);
  console.log("-".repeat(80));
  console.log("  Thresholds:");
  console.log(`    Lessons: ${report.thresholds.minLessons}`);
  console.log(`    Flashcards: ${report.thresholds.minFlashcards}`);
  console.log(`    Questions: ${report.thresholds.minQuestions}`);
  console.log(`    CAT Questions: ${report.thresholds.minCatQuestions}`);
  console.log("=".repeat(80) + "\n");

  // Per-profession summary
  console.log("PER-PROFESSION RESULTS:");
  console.log("-".repeat(80));
  console.log(
    "Profession".padEnd(30),
    "Category".padEnd(22),
    "Lessons".padStart(8),
    "Flash".padStart(7),
    "Qs".padStart(6),
    "CAT".padStart(6),
    "Status"
  );
  console.log("-".repeat(80));

  for (const [key, data] of Object.entries(report.perProfession)) {
    const statusIcon = data.status === "pass" ? "✅" : data.status === "warn" ? "⚠️" : "❌";
    console.log(
      key.padEnd(30),
      data.category.padEnd(22),
      String(data.lessonCount).padStart(8),
      String(data.flashcardCount).padStart(7),
      String(data.questionCount).padStart(6),
      String(data.catEligibleQuestionCount).padStart(6),
      statusIcon
    );
  }

  console.log("-".repeat(80) + "\n");

  // Issues summary
  const failIssues = report.issues.filter((i) => i.severity === "fail");
  const warnIssues = report.issues.filter((i) => i.severity === "warn");

  if (failIssues.length > 0) {
    console.log(`❌ FAILING ISSUES (${failIssues.length}):`);
    console.log("-".repeat(80));
    for (const issue of failIssues) {
      let msg = `  [${issue.professionKey}] ${issue.bucket}: ${issue.message}`;
      if (issue.expected !== undefined) msg += ` (expected: ${issue.expected})`;
      if (issue.actual !== undefined) msg += ` (actual: ${issue.actual})`;
      console.log(msg);
    }
    console.log();
  }

  if (warnIssues.length > 0) {
    console.log(`⚠️  WARNING ISSUES (${warnIssues.length}):`);
    console.log("-".repeat(80));
    for (const issue of warnIssues) {
      let msg = `  [${issue.professionKey}] ${issue.bucket}: ${issue.message}`;
      if (issue.expected !== undefined) msg += ` (expected: ${issue.expected})`;
      if (issue.actual !== undefined) msg += ` (actual: ${issue.actual})`;
      console.log(msg);
    }
    console.log();
  }

  if (failIssues.length === 0 && warnIssues.length === 0) {
    console.log("✅ All professions meet completeness requirements!\n");
  }
}

// ============================================================================
// Main Entry Point
// ============================================================================

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  // Build custom thresholds from CLI args
  const customThresholds: Partial<{
    minLessons: number;
    minFlashcards: number;
    minQuestions: number;
    minCatQuestions: number;
  }> = {};

  if (args.minLessons !== undefined) customThresholds.minLessons = args.minLessons;
  if (args.minFlashcards !== undefined) customThresholds.minFlashcards = args.minFlashcards;
  if (args.minQuestions !== undefined) customThresholds.minQuestions = args.minQuestions;
  if (args.minCatQuestions !== undefined) customThresholds.minCatQuestions = args.minCatQuestions;

  // Create repository (use Prisma for CLI)
  const repo: AlliedCompletenessContentRepository = new PrismaAlliedCompletenessRepository();

  // Fail fast: never run audit counts against an unbootstrapped or drifted schema.
  try {
    loadRuntimeEnv({ purpose: "audit:allied-completeness" });
    await assertRequiredColumnsFromDatabaseUrl(process.env.DATABASE_URL, ALLIED_AUDIT_REQUIRED_COLUMNS);
  } catch (error) {
    if (isRuntimeEnvError(error)) {
      console.error(`❌ ENV_NOT_READY: ${error.message}`);
      process.exit(1);
    }
    if (isSchemaReadinessError(error)) {
      console.error("❌ SCHEMA_NOT_READY: allied completeness audit cannot run. Missing columns:");
      console.error(formatMissingColumns(error.missingColumns));
      process.exit(1);
    }
    throw error;
  }

  // Run audit
  console.log("Running allied profession completeness audit...");
  const report = await runAlliedProfessionCompletenessAudit(repo, customThresholds);

  // Print console summary
  printConsoleSummary(report);

  // Write JSON report if requested
  if (args.json) {
    const jsonPath = join(process.cwd(), "reports", "allied-profession-completeness-audit.json");
    await mkdir(dirname(jsonPath), { recursive: true });
    await writeFile(jsonPath, formatReportAsJson(report), "utf-8");
    console.log(`✅ JSON report written to: ${jsonPath}`);
  }

  // Write Markdown report if requested
  if (args.markdown) {
    const mdPath = join(process.cwd(), "reports", "allied-profession-completeness-audit.md");
    await mkdir(dirname(mdPath), { recursive: true });
    await writeFile(mdPath, formatReportAsMarkdown(report), "utf-8");
    console.log(`✅ Markdown report written to: ${mdPath}`);
  }

  // Determine exit code
  if (args.strict && report.failingProfessionCount > 0) {
    console.log(`\n❌ STRICT MODE: ${report.failingProfessionCount} profession(s) failing. Exiting with code 1.`);
    process.exit(1);
  }

  if (args.strictWarnings && (report.failingProfessionCount > 0 || report.warningProfessionCount > 0)) {
    console.log(
      `\n❌ STRICT WARNINGS MODE: ${report.warningProfessionCount} warning(s), ${report.failingProfessionCount} failing. Exiting with code 1.`
    );
    process.exit(1);
  }

  console.log("\n✅ Audit complete.");
  process.exit(0);
}

// Handle uncaught errors
main().catch((error) => {
  if (error instanceof AlliedCompletenessSchemaNotReadyError || error?.code === "SCHEMA_NOT_READY") {
    console.error("❌ SCHEMA_NOT_READY: allied completeness audit cannot produce content counts.");
    console.error(error.message);
    process.exit(1);
  }
  console.error("❌ Audit failed with error:");
  console.error(error);
  process.exit(1);
});