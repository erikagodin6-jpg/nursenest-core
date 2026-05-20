import { headers } from "next/headers";
import { shouldEmitMarketingLayoutBreadcrumbFallback } from "@/lib/breadcrumbs/layout-fallback-policy";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";
import { isValidPublicUrl } from "@/lib/seo/public-url-validator";
import { absoluteUrl } from "@/lib/seo/site-origin";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const ORG_ID = `${absoluteUrl("/")}#organization`;
const WEBSITE_ID = `${absoluteUrl("/")}#website`;

const BREADCRUMB_LABEL_OVERRIDES: Record<string, string> = {
  about: "About",
  allied: "Allied health",
  "allied-health": "Allied health",
  blog: "Blog",
  canada: "Canada",
  cat: "CAT exam",
  cnple: "CNPLE",
  "cnple-simulation-exam": "CNPLE simulation exam",
  "cnple-vs-cnpe": "CNPLE vs CNPE",
  ecg: "ECG",
  exams: "Exams",
  faq: "FAQ",
  flashcards: "Flashcards",
  hesi: "HESI",
  "hesi-a2": "HESI A2",
  "new-grad": "New grad",
  nclex: "NCLEX",
  "nclex-rn": "NCLEX-RN",
  np: "NP",
  pn: "PN",
  practice: "Practice",
  "practice-exams": "Practice exams",
  "practice-tests": "Practice tests",
  pricing: "Pricing",
  questions: "Practice questions",
  rex: "REx-PN",
  "rex-pn": "REx-PN",
  rn: "RN",
  rpn: "RPN",
  simulation: "Simulation",
  simulations: "Simulations",
  "study-plan": "Study plan",
  teas: "TEAS",
  tools: "Tools",
  us: "United States",
};

const MARKETING_BREADCRUMB_SKIP_SEGMENTS = new Set(["default"]);

function titleCaseSegment(segment: string): string {
  const clean = decodeURIComponent(segment)
    .replace(/^\/+|\/+$/g, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return "Page";

  const override = BREADCRUMB_LABEL_OVERRIDES[clean.toLowerCase()];
  if (override) return override;

  return clean
    .split(" ")
    .map((word) => {
      if (/^[A-Z0-9]{2,}$/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function normalizeMarketingPathname(rawPathname: string | null): string {
  const pathname = (rawPathname ?? "/").split("?")[0]?.split("#")[0]?.trim() || "/";
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const withoutTrailingSlash = withLeadingSlash !== "/" ? withLeadingSlash.replace(/\/+$/g, "") : "/";
  return withoutTrailingSlash.replace(/\/{2,}/g, "/");
}

function buildMarketingBreadcrumbJsonLdForPathname(rawPathname: string | null): Record<string, unknown> | null {
  const pathname = normalizeMarketingPathname(rawPathname);
  if (pathname === "/") return null;

  const lowerPath = pathname.toLowerCase();
  if (
    lowerPath === "/app" ||
    lowerPath.startsWith("/app/") ||
    lowerPath === "/api" ||
    lowerPath.startsWith("/api/") ||
    lowerPath === "/admin" ||
    lowerPath.startsWith("/admin/") ||
    lowerPath.startsWith("/_next/")
  ) {
    return null;
  }

  const segments = pathname
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .filter((segment) => !MARKETING_BREADCRUMB_SKIP_SEGMENTS.has(segment.toLowerCase()));

  if (segments.length === 0) return null;

  const items: { name: string; item: string }[] = [{ name: "Home", item: absoluteUrl("/") }];
  let cumulativePath = "";

  for (const segment of segments) {
    cumulativePath += `/${segment}`;
    const url = absoluteUrl(cumulativePath);
    const validation = isValidPublicUrl(url);
    if (!validation.ok) {
      safeServerLog("seo", "marketing_fallback_breadcrumb_item_rejected", {
        pathname: pathname.slice(0, 400),
        segment: segment.slice(0, 120),
        url: url.slice(0, 500),
        code: validation.code,
        detail: (validation.detail ?? "").slice(0, 200),
      });
      continue;
    }
    items.push({ name: titleCaseSegment(segment), item: url });
  }

  if (items.length < 2) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

async function MarketingFallbackBreadcrumbJsonLd() {
  try {
    const headerList = await headers();
    const pathname = headerList.get("x-nn-request-pathname") ?? headerList.get("x-pathname") ?? null;
    if (!shouldEmitMarketingLayoutBreadcrumbFallback(pathname)) return null;
    const data = buildMarketingBreadcrumbJsonLdForPathname(pathname);
    if (!data) return null;
    return <JsonLd data={data} />;
  } catch (error) {
    safeServerLog("seo", "marketing_fallback_breadcrumb_failed", {
      error: error instanceof Error ? error.message.slice(0, 300) : String(error).slice(0, 300),
    });
    return null;
  }
}

export async function OrganizationJsonLd() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": ORG_ID,
          name: "NurseNest",
          url: absoluteUrl("/"),
          description:
            "Canada-first nursing and allied health exam preparation platform with globally relevant pathways—including NCLEX and US licensing hubs where applicable.",
          sameAs: [] as string[],
        }}
      />
    </>
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: "NurseNest",
        url: absoluteUrl("/"),
        publisher: { "@id": ORG_ID },
        potentialAction: {
          "@type": "SearchAction",
          target: absoluteUrl("/question-bank"),
          "query-input": "required name=topic",
        },
      }}
    />
  );
}

