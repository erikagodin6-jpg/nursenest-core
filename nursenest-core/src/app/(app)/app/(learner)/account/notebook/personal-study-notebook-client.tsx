"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Download, Mail, Printer, Search, Star } from "lucide-react";
import type { NoteRow } from "@/lib/learner/notes-index-types";
import {
  NOTEBOOK_CATEGORIES,
  NOTEBOOK_CATEGORY_LABELS,
  type NotebookCategory,
} from "@/lib/learner/personal-study-notebook";
import type { PersonalStudyNotebookPayload } from "./actions";

type DateFilter = "all" | "today" | "week" | "month";

export function PersonalStudyNotebookClient({ payload }: { payload: PersonalStudyNotebookPayload }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | NotebookCategory>("all");
  const [system, setSystem] = useState("all");
  const [topic, setTopic] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [tag, setTag] = useState("all");

  const filtered = useMemo(() => {
    return payload.notes.filter((note) => {
      const haystack = [
        note.title,
        note.bodySnippet,
        note.topic,
        note.scopeLabel,
        note.notebookCategoryLabel,
        note.notebookSourceLabel,
        note.notebookSystem,
        ...(note.notebookTags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
      const matchesCategory = category === "all" || note.notebookCategory === category;
      const matchesSystem = system === "all" || note.notebookSystem === system;
      const matchesTopic = topic === "all" || note.topic === topic;
      const matchesTag = tag === "all" || (note.notebookTags ?? []).includes(tag);
      const matchesFavorite = !favoritesOnly || note.isFavorite;
      const matchesDate = matchesDateFilter(note.updatedAt, dateFilter);
      return matchesQuery && matchesCategory && matchesSystem && matchesTopic && matchesTag && matchesFavorite && matchesDate;
    });
  }, [category, dateFilter, favoritesOnly, payload.notes, query, system, tag, topic]);

  const emailHref = useMemo(() => {
    const summary = filtered
      .slice(0, 20)
      .map((note) => `${note.notebookCategoryLabel ?? "Note"}: ${note.title ?? note.bodySnippet}`)
      .join("\n");
    return `mailto:?subject=${encodeURIComponent("My NurseNest Study Notebook")}&body=${encodeURIComponent(summary || "My NurseNest Study Notebook")}`;
  }, [filtered]);

  function printNotebook() {
    window.print();
  }

  return (
    <section className="space-y-4" data-nn-study-notebook="">
      <div
        className="rounded-2xl p-4"
        style={{
          background: "var(--semantic-surface)",
          border: "1px solid var(--semantic-border-soft)",
          boxShadow: "var(--semantic-shadow-soft)",
        }}
      >
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.4fr)_repeat(5,minmax(130px,1fr))_auto]">
          <label className="relative min-w-0">
            <span className="sr-only">Search notebook</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--semantic-text-muted)" }} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notebook"
              className="h-11 w-full rounded-xl border bg-transparent pl-9 pr-3 text-sm outline-none focus:ring-2"
              style={{
                borderColor: "var(--semantic-border-soft)",
                color: "var(--semantic-text-primary)",
                background: "var(--surface-soft-a, var(--semantic-surface))",
              }}
            />
          </label>
          <NotebookSelect label="Category" value={category} onChange={(value) => setCategory(value as "all" | NotebookCategory)}>
            <option value="all">All categories</option>
            {NOTEBOOK_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {NOTEBOOK_CATEGORY_LABELS[item]} ({payload.categoryCounts[item] ?? 0})
              </option>
            ))}
          </NotebookSelect>
          <NotebookSelect label="System" value={system} onChange={setSystem}>
            <option value="all">All systems</option>
            {payload.systems.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </NotebookSelect>
          <NotebookSelect label="Topic" value={topic} onChange={setTopic}>
            <option value="all">All topics</option>
            {payload.topics.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </NotebookSelect>
          <NotebookSelect label="Date" value={dateFilter} onChange={(value) => setDateFilter(value as DateFilter)}>
            <option value="all">Any date</option>
            <option value="today">Today</option>
            <option value="week">Past week</option>
            <option value="month">Past month</option>
          </NotebookSelect>
          <NotebookSelect label="Tag" value={tag} onChange={setTag}>
            <option value="all">All tags</option>
            {payload.tags.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </NotebookSelect>
          <button
            type="button"
            aria-pressed={favoritesOnly}
            onClick={() => setFavoritesOnly((value) => !value)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition hover:opacity-85 focus-visible:outline-none focus-visible:ring-2"
            style={{
              background: favoritesOnly ? "color-mix(in srgb, var(--semantic-warning) 18%, var(--semantic-surface))" : "var(--surface-soft-a, var(--semantic-surface))",
              border: "1px solid var(--semantic-border-soft)",
              color: favoritesOnly ? "var(--semantic-warning)" : "var(--semantic-text-secondary)",
            }}
          >
            <Star className="h-4 w-4" aria-hidden />
            Favorites
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium" style={{ color: "var(--semantic-text-muted)" }}>
            Showing {filtered.length.toLocaleString()} of {payload.total.toLocaleString()} saved study entries
          </p>
          <div className="flex flex-wrap gap-2">
            <ExportButton onClick={printNotebook} icon={<Printer className="h-4 w-4" aria-hidden />} label="Print" />
            <ExportButton onClick={printNotebook} icon={<Download className="h-4 w-4" aria-hidden />} label="PDF" />
            <a
              href={emailHref}
              className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-semibold transition hover:opacity-85 focus-visible:outline-none focus-visible:ring-2"
              style={{
                background: "color-mix(in srgb, var(--semantic-info) 10%, var(--semantic-surface))",
                border: "1px solid color-mix(in srgb, var(--semantic-info) 25%, var(--semantic-border-soft))",
                color: "var(--semantic-info)",
              }}
            >
              <Mail className="h-4 w-4" aria-hidden />
              Email
            </a>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map((note) => (
            <NotebookEntryCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "var(--surface-soft-a, var(--semantic-surface))",
            border: "1px solid var(--semantic-border-soft)",
          }}
        >
          <h2 className="text-lg font-extrabold" style={{ color: "var(--semantic-text-primary)" }}>
            No notebook entries match these filters
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
            Save a rationale, clinical pearl, memory hook, ECG interpretation, lab note, or lesson note, then refine this view with search and filters.
          </p>
        </div>
      )}
    </section>
  );
}

