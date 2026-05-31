"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ClipboardCopy, FileDown, Printer, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LearnerSurfaceCard } from "@/components/ui/learner-surface-card";
import { SaveToNotebookButton } from "@/components/notebook/save-to-notebook-button";
import {
  formatClinicalWorksheetForCopy,
  generateClinicalWorksheet,
  type WorksheetInput,
  type WorksheetLearnerMode,
  type WorksheetPatientInput,
  type WorksheetTemplate,
} from "@/lib/clinical-worksheets/clinical-worksheet-brain-sheet-builder";

const DRAFT_KEY = "nursenest-clinical-worksheet-builder-draft-v1";

const DEFAULT_PATIENT: WorksheetPatientInput = {
  id: "p1",
  roomNumber: "412A",
  age: "72",
  diagnosis: "Heart failure exacerbation",
  codeStatus: "Full code",
  allergies: "NKDA",
  medicalHistory: "HFrEF, atrial fibrillation, CKD",
  surgicalHistory: "No recent surgery",
  currentMedications: "Furosemide, metoprolol, insulin glargine",
  relevantLabs: "BNP 980, potassium 3.1, creatinine 144",
  vitalSigns: "BP 96/58, HR 118 irregular, RR 26, SpO2 89% room air",
  mobilityStatus: "1 assist with walker",
  isolationPrecautions: "None",
  diet: "Low sodium, fluid restriction",
  ivAccess: "20g left forearm",
  oxygenRequirements: "2 L nasal cannula after dyspnea",
  monitoringRequirements: "Strict intake/output, daily weight, telemetry",
  personalNotes: "Instructor wants patho and med rationales.",
};

const DEFAULT_INPUT: WorksheetInput = {
  learnerMode: "student",
  template: "student-clinical",
  patients: [DEFAULT_PATIENT],
};

const MODE_OPTIONS: Array<{ value: WorksheetLearnerMode; label: string }> = [
  { value: "student", label: "Student Mode" },
  { value: "new-grad", label: "New Grad Mode" },
  { value: "rpn-lpn", label: "RPN/LPN Mode" },
  { value: "rn", label: "RN Mode" },
  { value: "np", label: "NP Mode" },
];

const TEMPLATE_OPTIONS: Array<{ value: WorksheetTemplate; label: string }> = [
  { value: "student-clinical", label: "Student Clinical Worksheet" },
  { value: "traditional-brain", label: "Traditional Brain Sheet" },
  { value: "med-surg-report", label: "Med-Surg Report Sheet" },
  { value: "icu", label: "ICU Worksheet" },
  { value: "pediatric", label: "Pediatric Worksheet" },
  { value: "mental-health", label: "Mental Health Worksheet" },
  { value: "community", label: "Community Nursing Worksheet" },
  { value: "np-clinical", label: "NP Clinical Worksheet" },
];

