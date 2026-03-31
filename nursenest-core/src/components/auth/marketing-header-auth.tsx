"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronDown, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";

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

function isAdminRole(role: unknown): boolean {
  return role === "ADMIN";
}

/**
 * Desktop: signed-in account dropdown vs Log in / Sign up (marketing header).
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
      <span
        className="hidden h-9 w-28 shrink-0 animate-pulse rounded-full bg-primary/10 sm:inline-block"
        aria-hidden="true"
      />
    );
  }

  if (status !== "authenticated" || !session?.user) {
    return (
      <>
        <Link
          href={localizeHref("/login")}
          className="hidden rounded-full px-3 py-2 text-sm font-medium text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)] hover:text-[var(--theme-menu-hover-text)] sm:inline-flex"
        >
          {t("nav.logIn")}
        </Link>
        <Link href={localizeHref("/signup")} className="hidden nn-btn-primary px-4 py-2 text-sm font-bold sm:inline-flex">
          {t("nav.signUp")}
        </Link>
      </>
    );
  }

  const user = session.user;
  const label = user.email ?? user.name ?? (user.id ? `${user.id.slice(0, 8)}…` : "Account");
  const admin = isAdminRole(user.role);

  return (
    <div className="relative hidden sm:block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex max-w-[14rem] items-center gap-1 rounded-full border border-[var(--theme-nav-border)] px-3 py-2 text-sm font-medium text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)]"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <User className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
        <span className="truncate">{label}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-[100] mt-1 min-w-[13rem] rounded-xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] py-1 shadow-lg"
        >
          <div className="border-b border-[var(--theme-separator)] px-3 py-2 text-xs text-[var(--theme-muted-text)]">
            <div className="font-mono text-[11px] text-foreground/80" title={user.id}>
              ID {user.id?.slice(0, 8)}…
            </div>
            {admin ? (
              <span className="mt-1 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                Admin
              </span>
            ) : null}
          </div>
          <Link
            href="/app"
            className="block px-3 py-2 text-sm text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)]"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Learner app
          </Link>
          {admin ? (
            <Link
              href="/admin"
              className="block px-3 py-2 text-sm text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)]"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Admin dashboard
            </Link>
          ) : null}
          <button
            type="button"
            className="block w-full border-t border-[var(--theme-separator)] px-3 py-2 text-left text-sm text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)]"
            role="menuitem"
            onClick={() => void signOut({ callbackUrl: "/" })}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Mobile drawer: account actions vs Log in / Sign up.
 */
export function MarketingHeaderAuthMobile({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useMarketingI18n();
  const localizeHref = useLocalizeHref();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-10 animate-pulse rounded-xl bg-primary/10" aria-hidden />;
  }

  if (status !== "authenticated" || !session?.user) {
    return (
      <div className="mt-4 flex gap-2">
        <Link
          href={localizeHref("/login")}
          className="flex-1 rounded-full border border-[var(--theme-nav-border)] py-2 text-center text-sm font-semibold"
          onClick={onNavigate}
        >
          {t("nav.logIn")}
        </Link>
        <Link
          href={localizeHref("/signup")}
          className="nn-btn-primary flex-1 py-2 text-center text-sm font-bold"
          onClick={onNavigate}
        >
          {t("nav.signUp")}
        </Link>
      </div>
    );
  }

  const user = session.user;
  const label = user.email ?? user.name ?? `ID ${user.id?.slice(0, 8)}…`;
  const admin = isAdminRole(user.role);

  return (
    <div className="mt-4 space-y-2 border-t border-[var(--theme-separator)] pt-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{label}</p>
      <p className="font-mono text-xs text-[var(--theme-muted-text)]">ID {user.id}</p>
      {admin ? (
        <p className="text-xs font-semibold text-primary">Administrator</p>
      ) : null}
      <Link
        href="/app"
        className="block rounded-xl border border-[var(--theme-card-border)] px-3 py-2.5 text-sm font-semibold text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)]"
        onClick={onNavigate}
      >
        Learner app
      </Link>
      {admin ? (
        <Link
          href="/admin"
          className="block rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10"
          onClick={onNavigate}
        >
          Admin dashboard
        </Link>
      ) : null}
      <button
        type="button"
        className="w-full rounded-xl border border-[var(--theme-nav-border)] px-3 py-2.5 text-sm font-semibold text-[var(--theme-menu-text)] hover:bg-[var(--theme-menu-hover-bg)]"
        onClick={() => void signOut({ callbackUrl: "/" })}
      >
        Sign out
      </button>
    </div>
  );
}
