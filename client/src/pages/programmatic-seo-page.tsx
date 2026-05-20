import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  ChevronRight,
  BookOpen,
  Target,
  Stethoscope,
  HelpCircle,
  Link as LinkIcon,
  FileText,
  Brain,
  ClipboardList,
  Layers,
} from "lucide-react";

type ContentSection = { heading: string; content: string };
type FAQ = { q: string; a: string };
type SiblingLink = { pageType: string; label: string; url: string };
type RelatedLink = { label: string; url: string; type: string; careerTrack: string };

type ProgrammaticPageData = {
  id: string;
  pageType: string;
  sourceContentId: string;
  sourceContentType: string;
  careerTrack: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  contentSections: ContentSection[];
  faqJson: FAQ[];
  relatedContentLinks: RelatedLink[];
  siblingLinks: SiblingLink[];
  status: string;
  gatingLevel: string;
};

const PAGE_TYPE_ICONS: Record<string, typeof BookOpen> = {
  "study-guide": BookOpen,
  "exam-tips": Target,
  "clinical-scenarios": Stethoscope,
  "practice-questions": ClipboardList,
  "question-detail": HelpCircle,
  "flashcard-detail": Layers,
};

const PAGE_TYPE_COLORS: Record<string, string> = {
  "study-guide": "bg-blue-100 text-blue-700",
  "exam-tips": "bg-amber-100 text-amber-700",
  "clinical-scenarios": "bg-green-100 text-green-700",
  "practice-questions": "bg-purple-100 text-purple-700",
  "question-detail": "bg-rose-100 text-rose-700",
  "flashcard-detail": "bg-teal-100 text-teal-700",
};

function parseSafe<T>(val: T | string | null, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return val;
}

