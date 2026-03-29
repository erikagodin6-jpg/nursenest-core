import { useState } from "react";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen, Search, Heart, Brain, FileText, Shield, Stethoscope,
  Activity, AlertTriangle, Beaker, Radio, Pill, MessageCircle, Users,
  ClipboardList, ArrowRight, CheckCircle2
} from "lucide-react";

const ALLIED_FOUNDATION_LESSONS = [
  { id: "allied-human-anatomy", title: "Human Anatomy", icon: Heart, description: "Body systems, structural organization, and anatomical relationships essential for all healthcare professionals.", category: "Sciences" },
  { id: "allied-human-physiology", title: "Human Physiology", icon: Activity, description: "Cellular processes, organ system function, and homeostatic mechanisms underlying health and disease.", category: "Sciences" },
  { id: "allied-medical-terminology", title: "Medical Terminology", icon: FileText, description: "Root words, prefixes, suffixes, and abbreviations used across clinical documentation and communication.", category: "Sciences" },
  { id: "allied-pharmacology-basics", title: "Pharmacology Basics", icon: Pill, description: "Drug classifications, pharmacokinetics, pharmacodynamics, and therapeutic principles for allied health.", category: "Pharmacology" },
  { id: "allied-patient-assessment", title: "Patient Assessment", icon: Stethoscope, description: "Systematic assessment techniques, history-taking, and physical examination across healthcare settings.", category: "Clinical Skills" },
  { id: "allied-infection-control", title: "Infection Control", icon: Shield, description: "Chain of infection, standard precautions, transmission-based precautions, and HAI prevention.", category: "Safety" },
  { id: "allied-medical-ethics", title: "Medical Ethics", icon: ClipboardList, description: "Bioethical principles, informed consent, confidentiality, HIPAA, and professional ethical decision-making.", category: "Professional Practice" },
  { id: "allied-clinical-documentation", title: "Clinical Documentation", icon: FileText, description: "SOAP notes, SBAR communication, EHR documentation, and medical-legal documentation standards.", category: "Professional Practice" },
  { id: "allied-vital-signs", title: "Vital Signs", icon: Activity, description: "Temperature, pulse, respiration, blood pressure, and pulse oximetry assessment and interpretation.", category: "Clinical Skills" },
  { id: "allied-emergency-response", title: "Emergency Response Basics", icon: AlertTriangle, description: "BLS, chain of survival, primary survey, hemorrhage control, and emergency intervention fundamentals.", category: "Safety" },
  { id: "allied-lab-values", title: "Lab Values", icon: Beaker, description: "Complete blood count, metabolic panels, coagulation studies, and critical value interpretation.", category: "Diagnostics" },
  { id: "allied-imaging-basics", title: "Imaging Basics", icon: Radio, description: "X-ray, CT, MRI, ultrasound principles, indications, contraindications, and patient safety.", category: "Diagnostics" },
  { id: "allied-medication-safety", title: "Medication Safety", icon: Pill, description: "Rights of medication administration, error prevention, high-alert medications, and safety systems.", category: "Pharmacology" },
  { id: "allied-patient-communication", title: "Patient Communication", icon: MessageCircle, description: "Therapeutic communication, health literacy, cultural competence, and patient education strategies.", category: "Professional Practice" },
  { id: "allied-healthcare-teamwork", title: "Healthcare Teamwork", icon: Users, description: "Interprofessional collaboration, team dynamics, conflict resolution, and scope of practice.", category: "Professional Practice" },
];

const CATEGORIES = ["All", "Sciences", "Clinical Skills", "Safety", "Pharmacology", "Diagnostics", "Professional Practice"];

export default function AlliedLessonsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = ALLIED_FOUNDATION_LESSONS.filter(lesson => {
    const matchesSearch = !search || lesson.title.toLowerCase().includes(search.toLowerCase()) || lesson.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || lesson.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div data-testid="allied-lessons-page">
      <AlliedSEO
        title={t("allied.alliedLessons.alliedHealthFoundationalLessonsCore")}
        description={t("allied.alliedLessons.15FoundationalLessonsCoveringHuman")}
        keywords="allied health lessons, medical terminology, pharmacology basics, patient assessment, infection control, vital signs, lab values, healthcare teamwork"
        canonicalPath="/lessons"
      />

      <section className="relative overflow-hidden py-12 sm:py-16" data-testid="lessons-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50/50 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-teal-100/80 text-teal-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4" data-testid="badge-lessons">
              <BookOpen className="w-4 h-4" />
              Foundational Lessons
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-lessons-title">
              Allied Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">{t("allied.alliedLessons.coreKnowledge")}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto" data-testid="text-lessons-subtitle">
              Master the foundational topics that apply across all allied health professions. Each lesson includes clinical content, exam tips, and embedded quizzes.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-teal-500" /> {t("allied.alliedLessons.15Topics")}</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-teal-500" /> {t("allied.alliedLessons.prePostTests")}</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-teal-500" /> {t("allied.alliedLessons.clinicalPearls")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-100" data-testid="lessons-filters">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("allied.alliedLessons.searchLessons")}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                data-testid="input-search-lessons"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${category === cat ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14" data-testid="lessons-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500" data-testid="text-no-results">
              No lessons match your search. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(lesson => (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className="group block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all"
                  data-testid={`card-lesson-${lesson.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <lesson.icon className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-medium mb-2">{lesson.category}</span>
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-teal-700 transition-colors mb-1" data-testid={`text-lesson-title-${lesson.id}`}>{lesson.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{lesson.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-teal-600 text-sm font-medium">
                    Start Lesson <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
