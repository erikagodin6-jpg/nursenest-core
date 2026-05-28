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
      <div className="border-b border-border/70 px-4 py-4">
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-2xl px-1 py-1 text-[var(--theme-heading-text)]"
          onClick={close}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
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

      <div className="border-b border-border/70 px-4 py-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <span className="sr-only">Search admin navigation</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search admin"
            className="h-9 w-full rounded-xl border border-border/80 bg-[var(--theme-muted-surface)]/55 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
          />
        </label>
        {staffTier !== "super" ? (
          <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] font-medium leading-snug text-amber-950 dark:text-amber-100">
            {staffTier === "content" ? "Content admin" : "Support / viewer"} access. Navigation is role-limited.
          </p>
        ) : null}
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        {visibleGroups.length > 0 ? (
          visibleGroups.map((group) => (
            <section key={group.id} className="mb-5 last:mb-0">
              <h2 className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {group.title}
              </h2>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = isAdminNavItemActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`group flex min-w-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                          active
                            ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                            : "text-muted-foreground hover:bg-[var(--theme-muted-surface)]/70 hover:text-[var(--theme-heading-text)]"
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

      <div className="shrink-0 border-t border-border/70 bg-[var(--theme-card-bg)] px-4 py-3">
        <div className="mb-3 grid grid-cols-2 gap-2 text-xs font-semibold">
          <Link
            href="/"
            className="rounded-xl border border-border/80 px-3 py-2 text-center text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            onClick={close}
          >
            View site
          </Link>
          <Link
            href="/app"
            className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-center text-primary hover:bg-primary/15"
            onClick={close}
          >
            Learner app
          </Link>
        </div>
        <SignOutButton
          className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-border bg-[var(--theme-muted-surface)]/35 px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
          onBeforeSignOut={close}
        />
      </div>
    </>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/80 bg-[var(--theme-card-bg)]/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-[var(--theme-card-bg)]/80 lg:hidden">
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
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(19rem,92vw)] min-w-0 flex-col border-r border-border/80 bg-[var(--theme-card-bg)] shadow-2xl transition-transform duration-200 ease-out lg:w-72 lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "pointer-events-none -translate-x-full lg:pointer-events-auto"
        }`}
      >
        {navBody}
      </aside>
    </>
  );
}
