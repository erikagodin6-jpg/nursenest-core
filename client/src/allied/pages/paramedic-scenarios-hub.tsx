import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Radio, ChevronRight, ArrowRight, Clock, Target, Filter,
  AlertTriangle, Activity, Shield
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
interface ScenarioSummary {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: number;
  professionTrack: string;
  dispatchInfo: string;
  examRelevance: string;
  decisionPoints: any[];
  learningObjectives: string[];
}

const CATEGORIES = [
  "All", "Trauma", "Medical Emergencies", "Cardiac/ACLS", "Pediatric/PALS",
  "OB Emergencies", "Airway Management", "Assessment", "Operations"
];

const TRACKS = ["All", "General", "PCP", "ACP", "NREMT", "EMT"];

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Easy", 2: "Moderate", 3: "Intermediate", 4: "Advanced", 5: "Expert"
};

export default function ParamedicScenariosHub() {
  const { t } = useI18n();
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [trackFilter, setTrackFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (categoryFilter !== "All") params.set("category", categoryFilter);
        if (trackFilter !== "All") params.set("professionTrack", trackFilter);
        if (difficultyFilter) params.set("difficulty", String(difficultyFilter));
        const res = await fetch(`/api/allied/scenarios?${params}`);
        const data = await res.json();
        setScenarios(data.scenarios || []);
        setTotal(data.total || 0);
      } catch (e) {
        console.error("Failed to load scenarios:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [categoryFilter, trackFilter, difficultyFilter]);

  const diffColors: Record<number, string> = {
    1: "bg-green-100 text-green-700",
    2: "bg-blue-100 text-blue-700",
    3: "bg-yellow-100 text-yellow-700",
    4: "bg-orange-100 text-orange-700",
    5: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" data-testid="scenarios-hub-page">
      <AlliedSEO
        title={t("allied.paramedicScenariosHub.paramedicEmsScenarioSimulations")}
        description={t("allied.paramedicScenariosHub.practiceRealisticEmsScenarioSimulations")}
        keywords="paramedic scenarios, EMS simulation, paramedic exam practice, clinical decision making, NREMT practice"
        canonicalPath="/allied-health/paramedic/scenarios"
      />

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/allied-health/paramedic" className="hover:text-teal-600" data-testid="link-breadcrumb-career">{t("allied.paramedicScenariosHub.paramedic")}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-teal-700 font-medium">{t("allied.paramedicScenariosHub.emsScenarios")}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-hub-title">{t("allied.paramedicScenariosHub.emsScenarioSimulations")}</h1>
        <p className="text-gray-600 max-w-2xl">
          Walk through realistic EMS scenarios from dispatch to debrief. Each simulation progressively reveals clinical information and tests your decision-making at critical intervention points.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{t("allied.paramedicScenariosHub.filters")}</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("allied.paramedicScenariosHub.category")}</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
              data-testid="select-category-filter"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("allied.paramedicScenariosHub.professionTrack")}</label>
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
              data-testid="select-track-filter"
            >
              {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("allied.paramedicScenariosHub.difficulty")}</label>
            <select
              value={difficultyFilter ?? ""}
              onChange={(e) => setDifficultyFilter(e.target.value ? parseInt(e.target.value) : null)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
              data-testid="select-difficulty-filter"
            >
              <option value="">{t("allied.paramedicScenariosHub.all")}</option>
              {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : scenarios.length === 0 ? (
        <div className="text-center py-20">
          <Radio className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">{t("allied.paramedicScenariosHub.noScenariosAvailable")}</h2>
          <p className="text-sm text-gray-500">{t("allied.paramedicScenariosHub.scenariosMatchingYourFiltersHavent")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{total} scenario{total !== 1 ? "s" : ""} available</p>
          {scenarios.map((sc) => (
            <Link key={sc.id} href={`/allied-health/paramedic/scenarios/${sc.slug}`}>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-teal-200 hover:shadow-md transition-all cursor-pointer" data-testid={`scenario-card-${sc.id}`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center flex-shrink-0">
                    <Radio className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{sc.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColors[sc.difficulty] || diffColors[3]}`}>
                        {DIFFICULTY_LABELS[sc.difficulty] || "Intermediate"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{sc.dispatchInfo}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> {sc.category}</span>
                      <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> {sc.decisionPoints?.length || 0} decision points</span>
                      <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> {sc.professionTrack}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t("allied.paramedicScenariosHub.15Min")}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
