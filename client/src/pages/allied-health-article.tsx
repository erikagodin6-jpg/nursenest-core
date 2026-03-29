import { Link, useParams } from "wouter";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAlliedHealthProfession } from "@/allied/data/allied-health-professions";
import { ChevronRight, Clock, ArrowRight, BookOpen, Calendar } from "lucide-react";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";

import { useI18n } from "@/lib/i18n";
function setArticleMetaTags(article: any, professionName: string) {
  const { t } = useI18n();
  document.title = (article.metaTitle || article.title) + " | NurseNest";
  const setMeta = (attr: string, name: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.content = content;
  };
  const title = (article.metaTitle || article.title) + " | NurseNest";
  const desc = article.metaDescription || "";
  setMeta("name", "description", desc);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", desc);
  setMeta("property", "og:type", "article");
  setMeta("property", "og:url", `https://www.nursenest.ca/allied-health/${article.slug}`);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", desc);
  setMeta("name", "twitter:card", "summary_large_image");

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = article.canonicalUrl || `https://www.nursenest.ca/allied-health/${article.slug}`;

  document.querySelectorAll('script[id^="allied-article-ld"]').forEach((el) => el.remove());

  const slugParts = (article.slug || "").split("/");
  const articleSlug = slugParts[slugParts.length - 1] || "";
  const profSlug = slugParts[0] || "";

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nursenest.ca" },
      { "@type": "ListItem", "position": 2, "name": "Allied Health", "item": "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", "position": 3, "name": professionName, "item": `https://www.nursenest.ca/allied-health/${profSlug}` },
      { "@type": "ListItem", "position": 4, "name": article.title, "item": `https://www.nursenest.ca/allied-health/${article.slug}` },
    ]
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.metaDescription || "",
    "url": `https://www.nursenest.ca/allied-health/${article.slug}`,
    "datePublished": article.publishedAt || article.createdAt,
    "dateModified": article.updatedAt || article.publishedAt || article.createdAt,
    "author": {
      "@type": "Organization",
      "name": "NurseNest Allied Health",
      "url": "https://www.nursenest.ca"
    },
    "publisher": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca"
    },
    "wordCount": article.wordCount || 0,
    "articleSection": article.primaryCategory || professionName,
  };

  [breadcrumbLd, articleLd].forEach((data, i) => {
    const script = document.createElement("script");
    script.id = `allied-article-ld-${i}`;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^javascript:/i.test(trimmed) || /^data:/i.test(trimmed) || /^vbscript:/i.test(trimmed)) {
    return "#";
  }
  return escapeHtml(trimmed);
}

function renderMarkdown(md: string): string {
  if (!md) return "";
  const escaped = escapeHtml(md);
  let html = escaped
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-900 mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mt-10 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-600 mb-1">• $1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-gray-600 mb-1">$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
      return `<a href="${sanitizeUrl(url)}" class="text-teal-600 hover:text-teal-700 underline">${text}</a>`;
    })
    .replace(/^(?!<[hula]|<li|<strong|<em)(.+)$/gm, (match) => {
      if (match.trim() === "") return "";
      return `<p class="text-gray-600 leading-relaxed mb-4">${match}</p>`;
    });

  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => {
    return `<ul class="space-y-1 mb-4">${match}</ul>`;
  });

  return html;
}

