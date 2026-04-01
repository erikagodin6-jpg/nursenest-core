import Link from "next/link";
import { BookOpen, ClipboardList, Layers, Sparkles, Zap } from "lucide-react";

type Card = {
  title: string;
  description: string;
  href: string;
  icon: typeof BookOpen;
};

export function LearnerDashboardActionCards({
  continueLesson,
  quizTopic,
  showCatHint,
}: {
  continueLesson: { title: string; href: string } | null;
  quizTopic: string | null;
  /** When exam is near or weak topics heavy — surface CAT. */
  showCatHint: boolean;
}) {
  const cards: Card[] = [
    continueLesson
      ? {
          title: "Continue lesson",
          description: continueLesson.title,
          href: continueLesson.href,
          icon: BookOpen,
        }
      : {
          title: "Open lessons",
          description: "Pick up structured content in your pathway.",
          href: "/app/lessons",
          icon: BookOpen,
        },
    quizTopic
      ? {
          title: "Targeted quiz",
          description: `Drill “${quizTopic}” in the bank.`,
          href: `/app/questions?preset=topic_drill&topic=${encodeURIComponent(quizTopic)}`,
          icon: Zap,
        }
      : {
          title: "Question bank",
          description: "Mixed or topic drills with instant grading.",
          href: "/app/questions",
          icon: Zap,
        },
    {
      title: "Weak-area cards",
      description: "Spaced repetition tied to your misses.",
      href: "/app/flashcards/weak-areas",
      icon: Layers,
    },
    {
      title: "Mock exams",
      description: "Timed blocks with autosave and score history.",
      href: "/app/exams",
      icon: ClipboardList,
    },
  ];

  if (showCatHint) {
    cards.push({
      title: "Adaptive (CAT) test",
      description: "Difficulty adjusts like practice—use alongside linear mocks.",
      href: "/app/practice-tests",
      icon: Sparkles,
    });
  }

  return (
    <section aria-label="Quick actions">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Jump back in</h2>
        <span className="text-xs text-muted-foreground">Every card opens a real session</span>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <li key={c.href + c.title}>
              <Link
                href={c.href}
                className="flex h-full min-h-[120px] flex-col rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm transition hover:border-primary/35 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="mt-3 text-sm font-semibold text-foreground">{c.title}</span>
                <span className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{c.description}</span>
                <span className="mt-3 text-xs font-semibold text-primary">Open →</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
