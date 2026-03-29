/**
 * Read-only report: content sizes and hypothetical SSG fan-out if generateStaticParams ever enumerated full sets.
 * Run: npm run build:risk-audit
 */
import catalog from "@/content/pathway-lessons/catalog.json";
import { countStaticBlogPosts } from "@/lib/blog/static-blog-posts";
import { EXAM_PATHWAYS, listPublicExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import {
  CORE_HOSTED_MARKETING_LOCALES,
  DEFAULT_MARKETING_LOCALE,
  MARKETING_LOCALE_CODES,
} from "@/lib/i18n/marketing-locale-policy";
import { listPathwayIdsWithLessons } from "@/lib/lessons/pathway-lesson-loader";
import { PRE_NURSING_MODULE_REGISTRY } from "@/content/pre-nursing/pre-nursing-registry";
import { getAllProgrammaticSlugs } from "@/lib/seo/programmatic-registry";

type Catalog = {
  pathways: Record<string, { lessons: Array<{ topicSlug: string }> }>;
};

const data = catalog as Catalog;

function topicCountForPathway(pid: string): number {
  const lessons = data.pathways[pid]?.lessons ?? [];
  return new Set(lessons.map((l) => l.topicSlug)).size;
}

function lessonCountForPathway(pid: string): number {
  return data.pathways[pid]?.lessons?.length ?? 0;
}

const seoSlugs = getAllProgrammaticSlugs();
const blogPosts = countStaticBlogPosts();
const pathwaysAll = EXAM_PATHWAYS.length;
const pathwaysPublic = listPublicExamPathways().length;
const preNursing = PRE_NURSING_MODULE_REGISTRY.length;
const localeHosted = CORE_HOSTED_MARKETING_LOCALES.length;
const localeTotal = MARKETING_LOCALE_CODES.length;

const pathwayIds = listPathwayIdsWithLessons();
let totalLessons = 0;
let maxLessons = 0;
let maxTopics = 0;
let totalTopicPages = 0;
for (const id of pathwayIds) {
  const lc = lessonCountForPathway(id);
  const tc = topicCountForPathway(id);
  totalLessons += lc;
  totalTopicPages += tc;
  maxLessons = Math.max(maxLessons, lc);
  maxTopics = Math.max(maxTopics, tc);
}

console.log("=== NurseNest build / SSG risk audit (read-only) ===\n");

console.log("generateStaticParams (current policy): all marketing dynamic routes use [] + dynamicParams: true;");
console.log("pathway lesson detail uses force-dynamic. Build does not enumerate these at compile time.\n");

console.log("--- Content collection sizes ---");
console.log(`programmatic SEO slugs (registry):     ${seoSlugs.length}`);
console.log(`static blog posts (JSON):              ${blogPosts}`);
console.log(`exam pathways (all statuses):          ${pathwaysAll}`);
console.log(`exam pathways (public / sitemap):      ${pathwaysPublic}`);
console.log(`pre-nursing module slugs:               ${preNursing}`);
console.log(`pathway lesson catalog pathways:       ${pathwayIds.length}`);
console.log(`pathway lessons (total rows):          ${totalLessons}`);
console.log(`pathway lessons (max per pathway):     ${maxLessons}`);
console.log(`topic pages (sum unique topics/path):  ${totalTopicPages}`);
console.log(`topic slugs (max per pathway):         ${maxTopics}`);

console.log("\n--- Locale surface ---");
console.log(`marketing locale codes (header):       ${localeTotal} (incl. ${DEFAULT_MARKETING_LOCALE})`);
console.log(`Core-hosted non-default locales:       ${localeHosted}`);

console.log("\n--- Hypothetical full-SSG multipliers (do NOT use — for monitoring only) ---");
const localeSlugMatrix = localeHosted * seoSlugs.length;
console.log(
  `if locale×programmatic slug prerendered:  ${localeHosted} × ${seoSlugs.length} = ${localeSlugMatrix} pages`,
);
console.log(
  `if every pathway lesson URL prerendered:  ${totalLessons} pages (one per lesson row in catalog)`,
);
console.log(`if every pathway topic URL prerendered:   ${totalTopicPages} pages (sum of unique topicSlug per pathway)`);
console.log(
  `pathway marketing shells (ISR on demand): ${pathwaysPublic} public pathways × several segment routes — generateStaticParams returns []`,
);

console.log("\n--- High-risk families (never enumerate at build) ---");
console.log("- [locale]/[slug] marketing copies × programmatic SEO / MDX slugs");
console.log("- Pathway lessons, topics, questions under /[country]/[role]/[exam]/…");
console.log("- Blog index growth, tags, allied health, flashcards, question-bank marketing");

console.log("\n--- Commands ---");
console.log("- npm run disk:audit");
console.log("- npm run clean:build  (artifacts only)\n");
