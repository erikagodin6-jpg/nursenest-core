"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ClipboardList, GitBranch, RadioTower, ShieldCheck, Users } from "lucide-react";
import { SharedStudySetupLayout, SharedStudySetupSurface } from "@/components/learner-study-ui";
import { LearnerCtaLink } from "@/components/learner-ui/learner-cta-link";
import {
  PRIORITIZATION_ACTIVITIES,
  prioritizationFlashcardsHref,
  prioritizationPracticeHref,
  type PrioritizationActivity,
} from "@/lib/prioritization/prioritization-delegation-system";

const ACTIVITY_ICONS = {
  "priority-round": AlertTriangle,
  "delegation-drill": Users,
  "escalation-sequence": GitBranch,
  "assignment-balance": ClipboardList,
  "rapid-response": RadioTower,
  "safety-risk": ShieldCheck,
} as const;

const acuityLabel: Record<PrioritizationActivity["acuity"], string> = {
  stable: "Stable",
  watch: "Watch closely",
  urgent: "Urgent",
  "high-acuity": "High acuity",
};

export function PrioritizationDelegationHubClient({
  pathwayId,
  pathwayDisplayName,
}: {
  pathwayId: string;
  pathwayDisplayName: string;
}) {
  const [selectedId, setSelectedId] = useState(PRIORITIZATION_ACTIVITIES[0]?.id ?? "");
  const selected = useMemo(
    () => PRIORITIZATION_ACTIVITIES.find((activity) => activity.id === selectedId) ?? PRIORITIZATION_ACTIVITIES[0] ?? null,
    [selectedId],
  );
  const startHref = prioritizationPracticeHref(pathwayId, selected);
  const flashcardsHref = prioritizationFlashcardsHref(pathwayId, selected);

  return (
    <SharedStudySetupLayout
      mode="practice-exam"
      className="nn-priority-hub nn-flashcards-hub-premium space-y-5 py-2 pb-24 sm:space-y-6 sm:py-3 md:pb-6"
      data-nn-premium-flashcard-convergence
      data-nn-premium-platform-family="exam-study"
      data-nn-premium-platform-module="prioritization-delegation"
    >
      <h1 className="sr-only">Prioritization and delegation</h1>

      <header className="nn-flashcards-hub-workspace nn-flashcards-hub-hero nn-priority-hero relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-danger)_20%,var(--semantic-border-soft))] px-5 py-6 sm:px-8 sm:py-8">
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-danger)_80%,var(--semantic-text-secondary))]">
              {pathwayDisplayName} · RN decision training
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.95rem]">
              Prioritization &amp; delegation
            </h2>
            <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-[0.95rem]">
              Practice who to see first, what can safely wait, when to escalate, and which tasks can be delegated
              without losing patient safety. These are bedside decision rounds, not abstract exam buckets.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="nn-priority-badge">Multi-patient prioritization</span>
              <span className="nn-priority-badge nn-priority-badge--delegation">Delegation drills</span>
              <span className="nn-priority-badge nn-priority-badge--escalation">Escalation logic</span>
            </div>
          </div>

          <div className="nn-priority-command-card rounded-2xl border border-[color-mix(in_srgb,var(--semantic-danger)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-surface)_84%,transparent)] p-4 shadow-[var(--semantic-shadow-soft)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
                Active assignment
              </p>
              <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-danger)_12%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-bold text-[color-mix(in_srgb,var(--semantic-danger)_88%,var(--semantic-text-primary))]">
                1 unstable
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {[
                ["Room 412", "COPD, new confusion", "Urgent"],
                ["Room 418", "Post-op day 2 pain 4/10", "Stable"],
                ["Room 421", "Insulin due, glucose falling", "Watch"],
              ].map(([room, cue, status]) => (
                <div key={room} className="nn-priority-patient-row">
                  <span>
                    <strong>{room}</strong>
                    <small>{cue}</small>
                  </span>
                  <em>{status}</em>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <SharedStudySetupSurface className="nn-priority-surface">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-[var(--semantic-text-primary)] sm:text-xl">
              Choose a decision round
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              Each round uses the same NurseNest learner shell, then swaps in prioritization cards, delegation sorting,
              escalation sequencing, or rapid-response decisions.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs sm:w-[320px]">
            <div className="nn-priority-mini-stat">
              <strong>82%</strong>
              priority accuracy
            </div>
            <div className="nn-priority-mini-stat">
              <strong>4</strong>
              safety traps
            </div>
            <div className="nn-priority-mini-stat">
              <strong>12</strong>
              due reviews
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {PRIORITIZATION_ACTIVITIES.map((activity) => {
            const Icon = ACTIVITY_ICONS[activity.activityType];
            const selectedActivity = selected?.id === activity.id;
            return (
              <button
                key={activity.id}
                type="button"
                onClick={() => setSelectedId(activity.id)}
                className="nn-priority-activity-card group min-w-0 text-left"
                data-selected={selectedActivity ? "true" : "false"}
                style={{ ["--priority-accent" as string]: `var(${activity.accentVar})` }}
              >
                <span className="nn-priority-activity-card__top">
                  <span className="nn-priority-activity-card__icon">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="nn-priority-acuity">{acuityLabel[activity.acuity]}</span>
                </span>
                <span className="mt-4 block text-base font-bold text-[var(--semantic-text-primary)]">{activity.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                  {activity.description}
                </span>
                <span className="mt-4 flex flex-wrap gap-1.5">
                  {activity.tags.map((tag) => (
                    <span key={tag} className="nn-priority-chip">{tag}</span>
                  ))}
                </span>
                <span className="mt-4 grid grid-cols-3 gap-2 text-xs text-[var(--semantic-text-secondary)]">
                  <span><strong>{activity.timePressure}</strong> pace</span>
                  <span><strong>{activity.decisions}</strong> decisions</span>
                  <span><strong>RN</strong> scope</span>
                </span>
              </button>
            );
          })}
        </div>
      </SharedStudySetupSurface>

      <section className="nn-priority-action-band rounded-2xl border border-[color-mix(in_srgb,var(--semantic-danger)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-danger)_80%,var(--semantic-text-secondary))]">
              Start selected round
            </p>
            <h2 className="mt-1 text-lg font-bold text-[var(--semantic-text-primary)]">
              {selected?.title ?? "Prioritization round"}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {selected?.safetyFocus ?? "Prioritize safely, delegate within scope, and escalate the finding that changes urgency."}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <LearnerCtaLink href={startHref} className="inline-flex min-h-12 items-center justify-center px-7 text-base font-bold">
              Launch decision round
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </LearnerCtaLink>
            <Link
              href={flashcardsHref}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] px-5 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
            >
              Review priority flashcards
            </Link>
          </div>
        </div>
      </section>
    </SharedStudySetupLayout>
  );
}
