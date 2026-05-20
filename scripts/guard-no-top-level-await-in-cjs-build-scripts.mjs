#!/usr/bin/env node
/**
 * Fails if any scanned TypeScript build entrypoint contains top-level `await`
 * outside async function / class method bodies (unsafe when tsx/esbuild emit CJS).
 *
 * Run from repo root or `nursenest-core/` (paths resolve to monorepo `script/` + `nursenest-core/scripts/`).
 *
 * `.mts` entrypoints executed only as ESM via tsx are not scanned here; add them only if they join a CJS bundle.
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");

const requireTs = createRequire(path.join(REPO_ROOT, "nursenest-core", "package.json"));
/** Resolve TypeScript from the app package (DigitalOcean / local `npm ci` layout). */
let ts;
try {
  ts = requireTs("typescript");
} catch {
  console.error("[guard:build-scripts] Could not load `typescript` from nursenest-core — run npm ci in nursenest-core.");
  process.exit(1);
}

/** Monorepo `script/*.ts` invoked via `npx tsx ../script/...` from nursenest-core/package.json prebuild & i18n. */
const SCRIPT_DIR_FILES = [
  "build.ts",
  "compile-i18n.ts",
  "i18n-validate.ts",
  "scan-hardcoded-strings-lib.ts",
  "translation-quality-audit.ts",
  "normalize-marketing-locale-overlays.ts",
  "i18n-payload-audit.ts",
  "i18n-check-drift.ts",
  "i18n-check-sync.ts",
  "i18n-report-placeholder-fallbacks.ts",
];

/** `npx tsx scripts/seo/*.ts` from nursenest-core/package.json — keep CJS-safe for tsx/esbuild parity. */
const NURSE_SEO_VERIFY = [
  "nursenest-core/scripts/seo/verify-sitemap-urls.ts",
  "nursenest-core/scripts/seo/verify-seo-indexability.ts",
  "nursenest-core/scripts/seo/verify-public-marketing-links.ts",
  "nursenest-core/scripts/seo/verify-robots.ts",
  "nursenest-core/scripts/seo/verify-gsc-csv.ts",
];

const FILES = [
  ...SCRIPT_DIR_FILES.map((f) => path.join(REPO_ROOT, "script", f)),
  ...NURSE_SEO_VERIFY.map((f) => path.join(REPO_ROOT, f)),
];

function isFunctionLikeBoundary(node) {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isConstructorDeclaration(node) ||
    ts.isGetAccessorDeclaration(node) ||
    ts.isSetAccessorDeclaration(node)
  );
}

/** True if this node or descendants contain `await`, without entering nested function-like bodies. */
function subtreeHasTopLevelAwait(node) {
  if (ts.isAwaitExpression(node)) return true;
  if (isFunctionLikeBoundary(node)) return false;
  let found = false;
  ts.forEachChild(node, (child) => {
    if (subtreeHasTopLevelAwait(child)) found = true;
  });
  return found;
}

function scanFile(absPath) {
  const rel = path.relative(REPO_ROOT, absPath);
  if (!fs.existsSync(absPath)) {
    return { rel, ok: false, errors: [`missing file`] };
  }
  const text = fs.readFileSync(absPath, "utf8");
  const sf = ts.createSourceFile(absPath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const errors = [];
  for (const stmt of sf.statements) {
    if (ts.isImportDeclaration(stmt)) continue;
    if (ts.isFunctionDeclaration(stmt)) continue;
    if (ts.isClassDeclaration(stmt)) continue;
    if (ts.isInterfaceDeclaration(stmt)) continue;
    if (ts.isTypeAliasDeclaration(stmt)) continue;
    if (ts.isEnumDeclaration(stmt)) continue;
    if (ts.isModuleDeclaration(stmt)) continue;
    if (ts.isExportDeclaration(stmt) && !stmt.moduleSpecifier && !stmt.exportClause) continue;
    if (ts.isEmptyStatement(stmt)) continue;
    if (subtreeHasTopLevelAwait(stmt)) {
      const pos = sf.getLineAndCharacterOfPosition(stmt.getStart(sf));
      errors.push(`line ${pos.line + 1}: top-level await (or await in non-function scope) in ${rel}`);
    }
  }
  return { rel, ok: errors.length === 0, errors };
}

let bad = 0;
for (const abs of FILES) {
  const r = scanFile(abs);
  if (!r.ok) {
    bad += 1;
    console.error(`[guard:build-scripts] FAIL ${r.rel}`);
    for (const e of r.errors) console.error(`  ${e}`);
  } else {
    console.log(`[guard:build-scripts] OK ${r.rel}`);
  }
}

if (bad > 0) {
  console.error(`\n[guard:build-scripts] ${bad} file(s) with forbidden top-level await. Wrap entry in async function main() { ... }; main().catch(...).`);
  process.exit(1);
}
console.log("[guard:build-scripts] all scanned files are CJS-safe (no top-level await).");
