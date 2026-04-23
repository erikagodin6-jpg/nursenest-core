import Link from "next/link";
import {
  BookOpen,
  FileEdit,
  ImageIcon,
  KeyRound,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Wrench,
  CreditCard,
  ClipboardList,
  BarChart3,
  Package,
  Megaphone,
  Activity,
  Cpu,
  Workflow,
  BookMarked,
  Upload,
  MessageSquare,
  Eye,
} from "lucide-react";
import { isNavHrefAllowedForStaffTier } from "@/lib/auth/admin-path-policy";
import type { StaffTier } from "@/lib/auth/staff-roles";

const actions = [
  { href: "/admin/blog/studio", label: "Article studio", desc: "AI blog package → draft → publish", icon: Sparkles, tone: "from-violet-500/14 to-fuchsia-500/10" },
  { href: "/admin/analytics", label: "Analytics hub", desc: "Usage, CAT, subs, content jobs", icon: BarChart3, tone: "from-cyan-500/12 to-sky-500/10" },
  { href: "/admin/analytics/content", label: "Content analytics", desc: "Lessons, topics, learner activity", icon: BookMarked, tone: "from-teal-500/12 to-cyan-500/10" },
  { href: "/admin/inventory", label: "Inventory drill-down", desc: "Lessons & bank by pathway", icon: Package, tone: "from-emerald-500/12 to-teal-500/10" },
  {
    href: "/admin/content-coverage",
    label: "Coverage dashboard",
    desc: "Lessons, topics, bank links, readiness",
    icon: BarChart3,
    tone: "from-indigo-500/12 to-violet-500/10",
  },
  { href: "/admin/hub/publishing", label: "Publishing hub", desc: "Blog + SEO entry", icon: Megaphone, tone: "from-violet-500/12 to-fuchsia-500/10" },
  { href: "/admin/blog/generate", label: "Blog generator", desc: "AI drafts + SEO shells", icon: Sparkles, tone: "from-violet-500/15 to-fuchsia-500/10" },
  { href: "/admin/blog/scheduler", label: "Blog scheduler", desc: "Drafts & publish queue", icon: BookOpen, tone: "from-amber-500/15 to-orange-500/10" },
  { href: "/admin/seo", label: "SEO review", desc: "Meta gaps & inventory", icon: Search, tone: "from-emerald-500/15 to-teal-500/10" },
  {
    href: "/admin/content-quality",
    label: "Content quality",
    desc: "Thin rationales, corpus scan",
    icon: ShieldCheck,
    tone: "from-amber-500/12 to-rose-500/10",
  },
  { href: "/admin/content", label: "Content coverage", desc: "Lessons, bank, pathways", icon: Layers, tone: "from-sky-500/15 to-blue-500/10" },
  { href: "/admin/lessons", label: "Lessons", desc: "Admin entry + JSON endpoints", icon: FileEdit, tone: "from-slate-500/12 to-zinc-500/8" },
  { href: "/admin/questions", label: "Questions", desc: "Bank tools + diagnostics", icon: ClipboardList, tone: "from-slate-500/12 to-zinc-500/8" },
  { href: "/admin/questions/import", label: "Bulk question import", desc: "JSON validate + stem dedupe", icon: Upload, tone: "from-zinc-500/12 to-slate-500/8" },
  { href: "/admin/subscriptions", label: "Subscriptions", desc: "Plans & Stripe gaps", icon: CreditCard, tone: "from-rose-500/12 to-pink-500/10" },
  { href: "/admin/users", label: "Users", desc: "Growth & roles", icon: Users, tone: "from-cyan-500/12 to-primary/10" },
  {
    href: "/admin/feedback",
    label: "User feedback",
    desc: "Bugs & product messages from the app",
    icon: MessageSquare,
    tone: "from-sky-500/12 to-indigo-500/10",
  },
  { href: "/admin/operations", label: "Site health", desc: "DB, APIs, safe mode", icon: Wrench, tone: "from-red-500/10 to-amber-500/10" },
  { href: "/admin/ai/exam-questions", label: "AI question studio", desc: "Drafts & section regen", icon: Stethoscope, tone: "from-indigo-500/12 to-purple-500/10" },
  { href: "/admin/ai/exam-questions/batch", label: "AI question batch", desc: "One draft per topic + queue", icon: Stethoscope, tone: "from-sky-500/12 to-indigo-500/10" },
  { href: "/admin/media", label: "Media library", desc: "Uploads & CDN URLs", icon: ImageIcon, tone: "from-fuchsia-500/12 to-pink-500/10" },
  { href: "/admin/hub/ai", label: "AI tools hub", desc: "Generation entry points", icon: Cpu, tone: "from-indigo-500/12 to-violet-500/10" },
  { href: "/admin/lessons/generate", label: "Lesson AI", desc: "Single-lesson generation", icon: Sparkles, tone: "from-teal-500/12 to-cyan-500/10" },
  { href: "/admin/analytics/funnels", label: "Funnel analytics", desc: "Steps & conversion", icon: Workflow, tone: "from-orange-500/12 to-amber-500/10" },
  { href: "/admin/analytics/study-performance", label: "Study & CAT analytics", desc: "Lessons, bank, CAT sessions", icon: BookMarked, tone: "from-lime-500/10 to-emerald-500/10" },
  { href: "/admin/automation-logs", label: "Automation logs", desc: "Jobs & schedulers", icon: Activity, tone: "from-neutral-500/12 to-stone-500/10" },
  { href: "/admin/access", label: "Access & roles", desc: "RBAC reference", icon: KeyRound, tone: "from-primary/15 to-primary/8" },
  {
    href: "/admin/learner-qa",
    label: "Learner QA view",
    desc: "Simulate paid / unpaid learner (signed cookie)",
    icon: Eye,
    tone: "from-emerald-500/14 to-teal-500/10",
  },
] as const;

export function AdminQuickActions({ staffTier = "super" }: { staffTier?: StaffTier }) {
  const visible = actions.filter((a) => isNavHrefAllowedForStaffTier(staffTier, a.href));

  return (
    <section className="rounded-2xl border border-border/80 bg-gradient-to-br from-primary/[0.06] via-transparent to-emerald-500/[0.05] p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Quick actions</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Operational shortcuts filtered by your role. Server routes remain authoritative.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {visible.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              className={`flex h-full flex-col rounded-xl border border-border/60 bg-gradient-to-br ${a.tone} p-4 transition hover:border-primary/35 hover:shadow-md`}
            >
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <a.icon className="h-4 w-4 text-primary" aria-hidden />
                {a.label}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">{a.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
