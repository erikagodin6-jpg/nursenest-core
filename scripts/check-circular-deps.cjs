#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const srcDir = path.resolve(__dirname, "..", "client", "src");
const sharedDir = path.resolve(__dirname, "..", "shared");

function resolveModule(importer, specifier) {
  if (specifier.startsWith("@/"))
    return path.resolve(srcDir, specifier.slice(2));
  if (specifier.startsWith("@shared/"))
    return path.resolve(sharedDir, specifier.slice(8));
  if (specifier.startsWith("."))
    return path.resolve(path.dirname(importer), specifier);
  return null;
}

function findFile(base) {
  for (const ext of ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"]) {
    const p = base + ext;
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function getImports(file) {
  const content = fs.readFileSync(file, "utf8");
  const imports = [];

  const normalized = content.replace(/\r\n/g, "\n");

  const typeOnlyRe = /import\s+type\s+\{[^}]*\}\s+from\s+['"]([^'"]+)['"]/gs;
  const typeOnlySpecs = new Set();
  let tm;
  while ((tm = typeOnlyRe.exec(normalized)) !== null) {
    typeOnlySpecs.add(tm.index);
  }

  const importRe = /(?:import|export)\s+(?:type\s+)?(?:\{[^}]*\}|[\w*]+(?:\s*,\s*\{[^}]*\})?)\s+from\s+['"]([^'"]+)['"]/gs;
  let m;
  while ((m = importRe.exec(normalized)) !== null) {
    if (typeOnlySpecs.has(m.index)) continue;

    const fullMatch = m[0];
    if (/^import\s+type\s+/.test(fullMatch)) continue;
    if (/^export\s+type\s+\{/.test(fullMatch)) continue;

    const specifier = m[1];
    const resolved = resolveModule(file, specifier);
    if (resolved) {
      const found = findFile(resolved);
      if (found) imports.push(found);
    }
  }

  if (process.argv.includes("--include-dynamic")) {
    const dynamicImportRe = /(?:^|[^.])import\s*\(\s*['"]([^'"]+)['"]\s*\)/gs;
    while ((m = dynamicImportRe.exec(normalized)) !== null) {
      const specifier = m[1];
      const resolved = resolveModule(file, specifier);
      if (resolved) {
        const found = findFile(resolved);
        if (found) imports.push(found);
      }
    }
  }

  const reExportRe = /export\s+\{[^}]*\}\s+from\s+['"]([^'"]+)['"]/gs;
  while ((m = reExportRe.exec(normalized)) !== null) {
    const fullMatch = m[0];
    if (/export\s+type\s+\{/.test(fullMatch)) continue;
    const specifier = m[1];
    const resolved = resolveModule(file, specifier);
    if (resolved) {
      const found = findFile(resolved);
      if (found && !imports.includes(found)) imports.push(found);
    }
  }

  return imports;
}

function walk(dir) {
  const results = [];
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git") continue;
        walk(full).forEach((f) => results.push(f));
      } else if (/\.[jt]sx?$/.test(entry.name)) {
        results.push(full);
      }
    }
  } catch {}
  return results;
}

const graph = new Map();
const allFiles = [...walk(srcDir), ...walk(sharedDir)];
let parseErrors = 0;

for (const f of allFiles) {
  try {
    graph.set(f, getImports(f));
  } catch (e) {
    parseErrors++;
  }
}

const cycles = [];
const visited = new Set();
const stack = new Set();
const stackArray = [];

function dfs(node) {
  if (stack.has(node)) {
    const idx = stackArray.indexOf(node);
    cycles.push(stackArray.slice(idx).map((f) => path.relative(process.cwd(), f)));
    return;
  }
  if (visited.has(node)) return;
  visited.add(node);
  stack.add(node);
  stackArray.push(node);
  for (const dep of graph.get(node) || []) dfs(dep);
  stack.delete(node);
  stackArray.pop();
}

for (const f of graph.keys()) dfs(f);

console.log(`Scanned ${allFiles.length} files (${parseErrors} parse errors)`);

if (cycles.length === 0) {
  console.log("No circular dependencies found.");
  process.exit(0);
} else {
  console.error(`Found ${cycles.length} circular dependency chain(s):`);
  for (const c of cycles) {
    console.error("  " + c.join(" -> ") + " -> " + c[0]);
  }
  process.exit(1);
}
