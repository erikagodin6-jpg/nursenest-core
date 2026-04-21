import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));

export function getStandaloneServerCandidates(root = packageRoot) {
  return [
    path.join(root, ".next", "standalone", "nursenest-core", "server.js"),
    path.join(root, ".next", "standalone", "server.js"),
  ];
}

export function getExpectedStandaloneServerPath(root = packageRoot) {
  return getStandaloneServerCandidates(root)[0];
}

/**
 * All `server.js` files under `.next/standalone` (skipping `node_modules`), sorted for stable
 * fallback order. Next / monorepo layouts can emit more than the two canonical paths; each
 * entry needs a sibling `.next/static` copy (see `getStandaloneStaticSyncTargets`).
 */
export function discoverStandaloneServerJsPaths(root = packageRoot) {
  const standaloneRoot = path.join(root, ".next", "standalone");
  const out = [];

  function walk(dir) {
    if (!existsSync(dir)) return;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      if (ent.name === "node_modules") continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.name === "server.js") {
        out.push(full);
      }
    }
  }

  walk(standaloneRoot);
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

export function resolveStandaloneServerPath(root = packageRoot) {
  const preferred = getStandaloneServerCandidates(root).find((candidate) => existsSync(candidate));
  if (preferred) return preferred;
  const discovered = discoverStandaloneServerJsPaths(root);
  return discovered[0] ?? null;
}

/**
 * Every `server.js` path present under `.next/standalone/**` needs a sibling
 * `.next/static` (Next resolves hashed assets next to the server file). On Unix,
 * `ensure-standalone-static.mjs` copies once and symlinks additional targets to avoid
 * duplicating large trees. Monorepo builds can emit both `standalone/nursenest-core/server.js`
 * and `standalone/server.js`; leaving one unpopulated manifests as `/_next/static/*` → HTML.
 */
export function getStandaloneStaticSyncTargets(root = packageRoot) {
  return discoverStandaloneServerJsPaths(root).map((serverPath) => ({
    serverPath,
    destStatic: path.join(path.dirname(serverPath), ".next", "static"),
  }));
}

export function verifyStandaloneArtifact(root = packageRoot) {
  const standaloneServerPath = resolveStandaloneServerPath(root);
  if (!standaloneServerPath) {
    const candidates = getStandaloneServerCandidates(root);
    throw new Error(
      "standalone server.js not found under .next/standalone (excluding node_modules).\n" +
        "Checked canonical paths:\n" +
        candidates.map((candidate) => `  - ${candidate}`).join("\n") +
        "\nRun `npm run build` (or `npm run build:deploy:full`) from nursenest-core to generate a fresh standalone build.",
    );
  }
  return standaloneServerPath;
}

const scriptPath = fileURLToPath(import.meta.url);
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === scriptPath;

if (isDirectRun) {
  try {
    const standaloneServerPath = verifyStandaloneArtifact();
    console.log(`[verify-standalone-artifact] verified ${standaloneServerPath}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[nursenest-core] FATAL: ${message}`);
    process.exit(1);
  }
}
