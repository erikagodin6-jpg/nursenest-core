import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ArrowRight, BookOpen, FileText, Layers, Brain, Clock, Calendar, Loader2 } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { getAlliedHealthProfession } from "@/allied/data/allied-health-professions";
import { AutoRelatedContent } from "@/components/auto-related-content";
import { useMemo } from "react";
import DOMPurify from "dompurify";

import { useI18n } from "@/lib/i18n";
function renderMarkdown(md: string): string {
  const { t } = useI18n();
  if (!md) return "";
  let html = md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-900 mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-10 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm">$1</code>')
    .replace(/^\- (.+)$/gm, '<li class="ml-4 text-gray-700 mb-1">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-gray-700 mb-1 list-decimal">$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-teal-600 hover:text-teal-700 underline">$1</a>')
    .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-4">')
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split("|").filter(Boolean).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) return '';
      const isHeader = match.includes("---");
      if (isHeader) return '';
      return `<tr>${cells.map(c => `<td class="border border-gray-200 px-3 py-2 text-sm">${c}</td>`).join("")}</tr>`;
    });
  html = `<p class="text-gray-700 leading-relaxed mb-4">${html}</p>`;
  html = html.replace(/<\/p><p[^>]*><tr>/g, '<table class="w-full border-collapse border border-gray-200 my-4"><tbody><tr>');
  html = html.replace(/<\/tr><\/p>/g, '</tr></tbody></table>');
  return html;
}

function Breadcrumbs({ professionSlug, professionName, articleTitle }: { professionSlug: string; professionName: string; articleTitle: string }) {
  return (
    <nav aria-label={t("allied.alliedHealthArticle.breadcrumb")} className="mb-6" data-testid="breadcrumb-nav">
      <ol className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
        <li><Link href="/" className="hover:text-teal-600 transition-colors">{t("allied.alliedHealthArticle.home")}</Link></li>
        <li><ChevronRight className="w-3.5 h-3.5" /></li>
        <li><Link href="/allied-health" className="hover:text-teal-600 transition-colors">{t("allied.alliedHealthArticle.alliedHealth")}</Link></li>
        <li><ChevronRight className="w-3.5 h-3.5" /></li>
        <li><Link href={`/allied-health/${professionSlug}`} className="hover:text-teal-600 transition-colors">{professionName}</Link></li>
        <li><ChevronRight className="w-3.5 h-3.5" /></li>
        <li className="text-gray-900 font-medium line-clamp-1">{articleTitle}</li>
      </ol>
    </nav>
  );
}

