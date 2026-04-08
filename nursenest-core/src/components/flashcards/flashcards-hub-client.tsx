"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { asArray } from "@/lib/runtime/collections";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type TagRow = { slug: string; name: string };

type DeckRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  country: string;
  tier: string;
  examFamily: string;
  pathwayId: string | null;
  visibility: string;
  cardCount: number;
  locked: boolean;
  tags?: TagRow[];
};

type Stats = {
  currentStreak: number;
  longestStreak: number;
  cardsReviewedTotal: number;
  lastStudyDate: string | null;
};

type DueSummary = {
  dueToday: number;
  overdue: number;
  learning: number;
  asOf?: string;
};

const EXAM_FAMILIES = ["NCLEX_RN", "NCLEX_PN", "REX_PN", "AANP", "GENERIC"] as const;

export function FlashcardsHubClient({
  pathwayOptions = [],
}: {
  pathwayOptions?: { id: string; label: string }[];
}) {
  const { t } = useMarketingI18n();
  const router = useRouter();
  const urlParams = useSearchParams();
  const pathwayId = urlParams.get("pathwayId") ?? "";
  const examFamily = urlParams.get("examFamily") ?? "";
  const tagSlug = urlParams.get("tagSlug") ?? "";
  const topicCode = urlParams.get("topicCode") ?? "";
  const q = urlParams.get("q") ?? "";
  const pageFromUrl = urlParams.get("page") ?? "1";
  const [searchDraft, setSearchDraft] = useState(q);

  useEffect(() => {
    setSearchDraft(q);
  }, [q]);

  const [decks, setDecks] = useState<DeckRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [dueSummary, setDueSummary] = useState<DueSummary | null>(null);
  const [tagList, setTagList] = useState<TagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/public/flashcard-tags", { credentials: "include" });
        if (!res.ok) return;
        const j = (await res.json()) as { tags?: TagRow[] };
        setTagList(asArray(j.tags));
      } catch {
        setTagList([]);
      }
    })();
  }, []);

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ page: String(p), pageSize: "18" });
        if (pathwayId) qs.set("pathwayId", pathwayId);
        if (examFamily) qs.set("examFamily", examFamily);
        if (tagSlug) qs.set("tagSlug", tagSlug);
        if (topicCode) qs.set("topicCode", topicCode);
        const qTrim = q.trim();
        if (qTrim.length >= 2) qs.set("q", qTrim);
        const [dRes, sRes, dueRes] = await Promise.all([
          fetch(`/api/flashcards/decks?${qs.toString()}`, { credentials: "include" }),
          fetch("/api/flashcards/stats", { credentials: "include" }).catch(() => null),
          fetch("/api/flashcards/due-summary", { credentials: "include" }).catch(() => null),
        ]);
        const dJson = (await dRes.json()) as { decks?: DeckRow[]; error?: string; page?: number; pageCount?: number };
        if (!dRes.ok) throw new Error(dJson.error ?? t("learner.flashcards.hub.loadDecksFailed"));
        setDecks(asArray(dJson.decks));
        setPage(dJson.page ?? 1);
        setTotalPages(dJson.pageCount ?? 1);
        if (sRes?.ok) {
          const sJson = await sRes.json();
          setStats(sJson);
        } else {
          setStats(null);
        }
        if (dueRes?.ok) {
          const j = (await dueRes.json()) as DueSummary;
          setDueSummary(j);
        } else {
          setDueSummary(null);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : t("learner.error.app.title"));
        setDecks([]);
      } finally {
        setLoading(false);
      }
    },
    [pathwayId, examFamily, tagSlug, topicCode, q, t],
  );

  useEffect(() => {
    const p = Number(pageFromUrl);
    void load(Number.isFinite(p) && p >= 1 ? p : 1);
  }, [load, pageFromUrl, pathwayId, examFamily, tagSlug, topicCode]);

  const setFilters = (next: {
    pathwayId?: string;
    examFamily?: string;
    tagSlug?: string;
    q?: string;
  }) => {
    const qs = new URLSearchParams(urlParams.toString());
    qs.delete("page");
    if (next.pathwayId !== undefined) {
      if (next.pathwayId) qs.set("pathwayId", next.pathwayId);
      else qs.delete("pathwayId");
    }
    if (next.examFamily !== undefined) {
      if (next.examFamily) qs.set("examFamily", next.examFamily);
      else qs.delete("examFamily");
    }
    if (next.tagSlug !== undefined) {
      if (next.tagSlug) qs.set("tagSlug", next.tagSlug);
      else qs.delete("tagSlug");
    }
    if (next.q !== undefined) {
      const qNext = next.q.trim();
      if (qNext.length >= 2) qs.set("q", qNext);
      else qs.delete("q");
    }
    router.replace(`/app/flashcards?${qs.toString()}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">{t("learner.flashcards.hub.title")}</h1>
      <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{t("learner.flashcards.hub.subtitle")}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/app/flashcards/weak-areas"
          className="inline-flex rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground"
        >
          {t("learner.flashcards.hub.weakAreasCta")}
        </Link>
        <Link
          href="/flashcards"
          className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
        >
          {t("learner.flashcards.hub.publicSeoCta")}
        </Link>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-4 sm:grid-cols-2">
        <label className="block text-xs font-semibold text-[var(--theme-muted-text)]">
          {t("learner.flashcards.hub.filterPathway")}
          <select
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
            value={pathwayId}
            onChange={(e) => setFilters({ pathwayId: e.target.value })}
          >
            <option value="">{t("learner.flashcards.hub.pathwayAll")}</option>
            {pathwayOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold text-[var(--theme-muted-text)]">
          {t("learner.flashcards.hub.filterExamFamily")}
          <select
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
            value={examFamily}
            onChange={(e) => setFilters({ examFamily: e.target.value })}
          >
            <option value="">{t("learner.flashcards.hub.examFamilyAll")}</option>
            {EXAM_FAMILIES.map((ef) => (
              <option key={ef} value={ef}>
                {ef.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold text-[var(--theme-muted-text)] sm:col-span-2">
          {t("learner.flashcards.hub.topicTag")}
          <select
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
            value={tagSlug}
            onChange={(e) => setFilters({ tagSlug: e.target.value })}
          >
            <option value="">{t("learner.flashcards.hub.allTags")}</option>
            {tagList.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold text-[var(--theme-muted-text)] sm:col-span-2">
          {t("learner.flashcards.hub.searchDecksLabel")}
          <div className="mt-1 flex gap-2">
            <input
              type="search"
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder={t("learner.flashcards.hub.searchPlaceholder")}
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setFilters({ q: searchDraft });
              }}
            />
            <button
              type="button"
              className="shrink-0 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted/50"
              onClick={() => setFilters({ q: searchDraft })}
            >
              {t("learner.flashcards.hub.search")}
            </button>
          </div>
        </label>
      </div>

      {dueSummary && (dueSummary.dueToday > 0 || dueSummary.overdue > 0 || dueSummary.learning > 0) ? (
        <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-role-cta/25 bg-role-cta-soft p-4 text-center">
          <div>
            <p className="text-2xl font-bold tabular-nums text-primary">{dueSummary.dueToday}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">{t("learner.flashcards.hub.dueToday")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{dueSummary.overdue}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">{t("learner.flashcards.hub.overdue")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{dueSummary.learning}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">{t("learner.flashcards.hub.learning")}</p>
          </div>
        </div>
      ) : null}

      {stats && (stats.currentStreak > 0 || stats.cardsReviewedTotal > 0) ? (
        <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-4 text-center">
          <div>
            <p className="text-2xl font-bold tabular-nums text-primary">{stats.currentStreak}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">{t("learner.flashcards.hub.dayStreak")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{stats.longestStreak}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">{t("learner.flashcards.hub.bestStreak")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{stats.cardsReviewedTotal}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">{t("learner.flashcards.hub.reviews")}</p>
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

      {loading ? <p className="mt-8 text-sm text-[var(--theme-muted-text)]">{t("learner.flashcards.hub.loadingDecks")}</p> : null}

      {!loading && decks.length === 0 && !error ? (
        <p className="mt-8 text-sm text-[var(--theme-muted-text)]">
          {t("learner.flashcards.hub.emptyPrefix")}{" "}
          <Link href="/app/questions" className="font-semibold text-primary underline">
            {t("learner.flashcards.hub.emptyLink")}
          </Link>
          .
        </p>
      ) : null}

      <ul className="mt-8 space-y-4">
        {decks.map((d) => (
          <li key={d.id} className="nn-card p-4 transition hover:border-primary/30">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {d.examFamily.replace(/_/g, " ")} · {d.country}
                  {d.pathwayId ? ` · ${t("learner.flashcards.hub.deckMetaPathway")}` : ""}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">{d.title}</h2>
                {d.description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--theme-muted-text)]">{d.description}</p>
                ) : null}
                {d.tags && d.tags.length > 0 ? (
                  <p className="mt-2 text-xs text-[var(--theme-muted-text)]">
                    {t("learner.flashcards.hub.tagsPrefix")}{" "}
                    {d.tags.map((t) => (
                      <span key={t.slug} className="mr-2 inline-block rounded-full bg-muted px-2 py-0.5">
                        {t.name}
                      </span>
                    ))}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-[var(--theme-muted-text)]">
                  {t("learner.flashcards.hub.cardsCount", { n: d.cardCount })}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                {d.locked ? (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {t("learner.flashcards.hub.subscriptionRequired")}
                  </span>
                ) : null}
                {d.locked ? (
                  <Link
                    href="/pricing"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)] transition hover:bg-role-cta-hover"
                  >
                    {t("learner.flashcards.hub.subscribeUnlock")}
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2 sm:items-end">
                    <Link
                      href={`/app/flashcards/${d.slug}`}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)] transition hover:bg-role-cta-hover"
                    >
                      {t("learner.flashcards.hub.study")}
                    </Link>
                    <Link
                      href={`/app/flashcards/${d.slug}?shuffle=1`}
                      className="text-center text-xs font-medium text-primary underline"
                    >
                      {t("learner.flashcards.hub.studyShuffled")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 ? (
        <nav className="mt-10 flex items-center justify-between text-sm" aria-label={t("learner.flashcards.hub.paginationAria")}>
          <button
            type="button"
            disabled={page <= 1 || loading}
            className="font-medium text-primary disabled:opacity-40"
            onClick={() => {
              const qs = new URLSearchParams(urlParams.toString());
              qs.set("page", String(page - 1));
              router.push(`/app/flashcards?${qs.toString()}`);
            }}
          >
            {t("learner.flashcards.hub.previous")}
          </button>
          <span className="text-[var(--theme-muted-text)]">
            {t("learner.flashcards.hub.pageOf", { page, total: totalPages })}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            className="font-medium text-primary disabled:opacity-40"
            onClick={() => {
              const qs = new URLSearchParams(urlParams.toString());
              qs.set("page", String(page + 1));
              router.push(`/app/flashcards?${qs.toString()}`);
            }}
          >
            {t("learner.flashcards.hub.next")}
          </button>
        </nav>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-2">
        <Link
          href="/app/questions"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/50"
        >
          {t("learner.flashcards.hub.bottomQuestionBank")}
        </Link>
        <Link
          href="/lessons"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/50"
        >
          {t("learner.flashcards.hub.bottomExamLessons")}
        </Link>
      </div>
    </div>
  );
}
