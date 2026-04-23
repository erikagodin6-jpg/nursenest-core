/**
 * Deterministic blog SEO strings for public pages and publish checks.
 * No network calls; safe for SSR and validation.
 */

import { CountryCode } from "@prisma/client";
import { blogCountryFromPrismaTarget, marketingStudyHubsForBlogExam } from "@/lib/blog/blog-study-cta";
import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";
import { absoluteUrl } from "@/lib/seo/site-origin";

const BRAND = " | NurseNest";
const VAGUE_WORDS =
  /\b(guide|guides|learn|learning|tutorial|tutorials|tips|tip|overview|walkthrough|everything you need|deep dive)\b/gi;

export type BlogSeoExam = "NCLEX-RN" | "REx-PN" | "NP";
export type BlogSeoCountry = "Canada" | "United States";

export type GenerateBlogSEOInput = {
  title: string;
  topic: string;
  exam: BlogSeoExam;
  country: BlogSeoCountry;
  /** DB slug or proposed slug (kebab-case). */
  existingSlug?: string;
  /** Canonical pathname (default `/blog/{slug}`). */
  canonicalPath?: string;
};

export type GeneratedBlogSeoFaqItem = { question: string; answer: string };

export type GeneratedBlogSeoBreadcrumb = { label: string; href: string };

export type GeneratedBlogSEO = {
  seoTitle: string;
  metaDescription: string;
  slug: string;
  h1: string;
  intro: string;
  faq: GeneratedBlogSeoFaqItem[];
  breadcrumbs: GeneratedBlogSeoBreadcrumb[];
  canonicalPath: string;
};

export function normalizeExamForBlogSeo(exam: string | null | undefined): BlogSeoExam {
  const u = (exam ?? "").toUpperCase();
  if (u.includes("REX") || u.includes("REX-PN") || u.includes("REX PN")) return "REx-PN";
  if (
    u.includes("NP") ||
    u.includes("CNPLE") ||
    u.includes("FNP") ||
    u.includes("PMHNP") ||
    u.includes("ANCC") ||
    u.includes("AANP") ||
    u.includes("AGPCNP")
  ) {
    return "NP";
  }
  return "NCLEX-RN";
}

export function normalizeCountryForBlogSeo(ct: CountryCode | null | undefined): BlogSeoCountry {
  if (ct === CountryCode.CA) return "Canada";
  return "United States";
}

export function stripBrandAndVagueFromTitle(raw: string): string {
  let s = raw.replace(/\s*\|\s*NurseNest\s*$/i, "").trim();
  s = s.replace(VAGUE_WORDS, " ").replace(/\s+/g, " ").trim();
  return s.replace(/^[\s\-–—:]+|[\s\-–—:]+$/g, "").trim();
}

/** Primary keyword phrase (first segment of title, de-vagued). */
export function extractPrimaryKeyword(title: string, topic?: string): string {
  const cleaned = stripBrandAndVagueFromTitle(title);
  const t = (topic ?? "").trim();
  if (t.length >= 3 && t.length <= 120 && !cleaned.toLowerCase().includes(t.toLowerCase())) {
    return `${cleaned} — ${t}`.replace(/\s+/g, " ").trim().slice(0, 120);
  }
  return cleaned.slice(0, 120) || "Nursing exam prep";
}