export function ClinicalWorksheetBuilderClient() {
  const [input, setInput] = useState<WorksheetInput>(DEFAULT_INPUT);
  const [activePatientIndex, setActivePatientIndex] = useState(0);
  const [draftSaved, setDraftSaved] = useState(false);
  const [restored, setRestored] = useState(false);
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => generateClinicalWorksheet(input), [input]);
  const copyText = useMemo(() => formatClinicalWorksheetForCopy(output), [output]);

  useEffect(() => {
    const saved = window.localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as WorksheetInput;
      if (parsed.patients?.length) {
        setInput(parsed);
        setRestored(true);
      }
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  const activePatient = input.patients[activePatientIndex] ?? input.patients[0];

  function updatePatient(key: keyof WorksheetPatientInput, value: string) {
    setInput((current) => ({
      ...current,
      patients: current.patients.map((patient, index) => (index === activePatientIndex ? { ...patient, [key]: value } : patient)),
    }));
    setDraftSaved(false);
  }

  function setPatientCount(count: number) {
    setInput((current) => {
      const next = [...current.patients];
      while (next.length < count) {
        const number = next.length + 1;
        next.push({ ...DEFAULT_PATIENT, id: `p${number}`, roomNumber: `${410 + number}` });
      }
      return { ...current, patients: next.slice(0, count) };
    });
    setActivePatientIndex((current) => Math.min(current, count - 1));
    setDraftSaved(false);
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-6">
      <header className="nn-learner-page-hero">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="nn-ls-kicker">Clinical Worksheet & Brain Sheet Builder</p>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
              Organize the shift before the shift organizes you.
            </h1>
            <p className="text-sm leading-6 text-[var(--theme-body-text)] sm:text-base">
              Build printable patient worksheets, multi-patient brain sheets, medication organizers, lab trackers,
              task lists, SBAR reports, and clinical reasoning coaching from real assignment data.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button type="button" variant="outline" onClick={() => { window.localStorage.setItem(DRAFT_KEY, JSON.stringify(input)); setDraftSaved(true); }} className="gap-2">
              <Save className="h-4 w-4" aria-hidden />
              {draftSaved ? "Saved" : "Save Draft"}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setInput(DEFAULT_INPUT); setActivePatientIndex(0); setDraftSaved(false); }} className="gap-2">
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </Button>
          </div>
        </div>
        {restored ? <p className="mt-3 text-xs font-semibold text-[var(--semantic-success)]">Saved worksheet restored from this browser.</p> : null}
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="space-y-4 print:hidden">
          <WorksheetPanel title="Worksheet Setup" defaultOpen>
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField label="Mode" value={input.learnerMode} options={MODE_OPTIONS} onChange={(value) => setInput((current) => ({ ...current, learnerMode: value as WorksheetLearnerMode }))} />
              <SelectField label="Template" value={input.template} options={TEMPLATE_OPTIONS} onChange={(value) => setInput((current) => ({ ...current, template: value as WorksheetTemplate }))} />
            </div>
            <SelectField
              label="Number of Patients"
              value={String(input.patients.length)}
              options={[1, 2, 3, 4, 5, 6].map((count) => ({ value: String(count), label: `${count} patient${count > 1 ? "s" : ""}` }))}
              onChange={(value) => setPatientCount(Number(value))}
            />
            <div className="flex flex-wrap gap-2">
              {input.patients.map((patient, index) => (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => setActivePatientIndex(index)}
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${index === activePatientIndex ? "border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)]" : "border-[var(--semantic-border-soft)] text-[var(--theme-muted-text)]"}`}
                >
                  Room {patient.roomNumber || index + 1}
                </button>
              ))}
            </div>
          </WorksheetPanel>

          <WorksheetPanel title={`Patient ${activePatientIndex + 1} Assignment`} defaultOpen>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Room" value={activePatient.roomNumber} onChange={(value) => updatePatient("roomNumber", value)} />
              <Field label="Age" value={activePatient.age} onChange={(value) => updatePatient("age", value)} />
              <Field label="Code Status" value={activePatient.codeStatus} onChange={(value) => updatePatient("codeStatus", value)} />
            </div>
            <Field label="Diagnosis" value={activePatient.diagnosis} onChange={(value) => updatePatient("diagnosis", value)} />
            <Field label="Allergies" value={activePatient.allergies} onChange={(value) => updatePatient("allergies", value)} />
            <TextAreaField label="Medical History" value={activePatient.medicalHistory} onChange={(value) => updatePatient("medicalHistory", value)} />
            <TextAreaField label="Surgical History" value={activePatient.surgicalHistory} onChange={(value) => updatePatient("surgicalHistory", value)} />
            <TextAreaField label="Current Medications" value={activePatient.currentMedications} onChange={(value) => updatePatient("currentMedications", value)} />
            <TextAreaField label="Relevant Labs" value={activePatient.relevantLabs} onChange={(value) => updatePatient("relevantLabs", value)} />
            <TextAreaField label="Vital Signs" value={activePatient.vitalSigns} onChange={(value) => updatePatient("vitalSigns", value)} />
          </WorksheetPanel>

          <WorksheetPanel title="Shift Details">
            <Field label="Mobility Status" value={activePatient.mobilityStatus} onChange={(value) => updatePatient("mobilityStatus", value)} />
            <Field label="Isolation Precautions" value={activePatient.isolationPrecautions} onChange={(value) => updatePatient("isolationPrecautions", value)} />
            <Field label="Diet" value={activePatient.diet} onChange={(value) => updatePatient("diet", value)} />
            <Field label="IV Access" value={activePatient.ivAccess} onChange={(value) => updatePatient("ivAccess", value)} />
            <Field label="Oxygen Requirements" value={activePatient.oxygenRequirements} onChange={(value) => updatePatient("oxygenRequirements", value)} />
            <TextAreaField label="Monitoring Requirements" value={activePatient.monitoringRequirements} onChange={(value) => updatePatient("monitoringRequirements", value)} />
            <TextAreaField label="Smart Notebook Notes" value={activePatient.personalNotes} onChange={(value) => updatePatient("personalNotes", value)} />
          </WorksheetPanel>
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
              sourceId="clinical-worksheet-builder"
              title={output.title}
              content={copyText}
              sourceHref="/app/clinical-worksheet-builder"
              topic={activePatient.diagnosis || "Clinical Worksheet"}
              tags={["brain sheet", input.learnerMode, input.template]}
              label="Save To Profile"
            />
          </div>
          <WorksheetOutput output={output} />
        </div>
      </section>
    </div>
  );
}

function WorksheetOutput({ output }: { output: ReturnType<typeof generateClinicalWorksheet> }) {
  return (
    <div className="space-y-4">
      <LearnerSurfaceCard className="p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--semantic-brand)]">{output.title}</p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--theme-heading-text)]">{output.assignmentSummary.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--theme-body-text)]">{output.assignmentSummary.rationale}</p>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--theme-body-text)]">
          {output.assignmentSummary.bullets.map((bullet) => (
            <li key={bullet} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">{bullet}</li>
          ))}
        </ul>
      </LearnerSurfaceCard>

      <CardView card={output.multiPatientAnalysis} />

      {output.patients.map((patient) => (
        <WorksheetPanel key={patient.patientId} title={`Room ${patient.roomNumber} Brain Sheet`} defaultOpen>
          <CardView card={patient.snapshot} />
          <div className="grid gap-4 xl:grid-cols-2">
            <CardView card={patient.priorityAnalysis} />
            <CardView card={patient.reasoningPanel} />
            <CardView card={patient.reportSheet} />
            <CardView card={patient.learnerModePanel} />
            <CardView card={patient.coachFeedback} />
          </div>

          <MiniSection title="Assessment">
            <div className="grid gap-3 md:grid-cols-2">
              {patient.assessmentSections.map((section) => (
                <div key={section.system} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                  <h4 className="text-sm font-bold text-[var(--theme-heading-text)]">{section.system}</h4>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--theme-body-text)]">
                    {section.prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}
                  </ul>
                  <p className="mt-2 text-xs text-[var(--theme-muted-text)]">{section.notePrompt}</p>
                </div>
              ))}
            </div>
          </MiniSection>

          <MiniSection title="Lab Tracker">
            <div className="grid gap-3">
              {patient.labTracker.map((lab) => (
                <div key={`${patient.patientId}-${lab.lab}-${lab.currentResult}`} className={`rounded-xl border p-4 ${lab.abnormal ? toneClass("high") : toneClass("routine")}`}>
                  <p className="text-sm font-bold text-[var(--theme-heading-text)]">{lab.lab}: {lab.currentResult}</p>
                  <p className="mt-1 text-sm text-[var(--theme-body-text)]">Normal: {lab.normalRange} | Trend: {lab.trend}</p>
                  <p className="mt-1 text-sm text-[var(--theme-body-text)]">{lab.clinicalMeaning}</p>
                </div>
              ))}
            </div>
          </MiniSection>

          <MiniSection title="Medication Organizer">
            <div className="grid gap-3">
              {patient.medicationOrganizer.map((med) => (
                <div key={`${patient.patientId}-${med.medication}`} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                  <p className="text-sm font-bold text-[var(--theme-heading-text)]">{med.medication}</p>
                  <p className="mt-1 text-sm text-[var(--theme-body-text)]">Why: {med.why}</p>
                  <p className="mt-1 text-sm text-[var(--theme-body-text)]">Considerations: {med.nursingConsiderations.join("; ")}</p>
                  <p className="mt-1 text-sm text-[var(--theme-body-text)]">Hold/clarify: {med.holdParameters.join("; ")}</p>
                  <p className="mt-1 text-sm text-[var(--theme-body-text)]">Teaching: {med.patientTeaching.join("; ")}</p>
                </div>
              ))}
            </div>
          </MiniSection>

          <MiniSection title="Shift Task Manager">
            <div className="grid gap-2">
              {patient.tasks.map((task) => (
                <label key={`${patient.patientId}-${task.time}-${task.label}`} className="flex items-start gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 text-sm">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--semantic-brand)]" />
                  <span>
                    <span className="font-bold text-[var(--theme-heading-text)]">{task.time} | Rank {task.priorityRank}: {task.label}</span>
                    <span className="mt-1 block text-[var(--theme-body-text)]">{task.rationale}</span>
                  </span>
                </label>
              ))}
            </div>
          </MiniSection>

          <MiniSection title="SBAR Quick Panel">
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(patient.sbar).map(([key, value]) => (
                <div key={key} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--semantic-brand)]">{key}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">{value}</p>
                </div>
              ))}
            </div>
          </MiniSection>

          <MiniSection title="Smart Notebook">
            <ul className="grid gap-2 text-sm leading-6 text-[var(--theme-body-text)]">
              {patient.smartNotebookPrompts.map((prompt) => <li key={prompt} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">{prompt}</li>)}
            </ul>
          </MiniSection>

          <MiniSection title="Connected NurseNest Practice">
            <div className="grid gap-3 md:grid-cols-2">
              {patient.integrationLinks.map((link) => (
                <Link key={link.href + link.label} href={link.href} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 hover:border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))]">
                  <span className="block text-sm font-bold text-[var(--theme-heading-text)]">{link.label}</span>
                  <span className="mt-2 block text-sm leading-6 text-[var(--theme-body-text)]">{link.rationale}</span>
                </Link>
              ))}
            </div>
          </MiniSection>
        </WorksheetPanel>
      ))}

      <WorksheetPanel title="Access Model">
        <div className="grid gap-3 md:grid-cols-2">
          <p className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm leading-6 text-[var(--theme-body-text)]">{output.monetization.freeTier}</p>
          <p className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--semantic-surface))] p-4 text-sm leading-6 text-[var(--theme-body-text)]">{output.monetization.paidTier}</p>
        </div>
      </WorksheetPanel>
    </div>
  );
}

function CardView({ card }: { card: { title: string; priority: "critical" | "high" | "moderate" | "routine"; bullets: string[]; rationale: string } }) {
  return (
    <div className={`rounded-2xl border p-4 ${toneClass(card.priority)}`}>
      <h3 className="text-base font-bold text-[var(--theme-heading-text)]">{card.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">{card.rationale}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--theme-body-text)]">
        {card.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
      </ul>
    </div>
  );
}

function MiniSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-4">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--semantic-brand)]">{title}</h3>
      {children}
    </section>
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
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-[var(--theme-body-text)] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium text-[var(--theme-heading-text)]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-[var(--theme-body-text)] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function WorksheetPanel({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  return (
    <details open={defaultOpen} className="group rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)] print:break-inside-avoid">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-bold text-[var(--theme-heading-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]">{title}</summary>
      <div className="space-y-4 border-t border-[var(--semantic-border-soft)] px-5 py-5">{children}</div>
    </details>
  );
}

function toneClass(priority: "critical" | "high" | "moderate" | "routine"): string {
  if (priority === "critical") return "border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_6%,var(--semantic-surface))]";
  if (priority === "high") return "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_7%,var(--semantic-surface))]";
  if (priority === "moderate") return "border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--semantic-surface))]";
  return "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]";
}
