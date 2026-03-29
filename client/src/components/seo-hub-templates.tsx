import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { SeoHubCTA, MedicallyReviewedBlock, ReferencesSection, PracticeQuestionPreview, TrustCopyBlock } from "@/components/seo-hub-cta";
import { SeoHubFAQ, buildFAQJsonLd, buildArticleJsonLd, buildMedicalWebPageJsonLd } from "@/components/seo-hub-faq";
import { SeoHubRelatedArticles, SeoHubInternalLinks } from "@/components/seo-hub-related";
import type { SeoHubPage } from "@shared/schema";

import { useI18n } from "@/lib/i18n";
const SITE_DOMAIN = "https://www.nursenest.ca";

const TIER_CONFIG: Record<string, { label: string; hub: string; hubTitle: string; audience: string }> = {
  "rex-pn": { label: "REx-PN", hub: "/rex-pn", hubTitle: "REx-PN Exam Prep", audience: "Practical Nurse Candidates" },
  "nclex-rn": { label: "NCLEX-RN", hub: "/nclex-rn", hubTitle: "NCLEX-RN Exam Prep", audience: "RN Candidates" },
  "np-exam": { label: "NP Exam", hub: "/np-exam-prep", hubTitle: "NP Exam Prep", audience: "Nurse Practitioner Candidates" },
};

interface ContentSection {
  heading: string;
  content: string | string[];
  type?: string;
}

function parseSections(raw: any): ContentSection[] {

  if (!raw) return [];
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return Array.isArray(raw) ? raw : [];
}

function parseArray(raw: any): any[] {
  if (!raw) return [];
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return Array.isArray(raw) ? raw : [];
}

