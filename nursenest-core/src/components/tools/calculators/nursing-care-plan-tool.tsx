"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, ClipboardCopy, FileDown, Printer, RotateCcw, Save, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveToNotebookButton } from "@/components/notebook/save-to-notebook-button";
import {
  formatCarePlanForCopy,
  generateNursingCarePlan,
  type CarePlanIntervention,
  type NursingCarePlanInput,
  type NursingCarePlanOutput,
  type NursingCarePlanRole,
  type NursingCarePriorityLevel,
  type NursingCareSetting,
  type NursingDiagnosisPlan,
} from "@/lib/tools/nursing-care-plan-generator";

const DRAFT_KEY = "nursenest-care-plan-generator-draft-v1";

const DEFAULT_INPUT: NursingCarePlanInput = {
  role: "rn",
  demographics: {
    age: "68",
    sex: "Female",
    weight: "74 kg",
    medicalDiagnosis: "Community-acquired pneumonia",
    surgicalDiagnosis: "",
    comorbidities: "COPD, type 2 diabetes",
  },
  clinicalData: {
    vitalSigns: "T 38.4 C, HR 112, RR 26, BP 104/62, SpO2 89% on room air",
    laboratoryValues: "WBC 16.2, lactate 2.4, glucose 14.8 mmol/L",
    assessmentFindings: "Coarse crackles right lower lobe, productive cough, increased work of breathing, dry mucous membranes",
    symptoms: "Shortness of breath, fatigue, fever, pleuritic chest discomfort",
    currentMedications: "Metformin, tiotropium, salbutamol inhaler PRN",
    allergies: "No known drug allergies",
  },
  careSetting: "medical-surgical",
  priorityLevel: "high-acuity",
  examPrepMode: true,
  learningMode: true,
};

const ROLE_OPTIONS: Array<{ value: NursingCarePlanRole; label: string }> = [
  { value: "rn", label: "RN" },
  { value: "rpn-lpn", label: "RPN/LPN" },
  { value: "np", label: "NP" },
];

const SETTING_OPTIONS: Array<{ value: NursingCareSetting; label: string }> = [
  { value: "medical-surgical", label: "Medical-Surgical" },
  { value: "icu", label: "ICU" },
  { value: "emergency", label: "Emergency" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "maternal-child", label: "Maternal-Child" },
  { value: "mental-health", label: "Mental Health" },
  { value: "community", label: "Community" },
  { value: "long-term-care", label: "Long-Term Care" },
  { value: "rehabilitation", label: "Rehabilitation" },
];

const PRIORITY_OPTIONS: Array<{ value: NursingCarePriorityLevel; label: string }> = [
  { value: "stable", label: "Stable" },
  { value: "moderate-acuity", label: "Moderate Acuity" },
  { value: "high-acuity", label: "High Acuity" },
  { value: "critical", label: "Critical" },
];

type InputSection = "demographics" | "clinicalData";

