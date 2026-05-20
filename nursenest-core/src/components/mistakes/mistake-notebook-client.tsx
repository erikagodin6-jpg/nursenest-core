"use client";

import { useMemo, useState } from "react";
import { BookX, Filter, SortAsc } from "lucide-react";
import { MistakeCard } from "./mistake-card";
import { MistakePatternCard } from "./mistake-pattern-card";
import { analyzeMistakePatterns } from "@/lib/mistakes/mistake-patterns";
import {
  MISTAKE_REASONS,
  MISTAKE_REASON_LABELS,
  type MistakeEntry,
  type MistakeNotebookData,
  type MistakeReason,
} from "@/lib/mistakes/mistake-types";

// ── Types ──────────────────────────────────────────────────────────────────

type GroupBy = "all" | "topic" | "bodySystem" | "reason" | "recent";
type SortBy = "frequency" | "recent" | "untagged";

type Props = {
  initialData: MistakeNotebookData;
  drillHrefForTopic: (topic: string) => string;
};

// ── Filter chip helpers ────────────────────────────────────────────────────

const GROUP_TABS: { value: GroupBy; label: string }[] = [
  { value: "all", label: "All" },
  { value: "topic", label: "By Topic" },
  { value: "bodySystem", label: "By System" },
  { value: "reason", label: "By Reason" },
  { value: "recent", label: "Recent" },
];

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "frequency", label: "Most Frequent" },
  { value: "recent", label: "Most Recent" },
  { value: "untagged", label: "Untagged First" },
];

// ── Grouping logic ─────────────────────────────────────────────────────────

function groupEntries(
  entries: MistakeEntry[],
  groupBy: GroupBy,
  reasonFilter: MistakeReason | null,
): { label: string; items: MistakeEntry[] }[] {
  // Apply reason filter
  const filtered = reasonFilter
    ? entries.filter((e) => e.reason === reasonFilter)
    : entries;

  if (groupBy === "recent") {
    // Last 7 days
    const cutoff = Date.now() - 7 * 86_400_000;
    const recent = filtered.filter((e) => new Date(e.lastMissedAt).getTime() >= cutoff);
    if (recent.length === 0) {
      return [{ label: "Last 7 days", items: [] }];
    }
    return [{ label: `Last 7 days (${recent.length})`, items: recent }];
  }

  if (groupBy === "topic") {
    const topicMap = new Map<string, MistakeEntry[]>();
    const noTopic: MistakeEntry[] = [];
    for (const e of filtered) {
      if (!e.topic) { noTopic.push(e); continue; }
      const group = topicMap.get(e.topic) ?? [];
      group.push(e);
      topicMap.set(e.topic, group);
    }
    const groups = [...topicMap.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([label, items]) => ({ label, items }));
    if (noTopic.length > 0) groups.push({ label: "Other", items: noTopic });
    return groups;
  }

  if (groupBy === "bodySystem") {
    const bsMap = new Map<string, MistakeEntry[]>();
    const noBS: MistakeEntry[] = [];
    for (const e of filtered) {
      if (!e.bodySystem) { noBS.push(e); continue; }
      const label = (e.bodySystem as string).replace(/_/g, " ");
      const group = bsMap.get(label) ?? [];
      group.push(e);
      bsMap.set(label, group);
    }
    const groups = [...bsMap.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([label, items]) => ({ label, items }));
    if (noBS.length > 0) groups.push({ label: "Other", items: noBS });
    return groups;
  }

  if (groupBy === "reason") {
    const groups: { label: string; items: MistakeEntry[] }[] = [];
    const untagged = filtered.filter((e) => !e.reason);
    for (const reason of MISTAKE_REASONS) {
      const items = filtered.filter((e) => e.reason === reason);
      if (items.length > 0) {
        groups.push({ label: MISTAKE_REASON_LABELS[reason], items });
      }
    }
    if (untagged.length > 0) {
      groups.push({ label: `Untagged (${untagged.length})`, items: untagged });
    }
    return groups;
  }

  // "all" — single group, no label
  return [{ label: "", items: filtered }];
}

function sortEntries(entries: MistakeEntry[], sortBy: SortBy): MistakeEntry[] {
  return [...entries].sort((a, b) => {
    if (sortBy === "frequency") {
      return b.missCount !== a.missCount
        ? b.missCount - a.missCount
        : b.lastMissedAt.localeCompare(a.lastMissedAt);
    }
    if (sortBy === "recent") {
      return b.lastMissedAt.localeCompare(a.lastMissedAt);
    }
    if (sortBy === "untagged") {
      if (a.tagged === b.tagged) return b.missCount - a.missCount;
      return a.tagged ? 1 : -1;
    }
    return 0;
  });
}

// ── Summary stat pill ──────────────────────────────────────────────────────

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="flex flex-col items-center rounded-2xl px-5 py-4 text-center"
      style={{
        background: `color-mix(in srgb, ${color} 8%, var(--bg-card))`,
        border: `1px solid color-mix(in srgb, ${color} 18%, transparent)`,
      }}
    >
      <span className="text-2xl font-black" style={{ color }}>
        {value}
      </span>
      <span className="mt-0.5 text-xs font-medium" style={{ color: "var(--semantic-text-muted)" }}>
        {label}
      </span>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl px-8 py-16 text-center"
      style={{
        background: "var(--semantic-surface)",
        border: "1px solid var(--semantic-border-soft)",
      }}
    >
      <BookX
        className="h-12 w-12"
        style={{ color: "var(--semantic-text-muted)", opacity: 0.4 }}
        aria-hidden="true"
      />
      <h3 className="mt-4 text-base font-bold" style={{ color: "var(--semantic-text-primary)" }}>
        No mistakes yet
      </h3>
      <p className="mt-2 max-w-xs text-sm" style={{ color: "var(--semantic-text-muted)" }}>
        Complete a practice test or CAT session to populate your Mistake Notebook automatically.
        Missed questions will appear here for review and tagging.
      </p>
    </div>
  );
}

function FilterEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div
      className="rounded-2xl px-6 py-10 text-center"
      style={{ background: "var(--semantic-surface)", border: "1px solid var(--semantic-border-soft)" }}
    >
      <p className="text-sm font-medium" style={{ color: "var(--semantic-text-muted)" }}>
        No mistakes match this filter.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-3 text-xs font-semibold underline"
        style={{ color: "var(--semantic-brand)" }}
      >
        Clear filter
      </button>
    </div>
  );
}

// ── Main client component ──────────────────────────────────────────────────

export function MistakeNotebookClient({ initialData, drillHrefForTopic }: Props) {
  const [entries, setEntries] = useState<MistakeEntry[]>(initialData.entries);
  const [groupBy, setGroupBy] = useState<GroupBy>("all");
  const [sortBy, setSortBy] = useState<SortBy>("frequency");
  const [reasonFilter, setReasonFilter] = useState<MistakeReason | null>(null);

  // Recompute patterns when entries change (after tagging)
  const data: MistakeNotebookData = useMemo(
    () => analyzeMistakePatterns(entries),
    [entries],
  );

  const sortedEntries = useMemo(() => sortEntries(entries, sortBy), [entries, sortBy]);
  const groups = useMemo(
    () => groupEntries(sortedEntries, groupBy, reasonFilter),
    [sortedEntries, groupBy, reasonFilter],
  );

  const totalVisible = groups.reduce((s, g) => s + g.items.length, 0);
  const untaggedCount = entries.filter((e) => !e.tagged).length;

  function handleTagSaved(questionId: string, reason: MistakeReason | null, note: string) {
    setEntries((prev) =>
      prev.map((e) =>
        e.questionId === questionId
          ? { ...e, reason, note, tagged: reason !== null || note.trim() !== "" }
          : e,
      ),
    );
  }

  function handleFilterReason(reason: MistakeReason) {
    setReasonFilter((prev) => (prev === reason ? null : reason));
    setGroupBy("all");
  }

  if (data.totalMisses === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatPill label="Missed Questions" value={data.totalMisses} color="var(--semantic-brand)" />
        <StatPill label="Tagged" value={data.taggedCount} color="var(--semantic-success)" />
        <StatPill label="Untagged" value={untaggedCount} color="var(--semantic-warning)" />
        <StatPill label="Recurring (×3+)" value={entries.filter((e) => e.missCount >= 3).length} color="var(--semantic-danger)" />
      </div>

      {/* Pattern card */}
      <MistakePatternCard data={data} onFilterReason={handleFilterReason} />

      {/* Filter / group bar */}
      <div className="space-y-3">
        {/* Group tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--semantic-text-muted)" }} aria-hidden="true" />
          {GROUP_TABS.map((tab) => {
            const active = groupBy === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => { setGroupBy(tab.value); setReasonFilter(null); }}
                className="flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors"
                style={{
                  background: active ? "var(--semantic-brand)" : "var(--semantic-surface)",
                  color: active ? "#fff" : "var(--semantic-text-secondary)",
                  border: active ? "1.5px solid var(--semantic-brand)" : "1.5px solid var(--semantic-border-soft)",
                }}
                aria-pressed={active}
              >
                {tab.label}
              </button>
            );
          })}

          {/* Reason filter active indicator */}
          {reasonFilter && (
            <button
              type="button"
              onClick={() => setReasonFilter(null)}
              className="flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold"
              style={{
                background: "color-mix(in srgb, var(--semantic-danger) 10%, var(--bg-card))",
                color: "var(--semantic-danger)",
                border: "1.5px solid color-mix(in srgb, var(--semantic-danger) 22%, transparent)",
              }}
            >
              × {MISTAKE_REASON_LABELS[reasonFilter]}
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SortAsc className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--semantic-text-muted)" }} aria-hidden="true" />
          {SORT_OPTIONS.map((opt) => {
            const active = sortBy === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSortBy(opt.value)}
                className="rounded-lg px-2.5 py-1 text-xs font-medium transition-colors"
                style={{
                  background: active ? "color-mix(in srgb, var(--semantic-brand) 10%, var(--bg-card))" : "transparent",
                  color: active ? "var(--semantic-brand)" : "var(--semantic-text-muted)",
                  border: active ? "1px solid color-mix(in srgb, var(--semantic-brand) 22%, transparent)" : "1px solid transparent",
                }}
                aria-pressed={active}
              >
                {opt.label}
              </button>
            );
          })}
          <span className="ml-auto text-xs" style={{ color: "var(--semantic-text-muted)" }}>
            {totalVisible} question{totalVisible !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Grouped card lists */}
      {groups.length === 0 || totalVisible === 0 ? (
        <FilterEmptyState onClear={() => { setReasonFilter(null); setGroupBy("all"); }} />
      ) : (
        <div className="space-y-8">
          {groups.map((group, gi) => (
            <section key={gi}>
              {group.label ? (
                <h2
                  className="mb-3 text-sm font-bold uppercase tracking-wide"
                  style={{ color: "var(--semantic-text-muted)" }}
                >
                  {group.label}
                </h2>
              ) : null}

              {group.items.length === 0 ? (
                <FilterEmptyState onClear={() => { setReasonFilter(null); setGroupBy("all"); }} />
              ) : (
                <div className="space-y-3">
                  {group.items.map((entry) => (
                    <MistakeCard
                      key={entry.questionId}
                      entry={entry}
                      drillHref={entry.topic ? drillHrefForTopic(entry.topic) : null}
                      onTagSaved={handleTagSaved}
                    />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