export default function AlliedHealthArticlePage() {
  const [, params] = useRoute("/allied-health/:professionSlug/:articleSlug");
  const professionSlug = params?.professionSlug || "";
  const articleSlug = params?.articleSlug || "";
  const profession = getAlliedHealthProfession(professionSlug);

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["/api/allied-health/article", professionSlug, articleSlug],
    queryFn: () => fetch(`/api/allied-health/article/${professionSlug}/${articleSlug}`).then(r => {
      if (!r.ok) throw new Error("Article not found");
      return r.json();
    }),
    enabled: !!professionSlug && !!articleSlug,
  });

  const { data: relatedArticles } = useQuery({
    queryKey: ["/api/allied-health/articles", professionSlug, "related"],
    queryFn: () => fetch(`/api/allied-health/articles?professionSlug=${professionSlug}&status=published&limit=6`).then(r => r.json()),
    enabled: !!professionSlug,
  });

  const renderedContent = useMemo(() => {
    if (!article?.contentMd) return "";
    const rawHtml = renderMarkdown(article.contentMd);
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ["h1", "h2", "h3", "h4", "p", "strong", "em", "code", "a", "ul", "ol", "li", "table", "thead", "tbody", "tr", "td", "th", "br", "hr", "blockquote", "pre", "span", "div"],
      ALLOWED_ATTR: ["href", "class", "target", "rel"],
    });
  }, [article?.contentMd]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.alliedHealthArticle.articleNotFound")}</h1>
        <p className="text-gray-600 mb-4">{t("allied.alliedHealthArticle.theArticleYoureLookingFor")}</p>
        <Link href={`/allied-health/${professionSlug}`} className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back-profession">
          Back to {profession?.shortName || "Profession"}
        </Link>
      </div>
    );
  }

  const related = (Array.isArray(relatedArticles) ? relatedArticles : []).filter((a: any) => a.slug !== articleSlug).slice(0, 4);
  const readingTime = article.wordCount ? `${Math.round(article.wordCount / 200)} min read` : "";

  return (
    <div data-testid={`article-page-${articleSlug}`}>
      <AlliedSEO
        title={article.metaTitle || article.title}
        description={article.metaDescription || `${article.title} - Comprehensive guide for ${profession?.name || "allied health"} professionals.`}
        keywords={article.targetKeyword}
        canonicalPath={`/allied-health/${professionSlug}/${articleSlug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.metaDescription || article.title,
          "datePublished": article.publishedAt,
          "dateModified": article.updatedAt || article.publishedAt,
          "author": { "@type": "Organization", "name": "NurseNest" },
          "publisher": {
            "@type": "Organization",
            "name": "NurseNest",
            "url": "https://www.nursenest.ca",
            "logo": { "@type": "ImageObject", "url": "https://www.nursenest.ca/opengraph.jpg" }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.nursenest.ca/allied-health/${professionSlug}/${articleSlug}`
          },
          "wordCount": article.wordCount,
          "articleSection": profession?.name || "Allied Health",
        }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumbs
          professionSlug={professionSlug}
          professionName={profession?.shortName || professionSlug}
          articleTitle={article.title}
        />

        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-article-title">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {readingTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{readingTime}</span>
              </div>
            )}
            {article.wordCount > 0 && (
              <span>{article.wordCount.toLocaleString()} words</span>
            )}
            {article.publishedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            )}
            {profession && (
              <Link href={`/allied-health/${professionSlug}`} className="text-teal-600 hover:text-teal-700 font-medium">
                {profession.shortName}
              </Link>
            )}
          </div>
        </header>

        <div
          className="prose prose-gray max-w-none"
          data-testid="article-content"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />

        {profession && (
          <div className="mt-12 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 p-6 sm:p-8" data-testid="article-study-cta">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t("allied.alliedHealthArticle.readyToStartStudying")}</h2>
            <p className="text-gray-600 mb-5">Access {profession.shortName}-specific study tools to prepare for your certification exam.</p>
            <div className="flex flex-wrap gap-3">
              <Link href={profession.studyResourceCTAs.questionBank} className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors" data-testid="button-article-qbank">
                <BookOpen className="w-4 h-4" /> Test Bank
              </Link>
              <Link href={profession.studyResourceCTAs.flashcards} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl text-sm font-semibold hover:bg-teal-50 transition-colors border border-teal-200" data-testid="button-article-flashcards">
                <Layers className="w-4 h-4" /> Flashcards
              </Link>
              <Link href={profession.studyResourceCTAs.mockExams} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl text-sm font-semibold hover:bg-teal-50 transition-colors border border-teal-200" data-testid="button-article-mocks">
                <FileText className="w-4 h-4" /> Mock Exams
              </Link>
            </div>
          </div>
        )}

        <AutoRelatedContent
          slug={articleSlug}
          contentType="allied-article"
          title={article.title}
          profession={profession?.shortName || professionSlug}
          category={profession?.name || undefined}
          className="mt-12 pt-8 border-t border-gray-200"
          sectionTitle="Related Resources"
        />

        {related.length > 0 && (
          <div className="mt-12" data-testid="related-articles">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t("allied.alliedHealthArticle.relatedArticles")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((rel: any) => (
                <Link key={rel.id} href={`/allied-health/${professionSlug}/${rel.slug}`} className="block group">
                  <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-teal-200 transition-all" data-testid={`card-related-${rel.slug}`}>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2 mb-1">{rel.title}</h3>
                    <span className="text-xs text-gray-400">{rel.wordCount ? `${Math.round(rel.wordCount / 200)} min read` : ""}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
