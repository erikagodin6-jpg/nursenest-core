/**
 * Client bundle boundary guard for Physiology Monitor.
 *
 * Ensures physiology-monitor-client.tsx never pulls server-only modules
 * (node:fs, posthog-node, Prisma, etc.) into the browser graph.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test "src/app/(app)/app/(learner)/physiology-monitor/physiology-monitor-client-boundary.test.ts"
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(HERE, "..", "..", "..", "..", "..", "..");
const SRC = path.join(PKG_ROOT, "src");
const CLIENT_ENTRY = path.join(HERE, "physiology-monitor-client.tsx");

const FORBIDDEN_IMPORT_PATTERNS = [
  /^node:fs$/,
  /^node:fs\/promises$/,
  /^fs$/,
  /^fs\/promises$/,
  /^node:path$/,
  /^node:child_process$/,
  /^@prisma\/client$/,
  /^@\/lib\/observability\/posthog-server$/,
  /^@\/lib\/db$/,
  /^@\/lib\/db\//,
  /^posthog-node$/,
];

const FORBIDDEN_SOURCE_PATTERNS = [
  /from\s+["']node:fs["']/,
  /from\s+["']fs["']/,
  /from\s+["']fs\/promises["']/,
  /from\s+["']@prisma\/client["']/,
  /from\s+["']@\/lib\/observability\/posthog-server["']/,
  /from\s+["']posthog-node["']/,
  /require\(["']node:fs["']\)/,
];

function resolveModule(fromFile: string, spec: string): string | null {
  if (spec.startsWith("@/")) {
    const base = path.join(SRC, spec.slice(2));
    return resolveFileCandidate(base);
  }
  if (spec.startsWith(".")) {
    return resolveFileCandidate(path.resolve(path.dirname(fromFile), spec));
  }
  return null;
}

function resolveFileCandidate(base: string): string | null {
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  for (const ext of [".ts", ".tsx", ".js", ".jsx"]) {
    const withExt = base + ext;
    if (fs.existsSync(withExt)) return withExt;
  }
  for (const ext of [".ts", ".tsx"]) {
    const index = path.join(base, "index" + ext);
    if (fs.existsSync(index)) return index;
  }
  return null;
}

function extractImports(source: string): string[] {
  const specs: string[] = [];
  for (const m of source.matchAll(/from\s+["']([^"']+)["']/g)) specs.push(m[1]!);
  for (const m of source.matchAll(/import\s*\(\s*["']([^"']+)["']\s*\)/g)) specs.push(m[1]!);
  return specs;
}

function walkClientGraph(entry: string): { files: string[]; violations: string[] } {
  const visited = new Set<string>();
  const files: string[] = [];
  const violations: string[] = [];

  function visit(file: string, chain: string[]) {
    const norm = path.normalize(file);
    if (visited.has(norm)) return;
    visited.add(norm);
    files.push(norm);

    let source: string;
    try {
      source = fs.readFileSync(norm, "utf8");
    } catch {
      return;
    }

    for (const pattern of FORBIDDEN_SOURCE_PATTERNS) {
      if (pattern.test(source)) {
        violations.push(`${path.relative(PKG_ROOT, norm)} (${chain.join(" → ")}) matches ${pattern}`);
      }
    }

    for (const spec of extractImports(source)) {
      if (FORBIDDEN_IMPORT_PATTERNS.some((p) => p.test(spec))) {
        violations.push(
          `${path.relative(PKG_ROOT, norm)} imports forbidden module "${spec}" (${chain.join(" → ")})`,
        );
        continue;
      }
      const resolved = resolveModule(norm, spec);
      if (resolved) {
        visit(resolved, [...chain, path.relative(PKG_ROOT, norm)]);
      }
    }
  }

  visit(entry, [path.relative(PKG_ROOT, entry)]);
  return { files, violations };
}

describe("physiology-monitor-client bundle boundary", () => {
  it("does not import simulation-conversion-events barrel (server posthog path)", () => {
    const src = fs.readFileSync(CLIENT_ENTRY, "utf8");
    assert.match(
      src,
      /simulation-conversion-events\.client/,
      "client must import simulation-conversion-events.client",
    );
    assert.doesNotMatch(
      src,
      /from\s+["']@\/lib\/physiology-monitor\/simulation-conversion-events["']/,
      "must not import mixed server/client simulation-conversion-events barrel",
    );
  });

  it("import graph from physiology-monitor-client has no server-only modules", () => {
    const { violations } = walkClientGraph(CLIENT_ENTRY);
    assert.equal(
      violations.length,
      0,
      `server-only modules reachable from client:\n${violations.join("\n")}`,
    );
  });

  it("simulation-conversion-events.client.ts stays free of posthog-server", () => {
    const clientModule = path.join(
      SRC,
      "lib/physiology-monitor/simulation-conversion-events.client.ts",
    );
    const src = fs.readFileSync(clientModule, "utf8");
    assert.doesNotMatch(src, /posthog-server/);
    assert.doesNotMatch(src, /posthog-node/);
    assert.doesNotMatch(src, /node:fs/);
  });
});
