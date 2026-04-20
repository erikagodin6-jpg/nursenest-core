"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import { getNavChromeStyle, getNavChromeVars } from "@/lib/theme/nav-chrome";
import { ChevronDown, ChevronRight, MapPin, Menu, Settings, User, X } from "lucide-react";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { isStaffRole } from "@/lib/auth/staff-roles";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useClientGlobalRegionCookie } from "@/lib/region/use-client-global-region";
import { useMarketingRegionToggleWithRefresh } from "@/lib/region/use-marketing-region-toggle";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { applyGlobalRegionSelection } from "@/lib/marketing/apply-global-region-selection";
import { effectiveMarketingHeaderGlobalRegion } from "@/lib/marketing/marketing-header-global-region";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HeaderBrandLockup } from "@/components/brand/header-brand-lockup";
import { ThemePicker } from "@/components/theme/theme-picker";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { MobileContextDrawer } from "@/components/layout/mobile-context-drawer";
import { REGION_CONFIG, type GlobalRegionSlug, type GlobalLocaleCode } from "@/lib/i18n/global-regions";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { useActiveNavContext } from "@/lib/navigation/use-active-nav-context";
import { buildMarketingMegaMenus, type ExamMenuKey } from "@/lib/navigation/marketing-mega-menu";
import { formatEyebrow, formatTitleCase } from "@/lib/format/text-case";
import { CONTINUE_STUDYING_CTA } from "@/lib/copy/cta-copy";
import { THEME_OPTIONS } from "@/lib/theme/theme-registry";
import { MarketingCountryHubStrip } from "@/components/marketing/marketing-country-hub-strip";
import { MarketingHeaderUtilityStrip } from "@/components/layout/marketing-header-utility-strip";
const ADMIN_DASHBOARD_ROUTE = "/admin" as const;

/** Primary filled header CTAs — white label on theme primary fill for consistent contrast. */
const HEADER_NAV_PRIMARY_CTA = "nn-nav-cta text-white";

/** Match legacy header rhythm: compact sizing with medium-weight copy, not extra-light pills. */
const NAV_LINK_CLASS =
  "nn-marketing-body-sm nn-marketing-nav-link inline-flex h-8 shrink-0 items-center justify-center whitespace-nowrap px-2 text-center font-medium leading-none tracking-normal xl:px-2.5";
/** Muted Learn / Track in the public “Learn → Practice → Track” row. */
const NAV_FLOW_SECONDARY_CLASS = `${NAV_LINK_CLASS} text-[var(--nav-muted)]`;
const NAV_TIER_LINK_CLASS =
  "nn-marketing-body-sm nn-marketing-nav-link inline-flex items-center justify-center whitespace-nowrap text-center font-medium leading-[1.2] tracking-normal";
const HEADER_SECONDARY_ACTION_CLASS =
  "inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--nav-border)] px-3 py-2 text-sm font-medium text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]";
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

