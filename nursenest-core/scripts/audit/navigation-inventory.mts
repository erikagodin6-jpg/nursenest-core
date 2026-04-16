#!/usr/bin/env npx tsx
/**
 * Phase 1 — static navigation inventory: scan source for internal path-like strings.
 *
 * - Deterministic (regex), no runtime server.
 * - Outputs JSON under data/audit/navigation-inventory-*.json
 *
 * This is a **map**, not proof links work — pair with `npm run audit:internal-links` + `npm run audit:links`.
 *
 * Usage: npm run audit:navigation-inventory
 */
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const APP_ROOT = join(__dirname, "../..");
const SCAN_ROOT = join(APP_ROOT, "src");

const IGNORE_DIR = new Set(["node_modules", ".next", "dist", "__tests__", "e2e"]);
const EXT = new Set([".tsx", ".ts", ".jsx", ".js"]);

type NavEdge = { from: string; to: string; kind: "href" | "link" | "push" | "replace" | "string" };

async function walk(dir: string, out: string[]): Promise<void> {
  let entries: import("node:fs").Dirent[];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (IGNORE_DIR.has(e.name)) continue;
      await walk(full, out);
    } else if (e.isFile()) {
      const ext = e.name.slice(e.name.lastIndexOf("."));
      if (EXT.has(ext)) out.push(full);
    }
  }
}

/** Absolute path-like strings starting with / (excludes URLs with protocol). */
function extractPathLikeStrings(content: string, kind: NavEdge["kind"]): string[] {
  const out = new Set<string>();
  const patterns: RegExp[] = [
    /\bhref\s*=\s*\{?["'](\/[^'"]+)["']\}?/g,
    /\bhref=\{["'](\/[^'"]+)["']\}/g,
    /router\.(?:push|replace)\(\s*["'](\/[^'"]+)["']/g,
    /redirect\(\s*["'](\/[^'"]+)["']/g,
    /\bto=\{?["'](\/[^'"]+)["']\}?/g,
  ];
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) {
      const p = m[1]!;
      if (p.startsWith("//")) continue;
      if (p.length < 2) continue;
      out.add(p.split("?")[0]!.split("#")[0]!);
    }
  }
  return [...out];
}

export async function buildNavigationInventory(): Promise<{ files: number; edges: NavEdge[] }> {
  const files: string[] = [];
  await walk(SCAN_ROOT, files);
  const edges: NavEdge[] = [];

  for (const file of files) {
    let content: string;
    try {
      content = await readFile(file, "utf8");
    } catch {
      continue;
    }
    const rel = relative(APP_ROOT, file).replace(/\\/g, "/");
    for (const to of extractPathLikeStrings(content, "href")) {
      edges.push({ from: rel, to, kind: "href" });
    }
  }

  return { files: files.length, edges };
}

async function main() {
  const { files, edges } = await buildNavigationInventory();
  const outDir = join(APP_ROOT, "data", "audit");
  await mkdir(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = join(outDir, `navigation-inventory-${stamp}.json`);
  const uniqueTargets = [...new Set(edges.map((e) => e.to))].sort();
  await writeFile(
    outPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        appRoot: APP_ROOT,
        filesScanned: files,
        uniqueTargetCount: uniqueTargets.length,
        uniqueTargets,
        edges,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(`Navigation inventory: ${files} files, ${edges.length} edges, ${uniqueTargets.length} unique targets.
  Report: ${outPath}`);
}

const isDirect = process.argv[1]?.replace(/\\/g, "/").endsWith("navigation-inventory.mts");
if (isDirect) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
