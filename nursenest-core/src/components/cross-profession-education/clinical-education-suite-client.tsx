"use client";

import { useMemo, useState } from "react";
import { Activity, ClipboardCopy, FileDown, Printer, RotateCcw, Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearnerSurfaceCard } from "@/components/ui/learner-surface-card";
import { SaveToNotebookButton } from "@/components/notebook/save-to-notebook-button";
import {
  generateClinicalEducationSuite,
  summarizeClinicalEducationSuiteForCopy,
  type ClinicalEducationProfessionId,
  type ClinicalEducationToolId,
  type SuiteTool,
} from "@/lib/cross-profession-education/clinical-education-suite";

const DEFAULT_PROFESSION: ClinicalEducationProfessionId = "rn";

const TOOL_LABELS: Record<ClinicalEducationToolId, string> = {
  "clinical-prep-builder": "Clinical Prep",
  "documentation-academy": "Documentation",
  "concept-map-generator": "Concept Map",
  "clinical-reasoning-builder": "Reasoning",
  "reflection-journal": "Reflection",
  "patient-assignment-organizer": "Assignment",
  "simulation-preparation": "Simulation",
  "clinical-skills-companion": "Skills",
  "placement-success-tracker": "Placement",
  "competency-portfolio": "Portfolio",
};

export function ClinicalEducationSuiteClient() {
  const [professionId, setProfessionId] = useState<ClinicalEducationProfessionId>(DEFAULT_PROFESSION);
  const suite = useMemo(() => generateClinicalEducationSuite(professionId), [professionId]);
  const [activeToolId, setActiveToolId] = useState<ClinicalEducationToolId>("clinical-prep-builder");
  const [copied, setCopied] = useState(false);
  const activeTool = suite.tools.find((tool) => tool.id === activeToolId) ?? suite.tools[0];
  const copyText = useMemo(() => summarizeClinicalEducationSuiteForCopy(suite), [suite]);

  async function copySuite() {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="space-y-6 pb-10 print:pb-0">
      <div className="nn-learner-page-hero overflow-hidden rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))_0%,var(--semantic-surface)_46%,color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))_100%)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--semantic-brand)]">Clinical Education Suite</p>
            <h1 className="text-2xl font-bold tracking-normal text-[var(--semantic-text-strong)] sm:text-3xl">
              Cross-profession clinical learning engine
            </h1>
            <p className="text-sm leading-6 text-[var(--semantic-text-muted)] sm:text-base">
              A shared clinical education platform with profession-specific layers for competencies, scope, documentation,
              reasoning, placement preparation, simulations, and portfolios.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button type="button" variant="secondary" onClick={copySuite} className="gap-2">
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
              sourceType="clinical_skill"
              sourceId={`clinical-education-suite-${professionId}`}
              title={`Clinical Education Suite - ${suite.selectedProfession.label}`}
              content={copyText}
              sourceHref="/app/clinical-education-suite"
              topic="Clinical Education Suite"
              tags={["clinical-education", professionId]}
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
              onChange={(event) => setProfessionId(event.target.value as ClinicalEducationProfessionId)}
              className="min-h-11 w-full rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-strong)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-brand)]"
            >
              {suite.availableProfessions.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.label}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {suite.tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => setActiveToolId(tool.id)}
                className={`min-h-10 rounded-lg border px-3 text-xs font-semibold transition ${
                  activeToolId === tool.id
                    ? "border-[color-mix(in_srgb,var(--semantic-brand)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-brand)]"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] text-[var(--semantic-text-muted)] hover:text-[var(--semantic-text-strong)]"
                }`}
              >
                {TOOL_LABELS[tool.id]}
              </button>
            ))}
          </div>
        </div>
      </LearnerSurfaceCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <LearnerSurfaceCard className="p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-brand)]">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-[var(--semantic-text-strong)]">{suite.selectedProfession.label}</h2>
                <p className="mt-1 text-sm leading-6 text-[var(--semantic-text-muted)]">{suite.selectedProfession.learnerPositioning}</p>
              </div>
            </div>
            <ProfileSection title="Competencies" items={suite.selectedProfession.competencies} />
            <ProfileSection title="Scope of Practice" items={suite.selectedProfession.scopeOfPractice} />
            <ProfileSection title="Documentation Standards" items={suite.selectedProfession.documentationStandards} />
            <ProfileSection title="Assessment Frameworks" items={suite.selectedProfession.assessmentFrameworks} />
            <ProfileSection title="Licensing / Exam Alignment" items={suite.selectedProfession.licensingExamAlignment} />
          </div>
        </LearnerSurfaceCard>

        <ActiveToolCard tool={activeTool} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SummaryCard title="Competency Portfolio" items={suite.competencyPortfolio.competencyAchievement} />
        <SummaryCard title="Placement Preparation" items={suite.placementPreparation.preparationSheets} />
        <SummaryCard title="Documentation Training" items={suite.documentationTraining.formats} />
      </div>

      <LearnerSurfaceCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">Simulation Ecosystem</p>
            <h2 className="mt-1 text-xl font-bold text-[var(--semantic-text-strong)]">Profession-specific simulation layers</h2>
          </div>
          <Activity className="hidden h-6 w-6 text-[var(--semantic-brand)] sm:block" />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SummaryBlock title="Decision Making" items={suite.simulationEcosystem.decisionMaking} />
          <SummaryBlock title="Documentation" items={suite.simulationEcosystem.documentation} />
          <SummaryBlock title="Communication" items={suite.simulationEcosystem.communication} />
          <SummaryBlock title="Clinical Reasoning" items={suite.simulationEcosystem.clinicalReasoning} />
          <SummaryBlock title="Safety" items={suite.simulationEcosystem.safety} />
          <SummaryBlock title="Escalation" items={suite.simulationEcosystem.escalation} />
        </div>
      </LearnerSurfaceCard>

      <LearnerSurfaceCard className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">Interprofessional Learning</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--semantic-text-strong)]">{suite.interprofessionalCase.title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-muted)]">{suite.interprofessionalCase.patientSummary}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {suite.interprofessionalCase.contributions.map((item) => (
            <div key={item.professionId} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] p-4">
              <h3 className="text-sm font-bold text-[var(--semantic-text-strong)]">{item.professionLabel}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-muted)]">{item.contribution}</p>
              <p className="mt-3 text-xs font-semibold text-[var(--semantic-brand)]">{item.handoffNeed}</p>
            </div>
          ))}
        </div>
      </LearnerSurfaceCard>

      <LearnerSurfaceCard className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-success)]">
            <Save className="h-5 w-5" />
          </span>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--semantic-text-strong)]">Quality Guardrails</h2>
            <ul className="grid gap-2 text-sm leading-6 text-[var(--semantic-text-muted)] md:grid-cols-2">
              {suite.qualityGuards.map((guard) => (
                <li key={guard} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] p-3">
                  {guard}
                </li>
              ))}
            </ul>
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

