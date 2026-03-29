import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PremiumUpgradeCTA, useNewGradAccess } from "./premium-cta";
import { useI18n } from "@/lib/i18n";
import {
  WORKPLACE_SCENARIOS,
  WORKPLACE_SCENARIO_CATEGORIES,
} from "@/data/newgrad/workplace-scenarios";
import {
  ChevronRight, ChevronDown, ArrowRight, Lock, CheckCircle2,
  Lightbulb, AlertTriangle, Users, ClipboardList, Shield, Target,
  MessageSquare, Shuffle, BarChart3, Layers
} from "lucide-react";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const CATEGORY_ICONS: Record<string, any> = {
  prioritization: ClipboardList,
  "shift-report": MessageSquare,
  interdisciplinary: Users,
  confidence: Shield,
};

const CATEGORY_COLORS: Record<string, string> = {
  prioritization: "bg-blue-50 text-blue-600",
  "shift-report": "bg-emerald-50 text-emerald-600",
  interdisciplinary: "bg-purple-50 text-purple-600",
  confidence: "bg-amber-50 text-amber-600",
};

export default function ScenariosPage() {
  const { t } = useI18n();
  const { hasAccess } = useNewGradAccess();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const [randomMode, setRandomMode] = useState(false);
  const [randomSeed, setRandomSeed] = useState(0);
  const [reviewedScenarios, setReviewedScenarios] = useState<Set<string>>(new Set());

  const markReviewed = useCallback((scenarioId: string) => {
    setReviewedScenarios((prev) => new Set(prev).add(scenarioId));
  }, []);

  const generateRandomSet = useCallback(() => {
    setRandomMode(true);
    setRandomSeed((s) => s + 1);
    setExpandedScenario(null);
  }, []);

  const filteredScenarios = activeCategory
    ? WORKPLACE_SCENARIOS.filter((s) => s.category === activeCategory)
    : WORKPLACE_SCENARIOS;

  const applyRandom = useMemo(() => {
    if (!randomMode) return (arr: typeof WORKPLACE_SCENARIOS) => arr;
    return (arr: typeof WORKPLACE_SCENARIOS) => shuffleArray(arr).slice(0, Math.min(8, arr.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomMode, randomSeed]);

  const freeScenarios = applyRandom(filteredScenarios.filter((s) => !s.isPremium));
  const premiumScenarios = applyRandom(filteredScenarios.filter((s) => s.isPremium));

  const totalScenarios = WORKPLACE_SCENARIOS.length;
  const totalFree = WORKPLACE_SCENARIOS.filter((s) => !s.isPremium).length;

  return (
    <div data-testid="newgrad-scenarios-page">
      <Navigation />
      <SEO
        title={t("pages.newgrad.scenariosPage.workplaceReadinessScenariosForNew")}
        description={`Practice with ${totalScenarios} workplace readiness scenarios covering prioritization, delegation, shift communication, interdisciplinary teamwork, and new grad confidence drills. Build job-readiness skills for your first nursing position.`}
        keywords="new grad nurse workplace scenarios, nursing prioritization practice, nurse delegation scenarios, shift report practice, nursing confidence drills, new nurse workplace readiness, interdisciplinary team nursing"
        canonicalPath="/newgrad/scenarios"
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Career Hub", url: "https://www.nursenest.ca/newgrad" },
          { name: "Workplace Scenarios", url: "https://www.nursenest.ca/newgrad/scenarios" },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50/30 to-white" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("pages.newgrad.scenariosPage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/newgrad" className="hover:text-blue-600">{t("pages.newgrad.scenariosPage.newGradCareerHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-teal-700 font-medium">{t("pages.newgrad.scenariosPage.workplaceScenarios")}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-teal-100 text-teal-700">
            <Target className="w-4 h-4" /> Workplace Readiness
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-title">
            Workplace Readiness Scenario Bank
          </h1>
          <p className="text-lg text-gray-600 mb-6" data-testid="text-subtitle">
            Practice with {totalScenarios} real-world workplace scenarios covering prioritization, delegation, shift communication, interdisciplinary teamwork, and confidence-building drills. Each scenario includes expert analysis and key principles.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-medium">
              <CheckCircle2 className="w-4 h-4" /> {totalFree} Free Scenarios
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full font-medium">
              <Lock className="w-4 h-4" /> {totalScenarios - totalFree} Premium Scenarios
            </span>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-100" data-testid="section-categories">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => { setActiveCategory(null); setRandomMode(false); }}
              className={`px-4 py-2 text-sm rounded-full font-medium transition-colors ${
                !activeCategory ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              data-testid="button-category-all"
            >
              All ({totalScenarios})
            </button>
            {WORKPLACE_SCENARIO_CATEGORIES.map((cat) => {
              const CatIcon = CATEGORY_ICONS[cat.id] || Target;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(activeCategory === cat.id ? null : cat.id); setRandomMode(false); }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full font-medium transition-colors ${
                    activeCategory === cat.id ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  data-testid={`button-category-${cat.id}`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  {cat.label} ({cat.count})
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={generateRandomSet}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg font-medium bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors"
              data-testid="button-random-scenarios"
            >
              <Shuffle className="w-3.5 h-3.5" /> Random Set of 8
            </button>
            {randomMode && (
              <button
                onClick={() => setRandomMode(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
                data-testid="button-show-all-scenarios"
              >
                Show All
              </button>
            )}
            <Link
              href="/newgrad/simulation-sets"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg font-medium bg-teal-600 text-white hover:bg-teal-700 transition-colors ml-auto"
              data-testid="button-simulation-sets"
            >
              <Layers className="w-3.5 h-3.5" /> Structured Simulation Sets
            </Link>
            {reviewedScenarios.size > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-full bg-green-50 text-green-600 font-medium" data-testid="badge-scenarios-progress">
                <BarChart3 className="w-3 h-3" /> {reviewedScenarios.size} reviewed
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-free-scenarios">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">{t("pages.newgrad.scenariosPage.freeScenarios")}</h2>
          </div>
          <div className="space-y-4">
            {freeScenarios.map((scenario) => {
              const CatIcon = CATEGORY_ICONS[scenario.category] || Target;
              const catColor = CATEGORY_COLORS[scenario.category] || "bg-gray-50 text-gray-600";
              const isExpanded = expandedScenario === scenario.id;
              return (
                <div
                  key={scenario.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                  data-testid={`scenario-${scenario.id}`}
                >
                  <button
                    onClick={() => { setExpandedScenario(isExpanded ? null : scenario.id); markReviewed(scenario.id); }}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    data-testid={`button-scenario-${scenario.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>
                          <CatIcon className="w-3 h-3" />
                          {WORKPLACE_SCENARIO_CATEGORIES.find((c) => c.id === scenario.category)?.label}
                        </span>
                        {reviewedScenarios.has(scenario.id) && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          scenario.difficulty === "beginner" ? "bg-green-50 text-green-600" :
                          scenario.difficulty === "intermediate" ? "bg-yellow-50 text-yellow-600" :
                          "bg-red-50 text-red-600"
                        }`}>
                          {scenario.difficulty}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{scenario.title}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-5 border-t border-gray-100 pt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-orange-500" /> Scenario
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{scenario.scenario}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-green-500" /> Best Response
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{scenario.bestResponse}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" /> Key Principles
                        </h4>
                        <ul className="space-y-1">
                          {scenario.keyPrinciples.map((principle, j) => (
                            <li key={j} className="text-sm text-blue-700 flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                              {principle}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {premiumScenarios.length > 0 && hasAccess && (
        <section className="py-16 bg-gray-50" data-testid="section-premium-scenarios">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.newgrad.scenariosPage.premiumScenarios")}</h2>
            <div className="space-y-4">
              {premiumScenarios.map((scenario) => {
                const CatIcon = CATEGORY_ICONS[scenario.category] || Target;
                const catColor = CATEGORY_COLORS[scenario.category] || "bg-gray-50 text-gray-600";
                const isExpanded = expandedScenario === scenario.id;
                return (
                  <div
                    key={scenario.id}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                    data-testid={`scenario-premium-${scenario.id}`}
                  >
                    <button
                      onClick={() => setExpandedScenario(isExpanded ? null : scenario.id)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>
                            <CatIcon className="w-3 h-3" />
                            {WORKPLACE_SCENARIO_CATEGORIES.find((c) => c.id === scenario.category)?.label}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{scenario.title}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                    {isExpanded && (
                      <div className="px-6 pb-5 border-t border-gray-100 pt-4 space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">{t("pages.newgrad.scenariosPage.scenario")}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{scenario.scenario}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">{t("pages.newgrad.scenariosPage.bestResponse")}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{scenario.bestResponse}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <h4 className="text-sm font-semibold text-blue-800 mb-2">{t("pages.newgrad.scenariosPage.keyPrinciples")}</h4>
                          <ul className="space-y-1">
                            {scenario.keyPrinciples.map((p, j) => (
                              <li key={j} className="text-sm text-blue-700 flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {!hasAccess && premiumScenarios.length > 0 && (
        <section className="py-16 bg-gray-50" data-testid="section-premium-preview">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-indigo-500" />
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.newgrad.scenariosPage.premiumScenariosPreview")}</h2>
            </div>
            <div className="space-y-3 mb-6">
              {premiumScenarios.slice(0, 5).map((s) => (
                <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 opacity-75" data-testid={`preview-scenario-${s.id}`}>
                  <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600">{s.title}</span>
                </div>
              ))}
            </div>
            <PremiumUpgradeCTA
              requiredEntitlement="toolkit"
              context={`Unlock all ${totalScenarios} workplace readiness scenarios including advanced prioritization challenges, interdisciplinary team dynamics, and new grad confidence-building drills.`}
            />
          </div>
        </section>
      )}

      <section className="py-12 bg-gradient-to-r from-teal-50 to-emerald-50" data-testid="section-bottom-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("pages.newgrad.scenariosPage.moreCareerReadinessResources")}</h2>
          <p className="text-sm text-gray-500 mb-4">
            Complete your job-readiness toolkit with interview prep, resume templates, and professional development resources.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/newgrad/interview" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors border border-teal-200" data-testid="link-interview">
              Interview Prep
            </Link>
            <Link href="/newgrad/resume" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors border border-teal-200" data-testid="link-resume">
              Resume & Cover Letters
            </Link>
            <Link href="/newgrad/workplace" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-colors border border-teal-200" data-testid="link-workplace">
              Workplace Navigation
            </Link>
            <Link href="/newgrad" className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors" data-testid="link-hub">
              Career Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
