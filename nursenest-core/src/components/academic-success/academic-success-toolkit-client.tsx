"use client";

import { useMemo, useState } from "react";
import { BookOpen, ClipboardCopy, FileDown, Printer, RotateCcw, Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearnerSurfaceCard } from "@/components/ui/learner-surface-card";
import { SaveToNotebookButton } from "@/components/notebook/save-to-notebook-button";
import {
  generateAcademicSuccessToolkit,
  summarizeAcademicToolkitForCopy,
  type AcademicProfessionId,
} from "@/lib/academic-success/academic-success-toolkit";

const DEFAULT_PROFESSION: AcademicProfessionId = "rn";

type ToolkitView = "assignments" | "study" | "research" | "group" | "presentation" | "writing";

const VIEW_OPTIONS: Array<{ value: ToolkitView; label: string }> = [
  { value: "assignments", label: "Assignments" },
  { value: "study", label: "Study" },
  { value: "research", label: "Research" },
  { value: "group", label: "Group" },
  { value: "presentation", label: "Presentation" },
  { value: "writing", label: "Writing Coach" },
];

export function AcademicSuccessToolkitClient() {
  const [professionId, setProfessionId] = useState<AcademicProfessionId>(DEFAULT_PROFESSION);
  const [activeView, setActiveView] = useState<ToolkitView>("assignments");
  const [copied, setCopied] = useState(false);
  const toolkit = useMemo(() => generateAcademicSuccessToolkit(professionId), [professionId]);
  const copyText = useMemo(() => summarizeAcademicToolkitForCopy(toolkit), [toolkit]);

  async function copyToolkit() {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="space-y-6 pb-10 print:pb-0">
      <div className="nn-learner-page-hero overflow-hidden rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--semantic-brand)_11%,var(--semantic-surface))_0%,var(--semantic-surface)_48%,color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))_100%)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">Academic Success Toolkit</p>
            <h1 className="text-2xl font-bold tracking-normal text-[var(--semantic-text-strong)] sm:text-3xl">
              Academic support for healthcare learners
            </h1>
            <p className="text-sm leading-6 text-[var(--semantic-text-muted)] sm:text-base">
              Build structured assignment scaffolds, study materials, research plans, presentations, and writing feedback
              while preserving academic integrity and profession-specific reasoning.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button type="button" variant="secondary" onClick={copyToolkit} className="gap-2">
              <ClipboardCopy className="h-4 w-4" />
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.print()} className="gap-2">
              <FileDown className="h-4 w-4" />
              PDF
            </Button>
            <SaveToNotebookButton
              category="notes"
              sourceType="lesson"
              sourceId={`academic-success-toolkit-${professionId}`}
              title={`Academic Success Toolkit - ${toolkit.selectedProfession.label}`}
              content={copyText}
              sourceHref="/app/academic-success-toolkit"
              topic="Academic Success"
              tags={["academic-success", professionId]}
              label="Save"
              compact
            />
          </div>
        </div>
      </div>

      <LearnerSurfaceCard className="p-4 sm:p-5 print:hidden">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">Profession</span>
            <select
              value={professionId}
              onChange={(event) => setProfessionId(event.target.value as AcademicProfessionId)}
              className="min-h-11 w-full rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-strong)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-brand)]"
            >
              {toolkit.availableProfessions.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.label}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveView(option.value)}
                className={`min-h-10 rounded-lg border px-3 text-xs font-semibold transition ${
                  activeView === option.value
                    ? "border-[color-mix(in_srgb,var(--semantic-brand)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-brand)]"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] text-[var(--semantic-text-muted)] hover:text-[var(--semantic-text-strong)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </LearnerSurfaceCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <LearnerSurfaceCard className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-brand)]">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-[var(--semantic-text-strong)]">{toolkit.selectedProfession.label} Academic Profile</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--semantic-text-muted)]">
                Toolkit outputs adapt to this profession's assignments, evidence expectations, writing standards, and reasoning lens.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <ProfileSection title="Academic Focus" items={toolkit.selectedProfession.academicFocus} />
            <ProfileSection title="Assignment Templates" items={toolkit.selectedProfession.assignmentTemplates} />
            <ProfileSection title="Clinical Reasoning Lens" items={toolkit.selectedProfession.clinicalReasoningLens} />
            <ProfileSection title="Evidence Expectations" items={toolkit.selectedProfession.evidenceExpectations} />
            <ProfileSection title="Writing Standards" items={toolkit.selectedProfession.writingStandards} />
          </div>
        </LearnerSurfaceCard>

        <ActiveViewPanel toolkit={toolkit} activeView={activeView} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {toolkit.integrityGuards.map((guard) => (
          <LearnerSurfaceCard key={guard.principle} className="p-5">
            <h2 className="text-base font-bold text-[var(--semantic-text-strong)]">{guard.principle}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-muted)]">{guard.enforcement}</p>
          </LearnerSurfaceCard>
        ))}
      </div>

      <LearnerSurfaceCard className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-success)]">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[var(--semantic-text-strong)]">Quality Standard</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {toolkit.qualityStandard.map((item) => (
                <p key={item} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] p-3 text-sm leading-6 text-[var(--semantic-text-muted)]">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </LearnerSurfaceCard>

      <div className="flex justify-end print:hidden">
        <Button type="button" variant="ghost" onClick={() => setProfessionId(DEFAULT_PROFESSION)} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset to RN
        </Button>
      </div>
    </section>
  );
}

type Toolkit = ReturnType<typeof generateAcademicSuccessToolkit>;

function ActiveViewPanel({ toolkit, activeView }: { toolkit: Toolkit; activeView: ToolkitView }) {
  if (activeView === "assignments") {
    return (
      <LearnerSurfaceCard className="p-5 sm:p-6">
        <SectionHeader label="Assignment Builder Suite" title="Reasoning-first assignment scaffolds" />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {toolkit.assignmentBuilderSuite.map((module) => (
            <div key={module.id} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] p-4">
              <h3 className="text-sm font-bold text-[var(--semantic-text-strong)]">{module.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-muted)]">{module.purpose}</p>
              <p className="mt-3 text-xs font-semibold text-[var(--semantic-brand)]">{module.professionAdaptation}</p>
            </div>
          ))}
        </div>
      </LearnerSurfaceCard>
    );
  }

  if (activeView === "study") {
    return <ModuleGrid label="Study Tools" title="Study assets that require learner action" items={toolkit.studyTools.map((item) => ({ title: item.title, body: item.output, footer: item.learnerAction }))} />;
  }

  if (activeView === "research") {
    return <ModuleGrid label="Research Support" title="Evidence-based practice and scholarly writing" items={toolkit.researchSupport.map((item) => ({ title: item.title, body: item.output, footer: item.professionAdaptation }))} />;
  }

  if (activeView === "group") {
    return <ModuleGrid label="Group Project Support" title="Team planning and accountability" items={toolkit.groupProjectSupport.map((item) => ({ title: item.title, body: item.output, footer: item.collaborationRules.join(" ") }))} />;
  }

  if (activeView === "presentation") {
    return <ModuleGrid label="Presentation Builder" title="Class, case, journal club, research, and teaching presentations" items={toolkit.presentationBuilder.map((item) => ({ title: item.title, body: item.output, footer: item.requiredElements.join(", ") }))} />;
  }

  return (
    <LearnerSurfaceCard className="p-5 sm:p-6">
      <SectionHeader label="Academic Writing Coach" title="Feedback without academic dishonesty" />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <SummaryBlock title="Review Areas" items={toolkit.academicWritingCoach.reviewAreas} />
        <SummaryBlock title="Feedback Style" items={toolkit.academicWritingCoach.feedbackStyle} />
        <SummaryBlock title="Prohibited Behavior" items={toolkit.academicWritingCoach.prohibitedBehavior} />
        <SummaryBlock title="Revision Prompts" items={toolkit.academicWritingCoach.revisionPrompts} />
      </div>
    </LearnerSurfaceCard>
  );
}

function ModuleGrid({ label, title, items }: { label: string; title: string; items: Array<{ title: string; body: string; footer: string }> }) {
  return (
    <LearnerSurfaceCard className="p-5 sm:p-6">
      <SectionHeader label={label} title={title} />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] p-4">
            <h3 className="text-sm font-bold text-[var(--semantic-text-strong)]">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-muted)]">{item.body}</p>
            <p className="mt-3 text-xs font-semibold text-[var(--semantic-brand)]">{item.footer}</p>
          </div>
        ))}
      </div>
    </LearnerSurfaceCard>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">{label}</p>
      <h2 className="mt-1 text-xl font-bold text-[var(--semantic-text-strong)]">{title}</h2>
    </div>
  );
}

function ProfileSection({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-strong)]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function SummaryBlock({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] p-4">
      <h3 className="text-sm font-bold text-[var(--semantic-text-strong)]">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--semantic-text-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
