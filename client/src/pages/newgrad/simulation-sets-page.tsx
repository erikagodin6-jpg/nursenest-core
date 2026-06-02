import { useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PremiumUpgradeCTA, useNewGradEntitlements } from "./premium-cta";
import { useI18n } from "@/lib/i18n";
import {
  WORKPLACE_SCENARIOS,
  WORKPLACE_SCENARIO_CATEGORIES,
  type WorkplaceScenario,
} from "@/data/newgrad/workplace-scenarios";
import {
  ChevronRight, ArrowRight, Lock, CheckCircle2,
  Lightbulb, AlertTriangle, Users, ClipboardList, Shield, Target,
  MessageSquare, Play, ChevronDown, BarChart3, Eye, EyeOff
} from "lucide-react";

interface SimulationSet {
  id: string;
  title: string;
  description: string;
  category: string;
  scenarios: WorkplaceScenario[];
  isPremium: boolean;
}

const CATEGORY_ICONS: Record<string, any> = {
  prioritization: ClipboardList,
  "shift-report": MessageSquare,
  interdisciplinary: Users,
  confidence: Shield,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  prioritization: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  "shift-report": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  interdisciplinary: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
  confidence: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
};

function buildSimulationSets(): SimulationSet[] {

  return WORKPLACE_SCENARIO_CATEGORIES.map((cat) => {
    const scenarios = WORKPLACE_SCENARIOS.filter((s) => s.category === cat.id);
    const hasPremium = scenarios.some((s) => s.isPremium);
    return {
      id: cat.id,
      title: cat.label,
      description: `${scenarios.length} workplace scenarios covering ${cat.label.toLowerCase()} skills and decision-making.`,
      category: cat.id,
      scenarios,
      isPremium: hasPremium,
    };
  });
}

