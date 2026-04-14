/**
 * Assembles import-ready BlogPost-shaped JSON for nclex-seo batch 01 (posts 1–10).
 * Reads manifest + HTML bodies from data/blog-manifest/.
 *
 * Usage (from nursenest-core/):
 *   node scripts/blog/assemble-batch-01-import.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const MANIFEST = path.join(ROOT, "data/blog-manifest/nclex-seo-100.manifest.json");
const OUT = path.join(ROOT, "data/blog-manifest/batch-01/batch-01-import-ready.json");
const BODY_DIR = path.join(ROOT, "data/blog-manifest/batch-01/en");

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const batch = manifest.posts.filter((p) => p.id >= 1 && p.id <= 10);

function seoDescriptionFrom(shortDescription, title) {
  const base = shortDescription?.trim() || title;
  if (base.length <= 160) return base;
  return base.slice(0, 157).trim() + "...";
}

function seoTitleFrom(title) {
  if (title.length <= 62) return title;
  return title.slice(0, 59).trim() + "...";
}

const posts = batch.map((m) => {
  const bodyPath = path.join(BODY_DIR, `post-${String(m.id).padStart(3, "0")}-body.html`);
  if (!fs.existsSync(bodyPath)) {
    throw new Error(`Missing body file: ${bodyPath}`);
  }
  const body = fs.readFileSync(bodyPath, "utf8");
  return {
    slug: m.slug,
    title: m.title,
    excerpt: m.shortDescription,
    body,
    locale: "en",
    sourceLocale: "en",
    translationGroupId: m.translationGroupId,
    canonicalPostId: null,
    isAutoTranslated: false,
    translationSource: null,
    targetKeyword: m.primaryKeyword,
    seoTitle: seoTitleFrom(m.title),
    seoDescription: seoDescriptionFrom(m.shortDescription, m.title),
    relatedLessonPaths: m.suggestedRelatedLessonPaths,
    relatedTools: m.suggestedRelatedTools,
    category: m.category,
    careerSlug: "rn",
    exam: "RN",
    postTemplate: "DISEASE_PROCESS_EXPLAINER",
    intent: "CONCEPT_EXPLAINER",
    workflowStatus: "NEEDS_SOURCE_REVIEW",
    postStatus: "DRAFT",
    requiresReferences: true,
    apaReferences: [],
    bodySourceFile: path.relative(ROOT, bodyPath),
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  batch: "nclex-seo-batch-01",
  manifestPath: path.relative(ROOT, MANIFEST),
  note: "English source drafts. Do not publish until editorial review. apaReferences empty until verified sources replace References-to-verify sections in HTML.",
  posts,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(`Wrote ${posts.length} posts to ${path.relative(ROOT, OUT)}`);
