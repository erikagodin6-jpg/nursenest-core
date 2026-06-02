"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, BookMarked, BookOpen, ClipboardList, Layers, Search, Sparkles, Target } from "lucide-react";
import type { StudyNextRecommendation } from "@/lib/learner/study-next-types";
import type { CommandCenterApiPayload } from "@/lib/learner/command-center-api-types";
import { isCommandCenterReviewOk } from "@/lib/learner/command-center-api-types";

type Payload = CommandCenterApiPayload;

type Hit =
  | { kind: "note"; id: string; title: string; sub: string; href: string; meta: string }
  | { kind: "weak"; id: string; title: string; sub: string; href: string; meta: string }
  | { kind: "mistake"; id: string; title: string; sub: string; href: string; meta: string }
  | { kind: "lesson"; id: string; title: string; sub: string; href: string; meta: string };

function buildHits(p: Payload): Hit[] {
  const out: Hit[] = [];
  for (const n of p.notes) {
    out.push({
      kind: "note",
      id: `n-${n.id}`,
      title: n.title?.trim() || n.snippet.slice(0, 72) || "Note",
      sub: n.snippet,
      href: n.href,
      meta: n.kind === "bookmark" ? "Bookmark" : n.kind === "rationale" ? "Saved rationale" : n.scopeLabel,
    });
  }
  for (const w of p.weakTopics) {
    out.push({
      kind: "weak",
      id: `w-${w.topic}`,
      title: w.topic,
      sub: `${w.missRate}% miss rate in recent practice`,
      href: w.href,
      meta: "Weak topic",
    });
  }
  for (const m of p.mistakes) {
    out.push({
      kind: "mistake",
      id: `m-${m.id}`,
      title: m.topic?.trim() || "Missed question",
      sub: m.stemSnippet || "Review in question bank",
      href: m.href,
      meta: "Mistake",
    });
  }
  for (let i = 0; i < p.plannedLessons.length; i++) {
    const l = p.plannedLessons[i]!;
    out.push({
      kind: "lesson",
      id: `l-${i}-${l.href}`,
      title: l.title,
      sub: "From your study plan",
      href: l.href,
      meta: "Lesson",
    });
  }
  return out;
}

function matches(q: string, ...parts: (string | null | undefined)[]): boolean {
  if (!q.trim()) return true;
  const s = q.toLowerCase();
  return parts.some((p) => (p ?? "").toLowerCase().includes(s));
}

