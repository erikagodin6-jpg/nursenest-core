#!/usr/bin/env npx tsx
/**
 * READ-ONLY blog SEO audit — spreadsheet-friendly CSV (default stdout) or JSON.
 * No DB writes, no revalidation, no rendering changes.
 *
 *   cd nursenest-core && npm run audit:blog:seo
 *   cd nursenest-core && npm run audit:blog:seo -- --json
 *   cd nursenest-core && npm run audit:blog:seo -- --out=tmp/blog-seo-audit.csv
 *
 * Uses the same title/H1/FAQ merge/study-anchor helpers as public blog routes.
 */
import "../../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import type { CountryCode } from "@prisma/client";
import { LocalizedBlogStatus, Prisma } from "@prisma/client";
import { prisma } from "../../src/lib/db";
import { isDatabaseUrlConfigured } from "../../src/lib/db/safe-database";
import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";
import { parseInternalLinkPlanJson } from "../../src/lib/blog/blog-image-workflow";
import {
  blogBrowserTitleForLocalizedEnPost,
  blogBrowserTitleForPublicPost,
  blogExamGeoParts,
  blogH1ForPublicPost,
  blogKeywordStemFromTitles,
  blogStudyAnchorTargets,
  blogStudyAnchorTargetsForLocalizedRegion,
  mergeBlogFaqItemsForPublicPage,
} from "../../src/lib/blog/blog-public-seo-helpers";
import { blogCountryFromPrismaTarget, blogCountryFromRegionSlug } from "../../src/lib/blog/blog-study-cta";
import { localizedBlogPath } from "../../src/lib/blog/blog-slug-localized";
import { countWordsFromHtmlApproximate } from "../../src/lib/blog/blog-word-count";
import { MARKETING_SITE_ORIGIN } from "../../src/lib/seo/site-origin";
import type { GlobalLocaleCode, GlobalRegionSlug } from "../../src/lib/i18n/global-regions";

type RouteType = "default_blog" | "allied_blog" | "localized_blog";

type AuditRow = {
  id: string;
  slug: string;
  locale: string;
  routeType: RouteType;
  fullPublicUrl: string;
  title: string;
  seoTitle: string;
  computedBrowserTitle: string;
  computedH1: string;
  examCode: string;
  examName: string;
  countryTarget: string;
  regionSlug: string;
  publishedAt: string;
  updatedAt: string;
  estimatedWordCountPlainText: number;
  htmlCharacterCount: number;
  faqCountDb: number;
  faqCountRenderedEstimate: number;
  hasFaqSchemaEligible: boolean;
  hasStudyAnchorStripEligible: boolean;
  hasPracticeQuestionsLinkEligible: boolean;
  hasAdaptiveCatLinkEligible: boolean;
  hasFlashcardsLinkEligible: boolean;
  thinContentFlag: boolean;
  mediumContentFlag: boolean;
  strongContentFlag: boolean;
  missingSeoTitleFlag: boolean;
  duplicateComputedBrowserTitleCandidate: boolean;
  duplicateH1Candidate: boolean;
  notes: string;
};

const CSV_COLUMNS: (keyof AuditRow)[] = [
  "id",
  "slug",
  "locale",
  "routeType",
  "fullPublicUrl",
  "title",
  "seoTitle",
  "computedBrowserTitle",
  "computedH1",
  "examCode",
  "examName",
  "countryTarget",
  "regionSlug",
  "publishedAt",
  "updatedAt",
  "estimatedWordCountPlainText",
  "htmlCharacterCount",
  "faqCountDb",
  "faqCountRenderedEstimate",
  "hasFaqSchemaEligible",
  "hasStudyAnchorStripEligible",
  "hasPracticeQuestionsLinkEligible",
  "hasAdaptiveCatLinkEligible",
  "hasFlashcardsLinkEligible",
  "thinContentFlag",
  "mediumContentFlag",
  "strongContentFlag",
  "missingSeoTitleFlag",
  "duplicateComputedBrowserTitleCandidate",
  "duplicateH1Candidate",
  "notes",
];

