import { useRoute, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import {
  BookOpen, ArrowRight, FileText, Brain, Radio, Clock,
  ChevronRight, Search, Filter, Tag
} from "lucide-react";
import { useState, useMemo } from "react";

import { useI18n } from "@/lib/i18n";
interface BlogArticle {
  id: string;
  slug: string;
  country: string;
  articleType: string;
  category: string | null;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  summary: string | null;
  contentHtml: string | null;
  tags: string[];
  primaryKeyword: string | null;
  secondaryKeywords: string[];
  relatedSeoPageSlugs: string[];
  relatedArticleSlugs: string[];
  schemaMarkupJson: Record<string, any> | null;
  readTimeMinutes: number;
  status: string;
  publishedAt: string | null;
  updatedAt: string;
}

const ARTICLE_TYPE_LABELS: Record<string, string> = {
  "how-to-guide": "How-To Guide",
  "study-strategy": "Study Strategy",
  "concept-explanation": "Concept Explained",
  "common-mistakes": "Common Mistakes",
  "comparison": "Comparison",
  "beginner-roadmap": "Beginner Roadmap",
  "faq": "FAQ",
};

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  "Radiographic Positioning": Radio,
  "Radiation Physics": Brain,
  "Image Artifacts": FileText,
  "Exam Strategies": BookOpen,
};

const COUNTRY_META: Record<string, { flag: string; exam: string; name: string }> = {
  canada: { flag: "\u{1F1E8}\u{1F1E6}", exam: "CAMRT", name: "Canada" },
  usa: { flag: "\u{1F1FA}\u{1F1F8}", exam: "ARRT", name: "USA" },
};

function ArticleCard({ article }: { article: BlogArticle }) {
  const { t } = useI18n();
  const countryMeta = COUNTRY_META[article.country];
  const Icon = CATEGORY_ICONS[article.category || ""] || BookOpen;

  return (
    <Link href={`/medical-imaging/blog/${article.slug}`} className="block" data-testid={`card-article-${article.slug}`}>
      <article className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-indigo-200 transition-all group">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full" data-testid={`text-article-type-${article.slug}`}>
            {ARTICLE_TYPE_LABELS[article.articleType] || article.articleType}
          </span>
          {article.category && (
            <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full" data-testid={`text-article-category-${article.slug}`}>
              {article.category}
            </span>
          )}
          <span className="text-xs text-gray-400 ml-auto">{countryMeta?.flag}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2" data-testid={`text-article-title-${article.slug}`}>
          {article.title}
        </h3>
        {article.summary && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3" data-testid={`text-article-summary-${article.slug}`}>
            {article.summary}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTimeMinutes || 5} min read</span>
          </div>
          <span className="text-sm text-indigo-600 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Read <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </article>
    </Link>
  );
}

