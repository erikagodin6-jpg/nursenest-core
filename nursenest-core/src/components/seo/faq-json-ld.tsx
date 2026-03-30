export type FaqJsonLdItem = {
  question: string;
  answer: string;
};

/**
 * schema.org FAQPage for indexable marketing surfaces.
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
export function FaqJsonLd({ items }: { items: FaqJsonLdItem[] }) {
  if (items.length === 0) return null;

  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD is safe static output
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
