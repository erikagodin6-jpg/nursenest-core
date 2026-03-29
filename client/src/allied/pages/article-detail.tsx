import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { ChevronRight, ArrowRight, Loader2, BookOpen, FileText, Brain, Target, Zap, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { AlliedBreadcrumb } from "@/components/allied-breadcrumb";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";

import { useI18n } from "@/lib/i18n";
const ALLIED_DOMAIN = "https://www.nursenest.ca/allied-health";

const PROFESSION_DISPLAY: Record<string, { name: string; shortName: string; color: string; colorAccent: string; hubPath: string }> = {
  rrt: { name: "Registered Respiratory Therapist", shortName: "RRT", color: "#2196F3", colorAccent: "#E3F2FD", hubPath: "/allied-health/rrt" },
  paramedic: { name: "Paramedic", shortName: "Paramedic", color: "#F44336", colorAccent: "#FFEBEE", hubPath: "/allied-health/paramedic" },
  "pharmacy-technician": { name: "Pharmacy Technician", shortName: "Pharm Tech", color: "#9C27B0", colorAccent: "#F3E5F5", hubPath: "/allied-health/pharmacy-technician" },
  mlt: { name: "Medical Laboratory Technologist", shortName: "MLT", color: "#FF9800", colorAccent: "#FFF3E0", hubPath: "/allied-health/mlt" },
  imaging: { name: "Medical Imaging Technologist", shortName: "Imaging", color: "#00BCD4", colorAccent: "#E0F7FA", hubPath: "/allied-health/imaging" },
  psychotherapy: { name: "Psychotherapist", shortName: "Psychotherapy", color: "#673AB7", colorAccent: "#EDE7F6", hubPath: "/allied-health/psychotherapy" },
  "social-work": { name: "Social Worker", shortName: "Social Work", color: "#E91E63", colorAccent: "#FCE4EC", hubPath: "/allied-health/social-work" },
  addictions: { name: "Addictions Counsellor", shortName: "Addictions", color: "#795548", colorAccent: "#EFEBE9", hubPath: "/allied-health/addictions" },
  "occupational-therapy": { name: "Occupational Therapist", shortName: "OT", color: "#4CAF50", colorAccent: "#E8F5E9", hubPath: "/allied-health/occupational-therapy" },
  "physical-therapy": { name: "Physical Therapist", shortName: "PT", color: "#FF5722", colorAccent: "#FBE9E7", hubPath: "/allied-health/physical-therapy" },
};

const STUDY_TOOL_LINKS = [
  { label: "Test Bank", icon: BookOpen, path: "/questions", desc: "Practice exam-authentic questions with detailed rationales" },
  { label: "Flashcards", icon: Brain, path: "/flashcards", desc: "Spaced repetition flashcards for key concepts" },
  { label: "Mock Exams", icon: FileText, path: "/mock-exams", desc: "Full-length blueprint-weighted practice exams" },
  { label: "Study Plan", icon: Target, path: "/study-plan", desc: "Personalized adaptive study schedule" },
  { label: "Case Simulators", icon: Zap, path: "/sims", desc: "Unfolding clinical case scenarios" },
];

interface ArticleDetail {
  id: string;
  professionSlug: string;
  articleType: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  contentSections: any[];
  faqItems: any[];
  internalLinks: any[];
  schemaMarkupJson: any;
  breadcrumbItems: any[];
  status: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function ArticleDetailPage() {
  const { t } = useI18n();
  const params = useParams<{ professionSlug: string; articleSlug: string }>();
  const profSlug = params.professionSlug || "";
  const articleSlug = params.articleSlug || "";
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const profession = PROFESSION_DISPLAY[profSlug];

  useEffect(() => {
    if (!profSlug || !articleSlug) return;
    setLoading(true);
    fetch(`/api/allied-articles/${profSlug}/${articleSlug}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(data => {
        setArticle(data);
        setError(false);
        fetch(`/api/allied-articles/${profSlug}`)
          .then(r => r.json())
          .then(all => {
            const related = (Array.isArray(all) ? all : [])
              .filter((a: any) => a.slug !== data.slug)
              .slice(0, 3);
            setRelatedArticles(related);
          })
          .catch(() => {});
      })
      .catch(() => { setError(true); setArticle(null); })
      .finally(() => setLoading(false));
  }, [profSlug, articleSlug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (error || !article || !profession) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.articleDetail.articleNotFound")}</h1>
        <p className="text-gray-600 mb-4">{t("allied.articleDetail.theArticleYoureLookingFor")}</p>
        <Link href={profSlug ? `/allied-health/${profSlug}/articles` : "/careers"} className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back">
          Back to Articles
        </Link>
      </div>
    );
  }

  const safeParseArray = (val: any): any[] => {
    try {
      const parsed = typeof val === "string" ? JSON.parse(val) : val;
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  };

  const contentSections = safeParseArray(article.contentSections);
  const faqItems = safeParseArray(article.faqItems);
  const internalLinks = safeParseArray(article.internalLinks);

  const breadcrumbItems = [
    { label: profession.shortName, href: profession.hubPath },
    { label: "Articles", href: `/allied-health/${profSlug}/articles` },
    { label: article.title },
  ];

  const safeParseObject = (val: any, fallback: any): any => {
    try {
      const parsed = typeof val === "string" ? JSON.parse(val) : val;
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : fallback;
    } catch { return fallback; }
  };

  const canonicalUrl = article.canonicalUrl || `${ALLIED_DOMAIN}/allied-health/${profSlug}/${articleSlug}`;

  const articleSchema = safeParseObject(article.schemaMarkupJson, null) || {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.metaTitle || article.title,
    "description": article.metaDescription,
    "author": { "@type": "Organization", "name": "NurseNest" },
    "publisher": { "@type": "Organization", "name": "NurseNest Allied", "url": ALLIED_DOMAIN },
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt,
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
  };

  const faqSchema = faqItems.length > 0 ? buildFaqStructuredData(
    faqItems.map((f: any) => ({ question: f.question, answer: f.answer }))
  ) : null;

  const breadcrumbSchemaItems = [
    { name: "NurseNest", url: "https://www.nursenest.ca/" },
    { name: "Allied Health", url: "https://www.nursenest.ca/allied-health" },
    { name: profession.shortName, url: `https://www.nursenest.ca${profession.hubPath}` },
    { name: "Articles", url: `https://www.nursenest.ca/allied-health/${profSlug}/articles` },
    { name: article.title, url: `https://www.nursenest.ca/allied-health/${profSlug}/${articleSlug}` },
  ];
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbSchemaItems.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url,
    })),
  };

  const additionalSchemas = [breadcrumbSchema];
  if (faqSchema) additionalSchemas.push(faqSchema);

  return (
    <div data-testid="article-detail-page">
      <AlliedSEO
        title={article.metaTitle || article.title}
        description={article.metaDescription || ""}
        keywords={[article.primaryKeyword, ...(article.secondaryKeywords || [])].filter(Boolean).join(", ")}
        canonicalPath={`/allied-health/${profSlug}/${articleSlug}`}
        structuredData={articleSchema}
        additionalStructuredData={additionalSchemas}
      />

      <section className="relative py-10 sm:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50/30 to-white" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AlliedBreadcrumb items={breadcrumbItems} />
          {article.publishedAt && (
            <div className="text-xs text-gray-500 mb-3">
              Published {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4" data-testid="text-article-title">
            {article.title}
          </h1>
          <p className="text-lg text-gray-600">{article.metaDescription}</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
            <div className="space-y-8 min-w-0">
              {contentSections.map((section: any, i: number) => (
                <div key={i} data-testid={`content-section-${i}`}>
                  {section.heading && (
                    <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
                  )}
                  {section.body && (
                    <div
                      className="text-gray-700 leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-900 prose-a:text-teal-600 prose-strong:text-gray-900"
                      dangerouslySetInnerHTML={{ __html: section.body }}
                    />
                  )}
                </div>
              ))}

              {faqItems.length > 0 && (
                <div data-testid="section-faq">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t("allied.articleDetail.frequentlyAskedQuestions")}</h2>
                  <div className="space-y-2">
                    {faqItems.map((faq: any, i: number) => (
                      <div key={i} className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                          data-testid={`button-faq-${i}`}
                        >
                          <HelpCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                          <span className="font-medium text-gray-900 flex-1 text-sm">{faq.question}</span>
                          {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </button>
                        {openFaq === i && (
                          <div className="px-5 pb-4 pl-13 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${i}`}>
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <MedicalReviewBadge lastUpdated={article.updatedAt} />
                <MedicalReferences lessonId={`${profSlug}-${articleSlug}`} pageType="allied-health" />
              </div>

              <MedicalReviewJsonLd
                title={article.title}
                slug={articleSlug}
                lastUpdated={article.updatedAt}
                description={article.metaDescription || ""}
                pageUrl={`https://www.nursenest.ca/allied-health/${profSlug}/${articleSlug}`}
              />

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50/50 rounded-2xl border border-teal-100 p-6 sm:p-8" data-testid="section-cta">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{t("allied.articleDetail.readyToStartStudying")}</h2>
                <p className="text-gray-600 mb-5">{t("allied.articleDetail.putYourKnowledgeToThe")}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/diagnostic?career=${profSlug}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200" data-testid="button-article-cta-diagnostic">
                    Start Free Diagnostic <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href={`/qbank?career=${profSlug}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl text-sm font-semibold hover:bg-teal-50 transition-colors border border-teal-200" data-testid="button-article-cta-qbank">
                    Practice Questions
                  </Link>
                </div>
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-4 lg:self-start">
              <div className="bg-white rounded-xl border border-gray-200 p-5" data-testid="sidebar-study-tools">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">{profession.shortName} Study Tools</h3>
                <div className="space-y-2">
                  {STUDY_TOOL_LINKS.map((tool) => (
                    <Link
                      key={tool.label}
                      href={`${profession.hubPath}${tool.path}`}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                      data-testid={`link-tool-${tool.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: profession.colorAccent }}>
                        <tool.icon className="w-4 h-4" style={{ color: profession.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-teal-700 transition-colors">{tool.label}</div>
                        <div className="text-xs text-gray-500 truncate">{tool.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {internalLinks.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5" data-testid="sidebar-internal-links">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">{t("allied.articleDetail.relatedResources")}</h3>
                  <div className="space-y-2">
                    {internalLinks.map((link: any, i: number) => (
                      <a
                        key={i}
                        href={link.url}
                        className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 hover:underline"
                        data-testid={`link-internal-${i}`}
                      >
                        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-200 p-5" data-testid="sidebar-articles-link">
                <Link
                  href={`/allied-health/${profSlug}/articles`}
                  className="flex items-center gap-2 text-sm text-teal-600 font-medium hover:text-teal-700"
                  data-testid="link-all-articles"
                >
                  <BookOpen className="w-4 h-4" />
                  View All {profession.shortName} Articles
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {relatedArticles.length > 0 && (
        <section className="py-12 bg-gray-50 border-t border-gray-100" data-testid="section-related-articles">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">More {profession.shortName} Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((related: any, i: number) => {
                const relSlugPart = related.slug.startsWith(profSlug + "-")
                  ? related.slug.slice(profSlug.length + 1)
                  : related.slug;
                return (
                  <Link key={related.id} href={`/allied-health/${profSlug}/${relSlugPart}`} className="block" data-testid={`link-related-${i}`}>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all h-full">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2" data-testid={`text-related-title-${i}`}>{related.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{related.metaDescription}</p>
                      <span className="inline-flex items-center gap-1 text-teal-600 text-xs font-medium mt-3">
                        Read article <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href={`/allied-health/${profSlug}/articles`} className="text-teal-600 font-medium hover:underline" data-testid="link-back-articles">
            ← Back to All {profession.shortName} Articles
          </Link>
        </div>
      </section>
    </div>
  );
}
