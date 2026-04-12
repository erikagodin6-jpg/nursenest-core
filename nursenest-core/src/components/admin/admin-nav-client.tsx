"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  BookOpen,
  BookMarked,
  ClipboardList,
  CircleDollarSign,
  GraduationCap,
  FileText,
  Globe,
  ImageIcon,
  LayoutDashboard,
  LineChart,
  Layers,
  Menu,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Users,
  Wrench,
  Wand2,
  X,
  Package,
  Megaphone,
  ListTodo,
  Cpu,
  Server,
  Workflow,
} from "lucide-react";
import { isNavHrefAllowedForStaffTier } from "@/lib/auth/admin-path-policy";
import type { StaffTier } from "@/lib/auth/staff-roles";

type Item = { href: string; label: string; icon: React.ElementType };

type NavGroup = { id: string; title: string; items: Item[] };

const GROUPS: NavGroup[] = [
  {
    id: "overview",
    title: "Overview",
    items: [
      { href: "/admin", label: "Command center", icon: LayoutDashboard },
      { href: "/admin/access", label: "Access & roles", icon: Shield },
    ],
  },
  {
    id: "growth",
    title: "Growth & revenue",
    items: [
      { href: "/admin/analytics", label: "Analytics hub", icon: BarChart3 },
      { href: "/admin/analytics/users", label: "User analytics", icon: LineChart },
      { href: "/admin/analytics/subscriptions", label: "Subscription analytics", icon: CircleDollarSign },
      { href: "/admin/analytics/funnels", label: "Funnel analytics", icon: Workflow },
      { href: "/admin/analytics/study-performance", label: "Study & CAT performance", icon: BookMarked },
      { href: "/admin/users", label: "Users & support", icon: Users },
      { href: "/admin/subscriptions", label: "Revenue & subscriptions", icon: Activity },
    ],
  },
  {
    id: "content",
    title: "Content & inventory",
    items: [
      { href: "/admin/inventory", label: "Inventory drill-down", icon: Package },
      { href: "/admin/content-coverage", label: "Content coverage", icon: BarChart3 },
      { href: "/admin/content", label: "Coverage & quality", icon: Layers },
      { href: "/admin/lessons", label: "Lessons", icon: GraduationCap },
      { href: "/admin/questions", label: "Question bank", icon: ClipboardList },
      { href: "/admin/media", label: "Media library", icon: ImageIcon },
    ],
  },
  {
    id: "publishing",
    title: "Publishing & SEO",
    items: [
      { href: "/admin/hub/publishing", label: "Publishing hub", icon: Megaphone },
      { href: "/admin/blog/studio", label: "Article studio", icon: Sparkles },
      { href: "/admin/blog", label: "Blog posts", icon: FileText },
      { href: "/admin/blog/control-panel", label: "Blog AI panel", icon: Wand2 },
      { href: "/admin/blog/generate", label: "Blog generator", icon: Sparkles },
      { href: "/admin/blog/scheduler", label: "Scheduler", icon: BookOpen },
      { href: "/admin/seo", label: "SEO & internal links", icon: Search },
    ],
  },
  {
    id: "ai",
    title: "AI generation",
    items: [
      { href: "/admin/hub/ai", label: "AI tools hub", icon: Cpu },
      { href: "/admin/lessons/generate", label: "Lesson AI", icon: Sparkles },
      { href: "/admin/lessons/generate-batch", label: "Lesson batch AI", icon: Sparkles },
      { href: "/admin/ai/exam-questions", label: "Exam question AI", icon: Stethoscope },
      { href: "/admin/ai/exam-questions/batch", label: "Exam question batch", icon: Stethoscope },
      { href: "/admin/ai/flashcards", label: "Flashcard AI", icon: Sparkles },
      { href: "/admin/ai/review", label: "AI review queue", icon: ClipboardList },
    ],
  },
  {
    id: "product",
    title: "Product & programs",
    items: [
      { href: "/admin/product-availability", label: "Product availability", icon: Package },
      { href: "/admin/waitlist", label: "Waitlist & upcoming", icon: ListTodo },
    ],
  },
  {
    id: "platform",
    title: "Platform",
    items: [
      { href: "/admin/operations", label: "System health", icon: Wrench },
      { href: "/admin/system-status", label: "System status", icon: Server },
      { href: "/admin/automation-logs", label: "Automation logs", icon: Activity },
      { href: "/admin/diagnostics", label: "Diagnostics", icon: BarChart3 },
      { href: "/admin/diagnostics/cat-blueprint-sessions", label: "CAT blueprint sessions", icon: BarChart3 },
      { href: "/admin/content-quality", label: "Content quality", icon: Shield },
      { href: "/admin/fraud", label: "Fraud detection", icon: ShieldAlert },
      { href: "/admin/premium-protection", label: "Premium protection", icon: Shield },
      { href: "/admin/i18n", label: "i18n", icon: Globe },
      { href: "/admin/diagnostics/theme-qa", label: "Theme QA", icon: Search },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  /** Avoid highlighting the parent “Analytics hub” when a child route (e.g. /admin/analytics/users) is open. */
  if (href === "/admin/analytics") return pathname === "/admin/analytics";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavClient({ staffTier = "super" }: { staffTier?: StaffTier }) {
  const pathname = usePathname() || "/admin";
  const [mobileOpen, setMobileOpen] = useState(false);

  const groups = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((item) => isNavHrefAllowedForStaffTier(staffTier, item.href)),
  })).filter((g) => g.items.length > 0);

  const close = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, close]);

  const NavBody = (
    <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
      <Link
        href="/admin"
        className="mb-4 flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-[var(--theme-heading-text)] hover:bg-muted/80"
        onClick={close}
      >
        <LayoutDashboard className="h-4 w-4 text-primary" aria-hidden />
        Operations center
      </Link>
      {staffTier !== "super" ? (
        <p className="mb-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-[10px] font-medium leading-snug text-amber-950 dark:text-amber-100">
          Signed in as{" "}
          <span className="font-semibold">
            {staffTier === "content" ? "Content admin" : "Support / viewer"}
          </span>
          — navigation is limited to your role.
        </p>
      ) : null}
      {groups.map((group) => (
        <div key={group.id} className="mb-5 last:mb-0">
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{group.title}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${
                      active
                        ? "bg-primary/12 font-semibold text-primary ring-1 ring-primary/20"
                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                    onClick={close}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 opacity-85" aria-hidden />
                    <span className="leading-snug">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border/80 bg-[var(--theme-card-bg)] px-4 py-3 lg:hidden">
        <Link href="/admin" className="text-sm font-bold text-[var(--theme-heading-text)]">
          NurseNest admin
        </Link>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-medium"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          Menu
        </button>
      </div>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={close}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(18rem,92vw)] border-r border-border/80 bg-[var(--theme-card-bg)] shadow-xl transition-transform duration-200 lg:static lg:z-0 lg:w-56 lg:shrink-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-full lg:translate-x-0"
        }`}
        aria-label="Admin navigation"
      >
        {NavBody}
      </aside>
    </>
  );
}