function examIndicatorLabel(
  t: (key: string) => string,
  country: LearnerCountry,
  tier: LearnerTier,
  alliedProfessionKey?: string | null,
): string {
  const regionShort = country === "CA" ? t("nav.badge.regionCA") : t("nav.badge.regionUS");
  if (tier === "LVN_LPN") return `${regionShort} ${t("nav.badge.roleLvnLpn")}`;
  if (tier === "RPN") return `${regionShort} ${t("nav.badge.roleRpn")}`;
  if (tier === "ALLIED") {
    if (alliedProfessionKey) {
      const prof = ALLIED_PROFESSIONS.find((p) => p.professionKey === alliedProfessionKey);
      if (prof) {
        const match = prof.h1.match(/\(([A-Z/]+)\)/);
        return match ? match[1] : prof.professionKey.toUpperCase();
      }
    }
    return t("nav.badge.alliedHealth");
  }
  if (tier === "RN") return `${regionShort} ${t("nav.badge.roleRn")}`;
  if (tier === "NP") return `${regionShort} ${t("nav.badge.roleNp")}`;
  return `${regionShort} ${tier}`;
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
  const isSessionPending = sessionStatus === "loading";
  const user = session?.user;
  const { region, setRegion } = useNursenestRegion();
  const regionToggleAnalytics = useMemo(
    () => ({ currentRegion: region, surface: "site_header" as const }),
    [region],
  );
  const setRegionAndRefresh = useMarketingRegionToggleWithRefresh(setRegion, regionToggleAnalytics);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileContextOpen, setMobileContextOpen] = useState(false);
  const [mobileExpandedMega, setMobileExpandedMega] = useState<ExamMenuKey | "moreTracks" | null>(null);
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
  const [desktopMoreTracksOpen, setDesktopMoreTracksOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMegaMenu, setOpenMegaMenu] = useState<ExamMenuKey | null>(null);
  const [resumeStudyingCta, setResumeStudyingCta] = useState<HeaderResumeCta>(null);
  const closeMegaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desktopMoreRef = useRef<HTMLDivElement>(null);
  const desktopMoreTracksRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const strippedPath = stripMarketingLocalePrefix(pathname).pathname;
  const clientGlobalRegion = useClientGlobalRegionCookie();
  const effectiveGlobalRegion: GlobalRegionSlug = useMemo(
    () =>
      effectiveMarketingHeaderGlobalRegion({
        strippedPathname: strippedPath,
        globalRegionCookie: clientGlobalRegion,
        marketingExamRegion: region,
        sessionCountryUsCa: user?.country,
      }),
    [strippedPath, clientGlobalRegion, region, user?.country],
  );
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

  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!desktopMoreRef.current?.contains(e.target as Node)) setDesktopMoreOpen(false);
      if (!desktopMoreTracksRef.current?.contains(e.target as Node)) setDesktopMoreTracksOpen(false);
      if (!mobileLangRef.current?.contains(e.target as Node)) setMobileLangOpen(false);
      if (!headerRef.current?.contains(e.target as Node)) setOpenMegaMenu(null);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMegaMenu(null);
        setDesktopMoreOpen(false);
        setDesktopMoreTracksOpen(false);
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
    queueMicrotask(() => {
      setOpenMegaMenu(null);
      setMobileExpandedMega(null);
      setDesktopMoreOpen(false);
      setDesktopMoreTracksOpen(false);
      setMobileLangOpen(false);
    });
  }, [pathname, locale, region]);

  useEffect(
    () => () => {
      if (closeMegaTimeoutRef.current) {
        clearTimeout(closeMegaTimeoutRef.current);
      }
    },
    [],
  );

  const activeNav = useActiveNavContext();
  const megaMenus = useMemo(() => buildMarketingMegaMenus(region, t), [region, t]);
  const isAuthenticated = Boolean(sessionStatus === "authenticated" && user);
  const isAdminAuthenticated = Boolean(isAuthenticated && user?.role && isStaffRole(user.role));
  const isLearnerRole = Boolean(isAuthenticated && user?.role && !isStaffRole(user.role));
  /** Entitled learners: show Continue / Account / Log out in the marketing header (not a separate “learner nav” IA). */
  const isMarketingEntitledLearner =
    isLearnerRole && activeNav.entitlement === "entitled";
  const navActor = isAdminAuthenticated ? "admin" : isLearnerRole ? "learner" : "anonymous";
  const learnerExamBadge =
    isMarketingEntitledLearner && user
      ? examIndicatorLabel(t, user.country as LearnerCountry, user.tier as LearnerTier, (user as { alliedProfessionKey?: string | null }).alliedProfessionKey)
      : null;
  const activeProfession: string = isLearnerRole && user?.tier
    ? (user.tier === "RPN" || user.tier === "LVN_LPN" ? "pn" : user.tier === "NP" ? "np" : user.tier === "ALLIED" ? "allied" : "rn")
    : "rn";
  const activeExam: string | null = null;
  const marketingFlowLinks: HeaderNavLink[] = useMemo(
    () => [
      {
        key: "flow-learn",
        href: HUB.examLessons,
        matchBase: HUB.examLessons,
        label: formatTitleCase(t("nav.marketingFlow.learn"), locale),
      },
      {
        key: "flow-practice",
        href: HUB.questionBank,
        matchBase: HUB.questionBank,
        label: formatTitleCase(t("nav.marketingFlow.practice"), locale),
      },
      {
        key: "flow-track",
        href: `/signup?callbackUrl=${encodeURIComponent("/app/account/progress")}`,
        matchBase: "/signup",
        label: formatTitleCase(t("nav.marketingFlow.track"), locale),
      },
    ],
    [t, locale],
  );
  const marketingMoreLinks: HeaderNavLink[] = useMemo(
    () => [
      {
        key: "pricing",
        href: HUB.pricing,
        matchBase: "/pricing",
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
  const marketingDesktopPrimaryLinks: HeaderNavLink[] = useMemo(
    () =>
      marketingMoreLinks.filter(
        (item) => item.key === "pricing" || item.key === "blog" || item.key === "faq",
      ),
    [marketingMoreLinks],
  );
  const marketingDesktopOverflowLinks: HeaderNavLink[] = useMemo(
    () => marketingMoreLinks.filter((item) => item.key === "pre-nursing" || item.key === "tools"),
    [marketingMoreLinks],
  );
  const primaryMegaMenus = useMemo(() => megaMenus.filter((m) => m.key === "rn" || m.key === "pn" || m.key === "np"), [megaMenus]);
  const secondaryMegaMenus = useMemo(
    () => megaMenus.filter((m) => m.key === "newgrad" || m.key === "allied"),
    [megaMenus],
  );
  const openMega = megaMenus.find((menu) => menu.key === openMegaMenu) ?? null;

  const darkHeaderShadow = useMemo(() => {
    const inset = "inset 0 1px 0 0 rgba(255,255,255,0.15)";
    if (!isScrolled) return inset;
    return `${inset}, 0 12px 36px -14px color-mix(in srgb, var(--theme-heading-text) 18%, transparent)`;
  }, [isScrolled]);

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
    if (!isMarketingEntitledLearner) {
      queueMicrotask(() => setResumeStudyingCta(null));
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
  }, [isMarketingEntitledLearner, locale]);

  return (
    <div style={navChromeVars} className="sticky top-0 z-50" ref={headerRef}>
      {/*
        Keep enter animation on <header> only. `nn-header-animate-in` ends with a transform, which
        creates a fixed-position containing block — mobile drawers are siblings after </header> and
        must stay outside that subtree so `fixed inset-0` covers the viewport, not the header box.
      */}
      <header
        data-nn-nav-mode="public"
        style={isLightTheme ? undefined : { ...navChromeStyle, boxShadow: darkHeaderShadow }}
        className={`nn-header-animate-in relative flex w-full flex-col border-b${
          isLightTheme
            ? ` nn-header-logo-row${isScrolled ? " nn-header-logo-row--scrolled" : ""}`
            : " nn-header-dark-surface"
        } overflow-visible`}
        onMouseEnter={clearMegaCloseTimer}
        onMouseLeave={scheduleMegaClose}
      >
        {/*
          Desktop (`xl+`): one preferences rail for all themes — hubs + country + language + theme.
          Light: dark-bar surface; dark: recessive utility surface. Middle row keeps logo/links/auth only.
        */}
        <div className="nn-header-hide-until-xl w-full">
          <MarketingHeaderUtilityStrip
            variant={isLightTheme ? "dark-bar" : "standard"}
            leading={
              isLightTheme ? (
                <MarketingCountryHubStrip surface="darkUtility" />
              ) : (
                <MarketingCountryHubStrip />
              )
            }
          />
        </div>
        <div className="nn-section-shell flex flex-col overflow-visible">
          {/* ── Mobile brand row ── */}
          <div className="nn-header-mobile-only-flex min-h-[4.5rem] items-center gap-2 overflow-visible border-b border-[var(--header-border)] pt-[env(safe-area-inset-top,0px)] sm:gap-4">
            <div className="flex min-w-0 shrink items-center gap-2 overflow-hidden">
              <Link
                href={localizeHref("/")}
                className="nn-header-logo-link group flex min-w-0 shrink-0 items-center overflow-visible bg-transparent"
                aria-label={t("brand.homeAriaLabel")}
              >
                <HeaderBrandLockup />
              </Link>
              {isMarketingEntitledLearner && learnerExamBadge ? (
                <span
                  className="nn-header-tier-pill nn-header-tier-pill--compact min-w-0 max-w-[40vw] truncate sm:max-w-[11rem]"
                  aria-label={`Your pathway: ${learnerExamBadge}`}
                >
                  {learnerExamBadge}
                </span>
              ) : null}
            </div>
            {/* Guests: Login + primary CTA live in this row so they are never only in a secondary strip or hamburger. */}
            {isSessionPending ? (
              <div
                className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2"
                aria-busy="true"
                aria-label={t("nav.logIn")}
              >
                <div className="h-11 w-[4.5rem] shrink-0 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--nav-fg)_12%,var(--nav-border))] sm:w-20" />
                <div className="h-11 min-w-[5rem] max-w-[52%] flex-1 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--nav-fg)_12%,var(--nav-border))] sm:max-w-none sm:flex-initial" />
              </div>
            ) : !isAuthenticated ? (
              <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2">
                <Link
                  href={localizeHref(`/login?callbackUrl=${encodeURIComponent("/app")}`)}
                  className="inline-flex min-h-[44px] max-w-[38%] shrink-0 items-center justify-center rounded-xl border border-[var(--nav-border)] px-2 py-2 text-xs font-medium text-[var(--nav-fg)] hover:bg-[var(--nav-hover)] sm:max-w-none sm:px-3 sm:text-sm"
                  onClick={closeMegaBeforeAuthNav}
                  aria-label="Log in to your NurseNest account"
                >
                  {formatTitleCase(t("nav.logIn"), locale)}
                </Link>
                <Link
                  href={guestMarketingSignupHref}
                  className={`${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-[44px] min-w-0 max-w-[52%] shrink items-center justify-center rounded-xl px-2.5 py-2 text-xs font-medium sm:max-w-none sm:px-4 sm:text-sm`}
                  onClick={closeMegaBeforeAuthNav}
                  aria-label="Start free account — nursing and healthcare exam prep"
                  title="Start free — no credit card required"
                >
                  {formatTitleCase(t("nav.signup"), locale)}
                </Link>
              </div>
            ) : null}
            {/* Mobile controls — only below `md` (tablet+ uses desktop chrome) */}
            <div className={`nn-header-mobile-only-flex shrink-0 items-center gap-2 ${isAuthenticated ? "ml-auto" : ""}`}>
              <button
                type="button"
                onClick={() => setMobileContextOpen(true)}
                className="nn-header-mobile-only-inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--nn-nav-border)] bg-transparent p-0 text-[var(--nn-nav-fg)] transition-colors hover:bg-[var(--nn-nav-hover-bg)]"
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
            <div className="nn-header-mobile-only-flex relative z-[130] items-center justify-end gap-2 border-b border-[var(--header-border)] bg-[var(--nav-bg)] px-4 py-2.5">
              {isMarketingEntitledLearner ? (
                <div className="flex w-full min-w-0 items-center justify-end gap-2">
                  <Link
                    href={resumeStudyingCta?.href ?? "/app"}
                    className={`${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm font-medium sm:flex-initial sm:px-4`}
                  >
                    {resumeStudyingCta?.label ?? formatTitleCase(CONTINUE_STUDYING_CTA, locale)}
                  </Link>
                  <Link href="/app" className={HEADER_SECONDARY_ACTION_CLASS}>
                    {formatTitleCase(t("nav.dashboard"), locale)}
                  </Link>
                  <SignOutButton
                    className={`${HEADER_SECONDARY_ACTION_CLASS} shrink-0 px-2.5 text-xs font-semibold sm:text-sm`}
                    redirectTo={withMarketingLocale(locale, "/login")}
                  />
                </div>
              ) : isAdminAuthenticated ? (
                <div className="flex w-full min-w-0 items-center justify-end gap-2">
                  <Link
                    href={ADMIN_DASHBOARD_ROUTE}
                    className={`${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm font-medium sm:flex-initial sm:px-4`}
                    onClick={closeMegaBeforeAuthNav}
                  >
                    {formatTitleCase(t("nav.admin"), locale)}
                  </Link>
                  <Link href="/app" className={HEADER_SECONDARY_ACTION_CLASS}>
                    {formatTitleCase(t("nav.dashboard"), locale)}
                  </Link>
                  <SignOutButton
                    className={`${HEADER_SECONDARY_ACTION_CLASS} shrink-0 px-2.5 text-xs font-semibold sm:text-sm`}
                    redirectTo={withMarketingLocale(locale, "/login")}
                  />
                </div>
              ) : (
                <div className="flex w-full min-w-0 items-center justify-end gap-2">
                  <Link
                    href={localizeHref(HUB.pricing)}
                    className={`${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm font-medium sm:flex-initial sm:px-4`}
                    onClick={closeMegaBeforeAuthNav}
                  >
                    {formatTitleCase(t("nav.pricing"), locale)}
                  </Link>
                  <Link href="/app" className={HEADER_SECONDARY_ACTION_CLASS}>
                    {formatTitleCase(t("nav.dashboard"), locale)}
                  </Link>
                  <SignOutButton
                    className={`${HEADER_SECONDARY_ACTION_CLASS} shrink-0 px-2.5 text-xs font-semibold sm:text-sm`}
                    redirectTo={withMarketingLocale(locale, "/login")}
                  />
                </div>
              )}
            </div>
          ) : null}

          {/* ── Desktop main header row: left logo | center core public links | right utilities + auth ── */}
          <div className="nn-header-desktop-grid overflow-visible">
            <div className="flex shrink-0 items-center gap-2.5">
              <Link
                href={localizeHref("/")}
                className="nn-header-logo-link group flex shrink-0 items-center overflow-visible bg-transparent"
                aria-label={t("brand.homeAriaLabel")}
              >
                <HeaderBrandLockup />
              </Link>
              {isMarketingEntitledLearner && learnerExamBadge ? (
                <span className="nn-header-tier-pill shrink-0" aria-label={`Your pathway: ${learnerExamBadge}`}>
                  {learnerExamBadge}
                </span>
              ) : null}
            </div>

            <nav
              aria-label={t("nav.marketingExplore")}
              className="flex min-w-0 flex-1 items-center justify-center gap-0.5 xl:gap-1"
            >
              {marketingDesktopPrimaryLinks.map((item) => (
                <Link
                  key={item.key}
                  href={localizeHref(item.href)}
                  aria-current={isActivePath(strippedPath, item.matchBase) ? "page" : undefined}
                  className={NAV_FLOW_SECONDARY_CLASS}
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
              <div className="relative shrink-0" ref={desktopMoreRef}>
                <button
                  type="button"
                  className={`${NAV_LINK_CLASS} inline-flex items-center gap-0.5 whitespace-nowrap`}
                  aria-expanded={desktopMoreOpen}
                  aria-haspopup="menu"
                  onClick={() => setDesktopMoreOpen((o) => !o)}
                >
                  {formatTitleCase(t("nav.marketingMore"), locale)}
                  <ChevronDown className={`h-3.5 w-3.5 shrink-0 opacity-70 ${desktopMoreOpen ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {desktopMoreOpen ? (
                  <div
                    role="menu"
                    className="absolute end-0 z-[130] mt-2 min-w-[12rem] rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] py-1 shadow-[var(--shadow-card-hover)]"
                  >
                    {marketingDesktopOverflowLinks.map((item) => (
                      <Link
                        key={item.key}
                        role="menuitem"
                        href={localizeHref(item.href)}
                        aria-current={isActivePath(strippedPath, item.matchBase) ? "page" : undefined}
                        className="flex items-center px-3 py-2.5 text-sm font-normal text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                        onClick={() => {
                          setDesktopMoreOpen(false);
                          trackClientEvent(PH.marketingNavClick, {
                            actor: navActor,
                            nav_id: item.key,
                            surface: "site_header_desktop_more",
                            marketing_region: region,
                          });
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </nav>

            <div className="relative z-[130] flex shrink-0 items-center justify-end gap-2 xl:gap-2.5">
              {isSessionPending ? (
                <div className="flex shrink-0 items-center gap-2" aria-busy="true" aria-label={t("nav.logIn")}>
                  <div className="h-10 w-20 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--nav-fg)_12%,var(--nav-border))]" />
                  <div className="h-10 w-28 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--nav-fg)_12%,var(--nav-border))]" />
                </div>
              ) : !isAuthenticated ? (
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={localizeHref(`/login?callbackUrl=${encodeURIComponent("/app")}`)}
                    className={`${HEADER_SECONDARY_ACTION_CLASS} shrink-0 whitespace-nowrap`}
                    onClick={closeMegaBeforeAuthNav}
                    aria-label="Log in to your NurseNest account"
                  >
                    {formatTitleCase(t("nav.logIn"), locale)}
                  </Link>
                  <Link
                    href={guestMarketingSignupHref}
                    className={`${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-0 shrink-0 items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium`}
                    onClick={closeMegaBeforeAuthNav}
                    aria-label="Start free account — nursing and healthcare exam prep"
                    title="Start free — no credit card required"
                  >
                    {formatTitleCase(t("nav.signup"), locale)}
                  </Link>
                </div>
              ) : isMarketingEntitledLearner ? (
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                  <Link
                    href={resumeStudyingCta?.href ?? "/app"}
                    className={`${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-0 shrink-0 items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium sm:px-4`}
                  >
                    {resumeStudyingCta?.label ?? formatTitleCase(CONTINUE_STUDYING_CTA, locale)}
                  </Link>
                  <Link
                    href="/app/account/overview"
                    className="nn-header-account-trigger gap-1.5 px-2.5 sm:px-3"
                    aria-label={formatTitleCase(t("nav.account"), locale)}
                  >
                    <User className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                    <span className="hidden 2xl:inline whitespace-nowrap">{formatTitleCase(t("nav.account"), locale)}</span>
                  </Link>
                  <SignOutButton
                    className={`${HEADER_SECONDARY_ACTION_CLASS} inline-flex min-h-0 shrink-0 whitespace-nowrap px-3 py-2`}
                    redirectTo={withMarketingLocale(locale, "/login")}
                  />
                </div>
              ) : isAdminAuthenticated ? (
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={ADMIN_DASHBOARD_ROUTE}
                    className={`${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-0 shrink-0 items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium`}
                    onClick={closeMegaBeforeAuthNav}
                  >
                    {formatTitleCase(t("nav.admin"), locale)}
                  </Link>
                  <Link href="/app" className={`${HEADER_SECONDARY_ACTION_CLASS} shrink-0 whitespace-nowrap`}>
                    {formatTitleCase(t("nav.dashboard"), locale)}
                  </Link>
                  <SignOutButton
                    className={`${HEADER_SECONDARY_ACTION_CLASS} inline-flex min-h-0 shrink-0 whitespace-nowrap px-3 py-2`}
                    redirectTo={withMarketingLocale(locale, "/login")}
                  />
                </div>
              ) : (
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={localizeHref(HUB.pricing)}
                    className={`${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-0 shrink-0 items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium`}
                    onClick={closeMegaBeforeAuthNav}
                  >
                    {formatTitleCase(t("nav.pricing"), locale)}
                  </Link>
                  <Link href="/app" className={`${HEADER_SECONDARY_ACTION_CLASS} shrink-0 whitespace-nowrap`}>
                    {formatTitleCase(t("nav.dashboard"), locale)}
                  </Link>
                  <SignOutButton
                    className={`${HEADER_SECONDARY_ACTION_CLASS} inline-flex min-h-0 shrink-0 whitespace-nowrap px-3 py-2`}
                    redirectTo={withMarketingLocale(locale, "/login")}
                  />
                </div>
              )}
            </div>
          </div>{/* /nav-row */}
        </div>{/* /shell */}
        <div className="nn-header-hide-until-xl w-full border-t border-[var(--nn-nav-border)] nn-header-nav-row">
          <div className="nn-section-shell flex min-h-[36px] flex-wrap items-center gap-x-0.5 gap-y-0 py-0 md:min-h-[40px] md:py-0.5 lg:gap-x-0.5">
            <nav
              aria-label={t("nav.marketingExplore")}
              className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-0 xl:gap-0.5"
            >
              {primaryMegaMenus.map((menu) => {
                const expanded = openMegaMenu === menu.key;
                return (
                  <div
                    key={menu.key}
                    className="relative"
                    onMouseEnter={() => {
                      setDesktopMoreTracksOpen(false);
                      setOpenMegaMenu(menu.key);
                    }}
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
              {secondaryMegaMenus.length > 0 ? (
                <div className="relative" ref={desktopMoreTracksRef}>
                  <button
                    type="button"
                    aria-expanded={desktopMoreTracksOpen}
                    className={`${NAV_TIER_LINK_CLASS} inline-flex items-center gap-1 text-center text-[var(--nav-muted)]`}
                    onClick={() => setDesktopMoreTracksOpen((o) => !o)}
                  >
                    {formatTitleCase(t("nav.examTracks.more"), locale)}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${desktopMoreTracksOpen ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                  {desktopMoreTracksOpen ? (
                    <div
                      role="menu"
                      className="absolute start-0 z-[130] mt-2 min-w-[14rem] rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] py-1 shadow-[var(--shadow-card-hover)]"
                    >
                      {secondaryMegaMenus.map((menu) => (
                        <button
                          key={menu.key}
                          type="button"
                          role="menuitem"
                          className="flex w-full items-center px-3 py-2.5 text-left text-sm font-normal text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                          onClick={() => {
                            setOpenMegaMenu(menu.key);
                            setDesktopMoreTracksOpen(false);
                            trackClientEvent(PH.marketingNavClick, {
                              actor: navActor,
                              nav_id: `exam_tracks_more_${menu.key}`,
                              surface: "site_header_desktop",
                              marketing_region: region,
                            });
                          }}
                        >
                          {menu.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </nav>
          </div>
        </div>
        {openMega ? (
          <div
            id={`mega-menu-${openMega.key}`}
            role="dialog"
            aria-label={`${openMega.label} menu`}
            className="nn-header-hide-until-xl absolute inset-x-0 top-full z-[120] animate-[nn-mega-panel-enter_var(--brand-motion-normal)_var(--brand-motion-ease-luxury)_forwards]"
          >
            <div className="nn-section-shell pb-5 pt-1.5">
              <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-strong)] shadow-[var(--shadow-elevated)] ring-1 ring-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border-subtle))]">
                <div className="grid md:grid-cols-[5fr_7fr]">

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
                      <span className="mb-3 inline-flex items-center rounded-full border border-[var(--text-accent)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-accent)]">
                        {openMega.hubBadge ?? t("nav.mega.startHere")}
                      </span>
                      <h3 className="text-lg font-medium leading-snug text-[var(--theme-heading-text)]">
                        {formatTitleCase(`${openMega.label} — ${t("nav.mega.examHubSuffix")}`, locale)}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)]">
                        {openMega.hubDescription}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-[var(--text-accent)] transition-[gap] group-hover:gap-2">
                      {formatTitleCase(t("nav.mega.openHub"), locale)}
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>

                  {/* ── Secondary groups (right) ── */}
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
                                  className={`flex w-full items-center justify-start gap-1.5 rounded-lg px-2 py-2 text-left text-sm tracking-[0.01em] transition-[background-color,color,transform] duration-100 ease-[var(--motion-ease)] focus-visible:outline-2 focus-visible:outline-[var(--ring)] ${isActivePath(strippedPath, link.href) ? "bg-[var(--nav-active)] font-semibold text-[var(--nav-link-active)]" : "font-normal text-[var(--theme-heading-text)] hover:translate-x-0.5 hover:bg-[var(--nav-hover)] hover:text-[var(--nav-link-hover)]"}`}
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
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-100 ${isActivePath(strippedPath, link.href) ? "bg-[var(--text-accent)]" : "bg-transparent"}`}
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
                  </div>

                </div>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {/* Mobile context/settings drawer — separate from main nav */}
      <MobileContextDrawer
        open={mobileContextOpen}
        onClose={() => setMobileContextOpen(false)}
        region={effectiveGlobalRegion}
        locale={globalLocale}
        profession={activeProfession}
        exam={activeExam}
        countrySelectorIncludeUnpublished={isAdminAuthenticated}
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

      {mobileOpen && typeof document !== "undefined"
        ? createPortal(
            <div className="nn-header-overlay-mobile-only fixed inset-0 z-[200] animate-[nn-overlay-enter_0.24s_ease_forwards]">
          <button type="button" className="absolute inset-0 bg-black/56" aria-label={t("nav.closeMenu")} onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-x-0 top-0 flex h-[100dvh] max-h-[100dvh] flex-col border-b border-[var(--nav-border)] bg-[var(--nav-bg)] text-[var(--nav-fg)] shadow-[var(--shadow-elevated)] animate-[nn-drawer-slide-in_0.28s_cubic-bezier(0.25,0.1,0.25,1)_forwards]">
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
                <p className="px-2 text-[11px] font-medium uppercase tracking-widest text-[var(--nav-muted)]">
                  {t("nav.marketingExplore")}
                </p>
                <>
                  {(() => {
                      const flowPractice = marketingFlowLinks.find((l) => l.key === "flow-practice");
                      const flowRest = marketingFlowLinks.filter((l) => l.key !== "flow-practice");
                      return (
                        <>
                          {flowPractice ? (
                            <Link
                              key={flowPractice.key}
                              href={localizeHref(flowPractice.href)}
                              aria-current={isActivePath(strippedPath, flowPractice.matchBase) ? "page" : undefined}
                              className={`${HEADER_NAV_PRIMARY_CTA} mb-2 flex min-h-[48px] w-full items-center justify-center rounded-xl px-4 py-3 text-[15px] font-semibold`}
                              onClick={() => {
                                trackClientEvent(PH.marketingNavClick, {
                                  actor: navActor,
                                  nav_id: flowPractice.key,
                                  surface: "site_header_mobile_drawer",
                                  marketing_region: region,
                                });
                                setMobileOpen(false);
                              }}
                            >
                              {flowPractice.label}
                            </Link>
                          ) : null}
                          <div className="mb-3 grid grid-cols-2 gap-2">
                            {flowRest.map((item) => (
                              <Link
                                key={item.key}
                                href={localizeHref(item.href)}
                                aria-current={isActivePath(strippedPath, item.matchBase) ? "page" : undefined}
                                className={`flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--nav-border)] px-2 py-2.5 text-center text-[13px] font-medium leading-snug text-[var(--nav-muted)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--nav-fg)] ${isActivePath(strippedPath, item.matchBase) ? "border-[var(--text-accent)] text-[var(--nav-link-active)]" : ""}`}
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
                        </>
                      );
                    })()}
                    {primaryMegaMenus.map((menu) => {
                      const expanded = mobileExpandedMega === menu.key;
                      return (
                        <div key={menu.key} className="rounded-xl border border-[var(--nav-border)] bg-[var(--surface)]">
                          {/* Accordion toggle */}
                          <button
                            type="button"
                            aria-expanded={expanded}
                            aria-controls={`mobile-mega-${menu.key}`}
                            data-active={isMegaMenuKeyActive(menu.key, strippedPath) || undefined}
                            className={`flex w-full items-center justify-between px-3 py-3 text-left text-[15px] tracking-[0.01em] transition-colors ${isMegaMenuKeyActive(menu.key, strippedPath) ? "font-semibold text-[var(--nav-link-active)]" : "font-normal text-[var(--nav-fg)]"}`}
                            onClick={() => setMobileExpandedMega(expanded ? null : menu.key)}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-100 ${isMegaMenuKeyActive(menu.key, strippedPath) ? "bg-[var(--text-accent)]" : "bg-transparent"}`}
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
                                  <span className="mb-1.5 inline-flex items-center rounded-full border border-[var(--text-accent)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-accent)]">
                                    {menu.hubBadge ?? t("nav.mega.startHere")}
                                  </span>
                                  <span className="block text-[14px] font-medium leading-snug text-[var(--nav-fg)]">
                                    {formatTitleCase(`${menu.label} — ${t("nav.mega.examHubSuffix")}`, locale)}
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
                                          className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[14px] tracking-[0.01em] transition-colors ${isActivePath(strippedPath, link.href) ? "bg-[var(--nav-active)] font-semibold text-[var(--nav-link-active)]" : "font-normal text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"}`}
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
                                            className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-100 ${isActivePath(strippedPath, link.href) ? "bg-[var(--text-accent)]" : "bg-transparent"}`}
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
                          ) : null}
                        </div>
                      );
                    })}
                    {secondaryMegaMenus.length > 0 ? (
                      <div className="rounded-xl border border-[var(--nav-border)] bg-[var(--surface)]">
                        <button
                          type="button"
                          aria-expanded={mobileExpandedMega === "moreTracks"}
                          aria-controls="mobile-mega-more-tracks"
                          className="flex w-full items-center justify-between px-3 py-3 text-left text-[15px] font-normal tracking-[0.01em] text-[var(--nav-muted)] transition-colors"
                          onClick={() => setMobileExpandedMega(mobileExpandedMega === "moreTracks" ? null : "moreTracks")}
                        >
                          <span>{formatTitleCase(t("nav.examTracks.more"), locale)}</span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 transition-transform ${mobileExpandedMega === "moreTracks" ? "rotate-180" : ""}`}
                            aria-hidden
                          />
                        </button>
                        {mobileExpandedMega === "moreTracks" ? (
                          <div
                            id="mobile-mega-more-tracks"
                            className="space-y-2 border-t border-[var(--nav-border)] px-3 pb-4 pt-3"
                          >
                            {secondaryMegaMenus.map((menu) => (
                              <Link
                                key={menu.key}
                                href={localizeHref(menu.hubHref)}
                                className="flex flex-col gap-1 rounded-xl border border-[var(--accent-surface-a-border)] bg-[var(--accent-surface-a)] px-3 py-3 text-left ring-1 ring-inset ring-[var(--accent-surface-a-border)] transition-colors hover:bg-[var(--accent-surface-a-border)]"
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
                                <span className="text-[14px] font-semibold text-[var(--nav-fg)]">{menu.label}</span>
                                <span className="text-[12px] leading-snug text-[var(--nav-muted)]">{menu.hubDescription}</span>
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="space-y-1 border-t border-[var(--header-border)] pt-3">
                      <p className="px-2 text-[11px] font-medium uppercase tracking-widest text-[var(--nav-muted)]">
                        {formatTitleCase(t("nav.marketingMore"), locale)}
                      </p>
                      {marketingMoreLinks.map((item) => (
                        <Link
                          key={item.key}
                          href={localizeHref(item.href)}
                          aria-current={isActivePath(strippedPath, item.matchBase) ? "page" : undefined}
                          className={`flex items-center gap-2 rounded-xl px-3 py-3 text-[15px] font-medium transition-colors ${isActivePath(strippedPath, item.matchBase) ? "font-semibold text-[var(--nav-link-active)]" : "font-medium text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"}`}
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
                            className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-100 ${isActivePath(strippedPath, item.matchBase) ? "bg-[var(--text-accent)]" : "bg-transparent"}`}
                            aria-hidden
                          />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                </>
              </div>

              <div className="mt-1 flex flex-col gap-2 border-t border-[var(--header-border)] pt-5">
                {isSessionPending ? (
                  <div className="flex flex-col gap-2" aria-busy="true" aria-label={t("nav.logIn")}>
                    <div className="h-12 w-full animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--nav-fg)_12%,var(--nav-border))]" />
                    <div className="h-11 w-full animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--nav-fg)_12%,var(--nav-border))]" />
                  </div>
                ) : !isAuthenticated ? (
                  <>
                    <Link
                      href={guestMarketingSignupHref}
                      className={`${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-[48px] items-center justify-center rounded-xl px-4 py-3 text-sm font-medium`}
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
                ) : isMarketingEntitledLearner ? (
                  <>
                    {learnerExamBadge ? (
                      <div className="nn-header-tier-pill flex w-full justify-center py-2.5" role="status">
                        {learnerExamBadge}
                      </div>
                    ) : null}
                    <Link
                      href={resumeStudyingCta?.href ?? "/app"}
                      className={`${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-[48px] items-center justify-center rounded-xl px-4 py-3 text-sm font-medium`}
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
                    <SignOutButton
                      className="mt-3 w-full min-h-[48px] rounded-xl border border-[var(--nav-border)] px-4 py-3 text-center text-sm font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                      onBeforeSignOut={() => setMobileOpen(false)}
                      redirectTo={withMarketingLocale(locale, "/login")}
                    />
                  </>
                ) : isAdminAuthenticated ? (
                  <>
                    <Link
                      href={ADMIN_DASHBOARD_ROUTE}
                      className={`${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-[48px] items-center justify-center rounded-xl px-4 py-3 text-sm font-medium`}
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
                    <SignOutButton
                      className="mt-3 w-full min-h-[48px] rounded-xl border border-[var(--nav-border)] px-4 py-3 text-center text-sm font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                      onBeforeSignOut={() => setMobileOpen(false)}
                      redirectTo={withMarketingLocale(locale, "/login")}
                    />
                  </>
                ) : (
                  <>
                    <Link
                      href={localizeHref(HUB.pricing)}
                      className={`${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-[48px] items-center justify-center rounded-xl px-4 py-3 text-sm font-medium`}
                      onClick={() => {
                        closeMegaBeforeAuthNav();
                        setMobileOpen(false);
                      }}
                    >
                      {formatTitleCase(t("nav.pricing"), locale)}
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
                    <SignOutButton
                      className="mt-3 w-full min-h-[48px] rounded-xl border border-[var(--nav-border)] px-4 py-3 text-center text-sm font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                      onBeforeSignOut={() => setMobileOpen(false)}
                      redirectTo={withMarketingLocale(locale, "/login")}
                    />
                  </>
                )}
              </div>

              <p className="mb-3 flex items-start gap-2 nn-marketing-body-sm text-[var(--nav-muted)]">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--theme-muted-text)]" aria-hidden />
                <span>
                  {t("nav.regionLabel")}:{" "}
                  <span className="font-medium text-[var(--nav-fg)]">
                    {effectiveGlobalRegion === "canada"
                      ? formatTitleCase(t("home.region.ca"), locale)
                      : effectiveGlobalRegion === "us"
                        ? formatTitleCase(t("home.region.us"), locale)
                        : REGION_CONFIG[effectiveGlobalRegion].displayName}
                  </span>
                  . {t("nav.regionChangeHint")}
                </span>
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
        </div>,
            document.body,
          )
        : null}
    </div>
  );
}
