import { LocaleLink } from "@/lib/LocaleLink";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen,
  Search,
  Calendar,
  ArrowRight,
  Clock,
  Tag,
  User,
  Mail,
  CheckCircle2,
  Bell,
} from "lucide-react";
import { InlineLeadCapture, StickyLeadBanner } from "@/components/lead-capture";
import { ContextualRelatedResources } from "@/components/related-resources";

const CATEGORY_KEYS: Record<string, string> = {
  "clinical-reasoning": "blog.categoryClinicalReasoning",
  "pharmacology": "blog.categoryPharmacology",
  "lab-interpretation": "blog.categoryLabInterpretation",
  "exam-prep": "blog.categoryExamPrep",
  "patient-safety": "blog.categoryPatientSafety",
  "pathophysiology": "blog.categoryPathophysiology",
  "assessment-skills": "blog.categoryAssessmentSkills",
  "medication-safety": "blog.categoryMedicationSafety",
  "nursing-fundamentals": "blog.categoryNursingFundamentals",
  "nursing-education": "blog.categoryNursingEducation",
  "allied-health": "blog.categoryAlliedHealth",
};

const CATEGORY_COLORS: Record<string, string> = {
  "clinical-reasoning": "bg-blue-50 text-blue-700 border-blue-200",
  "pharmacology": "bg-purple-50 text-purple-700 border-purple-200",
  "lab-interpretation": "bg-amber-50 text-amber-700 border-amber-200",
  "exam-prep": "bg-green-50 text-green-700 border-green-200",
  "patient-safety": "bg-red-50 text-red-700 border-red-200",
  "pathophysiology": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "assessment-skills": "bg-teal-50 text-teal-700 border-teal-200",
  "medication-safety": "bg-rose-50 text-rose-700 border-rose-200",
  "nursing-fundamentals": "bg-slate-50 text-slate-700 border-slate-200",
  "nursing-education": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "allied-health": "bg-cyan-50 text-cyan-700 border-cyan-200",
};

