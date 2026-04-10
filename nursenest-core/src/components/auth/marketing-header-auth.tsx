"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronDown, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import { isStaffRole } from "@/lib/auth/staff-roles";

const SIGN_IN_CLASS =
  "nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-menu-text)] transition-colors duration-150 hover:text-primary inline-flex items-center rounded-full px-2 py-1.5 sm:px-3 sm:py-2";

const GET_STARTED_CLASS =
  "nn-button-primary px-4 py-2 rounded-xl inline-flex min-h-0 items-center justify-center text-sm font-medium text-[var(--role-cta-foreground,#ffffff)]";

function useLocalizeHref() {
  const { locale } = useMarketingI18n();
  return useCallback(
    (href: string) => {
      const mapped = mapLegacyMarketingHref(href);
      if (mapped.startsWith("http://") || mapped.startsWith("https://")) return mapped;
      return withMarketingLocale(locale, mapped);
    },
    [locale],
  );
}

/**
 * Marketing header: Sign in + Get Started (guests) or account menu (signed-in). Same component at all breakpoints.
 */
export function MarketingHeaderAuthDesktop() {
  const { t } = useMarketingI18n();
  const localizeHref = useLocalizeHref();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  if (status === "loading") {
    return (
      <span className="inline-flex h-8 w-24 shrink-0 animate-pulse rounded-xl bg-primary/10 sm:w-28" aria-hidden="true" />
    );
  }

  if (status !== "authenticated" || !session?.user) {
    const loginToApp = localizeHref(`/login?callbackUrl=${encodeURIComponent("/app")}`);
    const signupToApp = localizeHref(`/signup?callbackUrl=${encodeURIComponent("/app")}`);
    return (
      <div className="flex max-w-[100vw] items-center gap-1.5 sm:gap-2">
        <Link href={loginToApp} className={SIGN_IN_CLASS}>
          {t("nav.logIn")}
        </Link>
        <Link href={signupToApp} className={GET_STARTED_CLASS}>
          {t("nav.getStarted")}
        </Link>
      </div>
    );
  }

  const user = session.user;
  const label = user.email ?? user.name ?? (user.id ? `${user.id.slice(0, 8)}…` : t("nav.account"));
  const admin = isStaffRole(user.role);

  return (
    <div className="relative inline-block max-w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex max-w-[min(100%,12rem)] items-center gap-1 rounded-full border border-[var(--theme-nav-border)] px-2 py-1.5 nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)] sm:max-w-[14rem] sm:px-3 sm:py-2"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <User className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
        <span className="min-w-0 max-w-full text-start leading-tight break-words [overflow-wrap:anywhere]">{label}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute end-0 z-[100] mt-1 min-w-[13rem] rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] py-1 shadow-lg"
        >
          <div className="border-b border-[var(--theme-separator)] px-3 py-2 text-xs text-[var(--theme-muted-text)]">
            <div className="font-mono text-[11px] text-foreground/80" title={user.id}>
              {t("account.idPrefix")} {user.id?.slice(0, 8)}…
            </div>
            {admin ? (
              <span className="mt-1 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                {t("account.role.admin")}
              </span>
            ) : null}
          </div>
          <Link
            href="/app"
            className="block break-words px-3 py-2 text-start nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-menu-text)] [overflow-wrap:anywhere] hover:bg-[var(--theme-menu-hover-bg)]"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            {t("nav.learnerApp")}
          </Link>
          {admin ? (
            <Link
              href="/admin"
              className="block break-words px-3 py-2 text-start nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-menu-text)] [overflow-wrap:anywhere] hover:bg-[var(--theme-menu-hover-bg)]"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {t("nav.admin")}
            </Link>
          ) : null}
          <button
            type="button"
            className="block w-full border-t border-[var(--theme-separator)] px-3 py-2 text-start nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)]"
            role="menuitem"
            onClick={() => void signOut({ callbackUrl: "/" })}
          >
            {t("nav.signout")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Mobile drawer account block (optional; header bar uses {@link MarketingHeaderAuthDesktop} at all sizes).
 */
export function MarketingHeaderAuthMobile({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useMarketingI18n();
  const localizeHref = useLocalizeHref();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-10 animate-pulse rounded-xl bg-primary/10" aria-hidden />;
  }

  if (status !== "authenticated" || !session?.user) {
    const loginToApp = localizeHref(`/login?callbackUrl=${encodeURIComponent("/app")}`);
    const signupToApp = localizeHref(`/signup?callbackUrl=${encodeURIComponent("/app")}`);
    return (
      <div className="mt-4 flex gap-2">
        <Link href={loginToApp} className={`${SIGN_IN_CLASS} flex-1 justify-center border border-[var(--theme-nav-border)] py-2`} onClick={onNavigate}>
          {t("nav.logIn")}
        </Link>
        <Link href={signupToApp} className={`${GET_STARTED_CLASS} flex-1`} onClick={onNavigate}>
          {t("nav.getStarted")}
        </Link>
      </div>
    );
  }

  const user = session.user;
  const label = user.email ?? user.name ?? `${t("account.idPrefix")} ${user.id?.slice(0, 8)}…`;
  const admin = isStaffRole(user.role);

  return (
    <div className="mt-4 space-y-2 border-t border-[var(--theme-separator)] pt-4">
      <p className="break-words nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-muted-text)] [overflow-wrap:anywhere]">{label}</p>
      <p className="font-mono text-xs text-[var(--theme-muted-text)]">
        {t("account.idPrefix")} {user.id}
      </p>
      {admin ? <p className="text-xs font-semibold text-primary">{t("account.role.administrator")}</p> : null}
      <Link
        href="/app"
        className="block rounded-xl border border-[var(--theme-card-border)] px-3 py-2.5 nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)]"
        onClick={onNavigate}
      >
        {t("nav.learnerApp")}
      </Link>
      {admin ? (
        <Link
          href="/admin"
          className="block rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 nn-marketing-body-sm font-medium tracking-normal text-primary hover:bg-primary/10"
          onClick={onNavigate}
        >
          {t("nav.admin")}
        </Link>
      ) : null}
      <button
        type="button"
        className="w-full rounded-xl border border-[var(--theme-nav-border)] px-3 py-2.5 nn-marketing-body-sm font-medium tracking-normal text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)]"
        onClick={() => void signOut({ callbackUrl: "/" })}
      >
        {t("nav.signout")}
      </button>
    </div>
  );
}
