"use client";

import { useCallback, useMemo, useState } from "react";
import { AlertTriangle, Loader2, Play, Search } from "lucide-react";

type BlogOperation =
  | "blog_seo_bundle_refresh"
  | "blog_seo_columns_force"
  | "blog_seo_columns_fill_missing"
  | "blog_publish"
  | "blog_unpublish_draft"
  | "blog_assign_taxonomy"
  | "blog_metadata_backfill_light";

const OPERATIONS: { id: BlogOperation; label: string; hint: string }[] = [
  {
    id: "blog_seo_bundle_refresh",
    label: "Refresh SEO bundle (JSON plan)",
    hint: "Rebuilds internalLinkPlan SEO + related posts; does not overwrite manual seoTitle/seoDescription unless you pick “force columns”.",
  },
  {
    id: "blog_seo_columns_force",
    label: "Regenerate SEO + overwrite SERP columns",
    hint: "Explicit overwrite of seoTitle / seoDescription / meta variants (manual edits lost).",
  },
  {
    id: "blog_seo_columns_fill_missing",
    label: "Fill missing SERP fields only",
    hint: "Writes deterministic titles/descriptions only when a field is empty.",
  },
  { id: "blog_publish", label: "Publish (status → PUBLISHED)", hint: "Immediate visibility rules still apply downstream." },
  { id: "blog_unpublish_draft", label: "Unpublish (status → DRAFT)", hint: "Hides posts from public lists that respect draft status." },
  {
    id: "blog_assign_taxonomy",
    label: "Assign category / tags",
    hint: "Replace or append tags; optional category (include JSON null to clear on replace).",
  },
  {
    id: "blog_metadata_backfill_light",
    label: "Backfill light metadata",
    hint: "Fills empty targetKeyword / keywordCluster from title+category only.",
  },
];

