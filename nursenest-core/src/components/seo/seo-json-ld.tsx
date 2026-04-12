import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";
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
          "Healthcare exam preparation platform for nursing and allied health learners in Canada and the United States.",
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
          target: `${absoluteUrl("/")}question-bank`,
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
  title,
  description,
  datePublished,
  coverImage,
  keywords,
  articleSection,
}: {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  coverImage?: string | null;
  /** From SEO bundle / tags — comma-separated in JSON-LD. */
  keywords?: string[];
  articleSection?: string | null;
}) {
  const url = absoluteUrl(`/blog/${slug}`);
  const kw = keywords?.map((k) => k.trim()).filter(Boolean) ?? [];
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        datePublished,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        publisher: { "@id": ORG_ID },
        ...(coverImage ? { image: coverImage } : {}),
        ...(kw.length ? { keywords: kw.join(", ") } : {}),
        ...(articleSection?.trim() ? { articleSection: articleSection.trim() } : {}),
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