function NotebookEntryCard({ note }: { note: NoteRow }) {
  return (
    <article
      className="group flex min-h-[180px] flex-col gap-3 rounded-2xl p-4 transition hover:-translate-y-0.5"
      style={{
        background: "var(--semantic-surface)",
        border: "1px solid var(--semantic-border-soft)",
        boxShadow: "var(--semantic-shadow-soft)",
      }}
      data-nn-notebook-entry={note.notebookCategory ?? "notes"}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))", color: "var(--semantic-brand)" }}>
              {note.notebookCategoryLabel ?? "Notes"}
            </span>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "var(--surface-soft-a, var(--semantic-surface))", color: "var(--semantic-text-muted)" }}>
              {note.notebookSourceLabel ?? note.scopeLabel}
            </span>
            {note.isFavorite ? (
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "color-mix(in srgb, var(--semantic-warning) 12%, var(--semantic-surface))", color: "var(--semantic-warning)" }}>
                Favorite
              </span>
            ) : null}
          </div>
          <h2 className="line-clamp-2 text-base font-extrabold leading-snug" style={{ color: "var(--semantic-text-primary)" }}>
            {note.title ?? note.bodySnippet}
          </h2>
        </div>
        <time className="shrink-0 text-[11px] font-medium" dateTime={note.updatedAt} style={{ color: "var(--semantic-text-muted)" }}>
          {formatNotebookDate(note.updatedAt)}
        </time>
      </div>
      <p className="line-clamp-4 text-sm leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
        {note.bodySnippet}
      </p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {note.notebookSystem ? <TagPill label={note.notebookSystem} /> : null}
          {note.topic ? <TagPill label={note.topic} /> : null}
          {(note.notebookTags ?? []).slice(0, 3).map((item) => (
            <TagPill key={item} label={`#${item}`} />
          ))}
        </div>
        <Link href={note.href} className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2" style={{ color: "var(--semantic-brand)" }}>
          View source
        </Link>
      </div>
    </article>
  );
}

function NotebookSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border bg-transparent px-3 text-sm font-medium outline-none focus:ring-2"
        style={{
          borderColor: "var(--semantic-border-soft)",
          background: "var(--surface-soft-a, var(--semantic-surface))",
          color: "var(--semantic-text-primary)",
        }}
      >
        {children}
      </select>
    </label>
  );
}

function ExportButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-semibold transition hover:opacity-85 focus-visible:outline-none focus-visible:ring-2"
      style={{
        background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
        border: "1px solid color-mix(in srgb, var(--semantic-brand) 25%, var(--semantic-border-soft))",
        color: "var(--semantic-brand)",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function TagPill({ label }: { label: string }) {
  return (
    <span className="max-w-[180px] truncate rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: "var(--surface-soft-a, var(--semantic-surface))", color: "var(--semantic-text-muted)" }}>
      {label}
    </span>
  );
}

function matchesDateFilter(updatedAt: string, filter: DateFilter): boolean {
  if (filter === "all") return true;
  const updated = new Date(updatedAt).getTime();
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  if (filter === "today") return now - updated <= oneDay;
  if (filter === "week") return now - updated <= 7 * oneDay;
  return now - updated <= 30 * oneDay;
}

function formatNotebookDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
