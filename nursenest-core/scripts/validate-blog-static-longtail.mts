/**
 * Validates `src/content/blog-static-longtail/*.md` frontmatter + body for hybrid blog supplements.
 * Exit 1 on missing fields, duplicate slugs, or empty body/disclaimer/SEO.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  parseBlogStaticLongtailFile,
  splitLongtailFrontmatter,
} from "../src/lib/blog/blog-static-longtail-load";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const dir = join(__dirname, "..", "src", "content", "blog-static-longtail");

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

function main(): void {
  if (!existsSync(dir)) fail(`Long-tail directory missing: ${dir}`);
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  if (files.length === 0) fail("No .md files in blog-static-longtail");
  const slugs = new Map<string, string>();
  for (const f of files) {
    const raw = readFileSync(join(dir, f), "utf8");
    const { frontmatter } = splitLongtailFrontmatter(raw);
    if (!frontmatter) fail(`${f}: must start with YAML frontmatter (---)`);
    let rec;
    try {
      rec = parseBlogStaticLongtailFile(raw);
    } catch (e) {
      fail(`${f}: ${e instanceof Error ? e.message : String(e)}`);
    }
    if (rec.seoTitle.length < 8) fail(`${f}: seoTitle too short`);
    if (rec.seoDescription.length < 24) fail(`${f}: seoDescription too short`);
    if (!rec.canonicalUrl.includes("/blog/")) fail(`${f}: canonicalUrl should include /blog/`);
    if (rec.medicalDisclaimer.length < 40) fail(`${f}: medicalDisclaimer too short`);
    const prev = slugs.get(rec.slug);
    if (prev) fail(`Duplicate slug "${rec.slug}" in ${prev} and ${f}`);
    slugs.set(rec.slug, f);
  }
  console.log(`OK: validated ${files.length} long-tail file(s) in ${dir}`);
}

main();
