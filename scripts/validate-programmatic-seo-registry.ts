/**
 * Quality gate for programmatic SEO pages: uniqueness, slug shape, minimum depth, title/description length.
 * Run: `npm run validate:programmatic-seo`
 *
 * Does not replace editorial review; blocks obvious thin or broken registry entries before merge.
 */
import {
  getAllProgrammaticSlugs,
  getProgrammaticSeoPages,
  type SeoPageDefinition,
} from "../src/lib/seo/programmatic-registry";

const SLUG_RE = /^[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*$/;
const MAX_TITLE_LEN = 70;
/** Soft cap — many legacy entries sit ~160–190 chars; keep new pages tighter for SERP snippets. */
const MAX_DESC_LEN = 200;
const MIN_FAQ = 2;

function fail(msg: string): never {
  console.error(`[programmatic-seo] ${msg}`);
  process.exit(1);
}

function sectionParagraphCount(p: SeoPageDefinition): number {
  return p.sections.reduce((n, s) => n + (s.body?.length ?? 0), 0);
}

function main() {
  const slugs = getAllProgrammaticSlugs();
  const dup = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dup.length) fail(`Duplicate slugs: ${[...new Set(dup)].join(", ")}`);

  const titles = new Map<string, string>();
  const pages = getProgrammaticSeoPages();
  for (const p of pages) {
    if (!SLUG_RE.test(p.slug)) fail(`Invalid slug format: "${p.slug}"`);
    if (p.title.length > MAX_TITLE_LEN) {
      fail(`Title too long (${p.title.length} > ${MAX_TITLE_LEN}): ${p.slug}`);
    }
    if (p.description.length > MAX_DESC_LEN) {
      fail(`Description too long (${p.description.length} > ${MAX_DESC_LEN}): ${p.slug}`);
    }
    if (p.h1.length < 12) fail(`H1 too short: ${p.slug}`);
    const tKey = p.title.trim().toLowerCase();
    if (titles.has(tKey)) fail(`Duplicate title: "${p.title}" (${p.slug} vs ${titles.get(tKey)})`);
    titles.set(tKey, p.slug);

    const faqN = p.faq?.length ?? 0;
    const paraN = sectionParagraphCount(p);
    if (p.sections.length < 1) fail(`Need at least one section: ${p.slug}`);
    /** At least two body paragraphs across sections, or two FAQ pairs (editorial minimum for indexable guides). */
    if (paraN < 2 && faqN < MIN_FAQ) {
      fail(`Thin content: need >= 2 section paragraphs or ${MIN_FAQ}+ FAQ items: ${p.slug} (paragraphs=${paraN}, faq=${faqN})`);
    }
  }

  console.log(
    `[programmatic-seo] OK — ${pages.length} pages, ${slugs.length} slugs, depth + uniqueness checks passed.`,
  );
}

main();
