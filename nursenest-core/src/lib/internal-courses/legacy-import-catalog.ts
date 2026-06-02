import type { InternalCourseModuleType, InternalCourseStatus, Prisma } from "@prisma/client";

/** RN / NP / New Grad pathway registry ids — courses attach here without appearing in public UI. */
export const INTERNAL_LEGACY_COURSE_PATHWAY_IDS = [
  "us-rn-nclex-rn",
  "ca-np-cnple",
  "us-rn-new-grad-transition",
] as const;

export type LegacyInternalCourseSeed = {
  code: string;
  title: string;
  description: string;
  status: InternalCourseStatus;
  pathwayIds: string[];
  modules: Array<{
    type: InternalCourseModuleType;
    sortOrder: number;
    content: Prisma.InputJsonValue;
    pathwayId?: string | null;
    lessonSlug?: string | null;
  }>;
};

/**
 * Structured interactive modules only — no pasted pathway lesson bodies.
 * `pathwayId` + `lessonSlug` are optional deep links into canonical {@link PathwayLesson} rows.
 */
export const LEGACY_INTERNAL_COURSE_IMPORT: LegacyInternalCourseSeed[] = [
  {
    code: "legacy-ecg-interactive-lab",
    title: "ECG interactive lab (internal)",
    description:
      "Board-style rhythm prompts with reveal rationales. Links out to the canonical RN pathway ECG lesson for deep reading — bodies are not duplicated here.",
    status: "internal",
    pathwayIds: [...INTERNAL_LEGACY_COURSE_PATHWAY_IDS],
    modules: [
      {
        type: "ecg",
        sortOrder: 0,
        pathwayId: "us-rn-nclex-rn",
        lessonSlug: "ecg-systematic-interpretation-nclex-rn",
        content: {
          title: "Inferior injury pattern recognition",
          stripSummary: "Rhythm strip described: ST elevation II/III/aVF with reciprocal depression in aVL.",
          question: "Which immediate nursing bundle best matches this pattern in suspected ACS?",
          answer: "Continuous monitoring, serial vitals, obtain/verify 12‑lead, IV access, notify provider, and prepare cath‑lab activation per protocol.",
          rationale: "Inferior STEMI-equivalent patterns demand time‑critical escalation and monitoring—not delayed reassessment.",
        },
      },
      {
        type: "ecg",
        sortOrder: 1,
        pathwayId: "us-rn-nclex-rn",
        lessonSlug: "ecg-systematic-interpretation-nclex-rn",
        content: {
          title: "Hyperkalemia vs ischemia on the strip",
          stripSummary: "Peaked T waves with widened QRS and loss of P waves in context of renal risk.",
          question: "Before attributing changes solely to ischemia, what focused action reduces catastrophic arrhythmia risk?",
          answer: "Repeat/verify critical labs (potassium), continuous telemetry, and urgent provider communication for treatment per protocol.",
          rationale: "Severe hyperkalemia can mimic or coexist with ischemia; rapid lab verification drives the safest fork.",
        },
      },
      {
        type: "quiz",
        sortOrder: 2,
        pathwayId: "us-rn-nclex-rn",
        lessonSlug: "ecg-systematic-interpretation-nclex-rn",
        content: {
          question: "You see new-onset monomorphic wide-complex tachycardia with hypotension. First-line priority?",
          options: [
            { id: "a", text: "12‑lead + synchronized cardioversion readiness per ACLS unstable VT pathway" },
            { id: "b", text: "Adenosine push empirically without assessing stability" },
            { id: "c", text: "Send patient to waiting room with oral fluids" },
          ],
          correctId: "a",
          rationale: "Unstable wide-complex tachycardia is treated as a resuscitation priority with ACLS-aligned actions.",
        },
      },
    ],
  },
  {
    code: "legacy-abc-priority-lab",
    title: "ABCs prioritization lab (internal)",
    description:
      "Airway–breathing–circulation forks for unstable presentations. Links to the canonical prioritization lesson for extended reading.",
    status: "internal",
    pathwayIds: [...INTERNAL_LEGACY_COURSE_PATHWAY_IDS],
    modules: [
      {
        type: "scenario",
        sortOrder: 0,
        pathwayId: "us-rn-nclex-rn",
        lessonSlug: "us-rn-prioritization-abcs",
        content: {
          stem: "Patient suddenly cannot speak, clutching neck after lunch — stridor audible.",
          decisions: [
            {
              id: "airway_first",
              label: "Call for help, assess airway patency, prepare airway equipment, continuous monitoring",
              outcome:
                "Correct: airway threat with rapid deterioration risk demands immediate airway‑first stabilization and escalation.",
            },
            {
              id: "finish_chart",
              label: "Finish charting the meal intake before reassessment",
              outcome: "Unsafe delay: partial obstruction can progress to complete obstruction without warning.",
            },
          ],
        },
      },
      {
        type: "decision_tree",
        sortOrder: 1,
        pathwayId: "us-rn-nclex-rn",
        lessonSlug: "us-rn-prioritization-abcs",
        content: {
          rootId: "start",
          nodes: [
            {
              id: "start",
              prompt: "Unresponsive with no obvious pulse — what is the first branch?",
              choices: [
                { label: "Start CPR + activate emergency response + retrieve AED/defibrillator", next: "cpr" },
                { label: "Leave to find paperwork first", next: "delay" },
              ],
            },
            {
              id: "cpr",
              prompt: "Circulation support is underway. Next priority while team assembles?",
              choices: [{ label: "High-quality CPR with minimal interruptions; early defibrillation if indicated", next: "done" }],
            },
            { id: "delay", prompt: "Delayed return — perfusion time is lost. Restart with CPR activation now.", choices: [] },
            { id: "done", prompt: "Continue ACLS team roles, airway support as trained, and post‑event debrief.", choices: [] },
          ],
        },
      },
      {
        type: "quiz",
        sortOrder: 2,
        pathwayId: "ca-np-cnple",
        lessonSlug: null,
        content: {
          question: "Which statement best reflects ABC sequencing in sudden decompensation?",
          options: [
            { id: "a", text: "Airway and breathing support precede detailed diagnostic refinement when life threats exist." },
            { id: "b", text: "Diagnostics always precede any airway intervention." },
            { id: "c", text: "Circulation can be deferred if the patient is anxious." },
          ],
          correctId: "a",
          rationale: "Life threats follow ABC stabilization before exhaustive workups.",
        },
      },
    ],
  },
];
