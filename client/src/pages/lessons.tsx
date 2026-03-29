import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { getAuthHeaders } from "@/lib/queryClient";
import { BackendErrorCodes, getLearnerMessageForCode, readApiJsonResponse } from "@/lib/api-error";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { useI18n } from "@/lib/i18n";
import { getLessonTitle, loadTranslationLanguage, isTranslationLoaded } from "@/lib/getI18n";
import { canonicalDisplayName } from "@/lib/canonical-display";
import { Footer } from "@/components/footer";
import { LocaleLink } from "@/lib/LocaleLink";
import { buildCatalogStructuredData } from "@/lib/structured-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getLecturesForTier, type LectureMetadata } from "@/data/micro-lectures";
import { AdminImageOverlay, useSiteImages } from "@/components/admin-image-overlay";
import { useToast } from "@/hooks/use-toast";
import { LessonLibraryHero } from "@/components/lesson-library-hero";
import HeroFeatureStrip from "@/components/hero-feature-strip";
import HeroTrustIndicator from "@/components/hero-trust-indicator";
import { FeaturedTopics } from "@/components/featured-topics";
import { LessonProgressCard } from "@/components/lesson-progress-card";
import { LessonLibraryCTA } from "@/components/lesson-library-cta";
import { ContextualRelatedResources } from "@/components/related-resources";
import { 
  Heart, 
  Wind, 
  Brain, 
  Droplets, 
  ChevronRight,
  BookOpen,
  Lock,
  Activity,
  Pill,
  AlertCircle,
  Baby,
  Users,
  Eye,
  Beaker,
  Zap,
  ShieldAlert,
  Scissors,
  Stethoscope,
  Bug,
  Thermometer,
  PlayCircle,
  Scale,
  Clock,
  Home,
  Flame,
  HeartHandshake,
  Bandage,
  Target,
  Calculator,
  GraduationCap,
  Microscope,
  FlaskConical,
  BarChart3,
  Trophy,
  Lightbulb,
  Search,
  FileText,
  Syringe,
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Save,
  Loader2,
  Dna,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowRight,
} from "lucide-react";

import { type DifficultyLevel, difficultyConfig, getDifficulty } from "@/lib/difficulty";
import { useAuth } from "@/lib/auth";
import { getSystemImage, getSystemPreviewImage } from "@/lib/system-images";


import {
  fundamentalsSystems,
  delegationSystems,
  clinicalScenariosSystems,
  medMathSystems,
  preNursingSystems,
  freeCardiovascularSystems,
  freeEndocrineSystems,
  freeGIRenalSystems,
  freeMusculoskeletalSystems,
  freeMaternalSystems,
  freeImmuneSystems,
  freeMentalHealthSystems,
  freeOncologySystems,
  freePharmacologySystems,
  allFreeSystems,
  rpnSystems,
  rnSystems,
  npSystems,
} from "@/data/lesson-systems";

export {
  fundamentalsSystems,
  delegationSystems,
  clinicalScenariosSystems,
  medMathSystems,
  preNursingSystems,
  freeCardiovascularSystems,
  freeEndocrineSystems,
  freeGIRenalSystems,
  freeMusculoskeletalSystems,
  freeMaternalSystems,
  freeImmuneSystems,
  freeMentalHealthSystems,
  freeOncologySystems,
  freePharmacologySystems,
  allFreeSystems,
  rpnSystems,
  rnSystems,
  npSystems,
};


