"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronDown, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";

function isAdminRole(role: unknown): boolean {
  return role === "ADMIN";
}

const ACCOUNT_LINKS = [
  { href: "/app/account/overview", key: "learner.account.menu.accountHub" as const },
  { href: "/app/account/report-card", key: "learner.account.nav.reportCard" as const },
  { href: "/app/account/readiness", key: "learner.account.nav.readiness" as const },
  { href: "/app/account/progress", key: "learner.account.nav.progress" as const },
  { href: "/app/account/billing", key: "learner.account.nav.billing" as const },
  { href: "/app/account/personal", key: "learner.account.nav.personal" as const },
  { href: "/app/account/settings", key: "learner.account.nav.settings" as const },
  { href: "/app/account/security", key: "learner.account.nav.security" as const },
  { href: "/app/account/study-preferences", key: "learner.account.nav.studyPreferences" as const },
] as const;

/**
 * Learner app shell: account dropdown — dashboard, full account hub, admin, sign out.
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

  const linkClass =
    "block px-3 py-2.5 text-sm hover:bg-[var(--surface-interactive-hover)] text-[var(--theme-menu-text)]";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex max-w-[min(16rem,72vw)] items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-sm font-medium text-[var(--theme-menu-text)] hover:bg-[var(--surface-interactive-hover)]"
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
          className="absolute right-0 z-50 mt-1 max-h-[min(28rem,85vh)] w-[min(18rem,calc(100vw-1.5rem))] overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-1 shadow-[var(--shadow-elevated)]"
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
            href="/app"
            className={`${linkClass} font-medium`}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            {t("learner.account.menu.dashboardOverview")}
          </Link>

          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t("learner.account.menu.sectionAccount")}
          </div>
          {ACCOUNT_LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={linkClass}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {t(key)}
            </Link>
          ))}

          {admin ? (
            <Link
              href="/admin"
              className={`${linkClass} border-t border-[var(--border-subtle)] font-medium text-primary`}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {t("nav.admin")}
            </Link>
          ) : null}
          <button
            type="button"
            className="block w-full border-t border-[var(--border-subtle)] px-3 py-2.5 text-left text-sm hover:bg-[var(--surface-interactive-hover)]"
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
