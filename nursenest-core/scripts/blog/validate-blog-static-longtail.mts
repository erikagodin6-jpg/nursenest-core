/**
 * Validates `src/content/blog-static-longtail/*.md` (required fields, SEO, disclaimer, body length, unique slugs).
 * Exit 1 when validation fails.
 */
import { validateBlogStaticLongtailCorpus } from "../../src/lib/blog/blog-static-longtail-validate";

const { ok, issues } = validateBlogStaticLongtailCorpus();
for (const i of issues) {
  console.error(`${i.file}: ${i.message}`);
}
if (!ok) {
  console.error(`\nvalidate:blog-static-longtail failed (${issues.length} issue(s)).`);
  process.exit(1);
}
console.log("validate:blog-static-longtail OK");
