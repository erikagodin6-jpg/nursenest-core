"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { getNavChromeStyle, getNavChromeVars } from "@/lib/theme/nav-chrome";
import { ChevronDown, ChevronRight, MapPin, Menu, Settings, X } from "lucide-react";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { isStaffRole } from "@/lib/auth/staff-roles";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingRegionToggleWithRefresh } from "@/lib/region/use-marketing-region-toggle";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { MarketingHeaderUtilityStrip } from "@/components/layout/marketing-header-utility-strip";
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
import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";
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
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { CONTINUE_STUDYING_CTA, PRIMARY_CTA } from "@/lib/copy/cta-copy";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";

/** Long translated labels (e.g. pricing): wrap instead of forcing one line or overflow. */
const NAV_LINK_CLASS =
  "nn-marketing-body-sm nn-marketing-nav-link max-w-[10rem] text-balance break-words text-center leading-tight whitespace-normal font-semibold tracking-tight lg:max-w-[12rem]";
const HEADER_SECONDARY_ACTION_CLASS =
  "inline-flex min-h-[42px] items-center justify-center rounded-xl border border-[var(--nav-border)] px-3.5 py-2 text-sm font-medium text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]";
type ExamMenuKey = "rn" | "pn" | "np" | "allied";

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
    pn:     ["/us/lpn/", "/canada/rpn/"],
    np:     ["/us/np/", "/canada/np/"],
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

function examIndicatorLabel(country: LearnerCountry, tier: LearnerTier): string {
  const regionLabel = country === "CA" ? "Canada" : "US";
  if (tier === "LVN_LPN") return `${regionLabel} PN`;
  if (tier === "RPN") return `${regionLabel} RPN`;
  if (tier === "ALLIED") return `${regionLabel} Allied Health`;
  return `${regionLabel} ${tier}`;
}

function createLearnerNavLinks(locale: string, pathwayId: string | null): HeaderNavLink[] {
  const lessonsHref = pathwayId ? `/app/lessons?pathwayId=${encodeURIComponent(pathwayId)}` : "/app/lessons";
  const catHref = resolveStudySurfaceCatHref({
    pathwayId,
    availablePathwayIds: pathwayId ? [pathwayId] : [],
  });
  return [
    { key: "questions", href: "/app/questions", matchBase: "/app/questions", label: formatTitleCase("Questions", locale) },
    { key: "lessons", href: lessonsHref, matchBase: "/app/lessons", label: formatTitleCase("Lessons", locale) },
    { key: "cat", href: catHref, matchBase: "/app/practice-tests", label: formatTitleCase("CAT", locale) },
    { key: "flashcards", href: "/app/flashcards", matchBase: "/app/flashcards", label: formatTitleCase("Flashcards", locale) },
    { key: "progress", href: "/app/account/progress", matchBase: "/app/account/progress", label: formatTitleCase("Progress", locale) },
  ];
}

function createMegaMenus(region: "US" | "CA"): MegaMenuConfig[] {
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
      label: "PN / RPN",
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
      key: "allied",
      label: "Allied Health",
      hubHref: alliedHubHref,
      hubDescription: "Choose your profession-specific hub and jump into exam prep.",
      groups: [
        {
          key: "learn",
          heading: "Learn",
          links: [
            { key: "allied-lessons", label: "Lessons", href: alliedHubHref },
            { key: "allied-careers", label: "Career Pathways", href: alliedCareerPathwaysHref },
          ],
        },
        {
          key: "practice",
          heading: "Practice",
          links: [
            { key: "allied-questions", label: "Practice Questions", href: alliedQuestions(region) },
            { key: "allied-readiness", label: "CAT Readiness Exam", href: publicMarketingCatHrefForOffering(region, "allied") },
          ],
        },
        {
          key: "tools",
          heading: "Study Tools",
          links: [{ key: "allied-study-plan", label: "Build A Study Plan", href: studyPlanSignupHref }],
        },
      ],
    },
  ];
}