export function LearnerCommandCenterClient() {
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [payload, setPayload] = useState<Payload | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setPhase("loading");
    try {
      const res = await fetch("/api/learner/command-center");
      const data = (await res.json()) as (Payload & { error?: string }) | { error?: string };
      if (!res.ok) throw new Error("error" in data && data.error ? data.error : "Failed to load");
      if (!("review" in data) || data.review === undefined) throw new Error("Invalid command center payload");
      setPayload(data as Payload);
      setPhase("ready");
    } catch {
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const hits = useMemo(() => {
    if (!payload) return [];
    const all = buildHits(payload);
    if (!query.trim()) return [];
    return all.filter((h) => matches(query, h.title, h.sub, h.meta));
  }, [payload, query]);

  const dueUrgent =
    payload && isCommandCenterReviewOk(payload.review)
      ? payload.review.overdue + payload.review.dueToday + payload.review.highRisk
      : null;

  if (phase === "loading" || !payload) {
    return (
      <div
        className="mx-auto w-full max-w-3xl space-y-6 py-8"
        aria-busy="true"
        aria-label="Loading study hub"
      >
        <div className="space-y-3 rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8">
          <div className="h-4 w-40 rounded-md bg-[var(--semantic-border-soft)] nn-skeleton-fade nn-skeleton-soft-pulse motion-reduce:animate-none" />
          <div className="h-10 w-full max-w-md rounded-lg bg-[var(--semantic-border-soft)] nn-skeleton-fade nn-skeleton-soft-pulse motion-reduce:animate-none" />
          <div className="h-4 w-full rounded-md bg-[var(--semantic-border-soft)]/80 nn-skeleton-fade nn-skeleton-soft-pulse motion-reduce:animate-none" />
          <div className="h-4 w-[85%] max-w-lg rounded-md bg-[var(--semantic-border-soft)]/70 nn-skeleton-fade nn-skeleton-soft-pulse motion-reduce:animate-none" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-36 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 nn-skeleton-fade nn-skeleton-soft-pulse motion-reduce:animate-none" />
          <div className="h-36 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 nn-skeleton-fade nn-skeleton-soft-pulse motion-reduce:animate-none" />
        </div>
        <p className="text-center text-sm font-medium text-[var(--semantic-text-muted)]">Preparing your study hub…</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div
        className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-8 text-center"
        role="alert"
      >
        <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">We could not load your hub.</p>
        <button
          type="button"
          className="mt-4 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2 text-sm font-semibold text-[var(--semantic-brand)]"
          onClick={() => void load()}
        >
          Try again
        </button>
      </div>
    );
  }

  const sn = payload.studyNext;
  const segmentIssues = payload.segmentLoadFailures;
  const hasSegmentIssues = Boolean(segmentIssues && Object.keys(segmentIssues).length > 0);

  return (
    <div className="space-y-8">
      {hasSegmentIssues ? (
        <div
          role="status"
          className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-primary)]"
        >
          <p className="font-semibold">Part of your study hub did not load.</p>
          <p className="mt-1 text-[var(--semantic-text-secondary)]">
            Empty sections below may mean a temporary load error — not that you have no activity. Retry, or open Notes,
            Review, and Questions from the main nav.
          </p>
          <button
            type="button"
            className="mt-3 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-1.5 text-xs font-bold text-[var(--semantic-brand)]"
            onClick={() => void load()}
          >
            Retry
          </button>
        </div>
      ) : null}
      {/* Hero + search */}
      <section
        className="relative overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] px-5 py-8 sm:px-8"
        style={{
          background:
            "linear-gradient(145deg, color-mix(in srgb, var(--semantic-panel-cool) 55%, var(--semantic-surface)) 0%, color-mix(in srgb, var(--semantic-brand) 6%, var(--semantic-surface)) 100%)",
        }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-2)_12%,transparent)] blur-2xl" aria-hidden />
        <div className="relative max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--semantic-text-muted)]">Study hub</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">
            Your command center
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            One calm place to search notes, bookmarks, weak topics, mistakes, and planned lessons — then jump back into
            practice.
          </p>
        </div>
        <div className="relative mt-6 max-w-xl">
          <label htmlFor="command-center-search" className="sr-only">
            Search your study materials
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 shadow-sm">
            <Search className="h-5 w-5 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />
            <input
              id="command-center-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes, bookmarks, topics, mistakes…"
              className="min-w-0 flex-1 bg-transparent text-sm text-[var(--semantic-text-primary)] outline-none placeholder:text-[var(--semantic-text-muted)]"
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                className="shrink-0 text-xs font-semibold text-[var(--semantic-brand)]"
                onClick={() => setQuery("")}
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Search results */}
      {query.trim() ? (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">Results</h2>
          {hits.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-6 py-10 text-center text-sm text-[var(--semantic-text-secondary)]">
              No matches for &ldquo;{query}&rdquo;. Try a shorter phrase or browse the groups below.
            </div>
          ) : (
            <ul className="space-y-2">
              {hits.map((h) => (
                <li key={h.id}>
                  <Link
                    href={h.href}
                    className="flex flex-col gap-1 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 transition-colors hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,var(--semantic-surface))] sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--semantic-text-primary)]">{h.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-[var(--semantic-text-secondary)]">{h.sub}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-3)_14%,var(--semantic-surface))] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                      {h.meta}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {/* Quick actions */}
      {!query.trim() ? (
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">Quick actions</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Resume"
              body={sn?.continueWhere?.title ?? "Pick up your pathway where you left off."}
              href={sn?.continueWhere?.href ?? "/app/lessons"}
              tone="brand"
            />
            <QuickActionCard
              icon={<Target className="h-5 w-5" />}
              title="Weak topic drill"
              body={payload.weakTopics[0]?.topic ? `Drill ${payload.weakTopics[0].topic}` : "Build accuracy on your weakest topics."}
              href={payload.weakTopics[0]?.href ?? "/app/questions?preset=weak"}
              tone="warning"
            />
            <QuickActionCard
              icon={<Layers className="h-5 w-5" />}
              title="Due reviews"
              body={
                dueUrgent !== null && dueUrgent > 0
                  ? `${dueUrgent} high-priority item${dueUrgent === 1 ? "" : "s"} in your queue.`
                  : payload.review.message
              }
              href={payload.review.href}
              tone="info"
            />
            <QuickActionCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Study plan"
              body="Adjust pacing, exam date, and weekly goals."
              href={sn?.plannerHref ?? "/app/study-plan"}
              tone="success"
            />
          </div>
        </section>
      ) : null}

      {/* Grouped browse (no search) */}
      {!query.trim() ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <BrowseGroup
            icon={<BookMarked className="h-4 w-4" />}
            title="Notes & highlights"
            footerHref="/app/account/notes"
            footerLabel="Open notes library"
          >
            {payload.notes.length ? (
              payload.notes.slice(0, 6).map((n) => (
                <BrowseRow
                  key={n.id}
                  href={n.href}
                  title={n.title?.trim() || n.snippet.slice(0, 56)}
                  meta={n.kind === "bookmark" ? "Bookmark" : n.scopeLabel}
                  sub={n.snippet}
                />
              ))
            ) : (
              <EmptyBrowse message="No notes yet. Open a lesson or question and save a takeaway." />
            )}
          </BrowseGroup>

          <BrowseGroup
            icon={<Target className="h-4 w-4" />}
            title="Weak topics"
            slug="weak"
            footerHref="/app/account/focus-areas"
            footerLabel="Weak topics"
          >
            {payload.weakTopics.length ? (
              payload.weakTopics.slice(0, 6).map((w) => (
                <BrowseRow key={w.topic} href={w.href} title={w.topic} meta={`${w.missRate}% miss`} sub="Topic drill in question bank" />
              ))
            ) : (
              <EmptyBrowse message="No weak-topic signal yet. Answer a few more questions to personalize this list." />
            )}
          </BrowseGroup>

          <BrowseGroup
            icon={<ClipboardList className="h-4 w-4" />}
            title="Recent mistakes"
            slug="mistakes"
            footerHref="/app/account/mistakes"
            footerLabel="Mistake notebook"
          >
            {payload.mistakes.length ? (
              payload.mistakes.slice(0, 6).map((m) => (
                <BrowseRow key={m.id} href={m.href} title={m.topic ?? "Question"} meta="Missed" sub={m.stemSnippet} />
              ))
            ) : (
              <EmptyBrowse message="No mistakes logged — complete a practice set to populate your notebook." />
            )}
          </BrowseGroup>

          <BrowseGroup
            icon={<BookOpen className="h-4 w-4" />}
            title="Planned lessons"
            slug="lessons"
            footerHref="/app/study-plan"
            footerLabel="Study plan"
          >
            {payload.plannedLessons.length ? (
              payload.plannedLessons.map((l, i) => (
                <BrowseRow key={`${l.href}-${i}`} href={l.href} title={l.title} meta="Plan" sub="Continue your pathway" />
              ))
            ) : (
              <EmptyBrowse message="No lesson picks queued — your study plan will suggest the next step soon." />
            )}
          </BrowseGroup>
        </div>
      ) : null}

      {/* Study next strip */}
      {!query.trim() && sn ? (
        <section
          className="rounded-3xl border border-[var(--semantic-border-soft)] p-5 sm:p-6"
          style={{ background: "color-mix(in srgb, var(--semantic-panel-warm) 10%, var(--semantic-surface))" }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">Suggested next</p>
              <p className="mt-1 text-lg font-bold text-[var(--semantic-text-primary)]">{sn.primary.title}</p>
              <p className="mt-1 max-w-prose text-sm text-[var(--semantic-text-secondary)]">{sn.primary.reasonShort}</p>
            </div>
            <Link
              href={sn.primary.href}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-[var(--role-cta-foreground)]"
              style={{ background: "var(--role-cta)" }}
            >
              Continue <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          {sn.secondary.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2 border-t border-[var(--semantic-border-soft)] pt-4">
              {sn.secondary.map((a: StudyNextRecommendation) => (
                <li key={a.href}>
                  <Link
                    href={a.href}
                    className="inline-flex rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  body,
  href,
  tone,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  href: string;
  tone: "brand" | "warning" | "info" | "success";
}) {
  const ring: Record<typeof tone, string> = {
    brand: "color-mix(in srgb, var(--semantic-brand) 22%, var(--semantic-border-soft))",
    warning: "color-mix(in srgb, var(--semantic-warning) 24%, var(--semantic-border-soft))",
    info: "color-mix(in srgb, var(--semantic-info) 22%, var(--semantic-border-soft))",
    success: "color-mix(in srgb, var(--semantic-success) 22%, var(--semantic-border-soft))",
  };
  const wash: Record<typeof tone, string> = {
    brand: "color-mix(in srgb, var(--semantic-brand) 7%, var(--semantic-surface))",
    warning: "color-mix(in srgb, var(--semantic-warning) 8%, var(--semantic-surface))",
    info: "color-mix(in srgb, var(--semantic-info) 7%, var(--semantic-surface))",
    success: "color-mix(in srgb, var(--semantic-success) 7%, var(--semantic-surface))",
  };
  const iconColor =
    tone === "brand"
      ? "var(--semantic-brand)"
      : tone === "warning"
        ? "var(--semantic-warning-contrast)"
        : tone === "info"
          ? "var(--semantic-info)"
          : "var(--semantic-success)";
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border p-4 transition-shadow hover:shadow-md"
      style={{ borderColor: ring[tone], background: wash[tone] }}
    >
      <span className="opacity-90" style={{ color: iconColor }}>
        {icon}
      </span>
      <p className="mt-3 text-sm font-bold text-[var(--semantic-text-primary)]">{title}</p>
      <p className="mt-1 flex-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{body}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--semantic-brand)]">
        Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

function EmptyBrowse({ message }: { message: string }) {
  return <p className="text-sm leading-relaxed text-[var(--semantic-text-muted)]">{message}</p>;
}

function BrowseGroup({
  icon,
  title,
  slug = "notes",
  children,
  footerHref,
  footerLabel,
}: {
  icon: ReactNode;
  title: string;
  slug?: string;
  children: ReactNode;
  footerHref: string;
  footerLabel: string;
}) {
  return (
    <section
      className="flex flex-col rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm"
      aria-labelledby={`cc-${slug}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[var(--semantic-text-muted)]">{icon}</span>
        <h2 id={`cc-${slug}`} className="text-sm font-bold text-[var(--semantic-text-primary)]">
          {title}
        </h2>
      </div>
      <div className="min-h-[120px] flex-1 space-y-2">{children}</div>
      <Link
        href={footerHref}
        className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[var(--semantic-brand)]"
      >
        {footerLabel}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </section>
  );
}

function BrowseRow({
  href,
  title,
  meta,
  sub,
}: {
  href: string;
  title: string;
  meta: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-[var(--semantic-border-soft)] hover:bg-[var(--semantic-panel-muted)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-sm font-semibold text-[var(--semantic-text-primary)]">{title}</p>
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{meta}</span>
      </div>
      {sub ? <p className="mt-0.5 line-clamp-2 text-xs text-[var(--semantic-text-secondary)]">{sub}</p> : null}
    </Link>
  );
}
