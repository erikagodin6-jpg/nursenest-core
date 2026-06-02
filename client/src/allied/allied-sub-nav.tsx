import { Link, useLocation } from "wouter";
import { CAREER_CONFIGS, type CareerConfig, getCanonicalRoute } from "@shared/careers";
import {
  Wind, Ambulance, Pill, Microscope, Radio, BookOpen, Brain, FileText,
  Zap, GraduationCap, Wrench, Hand, Activity, Database, Target, Scan, Heart, Scissors
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AlliedBreadcrumb } from "@/components/allied-breadcrumb";
import { PROFESSION_HUB_DATA } from "@/allied/data/profession-hub-data";

const ALLIED_CAREERS = ["rrt", "paramedic", "pharmacyTech", "mlt", "imaging", "occupationalTherapy", "physicalTherapy", "healthInfoMgmt", "occupationalTherapyAssistant", "physiotherapyAssistant", "surgicalTechnologist"] as const;

const IMAGING_CAREER_SLUGS = ["radiologic-technologist", "diagnostic-sonography", "cardiac-sonographer"] as const;

function getCareerIcon(slug: string) {
  switch (slug) {
    case "rrt": return <Wind className="w-4 h-4" />;
    case "paramedic": return <Ambulance className="w-4 h-4" />;
    case "pharmacy-tech": case "pharmacy-technician": return <Pill className="w-4 h-4" />;
    case "mlt": return <Microscope className="w-4 h-4" />;
    case "imaging": return <Radio className="w-4 h-4" />;
    case "occupational-therapy": return <Hand className="w-4 h-4" />;
    case "physical-therapy": return <Activity className="w-4 h-4" />;
    case "health-info-mgmt": return <Database className="w-4 h-4" />;
    case "radiologic-technologist": return <Scan className="w-4 h-4" />;
    case "diagnostic-sonography": return <Radio className="w-4 h-4" />;
    case "cardiac-sonographer": return <Heart className="w-4 h-4" />;
    case "occupational-therapy-assistant": return <Hand className="w-4 h-4" />;
    case "physiotherapy-assistant": return <Activity className="w-4 h-4" />;
    case "surgical-technologist": return <Scissors className="w-4 h-4" />;
    default: return <BookOpen className="w-4 h-4" />;
  }
}

function getFeatureIcon(feature: string) {
  switch (feature) {
    case "qbank": return <BookOpen className="w-3.5 h-3.5" />;
    case "mock-exams": return <FileText className="w-3.5 h-3.5" />;
    case "flashcards": return <Brain className="w-3.5 h-3.5" />;
    case "study-plan": case "study": return <GraduationCap className="w-3.5 h-3.5" />;
    case "sims": return <Zap className="w-3.5 h-3.5" />;
    case "tools": return <Wrench className="w-3.5 h-3.5" />;
    case "exams": return <Target className="w-3.5 h-3.5" />;
    case "career-guide": return <GraduationCap className="w-3.5 h-3.5" />;
    default: return null;
  }
}

function getImagingCareerFromUrl(location: string): string | null {
  const segments = location.split("/").filter(Boolean);
  if (segments[0] === "allied-health" && segments[1]) {
    if ((IMAGING_CAREER_SLUGS as readonly string[]).includes(segments[1])) {
      return segments[1];
    }
  }
  return null;
}

function getCurrentCareerFromUrl(location: string, alliedCareers: CareerConfig[]): CareerConfig | undefined {
  const segments = location.split("/").filter(Boolean);
  if (segments[0] === "allied-health" && segments[1]) {
    const canonicalMatch = alliedCareers.find(c => getCanonicalRoute(c.slug) === `/allied-health/${segments[1]}`);
    if (canonicalMatch) return canonicalMatch;
  }
  if (segments[0]) {
    const canonicalMatch = alliedCareers.find(c => getCanonicalRoute(c.slug) === `/${segments[0]}`);
    if (canonicalMatch) return canonicalMatch;
  }
  return undefined;
}

