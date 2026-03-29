import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { BookOpen, Target, ArrowRight, Search, Loader2, FileText } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface ProfessionConfig {
  key: string;
  label: string;
  shortLabel: string;
  examNames: string;
  diagnosticHref: string;
  heroGradient: string;
  heroAccent: string;
}

const PROFESSION_CONFIGS: Record<string, ProfessionConfig> = {
  rrt: {
    key: "rrt",
    label: "Respiratory Therapy",
    shortLabel: "RRT",
    examNames: "NBRC TMC/CSE and CSRT",
    diagnosticHref: "/diagnostic?career=rrt",
    heroGradient: "from-blue-50 via-white to-teal-50",
    heroAccent: "teal",
  },
  mlt: {
    key: "mlt",
    label: "Medical Laboratory Technology",
    shortLabel: "MLT",
    examNames: "ASCP BOC and CSMLS",
    diagnosticHref: "/diagnostic?career=mlt",
    heroGradient: "from-purple-50 via-white to-indigo-50",
    heroAccent: "indigo",
  },
  imaging: {
    key: "imaging",
    label: "Medical Imaging",
    shortLabel: "Imaging",
    examNames: "ARRT and CAMRT",
    diagnosticHref: "/diagnostic?career=imaging",
    heroGradient: "from-amber-50 via-white to-orange-50",
    heroAccent: "orange",
  },
  occupationalTherapy: {
    key: "occupationalTherapy",
    label: "Occupational Therapy Assistant",
    shortLabel: "OTA",
    examNames: "NBCOT COTA",
    diagnosticHref: "/diagnostic?career=occupationalTherapy",
    heroGradient: "from-emerald-50 via-white to-green-50",
    heroAccent: "emerald",
  },
  physicalTherapy: {
    key: "physicalTherapy",
    label: "Physical Therapy Assistant",
    shortLabel: "PTA",
    examNames: "NPTE-PTA and FSBPT",
    diagnosticHref: "/diagnostic?career=physicalTherapy",
    heroGradient: "from-sky-50 via-white to-cyan-50",
    heroAccent: "sky",
  },
  surgicalTechnologist: {
    key: "surgicalTechnologist",
    label: "Surgical Technologist",
    shortLabel: "CST",
    examNames: "NBSTSA CST",
    diagnosticHref: "/diagnostic?career=surgicalTechnologist",
    heroGradient: "from-red-50 via-white to-rose-50",
    heroAccent: "red",
  },
  healthInfoMgmt: {
    key: "healthInfoMgmt",
    label: "Health Information Management",
    shortLabel: "HIM",
    examNames: "RHIT, RHIA, and AHIMA",
    diagnosticHref: "/diagnostic?career=healthInfoMgmt",
    heroGradient: "from-violet-50 via-white to-purple-50",
    heroAccent: "violet",
  },
  diagnosticSonography: {
    key: "diagnosticSonography",
    label: "Diagnostic Sonography",
    shortLabel: "RDMS",
    examNames: "ARDMS SPI and RDMS",
    diagnosticHref: "/diagnostic?career=diagnosticSonography",
    heroGradient: "from-cyan-50 via-white to-blue-50",
    heroAccent: "cyan",
  },
  cardiacSonographer: {
    key: "cardiacSonographer",
    label: "Cardiac Sonography",
    shortLabel: "RDCS",
    examNames: "ARDMS RDCS and CCI RCS",
    diagnosticHref: "/diagnostic?career=cardiacSonographer",
    heroGradient: "from-pink-50 via-white to-rose-50",
    heroAccent: "pink",
  },
};

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

export default function AlliedQuestionsIndexPage({ professionKey }: { professionKey: string }) {
  const { t } = useI18n();
  const profession = PROFESSION_CONFIGS[professionKey];
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
    fetch(`/api/${professionKey}/question-topics`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [professionKey]);

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

  if (!profession) {
    return <div className="min-h-[60vh] flex items-center justify-center text-gray-500">{t("allied.alliedQuestionsIndex.professionNotFound")}</div>;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${profession.label} Practice Questions by Topic`,
    "description": `Browse ${profession.shortLabel} practice questions organized by clinical topic. Covers key ${profession.examNames} exam domains.`,
    "provider": { "@type": "Organization", "name": "NurseNest Allied", "url": "https://www.nursenest.ca/allied-health" },
    "numberOfItems": data?.totalTopics || 0,
  };

  return (
    <div data-testid={`${professionKey}-questions-index`}>
      <AlliedSEO
        title={`${profession.label} Practice Questions by Topic — ${profession.examNames} | NurseNest`}
        description={`Browse ${data?.totalQuestions || 500}+ ${profession.shortLabel} practice questions organized by ${data?.totalTopics || 100} clinical topics. Prepare for ${profession.examNames} certification exams.`}
        keywords={`${profession.shortLabel} practice questions, ${profession.shortLabel} exam questions, ${profession.label} questions by topic, ${profession.examNames} practice test`}
        canonicalPath={`/${professionKey}/questions`}
        structuredData={structuredData}
      />

      <section className={`relative bg-gradient-to-br ${profession.heroGradient} py-12 sm:py-16 border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
            <Link href={`/${professionKey}`} className="hover:text-gray-700">{profession.shortLabel}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{t("allied.alliedQuestionsIndex.practiceQuestions")}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-teal-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900" data-testid="text-hero-title">
              {profession.shortLabel} Practice Questions
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl" data-testid="text-hero-subtitle">
            Browse {data?.totalQuestions || "500"}+ practice questions organized by clinical topic. Each topic page includes sample questions with detailed rationales, difficulty levels, and links to related study materials.
          </p>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("allied.alliedQuestionsIndex.searchTopics")}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                data-testid="input-search-topics"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeCategory === c
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  data-testid={`filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {c}
                </button>
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
            <section className="py-12 bg-gradient-to-b from-gray-50/50 to-white" data-testid="section-categories-overview">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6" data-testid="text-categories-title">{t("allied.alliedQuestionsIndex.questionCategories")}</h2>
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
                          <FileText className="w-4 h-4 text-teal-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">{cat.category}</h3>
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
                      href={`/${professionKey}/questions/${topic.topicSlug}`}
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
                            {[...topic.difficulties].sort().map(d => (
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
                  <p className="text-gray-500" data-testid="text-no-results">{t("allied.alliedQuestionsIndex.noTopicsMatchYourSearch")}</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <section className="py-16 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" data-testid="text-cta-title">
            Ready to Practice {profession.shortLabel} Questions?
          </h2>
          <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
            Start with a free diagnostic to identify your strengths and gaps, then use targeted practice sets to build exam readiness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={profession.diagnosticHref}
              className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 px-6 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-colors"
              data-testid="link-cta-diagnostic"
            >
              Start Free Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/allied-health/pricing"
              className="inline-flex items-center justify-center gap-2 border-2 border-teal-300 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-500 transition-colors"
              data-testid="link-cta-pricing"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
