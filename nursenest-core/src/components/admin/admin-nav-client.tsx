"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutDashboard, Menu, Search, X } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  getVisibleAdminNavGroups,
  isAdminNavItemActive,
  type AdminNavGroup,
} from "@/components/admin/admin-navigation-config";
import type { StaffTier } from "@/lib/auth/staff-roles";

function filterGroups(groups: AdminNavGroup[], query: string): AdminNavGroup[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return groups;
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        `${group.title} ${item.label} ${item.href}`.toLowerCase().includes(normalized),
      ),
    }))
    .filter((group) => group.items.length > 0);
}

export function AdminNavClient({ staffTier = "super" }: { staffTier?: StaffTier }) {
  const pathname = usePathname() || "/admin";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");

  const close = useCallback(() => setSidebarOpen(false), []);
  const groups = useMemo(() => getVisibleAdminNavGroups(staffTier), [staffTier]);
  const visibleGroups = useMemo(() => filterGroups(groups, query), [groups, query]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen, close]);

  const navBody = (
    <>
      <div className="border-b border-border/70 px-4 py-5">
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-2xl px-1 py-1 text-[var(--theme-heading-text)]"
          onClick={close}
        >
          <span className="nn-admin-happy-nav-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border">
            <LayoutDashboard className="h-4 w-4" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold tracking-tight">NurseNest Admin</span>
            <span className="block truncate text-[11px] font-medium text-muted-foreground">
              Operations console
            </span>
          </span>
        </Link>
      </div>

      <div className="border-b border-border/70 px-4 py-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <span className="sr-only">Search admin navigation</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search admin"
            className="h-10 w-full rounded-xl border border-[var(--admin-happy-border)] bg-white pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-[color-mix(in_srgb,var(--admin-happy-blue)_40%,white)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--admin-happy-blue)_18%,transparent)]"
          />
        </label>
        {staffTier !== "super" ? (
          <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] font-medium leading-snug text-amber-950 dark:text-amber-100">
            {staffTier === "content" ? "Content admin" : "Support / viewer"} access. Navigation is role-limited.
          </p>
        ) : null}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
        {visibleGroups.length > 0 ? (
          visibleGroups.map((group) => (
            <section key={group.id} className="mb-6 last:mb-0">
              <h2 className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {group.title}
              </h2>
              <ul className="space-y-1.5">
                {group.items.map((item) => {
                  const active = isAdminNavItemActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`group flex min-w-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                          active
                            ? "nn-admin-happy-nav-active"
                            : "text-muted-foreground hover:bg-white hover:text-[var(--theme-heading-text)]"
                        }`}
                        onClick={close}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-85" aria-hidden />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {item.badge != null && item.badge > 0 ? (
                          <span className="shrink-0 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-200">
                            {item.badge > 99 ? "99+" : item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        ) : (
          <p className="rounded-xl border border-border/70 bg-[var(--theme-muted-surface)]/40 px-3 py-3 text-sm text-muted-foreground">
            No admin links match “{query}”.
          </p>
        )}
      </nav>

      <div className="shrink-0 border-t border-border/70 bg-white px-4 py-4">
        <div className="mb-3 grid grid-cols-2 gap-2 text-xs font-semibold">
          <Link
            href="/"
            className="rounded-xl border border-[var(--admin-happy-border)] bg-white px-3 py-2.5 text-center text-muted-foreground hover:bg-[var(--admin-happy-blue-soft)] hover:text-[var(--semantic-info-contrast)]"
            onClick={close}
          >
            View site
          </Link>
          <Link
            href="/app"
            className="rounded-xl border border-[color-mix(in_srgb,var(--admin-happy-green)_25%,white)] bg-[var(--admin-happy-green-soft)] px-3 py-2.5 text-center text-[var(--semantic-success-contrast)] hover:brightness-[0.98]"
            onClick={close}
          >
            Learner app
          </Link>
        </div>
        <SignOutButton
          className="nn-admin-happy-btn nn-admin-happy-btn--yellow flex min-h-[44px] w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--admin-happy-yellow)_35%,transparent)]"
          onBeforeSignOut={close}
        />
      </div>
    </>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--admin-happy-border)] bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/85 lg:hidden">
        <Link href="/admin" className="text-sm font-bold text-[var(--theme-heading-text)]">
          NurseNest admin
        </Link>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-muted/35 px-3 text-sm font-semibold"
          aria-expanded={sidebarOpen}
          aria-controls="admin-nav-drawer"
          onClick={() => setSidebarOpen((open) => !open)}
        >
          {sidebarOpen ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          Menu
        </button>
      </div>

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          aria-label="Close admin menu"
          onClick={close}
        />
      ) : null}

      <aside
        id="admin-nav-drawer"
        className={`nn-admin-happy-sidebar fixed inset-y-0 left-0 z-50 flex w-[min(19rem,92vw)] min-w-0 flex-col border-r shadow-2xl transition-transform duration-200 ease-out lg:w-72 lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "pointer-events-none -translate-x-full lg:pointer-events-auto"
        }`}
      >
        {navBody}
      </aside>
    </>
  );
}
