#!/usr/bin/env npx tsx
import { config as loadDotenv } from "dotenv";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Prisma } from "@prisma/client";
import { BlogPostStatus, LocalizedBlogStatus, BlogAdaptationType } from "@prisma/client";
import { localizedBlogPath, sanitizeSlug } from "../../src/lib/blog/blog-slug-localized";

type CanonicalPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  category: string | null;
  postStatus: BlogPostStatus;
  publishAt: Date | null;
  exam: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  targetKeyword: string | null;
  keywordCluster: string | null;
  intent: string | null;
  keyQuestions: string[];
  keyTakeaways: string[];
  internalLinkPlan: Prisma.JsonValue | null;
  ctaType: string | null;
  ctaText: string | null;
  ctaHref: string | null;
  perfImpressions: number | null;
  perfClicks: number | null;
  perfInternalClicks: number | null;
  perfConversionAssists: number | null;
  perfSubscriptionAssists: number | null;
  careerSlug: string | null;
  locale: string;
};

type RankedPost = CanonicalPost & {
  score: number;
  scoreParts: {
    searchVolume: number;
    examRelevance: number;
    clinicalImportance: number;
    internalTraffic: number;
  };
};

type Variant = {
  key: "fr-np" | "es-np" | "fr-rpn" | "es-pn";
  label: string;
  sourceSet: "np" | "rpn";
  locale: "fr" | "es";
  region: "canada" | "us";
  profession: "np" | "rpn" | "pn";
  exam: "cnple" | "fnp" | "rex-pn" | "nclex-pn";
  targetLanguage: "French" | "Spanish";
  targetAudience: string;
  hubPath: string;
};

