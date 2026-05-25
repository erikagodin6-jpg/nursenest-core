#!/usr/bin/env node
/**
 * Audit force-dynamic declarations across the codebase.
 * 
 * Usage:
 *   node scripts/audit-force-dynamic-count.mjs
 *   node scripts/audit-force-dynamic-count.mjs --baseline 212
 *   node scripts/audit-force-dynamic-count.mjs --fail-on-increase
 * 
 * Tracks force-dynamic usage and prevents regressions.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Configuration
const BASELINE_COUNT = 212; // Current count as of 2026-05-25
const TARGET_COUNT = 150;   // Target count
const TOLERANCE = 5;        // Allow small increases for legitimate reasons

// Parse CLI args
const args = process.argv.slice(2);
const customBaseline = args.find(arg => arg.startsWith('--baseline='))?.split('=')[1];
const failOnIncrease = args.includes('--fail-on-increase');
const verbose = args.includes('--verbose');

const baseline = customBaseline ? parseInt(customBaseline, 10) : BASELINE_COUNT;

/**
 * Recursively find all TypeScript/TSX files
 */
function findFiles(dir, pattern = /\.(tsx?|jsx?)$/) {
  const results = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (!entry.startsWith('.') && entry !== 'node_modules' && entry !== 'dist') {
        results.push(...findFiles(fullPath, pattern));
      }
    } else if (pattern.test(entry)) {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Check if file contains force-dynamic declaration
 */
function hasForceDynamic(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const match = content.match(/export\s+const\s+dynamic\s*=\s*["']force-dynamic["']/);
    if (match) {
      // Get line number
      const lines = content.substring(0, match.index).split('\n');
      return { found: true, line: lines.length };
    }
    return { found: false };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return { found: false };
  }
}

/**
 * Categorize file by route type
 */
function categorizeFile(filePath) {
  const rel = relative(ROOT, filePath);
  
  if (rel.includes('(admin)')) return 'admin';
  if (rel.includes('(app)') || rel.includes('(learner)')) return 'learner';
  if (rel.includes('(marketing)')) return 'marketing';
  if (rel.includes('/api/')) return 'api';
  if (rel.includes('not-found') || rel.includes('error')) return 'special';
  
  return 'other';
}

/**
 * Main audit function
 */
function auditForceDynamic() {
  console.log('🔍 Auditing force-dynamic declarations...\n');

  const srcDir = join(ROOT, 'src');
  const files = findFiles(srcDir);
  
  const results = {
    admin: [],
    learner: [],
    marketing: [],
    api: [],
    special: [],
    other: []
  };

  for (const file of files) {
    const check = hasForceDynamic(file);
    if (check.found) {
      const category = categorizeFile(file);
      const rel = relative(ROOT, file);
      results[category].push({ path: rel, line: check.line });
    }
  }

  // Calculate totals
  const totals = {
    admin: results.admin.length,
    learner: results.learner.length,
    marketing: results.marketing.length,
    api: results.api.length,
    special: results.special.length,
    other: results.other.length
  };
  const total = Object.values(totals).reduce((sum, count) => sum + count, 0);

  // Print summary
  console.log('📊 Force-Dynamic Count Summary:');
  console.log('================================\n');
  console.log(`Total:     ${total}`);
  console.log(`Baseline:  ${baseline}`);
  console.log(`Target:    ${TARGET_COUNT}`);
  console.log(`Change:    ${total > baseline ? '+' : ''}${total - baseline}\n`);

  console.log('By Category:');
  console.log(`  Admin:     ${totals.admin} (legitimately dynamic)`);
  console.log(`  Learner:   ${totals.learner} (legitimately dynamic)`);
  console.log(`  Marketing: ${totals.marketing} ⚠️  OPTIMIZATION TARGET`);
  console.log(`  API:       ${totals.api} (legitimately dynamic)`);
  console.log(`  Special:   ${totals.special} (mixed)`);
  console.log(`  Other:     ${totals.other}\n`);

  // Verbose output
  if (verbose) {
    console.log('\n📝 Detailed Breakdown:\n');
    for (const [category, files] of Object.entries(results)) {
      if (files.length > 0) {
        console.log(`\n${category.toUpperCase()} (${files.length}):`);
        files.forEach(({ path, line }) => {
          console.log(`  ${path}:${line}`);
        });
      }
    }
  }

  // Progress tracking
  const progress = ((baseline - total) / (baseline - TARGET_COUNT)) * 100;
  console.log(`\n📈 Progress to Target: ${Math.max(0, progress).toFixed(1)}%`);
  console.log(`   Remaining: ${Math.max(0, total - TARGET_COUNT)} declarations to remove\n`);

  // Determine exit code
  let exitCode = 0;
  let exitReason = '';

  if (total > baseline + TOLERANCE) {
    exitCode = 1;
    exitReason = `❌ FAIL: Force-dynamic count increased by ${total - baseline} (tolerance: ${TOLERANCE})`;
  } else if (failOnIncrease && total > baseline) {
    exitCode = 1;
    exitReason = `❌ FAIL: Force-dynamic count increased (strict mode)`;
  } else if (total > baseline) {
    exitReason = `⚠️  WARNING: Force-dynamic count increased by ${total - baseline} (within tolerance)`;
  } else if (total < baseline) {
    exitReason = `✅ SUCCESS: Force-dynamic count decreased by ${baseline - total}`;
  } else {
    exitReason = `✅ OK: Force-dynamic count unchanged`;
  }

  console.log(exitReason);

  // Recommendations
  if (totals.marketing > 50) {
    console.log('\n💡 Recommendations:');
    console.log('   - Convert marketing routes to ISR (many already have revalidate set)');
    console.log('   - Move routes to (public-static) layout where possible');
    console.log('   - Use client islands for auth-aware UI');
  }

  return exitCode;
}

// Run audit
const exitCode = auditForceDynamic();
process.exit(exitCode);