export default function NursingCarePlanTool() {
  const [input, setInput] = useState<NursingCarePlanInput>(DEFAULT_INPUT);
  const [copied, setCopied] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [restored, setRestored] = useState(false);

  const plan = useMemo(() => generateNursingCarePlan(input), [input]);
  const copyText = useMemo(() => formatCarePlanForCopy(plan), [plan]);

  useEffect(() => {
    const saved = window.localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as NursingCarePlanInput;
      if (parsed?.demographics && parsed?.clinicalData) {
        setInput(parsed);
        setRestored(true);
      }
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  function updateTopLevel<K extends keyof NursingCarePlanInput>(key: K, value: NursingCarePlanInput[K]) {
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

  async function copyPlan() {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function saveDraft() {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(input));
    setDraftSaved(true);
  }

  function resetExample() {
    setInput(DEFAULT_INPUT);
    setDraftSaved(false);
    setRestored(false);
  }

  function printPlan() {
    window.print();
  }

  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--semantic-brand)]">
              <Stethoscope className="h-4 w-4" aria-hidden />
              Educational Care Plan Tool
            </div>
            <p className="max-w-3xl text-sm leading-6 text-[var(--theme-body-text)]">
              Build a priority-ranked nursing care plan with diagnoses, measurable goals, nursing interventions, rationales,
              clinical reasoning, complication watch, and SBAR. Use it for study, clinical preparation, and exam reasoning.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={saveDraft} className="gap-2">
              <Save className="h-4 w-4" aria-hidden />
              {draftSaved ? "Draft Saved" : "Resume Editing Later"}
            </Button>
            <Button type="button" variant="outline" onClick={resetExample} className="gap-2">
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </Button>
          </div>
        </div>
        {restored ? <p className="mt-3 text-xs font-medium text-[var(--semantic-success)]">Saved draft restored from this browser.</p> : null}
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <CarePlanPanel title="Patient Demographics" defaultOpen>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Age" value={input.demographics.age} onChange={(value) => updateNested("demographics", "age", value)} />
              <Field label="Sex" value={input.demographics.sex} onChange={(value) => updateNested("demographics", "sex", value)} />
              <Field label="Weight" value={input.demographics.weight} onChange={(value) => updateNested("demographics", "weight", value)} />
            </div>
            <Field label="Medical Diagnosis" value={input.demographics.medicalDiagnosis} onChange={(value) => updateNested("demographics", "medicalDiagnosis", value)} />
            <Field label="Surgical Diagnosis" value={input.demographics.surgicalDiagnosis} onChange={(value) => updateNested("demographics", "surgicalDiagnosis", value)} />
            <TextAreaField label="Relevant Comorbidities" value={input.demographics.comorbidities} onChange={(value) => updateNested("demographics", "comorbidities", value)} />
          </CarePlanPanel>

          <CarePlanPanel title="Clinical Data" defaultOpen>
            <TextAreaField label="Vital Signs" value={input.clinicalData.vitalSigns} onChange={(value) => updateNested("clinicalData", "vitalSigns", value)} />
            <TextAreaField label="Laboratory Values" value={input.clinicalData.laboratoryValues} onChange={(value) => updateNested("clinicalData", "laboratoryValues", value)} />
            <TextAreaField label="Assessment Findings" value={input.clinicalData.assessmentFindings} onChange={(value) => updateNested("clinicalData", "assessmentFindings", value)} />
            <TextAreaField label="Symptoms" value={input.clinicalData.symptoms} onChange={(value) => updateNested("clinicalData", "symptoms", value)} />
            <TextAreaField label="Current Medications" value={input.clinicalData.currentMedications} onChange={(value) => updateNested("clinicalData", "currentMedications", value)} />
            <Field label="Allergies" value={input.clinicalData.allergies} onChange={(value) => updateNested("clinicalData", "allergies", value)} />
          </CarePlanPanel>

          <CarePlanPanel title="Care Context" defaultOpen>
            <SelectField
              label="Learner Role"
              value={input.role}
              options={ROLE_OPTIONS}
              onChange={(value) => updateTopLevel("role", value as NursingCarePlanRole)}
            />
            <SelectField
              label="Care Setting"
              value={input.careSetting}
              options={SETTING_OPTIONS}
              onChange={(value) => updateTopLevel("careSetting", value as NursingCareSetting)}
            />
            <SelectField
              label="Priority Level"
              value={input.priorityLevel}
              options={PRIORITY_OPTIONS}
              onChange={(value) => updateTopLevel("priorityLevel", value as NursingCarePriorityLevel)}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleField
                label="Exam Prep Mode"
                description="Adds NCLEX/REx-PN pearls, traps, delegation, and safety alerts."
                checked={input.examPrepMode}
                onChange={(value) => updateTopLevel("examPrepMode", value)}
              />
              <ToggleField
                label="Learning Mode"
                description="Adds pathophysiology, pharmacology, assessments, and red flags."
                checked={input.learningMode}
                onChange={(value) => updateTopLevel("learningMode", value)}
              />
            </div>
          </CarePlanPanel>
        </div>

        <div className="space-y-4">
          <div className="sticky top-4 z-10 flex flex-wrap gap-2 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,transparent)] p-3 shadow-[var(--semantic-shadow-soft)] backdrop-blur">
            <Button type="button" onClick={copyPlan} className="gap-2">
              <ClipboardCopy className="h-4 w-4" aria-hidden />
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button type="button" variant="outline" onClick={printPlan} className="gap-2">
              <Printer className="h-4 w-4" aria-hidden />
              Print
            </Button>
            <Button type="button" variant="outline" onClick={printPlan} className="gap-2">
              <FileDown className="h-4 w-4" aria-hidden />
              PDF Export
            </Button>
            <SaveToNotebookButton
              category="notes"
              sourceType="clinical_skill"
              sourceId={`care-plan-${input.demographics.medicalDiagnosis || "draft"}`}
              title="Nursing Care Plan"
              content={copyText}
              sourceHref="/tools/care-plan"
              topic={input.demographics.medicalDiagnosis || "Care Planning"}
              tags={["care plan", input.role.toUpperCase(), input.careSetting]}
              label="Save To Profile"
            />
          </div>
          <CarePlanOutput plan={plan} />
        </div>
      </section>

      <p className="text-xs leading-5 text-[var(--theme-muted-text)]">
        Educational tool only. Care plans must be reviewed against local policy, provider orders, scope of practice,
        patient-specific assessment, and current clinical guidelines.
      </p>
    </div>
  );
}

