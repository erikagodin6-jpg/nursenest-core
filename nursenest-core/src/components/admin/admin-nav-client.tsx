"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookOpen,
  ClipboardList,
  GraduationCap,
  FileText,
  Globe,
  LayoutDashboard,
  Layers,
  Search,
  Shield,
  Sparkles,
  Users,
  Wrench,
  Wand2,
} from "lucide-react";

const links: Array<{ href: string; label: string; icon: React.ElementType }> = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: Activity },
  { href: "/admin/content", label: "Content", icon: Layers },
  { href: "/admin/lessons", label: "Lessons", icon: GraduationCap },
  { href: "/admin/lessons/generate", label: "Lesson AI", icon: Sparkles },
  { href: "/admin/lessons/generate-batch", label: "Lesson batch AI", icon: Sparkles },
  { href: "/admin/questions", label: "Questions", icon: ClipboardList },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/blog/control-panel", label: "Blog AI panel", icon: Wand2 },
  { href: "/admin/blog/generate", label: "Blog generator", icon: Sparkles },
  { href: "/admin/blog/scheduler", label: "Scheduler", icon: BookOpen },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/operations", label: "Operations", icon: Wrench },
  { href: "/admin/premium-protection", label: "Premium protection", icon: Shield },
  { href: "/admin/diagnostics", label: "Diagnostics", icon: BarChart3 },
  { href: "/admin/i18n", label: "i18n", icon: Globe },
];

export function AdminNavClient() {
  const pathname = usePathname() || "/admin";
  return (
    <nav
      className="border-b border-border/80 bg-gradient-to-r from-primary/[0.07] via-[var(--theme-card-bg)] to-emerald-500/[0.06]"
      aria-label="Admin navigation"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap gap-1 px-4 py-3 sm:px-6 lg:px-8">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/admin" && pathname.startsWith(href + "/")) || pathname === href + "/";
          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/25"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
