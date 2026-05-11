#!/usr/bin/env node
/**
 * Ensures fingerprinted Next assets under `.next/static` exist inside the standalone
 * runtime tree (`…/standalone/…/server.js` sibling `.next/static`).
 *
 * Some monorepo / `outputFileTracingRoot` builds leave `.next/static` only at the package
 * root while the standalone server resolves assets next to each `server.js`. If multiple
 * standalone entry files exist (e.g. `standalone/nursenest-core/server.js` and
 * `standalone/server.js`), every sibling `.next/static` must be populated. Missing copies
 * manifest as production `GET /_next/static/...` returning HTML (the app document) instead
 * of CSS/JS/fonts — browsers show unstyled content.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isNNSkipLessonIndexBuild } from "./run-lesson-indexes-for-build.mjs";
import {
  discoverStandaloneServerJsPaths,
  getStandaloneStaticSyncTargets,
  verifyStandaloneArtifact,
} from "./verify-standalone-artifact.mjs";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const sourceStatic = path.join(packageRoot, ".next", "static");

function listFilesRecursive(dir, predicate, out = []) {
  if (!existsSync(dir)) {
    return out;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFilesRecursive(fullPath, predicate, out);
      continue;
    }
    if (predicate(entry.name, fullPath)) {
      out.push(fullPath);
    }
  }
  return out;
}

function assertNonEmptyCssOutput(staticRoot) {
  const cssFiles = listFilesRecursive(staticRoot, (name) => name.endsWith(".css"));
  if (cssFiles.length === 0) {
    throw new Error(
      `[ensure-standalone-static] no .css files under ${staticRoot} (Next 16 may place them in chunks/)`,
    );
  }
}

function assertNonEmptyChunksDir(staticRoot) {
  const chunksDir = path.join(staticRoot, "chunks");
  if (!existsSync(chunksDir)) {
    throw new Error(
      `[ensure-standalone-static] expected chunks output at ${chunksDir} — is this a Next build?`,
    );
  }
  const files = readdirSync(chunksDir).filter((n) => n.endsWith(".js"));
  if (files.length === 0) {
    throw new Error(`[ensure-standalone-static] no .js files under ${chunksDir}`);
  }
}

function assertMediaSynced(sourceRoot, destRoot) {
  const mediaDir = "media";
  const srcMedia = path.join(sourceRoot, mediaDir);
  if (!existsSync(srcMedia)) {
    return;
  }
  const srcCount = readdirSync(srcMedia).filter((n) => !n.startsWith(".")).length;
  if (srcCount === 0) {
    return;
  }
  const destMedia = path.join(destRoot, mediaDir);
  if (!existsSync(destMedia)) {
    throw new Error(
      `[ensure-standalone-static] source has ${mediaDir} assets but missing after copy: ${destMedia}`,
    );
  }
  const destCount = readdirSync(destMedia).filter((n) => !n.startsWith(".")).length;
  if (destCount < srcCount) {
    throw new Error(
      `[ensure-standalone-static] ${mediaDir} file count mismatch after copy (src=${srcCount} dest=${destCount})`,
    );
  }
}

if (!existsSync(sourceStatic)) {
  throw new Error(
    `[ensure-standalone-static] missing ${sourceStatic} — run next build before build:deploy.`,
  );
}
assertNonEmptyCssOutput(sourceStatic);
assertNonEmptyChunksDir(sourceStatic);

verifyStandaloneArtifact(packageRoot);

/**
 * Standalone traces server chunks under `.next/standalone/...`; `pathway-lesson-generated-index` resolves
 * the package root as three levels above `src/lib/lessons`, so indexes must live at
 * `…/standalone/<app>/src/content/pathway-lessons/generated-indexes/*.json`.
 */
