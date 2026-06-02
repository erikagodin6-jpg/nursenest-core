"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  CalendarCheck,
  CheckSquare,
  ClipboardCopy,
  ClipboardList,
  FileDown,
  FileText,
  HelpCircle,
  MessageSquareText,
  Pill,
  Printer,
  RotateCcw,
  Save,
  Stethoscope,
  TestTube2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LearnerSurfaceCard } from "@/components/ui/learner-surface-card";
import { SaveToNotebookButton } from "@/components/notebook/save-to-notebook-button";
import {
  formatClinicalDaySurvivalForCopy,
  generateClinicalDaySurvivalHub,
  type ClinicalDayInput,
  type ClinicalDayModuleId,
  type ClinicalDayRole,
  type ClinicalDayUnit,
} from "@/lib/clinical-day-survival/clinical-day-survival-hub";

const DRAFT_KEY = "nursenest-clinical-day-survival-hub-draft-v1";

const DEFAULT_INPUT: ClinicalDayInput = {
  role: "rn-student",
  unit: "med-surg",
  diagnosis: "Heart failure exacerbation",
  age: "72",
  comorbidities: "Type 2 diabetes, chronic kidney disease",
  medications: "Furosemide, metoprolol, insulin glargine",
  labs: "BNP 980, potassium 3.1, creatinine 144, glucose 14.2",
  notes: "Patient has shortness of breath, bilateral crackles, ankle edema, and fatigue.",
};

const MODULES: Array<{ id: ClinicalDayModuleId; label: string; icon: typeof ClipboardList; description: string }> = [
  { id: "patient-assignment", label: "Patient Assignment Prep", icon: ClipboardList, description: "Snapshot, patho, meds, labs, red flags, priorities, and instructor questions." },
  { id: "tomorrow-cheat-sheet", label: "What Should I Know Tomorrow?", icon: CalendarCheck, description: "One-page clinical shift cheat sheet for tomorrow's patient." },
  { id: "pre-conference", label: "Pre-Conference Prep", icon: CheckSquare, description: "Checklist for diagnosis, medications, labs, assessment, and safety." },
  { id: "post-conference", label: "Post-Conference Prep", icon: MessageSquareText, description: "Reflection prompts that identify learning gaps and next-shift improvements." },
  { id: "instructor-questions", label: "Instructor Question Bank", icon: HelpCircle, description: "Patho, pharm, labs, assessment, prioritization, teaching, and safety questions." },
  { id: "med-pass", label: "Medication Pass Prep", icon: Pill, description: "Indication, mechanism, effects, monitoring, hold logic, and teaching." },
  { id: "lab-prep", label: "Lab Interpretation Prep", icon: TestTube2, description: "Priority labs with normal ranges, significance, and nursing actions." },
  { id: "shift-prioritization", label: "Shift Prioritization", icon: Stethoscope, description: "Immediate priorities, first assessments, safety concerns, and escalation triggers." },
  { id: "skills-prep", label: "Clinical Skills Prep", icon: BookOpenCheck, description: "Likely skills based on diagnosis and unit, linked to NurseNest skills content." },
  { id: "rapid-review", label: "Rapid Review Sheets", icon: FileText, description: "Printable concise reviews for common clinical diagnoses." },
];

const ROLE_OPTIONS: Array<{ value: ClinicalDayRole; label: string }> = [
  { value: "rn-student", label: "RN Student" },
  { value: "rpn-lpn-student", label: "RPN/LPN Student" },
  { value: "np-student", label: "NP Student" },
];

const UNIT_OPTIONS: Array<{ value: ClinicalDayUnit; label: string }> = [
  { value: "med-surg", label: "Med-Surg" },
  { value: "icu", label: "ICU" },
  { value: "er", label: "ER" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "maternal-child", label: "Maternal Child" },
  { value: "mental-health", label: "Mental Health" },
  { value: "community", label: "Community" },
  { value: "ltc", label: "LTC" },
];

