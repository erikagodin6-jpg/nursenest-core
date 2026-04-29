import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { isNNSkipLessonIndexBuild } from "./run-lesson-indexes-for-build.mjs";

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

/**
 * Fails if hashed assets were not synced next to each standalone `server.js`
 * (`…/standalone/.next/static`, populated by `ensure-standalone-static.mjs` after `next build`).
 */
export function verifyStandaloneStaticAssetsPresent(root = packageRoot) {
  const targets = getStandaloneStaticSyncTargets(root);
  if (targets.length === 0) {
    throw new Error(
      "[verify-standalone-static] no standalone server.js under .next/standalone — run `npm run build` first.",
    );
  }
  for (const { serverPath, destStatic } of targets) {
    if (!existsSync(destStatic)) {
      throw new Error(
        `[verify-standalone-static] missing static tree: ${destStatic}\n` +
          `Sibling to: ${serverPath}\n` +
          `Run: node scripts/ensure-standalone-static.mjs (included automatically after \`npm run build\` / \`npm run build:compile\`).`,
      );
    }
    const chunksDir = path.join(destStatic, "chunks");
    const cssDir = path.join(destStatic, "css");
    if (!existsSync(chunksDir) || !existsSync(cssDir)) {
      throw new Error(
        `[verify-standalone-static] incomplete static tree under ${destStatic} (expected chunks/ and css/).`,
      );
    }
    const chunkJs = readdirSync(chunksDir).filter((n) => n.endsWith(".js"));
    const cssFiles = readdirSync(cssDir).filter((n) => n.endsWith(".css"));
    if (chunkJs.length === 0 || cssFiles.length === 0) {
      throw new Error(
        `[verify-standalone-static] static tree at ${destStatic} is empty or corrupt (js=${chunkJs.length} css=${cssFiles.length}).`,
      );
    }
  }
}

/**
 * When lesson indexes are built (NN_SKIP_LESSON_INDEX_BUILD unset), generated JSON must exist at the
 * package root and beside each standalone `server.js` (copied by ensure-standalone-static).
 */
export function verifyPathwayLessonGeneratedIndexesArtifact(root = packageRoot) {
  if (isNNSkipLessonIndexBuild()) {
    console.log("[lesson-indexes] standalone artifact check skipped reason=NN_SKIP_LESSON_INDEX_BUILD");
    return;
  }
  const srcDir = path.join(root, "src", "content", "pathway-lessons", "generated-indexes");
  if (!existsSync(srcDir)) {
    throw new Error(
      `[lesson-indexes] FATAL: missing generated index directory at package root:\n  ${srcDir}\n` +
        `Run \`npm run build\` (indexes run before \`next build\` unless NN_SKIP_LESSON_INDEX_BUILD is set).`,
    );
  }
  const srcJson = readdirSync(srcDir).filter((n) => n.endsWith(".json"));
  if (srcJson.length === 0) {
    throw new Error(
      `[lesson-indexes] FATAL: no *.json under ${srcDir} — indexes were not generated (NN_SKIP_LESSON_INDEX_BUILD is not set).`,
    );
  }
  const servers = discoverStandaloneServerJsPaths(root);
  if (servers.length === 0) {
    throw new Error(
      "[lesson-indexes] FATAL: no standalone server.js under .next/standalone — cannot verify lesson indexes.",
    );
  }
  for (const serverPath of servers) {
    const destDir = path.join(path.dirname(serverPath), "src", "content", "pathway-lessons", "generated-indexes");
    if (!existsSync(destDir)) {
      throw new Error(
        `[lesson-indexes] FATAL: standalone tree missing lesson index directory:\n  ${destDir}\n` +
          `Sibling server: ${serverPath}\n` +
          `Run \`node scripts/ensure-standalone-static.mjs\` after \`next build\`.`,
      );
    }
    const destJson = readdirSync(destDir).filter((n) => n.endsWith(".json"));
    if (destJson.length !== srcJson.length) {
      throw new Error(
        `[lesson-indexes] FATAL: lesson index file count mismatch.\n` +
          `  src=${srcJson.length} (${srcDir})\n` +
          `  dest=${destJson.length} (${destDir})\n` +
          `  server=${serverPath}`,
      );
    }
  }
  console.log(
    `[lesson-indexes] standalone artifact verified (${srcJson.length} index file(s), ${servers.length} server root(s))`,
  );
}

const scriptPath = fileURLToPath(import.meta.url);
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === scriptPath;

if (isDirectRun) {
  try {
    const standaloneServerPath = verifyStandaloneArtifact();
    verifyStandaloneStaticAssetsPresent();
    verifyPathwayLessonGeneratedIndexesArtifact();
    const staticTargets = getStandaloneStaticSyncTargets().length;
    console.log(
      `[verify-standalone-artifact] verified ${standaloneServerPath} and ${staticTargets} static asset tree(s)`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[nursenest-core] FATAL: ${message}`);
    process.exit(1);
  }
}
