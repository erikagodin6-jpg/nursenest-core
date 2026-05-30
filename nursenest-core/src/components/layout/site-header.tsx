"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type AnchorHTMLAttributes, type ComponentType } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { getNavChrome, getNavChromeVars } from "@/lib/theme/nav-chrome";
import {
  BarChart3,
  Bell,
  BookOpenCheck,
  Bookmark,
  ChevronDown,
  CreditCard,
  HelpCircle,
  History,
  LayoutDashboard,
  LineChart,
  MapPin,
  Menu,
  Palette,
  Settings,
  User,
  X,
} from "lucide-react";
import { mapLegacyMarketingHref } from "@/lib/marketing/marketing-chrome-href";
import { isStaffRole, shouldShowAdminDashboardNav } from "@/lib/auth/staff-roles";
import { ADMIN_DASHBOARD_HREF, navigateAdminDashboardHard } from "@/lib/auth/admin-dashboard-link";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useClientGlobalRegionCookie } from "@/lib/region/use-client-global-region";
import { useMarketingRegionToggleWithRefresh } from "@/lib/region/use-marketing-region-toggle";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { effectiveMarketingHeaderGlobalRegion } from "@/lib/marketing/marketing-header-global-region";
import { resolveMarketingAuthRedirectTarget } from "@/lib/auth/post-login-resume-path";
import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HeaderBrandLockup } from "@/components/brand/header-brand-lockup";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import type { MobileContextDrawerProps } from "@/components/layout/mobile-context-drawer";
import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";
import { HUB, signupWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { useActiveNavContext } from "@/lib/navigation/use-active-nav-context";
import {
  marketingHeaderLearnPracticeFlowDestinations,
  type MarketingHeaderFlowTier,
} from "@/lib/navigation/canonical-destinations";
import { strippedPathActivatesMegaMenuKey, type MarketingPathwayMegaMenuKey } from "@/lib/navigation/marketing-mega-menu-active-prefixes";
import { buildMarketingTierHubStrip } from "@/lib/navigation/marketing-tier-hub-strip";
import { formatTitleCase } from "@/lib/format/text-case";
import { CONTINUE_STUDYING_CTA } from "@/lib/copy/cta-copy";
import { THEME_OPTIONS, publicMarketingThemeChoiceCount } from "@/lib/theme/theme-registry";
import { MarketingHeaderUtilityCluster } from "@/components/layout/marketing-header-utility-strip";

/**
 * ThemePicker is only rendered inside the mobile drawer (never on initial paint).
 * Dynamic import keeps its 300-line code out of the initial JS bundle, reducing
 * SiteHeader parse time and TBT on marketing pages.
 */
const ThemePickerLazy = dynamic(
  () => import("@/components/theme/theme-picker").then((m) => ({ default: m.ThemePicker })),
  { ssr: false },
);

/**
 * MarketingLanguagePreferenceList is only rendered inside the mobile drawer
 * when the user taps the language selector. Dynamic import splits it from the
 * initial bundle.
 */
const MarketingLanguagePreferenceListLazy = dynamic(
  () =>
    import("@/components/i18n/marketing-language-preference").then((m) => ({
      default: m.MarketingLanguagePreferenceList,
    })),
  { ssr: false },
);

/** Primary filled header CTAs — white label on theme primary fill for consistent contrast. */
const HEADER_NAV_PRIMARY_CTA = "nn-nav-cta nn-text-on-solid-fill";

/** v4 primary links: text-first with soft state chrome, not a bordered pill wall. */
const NAV_LINK_CLASS =
  "nn-marketing-nav-link inline-flex h-[30px] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-2.5 text-center text-[0.875rem] font-medium leading-none tracking-normal xl:px-3";
/** Muted Learn / Track in the public “Learn → Practice → Track” row. */
const NAV_FLOW_SECONDARY_CLASS = `${NAV_LINK_CLASS} text-[var(--nav-muted)]`;
/** Core marketing destinations (Pricing, Blog, …) — keep on `nav-fg` for dark-mode contrast. */
const NAV_MARKETING_MORE_CLASS = `${NAV_LINK_CLASS} nn-marketing-nav-link--primary-text text-[var(--nav-fg)]`;
const NAV_TIER_LINK_CLASS =
  "nn-marketing-nav-link inline-flex min-h-[28px] items-center justify-center whitespace-nowrap rounded-full border px-2.5 text-center text-[0.8125rem] font-medium leading-[1.2] tracking-normal transition-colors";
const HEADER_SECONDARY_ACTION_CLASS =
  "nav-item inline-flex min-h-[38px] items-center justify-center rounded-full border border-[var(--nav-border)] px-3.5 py-1.5 text-[0.875rem] font-medium text-[var(--nav-fg)] transition-colors hover:bg-[var(--nav-hover)]";
/** Desktop guest Log In — secondary outline; same min-height, radius, and padding rhythm as Start Free. */
const HEADER_DESKTOP_LOGIN_OUTLINE_CLASS =
  "nav-item nn-header-login-receded inline-flex min-h-[38px] shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[var(--nav-border)] bg-transparent px-3.5 py-1.5 text-[0.875rem] font-medium text-[var(--nav-fg)] shadow-none transition-colors hover:bg-[var(--nav-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";
type LearnerTier = "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED";
type HeaderResumeCta = { href: string; label: string } | null;
type HeaderNavLink = { key: string; href: string; label: string; matchBase: string };
type AccountMenuItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};
type AccountMenuSection = {
  label: string;
  items: AccountMenuItem[];
};

type EngagementNudgePayload = {
  kind?: string;
  href?: string;
};

function markHeaderNavigationIntent(href: string): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.nnNavPending = "true";
  if (typeof window !== "undefined") {
    window.setTimeout(() => {
      if (document.documentElement.dataset.nnNavPending === "true") {
        delete document.documentElement.dataset.nnNavPending;
      }
    }, 8000);
    try {
      window.dispatchEvent(
        new CustomEvent("nn:navigation-intent", {
          detail: {
            href,
            t: performance.now(),
          },
        }),
      );
    } catch {
      /* ignore */
    }
  }
}

type HeaderNavAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

function HeaderNavAnchor({ href, onClick, ...props }: HeaderNavAnchorProps) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        markHeaderNavigationIntent(href);
        onClick?.(event);
      }}
    />
  );
}

function accountDisplayName(user: { name?: string | null; email?: string | null } | null | undefined): string {
  const rawName = user?.name?.trim();
  if (rawName) return rawName;
  const emailName = user?.email?.split("@")[0]?.replace(/[._-]+/g, " ")?.trim();
  return emailName || "NurseNest learner";
}

function accountFirstName(user: { name?: string | null; email?: string | null } | null | undefined): string {
  return accountDisplayName(user).split(/\s+/)[0] || "Account";
}

function accountInitials(user: { name?: string | null; email?: string | null } | null | undefined): string {
  const display = accountDisplayName(user);
  const parts = display.split(/\s+/).filter(Boolean);
  const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : display.slice(0, 2);
  return initials.toUpperCase();
}