export function ClinicalDaySurvivalHubClient() {
  const [input, setInput] = useState<ClinicalDayInput>(DEFAULT_INPUT);
  const [moduleId, setModuleId] = useState<ClinicalDayModuleId>("patient-assignment");
  const [personalNotes, setPersonalNotes] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [restored, setRestored] = useState(false);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => generateClinicalDaySurvivalHub(input, moduleId), [input, moduleId]);
  const copyText = useMemo(() => `${formatClinicalDaySurvivalForCopy(output)}\n\nPersonal Notes\n${personalNotes}`, [output, personalNotes]);

  useEffect(() => {
    const saved = window.localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { input?: ClinicalDayInput; moduleId?: ClinicalDayModuleId; personalNotes?: string };
      if (parsed.input?.diagnosis) {
        setInput(parsed.input);
        if (parsed.moduleId) setModuleId(parsed.moduleId);
        setPersonalNotes(parsed.personalNotes ?? "");
        setRestored(true);
      }
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  function update<K extends keyof ClinicalDayInput>(key: K, value: ClinicalDayInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
    setDraftSaved(false);
  }

  function saveDraft() {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ input, moduleId, personalNotes }));
    setDraftSaved(true);
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
            <p className="nn-ls-kicker">Clinical Day Survival Hub</p>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
              Prep tomorrow&apos;s patient assignment in under 60 seconds.
            </h1>
            <p className="text-sm leading-6 text-[var(--theme-body-text)] sm:text-base">
              Generate patient snapshots, one-page cheat sheets, pre-conference checklists, instructor questions,
              med-pass prep, lab interpretation, shift priorities, clinical skills, and reflection prompts.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button type="button" variant="outline" onClick={saveDraft} className="gap-2">
              <Save className="h-4 w-4" aria-hidden />
              {draftSaved ? "Draft Saved" : "Save Draft"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setInput(DEFAULT_INPUT);
                setModuleId("patient-assignment");
                setPersonalNotes("");
                setDraftSaved(false);
                setRestored(false);
              }}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </Button>
          </div>
        </div>
        {restored ? <p className="mt-3 text-xs font-semibold text-[var(--semantic-success)]">Previous prep restored from this browser.</p> : null}
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="space-y-4 print:hidden">
          <LearnerSurfaceCard className="p-4 sm:p-5">
            <h2 className="text-base font-bold text-[var(--theme-heading-text)]">Clinical Day Module</h2>
            <div className="mt-4 grid gap-3">
              {MODULES.map((module) => {
                const Icon = module.icon;
                const active = module.id === moduleId;
                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => setModuleId(module.id)}
                    aria-pressed={active}
                    className={[
                      "flex min-h-20 items-start gap-3 rounded-xl border p-4 text-left transition",
                      active
                        ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))]"
                        : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))]",
                    ].join(" ")}
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

          <SurvivalPanel title="Tomorrow's Assignment" defaultOpen>
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField label="Role" value={input.role} options={ROLE_OPTIONS} onChange={(value) => update("role", value as ClinicalDayRole)} />
              <SelectField label="Unit" value={input.unit} options={UNIT_OPTIONS} onChange={(value) => update("unit", value as ClinicalDayUnit)} />
            </div>
            <Field label="Patient Diagnosis" value={input.diagnosis} onChange={(value) => update("diagnosis", value)} />
            <Field label="Patient Age" value={input.age} onChange={(value) => update("age", value)} />
            <TextAreaField label="Relevant Comorbidities" value={input.comorbidities} onChange={(value) => update("comorbidities", value)} />
            <TextAreaField label="Medications" value={input.medications} onChange={(value) => update("medications", value)} />
            <TextAreaField label="Labs / Patient Values" value={input.labs} onChange={(value) => update("labs", value)} />
            <TextAreaField label="Assignment Notes" value={input.notes} onChange={(value) => update("notes", value)} />
          </SurvivalPanel>

          <SurvivalPanel title="Personal Notes">
            <TextAreaField label="Add notes for instructor expectations, unit routines, or questions to ask." value={personalNotes} onChange={setPersonalNotes} rows={6} />
          </SurvivalPanel>
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
              sourceId={`clinical-day-survival-${moduleId}`}
              title={`${output.title}: ${input.diagnosis || "Clinical Prep"}`}
              content={copyText}
              sourceHref="/app/clinical-day-survival"
              topic={input.diagnosis || "Clinical Day Prep"}
              tags={["clinical day", moduleId, input.role, input.unit]}
              label="Save To Profile"
            />
          </div>
          <ClinicalDayOutput output={output} personalNotes={personalNotes} />
        </div>
      </section>
    </div>
  );
}

