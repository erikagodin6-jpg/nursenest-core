#!/usr/bin/env node
/**
 * Assemble data/blog-import/{slug}.json for batch 1 from
 * data/blog-pipeline/batch-01/en/*.md and pathophysiology-200.manifest.json
 *
 * Run: node scripts/blog-pipeline/assemble-batch-01.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BLOG_LOCALES } from "./constants.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const MANIFEST = path.join(ROOT, "data/blog-manifest/pathophysiology-200.manifest.json");
const BATCH_EN = path.join(ROOT, "data/blog-pipeline/batch-01/en");
const OUT_DIR = path.join(ROOT, "data/blog-import");
const PROGRESS = path.join(ROOT, "reports/blog-generation-progress.json");

const BATCH = [
  { file: "01-ards-prone.md", slug: "w2v2-rn-cluster-respiratory-edges-58-ards-prone-who-benefits-most-in-exam-framing-recruitable-lung-themes" },
  { file: "02-qsofa-sirs.md", slug: "w2v2-rn-cluster-infection-sepsis-markers-74-qsofa-vs-sirs-screening-vs-diagnosis-what-boards-expect-you-to-say" },
  { file: "03-abg-post-arrest.md", slug: "w2v2-np-cluster-abg-nuance-12-abg-after-cardiac-arrest-mixed-respiratory-metabolic-patterns-you-ll-see" },
  { file: "04-sglt2-hf.md", slug: "w2v2-pn-cluster-np-autonomy-edges-153-why-sglt2-inhibitors-expanded-beyond-diabetes-in-hf-teaching-mechanism-overview" },
  { file: "05-siadh-csw.md", slug: "w2v2-rn-cluster-endocrine-stress-52-siadh-vs-cerebral-salt-wasting-volume-status-fork-without-nephrology-fellowship" },
];

function wordCountLatin(t) {
  if (!t) return 0;
  return t.trim().split(/\s+/).filter(Boolean).length;
}

function jsonLdArticle({ title, description, slug }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://nursenest.app/blog/${slug}` },
  };
}

function jsonLdFaq(faqItems) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (faqItems || []).map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

function jsonLdBreadcrumb(bc) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: bc.level1 },
      { "@type": "ListItem", position: 2, name: bc.level2 },
      { "@type": "ListItem", position: 3, name: bc.level3 },
    ],
  };
}

function extractFaq(body) {
  const faq = [];
  const sec = body.split("## FAQ")[1];
  if (!sec) return faq;
  const block = sec.split("## References")[0] || sec;
  const qRe = /\*\*Q:\*\*\s*([^\n]+)\n+\*\*A:\*\*\s*([^\n]+(?:\n(?!\*\*Q)[^\n]+)*)/g;
  let m;
  while ((m = qRe.exec(block)) != null) {
    faq.push({ question: m[1].trim(), answer: m[2].trim().replace(/\n+/g, " ") });
  }
  return faq;
}

function extractFeaturedSnippet(body) {
  const intro = body.split("## Introduction")[1]?.split("## Key NCLEX")[0] || "";
  const words = intro.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 52).join(" ") + (words.length > 52 ? "…" : "");
}

function buildInternalLinks(manifestPost) {
  const lessons = (manifestPost.relatedLessonPaths || []).slice(0, 2);
  const tools = (manifestPost.relatedToolPaths || []).slice(0, 2);
  const out = [];
  if (lessons[0]) {
    out.push({
      href: lessons[0],
      anchor: `Open the related NurseNest lesson module for deeper practice: ${lessons[0]}`,
    });
  } else {
    out.push({ href: "/lessons", anchor: "Browse the NurseNest lesson library for pathway-aligned drills." });
  }
  if (tools[0]) {
    out.push({
      href: tools[0],
      anchor: `Use NurseNest clinical tools (e.g., calculators) tied to this topic: ${tools[0]}`,
    });
  } else {
    out.push({ href: "/tools/lab-values", anchor: "Use NurseNest clinical study tools to reinforce labs and safety checks." });
  }
  return out;
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const bySlug = Object.fromEntries(manifest.posts.map((p) => [p.slug, p]));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(PROGRESS), { recursive: true });

  const completed = [];
  const failures = [];

  for (const row of BATCH) {
    const mp = bySlug[row.slug];
    if (!mp) {
      failures.push({ slug: row.slug, error: "slug not found in manifest" });
      continue;
    }
    const mdPath = path.join(BATCH_EN, row.file);
    if (!fs.existsSync(mdPath)) {
      failures.push({ slug: row.slug, error: `missing ${mdPath}` });
      continue;
    }
    const bodyMarkdown = fs.readFileSync(mdPath, "utf8");
    const wc = wordCountLatin(bodyMarkdown);
    const faqItems = extractFaq(bodyMarkdown);
    let featuredSnippet = extractFeaturedSnippet(bodyMarkdown);
    const fsWords = featuredSnippet.split(/\s+/).filter(Boolean);
    featuredSnippet = fsWords.slice(0, 55).join(" ");
    if (fsWords.length > 55) featuredSnippet += "…";

    const seoTitle = `${mp.title} | NurseNest`;
    const metaDescription = `${mp.primaryKeyword.split("[")[0].trim()}. Pathophysiology, prioritization, labs, and NCLEX-style traps—aligned to ${mp.pathway} exam preparation.`;

    const refsMatch = bodyMarkdown.match(/## References \(APA 7\)[\s\S]*/);
    const referencesApa7 = refsMatch
      ? refsMatch[0].replace(/^## References \(APA 7\)[^\n]*\n+/m, "").trim()
      : "";

    const enBlock = {
      locale: "en",
      seoTitle,
      metaDescription,
      featuredSnippet,
      faq: faqItems,
      bodyMarkdown,
      referencesApa7,
      internalLinks: buildInternalLinks(mp),
      jsonLd: {
        article: jsonLdArticle({ title: mp.title, description: metaDescription, slug: mp.slug }),
        faqPage: jsonLdFaq(faqItems),
        breadcrumbList: jsonLdBreadcrumb(mp.breadcrumb),
      },
    };

    const languages = {};
    for (const loc of BLOG_LOCALES) {
      languages[loc] = loc === "en" ? enBlock : null;
    }

    const pendingLocales = BLOG_LOCALES.filter((l) => l !== "en");

    const out = {
      slug: mp.slug,
      pathway: mp.pathway,
      keywords: {
        primary: mp.primaryKeyword,
        secondary: mp.secondaryKeywords,
      },
      breadcrumb: mp.breadcrumb,
      breadcrumbPath: mp.breadcrumbPath,
      relatedLessonPaths: mp.relatedLessonPaths,
      relatedToolPaths: mp.relatedToolPaths,
      languages,
      wordCounts: { en: wc },
      validation: {
        allAbove1200: wc >= 1200 && pendingLocales.length === 0,
        hasAPA: referencesApa7.split(/\n\n+/).filter((b) => b.trim().length > 20).length >= 5,
        hasInternalLinks: true,
        hasBreadcrumbs: true,
        draftLocalesComplete: ["en"],
        pendingLocales,
      },
      status: "draft",
    };

    const outPath = path.join(OUT_DIR, `${mp.slug}.json`);
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
    completed.push({ slug: mp.slug, path: outPath, enWords: wc });
  }

  const progress = {
    updatedAt: new Date().toISOString(),
    pipeline: "pathophysiology-200",
    batchId: 1,
    batchSize: BATCH.length,
    postsCompleted: completed.length,
    completed,
    failures,
    notes: "English master only; run localization jobs per locale batch. Validate with: node scripts/blog-pipeline/validate-post.mjs <file> --draft",
  };
  fs.writeFileSync(PROGRESS, JSON.stringify(progress, null, 2) + "\n", "utf8");
  console.log(JSON.stringify(progress, null, 2));
}

main();
