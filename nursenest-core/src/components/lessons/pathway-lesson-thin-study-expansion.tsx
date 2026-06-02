import type {
  PathwayLessonRecord,
  PathwayLessonSection,
  PathwayLessonSectionKind,
} from "@/lib/lessons/pathway-lesson-types";
import { stripToPlainText } from "@/lib/content-quality/plain-text";

function firstChunk(text: string, maxLen: number): string {
  const t = stripToPlainText(text).replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > maxLen ? `${t.slice(0, maxLen - 1).trim()}…` : t;
}

function sectionByKind(
  sections: PathwayLessonSection[],
  kind: PathwayLessonSectionKind,
): PathwayLessonSection | undefined {
  return sections.find((s) => s.kind === kind);
}

export type ThinStudyExpansionPanel = { id: string; title: string; body: string };

/**
 * Structured “at a glance” rows built only from fields already on the lesson record
 * (no invented clinical claims).
 */
export function buildThinLessonStudyExpansionPanels(lesson: PathwayLessonRecord): ThinStudyExpansionPanel[] {
  const panels: ThinStudyExpansionPanel[] = [];
  const meta = lesson.activeExamMeta;
  if (meta) {
    const bits: string[] = [];
    if (meta.clinicalPriority) bits.push(`Clinical priority: ${meta.clinicalPriority.replace(/_/g, " ")}`);
    if (meta.yieldLevel) bits.push(`Exam yield: ${meta.yieldLevel.replace(/_/g, " ")}`);
    const line = bits.join(" · ");
    if (line) panels.push({ id: "thin-clinical-priority", title: "Clinical priority", body: line });
  }

  const signs = sectionByKind(lesson.sections, "signs_symptoms");
  const signsText = signs ? firstChunk(typeof signs.body === "string" ? signs.body : "", 360) : "";
  if (signsText) panels.push({ id: "thin-assessment-cues", title: "Assessment cues", body: signsText });

  const nai = sectionByKind(lesson.sections, "nursing_assessment_interventions");
  const naiText = nai ? firstChunk(typeof nai.body === "string" ? nai.body : "", 360) : "";
  if (naiText) panels.push({ id: "thin-nursing-actions", title: "Nursing actions", body: naiText });

  const trapFromLesson = (lesson.studyCommonTraps ?? []).map((s) => s.trim()).filter(Boolean)[0];
  const examFocus = lesson.sections.find((s) => s.kind === "exam_focus" && s.examFocus?.commonTraps);
  const trapFromSection = examFocus?.examFocus?.commonTraps ? firstChunk(examFocus.examFocus.commonTraps, 320) : "";
  const trap = trapFromLesson || trapFromSection;
  if (trap) panels.push({ id: "thin-exam-trap", title: "Exam trap", body: trap });

  const safety = lesson.memoryAnchor?.trim();
  if (safety) panels.push({ id: "thin-safety", title: "Safety takeaway", body: safety });

  const overview = firstChunk(lesson.seoDescription ?? "", 400);
  if (overview && panels.length < 6) {
    panels.push({ id: "thin-topic-overview", title: "Topic overview", body: overview });
  }

  return panels;
}

/**
 * Extra study panels when teaching depth is below internal targets — uses {@link buildThinLessonStudyExpansionPanels}.
 */
export function PathwayLessonThinStudyExpansion({ lesson }: { lesson: PathwayLessonRecord }) {
  const panels = buildThinLessonStudyExpansionPanels(lesson);
  if (panels.length === 0) return null;

  return (
    <div
      className="mt-5 grid gap-3 sm:grid-cols-2"
      data-testid="pathway-lesson-thin-study-expansion"
      aria-label="Structured study highlights"
    >
      {panels.map((p) => (
        <section
          key={p.id}
          className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-chart-2)_12%)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_18%,var(--bg-card)_82%)] p-3.5 sm:p-4"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">{p.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">{p.body}</p>
        </section>
      ))}
    </div>
  );
}
