import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Heart, Activity, Wind, AlertTriangle, Filter } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { HubHero, FilterChip } from "./components";
import { ECGStrip, WaveformDetailCard, MonitorPanel } from "./ecg-components";

import { useI18n } from "@/lib/i18n";
const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Cardiac Rhythms", value: "Cardiac Rhythms" },
  { label: "Heart Blocks", value: "Heart Blocks" },
  { label: "12-Lead Patterns", value: "12-Lead Patterns" },
  { label: "Capnography", value: "Capnography" },
];

const DIFFICULTIES = [
  { label: "All Levels", value: "" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const WAVEFORM_TYPES = [
  { label: "All Types", value: "" },
  { label: "ECG Rhythm", value: "ecg-rhythm" },
  { label: "12-Lead ECG", value: "ecg-12lead" },
  { label: "Capnography", value: "capnography" },
];

function getCategoryIcon(category: string) {

  switch (category) {
    case "Cardiac Rhythms": return Heart;
    case "Heart Blocks": return AlertTriangle;
    case "12-Lead Patterns": return Activity;
    case "Capnography": return Wind;
    default: return Activity;
  }
}

export default function ECGLibraryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [waveformType, setWaveformType] = useState("");
  const [selectedWaveform, setSelectedWaveform] = useState<any>(null);
  const [showMonitor, setShowMonitor] = useState(false);

  const { data: waveforms = [], isLoading } = useQuery({
    queryKey: ["paramedic-waveforms", category, difficulty, waveformType, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (difficulty) params.set("difficulty", difficulty);
      if (waveformType) params.set("waveformType", waveformType);
      if (search) params.set("search", search);
      const res = await fetch(`/api/paramedic-waveforms?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load waveforms");
      return res.json();
    },
  });

  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };

  return (
    <div data-testid="ecg-library-page">
      <AlliedSEO
        title={t("allied.paramedicEcgLibrary.ecgWaveformLibraryParamedicRhythm")}
        description={t("allied.paramedicEcgLibrary.browseClinicallyAccurateEcgRhythm")}
        keywords="ECG library, cardiac rhythm strips, 12-lead ECG patterns, capnography waveforms, paramedic rhythm interpretation, STEMI patterns, heart blocks"
        canonicalPath="/allied-health/paramedic/ecg-library"
      />

      <HubHero
        title={t("allied.paramedicEcgLibrary.ecgWaveformLibrary")}
        subtitle={t("allied.ecg_library.browseClinicallyAccurateEcgRhythm")}
        breadcrumbs={[
          { label: "Paramedic Academy", href: "/allied-health/paramedic" },
          { label: "ECG Library" },
        ]}
      />

      <section className="py-8 sm:py-12 bg-white" data-testid="section-filters">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("allied.paramedicEcgLibrary.searchRhythmsWaveforms")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                data-testid="input-search-waveforms"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap" data-testid="filter-categories">
                <Filter className="w-4 h-4 text-gray-400" />
                {CATEGORIES.map((cat) => (
                  <FilterChip
                    key={cat.value}
                    label={cat.label}
                    active={category === cat.value}
                    onClick={() => setCategory(cat.value)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap" data-testid="filter-difficulty">
                {DIFFICULTIES.map((d) => (
                  <FilterChip
                    key={d.value}
                    label={d.label}
                    active={difficulty === d.value}
                    onClick={() => setDifficulty(d.value)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap" data-testid="filter-type">
                {WAVEFORM_TYPES.map((t) => (
                  <FilterChip
                    key={t.value}
                    label={t.label}
                    active={waveformType === t.value}
                    onClick={() => setWaveformType(t.value)}
                  />
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : selectedWaveform ? (
            <div className="max-w-3xl mx-auto">
              <WaveformDetailCard waveform={selectedWaveform} onClose={() => setSelectedWaveform(null)} />

              {showMonitor && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("allied.paramedicEcgLibrary.monitorView")}</h3>
                  <MonitorPanel
                    svgPathData={selectedWaveform.svgPathData}
                    rhythmName={selectedWaveform.name}
                    heartRate={selectedWaveform.rate?.match(/\d+/)?.[0] ? parseInt(selectedWaveform.rate.match(/\d+/)[0]) : 75}
                  />
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowMonitor(!showMonitor)}
                  className="px-4 py-2 bg-gray-900 text-green-400 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                  data-testid="button-toggle-monitor"
                >
                  {showMonitor ? "Hide Monitor View" : "Show Monitor View"}
                </button>
                <button
                  onClick={() => { setSelectedWaveform(null); setShowMonitor(false); }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  data-testid="button-back-to-list"
                >
                  Back to Library
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-500 mb-4" data-testid="text-count">
                {waveforms.length} waveform{waveforms.length !== 1 ? "s" : ""} found
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {waveforms.map((w: any) => {
                  const Icon = getCategoryIcon(w.category);
                  return (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWaveform(w)}
                      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-teal-200 transition-all text-left group"
                      data-testid={`card-waveform-${w.slug}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Icon className="w-5 h-5 text-teal-500" />
                        <div className="flex gap-1.5">
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">{w.category}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[w.difficulty] || "bg-gray-100 text-gray-600"}`}>
                            {w.difficulty?.charAt(0).toUpperCase() + w.difficulty?.slice(1)}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">{w.name}</h3>

                      <div className="mb-3">
                        <ECGStrip svgPathData={w.svgPathData} mode="strip" height={60} showGrid={true} />
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        {w.rate && (
                          <span className="text-gray-500"><span className="font-medium text-gray-700">{t("allied.paramedicEcgLibrary.rate")}</span> {w.rate}</span>
                        )}
                        {w.regularity && (
                          <span className="text-gray-500"><span className="font-medium text-gray-700">{t("allied.paramedicEcgLibrary.rhythm")}</span> {w.regularity}</span>
                        )}
                      </div>

                      {w.clinicalSignificance && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{w.clinicalSignificance}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
