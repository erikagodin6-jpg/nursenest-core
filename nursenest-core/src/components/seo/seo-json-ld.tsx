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
        name: "NurseNest",
        url: absoluteUrl("/"),
        publisher: { "@id": ORG_ID },
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
}: {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  coverImage?: string | null;
}) {
  const url = absoluteUrl(`/blog/${slug}`);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        datePublished,
        url,
        mainEntityOfPage: url,
        publisher: { "@id": ORG_ID },
        ...(coverImage ? { image: coverImage } : {}),
      }}
    />
  );
}

export function ProgrammaticPageJsonLd({
  page,
  locale,
}: {
  page: SeoPageDefinition;
  locale: string;
}) {
  const url =
    locale === DEFAULT_MARKETING_LOCALE
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
