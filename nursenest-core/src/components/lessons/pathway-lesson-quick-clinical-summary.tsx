import type { CSSProperties } from "react";
import { AlertTriangle, ClipboardCheck, FlaskConical, Lightbulb, ShieldAlert, Stethoscope } from "lucide-react";

function cleanLines(lines: readonly string[] | null | undefined, limit: number): string[] {
  return [...(lines ?? [])]
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, limit);
}

export type QuickClinicalSummaryLabels = {
  eyebrow: string;
  title: string;
  keyTakeaways: string;
  redFlags: string;
  priorityInterventions: string;
  examTraps: string;
  mustKnowLabs: string;
  escalationCues: string;
};

const DEFAULT_LABELS: QuickClinicalSummaryLabels = {
  eyebrow: "Final rapid review before practice",
  title: "Quick Clinical Summary",
  keyTakeaways: "Key Takeaways",
  redFlags: "Red Flags",
  priorityInterventions: "Priority Interventions",
  examTraps: "Exam Traps",
  mustKnowLabs: "Must-Know Labs",
  escalationCues: "Escalation Cues",
};

function SummaryCard({
  title,
  lines,
  icon: Icon,
  accent,
}: {
  title: string;
  lines: readonly string[];
  icon: typeof Lightbulb;
  accent: string;
}) {
  if (lines.length === 0) return null;
  return (
    <section className="nn-lesson-quick-summary-card" style={{ "--summary-accent": accent } as CSSProperties}>
      <div className="nn-lesson-quick-summary-card__title">
        <span className="nn-lesson-quick-summary-card__icon" aria-hidden>
          <Icon className="h-4 w-4" />
        </span>
        <h3>{title}</h3>
      </div>
      <ul>
        {lines.map((line, index) => (
          <li key={`${title}-${index}-${line.slice(0, 16)}`}>{line.replace(/\*\*/g, "")}</li>
        ))}
      </ul>
    </section>
  );
}

export function PathwayLessonQuickClinicalSummary({
  quickReviewLines,
  examFocusLines,
  commonMistakes,
  fullAccess,
  labels: labelsProp,
}: {
  quickReviewLines: readonly string[];
  examFocusLines: readonly string[];
  commonMistakes?: readonly string[] | null;
  fullAccess: boolean;
  /** i18n labels — prefer passing `t("learner.lessons.quickClinical.*")` from route loaders. */
  labels?: Partial<QuickClinicalSummaryLabels>;
}) {
  const lb = { ...DEFAULT_LABELS, ...labelsProp };

  const takeaways = cleanLines(quickReviewLines, 3);
  const redFlags = cleanLines(
    quickReviewLines.filter((line) => /\b(red flag|urgent|worsen|unstable|declin|emergency|report|notify)\b/i.test(line)),
    3,
  );
  const interventions = cleanLines(
    quickReviewLines.filter((line) => /\b(priority|intervention|assess|monitor|teach|administer|position|oxygen|safety)\b/i.test(line)),
    3,
  );
  const traps = cleanLines(fullAccess ? commonMistakes : [], 3);
  const labs = cleanLines(
    [...quickReviewLines, ...examFocusLines].filter((line) =>
      /\b(lab|diagnostic|ABG|PaCO2|pH|ECG|EKG|glucose|potassium|sodium|creatinine|hemoglobin|WBC)\b/i.test(line),
    ),
    3,
  );
  const escalation = cleanLines(
    [...examFocusLines, ...quickReviewLines].filter((line) =>
      /\b(escalat|rapid response|provider|notify|report|emergency|urgent|unstable)\b/i.test(line),
    ),
    3,
  );

  const fallbackExam = cleanLines(examFocusLines, 3);
  const hasAny = takeaways.length || redFlags.length || interventions.length || traps.length || labs.length || escalation.length || fallbackExam.length;
  if (!hasAny) return null;

  return (
    <section
      className="nn-lesson-quick-summary nn-premium-lesson-quick-summary"
      aria-labelledby="quick-clinical-summary"
      data-testid="pathway-lesson-quick-clinical-summary"
    >
      <div className="nn-lesson-quick-summary__header">
        <p>{lb.eyebrow}</p>
        <h2 id="quick-clinical-summary">{lb.title}</h2>
      </div>
      <div className="nn-lesson-quick-summary__grid">
        <SummaryCard title={lb.keyTakeaways} lines={takeaways} icon={Lightbulb} accent="var(--lesson-pearls-accent)" />
        <SummaryCard title={lb.redFlags} lines={redFlags.length ? redFlags : fallbackExam.slice(0, 2)} icon={ShieldAlert} accent="var(--lesson-red-flags-accent)" />
        <SummaryCard
          title={lb.priorityInterventions}
          lines={interventions.length ? interventions : takeaways.slice(0, 2)}
          icon={Stethoscope}
          accent="var(--lesson-interventions-accent)"
        />
        <SummaryCard title={lb.examTraps} lines={traps.length ? traps : fallbackExam} icon={AlertTriangle} accent="var(--lesson-exam-focus-accent)" />
        <SummaryCard title={lb.mustKnowLabs} lines={labs.length ? labs : fallbackExam.slice(0, 2)} icon={FlaskConical} accent="var(--lesson-diagnostics-accent)" />
        <SummaryCard title={lb.escalationCues} lines={escalation.length ? escalation : redFlags.slice(0, 2)} icon={ClipboardCheck} accent="var(--lesson-next-steps-accent)" />
      </div>
    </section>
  );
}
