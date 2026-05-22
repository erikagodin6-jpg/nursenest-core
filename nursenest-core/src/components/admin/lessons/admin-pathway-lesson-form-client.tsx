"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContentStatus } from "@prisma/client";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { marketingPathwayLessonDetailPath } from "@/lib/lessons/lesson-routes";

const STATUSES = [
  ContentStatus.DRAFT,
  ContentStatus.IN_REVIEW,
  ContentStatus.PUBLISHED,
  ContentStatus.ARCHIVED,
] as const;

const SECTION_KINDS = [
  "introduction",
  "pathophysiology_overview",
  "signs_symptoms",
  "clinical_manifestations",
  "red_flags",
  "labs_diagnostics",
  "treatment_management",
  "nursing_assessment_interventions",
  "nursing_priorities",
  "complications",
  "clinical_pearls",
  "client_education",
  "tier_specific_relevance",
  "country_specific_notes",
  "related_next_steps",
  "exam_focus",
  "exam_tips",
  "exam_relevance",
  "clinical_scenario",
  "takeaways",
  "core_concept",
  "clinical_meaning",
  "clinical_application",
  "intro",
  "core",
] as const;

const KIND_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  introduction:                    { bg: "#e8f4fd", border: "#6db3e8", text: "#1a5f8f" },
  pathophysiology_overview:        { bg: "#f0e8fd", border: "#9d6de8", text: "#4a1a8f" },
  signs_symptoms:                  { bg: "#fff8e1", border: "#e8c06d", text: "#8f5a1a" },
  clinical_manifestations:         { bg: "#fff8e1", border: "#e8c06d", text: "#8f5a1a" },
  red_flags:                       { bg: "#fde8e8", border: "#e86d6d", text: "#8f1a1a" },
  complications:                   { bg: "#fde8e8", border: "#e86d6d", text: "#8f1a1a" },
  labs_diagnostics:                { bg: "#e8fdf0", border: "#6de8a0", text: "#1a8f4a" },
  treatment_management:            { bg: "#e8f9e8", border: "#6de87a", text: "#1a6f1a" },
  nursing_assessment_interventions:{ bg: "#e8f0fd", border: "#6d96e8", text: "#1a3a8f" },
  nursing_priorities:              { bg: "#e8f0fd", border: "#6d96e8", text: "#1a3a8f" },
  clinical_pearls:                 { bg: "#fdf6e8", border: "#e8d06d", text: "#8f6e1a" },
  client_education:                { bg: "#f3f9e8", border: "#9de86d", text: "#3d8f1a" },
  tier_specific_relevance:         { bg: "#edf3fd", border: "#7d9ee8", text: "#1a338f" },
  country_specific_notes:          { bg: "#f0fdf8", border: "#6de8c8", text: "#1a6f5a" },
  related_next_steps:              { bg: "#f8f0fd", border: "#c06de8", text: "#6a1a8f" },
  exam_focus:                      { bg: "#fdf0f8", border: "#e86db0", text: "#8f1a5a" },
  exam_tips:                       { bg: "#fdf0f8", border: "#e86db0", text: "#8f1a5a" },
  exam_relevance:                  { bg: "#fdf0f8", border: "#e86db0", text: "#8f1a5a" },
  clinical_scenario:               { bg: "#f0fdf4", border: "#6de88a", text: "#1a6f3a" },
  takeaways:                       { bg: "#fdf4e8", border: "#e8a06d", text: "#8f3a1a" },
  core_concept:                    { bg: "#eef0fd", border: "#8d96e8", text: "#1a1a8f" },
  clinical_meaning:                { bg: "#eef0fd", border: "#8d96e8", text: "#1a1a8f" },
  clinical_application:            { bg: "#e8f0f8", border: "#6d8ee8", text: "#1a3a7f" },
  intro:                           { bg: "#e8f4fd", border: "#6db3e8", text: "#1a5f8f" },
  core:                            { bg: "#eef0fd", border: "#8d96e8", text: "#1a1a8f" },
};

const DEFAULT_COLOR = { bg: "#f5f5f5", border: "#bbb", text: "#444" };