export function AlliedSubNav() {
  const [location] = useLocation();
  const { t } = useI18n();
  const alliedCareers = ALLIED_CAREERS.map(id => CAREER_CONFIGS[id]);
  const currentCareer = getCurrentCareerFromUrl(location, alliedCareers);
  const imagingCareerSlug = getImagingCareerFromUrl(location);

  if (!currentCareer && !imagingCareerSlug) return null;

  if (imagingCareerSlug) {
    const hubData = PROFESSION_HUB_DATA[imagingCareerSlug];
    if (!hubData) return null;
    const basePath = `/allied-health/${imagingCareerSlug}`;
    const subPages = [
      { slug: "study", label: "Study Topics" },
      { slug: "flashcards", label: "Flashcards" },
      { slug: "exams", label: "Practice Exams" },
      { slug: "career-guide", label: "Career Guide" },
    ];
    const segments = location.split("/").filter(Boolean);
    const featureSlug = segments.length > 2 ? segments[2] : null;
    const featureLabel = featureSlug ? subPages.find(sp => sp.slug === featureSlug)?.label || null : null;
    const breadcrumbItems = [
      { label: hubData.shortName, href: basePath },
      ...(featureLabel ? [{ label: featureLabel }] : []),
    ];
    return (
      <div data-testid="allied-sub-nav">
        <AlliedBreadcrumb items={breadcrumbItems} />
        <div className="border-b border-gray-100 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto h-10 scrollbar-hide">
              <Link
                href={basePath}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  location === basePath
                    ? "bg-teal-50 text-teal-700"
                    : "text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"
                }`}
                data-testid="subnav-career-home"
              >
                {getCareerIcon(imagingCareerSlug)}
                {hubData.shortName}
              </Link>
              {subPages.map(sp => (
                <Link
                  key={sp.slug}
                  href={`${basePath}/${sp.slug}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    location === `${basePath}/${sp.slug}`
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"
                  }`}
                  data-testid={`subnav-${sp.slug}`}
                >
                  {getFeatureIcon(sp.slug)}
                  {sp.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCareer) return null;

  const ECOSYSTEM_CAREER_SLUGS = new Set([
    "occupational-therapy-assistant", "physiotherapy-assistant",
    "surgical-technologist", "health-info-mgmt",
  ]);

  const isEcosystemCareer = ECOSYSTEM_CAREER_SLUGS.has(currentCareer.slug);

  const features = isEcosystemCareer ? [
    { slug: "study", label: "Study Topics" },
    { slug: "flashcards", label: "Flashcards" },
    { slug: "exams", label: "Practice Exams" },
    { slug: "career-guide", label: "Career Guide" },
  ] : [
    { slug: "qbank", label: t("nav.allied.testBank") },
    { slug: "mock-exams", label: t("nav.allied.mockExams") },
    { slug: "flashcards", label: "Flashcards" },
    { slug: "study-plan", label: t("nav.allied.studyPlan") },
    { slug: "sims", label: t("nav.allied.caseSims") },
    { slug: "tools", label: t("nav.allied.aiTools") },
  ];

  function getFeatureHref(careerSlug: string, featureSlug: string) {
    if (featureSlug === "qbank") return `/allied-health/qbank?career=${careerSlug}`;
    const canonical = getCanonicalRoute(careerSlug);
    return `${canonical}/${featureSlug}`;
  }

  function isFeatureActive(featureSlug: string) {
    if (!currentCareer) return false;
    if (featureSlug === "qbank") return location === "/allied-health/qbank";
    const canonical = getCanonicalRoute(currentCareer.slug);
    return location === `${canonical}/${featureSlug}`;
  }

  const canonicalBase = getCanonicalRoute(currentCareer.slug);
  const urlSegments = location.split("/").filter(Boolean);
  const currentFeatureSlug = urlSegments.length > 2 ? urlSegments[2] : null;
  const currentFeatureLabel = currentFeatureSlug
    ? features.find(f => f.slug === currentFeatureSlug)?.label || null
    : null;

  const breadcrumbItems = [
    { label: currentCareer.shortName, href: canonicalBase },
    ...(currentFeatureLabel ? [{ label: currentFeatureLabel }] : []),
  ];

  return (
    <div data-testid="allied-sub-nav">
      <AlliedBreadcrumb items={breadcrumbItems} />
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto h-10 scrollbar-hide">
            <Link
              href={getCanonicalRoute(currentCareer.slug)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                location === getCanonicalRoute(currentCareer.slug)
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"
              }`}
              data-testid="subnav-career-home"
            >
              {getCareerIcon(currentCareer.slug)}
              {currentCareer.shortName}
            </Link>
            {features.map(f => (
              <Link
                key={f.slug}
                href={getFeatureHref(currentCareer.slug, f.slug)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isFeatureActive(f.slug)
                    ? "bg-teal-50 text-teal-700"
                    : "text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"
                }`}
                data-testid={`subnav-${f.slug}`}
              >
                {getFeatureIcon(f.slug)}
                {f.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
