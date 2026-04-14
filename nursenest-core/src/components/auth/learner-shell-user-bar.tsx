"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronDown, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { isStaffRole } from "@/lib/auth/staff-roles";
import { UserFeedbackAccountMenuItem } from "@/components/feedback/user-feedback-account-menu-item";

const ADMIN_DASHBOARD_ROUTE = "/admin" as const;

type MenuItem = { href: string; i18nKey: string };

const STUDY_LINKS: MenuItem[] = [
  { href: "/app", i18nKey: "learner.userBar.link.dashboard" },
  { href: "/app/account/overview", i18nKey: "learner.userBar.link.accountOverview" },
];

const PERFORMANCE_LINKS: MenuItem[] = [
  { href: "/app/account/report-card", i18nKey: "learner.userBar.link.reportCard" },
  { href: "/app/account/readiness", i18nKey: "learner.userBar.link.readiness" },
  { href: "/app/account/progress", i18nKey: "learner.userBar.link.progress" },
  { href: "/app/account/question-bank-performance", i18nKey: "learner.userBar.link.questionBankPerf" },
  { href: "/app/account/focus-areas", i18nKey: "learner.userBar.link.focusAreas" },
];

const ACTIVITY_LINKS: MenuItem[] = [
  { href: "/app/account/study-history", i18nKey: "learner.userBar.link.studyHistory" },
  { href: "/app/account/cat-history", i18nKey: "learner.userBar.link.catHistory" },
  { href: "/app/account/review-queue", i18nKey: "learner.userBar.link.reviewQueue" },
];

const ACCOUNT_LINKS: MenuItem[] = [
  { href: "/app/account/billing", i18nKey: "learner.userBar.link.subscription" },
  { href: "/app/account/personal", i18nKey: "learner.userBar.link.personal" },
  { href: "/app/account/study-preferences", i18nKey: "learner.userBar.link.settings" },
  { href: "/app/account/security", i18nKey: "learner.userBar.link.security" },
];

function tierDisplayKey(tier: string): string {
  const map: Record<string, string> = {
    RPN: "learner.userBar.tier.RPN",
    LVN_LPN: "learner.userBar.tier.LVN_LPN",
    RN: "learner.userBar.tier.RN",
    NP: "learner.userBar.tier.NP",
    ALLIED: "learner.userBar.tier.ALLIED",
  };
  return map[tier] ?? "learner.userBar.tier.fallback";
}

function countryDisplayKey(country: string): string {
  if (country === "CA") return "learner.userBar.region.CA";
  if (country === "US") return "learner.userBar.region.US";
  return "learner.userBar.region.fallback";
}

export function LearnerShellUserBar({ pathwayShortLabel = null }: { pathwayShortLabel?: string | null }) {
  const { t } = useMarketingI18n();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onDoc = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (status === "loading") {
    return <span className="h-10 w-36 animate-pulse rounded-full bg-primary/[0.08]" aria-hidden />;
  }

  if (status !== "authenticated" || !session?.user) {
    return null;
  }

  const user = session.user;
  const displayName = user.name?.trim() || user.email?.split("@")[0] || t("learner.userBar.fallbackName");
  const emailLine = user.email?.trim() ?? "";
  const admin = isStaffRole(user.role);
  const sub = user.subscriptionStatus ?? "none";
  const tier = user.tier ?? "";
  const country = user.country ?? "";

  const planKey =
    sub === "active"
      ? "learner.userBar.plan.active"
      : sub === "grace"
        ? "learner.userBar.plan.grace"
        : sub === "past_due"
          ? "learner.userBar.plan.past_due"
          : "learner.userBar.plan.none";

  const scopeLine =
    tier && country
      ? `${t(tierDisplayKey(tier))} · ${t(countryDisplayKey(country))}`
      : tier
        ? t(tierDisplayKey(tier))
        : "";

  const linkClass =
    "block touch-manipulation rounded-lg px-3 py-2 text-sm text-[var(--theme-menu-text)] transition-colors hover:bg-[var(--surface-interactive-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25";

  const sectionLabelClass =
    "px-3 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground first:pt-2";

  const renderGroup = (labelKey: string, items: MenuItem[]) => (
    <div role="group" aria-label={t(labelKey)}>
      <div className={sectionLabelClass}>{t(labelKey)}</div>
      <div className="space-y-0.5 px-1.5 pb-1">
        {items.map(({ href, i18nKey }) => (
          <Link
            key={href}
            href={href}
            className={linkClass}
            role="menuitem"
            onClick={close}
          >
            {t(i18nKey)}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex max-w-[min(17rem,72vw)] touch-manipulation items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-left text-sm font-medium text-[var(--theme-menu-text)] shadow-sm transition-[box-shadow,background-color] hover:bg-[var(--surface-interactive-hover)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/[0.1] text-primary">
          <User className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold leading-tight text-foreground">{displayName}</span>
          {emailLine ? (
            <span className="block truncate text-[11px] font-normal text-muted-foreground">{emailLine}</span>
          ) : null}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-[min(19.5rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-[var(--shadow-elevated)] ring-1 ring-black/[0.03] dark:ring-white/[0.04]"
        >
          <div className="border-b border-[var(--border-subtle)] bg-gradient-to-br from-primary/[0.07] via-transparent to-emerald-500/[0.04] px-4 py-3">
            <p className="text-[11px] font-medium leading-relaxed text-muted-foreground">{t(planKey)}</p>
            {scopeLine ? (
              <p className="mt-0.5 text-xs font-medium text-foreground/90">{scopeLine}</p>
            ) : null}
            <p className="mt-2 border-t border-[var(--border-subtle)]/80 pt-2 text-[11px] leading-snug text-muted-foreground">
              {pathwayShortLabel?.trim()
                ? t("learner.userBar.pathwaySet", { pathway: pathwayShortLabel.trim() })
                : t("learner.userBar.pathwayUnset")}
            </p>
            {admin ? (
              <span className="mt-2 inline-flex rounded-md bg-primary/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                {t("account.role.admin")}
              </span>
            ) : null}
          </div>

          <div className="max-h-[min(22rem,70vh)] overflow-y-auto overscroll-contain py-1">
            {renderGroup("learner.userBar.section.study", STUDY_LINKS)}
            <div className="mx-3 my-1 h-px bg-[var(--border-subtle)]/90" aria-hidden />
            {renderGroup("learner.userBar.section.performance", PERFORMANCE_LINKS)}
            <div className="mx-3 my-1 h-px bg-[var(--border-subtle)]/90" aria-hidden />
            {renderGroup("learner.userBar.section.activity", ACTIVITY_LINKS)}
            <div className="mx-3 my-1 h-px bg-[var(--border-subtle)]/90" aria-hidden />
            {renderGroup("learner.userBar.section.account", ACCOUNT_LINKS)}
          </div>

          {admin ? (
            <div className="border-t border-[var(--border-subtle)] px-2 py-1.5">
              <Link
                href={ADMIN_DASHBOARD_ROUTE}
                className={`${linkClass} font-medium text-primary`}
                role="menuitem"
                onClick={close}
              >
                {t("nav.admin")}
              </Link>
            </div>
          ) : null}
          <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-muted)]/30 p-2">
            <UserFeedbackAccountMenuItem
              onActivate={close}
              className={`${linkClass} mb-1.5 w-full border-0 text-left text-foreground`}
            />
            <button
              type="button"
              className="w-full touch-manipulation rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-[var(--surface-interactive-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
              role="menuitem"
              onClick={() => void signOut({ redirectTo: "/" })}
            >
              {t("nav.signout")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
