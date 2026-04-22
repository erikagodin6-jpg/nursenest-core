#!/usr/bin/env node
/**
 * Build gate: reject obvious Storybook / design-system placeholder defaults in public marketing TSX.
 * Does not execute Next — fast grep over source.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const SCAN_DIRS = [
  path.join(pkgRoot, "src", "components", "marketing"),
  path.join(pkgRoot, "src", "components", "layout"),
  path.join(pkgRoot, "src", "components", "pathway-lessons"),
  path.join(pkgRoot, "src", "components", "seo"),
  path.join(pkgRoot, "src", "app", "(marketing)"),
];

/** `propName = "Token"` style defaults (string literal). */
const UNSAFE_PROP_DEFAULTS = [
  /\b(title|label|lead|kicker|heading|subtitle|description|ctaLabel|secondaryLabel)\s*=\s*["'](Title|Lead|Kicker|LABEL|Description|Heading|Subtitle|CTA|Button)["']/i,
  /\b(title|label|lead|kicker)\s*:\s*["'](Title|Lead|Kicker|LABEL)["']/i,
  /\b(title|kicker|lead|label)\s*=\s*["'](Title|Lead|Kicker|LABEL)["']/i,
];

function walkTsxFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      walkTsxFiles(p, out);
    } else if (ent.isFile() && (ent.name.endsWith(".tsx") || ent.name.endsWith(".ts"))) {
      out.push(p);
    }
  }
  return out;
}

let failures = 0;
for (const dir of SCAN_DIRS) {
  for (const file of walkTsxFiles(dir)) {
    const rel = path.relative(pkgRoot, file);
    const src = fs.readFileSync(file, "utf8");
    for (const re of UNSAFE_PROP_DEFAULTS) {
      if (re.test(src)) {
        console.error(`[validate-marketing-no-unsafe-default-props] Forbidden placeholder default in ${rel} (pattern ${re})`);
        failures += 1;
      }
    }
  }
}

if (failures > 0) {
  console.error(`[validate-marketing-no-unsafe-default-props] FAILED (${failures} file(s))`);
  process.exit(1);
}
console.log("[validate-marketing-no-unsafe-default-props] OK");