export function slugifyBlogSeoSegment(input: string): string {
  const s = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s.length >= 3 ? s.slice(0, 96) : "nursing-exam-prep";
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidBlogSlug(slug: string): boolean {
  return slug.length >= 3 && slug.length <= 120 && SLUG_RE.test(slug);
}

function buildSeoTitle(keyword: string, exam: BlogSeoExam, country: BlogSeoCountry): string {
  /** trimEnd only: leading space before `for` must survive so titles do not glue to `for`. */
  const suffix = ` for ${exam} (${country})${BRAND}`.replace(/\s+/g, " ").trimEnd();
  const max = 60;
  const k = keyword.trim();
  if (`${k}${suffix}`.length <= max) return `${k}${suffix}`;
  let base = k;
  while (`${base}${suffix}`.length > max) {
    const sp = base.lastIndexOf(" ");
    if (sp <= 8) {
      base = base.slice(0, Math.max(8, max - suffix.length)).trim();
      break;
    }
    base = base.slice(0, sp).trim();
  }
  return `${base}${suffix}`;
}

function buildMetaDescription(keyword: string, country: BlogSeoCountry): string {
  const region = country === "Canada" ? "Canadian" : "US";
  const base = `Practice ${keyword} with clear explanations and exam-focused strategies for ${region} nursing exams.`;
  const out = base.replace(/\s+/g, " ").trim();
  if (out.length >= 140) return out.slice(0, 155);
  const pad = ` Build confidence with NurseNest.`.replace(/\s+/g, " ");
  return (out + pad).slice(0, 155);
}

function buildH1(keyword: string, exam: BlogSeoExam): string {
  return `${keyword} (${exam} exam explanation)`.replace(/\s+/g, " ").trim();
}

function buildIntro(keyword: string, exam: BlogSeoExam, country: BlogSeoCountry): string {
  const c = country === "Canada" ? "Canada" : "the United States";
  return (
    `${keyword} shows up often on ${exam} because it tests clinical judgment, not memorization alone. ` +
    `This article is written for nursing candidates in ${c}, with exam-style framing you can apply under pressure. ` +
    `Use it alongside practice so the concept sticks when the wording shifts.`
  ).replace(/\s+/g, " ").trim();
}

function defaultFaqs(keyword: string, exam: BlogSeoExam, country: BlogSeoCountry): GeneratedBlogSeoFaqItem[] {
  const c = country === "Canada" ? "Canada" : "the US";
  return [
    {
      question: `What is ${keyword} on ${exam}?`,
      answer: `It is a high-yield concept exam writers use to test prioritization and safety for nurses preparing in ${c}.`,
    },
    {
      question: `How should I study ${keyword} for ${exam}?`,
      answer: `Pair a tight mental model with practice questions so you recognize the pattern when the stem changes.`,
    },
    {
      question: `Why does ${keyword} matter for Canadian nursing exams?`,
      answer: `Canadian pathways still reward NCLEX-style clinical reasoning; linking ideas to practice reduces surprises on test day.`,
    },
    {
      question: `What mistakes do students make on ${keyword} questions?`,
      answer: `They pick an answer that sounds right without ruling out unsafe options or missing a timing clue in the stem.`,
    },
    {
      question: `Where can I practice ${exam} questions after reading this?`,
      answer: `Use NurseNest practice questions, adaptive tests, and flashcards to reinforce the same decision rules.`,
    },
  ];
}

function examHubHref(rawExam: string | null | undefined, countryTarget: CountryCode | null | undefined): string {
  const hubs = marketingStudyHubsForBlogExam(rawExam ?? "", blogCountryFromPrismaTarget(countryTarget));
  return hubs.practiceProgrammatic ?? hubs.lessonsHub;
}

function examHubFromNormalized(exam: BlogSeoExam, country: BlogSeoCountry): string {
  const raw = exam === "NP" ? "NP" : exam === "REx-PN" ? "REX-PN" : "NCLEX-RN";
  const ct = country === "Canada" ? CountryCode.CA : CountryCode.US;
  return examHubHref(raw, ct);
}

/**
 * Public blog SEO bundle from editorial title + taxonomy.
 * `canonicalPath` defaults to `/blog/{slug}` using `existingSlug` or a slug derived from the keyword.
 */
export function generateBlogSEO(input: GenerateBlogSEOInput): GeneratedBlogSEO {
  const topic = (input.topic ?? "").trim();
  const keyword = extractPrimaryKeyword(input.title, topic || undefined);
  const slugFromInput = input.existingSlug?.trim();
  const slug =
    slugFromInput && isValidBlogSlug(slugFromInput) ? slugFromInput : slugifyBlogSeoSegment(keyword);
  const canonicalPath =
    (input.canonicalPath?.trim().replace(/\/+$/, "") || `/blog/${slug}`) || `/blog/${slug}`;

  const seoTitle = buildSeoTitle(keyword, input.exam, input.country);
  const metaDescription = buildMetaDescription(keyword, input.country);
  const h1 = buildH1(keyword, input.exam);
  const intro = buildIntro(keyword, input.exam, input.country);
  const faq = defaultFaqs(keyword, input.exam, input.country);

  const examRowLabel = `${input.exam} (${input.country})`;
  const examRowHref = examHubFromNormalized(input.exam, input.country);

  const topicLabel = topic.length >= 2 ? topic : "Blog";
  const topicHref = topic.length >= 2 ? `/blog/tag/${encodeURIComponent(topic)}` : "/blog";

  const breadcrumbs: GeneratedBlogSeoBreadcrumb[] = [
    { label: "Home", href: "/" },
    { label: examRowLabel, href: examRowHref },
    { label: topicLabel, href: topicHref },
    { label: h1.slice(0, 140), href: canonicalPath },
  ];

  return {
    seoTitle,
    metaDescription,
    slug,
    h1,
    intro,
    faq,
    breadcrumbs,
    canonicalPath,
  };
}

/** Map a published {@link BlogPost} row to generator input (default canonical `/blog/{slug}`). */
export function generateBlogSEOFromPostRow(
  post: {
    title: string;
    slug: string;
    category?: string | null;
    tags?: string[];
    exam?: string | null;
    countryTarget?: CountryCode | null;
  },
  opts?: { canonicalPath?: string },
): GeneratedBlogSEO {
  const topic = (post.category ?? "").trim() || (post.tags?.find((t) => t.trim().length >= 2) ?? "").trim();
  const canonicalPath = opts?.canonicalPath?.trim().replace(/\/+$/, "") || `/blog/${post.slug}`;
  return generateBlogSEO({
    title: post.title,
    topic,
    exam: normalizeExamForBlogSeo(post.exam),
    country: normalizeCountryForBlogSeo(post.countryTarget),
    existingSlug: post.slug,
    canonicalPath,
  });
}

export function mergeFaqForSchema(
  stored: { q: string; a: string }[],
  generated: GeneratedBlogSeoFaqItem[],
  opts?: { max?: number },
): { question: string; answer: string }[] {
  const max = opts?.max ?? 5;
  const merged: { question: string; answer: string }[] = [];
  const seen = new Set<string>();
  const push = (q: string, a: string) => {
    const qt = q.trim();
    const at = a.trim();
    if (!qt || !at) return;
    const k = qt.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    merged.push({ question: qt, answer: at });
  };
  for (const s of stored) push(s.q, s.a);
  for (const g of generated) push(g.question, g.answer);
  return merged.slice(0, max);
}

export function autoBreadcrumbsToCrumbs(rows: GeneratedBlogSeoBreadcrumb[]): BreadcrumbCrumb[] {
  return rows.map((r, i, arr) => ({
    name: r.label,
    href: i === arr.length - 1 ? undefined : r.href,
  }));
}

export function autoBreadcrumbsToSchemaItems(rows: GeneratedBlogSeoBreadcrumb[]): BreadcrumbSchemaItem[] {
  return rows.map((r) => ({
    name: r.label,
    item: absoluteUrl(r.href),
  }));
}

export type StudyLinkAnchors = { practice: string; adaptive: string; flashcards: string };

export function studyLinkAnchorsForExam(exam: BlogSeoExam): StudyLinkAnchors {
  if (exam === "NP") {
    return {
      practice: "practice NP exam questions",
      adaptive: "adaptive NP practice test",
      flashcards: "NP flashcards",
    };
  }
  if (exam === "REx-PN") {
    return {
      practice: "practice REx-PN questions",
      adaptive: "adaptive REx-PN practice test",
      flashcards: "REx-PN flashcards",
    };
  }
  return {
    practice: "practice NCLEX questions",
    adaptive: "adaptive NCLEX test",
    flashcards: "NCLEX flashcards",
  };
}
