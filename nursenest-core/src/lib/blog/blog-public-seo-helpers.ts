/**
 * Public blog SEO helpers: browser title pattern, H1 stem, optional lead + framing HTML,
 * supplemental FAQ items, and study-surface hrefs (questions / CAT / flashcards).
 */

import { CountryCode } from "@prisma/client";
import {
  generateBlogSEOFromPostRow,
  slugifyBlogSeoSegment,
  extractPrimaryKeyword,
} from "@/lib/blog/blog-generate-seo";
import { publicMarketingCatHrefForOffering } from "@/lib/exam-pathways/practice-exams-cat-start";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import type { CountryExamOfferingId } from "@/lib/marketing/country-exam-offerings";
import {
  blogCountryFromPrismaTarget,
  blogCountryFromRegionSlug,
  marketingStudyHubsForBlogExam,
  type BlogCountryContext,
} from "@/lib/blog/blog-study-cta";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";

const BRAND_SUFFIX = /\s*\|\s*NurseNest\s*$/i;

/** Strip trailing brand and trim for title/H1 keyword stem. */
export function stripBlogPipeBrand(title: string): string {
  return title.replace(BRAND_SUFFIX, "").trim();
}

const VAGUE_TAIL = /\b(a\s+)?(complete\s+)?(guide|overview|introduction|primer|basics|tips|learn more)\b\.?$/i;

export function stripBlogVagueTailWords(title: string): string {
  let t = title.trim();
  for (let i = 0; i < 4; i++) {
    const next = t.replace(VAGUE_TAIL, "").trim();
    if (next === t) break;
    t = next;
  }
  return t;
}

export function blogKeywordStemFromTitles(seoTitle: string | null | undefined, title: string): string {
  const raw = (seoTitle?.trim() || title).trim();
  return stripBlogVagueTailWords(stripBlogPipeBrand(raw)) || stripBlogPipeBrand(title);
}

export function blogExamGeoParts(
  examRaw: string | null | undefined,
  country: BlogCountryContext,
): { examGeo: string; countryWord: string; examPlain: string } {
  const countryWord = country === "US" ? "the United States" : "Canada";
  const e = (examRaw ?? "").trim();
  const u = e.toUpperCase();
  if (!e) {
    const examGeo = country === "US" ? "NCLEX-RN (United States)" : "NCLEX-RN (Canada)";
    return { examGeo, countryWord, examPlain: "NCLEX-RN" };
  }
  if (u.includes("REX") || u.includes("REX-PN")) {
    return { examGeo: "REx-PN (Canada)", countryWord: "Canada", examPlain: "REx-PN" };
  }
  if (u.includes("NCLEX-PN")) {
    return country === "US"
      ? { examGeo: "NCLEX-PN (United States)", countryWord, examPlain: "NCLEX-PN" }
      : { examGeo: "NCLEX-PN (Canada)", countryWord, examPlain: "NCLEX-PN" };
  }
  if (u.includes("CNPLE") || (u.includes("NP") && !u.includes("NCLEX"))) {
    return country === "US"
      ? { examGeo: "US NP exams", countryWord, examPlain: "NP licensure exams" }
      : { examGeo: "CNPLE (Canada)", countryWord, examPlain: "CNPLE" };
  }
  if (u.includes("ALLIED") || e.toLowerCase().includes("allied")) {
    return country === "US"
      ? { examGeo: "Allied health licensing (United States)", countryWord, examPlain: "allied health exams" }
      : { examGeo: "Allied health licensing (Canada)", countryWord, examPlain: "allied health exams" };
  }
  if (u.includes("NCLEX-RN") || u.includes("NCLEX RN")) {
    return country === "US"
      ? { examGeo: "NCLEX-RN (United States)", countryWord, examPlain: "NCLEX-RN" }
      : { examGeo: "NCLEX-RN (Canada)", countryWord, examPlain: "NCLEX-RN" };
  }
  if (u.includes("NCLEX")) {
    return country === "US"
      ? { examGeo: "NCLEX (United States)", countryWord, examPlain: "NCLEX" }
      : { examGeo: "NCLEX (Canada)", countryWord, examPlain: "NCLEX" };
  }
  const examGeo =
    country === "US" ? `${e} (United States)` : `${e} (Canada)`;
  return { examGeo, countryWord, examPlain: e };
}

