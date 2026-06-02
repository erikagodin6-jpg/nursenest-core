import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, "..");
const sourceRoot = join(root, "src");

const allowedNextPhaseFiles = new Set([
  "src/lib/runtime/is-build-phase.ts",
]);

const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

function* walk(dirPath) {
  for (const entry of readdirSync(dirPath)) {
    const full = join(dirPath, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      yield* walk(full);
    } else if (stats.isFile()) {
      yield full;
    }
  }
}

function readRelative(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("NEXT_PHASE env access is centralized through isBuildPhase", () => {
  for (const file of walk(sourceRoot)) {
    const rel = file.slice(root.length + 1);
    if (!textExtensions.has(extname(file))) continue;
    if (allowedNextPhaseFiles.has(rel)) continue;

    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(
      source,
      /process\.env\.NEXT_PHASE/,
      `${rel} must use isBuildPhase()`
    );
    assert.doesNotMatch(
      source,
      /process\.env\[["']NEXT_PHASE["']\]/,
      `${rel} must use isBuildPhase()`
    );
  }
});

test("force-dynamic routes do not export generateStaticParams", () => {
  for (const file of walk(sourceRoot)) {
    const rel = file.slice(root.length + 1);
    if (!textExtensions.has(extname(file))) continue;
    const source = readFileSync(file, "utf8");
    if (source.includes('dynamic = "force-dynamic"')) {
      assert.doesNotMatch(
        source,
        /export\s+(?:async\s+)?function\s+generateStaticParams\b/,
        `${rel} declares force-dynamic and must not export generateStaticParams.`
      );
      assert.doesNotMatch(
        source,
        /export\s+const\s+dynamicParams\s*=\s*false/,
        `${rel} declares force-dynamic and must not set dynamicParams = false.`
      );
    }
  }
});

test("global error boundary stays client-only and render-safe", () => {
  const source = readRelative("src/app/global-error.tsx");
  assert.match(source, /^"use client";/m, "global-error.tsx must remain a client component");
  assert.doesNotMatch(source, /next\/headers/);
  assert.doesNotMatch(source, /next\/cookies/);
  assert.doesNotMatch(source, /next\/server/);
});

test("Next.js build output remains standalone", () => {
  const nextConfig = readRelative("next.config.mjs");
  assert.match(nextConfig, /output:\s*"standalone"/);
  assert.doesNotMatch(nextConfig, /output:\s*"export"/);
});