function ClinicalDayOutput({ output, personalNotes }: { output: ReturnType<typeof generateClinicalDaySurvivalHub>; personalNotes: string }) {
  return (
    <div className="space-y-4">
      <LearnerSurfaceCard className="p-5 sm:p-6 print:shadow-none">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--semantic-brand)]">{output.title}</p>
        <h2 className="mt-2 text-2xl font-bold text-[var(--theme-heading-text)]">{output.patientSnapshot.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--theme-body-text)]">{output.patientSnapshot.rationale}</p>
      </LearnerSurfaceCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {output.onePageSummary.map((card) => (
          <LearnerSurfaceCard key={card.id} className={`p-5 ${toneClass(card.priority)}`}>
            <h3 className="text-base font-bold text-[var(--theme-heading-text)]">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">{card.rationale}</p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--theme-body-text)]">
              {card.bullets.map((bullet) => (
                <li key={bullet} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-text-muted)_4%,var(--semantic-surface))] p-3">
                  {bullet}
                </li>
              ))}
            </ul>
          </LearnerSurfaceCard>
        ))}
      </div>

      <SurvivalPanel title="Pre/Post Conference Checklist" defaultOpen>
        <div className="grid gap-3">
          {output.checklist.map((item) => (
            <label key={item.label} className="flex items-start gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm">
              <input type="checkbox" defaultChecked={item.doneByDefault} className="mt-1 h-4 w-4 accent-[var(--semantic-brand)]" />
              <span>
                <span className="block font-bold text-[var(--theme-heading-text)]">{item.label}</span>
                <span className="mt-1 block leading-6 text-[var(--theme-body-text)]">{item.rationale}</span>
              </span>
            </label>
          ))}
        </div>
      </SurvivalPanel>

      <SurvivalPanel title="Clinical Instructor Questions" defaultOpen>
        <div className="grid gap-3">
          {output.instructorQuestions.map((item) => (
            <article key={`${item.category}-${item.question}`} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.08em]">
                <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-2 py-1 text-[var(--semantic-brand)]">{item.category}</span>
                <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] px-2 py-1 text-[var(--semantic-info)]">{item.difficulty}</span>
              </div>
              <p className="mt-3 text-sm font-bold text-[var(--theme-heading-text)]">{item.question}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">Model answer: {item.modelAnswer}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">Rationale: {item.rationale}</p>
            </article>
          ))}
        </div>
      </SurvivalPanel>

      <SurvivalPanel title="Clinical Skills To Review">
        <div className="grid gap-3 md:grid-cols-2">
          {output.skills.map((skill) => (
            <Link
              key={skill.href}
              href={skill.href}
              className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))]"
            >
              <span className="block text-sm font-bold text-[var(--theme-heading-text)]">{skill.label}</span>
              <span className="mt-2 block text-sm leading-6 text-[var(--theme-body-text)]">{skill.whyRelevant}</span>
            </Link>
          ))}
        </div>
      </SurvivalPanel>

      <SurvivalPanel title="Rapid Review Sheet">
        <div className="grid gap-3 md:grid-cols-2">
          {output.rapidReview.map((card) => (
            <div key={card.id} className={`rounded-xl border p-4 ${toneClass(card.priority)}`}>
              <h3 className="text-sm font-bold text-[var(--theme-heading-text)]">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">{card.rationale}</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--theme-body-text)]">
                {card.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SurvivalPanel>

      {personalNotes.trim() ? (
        <SurvivalPanel title="Personal Notes" defaultOpen>
          <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--theme-body-text)]">{personalNotes}</p>
        </SurvivalPanel>
      ) : null}

      <SurvivalPanel title="Access Model">
        <div className="grid gap-3 md:grid-cols-2">
          <p className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm leading-6 text-[var(--theme-body-text)]">
            {output.monetization.freeTierLimit}
          </p>
          <p className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--semantic-surface))] p-4 text-sm leading-6 text-[var(--theme-body-text)]">
            {output.monetization.paidTierUnlock}
          </p>
        </div>
      </SurvivalPanel>

      {output.qualityFlags.length ? (
        <SurvivalPanel title="Prep Quality Flags" defaultOpen>
          <ul className="space-y-2 text-sm leading-6 text-[var(--theme-body-text)]">
            {output.qualityFlags.map((flag) => (
              <li key={flag} className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_7%,var(--semantic-surface))] p-3">
                {flag}
              </li>
            ))}
          </ul>
        </SurvivalPanel>
      ) : null}
    </div>
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

function TextAreaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium text-[var(--theme-heading-text)]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
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

function SurvivalPanel({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  return (
    <details open={defaultOpen} className="group rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)] print:break-inside-avoid">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-bold text-[var(--theme-heading-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]">
        {title}
      </summary>
      <div className="space-y-4 border-t border-[var(--semantic-border-soft)] px-5 py-5">{children}</div>
    </details>
  );
}

function toneClass(priority: "critical" | "warning" | "stable" | "teaching"): string {
  if (priority === "critical") return "border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_6%,var(--semantic-surface))]";
  if (priority === "warning") return "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_7%,var(--semantic-surface))]";
  if (priority === "stable") return "border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_6%,var(--semantic-surface))]";
  return "border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--semantic-surface))]";
}
