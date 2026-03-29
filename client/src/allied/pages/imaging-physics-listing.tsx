import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { Search, ChevronRight, Atom, BookOpen, Zap, CheckCircle2, Clock, BarChart3, Filter } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const PHYSICS_CATEGORIES = [
  "All", "X-ray Production", "Beam Characteristics", "Beam Interactions",
  "Image Quality", "Radiation Protection", "Equipment", "Digital Imaging"
];

const SEED_TOPICS = [
  { id: "xray-production", title: "X-ray Production", slug: "x-ray-production", category: "X-ray Production", difficulty: 2, summary: "How x-rays are produced in the tube: thermionic emission, target interactions, bremsstrahlung and characteristic radiation." },
  { id: "tube-current", title: "Tube Current (mA)", slug: "tube-current-ma", category: "X-ray Production", difficulty: 1, summary: "Tube current controls the quantity of x-rays. Higher mA = more electrons = more photons." },
  { id: "exposure-time", title: "Exposure Time", slug: "exposure-time", category: "X-ray Production", difficulty: 1, summary: "Duration of x-ray production. Longer time = more radiation but more motion blur risk." },
  { id: "mas", title: "mAs (milliampere-seconds)", slug: "mas", category: "X-ray Production", difficulty: 2, summary: "mAs = mA × time. Controls quantity of x-rays and image density. Primary factor for patient dose." },
  { id: "kvp", title: "kVp (kilovoltage peak)", slug: "kvp", category: "Beam Characteristics", difficulty: 2, summary: "kVp controls beam quality and penetrating power. Affects contrast, scatter, and patient dose." },
  { id: "beam-quality", title: "Beam Quality & Quantity", slug: "beam-quality-quantity", category: "Beam Characteristics", difficulty: 3, summary: "Quality = penetrating power (half-value layer). Quantity = number of photons (intensity)." },
  { id: "inverse-square", title: "Inverse Square Law", slug: "inverse-square-law", category: "Beam Characteristics", difficulty: 2, summary: "Radiation intensity is inversely proportional to the square of the distance from the source." },
  { id: "attenuation", title: "Attenuation", slug: "attenuation", category: "Beam Interactions", difficulty: 3, summary: "Reduction in beam intensity as it passes through matter. Depends on tissue type and thickness." },
  { id: "scatter", title: "Scatter Radiation", slug: "scatter-radiation", category: "Beam Interactions", difficulty: 2, summary: "Scattered photons degrade image quality and increase patient/staff dose." },
  { id: "photoelectric", title: "Photoelectric Effect", slug: "photoelectric-effect", category: "Beam Interactions", difficulty: 3, summary: "Complete absorption of an x-ray photon by an inner shell electron. Produces contrast in the image." },
  { id: "compton", title: "Compton Scatter", slug: "compton-scatter", category: "Beam Interactions", difficulty: 3, summary: "X-ray photon ejects an outer shell electron and continues with reduced energy in a different direction." },
  { id: "filtration", title: "Filtration", slug: "filtration", category: "Beam Characteristics", difficulty: 2, summary: "Removes low-energy photons from the beam. Reduces patient skin dose without affecting image quality significantly." },
  { id: "grids", title: "Grids", slug: "grids", category: "Image Quality", difficulty: 2, summary: "Lead strips that absorb scatter radiation before reaching the image receptor. Improves contrast." },
  { id: "aec", title: "Automatic Exposure Control (AEC)", slug: "automatic-exposure-control", category: "Equipment", difficulty: 2, summary: "Sensors that terminate exposure when sufficient radiation reaches the image receptor." },
  { id: "distance-effects", title: "Distance Effects (SID)", slug: "distance-effects-sid", category: "Image Quality", difficulty: 2, summary: "Source-to-image distance affects magnification, intensity, and image sharpness." },
  { id: "magnification", title: "Magnification & Distortion", slug: "magnification-distortion", category: "Image Quality", difficulty: 2, summary: "Size and shape distortion caused by OID, SID, and beam-part-receptor alignment." },
  { id: "contrast", title: "Contrast", slug: "contrast", category: "Image Quality", difficulty: 2, summary: "Difference in optical density between adjacent structures. Affected by kVp, scatter, and processing." },
  { id: "density", title: "Density (Brightness)", slug: "density-brightness", category: "Image Quality", difficulty: 1, summary: "Overall darkness/brightness of the image. Controlled primarily by mAs." },
  { id: "radiation-protection", title: "Radiation Protection", slug: "radiation-protection", category: "Radiation Protection", difficulty: 2, summary: "ALARA principle, time-distance-shielding, dose limits, and regulatory requirements." },
  { id: "hvl", title: "Half-Value Layer", slug: "half-value-layer", category: "Beam Characteristics", difficulty: 3, summary: "Thickness of material needed to reduce beam intensity by half. Measures beam quality." },
  { id: "image-receptor", title: "Image Receptor Basics", slug: "image-receptor-basics", category: "Digital Imaging", difficulty: 2, summary: "CR (computed radiography) and DR (digital radiography) systems: how they capture and display images." },
];

