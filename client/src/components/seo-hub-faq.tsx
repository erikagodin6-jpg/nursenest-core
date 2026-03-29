import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

interface SeoHubFAQProps {
  items: FAQItem[];
  title?: string;
  className?: string;
}

export function SeoHubFAQ({ items, title = "Frequently Asked Questions", className = "" }: SeoHubFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <section className={`${className}`} data-testid="seo-hub-faq">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-primary" />
        {title}
      </h2>
      <div className="space-y-3" data-testid="faq-list">
        {items.map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white"
            data-testid={`faq-item-${i}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              data-testid={`button-faq-${i}`}
            >
              <span className="font-medium text-gray-800 pr-4">{item.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-gray-600 border-t border-gray-100 pt-3 text-sm leading-relaxed" data-testid={`faq-answer-${i}`}>
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function buildFAQJsonLd(items: FAQItem[]) {
  if (!items || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  reviewedBy,
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  reviewedBy?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: { "@type": "Organization", name: "NurseNest" },
    publisher: {
      "@type": "Organization",
      name: "NurseNest",
      url: "https://www.nursenest.ca",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(reviewedBy && {
      reviewedBy: { "@type": "Person", name: reviewedBy },
    }),
  };
}

export function buildMedicalWebPageJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  reviewedBy,
  medicalAudience,
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  reviewedBy?: string;
  medicalAudience?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: title,
    description,
    url,
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(reviewedBy && {
      reviewedBy: { "@type": "Person", name: reviewedBy },
    }),
    ...(medicalAudience && {
      audience: { "@type": "MedicalAudience", audienceType: medicalAudience },
    }),
    publisher: {
      "@type": "Organization",
      name: "NurseNest",
      url: "https://www.nursenest.ca",
    },
  };
}
