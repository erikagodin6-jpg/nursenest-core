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
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getStandaloneStaticSyncTargets, verifyStandaloneArtifact } from "./verify-standalone-artifact.mjs";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const sourceStatic = path.join(packageRoot, ".next", "static");

function assertNonEmptyCssDir(staticRoot) {
  const cssDir = path.join(staticRoot, "css");
  if (!existsSync(cssDir)) {
    throw new Error(
      `[ensure-standalone-static] expected css output at ${cssDir} — is this a Next build?`,
    );
  }
  const files = readdirSync(cssDir).filter((n) => n.endsWith(".css"));
  if (files.length === 0) {
    throw new Error(`[ensure-standalone-static] no .css files under ${cssDir}`);
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
assertNonEmptyCssDir(sourceStatic);
assertNonEmptyChunksDir(sourceStatic);

verifyStandaloneArtifact(packageRoot);
const targets = getStandaloneStaticSyncTargets(packageRoot);
if (targets.length === 0) {
  throw new Error(
    "[ensure-standalone-static] no standalone server.js candidates exist after verify — this should be unreachable",
  );
}

for (const { serverPath, destStatic } of targets) {
  mkdirSync(path.dirname(destStatic), { recursive: true });
  cpSync(sourceStatic, destStatic, { recursive: true, force: true });
  assertNonEmptyCssDir(destStatic);
  assertNonEmptyChunksDir(destStatic);
  assertMediaSynced(sourceStatic, destStatic);
  console.log(`[ensure-standalone-static] synced ${sourceStatic} -> ${destStatic} (server=${serverPath})`);
}
