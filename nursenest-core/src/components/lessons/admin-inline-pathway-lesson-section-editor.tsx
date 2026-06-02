"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Edit3, Save, X } from "lucide-react";

import { LessonSectionCard } from "@/components/lessons/lesson-section-card";
import type {
  PathwayLessonFigure,
  PathwayLessonSectionKind,
} from "@/lib/lessons/pathway-lesson-types";

type Props = {
  canEdit: boolean;
  lessonId: string;
  sectionId: string;
  heading: string;
  kind: PathwayLessonSectionKind | undefined | null;
  initialBody: string;
  className?: string;
  editorialRhythmIndex?: number;
  tierRelevanceLearnerSection?: boolean;
  sectionLeadFigure?: PathwayLessonFigure | null;
  children: ReactNode;
};

function renderInlinePreview(text: string): ReactNode {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return <p className="text-sm text-[var(--semantic-text-muted)]">This section is empty.</p>;
  }

  return (
    <div className="lesson-body-presentation space-y-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        if (lines.length > 0 && lines.every((line) => /^[-*]\s+/.test(line))) {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{line.replace(/^[-*]\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        if (lines.length > 0 && lines.every((line) => /^\d+\.\s+/.test(line))) {
          return (
            <ol key={index} className="list-decimal space-y-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{line.replace(/^\d+\.\s+/, "")}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={index} className="whitespace-pre-wrap">
            {block}
          </p>
        );
      })}
    </div>
  );
}

export function AdminInlinePathwayLessonSectionEditor({
  canEdit,
  lessonId,
  sectionId,
  heading,
  kind,
  initialBody,
  className,
  editorialRhythmIndex,
  tierRelevanceLearnerSection = false,
  sectionLeadFigure = null,
  children,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialBody);
  const [savedBody, setSavedBody] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty = draft !== (savedBody ?? initialBody);
  const visibleBody = savedBody ?? initialBody;

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(null), 3500);
    return () => window.clearTimeout(t);
  }, [message]);

  useEffect(() => {
    if (!editing || !dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, editing]);

  const headerAction = useMemo(() => {
    if (!canEdit) return null;
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(visibleBody);
          setEditing(true);
          setError(null);
        }}
        className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,transparent)] px-3 text-xs font-semibold text-[var(--semantic-text-secondary)] shadow-sm transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_38%,var(--semantic-border-soft))] hover:text-[var(--semantic-text-primary)]"
        aria-label={`Edit ${heading}`}
      >
        <Edit3 className="h-3.5 w-3.5" aria-hidden />
        Edit
      </button>
    );
  }, [canEdit, heading, visibleBody]);

  async function save() {
    const trimmed = draft.trim();
    if (!trimmed) {
      setError("Add section content before saving, or use the full admin editor to intentionally clear it.");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    const previous = savedBody;
    setSavedBody(trimmed);
    try {
      const res = await fetch(
        `/api/admin/pathway-lessons/${encodeURIComponent(lessonId)}/sections/${encodeURIComponent(sectionId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ body: trimmed }),
        },
      );
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        throw new Error(payload?.error ?? "Could not save section.");
      }
      setEditing(false);
      setMessage("Section saved.");
      router.refresh();
    } catch (e) {
      setSavedBody(previous);
      setError(e instanceof Error ? e.message : "Could not save section.");
    } finally {
      setSaving(false);
    }
  }

  const editor = editing ? (
    <div className="space-y-3 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_16%,var(--semantic-surface))] p-4">
      <label className="block text-xs font-bold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">
        Editing {heading}
      </label>
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
            event.preventDefault();
            void save();
          }
        }}
        className="min-h-[18rem] w-full rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 text-sm leading-relaxed text-[var(--semantic-text-primary)] shadow-inner outline-none focus:border-[color-mix(in_srgb,var(--semantic-brand)_50%,var(--semantic-border-soft))] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--semantic-brand)_18%,transparent)]"
        aria-label={`Edit ${heading} lesson section`}
      />
      <p className="text-xs leading-relaxed text-[var(--semantic-text-muted)]">
        Supports markdown-style line breaks, bullets, bold markers, headings, and tables used by existing lesson rendering.
        Press Cmd/Ctrl + S to save.
      </p>
      {error ? (
        <p role="alert" className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] px-3 py-2 text-sm text-[var(--semantic-text-primary)]">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[var(--semantic-brand)] px-4 text-sm font-bold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden />
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (dirty && !window.confirm("Discard unsaved changes?")) return;
            setDraft(visibleBody);
            setEditing(false);
            setError(null);
          }}
          disabled={saving}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--semantic-text-secondary)] transition hover:text-[var(--semantic-text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X className="h-4 w-4" aria-hidden />
          Cancel
        </button>
      </div>
    </div>
  ) : savedBody != null ? (
    renderInlinePreview(savedBody)
  ) : (
    children
  );

  return (
    <LessonSectionCard
      id={sectionId}
      heading={heading}
      kind={kind}
      className={className}
      editorialRhythmIndex={editorialRhythmIndex}
      tierRelevanceLearnerSection={tierRelevanceLearnerSection}
      sectionLeadFigure={sectionLeadFigure}
      headerAction={headerAction}
    >
      {message ? (
        <p role="status" className="mb-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))] px-3 py-2 text-sm font-medium text-[var(--semantic-text-primary)]">
          {message}
        </p>
      ) : null}
      {editor}
    </LessonSectionCard>
  );
}
