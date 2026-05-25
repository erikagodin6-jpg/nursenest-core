#!/usr/bin/env node
/**
 * Audit public marketing routes for runtime dependencies.
 * 
 * Scans for:
 * - cookies() usage
 * - headers() usage
 * - auth() calls
 * - Prisma reads in render path
 * 
 * Usage:
 *   node scripts/audit-public-route-dependencies.mjs
 *   node scripts/audit-public-route-dependencies.mjs --fail-on-new
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Known baseline violations (to be fixed)
const KNOWN_VIOLATIONS = {
  cookies: 16,
  headers: 16,
  auth: 7,
  prisma: 5
};

// Parse CLI args
const args = process.argv.slice(2);
const failOnNew = args.includes('--fail-on-new');
const verbose = args.includes('--verbose');

/**
 * Recursively find files in marketing routes
 */
function findMarketingFiles(dir) {
  const results = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!entry.startsWith('.') && entry !== 'node_modules') {
        results.push(...findMarketingFiles(fullPath));
      }
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Check file for runtime dependencies
 */
function checkDependencies(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const violations = [];

    // Check for cookies()
    const cookiesPattern = /\bawait\s+cookies\(\)|cookies\(\)\.get|cookies\(\)\.set/g;
    let match;
    while ((match = cookiesPattern.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      violations.push({
        type: 'cookies',
        line: lineNum,
        snippet: lines[lineNum - 1]?.trim().substring(0, 80)
      });
    }

    // Check for headers()
    const headersPattern = /\bawait\s+headers\(\)|headers\(\)\.get/g;
    while ((match = headersPattern.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      violations.push({
        type: 'headers',
        line: lineNum,
        snippet: lines[lineNum - 1]?.trim().substring(0, 80)
      });
    }

    // Check for auth()
    const authPattern = /\bawait\s+auth\(\)|const\s+session\s*=\s*await\s+auth\(\)/g;
    while ((match = authPattern.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      violations.push({
        type: 'auth',
        line: lineNum,
        snippet: lines[lineNum - 1]?.trim().substring(0, 80)
      });
    }

    // Check for Prisma reads
    const prismaPattern = /prisma\.\w+\.(findMany|findFirst|findUnique|count)\(/g;
    while ((match = prismaPattern.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      violations.push({
        type: 'prisma',
        line: lineNum,
        snippet: lines[lineNum - 1]?.trim().substring(0, 80)
      });
    }

    return violations;
  } catch (error) {
    console.error(`Error checking ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Main audit function
 */
function auditPublicRouteDependencies() {
  console.log('🔍 Auditing public route dependencies...\n');

  const marketingDir = join(ROOT, 'src/app/(marketing)');
  const files = findMarketingFiles(marketingDir);
  
  const results = {
    cookies: [],
    headers: [],
    auth: [],
    prisma: []
  };

  for (const file of files) {
    // Skip (public-static) routes - they're already clean
    if (file.includes('(public-static)')) {
      continue;
    }

    const violations = checkDependencies(file);
    const rel = relative(ROOT, file);
    
    for (const violation of violations) {
      results[violation.type].push({
        file: rel,
        line: violation.line,
        snippet: violation.snippet
      });
    }
  }

  // Calculate totals
  const totals = {
    cookies: results.cookies.length,
    headers: results.headers.length,
    auth: results.auth.length,
    prisma: results.prisma.length
  };

  // Print summary
  console.log('📊 Public Route Dependencies Summary:');
  console.log('=====================================\n');
  console.log(`cookies() usage:  ${totals.cookies} (baseline: ${KNOWN_VIOLATIONS.cookies})`);
  console.log(`headers() usage:  ${totals.headers} (baseline: ${KNOWN_VIOLATIONS.headers})`);
  console.log(`auth() calls:     ${totals.auth} (baseline: ${KNOWN_VIOLATIONS.auth})`);
  console.log(`Prisma reads:     ${totals.prisma} (baseline: ${KNOWN_VIOLATIONS.prisma})\n`);

  // Detailed output
  if (verbose) {
    for (const [type, violations] of Object.entries(results)) {
      if (violations.length > 0) {
        console.log(`\n${type.toUpperCase()} (${violations.length}):`);
        for (const v of violations.slice(0, 10)) {
          console.log(`  ${v.file}:${v.line}`);
          console.log(`    ${v.snippet}`);
        }
        if (violations.length > 10) {
          console.log(`  ... and ${violations.length - 10} more`);
        }
      }
    }
  }

  // Check for new violations
  const newViolations = {
    cookies: Math.max(0, totals.cookies - KNOWN_VIOLATIONS.cookies),
    headers: Math.max(0, totals.headers - KNOWN_VIOLATIONS.headers),
    auth: Math.max(0, totals.auth - KNOWN_VIOLATIONS.auth),
    prisma: Math.max(0, totals.prisma - KNOWN_VIOLATIONS.prisma)
  };

  const hasNewViolations = Object.values(newViolations).some(count => count > 0);

  console.log('\n📈 Change from Baseline:');
  for (const [type, count] of Object.entries(newViolations)) {
    if (count > 0) {
      console.log(`  ${type}: +${count} NEW VIOLATIONS ❌`);
    } else if (totals[type] < KNOWN_VIOLATIONS[type]) {
      console.log(`  ${type}: ${totals[type] - KNOWN_VIOLATIONS[type]} (improved) ✅`);
    } else {
      console.log(`  ${type}: no change`);
    }
  }

  // Recommendations
  console.log('\n💡 Recommendations:');
  console.log('   - Move routes to (public-static) layout where possible');
  console.log('   - Replace cookies()/headers() with static defaults');
  console.log('   - Remove auth() from public route render paths');
  console.log('   - Move Prisma reads to ISR/cached data layers');
  console.log('   - Use client islands for auth-aware UI\n');

  // Determine exit code
  let exitCode = 0;
  if (failOnNew && hasNewViolations) {
    console.log('❌ FAIL: New runtime dependencies detected in public routes');
    exitCode = 1;
  } else if (hasNewViolations) {
    console.log('⚠️  WARNING: New runtime dependencies detected (not failing)');
  } else {
    console.log('✅ SUCCESS: No new runtime dependencies');
  }

  return exitCode;
}

// Run audit
const exitCode = auditPublicRouteDependencies();
process.exit(exitCode);
