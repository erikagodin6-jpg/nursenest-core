#!/usr/bin/env npx tsx
/**
 * Validates `src/content/blog-static-longtail/*.md` (required fields, unique slugs, disclaimer).
 * Run from `nursenest-core/`: `npm run validate:blog-static-longtail`
 */
import { listAllBlogStaticLongtailFileRecords } from "@/lib/blog/blog-static-longtail-load";
import { validateAllBlogStaticLongtailRecords } from "@/lib/blog/blog-static-longtail-validate";

const records = listAllBlogStaticLongtailFileRecords().map(({ file, record }) => ({ file, record }));
const issues = validateAllBlogStaticLongtailRecords(records);
if (issues.length > 0) {
  for (const i of issues) {
    console.error(`${i.file}: ${i.message}`);
  }
  process.exit(1);
}
console.log(`OK: ${records.length} long-tail file(s)`);
