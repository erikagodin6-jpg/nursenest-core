import Link from "next/link";
import {
  BookOpen,
  FileEdit,
  Layers,
  Search,
  Sparkles,
  Stethoscope,
  Users,
  Wrench,
  CreditCard,
  ClipboardList,
} from "lucide-react";

const actions = [
  { href: "/admin/blog/generate", label: "Blog generator", desc: "AI drafts + SEO shells", icon: Sparkles, tone: "from-violet-500/15 to-fuchsia-500/10" },
  { href: "/admin/blog/scheduler", label: "Blog scheduler", desc: "Drafts & publish queue", icon: BookOpen, tone: "from-amber-500/15 to-orange-500/10" },
  { href: "/admin/seo", label: "SEO review", desc: "Meta gaps & inventory", icon: Search, tone: "from-emerald-500/15 to-teal-500/10" },
  { href: "/admin/content", label: "Content coverage", desc: "Lessons, bank, pathways", icon: Layers, tone: "from-sky-500/15 to-blue-500/10" },
  { href: "/api/admin/lessons?page=1&pageSize=20", label: "Lessons API", desc: "Paginated JSON", icon: FileEdit, tone: "from-slate-500/12 to-zinc-500/8" },
  { href: "/api/admin/questions?page=1&pageSize=20", label: "Questions API", desc: "Paginated JSON", icon: ClipboardList, tone: "from-slate-500/12 to-zinc-500/8" },
  { href: "/admin/subscriptions", label: "Subscriptions", desc: "Plans & Stripe gaps", icon: CreditCard, tone: "from-rose-500/12 to-pink-500/10" },
  { href: "/admin/users", label: "Users", desc: "Growth & roles", icon: Users, tone: "from-cyan-500/12 to-primary/10" },
  { href: "/admin/operations", label: "Site health", desc: "DB, APIs, safe mode", icon: Wrench, tone: "from-red-500/10 to-amber-500/10" },
  { href: "/admin/ai/exam-questions", label: "AI exam tools", desc: "Question drafts", icon: Stethoscope, tone: "from-indigo-500/12 to-purple-500/10" },
] as const;

export function AdminQuickActions() {
  return (
    <section className="rounded-2xl border border-border/80 bg-gradient-to-br from-primary/[0.06] via-transparent to-emerald-500/[0.05] p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Quick actions</h2>
      <p className="mt-1 text-sm text-muted-foreground">Operational shortcuts — all routes require admin access.</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {actions.map((a) => (
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