export default function ProgrammaticSeoPage() {
  const { t } = useI18n();
  const params = useParams<{ careerSlug: string; pageType: string; topicSlug: string }>();
  const [location, navigate] = useLocation();
  const [page, setPage] = useState<ProgrammaticPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pathParts = location.split("/").filter(Boolean);
  const localeOffset = (pathParts[0] && pathParts[0].length === 2 && /^[a-z]{2}$/.test(pathParts[0])) ? 1 : 0;
  const careerSlug = params.careerSlug || pathParts[localeOffset] || "";
  const pageType = params.pageType || pathParts[localeOffset + 1] || "";
  const topicSlug = params.topicSlug || pathParts[localeOffset + 2] || "";

  useEffect(() => {
    if (!careerSlug || !pageType || !topicSlug) return;
    setLoading(true);
    fetch(`/api/programmatic/${careerSlug}/${pageType}/${topicSlug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); setPage(null); }
        else { setPage(data); setError(""); }
      })
      .catch(() => setError("Failed to load page"))
      .finally(() => setLoading(false));
  }, [careerSlug, pageType, topicSlug]);

  if (loading) return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="loading-programmatic">
        <div className="animate-pulse text-gray-400">{t("pages.programmaticSeoPage.loading")}</div>
      </div>
    </>
  );

  if (error || !page) return (
    <>
      <Navigation />
      <SEO
        title={t("pages.programmaticSeoPage.pageNotFound2")}
        description={t("pages.programmaticSeoPage.theRequestedPageCouldNot")}
        noindex={true}
      />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h1 className="text-xl font-bold mb-2" data-testid="heading-error">{t("pages.programmaticSeoPage.pageNotFound")}</h1>
            <p className="text-gray-600 mb-4" data-testid="text-error">{error || "This page could not be found."}</p>
            <Button onClick={() => navigate("/")} data-testid="button-go-home">{t("pages.programmaticSeoPage.goHome")}</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const sections = parseSafe<ContentSection[]>(page.contentSections, []);
  const faqs = parseSafe<FAQ[]>(page.faqJson, []);
  const siblings = parseSafe<SiblingLink[]>(page.siblingLinks, []);
  const related = parseSafe<RelatedLink[]>(page.relatedContentLinks, []);

  const TypeIcon = PAGE_TYPE_ICONS[page.pageType] || FileText;
  const badgeColor = PAGE_TYPE_COLORS[page.pageType] || "bg-gray-100 text-gray-700";

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.metaTitle || page.title,
    description: page.metaDescription || "",
    author: { "@type": "Organization", name: "NurseNest" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.nursenest.ca/${page.slug}` },
  };

  const courseSchema = (page.pageType === "study-guide" || page.pageType === "exam-tips") ? {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": page.title,
    "description": page.metaDescription || "",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
    "courseMode": "online",
    "inLanguage": "en",
    "url": `https://www.nursenest.ca/${page.slug}`,
  } : null;

  const pageTypeLabel = page.pageType.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const careerLabel = page.careerTrack.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <>
      <Navigation />
      <SEO
        title={page.metaTitle || page.title}
        description={page.metaDescription || ""}
        canonicalPath={`/${page.slug}`}
        structuredData={articleSchema}
        additionalStructuredData={[faqSchema, courseSchema].filter((s): s is Record<string, unknown> => s !== null)}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: careerLabel, url: `https://www.nursenest.ca/${page.careerTrack}` },
          { name: pageTypeLabel, url: `https://www.nursenest.ca/${page.careerTrack}/${page.pageType}` },
          { name: page.title, url: `https://www.nursenest.ca/${page.slug}` },
        ]}
      />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap" data-testid="nav-breadcrumb">
            <button onClick={() => navigate("/")} className="hover:text-primary" data-testid="breadcrumb-home">{t("pages.programmaticSeoPage.home")}</button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => navigate(`/${page.careerTrack}`)} className="hover:text-primary" data-testid="breadcrumb-career">{careerLabel}</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-medium" data-testid="breadcrumb-current">{pageTypeLabel}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-72 shrink-0">
              <div className="sticky top-24 space-y-4">
                {siblings.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4" data-testid="section-sibling-nav">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4" /> Related Page Types
                    </h3>
                    <ul className="space-y-1.5">
                      {siblings.map((sib, i) => {
                        const SibIcon = PAGE_TYPE_ICONS[sib.pageType] || FileText;
                        return (
                          <li key={i}>
                            <a
                              href={sib.url}
                              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors py-1"
                              data-testid={`link-sibling-${sib.pageType}`}
                            >
                              <SibIcon className="w-3.5 h-3.5" />
                              {sib.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {sections.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4" data-testid="section-toc">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> On This Page
                    </h3>
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
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`} data-testid="badge-page-type">
                  <TypeIcon className="w-3.5 h-3.5" />
                  {pageTypeLabel}
                </span>
                <Badge variant="outline" className="text-xs" data-testid="badge-career">
                  {careerLabel}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="heading-title">
                {page.title}
              </h1>

              {page.metaDescription && (
                <p className="text-lg text-gray-600 mb-8 leading-relaxed" data-testid="text-description">
                  {page.metaDescription}
                </p>
              )}

              <div className="space-y-8 mb-12" data-testid="section-content">
                {sections.map((section, i) => (
                  <section key={i} id={`section-${i}`} className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2" data-testid={`heading-section-${i}`}>
                      <Brain className="w-5 h-5 text-primary" />
                      {section.heading}
                    </h2>
                    <div className="text-gray-700 leading-relaxed" data-testid={`text-section-${i}`}>
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>

              {faqs.length > 0 && (
                <section id="faq" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid="heading-faq">
                    <HelpCircle className="w-6 h-6 text-primary" /> Frequently Asked Questions
                  </h2>
                  <div className="space-y-3" data-testid="section-faq-list">
                    {faqs.map((faq, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${i}`}>
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                          data-testid={`button-faq-toggle-${i}`}
                        >
                          <span className="font-medium text-gray-800 pr-4">{faq.q}</span>
                          <ChevronRight className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                        </button>
                        {openFaq === i && (
                          <div className="px-5 pb-4 text-gray-600 border-t border-gray-100 pt-3" data-testid={`text-faq-answer-${i}`}>
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {related.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="heading-related">
                    <LinkIcon className="w-5 h-5 text-primary" /> Related Resources
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3" data-testid="section-related-links">
                    {related.map((link, i) => {
                      const RelIcon = PAGE_TYPE_ICONS[link.type] || FileText;
                      return (
                        <a
                          key={i}
                          href={link.url}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                          data-testid={`link-related-${i}`}
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <RelIcon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors line-clamp-2">{link.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </section>
              )}

              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8 text-center" data-testid="section-cta">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t("pages.programmaticSeoPage.readyToStartStudying")}</h3>
                <p className="text-gray-600 mb-4">{t("pages.programmaticSeoPage.exploreMoreStudyResourcesAnd")}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => navigate(`/${page.careerTrack}`)} data-testid="button-cta-career">
                    Explore {careerLabel}
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/lessons")} data-testid="button-cta-lessons">
                    Browse All Lessons
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export function StudyGuidePage() {
  return <ProgrammaticSeoPage />;
}

export function ExamTipsPage() {
  return <ProgrammaticSeoPage />;
}

export function ClinicalScenarioPage() {
  return <ProgrammaticSeoPage />;
}

export function PracticeQuestionsPageTemplate() {
  return <ProgrammaticSeoPage />;
}

export function QuestionDetailPage() {
  return <ProgrammaticSeoPage />;
}

export function FlashcardDetailPage() {
  return <ProgrammaticSeoPage />;
}
