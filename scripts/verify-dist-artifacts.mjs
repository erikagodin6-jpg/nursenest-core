#!/usr/bin/env node
/**
 * Post-build structural verification: required files exist and every local .cjs
 * dependency reachable from dist/index.cjs exists on disk (no missing lazy chunks).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const verifyT0 = Date.now();

function die(msg) {
  console.error(`[verify-dist] FAIL: ${msg}`);
  process.exit(1);
}

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

/**
 * Collect relative ./foo.cjs targets from a CJS bundle (sync require + dynamic import).
 * esbuild keeps many lazy server modules as `import("./module.cjs")` — those must exist too.
 */
function collectRelativeCjsRefs(source) {
  const out = [];
  const patterns = [
    /\brequire\s*\(\s*["'](\.\/[^"']+\.cjs)["']\s*\)/g,
    /\bimport\s*\(\s*["'](\.\/[^"']+\.cjs)["']\s*\)/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(source))) {
      out.push(m[1]);
    }
  }
  return out;
}

function verifyCjsGraph(entryAbs) {
  const queue = [entryAbs];
  const seen = new Set();
  const missing = [];

  while (queue.length) {
    const filePath = queue.pop();
    const norm = path.normalize(filePath);
    if (seen.has(norm)) continue;
    seen.add(norm);

    if (!fs.existsSync(norm)) {
      missing.push(norm);
      continue;
    }

    const src = readText(norm);
    const dir = path.dirname(norm);
    const distRoot = path.resolve(distDir) + path.sep;
    for (const rel of collectRelativeCjsRefs(src)) {
      const next = path.normalize(path.join(dir, rel));
      if (!next.startsWith(distRoot) && next !== path.resolve(distDir)) {
        continue;
      }
      if (!seen.has(next)) queue.push(next);
    }
  }

  if (missing.length) {
    die(
      `Missing server chunk(s) required by the bundle:\n  ${missing.join("\n  ")}\n` +
        "Fix the build so every externalized lazy module is emitted into dist/.",
    );
  }

  console.log(`[verify-dist] Traversed ${seen.size} file(s) under dist/ (CJS graph from index.cjs).`);
}

function assertClientArtifacts() {
  const html = path.join(distDir, "public", "index.html");
  if (!fs.existsSync(html)) {
    die("dist/public/index.html is missing (Vite client build did not run or failed).");
  }
  const assets = path.join(distDir, "public", "assets");
  if (!fs.existsSync(assets)) {
    die("dist/public/assets is missing.");
  }
  const js = fs.readdirSync(assets).filter((f) => f.endsWith(".js"));
  if (js.length === 0) {
    die("dist/public/assets contains no .js bundles.");
  }
  const en = path.join(distDir, "public", "i18n", "en.json");
  if (!fs.existsSync(en)) {
    die(
      "dist/public/i18n/en.json is missing. Ensure client/public/i18n/en.json exists " +
        "or run a full i18n compile before deploy.",
    );
  }
}

const metaPath = path.join(distDir, "build-meta.json");
if (!fs.existsSync(metaPath)) {
  die("dist/build-meta.json is missing — the build must emit build metadata.");
}

let meta;
try {
  meta = JSON.parse(readText(metaPath));
} catch (e) {
  die(`dist/build-meta.json is not valid JSON: ${e?.message || e}`);
}

if (meta.schemaVersion !== 1) {
  die("dist/build-meta.json: schemaVersion must be 1.");
}

if (!meta.buildTarget || typeof meta.buildTarget !== "string") {
  die("dist/build-meta.json: buildTarget (string) is required.");
}

const indexPath = path.join(distDir, "index.cjs");
const hasIndex = fs.existsSync(indexPath);

if (meta.buildTarget === "all" || meta.buildTarget === "server") {
  if (!hasIndex) {
    die(`dist/index.cjs is missing for buildTarget=${meta.buildTarget}.`);
  }
  const tGraph = Date.now();
  verifyCjsGraph(path.resolve(indexPath));
  console.log(`[deploy-timing] verify_cjs_graph_ms=${Date.now() - tGraph}`);

  const chunkManifestPath = path.join(distDir, "server-chunk-manifest.json");
  if (!fs.existsSync(chunkManifestPath)) {
    die("dist/server-chunk-manifest.json is missing (lazy route build did not record outputs).");
  }
  let manifest;
  try {
    manifest = JSON.parse(readText(chunkManifestPath));
  } catch (e) {
    die(`dist/server-chunk-manifest.json invalid JSON: ${e?.message || e}`);
  }
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.lazyChunks)) {
    die("dist/server-chunk-manifest.json must have schemaVersion 1 and lazyChunks array.");
  }
  const tManifest = Date.now();
  for (const name of manifest.lazyChunks) {
    if (typeof name !== "string" || !name.endsWith(".cjs")) {
      die(`dist/server-chunk-manifest.json: invalid chunk name: ${String(name)}`);
    }
    const abs = path.join(distDir, name);
    if (!fs.existsSync(abs)) {
      die(`Lazy server chunk was not emitted: ${name} (listed in server-chunk-manifest.json)`);
    }
  }
  console.log(`[deploy-timing] verify_lazy_manifest_ms=${Date.now() - tManifest}`);
  console.log(`[verify-dist] Lazy chunk manifest: ${manifest.lazyChunks.length} file(s) on disk.`);
}

const needsClient = meta.buildTarget === "all" || meta.buildTarget === "client";
if (needsClient) {
  const tClient = Date.now();
  assertClientArtifacts();
  console.log(`[deploy-timing] verify_client_artifacts_ms=${Date.now() - tClient}`);
}

if (!hasIndex && meta.buildTarget !== "client" && meta.buildTarget !== "heavy") {
  die(
    `Unexpected layout: no dist/index.cjs for buildTarget=${meta.buildTarget}. ` +
      "Use BUILD_TARGET=all or server for a deployable API bundle.",
  );
}

if (meta.buildTarget === "heavy" && !hasIndex) {
  const entries = fs.existsSync(distDir) ? fs.readdirSync(distDir) : [];
  if (entries.length === 0) {
    die("dist/ is empty after BUILD_TARGET=heavy partial build.");
  }
  console.log("[verify-dist] Partial heavy build: skipped CJS graph (no index.cjs).");
}

console.log("[verify-dist] OK");
console.log(
  `[deploy-timing] verify_dist_total_s=${((Date.now() - verifyT0) / 1000).toFixed(2)}`,
);
