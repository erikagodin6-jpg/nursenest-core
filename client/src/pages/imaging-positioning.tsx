import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { MapPin, ArrowLeft, Search, Target, Eye, BookOpen, Star } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const EXAM_MAP: Record<string, { exam: string; label: string }> = {
  canada: { exam: "CAMRT", label: "Canada" },
  usa: { exam: "ARRT", label: "USA" },
};

const BODY_REGIONS = [
  "All",
  "Chest",
  "Upper Extremity",
  "Lower Extremity",
  "Spine",
  "Abdomen",
  "Pelvis/Hip",
  "Shoulder",
  "Skull",
];

const REGION_COLORS: Record<string, string> = {
  Chest: "bg-blue-50 text-blue-700 border-blue-200",
  "Upper Extremity": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Lower Extremity": "bg-purple-50 text-purple-700 border-purple-200",
  Spine: "bg-amber-50 text-amber-700 border-amber-200",
  Abdomen: "bg-rose-50 text-rose-700 border-rose-200",
  "Pelvis/Hip": "bg-cyan-50 text-cyan-700 border-cyan-200",
  Shoulder: "bg-orange-50 text-orange-700 border-orange-200",
  Skull: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const RELEVANCE_ICONS: Record<string, string> = {
  high: "text-red-500",
  medium: "text-amber-500",
  low: "text-gray-400",
};

export default function ImagingPositioningPage() {
  const { t } = useI18n();
  const [, params] = useRoute("/medical-imaging/:country/positioning");
  const country = params?.country || "canada";
  const examInfo = EXAM_MAP[country] || EXAM_MAP.canada;
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/imaging/positioning", country],
    queryFn: () => fetch(`/api/imaging/positioning?status=published&country=${country}`).then(r => r.json()),
  });

  const filtered = useMemo(() => {
    return entries.filter((e: any) => {
      const region = e.bodyRegion || e.bodyPart || "";
      if (regionFilter !== "All" && region !== regionFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          (e.bodyPart || "").toLowerCase().includes(q) ||
          (e.projectionName || "").toLowerCase().includes(q) ||
          (e.patientPosition || "").toLowerCase().includes(q) ||
          (e.anatomyDemonstrated || "").toLowerCase().includes(q) ||
          (e.bodyRegion || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [entries, regionFilter, search]);

  const groupedByRegion = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filtered.forEach((e: any) => {
      const region = e.bodyRegion || e.bodyPart || "Other";
      if (!groups[region]) groups[region] = [];
      groups[region].push(e);
    });
    return groups;
  }, [filtered]);

  return (
    <div data-testid="imaging-positioning-page">
      <SEO
        title={`${examInfo.exam} Radiographic Positioning Guide — All Projections | NurseNest`}
        description={`Complete radiographic positioning guide for ${examInfo.exam} exam preparation. Step-by-step projection guides, anatomy views, positioning error recognition, and exam-style questions.`}
        keywords={`${examInfo.exam} positioning, radiographic positioning, projection guide, central ray, patient positioning`}
        canonicalPath={`/medical-imaging/${country}/positioning`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Medical Imaging", url: "https://www.nursenest.ca/medical-imaging" },
          { name: examInfo.label, url: `https://www.nursenest.ca/medical-imaging/${country}` },
          { name: "Positioning Guide", url: `https://www.nursenest.ca/medical-imaging/${country}/positioning` },
        ]} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/medical-imaging/${country}`} className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mb-6" data-testid="link-back">
          <ArrowLeft className="w-4 h-4" /> Back to {examInfo.exam} Prep
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" data-testid="text-positioning-title">
              Radiographic Positioning Guide
            </h1>
            <p className="text-sm text-gray-500">{filtered.length} projection{filtered.length !== 1 ? "s" : ""} for {examInfo.exam} exam prep</p>
          </div>
        </div>

        <p className="text-gray-600 mb-8 max-w-3xl">
          Master radiographic positioning with step-by-step projection guides, interactive anatomy labels,
          positioning error recognition, and exam-style questions. Click any projection to access the full learning module.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("pages.imagingPositioning.searchProjectionsBodyPartsAnatomy")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              data-testid="input-search-positioning"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {BODY_REGIONS.map(r => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                regionFilter === r
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
              data-testid={`button-filter-${r.toLowerCase().replace(/[^a-z]/g, '-')}`}
            >
              {r}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-gray-400">
            <MapPin className="w-10 h-10 mx-auto mb-3 animate-pulse" />
            <p>{t("pages.imagingPositioning.loadingPositioningEntries")}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium text-gray-500">{t("pages.imagingPositioning.noPositioningEntriesFound")}</p>
            <p className="text-sm text-gray-400 mt-1">{t("pages.imagingPositioning.tryAdjustingYourSearchOr")}</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedByRegion).sort(([a], [b]) => a.localeCompare(b)).map(([region, regionEntries]) => (
              <section key={region}>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2" data-testid={`section-${region.toLowerCase().replace(/[^a-z]/g, '-')}`}>
                  <span className={`inline-block w-3 h-3 rounded-full ${
                    REGION_COLORS[region]?.includes("blue") ? "bg-blue-500" :
                    REGION_COLORS[region]?.includes("emerald") ? "bg-emerald-500" :
                    REGION_COLORS[region]?.includes("purple") ? "bg-purple-500" :
                    REGION_COLORS[region]?.includes("amber") ? "bg-amber-500" :
                    REGION_COLORS[region]?.includes("rose") ? "bg-rose-500" :
                    REGION_COLORS[region]?.includes("cyan") ? "bg-cyan-500" :
                    REGION_COLORS[region]?.includes("orange") ? "bg-orange-500" :
                    "bg-indigo-500"
                  }`} />
                  {region}
                  <span className="text-sm font-normal text-gray-400">({regionEntries.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regionEntries.map((entry: any) => {
                    const slug = entry.slug || entry.id;
                    return (
                      <Link
                        key={entry.id}
                        href={`/medical-imaging/${country}/positioning/${slug}`}
                        className="group block"
                        data-testid={`card-projection-${entry.id}`}
                      >
                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all h-full flex flex-col">
                          {entry.teachingImageUrl ? (
                            <div className="h-40 bg-gray-100 overflow-hidden">
                              <img src={entry.teachingImageUrl} alt={`${entry.projectionName} radiographic positioning - NurseNest medical imaging`} title={entry.projectionName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                            </div>
                          ) : (
                            <div className="h-24 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                              <Target className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                          <div className="p-4 flex-1 flex flex-col">
                            <div className="flex items-start gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors flex-1">
                                {entry.projectionName}
                              </h3>
                              {entry.examRelevance && (
                                <Star className={`w-4 h-4 flex-shrink-0 ${RELEVANCE_ICONS[entry.examRelevance] || "text-gray-300"}`} fill="currentColor" />
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              <span className={`px-2 py-0.5 text-xs rounded-full border ${REGION_COLORS[region] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                {entry.bodyPart}
                              </span>
                            </div>
                            {entry.patientPosition && (
                              <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{entry.patientPosition}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
                              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {t("pages.imagingPositioning.view")}</span>
                              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {t("pages.imagingPositioning.learn")}</span>
                              {entry.quizQuestions && (entry.quizQuestions as any[]).length > 0 && (
                                <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {t("pages.imagingPositioning.quiz")}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