function resolvedSlugForAutoSeo(params: {
  slug?: string;
  title: string;
  category?: string | null;
}): string {
  if (params.slug?.trim()) return params.slug.trim();
  const topic = (params.category ?? "").trim();
  return slugifyBlogSeoSegment(extractPrimaryKeyword(params.title, topic || undefined));
}

export function blogBrowserTitleForPublicPost(params: {
  seoTitle: string | null | undefined;
  title: string;
  exam: string | null | undefined;
  countryTarget: CountryCode | null | undefined;
  slug?: string;
  category?: string | null;
  tags?: string[];
}): string {
  const manual = params.seoTitle?.trim();
  if (manual && manual.length >= 3) return manual;
  const slug = resolvedSlugForAutoSeo({
    slug: params.slug,
    title: params.title,
    category: params.category,
  });
  return generateBlogSEOFromPostRow({
    title: params.title,
    slug,
    category: params.category ?? null,
    tags: params.tags ?? [],
    exam: params.exam ?? null,
    countryTarget: params.countryTarget ?? null,
  }).seoTitle;
}

/** English-only localized blog titles: same long-tail + exam/geo pattern as default `/blog`. */
export function blogBrowserTitleForLocalizedEnPost(params: {
  localizedMetaTitle: string | null | undefined;
  localizedTitle: string;
  regionSlug: string;
  exam: string;
  locale: string;
}): string | null {
  if (params.locale !== "en") return null;
  const country = blogCountryFromRegionSlug(params.regionSlug);
  const stem = blogKeywordStemFromTitles(params.localizedMetaTitle, params.localizedTitle);
  const { examGeo } = blogExamGeoParts(params.exam, country);
  return `${stem} for ${examGeo} | NurseNest`;
}

export function blogH1ForPublicPost(params: {
  seoTitle: string | null | undefined;
  title: string;
  slug?: string;
  category?: string | null;
  tags?: string[];
  exam?: string | null;
  countryTarget?: CountryCode | null;
}): string {
  const fromSeo = params.seoTitle?.trim();
  if (fromSeo) return stripBlogVagueTailWords(stripBlogPipeBrand(fromSeo));
  if (params.slug || params.exam !== undefined) {
    const slug = resolvedSlugForAutoSeo({
      slug: params.slug,
      title: params.title,
      category: params.category,
    });
    return generateBlogSEOFromPostRow({
      title: params.title,
      slug,
      category: params.category ?? null,
      tags: params.tags ?? [],
      exam: params.exam ?? null,
      countryTarget: params.countryTarget ?? null,
    }).h1;
  }
  return blogKeywordStemFromTitles(null, params.title);
}

export function blogOfferingForCat(examRaw: string | null | undefined): CountryExamOfferingId {
  const e = (examRaw ?? "").trim();
  const u = e.toUpperCase();
  if (u.includes("ALLIED") || e.toLowerCase().includes("allied")) return "allied";
  if (u.includes("CNPLE") || (u.includes("NP") && !u.includes("NCLEX"))) return "np";
  if (u.includes("REX") || u.includes("REX-PN") || u.includes("NCLEX-PN") || u.includes("PN")) return "pn";
  return "rn";
}

export function marketingRegionToggleForCat(country: BlogCountryContext): "US" | "CA" {
  return country === "US" ? "US" : "CA";
}

export function blogStudyAnchorTargets(params: {
  exam: string | null | undefined;
  countryTarget: CountryCode | null | undefined;
}): { practiceQuestionsHref: string; adaptiveCatHref: string; flashcardsHref: string } {
  const country = blogCountryFromPrismaTarget(params.countryTarget);
  const hubs = marketingStudyHubsForBlogExam(params.exam ?? "", country);
  const region = marketingRegionToggleForCat(country);
  const offering = blogOfferingForCat(params.exam);
  return {
    practiceQuestionsHref: hubs.questionBankHub,
    adaptiveCatHref: publicMarketingCatHrefForOffering(region, offering),
    flashcardsHref: HUB.flashcards,
  };
}