export default function AlliedHealthArticlePage() {
  const params = useParams<{ profession: string; articleSlug: string }>();
  const profession = getAlliedHealthProfession(params.profession || "");

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/allied-health/articles/by-slug", params.profession, params.articleSlug],
    queryFn: async () => {
      const res = await fetch(`/api/allied-health/articles/by-slug/${params.profession}/${params.articleSlug}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("not_found");
        throw new Error("Failed to fetch article");
      }
      return res.json();
    },
    enabled: !!params.profession && !!params.articleSlug,
    retry: false,
  });

  const article = data?.article;
  const relatedArticles = data?.relatedArticles || [];
  const professionName = profession?.name || params.profession || "";

  useEffect(() => {
    if (article) setArticleMetaTags(article, professionName);
    return () => {
      document.querySelectorAll('script[id^="allied-article-ld"]').forEach((el) => el.remove());
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.remove();
    };
  }, [article, professionName]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="article-loading">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-xl mx-auto mb-4" />
          <div className="h-6 w-64 bg-gray-200 rounded mx-auto mb-2" />
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="article-not-found">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.alliedHealthArticle.articleNotFound")}</h1>
          <p className="text-gray-500 mb-4">{t("pages.alliedHealthArticle.theArticleYoureLookingFor")}</p>
          <div className="flex gap-3 justify-center">
            {profession && (
              <Link href={`/allied-health/${params.profession}`} className="text-teal-600 font-medium hover:text-teal-700" data-testid="link-back-profession">
                Back to {profession.name}
              </Link>
            )}
            <Link href="/allied-health" className="text-teal-600 font-medium hover:text-teal-700" data-testid="link-back-hub">
              Allied Health Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="allied-health-article-page">
      <nav className="bg-gray-50 border-b border-gray-100 py-3 px-4" data-testid="breadcrumb-nav">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-teal-600 transition-colors" data-testid="breadcrumb-home">{t("pages.alliedHealthArticle.home")}</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href="/allied-health" className="hover:text-teal-600 transition-colors" data-testid="breadcrumb-allied">{t("pages.alliedHealthArticle.alliedHealth")}</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href={`/allied-health/${params.profession}`} className="hover:text-teal-600 transition-colors" data-testid="breadcrumb-profession">
            {professionName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-gray-900 font-medium line-clamp-1" data-testid="breadcrumb-current">{article.title}</span>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14" data-testid="article-content">
        <header className="mb-10">
          {article.primaryCategory && (
            <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium uppercase tracking-wider mb-4" data-testid="text-article-category">
              {article.primaryCategory}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-article-title">
            {article.title}
          </h1>
          {article.metaDescription && (
            <p className="text-lg text-gray-500 mb-4" data-testid="text-article-description">{article.metaDescription}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-400 border-b border-gray-100 pb-6">
            {article.wordCount > 0 && (
              <span className="flex items-center gap-1" data-testid="text-read-time">
                <Clock className="w-4 h-4" />
                {Math.ceil(article.wordCount / 250)} min read
              </span>
            )}
            {article.publishedAt && (
              <span className="flex items-center gap-1" data-testid="text-publish-date">
                <Calendar className="w-4 h-4" />
                {new Date(article.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            )}
            {article.wordCount > 0 && (
              <span data-testid="text-word-count">{article.wordCount.toLocaleString()} words</span>
            )}
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.contentMd || "") }}
          data-testid="article-body"
        />

        {article.careerTrack && (
          <div className="mt-12 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 sm:p-8 border border-teal-100" data-testid="article-cta">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t("pages.alliedHealthArticle.readyToStartStudying")}</h3>
            <p className="text-gray-600 mb-4">Explore study resources and practice tools for {professionName} certification.</p>
            <Link
              href={`/allied-health/${params.profession}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors"
              data-testid="button-explore-resources"
            >
              Explore {professionName} Resources <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </article>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-4">
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          <MedicalReviewBadge lastUpdated={article.updatedAt || article.publishedAt || undefined} />
          <MedicalReferences lessonId={article.slug || params.articleSlug || ""} />
        </div>

        <MedicalReviewJsonLd
          title={article.title}
          slug={article.slug || params.articleSlug || ""}
          lastUpdated={article.updatedAt || article.publishedAt || undefined}
          description={article.metaDescription || ""}
          pageUrl={`https://www.nursenest.ca/allied-health/${article.slug}`}
        />
      </div>

      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-12" data-testid="related-articles-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="heading-related-articles">{t("pages.alliedHealthArticle.relatedArticles")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedArticles.map((ra: any) => (
                <Link
                  key={ra.id}
                  href={`/allied-health/${ra.slug}`}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all group"
                  data-testid={`related-article-${ra.id}`}
                >
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {ra.title}
                  </h3>
                  {ra.metaDescription && (
                    <p className="text-xs text-gray-500 line-clamp-2">{ra.metaDescription}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
