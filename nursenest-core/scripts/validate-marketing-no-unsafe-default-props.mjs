#!/usr/bin/env node
/**
 * Build gate: reject obvious Storybook / design-system placeholder defaults in public marketing TSX.
 * Does not execute Next — fast grep over source.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** All product components except admin (admin may contain literal “Title” as field labels). */
const COMPONENTS_ROOT = path.join(pkgRoot, "src", "components");

const EXTRA_SCAN_DIRS = [
  path.join(pkgRoot, "src", "app", "(marketing)"),
  path.join(pkgRoot, "src", "content"),
  path.join(pkgRoot, "src", "legacy", "marketing"),
];

/** `propName = "Token"` style defaults (string literal). */
const UNSAFE_PROP_DEFAULTS = [
  /\b(title|label|lead|kicker|heading|subtitle|description|eyebrow|intro|ctaLabel|secondaryLabel)\s*=\s*["'](Title|Lead|Kicker|KICKER|LABEL|Description|Heading|Subtitle|CTA|Button|EYEBROW|INTRO)["']/i,
  /\b(title|label|lead|kicker)\s*:\s*["'](Title|Lead|Kicker|KICKER|LABEL)["']/i,
  /\b(title|kicker|lead|label)\s*=\s*["'](Title|Lead|Kicker|KICKER|LABEL)["']/i,
];

/** Nullish/boolean coalescing into obvious CMS/storybook tokens (public TSX only). */
const UNSAFE_COALESCE_LITERALS = [
  /\?\?\s*["'](?:LABEL|KICKER|TITLE|LEAD|DESCRIPTION|SUBTITLE|CTA|BUTTON)["']/i,
  /\|\|\s*["'](?:LABEL|KICKER|TITLE|LEAD|DESCRIPTION|SUBTITLE|CTA|BUTTON)["']/i,
];

/**
 * `resolveMarketingCopy(..., "Title")`-style weak metadata fallbacks on public marketing surfaces.
 * Skips `marketing-i18n-core.ts` (definition only).
 */
const UNSAFE_RESOLVE_MARKETING_WEAK_FALLBACK = new RegExp(
  String.raw`resolveMarketingCopy\s*\([\s\S]{0,4500}?,[\s\S]{0,2000}?,[\s\S]{0,2000}?,[\s\r\n]*["'](?:Title|Description|Button|Learn more|Click here|Get started)["'][\s\r\n]*\)`,
  "g",
);

function isMarketingPublicSurfacePath(rel) {
  return (
    rel.includes(`${path.sep}marketing${path.sep}`) ||
    rel.includes("(marketing)") ||
    rel.includes(`${path.sep}exam-pathways${path.sep}`) ||
    rel.includes(`${path.sep}pre-nursing${path.sep}`) ||
    rel.includes(`${path.sep}seo${path.sep}`) ||
    rel.includes(`${path.sep}marketing-i18n${path.sep}`)
  );
}

function walkTsxFiles(dir, out = [], opts = {}) {
  const { skipAdmin } = opts;
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      if (skipAdmin && ent.name === "admin") continue;
      walkTsxFiles(p, out, opts);
    } else if (
      ent.isFile() &&
      (ent.name.endsWith(".tsx") || ent.name.endsWith(".ts")) &&
      !ent.name.includes(".test.")
    ) {
      out.push(p);
    }
  }
  return out;
}

function collectScanFiles() {
  const files = new Set();
  if (fs.existsSync(COMPONENTS_ROOT)) {
    for (const f of walkTsxFiles(COMPONENTS_ROOT, [], { skipAdmin: true })) {
      files.add(f);
    }
  }
  for (const dir of EXTRA_SCAN_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const f of walkTsxFiles(dir, [])) {
      files.add(f);
    }
  }
  return [...files];
}

let failures = 0;
for (const file of collectScanFiles()) {
  const rel = path.relative(pkgRoot, file);
  const src = fs.readFileSync(file, "utf8");
  for (const re of UNSAFE_PROP_DEFAULTS) {
    if (re.test(src)) {
      console.error(`[validate-marketing-no-unsafe-default-props] Forbidden placeholder default in ${rel} (pattern ${re})`);
      failures += 1;
    }
  }
  for (const re of UNSAFE_COALESCE_LITERALS) {
    if (re.test(src)) {
      console.error(`[validate-marketing-no-unsafe-default-props] Forbidden coalesced placeholder literal in ${rel} (pattern ${re})`);
      failures += 1;
    }
  }
  UNSAFE_RESOLVE_MARKETING_WEAK_FALLBACK.lastIndex = 0;
  if (
    isMarketingPublicSurfacePath(rel) &&
    !rel.includes(`${path.sep}marketing-i18n-core.ts`) &&
    UNSAFE_RESOLVE_MARKETING_WEAK_FALLBACK.test(src)
  ) {
    console.error(
      `[validate-marketing-no-unsafe-default-props] Forbidden resolveMarketingCopy weak literal fallback in ${rel} — use getRequiredPublicMetadataLine + marketing-safe-fallbacks.ts`,
    );
    failures += 1;
  }
}

if (failures > 0) {
  console.error(`[validate-marketing-no-unsafe-default-props] FAILED (${failures} file(s))`);
  process.exit(1);
}
console.log("[validate-marketing-no-unsafe-default-props] OK");