type AdminSection = {
  id: string;
  heading: string;
  kind: string;
  body: string;
};

export type AdminPathwayLessonFormClientProps =
  | { pathwayLessonId: string }
  | { resolve: { pathwayId: string; slug: string; locale?: string } };

function SectionCard({
  section,
  index,
  total,
  onChange,
  onRemove,
  onMove,
  saving,
  onSaveDraft,
  onPublish,
  sectionSaving,
  sectionMsg,
  sectionErr,
}: {
  section: AdminSection;
  index: number;
  total: number;
  onChange: (updated: AdminSection) => void;
  onRemove: () => void;
  onMove: (dir: "up" | "down") => void;
  saving: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  sectionSaving: boolean;
  sectionMsg: string | null;
  sectionErr: string | null;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const headingId = useId();
  const color = KIND_COLORS[section.kind] ?? DEFAULT_COLOR;

  return (
    <div
      style={{
        border: `1px solid ${color.border}`,
        borderLeft: `4px solid ${color.border}`,
        borderRadius: "0.75rem",
        background: color.bg,
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1rem",
          borderBottom: collapsed ? "none" : `1px solid ${color.border}`,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: color.text,
            background: `${color.border}22`,
            border: `1px solid ${color.border}`,
            borderRadius: "0.375rem",
            padding: "0.18rem 0.5rem",
            whiteSpace: "nowrap",
          }}
        >
          {index + 1}
        </span>
        <select
          value={section.kind}
          onChange={(e) => onChange({ ...section, kind: e.target.value })}
          disabled={saving || sectionSaving}
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            color: color.text,
            background: "transparent",
            border: "none",
            outline: "none",
            cursor: "pointer",
            padding: "0 0.25rem",
          }}
        >
          {SECTION_KINDS.map((k) => (
            <option key={k} value={k}>
              {k.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        <input
          id={headingId}
          value={section.heading}
          onChange={(e) => onChange({ ...section, heading: e.target.value })}
          disabled={saving || sectionSaving}
          placeholder="Section heading…"
          style={{
            flex: 1,
            minWidth: "10rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: color.text,
            background: "transparent",
            border: "none",
            borderBottom: `1px solid ${color.border}55`,
            outline: "none",
            padding: "0.1rem 0.25rem",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginLeft: "auto" }}>
          <button
            type="button"
            onClick={() => onMove("up")}
            disabled={index === 0 || saving || sectionSaving}
            title="Move up"
            style={{
              fontSize: "0.75rem",
              padding: "0.25rem 0.4rem",
              borderRadius: "0.375rem",
              border: `1px solid ${color.border}66`,
              background: "transparent",
              cursor: index === 0 ? "not-allowed" : "pointer",
              opacity: index === 0 ? 0.4 : 1,
            }}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove("down")}
            disabled={index === total - 1 || saving || sectionSaving}
            title="Move down"
            style={{
              fontSize: "0.75rem",
              padding: "0.25rem 0.4rem",
              borderRadius: "0.375rem",
              border: `1px solid ${color.border}66`,
              background: "transparent",
              cursor: index === total - 1 ? "not-allowed" : "pointer",
              opacity: index === total - 1 ? 0.4 : 1,
            }}
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand" : "Collapse"}
            style={{
              fontSize: "0.75rem",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.375rem",
              border: `1px solid ${color.border}66`,
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {collapsed ? "▾" : "▴"}
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={saving || sectionSaving}
            title="Remove section"
            style={{
              fontSize: "0.75rem",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.375rem",
              border: "1px solid #e8685066",
              color: "#c0392b",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Section body */}
      {!collapsed && (
        <div style={{ padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <textarea
            value={section.body}
            onChange={(e) => onChange({ ...section, body: e.target.value })}
            disabled={saving || sectionSaving}
            rows={8}
            placeholder="Section content…"
            style={{
              width: "100%",
              fontSize: "0.8125rem",
              fontFamily: "monospace",
              lineHeight: 1.6,
              border: `1px solid ${color.border}88`,
              borderRadius: "0.5rem",
              padding: "0.625rem 0.75rem",
              background: "rgba(255,255,255,0.7)",
              resize: "vertical",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={saving || sectionSaving}
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "0.35rem 0.85rem",
                borderRadius: "0.5rem",
                border: `1px solid ${color.border}`,
                background: "rgba(255,255,255,0.8)",
                color: color.text,
                cursor: "pointer",
                opacity: saving || sectionSaving ? 0.5 : 1,
              }}
            >
              {sectionSaving ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              onClick={onPublish}
              disabled={saving || sectionSaving}
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "0.35rem 0.85rem",
                borderRadius: "0.5rem",
                border: "none",
                background: color.border,
                color: "#fff",
                cursor: "pointer",
                opacity: saving || sectionSaving ? 0.5 : 1,
              }}
            >
              {sectionSaving ? "Publishing…" : "Publish"}
            </button>
            {sectionMsg && (
              <span style={{ fontSize: "0.75rem", color: "#16a34a" }}>{sectionMsg}</span>
            )}
            {sectionErr && (
              <span style={{ fontSize: "0.75rem", color: "#dc2626" }}>{sectionErr}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminPathwayLessonFormClient(props: AdminPathwayLessonFormClientProps) {
  const router = useRouter();
  const [resolvedPathwayLessonId, setResolvedPathwayLessonId] = useState<string | null>(
    "pathwayLessonId" in props ? props.pathwayLessonId : null,
  );
  const [resolveError, setResolveError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [pathwayId, setPathwayId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [status, setStatus] = useState<ContentStatus>(ContentStatus.DRAFT);
  const [acknowledgeBelowQualityBar, setAcknowledgeBelowQualityBar] = useState(false);
  const [sections, setSections] = useState<AdminSection[]>([]);
  const [sectionsFromCatalog, setSectionsFromCatalog] = useState(false);

  // Per-section save state: keyed by section id
  const [sectionSaving, setSectionSaving] = useState<Record<string, boolean>>({});
  const [sectionMsg, setSectionMsg] = useState<Record<string, string | null>>({});
  const [sectionErr, setSectionErr] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if ("pathwayLessonId" in props) return;
    const { pathwayId: pid, slug: sl, locale } = props.resolve;
    if (!pid || !sl) {
      setResolveError("pathwayId and slug are required (use query string on this page).");
      setLoading(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      setResolveError(null);
      try {
        const sp = new URLSearchParams({ pathwayId: pid, slug: sl });
        if (locale) sp.set("locale", locale);
        const res = await fetch(`/api/admin/pathway-lessons/_?${sp.toString()}`);
        const j = (await res.json()) as { error?: string; lesson?: { id: string } };
        if (cancelled) return;
        if (!res.ok || !j.lesson?.id) {
          setResolveError(j.error ?? "Could not resolve pathway lesson.");
          setLoading(false);
          return;
        }
        setResolvedPathwayLessonId(j.lesson.id);
      } catch {
        if (!cancelled) {
          setResolveError("Lookup failed.");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [props]);

  const pathwayLessonId = resolvedPathwayLessonId ?? "";
  const publicLessonHref = (() => {
    const pathway = pathwayId.trim() ? getExamPathwayById(pathwayId.trim()) : null;
    if (!pathway || !slug.trim()) return null;
    return marketingPathwayLessonDetailPath(pathway, slug.trim());
  })();

  const loadLesson = useCallback(async () => {
    if (!pathwayLessonId) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/pathway-lessons/${pathwayLessonId}`);
      const j = (await res.json()) as {
        lesson?: {
          pathwayId: string;
          title: string;
          slug: string;
          seoTitle: string;
          seoDescription: string;
          status: ContentStatus;
          sections?: unknown;
        };
        body?: string;
      };
      if (!res.ok || !j.lesson) {
        setErr("Could not load pathway lesson.");
        return;
      }
      const l = j.lesson;
      setPathwayId(l.pathwayId);
      setTitle(l.title);
      setSlug(l.slug);
      setSeoTitle(l.seoTitle);
      setSeoDescription(l.seoDescription);
      setStatus(l.status ?? ContentStatus.DRAFT);
      setSectionsFromCatalog(Boolean((l as Record<string, unknown>)._sectionsFromCatalog));

      // Load sections — may come from DB or catalog fallback (flagged by _sectionsFromCatalog)
      const rawSections = Array.isArray(l.sections) ? l.sections : [];
      if (rawSections.length > 0) {
        setSections(
          rawSections
            .filter((s): s is Record<string, unknown> => s !== null && typeof s === "object")
            .map((s) => ({
              id: typeof s.id === "string" ? s.id : crypto.randomUUID(),
              heading: typeof s.heading === "string" ? s.heading : (typeof (s as Record<string, unknown>).sectionTitle === "string" ? (s as Record<string, unknown>).sectionTitle as string : ""),
              kind: typeof s.kind === "string" ? s.kind : "intro",
              body: typeof s.body === "string" ? s.body : (typeof (s as Record<string, unknown>).content === "string" ? (s as Record<string, unknown>).content as string : ""),
            })),
        );
      } else if (j.body?.trim()) {
        // Fallback: single section from plain body
        setSections([
          {
            id: crypto.randomUUID(),
            heading: l.title,
            kind: "intro",
            body: j.body,
          },
        ]);
      } else {
        setSections([]);
      }
    } finally {
      setLoading(false);
    }
  }, [pathwayLessonId]);

  useEffect(() => {
    if (!pathwayLessonId) return;
    void loadLesson();
  }, [loadLesson, pathwayLessonId]);

  async function saveAll(nextStatus?: ContentStatus) {
    if (!pathwayLessonId) return;
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      const payload = {
        title,
        slug,
        seoTitle,
        seoDescription,
        sections,
        acknowledgeBelowQualityBar: acknowledgeBelowQualityBar || undefined,
      };
      const res =
        nextStatus === ContentStatus.PUBLISHED
          ? await fetch(`/api/admin/pathway-lessons/${pathwayLessonId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/pathway-lessons/${pathwayLessonId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...payload, status: nextStatus ?? status }),
            });
      const j = (await res.json()) as { error?: string; lesson?: { status: ContentStatus } };
      if (!res.ok) {
        setErr(j.error ?? "Save failed.");
        return;
      }
      setMsg(nextStatus === ContentStatus.PUBLISHED ? "Published." : "Saved as draft.");
      if (j.lesson?.status) setStatus(j.lesson.status);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function saveSectionDraft(sectionId: string, nextStatus?: ContentStatus) {
    if (!pathwayLessonId) return;
    setSectionSaving((p) => ({ ...p, [sectionId]: true }));
    setSectionMsg((p) => ({ ...p, [sectionId]: null }));
    setSectionErr((p) => ({ ...p, [sectionId]: null }));
    try {
      const payload = {
        title,
        slug,
        seoTitle,
        seoDescription,
        sections,
        acknowledgeBelowQualityBar: acknowledgeBelowQualityBar || undefined,
      };
      const res =
        nextStatus === ContentStatus.PUBLISHED
          ? await fetch(`/api/admin/pathway-lessons/${pathwayLessonId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/pathway-lessons/${pathwayLessonId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...payload, status: nextStatus ?? status }),
            });
      const j = (await res.json()) as { error?: string; lesson?: { status: ContentStatus } };
      if (!res.ok) {
        setSectionErr((p) => ({ ...p, [sectionId]: j.error ?? "Save failed." }));
        return;
      }
      setSectionMsg((p) => ({
        ...p,
        [sectionId]: nextStatus === ContentStatus.PUBLISHED ? "Published." : "Saved.",
      }));
      if (j.lesson?.status) setStatus(j.lesson.status);
      router.refresh();
      setTimeout(() => setSectionMsg((p) => ({ ...p, [sectionId]: null })), 3000);
    } finally {
      setSectionSaving((p) => ({ ...p, [sectionId]: false }));
    }
  }

  function addSection() {
    setSections((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        heading: "New Section",
        kind: "core",
        body: "",
      },
    ]);
  }

  function removeSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  function updateSection(id: string, updated: AdminSection) {
    setSections((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }

  function moveSection(id: string, dir: "up" | "down") {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap]!, next[idx]!];
      return next;
    });
  }

  if (resolveError) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">{resolveError}</p>
        <Link href="/admin/pathway-lessons" className="text-sm text-primary underline">
          Back to pathway lessons
        </Link>
      </div>
    );
  }

  if (loading || !pathwayLessonId) {
    return <p className="text-sm text-muted-foreground">Loading pathway lesson…</p>;
  }
  if (err && !title) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">{err}</p>
        <Link href="/admin/pathway-lessons" className="text-sm text-primary underline">
          Back to pathway lessons
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit pathway lesson</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Source of truth: <code className="rounded bg-muted px-1">pathway_lessons</code> · pathwayId{" "}
            <code className="rounded bg-muted px-1">{pathwayId}</code>
          </p>
        </div>
        <Link href="/admin/pathway-lessons" className="text-sm text-primary underline">
          All pathway lessons
        </Link>
      </div>

      <div className="rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-700/60 dark:bg-amber-950/30 dark:text-amber-100">
        Published saves update <code className="rounded bg-black/5 px-1 dark:bg-white/10">pathway_lessons</code> immediately and
        request live route revalidation.
      </div>

      {status === ContentStatus.PUBLISHED && publicLessonHref ? (
        <div className="rounded-lg border border-emerald-300/60 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 dark:border-emerald-800/50 dark:bg-emerald-950/25 dark:text-emerald-50">
          <span className="font-medium">Live page</span> —{" "}
          <Link href={publicLessonHref} className="text-primary underline" target="_blank" rel="noreferrer">
            View published lesson
          </Link>
        </div>
      ) : null}

      {err ? <p className="text-sm text-destructive">{err}</p> : null}
      {msg ? <p className="text-sm text-green-600 dark:text-green-400">{msg}</p> : null}

      {/* Metadata fields */}
      <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">Lesson metadata</h2>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Title</span>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Slug</span>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">SEO title</span>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Status</span>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-sm font-medium">SEO description / summary</span>
          <textarea
            className="min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={acknowledgeBelowQualityBar}
            onChange={(e) => setAcknowledgeBelowQualityBar(e.target.checked)}
          />
          Acknowledge below quality bar (publish only)
        </label>
      </div>

      {/* Per-section editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">
            Sections ({sections.length})
          </h2>
          <button
            type="button"
            onClick={addSection}
            disabled={saving}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted/60 disabled:opacity-50"
          >
            + Add section
          </button>
        </div>

        {sectionsFromCatalog && sections.length > 0 ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            ⚠️ Sections loaded from catalog JSON (DB is empty). Save now to persist these sections to the database.
          </p>
        ) : null}

        {sections.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No sections yet. Click &ldquo;Add section&rdquo; to begin.
          </p>
        ) : (
          <div className="space-y-3">
            {sections.map((section, idx) => (
              <SectionCard
                key={section.id}
                section={section}
                index={idx}
                total={sections.length}
                onChange={(updated) => updateSection(section.id, updated)}
                onRemove={() => removeSection(section.id)}
                onMove={(dir) => moveSection(section.id, dir)}
                saving={saving}
                onSaveDraft={() => void saveSectionDraft(section.id)}
                onPublish={() => void saveSectionDraft(section.id, ContentStatus.PUBLISHED)}
                sectionSaving={sectionSaving[section.id] ?? false}
                sectionMsg={sectionMsg[section.id] ?? null}
                sectionErr={sectionErr[section.id] ?? null}
              />
            ))}
          </div>
        )}
      </div>

      {/* Global save / publish */}
      <div className="flex flex-wrap gap-3 border-t border-border pt-4">
        <button
          type="button"
          disabled={saving}
          className="rounded-md bg-secondary px-4 py-2 text-sm font-medium disabled:opacity-50"
          onClick={() => void saveAll()}
        >
          {saving ? "Saving…" : "Save all as draft"}
        </button>
        <button
          type="button"
          disabled={saving}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          onClick={() => void saveAll(ContentStatus.PUBLISHED)}
        >
          {saving ? "Publishing…" : "Publish all"}
        </button>
        {publicLessonHref ? (
          <Link
            href={publicLessonHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-input px-4 py-2 text-sm font-medium"
          >
            View live page
          </Link>
        ) : null}
      </div>
    </div>
  );
}
