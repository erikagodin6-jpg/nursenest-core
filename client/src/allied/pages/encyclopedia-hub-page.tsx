import { useState, useEffect, useMemo } from "react";
import { AlliedSEO } from "../allied-seo";
import { Breadcrumbs } from "../components/paramedic-seo-components";
import { useI18n } from "@/lib/i18n";
import {
  Loader2, Search, BookOpen, ArrowRight, Filter,
  ChevronRight, Hash, Grid3X3,
} from "lucide-react";

const ALLIED_DOMAIN = "https://www.nursenest.ca/allied-health";

const PROFESSION_META: Record<string, {
  label: string; fullName: string; hubPath: string; color: string; accent: string;
  seoTitle: string; seoDescription: string;
}> = {
  paramedic: {
    label: "Paramedic", fullName: "Paramedic / Advanced Care Paramedic",
    hubPath: "/allied-health/paramedic-encyclopedia", color: "teal",
    accent: "from-red-50 via-white to-teal-50",
    seoTitle: "Paramedic Encyclopedia — Comprehensive EMS Knowledge Base",
    seoDescription: "Explore our paramedic encyclopedia covering trauma management, ACLS protocols, pharmacology, and every topic tested on NREMT and COPR exams.",
  },
  "respiratory-therapy": {
    label: "Respiratory Therapy", fullName: "Registered Respiratory Therapist",
    hubPath: "/respiratory-therapy-encyclopedia", color: "blue",
    accent: "from-blue-50 via-white to-teal-50",
    seoTitle: "Respiratory Therapy Encyclopedia — Complete RRT Knowledge Base",
    seoDescription: "Explore our respiratory therapy encyclopedia covering ventilator management, ABG interpretation, airway management, and every NBRC exam domain.",
  },
  mlt: {
    label: "Medical Laboratory", fullName: "Medical Laboratory Technologist",
    hubPath: "/allied-health/mlt-encyclopedia", color: "purple",
    accent: "from-purple-50 via-white to-teal-50",
    seoTitle: "MLT Encyclopedia — Medical Laboratory Knowledge Base",
    seoDescription: "Explore our MLT encyclopedia covering hematology, clinical chemistry, microbiology, blood banking, and every CSMLS/ASCP exam topic.",
  },
  imaging: {
    label: "Diagnostic Imaging", fullName: "Diagnostic Imaging Technologist",
    hubPath: "/allied-health/imaging-encyclopedia", color: "orange",
    accent: "from-orange-50 via-white to-teal-50",
    seoTitle: "Imaging Encyclopedia — Diagnostic Imaging Knowledge Base",
    seoDescription: "Explore our imaging encyclopedia covering radiographic positioning, radiation safety, anatomy, and every ARRT/CAMRT exam topic.",
  },
  "social-work": {
    label: "Social Work", fullName: "Licensed Clinical Social Worker",
    hubPath: "/allied-health/social-work-encyclopedia", color: "cyan",
    accent: "from-cyan-50 via-white to-teal-50",
    seoTitle: "Social Work Encyclopedia — Clinical Social Work Knowledge Base",
    seoDescription: "Explore our social work encyclopedia covering DSM-5 diagnosis, evidence-based interventions, ethics, and ASWB exam preparation.",
  },
  psychotherapy: {
    label: "Psychotherapy", fullName: "Registered Psychotherapist",
    hubPath: "/allied-health/psychotherapy-encyclopedia", color: "indigo",
    accent: "from-indigo-50 via-white to-teal-50",
    seoTitle: "Psychotherapy Encyclopedia — Therapeutic Modalities Knowledge Base",
    seoDescription: "Explore our psychotherapy encyclopedia covering CBT, DBT, EMDR, psychopathology, and registration exam preparation.",
  },
  addictions: {
    label: "Addictions Counselling", fullName: "Addictions Counsellor",
    hubPath: "/allied-health/addictions-encyclopedia", color: "emerald",
    accent: "from-emerald-50 via-white to-teal-50",
    seoTitle: "Addictions Encyclopedia — Substance Use & Recovery Knowledge Base",
    seoDescription: "Explore our addictions counselling encyclopedia covering pharmacology, motivational interviewing, harm reduction, and certification exam topics.",
  },
  "occupational-therapy": {
    label: "Occupational Therapy", fullName: "Occupational Therapist",
    hubPath: "/allied-health/occupational-therapy-encyclopedia", color: "pink",
    accent: "from-pink-50 via-white to-teal-50",
    seoTitle: "Occupational Therapy Encyclopedia — OT Knowledge Base",
    seoDescription: "Explore our occupational therapy encyclopedia covering activity analysis, adaptive equipment, rehabilitation, and NBCOT exam preparation.",
  },
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function EncyclopediaHubPage({ profession: propProfession }: { profession?: string }) {
  const { t } = useI18n();
  const profession = propProfession || "paramedic";
  const meta = PROFESSION_META[profession] || PROFESSION_META.paramedic;

  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedLetter) params.set("letter", selectedLetter);
    params.set("limit", "500");

    fetch(`/api/encyclopedia/${profession}?${params}`)
      .then(r => r.json())
      .then(d => {
        setItems(d.items || []);
        setTotal(d.total || 0);
        if (d.categories) setCategories(d.categories);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profession, search, selectedCategory, selectedLetter]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const item of items) {
      const cat = item.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [items]);

  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    for (const item of items) {
      if (item.title) letters.add(item.title[0].toUpperCase());
    }
    return letters;
  }, [items]);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: meta.label, href: meta.hubPath },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: meta.seoTitle,
    description: meta.seoDescription,
    publisher: { "@type": "EducationalOrganization", name: "NurseNest", url: ALLIED_DOMAIN },
    numberOfItems: total,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.label,
      item: `${ALLIED_DOMAIN}${b.href}`,
    })),
  };

  return (
    <div data-testid="encyclopedia-hub-page">
      <AlliedSEO
        title={meta.seoTitle}
        description={meta.seoDescription}
        canonicalPath={meta.hubPath}
        structuredData={breadcrumbSchema}
        additionalStructuredData={[structuredData]}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className={`bg-gradient-to-br ${meta.accent} border-b border-gray-100 py-10 px-4`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-6 h-6 text-teal-600" />
            <span className="text-sm font-medium text-teal-600">{meta.label} Encyclopedia</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-['DM_Sans']" data-testid="text-hub-title">
            {meta.fullName} Encyclopedia
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mb-4" data-testid="text-hub-description">
            {meta.seoDescription}
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1" data-testid="text-topic-count">
              <Grid3X3 className="w-4 h-4" /> {total} topics
            </span>
            {categories.length > 0 && (
              <span className="flex items-center gap-1">
                <Filter className="w-4 h-4" /> {categories.length} categories
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${meta.label.toLowerCase()} topics...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              data-testid="input-search"
            />
          </div>
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              data-testid="select-category"
            >
              <option value="">{t("allied.encyclopediaHubPage.allCategories")}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-6" data-testid="alphabetical-nav">
          <button
            onClick={() => setSelectedLetter("")}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
              !selectedLetter ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            data-testid="letter-all"
          >
            All
          </button>
          {ALPHABET.map(letter => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(selectedLetter === letter ? "" : letter)}
              disabled={!availableLetters.has(letter) && items.length > 0}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedLetter === letter
                  ? "bg-teal-600 text-white"
                  : availableLetters.has(letter) || items.length === 0
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-gray-50 text-gray-300 cursor-not-allowed"
              }`}
              data-testid={`letter-${letter}`}
            >
              {letter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-700 mb-1">{t("allied.encyclopediaHubPage.noTopicsFound")}</h2>
            <p className="text-sm text-gray-500">
              {search || selectedCategory || selectedLetter
                ? "Try adjusting your filters or search terms."
                : `The ${meta.label.toLowerCase()} encyclopedia is being built. Check back soon!`}
            </p>
          </div>
        ) : (
          <div className="space-y-8" data-testid="topic-list">
            {groupedByCategory.map(([category, categoryItems]) => (
              <div key={category}>
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2" data-testid={`category-heading-${category}`}>
                  <Hash className="w-4 h-4 text-teal-500" /> {category}
                  <span className="text-xs font-normal text-gray-400">({categoryItems.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryItems.map((item: any) => (
                    <a
                      key={item.id}
                      href={`${meta.hubPath}/${item.slug}`}
                      className="group block bg-white border border-gray-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all"
                      data-testid={`topic-card-${item.slug}`}
                    >
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors text-sm">
                        {item.title}
                      </h3>
                      {(item.metaDescription || item.overview) && (
                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                          {item.metaDescription || (item.overview?.substring(0, 120) + "...")}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="w-3 h-3" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
