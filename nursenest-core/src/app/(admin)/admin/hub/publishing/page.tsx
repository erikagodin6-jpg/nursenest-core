import Link from "next/link";
import { BookOpen, FileText, Megaphone, Search, Sparkles, Wand2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

const CARDS = [
  {
    href: "/admin/blog",
    title: "Blog library",
    body: "List, edit, schedule, and publish articles.",
    icon: FileText,
  },
  {
    href: "/admin/blog/control-panel",
    title: "Blog AI control panel",
    body: "Campaign-style generation, regenerate, persist drafts.",
    icon: Wand2,
  },
  {
    href: "/admin/blog/generate",
    title: "Blog generator",
    body: "Single-article AI workflow with SEO shell.",
    icon: Sparkles,
  },
  {
    href: "/admin/blog/scheduler",
    title: "Scheduler",
    body: "Queue drafts and timed publishes.",
    icon: BookOpen,
  },
  {
    href: "/admin/blog/draft-batch",
    title: "Draft batch",
    body: "Bulk draft processing pipeline.",
    icon: Megaphone,
  },
  {
    href: "/admin/seo",
    title: "SEO & internal linking",
    body: "Metadata gaps, slug checks, internal link suggestions, validate URL.",
    icon: Search,
  },
] as const;

export default async function AdminPublishingHubPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Publishing</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Publishing & growth hub</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Central entry for editorial and SEO. Every tool stays role-gated; use{" "}
          <Link className="font-semibold text-primary underline" href="/admin/inventory">
            Inventory
          </Link>{" "}
          when you need pathway coverage numbers.
        </p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <li key={c.href}>
              <Link
                href={c.href}
                className="flex h-full flex-col rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm transition hover:border-primary/35 hover:shadow-md"
              >
                <span className="inline-flex items-center gap-2 text-base font-semibold text-foreground">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                  {c.title}
                </span>
                <span className="mt-2 text-sm text-muted-foreground">{c.body}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