function AccountAvatar({ user, className = "" }: { user: { name?: string | null; email?: string | null; image?: string | null } | null | undefined; className?: string }) {
  const initials = accountInitials(user);
  const image = user?.image?.trim();
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" className={`h-8 w-8 rounded-full object-cover ${className}`} />;
  }
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_18%,white)] text-xs font-semibold text-[var(--semantic-brand)] ring-1 ring-[color-mix(in_srgb,var(--semantic-brand)_20%,transparent)] ${className}`}
      aria-hidden
    >
      {initials}
    </span>
  );
}

function buildAccountMenuSections(): AccountMenuSection[] {
  return [
    {
      label: "Account",
      items: [
        { label: "Profile", href: "/app/account/personal", icon: User },
        { label: "Settings", href: "/app/account/settings", icon: Settings },
        { label: "Notifications", href: "/app/account/motivation", icon: Bell },
        { label: "Appearance", href: "/app/account/study-preferences", icon: Palette },
      ],
    },
    {
      label: "Learning",
      items: [
        { label: "Dashboard", href: "/app", icon: LayoutDashboard },
        { label: "Study Analytics", href: "/app/account/analytics", icon: BarChart3 },
        { label: "Progress Report Card", href: "/app/account/report-card", icon: LineChart },
        { label: "Study History", href: "/app/account/study-history", icon: History },
        { label: "Saved Flashcards", href: "/app/account/review-queue", icon: BookOpenCheck },
        { label: "My Study Notebook", href: "/app/account/notebook", icon: Bookmark },
        { label: "Bookmarks", href: "/app/account/notes", icon: Bookmark },
      ],
    },
    {
      label: "Subscription",
      items: [
        { label: "Billing", href: "/app/account/billing", icon: CreditCard },
        { label: "Subscription Plan", href: "/app/account/billing", icon: CreditCard },
        { label: "Manage Membership", href: "/app/account/billing", icon: CreditCard },
        { label: "Upgrade / Premium", href: "/pricing", icon: CreditCard },
      ],
    },
    {
      label: "Support",
      items: [
        { label: "Help Center", href: "/faq", icon: HelpCircle },
        { label: "Contact Support", href: "/app/account/support", icon: HelpCircle },
        { label: "Report a Problem", href: "/app/account/support", icon: HelpCircle },
      ],
    },
  ];
}

function UserAccountMenu({
  user,
  open,
  onOpenChange,
  sections,
  displayName,
  firstName,
  subscriptionLabel,
  learnerExamBadge,
  locale,
  localizeHref,
  onNavigate,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null } | null | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: AccountMenuSection[];
  displayName: string;
  firstName: string;
  subscriptionLabel: string;
  learnerExamBadge: string | null;
  locale: string;
  localizeHref: (href: string) => string;
  onNavigate: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = "nn-user-account-menu";

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      onOpenChange(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onOpenChange(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onOpenChange, open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className="nn-header-account-trigger gap-2 px-2.5 pr-2 sm:px-3"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => onOpenChange(!open)}
      >
        <AccountAvatar user={user} />
        <span className="hidden max-w-[8.5rem] truncate text-sm font-semibold md:inline 2xl:max-w-[10rem]">
          {firstName}
        </span>
        <ChevronDown className={`h-4 w-4 opacity-70 transition-transform duration-150 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 top-[calc(100%+0.6rem)] z-[180] w-[min(22rem,calc(100vw-1.5rem))] origin-top-right overflow-hidden rounded-2xl border border-[var(--nav-border)] bg-[var(--nav-bg)] text-[var(--nav-fg)] shadow-[0_24px_70px_-35px_rgba(15,23,42,0.45)] ring-1 ring-black/5 animate-[nn-mega-panel-enter_0.16s_ease-out]"
        >
          <div className="border-b border-[var(--header-border)] bg-[color-mix(in_srgb,var(--nav-hover)_70%,transparent)] p-3.5">
            <div className="flex items-center gap-3">
              <AccountAvatar user={user} className="h-10 w-10 text-sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{displayName}</p>
                {user?.email ? <p className="truncate text-xs text-[var(--nav-muted)]">{user.email}</p> : null}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-[var(--nav-border)] bg-[var(--nav-bg)] px-2 py-1 text-[11px] font-semibold text-[var(--nav-fg)]">
                {subscriptionLabel}
              </span>
              {learnerExamBadge ? (
                <span className="rounded-full border border-[var(--nav-border)] bg-[var(--nav-bg)] px-2 py-1 text-[11px] font-semibold text-[var(--nav-muted)]">
                  {learnerExamBadge}
                </span>
              ) : null}
            </div>
          </div>
          <div className="max-h-[min(72vh,36rem)] overflow-y-auto p-2">
            {sections.map((section) => (
              <div key={section.label} className="py-1.5">
                <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--nav-muted)]">
                  {section.label}
                </p>
                <div className="grid gap-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={`${section.label}-${item.label}`}
                        href={localizeHref(item.href)}
                        role="menuitem"
                        className="flex min-h-9 items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-[var(--nav-fg)] transition-colors hover:bg-[var(--nav-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                        onClick={() => {
                          onNavigate();
                          onOpenChange(false);
                        }}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-[var(--nav-muted)]" aria-hidden />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--header-border)] p-2">
            <SignOutButton
              role="menuitem"
              className="flex min-h-10 w-full items-center justify-center rounded-xl border border-[var(--nav-border)] px-3 py-2 text-sm font-semibold text-[var(--nav-fg)] transition-colors hover:bg-[var(--nav-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              onBeforeSignOut={() => {
                onNavigate();
                onOpenChange(false);
              }}
              redirectTo={withMarketingLocale(locale, "/login")}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MobileUserAccountSection({
  user,
  sections,
  displayName,
  subscriptionLabel,
  learnerExamBadge,
  locale,
  localizeHref,
  onNavigate,
  includeAdminLink,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null } | null | undefined;
  sections: AccountMenuSection[];
  displayName: string;
  subscriptionLabel: string;
  learnerExamBadge: string | null;
  locale: string;
  localizeHref: (href: string) => string;
  onNavigate: () => void;
  includeAdminLink?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--nav-border)] bg-[color-mix(in_srgb,var(--nav-hover)_52%,transparent)] p-2.5">
      <div className="mb-2.5 flex items-center gap-3 px-1">
        <AccountAvatar user={user} className="h-11 w-11 text-sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{displayName}</p>
          {user?.email ? <p className="truncate text-xs text-[var(--nav-muted)]">{user.email}</p> : null}
          <div className="mt-1 flex flex-wrap gap-1">
            <span className="rounded-full bg-[var(--nav-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--nav-muted)]">
              {subscriptionLabel}
            </span>
            {learnerExamBadge ? (
              <span className="rounded-full bg-[var(--nav-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--nav-muted)]">
                {learnerExamBadge}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      {includeAdminLink ? (
        <Link
          href={ADMIN_DASHBOARD_HREF}
          prefetch={false}
          className={`nav-item ${HEADER_NAV_PRIMARY_CTA} mb-2 inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-4 py-3 text-sm font-medium`}
          onClick={(event) => {
            onNavigate();
            navigateAdminDashboardHard(event);
          }}
          data-nn-mobile-utility-link
        >
          Admin
        </Link>
      ) : null}
      <div className="grid gap-2">
        {sections.map((section) => (
          <div key={section.label} className="rounded-xl bg-[var(--nav-bg)] p-2">
            <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--nav-muted)]">
              {section.label}
            </p>
            <div className="grid gap-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={`${section.label}-${item.label}`}
                    href={localizeHref(item.href)}
                    className="flex min-h-[44px] items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                    onClick={onNavigate}
                    data-nn-mobile-utility-link
                  >
                    <Icon className="h-4 w-4 shrink-0 text-[var(--nav-muted)]" aria-hidden />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <SignOutButton
        className="nav-item mt-2 w-full min-h-[48px] rounded-full border border-[var(--nav-border)] bg-[var(--nav-bg)] px-4 py-3 text-center text-sm font-semibold text-[var(--nav-fg)] hover:bg-[var(--nav-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
        onBeforeSignOut={onNavigate}
        redirectTo={withMarketingLocale(locale, "/login")}
      />
    </div>
  );
}

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
function formatRegionSlugFallback(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
}

/** Sync badge line — allied-specific abbreviation is resolved client-side via dynamic import. */
function examIndicatorLabelSync(
  t: (key: string) => string,
  country: string,
  tier: LearnerTier,
  alliedAbbrev: string | null,
): string {
  const regionShort =
    country === "CA"
      ? t("nav.badge.regionCA")
      : country === "US"
        ? t("nav.badge.regionUS")
        : country === "GB"
          ? "UK"
          : country === "AU"
            ? "AU"
            : country === "PH"
              ? "PH"
              : String(country);
  if (tier === "LVN_LPN") return `${regionShort} ${t("nav.badge.roleLvnLpn")}`;
  if (tier === "RPN") return `${regionShort} ${t("nav.badge.roleRpn")}`;
  if (tier === "ALLIED") {
    if (alliedAbbrev) return `${regionShort} ${alliedAbbrev}`;
    return t("nav.badge.alliedHealth");
  }
  if (tier === "RN") return `${regionShort} ${t("nav.badge.roleRn")}`;
  if (tier === "NP") return `${regionShort} ${t("nav.badge.roleNp")}`;
  return `${regionShort} ${tier}`;
}

/** Server-precomputed static nav data — eliminates hook calls for above-fold static labels. */
export type SiteHeaderPrecomputedNav = {
  /** BCP-47 locale (e.g. "en", "fr") resolved server-side. */
  locale: string;
  /**
   * Brand/company nav links for the Row 1 center nav (Tools, Pricing, About, Blog, FAQ).
   * These appear in the NurseNest brand nav row, NOT the class/pathway row.
   */
  brandNavLinks: ReadonlyArray<{ key: string; href: string; label: string; matchBase: string }>;
  /**
   * Pathway/class links for the Row 2 tier rail (Pre-Nursing, ECG, HESI, TEAS).
   * These appear alongside the tier hub chips (RN/RPN/NP/New Grad/Allied).
   */
  pathwayNavLinks: ReadonlyArray<{ key: string; href: string; label: string; matchBase: string }>;
  /** Computed server-side; avoids t("brand.homeAriaLabel") on the client. */
  homeAriaLabel: string;
  /** "Log In" CTA label computed server-side. */
  loginLabel: string;
  /** "Start Free" CTA label computed server-side. */
  signupLabel: string;
  /**
   * Tier hub strip precomputed server-side (RN/PN/NP/New Grad/Allied labels + hrefs).
   * Eliminates `buildMarketingTierHubStrip(region, t)` useMemo from the client hydration
   * critical path. Client falls back to hook-computed if absent or region changes.
   * -- TBT fix: removes one synchronous useMemo from the 53-hook hydration sequence.
   */
  tierHubStrip?: ReadonlyArray<{ key: MarketingPathwayMegaMenuKey; label: string; hubHref: string }>;
  /**
   * Server region used to compute tierHubStrip. If the client detects a different
   * region (cookie mismatch), it discards the precomputed strip and recomputes.
   */
  serverRegion?: string;
};

export type SiteHeaderProps = {
  /** True when getStaffSession() found a staff row for this request (JWT role may still lag). */
  serverHasStaffSession?: boolean;
  /**
   * Static nav data pre-computed by SiteHeaderServer (server component).
   * When provided, avoids hook-computed labels for static desktop nav links.
   * Falls back to hook-computed values when absent (backward-compatible).
   */
  precomputedNavData?: SiteHeaderPrecomputedNav;
};

/**
 * === THEME ARCHITECTURE CONTRACT (marketing) ===
 *
 * `marketing-row4` is the canonical marketing header layout for **Ocean,
 * Blossom, and Midnight**. Ocean is the canonical structural theme;
 * Blossom and Midnight inherit Ocean's `marketing-row4` structure and may
 * only override the visual layer.
 *
 * Themes MAY override (color/visual layer):
 *   - colors, gradients, shadows, borders, opacity, hover/focus states.
 *
 * Themes MUST NOT override (structural layer):
 *   - display
 *   - flex-direction / flex-wrap
 *   - grid-template / grid-template-columns / grid-template-rows /
 *     grid-template-areas
 *   - width / max-width / min-width
 *   - spacing rhythm (padding/margin) that shifts structural rhythm
 *   - responsive breakpoints (no theme-scoped media-query forks)
 *   - container hierarchy / DOM ordering / header row ordering
 *
 * Theme-specific marketing header CSS lives in
 * `src/app/premium-redesign-2026.css` (Blossom + Midnight blocks scoped to
 * `[data-nn-header-layout="marketing-row4"]`). The contract is enforced
 * statically by `tests/contracts/theme-marketing-row4-contract.test.ts`,
 * which scans the CSS text and fails on forbidden overrides. A CSS block
 * comment whose body starts with `theme-contract:allow <reason>` placed
 * immediately before a declaration acts as a documented escape hatch.
 *
 * Visual parity release gate: `tests/e2e/visual/theme-parity/
 * homepage-theme-parity.spec.ts` (see `docs/screenshots/theme-parity/`).
 */
/**
 * Reads `callbackUrl` from URL search params in a Suspense-isolated scope.
 * Separating `useSearchParams()` from the main SiteHeader body prevents the
 * entire nav from being caught inside a Suspense boundary, which reduces the
 * blocking scope during hydration and lowers TBT.
 */
function HeaderCallbackUrlReader({ onRead }: { onRead: (url: string | null) => void }) {
  const sp = useSearchParams();
  const cb = sp.get("callbackUrl");
  useEffect(() => {
    onRead(cb);
  }, [cb, onRead]);
  return null;
}

export function SiteHeader({ serverHasStaffSession, precomputedNavData }: SiteHeaderProps = {}) {
  const { t, locale } = useMarketingI18n();
  const tRef = useRef(t);
  tRef.current = t;
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  // searchParams read is deferred to a Suspense-isolated child (HeaderCallbackUrlReader)
  // to avoid the full SiteHeader being caught in a Suspense boundary. The callbackUrl
  // param is only relevant when a user lands on /login or /signup with an explicit
  // redirect — default is the localized home path, which covers 99%+ of cases.
  const [searchParamCallbackUrl, setSearchParamCallbackUrl] = useState<string | null>(null);
  const searchParams = useMemo<Pick<URLSearchParams, "get" | "toString">>(() => ({
    get: (key: string) => key === "callbackUrl" ? searchParamCallbackUrl : null,
    toString: () => searchParamCallbackUrl ? `callbackUrl=${encodeURIComponent(searchParamCallbackUrl)}` : "",
  }), [searchParamCallbackUrl]);
  const { theme } = useTheme();
  // Default to light (ocean, the app default, is a light theme) so SSR and first paint match.
  const isLightTheme = useMemo(() => {
    if (!theme) return true;
    return (THEME_OPTIONS.find((o) => o.id === theme)?.group ?? "light") === "light";
  }, [theme]);
  /** Midnight uses the same marketing header DOM as Ocean (row4 + utility band); other dark themes keep unified-dark. */
  const marketingRow4Layout = useMemo(
    () => isLightTheme || theme === "midnight",
    [isLightTheme, theme],
  );
  const sessionState = useSession();
  const session = sessionState?.data ?? null;
  const sessionStatus = sessionState?.status ?? "unauthenticated";
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
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [MobileContextDrawerMod, setMobileContextDrawerMod] = useState<ComponentType<
    MobileContextDrawerProps
  > | null>(null);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [resumeStudyingCta, setResumeStudyingCta] = useState<HeaderResumeCta>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const strippedPath = stripMarketingLocalePrefix(pathname).pathname;
  const postLoginCallbackPath = useMemo(
    () => resolveMarketingAuthRedirectTarget(pathname, searchParams, locale),
    [pathname, searchParams, locale],
  );
  const clientGlobalRegion = useClientGlobalRegionCookie();
  const effectiveGlobalRegion: GlobalRegionSlug = useMemo(
    () =>
      effectiveMarketingHeaderGlobalRegion({
        strippedPathname: strippedPath,
        globalRegionCookie: clientGlobalRegion,
        marketingExamRegion: region,
        sessionCountryCode: user?.country,
      }),
    [strippedPath, clientGlobalRegion, region, user?.country],
  );
  const globalLocale: GlobalLocaleCode = (locale as GlobalLocaleCode) ?? "en";

  useEffect(() => {
    if (effectiveGlobalRegion === "canada" || effectiveGlobalRegion === "us") {
      queueMicrotask(() => setIntlRegionDisplayName(null));
      return;
    }
    let cancelled = false;
    const slug = effectiveGlobalRegion;
    void import("@/lib/i18n/global-regions").then((m) => {
      if (cancelled) return;
      const row = m.REGION_CONFIG[slug as GlobalRegionSlug];
      setIntlRegionDisplayName(row?.displayName ?? formatRegionSlugFallback(slug));
    });
    return () => {
      cancelled = true;
    };
  }, [effectiveGlobalRegion]);

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

  /** Legacy hook for auth links — tier mega panel removed; keep call sites stable. */
  const closeMegaBeforeAuthNav = useCallback(() => {}, []);

  /** Defer drawer close so `Link` navigations (e.g. `/admin`) are not cancelled when the portal unmounts in the same tick. */
  const scheduleMobileDrawerClose = useCallback(() => {
    window.setTimeout(() => setMobileOpen(false), 0);
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!mobileLangRef.current?.contains(e.target as Node)) setMobileLangOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (mobileOpen) {
        e.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (mobileContextOpen) {
        e.preventDefault();
        setMobileContextOpen(false);
        return;
      }
      setMobileLangOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onEscape);
    };
  }, [mobileOpen, mobileContextOpen]);

  useEffect(() => {
    if (!mobileOpen && !mobileContextOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen, mobileContextOpen]);

  useEffect(() => {
    let raf = 0;
    let last = window.scrollY > 8;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const next = window.scrollY > 8;
        if (next === last) return;
        last = next;
        setIsScrolled(next);
      });
    };
    setIsScrolled(last);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setMobileLangOpen(false);
      setAccountMenuOpen(false);
    });
  }, [pathname, locale, region]);

  useEffect(() => {
    if (!mobileContextOpen || MobileContextDrawerMod) return;
    let cancelled = false;
    void import("@/components/layout/mobile-context-drawer").then((m) => {
      if (!cancelled) setMobileContextDrawerMod(() => m.MobileContextDrawer);
    });
    return () => {
      cancelled = true;
    };
  }, [mobileContextOpen, MobileContextDrawerMod]);

  const activeNav = useActiveNavContext();
  const tierHubMenus = useMemo(
    () => {
      // Use server-precomputed strip when region matches to avoid synchronous computation
      // during hydration. buildMarketingTierHubStrip calls marketingExamHubPath and
      // publicNewGradStudyDestinations on every render — deferring this saves ~1 long task.
      const preStrip = precomputedNavData?.tierHubStrip;
      const preRegion = precomputedNavData?.serverRegion;
      if (preStrip && preRegion === region) return preStrip;

      // Mismatch: server region differs from client region (e.g. cookie changed after SSR,
      // or the precomputed strip was absent). Falling back to synchronous client computation.
      // Emit a data attribute on <html> so DevTools + Datadog can count mismatch rate.
      if (typeof document !== "undefined") {
        document.documentElement.dataset.nnRegionMismatch = "1";
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[SiteHeader] tier hub strip region mismatch: server=${preRegion ?? "none"}, client=${region}. ` +
            "Falling back to client-side buildMarketingTierHubStrip — this is a TBT regression. " +
            "Check readOptionalMarketingRegionToggleForCountry cookie alignment.",
          );
        }
      }
      return buildMarketingTierHubStrip(region, (k) => t(k));
    },
    [precomputedNavData?.tierHubStrip, precomputedNavData?.serverRegion, region, t],
  );
  const [intlRegionDisplayName, setIntlRegionDisplayName] = useState<string | null>(null);
  const [alliedProfessionAbbrev, setAlliedProfessionAbbrev] = useState<string | null>(null);
  const isAuthenticated = Boolean(sessionStatus === "authenticated" && user);
  const isAdminAuthenticated = Boolean(
    isAuthenticated && shouldShowAdminDashboardNav({ serverHasStaffSession, sessionRole: user?.role }),
  );
  const isLearnerRole = Boolean(
    isAuthenticated &&
      user?.role &&
      !isStaffRole(user.role) &&
      serverHasStaffSession !== true,
  );
  /** Entitled learners: show Continue / Account / Log out in the marketing header (not a separate “learner nav” IA). */
  const isMarketingEntitledLearner =
    isLearnerRole && activeNav.entitlement === "entitled";
  const navActor = isAdminAuthenticated ? "admin" : isLearnerRole ? "learner" : "anonymous";
  const alliedProfessionKey = (user as { alliedProfessionKey?: string | null } | undefined)?.alliedProfessionKey;
  useEffect(() => {
    if (!isMarketingEntitledLearner || !user || user.tier !== "ALLIED") {
      queueMicrotask(() => setAlliedProfessionAbbrev(null));
      return;
    }
    const key = alliedProfessionKey?.trim();
    if (!key) {
      queueMicrotask(() => setAlliedProfessionAbbrev(null));
      return;
    }
    let cancelled = false;
    void import("@/lib/allied/allied-professions-registry").then((m) => {
      if (cancelled) return;
      const prof = m["ALLIED_PROFESSIONS"].find((p) => p.professionKey === key);
      if (!prof) {
        setAlliedProfessionAbbrev(null);
        return;
      }
      const match = prof.h1.match(/\(([A-Z/]+)\)/);
      setAlliedProfessionAbbrev(match ? match[1] : prof.professionKey.toUpperCase());
    });
    return () => {
      cancelled = true;
    };
  }, [isMarketingEntitledLearner, user, alliedProfessionKey]);

  const learnerExamBadge =
    isMarketingEntitledLearner && user
      ? examIndicatorLabelSync(t, user.country, user.tier as LearnerTier, alliedProfessionAbbrev)
      : null;
  const accountMenuSections = useMemo(() => buildAccountMenuSections(), []);
  const accountName = accountDisplayName(user);
  const accountFirst = accountFirstName(user);
  const subscriptionLabel = isAdminAuthenticated
    ? "Staff account"
    : activeNav.entitlement === "entitled"
      ? "Premium Student"
      : "Free account";
  const activeProfession: string = isLearnerRole && user?.tier
    ? (user.tier === "RPN" || user.tier === "LVN_LPN" ? "pn" : user.tier === "NP" ? "np" : user.tier === "ALLIED" ? "allied" : "rn")
    : "rn";
  const activeExam: string | null = null;
  const marketingFlowDestinations = useMemo(() => {
    const tier: MarketingHeaderFlowTier | null =
      isMarketingEntitledLearner && user?.tier ? (user.tier as MarketingHeaderFlowTier) : null;
    const country =
      user?.country === "US" || user?.country === "CA"
        ? user.country === "US"
          ? "US"
          : "CA"
        : null;
    return marketingHeaderLearnPracticeFlowDestinations(region, { tier, country });
  }, [isMarketingEntitledLearner, user?.tier, user?.country, region]);

  const marketingFlowLinks: HeaderNavLink[] = useMemo(
    () => [
      {
        key: "flow-learn",
        href: marketingFlowDestinations.learnHref,
        matchBase: marketingFlowDestinations.learnMatchBase,
        label: formatTitleCase(t("nav.marketingFlow.learn"), locale),
      },
      {
        key: "flow-practice",
        href: marketingFlowDestinations.practiceHref,
        matchBase: marketingFlowDestinations.practiceMatchBase,
        label: formatTitleCase(t("nav.marketingFlow.practice"), locale),
      },
      {
        key: "flow-track",
        href: signupWithCallback(HUB.tools),
        matchBase: "/signup",
        label: formatTitleCase(t("nav.marketingFlow.track"), locale),
      },
    ],
    [marketingFlowDestinations, t, locale],
  );
  // Brand/company links → Row 1 center nav (Tools, Pricing, About, Blog, FAQ).
  // These must NOT appear in the class/pathway row.
  const brandNavLinks: HeaderNavLink[] = useMemo(
    () =>
      precomputedNavData?.brandNavLinks
        ? [...precomputedNavData.brandNavLinks]
        : [
            { key: "tools", href: HUB.tools, matchBase: HUB.tools, label: formatTitleCase(t("nav.tools"), locale) },
            { key: "pricing", href: HUB.pricing, matchBase: "/pricing", label: formatTitleCase(t("nav.pricing"), locale) },
            { key: "about", href: "/about", matchBase: "/about", label: formatTitleCase(t("nav.about"), locale) },
            { key: "blog", href: "/blog", matchBase: "/blog", label: formatTitleCase(t("footer.blog"), locale) },
            { key: "faq", href: "/faq", matchBase: "/faq", label: formatTitleCase(t("footer.faq"), locale) },
          ],
    [precomputedNavData?.brandNavLinks, t, locale],
  );

  // Class/pathway links → Row 2 tier rail (Pre-Nursing, ECG, HESI, TEAS).
  // Rendered alongside RN/RPN/NP/New Grad/Allied tier hub chips.
  // HESI and TEAS route to explicit readiness status pages until launch criteria are complete.
  const pathwayMoreLinks: HeaderNavLink[] = useMemo(
    () =>
      precomputedNavData?.pathwayNavLinks
        ? [...precomputedNavData.pathwayNavLinks]
        : [
            { key: "pre-nursing", href: "/pre-nursing", matchBase: "/pre-nursing", label: formatTitleCase(t("nav.preNursing"), locale) },
            { key: "ecg", href: "/ecg-interpretation", matchBase: "/ecg-interpretation", label: "ECG" },
            { key: "hesi", href: "/pre-nursing/hesi-a2", matchBase: "/pre-nursing/hesi-a2", label: "HESI A2" },
            { key: "teas", href: "/pre-nursing/ati-teas", matchBase: "/pre-nursing/ati-teas", label: "ATI TEAS" },
          ],
    [precomputedNavData?.pathwayNavLinks, t, locale],
  );

  // Combined list used for non-row4 dark themes where all links live in the Row 1 center nav.
  const allMoreLinks: HeaderNavLink[] = useMemo(
    () => [...brandNavLinks, ...pathwayMoreLinks],
    [brandNavLinks, pathwayMoreLinks],
  );
  const darkHeaderShadow = useMemo(() => {
    const inset = "inset 0 1px 0 0 rgba(255,255,255,0.15)";
    if (!isScrolled) return inset;
    return `${inset}, 0 12px 36px -14px color-mix(in srgb, var(--theme-heading-text) 18%, transparent)`;
  }, [isScrolled]);

  /** Homepage-only acquisition param; other marketing pages keep plain signup URL. */
  const guestMarketingSignupHref = useMemo(() => {
    const base = `/signup?callbackUrl=${encodeURIComponent(postLoginCallbackPath)}`;
    const isHome = strippedPath === "/" || strippedPath === "";
    const raw = isHome ? `${base}&entry=homepage` : base;
    /** `mapLegacyMarketingHref` only matches bare paths; query strings pass through unchanged. */
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return withMarketingLocale(locale, raw);
  }, [locale, strippedPath, postLoginCallbackPath]);

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

  /** Dark themes: inject `--nn-nav-*` + ink on this wrapper; **no** inline `backgroundColor` so
   *  `.nn-header-dark-surface` (premium gradient + blur) owns the full-bleed paint. Light themes
   *  keep var-only injection — paper/row4 bands come from CSS on `<header>`. */
  const stickyChromeStyle = useMemo(() => {
    if (isLightTheme) return getNavChromeVars(theme);
    const chrome = getNavChrome(theme);
    return {
      ...getNavChromeVars(theme),
      color: chrome.foreground,
      borderColor: chrome.border,
      boxShadow: darkHeaderShadow,
    };
  }, [isLightTheme, theme, darkHeaderShadow]);

  return (
    <div
      style={stickyChromeStyle}
      className={`sticky top-0 z-50 w-full min-w-0${isLightTheme ? "" : " nn-header-dark-surface"}`}
      ref={headerRef}
      data-nn-cls-region="site-header"
    >
      {/* Isolated Suspense boundary for useSearchParams — keeps callbackUrl param isolated
          from the main SiteHeader Suspense scope to reduce TBT on marketing pages. */}
      <Suspense fallback={null}>
        <HeaderCallbackUrlReader onRead={setSearchParamCallbackUrl} />
      </Suspense>
      {/*
        Keep enter animation on <header> only. `nn-header-animate-in` ends with a transform, which
        creates a fixed-position containing block — mobile drawers are siblings after </header> and
        must stay outside that subtree so `fixed inset-0` covers the viewport, not the header box.
      */}
      <header
        data-nn-nav-mode="public"
        data-nn-header-layout={marketingRow4Layout ? "marketing-row4" : "marketing-unified-dark"}
        className={`nn-header-animate-in relative flex w-full flex-col border-b border-[color-mix(in_srgb,var(--header-border)_50%,transparent)]${
          marketingRow4Layout
            ? ` nn-header-logo-row nn-header-marketing-v31${isScrolled ? " nn-header-logo-row--scrolled" : ""}`
            : ""
        } overflow-visible`}
      >
        <div className="nn-marketing-nav-v31-frame w-full min-w-0">
        {/* Utility cluster is rendered once: Bar A (light, xl+) or main-row cluster (dark). */}
        {/* Full-width band: primary gradient/glass must not live on `.nn-section-shell` (max-width crop). */}
        <div
          className="nn-header-marketing-primary-band flex w-full min-w-0 flex-col overflow-visible"
          data-nn-header-band="primary"
        >
        <div className="nn-section-shell nn-header-primary-inner-shell flex flex-col overflow-visible">
          {/* ── Mobile brand row ── */}
          <div className="top-bar nn-header-mobile-only-flex min-h-[3.5rem] w-full items-center justify-between gap-2 overflow-visible border-b border-[var(--header-border)] py-1.5 pt-[max(0.25rem,env(safe-area-inset-top,0px))] sm:min-h-[4.5rem] sm:gap-3 sm:py-0">
            <div className="nn-header-mobile-brand-auth-cluster flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-3">
              <div className="flex min-w-0 shrink items-center gap-2 overflow-hidden">
                <Link
                  href={localizeHref("/")}
                  className="nn-header-logo-link group flex min-w-0 shrink-0 items-center overflow-visible bg-transparent focus-visible:outline-offset-2"
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
              {/* Keep auth chrome reserved while the session hydrates. Never paint guest CTAs while
                  `useSession()` is still validating an existing cookie. */}
              {isSessionPending ? (
                <div
                  className="nn-header-mobile-public-ctas flex min-w-0 flex-1 shrink items-center justify-end gap-1.5 sm:flex-none sm:justify-start sm:gap-2"
                  aria-busy="true"
                  aria-label="Checking account status"
                >
                  <span className="inline-flex min-h-[44px] flex-1 rounded-full border border-[var(--nav-border)] bg-[var(--nav-hover)] opacity-40 sm:w-20 sm:flex-none" />
                  <span className="inline-flex min-h-[44px] flex-1 rounded-full border border-[var(--nav-border)] bg-[var(--nav-hover)] opacity-40 sm:w-24 sm:flex-none" />
                </div>
              ) : !isAuthenticated ? (
                <div
                  className="nn-header-mobile-public-ctas flex min-w-0 flex-1 shrink items-center justify-end gap-1.5 sm:flex-none sm:justify-start sm:gap-2"
                >
                  <HeaderNavAnchor
                    href={localizeHref(`/login?callbackUrl=${encodeURIComponent(postLoginCallbackPath)}`)}
                    className="nav-item inline-flex min-h-[44px] min-w-0 max-w-none flex-1 shrink items-center justify-center whitespace-nowrap rounded-full border border-[var(--nav-border)] px-2.5 py-2 text-[11px] font-medium text-[var(--nav-fg)] transition-colors hover:bg-[var(--nav-hover)] sm:max-w-none sm:flex-none sm:px-3.5 sm:text-sm"
                    onClick={closeMegaBeforeAuthNav}
                    aria-label="Log in to your NurseNest account"
                  >
                    {formatTitleCase(t("nav.logIn"), locale)}
                  </HeaderNavAnchor>
                  <HeaderNavAnchor
                    href={guestMarketingSignupHref}
                    className={`nav-item ${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-[44px] min-w-0 max-w-none flex-1 shrink items-center justify-center whitespace-nowrap rounded-full px-2.5 py-2 text-[11px] font-medium sm:max-w-none sm:flex-none sm:px-4 sm:text-sm`}
                    onClick={closeMegaBeforeAuthNav}
                    aria-label="Sign up for a NurseNest account"
                    title="Sign up — no credit card required"
                  >
                    {formatTitleCase(t("nav.signUp"), locale)}
                  </HeaderNavAnchor>
                </div>
              ) : null}
            </div>
            {/* Mobile controls — only below `md` (tablet+ uses desktop chrome) */}
            <div className={`nn-header-mobile-only-flex shrink-0 items-center gap-2 ${isAuthenticated ? "ml-auto" : ""}`}>
              <button
                type="button"
                onClick={() => setMobileContextOpen(true)}
                className="nn-header-mobile-only-inline-flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl border border-[var(--nn-nav-border)] bg-transparent p-0 text-[var(--nn-nav-fg)] transition-colors hover:bg-[var(--nn-nav-hover-bg)]"
                aria-label="Region and language settings"
                aria-expanded={mobileContextOpen}
              >
                <Settings className="h-[18px] w-[18px]" aria-hidden />
              </button>
              <Button
                type="button"
                variant="ghost"
                className="h-11 w-11 shrink-0 touch-manipulation rounded-xl border border-[var(--nn-nav-border)] p-0 text-[var(--nn-nav-fg)] hover:bg-[var(--nn-nav-hover-bg)]"
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
            <div className="nn-header-mobile-only-flex relative z-[1] w-full items-center justify-end gap-2 border-b border-[var(--header-border)] bg-transparent px-3 py-2 sm:px-4 sm:py-2.5">
              {isAdminAuthenticated ? (
                <div className="flex w-full min-w-0 items-center justify-end gap-2">
                  <Link
                    href={ADMIN_DASHBOARD_HREF}
                    prefetch={false}
                    className={`nav-item ${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full px-3 py-2 text-sm font-medium sm:flex-initial sm:px-4`}
                    onClick={(e) => {
                      closeMegaBeforeAuthNav();
                      navigateAdminDashboardHard(e);
                    }}
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
              ) : isMarketingEntitledLearner ? (
                <div className="flex w-full min-w-0 items-center justify-end gap-2">
                  <Link
                    href={resumeStudyingCta?.href ?? "/app"}
                    className={`nav-item ${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full px-3 py-2 text-sm font-medium sm:flex-initial sm:px-4`}
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
              ) : (
                <div className="flex w-full min-w-0 items-center justify-end gap-2">
                  <Link
                    href={localizeHref(HUB.pricing)}
                    className={`nav-item ${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full px-3 py-2 text-sm font-medium sm:flex-initial sm:px-4`}
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

          {/* ── Row 0: Utility row — desktop only, row4 themes (Ocean / Blossom / Midnight).
              Country + Language + Theme live here, above the logo row.
              Thin, low visual weight, utility-only. Hidden on mobile (drawer handles these). */}
          {marketingRow4Layout ? (
            <div
              className="nn-header-hide-until-xl w-full border-b border-[var(--header-border)]"
              data-testid="marketing-header-utility-row"
              data-nn-header-row="utility"
            >
              <div className="flex items-center justify-end gap-1.5 py-[3px] min-h-[30px]">
                <MarketingHeaderUtilityCluster
                  chromeMode="row4"
                  includeUnpublishedRegions={isAdminAuthenticated}
                />
              </div>
            </div>
          ) : null}

          {/* ── Row 1: NurseNest brand nav row — logo | brand links | (auth cluster for dark themes) ── */}
          <div
            className="nn-header-desktop-grid overflow-visible"
            data-testid="marketing-header-primary-row"
            data-nn-header-layer="main"
          >
            <div className="nn-header-brand-cluster flex shrink-0 items-center gap-3 lg:gap-3.5">
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

            {/* row4: brand nav links (Tools, Pricing, About, Blog, FAQ) in center.
                Non-row4 dark themes: all links (brand + pathway combined) in center. */}
            <nav
              aria-label={t("nav.marketingExplore")}
              className="nav nn-header-main-marketing-nav flex w-full min-w-0 max-w-full flex-wrap items-center justify-center gap-2 px-0 sm:gap-3 xl:gap-4"
              data-testid="marketing-header-brand-nav"
              data-nn-header-row="brand-nav"
            >
              {(marketingRow4Layout ? brandNavLinks : allMoreLinks).map((item) => (
                <HeaderNavAnchor
                  key={item.key}
                  href={localizeHref(item.href)}
                  aria-current={isActivePath(strippedPath, item.matchBase) ? "page" : undefined}
                  className={NAV_MARKETING_MORE_CLASS}
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
                </HeaderNavAnchor>
              ))}
            </nav>

            {/* row4: auth lives in the primary shell for balanced brand | nav | actions.
                Non-row4 dark themes: utility + auth here (no utility row). */}
            <div className="nn-header-desktop-auth-cluster relative z-[130] flex min-w-0 max-w-full shrink-0 flex-wrap items-center justify-end gap-x-2 gap-y-1.5 xl:gap-x-2">
              {!marketingRow4Layout ? (
                <div
                  data-testid="marketing-header-utility-inline"
                  data-nn-header-band="utility"
                  className="nn-header-desktop-marketing-utility-cluster flex min-w-0 max-w-full shrink flex-wrap items-center justify-end gap-y-1"
                >
                  <MarketingHeaderUtilityCluster
                    chromeMode="dark-marketing"
                    includeUnpublishedRegions={isAdminAuthenticated}
                  />
                </div>
              ) : null}
              {isSessionPending ? (
                <div
                  className="flex shrink-0 items-center gap-2"
                  aria-busy="true"
                  aria-label="Checking account status"
                >
                  <span className="inline-flex h-[38px] w-[74px] rounded-full border border-[var(--nav-border)] bg-[var(--nav-hover)] opacity-40" />
                  <span className="inline-flex h-[42px] w-[96px] rounded-full border border-[var(--nav-border)] bg-[var(--nav-hover)] opacity-40" />
                </div>
              ) : !isAuthenticated ? (
                <div className="flex shrink-0 items-center gap-2">
                  <HeaderNavAnchor
                    href={localizeHref(`/login?callbackUrl=${encodeURIComponent(postLoginCallbackPath)}`)}
                    className={`${HEADER_DESKTOP_LOGIN_OUTLINE_CLASS} shrink-0 whitespace-nowrap`}
                    onClick={closeMegaBeforeAuthNav}
                    aria-label="Log in to your NurseNest account"
                  >
                    {formatTitleCase(t("nav.logIn"), locale)}
                  </HeaderNavAnchor>
                  <HeaderNavAnchor
                    href={guestMarketingSignupHref}
                    className={`${HEADER_NAV_PRIMARY_CTA} nn-nav-cta--premium-soft inline-flex min-h-[42px] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium`}
                    onClick={closeMegaBeforeAuthNav}
                    aria-label="Sign up for a NurseNest account"
                    title="Sign up — no credit card required"
                  >
                    {formatTitleCase(t("nav.signUp"), locale)}
                  </HeaderNavAnchor>
                </div>
              ) : isAdminAuthenticated ? (
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={ADMIN_DASHBOARD_HREF}
                    prefetch={false}
                    className={`${HEADER_NAV_PRIMARY_CTA} nn-nav-cta--premium-soft inline-flex min-h-0 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium`}
                    onClick={(e) => { closeMegaBeforeAuthNav(); navigateAdminDashboardHard(e); }}
                  >
                    {formatTitleCase(t("nav.admin"), locale)}
                  </Link>
                  <Link href="/app" className={`${HEADER_SECONDARY_ACTION_CLASS} shrink-0 whitespace-nowrap`}>
                    {formatTitleCase(t("nav.dashboard"), locale)}
                  </Link>
                  <UserAccountMenu
                    user={user}
                    open={accountMenuOpen}
                    onOpenChange={setAccountMenuOpen}
                    sections={accountMenuSections}
                    displayName={accountName}
                    firstName={accountFirst}
                    subscriptionLabel={subscriptionLabel}
                    learnerExamBadge={learnerExamBadge}
                    locale={locale}
                    localizeHref={localizeHref}
                    onNavigate={closeMegaBeforeAuthNav}
                  />
                </div>
              ) : isMarketingEntitledLearner ? (
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                  <Link
                    href={resumeStudyingCta?.href ?? "/app"}
                    className={`${HEADER_NAV_PRIMARY_CTA} nn-nav-cta--premium-soft inline-flex min-h-0 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium sm:px-4`}
                  >
                    {resumeStudyingCta?.label ?? formatTitleCase(CONTINUE_STUDYING_CTA, locale)}
                  </Link>
                  <UserAccountMenu
                    user={user}
                    open={accountMenuOpen}
                    onOpenChange={setAccountMenuOpen}
                    sections={accountMenuSections}
                    displayName={accountName}
                    firstName={accountFirst}
                    subscriptionLabel={subscriptionLabel}
                    learnerExamBadge={learnerExamBadge}
                    locale={locale}
                    localizeHref={localizeHref}
                    onNavigate={closeMegaBeforeAuthNav}
                  />
                </div>
              ) : (
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={localizeHref(HUB.pricing)}
                    className={`${HEADER_NAV_PRIMARY_CTA} nn-nav-cta--premium-soft inline-flex min-h-0 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium`}
                    onClick={closeMegaBeforeAuthNav}
                  >
                    {formatTitleCase(t("nav.pricing"), locale)}
                  </Link>
                  <Link href="/app" className={`${HEADER_SECONDARY_ACTION_CLASS} shrink-0 whitespace-nowrap`}>
                    {formatTitleCase(t("nav.dashboard"), locale)}
                  </Link>
                  <UserAccountMenu
                    user={user}
                    open={accountMenuOpen}
                    onOpenChange={setAccountMenuOpen}
                    sections={accountMenuSections}
                    displayName={accountName}
                    firstName={accountFirst}
                    subscriptionLabel={subscriptionLabel}
                    learnerExamBadge={learnerExamBadge}
                    locale={locale}
                    localizeHref={localizeHref}
                    onNavigate={closeMegaBeforeAuthNav}
                  />
                </div>
              )}
            </div>
          </div>{/* /nav-row */}
        </div>{/* /.nn-section-shell */}
        </div>{/* /.nn-header-marketing-primary-band */}
        {/* ── Unified nav row — Row 2 of the 2-row desktop header ──
            row4 (Ocean/Blossom/Midnight): all nav items here — tier pathway chips followed by
            marketing links. flex-nowrap enforces single line on lg+ desktop.
            Non-row4 dark themes: tier chips only (more links live in the desktop grid center nav). */}
        <div
          className="nn-marketing-nav-v31-tier-rail nn-header-hide-until-xl w-full nn-header-nav-row"
          data-nn-header-band="tier"
          data-nn-header-row="class-pathway"
          data-testid="marketing-header-unified-nav"
        >
          <div className="nn-marketing-nav-v31-tier-inner nn-section-shell nn-header-primary-inner-shell flex min-h-[36px] items-center justify-center gap-x-2 gap-y-2 overflow-visible px-4 py-1.5 scrollbar-none md:min-h-[40px] md:py-2">
            <nav
              aria-label={t("nav.marketingPathways")}
              className="mx-auto flex w-fit max-w-full min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-2 xl:gap-x-3"
            >
              {/* Tier hub chips: RN / RPN / NP / New Grad / Allied */}
              {tierHubMenus.map((menu) => (
                <HeaderNavAnchor
                  key={menu.key}
                  href={localizeHref(menu.hubHref)}
                  data-active={strippedPathActivatesMegaMenuKey(menu.key, strippedPath) || undefined}
                  // Visual chrome (bg/border/text) for the tier chips lives in CSS
                  // (premium-redesign-2026.css `.nn-marketing-tier-chip` + globals.css `.nn-header-nav-row`).
                  className={`${NAV_TIER_LINK_CLASS} nn-marketing-tier-chip px-2 py-1.5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]`}
                  onClick={() => {
                    trackClientEvent(PH.marketingNavClick, {
                      actor: navActor,
                      nav_id: `${menu.key}_tier_hub`,
                      surface: "site_header_desktop",
                      marketing_region: region,
                    });
                  }}
                >
                  {menu.label}
                </HeaderNavAnchor>
              ))}
              {/* row4 only: pathway/class links (Pre-Nursing, ECG, HESI, TEAS).
                  Non-row4 dark themes have all links in the Row 1 center nav. */}
              {marketingRow4Layout && pathwayMoreLinks.map((item) => (
                <HeaderNavAnchor
                  key={item.key}
                  href={localizeHref(item.href)}
                  aria-current={isActivePath(strippedPath, item.matchBase) ? "page" : undefined}
                  className={NAV_MARKETING_MORE_CLASS}
                  data-nn-pathway-link={item.key}
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
                </HeaderNavAnchor>
              ))}
            </nav>
          </div>
        </div>
        </div>{/* /.nn-marketing-nav-v31-frame */}
      </header>

      {/* Mobile context/settings drawer — chunk loads only after user opens settings (heavy REGION_CONFIG + pathway helpers). */}
      {mobileContextOpen && !MobileContextDrawerMod ? (
        <div
          className="fixed inset-0 z-[209] flex items-end justify-center bg-black/40 md:hidden"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="mb-8 h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white/90" />
        </div>
      ) : null}
      {MobileContextDrawerMod ? (
        <MobileContextDrawerMod
          open={mobileContextOpen}
          onClose={() => setMobileContextOpen(false)}
          region={effectiveGlobalRegion}
          locale={globalLocale}
          profession={activeProfession}
          exam={activeExam}
          countrySelectorIncludeUnpublished={isAdminAuthenticated}
          onRegionChange={async (newRegion) => {
            const { applyGlobalRegionSelection } = await import("@/lib/marketing/apply-global-region-selection");
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
      ) : null}

      {mobileOpen && typeof document !== "undefined"
        ? createPortal(
            <div className="nn-header-overlay-mobile-only fixed inset-0 z-[200] animate-[nn-overlay-enter_0.24s_ease_forwards]">
          <button
            type="button"
            className="nn-skip-mobile-touch-target absolute inset-0 touch-manipulation bg-black/56"
            aria-label={t("nav.closeMenu")}
            onClick={scheduleMobileDrawerClose}
          />
          <div className="absolute inset-x-0 top-0 flex h-[100dvh] max-h-[100dvh] flex-col border-b border-[var(--nav-border)] bg-[var(--nav-bg)] text-[var(--nav-fg)] shadow-[var(--shadow-elevated)] animate-[nn-drawer-slide-in_0.28s_cubic-bezier(0.25,0.1,0.25,1)_forwards]">
            <div className="flex min-h-14 shrink-0 items-center justify-between border-b border-[var(--header-border)] px-3 pt-[max(0.35rem,env(safe-area-inset-top))] sm:min-h-16 sm:px-4 sm:pt-[max(0.5rem,env(safe-area-inset-top))]">
              <Link
                href={localizeHref("/")}
                className="flex min-w-0 shrink-0 items-center overflow-visible bg-transparent"
                aria-label={t("brand.homeAriaLabel")}
                onClick={scheduleMobileDrawerClose}
              >
                <HeaderBrandLockup />
              </Link>
              <Button
                type="button"
                variant="ghost"
                className="h-11 w-11 shrink-0 touch-manipulation rounded-xl border border-[var(--nav-border)] p-0 text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                aria-label={t("nav.closeMenu")}
                onClick={scheduleMobileDrawerClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-y-contain px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-4 sm:pt-5">

              {/* ── Section 1: Account / Utility ── */}
              <div className="flex flex-col gap-2" data-nn-mobile-section="account">
                {isSessionPending ? (
                  <div
                    className="grid gap-2"
                    aria-busy="true"
                    aria-label="Checking account status"
                  >
                    <span className="inline-flex min-h-[48px] rounded-full border border-[var(--nav-border)] bg-[var(--nav-hover)] opacity-40" />
                    <span className="inline-flex min-h-[46px] rounded-full border border-[var(--nav-border)] bg-[var(--nav-hover)] opacity-40" />
                  </div>
                ) : !isAuthenticated ? (
                  <>
                    <HeaderNavAnchor
                      href={guestMarketingSignupHref}
                      className={`nav-item ${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-[48px] items-center justify-center rounded-full px-4 py-3 text-sm font-medium`}
                      onClick={scheduleMobileDrawerClose}
                      aria-label="Start free account — nursing and healthcare exam prep"
                      title="Start free — no credit card required"
                      data-nn-mobile-utility-link
                    >
                      {formatTitleCase(t("nav.signup"), locale)}
                    </HeaderNavAnchor>
                    <HeaderNavAnchor
                      href={localizeHref(`/login?callbackUrl=${encodeURIComponent(postLoginCallbackPath)}`)}
                      className="nav-item inline-flex min-h-[46px] items-center justify-center rounded-full border border-[var(--nav-border)] px-4 py-3 text-sm font-medium text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                      onClick={scheduleMobileDrawerClose}
                      aria-label="Log in to your NurseNest account"
                      data-nn-mobile-utility-link
                    >
                      {formatTitleCase(t("nav.logIn"), locale)}
                    </HeaderNavAnchor>
                  </>
                ) : isAdminAuthenticated ? (
                  <MobileUserAccountSection
                    user={user}
                    sections={accountMenuSections}
                    displayName={accountName}
                    subscriptionLabel={subscriptionLabel}
                    learnerExamBadge={learnerExamBadge}
                    locale={locale}
                    localizeHref={localizeHref}
                    onNavigate={() => {
                      closeMegaBeforeAuthNav();
                      scheduleMobileDrawerClose();
                    }}
                    includeAdminLink
                  />
                ) : isMarketingEntitledLearner ? (
                  <>
                    {learnerExamBadge ? (
                      <div className="nn-header-tier-pill flex w-full justify-center py-2.5" role="status">
                        {learnerExamBadge}
                      </div>
                    ) : null}
                    <Link
                      href={resumeStudyingCta?.href ?? "/app"}
                      className={`nav-item ${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-[48px] items-center justify-center rounded-full px-4 py-3 text-sm font-medium`}
                      onClick={scheduleMobileDrawerClose}
                      data-nn-mobile-utility-link
                    >
                      {resumeStudyingCta?.label ?? formatTitleCase(CONTINUE_STUDYING_CTA, locale)}
                    </Link>
                    <MobileUserAccountSection
                      user={user}
                      sections={accountMenuSections}
                      displayName={accountName}
                      subscriptionLabel={subscriptionLabel}
                      learnerExamBadge={learnerExamBadge}
                      locale={locale}
                      localizeHref={localizeHref}
                      onNavigate={() => {
                        closeMegaBeforeAuthNav();
                        scheduleMobileDrawerClose();
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Link
                      href={localizeHref(HUB.pricing)}
                      className={`nav-item ${HEADER_NAV_PRIMARY_CTA} inline-flex min-h-[48px] items-center justify-center rounded-full px-4 py-3 text-sm font-medium`}
                      onClick={() => { closeMegaBeforeAuthNav(); scheduleMobileDrawerClose(); }}
                      data-nn-mobile-utility-link
                    >
                      {formatTitleCase(t("nav.pricing"), locale)}
                    </Link>
                    <MobileUserAccountSection
                      user={user}
                      sections={accountMenuSections}
                      displayName={accountName}
                      subscriptionLabel={subscriptionLabel}
                      learnerExamBadge={learnerExamBadge}
                      locale={locale}
                      localizeHref={localizeHref}
                      onNavigate={() => {
                        closeMegaBeforeAuthNav();
                        scheduleMobileDrawerClose();
                      }}
                    />
                  </>
                )}
              </div>

              {/* ── Section 2: NurseNest brand links (Tools, Pricing, About, Blog, FAQ) ── */}
              <div className="space-y-1 border-t border-[var(--header-border)] pt-4" data-nn-mobile-section="nursenest">
                <p className="px-2 text-xs font-medium uppercase tracking-widest text-[var(--nav-muted)] sm:text-[11px]">
                  NurseNest
                </p>
                {(() => {
                  const flowPractice = marketingFlowLinks.find((l) => l.key === "flow-practice");
                  const flowRest = marketingFlowLinks.filter((l) => l.key !== "flow-practice");
                  return (
                    <>
                      {flowPractice ? (
                        <HeaderNavAnchor
                          href={localizeHref(flowPractice.href)}
                          aria-current={isActivePath(strippedPath, flowPractice.matchBase) ? "page" : undefined}
                          className={`nav-item ${HEADER_NAV_PRIMARY_CTA} mb-2 flex min-h-11 w-full touch-manipulation items-center justify-center rounded-xl px-4 py-2.5 text-[15px] font-semibold`}
                          onClick={() => { trackClientEvent(PH.marketingNavClick, { actor: navActor, nav_id: flowPractice.key, surface: "site_header_mobile_drawer", marketing_region: region }); scheduleMobileDrawerClose(); }}
                          data-nn-mobile-brand-link
                        >
                          {flowPractice.label}
                        </HeaderNavAnchor>
                      ) : null}
                      <div className="mb-2 grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
                        {flowRest.map((item) => (
                          <HeaderNavAnchor
                            key={item.key}
                            href={localizeHref(item.href)}
                            aria-current={isActivePath(strippedPath, item.matchBase) ? "page" : undefined}
                            className={`nav-item flex min-h-11 touch-manipulation items-center justify-center rounded-xl border border-[var(--nav-border)] px-3 py-2.5 text-center text-sm font-medium leading-snug text-[var(--nav-muted)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--nav-fg)] ${isActivePath(strippedPath, item.matchBase) ? "border-[var(--text-accent)] text-[var(--nav-link-active)]" : ""}`}
                            onClick={() => { trackClientEvent(PH.marketingNavClick, { actor: navActor, nav_id: item.key, surface: "site_header_mobile_drawer", marketing_region: region }); scheduleMobileDrawerClose(); }}
                            data-nn-mobile-brand-link
                          >
                            {item.label}
                          </HeaderNavAnchor>
                        ))}
                      </div>
                    </>
                  );
                })()}
                {brandNavLinks.map((item) => (
                  <HeaderNavAnchor
                    key={item.key}
                    href={localizeHref(item.href)}
                    aria-current={isActivePath(strippedPath, item.matchBase) ? "page" : undefined}
                    className={`nav-item flex min-h-11 touch-manipulation items-center gap-2 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors sm:py-3 ${isActivePath(strippedPath, item.matchBase) ? "font-semibold text-[var(--nav-link-active)]" : "text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"}`}
                    data-nn-mobile-brand-link
                    onClick={() => { trackClientEvent(PH.marketingNavClick, { actor: navActor, nav_id: item.key, surface: "site_header_mobile_drawer", marketing_region: region }); scheduleMobileDrawerClose(); }}
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-100 ${isActivePath(strippedPath, item.matchBase) ? "bg-[var(--text-accent)]" : "bg-transparent"}`} aria-hidden />
                    {item.label}
                  </HeaderNavAnchor>
                ))}
              </div>

              {/* ── Section 3: Classes & Pathways (tier hubs + Pre-Nursing / ECG / HESI / TEAS) ── */}
              <nav
                aria-label={t("nav.marketingPathways")}
                className="space-y-1 border-t border-[var(--header-border)] pt-4"
                data-nn-mobile-section="classes-pathways"
              >
                <p className="px-2 text-xs font-medium uppercase tracking-widest text-[var(--nav-muted)] sm:text-[11px]">
                  {formatTitleCase(t("nav.marketingExplore"), locale)}
                </p>
                {tierHubMenus.map((menu) => (
                  <HeaderNavAnchor
                    key={menu.key}
                    href={localizeHref(menu.hubHref)}
                    aria-current={strippedPathActivatesMegaMenuKey(menu.key, strippedPath) ? "page" : undefined}
                    data-active={strippedPathActivatesMegaMenuKey(menu.key, strippedPath) || undefined}
                    className={`nav-item flex min-h-11 touch-manipulation items-center gap-2 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors sm:py-3 ${strippedPathActivatesMegaMenuKey(menu.key, strippedPath) ? "font-semibold text-[var(--nav-link-active)]" : "text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"}`}
                    data-nn-mobile-tier-link
                    onClick={() => { trackClientEvent(PH.marketingNavClick, { actor: navActor, nav_id: `${menu.key}_tier_hub`, surface: "site_header_mobile_drawer", marketing_region: region }); scheduleMobileDrawerClose(); }}
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-100 ${strippedPathActivatesMegaMenuKey(menu.key, strippedPath) ? "bg-[var(--text-accent)]" : "bg-transparent"}`} aria-hidden />
                    {menu.label}
                  </HeaderNavAnchor>
                ))}
                {pathwayMoreLinks.map((item) => (
                  <HeaderNavAnchor
                    key={item.key}
                    href={localizeHref(item.href)}
                    aria-current={isActivePath(strippedPath, item.matchBase) ? "page" : undefined}
                    className={`nav-item flex min-h-11 touch-manipulation items-center gap-2 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors sm:py-3 ${isActivePath(strippedPath, item.matchBase) ? "font-semibold text-[var(--nav-link-active)]" : "text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"}`}
                    data-nn-mobile-pathway-link
                    onClick={() => { trackClientEvent(PH.marketingNavClick, { actor: navActor, nav_id: item.key, surface: "site_header_mobile_drawer", marketing_region: region }); scheduleMobileDrawerClose(); }}
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-100 ${isActivePath(strippedPath, item.matchBase) ? "bg-[var(--text-accent)]" : "bg-transparent"}`} aria-hidden />
                    {item.label}
                  </HeaderNavAnchor>
                ))}
              </nav>

              <p className="mb-3 flex items-start gap-2 nn-marketing-body-sm text-[var(--nav-muted)]">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--theme-muted-text)]" aria-hidden />
                <span>
                  {t("nav.regionLabel")}:{" "}
                  <span className="font-medium text-[var(--nav-fg)]">
                    {effectiveGlobalRegion === "canada"
                      ? formatTitleCase(t("home.region.ca"), locale)
                      : effectiveGlobalRegion === "us"
                        ? formatTitleCase(t("home.region.us"), locale)
                        : intlRegionDisplayName ?? formatRegionSlugFallback(effectiveGlobalRegion)}
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
                  className="nav-item flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] px-3 py-2 nn-marketing-body-sm font-medium tracking-normal text-[var(--nav-fg)] hover:bg-[var(--nav-hover)]"
                >
                  {t("nav.language")}
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${mobileLangOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileLangOpen ? (
                  <div className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-[var(--nav-border)] bg-[var(--nav-bg)] p-1 shadow-[var(--shadow-elevated)]">
                    <MarketingLanguagePreferenceListLazy
                      onDone={() => setMobileLangOpen(false)}
                      renderItem={({ code, name, flag, disabled, onSelect }) => (
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={onSelect}
                          className={`nav-item flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left nn-marketing-body-sm font-medium tracking-normal hover:bg-[var(--nav-hover)] ${
                            code === locale
                              ? "bg-[var(--nav-active)] text-[var(--nav-on-active-fg)]"
                              : "text-[var(--nav-fg)]"
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

              {publicMarketingThemeChoiceCount() > 1 ? (
                <div className="mb-2">
                  <ThemePickerLazy
                    pickerScope="publicMarketing"
                    labels={{
                      navTheme: t("nav.theme"),
                      themeGroupLight: t("nav.themeGroupLight"),
                      themeGroupDark: t("nav.themeGroupDark"),
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>,
            document.body,
          )
        : null}
    </div>
  );
}
