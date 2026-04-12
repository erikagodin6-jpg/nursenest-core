import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Layers,
  ListTodo,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export const dynamic = "force-dynamic";

type HubCard = { href: string; title: string; description: string; icon: typeof Sparkles };

const cards: HubCard[] = [
  {
    href: "/admin/lessons/generate",
    title: "AI lesson (single)",
    description: "Generate one pathway lesson draft from a brief.",
    icon: GraduationCap,
  },
  {
    href: "/admin/lessons/generate-batch",
    title: "AI lesson batch",
    description: "Batch lesson generation with job steps and export.",
    icon: Layers,
  },
  {
    href: "/admin/blog/generate",
    title: "Blog article",
    description: "Topic → draft post; pair with blog control panel for linking and references.",
    icon: BookOpen,
  },
  {
    href: "/admin/blog/topic-batch",
    title: "Blog topic batch",
    description: "Multiple topics in one run.",
    icon: BookOpen,
  },
  {
    href: "/admin/blog/control-panel",
    title: "Blog AI panel",
    description: "Orchestration, internal linking, and publish gates.",
    icon: Sparkles,
  },
  {
    href: "/admin/hub/ai",
    title: "Hub AI",
    description: "Marketing hub content tooling.",
    icon: Sparkles,
  },
  {
    href: "/admin/ai/exam-questions",
    title: "AI question studio",
    description: "Single exam-question drafts.",
    icon: ClipboardList,
  },
  {
    href: "/admin/ai/exam-questions/batch",
    title: "AI question batch",
    description: "Batch question generation jobs.",
    icon: ClipboardList,
  },
  {
    href: "/admin/ai/review",
    title: "AI review queue",
    description: "Review promoted drafts before publish.",
    icon: ClipboardList,
  },
  {
    href: "/admin/queue",
    title: "Background job queue",
    description: "Status of async jobs (refresh to update).",
    icon: ListTodo,
  },
  {
    href: "/admin/inventory",
    title: "Content inventory",
    description: "Coverage by pathway, lessons vs bank targets.",
    icon: Stethoscope,
  },
];

export default async function AdminContentGenerationHubPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Scaling</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Content generation</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Entry points for lesson and blog automation. Analytics, inventory, and reliability tools live in the sidebar
            under Growth, Command, and Reliability.
          </p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-primary underline">
          Command center ←
        </Link>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <li key={c.href}>
              <Link
                href={c.href}
                className="flex h-full gap-4 rounded-xl border border-border bg-[var(--theme-card-bg)] p-4 shadow-sm transition-colors hover:border-primary/40 hover:bg-muted/30"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-[var(--theme-heading-text)]">{c.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{c.description}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
