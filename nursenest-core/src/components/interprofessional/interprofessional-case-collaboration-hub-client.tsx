"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ClipboardCopy, FileDown, MessageSquare, Printer, Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearnerSurfaceCard } from "@/components/ui/learner-surface-card";
import { SaveToNotebookButton } from "@/components/notebook/save-to-notebook-button";
import {
  generateInterprofessionalCaseCollaborationHub,
  summarizeIpeHubForCopy,
  type IpeCaseId,
  type IpeProfessionId,
  type RolePerspective,
} from "@/lib/interprofessional/interprofessional-case-collaboration-hub";

type HubView = "roles" | "huddle" | "consults" | "communication" | "discharge" | "conflict" | "deterioration" | "explorer";

const VIEW_OPTIONS: Array<{ value: HubView; label: string }> = [
  { value: "roles", label: "Role Views" },
  { value: "huddle", label: "Huddle" },
  { value: "consults", label: "Consults" },
  { value: "communication", label: "SBAR" },
  { value: "discharge", label: "Discharge" },
  { value: "conflict", label: "Conflict" },
  { value: "deterioration", label: "Deterioration" },
  { value: "explorer", label: "Explorer" },
];

export function InterprofessionalCaseCollaborationHubClient() {
  const [caseId, setCaseId] = useState<IpeCaseId>("heart-failure");
  const [activeView, setActiveView] = useState<HubView>("roles");
  const [selectedProfessionId, setSelectedProfessionId] = useState<IpeProfessionId>("rn");
  const [copied, setCopied] = useState(false);
  const hub = useMemo(() => generateInterprofessionalCaseCollaborationHub(caseId), [caseId]);
  const copyText = useMemo(() => summarizeIpeHubForCopy(hub), [hub]);
  const selectedPerspective =
    hub.selectedCase.rolePerspectives.find((view) => view.professionId === selectedProfessionId) ?? hub.selectedCase.rolePerspectives[0];

  async function copyHub() {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="space-y-6 pb-10 print:pb-0">
      <div className="nn-learner-page-hero overflow-hidden rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))_0%,var(--semantic-surface)_50%,color-mix(in_srgb,var(--semantic-success)_9%,var(--semantic-surface))_100%)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">Interprofessional Case Collaboration Hub</p>
            <h1 className="text-2xl font-bold tracking-normal text-[var(--semantic-text-strong)] sm:text-3xl">
              Learn how healthcare teams think together
            </h1>
            <p className="text-sm leading-6 text-[var(--semantic-text-muted)] sm:text-base">
              Explore shared patient cases through profession-specific perspectives, interdisciplinary huddles, consult decisions,
              communication practice, discharge planning, and team-based deterioration response.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button type="button" variant="secondary" onClick={copyHub} className="gap-2">
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
              sourceType="simulation"
              sourceId={`ipe-collaboration-${caseId}`}
              title={`IPE Collaboration - ${hub.selectedCase.title}`}
              content={copyText}
              sourceHref="/app/interprofessional-cases"
              topic="Interprofessional Collaboration"
              tags={["ipe", caseId]}
              label="Save"
              compact
            />
          </div>
        </div>
      </div>

      <LearnerSurfaceCard className="p-4 sm:p-5 print:hidden">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">Case</span>
            <select
              value={caseId}
              onChange={(event) => {
                setCaseId(event.target.value as IpeCaseId);
                setSelectedProfessionId("rn");
              }}
              className="min-h-11 w-full rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-strong)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-brand)]"
            >
              {hub.caseLibrary.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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

      <LearnerSurfaceCard className="p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">{hub.selectedCase.setting}</p>
            <h2 className="mt-1 text-xl font-bold text-[var(--semantic-text-strong)]">{hub.selectedCase.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-muted)]">{hub.selectedCase.patientSummary}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="Acuity" value={hub.selectedCase.acuity} />
            <MetricCard label="Professions" value={String(hub.selectedCase.involvedProfessions.length)} />
            <MetricCard label="Learning Goals" value={String(hub.selectedCase.learningGoals.length)} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {hub.selectedCase.learningGoals.map((goal) => (
            <span key={goal} className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-strong)]">
              {goal}
            </span>
          ))}
        </div>
      </LearnerSurfaceCard>

      <ActiveViewPanel
        hub={hub}
        activeView={activeView}
        selectedPerspective={selectedPerspective}
        selectedProfessionId={selectedProfessionId}
        onSelectProfession={setSelectedProfessionId}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <ScoreCard title="Communication" items={hub.assessmentSystem.communication} />
        <ScoreCard title="Collaboration" items={hub.assessmentSystem.collaboration} />
        <ScoreCard title="Team Awareness" items={hub.assessmentSystem.teamAwareness} />
      </div>

      <LearnerSurfaceCard className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-success)]">
            <Save className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-[var(--semantic-text-strong)]">Institutional Version</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <ScoreCard title="Assign Cases" items={hub.institutionalVersion.assignCases} minimal />
              <ScoreCard title="Track Completion" items={hub.institutionalVersion.trackCompletion} minimal />
              <ScoreCard title="Measure Competencies" items={hub.institutionalVersion.measureCompetencies} minimal />
              <ScoreCard title="Reports" items={hub.institutionalVersion.reports} minimal />
            </div>
          </div>
        </div>
      </LearnerSurfaceCard>
    </section>
  );
}

