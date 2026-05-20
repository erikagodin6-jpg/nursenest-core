import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Atom, ArrowLeft, Search, Filter, ChevronDown, ChevronUp, CheckCircle2, BarChart3 } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const EXAM_MAP: Record<string, { exam: string }> = {
  canada: { exam: "CAMRT" },
  usa: { exam: "ARRT" },
};

const PHYSICS_CATEGORIES = [
  "All", "X-ray Production", "Beam Characteristics", "Beam Interactions",
  "Image Quality", "Radiation Protection", "Equipment", "Digital Imaging"
];

const SEED_TOPICS = [
  { id: "xray-production", title: "X-ray Production", slug: "x-ray-production", category: "X-ray Production", difficulty: 2, content: "How x-rays are produced in the tube: thermionic emission, target interactions, bremsstrahlung and characteristic radiation." },
  { id: "tube-current", title: "Tube Current (mA)", slug: "tube-current-ma", category: "X-ray Production", difficulty: 1, content: "Tube current controls the quantity of x-rays. Higher mA = more electrons = more photons." },
  { id: "mas", title: "mAs (milliampere-seconds)", slug: "mas", category: "X-ray Production", difficulty: 2, content: "mAs = mA × time. Controls quantity of x-rays and image density. Primary factor for patient dose." },
  { id: "kvp", title: "kVp (kilovoltage peak)", slug: "kvp", category: "Beam Characteristics", difficulty: 2, content: "kVp controls beam quality and penetrating power. Affects contrast, scatter, and patient dose." },
  { id: "beam-quality", title: "Beam Quality & Quantity", slug: "beam-quality-quantity", category: "Beam Characteristics", difficulty: 3, content: "Quality = penetrating power (half-value layer). Quantity = number of photons (intensity)." },
  { id: "inverse-square", title: "Inverse Square Law", slug: "inverse-square-law", category: "Beam Characteristics", difficulty: 2, content: "Radiation intensity is inversely proportional to the square of the distance from the source." },
  { id: "attenuation", title: "Attenuation", slug: "attenuation", category: "Beam Interactions", difficulty: 3, content: "Reduction in beam intensity as it passes through matter. Depends on tissue type and thickness." },
  { id: "scatter", title: "Scatter Radiation", slug: "scatter-radiation", category: "Beam Interactions", difficulty: 2, content: "Scattered photons degrade image quality and increase patient/staff dose." },
  { id: "photoelectric", title: "Photoelectric Effect", slug: "photoelectric-effect", category: "Beam Interactions", difficulty: 3, content: "Complete absorption of an x-ray photon by an inner shell electron. Produces contrast in the image." },
  { id: "compton", title: "Compton Scatter", slug: "compton-scatter", category: "Beam Interactions", difficulty: 3, content: "X-ray photon ejects an outer shell electron and continues with reduced energy in a different direction." },
  { id: "filtration", title: "Filtration", slug: "filtration", category: "Beam Characteristics", difficulty: 2, content: "Removes low-energy photons from the beam. Reduces patient skin dose without affecting image quality significantly." },
  { id: "grids", title: "Grids", slug: "grids", category: "Image Quality", difficulty: 2, content: "Lead strips that absorb scatter radiation before reaching the image receptor. Improves contrast." },
  { id: "aec", title: "Automatic Exposure Control (AEC)", slug: "automatic-exposure-control", category: "Equipment", difficulty: 2, content: "Sensors that terminate exposure when sufficient radiation reaches the image receptor." },
  { id: "distance-effects", title: "Distance Effects (SID)", slug: "distance-effects-sid", category: "Image Quality", difficulty: 2, content: "Source-to-image distance affects magnification, intensity, and image sharpness." },
  { id: "magnification", title: "Magnification & Distortion", slug: "magnification-distortion", category: "Image Quality", difficulty: 2, content: "Size and shape distortion caused by OID, SID, and beam-part-receptor alignment." },
  { id: "contrast", title: "Contrast", slug: "contrast", category: "Image Quality", difficulty: 2, content: "Difference in optical density between adjacent structures. Affected by kVp, scatter, and processing." },
  { id: "density", title: "Density (Brightness)", slug: "density-brightness", category: "Image Quality", difficulty: 1, content: "Overall darkness/brightness of the image. Controlled primarily by mAs." },
  { id: "radiation-protection", title: "Radiation Protection", slug: "radiation-protection", category: "Radiation Protection", difficulty: 2, content: "ALARA principle, time-distance-shielding, dose limits, and regulatory requirements." },
  { id: "hvl", title: "Half-Value Layer", slug: "half-value-layer", category: "Beam Characteristics", difficulty: 3, content: "Thickness of material needed to reduce beam intensity by half. Measures beam quality." },
  { id: "image-receptor", title: "Image Receptor Basics", slug: "image-receptor-basics", category: "Digital Imaging", difficulty: 2, content: "CR (computed radiography) and DR (digital radiography) systems: how they capture and display images." },
];

