#!/usr/bin/env node
/**
 * 🔍 Public Runtime Boundary Audit
 *
 * Validates that public-static routes maintain strict runtime isolation:
 * - No headers() usage
 * - No cookies() usage
 * - No Prisma imports
 * - No auth imports
 * - No force-dynamic inheritance
 * - No learner runtime imports
 *
 * Exit code 1 if violations exist (CI gate).
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");

// Patterns that indicate runtime boundary violations
const VIOLATION_PATTERNS = {
  headers: /\bheaders\s*\(\s*\)/,
  cookies: /\bcookies\s*\(\s*\)/,
  prismaImport: /from\s+["']@\/server\/db["']/,
  prismaDirectImport: /from\s+["']@prisma\/client["']/,
  authImport: /from\s+["']@\/lib\/auth\//,
  sessionImport: /from\s+["']@\/lib\/session/,
  learnerImport: /from\s+["']@\/components\/learner/,
  forceDynamic: /export\s+const\s+dynamic\s*=\s*["']force-dynamic["']/,
};

const PUBLIC_STATIC_PATH = join(
  PROJECT_ROOT,
  "src/app/(marketing)/(public-static)"
);

/**
 * Recursively find all TypeScript/TSX files in a directory
 */
function findFiles(dir, fileList = []) {
  try {
    const files = readdirSync(dir);

    files.forEach((file) => {
      const filePath = join(dir, file);
      const stat = statSync(filePath);

      if (stat.isDirectory()) {
        findFiles(filePath, fileList);
      } else if (file.match(/\.(ts|tsx)$/)) {
        fileList.push(filePath);
      }
    });
  } catch (err) {
    // Directory might not exist yet
    return fileList;
  }

  return fileList;
}

/**
 * Check a file for runtime boundary violations
 */
function auditFile(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const relativePath = relative(PROJECT_ROOT, filePath);
  const violations = [];

  // Check each pattern
  for (const [name, pattern] of Object.entries(VIOLATION_PATTERNS)) {
    if (pattern.test(content)) {
      const lines = content.split("\n");
      const lineNumbers = [];

      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          lineNumbers.push(index + 1);
        }
      });

      violations.push({
        type: name,
        file: relativePath,
        lines: lineNumbers,
      });
    }
  }

  return violations;
}

/**
 * Main audit function
 */
function runAudit() {
  console.log("🔍 Public Runtime Boundary Audit\n");
  console.log(`Scanning: ${relative(PROJECT_ROOT, PUBLIC_STATIC_PATH)}\n`);

  const files = findFiles(PUBLIC_STATIC_PATH);

  if (files.length === 0) {
    console.log("⚠️  No files found in public-static route group");
    console.log(
      "   This is expected if the route group hasn't been populated yet.\n"
    );
    return 0;
  }

  console.log(`Found ${files.length} files to audit\n`);

  const allViolations = [];

  files.forEach((file) => {
    const violations = auditFile(file);
    if (violations.length > 0) {
      allViolations.push(...violations);
    }
  });

  if (allViolations.length === 0) {
    console.log("✅ No runtime boundary violations detected\n");
    return 0;
  }

  // Report violations
  console.log(`❌ Found ${allViolations.length} violations:\n`);

  const violationsByType = {};
  allViolations.forEach((v) => {
    if (!violationsByType[v.type]) {
      violationsByType[v.type] = [];
    }
    violationsByType[v.type].push(v);
  });

  for (const [type, violations] of Object.entries(violationsByType)) {
    console.log(`\n${type}:`);
    violations.forEach((v) => {
      console.log(`  ${v.file}:${v.lines.join(",")}`);
    });
  }

  console.log("\n");
  console.log("Runtime boundary violations detected.");
  console.log("Public-static routes must not use:");
  console.log("  - headers() or cookies()");
  console.log("  - Prisma/DB imports");
  console.log("  - Auth/session imports");
  console.log("  - Learner component imports");
  console.log("  - force-dynamic declarations");
  console.log("\n");

  return 1;
}

// Run audit
const exitCode = runAudit();
process.exit(exitCode);
