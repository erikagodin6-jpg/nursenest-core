import { useState, useEffect, lazy, Suspense, Component, type ReactNode } from "react";
import { getExamConstants, type Region as ConstRegion } from "@shared/constants";
import { getTierConfig } from "@shared/tier-config";
import { useLocation } from "wouter";
import { LocaleLink } from "@/lib/LocaleLink";
import { useCareer } from "@/lib/career-context";
import { CAREER_CONFIGS, type CareerType } from "@shared/careers";
import { 
  BookOpen, 
  Layers, 
  Activity, 
  Stethoscope, 
  FileText, 
  BarChart, 
  ChevronDown,
  Heart,
  Palette,
  Lock,
  HelpCircle,
  Tag,
  Dna,
  Menu,
  Play,
  MoreHorizontal,
  LogIn,
  LogOut,
  User,
  Shield,
  Calculator,
  FlaskConical,
  Lightbulb,
  Pill,
  StickyNote,
  Calendar,
  UserCircle,
  X,
  LayoutDashboard,
  HeartPulse,
  Siren,
  Scissors,
  Ribbon,
  Baby,
  Brain,
  Users,
  ShieldCheck,
  Hand,
  Database,
  Radio,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
const GlobalSearch = lazy(() => import("@/components/global-search").then(m => ({ default: m.GlobalSearch })));
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { ThemedLogo } from "@/components/themed-logo";
import { useI18n, LANGUAGES } from "@/lib/i18n";
import { Globe, Languages, BarChart3, DollarSign, ShoppingBag, FileStack, Wind, Ambulance, Microscope, ScanLine, GraduationCap, Briefcase, Award, Sparkles, ArrowRightLeft } from "lucide-react";
import { trackCrossSectionClick } from "@/components/analytics-tracker";
import { getPlatformSection } from "@shared/platform-sections";

class NavSectionBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? null : this.props.children; }
}

const CAREER_ICON_MAP: Record<string, LucideIcon> = {
  Stethoscope, Wind, Ambulance, Pill, Microscope, ScanLine, HeartPulse,
  Siren, Scissors, Ribbon, Baby, Brain, Users, ShieldCheck, Hand,
  Activity, Database, Radio, Heart,
};

interface CareerSectionItem {
  id: CareerType;
  subtitle?: string;
}

interface CareerSection {
  label: string;
  items: CareerSectionItem[];
}

const CAREER_SECTIONS: CareerSection[] = [
  {
    label: "Nursing",
    items: [
      { id: "nursing", subtitle: "RPN/REx-PN, RN/NCLEX-RN, NP" },
    ],
  },
  {
    label: "Allied Health",
    items: [
      { id: "rrt" },
      { id: "paramedic" },
      { id: "pharmacyTech" },
      { id: "mlt" },
      { id: "imaging" },
      { id: "occupationalTherapy" },
      { id: "physicalTherapy" },
      { id: "healthInfoMgmt" },
      { id: "occupationalTherapyAssistant" },
      { id: "physiotherapyAssistant" },
      { id: "surgicalTechnologist" },
      { id: "diagnosticSonography" },
      { id: "cardiacSonographer" },
    ],
  },
  {
    label: "Nursing Specialties",
    items: [
      { id: "criticalCare" },
      { id: "emergencyNursing" },
      { id: "oncologyNursing" },
      { id: "perioperative" },
      { id: "pediatricCert" },
    ],
  },
  {
    label: "Behavioral Health",
    items: [
      { id: "psychotherapist" },
      { id: "socialWorker" },
      { id: "addictionsCounsellor" },
    ],
  },
];

