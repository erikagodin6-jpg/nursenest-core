#!/usr/bin/env npx tsx

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * ------------------------------
 * PATH SETUP
 * ------------------------------
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVER_DIR = path.resolve(__dirname, "../server");

/**
 * ------------------------------
 * CONFIG
 * ------------------------------
 */

function getThresholdKb(): number {
  const arg = process.argv.find(a => a.startsWith("--threshold-kb="));
  const val = arg?.split("=")[1];

  if (!val) return 100;

  const parsed = parseInt(val, 10);
  if (isNaN(parsed) || parsed <= 0) {
    console.warn(`Invalid threshold "${val}", defaulting to 100KB`);
    return 100;
  }

  return parsed;
}

const THRESHOLD_KB = getThresholdKb();
const THRESHOLD_BYTES = THRESHOLD_KB * 1024;

/**
 * ------------------------------
 * FILTERS
 * ------------------------------
 */

const EXCLUDE_PATTERNS: RegExp[] = [
  /[\/\\]scripts[\/\\]/,
  /[\/\\]seeds[\/\\]/,
  /^seeds[\/\\]/,
  /[\/\\]seed-data[\/\\]/,
  /^seed-/,
  /^__tests__[\/\\]/,
  /^run-seed-/,
  /^data[\/\\]/,
  /-seed\./,
  /-seed-/,
];

const ALLOWED_LARGE_IMPORTS = new Set<string>([
  "storage", "./storage", "../storage",
  "@shared/schema", "../shared/schema",
  "seo-meta", "./seo-meta",
  "../platform-resilience",
  "./routes",
]);

/**
 * ------------------------------
 * REGEX
 * ------------------------------
 */

const IMPORT_RE = /import\s+(?:type\s+)?[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g;
const REQUIRE_RE = /require\(['"]([^'"]+)['"]\)/g;

/**
 * ------------------------------
 * HELPERS
 * ------------------------------
 */

function shouldExclude(rel: string): boolean {
  return EXCLUDE_PATTERNS.some(p => p.test(rel));
}

function getFiles(dir: string, base = ""): string[] {
  const out: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);

    if (entry.isDirectory()) {
      if (!shouldExclude(rel + "/")) {
        out.push(...getFiles(path.join(dir, entry.name), rel));
      }
      continue;
    }

    if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && !shouldExclude(rel)) {
      out.push(rel);
    }
  }

  return out;
}

function extractImports(content: string): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;

  while ((m = IMPORT_RE.exec(content))) out.push(m[1]);
  while ((m = REQUIRE_RE.exec(content))) out.push(m[1]);

  return out;
}

function resolveImport(fromFile: string, spec: string): string | null {
  if (!spec.startsWith(".") && !spec.startsWith("/")) return null;

  const baseDir = path.dirname(path.join(SERVER_DIR, fromFile));
  const base = path.resolve(baseDir, spec);

  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.json`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }

  return null;
}

function getSize(file: string): number | null {
  try {
    return fs.statSync(file).size;
  } catch {
    return null;
  }
}

/**
 * ------------------------------
 * MAIN
 * ------------------------------
 */

function main() {
  if (!fs.existsSync(SERVER_DIR)) {
    console.error("Server directory not found");
    process.exit(1);
  }

  const files = getFiles(SERVER_DIR);
  const violations: any[] = [];

  for (const file of files) {
    const full = path.join(SERVER_DIR, file);

    let content = "";
    try {
      content = fs.readFileSync(full, "utf-8");
    } catch {
      continue;
    }

    const imports = extractImports(content);

    for (const spec of imports) {
      if (ALLOWED_LARGE_IMPORTS.has(spec)) continue;

      const resolved = resolveImport(file, spec);
      if (!resolved) continue;

      const size = getSize(resolved);
      if (!size) continue;

      if (size > THRESHOLD_BYTES) {
        violations.push({
          file,
          spec,
          resolved: path.relative(SERVER_DIR, resolved),
          sizeKB: Math.round(size / 1024),
        });
      }
    }
  }

  /**
   * OUTPUT
   */

  if (violations.length > 0) {
    console.error(`\nOversized imports (> ${THRESHOLD_KB}KB):\n`);

    for (const v of violations) {
      console.error(`• ${v.file}`);
      console.error(`  → ${v.spec} (${v.sizeKB}KB)`);
      console.error(`  → ${v.resolved}\n`);
    }

    process.exit(1);
  }

  console.log(`OK: No oversized imports. (${files.length} files scanned)`);
  process.exit(0);
}

main();