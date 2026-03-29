import { useState } from "react";
import { Link, useLocation } from "wouter";
import { CAREER_CONFIGS, type CareerConfig, getCanonicalRoute } from "@shared/careers";
import {
  Menu, X, ChevronDown, User, LogOut, Wind, Ambulance, Pill, Microscope, Radio,
  BookOpen, Brain, FileText, Zap, GraduationCap, BarChart3, Wrench, Globe, Briefcase,
  Hand, Activity, Database, Home, ArrowLeft, Scan, Heart, Scissors
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useRegion } from "@/allied/use-region";
import { useI18n } from "@/lib/i18n";
import { getMainSiteUrl } from "@/lib/locale-utils";

const ALLIED_CAREERS = ["rrt", "paramedic", "pharmacyTech", "mlt", "imaging", "occupationalTherapy", "physicalTherapy", "healthInfoMgmt", "occupationalTherapyAssistant", "physiotherapyAssistant", "surgicalTechnologist"] as const;

const IMAGING_SUB_CAREERS = [
  { slug: "radiologic-technologist", shortName: "Rad Tech", examName: "ARRT Radiography" },
  { slug: "diagnostic-sonography", shortName: "Sonographer", examName: "ARDMS RDMS" },
  { slug: "cardiac-sonographer", shortName: "Echo Tech", examName: "ARDMS RDCS" },
] as const;

function getCareerIcon(slug: string) {
  switch (slug) {
    case "rrt": return <Wind className="w-4 h-4" />;
    case "paramedic": return <Ambulance className="w-4 h-4" />;
    case "pharmacy-tech": return <Pill className="w-4 h-4" />;
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
    case "qbank": return <BookOpen className="w-4 h-4" />;
    case "mock-exams": return <FileText className="w-4 h-4" />;
    case "flashcards": return <Brain className="w-4 h-4" />;
    case "study-plan": return <GraduationCap className="w-4 h-4" />;
    case "sims": return <Zap className="w-4 h-4" />;
    case "tools": return <Wrench className="w-4 h-4" />;
    default: return <BarChart3 className="w-4 h-4" />;
  }
}

function getImagingCareerLabel(location: string): string | null {
  const segments = location.split("/").filter(Boolean);
  if (segments[0] === "allied-health" && segments[1]) {
    const match = IMAGING_SUB_CAREERS.find(c => c.slug === segments[1]);
    if (match) return match.shortName;
  }
  return null;
}

function getCurrentCareerFromUrl(location: string, alliedCareers: CareerConfig[]): CareerConfig | undefined {
  const segments = location.split("/").filter(Boolean);
  if (segments[0] === "allied-health" && segments[1]) {
    const canonicalMatch = alliedCareers.find(c => getCanonicalRoute(c.slug) === `/allied-health/${segments[1]}`);
    if (canonicalMatch) return canonicalMatch;
  }
  if (segments[0] === "careers" && segments[1]) {
    return alliedCareers.find(c => c.slug === segments[1]);
  }
  const searchParams = new URLSearchParams(window.location.search);
  const careerParam = searchParams.get("career");
  if (careerParam) {
    return alliedCareers.find(c => c.slug === careerParam);
  }
  return undefined;
}

function useLocaleCode(): string | undefined {
  const { language } = useI18n();
  return language === "en" ? undefined : language;
}

/*
 * ── AlliedNavigation Spacing System ────────────────────────────────────
 * Ecosystem bar:  h-7 sm:h-8 | text-[10px] sm:text-xs | gap-1 sm:gap-6
 * Main bar:       h-16 | max-w-7xl px-2 sm:px-4 lg:px-8
 * Nav link:       px-3 py-2 gap-1
 * Ecosystem links: px-2 py-1 gap-1.5
 * ───────────────────────────────────────────────────────────────────────
 */
