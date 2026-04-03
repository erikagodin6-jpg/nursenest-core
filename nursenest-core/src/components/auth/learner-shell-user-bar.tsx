"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronDown, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

function isAdminRole(role: unknown): boolean {
  return role === "ADMIN";
}

/**
 * Learner app shell: account dropdown (identity, admin, sign out) beside theme control.
 */
export function LearnerShellUserBar() {
  const { t } = useMarketingI18n();
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
    return <span className="h-9 w-32 animate-pulse rounded-full bg-primary/10" aria-hidden />;
  }

  if (status !== "authenticated" || !session?.user) {
    return null;
  }

  const user = session.user;
  const label = user.email ?? user.name ?? `ID ${user.id?.slice(0, 8)}…`;
  const admin = isAdminRole(user.role);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex max-w-[16rem] items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-sm font-medium text-[var(--theme-menu-text)] hover:bg-[var(--surface-interactive-hover)]"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <User className="h-4 w-4 shrink-0" aria-hidden />
        <span className="truncate">{label}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-1 min-w-[13rem] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-1 shadow-[var(--shadow-elevated)]"
        >
          <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
            <div className="font-mono text-[11px] text-foreground" title={user.id}>
              {user.id}
            </div>
            {admin ? (
              <span className="mt-1 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                {t("account.role.admin")}
              </span>
            ) : null}
          </div>
          <Link
            href="/app/profile"
            className="block px-3 py-2 text-sm font-medium hover:bg-[var(--surface-interactive-hover)]"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            {t("learner.nav.profileAccount")}
          </Link>
          <Link
            href="/app"
            className="block px-3 py-2 text-sm hover:bg-[var(--surface-interactive-hover)]"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            {t("dashboard.breadcrumbDashboard")}
          </Link>
          {admin ? (
            <Link
              href="/admin"
              className="block px-3 py-2 text-sm font-medium text-primary hover:bg-[var(--surface-interactive-hover)]"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {t("nav.admin")}
            </Link>
          ) : null}
          <button
            type="button"
            className="block w-full border-t border-[var(--border-subtle)] px-3 py-2 text-left text-sm hover:bg-[var(--surface-interactive-hover)]"
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