function UserProfileDropdown({ user, logout, setLocation: navigate }: { user: any; logout: () => void; setLocation: (path: string) => void }) {
  const { t } = useI18n();
  const { data: subData } = useQuery({
    queryKey: ["/api/subscription", user.id],
    queryFn: async () => {
      const res = await fetch(`/api/subscription/${user.id}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user.id,
    staleTime: 60000,
  });

  const tierLabel = getTierConfig(user.tier || "free").displayName;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hidden sm:inline-flex text-softgray hover:text-primary font-medium text-sm px-2 gap-1.5" data-testid="button-user-dropdown">
          <UserCircle className="w-4 h-4" />
          {user.username}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-semibold text-gray-900">{user.username}</p>
          <p className="text-xs text-gray-500">{tierLabel} Account</p>
          {subData?.daysRemaining !== null && subData?.daysRemaining !== undefined && user.tier !== "free" && user.tier !== "admin" && (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-primary">
              <Calendar className="w-3 h-3" />
              <span>{subData.daysRemaining} days remaining</span>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/dashboard")} data-testid="menu-user-dashboard">
          {t("nav.dashboard")}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/profile")} data-testid="menu-user-profile">
          {t("nav.profile")}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/reports")} data-testid="menu-user-reports">
          {t("nav.reports")}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/profile#notes")} data-testid="menu-user-notes">
          {t("nav.notes")}
        </DropdownMenuItem>
        {user.tier === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin")} data-testid="menu-admin-dashboard">
              {t("nav.admin")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/content-editor")} data-testid="menu-content-editor">
              {t("nav.contentEditor")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin?tab=content-engine")} data-testid="menu-blog-manager">
              {t("nav.blogManager")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/seo")} data-testid="menu-seo-dashboard">
              {t("nav.seoDashboard")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/translations")} data-testid="menu-translations">
              {t("nav.translations")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/content-intelligence")} data-testid="menu-content-intelligence">
              {t("nav.contentIntelligence")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/cat")} data-testid="menu-cat-dashboard">
              {t("nav.catAnalytics")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/revenue")} data-testid="menu-revenue">
              {t("nav.revenueIntelligence")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/product-builder")} data-testid="menu-product-builder">
              {t("nav.productBuilder")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/generator-v2")} data-testid="menu-generator-v2">
              {t("nav.qbankGenerator")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/demo-screenshot-studio")} data-testid="menu-screenshot-studio">
              {t("nav.screenshotStudio")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/mock-results")} data-testid="menu-mock-results">
              {t("nav.mockResults")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/seo-progress")} data-testid="menu-seo-progress">
              {t("nav.seoProgress")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/content-metrics")} data-testid="menu-content-metrics">
              {t("nav.contentMetrics")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/weekly-reports")} data-testid="menu-weekly-reports">
              {t("nav.weeklyReports")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/search-performance")} data-testid="menu-search-performance">
              {t("nav.seoPerformance")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/site-health")} data-testid="menu-site-health">
              {t("nav.siteHealth")}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/exam-health")} data-testid="menu-exam-health">
              Exam Health
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary" onClick={() => navigate("/admin/readiness-analytics")} data-testid="menu-readiness-analytics">
              Readiness Analytics
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-red-500" onClick={() => { logout(); navigate("/"); }} data-testid="menu-user-logout">
          {t("nav.signout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function appendUtmParams(path: string): string {
  try {
    const stored = sessionStorage.getItem("nn-utm-params");
    if (!stored) return path;
    const utms = JSON.parse(stored);
    const params = new URLSearchParams();
    if (utms.utmSource) params.set("utm_source", utms.utmSource);
    if (utms.utmMedium) params.set("utm_medium", utms.utmMedium);
    if (utms.utmCampaign) params.set("utm_campaign", utms.utmCampaign);
    const qs = params.toString();
    if (!qs) return path;
    const hashIdx = path.indexOf("#");
    if (hashIdx >= 0) {
      return path.slice(0, hashIdx) + "?" + qs + path.slice(hashIdx);
    }
    return path + (path.includes("?") ? "&" : "?") + qs;
  } catch {
    return path;
  }
}

/*
 * ── Navigation Spacing System ──────────────────────────────────────────
 * Ecosystem bar:  h-7 sm:h-8 | text-[10px] sm:text-xs | gap-1 sm:gap-6
 * Main bar:       h-14 sm:h-16 (compact: h-10 sm:h-11) | max-w-7xl px-2 sm:px-4 lg:px-8
 * Sub-bar:        h-9 | max-w-7xl px-2 sm:px-4 lg:px-8
 * Menu trigger:   px-2 lg:px-2.5 (main bar) | px-1.5 lg:px-2 (sub-bar)
 * Menu gap:       gap-0.5 lg:gap-1 (desktop triggers)
 * Right controls: gap-1 lg:gap-2
 * Ecosystem links: px-2 py-1 gap-1.5
 * ───────────────────────────────────────────────────────────────────────
 */
export function Navigation({ compact = false }: { compact?: boolean } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [region, setRegionState] = useState<"US" | "CA">(() => {
    return (localStorage.getItem("nursenest-region") as "US" | "CA") || "US";
  });
  const { toast } = useToast();
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, logout, isAdmin, previewTier, setPreviewTier, effectiveTier } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const { setCareer } = useCareer();
  const navTo = (path: string) => setLocation(path);

  const navigateToCareer = (careerId: CareerType) => {
    const config = CAREER_CONFIGS[careerId];
    if (!config) return;
    setCareer(careerId);
    const route = config.routePrefix || "/";
    navTo(route);
  };
  const currentLang = LANGUAGES.find(l => l.code === language);

  const setRegion = (newRegion: "US" | "CA") => {
    setRegionState(newRegion);
    localStorage.setItem("nursenest-region", newRegion);
    window.dispatchEvent(new Event("regionChange"));
  };

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
    if (user?.id) {
      const userToken = localStorage.getItem("nursenest-user-token");
      fetch(`/api/user/${user.id}/theme`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}),
        },
        body: JSON.stringify({ theme: themeName }),
      }).catch(() => {});
    }
  };

  const handleLanguageChange = (langCode: typeof language) => {
    setLanguage(langCode);
  };

  useEffect(() => {
    fetch("/api/region")
      .then(r => r.json())
      .then(data => {
        const detected: "US" | "CA" = data?.region === "CA" ? "CA" : "US";
        setRegionState(detected);
        localStorage.setItem("nursenest-region", detected);
        window.dispatchEvent(new Event("regionChange"));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user?.preferredTheme && user.preferredTheme !== theme) {
      setTheme(user.preferredTheme);
    }
  }, [user?.preferredTheme]);

  const handlePaidContent = (label: string, itemLabel?: string) => {
    if (itemLabel === "Lessons") {
      navTo("/lessons");
      return;
    }
    if (itemLabel === "Lectures") {
      navTo("/lectures");
      return;
    }
    if (itemLabel === "Flashcards") {
      navTo("/flashcards");
      return;
    }
    if (itemLabel === "Test Bank") {
      const nursingTestBankSlugs = ["rpn", "rn", "np", "critical-care", "emergency-nursing", "perioperative", "oncology-nursing", "pediatric-cert"];
      const alliedQBankSlugs = ["rrt", "paramedic", "pharmacy-tech", "mlt", "imaging", "psychotherapist", "social-worker", "addictions-counsellor"];
      const allSlugs = [...nursingTestBankSlugs, ...alliedQBankSlugs];
      const pathSegments = window.location.pathname.split("/").filter(Boolean);
      const currentProfession = pathSegments.find(s => allSlugs.includes(s));
      const tierSlug = effectiveTier && allSlugs.includes(effectiveTier) ? effectiveTier : "rpn";
      const targetSlug = currentProfession || tierSlug;
      if (alliedQBankSlugs.includes(targetSlug)) {
        navTo(`/allied-health/qbank?career=${targetSlug}`);
      } else {
        navTo(`/${targetSlug}/test-bank`);
      }
      return;
    }
    if (itemLabel === "Reports") {
      navTo("/reports");
      return;
    }
    if (itemLabel === "Clinical Clarity") {
      navTo("/clinical-clarity");
      return;
    }
    if (itemLabel === "Clinical Skill Lab") {
      navTo("/clinical-skills");
      return;
    }
    if (itemLabel === "Simulators") {
      navTo("/osce-skills");
      return;
    }
    if (itemLabel === "Exams") {
      navTo("/mock-exams");
      return;
    }
    if (itemLabel === "Pricing") {
      navTo("/pricing");
      return;
    }
    if (itemLabel === "FAQ") {
      navTo("/faq");
      return;
    }
    if (itemLabel === "For Schools") {
      navTo("/for-institutions");
      return;
    }
    toast({
      title: t("nav.subscriptionRequired"),
      description: t("nav.subscriptionDesc"),
      variant: "default",
    });
  };

  const NavDropdown = ({ label, items, isPaid = false, subBar = false }: { label: string, items: { icon: any, label: string, key?: string }[], isPaid?: boolean, subBar?: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "font-medium hover:bg-transparent flex items-center gap-1 group data-[state=open]:text-primary",
            subBar 
              ? "text-xs text-primary/70 hover:text-primary px-1.5 lg:px-2 h-7" 
              : "text-sm text-softgray hover:text-primary px-2 lg:px-2.5"
          )}
        >
          {label}
          <ChevronDown className={cn("transition-transform duration-200 group-data-[state=open]:rotate-180", subBar ? "w-3 h-3" : "w-3.5 h-3.5")} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 p-2 bg-white rounded-lg shadow-lg border-primary/20 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
        {items.map((item, idx) => (
          <DropdownMenuItem 
            key={idx} 
            onClick={() => handlePaidContent(label, item.key || item.label)}
            className="flex items-center justify-between gap-2 cursor-pointer text-gray-700 hover:text-primary hover:bg-primary/5 focus:bg-primary/5 focus:text-primary rounded-md py-2 px-3"
          >
            <span>{item.label}</span>
            {isPaid && !["Lessons", "Lectures", "Flashcards", "Test Bank", "Clinical Clarity", "Clinical Skill Lab", "Simulators", "Exams"].includes(item.key || item.label) && <Lock className="w-3 h-3 text-gray-400" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const learningItems = [
    { icon: BookOpen, label: t("nav.lessons"), key: "Lessons" },
    { icon: Play, label: t("nav.lectures"), key: "Lectures" },
    { icon: Layers, label: t("nav.flashcards"), key: "Flashcards" },
    { icon: FileText, label: "Test Bank", key: "Test Bank" },
    { icon: Lightbulb, label: t("nav.clinicalClarity"), key: "Clinical Clarity" },
    { icon: Activity, label: t("nav.clinicalSkillLab"), key: "Clinical Skill Lab" },
    { icon: Stethoscope, label: t("nav.simulators"), key: "Simulators" },
    { icon: FileText, label: t("nav.exams"), key: "Exams" },
  ];

  const designations = getExamConstants(region as ConstRegion).designations;

  const themes = [
    { name: "lavender", color: "#9d82dd", label: "Lavender", group: "light" as const },
    { name: "mint", color: "#5ed3ae", label: "Mint", group: "light" as const },
    { name: "blush", color: "#f4909f", label: "Blush", group: "light" as const },
    { name: "slate", color: "#64748b", label: "Slate", group: "light" as const },
    { name: "midnight", color: "#1e293b", label: "Midnight", group: "light" as const },
    { name: "ocean", color: "#0ea5e9", label: "Ocean", group: "light" as const },
    { name: "forest", color: "#10b981", label: "Forest", group: "light" as const },
    { name: "clinical-light", color: "#3b82f6", label: "Clinical", group: "light" as const },
    { name: "pastel-blush", color: "#ec8899", label: "Pastel Blush", group: "light" as const },
    { name: "pastel-lavender", color: "#a78bda", label: "Pastel Lavender", group: "light" as const },
    { name: "pastel-mint", color: "#4fd1a5", label: "Pastel Mint", group: "light" as const },
    { name: "pastel-lilac", color: "#b48ed2", label: "Pastel Lilac", group: "light" as const },
    { name: "lavender-dream", color: "#8e7cc3", label: "Lavender Dream", group: "light" as const },
    { name: "soft-sage", color: "#7da87d", label: "Soft Sage", group: "light" as const },
    { name: "neutral-sand", color: "#a08060", label: "Sand", group: "light" as const },
    { name: "neutral-slate", color: "#708090", label: "Cool Slate", group: "light" as const },
    { name: "rose-gold", color: "#b76e79", label: "Rose Gold", group: "light" as const },
    { name: "coral", color: "#ff6b6b", label: "Coral", group: "light" as const },
    { name: "indigo", color: "#6366f1", label: "Indigo", group: "light" as const },
    { name: "teal", color: "#14b8a6", label: "Teal", group: "light" as const },
    { name: "berry", color: "#a855f7", label: "Berry", group: "light" as const },
    { name: "dark-mode", color: "#818cf8", label: "Dark Mode", group: "dark" as const },
    { name: "dark-clinical", color: "#06b6d4", label: "Dark Clinical", group: "dark" as const },
    { name: "dark-academia", color: "#8b7355", label: "Dark Academia", group: "dark" as const },
  ];

  const MobileNav = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-softgray h-8 w-8 shrink-0" aria-label={t("components.navigation.openMenu")}>
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-[var(--theme-card-bg)] p-0 overflow-y-auto">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-5 border-b border-[var(--theme-separator)] sticky top-0 bg-[var(--theme-card-bg)] z-10">
            <SheetTitle className="text-left flex items-center justify-between">
              <ThemedLogo width={160} />
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={t("components.navigation.closeMenu")}>
                  <X className="w-4 h-4" />
                </Button>
              </SheetClose>
            </SheetTitle>
          </SheetHeader>
          
          <div className="p-5 flex flex-col gap-1 pb-20">
            <div className="mb-4">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2 px-3">{t("nav.ecosystem")}</p>
              <div className="flex flex-col gap-1 px-1">
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/exam-prep")} data-testid="mobile-ecosystem-exam-prep">
                    <BookOpen className="w-4 h-4 text-primary" />
                    {t("nav.examPrep")}
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/new-graduate-support")} data-testid="mobile-ecosystem-new-grad">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    {t("nav.newGradSupport")}
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/healthcare-careers")} data-testid="mobile-ecosystem-healthcare-jobs">
                    <Briefcase className="w-4 h-4 text-primary" />
                    {t("nav.healthcareCareers")}
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/allied-health")} data-testid="mobile-ecosystem-allied-health">
                    <Heart className="w-4 h-4 text-teal-500" />
                    Allied Health
                  </Button>
                </SheetClose>
              </div>
              <Separator className="my-3 mx-3 bg-[var(--theme-separator)]" />
            </div>

            <div className="mb-6" data-testid="mobile-career-tracks">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 px-3">{t("nav.careerGuides")}</p>
              <div className="flex flex-col gap-4 px-1">
                {CAREER_SECTIONS.map((section) => (
                  <div key={section.label}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 px-2">{section.label}</p>
                    <div className="flex flex-col gap-0.5">
                      {section.items.map((item) => {
                        const config = CAREER_CONFIGS[item.id];
                        if (!config?.enabled) return null;
                        const IconComp = CAREER_ICON_MAP[config.icon] || Stethoscope;
                        return (
                          <SheetClose asChild key={item.id}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start gap-2.5 h-10 text-gray-700 hover:text-primary hover:bg-primary/5"
                              onClick={() => { navigateToCareer(item.id); setMobileMenuOpen(false); }}
                              data-testid={`mobile-career-${config.slug}`}
                            >
                              <IconComp className="w-4 h-4 shrink-0" style={{ color: config.color }} />
                              <div className="text-left min-w-0">
                                <div className="text-sm font-medium truncate">{config.shortName}</div>
                                {item.subtitle && <div className="text-[10px] text-gray-400 truncate">{item.subtitle}</div>}
                                {!item.subtitle && config.examNames.length > 0 && (
                                  <div className="text-[10px] text-gray-400 truncate">{config.examNames.slice(0, 2).join(", ")}</div>
                                )}
                              </div>
                            </Button>
                          </SheetClose>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-6 mx-3 bg-gray-100" />
            </div>

            <NavSectionBoundary>
            <div className="mb-4" data-testid="mobile-rpn-section">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 px-3">RPN Exam Preparation</p>
              <div className="flex flex-col gap-1 px-1">
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/rpn/exams")} data-testid="mobile-rpn-exams">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    RPN Exams
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/rpn/test-bank")} data-testid="mobile-rpn-test-bank">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    RPN Question Bank
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/rpn/flashcards")} data-testid="mobile-rpn-flashcards">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    RPN Flashcards
                  </Button>
                </SheetClose>
              </div>
              <Separator className="my-3 mx-3 bg-[var(--theme-separator)]" />
            </div>
            </NavSectionBoundary>

            <NavSectionBoundary>
            <div className="mb-4" data-testid="mobile-rn-section">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 px-3">RN Exam Preparation</p>
              <div className="flex flex-col gap-1 px-1">
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/rn/exams")} data-testid="mobile-rn-exams">
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                    RN Exams
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/rn/test-bank")} data-testid="mobile-rn-test-bank">
                    <FileText className="w-4 h-4 text-blue-500" />
                    RN Question Bank
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/rn/flashcards")} data-testid="mobile-rn-flashcards">
                    <Layers className="w-4 h-4 text-blue-500" />
                    RN Flashcards
                  </Button>
                </SheetClose>
              </div>
              <Separator className="my-3 mx-3 bg-[var(--theme-separator)]" />
            </div>
            </NavSectionBoundary>

            <NavSectionBoundary>
            <div className="mb-4" data-testid="mobile-np-section">
              <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-2 px-3">{t("components.navigation.npExamPreparation")}</p>
              <div className="flex flex-col gap-1 px-1">
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/np-exam-prep")} data-testid="mobile-np-exam-prep">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    NP Exam Prep Hub
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/np/exams")} data-testid="mobile-np-exams">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    NP Exams
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/np/test-bank")} data-testid="mobile-np-test-bank">
                    <FileText className="w-4 h-4 text-purple-500" />
                    NP Question Bank
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/np/flashcards")} data-testid="mobile-np-flashcards">
                    <Layers className="w-4 h-4 text-purple-500" />
                    NP Flashcards
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/np/aanp-exam")} data-testid="mobile-np-aanp">
                    <Award className="w-4 h-4 text-blue-500" />
                    AANP Exam
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-[var(--theme-menu-text)] hover:text-[var(--theme-menu-hover-text)] hover:bg-[var(--theme-menu-hover-bg)] gap-2 h-9" onClick={() => navTo("/np/ancc-exam")} data-testid="mobile-np-ancc">
                    <Award className="w-4 h-4 text-indigo-500" />
                    ANCC Exam
                  </Button>
                </SheetClose>
              </div>
              <Separator className="my-3 mx-3 bg-[var(--theme-separator)]" />
            </div>
            </NavSectionBoundary>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-3">{t("nav.freeLearning")}</p>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/pre-nursing")}>
                <BookOpen className="w-4 h-4" />
                {t("nav.preNursingFoundations")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/anatomy")}>
                <Dna className="w-4 h-4" />
                {t("nav.anatomyPhysiology")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/lessons")}>
                <BookOpen className="w-4 h-4" />
                {t("nav.lessons")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/blog")}>
                <BookOpen className="w-4 h-4" />
                {t("nav.blog")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/nursing-specialties")} data-testid="button-specialties-mobile">
                <Stethoscope className="w-4 h-4" />
                {t("nav.nursingSpecialties")}
              </Button>
            </SheetClose>

            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-auto py-2" onClick={() => navTo("/flashcards?view=decks")} data-testid="button-study-decks-mobile">
                <div className="flex items-start gap-2">
                  <Layers className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span>{t("nav.studyDecks")}</span>
                      <span className="text-[8px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full leading-none">{t("common.free")}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 block">{t("nav.studyDecksDesc")}</span>
                  </div>
                </div>
              </Button>
            </SheetClose>

            <Separator className="my-2 bg-[var(--theme-separator)]" />

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-3">{t("nav.newGradCareer")}</p>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/new-grad")} data-testid="button-new-grad-hub-mobile">
                <GraduationCap className="w-4 h-4" />
                {t("footer.newGradHub")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/newgrad/certifications")} data-testid="button-new-grad-certifications-mobile">
                <Award className="w-4 h-4 text-emerald-500" />
                {t("nav.certifications")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/new-grad/nursing")} data-testid="button-new-grad-nursing-mobile">
                <Stethoscope className="w-4 h-4" />
                {t("footer.nursing")}
              </Button>
            </SheetClose>

            <Separator className="my-2 bg-[var(--theme-separator)]" />

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-3">{t("nav.interactiveTools")}</p>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/lectures")} data-testid="button-lectures-mobile">
                <Play className="w-4 h-4" />
                {t("nav.lectures")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/clinical-clarity")}>
                <Lightbulb className="w-4 h-4" />
                {t("nav.clinicalClarity")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/flashcards")}>
                <Layers className="w-4 h-4" />
                {t("nav.flashcards")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => {
                const validTestBankSlugs = ["rpn", "rn", "np", "rrt", "paramedic", "pharmacy-tech", "mlt", "imaging", "critical-care", "emergency-nursing", "perioperative", "oncology-nursing", "pediatric-cert", "psychotherapist", "social-worker", "addictions-counsellor"];
                const pathSegments = window.location.pathname.split("/").filter(Boolean);
                const currentProfession = pathSegments.find(s => validTestBankSlugs.includes(s));
                const tierSlug = effectiveTier && validTestBankSlugs.includes(effectiveTier) ? effectiveTier : "rpn";
                const targetSlug = currentProfession || tierSlug;
                navTo(`/${targetSlug}/test-bank`);
              }} data-testid="button-test-bank-mobile">
                <FileText className="w-4 h-4" />
                {t("nav.testBank")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-between text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/med-math")}>
                <span className="flex items-center gap-2"><Calculator className="w-4 h-4" /> {t("nav.medMathLab")}</span>
                <Lock className="w-3 h-3 text-gray-300" />
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-between text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/lab-values")}>
                <span className="flex items-center gap-2"><FlaskConical className="w-4 h-4" /> {t("nav.labInterpretation")}</span>
                <Lock className="w-3 h-3 text-gray-300" />
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/si-to-conventional-units-converter")}>
                <span className="flex items-center gap-2"><ArrowRightLeft className="w-4 h-4" /> {t("components.navigation.siConventionalConverter")}</span>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-between text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/case-simulations")}>
                <span className="flex items-center gap-2"><Stethoscope className="w-4 h-4" /> {t("nav.caseSimulations")}</span>
                <Lock className="w-3 h-3 text-gray-300" />
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-between text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/medication-mastery")}>
                <span className="flex items-center gap-2"><Pill className="w-4 h-4" /> {t("nav.medicationMastery")}</span>
                <Lock className="w-3 h-3 text-gray-300" />
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/clinical-skills")}>
                <Stethoscope className="w-4 h-4" /> {t("nav.clinicalSkillsSim")}
              </Button>
            </SheetClose>

            <Separator className="my-1 bg-gray-100" />
            <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider mb-1 px-3">{t("nav.clinicalSimulators")}</p>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/first-action-simulator")}>
                <Activity className="w-4 h-4" /> {t("nav.firstAction")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/safety-hazard-simulator")}>
                <Heart className="w-4 h-4" /> {t("nav.safetyHazard")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/iv-complications-simulator")}>
                <Dna className="w-4 h-4" /> {t("nav.ivComplications")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-between text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/electrolyte-abg-simulator")}>
                <span className="flex items-center gap-2"><FlaskConical className="w-4 h-4" /> {t("nav.electrolyteAbg")}</span>
                <Lock className="w-3 h-3 text-gray-300" />
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-between text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/deteriorating-patient-simulator")}>
                <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> {t("nav.deterioratingPatient")}</span>
                <Lock className="w-3 h-3 text-gray-300" />
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-between text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/blood-transfusion-simulator")}>
                <span className="flex items-center gap-2"><Heart className="w-4 h-4" /> {t("nav.bloodTransfusion")}</span>
                <Lock className="w-3 h-3 text-gray-300" />
              </Button>
            </SheetClose>

            <Separator className="my-2 bg-[var(--theme-separator)]" />

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-3">{t("nav.resources")}</p>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => { navTo("/shop"); try { fetch("/api/track/event", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "nav_store_click", source: "mobile_nav" }) }).catch(() => {}); } catch {} }} data-testid="button-store-mobile">
                {t("nav.store")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/pricing")}>
                {t("nav.pricing")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/faq")}>
                {t("footer.faq")}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/for-institutions")} data-testid="link-mobile-for-schools">
                {t("nav.forSchools")}
              </Button>
            </SheetClose>

            <Separator className="my-2 bg-[var(--theme-separator)]" />

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-3">{t("nav.language")}</p>
            <div className="flex flex-wrap gap-1.5 px-3 mb-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  data-testid={`button-lang-${lang.code}-mobile`}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium border transition-colors",
                    language === lang.code
                      ? "bg-primary/10 border-primary/30 text-primary font-bold"
                      : "bg-white border-gray-200 text-gray-500 hover:border-primary/20 hover:text-primary"
                  )}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  {lang.name !== lang.nativeName && <span className="text-[9px] opacity-60">({lang.nativeName})</span>}
                </button>
              ))}
            </div>

            <Separator className="my-2 bg-[var(--theme-separator)]" />

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-3">{t("nav.regionTheme")}</p>
            <div className="flex items-center gap-1 px-3 mb-2 bg-gray-100 rounded-full p-0.5 w-fit">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRegion("US")}
                className={cn("h-6 px-2 rounded-full text-[10px] font-bold transition-all", region === "US" ? "bg-white shadow-sm text-primary" : "text-gray-400 hover:text-gray-600")}
                data-testid="button-region-us-mobile"
              >
                US
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRegion("CA")}
                className={cn("h-6 px-2 rounded-full text-[10px] font-bold transition-all", region === "CA" ? "bg-white shadow-sm text-primary" : "text-gray-400 hover:text-gray-600")}
                data-testid="button-region-ca-mobile"
              >
                CA
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-1.5 px-3 mb-1">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => handleThemeChange(t.name)}
                  data-testid={`button-theme-${t.name}-mobile`}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all",
                    theme === t.name
                      ? "bg-primary/10 ring-1 ring-primary/30"
                      : "hover:bg-[var(--theme-menu-hover-bg)]"
                  )}
                >
                  <span
                    className={cn(
                      "w-4 h-4 rounded-full shrink-0 border transition-transform",
                      theme === t.name ? "border-primary scale-110 ring-1 ring-primary/40" : "border-[var(--theme-separator)]"
                    )}
                    style={{ backgroundColor: t.color }}
                  />
                  <span className={cn(
                    "text-[10px] font-medium truncate",
                    theme === t.name ? "text-primary" : "text-[var(--theme-menu-text)]"
                  )}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>

            <Separator className="my-2 bg-[var(--theme-separator)]" />

            {user ? (
              <>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/profile")}>
                    <User className="w-4 h-4" />
                    {user.username}
                  </Button>
                </SheetClose>
                {user.tier === "admin" && (
                  <>
                    <SheetClose asChild>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/admin")} data-testid="button-admin-mobile">
                        <Shield className="w-4 h-4" />
                        {t("nav.admin")}
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/content-editor")} data-testid="button-content-editor-mobile">
                        <FileText className="w-4 h-4" />
                        {t("nav.contentEditor")}
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/admin/seo")} data-testid="button-seo-dashboard-mobile">
                        <Globe className="w-4 h-4" />
                        SEO Dashboard
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/admin/translations")} data-testid="button-translations-mobile">
                        <Languages className="w-4 h-4" />
                        Translations
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/admin/content-intelligence")} data-testid="button-content-intel-mobile">
                        <BarChart3 className="w-4 h-4" />
                        Content Intelligence
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/admin/cat")} data-testid="button-cat-mobile">
                        <Activity className="w-4 h-4" />
                        CAT Analytics
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/admin/revenue")} data-testid="button-revenue-mobile">
                        <DollarSign className="w-4 h-4" />
                        Revenue Intelligence
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/admin/content-metrics")} data-testid="button-content-metrics-mobile">
                        <BarChart3 className="w-4 h-4" />
                        Content Metrics
                      </Button>
                    </SheetClose>
                  </>
                )}
                {isAdmin && (
                  <>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 mt-2 px-3">{t("nav.previewMode")}</p>
                    <div className="flex flex-wrap gap-1.5 px-3 mb-1">
                      {[
                        { key: null, label: "Admin" },
                        { key: "free", label: "Free" },
                        { key: "rpn", label: "RPN/LVN" },
                        { key: "rn", label: "RN" },
                        { key: "np", label: "NP" },
                      ].map((opt) => (
                        <Button
                          key={opt.key || "admin"}
                          variant={previewTier === opt.key || (!previewTier && !opt.key) ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPreviewTier(opt.key)}
                          className={cn(
                            "h-7 px-2.5 text-[10px] rounded-full flex-1 min-w-[70px] sm:flex-none",
                            (previewTier === opt.key || (!previewTier && !opt.key)) ? "bg-primary text-white" : "text-gray-500 border-gray-200"
                          )}
                          data-testid={`button-preview-${opt.key || "admin"}-mobile`}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => { logout(); navTo("/"); }}>
                    <LogOut className="w-4 h-4" />
                    {t("nav.signout")}
                  </Button>
                </SheetClose>
              </>
            ) : (
              <>
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5 gap-2 h-9" onClick={() => navTo("/login")}>
                    <LogIn className="w-4 h-4" />
                    {t("nav.login")}
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button className="w-full bg-primary hover:brightness-110 text-white rounded-full h-9 mt-1" onClick={() => navTo("/login")}>
                    {t("nav.signup")}
                  </Button>
                </SheetClose>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <nav 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b",
        scrolled 
          ? "bg-white/95 backdrop-blur-xl border-gray-200/60 shadow-sm" 
          : "bg-white/90 backdrop-blur-xl border-transparent"
      )}
    >
      <div className="hidden md:block" style={{ background: "var(--theme-topbar-bg)", color: "var(--theme-topbar-text)" }} data-testid="ecosystem-nav">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-center gap-1 sm:gap-6 h-7 sm:h-8 text-[10px] sm:text-xs font-medium">
            <LocaleLink href={appendUtmParams("/exam-prep")} className="flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors" style={{ color: "inherit" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} data-testid="ecosystem-link-exam-prep" onClick={() => trackCrossSectionClick(getPlatformSection(location), "exam_prep", "Exam Prep")}>
              <BookOpen className="w-3 h-3" />
              <span>{t("nav.ecosystemExamPrep")}</span>
            </LocaleLink>
            <span className="hidden sm:inline" style={{ opacity: 0.3 }}>|</span>
            <LocaleLink href={appendUtmParams("/new-graduate-support")} className="flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors" style={{ color: "inherit" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} data-testid="ecosystem-link-new-grad" onClick={() => trackCrossSectionClick(getPlatformSection(location), "new_grad", "New Grad Support")}>
              <GraduationCap className="w-3 h-3" />
              <span>{t("nav.ecosystemNewGrad")}</span>
            </LocaleLink>
            <span className="hidden sm:inline" style={{ opacity: 0.3 }}>|</span>
            <LocaleLink href={appendUtmParams("/healthcare-careers")} className="flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors" style={{ color: "inherit" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} data-testid="ecosystem-link-healthcare-jobs" onClick={() => trackCrossSectionClick(getPlatformSection(location), "career_tools", "Healthcare Jobs")}>
              <Briefcase className="w-3 h-3" />
              <span className="hidden sm:inline">{t("nav.ecosystemHealthcareCareers")}</span>
              <span className="sm:hidden">{t("nav.ecosystemCareers")}</span>
            </LocaleLink>
            <span className="hidden sm:inline" style={{ opacity: 0.3 }}>|</span>
            <LocaleLink href={appendUtmParams("/international-nurses")} className="flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors" style={{ color: "inherit" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} data-testid="ecosystem-link-international-nurses" onClick={() => trackCrossSectionClick(getPlatformSection(location), "international_nurses", "International Nurses")}>
              <Globe className="w-3 h-3" />
              <span className="hidden sm:inline">{t("components.navigation.internationalNurses")}</span>
              <span className="sm:hidden">IEN</span>
            </LocaleLink>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className={cn("flex items-center justify-between", compact ? "h-10 sm:h-11" : "h-11 sm:h-16")}>
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-6 min-w-0">
            <MobileNav />
            <LocaleLink href="/">
              <div className="flex items-center cursor-pointer group shrink-0" data-testid="link-home-logo">
                <div className="hidden sm:block">
                  <ThemedLogo width={180} className="group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="sm:hidden">
                  <ThemedLogo width={120} className="group-hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
            </LocaleLink>

            <div className={cn("hidden md:flex items-center gap-0.5 lg:gap-1", compact && "md:hidden")}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium text-softgray hover:text-primary hover:bg-transparent flex items-center gap-1 px-2 lg:px-2.5 group data-[state=open]:text-primary">
                    {t("nav.study")}
                    <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 mb-1.5 tracking-wider">{t("nav.coreStudyTools")}</p>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/free-practice")} data-testid="nav-questions-desktop">
                    <FlaskConical className="w-4 h-4 text-primary/70" />
                    {t("nav.testBank")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5 relative" onClick={() => navTo("/flashcards?view=decks")} data-testid="button-study-decks-nav">
                    <Layers className="w-4 h-4 text-primary/70" />
                    {t("nav.flashcards")}
                    <span className="ml-auto flex h-4 px-1.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white leading-none">{t("common.free")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/lessons")}>
                    <BookOpen className="w-4 h-4 text-primary/70" />
                    {t("nav.lessons")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/mock-exams")}>
                    <FileText className="w-4 h-4 text-primary/70" />
                    {t("nav.exams")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 mb-1.5 tracking-wider">{t("nav.learnMore")}</p>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/lectures")}>
                    <Play className="w-4 h-4 text-primary/70" />
                    {t("nav.lectures")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/clinical-clarity")}>
                    <Lightbulb className="w-4 h-4 text-primary/70" />
                    {t("nav.clinicalClarity")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/pre-nursing")}>
                    <BookOpen className="w-4 h-4 text-primary/70" />
                    {t("nav.preNursing")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/anatomy")}>
                    <Dna className="w-4 h-4 text-primary/70" />
                    {t("nav.anatomy")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium text-softgray hover:text-primary hover:bg-transparent flex items-center gap-1 px-2 lg:px-2.5 group data-[state=open]:text-primary">
                    {t("nav.practice")}
                    <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 mb-1.5 tracking-wider">{t("nav.clinicalSimulators")}</p>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/osce-skills")}>
                    <Stethoscope className="w-4 h-4 text-primary/70" />
                    {t("nav.simulators")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/case-simulations")}>
                    <Stethoscope className="w-4 h-4 text-primary/70" />
                    {t("nav.caseSimulations")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/clinical-skills")}>
                    <Activity className="w-4 h-4 text-primary/70" />
                    {t("nav.clinicalSkillsSim")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/first-action-simulator")}>
                    <Activity className="w-4 h-4 text-primary/70" />
                    {t("nav.firstAction")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/safety-hazard-simulator")}>
                    <Heart className="w-4 h-4 text-primary/70" />
                    {t("nav.safetyHazard")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/iv-complications-simulator")}>
                    <Dna className="w-4 h-4 text-primary/70" />
                    {t("nav.ivComplications")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/electrolyte-abg-simulator")}>
                    <FlaskConical className="w-4 h-4 text-primary/70" />
                    {t("nav.electrolyteAbg")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/deteriorating-patient-simulator")}>
                    <Activity className="w-4 h-4 text-primary/70" />
                    {t("nav.deterioratingPatient")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/blood-transfusion-simulator")}>
                    <Heart className="w-4 h-4 text-primary/70" />
                    {t("nav.bloodTransfusion")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 mb-1.5 tracking-wider">{t("nav.premiumTools")}</p>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/med-math")}>
                    <Calculator className="w-4 h-4 text-primary/70" />
                    {t("nav.medMathLab")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/lab-values")}>
                    <FlaskConical className="w-4 h-4 text-primary/70" />
                    {t("nav.labInterpretation")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/medication-mastery")}>
                    <Pill className="w-4 h-4 text-primary/70" />
                    {t("nav.medicationMastery")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 mb-1.5 tracking-wider">{t("components.navigation.freeTools")}</p>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/si-to-conventional-units-converter")}>
                    <ArrowRightLeft className="w-4 h-4 text-primary/70" />
                    SI ↔ Conventional Converter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium text-softgray hover:text-primary hover:bg-transparent flex items-center gap-1 px-2 lg:px-2.5 group data-[state=open]:text-primary" data-testid="nav-analytics-desktop">
                    {t("nav.analytics")}
                    <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52 p-2">
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/dashboard")}>
                    <LayoutDashboard className="w-4 h-4 text-primary/70" />
                    {t("nav.dashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/reports")}>
                    <BarChart3 className="w-4 h-4 text-primary/70" />
                    {t("nav.reports")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/nursing-specialties")} data-testid="button-specialties-desktop">
                    <Stethoscope className="w-4 h-4 text-primary/70" />
                    {t("nav.nursingSpecialties")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/blog")}>
                    <FileText className="w-4 h-4 text-primary/70" />
                    {t("nav.blog")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium text-softgray hover:text-primary hover:bg-transparent flex items-center gap-1 px-2 lg:px-2.5 group data-[state=open]:text-primary" data-testid="button-new-grad-nav">
                    {t("nav.newGrad")}
                    <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 p-2">
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/new-grad")} data-testid="menu-new-grad-hub">
                    <GraduationCap className="w-4 h-4 text-primary/70" />
                    {t("nav.newGradHub")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/newgrad/certifications")} data-testid="menu-new-grad-certifications">
                    <Award className="w-4 h-4 text-emerald-500" />
                    {t("nav.certifications")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5" onClick={() => navTo("/new-grad/nursing")} data-testid="menu-new-grad-nursing">
                    <Stethoscope className="w-4 h-4 text-blue-500" />
                    {t("nav.newGradCareer")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" className="text-sm font-medium text-softgray hover:text-primary hover:bg-transparent px-2 lg:px-2.5" onClick={() => navTo("/allied-health")} data-testid="nav-allied-health-desktop">
                Allied Health
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium text-softgray hover:text-primary hover:bg-transparent flex items-center gap-1 px-2 lg:px-2.5 group data-[state=open]:text-primary" data-testid="button-career-guides-nav">
                    {t("nav.careerGuides")}
                    <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[540px] p-4" data-testid="career-dropdown-panel">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4">
                      {CAREER_SECTIONS.slice(0, 2).map((section) => (
                        <div key={section.label}>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">{section.label}</p>
                          <div className="flex flex-col gap-0.5">
                            {section.items.map((item) => {
                              const config = CAREER_CONFIGS[item.id];
                              if (!config?.enabled) return null;
                              const IconComp = CAREER_ICON_MAP[config.icon] || Stethoscope;
                              return (
                                <DropdownMenuItem
                                  key={item.id}
                                  className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5 py-1.5"
                                  onClick={() => navigateToCareer(item.id)}
                                  data-testid={`menu-career-${config.slug}`}
                                >
                                  <IconComp className="w-4 h-4 shrink-0" style={{ color: config.color }} />
                                  <div className="min-w-0">
                                    <div className="text-sm font-medium truncate">{config.shortName}</div>
                                    {item.subtitle && <div className="text-[10px] text-gray-400 truncate">{item.subtitle}</div>}
                                    {!item.subtitle && config.examNames.length > 0 && (
                                      <div className="text-[10px] text-gray-400 truncate">{config.examNames.slice(0, 2).join(", ")}</div>
                                    )}
                                  </div>
                                </DropdownMenuItem>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-4">
                      {CAREER_SECTIONS.slice(2).map((section) => (
                        <div key={section.label}>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">{section.label}</p>
                          <div className="flex flex-col gap-0.5">
                            {section.items.map((item) => {
                              const config = CAREER_CONFIGS[item.id];
                              if (!config?.enabled) return null;
                              const IconComp = CAREER_ICON_MAP[config.icon] || Stethoscope;
                              return (
                                <DropdownMenuItem
                                  key={item.id}
                                  className="cursor-pointer gap-2 text-gray-700 hover:text-primary hover:bg-primary/5 py-1.5"
                                  onClick={() => navigateToCareer(item.id)}
                                  data-testid={`menu-career-${config.slug}`}
                                >
                                  <IconComp className="w-4 h-4 shrink-0" style={{ color: config.color }} />
                                  <div className="min-w-0">
                                    <div className="text-sm font-medium truncate">{config.shortName}</div>
                                    {item.subtitle && <div className="text-[10px] text-gray-400 truncate">{item.subtitle}</div>}
                                    {!item.subtitle && config.examNames.length > 0 && (
                                      <div className="text-[10px] text-gray-400 truncate">{config.examNames.slice(0, 2).join(", ")}</div>
                                    )}
                                  </div>
                                </DropdownMenuItem>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                className="text-sm font-medium text-softgray hover:text-primary hover:bg-transparent px-2 lg:px-2.5"
                onClick={() => { navTo("/shop"); try { fetch("/api/track/event", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "nav_store_click", source: "desktop_nav" }) }).catch(() => {}); } catch {} }}
                data-testid="button-store-nav"
              >
                {t("nav.store")}
              </Button>

              <Button
                variant="ghost"
                className="text-sm font-medium text-softgray hover:text-primary hover:bg-transparent px-2 lg:px-2.5"
                onClick={() => navTo("/pricing")}
                data-testid="link-nav-pricing"
              >
                {t("nav.pricing")}
              </Button>

              <Button
                variant="ghost"
                className="text-sm font-medium text-softgray hover:text-primary hover:bg-transparent px-2 lg:px-2.5"
                onClick={() => navTo("/faq")}
                data-testid="link-nav-faq"
              >
                {t("footer.faq")}
              </Button>

              <Button
                variant="ghost"
                className="text-sm font-medium text-softgray hover:text-primary hover:bg-transparent px-2 lg:px-2.5"
                onClick={() => navTo("/for-institutions")}
                data-testid="link-nav-for-schools"
              >
                {t("nav.forSchools")}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <div className="md:hidden">
              <Suspense fallback={<div className="w-8 h-8" />}>
                <GlobalSearch compact />
              </Suspense>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden lg:flex items-center gap-1 text-softgray hover:text-primary h-8 px-1.5" data-testid="button-settings-selector">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-bold">{currentLang?.flag}</span>
                  <Palette className="w-3.5 h-3.5 ml-0.5" />
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 max-h-[80vh] overflow-y-auto">
                <p className="text-[10px] font-bold text-gray-400 uppercase px-2 my-2 tracking-widest">{t("nav.regionTheme")}</p>
                <div className="flex items-center gap-1 px-2 mb-2 bg-gray-100 rounded-full p-0.5 w-fit">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRegion("US")}
                    className={cn("h-6 px-2.5 rounded-full text-[11px] font-bold transition-all", region === "US" ? "bg-primary text-white shadow-sm" : "text-primary/60 hover:text-primary hover:bg-primary/5")}
                    data-testid="button-region-us-desktop"
                  >
                    US
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRegion("CA")}
                    className={cn("h-6 px-2.5 rounded-full text-[11px] font-bold transition-all", region === "CA" ? "bg-primary text-white shadow-sm" : "text-primary/60 hover:text-primary hover:bg-primary/5")}
                    data-testid="button-region-ca-desktop"
                  >
                    CA
                  </Button>
                </div>
                <DropdownMenuSeparator />
                <p className="text-[10px] font-bold text-[var(--theme-muted-text)] uppercase px-2 my-2 tracking-widest">{t("nav.selectTheme")}</p>
                <div className="grid grid-cols-2 gap-1 px-1 py-1 mb-2 max-h-[40vh] overflow-y-auto">
                  {themes.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => handleThemeChange(t.name)}
                      data-testid={`button-theme-${t.name}`}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-all",
                        theme === t.name
                          ? "bg-primary/10 ring-1 ring-primary/30"
                          : "hover:bg-[var(--theme-menu-hover-bg)]"
                      )}
                    >
                      <span
                        className={cn(
                          "w-4 h-4 rounded-full shrink-0 border shadow-sm",
                          theme === t.name ? "border-primary ring-1 ring-primary/40 scale-110" : "border-[var(--theme-separator)]"
                        )}
                        style={{ backgroundColor: t.color }}
                      />
                      <span className={cn(
                        "text-[11px] font-medium truncate",
                        theme === t.name ? "text-primary" : "text-[var(--theme-menu-text)]"
                      )}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <p className="text-[10px] font-bold text-gray-400 uppercase px-2 my-2 tracking-widest">{t("nav.language")}</p>
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={cn("cursor-pointer gap-2", language === lang.code && "text-primary font-bold bg-primary/5")}
                    data-testid={`button-lang-${lang.code}`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.name}</span>
                    <span className="text-gray-400 text-xs ml-auto">{lang.nativeName}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <UserProfileDropdown user={user} logout={logout} setLocation={navTo} />
            ) : (
              <div className="flex items-center gap-1.5 md:gap-2">
                <Button variant="ghost" size="sm" className="hidden sm:flex text-softgray hover:text-primary font-medium px-3 h-8" onClick={() => navTo("/login")} data-testid="button-login">
                  {t("nav.login")}
                </Button>
                <Button size="sm" className="bg-primary hover:brightness-110 text-white font-bold rounded-full px-3 md:px-4 h-8 shadow-sm shadow-primary/20 whitespace-nowrap text-xs md:text-sm" onClick={() => navTo("/login")} data-testid="button-signup">
                  {t("nav.signup")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {!compact && (
        <div className="hidden md:block border-t border-primary/10 bg-primary/5">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between gap-2 h-9">
              <div className="flex items-center gap-0.5">
                {designations.map((d) => (
                  <NavDropdown key={d} label={d} items={learningItems} isPaid subBar />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <NavDropdown label={t("nav.resources")} items={[
                  { label: t("nav.pricing"), key: "Pricing" },
                  { label: t("footer.faq"), key: "FAQ" },
                  { label: t("nav.forSchools"), key: "For Schools" },
                ]} subBar />
                <div className="w-48 lg:w-56">
                  <Suspense fallback={<div className="w-full h-7" />}>
                    <GlobalSearch />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

