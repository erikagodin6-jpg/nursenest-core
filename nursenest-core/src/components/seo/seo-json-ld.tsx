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

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: page.h1, item: url },
    ],
  };

  const learningResource = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: page.h1,
    description: page.description,
    url,
    educationalLevel: "Professional nursing and allied health",
    learningResourceType: "Study guide",
    isAccessibleForFree: false,
    provider: { "@id": ORG_ID },
  };

  const nodes: Record<string, unknown>[] = [breadcrumb, learningResource];

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
