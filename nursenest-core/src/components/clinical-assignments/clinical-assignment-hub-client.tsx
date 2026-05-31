"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BookOpen,
  ChevronDown,
  ClipboardCopy,
  ClipboardList,
  FileDown,
  FileText,
  MessageSquare,
  Network,
  Pill,
  Printer,
  RotateCcw,
  Save,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LearnerSurfaceCard } from "@/components/ui/learner-surface-card";
import { SaveToNotebookButton } from "@/components/notebook/save-to-notebook-button";
import {
  formatClinicalAssignmentForCopy,
  generateClinicalAssignment,
  type AssignmentNode,
  type ClinicalAssignmentInput,
  type ClinicalAssignmentModuleId,
  type ClinicalAssignmentRole,
  type ClinicalAssignmentSetting,
} from "@/lib/clinical-assignments/clinical-assignment-hub";

const DRAFT_KEY = "nursenest-clinical-assignment-hub-draft-v1";

const DEFAULT_INPUT: ClinicalAssignmentInput = {
  role: "rn",
  setting: "medical-surgical",
  patientProfile: {
    age: "72",
    sex: "Female",
    weight: "82 kg",
    diagnosis: "Heart failure exacerbation",
    secondaryDiagnoses: "Type 2 diabetes, chronic kidney disease",
    surgicalHistory: "No recent surgery",
    medicalHistory: "Heart failure with reduced ejection fraction, atrial fibrillation",
    currentMedications: "Furosemide, metoprolol, insulin glargine",
    allergies: "No known drug allergies",
  },
  assessmentData: {
    vitalSigns: "BP 96/58, HR 118 irregular, RR 26, SpO2 89% room air",
    laboratoryValues: "BNP 980, potassium 3.1, creatinine 144, glucose 14.2",
    symptoms: "Shortness of breath, fatigue, orthopnea",
    physicalAssessmentFindings: "Bilateral crackles, 3+ ankle edema, cool extremities",
    diagnosticTests: "ECG shows atrial fibrillation",
    imagingFindings: "Chest x-ray shows pulmonary congestion",
  },
};

const MODULES: Array<{ id: ClinicalAssignmentModuleId; label: string; description: string; icon: typeof ClipboardList }> = [
  { id: "care-plan", label: "Care Plan Builder", description: "Priority diagnoses, goals, interventions, rationales, and complication watch.", icon: ClipboardList },
  { id: "concept-map", label: "Concept Map Builder", description: "Interactive cause-and-effect clinical reasoning map with NCJMM domains.", icon: Network },
  { id: "medication-card", label: "Medication Card Generator", description: "Indication, expected effect, side effects, monitoring, and safety checks.", icon: Pill },
  { id: "disease-worksheet", label: "Disease Process Worksheet", description: "Pathophysiology, expected findings, labs, complications, and clinical reasoning.", icon: BookOpen },
  { id: "sbar", label: "SBAR Builder", description: "Situation, background, assessment, recommendation, and escalation rationale.", icon: MessageSquare },
  { id: "clinical-prep", label: "Clinical Preparation Sheet", description: "What to assess, what to explain, and what to prepare before clinical.", icon: FileText },
  { id: "reflection", label: "Clinical Reflection Assistant", description: "Cue-based reflection that explains judgment growth and next-shift goals.", icon: Stethoscope },
];

const ROLE_OPTIONS: Array<{ value: ClinicalAssignmentRole; label: string }> = [
  { value: "student", label: "Nursing Student" },
  { value: "new-grad", label: "New Graduate" },
  { value: "rpn-lpn", label: "RPN/LPN" },
  { value: "rn", label: "RN" },
  { value: "np", label: "NP Student" },
];

const SETTING_OPTIONS: Array<{ value: ClinicalAssignmentSetting; label: string }> = [
  { value: "medical-surgical", label: "Med-Surg" },
  { value: "icu", label: "ICU" },
  { value: "emergency", label: "ER" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "mental-health", label: "Mental Health" },
  { value: "community", label: "Community" },
  { value: "maternal-child", label: "Maternal Child" },
  { value: "long-term-care", label: "LTC" },
];

type InputSection = "patientProfile" | "assessmentData";

