#!/usr/bin/env node
/**
 * 🔍 Unbounded Query Audit
 *
 * Detects potentially dangerous Prisma query patterns:
 * - findMany without take
 * - excessive include depth
 * - unbounded pagination
 * - missing query limits
 *
 * Exit code 1 if violations exist (CI gate).
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");

// Query patterns that indicate potential issues
const VIOLATION_PATTERNS = {
  unboundedFindMany: {
    pattern: /\.findMany\s*\(\s*\{[^}]*\}\s*\)/,
    check: (match, fullContent, startIndex) => {
      // Extract the query object
      const queryStart = fullContent.indexOf("{", startIndex);
      const queryEnd = findMatchingBrace(fullContent, queryStart);
      const queryContent = fullContent.substring(queryStart, queryEnd + 1);
      
      // Check if 'take' is present
      return !/\btake\s*:/.test(queryContent);
    },
    severity: "high",
    message: "findMany without take limit",
  },
  largeTake: {
    pattern: /\btake\s*:\s*(\d+)/g,
    check: (match, fullContent, startIndex) => {
      const takeValue = parseInt(match[1]);
      return takeValue > 1000;
    },
    severity: "medium",
    message: "take value exceeds 1000",
  },
  deepInclude: {
    pattern: /\binclude\s*:\s*\{/g,
    check: (match, fullContent, startIndex) => {
      const includeStart = fullContent.indexOf("{", startIndex);
      const includeEnd = findMatchingBrace(fullContent, includeStart);
      const includeContent = fullContent.substring(includeStart, includeEnd + 1);
      
      // Count nesting depth
      const depth = countIncludeDepth(includeContent);
      return depth > 3;
    },
    severity: "medium",
    message: "include depth exceeds 3 levels",
  },
};

/**
 * Find matching closing brace
 */
function findMatchingBrace(content, startIndex) {
  let depth = 1;
  let i = startIndex + 1;
  
  while (i < content.length && depth > 0) {
    if (content[i] === "{") depth++;
    if (content[i] === "}") depth--;
    i++;
  }
  
  return i - 1;
}

/**
 * Count include nesting depth
 */
function countIncludeDepth(includeContent) {
  let maxDepth = 0;
  let currentDepth = 0;
  
  for (let i = 0; i < includeContent.length; i++) {
    if (includeContent[i] === "{") {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    } else if (includeContent[i] === "}") {
      currentDepth--;
    }
  }
  
  return maxDepth;
}

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
 * Check file for unbounded query patterns
 */
function auditFile(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const relativePath = relative(PROJECT_ROOT, filePath);
  const violations = [];

  // Skip if no Prisma usage
  if (!content.includes("prisma.") && !content.includes("db.")) {
    return violations;
  }

  for (const [name, config] of Object.entries(VIOLATION_PATTERNS)) {
    const pattern = config.pattern;
    let match;

    // Reset lastIndex for global patterns
    if (pattern.global) {
      pattern.lastIndex = 0;
    }

    while ((match = pattern.exec(content)) !== null) {
      const matchIndex = match.index;
      
      // Check if this is actually a violation
      if (config.check(match, content, matchIndex)) {
        // Find line number
        const lineNumber = content.substring(0, matchIndex).split("\n").length;
        
        violations.push({
          file: relativePath,
          line: lineNumber,
          type: name,
          severity: config.severity,
          message: config.message,
          snippet: getCodeSnippet(content, lineNumber),
        });
      }
    }
  }

  return violations;
}

/**
 * Get code snippet around line
 */
function getCodeSnippet(content, lineNumber, context = 2) {
  const lines = content.split("\n");
  const start = Math.max(0, lineNumber - context - 1);
  const end = Math.min(lines.length, lineNumber + context);
  
  return lines.slice(start, end).join("\n");
}

/**
 * Main audit function
 */
function runAudit() {
  console.log("🔍 Unbounded Query Audit\n");

  const srcPath = join(PROJECT_ROOT, "src");
  const files = findFiles(srcPath);

  console.log(`Scanning ${files.length} files...\n`);

  const allViolations = [];

  files.forEach((file) => {
    const violations = auditFile(file);
    if (violations.length > 0) {
      allViolations.push(...violations);
    }
  });

  if (allViolations.length === 0) {
    console.log("✅ No unbounded query violations detected\n");
    return 0;
  }

  // Group by severity
  const bySeverity = {
    high: allViolations.filter((v) => v.severity === "high"),
    medium: allViolations.filter((v) => v.severity === "medium"),
    low: allViolations.filter((v) => v.severity === "low"),
  };

  console.log(`❌ Found ${allViolations.length} potential query issues:\n`);
  console.log(`  High severity: ${bySeverity.high.length}`);
  console.log(`  Medium severity: ${bySeverity.medium.length}`);
  console.log(`  Low severity: ${bySeverity.low.length}\n`);

  // Display high severity violations
  if (bySeverity.high.length > 0) {
    console.log("High Severity Violations:");
    bySeverity.high.slice(0, 10).forEach((v) => {
      console.log(`\n  ${v.file}:${v.line}`);
      console.log(`  ${v.message}`);
    });
    if (bySeverity.high.length > 10) {
      console.log(`\n  ... and ${bySeverity.high.length - 10} more`);
    }
    console.log("");
  }

  // Save detailed report
  const reportPath = join(PROJECT_ROOT, "reports");
  try {
    const reportFile = join(reportPath, "unbounded-queries-audit.json");
    writeFileSync(reportFile, JSON.stringify(allViolations, null, 2));
    console.log(`Detailed report saved to: ${relative(PROJECT_ROOT, reportFile)}\n`);
  } catch (err) {
    console.log("Note: Could not save detailed report (reports/ directory may not exist)\n");
  }

  console.log("Query Standards:");
  console.log("  - Always use 'take' with findMany");
  console.log("  - Keep take values under 1000 (prefer 25-100)");
  console.log("  - Limit include depth to 3 levels");
  console.log("  - Use cursor pagination for large datasets");
  console.log("  - Defer optional data to separate queries\n");

  // Fail if high severity violations exist
  if (bySeverity.high.length > 0) {
    console.log(`❌ ${bySeverity.high.length} high severity violations must be fixed\n`);
    return 1;
  }

  console.log("⚠️  Medium/low severity violations detected but not blocking\n");
  return 0;
}

// Run audit
const exitCode = runAudit();
process.exit(exitCode);
