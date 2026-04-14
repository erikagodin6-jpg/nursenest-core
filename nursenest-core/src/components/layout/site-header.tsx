"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { useTheme } from "next-themes";
import { getNavChromeStyle, getNavChromeVars } from "@/lib/theme/nav-chrome";
import { ChevronDown, ChevronRight, MapPin, Menu, Settings, X } from "lucide-react";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { isStaffRole } from "@/lib/auth/staff-roles";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useClientGlobalRegionCookie } from "@/lib/region/use-client-global-region";
import { useMarketingRegionToggleWithRefresh } from "@/lib/region/use-marketing-region-toggle";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { applyGlobalRegionSelection } from "@/lib/marketing/apply-global-region-selection";
import { resolveRegionalMarketingStrip } from "@/lib/marketing/regional-marketing-nav-priority";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HeaderBrandLockup } from "@/components/brand/header-brand-lockup";
import { ThemePicker } from "@/components/theme/theme-picker";
import { Button } from "@/components/ui/button";
import {
  marketingRegionToggleSegment,
  marketingRegionToggleShellMobileRow,
} from "@/lib/theme/marketing-region-toggle";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { GlobalContextBar } from "@/components/layout/global-context-bar";
import { MobileContextDrawer } from "@/components/layout/mobile-context-drawer";
import { REGION_CONFIG, type GlobalRegionSlug, type GlobalLocaleCode } from "@/lib/i18n/global-regions";
import {
  defaultPathwayIdForMarketingOffering,
  marketingExamHubPath,
  type CountryExamOfferingId,
} from "@/lib/marketing/country-exam-offerings";
import {
  HUB,
  NP,
  alliedCareersMarketingUrl,
  alliedHub,
  alliedQuestions,
  pnLessons,
  pnQuestions,
  rnLessons,
  rnQuestions,
  npNpQuestionsForRegion,
} from "@/lib/marketing/marketing-entry-routes";
import { publicMarketingCatHrefForOffering } from "@/lib/marketing/marketing-exam-navigation";
import { resolveStudySurfaceCatHref } from "@/lib/exam-pathways/pathway-cat-flow";
import { ALLIED_PROFESSIONS, ALLIED_HUB_CATEGORY_ORDER, ALLIED_HUB_CATEGORY_META } from "@/lib/allied/allied-professions-registry";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { CONTINUE_STUDYING_CTA } from "@/lib/copy/cta-copy";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";
import { CountrySelector } from "@/components/layout/global-context-switcher";
import { getRegionFlag } from "@/lib/navigation/context-switch-helpers";
import { getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";

const ADMIN_DASHBOARD_ROUTE = "/admin" as const;

/** Keep desktop nav pills single-line and compact so the full global IA fits cleanly. */
const NAV_LINK_CLASS =
  "nn-marketing-body-sm nn-marketing-nav-link inline-flex h-9 items-center justify-center whitespace-nowrap px-2.5 text-center font-semibold leading-none tracking-tight xl:px-3";
const NAV_TIER_LINK_CLASS =
  "nn-marketing-body-sm nn-marketing-nav-link inline-flex h-8 items-center justify-center whitespace-nowrap px-2.5 text-center font-semibold leading-none tracking-tight xl:px-3";
const HEADER_SECONDARY_ACTION_CLASS =
  "inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--nav-border)] px-3 py-2 text-sm font-medium text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]";
const HEADER_UTILITY_BUTTON_CLASS =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--nav-border)] bg-transparent px-2.5 text-[11px] font-medium tracking-wide text-[var(--nav-fg)] transition-colors hover:bg-[var(--nav-hover)]";
type ExamMenuKey = "rn" | "pn" | "np" | "newgrad" | "allied";

type MegaMenuLink = {
  key: string;
  label: string;
  href: string;
};

type MegaMenuGroup = {
  key: string;
  heading: string;
  links: MegaMenuLink[];
};

/** Regional alternative — used by PN and NP menus to surface the other-region hub. */
type MegaMenuRegionLink = {
  key: string;
  label: string;
  href: string;
  /** True = the user's currently-selected region hub. */
  isPrimary: boolean;
};

type MegaMenuConfig = {
  key: ExamMenuKey;
  label: string;
  hubHref: string;
  /** Short subtitle shown in the primary hub card (one sentence). */
  hubDescription: string;
  groups: MegaMenuGroup[];
  /** Regional alternatives rendered in a separate low-weight section (PN, NP). */
  regionLinks?: MegaMenuRegionLink[];
  /**
   * Badge text shown in the hub card eyebrow for menus where region matters.
   * Omit for single-path menus (RN, Allied) — they default to "Start Here".
   */
  hubBadge?: string;
};

type LearnerTier = "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED";
type LearnerCountry = "CA" | "US";
type HeaderResumeCta = { href: string; label: string } | null;
type HeaderNavLink = { key: string; href: string; label: string; matchBase: string };

type EngagementNudgePayload = {
  kind?: string;
  href?: string;
};

function isActivePath(current: string, base: string): boolean {
  if (!base || base === "/") return current === "/";
  if (current === base) return true;
  return current.startsWith(`${base}/`);
}

/**
 * Returns true when the stripped pathname falls inside the URL space owned by
 * a given mega-menu key. Checked against known path prefixes for each exam
 * family across both US and Canada routes — SSR-safe (pure function, no
 * client-only APIs).
 */
function isMegaMenuKeyActive(key: ExamMenuKey, strippedPath: string): boolean {
  const prefixes: Record<ExamMenuKey, string[]> = {
    rn:     ["/us/rn/", "/canada/rn/"],
    pn:     ["/us/pn/", "/canada/pn/"],
    np:     ["/us/np/", "/canada/np/"],
    newgrad:[ "/pre-nursing/", "/lessons", "/question-bank", "/flashcards", "/practice-exams" ],
    allied: ["/us/allied/", "/canada/allied/"],
  };
  return (prefixes[key] ?? []).some((p) => strippedPath.startsWith(p));
}

function offeringIdForTier(tier: LearnerTier): CountryExamOfferingId {
  switch (tier) {
    case "RPN":
    case "LVN_LPN":
      return "pn";
    case "RN":
      return "rn";
    case "NP":
      return "np";
    case "ALLIED":
      return "allied";
    default:
      return "rn";
  }
}

function examIndicatorLabel(country: LearnerCountry, tier: LearnerTier, alliedProfessionKey?: string | null): string {
  const regionLabel = country === "CA" ? "Canada" : "US";
  if (tier === "LVN_LPN") return `${regionLabel} ${getNursingRoleLabel({ country, role: "PN" })}`;
  if (tier === "RPN") return `${regionLabel} RPN`;
  if (tier === "ALLIED") {
    if (alliedProfessionKey) {
      const prof = ALLIED_PROFESSIONS.find((p) => p.professionKey === alliedProfessionKey);
      if (prof) {
        // Extract short acronym or abbreviated label from h1 (e.g. "PTA", "MLT", "RRT")
        const match = prof.h1.match(/\(([A-Z/]+)\)/);
        return match ? match[1] : prof.professionKey.toUpperCase();
      }
    }
    return "Allied Health";
  }
  return `${regionLabel} ${tier}`;
}

function createLearnerNavLinks(
  t: (key: string) => string,
  locale: string,
  pathwayId: string | null,
): HeaderNavLink[] {
  const lessonsHref = pathwayId ? `/app/lessons?pathwayId=${encodeURIComponent(pathwayId)}` : "/app/lessons";
  const catHref = resolveStudySurfaceCatHref({
    pathwayId,
    availablePathwayIds: pathwayId ? [pathwayId] : [],
  });
  return [
    {
      key: "questions",
      href: "/app/questions",
      matchBase: "/app/questions",
      label: formatTitleCase(t("learner.shell.nav.questions"), locale),
    },
    {
      key: "lessons",
      href: lessonsHref,
      matchBase: "/app/lessons",
      label: formatTitleCase(t("learner.shell.nav.lessons"), locale),
    },
    {
      key: "cat",
      href: catHref,
      matchBase: "/app/practice-tests",
      label: formatTitleCase(t("learner.shell.nav.cat"), locale),
    },
    {
      key: "flashcards",
      href: "/app/flashcards",
      matchBase: "/app/flashcards",
      label: formatTitleCase(t("learner.shell.nav.flashcards"), locale),
    },
    {
      key: "progress",
      href: "/app/account/progress",
      matchBase: "/app/account/progress",
      label: formatTitleCase(t("learner.shell.nav.progress"), locale),
    },
  ];
}