export function ClinicalAssignmentHubClient() {
  const [selectedModule, setSelectedModule] = useState<ClinicalAssignmentModuleId>("concept-map");
  const [input, setInput] = useState<ClinicalAssignmentInput>(DEFAULT_INPUT);
  const [draftSaved, setDraftSaved] = useState(false);
  const [restored, setRestored] = useState(false);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => generateClinicalAssignment(input, selectedModule), [input, selectedModule]);
  const copyText = useMemo(() => formatClinicalAssignmentForCopy(output), [output]);

  useEffect(() => {
    const saved = window.localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { input?: ClinicalAssignmentInput; selectedModule?: ClinicalAssignmentModuleId };
      if (parsed.input?.patientProfile && parsed.input?.assessmentData) {
        setInput(parsed.input);
        if (parsed.selectedModule) setSelectedModule(parsed.selectedModule);
        setRestored(true);
      }
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  function updateTopLevel<K extends keyof ClinicalAssignmentInput>(key: K, value: ClinicalAssignmentInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
    setDraftSaved(false);
  }

  function updateNested(section: InputSection, key: string, value: string) {
    setInput((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }));
    setDraftSaved(false);
  }

  function saveDraft() {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ input, selectedModule }));
    setDraftSaved(true);
  }

  function resetExample() {
    setInput(DEFAULT_INPUT);
    setSelectedModule("concept-map");
    setDraftSaved(false);
    setRestored(false);
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-6 print:space-y-4">
      <header className="nn-learner-page-hero">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="nn-ls-kicker">Clinical Assignment Hub</p>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
              Build assignment-ready clinical reasoning outputs.
            </h1>
            <p className="text-sm leading-6 text-[var(--theme-body-text)] sm:text-base">
              Create care plans, concept maps, medication cards, disease worksheets, SBAR reports, prep sheets, and
              reflections from one patient data set. Each output explains the reasoning behind the answer.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button type="button" variant="outline" onClick={saveDraft} className="gap-2">
              <Save className="h-4 w-4" aria-hidden />
              {draftSaved ? "Draft Saved" : "Save Draft"}
            </Button>
            <Button type="button" variant="outline" onClick={resetExample} className="gap-2">
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </Button>
          </div>
        </div>
        {restored ? <p className="mt-3 text-xs font-semibold text-[var(--semantic-success)]">Saved draft restored from this browser.</p> : null}
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-4 print:hidden">
          <LearnerSurfaceCard className="p-4 sm:p-5">
            <h2 className="text-base font-bold text-[var(--theme-heading-text)]">Choose Module</h2>
            <div className="mt-4 grid gap-3">
              {MODULES.map((module) => {
                const Icon = module.icon;
                const active = selectedModule === module.id;
                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => setSelectedModule(module.id)}
                    className={[
                      "flex min-h-20 items-start gap-3 rounded-xl border p-4 text-left transition",
                      active
                        ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))]"
                        : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))]",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-[var(--theme-heading-text)]">{module.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-[var(--theme-muted-text)]">{module.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </LearnerSurfaceCard>

          <AssignmentPanel title="Patient Profile" defaultOpen>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Age" value={input.patientProfile.age} onChange={(value) => updateNested("patientProfile", "age", value)} />
              <Field label="Sex" value={input.patientProfile.sex} onChange={(value) => updateNested("patientProfile", "sex", value)} />
              <Field label="Weight" value={input.patientProfile.weight} onChange={(value) => updateNested("patientProfile", "weight", value)} />
            </div>
            <Field label="Diagnosis" value={input.patientProfile.diagnosis} onChange={(value) => updateNested("patientProfile", "diagnosis", value)} />
            <TextAreaField label="Secondary Diagnoses" value={input.patientProfile.secondaryDiagnoses} onChange={(value) => updateNested("patientProfile", "secondaryDiagnoses", value)} />
            <TextAreaField label="Surgical History" value={input.patientProfile.surgicalHistory} onChange={(value) => updateNested("patientProfile", "surgicalHistory", value)} />
            <TextAreaField label="Medical History" value={input.patientProfile.medicalHistory} onChange={(value) => updateNested("patientProfile", "medicalHistory", value)} />
            <TextAreaField label="Current Medications" value={input.patientProfile.currentMedications} onChange={(value) => updateNested("patientProfile", "currentMedications", value)} />
            <Field label="Allergies" value={input.patientProfile.allergies} onChange={(value) => updateNested("patientProfile", "allergies", value)} />
          </AssignmentPanel>

          <AssignmentPanel title="Assessment Data" defaultOpen>
            <TextAreaField label="Vital Signs" value={input.assessmentData.vitalSigns} onChange={(value) => updateNested("assessmentData", "vitalSigns", value)} />
            <TextAreaField label="Laboratory Values" value={input.assessmentData.laboratoryValues} onChange={(value) => updateNested("assessmentData", "laboratoryValues", value)} />
            <TextAreaField label="Symptoms" value={input.assessmentData.symptoms} onChange={(value) => updateNested("assessmentData", "symptoms", value)} />
            <TextAreaField label="Physical Assessment Findings" value={input.assessmentData.physicalAssessmentFindings} onChange={(value) => updateNested("assessmentData", "physicalAssessmentFindings", value)} />
            <TextAreaField label="Diagnostic Tests" value={input.assessmentData.diagnosticTests} onChange={(value) => updateNested("assessmentData", "diagnosticTests", value)} />
            <TextAreaField label="Imaging Findings" value={input.assessmentData.imagingFindings} onChange={(value) => updateNested("assessmentData", "imagingFindings", value)} />
          </AssignmentPanel>

          <AssignmentPanel title="Clinical Context" defaultOpen>
            <SelectField
              label="Learner Role"
              value={input.role}
              options={ROLE_OPTIONS}
              onChange={(value) => updateTopLevel("role", value as ClinicalAssignmentRole)}
            />
            <SelectField
              label="Clinical Setting"
              value={input.setting}
              options={SETTING_OPTIONS}
              onChange={(value) => updateTopLevel("setting", value as ClinicalAssignmentSetting)}
            />
          </AssignmentPanel>
        </div>

        <div className="space-y-4">
          <div className="sticky top-4 z-10 flex flex-wrap gap-2 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,transparent)] p-3 shadow-[var(--semantic-shadow-soft)] backdrop-blur print:hidden">
            <Button type="button" onClick={copyOutput} className="gap-2">
              <ClipboardCopy className="h-4 w-4" aria-hidden />
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" aria-hidden />
              Print
            </Button>
            <Button type="button" variant="outline" onClick={() => window.print()} className="gap-2">
              <FileDown className="h-4 w-4" aria-hidden />
              PDF Export
            </Button>
            <SaveToNotebookButton
              category="notes"
              sourceType="clinical_skill"
              sourceId={`clinical-assignment-${selectedModule}`}
              title={output.printableTitle}
              content={copyText}
              sourceHref="/app/clinical-assignments"
              topic={input.patientProfile.diagnosis || "Clinical Assignment"}
              tags={["clinical assignment", selectedModule, input.role, input.setting]}
              label="Save To Profile"
            />
          </div>
          <AssignmentOutput output={output} />
        </div>
      </section>

      <p className="text-xs leading-5 text-[var(--theme-muted-text)] print:hidden">
        Educational support only. Learners should verify output with instructor requirements, local policy, scope of
        practice, orders, and current clinical guidelines.
      </p>
    </div>
  );
}

