"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { buildMarketingPublicLivePageHref } from "@/lib/marketing/marketing-public-content-live-href";

type Slot = {
  messageKey: string;
  route: string;
  sectionKey: string;
  fieldKey: string;
  surface: string;
  maxLen: number;
  seoTitleMaxLen?: number;
  seoDescriptionMaxLen?: number;
  /** From GET API; catalog default for diagnostics + search. */
  defaultCatalogValue?: string;
};

type OverrideRow = {
  messageKey: string;
  value: string;
  draftValue: string | null;
  isPublished: boolean;
  updatedAt: string;
  publishedAt: string | null;
};

type Revision = {
  id: string;
  messageKey: string;
  locale: string;
  value: string;
  action: string;
  createdAt: string;
  actorUserId: string;
};

type ApiGet = {
  ok: boolean;
  locale: string;
  slots: Slot[];
  overrides: Record<string, OverrideRow>;
  revisions: Revision[];
};

async function postJson(body: unknown) {
  const res = await fetch("/api/admin/marketing-public-content", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
  if (!res.ok) throw new Error(json.error ?? `Request failed (${res.status})`);
  return json;
}

export function AdminPageCopyEditorClient() {
  const [locale, setLocale] = useState("en");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiGet | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => window.clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams({ locale });
      if (debouncedSearch) q.set("messageKey", debouncedSearch);
      const res = await fetch(`/api/admin/marketing-public-content?${q.toString()}`, {
        credentials: "same-origin",
      });
      const json = (await res.json()) as ApiGet & { error?: string };
      if (!res.ok) throw new Error(json.error ?? `Load failed (${res.status})`);
      setData(json);
      setSelectedKey((prev) => (prev && !json.slots.some((s) => s.messageKey === prev) ? null : prev));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [locale, debouncedSearch]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedSlot = useMemo(
    () => data?.slots.find((s) => s.messageKey === selectedKey) ?? null,
    [data, selectedKey],
  );

  const selectedOverride = selectedKey && data?.overrides ? data.overrides[selectedKey] : undefined;

  const revisionCountForSelected = useMemo(() => {
    if (!selectedKey || !data?.revisions) return 0;
    return data.revisions.filter((r) => r.messageKey === selectedKey).length;
  }, [data?.revisions, selectedKey]);

  const livePageHref = useMemo(() => {
    if (!selectedSlot) return "/";
    return buildMarketingPublicLivePageHref(locale, selectedSlot.route);
  }, [locale, selectedSlot]);

  const previewHref = useMemo(() => {
    if (!selectedKey) return "/admin/content/page-copy/preview";
    const q = new URLSearchParams({ messageKey: selectedKey, locale });
    return `/admin/content/page-copy/preview?${q.toString()}`;
  }, [locale, selectedKey]);

  useEffect(() => {
    if (!selectedKey) {
      setDraftText("");
      return;
    }
    const o = data?.overrides?.[selectedKey];
    setDraftText((o?.draftValue ?? "").length > 0 ? (o?.draftValue ?? "") : o?.value ?? "");
  }, [selectedKey, data]);

  const onSaveDraft = async () => {
    if (!selectedKey) return;
    setBusy(true);
    setStatus(null);
    try {
      await postJson({ action: "save_draft", messageKey: selectedKey, locale, value: draftText });
      setStatus("Draft saved.");
      await load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const onPublishDraft = async () => {
    if (!selectedKey) return;
    setBusy(true);
    setStatus(null);
    try {
      await postJson({ action: "publish_draft", messageKey: selectedKey, locale });
      setStatus("Published to live site.");
      await load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setBusy(false);
    }
  };

  const onDiscardDraft = async () => {
    if (!selectedKey) return;
    setBusy(true);
    setStatus(null);
    try {
      await postJson({ action: "discard_draft", messageKey: selectedKey, locale });
      setStatus("Draft discarded.");
      await load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Discard failed");
    } finally {
      setBusy(false);
    }
  };

  const onPublishImmediate = async () => {
    if (!selectedKey) return;
    setBusy(true);
    setStatus(null);
    try {
      await postJson({ action: "upsert", messageKey: selectedKey, locale, value: draftText });
      setStatus("Published immediately.");
      await load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setBusy(false);
    }
  };

  const onRevert = async () => {
    if (!selectedKey) return;
    if (!window.confirm("Remove published override and revert to catalog default for this key?")) return;
    setBusy(true);
    setStatus(null);
    try {
      await postJson({ action: "reset", messageKey: selectedKey, locale });
      setStatus("Reverted to default.");
      await load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Revert failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Locale
            <select
              className="rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value="en">en</option>
              <option value="fr">fr</option>
              <option value="es">es</option>
              <option value="de">de</option>
              <option value="tl">tl</option>
            </select>
          </label>
          <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-xs font-medium text-muted-foreground">
            Search route, section, field, message key, or visible default copy
            <input
              className="rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. hero, /pricing, pages.home"
            />
          </label>
          <button
            type="button"
            className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm font-medium hover:bg-muted"
            onClick={() => void load()}
          >
            Refresh
          </button>
        </div>

        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
        {error ? (
          <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-900 dark:text-rose-100">
            {error}
          </p>
        ) : null}

        <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)]">
          <div className="border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Editable slots ({data?.slots.length ?? 0})
          </div>
          <ul className="max-h-[32rem] divide-y divide-border/60 overflow-y-auto text-sm">
            {(data?.slots ?? []).map((s) => {
              const o = data?.overrides[s.messageKey];
              const active = selectedKey === s.messageKey;
              return (
                <li key={s.messageKey}>
                  <button
                    type="button"
                    onClick={() => setSelectedKey(s.messageKey)}
                    className={`flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-muted/50 ${
                      active ? "bg-primary/10" : ""
                    }`}
                  >
                    <span className="font-mono text-[11px] text-muted-foreground">{s.messageKey}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.route} · {s.sectionKey} · {s.fieldKey}
                    </span>
                    {o?.draftValue ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Draft staged
                      </span>
                    ) : o?.isPublished ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Live override
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Catalog default</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
          <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">Reported copy issues</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Run the UI copy audit locally to surface dotted i18n keys and awkward labels:{" "}
            <code className="rounded bg-muted px-1">npm run audit:ui-copy</code> (repo root). Fix allowlisted keys
            here; new surfaces require a code change to{" "}
            <code className="rounded bg-muted px-1">MARKETING_PUBLIC_CONTENT_EDITABLE_KEYS</code> for safety.
          </p>
        </section>
      </div>

      <div className="space-y-4">
        {!selectedSlot ? (
          <p className="text-sm text-muted-foreground">Select a slot to edit draft or publish.</p>
        ) : (
          <>
            <div>
              <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Editor</h2>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{selectedSlot.messageKey}</p>
              <p className="text-xs text-muted-foreground">
                Max {selectedSlot.maxLen} chars
                {selectedSlot.seoTitleMaxLen
                  ? ` · SEO title soft cap ${selectedSlot.seoTitleMaxLen}`
                  : selectedSlot.seoDescriptionMaxLen
                    ? ` · SEO description soft cap ${selectedSlot.seoDescriptionMaxLen}`
                    : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <Link
                  href={previewHref}
                  className="font-semibold text-primary underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open staged preview
                </Link>
                <a
                  href={livePageHref}
                  className="font-semibold text-primary underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open live page ↗
                </a>
              </div>
            </div>

            <section className="rounded-xl border border-border/70 bg-muted/10 p-4">
              <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Copy slot preview diagnostics</h3>
              <dl className="mt-3 grid gap-2 text-xs text-muted-foreground">
                <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-medium text-foreground">Route</dt>
                  <dd className="font-mono">{selectedSlot.route}</dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-medium text-foreground">Locale</dt>
                  <dd>{locale}</dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-medium text-foreground">Message key</dt>
                  <dd className="break-all font-mono">{selectedSlot.messageKey}</dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-medium text-foreground">Default (catalog)</dt>
                  <dd className="whitespace-pre-wrap break-words">{selectedSlot.defaultCatalogValue ?? "—"}</dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-medium text-foreground">Draft (staged)</dt>
                  <dd className="whitespace-pre-wrap break-words">{selectedOverride?.draftValue ?? "—"}</dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-medium text-foreground">Published (live DB)</dt>
                  <dd className="whitespace-pre-wrap break-words">
                    {selectedOverride?.isPublished ? selectedOverride.value || "—" : "—"}
                  </dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-medium text-foreground">Last published (UTC)</dt>
                  <dd>
                    {selectedOverride?.publishedAt
                      ? new Date(selectedOverride.publishedAt).toISOString()
                      : "—"}
                  </dd>
                </div>
                <div className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-medium text-foreground">Revision rows (loaded)</dt>
                  <dd>{revisionCountForSelected}</dd>
                </div>
              </dl>
            </section>

            <label className="block space-y-2 text-sm">
              <span className="font-medium text-foreground">Draft / live text</span>
              <textarea
                className="min-h-[10rem] w-full rounded-lg border border-border bg-[var(--theme-card-bg)] p-3 text-sm"
                value={draftText}
                maxLength={selectedSlot.maxLen}
                onChange={(e) => setDraftText(e.target.value)}
              />
            </label>

            {selectedOverride ? (
              <dl className="grid gap-2 text-xs text-muted-foreground">
                <div>
                  <dt className="font-semibold text-foreground">Published value (live)</dt>
                  <dd className="mt-1 whitespace-pre-wrap rounded border border-border/60 bg-muted/20 p-2">
                    {selectedOverride.isPublished ? selectedOverride.value || "—" : "— (not published)"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Staged draft</dt>
                  <dd className="mt-1 whitespace-pre-wrap rounded border border-border/60 bg-muted/20 p-2">
                    {selectedOverride.draftValue ?? "—"}
                  </dd>
                </div>
              </dl>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                onClick={() => void onSaveDraft()}
              >
                Save draft
              </button>
              <button
                type="button"
                disabled={busy}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold disabled:opacity-50"
                onClick={() => void onPublishDraft()}
              >
                Publish draft
              </button>
              <button
                type="button"
                disabled={busy}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium disabled:opacity-50"
                onClick={() => void onDiscardDraft()}
              >
                Discard draft
              </button>
              <button
                type="button"
                disabled={busy}
                className="rounded-lg border border-primary/40 px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50"
                onClick={() => void onPublishImmediate()}
              >
                Publish now
              </button>
              <button
                type="button"
                disabled={busy}
                className="rounded-lg border border-rose-500/40 px-4 py-2 text-sm font-medium text-rose-800 disabled:opacity-50 dark:text-rose-100"
                onClick={() => void onRevert()}
              >
                Revert to default
              </button>
            </div>

            {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}

            <section className="rounded-xl border border-border/70 bg-muted/10 p-4">
              <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Recent revisions</h3>
              <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto text-xs text-muted-foreground">
                {(data?.revisions ?? [])
                  .filter((r) => r.messageKey === selectedKey)
                  .slice(0, 12)
                  .map((r) => (
                    <li key={r.id} className="rounded border border-border/40 bg-[var(--theme-card-bg)] p-2">
                      <div className="font-mono text-[10px] text-foreground">{r.action}</div>
                      <div>{new Date(r.createdAt).toLocaleString()}</div>
                      <div className="mt-1 line-clamp-3 whitespace-pre-wrap">{r.value}</div>
                    </li>
                  ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