function BlogIndex() {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const { data, isLoading } = useQuery<{ articles: BlogArticle[]; total: number }>({
    queryKey: ["/api/imaging-seo/blog", selectedCountry, selectedCategory, selectedType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCountry) params.set("country", selectedCountry);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedType) params.set("articleType", selectedType);
      params.set("status", "published");
      params.set("limit", "100");
      const res = await fetch(`/api/imaging-seo/blog?${params}`);
      return res.json();
    },
  });

  const articles = data?.articles || [];

  const filtered = useMemo(() => {
    if (!search) return articles;
    const q = search.toLowerCase();
    return articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      (a.summary && a.summary.toLowerCase().includes(q)) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [articles, search]);

  const categories = useMemo(() => {
    const cats = new Set(articles.map(a => a.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [articles]);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Medical Imaging Academy Blog",
    description: "Educational articles, study guides, and exam prep resources for radiography students preparing for CAMRT and ARRT certification.",
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={t("pages.imagingBlog.medicalImagingBlogStudyGuides")}
        description={t("pages.imagingBlog.educationalArticlesHowtoGuidesAnd")}
        keywords="radiography blog, medical imaging articles, CAMRT study guide, ARRT exam tips, radiography student resources"
        canonicalPath="/medical-imaging/blog"
        structuredData={blogSchema}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <BreadcrumbNav items={[{ name: "Medical Imaging", url: "/medical-imaging" }, { name: "Blog & Articles", url: "" }]} />

        <header className="mt-6 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" data-testid="text-blog-heading">
            Medical Imaging Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl" data-testid="text-blog-description">
            Educational articles, study strategies, and exam prep resources for radiography students.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("pages.imagingBlog.searchArticles")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
              data-testid="input-blog-search"
            />
          </div>
          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-200" data-testid="select-blog-country">
            <option value="">{t("pages.imagingBlog.allCountries")}</option>
            <option value="canada">{"\u{1F1E8}\u{1F1E6}"} Canada (CAMRT)</option>
            <option value="usa">{"\u{1F1FA}\u{1F1F8}"} USA (ARRT)</option>
          </select>
          <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-200" data-testid="select-blog-type">
            <option value="">{t("pages.imagingBlog.allTypes")}</option>
            {Object.entries(ARTICLE_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          {categories.length > 0 && (
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-200" data-testid="select-blog-category">
              <option value="">{t("pages.imagingBlog.allCategories")}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16" data-testid="text-no-articles">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("pages.imagingBlog.noArticlesYet")}</h3>
            <p className="text-gray-500">{t("pages.imagingBlog.newEducationalContentIsBeing")}</p>
            <Link href="/medical-imaging" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700" data-testid="link-back-hub">
              Explore Medical Imaging <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-articles">
            {filtered.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        <nav className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("pages.imagingBlog.exploreMedicalImaging")}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/medical-imaging/canada" className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700" data-testid="link-nav-canada">
              {"\u{1F1E8}\u{1F1E6}"} Canada (CAMRT)
            </Link>
            <Link href="/medical-imaging/usa" className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700" data-testid="link-nav-usa">
              {"\u{1F1FA}\u{1F1F8}"} USA (ARRT)
            </Link>
            <Link href="/radiography-practice-questions" className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700" data-testid="link-nav-practice">
              Practice Questions
            </Link>
            <Link href="/radiography-positioning-guide" className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700" data-testid="link-nav-positioning">
              Positioning Guide
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

function BlogArticleDetail() {
  const [, params] = useRoute("/medical-imaging/blog/:slug");
  const slug = params?.slug || "";

  const { data: article, isLoading } = useQuery<BlogArticle>({
    queryKey: ["/api/imaging-seo/blog", slug],
    queryFn: async () => {
      const res = await fetch(`/api/imaging-seo/blog/${slug}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    enabled: !!slug,
  });

  const { data: relatedArticles } = useQuery<{ articles: BlogArticle[] }>({
    queryKey: ["/api/imaging-seo/blog/related", article?.country],
    queryFn: async () => {
      const params = new URLSearchParams({ country: article!.country, status: "published", limit: "6" });
      const res = await fetch(`/api/imaging-seo/blog?${params}`);
      return res.json();
    },
    enabled: !!article,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-not-found">{t("pages.imagingBlog.articleNotFound")}</h1>
        <Link href="/medical-imaging/blog" className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700" data-testid="link-back-blog">
          Back to Blog
        </Link>
      </div>
    );
  }

  const countryMeta = COUNTRY_META[article.country];
  const related = (relatedArticles?.articles || []).filter(a => a.slug !== article.slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.metaTitle || article.title,
    description: article.metaDescription || article.summary || "",
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.nursenest.ca/medical-imaging/blog/${article.slug}` },
  };

  const schemas = [articleSchema];
  if (article.schemaMarkupJson) schemas.push(article.schemaMarkupJson);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={article.metaTitle || article.title}
        description={article.metaDescription || article.summary || `${article.title} - Medical Imaging educational article`}
        keywords={[article.primaryKeyword, ...(article.secondaryKeywords || [])].filter(Boolean).join(", ")}
        canonicalPath={`/medical-imaging/blog/${article.slug}`}
        additionalStructuredData={schemas}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Medical Imaging", url: "/medical-imaging" },
          { name: "Blog", url: "/medical-imaging/blog" },
          { name: article.title, url: `/medical-imaging/blog/${article.slug}` },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <BreadcrumbNav items={[{ name: "Medical Imaging", url: "/medical-imaging" }, { name: "Blog", url: "/medical-imaging/blog" }, { name: article.title, url: "" }]} />

        <header className="mt-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full" data-testid="text-detail-type">
              {ARTICLE_TYPE_LABELS[article.articleType] || article.articleType}
            </span>
            {article.category && <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full" data-testid="text-detail-category">{article.category}</span>}
            <span className="text-xs text-gray-400">{countryMeta?.flag}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3" data-testid="text-article-detail-title">{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.readTimeMinutes} min read</span>
            {article.publishedAt && <span>{new Date(article.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>}
          </div>
        </header>

        {article.summary && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-8 text-indigo-800 text-sm leading-relaxed" data-testid="text-article-summary">
            {article.summary}
          </div>
        )}

        {article.contentHtml && (
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.contentHtml }} data-testid="section-article-content" />
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-400" />
              {article.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full" data-testid={`tag-detail-${i}`}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200" data-testid="section-related-articles">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t("pages.imagingBlog.relatedArticles")}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/medical-imaging/blog/${r.slug}`} className="block p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors" data-testid={`link-related-${r.slug}`}>
                  <span className="text-xs text-indigo-600 font-medium">{ARTICLE_TYPE_LABELS[r.articleType] || r.articleType}</span>
                  <h4 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">{r.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        )}

        <nav className="mt-12 pt-8 border-t border-gray-200 flex justify-center gap-6">
          <Link href="/medical-imaging/blog" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium" data-testid="link-all-articles">{t("pages.imagingBlog.allArticles")}</Link>
          <Link href={`/medical-imaging/${article.country}`} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium" data-testid="link-country-hub">{countryMeta?.flag} {countryMeta?.exam} Hub</Link>
          <Link href="/medical-imaging" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium" data-testid="link-imaging-hub">{t("pages.imagingBlog.medicalImaging")}</Link>
        </nav>
      </div>
    </div>
  );
}

export function ImagingBlogIndex() {
  return <BlogIndex />;
}

export function ImagingBlogDetail() {
  return <BlogArticleDetail />;
}

export default function ImagingBlog() {
  const [location] = useLocation();
  if (location.startsWith("/medical-imaging/blog/") && location !== "/medical-imaging/blog/") {
    return <BlogArticleDetail />;
  }
  return <BlogIndex />;
}
