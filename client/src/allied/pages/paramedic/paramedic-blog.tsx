import { useParams, Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { Breadcrumbs, FAQAccordion, ConversionCTA } from "@/allied/components/paramedic-seo-components";
import { FinalCTASection } from "./components";
import { PARAMEDIC_BLOG_ARTICLES, getBlogBySlug } from "@/allied/data/paramedic-blog-data";
import { PARAMEDIC_CLUSTERS } from "@/allied/data/paramedic-cluster-data";
import { useI18n } from "@/lib/i18n";
import {
  Calendar, Clock, Tag, ArrowRight, ChevronRight,
  BookOpen, CheckCircle
} from "lucide-react";

export function ParamedicBlogIndex() {
  const { t } = useI18n();

  const breadcrumbs = [
    { label: t("paramedic.breadcrumb.home"), href: "/" },
    { label: t("paramedic.breadcrumb.paramedic"), href: "/allied-health/paramedic" },
    { label: t("paramedic.blog.indexTitle"), href: "#" },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Paramedic Blog — Study Tips, Exam Strategies & Clinical Guides",
    description: "Expert articles on paramedic exam preparation, EMS study strategies, and clinical knowledge for certification success.",
    publisher: { "@type": "Organization", name: "NurseNest" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PARAMEDIC_BLOG_ARTICLES.map((article, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: article.title,
        url: `https://www.nursenest.ca/allied-health/paramedic/blog/${article.slug}`,
      })),
    },
  };

  return (
    <div data-testid="paramedic-blog-index">
      <AlliedSEO
        title={t("allied.paramedicParamedicBlog.paramedicBlogStudyTipsExam")}
        description={t("allied.paramedicParamedicBlog.expertArticlesOnParamedicExam")}
        keywords="paramedic blog, EMS study tips, paramedic exam strategies, NREMT preparation articles"
        canonicalPath="/allied-health/paramedic/blog"
        structuredData={structuredData}
      />

      <Breadcrumbs items={breadcrumbs} />

      <section className="bg-gradient-to-br from-teal-50 via-white to-purple-50 border-b border-gray-100 py-12 px-4" data-testid="section-blog-hero">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="text-blog-index-title">
            {t("paramedic.blog.indexTitle")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("paramedic.blog.indexDescription")}
          </p>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-blog-articles">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {PARAMEDIC_BLOG_ARTICLES.map(article => (
              <Link
                key={article.slug}
                href={`/allied-health/paramedic/blog/${article.slug}`}
                className="group block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all"
                data-testid={`card-blog-${article.slug}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.publishedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600 mb-3">{article.metaDescription}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 group-hover:text-teal-700">
                  {t("paramedic.blog.readArticle")} <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ConversionCTA
        title={t("paramedic.cta.unlockBank")}
        description={t("paramedic.cta.unlockBankSub")}
        ctaText={t("paramedic.cta.startDiagnostic")}
        ctaHref="/allied-health/diagnostic?career=paramedic"
      />
    </div>
  );
}

export default function ParamedicBlog() {
  const params = useParams<{ slug: string }>();
  const { t } = useI18n();
  const article = getBlogBySlug(params.slug || "");

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("paramedic.blog.notFound")}</h1>
        <p className="text-gray-600 mb-4">{t("paramedic.blog.notFoundDesc")}</p>
        <Link href="/allied-health/paramedic/blog" className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back-to-blog">
          {t("paramedic.blog.browseAll")}
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { label: t("paramedic.breadcrumb.home"), href: "/" },
    { label: t("paramedic.breadcrumb.paramedic"), href: "/allied-health/paramedic" },
    { label: t("paramedic.blog.indexTitle"), href: "/allied-health/paramedic/blog" },
    { label: article.title, href: "#" },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.metaDescription,
      datePublished: article.publishedDate,
      dateModified: article.publishedDate,
      publisher: { "@type": "Organization", name: "NurseNest" },
      author: { "@type": "Organization", name: "NurseNest" },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://www.nursenest.ca/allied-health/paramedic/blog/${article.slug}`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.label,
        item: b.href !== "#" ? `https://www.nursenest.ca${b.href}` : undefined,
      })),
    },
    ...(article.faq.length > 0 ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faq.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    }] : []),
  ];

  const relatedClusters = PARAMEDIC_CLUSTERS.filter(c =>
    article.relatedClusterSlugs.includes(c.slug)
  );

  return (
    <div data-testid="paramedic-blog-article">
      <AlliedSEO
        title={article.metaTitle}
        description={article.metaDescription}
        keywords={article.keywords}
        canonicalPath={`/allied-health/paramedic/blog/${article.slug}`}
        ogType="article"
        structuredData={structuredData[0]}
        additionalStructuredData={structuredData.slice(1)}
      />

      <Breadcrumbs items={breadcrumbs} />

      <section className="bg-gradient-to-br from-purple-50 via-white to-teal-50 border-b border-gray-100 py-12 px-4" data-testid="section-blog-hero">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium">
              <Tag className="w-3 h-3 inline mr-1" />
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              {new Date(article.publishedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" data-testid="text-blog-title">
            {article.title}
          </h1>
          <p className="text-lg text-gray-600">{article.metaDescription}</p>
        </div>
      </section>

      <article className="py-10 bg-white" data-testid="section-blog-content">
        <div className="max-w-3xl mx-auto px-4">
          {article.sections.map(section => (
            <div key={section.id} className="mb-8" data-testid={`section-${section.id}`}>
              {section.level === 2 ? (
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
              ) : (
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h3>
              )}
              <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-3">{section.content}</p>
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-1.5 ml-1 mb-4">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.numbered && section.numbered.length > 0 && (
                <ol className="space-y-2 ml-1 mb-4">
                  {section.numbered.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>
      </article>

      <ConversionCTA
        title={t("paramedic.cta.unlockBank")}
        description={t("paramedic.cta.unlockBankSub")}
        ctaText={t("paramedic.cta.startDiagnostic")}
        ctaHref="/allied-health/diagnostic?career=paramedic"
      />

      {article.faq.length > 0 && (
        <section className="py-10 bg-white" data-testid="section-blog-faq">
          <div className="max-w-3xl mx-auto px-4">
            <FAQAccordion items={article.faq} />
          </div>
        </section>
      )}

      {relatedClusters.length > 0 && (
        <section className="py-8 border-t border-gray-100" data-testid="section-related-clusters">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t("paramedic.blog.relatedClusters")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedClusters.map(c => (
                <Link
                  key={c.slug}
                  href={`/allied-health/paramedic/cluster/${c.slug}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all"
                  data-testid={`link-cluster-${c.slug}`}
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{c.title}</h3>
                    <p className="text-xs text-gray-500">{c.topics.length} {t("paramedic.blog.topics")}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-8 border-t border-gray-100" data-testid="section-other-articles">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t("paramedic.blog.moreArticles")}</h2>
          <div className="space-y-3">
            {PARAMEDIC_BLOG_ARTICLES.filter(a => a.slug !== article.slug).map(a => (
              <Link
                key={a.slug}
                href={`/allied-health/paramedic/blog/${a.slug}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all"
                data-testid={`link-article-${a.slug}`}
              >
                <BookOpen className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{a.title}</h3>
                  <p className="text-xs text-gray-500">{a.readTime}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCTASection
        title={t("paramedic.cta.masterExam")}
        subtitle={t("paramedic.cta.masterExamSub")}
        primaryCTA={{ label: t("paramedic.cta.startPracticing"), href: "/allied-health/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: t("paramedic.cta.viewPricing"), href: "/allied-health/pricing" }}
      />
    </div>
  );
}