function syncPathwayLessonIndexesIntoStandaloneRoots(root) {
  if (isNNSkipLessonIndexBuild()) {
    console.log("[lesson-indexes] copy-to-standalone skipped reason=NN_SKIP_LESSON_INDEX_BUILD");
    return;
  }
  const srcDir = path.join(root, "src", "content", "pathway-lessons", "generated-indexes");
  if (!existsSync(srcDir)) {
    throw new Error(`[lesson-indexes] FATAL: missing source index dir ${srcDir}`);
  }
  const files = readdirSync(srcDir).filter((n) => n.endsWith(".json"));
  if (files.length === 0) {
    throw new Error(
      `[lesson-indexes] FATAL: no *.json under ${srcDir} — lesson index build did not run (or set NN_SKIP_LESSON_INDEX_BUILD).`,
    );
  }
  const servers = discoverStandaloneServerJsPaths(root);
  if (servers.length === 0) {
    throw new Error("[lesson-indexes] FATAL: no standalone server.js under .next/standalone");
  }
  for (const serverPath of servers) {
    const appRoot = path.dirname(serverPath);
    const destDir = path.join(appRoot, "src", "content", "pathway-lessons", "generated-indexes");
    mkdirSync(destDir, { recursive: true });
    for (const name of files) {
      cpSync(path.join(srcDir, name), path.join(destDir, name), { force: true });
    }
    console.log(
      `[lesson-indexes] copied ${files.length} index file(s) -> ${destDir} (server=${serverPath})`,
    );
  }
}

syncPathwayLessonIndexesIntoStandaloneRoots(packageRoot);

const targets = getStandaloneStaticSyncTargets(packageRoot);
if (targets.length === 0) {
  throw new Error(
    "[ensure-standalone-static] no standalone server.js candidates exist after verify — this should be unreachable",
  );
}

const t0 = Date.now();
const canSymlinkExtras = process.platform !== "win32";
console.log(
  `[ensure-standalone-static] standalone server.js targets count=${targets.length} symlink_extras=${canSymlinkExtras && targets.length > 1}`,
);

function prepareDestDir(destStatic) {
  mkdirSync(path.dirname(destStatic), { recursive: true });
  if (existsSync(destStatic)) {
    rmSync(destStatic, { recursive: true, force: true });
  }
}

function copyTree(destStatic, serverPath, mode) {
  prepareDestDir(destStatic);
  mkdirSync(destStatic, { recursive: true });
  for (const entry of readdirSync(sourceStatic, { withFileTypes: true })) {
    cpSync(path.join(sourceStatic, entry.name), path.join(destStatic, entry.name), {
      recursive: true,
      force: true,
    });
  }
  assertNonEmptyCssOutput(destStatic);
  assertNonEmptyChunksDir(destStatic);
  assertMediaSynced(sourceStatic, destStatic);
  console.log(
    `[ensure-standalone-static] ${mode} ${sourceStatic} -> ${destStatic} (server=${serverPath})`,
  );
}

const primary = targets[0];
copyTree(primary.destStatic, primary.serverPath, "copied");

for (let i = 1; i < targets.length; i++) {
  const { serverPath, destStatic } = targets[i];
  if (canSymlinkExtras) {
    prepareDestDir(destStatic);
    const rel = path.relative(path.dirname(destStatic), primary.destStatic);
    if (!rel) {
      throw new Error(
        `[ensure-standalone-static] symlink target would be empty (same dir as primary?) dest=${destStatic} primary=${primary.destStatic}`,
      );
    }
    symlinkSync(rel, destStatic);
    assertNonEmptyCssOutput(destStatic);
    assertNonEmptyChunksDir(destStatic);
    assertMediaSynced(sourceStatic, destStatic);
    console.log(
      `[ensure-standalone-static] symlinked ${destStatic} -> ${rel} (server=${serverPath})`,
    );
  } else {
    copyTree(destStatic, serverPath, "copied");
  }
}

console.log(`[ensure-standalone-static] done duration_ms=${Date.now() - t0}`);
