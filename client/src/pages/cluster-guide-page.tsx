import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useState } from "react";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData, PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import {
  BookOpen, ChevronDown, ArrowRight, ArrowLeft, HelpCircle,
  FileText, Layers, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import {
  getClusterPage,
  getClusterPagesForParent,
  type ClusterPage,
} from "@/data/icu-cluster-data";

function ClusterTableOfContents({ page }: { page: ClusterPage }) {
  const { t } = useI18n();
  const sections = [
    { id: "introduction", title: "Introduction" },
    ...page.sections.map(s => ({ id: s.id, title: s.title })),
    { id: "faq", title: "Frequently Asked Questions" },
    { id: "related-topics", title: "Related Topics" },
  ];

  return (
    <nav className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24" data-testid="nav-cluster-toc">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4" style={{ color: page.color }} /> Table of Contents
      </h3>
      <ul className="space-y-1.5">
        {sections.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors block py-0.5 border-l-2 border-transparent hover:border-gray-400 pl-3"
              data-testid={`toc-link-${item.id}`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <LocaleLink href={`/guides/${page.parentSlug}`}>
          <span className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1" data-testid="link-back-to-parent-toc">
            <ArrowLeft className="w-3 h-3" /> Back to {page.parentTitle}
          </span>
        </LocaleLink>
      </div>
    </nav>
  );
}

export default function ClusterGuidePage() {
  const params = useParams<{ parentSlug: string; clusterSlug: string }>();
  const page = getClusterPage(params.parentSlug || "", params.clusterSlug || "");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!page) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-cluster-not-found">{t("pages.clusterGuidePage.guideNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.clusterGuidePage.theGuideYouAreLooking")}</p>
          <LocaleLink href="/guides">
            <Button data-testid="button-back-to-guides">{t("pages.clusterGuidePage.browseAllGuides")}</Button>
          </LocaleLink>
        </div>
        <Footer />
      </div>
    );
  }

  const faqStructuredData = buildFaqStructuredData(
    page.faqs.map(f => ({ question: f.question, answer: f.answer }))
  );

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "headline": page.title,
    "description": page.metaDescription,
    "author": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
      "parentOrganization": {
        "@type": "EducationalOrganization",
        "name": PARENT_EDUCATIONAL_ORG.name,
        "url": PARENT_EDUCATIONAL_ORG.url,
      },
    },
    "datePublished": "2025-06-01",
    "dateModified": new Date().toISOString().split("T")[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.nursenest.ca/guides/${page.parentSlug}/${page.slug}`,
    },
    "isPartOf": {
      "@type": "WebPage",
      "name": page.parentTitle,
      "url": `https://www.nursenest.ca/guides/${page.parentSlug}`,
    },
    "medicalAudience": {
      "@type": "MedicalAudience",
      "audienceType": "Nurse",
    },
    "specialty": "Nursing",
  };

  const breadcrumbItems = [
    { name: "Home", url: "https://www.nursenest.ca" },
    { name: "Guides", url: "https://www.nursenest.ca/guides" },
    { name: page.parentTitle, url: `https://www.nursenest.ca/guides/${page.parentSlug}` },
    { name: page.title, url: `https://www.nursenest.ca/guides/${page.parentSlug}/${page.slug}` },
  ];

  const siblingPages = getClusterPagesForParent(page.parentSlug);
  const relatedPages = siblingPages.filter(
    p => page.relatedClusterSlugs.includes(p.slug) && p.slug !== page.slug
  );

  return (
    <div className="min-h-screen bg-gray-50" data-testid={`cluster-guide-${page.slug}`}>
      <Navigation />
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/guides/${page.parentSlug}/${page.slug}`}
        structuredData={articleStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={breadcrumbItems}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden" data-testid="section-cluster-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${page.colorAccent}60, white, ${page.colorAccent}30)` }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav items={breadcrumbItems} />
          <div className="mt-4">
            <LocaleLink href={`/guides/${page.parentSlug}`}>
              <span className="inline-flex items-center gap-1 text-sm font-medium hover:underline mb-4" style={{ color: page.color }} data-testid="link-back-to-parent">
                <ArrowLeft className="w-4 h-4" /> {page.parentTitle}
              </span>
            </LocaleLink>
          </div>
          <div className="mt-3 max-w-3xl">
            <Badge className="mb-4 text-white" style={{ backgroundColor: page.color }} data-testid="badge-cluster-type">
              <Layers className="w-3 h-3 mr-1" /> Specialty Deep Dive
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-cluster-title">
              {page.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-cluster-subtitle">
              {page.metaDescription}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <LocaleLink href={`/preview/${page.ctaPreviewSlug}`}>
                <Button className="text-white" style={{ backgroundColor: page.color }} data-testid="button-cluster-hero-practice">
                  Start Practice Questions <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
              <LocaleLink href={`/lessons/${page.ctaLessonsSlug}`}>
                <Button variant="outline" className="border-gray-300" data-testid="button-cluster-hero-lessons">
                  <FileText className="w-4 h-4 mr-2" /> Explore Lessons
                </Button>
              </LocaleLink>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-64 shrink-0">
            <ClusterTableOfContents page={page} />
          </div>

          <div className="flex-1 min-w-0">
            <section id="introduction" className="mb-12 scroll-mt-24" data-testid="section-introduction">
              <p className="text-gray-700 leading-relaxed text-base">{page.introduction}</p>
            </section>

            {page.sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-12 scroll-mt-24" data-testid={`section-${section.id}`}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${page.color}15` }}>
                    <Star className="w-5 h-5" style={{ color: page.color }} />
                  </div>
                  {section.title}
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  {section.content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-sm text-gray-700 leading-relaxed mb-4 last:mb-0">{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <div className="my-8 rounded-xl p-6 text-center" style={{ backgroundColor: `${page.color}10`, borderLeft: `4px solid ${page.color}` }} data-testid="cta-mid-content">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{t("pages.clusterGuidePage.readyToTestYourKnowledge")}</h3>
              <p className="text-sm text-gray-600 mb-4">{t("pages.clusterGuidePage.practiceWithExamstyleQuestionsAnd")}</p>
              <LocaleLink href={`/preview/${page.ctaPreviewSlug}`}>
                <Button className="text-white" style={{ backgroundColor: page.color }} data-testid="button-cta-mid-practice">
                  Start Practice Questions <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
            </div>

            <section id="faq" className="mb-12 scroll-mt-24" data-testid="section-faq">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${page.color}15` }}>
                  <HelpCircle className="w-5 h-5" style={{ color: page.color }} />
                </div>
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    data-testid={`faq-item-${i}`}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                      data-testid={`button-faq-${i}`}
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: page.color }} />
                        <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 pl-12" data-testid={`text-faq-answer-${i}`}>
                        <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {relatedPages.length > 0 && (
              <section id="related-topics" className="mb-12 scroll-mt-24" data-testid="section-related-topics">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t("pages.clusterGuidePage.relatedTopics")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedPages.map((rp) => (
                    <LocaleLink key={rp.slug} href={`/guides/${rp.parentSlug}/${rp.slug}`}>
                      <Card className="h-full hover:shadow-md transition-all cursor-pointer group" data-testid={`card-related-${rp.slug}`}>
                        <CardContent className="p-5">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${rp.color}15` }}>
                            <Layers className="w-5 h-5" style={{ color: rp.color }} />
                          </div>
                          <h3 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-blue-700 transition-colors">
                            {rp.title}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2">{rp.metaDescription}</p>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 mt-3">
                            Read Guide <ArrowRight className="w-3 h-3" />
                          </span>
                        </CardContent>
                      </Card>
                    </LocaleLink>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-10 grid sm:grid-cols-2 gap-4 mb-12">
              <MedicalReviewBadge />
              <MedicalReferences lessonId={page.slug} pageType="critical-care" />
            </div>

            <MedicalReviewJsonLd
              title={page.title}
              slug={page.slug}
              description={page.metaDescription}
              pageUrl={`https://www.nursenest.ca/guides/${page.parentSlug}/${page.slug}`}
            />

            <section className="mb-12" data-testid="section-cluster-back-to-hub">
              <LocaleLink href={`/guides/${page.parentSlug}`}>
                <Card className="hover:shadow-md transition-all cursor-pointer group border-2" style={{ borderColor: `${page.color}30` }}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${page.color}15` }}>
                      <ArrowLeft className="w-6 h-6" style={{ color: page.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{t("pages.clusterGuidePage.returnToTheCompleteGuide")}</p>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors" data-testid="link-back-to-hub">
                        {page.parentTitle}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </LocaleLink>
            </section>

            <EndOfContentLeadCapture leadMagnetType="study_guide" source={`cluster-guide-${page.slug}`} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