function AssignmentOutput({ output }: { output: ReturnType<typeof generateClinicalAssignment> }) {
  return (
    <div className="space-y-4">
      <LearnerSurfaceCard className="p-5 sm:p-6 print:shadow-none">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--semantic-brand)]">{output.title}</p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--theme-heading-text)]">{output.printableTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--theme-body-text)]">{output.patientSummary}</p>
        <p className="mt-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--semantic-surface))] p-3 text-sm leading-6 text-[var(--theme-body-text)]">
          {output.reasoningSummary}
        </p>
      </LearnerSurfaceCard>

      <ConceptMap nodes={output.nodes} />

      <LearnerSurfaceCard className="p-5 sm:p-6">
        <h3 className="text-base font-bold text-[var(--theme-heading-text)]">Clinical Relationships</h3>
        <div className="mt-4 space-y-3">
          {output.relationships.map((relationship) => (
            <div key={`${relationship.from}-${relationship.to}-${relationship.label}`} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              <p className="text-sm font-bold text-[var(--theme-heading-text)]">
                {relationship.from} -&gt; {relationship.to}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--semantic-brand)]">{relationship.label}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">{relationship.rationale}</p>
            </div>
          ))}
        </div>
      </LearnerSurfaceCard>

      {output.sections.map((section) => (
        <AssignmentPanel key={section.id} title={section.title} defaultOpen>
          <p className="text-sm leading-6 text-[var(--theme-body-text)]">{section.rationale}</p>
          <div className="mt-4 grid gap-3">
            {section.items.map((item) => (
              <div key={`${section.id}-${item.label}-${item.value}`} className={`rounded-xl border p-4 ${toneClass(item.priority ?? "educational")}`}>
                <p className="text-sm font-bold text-[var(--theme-heading-text)]">{item.label}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--theme-body-text)]">{item.value}</p>
                {item.interpretation ? <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">Interpretation: {item.interpretation}</p> : null}
                {item.rationale ? <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">Rationale: {item.rationale}</p> : null}
              </div>
            ))}
          </div>
        </AssignmentPanel>
      ))}

      <AssignmentPanel title="Learner Challenge Mode">
        <ThreeColumnList
          columns={[
            ["Prompts", output.learnerChallenge.prompts],
            ["Answer Key", output.learnerChallenge.answerKey],
            ["Scoring", output.learnerChallenge.scoringGuide],
          ]}
        />
      </AssignmentPanel>

      <AssignmentPanel title="Exam Prep Mode">
        <ThreeColumnList
          columns={[
            ["NCLEX Pearls", output.examPrep.nclexPearls],
            ["REx-PN Pearls", output.examPrep.rexPnPearls],
            ["Priority Actions", output.examPrep.priorityActions],
            ["Safety Alerts", output.examPrep.safetyAlerts],
            ["Common Mistakes", output.examPrep.commonMistakes],
          ]}
        />
      </AssignmentPanel>

      {output.qualityFlags.length ? (
        <AssignmentPanel title="Quality Flags" defaultOpen>
          <ul className="space-y-2 text-sm leading-6 text-[var(--theme-body-text)]">
            {output.qualityFlags.map((flag) => (
              <li key={flag} className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_7%,var(--semantic-surface))] p-3">
                {flag}
              </li>
            ))}
          </ul>
        </AssignmentPanel>
      ) : null}
    </div>
  );
}