export function AlliedNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [careerDropdownOpen, setCareerDropdownOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAdmin } = useAuth();

  const { t } = useI18n();
  const locale = useLocaleCode();
  const { region, setRegion } = useRegion();
  const alliedCareers = ALLIED_CAREERS.map(id => CAREER_CONFIGS[id]);
  const currentCareer = getCurrentCareerFromUrl(location, alliedCareers);
  const imagingCareerLabel = getImagingCareerLabel(location);

  const features = [
    { slug: "qbank", label: t("nav.allied.testBank") },
    { slug: "mock-exams", label: t("nav.allied.mockExams") },
    { slug: "flashcards", label: "Flashcards" },
    { slug: "study-plan", label: t("nav.allied.studyPlan") },
    { slug: "sims", label: t("nav.allied.caseSims") },
    { slug: "tools", label: t("nav.allied.aiTools") },
  ];

  const ECOSYSTEM_CAREER_SLUGS = new Set([
    "occupational-therapy-assistant", "physiotherapy-assistant",
    "surgical-technologist", "health-info-mgmt",
  ]);

  const CAREER_FEATURE_OVERRIDES: Record<string, Record<string, string | null>> = {
    "pharmacy-tech": {
      "mock-exams": "/allied-health/pharmacy-technician/exams",
      "sims": null,
      "tools": null,
    },
  };

  function getFeatureHref(careerSlug: string, featureSlug: string) {
    const override = CAREER_FEATURE_OVERRIDES[careerSlug]?.[featureSlug];
    if (override !== undefined) return override;
    if (featureSlug === "qbank") return `/allied-health/qbank?career=${careerSlug}`;
    const canonical = getCanonicalRoute(careerSlug);
    return `${canonical}/${featureSlug}`;
  }

  function isFeatureActive(featureSlug: string) {
    if (!currentCareer) return false;
    if (featureSlug === "qbank") return location === "/allied-health/qbank";
    const href = getFeatureHref(currentCareer.slug, featureSlug);
    if (href === null) return false;
    return location === href || location === href.split("?")[0];
  }

  const mainSiteHome = getMainSiteUrl("/", locale);
  const mainSiteNewGrad = getMainSiteUrl("/new-grad", locale);
  const mainSiteCareerTools = getMainSiteUrl("/new-grad#career-tools", locale);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-teal-100 shadow-sm" data-testid="allied-navigation">
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white" data-testid="allied-ecosystem-nav">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-center gap-1 sm:gap-6 h-7 sm:h-8 text-[10px] sm:text-xs font-medium">
            <a href={mainSiteHome} className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-white/15 transition-colors" data-testid="allied-ecosystem-link-exam-prep">
              <BookOpen className="w-3 h-3" />
              <span>{t("nav.ecosystemExamPrep")}</span>
            </a>
            <span className="text-white/30 hidden sm:inline">|</span>
            <a href={mainSiteNewGrad} className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-white/15 transition-colors" data-testid="allied-ecosystem-link-new-grad">
              <GraduationCap className="w-3 h-3" />
              <span>{t("nav.ecosystemNewGrad")}</span>
            </a>
            <span className="text-white/30 hidden sm:inline">|</span>
            <a href={mainSiteCareerTools} className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-white/15 transition-colors" data-testid="allied-ecosystem-link-healthcare-jobs">
              <Briefcase className="w-3 h-3" />
              <span className="hidden sm:inline">{t("nav.ecosystemHealthcareCareers")}</span>
              <span className="sm:hidden">{t("nav.ecosystemCareers")}</span>
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href={mainSiteHome} className="flex items-center gap-2 group" data-testid="link-nursenest-home">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-gray-900">NurseNest</span>
                <span className="text-lg font-bold text-teal-600 ml-1">{t("allied.alliedNavigation.allied")}</span>
                <span className="block text-[10px] text-gray-400 -mt-1 tracking-wide">{t("allied.alliedNavigation.healthcareExamAcademy")}</span>
              </div>
            </a>

            <nav className="hidden lg:flex items-center gap-1 ml-6">
              <a href={mainSiteHome} className="px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:text-teal-700 hover:bg-teal-50/50 flex items-center gap-1.5" data-testid="link-back-to-nursenest">
                <Home className="w-3.5 h-3.5" />
                NurseNest Home
              </a>

              <Link href="/" className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${location === "/" ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"}`} data-testid="link-allied-home">
                Allied Home
              </Link>

              <Link href="/careers" className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${location === "/careers" ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"}`} data-testid="link-careers">
                Careers
              </Link>

              <div className="relative" onMouseEnter={() => setCareerDropdownOpen(true)} onMouseLeave={() => setCareerDropdownOpen(false)}>
                <button className="px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:text-teal-700 hover:bg-teal-50/50 inline-flex items-center gap-1.5 whitespace-nowrap" data-testid="button-career-dropdown">
                  <span className="inline-block max-w-[120px] truncate min-w-0">{imagingCareerLabel || (currentCareer ? currentCareer.shortName : "Study")}</span>
                  <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
                {careerDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50" data-testid="dropdown-careers">
                    <Link href="/allied-health" className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-teal-50 transition-colors border-b border-gray-100 mb-1 ${location === "/allied-health" ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-700"}`} data-testid="link-allied-health-hub">
                      <span className="flex-shrink-0"><GraduationCap className="w-4 h-4" /></span>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{t("allied.alliedNavigation.alliedHealthHub")}</div>
                        <div className="text-xs text-gray-400 truncate">{t("allied.alliedNavigation.allCareerGuides")}</div>
                      </div>
                    </Link>
                    {alliedCareers.filter(c => c.enabled).map(career => (
                      <Link key={career.slug} href={getCanonicalRoute(career.slug)} className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-teal-50 transition-colors ${currentCareer?.slug === career.slug ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-700"}`} data-testid={`link-career-${career.slug}`}>
                        <span className="flex-shrink-0">{getCareerIcon(career.slug)}</span>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{career.shortName}</div>
                          <div className="text-xs text-gray-400 truncate">{career.examNames[0]}</div>
                        </div>
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 my-1" />
                    <div className="px-4 py-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t("allied.alliedNavigation.imagingCareers")}</span>
                    </div>
                    {IMAGING_SUB_CAREERS.map(ic => (
                      <Link key={ic.slug} href={`/allied-health/${ic.slug}`} className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-teal-50 transition-colors ${location.startsWith(`/allied-health/${ic.slug}`) ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-700"}`} data-testid={`link-career-${ic.slug}`}>
                        <span className="flex-shrink-0">{getCareerIcon(ic.slug)}</span>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{ic.shortName}</div>
                          <div className="text-xs text-gray-400 truncate">{ic.examName}</div>
                        </div>
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 my-1" />
                    <div className="px-4 py-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t("allied.alliedNavigation.quickLinks")}</span>
                    </div>
                    <Link href="/allied-health/qbank?career=rrt" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-teal-50 transition-colors" data-testid="link-quick-qbank">
                      <BookOpen className="w-3.5 h-3.5 text-teal-500" />
                      <span className="truncate">{t("allied.alliedNavigation.questionBanks")}</span>
                    </Link>
                    <Link href="/allied-health" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-teal-50 transition-colors" data-testid="link-quick-career-guides">
                      <GraduationCap className="w-3.5 h-3.5 text-teal-500" />
                      <span className="truncate">{t("allied.alliedNavigation.careerGuides")}</span>
                    </Link>
                  </div>
                )}
              </div>

              {currentCareer && (ECOSYSTEM_CAREER_SLUGS.has(currentCareer.slug) ? [
                { slug: "study", label: "Study Topics" },
                { slug: "flashcards", label: "Flashcards" },
                { slug: "exams", label: "Practice Exams" },
                { slug: "career-guide", label: "Career Guide" },
              ] : features).map(f => {
                const href = getFeatureHref(currentCareer.slug, f.slug);
                if (href === null) return null;
                return (
                  <Link key={f.slug} href={href} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${isFeatureActive(f.slug) ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"}`} data-testid={`link-${f.slug}`}>
                    {getFeatureIcon(f.slug)}
                    {f.label}
                  </Link>
                );
              })}

              <Link href="/pricing?section=allied" className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${location === "/pricing" ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:text-teal-700 hover:bg-teal-50/50"}`} data-testid="link-pricing">
                Pricing
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setRegion(region === "US" ? "CA" : "US")}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
              data-testid="button-region-toggle"
              title={`Currently: ${region === "US" ? "United States" : "Canada"}. Click to switch.`}
            >
              <Globe className="w-3.5 h-3.5 text-teal-500" />
              <span className={`px-1.5 py-0.5 rounded ${region === "US" ? "bg-teal-100 text-teal-700" : "text-gray-400"}`}>US</span>
              <span className={`px-1.5 py-0.5 rounded ${region === "CA" ? "bg-teal-100 text-teal-700" : "text-gray-400"}`}>CA</span>
            </button>
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors" data-testid="link-account">
                  <User className="w-4 h-4" />
                  {user.username}
                </Link>
                {isAdmin && (
                  <Link href="/admin/allied" className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors" data-testid="link-admin-allied">
                    Admin
                  </Link>
                )}
              </div>
            ) : (
              <Link href="/pricing?section=allied" className="hidden sm:block px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm" data-testid="button-get-started">
                Get Started Free
              </Link>
            )}

            <button className="lg:hidden p-2 text-gray-600 hover:text-teal-700" onClick={() => setMobileOpen(!mobileOpen)} data-testid="button-mobile-menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-teal-100 shadow-lg" data-testid="mobile-nav">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <a href={mainSiteHome} className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200" onClick={() => setMobileOpen(false)} data-testid="mobile-link-back-to-nursenest">
              <ArrowLeft className="w-4 h-4" />
              Back to NurseNest
            </a>
            <div className="border-t border-gray-100 my-2" />
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1 px-4">{t("allied.alliedNavigation.nursenestEcosystem")}</p>
            <a href={mainSiteHome} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-lg" onClick={() => setMobileOpen(false)} data-testid="mobile-ecosystem-exam-prep">
              <BookOpen className="w-4 h-4 text-teal-600" />
              {t("nav.examPrep")}
            </a>
            <a href={mainSiteNewGrad} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-lg" onClick={() => setMobileOpen(false)} data-testid="mobile-ecosystem-new-grad">
              <GraduationCap className="w-4 h-4 text-cyan-600" />
              {t("nav.ecosystemNewGrad")}
            </a>
            <a href={mainSiteCareerTools} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-lg" onClick={() => setMobileOpen(false)} data-testid="mobile-ecosystem-healthcare-jobs">
              <Briefcase className="w-4 h-4 text-blue-600" />
              {t("nav.ecosystemHealthcareCareers")}
            </a>
            <div className="border-t border-gray-100 my-2" />
            <Link href="/" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-lg" onClick={() => setMobileOpen(false)} data-testid="mobile-link-allied-home">{t("allied.alliedNavigation.alliedHome")}</Link>
            <Link href="/allied-health" className="block px-4 py-3 text-sm font-medium text-teal-700 hover:bg-teal-50 rounded-lg" onClick={() => setMobileOpen(false)} data-testid="mobile-link-allied-health-hub">{t("allied.alliedNavigation.alliedHealthHub2")}</Link>
            <Link href="/careers" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-lg" onClick={() => setMobileOpen(false)} data-testid="mobile-link-careers">{t("allied.alliedNavigation.allCareers")}</Link>
            {alliedCareers.filter(c => c.enabled).map(career => (
              <div key={career.slug}>
                <Link href={getCanonicalRoute(career.slug)} className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-lg" onClick={() => setMobileOpen(false)} data-testid={`mobile-link-${career.slug}`}>
                  {getCareerIcon(career.slug)}
                  {career.shortName}
                </Link>
              </div>
            ))}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 mb-1 px-4">{t("allied.alliedNavigation.imagingCareers2")}</p>
            {IMAGING_SUB_CAREERS.map(ic => (
              <Link key={ic.slug} href={`/allied-health/${ic.slug}`} className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-lg" onClick={() => setMobileOpen(false)} data-testid={`mobile-link-${ic.slug}`}>
                {getCareerIcon(ic.slug)}
                {ic.shortName}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-2" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 mb-1 px-4">{t("allied.alliedNavigation.studyTools")}</p>
            <Link href="/allied-health/qbank?career=rrt" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-lg" onClick={() => setMobileOpen(false)} data-testid="mobile-link-qbank">
              <BookOpen className="w-4 h-4 text-teal-600" />
              Question Banks
            </Link>
            <Link href="/allied-health" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-lg" onClick={() => setMobileOpen(false)} data-testid="mobile-link-career-guides">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              Career Guides
            </Link>
            <div className="border-t border-gray-100 my-2" />
            <button
              onClick={() => { setRegion(region === "US" ? "CA" : "US"); }}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-lg w-full text-left"
              data-testid="mobile-button-region"
            >
              <Globe className="w-4 h-4 text-teal-500" />
              Region: {region === "US" ? "United States" : "Canada"} (tap to switch)
            </button>
            <Link href="/pricing?section=allied" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50 rounded-lg" onClick={() => setMobileOpen(false)} data-testid="mobile-link-pricing">{t("allied.alliedNavigation.pricing")}</Link>
            {isAdmin && (
              <Link href="/admin/allied" className="block px-4 py-3 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg" onClick={() => setMobileOpen(false)} data-testid="mobile-link-admin">{t("allied.alliedNavigation.adminPanel")}</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
