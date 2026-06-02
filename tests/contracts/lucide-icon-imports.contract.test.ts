import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import * as lucide from "lucide-react";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SCAN_ROOTS = ["src", "nursenest-core/src", "components", "app", "pages", "client", "shared"];
const SKIP_DIRS = new Set([
  ".git",
  ".next",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
]);
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".mts"]);
const LUCIDE_NAMED_IMPORT_RE = /import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*["']lucide-react["']/g;

function walk(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!SKIP_DIRS.has(entry)) files.push(...walk(fullPath));
      continue;
    }

    if (stat.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry))) {
      files.push(fullPath);
    }
  }

  return files;
}

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
}

function extractLucideNamedImports(source: string): string[] {
  const imports: string[] = [];
  const clean = stripComments(source);
  let match: RegExpExecArray | null;

  while ((match = LUCIDE_NAMED_IMPORT_RE.exec(clean)) !== null) {
    if (/^import\s+type\b/.test(match[0])) continue;
    const specifiers = match[1] ?? "";
    for (const rawSpecifier of specifiers.split(",")) {
      if (/^\s*type\s+/.test(rawSpecifier)) continue;
      const importedName = rawSpecifier
        .trim()
        .split(/\s+as\s+/i)[0]
        ?.trim();

      if (importedName) imports.push(importedName);
    }
  }

  return imports;
}

test("all named lucide-react icon imports exist in the installed package", () => {
  const availableIcons = new Set(Object.keys(lucide));
  const roots = SCAN_ROOTS.map((root) => path.join(REPO_ROOT, root)).filter((root) => {
    try {
      return statSync(root).isDirectory();
    } catch {
      return false;
    }
  });
  const files = roots.flatMap(walk);
  const missing: string[] = [];

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    for (const importedName of extractLucideNamedImports(source)) {
      if (!availableIcons.has(importedName)) {
        missing.push(`${path.relative(REPO_ROOT, file)} imports ${importedName}`);
      }
    }
  }

  assert.deepEqual(missing, []);
});
