#!/usr/bin/env npx tsx
/**
 * Writes deterministic new-graduate long-tail markdown under `src/content/blog-static-longtail/`.
 * Run from `nursenest-core/`: `npx tsx scripts/blog/generate-new-grad-static-longtail.mts`
 *
 * Aborts if any target slug already exists as a `.md` file (rename after `diagnose:blog-slug-collisions`).
 */
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { allNewGradLongtailSpecs, buildMarkdownFile } from "./lib/new-grad-longtail-generate-core";

const ACCESS_DATE = "2026-05-09";
const OUT_DIR = join(process.cwd(), "src", "content", "blog-static-longtail");

function main(): void {
  if (!existsSync(OUT_DIR)) {
    console.error(`Missing output directory: ${OUT_DIR}`);
    process.exit(1);
  }
  const existingFiles = readdirSync(OUT_DIR).filter((f) => f.endsWith(".md"));
  const existingSlugs = new Set(existingFiles.map((f) => f.replace(/\.md$/u, "")));
  const specs = allNewGradLongtailSpecs();
  const collisions = specs.filter((s) => existingSlugs.has(s.slug));
  if (collisions.length > 0) {
    console.error("Refusing to overwrite existing long-tail files. Collisions:");
    for (const c of collisions.slice(0, 30)) console.error(`  - ${c.slug}`);
    if (collisions.length > 30) console.error(`  … ${collisions.length - 30} more`);
    process.exit(1);
  }
  let n = 0;
  for (let i = 0; i < specs.length; i += 1) {
    const spec = specs[i]!;
    const md = buildMarkdownFile(spec, i, ACCESS_DATE);
    writeFileSync(join(OUT_DIR, `${spec.slug}.md`), md, "utf8");
    n += 1;
  }
  console.log(`OK: wrote ${n} new-grad long-tail markdown file(s) to blog-static-longtail/`);
}

main();
