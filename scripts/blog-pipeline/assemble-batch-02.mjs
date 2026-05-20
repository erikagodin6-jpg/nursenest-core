#!/usr/bin/env node
/**
 * Assemble batch 2: all locales from data/blog-pipeline/batch-02/{locale}/{01-05}.md
 * Run: node scripts/blog-pipeline/assemble-batch-02.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BLOG_LOCALES } from "./constants.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const MANIFEST = path.join(ROOT, "data/blog-manifest/pathophysiology-200.manifest.json");
const BATCH_DIR = path.join(ROOT, "data/blog-pipeline/batch-02");
const OUT_DIR = path.join(ROOT, "data/blog-import");
const PROGRESS = path.join(ROOT, "reports/blog-generation-progress.json");

const BATCH = [
  { idx: "01", slug: "w2v2-rn-cluster-respiratory-edges-59-why-pulse-oximetry-lags-in-carbon-monoxide-exposure-teaching" },
  { idx: "02", slug: "w2v2-np-cluster-shock-oxygenation-micro-1-cardiogenic-shock-vs-obstructive-shock-femoral-pulses-and-jvp-in-the-same-stem" },
  { idx: "03", slug: "w2v2-np-cluster-abg-nuance-10-delta-delta-gap-when-metabolic-acidosis-is-two-problems-at-once" },
  { idx: "04", slug: "w2v2-rn-cluster-renal-micro-37-why-metabolic-acidosis-in-renal-failure-is-not-always-just-bicarbonate-loss" },
  { idx: "05", slug: "w2v2-pn-cluster-labs-chem-panel-edges-167-why-chloride-trends-help-solve-metabolic-acidosis-mysteries" },
];

function wordCountLatin(t) {
  if (!t) return 0;
  return t.trim().split(/\s+/).filter(Boolean).length;
}

function hanCount(text) {
  return [...(text || "")].filter((ch) => /[\u4e00-\u9fff]/.test(ch)).length;
}

function eastAsianCharUnits(text) {
  return [...(text || "")].filter((ch) =>
    /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(ch),
  ).length;
}

function effectiveWords(body, locale) {
  const w = wordCountLatin(body);
  if (locale === "zh") return Math.max(w, hanCount(body));
  if (locale === "ja" || locale === "ko") {
    const units = eastAsianCharUnits(body);
    return Math.max(w, Math.floor(units / 1.65));
  }
  return w;
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
  let s = words.slice(0, 55).join(" ");
  if (words.length > 55) s += "…";
  return s;
}

function extractTitle(body) {
  const line = body.split("\n").find((l) => l.startsWith("# "));
  return line ? line.replace(/^#\s+/, "").trim() : "";
}

function buildInternalLinks(mp) {
  const lessons = (mp.relatedLessonPaths || []).slice(0, 2);
  const tools = (mp.relatedToolPaths || []).slice(0, 2);
  const out = [];
  if (lessons[0]) {
    out.push({
      href: lessons[0],
      anchor: `Related NurseNest lesson: ${lessons[0]}`,
    });
  } else {
    out.push({ href: "/lessons", anchor: "Browse the NurseNest lesson library." });
  }
  if (tools[0]) {
    out.push({
      href: tools[0],
      anchor: `Related NurseNest tool: ${tools[0]}`,
    });
  } else {
    out.push({ href: "/tools/lab-values", anchor: "Use NurseNest clinical tools for labs and calculations." });
  }
  return out;
}

function readBody(locale, idx) {
  const p = path.join(BATCH_DIR, locale, `${idx}.md`);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf8");
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const bySlug = Object.fromEntries(manifest.posts.map((p) => [p.slug, p]));

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const completed = [];
  const failures = [];

  for (const row of BATCH) {
    const mp = bySlug[row.slug];
    if (!mp) {
      failures.push({ slug: row.slug, error: "not in manifest" });
      continue;
    }

    const languages = {};
    const wordCounts = {};
    let allOk = true;

    for (const loc of BLOG_LOCALES) {
      const bodyMarkdown = readBody(loc, row.idx);
      if (!bodyMarkdown) {
        allOk = false;
        failures.push({ slug: row.slug, locale: loc, error: `missing ${loc}/${row.idx}.md` });
        languages[loc] = null;
        continue;
      }

      const faqItems = extractFaq(bodyMarkdown);
      const featuredSnippet = extractFeaturedSnippet(bodyMarkdown);
      const title = extractTitle(bodyMarkdown) || mp.title;
      const refsMatch = bodyMarkdown.match(/## References \(APA 7\)[\s\S]*/);
      const referencesApa7 = refsMatch
        ? refsMatch[0].replace(/^## References \(APA 7\)[^\n]*\n+/m, "").trim()
        : "";

      const seoTitle = `${title} | NurseNest`;
      const metaDescription = `${mp.primaryKeyword.split("[")[0].trim()}. Exam-focused pathophysiology and nursing priorities for ${mp.pathway}.`;

      const block = {
        locale: loc,
        seoTitle,
        metaDescription,
        featuredSnippet,
        faq: faqItems,
        bodyMarkdown,
        referencesApa7,
        internalLinks: buildInternalLinks(mp),
        jsonLd: {
          article: jsonLdArticle({ title, description: metaDescription, slug: mp.slug }),
          faqPage: jsonLdFaq(faqItems),
          breadcrumbList: jsonLdBreadcrumb(mp.breadcrumb),
        },
      };
      languages[loc] = block;
      wordCounts[loc] = effectiveWords(bodyMarkdown, loc);
      if (wordCounts[loc] < 1200) allOk = false;
    }

    const out = {
      slug: mp.slug,
      pathway: mp.pathway,
      keywords: { primary: mp.primaryKeyword, secondary: mp.secondaryKeywords },
      breadcrumb: mp.breadcrumb,
      breadcrumbPath: mp.breadcrumbPath,
      relatedLessonPaths: mp.relatedLessonPaths,
      relatedToolPaths: mp.relatedToolPaths,
      languages,
      wordCounts,
      validation: {
        allAbove1200: Object.values(wordCounts).every((n) => n >= 1200),
        hasAPA: Object.values(languages).every(
          (L) =>
            L &&
            L.referencesApa7 &&
            L.referencesApa7.split(/\n\n+/).filter((b) => b.trim().length > 20).length >= 5,
        ),
        hasInternalLinks: true,
        hasBreadcrumbs: true,
        batch: 2,
        allLocalesPresent: BLOG_LOCALES.every((l) => languages[l]),
      },
      status: allOk ? "complete" : "draft",
    };

    const outPath = path.join(OUT_DIR, `${mp.slug}.json`);
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
    completed.push({ slug: mp.slug, path: outPath, wordCounts, allOk });
  }

  const progress = {
    updatedAt: new Date().toISOString(),
    pipeline: "pathophysiology-200",
    batchId: 2,
    batchSize: BATCH.length,
    posts: completed,
    failures,
    notes: "Validate: node scripts/blog-pipeline/validate-post.mjs data/blog-import/<slug>.json",
  };
  fs.mkdirSync(path.dirname(PROGRESS), { recursive: true });
  fs.writeFileSync(PROGRESS, JSON.stringify(progress, null, 2) + "\n", "utf8");
  console.log(JSON.stringify(progress, null, 2));
}

main();