function LecturesSection({ tier, onNavigate }: { tier: string; onNavigate: (path: string) => void }) {
  const { t } = useI18n();
  const lectures = getLecturesForTier(tier);
  if (lectures.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <PlayCircle className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t("lessons.microLectures")}</h2>
          <p className="text-sm text-gray-500">{t("lessons.microLecturesDesc")}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {lectures.map((lecture) => (
          <div
            key={lecture.slug}
            data-testid={`lecture-card-${lecture.slug}`}
            onClick={() => onNavigate(`/lectures/${lecture.slug}`)}
            className="flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer group"
          >
            <div className="p-2.5 rounded-lg bg-primary/15 shrink-0">
              <PlayCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-medium text-gray-900 block truncate">{lecture.title}</span>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lecture.duration}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{lecture.level}</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}


let cachedAvailableIds: Set<string> | null = null;
function useAvailableLessonIds(): Set<string> | null {
  const [ids, setIds] = useState<Set<string> | null>(cachedAvailableIds);
  useEffect(() => {
    if (cachedAvailableIds) { setIds(cachedAvailableIds); return; }
    fetch("/api/lessons/available-ids")
      .then(r => r.json())
      .then((arr: string[]) => {
        cachedAvailableIds = new Set(arr);
        setIds(cachedAvailableIds);
      })
      .catch(() => {});
  }, []);
  return ids;
}

export default function Lessons() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { t, language } = useI18n();
  const [translationsReady, setTranslationsReady] = useState(isTranslationLoaded(language));
  const userTier = user?.tier || "free";
  const isAdmin = userTier === "admin";
  const previewTier = isAdmin ? (localStorage.getItem("nursenest-admin-preview") || null) : null;
  const effectiveTier = previewTier || userTier;
  const showAllTabs = effectiveTier === "admin";
  const availableLessonIds = useAvailableLessonIds();

  useEffect(() => {
    if (language === "en") { setTranslationsReady(true); return; }
    let cancelled = false;
    loadTranslationLanguage(language).then(() => {
      if (!cancelled) setTranslationsReady(true);
    });
    return () => { cancelled = true; };
  }, [language]);

  const isFreeUser = !authLoading && (!user || effectiveTier === "free");
  const defaultTab = showAllTabs ? "rpn" : isFreeUser ? "rpn" : effectiveTier;
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [lessonSearchQuery, setLessonSearchQuery] = useState("");
  const [selectedSystemFilter, setSelectedSystemFilter] = useState<string>("all");

  interface DbLesson {
    id: number;
    title: string;
    slug: string;
    category?: string;
    bodySystem?: string;
    tier?: string;
    summary?: string;
    tags?: string[];
  }

  const [dbLessons, setDbLessons] = useState<DbLesson[]>([]);
  const [customSystems, setCustomSystems] = useState<any[]>([]);
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [editingSystem, setEditingSystem] = useState<any>(null);
  const [systemModalTier, setSystemModalTier] = useState("rpn");
  const [lessonOverrides, setLessonOverrides] = useState<Record<string, any>>({});
  const [completeLessons, setCompleteLessons] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const refreshOverrides = () => {
    fetch("/api/lesson-overrides", { headers: getAuthHeaders() })
      .then((r) => r.ok ? r.json() : {})
      .then(setLessonOverrides)
      .catch(() => {});
  };

  useEffect(() => {
    if (authLoading) return;
    refreshOverrides();
    fetch("/api/lessons/meta", { headers: getAuthHeaders() })
      .then(async (r) => {
        const parsed = await readApiJsonResponse<{ id: string; isComplete: boolean }[]>(r);
        if (!parsed.ok) {
          if (parsed.code === BackendErrorCodes.CONTENT_MODULE_UNAVAILABLE) {
            toast({
              title: "Lessons temporarily unavailable",
              description: getLearnerMessageForCode(parsed.code, parsed.message),
            });
          } else if (parsed.status === 401 || parsed.code === BackendErrorCodes.AUTH_REQUIRED) {
            toast({
              title: "Sign in required",
              description: getLearnerMessageForCode(parsed.code, parsed.message),
            });
          }
          return [];
        }
        return Array.isArray(parsed.data) ? parsed.data : [];
      })
      .then((meta: { id: string; isComplete: boolean }[]) => {
        const complete = new Set<string>();
        for (const m of meta) {
          if (m.isComplete) complete.add(m.id);
        }
        setCompleteLessons(complete);
      })
      .catch(() => {});
  }, [authLoading]);

  useEffect(() => {
    fetch("/api/custom-modules?page=lessons", { headers: getAuthHeaders() })
      .then((r) => r.ok ? r.json() : [])
      .then(setCustomSystems)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (authLoading) return;
    const langParam = language && language !== "en" ? `?lang=${encodeURIComponent(language)}` : "";
    fetch(`/api/content/lessons${langParam}`, { headers: getAuthHeaders() })
      .then((r) => r.ok ? r.json() : [])
      .then((data: any) => {
        const lessons = Array.isArray(data) ? data : [];
        setDbLessons(lessons);
      })
      .catch(() => setDbLessons([]));
  }, [language, authLoading]);

  const deleteCustomSystem = async (id: string) => {
    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    try {
      const res = await fetch(`/api/custom-modules/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: creds.username, password: creds.password }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setCustomSystems((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "System deleted" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };


  useEffect(() => {
    if (!authLoading && isAdmin) {
      const staticRpnCount = [...fundamentalsSystems, ...delegationSystems, ...clinicalScenariosSystems, ...medMathSystems, ...allFreeSystems, ...rpnSystems.filter(s => !s.id.includes("pharmacology"))].reduce((acc, s) => acc + (s.diseases?.length || s.lessons?.length || 0), 0);
      console.log("[LessonDebug] Admin diagnostics:", {
        detectedTier: userTier,
        effectiveTier,
        authTokenPresent: !!localStorage.getItem("nursenest-user-token"),
        adminTokenPresent: !!localStorage.getItem("nn_admin_access_token"),
        staticRpnLessonCount: staticRpnCount,
        dbLessonCount: dbLessons.length,
        dbLessonsMapped: mergedSystemsMap.additions.size,
        dbLessonsUnmapped: mergedSystemsMap.unmapped.length,
        isFreeUser,
        authLoading,
      });
    }
  }, [authLoading, isAdmin, dbLessons.length]);

  const rpnNonPharm = rpnSystems.filter(s => !s.id.includes("pharmacology"));
  const rnNonPharm = rnSystems.filter(s => !s.id.includes("pharmacology"));
  const npNonPharm = npSystems.filter(s => !s.id.includes("pharmacology"));

  const categoryKeywordMap: Record<string, string[]> = {
    "cardiovascular": ["cardiac", "heart", "cardio", "ecg", "ekg", "arrhythmia", "hypertension", "angina", "mi ", "myocardial", "pacemaker", "aortic", "vascular", "dvt", "embolism", "tamponade"],
    "respiratory": ["respiratory", "lung", "pulmonary", "asthma", "copd", "pneumonia", "bronch", "oxygen", "ventilat", "airway", "tracheostomy", "pleural"],
    "neurological": ["neuro", "brain", "stroke", "seizure", "dementia", "parkinson", "cranial", "spinal", "meningitis", "neuropathy"],
    "gastrointestinal": ["gastrointestinal", "gi ", "hepat", "liver", "bowel", "colon", "gastric", "esophag", "pancreat", "appendic", "hernia", "ulcer", "crohn", "celiac"],
    "renal": ["renal", "kidney", "dialysis", "urinary", "bladder", "nephro", "uti"],
    "endocrine": ["endocrine", "thyroid", "diabetes", "insulin", "adrenal", "pituitary", "hormone", "cushing", "addison"],
    "hematology": ["hematolog", "blood", "anemia", "leukemia", "lymphoma", "platelet", "coagulat", "hemophilia", "sickle cell", "transfusion"],
    "musculoskeletal": ["musculoskeletal", "orthopedic", "fracture", "joint", "arthritis", "osteo", "sprain", "lumbar", "skeletal", "bone"],
    "mental-health": ["mental health", "psychiatr", "psych", "anxiety", "depression", "bipolar", "schizophren", "dsm", "personality disorder", "ptsd"],
    "maternity": ["maternity", "obstetric", "prenatal", "antenatal", "postpartum", "labor", "delivery", "fetal", "gestation", "pregnancy"],
    "pediatrics": ["pediatric", "peds", "neonatal", "newborn", "infant", "child health"],
    "infectious": ["infection", "infectious", "bacteria", "virus", "fungal", "sepsis", "hiv", "aids", "tuberculosis", "hepatitis", "mrsa", "vaccine", "immuniz"],
    "pharmacology": ["pharmacolog", "medication", "drug", "prescribing", "dosing", "adverse effect", "antidote"],
    "oncology": ["oncolog", "cancer", "tumor", "carcinoma", "sarcoma", "chemotherapy", "radiation therapy", "malignant"],
    "immune": ["immune", "autoimmune", "allergy", "antibody", "immunoglobulin", "lupus", "rheumatoid"],
    "wound-care": ["wound", "burn", "pressure ulcer", "debridement", "skin integrity"],
    "fluid-electrolytes": ["electrolyte", "sodium", "potassium", "calcium", "magnesium", "fluid balance", "dehydration", "edema"],
  };

  const systemIdCategoryMap: Record<string, string> = {};
  const allStaticSystems = [...fundamentalsSystems, ...delegationSystems, ...clinicalScenariosSystems, ...medMathSystems, ...allFreeSystems, ...rpnSystems, ...rnSystems, ...npSystems];
  for (const sys of allStaticSystems) {
    const title = (sys.title || "").toLowerCase();
    for (const [cat] of Object.entries(categoryKeywordMap)) {
      if (title.includes(cat) || sys.id.includes(cat)) {
        systemIdCategoryMap[sys.id] = cat;
        break;
      }
    }
  }

  function mapDbLessonToCategory(lesson: DbLesson): string | null {
    const cat = (lesson.category || "").toLowerCase();
    const body = (lesson.bodySystem || "").toLowerCase();
    const titleLower = (lesson.title || "").toLowerCase();
    const slugLower = (lesson.slug || "").toLowerCase();

    for (const [category, keywords] of Object.entries(categoryKeywordMap)) {
      if (cat.includes(category) || body.includes(category)) return category;
      for (const kw of keywords) {
        if (titleLower.includes(kw) || slugLower.includes(kw)) return category;
      }
    }
    return null;
  }

  function findBestSystemId(category: string, tier: string): string | null {
    const tierSuffix = `-${tier}`;
    for (const sys of allStaticSystems) {
      const sysCategory = systemIdCategoryMap[sys.id];
      if (sysCategory === category && sys.id.endsWith(tierSuffix)) return sys.id;
    }
    for (const sys of allStaticSystems) {
      const sysCategory = systemIdCategoryMap[sys.id];
      if (sysCategory === category && sys.id.startsWith("free-")) return sys.id;
    }
    for (const sys of allStaticSystems) {
      if (systemIdCategoryMap[sys.id] === category) return sys.id;
    }
    return null;
  }

  const mergedSystemsMap = useMemo(() => {
    if (dbLessons.length === 0) return { additions: new Map<string, any[]>(), unmapped: [] as DbLesson[] };

    const staticSlugs = new Set<string>();
    for (const sys of allStaticSystems) {
      for (const d of sys.diseases || []) {
        staticSlugs.add(d.id);
      }
    }

    const additions = new Map<string, any[]>();
    const unmapped: DbLesson[] = [];

    for (const lesson of dbLessons) {
      if (staticSlugs.has(lesson.slug)) continue;

      const category = mapDbLessonToCategory(lesson);
      if (!category) {
        unmapped.push(lesson);
        continue;
      }

      const tier = lesson.tier || "free";
      const systemId = findBestSystemId(category, tier);
      if (!systemId) {
        unmapped.push(lesson);
        continue;
      }

      if (!additions.has(systemId)) additions.set(systemId, []);
      additions.get(systemId)!.push({
        id: lesson.slug,
        name: canonicalDisplayName(lesson.title),
        status: "Available",
        _dbLesson: true,
      });
    }

    return { additions, unmapped };
  }, [dbLessons]);

  useEffect(() => {
    if (isAdmin && mergedSystemsMap.unmapped.length > 0) {
      console.log("[LessonMerge] Unmapped DB lessons (admin review needed):", mergedSystemsMap.unmapped.map(l => ({ id: l.id, title: l.title, slug: l.slug, category: l.category, bodySystem: l.bodySystem })));
    }
  }, [isAdmin, mergedSystemsMap.unmapped]);

  function getEnhancedSystem(system: any): any {
    const extras = mergedSystemsMap.additions.get(system.id);
    if (!extras || extras.length === 0) return system;
    const existingIds = new Set((system.diseases || []).map((d: any) => d.id));
    const newDiseases = extras.filter(e => !existingIds.has(e.id));
    if (newDiseases.length === 0) return system;
    return { ...system, diseases: [...system.diseases, ...newDiseases] };
  }

  function enhanceSystems(systems: any[]): any[] {
    return systems.map(getEnhancedSystem);
  }

  const preNursingRoutes: Record<string, string> = {
    "pre-nursing-science": "/pre-nursing?module=science-foundations",
    "pre-nursing-anatomy": "/pre-nursing?module=anatomy-physiology",
    "pre-nursing-research": "/pre-nursing?module=research-statistics",
    "pre-nursing-terminology": "/pre-nursing?module=medical-terminology",
    "pre-nursing-chemistry": "/pre-nursing?module=chemistry",
    "pre-nursing-microbiology": "/pre-nursing?module=microbiology",
    "pre-nursing-infection-control": "/pre-nursing?module=infection-control",
    "pre-nursing-fluids": "/pre-nursing?module=fluids-electrolytes",
    "pre-nursing-communication": "/pre-nursing?module=communication",
    "pre-nursing-ethics": "/pre-nursing?module=ethics-legal",
    "pre-nursing-study": "/pre-nursing?module=study-strategies",
  };

  const handleLessonSelect = (id: string) => {
    if (preNursingRoutes[id]) {
      setLocation(preNursingRoutes[id]);
    } else {
      setLocation(`/lessons/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
      <SEO
        title={t("pages.lessons.clinicalLessonLibraryNursingPathophysiology")}
        description={t("pages.lessons.explore150StructuredNursingLessons")}
        keywords="nursing pathophysiology lessons, body system nursing, cardiovascular nursing, respiratory nursing, neurological nursing, NCLEX study guide, nursing exam prep, clinical nursing education"
        canonicalPath="/lessons"
        ogType="website"
        structuredData={buildCatalogStructuredData(
          rpnSystems.flatMap((s) => s.diseases.map((d) => ({ id: d.id, name: d.name })))
            .concat(rnSystems.flatMap((s) => s.diseases.map((d) => ({ id: d.id, name: d.name }))))
        )}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Lessons", url: "https://www.nursenest.ca/lessons" },
        ]}
      />
      <Navigation />
      
      <LessonLibraryHero activeTier={activeTab} />
      <HeroFeatureStrip />
      <HeroTrustIndicator />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-12 flex flex-col items-center gap-6">
          <div className="text-center w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{t("lessons.title")}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t("lessons.subtitle")}</p>
          </div>
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSelectedSystemFilter("all"); }} className="w-full md:w-auto">
            <TabsList className={cn("bg-gray-100 rounded-full p-1", showAllTabs ? "grid grid-cols-4 w-full md:w-[700px]" : isFreeUser ? "grid grid-cols-3 w-full md:w-[525px]" : "grid grid-cols-2 w-full md:w-[350px]")}>
              {showAllTabs ? (
                <>
                  <TabsTrigger value="rpn" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm" data-testid="tab-rpn">{t("lessons.rpn")}</TabsTrigger>
                  <TabsTrigger value="rn" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm" data-testid="tab-rn">{t("lessons.rn")}</TabsTrigger>
                  <TabsTrigger value="np" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm text-purple-700 font-bold text-xs sm:text-sm" data-testid="tab-np">{t("lessons.np")}</TabsTrigger>
                  <TabsTrigger value="pharmacology" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm text-indigo-700 font-semibold text-xs sm:text-sm" data-testid="tab-pharmacology">{t("lessons.pharmacology")}</TabsTrigger>
                </>
              ) : isFreeUser ? (
                <>
                  <TabsTrigger value="rpn" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm" data-testid="tab-rpn-preview">{t("pages.lessons.rpnPreview")}</TabsTrigger>
                  <TabsTrigger value="rn" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm" data-testid="tab-rn-preview">{t("pages.lessons.rnPreview")}</TabsTrigger>
                  <TabsTrigger value="np" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm" data-testid="tab-np-preview">{t("pages.lessons.npPreview")}</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value={effectiveTier} className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm" data-testid={`tab-${effectiveTier}`}>
                    {effectiveTier === "rpn" ? t("lessons.rpn") : effectiveTier === "rn" ? t("lessons.rn") : t("lessons.np")} {t("lessons.lessons")}
                  </TabsTrigger>
                  <TabsTrigger value="pharmacology" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm text-indigo-700 font-semibold text-xs sm:text-sm" data-testid="tab-pharmacology">{t("lessons.pharmacology")}</TabsTrigger>
                </>
              )}
            </TabsList>
          </Tabs>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row items-center gap-3 max-w-3xl mx-auto">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t("pages.lessons.searchLessonsByTitle")}
              value={lessonSearchQuery}
              onChange={(e) => setLessonSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-gray-200 bg-white shadow-sm"
              data-testid="input-lesson-search"
            />
            {lessonSearchQuery && (
              <button
                onClick={() => setLessonSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                data-testid="button-clear-lesson-search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={selectedSystemFilter}
            onChange={(e) => {
              setSelectedSystemFilter(e.target.value);
              if (e.target.value !== "all") {
                const el = document.getElementById(`system-${e.target.value}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            className="w-full sm:w-56 h-10 rounded-full border border-gray-200 bg-white shadow-sm px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
            data-testid="select-system-filter"
          >
            <option value="all">{t("pages.lessons.allSystems")}</option>
            {(() => {
              const currentSystems = activeTab === "rpn" ? enhanceSystems([...fundamentalsSystems, ...delegationSystems, ...clinicalScenariosSystems, ...medMathSystems, ...allFreeSystems, ...rpnNonPharm])
                : activeTab === "rn" ? enhanceSystems([...clinicalScenariosSystems, ...medMathSystems, ...allFreeSystems, ...rnNonPharm])
                : activeTab === "np" ? enhanceSystems([...medMathSystems, ...allFreeSystems, ...npNonPharm])
                : [];
              return currentSystems.map((s) => (
                <option key={s.id} value={s.id}>{s.title || s.name} ({(s.diseases || s.lessons || []).length})</option>
              ));
            })()}
          </select>
        </div>

        {isFreeUser && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-white to-primary/5 border border-primary/20 text-center" data-testid="banner-lesson-upgrade">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t("pages.lessons.unlockTheFullLessonLibrary")}</h3>
            <p className="text-sm text-gray-600 mb-4 max-w-2xl mx-auto">
              You are viewing a preview of available lessons. Subscribe to access the complete {activeTab === "rpn" ? "RPN" : activeTab === "rn" ? "RN" : "NP"} lesson library with detailed content, quizzes, and progress tracking.
            </p>
            <Button
              size="sm"
              className="rounded-full bg-primary hover:brightness-110 text-white px-6"
              onClick={() => setLocation("/pricing")}
              data-testid="button-lesson-upgrade"
            >
              View Plans
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <FeaturedTopics activeTier={activeTab} onNavigate={(path) => setLocation(path)} />
          </div>
          <div className="lg:col-span-1">
            <LessonProgressCard
              activeTier={activeTab}
              systems={activeTab === "rpn" ? enhanceSystems([...fundamentalsSystems, ...delegationSystems, ...clinicalScenariosSystems, ...medMathSystems, ...allFreeSystems, ...rpnNonPharm])
                : activeTab === "rn" ? enhanceSystems([...clinicalScenariosSystems, ...medMathSystems, ...allFreeSystems, ...rnNonPharm])
                : activeTab === "np" ? enhanceSystems([...medMathSystems, ...allFreeSystems, ...npNonPharm])
                : []}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="rpn" className="mt-0">
            <LecturesSection tier="rpn" onNavigate={setLocation} />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enhanceSystems([...fundamentalsSystems, ...delegationSystems, ...clinicalScenariosSystems, ...medMathSystems, ...allFreeSystems, ...rpnNonPharm]).filter((system) => { if (selectedSystemFilter !== "all" && system.id !== selectedSystemFilter) return false; if (!lessonSearchQuery) return true; const q = lessonSearchQuery.toLowerCase(); const sysName = (system.name || system.title || "").toLowerCase(); return sysName.includes(q) || system.diseases?.some((d: any) => d.name?.toLowerCase().includes(q)) || system.lessons?.some((l: any) => l.title?.toLowerCase().includes(q)); }).map((system) => (
                <LessonSystemCard key={system.id} system={system} tier="rpn" onSelect={handleLessonSelect} lessonOverrides={lessonOverrides} onOverridesChange={refreshOverrides} completeLessons={completeLessons} availableLessonIds={availableLessonIds} />
              ))}
              {customSystems.filter((s) => s.tier === "rpn" || !s.tier).map((cs) => (
                <CustomSystemCard key={cs.id} system={cs} tier="rpn" isAdmin={isAdmin} onSelect={handleLessonSelect} onEdit={() => { setEditingSystem(cs); setSystemModalTier("rpn"); setShowSystemModal(true); }} onDelete={() => { if (confirm("Delete this system?")) deleteCustomSystem(cs.id); }} lessonOverrides={lessonOverrides} onOverridesChange={refreshOverrides} />
              ))}
              {isAdmin && (
                <AddSystemCard onClick={() => { setEditingSystem(null); setSystemModalTier("rpn"); setShowSystemModal(true); }} />
              )}
            </div>
          </TabsContent>
          <TabsContent value="rn" className="mt-0">
            <LecturesSection tier="rn" onNavigate={setLocation} />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enhanceSystems([...clinicalScenariosSystems, ...medMathSystems, ...allFreeSystems, ...rnNonPharm]).filter((system) => { if (selectedSystemFilter !== "all" && system.id !== selectedSystemFilter) return false; if (!lessonSearchQuery) return true; const q = lessonSearchQuery.toLowerCase(); const sysName = (system.name || system.title || "").toLowerCase(); return sysName.includes(q) || system.diseases?.some((d: any) => d.name?.toLowerCase().includes(q)) || system.lessons?.some((l: any) => l.title?.toLowerCase().includes(q)); }).map((system) => (
                <LessonSystemCard key={system.id} system={system} tier="rn" onSelect={handleLessonSelect} lessonOverrides={lessonOverrides} onOverridesChange={refreshOverrides} completeLessons={completeLessons} availableLessonIds={availableLessonIds} />
              ))}
              {customSystems.filter((s) => s.tier === "rn" || !s.tier).map((cs) => (
                <CustomSystemCard key={cs.id} system={cs} tier="rn" isAdmin={isAdmin} onSelect={handleLessonSelect} onEdit={() => { setEditingSystem(cs); setSystemModalTier("rn"); setShowSystemModal(true); }} onDelete={() => { if (confirm("Delete this system?")) deleteCustomSystem(cs.id); }} lessonOverrides={lessonOverrides} onOverridesChange={refreshOverrides} />
              ))}
              {isAdmin && (
                <AddSystemCard onClick={() => { setEditingSystem(null); setSystemModalTier("rn"); setShowSystemModal(true); }} />
              )}
            </div>
          </TabsContent>
          <TabsContent value="np" className="mt-0">
            <LecturesSection tier="np" onNavigate={setLocation} />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enhanceSystems([...medMathSystems, ...allFreeSystems, ...npNonPharm]).filter((system) => { if (selectedSystemFilter !== "all" && system.id !== selectedSystemFilter) return false; if (!lessonSearchQuery) return true; const q = lessonSearchQuery.toLowerCase(); const sysName = (system.name || system.title || "").toLowerCase(); return sysName.includes(q) || system.diseases?.some((d: any) => d.name?.toLowerCase().includes(q)) || system.lessons?.some((l: any) => l.title?.toLowerCase().includes(q)); }).map((system) => (
                <LessonSystemCard key={system.id} system={system} tier="np" onSelect={handleLessonSelect} lessonOverrides={lessonOverrides} onOverridesChange={refreshOverrides} completeLessons={completeLessons} availableLessonIds={availableLessonIds} />
              ))}
              {customSystems.filter((s) => s.tier === "np" || !s.tier).map((cs) => (
                <CustomSystemCard key={cs.id} system={cs} tier="np" isAdmin={isAdmin} onSelect={handleLessonSelect} onEdit={() => { setEditingSystem(cs); setSystemModalTier("np"); setShowSystemModal(true); }} onDelete={() => { if (confirm("Delete this system?")) deleteCustomSystem(cs.id); }} lessonOverrides={lessonOverrides} onOverridesChange={refreshOverrides} />
              ))}
              {isAdmin && (
                <AddSystemCard onClick={() => { setEditingSystem(null); setSystemModalTier("np"); setShowSystemModal(true); }} />
              )}
            </div>
          </TabsContent>
          <TabsContent value="pharmacology" className="mt-0">
            <div className="space-y-10">
              {(showAllTabs || effectiveTier === "rpn") && (
                <div>
                  <h2 className="text-lg font-bold text-gray-700 mb-4">{t("lessons.rpnPharmacology")}</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rpnSystems.filter(s => s.id.includes("pharmacology")).filter((system) => { if (!lessonSearchQuery) return true; const q = lessonSearchQuery.toLowerCase(); const sysName = (system.name || system.title || "").toLowerCase(); return sysName.includes(q) || system.diseases?.some((d: any) => d.name?.toLowerCase().includes(q)) || system.lessons?.some((l: any) => l.title?.toLowerCase().includes(q)); }).map((system) => (
                      <LessonSystemCard key={system.id} system={system} tier="rpn" onSelect={(id) => setLocation(`/lessons/${id}`)} lessonOverrides={lessonOverrides} onOverridesChange={refreshOverrides} completeLessons={completeLessons} availableLessonIds={availableLessonIds} />
                    ))}
                  </div>
                </div>
              )}
              {(showAllTabs || effectiveTier === "rn") && (
                <div>
                  <h2 className="text-lg font-bold text-gray-700 mb-4">{t("lessons.rnPharmacology")}</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rnSystems.filter(s => s.id.includes("pharmacology")).filter((system) => { if (!lessonSearchQuery) return true; const q = lessonSearchQuery.toLowerCase(); const sysName = (system.name || system.title || "").toLowerCase(); return sysName.includes(q) || system.diseases?.some((d: any) => d.name?.toLowerCase().includes(q)) || system.lessons?.some((l: any) => l.title?.toLowerCase().includes(q)); }).map((system) => (
                      <LessonSystemCard key={system.id} system={system} tier="rn" onSelect={(id) => setLocation(`/lessons/${id}`)} lessonOverrides={lessonOverrides} onOverridesChange={refreshOverrides} completeLessons={completeLessons} availableLessonIds={availableLessonIds} />
                    ))}
                  </div>
                </div>
              )}
              {(showAllTabs || effectiveTier === "np") && (
                <div>
                  <h2 className="text-lg font-bold text-gray-700 mb-4">{t("lessons.npPharmacology")}</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {npSystems.filter(s => s.id.includes("pharmacology")).filter((system) => { if (!lessonSearchQuery) return true; const q = lessonSearchQuery.toLowerCase(); const sysName = (system.name || system.title || "").toLowerCase(); return sysName.includes(q) || system.diseases?.some((d: any) => d.name?.toLowerCase().includes(q)) || system.lessons?.some((l: any) => l.title?.toLowerCase().includes(q)); }).map((system) => (
                      <LessonSystemCard key={system.id} system={system} tier="np" onSelect={(id) => setLocation(`/lessons/${id}`)} lessonOverrides={lessonOverrides} onOverridesChange={refreshOverrides} completeLessons={completeLessons} availableLessonIds={availableLessonIds} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      {showSystemModal && (
        <LessonSystemModal
          system={editingSystem}
          defaultTier={systemModalTier}
          onClose={() => { setShowSystemModal(false); setEditingSystem(null); }}
          onSaved={(mod) => {
            if (editingSystem) {
              setCustomSystems((prev) => prev.map((s) => s.id === mod.id ? mod : s));
            } else {
              setCustomSystems((prev) => [...prev, mod]);
            }
            setShowSystemModal(false);
            setEditingSystem(null);
          }}
        />
      )}
      <LessonLibraryCTA activeTier={activeTab} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContextualRelatedResources
          pageType="lesson"
          currentPath="/lessons"
          className="border-t border-gray-200"
        />
      </div>

      <AdminEditButton />
      <Footer />
    </div>
  );
}

function estimateStudyTime(difficulty: DifficultyLevel): string {
  const minutes: Record<DifficultyLevel, number> = { 1: 5, 2: 7, 3: 10, 4: 13, 5: 18 };
  return `${minutes[difficulty]} min`;
}

function DifficultyBadge({ level }: { level: DifficultyLevel }) {
  const config = difficultyConfig[level];
  const shortLabels: Record<DifficultyLevel, string> = { 1: "B", 2: "E", 3: "M", 4: "H", 5: "X" };
  const fullLabels: Record<DifficultyLevel, string> = { 1: "Beginner", 2: "Easy", 3: "Moderate", 4: "Hard", 5: "Expert" };
  return (
    <span data-testid={`badge-difficulty-${level}`} title={fullLabels[level]} className={cn("font-semibold rounded-full whitespace-nowrap text-[10px] leading-tight px-1.5 py-px", config.color, config.bg)}>
      <span className="hidden sm:inline">{fullLabels[level]}</span>
      <span className="sm:hidden">{shortLabels[level]}</span>
    </span>
  );
}

const COLLAPSE_THRESHOLD = 6;

function CollapsibleLessonList({ diseases, systemId, children }: { diseases: any[]; systemId: string; children: (disease: any) => React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...diseases].sort((a: any, b: any) => a.name.localeCompare(b.name));
  const shouldCollapse = sorted.length > COLLAPSE_THRESHOLD;
  const visible = shouldCollapse && !expanded ? sorted.slice(0, COLLAPSE_THRESHOLD) : sorted;
  const hiddenCount = sorted.length - COLLAPSE_THRESHOLD;

  return (
    <div className="space-y-1.5">
      {visible.map((disease) => children(disease))}
      {shouldCollapse && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center py-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-primary/5"
          data-testid={`button-toggle-${systemId}`}
        >
          {expanded ? "Show less" : `Show ${hiddenCount} more`}
        </button>
      )}
    </div>
  );
}

function LessonSystemCard({ system, onSelect, tier, lessonOverrides, onOverridesChange, completeLessons, availableLessonIds }: { system: any, onSelect: (id: string) => void, tier: string, lessonOverrides?: Record<string, any>, onOverridesChange?: () => void, completeLessons?: Set<string>, availableLessonIds?: Set<string> | null }) {
  const { t, language } = useI18n();
  const { user } = useAuth();
  const { getImageUrl, refresh: refreshImages } = useSiteImages();
  const systemImg = getSystemPreviewImage(system.id) || getSystemImage(system.id);
  const isAdmin = user?.tier === "admin";

  const filteredSystem = useMemo(() => {
    let diseases = system.diseases;
    if (!isAdmin && availableLessonIds) {
      diseases = diseases.filter((d: any) => availableLessonIds.has(d.id));
    }
    if (!isAdmin && completeLessons && completeLessons.size > 0) {
      diseases = diseases.filter((d: any) => completeLessons.has(d.id));
    }
    if (diseases.length === system.diseases.length) return system;
    return { ...system, diseases };
  }, [system, isAdmin, completeLessons, availableLessonIds]);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const { toast } = useToast();

  const saveLessonName = async (lessonId: string, newName: string) => {
    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    setSavingName(true);
    try {
      const existing = lessonOverrides?.[lessonId] || {};
      const res = await fetch(`/api/lesson-overrides/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...existing, title: newName, username: creds.username, password: creds.password }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast({ title: "Lesson name updated" });
      setEditingLessonId(null);
      onOverridesChange?.();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSavingName(false);
    }
  };

  const uploadAndSaveLessonImage = async (lessonId: string, file: File) => {
    setUploadingImage(lessonId);
    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    try {
      const reqRes = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type || "image/png" }),
      });
      if (!reqRes.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await reqRes.json();
      const uploadRes = await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type || "image/png" } });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const saveRes = await fetch(`/api/site-images/${encodeURIComponent(`lesson-${lessonId}`)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: objectPath, username: creds.username, password: creds.password }),
      });
      if (!saveRes.ok) throw new Error("Save failed");
      toast({ title: "Lesson image updated" });
      refreshImages();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setUploadingImage(null);
    }
  };

  const removeLessonImage = async (lessonId: string) => {
    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    try {
      const res = await fetch(`/api/site-images/${encodeURIComponent(`lesson-${lessonId}`)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: creds.username, password: creds.password }),
      });
      if (!res.ok) throw new Error("Delete failed");
      toast({ title: "Lesson image removed" });
      refreshImages();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  if (!isAdmin && filteredSystem.diseases.length === 0) return null;

  return (
    <Card id={`system-${system.id}`} className="border-none shadow-md hover:shadow-lg transition-all overflow-hidden bg-white scroll-mt-24">
      <CardHeader className={cn("flex flex-row items-center gap-3 py-3 px-4", system.bgColor)}>
        <div className={cn("p-2 rounded-lg bg-white shadow-sm", system.color)}>
          <system.icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base font-bold text-gray-900">{system.title}</CardTitle>
          {isAdmin && completeLessons && (() => {
            const completed = system.diseases.filter((d: any) => completeLessons.has(d.id)).length;
            const total = system.diseases.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            return completed > 0 ? (
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">{completed}/{total}</span>
              </div>
            ) : null;
          })()}
        </div>
        <Badge variant="secondary" className="text-[10px] font-medium bg-gray-100 text-gray-500 shrink-0" data-testid={`badge-count-${system.id}`}>{filteredSystem.diseases.length} {filteredSystem.diseases.length === 1 ? "lesson" : "lessons"}</Badge>
      </CardHeader>
      <CardContent className="pt-3 px-4 pb-4">
        <CollapsibleLessonList diseases={filteredSystem.diseases} systemId={system.id}>
          {(disease: any) => {
            const difficulty = getDifficulty(disease.id, tier);
            const overrideName = lessonOverrides?.[disease.id]?.title;
            const displayName = canonicalDisplayName(overrideName || getLessonTitle(disease.id, language) || disease.name);
            const lessonImgUrl = getImageUrl(`lesson-${disease.id}`, "");
            const isEditingThis = editingLessonId === disease.id;
            return (
              <div 
                key={disease.id}
                data-testid={`lesson-card-${disease.id}`}
                onClick={() => !isEditingThis && disease.status === "Available" && onSelect(disease.id)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg border transition-all group",
                  isEditingThis ? "border-primary/30 bg-primary/5" :
                  disease.status === "Available" 
                    ? "border-primary/10 bg-primary/5 hover:bg-primary/10 cursor-pointer" 
                    : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", disease.status === "Available" ? "bg-primary" : "bg-gray-300")} />
                  {isEditingThis ? (
                    <div className="flex items-center gap-2 min-w-0 flex-1" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8 text-sm font-medium flex-1"
                        autoFocus
                        data-testid={`input-edit-lesson-name-${disease.id}`}
                        onKeyDown={(e) => { if (e.key === "Enter" && editName.trim()) saveLessonName(disease.id, editName.trim()); if (e.key === "Escape") setEditingLessonId(null); }}
                      />
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" disabled={savingName || !editName.trim()} onClick={() => saveLessonName(disease.id, editName.trim())} data-testid={`button-save-lesson-name-${disease.id}`}>
                        {savingName ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditingLessonId(null)} data-testid={`button-cancel-edit-${disease.id}`}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {displayName}
                    </span>
                  )}
                  {isAdmin && completeLessons && completeLessons.has(disease.id) && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" data-testid={`check-complete-${disease.id}`} />
                  )}
                  {isAdmin && completeLessons && !completeLessons.has(disease.id) && (
                    <MinusCircle className="w-4 h-4 text-amber-400 shrink-0" data-testid={`check-incomplete-${disease.id}`} />
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  {isAdmin && !isEditingThis && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingLessonId(disease.id); setEditName(displayName); }}
                        className="w-6 h-6 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-blue-50"
                        title={t("pages.lessons.editLessonName")}
                        data-testid={`button-edit-lesson-name-${disease.id}`}
                      >
                        <Pencil className="w-3 h-3 text-blue-600" />
                      </button>
                      <label
                        className="w-6 h-6 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-green-50 cursor-pointer"
                        title={lessonImgUrl ? "Change lesson image" : "Add lesson image"}
                        data-testid={`button-upload-lesson-image-${disease.id}`}
                      >
                        {uploadingImage === disease.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                        ) : (
                          <Upload className="w-3 h-3 text-green-600" />
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAndSaveLessonImage(disease.id, f); e.target.value = ""; }} />
                      </label>
                      {lessonImgUrl && (
                        <button
                          onClick={(e) => { e.stopPropagation(); if (confirm("Remove lesson image?")) removeLessonImage(disease.id); }}
                          className="w-6 h-6 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-red-50"
                          title={t("pages.lessons.removeLessonImage")}
                          data-testid={`button-remove-lesson-image-${disease.id}`}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      )}
                    </div>
                  )}
                  <span className="hidden sm:flex items-center gap-0.5 text-[10px] text-gray-400" data-testid={`study-time-${disease.id}`}>
                    <Clock className="w-3 h-3" />
                    {estimateStudyTime(difficulty)}
                  </span>
                  <DifficultyBadge level={difficulty} />
                  {disease.status === "Available" ? (
                    <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>
              </div>
            );
          }}
        </CollapsibleLessonList>
      </CardContent>
    </Card>
  );
}

const LESSON_ICON_MAP: Record<string, any> = {
  BookOpen, Heart, Brain, Dna, Activity, Pill, Stethoscope, Beaker, FlaskConical, Lightbulb,
  Droplets, Wind, Sparkles, GraduationCap, Target, Layers, AlertCircle, Baby, Users, Eye,
  ShieldAlert, Scissors, Bug, Thermometer, Flame, HeartHandshake, Bandage, Calculator, Microscope,
};

function CustomSystemCard({ system, tier, isAdmin, onSelect, onEdit, onDelete, lessonOverrides, onOverridesChange }: {
  system: any; tier: string; isAdmin: boolean; onSelect: (id: string) => void; onEdit: () => void; onDelete: () => void; lessonOverrides?: Record<string, any>; onOverridesChange?: () => void;
}) {
  const { language } = useI18n();
  const lessons = (system.lessons || []) as { id: string; name: string; status?: string }[];
  const IconComp = LESSON_ICON_MAP[system.icon] || Stethoscope;
  const { getImageUrl, refresh: refreshImages } = useSiteImages();
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const { toast } = useToast();

  const saveLessonName = async (lessonId: string, newName: string) => {
    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    setSavingName(true);
    try {
      const existing = lessonOverrides?.[lessonId] || {};
      const res = await fetch(`/api/lesson-overrides/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...existing, title: newName, username: creds.username, password: creds.password }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast({ title: "Lesson name updated" });
      setEditingLessonId(null);
      onOverridesChange?.();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSavingName(false);
    }
  };

  const uploadAndSaveLessonImage = async (lessonId: string, file: File) => {
    setUploadingImage(lessonId);
    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    try {
      const reqRes = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type || "image/png" }),
      });
      if (!reqRes.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await reqRes.json();
      const uploadRes = await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type || "image/png" } });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const saveRes = await fetch(`/api/site-images/${encodeURIComponent(`lesson-${lessonId}`)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: objectPath, username: creds.username, password: creds.password }),
      });
      if (!saveRes.ok) throw new Error("Save failed");
      toast({ title: "Lesson image updated" });
      refreshImages();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setUploadingImage(null);
    }
  };

  const removeLessonImage = async (lessonId: string) => {
    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    try {
      const res = await fetch(`/api/site-images/${encodeURIComponent(`lesson-${lessonId}`)}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: creds.username, password: creds.password }),
      });
      if (!res.ok) throw new Error("Delete failed");
      toast({ title: "Lesson image removed" });
      refreshImages();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-all overflow-hidden bg-white relative group">
      <CardHeader className={cn("flex flex-row items-center gap-3 py-3 px-4", system.bgColor || "bg-gray-50")}>
        <div className={cn("p-2 rounded-lg bg-white shadow-sm", system.color || "text-primary")}>
          <IconComp className="w-4 h-4" />
        </div>
        <CardTitle className="text-base font-bold text-gray-900">{system.title}</CardTitle>
        <span className="ml-auto text-xs text-gray-400 font-normal">{lessons.length}</span>
      </CardHeader>
      <CardContent className="pt-3 px-4 pb-4">
        <CollapsibleLessonList diseases={lessons.map((l, i) => ({ ...l, name: l.name || l.id || `lesson-${i}` }))} systemId={system.id || "custom"}>
          {(disease: any) => {
            const idx = lessons.findIndex(l => l.id === disease.id);
            const overrideName = lessonOverrides?.[disease.id]?.title;
            const displayName = canonicalDisplayName(overrideName || getLessonTitle(disease.id, language) || disease.name);
            const lessonImgUrl = disease.id ? getImageUrl(`lesson-${disease.id}`, "") : "";
            const isEditingThis = editingLessonId === disease.id;
            return (
              <div
                key={disease.id || idx}
                data-testid={`custom-lesson-card-${disease.id || idx}`}
                onClick={() => !isEditingThis && disease.id && onSelect(disease.id)}
                className={cn("flex items-center justify-between px-3 py-2 rounded-lg border transition-all group/lesson border-primary/10 bg-primary/5 hover:bg-primary/10", isEditingThis ? "" : "cursor-pointer")}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary" />
                  {isEditingThis ? (
                    <div className="flex items-center gap-2 min-w-0 flex-1" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8 text-sm font-medium flex-1"
                        autoFocus
                        data-testid={`input-edit-lesson-name-${disease.id}`}
                        onKeyDown={(e) => { if (e.key === "Enter" && editName.trim()) saveLessonName(disease.id, editName.trim()); if (e.key === "Escape") setEditingLessonId(null); }}
                      />
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" disabled={savingName || !editName.trim()} onClick={() => saveLessonName(disease.id, editName.trim())} data-testid={`button-save-lesson-name-${disease.id}`}>
                        {savingName ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditingLessonId(null)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-gray-900 truncate">{displayName}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {isAdmin && !isEditingThis && disease.id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingLessonId(disease.id); setEditName(displayName); }}
                        className="w-6 h-6 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-blue-50"
                        title={t("pages.lessons.editLessonName2")}
                        data-testid={`button-edit-lesson-name-${disease.id}`}
                      >
                        <Pencil className="w-3 h-3 text-blue-600" />
                      </button>
                      <label
                        className="w-6 h-6 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-green-50 cursor-pointer"
                        title={lessonImgUrl ? "Change lesson image" : "Add lesson image"}
                        data-testid={`button-upload-lesson-image-${disease.id}`}
                      >
                        {uploadingImage === disease.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                        ) : (
                          <Upload className="w-3 h-3 text-green-600" />
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAndSaveLessonImage(disease.id, f); e.target.value = ""; }} />
                      </label>
                      {lessonImgUrl && (
                        <button
                          onClick={(e) => { e.stopPropagation(); if (confirm("Remove lesson image?")) removeLessonImage(disease.id); }}
                          className="w-6 h-6 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:bg-red-50"
                          title={t("pages.lessons.removeLessonImage2")}
                          data-testid={`button-remove-lesson-image-${disease.id}`}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      )}
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-primary group-hover/lesson:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          }}
        </CollapsibleLessonList>
      </CardContent>
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="w-7 h-7 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center hover:bg-blue-50"
            data-testid={`button-edit-system-${system.id}`}
          >
            <Pencil className="w-3 h-3 text-blue-600" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-7 h-7 rounded-full bg-white/90 shadow-md border border-gray-200 flex items-center justify-center hover:bg-red-50"
            data-testid={`button-delete-system-${system.id}`}
          >
            <Trash2 className="w-3 h-3 text-red-600" />
          </button>
        </div>
      )}
    </Card>
  );
}

function AddSystemCard({ onClick }: { onClick: () => void }) {
  const { t } = useI18n();
  return (
    <Card
      className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all cursor-pointer bg-white/50 flex items-center justify-center min-h-[200px]"
      onClick={onClick}
      data-testid="button-add-system"
    >
      <div className="text-center space-y-3 p-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto hover:bg-primary/20 transition-colors">
          <Plus className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{t("pages.lessons.addSystem")}</p>
          <p className="text-xs text-gray-500 mt-1">{t("pages.lessons.createANewLessonSystem")}</p>
        </div>
      </div>
    </Card>
  );
}

const SYSTEM_ICON_OPTIONS = [
  { name: "BookOpen", icon: BookOpen },
  { name: "Heart", icon: Heart },
  { name: "Brain", icon: Brain },
  { name: "Activity", icon: Activity },
  { name: "Pill", icon: Pill },
  { name: "Stethoscope", icon: Stethoscope },
  { name: "Beaker", icon: Beaker },
  { name: "FlaskConical", icon: FlaskConical },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Droplets", icon: Droplets },
  { name: "Wind", icon: Wind },
  { name: "AlertCircle", icon: AlertCircle },
  { name: "Baby", icon: Baby },
  { name: "Eye", icon: Eye },
  { name: "Scissors", icon: Scissors },
  { name: "Bug", icon: Bug },
];

const SYSTEM_COLOR_OPTIONS = [
  { label: "Red", color: "text-red-500", bg: "bg-red-50" },
  { label: "Blue", color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Green", color: "text-green-500", bg: "bg-green-50" },
  { label: "Purple", color: "text-purple-500", bg: "bg-purple-50" },
  { label: "Amber", color: "text-amber-500", bg: "bg-amber-50" },
  { label: "Teal", color: "text-teal-500", bg: "bg-teal-50" },
  { label: "Rose", color: "text-rose-500", bg: "bg-rose-50" },
  { label: "Indigo", color: "text-indigo-500", bg: "bg-indigo-50" },
];

function LessonSystemModal({ system, defaultTier, onClose, onSaved }: {
  system: any; defaultTier: string; onClose: () => void; onSaved: (mod: any) => void;
}) {
  const [title, setTitle] = useState(system?.title || "");
  const [icon, setIcon] = useState(system?.icon || "Stethoscope");
  const [colorIdx, setColorIdx] = useState(() => {
    const idx = SYSTEM_COLOR_OPTIONS.findIndex((c) => c.color === system?.color);
    return idx >= 0 ? idx : 0;
  });
  const [tier, setTier] = useState(system?.tier || defaultTier);
  const [imageUrl, setImageUrl] = useState(system?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lessons, setLessons] = useState<{ id: string; name: string; status: string }[]>(
    system?.lessons ? (system.lessons as any[]).map((l: any) => ({ ...l, status: l.status || "Available" })) : []
  );
  const [newLessonName, setNewLessonName] = useState("");
  const [newLessonId, setNewLessonId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type || "image/png" }),
      });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await res.json();
      const uploadRes = await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type || "image/png" } });
      if (!uploadRes.ok) throw new Error("Upload failed");
      setImageUrl(objectPath);
    } catch (e: any) {
      toast({ title: "Upload error", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    setSaving(true);
    const creds = JSON.parse(localStorage.getItem("nursenest-credentials") || "{}");
    const selectedColor = SYSTEM_COLOR_OPTIONS[colorIdx];
    const body = {
      page: "lessons",
      title: title.trim(),
      icon,
      color: selectedColor.color,
      bgColor: selectedColor.bg,
      imageUrl: imageUrl || null,
      tier,
      lessons,
      username: creds.username,
      password: creds.password,
    };
    try {
      const url = system ? `/api/custom-modules/${system.id}` : "/api/custom-modules";
      const method = system ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      toast({ title: system ? "System updated" : "System created" });
      onSaved(saved);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} data-testid="modal-lesson-system">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{system ? "Edit System" : "Add New System"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{t("pages.lessons.systemTitle")}</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Endocrine System" data-testid="input-system-title" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t("pages.lessons.tier")}</label>
            <div className="flex gap-2">
              {["rpn", "rn", "np"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={cn("px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all uppercase", tier === t ? "border-primary bg-primary/10 text-primary" : "border-gray-200 text-gray-500 hover:border-gray-300")}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t("pages.lessons.icon")}</label>
            <div className="flex flex-wrap gap-2">
              {SYSTEM_ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setIcon(opt.name)}
                  className={cn("w-9 h-9 rounded-lg flex items-center justify-center border-2 transition-all", icon === opt.name ? "border-primary bg-primary/10" : "border-gray-200 hover:border-gray-300")}
                  title={opt.name}
                >
                  <opt.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t("pages.lessons.color")}</label>
            <div className="flex flex-wrap gap-2">
              {SYSTEM_COLOR_OPTIONS.map((opt, idx) => (
                <button
                  key={opt.label}
                  onClick={() => setColorIdx(idx)}
                  className={cn("px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all", opt.bg, opt.color, colorIdx === idx ? "border-current ring-1 ring-current" : "border-transparent")}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t("pages.lessons.systemImage")}</label>
            {imageUrl && (
              <div className="mb-2 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img src={imageUrl} alt={`${system.title} nursing lessons - NurseNest clinical education`} title={`${system.title} nursing lessons`} loading="lazy" className="w-full h-32 object-cover" />
              </div>
            )}
            <div className="flex gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} className="gap-2">
                {uploading ? <><Loader2 className="w-3 h-3 animate-spin" /> {t("pages.lessons.uploading")}</> : <><Upload className="w-3 h-3" /> {t("pages.lessons.upload")}</>}
              </Button>
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder={t("pages.lessons.orPasteImageUrl")} className="flex-1 text-sm h-9" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{t("pages.lessons.lessons")}</label>
            <div className="space-y-2">
              {lessons.map((l, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 flex-1">{l.name}</span>
                  <span className="text-xs text-gray-400">{l.id}</span>
                  <button onClick={() => setLessons(lessons.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input value={newLessonName} onChange={(e) => setNewLessonName(e.target.value)} placeholder={t("pages.lessons.lessonName")} className="flex-1 text-sm h-9" data-testid="input-system-lesson-name" />
                <Input value={newLessonId} onChange={(e) => setNewLessonId(e.target.value)} placeholder="lesson-slug" className="w-32 text-sm h-9" data-testid="input-system-lesson-id" />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  disabled={!newLessonName.trim()}
                  onClick={() => {
                    if (newLessonName.trim()) {
                      const slug = newLessonId.trim() || newLessonName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      setLessons([...lessons, { id: slug, name: newLessonName.trim(), status: "Available" }]);
                      setNewLessonName("");
                      setNewLessonId("");
                    }
                  }}
                  data-testid="button-add-system-lesson"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} disabled={saving || !title.trim()} className="flex-1 gap-2" data-testid="button-save-system">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {system ? "Save Changes" : "Create System"}
          </Button>
          <Button variant="outline" onClick={onClose}>{t("pages.lessons.cancel")}</Button>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