function parseCliArgs(): { json: boolean; outPath: string | null } {
  const argv = process.argv.slice(2);
  const json = argv.includes("--json");
  const outRaw = argv.find((a) => a.startsWith("--out="));
  const outPath = outRaw ? outRaw.slice("--out=".length).trim() : null;
  return { json, outPath: outPath || null };
}

function absolutePublicUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${MARKETING_SITE_ORIGIN.replace(/\/$/, "")}${p}`;
}

function normalizeForDuplicateKey(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function faqItemsFromFaqBlock(raw: unknown): { q: string; a: string }[] {
  if (!raw || typeof raw !== "object" || !("items" in raw)) return [];
  const items = (raw as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];
  const out: { q: string; a: string }[] = [];
  for (const x of items) {
    if (!x || typeof x !== "object") continue;
    const o = x as Record<string, unknown>;
    const q = typeof o.q === "string" ? o.q.trim() : "";
    const a = typeof o.a === "string" ? o.a.trim() : "";
    if (q && a) out.push({ q, a });
  }
  return out;
}

function countryTargetToCell(ct: CountryCode | null | undefined): string {
  if (ct === null || ct === undefined) return "";
  return String(ct);
}

function iso(d: Date | null | undefined): string {
  if (!d) return "";
  return d.toISOString();
}

function csvEscape(value: string | number | boolean): string {
  const s = typeof value === "string" ? value : String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function rowToCsvLine(row: AuditRow): string {
  return CSV_COLUMNS.map((k) => csvEscape(row[k] as never)).join(",");
}

function localizedLiveWhere(now: Date): Prisma.LocalizedBlogArticleWhereInput {
  return {
    OR: [
      { contentStatus: LocalizedBlogStatus.PUBLISHED },
      {
        AND: [{ contentStatus: LocalizedBlogStatus.SCHEDULED }, { scheduledAt: { lte: now } }],
      },
    ],
  };
}

function buildNotes(parts: string[]): string {
  return parts.filter(Boolean).join("; ");
}

function faqSchemaEligibleBlogPost(mergedLen: number, emitFaqSchema: boolean | null | undefined): boolean {
  if (mergedLen < 3) return false;
  if (emitFaqSchema === null || emitFaqSchema === undefined) return true;
  return emitFaqSchema !== false;
}

function studyLinkFlags(targets: {
  practiceQuestionsHref: string;
  adaptiveCatHref: string;
  flashcardsHref: string;
}): {
  hasStudyAnchorStripEligible: boolean;
  hasPracticeQuestionsLinkEligible: boolean;
  hasAdaptiveCatLinkEligible: boolean;
  hasFlashcardsLinkEligible: boolean;
} {
  const pq = targets.practiceQuestionsHref.trim().length > 0;
  const cat = targets.adaptiveCatHref.trim().length > 0;
  const fc = targets.flashcardsHref.trim().length > 0;
  return {
    hasStudyAnchorStripEligible: pq && cat && fc,
    hasPracticeQuestionsLinkEligible: pq,
    hasAdaptiveCatLinkEligible: cat,
    hasFlashcardsLinkEligible: fc,
  };
}

async function main(): Promise<void> {
  const { json, outPath } = parseCliArgs();

  if (!isDatabaseUrlConfigured()) {
    console.error("audit:blog:seo — DATABASE_URL not configured; exiting without queries.");
    process.exitCode = 1;
    return;
  }

  const now = new Date();
  const rows: AuditRow[] = [];

  const blogSelect = {
    id: true,
    slug: true,
    locale: true,
    title: true,
    seoTitle: true,
    exam: true,
    countryTarget: true,
    careerSlug: true,
    body: true,
    internalLinkPlan: true,
    faqBlock: true,
    publishAt: true,
    scheduledAt: true,
    updatedAt: true,
    postStatus: true,
    createdAt: true,
  } satisfies Prisma.BlogPostSelect;

  const blogPosts = await prisma.blogPost.findMany({
    where: blogLiveWhere(now),
    select: blogSelect,
    orderBy: { updatedAt: "desc" },
  });

  for (const p of blogPosts) {
    const html = p.body ?? "";
    const htmlCharacterCount = html.length;
    const estimatedWordCountPlainText = countWordsFromHtmlApproximate(html);
    const thinContentFlag = estimatedWordCountPlainText < 800;
    const mediumContentFlag = estimatedWordCountPlainText >= 800 && estimatedWordCountPlainText < 1200;
    const strongContentFlag = estimatedWordCountPlainText >= 1200;

    const faqCountDb = faqItemsFromFaqBlock(p.faqBlock).length;
    const parsed = parseInternalLinkPlanJson(p.internalLinkPlan);
    const seoBundle = parsed.seo;
    const emitFaqSchema = seoBundle?.emitFaqSchema;
    const geo = blogExamGeoParts(p.exam, blogCountryFromPrismaTarget(p.countryTarget));
    const keywordStem = blogKeywordStemFromTitles(p.seoTitle, p.title);
    const mergedFaq = mergeBlogFaqItemsForPublicPage(faqItemsFromFaqBlock(p.faqBlock), {
      keywordStem,
      examPlain: geo.examPlain,
      countryWord: geo.countryWord,
    });
    const faqCountRenderedEstimate = mergedFaq.length;
    const hasFaqSchemaEligible = faqSchemaEligibleBlogPost(mergedFaq.length, emitFaqSchema);

    const study = studyLinkFlags(
      blogStudyAnchorTargets({ exam: p.exam, countryTarget: p.countryTarget }),
    );

    const publishedAt = p.publishAt ?? p.scheduledAt ?? p.createdAt;
    const missingSeoTitleFlag = !p.seoTitle?.trim();

    const baseNotes: string[] = [];
    if (!p.exam?.trim()) baseNotes.push("missing exam on BlogPost");
    if (missingSeoTitleFlag) baseNotes.push("missing seoTitle");
    if (thinContentFlag) baseNotes.push("thin content");
    if (!hasFaqSchemaEligible) baseNotes.push("no FAQ schema eligibility");
    if (!study.hasStudyAnchorStripEligible) baseNotes.push("study anchor strip not fully eligible");

    const computedBrowserTitle = blogBrowserTitleForPublicPost({
      seoTitle: p.seoTitle,
      title: p.title,
      exam: p.exam,
      countryTarget: p.countryTarget,
    });
    const computedH1 = blogH1ForPublicPost({ seoTitle: p.seoTitle, title: p.title });

    const defaultRow: AuditRow = {
      id: p.id,
      slug: p.slug,
      locale: p.locale ?? "en",
      routeType: "default_blog",
      fullPublicUrl: absolutePublicUrl(`/blog/${encodeURIComponent(p.slug)}`),
      title: p.title,
      seoTitle: p.seoTitle ?? "",
      computedBrowserTitle,
      computedH1,
      examCode: p.exam ?? "",
      examName: geo.examPlain,
      countryTarget: countryTargetToCell(p.countryTarget),
      regionSlug: "",
      publishedAt: iso(publishedAt),
      updatedAt: iso(p.updatedAt),
      estimatedWordCountPlainText,
      htmlCharacterCount,
      faqCountDb,
      faqCountRenderedEstimate,
      hasFaqSchemaEligible,
      hasStudyAnchorStripEligible: study.hasStudyAnchorStripEligible,
      hasPracticeQuestionsLinkEligible: study.hasPracticeQuestionsLinkEligible,
      hasAdaptiveCatLinkEligible: study.hasAdaptiveCatLinkEligible,
      hasFlashcardsLinkEligible: study.hasFlashcardsLinkEligible,
      thinContentFlag,
      mediumContentFlag,
      strongContentFlag,
      missingSeoTitleFlag,
      duplicateComputedBrowserTitleCandidate: false,
      duplicateH1Candidate: false,
      notes: buildNotes(baseNotes),
    };
    rows.push(defaultRow);

    if (p.careerSlug?.trim()) {
      const alliedPath = `/allied-health/${encodeURIComponent(p.careerSlug.trim())}/blog/${encodeURIComponent(p.slug)}`;
      rows.push({
        ...defaultRow,
        routeType: "allied_blog",
        fullPublicUrl: absolutePublicUrl(alliedPath),
        notes: buildNotes([...baseNotes, "allied surface"]),
      });
    }
  }

  const localizedSelect = {
    id: true,
    localizedSlug: true,
    locale: true,
    region: true,
    profession: true,
    exam: true,
    localizedTitle: true,
    localizedMetaTitle: true,
    localizedBody: true,
    publishedAt: true,
    scheduledAt: true,
    createdAt: true,
    updatedAt: true,
  } satisfies Prisma.LocalizedBlogArticleSelect;

  const localizedRows = await prisma.localizedBlogArticle.findMany({
    where: localizedLiveWhere(now),
    select: localizedSelect,
    orderBy: { updatedAt: "desc" },
  });

  for (const L of localizedRows) {
    const html = L.localizedBody ?? "";
    const htmlCharacterCount = html.length;
    const estimatedWordCountPlainText = countWordsFromHtmlApproximate(html);
    const thinContentFlag = estimatedWordCountPlainText < 800;
    const mediumContentFlag = estimatedWordCountPlainText >= 800 && estimatedWordCountPlainText < 1200;
    const strongContentFlag = estimatedWordCountPlainText >= 1200;

    const examSeg = (L.exam ?? "").trim();
    const region = L.region as GlobalRegionSlug;
    const locale = L.locale as GlobalLocaleCode;
    const profession = (L.profession ?? "").trim() || "nursing";
    const examForPath = examSeg || "nclex-rn";

    const geo = blogExamGeoParts(examForPath, blogCountryFromRegionSlug(region));
    const keywordStem = blogKeywordStemFromTitles(L.localizedMetaTitle, L.localizedTitle);
    const mergedFaq = mergeBlogFaqItemsForPublicPage([], {
      keywordStem,
      examPlain: geo.examPlain,
      countryWord: geo.countryWord,
    });
    const faqCountDb = 0;
    const faqCountRenderedEstimate = mergedFaq.length;
    const hasFaqSchemaEligible = mergedFaq.length >= 3;

    const study = studyLinkFlags(
      blogStudyAnchorTargetsForLocalizedRegion({ exam: examForPath, regionSlug: region }),
    );

    const publishedAt = L.publishedAt ?? L.scheduledAt ?? L.createdAt;
    const missingSeoTitleFlag = !L.localizedMetaTitle?.trim();

    const enTitle = blogBrowserTitleForLocalizedEnPost({
      localizedMetaTitle: L.localizedMetaTitle,
      localizedTitle: L.localizedTitle,
      regionSlug: region,
      exam: examForPath,
      locale: L.locale,
    });
    const computedBrowserTitle =
      enTitle ?? (L.localizedMetaTitle?.trim() || L.localizedTitle).trim();
    const computedH1 =
      L.locale === "en" ?
        blogH1ForPublicPost({ seoTitle: L.localizedMetaTitle, title: L.localizedTitle })
      : L.localizedTitle;

    const relPath = localizedBlogPath({
      locale,
      region,
      profession,
      exam: examForPath,
      slug: L.localizedSlug,
    });

    const countryFromRegion =
      blogCountryFromRegionSlug(region) === "CA" ? "CA"
      : blogCountryFromRegionSlug(region) === "US" ? "US"
      : "";

    const baseNotes: string[] = [];
    if (!examSeg) baseNotes.push("missing exam on LocalizedBlogArticle (used nclex-rn for URL/helpers)");
    if (!L.profession?.trim()) baseNotes.push("missing profession (used nursing for path)");
    if (missingSeoTitleFlag) baseNotes.push("missing localizedMetaTitle");
    if (thinContentFlag) baseNotes.push("thin content");
    if (!hasFaqSchemaEligible) baseNotes.push("no FAQ schema eligibility");
    if (!study.hasStudyAnchorStripEligible) baseNotes.push("study anchor strip not fully eligible");

    rows.push({
      id: L.id,
      slug: L.localizedSlug,
      locale: L.locale,
      routeType: "localized_blog",
      fullPublicUrl: absolutePublicUrl(relPath),
      title: L.localizedTitle,
      seoTitle: L.localizedMetaTitle ?? "",
      computedBrowserTitle,
      computedH1,
      examCode: L.exam ?? "",
      examName: geo.examPlain,
      countryTarget: countryFromRegion,
      regionSlug: region,
      publishedAt: iso(publishedAt),
      updatedAt: iso(L.updatedAt),
      estimatedWordCountPlainText,
      htmlCharacterCount,
      faqCountDb,
      faqCountRenderedEstimate,
      hasFaqSchemaEligible,
      hasStudyAnchorStripEligible: study.hasStudyAnchorStripEligible,
      hasPracticeQuestionsLinkEligible: study.hasPracticeQuestionsLinkEligible,
      hasAdaptiveCatLinkEligible: study.hasAdaptiveCatLinkEligible,
      hasFlashcardsLinkEligible: study.hasFlashcardsLinkEligible,
      thinContentFlag,
      mediumContentFlag,
      strongContentFlag,
      missingSeoTitleFlag,
      duplicateComputedBrowserTitleCandidate: false,
      duplicateH1Candidate: false,
      notes: buildNotes(baseNotes),
    });
  }

  const titleKeyCounts = new Map<string, number>();
  const h1KeyCounts = new Map<string, number>();
  for (const r of rows) {
    const tk = normalizeForDuplicateKey(r.computedBrowserTitle);
    const hk = normalizeForDuplicateKey(r.computedH1);
    titleKeyCounts.set(tk, (titleKeyCounts.get(tk) ?? 0) + 1);
    h1KeyCounts.set(hk, (h1KeyCounts.get(hk) ?? 0) + 1);
  }

  let dupTitle = 0;
  let dupH1 = 0;
  for (const r of rows) {
    const tk = normalizeForDuplicateKey(r.computedBrowserTitle);
    const hk = normalizeForDuplicateKey(r.computedH1);
    const titleDup = (titleKeyCounts.get(tk) ?? 0) > 1;
    const h1Dup = (h1KeyCounts.get(hk) ?? 0) > 1;
    r.duplicateComputedBrowserTitleCandidate = titleDup;
    r.duplicateH1Candidate = h1Dup;
    if (titleDup) dupTitle += 1;
    if (h1Dup) dupH1 += 1;
    const extra: string[] = [];
    if (titleDup) extra.push("duplicate title candidate");
    if (h1Dup) extra.push("duplicate H1 candidate");
    if (extra.length) r.notes = buildNotes([r.notes, ...extra].filter(Boolean));
  }

  const thin = rows.filter((r) => r.thinContentFlag).length;
  const missingSeo = rows.filter((r) => r.missingSeoTitleFlag).length;

  console.error(`audit:blog:seo — total rows: ${rows.length}`);
  console.error(`audit:blog:seo — thin (<800 words): ${thin}`);
  console.error(`audit:blog:seo — missing seoTitle / localizedMetaTitle: ${missingSeo}`);
  console.error(`audit:blog:seo — duplicate computedBrowserTitle candidates (rows flagged): ${dupTitle}`);
  console.error(`audit:blog:seo — duplicate H1 candidates (rows flagged): ${dupH1}`);

  const payload = json ? JSON.stringify(rows, null, 2) : `${CSV_COLUMNS.join(",")}\n${rows.map(rowToCsvLine).join("\n")}\n`;

  if (outPath) {
    const resolved = path.isAbsolute(outPath) ? outPath : path.join(process.cwd(), outPath);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    fs.writeFileSync(resolved, payload, "utf8");
    console.error(`audit:blog:seo — wrote ${resolved}`);
  } else {
    process.stdout.write(payload);
  }

  await prisma.$disconnect().catch(() => {});
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
  prisma.$disconnect().catch(() => {});
});
