import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen, ChevronDown, ChevronUp, ArrowLeft, Search,
  MapPin, Atom, Shield, Monitor, Heart, Wrench,
  Bone, Eye, Beaker, CheckCircle, AlertTriangle
} from "lucide-react";

const MODULES = [
  { key: "positioning", label: "Radiographic Positioning", icon: MapPin, color: "bg-blue-50 text-blue-600" },
  { key: "physics", label: "Radiation Physics", icon: Atom, color: "bg-purple-50 text-purple-600" },
  { key: "radiation_safety", label: "Radiation Safety", icon: Shield, color: "bg-red-50 text-red-600" },
  { key: "image_production", label: "Image Production", icon: Monitor, color: "bg-green-50 text-green-600" },
  { key: "patient_care", label: "Patient Care", icon: Heart, color: "bg-pink-50 text-pink-600" },
  { key: "equipment", label: "Equipment Operation", icon: Wrench, color: "bg-amber-50 text-amber-600" },
  { key: "anatomy", label: "Radiographic Anatomy", icon: Bone, color: "bg-teal-50 text-teal-600" },
  { key: "interpretation", label: "Image Interpretation", icon: Eye, color: "bg-cyan-50 text-cyan-600" },
  { key: "contrast_media", label: "Contrast Media", icon: Beaker, color: "bg-orange-50 text-orange-600" },
  { key: "quality_control", label: "Quality Control", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
  { key: "emergency_procedures", label: "Emergency Procedures", icon: AlertTriangle, color: "bg-rose-50 text-rose-600" },
];

const EXAM_MAP: Record<string, { exam: string }> = {
  canada: { exam: "CAMRT" },
  usa: { exam: "ARRT" },
};

const LESSON_CATEGORIES = [
  "radiation_safety", "image_production", "patient_care", "equipment",
  "anatomy", "interpretation", "contrast_media", "quality_control", "emergency_procedures",
];

function useLessonsByCategory(country: string) {
  const { t } = useI18n();
  const results: Record<string, ReturnType<typeof useQuery>> = {};
  for (const cat of LESSON_CATEGORIES) {
    results[cat] = useQuery({
      queryKey: ["/api/imaging/physics", country, cat],
      queryFn: () => fetch(`/api/imaging/physics?status=published&country=${country}&category=${cat}`).then(r => r.json()),
    });
  }
  return results;
}

export default function ImagingLessonsPage() {
  const [, params] = useRoute("/medical-imaging/:country/lessons");
  const country = params?.country || "canada";
  const examInfo = EXAM_MAP[country] || EXAM_MAP.canada;
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data: positioning = [] } = useQuery({
    queryKey: ["/api/imaging/positioning", country],
    queryFn: () => fetch(`/api/imaging/positioning?status=published&country=${country}`).then(r => r.json()),
  });

  const { data: physics = [] } = useQuery({
    queryKey: ["/api/imaging/physics", country, "physics_only"],
    queryFn: async () => {
      const all = await fetch(`/api/imaging/physics?status=published&country=${country}`).then(r => r.json());
      return (all as any[]).filter((item: any) => !LESSON_CATEGORIES.includes(item.category));
    },
  });

  const lessonData = useLessonsByCategory(country);

  const moduleContent: Record<string, any[]> = {
    positioning,
    physics,
  };

  for (const cat of LESSON_CATEGORIES) {
    moduleContent[cat] = (lessonData[cat]?.data as any[]) || [];
  }

  const filteredModules = MODULES.filter(m =>
    !search || m.label.toLowerCase().includes(search.toLowerCase())
  );

  const totalLessons = Object.values(moduleContent).reduce((sum, items) => sum + items.length, 0);

  return (
    <div data-testid="imaging-lessons-page">
      <SEO
        title={`${examInfo.exam} Lessons & Study Guides | NurseNest`}
        description={`Comprehensive ${examInfo.exam} radiography exam lessons covering positioning, physics, radiation safety, image production, patient care, equipment, anatomy, interpretation, contrast media, quality control, and emergency procedures.`}
        canonicalPath={`/medical-imaging/${country}/lessons`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Medical Imaging", url: "https://www.nursenest.ca/medical-imaging" },
          { name: country === "canada" ? "Canada (CAMRT)" : "USA (ARRT)", url: `https://www.nursenest.ca/medical-imaging/${country}` },
          { name: "Lessons", url: `https://www.nursenest.ca/medical-imaging/${country}/lessons` },
        ]} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/medical-imaging/${country}`} className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 mb-6" data-testid="link-back">
          <ArrowLeft className="w-4 h-4" /> Back to {examInfo.exam} Prep
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="text-lessons-title">
              {examInfo.exam} Lessons & Study Guides
            </h1>
            <p className="text-sm text-gray-500">{MODULES.length} modules covering all {examInfo.exam} exam domains{totalLessons > 0 ? ` \u2022 ${totalLessons} topics` : ""}</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("pages.imagingLessons.searchModules")}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            data-testid="input-search-modules"
          />
        </div>

        <div className="space-y-4">
          {filteredModules.map(mod => {
            const items = moduleContent[mod.key] || [];
            const isOpen = activeModule === mod.key;
            return (
              <div key={mod.key} className="bg-white border border-gray-100 rounded-xl overflow-hidden" data-testid={`module-${mod.key}`}>
                <button
                  onClick={() => setActiveModule(isOpen ? null : mod.key)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                  data-testid={`button-toggle-${mod.key}`}
                >
                  <div className={`w-10 h-10 rounded-lg ${mod.color} flex items-center justify-center flex-shrink-0`}>
                    <mod.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{mod.label}</h3>
                    <p className="text-xs text-gray-500">{items.length} {items.length === 1 ? "topic" : "topics"} available</p>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="border-t border-gray-100 p-5">
                    {items.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">{t("pages.imagingLessons.contentComingSoon")}</p>
                    ) : (
                      <div className="space-y-3">
                        {items.map((item: any) => (
                          <div key={item.id} className="bg-gray-50 rounded-lg p-4" data-testid={`lesson-item-${item.id}`}>
                            {mod.key === "positioning" ? (
                              <PositioningContent item={item} />
                            ) : (
                              <LessonContent item={item} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PositioningContent({ item }: { item: any }) {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-2">{item.bodyPart} - {item.projectionName}</h4>
      {item.patientPosition && (
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-500">{t("pages.imagingLessons.patientPosition")}</span>
          <p className="text-sm text-gray-700">{item.patientPosition}</p>
        </div>
      )}
      {item.centralRay && (
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-500">{t("pages.imagingLessons.centralRay")}</span>
          <p className="text-sm text-gray-700">{item.centralRay}</p>
        </div>
      )}
      {item.anatomyDemonstrated && (
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-500">{t("pages.imagingLessons.anatomyDemonstrated")}</span>
          <p className="text-sm text-gray-700">{item.anatomyDemonstrated}</p>
        </div>
      )}
      {item.tips && (
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-500">{t("pages.imagingLessons.tips")}</span>
          <p className="text-sm text-gray-700">{item.tips}</p>
        </div>
      )}
      {item.sid && (
        <div>
          <span className="text-xs font-medium text-gray-500">{t("pages.imagingLessons.sid")}</span>
          <span className="text-sm text-gray-700 ml-1">{item.sid}</span>
        </div>
      )}
    </div>
  );
}

function LessonContent({ item }: { item: any }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const quizItems = Array.isArray(item.quizItems) ? item.quizItems : [];

  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
      <div className="flex flex-wrap gap-2 mb-2">
        {item.category && <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">{item.category.replace(/_/g, ' ')}</span>}
        {item.difficulty != null && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Level {item.difficulty}</span>}
        {item.examType && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded uppercase">{item.examType}</span>}
      </div>
      {item.content && (
        typeof item.content === "string" ? (
          <p className="text-sm text-gray-700 mb-3 whitespace-pre-line leading-relaxed">{item.content}</p>
        ) : Array.isArray(item.content) ? (
          <ul className="text-sm text-gray-700 mb-3 list-disc list-inside space-y-1">
            {item.content.map((c: any, i: number) => (
              <li key={i}>{typeof c === "string" ? c : JSON.stringify(c)}</li>
            ))}
          </ul>
        ) : typeof item.content === "object" && item.content !== null ? (
          <div className="text-sm text-gray-700 mb-3 space-y-1">
            {Object.entries(item.content).map(([key, val]: [string, any]) => (
              <div key={key}>
                <span className="font-medium text-gray-900">{key}: </span>
                <span className="whitespace-pre-line">{typeof val === "string" ? val : JSON.stringify(val)}</span>
              </div>
            ))}
          </div>
        ) : null
      )}
      {item.explanation && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <span className="text-xs font-medium text-blue-600">{t("pages.imagingLessons.keyInsight")}</span>
          <p className="text-sm text-blue-800 mt-0.5">{item.explanation}</p>
        </div>
      )}
      {item.keyConcepts && Array.isArray(item.keyConcepts) && item.keyConcepts.length > 0 && (
        <div className="mb-3">
          <span className="text-xs font-medium text-gray-500">{t("pages.imagingLessons.keyConcepts")}</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {item.keyConcepts.map((c: string, i: number) => (
              <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">{c}</span>
            ))}
          </div>
        </div>
      )}
      {item.formulas && Array.isArray(item.formulas) && item.formulas.length > 0 && (
        <div className="mb-3">
          <span className="text-xs font-medium text-gray-500">{t("pages.imagingLessons.formulas")}</span>
          <div className="mt-1 space-y-1">
            {item.formulas.map((f: any, i: number) => (
              <div key={i} className="bg-purple-50 rounded px-3 py-2 text-sm">
                {typeof f === "string" ? f : typeof f === "object" && f !== null ? (
                  <div>
                    {f.name && <span className="font-medium text-purple-800">{f.name}: </span>}
                    <span className="text-purple-700">{f.formula || f.expression || JSON.stringify(f)}</span>
                  </div>
                ) : String(f)}
              </div>
            ))}
          </div>
        </div>
      )}
      {quizItems.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            data-testid={`button-quiz-${item.id}`}
          >
            {showQuiz ? "Hide" : "Show"} Quiz ({quizItems.length} questions)
            {showQuiz ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showQuiz && (
            <div className="mt-3 space-y-4">
              {quizItems.map((q: any, qi: number) => (
                <div key={qi} className="bg-white rounded-lg p-4 border border-gray-200" data-testid={`quiz-question-${qi}`}>
                  <p className="text-sm font-medium text-gray-900 mb-2">{qi + 1}. {q.question}</p>
                  <div className="space-y-1.5">
                    {(q.options || []).map((opt: string, oi: number) => {
                      const selected = selectedAnswers[qi] === oi;
                      const answered = selectedAnswers[qi] !== undefined;
                      const isCorrect = oi === q.correctIndex;
                      let optClasses = "text-sm px-3 py-2 rounded-lg border cursor-pointer transition-colors ";
                      if (answered && selected && isCorrect) optClasses += "bg-green-50 border-green-300 text-green-800";
                      else if (answered && selected && !isCorrect) optClasses += "bg-red-50 border-red-300 text-red-800";
                      else if (answered && isCorrect) optClasses += "bg-green-50 border-green-200 text-green-700";
                      else optClasses += "bg-white border-gray-200 text-gray-700 hover:bg-gray-50";
                      return (
                        <button
                          key={oi}
                          onClick={() => !answered && setSelectedAnswers(prev => ({ ...prev, [qi]: oi }))}
                          className={`w-full text-left ${optClasses}`}
                          disabled={answered}
                          data-testid={`quiz-option-${qi}-${oi}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {selectedAnswers[qi] !== undefined && q.rationale && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                      <span className="font-medium">{t("pages.imagingLessons.rationale")}</span> {q.rationale}
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