export default function ImagingPhysicsListing() {
  const { t } = useI18n();
  const params = useParams<{ country: string }>();
  const country = params.country === "usa" ? "usa" : "canada";
  const countryLabel = country === "usa" ? "USA (ARRT)" : "Canada (CAMRT)";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLoading(true);
    fetch(`/api/imaging/physics`)
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => {
        const relevant = data.filter(t =>
          t.status === "published" && (!t.country || t.country === country || t.country === "both")
        );
        if (relevant.length > 0) {
          const withSlugs = relevant.map(t => ({
            ...t,
            slug: t.slug || t.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
            summary: t.content?.substring(0, 150),
          }));
          setTopics(withSlugs);
        } else {
          setTopics(SEED_TOPICS.map(t => ({ ...t, country, status: "published" })));
        }
      })
      .catch(() => setTopics(SEED_TOPICS.map(t => ({ ...t, country, status: "published" }))))
      .finally(() => setLoading(false));
  }, [country]);

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
        t.title?.toLowerCase().includes(q) ||
        t.summary?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
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
    <>
      <AlliedSEO
        title={`Radiation Physics Study Guide - ${countryLabel} | NurseNest`}
        description={`Master radiation physics for the ${countryLabel === "USA (ARRT)" ? "ARRT" : "CAMRT"} exam. ${totalCount}+ interactive topics covering x-ray production, beam interactions, image quality, and radiation protection.`}
        keywords={`radiation physics, ${countryLabel === "USA (ARRT)" ? "ARRT" : "CAMRT"} physics, x-ray physics, radiography physics, medical imaging physics`}
        canonicalPath={`/medical-imaging/${country}/physics`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "EducationalCourse",
          name: `Radiation Physics - ${countryLabel}`,
          description: `Interactive radiation physics study guide for ${countryLabel} certification exam preparation.`,
          provider: { "@type": "Organization", name: "NurseNest" },
          educationalLevel: "Professional Certification"
        }}
      />
      <div className="max-w-5xl mx-auto px-4 py-8" data-testid="physics-listing-page">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-teal-600">{t("allied.imagingPhysicsListing.home")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/medical-imaging/${country}`} className="hover:text-teal-600">{t("allied.imagingPhysicsListing.medicalImaging")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-teal-700 font-medium">{t("allied.imagingPhysicsListing.physics")}</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Atom className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-physics-title">{t("allied.imagingPhysicsListing.radiationPhysics")}</h1>
          </div>
          <p className="text-gray-600">{countryLabel} - Interactive visual learning modules with micro-quizzes</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6 border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">{t("allied.imagingPhysicsListing.yourProgress")}</span>
            </div>
            <span className="text-sm text-blue-600 font-medium" data-testid="text-progress-count">{completedCount} / {totalCount} topics</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} data-testid="progress-bar" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("allied.imagingPhysicsListing.searchPhysicsTopics")}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400"
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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-20 text-gray-500">{t("allied.imagingPhysicsListing.noTopicsFoundMatchingYour")}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map(topic => (
              <Link
                key={topic.id || topic.slug}
                href={`/medical-imaging/${country}/physics/${topic.slug}`}
                className="group block"
              >
                <div className={`bg-white rounded-xl border p-4 hover:shadow-md hover:border-blue-200 transition-all h-full ${progress[topic.slug] ? "border-green-200 bg-green-50/30" : "border-gray-100"}`} data-testid={`topic-card-${topic.slug}`}>
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColor(topic.difficulty || 2)}`}>
                      {difficultyLabel(topic.difficulty || 2)}
                    </span>
                    {progress[topic.slug] && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors" data-testid={`text-topic-title-${topic.slug}`}>
                    {topic.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{topic.summary || topic.content?.substring(0, 100)}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="px-1.5 py-0.5 bg-gray-50 rounded">{topic.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
