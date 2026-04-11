import Link from "next/link";
import { ArrowRight, BookOpen, Target, Layers, Brain, Play } from "lucide-react";
import type { NextBestAction } from "@/lib/learner/next-best-action";

const KIND_ICONS: Record<string, React.ReactNode> = {
  lesson: <BookOpen className="h-6 w-6" />,
  quiz: <Target className="h-6 w-6" />,
  mock: <Layers className="h-6 w-6" />,
  cat: <Layers className="h-6 w-6" />,
  review: <Brain className="h-6 w-6" />,
  continue: <Play className="h-6 w-6" />,
  flashcards: <Layers className="h-6 w-6" />,
  fallback: <Play className="h-6 w-6" />,
};

/**
 * PrimaryActionCard — the dominant CTA on the dashboard.
 *
 * Always renders. Shows the next-best-action from the insight engine
 * with a clear, actionable title and dynamic subtitle.
 */
export function PrimaryActionCard({ action }: { action: NextBestAction }) {
  return (
    <Link
      href={action.href}
      className="nn-primary-action-card group"
    >
      <div className="flex items-center gap-4">
        <div className="nn-primary-action-card__icon">
          {KIND_ICONS[action.kind] ?? <Play className="h-6 w-6" />}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="nn-primary-action-card__title">
            {action.title}
          </h2>
          <p className="nn-primary-action-card__subtitle">
            {action.subtitle}
          </p>
          <p className="nn-primary-action-card__reasoning">
            {action.reasoning}
          </p>
        </div>
        <div className="nn-primary-action-card__arrow">
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>
    </Link>
  );
}