export default function SimulationSetsPage() {
  const { hasToolkitAccess, hasFullAccess } = useNewGradEntitlements();
  const hasAccess = hasToolkitAccess || hasFullAccess;

  const [activeSet, setActiveSet] = useState<string | null>(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const [setComplete, setSetComplete] = useState(false);

  const simulationSets = buildSimulationSets();
  const totalScenarios = WORKPLACE_SCENARIOS.length;
  const totalFree = WORKPLACE_SCENARIOS.filter((s) => !s.isPremium).length;

  const currentSet = simulationSets.find((s) => s.id === activeSet);
  const accessibleScenarios = currentSet
    ? hasAccess
      ? currentSet.scenarios
      : currentSet.scenarios.filter((s) => !s.isPremium)
    : [];
  const currentScenario = accessibleScenarios[currentScenarioIndex];

  const startSet = (setId: string) => {
    setActiveSet(setId);
    setCurrentScenarioIndex(0);
    setShowResponse(false);
    setSetComplete(false);
  };

  const nextScenario = () => {
    if (currentScenario) {
      setCompletedScenarios((prev) => new Set(prev).add(currentScenario.id));
    }
    if (currentScenarioIndex + 1 < accessibleScenarios.length) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setShowResponse(false);
    } else {
      setSetComplete(true);
      setShowResponse(false);
    }
  };

  const returnToSetList = () => {
    setActiveSet(null);
    setCurrentScenarioIndex(0);
    setSetComplete(false);
    setShowResponse(false);
  };

  const prevScenario = () => {
    if (currentScenarioIndex > 0) {
      setCurrentScenarioIndex(currentScenarioIndex - 1);
      setShowResponse(false);
    }
  };

  return (
    <div data-testid="newgrad-simulation-sets-page">
      <Navigation />
      <SEO
        title={t("pages.newgrad.simulationSetsPage.workplaceSimulationSetsStructuredInterview")}
        description={`Practice with ${totalScenarios} structured workplace simulation scenarios. Sequential walkthroughs with feedback for prioritization, communication, teamwork, and confidence building.`}
        keywords="nursing workplace simulation, structured interview practice, nurse simulation sets, new grad nurse practice, workplace scenario walkthroughs"
        canonicalPath="/newgrad/simulation-sets"
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Career Hub", url: "https://www.nursenest.ca/newgrad" },
          { name: "Simulation Sets", url: "https://www.nursenest.ca/newgrad/simulation-sets" },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50/30 to-white" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("pages.newgrad.simulationSetsPage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/newgrad" className="hover:text-blue-600">{t("pages.newgrad.simulationSetsPage.newGradCareerHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-teal-700 font-medium">{t("pages.newgrad.simulationSetsPage.simulationSets")}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-teal-100 text-teal-700">
            <Target className="w-4 h-4" /> Structured Simulations
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-title">
            Workplace Simulation Sets
          </h1>
          <p className="text-lg text-gray-600 mb-6" data-testid="text-subtitle">
            Walk through structured simulation sets organized by skill area. Each set contains {WORKPLACE_SCENARIO_CATEGORIES[0]?.count || 6}–{WORKPLACE_SCENARIO_CATEGORIES[0]?.count || 8} progressive scenarios with expert feedback after each response.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-teal-100 p-3 text-center" data-testid="stat-sets">
              <div className="text-xl font-bold text-teal-700">{simulationSets.length}</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.simulationSetsPage.simulationSets2")}</div>
            </div>
            <div className="bg-white rounded-xl border border-teal-100 p-3 text-center" data-testid="stat-total">
              <div className="text-xl font-bold text-teal-700">{totalScenarios}</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.simulationSetsPage.totalScenarios")}</div>
            </div>
            <div className="bg-white rounded-xl border border-teal-100 p-3 text-center" data-testid="stat-free">
              <div className="text-xl font-bold text-teal-700">{totalFree}</div>
              <div className="text-xs text-gray-500">{t("pages.newgrad.simulationSetsPage.freeScenarios")}</div>
            </div>
          </div>
        </div>
      </section>

      {!activeSet ? (
        <section className="py-16" data-testid="section-sets-list">

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.newgrad.simulationSetsPage.chooseASimulationSet")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {simulationSets.map((set) => {
                const CatIcon = CATEGORY_ICONS[set.category] || Target;
                const colors = CATEGORY_COLORS[set.category] || CATEGORY_COLORS.prioritization;
                const completedInSet = set.scenarios.filter((s) => completedScenarios.has(s.id)).length;
                const freeInSet = set.scenarios.filter((s) => !s.isPremium).length;
                const premiumInSet = set.scenarios.filter((s) => s.isPremium).length;

                return (
                  <div
                    key={set.id}
                    className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-all"
                    data-testid={`card-set-${set.id}`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                        <CatIcon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{set.title}</h3>
                        <p className="text-sm text-gray-500">{set.scenarios.length} scenarios</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{set.description}</p>

                    {completedInSet > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>{t("pages.newgrad.simulationSetsPage.progress")}</span>
                          <span>{completedInSet}/{set.scenarios.length}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(completedInSet / set.scenarios.length) * 100}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">
                          {freeInSet} Free
                        </span>
                        {premiumInSet > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                            {premiumInSet} Premium
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => startSet(set.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
                        data-testid={`button-start-set-${set.id}`}
                      >
                        <Play className="w-3.5 h-3.5" /> Start
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {!hasAccess && (
              <div className="mt-8">
                <PremiumUpgradeCTA
                  requiredEntitlement="toolkit"
                  context={`Unlock all ${totalScenarios} workplace simulation scenarios including premium content on advanced prioritization, difficult team dynamics, and career confidence building.`}
                />
              </div>
            )}
          </div>
        </section>
      ) : setComplete ? (
        <section className="py-16" data-testid="section-set-complete">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <CheckCircle2 className="w-16 h-16 text-teal-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.newgrad.simulationSetsPage.simulationSetComplete")}</h2>
            <p className="text-gray-600 mb-2">You've completed all available scenarios in <strong>{currentSet?.title}</strong>.</p>
            <p className="text-sm text-gray-500 mb-6">
              {completedScenarios.size} total scenarios reviewed across all sets
            </p>
            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => startSet(activeSet!)}
                className="px-5 py-2.5 text-teal-700 bg-teal-50 rounded-xl font-semibold hover:bg-teal-100 border border-teal-200"
                data-testid="button-restart-set"
              >
                Restart This Set
              </button>
              <button
                onClick={returnToSetList}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700"
                data-testid="button-back-to-sets-done"
              >
                Choose Another Set <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      ) : currentScenario ? (
        <section className="py-8" data-testid="section-simulation">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <button
                  onClick={returnToSetList}
                  className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-flex items-center gap-1"
                  data-testid="button-back-to-sets"
                >
                  ← Back to Sets
                </button>
                <h2 className="text-lg font-bold text-gray-900">{currentSet?.title}</h2>
              </div>
              <span className="text-sm font-medium text-gray-500">
                {currentScenarioIndex + 1} / {accessibleScenarios.length}
              </span>
            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-teal-500 rounded-full transition-all"
                style={{ width: `${((currentScenarioIndex + 1) / accessibleScenarios.length) * 100}%` }}
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  currentScenario.difficulty === "beginner" ? "bg-green-50 text-green-600" :
                  currentScenario.difficulty === "intermediate" ? "bg-yellow-50 text-yellow-600" :
                  "bg-red-50 text-red-600"
                }`}>
                  {currentScenario.difficulty}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid="text-scenario-title">
                {currentScenario.title}
              </h3>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-orange-500" /> Scenario
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed bg-orange-50 p-4 rounded-lg">
                  {currentScenario.scenario}
                </p>
              </div>

              <p className="text-sm text-gray-500 italic mb-4">
                Take a moment to think about how you would respond before revealing the expert answer.
              </p>

              {!showResponse ? (
                <button
                  onClick={() => setShowResponse(true)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
                  data-testid="button-reveal-response"
                >
                  <Eye className="w-4 h-4" /> Reveal Expert Response
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Best Response
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed bg-green-50 p-4 rounded-lg">
                      {currentScenario.bestResponse}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-1">
                      <Lightbulb className="w-4 h-4" /> Key Principles
                    </h4>
                    <ul className="space-y-1.5">
                      {currentScenario.keyPrinciples.map((principle, j) => (
                        <li key={j} className="text-sm text-blue-700 flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                          {principle}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-3">
                    {currentScenarioIndex > 0 && (
                      <button
                        onClick={prevScenario}
                        className="px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium text-sm"
                        data-testid="button-prev"
                      >
                        ← Previous
                      </button>
                    )}
                    <button
                      onClick={nextScenario}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
                      data-testid="button-next"
                    >
                      {currentScenarioIndex + 1 >= accessibleScenarios.length ? "Finish Set" : "Next Scenario"} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!hasAccess && currentSet && currentSet.scenarios.some((s) => s.isPremium) && (
              <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4 text-center">
                <Lock className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <p className="text-sm text-indigo-700 font-medium">
                  {currentSet.scenarios.filter((s) => s.isPremium).length} premium scenarios in this set require the New Grad Toolkit
                </p>
                <Link
                  href="/subscribe/newgrad"
                  className="inline-flex items-center gap-1.5 mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
                  data-testid="link-upgrade-inline"
                >
                  Upgrade to unlock <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="py-12 bg-gradient-to-r from-teal-50 to-cyan-50" data-testid="section-bottom-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("pages.newgrad.simulationSetsPage.morePracticeTools")}</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/newgrad/interview" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 border border-teal-200" data-testid="link-interview">
              Interview Question Bank
            </Link>
            <Link href="/newgrad/mock-interview" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 border border-teal-200" data-testid="link-mock">
              Mock Interviews
            </Link>
            <Link href="/newgrad/scenarios" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50 border border-teal-200" data-testid="link-scenarios">
              Scenario Practice
            </Link>
            <Link href="/newgrad" className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700" data-testid="link-hub">
              Career Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