function toSlug(title: string): string {
  const { t } = useI18n();
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ImagingPhysicsPage() {
  const [, params] = useRoute("/medical-imaging/:country/physics");
  const country = params?.country || "canada";
  const examInfo = EXAM_MAP[country] || EXAM_MAP.canada;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  const { data: rawTopics = [], isLoading } = useQuery({
    queryKey: ["/api/imaging/physics", country],
    queryFn: () => fetch(`/api/imaging/physics`).then(r => r.json()),
  });

  const topics = useMemo(() => {
    const relevant = (rawTopics as any[]).filter(t =>
      t.status === "published" && (!t.country || t.country === country || t.country === "both")
    );
    if (relevant.length > 0) {
      return relevant.map(t => ({
        ...t,
        slug: t.slug || toSlug(t.title),
      }));
    }
    return SEED_TOPICS.map(t => ({ ...t, country, status: "published" }));
  }, [rawTopics, country]);

  useEffect(() => {
    const saved = localStorage.getItem(`physics-progress-${country}`);
    if (saved) setProgress(JSON.parse(saved));
  }, [country]);

  const filteredTopics = useMemo(() => {
    let filtered = topics;
    if (selectedCategory !== "All") {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title?.toLowerCase().includes(q) || t.content?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [topics, selectedCategory, searchQuery]);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalCount = topics.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const difficultyLabel = (d: number) => d <= 1 ? "Beginner" : d <= 2 ? "Intermediate" : "Advanced";
  const difficultyColor = (d: number) => d <= 1 ? "bg-green-100 text-green-700" : d <= 2 ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700";

  return (
    <div data-testid="imaging-physics-page">
      <SEO
        title={`${examInfo.exam} Physics Review | NurseNest`}
        description={`Interactive radiation physics study guide with ${totalCount}+ topics for ${examInfo.exam} exam preparation. Micro-quizzes, exam traps, memory aids, and interactive visuals.`}
        canonicalPath={`/medical-imaging/${country}/physics`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Medical Imaging", url: "https://www.nursenest.ca/medical-imaging" },
          { name: country === "canada" ? "Canada" : "USA", url: `https://www.nursenest.ca/medical-imaging/${country}` },
          { name: "Physics Review", url: `https://www.nursenest.ca/medical-imaging/${country}/physics` },
        ]} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/medical-imaging/${country}`} className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mb-6" data-testid="link-back">
          <ArrowLeft className="w-4 h-4" /> Back to {examInfo.exam} Prep
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
            <Atom className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-physics-title">
              Radiation Physics Review
            </h1>
            <p className="text-sm text-gray-500">{totalCount} topics for {examInfo.exam} · Interactive visuals & micro-quizzes</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 mb-6 border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">{t("pages.imagingPhysics.yourProgress")}</span>
            </div>
            <span className="text-sm text-purple-600 font-medium" data-testid="text-progress-count">{completedCount} / {totalCount} topics</span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-2.5">
            <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} data-testid="progress-bar" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("pages.imagingPhysics.searchPhysicsTopics")}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400"
              data-testid="input-search-physics"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white"
              data-testid="select-category-filter"
            >
              {PHYSICS_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <Atom className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium text-gray-500">{t("pages.imagingPhysics.noTopicsFoundMatchingYour")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map(topic => (
              <Link
                key={topic.id || topic.slug}
                href={`/medical-imaging/${country}/physics/${topic.slug}`}
                className="group block"
              >
                <div className={`bg-white rounded-xl border p-4 hover:shadow-md hover:border-purple-200 transition-all h-full ${progress[topic.slug] ? "border-green-200 bg-green-50/30" : "border-gray-100"}`} data-testid={`topic-card-${topic.slug}`}>
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColor(topic.difficulty || 2)}`}>
                      {difficultyLabel(topic.difficulty || 2)}
                    </span>
                    {progress[topic.slug] && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-purple-600 transition-colors" data-testid={`text-topic-title-${topic.slug}`}>
                    {topic.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{topic.content?.substring(0, 120)}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="px-1.5 py-0.5 bg-gray-50 rounded">{topic.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