function CarePlanOutput({ plan }: { plan: NursingCarePlanOutput }) {
  return (
    <div className="space-y-4 print:space-y-3">
      <CarePlanPanel title="Patient Summary" defaultOpen>
        <p className="text-sm leading-6 text-[var(--theme-body-text)]">{plan.patientSummary}</p>
      </CarePlanPanel>

      <CarePlanPanel title="Diagnoses" defaultOpen>
        <div className="space-y-4">
          {plan.diagnoses.map((diagnosis) => (
            <DiagnosisCard key={`${diagnosis.rank}-${diagnosis.problem}`} diagnosis={diagnosis} />
          ))}
        </div>
      </CarePlanPanel>

      <CarePlanPanel title="Goals">
        <div className="space-y-4">
          {plan.diagnoses.map((diagnosis) => (
            <div key={`goals-${diagnosis.problem}`} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              <h4 className="text-sm font-bold text-[var(--theme-heading-text)]">{diagnosis.problem}</h4>
              <TwoColumnList leftTitle="Short-Term Goals" left={diagnosis.shortTermGoals} rightTitle="Long-Term Goals" right={diagnosis.longTermGoals} />
            </div>
          ))}
        </div>
      </CarePlanPanel>

      <CarePlanPanel title="Interventions" defaultOpen>
        <div className="space-y-4">
          {plan.diagnoses.map((diagnosis) => (
            <InterventionGroup key={`interventions-${diagnosis.problem}`} diagnosis={diagnosis} />
          ))}
        </div>
      </CarePlanPanel>

      <CarePlanPanel title="Evaluation">
        <div className="space-y-4">
          {plan.diagnoses.map((diagnosis) => (
            <div key={`evaluation-${diagnosis.problem}`} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              <h4 className="text-sm font-bold text-[var(--theme-heading-text)]">{diagnosis.problem}</h4>
              <ThreeColumnList
                columns={[
                  ["Goal Met", diagnosis.evaluation.goalMet],
                  ["Partially Met", diagnosis.evaluation.partiallyMet],
                  ["Not Met", diagnosis.evaluation.notMet],
                ]}
              />
            </div>
          ))}
        </div>
      </CarePlanPanel>

      <CarePlanPanel title="Education">
        <ThreeColumnList
          columns={[
            ["Disease Education", plan.patientEducation.diseaseEducation],
            ["Medication Teaching", plan.patientEducation.medicationTeaching],
            ["Discharge Teaching", plan.patientEducation.dischargeTeaching],
            ["Safety Teaching", plan.patientEducation.safetyTeaching],
            ["Self-Management Teaching", plan.patientEducation.selfManagementTeaching],
          ]}
        />
      </CarePlanPanel>

      <CarePlanPanel title="Clinical Reasoning" defaultOpen>
        <div className="space-y-4 text-sm leading-6 text-[var(--theme-body-text)]">
          <p>{plan.clinicalReasoning.priorityFramework}</p>
          <p>{plan.clinicalReasoning.abcReasoning}</p>
          <p>{plan.clinicalReasoning.maslowReasoning}</p>
          <ThreeColumnList
            columns={[
              ["Safety Risks", plan.clinicalReasoning.safetyRisks],
              ["Deterioration Risks", plan.clinicalReasoning.deteriorationRisks],
              ["Potential Complications", plan.clinicalReasoning.potentialComplications],
            ]}
          />
        </div>
      </CarePlanPanel>

      <CarePlanPanel title="Complication Watch" defaultOpen>
        <div className="space-y-3">
          {plan.complicationWatch.map((item) => (
            <div key={item.warningSign} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              <p className="text-sm font-bold text-[var(--theme-heading-text)]">{item.warningSign}</p>
              <p className="mt-2 text-sm text-[var(--theme-body-text)]">
                <strong>Why It Matters:</strong> {item.whyItMatters}
              </p>
              <p className="mt-2 text-sm text-[var(--theme-body-text)]">
                <strong>Immediate Nursing Response:</strong> {item.immediateNursingResponse}
              </p>
            </div>
          ))}
        </div>
      </CarePlanPanel>

      <CarePlanPanel title="SBAR" defaultOpen>
        <div className="grid gap-3 sm:grid-cols-2">
          <SbarItem label="Situation" value={plan.sbar.situation} />
          <SbarItem label="Background" value={plan.sbar.background} />
          <SbarItem label="Assessment" value={plan.sbar.assessment} />
          <SbarItem label="Recommendation" value={plan.sbar.recommendation} />
        </div>
      </CarePlanPanel>

      {plan.examPrep ? (
        <CarePlanPanel title="Exam Prep Mode">
          <ThreeColumnList
            columns={[
              ["Clinical Pearls", plan.examPrep.clinicalPearls],
              ["Common Exam Traps", plan.examPrep.commonExamTraps],
              ["Priority Nursing Actions", plan.examPrep.priorityNursingActions],
              ["Delegation Considerations", plan.examPrep.delegationConsiderations],
              ["Patient Safety Alerts", plan.examPrep.patientSafetyAlerts],
            ]}
          />
        </CarePlanPanel>
      ) : null}

      {plan.learning ? (
        <CarePlanPanel title="Learning Mode">
          <p className="mb-4 text-sm leading-6 text-[var(--theme-body-text)]">{plan.learning.pathophysiologySummary}</p>
          <ThreeColumnList
            columns={[
              ["Nursing Considerations", plan.learning.nursingConsiderations],
              ["Pharmacology Considerations", plan.learning.pharmacologyConsiderations],
              ["Priority Assessments", plan.learning.priorityAssessments],
              ["Red Flags", plan.learning.redFlags],
            ]}
          />
        </CarePlanPanel>
      ) : null}
    </div>
  );
}