type Hub = ReturnType<typeof generateInterprofessionalCaseCollaborationHub>;

function ActiveViewPanel({
  hub,
  activeView,
  selectedPerspective,
  selectedProfessionId,
  onSelectProfession,
}: {
  hub: Hub;
  activeView: HubView;
  selectedPerspective: RolePerspective | undefined;
  selectedProfessionId: IpeProfessionId;
  onSelectProfession: (id: IpeProfessionId) => void;
}) {
  if (activeView === "roles") {
    return (
      <LearnerSurfaceCard className="p-5 sm:p-6">
        <SectionHeader icon={<Users className="h-5 w-5" />} label="Role Perspective View" title="See the same patient through different professional lenses" />
        <div className="mt-4 flex flex-wrap gap-2 print:hidden">
          {hub.selectedCase.rolePerspectives.map((view) => (
            <button
              key={view.professionId}
              type="button"
              onClick={() => onSelectProfession(view.professionId)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                selectedProfessionId === view.professionId
                  ? "border-[color-mix(in_srgb,var(--semantic-brand)_44%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-brand)]"
                  : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] text-[var(--semantic-text-muted)]"
              }`}
            >
              {view.professionLabel}
            </button>
          ))}
        </div>
        {selectedPerspective ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ScoreCard title={`${selectedPerspective.professionLabel} Priorities`} items={selectedPerspective.priorities} minimal />
            <ScoreCard title="Assessments" items={selectedPerspective.assessments} minimal />
            <ScoreCard title="Actions" items={selectedPerspective.actions} minimal />
            <ScoreCard title="Communication Needs" items={selectedPerspective.communicationNeeds} minimal />
          </div>
        ) : null}
      </LearnerSurfaceCard>
    );
  }

  if (activeView === "huddle") {
    return <CardGrid label="Team Huddle Simulator" title="Participate in interdisciplinary rounds" items={hub.selectedCase.teamHuddle.map((item) => ({ title: item.prompt, body: item.strongResponse, footer: item.feedbackCriteria.join(", ") }))} />;
  }

  if (activeView === "consults") {
    return <CardGrid label="Consult Decision Tool" title="Know when and why to involve another profession" items={hub.selectedCase.consultDecisions.map((item) => ({ title: `Consult ${profileLabel(hub, item.consultProfessionId)}`, body: `${item.whenToInvolve} ${item.why}`, footer: item.informationToCommunicate.join(", ") }))} />;
  }

  if (activeView === "communication") {
    return <CardGrid label="SBAR & Team Communication" title="Practice targeted interprofessional communication" items={hub.selectedCase.communicationExercises.map((item) => ({ title: item.title, body: item.situation, footer: item.expectedSbar.join(" | ") }))} />;
  }

  if (activeView === "discharge") {
    return <CardGrid label="Discharge Planning Simulator" title="Plan safe transitions with the whole team" items={hub.selectedCase.dischargePlanning.map((item) => ({ title: item.domain, body: item.safetyRisk, footer: `${item.teamContributions.join(" | ")} Follow-up: ${item.followUpNeed}` }))} />;
  }

  if (activeView === "conflict") {
    return <CardGrid label="Conflict Resolution Scenarios" title="Practice professional resolution strategies" items={hub.selectedCase.conflictScenarios.map((item) => ({ title: item.title, body: item.conflict, footer: item.resolutionStrategy.join(" -> ") }))} />;
  }

  if (activeView === "deterioration") {
    return (
      <LearnerSurfaceCard className="p-5 sm:p-6">
        <SectionHeader icon={<MessageSquare className="h-5 w-5" />} label="Clinical Deterioration Team Response" title="Escalate together when the patient changes" />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <ScoreCard title="Trigger" items={[hub.selectedCase.deteriorationResponse.trigger]} minimal />
          <ScoreCard title="Activation" items={[hub.selectedCase.deteriorationResponse.activation]} minimal />
          <ScoreCard title="Team Actions" items={hub.selectedCase.deteriorationResponse.teamActions} minimal />
          <ScoreCard title="Shared Decision Point" items={[hub.selectedCase.deteriorationResponse.sharedDecisionPoint]} minimal />
        </div>
      </LearnerSurfaceCard>
    );
  }

  return (
    <LearnerSurfaceCard className="p-5 sm:p-6">
      <SectionHeader icon={<Users className="h-5 w-5" />} label="Profession Explorer" title="Role clarity, misconceptions, and collaboration opportunities" />
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {hub.professionExplorer.map((profile) => (
          <div key={profile.id} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] p-4">
            <h3 className="text-sm font-bold text-[var(--semantic-text-strong)]">
              {profile.label} {profile.status === "future" ? "(future)" : ""}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-muted)]">Scope: {profile.scope.slice(0, 3).join(", ")}</p>
            <p className="mt-2 text-xs font-semibold text-[var(--semantic-brand)]">Misconception: {profile.commonMisconceptions[0]}</p>
          </div>
        ))}
      </div>
    </LearnerSurfaceCard>
  );
}

function CardGrid({ label, title, items }: { label: string; title: string; items: Array<{ title: string; body: string; footer: string }> }) {
  return (
    <LearnerSurfaceCard className="p-5 sm:p-6">
      <SectionHeader icon={<MessageSquare className="h-5 w-5" />} label={label} title={title} />
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

function ScoreCard({ title, items, minimal = false }: { title: string; items: readonly string[]; minimal?: boolean }) {
  const content = (
    <>
      <h3 className="text-sm font-bold text-[var(--semantic-text-strong)]">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--semantic-text-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
  if (minimal) return <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] p-4">{content}</div>;
  return <LearnerSurfaceCard className="p-5">{content}</LearnerSurfaceCard>;
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">{label}</p>
      <p className="mt-1 text-lg font-bold capitalize text-[var(--semantic-text-strong)]">{value}</p>
    </div>
  );
}

function SectionHeader({ icon, label, title }: { icon: ReactNode; label: string; title: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-brand)]">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">{label}</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--semantic-text-strong)]">{title}</h2>
      </div>
    </div>
  );
}

function profileLabel(hub: Hub, id: IpeProfessionId): string {
  return hub.professionExplorer.find((profile) => profile.id === id)?.label ?? id;
}
