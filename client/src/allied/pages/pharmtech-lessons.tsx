import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { BookOpen, ChevronRight, Search, Filter, ArrowRight, Brain, Clock, Globe } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
const CATEGORIES = [
  "Pharmacology", "Dosage Calculations", "Compounding", "Drug Interactions",
  "Regulations/Law", "Sterile Products", "Inventory Management", "Patient Safety",
  "Drug Classifications", "Prescription Processing",
];

const CERT_OPTIONS = [
  { value: "", label: "All Content" },
  { value: "PTCB", label: "US (PTCB/ExCPT)" },
  { value: "PEBC", label: "Canada (PEBC)" },
];

function CertBadge({ certContext }: { certContext?: string }) {
  const { t } = useI18n();
  if (!certContext || certContext === "BOTH") return null;
  if (certContext === "PTCB") return <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium ml-1">US</span>;
  if (certContext === "PEBC") return <span className="inline-block px-1.5 py-0.5 bg-red-50 text-red-700 rounded text-[10px] font-medium ml-1">CA</span>;
  return null;
}

function LessonLibrary() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [cert, setCert] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = cert ? `?cert=${cert}` : "";
    fetch(`/api/pharmtech/lessons${params}`).then(r => { if (!r.ok) throw new Error("Failed"); return r.json(); }).then(data => { setLessons(Array.isArray(data) ? data : []); setLoading(false); }).catch(() => setLoading(false));
  }, [cert]);

  const filtered = lessons.filter(l => {
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) && !(l.summary || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (category && l.category !== category) return false;
    return true;
  });

  const categoryCounts = CATEGORIES.map(c => ({ name: c, count: lessons.filter(l => l.category === c).length })).filter(c => c.count > 0);

  return (
    <>
      <AlliedSEO
        title={t("allied.pharmtechLessons.pharmacyTechnicianLessonsCompleteLesson")}
        description={t("allied.pharmtechLessons.browseAllPharmacyTechnicianCertification")}
        canonicalPath="/allied-health/pharmacy-technician/lessons"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Allied", item: "https://www.nursenest.ca/allied-health" },
            { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
            { "@type": "ListItem", position: 3, name: "Lessons", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/lessons" },
          ],
        }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="pharmtech-lessons-page">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/allied-health/pharmacy-technician" className="hover:text-teal-600">{t("allied.pharmtechLessons.pharmacyTechnician")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-green-700 font-medium">{t("allied.pharmtechLessons.lessons")}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-lessons-title">{t("allied.pharmtechLessons.pharmacyTechnicianLessons")}</h1>
            <p className="text-gray-500 text-sm mt-1">{lessons.length} lessons available</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("allied.pharmtechLessons.searchLessons")}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                data-testid="input-search-lessons"
              />
            </div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm"
              data-testid="select-category"
            >
              <option value="">{t("allied.pharmtechLessons.allCategories")}</option>
              {categoryCounts.map(c => <option key={c.name} value={c.name}>{c.name} ({c.count})</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-8" data-testid="cert-filter">
          <Globe className="w-4 h-4 text-gray-400 mr-1" />
          {CERT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setCert(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${cert === opt.value ? "bg-green-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              data-testid={`button-cert-${opt.value || "all"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("allied.pharmtechLessons.noLessonsFound")}</h3>
            <p className="text-gray-500 text-sm">{t("allied.pharmtechLessons.tryAdjustingYourFilters")}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(lesson => (
              <Link key={lesson.id} href={`/allied-health/pharmacy-technician/lessons/${lesson.slug}`} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-green-200 transition-all" data-testid={`card-lesson-${lesson.slug}`}>
                <div className="flex items-center gap-1 mb-3">
                  <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">{lesson.category}</span>
                  <CertBadge certContext={lesson.certContext} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">{lesson.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{lesson.summary}</p>
                <span className="text-green-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Lesson <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function LessonDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/pharmtech/lessons/${slug}`).then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); }).then(data => { setLesson(data); setLoading(false); }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!lesson) return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">{t("allied.pharmtechLessons.lessonNotFound")}</h1><Link href="/allied-health/pharmacy-technician/lessons" className="text-green-600 mt-4 inline-block">{t("allied.pharmtechLessons.backToLessons")}</Link></div>;

  return (
    <>
      <AlliedSEO
        title={lesson.seoTitle || `${lesson.title} - Pharmacy Technician Lesson`}
        description={lesson.seoDescription || lesson.summary || `Learn about ${lesson.title} for pharmacy technician certification exam preparation.`}
        canonicalPath={`/allied-health/pharmacy-technician/lessons/${lesson.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Allied", item: "https://www.nursenest.ca/allied-health" },
            { "@type": "ListItem", position: 2, name: "Pharmacy Technician", item: "https://www.nursenest.ca/allied-health/pharmacy-technician" },
            { "@type": "ListItem", position: 3, name: "Lessons", item: "https://www.nursenest.ca/allied-health/pharmacy-technician/lessons" },
            { "@type": "ListItem", position: 4, name: lesson.title, item: `https://www.nursenest.ca/allied-health/pharmacy-technician/lessons/${lesson.slug}` },
          ],
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="pharmtech-lesson-detail">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/allied-health/pharmacy-technician" className="hover:text-teal-600">{t("allied.pharmtechLessons.pharmacyTechnician2")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/allied-health/pharmacy-technician/lessons" className="hover:text-teal-600">{t("allied.pharmtechLessons.lessons2")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-green-700 font-medium truncate">{lesson.title}</span>
        </div>

        <div className="mb-8">
          <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium mb-3">{lesson.category}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-lesson-title">{lesson.title}</h1>
          {lesson.summary && <p className="text-gray-600 text-lg leading-relaxed">{lesson.summary}</p>}
        </div>

        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="bg-green-50 rounded-2xl p-6 mb-8 border border-green-100">
            <h2 className="font-semibold text-green-800 mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" /> {t("allied.pharmtechLessons.learningObjectives")}</h2>
            <ul className="space-y-2">
              {lesson.objectives.map((obj: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                  <span className="w-5 h-5 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="prose prose-green max-w-none mb-8" data-testid="lesson-body">
          {lesson.body.split("\n\n").map((para: string, i: number) => {
            if (para.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-4">{para.replace("## ", "")}</h2>;
            if (para.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold text-gray-900 mt-6 mb-3">{para.replace("### ", "")}</h3>;
            if (para.startsWith("- ")) return <ul key={i} className="list-disc pl-5 space-y-1 mb-4">{para.split("\n").map((line, j) => <li key={j} className="text-gray-700 text-sm leading-relaxed">{line.replace(/^- /, "")}</li>)}</ul>;
            return <p key={i} className="text-gray-700 leading-relaxed mb-4">{para}</p>;
          })}
        </div>

        {lesson.keyPoints && lesson.keyPoints.length > 0 && (
          <div className="bg-amber-50 rounded-2xl p-6 mb-8 border border-amber-100">
            <h2 className="font-semibold text-amber-800 mb-3">{t("allied.pharmtechLessons.keyPointsToRemember")}</h2>
            <ul className="space-y-2">
              {lesson.keyPoints.map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                  <span className="text-amber-600 mt-0.5">•</span> {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
          <div className="bg-red-50 rounded-2xl p-6 mb-8 border border-red-100">
            <h2 className="font-semibold text-red-800 mb-3">{t("allied.pharmtechLessons.commonMistakesToAvoid")}</h2>
            <ul className="space-y-2">
              {lesson.commonMistakes.map((mistake: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-900">
                  <span className="text-red-600 mt-0.5">✕</span> {mistake}
                </li>
              ))}
            </ul>
          </div>
        )}

        {lesson.relatedDeckSlugs && lesson.relatedDeckSlugs.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Brain className="w-4 h-4 text-green-600" /> {t("allied.pharmtechLessons.relatedFlashcardDecks")}</h2>
            <div className="flex flex-wrap gap-2">
              {lesson.relatedDeckSlugs.map((deckSlug: string) => (
                <Link key={deckSlug} href={`/allied-health/pharmacy-technician/flashcards/${deckSlug}`} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-green-700 hover:bg-green-50 hover:border-green-200 transition-colors" data-testid={`link-deck-${deckSlug}`}>
                  {deckSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <Link href="/allied-health/pharmacy-technician/lessons" className="text-green-600 text-sm font-medium hover:underline" data-testid="link-back-lessons">{t("allied.pharmtechLessons.backToLessons2")}</Link>
          <Link href="/allied-health/pharmacy-technician/practice-questions" className="text-green-600 text-sm font-medium hover:underline" data-testid="link-practice">{t("allied.pharmtechLessons.practiceQuestions")}</Link>
        </div>
      </div>
    </>
  );
}

export default function PharmtechLessonsPage() {
  const params = useParams<{ slug: string }>();
  if (params.slug) return <LessonDetail />;
  return <LessonLibrary />;
}
