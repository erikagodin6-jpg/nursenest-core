"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatTitleCase } from "@/lib/format/text-case";
import {
  flashcardBodySystemsUiOutcomeFromParsed,
  parseFlashcardCustomSessionResponse,
} from "@/lib/flashcards/flashcard-custom-session-response";
import type { BuilderCategoryOption } from "@/lib/flashcards/flashcard-builder-taxonomy";
import { learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";
import {
  getStudyItemIdsMatchingFilters,
  type StudyQuickFilters,
} from "@/lib/flashcards/study-session-persistence";
import { LearnerStudyQuickLinksCard } from "@/components/student/learner-study-quick-links-card";
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";
import { ContentEmptyState } from "@/components/ui/content-empty-state";
import {
  buildAppFlashcardsCustomStudyHref,
  buildAppFlashcardsHubHref,
  parseHubMode,
  parseHubSystemsFromSearchParams,
  type FlashcardsHubMode,
} from "@/lib/flashcards/flashcards-hub-url";

function normalizeSystemToken(raw: string): string {
  return raw.trim().toLowerCase().replace(/-/g, "_");
}

function mergeHubRows(
  pathwayId: string,
  optionsFromApi: BuilderCategoryOption[],
): BuilderCategoryOption[] {
  const byId = new Map(optionsFromApi.map((o) => [o.id, o]));
  const cfg = learningConfigForPathwayId(pathwayId);
  const ordered: BuilderCategoryOption[] = [];
  for (const c of cfg.categories) {
    const hit = byId.get(c.id);
    ordered.push({
      id: c.id,
      title: c.title,
      description: c.description ?? hit?.description,
      count: hit?.count ?? 0,
    });
    byId.delete(c.id);
  }
  const rest = [...byId.values()].sort((a, b) => a.title.localeCompare(b.title));
  return [...ordered, ...rest];
}

export type FlashcardsHubServerPayload = {
  categoryOptions: BuilderCategoryOption[];
  matchingTotal: number;
};

export function FlashcardsHubClient({
  scopedPathwayId,
  pathwayDisplayName,
  pathwayBootstrapSource = "primary",
  catHref,
  initialHub,
}: {
  scopedPathwayId: string;
  pathwayDisplayName: string;
  pathwayBootstrapSource?: "primary" | "secondary";
  catHref?: string;
  initialHub: FlashcardsHubServerPayload | null;
}) {
  const { t } = useMarketingI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rows, setRows] = useState<BuilderCategoryOption[]>(() =>
    initialHub?.categoryOptions?.length
      ? mergeHubRows(scopedPathwayId, initialHub.categoryOptions)
      : [],
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [weakTotal, setWeakTotal] = useState<number | null>(null);
  const [starredPathwayTotal, setStarredPathwayTotal] = useState<number | null>(null);

  const mode = useMemo(() => parseHubMode(searchParams), [searchParams]);
  const selectedSystems = useMemo(() => {
    const parsed = parseHubSystemsFromSearchParams(searchParams).map(normalizeSystemToken);
    return [...new Set(parsed)];
  }, [searchParams]);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  const refreshInventory = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/flashcards/custom-session?pathwayId=${encodeURIComponent(scopedPathwayId)}&includeCards=0`,
        { credentials: "include" },
      );
      const json = (await res.json()) as unknown;
      const parsed = parseFlashcardCustomSessionResponse(res.ok, json);
      if (!parsed.ok) {
        setLoadError(parsed.message);
        return;
      }
      setLoadError(null);
      setRows(mergeHubRows(scopedPathwayId, parsed.categoryOptions));
    } catch {
      setLoadError("Could not load flashcards.");
    }
  }, [scopedPathwayId]);

  useEffect(() => {
    if (!initialHub?.categoryOptions?.length) void refreshInventory();
  }, [initialHub?.categoryOptions?.length, refreshInventory]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resW = await fetch(
          `/api/flashcards/custom-session?pathwayId=${encodeURIComponent(scopedPathwayId)}&includeCards=0&weakOnly=1`,
          { credentials: "include" },
        );
        const jW = await resW.json();
        const pW = parseFlashcardCustomSessionResponse(resW.ok, jW);
        if (!cancelled && pW.ok && pW.summary) setWeakTotal(pW.summary.matchingCards);
      } catch {
        if (!cancelled) setWeakTotal(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [scopedPathwayId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const starredIds = getStudyItemIdsMatchingFilters({ starredOnly: true } satisfies StudyQuickFilters, 500);
      if (starredIds.length === 0) {
        if (!cancelled) setStarredPathwayTotal(0);
        return;
      }
      try {
        const qs = new URLSearchParams();
        qs.set("pathwayId", scopedPathwayId);
        qs.set("includeCards", "0");
        qs.set("starredOnly", "1");
        qs.set("stateIds", starredIds.join(","));
        const res = await fetch(`/api/flashcards/custom-session?${qs}`, { credentials: "include" });
        const json = await res.json();
        const parsed = parseFlashcardCustomSessionResponse(res.ok, json);
        if (!cancelled && parsed.ok && parsed.summary) setStarredPathwayTotal(parsed.summary.matchingCards);
      } catch {
        if (!cancelled) setStarredPathwayTotal(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [scopedPathwayId]);

  const pushHubUrl = useCallback(
    (next: { systems?: string[]; mode?: FlashcardsHubMode; q?: string | null }) => {
      const href = buildAppFlashcardsHubHref({
        pathwayId: scopedPathwayId,
        systems: next.systems,
        mode: next.mode ?? mode,
        q: next.q ?? (q || null),
      });
      router.replace(href, { scroll: false });
    },
    [router, scopedPathwayId, mode, q],
  );

  const toggleSystem = (id: string) => {
    const nid = normalizeSystemToken(id);
    if (selectedSystems.length === 0) {
      pushHubUrl({ systems: [nid], mode });
      return;
    }
    const set = new Set(selectedSystems);
    if (set.has(nid)) set.delete(nid);
    else set.add(nid);
    const next = [...set];
    pushHubUrl({ systems: next.length ? next : undefined, mode });
  };

  const selectOnlySystem = (id: string) => {
    pushHubUrl({ systems: [normalizeSystemToken(id)], mode });
  };

  const clearSystems = () => pushHubUrl({ systems: undefined, mode });

  const setMode = (m: FlashcardsHubMode) => {
    pushHubUrl({ systems: selectedSystems.length ? selectedSystems : undefined, mode: m });
  };

  const filteredRows = useMemo(() => {
    if (!q) return rows;
    return rows.filter((r) => r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
  }, [rows, q]);

  const deckMatchingEstimate = useMemo(() => {
    if (selectedSystems.length === 0) return rows.reduce((s, r) => s + r.count, 0);
    return rows.filter((r) => selectedSystems.includes(r.id)).reduce((s, r) => s + r.count, 0);
  }, [rows, selectedSystems]);

  const starredIdsForStudy = useMemo(
    () => getStudyItemIdsMatchingFilters({ starredOnly: true } satisfies StudyQuickFilters, 500),
    [],
  );

  const studyHref = useMemo(() => {
    if (mode === "starred" && (starredPathwayTotal ?? 0) === 0) return null;
    if (deckMatchingEstimate === 0) return null;
    if (mode === "weak" && (weakTotal ?? 0) === 0) return null;
    return buildAppFlashcardsCustomStudyHref({
      pathwayId: scopedPathwayId,
      systems: selectedSystems.length ? selectedSystems : undefined,
      mode,
      starredStateIds: mode === "starred" ? starredIdsForStudy : undefined,
      cardLimit: 50,
      shuffle: true,
    });
  }, [scopedPathwayId, selectedSystems, mode, starredIdsForStudy, deckMatchingEstimate, starredPathwayTotal, weakTotal]);

  const hubOutcome = useMemo(() => {
    if (loadError) return "error" as const;
    if (!rows.length) return "empty" as const;
    return flashcardBodySystemsUiOutcomeFromParsed({
      ok: true,
      summary: null,
      categoryOptions: rows.filter((r) => r.count > 0),
    });
  }, [rows, loadError]);

  const examContext =
    pathwayDisplayName.trim() === scopedPathwayId ? pathwayDisplayName : `${pathwayDisplayName} · ${scopedPathwayId}`;

  return (
    <div className="space-y-6">
      <div className="nn-learner-page-hero">
        <nav className="mb-2 text-xs font-medium text-[var(--semantic-text-secondary)]" aria-label="Study">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link className="text-primary underline" href="/app/dashboard">
                {t("dashboard.breadcrumbDashboard")}
              </Link>
            </li>
            <li aria-hidden> / </li>
            <li>
              <Link className="text-primary underline" href={`/app/lessons?pathwayId=${encodeURIComponent(scopedPathwayId)}`}>
                {t("learner.profile.quickLinks.lessons")}
              </Link>
            </li>
            <li aria-hidden> / </li>
            <li className="text-[var(--semantic-text-primary)]">{t("learner.flashcards.hub.title")}</li>
          </ol>
        </nav>
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)] sm:text-[1.7rem]">
          {t("learner.flashcards.hub.title")}
        </h1>
        <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("learner.flashcards.hub.subtitle")}</p>
        <p className="mt-1 text-sm font-medium text-[var(--semantic-text-primary)]">{examContext}</p>
      </div>

      {pathwayBootstrapSource === "secondary" ? <LearnerStudyLiveSyncBanner /> : null}

      {loadError ? (
        <ContentEmptyState
          variant="generic"
          headline="Could not load flashcards"
          body={loadError}
          primaryCta={{ label: "Retry", href: `/app/flashcards?pathwayId=${encodeURIComponent(scopedPathwayId)}` }}
        />
      ) : null}

      <section className="nn-card border-[var(--semantic-border-soft)] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-6" aria-labelledby="fc-mode-heading">
        <h2 id="fc-mode-heading" className="text-sm font-semibold text-[var(--semantic-text-primary)]">
          Study mode
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["all", "All cards"],
              ["weak", "Weak areas"],
              ["starred", "Starred"],
              ["incorrect", "Recently missed"],
              ["unstudied", "Unstudied"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              data-testid={`flashcards-hub-mode-${m}`}
              onClick={() => setMode(m)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === m
                  ? "border-[var(--semantic-brand)] bg-[var(--semantic-panel-cool)] text-[var(--semantic-text-primary)]"
                  : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === "weak" && weakTotal === 0 ? (
          <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]" data-testid="flashcards-hub-empty-weak">
            No weak-area cards yet. Study cards first to build weak areas.
          </p>
        ) : null}
        {mode === "starred" && starredPathwayTotal === 0 ? (
          <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]" data-testid="flashcards-hub-empty-starred">
            No starred cards yet for this pathway.
          </p>
        ) : null}
      </section>

      <section className="space-y-3" aria-labelledby="fc-systems-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="fc-systems-heading" className="text-lg font-semibold text-[var(--semantic-text-primary)]">
              {t("learner.flashcards.hub.bodySystemsHeading")}
            </h2>
            <p className="text-xs text-[var(--semantic-text-secondary)]">
              {selectedSystems.length === 0
                ? "All systems selected"
                : `${selectedSystems.length} system${selectedSystems.length === 1 ? "" : "s"} selected`}
              {" · "}
              {deckMatchingEstimate} card{deckMatchingEstimate === 1 ? "" : "s"} in scope
            </p>
          </div>
          {selectedSystems.length > 0 ? (
            <button
              type="button"
              className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
              onClick={clearSystems}
            >
              All systems
            </button>
          ) : null}
        </div>

        <label className="block text-xs font-medium text-[var(--semantic-text-secondary)]" htmlFor="fc-hub-search">
          Search systems
        </label>
        <input
          id="fc-hub-search"
          type="search"
          className="nn-input mt-1 w-full max-w-xl rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-3 py-2 text-sm text-[var(--semantic-text-primary)]"
          placeholder="Filter by name…"
          value={searchParams.get("q") ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            const qs = new URLSearchParams(searchParams.toString());
            if (v.trim()) qs.set("q", v.trim());
            else qs.delete("q");
            router.replace(`/app/flashcards?${qs}`, { scroll: false });
          }}
        />

        <ul className="mt-4 grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="flashcards-hub-system-grid">
          {filteredRows.map((c) => {
            const active = selectedSystems.length === 0 || selectedSystems.includes(c.id);
            const countLabel = `${c.count} card${c.count === 1 ? "" : "s"}`;
            return (
              <li key={c.id}>
                <div
                  data-testid={`flashcards-hub-system-${c.id}`}
                  className={`flex h-full flex-col rounded-xl border p-4 text-left transition-colors ${
                    active
                      ? "border-[var(--semantic-info)] bg-[var(--semantic-panel-cool)] ring-1 ring-[var(--semantic-info)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] opacity-80"
                  }`}
                >
                  <div className="font-semibold text-[var(--semantic-text-primary)]">{formatTitleCase(c.title)}</div>
                  <div className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{countLabel}</div>
                  {c.description ? (
                    <p className="mt-2 line-clamp-2 text-xs text-[var(--semantic-text-secondary)]">{c.description}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full bg-[var(--semantic-brand)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-inverted)]"
                      onClick={() => selectOnlySystem(c.id)}
                    >
                      This system only
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-primary)]"
                      onClick={() => toggleSystem(c.id)}
                    >
                      {active && selectedSystems.length > 0 ? "Toggle off" : "Toggle in mix"}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {hubOutcome === "empty" && !loadError ? (
          <p className="text-sm text-[var(--semantic-text-secondary)]">No flashcards are published for this pathway yet.</p>
        ) : null}

        {filteredRows.length === 0 && rows.length > 0 ? (
          <p className="text-sm text-[var(--semantic-text-secondary)]">No systems match your search.</p>
        ) : null}

        {deckMatchingEstimate === 0 && rows.some((r) => r.count > 0) ? (
          <p className="text-sm text-[var(--semantic-warning)]" data-testid="flashcards-hub-empty-selection">
            No flashcards found for the selected systems.
          </p>
        ) : null}
      </section>

      <div className="sticky bottom-0 z-10 border-t border-[var(--semantic-border-soft)] bg-[var(--theme-app-bg)] py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-[var(--semantic-text-secondary)]">
            {studyHref ? (
              <span>
                Ready to study up to 50 cards
                {mode !== "all" ? ` (${mode})` : ""}.
              </span>
            ) : (
              <span>Adjust your selection or mode to start studying.</span>
            )}
          </div>
          {studyHref ? (
            <Link
              data-testid="flashcards-hub-start-study"
              href={studyHref}
              className="inline-flex min-h-[3rem] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-8 text-sm font-semibold text-[var(--semantic-text-inverted)]"
            >
              Start studying
            </Link>
          ) : (
            <span className="text-sm text-[var(--semantic-text-muted)]">Start studying</span>
          )}
        </div>
      </div>

      {catHref ? (
        <LearnerStudyQuickLinksCard
          t={t}
          id="flashcards-study-quick-links"
          catHref={catHref}
          flashcardsHrefOverride={buildAppFlashcardsHubHref({ pathwayId: scopedPathwayId })}
        />
      ) : null}
    </div>
  );
}
