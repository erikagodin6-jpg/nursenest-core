import Link from "next/link";
import { ClipboardList, GraduationCap, Sparkles, Stethoscope } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

const CARDS = [
  {
    href: "/admin/lessons/generate",
    title: "Lesson AI (single)",
    body: "Draft or extend pathway lessons with section regen.",
    icon: GraduationCap,
  },
  {
    href: "/admin/lessons/generate-batch",
    title: "Lesson batch AI",
    body: "Queued multi-lesson jobs with stepwise processing.",
    icon: Sparkles,
  },
  {
    href: "/admin/ai/exam-questions",
    title: "Exam question studio",
    body: "Draft items, regenerate sections, promote when ready.",
    icon: Stethoscope,
  },
  {
    href: "/admin/ai/exam-questions/batch",
    title: "Exam question batch",
    body: "Topic-scoped batch generation.",
    icon: Stethoscope,
  },
  {
    href: "/admin/ai/flashcards",
    title: "Flashcard AI",
    body: "Deck drafts and promotion.",
    icon: Sparkles,
  },
  {
    href: "/admin/ai/review",
    title: "AI review queue",
    body: "Human review before promotion.",
    icon: ClipboardList,
  },
] as const;

export default async function AdminAiHubPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · AI</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">AI generation hub</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          All generation routes require admin. Monitor failures in{" "}
          <Link className="font-semibold text-primary underline" href="/admin/automation-logs">
            Automation logs
          </Link>{" "}
          and{" "}
          <Link className="font-semibold text-primary underline" href="/admin/diagnostics">
            Diagnostics
          </Link>
          .
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
