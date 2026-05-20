import { useState, useEffect } from "react";
import { Settings, Play, BarChart3, Save, AlertCircle, CheckCircle, Users } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface CATSettings {
  minQuestions: number;
  maxQuestions: number;
  timeLimit: number;
  stabilityThreshold: number;
  exposureMax: number;
  contentTargets: Record<string, number>;
  abilityCapPerQuestion: number;
  rapidGuessThresholdMs: number;
  noBacktracking: boolean;
}

interface SimResult {
  profile: string;
  questionsUsed: number;
  finalAbility: number;
  stoppedReason: string;
  totalCorrect: number;
  totalIncorrect: number;
  overallScore: number;
  categoryBreakdown: Record<string, { total: number; correct: number; pct: number }>;
}

const DEFAULT_CONTENT_TARGETS: Record<string, number> = {
  "Hematology": 25,
  "Clinical Chemistry": 25,
  "Microbiology": 20,
  "Immunohematology/Blood Banking": 15,
  "Urinalysis & Body Fluids": 10,
  "Laboratory Operations": 5,
};

export default function MltAdminCat() {
  const { t } = useI18n();
  const [settings, setSettings] = useState<CATSettings>({
    minQuestions: 60,
    maxQuestions: 130,
    timeLimit: 150,
    stabilityThreshold: 0.3,
    exposureMax: 0.25,
    contentTargets: { ...DEFAULT_CONTENT_TARGETS },
    abilityCapPerQuestion: 0.5,
    rapidGuessThresholdMs: 3000,
    noBacktracking: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [simulating, setSimulating] = useState(false);
  const [simResults, setSimResults] = useState<SimResult[]>([]);
  const [activeTab, setActiveTab] = useState<"settings" | "simulator">("settings");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await fetch("/api/mlt/admin/cat-settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({
          minQuestions: data.minQuestions || 60,
          maxQuestions: data.maxQuestions || 130,
          timeLimit: data.timeLimit || 150,
          stabilityThreshold: data.stabilityThreshold || 0.3,
          exposureMax: data.exposureMax || 0.25,
          contentTargets: data.contentTargets || { ...DEFAULT_CONTENT_TARGETS },
          abilityCapPerQuestion: data.abilityCapPerQuestion || 0.5,
          rapidGuessThresholdMs: data.rapidGuessThresholdMs || 3000,
          noBacktracking: data.noBacktracking ?? true,
        });
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/mlt/admin/cat-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message);
    }
    setSaving(false);
  }

  async function runSimulation(profileType: string) {
    setSimulating(true);
    try {
      const res = await fetch("/api/mlt/admin/cat-simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileType, catParams: settings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSimResults((prev) => [data, ...prev].slice(0, 10));
    } catch (e: any) {
      setError(e.message);
    }
    setSimulating(false);
  }

  async function runAllProfiles() {
    setSimulating(true);
    const results: SimResult[] = [];
    for (const profile of ["strong", "average", "weak"]) {
      try {
        const res = await fetch("/api/mlt/admin/cat-simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileType: profile, catParams: settings }),
        });
        const data = await res.json();
        if (res.ok) results.push(data);
      } catch {}
    }
    setSimResults(results);
    setSimulating(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-7 h-7 text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="text-admin-cat-title">{t("allied.mltMltAdminCat.mltCatSettings")}</h1>
          <p className="text-sm text-gray-500">{t("allied.mltMltAdminCat.configureAdaptiveTestingParametersAnd")}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === "settings" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}
          data-testid="button-tab-settings"
        >
          <Settings className="w-4 h-4 inline mr-1" /> Settings
        </button>
        <button
          onClick={() => setActiveTab("simulator")}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === "simulator" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}
          data-testid="button-tab-simulator"
        >
          <Play className="w-4 h-4 inline mr-1" /> Simulator
        </button>
      </div>

      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">{t("allied.mltMltAdminCat.questionParameters")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltAdminCat.minQuestions")}</label>
                <input
                  type="number"
                  value={settings.minQuestions}
                  onChange={(e) => setSettings({ ...settings, minQuestions: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  data-testid="input-min-questions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltAdminCat.maxQuestions")}</label>
                <input
                  type="number"
                  value={settings.maxQuestions}
                  onChange={(e) => setSettings({ ...settings, maxQuestions: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  data-testid="input-max-questions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltAdminCat.timeLimitMin")}</label>
                <input
                  type="number"
                  value={settings.timeLimit}
                  onChange={(e) => setSettings({ ...settings, timeLimit: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  data-testid="input-time-limit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltAdminCat.stabilityThreshold")}</label>
                <input
                  type="number"
                  step="0.05"
                  value={settings.stabilityThreshold}
                  onChange={(e) => setSettings({ ...settings, stabilityThreshold: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  data-testid="input-stability-threshold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltAdminCat.exposureMax")}</label>
                <input
                  type="number"
                  step="0.05"
                  value={settings.exposureMax}
                  onChange={(e) => setSettings({ ...settings, exposureMax: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  data-testid="input-exposure-max"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltAdminCat.abilityCapQuestion")}</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.abilityCapPerQuestion}
                  onChange={(e) => setSettings({ ...settings, abilityCapPerQuestion: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  data-testid="input-ability-cap"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("allied.mltMltAdminCat.rapidGuessThresholdMs")}</label>
                <input
                  type="number"
                  value={settings.rapidGuessThresholdMs}
                  onChange={(e) => setSettings({ ...settings, rapidGuessThresholdMs: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  data-testid="input-rapid-guess"
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.noBacktracking}
                    onChange={(e) => setSettings({ ...settings, noBacktracking: e.target.checked })}
                    className="rounded border-gray-300"
                    data-testid="checkbox-no-backtracking"
                  />
                  <span className="text-sm text-gray-700">{t("allied.mltMltAdminCat.noBacktracking")}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">{t("allied.mltMltAdminCat.contentTargets")}</h3>
            <div className="space-y-3">
              {Object.entries(settings.contentTargets).map(([cat, pct]) => (
                <div key={cat} className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 flex-1">{cat}</label>
                  <input
                    type="number"
                    value={pct}
                    onChange={(e) => {
                      const newTargets = { ...settings.contentTargets, [cat]: Number(e.target.value) };
                      setSettings({ ...settings, contentTargets: newTargets });
                    }}
                    className="w-20 px-3 py-1.5 border rounded-lg text-sm text-right"
                    data-testid={`input-target-${cat}`}
                  />
                  <span className="text-xs text-gray-400">%</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={saveSettings}
            disabled={saving}
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
            data-testid="button-save-settings"
          >
            {saving ? "Saving..." : saved ? <><CheckCircle className="w-4 h-4" /> {t("allied.mltMltAdminCat.saved")}</> : <><Save className="w-4 h-4" /> {t("allied.mltMltAdminCat.saveSettings")}</>}
          </button>
        </div>
      )}

      {activeTab === "simulator" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Student Simulation
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Simulate how different student profiles perform with current CAT settings.
            </p>
            <div className="flex gap-3 mb-4">
              {["strong", "average", "weak"].map((profile) => (
                <button
                  key={profile}
                  onClick={() => runSimulation(profile)}
                  disabled={simulating}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all border-2
                    ${profile === "strong" ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" :
                      profile === "average" ? "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100" :
                      "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"}
                    disabled:opacity-50
                  `}
                  data-testid={`button-sim-${profile}`}
                >
                  {profile.charAt(0).toUpperCase() + profile.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={runAllProfiles}
              disabled={simulating}
              className="w-full py-2.5 bg-purple-100 text-purple-700 font-medium rounded-xl hover:bg-purple-200 disabled:opacity-50 flex items-center justify-center gap-2"
              data-testid="button-sim-all"
            >
              {simulating ? "Simulating..." : <><Play className="w-4 h-4" /> {t("allied.mltMltAdminCat.runAllProfiles")}</>}
            </button>
          </div>

          {simResults.length > 0 && (
            <div className="space-y-4">
              {simResults.map((result, i) => (
                <div key={i} className="bg-white rounded-2xl border p-6 shadow-sm" data-testid={`sim-result-${i}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900 capitalize">{result.profile} Student</h4>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${result.overallScore >= 70 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {result.overallScore}%
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center mb-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{result.questionsUsed}</p>
                      <p className="text-xs text-gray-500">{t("allied.mltMltAdminCat.questions")}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{result.totalCorrect}</p>
                      <p className="text-xs text-gray-500">{t("allied.mltMltAdminCat.correct")}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{result.totalIncorrect}</p>
                      <p className="text-xs text-gray-500">{t("allied.mltMltAdminCat.incorrect")}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{result.finalAbility}</p>
                      <p className="text-xs text-gray-500">{t("allied.mltMltAdminCat.ability")}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Stopped: {result.stoppedReason.replace(/_/g, " ")}</p>

                  {result.categoryBreakdown && (
                    <div className="mt-4 space-y-2">
                      {Object.entries(result.categoryBreakdown).map(([cat, stats]) => (
                        <div key={cat} className="flex items-center gap-2 text-xs">
                          <span className="text-gray-600 flex-1 truncate">{cat}</span>
                          <span className="text-gray-400">{stats.correct}/{stats.total}</span>
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${stats.pct >= 70 ? "bg-green-400" : stats.pct >= 50 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${stats.pct}%` }} />
                          </div>
                          <span className="text-gray-500 w-8 text-right">{stats.pct}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
