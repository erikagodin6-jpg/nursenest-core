"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  BookOpen,
  ClipboardList,
  CircleDollarSign,
  Cog,
  FileText,
  BookMarked,
  GraduationCap,
  ImageIcon,
  LayoutDashboard,
  Layers,
  Link2,
  ListTodo,
  Menu,
  Search,
  Shield,
  Sparkles,
  Stethoscope,
  Users,
  Users2,
  Wrench,
  X,
  Globe,
  Workflow,
  Upload,
} from "lucide-react";
import { isNavHrefAllowedForStaffTier } from "@/lib/auth/admin-path-policy";
import type { StaffTier } from "@/lib/auth/staff-roles";

type NavItem = { href: string; label: string; icon: React.ElementType; badge?: number };

type NavSection = { title: string; items: NavItem[] };

const sections: NavSection[] = [
  {
    title: "Command",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/generation", label: "Content generation", icon: Sparkles },
      { href: "/admin/blog", label: "Blog library", icon: BookOpen },
      { href: "/admin/blog/control-panel", label: "Blog AI panel", icon: Sparkles },
      { href: "/admin/lessons", label: "Lessons", icon: GraduationCap },
      { href: "/admin/questions", label: "Question bank", icon: ClipboardList },
      { href: "/admin/questions/import", label: "Bulk question import", icon: Upload },
      { href: "/admin/content", label: "Pathway coverage", icon: Layers },
    ],
  },
  {
    title: "Growth & access",
    items: [
      { href: "/admin/seo", label: "SEO & internal links", icon: Link2 },
      { href: "/admin/media", label: "Media & images", icon: ImageIcon },
      { href: "/admin/users", label: "Users & support lookup", icon: Users },
      { href: "/admin/analytics/users", label: "User analytics", icon: Users2 },
      { href: "/admin/analytics/content", label: "Content analytics", icon: BookMarked },
      { href: "/admin/analytics/subscriptions", label: "Subscription analytics", icon: CircleDollarSign },
      { href: "/admin/analytics/funnels", label: "Funnels", icon: Workflow },
      { href: "/admin/analytics/study-performance", label: "Study performance", icon: BookMarked },
      { href: "/admin/subscriptions", label: "Subscriptions", icon: Activity },
    ],
  },
  {
    title: "Reliability",
    items: [
      { href: "/admin/analytics", label: "Analytics & performance", icon: BarChart3 },
      { href: "/admin/settings", label: "Site settings", icon: Cog },
      { href: "/admin/queue", label: "Queue & automation", icon: ListTodo },
    ],
  },
  {
    title: "Systems",
    items: [
      { href: "/admin/content-quality", label: "Content quality", icon: Search },
      { href: "/admin/operations", label: "Operations", icon: Wrench },
      { href: "/admin/diagnostics", label: "Diagnostics", icon: Stethoscope },
      { href: "/admin/premium-protection", label: "Premium protection", icon: Shield },
      { href: "/admin/i18n", label: "i18n", icon: Globe },
      { href: "/admin/ai/exam-questions", label: "AI · Question studio", icon: Sparkles },
      { href: "/admin/ai/exam-questions/batch", label: "AI · Question batch", icon: Sparkles },
      { href: "/admin/ai/flashcards", label: "AI · Flashcards", icon: Sparkles },
      { href: "/admin/ai/review", label: "AI · Review queue", icon: FileText },
    ],
  },
];

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge != null && item.badge > 0 ? (
        <span className="rounded-full bg-amber-500/25 px-1.5 py-0.5 text-[10px] font-bold text-amber-100">
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

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"));

  const visibleSections = sections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((item) => isNavHrefAllowedForStaffTier(staffTier, item.href)),
    }))
    .filter((sec) => sec.items.length > 0);

  const asideClass =
    "fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,17.5rem)] flex-col border-r border-white/10 bg-slate-950 text-slate-100 shadow-2xl transition-transform duration-200 lg:static lg:z-0 lg:w-64 lg:translate-x-0 lg:shadow-none " +
    (open ? "translate-x-0" : "-translate-x-full lg:translate-x-0");

  return (
    <>
      <aside id="admin-sidebar" className={asideClass} aria-label="Admin sidebar">
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 lg:h-16">
          <Link href="/admin" className="font-semibold tracking-tight text-white" onClick={() => setOpen(false)}>
            NurseNest <span className="text-primary">Admin</span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {staffTier !== "super" ? (
            <p className="mb-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-[10px] font-medium leading-snug text-amber-100">
              {staffTier === "content" ? "Content admin" : "Support / viewer"} — limited navigation.
            </p>
          ) : null}
          {visibleSections.map((sec) => (
            <div key={sec.title} className="mb-6">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{sec.title}</p>
              <ul className="space-y-0.5">
                {sec.items.map((item) => {
                  let badge = item.badge;
                  if (item.href === "/admin/generation" && (queuedBlogHint || pendingAiHint)) {
                    badge = (queuedBlogHint ?? 0) + (pendingAiHint ?? 0);
                  }
                  const withBadge = badge != null ? { ...item, badge } : item;
                  return (
                    <li key={item.href}>
                      <NavLink item={withBadge} active={isActive(item.href)} onNavigate={() => setOpen(false)} />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3 text-[11px] text-slate-500">
          Signed-in admins only. All actions are audited server-side.
        </div>
      </aside>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close menu backdrop"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/80 bg-[var(--theme-card-bg)]/95 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm font-medium"
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
