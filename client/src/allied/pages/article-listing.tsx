import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { ChevronRight, FileText, ArrowRight, Loader2, BookOpen, Filter } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { AlliedBreadcrumb } from "@/components/allied-breadcrumb";
import { buildFaqStructuredData } from "@/lib/structured-data";

import { useI18n } from "@/lib/i18n";
const ALLIED_DOMAIN = "https://www.nursenest.ca/allied-health";

const PROFESSION_DISPLAY: Record<string, { name: string; shortName: string; color: string; colorAccent: string }> = {
  rrt: { name: "Registered Respiratory Therapist", shortName: "RRT", color: "#2196F3", colorAccent: "#E3F2FD" },
  paramedic: { name: "Paramedic", shortName: "Paramedic", color: "#F44336", colorAccent: "#FFEBEE" },
  "pharmacy-technician": { name: "Pharmacy Technician", shortName: "Pharm Tech", color: "#9C27B0", colorAccent: "#F3E5F5" },
  mlt: { name: "Medical Laboratory Technologist", shortName: "MLT", color: "#FF9800", colorAccent: "#FFF3E0" },
  imaging: { name: "Medical Imaging Technologist", shortName: "Imaging", color: "#00BCD4", colorAccent: "#E0F7FA" },
  psychotherapy: { name: "Psychotherapist", shortName: "Psychotherapy", color: "#673AB7", colorAccent: "#EDE7F6" },
  "social-work": { name: "Social Worker", shortName: "Social Work", color: "#E91E63", colorAccent: "#FCE4EC" },
  addictions: { name: "Addictions Counsellor", shortName: "Addictions", color: "#795548", colorAccent: "#EFEBE9" },
  "occupational-therapy": { name: "Occupational Therapist", shortName: "OT", color: "#4CAF50", colorAccent: "#E8F5E9" },
  "physical-therapy": { name: "Physical Therapist", shortName: "PT", color: "#FF5722", colorAccent: "#FBE9E7" },
};

const TEMPLATE_LABELS: Record<string, string> = {
  "how-to-become": "Career Guide",
  "salary-guide": "Salary Guide",
  "certification-guide": "Certification",
  "exam-prep-tips": "Exam Prep",
  "day-in-the-life": "Day in the Life",
  "scope-of-practice": "Scope of Practice",
  "skills-competencies": "Skills & Competencies",
  "continuing-education": "Continuing Education",
  "career-advancement": "Career Advancement",
  "clinical-procedures": "Clinical Procedures",
  "job-search-guide": "Job Search",
  "state-requirements": "State Requirements",
  "study-resources": "Study Resources",
  "professional-organizations": "Professional Orgs",
  "vs-comparison": "Comparison",
};

interface ArticleSummary {
  id: string;
  professionSlug: string;
  articleType: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  primaryKeyword: string;
  publishedAt: string;
  createdAt: string;
}