function renderContentSection(section: ContentSection, index: number) {
  const content = Array.isArray(section.content) ? section.content : [section.content];

  return (
    <section key={index} id={`section-${index}`} className="scroll-mt-24" data-testid={`content-section-${index}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
      <div className="space-y-3 text-gray-700 leading-relaxed">
        {content.map((paragraph, pi) => (
          <p key={pi}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

type SeoHubPageInput = {
  [K in keyof SeoHubPage]: SeoHubPage[K] extends Date | null ? Date | string | null : SeoHubPage[K];
};

interface SeoHubTemplateProps {
  page: SeoHubPageInput;
  previewQuestions?: any[];
  relatedPages?: { title: string; href: string; type?: string; description?: string }[];
  siblingPages?: { title: string; href: string; type?: string }[];
}

function toDateString(val: Date | string | null | undefined): string | undefined {
  if (!val) return undefined;
  if (typeof val === "string") return val;
  return val.toISOString();
}

export function SeoHubPageTemplate({ page, previewQuestions, relatedPages, siblingPages }: SeoHubTemplateProps) {
  const tierConfig = TIER_CONFIG[page.tier] || TIER_CONFIG["nclex-rn"];
  const sections = parseSections(page.contentSections);
  const faqItems = parseArray(page.faqItems);
  const references = parseArray(page.references);
  const internalLinks = parseArray(page.internalLinks);

  const canonicalPath = `/${page.slug}`;
  const fullUrl = `${SITE_DOMAIN}${canonicalPath}`;

  const isConditionOrMed = ["condition", "medication", "lab-value"].includes(page.pageType);
  const structuredDataType = page.structuredDataType || (isConditionOrMed ? "MedicalWebPage" : "Article");

  const mainStructuredData = structuredDataType === "MedicalWebPage"
    ? buildMedicalWebPageJsonLd({
        title: page.metaTitle || page.title,
        description: page.metaDescription || "",
        url: fullUrl,
        datePublished: toDateString(page.publishedAt) || page.lastUpdatedDate || undefined,
        dateModified: page.lastUpdatedDate || undefined,
        reviewedBy: page.medicallyReviewedBy || undefined,
        medicalAudience: tierConfig.audience,
      })
    : buildArticleJsonLd({
        title: page.metaTitle || page.title,
        description: page.metaDescription || "",
        url: fullUrl,
        datePublished: toDateString(page.publishedAt) || page.lastUpdatedDate || undefined,
        dateModified: page.lastUpdatedDate || undefined,
        reviewedBy: page.medicallyReviewedBy || undefined,
      });

  const faqJsonLd = buildFAQJsonLd(faqItems);
  const additionalStructuredData = faqJsonLd ? [faqJsonLd] : [];

  const breadcrumbs = [
    { name: "Home", url: `${SITE_DOMAIN}/` },
    { name: tierConfig.hubTitle, url: `${SITE_DOMAIN}${tierConfig.hub}` },
    { name: page.h1 || page.title, url: fullUrl },
  ];

  const parentHub = { title: tierConfig.hubTitle, href: tierConfig.hub };
  const questionBankLink = { title: `${tierConfig.label} Practice Questions`, href: `/free-practice` };

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
      <SEO
        title={page.metaTitle || page.title}
        description={page.metaDescription || ""}
        keywords={(page.metaKeywords || []).join(", ")}
        canonicalPath={canonicalPath}
        structuredData={mainStructuredData}
        additionalStructuredData={additionalStructuredData}
        breadcrumbs={breadcrumbs}
      />
      <Navigation />

      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNav items={breadcrumbs} />

          <div className="mt-6 mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4" data-testid="text-hub-h1">
              {page.h1 || page.title}
            </h1>
            {page.metaDescription && (
              <p className="text-lg text-gray-600 max-w-3xl leading-relaxed" data-testid="text-hub-description">
                {page.metaDescription}
              </p>
            )}
          </div>

          <SeoHubCTA tier={page.tier} variant="above-fold" />

          <div className="flex flex-col lg:flex-row gap-8 mt-10">
            <div className="flex-1 min-w-0">
              <div className="space-y-8" data-testid="hub-content-sections">
                {sections.map((section, i) => renderContentSection(section, i))}
              </div>

              {sections.length > 2 && (
                <div className="my-10">
                  <SeoHubCTA tier={page.tier} variant="mid-page" />
                </div>
              )}

              {previewQuestions && previewQuestions.length > 0 && (
                <div className="my-10">
                  <PracticeQuestionPreview questions={previewQuestions} tier={page.tier} />
                </div>
              )}

              {page.medicallyReviewedBy && (
                <div className="my-8">
                  <MedicallyReviewedBlock
                    reviewerName={page.medicallyReviewedBy}
                    reviewDate={toDateString(page.medicallyReviewedAt)?.split("T")[0]}
                    lastUpdated={page.lastUpdatedDate || undefined}
                  />
                </div>
              )}

              <ReferencesSection references={references} />

              {faqItems.length > 0 && (
                <div className="mt-10">
                  <SeoHubFAQ items={faqItems} />
                </div>
              )}

              {relatedPages && relatedPages.length > 0 && (
                <div className="mt-10">
                  <SeoHubRelatedArticles articles={relatedPages} />
                </div>
              )}
            </div>

            <aside className="lg:w-72 shrink-0">
              <div className="sticky top-24 space-y-4">
                <SeoHubInternalLinks
                  parentHub={parentHub}
                  siblings={siblingPages}
                  questionBankLink={questionBankLink}
                  storedLinks={internalLinks}
                />

                {sections.length > 1 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4" data-testid="table-of-contents">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("components.seoHubTemplates.onThisPage")}</h3>
                    <ul className="space-y-1.5">
                      {sections.map((s, i) => (
                        <li key={i}>
                          <a
                            href={`#section-${i}`}
                            className="text-sm text-gray-600 hover:text-primary transition-colors block"
                            data-testid={`link-toc-${i}`}
                          >
                            {s.heading}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <TrustCopyBlock />
              </div>
            </aside>
          </div>
        </div>

        <SeoHubCTA
          tier={page.tier}
          variant="end-of-page"
          headline={`Ready to Pass the ${tierConfig.label}?`}
          subtitle={`Join thousands of nursing students using NurseNest for ${tierConfig.label} preparation.`}
        />
      </main>

      <Footer />
    </div>
  );
}

export function ConditionPageTemplate(props: SeoHubTemplateProps) {
  return <SeoHubPageTemplate {...props} />;
}

export function LabValuePageTemplate(props: SeoHubTemplateProps) {
  return <SeoHubPageTemplate {...props} />;
}

export function MedicationPageTemplate(props: SeoHubTemplateProps) {
  return <SeoHubPageTemplate {...props} />;
}

export function ComparisonPageTemplate(props: SeoHubTemplateProps) {
  return <SeoHubPageTemplate {...props} />;
}

export function StrategyPageTemplate(props: SeoHubTemplateProps) {
  return <SeoHubPageTemplate {...props} />;
}

export function QuestionBankLandingTemplate(props: SeoHubTemplateProps) {
  return <SeoHubPageTemplate {...props} />;
}
