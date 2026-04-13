"use client";

import Link from "next/link";
import { Brain, Target, BookOpen, Layers, ArrowRight } from "lucide-react";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { withPathwayScopeHref } from "@/lib/learner/pathway-scoped-href";

const ACTIONS = [
  {
    id: "smart_session",
    label: "Start Smart Session",
    href: "/app/questions",
    icon: <Brain className="h-4 w-4" />,
    color: "var(--semantic-chart-1)",
  },
  {
    id: "weak_areas",
    label: "Review Weak Areas",
    href: "/app/questions",
    icon: <Target className="h-4 w-4" />,
    color: "var(--semantic-chart-2)",
  },
  {
    id: "continue_lesson",
    label: "Continue Lesson",
    href: "/app/lessons",
    icon: <BookOpen className="h-4 w-4" />,
    color: "var(--semantic-chart-3)",
  },
  {
    id: "practice_exam",
    label: "Practice Exam",
    href: "/app/exams",
    icon: <Layers className="h-4 w-4" />,
    color: "var(--semantic-chart-4)",
  },
];

/**
 * SmartActionsBar — quick-launch buttons for common study actions.
 */
export function SmartActionsBar({
  showAdaptiveAction = true,
  showWeaknessAction = true,
  pathwayId = null,
}: {
  showAdaptiveAction?: boolean;
  showWeaknessAction?: boolean;
  pathwayId?: string | null;
}) {
  const actions = ACTIONS.filter((action) => {
    if (action.id === "smart_session" && !showAdaptiveAction) return false;
    if (action.id === "weak_areas" && !showWeaknessAction) return false;
    return true;
  });

  if (actions.length === 0) return null;

  return (
    <div className="nn-smart-actions-section">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.id}
            href={withPathwayScopeHref(action.href, pathwayId)}
            onClick={() =>
              trackClientEvent("smart_action_clicked", { action_id: action.id })
            }
            className="nn-smart-action group"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: `color-mix(in srgb, ${action.color} 12%, var(--semantic-surface))`,
                color: action.color,
              }}
            >
              {action.icon}
            </div>
            <span className="text-[0.8125rem] font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
              {action.label}
            </span>
            <ArrowRight
              className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-70"
              style={{ color: "var(--semantic-text-muted)" }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
