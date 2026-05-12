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
  function collectFilesRecursive(dir, predicate, out = []) {
    if (!existsSync(dir)) {
      return out;
    }
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collectFilesRecursive(fullPath, predicate, out);
        continue;
      }
      if (predicate(entry.name, fullPath)) {
        out.push(fullPath);
      }
    }
    return out;
  }

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
    if (!existsSync(chunksDir)) {
      throw new Error(
        `[verify-standalone-static] incomplete static tree under ${destStatic} (expected chunks/).`,
      );
    }
    const chunkJs = collectFilesRecursive(chunksDir, (name) => name.endsWith(".js"));
    const cssFiles = collectFilesRecursive(destStatic, (name) => name.endsWith(".css"));
    if (chunkJs.length === 0) {
      throw new Error(
        `[verify-standalone-static] no JS chunks found under ${chunksDir}.`,
      );
    }
    if (cssFiles.length === 0) {
      throw new Error(
        `[verify-standalone-static] no CSS assets found under ${destStatic}.`,
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

/**
 * Verify that public/i18n assets are present both at the package root and inside every
 * discovered standalone server directory. Missing i18n causes silent English-fallback
 * rendering for non-English locales.
 *
 * Two checks:
 *   1. Package root public/i18n/en/ must exist and contain at least 1 shard file.
 *   2. Each standalone server directory must have an adjacent public/i18n/en/ (written
 *      by ensure-standalone-public.mjs). Warns rather than throws for this check so that
 *      runs of verify-standalone-artifact without the copy step don't block CI.
 */
export function verifyPublicI18nArtifact(root = packageRoot) {
  // 1. Package-root check (hard fail — i18n source must always be present)
  const pkgI18nDir = path.join(root, "public", "i18n", "en");
  if (!existsSync(pkgI18nDir)) {
    throw new Error(
      `[i18n-artifact] FATAL: public/i18n/en/ not found at package root:\n  ${pkgI18nDir}\n` +
        `Ensure the i18n compilation pipeline has run before the build.`,
    );
  }
  const pkgShards = readdirSync(pkgI18nDir).filter((n) => n.endsWith(".json"));
  if (pkgShards.length === 0) {
    throw new Error(
      `[i18n-artifact] FATAL: public/i18n/en/ is empty (no *.json files) at ${pkgI18nDir}.`,
    );
  }

  // 2. Standalone-adjacent check (warn-only — populated by ensure-standalone-public.mjs)
  const servers = discoverStandaloneServerJsPaths(root);
  if (servers.length > 0) {
    for (const serverPath of servers) {
      const adjacentI18n = path.join(path.dirname(serverPath), "public", "i18n", "en");
      if (!existsSync(adjacentI18n)) {
        console.warn(
          `[i18n-artifact] WARN: standalone-adjacent public/i18n/en/ missing: ${adjacentI18n}\n` +
            `  Run \`node scripts/ensure-standalone-public.mjs\` after \`next build\`.\n` +
            `  Docker deployments are unaffected (Dockerfile COPY handles public/).`,
        );
      } else {
        const adjacentShards = readdirSync(adjacentI18n).filter((n) => n.endsWith(".json"));
        console.log(
          `[i18n-artifact] standalone-adjacent public/i18n/en/ OK: ${adjacentShards.length} shard(s) at ${adjacentI18n}`,
        );
      }
    }
  }

  console.log(
    `[i18n-artifact] package-root public/i18n/en/ OK: ${pkgShards.length} shard(s) at ${pkgI18nDir}`,
  );
}

const scriptPath = fileURLToPath(import.meta.url);
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === scriptPath;

if (isDirectRun) {
  try {
    const standaloneServerPath = verifyStandaloneArtifact();
    verifyStandaloneStaticAssetsPresent();
    verifyPathwayLessonGeneratedIndexesArtifact();
    verifyPublicI18nArtifact();
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
