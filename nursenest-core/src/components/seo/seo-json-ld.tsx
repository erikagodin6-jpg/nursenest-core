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

export function OrganizationJsonLd() {
  return (
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