function parseSlugList(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function AdminContentBulkClient() {
  const [tab, setTab] = useState<"blog" | "utility">("blog");
  const [operation, setOperation] = useState<BlogOperation>("blog_seo_bundle_refresh");
  const [slugs, setSlugs] = useState("");
  const [exam, setExam] = useState("");
  const [statusDraft, setStatusDraft] = useState(false);
  const [statusPublished, setStatusPublished] = useState(false);
  const [missingSerpOnly, setMissingSerpOnly] = useState(false);
  const [maxPosts, setMaxPosts] = useState("200");
  const [taxonomyTags, setTaxonomyTags] = useState("");
  const [taxonomyCategory, setTaxonomyCategory] = useState("");
  const [taxonomyMode, setTaxonomyMode] = useState<"replace" | "append">("replace");
  const [previewJson, setPreviewJson] = useState<string>("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmWrites, setConfirmWrites] = useState(false);

  const filters = useMemo(() => {
    const slugList = parseSlugList(slugs);
    const postStatusIn: ("DRAFT" | "PUBLISHED")[] = [];
    if (statusDraft) postStatusIn.push("DRAFT");
    if (statusPublished) postStatusIn.push("PUBLISHED");
    const f: Record<string, unknown> = {};
    if (slugList.length) f.slugs = slugList;
    if (exam.trim()) f.exam = exam.trim();
    if (postStatusIn.length) f.postStatusIn = postStatusIn;
    if (missingSerpOnly) f.missingSerpFieldsOnly = true;
    const mp = Number(maxPosts);
    if (Number.isFinite(mp) && mp >= 1) f.maxPosts = Math.min(500, Math.floor(mp));
    return f;
  }, [slugs, exam, statusDraft, statusPublished, missingSerpOnly, maxPosts]);

  const taxonomyPayload = useMemo(() => {
    if (operation !== "blog_assign_taxonomy") return undefined;
    const tags = parseSlugList(taxonomyTags);
    const out: { tags: string[]; mode: "replace" | "append"; category?: string | null } = {
      tags,
      mode: taxonomyMode,
    };
    const cat = taxonomyCategory.trim();
    if (cat === "__NULL__") out.category = null;
    else if (cat.length > 0) out.category = cat;
    return out;
  }, [operation, taxonomyTags, taxonomyCategory, taxonomyMode]);

  const runBlogPreview = useCallback(async () => {
    setBusy("preview");
    setError(null);
    try {
      const res = await fetch("/api/admin/content-bulk/preview", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: "blog",
          blog: {
            operation,
            filters,
            ...(operation === "blog_assign_taxonomy" ? { taxonomy: taxonomyPayload } : {}),
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? `Preview failed (${res.status})`);
        setPreviewJson(JSON.stringify(json, null, 2));
        return;
      }
      setPreviewJson(JSON.stringify(json, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }, [operation, filters, taxonomyPayload]);

  const runBlogEnqueue = useCallback(async () => {
    if (!confirmWrites) {
      setError("Check the confirmation box before enqueueing writes.");
      return;
    }
    setBusy("enqueue");
    setError(null);
    try {
      const res = await fetch("/api/admin/content-bulk/enqueue", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirm: true,
          scope: "blog",
          blog: {
            operation,
            filters,
            confirmation: "CONFIRM_BULK_WRITE",
            ...(operation === "blog_assign_taxonomy" ? { taxonomy: taxonomyPayload } : {}),
          },
        }),
      });
      const json = await res.json();
      setPreviewJson(JSON.stringify(json, null, 2));
      if (!res.ok || !json.ok) {
        setError(json.error ?? `Enqueue failed (${res.status})`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }, [confirmWrites, operation, filters, taxonomyPayload]);

  const runUtil = useCallback(async (mode: "preview" | "enqueue", kind: "sitemap_revalidate" | "question_stem_hashes") => {
    setBusy(mode === "preview" ? "util_preview" : `util_enqueue:${kind}`);
    setError(null);
    try {
      const path = mode === "preview" ? "/api/admin/content-bulk/preview" : "/api/admin/content-bulk/enqueue";
      const body =
        mode === "preview"
          ? { scope: "utility", utility: { kind } }
          : {
              confirm: true,
              scope: "utility",
              utility: { kind, confirmation: "CONFIRM_BULK_WRITE" as const },
            };
      const res = await fetch(path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      setPreviewJson(JSON.stringify(json, null, 2));
      if (!res.ok) setError(json.error ?? `${res.status}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }, []);

  const filterValid =
    parseSlugList(slugs).length > 0 ||
    exam.trim().length > 0 ||
    statusDraft ||
    statusPublished ||
    missingSerpOnly;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_6%,transparent)] p-1">
        <button
          type="button"
          className={`rounded-md px-3 py-2 text-sm font-semibold ${
            tab === "blog" ? "bg-[var(--semantic-info)]/15 text-[var(--semantic-info)]" : "text-muted-foreground"
          }`}
          onClick={() => setTab("blog")}
        >
          Blog bulk
        </button>
        <button
          type="button"
          className={`rounded-md px-3 py-2 text-sm font-semibold ${
            tab === "utility" ? "bg-[var(--semantic-info)]/15 text-[var(--semantic-info)]" : "text-muted-foreground"
          }`}
          onClick={() => setTab("utility")}
        >
          SEO / questions utilities
        </button>
      </div>

      {tab === "blog" ? (
        <section className="space-y-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,transparent)] bg-card p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Blog targets & operation</h2>
          <p className="text-sm text-muted-foreground">
            Always run <strong>Preview</strong> first (dry run). Enqueue sends chunked background jobs — processing
            depends on the job worker (cron or super-admin <code className="text-xs">ops/run</code> →{" "}
            <code className="text-xs">run_job_worker</code>). Logs appear under{" "}
            <a className="text-primary underline" href="/admin/automation-logs">
              Automation logs
            </a>
            .
          </p>

          <label className="block text-sm font-medium">Operation</label>
          <select
            className="w-full max-w-xl rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={operation}
            onChange={(e) => setOperation(e.target.value as BlogOperation)}
          >
            {OPERATIONS.map((op) => (
              <option key={op.id} value={op.id}>
                {op.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">{OPERATIONS.find((o) => o.id === operation)?.hint}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Slugs (comma or newline)</label>
              <textarea
                className="mt-1 min-h-[88px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs"
                value={slugs}
                onChange={(e) => setSlugs(e.target.value)}
                placeholder="my-post-slug&#10;another-slug"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Exam filter (optional)</label>
                <input
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  placeholder="RN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Max posts (cap)</label>
                <input
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={maxPosts}
                  onChange={(e) => setMaxPosts(e.target.value)}
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          <fieldset className="flex flex-wrap gap-4 text-sm">
            <legend className="sr-only">Post status filters</legend>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={statusDraft} onChange={(e) => setStatusDraft(e.target.checked)} />
              Include DRAFT
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={statusPublished} onChange={(e) => setStatusPublished(e.target.checked)} />
              Include PUBLISHED
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={missingSerpOnly}
                onChange={(e) => setMissingSerpOnly(e.target.checked)}
              />
              Missing SERP fields only
            </label>
          </fieldset>

          {!filterValid ? (
            <p className="flex items-center gap-2 text-sm text-[var(--semantic-warning)]">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Provide at least one filter: slugs, exam, a post status, or “missing SERP only”.
            </p>
          ) : null}

          {operation === "blog_assign_taxonomy" ? (
            <div className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_5%,transparent)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Taxonomy</p>
              <div>
                <label className="text-sm font-medium">Tags (comma / newline)</label>
                <textarea
                  className="mt-1 min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={taxonomyTags}
                  onChange={(e) => setTaxonomyTags(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category (optional)</label>
                <input
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={taxonomyCategory}
                  onChange={(e) => setTaxonomyCategory(e.target.value)}
                  placeholder='Type __NULL__ to clear category (replace mode)'
                />
              </div>
              <label className="text-sm font-medium">Mode</label>
              <select
                className="mt-1 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={taxonomyMode}
                onChange={(e) => setTaxonomyMode(e.target.value as "replace" | "append")}
              >
                <option value="replace">Replace tags</option>
                <option value="append">Append tags</option>
              </select>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={confirmWrites} onChange={(e) => setConfirmWrites(e.target.checked)} />I
              understand writes enqueue to production data paths.
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!filterValid || busy !== null}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--semantic-info)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              onClick={() => void runBlogPreview()}
            >
              {busy === "preview" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Preview (dry run)
            </button>
            <button
              type="button"
              disabled={!filterValid || !confirmWrites || busy !== null}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--semantic-brand)] px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              onClick={() => void runBlogEnqueue()}
            >
              {busy === "enqueue" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Enqueue writes
            </button>
          </div>
        </section>
      ) : (
        <section className="space-y-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,transparent)] bg-card p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Utilities</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              <strong>Sitemap / publishing revalidate</strong> — one job calling{" "}
              <code className="text-xs">revalidateBlogPublishingSurfaces()</code>.
            </li>
            <li>
              <strong>Question stem hashes</strong> — queues the existing{" "}
              <code className="text-xs">content.recompute_stem_hashes</code> worker (bounded per run).
            </li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg border border-input px-3 py-2 text-sm font-semibold disabled:opacity-50"
              disabled={busy !== null}
              onClick={() => void runUtil("preview", "sitemap_revalidate")}
            >
              Preview sitemap job
            </button>
            <button
              type="button"
              className="rounded-lg border border-input px-3 py-2 text-sm font-semibold disabled:opacity-50"
              disabled={busy !== null}
              onClick={() => void runUtil("preview", "question_stem_hashes")}
            >
              Preview stem-hash queue
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={confirmWrites} onChange={(e) => setConfirmWrites(e.target.checked)} />
            Confirm enqueue for utilities
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!confirmWrites || busy !== null}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--semantic-brand)] px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              onClick={() => void runUtil("enqueue", "sitemap_revalidate")}
            >
              {busy === "util_enqueue:sitemap_revalidate" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Enqueue sitemap revalidate
            </button>
            <button
              type="button"
              disabled={!confirmWrites || busy !== null}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--semantic-chart-3)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              onClick={() => void runUtil("enqueue", "question_stem_hashes")}
            >
              {busy === "util_enqueue:question_stem_hashes" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Enqueue stem hashes
            </button>
          </div>
        </section>
      )}

      {error ? (
        <p className="rounded-md border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,transparent)] px-3 py-2 text-sm text-[var(--semantic-danger)]">
          {error}
        </p>
      ) : null}

      {previewJson ? (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Last response</h3>
          <pre className="max-h-[420px] overflow-auto rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed">
            {previewJson}
          </pre>
        </section>
      ) : null}
    </div>
  );
}
