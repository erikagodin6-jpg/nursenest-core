import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { ChevronRight, BookOpen, FileText, HelpCircle, Link as LinkIcon, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { ContextualRelatedResources } from "@/components/related-resources";
import { ConversionFunnel } from "@/components/conversion-funnel/ConversionFunnel";

type FAQ = { q: string; a: string };
type TOCItem = { id: string; title: string; level: number };
type InternalLink = { label: string; url: string; type: string };

type SeoPageData = {
  id: string;
  pageType: string;
  exam: string;
  languageCode: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  contentHtml: string;
  tocJson: TOCItem[] | string;
  faqJson: FAQ[] | string;
  internalLinksJson: InternalLink[] | string;
  isPublic: boolean;
  canonicalUrl: string;
  translationStatus: string;
  hreflangLinks?: { lang: string; slug: string }[];
  fallbackToEnglish?: boolean;
};

function parseSafe<T>(val: T | string | null, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return val;
}

export default function SeoPage({ slug: propSlug }: { slug?: string } = {}) {
  const params = useParams<{ slug: string }>();
  const [location, navigate] = useLocation();
  const { language, t } = useI18n();
  const { user } = useAuth();
  const [page, setPage] = useState<SeoPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const isAdmin = user?.tier === "admin";

  const slug = propSlug || params.slug || location.split("/").filter(Boolean).pop() || "";

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const previewParam = isAdmin ? "&preview=true" : "";
    fetch(`/api/seo-pages/${slug}?language=${language}${previewParam}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); setPage(null); }
        else { setPage(data); setError(""); }
      })
      .catch(() => setError("Failed to load page"))
      .finally(() => setLoading(false));
  }, [slug, language]);

  if (loading) return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">{t("pages.seoPage.loading")}</div>
      </div>
    </>
  );

  if (error || !page) return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h1 className="text-xl font-bold mb-2">{t("pages.seoPage.pageNotFound")}</h1>
            <p className="text-gray-600 mb-4">{error || "This study guide page could not be found."}</p>
            <Button onClick={() => navigate("/")}>{t("pages.seoPage.goHome")}</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const toc = parseSafe<TOCItem[]>(page.tocJson, []);
  const faqs = parseSafe<FAQ[]>(page.faqJson, []);
  const links = parseSafe<InternalLink[]>(page.internalLinksJson, []);

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  } : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.metaTitle || page.title,
    "description": page.metaDescription || "",
    "author": { "@type": "Organization", "name": "NurseNest" },
    "publisher": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "inLanguage": page.languageCode,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.nursenest.ca/${page.languageCode}/study-guide/${page.slug}` }
  };

  return (
    <>
      <Navigation />
      <SEO
        title={page.metaTitle || page.title}
        description={page.metaDescription || ""}
        canonicalPath={`/study-guide/${page.slug}`}
        structuredData={articleSchema}
        additionalStructuredData={faqSchema ? [faqSchema] : undefined}
        breadcrumbs={[
          { name: "Home", url: `https://www.nursenest.ca/${page.languageCode}` },
          { name: "Study Guides", url: `https://www.nursenest.ca/${page.languageCode}/study-guide` },
          { name: page.title, url: `https://www.nursenest.ca/${page.languageCode}/study-guide/${page.slug}` },
        ]}
      />

      {page.hreflangLinks && page.hreflangLinks.length > 0 && (
        <>{page.hreflangLinks.map(h => (
          <link key={h.lang} rel="alternate" hrefLang={h.lang} href={`https://www.nursenest.ca/${h.lang}/study-guide/${h.slug}`} />
        ))}</>
      )}

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {page.fallbackToEnglish && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800" data-testid="notice-fallback">
              This page is not yet available in your language. Showing English version.
            </div>
          )}

          {isAdmin && !page.isPublic && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800" data-testid="notice-draft">
              Draft — This page is not published yet. Only admins can see it.
            </div>
          )}

          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="nav-breadcrumb">
            <button onClick={() => navigate("/")} className="hover:text-primary">{t("pages.seoPage.home")}</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-medium">{page.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {toc.length > 0 && (
              <aside className="lg:w-64 shrink-0">
                <div className="sticky top-24 bg-white rounded-xl border border-primary/10 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Table of Contents
                  </h3>
                  <ul className="space-y-1.5">
                    {toc.map((item, i) => (
                      <li key={i}>
                        <a href={`#${item.id}`} className={`text-sm hover:text-primary transition-colors block ${item.level > 1 ? "pl-3 text-gray-500" : "text-gray-700 font-medium"}`}>
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-xs" data-testid="badge-page-type">
                  {page.pageType === "pillar" ? "Comprehensive Guide" : "Topic Guide"}
                </Badge>
                {page.exam && (
                  <Badge className="text-xs bg-primary/10 text-primary border-0" data-testid="badge-exam">
                    {page.exam.toUpperCase()}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="heading-title">
                {page.title}
              </h1>

              {page.metaDescription && (
                <p className="text-lg text-gray-600 mb-8 leading-relaxed" data-testid="text-description">
                  {page.metaDescription}
                </p>
              )}

              {page.contentHtml ? (
                <div
                  className="prose prose-lg max-w-none mb-12"
                  dangerouslySetInnerHTML={{ __html: page.contentHtml }}
                  data-testid="content-html"
                />
              ) : (
                <div className="bg-gray-100 rounded-xl p-8 text-center text-gray-500 mb-12" data-testid="content-placeholder">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{t("pages.seoPage.contentIsBeingDevelopedFor")}</p>
                  <p className="text-sm mt-1">{t("pages.seoPage.checkBackSoonForComprehensive")}</p>
                </div>
              )}

              <div className="mb-12" data-testid="section-conversion-funnel">
                <ConversionFunnel
                  topic={page.title}
                  bodySystem={
                    page.slug?.includes("copd") || page.slug?.includes("barrel-chest") || page.slug?.includes("respiratory")
                      ? "respiratory"
                      : page.slug?.includes("hyperkalemia") || page.slug?.includes("hypokalemia") || page.slug?.includes("cardiac") || page.slug?.includes("ecg")
                        ? "cardiac"
                        : undefined
                  }
                  showPracticeQuestions={true}
                  showFlashcards={false}
                  showMockExam={false}
                  showPremiumSummary={false}
                  showSocialProof={false}
                  showTopCta={false}
                  showMidCta={false}
                  showBottomCta={true}
                  showProgressPrompt={false}
                />
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

              {links.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="heading-related">
                    <LinkIcon className="w-5 h-5 text-primary" /> Related Resources
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3" data-testid="section-internal-links">
                    {links.map((link, i) => (
                      <a
                        key={i}
                        href={`/${language}${link.url}`}
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                        data-testid={`link-related-${i}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {link.type === "pillar" ? <BookOpen className="w-4 h-4 text-primary" /> :
                           link.type === "cluster" ? <FileText className="w-4 h-4 text-primary" /> :
                           <ArrowLeft className="w-4 h-4 text-primary" />}
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{link.label}</span>
                      </a>
                    ))}
                  </div>
                </section>
              )}

              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8 text-center" data-testid="section-cta">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t("pages.seoPage.readyToStartStudying")}</h3>
                <p className="text-gray-600 mb-4">{t("pages.seoPage.takeOurFreeDiagnosticExam")}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => navigate("/free-nclex-diagnostic")} data-testid="button-cta-diagnostic">
                    Start Free Diagnostic
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/lessons")} data-testid="button-cta-lessons">
                    Browse Lessons
                  </Button>
                </div>
              </div>

              <ContextualRelatedResources
                pageType="studyGuide"
                tags={["exam-prep"]}
                currentPath={`/study-guide/${slug}`}
                className="border-t border-gray-200 mt-8"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