function estimateReadTime(content: any[]): number {
  if (!content || !Array.isArray(content)) return 5;
  const totalWords = content.reduce((acc, block) => {
    return acc + (block.content || block.text || "").split(/\s+/).length;
  }, 0);
  return Math.max(3, Math.ceil(totalWords / 200));
}

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [subEmail, setSubEmail] = useState("");
  const [subFrequency, setSubFrequency] = useState<string>("weekly");
  const [subStep, setSubStep] = useState<"email" | "frequency">("email");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subMessage, setSubMessage] = useState("");

  const FREQUENCY_OPTIONS = [
    { value: "daily", label: t("blog.freqDaily") },
    { value: "3x_week", label: t("blog.freq3xWeek") },
    { value: "weekly", label: t("blog.freqWeekly") },
    { value: "biweekly", label: t("blog.freqBiweekly") },
    { value: "monthly", label: t("blog.freqMonthly") },
  ];

  const TIER_FILTERS = [
    { key: null, label: t("blog.filterAll") },
    { key: "rpn", label: t("blog.filterRpn") },
    { key: "rn", label: t("blog.filterRn") },
    { key: "np", label: t("blog.filterNp") },
  ];

  function handleEmailNext(e: React.FormEvent) {
    e.preventDefault();
    if (!subEmail || !subEmail.includes("@")) {
      setSubStatus("error");
      setSubMessage(t("blog.subscribeErrorInvalidEmail"));
      return;
    }
    setSubStatus("idle");
    setSubStep("frequency");
  }

  async function handleSubscribe() {
    setSubStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail, source: "blog", tier: "general", frequency: subFrequency }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubStatus("success");
        setSubMessage(data.message === "Already subscribed" ? t("blog.subscribeAlreadySubscribed") : t("blog.subscribeSuccess"));
        setSubEmail("");
        setSubStep("email");
        setSubFrequency("weekly");
      } else {
        setSubStatus("error");
        setSubMessage(data.error || t("blog.subscribeErrorGeneric"));
      }
    } catch {
      setSubStatus("error");
      setSubMessage(t("blog.subscribeErrorConnection"));
    }
  }

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["/api/content", "blog"],
    queryFn: async () => {
      const types = ["article", "blog-post", "blog"];
      const results: any[] = [];
      for (const tp of types) {
        try {
          const res = await fetch(`/api/content?type=${tp}`);
          if (res.ok) {
            const data = await res.json();
            results.push(...data);
          }
        } catch {}
      }
      const uniqueById = Array.from(new Map(results.map((r: any) => [r.id, r])).values());
      return uniqueById.sort((a: any, b: any) =>
        new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
      );
    },
  });

  const categories: string[] = Array.from(new Set(articles.map((a: any) => a.category).filter(Boolean))) as string[];

  const filteredArticles = articles.filter((article: any) => {
    const matchesSearch = !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.summary || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    const matchesTier = !selectedTier ||
      article.tier === selectedTier ||
      (article.tags && article.tags.some((tg: string) => tg.toLowerCase() === selectedTier)) ||
      (article.title && article.title.toLowerCase().includes(selectedTier === "rpn" ? "rpn" : selectedTier === "rn" ? " rn " : "np")) ||
      (article.category && article.category.toLowerCase().includes(selectedTier));
    return matchesSearch && matchesCategory && matchesTier;
  });

  const baseUrl = "https://www.nursenest.ca";

  const blogPostingItems = filteredArticles.slice(0, 10).map((article: any) => ({
    "@type": "BlogPosting",
    headline: article.title,
    description: article.summary || article.seoDescription || "",
    url: `${baseUrl}/learn/${article.slug}`,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    author: { "@type": "Organization", name: "NurseNest" },
    articleSection: article.category || "Nursing Education",
    ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "NurseNest Clinical Education Blog",
    description: "Evidence-based nursing education articles covering clinical reasoning, pharmacology, lab interpretation, and exam preparation for RPN and RN students.",
    url: `${baseUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: "NurseNest",
      url: baseUrl,
    },
    inLanguage: "en",
    ...(blogPostingItems.length > 0 ? { blogPost: blogPostingItems } : {}),
  };

  function getCategoryLabel(cat: string): string {
    const key = CATEGORY_KEYS[cat];
    return key ? t(key) : cat;
  }

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
      <SEO
        title={t("pages.blog.nursingEducationBlogClinicalReasoning")}
        description={t("pages.blog.evidencebasedNursingArticlesOnClinical")}
        canonicalPath="/blog"
        keywords="nursing blog, clinical reasoning, pharmacology, NCLEX prep, REX-PN, lab interpretation, nursing education, RPN, RN, NP"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Blog", url: "https://www.nursenest.ca/blog" },
        ]}
      />
      <Navigation />

      <main className="flex-grow" data-testid="section-blog">
        <section className="bg-gradient-to-b from-primary/5 to-transparent py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">{t("blog.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" data-testid="text-blog-heading">
              {t("blog.heading")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {t("blog.subtitle")}
            </p>

            <div className="flex items-center justify-center gap-2 mb-6" data-testid="section-tier-filters">
              {TIER_FILTERS.map((tier) => (
                <button
                  key={tier.key || "all"}
                  onClick={() => setSelectedTier(selectedTier === tier.key ? null : tier.key)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    selectedTier === tier.key || (!selectedTier && !tier.key)
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30 hover:text-primary hover:shadow-sm"
                  }`}
                  data-testid={`filter-tier-${tier.key || "all"}`}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t("blog.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-primary/20 bg-white shadow-sm"
                data-testid="input-search-blog"
              />
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-8 border border-primary/15 bg-gradient-to-r from-primary/5 via-white to-primary/5 shadow-sm overflow-hidden" data-testid="card-blog-subscribe">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-gray-900">{t("blog.subscribeTitle")}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{t("blog.subscribeDesc")}</p>
                </div>
                {subStatus === "success" ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl" data-testid="text-subscribe-success">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-sm font-medium text-emerald-700">{subMessage}</span>
                  </div>
                ) : subStep === "email" ? (
                  <form onSubmit={handleEmailNext} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder={t("blog.subscribePlaceholder")}
                        value={subEmail}
                        onChange={(e) => { setSubEmail(e.target.value); if (subStatus === "error") setSubStatus("idle"); }}
                        className="h-11 pl-10 pr-4 w-full sm:w-64 rounded-full border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm bg-white dark:bg-gray-800 dark:text-white"
                        data-testid="input-blog-subscribe-email"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="h-11 px-6 rounded-full bg-primary hover:brightness-110 text-white shadow-sm text-sm font-semibold"
                      data-testid="button-blog-subscribe-next"
                    >
                      {t("blog.subscribeNext")}
                    </Button>
                    {subStatus === "error" && (
                      <p className="text-xs text-red-500 mt-1 sm:absolute sm:top-full sm:left-0 sm:mt-1" data-testid="text-subscribe-error">{subMessage}</p>
                    )}
                  </form>
                ) : (
                  <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0" data-testid="section-subscribe-frequency">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("blog.freqPrompt")}</p>
                    <div className="flex flex-wrap gap-2">
                      {FREQUENCY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSubFrequency(opt.value)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            subFrequency === opt.value
                              ? "bg-primary text-white shadow-sm"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                          data-testid={`button-freq-${opt.value}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSubStep("email")}
                        className="h-10 px-4 rounded-full text-sm"
                        data-testid="button-freq-back"
                      >
                        {t("blog.freqBack")}
                      </Button>
                      <Button
                        type="button"
                        disabled={subStatus === "loading"}
                        onClick={handleSubscribe}
                        className="h-10 px-6 rounded-full bg-primary hover:brightness-110 text-white shadow-sm text-sm font-semibold"
                        data-testid="button-blog-subscribe"
                      >
                        {subStatus === "loading" ? t("blog.subscribing") : t("blog.subscribeButton")}
                      </Button>
                    </div>
                    {subStatus === "error" && (
                      <p className="text-xs text-red-500" data-testid="text-subscribe-error">{subMessage}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8" data-testid="section-blog-categories">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
                data-testid="filter-category-all"
              >
                {t("blog.filterAll")}
              </button>
              {categories.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                  data-testid={`filter-category-${cat}`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery || selectedCategory ? t("blog.noMatchTitle") : t("blog.noArticlesTitle")}
              </h2>
              <p className="text-gray-400">
                {searchQuery || selectedCategory ? t("blog.noMatchDesc") : t("blog.noArticlesDesc")}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredArticles.length > 3 && (
                <div className="hidden sm:block">
                  <InlineLeadCapture
                    leadMagnetType="practice_questions"
                    professionContext="nursing"
                    source="blog_listing"
                  />
                </div>
              )}
              {filteredArticles.map((article: any, idx: number) => (
                <LocaleLink key={article.id} href={`/learn/${article.slug}`}>
                  <Card
                    className="border border-primary/10 hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer group overflow-hidden"
                    data-testid={`card-article-${article.slug}`}
                  >
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex-grow min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {article.category && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${CATEGORY_COLORS[article.category] || "bg-gray-50 text-gray-600"}`}
                              >
                                {getCategoryLabel(article.category)}
                              </Badge>
                            )}
                            {article.tier && article.tier !== "free" && (
                              <Badge variant="secondary" className="text-xs">
                                {article.tier.toUpperCase()}
                              </Badge>
                            )}
                          </div>

                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2" data-testid={`text-article-title-${article.slug}`}>
                            {article.title}
                          </h2>

                          {article.summary && (
                            <p className="text-gray-600 mb-4 line-clamp-2">{article.summary}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            {article.authorName && (
                              <span className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" />
                                {article.authorName}
                              </span>
                            )}
                            {article.publishedAt && (
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(article.publishedAt)}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {estimateReadTime(article.content)} {t("blog.minRead")}
                            </span>
                            {article.tags && article.tags.length > 0 && (
                              <span className="flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5" />
                                {article.tags.slice(0, 3).join(", ")}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center text-primary/50 group-hover:text-primary transition-colors">
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </LocaleLink>
              ))}
            </div>
          )}
        </div>
      </main>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <ContextualRelatedResources
          pageType="blog"
          className="border-t border-gray-200"
        />
      </div>

      <AdminEditButton />
      <Footer />

      <StickyLeadBanner
        leadMagnetType="study_guide"
        professionContext="nursing"
        source="blog_sticky"
      />
    </div>
  );
}
