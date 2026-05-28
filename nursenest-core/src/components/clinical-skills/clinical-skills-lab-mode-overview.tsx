"use client";

import Link from "next/link";
import {
  BookOpen,
  Brain,
  ClipboardCheck,
  Repeat,
  ShieldAlert,
} from "lucide-react";
import type {
  ClinicalSkillCompetencyLabProfile,
  ClinicalSkillLabModeKey,
} from "@/lib/clinical-skills/clinical-skills-competency-lab";

const MODE_ICONS: Record<ClinicalSkillLabModeKey, typeof BookOpen> = {
  learn: BookOpen,
  practice: Brain,
  competency: ClipboardCheck,
  simulation: ShieldAlert,
  review: Repeat,
};

export function ClinicalSkillsLabModeOverview({
  profile,
}: {
  profile: ClinicalSkillCompetencyLabProfile;
}) {
  return (
    <section
      className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5"
      aria-labelledby="clinical-skills-lab-modes-heading"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
            Competency lab
          </p>
          <h2
            id="clinical-skills-lab-modes-heading"
            className="mt-1 text-lg font-bold text-[var(--semantic-text-primary)]"
          >
            Learn, practice, simulate, and maintain mastery
          </h2>
        </div>
        <p className="text-xs font-semibold text-[var(--semantic-text-muted)]">
          {profile.practiceQuestionCount} assessment items · simulation-ready
          workflow
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {profile.modes.map((mode) => {
          const Icon = MODE_ICONS[mode.key];
          return (
            <Link
              key={mode.key}
              href={mode.href}
              className="group rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-alt)] p-3 transition hover:border-[var(--semantic-brand)]"
            >
              <Icon
                className="h-4 w-4 text-[var(--semantic-brand)]"
                aria-hidden
              />
              <h3 className="mt-2 text-sm font-bold text-[var(--semantic-text-primary)]">
                {mode.label}
              </h3>
              <p className="mt-1 text-xs leading-5 text-[var(--semantic-text-secondary)]">
                {mode.outcome}
              </p>
              <p className="mt-2 text-[11px] font-semibold text-[var(--semantic-text-muted)]">
                {mode.interactions.slice(0, 3).join(" · ")}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