function DiagnosisCard({ diagnosis }: { diagnosis: NursingDiagnosisPlan }) {
  return (
    <article className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--semantic-brand)] text-xs font-bold text-[var(--semantic-on-brand)]">
          {diagnosis.rank}
        </span>
        <div className="space-y-2">
          <h3 className="text-base font-bold text-[var(--theme-heading-text)]">{diagnosis.problem}</h3>
          <p className="text-sm text-[var(--theme-body-text)]">
            <strong>Related To:</strong> {diagnosis.relatedTo}
          </p>
          <p className="text-sm text-[var(--theme-body-text)]">
            <strong>As Evidenced By:</strong> {diagnosis.asEvidencedBy}
          </p>
          <p className="text-sm text-[var(--theme-body-text)]">
            <strong>Why Prioritized:</strong> {diagnosis.priorityReason}
          </p>
        </div>
      </div>
    </article>
  );
}

function InterventionGroup({ diagnosis }: { diagnosis: NursingDiagnosisPlan }) {
  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
      <h4 className="text-sm font-bold text-[var(--theme-heading-text)]">{diagnosis.problem}</h4>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <InterventionList title="Independent Nursing Interventions" items={diagnosis.independentInterventions} />
        <InterventionList title="Collaborative Interventions" items={diagnosis.collaborativeInterventions} />
      </div>
    </div>
  );
}

function InterventionList({ title, items }: { title: string; items: CarePlanIntervention[] }) {
  return (
    <div>
      <h5 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--semantic-brand)]">{title}</h5>
      <ol className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.action} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-text-muted)_4%,var(--semantic-surface))] p-3 text-sm">
            <p className="font-semibold text-[var(--theme-heading-text)]">Intervention: {item.action}</p>
            <p className="mt-1 leading-6 text-[var(--theme-body-text)]">Rationale: {item.rationale}</p>
          </li>
        ))}
      </ol>
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

function ToggleField({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-24 cursor-pointer items-start gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))]">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-4 w-4 accent-[var(--semantic-brand)]" />
      <span>
        <span className="block font-bold text-[var(--theme-heading-text)]">{label}</span>
        <span className="mt-1 block leading-5 text-[var(--theme-muted-text)]">{description}</span>
      </span>
    </label>
  );
}

function CarePlanPanel({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
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

function TwoColumnList({ leftTitle, left, rightTitle, right }: { leftTitle: string; left: string[]; rightTitle: string; right: string[] }) {
  return (
    <div className="mt-3 grid gap-4 md:grid-cols-2">
      <SimpleList title={leftTitle} items={left} />
      <SimpleList title={rightTitle} items={right} />
    </div>
  );
}

function ThreeColumnList({ columns }: { columns: Array<[string, string[]]> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {columns.map(([title, items]) => (
        <SimpleList key={title} title={title} items={items} />
      ))}
    </div>
  );
}

function SimpleList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h5 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--semantic-brand)]">{title}</h5>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-[var(--theme-body-text)]">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-text-muted)_4%,var(--semantic-surface))] p-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SbarItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--semantic-surface))] p-4">
      <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--semantic-info)]">{label}</h4>
      <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">{value}</p>
    </div>
  );
}
