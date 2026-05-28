"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import {
  getVisibleAdminNavGroups,
  isAdminNavItemActive,
  type AdminNavItem,
} from "@/components/admin/admin-navigation-config";
import type { StaffTier } from "@/lib/auth/staff-roles";

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: AdminNavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex min-w-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-primary/10 text-primary ring-1 ring-primary/20"
          : "text-muted-foreground hover:bg-[var(--theme-muted-surface)]/70 hover:text-[var(--theme-heading-text)]"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge != null && item.badge > 0 ? (
        <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-200">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      ) : null}
    </Link>
  );
}

export function AdminSidebarNav({
  queuedBlogHint,
  pendingAiHint,
  staffTier = "super",
}: {
  queuedBlogHint?: number;
  pendingAiHint?: number;
  staffTier?: StaffTier;
}) {
  const pathname = usePathname() || "/admin";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const sections = useMemo(() => {
    const hints = (queuedBlogHint ?? 0) + (pendingAiHint ?? 0);
    return getVisibleAdminNavGroups(staffTier).map((section) => ({
      ...section,
      items: section.items.map((item) =>
        item.href === "/admin/hub/publishing" || item.href === "/admin/hub/ai"
          ? { ...item, badge: hints || undefined }
          : item,
      ),
    }));
  }, [pendingAiHint, queuedBlogHint, staffTier]);

  const asideClass =
    "fixed inset-y-0 left-0 z-50 flex w-[min(19rem,92vw)] flex-col border-r border-border/80 bg-[var(--theme-card-bg)] text-foreground shadow-2xl transition-transform duration-200 lg:static lg:z-0 lg:w-72 lg:translate-x-0 lg:shadow-none " +
    (open ? "translate-x-0" : "-translate-x-full lg:translate-x-0");

  return (
    <>
      <aside id="admin-sidebar" className={asideClass} aria-label="Admin sidebar">
        <div className="flex h-14 items-center justify-between border-b border-border/80 px-4 lg:h-16">
          <Link href="/admin" className="font-semibold tracking-tight text-[var(--theme-heading-text)]" onClick={() => setOpen(false)}>
            NurseNest <span className="text-primary">Admin</span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          {staffTier !== "super" ? (
            <p className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] font-medium leading-snug text-amber-950 dark:text-amber-100">
              {staffTier === "content" ? "Content admin" : "Support / viewer"} — limited navigation.
            </p>
          ) : null}
          {sections.map((section) => (
            <section key={section.id} className="mb-5 last:mb-0">
              <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {section.title}
              </h2>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      item={item}
                      active={isAdminNavItemActive(pathname, item.href)}
                      onNavigate={() => setOpen(false)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
        <div className="border-t border-border/80 p-3 text-[11px] text-muted-foreground">
          Signed-in admins only. All actions are audited server-side.
        </div>
      </aside>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          aria-label="Close menu backdrop"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/80 bg-[var(--theme-card-bg)]/95 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-muted/35 px-3 text-sm font-semibold"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="admin-sidebar"
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>
        <span className="text-sm font-semibold text-[var(--theme-heading-text)]">Admin</span>
      </div>
    </>
  );
}