export function SiteHeader() {
  const { t, locale } = useMarketingI18n();
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
  const [langOpen, setLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMegaMenu, setOpenMegaMenu] = useState<ExamMenuKey | null>(null);
  const [resumeStudyingCta, setResumeStudyingCta] = useState<HeaderResumeCta>(null);
  const [contextBarCountryOpen, setContextBarCountryOpen] = useState(false);
  const [contextBarLangOpen, setContextBarLangOpen] = useState(false);
  const [contextBarProfOpen, setContextBarProfOpen] = useState(false);
  const [contextBarExamOpen, setContextBarExamOpen] = useState(false);
  const closeMegaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const globalRegion: GlobalRegionSlug = region === "CA" ? "canada" : "us";
  const globalLocale: GlobalLocaleCode = (locale as GlobalLocaleCode) ?? "en";

  const localizeHref = (href: string) => {
    const mapped = mapLegacyMarketingHref(href);
    if (mapped.startsWith("http://") || mapped.startsWith("https://")) return mapped;
    return withMarketingLocale(locale, mapped);
  };

  const clearMegaCloseTimer = () => {
    if (!closeMegaTimeoutRef.current) return;
    clearTimeout(closeMegaTimeoutRef.current);
    closeMegaTimeoutRef.current = null;
  };

  const scheduleMegaClose = () => {
    clearMegaCloseTimer();
    closeMegaTimeoutRef.current = setTimeout(() => setOpenMegaMenu(null), 120);
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
      if (!headerRef.current?.contains(e.target as Node)) setOpenMegaMenu(null);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMegaMenu(null);
        setLangOpen(false);
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
  const isAuthLoading = sessionStatus === "loading";
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
  const learnerLinks = useMemo(() => createLearnerNavLinks(locale, learnerPathwayId), [locale, learnerPathwayId]);
  const learnerExamBadge =
    isLearnerAuthenticated && user
      ? examIndicatorLabel(user.country as LearnerCountry, user.tier as LearnerTier)
      : null;
  const activeProfession: string = isLearnerAuthenticated && user?.tier
    ? (user.tier === "RPN" || user.tier === "LVN_LPN" ? "pn" : user.tier === "NP" ? "np" : user.tier === "ALLIED" ? "allied" : "rn")
    : "rn";
  const activeExam: string | null = null;
  const pricingNav = {
    key: "pricing",
    href: HUB.pricing,
    matchBase: HUB.pricing,
    label: formatTitleCase("Pricing", locale),
  };
  const openMega = megaMenus.find((menu) => menu.key === openMegaMenu) ?? null;

  const mobileMoreNav: { key: string; href: string; label: string }[] = [
    { key: "faq", href: "/faq", label: formatTitleCase(t("footer.faq"), locale) },
    { key: "pre-nursing", href: "/pre-nursing", label: formatTitleCase(t("nav.preNursing"), locale) },
    { key: "tools", href: HUB.tools, label: formatTitleCase(t("nav.tools"), locale) },
  ];

  const strippedPath = stripMarketingLocalePrefix(pathname).pathname;

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
      <MarketingHeaderUtilityStrip variant="dark-bar" />
      <header
        style={isLightTheme ? undefined : { ...navChromeStyle, boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.15)" }}
        className={`relative w-full border-b${isLightTheme ? " nn-header-logo-row nn-header-logo-row--scrolled" : ""}`}
        onMouseEnter={isMarketingNav ? clearMegaCloseTimer : undefined}
        onMouseLeave={isMarketingNav ? scheduleMegaClose : undefined}
      >
        <div className="nn-section-shell grid h-16 grid-cols-[auto,1fr,auto] items-center gap-4 sm:gap-6">
          <Link
            href={localizeHref("/")}
            className="nn-header-logo-link group flex min-w-0 shrink-0 items-center gap-2.5 overflow-visible bg-transparent pe-2.5"
            aria-label={t("brand.homeAriaLabel")}
          >
            <SiteBrandLogoMark exactSourceOnly />
          </Link>

          <nav
            aria-label={isLearnerAuthenticated ? "Learner navigation" : t("nav.marketingExplore")}
            className="hidden min-w-0 flex-1 items-center justify-center gap-6 lg:flex xl:gap-7"
          >
            {isAuthLoading ? (
              <div className="flex items-center gap-3" aria-hidden>
                {[0, 1, 2, 3].map((index) => (
                  <span key={index} className="h-4 w-16 animate-pulse rounded-full bg-[var(--nav-hover)]" />
                ))}
              </div>
            ) : isMarketingNav ? (
              <>
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
                        className={`${NAV_LINK_CLASS} inline-flex items-center gap-1 text-center`}
                        onClick={() => setOpenMegaMenu(expanded ? null : menu.key)}
                        onFocus={() => setOpenMegaMenu(menu.key)}
                      >
                        {menu.label}
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
                      </button>
                    </div>
                  );
                })}
                <Link
                  href={localizeHref(pricingNav.href)}
                  aria-current={isActivePath(strippedPath, pricingNav.matchBase) ? "page" : undefined}
                  className={`${NAV_LINK_CLASS} text-center`}
                  onClick={() =>
                    trackClientEvent(PH.marketingNavClick, {
                      actor: navActor,
                      nav_id: pricingNav.key,
                      surface: "site_header_desktop",
                      marketing_region: region,
                    })
                  }
                >
                  {pricingNav.label}
                </Link>
              </>
            ) : (
              <>
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
              </>
            )}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-3 sm:gap-4 lg:min-w-[12rem]">
            <div className="hidden min-w-0 items-center lg:flex">
              {isAuthLoading ? (
                <span className="inline-flex h-9 w-32 animate-pulse rounded-xl bg-[var(--nav-hover)]" aria-hidden />
              ) : !isAuthenticated ? (
                <div className="flex max-w-[100vw] items-center gap-2">
                  <Link href={localizeHref(`/login?callbackUrl=${encodeURIComponent("/app")}`)} className={HEADER_SECONDARY_ACTION_CLASS}>
                    {formatTitleCase("Login", locale)}
                  </Link>
                  <Link
                    href={localizeHref(`/signup?callbackUrl=${encodeURIComponent("/app")}`)}
                    className="nn-nav-cta inline-flex min-h-0 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold"
                  >
                    {formatTitleCase(PRIMARY_CTA, locale)}
                  </Link>
                </div>
              ) : isLearnerAuthenticated ? (
                <div className="flex items-center gap-2">
                  {learnerExamBadge ? (
                    <span className="hidden rounded-full border border-[var(--nav-border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--nav-muted)] xl:inline-flex">
                      {learnerExamBadge}
                    </span>
                  ) : null}
                  <Link
                    href={resumeStudyingCta?.href ?? "/app"}
                    className="nn-nav-cta inline-flex min-h-0 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold"
                  >
                    {resumeStudyingCta?.label ?? formatTitleCase(CONTINUE_STUDYING_CTA, locale)}
                  </Link>
                  <Link href="/app" className={HEADER_SECONDARY_ACTION_CLASS}>
                    {formatTitleCase("Dashboard", locale)}
                  </Link>
                  <Link href="/app/account/overview" className={HEADER_SECONDARY_ACTION_CLASS}>
                    {formatTitleCase("Account", locale)}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="nn-nav-cta inline-flex min-h-0 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold"
                  >
                    {formatTitleCase(t("nav.admin"), locale)}
                  </Link>
                  <Link href="/app" className={HEADER_SECONDARY_ACTION_CLASS}>
                    {formatTitleCase("Dashboard", locale)}
                  </Link>
                  <Link href="/app/account/overview" className={HEADER_SECONDARY_ACTION_CLASS}>
                    {formatTitleCase("Account", locale)}
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 lg:hidden">
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
        </div>
        {isMarketingNav && openMega ? (
          <div
            id={`mega-menu-${openMega.key}`}
            role="dialog"
            aria-label={`${openMega.label} menu`}
            className="absolute inset-x-0 top-full z-[120] hidden lg:block animate-[nn-mega-panel-enter_0.16s_cubic-bezier(0.22,0.61,0.36,1)_both]"
          >
            <div className="nn-section-shell pb-5 pt-1.5">
              <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-strong)] shadow-[var(--shadow-elevated)]">
                <div className="grid lg:grid-cols-[5fr_7fr]">

                  {/* ── Primary hub card (left) ── */}
                  <Link
                    href={localizeHref(openMega.hubHref)}
                    className="group flex flex-col justify-between gap-10 border-r border-[var(--border-subtle)] bg-[var(--accent-surface-a)] p-8 ring-1 ring-inset ring-[var(--accent-surface-a-border)] transition-[background-color,box-shadow] duration-150 ease-[var(--motion-ease)] hover:bg-[var(--accent-surface-a-border)] hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
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
                  <div className="p-8">
                    <div className="grid grid-cols-3 gap-x-6 gap-y-7">
                      {openMega.groups.map((group) => (
                        <div key={group.key}>
                          <p className="mb-3 border-b border-[var(--border-subtle)] pb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--theme-muted-text)]">
                            {formatEyebrow(group.heading, locale)}
                          </p>
                          <ul className="space-y-1.5">
                            {group.links.map((link) => (
                              <li key={link.key}>
                                <Link
                                  href={localizeHref(link.href)}
                                  aria-current={isActivePath(strippedPath, link.href) ? "page" : undefined}
                                  className={`flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm transition-[background-color,color,transform] duration-100 ease-[var(--motion-ease)] focus-visible:outline-2 focus-visible:outline-[var(--ring)] ${isActivePath(strippedPath, link.href) ? "bg-[var(--nav-active)] font-semibold text-[var(--nav-link-active)]" : "font-medium text-[var(--theme-heading-text)] hover:translate-x-0.5 hover:bg-[var(--nav-hover)] hover:text-[var(--nav-link-hover)]"}`}
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
      <GlobalContextBar
        region={globalRegion}
        locale={globalLocale}
        profession={activeProfession}
        exam={activeExam}
        onRegionClick={() => setMobileContextOpen(true)}
        onLanguageClick={() => setMobileContextOpen(true)}
        onProfessionClick={() => setMobileContextOpen(true)}
        onExamClick={() => setMobileContextOpen(true)}
      />

      {/* Mobile context/settings drawer — separate from main nav */}
      <MobileContextDrawer
        open={mobileContextOpen}
        onClose={() => setMobileContextOpen(false)}
        region={globalRegion}
        locale={globalLocale}
        profession={activeProfession}
        exam={activeExam}
        onRegionChange={(newRegion) => {
          if (newRegion === "us") setRegionAndRefresh("US");
          else if (newRegion === "canada") setRegionAndRefresh("CA");
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
                className="flex min-w-0 shrink-0 items-center overflow-hidden bg-transparent"
                aria-label={t("brand.homeAriaLabel")}
                onClick={() => setMobileOpen(false)}
              >
                <SiteBrandLogoMark exactSourceOnly />
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
                    <Link
                      href={localizeHref(pricingNav.href)}
                      aria-current={isActivePath(strippedPath, pricingNav.matchBase) ? "page" : undefined}
                      className={`flex items-center gap-2 rounded-xl px-3 py-3 text-[15px] font-semibold transition-colors ${isActivePath(strippedPath, pricingNav.matchBase) ? "text-[var(--nav-link-active)]" : "text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"}`}
                      onClick={() => {
                        trackClientEvent(PH.marketingNavClick, {
                          actor: navActor,
                          nav_id: pricingNav.key,
                          surface: "site_header_mobile_drawer",
                          marketing_region: region,
                        });
                        setMobileOpen(false);
                      }}
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-opacity duration-100 ${isActivePath(strippedPath, pricingNav.matchBase) ? "bg-[var(--text-accent)] opacity-100" : "opacity-0"}`}
                        aria-hidden
                      />
                      {pricingNav.label}
                    </Link>
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
                      href={localizeHref(`/signup?callbackUrl=${encodeURIComponent("/app")}`)}
                      className="nn-nav-cta inline-flex min-h-[48px] items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold"
                      onClick={() => setMobileOpen(false)}
                    >
                      {formatTitleCase(PRIMARY_CTA, locale)}
                    </Link>
                    <Link
                      href={localizeHref(`/login?callbackUrl=${encodeURIComponent("/app")}`)}
                      className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-[var(--nav-border)] px-4 py-3 text-sm font-medium text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {formatTitleCase("Login", locale)}
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
                      {formatTitleCase("Dashboard", locale)}
                    </Link>
                    <Link href="/app/account/overview" className={HEADER_SECONDARY_ACTION_CLASS} onClick={() => setMobileOpen(false)}>
                      {formatTitleCase("Account", locale)}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/admin"
                      className="nn-nav-cta inline-flex min-h-[48px] items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold"
                      onClick={() => setMobileOpen(false)}
                    >
                      {formatTitleCase(t("nav.admin"), locale)}
                    </Link>
                    <Link
                      href="/app"
                      className={HEADER_SECONDARY_ACTION_CLASS}
                      onClick={() => setMobileOpen(false)}
                    >
                      {formatTitleCase("Dashboard", locale)}
                    </Link>
                    <Link
                      href="/app/account/overview"
                      className={HEADER_SECONDARY_ACTION_CLASS}
                      onClick={() => setMobileOpen(false)}
                    >
                      {formatTitleCase("Account", locale)}
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
              <div className="relative mb-3" ref={langRef}>
                <button
                  type="button"
                  onClick={() => setLangOpen((o) => !o)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] px-3 py-2 nn-marketing-body-sm font-medium tracking-normal text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                >
                  {t("nav.language")}
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${langOpen ? "rotate-180" : ""}`} />
                </button>
                {langOpen ? (
                  <div className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] p-1 shadow-[var(--shadow-elevated)]">
                    <MarketingLanguagePreferenceList
                      onDone={() => setLangOpen(false)}
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