function ConceptMap({ nodes }: { nodes: AssignmentNode[] }) {
  const grouped = nodes.reduce<Record<string, AssignmentNode[]>>((acc, node) => {
    acc[node.category] = [...(acc[node.category] ?? []), node];
    return acc;
  }, {});
  const ordered = ["patient", "pathophysiology", "assessment", "lab", "medication", "diagnosis", "priority", "complication", "ncjmm"];

  return (
    <LearnerSurfaceCard className="overflow-hidden p-5 sm:p-6">
      <h3 className="text-base font-bold text-[var(--theme-heading-text)]">Interactive Concept Map</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">
        Expand nodes to follow the expert reasoning chain from diagnosis to pathophysiology, cues, priorities,
        complications, and NCJMM judgment.
      </p>
      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        {ordered
          .filter((category) => grouped[category]?.length)
          .map((category) => (
            <div key={category} className="relative space-y-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[color-mix(in_srgb,var(--semantic-brand)_18%,transparent)] xl:block" aria-hidden />
              <h4 className="relative text-xs font-bold uppercase tracking-[0.08em] text-[var(--semantic-brand)]">{category.replace(/-/g, " ")}</h4>
              {grouped[category].map((node) => (
                <details key={node.id} className={`relative rounded-xl border p-3 shadow-[var(--semantic-shadow-soft)] ${toneClass(node.priority)}`}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-[var(--theme-heading-text)]">
                    {node.title}
                    <ChevronDown className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">{node.summary}</p>
                  <p className="mt-2 text-xs leading-5 text-[var(--theme-muted-text)]">Rationale: {node.rationale}</p>
                  <ul className="mt-2 space-y-1 text-xs leading-5 text-[var(--theme-muted-text)]">
                    {node.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          ))}
      </div>
    </LearnerSurfaceCard>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium text-[var(--theme-heading-text)]">{label}</span>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium text-[var(--theme-heading-text)]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-[var(--theme-body-text)] shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium text-[var(--theme-heading-text)]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-[var(--theme-body-text)] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function AssignmentPanel({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)] print:break-inside-avoid"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-bold text-[var(--theme-heading-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]">
        {title}
        <ChevronDown className="h-4 w-4 text-[var(--semantic-brand)] transition group-open:rotate-180" aria-hidden />
      </summary>
      <div className="space-y-4 border-t border-[var(--semantic-border-soft)] px-5 py-5">{children}</div>
    </details>
  );
}

function ThreeColumnList({ columns }: { columns: Array<[string, string[]]> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {columns.map(([title, items]) => (
        <div key={title}>
          <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--semantic-brand)]">{title}</h4>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--theme-body-text)]">
            {items.map((item) => (
              <li key={item} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-text-muted)_4%,var(--semantic-surface))] p-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function toneClass(priority: "critical" | "warning" | "stable" | "educational"): string {
  if (priority === "critical") return "border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_6%,var(--semantic-surface))]";
  if (priority === "warning") return "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_7%,var(--semantic-surface))]";
  if (priority === "stable") return "border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_6%,var(--semantic-surface))]";
  return "border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--semantic-surface))]";
}