function ActiveToolCard({ tool }: { tool: SuiteTool | undefined }) {
  if (!tool) return null;
  return (
    <LearnerSurfaceCard className="p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">Active Module</p>
      <h2 className="mt-1 text-xl font-bold text-[var(--semantic-text-strong)]">{tool.title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-muted)]">{tool.sharedPurpose}</p>
      <div className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--semantic-surface))] p-4 text-sm leading-6 text-[var(--semantic-text-strong)]">
        {tool.professionAdaptation}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <SummaryBlock title="Learner Activities" items={tool.activities} />
        <SummaryBlock title="Simulation Hooks" items={tool.simulationHooks} />
        <SummaryBlock title="Portfolio Evidence" items={tool.portfolioEvidence} />
        <SummaryBlock title="Documentation Output" items={[tool.documentationOutput]} />
      </div>
    </LearnerSurfaceCard>
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

function SummaryCard({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <LearnerSurfaceCard className="p-5">
      <h2 className="text-base font-bold text-[var(--semantic-text-strong)]">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--semantic-text-muted)]">
        {items.slice(0, 5).map((item) => (
          <li key={item} className="border-l-2 border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] pl-3">
            {item}
          </li>
        ))}
      </ul>
    </LearnerSurfaceCard>
  );
}

function SummaryBlock({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] p-4">
      <h3 className="text-sm font-bold text-[var(--semantic-text-strong)]">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--semantic-text-muted)]">
        {items.slice(0, 4).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
