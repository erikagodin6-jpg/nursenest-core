import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { HubHero, FilterChip, FinalCTASection } from "./components";
import { BookOpen, Target, ArrowRight, Search, Loader2, FileText } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface TopicItem {
  topicSlug: string;
  topic: string;
  category: string;
  questionCount: number;
  difficulties: number[];
}

interface CategoryItem {
  category: string;
  categorySlug: string;
  topicCount: number;
  questionCount: number;
}

interface TopicsData {
  topics: TopicItem[];
  categories: CategoryItem[];
  totalQuestions: number;
  totalTopics: number;
}

export default function ParamedicQuestionsIndex() {
  const { t } = useI18n();
  const [data, setData] = useState<TopicsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("category") || "All";
    }
    return "All";
  });

  useEffect(() => {
    fetch("/api/paramedic/question-topics")
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    if (!data) return [];
    return ["All", ...data.categories.map(c => c.category)];
  }, [data]);

  const filteredTopics = useMemo(() => {
    if (!data) return [];
    return data.topics.filter(t => {
      const matchSearch = !search || t.topic.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "All" || t.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [data, search, activeCategory]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Paramedic Practice Questions by Topic",
    "description": "Browse paramedic practice questions organized by clinical topic. Covers trauma, cardiac, pharmacology, airway, pediatric, OB emergencies, and more.",
    "provider": { "@type": "Organization", "name": "NurseNest Allied", "url": "https://www.nursenest.ca/allied-health" },
    "numberOfItems": data?.totalTopics || 0,
  };

  return (
    <div data-testid="paramedic-questions-index">
      <AlliedSEO
        title={t("allied.paramedicParamedicQuestionsIndex.paramedicPracticeQuestionsByTopic")}
        description={`Browse ${data?.totalQuestions || 500}+ paramedic practice questions organized by ${data?.totalTopics || 100} clinical topics. Covers trauma management, cardiac arrest algorithms, pharmacology, airway management, and more.`}
        keywords="paramedic practice questions, NREMT questions by topic, paramedic exam questions, PCP practice questions, ACP practice questions, EMS practice test"
        canonicalPath="/allied-health/paramedic/questions"
        structuredData={structuredData}
      />

      <HubHero
        title={t("allied.paramedicParamedicQuestionsIndex.paramedicPracticeQuestions")}
        subtitle={`Browse ${data?.totalQuestions || 500}+ practice questions organized by clinical topic. Each topic page includes sample questions with detailed rationales, difficulty levels, and links to related study materials.`}
        breadcrumbs={[
          { label: "Paramedic", href: "/allied-health/paramedic" },
          { label: "Practice Questions" },
        ]}
      />

      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("allied.paramedicParamedicQuestionsIndex.searchTopics")}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                data-testid="input-search-topics"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <FilterChip key={c} label={c} active={activeCategory === c} onClick={() => setActiveCategory(c)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
        </div>
      ) : (
        <>
          {data && activeCategory === "All" && !search && (
            <section className="py-12 bg-gradient-to-b from-purple-50/30 to-white" data-testid="section-categories-overview">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-categories-title">{t("allied.paramedicParamedicQuestionsIndex.questionCategories")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {data.categories.map(cat => (
                    <button
                      key={cat.categorySlug}
                      onClick={() => setActiveCategory(cat.category)}
                      className="bg-white rounded-xl border border-gray-100 p-5 text-left hover:shadow-md hover:border-teal-200 transition-all"
                      data-testid={`card-category-${cat.categorySlug}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                          <FileText className="w-4.5 h-4.5 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{cat.category}</h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{cat.questionCount} questions</span>
                        <span>{cat.topicCount} topics</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="py-12 sm:py-16" data-testid="section-topics-list">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900" data-testid="text-topics-count">
                  {filteredTopics.length} Topic{filteredTopics.length !== 1 ? "s" : ""} Available
                </h2>
                {activeCategory !== "All" && (
                  <button onClick={() => setActiveCategory("All")} className="text-sm text-teal-600 hover:text-teal-700" data-testid="button-clear-filter">
                    Clear filter
                  </button>
                )}
              </div>

              {filteredTopics.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTopics.map(topic => (
                    <Link
                      key={topic.topicSlug}
                      href={`/allied-health/paramedic/questions/${topic.topicSlug}`}
                      className="group"
                      data-testid={`card-topic-${topic.topicSlug}`}
                    >
                      <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all h-full flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-base font-semibold text-gray-900 group-hover:text-teal-700 transition-colors capitalize">
                            {topic.topic}
                          </h3>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors flex-shrink-0 mt-1" />
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{topic.category}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
                            {topic.questionCount} question{topic.questionCount !== 1 ? "s" : ""}
                          </span>
                          <div className="flex gap-1">
                            {topic.difficulties.sort().map(d => (
                              <span
                                key={d}
                                className={`w-2 h-2 rounded-full ${
                                  d <= 2 ? "bg-green-400" : d <= 3 ? "bg-yellow-400" : "bg-red-400"
                                }`}
                                title={`Difficulty ${d}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500" data-testid="text-no-results">{t("allied.paramedicParamedicQuestionsIndex.noTopicsMatchYourSearch")}</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <FinalCTASection
        title={t("allied.paramedicParamedicQuestionsIndex.readyToPracticeParamedicQuestions")}
        subtitle="Start with a free diagnostic to identify your strengths and gaps, then use targeted practice sets to build exam readiness."
        primaryCTA={{ label: "Start Free Diagnostic", href: "/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: "View Pricing", href: "/allied-health/pricing" }}
      />
    </div>
  );
}