export function WebPageJsonLd({
  title,
  description,
  path,
  inLanguage,
}: {
  title: string;
  description: string;
  path: string;
  inLanguage?: string;
}) {
  const url = absoluteUrl(path);
  const v = isValidPublicUrl(url);
  if (!v.ok) {
    safeServerLog("seo", "webpage_jsonld_rejected", {
      path: path.slice(0, 400),
      url: url.slice(0, 500),
      code: v.code,
      detail: (v.detail ?? "").slice(0, 200),
    });
    return null;
  }
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { "@id": WEBSITE_ID },
        ...(inLanguage ? { inLanguage } : {}),
      }}
    />
  );
}

export function BlogPostingJsonLd({
  slug,
  /** When set, overrides the default `/blog/{slug}` URL (e.g. multilingual `/fr/blog/...`). */
  resourcePath,
  title,
  description,
  datePublished,
  dateModified,
  coverImage,
  keywords,
  articleSection,
  authorName,
  authorJobTitle,
  reviewerName,
  reviewerJobTitle,
  inLanguage,
}: {
  slug: string;
  /** Leading-slash path for this article's public URL. */
  resourcePath?: string;
  title: string;
  description: string;
  datePublished: string;
  /** Prefer `post.updatedAt` when available for freshness signals. */
  dateModified?: string | null;
  coverImage?: string | null;
  /** From SEO bundle / tags — comma-separated in JSON-LD. */
  keywords?: string[];
  articleSection?: string | null;
  /** E-E-A-T: display name when set on BlogPost. */
  authorName?: string | null;
  /** E-E-A-T: credential line (e.g. RN, BSN). */
  authorJobTitle?: string | null;
  /** Optional clinical / editorial reviewer (YMYL). */
  reviewerName?: string | null;
  reviewerJobTitle?: string | null;
  /** BCP47-ish tag for Article/BlogPosting schema. */
  inLanguage?: string;
}) {
  const path =
    resourcePath?.startsWith("/") ? resourcePath : resourcePath ? `/${resourcePath}` : `/blog/${slug}`;
  const url = absoluteUrl(path);
  const kw = keywords?.map((k) => k.trim()).filter(Boolean) ?? [];
  const author =
    authorName?.trim() ?
      {
        "@type": "Person" as const,
        name: authorName.trim(),
        ...(authorJobTitle?.trim() ? { jobTitle: authorJobTitle.trim() } : {}),
      }
    : { "@id": ORG_ID };
  const reviewedBy =
    reviewerName?.trim() ?
      {
        "@type": "Person" as const,
        name: reviewerName.trim(),
        ...(reviewerJobTitle?.trim() ? { jobTitle: reviewerJobTitle.trim() } : {}),
      }
    : undefined;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        datePublished,
        ...(dateModified?.trim() ? { dateModified: dateModified.trim() } : {}),
        ...(inLanguage?.trim() ? { inLanguage: inLanguage.trim() } : {}),
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author,
        ...(reviewedBy ? { reviewedBy } : {}),
        publisher: { "@id": ORG_ID },
        ...(coverImage ? { image: coverImage } : {}),
        ...(kw.length ? { keywords: kw.join(", ") } : {}),
        ...(articleSection?.trim() ? { articleSection: articleSection.trim() } : {}),
      }}
    />
  );
}

/**
 * YMYL nursing education: combines Article + MedicalWebPage + LearningResource for indexable lesson URLs.
 * Dates omitted when only catalog fallback exists (no invented timestamps).
 */
export function PathwayLessonMedicalEducationJsonLd({
  path,
  headline,
  description,
  datePublished,
  dateModified,
  inLanguage = "en",
  aboutOccupation,
}: {
  path: string;
  headline: string;
  description: string;
  datePublished?: string | null;
  dateModified?: string | null;
  inLanguage?: string;
  /** When set (e.g. allied profession track), narrows `about` for duplicate-sensitive SERP clarity. */
  aboutOccupation?: string | null;
}) {
  const url = absoluteUrl(path);
  const occ = aboutOccupation?.trim();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["MedicalWebPage", "Article", "LearningResource"],
        "@id": `${url}#lesson`,
        url,
        name: headline,
        headline,
        description,
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORG_ID },
        author: { "@id": ORG_ID },
        educationalLevel: "Professional nursing and allied health licensure preparation",
        learningResourceType: "Study guide",
        ...(occ
          ? {
              about: {
                "@type": "Occupation",
                name: occ,
              },
            }
          : {}),
        ...(datePublished?.trim() ? { datePublished: datePublished.trim() } : {}),
        ...(dateModified?.trim() ? { dateModified: dateModified.trim() } : {}),
        ...(inLanguage ? { inLanguage } : {}),
      }}
    />
  );
}

export function BlogFaqPageJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  if (!items.length) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}

export function ProgrammaticPageJsonLd({
  page,
  locale,
  /** Leading-slash path when the page is not at `/{slug}` or `/{locale}/{slug}` (e.g. hub long-tail SEO). */
  resourcePath,
}: {
  page: SeoPageDefinition;
  locale: string;
  resourcePath?: string;
}) {
  const path =
    resourcePath?.startsWith("/") ? resourcePath : resourcePath ? `/${resourcePath}` : null;
  const url = path
    ? absoluteUrl(path)
    : locale === DEFAULT_MARKETING_LOCALE
      ? absoluteUrl(`/${page.slug}`)
      : absoluteUrl(`/${locale}/${page.slug}`);

  const learningResource = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: page.h1,
    description: page.description,
    url,
    educationalLevel: "Professional nursing and allied health",
    learningResourceType: "Study guide",
    isAccessibleForFree: Boolean(page.practiceConversion),
    provider: { "@id": ORG_ID },
  };

  /** Breadcrumb JSON-LD is emitted with `BreadcrumbJsonLd` in `programmatic-seo-page.tsx` for crawlable alignment with visible crumbs. */
  const nodes: Record<string, unknown>[] = [learningResource];

  if (page.faq?.length) {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return (
    <>
      {nodes.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
    </>
  );
}