function createMegaMenus(region: "US" | "CA"): MegaMenuConfig[] {
  const pnRoleLabel = getNursingRoleLabel({ country: region, role: "PN" });
  const rnHub = marketingExamHubPath(region, "rn");
  const pnHub = marketingExamHubPath(region, "pn");
  const npHub = marketingExamHubPath(region, "np");
  const alliedHubHref = alliedHub(region);
  const pnUsHub = marketingExamHubPath("US", "pn");
  const pnCaHub = marketingExamHubPath("CA", "pn");
  const npUsHub = marketingExamHubPath("US", "np");
  const npCaHub = marketingExamHubPath("CA", "np");
  const npLessons = region === "US" ? NP.fnpLessons : NP.caNpLessons;
  const npQuestionHref = npNpQuestionsForRegion(region);
  const studyPlanSignupHref = `${HUB.signup}?callbackUrl=${encodeURIComponent("/app/study-plan")}`;
  const alliedCareerPathwaysHref = alliedCareersMarketingUrl();
  const newGradHub = "/pre-nursing";
  const newGradLessons = HUB.examLessons;
  const newGradPractice = HUB.questionBank;
  const newGradExams = HUB.practiceExams;
  const newGradFlashcards = HUB.flashcards;
  const newGradHowItWorks = "/how-it-works";

  return [
    {
      key: "rn",
      label: "RN",
      hubHref: rnHub,
      hubDescription: "Start in the RN hub to begin practice, lessons, and readiness tracking.",
      groups: [
        {
          key: "learn",
          heading: "Learn",
          links: [
            { key: "rn-lessons", label: "Lessons", href: rnLessons(region) },
            { key: "rn-flashcards", label: "Flashcards", href: HUB.flashcards },
          ],
        },
        {
          key: "practice",
          heading: "Practice",
          links: [
            { key: "rn-questions", label: "Practice Questions", href: rnQuestions(region) },
            { key: "rn-readiness", label: "CAT Readiness Exam", href: publicMarketingCatHrefForOffering(region, "rn") },
          ],
        },
        {
          key: "tools",
          heading: "Study Tools",
          links: [{ key: "rn-study-plan", label: "Build A Study Plan", href: studyPlanSignupHref }],
        },
      ],
    },
    {
      key: "pn",
      label: pnRoleLabel,
      hubHref: pnHub,
      hubDescription: "Choose the hub for your region to start pathway-specific prep.",
      hubBadge: region === "CA" ? "Recommended for Canada" : "Recommended for US",
      groups: [
        {
          key: "learn",
          heading: "Learn",
          links: [
            { key: "pn-lessons", label: "Lessons", href: pnLessons(region) },
            { key: "pn-flashcards", label: "Flashcards", href: HUB.flashcards },
          ],
        },
        {
          key: "practice",
          heading: "Practice",
          links: [
            { key: "pn-questions", label: "Practice Questions", href: pnQuestions(region) },
            { key: "pn-readiness", label: "CAT Readiness Exam", href: publicMarketingCatHrefForOffering(region, "pn") },
          ],
        },
        {
          key: "tools",
          heading: "Study Tools",
          links: [{ key: "pn-study-plan", label: "Build A Study Plan", href: studyPlanSignupHref }],
        },
      ],
      regionLinks: [
        {
          key: "pn-primary",
          label: region === "CA" ? "REx-PN Hub (Canada)" : "NCLEX-PN Hub (US)",
          href: region === "CA" ? pnCaHub : pnUsHub,
          isPrimary: true,
        },
        {
          key: "pn-alt",
          label: region === "CA" ? "NCLEX-PN Hub (US)" : "REx-PN Hub (Canada)",
          href: region === "CA" ? pnUsHub : pnCaHub,
          isPrimary: false,
        },
      ],
    },
    {
      key: "np",
      label: "NP",
      hubHref: npHub,
      hubDescription: "Open the NP hub to choose your exam branch and start studying.",
      hubBadge: region === "CA" ? "Recommended for Canada" : "Recommended for US",
      groups: [
        {
          key: "learn",
          heading: "Learn",
          links: [
            { key: "np-lessons", label: "Lessons", href: npLessons },
            { key: "np-flashcards", label: "Flashcards", href: HUB.flashcards },
          ],
        },
        {
          key: "practice",
          heading: "Practice",
          links: [
            { key: "np-questions", label: "Practice Questions", href: npQuestionHref },
            { key: "np-readiness", label: "CAT Readiness Exam", href: publicMarketingCatHrefForOffering(region, "np") },
          ],
        },
        {
          key: "tools",
          heading: "Study Tools",
          links: [{ key: "np-study-plan", label: "Build A Study Plan", href: studyPlanSignupHref }],
        },
      ],
      regionLinks: [
        { key: "np-us", label: "US NP Branches", href: npUsHub, isPrimary: region === "US" },
        { key: "np-ca", label: "Canada NP Branches", href: npCaHub, isPrimary: region === "CA" },
      ],
    },
    {
      key: "newgrad",
      label: "New Grad",
      hubHref: newGradHub,
      hubDescription: "Start with the core new-grad pathway and ramp with practical study activities.",
      groups: [
        {
          key: "learn",
          heading: "Learn",
          links: [
            { key: "ng-lessons", label: "Lessons", href: newGradLessons },
            { key: "ng-flashcards", label: "Flashcards", href: newGradFlashcards },
          ],
        },
        {
          key: "practice",
          heading: "Practice",
          links: [
            { key: "ng-questions", label: "Practice Questions", href: newGradPractice },
            { key: "ng-exams", label: "Practice Exams", href: newGradExams },
            { key: "ng-readiness", label: "CAT Readiness Exam", href: publicMarketingCatHrefForOffering(region, "rn") },
          ],
        },
        {
          key: "tools",
          heading: "Study Tools",
          links: [
            { key: "ng-study-plan", label: "Build A Study Plan", href: studyPlanSignupHref },
            { key: "ng-how", label: "How It Works", href: newGradHowItWorks },
          ],
        },
      ],
    },
    {
      key: "allied",
      label: "Allied",
      hubHref: alliedHubHref,
      hubDescription: "Select your career to access lessons, practice questions, and exam prep scoped to your profession.",
      groups: ALLIED_HUB_CATEGORY_ORDER.map((catId) => {
        const cat = ALLIED_HUB_CATEGORY_META[catId];
        const profs = ALLIED_PROFESSIONS.filter((p) => p.hubCategory === catId);
        return {
          key: `allied-cat-${catId}`,
          heading: cat.label,
          links: profs.map((p) => ({
            key: `allied-${p.professionKey}`,
            label: p.h1.replace(/ exam prep$/i, "").replace(/ \(.*\)$/i, "").trim(),
            href: `/allied/${p.professionKey}`,
          })),
        };
      }),
    },
  ];
}

