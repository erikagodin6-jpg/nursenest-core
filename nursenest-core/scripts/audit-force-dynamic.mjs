#!/usr/bin/env node
/**
 * 🔍 Force-Dynamic Audit & Budget Enforcement
 *
 * Counts force-dynamic declarations across the codebase and enforces
 * architectural budgets to prevent regression.
 *
 * Target: Reduce from 212 to <150
 *
 * Exit code 1 if budget exceeded (CI gate).
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");

const FORCE_DYNAMIC_PATTERN = /export\s+const\s+dynamic\s*=\s*["']force-dynamic["']/;
const FORCE_DYNAMIC_BUDGET = 150;

// Route classifications for strategic planning
const ROUTE_CLASSIFICATIONS = {
  required: [
    "(app)/", // Authenticated learner surfaces
    "(admin)/", // Admin surfaces
    "api/", // API routes
    "(runtime)/", // Health checks, internal routes
  ],
  convertToISR: [
    "blog/",
    "pricing/",
    "lessons/",
    "flashcards/",
    "pathways/",
    "allied/",
    "pre-nursing/",
  ],
  convertToStatic: [
    "legal/",
    "about/",
    "faq/",
    "features/",
    "how-it-works/",
  ],
  convertToClientIsland: [
    "login/",
    "signup/",
    "verify-email/",
    "reset-password/",
  ],
};

/**
 * Recursively find all TypeScript/TSX files
 */
function findFiles(dir, fileList = []) {
  try {
    const files = readdirSync(dir);

    files.forEach((file) => {
      const filePath = join(dir, file);
      const stat = statSync(filePath);

      if (stat.isDirectory()) {
        // Skip node_modules, .next, etc.
        if (!file.startsWith(".") && file !== "node_modules") {
          findFiles(filePath, fileList);
        }
      } else if (file.match(/\.(ts|tsx)$/)) {
        fileList.push(filePath);
      }
    });
  } catch (err) {
    // Skip inaccessible directories
  }

  return fileList;
}

/**
 * Check if file contains force-dynamic
 */
function hasForceDynamic(filePath) {
  try {
    const content = readFileSync(filePath, "utf-8");
    return FORCE_DYNAMIC_PATTERN.test(content);
  } catch {
    return false;
  }
}

/**
 * Classify route based on path
 */
function classifyRoute(relativePath) {
  for (const [classification, patterns] of Object.entries(
    ROUTE_CLASSIFICATIONS
  )) {
    for (const pattern of patterns) {
      if (relativePath.includes(pattern)) {
        return classification;
      }
    }
  }
  return "unclassified";
}

/**
 * Determine priority for conversion
 */
function getPriority(relativePath, classification) {
  // High priority: public marketing routes
  if (
    relativePath.includes("(marketing)") &&
    !relativePath.includes("(app)") &&
    classification !== "required"
  ) {
    return "high";
  }

  // Medium priority: authenticated but could be optimized
  if (classification === "convertToISR" || classification === "convertToStatic") {
    return "medium";
  }

  // Low priority: truly dynamic routes
  if (classification === "required") {
    return "low";
  }

  return "medium";
}

/**
 * Main audit function
 */
function runAudit() {
  console.log("🔍 Force-Dynamic Audit\n");

  const srcPath = join(PROJECT_ROOT, "src");
  const files = findFiles(srcPath);

  const forceDynamicFiles = files.filter(hasForceDynamic);

  console.log(`Total files scanned: ${files.length}`);
  console.log(`Force-dynamic declarations: ${forceDynamicFiles.length}`);
  console.log(`Budget: ${FORCE_DYNAMIC_BUDGET}`);
  console.log(`Status: ${forceDynamicFiles.length <= FORCE_DYNAMIC_BUDGET ? "✅ PASS" : "❌ FAIL"}\n`);

  // Generate classification report
  const report = forceDynamicFiles.map((file) => {
    const relativePath = relative(PROJECT_ROOT, file);
    const classification = classifyRoute(relativePath);
    const priority = getPriority(relativePath, classification);

    return {
      route: relativePath,
      classification,
      priority,
      reason: getConversionReason(classification),
    };
  });

  // Group by classification
  const byClassification = {};
  report.forEach((item) => {
    if (!byClassification[item.classification]) {
      byClassification[item.classification] = [];
    }
    byClassification[item.classification].push(item);
  });

  // Display summary
  console.log("Classification Summary:");
  for (const [classification, items] of Object.entries(byClassification)) {
    console.log(`  ${classification}: ${items.length}`);
  }
  console.log("");

  // Display high-priority conversion targets
  const highPriority = report.filter((r) => r.priority === "high");
  if (highPriority.length > 0) {
    console.log(`High Priority Conversion Targets (${highPriority.length}):`);
    highPriority.slice(0, 10).forEach((item) => {
      console.log(`  ${item.route}`);
      console.log(`    → ${item.classification}: ${item.reason}`);
    });
    if (highPriority.length > 10) {
      console.log(`  ... and ${highPriority.length - 10} more`);
    }
    console.log("");
  }

  // Save detailed report
  const reportPath = join(PROJECT_ROOT, "reports");
  try {
    const reportFile = join(reportPath, "force-dynamic-audit.json");
    writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`Detailed report saved to: ${relative(PROJECT_ROOT, reportFile)}\n`);
  } catch (err) {
    console.log("Note: Could not save detailed report (reports/ directory may not exist)\n");
  }

  // Exit with appropriate code
  if (forceDynamicFiles.length > FORCE_DYNAMIC_BUDGET) {
    console.log(`❌ Force-dynamic count (${forceDynamicFiles.length}) exceeds budget (${FORCE_DYNAMIC_BUDGET})`);
    console.log(`   Reduce by ${forceDynamicFiles.length - FORCE_DYNAMIC_BUDGET} declarations to pass.\n`);
    return 1;
  }

  console.log("✅ Force-dynamic budget check passed\n");
  return 0;
}

/**
 * Get conversion reason based on classification
 */
function getConversionReason(classification) {
  const reasons = {
    convertToISR: "Use ISR with revalidate for cached public content",
    convertToStatic: "Use static generation for unchanging content",
    convertToClientIsland: "Move auth logic to client-side islands",
    required: "Legitimately requires request-time rendering",
    unclassified: "Needs manual review for optimization strategy",
  };
  return reasons[classification] || reasons.unclassified;
}

// Run audit
const exitCode = runAudit();
process.exit(exitCode);
