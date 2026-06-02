#!/usr/bin/env node
/**
 * 🔄 Batch ISR Conversion Script
 *
 * Converts force-dynamic routes to ISR by:
 * 1. Removing `export const dynamic = "force-dynamic"`
 * 2. Keeping existing `revalidate` if present
 * 3. Adding `revalidate = 1800` if not present
 * 4. Adding conversion comment
 *
 * Usage: node scripts/batch-convert-to-isr.mjs <file1> <file2> ...
 */

import { readFileSync, writeFileSync } from 'fs';
import { relative } from 'path';

const PROJECT_ROOT = process.cwd();

function convertFileToISR(filePath, defaultRevalidate = 1800) {
  const relativePath = relative(PROJECT_ROOT, filePath);
  console.log(`\nProcessing: ${relativePath}`);
  
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Check if file has force-dynamic
  const hasForceDynamic = /export\s+const\s+dynamic\s*=\s*["']force-dynamic["']/.test(content);
  
  if (!hasForceDynamic) {
    console.log('  ⏭️  No force-dynamic found, skipping');
    return false;
  }
  
  // Check if file already has revalidate
  const hasRevalidate = /export\s+const\s+revalidate\s*=/.test(content);
  
  // Remove force-dynamic line
  content = content.replace(
    /export\s+const\s+dynamic\s*=\s*["']force-dynamic["'];?\n?/g,
    ''
  );
  
  // Add conversion comment and revalidate if needed
  if (hasRevalidate) {
    // Just add comment before existing revalidate
    content = content.replace(
      /(export\s+const\s+revalidate\s*=)/,
      '// Converted to ISR - educational content tolerates stale data\n$1'
    );
    console.log('  ✅ Removed force-dynamic, kept existing revalidate');
  } else {
    // Add both comment and revalidate
    // Find a good insertion point (after imports, before first export or function)
    const insertionPoint = content.search(/\n(export\s+(async\s+)?function|export\s+default|type\s+Props)/);
    
    if (insertionPoint !== -1) {
      const before = content.substring(0, insertionPoint);
      const after = content.substring(insertionPoint);
      
      content = before + 
        '\n// Converted to ISR - educational content tolerates stale data\n' +
        `export const revalidate = ${defaultRevalidate}; // ${defaultRevalidate / 60} minutes\n` +
        after;
      
      console.log(`  ✅ Removed force-dynamic, added revalidate=${defaultRevalidate}`);
    } else {
      console.log('  ⚠️  Could not find insertion point, manual review needed');
      return false;
    }
  }
  
  // Write back
  writeFileSync(filePath, content, 'utf-8');
  modified = true;
  
  return modified;
}

// Main execution
const files = process.argv.slice(2);

if (files.length === 0) {
  console.log('Usage: node scripts/batch-convert-to-isr.mjs <file1> <file2> ...');
  console.log('\nExample:');
  console.log('  node scripts/batch-convert-to-isr.mjs \\');
  console.log('    src/app/(marketing)/(default)/pre-nursing/[slug]/page.tsx \\');
  console.log('    src/app/(marketing)/(default)/pre-nursing/practice/[slug]/page.tsx');
  process.exit(1);
}

console.log(`🔄 Batch ISR Conversion\n`);
console.log(`Files to process: ${files.length}\n`);

let converted = 0;
let skipped = 0;

files.forEach(file => {
  try {
    const wasModified = convertFileToISR(file);
    if (wasModified) {
      converted++;
    } else {
      skipped++;
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    skipped++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`  Converted: ${converted}`);
console.log(`  Skipped: ${skipped}`);
console.log(`  Total: ${files.length}\n`);

if (converted > 0) {
  console.log('✅ Conversion complete!');
  console.log('\nNext steps:');
  console.log('  1. Review changes: git diff');
  console.log('  2. Test routes render correctly');
  console.log('  3. Run audit: node scripts/audit-force-dynamic.mjs');
  console.log('  4. Commit and deploy incrementally\n');
}

process.exit(0);