export default function ArticleListingPage() {
  const { t } = useI18n();
  const params = useParams<{ professionSlug: string }>();
  const profSlug = params.professionSlug || "";
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");

  const profession = PROFESSION_DISPLAY[profSlug];

  useEffect(() => {
    if (!profSlug) return;
    setLoading(true);
    fetch(`/api/allied-articles/${profSlug}`)
      .then(r => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then(data => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [profSlug]);

  if (!profession) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.articleListing.professionNotFound")}</h1>
        <p className="text-gray-600">{t("allied.articleListing.theProfessionYoureLookingFor")}</p>
        <Link href="/careers" className="inline-block mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back-careers">{t("allied.articleListing.browseCareers")}</Link>
      </div>
    );
  }

  const filteredArticles = filterType
    ? articles.filter(a => a.articleType === filterType)
    : articles;

  const articleTypes = [...new Set(articles.map(a => a.articleType))];

  const breadcrumbItems = [
    { label: profession.shortName, href: `/allied-health/${profSlug}` },
    { label: "Articles" },
  ];

  return (
    <div data-testid="article-listing-page">
      <AlliedSEO
        title={`${profession.shortName} Career & Study Articles | NurseNest Allied`}
        description={`Expert articles about ${profession.name} careers, certification exams, study strategies, salary guides, and professional development. Comprehensive resources for aspiring and current ${profession.shortName} professionals.`}
        keywords={`${profession.shortName} articles, ${profession.name} career guide, ${profession.shortName} certification, ${profession.shortName} salary, ${profession.shortName} exam prep`}
        canonicalPath={`/allied-health/${profSlug}/articles`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `${profession.shortName} Career & Study Articles`,
          "description": `Expert articles about ${profession.name} careers and certification preparation.`,
          "publisher": { "@type": "Organization", "name": "NurseNest Allied", "url": ALLIED_DOMAIN },
          "url": `${ALLIED_DOMAIN}/allied-health/${profSlug}/articles`,
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "NurseNest", "item": "https://www.nursenest.ca/" },
              { "@type": "ListItem", "position": 2, "name": "Allied Health", "item": "https://www.nursenest.ca/allied-health" },
              { "@type": "ListItem", "position": 3, "name": profession.shortName, "item": `https://www.nursenest.ca/allied-health/${profSlug}` },
              { "@type": "ListItem", "position": 4, "name": "Articles", "item": `https://www.nursenest.ca/allied-health/${profSlug}/articles` },
            ],
          },
        ]}
      />

      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50/30 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AlliedBreadcrumb items={breadcrumbItems} />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4" data-testid="text-listing-title">
            {profession.shortName} Career & Study Articles
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Expert articles covering everything you need to know about becoming and thriving as a {profession.name} — from certification prep to career advancement.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {articleTypes.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2 items-center" data-testid="article-type-filters">
              <Filter className="w-4 h-4 text-gray-400" />
              <button
                onClick={() => setFilterType("")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  !filterType ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                data-testid="filter-all"
              >
                All ({articles.length})
              </button>
              {articleTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filterType === type ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  data-testid={`filter-${type}`}
                >
                  {TEMPLATE_LABELS[type] || type} ({articles.filter(a => a.articleType === type).length})
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("allied.articleListing.noArticlesYet")}</h2>
              <p className="text-gray-500 mb-6">Articles for {profession.shortName} are coming soon. Check back later!</p>
              <Link href={`/${profSlug}`} className="text-teal-600 font-medium hover:underline" data-testid="link-back-hub">
                Back to {profession.shortName} Hub →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article, i) => {
                const articleSlugPart = article.slug.startsWith(profSlug + "-")
                  ? article.slug.slice(profSlug.length + 1)
                  : article.slug;
                return (
                  <Link
                    key={article.id}
                    href={`/allied-health/${profSlug}/${articleSlugPart}`}
                    className="block"
                    data-testid={`link-article-${i}`}
                  >
                    <article className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-teal-200 transition-all">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full font-medium" data-testid={`badge-type-${i}`}>
                          {TEMPLATE_LABELS[article.articleType] || article.articleType}
                        </span>
                        {article.publishedAt && (
                          <span>{new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        )}
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2" data-testid={`text-article-title-${i}`}>
                        {article.title}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-2">{article.metaDescription}</p>
                      <span className="inline-flex items-center gap-1 text-teal-600 text-sm font-medium mt-3">
                        Read article <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-teal-50/40 to-white border-t border-gray-100" data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ready to Start Your {profession.shortName} Exam Prep?</h2>
          <p className="text-gray-600 mb-6">{t("allied.articleListing.practiceWithExamauthenticQuestionsAdaptive")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/diagnostic?career=${profSlug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200" data-testid="button-cta-diagnostic">
              Start Free Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/${profSlug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors border border-teal-200" data-testid="button-cta-hub">
              {profession.shortName} Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