export function blogStudyAnchorTargetsForLocalizedRegion(params: {
  exam: string;
  regionSlug: string;
}): { practiceQuestionsHref: string; adaptiveCatHref: string; flashcardsHref: string } {
  const country = blogCountryFromRegionSlug(params.regionSlug);
  const hubs = marketingStudyHubsForBlogExam(params.exam, country);
  const region = marketingRegionToggleForCat(country);
  const offering = blogOfferingForCat(params.exam);
  return {
    practiceQuestionsHref: hubs.questionBankHub,
    adaptiveCatHref: publicMarketingCatHrefForOffering(region, offering),
    flashcardsHref: HUB.flashcards,
  };
}

export function blogSeoLeadSentence(params: {
  keywordStem: string;
  examPlain: string;
  countryWord: string;
}): string {
  return `If you are preparing for ${params.examPlain} in ${params.countryWord}, this walkthrough focuses on ${params.keywordStem}: how the item is framed, what clinical judgment looks like, and how to avoid common trap answers.`;
}

export function blogExamFramingHtml(params: {
  keywordStem: string;
  examGeo: string;
  examPlain: string;
  bodyHtml: string;
}): string | null {
  if (countWordsFromHtml(params.bodyHtml) >= 800) return null;
  const { keywordStem, examGeo, examPlain } = params;
  return `
<section class="nn-blog-exam-framing rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,transparent)] p-5 sm:p-6 not-prose" aria-labelledby="nn-blog-why-nclex">
<h2 id="nn-blog-why-nclex" class="text-lg font-semibold text-[var(--theme-heading-text)]">Why this appears on ${examPlain}</h2>
<p class="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)]">Writers for ${examGeo} often probe whether you can connect pathophysiology, monitoring, and safe interventions. Questions that sound narrow still reward the same big ideas: airway, oxygenation, perfusion, infection control, and therapeutic monitoring.</p>
<h2 class="mt-6 text-lg font-semibold text-[var(--theme-heading-text)]">How to answer this type of question</h2>
<p class="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)]">Start by restating what the stem is truly asking about <strong>${keywordStem}</strong>, eliminate options that are unsafe or out of scope for the setting, then pick the choice that best balances urgency, monitoring, and escalation. When two answers feel partly right, choose the one that addresses the primary risk first.</p>
<h2 class="mt-6 text-lg font-semibold text-[var(--theme-heading-text)]">Common mistakes</h2>
<p class="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)]">Avoid picking an answer only because it sounds familiar; watch for absolutes, premature discharge, and interventions that skip assessment. For ${examPlain}-style items, double-check whether the scenario is stable enough for the proposed action or whether you should stabilize first.</p>
</section>`.trim();
}

export type BlogFaqPair = { q: string; a: string };

export function mergeBlogFaqItemsForPublicPage(
  existing: BlogFaqPair[],
  ctx: { keywordStem: string; examPlain: string; countryWord: string },
): BlogFaqPair[] {
  const norm = (s: string) => s.trim().toLowerCase();
  const seen = new Set(existing.map((x) => norm(x.q)));
  const out: BlogFaqPair[] = existing.map((x) => ({ q: x.q.trim(), a: x.a.trim() })).filter((x) => x.q && x.a);

  const candidates: BlogFaqPair[] = [
    {
      q: `What should I memorize about ${ctx.keywordStem} for ${ctx.examPlain}?`,
      a: `Focus on the decision rules the exam rewards: assessment first, red flags that change management, and the safest default when information is incomplete. Pair reading with ${ctx.examPlain} practice so recognition stays fast under time pressure.`,
    },
    {
      q: `How is ${ctx.keywordStem} usually tested on ${ctx.examPlain}?`,
      a: `Expect prioritization, therapeutic monitoring, and patient education tied to real bedside scenarios. Use practice NCLEX questions and an adaptive NCLEX test to rehearse the same judgment sequence you will use on exam day.`,
    },
    {
      q: `What is a common trap when answering questions about ${ctx.keywordStem}?`,
      a: `A tempting but unsafe shortcut—treating a symptom without confirming stability, or choosing a textbook-perfect plan that ignores the stem constraints. Slow down, underline what is unique in the vignette, then pick the option that matches the scenario in ${ctx.countryWord}.`,
    },
    {
      q: `Where should I drill after reading about ${ctx.keywordStem}?`,
      a: `Move into NCLEX flashcards for spaced recall, then short question sets that mix this topic with related systems so you are not studying in isolation.`,
    },
  ];

  for (const c of candidates) {
    if (out.length >= 5) break;
    const k = norm(c.q);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(c);
  }
  return out.slice(0, 5);
}