export function SiteHeader() {
  const { t, locale } = useMarketingI18n();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const { theme } = useTheme();
  const navChromeStyle = getNavChromeStyle(theme);
  const navChromeVars = getNavChromeVars(theme);
  // Default to light (ocean, the app default, is a light theme) so SSR and first paint match.
  const isLightTheme = useMemo(() => {
    if (!theme) return true;
    return (THEME_OPTIONS.find((o) => o.id === theme)?.group ?? "light") === "light";
  }, [theme]);
  const { data: session, status: sessionStatus } = useSession();
  const { region, setRegion } = useNursenestRegion();
  const regionToggleAnalytics = useMemo(
    () => ({ currentRegion: region, surface: "site_header_mobile_drawer" as const }),
    [region],
  );
  const setRegionAndRefresh = useMarketingRegionToggleWithRefresh(setRegion, regionToggleAnalytics);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileContextOpen, setMobileContextOpen] = useState(false);
  const [mobileExpandedMega, setMobileExpandedMega] = useState<ExamMenuKey | null>(null);
  const [desktopCountryOpen, setDesktopCountryOpen] = useState(false);
  const [desktopLangOpen, setDesktopLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMegaMenu, setOpenMegaMenu] = useState<ExamMenuKey | null>(null);
  const [resumeStudyingCta, setResumeStudyingCta] = useState<HeaderResumeCta>(null);
  const closeMegaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desktopCountryRef = useRef<HTMLDivElement>(null);
  const desktopLangRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const clientGlobalRegion = useClientGlobalRegionCookie();
  const legacyUsCaGlobalRegion: GlobalRegionSlug = region === "CA" ? "canada" : "us";
  const effectiveGlobalRegion: GlobalRegionSlug = clientGlobalRegion ?? legacyUsCaGlobalRegion;
  const globalLocale: GlobalLocaleCode = (locale as GlobalLocaleCode) ?? "en";

  const localizeHref = (href: string) => {
    const mapped = mapLegacyMarketingHref(href);
    if (mapped.startsWith("http://") || mapped.startsWith("https://")) return mapped;
    return withMarketingLocale(locale, mapped);
  };

  const buildLocalizedMarketingPath = useCallback((localeCode: string, path: string) => {
    const mapped = mapLegacyMarketingHref(path);
    if (mapped.startsWith("http://") || mapped.startsWith("https://")) return mapped;
    return withMarketingLocale(localeCode, mapped);
  }, []);

  const clearMegaCloseTimer = () => {
    if (!closeMegaTimeoutRef.current) return;
    clearTimeout(closeMegaTimeoutRef.current);
    closeMegaTimeoutRef.current = null;
  };

  const scheduleMegaClose = () => {
    clearMegaCloseTimer();
    closeMegaTimeoutRef.current = setTimeout(() => setOpenMegaMenu(null), 120);
  };

  /** Close mega menu before following in-header auth links so no high-z panel intercepts the next paint. */
  const closeMegaBeforeAuthNav = useCallback(() => {
    clearMegaCloseTimer();
    setOpenMegaMenu(null);
  }, []);

  const handleDesktopRegionSelect = useCallback(
    async (newRegion: GlobalRegionSlug) => {
      await applyGlobalRegionSelection(newRegion, {
        marketingLocale: globalLocale,
        setUsCaMarketingRegion: setRegionAndRefresh,
        router,
        buildLocalizedPath: buildLocalizedMarketingPath,
      });
      setDesktopCountryOpen(false);
    },
    [globalLocale, setRegionAndRefresh, router, buildLocalizedMarketingPath],
  );

  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!desktopCountryRef.current?.contains(e.target as Node)) setDesktopCountryOpen(false);
      if (!desktopLangRef.current?.contains(e.target as Node)) setDesktopLangOpen(false);
      if (!mobileLangRef.current?.contains(e.target as Node)) setMobileLangOpen(false);
      if (!headerRef.current?.contains(e.target as Node)) setOpenMegaMenu(null);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMegaMenu(null);
        setDesktopCountryOpen(false);
        setDesktopLangOpen(false);
        setMobileLangOpen(false);
      }
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMegaMenu(null);
    setMobileExpandedMega(null);
    setDesktopCountryOpen(false);
    setDesktopLangOpen(false);
    setMobileLangOpen(false);
  }, [pathname, locale, region]);

  useEffect(
    () => () => {
      if (closeMegaTimeoutRef.current) {
        clearTimeout(closeMegaTimeoutRef.current);
      }
    },
    [],
  );

  const megaMenus = useMemo(() => createMegaMenus(region), [region]);
  const user = session?.user;
  const isAuthenticated = Boolean(sessionStatus === "authenticated" && user);
  const isAdminAuthenticated = Boolean(isAuthenticated && user?.role && isStaffRole(user.role));
  const isLearnerAuthenticated = Boolean(
    isAuthenticated &&
      user?.role &&
      !isStaffRole(user.role),
  );
  const isMarketingNav = !isLearnerAuthenticated;
  const navActor = isAdminAuthenticated ? "admin" : isLearnerAuthenticated ? "learner" : "anonymous";
  const learnerPathwayId =
    isLearnerAuthenticated && user
      ? defaultPathwayIdForMarketingOffering(
          user.country as LearnerCountry,
          offeringIdForTier(user.tier as LearnerTier),
        )
      : null;
  const learnerLinks = useMemo(
    () => createLearnerNavLinks(t, locale, learnerPathwayId),
    [t, locale, learnerPathwayId],
  );
  const learnerExamBadge =
    isLearnerAuthenticated && user
      ? examIndicatorLabel(user.country as LearnerCountry, user.tier as LearnerTier, (user as { alliedProfessionKey?: string | null }).alliedProfessionKey)
      : null;
  const activeProfession: string = isLearnerAuthenticated && user?.tier
    ? (user.tier === "RPN" || user.tier === "LVN_LPN" ? "pn" : user.tier === "NP" ? "np" : user.tier === "ALLIED" ? "allied" : "rn")
    : "rn";
  const activeExam: string | null = null;
  const marketingBrowseLinks: HeaderNavLink[] = useMemo(
    () => [
      {
        key: "pricing",
        href: HUB.pricing,
        matchBase: HUB.pricing,
        label: formatTitleCase(t("nav.pricing"), locale),
      },
      {
        key: "blog",
        href: "/blog",
        matchBase: "/blog",
        label: formatTitleCase(t("footer.blog"), locale),
      },
      { key: "faq", href: "/faq", matchBase: "/faq", label: formatTitleCase(t("footer.faq"), locale) },
      {
        key: "pre-nursing",
        href: "/pre-nursing",
        matchBase: "/pre-nursing",
        label: formatTitleCase(t("nav.preNursing"), locale),
      },
      { key: "tools", href: HUB.tools, matchBase: HUB.tools, label: formatTitleCase(t("nav.tools"), locale) },
    ],
    [t, locale],
  );
  const openMega = megaMenus.find((menu) => menu.key === openMegaMenu) ?? null;

  const darkHeaderShadow = useMemo(() => {
    const inset = "inset 0 1px 0 0 rgba(255,255,255,0.15)";
    if (!isScrolled) return inset;
    return `${inset}, 0 12px 36px -14px color-mix(in srgb, var(--theme-heading-text) 18%, transparent)`;
  }, [isScrolled]);

  const mobileMoreNav: { key: string; href: string; label: string }[] = [
    { key: "pre-nursing", href: "/pre-nursing", label: formatTitleCase(t("nav.preNursing"), locale) },
  ];
  const marketingDesktopUtilityControls = (
    <div className="hidden items-center gap-1.5 lg:flex">
      <div className="relative" ref={desktopCountryRef}>
        <button
          type="button"
          onClick={() => setDesktopCountryOpen((open) => !open)}
          className={HEADER_UTILITY_BUTTON_CLASS}
          aria-expanded={desktopCountryOpen}
          aria-label={`Region: ${REGION_CONFIG[effectiveGlobalRegion].displayName}. Click to change.`}
        >
          <span className="flex max-w-[4rem] items-center gap-1 truncate sm:max-w-[6rem]">
            {effectiveGlobalRegion === "canada" ? (
              "CA"
            ) : effectiveGlobalRegion === "us" ? (
              "US"
            ) : (
              <>
                <span aria-hidden>{getRegionFlag(effectiveGlobalRegion)}</span>
                <span className="truncate">{REGION_CONFIG[effectiveGlobalRegion].displayName}</span>
              </>
            )}
          </span>
          <ChevronDown className={`h-3 w-3 shrink-0 opacity-60 transition-transform ${desktopCountryOpen ? "rotate-180" : ""}`} aria-hidden />
        </button>
        {desktopCountryOpen ? (
          <div className="absolute end-0 z-[120] mt-2">
            <CountrySelector
              currentRegion={effectiveGlobalRegion}
              onSelect={handleDesktopRegionSelect}
              onClose={() => setDesktopCountryOpen(false)}
              variant="popover"
            />
          </div>
        ) : null}
      </div>
      <div className="relative" ref={desktopLangRef}>
        <button
          type="button"
          onClick={() => setDesktopLangOpen((open) => !open)}
          className={HEADER_UTILITY_BUTTON_CLASS}
          aria-expanded={desktopLangOpen}
          aria-label={`${t("nav.language")}: ${locale.toUpperCase()}. Click to change.`}
        >
          <span>{locale.toUpperCase()}</span>
          <ChevronDown className={`h-3 w-3 shrink-0 opacity-60 transition-transform ${desktopLangOpen ? "rotate-180" : ""}`} aria-hidden />
        </button>
        {desktopLangOpen ? (
          <div className="absolute end-0 z-[120] mt-2 max-h-56 w-52 overflow-y-auto rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] p-1 shadow-[var(--shadow-card-hover)]">
            <MarketingLanguagePreferenceList
              onDone={() => setDesktopLangOpen(false)}
              renderItem={({ code, name, flag, disabled, onSelect }) => (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={onSelect}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs hover:bg-[var(--nav-hover)] ${
                    code === locale ? "bg-[var(--nav-active)] font-medium text-[var(--nav-fg)]" : "text-[var(--nav-muted)]"
                  }`}
                >
                  <span>{flag}</span>
                  {name}
                </button>
              )}
            />
          </div>
        ) : null}
      </div>
      <div className="text-[var(--nav-fg)] [&_button]:min-h-0 [&_button]:border-[var(--nav-border)] [&_button]:bg-transparent [&_button]:px-2.5 [&_button]:py-1.5 [&_button]:text-[11px] [&_button]:font-medium [&_button]:shadow-none [&_button]:hover:bg-[var(--nav-hover)] [&_button]:hover:text-[var(--nav-fg)]">
        <ThemePicker
          className="shrink-0"
          labels={{
            navTheme: t("nav.theme"),
            themeGroupLight: t("nav.themeGroupLight"),
            themeGroupDark: t("nav.themeGroupDark"),
          }}
        />
      </div>
    </div>
  );

  const strippedPath = stripMarketingLocalePrefix(pathname).pathname;
  const regionalStrip = useMemo(
    () => resolveRegionalMarketingStrip(strippedPath, locale, clientGlobalRegion),
    [strippedPath, locale, clientGlobalRegion],
  );

  /** Homepage-only acquisition param; other marketing pages keep plain signup URL. */
  const guestMarketingSignupHref = useMemo(() => {
    const base = `/signup?callbackUrl=${encodeURIComponent("/app")}`;
    const isHome = strippedPath === "/" || strippedPath === "";
    const raw = isHome ? `${base}&entry=homepage` : base;
    const mapped = mapLegacyMarketingHref(raw);
    if (mapped.startsWith("http://") || mapped.startsWith("https://")) return mapped;
    return withMarketingLocale(locale, mapped);
  }, [locale, strippedPath]);

  useEffect(() => {
    if (!isMarketingNav) {
      setOpenMegaMenu(null);
      setMobileExpandedMega(null);
    }
  }, [isMarketingNav]);

  useEffect(() => {
    if (!isLearnerAuthenticated) {
      setResumeStudyingCta(null);
      return;
    }
    const controller = new AbortController();
    void fetch("/api/learner/engagement-nudges", {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { nudges?: EngagementNudgePayload[] };
      })
      .then((payload) => {
        if (!payload?.nudges || controller.signal.aborted) {
          setResumeStudyingCta(null);
          return;
        }
        const continueNudge = payload.nudges.find((nudge) => nudge.kind === "continue_plan");
        if (continueNudge?.href) {
          setResumeStudyingCta({
            href: continueNudge.href,
            label: formatTitleCase(CONTINUE_STUDYING_CTA, locale),
          });
          return;
        }
        setResumeStudyingCta(null);
      })
      .catch(() => {
        if (!controller.signal.aborted) setResumeStudyingCta(null);
      });
    return () => controller.abort();
  }, [isLearnerAuthenticated, locale]);

  return (
    <div style={navChromeVars} className="sticky top-0 z-50 nn-header-animate-in" ref={headerRef}>
      <header
        style={isLightTheme ? undefined : { ...navChromeStyle, boxShadow: darkHeaderShadow }}
        className={`relative w-full border-b${
          isLightTheme
            ? ` nn-header-logo-row${isScrolled ? " nn-header-logo-row--scrolled" : ""}`
            : " nn-header-dark-surface"
        } overflow-visible`}
        onMouseEnter={isMarketingNav ? clearMegaCloseTimer : undefined}
        onMouseLeave={isMarketingNav ? scheduleMegaClose : undefined}
      >
        {isMarketingNav ? (
          <div className="hidden w-full border-b border-[var(--nn-nav-border)] nn-header-utility-dark lg:block">
            <div className="nn-section-shell flex h-9 items-center justify-end">
              {marketingDesktopUtilityControls}
            </div>
          </div>
        ) : null}
        <div className="nn-section-shell flex flex-col overflow-visible">
          {/* ── Mobile brand row ── */}
          <div className="flex min-h-[4.5rem] items-center gap-2 overflow-visible border-b border-[var(--header-border)] pt-[env(safe-area-inset-top,0px)] sm:gap-4 lg:hidden">
            <Link
              href={localizeHref("/")}
              className="nn-header-logo-link group flex min-w-0 shrink-0 items-center gap-2.5 overflow-visible bg-transparent"
              aria-label={t("brand.homeAriaLabel")}
            >
              <HeaderBrandLockup />
            </Link>
            {/* Guests: Login + primary CTA live in this row so they are never only in a secondary strip or hamburger. */}
            {!isAuthenticated ? (
              <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2">
                <Link
                  href={localizeHref(`/login?callbackUrl=${encodeURIComponent("/app")}`)}
                  className="inline-flex min-h-[44px] max-w-[38%] shrink-0 items-center justify-center rounded-xl border border-[var(--nav-border)] px-2 py-2 text-xs font-medium text-[var(--nav-fg)] hover:bg-[var(--nav-hover)] sm:max-w-none sm:px-3 sm:text-sm"
                  onClick={isMarketingNav ? closeMegaBeforeAuthNav : undefined}
                  aria-label="Log in to your NurseNest account"
                >
                  {formatTitleCase(t("nav.logIn"), locale)}
                </Link>
                <Link
                  href={guestMarketingSignupHref}
                  className="nn-nav-cta inline-flex min-h-[44px] min-w-0 max-w-[52%] shrink items-center justify-center rounded-xl px-2.5 py-2 text-xs font-semibold sm:max-w-none sm:px-4 sm:text-sm"
                  onClick={isMarketingNav ? closeMegaBeforeAuthNav : undefined}
                  aria-label="Start free account — nursing and healthcare exam prep"
                  title="Start free — no credit card required"
                >
                  {formatTitleCase(t("nav.signup"), locale)}
                </Link>
              </div>
            ) : null}
            {/* Mobile controls — only visible below lg */}
            <div className={`flex shrink-0 items-center gap-2 lg:hidden ${isAuthenticated ? "ml-auto" : ""}`}>
              <button
                type="button"
                onClick={() => setMobileContextOpen(true)}
                className="md:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--nn-nav-border)] bg-transparent p-0 text-[var(--nn-nav-fg)] transition-colors hover:bg-[var(--nn-nav-hover-bg)]"
                aria-label="Region and language settings"
                aria-expanded={mobileContextOpen}
              >
                <Settings className="h-[18px] w-[18px]" aria-hidden />
              </button>
              <Button
                type="button"
                variant="ghost"
                className="h-10 w-10 shrink-0 rounded-xl border border-[var(--nn-nav-border)] p-0 text-[var(--nn-nav-fg)] hover:bg-[var(--nn-nav-hover-bg)]"
                aria-label={t("nav.openMenu")}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" aria-hidden />
              </Button>
            </div>
          </div>

          {/* Mobile/tablet: signed-in CTAs (learners/staff) — guests use the top row above */}
          {isAuthenticated ? (
            <div className="relative z-[130] flex items-center justify-end gap-2 border-b border-[var(--header-border)] bg-[var(--nav-bg)] px-4 py-2.5 lg:hidden">
              {isLearnerAuthenticated ? (
                <div className="flex w-full min-w-0 items-center justify-end gap-2">
                  <Link
                    href={resumeStudyingCta?.href ?? "/app"}
                    className="nn-nav-cta inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold sm:flex-initial sm:px-4"
                  >
                    {resumeStudyingCta?.label ?? formatTitleCase(CONTINUE_STUDYING_CTA, locale)}
                  </Link>
                  <Link href="/app" className={HEADER_SECONDARY_ACTION_CLASS}>
                    {formatTitleCase(t("nav.dashboard"), locale)}
                  </Link>
                </div>
              ) : (
                <div className="flex w-full min-w-0 items-center justify-end gap-2">
                  <Link
                    href={ADMIN_DASHBOARD_ROUTE}
                    className="nn-nav-cta inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold sm:flex-initial sm:px-4"
                    onClick={closeMegaBeforeAuthNav}
                  >
                    {formatTitleCase(t("nav.admin"), locale)}
                  </Link>
                  <Link href="/app" className={HEADER_SECONDARY_ACTION_CLASS}>
                    {formatTitleCase(t("nav.dashboard"), locale)}
                  </Link>
                </div>
              )}
            </div>
          ) : null}

          {/* ── Desktop main header row ── */}
          <div className="hidden min-h-[4.5rem] items-center gap-3 overflow-visible py-3 lg:flex">
            <Link
              href={localizeHref("/")}
              className="nn-header-logo-link group flex min-w-0 flex-none items-center gap-2.5 overflow-visible bg-transparent lg:min-w-[11rem] xl:min-w-[12rem]"
              aria-label={t("brand.homeAriaLabel")}
            >
              <HeaderBrandLockup />
            </Link>
            {isMarketingNav ? (
              <nav
                aria-label={t("nav.marketingExplore")}
                className="flex min-w-0 flex-1 items-center justify-center gap-0.5 xl:gap-1"
              >
                {marketingBrowseLinks.map((item) => (
                  <Link
                    key={item.key}
                    href={localizeHref(item.href)}
                    aria-current={isActivePath(strippedPath, item.matchBase) ? "page" : undefined}
                    className={NAV_LINK_CLASS}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: item.key,
                        surface: "site_header_desktop",
                        marketing_region: region,
                      })
                    }
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : (
              <nav
                aria-label="Learner navigation"
                className="flex min-w-0 flex-1 items-center justify-center gap-0.5 xl:gap-1"
              >
                {/* Tier pill — accent-colored, visible from lg breakpoint */}
                {learnerExamBadge ? (
                  <span
                    className="inline-flex shrink-0 items-center rounded-full bg-[color-mix(in_srgb,var(--nav-cta-bg,var(--theme-primary))_18%,var(--header-background,transparent))] px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[var(--nav-cta-bg,var(--nav-fg))]"
                    aria-label={`Your pathway: ${learnerExamBadge}`}
                  >
                    {learnerExamBadge}
                  </span>
                ) : null}
                {learnerLinks.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isActivePath(pathname, item.matchBase) ? "page" : undefined}
                    className={`${NAV_LINK_CLASS} text-center`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}

          <div className="relative z-[130] flex shrink-0 items-center justify-end gap-2">
              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={localizeHref(`/login?callbackUrl=${encodeURIComponent("/app")}`)}
                    className={HEADER_SECONDARY_ACTION_CLASS}
                    onClick={isMarketingNav ? closeMegaBeforeAuthNav : undefined}
                    aria-label="Log in to your NurseNest account"
                  >
                    {formatTitleCase(t("nav.logIn"), locale)}
                  </Link>
                  <Link
                    href={guestMarketingSignupHref}
                    className="nn-nav-cta inline-flex min-h-0 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold"
                    onClick={isMarketingNav ? closeMegaBeforeAuthNav : undefined}
                    aria-label="Start free account — nursing and healthcare exam prep"
                    title="Start free — no credit card required"
                  >
                    {formatTitleCase(t("nav.signup"), locale)}
                  </Link>
                </div>
              ) : isLearnerAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={resumeStudyingCta?.href ?? "/app"}
                    className="nn-nav-cta inline-flex min-h-0 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold"
                  >
                    {resumeStudyingCta?.label ?? formatTitleCase(CONTINUE_STUDYING_CTA, locale)}
                  </Link>
                  <Link href="/app" className={HEADER_SECONDARY_ACTION_CLASS}>
                    {formatTitleCase(t("nav.dashboard"), locale)}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href={ADMIN_DASHBOARD_ROUTE}
                    className="nn-nav-cta inline-flex min-h-0 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold"
                    onClick={closeMegaBeforeAuthNav}
                  >
                    {formatTitleCase(t("nav.admin"), locale)}
                  </Link>
                  <Link href="/app" className={HEADER_SECONDARY_ACTION_CLASS}>
                    {formatTitleCase(t("nav.dashboard"), locale)}
                  </Link>
                </div>
              )}
          </div>
          </div>{/* /nav-row */}
        </div>{/* /shell */}
        {isMarketingNav ? (
          <div className="hidden w-full border-t border-[var(--nn-nav-border)] nn-header-nav-row lg:block">
            <div className="nn-section-shell flex min-h-11 flex-wrap items-center gap-x-1 gap-y-1">
              {regionalStrip === "middle_east" ? (
                <div className="flex min-w-0 flex-wrap items-center gap-0.5 border-e border-[var(--nn-nav-border)] pe-2 me-1">
                  <Link
                    href={localizeHref("/exams/middle-east")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "middle_east_exams_hub",
                        surface: "site_header_middle_east_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.middleEast.examsHub"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/middle-east/prometric-nursing-exam")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "middle_east_prometric",
                        surface: "site_header_middle_east_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.middleEast.prometricExam"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/middle-east/dha-exam")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "middle_east_dha",
                        surface: "site_header_middle_east_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.middleEast.dhaExam"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/middle-east/haad-exam")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "middle_east_haad",
                        surface: "site_header_middle_east_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.middleEast.haadExam"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/exams/middle-east#middle-east-dha")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "middle_east_work_uae",
                        surface: "site_header_middle_east_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.middleEast.workUae"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/exams/middle-east#middle-east-saudi")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "middle_east_saudi_guide",
                        surface: "site_header_middle_east_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.middleEast.saudiGuide"), locale)}
                  </Link>
                  <Link
                    href={localizeHref(HUB.questionBank)}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "middle_east_prometric_practice",
                        surface: "site_header_middle_east_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.middleEast.prometricPractice"), locale)}
                  </Link>
                </div>
              ) : null}
              {regionalStrip === "australia" ? (
                <div className="flex min-w-0 flex-wrap items-center gap-0.5 border-e border-[var(--nn-nav-border)] pe-2 me-1">
                  <Link
                    href={localizeHref("/exams/australia")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "australia_exams_hub",
                        surface: "site_header_australia_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.australia.examsHub"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/australia/ahpra-registration")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "australia_ahpra",
                        surface: "site_header_australia_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.australia.ahpra"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/australia/osce-nursing")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "australia_osce",
                        surface: "site_header_australia_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.australia.osce"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/australia/oba-nursing")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "australia_oba",
                        surface: "site_header_australia_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.australia.oba"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/exams/australia#au-international")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "australia_work",
                        surface: "site_header_australia_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.australia.workAu"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/exams/australia#au-overview")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "australia_guide_ahpra",
                        surface: "site_header_australia_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.australia.guideAhpra"), locale)}
                  </Link>
                  <Link
                    href={localizeHref(HUB.questionBank)}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "australia_osce_prep",
                        surface: "site_header_australia_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.australia.oscePrep"), locale)}
                  </Link>
                </div>
              ) : null}
              {regionalStrip === "china" ? (
                <div className="flex min-w-0 flex-wrap items-center gap-0.5 border-e border-[var(--nn-nav-border)] pe-2 me-1">
                  <Link
                    href={localizeHref("/exams/china")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "china_exams_hub",
                        surface: "site_header_china_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.china.examsHub"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/china/nursing-exam")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "china_nursing_exam",
                        surface: "site_header_china_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.china.nursingExam"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/china/how-to-become-a-nurse")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "china_how_to_become",
                        surface: "site_header_china_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.china.howToBecome"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/china/work-abroad")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "china_work_abroad",
                        surface: "site_header_china_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.china.workAbroad"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/china/nclex-for-chinese-nurses")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "china_nclex_topic",
                        surface: "site_header_china_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.china.nclexTopic"), locale)}
                  </Link>
                  <Link
                    href={localizeHref(`/blog/tag/${encodeURIComponent("China nursing")}`)}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "china_blog_tag",
                        surface: "site_header_china_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.china.blog"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/us/rn/nclex-rn/lessons")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "china_nclex_compare",
                        surface: "site_header_china_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.china.nclexPrepUs"), locale)}
                  </Link>
                </div>
              ) : null}
              {regionalStrip === "korea" ? (
                <div className="flex min-w-0 flex-wrap items-center gap-0.5 border-e border-[var(--nn-nav-border)] pe-2 me-1">
                  <Link
                    href={localizeHref("/exams/korea")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "korea_exams_hub",
                        surface: "site_header_korea_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.korea.examsHub"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/korea/nursing-exam")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "korea_nursing_exam",
                        surface: "site_header_korea_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.korea.nursingExam"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/korea/how-to-become-a-nurse")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "korea_how_to_become",
                        surface: "site_header_korea_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.korea.howToBecome"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/korea/work-abroad")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "korea_work_abroad",
                        surface: "site_header_korea_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.korea.workAbroad"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/korea/nclex-for-korean-nurses")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "korea_nclex_topic",
                        surface: "site_header_korea_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.korea.nclexTopic"), locale)}
                  </Link>
                  <Link
                    href={localizeHref(`/blog/tag/${encodeURIComponent("Korea nursing")}`)}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "korea_blog_tag",
                        surface: "site_header_korea_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.korea.blog"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/us/rn/nclex-rn/lessons")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "korea_nclex_compare",
                        surface: "site_header_korea_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.korea.nclexPrepUs"), locale)}
                  </Link>
                </div>
              ) : null}
              {regionalStrip === "japan" ? (
                <div className="flex min-w-0 flex-wrap items-center gap-0.5 border-e border-[var(--nn-nav-border)] pe-2 me-1">
                  <Link
                    href={localizeHref("/exams/japan")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "japan_exams_hub",
                        surface: "site_header_japan_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.japan.examsHub"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/japan/nursing-exam")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "japan_nursing_exam",
                        surface: "site_header_japan_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.japan.nursingExam"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/japan/how-to-become-a-nurse")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "japan_how_to_become",
                        surface: "site_header_japan_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.japan.howToBecome"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/japan/work-abroad")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "japan_work_abroad",
                        surface: "site_header_japan_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.japan.workAbroad"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/japan/nclex-for-japanese-nurses")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "japan_nclex_topic",
                        surface: "site_header_japan_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.japan.nclexTopic"), locale)}
                  </Link>
                  <Link
                    href={localizeHref(`/blog/tag/${encodeURIComponent("Japan nursing")}`)}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "japan_blog_tag",
                        surface: "site_header_japan_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.japan.blog"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/us/rn/nclex-rn/lessons")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "japan_nclex_compare",
                        surface: "site_header_japan_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.japan.nclexPrepUs"), locale)}
                  </Link>
                </div>
              ) : null}
              {regionalStrip === "germany" ? (
                <div className="flex min-w-0 flex-wrap items-center gap-0.5 border-e border-[var(--nn-nav-border)] pe-2 me-1">
                  <Link
                    href={localizeHref("/exams/germany")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "germany_exams_hub",
                        surface: "site_header_germany_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.germany.examsHub"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/germany/nurse-recognition")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "germany_nurse_recognition",
                        surface: "site_header_germany_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.germany.nurseRecognition"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/germany/work-as-a-nurse")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "germany_work_as_nurse",
                        surface: "site_header_germany_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.germany.workAsNurse"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/germany/kenntnisprufung")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "germany_kenntnisprufung",
                        surface: "site_header_germany_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.germany.kenntnisprufungGuide"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/germany/german-language-for-nurses")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "germany_german_language",
                        surface: "site_header_germany_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.germany.germanLanguageTopic"), locale)}
                  </Link>
                  <Link
                    href={localizeHref(`/blog/tag/${encodeURIComponent("Germany nursing")}`)}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "germany_blog_tag",
                        surface: "site_header_germany_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.germany.blog"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/us/rn/nclex-rn/lessons")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "germany_nclex_parallel",
                        surface: "site_header_germany_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.germany.nclexPrepUs"), locale)}
                  </Link>
                </div>
              ) : null}
              {regionalStrip === "france" ? (
                <div className="flex min-w-0 flex-wrap items-center gap-0.5 border-e border-[var(--nn-nav-border)] pe-2 me-1">
                  <Link
                    href={localizeHref("/exams/france")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "france_exams_hub",
                        surface: "site_header_france_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.france.examsHub"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/france/nurse-registration")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "france_nurse_registration",
                        surface: "site_header_france_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.france.nurseRegistration"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/france/how-to-become-a-nurse")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "france_how_to_become",
                        surface: "site_header_france_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.france.howToBecome"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/france/work-abroad")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "france_work_abroad",
                        surface: "site_header_france_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.france.workAbroad"), locale)}
                  </Link>
                  <Link
                    href={buildLocalizedMarketingPath("fr", "/exams/france")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "france_french_resources",
                        surface: "site_header_france_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.france.frenchResources"), locale)}
                  </Link>
                  <Link
                    href={localizeHref(`/blog/tag/${encodeURIComponent(t("blog.country.france.tagName"))}`)}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "france_blog_tag",
                        surface: "site_header_france_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.france.blog"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/us/rn/nclex-rn/lessons")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "france_nclex_parallel",
                        surface: "site_header_france_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.france.nclexPrepUs"), locale)}
                  </Link>
                </div>
              ) : null}
              {regionalStrip === "italy" ? (
                <div className="flex min-w-0 flex-wrap items-center gap-0.5 border-e border-[var(--nn-nav-border)] pe-2 me-1">
                  <Link
                    href={localizeHref("/exams/italy")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "italy_exams_hub",
                        surface: "site_header_italy_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.italy.examsHub"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/italy/nurse-registration")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "italy_nurse_registration",
                        surface: "site_header_italy_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.italy.nurseRegistration"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/italy/how-to-become-a-nurse")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "italy_how_to_become",
                        surface: "site_header_italy_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.italy.howToBecome"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/italy/work-abroad")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "italy_work_abroad",
                        surface: "site_header_italy_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.italy.workAbroad"), locale)}
                  </Link>
                  <Link
                    href={buildLocalizedMarketingPath("it", "/exams/italy")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "italy_italian_resources",
                        surface: "site_header_italy_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.italy.italianResources"), locale)}
                  </Link>
                  <Link
                    href={localizeHref(`/blog/tag/${encodeURIComponent(t("blog.country.italy.tagName"))}`)}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "italy_blog_tag",
                        surface: "site_header_italy_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.italy.blog"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/us/rn/nclex-rn/lessons")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "italy_nclex_parallel",
                        surface: "site_header_italy_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.italy.nclexPrepUs"), locale)}
                  </Link>
                </div>
              ) : null}
              {regionalStrip === "hungary" ? (
                <div className="flex min-w-0 flex-wrap items-center gap-0.5 border-e border-[var(--nn-nav-border)] pe-2 me-1">
                  <Link
                    href={localizeHref("/exams/hungary")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "hungary_exams_hub",
                        surface: "site_header_hungary_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.hungary.examsHub"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/hungary/nurse-registration")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "hungary_nurse_registration",
                        surface: "site_header_hungary_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.hungary.nurseRegistration"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/hungary/how-to-become-a-nurse")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "hungary_how_to_become",
                        surface: "site_header_hungary_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.hungary.howToBecome"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/hungary/work-abroad")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "hungary_work_abroad",
                        surface: "site_header_hungary_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.hungary.workAbroad"), locale)}
                  </Link>
                  <Link
                    href={buildLocalizedMarketingPath("hu", "/exams/hungary")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "hungary_hungarian_resources",
                        surface: "site_header_hungary_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.hungary.hungarianResources"), locale)}
                  </Link>
                  <Link
                    href={localizeHref(`/blog/tag/${encodeURIComponent(t("blog.country.hungary.tagName"))}`)}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "hungary_blog_tag",
                        surface: "site_header_hungary_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.hungary.blog"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/us/rn/nclex-rn/lessons")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "hungary_nclex_parallel",
                        surface: "site_header_hungary_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.hungary.nclexPrepUs"), locale)}
                  </Link>
                </div>
              ) : null}
              {regionalStrip === "portugal" ? (
                <div className="flex min-w-0 flex-wrap items-center gap-0.5 border-e border-[var(--nn-nav-border)] pe-2 me-1">
                  <Link
                    href={localizeHref("/exams/portugal")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "portugal_exams_hub",
                        surface: "site_header_portugal_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.portugal.examsHub"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/portugal/nurse-registration")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "portugal_nurse_registration",
                        surface: "site_header_portugal_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.portugal.nurseRegistration"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/portugal/how-to-become-a-nurse")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "portugal_how_to_become",
                        surface: "site_header_portugal_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.portugal.howToBecome"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/portugal/work-abroad")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "portugal_work_abroad",
                        surface: "site_header_portugal_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.portugal.workAbroad"), locale)}
                  </Link>
                  <Link
                    href={buildLocalizedMarketingPath("pt", "/exams/portugal")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "portugal_portuguese_resources",
                        surface: "site_header_portugal_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.portugal.portugueseResources"), locale)}
                  </Link>
                  <Link
                    href={localizeHref(`/blog/tag/${encodeURIComponent(t("blog.country.portugal.tagName"))}`)}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "portugal_blog_tag",
                        surface: "site_header_portugal_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.portugal.blog"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/us/rn/nclex-rn/lessons")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "portugal_nclex_parallel",
                        surface: "site_header_portugal_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.portugal.nclexPrepUs"), locale)}
                  </Link>
                </div>
              ) : null}
              {regionalStrip === "mexico" ? (
                <div className="flex min-w-0 flex-wrap items-center gap-0.5 border-e border-[var(--nn-nav-border)] pe-2 me-1">
                  <Link
                    href={localizeHref("/exams/mexico")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "mexico_exams_hub",
                        surface: "site_header_mexico_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.mexico.examsHub"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/mexico/nurse-registration")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "mexico_nurse_registration",
                        surface: "site_header_mexico_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.mexico.nurseRegistration"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/mexico/how-to-become-a-nurse")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "mexico_how_to_become",
                        surface: "site_header_mexico_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.mexico.howToBecome"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/mexico/nclex-for-mexican-nurses")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "mexico_nclex_for_mexican_nurses",
                        surface: "site_header_mexico_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.mexico.nclexForMexicanNurses"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/mexico/work-abroad")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "mexico_work_abroad",
                        surface: "site_header_mexico_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.mexico.workAbroad"), locale)}
                  </Link>
                  <Link
                    href={buildLocalizedMarketingPath("es", "/exams/mexico")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "mexico_spanish_resources",
                        surface: "site_header_mexico_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.mexico.spanishResources"), locale)}
                  </Link>
                  <Link
                    href={localizeHref(`/blog/tag/${encodeURIComponent(t("blog.country.mexico.tagName"))}`)}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "mexico_blog_tag",
                        surface: "site_header_mexico_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.mexico.blog"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/us/rn/nclex-rn/lessons")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "mexico_nclex_parallel",
                        surface: "site_header_mexico_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.country.mexico.nclexPrepUs"), locale)}
                  </Link>
                </div>
              ) : null}
              {regionalStrip === "india" ? (
                <div className="flex min-w-0 flex-wrap items-center gap-0.5 border-e border-[var(--nn-nav-border)] pe-2 me-1">
                  <Link
                    href={localizeHref("/exams/india")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "india_exams_hub",
                        surface: "site_header_india_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.india.examsHub"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/exams/india#india-intl")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[11rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "india_work_abroad",
                        surface: "site_header_india_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.india.workAbroad"), locale)}
                  </Link>
                  <Link
                    href={localizeHref("/us/rn/nclex-rn/lessons")}
                    className={`${NAV_TIER_LINK_CLASS} max-w-[12rem] truncate sm:max-w-none`}
                    onClick={() =>
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: "india_nclex",
                        surface: "site_header_india_strip",
                        marketing_region: region,
                      })
                    }
                  >
                    {formatTitleCase(t("nav.india.nclexIndia"), locale)}
                  </Link>
                </div>
              ) : null}
              <nav
                aria-label={t("nav.marketingExplore")}
                className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-0.5 xl:gap-1"
              >
                {megaMenus.map((menu) => {
                  const expanded = openMegaMenu === menu.key;
                  return (
                    <div
                      key={menu.key}
                      className="relative"
                      onMouseEnter={() => setOpenMegaMenu(menu.key)}
                    >
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={`mega-menu-${menu.key}`}
                        data-active={isMegaMenuKeyActive(menu.key, strippedPath) || undefined}
                        className={`${NAV_TIER_LINK_CLASS} inline-flex items-center gap-1 text-center`}
                        onClick={() => setOpenMegaMenu(expanded ? null : menu.key)}
                        onFocus={() => setOpenMegaMenu(menu.key)}
                      >
                        {menu.label}
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
                      </button>
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        ) : null}
        {isMarketingNav && openMega ? (
          <div
            id={`mega-menu-${openMega.key}`}
            role="dialog"
            aria-label={`${openMega.label} menu`}
            className="absolute inset-x-0 top-full z-[120] hidden lg:block animate-[nn-mega-panel-enter_var(--brand-motion-normal)_var(--brand-motion-ease-luxury)_both]"
          >
            <div className="nn-section-shell pb-5 pt-1.5">
              <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-strong)] shadow-[var(--shadow-elevated)] ring-1 ring-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border-subtle))]">
                <div className="grid lg:grid-cols-[5fr_7fr]">

                  {/* ── Primary hub card (left) ── */}
                  <Link
                    href={localizeHref(openMega.hubHref)}
                    className="group flex flex-col items-start justify-between gap-10 border-r border-[var(--border-subtle)] bg-[var(--accent-surface-a)] p-8 text-left ring-1 ring-inset ring-[var(--accent-surface-a-border)] transition-[background-color,box-shadow] duration-150 ease-[var(--motion-ease)] hover:bg-[var(--accent-surface-a-border)] hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
                    onClick={() => {
                      setOpenMegaMenu(null);
                      trackClientEvent(PH.marketingNavClick, {
                        actor: navActor,
                        nav_id: `${openMega.key}_hub`,
                        surface: "site_header_mega_primary",
                        marketing_region: region,
                      });
                    }}
                  >
                    <div>
                      {/* Badge pill */}
                      <span className="mb-3 inline-flex items-center rounded-full border border-[var(--text-accent)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-accent)]">
                        {openMega.hubBadge ?? "Start Here"}
                      </span>
                      <h3 className="text-lg font-semibold leading-snug text-[var(--theme-heading-text)]">
                        {formatTitleCase(`${openMega.label} Exam Hub`, locale)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)]">
                        {openMega.hubDescription}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-[var(--text-accent)] transition-[gap] group-hover:gap-2">
                      Open Hub
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>

                  {/* ── Secondary groups + region links (right) ── */}
                  <div className="p-8 text-left">
                    <div className="grid w-full grid-cols-3 justify-items-start gap-x-8 gap-y-7">
                      {openMega.groups.map((group) => (
                        <div key={group.key} className="w-full min-w-0 text-left">
                          <p className="mb-3 border-b border-[var(--border-subtle)] pb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--theme-muted-text)]">
                            {formatEyebrow(group.heading, locale)}
                          </p>
                          <ul className="w-full space-y-1.5">
                            {group.links.map((link) => (
                              <li key={link.key}>
                                <Link
                                  href={localizeHref(link.href)}
                                  aria-current={isActivePath(strippedPath, link.href) ? "page" : undefined}
                                  className={`flex w-full items-center justify-start gap-1.5 rounded-lg px-2 py-2 text-left text-sm transition-[background-color,color,transform] duration-100 ease-[var(--motion-ease)] focus-visible:outline-2 focus-visible:outline-[var(--ring)] ${isActivePath(strippedPath, link.href) ? "bg-[var(--nav-active)] font-semibold text-[var(--nav-link-active)]" : "font-medium text-[var(--theme-heading-text)] hover:translate-x-0.5 hover:bg-[var(--nav-hover)] hover:text-[var(--nav-link-hover)]"}`}
                                  onClick={() => {
                                    setOpenMegaMenu(null);
                                    trackClientEvent(PH.marketingNavClick, {
                                      actor: navActor,
                                      nav_id: `${openMega.key}_${link.key}`,
                                      surface: "site_header_mega_menu",
                                      marketing_region: region,
                                    });
                                  }}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-opacity duration-100 ${isActivePath(strippedPath, link.href) ? "bg-[var(--text-accent)] opacity-100" : "opacity-0"}`}
                                    aria-hidden
                                  />
                                  {formatTitleCase(link.label, locale)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {openMega.regionLinks && openMega.regionLinks.length > 0 ? (
                      <div className="mt-5 space-y-4 border-t border-[var(--border-subtle)] pt-4">
                        {/* For Your Region — primary hub, recommended */}
                        {openMega.regionLinks.filter((rl) => rl.isPrimary).map((rl) => (
                          <div key={rl.key}>
                            <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-[var(--semantic-success)]">
                              For Your Region
                            </p>
                            <Link
                              href={localizeHref(rl.href)}
                              className="inline-flex items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-success)_25%,transparent)] bg-[color-mix(in_srgb,var(--semantic-success)_8%,transparent)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-success)_14%,transparent)] focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
                              onClick={() => {
                                setOpenMegaMenu(null);
                                trackClientEvent(PH.marketingNavClick, {
                                  actor: navActor,
                                  nav_id: `${openMega.key}_${rl.key}`,
                                  surface: "site_header_mega_region",
                                  marketing_region: region,
                                });
                              }}
                            >
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-success)]" aria-hidden />
                              {formatTitleCase(rl.label, locale)}
                              <span className="text-[10px] font-semibold text-[var(--semantic-success)]">Recommended</span>
                            </Link>
                          </div>
                        ))}
                        {/* Other Region — muted plain link */}
                        {openMega.regionLinks.filter((rl) => !rl.isPrimary).map((rl) => (
                          <div key={rl.key}>
                            <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-[var(--theme-muted-text)]">
                              Other Region
                            </p>
                            <Link
                              href={localizeHref(rl.href)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-[var(--theme-muted-text)] transition-[color,transform] duration-100 ease-[var(--motion-ease)] hover:translate-x-0.5 hover:text-[var(--theme-heading-text)] focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
                              onClick={() => {
                                setOpenMegaMenu(null);
                                trackClientEvent(PH.marketingNavClick, {
                                  actor: navActor,
                                  nav_id: `${openMega.key}_${rl.key}`,
                                  surface: "site_header_mega_region",
                                  marketing_region: region,
                                });
                              }}
                            >
                              {formatTitleCase(rl.label, locale)}
                              <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                </div>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {/* Context chip row — shows current country, language, profession, exam */}
      {!isMarketingNav ? (
        <GlobalContextBar
          region={effectiveGlobalRegion}
          locale={globalLocale}
          profession={activeProfession}
          exam={activeExam}
          onRegionClick={() => setMobileContextOpen(true)}
          onLanguageClick={() => setMobileContextOpen(true)}
          onProfessionClick={() => setMobileContextOpen(true)}
          onExamClick={() => setMobileContextOpen(true)}
        />
      ) : null}

      {/* Mobile context/settings drawer — separate from main nav */}
      <MobileContextDrawer
        open={mobileContextOpen}
        onClose={() => setMobileContextOpen(false)}
        region={effectiveGlobalRegion}
        locale={globalLocale}
        profession={activeProfession}
        exam={activeExam}
        onRegionChange={async (newRegion) => {
          await applyGlobalRegionSelection(newRegion, {
            marketingLocale: globalLocale,
            setUsCaMarketingRegion: setRegionAndRefresh,
            router,
            buildLocalizedPath: buildLocalizedMarketingPath,
          });
          setMobileContextOpen(false);
        }}
        onLocaleChange={() => {
          setMobileContextOpen(false);
        }}
        onProfessionChange={() => {
          setMobileContextOpen(false);
        }}
        onExamChange={() => {
          setMobileContextOpen(false);
        }}
        themeLabels={{
          navTheme: t("nav.theme"),
          themeGroupLight: t("nav.themeGroupLight"),
          themeGroupDark: t("nav.themeGroupDark"),
        }}
      />

      {mobileOpen ? (
        <div className="fixed inset-0 z-[200] lg:hidden animate-[nn-overlay-enter_0.24s_ease_both]">
          <button type="button" className="absolute inset-0 bg-black/56" aria-label={t("nav.closeMenu")} onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-x-0 top-0 flex h-[100dvh] max-h-[100dvh] flex-col border-b border-[var(--nav-border)] bg-[var(--nav-bg)] text-[var(--nav-fg)] shadow-[var(--shadow-elevated)] animate-[nn-drawer-slide-in_0.28s_cubic-bezier(0.25,0.1,0.25,1)_both]">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--header-border)] px-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
              <Link
                href={localizeHref("/")}
                className="flex min-w-0 shrink-0 items-center overflow-visible bg-transparent"
                aria-label={t("brand.homeAriaLabel")}
                onClick={() => setMobileOpen(false)}
              >
                <HeaderBrandLockup />
              </Link>
              <Button type="button" variant="ghost" className="h-10 w-10 shrink-0 rounded-xl border border-[var(--nav-border)] p-0 text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]" aria-label={t("nav.closeMenu")} onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-y-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5">
              <div className="space-y-1">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                  {isLearnerAuthenticated ? formatEyebrow("Study Navigation", locale) : t("nav.marketingExplore")}
                </p>
                {isLearnerAuthenticated ? (
                  learnerLinks.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="flex items-center rounded-xl px-3 py-3 text-[15px] font-semibold text-[var(--nav-fg)] transition-colors hover:bg-[var(--nav-hover)]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <>
                    {regionalStrip === "middle_east" ? (
                      <div className="mb-3 space-y-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_10%,var(--semantic-surface))] p-3">
                        <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                          {formatTitleCase(t("nav.middleEast.stripLabel"), locale)}
                        </p>
                        <Link
                          href={localizeHref("/exams/middle-east")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.middleEast.examsHub"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/middle-east/prometric-nursing-exam")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.middleEast.prometricExam"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/middle-east/dha-exam")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.middleEast.dhaExam"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/middle-east/haad-exam")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.middleEast.haadExam"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/middle-east/dataflow-guide")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.middleEast.dataflowGuide"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/exams/middle-east#middle-east-dha")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.middleEast.workUae"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/exams/middle-east#middle-east-saudi")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.middleEast.saudiGuide"), locale)}
                        </Link>
                        <Link
                          href={localizeHref(HUB.questionBank)}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.middleEast.prometricPractice"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/us/rn/nclex-rn/lessons")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("exams.middleEast.links.rnLessonsUs"), locale)}
                        </Link>
                      </div>
                    ) : null}
                    {regionalStrip === "australia" ? (
                      <div className="mb-3 space-y-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--semantic-surface))] p-3">
                        <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                          {formatTitleCase(t("nav.australia.stripLabel"), locale)}
                        </p>
                        <Link
                          href={localizeHref("/exams/australia")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.australia.examsHub"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/australia/ahpra-registration")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.australia.ahpra"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/australia/osce-nursing")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.australia.osce"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/australia/oba-nursing")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.australia.oba"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/australia/nursing-pathway")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("exams.australia.next.linkPathway"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/exams/australia#au-international")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.australia.workAu"), locale)}
                        </Link>
                        <Link
                          href={localizeHref(HUB.questionBank)}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.australia.oscePrep"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/us/rn/nclex-rn/lessons")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("exams.australia.links.rnLessonsUs"), locale)}
                        </Link>
                      </div>
                    ) : null}
                    {regionalStrip === "china" ? (
                      <div className="mb-3 space-y-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-3)_10%,var(--semantic-surface))] p-3">
                        <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                          {formatTitleCase(t("nav.country.china.stripLabel"), locale)}
                        </p>
                        <Link
                          href={localizeHref("/exams/china")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.china.examsHub"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/china/nursing-exam")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.china.nursingExam"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/china/how-to-become-a-nurse")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.china.howToBecome"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/china/work-abroad")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.china.workAbroad"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/china/nclex-for-chinese-nurses")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.china.nclexTopic"), locale)}
                        </Link>
                        <Link
                          href={localizeHref(`/blog/tag/${encodeURIComponent("China nursing")}`)}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.china.blog"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/us/rn/nclex-rn/lessons")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.china.nclexPrepUs"), locale)}
                        </Link>
                      </div>
                    ) : null}
                    {regionalStrip === "korea" ? (
                      <div className="mb-3 space-y-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-4)_10%,var(--semantic-surface))] p-3">
                        <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                          {formatTitleCase(t("nav.country.korea.stripLabel"), locale)}
                        </p>
                        <Link
                          href={localizeHref("/exams/korea")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.korea.examsHub"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/korea/nursing-exam")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.korea.nursingExam"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/korea/how-to-become-a-nurse")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.korea.howToBecome"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/korea/work-abroad")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.korea.workAbroad"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/korea/nclex-for-korean-nurses")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.korea.nclexTopic"), locale)}
                        </Link>
                        <Link
                          href={localizeHref(`/blog/tag/${encodeURIComponent("Korea nursing")}`)}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.korea.blog"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/us/rn/nclex-rn/lessons")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.korea.nclexPrepUs"), locale)}
                        </Link>
                      </div>
                    ) : null}
                    {regionalStrip === "japan" ? (
                      <div className="mb-3 space-y-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-5)_10%,var(--semantic-surface))] p-3">
                        <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                          {formatTitleCase(t("nav.country.japan.stripLabel"), locale)}
                        </p>
                        <Link
                          href={localizeHref("/exams/japan")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.japan.examsHub"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/japan/nursing-exam")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.japan.nursingExam"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/japan/how-to-become-a-nurse")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.japan.howToBecome"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/japan/work-abroad")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.japan.workAbroad"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/japan/nclex-for-japanese-nurses")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.japan.nclexTopic"), locale)}
                        </Link>
                        <Link
                          href={localizeHref(`/blog/tag/${encodeURIComponent("Japan nursing")}`)}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.japan.blog"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/us/rn/nclex-rn/lessons")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.japan.nclexPrepUs"), locale)}
                        </Link>
                      </div>
                    ) : null}
                    {regionalStrip === "germany" ? (
                      <div className="mb-3 space-y-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-4)_10%,var(--semantic-surface))] p-3">
                        <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                          {formatTitleCase(t("nav.country.germany.stripLabel"), locale)}
                        </p>
                        <Link
                          href={localizeHref("/exams/germany")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.germany.examsHub"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/germany/nurse-recognition")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.germany.nurseRecognition"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/germany/work-as-a-nurse")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.germany.workAsNurse"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/germany/kenntnisprufung")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.germany.kenntnisprufungGuide"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/germany/german-language-for-nurses")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.germany.germanLanguageTopic"), locale)}
                        </Link>
                        <Link
                          href={localizeHref(`/blog/tag/${encodeURIComponent("Germany nursing")}`)}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.germany.blog"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/us/rn/nclex-rn/lessons")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.germany.nclexPrepUs"), locale)}
                        </Link>
                      </div>
                    ) : null}
                    {regionalStrip === "france" ? (
                      <div className="mb-3 space-y-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-5)_10%,var(--semantic-surface))] p-3">
                        <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                          {formatTitleCase(t("nav.country.france.stripLabel"), locale)}
                        </p>
                        <Link
                          href={localizeHref("/exams/france")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.france.examsHub"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/france/nurse-registration")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.france.nurseRegistration"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/france/how-to-become-a-nurse")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.france.howToBecome"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/france/work-abroad")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.france.workAbroad"), locale)}
                        </Link>
                        <Link
                          href={buildLocalizedMarketingPath("fr", "/exams/france")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.france.frenchResources"), locale)}
                        </Link>
                        <Link
                          href={localizeHref(`/blog/tag/${encodeURIComponent(t("blog.country.france.tagName"))}`)}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.france.blog"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/us/rn/nclex-rn/lessons")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.france.nclexPrepUs"), locale)}
                        </Link>
                      </div>
                    ) : null}
                    {regionalStrip === "italy" ? (
                      <div className="mb-3 space-y-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-1)_10%,var(--semantic-surface))] p-3">
                        <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                          {formatTitleCase(t("nav.country.italy.stripLabel"), locale)}
                        </p>
                        <Link
                          href={localizeHref("/exams/italy")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.italy.examsHub"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/italy/nurse-registration")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.italy.nurseRegistration"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/italy/how-to-become-a-nurse")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.italy.howToBecome"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/italy/work-abroad")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.italy.workAbroad"), locale)}
                        </Link>
                        <Link
                          href={buildLocalizedMarketingPath("it", "/exams/italy")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.italy.italianResources"), locale)}
                        </Link>
                        <Link
                          href={localizeHref(`/blog/tag/${encodeURIComponent(t("blog.country.italy.tagName"))}`)}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.italy.blog"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/us/rn/nclex-rn/lessons")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.italy.nclexPrepUs"), locale)}
                        </Link>
                      </div>
                    ) : null}
                    {regionalStrip === "hungary" ? (
                      <div className="mb-3 space-y-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-5)_10%,var(--semantic-surface))] p-3">
                        <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                          {formatTitleCase(t("nav.country.hungary.stripLabel"), locale)}
                        </p>
                        <Link
                          href={localizeHref("/exams/hungary")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.hungary.examsHub"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/hungary/nurse-registration")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.hungary.nurseRegistration"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/hungary/how-to-become-a-nurse")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.hungary.howToBecome"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/hungary/work-abroad")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.hungary.workAbroad"), locale)}
                        </Link>
                        <Link
                          href={buildLocalizedMarketingPath("hu", "/exams/hungary")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.hungary.hungarianResources"), locale)}
                        </Link>
                        <Link
                          href={localizeHref(`/blog/tag/${encodeURIComponent(t("blog.country.hungary.tagName"))}`)}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.hungary.blog"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/us/rn/nclex-rn/lessons")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.hungary.nclexPrepUs"), locale)}
                        </Link>
                      </div>
                    ) : null}
                    {regionalStrip === "portugal" ? (
                      <div className="mb-3 space-y-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-2)_10%,var(--semantic-surface))] p-3">
                        <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                          {formatTitleCase(t("nav.country.portugal.stripLabel"), locale)}
                        </p>
                        <Link
                          href={localizeHref("/exams/portugal")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.portugal.examsHub"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/portugal/nurse-registration")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.portugal.nurseRegistration"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/portugal/how-to-become-a-nurse")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.portugal.howToBecome"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/portugal/work-abroad")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.portugal.workAbroad"), locale)}
                        </Link>
                        <Link
                          href={buildLocalizedMarketingPath("pt", "/exams/portugal")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.portugal.portugueseResources"), locale)}
                        </Link>
                        <Link
                          href={localizeHref(`/blog/tag/${encodeURIComponent(t("blog.country.portugal.tagName"))}`)}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.portugal.blog"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/us/rn/nclex-rn/lessons")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.portugal.nclexPrepUs"), locale)}
                        </Link>
                      </div>
                    ) : null}
                    {regionalStrip === "mexico" ? (
                      <div className="mb-3 space-y-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-4)_10%,var(--semantic-surface))] p-3">
                        <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                          {formatTitleCase(t("nav.country.mexico.stripLabel"), locale)}
                        </p>
                        <Link
                          href={localizeHref("/exams/mexico")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.mexico.examsHub"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/mexico/nurse-registration")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.mexico.nurseRegistration"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/mexico/how-to-become-a-nurse")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.mexico.howToBecome"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/mexico/nclex-for-mexican-nurses")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.mexico.nclexForMexicanNurses"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/mexico/work-abroad")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.mexico.workAbroad"), locale)}
                        </Link>
                        <Link
                          href={buildLocalizedMarketingPath("es", "/exams/mexico")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.mexico.spanishResources"), locale)}
                        </Link>
                        <Link
                          href={localizeHref(`/blog/tag/${encodeURIComponent(t("blog.country.mexico.tagName"))}`)}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.mexico.blog"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/us/rn/nclex-rn/lessons")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.country.mexico.nclexPrepUs"), locale)}
                        </Link>
                      </div>
                    ) : null}
                    {regionalStrip === "india" ? (
                      <div className="mb-3 space-y-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--semantic-surface))] p-3">
                        <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                          {formatTitleCase(t("nav.india.stripLabel"), locale)}
                        </p>
                        <Link
                          href={localizeHref("/exams/india")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.india.examsHub"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/india/aiims-nursing")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.india.aiimsNursing"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/india/nursing-exams")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.india.stateExams"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/exams/india#india-intl")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.india.workAbroad"), locale)}
                        </Link>
                        <Link
                          href={localizeHref("/us/rn/nclex-rn/lessons")}
                          className="flex rounded-lg px-2 py-2 text-[14px] font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {formatTitleCase(t("nav.india.nclexIndia"), locale)}
                        </Link>
                      </div>
                    ) : null}
                    {megaMenus.map((menu) => {
                      const expanded = mobileExpandedMega === menu.key;
                      return (
                        <div key={menu.key} className="rounded-xl border border-[var(--nav-border)] bg-[var(--surface)]">
                          {/* Accordion toggle */}
                          <button
                            type="button"
                            aria-expanded={expanded}
                            aria-controls={`mobile-mega-${menu.key}`}
                            data-active={isMegaMenuKeyActive(menu.key, strippedPath) || undefined}
                            className={`flex w-full items-center justify-between px-3 py-3 text-left text-[15px] font-semibold transition-colors ${isMegaMenuKeyActive(menu.key, strippedPath) ? "text-[var(--nav-link-active)]" : "text-[var(--nav-fg)]"}`}
                            onClick={() => setMobileExpandedMega(expanded ? null : menu.key)}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-opacity duration-100 ${isMegaMenuKeyActive(menu.key, strippedPath) ? "bg-[var(--text-accent)] opacity-100" : "opacity-0"}`}
                                aria-hidden
                              />
                              {menu.label}
                            </span>
                            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
                          </button>

                          {expanded ? (
                            <div id={`mobile-mega-${menu.key}`} className="space-y-4 border-t border-[var(--nav-border)] px-3 pb-4 pt-3">
                              {/* Primary hub link — featured entry block */}
                              <Link
                                href={localizeHref(menu.hubHref)}
                                className="group flex items-start justify-between gap-3 rounded-xl border border-[var(--accent-surface-a-border)] bg-[var(--accent-surface-a)] p-4 ring-1 ring-inset ring-[var(--accent-surface-a-border)] transition-colors hover:bg-[var(--accent-surface-a-border)]"
                                onClick={() => {
                                  trackClientEvent(PH.marketingNavClick, {
                                    actor: navActor,
                                    nav_id: `${menu.key}_hub`,
                                    surface: "site_header_mobile_mega",
                                    marketing_region: region,
                                  });
                                  setMobileOpen(false);
                                }}
                              >
                                <div className="min-w-0">
                                  <span className="mb-1.5 inline-flex items-center rounded-full border border-[var(--text-accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-accent)]">
                                    {menu.hubBadge ?? "Start Here"}
                                  </span>
                                  <span className="block text-[14px] font-semibold leading-snug text-[var(--nav-fg)]">
                                    {formatTitleCase(`${menu.label} Exam Hub`, locale)}
                                  </span>
                                  <span className="mt-0.5 block text-[12px] leading-snug text-[var(--nav-muted)]">
                                    {menu.hubDescription}
                                  </span>
                                </div>
                                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-accent)] transition-transform group-hover:translate-x-0.5" aria-hidden />
                              </Link>

                              {/* Secondary groups */}
                              {menu.groups.map((group) => (
                                <div key={`${menu.key}-${group.key}`}>
                                  <p className="mb-2.5 border-b border-[var(--nav-border)] pb-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--nav-muted)]">
                                    {formatEyebrow(group.heading, locale)}
                                  </p>
                                  <ul className="space-y-1">
                                    {group.links.map((link) => (
                                      <li key={link.key}>
                                        <Link
                                          href={localizeHref(link.href)}
                                          aria-current={isActivePath(strippedPath, link.href) ? "page" : undefined}
                                          className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[14px] transition-colors ${isActivePath(strippedPath, link.href) ? "bg-[var(--nav-active)] font-semibold text-[var(--nav-link-active)]" : "font-medium text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"}`}
                                          onClick={() => {
                                            trackClientEvent(PH.marketingNavClick, {
                                              actor: navActor,
                                              nav_id: `${menu.key}_${link.key}`,
                                              surface: "site_header_mobile_mega",
                                              marketing_region: region,
                                            });
                                            setMobileOpen(false);
                                          }}
                                        >
                                          <span
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full transition-opacity duration-100 ${isActivePath(strippedPath, link.href) ? "bg-[var(--text-accent)] opacity-100" : "opacity-0"}`}
                                            aria-hidden
                                          />
                                          {formatTitleCase(link.label, locale)}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}

                              {/* Regional alternatives — lower visual weight */}
                              {menu.regionLinks && menu.regionLinks.length > 0 ? (
                                <div className="border-t border-[var(--nav-border)] pt-3 space-y-3">
                                  {/* For Your Region — primary */}
                                  {menu.regionLinks.filter((rl) => rl.isPrimary).map((rl) => (
                                    <div key={rl.key}>
                                      <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-[var(--semantic-success)]">
                                        For Your Region
                                      </p>
                                      <Link
                                        href={localizeHref(rl.href)}
                                        className="flex items-center gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-success)_25%,transparent)] bg-[color-mix(in_srgb,var(--semantic-success)_8%,transparent)] px-2.5 py-2 text-[13px] font-semibold text-[var(--nav-fg)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-success)_14%,transparent)]"
                                        onClick={() => {
                                          trackClientEvent(PH.marketingNavClick, {
                                            actor: navActor,
                                            nav_id: `${menu.key}_${rl.key}`,
                                            surface: "site_header_mobile_mega_region",
                                            marketing_region: region,
                                          });
                                          setMobileOpen(false);
                                        }}
                                      >
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-success)]" aria-hidden />
                                        <span className="flex-1">{formatTitleCase(rl.label, locale)}</span>
                                        <span className="text-[11px] font-semibold text-[var(--semantic-success)]">Recommended</span>
                                      </Link>
                                    </div>
                                  ))}
                                  {/* Other Region — muted */}
                                  {menu.regionLinks.filter((rl) => !rl.isPrimary).map((rl) => (
                                    <div key={rl.key}>
                                      <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-[var(--nav-muted)]">
                                        Other Region
                                      </p>
                                      <Link
                                        href={localizeHref(rl.href)}
                                        className="flex items-center gap-1 px-1 py-1 text-[13px] font-medium text-[var(--nav-muted)] transition-colors hover:text-[var(--nav-fg)]"
                                        onClick={() => {
                                          trackClientEvent(PH.marketingNavClick, {
                                            actor: navActor,
                                            nav_id: `${menu.key}_${rl.key}`,
                                            surface: "site_header_mobile_mega_region",
                                            marketing_region: region,
                                          });
                                          setMobileOpen(false);
                                        }}
                                      >
                                        {formatTitleCase(rl.label, locale)}
                                        <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                    {marketingBrowseLinks.map((item) => (
                      <Link
                        key={item.key}
                        href={localizeHref(item.href)}
                        aria-current={isActivePath(strippedPath, item.matchBase) ? "page" : undefined}
                        className={`flex items-center gap-2 rounded-xl px-3 py-3 text-[15px] font-semibold transition-colors ${isActivePath(strippedPath, item.matchBase) ? "text-[var(--nav-link-active)]" : "text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"}`}
                        onClick={() => {
                          trackClientEvent(PH.marketingNavClick, {
                            actor: navActor,
                            nav_id: item.key,
                            surface: "site_header_mobile_drawer",
                            marketing_region: region,
                          });
                          setMobileOpen(false);
                        }}
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full transition-opacity duration-100 ${isActivePath(strippedPath, item.matchBase) ? "bg-[var(--text-accent)] opacity-100" : "opacity-0"}`}
                          aria-hidden
                        />
                        {item.label}
                      </Link>
                    ))}
                  </>
                )}
              </div>

              {!isAuthenticated ? (
                <div className="space-y-1">
                  <p className="px-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--nav-muted)]">
                    {t("nav.more")}
                  </p>
                  {mobileMoreNav.map((item) => (
                    <Link
                      key={item.key}
                      href={localizeHref(item.href)}
                      className="flex items-center rounded-xl px-3 py-3 text-[15px] font-medium text-[var(--nav-muted)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--nav-fg)]"
                      onClick={() => {
                        trackClientEvent(PH.marketingNavClick, {
                          actor: navActor,
                          nav_id: item.key,
                          surface: "site_header_mobile_drawer",
                          marketing_region: region,
                        });
                        setMobileOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}

              <div className="mt-1 flex flex-col gap-2 border-t border-[var(--header-border)] pt-5">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href={guestMarketingSignupHref}
                      className="nn-nav-cta inline-flex min-h-[48px] items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold"
                      onClick={() => setMobileOpen(false)}
                      aria-label="Start free account — nursing and healthcare exam prep"
                      title="Start free — no credit card required"
                    >
                      {formatTitleCase(t("nav.signup"), locale)}
                    </Link>
                    <Link
                      href={localizeHref(`/login?callbackUrl=${encodeURIComponent("/app")}`)}
                      className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-[var(--nav-border)] px-4 py-3 text-sm font-medium text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                      onClick={() => setMobileOpen(false)}
                      aria-label="Log in to your NurseNest account"
                    >
                      {formatTitleCase(t("nav.logIn"), locale)}
                    </Link>
                  </>
                ) : isLearnerAuthenticated ? (
                  <>
                    {learnerExamBadge ? (
                      <p className="rounded-lg border border-[var(--nav-border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--nav-muted)]">
                        {learnerExamBadge}
                      </p>
                    ) : null}
                    <Link
                      href={resumeStudyingCta?.href ?? "/app"}
                      className="nn-nav-cta inline-flex min-h-[48px] items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold"
                      onClick={() => setMobileOpen(false)}
                    >
                      {resumeStudyingCta?.label ?? formatTitleCase(CONTINUE_STUDYING_CTA, locale)}
                    </Link>
                    <Link href="/app" className={HEADER_SECONDARY_ACTION_CLASS} onClick={() => setMobileOpen(false)}>
                      {formatTitleCase(t("nav.dashboard"), locale)}
                    </Link>
                    <Link href="/app/account/overview" className={HEADER_SECONDARY_ACTION_CLASS} onClick={() => setMobileOpen(false)}>
                      {formatTitleCase(t("nav.account"), locale)}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={ADMIN_DASHBOARD_ROUTE}
                      className="nn-nav-cta inline-flex min-h-[48px] items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold"
                      onClick={() => {
                        closeMegaBeforeAuthNav();
                        setMobileOpen(false);
                      }}
                    >
                      {formatTitleCase(t("nav.admin"), locale)}
                    </Link>
                    <Link
                      href="/app"
                      className={HEADER_SECONDARY_ACTION_CLASS}
                      onClick={() => setMobileOpen(false)}
                    >
                      {formatTitleCase(t("nav.dashboard"), locale)}
                    </Link>
                    <Link
                      href="/app/account/overview"
                      className={HEADER_SECONDARY_ACTION_CLASS}
                      onClick={() => setMobileOpen(false)}
                    >
                      {formatTitleCase(t("nav.account"), locale)}
                    </Link>
                  </>
                )}
              </div>

              <p className="mb-2 nn-marketing-caption text-[var(--theme-muted-text)]">{t("nav.regionLabel")}</p>
              <div className={`mb-3 ${marketingRegionToggleShellMobileRow()}`} role="group" aria-label={t("nav.regionLabel")}>
                <button type="button" onClick={() => setRegionAndRefresh("US")} className={marketingRegionToggleSegment(region === "US", "mobile")}>
                  {t("home.region.us")}
                </button>
                <button type="button" onClick={() => setRegionAndRefresh("CA")} className={marketingRegionToggleSegment(region === "CA", "mobile")}>
                  {t("home.region.ca")}
                </button>
              </div>
              <p className="mb-3 flex items-start gap-2 nn-marketing-body-sm font-medium tracking-normal text-[var(--nav-muted)]">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {region === "US" ? t("home.region.usDesc") : t("home.region.caDesc")}
              </p>
              <hr className="my-3 border-[var(--header-border)]" />
              <p className="mb-2 nn-marketing-body-sm font-medium tracking-normal text-[var(--nav-muted)]">{t("nav.language")}</p>
              <div className="relative mb-3" ref={mobileLangRef}>
                <button
                  type="button"
                  onClick={() => setMobileLangOpen((o) => !o)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] px-3 py-2 nn-marketing-body-sm font-medium tracking-normal text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                >
                  {t("nav.language")}
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${mobileLangOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileLangOpen ? (
                  <div className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] p-1 shadow-[var(--shadow-elevated)]">
                    <MarketingLanguagePreferenceList
                      onDone={() => setMobileLangOpen(false)}
                      renderItem={({ code, name, flag, disabled, onSelect }) => (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={onSelect}
                          className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left nn-marketing-body-sm font-medium tracking-normal text-[var(--nav-fg)] hover:bg-[var(--nav-hover)] ${
                            code === locale ? "bg-[var(--nav-active)]" : ""
                          }`}
                        >
                          <span>{flag}</span>
                          {name}
                        </button>
                      )}
                    />
                  </div>
                ) : null}
              </div>

              <div className="mb-2">
                <ThemePicker
                  labels={{
                    navTheme: t("nav.theme"),
                    themeGroupLight: t("nav.themeGroupLight"),
                    themeGroupDark: t("nav.themeGroupDark"),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