type PublishResult = {
  key: Variant["key"];
  selected: number;
  created: number;
  updated: number;
  skippedExisting: number;
  failed: number;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..", "..");
const REPORT_PATH = path.join(APP_ROOT, "docs", "reports", "international-content-expansion-phase1.md");
const CACHE_PATH = path.join(APP_ROOT, ".cache", "international-content-expansion-phase1-google-cache.json");

const args = new Set(process.argv.slice(2));
const APPLY = args.has("--apply");
const OVERWRITE = args.has("--overwrite");
const LIMIT_NP = readNumberArg("--limit-np", 200);
const LIMIT_RPN = readNumberArg("--limit-rpn", 200);
const TRANSLATE = !args.has("--no-translate");

const VARIANTS: Variant[] = [
  {
    key: "fr-np",
    label: "French NP",
    sourceSet: "np",
    locale: "fr",
    region: "canada",
    profession: "np",
    exam: "cnple",
    targetLanguage: "French",
    targetAudience: "Canadian NP candidates",
    hubPath: "/fr/np",
  },
  {
    key: "es-np",
    label: "Spanish NP",
    sourceSet: "np",
    locale: "es",
    region: "us",
    profession: "np",
    exam: "fnp",
    targetLanguage: "Spanish",
    targetAudience: "US NP candidates",
    hubPath: "/es/np",
  },
  {
    key: "fr-rpn",
    label: "French RPN",
    sourceSet: "rpn",
    locale: "fr",
    region: "canada",
    profession: "rpn",
    exam: "rex-pn",
    targetLanguage: "French",
    targetAudience: "Canadian RPN candidates",
    hubPath: "/fr/rpn",
  },
  {
    key: "es-pn",
    label: "Spanish PN",
    sourceSet: "rpn",
    locale: "es",
    region: "us",
    profession: "pn",
    exam: "nclex-pn",
    targetLanguage: "Spanish",
    targetAudience: "US PN candidates",
    hubPath: "/es/pn",
  },
];

const PROTECTED_TERMS = [
  "NurseNest",
  "NCLEX",
  "NCLEX-RN",
  "NCLEX-PN",
  "REx-PN",
  "RPN",
  "PN",
  "NP",
  "CNPLE",
  "FNP",
  "AANP",
  "ANCC",
  "FNP-BC",
  "CAT",
  "NGN",
  "ECG",
  "EKG",
  "IV",
  "BP",
  "HR",
  "SpO2",
  "NCSBN",
];

function readNumberArg(name: string, fallback: number): number {
  const prefix = `${name}=`;
  const arg = process.argv.slice(2).find((item) => item.startsWith(prefix));
  if (!arg) return fallback;
  const parsed = Number.parseInt(arg.slice(prefix.length), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function ensureDir(filePath: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function loadTranslationCache(): Map<string, string> {
  try {
    const raw = fs.readFileSync(CACHE_PATH, "utf8");
    return new Map(Object.entries(JSON.parse(raw) as Record<string, string>));
  } catch {
    return new Map();
  }
}

function writeTranslationCache(cache: Map<string, string>): void {
  ensureDir(CACHE_PATH);
  fs.writeFileSync(CACHE_PATH, `${JSON.stringify(Object.fromEntries(cache), null, 2)}\n`, "utf8");
}

function normalizeText(post: CanonicalPost): string {
  return [
    post.title,
    post.excerpt,
    post.category ?? "",
    post.exam ?? "",
    post.careerSlug ?? "",
    post.targetKeyword ?? "",
    post.keywordCluster ?? "",
    post.tags.join(" "),
    post.body.slice(0, 4000),
  ]
    .join(" ")
    .toLowerCase();
}

function containsAny(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

function scorePost(post: CanonicalPost, pathway: "np" | "rpn"): RankedPost {
  const text = normalizeText(post);
  const impressions = post.perfImpressions ?? 0;
  const clicks = post.perfClicks ?? 0;
  const internal = post.perfInternalClicks ?? 0;
  const assists = (post.perfConversionAssists ?? 0) + (post.perfSubscriptionAssists ?? 0);
  const searchVolume = Math.min(45, Math.log10(impressions + 10) * 10 + Math.log10(clicks + 1) * 5);
  const internalTraffic = Math.min(25, Math.log10(internal + 1) * 8 + Math.log10(assists + 1) * 8);

  const npTerms = [
    "np",
    "nurse practitioner",
    "cnple",
    "fnp",
    "aanp",
    "ancc",
    "advanced practice",
    "primary care",
    "diagnosis",
    "differential",
    "prescribing",
  ];
  const rpnTerms = [
    "rpn",
    "rex-pn",
    "rex pn",
    "pn",
    "practical nurse",
    "nclex-pn",
    "nclex pn",
    "lpn",
    "lvn",
    "delegation",
    "scope of practice",
  ];
  const clinicalTerms = [
    "safety",
    "priority",
    "prioritization",
    "pharmacology",
    "medication",
    "cardiac",
    "respiratory",
    "sepsis",
    "diabetes",
    "pediatric",
    "maternal",
    "mental health",
    "labs",
    "ecg",
    "clinical judgment",
    "case",
    "assessment",
  ];

  const pathwayTerms = pathway === "np" ? npTerms : rpnTerms;
  const examRelevance = Math.min(
    20,
    (containsAny(text, pathwayTerms) ? 14 : 0) +
      (post.exam?.toLowerCase().includes(pathway) ? 4 : 0) +
      (post.careerSlug?.toLowerCase().includes(pathway) ? 4 : 0),
  );
  const clinicalImportance = Math.min(10, clinicalTerms.filter((term) => text.includes(term)).length * 1.4);

  const score = searchVolume + internalTraffic + examRelevance + clinicalImportance;
  return {
    ...post,
    score,
    scoreParts: { searchVolume, examRelevance, clinicalImportance, internalTraffic },
  };
}

function selectTop(posts: CanonicalPost[], pathway: "np" | "rpn", limit: number, excludeIds: Set<string>): RankedPost[] {
  return posts
    .filter((post) => !excludeIds.has(post.id))
    .map((post) => scorePost(post, pathway))
    .filter((post) => post.scoreParts.examRelevance > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function maskForTranslation(input: string): { text: string; restore: (translated: string) => string } {
  const replacements: string[] = [];
  let text = input;
  const save = (value: string) => {
    const token = ` NNLOCK${replacements.length} `;
    replacements.push(value);
    return token;
  };
  text = text.replace(/<[^>]+>/g, save);
  text = text.replace(/https?:\/\/[^\s"'<>]+|\/[a-z0-9/_?=&.#-]+/gi, save);
  for (const term of PROTECTED_TERMS.sort((a, b) => b.length - a.length)) {
    const pattern = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    text = text.replace(pattern, save);
  }
  return {
    text,
    restore(translated: string) {
      return translated.replace(/\s?NNLOCK(\d+)\s?/g, (_match, index: string) => replacements[Number(index)] ?? "");
    },
  };
}

function splitForTranslate(text: string, maxLength = 3900): string[] {
  const parts: string[] = [];
  let remaining = text;
  while (remaining.length > maxLength) {
    const slice = remaining.slice(0, maxLength);
    const boundary = Math.max(slice.lastIndexOf("\n\n"), slice.lastIndexOf(". "), slice.lastIndexOf(" "));
    const end = boundary > maxLength * 0.55 ? boundary + 1 : maxLength;
    parts.push(remaining.slice(0, end));
    remaining = remaining.slice(end);
  }
  if (remaining.trim()) parts.push(remaining);
  return parts;
}

async function translateText(
  input: string,
  targetLocale: "fr" | "es",
  cache: Map<string, string>,
): Promise<string> {
  if (!TRANSLATE || !input.trim()) return input;
  const { text, restore } = maskForTranslation(input);
  const chunks = splitForTranslate(text);
  const translatedChunks: string[] = [];
  for (const chunk of chunks) {
    const cacheKey = crypto.createHash("sha1").update(`${targetLocale}:${chunk}`).digest("hex");
    const cached = cache.get(cacheKey);
    if (cached) {
      translatedChunks.push(cached);
      continue;
    }
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "en");
    url.searchParams.set("tl", targetLocale);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", chunk);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`translation_failed_${res.status}`);
    const json = (await res.json()) as unknown;
    const translated = Array.isArray(json) && Array.isArray(json[0])
      ? json[0].map((part: unknown) => (Array.isArray(part) ? String(part[0] ?? "") : "")).join("")
      : "";
    if (!translated.trim()) throw new Error("translation_empty");
    cache.set(cacheKey, translated);
    translatedChunks.push(translated);
  }
  return restore(translatedChunks.join(""));
}

function extractInternalLinks(body: string): Array<{ href: string; text: string }> {
  const links: Array<{ href: string; text: string }> = [];
  const pattern = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(body)) && links.length < 30) {
    const text = match[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    links.push({ href: match[1], text });
  }
  return links;
}

function buildHreflang(post: CanonicalPost, variant: Variant, localizedSlug: string): Prisma.InputJsonValue {
  return {
    en: `/blog/${post.slug}`,
    [variant.locale]: localizedBlogPath({
      locale: variant.locale,
      region: variant.region,
      profession: variant.profession,
      exam: variant.exam,
      slug: localizedSlug,
    }),
  };
}

async function buildLocalizedPayload(post: RankedPost, variant: Variant, cache: Map<string, string>) {
  const title = await translateText(post.title, variant.locale, cache);
  const excerpt = await translateText(post.excerpt, variant.locale, cache);
  const body = await translateText(post.body, variant.locale, cache);
  const metaTitle = await translateText(post.seoTitle ?? post.title, variant.locale, cache);
  const metaDescription = await translateText(post.seoDescription ?? post.excerpt, variant.locale, cache);
  const ctaText = post.ctaText ? await translateText(post.ctaText, variant.locale, cache) : null;
  const keyword = post.targetKeyword ? await translateText(post.targetKeyword, variant.locale, cache) : null;
  const slugBase = sanitizeSlug(title) || sanitizeSlug(post.slug);
  const localizedSlug = slugBase.length >= 8 ? slugBase : `${sanitizeSlug(post.slug)}-${variant.profession}`;
  return {
    locale: variant.locale,
    region: variant.region,
    profession: variant.profession,
    exam: variant.exam,
    sourceLanguage: "en",
    adaptationType: BlogAdaptationType.LOCALIZED_REWRITE,
    contentStatus: LocalizedBlogStatus.PUBLISHED,
    localizedTitle: title,
    localizedExcerpt: excerpt,
    localizedBody: body,
    canonicalSlug: post.slug,
    localizedSlug,
    localizedMetaTitle: metaTitle,
    localizedMetaDescription: metaDescription,
    seoKeywordPrimary: keyword ?? post.targetKeyword,
    seoKeywordSecondary: post.keywordCluster ? [post.keywordCluster] : [],
    searchIntent: post.intent,
    hreflangJson: buildHreflang(post, variant, localizedSlug),
    canonicalUrl: localizedBlogPath({
      locale: variant.locale,
      region: variant.region,
      profession: variant.profession,
      exam: variant.exam,
      slug: localizedSlug,
    }),
    targetAudience: variant.targetAudience,
    ctaVariant: post.ctaType,
    ctaText,
    ctaHref: post.ctaHref,
    internalLinkTargets: extractInternalLinks(body),
    complianceReviewRequired: false,
    medicalReviewRequired: false,
    editorialReviewRequired: false,
    reviewFlags: [],
    publishedAt: new Date(),
    scheduledAt: null,
  };
}

function publishingScheduleMarkdown(totalFrench: number, totalSpanish: number): string {
  const frenchRunway = Math.floor(totalFrench / 3);
  const spanishRunway = Math.floor(totalSpanish / 3);
  return [
    "## Publishing Schedule",
    "",
    "- French cadence: 3 posts/day.",
    "- Spanish cadence: 3 posts/day.",
    "- Mix target: 40% RN, 30% RPN/PN, 30% NP.",
    "- RN-only publishing is explicitly avoided; every 10-day block should include 12 RN, 9 RPN/PN, and 9 NP posts per language.",
    `- French runway from this phase: ${totalFrench} posts = about ${frenchRunway} days at 3/day.`,
    `- Spanish runway from this phase: ${totalSpanish} posts = about ${spanishRunway} days at 3/day.`,
  ].join("\n");
}

function writeReport(params: {
  generatedAt: Date;
  applied: boolean;
  databaseAvailable: boolean;
  blocker: string | null;
  npSelected: RankedPost[];
  rpnSelected: RankedPost[];
  results: PublishResult[];
  beforeCounts: Record<string, number>;
  afterCounts: Record<string, number>;
}) {
  const totalCreated = params.results.reduce((sum, row) => sum + row.created, 0);
  const totalUpdated = params.results.reduce((sum, row) => sum + row.updated, 0);
  const totalFrench = params.results.filter((row) => row.key.startsWith("fr-")).reduce((sum, row) => sum + row.selected, 0);
  const totalSpanish = params.results.filter((row) => row.key.startsWith("es-")).reduce((sum, row) => sum + row.selected, 0);
  const lines = [
    "# International Content Expansion Phase 1",
    "",
    `Generated: ${params.generatedAt.toISOString()}`,
    `Mode: ${params.applied ? "apply" : "dry-run"}`,
    `Database available: ${params.databaseAvailable ? "yes" : "no"}`,
    params.blocker ? `Blocker: ${params.blocker}` : null,
    "",
    "## Pathways Added",
    "",
    "| Hub | Locale | Region | Profession | Exam | Source inventory |",
    "| --- | --- | --- | --- | --- | --- |",
    ...VARIANTS.map((variant) => `| ${variant.hubPath} | ${variant.locale} | ${variant.region} | ${variant.profession} | ${variant.exam} | English ${variant.sourceSet.toUpperCase()} blog inventory |`),
    "",
    "## Articles Translated",
    "",
    "| Variant | Selected | Created | Updated | Existing skipped | Failed | Before | After |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...params.results.map((row) => `| ${row.key} | ${row.selected} | ${row.created} | ${row.updated} | ${row.skippedExisting} | ${row.failed} | ${params.beforeCounts[row.key] ?? 0} | ${params.afterCounts[row.key] ?? 0} |`),
    "",
    "## Ranking Inputs",
    "",
    "- Search volume proxy: `perfImpressions` and `perfClicks` from existing English posts.",
    "- Exam relevance proxy: existing exam/career fields plus NP, CNPLE, FNP, RPN, REx-PN, PN, NCLEX-PN terminology in title, tags, category, and body.",
    "- Clinical importance proxy: safety, priority, pharmacology, cardiac, respiratory, labs, clinical judgment, case, and assessment terms.",
    "- Internal traffic proxy: `perfInternalClicks`, `perfConversionAssists`, and `perfSubscriptionAssists`.",
    "",
    "## Top Source Sets",
    "",
    `- NP source articles selected: ${params.npSelected.length}.`,
    `- RPN/PN source articles selected: ${params.rpnSelected.length}.`,
    "",
    "### Top 10 NP Sources",
    "",
    ...params.npSelected.slice(0, 10).map((post, index) => `${index + 1}. ${post.title} (${post.slug}) - score ${post.score.toFixed(1)}`),
    "",
    "### Top 10 RPN/PN Sources",
    "",
    ...params.rpnSelected.slice(0, 10).map((post, index) => `${index + 1}. ${post.title} (${post.slug}) - score ${post.score.toFixed(1)}`),
    "",
    publishingScheduleMarkdown(totalFrench, totalSpanish),
    "",
    "## Runway Improvement",
    "",
    `- French publication runway added: ${totalFrench} candidate posts.`,
    `- Spanish publication runway added: ${totalSpanish} candidate posts.`,
    `- Immediate localized rows created/updated in this run: ${totalCreated + totalUpdated}.`,
    "",
    "## Coverage Improvement",
    "",
    "- Dedicated hubs now exist for French NP, Spanish NP, French RPN, and Spanish PN.",
    "- Hubs auto-populate from published `LocalizedBlogArticle` rows for their pathway mapping.",
    "- No random topic generation was used; source selection is exclusively from existing English `BlogPost` inventory.",
  ].filter((line): line is string => line !== null);

  ensureDir(REPORT_PATH);
  fs.writeFileSync(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
}

async function main(): Promise<void> {
  const generatedAt = new Date();
  loadDotenv({ path: path.join(APP_ROOT, ".env.local"), override: false, quiet: true });

  if (!process.env.DATABASE_URL?.trim()) {
    writeReport({
      generatedAt,
      applied: APPLY,
      databaseAvailable: false,
      blocker: "DATABASE_URL is not configured in this shell; production publish could not be executed locally.",
      npSelected: [],
      rpnSelected: [],
      results: VARIANTS.map((variant) => ({
        key: variant.key,
        selected: 0,
        created: 0,
        updated: 0,
        skippedExisting: 0,
        failed: 0,
      })),
      beforeCounts: {},
      afterCounts: {},
    });
    console.log(JSON.stringify({ ok: false, report: REPORT_PATH, reason: "DATABASE_URL_MISSING" }, null, 2));
    return;
  }

  await import("../../src/lib/db/script-env-bootstrap");
  const { prisma } = await import("../../src/lib/db");

  const liveWhere = {
    postStatus: BlogPostStatus.PUBLISHED,
    locale: "en",
    OR: [{ publishAt: null }, { publishAt: { lte: generatedAt } }],
  } satisfies Prisma.BlogPostWhereInput;

  const posts = await prisma.blogPost.findMany({
    where: liveWhere,
    orderBy: [{ perfImpressions: "desc" }, { updatedAt: "desc" }],
    take: 5000,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      body: true,
      tags: true,
      category: true,
      postStatus: true,
      publishAt: true,
      exam: true,
      seoTitle: true,
      seoDescription: true,
      targetKeyword: true,
      keywordCluster: true,
      intent: true,
      keyQuestions: true,
      keyTakeaways: true,
      internalLinkPlan: true,
      ctaType: true,
      ctaText: true,
      ctaHref: true,
      perfImpressions: true,
      perfClicks: true,
      perfInternalClicks: true,
      perfConversionAssists: true,
      perfSubscriptionAssists: true,
      careerSlug: true,
      locale: true,
    },
  });

  const npSelected = selectTop(posts, "np", LIMIT_NP, new Set());
  const npIds = new Set(npSelected.map((post) => post.id));
  const rpnSelected = selectTop(posts, "rpn", LIMIT_RPN, npIds);
  const selection = { np: npSelected, rpn: rpnSelected };
  const cache = loadTranslationCache();
  const beforeCounts: Record<string, number> = {};
  const afterCounts: Record<string, number> = {};
  const results: PublishResult[] = [];

  for (const variant of VARIANTS) {
    const selected = selection[variant.sourceSet];
    beforeCounts[variant.key] = await prisma.localizedBlogArticle.count({
      where: {
        locale: variant.locale,
        region: variant.region,
        profession: variant.profession,
        exam: variant.exam,
      },
    });
    const result: PublishResult = {
      key: variant.key,
      selected: selected.length,
      created: 0,
      updated: 0,
      skippedExisting: 0,
      failed: 0,
    };
    if (!APPLY) {
      results.push(result);
      afterCounts[variant.key] = beforeCounts[variant.key];
      continue;
    }

    for (const post of selected) {
      try {
        const existing = await prisma.localizedBlogArticle.findUnique({
          where: {
            canonicalArticleId_locale_region: {
              canonicalArticleId: post.id,
              locale: variant.locale,
              region: variant.region,
            },
          },
          select: { id: true, generationLog: true },
        });
        if (existing && !OVERWRITE) {
          result.skippedExisting += 1;
          continue;
        }

        const payload = await buildLocalizedPayload(post, variant, cache);
        const generationLog = [
          {
            action: existing ? "update" : "create",
            at: generatedAt.toISOString(),
            source: "international-content-expansion-phase1",
            variant: variant.key,
            score: post.score,
            scoreParts: post.scoreParts,
            translationProvider: TRANSLATE ? "google-translate-gtx" : "source-copy",
          },
        ] satisfies Prisma.InputJsonValue;

        if (existing) {
          await prisma.localizedBlogArticle.update({
            where: { id: existing.id },
            data: {
              ...payload,
              generationLog,
            },
          });
          result.updated += 1;
        } else {
          await prisma.localizedBlogArticle.create({
            data: {
              canonicalArticleId: post.id,
              ...payload,
              generationLog,
            },
          });
          result.created += 1;
        }
      } catch (error) {
        result.failed += 1;
        console.error("[international-content-expansion-phase1] failed", {
          variant: variant.key,
          canonicalArticleId: post.id,
          slug: post.slug,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    writeTranslationCache(cache);
    afterCounts[variant.key] = await prisma.localizedBlogArticle.count({
      where: {
        locale: variant.locale,
        region: variant.region,
        profession: variant.profession,
        exam: variant.exam,
      },
    });
    results.push(result);
  }

  writeReport({
    generatedAt,
    applied: APPLY,
    databaseAvailable: true,
    blocker: null,
    npSelected,
    rpnSelected,
    results,
    beforeCounts,
    afterCounts,
  });

  await prisma.$disconnect();
  console.log(JSON.stringify({ ok: true, applied: APPLY, report: REPORT_PATH, results }, null, 2));
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  writeReport({
    generatedAt: new Date(),
    applied: APPLY,
    databaseAvailable: Boolean(process.env.DATABASE_URL?.trim()),
    blocker: `Production publish failed before article selection: ${message}`,
    npSelected: [],
    rpnSelected: [],
    results: VARIANTS.map((variant) => ({
      key: variant.key,
      selected: 0,
      created: 0,
      updated: 0,
      skippedExisting: 0,
      failed: 0,
    })),
    beforeCounts: {},
    afterCounts: {},
  });
  console.error(error);
  console.log(JSON.stringify({ ok: false, report: REPORT_PATH, reason: "DATABASE_QUERY_FAILED" }, null, 2));
});
